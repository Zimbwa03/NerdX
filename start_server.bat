@echo off
REM NerdX Server Startup Script with DeepSeek API
REM This batch file sets environment variables and starts the Flask server

echo ========================================
echo    NerdX Server - Starting Up
echo ========================================
echo.

REM Set DeepSeek API Key
set DEEPSEEK_API_KEY=sk-5e3b99e25a5246eb8df7f480e4989677
echo [OK] DeepSeek API Key set
echo.

REM Set other environment variables if needed
REM set GEMINI_API_KEY=your_gemini_key_here
REM set JWT_SECRET=your_jwt_secret_here

echo [OK] Starting Flask server...
echo.
echo Server will be available at: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

REM Start the Flask server
python main.py
