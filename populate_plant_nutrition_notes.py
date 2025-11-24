#!/usr/bin/env python3
"""
Populate Plant Nutrition notes - Fourth Biology topic
EXTREMELY DETAILED with comprehensive explanations
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.science_notes_service import ScienceNotesService

def create_plant_nutrition_notes():
    """Create comprehensive notes for Plant Nutrition"""
    
    diagrams_base = "/static/notes/biology/plant_nutrition/"
    
    notes_data = {
        "topic": "Plant Nutrition",
        "subject": "Biology",
        "summary": "Plants are autotrophs that make their own food through photosynthesis. This topic covers the process of photosynthesis, factors affecting it, leaf structure adaptations, and mineral requirements for healthy plant growth.",
        "sections": [
            {
                "title": "1. Introduction to Plant Nutrition",
                "content": """## What is Nutrition?

**Nutrition** is the process by which organisms obtain and use food for growth, energy, and repair.

### Two Types of Nutrition:

**1. Autotrophic Nutrition (Self-feeding)**
- Organisms make their OWN food
- Use simple inorganic substances
- Examples: Plants, algae, some bacteria
- Process: **Photosynthesis**

**2. Heterotrophic Nutrition (Other-feeding)**
- Organisms cannot make their own food
- Must consume other organisms
- Examples: Animals, fungi, most bacteria

### Why is Plant Nutrition Important?

Plants are **producers** in food chains:
- Provide food for all other organisms
- Produce oxygen for respiration
- Remove carbon dioxide from atmosphere
- Form the base of all ecosystems

Without plants:
- No food for animals
- No oxygen in atmosphere
- No life on Earth!

### What Plants Need:

**Raw Materials for Photosynthesis:**
1. **Carbon dioxide** (CO₂) - from air
2. **Water** (H₂O) - from soil
3. **Light energy** - from sun
4. **Chlorophyll** - green pigment in chloroplasts

**Products of Photosynthesis:**
1. **Glucose** (C₆H₁₂O₆) - food/energy
2. **Oxygen** (O₂) - released to air
""",
                "diagrams": [],
                "subsections": []
            },
            {
                "title": "2. Photosynthesis - The Process",
                "content": """## Definition

**Photosynthesis** is the process by which green plants make glucose (food) from carbon dioxide and water, using light energy absorbed by chlorophyll, and releasing oxygen as a by-product.

### Word Equation:

```
Carbon dioxide + Water  →  Glucose + Oxygen
    (from air)    (from soil)  (food)   (released)
```

### Chemical Equation:

```
6CO₂ + 6H₂O  →  C₆H₁₂O₆ + 6O₂
             light energy
             chlorophyll
```

### Breaking Down the Equation:

