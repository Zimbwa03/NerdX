"""
Combined Science Teacher Service - Professional AI Teacher
A conversational AI teacher for Biology, Chemistry, and Physics with personalized PDF note generation
"""

import logging
import json
import os
import re
from datetime import datetime
from typing import Dict, Optional, List
from utils.session_manager import session_manager
from services.whatsapp_service import WhatsAppService
from database.external_db import make_supabase_request, get_user_credits, deduct_credits, get_user_registration
from utils.credit_units import format_credits, units_to_credits
from services.advanced_credit_service import advanced_credit_service
from utils.deepseek import get_deepseek_chat_model

logger = logging.getLogger(__name__)
DEEPSEEK_CHAT_MODEL = get_deepseek_chat_model()

# Import Google GenAI SDK for Vertex AI (primary for conversational text)
try:
    from google import genai
    from google.genai.types import HttpOptions
    GENAI_AVAILABLE = True
except ImportError:
    genai = None
    HttpOptions = None
    GENAI_AVAILABLE = False

# Vertex AI configuration
GOOGLE_CLOUD_PROJECT = os.getenv('GOOGLE_CLOUD_PROJECT', 'gen-lang-client-0303273462')
USE_VERTEX_AI = os.getenv('GOOGLE_GENAI_USE_VERTEXAI', 'True').lower() == 'true'
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

# Import Gemini Interactions API Service for multimodal features
try:
    from services.gemini_interactions_service import get_gemini_interactions_service
    INTERACTIONS_API_AVAILABLE = True
except ImportError:
    get_gemini_interactions_service = None
    INTERACTIONS_API_AVAILABLE = False

# Import requests for DeepSeek API
import requests


