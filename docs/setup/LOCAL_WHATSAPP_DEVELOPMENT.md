# Local WhatsApp Bot Development Guide

## Quick Start - Run WhatsApp Bot Locally

This guide will help you run the WhatsApp bot locally for testing without affecting the mobile application.

## Prerequisites

1. **Python 3.8+** installed
2. **ngrok** installed (for exposing local server to Twilio)
3. **Twilio Account** with WhatsApp Sandbox configured

## Step 1: Install ngrok

Download and install ngrok from: https://ngrok.com/download

Or install via package manager:
```bash
# Windows (using Chocolatey)
choco install ngrok

# Or download from https://ngrok.com/download
```

## Step 2: Start Local Server

### Option A: Using main.py (Recommended)

```bash
# Navigate to project directory
cd "c:\Users\GWENJE\Desktop\Nerdx 1\NerdX"

# Set environment variables
$env:PORT = "5000"
$env:FLASK_ENV = "development"

# Run the server
python main.py
```

The server will start on `http://localhost:5000`

### Option B: Using Flask directly

```bash
# Set Flask app
$env:FLASK_APP = "main.py"

# Run Flask
flask run --host=0.0.0.0 --port=5000
```

## Step 3: Expose Local Server with ngrok

Open a **new terminal window** and run:

```bash
ngrok http 5000
```

You'll see output like:
```
Forwarding   https://abc123.ngrok.io -> http://localhost:5000
```

**Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

## Step 4: Configure Twilio Webhook

### WhatsApp Webhook URL Format

Your webhook endpoint is:
```
https://YOUR_NGROK_URL.ngrok.io/webhook/whatsapp
```

### Steps in Twilio Console:

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Messaging** → **Try it out** → **Send a WhatsApp message**
3. Or go to **Phone Numbers** → **Manage** → **Active numbers**
4. Find your WhatsApp Sandbox number
5. Click on it to configure
6. In the **Messaging** section, set:
   - **A MESSAGE COMES IN**: `https://YOUR_NGROK_URL.ngrok.io/webhook/whatsapp`
   - **STATUS CALLBACK URL**: `https://YOUR_NGROK_URL.ngrok.io/webhook/whatsapp/status`

### Example:
```
A MESSAGE COMES IN: https://abc123.ngrok.io/webhook/whatsapp
STATUS CALLBACK URL: https://abc123.ngrok.io/webhook/whatsapp/status
```

## Step 5: Verify Setup

1. **Check local server is running:**
   - Open browser: `http://localhost:5000/health`
   - Should return: `{"status": "healthy", ...}`

2. **Check ngrok is forwarding:**
   - Open browser: `https://YOUR_NGROK_URL.ngrok.io/health`
   - Should return: `{"status": "healthy", ...}`

3. **Test WhatsApp:**
   - Send a message to your Twilio WhatsApp Sandbox number
   - Check your local terminal for logs
   - You should see incoming webhook requests

## Important Notes

### Mobile App Routes Are NOT Affected

The mobile app uses routes under `/api/mobile/*` which are **completely separate** from WhatsApp webhooks (`/webhook/*`). Running locally only affects:

- ✅ `/webhook/whatsapp` - WhatsApp bot webhook
- ✅ `/webhook/whatsapp/status` - WhatsApp status callbacks
- ❌ `/api/mobile/*` - Mobile app routes (unchanged, not used locally)

### Environment Variables

Make sure your `.env` file has:

```env
# Twilio WhatsApp
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=whatsapp:+14155238886

# Vertex AI (for WhatsApp bot)
GOOGLE_GENAI_USE_VERTEXAI=true
GOOGLE_CLOUD_PROJECT=gen-lang-client-0303273462
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_SERVICE_ACCOUNT_JSON={...}

# DeepSeek (fallback)
DEEPSEEK_API_KEY=your_deepseek_key
```

### Development vs Production

- **Local Development**: Uses ngrok URL in Twilio
- **Production**: Uses your Render/deployment URL

**Remember to switch back to production URL before deploying!**

## Troubleshooting

### ngrok URL Changes Every Time

**Solution**: Use ngrok with a static domain (requires ngrok account):
```bash
ngrok http 5000 --domain=your-static-domain.ngrok.io
```

### Webhook Not Receiving Messages

1. Check ngrok is running: `https://YOUR_NGROK_URL.ngrok.io/health`
2. Check Twilio webhook URL is correct
3. Check local server logs for errors
4. Verify Twilio credentials in `.env`

### Port Already in Use

Change port:
```bash
# Use different port
python main.py  # Edit main.py to use port 5001

# Or set environment variable
$env:PORT = "5001"
ngrok http 5001
```

## Quick Reference

### Start Local Development

```bash
# Terminal 1: Start Flask server
cd "c:\Users\GWENJE\Desktop\Nerdx 1\NerdX"
python main.py

# Terminal 2: Start ngrok
ngrok http 5000
```

### Webhook URLs for Twilio

```
A MESSAGE COMES IN: https://YOUR_NGROK_URL.ngrok.io/webhook/whatsapp
STATUS CALLBACK: https://YOUR_NGROK_URL.ngrok.io/webhook/whatsapp/status
```

### Test Endpoints

- Health Check: `http://localhost:5000/health`
- Webhook Test: `https://YOUR_NGROK_URL.ngrok.io/webhook/whatsapp` (POST)

## Next Steps

1. ✅ Start local server
2. ✅ Start ngrok
3. ✅ Configure Twilio webhook
4. ✅ Test with WhatsApp message
5. ✅ Make changes and see them instantly!
6. ✅ Deploy when ready (remember to update Twilio webhook URL)
