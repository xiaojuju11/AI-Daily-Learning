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

Set-Location -Path $RepoDir

Log-Message "================= Starting Daily Sync ================="

try {
    # Check if git repository is valid
    $gitStatus = git status --porcelain 2>&1
    if ($LASTEXITCODE -ne 0) {
        Log-Message "ERROR: Not a valid git repository or git error: $gitStatus"
        exit 1
    }

    # Add all changed and untracked files
    git add -A
    
    # Check staged changes
    $stagedDiff = git diff --staged --name-only
    if ($stagedDiff) {
        $commitDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        $commitMsg = "auto: daily sync $commitDate"
        $commitOutput = git commit -m $commitMsg 2>&1
        Log-Message "Committed changes: $commitMsg"
        Log-Message "$commitOutput"
    } else {
        Log-Message "No new changes to commit."
    }

    # Push to Gitee (origin)
    Log-Message "Pushing to Gitee (origin main)..."
    $pushOrigin = git push origin main 2>&1
    Log-Message "$pushOrigin"
    if ($LASTEXITCODE -ne 0) {
        Log-Message "WARNING: Push to Gitee returned non-zero code."
    } else {
        Log-Message "Successfully pushed to Gitee."
    }

    # Push to GitHub (github)
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
