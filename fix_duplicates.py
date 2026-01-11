import re

# Read the file
with open(r'c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\NerdXApp\src\data\aLevelPhysics\notes.ts', 'r', encoding='utf-8') as f:
    content = f.read()
    lines = content.split('\n')

print(f"Original file has {len(lines)} lines")

# Find where the duplicates start - look for the second occurrence of "Physical Quantities and Units"
first_pq = None
duplicate_start = None

for i, line in enumerate(lines):
    if '"Physical Quantities and Units":' in line or "'Physical Quantities and Units':" in line:
        if first_pq is None:
            first_pq = i
            print(f"First 'Physical Quantities and Units' at line {i+1}")
        else:
            duplicate_start = i
            print(f"Duplicate 'Physical Quantities and Units' starts at line {i+1}")
            break

if duplicate_start is None:
    print("No duplicate found!")
    exit()

# Find where the object ends (look for }; after the duplicates)
object_end = None
for i in range(len(lines)-1, duplicate_start, -1):
    line = lines[i].strip()
    if line == '};':
        object_end = i
        print(f"Object ends at line {i+1}")
        break

# Find where the helper functions start 
helper_start = None
for i in range(object_end, len(lines)):
    if 'export function getTopicNotes' in lines[i]:
        helper_start = i
        print(f"Helper functions start at line {i+1}")
        break

# Find where the first set of topics ends (line before duplicate_start)
# We need to close the object and add the helper functions
first_part_end = duplicate_start - 1

# Check if the line before duplicates needs fixing
while first_part_end > 0 and lines[first_part_end].strip() == '':
    first_part_end -= 1

print(f"First set ends at line {first_part_end + 1}: '{lines[first_part_end].strip()[:50]}...'")

# Build the new file:
# 1. Keep lines 0 to first_part_end (the first set of topics with URLs)
# 2. Change the last line from "}," to "}" to close the last topic
# 3. Add "};" to close the object
# 4. Add the helper functions

new_lines = lines[:first_part_end + 1]

# Fix the last line - it should end with } not },
if new_lines[-1].strip().endswith('},'):
    new_lines[-1] = new_lines[-1].replace('},', '}')
    print("Fixed last topic closing brace")

# Close the object
new_lines.append('};')
new_lines.append('')

# Add helper functions (from helper_start to end)
if helper_start:
    new_lines.extend(lines[helper_start:])
    print(f"Added helper functions from line {helper_start+1}")

# Write the fixed file
new_content = '\n'.join(new_lines)
with open(r'c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\NerdXApp\src\data\aLevelPhysics\notes.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"\nFixed file has {len(new_lines)} lines (removed {len(lines) - len(new_lines)} duplicate lines)")
print("File saved!")
