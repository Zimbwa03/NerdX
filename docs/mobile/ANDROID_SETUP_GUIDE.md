# Android SDK Configuration Guide

## Current Issues
1. ✅ Android SDK path exists: `C:\Users\GWENJE\AppData\Local\Android\Sdk`
2. ⚠️ Device showing as "offline" or not detected

## Quick Fix Steps

### Step 1: Run Configuration Script
```powershell
.\configure-android.ps1
```

### Step 2: Make Environment Variables Permanent (Run as Administrator)

Open PowerShell as Administrator and run:

```powershell
# Set ANDROID_HOME
[Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Users\GWENJE\AppData\Local\Android\Sdk', 'User')

# Set ANDROID_SDK_ROOT
[Environment]::SetEnvironmentVariable('ANDROID_SDK_ROOT', 'C:\Users\GWENJE\AppData\Local\Android\Sdk', 'User')

# Add platform-tools to PATH
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
$platformTools = "C:\Users\GWENJE\AppData\Local\Android\Sdk\platform-tools"
if ($currentPath -notlike "*$platformTools*") {
    [Environment]::SetEnvironmentVariable('PATH', "$platformTools;$currentPath", 'User')
}
```

### Step 3: Fix Device Connection

If your device shows as "offline":

1. **On your Android device:**
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times to enable Developer Options
   - Go to Settings → Developer Options
   - Enable "USB Debugging"
   - Enable "USB Debugging (Security Settings)" if available

2. **Connect your device:**
   - Use a USB cable to connect your phone to your computer
   - On your phone, you should see a prompt: "Allow USB debugging?"
   - Check "Always allow from this computer" and tap "OK"

3. **Verify connection:**
   ```powershell
   adb devices
   ```
   You should see your device listed as "device" (not "offline" or "unauthorized")

4. **If still offline:**
   ```powershell
   adb kill-server
   adb start-server
   adb devices
   ```

### Step 4: Restart Your Terminal

After setting environment variables, close and reopen your terminal/PowerShell window for changes to take effect.

### Step 5: Try Expo Again

```powershell
cd NerdXApp
npx expo start
```

## Alternative: Use Expo Go App

If you continue having Android SDK issues, you can use Expo Go:

1. Install "Expo Go" app from Google Play Store on your Android device
2. Make sure your phone and computer are on the same WiFi network
3. Run `npx expo start`
4. Scan the QR code with Expo Go app

## Troubleshooting

### Device Still Offline?
- Try a different USB cable
- Try a different USB port
- Uninstall and reinstall USB drivers for your device
- On your phone: Revoke USB debugging authorizations, then reconnect

### SDK Path Not Found?
- Install Android Studio: https://developer.android.com/studio
- During installation, make sure to install Android SDK
- Note the installation path and update ANDROID_HOME accordingly

### ADB Not Found?
- Open Android Studio
- Go to Tools → SDK Manager
- Under "SDK Tools" tab, check "Android SDK Platform-Tools"
- Click "Apply" to install