**Reactants (What's Needed):**
- **6CO₂** - 6 molecules of carbon dioxide
- **6H₂O** - 6 molecules of water
- **Light energy** - from the sun
- **Chlorophyll** - green pigment (catalyst)

**Products (What's Made):**
- **C₆H₁₂O₆** - 1 molecule of glucose (sugar)
- **6O₂** - 6 molecules of oxygen

### Where Does Photosynthesis Occur?

**Location: Chloroplasts**
- Found mainly in leaf cells
- Contain chlorophyll (green pigment)
- Absorb light energy
- Site of photosynthesis

**Specifically:**
- **Palisade mesophyll cells** - most photosynthesis
- Located at top of leaf
- Packed with chloroplasts
- Receive most light

### The Two Stages of Photosynthesis:

**Stage 1: Light-Dependent Reactions**
- Occur in chloroplast membranes
- Require light energy
- Water is split (photolysis)
- Oxygen is released
- Energy is captured

**Stage 2: Light-Independent Reactions (Calvin Cycle)**
- Occur in chloroplast stroma
- Don't directly need light
- Carbon dioxide is fixed
- Glucose is made
- Uses energy from Stage 1

### What Happens to the Glucose?

Glucose produced is used for:

**1. Respiration**
- Broken down to release energy
- Powers all life processes
- Occurs in mitochondria

**2. Storage**
- Converted to **starch** (insoluble)
- Stored in leaves, roots, stems, seeds
- Can be converted back to glucose when needed

**3. Making Other Substances**
- **Cellulose** - for cell walls
- **Proteins** - combined with nitrates
- **Fats and oils** - for seeds
- **Sucrose** - for transport in phloem

**4. Growth**
- Used to make new cells
- Build new tissues
- Increase plant size
""",
                "diagrams": [],
                "subsections": []
            },
            {
                "title": "3. Leaf Structure - Adaptations for Photosynthesis",
                "content": """## External Features of a Leaf

**Broad and Flat:**
- Large surface area
- Captures maximum light
- Allows CO₂ to enter easily

**Thin:**
- Short diffusion distance
- Light penetrates easily
- Gases diffuse quickly

**Green Color:**
- Contains chlorophyll
- Absorbs light energy
- Reflects green light (why we see green)

**Network of Veins:**
- Xylem brings water
- Phloem removes glucose
- Provides support

**Petiole (Leaf Stalk):**
- Holds leaf in position
- Allows movement toward light
- Contains vascular bundles

## Internal Structure of a Leaf

### Upper Epidermis:
- **Transparent** - allows light through
- **Single layer** - light penetrates easily
- **No chloroplasts** - doesn't block light
- **Waxy cuticle** on top - reduces water loss

### Palisade Mesophyll Layer:
- **Location**: Just below upper epidermis
- **Shape**: Tall, column-shaped cells
- **Packed tightly** together
- **MOST chloroplasts** - maximum photosynthesis
- **Receives most light**
- **Main site of photosynthesis**

### Spongy Mesophyll Layer:
- **Location**: Below palisade layer
- **Shape**: Irregular, loosely packed cells
- **Air spaces** between cells
- **Some chloroplasts** - some photosynthesis
- **Large surface area** for gas exchange
- **Allows CO₂ to reach all cells**

### Lower Epidermis:
- **Single layer** of cells
- **Contains stomata** (pores)
- **Guard cells** control stomata
- **Allows gas exchange**

### Stomata (singular: Stoma):
- **Tiny pores** in lower epidermis
- **Controlled by guard cells**
- **Functions**:
  - CO₂ enters for photosynthesis
  - O₂ exits (waste product)
  - Water vapor exits (transpiration)

### Guard Cells:
- **Kidney-shaped** cells
- **Contain chloroplasts**
- **Control stomata opening/closing**
- **Turgid** = stomata open (day)
- **Flaccid** = stomata closed (night)

### Vascular Bundles (Veins):
- **Xylem** - transports water and minerals UP
- **Phloem** - transports glucose DOWN
- **Support** - keeps leaf flat

## Why This Structure is Perfect:

| Adaptation | Function | Benefit |
|------------|----------|---------|
| **Broad, flat** | Large surface area | More light captured |
| **Thin** | Short distance | Fast diffusion |
| **Transparent epidermis** | Light passes through | Reaches palisade cells |
| **Palisade cells at top** | Receive most light | Maximum photosynthesis |
| **Many chloroplasts** | Absorb light | More photosynthesis |
| **Air spaces** | Gas circulation | CO₂ reaches all cells |
| **Stomata** | Gas exchange | CO₂ in, O₂ out |
| **Waxy cuticle** | Waterproof | Prevents water loss |
| **Veins** | Transport | Water in, glucose out |
""",
                "diagrams": [],
                "subsections": []
            },
            {
                "title": "4. Factors Affecting Photosynthesis",
                "content": """## Limiting Factors

A **limiting factor** is a factor that, when in short supply, limits the rate of photosynthesis.

### The Law of Limiting Factors:

"The rate of photosynthesis is limited by the factor that is in shortest supply."

Even if other factors are ideal, if ONE factor is limiting, photosynthesis will be slow.

## 1. Light Intensity

### Effect on Photosynthesis:

**Low Light Intensity:**
- Slow photosynthesis
- Less energy available
- Less glucose produced

**Increasing Light:**
- Faster photosynthesis
- More energy absorbed
- More glucose made

**High Light (with other factors limiting):**
- Rate plateaus (levels off)
- Light is no longer limiting
- Another factor becomes limiting

### Graph Pattern:
- Starts at origin (no light = no photosynthesis)
- Increases steeply
- Levels off (plateau)
- Another factor now limiting (CO₂ or temperature)

### Real-World Examples:
- Plants grow slowly in shade
- Greenhouses use artificial lights
- Underwater plants get less light (depth)

## 2. Carbon Dioxide Concentration

### Effect on Photosynthesis:

**Low CO₂ (0.04% in air):**
- Often the limiting factor
- Slow photosynthesis
- Not enough raw material

**Increasing CO₂:**
- Faster photosynthesis
- More raw material available
- More glucose produced

**High CO₂ (with other factors limiting):**
- Rate plateaus
- CO₂ no longer limiting
- Light or temperature becomes limiting

### Graph Pattern:
- Increases with CO₂ concentration
- Levels off at high concentrations
- Typical plateau at 0.1-0.4% CO₂

### Real-World Applications:
- Greenhouses pump in CO₂
- Increases crop yield
- Can increase to 0.1% (normal air is 0.04%)

## 3. Temperature

### Effect on Photosynthesis:

**Low Temperature (0-25°C):**
- Slow enzyme activity
- Slow photosynthesis
- Molecules move slowly

**Optimum Temperature (25-35°C):**
- Maximum enzyme activity
- Fastest photosynthesis
- Optimal molecular movement

**High Temperature (above 45°C):**
- Enzymes DENATURE
- Photosynthesis STOPS
- Chlorophyll damaged
- Irreversible damage

### Graph Pattern:
- Increases with temperature
- Peaks at optimum (25-35°C)
- Drops sharply above 45°C
- Bell-shaped curve

### Why Temperature Matters:
- Photosynthesis involves enzymes
- Enzymes control reaction rate
- Temperature affects enzyme activity
- Too hot = denaturation

### Real-World Applications:
- Greenhouses heated in winter
- Cooled in very hot weather
- Maintain optimum temperature
- Maximize crop growth

## 4. Water Availability

### Effect on Photosynthesis:

**Lack of Water:**
- Stomata close (prevent water loss)
- CO₂ cannot enter
- Photosynthesis slows/stops
- Plant wilts

**Adequate Water:**
- Stomata open
- CO₂ enters freely
- Photosynthesis proceeds
- Plant turgid

### Why Water is Usually NOT Limiting:
- Only small amount needed for photosynthesis
- Most water used for:
  - Keeping cells turgid
  - Transpiration
  - Transport
- Severe drought needed to limit photosynthesis

## 5. Chlorophyll Concentration

### Effect on Photosynthesis:

**More Chlorophyll:**
- More light absorbed
- Faster photosynthesis
- Leaves darker green

**Less Chlorophyll:**
- Less light absorbed
- Slower photosynthesis
- Leaves pale/yellow

### Factors Affecting Chlorophyll:

**Mineral Deficiencies:**
- **Magnesium** - needed to make chlorophyll
- Lack of Mg = yellow leaves (chlorosis)
- **Iron** - needed for chlorophyll synthesis

**Disease:**
- Virus infections
- Fungal infections
- Damage chloroplasts

**Variegated Leaves:**
- Some parts lack chlorophyll
- White/yellow patches
- Less photosynthesis

## Investigating Limiting Factors:

### Experimental Setup:

**To test light intensity:**
- Use lamp at different distances
- Measure oxygen bubbles produced
- Count bubbles per minute

**To test CO₂ concentration:**
- Add sodium hydrogencarbonate (releases CO₂)
- Different concentrations
- Measure oxygen production

**To test temperature:**
- Water bath at different temperatures
- Measure oxygen production
- Plot graph

### Measuring Photosynthesis Rate:

**Methods:**
1. **Count oxygen bubbles** from aquatic plant
2. **Measure volume of oxygen** collected
3. **Measure increase in biomass**
4. **Measure starch production** (iodine test)
""",
                "diagrams": [],
                "subsections": []
            },
            {
                "title": "5. Mineral Requirements",
                "content": """## Why Plants Need Minerals

Plants need minerals (in addition to C, H, O from photosynthesis) for:
- Making proteins
- Making chlorophyll
- Healthy growth
- Strong cell walls
- Enzyme production

### How Plants Get Minerals:

- Absorbed from **soil** by **roots**
- Dissolved in water
- Taken up by **active transport**
- Moved in **xylem** to all parts

## Important Minerals:

### 1. Nitrates (NO₃⁻)

**Used For:**
- Making **amino acids**
- Making **proteins**
- Making **DNA**
- Making **chlorophyll**

**Deficiency Symptoms:**
- **Stunted growth** (poor protein synthesis)
- **Yellow older leaves** (chlorosis)
- **Weak stems**
- **Poor root development**

**Why:**
- Proteins needed for growth
- Chlorophyll needed for photosynthesis
- Older leaves lose nitrogen first (moved to new growth)

### 2. Phosphates (PO₄³⁻)

**Used For:**
- Making **DNA** and **RNA**
- Making **ATP** (energy molecule)
- Making **cell membranes**
- **Root development**

**Deficiency Symptoms:**
- **Poor root growth**
- **Purple/dark green leaves**
- **Stunted growth**
- **Delayed maturity**

**Why:**
- DNA needed for cell division
- ATP needed for energy
- Affects overall growth

### 3. Potassium (K⁺)

**Used For:**
- **Enzyme activation**
- **Protein synthesis**
- **Opening/closing stomata**
- **Disease resistance**

**Deficiency Symptoms:**
- **Yellow leaf edges** (leaf margins)
- **Brown spots** on leaves
- **Weak stems**
- **Poor fruit/flower development**

**Why:**
- Enzymes need potassium to work
- Affects photosynthesis and respiration

### 4. Magnesium (Mg²⁺)

**Used For:**
- Making **chlorophyll**
- **Enzyme activation**

**Deficiency Symptoms:**
- **Yellow leaves** (chlorosis)
- **Green veins** (veins stay green)
- **Older leaves affected first**

**Why:**
- Magnesium is at center of chlorophyll molecule
- No Mg = no chlorophyll = no photosynthesis

### 5. Iron (Fe²⁺/Fe³⁺)

**Used For:**
- **Chlorophyll synthesis**
- **Enzyme production**

**Deficiency Symptoms:**
- **Yellow young leaves** (chlorosis)
- **Veins may stay green**
- **Youngest leaves affected first**

**Why:**
- Needed to make chlorophyll
- Young leaves can't make chlorophyll

## Summary Table:

| Mineral | Used For | Deficiency Symptom | Which Leaves |
|---------|----------|-------------------|--------------|
| **Nitrate** | Proteins, chlorophyll | Yellow leaves, stunted | Older first |
| **Phosphate** | DNA, ATP, membranes | Purple leaves, poor roots | All |
| **Potassium** | Enzymes, stomata | Yellow edges, brown spots | All |
| **Magnesium** | Chlorophyll | Yellow with green veins | Older first |
| **Iron** | Chlorophyll synthesis | Yellow young leaves | Younger first |

## Why Different Leaves Affected:

**Mobile Minerals (N, P, K, Mg):**
- Can be moved from old to new leaves
- **Older leaves** show deficiency first
- Plant "sacrifices" old leaves for new growth

**Immobile Minerals (Fe, Ca):**
- Cannot be moved once in place
- **Younger leaves** show deficiency first
- New growth can't get enough

## Fertilizers:

**Purpose:**
- Add minerals to soil
- Increase crop yield
- Replace minerals removed by crops

**Types:**
- **NPK fertilizers** - contain Nitrogen, Phosphorus, Potassium
- **Organic** - manure, compost
- **Inorganic** - chemical fertilizers

**Problems with Excess:**
- **Eutrophication** - fertilizer washes into water
- Algae bloom
- Oxygen depletion
- Fish die
""",
                "diagrams": [],
                "subsections": []
            },
            {
                "title": "6. Experiments and Practicals",
                "content": """## Testing for Photosynthesis

### 1. Testing a Leaf for Starch

**Aim:** To show that starch is produced during photosynthesis

**Method:**
1. **Destarch the plant**
   - Keep in dark for 24-48 hours
   - Uses up stored starch
   
2. **Expose to light**
   - Place in sunlight for several hours
   - Photosynthesis occurs
   
3. **Test for starch:**
   - Boil leaf in water (kills cells, softens)
   - Boil in ethanol (removes chlorophyll)
   - Rinse in water (softens again)
   - Add iodine solution
   
**Result:**
- **Blue-black color** = Starch present
- **Brown/orange** = No starch

**Conclusion:**
- Starch produced during photosynthesis
- Proves photosynthesis occurred

### 2. Testing for Oxygen Production

**Aim:** To show that oxygen is produced during photosynthesis

**Method:**
1. Use aquatic plant (e.g., Elodea, Hydrilla)
2. Place in water with sodium hydrogencarbonate (CO₂ source)
3. Invert funnel over plant
4. Collect gas in test tube
5. Test gas with glowing splint

**Result:**
- Bubbles rise from plant
- Gas collected
- **Glowing splint relights** = Oxygen

**Conclusion:**
- Oxygen is produced during photosynthesis

### 3. Investigating Light Intensity

**Aim:** To show light intensity affects photosynthesis rate

**Method:**
1. Set up aquatic plant in beaker
2. Place lamp at different distances (10cm, 20cm, 30cm, etc.)
3. Count oxygen bubbles per minute
4. Repeat 3 times, calculate average
5. Plot graph

**Variables:**
- **Independent**: Distance of lamp (light intensity)
- **Dependent**: Bubbles per minute (rate)
- **Control**: Temperature, CO₂ concentration, same plant

**Result:**
- More bubbles when lamp is closer
- Fewer bubbles when lamp is farther

**Conclusion:**
- Higher light intensity = faster photosynthesis

### 4. Investigating CO₂ Concentration

**Aim:** To show CO₂ concentration affects photosynthesis

**Method:**
1. Use aquatic plant
2. Add different amounts of sodium hydrogencarbonate
3. Count bubbles per minute
4. Plot graph

**Result:**
- More CO₂ = more bubbles
- Up to a point (then plateaus)

**Conclusion:**
- CO₂ concentration affects photosynthesis rate

### 5. Variegated Leaf Experiment

**Aim:** To show chlorophyll is needed for photosynthesis

**Method:**
1. Use variegated leaf (green and white parts)
2. Draw diagram showing green/white areas
3. Destarch plant
4. Expose to light
5. Test for starch

**Result:**
- **Green parts** = Blue-black (starch present)
- **White parts** = Brown (no starch)

**Conclusion:**
- Chlorophyll needed for photosynthesis
- Only green parts photosynthesize

### 6. Destarching Experiment

**Aim:** To show light is needed for photosynthesis

**Method:**
1. Cover part of leaf with aluminum foil
2. Expose plant to light
3. Test for starch

**Result:**
- **Uncovered part** = Blue-black (starch)
- **Covered part** = Brown (no starch)

**Conclusion:**
- Light is necessary for photosynthesis
""",
                "diagrams": [],
                "subsections": []
            }
        ],
        "key_points": [
            "Photosynthesis: CO₂ + H₂O → C₆H₁₂O₆ + O₂ (using light energy and chlorophyll)",
            "Plants are autotrophs - they make their own food through photosynthesis",
            "Chlorophyll in chloroplasts absorbs light energy for photosynthesis",
            "Palisade mesophyll cells contain most chloroplasts and do most photosynthesis",
            "Limiting factors: light intensity, CO₂ concentration, temperature (and water, chlorophyll)",
            "Glucose is used for respiration, stored as starch, or converted to cellulose, proteins, fats",
            "Stomata allow CO₂ to enter and O₂ to exit; controlled by guard cells",
            "Nitrate deficiency causes yellow older leaves and stunted growth",
            "Magnesium is needed to make chlorophyll; deficiency causes yellow leaves with green veins",
            "Leaves are adapted for photosynthesis: broad (large surface area), thin (short diffusion distance), many chloroplasts"
        ],
        "exam_tips": [
            "Always write the FULL photosynthesis equation with light energy and chlorophyll above the arrow",
            "For limiting factors, describe the graph pattern: increases then plateaus",
            "Remember: Enzymes are involved, so temperature affects photosynthesis (denaturation above 45°C)",
            "Leaf structure: Palisade cells at TOP (most light), spongy mesophyll has AIR SPACES (gas exchange)",
            "Mineral deficiencies: Nitrate = yellow OLDER leaves, Iron = yellow YOUNGER leaves",
            "Starch test: Boil in water, then ethanol, then add iodine (blue-black = positive)",
            "Don't say 'plants breathe in CO₂' - say 'CO₂ diffuses into leaf through stomata'",
            "Common mistake: Saying oxygen is a waste product - it's a BY-PRODUCT (useful for respiration)",
            "For practicals, always state: aim, method, result, conclusion",
            "Variegated leaf experiment proves chlorophyll is needed (only green parts make starch)"
        ]
    }
    
    return notes_data

if __name__ == "__main__":
    service = ScienceNotesService()
    notes = create_plant_nutrition_notes()
    success = service.save_topic_notes("Biology", "Plant Nutrition", notes)
    
    if success:
        print("SUCCESS: Created notes for Plant Nutrition")
        print(f"   - {len(notes['sections'])} sections")
        print(f"   - {len(notes['key_points'])} key points")
        print(f"   - {len(notes['exam_tips'])} exam tips")
    else:
        print("FAILED to create notes")
