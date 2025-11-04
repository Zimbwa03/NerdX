"""
Professional Combined Science Question Generator for ZIMSEC O-Level
Generates age-appropriate questions with clear explanations for 15-17 year old students
"""
import os
import json
import requests
import time
import logging
import random
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)

class CombinedScienceGenerator:
    """Professional O-Level Combined Science question generator using DeepSeek AI"""
    
    def __init__(self):
        self.api_key = os.environ.get('DEEPSEEK_API_KEY')
        self.api_url = 'https://api.deepseek.com/chat/completions'
        
        # O-Level appropriate settings
        self.max_retries = 2
        self.timeouts = [25, 40]  # Reasonable timeouts for O-Level questions
        self.retry_delay = 2
        
        # ZIMSEC O-Level learning objectives per topic
        self.learning_objectives = {
            "Biology": {
                "Cell Structure and Organisation": [
                    "Identify basic cell structures and their functions",
                    "Compare plant and animal cells",
                    "Understand cell theory basics"
                ],
                "Movement In and Out of Cells": [
                    "Explain diffusion and osmosis",
                    "Understand factors affecting movement",
                    "Apply concepts to everyday examples"
                ],
                "Enzymes": [
                    "Describe enzyme properties and functions",
                    "Explain factors affecting enzyme activity",
                    "Give examples of enzyme applications"
                ],
                "Plant Nutrition": [
                    "Understand photosynthesis process",
                    "Identify factors affecting photosynthesis rate",
                    "Describe leaf structure adaptations"
                ],
                "Animal Nutrition": [
                    "Identify components of balanced diet",
                    "Understand digestive system structure",
                    "Explain absorption and assimilation"
                ]
            },
            "Chemistry": {
                "Experimental Chemistry": [
                    "Follow laboratory safety rules",
                    "Use basic laboratory equipment",
                    "Make accurate measurements"
                ],
                "Particulate Nature of Matter": [
                    "Describe states of matter",
                    "Explain kinetic theory basics",
                    "Understand changes of state"
                ],
                "Acids, Bases and Salts": [
                    "Identify properties of acids and bases",
                    "Understand pH scale basics",
                    "Explain neutralization reactions"
                ]
            },
            "Physics": {
                "Motion, Forces and Energy": [
                    "Calculate speed and acceleration",
                    "Apply Newton's laws to simple situations",
                    "Understand work and energy concepts"
                ],
                "Electricity": [
                    "Understand current, voltage, and resistance",
                    "Analyze simple circuits",
                    "Apply Ohm's law to basic problems"
                ]
            }
        }
    
    def generate_topical_question(self, subject: str, topic: str, difficulty: str = 'medium', user_id: str = None) -> Optional[Dict]:
        """Generate O-Level appropriate topical question with professional explanation"""
        try:
            if not self.api_key:
                logger.error("DeepSeek API key not configured")
                return self._get_fallback_question(subject, topic, difficulty, user_id)
            
            # Create O-Level appropriate prompt
            prompt = self._create_olevel_prompt(subject, topic, difficulty)
            
            # Generate question using DeepSeek
            result = self._call_deepseek_api(prompt, f"{subject}_{topic}_{difficulty}")
            
            if result:
                # Validate and enhance the result
                return self._validate_and_enhance_question(result, subject, topic, difficulty, user_id)
            else:
                logger.warning(f"DeepSeek generation failed for {subject}/{topic}, using fallback")
                return self._get_fallback_question(subject, topic, difficulty, user_id)
                
        except Exception as e:
            logger.error(f"Error generating {subject} question for {topic}: {e}")
            return self._get_fallback_question(subject, topic, difficulty, user_id)
    
    def _create_olevel_prompt(self, subject: str, topic: str, difficulty: str) -> str:
        """Create O-Level appropriate prompt for DeepSeek AI"""
        
        # Get learning objectives for this topic
        objectives = self.learning_objectives.get(subject, {}).get(topic, [
            f"Understand basic concepts of {topic}",
            f"Apply {topic} knowledge to simple problems",
            f"Explain {topic} using appropriate terminology"
        ])
        
        # Difficulty-appropriate language
        difficulty_guidance = {
            'easy': "Basic recall and understanding level. Simple, direct questions.",
            'medium': "Application and analysis level. Require some thinking and connection of ideas.",
            'difficult': "Evaluation and synthesis level. Multi-step problems requiring deeper understanding."
        }
        
        prompt = f"""Generate a ZIMSEC O-Level Combined Science question for {subject} - {topic}.

**IMPORTANT: This is for O-Level students (ages 15-17). Keep content age-appropriate and not too advanced.**

**Learning Objectives to Address:**
{chr(10).join(f"• {obj}" for obj in objectives)}

**Question Requirements:**
- Subject: {subject}
- Topic: {topic}
- Difficulty: {difficulty} ({difficulty_guidance.get(difficulty, 'Standard level')})
- Format: Multiple choice (4 options A, B, C, D)
- ZIMSEC O-Level standard - appropriate for teenagers
- Use simple, clear language suitable for 15-17 year olds
- Include Zimbabwean context where natural (names, places, examples)

**CRITICAL: Question Focus (70% Theory, 30% Application):**
- PRIORITIZE: Theoretical knowledge, concepts, definitions, processes
- INCLUDE: Real-world applications and problem-solving
- MINIMIZE: Laboratory experiments and practical procedures
- FOCUS ON: Understanding WHY things happen, not just HOW to do experiments
- EMPHASIZE: Conceptual understanding over procedural knowledge

**Question Types to Generate:**
- Definitions and terminology (What is...?)
- Process explanations (How does...?)
- Cause and effect relationships (Why does...?)
- Comparisons and contrasts (Difference between...?)
- Applications to real life (When would you...?)
- Concept connections (How are X and Y related?)

**Avoid These Question Types:**
- Step-by-step laboratory procedures
- Equipment identification only
- Measurement techniques without theory
- Pure memorization of experimental steps

**Explanation Requirements:**
- Write like a patient, caring tutor explaining to a teenager
- Break down complex ideas into simple steps
- Use everyday examples and analogies
- Keep explanations 2-3 sentences maximum
- Focus on helping students understand concepts, not procedures
- Use encouraging, supportive tone

**Content Guidelines:**
- Avoid university-level concepts
- Use vocabulary appropriate for O-Level students
- Include practical, real-world applications
- Make connections to students' daily experiences
- Keep mathematical calculations simple and clear

Return ONLY a JSON object:
{{
    "question": "Clear, knowledge-focused question testing understanding of concepts",
    "options": {{
        "A": "First option",
        "B": "Second option", 
        "C": "Third option",
        "D": "Fourth option"
    }},
    "correct_answer": "B",
    "explanation": "Simple, clear explanation focusing on WHY this is correct and the underlying concept. Use everyday language and examples.",
    "difficulty": "{difficulty}",
    "learning_objective": "What conceptual knowledge students should gain from this question",
    "real_world_application": "How this concept applies to everyday life or future studies",
    "question_type": "knowledge_focused"
}}

Make this educational, knowledge-focused, and encouraging for O-Level students!"""

        return prompt
    
    def _call_deepseek_api(self, prompt: str, generation_type: str) -> Optional[Dict]:
        """Call DeepSeek API with O-Level appropriate settings"""
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.api_key}'
        }
        
        data = {
            "model": "deepseek-chat",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a professional O-Level science tutor with 10+ years experience teaching ZIMSEC Combined Science to Zimbabwean teenagers. You create engaging, age-appropriate questions that help students understand concepts clearly. Your explanations are simple, encouraging, and educational."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "stream": False,
            "temperature": 0.7,  # Balanced creativity for educational content
            "max_tokens": 1500   # Sufficient for O-Level questions and explanations
        }
        
        for attempt in range(self.max_retries):
            timeout = self.timeouts[min(attempt, len(self.timeouts) - 1)]
            
            try:
                logger.info(f"DeepSeek O-Level {generation_type} attempt {attempt + 1}/{self.max_retries} (timeout: {timeout}s)")
                
                response = requests.post(
                    self.api_url,
                    headers=headers,
                    json=data,
                    timeout=timeout
                )
                
                if response.status_code == 200:
                    response_data = response.json()
                    content = response_data.get('choices', [{}])[0].get('message', {}).get('content', '')
                    
                    if content:
                        # Parse JSON from response
                        try:
                            # Extract JSON from response (handle markdown formatting)
                            json_start = content.find('{')
                            json_end = content.rfind('}') + 1
                            
                            if json_start != -1 and json_end > json_start:
                                json_str = content[json_start:json_end]
                                result = json.loads(json_str)
                                
                                logger.info(f"✅ Successfully generated O-Level {generation_type}")
                                return result
                            else:
                                logger.error(f"No valid JSON found in DeepSeek response for {generation_type}")
                                
                        except json.JSONDecodeError as e:
                            logger.error(f"JSON parsing error for {generation_type}: {e}")
                            
                        if attempt < self.max_retries - 1:
                            time.sleep(self.retry_delay)
                            continue
                else:
                    logger.error(f"DeepSeek API error: {response.status_code} - {response.text}")
                    if attempt < self.max_retries - 1:
                        time.sleep(self.retry_delay)
                        continue
                        
            except requests.exceptions.Timeout:
                logger.warning(f"DeepSeek timeout on attempt {attempt + 1}/{self.max_retries} (waited {timeout}s)")
                if attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay)
                    continue
                    
            except Exception as e:
                logger.error(f"DeepSeek error on attempt {attempt + 1}: {e}")
                if attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay)
                    continue
        
        logger.error(f"Failed to generate {generation_type} after {self.max_retries} attempts")
        return None
    
    def _validate_and_enhance_question(self, question_data: Dict, subject: str, topic: str, difficulty: str, user_id: str = None) -> Dict:
        """Validate and enhance the generated question for O-Level standards"""
        try:
            # Ensure all required fields are present
            required_fields = ['question', 'options', 'correct_answer', 'explanation']
            for field in required_fields:
                if field not in question_data:
                    logger.warning(f"Missing field {field} in generated question")
                    return self._get_fallback_question(subject, topic, difficulty, user_id)
            
            # Validate options format
            if not isinstance(question_data['options'], dict):
                logger.warning("Options not in correct format")
                return self._get_fallback_question(subject, topic, difficulty, user_id)
            
            # Ensure explanation is O-Level appropriate (not too long or complex)
            explanation = question_data.get('explanation', '')
            if len(explanation) > 300:  # Keep explanations concise for O-Level
                question_data['explanation'] = explanation[:297] + "..."
            
            # Add metadata for database storage
            from constants import DIFFICULTY_LEVELS
            question_data.update({
                'subject': subject,
                'topic': topic,
                'difficulty': difficulty,
                'category': subject,  # For database compatibility
                'question_type': 'mcq',
                'source': 'ai_generated_olevel',
                'points': DIFFICULTY_LEVELS.get(difficulty, {}).get('point_value', 10)
            })
            
            return question_data
            
        except Exception as e:
            logger.error(f"Error validating question: {e}")
            return self._get_fallback_question(subject, topic, difficulty, user_id)
    
    def _get_fallback_question(self, subject: str, topic: str, difficulty: str, user_id: str = None) -> Dict:
        """Provide O-Level appropriate fallback questions when AI fails"""
        
        fallback_questions = {
            "Biology": {
                "Cell Structure and Organisation": {
                    "easy": {
                        "question": "Which part of the cell controls all cell activities?",
                        "options": {"A": "Cell membrane", "B": "Nucleus", "C": "Cytoplasm", "D": "Vacuole"},
                        "correct_answer": "B",
                        "explanation": "The nucleus is like the brain of the cell - it contains DNA and controls everything the cell does, just like how your brain controls your body."
                    },
                    "medium": {
                        "question": "What is the main difference between plant and animal cells?",
                        "options": {"A": "Plant cells are bigger", "B": "Animal cells have more organelles", "C": "Plant cells have cell walls and chloroplasts", "D": "Animal cells have nuclei"},
                        "correct_answer": "C",
                        "explanation": "Plant cells have a tough cell wall (like a protective fence) and green chloroplasts for making food through photosynthesis. Animal cells don't have these."
                    }
                },
                "Respiration": {
                    "easy": {
                        "question": "What gas do we breathe in during respiration?",
                        "options": {"A": "Carbon dioxide", "B": "Oxygen", "C": "Nitrogen", "D": "Water vapor"},
                        "correct_answer": "B",
                        "explanation": "We breathe in oxygen from the air. Our body uses oxygen to release energy from food, just like how fire needs oxygen to burn."
                    }
                }
            },
            "Chemistry": {
                "Acids, Bases and Salts": {
                    "easy": {
                        "question": "Which of these is an example of an acid?",
                        "options": {"A": "Water", "B": "Salt", "C": "Lemon juice", "D": "Soap"},
                        "correct_answer": "C",
                        "explanation": "Lemon juice contains citric acid, which is why it tastes sour. All acids have a sour taste - but never taste unknown chemicals in the lab!"
                    }
                },
                "Particulate Nature of Matter": {
                    "easy": {
                        "question": "What happens to particles when a solid is heated and melts?",
                        "options": {"A": "They disappear", "B": "They move faster and spread apart", "C": "They get smaller", "D": "They stick together more"},
                        "correct_answer": "B",
                        "explanation": "When ice melts to water, the particles gain energy and move faster, allowing them to slide past each other instead of staying in fixed positions."
                    }
                }
            },
            "Physics": {
                "Electricity": {
                    "easy": {
                        "question": "What is the unit used to measure electric current?",
                        "options": {"A": "Volt", "B": "Ampere", "C": "Ohm", "D": "Watt"},
                        "correct_answer": "B",
                        "explanation": "Electric current is measured in Amperes (or Amps for short). Think of it like measuring how much water flows through a pipe - Amps measure how much electricity flows through a wire."
                    }
                },
                "Motion, Forces and Energy": {
                    "easy": {
                        "question": "What force pulls objects towards the Earth?",
                        "options": {"A": "Friction", "B": "Magnetism", "C": "Gravity", "D": "Air resistance"},
                        "correct_answer": "C",
                        "explanation": "Gravity is the force that pulls everything towards Earth. It's why when you drop something, it falls down instead of floating away."
                    }
                }
            },
            "Chemistry": {
                "Experimental Chemistry": {
                    "easy": {
                        "question": "Which piece of apparatus is used to measure exactly 25.0 cm³ of solution?",
                        "options": {"A": "Measuring cylinder", "B": "Pipette", "C": "Beaker", "D": "Conical flask"},
                        "correct_answer": "B",
                        "explanation": "A pipette measures exact volumes accurately. A 25.0 cm³ pipette will deliver exactly that volume, unlike measuring cylinders which are less precise.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Particulate Nature of Matter": {
                    "easy": {
                        "question": "In which state of matter are particles arranged in a regular pattern?",
                        "options": {"A": "Solid", "B": "Liquid", "C": "Gas", "D": "Plasma"},
                        "correct_answer": "A",
                        "explanation": "In solids, particles are arranged in a regular, ordered pattern (crystal lattice) and can only vibrate about fixed positions.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Formulae and Stoichiometry": {
                    "easy": {
                        "question": "What is the chemical formula for calcium carbonate?",
                        "options": {"A": "CaCO₂", "B": "CaCO₃", "C": "Ca₂CO₃", "D": "CaC₂O₃"},
                        "correct_answer": "B", 
                        "explanation": "Calcium carbonate contains Ca²⁺ and CO₃²⁻ ions. Using the cross-multiplication method: Ca²⁺ and CO₃²⁻ give CaCO₃.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Electrolysis": {
                    "easy": {
                        "question": "During electrolysis, positive ions move towards the...",
                        "options": {"A": "Anode", "B": "Cathode", "C": "Center", "D": "Both electrodes"},
                        "correct_answer": "B",
                        "explanation": "Positive ions (cations) are attracted to the negative electrode (cathode). Remember: opposite charges attract.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Energy from Chemicals": {
                    "easy": {
                        "question": "A reaction that releases heat energy to the surroundings is called...",
                        "options": {"A": "Endothermic", "B": "Exothermic", "C": "Isothermic", "D": "Thermodynamic"},
                        "correct_answer": "B", 
                        "explanation": "Exothermic reactions give out heat, making the surroundings warmer. Examples include combustion and neutralization reactions.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Chemical Reactions": {
                    "easy": {
                        "question": "Which metal is most reactive in the reactivity series?",
                        "options": {"A": "Iron", "B": "Copper", "C": "Potassium", "D": "Lead"},
                        "correct_answer": "C",
                        "explanation": "Potassium is at the top of the reactivity series, making it the most reactive metal. It reacts explosively with water.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Acids, Bases and Salts": {
                    "easy": {
                        "question": "What is the pH range for acids?",
                        "options": {"A": "0-6", "B": "7-14", "C": "0-7", "D": "8-14"},
                        "correct_answer": "A",
                        "explanation": "Acids have pH values from 0 to 6 (below 7). The lower the pH, the stronger the acid. pH 7 is neutral.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Periodic Table": {
                    "easy": {
                        "question": "Elements in the same group of the periodic table have the same number of...",
                        "options": {"A": "Protons", "B": "Neutrons", "C": "Electrons in outer shell", "D": "Energy levels"},
                        "correct_answer": "C",
                        "explanation": "Elements in the same group have the same number of valence electrons (electrons in the outer shell), which gives them similar chemical properties.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Metals": {
                    "easy": {
                        "question": "Which property is NOT characteristic of metals?",
                        "options": {"A": "Conduct electricity", "B": "Malleable", "C": "Brittle when hammered", "D": "Lustrous"},
                        "correct_answer": "C",
                        "explanation": "Metals are malleable (can be hammered into sheets) and ductile, not brittle. Non-metals are typically brittle when solid.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Chemistry of Environment": {
                    "easy": {
                        "question": "Which gas is the main cause of the greenhouse effect?",
                        "options": {"A": "Oxygen", "B": "Nitrogen", "C": "Carbon dioxide", "D": "Argon"},
                        "correct_answer": "C",
                        "explanation": "Carbon dioxide traps heat in the atmosphere, causing global warming. It's produced by burning fossil fuels and deforestation.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Organic Chemistry": {
                    "easy": {
                        "question": "Hydrocarbons contain only which two elements?",
                        "options": {"A": "Hydrogen and oxygen", "B": "Carbon and oxygen", "C": "Hydrogen and carbon", "D": "Carbon and nitrogen"},
                        "correct_answer": "C",
                        "explanation": "Hydrocarbons are organic compounds containing only hydrogen and carbon atoms. Examples include methane (CH₄) and ethane (C₂H₆).",
                        "cognitive_level": "knowledge_understanding"
                    }
                }
            },
            "Physics": {
                "Motion, Forces and Energy": {
                    "easy": {
                        "question": "What is the unit of force?",
                        "options": {"A": "Joule", "B": "Newton", "C": "Watt", "D": "Pascal"},
                        "correct_answer": "B",
                        "explanation": "Force is measured in Newtons (N). This unit is named after Sir Isaac Newton, who formulated the laws of motion.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Thermal Physics": {
                    "easy": {
                        "question": "Heat transfer by the movement of fluids is called...",
                        "options": {"A": "Conduction", "B": "Convection", "C": "Radiation", "D": "Expansion"},
                        "correct_answer": "B",
                        "explanation": "Convection is heat transfer in liquids and gases where the heated fluid moves, carrying heat energy with it. Hot air rises because it's less dense.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Waves": {
                    "easy": {
                        "question": "Which equation correctly relates wave speed, frequency, and wavelength?",
                        "options": {"A": "v = f + λ", "B": "v = f - λ", "C": "v = f × λ", "D": "v = f ÷ λ"},
                        "correct_answer": "C",
                        "explanation": "The wave equation is v = fλ (speed = frequency × wavelength). This fundamental relationship applies to all types of waves.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Electricity": {
                    "easy": {
                        "question": "According to Ohm's law, voltage equals...",
                        "options": {"A": "Current × Resistance", "B": "Current + Resistance", "C": "Current ÷ Resistance", "D": "Current - Resistance"},
                        "correct_answer": "A",
                        "explanation": "Ohm's law states that V = I × R (Voltage = Current × Resistance). This is the most important equation in electrical circuits.",
                        "cognitive_level": "knowledge_understanding"
                    }
                },
                "Nuclear Physics": {
                    "easy": {
                        "question": "Which type of radiation is stopped by a sheet of paper?",
                        "options": {"A": "Alpha", "B": "Beta", "C": "Gamma", "D": "X-rays"},
                        "correct_answer": "A",
                        "explanation": "Alpha particles are the least penetrating radiation and can be stopped by paper or a few centimeters of air. They are helium nuclei with +2 charge.",
                        "cognitive_level": "knowledge_understanding"
                    }
                }
            }
        }
        
        # Get fallback question for the specific topic
        subject_fallbacks = fallback_questions.get(subject, {})
        topic_fallbacks = subject_fallbacks.get(topic, {})
        difficulty_fallback = topic_fallbacks.get(difficulty)
        
        if difficulty_fallback:
            result = difficulty_fallback.copy()
        else:
            # Generic fallback if specific topic not found
            result = {
                "question": f"What is an important concept in {topic}?",
                "options": {"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"},
                "correct_answer": "A",
                "explanation": f"This is a basic concept in {topic} that O-Level students should understand."
            }
        
        # Add metadata
        result.update({
            'subject': subject,
            'topic': topic,
            'difficulty': difficulty,
            'category': subject,
            'question_type': 'mcq',
            'source': 'fallback_olevel',
            'learning_objective': f"Understand basic concepts of {topic}",
            'real_world_application': f"Apply {topic} knowledge in everyday situations"
        })
        
        return result
    
    def generate_multiple_questions(self, subject: str, topic: str, count: int = 5) -> List[Dict]:
        """Generate multiple questions for a topic across different difficulties"""
        questions = []
        
        # Generate questions across difficulties for comprehensive coverage
        difficulties = ['easy', 'easy', 'medium', 'medium', 'difficult']  # More easy/medium for O-Level
        
        for i in range(min(count, len(difficulties))):
            difficulty = difficulties[i]
            
            try:
                question = self.generate_topical_question(subject, topic, difficulty)
                if question:
                    questions.append(question)
                    time.sleep(1)  # Small delay between generations
                else:
                    logger.warning(f"Failed to generate question {i+1} for {subject}/{topic}")
                    
            except Exception as e:
                logger.error(f"Error generating question {i+1} for {subject}/{topic}: {e}")
        
        return questions
    
    def get_topic_coverage_status(self, subject: str) -> Dict[str, int]:
        """Get current question count per topic for coverage analysis"""
        try:
            from constants import TOPICS
            from database.external_db import count_questions_by_category_and_topic
            
            topics = TOPICS.get(subject, [])
            coverage = {}
            
            for topic in topics:
                count = count_questions_by_category_and_topic(subject, topic)
                coverage[topic] = count
            
            return coverage
            
        except Exception as e:
            logger.error(f"Error getting topic coverage for {subject}: {e}")
            return {}
    
    def ensure_minimum_questions_per_topic(self, subject: str, min_questions: int = 10):
        """Ensure each topic has minimum number of questions in database"""
        try:
            from constants import TOPICS
            
            topics = TOPICS.get(subject, [])
            logger.info(f"Ensuring minimum {min_questions} questions per topic for {subject}")
            
            for topic in topics:
                current_count = self.get_topic_coverage_status(subject).get(topic, 0)
                
                if current_count < min_questions:
                    needed = min_questions - current_count
                    logger.info(f"Generating {needed} questions for {subject}/{topic}")
                    
                    # Generate needed questions
                    new_questions = self.generate_multiple_questions(subject, topic, needed)
                    
                    # Save to database
                    for question in new_questions:
                        self._save_question_to_database(question)
                    
                    logger.info(f"✅ Added {len(new_questions)} questions for {subject}/{topic}")
                else:
                    logger.info(f"✅ {subject}/{topic} has sufficient questions ({current_count})")
                    
        except Exception as e:
            logger.error(f"Error ensuring minimum questions for {subject}: {e}")
    
    def _save_question_to_database(self, question_data: Dict) -> bool:
        """Save generated question to database with proper O-Level metadata"""
        try:
            from database.external_db import save_ai_question_to_database
            
            # Prepare question for database storage
            db_question = {
                'question': question_data['question'],
                'options': question_data['options'],
                'correct_answer': question_data['correct_answer'],
                'explanation': question_data['explanation'],
                'difficulty': question_data['difficulty'],
                'learning_objective': question_data.get('learning_objective', ''),
                'real_world_application': question_data.get('real_world_application', '')
            }
            
            result = save_ai_question_to_database(
                db_question, 
                question_data['subject'], 
                question_data['topic']
            )
            
            if result:
                logger.info(f"✅ Saved O-Level question to database: {question_data['subject']}/{question_data['topic']}")
                return True
            else:
                logger.error(f"❌ Failed to save question to database")
                return False
                
        except Exception as e:
            logger.error(f"Error saving question to database: {e}")
            return False

    def initialize_physics_support(self):
        """Initialize comprehensive Physics topic support with ZIMSEC guidelines"""
        # Enhanced Physics topic details following comprehensive ZIMSEC guidelines
        self.physics_topic_details = {
            "Motion, Forces and Energy": {
                "objectives": [
                    "Distinguish between distance and displacement, speed and velocity",
                    "Calculate speed, velocity, and acceleration using appropriate formulas",
                    "Interpret distance-time and speed-time graphs",
                    "Apply Newton's three laws of motion to real situations", 
                    "Calculate moments and apply principle of moments",
                    "Understand different forms of energy and energy conservation",
                    "Calculate kinetic energy, potential energy, work done, and power",
                    "Understand and calculate efficiency of energy transfers",
                    "Apply pressure concepts and Hooke's law"
                ],
                "key_concepts": [
                    "Distance vs displacement", "Speed vs velocity", "Acceleration calculations",
                    "Distance-time graphs", "Speed-time graphs", "Newton's first law", 
                    "Newton's second law (F=ma)", "Newton's third law", "Types of forces",
                    "Friction and air resistance", "Terminal velocity", "Moments and levers",
                    "Pressure calculations", "Hooke's law", "Forms of energy",
                    "Kinetic energy (KE=½mv²)", "Gravitational potential energy (GPE=mgh)",
                    "Energy conservation", "Work done (W=Fs)", "Power (P=E/t)", "Efficiency"
                ],
                "misconceptions": [
                    "Distance and displacement are the same",
                    "Speed and velocity are the same",
                    "Heavier objects fall faster in vacuum",
                    "Force is needed to keep objects moving at constant velocity",
                    "Weight and mass are the same thing",
                    "Energy can be created or destroyed"
                ]
            },
            "Thermal Physics": {
                "objectives": [
                    "Distinguish between heat and temperature clearly",
                    "Explain thermal expansion in solids, liquids, and gases", 
                    "Describe applications of thermal expansion (bimetallic strips, expansion gaps)",
                    "Understand the three methods of heat transfer",
                    "Explain conduction mechanism in metals and non-metals",
                    "Describe convection currents and their applications",
                    "Understand radiation properties and applications",
                    "Analyze vacuum flask design and heat transfer control",
                    "Calculate specific heat capacity and latent heat",
                    "Apply thermal principles to real-world situations"
                ],
                "key_concepts": [
                    "Heat vs temperature", "Thermal expansion in solids/liquids/gases",
                    "Bimetallic strips", "Linear expansion applications", "Conduction mechanism",
                    "Good and poor conductors", "Convection currents", "Natural vs forced convection",
                    "Radiation properties", "Surface color and radiation", "Vacuum flask design",
                    "Home insulation methods", "Specific heat capacity (E=mcΔθ)",
                    "Latent heat of fusion and vaporization (E=mL)", "Thermometer types"
                ],
                "misconceptions": [
                    "Heat and temperature are the same",
                    "Conduction occurs in liquids and gases",
                    "Radiation requires a medium to travel",
                    "All materials expand equally when heated",
                    "Metal saucepan handles get hot by convection"
                ]
            },
            "Waves": {
                "objectives": [
                    "Describe wave properties: amplitude, wavelength, frequency, period",
                    "Distinguish between transverse and longitudinal waves",
                    "Apply the wave equation (v = fλ) to solve problems",
                    "Explain wave behaviors: reflection, refraction, diffraction, dispersion",
                    "Understand the complete electromagnetic spectrum and applications",
                    "Describe sound wave properties and applications",
                    "Explain ultrasound applications in medicine and industry",
                    "Understand light behavior: reflection, refraction, total internal reflection",
                    "Analyze lens behavior and applications",
                    "Describe the eye and vision defects"
                ],
                "key_concepts": [
                    "Transverse vs longitudinal waves", "Wave terminology (amplitude, wavelength, frequency)",
                    "Wave equation (v=fλ)", "Wave speed in different media", "Reflection laws",
                    "Refraction rules and refractive index", "Diffraction and gap size effects",
                    "Electromagnetic spectrum order", "Radio waves applications", "Microwave uses and dangers",
                    "Infrared radiation", "Visible light and colors", "Ultraviolet hazards", 
                    "X-ray applications", "Gamma ray properties", "Sound speed in different media",
                    "Echo calculations (d=vt/2)", "Audible range and ultrasound", "Medical ultrasound",
                    "Sonar applications", "Light reflection and mirrors", "Light refraction and lenses",
                    "Total internal reflection and optical fibers", "Eye structure and function",
                    "Vision defects and corrections", "Dispersion and color"
                ],
                "misconceptions": [
                    "Sound and light waves are the same type",
                    "All electromagnetic waves need a medium",
                    "Loud sounds travel faster than quiet sounds",
                    "Light always travels in straight lines",
                    "Frequency and wavelength are independent of wave speed"
                ]
            },
            "Electricity": {
                "objectives": [
                    "Explain charging by friction and electrostatic phenomena",
                    "Understand electric fields and forces",
                    "Describe uses and dangers of static electricity",
                    "Define current, voltage, and resistance",
                    "Apply Ohm's law to circuit calculations",
                    "Analyze series and parallel circuits",
                    "Calculate electrical power and energy consumption",
                    "Choose appropriate fuses and understand safety features",
                    "Understand mains electricity and three-pin plugs",
                    "Explain electrical hazards and safety precautions"
                ],
                "key_concepts": [
                    "Static electricity and charging by friction", "Like charges repel, unlike attract",
                    "Electric fields and field lines", "Lightning formation", "Uses of static electricity",
                    "Dangers of static and prevention", "Electric current definition",
                    "Potential difference (voltage)", "Resistance and Ohm's law (V=IR)",
                    "Series circuit rules", "Parallel circuit rules", "Circuit component symbols",
                    "Electrical power equations (P=VI, P=I²R, P=V²/R)", "Energy calculations (E=Pt)",
                    "Cost calculations", "Fuse selection and operation", "Three-pin plug wiring",
                    "AC vs DC", "Electrical safety features", "Mains electricity hazards"
                ],
                "misconceptions": [
                    "Current gets used up as it flows through circuits",
                    "Voltage and current are the same thing",
                    "Conventional current flows from positive to negative",
                    "Fuses increase the safety by allowing more current",
                    "All materials conduct electricity equally"
                ]
            },
            "Nuclear Physics": {
                "objectives": [
                    "Describe atomic structure using protons, neutrons, and electrons",
                    "Understand atomic number, mass number, and isotopes",
                    "Explain the nature of radioactive decay",
                    "Compare alpha, beta, and gamma radiation properties",
                    "Calculate half-life and interpret decay graphs",
                    "Understand background radiation and its sources",
                    "Apply radiation safety principles",
                    "Evaluate medical applications of radioactivity",
                    "Describe industrial uses of radioactivity",
                    "Understand nuclear power generation"
                ],
                "key_concepts": [
                    "Subatomic particles (protons, neutrons, electrons)", "Atomic number and mass number",
                    "Isotope definition and examples", "Radioactive decay process",
                    "Alpha particle properties (helium nucleus, +2 charge, stopped by paper)",
                    "Beta particle properties (electrons, -1 charge, stopped by aluminum)",
                    "Gamma ray properties (EM waves, no charge, stopped by lead)",
                    "Ionizing power vs penetrating power", "Half-life concept and calculations",
                    "Background radiation sources", "Radiation detection methods",
                    "Radiation safety (distance, shielding, time)", "Medical tracers",
                    "Radiotherapy applications", "Carbon-14 dating", "Industrial applications",
                    "Nuclear fission and fusion", "Nuclear power advantages and disadvantages"
                ],
                "misconceptions": [
                    "Radioactive decay can be controlled or stopped",
                    "All radiation is equally dangerous",
                    "Radioactivity is always artificial/man-made",
                    "Nuclear power and nuclear weapons are the same thing",
                    "Radiation makes things permanently radioactive"
                ]
            }
        }
        
        # Enhanced Physics aspect variations following comprehensive ZIMSEC guidelines with detailed subtopics
        self.physics_aspect_variations = {
            "Motion, Forces and Energy": [
                # SUBTOPIC 1.1: MOTION
                "distance_vs_displacement_scalar_vector", "speed_vs_velocity_scalar_vector",
                "average_speed_calculations_multi_stage", "instantaneous_speed_concept",
                "acceleration_calculations_vu_t", "acceleration_positive_negative",
                "distance_time_graphs_interpretation", "distance_time_graph_gradients",
                "speed_time_graphs_interpretation", "speed_time_graph_acceleration",
                "speed_time_graph_area_distance", "motion_equations_v_u_at",
                "motion_equations_s_ut_05at2", "motion_equations_v2_u2_2as",
                "unit_conversions_kmh_to_ms", "scalar_vector_quantities",
                
                # SUBTOPIC 1.2: FORCES
                "force_definition_push_pull", "force_effects_motion_shape",
                "contact_forces_friction_tension", "non_contact_forces_gravity_magnetic",
                "weight_vs_mass_w_mg", "standard_gravity_10ms2",
                "friction_opposes_motion", "friction_useful_problematic",
                "air_resistance_terminal_velocity", "balanced_forces_equilibrium",
                "unbalanced_forces_acceleration", "resultant_forces_calculation",
                "newtons_first_law_inertia", "newtons_first_law_applications",
                "newtons_second_law_f_ma", "newtons_second_law_units",
                "newtons_third_law_action_reaction", "newtons_third_law_examples",
                "moments_force_distance", "principle_of_moments_equilibrium",
                "moments_applications_levers", "centre_of_gravity_stability",
                "pressure_force_area", "pressure_large_area_low",
                "liquid_pressure_depth_density", "hookes_law_extension",
                "hookes_law_elastic_limit",
                
                # SUBTOPIC 1.3: ENERGY
                "energy_definition_capacity_work", "law_of_conservation_energy",
                "kinetic_energy_ke_05mv2", "gravitational_potential_energy_gpe_mgh",
                "elastic_potential_energy", "chemical_energy_fuels_batteries",
                "thermal_heat_energy", "light_energy_sound_energy",
                "electrical_energy_nuclear_energy", "energy_transfers_mechanical_electrical",
                "energy_transformations_pendulum", "energy_transformations_falling_objects",
                "energy_transformations_motor_generator", "energy_transformations_bulb_battery",
                "work_done_force_distance", "work_done_energy_transferred",
                "power_rate_energy_transfer", "power_equations_p_wt_p_et",
                "efficiency_concept_useful_wasted", "efficiency_calculations_percentage",
                "improving_efficiency_reduce_friction", "sankey_diagrams_interpretation",
                "renewable_energy_sources", "non_renewable_energy_sources",
                "energy_source_comparison", "cost_energy_calculations"
            ],
            "Thermal Physics": [
                # SUBTOPIC 2.1: THERMAL PROPERTIES
                "temperature_vs_heat_energy", "temperature_kinetic_energy",
                "temperature_scales_celsius_kelvin", "thermometer_liquid_in_glass",
                "mercury_vs_alcohol_thermometers", "clinical_thermometer_constriction",
                "thermal_equilibrium_concept", "heat_flows_hot_to_cold",
                "thermal_expansion_solids", "linear_expansion_applications",
                "bimetallic_strips_thermostats", "expansion_gaps_railway_tracks",
                "thermal_expansion_liquids", "water_irregular_expansion_4c",
                "water_expands_freezing", "thermal_expansion_gases",
                "expansion_problems_cracked_glass", "specific_heat_capacity_concept",
                "specific_heat_capacity_equation_e_mcdt", "water_high_heat_capacity",
                "specific_heat_capacity_applications", "latent_heat_fusion_vaporization",
                "latent_heat_equation_e_ml", "latent_heat_applications_ice_sweating",
                "heating_curves_state_changes",
                
                # SUBTOPIC 2.2: THERMAL PROCESSES
                "conduction_solids_only", "conduction_mechanism_particles",
                "conduction_metals_free_electrons", "good_conductors_metals",
                "poor_conductors_insulators", "conduction_factors_material_thickness",
                "convection_fluids_only", "convection_mechanism_density",
                "convection_currents_water_air", "natural_vs_forced_convection",
                "convection_applications_heating", "sea_breeze_land_breeze",
                "radiation_electromagnetic_waves", "radiation_no_medium_vacuum",
                "radiation_surface_color_effects", "dark_surfaces_absorb_emit",
                "shiny_surfaces_reflect", "radiation_temperature_surface_area",
                "vacuum_flask_double_wall_vacuum", "vacuum_flask_silvered_surfaces",
                "vacuum_flask_stopper_insulation", "home_insulation_loft_cavity",
                "double_glazing_air_gap", "controlling_heat_loss_gain",
                "insulation_trapped_air"
            ],
            "Waves": [
                # SUBTOPIC 3.1: GENERAL WAVE PROPERTIES
                "wave_definition_transfer_energy", "waves_transfer_energy_not_matter",
                "transverse_waves_perpendicular", "longitudinal_waves_parallel",
                "transverse_examples_em_water", "longitudinal_examples_sound",
                "amplitude_maximum_displacement", "amplitude_energy_intensity",
                "wavelength_distance_phase", "frequency_waves_per_second",
                "period_time_one_wave", "period_frequency_relationship_t_1f",
                "wave_speed_distance_per_second", "wave_equation_v_flambda",
                "wave_equation_rearrangements", "wavefronts_rays_direction",
                
                # SUBTOPIC 3.2: WAVE BEHAVIORS
                "reflection_wave_bounces", "law_of_reflection_i_r",
                "regular_specular_reflection", "diffuse_reflection_rough",
                "refraction_direction_change", "refraction_speed_change",
                "refraction_denser_medium_slows", "refraction_bends_toward_normal",
                "refractive_index_n_speed", "refractive_index_snells_law",
                "diffraction_spreading_gap", "diffraction_gap_size_wavelength",
                "diffraction_long_wavelength_more", "dispersion_white_light_spectrum",
                "dispersion_prism_roygbiv", "total_internal_reflection_conditions",
                "critical_angle_calculation", "optical_fibers_tir_applications",
                
                # SUBTOPIC 3.3: ELECTROMAGNETIC SPECTRUM
                "em_spectrum_transverse_waves", "em_spectrum_speed_light_vacuum",
                "em_spectrum_order_radio_gamma", "em_spectrum_frequency_wavelength_energy",
                "radio_waves_longest_wavelength", "radio_waves_broadcasting_wifi",
                "microwaves_oven_radar", "microwaves_dangers_heating",
                "infrared_thermal_imaging", "infrared_remote_controls",
                "visible_light_400_700nm", "visible_light_colors_roygbiv",
                "ultraviolet_fluorescence", "ultraviolet_dangers_skin_cancer",
                "xrays_medical_imaging", "xrays_dangers_ionizing",
                "gamma_rays_shortest_wavelength", "gamma_rays_sterilization_cancer",
                "em_waves_comparison_penetration", "ionizing_vs_nonionizing",
                
                # SUBTOPIC 3.4: SOUND WAVES
                "sound_longitudinal_waves", "sound_requires_medium",
                "sound_speed_solids_liquids_gases", "sound_speed_air_340ms",
                "sound_production_vibrating_objects", "loudness_amplitude_relationship",
                "pitch_frequency_relationship", "quality_timbre_waveform",
                "audible_range_20_20000hz", "infrasound_below_20hz",
                "ultrasound_above_20khz", "ultrasound_medical_imaging",
                "sonar_echo_depth_calculation", "sonar_distance_vt2",
                "echo_reflection_delay", "noise_pollution_hearing_damage",
                
                # SUBTOPIC 3.5: LIGHT
                "light_transverse_em_wave", "light_speed_3x10e8ms",
                "luminous_vs_nonluminous", "light_reflection_laws",
                "plane_mirror_image_properties", "concave_convex_mirrors",
                "light_refraction_bending", "refractive_index_mediums",
                "refraction_rules_denser_medium", "apparent_depth_water",
                "convex_lens_converging", "concave_lens_diverging",
                "lens_real_virtual_images", "lens_applications_camera_eye",
                "dispersion_white_light", "primary_colors_rgb",
                "color_filters_transmission", "total_internal_reflection_optical_fibers",
                "eye_structure_cornea_lens_retina", "eye_accommodation_focusing",
                "short_sight_myopia_correction", "long_sight_hyperopia_correction",
                "camera_vs_eye_comparison"
            ],
            "Electricity": [
                # SUBTOPIC 4.1: STATIC ELECTRICITY
                "charge_types_positive_negative", "like_charges_repel_unlike_attract",
                "atoms_neutral_protons_electrons", "charging_electron_transfer",
                "static_electricity_buildup", "charging_by_friction_rubbing",
                "materials_perspex_polythene_glass", "electric_fields_region_force",
                "electric_field_patterns", "electrostatic_attraction_induction",
                "sparking_discharge_ionization", "lightning_formation_cloud_ground",
                "lightning_dangers_damage_fires", "static_dangers_fires_explosions",
                "static_uses_photocopiers_printers", "static_uses_electrostatic_precipitators",
                "static_uses_spray_painting", "preventing_static_earthing",
                "preventing_static_conductivity", "anti_static_materials",
                
                # SUBTOPIC 4.2: CURRENT ELECTRICITY
                "current_flow_charge", "current_electron_flow_direction",
                "conventional_current_positive_negative", "potential_difference_voltage",
                "voltage_energy_per_charge", "resistance_opposition_current",
                "conductors_metals_graphite", "insulators_plastic_rubber",
                "ohms_law_v_ir", "ohms_law_direct_proportional",
                "ohmic_conductors_constant_resistance", "nonohmic_filament_lamp_diode",
                "circuit_symbols_components", "series_circuit_characteristics",
                "series_current_same", "series_voltage_adds",
                "series_resistance_adds", "parallel_circuit_characteristics",
                "parallel_voltage_same", "parallel_current_adds",
                "parallel_resistance_reciprocal", "electrical_power_p_vi",
                "power_equations_p_i2r_p_v2r", "electrical_energy_e_pt",
                "energy_equations_e_vit", "kilowatt_hours_kwh_units",
                "cost_calculations_energy_price", "fuse_operation_rating",
                "circuit_breaker_electromagnetic", "choosing_fuse_rating",
                "variable_resistor_rheostat", "thermistor_temperature_sensor",
                "ldr_light_dependent_resistor", "diode_rectification_one_direction",
                "led_light_emitting_diode",
                
                # SUBTOPIC 4.3: MAINS ELECTRICITY
                "mains_ac_alternating_current", "ac_vs_dc_direction",
                "mains_voltage_230v_zimbabwe", "mains_frequency_50hz",
                "three_pin_plug_wires", "live_wire_brown_dangerous",
                "neutral_wire_blue_completes", "earth_wire_green_yellow_safety",
                "plug_structure_cable_grip", "wiring_plug_correct_pins",
                "earthing_safety_metal_case", "fuse_live_wire_protection",
                "circuit_breaker_resettable", "rcd_residual_current_device",
                "insulation_prevent_leakage", "double_insulation_plastic",
                "electrical_hazards_shock_burns", "hazards_damaged_insulation",
                "hazards_overheating_water", "safety_precautions_wet_hands",
                "safety_precautions_overload", "energy_consumption_kwh",
                "meter_reading_units", "efficiency_electrical_wasted_heat",
                "reducing_costs_efficiency"
            ],
            "Nuclear Physics": [
                # SUBTOPIC 5.1: ATOMIC STRUCTURE
                "atomic_structure_nucleus_electrons", "nucleus_protons_neutrons",
                "subatomic_particles_table", "proton_charge_mass",
                "neutron_charge_mass", "electron_charge_mass",
                "atom_mostly_empty_space", "atomic_number_z_protons",
                "mass_number_a_protons_neutrons", "atomic_notation_az_x",
                "calculating_neutrons_n_a_z", "isotope_definition_same_z",
                "isotope_examples_carbon_14", "radioactive_isotopes_unstable",
                "electron_configuration_shells", "shell_max_electrons_2_8_8",
                "electron_configuration_examples",
                
                # SUBTOPIC 5.2: RADIOACTIVITY
                "radioactivity_spontaneous_decay", "radioactive_decay_random",
                "radioactive_decay_unstable_stable", "alpha_particle_helium_nucleus",
                "alpha_charge_2_mass_4", "alpha_most_ionizing_least_penetrating",
                "alpha_stopped_paper_skin", "alpha_decay_mass_minus_4_z_minus_2",
                "beta_particle_electron", "beta_charge_minus_1_mass_negligible",
                "beta_medium_ionizing_penetrating", "beta_stopped_aluminum",
                "beta_decay_z_plus_1_mass_same", "gamma_ray_em_wave",
                "gamma_charge_0_mass_0", "gamma_least_ionizing_most_penetrating",
                "gamma_reduced_lead_concrete", "radiation_comparison_table",
                "ionizing_vs_penetrating_power", "geiger_muller_tube_detection",
                "cloud_chamber_tracks", "photographic_film_badges",
                "background_radiation_always_present", "background_natural_sources",
                "background_artificial_sources", "measuring_radiation_subtract_background",
                "half_life_definition_time_half", "half_life_constant_isotope",
                "half_life_calculations", "half_life_graphs_exponential",
                "half_life_examples_range", "radiation_hazards_ionizing_dna",
                "radiation_hazards_cancer_mutation", "safety_distance_shielding_time",
                "safety_handling_tongs_storage", "safety_personal_protection",
                "trefoil_symbol_warning",
                
                # SUBTOPIC 5.3: USES OF RADIOACTIVITY
                "medical_tracers_isotopes", "medical_tracers_short_half_life",
                "technetium_99m_common_tracer", "iodine_131_thyroid",
                "radiotherapy_external_gamma", "radiotherapy_cobalt_60",
                "radiotherapy_internal_brachytherapy", "sterilization_cobalt_60",
                "industrial_thickness_monitoring", "thickness_gauge_beta_sources",
                "leak_detection_pipes", "level_monitoring_containers",
                "radiography_welds_structures", "smoke_detector_americium_241",
                "carbon_14_dating_principle", "carbon_14_dating_process",
                "carbon_14_dating_limitations", "uranium_lead_dating_rocks",
                "food_irradiation_preservation", "mutation_breeding_crops",
                "sterile_insect_technique", "nuclear_fission_uranium_235",
                "nuclear_fission_chain_reaction", "nuclear_reactor_components",
                "nuclear_fission_advantages", "nuclear_fission_disadvantages",
                "nuclear_fusion_light_nuclei", "nuclear_fusion_sun",
                "nuclear_fusion_advantages", "nuclear_fusion_experimental"
            ]
        }
    
    def get_physics_topic_guidelines(self, topic: str) -> Dict:
        """Get comprehensive guidelines for a specific physics topic"""
        if not hasattr(self, 'physics_topic_details'):
            self.initialize_physics_support()
        
        return self.physics_topic_details.get(topic, {
            "objectives": [f"Understand basic concepts of {topic}"],
            "key_concepts": [topic],
            "misconceptions": []
        })
    
    def get_topic_information(self, subject: str, topic: str) -> Dict:
        """Get comprehensive topic information for any subject"""
        if subject == "Biology":
            return self.biology_topic_details.get(topic, {})
        elif subject == "Chemistry":
            if not hasattr(self, 'chemistry_topic_details'):
                self.initialize_chemistry_support()
            return self.chemistry_topic_details.get(topic, {})
        elif subject == "Physics":
            if not hasattr(self, 'physics_topic_details'):
                self.initialize_physics_support()
            return self.physics_topic_details.get(topic, {})
        else:
            return {}

# Global instance
combined_science_generator = CombinedScienceGenerator()
