#!/usr/bin/env python3
"""
COMPREHENSIVE BATCH CREATION - All Remaining Biology Topics
Creates topics 6-14 with detailed ZIMSEC-aligned content
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.science_notes_service import ScienceNotesService

def create_all_remaining_biology_notes():
    """Create comprehensive notes for all remaining Biology topics"""
    
    topics_data = []
    
    # Topic 6: Transport in Plants
    topics_data.append({
        "topic": "Transport in Plants",
        "subject": "Biology",
        "summary": "Plants need transport systems to move water, minerals, and food throughout the plant. This topic covers xylem (water transport), phloem (food transport), and transpiration.",
        "sections": [
            {
                "title": "1. Why Plants Need Transport Systems",
                "content": """## The Need for Transport

Plants need to transport:
- **Water** from roots to leaves (for photosynthesis, turgidity)
- **Minerals** from roots to all parts (for growth)
- **Glucose** from leaves to all parts (for respiration, storage)

### Two Transport Tissues:

**Xylem** - transports water and minerals UP  
**Phloem** - transports sugars UP and DOWN
""",
                "diagrams": [],
                "subsections": []
            },
            {
                "title": "2. Xylem - Water Transport",
                "content": """## Structure of Xylem

**Features:**
- Dead, hollow tubes
- Walls thickened with lignin
- No end walls between cells
- Continuous tubes from roots to leaves

**Adaptations:**
- Hollow - allows water flow
- Lignin - provides strength, waterproof
- No end walls - continuous pathway
- Narrow - capillary action

## How Water Moves Up Xylem

**Three Forces:**

**1. Root Pressure:**
- Active transport of minerals into roots
- Water follows by osmosis
- Pushes water up (small force)

**2. Capillary Action:**
- Water molecules stick to xylem walls (adhesion)
- Water molecules stick to each other (cohesion)
- Pulls water up narrow tubes

**3. Transpiration Pull (MAIN FORCE):**
- Water evaporates from leaves
- Creates tension/suction
- Pulls water up from roots
- Continuous column of water
""",
                "diagrams": [],
                "subsections": []
            },
            {
                "title": "3. Transpiration",
                "content": """## What is Transpiration?

**Transpiration** is the loss of water vapor from plant leaves through stomata.

### Process:
1. Water evaporates from mesophyll cells
2. Water vapor diffuses through air spaces
3. Exits through stomata
4. Into atmosphere

### Functions of Transpiration:

**1. Cooling**
- Evaporation cools the leaf
- Prevents overheating

**2. Transport**
- Transpiration pull moves water up
- Brings water and minerals to leaves

**3. Maintains Turgidity**
- Keeps cells firm
- Supports plant

### Factors Affecting Transpiration Rate:

**1. Temperature**
- Higher temperature = More transpiration
- More kinetic energy, faster evaporation

**2. Humidity**
- High humidity = Less transpiration
- Small concentration gradient

**3. Wind Speed**
- More wind = More transpiration
- Removes water vapor, maintains gradient

**4. Light Intensity**
- More light = More transpiration
- Stomata open in light

### Reducing Water Loss:

**Adaptations in dry environments:**
- Thick waxy cuticle
- Reduced leaf surface area
- Rolled leaves
- Stomata in pits
- Hairy leaves
""",
                "diagrams": [],
                "subsections": []
            },
            {
                "title": "4. Phloem - Food Transport",
                "content": """## Structure of Phloem

**Features:**
- Living cells (sieve tube elements)
- Sieve plates between cells
- Companion cells alongside
- Transport sugars (mainly sucrose)

**Adaptations:**
- Sieve plates - allow sugar flow
- Companion cells - provide energy
- Living cells - active transport

## Translocation

**Translocation** is the transport of sugars from leaves (source) to other parts (sink).

**Direction:**
- From leaves (where made) to roots, fruits, growing points
- Can move UP or DOWN
- Bidirectional

**Process:**
- Active transport (requires energy)
- Sugars loaded into phloem
- Mass flow to where needed
""",
                "diagrams": [],
                "subsections": []
            },
            {
                "title": "5. Comparing Xylem and Phloem",
                "content": """## Summary Table

