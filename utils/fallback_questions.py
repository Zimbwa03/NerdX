import logging
from typing import Dict, List
import random

logger = logging.getLogger(__name__)

def generate_fallback_math_questions(topic: str, difficulty: str, count: int = 1) -> List[Dict]:
    """Generate fallback mathematics questions when API fails"""
    try:
        logger.info(f"Generating fallback questions for {topic} ({difficulty})")
        
        # Topic-specific question templates
        question_templates = {
            "Real Numbers": {
                "easy": [
                    {
                        "question": "Calculate: √64 + √36",
                        "solution": "Step 1: Find the square roots\n√64 = 8 and √36 = 6\n\nStep 2: Add the results\n8 + 6 = 14\n\nTherefore, √64 + √36 = 14",
                        "points": 10
                    },
                    {
                        "question": "Simplify: 2³ × 2⁴",
                        "solution": "Using the rule aᵐ × aⁿ = aᵐ⁺ⁿ\n\n2³ × 2⁴ = 2³⁺⁴ = 2⁷\n\nCalculating: 2⁷ = 128\n\nTherefore, 2³ × 2⁴ = 128",
                        "points": 10
                    },
                    {
                        "question": "Find the value of x if 3x + 7 = 22",
                        "solution": "Step 1: Subtract 7 from both sides\n3x + 7 - 7 = 22 - 7\n3x = 15\n\nStep 2: Divide both sides by 3\nx = 15/3 = 5\n\nTherefore, x = 5",
                        "points": 10
                    },
                    {
                        "question": "Calculate: (-5) + (+8) - (-3)",
                        "solution": "Step 1: Simplify the signs\n(-5) + (+8) - (-3) = -5 + 8 + 3\n\nStep 2: Calculate from left to right\n-5 + 8 = 3\n3 + 3 = 6\n\nTherefore, (-5) + (+8) - (-3) = 6",
                        "points": 10
                    },
                    {
                        "question": "Express 3/4 as a decimal",
                        "solution": "To convert a fraction to decimal, divide the numerator by denominator\n\n3/4 = 3 ÷ 4\n\nPerforming the division:\n3.000 ÷ 4 = 0.75\n\nTherefore, 3/4 = 0.75",
                        "points": 10
                    }
                ],
                "medium": [
                    {
                        "question": "Solve: 2(x + 3) = 5x - 6",
                        "solution": "Step 1: Expand the left side\n2(x + 3) = 2x + 6\n\nStep 2: Set up the equation\n2x + 6 = 5x - 6\n\nStep 3: Collect like terms\n6 + 6 = 5x - 2x\n12 = 3x\n\nStep 4: Solve for x\nx = 12/3 = 4\n\nTherefore, x = 4",
                        "points": 20
                    }
                ],
                "difficult": [
                    {
                        "question": "Simplify: (√50 - √8)/√2",
                        "solution": "Step 1: Simplify the square roots\n√50 = √(25 × 2) = 5√2\n√8 = √(4 × 2) = 2√2\n\nStep 2: Substitute\n(5√2 - 2√2)/√2\n\nStep 3: Combine like terms\n(3√2)/√2\n\nStep 4: Simplify\n3√2/√2 = 3\n\nTherefore, the answer is 3",
                        "points": 50
                    }
                ]
            },
            "Algebra": {
                "easy": [
                    {
                        "question": "Expand: (x + 4)(x + 2)",
                        "solution": "Using FOIL method:\n\nFirst: x × x = x²\nOuter: x × 2 = 2x\nInner: 4 × x = 4x\nLast: 4 × 2 = 8\n\nCombining: x² + 2x + 4x + 8\n\nSimplifying: x² + 6x + 8\n\nTherefore, (x + 4)(x + 2) = x² + 6x + 8",
                        "points": 10
                    },
                    {
                        "question": "Simplify: 3x + 2x - x",
                        "solution": "Step 1: Identify like terms\nAll terms contain the variable x\n\nStep 2: Combine coefficients\n3x + 2x - x = (3 + 2 - 1)x\n\nStep 3: Calculate\n(3 + 2 - 1)x = 4x\n\nTherefore, 3x + 2x - x = 4x",
                        "points": 10
                    }
                ],
                "medium": [
                    {
                        "question": "Solve: x² + 5x + 6 = 0",
                        "solution": "Step 1: Factor the quadratic\nLook for two numbers that multiply to 6 and add to 5\nThose numbers are 2 and 3\n\nx² + 5x + 6 = (x + 2)(x + 3) = 0\n\nStep 2: Apply zero product rule\nx + 2 = 0 or x + 3 = 0\n\nStep 3: Solve for x\nx = -2 or x = -3\n\nTherefore, x = -2 or x = -3",
                        "points": 20
                    },
                    {
                        "question": "Solve for x: 2x² - 8x = 0",
                        "solution": "Step 1: Factor out common factor\n2x² - 8x = 2x(x - 4) = 0\n\nStep 2: Apply zero product rule\n2x = 0 or x - 4 = 0\n\nStep 3: Solve each equation\nFrom 2x = 0: x = 0\nFrom x - 4 = 0: x = 4\n\nTherefore, x = 0 or x = 4",
                        "points": 20
                    }
                ],
                "difficult": [
                    {
                        "question": "Solve using the quadratic formula: x² - 4x + 1 = 0",
                        "solution": "Step 1: Identify coefficients\na = 1, b = -4, c = 1\n\nStep 2: Apply quadratic formula\nx = (-b ± √(b² - 4ac))/(2a)\n\nStep 3: Substitute values\nx = (-(-4) ± √((-4)² - 4(1)(1)))/(2(1))\n\nStep 4: Simplify\nx = (4 ± √(16 - 4))/2\nx = (4 ± √12)/2\nx = (4 ± 2√3)/2\nx = 2 ± √3\n\nTherefore, x = 2 + √3 or x = 2 - √3",
                        "points": 50
                    }
                ]
            },
            "Geometry": {
                "easy": [
                    {
                        "question": "Find the area of a rectangle with length 8 cm and width 5 cm",
                        "solution": "Step 1: Use the area formula for rectangle\nArea = length × width\n\nStep 2: Substitute values\nArea = 8 × 5\n\nStep 3: Calculate\nArea = 40 cm²\n\nTherefore, the area is 40 cm²",
                        "points": 10
                    }
                ],
                "medium": [
                    {
                        "question": "Find the area of a triangle with base 12 cm and height 8 cm",
                        "solution": "Step 1: Use the area formula for triangle\nArea = (1/2) × base × height\n\nStep 2: Substitute values\nArea = (1/2) × 12 × 8\n\nStep 3: Calculate\nArea = (1/2) × 96\nArea = 48 cm²\n\nTherefore, the area is 48 cm²",
                        "points": 20
                    }
                ],
                "difficult": [
                    {
                        "question": "Find the volume of a cylinder with radius 4 cm and height 10 cm (π = 3.14)",
                        "solution": "Step 1: Use the volume formula for cylinder\nVolume = π × r² × h\n\nStep 2: Substitute values\nVolume = 3.14 × 4² × 10\n\nStep 3: Calculate\nVolume = 3.14 × 16 × 10\nVolume = 3.14 × 160\nVolume = 502.4 cm³\n\nTherefore, the volume is 502.4 cm³",
                        "points": 50
                    }
                ]
            }
        }
        
        # Get appropriate questions based on topic and difficulty
        if topic in question_templates and difficulty in question_templates[topic]:
            available_questions = question_templates[topic][difficulty]
        else:
            # Default questions if topic not found
            available_questions = question_templates["Real Numbers"]["easy"]
        
        # Select questions (cycle through if not enough)
        selected_questions = []
        for i in range(count):
            question_index = i % len(available_questions)
            question = available_questions[question_index].copy()
            
            # Modify slightly to make each question unique
            if i >= len(available_questions):
                question["question"] = f"Question {i+1}: " + question["question"]
            
            selected_questions.append(question)
        
        logger.info(f"Generated {len(selected_questions)} fallback questions")
        return selected_questions
        
    except Exception as e:
        logger.error(f"Error generating fallback questions: {e}")
        return []

