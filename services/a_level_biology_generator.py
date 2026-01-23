"""
A Level Biology Question Generator
Uses DeepSeek AI (primary) with Gemini AI (fallback) to generate MCQ, Structured, and Essay questions
for ZIMSEC A Level syllabus (Code 6030). Supports three distinct question formats with comprehensive marking schemes.
"""

import json
import logging
import requests
import os
from typing import Dict, Optional, List
from constants import A_LEVEL_BIOLOGY_TOPICS, A_LEVEL_BIOLOGY_ALL_TOPICS

logger = logging.getLogger(__name__)

# Try to import Gemini AI
try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
    logger.info("google.generativeai loaded for A Level Biology Generator")
except ImportError:
    genai = None
    GENAI_AVAILABLE = False
    logger.warning("google.generativeai not available, will use DeepSeek only")

# A Level Biology topic details for comprehensive prompts
A_LEVEL_BIOLOGY_TOPIC_DETAILS = {
    # Lower Sixth (Form 5) Topics
    "Cell Structure": {
        "level": "Lower Sixth",
        "key_concepts": ["eukaryotic and prokaryotic cells", "cell organelles", "ultrastructure", "magnification", "resolution"],
        "key_terms": ["nucleus", "mitochondria", "ribosome", "endoplasmic reticulum", "Golgi apparatus", "lysosome", "chloroplast"],
        "practical": True
    },
    "Biological Molecules": {
        "level": "Lower Sixth",
        "key_concepts": ["carbohydrates", "lipids", "proteins", "water properties", "condensation", "hydrolysis"],
        "key_terms": ["monosaccharide", "polysaccharide", "glycosidic bond", "peptide bond", "primary structure", "quaternary structure"],
        "practical": True
    },
    "Enzymes": {
        "level": "Lower Sixth",
        "key_concepts": ["enzyme action", "active site", "factors affecting enzymes", "inhibition", "specificity"],
        "key_terms": ["lock and key", "induced fit", "activation energy", "Vmax", "Km", "competitive inhibition", "denaturation"],
        "practical": True
    },
    "Cell Membranes and Transport": {
        "level": "Lower Sixth",
        "key_concepts": ["fluid mosaic model", "membrane transport", "water potential", "osmosis", "active transport"],
        "key_terms": ["phospholipid bilayer", "integral protein", "facilitated diffusion", "endocytosis", "exocytosis"],
        "practical": True
    },
    "The Cell Cycle and Mitosis": {
        "level": "Lower Sixth",
        "key_concepts": ["cell cycle stages", "mitosis phases", "chromosome behavior", "significance of mitosis"],
        "key_terms": ["interphase", "prophase", "metaphase", "anaphase", "telophase", "cytokinesis", "chromatid", "centromere"],
        "practical": True
    },
    "Nucleic Acids and Protein Synthesis": {
        "level": "Lower Sixth",
        "key_concepts": ["DNA structure", "RNA types", "replication", "transcription", "translation"],
        "key_terms": ["nucleotide", "double helix", "mRNA", "tRNA", "codon", "anticodon", "genetic code"],
        "practical": False
    },
    "Transport in Plants": {
        "level": "Lower Sixth",
        "key_concepts": ["xylem and phloem", "transpiration", "translocation", "stomatal control"],
        "key_terms": ["transpiration stream", "cohesion", "adhesion", "mass flow", "source", "sink", "potometer"],
        "practical": True
    },
    "Transport in Mammals": {
        "level": "Lower Sixth",
        "key_concepts": ["heart structure", "cardiac cycle", "blood vessels", "blood composition", "haemoglobin"],
        "key_terms": ["systole", "diastole", "sinoatrial node", "artery", "capillary", "oxygen dissociation curve"],
        "practical": False
    },
    "Gas Exchange": {
        "level": "Lower Sixth",
        "key_concepts": ["gas exchange surfaces", "ventilation", "counter-current flow", "adaptations"],
        "key_terms": ["alveolus", "surfactant", "ventilation", "tracheal system", "gills"],
        "practical": True
    },
    "Infectious Diseases": {
        "level": "Lower Sixth",
        "key_concepts": ["pathogens", "disease transmission", "cholera", "malaria", "TB", "HIV/AIDS"],
        "key_terms": ["pathogen", "vector", "endemic", "epidemic", "pandemic", "antibiotic resistance"],
        "practical": False
    },
    "Immunity": {
        "level": "Lower Sixth",
        "key_concepts": ["specific and non-specific immunity", "antibodies", "lymphocytes", "vaccination"],
        "key_terms": ["antigen", "antibody", "B lymphocyte", "T lymphocyte", "phagocyte", "memory cell", "herd immunity"],
        "practical": False
    },
    "Smoking and Health": {
        "level": "Lower Sixth",
        "key_concepts": ["effects of smoking", "tar", "nicotine", "carbon monoxide", "cardiovascular disease"],
        "key_terms": ["carcinogen", "emphysema", "COPD", "atherosclerosis", "coronary heart disease"],
        "practical": False
    },
    # Upper Sixth (Form 6) Topics
    "Energy and Respiration": {
        "level": "Upper Sixth",
        "key_concepts": ["ATP", "glycolysis", "Krebs cycle", "oxidative phosphorylation", "anaerobic respiration"],
        "key_terms": ["ATP synthase", "chemiosmosis", "electron transport chain", "NAD", "FAD", "respiratory quotient"],
        "practical": False
    },
    "Photosynthesis": {
        "level": "Upper Sixth",
        "key_concepts": ["light-dependent reactions", "Calvin cycle", "limiting factors", "C3 and C4 plants"],
        "key_terms": ["photosystem", "photophosphorylation", "RuBisCO", "RuBP", "triose phosphate"],
        "practical": True
    },
    "Homeostasis": {
        "level": "Upper Sixth",
        "key_concepts": ["negative feedback", "blood glucose control", "thermoregulation", "diabetes"],
        "key_terms": ["insulin", "glucagon", "glycogenesis", "glycogenolysis", "hypothalamus"],
        "practical": False
    },
    "Excretion": {
        "level": "Upper Sixth",
        "key_concepts": ["kidney structure", "nephron", "ultrafiltration", "osmoregulation", "ADH"],
        "key_terms": ["glomerulus", "Bowmans capsule", "loop of Henle", "collecting duct", "counter-current multiplier"],
        "practical": False
    },
    "Coordination: Nervous System": {
        "level": "Upper Sixth",
        "key_concepts": ["nerve impulse", "action potential", "synapses", "receptors"],
        "key_terms": ["resting potential", "depolarisation", "repolarisation", "saltatory conduction", "neurotransmitter"],
        "practical": False
    },
    "Coordination: Hormones": {
        "level": "Upper Sixth",
        "key_concepts": ["endocrine system", "hormone action", "menstrual cycle", "plant hormones"],
        "key_terms": ["steroid hormone", "peptide hormone", "second messenger", "auxin", "phototropism"],
        "practical": False
    },
    "Inherited Change": {
        "level": "Upper Sixth",
        "key_concepts": ["meiosis", "genetic crosses", "sex linkage", "co-dominance", "mutations"],
        "key_terms": ["crossing over", "independent assortment", "genotype", "phenotype", "chi-squared test"],
        "practical": False
    },
    "Selection and Evolution": {
        "level": "Upper Sixth",
        "key_concepts": ["natural selection", "speciation", "evidence for evolution", "artificial selection"],
        "key_terms": ["adaptation", "allopatric", "sympatric", "reproductive isolation", "genetic drift"],
        "practical": False
    },
    "Biodiversity and Classification": {
        "level": "Upper Sixth",
        "key_concepts": ["taxonomy", "three-domain system", "biodiversity measures", "conservation"],
        "key_terms": ["binomial nomenclature", "Archaea", "Bacteria", "Eukarya", "Simpsons index"],
        "practical": True
    },
    "Genetic Technology": {
        "level": "Upper Sixth",
        "key_concepts": ["genetic engineering", "PCR", "gel electrophoresis", "gene therapy", "cloning"],
        "key_terms": ["restriction enzyme", "ligase", "plasmid", "vector", "transgenic", "GMO"],
        "practical": False
    },
    "Ecology": {
        "level": "Upper Sixth",
        "key_concepts": ["ecosystems", "energy flow", "nutrient cycles", "population dynamics"],
        "key_terms": ["trophic level", "food web", "carbon cycle", "nitrogen fixation", "carrying capacity"],
        "practical": True
    },
    "Human Impact on Environment": {
        "level": "Upper Sixth",
        "key_concepts": ["deforestation", "global warming", "pollution", "eutrophication", "sustainability"],
        "key_terms": ["greenhouse effect", "carbon footprint", "biodiversity loss", "conservation"],
        "practical": False
    },
    "Reproduction": {
        "level": "Upper Sixth",
        "key_concepts": ["sexual vs asexual reproduction", "plant reproduction", "human reproduction"],
        "key_terms": ["pollination", "double fertilisation", "germination", "menstrual cycle", "implantation"],
        "practical": False
    }
}


