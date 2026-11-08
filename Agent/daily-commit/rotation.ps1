# 每日 GitHub 提交 · 轮换计算与仓库健康检查（只读，不会修改任何仓库）
# 兼容 Windows PowerShell 5.1 与 PowerShell 7+
#
# 读取 config.json，按「距 2026-11-08 的天数 mod 仓库数」算出今天该做哪个仓库，
# 并逐个检查：是否 git 仓库、工作区是否干净、是否落后远端、今天是否已经有提交。
# 只做诊断，真正的修改/提交/推送由 agent 按 README.md 的流程执行。
#
# 用法：
#   powershell -ExecutionPolicy Bypass -File D:\AIforstudy\Agent\daily-commit\rotation.ps1
#   ... rotation.ps1 -Date 2026-11-12 -Json
[CmdletBinding()]
param(
  [Parameter()][datetime]$Date = (Get-Date),
  [Parameter()][switch]$Json,
  [Parameter()][switch]$Record,
  [Parameter()][switch]$Deep
)

$ErrorActionPreference = 'Stop'
$script:BaseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$configPath = Join-Path $script:BaseDir 'config.json'
$statePath = Join-Path $script:BaseDir 'state.json'

if (-not (Test-Path -LiteralPath $configPath)) {
  throw "找不到配置文件: $configPath"
}

$config = Get-Content -LiteralPath $configPath -Raw -Encoding UTF8 | ConvertFrom-Json
$repos = @($config.repos)
if ($repos.Count -eq 0) { throw 'config.json 里 repos 为空' }

# 轮换基准：2026-11-08 对应 repos[0]（OrangeVerse，首日已手动完成）。
# 第 0 天做 repos[0]，之后每天 index = (offset + 1) mod 仓库数，循环轮换。
$baseDate = [datetime]::new(2026, 11, 8)
$offset = [int](($Date.Date - $baseDate.Date).TotalDays)
$index = ($offset + 1) % $repos.Count
if ($index -lt 0) { $index += $repos.Count }
$target = $repos[$index]

$todayString = $Date.ToString('yyyy-MM-dd')
$previous = $null
if (Test-Path -LiteralPath $statePath) {
  try { $previous = Get-Content -LiteralPath $statePath -Raw -Encoding UTF8 | ConvertFrom-Json } catch { $previous = $null }
}

function Invoke-Git {
  param(
    [Parameter(Mandatory)][string]$RepoPath,
    [Parameter(Mandatory)][string[]]$Arguments
  )
  try {
    $output = & git -C $RepoPath @Arguments 2>&1
    return [pscustomobject]@{
      Ok    = ($LASTEXITCODE -eq 0)
      Code  = $LASTEXITCODE
      Lines = @($output | ForEach-Object { [string]$_ })
    }
  } catch {
    return [pscustomobject]@{ Ok = $false; Code = -1; Lines = @([string]$_) }
  }
}

function Invoke-GitWithTimeout {
  param(
    [Parameter(Mandatory)][string]$RepoPath,
    [Parameter(Mandatory)][string[]]$Arguments,
    [int]$TimeoutSec = 20
  )
  $job = Start-Job -ScriptBlock {
    param($RepoPath, $Arguments)
    $out = & git -C $RepoPath @Arguments 2>&1
    [pscustomobject]@{ Code = $LASTEXITCODE; Lines = @($out | ForEach-Object { [string]$_ }) }
  } -ArgumentList $RepoPath, $Arguments
  try {
    $null = Wait-Job -Job $job -Timeout $TimeoutSec
    if ($job.State -ne 'Completed') { return [pscustomobject]@{ Ok = $false; Code = -1; Lines = @('timeout') } }
    $r = Receive-Job -Job $job
    return [pscustomobject]@{ Ok = ($r.Code -eq 0); Code = $r.Code; Lines = @($r.Lines) }
  } finally {
    Remove-Job -Job $job -Force -ErrorAction SilentlyContinue
  }
}

$report = @()
foreach ($repo in $repos) {
  $path = [string]$repo.path
  $exists = Test-Path -LiteralPath $path
  $isRepo = $exists -and (Test-Path -LiteralPath (Join-Path $path '.git'))
  $clean = $null
  $localHead = $null
  $remoteHead = $null
  $behind = $null
  $todayCommits = $null
  $hasGitHubRemote = $false
  $notes = @()

  if (-not $exists) {
    $notes += '目录不存在'
  } elseif (-not $isRepo) {
    $notes += '不是 git 仓库'
  } else {
    $status = Invoke-Git -RepoPath $path -Arguments @('status', '--porcelain')
    $clean = $status.Ok -and ($status.Lines.Count -eq 0)
    if (-not $clean -and $status.Ok) { $notes += ("工作区有 {0} 处未提交改动" -f $status.Lines.Count) }

    $remoteList = Invoke-Git -RepoPath $path -Arguments @('remote', '-v')
    $hasGitHubRemote = @($remoteList.Lines | Where-Object { $_ -match 'github\.com[:/]xiaojuju11/' }).Count -gt 0
    if (-not $hasGitHubRemote) { $notes += '缺少指向 github.com/xiaojuju11 的远端' }

    $head = Invoke-Git -RepoPath $path -Arguments @('rev-parse', '--short', 'HEAD')
    if ($head.Ok) {
      $localHead = ($head.Lines | Select-Object -First 1).Trim()
    } else {
      $notes += '还没有任何提交 (HEAD 无效)'
    }

    if ($localHead) {
      $trackingRef = $null
      foreach ($candidate in @('github/main', 'origin/main')) {
        $probe = Invoke-Git -RepoPath $path -Arguments @('rev-parse', '--verify', '--quiet', "$candidate")
        if ($probe.Ok) { $trackingRef = $candidate; break }
      }
      if ($trackingRef) {
        $counts = Invoke-Git -RepoPath $path -Arguments @('rev-list', '--left-right', '--count', "$trackingRef...HEAD")
        if ($counts.Ok -and $counts.Lines.Count -gt 0) {
          $parts = ($counts.Lines[0].Trim() -split '\s+')
          if ($parts.Count -ge 2) { $behind = [int]$parts[0] }
        }
      }

      $since = "${todayString}T00:00:00+08:00"
      $commits = Invoke-Git -RepoPath $path -Arguments @('log', '--all', '--since', $since, '--oneline')
      if ($commits.Ok) { $todayCommits = $commits.Lines.Count }
    }

    if ($localHead -and $hasGitHubRemote -and $Deep) {
      foreach ($remoteName in @('github', 'origin')) {
        $ls = Invoke-GitWithTimeout -RepoPath $path -Arguments @('ls-remote', $remoteName, 'refs/heads/main') -TimeoutSec 20
        if ($ls.Ok -and $ls.Lines.Count -gt 0) {
          $remoteHead = ($ls.Lines[0] -split '\s+')[0]
          break
        }
      }
      if (-not $remoteHead) { $notes += '无法读取远端 main（网络或凭据）' }
    }
  }

  $report += [pscustomobject]@{
    date         = $todayString
    name         = [string]$repo.name
    path         = $path
    isToday      = ($repo.name -eq $target.name)
    index        = [int]$index
    exists       = $exists
    isRepo       = $isRepo
    clean        = $clean
    localHead    = $localHead
    remoteHead   = $remoteHead
    behind       = $behind
    todayCommits = $todayCommits
    hasGitHub    = $hasGitHubRemote
    notes        = $notes
  }
}

