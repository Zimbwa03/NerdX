import re

# Read the file
filepath = r'c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\NerdXApp\src\data\scienceNotes\chemistry.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

print(f"Original content length: {len(content)} characters")

# Find all topic definitions
topic_pattern = r'"([^"]+)":\s*\{\s*topic:'
all_topics = {}
duplicates = []

for match in re.finditer(topic_pattern, content):
    topic_name = match.group(1)
    pos = match.start()
    
    if topic_name in all_topics:
        duplicates.append((topic_name, pos))
        print(f"DUPLICATE: '{topic_name}' at position {pos}")
    else:
        all_topics[topic_name] = pos
        print(f"First occurrence: '{topic_name}' at position {pos}")

print(f"\nTotal unique topics: {len(all_topics)}")
print(f"Total duplicates to remove: {len(duplicates)}")

if duplicates:
    # For each duplicate, we need to find and remove the entire topic definition
    # We'll work backwards to not mess up the positions
    duplicates.sort(key=lambda x: x[1], reverse=True)
    
    for topic_name, pos in duplicates:
        # Find the end of this topic definition (the closing }, before the next topic or end of object)
        start = pos
        
        # Find the matching closing brace
        brace_count = 0
        end = pos
        in_string = False
        in_template = False
        escape = False
        
        for i, char in enumerate(content[pos:]):
            if escape:
                escape = False
                continue
            if char == '\\':
                escape = True
                continue
            if char == '`':  # Template literal toggle
                in_template = not in_template
            elif char == '"' and not in_template:
                in_string = not in_string
            elif not in_string and not in_template:
                if char == '{':
                    brace_count += 1
                elif char == '}':
                    brace_count -= 1
                    if brace_count == 0:
                        end = pos + i + 1
                        # Check for trailing comma
                        if end < len(content) and content[end] == ',':
                            end += 1
                        break
        
        print(f"Removing duplicate '{topic_name}' from {start} to {end}")
        
        # Find the start of this definition (including the key)
        # Look back for the newline
        while start > 0 and content[start-1] != '\n':
            start -= 1
        
        # Remove this chunk
        content = content[:start] + content[end:]

# Write the fixed file
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

# Verify
topic_count = len(re.findall(topic_pattern, content))
print(f"\nAfter cleanup: {topic_count} topics")
print(f"New content length: {len(content)} characters")
print("File saved!")
