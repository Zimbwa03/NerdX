# Import the Flask app first to avoid circular imports
from app import app, db
from flask import Flask, request, jsonify, redirect, url_for
import logging
import os
import threading

# Lazy initialization flag
_services_initialized = False
_init_lock = threading.Lock()

def initialize_services():
    """Initialize database and services after app starts"""
    global _services_initialized
    
    if _services_initialized:
        return
    
    with _init_lock:
        if _services_initialized:
            return
        
        logging.info("🚀 Starting lazy initialization...")
        
        with app.app_context():
            try:
                # Import models to ensure tables are created
                import models
                db.create_all()
                logging.info("✅ Database tables created successfully")
            except Exception as e:
                logging.error(f"❌ Database initialization error: {e}")
            
            # Initialize Supabase database tables
            try:
                from database.external_db import init_database
                supabase_init_result = init_database()
                if supabase_init_result:
                    logging.info("✅ Supabase database initialized successfully")
                else:
                    logging.error("❌ Supabase database initialization failed")
            except Exception as e:
                logging.error(f"❌ Supabase initialization error: {e}")
        
        _services_initialized = True
        logging.info("✅ Lazy initialization completed")

# Import routes after app is initialized
import routes

# Start initialization in background thread after import
# This allows gunicorn to bind to port first
def background_init():
    import time
    time.sleep(2)  # Give gunicorn time to bind to port
    initialize_services()

init_thread = threading.Thread(target=background_init, daemon=True)
init_thread.start()

if __name__ == '__main__':
    logging.info("NerdX Quiz Bot startup")
    # Get port from environment variable (Render provides this) or default to 5000
    port = int(os.environ.get('PORT', 5000))
    # Enable debug mode for local development
    debug_mode = os.environ.get('FLASK_DEBUG', '0') == '1' or os.environ.get('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug_mode)