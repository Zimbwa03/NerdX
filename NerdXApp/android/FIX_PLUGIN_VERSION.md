# Fix: React Native Gradle Plugin Version

## Problem
Gradle can't find `com.facebook.react:react-native-gradle-plugin` because no version is specified.

## Solution Applied

✅ **Added version to React Native Gradle plugin**: `0.73.0`

Updated `build.gradle`:
```gradle
classpath("com.facebook.react:react-native-gradle-plugin:0.73.0")
```

## Changes Made

### `build.gradle`
- Changed from: `classpath("com.facebook.react:react-native-gradle-plugin")`
- Changed to: `classpath("com.facebook.react:react-native-gradle-plugin:0.73.0")`

### Repository Configuration
- Removed local React Native maven repository (not needed for RN 0.71+)
- Using `mavenCentral()` and `google()` repositories only
- React Native artifacts are distributed via Maven Central starting from 0.71

## Next Steps

1. **In Android Studio:**
   - Click **"Sync Now"** or the Gradle sync button
   - The plugin should now be resolved from Maven Central

2. **If sync still fails:**
   - Check your internet connection (Maven Central needs to be accessible)
   - **File → Invalidate Caches / Restart**
   - After restart, sync again

## Why This Works

Starting from React Native 0.71, Android artifacts (including the Gradle plugin) are distributed via Maven Central, not from local `node_modules`. The plugin needs a version number to be resolved correctly from Maven Central.

## Current Configuration

- ✅ Repositories: `google()`, `mavenCentral()`, and JSC maven repository
- ✅ Plugin version: `0.73.0` (matches React Native version)
- ✅ PluginManagement: Uses `gradlePluginPortal()`, `mavenCentral()`, `google()`

