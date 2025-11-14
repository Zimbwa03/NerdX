# PowerShell script to test Gradle wrapper
# Run this from the NerdXApp\android directory

Write-Host "Setting JAVA_HOME..." -ForegroundColor Cyan
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"

Write-Host "JAVA_HOME: $env:JAVA_HOME" -ForegroundColor Green

Write-Host "`nTesting Gradle wrapper..." -ForegroundColor Cyan
.\gradlew.bat --version

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Gradle wrapper is working!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Gradle wrapper failed. Check the error above." -ForegroundColor Red
}

