# NerdXApp - Pre-Build Verification Script
# Run this before EAS build to ensure everything is ready

Write-Host "🚀 NerdX App - Pre-Build Verification" -ForegroundColor Cyan
Write-Host "======================================`n" -ForegroundColor Cyan

$errors = 0

# 1. Check Node Modules
Write-Host "📦 Checking node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✅ node_modules found" -ForegroundColor Green
} else {
    Write-Host "❌ node_modules not found. Run: npm install" -ForegroundColor Red
    $errors++
}

# 2. Check package.json dependencies
Write-Host "`n📋 Verifying critical dependencies..." -ForegroundColor Yellow
$packageJson = Get-Content "package.json" | ConvertFrom-Json

$requiredDeps = @(
    "@react-native-async-storage/async-storage",
    "@react-navigation/native",
    "@react-navigation/stack",
    "axios",
    "expo",
    "react-native-gesture-handler",
    "react-native-reanimated"
)

foreach ($dep in $requiredDeps) {
    if ($packageJson.dependencies.PSObject.Properties.Name -contains $dep) {
        Write-Host "✅ $dep" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing: $dep" -ForegroundColor Red
        $errors++
    }
}

# 3. Check for console.logs in source files
Write-Host "`n🔍 Checking for console.log statements..." -ForegroundColor Yellow
$consoleLogs = Get-ChildItem -Path "src" -Recurse -Include *.tsx,*.ts | Select-String -Pattern "console\.log" -SimpleMatch

if ($consoleLogs.Count -eq 0) {
    Write-Host "✅ No console.log statements found" -ForegroundColor Green
} else {
    Write-Host "⚠️  Found $($consoleLogs.Count) console.log statements" -ForegroundColor Yellow
    Write-Host "   Consider removing them for production" -ForegroundColor Yellow
}

# 4. Check app.json configuration
Write-Host "`n⚙️  Checking app.json..." -ForegroundColor Yellow
if (Test-Path "app.json") {
    $appJson = Get-Content "app.json" | ConvertFrom-Json
    
    if ($appJson.expo.name) {
        Write-Host "✅ App name: $($appJson.expo.name)" -ForegroundColor Green
    }
    
    if ($appJson.expo.version) {
        Write-Host "✅ Version: $($appJson.expo.version)" -ForegroundColor Green
    }
    
    if ($appJson.expo.extra.eas.projectId) {
        Write-Host "✅ EAS Project ID configured" -ForegroundColor Green
    } else {
        Write-Host "❌ EAS Project ID missing" -ForegroundColor Red
        $errors++
    }
} else {
    Write-Host "❌ app.json not found" -ForegroundColor Red
    $errors++
}

# 5. Check for required screens
Write-Host "`n📱 Verifying screen files..." -ForegroundColor Yellow
$requiredScreens = @(
    "src/screens/LoginScreen.tsx",
    "src/screens/DashboardScreen.tsx",
    "src/screens/ProjectAssistantScreen.tsx",
    "src/screens/ProjectAssistantSetupScreen.tsx",
    "src/screens/ProjectListScreen.tsx"
)

foreach ($screen in $requiredScreens) {
    if (Test-Path $screen) {
        Write-Host "✅ $(Split-Path $screen -Leaf)" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing: $(Split-Path $screen -Leaf)" -ForegroundColor Red
        $errors++
    }
}

# 6. Check navigation setup
Write-Host "`n🧭 Checking navigation..." -ForegroundColor Yellow
if (Test-Path "src/navigation/AppNavigator.tsx") {
    $navContent = Get-Content "src/navigation/AppNavigator.tsx" -Raw
    
    if ($navContent -match "ProjectListScreen") {
        Write-Host "✅ ProjectListScreen registered" -ForegroundColor Green
    } else {
        Write-Host "❌ ProjectListScreen not in navigation" -ForegroundColor Red
        $errors++
    }
    
    if ($navContent -match "ProjectAssistantScreen") {
        Write-Host "✅ ProjectAssistantScreen registered" -ForegroundColor Green
    } else {
        Write-Host "❌ ProjectAssistantScreen not in navigation" -ForegroundColor Red
        $errors++
    }
} else {
    Write-Host "❌ AppNavigator.tsx not found" -ForegroundColor Red
    $errors++
}

# 7. Check API configuration
Write-Host "`n🌐 Checking API configuration..." -ForegroundColor Yellow
if (Test-Path "src/services/api/config.ts") {
    Write-Host "✅ API config found" -ForegroundColor Green
} else {
    Write-Host "⚠️  API config not found at expected location" -ForegroundColor Yellow
}

# Final Summary
Write-Host "`n======================================" -ForegroundColor Cyan
if ($errors -eq 0) {
    Write-Host "✅ All checks passed! Ready for EAS build" -ForegroundColor Green
    Write-Host "`n🚀 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Run: eas build --platform android --profile preview" -ForegroundColor White
    Write-Host "   2. Or: eas build --platform all" -ForegroundColor White
} else {
    Write-Host "❌ Found $errors error(s). Please fix before building" -ForegroundColor Red
    exit 1
}
