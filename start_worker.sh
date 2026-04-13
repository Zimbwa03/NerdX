#!/bin/bash
# NerdX Celery Worker
# -------------------
# Run as a separate Render service pointing to this script.
# Set the same environment variables as the main web service
# (DATABASE_URL, REDIS_URL, GEMINI_API_KEY, etc.).
#
# Render service settings:
#   Build command:  pip install -r requirements_render.txt
#   Start command:  bash start_worker.sh
#   Instance type:  Starter (0.5 CPU / 512 MB is enough for background tasks)

set -e

echo "Starting NerdX Celery worker..."

cd "$(dirname "$0")"

# Add backend to Python path
export PYTHONPATH="${PYTHONPATH}:$(pwd)/backend:$(pwd)"

celery -A backend.services.task_queue.celery_app worker \
  --loglevel=info \
  --concurrency=4 \
  --queues=graphics,documents,audio,analytics,pregenerate,celery \
  --max-tasks-per-child=100 \
  --beat \
  --without-gossip \
  --without-mingle \
  --without-heartbeat
