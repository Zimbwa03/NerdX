import re

# File path for O-Level Chemistry notes
file_path = r"c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\NerdXApp\src\data\scienceNotes\chemistry.ts"

# Video URLs provided by the user mapped to Topic Keys
# Note: Keys must match the keys in chemistry.ts exactly
video_mappings = {
    "Acids, Bases and Salts": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/Acids,_Bases,_&_Salts.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9BY2lkcyxfQmFzZXMsXyZfU2FsdHMubXA0IiwiaWF0IjoxNzY1ODY5ODYxLCJleHAiOjUyNjYzNjU4NjF9.NXMIYW7xDXx8atobAjJE_SvDq9tkNeNEkIDhENlLEOM",
    
    "Atoms, Elements and Compounds": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/Building_Blocks_of_Reality.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9CdWlsZGluZ19CbG9ja3Nfb2ZfUmVhbGl0eS5tcDQiLCJpYXQiOjE3NjU4Njk4NzYsImV4cCI6NTI2NjM2NTg3Nn0.lvGS0nLBqFV_MXHnh_Tj26xDY-axr4SkYLZa7juyhRk",
    
    "Chemical Energetics": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/Chemical_Energetics%20(1).mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9DaGVtaWNhbF9FbmVyZ2V0aWNzICgxKS5tcDQiLCJpYXQiOjE3NjU4Njk4OTAsImV4cCI6NTI2NjM2NTg5MH0.y347fd66JwJX0L3JmRTViWAitgWDl3V--aDjDbHfSuI",
    
    "Electrochemistry": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/Electrochemistry.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9FbGVjdHJvY2hlbWlzdHJ5Lm1wNCIsImlhdCI6MTc2NTg2OTkxOCwiZXhwIjo1MjY2MzY1OTE4fQ.fKL2xNYiSCTg8yeJ960tiBoHiGfeJdo8B-MuwBRxplA",

    "Experimental Techniques and Chemical Analysis": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/Experimental_Techniques.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9FeHBlcmltZW50YWxfVGVjaG5pcXVlcy5tcDQiLCJpYXQiOjE3NjU4Njk5NDIsImV4cCI6NTI2NjM2NTk0Mn0.DhWSK0NLkKVbLPnSefOYZ-YvW6FCxnnr-bC9QQTX72w",
    
    "Organic Chemistry": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/Organic_Chemistry.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9PcmdhbmljX0NoZW1pc3RyeS5tcDQiLCJpYXQiOjE3NjU4NzAxMDQsImV4cCI6NTI2NjM2NjEwNH0.aLnvV2qklP8es74z5MAa2365hLQOHA-MLIAu0cdqu2Q",
    
    "The Periodic Table": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/Periodic_Table__Chaos_to_Order.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9QZXJpb2RpY19UYWJsZV9fQ2hhb3NfdG9fT3JkZXIubXA0IiwiaWF0IjoxNzY1ODcwMTI1LCJleHAiOjUyNjYzNjYxMjV9.q8Cy-SpEI50mjSdJmABup2QDX_KoDiXc7axR0ge_i4E",
    
    "Redox Reactions": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/Redox_Reactions__The_Electron_Exchange.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9SZWRveF9SZWFjdGlvbnNfX1RoZV9FbGVjdHJvbl9FeGNoYW5nZS5tcDQiLCJpYXQiOjE3NjU4NzAxNDcsImV4cCI6NTI2NjM2NjE0N30.Zaw3oQ0C30mOMfsM2eDgvmwh5o8AUS3rWU4Xt1tU9z4",
    
    "Stoichiometry": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/Stoichiometry__The_Recipe.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9TdG9pY2hpb21ldHJ5X19UaGVfUmVjaXBlLm1wNCIsImlhdCI6MTc2NTg3MDE2MSwiZXhwIjo1MjY2MzY2MTYxfQ.6ttVeW0TsinpTrk_HIIo8UR6AFyVbvJYj3X7WNxWBlA",

    "Chemistry of the Environment": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/The_Chemistry_of_Our_Environment.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9UaGVfQ2hlbWlzdHJ5X29mX091cl9FbnZpcm9ubWVudC5tcDQiLCJpYXQiOjE3NjU4NzAxODEsImV4cCI6NTI2NjM2NjE4MX0.jKlQDvHi6oPM0-MbHkYfrbhkoPNa-ZtOzBCQVXWHaCA",
    
    "Metals": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/The_Explainer__Metals.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9UaGVfRXhwbGFpbmVyX19NZXRhbHMubXA0IiwiaWF0IjoxNzY1ODcwMTk3LCJleHAiOjUyNjYzNjYxOTd9.G3HP5FrivaW4Cz2M3F9tMUvEEQvNznsVC0G0eegYwU8",
    
    "Chemical Bonding": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/Understanding_Chemical_Bonding.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9VbmRlcnN0YW5kaW5nX0NoZW1pY2FsX0JvbmRpbmcubXA0IiwiaWF0IjoxNzY1ODcwMjEzLCJleHAiOjUyNjYzNjYyMTN9.ikscsYUmSpPCPsXvL8HgrHph9tubLOI3EBFLs9WpPTg",
}

