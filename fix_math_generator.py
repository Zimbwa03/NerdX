#!/usr/bin/env python3
"""
Script to fix the math_question_generator.py file
"""

# Read the file
with open(r'c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\services\math_question_generator.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# The fix to insert after line 243 (index 243)
fix_code = """            
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

"""

# Insert the fix after line 243 (which is index 243 in 0-indexed array)
# Remove the empty lines 244-245 first
lines_before = lines[:243]
lines_after = lines[245:]  # Skip the two empty lines

# Combine with the fix
fixed_lines = lines_before + [fix_code] + lines_after

# Also need to change line 248 (now will be different index) from returning fallback to returning None
# Find and replace the line
for i, line in enumerate(fixed_lines):
    if 'if len(formatted_question' in line and i > 240:
        # Change the return statement 2 lines after
        if i + 2 < len(fixed_lines) and 'return self._generate_fallback_question' in fixed_lines[i + 2]:
            fixed_lines[i + 2] = '                return None\r\n'
        break

# Write the fixed file
with open(r'c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\services\math_question_generator.py', 'w', encoding='utf-8') as f:
    f.writelines(fixed_lines)

print("[SUCCESS] File fixed successfully!")
print("Fixed the _validate_and_format_question method by adding:")
print("  - Field validation loop")
print("  - formatted_question dictionary creation")
print("  - Changed fallback return to None")
