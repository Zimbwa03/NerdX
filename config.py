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

    # Credit system configuration (units) - Option B: Student-Friendly Structure
    # 1 credit = 10 units
    # OPTION B IMPLEMENTATION:
    # - Commands: 1 credit = 2 commands (bundled to encourage learning, not spending on navigation)
    # - AI-Generated: 1 credit per use (reduced from 2 to make learning affordable)
    # - Complex Features: 2 credits per use (reduced from 3)
    CREDIT_COSTS = {
        # ============================================
        # COMMANDS: Bundled System (1 Credit = 2 Commands)
        # ============================================
        # User pays 1 credit, gets 2 command uses
        # Tracked via command_credit_tracker service
        # Cost: $0.005 × 2 = $0.010 per credit (sustainable)
        'menu_navigation': 10,             # Part of bundle: 1 credit = 2 commands
        'help_command': 10,                # Part of bundle: 1 credit = 2 commands
        'check_balance': 10,               # Part of bundle: 1 credit = 2 commands
        'settings_access': 10,              # Part of bundle: 1 credit = 2 commands
        'registration_step': 10,            # Part of bundle: 1 credit = 2 commands

        # ============================================
        # AI-GENERATED CONTENT: 1 Credit Per Use (10 units)
        # ============================================
        # Reduced from 2 credits to 1 credit - makes learning more affordable
        # Cost: Twilio ($0.005) + AI ($0.002) = $0.007 per credit
        
        # Combined Science (O-Level) – 0.5 credit per question
        'combined_science_exam': 5,
        'combined_science_topical': 5,
        'combined_science_topical_mcq': 5,
        'combined_science_topical_structured': 5,

        # Computer Science (O-Level) – MCQ 0.3, Structured 0.5, Essay 1 (1 credit = 3 MCQs)
        'computer_science_topical_mcq': 3,         # 0.3 credit per MCQ (3 units)
        'computer_science_topical_structured': 5,  # 0.5 credit per structured (5 units)
        'computer_science_topical_essay': 10,      # 1 credit per essay (10 units)
        'computer_science_exam_mcq': 3,           # 0.3 credit per exam MCQ (3 units) - 1 credit = 3 MCQs
        'computer_science_exam_structured': 5,     # 0.5 credit per exam structured (5 units)
        'computer_science_exam_essay': 10,         # 1 credit per exam essay (10 units)

        # Mathematics (O-Level) – 0.5 credit per question
        'math_topical': 5,
        'math_exam': 5,
        'math_quiz': 5,
        'math_graph_practice': 5,

        # English (Topical) – 0.5 credit
        'english_topical': 5,

        # AI Teacher Mode – 0.1 credit per message
        'teacher_mode_start': 1,
        'teacher_mode_followup': 1,

        # Project Assistant (Basic) – 0.2 credit per message
        'project_assistant_start': 2,
        'project_assistant_followup': 2,

        # Study Tools & Virtual Lab
        'flashcard_single': 3,             # 0.3 credit
        'virtual_lab_knowledge_check': 3,   # 0.3 credit
        'geo_maps_feedback': 1,            # 0.1 credit
        'programming_lab_ai': 1,           # 0.1 credit

        # ============================================
        # COMPLEX FEATURES: 2 Credits Per Use (20 units)
        # ============================================
        # Reduced from 3 credits to 2 credits
        # Cost: Twilio ($0.005) + High AI ($0.007) = $0.012 per 2 credits = $0.006 per credit

        # English (Complex Features)
        'english_comprehension': 20,       # 2 credits - Full passage + questions
        'english_essay_writing': 20,       # 2 credits - Long-form content
        'english_essay_marking': 20,       # 2 credits - Detailed AI analysis
        'english_comprehension_grading': 20, # 2 credits - AI grading
        'english_summary_grading': 20,     # 2 credits - AI grading

        # A-Level Pure Math, Chemistry, Physics – 0.5 credit per question
        'a_level_pure_math_topical': 5,
        'a_level_pure_math_topical_mcq': 5,
        'a_level_pure_math_topical_structured': 5,
        'a_level_pure_math_exam': 5,
        'a_level_chemistry_topical': 5,
        'a_level_chemistry_topical_mcq': 5,
        'a_level_chemistry_topical_structured': 5,
        'a_level_chemistry_exam': 5,
        'a_level_physics_topical': 5,
        'a_level_physics_topical_mcq': 5,
        'a_level_physics_topical_structured': 5,
        'a_level_physics_exam': 5,
        # A-Level Biology – MCQ/structured 0.5, essay 1
        'a_level_biology_topical_mcq': 5,
        'a_level_biology_topical_structured': 5,
        'a_level_biology_topical_essay': 10,
        'a_level_biology_exam_mcq': 5,
        'a_level_biology_exam_structured': 5,
        'a_level_biology_exam_essay': 10,
        # A-Level Computer Science – MCQ 0.3, Structured 0.5, Essay 1
        'a_level_computer_science_topical_mcq': 3,
        'a_level_computer_science_topical_structured': 5,
        'a_level_computer_science_topical_essay': 10,
        'a_level_computer_science_exam_mcq': 3,
        'a_level_computer_science_exam_structured': 5,
        'a_level_computer_science_exam_essay': 10,
        # A-Level Geography – topical 0.5, exam essay 1
        'a_level_geography_topical_essay': 5,
        'a_level_geography_exam_essay': 10,

        # Audio / Live (Complex processing)
        'audio_feature': 20,               # 2 credits - Audio processing + AI
        'voice_chat': 20,                 # 2 credits - Real-time voice processing

        # Vision/Tools – 1 credit each
        'ocr_solve': 10,
        'image_solve': 10,
        'image_generation': 10,

        # Project Assistant (Advanced) – transcribe 1 credit, rest 2 credits
        'project_web_search': 20,
        'project_deep_research': 20,
        'project_transcribe': 10,
        'project_image_generation': 20,
        'project_assistant_batch': 20,

        # AI Teacher PDF Generation
        'teacher_mode_pdf': 20,           # 2 credits - PDF generation

        # Audio Flashcards
        'flashcard_audio': 20,            # 2 credits - Audio flashcards

        # Legacy compatibility (Mapped values)
        'math': 5,                         # Maps to math_topical (0.5 credit)
        'science': 5,                      # Maps to combined_science_topical (0.5 credit)
        'english': 5,                     # Maps to english_topical (0.5 credit)
        'graph_generation': 5,            # Maps to math_graph_practice (0.5 credit)
        'web_search': 20,
        'deep_research': 20
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
