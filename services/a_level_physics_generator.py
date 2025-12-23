"""
A Level Physics Question Generator
Uses DeepSeek AI to generate advanced physics MCQ questions for Cambridge/ZIMSEC A Level syllabus
"""

import json
import logging
import requests
import os
from typing import Dict, Optional
from constants import A_LEVEL_PHYSICS_TOPICS, A_LEVEL_PHYSICS_ALL_TOPICS

logger = logging.getLogger(__name__)

# A Level Physics topic details with learning objectives for better prompts
A_LEVEL_PHYSICS_TOPIC_DETAILS = {
    # AS Level Topics
    "Physical Quantities and Units": {
        "level": "AS Level",
        "key_concepts": ["SI units", "prefixes", "uncertainties", "scalars and vectors", "dimensional analysis"],
        "key_formulas": ["percentage uncertainty = (absolute/value) × 100%"]
    },
    "Kinematics": {
        "level": "AS Level", 
        "key_concepts": ["displacement", "velocity", "acceleration", "equations of motion", "projectile motion", "motion graphs"],
        "key_formulas": ["v = u + at", "s = ut + ½at²", "v² = u² + 2as", "s = ½(u+v)t"]
    },
    "Dynamics": {
        "level": "AS Level",
        "key_concepts": ["Newton's laws", "momentum", "impulse", "conservation of momentum", "elastic and inelastic collisions"],
        "key_formulas": ["F = ma", "p = mv", "Impulse = FΔt = Δp"]
    },
    "Forces, Density, and Pressure": {
        "level": "AS Level",
        "key_concepts": ["density", "pressure", "hydrostatic pressure", "upthrust", "Archimedes' principle"],
        "key_formulas": ["ρ = m/V", "P = F/A", "P = ρgh"]
    },
    "Work, Energy, and Power": {
        "level": "AS Level",
        "key_concepts": ["work done", "kinetic energy", "potential energy", "conservation of energy", "efficiency"],
        "key_formulas": ["W = Fs cos θ", "KE = ½mv²", "PE = mgh", "P = W/t = Fv"]
    },
    "Deformation of Solids": {
        "level": "AS Level",
        "key_concepts": ["Hooke's law", "stress", "strain", "Young modulus", "elastic and plastic deformation"],
        "key_formulas": ["F = kx", "σ = F/A", "ε = ΔL/L", "E = σ/ε"]
    },
    "Waves": {
        "level": "AS Level",
        "key_concepts": ["wave properties", "transverse and longitudinal waves", "electromagnetic spectrum", "polarization", "Doppler effect"],
        "key_formulas": ["v = fλ", "T = 1/f", "I = P/A"]
    },
    "Superposition": {
        "level": "AS Level",
        "key_concepts": ["interference", "diffraction", "stationary waves", "Young's double slit", "diffraction gratings"],
        "key_formulas": ["λ = ax/D", "d sin θ = nλ"]
    },
    "Electricity": {
        "level": "AS Level",
        "key_concepts": ["current", "voltage", "resistance", "Ohm's law", "resistivity", "I-V characteristics"],
        "key_formulas": ["I = Q/t", "V = IR", "R = ρL/A", "P = IV = I²R = V²/R"]
    },
    "D.C. Circuits": {
        "level": "AS Level",
        "key_concepts": ["series and parallel circuits", "Kirchhoff's laws", "potential dividers", "EMF", "internal resistance"],
        "key_formulas": ["ε = V + Ir", "V_out = V_in × R₂/(R₁+R₂)"]
    },
    "Particle Physics": {
        "level": "AS Level",
        "key_concepts": ["quarks", "leptons", "hadrons", "mesons", "antiparticles", "conservation laws", "Feynman diagrams"],
        "key_formulas": ["proton = uud", "neutron = udd"]
    },
    # A2 Level Topics
    "Motion in a Circle": {
        "level": "A2 Level",
        "key_concepts": ["angular velocity", "centripetal acceleration", "centripetal force", "vertical circles"],
        "key_formulas": ["ω = 2πf", "v = rω", "a = v²/r = ω²r", "F = mv²/r"]
    },
    "Gravitational Fields": {
        "level": "A2 Level",
        "key_concepts": ["Newton's law of gravitation", "field strength", "gravitational potential", "orbital motion", "escape velocity"],
        "key_formulas": ["F = GMm/r²", "g = GM/r²", "Φ = -GM/r", "v_escape = √(2GM/r)"]
    },
    "Temperature": {
        "level": "A2 Level",
        "key_concepts": ["thermal equilibrium", "specific heat capacity", "latent heat", "heating and cooling curves"],
        "key_formulas": ["Q = mcΔT", "Q = mL"]
    },
    "Ideal Gases": {
        "level": "A2 Level",
        "key_concepts": ["gas laws", "ideal gas equation", "kinetic theory", "molecular speeds", "internal energy"],
        "key_formulas": ["pV = nRT", "p = ⅓ρ<c²>", "E = 3/2 kT"]
    },
    "Thermodynamics": {
        "level": "A2 Level",
        "key_concepts": ["first law of thermodynamics", "p-V diagrams", "isothermal and adiabatic processes", "heat engines"],
        "key_formulas": ["ΔU = Q - W", "W = pΔV"]
    },
    "Oscillations": {
        "level": "A2 Level",
        "key_concepts": ["simple harmonic motion", "displacement equations", "energy in SHM", "damping", "resonance"],
        "key_formulas": ["a = -ω²x", "x = A cos(ωt)", "T = 2π√(m/k)", "T = 2π√(l/g)"]
    },
    "Electric Fields": {
        "level": "A2 Level",
        "key_concepts": ["Coulomb's law", "electric field strength", "electric potential", "motion of charges in fields"],
        "key_formulas": ["F = kQ₁Q₂/r²", "E = F/q", "V = kQ/r", "E = V/d"]
    },
    "Capacitance": {
        "level": "A2 Level",
        "key_concepts": ["capacitance", "parallel plate capacitor", "energy stored", "charging and discharging", "time constant"],
        "key_formulas": ["C = Q/V", "C = ε₀εᵣA/d", "E = ½CV²", "Q = Q₀e^(-t/RC)", "τ = RC"]
    },
    "Magnetic Fields": {
        "level": "A2 Level",
        "key_concepts": ["magnetic flux density", "force on current-carrying conductor", "electromagnetic induction", "Faraday's law", "Lenz's law", "transformers"],
        "key_formulas": ["F = BIL sin θ", "F = Bqv sin θ", "ε = -dΦ/dt", "N_s/N_p = V_s/V_p"]
    },
    "Alternating Currents": {
        "level": "A2 Level",
        "key_concepts": ["RMS values", "power in AC circuits", "rectification"],
        "key_formulas": ["I_rms = I₀/√2", "V_rms = V₀/√2", "P = I_rms × V_rms"]
    },
    "Quantum Physics": {
        "level": "A2 Level",
        "key_concepts": ["photoelectric effect", "wave-particle duality", "de Broglie wavelength", "energy levels", "line spectra"],
        "key_formulas": ["E = hf", "hf = Φ + ½mv²_max", "λ = h/p"]
    },
    "Nuclear Physics": {
        "level": "A2 Level",
        "key_concepts": ["radioactive decay", "half-life", "decay constant", "binding energy", "mass-energy equivalence", "fission", "fusion"],
        "key_formulas": ["N = N₀e^(-λt)", "t_½ = ln2/λ", "E = mc²"]
    },
    "Astronomy and Cosmology": {
        "level": "A2 Level",
        "key_concepts": ["HR diagram", "stellar evolution", "Hubble's law", "Big Bang", "dark matter"],
        "key_formulas": ["v = H₀d", "L = 4πr²σT⁴"]
    }
}


