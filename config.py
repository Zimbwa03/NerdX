import os

class Config:
    """Configuration class for the NerdX Quiz Bot"""

    # Environment variables
    DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY')
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    DESMOS_API_KEY = os.getenv('DESMOS_API_KEY')

    # Base URL for public file access
    BASE_URL = os.getenv('BASE_URL')

    # WhatsApp API configuration
    WHATSAPP_ACCESS_TOKEN = os.getenv('WHATSAPP_ACCESS_TOKEN')
    WHATSAPP_PHONE_NUMBER_ID = os.getenv('WHATSAPP_PHONE_NUMBER_ID')
    WHATSAPP_VERIFY_TOKEN = os.getenv('WHATSAPP_VERIFY_TOKEN')

    # EcoCash payment configuration
    ECOCASH_API_KEY = os.getenv('ECOCASH_API_KEY')
    ECOCASH_MERCHANT_CODE = os.getenv('ECOCASH_MERCHANT_CODE')

    # Database configuration
    DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///nerdx_quiz.db')

    # Session configuration
    SESSION_COOLDOWN = 5  # 5 seconds between same actions (reduced from 30)
    RATE_LIMITS = {
        'text_message': 3,      # 3 seconds between text messages
        'image_message': 10,    # 10 seconds between image uploads
        'quiz_action': 5,       # 5 seconds between quiz actions
        'ai_generation': 15,    # 15 seconds between AI generations
        'menu_navigation': 1    # 1 second between menu navigation
    }

    # Credit system configuration - Advanced Credit System
    CREDIT_COSTS = {
        # Combined Science
        'combined_science_topical': 1,      # Topical Questions
        'combined_science_exam': 2,        # Combined Exam
        
        # Mathematics
        'math_topical': 1,                 # Topical Questions
        'math_exam': 2,                    # Math Exam
        'math_graph_practice': 3,          # Graph Practices
        
        # English
        'english_topical': 1,              # Topical Questions
        'english_comprehension': 3,        # Comprehension
        'english_essay_writing': 3,        # Essay Writing
        
        # Audio Features
        'audio_feature': 10,               # Audio Feature
        'voice_chat': 10,                  # Voice Chat
        
        # Legacy compatibility (keep lower costs for existing handlers)
        'math': 1,
        'science': 1,
        'english': 1,
        'image_solve': 3,
        'graph_generation': 3
    }
    
    # Registration and Referral Credits
    REGISTRATION_BONUS = 75               # Credits given to new users (once off)
    REFERRAL_BONUS = 5                    # Credits for successful referrals
    
    # Low Credit Threshold
    LOW_CREDIT_THRESHOLD = 20             # Show "Buy Credits" button when credits <= 20

    # AI API timeouts and retries
    AI_REQUEST_TIMEOUT = [30, 45, 60]
    AI_MAX_RETRIES = 3

    # Enhanced Learning Features
    ENGLISH_AI_MODEL = os.getenv('ENGLISH_AI_MODEL', 'gemini-1.5-flash')
    MATHEMATICS_AI_MODEL = os.getenv('MATHEMATICS_AI_MODEL', 'deepseek-chat')

    # Audio Processing
    AUDIO_MODEL = os.getenv('AUDIO_MODEL', 'whisper-1')
    TTS_MODEL = os.getenv('TTS_MODEL', 'tts-1')
    TTS_VOICE = os.getenv('TTS_VOICE', 'alloy')

    # Image Hosting
    IMGBB_API_KEY = os.getenv('IMGBB_API_KEY')

    @classmethod
    def validate_config(cls):
        """Validate required configuration"""
        required_vars = [
            'DEEPSEEK_API_KEY',
            'WHATSAPP_ACCESS_TOKEN',
            'WHATSAPP_PHONE_NUMBER_ID',
            'WHATSAPP_VERIFY_TOKEN'
        ]

        missing_vars = []
        for var in required_vars:
            if not getattr(cls, var):
                missing_vars.append(var)

        if missing_vars:
            raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")

        return True