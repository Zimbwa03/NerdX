# NerdX Server Startup Script with DeepSeek API
# This script sets all necessary environment variables and starts the Flask server

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   NerdX Server - Starting Up" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Set environment variables — copy values from your .env file
# $env:DEEPSEEK_API_KEY = "your_deepseek_api_key_here"
Write-Host "`n[INFO] Load env vars from .env or set them above" -ForegroundColor Yellow

# Set other environment variables if needed
# $env:GEMINI_API_KEY = "your_gemini_key_here"
# $env:JWT_SECRET = "your_jwt_secret_here"

Write-Host "✓ Starting Flask server..." -ForegroundColor Green
Write-Host "`nServer will be available at: http://localhost:5000" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server`n" -ForegroundColor Yellow

# Start the Flask server
python backend/main.py
