import os


def _env_int(name: str, default: int) -> int:
    """Parse an integer environment variable safely."""
    value = os.getenv(name)
    if value is None:
        return default
    try:
        return int(value)
    except ValueError:
        return default


class Config:
    """Configuration class for the NerdX Quiz Bot"""

    # Credit units
    CREDIT_UNITS_PER_CREDIT = 10

    # Environment variables
    # AI: Vertex AI (Gemini) is the supported path for generation. Optional legacy env vars may remain in .env.
    DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY')
    DEEPSEEK_CHAT_MODEL = os.getenv('DEEPSEEK_CHAT_MODEL', 'deepseek-chat')
    DEEPSEEK_REASONER_MODEL = os.getenv('DEEPSEEK_REASONER_MODEL', 'deepseek-reasoner')
    VERTEX_GEMINI_TEXT_MODEL = os.getenv('VERTEX_GEMINI_TEXT_MODEL', 'gemini-2.5-flash')
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

        # MAIC AI Classroom (per segment / interaction)
        'maic_classroom_start': 1,
        'maic_classroom_stream': 1,
        'maic_classroom_message': 1,
        'maic_classroom_quiz': 2,

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
        # A-Level Geography – MCQ 0.3, Structured 0.5, Essay 1 (same as other A-Level)
        'a_level_geography_topical_mcq': 3,
        'a_level_geography_topical_structured': 5,
        'a_level_geography_topical_essay': 10,
        'a_level_geography_exam_mcq': 3,
        'a_level_geography_exam_structured': 5,
        'a_level_geography_exam_essay': 10,

        # Audio / Live (Complex processing)
        'audio_feature': 20,               # 2 credits - Audio processing + AI
        'voice_chat': 20,                 # 2 credits - Real-time voice processing

        # Vision/Tools – image generation 2 credits; others 1 credit
        'ocr_solve': 10,
        'image_solve': 10,
        'image_generation': 20,          # 2 credits

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

        # History (ZIMSEC O-Level) – Paper 1 Essays only (3-part ZIMSEC format)
        'history_topical_essay': 10,       # 1 credit (10 units) per essay question
        'history_exam_essay': 10,         # 1 credit (10 units) per exam essay question
        'history_essay_marking': 0,       # no extra – 1 credit total per essay (10 units)

        # --- Legacy aliases (deprecated) ---
        # TODO: Remove these in v3.0 — use the canonical keys above instead.
        'math': 5,                         # alias → math_topical
        'science': 5,                      # alias → combined_science_topical
        'english': 5,                      # alias → english_topical
        'graph_generation': 5,             # alias → math_graph_practice
        'web_search': 20,                  # alias → project_web_search
        'deep_research': 20,               # alias → project_deep_research
    }
    
    # Registration and Referral Credits (units)
    REGISTRATION_BONUS = 1500             # 150 credits
    REFERRAL_BONUS = 100                  # 10 credits
    
    # Low Credit Threshold (units)
    LOW_CREDIT_THRESHOLD = 200            # 20 credits

    # === AI TIMEOUT CONFIGURATION ===
    # Fast path: navigation, simple MCQ, menu responses
    AI_TIMEOUT_FAST = 8
    # Standard path: quiz generation, explanations, chat
    AI_TIMEOUT_STANDARD = 15
    # Heavy path: A-Level essays, marking, deep reasoning
    AI_TIMEOUT_HEAVY = 25
    # Streaming: fail fast if no first token arrives within this time
    AI_TIMEOUT_STREAM_FIRST_TOKEN = 5

    AI_MAX_RETRIES = 1        # ONE retry only — fail fast, never make students wait 3 min
    AI_RETRY_DELAY = 0.5      # 500 ms between retry attempts

    # Legacy alias kept so any code that still reads the old list doesn't crash.
    # New code should use AI_TIMEOUT_FAST / AI_TIMEOUT_STANDARD / AI_TIMEOUT_HEAVY.
    AI_REQUEST_TIMEOUT = [AI_TIMEOUT_STANDARD, AI_TIMEOUT_HEAVY]

    # Enhanced Learning Features — default subject AI model IDs refer to Gemini on Vertex
    _vertex_text = os.getenv('VERTEX_GEMINI_TEXT_MODEL', 'gemini-2.5-flash')
    SCIENCE_AI_MODEL = os.getenv('SCIENCE_AI_MODEL', _vertex_text)
    ENGLISH_AI_MODEL = os.getenv('ENGLISH_AI_MODEL', _vertex_text)
    MATHEMATICS_AI_MODEL = os.getenv('MATHEMATICS_AI_MODEL', _vertex_text)

    # Audio Processing
    AUDIO_MODEL = os.getenv('AUDIO_MODEL', 'whisper-1')
    TTS_MODEL = os.getenv('TTS_MODEL', 'tts-1')
    TTS_VOICE = os.getenv('TTS_VOICE', 'alloy')

    # Image Hosting
    IMGBB_API_KEY = os.getenv('IMGBB_API_KEY')

    # Teacher visualization controls
    MANIM_RENDER_TIMEOUT = _env_int('MANIM_RENDER_TIMEOUT', 20)
    ENABLE_MANIM_RENDERING = os.getenv('ENABLE_MANIM_RENDERING', 'true').lower() in ('true', '1', 'yes')

    # ZIMSEC Beta Math Prompts (template-based from ZIMSEC MD files)
    USE_ZIMSEC_BETA_MATH_PROMPTS = os.getenv('USE_ZIMSEC_BETA_MATH_PROMPTS', 'false').lower() in ('true', '1', 'yes')

    # === INTELLIGENT MODEL ROUTING ===
    # Route requests to the right Gemini tier based on task type.
    # Tier 1 (Flash-Lite): navigation, simple MCQ        → target <3 s
    # Tier 2 (Flash):      standard quiz, explanations   → target <8 s
    # Tier 3 (Pro):        A-Level, essays, marking      → target <20 s (streamed)
    MODEL_ROUTING = {
        'tier_1_flash_lite': 'gemini-2.5-flash-lite',
        'tier_1_tasks': [
            'menu_navigation', 'help_command', 'check_balance', 'settings_access',
            'registration_step', 'flashcard_single', 'geo_maps_feedback',
            'programming_lab_ai', 'teacher_mode_followup', 'maic_classroom_message',
        ],
        'tier_2_flash': 'gemini-2.5-flash',
        'tier_2_tasks': [
            'combined_science_exam', 'combined_science_topical',
            'combined_science_topical_mcq', 'combined_science_topical_structured',
            'math_topical', 'math_exam', 'math_quiz', 'math_graph_practice',
            'english_topical', 'computer_science_topical_mcq',
            'computer_science_exam_mcq', 'teacher_mode_start',
            'maic_classroom_start', 'maic_classroom_quiz',
            'virtual_lab_knowledge_check', 'ocr_solve', 'image_solve',
            'project_assistant_start', 'project_assistant_followup',
        ],
        'tier_3_pro': 'gemini-2.5-pro',
        'tier_3_tasks': [
            'a_level_pure_math_topical', 'a_level_pure_math_topical_structured',
            'a_level_pure_math_exam', 'a_level_chemistry_topical_structured',
            'a_level_chemistry_exam', 'a_level_physics_topical_structured',
            'a_level_physics_exam', 'a_level_biology_topical_essay',
            'a_level_biology_exam_essay', 'a_level_computer_science_topical_essay',
            'a_level_computer_science_exam_essay', 'a_level_geography_topical_essay',
            'a_level_geography_exam_essay', 'english_comprehension',
            'english_essay_writing', 'english_essay_marking',
            'english_comprehension_grading', 'english_summary_grading',
            'history_topical_essay', 'history_exam_essay',
            'project_web_search', 'project_deep_research', 'teacher_mode_pdf',
        ],
    }

    # === CACHING CONFIGURATION ===
    REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')

    CACHE_TTL = {
        'mcq_question':        86400,   # 24 h — MCQ answers don't change
        'structured_question': 43200,   # 12 h
        'explanation':         86400,   # 24 h
        'math_solution':       86400,   # 24 h — deterministic
        'essay_question':      21600,   # 6 h
        'student_profile':     300,     # 5 min
        'dkt_state':           60,      # 1 min — knowledge state updates often
    }

    # === STREAMING CONFIGURATION ===
    ENABLE_STREAMING = True
    STREAM_CHUNK_SIZE = 50           # characters per SSE chunk
    STREAM_FLUSH_INTERVAL = 0.05     # 50 ms between flushes

    # === BACKGROUND TASK CONFIGURATION (Celery + Redis) ===
    CELERY_BROKER_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
    CELERY_RESULT_BACKEND = os.getenv('REDIS_URL', 'redis://localhost:6379/0')

    # DKT writes are background tasks — never block question generation
    DKT_ASYNC_WRITE = True
    DKT_BATCH_SIZE = 10
    DKT_FLUSH_INTERVAL = 30          # flush DKT batch every 30 s

    # Manim rendering is always async — never run in the request thread
    MANIM_RENDER_ASYNC = True
    MANIM_RENDER_TIMEOUT = _env_int('MANIM_RENDER_TIMEOUT', 60)   # fine async

    @classmethod
    def validate_config(cls):
        """Validate required configuration"""
        required_vars = [
            'TWILIO_ACCOUNT_SID',
            'TWILIO_AUTH_TOKEN',
            'TWILIO_PHONE_NUMBER',
        ]

        missing_vars = []
        for var in required_vars:
            if not getattr(cls, var):
                missing_vars.append(var)

        if missing_vars:
            raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")

        return True
