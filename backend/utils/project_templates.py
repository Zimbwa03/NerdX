"""
ZIMSEC Project Templates
Pre-built templates for common project types
"""

ZIMSEC_TEMPLATES = {
    "computer_science_system": {
        "title": "School Management System",
        "subject": "Computer Science",
        "description": "A database-driven system for managing school records",
        "problem_definition": "Schools face challenges in managing student records, attendance, and grades manually. This leads to inefficiency and errors.",
        "objectives": [
            "To create a digital system for storing student information",
            "To automate attendance tracking",
            "To generate reports automatically",
            "To improve data accuracy and accessibility"
        ],
        "requirements": [
            "User authentication system",
            "Student database with CRUD operations",
            "Attendance tracking module",
            "Report generation functionality",
            "User-friendly interface"
        ],
        "suggested_tools": ["Python", "SQLite", "Tkinter/Flask"]
    },
    
    "agriculture_project": {
        "title": "Organic Vegetable Garden Project",
        "subject": "Agriculture",
        "description": "Establishing an organic vegetable garden using sustainable practices",
        "problem_definition": "Many communities lack access to fresh, chemical-free vegetables. This project addresses food security and nutrition.",
        "objectives": [
            "To establish an organic vegetable garden",
            "To demonstrate sustainable farming practices",
            "To produce chemical-free vegetables",
            "To educate the community on organic farming"
        ],
        "requirements": [
            "Land preparation and soil testing",
            "Selection of appropriate vegetable varieties",
            "Organic pest control methods",
            "Irrigation system",
            "Record keeping of growth and yield"
        ],
        "suggested_tools": ["Compost", "Organic fertilizers", "Drip irrigation"]
    },
    
    "science_investigation": {
        "title": "Water Purification Using Local Materials",
        "subject": "Combined Science",
        "description": "Investigating effective water purification methods using locally available materials",
        "problem_definition": "Access to clean drinking water is limited in rural areas. This project explores affordable purification methods.",
        "objectives": [
            "To test different purification methods",
            "To compare effectiveness of local materials",
            "To develop a cost-effective purification system",
            "To educate communities on water safety"
        ],
        "requirements": [
            "Water quality testing equipment",
            "Various filtration materials (sand, charcoal, gravel)",
            "Control and experimental samples",
            "Data collection methods",
            "Safety protocols"
        ],
        "suggested_tools": ["pH meter", "Turbidity test", "Bacterial culture"]
    },
    
    "renewable_energy": {
        "title": "Solar Water Heater for Rural Homes",
        "subject": "Physics",
        "description": "Designing and building a solar water heater using affordable materials",
        "problem_definition": "Rural homes lack access to electricity for water heating. Solar energy provides a sustainable solution.",
        "objectives": [
            "To design an efficient solar water heater",
            "To use locally available materials",
            "To test heating efficiency",
            "To calculate cost-effectiveness"
        ],
        "requirements": [
            "Solar collector design",
            "Insulated storage tank",
            "Piping system",
            "Temperature monitoring",
            "Efficiency calculations"
        ],
        "suggested_tools": ["Black pipes", "Glass/plastic cover", "Insulation material"]
    },
    
    "mobile_app": {
        "title": "Educational Quiz Mobile Application",
        "subject": "Computer Science",
        "description": "A mobile app for students to practice exam questions",
        "problem_definition": "Students need accessible practice materials for exam preparation. A mobile app provides convenient access.",
        "objectives": [
            "To create a user-friendly quiz application",
            "To include multiple subjects and topics",
            "To track student progress",
            "To provide instant feedback"
        ],
        "requirements": [
            "Question database",
            "User registration and login",
            "Quiz interface with timer",
            "Score tracking and analytics",
            "Offline functionality"
        ],
        "suggested_tools": ["React Native", "Firebase", "SQLite"]
    }
}

def get_template(template_key: str) -> dict:
    """Get a specific template by key"""
    return ZIMSEC_TEMPLATES.get(template_key, {})

def list_templates() -> list:
    """List all available templates"""
    return [
        {
            "key": key,
            "title": template["title"],
            "subject": template["subject"],
            "description": template["description"]
        }
        for key, template in ZIMSEC_TEMPLATES.items()
    ]
