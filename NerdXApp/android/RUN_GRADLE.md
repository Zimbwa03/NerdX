# How to Run Gradle Wrapper

## Important: You're in the wrong directory!

The `gradlew.bat` file is located in `NerdXApp\android\` directory, not in the root.

## Steps to Run Gradle:

1. **Navigate to the android directory:**
   ```powershell
   cd NerdXApp\android
   ```

2. **Set JAVA_HOME for this session:**
   ```powershell
   $env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
   ```

3. **Verify JAVA_HOME is set:**
   ```powershell
   echo $env:JAVA_HOME
   ```
   Should show: `C:\Program Files\Java\jdk-17`

4. **Run Gradle wrapper:**
   ```powershell
   .\gradlew.bat --version
   ```

## Note About Gradle Version

⚠️ **Warning**: You've changed the Gradle version to `9.0-milestone-1` in `gradle-wrapper.properties`. 

React Native 0.73.0 is tested with Gradle 8.3. Using Gradle 9.0-milestone-1 (a pre-release version) may cause compatibility issues.

**Recommended**: Change it back to Gradle 8.3:
```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.3-all.zip
```

## Quick Test Command (All in One)

From the root directory (`C:\Users\GWENJE\Desktop\Nerdx 1\NerdX`):

```powershell
cd NerdXApp\android; $env:JAVA_HOME = "C:\Program Files\Java\jdk-17"; .\gradlew.bat --version
```

## If You See "Terminate batch job (Y/N)?"

This means a previous Gradle process is still running. Press `Y` to terminate it, or close and reopen PowerShell.