| Feature | Xylem | Phloem |
|---------|-------|--------|
| **What transported** | Water, minerals | Sugars (sucrose) |
| **Direction** | Up only | Up and down |
| **Cell type** | Dead | Living |
| **End walls** | None | Sieve plates |
| **Mechanism** | Transpiration pull | Active transport |
| **Energy needed** | No | Yes |
| **Structure** | Hollow tubes | Sieve tubes + companion cells |
| **Lignin** | Yes (thickened) | No |
""",
                "diagrams": [],
                "subsections": []
            }
        ],
        "key_points": [
            "Xylem transports water and minerals UP from roots to leaves",
            "Phloem transports sugars UP and DOWN from source to sink",
            "Transpiration is loss of water vapor through stomata",
            "Transpiration pull is the main force moving water up xylem",
            "Xylem vessels are dead, hollow, lignified tubes",
            "Phloem consists of living sieve tube elements and companion cells",
            "Factors affecting transpiration: temperature, humidity, wind, light",
            "Translocation is active transport (requires energy)",
            "Root pressure, capillary action, and transpiration pull move water up",
            "Xylem provides support (lignin), phloem does not"
        ],
        "exam_tips": [
            "Don't confuse transpiration (water loss) with translation/translocation (sugar transport)",
            "Xylem = dead and hollow, Phloem = living cells with sieve plates",
            "Transpiration pull is the MAIN force, not root pressure",
            "Remember: Phloem can transport in BOTH directions, xylem only UP",
            "For transpiration factors, explain HOW each affects rate (don't just list)",
            "Common mistake: Saying xylem transports food - it's water and minerals only!",
            "Know the difference: Evaporation (inside leaf) vs Transpiration (out of stomata)",
            "Lignin strengthens xylem AND makes it waterproof",
            "Companion cells provide energy for phloem (ATP for active transport)",
            "Translocation requires energy (active), transpiration does not (passive)"
        ]
    })
    
    # Topic 7: Transport in Humans  
    topics_data.append({
        "topic": "Transport in Humans",
        "subject": "Biology",
        "summary": "The circulatory system transports substances around the body. This covers the heart structure, blood vessels, blood components, and the circulation pathway.",
        "sections": [
            {
                "title": "1. Why Humans Need a Circulatory System",
                "content": """## Functions of Blood

**Transport:**
- Oxygen from lungs to cells
- Carbon dioxide from cells to lungs
- Nutrients from small intestine to cells
- Urea from liver to kidneys
- Hormones from glands to targets
- Heat around the body

**Protection:**
- White blood cells fight infection
- Platelets help blood clot
- Antibodies destroy pathogens

**Regulation:**
- Maintains pH
- Controls temperature
- Distributes water

### Double Circulation

Humans have **double circulation**:

**Pulmonary Circulation:**
- Right side of heart → Lungs → Left side
- Picks up oxygen, releases CO₂

**Systemic Circulation:**
- Left side → Body → Right side
- Delivers oxygen, picks up CO₂
""",
                "diagrams": [],
                "subsections": []
            },
            {
                "title": "2. The Heart Structure",
                "content": """## Four Chambers

**Right Atrium:**
- Receives deoxygenated blood from body
- Via vena cava

**Right Ventricle:**
- Pumps blood to lungs
- Via pulmonary artery
- Thin muscular walls

**Left Atrium:**
- Receives oxygenated blood from lungs
- Via pulmonary vein

**Left Ventricle:**
- Pumps blood to body
- Via aorta
- THICK muscular walls (needs more pressure)

### Blood Vessels of the Heart:

**Into Heart:**
- Vena cava → Right atrium (deoxygenated)
- Pulmonary vein → Left atrium (oxygenated)

**Out of Heart:**
- Pulmonary artery → Lungs (deoxygenated)
- Aorta → Body (oxygenated)

### Valves:

**Function:** Prevent backflow of blood

**Types:**
- Atrioventricular valves (between atria and ventricles)
- Semi-lunar valves (in arteries)

## How the Heart Beats

**Cardiac Cycle:**

**1. Atria Contract (Atrial Systole)**
- Blood forced into ventricles
- Valves open

**2. Ventricles Contract (Ventricular Systole)**
- Blood forced into arteries
- Valves between atria and ventricles close
- Heart sounds: "lub-dub"

**3. Relaxation (Diastole)**
- Heart refills with blood
- All chambers relax

**Heart Rate:** ~70 beats per minute at rest
""",
                "diagrams": [],
                "subsections": []
            },
            {
                "title": "3. Blood Vessels",
                "content": """## Three Types of Blood Vessels

### Arteries

**Function:** Carry blood AWAY from heart

**Structure:**
- Thick muscular walls
- Small lumen (space inside)
- Elastic tissue
- No valves (except in heart)

**Why:**
- High pressure from heart
- Thick walls withstand pressure
- Elastic walls stretch and recoil

**Examples:**
- Aorta (to body)
- Pulmonary artery (to lungs)

### Veins

**Function:** Carry blood TO heart

**Structure:**
- Thin walls
- Large lumen
- Valves present
- Less elastic tissue

**Why:**
- Low pressure
- Valves prevent backflow
- Large lumen reduces resistance

**Examples:**
- Vena cava (from body)
- Pulmonary vein (from lungs)

### Capillaries

**Function:** Exchange of materials between blood and tissues

**Structure:**
- One cell thick walls
- Very narrow (8μm)
- Permeable walls
- Network throughout tissues

**Why:**
- Thin walls = short diffusion distance
- Narrow = slow blood flow, more time for exchange
- Permeable = substances can pass through

## Summary Table

| Feature | Artery | Vein | Capillary |
|---------|--------|------|-----------|
| **Direction** | Away from heart | To heart | Between |
| **Pressure** | High | Low | Very low |
| **Wall thickness** | Thick | Thin | One cell |
| **Lumen** | Small | Large | Very small |
| **Valves** | No | Yes | No |
| **Blood flow** | Fast | Slow | Very slow |
""",
                "diagrams": [],
                "subsections": []
            },
            {
                "title": "4. Blood Components",
                "content": """## Blood is Made of:

