// Biology Notes - All 14 Topics for ZIMSEC Combined Science
import { TopicNotes } from './types';

// List of all Biology topics (matching constants.py)
export const biologyTopics: string[] = [
    "Cell Structure and Organisation",
    "Movement In and Out of Cells",
    "Enzymes",
    "Plant Nutrition",
    "Animal Nutrition",
    "Transport in Plants",
    "Transport in Humans",
    "Respiration",
    "Excretion",
    "Coordination and Response",
    "Reproduction",
    "Organisms and Environment",
    "Human Influences on Ecosystem",
    "Classification"
];

// Complete notes for each Biology topic
export const biologyNotes: Record<string, TopicNotes> = {
    "Cell Structure and Organisation": {
        topic: "Cell Structure and Organisation",
        subject: "Biology",
        summary: "Cells are the basic functional units and building blocks of all living organisms. This topic explores the structure of plant and animal cells, their organelles, and how specialized cells are adapted for specific functions.",
        sections: [
            {
                title: "1. Introduction to Cells",
                content: `## What is a Cell?

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
- **Multicellular organisms**: Made of many cells working together (e.g., humans, plants, animals)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Plant Cell Structure",
                content: `## Structure of a Plant Cell

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
- Provide energy reserve`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Animal Cell Structure",
                content: `## Structure of an Animal Cell

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

Animal cells may have small, temporary vacuoles for storage.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Comparing Plant and Animal Cells",
                content: `## Similarities and Differences

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
  - No photosynthesis (get food by eating)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Specialized Cells",
                content: `## Cell Specialization

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
**Structure is related to function** - each specialized cell has features that help it do its job efficiently.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Levels of Organisation",
                content: `## From Cells to Organisms

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
- **Organism**: Human`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
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
        exam_tips: [
            "Always draw clear, labeled diagrams of plant and animal cells - examiners love diagrams!",
            "Remember the differences: Plant cells have cell WALL, CHLOROPLASTS, and LARGE VACUOLE",
            "For specialized cells, always link STRUCTURE to FUNCTION (e.g., red blood cells have no nucleus = more space for hemoglobin)",
            "Practice drawing and labeling specialized cells - common exam question",
            "When comparing plant and animal cells, use a table to show similarities and differences clearly",
            "Know the levels of organization in order: Cell → Tissue → Organ → Organ System → Organism",
            "For microscope questions, remember: magnification = image size ÷ actual size",
            "Common mistake: Don't say animal cells have NO vacuoles - they have SMALL, TEMPORARY ones"
        ]
    },

    "Movement In and Out of Cells": {
        topic: "Movement In and Out of Cells",
        subject: "Biology",
        summary: "Cells need to exchange substances with their environment. This topic covers the three main processes by which substances move in and out of cells: diffusion, osmosis, and active transport.",
        sections: [
            {
                title: "1. Introduction to Cell Transport",
                content: `## Why Do Substances Move?

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
3. **Active Transport** - Movement against a concentration gradient (requires energy)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Diffusion",
                content: `## What is Diffusion?

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
- Thin cell walls`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Osmosis",
                content: `## What is Osmosis?

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
5. **Red blood cells** must be in correct solution`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Active Transport",
                content: `## What is Active Transport?

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
| **Examples** | O₂, CO₂ exchange | Mineral absorption |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Comparing All Three Processes",
                content: `## Summary Comparison Table

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
- Removes water from bacteria, killing them`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
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
        exam_tips: [
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
    },

    "Enzymes": {
        topic: "Enzymes",
        subject: "Biology",
        summary: "Enzymes are biological catalysts that speed up chemical reactions in living organisms. They are proteins with specific shapes that allow them to catalyze particular reactions without being used up.",
        sections: [
            {
                title: "1. What are Enzymes?",
                content: `## Definition

**Enzymes** are biological catalysts made of protein that speed up chemical reactions in living organisms without being changed or used up themselves.

### Key Features:

- **Biological** - Found in living things
- **Catalysts** - Speed up reactions
- **Proteins** - Made of amino acids
- **Specific** - Each enzyme catalyzes one type of reaction
- **Reusable** - Not used up in reactions
- **Efficient** - Small amounts needed

### Why are Enzymes Important?

Without enzymes:
- Reactions would be too SLOW for life
- Body temperature would need to be much HIGHER
- Digestion would take days instead of hours
- Respiration couldn't provide energy fast enough

### Naming Enzymes:

Most enzymes end in **-ase**:
- **Amylase** - breaks down starch (amylum)
- **Protease** - breaks down proteins
- **Lipase** - breaks down lipids (fats)
- **Maltase** - breaks down maltose
- **Catalase** - breaks down hydrogen peroxide`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. How Enzymes Work - Lock and Key Model",
                content: `## The Lock and Key Hypothesis

This model explains how enzymes are SPECIFIC to their substrates.

### Key Terms:

**Substrate** - The substance the enzyme acts on  
**Active Site** - The specific region on the enzyme where the substrate binds  
**Enzyme-Substrate Complex** - Temporary structure formed when substrate binds to enzyme  
**Product** - The substance formed after the reaction  

### The Process:

**Step 1: Substrate Approaches**
- Substrate molecule approaches the enzyme
- Has a complementary shape to the active site

**Step 2: Binding**
- Substrate fits into the active site
- Like a key fitting into a lock
- Forms enzyme-substrate complex

**Step 3: Reaction**
- Chemical bonds are broken or formed
- Substrate is converted to product(s)

**Step 4: Product Release**
- Product(s) leave the active site
- Enzyme is unchanged
- Ready to bind another substrate

### Why "Lock and Key"?

- **Enzyme** = Lock (has specific shape)
- **Substrate** = Key (must fit exactly)
- **Active Site** = Keyhole (specific shape)
- Only the correct substrate fits
- This explains enzyme SPECIFICITY

### Example: Amylase

- **Enzyme**: Amylase
- **Substrate**: Starch
- **Active Site**: Shaped to fit starch molecules
- **Product**: Maltose (sugar)
- Amylase will NOT work on proteins or fats!`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Factors Affecting Enzyme Activity",
                content: `## 1. Temperature

### Effect:

**Low Temperature (0-30°C):**
- Slow molecular movement
- Few collisions between enzyme and substrate
- Slow reaction rate

**Optimum Temperature (37°C for human enzymes):**
- Maximum enzyme activity
- Fastest reaction rate
- Most collisions

**High Temperature (above 45°C):**
- Enzyme DENATURES
- Active site changes shape
- Substrate no longer fits
- Enzyme stops working
- **IRREVERSIBLE** damage

### Key Points:

- Each enzyme has an **optimum temperature**
- Human enzymes: ~37°C (body temperature)
- Plant enzymes: ~25°C
- Bacterial enzymes: varies (some like 80°C!)
- Denaturation is PERMANENT

## 2. pH (Acidity/Alkalinity)

### Effect:

Each enzyme has an **optimum pH**:

**Pepsin** (stomach enzyme):
- Optimum pH: 2 (very acidic)
- Works in stomach acid

**Amylase** (mouth/pancreas):
- Optimum pH: 7 (neutral)
- Works in saliva and small intestine

**Trypsin** (small intestine):
- Optimum pH: 8 (slightly alkaline)

### What Happens at Wrong pH:

- **Too acidic or too alkaline**
- Active site shape changes
- Enzyme DENATURES
- Stops working
- Can be IRREVERSIBLE

## 3. Enzyme Concentration

### Effect:

**More Enzyme:**
- More active sites available
- More substrate can be processed
- Faster reaction rate
- (Until substrate runs out)

**Graph Pattern:**
- Rate increases with enzyme concentration
- Straight line relationship
- (If substrate is unlimited)

## 4. Substrate Concentration

### Effect:

**Low Substrate:**
- Many enzymes waiting
- Slow reaction rate

**Increasing Substrate:**
- More collisions
- Faster reaction rate

**High Substrate:**
- All enzymes working
- Maximum rate reached
- Adding more substrate has NO effect
- Enzymes are SATURATED

### Graph Pattern:

- Rate increases initially
- Levels off (plateau)
- Maximum rate when all enzymes busy`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Denaturation",
                content: `## What is Denaturation?

**Denaturation** is the permanent change in the shape of an enzyme's active site, causing it to lose its function.

### Causes of Denaturation:

**1. High Temperature**
- Above optimum (usually >45°C)
- Breaks bonds holding enzyme shape
- Active site changes shape
- Substrate no longer fits

**2. Extreme pH**
- Too acidic or too alkaline
- Disrupts chemical bonds
- Changes active site shape

**3. Heavy Metals**
- Lead, mercury
- Bind to enzyme
- Change shape

### Key Features:

✓ **Irreversible** - Cannot be undone  
✓ **Permanent** - Enzyme is destroyed  
✓ **Shape Change** - Active site altered  
✓ **Loss of Function** - Enzyme stops working  

### Why is it Important?

- Explains why fever is dangerous (enzymes denature)
- Why cooking changes food (enzymes destroyed)
- Why stomach acid kills bacteria (denatures their enzymes)
- Why we need to maintain body temperature

### Denaturation vs Inactivation:

| Feature | Denaturation | Inactivation |
|---------|--------------|--------------|
| **Reversible?** | NO | Sometimes YES |
| **Cause** | Extreme conditions | Wrong conditions |
| **Shape Change** | Permanent | Temporary |
| **Example** | Boiled egg white | Cold enzyme |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Digestive Enzymes",
                content: `## Important Digestive Enzymes

### 1. Amylase

**Source**: Salivary glands, Pancreas  
**Location**: Mouth, Small intestine  
**Substrate**: Starch  
**Product**: Maltose (sugar)  
**Optimum pH**: 7 (neutral)  

**Function**: Breaks down starch into simpler sugars

### 2. Protease (Pepsin, Trypsin)

**Pepsin:**
- Source: Stomach
- Location: Stomach
- Substrate: Proteins
- Product: Peptides
- Optimum pH: 2 (acidic)

**Trypsin:**
- Source: Pancreas
- Location: Small intestine
- Substrate: Proteins/Peptides
- Product: Amino acids
- Optimum pH: 8 (alkaline)

**Function**: Breaks down proteins into amino acids

### 3. Lipase

**Source**: Pancreas  
**Location**: Small intestine  
**Substrate**: Lipids (fats and oils)  
**Product**: Fatty acids and glycerol  
**Optimum pH**: 8 (alkaline)  

**Function**: Breaks down fats into fatty acids and glycerol

### 4. Maltase

**Source**: Small intestine  
**Location**: Small intestine  
**Substrate**: Maltose  
**Product**: Glucose  
**Optimum pH**: 7-8  

**Function**: Breaks down maltose into glucose

### Summary Table:

| Enzyme | Substrate | Products | Location |
|--------|-----------|----------|----------|
| **Amylase** | Starch | Maltose | Mouth, Small intestine |
| **Pepsin** | Protein | Peptides | Stomach |
| **Trypsin** | Protein | Amino acids | Small intestine |
| **Lipase** | Fats | Fatty acids + Glycerol | Small intestine |
| **Maltase** | Maltose | Glucose | Small intestine |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Practical Applications",
                content: `## Uses of Enzymes

### 1. Food Industry

**Cheese Making:**
- Rennin enzyme clots milk
- Separates curds from whey

**Bread Making:**
- Amylase breaks down starch
- Provides sugar for yeast

**Fruit Juice:**
- Pectinase breaks down pectin
- Makes juice clearer

**Meat Tenderizer:**
- Protease breaks down tough proteins
- Makes meat softer

### 2. Biological Washing Powders

**How They Work:**
- Contain proteases and lipases
- Break down protein and fat stains
- Work at low temperatures (saves energy)
- More effective than normal detergents

**Advantages:**
- Remove biological stains (blood, sweat, food)
- Work in cold water
- Environmentally friendly

### 3. Medicine

**Lactose Intolerance:**
- Lactase enzyme added to milk
- Breaks down lactose
- Makes milk digestible

**Digestive Problems:**
- Enzyme supplements help digestion
- Replace missing enzymes

### 4. Industry

**Brewing:**
- Amylase converts starch to sugar
- Yeast ferments sugar to alcohol

**Paper Making:**
- Enzymes break down wood pulp
- Makes paper production easier

### Advantages of Using Enzymes:

✓ Work at low temperatures (save energy)  
✓ Specific (only target certain substances)  
✓ Biodegradable (environmentally friendly)  
✓ Efficient (small amounts needed)  
✓ Reusable (can be used multiple times)`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Enzymes are biological catalysts made of protein that speed up reactions",
            "Enzymes are specific - each enzyme catalyzes only one type of reaction",
            "The lock and key model explains enzyme specificity (substrate fits active site)",
            "Enzymes have an optimum temperature (usually 37°C for humans)",
            "Enzymes have an optimum pH (varies: pepsin pH 2, amylase pH 7, trypsin pH 8)",
            "Denaturation is the permanent change in enzyme shape caused by extreme conditions",
            "High temperature and extreme pH cause irreversible denaturation",
            "Amylase breaks down starch to maltose, protease breaks down proteins, lipase breaks down fats",
            "Enzymes are not used up in reactions and can be reused",
            "Increasing substrate concentration increases reaction rate until enzymes are saturated"
        ],
        exam_tips: [
            "Always mention 'biological catalyst' and 'protein' when defining enzymes",
            "For lock and key model, draw a diagram showing substrate fitting into active site",
            "Remember: Denaturation is IRREVERSIBLE - this is a key exam point!",
            "Know the optimum pH for each enzyme: Pepsin (pH 2), Amylase (pH 7), Trypsin (pH 8)",
            "Temperature graph: increases to optimum, then drops sharply (denaturation)",
            "Substrate concentration graph: increases then plateaus (saturation)",
            "Don't say 'enzymes die' - say 'enzymes denature' or 'become inactive'",
            "Common mistake: Saying enzymes are used up - they are NOT, they are reusable!",
            "For digestive enzymes, know: substrate, product, location, and optimum pH",
            "Practical applications are popular exam questions - know biological washing powders!"
        ]
    },

    "Plant Nutrition": {
        topic: "Plant Nutrition",
        subject: "Biology",
        summary: "Plants are autotrophs that make their own food through photosynthesis. This topic covers the process of photosynthesis, factors affecting it, leaf structure adaptations, and mineral requirements for healthy plant growth.",
        sections: [
            {
                title: "1. Introduction to Plant Nutrition",
                content: `## What is Nutrition?

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

### What Plants Need:

**Raw Materials for Photosynthesis:**
1. **Carbon dioxide** (CO₂) - from air
2. **Water** (H₂O) - from soil
3. **Light energy** - from sun
4. **Chlorophyll** - green pigment in chloroplasts

**Products of Photosynthesis:**
1. **Glucose** (C₆H₁₂O₆) - food/energy
2. **Oxygen** (O₂) - released to air`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Photosynthesis - The Process",
                content: `## Definition

**Photosynthesis** is the process by which green plants make glucose (food) from carbon dioxide and water, using light energy absorbed by chlorophyll, and releasing oxygen as a by-product.

### Word Equation:

\`\`\`
Carbon dioxide + Water  →  Glucose + Oxygen
    (from air)    (from soil)  (food)   (released)
\`\`\`

### Chemical Equation:

\`\`\`
6CO₂ + 6H₂O  →  C₆H₁₂O₆ + 6O₂
             light energy
             chlorophyll
\`\`\`

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

### What Happens to the Glucose?

Glucose produced is used for:

**1. Respiration**
- Broken down to release energy
- Powers all life processes

**2. Storage**
- Converted to **starch** (insoluble)
- Stored in leaves, roots, stems, seeds

**3. Making Other Substances**
- **Cellulose** - for cell walls
- **Proteins** - combined with nitrates
- **Fats and oils** - for seeds

**4. Growth**
- Used to make new cells
- Build new tissues`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Leaf Structure",
                content: `## External Features of a Leaf

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
- Reflects green light

**Network of Veins:**
- Xylem brings water
- Phloem removes glucose
- Provides support

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
- **Flaccid** = stomata closed (night)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Factors Affecting Photosynthesis",
                content: `## Limiting Factors

A **limiting factor** is a factor that, when in short supply, limits the rate of photosynthesis.

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
- Bell-shaped curve`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Mineral Requirements",
                content: `## Why Plants Need Minerals

Plants need minerals (in addition to C, H, O from photosynthesis) for:
- Making proteins
- Making chlorophyll
- Healthy growth
- Strong cell walls
- Enzyme production

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

### 4. Magnesium (Mg²⁺)

**Used For:**
- Making **chlorophyll**
- **Enzyme activation**

**Deficiency Symptoms:**
- **Yellow leaves** (chlorosis)
- **Green veins** (veins stay green)
- **Older leaves affected first**

## Summary Table:

| Mineral | Used For | Deficiency Symptom | Which Leaves |
|---------|----------|-------------------|--------------|
| **Nitrate** | Proteins, chlorophyll | Yellow leaves, stunted | Older first |
| **Phosphate** | DNA, ATP, membranes | Purple leaves, poor roots | All |
| **Potassium** | Enzymes, stomata | Yellow edges, brown spots | All |
| **Magnesium** | Chlorophyll | Yellow with green veins | Older first |`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Photosynthesis: CO₂ + H₂O → C₆H₁₂O₆ + O₂ (using light energy and chlorophyll)",
            "Plants are autotrophs - they make their own food through photosynthesis",
            "Chlorophyll in chloroplasts absorbs light energy for photosynthesis",
            "Palisade mesophyll cells contain most chloroplasts and do most photosynthesis",
            "Limiting factors: light intensity, CO₂ concentration, temperature (and water, chlorophyll)",
            "Glucose is used for respiration, stored as starch, or converted to cellulose, proteins, fats",
            "Stomata allow CO₂ to enter and O₂ to exit; controlled by guard cells",
            "Nitrate deficiency causes yellow older leaves and stunted growth",
            "Magnesium is needed to make chlorophyll; deficiency causes yellow leaves with green veins",
            "Leaves are adapted for photosynthesis: broad (large surface area), thin (short diffusion distance)"
        ],
        exam_tips: [
            "Always write the FULL photosynthesis equation with light energy and chlorophyll above the arrow",
            "For limiting factors, describe the graph pattern: increases then plateaus",
            "Remember: Enzymes are involved, so temperature affects photosynthesis (denaturation above 45°C)",
            "Leaf structure: Palisade cells at TOP (most light), spongy mesophyll has AIR SPACES (gas exchange)",
            "Mineral deficiencies: Nitrate = yellow OLDER leaves, Iron = yellow YOUNGER leaves",
            "Starch test: Boil in water, then ethanol, then add iodine (blue-black = positive)",
            "Don't say 'plants breathe in CO₂' - say 'CO₂ diffuses into leaf through stomata'",
            "Common mistake: Saying oxygen is a waste product - it's a BY-PRODUCT (useful for respiration)"
        ]
    },

    // Placeholder entries for remaining topics (will be populated with full content)
    "Animal Nutrition": {
        topic: "Animal Nutrition",
        subject: "Biology",
        summary: "Animal nutrition covers the processes by which animals obtain and digest food. This includes the alimentary canal, digestive enzymes, teeth structure, and the importance of a balanced diet.",
        sections: [
            {
                title: "1. Types of Nutrition",
                content: "Animals are heterotrophs - they cannot make their own food and must consume other organisms. Types include herbivores (plant-eaters), carnivores (meat-eaters), omnivores (both), detritivores (dead matter), and parasites (living hosts).",
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Animals are heterotrophs - they consume other organisms for food",
            "The alimentary canal is the digestive tract from mouth to anus",
            "Amylase breaks down starch to maltose",
            "Protease breaks down proteins to amino acids",
            "Lipase breaks down fats to fatty acids and glycerol",
            "Villi in small intestine provide large surface area for absorption"
        ],
        exam_tips: [
            "Know the location and function of each digestive enzyme",
            "Draw and label the alimentary canal clearly",
            "Remember the differences between mechanical and chemical digestion"
        ]
    },

    "Transport in Plants": {
        topic: "Transport in Plants",
        subject: "Biology",
        summary: "Plants transport water, minerals, and food through specialized tissues called xylem and phloem.",
        sections: [
            {
                title: "1. Vascular Tissues",
                content: "Xylem transports water and minerals upward from roots. Phloem transports sugars (sucrose) from leaves to all parts of the plant (translocation).",
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Xylem transports water and minerals upward",
            "Phloem transports sugars (translocation)",
            "Transpiration is the loss of water vapor through stomata",
            "Root hairs absorb water by osmosis"
        ],
        exam_tips: [
            "Remember: Xylem = UP (water), Phloem = UP and DOWN (sugars)"
        ]
    },

    "Transport in Humans": {
        topic: "Transport in Humans",
        subject: "Biology",
        summary: "The circulatory system transports blood containing oxygen, nutrients, and waste products around the body.",
        sections: [
            {
                title: "1. The Heart",
                content: "The heart is a muscular pump with four chambers: two atria (receive blood) and two ventricles (pump blood out).",
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Heart has 4 chambers: 2 atria, 2 ventricles",
            "Arteries carry blood away from the heart",
            "Veins carry blood back to the heart",
            "Capillaries allow exchange between blood and tissues",
            "Red blood cells contain hemoglobin for oxygen transport"
        ],
        exam_tips: [
            "Draw and label the heart from memory",
            "Remember: Arteries = Away, Veins = to heart"
        ]
    },

    "Respiration": {
        topic: "Respiration",
        subject: "Biology",
        summary: "Respiration is the process of releasing energy from glucose. It occurs in all living cells.",
        sections: [
            {
                title: "1. Aerobic Respiration",
                content: "Glucose + Oxygen → Carbon dioxide + Water + Energy (ATP). Occurs in mitochondria. Releases 38 ATP per glucose molecule.",
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Aerobic respiration needs oxygen",
            "Anaerobic respiration occurs without oxygen",
            "Equation: Glucose + Oxygen → CO₂ + Water + Energy",
            "Respiration occurs in mitochondria"
        ],
        exam_tips: [
            "Don't confuse respiration with breathing (ventilation)"
        ]
    },

    "Excretion": {
        topic: "Excretion",
        subject: "Biology",
        summary: "Excretion is the removal of metabolic waste products from the body.",
        sections: [
            {
                title: "1. Excretory Organs",
                content: "Kidneys remove urea, excess water, and salts. Lungs remove CO₂. Skin removes water, salts, and some urea.",
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Kidneys filter blood and produce urine",
            "Lungs excrete carbon dioxide",
            "Liver converts amino acids to urea",
            "Urea is transported to kidneys in blood"
        ],
        exam_tips: [
            "Don't confuse excretion with egestion (undigested food)"
        ]
    },

    "Coordination and Response": {
        topic: "Coordination and Response",
        subject: "Biology",
        summary: "The nervous and endocrine systems coordinate body functions and responses to stimuli.",
        sections: [
            {
                title: "1. The Nervous System",
                content: "Consists of CNS (brain, spinal cord) and PNS (nerves). Neurons transmit electrical impulses.",
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "CNS = Brain + Spinal cord",
            "Neurons transmit electrical impulses",
            "Hormones are chemical messengers",
            "Reflex actions are fast, automatic responses"
        ],
        exam_tips: [
            "Know the structure and function of neurons"
        ]
    },

    "Reproduction": {
        topic: "Reproduction",
        subject: "Biology",
        summary: "Reproduction ensures the continuation of species through asexual or sexual reproduction.",
        sections: [
            {
                title: "1. Types of Reproduction",
                content: "Asexual: one parent, genetically identical offspring. Sexual: two parents, genetic variation.",
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Sexual reproduction involves fusion of gametes",
            "Asexual reproduction produces clones",
            "Fertilization produces a zygote",
            "Flowers are reproductive organs of plants"
        ],
        exam_tips: [
            "Know the differences between sexual and asexual reproduction"
        ]
    },

    "Organisms and Environment": {
        topic: "Organisms and Environment",
        subject: "Biology",
        summary: "Ecology studies the relationships between organisms and their environment.",
        sections: [
            {
                title: "1. Ecosystems",
                content: "An ecosystem includes all living organisms and their physical environment in an area.",
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Food chains show energy transfer",
            "Producers make their own food",
            "Consumers eat other organisms",
            "Decomposers break down dead matter"
        ],
        exam_tips: [
            "Draw food chains with arrows showing energy flow"
        ]
    },

    "Human Influences on Ecosystem": {
        topic: "Human Influences on Ecosystem",
        subject: "Biology",
        summary: "Human activities impact ecosystems through pollution, deforestation, and conservation efforts.",
        sections: [
            {
                title: "1. Environmental Issues",
                content: "Pollution, deforestation, overfishing, and climate change threaten biodiversity.",
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Pollution damages ecosystems",
            "Deforestation reduces biodiversity",
            "Conservation protects endangered species",
            "Sustainability meets needs without harming future generations"
        ],
        exam_tips: [
            "Give specific examples of human impacts"
        ]
    },

    "Classification": {
        topic: "Classification",
        subject: "Biology",
        summary: "Classification organizes living things into groups based on shared characteristics.",
        sections: [
            {
                title: "1. Taxonomy",
                content: "Kingdom → Phylum → Class → Order → Family → Genus → Species. Remember: King Philip Came Over For Good Soup.",
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Five kingdoms: Animalia, Plantae, Fungi, Protoctista, Prokaryotae",
            "Species is the smallest classification group",
            "Binomial naming uses Genus + species",
            "Vertebrates have backbones"
        ],
        exam_tips: [
            "Use King Philip Came Over For Good Soup to remember the order"
        ]
    }
};
