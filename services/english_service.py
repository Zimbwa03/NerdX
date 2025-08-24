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

    def generate_grammar_question(self) -> Optional[Dict]:
        """Generate a single grammar question"""
        try:
            prompt = f"""Generate ONE ZIMSEC O-Level Grammar and Usage question.
            
Requirements:
- Test basic grammar: tenses, subject-verb agreement, punctuation, sentence structure
- Use simple Zimbabwean names and contexts  
- Suitable for Form 3-4 students (moderate difficulty)
- Keep explanations SHORT (1-2 sentences max)

Return ONLY a JSON object:
{{
    "question": "The grammar question text",
    "instructions": "What the student should do",
    "answer": "The correct answer", 
    "explanation": "Short explanation (max 30 words)"
}}"""

            logger.info("Generating grammar question using Gemini AI")
            
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.7,
                    max_output_tokens=1500
                ),
            )

            if response.text:
                logger.info(f"Grammar question raw response: {response.text}")
                try:
                    # Clean the response text - remove markdown code blocks if present
                    clean_text = response.text.strip()
                    if clean_text.startswith('```json'):
                        clean_text = clean_text[7:]  # Remove ```json
                    if clean_text.endswith('```'):
                        clean_text = clean_text[:-3]  # Remove ```
                    clean_text = clean_text.strip()
                    
                    # Check if JSON is complete (basic validation)
                    if not clean_text.endswith('}'):
                        logger.error("Incomplete JSON response detected - response was truncated")
                        logger.error(f"Truncated response: {clean_text}")
                        return None
                    
                    question_data = json.loads(clean_text)
                    
                    # Validate required fields
                    required_fields = ['question', 'answer', 'explanation']
                    if not all(field in question_data for field in required_fields):
                        logger.error(f"Missing required fields in grammar question: {question_data}")
                        return None
                    
                    logger.info("✅ Generated grammar question successfully")
                    return question_data
                except json.JSONDecodeError as json_err:
                    logger.error(f"JSON parsing error for grammar question: {json_err}")
                    logger.error(f"Raw response that failed to parse: {response.text}")
                    return None
            else:
                logger.error("Empty response from Gemini for grammar question")
                return None
            
        except Exception as e:
            logger.error(f"Error generating grammar question: {e}")
            return None

    def generate_vocabulary_mcq(self) -> Optional[Dict]:
        """Generate a single vocabulary MCQ"""
        try:
            prompt = f"""Generate ONE ZIMSEC O-Level Vocabulary Building MCQ question.
            
Requirements:
- Use MEDIUM difficulty vocabulary suitable for Form 3-4 students
- Test common English words, simple synonyms, antonyms, or word meanings
- Use familiar Zimbabwean contexts (school, home, community)
- Include 4 simple options (A, B, C, D)
- Keep explanation SHORT (1 sentence max)
- Avoid advanced/complex vocabulary

Return ONLY a JSON object:
{{
    "question": "The vocabulary question with simple words",
    "options": ["Simple option A", "Simple option B", "Simple option C", "Simple option D"],
    "correct_answer": 0,
    "explanation": "Short explanation (max 20 words)"
}}

Note: correct_answer should be the index (0-3) of the correct option."""

            logger.info("Generating vocabulary MCQ using Gemini AI")
            
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.7,
                    max_output_tokens=1500
                ),
            )

            if response.text:
                logger.info(f"Vocabulary question raw response: {response.text}")
                try:
                    # Clean the response text - remove markdown code blocks if present
                    clean_text = response.text.strip()
                    if clean_text.startswith('```json'):
                        clean_text = clean_text[7:]  # Remove ```json
                    if clean_text.endswith('```'):
                        clean_text = clean_text[:-3]  # Remove ```
                    clean_text = clean_text.strip()
                    
                    # Check if JSON is complete (basic validation)
                    if not clean_text.endswith('}'):
                        logger.error("Incomplete JSON response detected - response was truncated")
                        logger.error(f"Truncated response: {clean_text}")
                        return None
                    
                    question_data = json.loads(clean_text)
                    
                    # Validate required fields for vocabulary MCQ
                    required_fields = ['question', 'options', 'correct_answer', 'explanation']
                    if not all(field in question_data for field in required_fields):
                        logger.error(f"Missing required fields in vocabulary question: {question_data}")
                        return None
                    
                    # Validate options array has 4 items
                    if not isinstance(question_data.get('options'), list) or len(question_data['options']) != 4:
                        logger.error(f"Invalid options array in vocabulary question: {question_data.get('options')}")
                        return None
                    
                    # Validate correct_answer is valid index
                    correct_answer = question_data.get('correct_answer')
                    if not isinstance(correct_answer, int) or correct_answer < 0 or correct_answer > 3:
                        logger.error(f"Invalid correct_answer in vocabulary question: {correct_answer}")
                        return None
                    
                    logger.info("✅ Generated vocabulary MCQ successfully")
                    return question_data
                except json.JSONDecodeError as json_err:
                    logger.error(f"JSON parsing error for vocabulary question: {json_err}")
                    logger.error(f"Raw response that failed to parse: {response.text}")
                    return None
            else:
                logger.error("Empty response from Gemini for vocabulary question")
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

    def generate_long_comprehension_passage(self, theme: str, form_level: int = 4) -> Dict:
        """Generate a long, engaging comprehension passage with exactly 10 ZIMSEC-style questions"""
        
        prompt = f"""Generate ONE comprehensive ZIMSEC O-Level comprehension passage with exactly 10 questions.

**Requirements:**
- Theme: {theme}  
- Form {form_level} level (age 15-16)
- Passage should be 800-1200 words (long but within WhatsApp limits)
- Zimbabwean context and cultural relevance
- Engaging, educational content suitable for teenagers
- Follow ZIMSEC comprehension standards

**Question Requirements:**
- Exactly 10 questions (no more, no less)
- Mix of question types: recall, inference, vocabulary, analysis, opinion
- Questions should reference specific paragraphs where relevant  
- Include mark allocations (1-2 marks per question)
- Provide clear, complete answers
- Brief explanations for each answer

Return ONLY a JSON object:
{{
    "passage": {{
        "title": "Engaging title for the passage",
        "text": "Complete passage text (800-1200 words with clear paragraphs)",
        "word_count": 950,
        "theme": "{theme}"
    }},
    "questions": [
        {{
            "question": "Question text with paragraph reference if needed",
            "correct_answer": "Complete answer",
            "explanation": "Brief explanation why this is correct", 
            "marks": 1,
            "question_type": "recall"
        }},
        // ... exactly 9 more questions for total of 10
    ],
    "total_marks": 15,
    "instructions": "Read the passage carefully and answer ALL questions."
}}"""
        
        try:
            logger.info(f"Generating long comprehension passage: {theme}")
            
            # Add timeout handling for API requests
            response = self.client.models.generate_content(
                model=self.model,
                contents=[
                    types.Content(role="user", parts=[types.Part(text=prompt)])
                ],
                config=types.GenerateContentConfig(
                    system_instruction="You are a ZIMSEC examination expert creating authentic O-Level comprehension materials with Zimbabwean cultural context.",
                    response_mime_type="application/json",
                    temperature=0.7,
                    max_output_tokens=5000  # Higher limit for longer passages
                )
            )
            
            if response.text:
                logger.info(f"Long comprehension raw response length: {len(response.text)} characters")
                
                # Check for truncation
                if not response.text.strip().endswith('}'):
                    logger.error("Incomplete JSON response detected - response was truncated")
                    logger.error(f"Truncated response: {response.text[-200:]}")  # Show last 200 chars
                    return self._get_fallback_long_comprehension(theme)
                
                try:
                    passage_data = json.loads(response.text)
                    
                    # Validate that we have exactly 10 questions
                    questions = passage_data.get('questions', [])
                    if len(questions) != 10:
                        logger.warning(f"Generated {len(questions)} questions instead of 10, adjusting...")
                        # Ensure we have exactly 10 questions
                        if len(questions) > 10:
                            questions = questions[:10]
                        elif len(questions) < 10:
                            # Add simple questions if needed
                            while len(questions) < 10:
                                questions.append({
                                    "question": f"What is your overall impression of this passage? (Question {len(questions) + 1})",
                                    "correct_answer": "Personal response based on passage content",
                                    "explanation": "This is an opinion-based question",
                                    "marks": 1,
                                    "question_type": "opinion"
                                })
                        passage_data['questions'] = questions
                    
                    if self._validate_long_comprehension_passage(passage_data):
                        logger.info(f"✅ Generated long comprehension: {passage_data.get('passage', {}).get('title', 'Untitled')} with {len(questions)} questions")
                        return passage_data
                        
                except json.JSONDecodeError as e:
                    logger.error(f"JSON parsing error: {e}")
                    return self._get_fallback_long_comprehension(theme)
            
            return self._get_fallback_long_comprehension(theme)
            
        except Exception as e:
            logger.error(f"Error generating long comprehension passage: {str(e)}")
            logger.info(f"Using fallback comprehension for theme: {theme}")
            return self._get_fallback_long_comprehension(theme)
            
    def _validate_long_comprehension_passage(self, passage_data: Dict) -> bool:
        """Validate long comprehension passage structure with exactly 10 questions"""
        try:
            if not isinstance(passage_data, dict):
                return False
                
            passage = passage_data.get('passage')
            questions = passage_data.get('questions', [])
            
            if not passage or not questions:
                return False
                
            # Check passage structure
            if not all(key in passage for key in ['title', 'text']):
                return False
                
            # Must have exactly 10 questions
            if len(questions) != 10:
                logger.warning(f"Expected 10 questions, got {len(questions)}")
                return False
                
            # Check questions structure
            for i, q in enumerate(questions):
                if not all(key in q for key in ['question', 'correct_answer']):
                    logger.warning(f"Question {i+1} missing required fields")
                    return False
                    
            # Check passage length (should be substantial)
            word_count = len(passage.get('text', '').split())
            if word_count < 500:
                logger.warning(f"Passage too short: {word_count} words")
                return False
                    
            return True
            
        except Exception as e:
            logger.error(f"Error validating long passage: {e}")
            return False

    def _get_fallback_long_comprehension(self, theme: str) -> Dict:
        """Get fallback long comprehension passage when AI generation fails"""
        return {
            "passage": {
                "title": f"Zimbabwean Excellence: A Story of {theme}",
                "text": """Zimbabwe has always been a land of rich cultural heritage and remarkable achievements. From the ancient ruins of Great Zimbabwe to the modern innovations happening in Harare and Bulawayo, our nation continues to demonstrate resilience and creativity.

In the heart of Mbare, a bustling township in Harare, lives a young entrepreneur named Chipo Moyo. At just 22 years old, she has established a successful business that combines traditional Shona crafts with modern technology. Her company, 'Heritage Tech', creates beautiful pottery using ancient techniques while incorporating solar-powered kilns and digital marketing strategies.

Chipo's journey began during her Form 4 year at Prince Edward High School. While studying for her ZIMSEC examinations, she noticed how many of her classmates struggled with understanding traditional culture. "We were so focused on modern subjects that we were losing touch with our roots," she recalls.

Determined to bridge this gap, Chipo spent her holidays in Nyanga, learning pottery from her grandmother, Gogo Patience Moyo. The elderly woman had been making clay pots for over fifty years, using methods passed down through generations. "My grandmother taught me that each pot tells a story," Chipo explains. "The clay from our soil, the patterns we create, the function it serves – everything connects us to our ancestors."

After completing her A-Levels with outstanding results, Chipo could have easily secured a place at the University of Zimbabwe for engineering studies. Instead, she chose to pursue her passion for preserving Zimbabwean culture through entrepreneurship. Her parents were initially concerned about this unconventional path, but they soon became her biggest supporters.

Chipo's business model is innovative yet rooted in tradition. She employs fifteen local artisans, mostly women from Mbare, teaching them both traditional pottery techniques and basic computer skills. The women learn to photograph their creations, write product descriptions in English and Shona, and even manage social media accounts.

The company's products range from traditional water pots and cooking vessels to modern decorative pieces designed for urban homes. Each item comes with a QR code that customers can scan to learn about the artisan who made it, the cultural significance of the design, and the traditional uses of the piece.

What makes Heritage Tech truly special is its commitment to environmental sustainability. The solar-powered kilns reduce carbon emissions, while the clay is sourced from sustainable deposits in Wedza district. Rainwater harvesting systems provide water for the workshop, and all packaging is made from recycled materials.

The business has attracted international attention. Orders now come from South Africa, Botswana, and even as far as the United Kingdom. Chipo recently signed a partnership with a fair-trade organization in London, ensuring that the artisans receive fair wages for their work.

Despite this international success, Chipo remains committed to her local community. Heritage Tech sponsors ten students at nearby primary schools, providing them with uniforms, books, and educational materials. The company also runs weekend workshops where local children learn basic pottery skills and Shona cultural history.

"Education and culture must go hand in hand," Chipo emphasizes. "We cannot progress as a nation if we forget who we are and where we come from. Technology should enhance our culture, not replace it."

Looking toward the future, Chipo plans to expand Heritage Tech to other provinces. She envisions workshops in Mutare focusing on basket weaving, centers in Gweru specializing in traditional textiles, and facilities in Victoria Falls creating tourist-oriented crafts that showcase Zimbabwean culture authentically.

Her story demonstrates that young Zimbabweans can successfully blend tradition with innovation, creating opportunities that benefit entire communities while preserving cultural heritage for future generations.""",
                "word_count": 587,
                "theme": theme
            },
            "questions": [
                {
                    "question": "What is the name of Chipo's business and what does it specialize in?",
                    "correct_answer": "Heritage Tech - it combines traditional Shona crafts with modern technology, particularly pottery using ancient techniques with solar-powered kilns and digital marketing.",
                    "explanation": "This information is clearly stated in the second paragraph.",
                    "marks": 2,
                    "question_type": "recall"
                },
                {
                    "question": "Where did Chipo learn traditional pottery techniques and from whom?",
                    "correct_answer": "In Nyanga from her grandmother, Gogo Patience Moyo, who had been making clay pots for over fifty years.",
                    "explanation": "This is mentioned in the fourth paragraph.",
                    "marks": 2,
                    "question_type": "recall"
                },
                {
                    "question": "What does the phrase 'each pot tells a story' mean according to Gogo Patience?",
                    "correct_answer": "It means that every element - the clay from their soil, the patterns created, and the function it serves - connects them to their ancestors.",
                    "explanation": "This shows understanding of cultural significance and metaphorical language.",
                    "marks": 2,
                    "question_type": "inference"
                },
                {
                    "question": "How many local artisans does Heritage Tech employ and what skills do they learn?",
                    "correct_answer": "Fifteen local artisans, mostly women from Mbare, who learn traditional pottery techniques and basic computer skills including photography, writing product descriptions, and managing social media.",
                    "explanation": "This information is found in the sixth paragraph.",
                    "marks": 2,
                    "question_type": "recall"
                },
                {
                    "question": "What makes Heritage Tech environmentally sustainable? Give three examples.",
                    "correct_answer": "Solar-powered kilns reduce carbon emissions, clay is sourced from sustainable deposits in Wedza district, rainwater harvesting provides water, and all packaging is made from recycled materials.",
                    "explanation": "Multiple examples of environmental consciousness are provided in the eighth paragraph.",
                    "marks": 3,
                    "question_type": "recall"
                },
                {
                    "question": "Which countries does Heritage Tech export to?",
                    "correct_answer": "South Africa, Botswana, and the United Kingdom.",
                    "explanation": "These countries are specifically mentioned in the ninth paragraph.",
                    "marks": 1,
                    "question_type": "recall"
                },
                {
                    "question": "How does Heritage Tech support the local community beyond providing employment?",
                    "correct_answer": "It sponsors ten students at nearby primary schools with uniforms, books, and materials, and runs weekend workshops teaching children pottery skills and Shona cultural history.",
                    "explanation": "Community support activities are detailed in the eleventh paragraph.",
                    "marks": 2,
                    "question_type": "recall"
                },
                {
                    "question": "What is Chipo's philosophy about education and culture?",
                    "correct_answer": "'Education and culture must go hand in hand. We cannot progress as a nation if we forget who we are and where we come from. Technology should enhance our culture, not replace it.'",
                    "explanation": "This direct quote summarizes her educational philosophy.",
                    "marks": 2,
                    "question_type": "recall"
                },
                {
                    "question": "What are Chipo's future expansion plans for Heritage Tech?",
                    "correct_answer": "She plans workshops in Mutare for basket weaving, centers in Gweru for traditional textiles, and facilities in Victoria Falls for tourist-oriented crafts showcasing Zimbabwean culture.",
                    "explanation": "Future plans are outlined in the thirteenth paragraph.",
                    "marks": 2,
                    "question_type": "recall"
                },
                {
                    "question": "In your opinion, what is the most important lesson from Chipo's story for young Zimbabweans?",
                    "correct_answer": "Young people can successfully blend tradition with innovation to create opportunities that benefit communities while preserving cultural heritage. (Accept reasonable personal responses based on the passage)",
                    "explanation": "This requires personal reflection based on the passage content.",
                    "marks": 2,
                    "question_type": "opinion"
                }
            ],
            "total_marks": 20,
            "instructions": "Read the passage carefully and answer ALL questions."
        }

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
                    max_output_tokens=4000
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

    def generate_essay_marking(self, marking_prompt: str) -> str:
        """Simple essay marking method for new essay system"""
        try:
            logger.info("Sending essay marking request to Gemini...")
            
            response = self.client.models.generate_content(
                model=self.model,
                contents=[
                    types.Content(role="user", parts=[types.Part(text=marking_prompt)])
                ],
                config=types.GenerateContentConfig(
                    system_instruction="You are a senior ZIMSEC examiner with 20+ years experience marking O-Level essays. Be fair but encouraging.",
                    response_mime_type="application/json",
                    temperature=0.3,
                    max_output_tokens=6000  # Increased for complete responses
                )
            )
            
            logger.info(f"Gemini response received. Response object: {response}")
            logger.info(f"Response text available: {hasattr(response, 'text')}")
            
            if hasattr(response, 'text') and response.text:
                logger.info(f"Response text content: {response.text[:200]}...")
                return response.text
            elif hasattr(response, 'candidates') and response.candidates:
                # Try accessing through candidates
                candidate = response.candidates[0]
                if hasattr(candidate, 'content') and candidate.content:
                    content = candidate.content
                    if hasattr(content, 'parts') and content.parts:
                        text_content = content.parts[0].text
                        logger.info(f"Got text from candidates: {text_content[:200]}...")
                        return text_content
                        
            logger.error("No text content found in response")
            logger.error(f"Full response object: {response}")
            return ""
            
        except Exception as e:
            logger.error(f"Error generating essay marking: {str(e)}")
            import traceback
            logger.error(f"Full traceback: {traceback.format_exc()}")
            return ""

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
            # Dynamic Section B templates for different writing types
            section_b_templates = {
                'report': [
                    {
                        'role': 'Ward Youth Officer',
                        'audience': 'Member of Parliament for your area',
                        'scenario': 'Youth meeting to find solutions for improving livelihoods',
                        'points': ['Vocational training centers', 'Opening of industries', 'Business seminars', 'Non-formal education', 'Youth development programs', 'Job creation initiatives']
                    },
                    {
                        'role': 'School Environment Prefect',
                        'audience': 'District Education Officer',
                        'scenario': 'Environmental challenges at your school',
                        'points': ['Water shortage issues', 'Waste management problems', 'Tree planting initiatives', 'Solar energy projects', 'Recycling programs', 'Garden maintenance']
                    },
                    {
                        'role': 'Sports Captain',
                        'audience': 'School Development Committee',
                        'scenario': 'Improving sports facilities and programs',
                        'points': ['Equipment needs', 'Ground maintenance', 'Inter-school competitions', 'Coaching programs', 'Health and fitness', 'Talent development']
                    }
                ],
                'letter': [
                    {
                        'type': 'formal',
                        'role': 'Head Boy/Girl',
                        'audience': 'School Principal',
                        'scenario': 'Request for improved library facilities',
                        'points': ['Current library conditions', 'Need for more books', 'Study space requirements', 'Technology integration', 'Extended hours', 'Student suggestions']
                    },
                    {
                        'type': 'informal',
                        'role': 'Student',
                        'audience': 'Friend studying abroad',
                        'scenario': 'Describing changes in your community',
                        'points': ['Development projects', 'New businesses', 'Technology adoption', 'Cultural events', 'Educational improvements', 'Economic changes']
                    }
                ],
                'article': [
                    {
                        'publication': 'School Magazine',
                        'topic': 'Youth entrepreneurship in Zimbabwe',
                        'points': ['Success stories', 'Available opportunities', 'Government support', 'Skills development', 'Innovation examples', 'Future prospects']
                    },
                    {
                        'publication': 'Community Newsletter',
                        'topic': 'Preserving Zimbabwean culture in modern times',
                        'points': ['Traditional practices', 'Language preservation', 'Cultural festivals', 'Modern challenges', 'Youth involvement', 'Future sustainability']
                    }
                ],
                'speech': [
                    {
                        'occasion': 'School Speech Day',
                        'topic': 'The role of technology in education',
                        'audience': 'Students, teachers, and parents',
                        'points': ['Online learning benefits', 'Digital skills importance', 'Access challenges', 'Future opportunities', 'Balanced approach', 'Local solutions']
                    },
                    {
                        'occasion': 'Community meeting',
                        'topic': 'Youth participation in community development',
                        'audience': 'Community members and leaders',
                        'points': ['Youth capabilities', 'Local projects', 'Skills contribution', 'Leadership development', 'Partnership opportunities', 'Sustainable development']
                    }
                ]
            }
            
            # Select random template based on essay type
            import random
            template = random.choice(section_b_templates.get(essay_type, section_b_templates['report']))
            
            prompt_instruction = f"""
            Generate a Section B (Guided Composition) prompt for ZIMSEC O-Level Form {form_level} English.

            Format Type: {essay_type}
            Maximum Marks: {max_marks}

            Use this template structure:
            Template: {template}

            Create a complete guided composition prompt following ZIMSEC format:

            Format as JSON:
            {{
                "section": "B",
                "format_type": "{essay_type}",
                "prompt_text": "Section B (20 Marks)\\n\\nThis section requires candidates to write a {essay_type}...",
                "detailed_instructions": "Complete scenario and role description",
                "word_count": "250-350 words",
                "time_allocation": "35 minutes", 
                "max_marks": {max_marks},
                "marking_criteria": {{
                    "content_ideas": "Content and development (/7)",
                    "language_expression": "Language and expression (/7)",
                    "structure_format": "Format and structure (/6)"
                }},
                "required_points": ["point 1", "point 2", "point 3", "point 4", "point 5"],
                "format_hints": "Specific format requirements for this writing type",
                "scenario_details": "Detailed background and context",
                "target_audience": "Who you are writing to/for"
            }}
            
            Make the prompt dynamic and different each time, using Zimbabwean context.
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