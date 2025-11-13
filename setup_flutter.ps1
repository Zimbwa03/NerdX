# Flutter Setup Script for NerdX Mobile Application
# Run this script in PowerShell (as Administrator recommended)

Write-Host "🚀 NerdX Flutter Setup Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Flutter is installed
Write-Host "Checking Flutter installation..." -ForegroundColor Yellow
try {
    $flutterVersion = flutter --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Flutter is already installed!" -ForegroundColor Green
        flutter --version
    }
} catch {
    Write-Host "❌ Flutter is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Flutter first:" -ForegroundColor Yellow
    Write-Host "1. Download Flutter SDK from: https://docs.flutter.dev/get-started/install/windows" -ForegroundColor White
    Write-Host "2. Extract to C:\src\flutter (or another location without spaces)" -ForegroundColor White
    Write-Host "3. Add Flutter\bin to your PATH environment variable" -ForegroundColor White
    Write-Host "4. Restart PowerShell and run this script again" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "Running Flutter Doctor..." -ForegroundColor Yellow
flutter doctor

Write-Host ""
Write-Host "Checking if mobile_app directory exists..." -ForegroundColor Yellow
if (Test-Path "mobile_app") {
    Write-Host "⚠️  mobile_app directory already exists" -ForegroundColor Yellow
    $response = Read-Host "Do you want to create a new Flutter project? (y/n)"
    if ($response -ne "y") {
        Write-Host "Skipping project creation." -ForegroundColor Yellow
        exit 0
    }
} else {
    Write-Host "Creating Flutter project..." -ForegroundColor Yellow
    flutter create mobile_app --org com.nerdx --project-name nerdx_app
    Write-Host "✅ Flutter project created successfully!" -ForegroundColor Green
}

Write-Host ""
Write-Host "📱 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Navigate to mobile_app directory: cd mobile_app" -ForegroundColor White
Write-Host "2. Run the app: flutter run" -ForegroundColor White
Write-Host "3. Or open in Cursor/VS Code and use the Flutter extension" -ForegroundColor White

