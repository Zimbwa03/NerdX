#!/usr/bin/env python3
"""
Populate Movement In and Out of Cells notes
Second Biology topic for ZIMSEC Combined Science
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.science_notes_service import ScienceNotesService

def create_movement_notes():
    """Create comprehensive notes for Movement In and Out of Cells"""
    
    diagrams_base = "/static/notes/biology/movement/"
    
    notes_data = {
        "topic": "Movement In and Out of Cells",
        "subject": "Biology",
        "summary": "Cells need to exchange substances with their environment. This topic covers the three main processes by which substances move in and out of cells: diffusion, osmosis, and active transport.",
        "sections": [
            {
                "title": "1. Introduction to Cell Transport",
                "content": """## Why Do Substances Move?

Cells constantly exchange materials with their surroundings:
- **Nutrients** must enter cells (glucose, oxygen, minerals)
- **Waste products** must leave cells (carbon dioxide, urea)
- **Water** must be regulated for cell function

### The Cell Membrane

The **cell membrane** (also called cell surface membrane) is:
- **Partially permeable** (or selectively permeable)
- Allows some substances to pass through
- Blocks other substances
- Controls what enters and leaves the cell

### Three Main Processes:

1. **Diffusion** - Movement down a concentration gradient (passive)
2. **Osmosis** - Movement of water across a membrane (passive)
3. **Active Transport** - Movement against a concentration gradient (requires energy)
""",
                "diagrams": [],
                "subsections": []
            },
            {
                "title": "2. Diffusion",
                "content": """## What is Diffusion?

**Diffusion** is the net movement of particles (molecules or ions) from a region of **higher concentration** to a region of **lower concentration**, down a **concentration gradient**.

### Key Features:

- **Passive process** - No energy required
- **Random movement** - Due to kinetic energy of particles
- **Down a gradient** - From high to low concentration
- **Continues until equilibrium** - Equal concentration everywhere

### Examples of Diffusion:

**In Living Organisms:**
1. **Oxygen** diffuses into cells for respiration
2. **Carbon dioxide** diffuses out of cells (waste product)
3. **Nutrients** (glucose, amino acids) diffuse into cells
4. **Perfume** spreading in a room
5. **Food coloring** spreading in water

**In the Body:**
- Oxygen diffuses from alveoli (air sacs) into blood
- Carbon dioxide diffuses from blood into alveoli
- Digested food diffuses from small intestine into blood

### Factors Affecting Rate of Diffusion:

**1. Concentration Gradient**
- Steeper gradient = Faster diffusion
- Greater difference in concentration = Faster rate

**2. Temperature**
- Higher temperature = More kinetic energy
- Particles move faster = Faster diffusion

**3. Surface Area**
- Larger surface area = More diffusion
- Example: Alveoli have large surface area

**4. Distance**
- Shorter distance = Faster diffusion
- Example: Alveoli walls are very thin (one cell thick)

### Adaptations for Efficient Diffusion:

**Alveoli (Lungs):**
- Large surface area (millions of air sacs)
- Thin walls (one cell thick)
- Moist surface
- Good blood supply (maintains gradient)

**Small Intestine:**
- Villi increase surface area
- Thin walls
- Good blood supply

**Root Hair Cells:**
- Long extensions increase surface area
- Thin cell walls
""",
                "diagrams": [f"{diagrams_base}diffusion_diagram.png"],
                "subsections": []
            },
            {
                "title": "3. Osmosis",
                "content": """## What is Osmosis?

**Osmosis** is the net movement of **water molecules** from a region of **higher water potential** (dilute solution) to a region of **lower water potential** (concentrated solution), through a **partially permeable membrane**.

### Key Features:

- **Special type of diffusion** - Only water molecules
- **Passive process** - No energy required
- **Requires a membrane** - Partially permeable
- **Water potential** - Measure of water concentration

### Understanding Water Potential:

- **Pure water** = Highest water potential
- **Dilute solution** = High water potential (lots of water)
- **Concentrated solution** = Low water potential (less water)
- Water moves from high → low water potential

### Osmosis in Plant Cells:

**1. Plant Cell in DILUTE Solution (Pure Water):**
- Water enters cell by osmosis
- Vacuole swells
- Cell becomes **TURGID** (firm, swollen)
- Cell wall prevents bursting
- **Turgor pressure** supports plant

**2. Plant Cell in ISOTONIC Solution:**
- No net movement of water
- Cell is **FLACCID** (limp)
- Plant wilts

**3. Plant Cell in CONCENTRATED Solution:**
- Water leaves cell by osmosis
- Cytoplasm shrinks
- Cell membrane pulls away from cell wall
- Cell becomes **PLASMOLYZED**
- Plant wilts severely

### Osmosis in Animal Cells:

**Animal cells have NO cell wall**, so:

**In Dilute Solution:**
- Water enters by osmosis
- Cell swells
- Cell may **BURST** (lysis)

**In Concentrated Solution:**
- Water leaves by osmosis
- Cell shrinks
- Cell becomes **CRENATED** (shriveled)

### Importance of Osmosis:

1. **Water uptake** by root hair cells
2. **Support in plants** (turgor pressure)
3. **Opening and closing** of stomata
4. **Kidney function** (water reabsorption)
5. **Red blood cells** must be in correct solution
""",
                "diagrams": [f"{diagrams_base}osmosis_diagram.png"],
                "subsections": []
            },
            {
                "title": "4. Active Transport",
                "content": """## What is Active Transport?

