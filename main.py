# Import the Flask app first to avoid circular imports
# Import the Flask app first to avoid circular imports
from app import app
from flask import Flask, request, jsonify, redirect, url_for

# Import routes after app is initialized
import routes

if __name__ == '__main__':
    import logging
    import os
    logging.info("NerdX Quiz Bot startup")
    # Get port from environment variable (Render provides this) or default to 5000
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)