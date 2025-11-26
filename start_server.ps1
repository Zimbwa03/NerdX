# NerdX Server Startup Script with DeepSeek API
# This script sets all necessary environment variables and starts the Flask server

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   NerdX Server - Starting Up" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Set DeepSeek API Key
$env:DEEPSEEK_API_KEY = "sk-5e3b99e25a5246eb8df7f480e4989677"
Write-Host "`n✓ DeepSeek API Key set" -ForegroundColor Green

# Set other environment variables if needed
# $env:GEMINI_API_KEY = "your_gemini_key_here"
# $env:JWT_SECRET = "your_jwt_secret_here"

Write-Host "✓ Starting Flask server..." -ForegroundColor Green
Write-Host "`nServer will be available at: http://localhost:5000" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server`n" -ForegroundColor Yellow

# Start the Flask server
python app.py
