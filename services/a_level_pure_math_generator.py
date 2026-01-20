"""
A Level Pure Mathematics Question Generator
Uses DeepSeek AI to generate advanced mathematics questions for ZIMSEC A Level syllabus (Code 6042)
Supports MCQ, structured questions, and worked solutions
"""

import json
import logging
import requests
import os
import re
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
        self.max_retries = 2  # Reduced retries to prevent worker timeout
        self.timeout = 30  # Shorter timeout to prevent worker death
        self.graph_service = None  # Lazy init to avoid heavy imports unless needed
    
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
                # Optionally attach visualization using matplotlib for graph/shape topics
                question_data = self._maybe_attach_visualization(question_data, topic_name)
                question_data['subject'] = 'A Level Pure Mathematics'
                question_data['topic'] = topic_name
                question_data['topic_id'] = topic
                question_data['difficulty'] = difficulty
                question_data['level'] = level
                question_data['source'] = 'ai_generated_a_level_pure_math'
                question_data['ai_model'] = 'deepseek'
                # Enable image upload for pure mathematics (like regular mathematics)
                question_data['allows_text_input'] = True
                question_data['allows_image_upload'] = True
                return question_data
            
            # If AI generation failed, use fallback question
            logger.warning(f"AI generation failed for {topic_name}, using fallback")
            fallback = self._get_fallback_question(topic_name, difficulty)
            fallback['subject'] = 'A Level Pure Mathematics'
            fallback['level'] = level
            return fallback
            
        except Exception as e:
            logger.error(f"Error generating A Level Pure Math question: {e}")
            # Return fallback on exception too
            try:
                topic_name = self._get_topic_name(topic) or topic
                return self._get_fallback_question(topic_name, difficulty)
            except:
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
        
        prompt = f"""You are a SENIOR A-LEVEL PURE MATHEMATICS TEACHER (15+ years) AND an examiner-style question designer. You teach and assess for BOTH:
(A) ZIMSEC A Level Pure Mathematics 6042 (Paper 1 & Paper 2)
(B) Cambridge International AS & A Level Mathematics 9709 (Pure Mathematics Papers)
(C) Cambridge Further Mathematics 9231 (for topics that overlap, e.g., complex numbers, hyperbolic functions, differential equations)

ROLE: SENIOR A-LEVEL PURE MATHEMATICS TEACHER & EXAMINER

NON-NEGOTIABLE RULES:
1. SYLLABUS-LOCKED: Only generate content that is examinable for ZIMSEC 6042 and Cambridge 9709/9231
2. NO LEAKAGE: Do NOT introduce off-syllabus topics or university-level methods
3. EXAM AUTHENTICITY: Use real exam command words: "show that...", "hence...", "prove...", "sketch...", "find exact value...", "solve...", "determine...", "verify..."
4. ORIGINALITY: Do not copy past-paper questions verbatim. Generate ORIGINAL questions with the same SKILL pattern
5. MARKING REALISM: Provide mark allocation + method marks + final answer marks + common errors
6. TOPIC INTEGRATION: Use mixed questions that combine topics the way real papers do (e.g., trig + differentiation, polynomials + complex numbers, vectors + coordinate geometry)

SUBJECT: A Level Pure Mathematics (ZIMSEC Syllabus 6042 / Cambridge 9709)
TOPIC: {topic}
LEVEL: {level} (Form {'5' if level == 'Lower Sixth' else '6'})
DIFFICULTY: {difficulty}

DIFFICULTY GUIDANCE:
{difficulty_guidance.get(difficulty, difficulty_guidance['medium'])}

COMPREHENSIVE SUBTOPIC COVERAGE:
- This question MUST test understanding of a SPECIFIC subtopic within {topic}
- Reference: ZIMSEC 6042 past papers and Cambridge 9709/9231 past papers
- Questions should rotate through all subtopics to ensure comprehensive topic coverage

KEY CONCEPTS FOR THIS TOPIC:
{', '.join(key_concepts) if key_concepts else 'General concepts for this topic'}

KEY FORMULAS (use when appropriate):
{chr(10).join(['• ' + f for f in key_formulas]) if key_formulas else '• As applicable to the topic'}

TYPICAL QUESTION TYPES FOR THIS TOPIC:
{', '.join(question_types) if question_types else 'Various standard types'}

CRITICAL MATH FORMATTING RULES - PLAIN TEXT ONLY:
- ABSOLUTELY NO LaTeX delimiters like $ or \\( or \\).
- Use Unicode superscripts: x², x³, x⁴, xⁿ (NOT x^2 or $x^2$)
- Use Unicode subscripts: x₁, x₂, aₙ (NOT x_1 or $x_1$)
- Write fractions as: (a+b)/(c+d) or a/b (NOT $\\frac{{a}}{{b}}$)
- Use √ for square root: √(x+1) (NOT $\\sqrt{{}}$)
- Use ∑ for summation: ∑ from r=1 to n (NOT $\\sum$)
- Use π for pi, ∞ for infinity, ± for plus/minus
- Use → for arrows, ⟹ for implies
- Use ∫ for integrals: ∫(x²)dx (NOT $\\int$)
- Write sin⁻¹(x) for inverse trig (NOT $\\sin^{{-1}}$)
- Examples: "Find ∑(r=1 to n) of r²", "Solve x² + 3x - 4 = 0", "Evaluate √(16) + 3/4"

EXPERT EXAMINER GUIDELINES - PROFESSIONAL EXAM STANDARDS:
- Use appropriate A-Level command words: "show that", "hence", "prove", "sketch", "find exact value", "solve", "determine", "verify"
- Create distractors based on common A-Level student misconceptions from past marking experience
- Ensure question tests the cognitive level appropriate for {difficulty}:
  * Easy: Knowledge and comprehension (recall facts, understand concepts, direct formula application)
  * Medium: Application and analysis (apply knowledge, multi-step calculations, combining concepts)
  * Difficult: Synthesis and evaluation (complex multi-step problems, proof elements, combining multiple topics)
- Question should feel FRESH and different from standard textbook questions
- Include relevant mathematical contexts and real-world applications where appropriate
- Distractors should be mathematically plausible but clearly incorrect
- Reference ZIMSEC/Cambridge past papers and exam patterns

FRESHNESS REQUIREMENTS - CREATE UNIQUE QUESTIONS:
- Use unique scenarios NOT commonly found in typical textbook questions
- Vary contexts: mathematical modeling, real-world applications, theoretical problems
- Vary numbers and approaches to test the same concept
- Ensure question feels professionally crafted like a real ZIMSEC/Cambridge exam question

COMMON EXAM TRAPS TO REFERENCE:
- Domain restrictions (logs, trig, rational functions)
- Exact values vs decimal approximations
- Presentation errors (missing working, incorrect notation)
- Sign errors in calculations
- Misapplication of formulas or theorems

REQUIREMENTS:
1. Create ONE multiple choice question with exactly 4 options (A, B, C, D)
2. The question MUST be at A Level standard - NOT O Level
3. Use PLAIN TEXT Unicode math notation as described above - NO LaTeX
4. All options must be plausible and based on common A-Level misconceptions
5. For calculation questions, ensure workings are required (not just substitution)
6. The correct answer must be mathematically rigorous and exact (unless approximation requested)
7. Provide a DETAILED step-by-step worked solution showing every step with clear reasoning
8. Include teaching points that help students understand the concept and avoid common errors
9. If a sketch/graph/diagram would help, add an optional "visualization" block with:
   - "needed": true/false
   - "type": "graph" | "shape" | "argand"
   - "expression": function to plot (for graphs) OR "shape"/"region" details
   - "points": optional list of Argand points with real/imag parts

STUDENT LEVEL: A-Level Forms 5-6 (ages 17-19 in Zimbabwe). Keep content age-appropriate and at A-Level standard.

OUTPUT FORMAT: Return ONLY valid JSON. No markdown. No extra text.

JSON schema (required fields):
{{
    "question": "Clear, focused ZIMSEC/Cambridge exam-style question testing A-Level concepts (plain text math)",
    "options": {{
        "A": "Option A with plain text math - plausible distractor based on common A-Level misconception",
        "B": "Option B with plain text math - plausible distractor based on common A-Level misconception",
        "C": "Option C with plain text math - correct answer",
        "D": "Option D with plain text math - plausible distractor based on common A-Level misconception"
    }},
    "correct_answer": "A/B/C/D",
    "explanation": "Step-by-step explanation: Step 1: [reasoning] Step 2: [calculation] Step 3: [conclusion]. Why this is correct and why other options fail.",
    "solution": "DETAILED step-by-step solution: Step 1: [clear step with reasoning] Step 2: [next step] Step 3: [final step] Final Answer: [exact value]",
    "teaching_points": "Key teaching points: 1) [concept] 2) [common error to avoid] 3) [exam technique]",
    "common_errors": "Common errors students make: 1) [error description] 2) [why it's wrong] 3) [how to avoid]",
    "marking_notes": "Marking scheme: Method marks (M) for correct approach, Accuracy marks (A) for correct answer. Common examiner comments.",
    "visualization": {{
        "needed": false,
        "type": "graph/shape/argand",
        "expression": "function or description if needed"
    }},
    "zimsec_paper_reference": "Paper 1 or Paper 2 (as appropriate)",
    "cambridge_paper_reference": "Paper 1 or Paper 3 (as appropriate)"
}}

Generate ONE A Level Pure Mathematics MCQ now:"""

        return prompt
    
    def _create_structured_prompt(self, topic: str, difficulty: str, level: str,
                                  key_concepts: List[str], key_formulas: List[str],
                                  question_types: List[str]) -> str:
        """Create prompt for structured (long-form) questions"""
        
        prompt = f"""You are a SENIOR A-LEVEL PURE MATHEMATICS TEACHER (15+ years) AND an examiner-style question designer. You teach and assess for BOTH:
(A) ZIMSEC A Level Pure Mathematics 6042 (Paper 1 & Paper 2)
(B) Cambridge International AS & A Level Mathematics 9709 (Pure Mathematics Papers)
(C) Cambridge Further Mathematics 9231 (for topics that overlap, e.g., complex numbers, hyperbolic functions, differential equations)

ROLE: SENIOR A-LEVEL PURE MATHEMATICS TEACHER & EXAMINER

NON-NEGOTIABLE RULES:
1. SYLLABUS-LOCKED: Only generate content that is examinable for ZIMSEC 6042 and Cambridge 9709/9231
2. NO LEAKAGE: Do NOT introduce off-syllabus topics or university-level methods
3. EXAM AUTHENTICITY: Use real exam command words: "show that...", "hence...", "prove...", "sketch...", "find exact value...", "solve...", "determine...", "verify..."
4. ORIGINALITY: Do not copy past-paper questions verbatim. Generate ORIGINAL questions with the same SKILL pattern
5. MARKING REALISM: Provide mark allocation + method marks + final answer marks + common errors
6. TOPIC INTEGRATION: Use mixed questions that combine topics the way real papers do (e.g., trig + differentiation, polynomials + complex numbers, vectors + coordinate geometry)

SUBJECT: A Level Pure Mathematics (ZIMSEC Syllabus 6042 / Cambridge 9709)
TOPIC: {topic}
LEVEL: {level} (Form {'5' if level == 'Lower Sixth' else '6'})
DIFFICULTY: {difficulty}

COMPREHENSIVE SUBTOPIC COVERAGE:
- This structured question MUST cover MULTIPLE different subtopics from the learning objectives
- Each part should test a DIFFERENT aspect/subtopic of {topic}
- Reference: ZIMSEC 6042 past papers and Cambridge 9709/9231 past papers
- To ensure comprehensive coverage, different subtopics should be tested across multiple question generations

KEY CONCEPTS FOR THIS TOPIC:
{', '.join(key_concepts) if key_concepts else 'General concepts for this topic'}

KEY FORMULAS (use when appropriate):
{chr(10).join(['• ' + f for f in key_formulas]) if key_formulas else '• As applicable to the topic'}

TYPICAL QUESTION TYPES FOR THIS TOPIC:
{', '.join(question_types) if question_types else 'Various standard types'}

CRITICAL MATH FORMATTING RULES - PLAIN TEXT ONLY:
- ABSOLUTELY NO LaTeX delimiters like $ or \\( or \\).
- Use Unicode superscripts: x², x³, x⁴, xⁿ (NOT x^2 or $x^2$)
- Use Unicode subscripts: x₁, x₂, aₙ (NOT x_1 or $x_1$)
- Write fractions as: (a+b)/(c+d) or a/b (NOT $\\frac{{a}}{{b}}$)
- Use √ for square root: √(x+1) (NOT $\\sqrt{{}}$)
- Use ∑ for summation, π for pi, ∞ for infinity, ± for plus/minus
- Use ∫ for integrals: ∫(x²)dx
- Write sin⁻¹(x) for inverse trig

EXPERT EXAMINER GUIDELINES - PROFESSIONAL EXAM STANDARDS:
- Use appropriate A-Level command words: "show that", "hence", "prove", "sketch", "find exact value", "solve", "determine", "verify"
- Mark allocation must be realistic: Easy (6-8 marks), Medium (8-12 marks), Difficult (10-15 marks)
- Include comprehensive marking rubric with method marks (M) and accuracy marks (A)
- Provide examiner notes on common misconceptions and marking tips
- Ensure questions align with ZIMSEC/Cambridge exam standards
- Questions should flow logically with parts building on each other (use "hence" where appropriate)

FRESHNESS REQUIREMENTS - CREATE UNIQUE QUESTIONS:
- Use unique scenarios NOT commonly found in typical textbook questions
- Vary contexts: mathematical modeling, real-world applications, theoretical problems
- Vary numbers and approaches to test the same concept
- Ensure question feels professionally crafted like a real ZIMSEC/Cambridge exam question

COMMON EXAM TRAPS TO REFERENCE:
- Domain restrictions (logs, trig, rational functions)
- Exact values vs decimal approximations
- Presentation errors (missing working, incorrect notation)
- Sign errors in calculations
- Misapplication of formulas or theorems
- Missing "show that" verification steps

QUESTION STRUCTURE REQUIREMENTS:
- Must be a *STRUCTURED* question (NOT multiple choice)
- Must be broken into parts like (a), (b), (c), (d) etc.
- Each part must test a DIFFERENT subtopic from the learning objectives
- Part progression: Basic recall → Understanding → Application → Analysis/Synthesis
- Easy: 3-4 parts, Medium: 4-6 parts, Difficult: 5-7 parts
- Keep the stem/context brief and exam-like (1-3 lines maximum - avoid long stories)
- Ensure it is *exactly one* question with parts (not a paper, not multiple questions)

ENHANCED PART VARIETY:
- Mix different question types within the structured question (show that, prove, find, solve, sketch, determine)
- Ensure parts test different cognitive levels (recall, understanding, application, analysis, synthesis)
- Include proof elements where appropriate (especially for Upper Sixth topics)
- Include "hence" questions that build on previous parts
- Vary the command words used across parts to test different skills

REQUIREMENTS:
1. Part (a): Should be accessible (2-3 marks) - basic concept or simple calculation, tests recall/understanding
2. Part (b): Medium difficulty (3-4 marks) - apply concepts or extend part (a), tests application
3. Part (c): Challenging (4-5 marks) - synthesis, proof, or complex application, tests analysis/synthesis
4. Additional parts (d), (e) if difficulty is medium/hard: Further extension or mixed-topic integration
5. Include clear mark allocations with method marks (M) and accuracy marks (A)
6. Provide complete step-by-step worked solutions for each part
7. Questions should flow logically with parts building on each other
8. Use PLAIN TEXT Unicode math notation - NO LaTeX
9. If a diagram/graph (e.g., Argand, function sketch, shape) helps, include a "visualization" block describing what to plot
10. Include marking scheme with common errors and examiner comments

STUDENT LEVEL: A-Level Forms 5-6 (ages 17-19 in Zimbabwe). Keep content age-appropriate and at A-Level standard.

OUTPUT FORMAT: Return ONLY valid JSON. No markdown. No extra text.

JSON schema (required fields):
{{
    "question": "Main question stem with context if needed (brief, 1-3 lines maximum)",
    "parts": [
        {{
            "part": "a",
            "question": "Part (a) question text with appropriate command word (show that/find/solve/etc.)",
            "marks": 3,
            "mark_breakdown": "M2 A1 (2 method marks, 1 accuracy mark)",
            "solution": "DETAILED step-by-step solution: Step 1: [clear step] Step 2: [next step] Step 3: [final step] Final Answer: [exact value]",
            "mark_scheme": "What is needed for full marks: [method marks] for correct approach, [accuracy marks] for correct answer",
            "common_errors": "Common errors: 1) [error] 2) [why wrong] 3) [how to avoid]",
            "examiner_notes": "Examiner notes: [common mistakes and marking tips]"
        }},
        {{
            "part": "b", 
            "question": "Part (b) question text (may use 'hence' if builds on part a)",
            "marks": 4,
            "mark_breakdown": "M2 A2 (2 method marks, 2 accuracy marks)",
            "solution": "DETAILED step-by-step solution: Step 1: [clear step] Step 2: [next step] Step 3: [final step] Final Answer: [exact value]",
            "mark_scheme": "What is needed for full marks: [method marks] for correct approach, [accuracy marks] for correct answer",
            "common_errors": "Common errors: 1) [error] 2) [why wrong] 3) [how to avoid]",
            "examiner_notes": "Examiner notes: [common mistakes and marking tips]"
        }},
        {{
            "part": "c",
            "question": "Part (c) question text (most challenging part - proof/synthesis/complex application)",
            "marks": 5,
            "mark_breakdown": "M3 A2 (3 method marks, 2 accuracy marks)",
            "solution": "DETAILED step-by-step solution: Step 1: [clear step] Step 2: [next step] Step 3: [final step] Final Answer: [exact value]",
            "mark_scheme": "What is needed for full marks: [method marks] for correct approach, [accuracy marks] for correct answer",
            "common_errors": "Common errors: 1) [error] 2) [why wrong] 3) [how to avoid]",
            "examiner_notes": "Examiner notes: [common mistakes and marking tips]"
        }}
    ],
    "total_marks": 12,
    "marking_summary": "Overall marking guidance: Method marks awarded for correct approach even if final answer wrong. Accuracy marks for correct final answer. Common presentation errors: [list]",
    "teaching_points": "Key teaching points: 1) [concept] 2) [exam technique] 3) [common error to avoid]",
    "visualization": {{
        "needed": false,
        "type": "graph/shape/argand",
        "description": "What to plot if needed"
    }},
    "zimsec_paper_reference": "Paper 1 or Paper 2 (as appropriate)",
    "cambridge_paper_reference": "Paper 1 or Paper 3 (as appropriate)"
}}

Generate ONE A Level Pure Mathematics structured question now:"""

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
Generate questions with clear solutions.

