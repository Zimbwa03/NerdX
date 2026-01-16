import re

file_path = r"c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\NerdXApp\src\data\scienceNotes\chemistry.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Pattern to find keys in the Notes object
# Assuming format: "Key": {
# We use regex to find start of lines with quotes
matches = re.findall(r'^\s*"([^"]+)":\s*\{', content, re.MULTILINE)

print("Found keys:")
for m in matches:
    print(f"- {m}")
