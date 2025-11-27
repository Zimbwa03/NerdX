# Azure Deployment - Quick Start Commands

## Prerequisites Check
```powershell
# Check if Azure CLI is installed
az --version

# Login to Azure
az login

# Verify your subscription
az account show
```

## Quick Deployment (Copy and Paste)

### 1. Set Variables (Update these with your values)
```powershell
$RESOURCE_GROUP = "nerdx-rg"
$APP_NAME = "nerdx-app-yourname"  # Change 'yourname' to something unique
$LOCATION = "eastus"
$PLAN_NAME = "nerdx-plan"
```

### 2. Create Resources
```powershell
# Create resource group
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create App Service plan (Free tier)
az appservice plan create `
  --name $PLAN_NAME `
  --resource-group $RESOURCE_GROUP `
  --sku F1 `
  --is-linux

# Create web app
az webapp create `
  --resource-group $RESOURCE_GROUP `
  --plan $PLAN_NAME `
  --name $APP_NAME `
  --runtime "PYTHON:3.13"
```

### 3. Configure App Settings
```powershell
# Set environment variables (update with your actual values)
az webapp config appsettings set `
  --resource-group $RESOURCE_GROUP `
  --name $APP_NAME `
  --settings `
    DEEPSEEK_API_KEY="your_deepseek_key_here" `
    GEMINI_API_KEY="your_gemini_key_here" `
    SUPABASE_URL="your_supabase_url_here" `
    SUPABASE_SERVICE_ROLE_KEY="your_supabase_key_here" `
    DATABASE_URL="your_database_url_here" `
    JWT_SECRET="your_jwt_secret_here" `
    SESSION_SECRET="your_session_secret_here" `
    FLASK_ENV="production" `
    FLASK_DEBUG="false" `
    SCM_DO_BUILD_DURING_DEPLOYMENT="true" `
    WEBSITE_HTTPLOGGING_RETENTION_DAYS="7"
```

### 4. Configure Startup Command
```powershell
az webapp config set `
  --resource-group $RESOURCE_GROUP `
  --name $APP_NAME `
  --startup-file "gunicorn main:app --bind 0.0.0.0:8000 --workers 1 --timeout 180 --preload"
```

### 5. Deploy from Local Git
```powershell
# Enable local git deployment
az webapp deployment source config-local-git `
  --name $APP_NAME `
  --resource-group $RESOURCE_GROUP

# Get deployment credentials
az webapp deployment list-publishing-credentials `
  --name $APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --query "{username:publishingUserName, password:publishingPassword}" `
  --output table

# Add Azure remote and push
cd "c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX"
git remote add azure https://$APP_NAME.scm.azurewebsites.net:443/$APP_NAME.git
git push azure main
```

### 6. Monitor Deployment
```powershell
# Enable logging
az webapp log config `
  --name $APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --application-logging filesystem `
  --level information

# Stream logs
az webapp log tail `
  --name $APP_NAME `
  --resource-group $RESOURCE_GROUP
```

### 7. Test Your App
```powershell
# Get app URL
az webapp show `
  --name $APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --query "defaultHostName" `
  --output tsv

# Open in browser
start "https://$APP_NAME.azurewebsites.net"
```

## Useful Commands

### View App Status
```powershell
az webapp show --name $APP_NAME --resource-group $RESOURCE_GROUP
```

### Restart App
```powershell
az webapp restart --name $APP_NAME --resource-group $RESOURCE_GROUP
```

### View Configuration
```powershell
az webapp config appsettings list `
  --name $APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --output table
```

### Update Environment Variable
```powershell
az webapp config appsettings set `
  --name $APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --settings KEY_NAME="new_value"
```

### Delete Everything (Start Over)
```powershell
az group delete --name $RESOURCE_GROUP --yes --no-wait
```

## Troubleshooting

### Check Logs
```powershell
# Stream live logs
az webapp log tail --name $APP_NAME --resource-group $RESOURCE_GROUP

# Download logs
az webapp log download --name $APP_NAME --resource-group $RESOURCE_GROUP
```

### SSH into Container
```powershell
az webapp ssh --name $APP_NAME --resource-group $RESOURCE_GROUP
```

### Check Health
```powershell
# Test health endpoint
curl "https://$APP_NAME.azurewebsites.net/health"
```
