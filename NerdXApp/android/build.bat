@echo off
echo ========================================
echo Building NerdX Android App...
echo ========================================
echo.

cd /d "%~dp0"

echo Step 1: Cleaning previous build...
call gradlew.bat clean --no-daemon
if %errorlevel% neq 0 (
    echo ERROR: Clean failed!
    goto :error
)

echo.
echo Step 2: Building APK...
call gradlew.bat assembleDebug --no-daemon
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    goto :error
)

echo.
echo ========================================
echo ✅ BUILD SUCCESSFUL! ✅
echo ========================================
echo.
echo Your APK is located at:
echo %~dp0app\build\outputs\apk\debug\app-debug.apk
echo.
echo Transfer this APK to your phone and install it!
echo.
pause
exit /b 0

:error
echo.
echo ========================================
echo ❌ BUILD FAILED ❌
echo ========================================
echo.
echo Try these troubleshooting steps:
echo 1. Close Android Studio if it's open
echo 2. Delete the .gradle folder in your user directory
echo 3. Restart your computer
echo 4. Run this script again
echo.
pause
exit /b 1
