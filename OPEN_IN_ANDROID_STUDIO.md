# 📱 How to Open NerdX Mobile App in Android Studio

## Quick Steps

### Step 1: Open Android Studio

1. Launch **Android Studio**

### Step 2: Open the Android Project

**Method 1: Open Android Folder (Recommended)**
1. Click **"Open"** or **File → Open**
2. Navigate to: `C:\Users\GWENJE\Desktop\Nerdx 1\NerdX\NerdXApp\android`
3. Select the **`android`** folder
4. Click **"OK"**

**Method 2: Open Root Project**
1. Click **"Open"** or **File → Open**
2. Navigate to: `C:\Users\GWENJE\Desktop\Nerdx 1\NerdX\NerdXApp`
3. Select the **`NerdXApp`** folder
4. Click **"OK"**

### Step 3: Wait for Gradle Sync

- Android Studio will automatically detect the project
- You'll see: **"Gradle files have changed since last project sync"**
- Click **"Sync Now"** or the **elephant icon** 🐘
- **Wait 2-5 minutes** for first sync (downloads dependencies)

### Step 4: Create Android Virtual Device (AVD)

1. Click **Tools → Device Manager** (or device icon in toolbar)
2. Click **"+ Create Device"**
3. **Select Hardware**: Choose **Pixel 5** or **Pixel 6**
4. Click **"Next"**
5. **Select System Image**:
   - Choose **API 34 (Android 14)** or **API 33 (Android 13)**
   - Click **"Download"** if not installed (this downloads the Android system)
   - Wait for download to complete
6. Click **"Next"**
7. **AVD Configuration**:
   - Name: `NerdX_Emulator` (or any name)
   - Click **"Finish"**

### Step 5: Run the App

**Option A: Using Android Studio UI**

1. **Start Metro Bundler** (React Native JavaScript server):
   - Open terminal at bottom of Android Studio
   - Navigate to project root: `cd ..` (if in android folder)
   - Run: `npm start`
   - Keep this terminal open

2. **Run App**:
   - Select your AVD from device dropdown (top toolbar)
   - Click the **green play button** ▶️
   - Or press **Shift + F10**
   - Or: **Run → Run 'app'**

**Option B: Using Command Line**

**Terminal 1** (Metro Bundler):
```bash
cd "C:\Users\GWENJE\Desktop\Nerdx 1\NerdX\NerdXApp"
npm start
```

**Terminal 2** (Run Android):
```bash
cd "C:\Users\GWENJE\Desktop\Nerdx 1\NerdX\NerdXApp"
npm run android
```

## First Build Process

**First build takes 5-10 minutes:**
1. ✅ Gradle downloads dependencies
2. ✅ Builds native Android code
3. ✅ Compiles React Native JavaScript
4. ✅ Installs app on emulator
5. ✅ Launches app

**Subsequent builds are much faster (30 seconds - 2 minutes)**

## What You'll See

1. **Emulator opens** (Android phone screen)
2. **Metro bundler** shows "Loading..." in terminal
3. **App builds** - progress bar in Android Studio
4. **App installs** on emulator
5. **App launches** - You'll see the NerdX login screen!

## Project Structure in Android Studio

```
NerdXApp/
├── android/              ← Android native code (this is what Android Studio opens)
│   ├── app/
│   │   ├── build.gradle
│   │   └── src/
│   ├── build.gradle
│   └── settings.gradle
├── src/                  ← React Native TypeScript code (view in Android Studio)
│   ├── screens/
│   ├── services/
│   └── navigation/
├── package.json
└── node_modules/         ← (Don't open this in Android Studio)
```

## Important Settings

### SDK Location
If Android Studio asks for SDK location:
- Default: `C:\Users\GWENJE\AppData\Local\Android\Sdk`
- Or check: **File → Project Structure → SDK Location**

### Gradle Settings
- **File → Settings → Build, Execution, Deployment → Build Tools → Gradle**
- Use: **"Gradle JDK"** → Java 17 or 11

## Troubleshooting

### "SDK location not found"
1. **File → Project Structure → SDK Location**
2. Set: `C:\Users\GWENJE\AppData\Local\Android\Sdk`
3. Click **"Apply"**

### Gradle Sync Failed
```bash
cd "C:\Users\GWENJE\Desktop\Nerdx 1\NerdX\NerdXApp\android"
.\gradlew clean
```
Then sync again in Android Studio.

### Build Errors
1. Check **Build** tab at bottom for errors
2. Common fix: **File → Invalidate Caches → Invalidate and Restart**

### Metro Bundler Won't Start
```bash
cd "C:\Users\GWENJE\Desktop\Nerdx 1\NerdX\NerdXApp"
npm start -- --reset-cache
```

### Emulator Won't Start
1. **Tools → Device Manager**
2. Click **▶️** next to your AVD
3. Or try **Cold Boot Now**

## Quick Reference

| Action | Command/Location |
|--------|------------------|
| Open Project | File → Open → `NerdXApp/android` |
| Sync Gradle | Click elephant icon 🐘 |
| Create AVD | Tools → Device Manager → Create Device |
| Start Metro | Terminal → `npm start` |
| Run App | Click ▶️ or Shift+F10 |
| Clean Build | Terminal → `cd android && ./gradlew clean` |

## Expected Timeline

- **Open Project**: 30 seconds
- **Gradle Sync**: 2-5 minutes (first time)
- **Create AVD**: 2-3 minutes
- **First Build**: 5-10 minutes
- **App Launch**: Success! 🎉

## Next Steps After App Launches

1. ✅ Test login screen
2. ✅ Test registration
3. ✅ Test API connection
4. ✅ Test quiz features
5. ✅ Build release APK

## 🎉 You're All Set!

Follow these steps and your app will be running in Android Studio!

**Need help?** Check `ANDROID_STUDIO_SETUP.md` for detailed troubleshooting.

