import re
import os

files_to_check = [
    {
        "name": "O-Level Chemistry",
        "path": r"c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\NerdXApp\src\data\scienceNotes\chemistry.ts"
    },
    {
        "name": "O-Level Biology",
        "path": r"c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\NerdXApp\src\data\scienceNotes\biology.ts"
    },
    {
        "name": "A-Level Chemistry",
        "path": r"c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\NerdXApp\src\data\aLevelChemistry\notes.ts"
    },
    {
        "name": "A-Level Biology",
        "path": r"c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\NerdXApp\src\data\aLevelBiology\notes.ts"
    },
    {
        "name": "O-Level Physics",
        "path": r"c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\NerdXApp\src\data\scienceNotes\physics.ts"
    },
    {
        "name": "A-Level Physics",
        "path": r"c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\NerdXApp\src\data\aLevelPhysics\notes.ts"
    }
]

def check_file(name, path):
    print(f"\nChecking {name}...")
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return

    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()

        # Regex to match topic objects.
        # Assuming format: "Topic Name": { ... }
        # We need to capture the block content to check for URLs.
        # Since regex for nested braces is hard, we can iterate through "Key": { start matches
        # and parse until the next key match.
        
        # Matches keys that look like topic definitions (quoted string followed by colon and brace)
        # Note: keys might not be quoted in some TS, but usually they are for these files.
        topic_pattern = re.compile(r'^\s*"([^"]+)":\s*\{', re.MULTILINE)
        
        matches = list(topic_pattern.finditer(content))
        
        missing_audio = []
        missing_video = []
        
        for i, match in enumerate(matches):
            topic_name = match.group(1)
            start_index = match.end()
            
            # Determine end of this block by the start of the next block, or end of file
            # This is an approximation but works if the structure is consistent
            if i + 1 < len(matches):
                end_index = matches[i+1].start()
            else:
                end_index = len(content)
                
            block_content = content[start_index:end_index]
            
            # Check for audioUrl
            has_audio = False
            audio_match = re.search(r'audioUrl:\s*"([^"]+)"', block_content)
            if audio_match and len(audio_match.group(1).strip()) > 5: # check for non-empty string
                has_audio = True
            
            # Check for videoUrl
            has_video = False
            video_match = re.search(r'videoUrl:\s*"([^"]+)"', block_content)
            if video_match and len(video_match.group(1).strip()) > 5:
                has_video = True
                
            if not has_audio:
                missing_audio.append(topic_name)
            if not has_video:
                missing_video.append(topic_name)
                
        print(f"Total Topics Found: {len(matches)}")
        
        print("\nMISSING AUDIO:")
        if missing_audio:
            for t in missing_audio:
                print(f"- {t}")
        else:
            print("None")
            
        print("\nMISSING VIDEO:")
        if missing_video:
            for t in missing_video:
                print(f"- {t}")
        else:
            print("None")
            
    except Exception as e:
        print(f"Error reading file: {e}")

if __name__ == "__main__":
    for item in files_to_check:
        check_file(item["name"], item["path"])
