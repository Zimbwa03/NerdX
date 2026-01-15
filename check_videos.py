import re

file_path = r"c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\NerdXApp\src\data\aLevelBiology\notes.ts"

try:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find all topics and check if they have videoUrl
    topic_matches = list(re.finditer(r'"([^"]+)":\s*\{', content))
    
    results = []
    
    for i, match in enumerate(topic_matches):
        topic_name = match.group(1)
        start_index = match.end()
        end_index = topic_matches[i+1].start() if i+1 < len(topic_matches) else len(content)
        
        block = content[start_index:end_index]
        
        has_video = "videoUrl:" in block
        
        # Extract existing video URL if present to compare (optional, but good for context)
        existing_video = "None"
        if has_video:
            v_match = re.search(r'videoUrl:\s*"([^"]+)"', block)
            if v_match:
                existing_video = v_match.group(1)
                if len(existing_video) > 40: existing_video = existing_video[:37] + "..."

        results.append((topic_name, has_video, existing_video))

    print(f"{'Topic':<40} | {'Has Video'} | {'Existing URL'}")
    print("-" * 80)
    for topic, has_video, existing_url in results:
        print(f"{topic:<40} | {str(has_video):<9} | {existing_url}")

except Exception as e:
    print(f"Error: {e}")
