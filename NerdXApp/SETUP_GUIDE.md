# NerdX Mobile App - Setup Guide

## Prerequisites

1. **Node.js** (v18 or higher) - ✅ Already installed
2. **npm** - ✅ Already installed
3. **Android Studio** - For Android development
4. **Java Development Kit (JDK)** - Usually comes with Android Studio

## Installation Steps

### 1. Install Dependencies

```bash
cd NerdXApp
npm install
```

### 2. Install React Native CLI (if not already installed)

```bash
npm install -g react-native-cli
```

### 3. Android Setup

#### Install Android Studio
1. Download from: https://developer.android.com/studio
2. Install Android Studio
3. Open Android Studio and install:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)

#### Configure Android Environment Variables
Add to your system PATH:
- `ANDROID_HOME` = `C:\Users\YourUsername\AppData\Local\Android\Sdk`
- Add to PATH: `%ANDROID_HOME%\platform-tools` and `%ANDROID_HOME%\tools`

### 4. Configure API Base URL

Edit `src/services/api/config.ts` and update:
```typescript
export const API_BASE_URL = __DEV__
  ? 'http://YOUR_LOCAL_IP:5000'  // Your Flask backend URL
  : 'https://your-production-api.com';
```

**Important**: For Android emulator, use `http://10.0.2.2:5000` instead of `localhost`
For physical device, use your computer's IP address (e.g., `http://192.168.1.100:5000`)

### 5. Run the App

#### Start Metro Bundler
```bash
npm start
```

#### Run on Android
```bash
npm run android
```

Or open Android Studio, open the `android` folder, and run from there.

## Backend API Setup

Before running the mobile app, ensure your Flask backend has the mobile API endpoints:

1. Create `api/mobile.py` in your Flask backend
2. Implement the endpoints defined in the API service files
3. Register the blueprint in `routes.py`:
   ```python
   from api.mobile import mobile_bp
   app.register_blueprint(mobile_bp, url_prefix='/api/mobile')
   ```

## Building APK

### Debug APK
```bash
cd android
./gradlew assembleDebug
```
APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK
1. Generate signing key:
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Update `android/app/build.gradle` with signing config
3. Build:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

## Troubleshooting

### Metro bundler issues
```bash
npm start -- --reset-cache
```

### Android build issues
```bash
cd android
./gradlew clean
cd ..
npm start
```

### Node modules issues
```bash
rm -rf node_modules
npm install
```

## Project Structure

```
NerdXApp/
├── src/
│   ├── components/      # Reusable UI components
│   ├── screens/         # Screen components
│   ├── services/        # API services
│   ├── navigation/      # Navigation setup
│   ├── context/         # React Context providers
│   ├── theme/           # Theme configuration
│   └── types/           # TypeScript types
├── android/             # Android native code
├── ios/                 # iOS native code (for future)
└── package.json         # Dependencies
```

## Next Steps

1. Install dependencies: `npm install`
2. Update API base URL in `src/services/api/config.ts`
3. Set up Android development environment
4. Run `npm start` then `npm run android`
5. Implement backend mobile API endpoints
6. Test all features
7. Build release APK

## Support

For issues, check:
- React Native docs: https://reactnative.dev/docs/getting-started
- Android setup: https://reactnative.dev/docs/environment-setup

