# Quick Start: Run WhatsApp Bot Locally

## 🚀 3-Step Setup

### Step 1: Start Local Server

**Option A: Use the PowerShell script (Windows)**
```powershell
.\run_whatsapp_local.ps1
```

**Option B: Manual start**
```powershell
cd "c:\Users\GWENJE\Desktop\Nerdx 1\NerdX"
$env:PORT = "5000"
python main.py
```

Server will run on: `http://localhost:5000`

### Step 2: Expose with ngrok

Open a **NEW terminal window** and run:
```bash
ngrok http 5000
```

You'll get a URL like: `https://abc123.ngrok.io`

### Step 3: Configure Twilio

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Messaging** → **Try it out** → **Send a WhatsApp message**
3. Or **Phone Numbers** → Your WhatsApp number
4. Set webhook URL:
   ```
   A MESSAGE COMES IN: https://YOUR_NGROK_URL.ngrok.io/webhook/whatsapp
   ```

## ✅ Test It

Send a WhatsApp message to your Twilio number. You should see:
- Logs in your local terminal
- Response from the bot
- All changes work instantly!

## 📝 Important URLs

- **Local Server**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/health`
- **Webhook Endpoint**: `http://localhost:5000/webhook/whatsapp`
- **ngrok URL**: `https://YOUR_NGROK_URL.ngrok.io/webhook/whatsapp` (for Twilio)

## 🔒 Mobile App Safety

✅ **Mobile app routes (`/api/mobile/*`) are NOT affected**
✅ **Only WhatsApp webhooks (`/webhook/*`) are used locally**
✅ **Production mobile app continues working normally**

## 🛠️ Troubleshooting

**Port 5000 in use?**
```powershell
$env:PORT = "5001"
python main.py
# Then: ngrok http 5001
```

**ngrok not working?**
- Make sure ngrok is installed: https://ngrok.com/download
- Check ngrok is running: Open `https://YOUR_NGROK_URL.ngrok.io/health`

**Webhook not receiving messages?**
- Verify Twilio webhook URL is correct
- Check local server logs
- Verify `.env` has `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN`

## 📚 Full Guide

See `LOCAL_WHATSAPP_DEVELOPMENT.md` for detailed instructions.
