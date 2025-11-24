#!/usr/bin/env python3
"""
Populate Cell Structure and Organisation notes
First Biology topic for ZIMSEC Combined Science
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.science_notes_service import ScienceNotesService

def create_cell_structure_notes():
    """Create comprehensive notes for Cell Structure and Organisation"""
    
    # Diagram paths (will be served from artifacts directory)
    diagrams_base = "/static/notes/biology/cell_structure/"
    
    notes_data = {
        "topic": "Cell Structure and Organisation",
        "subject": "Biology",
        "summary": "Cells are the basic functional units and building blocks of all living organisms. This topic explores the structure of plant and animal cells, their organelles, and how specialized cells are adapted for specific functions.",
        "sections": [
            {
                "title": "1. Introduction to Cells",
                "content": """## What is a Cell?

A **cell** is the smallest unit of life that can function independently and perform all the necessary functions of life. All living organisms are made up of one or more cells.

### Cell Theory

The cell theory states that:
1. All living organisms are composed of one or more cells
2. The cell is the basic unit of life
3. All cells arise from pre-existing cells

### Discovery of Cells

Cells were first discovered by **Robert Hooke** in 1665 when he observed cork under a microscope. He named them "cells" because they reminded him of small rooms (cells) in a monastery.

### Types of Organisms

- **Unicellular organisms**: Made of a single cell (e.g., bacteria, amoeba)
- **Multicellular organisms**: Made of many cells working together (e.g., humans, plants, animals)
""",
                "diagrams": [],
                "subsections": []
            },
            {
                "title": "2. Plant Cell Structure",
                "content": """## Structure of a Plant Cell

Plant cells have several distinct structures that enable them to carry out photosynthesis and provide structural support.

### Key Organelles in Plant Cells:

**1. Cell Wall**
- Made of cellulose (a carbohydrate)
- Provides structural support and protection
- Gives the cell a fixed, rectangular shape
- Fully permeable to water and dissolved substances

**2. Cell Membrane**
- Thin layer inside the cell wall
- Controls what enters and leaves the cell
- Selectively permeable

**3. Nucleus**
- Controls all cell activities
- Contains genetic material (DNA)
- Surrounded by a nuclear membrane

**4. Cytoplasm**
- Jelly-like substance filling the cell
- Site where many chemical reactions occur
- Contains dissolved nutrients and enzymes

**5. Chloroplasts**
- Contain chlorophyll (green pigment)
- Site of photosynthesis
- Convert light energy into chemical energy (glucose)

**6. Permanent Vacuole**
- Large, fluid-filled sac
- Contains cell sap (water, sugars, salts)
- Provides support by keeping the cell turgid
- Stores substances

**7. Mitochondria**
- Site of aerobic respiration
- Release energy from glucose
- Known as the "powerhouse" of the cell

**8. Starch Grains**
- Storage form of glucose
- Found in chloroplasts and cytoplasm
- Provide energy reserve
""",
                "diagrams": [f"{diagrams_base}plant_cell_structure.png"],
                "subsections": []
            },
            {
                "title": "3. Animal Cell Structure",
                "content": """## Structure of an Animal Cell

Animal cells are similar to plant cells but lack certain structures like cell walls and chloroplasts.

### Key Organelles in Animal Cells:

**1. Cell Membrane**
- Outer boundary of the cell
- Controls movement of substances in and out
- Flexible, allowing the cell to change shape

**2. Nucleus**
- Control center of the cell
- Contains chromosomes (genetic material)
- Directs all cell activities

**3. Cytoplasm**
- Gel-like substance
- Site of many metabolic reactions
- Contains organelles

**4. Mitochondria**
- Produce energy through respiration
- More numerous in active cells (e.g., muscle cells)

**5. Ribosomes**
- Site of protein synthesis
- Found free in cytoplasm or attached to membranes
- Very small organelles

### What Animal Cells DON'T Have:

- ❌ Cell wall
- ❌ Chloroplasts
- ❌ Large permanent vacuole
- ❌ Starch grains

Animal cells may have small, temporary vacuoles for storage.
""",
                "diagrams": [f"{diagrams_base}animal_cell_structure.png"],
                "subsections": []
            },
            {
                "title": "4. Comparing Plant and Animal Cells",
                "content": """## Similarities and Differences

### Similarities (Both Have):
✓ Cell membrane  
✓ Nucleus  
✓ Cytoplasm  
✓ Mitochondria  
✓ Ribosomes  

### Differences:

| Feature | Plant Cell | Animal Cell |
|---------|-----------|-------------|
| **Cell Wall** | Present (cellulose) | Absent |
| **Shape** | Fixed, rectangular | Irregular, can change |
| **Chloroplasts** | Present | Absent |
| **Vacuole** | Large, permanent | Small, temporary |
| **Storage** | Starch | Glycogen |
| **Nutrition** | Autotrophic (make own food) | Heterotrophic (consume food) |

### Why These Differences?

- **Plant cells** need:
  - Cell walls for support (no skeleton)
  - Chloroplasts for photosynthesis
  - Large vacuoles for water storage and support

- **Animal cells** need:
  - Flexibility to move
  - Ability to change shape
  - No photosynthesis (get food by eating)
""",
                "diagrams": [f"{diagrams_base}plant_vs_animal_cell.png"],
                "subsections": []
            },
            {
                "title": "5. Specialized Cells",
                "content": """## Cell Specialization

