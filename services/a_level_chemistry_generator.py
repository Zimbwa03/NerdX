"""
A Level Chemistry Question Generator
Uses DeepSeek AI to generate advanced chemistry MCQ questions for Cambridge/ZIMSEC A Level syllabus
"""

import json
import logging
import requests
import os
from typing import Dict, Optional
from constants import A_LEVEL_CHEMISTRY_TOPICS, A_LEVEL_CHEMISTRY_ALL_TOPICS
from utils.deepseek import get_deepseek_chat_model

logger = logging.getLogger(__name__)

# A Level Chemistry topic details with category and key concepts
A_LEVEL_CHEMISTRY_TOPIC_DETAILS = {
    # Lower Sixth - Physical Chemistry
    "Atomic Structure": {
        "level": "Lower Sixth",
        "category": "Physical Chemistry",
        "key_concepts": ["electron configuration", "orbitals", "ionization energy", "isotopes", "mass spectrometry"],
        "key_formulas": ["Ar = Σ(isotope mass × abundance) / 100"]
    },
    "Atoms, Molecules and Stoichiometry": {
        "level": "Lower Sixth",
        "category": "Physical Chemistry",
        "key_concepts": ["mole concept", "Avogadro constant", "empirical formula", "limiting reagent", "yield"],
        "key_formulas": ["n = m/M", "n = CV", "n = V/24", "% yield = actual/theoretical × 100"]
    },
    "Chemical Bonding": {
        "level": "Lower Sixth",
        "category": "Physical Chemistry",
        "key_concepts": ["ionic bonding", "covalent bonding", "metallic bonding", "VSEPR", "intermolecular forces"],
        "key_formulas": []
    },
    "States of Matter": {
        "level": "Lower Sixth",
        "category": "Physical Chemistry",
        "key_concepts": ["ideal gas", "kinetic theory", "partial pressures", "lattice structures"],
        "key_formulas": ["pV = nRT", "pₐ = xₐ × pₜₒₜₐₗ"]
    },
    "Chemical Energetics": {
        "level": "Lower Sixth",
        "category": "Physical Chemistry",
        "key_concepts": ["enthalpy changes", "Hess's law", "bond energies", "calorimetry"],
        "key_formulas": ["q = mcΔT", "ΔH = Σ(bonds broken) - Σ(bonds formed)"]
    },
    "Electrochemistry": {
        "level": "Lower Sixth",
        "category": "Physical Chemistry",
        "key_concepts": ["oxidation numbers", "redox reactions", "half-equations", "electrolysis"],
        "key_formulas": ["OIL RIG: Oxidation Is Loss, Reduction Is Gain"]
    },
    "Equilibria": {
        "level": "Lower Sixth",
        "category": "Physical Chemistry",
        "key_concepts": ["dynamic equilibrium", "Le Chatelier's principle", "Kc expression"],
        "key_formulas": ["Kc = [products]ⁿ/[reactants]ᵐ"]
    },
    "Reaction Kinetics": {
        "level": "Lower Sixth",
        "category": "Physical Chemistry",
        "key_concepts": ["rate of reaction", "collision theory", "activation energy", "catalysts"],
        "key_formulas": ["Rate = Δ[C]/Δt"]
    },
    # Lower Sixth - Inorganic Chemistry
    "The Periodic Table: Chemical Periodicity": {
        "level": "Lower Sixth",
        "category": "Inorganic Chemistry",
        "key_concepts": ["periodic trends", "ionization energy", "electronegativity", "Period 3 oxides and chlorides"],
        "key_formulas": []
    },
    "Group 2 Elements": {
        "level": "Lower Sixth",
        "category": "Inorganic Chemistry",
        "key_concepts": ["alkaline earth metals", "reactivity trends", "thermal decomposition", "solubility trends"],
        "key_formulas": []
    },
    "Group 17 Elements": {
        "level": "Lower Sixth",
        "category": "Inorganic Chemistry",
        "key_concepts": ["halogens", "displacement reactions", "halide tests", "disproportionation"],
        "key_formulas": []
    },
    "Nitrogen and Sulfur": {
        "level": "Lower Sixth",
        "category": "Inorganic Chemistry",
        "key_concepts": ["nitrogen cycle", "nitrogen oxides", "sulfur oxides", "acid rain"],
        "key_formulas": []
    },
    # Lower Sixth - Organic Chemistry
    "Introduction to Organic Chemistry": {
        "level": "Lower Sixth",
        "category": "Organic Chemistry",
        "key_concepts": ["nomenclature", "functional groups", "isomerism", "reaction types"],
        "key_formulas": []
    },
    "Hydrocarbons": {
        "level": "Lower Sixth",
        "category": "Organic Chemistry",
        "key_concepts": ["alkanes", "alkenes", "free radical substitution", "electrophilic addition"],
        "key_formulas": ["CₙH₂ₙ₊₂ (alkanes)", "CₙH₂ₙ (alkenes)"]
    },
    "Halogen Compounds": {
        "level": "Lower Sixth",
        "category": "Organic Chemistry",
        "key_concepts": ["halogenoalkanes", "nucleophilic substitution", "SN1 and SN2", "elimination"],
        "key_formulas": []
    },
    "Hydroxy Compounds": {
        "level": "Lower Sixth",
        "category": "Organic Chemistry",
        "key_concepts": ["alcohols", "classification", "oxidation", "esterification"],
        "key_formulas": []
    },
    "Carbonyl Compounds": {
        "level": "Lower Sixth",
        "category": "Organic Chemistry",
        "key_concepts": ["aldehydes", "ketones", "nucleophilic addition", "Tollens' and Fehling's tests"],
        "key_formulas": []
    },
    "Carboxylic Acids and Derivatives": {
        "level": "Lower Sixth",
        "category": "Organic Chemistry",
        "key_concepts": ["carboxylic acids", "esters", "acyl chlorides", "hydrolysis"],
        "key_formulas": []
    },
    "Nitrogen Compounds": {
        "level": "Lower Sixth",
        "category": "Organic Chemistry",
        "key_concepts": ["amines", "amides", "amino acids", "peptide bonds"],
        "key_formulas": []
    },
    "Polymerisation": {
        "level": "Lower Sixth",
        "category": "Organic Chemistry",
        "key_concepts": ["addition polymerisation", "condensation polymerisation", "polymers", "recycling"],
        "key_formulas": []
    },
    "Organic Synthesis": {
        "level": "Lower Sixth",
        "category": "Organic Chemistry",
        "key_concepts": ["multi-step synthesis", "functional group interconversions", "retrosynthesis"],
        "key_formulas": []
    },
    "Analytical Techniques": {
        "level": "Lower Sixth",
        "category": "Analysis",
        "key_concepts": ["mass spectrometry", "infrared spectroscopy", "functional group identification"],
        "key_formulas": []
    },
    # Upper Sixth Topics
    "Chemical Energetics (Advanced)": {
        "level": "Upper Sixth",
        "category": "Physical Chemistry",
        "key_concepts": ["lattice energy", "Born-Haber cycles", "entropy", "Gibbs free energy"],
        "key_formulas": ["ΔG = ΔH - TΔS", "ΔS_total = ΔS_system + ΔS_surroundings"]
    },
    "Electrochemistry (Advanced)": {
        "level": "Upper Sixth",
        "category": "Physical Chemistry",
        "key_concepts": ["electrode potentials", "standard hydrogen electrode", "electrochemical cells", "Nernst equation"],
        "key_formulas": ["E°cell = E°cathode - E°anode", "E = E° - (RT/nF)lnQ"]
    },
    "Equilibria (Advanced)": {
        "level": "Upper Sixth",
        "category": "Physical Chemistry",
        "key_concepts": ["Kp", "Kw", "pH calculations", "buffers", "solubility product Ksp"],
        "key_formulas": ["pH = -log[H⁺]", "Kw = [H⁺][OH⁻]", "Henderson-Hasselbalch equation"]
    },
    "Reaction Kinetics (Advanced)": {
        "level": "Upper Sixth",
        "category": "Physical Chemistry",
        "key_concepts": ["rate equations", "rate constants", "order of reaction", "Arrhenius equation"],
        "key_formulas": ["Rate = k[A]ᵐ[B]ⁿ", "t½ = ln2/k", "ln k = ln A - Ea/RT"]
    },
    "Chemistry of Transition Elements": {
        "level": "Upper Sixth",
        "category": "Inorganic Chemistry",
        "key_concepts": ["d-block properties", "variable oxidation states", "complex ions", "ligands", "catalysis"],
        "key_formulas": []
    },
    "Benzene and Aromatic Compounds": {
        "level": "Upper Sixth",
        "category": "Organic Chemistry",
        "key_concepts": ["benzene structure", "delocalization", "electrophilic substitution", "nitration", "Friedel-Crafts"],
        "key_formulas": []
    },
    "Phenols": {
        "level": "Upper Sixth",
        "category": "Organic Chemistry",
        "key_concepts": ["phenol acidity", "comparison with alcohols", "electrophilic substitution"],
        "key_formulas": []
    },
    "Carbonyl Compounds (Advanced)": {
        "level": "Upper Sixth",
        "category": "Organic Chemistry",
        "key_concepts": ["reactions with HCN", "condensation reactions", "aldol reaction", "keto-enol tautomerism"],
        "key_formulas": []
    },
    "Carboxylic Acids and Derivatives (Advanced)": {
        "level": "Upper Sixth",
        "category": "Organic Chemistry",
        "key_concepts": ["acid derivatives", "nucleophilic acyl substitution", "acid anhydrides"],
        "key_formulas": []
    },
    "Nitrogen Compounds (Advanced)": {
        "level": "Upper Sixth",
        "category": "Organic Chemistry",
        "key_concepts": ["nitriles", "diazonium salts", "azo dyes", "aromatic amines"],
        "key_formulas": []
    },
    "Polymerisation (Advanced)": {
        "level": "Upper Sixth",
        "category": "Organic Chemistry",
        "key_concepts": ["copolymers", "polymer properties", "cross-linking", "thermosetting polymers"],
        "key_formulas": []
    },
    "Organic Synthesis (Advanced)": {
        "level": "Upper Sixth",
        "category": "Organic Chemistry",
        "key_concepts": ["complex synthesis", "stereochemistry", "protecting groups"],
        "key_formulas": []
    },
    "Analytical Techniques (Advanced)": {
        "level": "Upper Sixth",
        "category": "Analysis",
        "key_concepts": ["¹H NMR", "¹³C NMR", "chemical shift", "splitting patterns", "HPLC"],
        "key_formulas": []
    }
}


