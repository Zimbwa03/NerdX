import json
import logging
import hashlib
from typing import Dict, List, Optional
from constants import TOPICS, DIFFICULTY_LEVELS, POINT_VALUES, A_LEVEL_PHYSICS_ALL_TOPICS
from services.ai_service import AIService
from database.external_db import (
    get_random_mcq_question, save_ai_question_to_database,
    get_questions_by_category_and_topic, count_questions_by_category_and_topic,
    get_questions_by_subject_and_topic, count_questions_by_subject_and_topic
)

logger = logging.getLogger(__name__)

class QuestionService:
    """Service for managing questions and question generation"""
    
    def __init__(self):
        self.ai_service = AIService()
    
    def get_question(self, user_id: str, subject: str, topic: str, difficulty: str, force_ai: bool = False) -> Optional[Dict]:
        """Get a question for the user (from database or generate new)"""
        try:
            # Validate input parameters
            if not self._validate_question_params(subject, topic, difficulty):
                return None
            
            # Try to get from database first (unless forced AI generation)
            if not force_ai:
                db_question = self._get_database_question(user_id, subject, topic, difficulty)
                if db_question:
                    return db_question
            
            # Generate new question using AI with diversity tracking
            ai_question = self._generate_ai_question(subject, topic, difficulty, user_id)
            if ai_question:
                # Save to database for future use
                self._save_generated_question(ai_question, subject, topic, difficulty)
                return ai_question
            
            logger.error(f"Failed to get question for {subject}/{topic}/{difficulty}")
            return None
            
        except Exception as e:
            logger.error(f"Error getting question: {e}")
            return None
    
    def _validate_question_params(self, subject: str, topic: str, difficulty: str) -> bool:
        """Validate question parameters"""
        if subject not in TOPICS:
            logger.error(f"Invalid subject: {subject}")
            return False
        
        if topic not in TOPICS[subject]:
            logger.error(f"Invalid topic for {subject}: {topic}")
            return False
        
        if difficulty not in DIFFICULTY_LEVELS:
            logger.error(f"Invalid difficulty: {difficulty}")
            return False
        
        return True
    
    def _get_database_question(self, user_id: str, subject: str, topic: str, difficulty: str) -> Optional[Dict]:
        """Get a question from the database"""
        try:
            # Use different query functions based on subject type
            if subject in ['Biology', 'Chemistry', 'Physics']:
                # For Combined Science subjects, use subject and topic filtering
                question_count = count_questions_by_subject_and_topic(subject, topic)
                if question_count == 0:
                    logger.info(f"No database questions available for {subject}/{topic}")
                    return None
                
                # Get a pool of questions that match subject/topic
                questions = get_questions_by_subject_and_topic(subject, topic, limit=50)
                logger.info(f"Retrieved {len(questions)} {subject} questions for topic '{topic}' from database")
            else:
                # For other subjects, use category and topic filtering
                question_count = count_questions_by_category_and_topic(subject, topic)
                if question_count == 0:
                    logger.info(f"No database questions available for {subject}/{topic}")
                    return None
                
                # Get a pool of questions that match subject/topic
                questions = get_questions_by_category_and_topic(subject, topic, limit=50)
            
            # Filter out recently asked questions (increased window for better diversity)
            from database.session_db import get_recent_question_hashes
            recent_days = 3 if subject in ['Biology', 'Chemistry', 'Physics'] else 7  # Increased from 1 to 3 days for better diversity
            recent_hashes = get_recent_question_hashes(user_id, days=recent_days)
            
            available_questions = []
            for question in questions:
                question_hash = self._generate_question_hash(question['question'])
                if question_hash not in recent_hashes:
                    available_questions.append(question)

            # Prioritize knowledge-focused questions over experimental ones
            if available_questions:
                knowledge_questions = [q for q in available_questions if self._is_knowledge_focused(q)]
                if knowledge_questions:
                    logger.info(f"Found {len(knowledge_questions)} knowledge-focused questions for {subject}/{topic}")
                    available_questions = knowledge_questions
                else:
                    logger.info(f"No knowledge-focused questions found, using all {len(available_questions)} available questions")

            # If all questions are recently seen, allow reuse but still prioritize knowledge-focused
            if not available_questions:
                logger.info(f"All questions recently seen for {subject}/{topic}; allowing reuse for continued practice")
                knowledge_questions = [q for q in questions if self._is_knowledge_focused(q)]
                available_questions = knowledge_questions if knowledge_questions else questions
            
            # Select question based on difficulty (DB field is 'difficulty_level' in Supabase)
            def _get_db_difficulty(row: Dict) -> Optional[str]:
                return row.get('difficulty_level') or row.get('difficulty')

            filtered_questions = [q for q in available_questions if _get_db_difficulty(q) == difficulty]
            if not filtered_questions:
                # Fallback to any difficulty if specific not available
                filtered_questions = available_questions
            
            if filtered_questions:
                import random
                question = random.choice(filtered_questions)
                
                # Format for consistency (DB schema uses answer/explanation/options fields)
                # Build options from stored JSON or discrete columns
                options_field = question.get('options')
                if isinstance(options_field, str):
                    try:
                        options_parsed = json.loads(options_field)
                    except Exception:
                        options_parsed = {}
                elif isinstance(options_field, dict):
                    options_parsed = options_field
                else:
                    options_parsed = {}

                if not options_parsed:
                    options_parsed = {
                        'A': question.get('option_a') or question.get('a') or '',
                        'B': question.get('option_b') or question.get('b') or '',
                        'C': question.get('option_c') or question.get('c') or '',
                        'D': question.get('option_d') or question.get('d') or '',
                    }

                return {
                    'question': question['question'],
                    'options': options_parsed,
                    'correct_answer': question.get('answer') or question.get('correct_answer'),  # Use 'answer' field from Supabase
                    'explanation': question.get('explanation', ''),
                    'solution': question.get('solution', ''),
                    'points': question.get('points', POINT_VALUES.get(difficulty, POINT_VALUES['medium'])),
                    'source': 'database',
                    'question_id': question.get('id')
                }
            
            return None
            
        except Exception as e:
            logger.error(f"Error getting database question: {e}")
            return None
    
    def _generate_ai_question(self, subject: str, topic: str, difficulty: str, user_id: str = None) -> Optional[Dict]:
        """Generate a new question using AI with O-Level appropriate quality"""
        try:
            if subject == "Mathematics":
                question_data = self.ai_service.generate_math_question(topic, difficulty)
            elif subject in ["Biology", "Chemistry", "Physics"]:
                # Use professional Combined Science generator for O-Level quality with diversity
                from services.combined_science_generator import combined_science_generator
                logger.info(f"Generating diverse professional O-Level {subject} question for {topic}")
                question_data = combined_science_generator.generate_topical_question(subject, topic, difficulty, user_id)
            elif subject == "a_level_physics":
                # Use A Level Physics generator for advanced physics questions
                from services.a_level_physics_generator import a_level_physics_generator
                logger.info(f"Generating A Level Physics question for {topic}")
                question_data = a_level_physics_generator.generate_question(topic, difficulty, user_id)
            elif subject == "English":
                question_data = self.ai_service.generate_english_question(topic, difficulty)
            else:
                logger.error(f"Unsupported subject for AI generation: {subject}")
                return None
            
            if question_data:
                question_data['source'] = 'ai_generated_professional'
                question_data['subject'] = subject
                question_data['topic'] = topic
                question_data['difficulty'] = difficulty
                return question_data
            
            return None
            
        except Exception as e:
            logger.error(f"Error generating AI question: {e}")
            return None
    
    def _save_generated_question(self, question_data: Dict, subject: str, topic: str, difficulty: str):
        """Save generated question to database with O-Level metadata"""
        try:
            # Determine question type
            question_type = 'mcq' if 'options' in question_data else 'open'
            if subject == "Mathematics":
                question_type = 'math'
            elif subject == "English":
                question_type = 'essay'
            
            # Enhance question data with O-Level specific metadata
            enhanced_question = question_data.copy()
            enhanced_question.update({
                'question_type': question_type,
                'difficulty': difficulty,
                'category': subject,  # For database compatibility
                'points': DIFFICULTY_LEVELS.get(difficulty, {}).get('point_value', 10),
                'source': 'ai_generated_professional_olevel'
            })
            
            # Save to database with correct function signature
            result = save_ai_question_to_database(enhanced_question, subject, topic)
            
            if result:
                logger.info(f"✅ Saved professional O-Level question to database: {subject}/{topic}/{difficulty}")
            else:
                logger.error(f"❌ Failed to save question for {subject}/{topic}/{difficulty}")
            
        except Exception as e:
            logger.error(f"Error saving generated question: {e}")
    
    def populate_topic_questions(self, subject: str, topic: str, min_questions: int = 15) -> Dict:
        """Populate a specific topic with minimum number of professional O-Level questions"""
        try:
            if subject not in ["Biology", "Chemistry", "Physics"]:
                return {'success': False, 'message': 'Only Combined Science subjects supported'}
            
            from services.combined_science_generator import combined_science_generator
            
            # Check current question count
            current_count = count_questions_by_category_and_topic(subject, topic)
            logger.info(f"Current question count for {subject}/{topic}: {current_count}")
            
            if current_count >= min_questions:
                return {
                    'success': True,
                    'message': f"{subject}/{topic} already has {current_count} questions",
                    'questions_added': 0
                }
            
            needed = min_questions - current_count
            logger.info(f"Generating {needed} professional O-Level questions for {subject}/{topic}")
            
            # Generate questions across difficulties (O-Level appropriate distribution)
            questions_added = 0
            difficulties = ['easy'] * 6 + ['medium'] * 6 + ['difficult'] * 3  # More easy/medium for O-Level
            
            for i in range(needed):
                difficulty = difficulties[i % len(difficulties)]
                
                try:
                    question = combined_science_generator.generate_topical_question(subject, topic, difficulty)
                    if question:
                        # Save to database
                        if combined_science_generator._save_question_to_database(question):
                            questions_added += 1
                            logger.info(f"✅ Added question {questions_added}/{needed} for {subject}/{topic}")
                        
                        # Small delay to prevent API rate limiting
                        time.sleep(2)
                    else:
                        logger.warning(f"Failed to generate question {i+1} for {subject}/{topic}")
                        
                except Exception as e:
                    logger.error(f"Error generating question {i+1}: {e}")
                    continue
            
            return {
                'success': True,
                'message': f"Added {questions_added} professional questions to {subject}/{topic}",
                'questions_added': questions_added,
                'total_questions': current_count + questions_added
            }
            
        except Exception as e:
            logger.error(f"Error populating topic questions: {e}")
            return {
                'success': False,
                'message': f"Error populating {subject}/{topic}: {str(e)}",
                'questions_added': 0
            }
    
    def _generate_question_hash(self, question_text: str) -> str:
        """Generate hash for question to track duplicates"""
        return hashlib.md5(question_text.encode()).hexdigest()
    
    def _is_knowledge_focused(self, question_data: Dict) -> bool:
        """Check if a question is knowledge-focused rather than experimental"""
        try:
            question_text = question_data.get('question', '').lower()
            
            # Knowledge-focused indicators (70% priority)
            knowledge_keywords = [
                'what is', 'define', 'explain', 'why does', 'how does', 'which of the following',
                'the main function', 'responsible for', 'characteristic of', 'difference between',
                'similar to', 'caused by', 'result of', 'purpose of', 'role of', 'function of',
                'occurs when', 'happens because', 'reason for', 'allows', 'enables', 'prevents',
                'structure that', 'process of', 'type of', 'example of', 'classified as'
            ]
            
            # Experimental indicators (30% - minimize these)
            experimental_keywords = [
                'experiment to', 'laboratory procedure', 'apparatus used', 'equipment needed',
                'step by step', 'method to measure', 'materials required', 'how to set up',
                'in the lab you', 'using a beaker', 'procedure for', 'steps to follow',
                'practical method', 'investigation involves'
            ]
            
            # Application indicators (30% - include some)
            application_keywords = [
                'in everyday life', 'real world example', 'practical use', 'application of',
                'used to treat', 'helps in', 'important for', 'benefit of', 'advantage of',
                'problem with', 'solution to', 'useful because'
            ]
            
            # Check for different types
            has_knowledge_focus = any(keyword in question_text for keyword in knowledge_keywords)
            has_experimental_focus = any(keyword in question_text for keyword in experimental_keywords)
            has_application_focus = any(keyword in question_text for keyword in application_keywords)
            
            # Prioritize knowledge and application over experimental
            if has_knowledge_focus or has_application_focus:
                return True
            elif has_experimental_focus:
                return False
            else:
                # Default to accepting if unclear
                return True
            
        except Exception as e:
            logger.error(f"Error checking question focus: {e}")
            return True  # Default to accepting the question
    
    def get_topic_list(self, subject: str) -> List[str]:
        """Get list of topics for a subject"""
        return TOPICS.get(subject, [])
    
    def get_subject_list(self) -> List[str]:
        """Get list of available subjects"""
        return list(TOPICS.keys())
    
    def get_difficulty_levels(self) -> List[str]:
        """Get list of difficulty levels"""
        return DIFFICULTY_LEVELS.copy()
    
    def validate_answer(self, question_data: Dict, user_answer: str) -> Dict:
        """Validate user's answer and return result"""
        try:
            correct_answer = question_data.get('correct_answer', '').strip().upper()
            user_answer_clean = user_answer.strip().upper()
            
            is_correct = False
            
            # For MCQ questions
            if 'options' in question_data:
                is_correct = user_answer_clean == correct_answer
            
            # For math questions, check if numerical answers match
            elif question_data.get('subject') == 'Mathematics':
                is_correct = self._validate_math_answer(question_data, user_answer)
            
            # For essay questions, provide feedback but don't auto-grade
            elif question_data.get('subject') == 'English':
                return {
                    'is_correct': None,  # Cannot auto-grade essays
                    'feedback': "Thank you for your response. Essays require manual review.",
                    'points_awarded': 0,
                    'explanation': question_data.get('sample_answer', '')
                }
            
            points_awarded = question_data.get('points', 0) if is_correct else 0
            
            return {
                'is_correct': is_correct,
                'points_awarded': points_awarded,
                'explanation': question_data.get('solution', question_data.get('explanation', '')),
                'correct_answer': correct_answer
            }
            
        except Exception as e:
            logger.error(f"Error validating answer: {e}")
            return {
                'is_correct': False,
                'points_awarded': 0,
                'explanation': "Error validating answer",
                'correct_answer': question_data.get('correct_answer', '')
            }
    
    def _validate_math_answer(self, question_data: Dict, user_answer: str) -> bool:
        """Validate mathematical answers with some tolerance"""
        try:
            # Extract numerical value from solution
            solution = question_data.get('solution', '')
            correct_answer = question_data.get('correct_answer', '')
            
            # Try to extract numbers from both answers
            import re
            
            # Look for final answer in solution
            final_answer_match = re.search(r'final answer[:\s]*([+-]?\d*\.?\d+)', solution.lower())
            if final_answer_match:
                correct_value = float(final_answer_match.group(1))
            else:
                # Try to parse correct_answer directly
                try:
                    correct_value = float(correct_answer)
                except ValueError:
                    # Fallback to string comparison
                    return user_answer.strip().lower() == correct_answer.strip().lower()
            
            # Extract number from user answer
            user_number_match = re.search(r'([+-]?\d*\.?\d+)', user_answer)
            if user_number_match:
                user_value = float(user_number_match.group(1))
                
                # Check with small tolerance for floating point errors
                tolerance = abs(correct_value * 0.001)  # 0.1% tolerance
                return abs(user_value - correct_value) <= max(tolerance, 0.01)
            
            # Fallback to string comparison
            return user_answer.strip().lower() == correct_answer.strip().lower()
            
        except Exception as e:
            logger.error(f"Error validating math answer: {e}")
            # Fallback to string comparison
            return user_answer.strip().lower() == question_data.get('correct_answer', '').strip().lower()
