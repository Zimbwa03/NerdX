"""
NerdX Hybrid Server (ASGI + WSGI)
=================================
This entry point combines the FastAPI Voice Agent (async) with the Flask Main App (sync).
It allows running BOTH the real-time AI tutor and the standard API/Dashboard 
on a single Render web service using Uvicorn.

Usage:
    uvicorn asgi:app --host 0.0.0.0 --port $PORT
"""

import os
import logging
from fastapi.middleware.wsgi import WSGIMiddleware
from services.voice_agent import app as voice_agent_app
from main import app as flask_app

# Set up logging to match the rest of the app
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("nerdx.asgi")

logger.info("🚀 Initializing NerdX Hybrid Server...")

# Mount the Flask app (WSGI) into the FastAPI app (ASGI)
# The FastAPI app handles its own routes (WebSockets at /ws/...) first.
# Any route not matched by FastAPI is passed down to Flask via WSGIMiddleware.
# This effectively makes FastAPI the "parent" router.
voice_agent_app.mount("/", WSGIMiddleware(flask_app))

# Export the combined app as 'app' for Uvicorn
app = voice_agent_app

logger.info("✅ NerdX Hybrid Server Ready: Voice Agent (Async) + Main App (Sync)")
