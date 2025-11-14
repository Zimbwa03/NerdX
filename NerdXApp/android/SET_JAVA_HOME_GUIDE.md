# Set JAVA_HOME Environment Variable

## Current Issue
Gradle is still seeing the wrong JAVA_HOME path despite the gradle.properties setting.

## Solution: Set Environment Variable

### Option 1: For Current Session (Temporary)
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17.0.16"
```

### Option 2: Set Permanently (Recommended)

#### Method A: PowerShell (Run as Administrator)
```powershell
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-17.0.16", [System.EnvironmentVariableTarget]::Machine)
```

#### Method B: System Properties
1. Press `Win + R`, type `sysdm.cpl`, press Enter
2. Go to "Advanced" tab → "Environment Variables"
3. Under "System variables", click "New"
4. Variable name: `JAVA_HOME`
5. Variable value: `C:\Program Files\Java\jdk-17.0.16`
6. Click "OK" and restart PowerShell

#### Method C: Using setx Command
```cmd
setx JAVA_HOME "C:\Program Files\Java\jdk-17.0.16" /M
```

## Verification

After setting, verify with:
```powershell
echo $env:JAVA_HOME
java -version
```

Should show:
```
C:\Program Files\Java\jdk-17.0.16
java version "17.0.16" 2025-07-15 LTS
```

## Alternative: Remove gradle.properties JAVA_HOME

If environment variable doesn't work, remove this line from `gradle.properties`:
```properties
org.gradle.java.home=C:\Program Files\Java\jdk-17.0.16
```

Then set the environment variable and restart Android Studio.

## Test Build

After setting JAVA_HOME:
```bash
cd NerdXApp/android
.\gradlew --version
```

If successful, then:
```bash
.\gradlew assembleDebug
```
