# 🚀 Quick Start - Android Studio

## Open Project

1. **Open Android Studio**
2. **File → Open**
3. Navigate to: `C:\Users\GWENJE\Desktop\Nerdx 1\NerdX\NerdXApp\android`
4. Select the **`android`** folder
5. Click **OK**

## First Time Setup

1. **Wait for Gradle Sync** (2-5 minutes)
2. **Create AVD**:
   - Tools → Device Manager → Create Device
   - Select Pixel 5
   - Download API 34 system image
   - Finish

## Run App

**Option 1: Android Studio**
1. Start Metro: Terminal → `npm start` (from NerdXApp folder)
2. Click ▶️ Run button
3. Select your AVD

**Option 2: Command Line**
```bash
# Terminal 1
cd NerdXApp
npm start

# Terminal 2
cd NerdXApp
npm run android
```

## First Build

- Takes 5-10 minutes
- Downloads dependencies
- Builds native code
- Installs on emulator

**Be patient!** ⏳

## Troubleshooting

**Gradle sync fails?**
```bash
cd NerdXApp/android
./gradlew clean
```

**Metro bundler issues?**
```bash
cd NerdXApp
npm start -- --reset-cache
```

## That's It!

Once the app launches, you'll see the NerdX login screen! 🎉

