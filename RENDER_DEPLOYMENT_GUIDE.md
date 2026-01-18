# NerdX Bot - Render Deployment Guide

## 🚀 Quick Deploy to Render

### 1. **Repository Setup**
- Connect your GitHub repository to Render
- Choose **Web Service** deployment type
- Set Python version to **3.11** or higher

### 2. **Build Configuration**
```bash
# Build Command
pip install -r requirements.txt

# Start Command
gunicorn main:app --bind 0.0.0.0:$PORT
```

### 3. **Environment Variables**
Set these in your Render dashboard:

#### **Core Configuration**
```bash
FLASK_ENV=production
FLASK_DEBUG=false
SECRET_KEY=your-secret-key-here
```

#### **WhatsApp Business API**
```bash
WHATSAPP_ACCESS_TOKEN=your-whatsapp-access-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_VERIFY_TOKEN=your-verify-token
```

#### **Database (Supabase PostgreSQL)**
```bash
DATABASE_URL=postgresql://postgres:password@host:port/database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
```

#### **AI Services**
```bash
DEEPSEEK_API_KEY=your-deepseek-api-key
GEMINI_API_KEY=your-gemini-api-key
GOOGLE_AI_API_KEY=your-google-ai-key
```

#### **Vertex AI (Gemini Live) - NerdX Live Audio/Video**
If you want **NerdX Live Audio/Video** to connect to Vertex AI via Gemini Live API, add:

```bash
GOOGLE_GENAI_USE_VERTEXAI=true
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"...","universe_domain":"googleapis.com"}
```

Notes:
- `GOOGLE_CLOUD_LOCATION` **must NOT be** `global` for the Vertex Live WebSocket endpoint.
- Do **not** paste the service account JSON into `GOOGLE_CLOUD_PROJECT` (it must be the project id).

#### **Image Hosting (IMGBB)**
```bash
IMGBB_API_KEY=your-imgbb-api-key
```

#### **Payment Services**
```bash
ECOCASH_API_KEY=your-ecocash-api-key
ECOCASH_MERCHANT_ID=your-merchant-id
```

### 4. **Dependencies Included**

#### **Core Dependencies** ✅
- `flask>=3.1.2` - Web framework
- `gunicorn>=23.0.0` - Production WSGI server
- `psycopg2-binary>=2.9.10` - PostgreSQL adapter
- `sqlalchemy>=2.0.43` - Database ORM

#### **Image Processing** ✅
- `pillow>=11.3.0` - Image manipulation (PIL)
- `pytesseract>=0.3.13` - OCR text extraction
- `imgbbpy>=1.3.0` - **IMGBB image hosting** ⭐

#### **AI and ML** ✅
- `google-genai>=1.31.0` - Google AI integration
- `sympy>=1.14.0` - Mathematical computations
- `numpy>=2.3.2` - Numerical processing
- `matplotlib>=3.10.5` - Data visualization

#### **Document Processing** ✅
- `pypdf2>=3.0.1` - PDF reading
- `reportlab>=4.4.3` - PDF generation

#### **Audio Processing** ✅
- `speechrecognition>=3.14.3` - Speech-to-text

#### **Security & Auth** ✅
- `flask-login>=0.6.3` - User authentication
- `pyjwt>=2.10.1` - JWT tokens
- `oauthlib>=3.3.1` - OAuth support

### 5. **IMGBB Setup for Image Hosting**

#### **Get IMGBB API Key:**
1. Go to [imgbb.com](https://imgbb.com)
2. Create account or login
3. Go to API section
4. Generate API key
5. Add to environment variables: `IMGBB_API_KEY=your-key`

#### **Features Enabled:**
- ✅ Image upload to IMGBB
- ✅ Public URL generation
- ✅ Image verification
- ✅ Fallback to local hosting
- ✅ Math problem solving from images
- ✅ Document image processing

### 6. **Deployment Checklist**

#### **Pre-Deployment:**
- [ ] All environment variables set
- [ ] Database connection tested
- [ ] WhatsApp webhook configured
- [ ] IMGBB API key obtained
- [ ] AI service keys configured

#### **Post-Deployment:**
- [ ] Health check endpoint working
- [ ] Database tables created
- [ ] WhatsApp webhook verified
- [ ] Image uploads working
- [ ] Admin dashboard accessible

### 7. **Troubleshooting**

#### **Common Issues:**

**1. Import Errors:**
```bash
# Ensure all dependencies are installed
pip install -r requirements.txt
```

**2. IMGBB Not Working:**
```bash
# Check API key is set
echo $IMGBB_API_KEY

# Test with curl
curl -X POST "https://api.imgbb.com/1/upload" \
  -F "key=YOUR_API_KEY" \
  -F "image=@test.jpg"
```

**3. Database Connection:**
```bash
# Test connection
python -c "from database.external_db import test_connection; test_connection()"
```

**4. WhatsApp Webhook:**
- Verify webhook URL in WhatsApp Business API
- Check webhook verification endpoint
- Ensure HTTPS is enabled

### 8. **Performance Optimization**

#### **Render Settings:**
- **Instance Type**: Standard (1GB RAM, 1 CPU)
- **Auto-scaling**: Enable for production
- **Health Check Path**: `/health` or `/api/health`

#### **Environment Variables:**
```bash
# Performance tuning
FLASK_ENV=production
FLASK_DEBUG=false
WORKERS=4
TIMEOUT=120
```

### 9. **Monitoring and Logs**

#### **Render Logs:**
- View real-time logs in Render dashboard
- Monitor for errors and performance issues
- Set up alerts for critical failures

#### **Health Check Endpoint:**
```python
@app.route('/health')
def health_check():
    return {'status': 'healthy', 'timestamp': datetime.now().isoformat()}
```

### 10. **Security Considerations**

#### **Environment Variables:**
- Never commit API keys to repository
- Use Render's secure environment variable storage
- Rotate keys regularly

#### **Webhook Security:**
- Verify WhatsApp webhook signatures
- Implement rate limiting
- Monitor for abuse

---

## 🎯 **Ready to Deploy!**

Your NerdX Bot is now configured with:
- ✅ All required dependencies including `imgbbpy`
- ✅ Image hosting capabilities via IMGBB
- ✅ Comprehensive deployment guide
- ✅ Environment variable checklist
- ✅ Troubleshooting guide

**Next Steps:**
1. Set up your Render account
2. Connect your GitHub repository
3. Configure environment variables
4. Deploy and test!

For support, check the logs in Render dashboard or refer to the troubleshooting section above.
