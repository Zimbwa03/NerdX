"""
A Level Biology Question Generator
Uses DeepSeek AI to generate MCQ, Structured, and Essay questions for ZIMSEC A Level syllabus (Code 6030)
Supports three distinct question formats with comprehensive marking schemes
"""

import json
import logging
import requests
import os
from typing import Dict, Optional, List
from constants import A_LEVEL_BIOLOGY_TOPICS, A_LEVEL_BIOLOGY_ALL_TOPICS

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
    """Generator for A Level Biology questions using DeepSeek AI - supports MCQ, Structured, and Essay"""
    
    def __init__(self):
        self.deepseek_api_key = os.environ.get('DEEPSEEK_API_KEY')
        self.deepseek_url = "https://api.deepseek.com/v1/chat/completions"
        self.max_retries = 3
        self.timeout = 60  # Longer timeout for essay questions
    
    def generate_question(self, topic: str, difficulty: str = "medium", 
                         user_id: str = None, question_type: str = "mcq") -> Optional[Dict]:
        """
        Generate an A Level Biology question
        
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
            
            # Generate question using DeepSeek
            question_data = self._call_deepseek(prompt, question_type)
            
            if question_data:
                question_data['subject'] = 'A Level Biology'
                question_data['topic'] = topic_name
                question_data['topic_id'] = topic
                question_data['difficulty'] = difficulty
                question_data['level'] = level
                question_data['question_type'] = question_type
                question_data['source'] = 'ai_generated_a_level_biology'
                question_data['ai_model'] = 'deepseek'
                return question_data
            
            return None
            
        except Exception as e:
            logger.error(f"Error generating A Level Biology question: {e}")
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
        
        prompt = f"""You are an expert ZIMSEC A Level Biology examiner. Generate a high-quality multiple choice question.

SUBJECT: A Level Biology (ZIMSEC Syllabus 6030)
TOPIC: {topic}
LEVEL: {level}
DIFFICULTY: {difficulty} - {difficulty_guidance.get(difficulty, difficulty_guidance['medium'])}

KEY CONCEPTS: {', '.join(key_concepts) if key_concepts else 'General concepts for this topic'}
KEY TERMS TO USE: {', '.join(key_terms) if key_terms else 'Scientific terminology as appropriate'}

REQUIREMENTS:
1. Create ONE multiple choice question with exactly 4 options (A, B, C, D)
2. The question must be at A Level standard (not O Level)
3. Use correct biological terminology
4. All distractors must be plausible (based on common misconceptions)
5. Include context or scenarios where appropriate
6. Provide a detailed explanation with teaching points

RESPONSE FORMAT (strict JSON):
{{
    "question": "The full question text (may include scenario or data)",
    "options": {{
        "A": "First option",
        "B": "Second option",
        "C": "Third option",
        "D": "Fourth option"
    }},
    "correct_answer": "A",
    "explanation": "Why this is correct and why other options are wrong",
    "teaching_points": "Key concepts students should understand from this question"
}}

Generate the MCQ now:"""
        return prompt
    
    def _create_structured_prompt(self, topic: str, difficulty: str, level: str,
                                 key_concepts: List[str], key_terms: List[str]) -> str:
        """Create prompt for structured questions (multi-part, 10-15 marks)"""
        
        prompt = f"""You are an expert ZIMSEC A Level Biology examiner. Generate a structured question worth 12-15 marks.

SUBJECT: A Level Biology (ZIMSEC Syllabus 6030)
TOPIC: {topic}
LEVEL: {level}
DIFFICULTY: {difficulty}

KEY CONCEPTS: {', '.join(key_concepts) if key_concepts else 'General concepts'}
KEY TERMS: {', '.join(key_terms) if key_terms else 'Scientific terminology'}

Create a multi-part structured question that progressively tests deeper understanding.

REQUIREMENTS:
1. Include a stimulus (diagram description, table, graph, or scenario) if appropriate
2. Part (a): 2-3 marks - Test recall or basic understanding
3. Part (b): 3-4 marks - Test application or interpretation
4. Part (c): 4-5 marks - Test analysis or extended explanation
5. Part (d): 2-3 marks - Test evaluation or links to other topics (optional)
6. Provide full marking scheme with expected answers
7. Include examiner tips for common mistakes

