"""
Cambridge International AS & A Level Computer Science 9618 — syllabus structure for NerdX.
Sections 1–12: AS Level (Papers 1 & 2). Sections 13–20: A Level (Papers 3 & 4).
Valid for 2026 examinations and beyond.
Source: Cambridge International AS & A Level Computer Science 9618 syllabus.
"""

CAMBRIDGE_A_LEVEL_CS_CODE = "9618"

# AS Level: Sections 1–8 (Paper 1 Theory), 9–12 (Paper 2 Problem-solving & Programming)
# A Level: Sections 13–20 (Paper 3 Advanced Theory, Paper 4 Practical)
# Flat topic list for API — section-based names aligned to syllabus
CAMBRIDGE_A_LEVEL_CS_TOPICS_AS = [
    # Section 1: Information Representation
    "1.1 Data representation – binary magnitudes and prefixes",
    "1.1 Data representation – number systems",
    "1.1 Data representation – binary arithmetic",
    "1.1 Data representation – practical applications (BCD, hex)",
    "1.1 Data representation – character data",
    "1.2 Multimedia – graphics bitmapped images",
    "1.2 Multimedia – vector graphics",
    "1.2 Multimedia – sound",
    "1.3 Compression – lossy and lossless",
    "1.3 Compression – techniques (e.g. RLE)",
    # Section 2: Communication
    "2.1 Networks – devices, types (LAN/WAN), models (client-server, P2P)",
    "2.1 Networks – topologies, cloud computing",
    "2.1 Networks – transmission media, LAN hardware",
    "2.1 Networks – router, Ethernet and CSMA/CD",
    "2.1 Networks – bit streaming, WWW vs internet",
    "2.1 Networks – internet hardware, IP addressing",
    "2.1 Networks – URLs and DNS",
    # Section 3: Hardware
    "3.1 Computers and components – basic components, embedded systems",
    "3.1 Hardware devices – operation (printer, 3D printer, storage, etc.)",
    "3.1 Buffers, memory types (RAM/ROM, SRAM/DRAM, ROM types)",
    "3.1 Monitoring and control systems",
    "3.2 Logic gates and logic circuits",
    # Section 4: Processor fundamentals
    "4.1 CPU architecture – Von Neumann, registers, buses",
    "4.1 CPU – fetch-execute cycle, interrupts",
    "4.2 Assembly language – machine code, two-pass assembler, tracing",
    "4.2 Instruction groups, addressing modes",
    "4.3 Bit manipulation – binary shifts, device control",
    # Sections 5–8 (AS Theory continued)
    "5. System software",
    "6. Security, privacy and data integrity",
    "7. Ethics and ownership",
    "8. Databases",
    # Sections 9–12 (AS Problem-solving & Programming)
    "9. Algorithm design and problem-solving",
    "10. Data types and structures",
    "11. Programming and program design",
    "12. Software development",
]

CAMBRIDGE_A_LEVEL_CS_TOPICS_A2 = [
    # Sections 13–20 (A Level)
    "13. Data representation (advanced)",
    "14. Communication and internet technologies (advanced)",
    "15. Hardware and virtual machines",
    "16. System software (advanced)",
    "17. Security (advanced)",
    "18. Artificial intelligence",
    "19. Computational thinking and problem-solving",
    "20. Further programming",
]

CAMBRIDGE_A_LEVEL_CS_ALL_TOPICS = CAMBRIDGE_A_LEVEL_CS_TOPICS_AS + CAMBRIDGE_A_LEVEL_CS_TOPICS_A2

# Paper mapping for UI
CAMBRIDGE_A_LEVEL_CS_PAPERS = {
    "Paper 1": "Theory Fundamentals (Sections 1–8)",
    "Paper 2": "Problem-solving & Programming (Sections 9–12)",
    "Paper 3": "Advanced Theory (Sections 13–20)",
    "Paper 4": "Practical (Sections 19–20)",
}

