"""
Cambridge O-Level Computer Science 2210 — theory structure for NerdX.
Paper 1 (Computer Systems, topics 1–6), Paper 2 (Algorithms, Programming and Logic, topics 7–10).
Source: Cambridge O Level Computer Science 2210 syllabus 2026–2028.
"""

CAMBRIDGE_CS_CODE = "2210"
PAPER_1_FOCUS = "Computer Systems: short-answer and structured (Topics 1–6), AO1 60% / AO2 20% / AO3 20%"
PAPER_2_FOCUS = "Algorithms, Programming and Logic: structured + scenario (Topics 7–10), AO1 20% / AO2 60% / AO3 20%"

# Cambridge 2210 content overview (exact syllabus names)
CAMBRIDGE_CS_TOPICS = [
    "Data representation",
    "Data transmission",
    "Hardware",
    "Software",
    "The internet and its uses",
    "Automated and emerging technologies",
    "Algorithm design and problem-solving",
    "Programming",
    "Databases",
    "Boolean logic",
]

# Command words used in Cambridge assessments (for prompting)
CAMBRIDGE_COMMAND_WORDS = (
    "Calculate, Compare, Define, Demonstrate, Describe, Evaluate, Explain, Give, "
    "Identify, Outline, Show (that), State, Suggest."
)

# Per-topic learning objectives (syllabus-aligned, condensed from 2210)
CAMBRIDGE_CS_TOPIC_OBJECTIVES = {
    "Data representation": {
        "subtopics": [
            "Number systems: denary, binary, hexadecimal; conversions; overflow; logical shifts; two's complement",
            "Text, sound and images: ASCII, Unicode; sample rate, sample resolution; resolution, colour depth",
            "Data storage and compression: bit, byte, KiB, MiB, GiB, TiB; file size calculations; lossy and lossless compression",
        ],
        "learning_objectives": [
            "Understand how and why computers use binary; convert between denary, binary, hexadecimal.",
            "Understand character sets (ASCII, Unicode), sound representation (sample rate, resolution), image representation (resolution, colour depth).",
            "Measure data storage; calculate file sizes; understand purpose of compression and lossy vs lossless methods.",
        ],
    },
    "Data transmission": {
        "subtopics": [
            "Packets: structure (header, payload, trailer); packet switching",
            "Methods: serial, parallel; simplex, half-duplex, full-duplex; USB",
            "Error detection: parity, checksum, echo check; check digit (ISBN, barcodes); ARQ",
            "Encryption: need and purpose; symmetric and asymmetric encryption",
        ],
        "learning_objectives": [
            "Describe packet structure and packet switching.",
            "Describe and compare transmission methods; explain USB.",
            "Describe error detection (parity, checksum, echo, check digit) and ARQ.",
            "Understand need for encryption; symmetric and asymmetric encryption.",
        ],
    },
    "Hardware": {
        "subtopics": [
            "CPU and microprocessor; Von Neumann architecture: ALU, CU, registers (PC, MAR, MDR, CIR, ACC), buses; fetch–decode–execute cycle",
            "Cores, cache, clock; instruction set; embedded systems",
            "Input and output devices; sensors (acoustic, accelerometer, temperature, etc.) and actuators",
            "Primary and secondary storage; magnetic, optical, solid-state; virtual memory; cloud storage",
            "NIC, MAC address, IP address (IPv4, IPv6); role of router",
        ],
        "learning_objectives": [
            "Describe the role of the CPU and the FDE cycle; explain cores, cache, clock.",
            "Understand input/output devices and sensors for given contexts.",
            "Describe primary/secondary storage, virtual memory, cloud storage.",
            "Understand NIC, MAC, IP addresses and the role of the router.",
        ],
    },
    "Software": {
        "subtopics": [
            "System vs application software; role and functions of the operating system",
            "Hardware, firmware, OS required to run applications; interrupts (hardware and software)",
            "High-level vs low-level languages; assembly language and assembler; compiler and interpreter; IDEs",
        ],
        "learning_objectives": [
            "Describe difference between system and application software; describe OS role and functions.",
            "Describe role and operation of interrupts.",
            "Explain compiler and interpreter; advantages and disadvantages; role of IDE.",
        ],
    },
    "The internet and its uses": {
        "subtopics": [
            "Internet vs World Wide Web; URL; HTTP/HTTPS; web browser purpose and functions",
            "How web pages are located, retrieved and displayed; DNS, web server, HTML",
            "Cookies: session and persistent",
            "Digital currency and blockchain",
            "Cyber security: threats (brute-force, DDoS, hacking, malware, phishing, etc.); solutions (access levels, anti-malware, authentication, firewalls, proxy, SSL, etc.)",
        ],
        "learning_objectives": [
            "Understand internet vs WWW, URL, HTTP/HTTPS, browser functions.",
            "Describe how a URL leads to a displayed page; explain cookies.",
            "Understand digital currency and blockchain.",
            "Describe cyber security threats and how solutions keep data safe.",
        ],
    },
    "Automated and emerging technologies": {
        "subtopics": [
            "Automated systems: sensors, microprocessors, actuators; advantages and disadvantages in given scenarios",
            "Robotics: characteristics and roles of robots",
            "Artificial intelligence: characteristics; expert systems and machine learning",
        ],
        "learning_objectives": [
            "Describe how sensors, microprocessors and actuators create automated systems.",
            "Understand robotics and characteristics of robots.",
            "Understand AI; describe characteristics and operation of AI systems (expert systems, machine learning).",
        ],
    },
    "Algorithm design and problem-solving": {
        "subtopics": [
            "Program development life cycle: analysis, design, coding, testing",
            "Sub-systems; decomposition; design methods (structure diagrams, flowcharts, pseudocode)",
            "Purpose of a given algorithm",
            "Standard methods: linear search, bubble sort, totalling, counting, max/min/average",
            "Validation and verification types; test data (normal, abnormal, extreme, boundary); trace tables; identifying and correcting errors",
        ],
        "learning_objectives": [
            "Understand and perform analysis, design, coding, testing.",
            "Decompose problems; use structure diagrams, flowcharts, pseudocode.",
            "Explain purpose of an algorithm; suggest and apply test data; complete trace tables; identify and correct errors.",
        ],
    },
    "Programming": {
        "subtopics": [
            "Variables, constants; data types (integer, real, char, string, Boolean)",
            "Input and output; sequence; selection (IF, CASE); iteration (count-controlled, pre-condition, post-condition); totalling and counting; string handling",
            "Arithmetic, relational, logical operators; nested statements",
            "Procedures and functions; parameters; local and global variables; library routines (MOD, DIV, ROUND, RANDOM)",
            "Maintainable programs: meaningful identifiers, comments",
            "Arrays (1D, 2D); file handling (open, read, write, close)",
        ],
        "learning_objectives": [
            "Declare and use variables and constants; use data types, input/output, sequence, selection, iteration.",
            "Use nested statements; define and use procedures and functions; use library routines.",
            "Create maintainable code; use arrays and file handling.",
        ],
    },
    "Databases": {
        "subtopics": [
            "Single-table database: fields, records, validation; data types (text, integer, real, Boolean, date/time)",
            "Primary key; SQL: SELECT, FROM, WHERE, ORDER BY, SUM, COUNT, AND, OR",
        ],
        "learning_objectives": [
            "Define a single-table database from requirements; suggest data types; identify primary key.",
            "Read, understand and complete SQL scripts to query data.",
        ],
    },
    "Boolean logic": {
        "subtopics": [
            "Logic gates: NOT, AND, OR, NAND, NOR, XOR; standard symbols; truth tables",
            "Creating logic circuits from problem statement, expression or truth table; max 3 inputs, 1 output",
        ],
        "learning_objectives": [
            "Identify and use standard logic gate symbols; define and understand gate functions.",
            "Create logic circuits and complete truth tables from given problem, expression or circuit.",
        ],
    },
}