Cells become **specialized** (adapted) to perform specific functions. Their structure is related to their function.

### Examples of Specialized Cells:

**1. Red Blood Cells**
- **Function**: Transport oxygen
- **Adaptations**:
  - Biconcave disc shape (large surface area)
  - No nucleus (more space for hemoglobin)
  - Contains hemoglobin (binds oxygen)
  - Flexible (squeeze through capillaries)

**2. Nerve Cells (Neurons)**
- **Function**: Transmit electrical impulses
- **Adaptations**:
  - Long axon (carry signals over long distances)
  - Dendrites (receive signals from other neurons)
  - Myelin sheath (insulates and speeds up transmission)

**3. Muscle Cells**
- **Function**: Contract for movement
- **Adaptations**:
  - Elongated shape
  - Many mitochondria (provide energy)
  - Protein filaments (slide past each other to contract)

**4. Root Hair Cells**
- **Function**: Absorb water and minerals from soil
- **Adaptations**:
  - Long extension (increases surface area)
  - Thin cell wall (easy absorption)
  - Large vacuole (stores absorbed water)

**5. Palisade Cells**
- **Function**: Photosynthesis
- **Adaptations**:
  - Rectangular shape (packed tightly)
  - Many chloroplasts (maximum light absorption)
  - Located at top of leaf (receive most light)

**6. Sperm Cells**
- **Function**: Fertilize egg cell
- **Adaptations**:
  - Tail (flagellum) for swimming
  - Streamlined head
  - Many mitochondria (energy for swimming)
  - Acrosome (enzymes to penetrate egg)

**7. Egg Cells (Ova)**
- **Function**: Be fertilized, provide nutrients
- **Adaptations**:
  - Large size (contains food reserves)
  - Jelly coating (protection)
  - Haploid nucleus (half the chromosomes)

### Key Principle:
**Structure is related to function** - each specialized cell has features that help it do its job efficiently.
""",
                "diagrams": [f"{diagrams_base}specialized_cells.png"],
                "subsections": []
            },
            {
                "title": "6. Levels of Organisation",
                "content": """## From Cells to Organisms

In multicellular organisms, cells are organized into increasingly complex structures:

### The Hierarchy:

**Cell** → **Tissue** → **Organ** → **Organ System** → **Organism**

**1. Cell**
- Basic unit of life
- Example: Muscle cell

**2. Tissue**
- Group of similar cells working together
- Example: Muscle tissue (many muscle cells)

**3. Organ**
- Group of different tissues working together
- Example: Heart (muscle tissue, nerve tissue, blood tissue)

**4. Organ System**
- Group of organs working together
- Example: Circulatory system (heart, blood vessels, blood)

**5. Organism**
- Complete living thing
- Example: Human being

### Examples in Plants:

- **Cell**: Palisade cell
- **Tissue**: Palisade tissue
- **Organ**: Leaf
- **Organ System**: Shoot system
- **Organism**: Whole plant

### Examples in Animals:

- **Cell**: Nerve cell
- **Tissue**: Nervous tissue
- **Organ**: Brain
- **Organ System**: Nervous system
- **Organism**: Human
""",
                "diagrams": [],
                "subsections": []
            }
        ],
        "key_points": [
            "Cells are the basic units of life - all living things are made of cells",
            "Plant cells have cell walls, chloroplasts, and large vacuoles; animal cells do not",
            "Both plant and animal cells have a nucleus, cytoplasm, cell membrane, and mitochondria",
            "The nucleus controls cell activities and contains genetic material (DNA)",
            "Mitochondria are the site of respiration and release energy",
            "Chloroplasts (in plant cells only) are the site of photosynthesis",
            "Specialized cells have structures adapted to their specific functions",
            "Red blood cells have no nucleus and contain hemoglobin to carry oxygen",
            "Root hair cells have long extensions to increase surface area for absorption",
            "Cells → Tissues → Organs → Organ Systems → Organism"
        ],
        "exam_tips": [
            "Always draw clear, labeled diagrams of plant and animal cells - examiners love diagrams!",
            "Remember the differences: Plant cells have cell WALL, CHLOROPLASTS, and LARGE VACUOLE",
            "For specialized cells, always link STRUCTURE to FUNCTION (e.g., red blood cells have no nucleus = more space for hemoglobin)",
            "Practice drawing and labeling specialized cells - common exam question",
            "When comparing plant and animal cells, use a table to show similarities and differences clearly",
            "Know the levels of organization in order: Cell → Tissue → Organ → Organ System → Organism",
            "For microscope questions, remember: magnification = image size ÷ actual size",
            "Common mistake: Don't say animal cells have NO vacuoles - they have SMALL, TEMPORARY ones"
        ]
    }
    
    return notes_data

if __name__ == "__main__":
    # Create notes service
    service = ScienceNotesService()
    
    # Create notes data
    notes = create_cell_structure_notes()
    
    # Save to service
    success = service.save_topic_notes("Biology", "Cell Structure and Organisation", notes)
    
    if success:
        print("✅ Successfully created notes for Cell Structure and Organisation")
        print(f"   - {len(notes['sections'])} sections")
        print(f"   - {len(notes['key_points'])} key points")
        print(f"   - {len(notes['exam_tips'])} exam tips")
    else:
        print("❌ Failed to create notes")
