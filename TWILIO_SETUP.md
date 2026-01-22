# Twilio WhatsApp Integration Setup Guide

## ✅ Implementation Complete

Your NerdX bot has been updated to support Twilio WhatsApp messaging. Here's what was implemented:

### Changes Made:

1. **Webhook Signature Validation** (`api/webhook.py`)
   - Added proper Twilio webhook signature verification using HMAC SHA1
   - Updated to handle Twilio's form-encoded POST requests
   - Returns TwiML XML responses as required by Twilio

2. **Message Processing** (`api/webhook.py`)
   - Added Twilio message format handling
   - Converts Twilio format to internal message format
   - Maintains backward compatibility with Facebook WhatsApp Business API

3. **Message Sending** (`services/whatsapp_service.py`)
   - Added Twilio support for sending messages
   - Automatically detects which provider to use based on environment variables
   - Supports both Twilio and Facebook WhatsApp APIs

4. **Environment Configuration** (`.env.example`)
   - Added Twilio configuration variables

## 🔧 Required Configuration in Render

### Step 1: Add Environment Variables

Go to your Render dashboard → NerdX service → Environment tab and add:

```
TWILIO_AUTH_TOKEN=f5868da1d37ab591e307c36a20acae25
TWILIO_ACCOUNT_SID=ACee78cfbe86bb4e92d30b7e5fcace5eb4
TWILIO_PHONE_NUMBER=+12295973876
```

### Step 2: Verify Webhook URL in Twilio

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Messaging** → **Try it out** → **Send a WhatsApp message**
3. Or go to **Phone Numbers** → Your WhatsApp number → Configure
4. Set the webhook URL to: `https://nerdx.onrender.com/webhook/whatsapp`
5. Set HTTP method to: **POST**

### Step 3: Redeploy Your Service

After adding the environment variables, redeploy your service in Render:
- Go to your service → Manual Deploy → Deploy latest commit

## 📋 Your Twilio Credentials

- **Account SID**: `ACee78cfbe86bb4e92d30b7e5fcace5eb4`
- **Auth Token**: `f5868da1d37ab591e307c36a20acae25`
- **Phone Number**: `+12295973876`
- **Webhook URL**: `https://nerdx.onrender.com/webhook/whatsapp`

## 🔍 Testing

After deployment, test by:

1. Send a WhatsApp message to your Twilio number: `+12295973876`
2. Check Render logs to see if the message is received
3. Verify the bot responds correctly

## 📝 How It Works

1. **Incoming Messages**: Twilio sends POST requests to `/webhook/whatsapp` with form-encoded data
2. **Signature Validation**: The webhook validates the request signature using your Twilio Auth Token
3. **Message Processing**: Messages are converted to internal format and processed by your bot
4. **Outgoing Messages**: The WhatsApp service automatically uses Twilio API to send responses

## ⚠️ Important Notes

- **Security**: Your Auth Token is sensitive - never commit it to git
- **Signature Validation**: All webhook requests are validated for security
- **Dual Support**: The system supports both Twilio and Facebook WhatsApp APIs simultaneously
- **Automatic Detection**: The service automatically uses Twilio if configured, otherwise falls back to Facebook API

## 🐛 Troubleshooting

If messages aren't working:

1. **Check Environment Variables**: Verify all three Twilio variables are set in Render
2. **Check Logs**: Look for "Invalid webhook signature" errors
3. **Verify Webhook URL**: Ensure Twilio is configured with the correct webhook URL
4. **Test Signature**: The signature validation logs will show if verification is working

## 📚 Next Steps

- Monitor logs in Render to ensure messages are being received
- Test the full message flow end-to-end
- Consider adding Twilio-specific features (media messages, status callbacks, etc.)
