
# Constants for NerdX Quiz Bot

# ZIMSEC Combined Science and English Topics
TOPICS = {
    "Biology": [
        "Laboratory rules and safety",
        "Cells and levels of organization", 
        "Nutrition",
        "Respiratory system",
        "Transport systems",
        "Reproduction in plants and animals",
        "Health and diseases"
    ],
    "Chemistry": [
        "Matter",
        "Acids, Bases and Salts",
        "Oxidation and Reduction", 
        "Industrial Processes",
        "Organic Chemistry"
    ],
    "Physics": [
        "Measurements",
        "Force",
        "Energy",
        "Magnetism", 
        "Electricity"
    ],
    "Mathematics": [
        "Real Numbers",
        "Sets",
        "Financial Mathematics",
        "Measures and Mensuration",
        "Graphs",
        "Variation",
        "Algebra",
        "Geometry",
        "Statistics",
        "Trigonometry",
        "Vectors",
        "Matrices",
        "Transformation",
        "Probability"
    ],
    "English": [
        "Formal Letter Writing",
        "Informal Letter Writing",
        "Article Writing",
        "Report Writing", 
        "Speech Writing",
        "Narrative Essays",
        "Descriptive Essays",
        "Argumentative Essays",
        "Comprehension Skills",
        "Vocabulary Building",
        "Grammar and Language",
        "Literary Devices",
        "Reading Skills",
        "Writing Skills"
    ]
}

# Credit costs for different features
CREDIT_COSTS = {
    'quiz_question': 10,
    'combined_exam': 15,
    'image_solve': 15,
    'audio_chat': 20,
    'graph_generation': 25
}

# Message templates
MESSAGE_TEMPLATES = {
    'welcome': "🎓 Welcome to NerdX - Your ZIMSEC Study Companion! 🎓",
    'insufficient_credits': "❌ Insufficient credits. Purchase more to continue.",
    'question_loading': "🔄 Generating your question... Please wait.",
    'error_generic': "❌ An error occurred. Please try again."
}

# Rate limiting settings
RATE_LIMITS = {
    'messages_per_minute': 10,
    'questions_per_hour': 20,
    'session_cooldown': 30
}
