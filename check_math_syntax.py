#!/usr/bin/env python3
"""
Check Python syntax of mathematics_service.py file
"""

import ast
import sys

def check_python_syntax(filename):
    """Check if a Python file has valid syntax"""
    try:
        with open(filename, 'r', encoding='utf-8') as file:
            source = file.read()
        
        # Try to parse the AST
        ast.parse(source)
        print(f"✅ {filename} has valid Python syntax")
        return True
        
    except SyntaxError as e:
        print(f"❌ {filename} has syntax error at line {e.lineno}: {e.msg}")
        return False
    except Exception as e:
        print(f"❌ Error reading {filename}: {e}")
        return False

if __name__ == "__main__":
    filename = "services/mathematics_service.py"
    if check_python_syntax(filename):
        print("🎉 File syntax is valid!")
    else:
        print("⚠️ File has syntax errors that need to be fixed!")
        sys.exit(1)
