Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Building NerdX Android App..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Ensure we're in the correct directory
Set-Location $PSScriptRoot

Write-Host "Step 1: Cleaning previous build..." -ForegroundColor Yellow
try {
    & .\gradlew.bat clean --no-daemon
    if ($LASTEXITCODE -ne 0) {
        throw "Clean failed with exit code $LASTEXITCODE"
    }
} catch {
    Write-Host "ERROR: Clean failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting steps:" -ForegroundColor Yellow
    Write-Host "1. Close Android Studio if it's open" -ForegroundColor White
    Write-Host "2. Delete the .gradle folder in your user directory" -ForegroundColor White
    Write-Host "3. Restart your computer" -ForegroundColor White
    Write-Host "4. Run this script again" -ForegroundColor White
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 2: Building APK..." -ForegroundColor Yellow
try {
    & .\gradlew.bat assembleDebug --no-daemon
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed with exit code $LASTEXITCODE"
    }
} catch {
    Write-Host "ERROR: Build failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting steps:" -ForegroundColor Yellow
    Write-Host "1. Close Android Studio if it's open" -ForegroundColor White
    Write-Host "2. Delete the .gradle folder in your user directory" -ForegroundColor White
    Write-Host "3. Restart your computer" -ForegroundColor White
    Write-Host "4. Run this script again" -ForegroundColor White
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ BUILD SUCCESSFUL! ✅" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your APK is located at:" -ForegroundColor Cyan
Write-Host "$PSScriptRoot\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor White
Write-Host ""
Write-Host "Transfer this APK to your phone and install it!" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to exit"
