"""
ZIMSEC O-Level Computer Science Syllabus 7014 — theory-only structure for NerdX.
Forms 1–4, Paper 1 (MCQ knowledge) and Paper 2 (structured). Practical (Paper 3) in Virtual Labs later.
Source: ZIMSEC O Level Computer Science Syllabus 7014, 2015–2022.
"""

# Syllabus code and assessment focus
ZIMSEC_CS_CODE = "7014"
PAPER_1_FOCUS = "Breadth of knowledge across all topics (MCQ, 10%)"
PAPER_2_FOCUS = "Deep analytical understanding, problem-solving (Structured, 30%)"

# Ordered list of 11 ZIMSEC topics (exact syllabus naming)
ZIMSEC_CS_TOPICS = [
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
]

# Per-topic learning objectives and subtopics (syllabus-aligned, theory only)
# Used to build prompts so questions target what the student is expected to learn.
ZIMSEC_CS_TOPIC_OBJECTIVES = {
    "Hardware and Software": {
        "subtopics": [
            "Input devices (keyboard, mouse, scanner, microphone, webcam, touchscreen, barcode reader, OCR, MICR)",
            "Output devices (monitor, printer, speakers, projector, plotter)",
            "Storage devices (HDD, SSD, USB, CD/DVD, cloud storage)",
            "Processing devices (CPU, motherboard, RAM, ROM, GPU)",
            "System vs application software; operating systems; utility programs; device drivers",
            "Off-the-shelf, bespoke, open-source, freeware, shareware",
            "Specialized hardware (POS, ATM, data capturing systems)",
            "PC, mobile and server operating systems; OS functions (memory, file, process, security)",
            "Hardware and software maintenance; troubleshooting; preventive maintenance",
        ],
        "learning_objectives": [
            "Explain operational principles of each hardware device category and classify software types.",
            "Identify and compare operating systems (Windows, Linux, macOS, Android, iOS) and their functions.",
            "Describe common hardware/software errors and apply troubleshooting and preventive maintenance.",
        ],
    },
    "Application of Computer Science": {
        "subtopics": [
            "Agriculture (farm management, precision agriculture, GIS, IoT, drones)",
            "Banking (ATM, online/mobile banking, EFT, EcoCash/OneMoney context)",
            "Education (e-learning, LMS, Moodle, Google Classroom, virtual classrooms)",
            "Transport (GPS, traffic control, fleet management, booking systems)",
            "Health (EMR, telemedicine, diagnostic systems, pharmacy systems)",
            "Environmental management; wildlife tracking; mining and industrial applications",
            "Robotics; CAM; CNC; 3D printing; intelligent systems and AI applications",
            "Smart farming; ambient systems (smart homes); GIS and spatial data",
        ],
        "learning_objectives": [
            "Describe practical computer applications in key sectors and identify Zimbabwe-specific examples.",
            "Explain benefits and challenges of computerization; compare sector applications.",
            "Understand CAM, intelligent systems and GIS in context of local industry and agriculture.",
        ],
    },
    "Data Representation": {
        "subtopics": [
            "Binary number system; place values; denary–binary and binary–denary conversion",
            "Binary addition and subtraction; two's complement; overflow",
            "Storage units (bit, byte, nibble, KB, MB, GB, TB, PB); conversions",
            "ASCII (7-bit/8-bit); character encoding; text to binary",
            "Octal and hexadecimal; conversions between binary, denary, octal, hex",
            "Logic gates (AND, OR, NOT, NAND, NOR, XOR, XNOR); truth tables; Boolean expressions",
            "Logic circuit design; half adder; full adder; circuit analysis",
        ],
        "learning_objectives": [
            "Convert between denary, binary, octal and hexadecimal; perform binary arithmetic.",
            "Use ASCII and storage units; calculate file sizes and requirements.",
            "Draw logic gate symbols, construct truth tables and analyse simple logic circuits.",
        ],
    },
    "Communication Networks and Internet Technologies": {
        "subtopics": [
            "Network concepts (nodes, links, protocols); LAN, WAN, PAN, MAN",
            "Topologies (star, bus, ring, mesh); advantages and disadvantages",
            "Internet services (email, e-commerce, e-learning, social media, cloud storage)",
            "Data transmission modes (simplex, half-duplex, full-duplex)",
            "Transmission media (twisted pair, coaxial, fiber, wireless); ISP services",
            "Mobile technologies; WiFi, Bluetooth, WiMAX; cloud computing (IaaS, PaaS, SaaS)",
            "TCP/IP and OSI models; HTTP/HTTPS, FTP, SMTP, POP3, IMAP, DNS",
            "Network devices (hub, switch, router, bridge, modem, gateway, access point)",
        ],
        "learning_objectives": [
            "Describe network types, topologies and transmission modes with examples.",
            "Compare transmission media and explain wireless/cloud technologies and roles of ISPs.",
            "Explain TCP/IP and OSI layers; describe protocol and device functions; design simple network diagrams.",
        ],
    },
    "Security and Ethics": {
        "subtopics": [
            "Cyber wellness; digital citizenship; Unhu/Ubuntu; safe vs unsafe sites; HTTPS",
            "Copyright (Zimbabwe Copyright Act Ch 26:1); plagiarism; piracy; consequences",
            "Computer crime (hacking, phishing, malware, identity theft, fraud); Cyber and Data Protection Act",
            "Data protection (passwords, MFA, file permissions, encryption, authentication)",
            "Verification vs validation; validation types (range, type, format, presence, length, lookup, check digit)",
            "Firewalls; proxy servers; digital signatures and certificates; ACLs",
            "Backup types (full, incremental, differential); 3-2-1 rule; disaster recovery; RTO, RPO",
        ],
        "learning_objectives": [
            "Outline cyber wellness and copyright/plagiarism/piracy; apply safe use and attribution.",
            "Explain computer crimes and apply data protection and validation techniques.",
            "Describe backup strategies and disaster recovery; apply Unhu/Ubuntu in digital contexts.",
        ],
    },
    "Systems Analysis and Design": {
        "subtopics": [
            "SDLC: Problem identification → Feasibility → Analysis → Design → Development → Testing → Implementation → Maintenance → Evaluation",
            "Problem identification; data collection (questionnaire, interview, record inspection, observation)",
            "Feasibility (technical, economic, legal, operational, social); cost–benefit; ROI; payback",
            "Requirements analysis; data flow; input/output/process design",
            "Design (UI, database, algorithms); development; testing (unit, integration, system, acceptance)",
            "Implementation; conversion methods; training; documentation; maintenance",
        ],
        "learning_objectives": [
            "Outline SDLC stages and apply problem identification and data collection techniques.",
            "Carry out feasibility studies and analyse results; explain analysis and design deliverables.",
            "Describe implementation, testing and maintenance in the system life cycle.",
        ],
    },
    "Algorithm Design and Problem-Solving": {
        "subtopics": [
            "Problem decomposition; abstraction; algorithmic thinking",
            "Flowcharts (symbols, sequence, selection, iteration); pseudocode",
            "Control structures (sequence, selection IF/CASE, iteration FOR/WHILE/REPEAT)",
            "Variables and constants; data types; operators; arrays and simple data structures",
            "Searching (linear, binary); sorting (bubble, insertion); trace tables; dry runs",
            "Testing and debugging; validation in algorithms",
        ],
        "learning_objectives": [
            "Decompose problems and express solutions using flowcharts and pseudocode.",
            "Use sequence, selection and iteration correctly; trace algorithms with trace tables.",
            "Implement simple search/sort algorithms and apply testing and validation.",
        ],
    },
    "Programming": {
        "subtopics": [
            "Variables and constants; data types (integer, real, string, boolean, char)",
            "Operators (arithmetic, comparison, logical); input and output",
            "Selection (IF, CASE); iteration (FOR, WHILE, REPEAT); nested structures",
            "Procedures and functions; parameters (value, reference); scope",
            "Arrays (1D, 2D); strings; file handling concepts",
            "High-level vs low-level languages; translators (compiler, interpreter, assembler)",
            "IDEs; debugging; testing; error handling and validation in programs",
        ],
        "learning_objectives": [
            "Use variables, types, operators and control structures in programs.",
            "Write and call procedures/functions; use arrays and simple file concepts.",
            "Distinguish language types and translators; use IDE and debugging basics.",
        ],
    },
    "Databases": {
        "subtopics": [
            "Database concepts; flat-file vs relational; tables, records, fields, entities, attributes",
            "Primary key, foreign key; relationships (1:1, 1:M, M:M); ER concepts",
            "Data types and field properties; validation and integrity",
            "SQL: SELECT, WHERE, ORDER BY, INSERT, UPDATE, DELETE; simple queries",
            "Forms, reports, queries; normalization (theory); security and access control",
        ],
        "learning_objectives": [
            "Explain database concepts and design simple relational structures with keys and relationships.",
            "Write SQL queries to retrieve and modify data; describe validation and integrity.",
            "Explain uses of forms/reports and basic normalization and security.",
        ],
    },
    "Web Design and Internet Uses": {
        "subtopics": [
            "Web concepts; HTML structure (tags, headings, paragraphs, links, images, lists, tables)",
            "CSS (basic styling, layout, responsiveness); separation of structure and style",
            "Internet vs WWW; browsers; URLs; HTTP/HTTPS; web security basics",
            "Content management (e.g. WordPress); accessibility and usability",
            "Testing and publishing; domains and hosting (theory)",
        ],
        "learning_objectives": [
            "Create simple web pages using HTML and apply basic CSS.",
            "Explain Internet vs WWW, URLs, protocols and web security (HTTPS, certificates).",
            "Describe CMS, testing and publishing concepts; focus on theory, not hands-on build.",
        ],
    },
    "Automated and Emerging Technologies": {
        "subtopics": [
            "Sensors and actuators; control systems; feedback loops; automated systems",
            "Robotics; industrial automation; IoT; smart devices",
            "AI basics (machine learning, expert systems, natural language, computer vision)",
            "Technopreneurship; digital innovation; intellectual property in tech",
            "Environmental and societal impact of automation and emerging technologies",
        ],
        "learning_objectives": [
            "Describe components of automated systems and give examples of robotics and IoT.",
            "Explain basic AI concepts and applications; discuss technopreneurship and IP.",
            "Evaluate impact of emerging technologies on society and environment.",
        ],
    },
}


