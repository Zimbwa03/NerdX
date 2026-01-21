# Android SDK Configuration Script for NerdX
# This script helps configure Android SDK environment variables

Write-Host "=== Android SDK Configuration ===" -ForegroundColor Cyan
Write-Host ""

# Check if Android SDK exists
$sdkPath = "C:\Users\GWENJE\AppData\Local\Android\Sdk"
if (Test-Path $sdkPath) {
    Write-Host "✓ Android SDK found at: $sdkPath" -ForegroundColor Green
} else {
    Write-Host "✗ Android SDK NOT found at: $sdkPath" -ForegroundColor Red
    Write-Host "Please install Android Studio or set the correct path." -ForegroundColor Yellow
    exit 1
}

# Check for platform-tools
$platformTools = Join-Path $sdkPath "platform-tools"
if (Test-Path $platformTools) {
    Write-Host "✓ Platform tools found" -ForegroundColor Green
} else {
    Write-Host "✗ Platform tools NOT found" -ForegroundColor Red
    Write-Host "Please install Android SDK Platform-Tools via Android Studio SDK Manager" -ForegroundColor Yellow
}

# Set environment variables for current session
Write-Host ""
Write-Host "Setting environment variables for current session..." -ForegroundColor Cyan
$env:ANDROID_HOME = $sdkPath
$env:ANDROID_SDK_ROOT = $sdkPath
$env:PATH = "$platformTools;$env:PATH"

# Add to PATH if not already there
if ($env:PATH -notlike "*$platformTools*") {
    $env:PATH = "$platformTools;$env:PATH"
}

Write-Host "✓ ANDROID_HOME set to: $env:ANDROID_HOME" -ForegroundColor Green
Write-Host "✓ ANDROID_SDK_ROOT set to: $env:ANDROID_SDK_ROOT" -ForegroundColor Green
Write-Host ""

# Check ADB
Write-Host "Checking ADB..." -ForegroundColor Cyan
$adbPath = Join-Path $platformTools "adb.exe"
if (Test-Path $adbPath) {
    Write-Host "✓ ADB found" -ForegroundColor Green
    
    # Restart ADB server
    Write-Host "Restarting ADB server..." -ForegroundColor Cyan
    & $adbPath kill-server 2>$null
    Start-Sleep -Seconds 1
    & $adbPath start-server 2>$null
    
    # Check devices
    Write-Host ""
    Write-Host "Connected devices:" -ForegroundColor Cyan
    & $adbPath devices
} else {
    Write-Host "✗ ADB NOT found" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Configuration Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "To make these changes permanent, run this in PowerShell as Administrator:" -ForegroundColor Yellow
Write-Host "[Environment]::SetEnvironmentVariable('ANDROID_HOME', '$sdkPath', 'User')" -ForegroundColor White
Write-Host "[Environment]::SetEnvironmentVariable('ANDROID_SDK_ROOT', '$sdkPath', 'User')" -ForegroundColor White
Write-Host ""
Write-Host "Then add to PATH:" -ForegroundColor Yellow
Write-Host '$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")' -ForegroundColor White
Write-Host "[Environment]::SetEnvironmentVariable('PATH', `"$platformTools;$currentPath`", 'User')" -ForegroundColor White
Write-Host ""
