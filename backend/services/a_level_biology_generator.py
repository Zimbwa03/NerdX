"""
A Level Biology Question Generator.
Uses Vertex AI (Gemini) for all AI-generated items.
Supports MCQ, structured, and essay questions with marking schemes.
"""

import json
import logging
import os
from typing import Dict, Optional, List
from constants import A_LEVEL_BIOLOGY_TOPICS, A_LEVEL_BIOLOGY_ALL_TOPICS
from utils.vertex_ai_helper import try_vertex_json

logger = logging.getLogger(__name__)

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
    """Generator for A Level Biology questions using Vertex AI (Gemini)."""

    def __init__(self):
        self.max_retries = int(os.environ.get("A_LEVEL_BIOLOGY_VERTEX_RETRIES", "4"))
    

    def generate_question(self, topic: str, difficulty: str = "medium", 
                         user_id: str = None, question_type: str = "mcq") -> Optional[Dict]:
        """Generate an A Level Biology question with Vertex primary."""
        try:
            topic_name = self._get_topic_name(topic)
            if not topic_name:
                logger.error(f"Invalid A Level Biology topic: {topic}")
                return None

            topic_details = A_LEVEL_BIOLOGY_TOPIC_DETAILS.get(topic_name, {})
            level = topic_details.get("level", "A Level")
            key_concepts = topic_details.get("key_concepts", [])
            key_terms = topic_details.get("key_terms", [])

            if question_type == "essay":
                prompt = self._create_essay_prompt(topic_name, difficulty, level, key_concepts, key_terms)
            elif question_type == "structured":
                prompt = self._create_structured_prompt(topic_name, difficulty, level, key_concepts, key_terms)
            else:
                prompt = self._create_mcq_prompt(topic_name, difficulty, level, key_concepts, key_terms)

            def _is_valid_candidate(data: Dict) -> bool:
                if not isinstance(data, dict):
                    return False
                if question_type == "structured":
                    return bool(data.get("stem") and data.get("parts"))
                if question_type == "essay":
                    return bool(data.get("question"))
                return bool(data.get("question") and data.get("options"))

            ai_model = "vertex_ai"
            context = f"a_level_biology:{question_type}:{topic_name}:{difficulty}"
            vertex_prompt = f"{self._system_prompt()}\n\n{prompt}"

            question_data = None
            for attempt in range(self.max_retries):
                logger.info("Vertex AI attempt %s/%s for %s", attempt + 1, self.max_retries, context)
                raw = try_vertex_json(vertex_prompt, logger=logger, context=context, max_attempts=2)
                if raw:
                    normalized = self._validate_and_normalize_biology_question(raw, question_type)
                    if normalized and _is_valid_candidate(normalized):
                        question_data = normalized
                        break
                    logger.warning("Vertex AI returned invalid structure for %s (attempt %s)", context, attempt + 1)
                else:
                    logger.warning("Vertex AI returned no JSON for %s (attempt %s)", context, attempt + 1)

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
    

    def _system_prompt(self) -> str:
        """System prompt for Vertex AI generation."""
        return """You are a senior A Level Biology teacher (15+ years) and examiner-style question designer.
You teach and assess for BOTH ZIMSEC A Level Biology 6030 and Cambridge International AS & A Level Biology 9700.

NON-NEGOTIABLE RULES:
1. Syllabus locked: only generate examinable content for ZIMSEC 6030 and Cambridge 9700
2. No leakage: do not introduce off-syllabus or university-level methods
3. Exam authenticity: use real exam command words and structure
4. Originality: generate original questions with the same skill pattern
5. Marking realism: provide method marks, accuracy marks, and common errors
6. Topic integration: combine topics the way real papers do

CRITICAL: Use plain text notation and never use LaTeX or $ symbols:
- Do not include $ delimiters
- Use biology formulas like CO2, O2, H2O, ATP, NADH in plain text
- Use scientific notation like 10^6 and 10^-9 in plain text
- Use micro units as um and ug in plain text
- Use arrows like -> for reactions and processes

Always respond with valid JSON containing step-by-step solutions and marking schemes."""

    def _validate_and_normalize_biology_question(self, question_data: Optional[Dict], question_type: str) -> Optional[Dict]:
        """Validate and normalize parsed JSON from Vertex for MCQ / structured / essay."""
        if not isinstance(question_data, dict):
            return None
        try:
            if question_type == "mcq":
                required = ["question", "options", "correct_answer", "explanation"]
                for field in required:
                    if field not in question_data:
                        logger.error("Missing required field for MCQ: %s", field)
                        return None
                return question_data
            if question_type == "structured":
                if "stimulus" in question_data and "question" not in question_data:
                    question_data["question"] = question_data.get("stimulus", "")
                if "parts" not in question_data:
                    logger.error("Missing required field 'parts' for structured question")
                    return None
                if not isinstance(question_data.get("parts"), list) or len(question_data["parts"]) < 2:
                    logger.error("Invalid parts format for structured question")
                    return None
                for i, part in enumerate(question_data["parts"]):
                    if not isinstance(part, dict):
                        logger.error("Part %s is not a dictionary", i)
                        return None
                    if "label" not in part and "part" in part:
                        part["label"] = part["part"]
                    if "part" not in part and "label" in part:
                        part["part"] = part["label"]
                    if "model_answer" not in part and "expected_answer" in part:
                        part["model_answer"] = part["expected_answer"]
                if "total_marks" not in question_data:
                    question_data["total_marks"] = sum(p.get("marks", 0) for p in question_data["parts"])
                return question_data
            if question_type == "essay":
                if "essay_plan" not in question_data:
                    logger.error("Missing required field 'essay_plan' for essay question")
                    return None
                if not isinstance(question_data.get("essay_plan"), dict):
                    logger.error("Invalid essay_plan format")
                    return None
                if "total_marks" not in question_data:
                    question_data["total_marks"] = 25
                return question_data
            if "question" not in question_data:
                logger.error("Missing required field 'question'")
                return None
            return question_data
        except Exception as e:
            logger.error("Error normalizing biology question: %s", e, exc_info=True)
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
