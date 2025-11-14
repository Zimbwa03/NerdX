# 🚀 How to Run NerdX Mobile App

## Fixed: React Native CLI Issue ✅

The `package.json` has been updated to use `npx react-native` instead of `react-native`.

## Run Metro Bundler

```bash
cd NerdXApp
npm start
```

This will start the Metro bundler (React Native's JavaScript server).

## Run on Android

### Option 1: Using npm script
```bash
cd NerdXApp
npm run android
```

### Option 2: Using Android Studio
1. Start Metro: `npm start` (in terminal)
2. Click ▶️ Run button in Android Studio
3. Select your AVD

## What You'll See

1. **Metro Bundler starts**:
   ```
   Metro waiting on exp://192.168.x.x:8081
   ```

2. **Android build starts**:
   - Gradle builds native code
   - Installs on emulator
   - Launches app

3. **App appears** on emulator with NerdX login screen!

## Troubleshooting

### Still getting "react-native not recognized"?
The scripts are now fixed, but if you still see errors:
```bash
cd NerdXApp
npm install
```

### Metro bundler won't start?
```bash
cd NerdXApp
npm start -- --reset-cache
```

### Build fails in Android Studio?
1. **File → Invalidate Caches → Invalidate and Restart**
2. Then try running again

## Quick Commands

```bash
# Start Metro (Terminal 1)
cd NerdXApp
npm start

# Run Android (Terminal 2)
cd NerdXApp
npm run android
```

## ✅ Fixed!

The `package.json` scripts now use `npx`, so everything should work!

