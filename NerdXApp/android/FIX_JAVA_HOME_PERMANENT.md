# Fix JAVA_HOME Permanently

## ✅ Current Session Fixed
JAVA_HOME has been set for this PowerShell session: `C:\Program Files\Java\jdk-17`

## ⚠️ Important: Make It Permanent

The fix above only works for the current PowerShell session. To make it permanent:

### Option 1: System Environment Variables (Recommended)
1. Press `Win + R`
2. Type `sysdm.cpl` and press Enter
3. Click "Advanced" tab
4. Click "Environment Variables" button
5. Under "System variables", find `JAVA_HOME`
6. Click "Edit"
7. Change value to: `C:\Program Files\Java\jdk-17`
8. Click "OK" → "OK"
9. **Restart PowerShell** for changes to take effect

### Option 2: PowerShell Command (Run as Administrator)
```powershell
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-17", [System.EnvironmentVariableTarget]::Machine)
```
Then restart PowerShell.

### Option 3: Set for Current User Only
```powershell
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-17", [System.EnvironmentVariableTarget]::User)
```
Then restart PowerShell.

## Verify Permanent Fix
After restarting PowerShell:
```powershell
echo $env:JAVA_HOME
# Should show: C:\Program Files\Java\jdk-17
```

## Current Status
- ✅ JAVA_HOME set for this session
- ✅ Gradle working
- ⏳ Need to set permanently for future sessions

