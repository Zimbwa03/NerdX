#!/usr/bin/env python3
"""
Mathematics Solution Analyzer using Vertex AI (DeepSeek fallback).
Provides detailed explanations and alternative solution methods.
"""

import logging
import os
import json
import requests
import time
from typing import Dict, List, Optional, Tuple
from datetime import datetime
from utils.deepseek import get_deepseek_chat_model
from services.vertex_service import vertex_service
from utils.vertex_ai_helper import extract_json_object

logger = logging.getLogger(__name__)


class MathSolver:
    """Vertex AI-powered mathematics solution analyzer with DeepSeek fallback."""
    
    def __init__(self):
        self.api_key = os.environ.get('DEEPSEEK_API_KEY')
        self.api_url = 'https://api.deepseek.com/chat/completions'
        self.deepseek_model = get_deepseek_chat_model()
        self._is_vertex_configured = bool(vertex_service and vertex_service.is_available())
        
    def analyze_answer(self, question: str, user_answer: str, correct_answer: str, solution: str) -> Dict:
        """Analyze answers with Vertex AI primary and DeepSeek fallback."""
        try:
            if not self.api_key and not self._is_vertex_configured:
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
            if not self.api_key and not self._is_vertex_configured:
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
            if not self.api_key and not self._is_vertex_configured:
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
        """Get alternative solution method with Vertex AI primary"""
        try:
            if not self.api_key and not self._is_vertex_configured:
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
        """Get concept explanation with Vertex AI primary"""
        try:
            if not self.api_key and not self._is_vertex_configured:
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
        
        prompt = f"""You are MathMentor, an expert ZIMSEC mathematics tutor with 15+ years of experience teaching O-Level and A-Level Mathematics.

TASK: Analyze a student's answer and provide CLEAR, STEP-BY-STEP feedback.

QUESTION: {question}
STUDENT'S ANSWER: {user_answer}
CORRECT ANSWER: {correct_answer}
SOLUTION: {solution}

CRITICAL REQUIREMENTS FOR FEEDBACK:
1. **STEP-BY-STEP STRUCTURE**: Break down feedback into clear, numbered steps (Step 1, Step 2, Step 3, etc.)
2. **CLARITY**: Use simple, clear language appropriate for the student's level
3. **EDUCATIONAL FOCUS**: Explain the "why" behind each step, not just the "what"
4. **ENCOURAGEMENT**: Be supportive and motivating, especially for incorrect answers
5. **SPECIFIC GUIDANCE**: Point out exactly where errors occurred (if any) and why

FEEDBACK STRUCTURE REQUIREMENTS:
- If CORRECT: Confirm understanding with numbered steps highlighting key concepts mastered
- If INCORRECT: 
  * Step 1: Identify what they did correctly (if anything)
  * Step 2: Point out the specific error or misconception with exact location
  * Step 3: Explain the correct approach step-by-step
  * Step 4: Provide a similar example or practice tip

ANALYSIS REQUIREMENTS:
1. Determine if the student's answer is mathematically correct
2. Identify any partial credit if applicable  
3. Explain what the student did right (if anything) - be specific
4. Identify specific errors or misconceptions - point to exact step/calculation
5. Provide clear, step-by-step guidance for improvement
6. Be encouraging and educational
7. Suggest a related topic to practice if they got it wrong

RESPONSE FORMAT (JSON - STRICT):
{{
    "is_correct": {str(is_correct).lower()},
    "partial_credit": "percentage if partially correct (0-100)",
    "feedback": "Step-by-step feedback with numbered steps. Format: Step 1: ... Step 2: ... Step 3: ...",
    "what_went_right": "Specific things the student did correctly (be specific, not generic)",
    "what_went_wrong": "Exact error location and explanation (e.g., 'In Step 2, you forgot to...')", 
    "improvement_tips": "Actionable, step-by-step advice (numbered steps if multiple tips)",
    "encouragement": "Positive, motivating message",
    "related_topic": "Topic to practice next",
    "step_by_step_explanation": "Detailed step-by-step walkthrough of the correct solution method"
}}

IMPORTANT:
- Use numbered steps (Step 1, Step 2, Step 3, etc.) throughout the feedback
- Be specific about which step of the solution had an error
- Provide clear mathematical reasoning, not just answers
- Use plain text math notation (x², √, π, etc.) - NO LaTeX

Provide your analysis:"""

        return prompt

    def _send_analysis_request(self, prompt: str) -> Optional[Dict]:
        """Send analysis request to Vertex AI primary; DeepSeek fallback."""

        # Vertex AI primary attempt
        if self._is_vertex_configured:
            try:
                result = vertex_service.generate_text(
                    prompt=prompt,
                    model="gemini-2.5-flash",
                )
                if result and result.get("success"):
                    text_response = (result.get("text") or "").strip()
                    if text_response:
                        parsed = extract_json_object(
                            text_response,
                            logger=logger,
                            context="math_solver:analysis",
                        )
                        if parsed is not None:
                            parsed.setdefault("ai_model", "vertex_ai")
                            return parsed
                        # Fall back to raw text if no JSON was found.
                        return text_response
            except Exception as exc:  # pragma: no cover - defensive logging
                logger.error("Vertex AI analysis failed: %s", exc, exc_info=True)

        # DeepSeek fallback
        if not self.api_key:
            logger.warning("DeepSeek API key missing for math_solver fallback")
            return None

        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }

        data = {
            'model': self.deepseek_model,
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
                        parsed = json.loads(json_str)
                        if isinstance(parsed, dict):
                            parsed.setdefault('ai_model', 'deepseek_fallback')
                        return parsed

                    # Return raw content if no JSON found
                    return content

                except json.JSONDecodeError:
                    # Return raw content if JSON parsing fails
                    return content

            logger.error(f"DeepSeek analysis API error: {response.status_code}")
            return None

        except Exception as e:
            logger.error(f"Error sending analysis request: {e}")
            return None

    def _format_analysis_response(self, analysis: Dict, user_answer: str, correct_answer: str) -> Dict:
        """Format the analysis response with step-by-step structure"""
        
        if isinstance(analysis, str):
            # Handle raw text response - add step structure if missing
            is_correct = self._compare_answers(user_answer, correct_answer)
            feedback = analysis
            if 'Step 1' not in feedback and 'Step' not in feedback:
                if is_correct:
                    feedback = f"""✅ Step 1: Your answer is CORRECT!

{feedback}

💡 Well done! Continue practicing to master this topic."""
                else:
                    feedback = f"""❌ Step 1: Let's review the correct approach.

{feedback}

📚 Study the solution steps carefully."""
            
            return {
                'is_correct': is_correct,
                'feedback': feedback,
                'step_by_step_explanation': feedback,
                'detailed_analysis': True
            }
        
        # Handle structured JSON response
        feedback = analysis.get('feedback', 'Keep practicing!')
        step_by_step = analysis.get('step_by_step_explanation', '')
        
        # Ensure feedback has step structure
        if 'Step 1' not in feedback and 'Step' not in feedback:
            if analysis.get('is_correct', False):
                feedback = f"""✅ Step 1: Your answer is CORRECT!

{feedback}

💡 Well done! Continue practicing to master this topic."""
            else:
                feedback = f"""❌ Step 1: Let's review the correct approach.

{feedback}

📚 Study the solution steps carefully."""
        
        # Combine feedback and step-by-step explanation if both exist
        if step_by_step and step_by_step not in feedback:
            feedback = f"{feedback}\n\n📚 DETAILED STEP-BY-STEP SOLUTION:\n{step_by_step}"
        elif not step_by_step:
            step_by_step = feedback
        
        return {
            'is_correct': analysis.get('is_correct', False),
            'partial_credit': analysis.get('partial_credit', '0'),
            'feedback': feedback,
            'what_went_right': analysis.get('what_went_right', ''),
            'what_went_wrong': analysis.get('what_went_wrong', ''),
            'improvement_tips': analysis.get('improvement_tips', ''),
            'encouragement': analysis.get('encouragement', 'Great effort!'),
            'related_topic': analysis.get('related_topic', ''),
            'step_by_step_explanation': step_by_step,
            'detailed_analysis': True
        }

    def _generate_basic_feedback(self, user_answer: str, correct_answer: str, solution: str) -> Dict:
        """Generate basic feedback when AI analysis is not available - with step-by-step structure"""
        
        is_correct = self._compare_answers(user_answer, correct_answer)
        
        if is_correct:
            feedback = f"""✅ Step 1: Your answer is CORRECT!
Step 2: You've successfully applied the mathematical concepts.
Step 3: Well done on showing your working!

📚 Key Concepts Mastered:
• You correctly identified the problem type
• You applied the appropriate method
• You arrived at the correct solution

💡 Keep practicing similar problems to reinforce your understanding!"""
            
            return {
                'is_correct': True,
                'feedback': feedback,
                'encouragement': 'You showed great mathematical understanding!',
                'what_went_right': 'You correctly solved the problem and applied the mathematical concepts accurately.',
                'improvement_tips': 'Step 1: Continue practicing similar problems\nStep 2: Try more challenging variations\nStep 3: Focus on understanding the underlying concepts',
                'step_by_step_explanation': solution or 'Review the solution steps provided with the question.',
                'detailed_analysis': False
            }
        else:
            feedback = f"""❌ Step 1: Your answer needs review.
Step 2: The correct answer is: {correct_answer}
Step 3: Review the detailed solution steps below to understand the correct approach.

📚 How to Improve:
Step 1: Read through the solution carefully
Step 2: Identify where your approach differed
Step 3: Practice similar problems to master the method

💡 Remember: Understanding the method is more important than just getting the answer!"""
            
            return {
                'is_correct': False,
                'feedback': feedback,
                'what_went_right': '',
                'what_went_wrong': f'Your answer ({user_answer}) does not match the correct solution ({correct_answer}). Review the step-by-step solution to identify where the error occurred.',
                'improvement_tips': 'Step 1: Review the solution steps provided\nStep 2: Identify which step you may have missed or done incorrectly\nStep 3: Try solving similar problems step-by-step\nStep 4: Check your work at each step',
                'encouragement': 'Keep practicing - mathematics improves with experience!',
                'step_by_step_explanation': solution or 'No detailed solution available. Review the question and try again.',
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
