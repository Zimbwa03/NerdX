# 🚀 Android Studio - Quick Start Guide

## ✅ You Have:
- Android Studio installed
- Android SDK downloaded

## 📂 Open Project in Android Studio

### Step 1: Open Android Studio
Launch Android Studio

### Step 2: Open Project
1. Click **"Open"** or **File → Open**
2. Navigate to: `C:\Users\GWENJE\Desktop\Nerdx 1\NerdX\NerdXApp\android`
3. Select the **`android`** folder
4. Click **"OK"**

### Step 3: Wait for Gradle Sync
- Android Studio will detect the project
- Click **"Sync Now"** when prompted
- **Wait 2-5 minutes** (first time only)

## 📱 Create Android Virtual Device (AVD)

1. **Tools → Device Manager**
2. Click **"+ Create Device"**
3. Select **Pixel 5** or **Pixel 6**
4. Click **"Next"**
5. Select **API 34** (Android 14) - click **"Download"** if needed
6. Click **"Next"** → **"Finish"**

## ▶️ Run the App

### Method 1: Android Studio UI

**Terminal 1** (in Android Studio):
```bash
cd ..
npm start
```

**Then:**
- Select your AVD from dropdown (top toolbar)
- Click **▶️ Run** button
- Or press **Shift + F10**

### Method 2: Command Line

**Terminal 1:**
```bash
cd "C:\Users\GWENJE\Desktop\Nerdx 1\NerdX\NerdXApp"
npm start
```

**Terminal 2:**
```bash
cd "C:\Users\GWENJE\Desktop\Nerdx 1\NerdX\NerdXApp"
npm run android
```

## ⏱️ First Build

- **Takes 5-10 minutes** (first time only)
- Downloads dependencies
- Builds native code
- Installs on emulator

**Be patient!** ⏳

## 🎯 What to Expect

1. ✅ Gradle sync completes
2. ✅ AVD starts (emulator opens)
3. ✅ Metro bundler starts
4. ✅ App builds
5. ✅ App installs
6. ✅ **NerdX login screen appears!** 🎉

## 🔧 Quick Fixes

**Gradle sync fails?**
```bash
cd NerdXApp/android
./gradlew clean
```

**Metro issues?**
```bash
cd NerdXApp
npm start -- --reset-cache
```

## 📚 Full Guide

See `ANDROID_STUDIO_SETUP.md` for detailed instructions.

## 🎉 Ready!

Open Android Studio and follow the steps above. Your app will be running soon!

