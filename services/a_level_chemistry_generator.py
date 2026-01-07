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

logger = logging.getLogger(__name__)

# A Level Chemistry topic details with category and key concepts
A_LEVEL_CHEMISTRY_TOPIC_DETAILS = {
    # AS Level - Physical Chemistry
    "Atomic Structure": {
        "level": "AS Level",
        "category": "Physical Chemistry",
        "key_concepts": ["electron configuration", "orbitals", "ionization energy", "isotopes", "mass spectrometry"],
        "key_formulas": ["Ar = Σ(isotope mass × abundance) / 100"]
    },
    "Atoms, Molecules and Stoichiometry": {
        "level": "AS Level",
        "category": "Physical Chemistry",
        "key_concepts": ["mole concept", "Avogadro constant", "empirical formula", "limiting reagent", "yield"],
        "key_formulas": ["n = m/M", "n = CV", "n = V/24", "% yield = actual/theoretical × 100"]
    },
    "Chemical Bonding": {
        "level": "AS Level",
        "category": "Physical Chemistry",
        "key_concepts": ["ionic bonding", "covalent bonding", "metallic bonding", "VSEPR", "intermolecular forces"],
        "key_formulas": []
    },
    "States of Matter": {
        "level": "AS Level",
        "category": "Physical Chemistry",
        "key_concepts": ["ideal gas", "kinetic theory", "partial pressures", "lattice structures"],
        "key_formulas": ["pV = nRT", "pₐ = xₐ × pₜₒₜₐₗ"]
    },
    "Chemical Energetics": {
        "level": "AS Level",
        "category": "Physical Chemistry",
        "key_concepts": ["enthalpy changes", "Hess's law", "bond energies", "calorimetry"],
        "key_formulas": ["q = mcΔT", "ΔH = Σ(bonds broken) - Σ(bonds formed)"]
    },
    "Electrochemistry": {
        "level": "AS Level",
        "category": "Physical Chemistry",
        "key_concepts": ["oxidation numbers", "redox reactions", "half-equations", "electrolysis"],
        "key_formulas": ["OIL RIG: Oxidation Is Loss, Reduction Is Gain"]
    },
    "Equilibria": {
        "level": "AS Level",
        "category": "Physical Chemistry",
        "key_concepts": ["dynamic equilibrium", "Le Chatelier's principle", "Kc expression"],
        "key_formulas": ["Kc = [products]ⁿ/[reactants]ᵐ"]
    },
    "Reaction Kinetics": {
        "level": "AS Level",
        "category": "Physical Chemistry",
        "key_concepts": ["rate of reaction", "collision theory", "activation energy", "catalysts"],
        "key_formulas": ["Rate = Δ[C]/Δt"]
    },
    # AS Level - Inorganic Chemistry
    "The Periodic Table: Chemical Periodicity": {
        "level": "AS Level",
        "category": "Inorganic Chemistry",
        "key_concepts": ["periodic trends", "ionization energy", "electronegativity", "Period 3 oxides and chlorides"],
        "key_formulas": []
    },
    "Group 2 Elements": {
        "level": "AS Level",
        "category": "Inorganic Chemistry",
        "key_concepts": ["alkaline earth metals", "reactivity trends", "thermal decomposition", "solubility trends"],
        "key_formulas": []
    },
    "Group 17 Elements": {
        "level": "AS Level",
        "category": "Inorganic Chemistry",
        "key_concepts": ["halogens", "displacement reactions", "halide tests", "disproportionation"],
        "key_formulas": []
    },
    "Nitrogen and Sulfur": {
        "level": "AS Level",
        "category": "Inorganic Chemistry",
        "key_concepts": ["nitrogen cycle", "nitrogen oxides", "sulfur oxides", "acid rain"],
        "key_formulas": []
    },
    # AS Level - Organic Chemistry
    "Introduction to Organic Chemistry": {
        "level": "AS Level",
        "category": "Organic Chemistry",
        "key_concepts": ["nomenclature", "functional groups", "isomerism", "reaction types"],
        "key_formulas": []
    },
    "Hydrocarbons": {
        "level": "AS Level",
        "category": "Organic Chemistry",
        "key_concepts": ["alkanes", "alkenes", "free radical substitution", "electrophilic addition"],
        "key_formulas": ["CₙH₂ₙ₊₂ (alkanes)", "CₙH₂ₙ (alkenes)"]
    },
    "Halogen Compounds": {
        "level": "AS Level",
        "category": "Organic Chemistry",
        "key_concepts": ["halogenoalkanes", "nucleophilic substitution", "SN1 and SN2", "elimination"],
        "key_formulas": []
    },
    "Hydroxy Compounds": {
        "level": "AS Level",
        "category": "Organic Chemistry",
        "key_concepts": ["alcohols", "classification", "oxidation", "esterification"],
        "key_formulas": []
    },
    "Carbonyl Compounds": {
        "level": "AS Level",
        "category": "Organic Chemistry",
        "key_concepts": ["aldehydes", "ketones", "nucleophilic addition", "Tollens' and Fehling's tests"],
        "key_formulas": []
    },
    "Carboxylic Acids and Derivatives": {
        "level": "AS Level",
        "category": "Organic Chemistry",
        "key_concepts": ["carboxylic acids", "esters", "acyl chlorides", "hydrolysis"],
        "key_formulas": []
    },
    "Nitrogen Compounds": {
        "level": "AS Level",
        "category": "Organic Chemistry",
        "key_concepts": ["amines", "amides", "amino acids", "peptide bonds"],
        "key_formulas": []
    },
    "Polymerisation": {
        "level": "AS Level",
        "category": "Organic Chemistry",
        "key_concepts": ["addition polymerisation", "condensation polymerisation", "polymers", "recycling"],
        "key_formulas": []
    },
    "Organic Synthesis": {
        "level": "AS Level",
        "category": "Organic Chemistry",
        "key_concepts": ["multi-step synthesis", "functional group interconversions", "retrosynthesis"],
        "key_formulas": []
    },
    "Analytical Techniques": {
        "level": "AS Level",
        "category": "Analysis",
        "key_concepts": ["mass spectrometry", "infrared spectroscopy", "functional group identification"],
        "key_formulas": []
    },
    # A2 Level Topics
    "Chemical Energetics (Advanced)": {
        "level": "A2 Level",
        "category": "Physical Chemistry",
        "key_concepts": ["lattice energy", "Born-Haber cycles", "entropy", "Gibbs free energy"],
        "key_formulas": ["ΔG = ΔH - TΔS", "ΔS_total = ΔS_system + ΔS_surroundings"]
    },
    "Electrochemistry (Advanced)": {
        "level": "A2 Level",
        "category": "Physical Chemistry",
        "key_concepts": ["electrode potentials", "standard hydrogen electrode", "electrochemical cells", "Nernst equation"],
        "key_formulas": ["E°cell = E°cathode - E°anode", "E = E° - (RT/nF)lnQ"]
    },
    "Equilibria (Advanced)": {
        "level": "A2 Level",
        "category": "Physical Chemistry",
        "key_concepts": ["Kp", "Kw", "pH calculations", "buffers", "solubility product Ksp"],
        "key_formulas": ["pH = -log[H⁺]", "Kw = [H⁺][OH⁻]", "Henderson-Hasselbalch equation"]
    },
    "Reaction Kinetics (Advanced)": {
        "level": "A2 Level",
        "category": "Physical Chemistry",
        "key_concepts": ["rate equations", "rate constants", "order of reaction", "Arrhenius equation"],
        "key_formulas": ["Rate = k[A]ᵐ[B]ⁿ", "t½ = ln2/k", "ln k = ln A - Ea/RT"]
    },
    "Chemistry of Transition Elements": {
        "level": "A2 Level",
        "category": "Inorganic Chemistry",
        "key_concepts": ["d-block properties", "variable oxidation states", "complex ions", "ligands", "catalysis"],
        "key_formulas": []
    },
    "Benzene and Aromatic Compounds": {
        "level": "A2 Level",
        "category": "Organic Chemistry",
        "key_concepts": ["benzene structure", "delocalization", "electrophilic substitution", "nitration", "Friedel-Crafts"],
        "key_formulas": []
    },
    "Phenols": {
        "level": "A2 Level",
        "category": "Organic Chemistry",
        "key_concepts": ["phenol acidity", "comparison with alcohols", "electrophilic substitution"],
        "key_formulas": []
    },
    "Carbonyl Compounds (Advanced)": {
        "level": "A2 Level",
        "category": "Organic Chemistry",
        "key_concepts": ["reactions with HCN", "condensation reactions", "aldol reaction", "keto-enol tautomerism"],
        "key_formulas": []
    },
    "Carboxylic Acids and Derivatives (Advanced)": {
        "level": "A2 Level",
        "category": "Organic Chemistry",
        "key_concepts": ["acid derivatives", "nucleophilic acyl substitution", "acid anhydrides"],
        "key_formulas": []
    },
    "Nitrogen Compounds (Advanced)": {
        "level": "A2 Level",
        "category": "Organic Chemistry",
        "key_concepts": ["nitriles", "diazonium salts", "azo dyes", "aromatic amines"],
        "key_formulas": []
    },
    "Polymerisation (Advanced)": {
        "level": "A2 Level",
        "category": "Organic Chemistry",
        "key_concepts": ["copolymers", "polymer properties", "cross-linking", "thermosetting polymers"],
        "key_formulas": []
    },
    "Organic Synthesis (Advanced)": {
        "level": "A2 Level",
        "category": "Organic Chemistry",
        "key_concepts": ["complex synthesis", "stereochemistry", "protecting groups"],
        "key_formulas": []
    },
    "Analytical Techniques (Advanced)": {
        "level": "A2 Level",
        "category": "Analysis",
        "key_concepts": ["¹H NMR", "¹³C NMR", "chemical shift", "splitting patterns", "HPLC"],
        "key_formulas": []
    }
}


