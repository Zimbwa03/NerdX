# Install React Native Gradle Plugin

## Problem
Gradle can't find `com.facebook.react:react-native-gradle-plugin`

## Solution

The React Native Gradle plugin needs to be properly installed. Try these steps:

### Step 1: Reinstall node_modules
```bash
cd NerdXApp
rm -rf node_modules
npm install
```

### Step 2: Check if plugin is installed
The plugin should be available at:
- `node_modules/@react-native/gradle-plugin` (for newer versions)
- Or resolved from `node_modules/react-native/android` maven repository

### Step 3: Sync Gradle in Android Studio
After reinstalling, sync Gradle again in Android Studio.

## Alternative: Use React Native Template Structure

If the plugin still can't be found, we may need to ensure the project structure matches the React Native template exactly. The template uses:

```gradle
// settings.gradle
includeBuild('../node_modules/@react-native/gradle-plugin')
```

But this requires the `@react-native/gradle-plugin` package to exist in node_modules.

## Current Configuration

- ✅ `pluginManagement` block in `settings.gradle` includes React Native maven repository
- ✅ `buildscript` repositories include React Native maven repository  
- ✅ Plugin referenced as: `classpath("com.facebook.react:react-native-gradle-plugin")`

The plugin should be resolved from the local maven repository at `node_modules/react-native/android`.

