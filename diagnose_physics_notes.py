import re

# Read the notes file
with open(r'c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\NerdXApp\src\data\aLevelPhysics\notes.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Check for syntax errors - look for lines with videoUrl or audioUrl
print("Checking syntax around videoUrl/audioUrl lines...")
print("=" * 80)

for i, line in enumerate(lines[:100], 1):  # Check first 100 lines
    if 'videoUrl' in line or 'audioUrl' in line:
        # Show context
        start = max(0, i-3)
        end = min(len(lines), i+2)
        print(f"\nLines {start+1}-{end}:")
        for j in range(start, end):
            marker = ">>> " if j == i-1 else "    "
            print(f"{marker}{j+1}: {lines[j]}", end='')
        print()

# Check if there are any obvious syntax issues
print("\n" + "=" * 80)
print("Checking for common syntax errors...")
print("=" * 80)

issues = []
for i, line in enumerate(lines[:500], 1):
    # Check for missing commas after videoUrl/audioUrl
    if ('videoUrl:' in line or 'audioUrl:' in line) and i < len(lines):
        next_line = lines[i] if i < len(lines) else ""
        if not line.strip().endswith(',') and not line.strip().endswith('{'):
            issues.append(f"Line {i}: Missing comma after URL? '{line.strip()[:80]}'")
    
    # Check for unmatched quotes
    if 'videoUrl' in line or 'audioUrl' in line:
        quote_count = line.count('"')
        if quote_count % 2 != 0:
            issues.append(f"Line {i}: Unmatched quotes in '{line.strip()[:80]}'")

if issues:
    print("\nPOTENTIAL ISSUES FOUND:")
    for issue in issues[:10]:  # Show first 10
        print(f"  - {issue}")
else:
    print("\nNo obvious syntax errors found in first 500 lines")

print("\n" + "=" * 80)
print("DIAGNOSIS COMPLETE")
print("=" * 80)
