# Local Development Alternatives (If ngrok is not available)

## Option 1: Install ngrok (Recommended)

See `INSTALL_NGROK_WINDOWS.md` for installation instructions.

## Option 2: Use Twilio CLI (Alternative)

Twilio CLI can create a tunnel without ngrok:

```powershell
# Install Twilio CLI
npm install -g twilio-cli

# Login to Twilio
twilio login

# Start tunnel
twilio phone-numbers:update YOUR_PHONE_NUMBER --sms-url=http://localhost:5000/webhook/whatsapp
```

## Option 3: Use localtunnel (npm alternative)

```powershell
# Install Node.js first if not installed
# Then install localtunnel
npm install -g localtunnel

# Start tunnel
lt --port 5000
```

## Option 4: Use Cloudflare Tunnel (Free)

```powershell
# Download cloudflared from: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
# Then run:
cloudflared tunnel --url http://localhost:5000
```

## Option 5: Test Locally Without Webhook (Limited)

You can test the server locally but won't receive WhatsApp messages:

1. Start server: `python main.py`
2. Test health: `http://localhost:5000/health`
3. Test webhook endpoint manually (using Postman or curl)

**Note:** For full WhatsApp testing, you need a public URL (ngrok or alternative).

## Recommended: Install ngrok

The easiest solution is to install ngrok:

1. Download: https://ngrok.com/download
2. Extract `ngrok.exe` to `C:\ngrok\`
3. Use: `C:\ngrok\ngrok.exe http 5000` (or add to PATH)
