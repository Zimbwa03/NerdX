# Quick Build Script - Builds APK with EAS
# Use this after you've already initialized your EAS project

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NerdX APK Build Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectDir = "c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\NerdXApp"
Set-Location $projectDir

Write-Host "Choose build profile:" -ForegroundColor Cyan
Write-Host "  1. Production (recommended for release)" -ForegroundColor White
Write-Host "  2. Preview (for testing)" -ForegroundColor White
Write-Host ""
$choice = Read-Host "Enter choice (1 or 2)"

if ($choice -eq "2") {
    $profile = "preview"
} else {
    $profile = "production"
}

Write-Host ""
Write-Host "Building Android APK with profile: $profile" -ForegroundColor Yellow
Write-Host "This may take 10-30 minutes..." -ForegroundColor Gray
Write-Host ""

eas build --platform android --profile $profile

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Build completed successfully!" -ForegroundColor Green
    Write-Host "Check the output above for your APK download link." -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Build failed. Please check the error messages above." -ForegroundColor Red
}
