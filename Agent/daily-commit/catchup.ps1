# 每日 GitHub 提交 · 启动时的自动补课（catch-up）
# 兼容 Windows PowerShell 5.1 与 PowerShell 7+
#
# 背景：DSH 的定时提醒只在 App 打开时触发；如果 20:00 时 App 是关着的，
# 那一天就会被跳过。本脚本读 config.json / state.json / last-check.json，
# 找出「上次检查之后、今天之前」漏掉的天数，逐天算出当天的目标仓库，
# 打印成待办清单交给 agent 依次补做（不伪造提交，只提醒）。
#
# 用法：
#   powershell -ExecutionPolicy Bypass -File D:\AIforstudy\Agent\daily-commit\catchup.ps1
#   退出码 0 = 没有漏；2 = 有漏天，需要补
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$configPath = Join-Path $baseDir 'config.json'
$statePath = Join-Path $baseDir 'state.json'
$checkPath = Join-Path $baseDir 'last-check.json'

if (-not (Test-Path -LiteralPath $configPath)) { throw "找不到配置文件: $configPath" }
$config = Get-Content -LiteralPath $configPath -Raw -Encoding UTF8 | ConvertFrom-Json
$repos = @($config.repos)

$baseDate = [datetime]::new(2026, 11, 8)
$today = (Get-Date).Date

# 上次检查点：优先 last-check.json，没有就用 state.json 的日期，再没有就用今天
$lastChecked = $null
if (Test-Path -LiteralPath $checkPath) {
  try {
    $lc = Get-Content -LiteralPath $checkPath -Raw -Encoding UTF8 | ConvertFrom-Json
    if ($lc.lastChecked) { $lastChecked = [datetime]::Parse($lc.lastChecked) }
  } catch { $lastChecked = $null }
}
if (-not $lastChecked -and (Test-Path -LiteralPath $statePath)) {
  try {
    $st = Get-Content -LiteralPath $statePath -Raw -Encoding UTF8 | ConvertFrom-Json
    if ($st.date) { $lastChecked = [datetime]::Parse($st.date) }
  } catch { $lastChecked = $null }
}
if (-not $lastChecked) { $lastChecked = $today }

$missed = @()
$cursor = $lastChecked.Date
if ($cursor -lt $today) {
  while ($cursor -lt $today) {
    # 先核实这一天到底有没有提交：任一仓库在该日有提交就不算漏
    $dayStart = $cursor.ToString('yyyy-MM-dd') + 'T00:00:00+08:00'
    $dayEnd = $cursor.AddDays(1).ToString('yyyy-MM-dd') + 'T00:00:00+08:00'
    $hasCommit = $false
    foreach ($repo in $repos) {
      $path = [string]$repo.path
      if (-not (Test-Path -LiteralPath (Join-Path $path '.git'))) { continue }
      try {
        $log = & git -C $path log --all --since $dayStart --until $dayEnd --oneline 2>$null
        if ($LASTEXITCODE -eq 0 -and @($log).Count -gt 0) { $hasCommit = $true; break }
      } catch { }
    }
    if (-not $hasCommit) {
      $offset = [int](($cursor - $baseDate).TotalDays)
      $index = ($offset + 1) % $repos.Count
      if ($index -lt 0) { $index += $repos.Count }
      $missed += [pscustomobject]@{ date = $cursor.ToString('yyyy-MM-dd'); repo = $repos[$index].name; path = $repos[$index].path }
    }
    $cursor = $cursor.AddDays(1)
  }
}

# 记录本次检查点（只写 last-check.json，不碰仓库）
[pscustomobject]@{ lastChecked = $today.ToString('yyyy-MM-dd'); checkedAt = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss zzz') } |
  ConvertTo-Json | Set-Content -LiteralPath $checkPath -Encoding UTF8

if ($missed.Count -eq 0) {
  Write-Host ' 没有漏掉的日期，今天按正常流程执行即可。' -ForegroundColor Green
  exit 0
}

Write-Host (" 发现 {0} 天可能漏做：" -f $missed.Count) -ForegroundColor Yellow
$missed | Format-Table -AutoSize | Out-String | Write-Host
Write-Host ' 建议：先补最早的那一天（真实改动 + 真实提交，不要改时间戳），再继续今天。' -ForegroundColor DarkYellow
exit 2
