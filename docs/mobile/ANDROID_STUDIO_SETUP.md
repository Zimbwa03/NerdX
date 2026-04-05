# 📱 Android Studio Setup Guide - NerdX Mobile App

## Prerequisites ✅

You mentioned you already have:
- ✅ Android Studio installed
- ✅ Android SDK downloaded

Perfect! Let's proceed.

## Step 1: Open Project in Android Studio

### Option A: Open Existing Project
1. **Open Android Studio**
2. Click **"Open"** or **File → Open**
3. Navigate to: `C:\Users\GWENJE\Desktop\Nerdx 1\NerdX\NerdXApp`
4. Select the **`NerdXApp`** folder
5. Click **"OK"**

### Option B: Import Project
1. **Open Android Studio**
2. Click **"Open an Existing Project"**
3. Navigate to: `C:\Users\GWENJE\Desktop\Nerdx 1\NerdX\NerdXApp\android`
4. Select the **`android`** folder
5. Click **"OK"**

## Step 2: Sync Gradle Files

When Android Studio opens:
1. You'll see a notification: **"Gradle files have changed since last project sync"**
2. Click **"Sync Now"** or click the **elephant icon** in the toolbar
3. Wait for Gradle sync to complete (2-5 minutes first time)

## Step 3: Install Required SDK Components

1. Go to **File → Settings** (or **Android Studio → Preferences** on Mac)
2. Navigate to **Appearance & Behavior → System Settings → Android SDK**
3. In the **SDK Platforms** tab, ensure:
   - ✅ Android 14.0 (API 34) - checked
   - ✅ Android 13.0 (API 33) - checked
   - ✅ Android 12.0 (API 31) - checked
   - ✅ Android 5.0 (API 21) - checked (minimum)

4. In the **SDK Tools** tab, ensure:
   - ✅ Android SDK Build-Tools
   - ✅ Android SDK Platform-Tools
   - ✅ Android Emulator
   - ✅ Intel x86 Emulator Accelerator (HAXM installer) - if on Intel CPU
   - ✅ Google Play services
   - ✅ Android SDK Command-line Tools

5. Click **"Apply"** and **"OK"**

## Step 4: Create Android Virtual Device (AVD)

1. Click **Tools → Device Manager** (or the device icon in toolbar)
2. Click **"Create Device"**
3. Select a device:
   - **Recommended**: Pixel 5 or Pixel 6
   - Or any phone with API 33 or 34
4. Click **"Next"**
5. Select a system image:
   - **Recommended**: **API 34 (Android 14)** or **API 33 (Android 13)**
   - Click **"Download"** if not installed
6. Click **"Next"**
7. Review configuration and click **"Finish"**

## Step 5: Configure Project Settings

### Check Gradle Configuration

1. Open **`android/build.gradle`**
2. Verify:
   - `compileSdkVersion = 34`
   - `minSdkVersion = 21`
   - `targetSdkVersion = 34`

### Check App Configuration

1. Open **`android/app/build.gradle`**
2. Verify:
   - `applicationId = "com.nerdxapp"`
   - `minSdkVersion = 21`
   - `targetSdkVersion = 34`

## Step 6: Install Node Modules (If Not Done)

In Android Studio terminal or external terminal:
```bash
cd NerdXApp
npm install
```

## Step 7: Run the App

### Method 1: Using Android Studio

1. **Start Metro Bundler** (React Native's JavaScript bundler):
   - Open terminal in Android Studio (bottom panel)
   - Run: `npm start` (from `NerdXApp` directory)
   - Or: `cd NerdXApp && npm start`

2. **Run App**:
   - Select your AVD from device dropdown (top toolbar)
   - Click the **green play button** (▶️) or press **Shift+F10**
   - Or: **Run → Run 'app'**

### Method 2: Using Command Line

**Terminal 1 - Start Metro:**
```bash
cd NerdXApp
npm start
```

**Terminal 2 - Run Android:**
```bash
cd NerdXApp
npm run android
```

## Step 8: First Build

**First build will take 5-10 minutes:**
- Gradle downloads dependencies
- Builds native Android code
- Compiles React Native
- Installs on emulator

**Be patient!** Subsequent builds are much faster.

## Troubleshooting

### Gradle Sync Failed
```bash
cd NerdXApp/android
./gradlew clean
```
Then sync again in Android Studio.

### Build Errors
1. **Invalid SDK**: Check SDK is installed (Step 3)
2. **Gradle version**: Android Studio will prompt to update
3. **Missing dependencies**: Run `npm install` in `NerdXApp` directory

### Metro Bundler Issues
```bash
cd NerdXApp
npm start -- --reset-cache
```

### Emulator Won't Start
1. Check **AVD Manager** → Verify device is created
2. Check **SDK Manager** → Verify system image is installed
3. Try **Cold Boot** from AVD Manager

### "SDK location not found"
1. **File → Project Structure → SDK Location**
2. Set SDK location: `C:\Users\GWENJE\AppData\Local\Android\Sdk` (or your SDK path)
3. Click **"Apply"**

### "NDK not found" (if error appears)
- Usually not needed for React Native
- Can be ignored or install NDK from SDK Manager

## Project Structure in Android Studio

```
NerdXApp/
├── android/              ← Android native code (open this in Android Studio)
│   ├── app/
│   ├── build.gradle
│   └── settings.gradle
├── src/                  ← React Native TypeScript code
│   ├── screens/
│   ├── services/
│   └── navigation/
└── package.json
```

## Quick Commands Reference

```bash
# Start Metro bundler
cd NerdXApp
npm start

# Run on Android
npm run android

# Clean build
cd android
./gradlew clean

# Build APK
cd android
./gradlew assembleRelease
```

## Expected First Run

1. ✅ Gradle sync completes
2. ✅ AVD starts (emulator opens)
3. ✅ Metro bundler starts
4. ✅ App builds and installs
5. ✅ App launches on emulator
6. ✅ You see the NerdX login screen!

## Next Steps After App Launches

1. ✅ Test login/registration
2. ✅ Test API connection
3. ✅ Test quiz functionality
4. ✅ Build release APK

## 🎉 You're Ready!

Once Android Studio opens the project and Gradle syncs, you're ready to run the app!

**Estimated time**: 5-10 minutes for first build

