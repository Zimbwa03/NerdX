"""
Mathematics Teacher Service - Professional AI Math Tutor
A conversational AI teacher for Mathematics using best teaching practices
"""

import logging
import json
import os
from datetime import datetime
from typing import Dict, Optional, List
from utils.session_manager import session_manager
from services.whatsapp_service import WhatsAppService
from database.external_db import make_supabase_request, get_user_credits, deduct_credits
from services.advanced_credit_service import advanced_credit_service

logger = logging.getLogger(__name__)

# Import requests for DeepSeek API
import requests

# Import Google Gemini AI (fallback only)
try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    genai = None
    GENAI_AVAILABLE = False


class MathematicsTeacherService:
    """
    Professional AI Mathematics Teacher
    Uses proven teaching methods: Socratic questioning, worked examples, progressive hints
    """
    
    def __init__(self):
        self.whatsapp_service = WhatsAppService()
        
        # Initialize DeepSeek AI as primary provider
        self.deepseek_api_key = os.getenv('DEEPSEEK_API_KEY')
        self.deepseek_api_url = 'https://api.deepseek.com/chat/completions'
        self._is_deepseek_configured = bool(self.deepseek_api_key)
        
        # Initialize Gemini AI as fallback
        self.gemini_model = None
        self._is_gemini_configured = False
        try:
            if GENAI_AVAILABLE:
                api_key = os.getenv('GEMINI_API_KEY')
                if api_key and genai:
                    genai.configure(api_key=api_key)
                    self.gemini_model = genai.GenerativeModel('gemini-2.0-flash-exp')
                    self._is_gemini_configured = True
        except Exception as e:
            logger.error(f"Error initializing Gemini fallback: {e}")
        
        if self._is_deepseek_configured:
            logger.info("✅ Mathematics Teacher initialized with DeepSeek AI (primary)")
        elif self._is_gemini_configured:
            logger.warning("DeepSeek not available - using Gemini as primary")
        else:
            logger.warning("No AI services available")
    
    # Professional Mathematics Teaching System Prompt
    MATH_TEACHER_SYSTEM_PROMPT = """You are a professional Mathematics teacher specializing in ZIMSEC and Cambridge O-Level Mathematics. You use proven teaching methods to help students develop deep conceptual understanding.

### Teaching Philosophy
Your approach is based on these proven methods:
1. **Socratic Method**: Guide students through questions rather than giving direct answers
2. **Worked Examples**: Show step-by-step solutions with clear explanations
3. **Progressive Difficulty**: Start simple and build complexity gradually
4. **Conceptual Understanding**: Focus on "why" not just "how"
5. **Real-World Applications**: Connect mathematics to practical scenarios
6. **Growth Mindset**: Encourage effort and learning from mistakes

### Teaching Approach

**Initial Interaction**:
- Greet the student warmly and professionally
- Ask about their current understanding of the topic
- Identify any misconceptions or gaps in knowledge
- Set clear learning objectives

**Concept Introduction**:
- Start with the fundamental concept in simple terms
- Use analogies and real-world examples
- Build from what the student already knows
- Explain the "why" behind mathematical rules

**Guided Practice**:
- Walk through examples step-by-step
- Explain your thinking process at each step
- Ask guiding questions to check understanding
- Address common mistakes proactively

**Independent Practice**:
- Give the student problems to try
- Provide progressive hints if they struggle (3 levels):
  * Level 1: General direction without giving away the method
  * Level 2: Specific method or formula to use
  * Level 3: First step of the solution
- Encourage them to explain their reasoning

**Feedback & Correction**:
- Analyze student work carefully
- Identify what they did correctly (positive reinforcement)
- Explain misconceptions clearly
- Show the correct approach with detailed steps
- Connect to the underlying concept

### Response Style
- Be patient, encouraging, and professional
- Use clear, precise mathematical language
- Break complex ideas into digestible parts
- Ask questions to promote active thinking
- Celebrate progress and effort
- Adapt explanations to student's level

### Topics Coverage
You teach all ZIMSEC/Cambridge O-Level Mathematics topics:
- Number Theory, Sets, Indices & Standard Form
- Algebra, Inequalities, Sequences & Series
- Matrices, Vectors, Geometry, Mensuration
- Trigonometry, Transformation Geometry
- Statistics, Probability, Graphs, Variation, Loci

### PDF Notes Generation
When student requests "generate notes", create comprehensive notes in JSON format:

{
  "title": "Topic Name",
  "subject": "Mathematics",
  "grade_level": "O-Level/Form 2/etc",
  "learning_objectives": [
    "Detailed objective 1",
    "Detailed objective 2",
    "Detailed objective 3"
  ],
  "key_concepts": {
    "concept1": "Clear definition with explanation",
    "concept2": "Clear definition with explanation",
    "concept3": "Clear definition with explanation"
  },
  "detailed_explanation": "COMPREHENSIVE explanation (500-800 words) covering:
  - Introduction with context
  - Step-by-step breakdown of concepts
  - Multiple worked examples with full solutions
  - Common mistakes and how to avoid them
  - Connections to other topics
  - Visual descriptions (diagrams in words)",
  "worked_examples": [
    {
      "problem": "Example problem statement",
      "solution_steps": [
        "Step 1: Clear explanation",
        "Step 2: Clear explanation",
        "Step 3: Clear explanation"
      ],
      "final_answer": "Answer with units",
      "key_concept": "What this example demonstrates"
    }
  ],
  "real_world_applications": [
    "Detailed application 1 with explanation",
    "Detailed application 2 with explanation"
  ],
  "common_mistakes": [
    "Mistake 1 and how to avoid it",
    "Mistake 2 and how to avoid it"
  ],
  "practice_problems": [
    {
      "problem": "Practice question",
      "hint": "Helpful hint",
      "answer": "Final answer"
    }
  ],
  "summary": "Comprehensive summary of key takeaways",
  "revision_schedule": {
    "day_3": "Review plan for day 3",
    "day_7": "Practice plan for day 7"
  },
  "references": [
    "ZIMSEC Syllabus - Specific section",
    "Relevant textbook chapters"
  ]
}

CRITICAL: Make notes VERY DETAILED (500-800 words minimum in detailed_explanation). Include multiple worked examples with complete step-by-step solutions.

Current conversation context will be provided with each message."""

    def start_session(self, user_id: str, subject: str, grade_level: str, topic: Optional[str] = None) -> Dict:
        """Start a new mathematics teaching session"""
        try:
            # Check and deduct credits (3 credits to start)
            credit_result = advanced_credit_service.check_and_deduct_credits(
                user_id, 'teacher_mode_start'
            )
            
            if not credit_result.get('success'):
                return {
                    'success': False,
                    'message': credit_result.get('message', 'Insufficient credits'),
                    'session_id': None,
                    'initial_message': None
                }
            
            # Create session ID
            session_id = f"math_teacher_{user_id}_{datetime.now().timestamp()}"
            
            # Initialize session data
            session_data = {
                'session_id': session_id,
                'user_id': user_id,
                'subject': subject,
                'grade_level': grade_level,
                'topic': topic,
                'conversation_history': [],
                'started_at': datetime.now().isoformat()
            }
            
            # Store session
            session_manager.set_data(user_id, 'math_teacher', session_data)
            
            # Generate initial teaching message using DeepSeek AI (primary)
            if (self._is_deepseek_configured or self._is_gemini_configured) and topic:
                initial_prompt = f"Start teaching {topic} to a {grade_level} Mathematics student. Begin with a warm greeting, ask about their current understanding, and introduce the topic clearly."
                initial_message = self._get_teaching_response(user_id, initial_prompt, session_data)
            elif topic:
                initial_message = f"👋 Welcome to Mathematics Teacher Mode!\n\nToday we'll be learning about **{topic}** at the {grade_level} level.\n\nBefore we begin, tell me: What do you already know about {topic}? This will help me teach you more effectively."
            else:
                initial_message = f"👋 Welcome to Mathematics Teacher Mode!\n\nI'm here to help you master {grade_level} Mathematics.\n\nWhat topic would you like to learn about today?"
            
            # Clean formatting
            initial_message = self._clean_whatsapp_formatting(initial_message)
            
            return {
                'success': True,
                'session_id': session_id,
                'subject': subject,
                'grade_level': grade_level,
                'topic': topic,
                'initial_message': initial_message
            }
            
        except Exception as e:
            logger.error(f"Error starting math teaching session: {e}")
            return {
                'success': False,
                'message': 'Failed to start teaching session',
                'session_id': None,
                'initial_message': None
            }
    
    def send_message(self, session_id: str, user_id: str, message: str) -> Dict:
        """Handle student message in teaching session"""
        try:
            session_data = session_manager.get_data(user_id, 'math_teacher')
            
            if not session_data or session_data.get('session_id') != session_id:
                return {
                    'success': False,
                    'response': 'Session not found or expired',
                    'session_ended': True
                }
            
            # Check for exit commands
            message_lower = message.lower().strip()
            exit_commands = ['exit', 'leave', 'stop', 'quit', 'back', 'main menu']
            if message_lower in exit_commands:
                return {
                    'success': True,
                    'response': 'Thank you for learning with me! Keep practicing! 📚',
                    'session_ended': True
                }
            
            # Check for notes generation
            if any(keyword in message_lower for keyword in ['generate notes', 'save notes', 'create notes', 'make notes']):
                return self.generate_notes(session_id, user_id)
            
            # Deduct 1 credit for follow-up
            credit_result = advanced_credit_service.check_and_deduct_credits(
                user_id, 'teacher_mode_followup'
            )
            
            if not credit_result.get('success'):
                return {
                    'success': False,
                    'response': credit_result.get('message', 'Insufficient credits'),
                    'session_ended': False
                }
            
            # Add user message to history
            conversation_history = session_data.get('conversation_history', [])
            conversation_history.append({
                'role': 'user',
                'content': message
            })
            
            # Get AI response
            response_text = self._get_teaching_response(user_id, message, session_data)
            
            # Add AI response to history
            conversation_history.append({
                'role': 'assistant',
                'content': response_text
            })
            
            # Keep last 20 messages
            session_data['conversation_history'] = conversation_history[-20:]
            session_manager.set_data(user_id, 'math_teacher', session_data)
            
            # Clean formatting
            clean_response = self._clean_whatsapp_formatting(response_text)
            
            return {
                'success': True,
                'response': clean_response,
                'session_id': session_id,
                'session_ended': False
            }
            
        except Exception as e:
            logger.error(f"Error handling math teacher message: {e}")
            return {
                'success': False,
                'response': 'Sorry, I encountered an error. Please try again.',
                'session_ended': False
            }
    
    def _get_teaching_response(self, user_id: str, message: str, session_data: dict) -> str:
        """Get teaching response from DeepSeek AI (primary) with Gemini fallback"""
        try:
            # Build context
            subject = session_data.get('subject', 'Mathematics')
            grade_level = session_data.get('grade_level', 'O-Level')
            topic = session_data.get('topic', 'General Mathematics')
            conversation_history = session_data.get('conversation_history', [])
            
            # Build conversation context
            context = f"Subject: {subject}\nGrade Level: {grade_level}\nTopic: {topic}\n\n"
            
            if conversation_history:
                context += "Recent conversation:\n"
                for msg in conversation_history[-10:]:
                    role = "Student" if msg['role'] == 'user' else "You"
                    context += f"{role}: {msg['content']}\n"
            
            # Create full prompt
            full_prompt = f"{self.MATH_TEACHER_SYSTEM_PROMPT}\n\n{context}\n\nStudent's message: {message}\n\nYour response:"
            
            # Try DeepSeek first (primary)
            if self._is_deepseek_configured:
                try:
                    response = requests.post(
                        self.deepseek_api_url,
                        headers={'Authorization': f'Bearer {self.deepseek_api_key}', 'Content-Type': 'application/json'},
                        json={
                            'model': 'deepseek-chat',
                            'messages': [
                                {'role': 'system', 'content': self.MATH_TEACHER_SYSTEM_PROMPT},
                                {'role': 'user', 'content': full_prompt}
                            ],
                            'temperature': 0.7,
                            'max_tokens': 2000
                        },
                        timeout=60
                    )
                    if response.status_code == 200:
                        data = response.json()
                        if 'choices' in data and len(data['choices']) > 0:
                            return data['choices'][0]['message']['content'].strip()
                except Exception as deepseek_error:
                    logger.error(f"DeepSeek error: {deepseek_error}")
            
            # Try Gemini as fallback
            if self._is_gemini_configured and self.gemini_model:
                try:
                    response = self.gemini_model.generate_content(full_prompt)
                    if response and response.text:
                        return response.text.strip()
                except Exception as gemini_error:
                    logger.error(f"Gemini fallback error: {gemini_error}")
            
            return self._get_fallback_response(message, session_data)
                
        except Exception as e:
            logger.error(f"Error getting teaching response: {e}")
            return self._get_fallback_response(message, session_data)
    
    
    def _get_fallback_response(self, message: str, session_data: dict) -> str:
        """Fallback response when AI unavailable"""
        topic = session_data.get('topic', 'this topic')
        return f"I'm having trouble connecting to my AI teacher. However, {topic} is an important concept in Mathematics. Please try asking your question again, or type 'generate notes' to create study materials."
    
    def _clean_whatsapp_formatting(self, text: str) -> str:
        """Clean formatting for WhatsApp"""
        import re
        cleaned = re.sub(r'\*\*([^\*]+?)\*\*', r'*\1*', text)
        return cleaned
    
    def generate_notes(self, session_id: str, user_id: str) -> Dict:
        """Generate PDF notes for the session"""
        try:
            session_data = session_manager.get_data(user_id, 'math_teacher')
            
            if not session_data:
                return {
                    'success': False,
                    'response': 'Session not found',
                    'session_ended': False
                }
            
            topic = session_data.get('topic')
            if not topic:
                return {
                    'success': False,
                    'response': 'Please select a topic first before generating notes.',
                    'session_ended': False
                }
            
            # Deduct 1 credit for PDF generation
            credit_result = advanced_credit_service.check_and_deduct_credits(
                user_id, 'teacher_mode_pdf'
            )
            
            if not credit_result.get('success'):
                return {
                    'success': False,
                    'response': credit_result.get('message', 'Insufficient credits'),
                    'session_ended': False
                }
            
            # Generate notes using DeepSeek AI (primary) with Gemini fallback
            if self._is_deepseek_configured or self._is_gemini_configured:
                subject = session_data.get('subject', 'Mathematics')
                grade_level = session_data.get('grade_level', 'O-Level')
                conversation_history = session_data.get('conversation_history', [])
                
                conversation_context = ""
                if conversation_history:
                    conversation_context = "\n\nContext from our lesson:\n"
                    for msg in conversation_history:
                        role = "Student" if msg['role'] == 'user' else "Teacher"
                        conversation_context += f"{role}: {msg['content'][:200]}\n"
                
                prompt = f"{self.MATH_TEACHER_SYSTEM_PROMPT}\n\nSubject: {subject}\nGrade Level: {grade_level}\nTopic: {topic}{conversation_context}\n\nStudent request: Generate notes\n\nProvide comprehensive notes in valid JSON format."
                
                try:
                    # Try DeepSeek first (primary - faster response)
                    if self._is_deepseek_configured:
                        response = requests.post(
                            self.deepseek_api_url,
                            headers={'Authorization': f'Bearer {self.deepseek_api_key}', 'Content-Type': 'application/json'},
                            json={
                                'model': 'deepseek-chat',
                                'messages': [
                                    {'role': 'system', 'content': self.MATH_TEACHER_SYSTEM_PROMPT},
                                    {'role': 'user', 'content': prompt}
                                ],
                                'temperature': 0.7,
                                'max_tokens': 3000
                            },
                            timeout=45
                        )
                        if response.status_code == 200:
                            data = response.json()
                            if 'choices' in data and len(data['choices']) > 0:
                                response_text = data['choices'][0]['message']['content'].strip()
                                notes_data = self._parse_notes_response(response_text)
                                if notes_data:
                                    from utils.math_notes_pdf_generator import MathNotesPDFGenerator
                                    pdf_generator = MathNotesPDFGenerator()
                                    pdf_path = pdf_generator.generate_notes_pdf(notes_data, user_id)
                                    return {
                                        'success': True,
                                        'pdf_url': pdf_path,
                                        'response': f'✅ Your Mathematics notes on {topic} have been generated!',
                                        'session_ended': False
                                    }
                    
                    # Fallback to Gemini if DeepSeek fails
                    if self._is_gemini_configured and self.gemini_model:
                        response = self.gemini_model.generate_content(prompt)
                    notes_data = self._parse_notes_response(response.text)
                    
                    if notes_data:
                        # Generate PDF
                        from utils.math_notes_pdf_generator import MathNotesPDFGenerator
                        pdf_generator = MathNotesPDFGenerator()
                        pdf_path = pdf_generator.generate_notes_pdf(notes_data, user_id)
                        
                        return {
                            'success': True,
                            'pdf_url': pdf_path,
                            'response': f'✅ Your Mathematics notes on {topic} have been generated!',
                            'session_ended': False
                        }
                except Exception as e:
                    logger.error(f"Error generating notes: {e}")
            
            # Fallback notes
            return self._generate_fallback_notes(user_id, session_data)
            
        except Exception as e:
            logger.error(f"Error in generate_notes: {e}")
            return {
                'success': False,
                'response': 'Failed to generate notes. Please try again.',
                'session_ended': False
            }
    
    def _parse_notes_response(self, response_text: str) -> Optional[Dict]:
        """Parse JSON notes from AI response"""
        try:
            if '{' in response_text and '}' in response_text:
                start_idx = response_text.find('{')
                end_idx = response_text.rfind('}') + 1
                json_str = response_text[start_idx:end_idx]
                return json.loads(json_str)
            return None
        except Exception as e:
            logger.error(f"Error parsing notes JSON: {e}")
            return None
    
    def _generate_fallback_notes(self, user_id: str, session_data: dict) -> Dict:
        """Generate basic fallback notes"""
        topic = session_data.get('topic', 'Mathematics')
        grade_level = session_data.get('grade_level', 'O-Level')
        
        notes_data = {
            "title": topic,
            "subject": "Mathematics",
            "grade_level": grade_level,
            "learning_objectives": [
                f"Understand the fundamental concepts of {topic}",
                f"Apply {topic} to solve problems",
                f"Connect {topic} to real-world applications"
            ],
            "key_concepts": {
                "Introduction": f"{topic} is an important concept in {grade_level} Mathematics."
            },
            "detailed_explanation": f"This topic covers the fundamental principles of {topic}. Students should focus on understanding the core concepts and practicing problem-solving.",
            "worked_examples": [],
            "real_world_applications": [f"{topic} is used in various practical applications."],
            "common_mistakes": ["Review the topic carefully to avoid common errors."],
            "practice_problems": [],
            "summary": f"Key points about {topic} for {grade_level} students.",
            "revision_schedule": {
                "day_3": "Review main concepts",
                "day_7": "Practice problems"
            },
            "references": ["ZIMSEC Syllabus", "Mathematics Textbook"]
        }
        
        try:
            from utils.math_notes_pdf_generator import MathNotesPDFGenerator
            pdf_generator = MathNotesPDFGenerator()
            pdf_path = pdf_generator.generate_notes_pdf(notes_data, user_id)
            
            return {
                'success': True,
                'pdf_url': pdf_path,
                'response': f'✅ Basic notes on {topic} have been generated!',
                'session_ended': False
            }
        except Exception as e:
            logger.error(f"Error generating fallback notes: {e}")
            return {
                'success': False,
                'response': 'Failed to generate notes.',
                'session_ended': False
            }


# Create singleton instance
mathematics_teacher_service = MathematicsTeacherService()
