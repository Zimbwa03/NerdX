"""
Professional Computer Science Question Generator.
- ZIMSEC O-Level (7014) and A-Level (6023); Cambridge O-Level (2210) and AS & A Level (9618).
- Theory: Paper 1 (MCQ), Paper 2 (structured), essay.
- AI: Vertex AI (primary), DeepSeek (fallback). Always try Vertex first; use DeepSeek only if Vertex is unavailable or returns no valid JSON.
"""
import os
import json
import requests
import time
import logging
import random
from typing import Dict, List, Optional, Any, Tuple
from utils.deepseek import get_deepseek_chat_model
from utils.vertex_ai_helper import try_vertex_json

try:
    from services.zimsec_cs_syllabus import (
        ZIMSEC_CS_TOPIC_OBJECTIVES,
        ZIMSEC_CS_CODE,
        get_topic_objectives,
        get_paper1_prompt_guidance,
        get_paper2_prompt_guidance,
    )
except ImportError:
    ZIMSEC_CS_TOPIC_OBJECTIVES = {}
    ZIMSEC_CS_CODE = "7014"
    def get_topic_objectives(topic_name): return {}
    def get_paper1_prompt_guidance(): return "ZIMSEC Paper 1: MCQ testing breadth of knowledge."
    def get_paper2_prompt_guidance(): return "ZIMSEC Paper 2: Structured, deep understanding and problem-solving."

try:
    from services.cambridge_cs_syllabus import (
        get_topic_objectives_cambridge,
        get_paper1_prompt_guidance_cambridge,
        get_paper2_prompt_guidance_cambridge,
        get_essay_prompt_guidance_cambridge,
    )
except ImportError:
    def get_topic_objectives_cambridge(topic_name): return {"subtopics": [], "learning_objectives": []}
    def get_paper1_prompt_guidance_cambridge(): return "Cambridge 2210 Paper 1 (Computer Systems): short-answer and structured; use command words and AOs."
    def get_paper2_prompt_guidance_cambridge(): return "Cambridge 2210 Paper 2 (Algorithms, Programming and Logic): structured and scenario; use command words and AOs."
    def get_essay_prompt_guidance_cambridge(): return "Cambridge 2210: extended responses using command words Demonstrate, Describe, Evaluate, Explain."

try:
    from services.cambridge_a_level_cs_syllabus import (
        get_topic_objectives_cambridge_a_level,
        get_paper1_prompt_guidance_cambridge_a_level,
        get_paper2_prompt_guidance_cambridge_a_level,
        get_paper3_prompt_guidance_cambridge_a_level,
        get_essay_prompt_guidance_cambridge_a_level,
    )
except ImportError:
    def get_topic_objectives_cambridge_a_level(topic_name): return {"subtopics": [], "learning_objectives": []}
    def get_paper1_prompt_guidance_cambridge_a_level(): return "Cambridge 9618 Paper 1 (Theory Fundamentals): Sections 1–8; use command words and AOs."
    def get_paper2_prompt_guidance_cambridge_a_level(): return "Cambridge 9618 Paper 2 (Problem-solving & Programming): Sections 9–12; pseudocode where required."
    def get_paper3_prompt_guidance_cambridge_a_level(): return "Cambridge 9618 Paper 3 (Advanced Theory): Sections 13–20."
    def get_essay_prompt_guidance_cambridge_a_level(): return "Cambridge 9618: extended responses using command words Demonstrate, Describe, Evaluate, Explain."

logger = logging.getLogger(__name__)

CS_SYSTEM_MESSAGE = (
    "You are an expert ZIMSEC O-Level Computer Science examiner (syllabus 7014). "
    "Generate educational questions in valid JSON format only. Focus on THEORY; practical work is in Virtual Labs."
)
CS_SYSTEM_MESSAGE_CAMBRIDGE = (
    "You are an expert Cambridge O Level Computer Science examiner (syllabus 2210). "
    "Generate educational questions in valid JSON format only. Use command words and assessment objectives (AO1, AO2, AO3) as per the syllabus."
)
CS_SYSTEM_MESSAGE_CAMBRIDGE_A_LEVEL = (
    "You are an expert Cambridge International AS & A Level Computer Science examiner (syllabus 9618). "
    "Generate educational questions in valid JSON format only. Use command words and assessment objectives (AO1, AO2, AO3). "
    "Align to Sections 1–12 (AS) and 13–20 (A Level) as appropriate."
)