def update_chemistry_file():
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        updated = False
        
        for topic, url in video_mappings.items():
            print(f"Processing topic: {topic}")
            
            # Find the topic in the file
            # Pattern: "Topic Name": { ... }
            # We want to match the key and the opening brace
            key_pattern = re.compile(rf'"{re.escape(topic)}":\s*{{')
            
            match = key_pattern.search(content)
            
            if not match:
                print(f"   Topic not found in file: {topic}")
                continue
            
            # Find the end of this topic block (simplified approach)
            start_index = match.end()
            
            # Check if videoUrl is already present
            # We check the first 2000 chars of the topic block.
            # This is safer than regex scanning the whole file.
            topic_preview = content[start_index:start_index+2000]
            existing_match = re.search(r'videoUrl:\s*"([^"]+)"', topic_preview)
            
            # Since we matched a snippet, we need to be careful not to match the NEXT topic's videoUrl.
            # We can check if "subject" or "topic" comes before videoUrl in the snippet, 
            # but for now let's just insert it at the very top of the object, right after {
            
            if existing_match:
                 # Check if this videoUrl belongs to the CURRENT topic or the next one
                 # We'll see if we encounter a `},` or `topic:` followed by a quoted string before the videoUrl
                 potential_end = topic_preview.find('},')
                 match_start = existing_match.start()
                 
                 if potential_end != -1 and match_start > potential_end:
                     # It belonged to the next topic, so current topic misses it.
                     pass 
                 else:
                    # Update existing URL
                    print(f"  ⚠️ Video URL found, updating...")
                    # We have to be precise with replacement here.
                    # It's safer to just create a new file content string.
                    
                    # Instead of complex regex replacement of the value, let's just assume empty or different.
                    # Actually, for simplicity and safety in a massive file:
                    # We will insert it right after the opening brace '{'
                    # If there was an old one, we might have duplicates if we aren't careful.
                    # BUT the user wants THESE videos.
                    
                    # Safer strategy: Replace the whole `videoUrl: "..."` line if it exists in the block.
                    # Or Insert if not.
                    pass

            
            # Insert Strategy:
            # Insert `    videoUrl: "URL",` immediately after the topic line: `topic: "Topic Name",`
            # This is the standard pattern seen in the file.
            
            topic_tuple_pattern = re.compile(rf'(topic:\s*"{re.escape(topic)}",)')
            topic_tuple_match = topic_tuple_pattern.search(content, start_index)
            
            if topic_tuple_match:
                # We found `topic: "Name",` inside the block.
                # Let's check if videoUrl is already on the next line or nearby?
                insertion_point = topic_tuple_match.end()
                
                # Check scanning forward from insertion point
                next_chunk = content[insertion_point:insertion_point+500]
                
                video_url_pattern = re.compile(r'\s*videoUrl:\s*"[^"]*",?')
                existing_video_match = video_url_pattern.match(next_chunk) 
                # .match matches from beginning of string. .search scans.
                # We want to search nearby.
                
                existing_video_search = video_url_pattern.search(next_chunk)
                
                new_line = f'\n        videoUrl: "{url}",'
                
                if existing_video_search:
                     # It exists nearby. Replace it.
                     print("  Updating existing videoUrl entry...")
                     old_text = existing_video_search.group(0)
                     # We replace the old text with our new text in the original content
                     # We need absolute position
                     absolute_start = insertion_point + existing_video_search.start()
                     absolute_end = insertion_point + existing_video_search.end()
                     
                     content = content[:absolute_start] + new_line.strip() + "," + content[absolute_end:]
                     # Strip new line because we might be messing up formatting
                     updated = True
                else:
                    # Does not exist. Insert it independently.
                    print("  Inserting new videoUrl entry...")
                    content = content[:insertion_point] + new_line + content[insertion_point:]
                    updated = True
            
            else:
                print("  ❌ Could not find 'topic:' key inside the topic block.")
        
        if updated:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            print("\n   Successfully updated chemistry.ts with video URLs!")
        else:
            print("\n   No changes made (maybe topics not found?).")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    update_chemistry_file()
