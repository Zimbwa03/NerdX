# Fix JAVA_HOME and Test Gradle

## Problem
Gradle is failing with: `ERROR: JAVA_HOME is set to an invalid directory`

## Solution

### Step 1: Set JAVA_HOME for Current Session

Open PowerShell in the `NerdXApp/android` directory and run:

```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
```

### Step 2: Verify Java Installation

```powershell
java -version
```

You should see:
```
java version "17.0.16" 2025-07-15 LTS
Java(TM) SE Runtime Environment (build 17.0.16+12-LTS-247)
Java HotSpot(TM) 64-Bit Server VM (build 17.0.16+12-LTS-247, mixed mode, sharing)
```

### Step 3: Test Gradle Wrapper

```powershell
.\gradlew.bat --version
```

This should download Gradle 8.3 (if not already cached) and show the Gradle version.

### Step 4: Set JAVA_HOME Permanently (Optional but Recommended)

**Option A: Using PowerShell (Run as Administrator)**

```powershell
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-17", [System.EnvironmentVariableTarget]::Machine)
```

**Option B: Using System Properties**
1. Press `Win + R`, type `sysdm.cpl`, press Enter
2. Go to "Advanced" tab → "Environment Variables"
3. Under "System variables", find or create `JAVA_HOME`
4. Set value to: `C:\Program Files\Java\jdk-17`
5. Click OK and restart your terminal/PowerShell

**Option C: Using the provided script**

Run the `set-java-home.ps1` script as Administrator:
```powershell
.\set-java-home.ps1
```

### Step 5: Test React Native Build

After setting JAVA_HOME, try building the app:

```powershell
cd ..  # Go back to NerdXApp root
npm run android
```

## Files Created/Fixed

✅ `gradle/wrapper/gradle-wrapper.jar` - Gradle wrapper JAR file
✅ `gradle/wrapper/gradle-wrapper.properties` - Gradle wrapper configuration
✅ `set-java-home.ps1` - Script to set JAVA_HOME permanently

## Troubleshooting

If Gradle still fails:
1. Make sure you're in the `NerdXApp/android` directory
2. Verify JAVA_HOME is set: `echo $env:JAVA_HOME`
3. Verify Java path exists: `Test-Path "C:\Program Files\Java\jdk-17"`
4. Try running `.\gradlew.bat --version` directly

