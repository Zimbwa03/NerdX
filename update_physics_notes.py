import json
import re

# Load the mapping
with open(r'c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\physics_media_mapping_final.json', 'r', encoding='utf-8') as f:
    mapping = json.load(f)

# Read the notes file
with open(r'c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\NerdXApp\src\data\aLevelPhysics\notes.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# For each topic, update or add videoUrl and audioUrl
for topic_name, urls in mapping.items():
    print(f"Processing: {topic_name}")
    
    # Find the topic in the file by searching for its name as a key
    topic_pattern = rf'"{re.escape(topic_name)}":\s*\{{'
    match = re.search(topic_pattern, content)
    
    if not match:
        print(f"  WARNING: Topic not found in file!")
        continue
    
    # Find where this topic's object starts
    topic_start = match.end() - 1  # Back to the opening brace
    
    # Find the 'topic:' line within this object
    topic_line_pattern = rf'topic:\s*"{re.escape(topic_name)}"'
    topic_line_match = re.search(topic_line_pattern, content[topic_start:topic_start+500])
    
    if not topic_line_match:
        print(f"  WARNING: Could not find topic line!")
        continue
    
    # Position after the topic line
    insert_position = topic_start + topic_line_match.end()
    
    # Check if videoUrl/audioUrl already exist in this topic
    # Search within the next 2000 characters for existing URLs
    next_section = content[insert_position:insert_position+2000]
    
    # Remove existing videoUrl and audioUrl if present
    has_video = 'videoUrl:' in next_section.split('},')[0] if '},' in next_section else 'videoUrl:' in next_section.split('sections:')[0]
    has_audio = 'audioUrl:' in next_section.split('},')[0] if '},' in next_section else 'audioUrl:' in next_section.split('sections:')[0]
    
    if has_video or has_audio:
        print(f"  Skipping - already has media URLs")
        continue
    
    # Build the lines to insert
    lines_to_insert = []
    if urls['videoUrl']:
        lines_to_insert.append(f'        videoUrl: "{urls["videoUrl"]}",')
    if urls['audioUrl']:
        lines_to_insert.append(f'        audioUrl: "{urls["audioUrl"]}",')
    
    if lines_to_insert:
        # Insert after the topic line
        insertion_text = '\n' + '\n'.join(lines_to_insert)
        content = content[:insert_position] + insertion_text + content[insert_position:]
        print(f"  Added {len(lines_to_insert)} media URL(s)")
    else:
        print(f"  No media to add")

# Write the updated content back
with open(r'c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\NerdXApp\src\data\aLevelPhysics\notes_updated.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n" + "=" * 80)
print("Updated file saved as: notes_updated.ts")
print("Please review and then replace the original notes.ts file")
print("=" * 80)
