"""
A Level Pure Mathematics Question Generator
Uses DeepSeek AI to generate advanced mathematics questions for ZIMSEC A Level syllabus (Code 6042)
Supports MCQ, structured questions, and worked solutions
"""

import json
import logging
import requests
import os
from typing import Dict, Optional, List
from constants import A_LEVEL_PURE_MATH_TOPICS, A_LEVEL_PURE_MATH_ALL_TOPICS

logger = logging.getLogger(__name__)

# A Level Pure Mathematics topic details for comprehensive prompts
A_LEVEL_PURE_MATH_TOPIC_DETAILS = {
    # Lower Sixth (Form 5) Topics
    "Polynomials": {
        "level": "Lower Sixth",
        "key_concepts": ["polynomial division", "factor theorem", "remainder theorem", "roots of equations", "relationship between roots and coefficients"],
        "key_formulas": ["f(a) = 0 ⟹ (x-a) is a factor", "Sum of roots = -b/a", "Product of roots = c/a"],
        "question_types": ["factorisation", "finding roots", "forming equations from roots", "polynomial division"]
    },
    "Rational Functions": {
        "level": "Lower Sixth",
        "key_concepts": ["partial fractions", "asymptotes", "graph sketching", "improper fractions", "repeated factors"],
        "key_formulas": ["A/(x-a) + B/(x-b)", "A/(x-a) + B/(x-a)²", "(Ax+B)/(x²+px+q)"],
        "question_types": ["decomposition into partial fractions", "identifying asymptotes", "sketching rational function graphs"]
    },
    "Indices, Surds and Logarithms": {
        "level": "Lower Sixth",
        "key_concepts": ["laws of indices", "rationalising denominators", "laws of logarithms", "solving exponential equations", "natural logarithms"],
        "key_formulas": ["aᵐ × aⁿ = aᵐ⁺ⁿ", "logₐ(xy) = logₐx + logₐy", "logₐ(xⁿ) = n·logₐx", "y = aˣ ⟺ x = logₐy"],
        "question_types": ["simplifying expressions", "solving equations", "proving identities", "change of base"]
    },
    "Quadratic Functions": {
        "level": "Lower Sixth",
        "key_concepts": ["completing the square", "discriminant", "nature of roots", "vertex form", "quadratic inequalities"],
        "key_formulas": ["x = (-b ± √(b²-4ac))/2a", "Δ = b² - 4ac", "Vertex: (-b/2a, f(-b/2a))"],
        "question_types": ["solving equations", "nature of roots analysis", "sketching parabolas", "inequalities"]
    },
    "Functions": {
        "level": "Lower Sixth",
        "key_concepts": ["domain and range", "composite functions", "inverse functions", "transformations", "modulus function"],
        "key_formulas": ["fg(x) = f(g(x))", "ff⁻¹(x) = x", "y = f(x+a) shifts left", "y = af(x) vertical stretch"],
        "question_types": ["finding composites", "finding inverses", "describing transformations", "sketching transformed graphs"]
    },
    "Coordinate Geometry": {
        "level": "Lower Sixth",
        "key_concepts": ["gradient", "equations of lines", "parallel and perpendicular lines", "circles", "parametric equations"],
        "key_formulas": ["m = (y₂-y₁)/(x₂-x₁)", "y - y₁ = m(x - x₁)", "(x-a)² + (y-b)² = r²", "m₁m₂ = -1"],
        "question_types": ["finding line equations", "intersection of lines and curves", "circle properties", "parametric to Cartesian"]
    },
    "Sequences and Series": {
        "level": "Lower Sixth",
        "key_concepts": ["arithmetic progressions", "geometric progressions", "sum to n terms", "sum to infinity", "sigma notation"],
        "key_formulas": ["AP: uₙ = a + (n-1)d", "GP: uₙ = arⁿ⁻¹", "AP sum: Sₙ = n/2(2a + (n-1)d)", "GP sum: Sₙ = a(1-rⁿ)/(1-r)"],
        "question_types": ["finding nth terms", "calculating sums", "convergence", "applications"]
    },
    "Binomial Theorem": {
        "level": "Lower Sixth",
        "key_concepts": ["binomial expansion", "Pascal's triangle", "general term", "negative and fractional indices", "approximations"],
        "key_formulas": ["(a+b)ⁿ = Σⁿᶜᵣ aⁿ⁻ʳbʳ", "ⁿCᵣ = n!/(r!(n-r)!)", "(1+x)ⁿ = 1 + nx + n(n-1)x²/2! + ..."],
        "question_types": ["expanding binomials", "finding specific terms", "approximations", "validity ranges"]
    },
    "Trigonometry (Identities & Equations)": {
        "level": "Lower Sixth",
        "key_concepts": ["fundamental identities", "compound angles", "double angles", "R-formula", "solving equations"],
        "key_formulas": ["sin²θ + cos²θ = 1", "sin(A±B)", "cos(A±B)", "sin2A = 2sinAcosA", "a·sinθ + b·cosθ = R·sin(θ+α)"],
        "question_types": ["proving identities", "solving equations", "expressing in R-form", "graphing"]
    },
    "Differentiation": {
        "level": "Lower Sixth",
        "key_concepts": ["first principles", "power rule", "chain rule", "product rule", "quotient rule", "implicit differentiation"],
        "key_formulas": ["d/dx(xⁿ) = nxⁿ⁻¹", "d/dx(eˣ) = eˣ", "d/dx(ln x) = 1/x", "d/dx(sin x) = cos x"],
        "question_types": ["differentiating functions", "finding tangents and normals", "rates of change"]
    },
    "Applications of Differentiation": {
        "level": "Lower Sixth",
        "key_concepts": ["stationary points", "curve sketching", "optimization", "rates of change", "small changes"],
        "key_formulas": ["dy/dx = 0 for stationary points", "d²y/dx² > 0 minimum", "δy ≈ (dy/dx)δx"],
        "question_types": ["finding and classifying stationary points", "optimization problems", "related rates"]
    },
    "Integration": {
        "level": "Lower Sixth",
        "key_concepts": ["reverse of differentiation", "definite integrals", "area under curves", "substitution", "volumes of revolution"],
        "key_formulas": ["∫xⁿ dx = xⁿ⁺¹/(n+1) + C", "∫eˣ dx = eˣ + C", "Area = ∫ᵇₐ y dx", "Volume = π∫ᵇₐ y² dx"],
        "question_types": ["evaluating integrals", "finding areas", "volumes of revolution", "substitution"]
    },
    # Upper Sixth (Form 6) Topics
    "Further Trigonometry": {
        "level": "Upper Sixth",
        "key_concepts": ["inverse trig functions", "general solutions", "half-angle formulae", "t-substitution", "small angle approximations"],
        "key_formulas": ["t = tan(θ/2)", "sin⁻¹x domain [-1,1]", "sin θ ≈ θ for small θ"],
        "question_types": ["general solutions", "using t-substitution", "small angle problems", "inverse function properties"]
    },
    "Hyperbolic Functions": {
        "level": "Upper Sixth",
        "key_concepts": ["sinh, cosh, tanh definitions", "hyperbolic identities", "inverse hyperbolic functions", "graphs", "differentiation"],
        "key_formulas": ["sinh x = (eˣ - e⁻ˣ)/2", "cosh x = (eˣ + e⁻ˣ)/2", "cosh²x - sinh²x = 1", "sinh⁻¹x = ln(x + √(x²+1))"],
        "question_types": ["proving identities", "differentiation", "solving equations", "expressing in logarithmic form"]
    },
    "Further Differentiation": {
        "level": "Upper Sixth",
        "key_concepts": ["implicit differentiation", "parametric differentiation", "logarithmic differentiation", "inverse trig derivatives", "Maclaurin series"],
        "key_formulas": ["d/dx(sin⁻¹x) = 1/√(1-x²)", "d/dx(tan⁻¹x) = 1/(1+x²)", "dy/dx = (dy/dt)/(dx/dt)"],
        "question_types": ["implicit equations", "parametric curves", "second derivatives", "Maclaurin expansions"]
    },
    "Further Integration Techniques": {
        "level": "Upper Sixth",
        "key_concepts": ["integration by parts", "partial fractions", "trigonometric substitutions", "reduction formulae", "improper integrals"],
        "key_formulas": ["∫u dv = uv - ∫v du", "∫1/(a²+x²) dx = (1/a)tan⁻¹(x/a)", "∫1/√(a²-x²) dx = sin⁻¹(x/a)"],
        "question_types": ["by parts", "using substitutions", "reduction formulae", "improper integrals"]
    },
    "Differential Equations": {
        "level": "Upper Sixth",
        "key_concepts": ["separable equations", "integrating factor", "second order homogeneous", "particular integrals", "modelling"],
        "key_formulas": ["dy/dx = f(x)g(y)", "IF = e^∫P(x)dx", "y = Ae^(m₁x) + Be^(m₂x)", "y = e^(αx)(Acosβx + Bsinβx)"],
        "question_types": ["solving first order", "second order with constant coefficients", "finding particular solutions", "applications"]
    },
    "Complex Numbers": {
        "level": "Upper Sixth",
        "key_concepts": ["Argand diagrams", "modulus-argument form", "De Moivre's theorem", "roots of unity", "loci"],
        "key_formulas": ["z = r(cosθ + isinθ) = re^(iθ)", "|z| = √(a²+b²)", "(cosθ + isinθ)ⁿ = cosnθ + isinnθ"],
        "question_types": ["operations on complex numbers", "De Moivre applications", "finding roots", "loci in complex plane"]
    },
    "Matrices and Determinants": {
        "level": "Upper Sixth",
        "key_concepts": ["matrix operations", "determinants", "inverses", "solving systems", "eigenvalues", "linear transformations"],
        "key_formulas": ["det(AB) = det(A)·det(B)", "A⁻¹ = (1/det A)·adj(A)", "Ax = b → x = A⁻¹b"],
        "question_types": ["finding inverses", "solving systems", "linear transformations", "eigenvalue problems"]
    },
    "Vectors in 3D": {
        "level": "Upper Sixth",
        "key_concepts": ["scalar product", "vector product", "equations of lines", "equations of planes", "intersections", "distances"],
        "key_formulas": ["a·b = |a||b|cosθ", "a × b = |a||b|sinθ n̂", "r = a + λb", "r·n = d"],
        "question_types": ["dot and cross products", "line and plane equations", "finding intersections", "calculating distances"]
    },
    "Summation of Series": {
        "level": "Upper Sixth",
        "key_concepts": ["method of differences", "standard sums", "partial fractions", "proof by induction", "Maclaurin series"],
        "key_formulas": ["Σr = n(n+1)/2", "Σr² = n(n+1)(2n+1)/6", "Σr³ = [n(n+1)/2]²"],
        "question_types": ["method of differences", "using standard results", "induction proofs", "series approximations"]
    },
    "Numerical Methods": {
        "level": "Upper Sixth",
        "key_concepts": ["root location", "Newton-Raphson", "iterative methods", "trapezium rule", "Simpson's rule"],
        "key_formulas": ["xₙ₊₁ = xₙ - f(xₙ)/f'(xₙ)", "Trapezium: h/2[y₀ + 2(y₁+...+yₙ₋₁) + yₙ]"],
        "question_types": ["Newton-Raphson iterations", "convergence analysis", "numerical integration", "error estimation"]
    },
    "Proof and Mathematical Induction": {
        "level": "Upper Sixth",
        "key_concepts": ["proof by induction", "proof by contradiction", "direct proof", "counterexamples", "divisibility"],
        "key_formulas": ["Induction: Base case → Assume P(k) → Prove P(k+1)"],
        "question_types": ["induction proofs", "divisibility proofs", "inequality proofs", "series proofs"]
    },
    "Group Theory": {
        "level": "Upper Sixth",
        "key_concepts": ["group axioms", "subgroups", "cyclic groups", "isomorphism", "Lagrange's theorem"],
        "key_formulas": ["Closure, Associativity, Identity, Inverse", "Order of subgroup divides order of group"],
        "question_types": ["verifying group properties", "finding subgroups", "identifying isomorphisms", "order of elements"]
    }
}


