import re

file_path = r"c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\NerdXApp\src\data\scienceNotes\chemistry.ts"

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

def run_update():
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        updated = False
        print("Starting update...")

        for topic, url in video_mappings.items():
            print(f"Processing: {topic}")
            key_pattern = re.compile(rf'"{re.escape(topic)}":\s*{{')
            match = key_pattern.search(content)
            
            if not match:
                print("  Topic not found.")
                continue
            
            start_index = match.end()
            topic_tuple_pattern = re.compile(rf'(topic:\s*"{re.escape(topic)}",)')
            topic_tuple_match = topic_tuple_pattern.search(content, start_index)
            
            if topic_tuple_match:
                insertion_point = topic_tuple_match.end()
                next_chunk = content[insertion_point:insertion_point+500]
                video_url_pattern = re.compile(r'\s*videoUrl:\s*"[^"]*",?')
                existing_video_search = video_url_pattern.search(next_chunk)
                
                new_line = f'\n        videoUrl: "{url}",'
                
                if existing_video_search:
                     print("  Updating existing...")
                     absolute_start = insertion_point + existing_video_search.start()
                     absolute_end = insertion_point + existing_video_search.end()
                     content = content[:absolute_start] + new_line.strip() + "," + content[absolute_end:]
                     updated = True
                else:
                    print("  Inserting new...")
                    content = content[:insertion_point] + new_line + content[insertion_point:]
                    updated = True
            else:
                print("  Key line not found.")
        
        if updated:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            print("Done. File updated.")
        else:
            print("Done. No changes.")

    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    run_update()
