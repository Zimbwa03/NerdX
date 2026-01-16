import re

file_path = r"c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\NerdXApp\src\data\scienceNotes\chemistry.ts"

# Audio Mappings
# Mapping both main keys and duplicate/variant keys
audio_mappings = {
    # 1. Chemical Energetics / Energy from Chemicals
    "Chemical Energetics": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Bond_Breaking_and_Forming_Energy_Payoff.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL0JvbmRfQnJlYWtpbmdfYW5kX0Zvcm1pbmdfRW5lcmd5X1BheW9mZi5tNGEiLCJpYXQiOjE3NjU0NzAxMjgsImV4cCI6NTI2NTk2NjEyOH0.58DuvE1w_aCjNQUjwGxpQjlhTuaB4l65S_MuKXqHMq4",
    "Energy from Chemicals": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Bond_Breaking_and_Forming_Energy_Payoff.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL0JvbmRfQnJlYWtpbmdfYW5kX0Zvcm1pbmdfRW5lcmd5X1BheW9mZi5tNGEiLCJpYXQiOjE3NjU0NzAxMjgsImV4cCI6NTI2NTk2NjEyOH0.58DuvE1w_aCjNQUjwGxpQjlhTuaB4l65S_MuKXqHMq4",

    # 2. Experimental Techniques...
    "Experimental Techniques and Chemical Analysis": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Chemical_Separation_Purity_and_Identification_Techniques.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL0NoZW1pY2FsX1NlcGFyYXRpb25fUHVyaXR5X2FuZF9JZGVudGlmaWNhdGlvbl9UZWNobmlxdWVzLm00YSIsImlhdCI6MTc2NTQ3MDE0NiwiZXhwIjo1MjY1OTY2MTQ2fQ.geDywo9wENvXFpqYZ1yCGYjNsjMCvouczL2eLQ6QlR4",
    "Experimental Techniques": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Chemical_Separation_Purity_and_Identification_Techniques.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL0NoZW1pY2FsX1NlcGFyYXRpb25fUHVyaXR5X2FuZF9JZGVudGlmaWNhdGlvbl9UZWNobmlxdWVzLm00YSIsImlhdCI6MTc2NTQ3MDE0NiwiZXhwIjo1MjY1OTY2MTQ2fQ.geDywo9wENvXFpqYZ1yCGYjNsjMCvouczL2eLQ6QlR4",

    # 3. Electrochemistry / Electrolysis
    "Electrochemistry": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Electrolysis_and_the_Four_Conductors.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL0VsZWN0cm9seXNpc19hbmRfdGhlX0ZvdXJfQ29uZHVjdG9ycy5tNGEiLCJpYXQiOjE3NjU0NzAxNjEsImV4cCI6NTI2NTk2NjE2MX0.sxl-oyxt64GLw0rRgQhgPKFb_16ofMBqV9PYg7oomKI",
    "Electrolysis": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Electrolysis_and_the_Four_Conductors.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL0VsZWN0cm9seXNpc19hbmRfdGhlX0ZvdXJfQ29uZHVjdG9ycy5tNGEiLCJpYXQiOjE3NjU0NzAxNjEsImV4cCI6NTI2NTk2NjE2MX0.sxl-oyxt64GLw0rRgQhgPKFb_16ofMBqV9PYg7oomKI",

    # 4. Organic Chemistry
    "Organic Chemistry": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/How_Carbon_Builds_Life_and_Plastic.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL0hvd19DYXJib25fQnVpbGRzX0xpZmVfYW5kX1BsYXN0aWMubTRhIiwiaWF0IjoxNzY1NDcwMTgxLCJleHAiOjUyNjU5NjYxODF9.1YqEZUZcHLpPBF-7BVuPje_OfMv65EU_FQNFpF0h8nc",

    # 5. Chemical Bonding
    "Chemical Bonding": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Ionic_Covalent_and_Metallic_Bonding_Explained.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL0lvbmljX0NvdmFsZW50X2FuZF9NZXRhbGxpY19Cb25kaW5nX0V4cGxhaW5lZC5tNGEiLCJpYXQiOjE3NjU0NzAyMjAsImV4cCI6NTI2NTk2NjIyMH0.g9uIb2Bt8YQojNsXSBHaUuqpBVZ60o-9Y6sXIDdIbb8",

    # 6. States of Matter / Particulate Nature of Matter
    "States of Matter": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Kinetic_Theory_States_of_Matter_Explained.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL0tpbmV0aWNfVGhlb3J5X1N0YXRlc19vZl9NYXR0ZXJfRXhwbGFpbmVkLm00YSIsImlhdCI6MTc2NTQ3MDI0MiwiZXhwIjo1MjY1OTY2MjQyfQ._HXh5bEmEzGe8jd34j8GoO4I9HOK40iIswemyI5O5sM",
    "Particulate Nature of Matter": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Kinetic_Theory_States_of_Matter_Explained.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL0tpbmV0aWNfVGhlb3J5X1N0YXRlc19vZl9NYXR0ZXJfRXhwbGFpbmVkLm00YSIsImlhdCI6MTc2NTQ3MDI0MiwiZXhwIjo1MjY1OTY2MjQyfQ._HXh5bEmEzGe8jd34j8GoO4I9HOK40iIswemyI5O5sM",

    # 7. Chemical Reactions
    "Chemical Reactions": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Measuring_and_Controlling_Chemical_Reaction_Rates.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL01lYXN1cmluZ19hbmRfQ29udHJvbGxpbmdfQ2hlbWljYWxfUmVhY3Rpb25fUmF0ZXMubTRhIiwiaWF0IjoxNzY1NDcxMDA2LCJleHAiOjUyNjU5NjcwMDZ9.om3jfafEvzF08-sylkgXd4Onr7T2fK_M2aRgLlnmf1E",

    # 8. Redox Reactions
    "Redox Reactions": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Oxidation_Reduction_The_Universal_Chemistry_Rule%20(1).m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL094aWRhdGlvbl9SZWR1Y3Rpb25fVGhlX1VuaXZlcnNhbF9DaGVtaXN0cnlfUnVsZSAoMSkubTRhIiwiaWF0IjoxNzY1NDcxMDM0LCJleHAiOjUyNjU5NjcwMzR9.TvxrOLfAF5O_sdTDXsakebHvskCt1myAMthONa4svx0",

    # 9. Chemistry of the Environment
    "Chemistry of the Environment": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Proving_Water_Identity_and_Purity.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL1Byb3ZpbmdfV2F0ZXJfSWRlbnRpdHlfYW5kX1B1cml0eS5tNGEiLCJpYXQiOjE3NjU0NzEwNzMsImV4cCI6NTI2NTk2NzA3M30.6DzLpihrabU9gIwrwYr9bppQlg2nZlWqNaCADVwNirY",
    "Chemistry of Environment": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Proving_Water_Identity_and_Purity.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL1Byb3ZpbmdfV2F0ZXJfSWRlbnRpdHlfYW5kX1B1cml0eS5tNGEiLCJpYXQiOjE3NjU0NzEwNzMsImV4cCI6NTI2NTk2NzA3M30.6DzLpihrabU9gIwrwYr9bppQlg2nZlWqNaCADVwNirY",

    # 10. Non-metals
    "Non-metals": "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Why_Non-Metals_Rule_the_World.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL1doeV9Ob24tTWV0YWxzX1J1bGVfdGhlX1dvcmxkLm00YSIsImlhdCI6MTc2NTQ3MTA5NCwiZXhwIjo1MjY1OTY3MDk0fQ.gyP9bkFB1aeunr7wuMTdikPOTBY7Qh_RSqI6I4tq2kI",
}

