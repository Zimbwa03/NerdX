#!/usr/bin/env python3
"""
Standalone English Comprehension Generator using DeepSeek AI V3.1
Replaces Gemini for English comprehension generation only
"""

import os
import json
import requests
import time
import logging
from typing import Dict, List, Optional

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class StandaloneEnglishComprehensionGenerator:
    """Standalone DeepSeek AI-powered English comprehension generator"""

    def __init__(self):
        self.api_key = os.environ.get('DEEPSEEK_API_KEY')
        self.api_url = 'https://api.deepseek.com/chat/completions'

        # Optimized settings for DeepSeek API V3.1
        self.max_retries = 3
        self.timeouts = [30, 45, 60]  # Progressive timeouts
        self.retry_delay = 2

    def generate_comprehension_passage(self, theme: str = "General") -> Optional[Dict]:
        """Generate reading comprehension passages with questions using DeepSeek V3.1"""
        
        if not self.api_key:
            logger.error("DeepSeek API key not configured")
            return self._get_fallback_comprehension()

        prompt = f"""Generate a ZIMSEC O-Level English reading comprehension exercise on the theme: {theme}

**Requirements:**
- Passage: 200-300 words
- Zimbabwean context and characters
- Age-appropriate content (14-17 years)
- 5 comprehension questions with answers
- Mix of literal and inferential questions
- Form 3-4 reading level

Return ONLY a JSON object:
{{
    "passage": "The complete reading passage",
    "title": "Passage title",
    "questions": [
        {{
            "question": "Question text",
            "answer": "Expected answer",
            "type": "literal/inferential"
        }}
    ]
}}"""

        return self._call_deepseek_api(prompt, "comprehension_passage")

    def generate_long_comprehension_passage(self, theme: str, form_level: int = 4) -> Optional[Dict]:
        """Generate long comprehensive passage with 10 questions for comprehension practice using DeepSeek V3.1"""
        
        if not self.api_key:
            logger.error("DeepSeek API key not configured")
            return self._get_fallback_long_comprehension(theme)

        prompt = f"""Generate a ZIMSEC O-Level English reading comprehension exercise on the theme: {theme}

**Requirements:**
- Passage: 400-600 words (long passage for proper comprehension practice)
- Zimbabwean context and characters where appropriate
- Age-appropriate content for Form {form_level} students (15-17 years)
- EXACTLY 10 comprehension questions with detailed answers
- Mix of literal, inferential, and critical thinking questions
- Varied question types: multiple choice, short answer, analysis
- Form {form_level} reading level

Return ONLY a JSON object:
{{
    "passage": {{
        "title": "Engaging passage title",
        "text": "The complete 400-600 word reading passage",
        "word_count": 500,
        "theme": "{theme}"
    }},
    "questions": [
        {{
            "question": "Question text here",
            "correct_answer": "Expected detailed answer",
            "question_type": "literal/inferential/critical",
            "marks": 2,
            "explanation": "Why this is the correct answer"
        }}
    ]
}}

Make the passage engaging and educational, suitable for O-Level comprehension practice."""

        return self._call_deepseek_api(prompt, "long_comprehension_passage")

    def _call_deepseek_api(self, prompt: str, generation_type: str) -> Optional[Dict]:
        """Make API call to DeepSeek V3.1 with retry logic"""
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.api_key}'
        }

        data = {
            "model": "deepseek-chat",
            "messages": [
                {
                    "role": "system",
                    "content": "You are an expert English Language tutor for ZIMSEC O-Level curriculum. Generate high-quality comprehension passages and questions that are educational, engaging, and appropriate for Zimbabwean students."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "stream": False,
            "temperature": 0.7,
            "max_tokens": 3000
        }

        for attempt in range(self.max_retries):
            timeout = self.timeouts[min(attempt, len(self.timeouts) - 1)]
            
            try:
                logger.info(f"DeepSeek V3.1 {generation_type} attempt {attempt + 1}/{self.max_retries} (timeout: {timeout}s)")
                
                response = requests.post(
                    self.api_url,
                    headers=headers,
                    json=data,
                    timeout=timeout
                )

                if response.status_code == 200:
                    result = response.json()
                    content = result['choices'][0]['message']['content']
                    
                    logger.info(f"Raw DeepSeek V3.1 response: {content[:200]}...")
                    
                    # Extract JSON from response
                    json_start = content.find('{')
                    json_end = content.rfind('}') + 1
                    
                    if json_start != -1 and json_end > json_start:
                        json_str = content[json_start:json_end]
                        
                        try:
                            passage_data = json.loads(json_str)
                            logger.info(f"✅ Successfully parsed JSON from DeepSeek V3.1")
                            
                            # Validate structure
                            if generation_type == "comprehension_passage":
                                if 'passage' in passage_data and 'questions' in passage_data:
                                    logger.info(f"✅ Successfully generated {generation_type} on attempt {attempt + 1}")
                                    return {
                                        'success': True,
                                        'passage_data': passage_data,
                                        'source': 'deepseek_v3.1'
                                    }
                            elif generation_type == "long_comprehension_passage":
                                if 'passage' in passage_data and 'questions' in passage_data:
                                    # Ensure we have exactly 10 questions
                                    questions = passage_data['questions']
                                    if len(questions) < 10:
                                        # Pad with additional questions if needed
                                        while len(questions) < 10:
                                            questions.append({
                                                "question": f"Additional comprehension question {len(questions) + 1} - What is your understanding of the main message in this passage?",
                                                "correct_answer": "Based on careful reading and analysis of the passage content.",
                                                "question_type": "inferential",
                                                "marks": 2,
                                                "explanation": "This question tests overall comprehension and analytical skills."
                                            })
                                    
                                    logger.info(f"✅ Successfully generated {generation_type} with {len(questions)} questions on attempt {attempt + 1}")
                                    return passage_data
                            
                        except json.JSONDecodeError as e:
                            logger.error(f"JSON decode error in {generation_type}: {e}")
                            if attempt < self.max_retries - 1:
                                time.sleep(self.retry_delay)
                                continue
                    else:
                        logger.error(f"No valid JSON found in response for {generation_type}")
                        if attempt < self.max_retries - 1:
                            time.sleep(self.retry_delay)
                            continue
                else:
                    logger.error(f"DeepSeek V3.1 API error: {response.status_code} - {response.text}")
                    if attempt < self.max_retries - 1:
                        time.sleep(self.retry_delay)
                        continue

            except requests.exceptions.Timeout:
                logger.warning(f"DeepSeek V3.1 timeout on attempt {attempt + 1}/{self.max_retries} (waited {timeout}s)")
                if attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay)
                    continue

            except (requests.exceptions.ConnectionError, requests.exceptions.HTTPError) as e:
                logger.warning(f"DeepSeek V3.1 connection error: {e}")
                if attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay)
                    continue

            except Exception as e:
                logger.error(f"DeepSeek V3.1 error on attempt {attempt + 1}: {e}")
                if attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay)
                    continue

        logger.error(f"Failed to generate {generation_type} after {self.max_retries} attempts")
        
        # Return appropriate fallback
        if generation_type == "comprehension_passage":
            return {
                'success': True,
                'passage_data': self._get_fallback_comprehension(),
                'source': 'fallback'
            }
        else:
            return self._get_fallback_long_comprehension("General")

    def _get_fallback_comprehension(self) -> Dict:
        """Fallback comprehension passage when AI fails"""
        return {
            "title": "The School Garden Project",
            "passage": "Tendai looked at the empty plot of land behind his school with excitement. As the head of the Environmental Club at Mufakose High School, he had been planning this garden project for months. The headmaster had finally given permission to use the space for growing vegetables. 'This will help our school become more sustainable,' Tendai thought as he sketched plans in his notebook. He envisioned rows of tomatoes, cabbages, and beans that could be used in the school kitchen. The project would also teach students about agriculture and environmental conservation. Tendai knew it wouldn't be easy - they would need tools, seeds, and water. But with the support of his club members and some teachers, he was confident they could create something amazing. The garden would not only provide food but also serve as an outdoor classroom where students could learn practical skills.",
            "questions": [
                {
                    "question": "Who is the main character in this passage?",
                    "answer": "Tendai",
                    "type": "literal"
                },
                {
                    "question": "What school does Tendai attend?",
                    "answer": "Mufakose High School",
                    "type": "literal"
                },
                {
                    "question": "What vegetables does Tendai plan to grow?",
                    "answer": "Tomatoes, cabbages, and beans",
                    "type": "literal"
                },
                {
                    "question": "Why does Tendai think the garden project is important?",
                    "answer": "It will help the school become more sustainable and serve as an outdoor classroom",
                    "type": "inferential"
                },
                {
                    "question": "What challenges does Tendai anticipate for the project?",
                    "answer": "They will need tools, seeds, and water",
                    "type": "literal"
                }
            ]
        }

    def _get_fallback_long_comprehension(self, theme: str) -> Dict:
        """Fallback long comprehension passage when AI fails"""
        return {
            "passage": {
                "title": f"Understanding {theme}",
                "text": f"""Technology has dramatically transformed the way we live, work, and communicate in the 21st century. In Zimbabwe, like many developing countries, the adoption of digital technology has brought both opportunities and challenges that affect every aspect of society.

The rise of mobile technology has been particularly significant. With the widespread availability of smartphones, even in rural areas, people can now access information, banking services, and educational resources that were previously unavailable. Mobile money platforms have revolutionized financial transactions, allowing people to send money, pay bills, and conduct business without traditional banking infrastructure.

In education, technology has opened new doors for learning. Students in remote areas can now access online courses, educational videos, and digital libraries. This has been especially important during times when physical attendance at schools was not possible. However, challenges remain, including unreliable internet connectivity and the digital divide between urban and rural areas.

The agricultural sector, which employs a significant portion of Zimbabwe's population, has also benefited from technological advances. Farmers can now receive weather forecasts, market prices, and agricultural advice through mobile applications. Satellite imagery helps monitor crop conditions, while GPS technology assists in precision farming techniques.

Despite these benefits, technology adoption has created new challenges. Cybersecurity threats have increased, and there are concerns about data privacy and the spread of misinformation through social media platforms. Additionally, the rapid pace of technological change has left some people, particularly older generations, struggling to adapt.

The youth have embraced technology more readily, using social media platforms to express themselves, connect with others, and even start online businesses. This has created new economic opportunities but also raised concerns about screen time and its impact on mental health and social relationships.

As Zimbabwe continues to develop its technological infrastructure, it is crucial to ensure that the benefits of technology are accessible to all citizens while addressing the challenges that come with digital transformation. This requires investment in education, infrastructure, and policies that protect citizens while promoting innovation.""",
                "word_count": 345,
                "theme": theme
            },
            "questions": [
                {
                    "question": "According to the passage, how has mobile technology impacted financial services in Zimbabwe?",
                    "correct_answer": "Mobile money platforms have revolutionized financial transactions, allowing people to send money, pay bills, and conduct business without traditional banking infrastructure.",
                    "question_type": "literal",
                    "marks": 2,
                    "explanation": "This information is directly stated in the second paragraph."
                },
                {
                    "question": "What challenges does the passage mention regarding technology in education?",
                    "correct_answer": "Unreliable internet connectivity and the digital divide between urban and rural areas.",
                    "question_type": "literal",
                    "marks": 2,
                    "explanation": "These challenges are explicitly mentioned in the education paragraph."
                },
                {
                    "question": "How has technology benefited the agricultural sector in Zimbabwe?",
                    "correct_answer": "Farmers can receive weather forecasts, market prices, and agricultural advice through mobile applications, while satellite imagery and GPS technology assist in farming.",
                    "question_type": "literal",
                    "marks": 3,
                    "explanation": "The agricultural benefits are detailed in the fourth paragraph."
                },
                {
                    "question": "What concerns are raised about technology adoption in the passage?",
                    "correct_answer": "Cybersecurity threats, data privacy concerns, spread of misinformation, and the digital divide between generations.",
                    "question_type": "inferential",
                    "marks": 3,
                    "explanation": "These concerns are mentioned in the fifth paragraph and require inference from the text."
                },
                {
                    "question": "How have young people in Zimbabwe embraced technology according to the passage?",
                    "correct_answer": "They use social media platforms to express themselves, connect with others, and start online businesses.",
                    "question_type": "literal",
                    "marks": 2,
                    "explanation": "This information is directly stated in the sixth paragraph."
                },
                {
                    "question": "What does the passage suggest is needed for Zimbabwe's technological development?",
                    "correct_answer": "Investment in education, infrastructure, and policies that protect citizens while promoting innovation.",
                    "question_type": "literal",
                    "marks": 2,
                    "explanation": "This requirement is explicitly stated in the final paragraph."
                },
                {
                    "question": "What is the main theme of this passage?",
                    "correct_answer": "The transformative impact of technology on Zimbabwean society, including both opportunities and challenges.",
                    "question_type": "critical",
                    "marks": 3,
                    "explanation": "This requires analysis of the overall message and purpose of the passage."
                },
                {
                    "question": "How does the passage present the relationship between technology and education?",
                    "correct_answer": "Technology has opened new learning opportunities but also created challenges like connectivity issues and digital divides.",
                    "question_type": "inferential",
                    "marks": 3,
                    "explanation": "This requires understanding the nuanced relationship described in the education section."
                },
                {
                    "question": "What evidence does the passage provide for technology's impact on rural areas?",
                    "correct_answer": "Smartphones are available in rural areas, enabling access to information, banking, and education that was previously unavailable.",
                    "question_type": "inferential",
                    "marks": 2,
                    "explanation": "This requires connecting information from different parts of the passage."
                },
                {
                    "question": "How does the passage address the future of technology in Zimbabwe?",
                    "correct_answer": "It emphasizes the need for balanced development that ensures accessibility while addressing challenges through proper investment and policies.",
                    "question_type": "critical",
                    "marks": 3,
                    "explanation": "This requires analysis of the passage's conclusion and forward-looking perspective."
                }
            ]
        }

# Create global instance
standalone_english_comprehension_generator = StandaloneEnglishComprehensionGenerator()