class ALevelChemistryGenerator:
    """Generator for A Level Chemistry MCQ and Structured questions using DeepSeek AI"""
    
    def __init__(self):
        self.deepseek_api_key = os.environ.get('DEEPSEEK_API_KEY')
        self.deepseek_url = "https://api.deepseek.com/v1/chat/completions"
        self.deepseek_model = get_deepseek_chat_model()
        self.timeout = 30  # Increased timeout for better reliability
        self.max_retries = 4  # Increased from 2 to 4 for better reliability
        self.connect_timeout = 10  # Connection timeout
        
        # Create a session for connection pooling and reuse
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'NerdX-Education/1.0'
        })
    
    def _get_topic_name(self, topic_id: str) -> Optional[str]:
        """Map frontend topic IDs to display names used in constants."""
        slug_map = {
            'atomic_structure': 'Atomic Structure',
            'atoms_molecules_stoichiometry': 'Atoms, Molecules and Stoichiometry',
            'chemical_bonding': 'Chemical Bonding',
            'states_of_matter': 'States of Matter',
            'chemical_energetics_as': 'Chemical Energetics',
            'electrochemistry_as': 'Electrochemistry',
            'equilibria_as': 'Equilibria',
            'reaction_kinetics_as': 'Reaction Kinetics',
            'periodic_table_periodicity': 'The Periodic Table: Chemical Periodicity',
            'group_2': 'Group 2 Elements',
            'group_17': 'Group 17 Elements',
            'nitrogen_sulfur': 'Nitrogen and Sulfur',
            'intro_organic_as': 'Introduction to Organic Chemistry',
            'hydrocarbons_as': 'Hydrocarbons',
            'halogen_compounds_as': 'Halogen Compounds',
            'hydroxy_compounds_as': 'Hydroxy Compounds',
            'carbonyl_compounds': 'Carbonyl Compounds',
            'carboxylic_acids_as': 'Carboxylic Acids and Derivatives',
            'nitrogen_compounds_as': 'Nitrogen Compounds',
            'polymerisation_as': 'Polymerisation',
            'organic_synthesis_as': 'Organic Synthesis',
            'analytical_techniques_as': 'Analytical Techniques',
            'chemical_energetics_a2': 'Chemical Energetics (Advanced)',
            'electrochemistry_a2': 'Electrochemistry (Advanced)',
            'equilibria_a2': 'Equilibria (Advanced)',
            'reaction_kinetics_a2': 'Reaction Kinetics (Advanced)',
            'transition_elements': 'Chemistry of Transition Elements',
            'benzene_aromatics': 'Benzene and Aromatic Compounds',
            'phenols': 'Phenols',
            'carbonyl_compounds_a2': 'Carbonyl Compounds (Advanced)',
            'carboxylic_acids_a2': 'Carboxylic Acids and Derivatives (Advanced)',
            'nitrogen_compounds_a2': 'Nitrogen Compounds (Advanced)',
            'polymerisation_a2': 'Polymerisation (Advanced)',
            'organic_synthesis_a2': 'Organic Synthesis (Advanced)',
            'analytical_techniques_a2': 'Analytical Techniques (Advanced)',
        }
        
        if topic_id in A_LEVEL_CHEMISTRY_ALL_TOPICS:
            return topic_id
        return slug_map.get(topic_id)
    
    def generate_question(self, topic: str, difficulty: str = "medium", user_id: str = None, question_type: str = "mcq") -> Optional[Dict]:
        """
        Generate an A Level Chemistry question
        
        Args:
            topic: The topic identifier
            difficulty: 'easy', 'medium', or 'difficult'
            user_id: Optional user ID for tracking
            question_type: 'mcq' for multiple choice, 'structured' for Paper 2 style
        
        Returns:
            Dictionary containing question data or None on failure
        """
        try:
            topic_name = self._get_topic_name(topic) or topic
            
            # Validate topic
            if topic_name not in A_LEVEL_CHEMISTRY_ALL_TOPICS:
                logger.error(f"Invalid A Level Chemistry topic: {topic}")
                return None
            
            topic_details = A_LEVEL_CHEMISTRY_TOPIC_DETAILS.get(topic_name, {})
            level = topic_details.get("level", "A Level")
            category = topic_details.get("category", "Chemistry")
            key_concepts = topic_details.get("key_concepts", [])
            key_formulas = topic_details.get("key_formulas", [])
            
            # Create detailed prompt for DeepSeek based on question type
            if question_type == "structured":
                prompt = self._create_structured_prompt(topic_name, difficulty, level, category, key_concepts, key_formulas)
            else:
                prompt = self._create_question_prompt(topic_name, difficulty, level, category, key_concepts, key_formulas)
            
            # Generate question using DeepSeek
            question_data = self._call_deepseek(prompt, question_type)
            
            if question_data:
                question_data['subject'] = 'A Level Chemistry'
                question_data['topic'] = topic_name
                question_data['category'] = category
                question_data['difficulty'] = difficulty
                question_data['level'] = level
                question_data['source'] = 'ai_generated_a_level'
                question_data['question_type'] = question_type
                # Enable voice input for structured questions
                question_data['allows_text_input'] = True
                question_data['allows_voice_input'] = True
                return question_data
            
            return None
            
        except Exception as e:
            logger.error(f"Error generating A Level Chemistry question: {e}")
            return None
    
    def _create_question_prompt(self, topic: str, difficulty: str, level: str, category: str, key_concepts: list, key_formulas: list) -> str:
        """Create a detailed prompt for A Level Chemistry MCQ generation"""
        
        difficulty_guidance = {
            "easy": "Test basic understanding, definitions, and simple calculations. Direct recall questions.",
            "medium": "Test application of concepts, multi-step calculations, and interpretation of data.",
            "difficult": "Test deep understanding, complex mechanisms, and synthesis of multiple concepts."
        }
        
        prompt = f"""You are a SENIOR A-LEVEL CHEMISTRY TEACHER (15+ years) AND an examiner-style question designer. You teach and assess for BOTH:
(A) ZIMSEC A Level Chemistry (Paper 1 MCQ, Paper 2 structured, Paper 3 free-response, Paper 4 practical)
(B) Cambridge International AS & A Level Chemistry 9701 (Paper 1 MCQ, Paper 2 structured, Paper 3 practical, Paper 4 A Level structured, Paper 5 planning/analysis/evaluation)

ROLE: SENIOR A-LEVEL CHEMISTRY TEACHER & EXAMINER

NON-NEGOTIABLE RULES:
1. SYLLABUS-LOCKED: Only generate content that is examinable for ZIMSEC A-Level Chemistry and Cambridge 9701
2. NO LEAKAGE: Do NOT introduce off-syllabus topics or university-level methods
3. EXAM AUTHENTICITY: Use real exam command words: "define", "state", "explain", "describe", "calculate", "deduce", "predict", "suggest", "identify", "compare"
4. ORIGINALITY: Do not copy past-paper questions verbatim. Generate ORIGINAL questions with the same SKILL pattern
5. MARKING REALISM: Provide mark allocation + method marks + final answer marks + common errors
6. TOPIC INTEGRATION: Use mixed questions that combine topics the way real papers do (e.g., energetics + equilibria, organic + mechanisms, inorganic + redox)

SUBJECT: A Level Chemistry (ZIMSEC A-Level / Cambridge 9701)
TOPIC: {topic}
CATEGORY: {category}
LEVEL: {level} (Form {'5' if level == 'Lower Sixth' else '6'})
DIFFICULTY: {difficulty} - {difficulty_guidance.get(difficulty, difficulty_guidance['medium'])}

COMPREHENSIVE SUBTOPIC COVERAGE:
- This question MUST test understanding of a SPECIFIC subtopic within {topic}
- Reference: ZIMSEC A-Level Chemistry past papers and Cambridge 9701 past papers
- Questions should rotate through all subtopics to ensure comprehensive topic coverage

KEY CONCEPTS FOR THIS TOPIC:
{', '.join(key_concepts) if key_concepts else 'General concepts for this topic'}

KEY FORMULAS (use when appropriate):
{chr(10).join(['• ' + f for f in key_formulas]) if key_formulas else '• As applicable to the topic'}

EXAM-STYLE QUESTION PATTERNS FOR THIS TOPIC:
- MCQ: definitions + recall traps, calculations, trends, mechanism choice, spectra interpretation
- Structured: multi-step calculations, explain/justify with chemical reasoning, deduce unknowns from data, mechanisms, conditions, predictions
- Practical/Planning: titration + error, kinetics/enthalpy data, qualitative tests reasoning, plan experiment, evaluate method, uncertainty, graphing

CRITICAL FORMATTING RULES - PLAIN TEXT ONLY:
- ABSOLUTELY NO LaTeX delimiters like $ or \\( or \\).
- Use Unicode subscripts for formulas: H₂O, CO₂, CH₃COOH, SO₄²⁻ (NOT H_2O or $H_2O$)
- Use Unicode superscripts for charges/powers: Cu²⁺, Fe³⁺, 10⁻³ (NOT Cu^2+ or $Cu^{{2+}}$)
- Write fractions as: a/b (NOT $\\frac{{a}}{{b}}$)
- Use → for reaction arrows, ⇌ for equilibrium
- Use Δ for delta: ΔH, ΔG, ΔS
- Use ° for degrees: 25°C, 298 K
- Examples: "CaCO₃ → CaO + CO₂", "pH = -log[H⁺]", "Kc = [products]/[reactants]"

EXPERT EXAMINER GUIDELINES - PROFESSIONAL EXAM STANDARDS:
- Use appropriate A-Level command words: "define", "state", "explain", "describe", "calculate", "deduce", "predict", "suggest", "identify", "compare"
- Create distractors based on common A-Level student misconceptions from past marking experience
- Ensure question tests the cognitive level appropriate for {difficulty}:
  * Easy: Knowledge and comprehension (recall facts, understand concepts, simple calculations)
  * Medium: Application and analysis (apply knowledge, multi-step calculations, interpret data, analyze relationships)
  * Difficult: Synthesis and evaluation (complex mechanisms, combine multiple concepts, evaluate scenarios, draw conclusions)
- Question should feel FRESH and different from standard textbook questions
- Include relevant chemical contexts and real-world applications where appropriate
- Distractors should be chemically plausible but clearly incorrect
- Reference ZIMSEC/Cambridge past papers and exam patterns

FRESHNESS REQUIREMENTS - CREATE UNIQUE QUESTIONS:
- Use unique scenarios NOT commonly found in typical textbook questions
- Vary contexts: industrial processes, environmental chemistry, laboratory scenarios, everyday applications
- Vary numbers and approaches to test the same concept
- Ensure question feels professionally crafted like a real ZIMSEC/Cambridge exam question

COMMON EXAM TRAPS TO REFERENCE:
- Sign conventions (enthalpy, entropy, electrode potentials)
- Units and significant figures in calculations
- State symbols in equations (s, l, g, aq)
- Oxidation state errors
- Mechanism arrow direction and electron movement
- Equilibrium shift reasoning errors
- Spectra interpretation mistakes

REQUIREMENTS:
1. Create ONE multiple choice question with exactly 4 options (A, B, C, D)
2. The question should be clear, scientifically accurate, and at A Level standard - NOT O Level
3. Use PLAIN TEXT Unicode notation - NO LaTeX or $ symbols
4. All options must be plausible and based on common A-Level misconceptions
5. For calculation questions, show appropriate significant figures and units
6. The correct answer must be chemically accurate and exact (unless approximation requested)
7. Provide a DETAILED step-by-step explanation suitable for A Level students
8. Include teaching points that help students understand the concept and avoid common errors

STUDENT LEVEL: A-Level Forms 5-6 (ages 17-19 in Zimbabwe). Keep content age-appropriate and at A-Level standard.

OUTPUT FORMAT: Return ONLY valid JSON. No markdown. No extra text.

JSON schema (required fields):
{{
    "question": "Clear, focused ZIMSEC/Cambridge exam-style question testing A-Level concepts (plain text chemistry notation)",
    "options": {{
        "A": "Option A with plain text chemistry - plausible distractor based on common A-Level misconception",
        "B": "Option B with plain text chemistry - plausible distractor based on common A-Level misconception",
        "C": "Option C with plain text chemistry - correct answer",
        "D": "Option D with plain text chemistry - plausible distractor based on common A-Level misconception"
    }},
    "correct_answer": "A/B/C/D",
    "explanation": "Step-by-step explanation: Step 1: [reasoning] Step 2: [chemical principle] Step 3: [conclusion]. Why this is correct and why other options fail.",
    "solution": "DETAILED step-by-step solution: Step 1: [clear step with chemical reasoning] Step 2: [next step] Step 3: [final step] Final Answer: [exact value with units]",
    "teaching_points": "Key teaching points: 1) [concept] 2) [common error to avoid] 3) [exam technique]",
    "common_errors": "Common errors students make: 1) [error description] 2) [why it's wrong] 3) [how to avoid]",
    "marking_notes": "Marking scheme: Method marks (M) for correct approach, Accuracy marks (A) for correct answer. Common examiner comments.",
    "zimsec_paper_reference": "Paper 1 (MCQ) or Paper 2/3 (as appropriate)",
    "cambridge_paper_reference": "Paper 1 (MCQ) or Paper 2/4 (as appropriate)"
}}

Generate ONE A Level Chemistry MCQ now:"""

        return prompt
    
    def _create_structured_prompt(self, topic: str, difficulty: str, level: str, category: str, key_concepts: list, key_formulas: list) -> str:
        """Create prompt for structured (Paper 2 style) questions - knowledge-based, no diagrams"""
        
        difficulty_marks = {
            "easy": {"total": 8, "parts": 3},
            "medium": {"total": 12, "parts": 4},
            "difficult": {"total": 15, "parts": 5}
        }
        marks_info = difficulty_marks.get(difficulty, difficulty_marks["medium"])
        
        prompt = f"""You are a SENIOR A-LEVEL CHEMISTRY TEACHER (15+ years) AND an examiner-style question designer for ZIMSEC and Cambridge A Level Chemistry.

ROLE: SENIOR A-LEVEL CHEMISTRY EXAMINER - PAPER 2 STRUCTURED QUESTIONS

NON-NEGOTIABLE RULES:
1. SYLLABUS-LOCKED: Only generate content examinable for ZIMSEC A-Level and Cambridge 9701
2. NO DIAGRAMS: Questions must be answerable with TEXT ONLY - no diagrams, graphs, or images required
3. KNOWLEDGE-FOCUSED: Test understanding through explanations, descriptions, comparisons, and deductions
4. EXAM AUTHENTICITY: Use real exam command words: "state", "explain", "describe", "compare", "deduce", "suggest", "justify", "outline", "discuss"
5. ORIGINALITY: Generate ORIGINAL questions with realistic exam patterns
6. MARKING REALISM: Provide clear mark allocation and model answers

SUBJECT: A Level Chemistry (ZIMSEC / Cambridge 9701)
TOPIC: {topic}
CATEGORY: {category}
LEVEL: {level}
DIFFICULTY: {difficulty}
TOTAL MARKS: {marks_info['total']}
NUMBER OF PARTS: {marks_info['parts']}

KEY CONCEPTS FOR THIS TOPIC:
{', '.join(key_concepts) if key_concepts else 'General concepts for this topic'}

KEY FORMULAS (use when appropriate):
{chr(10).join(['• ' + f for f in key_formulas]) if key_formulas else '• As applicable to the topic'}

CRITICAL FORMATTING RULES - PLAIN TEXT ONLY:
- ABSOLUTELY NO LaTeX delimiters like $ or \\( or \\)
- Use Unicode subscripts: H₂O, CO₂, CH₃COOH, SO₄²⁻ (NOT H_2O)
- Use Unicode superscripts for charges: Cu²⁺, Fe³⁺, 10⁻³ (NOT Cu^2+)
- Write fractions as: a/b (NOT $\\frac{{a}}{{b}}$)
- Use → for reaction arrows, ⇌ for equilibrium
- Use Δ for delta: ΔH, ΔG, ΔS
- Use ° for degrees: 25°C

QUESTION STRUCTURE REQUIREMENTS:
- Create ONE structured question with {marks_info['parts']} parts: (a), (b), (c), etc.
- Each part tests DIFFERENT aspects of {topic}
- Part progression: Basic recall → Understanding → Application → Analysis
- Keep the stem/context brief (1-3 lines maximum)
- ALL parts must be answerable with TEXT - no diagrams needed
- Focus on explanations, comparisons, deductions, and chemical reasoning

PART DIFFICULTY PROGRESSION:
- Part (a): 2-3 marks - Define, state, or recall (basic knowledge)
- Part (b): 3-4 marks - Explain, describe, or compare (understanding)
- Part (c): 4-5 marks - Deduce, suggest, or apply (application)
- Part (d) if needed: 4-6 marks - Evaluate, discuss, or justify (analysis/synthesis)

COMMAND WORDS TO USE:
- State: Give a concise factual answer
- Define: Give the precise meaning
- Explain: Give reasons with chemical principles
- Describe: Give a detailed account
- Compare: State similarities and differences
- Deduce: Draw conclusions from given information
- Suggest: Apply knowledge to unfamiliar contexts
- Justify: Support a conclusion with evidence/reasoning
- Outline: Give main features briefly
- Discuss: Present arguments for and against

OUTPUT FORMAT: Return ONLY valid JSON. No markdown. No extra text.

JSON schema (required fields):
{{
    "question_type": "structured",
    "question_text": "Brief stem/context (1-3 lines) introducing the question",
    "structured_question": {{
        "total_marks": {marks_info['total']},
        "parts": [
            {{
                "label": "(a)",
                "question": "Part (a) question text with appropriate command word",
                "marks": 2,
                "model_answer": "Complete model answer for part (a) - what a student should write",
                "marking_points": ["Key point 1 [1 mark]", "Key point 2 [1 mark]"]
            }},
            {{
                "label": "(b)",
                "question": "Part (b) question text (builds on or relates to part a)",
                "marks": 4,
                "model_answer": "Complete model answer for part (b)",
                "marking_points": ["Key point 1 [1 mark]", "Key point 2 [1 mark]", "Key point 3 [1 mark]", "Key point 4 [1 mark]"]
            }},
            {{
                "label": "(c)",
                "question": "Part (c) question text (most challenging - application/analysis)",
                "marks": 4,
                "model_answer": "Complete model answer for part (c)",
                "marking_points": ["Key point 1 [1 mark]", "Key point 2 [1 mark]", "Key point 3 [1 mark]", "Key point 4 [1 mark]"]
            }}
        ]
    }},
    "teaching_points": "Key concepts students should know: 1) [concept] 2) [concept] 3) [concept]",
    "common_errors": "Common mistakes: 1) [error] 2) [error] 3) [error]",
    "examiner_tips": "What examiners look for: clear chemical reasoning, correct terminology, complete explanations"
}}

Generate ONE A Level Chemistry structured question now:"""

        return prompt
    
    def _call_deepseek(self, prompt: str, question_type: str = "mcq") -> Optional[Dict]:
        """Call DeepSeek API to generate question with retry logic"""
        import time
        
        for attempt in range(self.max_retries):
            timeout = None
            try:
                if not self.deepseek_api_key:
                    logger.error("DeepSeek API key not found")
                    return None
                
                headers = {
                    "Authorization": f"Bearer {self.deepseek_api_key}",
                    "Content-Type": "application/json"
                }
                
                system_content = """You are a SENIOR A-LEVEL CHEMISTRY TEACHER (15+ years) AND an examiner-style question designer. You teach and assess for BOTH ZIMSEC A-Level Chemistry and Cambridge International AS & A Level Chemistry 9701.

ROLE: SENIOR A-LEVEL CHEMISTRY TEACHER & EXAMINER

NON-NEGOTIABLE RULES:
1. SYLLABUS-LOCKED: Only generate content examinable for ZIMSEC A-Level and Cambridge 9701
2. NO LEAKAGE: Do NOT introduce off-syllabus topics or university-level methods
3. EXAM AUTHENTICITY: Use real exam command words and structure
4. ORIGINALITY: Generate ORIGINAL questions with the same SKILL pattern (not verbatim past papers)
5. MARKING REALISM: Provide method marks + accuracy marks + common errors
6. TOPIC INTEGRATION: Use mixed questions combining topics the way real papers do

CRITICAL: Use PLAIN TEXT Unicode notation - NEVER use LaTeX or $ symbols:
- ABSOLUTELY NO delimiters like $.
- Use subscripts: H₂O, CO₂, SO₄²⁻, CH₃COOH (NOT H_2O or $H_2O$)
- Use superscripts for charges: Cu²⁺, Fe³⁺, SO₄²⁻ (NOT Cu^2+)
- Use fractions as a/b (NOT $\\frac{a}{b}$)
- Use → for arrows, ⇌ for equilibrium, Δ for delta
- Use proper chemical notation: [H⁺], Kc, E°cell

Always respond with valid JSON containing step-by-step solutions."""
                
                payload = {
                    "model": self.deepseek_model,
                    "messages": [
                        {
                            "role": "system",
                            "content": system_content
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "temperature": 0.7,
                    "max_tokens": 2000 if question_type == "structured" else 1500
                }
                
                # Optimized timeout - slightly increase for retries but cap it
                timeout = self.timeout + (attempt * 5)  # Reduced increment: 25s, 30s
                logger.info(f"DeepSeek Chemistry attempt {attempt + 1}/{self.max_retries} (timeout: {timeout}s)")
                
                # Use session for connection pooling
                # Add auth header to session
                self.session.headers.update(headers)
                
                # Exponential backoff with jitter
                if attempt > 0:
                    import random
                    backoff_delay = 1 * (2 ** (attempt - 1)) + random.uniform(0, 1)
                    logger.info(f"Waiting {backoff_delay:.2f}s before retry {attempt + 1}/{self.max_retries}")
                    time.sleep(backoff_delay)
                
                try:
                    response = self.session.post(
                        self.deepseek_url,
                        json=payload,
                        timeout=(self.connect_timeout, timeout)
                    )
                
                if response.status_code == 429:
                    # Rate limit - use Retry-After header if available
                    retry_after = int(response.headers.get('Retry-After', 10))
                    logger.warning(f"DeepSeek rate limit hit (429) on attempt {attempt + 1}, waiting {retry_after}s")
                    if attempt < self.max_retries - 1:
                        time.sleep(retry_after)
                        continue
                elif response.status_code == 503:
                    # Service unavailable
                    logger.warning(f"DeepSeek service unavailable (503) on attempt {attempt + 1}")
                    if attempt < self.max_retries - 1:
                        continue
                elif response.status_code != 200:
                    logger.error(f"DeepSeek API error: {response.status_code} - {response.text[:200]}")
                    if attempt < self.max_retries - 1:
                        continue
                
                result = response.json()
                content = result.get('choices', [{}])[0].get('message', {}).get('content', '')
                
                # Parse JSON from response
                question_data = self._parse_question_response(content, question_type)
                if question_data:
                    return question_data
                else:
                    logger.warning(f"Failed to parse response on attempt {attempt + 1}")
                    if attempt < self.max_retries - 1:
                        time.sleep(2)
                        continue
                    
            except (requests.Timeout, requests.exceptions.ReadTimeout) as e:
                timeout_str = f" (timeout: {timeout}s)" if timeout else ""
                logger.warning(f"DeepSeek timeout on attempt {attempt + 1}/{self.max_retries}{timeout_str}")
                # Reduce max_tokens for retry to speed up
                if attempt < self.max_retries - 1:
                    payload['max_tokens'] = int(payload.get('max_tokens', 2000) * 0.85)  # Reduce by 15%
                    logger.info(f"Retrying with reduced max_tokens ({payload['max_tokens']})")
                    time.sleep(1)  # Brief wait before retry
                    continue
            except requests.exceptions.ConnectionError as e:
                logger.error(f"DeepSeek connection error on attempt {attempt + 1}: {e}")
                # Exponential backoff for connection errors
                if attempt < self.max_retries - 1:
                    wait_time = min(2 ** attempt, 5)  # Cap at 5 seconds: 1s, 2s, 4s, 5s
                    logger.info(f"Connection error, waiting {wait_time}s before retry...")
                    time.sleep(wait_time)
                    continue
            except requests.exceptions.HTTPError as e:
                status_code = getattr(e.response, 'status_code', None)
                if status_code == 429:  # Rate limit
                    logger.warning(f"DeepSeek rate limit hit on attempt {attempt + 1}")
                    if attempt < self.max_retries - 1:
                        wait_time = 5 * (attempt + 1)  # Wait longer for rate limits
                        logger.info(f"Rate limited, waiting {wait_time}s before retry...")
                        time.sleep(wait_time)
                        continue
                else:
                    logger.error(f"DeepSeek HTTP error {status_code} on attempt {attempt + 1}: {e}")
                    if attempt < self.max_retries - 1:
                        time.sleep(2)
                        continue
            except Exception as e:
                logger.error(f"Error calling DeepSeek API on attempt {attempt + 1}: {e}", exc_info=True)
                if attempt < self.max_retries - 1:
                    time.sleep(1)  # Brief wait before retry
                    continue
        
        logger.error("All DeepSeek retry attempts failed for Chemistry question, trying Vertex AI fallback")
        
        # FALLBACK: Try Vertex AI when DeepSeek fails
        try:
            from services.vertex_service import vertex_service
            
            if vertex_service.is_available():
                logger.info(f"🔄 Falling back to Vertex AI for Chemistry {question_type}")
                
                system_message = """You are a SENIOR A-LEVEL CHEMISTRY TEACHER (15+ years) AND an examiner-style question designer. You teach and assess for BOTH ZIMSEC A-Level Chemistry and Cambridge International AS & A Level Chemistry 9701. Always respond with valid JSON containing step-by-step solutions."""
                full_prompt = f"{system_message}\n\n{prompt}"
                
                result = vertex_service.generate_text(prompt=full_prompt, model="gemini-2.5-flash")
                
                if result and result.get('success'):
                    text = result['text']
                    question_data = self._parse_question_response(text, question_type)
                    if question_data:
                        logger.info(f"✅ Successfully generated Chemistry {question_type} with Vertex AI fallback")
                        return question_data
            else:
                logger.warning("Vertex AI not available for fallback")
        except Exception as e:
            logger.error(f"Error in Vertex AI fallback: {e}")
        
        return None
    
    def _parse_question_response(self, content: str, question_type: str = "mcq") -> Optional[Dict]:
        """Parse the JSON response from DeepSeek with truncation recovery"""
        try:
            content = content.strip()
            
            if '```json' in content:
                start = content.find('```json') + 7
                end = content.find('```', start)
                if end > start:
                    content = content[start:end].strip()
                else:
                    content = content[start:].strip()
            elif '```' in content:
                start = content.find('```') + 3
                end = content.find('```', start)
                if end > start:
                    content = content[start:end].strip()
                else:
                    content = content[start:].strip()
            
            # Try to parse JSON, with recovery for truncated responses
            try:
                question_data = json.loads(content)
            except json.JSONDecodeError as e:
                logger.warning(f"Initial JSON parse failed: {e}")
                # Attempt to recover truncated JSON
                question_data = self._recover_truncated_json(content)
                if not question_data:
                    return None
            
            # Validate based on question type
            if question_type == "structured":
                # Validate structured question fields
                if 'structured_question' not in question_data:
                    logger.error("Missing structured_question field for structured question")
                    return None
                
                structured = question_data.get('structured_question', {})
                if not isinstance(structured.get('parts'), list) or len(structured['parts']) < 2:
                    logger.error("Structured question must have at least 2 parts")
                    return None
                
                # Map question_text to question for compatibility
                if 'question_text' in question_data and 'question' not in question_data:
                    question_data['question'] = question_data['question_text']
            else:
                # Validate MCQ fields
                required_fields = ['question', 'options', 'correct_answer', 'explanation']
                for field in required_fields:
                    if field not in question_data:
                        logger.error(f"Missing required field: {field}")
                        return None
                
                if not isinstance(question_data['options'], dict) or len(question_data['options']) < 4:
                    logger.error("Invalid options format")
                    return None
            
            return question_data
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {e}")
            # Try to recover truncated JSON
            recovered = self._recover_truncated_json(content)
            if recovered:
                return recovered
            return None
        except Exception as e:
            logger.error(f"Error parsing question response: {e}")
            return None
    
    def _recover_truncated_json(self, content: str) -> Optional[Dict]:
        """Attempt to recover data from a truncated JSON response"""
        try:
            import re
            
            # Find where JSON starts
            json_start = content.find('{')
            if json_start == -1:
                return None
            
            content = content[json_start:]
            
            # Extract question
            question_match = re.search(r'"question"\s*:\s*"([^"]+)"', content)
            question = question_match.group(1) if question_match else None
            
            if not question:
                return None
            
            # Extract options
            options = {}
            for letter in ['A', 'B', 'C', 'D']:
                opt_match = re.search(rf'"{letter}"\s*:\s*"([^"]+)"', content)
                if opt_match:
                    options[letter] = opt_match.group(1)
            
            # Extract correct answer
            answer_match = re.search(r'"correct_answer"\s*:\s*"([ABCD])"', content)
            correct_answer = answer_match.group(1) if answer_match else 'A'
            
            # Extract explanation if available
            explanation_match = re.search(r'"explanation"\s*:\s*"([^"]+)"', content)
            explanation = explanation_match.group(1) if explanation_match else "See the worked solution."
            
            # If we have enough data, construct a valid response
            if question and len(options) >= 4:
                logger.info("Successfully recovered truncated JSON response for Chemistry")
                return {
                    "question": question,
                    "options": options,
                    "correct_answer": correct_answer,
                    "explanation": explanation,
                    "solution": "Work through the problem step by step using the relevant chemistry principles.",
                    "teaching_explanation": "Review the key concepts for this topic."
                }
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to recover truncated JSON: {e}")
            return None


# Singleton instance
a_level_chemistry_generator = ALevelChemistryGenerator()
