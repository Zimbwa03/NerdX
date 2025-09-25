#!/usr/bin/env python3
"""
Fix WhatsApp formatting by replacing double asterisks (**) with single asterisks (*) for proper bold text
"""

import re
import os

def fix_whatsapp_formatting_in_file(file_path):
    """Fix double asterisk formatting in a specific file"""
    print(f"🔧 Fixing formatting in {file_path}...")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Replace **text** with *text* for WhatsApp bold formatting
        # Use regex to find **text** patterns and replace with *text*
        content = re.sub(r'\*\*([^*]+?)\*\*', r'*\1*', content)
        
        # Count changes made
        double_asterisk_count = original_content.count('**') // 2  # Divide by 2 since each bold uses 2 pairs
        single_asterisk_count = content.count('**') // 2
        changes_made = double_asterisk_count - single_asterisk_count
        
        if changes_made > 0:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✅ Fixed {changes_made} formatting instances")
            return changes_made
        else:
            print(f"  ✅ No formatting issues found")
            return 0
            
    except Exception as e:
        print(f"  ❌ Error fixing {file_path}: {e}")
        return 0

def fix_all_formatting():
    """Fix formatting in all relevant files"""
    print("🧬⚗️⚡ FIXING WHATSAPP BOLD FORMATTING")
    print("=" * 60)
    print("Converting **text** to *text* for proper WhatsApp bold display")
    print()
    
    files_to_fix = [
        'api/webhook.py',
        'services/whatsapp_service.py',
        'services/english_service.py',
        'services/question_service.py',
        'handlers/mathematics_handler.py'
    ]
    
    total_changes = 0
    
    for file_path in files_to_fix:
        if os.path.exists(file_path):
            changes = fix_whatsapp_formatting_in_file(file_path)
            total_changes += changes
        else:
            print(f"⚠️ File not found: {file_path}")
    
    print(f"\n" + "=" * 60)
    print(f"📊 FORMATTING FIX SUMMARY:")
    print(f"✅ Total formatting instances fixed: {total_changes}")
    print(f"✅ Files processed: {len([f for f in files_to_fix if os.path.exists(f)])}")
    
    if total_changes > 0:
        print(f"\n🎉 SUCCESS!")
        print(f"✅ WhatsApp messages will now display proper bold text!")
        print(f"✅ No more double asterisks (**)!")
        print(f"✅ Clean, professional message formatting!")
    else:
        print(f"\n✅ All files already have correct formatting!")
    
    return total_changes

def show_examples():
    """Show before/after examples"""
    print(f"\n📝 FORMATTING EXAMPLES:")
    print(f"Before: **Outstanding!** → After: *Outstanding!*")
    print(f"Before: **Correct Answer:** → After: *Correct Answer:*")
    print(f"Before: **Your Science Progress** → After: *Your Science Progress*")
    print(f"Before: **Level UP!** → After: *Level UP!*")

if __name__ == "__main__":
    show_examples()
    total_fixes = fix_all_formatting()
    
    if total_fixes > 0:
        print(f"\n🚀 Ready to commit {total_fixes} formatting fixes!")
    else:
        print(f"\n✅ Formatting already correct!")
