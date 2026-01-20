# Quick EAS Init Script
# This will initialize a new EAS project

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  EAS Project Initialization" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectDir = "c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\NerdXApp"
Set-Location $projectDir

# Check if logged in
Write-Host "Checking login status..." -ForegroundColor Yellow
$whoamiOutput = eas whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "You are not logged in. Please login first:" -ForegroundColor Red
    Write-Host "  eas login" -ForegroundColor White
    exit 1
} else {
    $currentUser = $whoamiOutput | Select-String -Pattern "^\w+" | ForEach-Object { $_.Matches.Value }
    Write-Host "Logged in as: $currentUser" -ForegroundColor Green
}
Write-Host ""

Write-Host "Initializing new EAS project..." -ForegroundColor Yellow
Write-Host "IMPORTANT: When prompted, answer 'n' (no) to link existing project" -ForegroundColor Cyan
Write-Host "This will create a new project ID for your app." -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

eas init

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "EAS project initialized successfully!" -ForegroundColor Green
    Write-Host "Your app.json has been updated with a new project ID." -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Initialization failed. Please check the error above." -ForegroundColor Red
}
