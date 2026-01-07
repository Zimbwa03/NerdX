# NerdX Live Voice Agent - Deployment Setup

## Environment Variables Required

### For Local Development

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_LIVE_MODEL=gemini-2.0-flash-exp
VOICE_AGENT_PORT=8001
```

### For Render Deployment

1. Go to your Render dashboard: https://dashboard.render.com
2. Select your `nerdx-voice` service
3. Go to **Environment** tab
4. Add these environment variables:

```
GEMINI_API_KEY = AIzaSyBdWX6hBSpPORrjJut5Ow3rhZb10JnsnRc
GEMINI_LIVE_MODEL = gemini-2.0-flash-exp
PORT = 8001
```

5. Click **Save Changes**
6. The service will automatically redeploy

## Model Options

The `GEMINI_LIVE_MODEL` can be set to:
- `gemini-2.0-flash-exp` (default - experimental multimodal)
- `gemini-2.0-flash-live-001` (if available)
- `gemini-1.5-flash-latest` (fallback)

## Testing the Connection

After setting the environment variables, restart your voice agent:

```bash
# Local
python services/voice_agent.py

# Or via uvicorn
uvicorn services.voice_agent:app --host 0.0.0.0 --port 8001
```

Check the logs for:
- ✅ "Gemini API key configured"
- ✅ "Gemini Live session established successfully"

If you see errors, check:
1. API key is correct
2. Model name is valid
3. Network connectivity to Google's servers