def generate_fallback_science_questions(subject: str, topic: str, count: int = 1) -> List[Dict]:
    """Generate fallback science questions for Biology, Chemistry, Physics"""
    try:
        science_templates = {
            "Biology": {
                "Cells and levels of organization": [
                    {
                        "question": "What is the basic unit of life?",
                        "options": ["A. Tissue", "B. Cell", "C. Organ", "D. Organism"],
                        "correct_answer": "B",
                        "explanation": "The cell is the basic unit of life. All living organisms are made up of one or more cells."
                    }
                ],
                "Nutrition": [
                    {
                        "question": "Which of the following is NOT a macronutrient?",
                        "options": ["A. Carbohydrates", "B. Proteins", "C. Vitamins", "D. Fats"],
                        "correct_answer": "C",
                        "explanation": "Vitamins are micronutrients, not macronutrients. Macronutrients include carbohydrates, proteins, and fats."
                    }
                ]
            },
            "Chemistry": {
                "Matter": [
                    {
                        "question": "What are the three states of matter?",
                        "options": ["A. Solid, liquid, plasma", "B. Solid, liquid, gas", "C. Gas, plasma, liquid", "D. Solid, gas, plasma"],
                        "correct_answer": "B",
                        "explanation": "The three main states of matter are solid, liquid, and gas."
                    }
                ],
                "Acids, Bases and Salts": [
                    {
                        "question": "What is the pH of pure water?",
                        "options": ["A. 6", "B. 7", "C. 8", "D. 9"],
                        "correct_answer": "B",
                        "explanation": "Pure water has a pH of 7, which is neutral (neither acidic nor basic)."
                    }
                ]
            },
            "Physics": {
                "Force": [
                    {
                        "question": "What is the unit of force?",
                        "options": ["A. Joule", "B. Watt", "C. Newton", "D. Pascal"],
                        "correct_answer": "C",
                        "explanation": "The Newton (N) is the SI unit of force, named after Sir Isaac Newton."
                    }
                ],
                "Energy": [
                    {
                        "question": "What is the formula for kinetic energy?",
                        "options": ["A. KE = mgh", "B. KE = ½mv²", "C. KE = Fd", "D. KE = Pt"],
                        "correct_answer": "B",
                        "explanation": "Kinetic energy is given by KE = ½mv², where m is mass and v is velocity."
                    }
                ]
            }
        }
        
        # Get questions for the subject and topic
        if subject in science_templates and topic in science_templates[subject]:
            available_questions = science_templates[subject][topic]
        else:
            # Use first available topic if specific topic not found
            if subject in science_templates:
                first_topic = list(science_templates[subject].keys())[0]
                available_questions = science_templates[subject][first_topic]
            else:
                # Default to Biology cell questions
                available_questions = science_templates["Biology"]["Cells and levels of organization"]
        
        # Select questions
        selected_questions = []
        for i in range(count):
            question_index = i % len(available_questions)
            selected_questions.append(available_questions[question_index])
        
        logger.info(f"Generated {len(selected_questions)} fallback {subject} questions")
        return selected_questions
        
    except Exception as e:
        logger.error(f"Error generating fallback science questions: {e}")
        return []