$todayTarget = $report | Where-Object { $_.isToday } | Select-Object -First 1
$todayAnyCommit = @($report | Where-Object { $null -ne $_.todayCommits -and $_.todayCommits -gt 0 }).Count -gt 0
$result = [pscustomobject]@{
  date           = $todayString
  dayOffset      = $offset
  rotationIndex  = $index
  rotationLength = $repos.Count
  todayRepo      = $target.name
  todayPath      = $target.path
  todayHasCommit = $todayAnyCommit
  todayTargetHasCommit = ($null -ne $todayTarget.todayCommits -and $todayTarget.todayCommits -gt 0)
  lastRun        = $previous
  repos          = $report
}

if ($Json) {
  $result | ConvertTo-Json -Depth 6
  return
}

# ── 人类可读输出 ─────────────────────────────────────────────────────────
Write-Host ''
Write-Host " 每日 GitHub 提交 · $todayString" -ForegroundColor Cyan
Write-Host (' ' + ('-' * 58)) -ForegroundColor DarkGray
$stateText = '无记录'
if ($previous -and $previous.date) { $stateText = ("{0} -> {1}" -f $previous.date, $previous.repo) }
$round = [math]::Floor($offset / $repos.Count) + 1
Write-Host (" 今天该做   : {0}  (第 {1} 轮, 索引 {2}/{3})" -f $target.name, $round, $index, $repos.Count) -ForegroundColor Green
Write-Host (" 本地路径   : {0}" -f $target.path) -ForegroundColor Gray
Write-Host (" 上次执行   : {0}" -f $stateText) -ForegroundColor Gray
if ($result.todayHasCommit) {
  Write-Host ' 今日状态   : 已有提交（今天不用重复做，除非还有别的改进）' -ForegroundColor Green
} else {
  Write-Host ' 今日状态   : 还没有提交 -> 需要执行今天的改动' -ForegroundColor Yellow
}
Write-Host ''

$view = @()
foreach ($r in $report) {
  $mark = '  '
  if ($r.isToday) { $mark = '->' }
  $cleanText = 'n/a'
  if ($r.clean -eq $true) { $cleanText = 'clean' } elseif ($r.clean -eq $false) { $cleanText = 'dirty' }
  $behindText = '?'
  if ($null -ne $r.behind) { $behindText = [string]$r.behind }
  $commitText = '?'
  if ($null -ne $r.todayCommits) { $commitText = [string]$r.todayCommits }
  $headText = '-'
  if ($r.localHead) { $headText = $r.localHead }
  $githubText = 'MISSING'
  if ($r.hasGitHub) { $githubText = 'ok' }
  $view += [pscustomobject]@{
    Mark       = $mark
    Repository = $r.name
    Clean      = $cleanText
    Behind     = $behindText
    Today      = $commitText
    Head       = $headText
    GitHub     = $githubText
    Note       = ($r.notes -join '; ')
  }
}
$view | Format-Table -AutoSize | Out-String | Write-Host

if ($todayTarget -and -not $todayTarget.exists) {
  Write-Host ("  目标仓库目录不存在，先 clone: git clone https://github.com/xiaojuju11/{0}.git {1}" -f $target.name, $target.path) -ForegroundColor Yellow
}
Write-Host ' 下一步: 按 README.md 第 1~6 步执行（同步 -> 改进 -> 验证 -> 提交 -> 推送 -> 回查）' -ForegroundColor DarkGray
Write-Host ''

# 记录本次执行（仅在 -Record 时写入；不改任何仓库，只写 state.json）
if ($Record) {
  $stateObject = [pscustomobject]@{
    date      = $todayString
    repo      = $target.name
    path      = $target.path
    index     = $index
    hasCommit = $todayAnyCommit
    recordedAt = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss zzz')
  }
  $stateObject | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $statePath -Encoding UTF8
  Write-Host (" 已记录到 state.json: {0} -> {1}" -f $todayString, $target.name) -ForegroundColor DarkCyan
}
