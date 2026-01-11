import re
import json

# All 24 A Level Physics topic names
topics = [
    "Physical Quantities and Units",
    "Kinematics",
    "Dynamics",
    "Forces, Density, and Pressure",
    "Work, Energy, and Power",
    "Deformation of Solids",
    "Waves",
    "Superposition",
    "Electricity",
    "D.C. Circuits",
    "Particle Physics",
    "Motion in a Circle",
    "Gravitational Fields",
    "Temperature",
    "Ideal Gases",
    "Thermodynamics",
    "Oscillations",
    "Electric Fields",
    "Capacitance",
    "Magnetic Fields",
    "Alternating Currents",
    "Quantum Physics",
    "Nuclear Physics",
    "Astronomy and Cosmology"
]

# Read the notes file
with open(r'c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\NerdXApp\src\data\aLevelPhysics\notes.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all video and audio URLs
video_pattern = r'videoUrl:\s*"(https://[^"]+)"'
audio_pattern = r'audioUrl:\s*"(https://[^"]+)"'

videos = re.findall(video_pattern, content)
audios = re.findall(audio_pattern, content)

print(f"Found {len(videos)} video URLs")
print(f"Found {len(audios)} audio URLs")
print()

# Extract filenames from URLs
def get_filename(url):
    # Extract the filename from the URL (between last / and ?)
    match = re.search(r'/([^/]+)\.(mp4|m4a)\?', url)
    if match:
        return match.group(1)
    return ""

# Create mapping
video_files = {}
for url in videos:
    filename = get_filename(url)
    if filename:
        video_files[filename] = url

audio_files = {}
for url in audios:
    filename = get_filename(url)
    if filename:
        audio_files[filename] = url

print("VIDEO FILES:")
for filename in sorted(video_files.keys()):
    print(f"  {filename}")
print()

print("AUDIO FILES:")
for filename in sorted(audio_files.keys()):
    print(f"  {filename}")
print()

# Intelligent matching function
def match_to_topic(filename, topic_name):
    """Calculate similarity score between filename and topic name"""
    filename_lower = filename.lower().replace('_', ' ').replace('-', ' ')
    topic_lower = topic_name.lower()
    
    # Normalize common variations
    filename_lower = filename_lower.replace('a level', '').replace('physics', '').strip()
    
    # Keywords matching
    topic_keywords = topic_lower.split()
    score = 0
    
    for keyword in topic_keywords:
        if len(keyword) > 3:  # Ignore short words
            if keyword in filename_lower:
                score += 10
    
    # Exact substring match
    if topic_lower in filename_lower or filename_lower in topic_lower:
        score += 50
        
    return score

# Match videos to topics
print("=" * 80)
print("INTELLIGENT MATCHING:")
print("=" * 80)
print()

matched_videos = {}
matched_audios = {}

for topic in topics:
    best_video = None
    best_video_score = 0
    best_audio = None
    best_audio_score = 0
    
    # Find best video match
    for filename, url in video_files.items():
        score = match_to_topic(filename, topic)
        if score > best_video_score:
            best_video_score = score
            best_video = (filename, url)
    
    # Find best audio match
    for filename, url in audio_files.items():
        score = match_to_topic(filename, topic)
        if score > best_audio_score:
            best_audio_score = score
            best_audio = (filename, url)
    
    print(f"Topic: {topic}")
    if best_video and best_video_score > 5:
        print(f"  VIDEO: {best_video[0]} (score: {best_video_score})")
        matched_videos[topic] = best_video[1]
    else:
        print(f"  VIDEO: No good match found")
    
    if best_audio and best_audio_score > 5:
        print(f"  AUDIO: {best_audio[0]} (score: {best_audio_score})")
        matched_audios[topic] = best_audio[1]
    else:
        print(f"  AUDIO: No good match found")
    print()

# Save results to JSON for easy use
results = {}
for topic in topics:
    results[topic] = {
        "videoUrl": matched_videos.get(topic),
        "audioUrl": matched_audios.get(topic)
    }

with open(r'c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\matched_urls.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)

print("=" * 80)
print("Results saved to matched_urls.json")
print("=" * 80)
