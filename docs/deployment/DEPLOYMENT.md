# NerdX Bot Deployment Guide for Render

## Prerequisites
- Python 3.13.0 (Render default)
- All dependencies listed in `requirements.txt`
- Environment variables configured

## Deployment Steps

### 1. Render Dashboard Setup
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Select the repository containing the NerdX bot

### 2. Configuration
- **Name**: `nerdx-bot` (or your preferred name)
- **Environment**: `Python 3`
- **Build Command**: `pip install --upgrade pip setuptools wheel && pip install -r requirements.txt`
- **Start Command**: `gunicorn main:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120`

### 3. Environment Variables
Set these environment variables in Render:

#### Required for Core Functionality:
```
FLASK_ENV=production
FLASK_DEBUG=false
SESSION_SECRET=your-secret-key-here
```

#### Required for WhatsApp Integration:
```
WHATSAPP_ACCESS_TOKEN=your-whatsapp-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_VERIFY_TOKEN=your-verify-token
```

#### Required for Supabase Database:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### Required for AI Services:
```
DEEPSEEK_API_KEY=your-deepseek-key
GEMINI_API_KEY=your-gemini-key
OPENAI_API_KEY=your-openai-key
```

#### Required for Image Hosting:
```
IMGBB_API_KEY=your-imgbb-key
```

#### Required for Payment System:
```
ECOCASH_API_KEY=your-ecocash-key
```

### 4. Advanced Settings
- **Health Check Path**: `/health`
- **Auto-Deploy**: Enable for automatic deployments on git push
- **Branch**: `main` (or your default branch)

### 5. Deployment
1. Click "Create Web Service"
2. Wait for the build to complete
3. Check the logs for any errors
4. Test the health endpoint: `https://your-app.onrender.com/health`

## Troubleshooting

### Common Issues:

#### 1. Build Failures
- Check that all dependencies in `requirements.txt` are compatible with Python 3.13
- Ensure no syntax errors in Python files
- Verify all import paths are correct
- The build command now upgrades pip, setuptools, and wheel before installing packages

#### 2. Runtime Errors
- Check the application logs in Render dashboard
- Verify all environment variables are set correctly
- Test locally with `python test_deployment.py`

#### 3. Import Errors
- Ensure all required packages are in `requirements.txt`
- Check for circular imports
- Verify file structure matches import statements

### Health Check Endpoints:
- `/health` - Basic health status
- `/webhook/health` - Webhook-specific health
- `/webhook/diagnose` - Detailed system diagnostics

## Local Testing Before Deployment

Run the deployment test script:
```bash
python test_deployment.py
```

This will verify:
- All imports work correctly
- Flask app can be created
- Basic functionality is operational

## Post-Deployment Verification

1. **Health Check**: Visit `/health` endpoint
2. **Webhook Test**: Test webhook endpoints
3. **Database Connection**: Verify Supabase connectivity
4. **WhatsApp Integration**: Test message handling

## Support

If you encounter issues:
1. Check the Render logs
2. Run `python test_deployment.py` locally
3. Verify environment variables
4. Check the `/webhook/diagnose` endpoint

## Python 3.13 Compatibility Notes

- Updated to use `>=` version specifiers for better compatibility
- Added `setuptools>=68.0.0` and `wheel>=0.41.0` for build requirements
- Updated numpy, matplotlib, and other packages to Python 3.13 compatible versions
- Build command now upgrades essential build tools before package installation
