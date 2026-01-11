import re

# Read the file
filepath = r'c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\NerdXApp\src\data\aLevelBiology\notes.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Video URL mappings based on filename analysis
video_mappings = {
    "Biological Molecules": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Biology/A%20level/Biology_s_Blueprint.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0Jpb2xvZ3kvQSBsZXZlbC9CaW9sb2d5X3NfQmx1ZXByaW50Lm1wNCIsImlhdCI6MTc2ODEyOTA4NywiZXhwIjo1MjY4NjI1MDg3fQ.eYSb0PUeyifCvJjyhf2XJOsG2KfdTaO0kP6mf3tczZc",
    
    "Enzymes": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Biology/A%20level/Enzymes__Life_s_Tiny_Engines.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0Jpb2xvZ3kvQSBsZXZlbC9Fbnp5bWVzX19MaWZlX3NfVGlueV9FbmdpbmVzLm1wNCIsImlhdCI6MTc2ODEyOTA5NSwiZXhwIjo1MjY4NjI1MDk1fQ.jO987E4VdTbLc3vmkGR96rTefSVoawWuQ98N6ybExwQ",
    
    "Immunity": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Biology/A%20level/Immunity__Your_Body_s_Fortress.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0Jpb2xvZ3kvQSBsZXZlbC9JbW11bml0eV9fWW91cl9Cb2R5X3NfRm9ydHJlc3MubXA0IiwiaWF0IjoxNzY4MTI5MTEyLCJleHAiOjUyNjg2MjUxMTJ9.rRZcVvIf6jiC61l6W4k3A0nHXe65QddZT3QXg4C1uhk",
    
    "Infectious Diseases": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Biology/A%20level/Infectious_Diseases.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0Jpb2xvZ3kvQSBsZXZlbC9JbmZlY3Rpb3VzX0Rpc2Vhc2VzLm1wNCIsImlhdCI6MTc2ODEyOTEyNSwiZXhwIjo1MjY4NjI1MTI1fQ.in6z7AoomTPwf3KKwEoOImqHDk3AOe7oIV2zXhZ544Y",
    
    "Selection and Evolution": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Biology/A%20level/Natural_Selection.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0Jpb2xvZ3kvQSBsZXZlbC9OYXR1cmFsX1NlbGVjdGlvbi5tcDQiLCJpYXQiOjE3NjgxMjkxNDQsImV4cCI6NTI2ODYyNTE0NH0.vUYNv7_KfbaLLKvWzMidvSStwAeBdFzFe2i3HG-iidM",
    
    "Smoking and Health": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Biology/A%20level/Smoking_and_Health.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0Jpb2xvZ3kvQSBsZXZlbC9TbW9raW5nX2FuZF9IZWFsdGgubXA0IiwiaWF0IjoxNzY4MTI5MTYwLCJleHAiOjUyNjg2MjUxNjB9.bZWfD6GfSt4SEM3Ys-R3byocxnbUvDctd7EgL7oZV00",
    
    "Cell Structure": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Biology/A%20level/The_Cell__A_Living_City.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0Jpb2xvZ3kvQSBsZXZlbC9UaGVfQ2VsbF9fQV9MaXZpbmdfQ2l0eS5tcDQiLCJpYXQiOjE3NjgxMjkxNzIsImV4cCI6NTI2ODYyNTE3Mn0.T4_MTiUj9jz5DSVEGwPL5FxdwwFbDeIODznaW2oz4fE",
    
    "The Cell Cycle and Mitosis": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Biology/A%20level/The_Cell_Cycle.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0Jpb2xvZ3kvQSBsZXZlbC9UaGVfQ2VsbF9DeWNsZS5tcDQiLCJpYXQiOjE3NjgxMjkxODIsImV4cCI6NTI2ODYyNTE4Mn0.ynSCcLpJuLSjADT8C_VRYFq_lxkmmo2yonGbW3r9s64",
    
    "Nucleic Acids and Protein Synthesis": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Biology/A%20level/The_Journey_of_a_Gene.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0Jpb2xvZ3kvQSBsZXZlbC9UaGVfSm91cm5leV9vZl9hX0dlbmUubXA0IiwiaWF0IjoxNzY4MTI5MTk4LCJleHAiOjUyNjg2MjUxOTh9.8V5xirvXGnL8Pho9MMSS5tULnprscrqoP6EVNawwIc8",
    
    "Gas Exchange": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Biology/A%20level/The_Vital_Exchange.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0Jpb2xvZ3kvQSBsZXZlbC9UaGVfVml0YWxfRXhjaGFuZ2UubXA0IiwiaWF0IjoxNzY4MTI5MjE0LCJleHAiOjUyNjg2MjUyMTR9.SNdQEZO14EHvh5DpU-AbnwzCiZICaiaEtsDlQhL_51A",
    
    "Transport in Plants": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Biology/A%20level/Transport__Life_s_Delivery.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0Jpb2xvZ3kvQSBsZXZlbC9UcmFuc3BvcnRfX0xpZmVfc19EZWxpdmVyeS5tcDQiLCJpYXQiOjE3NjgxMjkyMzYsImV4cCI6NTI2ODYyNTIzNn0._lsGwL8pCTQPWQmc8l1BfBLDfyAZGaKpFWD8vNdBhH0",
    
    "Transport in Mammals": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Biology/A%20level/Transport_in_Mammals.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0Jpb2xvZ3kvQSBsZXZlbC9UcmFuc3BvcnRfaW5fTWFtbWFscy5tcDQiLCJpYXQiOjE3NjgxMjkyNDgsImV4cCI6NTI2ODYyNTI0OH0.OvMGb-5kRf5mWMevCRWRyRR1EmXv2gFEDEwb5y5d-ks"
}

# Add videoUrl to each topic
for topic_name, video_url in video_mappings.items():
    print(f"Processing: {topic_name}")
    
    # Find the topic in the file
    pattern = rf'("{re.escape(topic_name)}":\s*\{{\s*topic:\s*"{re.escape(topic_name)}")'
    match = re.search(pattern, content)
    
    if not match:
        print(f"  WARNING: Topic '{topic_name}' not found!")
        continue
    
    # Check if videoUrl already exists for this topic
    topic_start = match.start()
    next_topic_pattern = r'"\w[^"]*":\s*\{'
    next_match = re.search(next_topic_pattern, content[topic_start+50:topic_start+5000])
    topic_end = topic_start + 5000 if not next_match else topic_start + 50 + next_match.start()
    topic_chunk = content[topic_start:topic_end]
    
    if 'videoUrl:' in topic_chunk:
        print(f"  Skipping - already has videoUrl")
        continue
    
    # Insert videoUrl after topic line (or after audioUrl if present)
    if 'audioUrl:' in topic_chunk:
        # Insert after audioUrl line
        insert_pattern = r'(audioUrl:\s*"[^"]+",)'
        replacement = rf'\1\n        videoUrl: "{video_url}",'
    else:
        # Insert after topic line
        insert_pattern = rf'(topic:\s*"{re.escape(topic_name)}",)'
        replacement = rf'\1\n        videoUrl: "{video_url}",'
    
    new_topic_chunk = re.sub(insert_pattern, replacement, topic_chunk, count=1)
    content = content[:topic_start] + new_topic_chunk + content[topic_end:]
    
    print(f"  Added videoUrl")

# Write the file
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("\n" + "="*60)
print("Video URLs added to A Level Biology notes!")
print("="*60)
