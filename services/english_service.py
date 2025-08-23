import os
import json
import logging
import time
from typing import Dict, List, Optional
from google import genai
from google.genai import types
from config import Config

logger = logging.getLogger(__name__)

class EnglishService:
    """Comprehensive ZIMSEC English Language service using Gemini AI"""
    
    def __init__(self):
        self.gemini_api_key = os.environ.get("GEMINI_API_KEY")
        if not self.gemini_api_key:
            raise ValueError("GEMINI_API_KEY is required for English service")
        
        self.client = genai.Client(api_key=self.gemini_api_key)
        self.model = "gemini-2.5-flash"
        
        # ZIMSEC character names for authentic context
        self.african_names = [
            "Chipo", "Tendai", "Mukoma", "Rudo", "Tapiwa", "Blessing", 
            "Nyasha", "Farai", "Tatenda", "Chiedza", "Simba", "Kuda",
            "Tichaona", "Munashe", "Ngoni", "Thandiwe", "Vimbai", "Tafara"
        ]
        
        # Zimbabwean settings for passages
        self.settings = [
            "Rural homestead in Mashonaland",
            "Harare city center market", 
            "Victoria Falls tourist area",
            "Communal farming area in Manicaland",
            "Traditional ceremony in the village",
            "Chitungwiza high-density suburb",
            "Great Zimbabwe monument",
            "Mana Pools National Park"
        ]
        
        logger.info("Enhanced ZIMSEC English Service initialized with Gemini AI")

    def generate_grammar_question(self) -> Dict:
        """Generate a single grammar question"""
        try:
            prompt = f"""Generate ONE high-quality ZIMSEC O-Level Grammar and Usage question.
            
Requirements:
- Question should test understanding of English grammar, syntax, punctuation, or usage
- Include clear instructions  
- Provide the correct answer
- Include a brief explanation
- Use Zimbabwean context where appropriate
- Suitable for Form 3-4 students

Return ONLY a JSON object in this format:
{{
    "question": "The grammar question text",
    "instructions": "What the student should do",
    "answer": "The correct answer",
    "explanation": "Brief explanation of why this is correct"
}}"""

            logger.info("Generating grammar question using Gemini AI")
            
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.7,
                    max_output_tokens=500
                ),
            )

            if response.text:
                question_data = json.loads(response.text)
                logger.info("✅ Generated grammar question successfully")
                return question_data
            
            return None
            
        except Exception as e:
            logger.error(f"Error generating grammar question: {e}")
            return None

    def generate_vocabulary_mcq(self) -> Dict:
        """Generate a single vocabulary MCQ"""
        try:
            prompt = f"""Generate ONE high-quality ZIMSEC O-Level Vocabulary Building MCQ question.
            
Requirements:
- Test vocabulary, word meanings, synonyms, antonyms, or usage in context
- Provide 4 multiple choice options (A, B, C, D)
- Use Zimbabwean context where appropriate
- Include brief explanation
- Suitable for Form 3-4 students

Return ONLY a JSON object in this format:
{{
    "question": "The vocabulary question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": 0,
    "explanation": "Brief explanation of the correct answer"
}}

Note: correct_answer should be the index (0-3) of the correct option."""

            logger.info("Generating vocabulary MCQ using Gemini AI")
            
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.7,
                    max_output_tokens=600
                ),
            )

            if response.text:
                question_data = json.loads(response.text)
                logger.info("✅ Generated vocabulary MCQ successfully")
                return question_data
            
            return None
            
        except Exception as e:
            logger.error(f"Error generating vocabulary MCQ: {e}")
            return None

    def generate_topical_questions(self, topic: str, form_level: int, count: int = 10) -> List[Dict]:
        """Generate topical questions for specific topic and form level"""
        
        prompt = f"""
        Generate {count} Zimsec O-Level English questions for Form {form_level} students on the topic: {topic}

        Requirements:
        - Follow Zimsec examination format exactly
        - Include questions worth 1-2 marks each based on complexity
        - Use African/Zimbabwean context and character names: {', '.join(self.african_names[:10])}
        - Vary question difficulty appropriately for Form {form_level}
        - Provide clear, accurate answers
        - Include cross-cutting themes: Heritage Studies, Environmental Issues, Gender, ICT, Financial Literacy

        Character names to use: {', '.join(self.african_names[:8])}
        Settings: {', '.join(self.settings[:4])}

        Format each question as JSON:
        {{
            "question_text": "question here",
            "correct_answer": "answer here",
            "marks": 1 or 2,
            "difficulty": "easy/medium/hard",
            "question_type": "recall/inference/analysis/evaluation",
            "cultural_theme": "heritage/environment/gender/ict/financial"
        }}

        Return as a JSON array of {count} questions.
        """
        
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=[
                    types.Content(role="user", parts=[types.Part(text=prompt)])
                ],
                config=types.GenerateContentConfig(
                    system_instruction="You are an expert Zimbabwean English teacher creating authentic Zimsec O-Level questions.",
                    response_mime_type="application/json",
                    temperature=0.7,
                    max_output_tokens=3000
                )
            )
            
            if response.text:
                questions = json.loads(response.text)
                validated_questions = []
                
                for q in questions:
                    if self._validate_topical_question(q):
                        validated_questions.append(q)
                
                logger.info(f"✅ Generated {len(validated_questions)} topical questions for {topic}")
                return validated_questions
            
            return []
            
        except Exception as e:
            logger.error(f"Error generating topical questions: {str(e)}")
            return self._get_fallback_topical_questions(topic, form_level, count)

    def generate_comprehension_passage(self, theme: str, form_level: int, african_context: bool = True) -> Dict:
        """Generate comprehensive comprehension passage with 10 questions"""
        
        character_selection = self.african_names[:5]
        setting_selection = self.settings[:3]
        
        prompt = f"""
        Generate a comprehension passage for Zimsec O-Level Form {form_level} English students.

        Requirements:
        - Theme: {theme}
        - Word count: 350-450 words
        - Use African/Zimbabwean context and character names: {', '.join(character_selection)}
        - Setting: Choose from {', '.join(setting_selection)}
        - Include cultural elements relevant to Zimbabwe
        - Appropriate vocabulary and complexity for Form {form_level}
        - Clear narrative or expository structure

        Follow with exactly 10 comprehension questions:
        Questions 1-2: Recall questions (1 mark each)
        Questions 3-5: Inference questions (2 marks each)  
        Questions 6-7: Vocabulary in context (1 mark each)
        Question 8: Tone/mood identification (2 marks)
        Question 9: Analysis question (2 marks)
        Question 10: Summary question (2 marks)

        Total: 15 marks

        Format as JSON:
        {{
            "passage": {{
                "title": "passage title",
                "text": "full passage text",
                "word_count": number,
                "character_names": ["name1", "name2"],
                "setting": "setting description",
                "theme": "{theme}",
                "cultural_elements": ["element1", "element2"]
            }},
            "questions": [
                {{
                    "question_number": 1,
                    "question_text": "question here",
                    "correct_answer": "answer here", 
                    "marks": 1,
                    "question_type": "recall/inference/vocabulary/tone/analysis/summary"
                }}
                // ... 9 more questions
            ],
            "total_marks": 15,
            "instructions": "Read the passage carefully and answer ALL questions."
        }}
        """
        
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=[
                    types.Content(role="user", parts=[types.Part(text=prompt)])
                ],
                config=types.GenerateContentConfig(
                    system_instruction="You are an expert Zimbabwean educator creating authentic comprehension materials for Zimsec O-Level.",
                    response_mime_type="application/json",
                    temperature=0.7,
                    max_output_tokens=4000
                )
            )
            
            if response.text:
                passage_data = json.loads(response.text)
                
                if self._validate_comprehension_passage(passage_data):
                    logger.info(f"✅ Generated comprehension passage: {passage_data.get('passage', {}).get('title', 'Untitled')}")
                    return passage_data
                
            return {}
            
        except Exception as e:
            logger.error(f"Error generating comprehension passage: {str(e)}")
            return self._get_fallback_comprehension_passage(theme, form_level)

    def mark_essay(self, essay_text: str, prompt: str, form_level: int, section: str = 'A') -> Dict:
        """Mark essay using Gemini AI with detailed ZIMSEC feedback"""
        
        max_marks = 30 if section == 'A' else 20
        
        marking_prompt = f"""
        Mark this Zimsec O-Level English Language essay for a Form {form_level} student following official marking criteria.

        Essay Prompt: {prompt}
        Student Essay: {essay_text}
        Maximum Marks: {max_marks}
        Section: {section} (A=Free Choice/{max_marks} marks, B=Guided/20 marks)

        MARKING CRITERIA (Section {section}):
        Content and Ideas ({max_marks//3} marks):
        - Excellent (9-10): Highly relevant, creative and original ideas
        - Good (7-8): Mostly relevant, some creativity
        - Adequate (5-6): Generally relevant ideas
        - Limited (3-4): Some irrelevance
        - Poor (1-2): Largely irrelevant

        Language and Expression ({max_marks//3} marks):
        - Excellent (9-10): Varied vocabulary, fluent expression
        - Good (7-8): Good vocabulary, clear expression
        - Adequate (5-6): Adequate vocabulary
        - Limited (3-4): Limited vocabulary, unclear at times
        - Poor (1-2): Poor vocabulary, often unclear

        Structure and Organization ({max_marks//3} marks):
        - Excellent (9-10): Clear structure, logical flow
        - Good (7-8): Good structure, generally logical
        - Adequate (5-6): Adequate structure
        - Limited (3-4): Unclear paragraphing
        - Poor (1-2): Poor organization

        Provide detailed feedback in JSON format:
        {{
            "marks": {{
                "content": score_out_of_10,
                "language": score_out_of_10,
                "structure": score_out_of_10,
                "total": total_score
            }},
            "grade": "A/B/C/D/E/U",
            "percentage": percentage,
            "feedback": {{
                "strengths": ["strength1", "strength2"],
                "grammar_errors": [
                    {{"error": "mistake", "correction": "fix", "line_reference": "paragraph 2"}}
                ],
                "spelling_errors": ["word1", "word2"],
                "vocabulary_suggestions": [
                    {{"original": "word", "suggestion": "better_word", "context": "reason"}}
                ],
                "structure_comments": "paragraph and flow feedback",
                "cultural_relevance": "comment on use of African/Zimbabwean context",
                "overall_comment": "comprehensive feedback"
            }},
            "teacher_comment": "Excellent/Very Good/Well tried/Keep practicing",
            "areas_for_improvement": ["specific area 1", "specific area 2"],
            "next_steps": ["actionable step 1", "actionable step 2"]
        }}
        """
        
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=[
                    types.Content(role="user", parts=[types.Part(text=marking_prompt)])
                ],
                config=types.GenerateContentConfig(
                    system_instruction="You are a senior Zimsec examiner with 20+ years experience marking O-Level essays. Be fair but thorough.",
                    response_mime_type="application/json",
                    temperature=0.3,
                    max_output_tokens=3000
                )
            )
            
            if response.text:
                marking_result = json.loads(response.text)
                logger.info(f"✅ Essay marked - Total: {marking_result.get('marks', {}).get('total', 0)}/{max_marks}")
                return marking_result
                
            return {}
            
        except Exception as e:
            logger.error(f"Error marking essay: {str(e)}")
            return self._get_fallback_essay_marking()

    def generate_essay_prompt(self, section: str, essay_type: str, form_level: int) -> Dict:
        """Generate essay prompts for Section A (Free Choice) or Section B (Guided)"""
        
        max_marks = 30 if section == 'A' else 20
        
        if section == 'A':
            prompt_instruction = f"""
            Generate a Section A (Free Choice) essay prompt for Zimsec O-Level Form {form_level} English.

            Essay Type: {essay_type} (narrative/descriptive/argumentative/discursive)
            Maximum Marks: {max_marks}

            Requirements:
            - Engaging and relevant topic for Zimbabwean students
            - Include African/Zimbabwean cultural context where appropriate
            - Clear instructions and expectations
            - Appropriate difficulty for Form {form_level}
            - Topics that allow creativity and personal expression

            Character names available: {', '.join(self.african_names[:6])}
            Cultural themes: Heritage studies, Ubuntu philosophy, environmental conservation, community values

            Format as JSON:
            {{
                "section": "A",
                "essay_type": "{essay_type}",
                "prompt_text": "Complete essay prompt with clear instructions",
                "word_count": "400-600 words",
                "time_allocation": "45 minutes",
                "max_marks": {max_marks},
                "marking_criteria": {{
                    "content_ideas": "Content and development of ideas (/10)",
                    "language_expression": "Language and expression (/10)", 
                    "structure_organization": "Structure and organization (/10)"
                }},
                "student_guidance": "Brief tips for approaching this essay type",
                "cultural_context": "Suggested Zimbabwean context elements"
            }}
            """
        else:
            prompt_instruction = f"""
            Generate a Section B (Guided Composition) prompt for Zimsec O-Level Form {form_level} English.

            Format Type: {essay_type} (letter/report/article/speech/memo)
            Maximum Marks: {max_marks}

            Requirements:
            - Specific practical writing scenario
            - Clear audience and purpose
            - Include Zimbabwean context and settings
            - Detailed guidance and structure requirements
            - Real-world application

            Settings: {', '.join(self.settings[:4])}
            Names: {', '.join(self.african_names[:6])}

            Format as JSON:
            {{
                "section": "B",
                "format_type": "{essay_type}",
                "prompt_text": "Complete guided writing prompt with scenario",
                "word_count": "250-350 words",
                "time_allocation": "35 minutes", 
                "max_marks": {max_marks},
                "marking_criteria": {{
                    "content_ideas": "Content and development (/7)",
                    "language_expression": "Language and expression (/7)",
                    "structure_format": "Structure and format (/6)"
                }},
                "format_requirements": ["specific format requirement 1", "requirement 2"],
                "scenario_details": "Detailed scenario background",
                "audience": "Target audience description"
            }}
            """
        
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=[
                    types.Content(role="user", parts=[types.Part(text=prompt_instruction)])
                ],
                config=types.GenerateContentConfig(
                    system_instruction="You are an experienced Zimsec English teacher creating authentic essay prompts.",
                    response_mime_type="application/json",
                    temperature=0.8,
                    max_output_tokens=2000
                )
            )
            
            if response.text:
                essay_prompt = json.loads(response.text)
                logger.info(f"✅ Generated {section} essay prompt: {essay_type}")
                return essay_prompt
                
            return {}
            
        except Exception as e:
            logger.error(f"Error generating essay prompt: {str(e)}")
            return self._get_fallback_essay_prompt(section, essay_type, form_level)

    def generate_language_exercise(self, topic: str, form_level: int, exercise_type: str = "mixed") -> Dict:
        """Generate language exercises (grammar, vocabulary, etc.)"""
        
        exercise_prompt = f"""
        Create a language exercise for Zimsec O-Level Form {form_level} English students.

        Topic: {topic}
        Exercise Type: {exercise_type}
        
        Requirements:
        - 10-15 questions appropriate for Form {form_level}
        - Include Zimbabwean context and character names: {', '.join(self.african_names[:5])}
        - Clear instructions and examples
        - Variety of question types (MCQ, fill-in-blanks, correction, transformation)
        - Progressive difficulty within exercise
        - Answer key with explanations

        Format as JSON:
        {{
            "exercise_title": "Language Exercise: {topic}",
            "form_level": {form_level},
            "instructions": "Clear instructions for students",
            "questions": [
                {{
                    "number": 1,
                    "question_text": "Question or sentence to work with",
                    "question_type": "multiple_choice/fill_blank/correction/transformation",
                    "options": ["A. option", "B. option", "C. option", "D. option"],
                    "correct_answer": "A",
                    "explanation": "Why this answer is correct",
                    "marks": 1
                }}
            ],
            "total_marks": 20,
            "estimated_time": "25 minutes",
            "learning_objectives": ["objective 1", "objective 2"],
            "cultural_context": "Brief note on Zimbabwean elements used"
        }}
        """
        
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=[
                    types.Content(role="user", parts=[types.Part(text=exercise_prompt)])
                ],
                config=types.GenerateContentConfig(
                    system_instruction="You are a Zimsec English teacher creating engaging language exercises.",
                    response_mime_type="application/json",
                    temperature=0.6,
                    max_output_tokens=3000
                )
            )
            
            if response.text:
                exercise_data = json.loads(response.text)
                logger.info(f"✅ Generated language exercise: {topic}")
                return exercise_data
                
            return {}
            
        except Exception as e:
            logger.error(f"Error generating language exercise: {str(e)}")
            return {}

    def _validate_topical_question(self, question: Dict) -> bool:
        """Validate topical question structure"""
        required_fields = ['question_text', 'correct_answer', 'marks', 'difficulty', 'question_type']
        return all(field in question for field in required_fields)

    def _validate_comprehension_passage(self, data: Dict) -> bool:
        """Validate comprehension passage structure"""
        if not isinstance(data, dict):
            return False
            
        passage = data.get('passage', {})
        questions = data.get('questions', [])
        
        # Check passage has required fields
        passage_valid = all(field in passage for field in ['title', 'text', 'word_count'])
        
        # Check we have 10 questions
        questions_valid = len(questions) == 10
        
        # Check each question has required fields
        questions_structure_valid = all(
            all(field in q for field in ['question_number', 'question_text', 'correct_answer', 'marks'])
            for q in questions
        )
        
        return passage_valid and questions_valid and questions_structure_valid

    def _get_fallback_topical_questions(self, topic: str, form_level: int, count: int) -> List[Dict]:
        """Fallback questions when Gemini API fails"""
        fallback_questions = []
        
        for i in range(min(count, 3)):  # Return up to 3 fallback questions
            fallback_questions.append({
                "question_text": f"Explain the importance of {topic} in English language learning for Form {form_level} students.",
                "correct_answer": f"{topic} is important because it helps students develop their communication skills and understanding of the English language.",
                "marks": 2,
                "difficulty": "medium",
                "question_type": "analysis",
                "cultural_theme": "education"
            })
        
        return fallback_questions

    def _get_fallback_comprehension_passage(self, theme: str, form_level: int) -> Dict:
        """Fallback comprehension when Gemini fails"""
        return {
            "passage": {
                "title": f"Learning About {theme}",
                "text": f"This is a sample passage about {theme} for Form {form_level} students. In Zimbabwe, education is highly valued and students work hard to achieve their goals. Chipo and Tendai are two students who understand the importance of studying English. They practice reading comprehension every day to improve their skills.",
                "word_count": 150,
                "character_names": ["Chipo", "Tendai"],
                "setting": "School environment",
                "theme": theme
            },
            "questions": [
                {
                    "question_number": 1,
                    "question_text": "Who are the two students mentioned in the passage?",
                    "correct_answer": "Chipo and Tendai",
                    "marks": 1,
                    "question_type": "recall"
                }
            ],
            "total_marks": 1
        }

    def _get_fallback_essay_marking(self) -> Dict:
        """Fallback essay marking when Gemini fails"""
        return {
            "marks": {
                "content": 6,
                "language": 6,
                "structure": 6,
                "total": 18
            },
            "grade": "C",
            "percentage": 60,
            "feedback": {
                "strengths": ["Clear attempt at the topic", "Some good ideas presented"],
                "areas_for_improvement": ["Develop ideas further", "Improve paragraph structure"],
                "overall_comment": "A reasonable attempt. Keep practicing to improve your writing skills."
            },
            "teacher_comment": "Well tried, keep improving!"
        }

    def _get_fallback_essay_prompt(self, section: str, essay_type: str, form_level: int) -> Dict:
        """Fallback essay prompt when Gemini fails"""
        max_marks = 30 if section == 'A' else 20
        
        return {
            "section": section,
            "essay_type": essay_type,
            "prompt_text": f"Write a {essay_type} essay suitable for Form {form_level} students. Choose a topic that interests you and develop it fully.",
            "word_count": "400-600 words" if section == 'A' else "250-350 words",
            "max_marks": max_marks,
            "marking_criteria": {
                "content_ideas": f"Content and ideas (/{max_marks//3})",
                "language_expression": f"Language and expression (/{max_marks//3})",
                "structure_organization": f"Structure and organization (/{max_marks//3})"
            }
        }