def get_topic_objectives_cambridge(topic_name: str) -> dict:
    """Return subtopics and learning_objectives for a Cambridge topic. Normalizes to syllabus keys."""
    if not topic_name or not CAMBRIDGE_CS_TOPIC_OBJECTIVES:
        return {"subtopics": [], "learning_objectives": []}
    t = (topic_name or "").strip()
    if t in CAMBRIDGE_CS_TOPIC_OBJECTIVES:
        return CAMBRIDGE_CS_TOPIC_OBJECTIVES[t]
    key = t.lower()
    for k in CAMBRIDGE_CS_TOPIC_OBJECTIVES:
        if key == k.lower() or key in k.lower() or k.lower() in key:
            return CAMBRIDGE_CS_TOPIC_OBJECTIVES[k]
    return {"subtopics": [], "learning_objectives": []}


def get_paper1_prompt_guidance_cambridge() -> str:
    """Cambridge Paper 1 (Computer Systems): short-answer and structured; AO1/AO2/AO3."""
    return (
        "Cambridge 2210 Paper 1 (Computer Systems) style: short-answer and structured questions "
        "on Topics 1–6. Use command words: Calculate, Compare, Define, Demonstrate, Describe, "
        "Evaluate, Explain, Give, Identify, Outline, Show (that), State, Suggest. "
        "Align to syllabus learning objectives; assess knowledge (AO1), application (AO2), evaluation (AO3)."
    )


def get_paper2_prompt_guidance_cambridge() -> str:
    """Cambridge Paper 2 (Algorithms, Programming and Logic): structured and scenario; AO1/AO2/AO3."""
    return (
        "Cambridge 2210 Paper 2 (Algorithms, Programming and Logic) style: structured questions "
        "on Topics 7–10. Use pseudocode/Cambridge conventions where relevant. "
        "Use command words: Calculate, Compare, Define, Demonstrate, Describe, Evaluate, Explain, "
        "Give, Identify, Outline, Show (that), State, Suggest. "
        "Align to syllabus learning objectives; logic more important than syntax."
    )


def get_essay_prompt_guidance_cambridge() -> str:
    """Cambridge standard for extended written responses."""
    return (
        "Cambridge 2210 standard: extended responses should Demonstrate, Describe, Evaluate or Explain "
        "as appropriate. Use command words precisely; support with reasons and evidence where required."
    )
