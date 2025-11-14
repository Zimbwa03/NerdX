# Fix: app/build.gradle React Block

## Problem
Error: `Could not set unknown property 'cliPath' for extension 'react'`

The `react` block in `app/build.gradle` was using properties that don't exist in React Native 0.73.0.

## Solution Applied

✅ **Updated `app/build.gradle` to match React Native 0.73.0 template**

### Changes Made:

1. **Removed unsupported properties:**
   - ❌ Removed `cliPath` (doesn't exist)
   - ✅ Changed to use `cliFile` (commented out, using default)

2. **Updated react block:**
   - ✅ Commented out all properties (using defaults)
   - ✅ Matches React Native 0.73.0 template structure

3. **Fixed android block:**
   - ✅ Changed `compileSdkVersion` → `compileSdk` (correct for RN 0.73.0)

4. **Added native modules:**
   - ✅ Added `applyNativeModulesAppBuildGradle(project)` at the end

## Current Configuration

The `react` block now uses all defaults:
- `root` = `../` (default)
- `reactNativeDir` = `../node_modules/react-native` (default)
- `codegenDir` = `../node_modules/@react-native/codegen` (default)
- `cliFile` = `../node_modules/react-native/cli.js` (default)

## Next Steps

1. **In Android Studio:**
   - Click **"Sync Now"** or the Gradle sync button
   - The sync should now succeed

2. **If sync still fails:**
   - **File → Invalidate Caches / Restart**
   - After restart, sync again

## Why This Works

React Native 0.73.0's Gradle plugin automatically detects the correct paths, so you don't need to specify them explicitly. The template shows all properties commented out, meaning defaults are used.

