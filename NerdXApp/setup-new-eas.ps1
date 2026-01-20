# Automated EAS Setup and Build Script
# This script will help you set up a new EAS project and build the APK

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NerdX EAS Setup & Build Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to project directory
$projectDir = "c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\NerdXApp"
Set-Location $projectDir

Write-Host "Step 1: Checking EAS CLI installation..." -ForegroundColor Yellow
$easInstalled = Get-Command eas -ErrorAction SilentlyContinue
if (-not $easInstalled) {
    Write-Host "ERROR: EAS CLI is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "  npm install -g eas-cli" -ForegroundColor White
    exit 1
}
Write-Host "EAS CLI is installed" -ForegroundColor Green
Write-Host ""

# Check if logged in
Write-Host "Step 2: Checking EAS login status..." -ForegroundColor Yellow
$whoamiOutput = eas whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "You are not logged in. Please login:" -ForegroundColor Yellow
    Write-Host "  eas login" -ForegroundColor White
    Write-Host ""
    Write-Host "After logging in, run this script again." -ForegroundColor Yellow
    exit 0
} else {
    $currentUser = $whoamiOutput | Select-String -Pattern "^\w+" | ForEach-Object { $_.Matches.Value }
    Write-Host "Currently logged in as: $currentUser" -ForegroundColor Green
    Write-Host ""
}

# Remove old project ID if it exists
Write-Host "Step 3: Cleaning up old project configuration..." -ForegroundColor Yellow
$appJsonPath = Join-Path $projectDir "app.json"
if (Test-Path $appJsonPath) {
    try {
        $appJson = Get-Content $appJsonPath -Raw | ConvertFrom-Json
        if ($appJson.expo.extra -and $appJson.expo.extra.eas -and $appJson.expo.extra.eas.projectId) {
            Write-Host "  Removing old project ID: $($appJson.expo.extra.eas.projectId)" -ForegroundColor Gray
            $appJson.expo.PSObject.Properties.Remove('extra')
            if ($appJson.expo.PSObject.Properties['owner']) {
                $appJson.expo.PSObject.Properties.Remove('owner')
            }
            $appJson | ConvertTo-Json -Depth 10 | Set-Content $appJsonPath
            Write-Host "Old project ID removed" -ForegroundColor Green
        } else {
            Write-Host "No old project ID found" -ForegroundColor Green
        }
    } catch {
        Write-Host "Warning: Could not parse app.json, skipping cleanup" -ForegroundColor Yellow
    }
}
Write-Host ""

# Initialize new EAS project
Write-Host "Step 4: Initializing new EAS project..." -ForegroundColor Yellow
Write-Host "  This will create a new project ID for your app" -ForegroundColor Gray
Write-Host "  When prompted, answer 'n' (no) to link existing project" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to continue with EAS init..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

eas init
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: EAS init failed. Please check the error above." -ForegroundColor Red
    exit 1
}
Write-Host "EAS project initialized" -ForegroundColor Green
Write-Host ""

# Configure build settings
Write-Host "Step 5: Configuring build settings..." -ForegroundColor Yellow
Write-Host "  This will set up your eas.json configuration" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to continue with build configuration..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

eas build:configure
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Build configuration had issues, but continuing..." -ForegroundColor Yellow
}
Write-Host "Build configuration complete" -ForegroundColor Green
Write-Host ""

# Build APK
Write-Host "Step 6: Building Android APK..." -ForegroundColor Yellow
Write-Host "  This will build your APK in the EAS cloud" -ForegroundColor Gray
Write-Host "  This process takes 10-30 minutes" -ForegroundColor Gray
Write-Host ""
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
Write-Host "Starting build with profile: $profile" -ForegroundColor Cyan
Write-Host "Press any key to start the build..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host ""
Write-Host "Building APK... This may take 10-30 minutes." -ForegroundColor Yellow
Write-Host "You can monitor progress at: https://expo.dev" -ForegroundColor Gray
Write-Host ""

eas build --platform android --profile $profile

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Build completed successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your APK download link will be available in the output above." -ForegroundColor Cyan
    Write-Host "You can also check your builds at: https://expo.dev" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Build failed. Please check the error messages above." -ForegroundColor Red
    exit 1
}
