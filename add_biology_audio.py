import re

# Read the file
filepath = r'c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\NerdXApp\src\data\aLevelBiology\notes.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Audio URL mappings based on filename analysis
audio_mappings = {
    "Biological Molecules": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Biology%20/A%20Level/Biological_Molecules_Structure_Defines_Function.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9CaW9sb2d5IC9BIExldmVsL0Jpb2xvZ2ljYWxfTW9sZWN1bGVzX1N0cnVjdHVyZV9EZWZpbmVzX0Z1bmN0aW9uLm00YSIsImlhdCI6MTc2ODEyODY3OSwiZXhwIjo1MjY4NjI0Njc5fQ.6vmWFuM9qHiFRARYvVkWwr-8ixJAQ0WCNtIGZ2xOJEQ",
    
    "Nucleic Acids and Protein Synthesis": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Biology%20/A%20Level/DNA_Structure_Replication_and_Protein_Synthesis.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9CaW9sb2d5IC9BIExldmVsL0ROQV9TdHJ1Y3R1cmVfUmVwbGljYXRpb25fYW5kX1Byb3RlaW5fU3ludGhlc2lzLm00YSIsImlhdCI6MTc2ODEyODY5MSwiZXhwIjo1MjY4NjI0NjkxfQ.bolqNx3Lm_W2uABMr3CPB2yWMGNUwVpx0y5AN2nZOW8",
    
    "Enzymes": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Biology%20/A%20Level/Enzyme_Structure_Kinetics_and_Industrial_Uses.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9CaW9sb2d5IC9BIExldmVsL0VuenltZV9TdHJ1Y3R1cmVfS2luZXRpY3NfYW5kX0luZHVzdHJpYWxfVXNlcy5tNGEiLCJpYXQiOjE3NjgxMjg3MDEsImV4cCI6NTI2ODYyNDcwMX0.y56xPbFtDaLF-fJ3xwc7LLOzMcPmPQretNFJUtyd3oU",
    
    "Gas Exchange": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Biology%20/A%20Level/Fick_s_Law_and_the_Lung_s_Design.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9CaW9sb2d5IC9BIExldmVsL0ZpY2tfc19MYXdfYW5kX3RoZV9MdW5nX3NfRGVzaWduLm00YSIsImlhdCI6MTc2ODEyODczOSwiZXhwIjo1MjY4NjI0NzM5fQ.XfMY8CyB9NCi8FRR-KKBHHYXv3mRnuLpIKhAxDWHcTI",
    
    "Cell Membranes and Transport": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Biology%20/A%20Level/Fluid_Mosaic_and_Cellular_Transport_Mechanisms.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9CaW9sb2d5IC9BIExldmVsL0ZsdWlkX01vc2FpY19hbmRfQ2VsbHVsYXJfVHJhbnNwb3J0X01lY2hhbmlzbXMubTRhIiwiaWF0IjoxNzY4MTI4NzU0LCJleHAiOjM2ODA0NjI0NzU0fQ.SMQ6hKpBkyKGbkgR8XkYoWCbdieb4oyP-vUPb28mkig",
    
    "Transport in Mammals": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Biology%20/A%20Level/Mammalian_Circulation_Double_Loop_and_Heart_Mechanics.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9CaW9sb2d5IC9BIExldmVsL01hbW1hbGlhbl9DaXJjdWxhdGlvbl9Eb3VibGVfTG9vcF9hbmRfSGVhcnRfTWVjaGFuaWNzLm00YSIsImlhdCI6MTc2ODEyODc3MywiZXhwIjo1MjY4NjI0NzczfQ.sb3TKXyKUvCP0m7HSdW40ugA9l517CrNzolf-Z2jYU4",
    
    "The Cell Cycle and Mitosis": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Biology%20/A%20Level/Mitosis_and_Cell_Cycle_Precision__Cancer.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9CaW9sb2d5IC9BIExldmVsL01pdG9zaXNfYW5kX0NlbGxfQ3ljbGVfUHJlY2lzaW9uX19DYW5jZXIubTRhIiwiaWF0IjoxNzY4MTI4Nzg2LCJleHAiOjUyNjg2MjQ3ODZ9.ur7AkIC5kSc7_ZFWOhFUpgogJWjdsz5LGie3mG_OytA",
    
    "Transport in Plants": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Biology%20/A%20Level/Plant_Transport_Physics_Xylem_Phloem.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9CaW9sb2d5IC9BIExldmVsL1BsYW50X1RyYW5zcG9ydF9QaHlzaWNzX1h5bGVtX1BobG9lbS5tNGEiLCJpYXQiOjE3NjgxMjg4MzQsImV4cCI6NTI2ODYyNDgzNH0.3q5riPJNZmEPxpVl7KboTn_Ehkw6NQk-eoyEnGkSQNo",
    
    "Cell Structure": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Biology%20/A%20Level/Ultrastructure_Mastery_From_Hooke_to_ATP.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9CaW9sb2d5IC9BIExldmVsL1VsdHJhc3RydWN0dXJlX01hc3RlcnlfRnJvbV9Ib29rZV90b19BVFAubTRhIiwiaWF0IjoxNzY4MTI4ODUyLCJleHAiOjUyNjg2MjQ4NTJ9.HIYO8ME41ipIQ_3InzDiNLIKe9u351TB7I4_7-bn2AU"
}

# Add audioUrl to each topic
for topic_name, audio_url in audio_mappings.items():
    print(f"Processing: {topic_name}")
    
    # Find the topic in the file
    # Pattern: "Topic Name": {\n        topic: "Topic Name",
    pattern = rf'("{re.escape(topic_name)}":\s*\{{\s*topic:\s*"{re.escape(topic_name)}")'
    match = re.search(pattern, content)
    
    if not match:
        print(f"  WARNING: Topic '{topic_name}' not found!")
        continue
    
    # Check if audioUrl already exists for this topic
    topic_start = match.start()
    next_topic_pattern = r'"\w[^"]*":\s*\{'
    next_match = re.search(next_topic_pattern, content[topic_start+50:topic_start+5000])
    topic_end = topic_start + 5000 if not next_match else topic_start + 50 + next_match.start()
    topic_chunk = content[topic_start:topic_end]
    
    if 'audioUrl:' in topic_chunk:
        print(f"  Skipping - already has audioUrl")
        continue
    
    # Insert audioUrl after "topic: "Topic Name","
    insert_pattern = rf'(topic:\s*"{re.escape(topic_name)}",)'
    replacement = rf'\1\n        audioUrl: "{audio_url}",'
    
    # Only replace in this specific topic section
    new_topic_chunk = re.sub(insert_pattern, replacement, topic_chunk, count=1)
    content = content[:topic_start] + new_topic_chunk + content[topic_end:]
    
    print(f"  Added audioUrl")

# Write the file
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("\n" + "="*60)
print("Audio URLs added to A Level Biology notes!")
print("="*60)
