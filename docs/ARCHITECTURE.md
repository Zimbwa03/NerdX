# NerdX — System Architecture

## Overview

NerdX is a multi-surface AI education platform for ZIMSEC (Zimbabwe School Examinations Council) students. The system consists of:

1. **Backend API** — Python/Flask REST API + WhatsApp webhook handler
2. **Web App** — React/TypeScript SPA served by the same Flask process
3. **Mobile App** — React Native (Expo) for Android

All surfaces share the same Supabase PostgreSQL database and Google Vertex AI (Gemini) integration.

---

## Folder Structure

```
NerdX/
├── backend/                  # All server-side Python code
│   ├── app.py                # Flask app factory, DB init, CORS, health check
│   ├── main.py               # Entry point: imports app, registers routes, starts background init
│   ├── routes.py             # Blueprint registration + SPA proxy routes
│   ├── models.py             # SQLAlchemy models (User, Payment, Question, etc.)
│   ├── config.py             # Singleton Config class: credit costs, AI model names, timeouts
│   ├── constants.py          # ZIMSEC topic lists, difficulty levels, static data
│   ├── asgi.py               # ASGI hybrid (FastAPI voice agent + Flask WSGI)
│   ├── run_voice_agent.py    # Standalone runner for voice WebSocket server
│   ├── standalone_math_generator.py  # Decoupled math question generator
│   │
│   ├── api/                  # REST API blueprints
│   │   ├── webhook.py        # POST /webhook/whatsapp — Twilio inbound message handler
│   │   ├── mobile.py         # /api/mobile/* — Mobile app endpoints
│   │   ├── auth.py           # /admin/auth — Admin authentication
│   │   ├── admin.py          # /api/admin/* — Admin dashboard API
│   │   ├── credit_management.py  # Credit top-up / balance endpoints
│   │   ├── payment_sync.py   # Paynow payment sync
│   │   ├── paynow_webhook.py # Paynow payment callback
│   │   ├── schools.py        # School management API
│   │   ├── school_portal.py  # /api/school-portal/* 
│   │   ├── school_ecosystem_v2.py  # /api/v2 school ecosystem
│   │   ├── teacher_classroom_v2.py # /api/v2 teacher classroom
│   │   └── maic_classroom.py # /api/mobile/classroom — AI classroom
│   │
│   ├── handlers/             # WhatsApp conversation flow handlers
│   │   ├── combined_science_handler.py
│   │   ├── english_handler.py
│   │   ├── exam_mathematics_handler.py
│   │   ├── graph_practice_handler.py
│   │   ├── mathematics_handler.py
│   │   └── project_assistant_handler.py
│   │
│   ├── services/             # Business logic layer (~116 modules)
│   │   ├── ai_service.py     # Core Vertex AI / Gemini API wrapper
│   │   ├── whatsapp_service.py  # Twilio WhatsApp message sender
│   │   ├── payment_service.py   # EcoCash / Paynow payment processing
│   │   ├── secure_credit_system.py  # Atomic credit deduction (Supabase)
│   │   ├── user_service.py      # User CRUD + registration flow
│   │   ├── voice_agent.py       # FastAPI WebSocket voice AI agent
│   │   ├── *_generator.py       # Subject-specific question generators
│   │   └── *_service.py         # Subject-specific teaching services
│   │
│   └── utils/                # Shared utilities
│       ├── credit_manager.py    # CLI admin credit tool
│       ├── credit_system.py     # Credit deduction logic
│       ├── session_manager.py   # WhatsApp conversation state
│       ├── menu_router.py       # WhatsApp menu navigation
│       ├── pdf_generator.py     # PDF report generation
│       └── ...
│
├── NerdXWeb/                 # React 18 + TypeScript SPA
│   └── src/
│       ├── pages/            # Route-level page components
│       ├── components/       # Reusable UI components
│       ├── services/api/     # REST client + Supabase client
│       ├── data/             # Static ZIMSEC notes (subject content)
│       └── context/          # React context providers
│
├── NerdXApp/                 # React Native (Expo) mobile app
│   └── src/
│       ├── screens/          # App screen components
│       ├── navigation/       # React Navigation stack
│       ├── services/         # API and Supabase clients
│       └── data/             # Subject notes data
│
├── database/
│   └── migrations/           # SQL migration files (numbered 001–, plus named files)
│
├── static/                   # Flask static files
│   ├── graphs/               # AI-generated graph PNG files (runtime)
│   ├── pdfs/                 # Generated PDF reports (runtime)
│   └── media/                # Manim animation videos (runtime)
│
└── templates/                # Flask HTML templates (admin dashboard views)
```

