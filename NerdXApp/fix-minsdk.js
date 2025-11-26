#!/usr/bin/env node

/**
 * This script fixes the minSdkVersion for ONNX Runtime compatibility
 * Run with: node fix-minsdk.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing minSdkVersion for ONNX Runtime...\n');

// Update app.json
const appJsonPath = path.join(__dirname, 'app.json');
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

if (!appJson.expo.android) {
    appJson.expo.android = {};
}
appJson.expo.android.minSdkVersion = 24;

fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
console.log('✅ Updated app.json with minSdkVersion: 24');

// Update build.gradle if it exists
const buildGradlePath = path.join(__dirname, 'android', 'build.gradle');
if (fs.existsSync(buildGradlePath)) {
    let buildGradle = fs.readFileSync(buildGradlePath, 'utf8');

    // Replace minSdkVersion = 23 with minSdkVersion = 24
    buildGradle = buildGradle.replace(/minSdkVersion\s*=\s*23/g, 'minSdkVersion = 24');

    fs.writeFileSync(buildGradlePath, buildGradle);
    console.log('✅ Updated android/build.gradle');
}

// Update app/build.gradle if it exists
const appBuildGradlePath = path.join(__dirname, 'android', 'app', 'build.gradle');
if (fs.existsSync(appBuildGradlePath)) {
    let appBuildGradle = fs.readFileSync(appBuildGradlePath, 'utf8');

    // Replace minSdkVersion = 23 with minSdkVersion = 24
    appBuildGradle = appBuildGradle.replace(/minSdkVersion\s*=\s*23/g, 'minSdkVersion = 24');
    appBuildGradle = appBuildGradle.replace(/minSdkVersion:\s*23/g, 'minSdkVersion: 24');

    fs.writeFileSync(appBuildGradlePath, appBuildGradle);
    console.log('✅ Updated android/app/build.gradle');
}

console.log('\n✨ Done! Now run:');
console.log('   eas build --platform android --profile preview --clear-cache\n');
