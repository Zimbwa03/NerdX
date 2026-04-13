# NerdX — AI Education Assistant

> A ZIMSEC-focused AI-powered study platform for Zimbabwean O-Level and A-Level students.

[![Deploy on Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

---

## Features

- **AI-generated quiz questions** — ZIMSEC O-Level & A-Level across all subjects (Math, Science, English, History, Geography, Accounts, and more)
- **WhatsApp bot** via Twilio — students learn directly from WhatsApp
- **OCR image solving** — photograph a question, get a worked solution
- **Voice / audio chat** — real-time AI tutoring with speech input
- **Graph generation** — AI-powered graph creation for Mathematics
- **Credit-based system** — EcoCash payments with a transparent credit economy
- **AI Classroom (MAIC)** — interactive AI classroom sessions
- **School ecosystem** — school portals, teacher classrooms, student management
- **Project Assistant** — ZIMSEC project guidance with AI research tools

---

## Project Structure

```
NerdX/
├── backend/                  # Python/Flask backend (all server code)
│   ├── app.py                # Flask app factory + DB setup
│   ├── main.py               # Entry point (gunicorn target)
│   ├── routes.py             # URL route registration + SPA serving
│   ├── models.py             # SQLAlchemy ORM models
│   ├── config.py             # App configuration (credit costs, AI models, etc.)
│   ├── constants.py          # ZIMSEC topic definitions
│   ├── asgi.py               # ASGI hybrid entry point (Flask + FastAPI voice agent)
│   ├── run_voice_agent.py    # Voice agent server standalone runner
│   ├── standalone_math_generator.py  # Standalone math generation engine
│   ├── api/                  # REST API blueprints (mobile, admin, payments, etc.)
│   ├── handlers/             # WhatsApp/Twilio message handlers
│   ├── services/             # Business logic (AI generation, payments, credits, etc.)
│   └── utils/                # Shared utilities (PDF, credit, session, etc.)
│
├── NerdXWeb/                 # React + TypeScript web frontend
│   └── src/
│       ├── pages/            # Page components
│       ├── components/       # Reusable UI components
│       ├── services/         # API client services
│       └── data/             # Static subject notes data
│
├── NerdXApp/                 # React Native (Expo) Android/iOS mobile app
│   └── src/
│       ├── screens/          # App screens
│       ├── navigation/       # Navigation stack
│       ├── services/         # API and Supabase clients
│       └── data/             # Subject notes data
│
├── database/                 # DB migrations and schema files
│   └── migrations/           # Numbered SQL migration files
│
├── scripts/                  # Production admin scripts
├── static/                   # Flask static files (graphs, PDFs, media)
├── templates/                # Flask HTML templates
├── docs/                     # Project documentation
│   ├── ARCHITECTURE.md       # System architecture overview
│   └── DEPLOYMENT.md         # Deployment instructions
│
├── Dockerfile                # Production Docker image (backend + NerdXWeb)
├── Dockerfile.voice          # Voice agent Docker image
├── build.sh                  # Render build script
├── render.yaml               # Render deployment config
├── .env.example              # Environment variable template
└── requirements.txt          # Python dependencies
```

---

## Getting Started

### Prerequisites

- **Python** 3.11+
- **Node.js** 18+
- **PostgreSQL** (or a [Supabase](https://supabase.com) project)
- A [Google Cloud](https://cloud.google.com) project with Vertex AI enabled

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/Zimbwa03/NerdX.git
cd NerdX

# 2. Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Copy and configure environment variables
cp .env.example .env
# Edit .env with your API keys and database URL

# 5. Start the backend
python backend/main.py
# Server starts on http://localhost:5000
```

### Web App Setup

```bash
cd NerdXWeb
npm install
cp .env.example .env    # set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev             # http://localhost:5173
```

### Mobile App Setup

```bash
cd NerdXApp
npm install
npx expo start          # scan QR code with Expo Go
```

---

## Environment Variables

See [`.env.example`](.env.example) for all required variables with inline documentation.

Key variables:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Supabase) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase server-side key |
| `GOOGLE_CLOUD_PROJECT` | GCP project ID for Vertex AI |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Service account credentials (JSON) |
| `TWILIO_ACCOUNT_SID` / `AUTH_TOKEN` / `PHONE_NUMBER` | WhatsApp bot credentials |
| `JWT_SECRET` | JWT signing secret |

---

## Deployment

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for full deployment instructions.

**Quick summary:**
- **Backend**: Docker on [Render](https://render.com) — `render.yaml` configures the service
- **Web app**: Built inside the Dockerfile; served by Flask from `NerdXWeb/dist/`
- **Mobile app**: Built with [EAS Build](https://expo.dev/eas)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.11, Flask, SQLAlchemy, Gunicorn |
| AI | Google Gemini (Vertex AI), DeepSeek |
| Database | PostgreSQL via Supabase |
| WhatsApp | Twilio |
| Web Frontend | React 18 + TypeScript + Vite |
| Mobile | React Native (Expo), Android/iOS |
| Payments | EcoCash (via Paynow) |
| Deployment | Render (backend), Azure (alternative) |
| Voice | FastAPI + WebSockets + Gemini Live API |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit changes: `git commit -m "feat: your feature description"`
4. Push and open a pull request

---

## License

Proprietary — NerdX Education Technology. All rights reserved.