---

## Request Flow

### WhatsApp Message Flow

```
Student (WhatsApp)
      │
      ▼ HTTPS POST
Twilio Webhook
      │
      ▼
POST /webhook/whatsapp
  [backend/api/webhook.py]
      │
      ├─ Registration check → [services/user_service.py]
      │
      ├─ Session state lookup → [utils/session_manager.py]
      │
      ├─ Menu routing → [utils/menu_router.py]
      │
      ├─ Subject handler dispatch
      │       ├─ math → [handlers/exam_mathematics_handler.py]
      │       ├─ science → [handlers/combined_science_handler.py]
      │       ├─ english → [handlers/english_handler.py]
      │       └─ ...
      │
      ├─ AI generation → [services/ai_service.py]
      │       └─ Vertex AI (Gemini) API call
      │
      ├─ Credit deduction → [services/secure_credit_system.py]
      │       └─ Supabase PostgreSQL (atomic UPDATE)
      │
      └─ Response → [services/whatsapp_service.py]
              └─ Twilio API → Student (WhatsApp)
```

### Mobile / Web API Flow

```
Mobile App (React Native) / Web App (React)
      │
      ▼ HTTPS
/api/mobile/* or /api/v2/*
  [backend/api/mobile.py | school_ecosystem_v2.py | ...]
      │
      ├─ JWT auth validation → [backend/api/mobile.py:verify_token()]
      │
      ├─ Business logic → [services/*_service.py]
      │
      ├─ AI generation → [services/ai_service.py] → Vertex AI
      │
      └─ Database → Supabase (via database/external_db.py)
              └─ PostgreSQL
```

### Voice Agent Flow

```
Student (Browser / Mobile WebSocket)
      │
      ▼ WSS
FastAPI WebSocket [services/voice_agent.py]
      │
      ├─ Audio streaming → Gemini Live API (bidirectional audio)
      │
      └─ Text/audio response → Student
```

---

## Credit System

Credits are the NerdX in-app currency. 1 credit = 10 internal units.

**Flow:**
1. Student purchases credits via EcoCash → `services/payment_service.py`
2. Paynow processes payment → callback to `/webhook/paynow`
3. Credits added to student's Supabase record
4. Each AI feature deducts units atomically via `services/secure_credit_system.py`
5. Credit costs defined in `backend/config.py:Config.CREDIT_COSTS`

**Cost tiers:**
- Bundle commands (menu, navigation): 10 units (1 credit = 2 commands)
- Standard AI features (quiz, teacher mode): 5–10 units per use
- Complex features (comprehension, essay, audio): 20 units (2 credits)

---

## AI Model Usage

All AI generation uses **Google Gemini via Vertex AI** (production path):

| Feature | Model | Notes |
|---|---|---|
| Quiz generation | `gemini-2.5-flash` | All subjects |
| English comprehension | `gemini-2.5-flash` | Full passage + questions |
| Math visualization | `gemini-2.5-flash` | + Manim for animations |
| Voice / audio | Gemini Live API | Real-time bidirectional |
| OCR solving | `gemini-2.5-flash` | Multimodal (image input) |
| Teacher mode | `gemini-2.5-flash` | Streaming responses |

**DeepSeek** is used as a secondary/fallback for certain text generation tasks.

Model names are configurable via env vars: `VERTEX_GEMINI_TEXT_MODEL`.

---

## Database Schema

Two databases are used:

1. **Supabase PostgreSQL** (production) — stores users, credits, payments, sessions, school data
2. **SQLite** (local development fallback via SQLAlchemy) — basic user/question models

Key Supabase tables: `users`, `payments`, `credit_transactions`, `whatsapp_sessions`, `schools`, `teacher_classrooms`, `student_enrollments`, `context_packs`.

---

## Deployment Architecture

```
Internet
    │
    ▼
Render (Docker)
    ├── Flask/Gunicorn [backend/main.py]
    │       ├── Serves API routes (/api/*, /webhook/*)
    │       └── Serves NerdXWeb SPA (React build from NerdXWeb/dist/)
    │
    └── (Optional) Uvicorn [backend/asgi.py]
            ├── FastAPI voice WebSocket server
            └── Mounts Flask app via WSGIMiddleware
```