class ALevelBiologyGenerator:
    """Generator for A Level Biology questions using DeepSeek AI (primary) with Gemini fallback"""
    
    def __init__(self):
        # DeepSeek configuration (primary)
        self.deepseek_api_key = os.environ.get('DEEPSEEK_API_KEY')
        self.deepseek_url = "https://api.deepseek.com/v1/chat/completions"
        self.max_retries = 3  # 3 attempts for DeepSeek (increased for reliability)
        # Timeout varies by question type - structured/essay need more time
        # Increased timeouts to handle longer AI generation times
        self.timeout_base = 30  # Base timeout for MCQ (increased from 25)
        
        # Gemini configuration (fallback)
        self.gemini_api_key = os.environ.get('GEMINI_API_KEY')
        self._gemini_configured = False
        
        if self.gemini_api_key and GENAI_AVAILABLE:
            try:
                genai.configure(api_key=self.gemini_api_key)
                self._gemini_configured = True
                logger.info("Gemini AI configured as FALLBACK provider for A Level Biology")
            except Exception as e:
                logger.error(f"Failed to configure Gemini: {e}")
        
        if self.deepseek_api_key:
            logger.info("DeepSeek AI configured as PRIMARY provider for A Level Biology")
    
    def generate_question(self, topic: str, difficulty: str = "medium", 
                         user_id: str = None, question_type: str = "mcq") -> Optional[Dict]:
        """
        Generate an A Level Biology question using DeepSeek (primary) with Gemini fallback
        
        Args:
            topic: The topic identifier
            difficulty: 'easy', 'medium', or 'difficult'
            user_id: Optional user ID for tracking
            question_type: 'mcq', 'structured', or 'essay'
        
        Returns:
            Dictionary containing question data or None on failure
        """
        try:
            # Map topic ID to display name
            topic_name = self._get_topic_name(topic)
            if not topic_name:
                logger.error(f"Invalid A Level Biology topic: {topic}")
                return None
            
            topic_details = A_LEVEL_BIOLOGY_TOPIC_DETAILS.get(topic_name, {})
            level = topic_details.get("level", "A Level")
            key_concepts = topic_details.get("key_concepts", [])
            key_terms = topic_details.get("key_terms", [])
            
            # Create appropriate prompt based on question type
            if question_type == "essay":
                prompt = self._create_essay_prompt(topic_name, difficulty, level, key_concepts, key_terms)
            elif question_type == "structured":
                prompt = self._create_structured_prompt(topic_name, difficulty, level, key_concepts, key_terms)
            else:
                prompt = self._create_mcq_prompt(topic_name, difficulty, level, key_concepts, key_terms)
            
            # PRIMARY: Try DeepSeek first
            ai_model = 'deepseek'
            logger.info(f"Trying DeepSeek (primary) for A Level Biology {question_type} on {topic_name}")
            question_data = self._call_deepseek(prompt, question_type)
            
            # FALLBACK: If DeepSeek fails, try Gemini
            if not question_data and self._gemini_configured:
                logger.warning(f"DeepSeek failed, falling back to Gemini for {question_type} on {topic_name}")
                question_data = self._call_gemini(prompt, question_type)
                if question_data:
                    ai_model = 'gemini'
                    logger.info(f"Gemini successfully generated {question_type} for {topic_name}")
            
            if question_data:
                question_data['subject'] = 'A Level Biology'
                question_data['topic'] = topic_name
                question_data['topic_id'] = topic
                question_data['difficulty'] = difficulty
                question_data['level'] = level
                question_data['question_type'] = question_type
                question_data['source'] = 'ai_generated_a_level_biology'
                question_data['ai_model'] = ai_model
                return question_data
            
            logger.error(f"All AI providers failed for A Level Biology {question_type} on {topic_name}")
            logger.error(f"Topic details: {topic_details}, Level: {level}")
            return None
            
        except Exception as e:
            logger.error(f"Error generating A Level Biology question: {e}", exc_info=True)
            return None
    
    def _get_topic_name(self, topic_id: str) -> Optional[str]:
        """Convert topic ID to display name"""
        topic_map = {
            'cell_structure': 'Cell Structure',
            'biological_molecules': 'Biological Molecules',
            'enzymes': 'Enzymes',
            'cell_membranes': 'Cell Membranes and Transport',
            'cell_division': 'The Cell Cycle and Mitosis',
            'nucleic_acids': 'Nucleic Acids and Protein Synthesis',
            'transport_plants': 'Transport in Plants',
            'transport_mammals': 'Transport in Mammals',
            'gas_exchange': 'Gas Exchange',
            'infectious_diseases': 'Infectious Diseases',
            'immunity': 'Immunity',
            'smoking_health': 'Smoking and Health',
            'energy_respiration': 'Energy and Respiration',
            'photosynthesis': 'Photosynthesis',
            'homeostasis': 'Homeostasis',
            'excretion': 'Excretion',
            'nervous_coordination': 'Coordination: Nervous System',
            'hormonal_coordination': 'Coordination: Hormones',
            'meiosis_genetics': 'Inherited Change',
            'selection_evolution': 'Selection and Evolution',
            'biodiversity_classification': 'Biodiversity and Classification',
            'genetic_technology': 'Genetic Technology',
            'ecology': 'Ecology',
            'human_environment': 'Human Impact on Environment',
            'reproduction': 'Reproduction'
        }
        
        if topic_id in A_LEVEL_BIOLOGY_ALL_TOPICS:
            return topic_id
        
        return topic_map.get(topic_id)
    
    def _create_mcq_prompt(self, topic: str, difficulty: str, level: str,
                          key_concepts: List[str], key_terms: List[str]) -> str:
        """Create prompt for MCQ questions"""
        
        difficulty_guidance = {
            "easy": "Test recall of definitions and basic facts. Direct knowledge questions.",
            "medium": "Test understanding and application. May require interpretation of data or diagrams.",
            "difficult": "Test analysis and evaluation. Complex scenarios requiring deep understanding."
        }
        
        prompt = f"""You are a SENIOR A-LEVEL BIOLOGY TEACHER (15+ years) AND an examiner-style question designer. You teach and assess for BOTH:
(A) ZIMSEC A Level Biology 6030 (Paper 1 MCQ, Paper 2 structured, Paper 3 essay)
(B) Cambridge International AS & A Level Biology 9700 (Paper 1 MCQ, Paper 2 structured, Paper 4 A Level structured, Paper 5 practical)

ROLE: SENIOR A-LEVEL BIOLOGY TEACHER & EXAMINER

NON-NEGOTIABLE RULES:
1. SYLLABUS-LOCKED: Only generate content that is examinable for ZIMSEC 6030 and Cambridge 9700
2. NO LEAKAGE: Do NOT introduce off-syllabus topics or university-level methods
3. EXAM AUTHENTICITY: Use real exam command words: "define", "state", "explain", "describe", "identify", "compare", "deduce", "predict", "suggest"
4. ORIGINALITY: Do not copy past-paper questions verbatim. Generate ORIGINAL questions with the same SKILL pattern
5. MARKING REALISM: Provide mark allocation + method marks + accuracy marks + common errors
6. TOPIC INTEGRATION: Use mixed questions that combine topics the way real papers do (e.g., enzymes + metabolism, transport + gas exchange, genetics + evolution)

SUBJECT: A Level Biology (ZIMSEC Syllabus 6030 / Cambridge 9700)
TOPIC: {topic}
LEVEL: {level} (Form {'5' if level == 'Lower Sixth' else '6'})
DIFFICULTY: {difficulty} - {difficulty_guidance.get(difficulty, difficulty_guidance['medium'])}

COMPREHENSIVE SUBTOPIC COVERAGE:
- This question MUST test understanding of a SPECIFIC subtopic within {topic}
- Reference: ZIMSEC 6030 past papers and Cambridge 9700 past papers
- Questions should rotate through all subtopics to ensure comprehensive topic coverage

KEY CONCEPTS FOR THIS TOPIC:
{', '.join(key_concepts) if key_concepts else 'General concepts for this topic'}

KEY TERMS TO USE (incorporate appropriately):
{', '.join(key_terms) if key_terms else 'Scientific terminology as appropriate'}

EXAM-STYLE QUESTION PATTERNS FOR THIS TOPIC:
- MCQ: definitions + recall traps, process steps, structure-function relationships, data interpretation, mechanism choice
- Structured: multi-step processes, explain/justify with biological reasoning, deduce from data, experimental design, predictions
- Essay: comprehensive discussion, compare and contrast, evaluate evidence, synthesis of multiple topics

CRITICAL FORMATTING RULES - PLAIN TEXT ONLY:
- ABSOLUTELY NO LaTeX delimiters like $ or \\( or \\).
- Use Unicode subscripts for chemical formulas: CO₂, O₂, H₂O, ATP, NADH (NOT CO_2 or $CO_2$)
- Use Unicode superscripts where needed: 10⁶, 10⁻⁹ (NOT 10^6 or $10^6$)
- Write numbers clearly: 3.5 × 10⁶ cells/mm³ (NOT $3.5 \\times 10^6$)
- Use proper symbols: μm for micrometers, μg for micrograms
- Use → for arrows in processes, % for percentages
- Examples: "ATP → ADP + Pᵢ", "glucose + O₂ → CO₂ + H₂O"

EXPERT EXAMINER GUIDELINES - PROFESSIONAL EXAM STANDARDS:
- Use appropriate A-Level command words: "define", "state", "explain", "describe", "identify", "compare", "deduce", "predict", "suggest"
- Create distractors based on common A-Level student misconceptions from past marking experience
- Ensure question tests the cognitive level appropriate for {difficulty}:
  * Easy: Knowledge and comprehension (recall facts, understand concepts, identify structures)
  * Medium: Application and analysis (apply knowledge, interpret data, analyze relationships, explain processes)
  * Difficult: Synthesis and evaluation (combine multiple concepts, evaluate scenarios, draw conclusions, predict outcomes)
- Question should feel FRESH and different from standard textbook questions
- Include relevant biological contexts and real-world applications where appropriate
- Distractors should be biologically plausible but clearly incorrect
- Reference ZIMSEC/Cambridge past papers and exam patterns

FRESHNESS REQUIREMENTS - CREATE UNIQUE QUESTIONS:
- Use unique scenarios NOT commonly found in typical textbook questions
- Vary contexts: laboratory experiments, medical scenarios, environmental biology, agricultural applications, biotechnology
- Vary numbers and approaches to test the same concept
- Ensure question feels professionally crafted like a real ZIMSEC/Cambridge exam question

COMMON EXAM TRAPS TO REFERENCE:
- Confusing similar terms (e.g., mitosis vs meiosis, transcription vs translation)
- Misunderstanding processes (e.g., active transport vs facilitated diffusion)
- Incorrect structure-function relationships
- Misinterpreting data or experimental results
- Confusing cause and effect in biological systems

REQUIREMENTS:
1. Create ONE multiple choice question with exactly 4 options (A, B, C, D)
2. The question must be at A Level standard - NOT O Level
3. Use correct biological terminology with PLAIN TEXT formatting
4. Use PLAIN TEXT Unicode notation - NO LaTeX or $ symbols
5. All distractors must be plausible and based on common A-Level misconceptions
6. Include context or scenarios where appropriate
7. Provide a DETAILED step-by-step explanation with teaching points
8. Include common errors students make on this topic

RESPONSE FORMAT (strict JSON):
{{
    "question": "The full question text (plain text, may include scenario or data)",
    "options": {{
        "A": "First option (plain text)",
        "B": "Second option (plain text)",
        "C": "Third option (plain text)",
        "D": "Fourth option (plain text)"
    }},
    "correct_answer": "A",
    "explanation": "Why this is correct and why other options are wrong",
    "teaching_points": "Key concepts students should understand from this question"
}}

Generate the MCQ now:"""
        return prompt
    
    def _create_structured_prompt(self, topic: str, difficulty: str, level: str,
                                 key_concepts: List[str], key_terms: List[str]) -> str:
        """Create prompt for structured questions (multi-part, short answers - 1 sentence each)"""
        
        prompt = f"""You are a SENIOR A-LEVEL BIOLOGY TEACHER (15+ years) AND an examiner-style question designer. You teach and assess for BOTH:
(A) ZIMSEC A Level Biology 6030 (Paper 1 MCQ, Paper 2 structured, Paper 3 essay)
(B) Cambridge International AS & A Level Biology 9700 (Paper 1 MCQ, Paper 2 structured, Paper 4 A Level structured, Paper 5 practical)

ROLE: SENIOR A-LEVEL BIOLOGY TEACHER & EXAMINER

NON-NEGOTIABLE RULES:
1. SYLLABUS-LOCKED: Only generate content that is examinable for ZIMSEC 6030 and Cambridge 9700
2. NO LEAKAGE: Do NOT introduce off-syllabus topics or university-level methods
3. EXAM AUTHENTICITY: Use real exam command words: "define", "state", "explain", "describe", "identify", "compare", "deduce", "predict", "suggest", "calculate"
4. ORIGINALITY: Do not copy past-paper questions verbatim. Generate ORIGINAL questions with the same SKILL pattern
5. MARKING REALISM: Provide mark allocation + method marks + accuracy marks + common errors
6. TOPIC INTEGRATION: Use mixed questions that combine topics the way real papers do (e.g., enzymes + metabolism, transport + gas exchange, genetics + evolution)

SUBJECT: A Level Biology (ZIMSEC Syllabus 6030 / Cambridge 9700)
TOPIC: {topic}
LEVEL: {level} (Form {'5' if level == 'Lower Sixth' else '6'})
DIFFICULTY: {difficulty}

KEY CONCEPTS: {', '.join(key_concepts) if key_concepts else 'General concepts'}
KEY TERMS: {', '.join(key_terms) if key_terms else 'Scientific terminology'}

CRITICAL FORMATTING RULES - PLAIN TEXT ONLY:
- ABSOLUTELY NO LaTeX delimiters like $ or \\( or \\).
- Use Unicode subscripts: CO₂, O₂, H₂O, ATP, NADH
- Use Unicode superscripts: 10⁶, 10⁻⁹
- Use proper symbols: μm, μg, →, %

IMPORTANT: Structured questions require SHORT, CONCISE answers (typically 1 sentence or brief phrase).
Each part should test a specific point that can be answered briefly but accurately.

CRITICAL RESTRICTIONS:
- DO NOT create questions that require diagrams or images
- DO NOT ask "What part is labeled X?" or "Identify the structure labeled Y"
- DO NOT ask questions that require visual identification from diagrams
- Focus on KNOWLEDGE-BASED questions that test understanding, recall, and application
- You may describe scenarios, processes, or concepts in text, but never require diagram interpretation

EXPERT EXAMINER GUIDELINES - PROFESSIONAL EXAM STANDARDS:
- Use appropriate A-Level command words: "define", "state", "explain", "describe", "identify", "compare", "deduce", "predict", "suggest", "calculate"
- Create marking schemes based on common A-Level student responses from past marking experience
- Ensure question tests the cognitive level appropriate for {difficulty}:
  * Easy: Knowledge and comprehension (recall facts, understand concepts, identify structures)
  * Medium: Application and analysis (apply knowledge, interpret data, analyze relationships, explain processes)
  * Difficult: Synthesis and evaluation (combine multiple concepts, evaluate scenarios, draw conclusions, predict outcomes)
- Question should feel FRESH and different from standard textbook questions
- Include relevant biological contexts and real-world applications where appropriate
- Reference ZIMSEC/Cambridge past papers and exam patterns

FRESHNESS REQUIREMENTS - CREATE UNIQUE QUESTIONS:
- Use unique scenarios NOT commonly found in typical textbook questions
- Vary contexts: laboratory experiments, medical scenarios, environmental biology, agricultural applications, biotechnology
- Vary data and approaches to test the same concept
- Ensure question feels professionally crafted like a real ZIMSEC/Cambridge exam question

COMMON EXAM TRAPS TO REFERENCE:
- Confusing similar terms or processes
- Misunderstanding structure-function relationships
- Misinterpreting data or experimental results
- Incorrect application of biological principles
- Confusing cause and effect in biological systems

REQUIREMENTS:
1. Use text-based scenarios, data tables, or process descriptions (NO diagram references)
2. Part (a): 2-3 marks - Test recall or basic understanding (SHORT answer - 1 sentence max)
3. Part (b): 3-4 marks - Test application or interpretation (SHORT answer - 1-2 sentences max)
4. Part (c): 3-4 marks - Test analysis or brief explanation (SHORT answer - 1-2 sentences max)
5. Keep total marks between 8-12 marks
6. Each part should be answerable in 1 sentence or brief phrase
7. All questions must be answerable using knowledge only - NO visual diagram interpretation
8. Provide full marking scheme with expected SHORT answers + method marks (M) and accuracy marks (A)
9. Include examiner tips for common mistakes and examiner notes
10. Use PLAIN TEXT Unicode notation - NO LaTeX

RESPONSE FORMAT (strict JSON):
{{
    "stimulus": "Text description of scenario, data table, or process (NO diagram references - use text descriptions only)",
    "question": "Main question introduction/context",
    "parts": [
        {{
            "part": "a",
            "label": "a",
            "question": "Part (a) question (should require SHORT answer)",
            "marks": 2,
            "expected_answer": "Brief expected answer (1 sentence)",
            "model_answer": "Brief model answer (1 sentence)",
            "marking_scheme": ["Point 1 [1 mark]", "Point 2 [1 mark]"]
        }},
        {{
            "part": "b",
            "label": "b",
            "question": "Part (b) question (should require SHORT answer)", 
            "marks": 3,
            "expected_answer": "Brief expected answer (1 sentence)",
            "model_answer": "Brief model answer (1 sentence)",
            "marking_scheme": ["Point 1 [1 mark]", "Point 2 [1 mark]", "Point 3 [1 mark]"]
        }},
        {{
            "part": "c",
            "label": "c",
            "question": "Part (c) question (should require SHORT answer)",
            "marks": 4,
            "expected_answer": "Brief expected answer (1-2 sentences max)",
            "model_answer": "Brief model answer (1-2 sentences max)",
            "marking_scheme": ["Point 1 [1 mark]", "Point 2 [1 mark]", "Point 3 [1 mark]", "Point 4 [1 mark]"]
        }}
    ],
    "total_marks": 9,
    "examiner_tips": ["Common mistakes to avoid", "Key points for full marks"],
    "teaching_points": "What students should learn from this question"
}}

Generate now:"""
        return prompt
    
    def _create_essay_prompt(self, topic: str, difficulty: str, level: str,
                            key_concepts: List[str], key_terms: List[str]) -> str:
        """Create prompt for essay questions (20-25 marks)"""
        
        prompt = f"""You are a SENIOR A-LEVEL BIOLOGY TEACHER (15+ years) AND an examiner-style question designer. You teach and assess for BOTH:
(A) ZIMSEC A Level Biology 6030 (Paper 1 MCQ, Paper 2 structured, Paper 3 essay)
(B) Cambridge International AS & A Level Biology 9700 (Paper 1 MCQ, Paper 2 structured, Paper 4 A Level structured, Paper 5 practical)

ROLE: SENIOR A-LEVEL BIOLOGY TEACHER & EXAMINER

NON-NEGOTIABLE RULES:
1. SYLLABUS-LOCKED: Only generate content that is examinable for ZIMSEC 6030 and Cambridge 9700
2. NO LEAKAGE: Do NOT introduce off-syllabus topics or university-level methods
3. EXAM AUTHENTICITY: Use real exam command words: "discuss", "explain", "compare and contrast", "evaluate", "describe", "analyze"
4. ORIGINALITY: Do not copy past-paper questions verbatim. Generate ORIGINAL questions with the same SKILL pattern
5. MARKING REALISM: Provide detailed mark allocation + content marks + structure marks + common errors
6. TOPIC INTEGRATION: Use essay questions that integrate multiple topics the way real papers do (e.g., enzymes + metabolism + respiration, transport + gas exchange + cellular respiration)

SUBJECT: A Level Biology (ZIMSEC Syllabus 6030 / Cambridge 9700)
TOPIC: {topic}
LEVEL: {level} (Form {'5' if level == 'Lower Sixth' else '6'})
DIFFICULTY: {difficulty}

KEY CONCEPTS TO COVER: {', '.join(key_concepts) if key_concepts else 'General concepts'}
KEY TERMS EXPECTED: {', '.join(key_terms) if key_terms else 'Scientific terminology'}

CRITICAL FORMATTING RULES - PLAIN TEXT ONLY:
- ABSOLUTELY NO LaTeX delimiters like $ or \\( or \\).
- Use Unicode subscripts: CO₂, O₂, H₂O, ATP, NADH
- Use Unicode superscripts: 10⁶, 10⁻⁹
- Use proper symbols: μm, μg, →, %

EXPERT EXAMINER GUIDELINES - PROFESSIONAL EXAM STANDARDS:
- Use appropriate A-Level essay command words: "discuss", "explain", "compare and contrast", "evaluate", "describe", "analyze"
- Create marking criteria based on common A-Level student responses from past marking experience
- Ensure question tests the cognitive level appropriate for {difficulty}:
  * Easy: Knowledge and comprehension (recall facts, describe processes)
  * Medium: Application and analysis (apply knowledge, analyze relationships, explain connections)
  * Difficult: Synthesis and evaluation (combine multiple concepts, evaluate evidence, draw conclusions, construct arguments)
- Question should feel FRESH and different from standard textbook questions
- Include relevant biological contexts and real-world applications where appropriate
- Reference ZIMSEC/Cambridge past papers and exam patterns

FRESHNESS REQUIREMENTS - CREATE UNIQUE ESSAY QUESTIONS:
- Use unique topics and angles NOT commonly found in typical textbook questions
- Vary contexts: laboratory experiments, medical scenarios, environmental biology, agricultural applications, biotechnology
- Ensure question feels professionally crafted like a real ZIMSEC/Cambridge exam question

COMMON ESSAY MISTAKES TO REFERENCE:
- Lack of structure and logical flow
- Insufficient use of biological terminology
- Missing key concepts or oversimplifying complex processes
- Failure to integrate related topics
- Poor use of examples and evidence

REQUIREMENTS:
1. Clear, focused question that allows students to demonstrate depth of knowledge
2. Question should require discussion of multiple aspects/concepts from {topic}
3. Use appropriate command words: "Discuss", "Explain", "Compare and contrast", "Evaluate", "Analyze"
4. Provide a detailed essay plan/outline showing expected structure with mark allocation
5. Include marking criteria for different grade boundaries with content marks and structure marks
6. List key biological terms that MUST be included for high marks
7. Use PLAIN TEXT Unicode notation - NO LaTeX

RESPONSE FORMAT (strict JSON):
{{
    "question": "The full essay question",
    "command_word": "Discuss/Explain/Compare/Evaluate etc.",
    "total_marks": 25,
    "time_allocation": "35-40 minutes",
    "essay_plan": {{
        "introduction": "What should be covered in introduction (2-3 marks)",
        "main_body": [
            {{
                "section": "First main point",
                "content": "What to discuss",
                "marks": 5
            }},
            {{
                "section": "Second main point", 
                "content": "What to discuss",
                "marks": 5
            }},
            {{
                "section": "Third main point",
                "content": "What to discuss",
                "marks": 5
            }},
            {{
                "section": "Fourth main point (if applicable)",
                "content": "What to discuss", 
                "marks": 5
            }}
        ],
        "conclusion": "How to conclude effectively (2-3 marks)"
    }},
    "must_include_terms": ["List of key terms that must appear in essay"],
    "marking_criteria": {{
        "A_grade": "Criteria for 20-25 marks",
        "B_grade": "Criteria for 15-19 marks",
        "C_grade": "Criteria for 10-14 marks",
        "below_C": "Common reasons for lower marks"
    }},
    "model_answer_outline": "A brief outline of what an excellent answer would include",
    "common_mistakes": ["Mistake 1", "Mistake 2", "Mistake 3"],
    "examiner_notes": "Examiner guidance: What examiners look for, common pitfalls, how to achieve top marks",
    "teaching_points": "Key learning from this essay topic",
    "marking_notes": "Marking scheme: Content marks (C) for accurate information, Structure marks (S) for organization and coherence, Quality marks (Q) for depth and synthesis.",
    "zimsec_paper_reference": "Paper 3 (essay)",
    "cambridge_paper_reference": "Paper 4 (essay/structured) as appropriate"
}}

Generate now:"""
        return prompt
    
    def _call_deepseek(self, prompt: str, question_type: str = "mcq") -> Optional[Dict]:
        """Call DeepSeek API with retries - optimized for Render's 30s timeout"""
        
        # Token allocation based on question complexity
        max_tokens = {
            "mcq": 1000,       # MCQ needs moderate tokens for good explanations
            "structured": 2000, # Structured needs more for parts and marking schemes
            "essay": 2500      # Essay needs most for comprehensive plans and criteria
        }.get(question_type, 1500)
        
        # Timeout increases with question complexity
        # Longer timeouts for complex questions that need more AI processing
        timeout = {
            "mcq": self.timeout_base,              # 30s for MCQ
            "structured": self.timeout_base + 10,  # 40s for structured (more parts to generate)
            "essay": self.timeout_base + 15        # 45s for essay (most complex, needs detailed plans)
        }.get(question_type, self.timeout_base)
        
        for attempt in range(self.max_retries):
            try:
                if not self.deepseek_api_key:
                    logger.error("DeepSeek API key not found")
                    return None
                
                headers = {
                    "Authorization": f"Bearer {self.deepseek_api_key}",
                    "Content-Type": "application/json"
                }
                
                payload = {
                    "model": "deepseek-chat",
                    "messages": [
                        {
                            "role": "system",
                            "content": """You are a SENIOR A-LEVEL BIOLOGY TEACHER (15+ years) AND an examiner-style question designer. You teach and assess for BOTH ZIMSEC A Level Biology 6030 and Cambridge International AS & A Level Biology 9700.

ROLE: SENIOR A-LEVEL BIOLOGY TEACHER & EXAMINER

NON-NEGOTIABLE RULES:
1. SYLLABUS-LOCKED: Only generate content examinable for ZIMSEC 6030 and Cambridge 9700
2. NO LEAKAGE: Do NOT introduce off-syllabus topics or university-level methods
3. EXAM AUTHENTICITY: Use real exam command words and structure
4. ORIGINALITY: Generate ORIGINAL questions with the same SKILL pattern (not verbatim past papers)
5. MARKING REALISM: Provide method marks + accuracy marks + common errors
6. TOPIC INTEGRATION: Use mixed questions combining topics the way real papers do

You create rigorous, high-quality questions that test deep biological understanding.
Always use correct biological terminology and provide detailed marking schemes with step-by-step explanations.

CRITICAL: Use PLAIN TEXT Unicode notation - NEVER use LaTeX or $ symbols:
- ABSOLUTELY NO delimiters like $.
- Use subscripts: CO₂, O₂, H₂O, ATP, NADH (NOT CO_2 or $CO_2$)
- Use superscripts: 10⁶, 10⁻⁹ (NOT 10^6)
- Use μm, μg for micro units
- Use → for arrows in reactions

Always respond with valid JSON containing step-by-step solutions."""
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "temperature": 0.6,  # Slightly lower for more focused responses
                    "max_tokens": max_tokens
                }
                
                logger.info(f"DeepSeek Biology {question_type} attempt {attempt + 1}/{self.max_retries} (timeout: {timeout}s, max_tokens: {max_tokens})")
                
                response = requests.post(
                    self.deepseek_url,
                    headers=headers,
                    json=payload,
                    timeout=timeout
                )
                
                if response.status_code != 200:
                    logger.error(f"DeepSeek API error: {response.status_code} - {response.text[:200]}")
                    continue
                
                result = response.json()
                content = result.get('choices', [{}])[0].get('message', {}).get('content', '')
                
                if not content:
                    logger.warning(f"Empty response from DeepSeek on attempt {attempt + 1}")
                    continue
                
                question_data = self._parse_response(content, question_type)
                if question_data:
                    logger.info(f"Successfully generated {question_type} question on attempt {attempt + 1}")
                    return question_data
                else:
                    logger.warning(f"Failed to parse response on attempt {attempt + 1}")
                    logger.debug(f"Response content preview (first 1000 chars): {content[:1000]}")
                    
            except requests.Timeout:
                logger.warning(f"DeepSeek timeout on attempt {attempt + 1}/{self.max_retries} after {timeout}s for {question_type}")
                # For essay/structured, try one more time with slightly reduced max_tokens if we have retries left
                if attempt < self.max_retries - 1 and question_type in ['essay', 'structured']:
                    logger.info(f"Retrying {question_type} with reduced max_tokens to speed up generation")
                    max_tokens = int(max_tokens * 0.9)  # Reduce by 10% to speed up
                continue
            except requests.exceptions.ConnectionError as e:
                logger.error(f"DeepSeek connection error on attempt {attempt + 1}: {e}")
                # Wait before retry for connection errors
                if attempt < self.max_retries - 1:
                    import time
                    time.sleep(2 * (attempt + 1))  # Exponential backoff: 2s, 4s, 6s
                continue
            except Exception as e:
                logger.error(f"Error calling DeepSeek API on attempt {attempt + 1}: {e}")
                # Wait before retry for other errors
                if attempt < self.max_retries - 1:
                    import time
                    time.sleep(1 * (attempt + 1))  # Exponential backoff: 1s, 2s, 3s
                continue
        
        logger.error(f"All {self.max_retries} DeepSeek attempts failed for Biology {question_type} question")
        return None
    
    def _call_gemini(self, prompt: str, question_type: str = "mcq") -> Optional[Dict]:
        """Call Gemini API as fallback when DeepSeek fails"""
        
        if not self._gemini_configured or not GENAI_AVAILABLE:
            logger.warning("Gemini not configured, cannot use as fallback")
            return None
        
        try:
            # Adjust max tokens based on question type
            max_tokens = {
                "mcq": 1200,
                "structured": 1800,
                "essay": 2200
            }.get(question_type, 1500)
            
            # Use Gemini Flash for speed
            model = genai.GenerativeModel('gemini-2.0-flash-exp')
            
            logger.info(f"Calling Gemini for Biology {question_type} (max_tokens: {max_tokens})")
            
            # Request JSON response
            response = model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    response_mime_type="application/json",
                    temperature=0.7,
                    max_output_tokens=max_tokens
                ),
                request_options={'timeout': 20}  # 20 second timeout
            )
            
            if response and hasattr(response, 'text') and response.text:
                content = response.text.strip()
                
                # Parse the response using existing parser
                question_data = self._parse_response(content, question_type)
                if question_data:
                    logger.info(f"Gemini successfully generated {question_type} question")
                    return question_data
                else:
                    logger.warning(f"Failed to parse Gemini response for {question_type}")
            else:
                logger.warning("Empty response from Gemini")
            
            return None
            
        except Exception as e:
            logger.error(f"Error calling Gemini API: {e}")
            return None
    
    def _parse_response(self, content: str, question_type: str) -> Optional[Dict]:
        """Parse JSON response from DeepSeek with truncation recovery"""
        try:
            content = content.strip()
            
            # Remove markdown code blocks
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
                logger.warning(f"Initial JSON parse failed for {question_type}: {e}")
                # Attempt to recover truncated JSON
                if question_type == "mcq":
                    question_data = self._recover_truncated_json(content)
                    if not question_data:
                        return None
                else:
                    # For structured/essay, try to find and parse a partial JSON object
                    question_data = self._recover_partial_json(content, question_type)
                    if not question_data:
                        logger.error(f"Could not recover JSON for {question_type} question")
                        return None
            
            # Validate and normalize based on question type
            if question_type == "mcq":
                required = ['question', 'options', 'correct_answer', 'explanation']
                for field in required:
                    if field not in question_data:
                        logger.error(f"Missing required field for MCQ: {field}")
                        return None
                return question_data
                
            elif question_type == "structured":
                # Structured questions can have 'question' or 'stimulus' field
                if 'stimulus' in question_data and 'question' not in question_data:
                    question_data['question'] = question_data.get('stimulus', '')
                
                # Check for required fields
                if 'parts' not in question_data:
                    logger.error("Missing required field 'parts' for structured question")
                    return None
                
                if not isinstance(question_data.get('parts'), list) or len(question_data['parts']) < 2:
                    logger.error(f"Invalid parts format: expected list with at least 2 parts, got {type(question_data.get('parts'))}")
                    return None
                
                # Ensure each part has required fields
                for i, part in enumerate(question_data['parts']):
                    if not isinstance(part, dict):
                        logger.error(f"Part {i} is not a dictionary")
                        return None
                    # Normalize part labels
                    if 'label' not in part and 'part' in part:
                        part['label'] = part['part']
                    if 'part' not in part and 'label' in part:
                        part['part'] = part['label']
                    # Ensure model_answer exists (can be from expected_answer)
                    if 'model_answer' not in part and 'expected_answer' in part:
                        part['model_answer'] = part['expected_answer']
                
                # Calculate total_marks if not provided
                if 'total_marks' not in question_data:
                    total = sum(p.get('marks', 0) for p in question_data['parts'])
                    question_data['total_marks'] = total
                    logger.info(f"Calculated total_marks: {total}")
                
                return question_data
                
            elif question_type == "essay":
                # Check for required fields
                if 'essay_plan' not in question_data:
                    logger.error("Missing required field 'essay_plan' for essay question")
                    return None
                
                if not isinstance(question_data.get('essay_plan'), dict):
                    logger.error(f"Invalid essay_plan format: expected dict, got {type(question_data.get('essay_plan'))}")
                    return None
                
                # Calculate total_marks if not provided
                if 'total_marks' not in question_data:
                    # Default to 25 marks for essay
                    question_data['total_marks'] = 25
                    logger.info("Set default total_marks: 25")
                
                return question_data
            else:
                if 'question' not in question_data:
                    logger.error("Missing required field 'question'")
                    return None
                return question_data
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON for {question_type}: {e}")
            logger.error(f"Content preview (first 1000 chars): {content[:1000]}...")
            logger.error(f"Content length: {len(content)} characters")
            # Try to recover truncated JSON for MCQ only
            if question_type == "mcq":
                recovered = self._recover_truncated_json(content)
                if recovered:
                    logger.info("Successfully recovered truncated MCQ JSON")
                    return recovered
            else:
                # For structured/essay, log more details for debugging
                logger.error(f"JSON parse error details: {str(e)}")
                logger.error(f"Error position: {getattr(e, 'pos', 'unknown')}")
            return None
        except Exception as e:
            logger.error(f"Error parsing response for {question_type}: {e}", exc_info=True)
            return None
    
    def _recover_truncated_json(self, content: str) -> Optional[Dict]:
        """Attempt to recover data from a truncated JSON response (MCQ only)"""
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
                logger.info("Successfully recovered truncated JSON response for Biology MCQ")
                return {
                    "question": question,
                    "options": options,
                    "correct_answer": correct_answer,
                    "explanation": explanation,
                    "teaching_points": "Review the key biological concepts for this topic."
                }
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to recover truncated JSON: {e}")
            return None
    
    def _recover_partial_json(self, content: str, question_type: str) -> Optional[Dict]:
        """Attempt to recover partial JSON for structured/essay questions"""
        try:
            import re
            
            # Find where JSON starts
            json_start = content.find('{')
            if json_start == -1:
                return None
            
            # Try to find the end of the JSON object by counting braces
            brace_count = 0
            json_end = json_start
            for i, char in enumerate(content[json_start:], start=json_start):
                if char == '{':
                    brace_count += 1
                elif char == '}':
                    brace_count -= 1
                    if brace_count == 0:
                        json_end = i + 1
                        break
            
            if json_end > json_start:
                json_str = content[json_start:json_end]
                try:
                    question_data = json.loads(json_str)
                    logger.info(f"Successfully recovered partial JSON for {question_type}")
                    return question_data
                except json.JSONDecodeError:
                    pass
            
            # If that fails, try progressively truncating from the end
            for truncate_pos in range(len(content), json_start + 50, -10):
                try:
                    json_str = content[json_start:truncate_pos] + '}'
                    question_data = json.loads(json_str)
                    logger.info(f"Successfully recovered truncated JSON for {question_type} by truncating at position {truncate_pos}")
                    return question_data
                except (json.JSONDecodeError, ValueError):
                    continue
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to recover partial JSON for {question_type}: {e}")
            return None
    
    def generate_exam_question(self, level: str = "Lower Sixth", 
                              difficulty: str = "medium",
                              question_type: str = "mcq") -> Optional[Dict]:
        """Generate random exam question from specified level"""
        import random
        
        topics = A_LEVEL_BIOLOGY_TOPICS.get(level, A_LEVEL_BIOLOGY_TOPICS["Lower Sixth"])
        topic = random.choice(topics)
        
        return self.generate_question(topic, difficulty, question_type=question_type)


# Singleton instance
a_level_biology_generator = ALevelBiologyGenerator()

