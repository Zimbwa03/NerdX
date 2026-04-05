# Install ngrok on Windows

## Quick Installation Methods

### Method 1: Direct Download (Easiest)

1. Go to: https://ngrok.com/download
2. Download the Windows version
3. Extract `ngrok.exe` to a folder (e.g., `C:\ngrok\`)
4. Add to PATH or use full path

### Method 2: Using Chocolatey (If you have it)

```powershell
choco install ngrok
```

### Method 3: Using Scoop (If you have it)

```powershell
scoop install ngrok
```

### Method 4: Manual Installation

1. Download from: https://ngrok.com/download
2. Extract `ngrok.exe` to `C:\ngrok\` (or any folder)
3. Add to PATH:
   - Open System Properties → Environment Variables
   - Add `C:\ngrok\` to PATH
   - Or use full path: `C:\ngrok\ngrok.exe http 5000`

## Quick Test After Installation

```powershell
# Test if ngrok is installed
ngrok version

# If not in PATH, use full path
C:\ngrok\ngrok.exe version
```

## Alternative: Use ngrok Without PATH

If you don't want to add to PATH, you can:

1. Download ngrok.exe to your project folder
2. Use it directly:
   ```powershell
   .\ngrok.exe http 5000
   ```

## After Installation

Once ngrok is installed, you can:

1. Start your local server: `python main.py`
2. In another terminal: `ngrok http 5000`
3. Copy the HTTPS URL and use it in Twilio