class ALevelChemistryGenerator:
    """Generator for A Level Chemistry MCQ questions using DeepSeek AI"""
    
    def __init__(self):
        self.deepseek_api_key = os.environ.get('DEEPSEEK_API_KEY')
        self.deepseek_url = "https://api.deepseek.com/v1/chat/completions"
        self.timeout = 45  # Base timeout for chemistry questions
        self.max_retries = 3  # Retry up to 3 times
    
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
    
    def generate_question(self, topic: str, difficulty: str = "medium", user_id: str = None) -> Optional[Dict]:
        """Generate an A Level Chemistry MCQ question"""
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
            
            # Create detailed prompt for DeepSeek
            prompt = self._create_question_prompt(topic_name, difficulty, level, category, key_concepts, key_formulas)
            
            # Generate question using DeepSeek
            question_data = self._call_deepseek(prompt)
            
            if question_data:
                question_data['subject'] = 'A Level Chemistry'
                question_data['topic'] = topic_name
                question_data['category'] = category
                question_data['difficulty'] = difficulty
                question_data['level'] = level
                question_data['source'] = 'ai_generated_a_level'
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
        
        prompt = f"""You are an expert A Level Chemistry examiner. Generate a high-quality multiple choice question for the Cambridge/ZIMSEC A Level Chemistry syllabus.

TOPIC: {topic}
CATEGORY: {category}
LEVEL: {level}
DIFFICULTY: {difficulty} - {difficulty_guidance.get(difficulty, difficulty_guidance['medium'])}

KEY CONCEPTS TO COVER: {', '.join(key_concepts) if key_concepts else 'General concepts for this topic'}

KEY FORMULAS (use when appropriate): {', '.join(key_formulas) if key_formulas else 'As applicable'}

CRITICAL FORMATTING RULES - DO NOT USE LaTeX OR $ SYMBOLS:
- Use Unicode subscripts for formulas: H₂O, CO₂, CH₃COOH, SO₄²⁻ (NOT H_2O or $H_2O$)
- Use Unicode superscripts for charges/powers: Cu²⁺, Fe³⁺, 10⁻³ (NOT Cu^2+ or $Cu^{{2+}}$)
- Write fractions as: a/b (NOT $\\frac{{a}}{{b}}$)
- Use → for reaction arrows, ⇌ for equilibrium
- Use Δ for delta: ΔH, ΔG, ΔS
- Use ° for degrees: 25°C, 298 K
- Examples: "CaCO₃ → CaO + CO₂", "pH = -log[H⁺]", "Kc = [products]/[reactants]"

REQUIREMENTS:
1. Create ONE multiple choice question with 4 options (A, B, C, D)
2. The question should be clear, scientifically accurate, and at A Level standard
3. Use PLAIN TEXT Unicode notation - NO LaTeX or $ symbols
4. All options must be plausible - avoid obviously wrong answers
5. For calculation questions, show appropriate significant figures and units
6. The correct answer must be chemically accurate
7. Provide a detailed explanation suitable for A Level students

RESPONSE FORMAT (JSON):
{{
    "question": "The full question text here (plain text)",
    "options": {{
        "A": "First option (plain text)",
        "B": "Second option (plain text)",
        "C": "Third option (plain text)",
        "D": "Fourth option (plain text)"
    }},
    "correct_answer": "A",
    "explanation": "Detailed explanation of why this is correct and why other options are wrong",
    "solution": "Step-by-step solution for calculation questions (or concept explanation for theory questions)",
    "teaching_explanation": "Additional teaching points for the student"
}}

Generate the question now:"""

        return prompt
    
    def _call_deepseek(self, prompt: str) -> Optional[Dict]:
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
                
                payload = {
                    "model": "deepseek-chat",
                    "messages": [
                        {
                            "role": "system",
                            "content": """You are an expert A Level Chemistry examiner. Generate high-quality MCQ questions suitable for Cambridge/ZIMSEC A Level Chemistry examinations.

CRITICAL: Use PLAIN TEXT Unicode notation - NEVER use LaTeX or $ symbols:
- Use subscripts: H₂O, CO₂, SO₄²⁻ (NOT H_2O or $H_2O$)
- Use superscripts for charges: Cu²⁺, Fe³⁺ (NOT Cu^2+)
- Use fractions as a/b (NOT $\\frac{a}{b}$)
- Use → for arrows, ⇌ for equilibrium, Δ for delta

Always respond with valid JSON."""
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "temperature": 0.7,
                    "max_tokens": 1500
                }
                
                # Increase timeout with each retry attempt
                timeout = self.timeout + (attempt * 15)
                logger.info(f"DeepSeek Chemistry attempt {attempt + 1}/{self.max_retries} (timeout: {timeout}s)")
                
                response = requests.post(
                    self.deepseek_url,
                    headers=headers,
                    json=payload,
                    timeout=timeout
                )
                
                if response.status_code != 200:
                    logger.error(f"DeepSeek API error: {response.status_code} - {response.text}")
                    if attempt < self.max_retries - 1:
                        time.sleep(2)  # Wait before retry
                        continue
                    return None
                
                result = response.json()
                content = result.get('choices', [{}])[0].get('message', {}).get('content', '')
                
                # Parse JSON from response
                question_data = self._parse_question_response(content)
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
                if attempt < self.max_retries - 1:
                    time.sleep(2)  # Wait before retry
                    continue
            except Exception as e:
                logger.error(f"Error calling DeepSeek API on attempt {attempt + 1}: {e}")
                if attempt < self.max_retries - 1:
                    time.sleep(2)
                    continue
        
        logger.error("All DeepSeek retry attempts failed for Chemistry question")
        return None
    
    def _parse_question_response(self, content: str) -> Optional[Dict]:
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
