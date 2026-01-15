import re

file_path = r"c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\NerdXApp\src\data\aLevelBiology\notes.ts"

try:
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    print(f"{'Line':<6} | {'Topic':<40} | {'Audio URL'}")
    print("-" * 100)

    current_topic = None
    topic_line = 0
    
    for i, line in enumerate(lines):
        # Check for topic definition
        # Assuming format: "Topic Name": {
        topic_match = re.search(r'^\s*"([^"]+)":\s*\{', line)
        if topic_match:
            current_topic = topic_match.group(1)
            topic_line = i + 1
            # Look ahead for audioUrl in the next few lines
            audio_url = "None"
            for j in range(1, 10): # Check next 10 lines
                if i + j < len(lines):
                    audio_match = re.search(r'audioUrl:\s*"([^"]+)"', lines[i+j])
                    if audio_match:
                        audio_url = audio_match.group(1)
                        # Truncate for display
                        if len(audio_url) > 50:
                            audio_url = audio_url[:47] + "..."
                        break
            
            print(f"{topic_line:<6} | {current_topic:<40} | {audio_url}")

except Exception as e:
    print(f"Error: {e}")
