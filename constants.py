# Constants for NerdX Quiz Bot

# ZIMSEC Combined Science and English Topics
TOPICS = {
    "Biology": [
        "Cell Structure and Organisation",
        "Movement In and Out of Cells",
        "Enzymes",
        "Plant Nutrition",
        "Animal Nutrition",
        "Transport in Plants",
        "Transport in Humans",
        "Respiration",
        "Excretion",
        "Coordination and Response",
        "Reproduction",
        "Organisms and Environment",
        "Human Influences on Ecosystem",
        "Classification"
    ],
    "Chemistry": [
        # Physical & Theoretical Chemistry
        "States of Matter",
        "Atoms, Elements and Compounds",
        "Chemical Bonding",
        "Stoichiometry",
        "The Periodic Table",
        # Reaction Dynamics & Energy
        "Chemical Reactions",
        "Chemical Energetics",
        "Electrochemistry",
        "Redox Reactions",
        # Inorganic & Environmental Chemistry
        "Acids, Bases and Salts",
        "Metals",
        "Non-metals",
        "Chemistry of the Environment",
        # Organic & Practical Chemistry
        "Organic Chemistry",
        "Experimental Techniques and Chemical Analysis"
    ],
    "Physics": [
        # Measurement & Mechanics
        "Measurement and Physical Quantities",
        "Kinematics (Speed, Velocity, Acceleration, Graphs of Motion)",
        "Forces (Including Machines, Turning Effects, Friction, and Mechanical Structures)",
        "Work, Energy and Power",
        # Thermal & Waves
        "Thermal Physics (Kinetic Theory, Thermal Properties, Heat Transfer)",
        "Waves (General Wave Properties, Optics, Sound)",
        # Electricity & Magnetism
        "Electricity (Current Electricity, Circuits)",
        "Magnetism and Electromagnetism",
        # Electronics & Modern Physics
        "Electronics (Logic Gates, Components)",
        "Atomic and Nuclear Physics (Modern Physics)"
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
        "Grammar Usage and Vocabulary"
    ]
}

# Difficulty levels
DIFFICULTY_LEVELS = {
    'easy': {
        'name': 'Easy',
        'credit_cost': 1,
        'point_value': 10
    },
    'medium': {
        'name': 'Medium',
        'credit_cost': 1,
        'point_value': 20
    },
    'difficult': {
        'name': 'Difficult',
        'credit_cost': 1,
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

# Rate limiting settings - WhatsApp Business Policy Compliant
RATE_LIMITS = {
    'messages_per_minute': 8,   # Reduced from 20 to 8 - WhatsApp compliant
    'questions_per_hour': 30,   # Reduced from 50 to 30 - prevent excessive usage
    'session_cooldown': 10      # Increased from 5 to 10 seconds - more conservative
}