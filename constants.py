# Constants for NerdX Quiz Bot

# ZIMSEC Combined Science and English Topics
TOPICS = {
    "Biology": [
        "Cell Structure and Organisation",
        "Human Biology - Circulation System",
        "Human Biology - Respiratory System",
        "Human Biology - Digestive System",
        "Human Biology - Excretory System",
        "Human Biology - Nervous System",
        "Human Biology - Reproduction",
        "Plant Biology - Structure and Function",
        "Plant Biology - Nutrition and Transport",
        "Plant Biology - Reproduction",
        "Genetics and Heredity",
        "Ecology and Environment",
        "Classification of Living Organisms",
        "Evolution and Natural Selection",
        "Disease and Immunity",
        "Microorganisms"
    ],
    "Chemistry": [
        "Atomic Structure",
        "Chemical Bonding",
        "Acids, Bases and Salts",
        "Metals and Metal Extraction",
        "Non-metals and their Compounds",
        "Organic Chemistry - Hydrocarbons",
        "Organic Chemistry - Alcohols",
        "Chemical Reactions and Equations",
        "Oxidation and Reduction",
        "Rates of Reaction",
        "Electrochemistry",
        "Water and Solutions",
        "Air and Atmosphere",
        "Chemical Industry"
    ],
    "Physics": [
        "Mechanics - Motion in a Straight Line",
        "Mechanics - Forces and Motion",
        "Mechanics - Energy, Work and Power",
        "Heat and Temperature",
        "Kinetic Theory of Matter",
        "Light - Reflection and Mirrors",
        "Light - Refraction and Lenses",
        "Sound and Waves",
        "Static Electricity",
        "Current Electricity",
        "Magnetism and Electromagnetism",
        "Electronics",
        "Atomic Physics",
        "Space Physics"
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