# Run this script as Administrator to permanently configure Android SDK
# Right-click PowerShell and select "Run as Administrator"

Write-Host "=== Setting Permanent Android SDK Environment Variables ===" -ForegroundColor Cyan
Write-Host ""

$sdkPath = "C:\Users\GWENJE\AppData\Local\Android\Sdk"
$platformTools = "$sdkPath\platform-tools"

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    pause
    exit 1
}

# Set ANDROID_HOME
[Environment]::SetEnvironmentVariable('ANDROID_HOME', $sdkPath, 'User')
Write-Host "✓ Set ANDROID_HOME = $sdkPath" -ForegroundColor Green

# Set ANDROID_SDK_ROOT
[Environment]::SetEnvironmentVariable('ANDROID_SDK_ROOT', $sdkPath, 'User')
Write-Host "✓ Set ANDROID_SDK_ROOT = $sdkPath" -ForegroundColor Green

# Add platform-tools to PATH
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
if ($currentPath -notlike "*$platformTools*") {
    [Environment]::SetEnvironmentVariable('PATH', "$platformTools;$currentPath", 'User')
    Write-Host "✓ Added platform-tools to PATH" -ForegroundColor Green
} else {
    Write-Host "✓ platform-tools already in PATH" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Configuration Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Please close and reopen your terminal for changes to take effect." -ForegroundColor Yellow
Write-Host ""
pause