class ALevelPureMathGenerator:
    """Generator for A Level Pure Mathematics questions using DeepSeek AI"""
    
    def __init__(self):
        self.deepseek_api_key = os.environ.get('DEEPSEEK_API_KEY')
        self.deepseek_url = "https://api.deepseek.com/v1/chat/completions"
        self.max_retries = 3
        self.timeout = 45  # Longer timeout for math questions
    
    def generate_question(self, topic: str, difficulty: str = "medium", user_id: str = None, question_type: str = "mcq") -> Optional[Dict]:
        """
        Generate an A Level Pure Mathematics question
        
        Args:
            topic: The topic identifier (e.g., 'polynomials', 'complex_numbers')
            difficulty: 'easy', 'medium', or 'difficult'
            user_id: Optional user ID for tracking
            question_type: 'mcq' for multiple choice, 'structured' for long-form
        
        Returns:
            Dictionary containing question data or None on failure
        """
        try:
            # Map topic ID to display name
            topic_name = self._get_topic_name(topic)
            if not topic_name:
                logger.error(f"Invalid A Level Pure Math topic: {topic}")
                return None
            
            topic_details = A_LEVEL_PURE_MATH_TOPIC_DETAILS.get(topic_name, {})
            level = topic_details.get("level", "A Level")
            key_concepts = topic_details.get("key_concepts", [])
            key_formulas = topic_details.get("key_formulas", [])
            question_types = topic_details.get("question_types", [])
            
            # Create detailed prompt for DeepSeek
            if question_type == "structured":
                prompt = self._create_structured_prompt(topic_name, difficulty, level, key_concepts, key_formulas, question_types)
            else:
                prompt = self._create_mcq_prompt(topic_name, difficulty, level, key_concepts, key_formulas, question_types)
            
            # Generate question using DeepSeek
            question_data = self._call_deepseek(prompt, question_type)
            
            if question_data:
                question_data['subject'] = 'A Level Pure Mathematics'
                question_data['topic'] = topic_name
                question_data['topic_id'] = topic
                question_data['difficulty'] = difficulty
                question_data['level'] = level
                question_data['source'] = 'ai_generated_a_level_pure_math'
                question_data['ai_model'] = 'deepseek'
                return question_data
            
            return None
            
        except Exception as e:
            logger.error(f"Error generating A Level Pure Math question: {e}")
            return None
    
    def _get_topic_name(self, topic_id: str) -> Optional[str]:
        """Convert topic ID to display name"""
        # Map of topic IDs to display names
        topic_map = {
            'polynomials': 'Polynomials',
            'rational_functions': 'Rational Functions',
            'indices_surds_logs': 'Indices, Surds and Logarithms',
            'quadratic_functions': 'Quadratic Functions',
            'functions': 'Functions',
            'coordinate_geometry': 'Coordinate Geometry',
            'sequences_series': 'Sequences and Series',
            'binomial_theorem': 'Binomial Theorem',
            'trigonometry_basic': 'Trigonometry (Identities & Equations)',
            'differentiation_basic': 'Differentiation',
            'applications_differentiation': 'Applications of Differentiation',
            'integration_basic': 'Integration',
            'further_trigonometry': 'Further Trigonometry',
            'hyperbolic_functions': 'Hyperbolic Functions',
            'further_differentiation': 'Further Differentiation',
            'further_integration': 'Further Integration Techniques',
            'differential_equations': 'Differential Equations',
            'complex_numbers': 'Complex Numbers',
            'matrices': 'Matrices and Determinants',
            'vectors_3d': 'Vectors in 3D',
            'summation_series': 'Summation of Series',
            'numerical_methods': 'Numerical Methods',
            'proof': 'Proof and Mathematical Induction',
            'groups': 'Group Theory'
        }
        
        # Check if it's already a display name
        if topic_id in A_LEVEL_PURE_MATH_ALL_TOPICS:
            return topic_id
        
        return topic_map.get(topic_id)
    
    def _create_mcq_prompt(self, topic: str, difficulty: str, level: str, 
                           key_concepts: List[str], key_formulas: List[str], 
                           question_types: List[str]) -> str:
        """Create a detailed prompt for A Level Pure Math MCQ generation"""
        
        difficulty_guidance = {
            "easy": """Test basic understanding and recall. Direct application of single formula or concept.
            - Simple algebraic manipulation
            - Direct substitution problems  
            - Recognition of standard forms""",
            
            "medium": """Test application and connections between concepts.
            - Multi-step calculations
            - Combining two related concepts
            - Standard problem-solving techniques""",
            
            "difficult": """Test deeper understanding and analysis.
            - Complex multi-step problems
            - Non-standard applications
            - Proof elements or logical reasoning
            - Combining multiple topics"""
        }
        
        prompt = f"""You are an expert ZIMSEC A Level Pure Mathematics examiner. Generate a high-quality multiple choice question.

SUBJECT: A Level Pure Mathematics (ZIMSEC Syllabus 6042)
TOPIC: {topic}
LEVEL: {level} (Form {'5' if level == 'Lower Sixth' else '6'})
DIFFICULTY: {difficulty}

{difficulty_guidance.get(difficulty, difficulty_guidance['medium'])}

KEY CONCEPTS FOR THIS TOPIC:
{', '.join(key_concepts) if key_concepts else 'General concepts for this topic'}

KEY FORMULAS (use when appropriate):
{chr(10).join(['• ' + f for f in key_formulas]) if key_formulas else '• As applicable to the topic'}

TYPICAL QUESTION TYPES FOR THIS TOPIC:
{', '.join(question_types) if question_types else 'Various standard types'}

REQUIREMENTS:
1. Create ONE multiple choice question with exactly 4 options (A, B, C, D)
2. The question MUST be at A Level standard - NOT O Level
3. Include mathematical notation where appropriate (use standard notation like x², √, etc.)
4. All options must be plausible and based on common misconceptions
5. For calculation questions, ensure workings are required (not just substitution)
6. The correct answer must be mathematically rigorous
7. Provide a DETAILED worked solution showing every step
8. Include teaching points that help students understand the concept

RESPONSE FORMAT (strict JSON):
{{
    "question": "The full question text with any necessary mathematical expressions",
    "options": {{
        "A": "First option (mathematically formatted)",
        "B": "Second option",
        "C": "Third option",
        "D": "Fourth option"
    }},
    "correct_answer": "A",
    "explanation": "Brief explanation of why this answer is correct",
    "solution": "DETAILED step-by-step working showing all mathematical steps clearly",
    "teaching_explanation": "Key concepts and common mistakes to avoid - helpful teaching points",
    "formulas_used": ["List of formulas used in solving"]
}}

Generate an A Level Pure Mathematics MCQ now:"""

        return prompt
    
    def _create_structured_prompt(self, topic: str, difficulty: str, level: str,
                                  key_concepts: List[str], key_formulas: List[str],
                                  question_types: List[str]) -> str:
        """Create prompt for structured (long-form) questions"""
        
        prompt = f"""You are an expert ZIMSEC A Level Pure Mathematics examiner. Generate a structured question worth 8-12 marks.

SUBJECT: A Level Pure Mathematics (ZIMSEC Syllabus 6042)
TOPIC: {topic}
LEVEL: {level}
DIFFICULTY: {difficulty}

KEY CONCEPTS: {', '.join(key_concepts) if key_concepts else 'General concepts'}
KEY FORMULAS: {', '.join(key_formulas) if key_formulas else 'As applicable'}

Create a multi-part structured question (parts a, b, c) that builds up in difficulty.

REQUIREMENTS:
1. Part (a): Should be accessible (2-3 marks) - basic concept or simple calculation
2. Part (b): Medium difficulty (3-4 marks) - apply concepts or extend part (a)
3. Part (c): Challenging (4-5 marks) - synthesis, proof, or complex application
4. Include clear mark allocations
5. Provide complete worked solutions for each part
6. Questions should flow logically

RESPONSE FORMAT (strict JSON):
{{
    "question": "Main question stem with context if needed",
    "parts": [
        {{
            "part": "a",
            "question": "Part (a) question text",
            "marks": 3,
            "solution": "Worked solution for part (a)",
            "mark_scheme": "What is needed for full marks"
        }},
        {{
            "part": "b", 
            "question": "Part (b) question text",
            "marks": 4,
            "solution": "Worked solution for part (b)",
            "mark_scheme": "What is needed for full marks"
        }},
        {{
            "part": "c",
            "question": "Part (c) question text",
            "marks": 5,
            "solution": "Worked solution for part (c)",
            "mark_scheme": "What is needed for full marks"
        }}
    ],
    "total_marks": 12,
    "teaching_explanation": "Key learning points from this question",
    "common_mistakes": ["List of common student errors to avoid"]
}}

Generate the structured A Level Pure Mathematics question now:"""

        return prompt
    
    def _call_deepseek(self, prompt: str, question_type: str = "mcq") -> Optional[Dict]:
        """Call DeepSeek API to generate question with retries"""
        
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
                            "content": """You are an expert A Level Pure Mathematics examiner for ZIMSEC examinations. 
You generate rigorous, high-quality mathematics questions that test deep understanding.
Always use proper mathematical notation and provide complete worked solutions.
Your explanations should be clear enough for students to learn from their mistakes.
Always respond with valid JSON only - no markdown formatting or extra text."""
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "temperature": 0.7,
                    "max_tokens": 2500 if question_type == "structured" else 1800
                }
                
                timeout = self.timeout + (attempt * 10)  # Increase timeout with each retry
                logger.info(f"DeepSeek Pure Math {question_type} attempt {attempt + 1}/{self.max_retries}")
                
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
                
                # Parse JSON from response
                question_data = self._parse_question_response(content)
                if question_data:
                    return question_data
                    
            except requests.Timeout:
                logger.warning(f"DeepSeek timeout on attempt {attempt + 1}/{self.max_retries}")
                continue
            except Exception as e:
                logger.error(f"Error calling DeepSeek API on attempt {attempt + 1}: {e}")
                continue
        
        logger.error("All DeepSeek retry attempts failed for Pure Math question")
        return None
    
    def _parse_question_response(self, content: str) -> Optional[Dict]:
        """Parse the JSON response from DeepSeek"""
        try:
            content = content.strip()
            
            # Remove markdown code block if present
            if '```json' in content:
                start = content.find('```json') + 7
                end = content.find('```', start)
                content = content[start:end].strip()
            elif '```' in content:
                start = content.find('```') + 3
                end = content.find('```', start)
                content = content[start:end].strip()
            
            # Clean any leading/trailing whitespace or newlines
            content = content.strip()
            
            # Parse JSON
            question_data = json.loads(content)
            
            # Validate required fields for MCQ
            if 'options' in question_data:
                required_fields = ['question', 'options', 'correct_answer', 'solution']
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
            
            # Validate required fields for structured
            elif 'parts' in question_data:
                if not isinstance(question_data['parts'], list) or len(question_data['parts']) < 2:
                    logger.error("Structured question must have at least 2 parts")
                    return None
            
            return question_data
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {e}")
            logger.error(f"Content preview: {content[:500]}...")
            return None
        except Exception as e:
            logger.error(f"Error parsing question response: {e}")
            return None
    
    def generate_exam_question(self, level: str = "Lower Sixth", difficulty: str = "medium") -> Optional[Dict]:
        """
        Generate a random exam question from any topic in the specified level
        
        Args:
            level: 'Lower Sixth' or 'Upper Sixth'
            difficulty: 'easy', 'medium', or 'difficult'
        """
        import random
        
        topics = A_LEVEL_PURE_MATH_TOPICS.get(level, A_LEVEL_PURE_MATH_TOPICS["Lower Sixth"])
        topic = random.choice(topics)
        
        return self.generate_question(topic, difficulty)


# Singleton instance
a_level_pure_math_generator = ALevelPureMathGenerator()

