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
    """Generator for A Level Physics MCQ and Structured questions using DeepSeek AI"""
    
    def __init__(self):
        self.deepseek_api_key = os.environ.get('DEEPSEEK_API_KEY')
        self.deepseek_url = "https://api.deepseek.com/v1/chat/completions"
        self.timeout = 45  # Base timeout for physics questions
        self.max_retries = 3  # Retry up to 3 times
    
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
    
    def generate_question(self, topic: str, difficulty: str = "medium", user_id: str = None, question_type: str = "mcq") -> Optional[Dict]:
        """
        Generate an A Level Physics question
        
        Args:
            topic: The topic identifier
            difficulty: 'easy', 'medium', or 'difficult'
            user_id: Optional user ID for tracking
            question_type: 'mcq' for multiple choice, 'structured' for Paper 2 style
        
        Returns:
            Dictionary containing question data or None on failure
        """
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
            
            # Create detailed prompt for DeepSeek based on question type
            if question_type == "structured":
                prompt = self._create_structured_prompt(topic_name, difficulty, level, key_concepts, key_formulas)
            else:
                prompt = self._create_question_prompt(topic_name, difficulty, level, key_concepts, key_formulas)
            
            # Generate question using DeepSeek
            question_data = self._call_deepseek(prompt, question_type)
            
            if question_data:
                question_data['subject'] = 'A Level Physics'
                question_data['topic'] = topic_name
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
            logger.error(f"Error generating A Level Physics question: {e}")
            return None
    
    def _create_question_prompt(self, topic: str, difficulty: str, level: str, key_concepts: list, key_formulas: list) -> str:
        """Create a detailed prompt for A Level Physics MCQ generation"""
        
        difficulty_guidance = {
            "easy": "Test basic understanding and recall of definitions and simple concepts. Students should be able to answer with direct knowledge.",
            "medium": "Test application of concepts and use of formulas. May require simple calculations or interpretation of scenarios.",
            "difficult": "Test deeper understanding, multi-step calculations, and analysis. May combine multiple concepts or require critical thinking."
        }
        
        prompt = f"""You are a SENIOR A-LEVEL PHYSICS TEACHER (15+ years) AND an examiner-style question designer. You teach and assess for BOTH:
(A) ZIMSEC A Level Physics (Paper 1 MCQ, Paper 2 structured, Paper 3 practical)
(B) Cambridge International AS & A Level Physics 9702 (Paper 1 MCQ, Paper 2 structured, Paper 3 practical, Paper 4 A Level structured, Paper 5 planning/analysis/evaluation)

ROLE: SENIOR A-LEVEL PHYSICS TEACHER & EXAMINER

NON-NEGOTIABLE RULES:
1. SYLLABUS-LOCKED: Only generate content that is examinable for ZIMSEC A-Level Physics and Cambridge 9702
2. NO LEAKAGE: Do NOT introduce off-syllabus topics or university-level methods
3. EXAM AUTHENTICITY: Use real exam command words: "define", "state", "explain", "describe", "calculate", "deduce", "predict", "suggest", "identify", "compare", "derive"
4. ORIGINALITY: Do not copy past-paper questions verbatim. Generate ORIGINAL questions with the same SKILL pattern
5. MARKING REALISM: Provide mark allocation + method marks + accuracy marks + common errors
6. TOPIC INTEGRATION: Use mixed questions that combine topics the way real papers do (e.g., kinematics + dynamics, waves + superposition, electricity + circuits, fields + motion)

SUBJECT: A Level Physics (ZIMSEC A-Level / Cambridge 9702)
TOPIC: {topic}
LEVEL: {level} (Form {'5' if level == 'AS Level' else '6'})
DIFFICULTY: {difficulty} - {difficulty_guidance.get(difficulty, difficulty_guidance['medium'])}

COMPREHENSIVE SUBTOPIC COVERAGE:
- This question MUST test understanding of a SPECIFIC subtopic within {topic}
- Reference: ZIMSEC A-Level Physics past papers and Cambridge 9702 past papers
- Questions should rotate through all subtopics to ensure comprehensive topic coverage

KEY CONCEPTS FOR THIS TOPIC:
{', '.join(key_concepts) if key_concepts else 'General concepts for this topic'}

KEY FORMULAS (use when appropriate):
{chr(10).join(['• ' + f for f in key_formulas]) if key_formulas else '• As applicable to the topic'}

EXAM-STYLE QUESTION PATTERNS FOR THIS TOPIC:
- MCQ (Paper 1): definitions + recall traps, formula recall, quick computations, concept traps, graph recognition
- Structured (Paper 2 & 4): multi-step calculations, derivations, graph interpretation, explanations, data analysis
- Practical (Paper 3): method design, variables, uncertainties, graphing, conclusions, experimental skills
- Planning/Analysis/Evaluation (Paper 5): experimental design, data handling, evaluation, improvements, uncertainty analysis

CRITICAL FORMATTING RULES - PLAIN TEXT ONLY:
- ABSOLUTELY NO LaTeX delimiters like $ or \\( or \\).
- Use Unicode superscripts: m², s⁻¹, m/s², kg·m/s (NOT $m^2$ or m^2)
- Use Unicode subscripts: v₀, a₁, Fₙₑₜ (NOT v_0 or $v_0$)
- Write fractions as: (a+b)/(c+d) or a/b (NOT $\\frac{{a}}{{b}}$)
- Use √ for square root: √(2gh) (NOT $\\sqrt{{}}$)
- Use proper symbols: Ω for ohms, μ for micro, ° for degrees
- Use × for multiplication: 3.0 × 10⁸ m/s
- Examples: "v² = u² + 2as", "F = mv²/r", "E = ½mv²"

EXPERT EXAMINER GUIDELINES - PROFESSIONAL EXAM STANDARDS:
- Use appropriate A-Level command words: "define", "state", "explain", "describe", "calculate", "deduce", "predict", "suggest", "identify", "compare", "derive"
- Create distractors based on common A-Level student misconceptions from past marking experience
- Ensure question tests the cognitive level appropriate for {difficulty}:
  * Easy: Knowledge and comprehension (recall facts, understand concepts, identify quantities, simple calculations)
  * Medium: Application and analysis (apply knowledge, multi-step calculations, interpret graphs/data, analyze relationships)
  * Difficult: Synthesis and evaluation (combine multiple concepts, derive equations, evaluate scenarios, draw conclusions, complex problem-solving)
- Question should feel FRESH and different from standard textbook questions
- Include relevant physical contexts and real-world applications where appropriate
- Distractors should be physically plausible but clearly incorrect
- Reference ZIMSEC/Cambridge past papers and exam patterns

FRESHNESS REQUIREMENTS - CREATE UNIQUE QUESTIONS:
- Use unique scenarios NOT commonly found in typical textbook questions
- Vary contexts: laboratory experiments, engineering applications, everyday physics, space/astronomy, medical physics, technology
- Vary numbers and approaches to test the same concept
- Ensure question feels professionally crafted like a real ZIMSEC/Cambridge exam question

COMMON EXAM TRAPS TO REFERENCE:
- Sign conventions (forces, energy, potential, current direction)
- Units and significant figures in calculations
- Confusing similar concepts (e.g., velocity vs speed, force vs pressure, power vs energy)
- Misinterpreting graphs (gradient vs area, axes labels)
- Formula manipulation errors (rearranging, unit conversions)
- Misunderstanding vector vs scalar quantities
- Incorrect application of conservation laws

REQUIREMENTS:
1. Create ONE multiple choice question with exactly 4 options (A, B, C, D)
2. The question must be at A Level standard - NOT O Level
3. Use PLAIN TEXT Unicode notation - NO LaTeX or $ symbols
4. All options must be plausible and based on common A-Level misconceptions
5. For calculation questions, include appropriate units and significant figures
6. The correct answer must be physically accurate and exact (unless approximation requested)
7. Provide a DETAILED step-by-step explanation suitable for A Level students
8. Include teaching points that help students understand the concept and avoid common errors

STUDENT LEVEL: A-Level Forms 5-6 (ages 17-19 in Zimbabwe). Keep content age-appropriate and at A-Level standard.

OUTPUT FORMAT: Return ONLY valid JSON. No markdown. No extra text.

JSON schema (required fields):
{{
    "question": "Clear, focused ZIMSEC/Cambridge exam-style question testing A-Level concepts (plain text physics notation)",
    "options": {{
        "A": "Option A with plain text physics - plausible distractor based on common A-Level misconception",
        "B": "Option B with plain text physics - plausible distractor based on common A-Level misconception",
        "C": "Option C with plain text physics - correct answer",
        "D": "Option D with plain text physics - plausible distractor based on common A-Level misconception"
    }},
    "correct_answer": "A/B/C/D",
    "explanation": "Step-by-step explanation: Step 1: [reasoning] Step 2: [physical principle] Step 3: [conclusion]. Why this is correct and why other options fail.",
    "solution": "DETAILED step-by-step solution: Step 1: [clear step with physical reasoning] Step 2: [next step] Step 3: [final step] Final Answer: [exact value with units]",
    "teaching_points": "Key teaching points: 1) [concept] 2) [common error to avoid] 3) [exam technique]",
    "common_errors": "Common errors students make: 1) [error description] 2) [why it's wrong] 3) [how to avoid]",
    "marking_notes": "Marking scheme: Method marks (M) for correct approach, Accuracy marks (A) for correct answer. Common examiner comments.",
    "zimsec_paper_reference": "Paper 1 (MCQ) or Paper 2/3 (as appropriate)",
    "cambridge_paper_reference": "Paper 1 (MCQ) or Paper 2/3/4/5 (as appropriate)"
}}

Generate ONE A Level Physics MCQ now:"""

        return prompt
    
    def _create_structured_prompt(self, topic: str, difficulty: str, level: str, key_concepts: list, key_formulas: list) -> str:
        """Create prompt for structured (Paper 2 style) questions - knowledge-based, no diagrams"""
        
        difficulty_marks = {
            "easy": {"total": 8, "parts": 3},
            "medium": {"total": 12, "parts": 4},
            "difficult": {"total": 15, "parts": 5}
        }
        marks_info = difficulty_marks.get(difficulty, difficulty_marks["medium"])
        
        prompt = f"""You are a SENIOR A-LEVEL PHYSICS TEACHER (15+ years) AND an examiner-style question designer for ZIMSEC and Cambridge A Level Physics 9702.

ROLE: SENIOR A-LEVEL PHYSICS EXAMINER - PAPER 2 STRUCTURED QUESTIONS

NON-NEGOTIABLE RULES:
1. SYLLABUS-LOCKED: Only generate content examinable for ZIMSEC A-Level and Cambridge 9702
2. NO DIAGRAMS: Questions must be answerable with TEXT ONLY - no diagrams, graphs, or circuit drawings required
3. KNOWLEDGE-FOCUSED: Test understanding through explanations, definitions, derivations, and calculations
4. EXAM AUTHENTICITY: Use real exam command words: "define", "state", "explain", "describe", "calculate", "derive", "deduce", "suggest", "justify"
5. ORIGINALITY: Generate ORIGINAL questions with realistic exam patterns
6. MARKING REALISM: Provide clear mark allocation and model answers

SUBJECT: A Level Physics (ZIMSEC / Cambridge 9702)
TOPIC: {topic}
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
- Use Unicode superscripts: m², s⁻¹, m/s², kg·m/s (NOT m^2)
- Use Unicode subscripts: v₀, a₁, Fₙₑₜ (NOT v_0)
- Write fractions as: (a+b)/(c+d) or a/b
- Use √ for square root: √(2gh)
- Use proper symbols: Ω for ohms, μ for micro, ° for degrees
- Use × for multiplication: 3.0 × 10⁸ m/s

QUESTION STRUCTURE REQUIREMENTS:
- Create ONE structured question with {marks_info['parts']} parts: (a), (b), (c), etc.
- Each part tests DIFFERENT aspects of {topic}
- Part progression: Definition/recall → Explanation → Calculation → Application/analysis
- Keep the stem/context brief (1-3 lines maximum)
- ALL parts must be answerable with TEXT - no diagrams needed
- Include numerical calculations where appropriate with clear working

PART DIFFICULTY PROGRESSION:
- Part (a): 2-3 marks - Define, state, or recall (basic knowledge)
- Part (b): 3-4 marks - Explain or describe (understanding)
- Part (c): 4-5 marks - Calculate or derive (application)
- Part (d) if needed: 4-6 marks - Deduce, evaluate, or apply to new context (analysis)

COMMAND WORDS TO USE:
- Define: Give the precise meaning of a term
- State: Give a concise factual answer
- Explain: Give reasons using physical principles
- Describe: Give a detailed account
- Calculate: Find a numerical answer showing working
- Derive: Show how an equation is obtained
- Deduce: Draw conclusions from given information
- Suggest: Apply knowledge to unfamiliar contexts
- Justify: Support a conclusion with reasoning

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
                "question": "Part (c) question text (calculation or derivation)",
                "marks": 4,
                "model_answer": "Complete model answer with full working: Step 1... Step 2... Final answer with units",
                "marking_points": ["Correct formula [1 mark]", "Correct substitution [1 mark]", "Correct calculation [1 mark]", "Correct units [1 mark]"]
            }}
        ]
    }},
    "teaching_points": "Key concepts students should know: 1) [concept] 2) [concept] 3) [concept]",
    "common_errors": "Common mistakes: 1) [error] 2) [error] 3) [error]",
    "examiner_tips": "What examiners look for: clear physical reasoning, correct units, complete working"
}}

Generate ONE A Level Physics structured question now:"""

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
                
                payload = {
                    "model": "deepseek-chat",
                    "messages": [
                        {
                            "role": "system",
                            "content": """You are a SENIOR A-LEVEL PHYSICS TEACHER (15+ years) AND an examiner-style question designer. You teach and assess for BOTH ZIMSEC A Level Physics and Cambridge International AS & A Level Physics 9702.

ROLE: SENIOR A-LEVEL PHYSICS TEACHER & EXAMINER

NON-NEGOTIABLE RULES:
1. SYLLABUS-LOCKED: Only generate content examinable for ZIMSEC A-Level and Cambridge 9702
2. NO LEAKAGE: Do NOT introduce off-syllabus topics or university-level methods
3. EXAM AUTHENTICITY: Use real exam command words and structure
4. ORIGINALITY: Generate ORIGINAL questions with the same SKILL pattern (not verbatim past papers)
5. MARKING REALISM: Provide method marks + accuracy marks + common errors
6. TOPIC INTEGRATION: Use mixed questions combining topics the way real papers do

You create rigorous, high-quality questions that test deep physical understanding.
Always use correct physics terminology and provide detailed marking schemes with step-by-step explanations.

CRITICAL: Use PLAIN TEXT Unicode notation - NEVER use LaTeX or $ symbols:
- ABSOLUTELY NO delimiters like $.
- Use m², s⁻¹, kg·m/s for units (NOT $m^2$)
- Use fractions as a/b (NOT $\\frac{a}{b}$)
- Use √ for square roots, × for multiplication
- Use v₀, v₁ for subscripts (NOT v_0)
- Use proper symbols: Ω for ohms, μ for micro, ° for degrees, Δ for delta

Always respond with valid JSON containing step-by-step solutions."""
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "temperature": 0.7,
                    "max_tokens": 2000 if question_type == "structured" else 1500
                }
                
                # Increase timeout with each retry attempt
                timeout = self.timeout + (attempt * 15)
                logger.info(f"DeepSeek Physics attempt {attempt + 1}/{self.max_retries} (timeout: {timeout}s)")
                
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
                if attempt < self.max_retries - 1:
                    time.sleep(2)  # Wait before retry
                    continue
            except Exception as e:
                logger.error(f"Error calling DeepSeek API on attempt {attempt + 1}: {e}")
                if attempt < self.max_retries - 1:
                    time.sleep(2)
                    continue
        
        logger.error("All DeepSeek retry attempts failed for Physics question")
        return None
    
    def _parse_question_response(self, content: str, question_type: str = "mcq") -> Optional[Dict]:
        """Parse the JSON response from DeepSeek with truncation recovery"""
        try:
            # Try to extract JSON from the response
            content = content.strip()
            
            # Find JSON block
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
                # Validate MCQ required fields
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
            
            # Try to extract key fields even from incomplete JSON
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
                logger.info("Successfully recovered truncated JSON response for Physics")
                return {
                    "question": question,
                    "options": options,
                    "correct_answer": correct_answer,
                    "explanation": explanation,
                    "solution": "Work through the problem step by step using the relevant physics principles.",
                    "teaching_explanation": "Review the key concepts for this topic."
                }
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to recover truncated JSON: {e}")
            return None


# Singleton instance
a_level_physics_generator = ALevelPhysicsGenerator()
