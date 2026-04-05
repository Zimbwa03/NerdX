# Render Deployment Fix: Web App vs Voice Agent

## The Issue
The deployed URL `https://nerdx.onrender.com` was showing a JSON response:
```json
{
  "service": "NerdX Live Voice Agent",
  ...
}
```
This indicates that Render was building and running `Dockerfile.voice` (the Voice Agent) instead of the main `Dockerfile` (the Web App).

## The Fix

Explicity tell Render which Dockerfile to use for the main web service.

1. **Open Render Dashboard**: Go to [dashboard.render.com](https://dashboard.render.com).
2. **Select Service**: Click on your `nerdx-bot` (or similarly named) web service.
3. **Go to Settings**: Click the "Settings" tab.
4. **Update Dockerfile Path**:
   - Scroll down to the **Build & Deploy** section.
   - Find the **Dockerfile Path** field.
   - Change it to: `./Dockerfile`
   - *Note: Ensure it is NOT `Dockerfile.voice`.*
5. **Save Changes**.
6. **Redeploy**: Click "Manual Deploy" > "Deploy latest commit" to rebuild with the correct Dockerfile.

## Verification
After the deployment finishes (usually 3-5 minutes):
1. Visit `https://nerdx.onrender.com`.
2. You should see the NerdX Web App UI (or Login screen), not raw JSON.
