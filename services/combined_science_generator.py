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
    
    def generate_topical_question(self, subject: str, topic: str, difficulty: str = 'medium') -> Optional[Dict]:
        """Generate O-Level appropriate topical question with professional explanation"""
        try:
            if not self.api_key:
                logger.error("DeepSeek API key not configured")
                return self._get_fallback_question(subject, topic, difficulty)
            
            # Create O-Level appropriate prompt
            prompt = self._create_olevel_prompt(subject, topic, difficulty)
            
            # Generate question using DeepSeek
            result = self._call_deepseek_api(prompt, f"{subject}_{topic}_{difficulty}")
            
            if result:
                # Validate and enhance the result
                return self._validate_and_enhance_question(result, subject, topic, difficulty)
            else:
                logger.warning(f"DeepSeek generation failed for {subject}/{topic}, using fallback")
                return self._get_fallback_question(subject, topic, difficulty)
                
        except Exception as e:
            logger.error(f"Error generating {subject} question for {topic}: {e}")
            return self._get_fallback_question(subject, topic, difficulty)
    
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
    
    def _validate_and_enhance_question(self, question_data: Dict, subject: str, topic: str, difficulty: str) -> Dict:
        """Validate and enhance the generated question for O-Level standards"""
        try:
            # Ensure all required fields are present
            required_fields = ['question', 'options', 'correct_answer', 'explanation']
            for field in required_fields:
                if field not in question_data:
                    logger.warning(f"Missing field {field} in generated question")
                    return self._get_fallback_question(subject, topic, difficulty)
            
            # Validate options format
            if not isinstance(question_data['options'], dict):
                logger.warning("Options not in correct format")
                return self._get_fallback_question(subject, topic, difficulty)
            
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
            return self._get_fallback_question(subject, topic, difficulty)
    
    def _get_fallback_question(self, subject: str, topic: str, difficulty: str) -> Dict:
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

# Global instance
combined_science_generator = CombinedScienceGenerator()
