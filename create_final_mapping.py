import re
import json

# Read the current notes file to extract all URLs
with open(r'c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\NerdXApp\src\data\aLevelPhysics\notes.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all URLs with their filenames
video_pattern = r'videoUrl:\s*"(https://[^"]+)"'
audio_pattern = r'audioUrl:\s*"(https://[^"]+)"'

videos_raw = re.findall(video_pattern, content)
audios_raw = re.findall(audio_pattern, content)

# Create dictionaries mapping filenames to full URLs
def get_filename(url):
    match = re.search(r'/([^/]+)\.(mp4|m4a)\?', url)
    return match.group(1) if match else ""

video_urls = {get_filename(url): url for url in videos_raw}
audio_urls = {get_filename(url): url for url in audios_raw}

# Manual corrected mapping based on intelligent analysis + manual review
topic_media_mapping = {
    "Physical Quantities and Units": {
        "video": "Physical_Quantities_&_Units",
        "audio": "SI_Units_Vectors_and_Measurement_Uncertainty"
    },
    "Kinematics": {
        "video": "Kinematics__Physics_of_Motion",
        "audio": "Kinematics_Definitions_Graphs_and_SUVAT_Equations"
    },
    "Dynamics": {
        "video": None,  # No video available
        "audio": "F_equals_ma_and_Free_Body_Diagrams"
    },
    "Forces, Density, and Pressure": {
        "video": "A-Level_Physics__Force_&_Pressure",
        "audio": "Force_Density_and_Pressure_Exam_Mastery"
    },
    "Work, Energy, and Power": {
        "video": "Work,_Energy_&_Power",
        "audio": "A-Level_Physics_Work_Energy_Power_Definitions"
    },
    "Deformation of Solids": {
        "video": "Deformation_of_Solids",
        "audio": "Stress_Strain_and_Young_Modulus_Explained"
    },
    "Waves": {
        "video": None,  # No specific waves video
        "audio": "A-Level_Waves_Core_Physics_Study_Guide"
    },
    "Superposition": {
        "video": "A-Level_Physics__Superposition",
        "audio": "A-Level_Physics_Superposition_and_Waves_Revision"
    },
    "Electricity": {
        "video": None,  # No electricity video
        "audio": "A-Level_Electricity_Definitions_and_Equations"
    },
    "D.C. Circuits": {
        "video": "Mastering_DC_Circuits",
        "audio": "DC_Circuits_Charge_Laws_and_Errors"
    },
    "Particle Physics": {
        "video": "Particle_Physics__An_A-Level_Explainer",
        "audio": "Quarks_Leptons_and_Conservation_Laws"
    },
    "Motion in a Circle": {
        "video": "Motion_in_a_Circle",
        "audio": "Mastering_A-Level_Circular_Motion_Dynamics"
    },
    "Gravitational Fields": {
        "video": "A-Level_Physics__Gravitational_Fields",
        "audio": "Gravitational_Fields_Force_Energy_Orbits"
    },
    "Temperature": {
        "video": "Temperature_&_Thermal_Physics",
        "audio": "A-Level_Thermal_Physics_Syllabus_Shortcut"
    },
    "Ideal Gases": {
        "video": "A-Level_Physics__Ideal_Gases",
        "audio": "Kinetic_Theory_and_Ideal_Gas_Assumptions"
    },
    "Thermodynamics": {
        "video": "A-Level_Physics__Thermodynamics",
        "audio": "Thermodynamics_Heat_Work_and_Kinetic_Theory"
    },
    "Oscillations": {
        "video": "The_Physics_of_Oscillation",
        "audio": "Oscillations_Simple_Harmonic_Motion_Damping_Resonance"
    },
    "Electric Fields": {
        "video": "A-Level__Electric_Fields",
        "audio": "Electrostatics_Masterclass_Fields_Potential_Capacitance"
    },
    "Capacitance": {
        "video": None,  # No capacitance video - using Electric Fields video covers some
        "audio": "Electrostatics_Masterclass_Fields_Potential_Capacitance"  # Same audio covers both
    },
    "Magnetic Fields": {
        "video": None,  # No magnetic fields video available
        "audio": None   # No magnetic fields audio available
    },
    "Alternating Currents": {
        "video": None,  # No AC video available
        "audio": None   # No AC audio available
    },
    "Quantum Physics": {
        "video": None,  # No quantum video available
        "audio": None   # No quantum audio available
    },
    "Nuclear Physics": {
        "video": None,  # No nuclear video available
        "audio": None   # No nuclear audio available
    },
    "Astronomy and Cosmology": {
        "video": None,  # No astronomy video available
        "audio": None   # No astronomy audio available
    }
}

# Create final mapping with full URLs
final_mapping = {}
for topic, media in topic_media_mapping.items():
    final_mapping[topic] = {
        "videoUrl": video_urls.get(media["video"]) if media["video"] else None,
        "audioUrl": audio_urls.get(media["audio"]) if media["audio"] else None
    }

# Save to JSON
with open(r'c:\Users\GWENJE\Downloads\NerdX Antigravity\NerdX\physics_media_mapping_final.json', 'w', encoding='utf-8') as f:
    json.dump(final_mapping, f, indent=2)

# Print summary
print("FINAL MAPPING SUMMARY:")
print("=" * 80)
for topic, urls in final_mapping.items():
    print(f"\n{topic}:")
    if urls["videoUrl"]:
        print(f"  [YES] VIDEO")
    else:
        print(f"  [NO]  VIDEO")
    if urls["audioUrl"]:
        print(f"  [YES] AUDIO")
    else:
        print(f"  [NO]  AUDIO")

# Count stats
topics_with_video = sum(1 for urls in final_mapping.values() if urls["videoUrl"])
topics_with_audio = sum(1 for urls in final_mapping.values() if urls["audioUrl"])
topics_with_both = sum(1 for urls in final_mapping.values() if urls["videoUrl"] and urls["audioUrl"])

print("\n" + "=" * 80)
print(f"STATS:")
print(f"  Topics with video: {topics_with_video}/24")
print(f"  Topics with audio: {topics_with_audio}/24")
print(f"  Topics with both:  {topics_with_both}/24")
print("=" * 80)
print("Mapping saved to physics_media_mapping_final.json")