RESPONSE FORMAT (strict JSON):
{{
    "stimulus": "Description of any diagram, table, or scenario (or null if not needed)",
    "question": "Main question introduction/context",
    "parts": [
        {{
            "part": "a",
            "question": "Part (a) question",
            "marks": 3,
            "expected_answer": "What the examiner expects to see",
            "marking_scheme": ["Point 1 [1 mark]", "Point 2 [1 mark]", "Point 3 [1 mark]"]
        }},
        {{
            "part": "b",
            "question": "Part (b) question", 
            "marks": 4,
            "expected_answer": "Expected answer for part (b)",
            "marking_scheme": ["Point 1 [1 mark]", "Point 2 [1 mark]", "etc."]
        }},
        {{
            "part": "c",
            "question": "Part (c) question",
            "marks": 5,
            "expected_answer": "Expected answer for part (c)",
            "marking_scheme": ["Detailed marking points"]
        }}
    ],
    "total_marks": 12,
    "examiner_tips": ["Common mistakes to avoid", "Key points for full marks"],
    "teaching_points": "What students should learn from this question"
}}

Generate the structured question now:"""
        return prompt
    
    def _create_essay_prompt(self, topic: str, difficulty: str, level: str,
                            key_concepts: List[str], key_terms: List[str]) -> str:
        """Create prompt for essay questions (20-25 marks)"""
        
        prompt = f"""You are an expert ZIMSEC A Level Biology examiner. Generate an essay question worth 20-25 marks.

SUBJECT: A Level Biology (ZIMSEC Syllabus 6030)
TOPIC: {topic}
LEVEL: {level}
DIFFICULTY: {difficulty}

KEY CONCEPTS TO COVER: {', '.join(key_concepts) if key_concepts else 'General concepts'}
KEY TERMS EXPECTED: {', '.join(key_terms) if key_terms else 'Scientific terminology'}

Create an essay question that tests comprehensive understanding and ability to construct a coherent argument.

REQUIREMENTS:
1. Clear, focused question that allows students to demonstrate depth of knowledge
2. Question should require discussion of multiple aspects/concepts
3. May include "Discuss", "Explain", "Compare and contrast", "Evaluate" command words
4. Provide a detailed essay plan/outline showing expected structure
5. Include marking criteria for different grade boundaries
6. List key biological terms that MUST be included for high marks

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
    "teaching_points": "Key learning from this essay topic"
}}

Generate the essay question now:"""
        return prompt
    
    def _call_deepseek(self, prompt: str, question_type: str = "mcq") -> Optional[Dict]:
        """Call DeepSeek API with retries"""
        
        # Adjust tokens based on question type
        max_tokens = {
            "mcq": 1500,
            "structured": 2500,
            "essay": 3500
        }.get(question_type, 2000)
        
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
                            "content": """You are an expert A Level Biology examiner for ZIMSEC examinations.
You create rigorous, high-quality questions that test deep biological understanding.
Always use correct biological terminology and provide detailed marking schemes.
Respond with valid JSON only - no markdown or extra text."""
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "temperature": 0.7,
                    "max_tokens": max_tokens
                }
                
                timeout = self.timeout + (attempt * 15)
                logger.info(f"DeepSeek Biology {question_type} attempt {attempt + 1}/{self.max_retries}")
                
                response = requests.post(
                    self.deepseek_url,
                    headers=headers,
                    json=payload,
                    timeout=timeout
                )
                
                if response.status_code != 200:
                    logger.error(f"DeepSeek API error: {response.status_code} - {response.text}")
                    continue
                
                result = response.json()
                content = result.get('choices', [{}])[0].get('message', {}).get('content', '')
                
                question_data = self._parse_response(content, question_type)
                if question_data:
                    return question_data
                    
            except requests.Timeout:
                logger.warning(f"DeepSeek timeout on attempt {attempt + 1}/{self.max_retries}")
                continue
            except Exception as e:
                logger.error(f"Error calling DeepSeek API on attempt {attempt + 1}: {e}")
                continue
        
        logger.error("All DeepSeek retry attempts failed for Biology question")
        return None
    
    def _parse_response(self, content: str, question_type: str) -> Optional[Dict]:
        """Parse JSON response from DeepSeek"""
        try:
            content = content.strip()
            
            # Remove markdown code blocks
            if '```json' in content:
                start = content.find('```json') + 7
                end = content.find('```', start)
                content = content[start:end].strip()
            elif '```' in content:
                start = content.find('```') + 3
                end = content.find('```', start)
                content = content[start:end].strip()
            
            question_data = json.loads(content)
            
            # Validate based on question type
            if question_type == "mcq":
                required = ['question', 'options', 'correct_answer', 'explanation']
            elif question_type == "structured":
                required = ['question', 'parts', 'total_marks']
            elif question_type == "essay":
                required = ['question', 'essay_plan', 'total_marks']
            else:
                required = ['question']
            
            for field in required:
                if field not in question_data:
                    logger.error(f"Missing required field: {field}")
                    return None
            
            return question_data
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON: {e}")
            logger.error(f"Content preview: {content[:500]}...")
            return None
        except Exception as e:
            logger.error(f"Error parsing response: {e}")
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

