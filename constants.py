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
    # ZIMSEC O-Level Geography — All Level (Forms 1–4), flat topic list (no Form groupings in UI)
    "Geography": [
        # Physical environment and skills
        "Weather and Climate",
        "Landforms and Landscape Processes",
        "Ecosystems",
        "Natural Resources",
        "Energy and Power Development",
        "Map Work and Geographical Information Systems (GIS)",
        # Economic and human geography
        "Minerals and Mining",
        "Environmental Management",
        "Agriculture and Land Reform",
        "Industry",
        "Settlement and Population",
        "Transport and Trade"
    ],
    # ZIMSEC O-Level Principles of Commerce — 11 topics
    "Commerce": [
        "Production",
        "Trade",
        "Consumer Protection",
        "Business Organisations",
        "Enterprise",
        "Finance and Banking",
        "Insurance and Assurance",
        "Business Communication",
        "Transport",
        "Warehousing",
        "Marketing",
    ],
    # ZIMSEC O-Level Principles of Accounting 7112 — 15 topics (Paper 1 MCQs, Paper 2 Structured)
    "Principles of Accounting": [
        "Introduction to Principles of Accounting",
        "Types of Business Organizations",
        "Source Documents and Books of Prime Entry",
        "Ledger and Double Entry",
        "Trial Balance",
        "Correction of Errors",
        "Financial Statements (Sole Trader)",
        "Adjustments (Accruals, Prepayments, Depreciation)",
        "Incomplete Records",
        "Partnership Accounts",
        "Company Accounts",
        "Cash Flow",
        "Interpretation of Financial Statements",
        "Not-for-Profit Organizations",
        "Manufacturing Accounts",
    ],
    # ZIMSEC O-Level Computer Science 7014 — 11 topics (theory; practical in Virtual Labs)
    "Computer Science": [
        "Hardware and Software",
        "Application of Computer Science",
        "Data Representation",
        "Communication Networks and Internet Technologies",
        "Security and Ethics",
        "Systems Analysis and Design",
        "Algorithm Design and Problem-Solving",
        "Programming",
        "Databases",
        "Web Design and Internet Uses",
        "Automated and Emerging Technologies",
    ],
    # ZIMSEC O-Level Business Enterprise and Skills 4048 — 8 topics (Paper 1 MCQs, Paper 2 Essays)
    "Business Enterprise and Skills": [
        "The Business Enterprise",
        "The Enterprising Environment",
        "Setting Up a New Enterprise",
        "Business Planning",
        "Enterprise Finance and Securing Investors",
        "People in Business Enterprises",
        "Markets and Marketing",
        "Operations Management",
    ],
    # ZIMSEC O-Level History — flat list (no Form 1/Form 2 division)
    "History": [
        "Conceptualisation of History",
        "Origins of Humankind",
        "Ancient Civilisations Egypt",
        "Development of Zimbabwean Societies",
        "Slavery and the Slave Trade",
        "Early European Contacts",
        "Colonisation",
        "Colonial Administration",
        "Nationalism",
        "Armed Struggle",
        "Post-Independence",
        "Regional Cooperation",
        "Sources of History",
        "Zimbabwean Societies",
        "European Contacts",
        "World Wars",
        "International Cooperation",
        "Socialism and Communism",
        "Constitution Democracy and Human Rights",
    ],
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

# A Level Geography Topics (ZIMSEC A Level Syllabus 9156)
A_LEVEL_GEOGRAPHY_TOPICS = {
    "Paper 1": [
        "Climatology",
        "Hydrology & Fluvial Geomorphology",
        "Geomorphology",
        "Biogeography",
    ],
    "Paper 2": [
        "Population Geography",
        "Settlement Geography",
        "Agriculture & Food Production",
        "Industry, Mining & Energy",
        "Environmental Management",
    ],
}

# All A Level Geography topics flat list
A_LEVEL_GEOGRAPHY_ALL_TOPICS = A_LEVEL_GEOGRAPHY_TOPICS["Paper 1"] + A_LEVEL_GEOGRAPHY_TOPICS["Paper 2"]

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

