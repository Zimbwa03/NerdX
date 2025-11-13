# Flutter Setup Guide for NerdX Mobile Application

## 📱 Step 1: Install Flutter on Windows

### Prerequisites
- Windows 10 or later (64-bit)
- Git for Windows
- PowerShell 5.0 or later (already installed on Windows 10)

### Installation Steps

#### Option A: Using Git (Recommended)
1. **Download Flutter SDK:**
   - Visit: https://docs.flutter.dev/get-started/install/windows
   - Download the latest stable Flutter SDK zip file
   - Extract it to a location like `C:\src\flutter` (avoid spaces in path)

2. **Add Flutter to PATH:**
   - Open "Environment Variables" (search in Windows)
   - Under "System variables", find "Path" and click "Edit"
   - Click "New" and add: `C:\src\flutter\bin`
   - Click "OK" to save

3. **Verify Installation:**
   ```powershell
   flutter --version
   flutter doctor
   ```

#### Option B: Using Chocolatey (Easier)
```powershell
# Install Chocolatey first (if not installed)
# Run PowerShell as Administrator, then:
choco install flutter
```

### Step 2: Install Additional Tools

Flutter requires:
- **Android Studio** (for Android development)
  - Download: https://developer.android.com/studio
  - Install Android SDK, Android SDK Platform-Tools, and Android Emulator

- **VS Code** (optional, but recommended)
  - Install Flutter extension in VS Code/Cursor

### Step 3: Run Flutter Doctor

After installation, run:
```powershell
flutter doctor
```

This will check your setup and guide you through any missing components.

### Step 4: Accept Android Licenses

```powershell
flutter doctor --android-licenses
```

## 🚀 Step 2: Create Flutter Project

Once Flutter is installed, we'll create the NerdX mobile app project.

## 📁 Project Structure

The Flutter project will be created in a `mobile_app` directory to keep it separate from your backend.

## 🔧 Next Steps

After Flutter installation:
1. Run `flutter doctor` to verify setup
2. We'll create the Flutter project structure
3. Set up the initial app configuration
4. Connect it to your existing NerdX backend API