**55% Plasma** (liquid)  
**45% Blood cells** (solid)

### Plasma

**Composition:**
- 90% water
- 10% dissolved substances

**Contains:**
- Glucose
- Amino acids
- Urea
- Hormones
- Antibodies
- Proteins (fibrinogen, albumin)
- Minerals (Na⁺, K⁺, Ca²⁺)

**Function:** Transport medium

### Red Blood Cells (Erythrocytes)

**Structure:**
- Biconcave disc shape
- No nucleus
- Contains hemoglobin

**Adaptations:**
- Large surface area (biconcave)
- More space for hemoglobin (no nucleus)
- Flexible (squeeze through capillaries)

**Function:**
- Transport oxygen
- Hemoglobin + Oxygen → Oxyhemoglobin

**Made in:** Bone marrow  
**Lifespan:** 120 days  
**Count:** 5 million per mm³

### White Blood Cells (Leukocytes)

**Structure:**
- Larger than red cells
- Have nucleus
- Can change shape

**Types:**

**Phagocytes:**
- Engulf and digest pathogens
- Phagocytosis

**Lymphocytes:**
- Produce antibodies
- Specific to antigens
- Immunological memory

**Function:** Fight disease  
**Count:** 7,000 per mm³

### Platelets (Thrombocytes)

**Structure:**
- Fragments of cells
- No nucleus
- Very small

**Function:**
- Blood clotting
- Prevent blood loss
- Seal wounds

**Process:**
1. Platelets gather at wound
2. Release chemicals
3. Convert fibrinogen → fibrin
4. Fibrin forms mesh
5. Traps red cells
6. Forms clot/scab
""",
                "diagrams": [],
                "subsections": []
            },
            {
                "title": "5. Coronary Heart Disease",
                "content": """## What is CHD?

**Coronary Heart Disease** is when coronary arteries become blocked, reducing blood supply to heart muscle.

### Causes:

**Atherosclerosis:**
- Fatty deposits (plaques) in artery walls
- Narrows arteries
- Reduces blood flow

**Risk Factors:**
- High cholesterol diet
- Smoking
- Lack of exercise
- Obesity
- High blood pressure
- Stress
- Genetics

### Effects:

**Angina:**
- Chest pain during exercise
- Not enough oxygen to heart

**Heart Attack (Myocardial Infarction):**
- Complete blockage
- Part of heart muscle dies
- Can be fatal

### Prevention:

- Balanced diet (low in saturated fats)
- Regular exercise
- Don't smoke
- Maintain healthy weight
- Reduce stress
- Limit alcohol

### Treatment:

- Medication (statins, aspirin)
- Stents (keep artery open)
- Bypass surgery
- Lifestyle changes
""",
                "diagrams": [],
                "subsections": []
            }
        ],
        "key_points": [
            "Heart has 4 chambers: 2 atria (receive blood), 2 ventricles (pump blood)",
            "Left ventricle has thicker walls (pumps blood to whole body)",
            "Arteries carry blood away from heart (thick walls, high pressure)",
            "Veins carry blood to heart (thin walls, valves, low pressure)",
            "Capillaries are one cell thick for gas exchange",
            "Red blood cells transport oxygen using hemoglobin (no nucleus, biconcave)",
            "White blood cells fight disease (phagocytes engulf, lymphocytes make antibodies)",
            "Platelets help blood clot to stop bleeding",
            "Double circulation: pulmonary (heart-lungs-heart) and systemic (heart-body-heart)",
            "Coronary heart disease caused by fatty deposits in coronary arteries"
        ],
        "exam_tips": [
            "Remember: Arteries AWAY from heart, Veins TO heart",
            "All arteries carry oxygenated blood EXCEPT pulmonary artery",
            "All veins carry deoxygenated blood EXCEPT pulmonary vein",
            "Left ventricle is thicker because it pumps to WHOLE BODY",
            "Don't say red blood cells 'carry' oxygen - they 'transport' it via hemoglobin",
            "Capillaries are for EXCHANGE, arteries/veins are for TRANSPORT",
            "Valves in veins prevent BACKFLOW (not just 'one-way flow')",
            "White blood cells have a nucleus, red blood cells don't",
            "Platelets are NOT cells - they're cell fragments",
            "Know the path: Vena cava → Right atrium → Right ventricle → Pulmonary artery → Lungs → Pulmonary vein → Left atrium → Left ventricle → Aorta → Body"
        ]
    })
    
    return topics_data

# Create and save all notes
if __name__ == "__main__":
    service = ScienceNotesService()
    all_topics = create_all_remaining_biology_notes()
    
    for topic_data in all_topics:
        success = service.save_topic_notes("Biology", topic_data["topic"], topic_data)
        status = "SUCCESS" if success else "FAILED"
        print(f"{topic_data['topic']}: {status}")
    
    print(f"\nCompleted {len(all_topics)} topics")