def get_topic_objectives(topic_name: str) -> dict:
    """Return subtopics and learning_objectives for a topic. Normalizes legacy/display names to ZIMSEC keys."""
    if not topic_name or not ZIMSEC_CS_TOPIC_OBJECTIVES:
        return {"subtopics": [], "learning_objectives": []}
    t = (topic_name or "").strip()
    # Exact match
    if t in ZIMSEC_CS_TOPIC_OBJECTIVES:
        return ZIMSEC_CS_TOPIC_OBJECTIVES[t]
    # Legacy / Cambridge-style names → ZIMSEC names
    legacy = {
        "applications of computer science": "Application of Computer Science",
        "system analysis and design": "Systems Analysis and Design",
        "automated and emerging technologies": "Automated and Emerging Technologies",
    }
    key = legacy.get(t.lower(), t)
    if key in ZIMSEC_CS_TOPIC_OBJECTIVES:
        return ZIMSEC_CS_TOPIC_OBJECTIVES[key]
    for k in ZIMSEC_CS_TOPIC_OBJECTIVES:
        if t.lower() in k.lower() or k.lower() in t.lower():
            return ZIMSEC_CS_TOPIC_OBJECTIVES[k]
    return {"subtopics": [], "learning_objectives": []}


def get_paper1_prompt_guidance() -> str:
    """Short guidance for Paper 1 (MCQ) style: breadth of knowledge."""
    return (
        "ZIMSEC Paper 1 style: multiple choice testing BREADTH OF KNOWLEDGE across the topic. "
        "One clear correct answer; distractors plausible but wrong. No 'all of the above'. "
        "Align to syllabus learning objectives; use Zimbabwean/regional examples where relevant."
    )


def get_paper2_prompt_guidance() -> str:
    """Short guidance for Paper 2 (Structured) style: deep analytical, problem-solving."""
    return (
        "ZIMSEC Paper 2 style: structured questions with parts (a), (b), (c)... testing DEEP UNDERSTANDING "
        "and problem-solving. Parts progress from recall to application/analysis. Include mark scheme. "
        "Total marks 8–15; align to syllabus learning objectives."
    )
