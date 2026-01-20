# Build APK using Git-based approach (avoids Windows symlink issues)
# This commits changes and uses git for the build

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NerdX APK Build (Git-based)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectDir = "c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\NerdXApp"
Set-Location $projectDir

# Check git status
Write-Host "Checking git status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "You have uncommitted changes. Options:" -ForegroundColor Yellow
    Write-Host "  1. Commit changes and push to git (recommended)" -ForegroundColor White
    Write-Host "  2. Stash changes and build" -ForegroundColor White
    Write-Host "  3. Cancel" -ForegroundColor White
    Write-Host ""
    $choice = Read-Host "Enter choice (1, 2, or 3)"
    
    if ($choice -eq "1") {
        Write-Host ""
        Write-Host "Committing changes..." -ForegroundColor Yellow
        git add .
        $commitMessage = Read-Host "Enter commit message (or press Enter for default)"
        if (-not $commitMessage) {
            $commitMessage = "Build preparation - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        }
        git commit -m $commitMessage
        Write-Host "Pushing to remote..." -ForegroundColor Yellow
        git push
    } elseif ($choice -eq "2") {
        Write-Host ""
        Write-Host "Stashing changes..." -ForegroundColor Yellow
        git stash
    } else {
        Write-Host "Build cancelled." -ForegroundColor Red
        exit 0
    }
}

Write-Host ""
Write-Host "Choose build profile:" -ForegroundColor Cyan
Write-Host "  1. Production (recommended for release)" -ForegroundColor White
Write-Host "  2. Preview (for testing)" -ForegroundColor White
Write-Host ""
$profileChoice = Read-Host "Enter choice (1 or 2)"

if ($profileChoice -eq "2") {
    $profile = "preview"
} else {
    $profile = "production"
}

Write-Host ""
Write-Host "Building Android APK with profile: $profile" -ForegroundColor Yellow
Write-Host "Using git-based build to avoid Windows symlink issues..." -ForegroundColor Gray
Write-Host "This may take 10-30 minutes..." -ForegroundColor Gray
Write-Host ""

# Use git-based build
eas build --platform android --profile $profile --non-interactive

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Build completed successfully!" -ForegroundColor Green
    Write-Host "Check the output above for your APK download link." -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Build failed. Please check the error messages above." -ForegroundColor Red
}