class CombinedScienceTeacherService:
    """
    Professional AI Science Teacher for Biology, Chemistry, and Physics
    Provides personalized instruction and generates comprehensive PDF notes
    """
    
    def __init__(self):
        self.whatsapp_service = WhatsAppService()
        
        # Initialize DeepSeek AI as FALLBACK provider
        self.deepseek_api_key = os.getenv('DEEPSEEK_API_KEY')
        self.deepseek_api_url = 'https://api.deepseek.com/chat/completions'
        self._is_deepseek_configured = bool(self.deepseek_api_key)
        
        # Initialize Gemini via Vertex AI as PRIMARY provider
        self.gemini_client = None
        self._is_gemini_configured = False
        self._init_gemini_client()
        
        # Initialize Gemini Interactions Service for multimodal features
        self.interactions_service = None
        self._is_interactions_configured = False
        if INTERACTIONS_API_AVAILABLE:
            try:
                self.interactions_service = get_gemini_interactions_service()
                self._is_interactions_configured = self.interactions_service.is_available()
                if self._is_interactions_configured:
                    logger.info("✅ Gemini Interactions API configured for Teacher Mode")
            except Exception as e:
                logger.error(f"Error initializing Interactions API: {e}")
        
        if self._is_gemini_configured:
            logger.info("✅ Combined Science Teacher initialized with Gemini via Vertex AI (primary)")
        elif self._is_deepseek_configured:
            logger.warning("Gemini not available - using DeepSeek as primary")
        else:
            logger.warning("No AI services available")
    
    def _init_gemini_client(self):
        """Initialize Gemini client with Vertex AI or API key."""
        if not GENAI_AVAILABLE:
            return
        try:
            # Try Vertex AI first (higher rate limits)
            if USE_VERTEX_AI:
                os.environ['GOOGLE_GENAI_USE_VERTEXAI'] = 'True'
                
                # Check for credentials in common locations (Env Var, Local, Render Secrets)
                possible_paths = [
                    os.environ.get('GOOGLE_APPLICATION_CREDENTIALS'),
                    'google_credentials.json',
                    'credentials.json',
                    '/etc/secrets/google_credentials.json',  # Common for Render Secret Files
                    '/etc/secrets/credentials.json'
                ]
                
                credentials_path = None
                for path in possible_paths:
                    if path and os.path.exists(path):
                        credentials_path = path
                        break
                
                service_account_json = os.environ.get('GOOGLE_SERVICE_ACCOUNT_JSON')
                
                # CRITICAL FIX: Ensure GOOGLE_CLOUD_PROJECT isn't set to the full JSON string
                # If service_account_json is provided, extract project_id from it
                if service_account_json:
                    try:
                        creds_data = json.loads(service_account_json)
                        if 'project_id' in creds_data:
                            project_id = creds_data['project_id']
                            # Override env var to be just the ID, not the JSON or garbage
                            os.environ['GOOGLE_CLOUD_PROJECT'] = project_id
                            logger.info(f"✅ Extracted project_id '{project_id}' from service account JSON")
                    except json.JSONDecodeError:
                        logger.warning("GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON, cannot extract project_id")

                # Also sanitize GOOGLE_CLOUD_PROJECT if it looks suspicious (contains newlines or braces)
                current_project = os.environ.get('GOOGLE_CLOUD_PROJECT', '')
                if current_project and ('{' in current_project or '\n' in current_project):
                    logger.warning("GOOGLE_CLOUD_PROJECT contained invalid characters (likely JSON). parsing...")
                    try:
                        # Try to parse it as JSON just in case they put the JSON in the PROJECT var
                        proj_data = json.loads(current_project)
                        if 'project_id' in proj_data:
                            os.environ['GOOGLE_CLOUD_PROJECT'] = proj_data['project_id']
                            logger.info(f"✅ Fixed GOOGLE_CLOUD_PROJECT from JSON blob to '{proj_data['project_id']}'")
                    except:
                        # Just strip whitespace and hope?
                        logger.warning("Could not parse GOOGLE_CLOUD_PROJECT as JSON. It may be invalid.")

                
                if credentials_path:
                    # Set the env var to the found path so the library finds it
                    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credentials_path
                    self.gemini_client = genai.Client(http_options=HttpOptions(api_version="v1"))
                    self._is_gemini_configured = True
                    logger.info(f"Teacher Service: Gemini via Vertex AI configured (File: {credentials_path})")
                    return
                elif service_account_json:
                    import tempfile
                    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
                        f.write(service_account_json)
                        # Use absolute path for safety
                        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.path.abspath(f.name)
                    self.gemini_client = genai.Client(http_options=HttpOptions(api_version="v1"))
                    self._is_gemini_configured = True
                    logger.info("Teacher Service: Gemini via Vertex AI configured (Inline JSON)")
                    return
                else:
                    # Try ADC as last resort
                    try:
                        self.gemini_client = genai.Client(http_options=HttpOptions(api_version="v1"))
                        self._is_gemini_configured = True
                        logger.info("Teacher Service: Gemini via Vertex AI configured (ADC)")
                        return
                    except Exception as adc_error:
                        logger.warning(f"Vertex AI ADC init failed: {adc_error}")
            
            # Fallback to API key
            if GEMINI_API_KEY:
                self.gemini_client = genai.Client(api_key=GEMINI_API_KEY)
                self._is_gemini_configured = True
                logger.info("Teacher Service: Gemini configured with API key (fallback)")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini client: {e}")
    
    # Subject-specific teaching rules (O-Level and A-Level)
    SUBJECT_TEACHING_RULES = {
        'biology': """**Biology Teaching Rules:**
- Teach via structure → function → example → exam keywords.
- Use labelled descriptions and key terms.
- Train students to write marking-point answers.
- Use diagrams: [DIAGRAM: animal_cell], [DIAGRAM: plant_cell], [DIAGRAM: dna], [DIAGRAM: photosynthesis], [DIAGRAM: respiration], [DIAGRAM: neuron], [DIAGRAM: heart], [DIAGRAM: mitosis].

**O-Level Biology Topics:**
- Cell biology, transport mechanisms, enzymes, nutrition, respiration
- Reproduction, genetics, ecology, coordination, homeostasis

**A-Level Biology Topics (if A-Level):**
- Biological molecules (proteins, carbohydrates, lipids, nucleic acids)
- Cell structure & membrane transport (fluid mosaic model, active transport)
- Enzymes (kinetics, inhibition, Michaelis-Menten)
- Genetic information (DNA replication, transcription, translation)
- Biodiversity & classification, ecology & ecosystems
- Communication & homeostasis, nervous & hormonal coordination
- Immunity, infectious diseases, gene technology & biotechnology""",
        
        'chemistry': """**Chemistry Teaching Rules:**
- Use particle-level explanations.
- Show balanced equations clearly.
- For calculations: list "Given / Find / Formula / Substitute / Answer".
- Use diagrams: [DIAGRAM: atom_structure], [DIAGRAM: ionic_bond], [DIAGRAM: covalent_bond], [DIAGRAM: electrolysis], [DIAGRAM: energy_profile], [DIAGRAM: periodic_table].

**O-Level Chemistry Topics:**
- Atomic structure, bonding, chemical reactions, acids & bases
- Metals, electrolysis, organic chemistry basics

**A-Level Chemistry Topics (if A-Level):**
- Atomic structure & periodicity (electron configurations, ionization energies)
- Bonding (hybridization, molecular orbital theory, intermolecular forces)
- Energetics (enthalpy, Hess's Law, Born-Haber cycles, entropy, Gibbs free energy)
- Kinetics (rate equations, Arrhenius equation, catalysis)
- Equilibria (Kc, Kp, acids & bases, buffers, solubility product)
- Redox & electrochemistry (electrode potentials, electrochemical cells)
- Organic chemistry (mechanisms, stereochemistry, synthesis, spectroscopy)
- Transition metals (complexes, ligands, colour, catalysis)""",
        
        'physics': """**Physics Teaching Rules:**
- Start with the concept, then formula, then substitution.
- Always include units and direction/sign conventions.
- Emphasize diagrams (free body diagrams, ray diagrams, circuit symbols).
- Use `$...$` for inline equations and `$$...$$` for important formulas.
- Use diagrams: [DIAGRAM: ray_diagram], [DIAGRAM: circuit], [DIAGRAM: wave], [DIAGRAM: force_diagram], [DIAGRAM: magnetic_field].

**O-Level Physics Topics:**
- Mechanics (motion, forces, energy, pressure)
- Thermal physics, waves, electricity, magnetism, radioactivity

**A-Level Physics Topics (if A-Level):**
- Mechanics (kinematics, dynamics, circular motion, oscillations, SHM)
- Fields (gravitational, electric, magnetic, electromagnetic induction)
- Waves & optics (superposition, diffraction, interference, polarization)
- Thermal physics (kinetic theory, thermodynamics, heat engines)
- Electricity (capacitance, electromagnetic induction, AC circuits)
- Quantum physics (photoelectric effect, wave-particle duality, energy levels)
- Nuclear physics (radioactive decay, nuclear reactions, binding energy)
- Astrophysics & cosmology (if applicable)""",
        
        'mathematics': """**Mathematics Teaching Rules:**
- Always show working step-by-step.
- Use units and correct notation.
- Teach patterns: "When you see ___, do ___."
- Use LaTeX: `$...$` for inline, `$$...$$` for display math.
- Use graphs: [PLOT: function_expression] for visual representation.

**O-Level Mathematics Topics:**
- Number, algebra, geometry, mensuration, trigonometry, statistics, probability

**A-Level Pure Mathematics Topics (if A-Level):**
- Algebra & functions (partial fractions, modulus, polynomials)
- Coordinate geometry (parametric equations, polar coordinates)
- Sequences & series (arithmetic, geometric, binomial expansion)
- Trigonometry (identities, inverse functions, equations)
- Exponentials & logarithms (including natural log and e)
- Differentiation (chain, product, quotient rules, implicit, parametric)
- Integration (by substitution, by parts, partial fractions, differential equations)
- Vectors (3D, scalar product, vector equations of lines and planes)
- Numerical methods (iteration, Newton-Raphson, trapezium rule)"""
    }
    
    @classmethod
    def _build_subject_specific_prompt(cls, subject: str, grade_level: str, topic: str = None) -> str:
        """Build a dynamic system prompt based on the selected subject, grade level, and topic"""
        
        # Normalize subject name
        subject_lower = subject.lower()
        
        # Determine the exact subject being taught
        if 'biology' in subject_lower:
            subject_name = "Biology"
            subject_key = "biology"
        elif 'chemistry' in subject_lower:
            subject_name = "Chemistry"
            subject_key = "chemistry"
        elif 'physics' in subject_lower:
            subject_name = "Physics"
            subject_key = "physics"
        elif 'math' in subject_lower or 'pure' in subject_lower:
            subject_name = "Mathematics"
            subject_key = "mathematics"
        else:
            # Fallback for unknown subjects
            subject_name = subject.strip()
            subject_key = "biology"  # Default
        
        # Determine grade level display
        level_display = grade_level if grade_level else "O-Level"
        
        # Check if this is A-Level
        is_a_level = 'a-level' in (grade_level or '').lower() or 'a level' in (grade_level or '').lower() or 'a_level' in (subject or '').lower()
        
        # Get subject-specific teaching rules
        subject_rules = cls.SUBJECT_TEACHING_RULES.get(subject_key, cls.SUBJECT_TEACHING_RULES['biology'])
        
        # Build lesson format section based on level
        if is_a_level:
            lesson_format = f"""**ENHANCED A-LEVEL FORMAT** (A/A* Depth Required):
Unless the user asks otherwise, respond in this structure:

1) **Lesson Goal** (1–2 lines) - What student will achieve after the lesson

2) **Key Concepts & Definitions** (bullet with syllabus references [Syllabus: CAIE] or [Syllabus: ZIMSEC]) - Include proper terminology

3) **Core Theory** (structured with derivations/proofs where needed) - Build intuition → mathematics → exam application

4) **Derivations/Proofs** (step-by-step for A-Level depth) - Not just formulas, show WHERE they come from

5) **Exam-Style Worked Examples** (2–3 fully worked) - Show units, conventions, sign rules, and reasoning

6) **Common Mistakes & How to Avoid Them** - Examiner traps, sign errors, unit errors, notation errors

7) **Practice Set** (5 graded questions: 2 easy → 2 medium → 1 hard) + **Answers/Marking Points**

8) **Quick Summary** + "If you can do these, you're exam-ready..." checklist

9) **Next Steps** (what topic to learn next, synoptic links between topics)"""
        else:
            lesson_format = f"""Unless the user asks otherwise, respond in this structure:

**A. Goal (1 line)** - What the student will be able to do after the lesson.

**B. Key Idea (2–6 lines)** - Explain the core {subject_name} concept in simple language.

**C. Definitions & Formulae (if relevant)** - List only the needed formulas, define symbols.

**D. Step-by-step Method** - Numbered steps the student can copy in exams.

**E. Worked Example(s)** - Show full working, highlight common mistakes.

**F. Quick Check (Mini Quiz)** - 3–5 short {subject_name} questions.

**G. Study Tip (1–2 lines)** - A practical way to remember or avoid mistakes."""
        
        # Add A-Level specific instruction if applicable
        a_level_instruction = ""
        if is_a_level:
            # Determine syllabus alignment based on subject
            if subject_key == 'physics':
                syllabus_ref = "Cambridge International AS & A Level Physics 9702 (2025–2027) and ZIMSEC Forms 5–6 Physics"
            elif subject_key == 'chemistry':
                syllabus_ref = "Cambridge International AS & A Level Chemistry 9701 and ZIMSEC Forms 5–6 Chemistry"
            elif subject_key == 'biology':
                syllabus_ref = "Cambridge International AS & A Level Biology 9700 and ZIMSEC Forms 5–6 Biology (Syllabus 6030)"
            else:
                syllabus_ref = "Cambridge/ZIMSEC A-Level syllabi"
            
            a_level_instruction = f"""

## A-LEVEL SPECIFIC INSTRUCTION (A/A* DEPTH REQUIRED)
This student is studying **A-Level {subject_name}**. This is an advanced pre-university qualification aligned to **{syllabus_ref}**. 

### DEPTH RULE (A/A* Standard):
You MUST go beyond surface definitions. Include:
- **Key derivations**: Show step-by-step mathematical derivations where relevant (e.g., formulas, laws, relationships)
- **Assumptions**: State assumptions made in models and theories
- **Vector/sign conventions**: Always clarify direction conventions, sign rules, and coordinate systems
- **Unit checks**: Verify units in every calculation and explain dimensional analysis where needed
- **Exam command-word answers**: Teach how to answer "define", "describe", "explain", "derive", "calculate", "discuss"
- **Practical skills integration**: Include measurement techniques, graphing, uncertainty analysis, error propagation, significant figures, gradients, intercepts where relevant

### EXAM-STYLE TEACHING:
- Always include: **2-3 worked exam-style examples** + **5 graded practice questions** (Easy → Medium → Hard)
- Provide **marking guidance** showing what examiners look for
- Use **CAIE and ZIMSEC-style** question formats where applicable
- Label sections as [CAIE] or [ZIMSEC] when syllabi differ

### ENHANCED OUTPUT FORMAT (A-Level):
1) **Lesson Goal** (1–2 lines) - What student will achieve
2) **Key Concepts & Definitions** (bullet with syllabus references [Syllabus: CAIE] or [Syllabus: ZIMSEC])
3) **Core Theory** (structured with derivations/proofs where needed)
4) **Derivations/Proofs** (step-by-step for A-Level depth - not just formulas)
5) **Exam-Style Worked Examples** (2–3 fully worked with units, conventions, and reasoning)
6) **Common Mistakes & How to Avoid Them** (examiner traps, sign errors, unit errors)
7) **Practice Set** (5 graded questions: 2 easy → 2 medium → 1 hard) + **Answers/Marking Points**
8) **Quick Summary** + "If you can do these, you're exam-ready..." checklist
9) **Next Steps** (what topic to learn next, synoptic links)

### TONE & STYLE:
- **Calm, motivating, but strict** on units, symbols, and reasoning
- Use **SI units** unless question specifies otherwise
- Always **show working** - never give answers without steps
- Build **intuition → mathematics → exam application**
- When giving "what examiners want", explicitly state it's an **inference from past-paper patterns and examiner reports**

### PRACTICAL SKILLS (where relevant):
Include tips on: measurement techniques, graph plotting, uncertainty calculations, error analysis, significant figures, gradient/intercept determination, experimental design considerations"""
        
        # Build the comprehensive NerdX Teacher prompt
        prompt = f"""You are **NerdX Teacher**, a world-class AI teacher and study coach for **{level_display}** learners (ZIMSEC-friendly, but also internationally solid). You are teaching **{subject_name}** ONLY.

## 1) CRITICAL INSTRUCTION - SUBJECT BOUNDARY
You are ONLY a {subject_name} teacher. Do NOT teach any other subject (Biology, Chemistry, Physics, Mathematics, English, etc.) except {subject_name}.

If a student asks about a different subject, politely redirect them: "I'm your {subject_name} teacher. For questions about [other subject], please start a new session with that subject selected."

The student has already selected **{subject_name}**{f" and the topic **{topic}**" if topic else ""}. Do NOT ask them to choose a subject again. Jump directly into teaching.

## 2) Core Identity
- You are a **professional teacher + examiner + tutor + mentor** in one.
- You are calm, encouraging, and serious about results.
- You teach using **simple English** first, then introduce proper terms.
- You adapt to the student's level: **beginner → intermediate → advanced**.
- You ONLY teach {subject_name} - stay within this subject at all times.

## 3) Teaching Mission
For every student request, your mission is to:
1. Diagnose what the student knows and doesn't know about {subject_name}.
2. Teach the {subject_name} concept in a clear structure.
3. Give worked examples (where needed).
4. Give practice questions and mark them.
5. Give feedback and a personal improvement plan.

## 4) Default Teaching Style
- Use a **friendly teacher tone**: firm but supportive.
- Keep explanations **clean and step-by-step**.
- Use headings, short paragraphs, and bullet points.
- Use analogies from **Zimbabwe/Africa real life** when helpful (e.g., farming, kombi routes, mobile data bundles, markets, school life).
- Never shame the student; correct gently and confidently.
- ALWAYS stay within {subject_name} topics.

## 5) Lesson Format (Default Response Structure)
{lesson_format}

## 6) Socratic Mode (When the student is learning actively)
If the student seems engaged:
- Ask guiding questions about {subject_name}.
- Wait for their attempt.
- Correct step-by-step.
- Praise the process ("Nice approach"), not intelligence.

## 7) Examiner Mode (ZIMSEC-style marking)
When the student says "mark this", "is it correct?", or sends work:
- Mark strictly but fairly.
- Indicate: **Correct ✅ / Incorrect ❌**
- Explain *why*.
- Show the correct method.
- Give a score estimate and improvement advice.

## 8) Adaptive Difficulty Rule
- If student struggles: simplify, use smaller steps, more examples.
- If student is strong: increase difficulty, add exam shortcuts, deeper reasoning.

## 9) {subject_name} Teaching Rules
{subject_rules}

## 10) Visualizations (Graphs & Animations)
When a concept is best explained with a **graph**, include:
`[PLOT: function_expression]`

Examples:
- `[PLOT: 2x + 3]`
- `[PLOT: sin(x), range=-2pi:2pi]`
- `[PLOT: exp(x), range=-3:3]`
IMPORTANT: Inside `[PLOT: ...]`, use a plain ASCII expression (no `$...$` or LaTeX commands).

For diagrams, include:
`[DIAGRAM: diagram_type]`

The app will automatically generate and attach visuals for the student.

## 11) Practice & Mastery Rules
After teaching, always offer:
- 3 quick questions (easy)
- 2 medium questions
- 1 hard/exam question
Then offer to mark their answers.

## 12) Mode Commands the student can use
- **"Teach Mode"** → full lesson with examples
- **"Quick Help"** → shortest answer + 1 example
- **"Exam Mode"** → exam-style response + marking points
- **"Quiz Me"** → questions only, no answers until requested
- **"Mark This"** → strict marking + corrections
- **"Explain Like I'm 12"** → very simple + analogy
- **"Harder"** → increase difficulty
- **"Simplify"** → slower, easier steps

## 13) Closing Habit
End responses with one line:
- "Send your answers and I'll mark them ✅" or
- "Want exam-style questions or more worked examples?"

## 14) Personalized Notes (PDF)
When the student requests "Generate notes" or "Save this lesson as notes," create VERY DETAILED notes in JSON format:

{{
  "title": "Topic title here",
  "subject": "{subject_name}",
  "grade_level": "{level_display}",
  "learning_objectives": [
    "Detailed objective 1 with context",
    "Detailed objective 2 with context",
    "Detailed objective 3 with context",
    "Detailed objective 4 with context"
  ],
  "key_concepts": {{
    "concept1": "Comprehensive definition with detailed explanation and examples",
    "concept2": "Comprehensive definition with detailed explanation and examples",
    "concept3": "Comprehensive definition with detailed explanation and examples",
    "concept4": "Comprehensive definition with detailed explanation and examples",
    "concept5": "Comprehensive definition with detailed explanation and examples"
  }},
  "detailed_explanation": "VERY COMPREHENSIVE, LONG, step-by-step explanation of the topic. Include: Introduction with background context (2-3 paragraphs), Detailed breakdown of each component (multiple paragraphs per component), Step-by-step processes with explanations (be thorough), Multiple examples with full explanations, Diagrams described in words, Common misconceptions addressed, Connections to related topics, At least 500-800 words of detailed, well-structured content covering everything about the topic",
  "real_world_applications": [
    "Detailed application 1 with full explanation of how it works in real life",
    "Detailed application 2 with full explanation of how it works in real life",
    "Detailed application 3 with full explanation of how it works in real life",
    "Detailed application 4 with full explanation of how it works in real life"
  ],
  "summary": "Comprehensive summary of all key takeaways (3-4 paragraphs)",
  "revision_schedule": {{
    "day_3": "Detailed review plan for day 3 with specific topics to revisit",
    "day_7": "Detailed practice plan for day 7 with specific exercises and concepts"
  }},
  "references": [
    "ZIMSEC Syllabus - Specific section",
    "Relevant textbook chapters",
    "Scientific sources"
  ]
}}

CRITICAL: Make the notes VERY DETAILED with LONG, WELL-STRUCTURED TEXT. The "detailed_explanation" field should be comprehensive (500-800 words minimum), covering EVERYTHING about the topic in depth. Break down information thoroughly with multiple paragraphs. Students should be able to learn the entire topic from these notes alone.

When a student says "generate notes", "save notes", "create notes", or similar, respond ONLY with valid JSON in the above format, nothing else.
{a_level_instruction}

Current conversation context will be provided with each message."""
        
        return prompt

    def show_main_menu(self, user_id: str):
        """Display the Combined Science main menu with Teacher/Practice options"""
        try:
            menu_text = "🔬 *Combined Science*\n"
            menu_text += "─────────────────────\n\n"
            menu_text += "Choose your learning mode:\n\n"
            menu_text += "👨‍🏫 *Teacher Mode*\n"
            menu_text += "Get personalized lessons from an AI teacher in Biology, Chemistry, or Physics. "
            menu_text += "The teacher will explain topics clearly and generate comprehensive PDF notes for you.\n\n"
            menu_text += "📝 *Practice Mode*\n"
            menu_text += "Test your knowledge with practice questions and quizzes."
            
            buttons = [
                {"text": "👨‍🏫 Teacher Mode", "callback_data": "science_teacher_mode"},
                {"text": "📝 Practice Mode", "callback_data": "science_practice_mode"},
                {"text": "🔙 Main Menu", "callback_data": "main_menu"}
            ]
            
            self.whatsapp_service.send_interactive_message(user_id, menu_text, buttons)
            
        except Exception as e:
            logger.error(f"Error showing Combined Science menu for {user_id}: {e}")
            self.whatsapp_service.send_message(
                user_id,
                "Sorry, I encountered an error. Please try again."
            )
    
    def start_teacher_mode(self, user_id: str):
        """Start teacher mode - ask for subject and topic selection"""
        try:
            # CRITICAL: Check if user has zero credits - block access immediately
            current_credits = get_user_credits(user_id)
            if current_credits <= 0:
                insufficient_msg = """💰 *Need More Credits!* 💰

🎓 *Combined Science Teacher Mode*

🚫 *Access Denied*
You have 0 credits. Teacher Mode requires credits to use.

🎯 *Teacher Mode Benefits:*
• AI-powered personalized teaching
• Interactive Q&A sessions
• Professional PDF notes
• Biology, Chemistry & Physics topics
• ZIMSEC exam-focused content

💎 *Get More Credits:*"""
                
                buttons = [
                    {"text": "💰 Buy Credits", "callback_data": "credit_store"},
                    {"text": "👥 Invite Friends (+5 each)", "callback_data": "share_to_friend"},
                    {"text": "🏠 Main Menu", "callback_data": "combined_science"}
                ]
                
                self.whatsapp_service.send_interactive_message(user_id, insufficient_msg, buttons)
                return
            
            # Initialize new teaching session
            session_manager.set_data(user_id, 'science_teacher', {
                'active': True,
                'awaiting': 'subject_selection',
                'conversation_history': [],
                'started_at': datetime.now().isoformat()
            })
            
            message = "👨‍🏫 *Welcome to Teacher Mode!*\n\n"
            message += "I'm your professional Combined Science teacher, ready to help you learn!\n\n"
            message += "Which subject would you like to study today?"
            
            buttons = [
                {"text": "🧬 Biology", "callback_data": "science_subject_biology"},
                {"text": "⚗️ Chemistry", "callback_data": "science_subject_chemistry"},
                {"text": "⚛️ Physics", "callback_data": "science_subject_physics"},
                {"text": "🔙 Back", "callback_data": "combined_science"}
            ]
            
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)
            
        except Exception as e:
            logger.error(f"Error starting teacher mode for {user_id}: {e}")
            self.whatsapp_service.send_message(
                user_id,
                "Sorry, I encountered an error. Please try again."
            )
    
    def select_subject(self, user_id: str, subject: str):
        """Handle subject selection and ask for grade level"""
        try:
            session_data = session_manager.get_data(user_id, 'science_teacher') or {}
            session_data['subject'] = subject
            session_data['awaiting'] = 'grade_level'
            session_manager.set_data(user_id, 'science_teacher', session_data)
            
            subject_emoji = {
                'Biology': '🧬',
                'Chemistry': '⚗️',
                'Physics': '⚛️'
            }
            
            message = f"{subject_emoji.get(subject, '🔬')} *{subject} Selected!*\n\n"
            message += "What is your grade level or learning stage?"
            
            buttons = [
                {"text": "📘 Form 1-2", "callback_data": "science_grade_form12"},
                {"text": "📗 Form 3-4 (O-Level)", "callback_data": "science_grade_olevel"},
                {"text": "📕 A-Level", "callback_data": "science_grade_alevel"},
                {"text": "🔙 Back", "callback_data": "science_teacher_mode"}
            ]
            
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)
            
        except Exception as e:
            logger.error(f"Error selecting subject for {user_id}: {e}")
    
    def select_grade_level(self, user_id: str, grade_level: str):
        """Handle grade level selection and ask for topic"""
        try:
            session_data = session_manager.get_data(user_id, 'science_teacher') or {}
            session_data['grade_level'] = grade_level
            session_data['awaiting'] = 'topic_selection'
            session_manager.set_data(user_id, 'science_teacher', session_data)
            
            subject = session_data.get('subject', 'Science')
            
            message = f"📚 *{grade_level} {subject}*\n\n"
            message += "Great! Now, what topic would you like to learn about?\n\n"
            message += "You can:\n"
            message += "• Type a specific topic (e.g., 'Photosynthesis', 'Acids and Bases', 'Motion')\n"
            message += "• Ask me to pick a random topic\n"
            message += "• Ask me to suggest topics for your level"
            
            buttons = [
                {"text": "🎲 Random Topic", "callback_data": "science_random_topic"},
                {"text": "💡 Suggest Topics", "callback_data": "science_suggest_topics"},
                {"text": "🔙 Back", "callback_data": "science_teacher_mode"}
            ]
            
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)
            
        except Exception as e:
            logger.error(f"Error selecting grade level for {user_id}: {e}")
    
    def handle_random_topic(self, user_id: str):
        """Pick a random topic based on subject and grade level"""
        try:
            session_data = session_manager.get_data(user_id, 'science_teacher') or {}
            subject = session_data.get('subject', 'Science')
            grade_level = session_data.get('grade_level', 'O-Level')
            
            # Use DeepSeek to pick a random topic (primary)
            if self._is_deepseek_configured:
                prompt = f"Pick one random important topic for {grade_level} {subject} that ZIMSEC students should learn. Respond with ONLY the topic name, nothing else."
                
                try:
                    response = requests.post(
                        self.deepseek_api_url,
                        headers={'Authorization': f'Bearer {self.deepseek_api_key}', 'Content-Type': 'application/json'},
                        json={'model': DEEPSEEK_CHAT_MODEL, 'messages': [{'role': 'user', 'content': prompt}], 'max_tokens': 100},
                        timeout=15
                    )
                    if response.status_code == 200:
                        topic = response.json()['choices'][0]['message']['content'].strip()
                        self.start_teaching_session(user_id, topic)
                        return
                except Exception as e:
                    logger.error(f"DeepSeek error picking random topic: {e}")
            
            # Fallback to static topics
            fallback_topics = {
                'Biology': ['Cell Structure', 'Photosynthesis', 'Digestion', 'Respiration'],
                'Chemistry': ['Atomic Structure', 'Chemical Bonding', 'Acids and Bases', 'Periodic Table'],
                'Physics': ['Forces and Motion', 'Energy', 'Electricity', 'Waves']
            }
            import random
            topic = random.choice(fallback_topics.get(subject, ['General Science']))
            self.start_teaching_session(user_id, topic)
        
        except Exception as e:
            logger.error(f"Error handling random topic for {user_id}: {e}")
    
    def suggest_topics(self, user_id: str):
        """Suggest relevant topics based on subject and grade level"""
        try:
            session_data = session_manager.get_data(user_id, 'science_teacher') or {}
            subject = session_data.get('subject', 'Science')
            grade_level = session_data.get('grade_level', 'O-Level')
            
            # Use DeepSeek to suggest topics (primary)
            if self._is_deepseek_configured:
                prompt = f"List 5 important topics for {grade_level} {subject} that ZIMSEC students should learn. Format as a simple numbered list."
                
                try:
                    response = requests.post(
                        self.deepseek_api_url,
                        headers={'Authorization': f'Bearer {self.deepseek_api_key}', 'Content-Type': 'application/json'},
                        json={'model': DEEPSEEK_CHAT_MODEL, 'messages': [{'role': 'user', 'content': prompt}], 'max_tokens': 300},
                        timeout=20
                    )
                    if response.status_code == 200:
                        suggestions = response.json()['choices'][0]['message']['content'].strip()
                        message = f"📚 *Suggested {subject} Topics for {grade_level}:*\n\n"
                        message += suggestions
                        message += "\n\n💬 Type any topic name to start learning!"
                        self.whatsapp_service.send_message(user_id, message)
                        return
                except Exception as e:
                    logger.error(f"DeepSeek error suggesting topics: {e}")
            
            # Fallback to static topic suggestions
            self._send_fallback_topic_suggestions(user_id, subject, grade_level)
        
        except Exception as e:
            logger.error(f"Error suggesting topics for {user_id}: {e}")
    
    def _send_fallback_topic_suggestions(self, user_id: str, subject: str, grade_level: str):
        """Send fallback topic suggestions when AI is unavailable"""
        topic_suggestions = {
            'Biology': [
                '1. Cell Structure and Function',
                '2. Photosynthesis and Respiration',
                '3. Human Digestive System',
                '4. Genetics and Inheritance',
                '5. Evolution and Natural Selection'
            ],
            'Chemistry': [
                '1. Atomic Structure and Bonding',
                '2. Periodic Table and Elements',
                '3. Acids, Bases, and Salts',
                '4. Chemical Reactions and Equations',
                '5. Organic Chemistry Basics'
            ],
            'Physics': [
                '1. Forces and Motion',
                '2. Energy and Work',
                '3. Electricity and Circuits',
                '4. Waves and Sound',
                '5. Light and Optics'
            ]
        }
        
        suggestions = topic_suggestions.get(subject, ['General Science Topics'])
        message = f"📚 *Suggested {subject} Topics for {grade_level}:*\n\n"
        message += '\n'.join(suggestions)
        message += "\n\n💬 Type any topic name to start learning!"
        
        self.whatsapp_service.send_message(user_id, message)
    
    def start_teaching_session(self, user_id: str, topic: str):
        """Start teaching a specific topic"""
        try:
            session_data = session_manager.get_data(user_id, 'science_teacher') or {}
            
            # Hybrid Model: Determine if this is a new session or continuation
            conversation_history = session_data.get('conversation_history', [])
            is_new_session = len(conversation_history) == 0
            
            # Check and deduct credits (per AI response)
            if is_new_session:
                # Starting new session - per response cost
                credit_result = advanced_credit_service.check_and_deduct_credits(
                    user_id, 'teacher_mode_start'
                )
            else:
                # Follow-up question - per response cost
                credit_result = advanced_credit_service.check_and_deduct_credits(
                    user_id, 'teacher_mode_followup'
                )
            
            # Handle insufficient credits
            if not credit_result.get('success'):
                insufficient_msg = f"""💰 *Need More Credits!* 💰

🎓 *Combined Science Teacher Mode*
📖 Topic: {topic}

💳 *Credit Status:*
{credit_result.get('message', 'Insufficient credits')}

🎯 *Teacher Mode Benefits:*
• AI-powered personalized teaching
• Interactive Q&A sessions
• Professional PDF notes
• Biology, Chemistry & Physics topics
• ZIMSEC exam-focused content

💎 *Get More Credits:*"""
                
                buttons = [
                    {"text": "💰 Buy Credits", "callback_data": "credit_store"},
                    {"text": "👥 Invite Friends (+5 each)", "callback_data": "share_to_friend"},
                    {"text": "🏠 Main Menu", "callback_data": "main_menu"}
                ]
                
                self.whatsapp_service.send_interactive_message(user_id, insufficient_msg, buttons)
                return
            
            # Update session data
            session_data['topic'] = topic
            session_data['awaiting'] = 'conversation'
            if is_new_session:
                session_data['conversation_history'] = []
            session_manager.set_data(user_id, 'science_teacher', session_data)
            
            subject = session_data.get('subject', 'Science')
            grade_level = session_data.get('grade_level', 'O-Level')
            
            # Get initial teaching from AI (DeepSeek primary, Gemini fallback)
            if self._is_deepseek_configured or self._is_gemini_configured:
                initial_message = f"Start teaching {topic} to a {grade_level} student studying {subject}. Begin with a warm greeting and introduction to the topic."
                
                response_text = self._get_gemini_teaching_response(user_id, initial_message, session_data)
                visual_result = self._apply_visual_triggers(response_text, user_id, session_data)
                response_text = visual_result.get("clean_text", response_text)
                # Clean formatting for WhatsApp (convert ** to *)
                response_text = self._clean_whatsapp_formatting(response_text)
                
                # Get current credits and show credit status
                current_credits = get_user_credits(user_id)
                credits_used = advanced_credit_service.get_credit_cost(
                    'teacher_mode_start' if is_new_session else 'teacher_mode_followup'
                )
                
                # Add helpful instructions with credit info
                message = f"📖 *Topic: {topic}*\n\n{response_text}\n\n"
                message += "─────────────────────\n"
                message += "💬 Ask me questions or type *'generate notes'* when ready for PDF notes!\n"
                message += "📤 Type *'exit'* to leave Teacher Mode\n\n"
                message += f"💳 *Credits:* {format_credits(current_credits)} (Used: {format_credits(credits_used)})"
                
                self.whatsapp_service.send_message(user_id, message)
                self._send_teacher_mode_visuals(user_id, (visual_result or {}).get("media_urls"))
            else:
                self._send_fallback_teaching(user_id, topic, subject, grade_level)
        
        except Exception as e:
            logger.error(f"Error starting teaching session for {user_id}: {e}")
    
    def handle_conversation(self, user_id: str, message_text: str):
        """Handle ongoing teaching conversation"""
        try:
            session_data = session_manager.get_data(user_id, 'science_teacher') or {}
            
            # Check if user wants to exit/leave Teacher Mode (exact matches or specific phrases only)
            message_lower = message_text.lower().strip()
            exit_commands = [
                'exit', 'leave', 'stop', 'quit', 'back', 
                'main menu', 'go back', 'return', 'exit teacher mode',
                'leave teacher mode', 'go to main menu', 'back to menu'
            ]
            if message_lower in exit_commands:
                self.exit_teacher_mode(user_id)
                return
            
            # Check if user wants to generate notes
            if any(keyword in message_text.lower() for keyword in ['generate notes', 'save notes', 'create notes', 'make notes', 'notes pdf']):
                self.generate_notes(user_id)
                return
            
            # CRITICAL: Check if user has zero credits before processing conversation
            current_credits = get_user_credits(user_id)
            if current_credits <= 0:
                insufficient_msg = """💰 *Need More Credits!* 💰

🎓 *Combined Science Teacher Mode*

🚫 *Access Denied*
You have 0 credits. Teacher Mode requires credits to use.

💎 *Get More Credits:*"""
                
                buttons = [
                    {"text": "💰 Buy Credits", "callback_data": "credit_store"},
                    {"text": "👥 Invite Friends (+5 each)", "callback_data": "share_to_friend"},
                    {"text": "🏠 Main Menu", "callback_data": "combined_science"}
                ]
                
                self.whatsapp_service.send_interactive_message(user_id, insufficient_msg, buttons)
                # Clear the session since user has no credits
                session_manager.clear_session(user_id, 'science_teacher')
                return
            
            # Per-response billing for follow-up question
            credit_result = advanced_credit_service.check_and_deduct_credits(
                user_id, 'teacher_mode_followup'
            )
            
            # Handle insufficient credits
            if not credit_result.get('success'):
                insufficient_msg = f"""💰 *Need More Credits!* 💰

🎓 *Combined Science Teacher Mode*
💬 Follow-up Question

💳 *Credit Status:*
{credit_result.get('message', 'Insufficient credits')}

🎯 *Teacher Mode Benefits:*
• AI-powered personalized teaching
• Interactive Q&A sessions
• Professional PDF notes
• ZIMSEC exam-focused content

💎 *Get More Credits:*"""
                
                buttons = [
                    {"text": "💰 Buy Credits", "callback_data": "credit_store"},
                    {"text": "👥 Invite Friends (+5 each)", "callback_data": "share_to_friend"},
                    {"text": "🏠 Main Menu", "callback_data": "main_menu"}
                ]
                
                self.whatsapp_service.send_interactive_message(user_id, insufficient_msg, buttons)
                return
            
            # Add user message to history
            conversation_history = session_data.get('conversation_history', [])
            conversation_history.append({
                'role': 'user',
                'content': message_text
            })
            
            # Get AI response (DeepSeek primary, Gemini fallback)
            if self._is_deepseek_configured or self._is_gemini_configured:
                response_text = self._get_gemini_teaching_response(user_id, message_text, session_data)
                
                # Add AI response to history
                conversation_history.append({
                    'role': 'assistant',
                    'content': response_text
                })
                
                # Keep last 20 messages
                session_data['conversation_history'] = conversation_history[-20:]
                session_manager.set_data(user_id, 'science_teacher', session_data)
                
                visual_result = self._apply_visual_triggers(response_text, user_id, session_data)
                clean_response = visual_result.get("clean_text", response_text)
                # Clean formatting for WhatsApp (convert ** to *)
                clean_response = self._clean_whatsapp_formatting(clean_response)
                
                # Get current credits and add to response
                current_credits = get_user_credits(user_id)
                cost = advanced_credit_service.get_credit_cost('teacher_mode_followup')
                clean_response += f"\n\n💳 *Credits:* {format_credits(current_credits)} (Used: {format_credits(cost)})"
                
                self.whatsapp_service.send_message(user_id, clean_response)
                self._send_teacher_mode_visuals(user_id, (visual_result or {}).get("media_urls"))
            else:
                self._send_fallback_response(user_id, message_text, session_data)
        
        except Exception as e:
            logger.error(f"Error handling conversation for {user_id}: {e}")
            self.whatsapp_service.send_message(
                user_id,
                "Sorry, I encountered an error. Please try again."
            )
    
    def _clean_whatsapp_formatting(self, text: str) -> str:
        """Clean formatting for WhatsApp - convert double asterisks to single for bold"""
        # Replace **text** with *text* (WhatsApp bold format)
        # Use a regex to avoid replacing single asterisks
        cleaned = re.sub(r'\*\*([^\*]+?)\*\*', r'*\1*', text)
        return cleaned

    def _apply_visual_triggers(self, response_text: str, user_id: str, session_data: dict) -> Dict:
        """Handle [PLOT: ...] and [DIAGRAM: ...] tags and return cleaned text + media URLs."""
        clean_text = response_text or ""
        media_urls = {'graph_url': None, 'video_url': None}

        if '[PLOT:' in clean_text:
            try:
                from services.teacher_visualization_service import handle_teacher_plot_trigger

                user_data = get_user_registration(user_id)
                user_name = user_data.get('name', 'Student') if user_data else 'Student'
                title = f"{session_data.get('subject', 'Teacher Mode')} â€¢ {session_data.get('topic', 'Lesson')}".strip(" â€¢")

                vis = handle_teacher_plot_trigger(
                    response_text=clean_text,
                    user_id=user_id,
                    user_name=user_name,
                    title=title,
                )
                clean_text = vis.get('clean_text') or clean_text
                media_urls['graph_url'] = vis.get('graph_url')
                media_urls['video_url'] = vis.get('video_url')
            except Exception as e:
                logger.error(f"Error checking PLOT media triggers: {e}", exc_info=True)
                clean_text = re.sub(r'\[PLOT:.*?\]', '', clean_text).strip()

        if '[DIAGRAM:' in clean_text:
            try:
                from services.teacher_visualization_service import handle_teacher_diagram_trigger

                diagram_vis = handle_teacher_diagram_trigger(
                    response_text=clean_text,
                    user_id=user_id,
                    subject_hint=session_data.get('subject', ''),
                )
                clean_text = diagram_vis.get('clean_text') or clean_text
                if diagram_vis.get('video_url') and not media_urls.get('video_url'):
                    media_urls['video_url'] = diagram_vis.get('video_url')
            except Exception as e:
                logger.error(f"Error checking DIAGRAM media triggers: {e}", exc_info=True)
                clean_text = re.sub(r'\[DIAGRAM:.*?\]', '', clean_text).strip()

        return {"clean_text": clean_text, "media_urls": media_urls}

    def _send_teacher_mode_visuals(self, user_id: str, media_urls: Dict[str, Optional[str]]):
        """Send Matplotlib graphs or Manim videos via WhatsApp when available."""
        if not media_urls:
            return

        graph_url = media_urls.get('graph_url')
        if graph_url:
            try:
                if graph_url.startswith(('http://', 'https://')):
                    self.whatsapp_service.send_image(user_id, graph_url, "ðŸ“Š Graph visual")
                else:
                    local_path = graph_url.lstrip("/")
                    if os.path.exists(local_path):
                        sent = self.whatsapp_service.send_image_file(user_id, local_path, "ðŸ“Š Graph visual")
                        if not sent:
                            from utils.url_utils import convert_local_path_to_public_url
                            public_url = convert_local_path_to_public_url(local_path)
                            if public_url:
                                self.whatsapp_service.send_image(user_id, public_url, "ðŸ“Š Graph visual")
            except Exception as e:
                logger.warning(f"Failed to send graph visual to {user_id}: {e}")

        video_url = media_urls.get('video_url')
        if video_url:
            try:
                if video_url.startswith(('http://', 'https://')):
                    self.whatsapp_service.send_media_url(user_id, video_url, "ðŸŽžï¸ Manim animation")
                else:
                    local_path = video_url.lstrip("/")
                    if os.path.exists(local_path):
                        self.whatsapp_service.send_video_file(user_id, local_path, "ðŸŽžï¸ Manim animation")
                    else:
                        from utils.url_utils import convert_local_path_to_public_url
                        public_url = convert_local_path_to_public_url(local_path)
                        if public_url:
                            self.whatsapp_service.send_media_url(user_id, public_url, "ðŸŽžï¸ Manim animation")
            except Exception as e:
                logger.warning(f"Failed to send animation to {user_id}: {e}")

    def _clean_research_text(self, text: str) -> str:
        """Clean and format research text for mobile"""
        import re
        
        if not text:
            return ""
            
        # 1. Remove artifacts
        text = text.replace('***', '')
        text = text.replace('##', '') # Remove markdown headers hash
        
        # 2. Format citations: [1] -> (1)
        # This makes them look less like broken links
        text = re.sub(r'\[(\d+)\]', r'(\1)', text)
        
        # 3. Use standard formatted cleaning (convert ** to *)
        text = self._clean_whatsapp_formatting(text)
        
        return text
    
    def _get_gemini_teaching_response(self, user_id: str, message_text: str, session_data: dict) -> str:
        """Get teaching response - uses Gemini as primary, DeepSeek as fallback"""
        try:
            # Build context
            subject = session_data.get('subject', 'Science')
            grade_level = session_data.get('grade_level', 'O-Level')
            topic = session_data.get('topic', 'General Science')
            conversation_history = session_data.get('conversation_history', [])
            
            # Build dynamic system prompt based on the selected subject, grade level, and topic
            system_prompt = self._build_subject_specific_prompt(subject, grade_level, topic)
            
            # Build conversation context
            context = f"Subject: {subject}\nGrade Level: {grade_level}\nTopic: {topic}\n\n"
            
            # Add recent conversation history
            if conversation_history:
                context += "Recent conversation:\n"
                for msg in conversation_history[-10:]:
                    role = "Student" if msg['role'] == 'user' else "You"
                    context += f"{role}: {msg['content']}\n"
            
            # Create full prompt
            full_prompt = f"{context}\n\nStudent's message: {message_text}\n\nYour response:"
            
            # Try Gemini FIRST (primary provider via Vertex AI)
            if self._is_gemini_configured and self.gemini_client:
                try:
                    full_gemini_prompt = f"{system_prompt}\n\n{full_prompt}"
                    response = self.gemini_client.models.generate_content(
                        model="gemini-2.5-flash",
                        contents=full_gemini_prompt,
                        config={"temperature": 0.7, "max_output_tokens": 2000}
                    )
                    if response and response.text:
                        logger.info(f"✅ Gemini via Vertex AI generated teaching response for {user_id} (Subject: {subject})")
                        return response.text.strip()
                except Exception as gemini_error:
                    logger.error(f"Gemini API error for {user_id}: {gemini_error}")
            
            # Try DeepSeek as fallback ONLY if Gemini fails
            if self._is_deepseek_configured:
                try:
                    response = requests.post(
                        self.deepseek_api_url,
                        headers={
                            'Content-Type': 'application/json',
                            'Authorization': f'Bearer {self.deepseek_api_key}'
                        },
                        json={
                            'model': DEEPSEEK_CHAT_MODEL,
                            'messages': [
                                {'role': 'system', 'content': system_prompt},
                                {'role': 'user', 'content': full_prompt}
                            ],
                            'temperature': 0.7,
                            'max_tokens': 2000
                        },
                        timeout=60
                    )
                    
                    if response.status_code == 200:
                        data = response.json()
                        if 'choices' in data and len(data['choices']) > 0:
                            ai_text = data['choices'][0]['message']['content'].strip()
                            logger.info(f"✅ DeepSeek AI fallback generated teaching response for {user_id} (Subject: {subject})")
                            return ai_text
                except Exception as deepseek_error:
                    logger.error(f"DeepSeek API fallback error for {user_id}: {deepseek_error}")
            
            # Final fallback
            return self._get_fallback_teaching_response(message_text, session_data)
            
        except Exception as e:
            logger.error(f"Error getting AI teaching response: {e}", exc_info=True)
            return self._get_fallback_teaching_response(message_text, session_data)
    
    def _try_deepseek_teaching_fallback(self, user_id: str, message_text: str, session_data: dict, prompt: str) -> str:
        """Try DeepSeek AI as fallback when Gemini fails"""
        try:
            import os
            import requests
            deepseek_key = os.getenv('DEEPSEEK_API_KEY')
            if not deepseek_key:
                logger.warning("DeepSeek API key not available for fallback")
                return self._get_fallback_teaching_response(message_text, session_data)
            
            # Build dynamic system prompt
            subject = session_data.get('subject', 'Science')
            grade_level = session_data.get('grade_level', 'O-Level')
            topic = session_data.get('topic', 'General Science')
            system_prompt = self._build_subject_specific_prompt(subject, grade_level, topic)
            
            # Call DeepSeek API
            response = requests.post(
                'https://api.deepseek.com/chat/completions',
                headers={
                    'Content-Type': 'application/json',
                    'Authorization': f'Bearer {deepseek_key}'
                },
                json={
                    'model': DEEPSEEK_CHAT_MODEL,
                    'messages': [
                        {'role': 'system', 'content': system_prompt},
                        {'role': 'user', 'content': prompt}
                    ],
                    'temperature': 0.7,
                    'max_tokens': 2000
                },
                timeout=60
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'choices' in data and len(data['choices']) > 0:
                    ai_text = data['choices'][0]['message']['content'].strip()
                    logger.info(f"✅ DeepSeek AI fallback generated teaching response for {user_id} (Subject: {subject})")
                    return ai_text
            
            logger.warning("DeepSeek fallback failed, using basic fallback")
            return self._get_fallback_teaching_response(message_text, session_data)
        except Exception as e:
            logger.error(f"DeepSeek fallback error: {e}")
            return self._get_fallback_teaching_response(message_text, session_data)
    
    def _get_fallback_teaching_response(self, message_text: str, session_data: dict) -> str:
        """Fallback response when AI is unavailable"""
        topic = session_data.get('topic', 'this topic')
        return f"I'm having trouble connecting to my AI teacher. However, I can tell you that {topic} is an important concept in science. Please try asking your question again, or type 'generate notes' to create study materials."
    
    def _send_fallback_teaching(self, user_id: str, topic: str, subject: str, grade_level: str):
        """Send fallback teaching content when AI is unavailable"""
        message = f"📖 *Topic: {topic}*\n\n"
        message += f"Welcome to {subject} at {grade_level}!\n\n"
        message += f"Today we'll be learning about {topic}. This is an important concept that you'll need to understand.\n\n"
        message += "Unfortunately, my AI teacher is currently unavailable, but you can still:\n"
        message += "• Ask me questions about the topic\n"
        message += "• Request 'generate notes' to create study materials\n"
        message += "• Practice your understanding\n\n"
        message += "How can I help you with this topic?"
        
        self.whatsapp_service.send_message(user_id, message)
    
    def _send_fallback_response(self, user_id: str, message_text: str, session_data: dict):
        """Send fallback response when AI teaching is unavailable"""
        response = self._get_fallback_teaching_response(message_text, session_data)
        self.whatsapp_service.send_message(user_id, response)
    
    def generate_notes(self, user_id: str):
        """Generate PDF notes for the current teaching session"""
        try:
            session_data = session_manager.get_data(user_id, 'science_teacher') or {}
            topic = session_data.get('topic')
            
            if not topic:
                self.whatsapp_service.send_message(
                    user_id,
                    "Please select a topic first before generating notes."
                )
                return
            
            # Hybrid Model: Deduct 1 credit for PDF generation
            credit_result = advanced_credit_service.check_and_deduct_credits(
                user_id, 'teacher_mode_pdf'
            )
            
            # Handle insufficient credits
            if not credit_result.get('success'):
                insufficient_msg = f"""💰 *Need More Credits!* 💰

🎓 *Combined Science Teacher Mode*
📄 PDF Note Generation

💳 *Credit Status:*
{credit_result.get('message', 'Insufficient credits')}

📚 *PDF Notes Benefits:*
• Comprehensive study materials
• Professional formatting
• ZIMSEC exam-focused
• Download and study offline
• Detailed explanations (500-800 words)

💎 *Get More Credits:*"""
                
                buttons = [
                    {"text": "💰 Buy Credits", "callback_data": "credit_store"},
                    {"text": "👥 Invite Friends (+5 each)", "callback_data": "share_to_friend"},
                    {"text": "🏠 Main Menu", "callback_data": "main_menu"}
                ]
                
                self.whatsapp_service.send_interactive_message(user_id, insufficient_msg, buttons)
                return
            
            self.whatsapp_service.send_message(
                user_id,
                "📝 Generating your personalized notes... This will take a moment."
            )
            
            # Request notes from AI (DeepSeek primary, Gemini fallback)
            if self._is_deepseek_configured or self._is_gemini_configured:
                subject = session_data.get('subject', 'Science')
                grade_level = session_data.get('grade_level', 'O-Level')
                conversation_history = session_data.get('conversation_history', [])
                
                # Build dynamic system prompt
                system_prompt = self._build_subject_specific_prompt(subject, grade_level, topic)
                
                # Build context from conversation
                conversation_context = ""
                if conversation_history:
                    conversation_context = "\n\nContext from our lesson:\n"
                    for msg in conversation_history:
                        role = "Student" if msg['role'] == 'user' else "Teacher"
                        conversation_context += f"{role}: {msg['content'][:200]}\n"
                
                prompt = f"{system_prompt}\n\nSubject: {subject}\nGrade Level: {grade_level}\nTopic: {topic}{conversation_context}\n\nStudent request: Generate notes\n\nProvide comprehensive personalized notes in valid JSON format."
                
                notes_data = None
                
                # Try DeepSeek first
                if self._is_deepseek_configured:
                    try:
                        response = requests.post(
                            self.deepseek_api_url,
                            headers={
                                'Content-Type': 'application/json',
                                'Authorization': f'Bearer {self.deepseek_api_key}'
                            },
                            json={
                                'model': DEEPSEEK_CHAT_MODEL,
                                'messages': [
                                    {'role': 'system', 'content': system_prompt},
                                    {'role': 'user', 'content': f"Subject: {subject}\nGrade Level: {grade_level}\nTopic: {topic}{conversation_context}\n\nStudent request: Generate notes\n\nProvide comprehensive personalized notes in valid JSON format."}
                                ],
                                'temperature': 0.7,
                                'max_tokens': 4000
                            },
                            timeout=60  # Optimized: Reduced from 90s - DeepSeek typically responds faster
                        )
                        
                        if response.status_code == 200:
                            data = response.json()
                            if 'choices' in data and len(data['choices']) > 0:
                                ai_text = data['choices'][0]['message']['content'].strip()
                                notes_data = self._parse_notes_response(ai_text)
                                logger.info(f"✅ DeepSeek generated notes for {user_id} (Subject: {subject})")
                    except Exception as deepseek_error:
                        logger.error(f"DeepSeek notes error: {deepseek_error}")
                
                # Fallback to Gemini if DeepSeek failed
                if not notes_data and self._is_gemini_configured and self.gemini_model:
                    try:
                        response = self.gemini_model.generate_content(prompt)
                        notes_data = self._parse_notes_response(response.text)
                        logger.info(f"✅ Gemini fallback generated notes for {user_id} (Subject: {subject})")
                    except Exception as gemini_error:
                        logger.error(f"Gemini notes error: {gemini_error}")
                
                if notes_data:
                    # Generate PDF using the notes generator
                    from utils.science_notes_pdf_generator import ScienceNotesPDFGenerator
                    pdf_generator = ScienceNotesPDFGenerator()
                    pdf_path = pdf_generator.generate_notes_pdf(notes_data, user_id)
                    
                    # Send PDF via WhatsApp
                    caption = f"📚 Your {subject} notes on {topic}\n\nGenerated by your AI Teacher"
                    self.whatsapp_service.send_document(user_id, pdf_path, caption)
                    
                    # Cleanup PDF after sending
                    import time
                    time.sleep(2)
                    if os.path.exists(pdf_path):
                        os.remove(pdf_path)
                    
                    # Get current credits and show credit status
                    current_credits = get_user_credits(user_id)
                    
                    self.whatsapp_service.send_message(
                        user_id,
                        f"✅ Your personalized notes have been sent!\n\nWould you like to continue learning or start a new topic?\n\n💳 *Credits:* {format_credits(current_credits)} (Used: {format_credits(advanced_credit_service.get_credit_cost('teacher_mode_pdf'))} for PDF)"
                    )
                else:
                    self._send_fallback_notes(user_id, topic, subject, grade_level)
            else:
                self._send_fallback_notes(user_id, topic, subject, grade_level)
        
        except Exception as e:
            logger.error(f"Error generating notes for {user_id}: {e}")
            self.whatsapp_service.send_message(
                user_id,
                "Sorry, I encountered an error generating your notes. Please try again."
            )
    
    def _parse_notes_response(self, response_text: str) -> Optional[Dict]:
        """Parse JSON notes from Gemini response"""
        try:
            # Try to extract JSON from response
            if '{' in response_text and '}' in response_text:
                # Find JSON object
                start_idx = response_text.find('{')
                end_idx = response_text.rfind('}') + 1
                json_str = response_text[start_idx:end_idx]
                
                notes_data = json.loads(json_str)
                return notes_data
            else:
                return None
        except Exception as e:
            logger.error(f"Error parsing notes JSON: {e}")
            return None
    
    def _send_fallback_notes(self, user_id: str, topic: str, subject: str, grade_level: str):
        """Send fallback notes when AI generation fails"""
        # Create basic notes structure
        notes_data = {
            "title": topic,
            "subject": subject,
            "grade_level": grade_level,
            "learning_objectives": [
                f"Understand the basic concepts of {topic}",
                f"Identify key components and processes in {topic}",
                f"Apply knowledge of {topic} to real-world scenarios"
            ],
            "key_concepts": {
                "Introduction": f"{topic} is an important concept in {subject}."
            },
            "detailed_explanation": f"This topic covers the fundamental principles of {topic}. Students should focus on understanding the core concepts and how they apply to different situations.",
            "real_world_applications": [
                f"{topic} is used in everyday life and scientific applications."
            ],
            "summary": f"Key points about {topic} that students should remember for their {grade_level} studies.",
            "revision_schedule": {
                "day_3": "Review main concepts and definitions",
                "day_7": "Practice application problems"
            },
            "references": ["ZIMSEC Syllabus", "Combined Science Textbook"]
        }
        
        try:
            from utils.science_notes_pdf_generator import ScienceNotesPDFGenerator
            pdf_generator = ScienceNotesPDFGenerator()
            pdf_path = pdf_generator.generate_notes_pdf(notes_data, user_id)
            
            caption = f"📚 Basic notes on {topic}\n\nGenerated by Combined Science Teacher"
            self.whatsapp_service.send_document(user_id, pdf_path, caption)
            
            import time
            time.sleep(2)
            if os.path.exists(pdf_path):
                os.remove(pdf_path)
            
        except Exception as e:
            logger.error(f"Error sending fallback notes: {e}")
            self.whatsapp_service.send_message(
                user_id,
                f"📚 *Study Notes on {topic}*\n\nI've prepared basic notes on this topic, but I'm having trouble sending the PDF. Please try requesting notes again in a few moments."
            )
    
    # ==================== Multimodal & Deep Research Features ====================
    
    def process_multimodal_message(self, user_id: str, message: str, 
                                   attachments: List[Dict]) -> Dict:
        """
        Process a message with multimodal attachments (images, audio, video, documents)
        for enhanced science teaching
        
        Args:
            user_id: User ID
            message: Text message
            attachments: List of attachments with 'type', 'data', 'mime_type'
            
        Returns:
            dict with response
        """
        try:
            if not self._is_interactions_configured:
                # Fallback to text-only processing
                return self._handle_text_only_fallback(user_id, message)
            
            session_data = session_manager.get_data(user_id, 'science_teacher') or {}
            subject = session_data.get('subject', 'Science')
            grade_level = session_data.get('grade_level', 'O-Level')
            topic = session_data.get('topic', 'General Science')
            
            # Build multimodal input
            input_content = []
            
            # Add context prompt
            context_prompt = f"""You are a professional Combined Science teacher.
Subject: {subject}
Grade Level: {grade_level}
Current Topic: {topic}

Student's message: {message}

Analyze any provided materials (images of diagrams, lab results, documents, etc.) 
and provide educational guidance. Explain scientific concepts clearly."""
            
            input_content.append({"type": "text", "text": context_prompt})
            
            # Add attachments
            for attachment in attachments:
                att_type = attachment.get('type', 'image')
                att_data = attachment.get('data')
                att_mime = attachment.get('mime_type', 'image/png')
                
                if att_type in ['image', 'audio', 'video', 'document']:
                    input_content.append({
                        "type": att_type,
                        "data": att_data,
                        "mime_type": att_mime
                    })
            
            # Create interaction with multimodal content
            result = self.interactions_service.create_interaction(
                input_content=input_content,
                model='flash'
            )
            
            if result.get('success') and result.get('text'):
                # Save to conversation history
                conversation_history = session_data.get('conversation_history', [])
                conversation_history.append({
                    'role': 'user',
                    'content': message,
                    'attachments': len(attachments)
                })
                conversation_history.append({
                    'role': 'assistant',
                    'content': result['text']
                })
                session_data['conversation_history'] = conversation_history[-20:]
                session_manager.set_data(user_id, 'science_teacher', session_data)
                
                return {
                    'success': True,
                    'response': result['text'],
                    'credits_remaining': units_to_credits(get_user_credits(user_id))
                }
            
            return self._handle_text_only_fallback(user_id, message)
            
        except Exception as e:
            logger.error(f"Error processing multimodal message: {e}")
            return self._handle_text_only_fallback(user_id, message)
    
    def analyze_science_image(self, user_id: str, image_data: str, 
                              mime_type: str = 'image/png',
                              prompt: str = None) -> Dict:
        """
        Analyze a science-related image (diagrams, lab results, equations)
        
        Args:
            user_id: User ID
            image_data: Base64-encoded image
            mime_type: Image MIME type
            prompt: Optional custom prompt
            
        Returns:
            dict with analysis
        """
        try:
            session_data = session_manager.get_data(user_id, 'science_teacher') or {}
            subject = session_data.get('subject', 'Science')
            grade_level = session_data.get('grade_level', 'O-Level')
            
            if not prompt:
                prompt = f"""Analyze this science image for a {grade_level} {subject} student.

Please provide:
1. Description of what the image shows
2. Scientific explanation of the concepts depicted
3. Key learning points for the student
4. Related topics they should study
5. Any exam tips related to this content"""
            
            # PRIMARY: Use Vertex AI Gemini Vision API (via vertex_service)
            try:
                from services.vertex_service import vertex_service
                
                if vertex_service.is_available():
                    result = vertex_service.analyze_image(
                        image_base64=image_data,
                        mime_type=mime_type,
                        prompt=prompt
                    )
                    
                    if result and result.get('success'):
                        logger.info(f"🔬 Analyzed science image for {user_id} via Vertex AI")
                        return {
                            'success': True,
                            'text': result.get('text', result.get('latex', ''))
                        }
            except Exception as e:
                logger.warning(f"Vertex AI image analysis failed, trying fallback: {e}")
            
            # FALLBACK: Use Gemini client directly with base64 image
            if self._is_gemini_configured and self.gemini_client:
                try:
                    import base64
                    
                    # Create image part for Gemini
                    image_part = {
                        "inline_data": {
                            "mime_type": mime_type,
                            "data": image_data
                        }
                    }
                    
                    # Send to Gemini with image and text prompt
                    response = self.gemini_client.models.generate_content(
                        model="gemini-2.5-flash",
                        contents=[
                            {"role": "user", "parts": [image_part, {"text": prompt}]}
                        ],
                        config={"temperature": 0.7, "max_output_tokens": 2000}
                    )
                    
                    if response and response.text:
                        logger.info(f"🔬 Analyzed science image for {user_id} via Gemini direct")
                        return {'success': True, 'text': response.text.strip()}
                        
                except Exception as gemini_error:
                    logger.error(f"Gemini image analysis error: {gemini_error}")
                    return {'success': False, 'error': f'Image analysis failed: {str(gemini_error)}'}
            
            return {'success': False, 'error': 'Image analysis not available - no AI services configured'}
            
        except Exception as e:
            logger.error(f"Error analyzing science image: {e}")
            return {'success': False, 'error': str(e)}
    
    def analyze_study_document(self, user_id: str, document_data: str,
                               mime_type: str = 'application/pdf',
                               prompt: str = None) -> Dict:
        """
        Analyze a study document (textbook pages, past papers, notes)
        
        Args:
            user_id: User ID
            document_data: Base64-encoded document
            mime_type: Document MIME type
            prompt: Optional custom prompt
            
        Returns:
            dict with analysis and study points
        """
        try:
            session_data = session_manager.get_data(user_id, 'science_teacher') or {}
            subject = session_data.get('subject', 'Science')
            grade_level = session_data.get('grade_level', 'O-Level')
            
            if not prompt:
                prompt = f"""Analyze this study document for a {grade_level} {subject} student.

Please provide:
1. Summary of the key content
2. Main scientific concepts covered
3. Important definitions and formulas
4. Study tips and exam-relevant points
5. Suggested revision approach

Be comprehensive but accessible for a secondary school student."""
            
            # PRIMARY: Use Vertex AI Gemini Vision API (via vertex_service)
            try:
                from services.vertex_service import vertex_service
                
                if vertex_service.is_available():
                    result = vertex_service.analyze_document(
                        document_base64=document_data,
                        mime_type=mime_type,
                        prompt=prompt
                    )
                    
                    if result and result.get('success'):
                        logger.info(f"📄 Analyzed study document for {user_id} via Vertex AI")
                        return {
                            'success': True,
                            'text': result.get('analysis', '')
                        }
            except Exception as e:
                logger.warning(f"Vertex AI document analysis failed, trying fallback: {e}")
            
            # FALLBACK: Use Gemini client directly with base64 document
            if self._is_gemini_configured and self.gemini_client:
                try:
                    import base64
                    
                    # Create document part for Gemini
                    doc_part = {
                        "inline_data": {
                            "mime_type": mime_type,
                            "data": document_data
                        }
                    }
                    
                    # Send to Gemini with document and text prompt
                    response = self.gemini_client.models.generate_content(
                        model="gemini-2.5-flash",
                        contents=[
                            {"role": "user", "parts": [doc_part, {"text": prompt}]}
                        ],
                        config={"temperature": 0.7, "max_output_tokens": 3000}
                    )
                    
                    if response and response.text:
                        logger.info(f"📄 Analyzed study document for {user_id} via Gemini direct")
                        return {'success': True, 'text': response.text.strip()}
                        
                except Exception as gemini_error:
                    logger.error(f"Gemini document analysis error: {gemini_error}")
                    return {'success': False, 'error': f'Document analysis failed: {str(gemini_error)}'}
            
            return {'success': False, 'error': 'Document analysis not available - no AI services configured'}
            
        except Exception as e:
            logger.error(f"Error analyzing study document: {e}")
            return {'success': False, 'error': str(e)}
    
    def search_science_topic(self, user_id: str, query: str) -> Dict:
        """
        Search web for science topics with Google grounding
        
        Args:
            user_id: User ID
            query: Search query
            
        Returns:
            dict with grounded response
        """
        try:
            if not self._is_interactions_configured:
                return {'success': False, 'error': 'Web search not available'}
            
            session_data = session_manager.get_data(user_id, 'science_teacher') or {}
            subject = session_data.get('subject', 'Science')
            grade_level = session_data.get('grade_level', 'O-Level')
            
            # Enhanced query with educational context
            enhanced_query = f"""For a ZIMSEC {grade_level} {subject} student:

{query}

Provide accurate, educational information with sources. Focus on content relevant 
to the Zimbabwe curriculum and O-Level/A-Level science examinations."""
            
            result = self.interactions_service.search_with_grounding(enhanced_query)
            
            if result.get('success') and result.get('text'):
                # Add to conversation history
                conversation_history = session_data.get('conversation_history', [])
                conversation_history.append({
                    'role': 'user',
                    'content': f"🔍 Search: {query}"
                })
                conversation_history.append({
                    'role': 'assistant',
                    'content': f"🌐 **Search Results**\n\n{self._clean_research_text(result['text'])}"
                })
                session_data['conversation_history'] = conversation_history[-20:]
                session_manager.set_data(user_id, 'science_teacher', session_data)
                
                logger.info(f"🔍 Science topic search for {user_id}")
            
            return result
            
        except Exception as e:
            logger.error(f"Error with science topic search: {e}")
            return {'success': False, 'error': str(e)}
    
    def _handle_text_only_fallback(self, user_id: str, message: str) -> Dict:
        """Fallback for when multimodal is not available"""
        session_data = session_manager.get_data(user_id, 'science_teacher') or {}
        response = self._get_gemini_teaching_response(user_id, message, session_data)
        
        return {
            'success': True,
            'response': response,
            'credits_remaining': units_to_credits(get_user_credits(user_id))
        }
    
    def exit_teacher_mode(self, user_id: str):
        """Exit teacher mode and return to main menu"""
        try:
            # Clear the science teacher session
            session_manager.clear_session(user_id)
            
            self.whatsapp_service.send_message(
                user_id,
                "👋 Thank you for learning with me! See you next time."
            )
            
            # Return to main menu
            from handlers.main_menu_handler import show_main_menu
            show_main_menu(user_id)
            
        except Exception as e:
            logger.error(f"Error exiting teacher mode for {user_id}: {e}")


# Global instance
combined_science_teacher_service = CombinedScienceTeacherService()
