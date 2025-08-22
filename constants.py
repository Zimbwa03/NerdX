"""Constants for the NerdX ZIMSEC Quiz Bot"""

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

# Difficulty levels
DIFFICULTY_LEVELS = ["easy", "medium", "difficult"]

# Question types
QUESTION_TYPES = {
    "mcq": "Multiple Choice Question",
    "open": "Open-ended Question",
    "math": "Mathematics Problem",
    "essay": "Essay Question"
}

# User registration steps
REGISTRATION_STEPS = [
    "name",
    "surname", 
    "date_of_birth",
    "referral_code"
]

# Credit point values
POINT_VALUES = {
    "easy": 10,
    "medium": 20,
    "difficult": 50
}

# Payment status
PAYMENT_STATUS = {
    "pending": "pending",
    "completed": "completed",
    "failed": "failed",
    "cancelled": "cancelled"
}

# WhatsApp message templates
MESSAGE_TEMPLATES = {
    "welcome": "🎓 Welcome to NerdX ZIMSEC Quiz Bot!\n\nYour AI-powered study companion for ZIMSEC Combined Science and English.",
    "registration_complete": "✅ Registration complete! You've received 50 bonus credits to start your learning journey.",
    "insufficient_credits": "❌ Insufficient credits. You need {required} credits but have {available}.",
    "question_generated": "📚 Here's your {difficulty} {subject} question:",
    "correct_answer": "✅ Correct! You earned {points} points.",
    "incorrect_answer": "❌ Incorrect. The correct answer is: {answer}",
    "payment_pending": "💳 Payment of ${amount} is being processed. Reference: {reference}",
    "payment_success": "✅ Payment successful! {credits} credits added to your account.",
    "rate_limited": "⏳ Please wait {seconds} seconds before making another request."
}

# API endpoints
API_ENDPOINTS = {
    "deepseek": "https://api.deepseek.com/chat/completions",
    "gemini": "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
    "ecocash": "https://api.ecocash.co.zw/v1/payments",
    "desmos": "https://www.desmos.com/api/v1/calculator"
}
