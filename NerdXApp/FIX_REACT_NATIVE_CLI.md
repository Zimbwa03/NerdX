# 🔧 Fix: React Native CLI Not Found

## Problem
`'react-native' is not recognized as an internal or external command`

## Solution Applied
Updated `package.json` scripts to use `npx react-native` instead of `react-native`.

## Try Again

Now run:
```bash
cd NerdXApp
npm start
```

This will use `npx` to run the local React Native installation.

## Alternative: Install React Native CLI Globally

If you still have issues, install globally:
```bash
npm install -g react-native-cli
```

But using `npx` (as updated in package.json) is the recommended approach.

## Updated Commands

All scripts now use `npx`:
- `npm start` → Uses `npx react-native start`
- `npm run android` → Uses `npx react-native run-android`
- `npm run ios` → Uses `npx react-native run-ios`

## Test

Run this to verify:
```bash
cd NerdXApp
npm start
```

You should see Metro bundler starting!

