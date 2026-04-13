import re
import logging
from datetime import datetime
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

class Validators:
    """Validation utilities for user inputs and data"""
    
    @staticmethod
    def validate_whatsapp_id(whatsapp_id: str) -> bool:
        """Validate WhatsApp ID format"""
        if not whatsapp_id or not isinstance(whatsapp_id, str):
            return False
        
        # WhatsApp IDs are typically 10-15 digit numbers
        pattern = r'^\d{10,15}$'
        return bool(re.match(pattern, whatsapp_id.strip()))
    
    @staticmethod
    def validate_name(name: str) -> Dict[str, Any]:
        """Validate user name"""
        if not name or not isinstance(name, str):
            return {'valid': False, 'error': 'Name is required'}
        
        name = name.strip()
        
        if len(name) < 2:
            return {'valid': False, 'error': 'Name must be at least 2 characters long'}
        
        if len(name) > 50:
            return {'valid': False, 'error': 'Name must be less than 50 characters'}
        
        # Allow letters, spaces, hyphens, and apostrophes
        pattern = r"^[a-zA-Z\s\-']+$"
        if not re.match(pattern, name):
            return {'valid': False, 'error': 'Name can only contain letters, spaces, hyphens, and apostrophes'}
        
        return {'valid': True, 'cleaned': name.title()}
    
    @staticmethod
    def validate_date_of_birth(dob_str: str) -> Dict[str, Any]:
        """Validate date of birth"""
        if not dob_str or not isinstance(dob_str, str):
            return {'valid': False, 'error': 'Date of birth is required'}
        
        try:
            # Try to parse DD/MM/YYYY format
            date_obj = datetime.strptime(dob_str.strip(), '%d/%m/%Y')
            
            # Check age constraints (must be between 10 and 25 years old)
            today = datetime.now()
            age = today.year - date_obj.year - ((today.month, today.day) < (date_obj.month, date_obj.day))
            
            if age < 10:
                return {'valid': False, 'error': 'You must be at least 10 years old to register'}
            
            if age > 25:
                return {'valid': False, 'error': 'Age must be 25 years or younger'}
            
            # Check if date is in the future
            if date_obj > today:
                return {'valid': False, 'error': 'Date of birth cannot be in the future'}
            
            return {'valid': True, 'date': date_obj.date(), 'age': age}
            
        except ValueError:
            return {'valid': False, 'error': 'Invalid date format. Please use DD/MM/YYYY (e.g., 15/03/2005)'}
    
    @staticmethod
    def validate_referral_code(referral_code: str) -> Dict[str, Any]:
        """Validate referral code format"""
        if not referral_code or not isinstance(referral_code, str):
            return {'valid': False, 'error': 'Referral code is required'}
        
        referral_code = referral_code.strip().upper()
        
        # Check NERDX#### format
        pattern = r'^NERDX\d{4}$'
        if not re.match(pattern, referral_code):
            return {'valid': False, 'error': 'Referral code must be in format NERDX#### (e.g., NERDX1234)'}
        
        return {'valid': True, 'code': referral_code}
    
    @staticmethod
    def validate_phone_number(phone: str) -> Dict[str, Any]:
        """Validate Zimbabwean phone number"""
        if not phone or not isinstance(phone, str):
            return {'valid': False, 'error': 'Phone number is required'}
        
        # Clean the number
        clean_phone = re.sub(r'[^\d+]', '', phone.strip())
        
        # Zimbabwean phone number patterns
        patterns = [
            r'^(\+263|263|0)(77|78|73|71|86|87)\d{7}$',  # Mobile and EcoCash
        ]
        
        for pattern in patterns:
            if re.match(pattern, clean_phone):
                # Normalize to international format
                if clean_phone.startswith('0'):
                    normalized = f"+263{clean_phone[1:]}"
                elif clean_phone.startswith('263'):
                    normalized = f"+{clean_phone}"
                elif clean_phone.startswith('+263'):
                    normalized = clean_phone
                else:
                    normalized = f"+263{clean_phone}"
                
                return {'valid': True, 'phone': normalized}
        
        return {'valid': False, 'error': 'Invalid Zimbabwean phone number format'}
    
    @staticmethod
    def validate_email(email: str) -> Dict[str, Any]:
        """Validate email address"""
        if not email or not isinstance(email, str):
            return {'valid': False, 'error': 'Email is required'}
        
        email = email.strip().lower()
        
        # Basic email pattern
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        
        if not re.match(pattern, email):
            return {'valid': False, 'error': 'Invalid email format'}
        
        if len(email) > 254:  # RFC 5321 limit
            return {'valid': False, 'error': 'Email address is too long'}
        
        return {'valid': True, 'email': email}
    
    @staticmethod
    def validate_subject(subject: str) -> Dict[str, Any]:
        """Validate subject selection"""
        from constants import TOPICS
        
        if not subject or not isinstance(subject, str):
            return {'valid': False, 'error': 'Subject is required'}
        
        subject = subject.strip().title()
        
        if subject not in TOPICS:
            return {'valid': False, 'error': f'Invalid subject. Choose from: {", ".join(TOPICS.keys())}'}
        
        return {'valid': True, 'subject': subject}
    
    @staticmethod
    def validate_topic(subject: str, topic: str) -> Dict[str, Any]:
        """Validate topic selection for a subject"""
        from constants import TOPICS
        
        # First validate subject
        subject_validation = Validators.validate_subject(subject)
        if not subject_validation['valid']:
            return subject_validation
        
        if not topic or not isinstance(topic, str):
            return {'valid': False, 'error': 'Topic is required'}
        
        subject = subject_validation['subject']
        topic = topic.strip()
        
        if topic not in TOPICS[subject]:
            return {'valid': False, 'error': f'Invalid topic for {subject}. Choose from available topics.'}
        
        return {'valid': True, 'subject': subject, 'topic': topic}
    
    @staticmethod
    def validate_difficulty(difficulty: str) -> Dict[str, Any]:
        """Validate difficulty level"""
        from constants import DIFFICULTY_LEVELS
        
        if not difficulty or not isinstance(difficulty, str):
            return {'valid': False, 'error': 'Difficulty is required'}
        
        difficulty = difficulty.strip().lower()
        
        if difficulty not in DIFFICULTY_LEVELS:
            return {'valid': False, 'error': f'Invalid difficulty. Choose from: {", ".join(DIFFICULTY_LEVELS)}'}
        
        return {'valid': True, 'difficulty': difficulty}
    
    @staticmethod
    def validate_answer(answer: str) -> Dict[str, Any]:
        """Validate user answer"""
        if not answer or not isinstance(answer, str):
            return {'valid': False, 'error': 'Answer is required'}
        
        answer = answer.strip()
        
        if len(answer) == 0:
            return {'valid': False, 'error': 'Answer cannot be empty'}
        
        if len(answer) > 1000:
            return {'valid': False, 'error': 'Answer is too long (maximum 1000 characters)'}
        
        return {'valid': True, 'answer': answer}
    
    @staticmethod
    def validate_credit_amount(amount: Any) -> Dict[str, Any]:
        """Validate credit amount"""
        try:
            amount = int(amount)
            
            if amount <= 0:
                return {'valid': False, 'error': 'Credit amount must be positive'}
            
            if amount > 10000:
                return {'valid': False, 'error': 'Credit amount cannot exceed 10,000'}
            
            return {'valid': True, 'amount': amount}
            
        except (ValueError, TypeError):
            return {'valid': False, 'error': 'Credit amount must be a valid number'}
    
    @staticmethod
    def validate_payment_amount(amount: Any) -> Dict[str, Any]:
        """Validate payment amount"""
        try:
            amount = float(amount)
            
            if amount <= 0:
                return {'valid': False, 'error': 'Payment amount must be positive'}
            
            if amount > 1000:  # Maximum $1000 USD
                return {'valid': False, 'error': 'Payment amount cannot exceed $1,000'}
            
            if amount < 0.50:  # Minimum $0.50 USD
                return {'valid': False, 'error': 'Payment amount must be at least $0.50'}
            
            return {'valid': True, 'amount': round(amount, 2)}
            
        except (ValueError, TypeError):
            return {'valid': False, 'error': 'Payment amount must be a valid number'}
    
    @staticmethod
    def sanitize_text_input(text: str, max_length: int = 1000) -> str:
        """Sanitize text input for safety"""
        if not text or not isinstance(text, str):
            return ""
        
        # Remove control characters and limit length
        text = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', text.strip())
        
        if len(text) > max_length:
            text = text[:max_length]
        
        return text
    
    @staticmethod
    def validate_mathematical_expression(expression: str) -> Dict[str, Any]:
        """Validate mathematical expression for graph generation"""
        if not expression or not isinstance(expression, str):
            return {'valid': False, 'error': 'Mathematical expression is required'}
        
        expression = expression.strip()
        
        # Check for dangerous keywords
        dangerous_keywords = ['import', 'exec', 'eval', 'open', 'file', '__', 'os', 'sys']
        for keyword in dangerous_keywords:
            if keyword in expression.lower():
                return {'valid': False, 'error': f'Expression contains restricted keyword: {keyword}'}
        
        # Check length
        if len(expression) > 200:
            return {'valid': False, 'error': 'Expression is too long (maximum 200 characters)'}
        
        # Basic syntax check for common mathematical functions
        allowed_chars = set('0123456789+-*/().,xytabcdefghijklmnopqrstuvwxyz^')
        if not all(c.lower() in allowed_chars or c.isspace() for c in expression):
            return {'valid': False, 'error': 'Expression contains invalid characters'}
        
        return {'valid': True, 'expression': expression}

# Export validator instance
validators = Validators()