CRITICAL: Use PLAIN TEXT Unicode math notation - NEVER use LaTeX or $ symbols:
- ABSOLUTELY NO delimiters like $.
- Use x², x³, xⁿ for powers (NOT $x^2$ or x^2)
- Use fractions as a/b or (a+b)/(c+d) (NOT $\\frac{a}{b}$)
- Use √ for square roots (NOT $\\sqrt{}$)
- Use ∑, π, ∞, ±, →, ⟹ for math symbols
- Use sin⁻¹, cos⁻¹, tan⁻¹ for inverse trig

Keep explanations concise (2-3 sentences). Always respond with valid, complete JSON only."""
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "temperature": 0.7,
                    "max_tokens": 1500 if question_type == "structured" else 1000  # Reduced for faster responses
                }
                
                timeout = self.timeout + (attempt * 5)  # Smaller timeout increase
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

    def _maybe_attach_visualization(self, question_data: Dict, topic_name: str) -> Dict:
        """
        Use matplotlib (via GraphService) to generate a visual aid when the AI
        indicates a sketch/graph is needed or when topic heuristics suggest it.
        """
        try:
            viz_request = question_data.get('visualization') if isinstance(question_data, dict) else None
            visual_type = None
            expression = None
            shape_params = None
            argand_points = None
            highlight_region = None

            # AI-provided instructions take priority
            if isinstance(viz_request, dict):
                needs_visual = bool(viz_request.get('needed') or viz_request.get('need_graph') or viz_request.get('require_diagram'))
                visual_type = viz_request.get('type') or viz_request.get('visual_type')
                expression = viz_request.get('expression') or viz_request.get('function')
                shape_params = viz_request.get('parameters') or viz_request.get('shape')
                argand_points = viz_request.get('points')
                highlight_region = viz_request.get('region') or viz_request.get('quadrant')
            else:
                needs_visual = False

            # Heuristic detection for topics that often need sketches
            graph_topics = {
                'Rational Functions', 'Quadratic Functions', 'Functions', 'Coordinate Geometry',
                'Trigonometry (Identities & Equations)', 'Further Trigonometry',
                'Complex Numbers', 'Vectors in 3D', 'Differentiation', 'Applications of Differentiation',
                'Integration', 'Further Integration Techniques', 'Numerical Methods'
            }

            question_text = (question_data.get('question') or '').lower()
            needs_visual = needs_visual or any(
                keyword in question_text for keyword in [
                    'sketch', 'draw', 'graph', 'plot', 'diagram', 'locus', 'argand', 'quadrant'
                ]
            ) or topic_name in graph_topics

            if not needs_visual:
                return question_data

            # Determine visualization type and expression/params
            if not visual_type:
                if 'argand' in question_text or 'complex' in topic_name.lower():
                    visual_type = 'argand'
                elif any(word in question_text for word in ['circle', 'triangle', 'rectangle', 'shape']):
                    visual_type = 'shape'
                else:
                    visual_type = 'graph'

            if not expression:
                expression = self._extract_expression(question_data)

            # Lazy init GraphService
            if self.graph_service is None:
                try:
                    from services.graph_service import GraphService
                    self.graph_service = GraphService()
                except Exception as import_error:
                    logger.error(f"Unable to load GraphService for visualization: {import_error}")
                    return question_data

            image_path = None

            if visual_type in ['graph', 'function', 'function_graph']:
                if expression:
                    image_path = self.graph_service.create_advanced_function_graph(
                        expression,
                        title=f"{topic_name} graph"
                    )
            elif visual_type in ['shape', 'geometry', 'diagram']:
                # Default to triangle if not specified
                shape_type = 'triangle'
                if isinstance(shape_params, dict):
                    shape_type = shape_params.get('shape_type') or shape_params.get('type') or shape_type
                elif 'circle' in question_text:
                    shape_type = 'circle'
                elif 'rectangle' in question_text:
                    shape_type = 'rectangle'
                image_path = self.graph_service.create_geometry_diagram(shape_type, shape_params or {})
            elif visual_type in ['argand', 'complex', 'complex_plane']:
                image_path = self.graph_service.generate_argand_diagram(
                    points=argand_points if isinstance(argand_points, list) else None,
                    highlight_region=highlight_region,
                    title="Argand Diagram"
                )

            if image_path:
                question_data['graph_image_path'] = image_path
                question_data['graph_image_type'] = visual_type

            return question_data

        except Exception as viz_error:
            logger.error(f"Error attaching visualization: {viz_error}")
            return question_data

    def _extract_expression(self, question_data: Dict) -> Optional[str]:
        """Best-effort extraction of a plot-able expression from question text."""
        try:
            text_candidates = [
                question_data.get('question', '') or '',
                question_data.get('stem', '') or '',
                question_data.get('solution', '') or ''
            ]
            patterns = [
                r"y\s*=\s*([^\n;,]+)",
                r"f\(x\)\s*=\s*([^\n;,]+)",
                r"show\s+the\s+graph\s+of\s+([^\n;,]+)",
                r"equation\s+of\s+the\s+curve\s*([^\n;,]+)"
            ]
            for text in text_candidates:
                for pat in patterns:
                    match = re.search(pat, text, re.IGNORECASE)
                    if match:
                        expr = match.group(1).strip()
                        return expr.rstrip('.;, ')
            return None
        except Exception:
            return None
    
    def _parse_question_response(self, content: str) -> Optional[Dict]:
        """Parse the JSON response from DeepSeek with truncation recovery"""
        try:
            content = content.strip()
            
            # Remove markdown code block if present
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
            
            # Clean any leading/trailing whitespace or newlines
            content = content.strip()
            
            # Try to parse JSON, with recovery for truncated responses
            try:
                question_data = json.loads(content)
            except json.JSONDecodeError as e:
                logger.warning(f"Initial JSON parse failed: {e}")
                # Attempt to recover truncated JSON
                question_data = self._recover_truncated_json(content)
                if not question_data:
                    return None
            
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
            
            # Normalize math formatting to plain text Unicode for app display
            question_data = self._normalize_question_data(question_data)
            
            return question_data
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {e}")
            logger.error(f"Content preview: {content[:500]}...")
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
            # Find where JSON starts
            json_start = content.find('{')
            if json_start == -1:
                return None
            
            content = content[json_start:]
            
            # Try to extract key fields even from incomplete JSON
            import re
            
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
            
            # If we have enough data, construct a valid response
            if question and len(options) >= 4:
                logger.info("Successfully recovered truncated JSON response")
                return {
                    "question": question,
                    "options": options,
                    "correct_answer": correct_answer,
                    "explanation": "Solution: Work through the problem step by step using the relevant mathematical techniques.",
                    "solution": "See the worked solution above."
                }
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to recover truncated JSON: {e}")
            return None
    
    def _normalize_question_data(self, question_data: Dict) -> Dict:
        """Convert any LaTeX-like math to plain text Unicode for mobile display."""
        def normalize(obj):
            if isinstance(obj, str):
                return self._normalize_math_text(obj)
            if isinstance(obj, list):
                return [normalize(item) for item in obj]
            if isinstance(obj, dict):
                return {k: normalize(v) for k, v in obj.items()}
            return obj
        
        # Top-level string fields
        for field in ["question", "explanation", "solution", "teaching_explanation"]:
            if field in question_data:
                question_data[field] = self._normalize_math_text(question_data[field])
        
        # Options
        if "options" in question_data and isinstance(question_data["options"], dict):
            question_data["options"] = {k: self._normalize_math_text(v) for k, v in question_data["options"].items()}
        
        # Structured parts
        if "parts" in question_data and isinstance(question_data["parts"], list):
            normalized_parts = []
            for part in question_data["parts"]:
                if not isinstance(part, dict):
                    normalized_parts.append(part)
                    continue
                part_copy = part.copy()
                for field in ["question", "solution", "mark_scheme", "marking_scheme", "expected_answer"]:
                    if field in part_copy:
                        part_copy[field] = normalize(part_copy[field])
                normalized_parts.append(part_copy)
            question_data["parts"] = normalized_parts
        
        # Common mistakes or other lists
        if "common_mistakes" in question_data:
            question_data["common_mistakes"] = normalize(question_data["common_mistakes"])
        
        return question_data
    
    def _normalize_math_text(self, text: str) -> str:
        """Best-effort conversion of LaTeX-ish math to plain text Unicode."""
        if not isinstance(text, str):
            return text
        
        original = text
        
        # Remove surrounding $ or $$ markers
        text = text.replace("$$", "")
        text = text.replace("$", "")
        
        # Common replacements
        replacements = {
            r"\\times": "×",
            r"\\cdot": "·",
            r"\\pi": "π",
            r"\\infty": "∞",
            r"\\pm": "±",
            r"\\to": "→",
            r"\\rightarrow": "→",
            r"\\Leftarrow": "⟸",
            r"\\Rightarrow": "⟹",
            r"\\left": "",
            r"\\right": "",
            r"\\,": " ",
        }
        for old, new in replacements.items():
            text = text.replace(old, new)
        
        # Fractions: \frac{a}{b} -> (a)/(b)
        def replace_frac(match):
            num = match.group(1)
            den = match.group(2)
            return f"({num})/({den})"
        while "\\frac" in text:
            new_text = re.sub(r"\\frac\{([^{}]+)\}\{([^{}]+)\}", replace_frac, text)
            if new_text == text:
                break
            text = new_text
        
        # Square roots: \sqrt{...} -> √(...)
        text = re.sub(r"\\sqrt\{([^{}]+)\}", r"√(\1)", text)
        
        # Trig inverse: \sin^{-1}(x) -> sin⁻¹(x)
        text = text.replace("\\sin^{-1}", "sin⁻¹")
        text = text.replace("\\cos^{-1}", "cos⁻¹")
        text = text.replace("\\tan^{-1}", "tan⁻¹")
        
        # Superscripts mapping
        superscript_map = {
            "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
            "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
            "+": "⁺", "-": "⁻", "n": "ⁿ", "k": "ᵏ", "m": "ᵐ"
        }
        def to_superscript(s: str) -> str:
            return "".join(superscript_map.get(ch, ch) for ch in s)
        
        # ^{...} -> superscript
        text = re.sub(r"\^\{([^{}]+)\}", lambda m: to_superscript(m.group(1)), text)
        # ^digit -> superscript
        text = re.sub(r"\^([0-9+\-nkm])", lambda m: to_superscript(m.group(1)), text)
        
        # Subscripts mapping
        subscript_map = {
            "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄",
            "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",
            "+": "₊", "-": "₋", "n": "ₙ", "k": "ₖ", "m": "ₘ"
        }
        def to_subscript(s: str) -> str:
            return "".join(subscript_map.get(ch, ch) for ch in s)
        
        # _{...} -> subscript
        text = re.sub(r"_\{([^{}]+)\}", lambda m: to_subscript(m.group(1)), text)
        # _digit -> subscript
        text = re.sub(r"_([0-9+\-nkm])", lambda m: to_subscript(m.group(1)), text)
        
        # Clean remaining backslashes
        text = text.replace("\\", "")
        
        # Collapse multiple spaces
        text = re.sub(r"\s{2,}", " ", text).strip()
        
        if original != text:
            logger.debug(f"Normalized math text: '{original}' -> '{text}'")
        return text
    
    def _get_fallback_question(self, topic: str, difficulty: str) -> Dict:
        """Return a fallback question when AI generation fails"""
        fallback_questions = {
            "Polynomials": {
                "question": "Given that (x - 2) is a factor of f(x) = x³ + ax² - 4x + 4, find the value of a.",
                "options": {"A": "a = -1", "B": "a = 0", "C": "a = 1", "D": "a = 2"},
                "correct_answer": "A",
                "explanation": "Using the factor theorem: f(2) = 0. So 8 + 4a - 8 + 4 = 0, giving 4a + 4 = 0, hence a = -1.",
                "solution": "By factor theorem, if (x-2) is a factor, then f(2) = 0.\nf(2) = 8 + 4a - 8 + 4 = 4a + 4 = 0\nTherefore a = -1"
            },
            "Rational Functions": {
                "question": "Express 3/(x² - 1) in partial fractions.",
                "options": {
                    "A": "3/(2(x-1)) - 3/(2(x+1))",
                    "B": "3/(2(x-1)) + 3/(2(x+1))", 
                    "C": "1/(x-1) - 1/(x+1)",
                    "D": "3/(x-1) - 3/(x+1)"
                },
                "correct_answer": "A",
                "explanation": "x² - 1 = (x-1)(x+1). Using cover-up: A = 3/2 when x=1, B = -3/2 when x=-1.",
                "solution": "3/(x²-1) = A/(x-1) + B/(x+1)\nUsing cover-up method: A = 3/2, B = -3/2"
            },
            "Quadratic Functions": {
                "question": "Find the range of values of k for which x² + kx + 9 = 0 has real roots.",
                "options": {"A": "k ≤ -6 or k ≥ 6", "B": "-6 < k < 6", "C": "k < -6 or k > 6", "D": "-6 ≤ k ≤ 6"},
                "correct_answer": "A",
                "explanation": "For real roots, discriminant ≥ 0. b² - 4ac ≥ 0, so k² - 36 ≥ 0, giving k ≤ -6 or k ≥ 6.",
                "solution": "For real roots: b² - 4ac ≥ 0\nk² - 4(1)(9) ≥ 0\nk² ≥ 36\nk ≤ -6 or k ≥ 6"
            },
            "Differentiation": {
                "question": "Find dy/dx when y = x³e^(2x).",
                "options": {
                    "A": "3x²e^(2x) + 2x³e^(2x)",
                    "B": "x²e^(2x)(3 + 2x)",
                    "C": "3x²e^(2x)",
                    "D": "6x²e^(2x)"
                },
                "correct_answer": "B",
                "explanation": "Using product rule: dy/dx = 3x²e^(2x) + x³(2e^(2x)) = e^(2x)(3x² + 2x³) = x²e^(2x)(3 + 2x).",
                "solution": "Using product rule on y = x³·e^(2x):\ndy/dx = 3x²·e^(2x) + x³·2e^(2x) = x²e^(2x)(3 + 2x)"
            },
            "Integration": {
                "question": "Evaluate ∫(2x + 1)/(x² + x) dx.",
                "options": {"A": "ln|x² + x| + C", "B": "ln|x(x+1)| + C", "C": "ln|x| + ln|x+1| + C", "D": "All of the above"},
                "correct_answer": "D",
                "explanation": "Notice that d/dx(x² + x) = 2x + 1. So the integral is ln|x² + x| + C, which equals all the given forms.",
                "solution": "∫(2x+1)/(x²+x) dx = ln|x²+x| + C (since numerator is derivative of denominator)"
            }
        }
        
        # Get fallback for topic or use a default
        if topic in fallback_questions:
            question = fallback_questions[topic].copy()
        else:
            # Default fallback
            question = {
                "question": f"Simplify: (x² - 4)/(x - 2)",
                "options": {"A": "x + 2", "B": "x - 2", "C": "x² + 2", "D": "(x - 2)²"},
                "correct_answer": "A",
                "explanation": "x² - 4 = (x+2)(x-2), so (x²-4)/(x-2) = (x+2)(x-2)/(x-2) = x + 2 for x ≠ 2.",
                "solution": "Factor the numerator: x² - 4 = (x+2)(x-2)\nCancel common factor: (x+2)(x-2)/(x-2) = x + 2"
            }
        
        question["topic"] = topic
        question["difficulty"] = difficulty
        question["source"] = "fallback"
        
        logger.info(f"Using fallback question for Pure Math topic: {topic}")
        return question
    
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

