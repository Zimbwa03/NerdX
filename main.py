# Import the Flask app first to avoid circular imports
from app import app

# Import routes after app is initialized
import routes

if __name__ == '__main__':
    import logging
    logging.info("NerdX Quiz Bot startup")
    app.run(host='0.0.0.0', port=5000, debug=True)

