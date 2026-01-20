# Quick EAS Init Script
# This will initialize a new EAS project and automatically remove old project IDs

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  EAS Project Initialization" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectDir = "c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\NerdXApp"
Set-Location $projectDir

# Check if logged in
Write-Host "Step 1: Checking login status..." -ForegroundColor Yellow
$whoamiOutput = eas whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "You are not logged in. Please login first:" -ForegroundColor Red
    Write-Host "  eas login" -ForegroundColor White
    exit 1
} else {
    $currentUser = $whoamiOutput | Select-String -Pattern "^\w+" | ForEach-Object { $_.Matches.Value }
    Write-Host "Logged in as: $currentUser" -ForegroundColor Green
}
Write-Host ""

# Step 2: Remove old project ID and owner from app.json
Write-Host "Step 2: Cleaning up old project configuration..." -ForegroundColor Yellow
$appJsonPath = Join-Path $projectDir "app.json"

if (Test-Path $appJsonPath) {
    try {
        $appJsonContent = Get-Content $appJsonPath -Raw
        $appJson = $appJsonContent | ConvertFrom-Json
        
        $removedItems = @()
        
        # Check and remove old project ID
        if ($appJson.expo.extra -and $appJson.expo.extra.eas -and $appJson.expo.extra.eas.projectId) {
            $oldProjectId = $appJson.expo.extra.eas.projectId
            $removedItems += "Project ID: $oldProjectId"
            $appJson.expo.PSObject.Properties.Remove('extra')
        }
        
        # Check and remove old owner
        if ($appJson.expo.owner) {
            $oldOwner = $appJson.expo.owner
            $removedItems += "Owner: $oldOwner"
            $appJson.expo.PSObject.Properties.Remove('owner')
        }
        
        if ($removedItems.Count -gt 0) {
            # Save the cleaned app.json
            $jsonContent = $appJson | ConvertTo-Json -Depth 10
            # Fix formatting to match original style
            $jsonContent = $jsonContent -replace '"\s*:\s*', '": ' -replace ',\s*"', ', "'
            Set-Content -Path $appJsonPath -Value $jsonContent -NoNewline
            
            Write-Host "Removed old configuration:" -ForegroundColor Green
            foreach ($item in $removedItems) {
                Write-Host "  - $item" -ForegroundColor Gray
            }
        } else {
            Write-Host "No old project configuration found" -ForegroundColor Green
        }
    } catch {
        Write-Host "Warning: Could not parse app.json: $_" -ForegroundColor Yellow
        Write-Host "Continuing anyway..." -ForegroundColor Yellow
    }
} else {
    Write-Host "Warning: app.json not found at $appJsonPath" -ForegroundColor Yellow
}
Write-Host ""

# Step 3: Initialize new EAS project
Write-Host "Step 3: Initializing new EAS project..." -ForegroundColor Yellow
Write-Host "  This will create a new project ID for your app" -ForegroundColor Gray
Write-Host "  When prompted, answer 'n' (no) to link existing project" -ForegroundColor Cyan
Write-Host "  This ensures a fresh project ID is created for account: $currentUser" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host ""
eas init

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  EAS project initialized successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your app.json has been updated with:" -ForegroundColor Cyan
    Write-Host "  - New project ID" -ForegroundColor White
    Write-Host "  - Account: $currentUser" -ForegroundColor White
    Write-Host ""
    Write-Host "You can now build your APK with:" -ForegroundColor Cyan
    Write-Host "  .\build-apk.ps1" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "Initialization failed. Please check the error above." -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  - Make sure you answered 'n' when asked to link existing project" -ForegroundColor Gray
    Write-Host "  - Check that you're logged into the correct account" -ForegroundColor Gray
    exit 1
}
