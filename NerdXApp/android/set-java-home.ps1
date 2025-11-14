# PowerShell script to set JAVA_HOME permanently
# Run this script as Administrator to set JAVA_HOME system-wide

$javaHome = "C:\Program Files\Java\jdk-17"

# Verify Java installation exists
if (-not (Test-Path $javaHome)) {
    Write-Host "Error: Java installation not found at $javaHome" -ForegroundColor Red
    exit 1
}

# Set JAVA_HOME for current session
$env:JAVA_HOME = $javaHome
Write-Host "JAVA_HOME set to: $env:JAVA_HOME" -ForegroundColor Green

# Set JAVA_HOME permanently (requires Administrator)
try {
    [System.Environment]::SetEnvironmentVariable("JAVA_HOME", $javaHome, [System.EnvironmentVariableTarget]::Machine)
    Write-Host "JAVA_HOME set permanently (Machine level)" -ForegroundColor Green
} catch {
    Write-Host "Could not set JAVA_HOME permanently. Run PowerShell as Administrator." -ForegroundColor Yellow
    Write-Host "For current session only, JAVA_HOME is set to: $env:JAVA_HOME" -ForegroundColor Yellow
}

# Verify
Write-Host "`nVerifying Java installation..." -ForegroundColor Cyan
& "$javaHome\bin\java.exe" -version

