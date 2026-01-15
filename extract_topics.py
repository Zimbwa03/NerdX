import re

file_path = r"c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\NerdXApp\src\data\aLevelBiology\notes.ts"
try:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    matches = re.findall(r'topic:\s*"([^"]+)"', content)
    for m in matches:
        print(m)
except Exception as e:
    print(f"Error: {e}")