class ComputerScienceGenerator:
    """Professional O-Level Computer Science generator with Vertex primary."""
    
    def __init__(self):
        self.api_key = os.environ.get('DEEPSEEK_API_KEY')
        self.api_url = "https://api.deepseek.com/v1/chat/completions"
        self.model = get_deepseek_chat_model()
        self.max_retries = 4  # Increased retries for better reliability
        self.timeouts = [30, 45, 60, 75]  # Progressive timeouts
        self.retry_delay = 2
        self.connect_timeout = 10  # Connection timeout
        
        # Create a session for connection pooling and reuse
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'NerdX-Education/1.0'
        })
        
        # ZIMSEC O-Level Computer Science 7014 — 11 topics (theory-only; practical in Virtual Labs)
        self.topics = dict(ZIMSEC_CS_TOPIC_OBJECTIVES) if ZIMSEC_CS_TOPIC_OBJECTIVES else {}
        if not self.topics:
            self.topics = self._fallback_topics()

    def _fallback_topics(self) -> dict:
        """Fallback topic map if ZIMSEC syllabus not loaded."""
        return {
            "Hardware and Software": {
                "subtopics": [
                    "Input devices (keyboard, mouse, scanner, microphone, webcam, touchscreen)",
                    "Output devices (monitor, printer, speakers, projector)",
                    "Storage devices (HDD, SSD, USB flash drive, optical media, cloud storage)",
                    "Processing devices (CPU, GPU, RAM, motherboard)",
                    "System software (operating systems, utilities, device drivers)",
                    "Application software (word processors, spreadsheets, databases, graphics)",
                    "Software lifecycle and maintenance",
                    "Embedded systems and microprocessors"
                ],
                "learning_objectives": [
                    "Identify and describe input, output, and storage devices",
                    "Explain the function of the CPU and its components (ALU, CU, registers)",
                    "Distinguish between system software and application software",
                    "Describe the fetch-decode-execute cycle",
                    "Explain the role of operating systems"
                ]
            },
            "Application of Computer Science": {
                "subtopics": [
                    "Computers in agriculture, banking, education, transport, health, environmental management",
                    "Robotics and automation; technopreneurship and digital innovation",
                ],
                "learning_objectives": [
                    "Describe real-world applications of computer systems",
                    "Evaluate benefits and drawbacks of computerization; use Zimbabwean examples where relevant",
                ]
            },
            "Data Representation": {
                "subtopics": [
                    "Binary number system (base 2)",
                    "Denary/Decimal number system (base 10)",
                    "Hexadecimal number system (base 16)",
                    "Number base conversions (binary ↔ denary ↔ hexadecimal)",
                    "Binary arithmetic (addition, subtraction using two's complement)",
                    "Logic gates (AND, OR, NOT, NAND, NOR, XOR)",
                    "Truth tables and Boolean expressions",
                    "Storage units (bit, byte, KB, MB, GB, TB)",
                    "Text representation (ASCII, Unicode)",
                    "Sound representation (sampling rate, bit depth)",
                    "Image representation (pixels, color depth, resolution)"
                ],
                "learning_objectives": [
                    "Convert between binary, denary, and hexadecimal",
                    "Perform binary addition and subtraction",
                    "Create and interpret truth tables",
                    "Design logic circuits using gates",
                    "Calculate file sizes for different data types"
                ]
            },
            "Communication Networks and Internet Technologies": {
                "subtopics": [
                    "Network types (LAN, WAN, MAN, PAN)",
                    "Network topologies (star, bus, ring, mesh)",
                    "Data transmission methods (serial, parallel)",
                    "Transmission modes (simplex, half-duplex, full-duplex)",
                    "Network devices (router, switch, hub, modem, bridge, gateway)",
                    "Transmission media (twisted pair, coaxial, fiber optic, wireless)",
                    "Internet services (WWW, email, FTP, VoIP)",
                    "Network protocols (TCP/IP, HTTP, HTTPS, FTP, SMTP)",
                    "Cloud computing and mobile technologies",
                    "IP addressing and DNS"
                ],
                "learning_objectives": [
                    "Describe different network types and topologies",
                    "Explain the function of network devices",
                    "Distinguish between different transmission media",
                    "Describe common internet services and protocols",
                    "Explain advantages of cloud computing"
                ]
            },
            "Security and Ethics": {
                "subtopics": [
                    "Cyber-wellness and digital citizenship",
                    "Copyright and intellectual property",
                    "Plagiarism and academic integrity",
                    "Privacy and data protection",
                    "Computer crimes (hacking, identity theft, fraud)",
                    "Cyber threats (malware, viruses, worms, trojans, ransomware)",
                    "Social engineering and phishing attacks",
                    "Brute-force and DDoS attacks",
                    "Protection strategies (firewalls, antivirus, encryption)",
                    "Authentication methods (passwords, biometrics, 2FA)",
                    "Access control and user rights"
                ],
                "learning_objectives": [
                    "Identify common cyber threats and attacks",
                    "Describe methods to protect computer systems",
                    "Explain the importance of ethical behavior online",
                    "Discuss legal issues related to computer use",
                    "Evaluate authentication methods"
                ]
            },
            "Systems Analysis and Design": {
                "subtopics": [
                    "SDLC (problem identification, feasibility, analysis, design, development, testing, implementation, maintenance)",
                    "Data collection (questionnaire, interview, observation); feasibility types; testing strategies",
                ],
                "learning_objectives": [
                    "Describe the stages of the SDLC and apply problem identification and data collection techniques",
                    "Explain feasibility study components and testing strategies",
                ]
            },
            "Algorithm Design and Problem-Solving": {
                "subtopics": [
                    "Problem decomposition and abstraction",
                    "Algorithm representation (flowcharts, pseudocode)",
                    "Sequence structures",
                    "Selection structures (IF-THEN-ELSE, CASE)",
                    "Iteration structures (FOR, WHILE, REPEAT-UNTIL)",
                    "Arrays and data structures",
                    "Searching algorithms (linear, binary search)",
                    "Sorting algorithms (bubble sort, insertion sort)",
                    "Testing and debugging strategies",
                    "Trace tables and dry runs"
                ],
                "learning_objectives": [
                    "Design algorithms using flowcharts and pseudocode",
                    "Use sequence, selection, and iteration correctly",
                    "Create and manipulate arrays",
                    "Trace algorithm execution",
                    "Debug and test algorithms"
                ]
            },
            "Programming": {
                "subtopics": [
                    "Variables and constants",
                    "Data types (integer, real, string, boolean, char)",
                    "Operators (arithmetic, comparison, logical)",
                    "Input and output operations",
                    "Control structures (selection, iteration)",
                    "Functions and procedures (subroutines)",
                    "Parameter passing (by value, by reference)",
                    "Error handling and validation",
                    "High-level vs low-level languages",
                    "Translators (compilers, interpreters, assemblers)",
                    "IDE features (editor, debugger, compiler)"
                ],
                "learning_objectives": [
                    "Declare and use variables of different data types",
                    "Write programs using control structures",
                    "Create and use functions/procedures",
                    "Handle errors and validate input",
                    "Distinguish between language types and translators"
                ]
            },
            "Databases": {
                "subtopics": [
                    "Database concepts and terminology",
                    "Flat-file vs relational databases",
                    "Tables, records, and fields",
                    "Primary keys and foreign keys",
                    "Data types in databases",
                    "Database relationships (one-to-one, one-to-many, many-to-many)",
                    "SQL SELECT statements with WHERE, ORDER BY",
                    "SQL INSERT, UPDATE, DELETE statements",
                    "Database queries and filtering",
                    "Database security and access control"
                ],
                "learning_objectives": [
                    "Design simple database structures",
                    "Identify appropriate data types for fields",
                    "Write SQL queries to retrieve data",
                    "Explain the importance of database keys",
                    "Describe database security measures"
                ]
            },
            "Web Design and Internet Uses": {
                "subtopics": [
                    "Web page structure (HTML basics)",
                    "Styling web pages (CSS basics)",
                    "Web content management systems (CMS)",
                    "Responsive web design principles",
                    "Graphic design for web",
                    "Testing and debugging websites",
                    "Web hosting and domain names",
                    "Internet vs World Wide Web distinction",
                    "HTTP and HTTPS protocols",
                    "Web browsers and URLs",
                    "Website security (HTTPS, SSL certificates)"
                ],
                "learning_objectives": [
                    "Create simple web pages using HTML",
                    "Apply basic CSS styling",
                    "Explain the difference between Internet and WWW",
                    "Describe web security practices",
                    "Test websites for usability"
                ]
            },
            "Automated and Emerging Technologies": {
                "subtopics": [
                    "Sensors and their applications",
                    "Microprocessors and microcontrollers",
                    "Actuators and output devices",
                    "Automated systems (control systems, feedback loops)",
                    "Robotics and industrial automation",
                    "Artificial Intelligence (AI) basics",
                    "Internet of Things (IoT)",
                    "Smart devices and home automation",
                    "Technopreneurship and innovation",
                    "Intellectual property rights",
                    "Environmental considerations in technology"
                ],
                "learning_objectives": [
                    "Describe components of automated systems",
                    "Explain how sensors and actuators work",
                    "Discuss applications of AI and IoT",
                    "Evaluate the impact of emerging technologies",
                    "Understand technopreneurship concepts"
                ]
            }
        }
        
        # Question variation patterns
        self.question_starters = [
            "Explain", "Describe", "Define", "State", "Identify",
            "Compare", "Contrast", "Discuss", "Evaluate", "Justify",
            "Calculate", "Convert", "Draw", "Design", "Outline"
        ]
    
    def generate_topical_question(self, topic: str, difficulty: str = 'medium',
                                  user_id: str = None, board: str = 'zimsec',
                                  a_level_cambridge: bool = False) -> Dict[str, Any]:
        """Generate MCQ question. board: 'zimsec' or 'cambridge'; a_level_cambridge=True for Cambridge 9618."""
        try:
            prompt = self._create_olevel_mcq_prompt(topic, difficulty, board=board, a_level_cambridge=a_level_cambridge)
            context = f"cs:mcq:{topic}:{difficulty}:{board}"
            if a_level_cambridge:
                sys_msg = CS_SYSTEM_MESSAGE_CAMBRIDGE_A_LEVEL
            else:
                sys_msg = CS_SYSTEM_MESSAGE_CAMBRIDGE if (board or '').lower() == 'cambridge' else CS_SYSTEM_MESSAGE
            vertex_prompt = f"{sys_msg}\n\n{prompt}"

            logger.info(f"Trying Vertex AI (primary) for {context}")
            vertex_response = try_vertex_json(vertex_prompt, logger=logger, context=context)
            if vertex_response and 'question' in vertex_response:
                return self._validate_and_enhance_question(vertex_response, topic, difficulty, user_id, source='vertex_ai')

            logger.info(f"Falling back to DeepSeek for {context}")
            response = self._call_deepseek_api(prompt, "mcq")
            if response and 'question' in response:
                return self._validate_and_enhance_question(response, topic, difficulty, user_id, source='deepseek_fallback')

            return self._get_fallback_mcq_question(topic, difficulty, user_id)

        except Exception as e:
            logger.error(f"Error generating CS MCQ question: {e}")
            return self._get_fallback_mcq_question(topic, difficulty, user_id)

    def generate_structured_question(self, topic: str, difficulty: str = 'medium',
                                    user_id: str = None, board: str = 'zimsec',
                                    a_level_cambridge: bool = False) -> Dict[str, Any]:
        """Generate structured question. board: 'zimsec' or 'cambridge'; a_level_cambridge=True for Cambridge 9618."""
        try:
            prompt = self._create_structured_prompt(topic, difficulty, board=board, a_level_cambridge=a_level_cambridge)
            context = f"cs:structured:{topic}:{difficulty}:{board}"
            if a_level_cambridge:
                sys_msg = CS_SYSTEM_MESSAGE_CAMBRIDGE_A_LEVEL
            else:
                sys_msg = CS_SYSTEM_MESSAGE_CAMBRIDGE if (board or '').lower() == 'cambridge' else CS_SYSTEM_MESSAGE
            vertex_prompt = f"{sys_msg}\n\n{prompt}"

            logger.info(f"Trying Vertex AI (primary) for {context}")
            vertex_response = try_vertex_json(vertex_prompt, logger=logger, context=context)
            if vertex_response:
                return self._validate_and_enhance_structured_question(vertex_response, topic, difficulty, user_id, source='vertex_ai')

            logger.info(f"Falling back to DeepSeek for {context}")
            response = self._call_deepseek_api(prompt, "structured")
            if response:
                return self._validate_and_enhance_structured_question(response, topic, difficulty, user_id, source='deepseek_fallback')

            return self._get_fallback_structured_question(topic, difficulty, user_id)

        except Exception as e:
            logger.error(f"Error generating CS structured question: {e}")
            return self._get_fallback_structured_question(topic, difficulty, user_id)

    def generate_essay_question(self, topic: str, difficulty: str = 'medium',
                               user_id: str = None, board: str = 'zimsec',
                               a_level_cambridge: bool = False) -> Dict[str, Any]:
        """Generate essay question. board: 'zimsec' or 'cambridge'; a_level_cambridge=True for Cambridge 9618."""
        try:
            prompt = self._create_essay_prompt(topic, difficulty, board=board, a_level_cambridge=a_level_cambridge)
            context = f"cs:essay:{topic}:{difficulty}:{board}"
            if a_level_cambridge:
                sys_msg = CS_SYSTEM_MESSAGE_CAMBRIDGE_A_LEVEL
            else:
                sys_msg = CS_SYSTEM_MESSAGE_CAMBRIDGE if (board or '').lower() == 'cambridge' else CS_SYSTEM_MESSAGE
            vertex_prompt = f"{sys_msg}\n\n{prompt}"

            logger.info(f"Trying Vertex AI (primary) for {context}")
            vertex_response = try_vertex_json(vertex_prompt, logger=logger, context=context)
            if vertex_response:
                return self._validate_and_enhance_essay_question(vertex_response, topic, difficulty, user_id, source='vertex_ai')

            logger.info(f"Falling back to DeepSeek for {context}")
            response = self._call_deepseek_api(prompt, "essay")
            if response:
                return self._validate_and_enhance_essay_question(response, topic, difficulty, user_id, source='deepseek_fallback')

            return self._get_fallback_essay_question(topic, difficulty, user_id)

        except Exception as e:
            logger.error(f"Error generating CS essay question: {e}")
            return self._get_fallback_essay_question(topic, difficulty, user_id)

    def _topic_info(self, topic: str) -> dict:
        """Resolve topic to syllabus objectives; supports ZIMSEC and legacy topic names."""
        try:
            info = get_topic_objectives(topic)
            if info and (info.get("subtopics") or info.get("learning_objectives")):
                return info
        except Exception:
            pass
        return self.topics.get(topic, {})

    def _topic_info_cambridge(self, topic: str) -> dict:
        """Resolve topic to Cambridge 2210 syllabus objectives."""
        try:
            return get_topic_objectives_cambridge(topic)
        except Exception:
            return {"subtopics": [], "learning_objectives": []}

    def _topic_info_cambridge_a_level(self, topic: str) -> dict:
        """Resolve topic to Cambridge 9618 AS & A Level syllabus objectives."""
        try:
            return get_topic_objectives_cambridge_a_level(topic)
        except Exception:
            return {"subtopics": [], "learning_objectives": []}

    def _create_olevel_mcq_prompt(self, topic: str, difficulty: str, board: str = 'zimsec',
                                  a_level_cambridge: bool = False) -> str:
        """Create MCQ prompt — ZIMSEC, Cambridge 2210, or Cambridge 9618 Paper 1 style."""
        if a_level_cambridge:
            topic_info = self._topic_info_cambridge_a_level(topic)
            is_cambridge = True
        else:
            is_cambridge = (board or '').lower() == 'cambridge'
            topic_info = self._topic_info_cambridge(topic) if is_cambridge else self._topic_info(topic)
        subtopics = topic_info.get('subtopics', [])
        objectives = topic_info.get('learning_objectives', [])
        selected_subtopic = random.choice(subtopics) if subtopics else topic
        difficulty_guidance = {
            'easy': "Focus on basic definitions, identification, and simple concepts. Suitable for Form 1-2.",
            'medium': "Include application of concepts and some analysis. Suitable for Form 3.",
            'difficult': "Require deeper understanding, analysis, and synthesis. Suitable for Form 4 exam preparation."
        }
        if a_level_cambridge:
            paper1_guide = get_paper1_prompt_guidance_cambridge_a_level()
            examiner_line = "You are an expert Cambridge International AS & A Level Computer Science examiner (syllabus 9618). Paper 1 (Theory Fundamentals) = Sections 1–8. Use command words: State, Define, Identify, Describe, Explain, Calculate, Show (that)."
            req4 = "Ensure the explanation teaches the concept clearly. Align to syllabus 9618 learning objectives."
        else:
            paper1_guide = get_paper1_prompt_guidance_cambridge() if is_cambridge else get_paper1_prompt_guidance()
            examiner_line = "You are an expert Cambridge O Level Computer Science examiner (syllabus 2210). Paper 1 (Computer Systems) = short-answer/structured style multiple choice. Use command words: State, Define, Identify, Describe, Explain, Calculate." if is_cambridge else f"You are an expert ZIMSEC O-Level Computer Science examiner (syllabus {ZIMSEC_CS_CODE}). Paper 1 = multiple choice testing BREADTH OF KNOWLEDGE. Focus on THEORY only (practical work is in Virtual Labs)."
            req4 = "Ensure the explanation teaches the concept clearly. Use international/Cambridge contexts where relevant." if is_cambridge else "Use Zimbabwean/regional contexts where relevant (e.g. EcoCash, ZIMSEC, local sectors). Ensure the explanation teaches the concept clearly."
        objs_text = chr(10).join(f"- {obj}" for obj in (objectives[:4] if objectives else ["Align to syllabus learning outcomes for this topic."]))
        return f"""{examiner_line}

**Syllabus / Paper 1**: {paper1_guide}

**Topic**: {topic}
**Subtopic Focus**: {selected_subtopic}
**Difficulty**: {difficulty}
**Difficulty Guidance**: {difficulty_guidance.get(difficulty, difficulty_guidance['medium'])}

**Learning objectives to test (syllabus-aligned)**:
{objs_text}

**Requirements**:
1. Question must be clear, unambiguous, and age-appropriate (14-16 / Forms 1-4)
2. All 4 options must be plausible but only ONE correct
3. Avoid "All of the above" or "None of the above" options
4. {req4}

**Response Format (JSON)**:
{{
    "question": "Clear question text",
    "options": {{
        "A": "First option",
        "B": "Second option",
        "C": "Third option",
        "D": "Fourth option"
    }},
    "correct_answer": "A",
    "explanation": "Detailed explanation of why the answer is correct and why other options are wrong. Include the key concept being tested.",
    "topic": "{topic}",
    "subtopic": "{selected_subtopic}",
    "difficulty": "{difficulty}"
}}

Generate a unique, high-quality question now:"""

    def _create_structured_prompt(self, topic: str, difficulty: str, board: str = 'zimsec',
                                  a_level_cambridge: bool = False) -> str:
        """Create structured prompt — ZIMSEC Paper 2, Cambridge 2210 Paper 2, or Cambridge 9618 Paper 2 style."""
        if a_level_cambridge:
            topic_info = self._topic_info_cambridge_a_level(topic)
            paper2_guide = get_paper2_prompt_guidance_cambridge_a_level()
            examiner_line = "You are an expert Cambridge International AS & A Level Computer Science examiner (syllabus 9618). Paper 2 (Problem-solving & Programming) = Sections 9–12. Use pseudocode where relevant. Use command words: Calculate, Compare, Define, Demonstrate, Describe, Evaluate, Explain, Give, Identify, Outline, Show (that), State, Suggest."
            req5 = "Align to syllabus 9618 Sections 9–12; use AO1/AO2/AO3."
        else:
            is_cambridge = (board or '').lower() == 'cambridge'
            topic_info = self._topic_info_cambridge(topic) if is_cambridge else self._topic_info(topic)
            paper2_guide = get_paper2_prompt_guidance_cambridge() if is_cambridge else get_paper2_prompt_guidance()
            examiner_line = "You are an expert Cambridge O Level Computer Science examiner (syllabus 2210). Paper 2 (Algorithms, Programming and Logic) = structured and scenario-based questions. Use command words: Calculate, Compare, Define, Demonstrate, Describe, Evaluate, Explain, Give, Identify, Outline, Show (that), State, Suggest." if is_cambridge else f"You are an expert ZIMSEC O-Level Computer Science examiner (syllabus {ZIMSEC_CS_CODE}). Paper 2 = structured questions testing DEEP UNDERSTANDING and problem-solving. Focus on THEORY only (practical work is in Virtual Labs)."
            req5 = "Use international/Cambridge-style contexts where relevant. Align to AO1/AO2/AO3." if is_cambridge else "Use Zimbabwean/regional contexts where relevant."
        subtopics = topic_info.get('subtopics', [])
        objectives = topic_info.get('learning_objectives', [])
        selected_subtopic = random.choice(subtopics) if subtopics else topic
        objs_text = chr(10).join(f"- {obj}" for obj in (objectives[:4] if objectives else ["Align to syllabus learning outcomes for this topic."]))
        return f"""{examiner_line}

**Syllabus / Paper 2**: {paper2_guide}

**Topic**: {topic}
**Subtopic Focus**: {selected_subtopic}
**Difficulty**: {difficulty}

**Learning objectives to target (syllabus-aligned)**:
{objs_text}

**Requirements**:
1. Multiple parts (a), (b), (c)... with mark allocations; total 8-15 marks
2. Parts progress from recall → application → analysis
3. Include a short context/scenario where appropriate
4. Provide detailed marking scheme (marking_points) per part
5. {req5}

**Response Format (JSON)**:
{{
    "question_type": "structured",
    "context": "Optional scenario or context for the question",
    "stem": "Main question introduction",
    "parts": [
        {{
            "label": "a",
            "question": "Part (a) question text",
            "marks": 2,
            "expected_answer": "Model answer for part (a)",
            "marking_points": ["Point 1 (1 mark)", "Point 2 (1 mark)"]
        }},
        {{
            "label": "b",
            "question": "Part (b) question text",
            "marks": 3,
            "expected_answer": "Model answer for part (b)",
            "marking_points": ["Point 1", "Point 2", "Point 3"]
        }},
        {{
            "label": "c",
            "question": "Part (c) question text",
            "marks": 4,
            "expected_answer": "Model answer for part (c)",
            "marking_points": ["Point 1", "Point 2", "Point 3", "Point 4"]
        }}
    ],
    "total_marks": 9,
    "topic": "{topic}",
    "subtopic": "{selected_subtopic}",
    "difficulty": "{difficulty}"
}}

Generate a structured question now:"""

    def _create_essay_prompt(self, topic: str, difficulty: str, board: str = 'zimsec',
                             a_level_cambridge: bool = False) -> str:
        """Create essay prompt — ZIMSEC, Cambridge 2210, or Cambridge 9618 style."""
        if a_level_cambridge:
            topic_info = self._topic_info_cambridge_a_level(topic)
            essay_guide = get_essay_prompt_guidance_cambridge_a_level()
            examiner_line = "You are an expert Cambridge International AS & A Level Computer Science examiner (syllabus 9618). Extended responses: use command words Demonstrate, Describe, Evaluate, Explain. " + (essay_guide or "")
            req3 = "Include a clear context or scenario; align to syllabus 9618 learning objectives."
        else:
            is_cambridge = (board or '').lower() == 'cambridge'
            topic_info = self._topic_info_cambridge(topic) if is_cambridge else self._topic_info(topic)
            essay_guide = get_essay_prompt_guidance_cambridge() if is_cambridge else ""
            examiner_line = "You are an expert Cambridge O Level Computer Science examiner (syllabus 2210). Extended responses: use command words Demonstrate, Describe, Evaluate, Explain. " + (essay_guide or "") if is_cambridge else f"You are an expert ZIMSEC O-Level Computer Science examiner (syllabus {ZIMSEC_CS_CODE}). Focus on THEORY only (practical work is in Virtual Labs). Essay questions test analysis, evaluation, and discussion aligned to syllabus."
            req3 = "Include a clear context or scenario; use international/Cambridge-style examples where relevant." if is_cambridge else "Include a clear context or scenario; use Zimbabwean/regional examples where relevant."
        subtopics = topic_info.get('subtopics', [])
        objectives = topic_info.get('learning_objectives', [])
        selected_subtopic = random.choice(subtopics) if subtopics else topic
        objs_text = chr(10).join(f"- {obj}" for obj in (objectives[:4] if objectives else ["Align to syllabus learning outcomes for this topic."]))
        return f"""{examiner_line}

**Topic**: {topic}
**Subtopic Focus**: {selected_subtopic}
**Difficulty**: {difficulty}

**Learning objectives to target (syllabus-aligned)**:
{objs_text}

**Requirements**:
1. Essay question requiring extended writing (200-400 words expected)
2. Test analysis, evaluation, or discussion skills; allow valid perspectives (AO2/AO3 where relevant)
3. {req3}
4. Provide comprehensive marking guide (content, analysis, communication)

**Response Format (JSON)**:
{{
    "question_type": "essay",
    "question": "Full essay question with context and clear instructions",
    "word_limit": "200-400 words",
    "marks": 15,
    "key_points": [
        "Key point 1 that should be discussed",
        "Key point 2",
        "Key point 3",
        "Key point 4",
        "Key point 5"
    ],
    "marking_criteria": {{
        "content": "Description of content expectations (8 marks)",
        "analysis": "Description of analysis expectations (4 marks)",
        "communication": "Description of communication expectations (3 marks)"
    }},
    "sample_answer_outline": "Brief outline of an excellent response",
    "topic": "{topic}",
    "subtopic": "{selected_subtopic}",
    "difficulty": "{difficulty}"
}}

Generate an essay question now:"""

    def _call_deepseek_api(self, prompt: str, generation_type: str) -> Optional[Dict]:
        """Call DeepSeek API with appropriate settings and retries"""
        if not self.api_key:
            logger.error("DeepSeek API key not configured")
            return None
        
        # Pre-flight validation
        if not prompt or len(prompt.strip()) == 0:
            logger.error("Empty prompt provided to DeepSeek API")
            return None
        
        headers = {
            "Authorization": f"Bearer {self.api_key}"
        }
        
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": CS_SYSTEM_MESSAGE
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.7,
            "max_tokens": 2000
        }
        
        # Retry with progressive timeouts
        for attempt in range(self.max_retries):
            timeout = self.timeouts[min(attempt, len(self.timeouts) - 1)]
            
            # Exponential backoff with jitter
            if attempt > 0:
                import random
                backoff_delay = self.retry_delay * (2 ** (attempt - 1)) + random.uniform(0, 1)
                logger.info(f"Waiting {backoff_delay:.2f}s before retry {attempt + 1}/{self.max_retries}")
                time.sleep(backoff_delay)
            
            try:
                logger.info(f"DeepSeek CS {generation_type} attempt {attempt + 1}/{self.max_retries} (timeout: {timeout}s)")
                
                # Use session for connection pooling
                self.session.headers.update(headers)
                response = self.session.post(
                    self.api_url,
                    json=payload,
                    timeout=(self.connect_timeout, timeout)
                )
                
                if response.status_code == 200:
                    result = response.json()
                    content = result.get('choices', [{}])[0].get('message', {}).get('content', '')
                    
                    # Parse JSON from response
                    try:
                        # Try to extract JSON from the response
                        if '```json' in content:
                            json_str = content.split('```json')[1].split('```')[0].strip()
                        elif '```' in content:
                            json_str = content.split('```')[1].split('```')[0].strip()
                        else:
                            json_str = content.strip()
                        
                        logger.info(f"✅ Successfully generated CS {generation_type} on attempt {attempt + 1}")
                        return json.loads(json_str)
                    except json.JSONDecodeError as e:
                        logger.error(f"Failed to parse JSON response: {e}")
                        if attempt < self.max_retries - 1:
                            continue
                        break
                        
                elif response.status_code == 429:
                    # Rate limit
                    retry_after = int(response.headers.get('Retry-After', 10))
                    logger.warning(f"DeepSeek rate limit hit (429), waiting {retry_after}s")
                    if attempt < self.max_retries - 1:
                        time.sleep(retry_after)
                        continue
                elif response.status_code == 503:
                    # Service unavailable
                    logger.warning(f"DeepSeek service unavailable (503)")
                    if attempt < self.max_retries - 1:
                        continue
                else:
                    logger.error(f"DeepSeek API error: {response.status_code}")
                    if attempt < self.max_retries - 1:
                        continue
                        
            except requests.exceptions.Timeout:
                logger.warning(f"DeepSeek timeout on attempt {attempt + 1}/{self.max_retries}")
                if attempt < self.max_retries - 1:
                    continue
            except requests.exceptions.ConnectionError as e:
                logger.error(f"DeepSeek connection error on attempt {attempt + 1}: {e}")
                if attempt < self.max_retries - 1:
                    import random
                    wait_time = min(2 ** attempt, 5) + random.uniform(0, 1)
                    time.sleep(wait_time)
                    continue
            except Exception as e:
                logger.error(f"Error calling DeepSeek API on attempt {attempt + 1}: {e}")
                if attempt < self.max_retries - 1:
                    continue
        
        # FALLBACK: Try Vertex AI when DeepSeek fails
        logger.error(f"DeepSeek failed for {generation_type}, trying Vertex AI fallback")
        try:
            from services.vertex_service import vertex_service
            
            if vertex_service.is_available():
                logger.info(f"🔄 Falling back to Vertex AI for Computer Science {generation_type}")
                
                # Create system message for Vertex AI
                system_message = "You are an expert O-Level Computer Science examiner. Generate educational questions in valid JSON format only."
                full_prompt = f"{system_message}\n\n{prompt}"
                
                result = vertex_service.generate_text(prompt=full_prompt, model="gemini-2.5-flash")
                
                if result and result.get('success'):
                    text = result['text']
                    logger.info(f"Raw Vertex AI response for {generation_type}: {text[:200]}...")
                    
                    # Extract JSON from response
                    try:
                        if '```json' in text:
                            json_str = text.split('```json')[1].split('```')[0].strip()
                        elif '```' in text:
                            json_str = text.split('```')[1].split('```')[0].strip()
                        else:
                            json_start = text.find('{')
                            json_end = text.rfind('}') + 1
                            if json_start != -1 and json_end > json_start:
                                json_str = text[json_start:json_end]
                            else:
                                json_str = text.strip()
                        
                        question_data = json.loads(json_str)
                        logger.info(f"✅ Successfully generated Computer Science {generation_type} with Vertex AI fallback")
                        return question_data
                    except json.JSONDecodeError as e:
                        logger.error(f"JSON parsing failed from Vertex AI for {generation_type}: {e}")
                else:
                    logger.error(f"Vertex AI fallback failed: {result.get('error', 'Unknown error') if result else 'No result'}")
            else:
                logger.warning("Vertex AI not available for fallback")
        except Exception as e:
            logger.error(f"Error in Vertex AI fallback: {e}")
        
        return None
    
    def _validate_and_enhance_question(self, question_data: Dict, topic: str, 
                                       difficulty: str, user_id: str = None, source: str = "deepseek") -> Dict:
        """Validate and enhance MCQ question."""
        return {
            "question": question_data.get('question', ''),
            "options": question_data.get('options', {}),
            "correct_answer": question_data.get('correct_answer', 'A'),
            "explanation": question_data.get('explanation', ''),
            "topic": topic,
            "subtopic": question_data.get('subtopic', topic),
            "difficulty": difficulty,
            "question_type": "mcq",
            "subject": "computer_science",
            "source": source,
            "user_id": user_id
        }

    def _validate_and_enhance_structured_question(self, question_data: Dict, topic: str,
                                                  difficulty: str, user_id: str = None, source: str = "deepseek") -> Dict:
        """Validate and enhance structured question."""
        return {
            "question_type": "structured",
            "context": question_data.get('context', ''),
            "stem": question_data.get('stem', ''),
            "parts": question_data.get('parts', []),
            "total_marks": question_data.get('total_marks', 10),
            "topic": topic,
            "subtopic": question_data.get('subtopic', topic),
            "difficulty": difficulty,
            "subject": "computer_science",
            "source": source,
            "user_id": user_id
        }

    def _validate_and_enhance_essay_question(self, question_data: Dict, topic: str,
                                             difficulty: str, user_id: str = None, source: str = "deepseek") -> Dict:
        """Validate and enhance essay question."""
        return {
            "question_type": "essay",
            "question": question_data.get('question', ''),
            "word_limit": question_data.get('word_limit', '200-400 words'),
            "marks": question_data.get('marks', 15),
            "key_points": question_data.get('key_points', []),
            "marking_criteria": question_data.get('marking_criteria', {}),
            "sample_answer_outline": question_data.get('sample_answer_outline', ''),
            "topic": topic,
            "subtopic": question_data.get('subtopic', topic),
            "difficulty": difficulty,
            "subject": "computer_science",
            "source": source,
            "user_id": user_id
        }

    def _get_fallback_mcq_question(self, topic: str, difficulty: str, user_id: str = None) -> Dict:
        """Provide fallback MCQ questions when AI fails"""
        fallback_questions = {
            "Hardware and Software": {
                "question": "Which of the following is an example of system software?",
                "options": {
                    "A": "Microsoft Word",
                    "B": "Windows Operating System",
                    "C": "Adobe Photoshop",
                    "D": "Google Chrome"
                },
                "correct_answer": "B",
                "explanation": "Windows Operating System is system software because it manages the computer's hardware and provides services for application software. Microsoft Word (A), Adobe Photoshop (C), and Google Chrome (D) are all application software - they perform specific tasks for users."
            },
            "Data Representation": {
                "question": "What is the binary equivalent of the denary number 13?",
                "options": {
                    "A": "1011",
                    "B": "1101",
                    "C": "1110",
                    "D": "1100"
                },
                "correct_answer": "B",
                "explanation": "To convert 13 to binary: 13 ÷ 2 = 6 remainder 1; 6 ÷ 2 = 3 remainder 0; 3 ÷ 2 = 1 remainder 1; 1 ÷ 2 = 0 remainder 1. Reading remainders from bottom to top gives 1101."
            },
            "Communication Networks and Internet Technologies": {
                "question": "Which network topology connects all devices to a central hub or switch?",
                "options": {
                    "A": "Bus topology",
                    "B": "Ring topology",
                    "C": "Star topology",
                    "D": "Mesh topology"
                },
                "correct_answer": "C",
                "explanation": "Star topology connects all devices to a central hub or switch. Bus topology uses a single backbone cable. Ring topology connects devices in a circular fashion. Mesh topology connects every device to every other device."
            },
            "Security and Ethics": {
                "question": "Which of the following is a type of malicious software?",
                "options": {
                    "A": "Firewall",
                    "B": "Antivirus",
                    "C": "Trojan horse",
                    "D": "Encryption"
                },
                "correct_answer": "C",
                "explanation": "A Trojan horse is malicious software disguised as legitimate software. Firewall (A) and Antivirus (B) are protection software, and Encryption (D) is a security technique to protect data."
            },
            "Algorithm Design and Problem-Solving": {
                "question": "What symbol is used to represent a decision in a flowchart?",
                "options": {
                    "A": "Rectangle",
                    "B": "Diamond",
                    "C": "Oval",
                    "D": "Parallelogram"
                },
                "correct_answer": "B",
                "explanation": "A diamond shape represents a decision (yes/no or true/false) in a flowchart. Rectangles represent processes, ovals represent start/end points, and parallelograms represent input/output."
            },
            "Programming": {
                "question": "Which data type is used to store text in a program?",
                "options": {
                    "A": "Integer",
                    "B": "Boolean",
                    "C": "String",
                    "D": "Float"
                },
                "correct_answer": "C",
                "explanation": "String data type is used to store text/characters. Integer stores whole numbers, Boolean stores true/false values, and Float stores decimal numbers."
            },
            "Databases": {
                "question": "Which SQL command is used to retrieve data from a database?",
                "options": {
                    "A": "INSERT",
                    "B": "UPDATE",
                    "C": "SELECT",
                    "D": "DELETE"
                },
                "correct_answer": "C",
                "explanation": "SELECT is used to retrieve data from a database. INSERT adds new records, UPDATE modifies existing records, and DELETE removes records."
            },
            "Systems Analysis and Design": {
                "question": "Which phase of the SDLC involves gathering user requirements?",
                "options": {
                    "A": "Design",
                    "B": "Analysis",
                    "C": "Implementation",
                    "D": "Testing"
                },
                "correct_answer": "B",
                "explanation": "The Analysis phase involves gathering and documenting user requirements. Design creates the system blueprint, Implementation involves coding, and Testing verifies the system works correctly."
            },
            "Web Design and Internet Uses": {
                "question": "Which protocol ensures secure data transfer on websites?",
                "options": {
                    "A": "HTTP",
                    "B": "FTP",
                    "C": "HTTPS",
                    "D": "SMTP"
                },
                "correct_answer": "C",
                "explanation": "HTTPS (HyperText Transfer Protocol Secure) encrypts data transfer between browser and website. HTTP is not secure, FTP is for file transfer, and SMTP is for email."
            },
            "Automated and Emerging Technologies": {
                "question": "What type of device is used to measure temperature in an automated system?",
                "options": {
                    "A": "Actuator",
                    "B": "Sensor",
                    "C": "Microprocessor",
                    "D": "Motor"
                },
                "correct_answer": "B",
                "explanation": "A sensor (specifically a temperature sensor) measures physical quantities like temperature. Actuators and motors produce movement/action, and microprocessors process data."
            },
            "Applications of Computer Science": {
                "question": "Which of the following is an example of using computers in healthcare?",
                "options": {
                    "A": "ATM machine",
                    "B": "GPS navigation",
                    "C": "Electronic Health Records (EHR)",
                    "D": "Online shopping"
                },
                "correct_answer": "C",
                "explanation": "Electronic Health Records (EHR) is a healthcare application of computers. ATM is banking, GPS is transport, and online shopping is e-commerce."
            }
        }
        
        default_question = fallback_questions.get(topic, fallback_questions["Hardware and Software"])
        
        return {
            "question": default_question["question"],
            "options": default_question["options"],
            "correct_answer": default_question["correct_answer"],
            "explanation": default_question["explanation"],
            "topic": topic,
            "subtopic": topic,
            "difficulty": difficulty,
            "question_type": "mcq",
            "subject": "computer_science",
            "user_id": user_id
        }
    
    def _get_fallback_structured_question(self, topic: str, difficulty: str, user_id: str = None) -> Dict:
        """Provide fallback structured questions"""
        return {
            "question_type": "structured",
            "context": "A school is upgrading its computer network.",
            "stem": "The school currently uses a bus topology and wants to change to a star topology.",
            "parts": [
                {
                    "label": "a",
                    "question": "Define the term 'network topology'.",
                    "marks": 2,
                    "expected_answer": "Network topology refers to the physical or logical arrangement/layout of devices and connections in a computer network.",
                    "marking_points": ["Physical/logical arrangement (1 mark)", "Of devices/connections in a network (1 mark)"]
                },
                {
                    "label": "b",
                    "question": "State TWO advantages of using a star topology over a bus topology.",
                    "marks": 4,
                    "expected_answer": "1. If one device fails, other devices continue to work. 2. Easier to add new devices without disrupting the network. 3. Better performance under heavy network traffic. 4. Easier to identify and troubleshoot faults.",
                    "marking_points": ["Advantage 1 with explanation (2 marks)", "Advantage 2 with explanation (2 marks)"]
                },
                {
                    "label": "c",
                    "question": "Identify ONE disadvantage of a star topology that the school should consider.",
                    "marks": 2,
                    "expected_answer": "If the central hub/switch fails, the entire network goes down. OR Star topology requires more cabling, increasing costs.",
                    "marking_points": ["Valid disadvantage (1 mark)", "Explanation/reason (1 mark)"]
                }
            ],
            "total_marks": 8,
            "topic": topic,
            "subtopic": "Network topologies",
            "difficulty": difficulty,
            "subject": "computer_science",
            "user_id": user_id
        }
    
    def _get_fallback_essay_question(self, topic: str, difficulty: str, user_id: str = None) -> Dict:
        """Provide fallback essay questions"""
        return {
            "question_type": "essay",
            "question": "Many organizations store personal data about their customers in computer databases. Discuss the ethical and security considerations that organizations should address when handling personal data. Your answer should include: the importance of data protection, potential threats to data security, and measures organizations can implement to protect personal data.",
            "word_limit": "200-400 words",
            "marks": 15,
            "key_points": [
                "Importance of data protection (privacy, trust, legal compliance)",
                "Types of threats (hacking, malware, social engineering, insider threats)",
                "Protection measures (encryption, access control, firewalls, backups)",
                "Legal/ethical obligations (data protection laws, consent, transparency)",
                "Consequences of data breaches (financial, reputational, legal)"
            ],
            "marking_criteria": {
                "content": "Accurate identification and explanation of key concepts (8 marks)",
                "analysis": "Critical evaluation of issues and solutions (4 marks)",
                "communication": "Clear structure, appropriate terminology, coherent argument (3 marks)"
            },
            "sample_answer_outline": "Introduction defining data protection importance → Discussion of common threats → Analysis of protection measures → Consideration of ethical/legal aspects → Conclusion with recommendations",
            "topic": topic,
            "subtopic": "Data security and ethics",
            "difficulty": difficulty,
            "subject": "computer_science",
            "user_id": user_id
        }
    
    def evaluate_answer(self, question_data: Dict, student_answer: str) -> Dict:
        """Evaluate a student's answer"""
        question_type = question_data.get('question_type', 'mcq')
        
        if question_type == 'mcq':
            return self._evaluate_mcq_answer(question_data, student_answer)
        elif question_type == 'structured':
            return self._evaluate_structured_answer(question_data, student_answer)
        else:
            return self._evaluate_essay_answer(question_data, student_answer)
    
    def _evaluate_mcq_answer(self, question_data: Dict, student_answer: str) -> Dict:
        """Evaluate MCQ answer"""
        correct = student_answer.upper().strip() == question_data.get('correct_answer', '').upper()
        
        return {
            "correct": correct,
            "score": 1 if correct else 0,
            "max_score": 1,
            "feedback": question_data.get('explanation', ''),
            "correct_answer": question_data.get('correct_answer', '')
        }
    
    def _evaluate_structured_answer(self, question_data: Dict, student_answer: str) -> Dict:
        """Evaluate structured answer using AI or keyword matching"""
        try:
            # Try AI evaluation
            prompt = f"""Evaluate this student's answer for a Computer Science structured question.

Question: {question_data.get('stem', '')}
Parts: {json.dumps(question_data.get('parts', []))}
Student Answer: {student_answer}

Provide evaluation in JSON format:
{{
    "total_score": [0-{question_data.get('total_marks', 10)}],
    "max_score": {question_data.get('total_marks', 10)},
    "part_scores": {{"a": 0, "b": 0, "c": 0}},
    "feedback": "Detailed feedback on what was correct and what could be improved",
    "key_points_covered": ["list of correct points"],
    "missing_points": ["list of missing points"]
}}"""
            
            response = self._call_deepseek_api(prompt, "evaluation")
            
            if response:
                return {
                    "total_score": response.get('total_score', 0),
                    "max_score": question_data.get('total_marks', 10),
                    "part_scores": response.get('part_scores', {}),
                    "feedback": response.get('feedback', ''),
                    "key_points_covered": response.get('key_points_covered', []),
                    "missing_points": response.get('missing_points', [])
                }
            else:
                return self._fallback_structured_evaluation(question_data, student_answer)
                
        except Exception as e:
            logger.error(f"Error evaluating structured answer: {e}")
            return self._fallback_structured_evaluation(question_data, student_answer)
    
    def _fallback_structured_evaluation(self, question_data: Dict, student_answer: str) -> Dict:
        """Fallback evaluation using keyword matching"""
        total_score = 0
        max_score = question_data.get('total_marks', 10)
        answer_lower = student_answer.lower()
        
        for part in question_data.get('parts', []):
            expected = part.get('expected_answer', '').lower()
            keywords = expected.split()[:5]  # Get first 5 significant words
            
            matched = sum(1 for kw in keywords if kw in answer_lower)
            part_score = min(part.get('marks', 2), int(matched * part.get('marks', 2) / max(len(keywords), 1)))
            total_score += part_score
        
        return {
            "total_score": total_score,
            "max_score": max_score,
            "feedback": "Your answer has been evaluated based on key concepts. Review the model answers for complete understanding.",
            "key_points_covered": [],
            "missing_points": []
        }
    
    def _evaluate_essay_answer(self, question_data: Dict, student_answer: str) -> Dict:
        """Evaluate essay answer"""
        try:
            key_points = question_data.get('key_points', [])
            marking_criteria = question_data.get('marking_criteria', {})
            
            prompt = f"""Evaluate this Computer Science essay answer.

Question: {question_data.get('question', '')}
Key Points Expected: {json.dumps(key_points)}
Marking Criteria: {json.dumps(marking_criteria)}
Maximum Marks: {question_data.get('marks', 15)}

Student Answer: {student_answer}

Provide evaluation in JSON format:
{{
    "total_score": [0-{question_data.get('marks', 15)}],
    "max_score": {question_data.get('marks', 15)},
    "content_score": [0-8],
    "analysis_score": [0-4],
    "communication_score": [0-3],
    "feedback": "Detailed, constructive feedback",
    "strengths": ["list of strong points"],
    "areas_for_improvement": ["list of areas to improve"]
}}"""
            
            response = self._call_deepseek_api(prompt, "evaluation")
            
            if response:
                return response
            else:
                return {
                    "total_score": 0,
                    "max_score": question_data.get('marks', 15),
                    "feedback": "Unable to evaluate essay automatically. Please have a teacher review your answer.",
                    "strengths": [],
                    "areas_for_improvement": []
                }
                
        except Exception as e:
            logger.error(f"Error evaluating essay: {e}")
            return {
                "total_score": 0,
                "max_score": question_data.get('marks', 15),
                "feedback": "Unable to evaluate essay automatically.",
                "strengths": [],
                "areas_for_improvement": []
            }
    
    def get_topics(self) -> List[str]:
        """Get list of all Computer Science topics"""
        return list(self.topics.keys())
    
    def get_topic_info(self, topic: str) -> Dict:
        """Get detailed information about a topic"""
        return self.topics.get(topic, {})


# Global instance
computer_science_generator = ComputerScienceGenerator()