# Learning objectives / subtopics for key sections (for AI question generation)
CAMBRIDGE_A_LEVEL_CS_TOPIC_OBJECTIVES = {
    "1.1 Data representation – number systems": {
        "subtopics": [
            "Binary, denary, hexadecimal, BCD; one's and two's complement",
            "Convert integer values between bases; two's complement for signed integers",
        ],
        "learning_objectives": [
            "Show understanding of binary, denary, hexadecimal, BCD.",
            "Understand one's and two's complement; convert between number bases.",
        ],
    },
    "1.2 Multimedia – graphics bitmapped images": {
        "subtopics": [
            "Pixel, file header, resolution, colour depth",
            "File size calculation: width × height × colour depth",
        ],
        "learning_objectives": [
            "Describe how bitmapped image data is encoded; use correct terminology.",
            "Perform calculations to estimate file size; explain effects of changing resolution/depth.",
        ],
    },
    "1.2 Multimedia – sound": {
        "subtopics": [
            "Sampling, sampling rate, sampling resolution (bit depth)",
            "Analogue vs digital data; file size formula",
        ],
        "learning_objectives": [
            "Describe how sound is represented and encoded.",
            "Understand impact of sampling rate and resolution on file size and accuracy.",
        ],
    },
    "1.3 Compression – lossy and lossless": {
        "subtopics": [
            "Lossy: JPEG, MP3, MPEG; lossless: PNG, FLAC, ZIP",
            "Justify use of method in given situation",
        ],
        "learning_objectives": [
            "Show understanding of lossy and lossless compression.",
            "Justify use of compression method in given situation.",
        ],
    },
    "2.1 Networks – topologies, cloud computing": {
        "subtopics": [
            "Bus, star, mesh, hybrid topologies; packet transmission",
            "Cloud computing: public vs private; benefits and drawbacks",
        ],
        "learning_objectives": [
            "Describe topologies and justify use for given situation.",
            "Show understanding of cloud computing and implications.",
        ],
    },
    "2.1 Networks – IP addressing": {
        "subtopics": [
            "IPv4 and IPv6 format; subnetting",
            "Static vs dynamic; public vs private; NAT",
        ],
        "learning_objectives": [
            "Explain use of IP addresses in data transmission.",
            "Understand subnetting, static/dynamic, public/private addressing.",
        ],
    },
    "3.2 Logic gates and logic circuits": {
        "subtopics": [
            "NOT, AND, OR, NAND, NOR, XOR – symbols and functions",
            "Truth tables; construct circuit from problem/expression/truth table",
        ],
        "learning_objectives": [
            "Use logic gate symbols and define functions; construct truth tables.",
            "Construct logic circuit from problem statement, expression, or truth table.",
        ],
    },
    "4.1 CPU architecture – Von Neumann, registers, buses": {
        "subtopics": [
            "Von Neumann model; stored program concept",
            "Registers: PC, MAR, MDR, CIR, ACC, IX, SR; ALU, CU, clock, IAS",
            "Address bus, data bus, control bus",
        ],
        "learning_objectives": [
            "Describe Von Neumann model and stored program concept.",
            "Explain purpose of registers and buses; describe fetch-execute cycle.",
        ],
    },
    "4.1 CPU – fetch-execute cycle, interrupts": {
        "subtopics": [
            "Fetch: MAR←PC, PC←PC+1, MDR←Memory[MAR], CIR←MDR",
            "Decode and execute; register transfer notation",
            "Interrupts: purpose, causes, handling, ISR, priority",
        ],
        "learning_objectives": [
            "Describe stages of fetch-execute cycle; use register transfer notation.",
            "Show understanding of purpose and handling of interrupts.",
        ],
    },
    "4.2 Assembly language – machine code, two-pass assembler, tracing": {
        "subtopics": [
            "Relationship between assembly and machine code",
            "Two-pass assembler: symbol table then code generation",
            "Trace simple assembly program; instruction groups; addressing modes",
        ],
        "learning_objectives": [
            "Describe two-pass assembly process; trace program; use addressing modes.",
        ],
    },
    "4.3 Bit manipulation – binary shifts, device control": {
        "subtopics": [
            "Logical/arithmetic left/right shifts; cyclic/rotate",
            "Bit manipulation for device control: test, set, clear, toggle",
        ],
        "learning_objectives": [
            "Perform binary shifts; carry out bit manipulation for device control.",
        ],
    },
    "8. Databases": {
        "subtopics": [
            "Single-table and relational; primary/foreign key",
            "SQL: SELECT, FROM, WHERE, ORDER BY, JOIN; normalisation",
        ],
        "learning_objectives": [
            "Understand database concepts; write and interpret SQL queries.",
        ],
    },
    "9. Algorithm design and problem-solving": {
        "subtopics": [
            "Decomposition; structure diagrams, flowcharts, pseudocode",
            "Standard algorithms: search, sort; trace tables; validation and verification",
        ],
        "learning_objectives": [
            "Design algorithms using appropriate notation; trace and test algorithms.",
        ],
    },
    "10. Data types and structures": {
        "subtopics": [
            "Arrays (1D, 2D); records; files",
            "Stacks, queues; linked lists; trees; hash tables",
        ],
        "learning_objectives": [
            "Use data types and structures; implement and trace operations.",
        ],
    },
    "11. Programming and program design": {
        "subtopics": [
            "Variables, constants, data types; sequence, selection, iteration",
            "Procedures and functions; parameters; file handling",
            "OOP: classes, objects, encapsulation, inheritance, polymorphism",
        ],
        "learning_objectives": [
            "Design and write programs in pseudocode or high-level language.",
            "Use procedures, functions, and OOP concepts appropriately.",
        ],
    },
    "12. Software development": {
        "subtopics": [
            "Development lifecycle: analysis, design, coding, testing, maintenance",
            "Testing: normal, abnormal, boundary; debugging",
        ],
        "learning_objectives": [
            "Describe stages of software development; design test plans.",
        ],
    },
    "13. Data representation (advanced)": {
        "subtopics": [
            "Floating-point representation; normalisation; precision and rounding",
            "Compression algorithms; encryption representation",
        ],
        "learning_objectives": [
            "Understand floating-point and advanced data representation.",
        ],
    },
    "18. Artificial intelligence": {
        "subtopics": [
            "Characteristics of AI; expert systems; machine learning",
            "Applications and limitations",
        ],
        "learning_objectives": [
            "Describe AI concepts; explain expert systems and machine learning.",
        ],
    },
    "19. Computational thinking and problem-solving": {
        "subtopics": [
            "Abstraction; decomposition; algorithmic thinking",
            "Complexity; recursion; backtracking",
        ],
        "learning_objectives": [
            "Apply computational thinking to problem-solving.",
        ],
    },
    "20. Further programming": {
        "subtopics": [
            "Advanced OOP; exception handling; file handling",
            "GUI; libraries and APIs; design patterns",
        ],
        "learning_objectives": [
            "Design and implement programs using advanced techniques.",
        ],
    },
}


