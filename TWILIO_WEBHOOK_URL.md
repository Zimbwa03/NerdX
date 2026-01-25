# Twilio Webhook URL Configuration

## For Local Development (Using ngrok)

After starting ngrok (`ngrok http 5000`), use this URL format in Twilio:

### WhatsApp Webhook URL
```
https://YOUR_NGROK_URL.ngrok.io/webhook/whatsapp
```

### Status Callback URL (Optional)
```
https://YOUR_NGROK_URL.ngrok.io/webhook/whatsapp/status
```

## Example

If ngrok gives you: `https://abc123.ngrok.io`

Then in Twilio Console, set:
- **A MESSAGE COMES IN**: `https://abc123.ngrok.io/webhook/whatsapp`
- **STATUS CALLBACK URL**: `https://abc123.ngrok.io/webhook/whatsapp/status`

## For Production (After Deployment)

Use your Render/deployment URL:
- **A MESSAGE COMES IN**: `https://your-app.onrender.com/webhook/whatsapp`
- **STATUS CALLBACK URL**: `https://your-app.onrender.com/webhook/whatsapp/status`

## Where to Set in Twilio

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Messaging** → **Try it out** → **Send a WhatsApp message**
3. Or go to **Phone Numbers** → **Manage** → **Active numbers**
4. Click on your WhatsApp Sandbox number
5. Scroll to **Messaging** section
6. Paste the webhook URL in **A MESSAGE COMES IN** field
7. Click **Save**

## Testing

After setting the webhook:
1. Send a test message to your Twilio WhatsApp number
2. Check your local server logs (or production logs)
3. You should see the incoming webhook request
4. The bot should respond

## Important Notes

- ⚠️ **ngrok URLs change every time you restart ngrok** (unless you have a paid plan with static domain)
- ✅ **Remember to update Twilio webhook URL when ngrok restarts**
- ✅ **Mobile app routes are NOT affected** - they use `/api/mobile/*` which is separate
