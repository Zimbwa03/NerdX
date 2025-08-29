# 🔐 Environment Variables Setup

This guide helps you securely configure your NerdX Quiz Bot without exposing secrets to GitHub.

## 🚨 **SECURITY NOTICE**
**NEVER commit `.env` files or hardcode API keys in your code!**

## 📋 **Quick Setup**

### 1. **Create Your Environment File**
```bash
# Copy the example file
cp env.example .env

# Edit with your actual values
nano .env  # or use your preferred editor
```

### 2. **Fill in Your API Keys**
Update `.env` with your actual values:

```env
# Your Supabase Project
SUPABASE_URL=https://hvlvwvzliqrlmqjbfgoa.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Your AI API Keys  
DEEPSEEK_API_KEY=sk-...
GEMINI_API_KEY=AIza...

# Your WhatsApp Business API
WHATSAPP_ACCESS_TOKEN=EAAxxxxx...
WHATSAPP_PHONE_NUMBER_ID=123456789...
WHATSAPP_VERIFY_TOKEN=your_custom_token

# Your ImgBB API Key
IMGBB_API_KEY=your_imgbb_key
```

### 3. **Deploy to Render**
In your Render dashboard:
1. Go to your service settings
2. Navigate to "Environment" 
3. Add each environment variable from your `.env` file
4. **DO NOT** set these in the code!

## ✅ **What's Protected**

### ✅ **Safe for GitHub:**
- `env.example` - Template file with placeholder values
- `ENVIRONMENT_SETUP.md` - This setup guide
- Code that uses `os.getenv()` without hardcoded defaults

### ❌ **NEVER Commit:**
- `.env` - Your actual environment file
- Any hardcoded API keys in code
- `credentials.json` or similar files

## 🔧 **How It Works**

### **In Development:**
```python
# Code reads from .env file
SUPABASE_URL = os.getenv("SUPABASE_URL")  # ✅ Secure
```

### **In Production (Render):**
```python
# Code reads from Render environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL")  # ✅ Secure
```

## 🛡️ **Security Best Practices**

1. **Never hardcode secrets:**
   ```python
   # ❌ BAD - Hardcoded secret
   API_KEY = "sk-hardcoded123"
   
   # ✅ GOOD - Environment variable
   API_KEY = os.getenv("API_KEY")
   ```

2. **Use strong verify tokens:**
   ```env
   WHATSAPP_VERIFY_TOKEN=my_super_secret_verify_token_2024
   ```

3. **Rotate keys regularly:**
   - Update API keys every 3-6 months
   - Use different keys for development vs production

4. **Monitor usage:**
   - Check your API usage dashboards
   - Set up billing alerts

## 🚀 **Deployment Checklist**

- [ ] `.env` file created locally (not committed)
- [ ] All environment variables set in Render dashboard
- [ ] No hardcoded secrets in code
- [ ] `.gitignore` includes `.env`
- [ ] Test endpoints work with environment variables

## 🆘 **Troubleshooting**

### **"Environment variable not found" errors:**
1. Check your `.env` file exists
2. Verify variable names match exactly
3. Restart your development server
4. Check Render environment variables are set

### **"401 Unauthorized" errors:**
1. Verify your API keys are correct
2. Check key permissions (SERVICE_ROLE vs ANON)
3. Ensure keys haven't expired

### **"Connection failed" errors:**
1. Check your SUPABASE_URL is correct
2. Verify network connectivity
3. Check Supabase service status

## 📞 **Need Help?**

If you're still having issues:
1. Check the application logs
2. Test individual API endpoints
3. Verify each environment variable is set correctly
4. Use the `/health` and `/webhook/diagnose` endpoints for debugging




