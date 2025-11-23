#!/usr/bin/env python3
"""
Simpler script to fix math_question_generator.py
"""

# Read the entire file
with open(r'c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\services\math_question_generator.py', 'r', encoding='utf-8') as f:
    content = f.read()

# The broken section to replace
broken_section = """            # Required fields validation - 'answer' is optional as it's often included in solution
            required_fields = ['question', 'solution']


            if len(formatted_question['solution']) < 20:
                logger.error("Solution too short")
                return self._generate_fallback_question(subject, topic, difficulty)"""

# The fixed section
fixed_section = """            # Required fields validation
            required_fields = ['question', 'solution']
            
            for field in required_fields:
                if field not in question_data or not question_data[field]:
                    logger.error(f"Missing required field: {field}")
                    return None
            
            # Format the question with all necessary fields
            formatted_question = {
                'question': question_data.get('question', '').strip(),
                'solution': question_data.get('solution', '').strip(),
                'answer': question_data.get('answer', '').strip(),
                'points': question_data.get('points', 10 if difficulty == 'easy' else 20 if difficulty == 'medium' else 30),
                'explanation': question_data.get('explanation', ''),
                'difficulty': difficulty,
                'topic': topic,
                'subject': subject,
                'generated_at': datetime.now().isoformat(),
                'source': 'deepseek_ai'
            }

            if len(formatted_question['solution']) < 20:
                logger.error("Solution too short")
                return None"""

# Replace
content = content.replace(broken_section, fixed_section)

# Write back
with open(r'c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\services\math_question_generator.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("[SUCCESS] Math question generator fixed!")
