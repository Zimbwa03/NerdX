# NerdX — Deployment Guide

## Prerequisites

- A [Render](https://render.com) account (backend)
- A [Supabase](https://supabase.com) project (database)
- A [Google Cloud](https://cloud.google.com) project with Vertex AI enabled
- A [Twilio](https://twilio.com) account with a WhatsApp Business number
- [EAS CLI](https://docs.expo.dev/eas/) installed for mobile builds (`npm install -g eas-cli`)

---

## 1. Backend Deployment on Render

### Environment Variables

Set the following in your Render service dashboard (Environment → Add Environment Variable):

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your Supabase connection string |
| `SUPABASE_URL` | `https://YOUR_PROJECT.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase → Settings → API |
| `SUPABASE_ANON_KEY` | From Supabase → Settings → API |
| `GOOGLE_GENAI_USE_VERTEXAI` | `True` |
| `GOOGLE_CLOUD_PROJECT` | Your GCP project ID |
| `GOOGLE_CLOUD_LOCATION` | `us-central1` |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Full service account JSON (single line) |
| `TWILIO_ACCOUNT_SID` | From Twilio Console |
| `TWILIO_AUTH_TOKEN` | From Twilio Console |
| `TWILIO_PHONE_NUMBER` | Your Twilio WhatsApp number |
| `JWT_SECRET` | A long random string (32+ chars) |
| `SESSION_SECRET` | A long random string (32+ chars) |
| `BASE_URL` | `https://your-render-service.onrender.com` |
| `PORT` | `10000` |

### Deploy Steps

1. **Connect repository** — In Render dashboard, create a new Web Service and connect to `https://github.com/Zimbwa03/NerdX`
2. **Runtime** — Select Docker (Render auto-detects `render.yaml`)
3. **Start command** — Handled by Dockerfile: `gunicorn backend.main:app --bind 0.0.0.0:$PORT --workers 1 --timeout 300 --preload`
4. **Set environment variables** as listed above
5. **Deploy** — Render will build the Docker image (includes NerdXWeb build) and start the service

### Build Process

The `Dockerfile`:
1. Builds `NerdXWeb` React app with `npm ci && npm run build`
2. Installs Python dependencies from `requirements_render.txt`
3. Copies the NerdXWeb `dist/` output into the image
4. Starts `gunicorn backend.main:app`

### Health Check

Render pings `GET /health` to verify the service is running. This endpoint returns immediately with `{"status": "healthy"}`.

### Twilio Webhook Configuration

After deployment, configure Twilio:
1. Go to Twilio Console → Messaging → Settings → WhatsApp Sandbox (or Business Account)
2. Set the webhook URL to: `https://your-service.onrender.com/webhook/whatsapp`
3. HTTP Method: `POST`

---

## 2. Web App (NerdXWeb)

The web app is **built inside the Docker image** and served by Flask from `/NerdXWeb/dist/`. No separate deployment needed for the web app — it deploys with the backend.

### Local Development

```bash
cd NerdXWeb
npm install

# Create .env file with Vite variables
echo "VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co" > .env
echo "VITE_SUPABASE_ANON_KEY=your_anon_key" >> .env
echo "VITE_API_BASE_URL=http://localhost:5000" >> .env

npm run dev   # http://localhost:5173
```

### Build

```bash
cd NerdXWeb
npm run build  # Output: NerdXWeb/dist/
```

---

## 3. Mobile App (NerdXApp) with EAS Build

### First-Time Setup

```bash
cd NerdXApp
npm install
npx eas login
npx eas build:configure
```

### Build Android APK (for testing / sideloading)

```bash
npx eas build --platform android --profile preview
```

### Build Android AAB (for Play Store)

```bash
npx eas build --platform android --profile production
```

### Build iOS (requires Apple Developer account)

```bash
npx eas build --platform ios --profile production
```

### App Configuration

Environment-specific values in `NerdXApp/app.json` under `expo.extra`:

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "https://nerdx.co.zw",
      "supabaseUrl": "https://YOUR_PROJECT.supabase.co",
      "supabaseAnonKey": "your_anon_key"
    }
  }
}
```

---

## 4. Docker Build (Local / Custom)

### Build the main backend image

```bash
docker build -t nerdx-backend .
docker run -p 10000:10000 --env-file .env nerdx-backend
```

### Build the voice agent image

```bash
docker build -f Dockerfile.voice -t nerdx-voice .
docker run -p 8001:8001 --env-file .env nerdx-voice
```

### Run both with docker-compose (example)

```yaml
version: '3.8'
services:
  backend:
    build: .
    ports: ['10000:10000']
    env_file: .env
  voice:
    build:
      context: .
      dockerfile: Dockerfile.voice
    ports: ['8001:8001']
    env_file: .env
```

---

## 5. Azure Deployment

The `startup.sh` and `.azure/` configuration support Azure App Service.

1. Set the startup command in Azure: `bash startup.sh`
2. Configure environment variables in Azure → App Service → Configuration → Application Settings (same variables as Render above)
3. Enable HTTPS in Azure → Custom domains

---

## 6. Database Migrations

SQL migration files are in `database/migrations/`. Run them against your Supabase project using the Supabase SQL editor or `psql`:

```bash
psql $DATABASE_URL -f database/migrations/001_add_interaction_tracking.sql
psql $DATABASE_URL -f database/migrations/002_school_portal_finance.sql
# ... and so on in order
```

For the initial setup, run `database/migrations/supabase_database_setup.sql` first.

---

## 7. Rollback

If a deployment fails:

1. In Render: go to **Deploys** tab → select the previous successful deploy → **Redeploy**
2. All data is in Supabase — no data loss from a rollback

---

## Monitoring & Logs

- **Render**: View logs at Dashboard → Your Service → Logs
- **Health check**: `GET https://your-service.onrender.com/health`
- **Supabase**: Monitor database at https://supabase.com/dashboard