**Active transport** is the movement of particles from a region of **lower concentration** to a region of **higher concentration**, **against the concentration gradient**, using **energy from respiration**.

### Key Features:

- **Active process** - Requires energy (ATP)
- **Against the gradient** - From low to high concentration
- **Uses carrier proteins** - In cell membrane
- **Selective** - Specific substances transported

### How Active Transport Works:

1. Substance binds to **carrier protein** in membrane
2. **Energy (ATP)** from respiration is used
3. Carrier protein **changes shape**
4. Substance is moved **across membrane**
5. Substance is released on other side

### Why is Active Transport Needed?

Sometimes cells need to:
- **Absorb substances** that are in low concentration outside
- **Accumulate substances** to higher concentration than surroundings
- **Move substances uphill** against the gradient

### Examples of Active Transport:

**1. Root Hair Cells:**
- Absorb mineral ions (nitrates, phosphates) from soil
- Soil has LOW concentration of minerals
- Root cells have HIGH concentration
- Active transport moves minerals INTO roots

**2. Small Intestine:**
- Absorb glucose and amino acids into blood
- When concentration in gut is LOW
- Active transport ensures all nutrients absorbed

**3. Nerve Cells:**
- Maintain sodium-potassium balance
- Sodium pumped OUT, potassium pumped IN
- Essential for nerve impulses

**4. Kidney Tubules:**
- Reabsorb glucose from filtrate
- All glucose must be reabsorbed

### Comparison: Diffusion vs Active Transport

| Feature | Diffusion | Active Transport |
|---------|-----------|------------------|
| **Energy** | No energy needed | Requires ATP |
| **Direction** | High → Low concentration | Low → High concentration |
| **Gradient** | Down gradient | Against gradient |
| **Speed** | Can be slow | Usually faster |
| **Proteins** | Not always needed | Requires carrier proteins |
| **Examples** | O₂, CO₂ exchange | Mineral absorption |
""",
                "diagrams": [f"{diagrams_base}active_transport_diagram.png"],
                "subsections": []
            },
            {
                "title": "5. Comparing All Three Processes",
                "content": """## Summary Comparison Table

| Process | What Moves | Direction | Energy | Membrane Needed |
|---------|-----------|-----------|--------|-----------------|
| **Diffusion** | Any particles | High → Low | No (passive) | No (but faster with) |
| **Osmosis** | Water only | High → Low water potential | No (passive) | Yes (partially permeable) |
| **Active Transport** | Specific particles | Low → High | Yes (ATP) | Yes (with proteins) |

### When Each Process is Used:

**Diffusion:**
- Gas exchange (O₂ and CO₂)
- Nutrient absorption (when concentration is high)
- Waste removal

**Osmosis:**
- Water absorption by roots
- Water balance in cells
- Kidney function

**Active Transport:**
- Mineral absorption by roots
- Glucose absorption (when concentration is low)
- Maintaining ion balance in nerve cells

### Real-World Applications:

**In Agriculture:**
- Understanding osmosis helps with watering plants
- Too much fertilizer can cause plasmolysis

**In Medicine:**
- IV drips must be isotonic (same concentration as blood)
- Dialysis uses diffusion to clean blood

**In Food Preservation:**
- Salt and sugar preserve food by osmosis
- Removes water from bacteria, killing them
""",
                "diagrams": [],
                "subsections": []
            }
        ],
        "key_points": [
            "Diffusion is the net movement of particles from high to low concentration (passive)",
            "Osmosis is the movement of water through a partially permeable membrane (passive)",
            "Active transport moves substances from low to high concentration using energy",
            "Diffusion rate increases with: steeper gradient, higher temperature, larger surface area, shorter distance",
            "Plant cells become turgid in dilute solutions and plasmolyzed in concentrated solutions",
            "Animal cells can burst in dilute solutions (no cell wall protection)",
            "Root hair cells use active transport to absorb minerals from soil",
            "Partially permeable membranes allow some substances through but not others",
            "Active transport requires energy from respiration (ATP) and carrier proteins",
            "Water moves from high water potential to low water potential during osmosis"
        ],
        "exam_tips": [
            "Always state the DIRECTION of movement (high to low OR low to high concentration)",
            "For osmosis, mention 'water molecules' and 'partially permeable membrane' - key words!",
            "Remember: Diffusion and osmosis are PASSIVE (no energy), active transport needs ENERGY",
            "Turgid = swollen/firm (plant in water), Plasmolyzed = shrunken (plant in salt solution)",
            "Don't confuse: Diffusion (any particles) vs Osmosis (water only)",
            "For factors affecting diffusion, give EXAMPLES (e.g., alveoli have large surface area)",
            "Active transport goes AGAINST the gradient - that's why it needs energy!",
            "Common mistake: Saying 'osmosis is diffusion of water' - it's more specific than that",
            "In exam diagrams, always label: concentration levels, direction of movement, membrane",
            "Real-life examples score marks: root hairs (active transport), lungs (diffusion)"
        ]
    }
    
    return notes_data

if __name__ == "__main__":
    service = ScienceNotesService()
    notes = create_movement_notes()
    success = service.save_topic_notes("Biology", "Movement In and Out of Cells", notes)
    
    if success:
        print("SUCCESS: Created notes for Movement In and Out of Cells")
        print(f"   - {len(notes['sections'])} sections")
        print(f"   - {len(notes['key_points'])} key points")
        print(f"   - {len(notes['exam_tips'])} exam tips")
    else:
        print("FAILED to create notes")
