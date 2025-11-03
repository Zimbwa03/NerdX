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

**ZIMSEC Format Requirements:**
- Passage: 400-600 words (authentic ZIMSEC length for proper comprehension practice)
- Zimbabwean context, characters, and cultural references where appropriate
- Age-appropriate content for Form {form_level} students (15-17 years)
- EXACTLY 10 comprehension questions following ZIMSEC patterns
- Question types must include:
  * 3-4 literal comprehension questions (direct from text)
  * 3-4 inferential questions (reading between lines)
  * 2-3 critical analysis questions (evaluation, opinion, comparison)
- Varied question formats: short answer, explanation, analysis
- Form {form_level} vocabulary and complexity level
- Include Zimbabwean names, places, and cultural elements naturally

**ZIMSEC Question Patterns to Follow:**
1. "According to the passage..." (literal)
2. "What does the author mean by..." (inferential)  
3. "Why do you think..." (critical thinking)
4. "Give evidence from the passage..." (textual support)
5. "In your own words, explain..." (comprehension + expression)

Return ONLY a JSON object:
{{
    "passage": {{
        "title": "Engaging passage title with Zimbabwean context",
        "text": "The complete 400-600 word reading passage with natural Zimbabwean elements",
        "word_count": 500,
        "theme": "{theme}"
    }},
    "questions": [
        {{
            "question": "Question text following ZIMSEC patterns",
            "correct_answer": "Expected detailed answer with key points",
            "question_type": "literal/inferential/critical",
            "marks": 2,
            "explanation": "Why this is the correct answer with textual evidence"
        }}
    ]
}}

Make the passage authentic, engaging, and educationally valuable for ZIMSEC O-Level students."""

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
        """Enhanced ZIMSEC-style fallback long comprehension passage when AI fails"""
        return {
            "passage": {
                "title": "The Digital Revolution in Zimbabwean Education",
                "text": """Chipo Mukamuri had always dreamed of becoming a doctor, but growing up in rural Mutoko, she faced many challenges in accessing quality education. Her local secondary school had limited resources, outdated textbooks, and no internet connection. However, everything changed when the government's digital education initiative reached her community in 2023.

The installation of solar-powered internet hubs and the distribution of tablets to students transformed learning at Mutoko Secondary School. Chipo could now access online medical courses, watch educational videos about human anatomy, and participate in virtual science experiments. Her biology teacher, Mr. Chiweshe, used digital microscopes to show students cellular structures that were previously impossible to observe with their basic equipment.

The change was not immediate or without challenges. Many teachers, including Mrs. Ndoro who had taught mathematics for twenty years using traditional methods, initially struggled to adapt to the new technology. Some parents worried that their children were spending too much time on screens instead of focusing on practical skills like farming and traditional crafts.

However, the results spoke for themselves. Within two years, the school's pass rates in science subjects increased by 40%. Students like Chipo began competing successfully in national science competitions, something that had seemed impossible before. The digital platform also connected rural students with mentors from universities in Harare and Bulawayo, providing guidance and inspiration.

Chipo's younger brother, Tinashe, who had learning difficulties, particularly benefited from educational apps that adapted to his learning pace. The personalized learning approach helped him understand mathematical concepts that had previously frustrated him. His confidence grew as he progressed through interactive lessons designed specifically for students with different learning needs.

The initiative also had unexpected benefits for the broader community. Parents began attending evening digital literacy classes at the school, learning to use mobile banking and access agricultural information online. Local farmers started using weather apps and market price platforms, improving their crop yields and income.

Despite these successes, challenges remained. Power outages still disrupted learning, and some students from very poor families could not afford the small monthly fee for internet access. The school community worked together to establish a scholarship fund, ensuring that no student was left behind due to financial constraints.

As Chipo prepared for her final examinations, she reflected on how technology had opened doors she never knew existed. She had already received a conditional offer to study medicine at the University of Zimbabwe, supported by her excellent performance in online preparatory courses. Her story became an inspiration for younger students, proving that with determination and the right tools, rural students could compete with their urban counterparts and achieve their dreams.""",
                "word_count": 456,
                "theme": theme
            },
            "questions": [
                {
                    "question": "According to the passage, what was Chipo's main challenge in accessing quality education?",
                    "correct_answer": "Her rural school had limited resources, outdated textbooks, and no internet connection.",
                    "question_type": "literal",
                    "marks": 2,
                    "explanation": "This information is directly stated in the first paragraph."
                },
                {
                    "question": "What does the author mean by 'digital education initiative' in the context of Mutoko?",
                    "correct_answer": "The installation of solar-powered internet hubs and distribution of tablets to students.",
                    "question_type": "inferential",
                    "marks": 2,
                    "explanation": "This requires understanding the specific components mentioned in the second paragraph."
                },
                {
                    "question": "Give evidence from the passage that shows the success of the digital education program.",
                    "correct_answer": "The school's pass rates in science subjects increased by 40% within two years, and students began competing successfully in national science competitions.",
                    "question_type": "literal",
                    "marks": 3,
                    "explanation": "These specific achievements are mentioned in the fourth paragraph."
                },
                {
                    "question": "Why do you think some parents were initially worried about the new technology?",
                    "correct_answer": "They were concerned that children were spending too much time on screens instead of learning practical skills like farming and traditional crafts.",
                    "question_type": "critical",
                    "marks": 3,
                    "explanation": "This shows understanding of the cultural and practical concerns mentioned in the passage."
                },
                {
                    "question": "In your own words, explain how the digital platform helped Tinashe with his learning difficulties.",
                    "correct_answer": "The educational apps adapted to his learning pace and provided personalized lessons, which helped him understand mathematical concepts and build confidence.",
                    "question_type": "inferential",
                    "marks": 2,
                    "explanation": "This requires rephrasing the information about personalized learning from the fifth paragraph."
                },
                {
                    "question": "What unexpected benefits did the initiative bring to the broader community?",
                    "correct_answer": "Parents learned digital literacy, mobile banking, and farmers accessed weather apps and market information, improving their yields and income.",
                    "question_type": "literal",
                    "marks": 3,
                    "explanation": "These community benefits are detailed in the sixth paragraph."
                },
                {
                    "question": "What challenges still remained despite the program's success?",
                    "correct_answer": "Power outages disrupted learning and some students couldn't afford internet access fees.",
                    "question_type": "literal",
                    "marks": 2,
                    "explanation": "These ongoing challenges are mentioned in the seventh paragraph."
                },
                {
                    "question": "How did the school community address the problem of students who couldn't afford internet access?",
                    "correct_answer": "They established a scholarship fund to ensure no student was left behind due to financial constraints.",
                    "question_type": "literal",
                    "marks": 2,
                    "explanation": "This solution is directly stated in the seventh paragraph."
                },
                {
                    "question": "What does Chipo's story suggest about the potential of rural students?",
                    "correct_answer": "It shows that with determination and the right tools, rural students can compete with urban counterparts and achieve their dreams.",
                    "question_type": "inferential",
                    "marks": 3,
                    "explanation": "This requires understanding the broader message conveyed through Chipo's success story."
                },
                {
                    "question": "What is the main message the author wants to convey through this passage?",
                    "correct_answer": "Technology can transform education and create opportunities for disadvantaged students, but requires community support and addressing practical challenges.",
                    "question_type": "critical",
                    "marks": 3,
                    "explanation": "This requires analysis of the overall theme and purpose of the passage."
                }
            ]
        }

# Create global instance
standalone_english_comprehension_generator = StandaloneEnglishComprehensionGenerator()

