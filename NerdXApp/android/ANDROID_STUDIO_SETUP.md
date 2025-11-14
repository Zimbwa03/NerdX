# Android Studio Setup Guide

## ✅ Project Structure Created

All required Android app files have been created:
- ✅ `app/build.gradle` - App build configuration
- ✅ `app/src/main/AndroidManifest.xml` - App manifest
- ✅ `app/src/main/java/com/nerdxapp/MainActivity.kt` - Main activity
- ✅ `app/src/main/java/com/nerdxapp/MainApplication.kt` - Application class
- ✅ `app/src/main/res/values/strings.xml` - String resources
- ✅ `app/src/main/res/values/styles.xml` - App theme
- ✅ `app/src/main/res/drawable/rn_edit_text_material.xml` - Edit text drawable

## Opening in Android Studio

### Step 1: Open Project
1. Launch **Android Studio**
2. Click **"Open"** or **File → Open**
3. Navigate to: `C:\Users\GWENJE\Desktop\Nerdx 1\NerdX\NerdXApp\android`
4. **Select the `android` folder** (not NerdXApp root)
5. Click **"OK"**

### Step 2: Gradle Sync
- Android Studio will detect Gradle project
- Click **"Sync Now"** when prompted
- **Wait 3-5 minutes** for first sync (downloads dependencies)

### Step 3: Configure SDK (if needed)
1. **File → Project Structure → SDK Location**
2. Set Android SDK location: `C:\Users\GWENJE\AppData\Local\Android\Sdk`
3. Click **"Apply"**

### Step 4: Set JAVA_HOME in Android Studio
1. **File → Settings → Build, Execution, Deployment → Build Tools → Gradle**
2. Under **"Gradle JDK"**, select **Java 17** or **JDK 17**
3. If not listed, click **"Download JDK"** and select version 17
4. Click **"Apply"** and **"OK"**

### Step 5: Create AVD (Android Virtual Device)
1. **Tools → Device Manager**
2. Click **"+ Create Device"**
3. Select **Pixel 5** or **Pixel 6**
4. Click **"Next"**
5. Select **API 34 (Android 14)** or **API 33 (Android 13)**
6. If not installed, click **"Download"** and wait
7. Click **"Next"** → **"Finish"**

## Running the App

### Option 1: From Android Studio
1. **Start Metro Bundler** (in Android Studio Terminal):
   ```bash
   cd ..
   npm start
   ```
   Keep this terminal open!

2. **Select your AVD** from device dropdown (top toolbar)

3. Click **green play button** ▶️ (or **Shift + F10**)

4. **Wait 5-10 minutes** for first build

### Option 2: From Command Line
1. **Terminal 1** (Metro Bundler):
   ```bash
   cd "C:\Users\GWENJE\Desktop\Nerdx 1\NerdX\NerdXApp"
   npm start
   ```

2. **Terminal 2** (Build & Run):
   ```bash
   cd "C:\Users\GWENJE\Desktop\Nerdx 1\NerdX\NerdXApp"
   npm run android
   ```

## Troubleshooting

### Gradle Sync Failed
1. **File → Invalidate Caches / Restart**
2. Select **"Invalidate and Restart"**
3. After restart, sync again

### "SDK location not found"
- Set SDK location: **File → Project Structure → SDK Location**
- Path: `C:\Users\GWENJE\AppData\Local\Android\Sdk`

### "JAVA_HOME not set"
- **File → Settings → Build Tools → Gradle**
- Set **Gradle JDK** to **Java 17**

### Build Errors
1. Clean project: **Build → Clean Project**
2. Rebuild: **Build → Rebuild Project**

### Metro Bundler Issues
```bash
cd "C:\Users\GWENJE\Desktop\Nerdx 1\NerdX\NerdXApp"
npm start -- --reset-cache
```

## Expected First Build Time
- **First build**: 5-10 minutes
- **Subsequent builds**: 30 seconds - 2 minutes

## What You'll See
1. ✅ Gradle sync completes
2. ✅ AVD starts (emulator window opens)
3. ✅ Metro bundler compiles JavaScript
4. ✅ App builds and installs
5. ✅ App launches on emulator
6. ✅ You see the NerdX login screen!

## Next Steps
1. Test login/registration
2. Test API connection
3. Test quiz functionality
4. Build release APK

