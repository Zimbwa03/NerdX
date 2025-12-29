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
    logger.info("✅ google.generativeai loaded for A Level Biology Generator")
except ImportError:
    genai = None
    GENAI_AVAILABLE = False
    logger.warning("⚠️ google.generativeai not available, will use DeepSeek only")

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
        self.max_retries = 2  # 2 attempts for DeepSeek
        self.timeout = 18  # Reduced to allow fallback within Render's 30s limit
        
        # Gemini configuration (fallback)
        self.gemini_api_key = os.environ.get('GEMINI_API_KEY')
        self._gemini_configured = False
        
        if self.gemini_api_key and GENAI_AVAILABLE:
            try:
                genai.configure(api_key=self.gemini_api_key)
                self._gemini_configured = True
                logger.info("✅ Gemini AI configured as FALLBACK provider for A Level Biology")
            except Exception as e:
                logger.error(f"Failed to configure Gemini: {e}")
        
        if self.deepseek_api_key:
            logger.info("✅ DeepSeek AI configured as PRIMARY provider for A Level Biology")
    
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
            logger.info(f"🔷 Trying DeepSeek (primary) for A Level Biology {question_type} on {topic_name}")
            question_data = self._call_deepseek(prompt, question_type)
            
            # FALLBACK: If DeepSeek fails, try Gemini
            if not question_data and self._gemini_configured:
                logger.warning(f"DeepSeek failed, falling back to Gemini for {question_type} on {topic_name}")
                question_data = self._call_gemini(prompt, question_type)
                if question_data:
                    ai_model = 'gemini'
                    logger.info(f"✅ Gemini successfully generated {question_type} for {topic_name}")
            
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
        """Create concise prompt for structured questions (optimized for speed)"""
        
        concepts_str = ', '.join(key_concepts[:3]) if key_concepts else 'key concepts'
        
        prompt = f"""Generate A Level Biology structured question (12 marks) on {topic}.

Level: {level} | Difficulty: {difficulty}
Concepts: {concepts_str}

JSON format:
{{
    "question": "Main context/stem",
    "parts": [
        {{"part": "a", "question": "...", "marks": 3, "expected_answer": "..."}},
        {{"part": "b", "question": "...", "marks": 4, "expected_answer": "..."}},
        {{"part": "c", "question": "...", "marks": 5, "expected_answer": "..."}}
    ],
    "total_marks": 12,
    "teaching_points": "Key learning"
}}

Generate now:"""
        return prompt
    
    def _create_essay_prompt(self, topic: str, difficulty: str, level: str,
                            key_concepts: List[str], key_terms: List[str]) -> str:
        """Create concise prompt for essay questions (optimized for speed)"""
        
        concepts_str = ', '.join(key_concepts[:4]) if key_concepts else 'main concepts'
        terms_str = ', '.join(key_terms[:5]) if key_terms else 'key terms'
        
        prompt = f"""Generate A Level Biology essay question (25 marks) on {topic}.

Level: {level} | Difficulty: {difficulty}
Key concepts: {concepts_str}
Required terms: {terms_str}

JSON format:
{{
    "question": "Full essay question (use Discuss/Explain/Compare)",
    "command_word": "Discuss/Explain/Compare",
    "total_marks": 25,
    "essay_plan": {{
        "introduction": "Key intro points",
        "main_body": [
            {{"section": "Point 1", "content": "...", "marks": 6}},
            {{"section": "Point 2", "content": "...", "marks": 6}},
            {{"section": "Point 3", "content": "...", "marks": 6}}
        ],
        "conclusion": "Conclusion guidance"
    }},
    "must_include_terms": ["term1", "term2", "term3"],
    "teaching_points": "Key learning"
}}

Generate now:"""
        return prompt
    
    def _call_deepseek(self, prompt: str, question_type: str = "mcq") -> Optional[Dict]:
        """Call DeepSeek API with retries - optimized for Render's 30s timeout"""
        
        # Reduced tokens for faster response (Render has 30s edge timeout)
        # These are significantly reduced to ensure we get responses within timeout
        max_tokens = {
            "mcq": 800,        # MCQ needs minimal tokens
            "structured": 1200, # Reduced from 1500
            "essay": 1500      # Reduced from 2000
        }.get(question_type, 1000)
        
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
                    "temperature": 0.6,  # Slightly lower for more focused responses
                    "max_tokens": max_tokens
                }
                
                # Use consistent timeout that fits within Render's 30s limit
                timeout = self.timeout
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
                    
            except requests.Timeout:
                logger.warning(f"DeepSeek timeout on attempt {attempt + 1}/{self.max_retries} after {self.timeout}s for {question_type}")
                # Continue to next attempt (if any) or return None to trigger fallback
                continue
            except Exception as e:
                logger.error(f"Error calling DeepSeek API on attempt {attempt + 1}: {e}")
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
                    logger.info(f"✅ Gemini successfully generated {question_type} question")
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

