#!/usr/bin/env python3
"""
Script to analyze notes files and find topics missing audio or video URLs
"""
import re
import os

# Define the files to check
notes_files = [
    'NerdXApp/src/data/aLevelPhysics/notes.ts',
    'NerdXApp/src/data/aLevelBiology/notes.ts',
    'NerdXApp/src/data/aLevelChemistry/notes.ts',
    'NerdXApp/src/data/aLevelPureMath/notes.ts',
    'NerdXApp/src/data/oLevelMath/notes.ts',
    'NerdXApp/src/data/scienceNotes/chemistry.ts',
    'NerdXApp/src/data/scienceNotes/biology.ts',
    'NerdXApp/src/data/scienceNotes/physics.ts',
]

def analyze_notes_file(filepath):
    """Analyze a notes file for topics missing audio/video URLs"""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract subject name from filepath
    subject = filepath.split('/')[-2]
    if 'aLevel' in subject:
        subject = subject.replace('aLevel', 'A-Level ')
    elif 'oLevel' in subject:
        subject = subject.replace('oLevel', 'O-Level ')
    
    # Find topic keys - patterns like: "Physical Quantities and Units": {
    # or 'Physical Quantities and Units': {
    topic_pattern = r'["\']([^"\']+)["\']\s*:\s*\{\s*\n?\s*topic:'
    
    topics = []
    for match in re.finditer(topic_pattern, content):
        topic_name = match.group(1)
        start_pos = match.start()
        topics.append({
            'name': topic_name,
            'start': start_pos
        })
    
    # For each topic, check if it has audioUrl and videoUrl 
    missing_audio = []
    missing_video = []
    
    for i, topic in enumerate(topics):
        # Get the section of content from this topic to the next
        start = topic['start']
        if i + 1 < len(topics):
            end = topics[i + 1]['start']
        else:
            end = len(content)
        
        section = content[start:end]
        
        # Check for videoUrl with actual content
        video_match = re.search(r'videoUrl:\s*["\']([^"\']*)["\']', section)
        audio_match = re.search(r'audioUrl:\s*["\']([^"\']*)["\']', section)
        
        has_real_video = video_match and video_match.group(1).strip() != '' and video_match.group(1).strip().startswith('http')
        has_real_audio = audio_match and audio_match.group(1).strip() != '' and audio_match.group(1).strip().startswith('http')
        
        if not has_real_audio:
            audio_val = audio_match.group(1) if audio_match else 'NOT FOUND'
            missing_audio.append(f"{topic['name']}")
        if not has_real_video:
            video_val = video_match.group(1) if video_match else 'NOT FOUND'
            missing_video.append(f"{topic['name']}")
    
    return {
        'subject': subject,
        'filepath': filepath,
        'total_topics': len(topics),
        'missing_audio': missing_audio,
        'missing_video': missing_video,
        'audio_count': len(topics) - len(missing_audio),
        'video_count': len(topics) - len(missing_video)
    }

def main():
    print("=" * 80)
    print("NOTES ANALYSIS: Topics Missing Audio/Video URLs")
    print("=" * 80)
    
    all_results = []
    
    for filepath in notes_files:
        if os.path.exists(filepath):
            result = analyze_notes_file(filepath)
            all_results.append(result)
            
            print(f"\n{'=' * 60}")
            print(f"Subject: {result['subject']}")
            print(f"File: {result['filepath']}")
            print(f"{'=' * 60}")
            print(f"Total Topics: {result['total_topics']}")
            print(f"Topics with Audio: {result['audio_count']} | Missing: {len(result['missing_audio'])}")
            print(f"Topics with Video: {result['video_count']} | Missing: {len(result['missing_video'])}")
            
            if result['missing_audio']:
                print(f"\n[AUDIO] MISSING AUDIO ({len(result['missing_audio'])} topics):")
                for i, topic in enumerate(result['missing_audio'], 1):
                    print(f"   {i}. {topic}")
            
            if result['missing_video']:
                print(f"\n[VIDEO] MISSING VIDEO ({len(result['missing_video'])} topics):")
                for i, topic in enumerate(result['missing_video'], 1):
                    print(f"   {i}. {topic}")
        else:
            print(f"\n[WARNING] File not found: {filepath}")
    
    # Summary
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    
    total_missing_audio = sum(len(r['missing_audio']) for r in all_results)
    total_missing_video = sum(len(r['missing_video']) for r in all_results)
    total_topics = sum(r['total_topics'] for r in all_results)
    
    print(f"Total Topics Across All Subjects: {total_topics}")
    print(f"Total Topics Missing Audio: {total_missing_audio}")
    print(f"Total Topics Missing Video: {total_missing_video}")

if __name__ == '__main__':
    main()
