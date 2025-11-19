#!/usr/bin/env python3
"""
Mathematics Solution Analyzer using DeepSeek AI
Provides detailed explanations and alternative solution methods
"""

import logging
import os
import json
import requests
import time
from typing import Dict, List, Optional, Tuple
from datetime import datetime

logger = logging.getLogger(__name__)


class MathSolver:
    """DeepSeek AI-powered mathematics solution analyzer"""
    
    def __init__(self):
        self.api_key = os.environ.get('DEEPSEEK_API_KEY')
        self.api_url = 'https://api.deepseek.com/chat/completions'
        
    def analyze_answer(self, question: str, user_answer: str, correct_answer: str, solution: str) -> Dict:
        """Analyze user's answer and provide detailed feedback using DeepSeek AI"""
        try:
            if not self.api_key:
                return self._generate_basic_feedback(user_answer, correct_answer, solution)
            
            # Create prompt for answer analysis
            prompt = self._create_analysis_prompt(question, user_answer, correct_answer, solution)
            
            # Get AI analysis
            analysis = self._send_analysis_request(prompt)
            
            if analysis:
                return self._format_analysis_response(analysis, user_answer, correct_answer)
            else:
                return self._generate_basic_feedback(user_answer, correct_answer, solution)
                
        except Exception as e:
            logger.error(f"Error analyzing math answer: {e}")
            return self._generate_basic_feedback(user_answer, correct_answer, solution)

    def get_progressive_hint(self, question: str, difficulty: str, level: int = 1) -> Optional[str]:
        """Get a progressive hint based on the requested level (1-3)"""
        try:
            if not self.api_key:
                hints = [
                    "💡 Hint Level 1: Read the question carefully and identify the key values.",
                    "💡 Hint Level 2: Think about which formula applies to this type of problem.",
                    "💡 Hint Level 3: Break the problem down into smaller steps."
                ]
                return hints[min(level-1, 2)]
                
            hint_types = {
                1: "Gentle Nudge: Give a small clue about where to start without revealing any steps.",
                2: "Strategic Hint: Suggest a specific method, formula, or strategy to use.",
                3: "Detailed Guidance: Explain the first step of the solution clearly."
            }
            
            prompt = f"""You are MathMentor, an expert ZIMSEC mathematics tutor.
            
TASK: Provide a Level {level} hint for this problem.

QUESTION: {question}
DIFFICULTY: {difficulty}
HINT TYPE: {hint_types.get(level, "General Hint")}

REQUIREMENTS:
1. STRICTLY follow the hint level description above.
2. Be encouraging and professional.
3. DO NOT solve the problem or give the final answer.
4. Keep it short and clear (1-2 sentences).

RESPONSE FORMAT:
💡 Hint (Level {level}): [Your hint here]

Provide your hint:"""

            response = self._send_analysis_request(prompt)
            
            if response and isinstance(response, str):
                return response
            elif response and 'hint' in response:
                return response['hint']
                
            return f"💡 Hint Level {level}: Review the topic concepts and try again."
            
        except Exception as e:
            logger.error(f"Error generating progressive hint: {e}")
            return "💡 Hint: Take your time and work through the problem step by step."

    def get_worked_example(self, topic: str, difficulty: str) -> Optional[Dict]:
        """Generate a similar worked example problem with solution"""
        try:
            if not self.api_key:
                return None
                
            prompt = f"""You are MathMentor, expert ZIMSEC mathematics tutor.

TASK: Create a WORKED EXAMPLE problem similar to {topic} at {difficulty} level.

REQUIREMENTS:
1. Create a NEW problem similar to typical {topic} exam questions.
2. Provide a clear, step-by-step solution.
3. Explain the 'Why' behind key steps.
4. Make it educational and easy to follow.

RESPONSE FORMAT (JSON):
{{
    "problem": "The example problem text",
    "solution_steps": [
        "Step 1: Explanation...",
        "Step 2: Explanation...",
        "Final Answer: ..."
    ],
    "key_concept": "The main concept demonstrated"
}}

Generate the worked example:"""

            response = self._send_analysis_request(prompt)
            
            if response and isinstance(response, dict):
                return response
            elif response and isinstance(response, str):
                # Try to parse if it came back as string
                try:
                    import json
                    # Find JSON in string
                    start = response.find('{')
                    end = response.rfind('}') + 1
                    if start >= 0 and end > start:
                        return json.loads(response[start:end])
                except:
                    pass
                    
            return None
            
        except Exception as e:
            logger.error(f"Error generating worked example: {e}")
            return None

    def get_alternative_solution(self, question: str, answer: str) -> Optional[str]:
        """Get alternative solution method using DeepSeek AI"""
        try:
            if not self.api_key:
                return None
                
            prompt = f"""You are MathMentor, expert ZIMSEC mathematics tutor. 
            
TASK: Provide an ALTERNATIVE solution method for this mathematics problem.

QUESTION: {question}
CORRECT ANSWER: {answer}

REQUIREMENTS:
1. Show a DIFFERENT method than typically used
2. Explain why this alternative approach works
3. Show all steps clearly
4. Keep it suitable for ZIMSEC O-Level students
5. Make it educational and insightful

RESPONSE FORMAT:
```
Alternative Method: [Brief method name]

Step 1: [First step with explanation]
Step 2: [Second step with explanation]
...
Final Answer: [Same answer but different path]

Why this method works: [Mathematical reasoning]
When to use this method: [Practical advice]
```

Provide your alternative solution:"""

            analysis = self._send_analysis_request(prompt)
            
            if analysis and 'alternative_solution' in analysis:
                return analysis['alternative_solution']
            elif analysis and isinstance(analysis, str):
                return analysis
                
            return None
            
        except Exception as e:
            logger.error(f"Error getting alternative solution: {e}")
            return None

    def explain_concept(self, topic: str, difficulty: str) -> Optional[str]:
        """Get concept explanation using DeepSeek AI"""
        try:
            if not self.api_key:
                return None
                
            prompt = f"""You are MathMentor, expert ZIMSEC mathematics tutor.

TASK: Explain the mathematical concept clearly for ZIMSEC O-Level students.

TOPIC: {topic}
LEVEL: {difficulty}

REQUIREMENTS:
1. Clear, simple language appropriate for Forms 1-4 students
2. Include key formulas and rules
3. Provide practical tips for problem-solving
4. Give common mistakes to avoid
5. Keep explanation concise but complete

RESPONSE FORMAT:
```
🔑 Key Concept: [Brief definition]

📋 Important Rules:
• [Rule 1]
• [Rule 2]
• [Rule 3]

📝 Problem-Solving Tips:
• [Tip 1]
• [Tip 2]

⚠️ Common Mistakes:
• [Mistake 1]
• [Mistake 2]

💡 Remember: [Key insight]
```

Provide your concept explanation:"""

            analysis = self._send_analysis_request(prompt)
            
            if analysis and isinstance(analysis, str):
                return analysis
                
            return None
            
        except Exception as e:
            logger.error(f"Error explaining concept: {e}")
            return None

    def _create_analysis_prompt(self, question: str, user_answer: str, correct_answer: str, solution: str) -> str:
        """Create prompt for analyzing user's answer"""
        
        is_correct = self._compare_answers(user_answer, correct_answer)
        
        prompt = f"""You are MathMentor, expert ZIMSEC mathematics tutor with deep pedagogical knowledge.

TASK: Analyze a student's answer and provide constructive feedback.

QUESTION: {question}
STUDENT'S ANSWER: {user_answer}
CORRECT ANSWER: {correct_answer}
SOLUTION: {solution}

ANALYSIS REQUIREMENTS:
1. Determine if the student's answer is mathematically correct
2. Identify any partial credit if applicable  
3. Explain what the student did right (if anything)
4. Identify specific errors or misconceptions
5. Provide clear guidance for improvement
6. Be encouraging and educational
7. Suggest a related topic to practice if they got it wrong

RESPONSE FORMAT (JSON):
{{
    "is_correct": {str(is_correct).lower()},
    "partial_credit": "percentage if partially correct (0-100)",
    "feedback": "Constructive feedback focusing on learning",
    "what_went_right": "What the student did correctly",
    "what_went_wrong": "Specific errors or misconceptions", 
    "improvement_tips": "Clear guidance for next time",
    "encouragement": "Positive, motivating message",
    "related_topic": "Topic to practice next"
}}

Provide your analysis:"""

        return prompt

    def _send_analysis_request(self, prompt: str) -> Optional[Dict]:
        """Send analysis request to DeepSeek API"""
        
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }

        data = {
            'model': 'deepseek-chat',
            'messages': [{'role': 'user', 'content': prompt}],
            'max_tokens': 2000,
            'temperature': 0.5
        }

        try:
            response = requests.post(
                self.api_url,
                headers=headers,
                json=data,
                timeout=15
            )

            if response.status_code == 200:
                result = response.json()
                content = result['choices'][0]['message']['content']
                
                # Try to extract JSON
                try:
                    json_start = content.find('{')
                    json_end = content.rfind('}') + 1
                    
                    if json_start >= 0 and json_end > json_start:
                        json_str = content[json_start:json_end]
                        return json.loads(json_str)
                    else:
                        # Return raw content if no JSON found
                        return content
                        
                except json.JSONDecodeError:
                    # Return raw content if JSON parsing fails
                    return content
                    
            else:
                logger.error(f"DeepSeek analysis API error: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"Error sending analysis request: {e}")
            return None

    def _format_analysis_response(self, analysis: Dict, user_answer: str, correct_answer: str) -> Dict:
        """Format the analysis response"""
        
        if isinstance(analysis, str):
            # Handle raw text response
            is_correct = self._compare_answers(user_answer, correct_answer)
            return {
                'is_correct': is_correct,
                'feedback': analysis,
                'detailed_analysis': True
            }
        
        # Handle structured JSON response
        return {
            'is_correct': analysis.get('is_correct', False),
            'partial_credit': analysis.get('partial_credit', '0'),
            'feedback': analysis.get('feedback', 'Keep practicing!'),
            'what_went_right': analysis.get('what_went_right', ''),
            'what_went_wrong': analysis.get('what_went_wrong', ''),
            'improvement_tips': analysis.get('improvement_tips', ''),
            'encouragement': analysis.get('encouragement', 'Great effort!'),
            'related_topic': analysis.get('related_topic', ''),
            'detailed_analysis': True
        }

    def _generate_basic_feedback(self, user_answer: str, correct_answer: str, solution: str) -> Dict:
        """Generate basic feedback when AI analysis is not available"""
        
        is_correct = self._compare_answers(user_answer, correct_answer)
        
        if is_correct:
            return {
                'is_correct': True,
                'feedback': '✅ Excellent work! Your answer is correct.',
                'encouragement': 'You showed great mathematical understanding!',
                'detailed_analysis': False
            }
        else:
            return {
                'is_correct': False,
                'feedback': f'❌ The correct answer is {correct_answer}. Review the solution steps provided.',
                'improvement_tips': 'Take your time with each step and double-check your calculations.',
                'encouragement': 'Keep practicing - mathematics improves with experience!',
                'detailed_analysis': False
            }

    def _compare_answers(self, user_answer: str, correct_answer: str) -> bool:
        """Compare user answer with correct answer"""
        try:
            # Clean and normalize answers
            user_clean = str(user_answer).strip().lower()
            correct_clean = str(correct_answer).strip().lower()
            
            # Direct string comparison
            if user_clean == correct_clean:
                return True
            
            # Try numerical comparison
            try:
                user_num = float(user_clean.replace('x=', '').replace('=', '').strip())
                correct_num = float(correct_clean.replace('x=', '').replace('=', '').strip())
                return abs(user_num - correct_num) < 0.001
            except:
                pass
            
            # Check for common variations
            variations = [
                user_clean.replace(' ', ''),
                user_clean.replace('x=', ''),
                user_clean.replace('=', ''),
                user_clean.replace(',', '.'),  # Decimal notation
            ]
            
            for variation in variations:
                if variation == correct_clean:
                    return True
                    
            return False
            
        except Exception as e:
            logger.error(f"Error comparing answers: {e}")
            return False

    def get_hint(self, question: str, difficulty: str) -> Optional[str]:
        """Legacy method for backward compatibility - calls progressive hint level 1"""
        return self.get_progressive_hint(question, difficulty, level=1)