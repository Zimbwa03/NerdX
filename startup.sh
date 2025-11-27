#!/bin/bash
# Azure Startup Script
# This script runs when your app starts on Azure

echo "Starting NerdX application on Azure..."

# Activate virtual environment if it exists
if [ -d "antenv" ]; then
    source antenv/bin/activate
fi

# Run database migrations if needed
# python -c "from app import app, db; app.app_context().push(); db.create_all()"

# Start the application with gunicorn
exec gunicorn main:app \
    --bind 0.0.0.0:8000 \
    --workers 1 \
    --timeout 180 \
    --preload \
    --access-logfile '-' \
    --error-logfile '-' \
    --log-level info
