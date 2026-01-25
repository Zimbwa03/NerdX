# Fix: 405 Error - POST Requests Failing

## Problem

You're seeing `405 Method Not Allowed` errors because Twilio is sending POST requests to the **root URL** (`/`) instead of the **webhook endpoint** (`/webhook/whatsapp`).

## Root Cause

The root route (`/`) only accepts **GET** requests (it redirects to login/dashboard). Twilio needs to send POST requests to `/webhook/whatsapp`.

## Solution: Fix Twilio Webhook URL

### Current (Wrong) URL in Twilio:
```
https://844c71a95949.ngrok-free.app
```

### Correct URL for Twilio:
```
https://844c71a95949.ngrok-free.app/webhook/whatsapp
```

## Steps to Fix

1. **Go to Twilio Console**: https://console.twilio.com/
2. **Navigate to**: Messaging → Try it out → Send a WhatsApp message
   - OR: Phone Numbers → Manage → Active numbers → Your WhatsApp number
3. **Update Webhook URL**:
   - **A MESSAGE COMES IN**: `https://844c71a95949.ngrok-free.app/webhook/whatsapp`
   - **STATUS CALLBACK URL** (optional): `https://844c71a95949.ngrok-free.app/webhook/whatsapp/status`
4. **Click Save**

## Verify

After updating:
1. Send a test WhatsApp message
2. Check your local server logs
3. You should see: `POST /webhook/whatsapp HTTP/1.1" 200` (not 405)

## Important

- ✅ **Correct**: `https://YOUR_NGROK_URL/webhook/whatsapp`
- ❌ **Wrong**: `https://YOUR_NGROK_URL` (missing `/webhook/whatsapp`)

The `/webhook/whatsapp` path is **required** - that's where the POST handler is configured.