# A Level Computer Science Topics (ZIMSEC A Level Syllabus 6023 - Forms 5-6)
# Valid Period: 2024-2030
A_LEVEL_COMPUTER_SCIENCE_TOPICS = {
    "Form 5": [
        # Topic 1: Data Representation (Form 5)
        "Data Representation - Number Systems",
        "Data Representation - Binary Arithmetic",
        "Data Representation - Character Encoding",
        "Data Representation - Image Representation",
        "Data Representation - Sound Representation",
        # Topic 2: Computer Architecture (Form 5)
        "Computer Architecture - CPU Structure",
        "Computer Architecture - Fetch-Decode-Execute Cycle",
        "Computer Architecture - Memory Hierarchy",
        "Computer Architecture - I/O Devices",
        # Topic 3: Networking (Form 5)
        "Networking - Network Topologies",
        "Networking - OSI Model",
        "Networking - Network Protocols",
        "Networking - Network Hardware",
        # Topic 4: Systems Development Life Cycle (Form 5)
        "SDLC - Analysis and Fact-Finding",
        "SDLC - Feasibility Studies",
        "SDLC - System Design",
        "SDLC - Data Flow Diagrams",
        # Topic 5: Security and Ethics (Form 5)
        "Security and Ethics - Threats and Countermeasures",
        "Security and Ethics - Ethical Issues",
        "Security and Ethics - Data Protection",
        # Topic 6: Algorithm Design and Data Structures (Form 5)
        "Algorithms - Algorithm Design",
        "Algorithms - Basic Data Structures",
        "Algorithms - Searching Algorithms",
        "Algorithms - Sorting Algorithms",
        # Topic 7: Programming (Form 5)
        "Programming - Programming Fundamentals",
        "Programming - Control Structures",
        "Programming - Functions and Procedures",
        "Programming - File Handling",
        "Programming - Basic OOP",
        # Topic 8: Databases (Form 5)
        "Databases - Database Concepts",
        "Databases - ERD Design",
        "Databases - Normalization",
        "Databases - SQL Queries",
        # Topic 9: Enterprising (Form 5)
        "Enterprising - Entrepreneurship in ICT",
        "Enterprising - Business Planning",
        "Enterprising - Market Research"
    ],
    "Form 6": [
        # Topic 1: Data Representation (Form 6)
        "Data Representation - Floating-Point Precision",
        "Data Representation - Data Compression",
        "Data Representation - Encryption Representation",
        # Topic 2: Computer Architecture (Form 6)
        "Computer Architecture - Pipelining",
        "Computer Architecture - Parallel Processing",
        "Computer Architecture - RISC vs CISC",
        "Computer Architecture - Performance Optimization",
        # Topic 3: Networking (Form 6)
        "Networking - Network Security",
        "Networking - Encryption Protocols",
        "Networking - Network Design",
        "Networking - Cloud Computing",
        # Topic 4: Systems Development Life Cycle (Form 6)
        "SDLC - SDLC Methodologies",
        "SDLC - Project Management",
        "SDLC - Testing Strategies",
        "SDLC - System Maintenance",
        # Topic 5: Security and Ethics (Form 6)
        "Security and Ethics - Cryptography",
        "Security and Ethics - Legal Frameworks",
        "Security and Ethics - Professional Ethics",
        # Topic 6: Algorithm Design and Data Structures (Form 6)
        "Algorithms - Advanced Data Structures",
        "Algorithms - Tree Algorithms",
        "Algorithms - Graph Algorithms",
        "Algorithms - Algorithm Complexity",
        # Topic 7: Programming (Form 6)
        "Programming - Advanced OOP",
        "Programming - Inheritance and Polymorphism",
        "Programming - Exception Handling",
        "Programming - GUI Development",
        # Topic 8: Databases (Form 6)
        "Databases - Complex SQL Queries",
        "Databases - Transactions and ACID",
        "Databases - Database Optimization",
        "Databases - Database Security",
        # Topic 9: Enterprising (Form 6)
        "Enterprising - Scaling Technology Businesses",
        "Enterprising - Technology Commercialization",
        "Enterprising - Social Impact of ICT"
    ]
}

# All A Level Computer Science topics flat list
A_LEVEL_COMPUTER_SCIENCE_ALL_TOPICS = A_LEVEL_COMPUTER_SCIENCE_TOPICS["Form 5"] + A_LEVEL_COMPUTER_SCIENCE_TOPICS["Form 6"]

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