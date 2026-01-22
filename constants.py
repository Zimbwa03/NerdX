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
        # ZIMSEC O-Level English Language Papers
        "Continuous Writing / Composition",
        "Guided Writing / Functional Writing",
        "Comprehension Skills",
        "Summary Writing",
        "Language and Grammar in Context",
        "Grammar Usage and Vocabulary"
    ],
    "Computer Science": [
        # Hardware and Software
        "Hardware and Software",
        # Applications of Computer Science
        "Applications of Computer Science",
        # Data Representation
        "Data Representation",
        # Communication Networks & Internet Technologies
        "Communication Networks and Internet Technologies",
        # Security and Ethics / Cyber Security
        "Security and Ethics",
        # System Analysis and Design
        "System Analysis and Design",
        # Algorithm Design and Problem-Solving
        "Algorithm Design and Problem-Solving",
        # Programming
        "Programming",
        # Databases
        "Databases",
        # Web Design and Internet Uses
        "Web Design and Internet Uses",
        # Automated and Emerging Technologies / Technopreneurship
        "Automated and Emerging Technologies"
    ]
}

# A Level Physics Topics (Cambridge/ZIMSEC A Level Syllabus)
A_LEVEL_PHYSICS_TOPICS = {
    "AS Level": [
        "Physical Quantities and Units",
        "Kinematics",
        "Dynamics",
        "Forces, Density, and Pressure",
        "Work, Energy, and Power",
        "Deformation of Solids",
        "Waves",
        "Superposition",
        "Electricity",
        "D.C. Circuits",
        "Particle Physics"
    ],
    "A2 Level": [
        "Motion in a Circle",
        "Gravitational Fields",
        "Temperature",
        "Ideal Gases",
        "Thermodynamics",
        "Oscillations",
        "Electric Fields",
        "Capacitance",
        "Magnetic Fields",
        "Alternating Currents",
        "Quantum Physics",
        "Nuclear Physics",
        "Astronomy and Cosmology"
    ]
}

# All A Level Physics topics flat list
A_LEVEL_PHYSICS_ALL_TOPICS = A_LEVEL_PHYSICS_TOPICS["AS Level"] + A_LEVEL_PHYSICS_TOPICS["A2 Level"]

# A Level Chemistry Topics (Cambridge/ZIMSEC A Level Syllabus)
A_LEVEL_CHEMISTRY_TOPICS = {
    "Lower Sixth": [
        # Physical Chemistry
        "Atomic Structure",
        "Atoms, Molecules and Stoichiometry",
        "Chemical Bonding",
        "States of Matter",
        "Chemical Energetics",
        "Electrochemistry",
        "Equilibria",
        "Reaction Kinetics",
        # Inorganic Chemistry
        "The Periodic Table: Chemical Periodicity",
        "Group 2 Elements",
        "Group 17 Elements",
        "Nitrogen and Sulfur",
        # Organic Chemistry
        "Introduction to Organic Chemistry",
        "Hydrocarbons",
        "Halogen Compounds",
        "Hydroxy Compounds",
        "Carbonyl Compounds",
        "Carboxylic Acids and Derivatives",
        "Nitrogen Compounds",
        "Polymerisation",
        "Organic Synthesis",
        "Analytical Techniques"
    ],
    "Upper Sixth": [
        # Physical Chemistry
        "Chemical Energetics (Advanced)",
        "Electrochemistry (Advanced)",
        "Equilibria (Advanced)",
        "Reaction Kinetics (Advanced)",
        # Inorganic Chemistry
        "Chemistry of Transition Elements",
        # Organic Chemistry
        "Benzene and Aromatic Compounds",
        "Phenols",
        "Carbonyl Compounds (Advanced)",
        "Carboxylic Acids and Derivatives (Advanced)",
        "Nitrogen Compounds (Advanced)",
        "Polymerisation (Advanced)",
        "Organic Synthesis (Advanced)",
        "Analytical Techniques (Advanced)"
    ]
}

# All A Level Chemistry topics flat list
A_LEVEL_CHEMISTRY_ALL_TOPICS = A_LEVEL_CHEMISTRY_TOPICS["Lower Sixth"] + A_LEVEL_CHEMISTRY_TOPICS["Upper Sixth"]

# A Level Pure Mathematics Topics (ZIMSEC Syllabus 6042)
A_LEVEL_PURE_MATH_TOPICS = {
    "Lower Sixth": [
        "Polynomials",
        "Rational Functions",
        "Indices, Surds and Logarithms",
        "Quadratic Functions",
        "Functions",
        "Coordinate Geometry",
        "Sequences and Series",
        "Binomial Theorem",
        "Trigonometry (Identities & Equations)",
        "Differentiation",
        "Applications of Differentiation",
        "Integration"
    ],
    "Upper Sixth": [
        "Further Trigonometry",
        "Hyperbolic Functions",
        "Further Differentiation",
        "Further Integration Techniques",
        "Differential Equations",
        "Complex Numbers",
        "Matrices and Determinants",
        "Vectors in 3D",
        "Summation of Series",
        "Numerical Methods",
        "Proof and Mathematical Induction",
        "Group Theory"
    ]
}

# All A Level Pure Mathematics topics flat list
A_LEVEL_PURE_MATH_ALL_TOPICS = A_LEVEL_PURE_MATH_TOPICS["Lower Sixth"] + A_LEVEL_PURE_MATH_TOPICS["Upper Sixth"]

# A Level Biology Topics (ZIMSEC A Level Syllabus 6030)
A_LEVEL_BIOLOGY_TOPICS = {
    "Lower Sixth": [
        "Cell Structure",
        "Biological Molecules",
        "Enzymes",
        "Cell Membranes and Transport",
        "The Cell Cycle and Mitosis",
        "Nucleic Acids and Protein Synthesis",
        "Transport in Plants",
        "Transport in Mammals",
        "Gas Exchange",
        "Infectious Diseases",
        "Immunity",
        "Smoking and Health"
    ],
    "Upper Sixth": [
        "Energy and Respiration",
        "Photosynthesis",
        "Homeostasis",
        "Excretion",
        "Coordination: Nervous System",
        "Coordination: Hormones",
        "Inherited Change",
        "Selection and Evolution",
        "Biodiversity and Classification",
        "Genetic Technology",
        "Ecology",
        "Human Impact on Environment",
        "Reproduction"
    ]
}

# All A Level Biology topics flat list
A_LEVEL_BIOLOGY_ALL_TOPICS = A_LEVEL_BIOLOGY_TOPICS["Lower Sixth"] + A_LEVEL_BIOLOGY_TOPICS["Upper Sixth"]

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