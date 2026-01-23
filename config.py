import os

class Config:
    """Configuration class for the NerdX Quiz Bot"""

    # Credit units
    CREDIT_UNITS_PER_CREDIT = 10

    # Environment variables
    # DeepSeek AI is the primary AI provider for all text generation
    DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY')
    # DeepSeek model aliases (use official "latest" aliases by default)
    DEEPSEEK_CHAT_MODEL = os.getenv('DEEPSEEK_CHAT_MODEL', 'deepseek-chat')
    DEEPSEEK_REASONER_MODEL = os.getenv('DEEPSEEK_REASONER_MODEL', 'deepseek-reasoner')
    # Gemini is only used for image generation
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    DESMOS_API_KEY = os.getenv('DESMOS_API_KEY')

    # Base URL for public file access
    BASE_URL = os.getenv('BASE_URL')

    # Twilio WhatsApp configuration (PRIMARY AND ONLY PROVIDER)
    # Note: Facebook/Meta API has been completely removed - Twilio is the only provider
    TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
    TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
    TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')

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

    # Credit system configuration (units) - Advanced Credit System
    # 1 credit = 10 units
    CREDIT_COSTS = {
        # Combined Science (O-Level)
        # Whole-credit pricing: all costs are multiples of 10 units (>= 1 credit) for visible deductions
        'combined_science_exam': 10,                # 1 credit per question
        'combined_science_topical': 10,             # 1 credit per question
        'combined_science_topical_mcq': 10,         # 1 credit per MCQ
        'combined_science_topical_structured': 10,  # 1 credit per structured question

        # Mathematics (O-Level)
        'math_topical': 10,                # 1 credit per question
        'math_exam': 10,                   # 1 credit per question
        'math_quiz': 10,                   # 1 credit per question (streaming)
        'math_graph_practice': 10,         # 1 credit per graph/question/video

        # English (unchanged pricing, now in units)
        'english_topical': 10,             # 1 credit per question
        'english_comprehension': 30,       # 3 credits
        'english_essay_writing': 30,       # 3 credits
        'english_essay_marking': 30,       # 3 credits
        'english_comprehension_grading': 30,
        'english_summary_grading': 30,

        # A-Level Mathematics
        'a_level_pure_math_topical': 10,             # 1 credit per MCQ question
        'a_level_pure_math_topical_mcq': 10,         # 1 credit per MCQ question
        'a_level_pure_math_topical_structured': 10,  # 1 credit per structured question
        'a_level_pure_math_exam': 10,                # 1 credit per question

        # A-Level Chemistry
        'a_level_chemistry_topical': 10,             # 1 credit per MCQ question
        'a_level_chemistry_topical_mcq': 10,         # 1 credit per MCQ question
        'a_level_chemistry_topical_structured': 10,  # 1 credit per structured question
        'a_level_chemistry_exam': 10,                # 1 credit per question

        # A-Level Physics
        'a_level_physics_topical': 10,               # 1 credit per MCQ question
        'a_level_physics_topical_mcq': 10,           # 1 credit per MCQ question
        'a_level_physics_topical_structured': 10,    # 1 credit per structured question
        'a_level_physics_exam': 10,                  # 1 credit per question

        # A-Level Biology (whole-credit pricing)
        'a_level_biology_topical_mcq': 10,        # 1 credit
        'a_level_biology_topical_structured': 10, # 1 credit
        'a_level_biology_topical_essay': 10,      # 1 credit
        'a_level_biology_exam_mcq': 10,
        'a_level_biology_exam_structured': 10,
        'a_level_biology_exam_essay': 10,

        # Audio / Live
        'audio_feature': 10,               # 1 credit per audio request
        'voice_chat': 10,                  # 1 credit per 5 seconds (live)

        # Flashcards
        'flashcard_single': 10,            # 1 credit per flashcard
        'flashcard_audio': 30,             # 3 credits (audio flashcards)

        # Virtual Lab
        'virtual_lab_knowledge_check': 10, # 1 credit per question

        # AI Teacher & Assistant - per response billing
        'teacher_mode_start': 10,          # 1 credit per AI response
        'teacher_mode_followup': 10,       # 1 credit per AI response
        'teacher_mode_pdf': 10,            # 1 credit for PDF notes
        'project_assistant_start': 10,     # 1 credit per AI response
        'project_assistant_followup': 10,  # 1 credit per AI response
        'project_assistant_batch': 10,     # Legacy mapping

        # Vision/Tools
        'ocr_solve': 30,                   # 3 credits
        'image_solve': 30,                 # 3 credits (OCR/solve)
        'image_generation': 30,            # 3 credits

        # Project Assistant Research
        'web_search': 20,                  # 2 credits
        'deep_research': 50,               # 5 credits
        'project_web_search': 20,
        'project_deep_research': 50,
        'project_transcribe': 20,          # 2 credits
        'project_image_generation': 20,    # 2 credits

        # Legacy compatibility (Mapped values)
        'math': 10,
        'science': 10,
        'english': 10,
        'graph_generation': 10
    }
    
    # Registration and Referral Credits (units)
    REGISTRATION_BONUS = 1500             # 150 credits
    REFERRAL_BONUS = 50                   # 5 credits
    
    # Low Credit Threshold (units)
    LOW_CREDIT_THRESHOLD = 200            # 20 credits

    # AI API timeouts and retries
    AI_REQUEST_TIMEOUT = [30, 45, 60]
    AI_MAX_RETRIES = 3

    # Enhanced Learning Features
    # All subjects now use DeepSeek AI (DeepSeek-V3) for better performance
    SCIENCE_AI_MODEL = os.getenv('SCIENCE_AI_MODEL', DEEPSEEK_CHAT_MODEL)
    ENGLISH_AI_MODEL = os.getenv('ENGLISH_AI_MODEL', DEEPSEEK_CHAT_MODEL)
    MATHEMATICS_AI_MODEL = os.getenv('MATHEMATICS_AI_MODEL', DEEPSEEK_CHAT_MODEL)

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
            'TWILIO_ACCOUNT_SID',
            'TWILIO_AUTH_TOKEN',
            'TWILIO_PHONE_NUMBER'
        ]

        missing_vars = []
        for var in required_vars:
            if not getattr(cls, var):
                missing_vars.append(var)

        if missing_vars:
            raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")

        return True
