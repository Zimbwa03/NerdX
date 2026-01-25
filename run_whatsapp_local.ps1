# PowerShell script to run WhatsApp bot locally
# This script starts the Flask server for local WhatsApp bot development

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NerdX WhatsApp Bot - Local Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  WARNING: .env file not found!" -ForegroundColor Yellow
    Write-Host "   Make sure your .env file is in the project root" -ForegroundColor Yellow
    Write-Host ""
}

# Set environment variables
$env:PORT = "5000"
$env:FLASK_ENV = "development"
$env:FLASK_DEBUG = "1"

Write-Host "📋 Configuration:" -ForegroundColor Green
Write-Host "   Port: 5000" -ForegroundColor White
Write-Host "   Environment: Development" -ForegroundColor White
Write-Host "   Debug Mode: ON" -ForegroundColor White
Write-Host ""

Write-Host "🚀 Starting Flask server..." -ForegroundColor Green
Write-Host ""
Write-Host "📍 Local URL: http://localhost:5000" -ForegroundColor Cyan
Write-Host "📍 Health Check: http://localhost:5000/health" -ForegroundColor Cyan
Write-Host "📍 Webhook Endpoint: http://localhost:5000/webhook/whatsapp" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  IMPORTANT: Use ngrok to expose this server to Twilio!" -ForegroundColor Yellow
Write-Host "   Run in another terminal: ngrok http 5000" -ForegroundColor Yellow
Write-Host ""
Write-Host "📝 Twilio Webhook URL format:" -ForegroundColor Magenta
Write-Host "   https://YOUR_NGROK_URL.ngrok.io/webhook/whatsapp" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start the server
python main.py
