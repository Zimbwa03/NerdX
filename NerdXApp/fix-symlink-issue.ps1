# Fix Windows Symlink Permission Issue for EAS Build
# This script helps resolve the EPERM symlink error

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Fix Windows Symlink Issue" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "The EPERM symlink error occurs because Windows restricts symlink creation." -ForegroundColor Yellow
Write-Host ""
Write-Host "SOLUTION OPTIONS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Option 1: Enable Windows Developer Mode (RECOMMENDED)" -ForegroundColor Green
Write-Host "  1. Press Windows Key + I to open Settings" -ForegroundColor White
Write-Host "  2. Go to Privacy & Security > For developers" -ForegroundColor White
Write-Host "  3. Toggle 'Developer Mode' to ON" -ForegroundColor White
Write-Host "  4. Restart your computer" -ForegroundColor White
Write-Host ""
Write-Host "Option 2: Run PowerShell as Administrator" -ForegroundColor Green
Write-Host "  1. Right-click PowerShell" -ForegroundColor White
Write-Host "  2. Select 'Run as administrator'" -ForegroundColor White
Write-Host "  3. Navigate to project and run build again" -ForegroundColor White
Write-Host ""
Write-Host "Option 3: Use Git-based Build (Alternative)" -ForegroundColor Green
Write-Host "  This avoids symlinks by using git repository" -ForegroundColor White
Write-Host "  Run: .\build-apk-git.ps1" -ForegroundColor White
Write-Host ""

# Check if running as admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if ($isAdmin) {
    Write-Host "You are running as Administrator - this should help!" -ForegroundColor Green
} else {
    Write-Host "You are NOT running as Administrator" -ForegroundColor Yellow
    Write-Host "Consider running PowerShell as Administrator for better results" -ForegroundColor Yellow
}
Write-Host ""

# Check Developer Mode (requires registry check)
Write-Host "Checking Developer Mode status..." -ForegroundColor Yellow
try {
    $devMode = Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock" -Name "AllowDevelopmentWithoutDevLicense" -ErrorAction SilentlyContinue
    if ($devMode -and $devMode.AllowDevelopmentWithoutDevLicense -eq 1) {
        Write-Host "Developer Mode appears to be ENABLED" -ForegroundColor Green
    } else {
        Write-Host "Developer Mode appears to be DISABLED" -ForegroundColor Red
        Write-Host "Please enable it in Windows Settings > Privacy & Security > For developers" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Could not check Developer Mode status (may need admin rights)" -ForegroundColor Yellow
}
Write-Host ""

# Clear caches
Write-Host "Would you like to clear EAS and npm caches? (y/n)" -ForegroundColor Cyan
$clearCache = Read-Host

if ($clearCache -eq "y" -or $clearCache -eq "Y") {
    Write-Host ""
    Write-Host "Clearing npm cache..." -ForegroundColor Yellow
    npm cache clean --force
    
    Write-Host "Clearing EAS cache..." -ForegroundColor Yellow
    npx eas-cli build --clear-cache 2>&1 | Out-Null
    
    Write-Host "Cache cleared!" -ForegroundColor Green
}

Write-Host ""
Write-Host "After applying one of the solutions above, try building again:" -ForegroundColor Cyan
Write-Host "  .\build-apk.ps1" -ForegroundColor White
Write-Host ""