def run_update():
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        updated = False
        print("Starting audio update...")

        for topic, url in audio_mappings.items():
            print(f"Processing: {topic}")
            key_pattern = re.compile(rf'"{re.escape(topic)}":\s*{{')
            match = key_pattern.search(content)
            
            if not match:
                print("  Topic not found.")
                continue
            
            start_index = match.end()
            
            # Check for existing audioUrl (to update it)
            # Use search in the next few blocks
            topic_tuple_pattern = re.compile(rf'(topic:\s*"{re.escape(topic)}",)')
            topic_tuple_match = topic_tuple_pattern.search(content, start_index)
            
            if topic_tuple_match:
                insertion_point = topic_tuple_match.end()
                next_chunk = content[insertion_point:insertion_point+1000]
                
                audio_url_pattern = re.compile(r'\s*audioUrl:\s*"[^"]*",?')
                existing_audio_search = audio_url_pattern.search(next_chunk)
                
                new_line = f'\n        audioUrl: "{url}",'
                
                if existing_audio_search:
                     print("  Updating existing audioUrl...")
                     # Be careful to replace ONLY if it belongs to this topic
                     # The regex search matches the FIRST occurrence.
                     # If the next topic starts before the match, we might be editing the next topic.
                     # We check if there is a "}, " before the match?
                     # A safer heuristic: is the match start reasonable?
                     
                     abs_match_start = insertion_point + existing_audio_search.start()
                     abs_match_end = insertion_point + existing_audio_search.end()
                     
                     content = content[:abs_match_start] + new_line.strip() + "," + content[abs_match_end:]
                     updated = True
                else:
                    print("  Inserting new audioUrl...")
                    content = content[:insertion_point] + new_line + content[insertion_point:]
                    updated = True
            else:
                print("  Key line topic not found inside block.")
        
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
