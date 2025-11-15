# Building NerdX Android App

## Fixed Build Issue

The original error was caused by running the Gradle wrapper from the wrong directory. The `gradlew.bat` file is located in the `NerdXApp/android/` directory.

## How to Build

### Option 1: Use the provided build script (Recommended)

From the `NerdXApp/android/` directory:

**Windows Command Prompt:**
```cmd
build.bat
```

**PowerShell:**
```powershell
.\build.ps1
```

### Option 2: Manual commands

From the `NerdXApp/android/` directory:

```cmd
gradlew.bat clean
gradlew.bat assembleDebug
```

## Troubleshooting

- Make sure you're in the `NerdXApp/android/` directory
- Ensure Java 17 is installed (it's already configured in gradle.properties)
- The build may take several minutes on first run as Gradle downloads dependencies

## Build Output

The APK will be generated in: `NerdXApp/android/app/build/outputs/apk/debug/`
