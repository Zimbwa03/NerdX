# 🚀 START HERE - Open NerdX App in Android Studio

## ✅ Prerequisites (You Have These!)
- ✅ Android Studio installed
- ✅ Android SDK downloaded
- ✅ Project committed to GitHub

## 📂 Step-by-Step: Open in Android Studio

### Step 1: Launch Android Studio
Open Android Studio application

### Step 2: Open Project
1. Click **"Open"** button (or **File → Open**)
2. Navigate to this folder:
   ```
   C:\Users\GWENJE\Desktop\Nerdx 1\NerdX\NerdXApp\android
   ```
3. **Select the `android` folder** (not NerdXApp, but the android subfolder)
4. Click **"OK"**

### Step 3: Wait for Gradle Sync
- Android Studio will detect it's a Gradle project
- You'll see: **"Gradle files have changed since last project sync"**
- Click **"Sync Now"** or the **elephant icon** 🐘 in the toolbar
- **Wait 2-5 minutes** for first sync (downloads dependencies)

### Step 4: Create Android Virtual Device (AVD)

1. Click **Tools → Device Manager** (or device icon in toolbar)
2. Click **"+ Create Device"**
3. **Select Hardware**: Choose **Pixel 5** or **Pixel 6**
4. Click **"Next"**
5. **Select System Image**:
   - Choose **API 34 (Android 14)** or **API 33 (Android 13)**
   - If not installed, click **"Download"** (this takes a few minutes)
   - Wait for download to complete
6. Click **"Next"**
7. **AVD Configuration**:
   - Name: `NerdX_Emulator` (or any name you like)
   - Click **"Finish"**

### Step 5: Start Metro Bundler

**In Android Studio Terminal** (bottom panel):
```bash
cd ..
npm start
```

**Note**: The scripts now use `npx` automatically, so `react-native` command will work.

**Keep this terminal open!** Metro bundler must keep running.

### Step 6: Run the App

1. **Select your AVD** from the device dropdown (top toolbar, next to the run button)
2. Click the **green play button** ▶️ (or press **Shift + F10**)
3. **Wait 5-10 minutes** for first build (subsequent builds are faster)

## 🎯 What Happens Next

1. ✅ Gradle builds the Android app
2. ✅ Metro bundler loads JavaScript
3. ✅ Emulator starts (if not already running)
4. ✅ App installs on emulator
5. ✅ **NerdX login screen appears!** 🎉

## 📱 Alternative: Command Line Method

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

## 🔧 Common Issues & Fixes

### "SDK location not found"
1. **File → Project Structure → SDK Location**
2. Set to: `C:\Users\GWENJE\AppData\Local\Android\Sdk`
3. Click **"Apply"**

### Gradle Sync Failed
```bash
cd "C:\Users\GWENJE\Desktop\Nerdx 1\NerdX\NerdXApp\android"
.\gradlew clean
```
Then sync again in Android Studio.

### Build Errors
- Check **Build** tab at bottom for specific errors
- Common fix: **File → Invalidate Caches → Invalidate and Restart**

### Metro Bundler Issues
```bash
cd "C:\Users\GWENJE\Desktop\Nerdx 1\NerdX\NerdXApp"
npm start -- --reset-cache
```

### Emulator Won't Start
1. **Tools → Device Manager**
2. Click **▶️** (play icon) next to your AVD
3. Or try **"Cold Boot Now"**

## 📊 Project Structure

When opened in Android Studio, you'll see:
```
android/
├── app/                    ← Main Android app module
│   ├── build.gradle        ← App configuration
│   └── src/
│       └── main/
│           ├── AndroidManifest.xml
│           └── java/com/nerdxapp/
├── build.gradle            ← Project-level config
└── settings.gradle         ← Module settings
```

## ⏱️ Timeline

- **Open Project**: 30 seconds
- **Gradle Sync**: 2-5 minutes (first time)
- **Create AVD**: 2-3 minutes
- **First Build**: 5-10 minutes
- **App Launch**: Success! 🎉

## ✅ Checklist

- [ ] Android Studio opened
- [ ] Project opened (`NerdXApp/android` folder)
- [ ] Gradle sync completed
- [ ] AVD created
- [ ] Metro bundler started (`npm start`)
- [ ] App running on emulator

## 🎉 Success!

Once you see the NerdX login screen on the emulator, you're all set!

## 📚 More Help

- **Detailed Guide**: See `ANDROID_STUDIO_SETUP.md`
- **Quick Reference**: See `ANDROID_STUDIO_QUICK_GUIDE.md`
- **Troubleshooting**: Check Android Studio's Build tab for errors

## 🚀 Next Steps After App Launches

1. Test login/registration
2. Test API connection
3. Test quiz features
4. Build release APK

**You're ready to go! Open Android Studio and follow the steps above!** 🎊

