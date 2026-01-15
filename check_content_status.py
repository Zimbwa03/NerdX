import re

file_path = r"c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\NerdXApp\src\data\aLevelBiology\notes.ts"

try:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find all topics
    topic_matches = list(re.finditer(r'"([^"]+)":\s*\{', content))
    
    print(f"{'Topic':<40} | {'Audio':<5} | {'Video':<5}")
    print("-" * 60)
    
    missing_audio = []
    missing_video = []

    for i, match in enumerate(topic_matches):
        topic_name = match.group(1)
        start_index = match.end()
        end_index = topic_matches[i+1].start() if i+1 < len(topic_matches) else len(content)
        
        block = content[start_index:end_index]
        
        has_audio = "audioUrl:" in block
        has_video = "videoUrl:" in block
        
        print(f"{topic_name:<40} | {str(has_audio):<5} | {str(has_video):<5}")
        
        if not has_audio:
            missing_audio.append(topic_name)
        if not has_video:
            missing_video.append(topic_name)

    print("\n" + "="*60)
    print("MISSING CONTENT REPORT")
    print("="*60)
    print(f"Missing Audios ({len(missing_audio)}):")
    for t in missing_audio: print(f"- {t}")
    
    print(f"\nMissing Videos ({len(missing_video)}):")
    for t in missing_video: print(f"- {t}")

except Exception as e:
    print(f"Error: {e}")
