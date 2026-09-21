# PowerShell script for automated daily sync to Gitee and GitHub
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$RepoDir = "d:\AIforstudy"
$LogFile = Join-Path $RepoDir "sync.log"

function Log-Message {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logLine = "[$timestamp] $Message"
    Write-Host $logLine
    Add-Content -Path $LogFile -Value $logLine -Encoding UTF8
}

function Get-SmartCommitInfo {
    $statusLines = git diff --staged --name-status
    if (-not $statusLines) {
        return @{
            Subject = "同步: 学习笔记与代码"
            Body = ""
        }
    }

    $added = @()
    $modified = @()
    $deleted = @()
    $renamed = @()
    $topics = [System.Collections.Generic.HashSet[string]]::new()
    $detailLines = @()

    foreach ($line in $statusLines) {
        if ([string]::IsNullOrWhiteSpace($line)) { continue }
        $tokens = $line -split "`t"
        $statusCode = $tokens[0].Trim()
        $filePath = if ($tokens.Length -ge 2) { $tokens[1].Trim() } else { "" }

        if (-not $filePath) { continue }

        $cleanPath = $filePath -replace '\\', '/'
        $parts = $cleanPath -split '/'
        if ($parts.Length -ge 2) {
            if ($parts.Length -ge 3 -and $parts[0] -in @("面试考点", "js基础", "js手写系列", "设计模式", "数据结构")) {
                $topics.Add("$($parts[0])-$($parts[1])") | Out-Null
            } else {
                $topics.Add($parts[0]) | Out-Null
            }
        } elseif ($parts.Length -eq 1) {
            $topics.Add($parts[0]) | Out-Null
        }

        if ($statusCode -like "A*") {
            $added += $cleanPath
            $detailLines += "- 新增: $cleanPath"
        } elseif ($statusCode -like "M*") {
            $modified += $cleanPath
            $detailLines += "- 修改: $cleanPath"
        } elseif ($statusCode -like "D*") {
            $deleted += $cleanPath
            $detailLines += "- 删除: $cleanPath"
        } elseif ($statusCode -like "R*") {
            $renamed += $cleanPath
            $detailLines += "- 重命名: $cleanPath"
        } else {
            $modified += $cleanPath
            $detailLines += "- 更新: $cleanPath"
        }
    }

    $topicList = [string[]]($topics)
    $topicStr = if ($topicList.Length -gt 0) { ($topicList | Select-Object -First 3) -join "、" } else { "学习内容" }
    if ($topicList.Length -gt 3) {
        $topicStr += " 等"
    }

    $totalCount = $added.Count + $modified.Count + $deleted.Count + $renamed.Count

    if ($totalCount -eq 1) {
        if ($added.Count -eq 1) {
            $leafName = Split-Path -Leaf $added[0]
            $subject = "新增 $($topicStr) - $($leafName)"
        } elseif ($modified.Count -eq 1) {
            $leafName = Split-Path -Leaf $modified[0]
            $subject = "更新 $($topicStr) - $($leafName)"
        } elseif ($deleted.Count -eq 1) {
            $leafName = Split-Path -Leaf $deleted[0]
            $subject = "删除 $($topicStr) - $($leafName)"
        } else {
            $subject = "更新 $($topicStr)"
        }
    } else {
        $actionParts = @()
        if ($added.Count -gt 0) { $actionParts += "新增 $($added.Count) 个文件" }
        if ($modified.Count -gt 0) { $actionParts += "更新 $($modified.Count) 个文件" }
        if ($deleted.Count -gt 0) { $actionParts += "删除 $($deleted.Count) 个文件" }
        if ($renamed.Count -gt 0) { $actionParts += "重命名 $($renamed.Count) 个文件" }
        $actionStr = $actionParts -join "，"

        if ($topicList.Length -eq 1) {
            $subject = "更新 $($topicStr) 学习笔记 ($($actionStr))"
        } else {
            $subject = "同步 $($topicStr) 相关内容 ($($actionStr))"
        }
    }

    $body = $detailLines -join "`n"

    return @{
        Subject = $subject
        Body = $body
    }
}

Set-Location -Path $RepoDir

Log-Message "================= Starting Daily Sync ================="

try {
    $gitStatus = git status --porcelain 2>&1
    if ($LASTEXITCODE -ne 0) {
        Log-Message "ERROR: Not a valid git repository or git error: $gitStatus"
        exit 1
    }

    git add -A
    
    $stagedDiff = git diff --staged --name-only
    if ($stagedDiff) {
        $commitInfo = Get-SmartCommitInfo
        $subject = $commitInfo.Subject
        $body = $commitInfo.Body

        if ($body) {
            $commitOutput = git commit -m "$subject" -m "$body" 2>&1
        } else {
            $commitOutput = git commit -m "$subject" 2>&1
        }

        Log-Message "Committed: $subject"
        if ($body) {
            Log-Message "Details:`n$body"
        }
        Log-Message "$commitOutput"
    } else {
        Log-Message "No new changes to commit."
    }

    Log-Message "Pushing to Gitee (origin main)..."
    $pushOrigin = git push origin main 2>&1
    Log-Message "$pushOrigin"
    if ($LASTEXITCODE -ne 0) {
        Log-Message "WARNING: Push to Gitee returned non-zero code."
    } else {
        Log-Message "Successfully pushed to Gitee."
    }

    Log-Message "Pushing to GitHub (github main)..."
    $pushGithub = git push github main 2>&1
    Log-Message "$pushGithub"
    if ($LASTEXITCODE -ne 0) {
        Log-Message "WARNING: Push to GitHub returned non-zero code."
    } else {
        Log-Message "Successfully pushed to GitHub."
    }

    Log-Message "================= Daily Sync Finished ================="
}
catch {
    Log-Message "EXCEPTION: $_"
}