class ALevelPhysicsGenerator:
    """Generator for A Level Physics MCQ questions using DeepSeek AI"""
    
    def __init__(self):
        self.deepseek_api_key = os.environ.get('DEEPSEEK_API_KEY')
        self.deepseek_url = "https://api.deepseek.com/v1/chat/completions"
    
    def _get_topic_name(self, topic_id: str) -> Optional[str]:
        """Map frontend topic IDs to display names used in constants."""
        slug_map = {
            'physical_quantities': 'Physical Quantities and Units',
            'kinematics': 'Kinematics',
            'dynamics': 'Dynamics',
            'forces_pressure': 'Forces, Density, and Pressure',
            'work_energy_power': 'Work, Energy, and Power',
            'deformation_solids': 'Deformation of Solids',
            'waves': 'Waves',
            'superposition': 'Superposition',
            'electricity': 'Electricity',
            'dc_circuits': 'D.C. Circuits',
            'particle_physics': 'Particle Physics',
            'circular_motion': 'Motion in a Circle',
            'gravitational_fields': 'Gravitational Fields',
            'temperature': 'Temperature',
            'ideal_gases': 'Ideal Gases',
            'thermodynamics': 'Thermodynamics',
            'oscillations': 'Oscillations',
            'electric_fields': 'Electric Fields',
            'capacitance': 'Capacitance',
            'magnetic_fields': 'Magnetic Fields',
            'alternating_currents': 'Alternating Currents',
            'quantum_physics': 'Quantum Physics',
            'nuclear_physics': 'Nuclear Physics',
            'astronomy_cosmology': 'Astronomy and Cosmology',
        }
        
        if topic_id in A_LEVEL_PHYSICS_ALL_TOPICS:
            return topic_id
        return slug_map.get(topic_id)
    
    def generate_question(self, topic: str, difficulty: str = "medium", user_id: str = None) -> Optional[Dict]:
        """Generate an A Level Physics MCQ question"""
        try:
            # Map slug IDs from mobile to syllabus display names
            topic_name = self._get_topic_name(topic) or topic
            
            # Validate topic
            if topic_name not in A_LEVEL_PHYSICS_ALL_TOPICS:
                logger.error(f"Invalid A Level Physics topic: {topic}")
                return None
            
            topic_details = A_LEVEL_PHYSICS_TOPIC_DETAILS.get(topic_name, {})
            level = topic_details.get("level", "A Level")
            key_concepts = topic_details.get("key_concepts", [])
            key_formulas = topic_details.get("key_formulas", [])
            
            # Create detailed prompt for DeepSeek
            prompt = self._create_question_prompt(topic_name, difficulty, level, key_concepts, key_formulas)
            
            # Generate question using DeepSeek
            question_data = self._call_deepseek(prompt)
            
            if question_data:
                question_data['subject'] = 'A Level Physics'
                question_data['topic'] = topic_name
                question_data['difficulty'] = difficulty
                question_data['level'] = level
                question_data['source'] = 'ai_generated_a_level'
                return question_data
            
            return None
            
        except Exception as e:
            logger.error(f"Error generating A Level Physics question: {e}")
            return None
    
    def _create_question_prompt(self, topic: str, difficulty: str, level: str, key_concepts: list, key_formulas: list) -> str:
        """Create a detailed prompt for A Level Physics MCQ generation"""
        
        difficulty_guidance = {
            "easy": "Test basic understanding and recall of definitions and simple concepts. Students should be able to answer with direct knowledge.",
            "medium": "Test application of concepts and use of formulas. May require simple calculations or interpretation of scenarios.",
            "difficult": "Test deeper understanding, multi-step calculations, and analysis. May combine multiple concepts or require critical thinking."
        }
        
        prompt = f"""You are an expert A Level Physics examiner. Generate a high-quality multiple choice question for the Cambridge/ZIMSEC A Level Physics syllabus.

TOPIC: {topic}
LEVEL: {level}
DIFFICULTY: {difficulty} - {difficulty_guidance.get(difficulty, difficulty_guidance['medium'])}

KEY CONCEPTS TO COVER: {', '.join(key_concepts) if key_concepts else 'General concepts for this topic'}

KEY FORMULAS (use when appropriate): {', '.join(key_formulas) if key_formulas else 'As applicable'}

REQUIREMENTS:
1. Create ONE multiple choice question with 4 options (A, B, C, D)
2. The question should be clear, unambiguous, and at A Level standard
3. All options must be plausible - avoid obviously wrong answers
4. For calculation questions, include appropriate units
5. The correct answer must be scientifically accurate
6. Provide a detailed explanation that a student would find helpful

RESPONSE FORMAT (JSON):
{{
    "question": "The full question text here",
    "options": {{
        "A": "First option",
        "B": "Second option",
        "C": "Third option",
        "D": "Fourth option"
    }},
    "correct_answer": "A",
    "explanation": "Detailed explanation of why this is correct and why other options are wrong",
    "solution": "Step-by-step solution for calculation questions (or concept explanation for theory questions)",
    "teaching_explanation": "Additional teaching points for the student to understand the concept better"
}}

Generate the question now:"""

        return prompt
    
    def _call_deepseek(self, prompt: str) -> Optional[Dict]:
        """Call DeepSeek API to generate question"""
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
                        "content": "You are an expert A Level Physics examiner. Generate high-quality MCQ questions suitable for Cambridge/ZIMSEC A Level Physics examinations. Always respond with valid JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "temperature": 0.7,
                "max_tokens": 1500
            }
            
            response = requests.post(
                self.deepseek_url,
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code != 200:
                logger.error(f"DeepSeek API error: {response.status_code} - {response.text}")
                return None
            
            result = response.json()
            content = result.get('choices', [{}])[0].get('message', {}).get('content', '')
            
            # Parse JSON from response
            question_data = self._parse_question_response(content)
            return question_data
            
        except requests.Timeout:
            logger.error("DeepSeek API timeout")
            return None
        except Exception as e:
            logger.error(f"Error calling DeepSeek API: {e}")
            return None
    
    def _parse_question_response(self, content: str) -> Optional[Dict]:
        """Parse the JSON response from DeepSeek"""
        try:
            # Try to extract JSON from the response
            content = content.strip()
            
            # Find JSON block
            if '```json' in content:
                start = content.find('```json') + 7
                end = content.find('```', start)
                content = content[start:end].strip()
            elif '```' in content:
                start = content.find('```') + 3
                end = content.find('```', start)
                content = content[start:end].strip()
            
            # Parse JSON
            question_data = json.loads(content)
            
            # Validate required fields
            required_fields = ['question', 'options', 'correct_answer', 'explanation']
            for field in required_fields:
                if field not in question_data:
                    logger.error(f"Missing required field: {field}")
                    return None
            
            # Validate options
            if not isinstance(question_data['options'], dict):
                logger.error("Options must be a dictionary")
                return None
            
            if len(question_data['options']) < 4:
                logger.error("Must have at least 4 options")
                return None
            
            return question_data
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {e}")
            logger.error(f"Content: {content[:500]}")
            return None
        except Exception as e:
            logger.error(f"Error parsing question response: {e}")
            return None


# Singleton instance
a_level_physics_generator = ALevelPhysicsGenerator()