def get_topic_objectives_cambridge_a_level(topic_name: str) -> dict:
    """Return subtopics and learning_objectives for a Cambridge A-Level 9618 topic."""
    if not topic_name or not CAMBRIDGE_A_LEVEL_CS_TOPIC_OBJECTIVES:
        return {"subtopics": [], "learning_objectives": []}
    t = (topic_name or "").strip()
    if t in CAMBRIDGE_A_LEVEL_CS_TOPIC_OBJECTIVES:
        return CAMBRIDGE_A_LEVEL_CS_TOPIC_OBJECTIVES[t]
    key = t.lower()
    for k in CAMBRIDGE_A_LEVEL_CS_TOPIC_OBJECTIVES:
        if key == k.lower() or key in k.lower() or k.lower() in key:
            return CAMBRIDGE_A_LEVEL_CS_TOPIC_OBJECTIVES[k]
    return {"subtopics": [], "learning_objectives": []}


def get_paper1_prompt_guidance_cambridge_a_level() -> str:
    """Cambridge 9618 Paper 1 (Theory Fundamentals): AO1 60%, AO2 40%."""
    return (
        "Cambridge 9618 AS & A Level Computer Science Paper 1 (Theory Fundamentals) style: "
        "Sections 1–8. All questions compulsory. Use command words: Calculate, Compare, Define, "
        "Describe, Evaluate, Explain, Show (that), State. Assess knowledge and understanding (AO1) "
        "and application (AO2). Align to syllabus learning objectives for the given section."
    )


def get_paper2_prompt_guidance_cambridge_a_level() -> str:
    """Cambridge 9618 Paper 2 (Problem-solving & Programming): pseudocode."""
    return (
        "Cambridge 9618 Paper 2 (Problem-solving & Programming) style: Sections 9–12. "
        "Written answers in pseudocode where required. Use command words and assessment objectives. "
        "Focus on algorithm design, data structures, programming concepts and software development."
    )


def get_paper3_prompt_guidance_cambridge_a_level() -> str:
    """Cambridge 9618 Paper 3 (Advanced Theory): Sections 13–20."""
    return (
        "Cambridge 9618 Paper 3 (Advanced Theory) style: Sections 13–20. "
        "All questions compulsory. Assess AO1 and AO2. Align to advanced syllabus sections."
    )


def get_essay_prompt_guidance_cambridge_a_level() -> str:
    """Cambridge 9618 extended response standard."""
    return (
        "Cambridge 9618 AS & A Level standard: extended responses should Demonstrate, Describe, "
        "Evaluate or Explain using precise command words. Support with reasons and evidence."
    )
