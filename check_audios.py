import re
import json

file_path = r"c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\NerdXApp\src\data\aLevelBiology\notes.ts"
try:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Simple state machine parsing or regex to find keys and check for audioUrl
    # Since it's TS, it's not valid JSON, but the structure is consistent.
    
    # We'll split by top-level keys
    topics = {}
    
    # Regex to find topic blocks
    # Looking for "Topic Name": { ... }
    # This is rough because of nesting, but audioUrl is usually at the top level of the topic object
    
    topic_matches = list(re.finditer(r'"([^"]+)":\s*\{', content))
    
    results = []
    
    for i, match in enumerate(topic_matches):
        topic_name = match.group(1)
        start_index = match.end()
        # approximate end index (start of next match or end of file)
        end_index = topic_matches[i+1].start() if i+1 < len(topic_matches) else len(content)
        
        block = content[start_index:end_index]
        
        has_audio = "audioUrl:" in block
        results.append((topic_name, has_audio))

    print(f"{'Topic':<40} | {'Has Audio'}")
    print("-" * 55)
    for topic, has_audio in results:
        print(f"{topic:<40} | {has_audio}")

except Exception as e:
    print(f"Error: {e}")
