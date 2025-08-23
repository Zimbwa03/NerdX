# Constants for NerdX Quiz Bot

# ZIMSEC Combined Science and English Topics - Restored from backup
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

# Difficulty levels
DIFFICULTY_LEVELS = {
    'easy': {
        'name': 'Easy',
        'credit_cost': 5,
        'point_value': 10
    },
    'medium': {
        'name': 'Medium',
        'credit_cost': 10,
        'point_value': 20
    },
    'difficult': {
        'name': 'Difficult',
        'credit_cost': 15,
        'point_value': 30
    }
}

# Point values for different question types
POINT_VALUES = {
    'easy': 10,
    'medium': 20,
    'difficult': 30,
    'bonus': 5
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
    'welcome': """🎓 Welcome to NerdX Quiz Bot! 🎓

Your personal ZIMSEC study companion for Biology, Chemistry, Physics, Mathematics, and English.

📚 Get AI-generated questions
📊 Track your progress  
🏆 Earn points and achievements
💡 Learn with detailed explanations

Ready to boost your grades? Let's start learning! 🚀"""
}

# Rate limiting settings
RATE_LIMITS = {
    'messages_per_minute': 10,
    'questions_per_hour': 20,
    'session_cooldown': 30
}