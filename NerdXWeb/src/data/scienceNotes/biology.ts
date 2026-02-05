// Biology Notes - All 14 Topics for ZIMSEC Combined Science
import type { TopicNotes } from './types';

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
        summary: "The cell is the fundamental building block of all known living organisms. From the smallest bacterium to the largest blue whale, all life is composed of these microscopic units. Understanding the structure of a cell and the functions of its various components is the essential first step in comprehending how complex organisms, including humans, are built and how they function.",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Biology%20/Cell_Structure_Function_Organization_and_Life.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9CaW9sb2d5IC9DZWxsX1N0cnVjdHVyZV9GdW5jdGlvbl9Pcmdhbml6YXRpb25fYW5kX0xpZmUubTRhIiwiaWF0IjoxNzY1MjUzNDc1LCJleHAiOjUyNjU3NDk0NzV9.p1nVYnwZLzBYDp6hiGne7dnN7uygxRfeOQY6Cl6RY3w",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Biology/Cell_Structure_&_Organisation.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0Jpb2xvZ3kvQ2VsbF9TdHJ1Y3R1cmVfJl9PcmdhbmlzYXRpb24ubXA0IiwiaWF0IjoxNzY1ODI3Nzk3LCJleHAiOjUyNjYzMjM3OTd9.6zQ_urahCmH1sI0g86BcCKjZZGjNNdIEAbELQCnQm7I",
        sections: [
            {
                title: "1. The Cell: The Basic Unit of Life",
                content: `## What is a Cell?

A **cell** is the smallest structural and functional unit of an organism. All living things are made of cells. Some organisms, known as **unicellular organisms**, are made of just a single cell (e.g., bacteria). In contrast, more complex organisms are **multicellular**, containing millions of individual cells that work together.

## Characteristics of Living Cells

Because all living organisms are made of cells, the cells themselves must exhibit the characteristics of life. To be classified as 'living', an organism (and by extension, its cells) must demonstrate seven key life processes:

| Process | Definition |
|---------|------------|
| **Movement** | An action by an organism or part of an organism causing a change of position or place |
| **Respiration** | The chemical reactions in cells that break down nutrient molecules and release energy |
| **Sensitivity** | The ability to detect or sense stimuli in the internal or external environment and to make appropriate responses |
| **Growth** | A permanent increase in size and dry mass by an increase in cell number or cell size or both |
| **Reproduction** | The production of new organisms from parent organisms |
| **Excretion** | Removal from organisms of the waste products of metabolism, toxic materials, and substances in excess of requirements |
| **Nutrition** | Taking in of materials for energy, growth and development |

This shared set of characteristics links all life, but as we will see, the internal structure of cells can vary significantly.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Types of Cells",
                content: `## Classification of Cells

Classifying cells is a crucial strategy in biology. While all cells share some common features, they are broadly divided into two main types based on their internal complexity.

## Prokaryotic Cells

**Prokaryotic cells** are simple cells that are defined by their lack of a true nucleus and mitochondria. Bacteria are the most common example of prokaryotes.

**Key characteristics include:**
- They are **unicellular** (single-celled)
- They have **no nucleus** – their genetic material is a single strand of DNA found within the cytoplasm
- They have **no mitochondria**
- They possess a cell wall (not made of cellulose), cell membrane, cytoplasm, and ribosomes

## Eukaryotic Cells

**Eukaryotic cells** are more complex cells that possess a **true nucleus**, where the genetic material is stored, along with other membrane-bound organelles. All animals, plants, fungi, and protoctists are composed of eukaryotic cells.

## Comparing Plant and Animal Cells

Even within the eukaryotic group, there are key structural differences that are adapted to the organism's way of life.

| Feature | Plant Cell | Animal Cell | Functional Significance |
|---------|-----------|-------------|------------------------|
| **Cell Wall** | Present (cellulose) | Absent | Provides structural support, gives fixed shape, prevents bursting when absorbing excess water. Fully permeable to water and dissolved substances. |
| **Cell Membrane** | Present (inside cell wall) | Present (outer boundary) | Partially permeable – controls which substances can enter and leave the cell |
| **Vacuole** | Large and permanent | Small and temporary | Plant vacuole contains cell sap, maintains turgidity by pushing cytoplasm against cell wall. Animal vesicles contain food or water. |
| **Chloroplasts** | Present (in many cells) | Absent | Contain chlorophyll for photosynthesis. Animals do not photosynthesise. |
| **Energy Storage** | Starch grains | Glycogen granules | Plants store excess glucose as starch |
| **Shape** | Regular and fixed | Irregular and variable | Cell wall gives plants consistent shape; animal cells are more flexible |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. A Tour of the Eukaryotic Cell: Organelles and Their Functions",
                content: `## What are Organelles?

The term "organelle" means "little organ." This analogy is useful because, just like organs in a body, organelles are specialized structures within a cell that each perform a specific, vital function to keep the cell alive and working correctly.

## Key Organelles and Structures

### Nucleus
- **Structure**: A large organelle containing the cell's genetic information organised into chromosomes, which are made of DNA. It is enclosed by a membrane called the nuclear envelope.
- **Function**: The nucleus acts as the **control centre** of the cell. It holds the instructions (genetic code) needed to make the specific proteins that carry out almost all cellular functions.

### Cytoplasm
- **Structure**: A jelly-like substance, composed mostly of water, that fills the cell and surrounds the organelles.
- **Function**: The cytoplasm is the site where many of the cell's **metabolic reactions** occur. These are the chemical reactions essential for life.

### Cell Membrane
- **Structure**: A very thin layer of protein and fat that forms the outer boundary of an animal cell and is located just inside the cell wall of a plant cell.
- **Function**: The cell membrane is **partially permeable**, meaning it controls which substances can pass into and out of the cell.

### Cell Wall (Plant Cells Only)
- **Structure**: A rigid structure found outside the cell membrane in plant cells, made mainly of a carbohydrate called cellulose.
- **Function**: The cell wall is **fully permeable**, allowing water and dissolved substances to pass through. It provides structural support and strength, and prevents the cell from bursting when it absorbs a large amount of water.

### Mitochondria
- **Structure**: Tiny, often oval-shaped organelles found in the cytoplasm of almost all eukaryotic cells.
- **Function**: Mitochondria are the "**powerhouses**" of the cell. They are the site of **aerobic respiration**, a process that uses oxygen to break down glucose and release energy. Cells with high energy requirements (sperm cells, nerve cells) contain large numbers of mitochondria.

### Ribosomes
- **Structure**: Extremely tiny organelles found free in the cytoplasm or attached to a network of membranes called the endoplasmic reticulum.
- **Function**: Ribosomes are the sites of **protein synthesis**. They join amino acids together in a specific sequence, following instructions from the nucleus, to build proteins.

### Chloroplasts (Plant Cells Only)
- **Structure**: Organelles found in the cytoplasm of many plant cells (particularly in leaves). They contain a green pigment called chlorophyll.
- **Function**: Chloroplasts are the site of **photosynthesis**. Energy from sunlight is captured by chlorophyll and used to convert carbon dioxide and water into glucose (food). They often contain starch grains as stored food.

### Vacuoles
- **In Plant Cells**: One large, central vacuole containing **cell sap** (a solution of sugars and other substances). When full of water, it pushes the cytoplasm firmly against the cell wall, making the cell **turgid** (firm).
- **In Animal Cells**: Much smaller, non-permanent vacuoles called **vesicles**. These are small membrane-bound sacs that may contain food or water.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Key Cell Processes: Transport Across the Cell Membrane",
                content: `## Transport Mechanisms

A cell's structure is static without the dynamic processes that allow it to interact with its environment, obtain energy, and carry out its functions.

## Diffusion

**Definition**: Diffusion is the net movement of molecules and ions from a region of their **higher concentration** to a region of their **lower concentration**.

**Explanation**: This process is **passive**, meaning it does not require energy from the cell. It occurs as a result of the natural, random movement of particles. For example, oxygen is constantly being used up inside a cell for respiration, creating a low concentration. This causes oxygen to diffuse into the cell from the outside, where its concentration is higher.

## Osmosis

**Definition**: Osmosis is the diffusion of water molecules from a region of **higher water potential** to a region of **lower water potential**, through a **partially permeable membrane**.

**Explanation**: Osmosis is a special case of diffusion that applies only to water moving across a membrane like the cell membrane. A dilute solution has a high water potential, while a concentrated solution has a low water potential.

### Effects of Osmosis on Cells

| Condition | Effect on Animal Cells | Effect on Plant Cells |
|-----------|----------------------|---------------------|
| **In pure water (high water potential)** | Water enters by osmosis, cell swells and eventually **bursts** (no cell wall protection) | Water enters, vacuole swells, cell becomes **turgid** (firm). Cell wall prevents bursting. |
| **In concentrated solution (low water potential)** | Water leaves by osmosis, cell shrinks and **shrivels** | Water leaves, vacuole shrinks, membrane pulls away from wall. Cell becomes **plasmolysed**. |

## Active Transport

**Definition**: Active transport is the movement of molecules and ions into or out of a cell **against a concentration gradient**, using **energy from respiration**.

**Explanation**: Unlike diffusion and osmosis, this process requires energy because it moves substances from an area of low concentration to an area of high concentration—the opposite of the natural direction of movement. A key example is the uptake of nitrate ions from the soil by plant root hair cells.

## A Basic Overview of Protein Synthesis

Protein synthesis is a fundamental process controlled by the cell's nucleus and carried out by its ribosomes.

1. The **nucleus** contains the chromosomes, which are made of DNA. This DNA holds the **genetic code** for building thousands of different proteins.
2. These instructions are sent out to the **ribosomes** in the cytoplasm. The ribosomes read the instructions and join amino acids together in the correct sequence to build a specific protein.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Observing Cells: The Role of Microscopy",
                content: `## Introduction to Microscopy

Cells are far too small to be seen with the naked eye. The invention of the microscope was the essential technological leap that unlocked our entire understanding of cellular biology.

## Types of Microscopes

### Light Microscope
- This is the type of microscope commonly used in a **school laboratory**
- It shines light through a specimen to create a magnified image
- Maximum magnification is about **×1500**
- Allows observation of larger structures like the cell membrane, cytoplasm, and nucleus. In plant cells, the cell wall and large central vacuole are also clearly visible.

### Electron Microscope
- A much more powerful type of microscope that uses **beams of electrons** instead of light
- Can magnify objects up to **×500,000**
- Reveals much greater **detail**, allowing scientists to see the fine structure of the cell and clearly observe smaller organelles like mitochondria, ribosomes, and chloroplasts

## Preparing a Slide for Observation

To view cells under a light microscope, a specimen must be carefully prepared:

1. **Obtain a thin sample**: Use forceps or a sharp blade to obtain a very thin layer of cells. A classic example is peeling the thin epidermal layer from the inside of an onion.

2. **Mount the sample**: Place the thin layer onto a drop of liquid (water or a stain) on a clean microscope slide and use a mounting needle to spread it out flat.

3. **Add a stain**: Because many cell parts are transparent, stains are used to make them visible.
   - **Methylene blue** is often used for animal cells
   - **Iodine solution** is used for plant cells
   - The stain makes organelles like the nucleus much easier to see

4. **Place the coverslip**: Gently lower a thin glass coverslip over the specimen at an angle. This helps avoid trapping air bubbles, which can obscure the view.

5. **Observe**: Place the finished slide on the microscope's stage. Always start by focusing with the **low-power objective lens** before moving to higher magnifications.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Exam Preparation and Key Concepts",
                content: `## Key Terminology

A precise understanding of key terms is essential for scoring well in biology exams.

| Term | Definition |
|------|------------|
| **Organelle** | A small structure found inside a cell that performs a specific function |
| **Tissue** | A group of cells with similar structures, working together to perform a shared function |
| **Organ** | A structure made up of a group of tissues, working together to perform specific functions |
| **Organ System** | A group of organs with related functions, working together to perform body functions |
| **Diffusion** | The net movement of molecules and ions from a region of their higher concentration to a region of their lower concentration |
| **Osmosis** | The diffusion of water molecules from a region of higher water potential to a region of lower water potential, through a partially permeable membrane |
| **Active Transport** | The movement of molecules and ions into or out of a cell against a concentration gradient, using energy from respiration |
| **Partially permeable membrane** | A membrane that will allow some substances to pass through it, but not others |

## Core Concepts for Quick Revision

- All living organisms are made of cells
- **Prokaryotic cells** (like bacteria) have no nucleus; **Eukaryotic cells** (like plant and animal cells) do
- Plant cells are distinguished by having a **cellulose cell wall**, **chloroplasts**, and a **large permanent vacuole**
- The nucleus controls the cell's activities, mitochondria release energy via respiration, and ribosomes synthesise proteins
- The cell membrane is **partially permeable** and controls the movement of substances into and out of the cell
- **Diffusion**, **osmosis**, and **active transport** are three key ways substances move across the cell membrane

## Practice Questions

### Question 1
**Distinguish between a plant cell and an animal cell.**
*Guide*: Structure your answer using a table or comparative sentences. Mention all key structural differences (cell wall, chloroplasts, vacuole, energy storage) and briefly state the functional significance of each.

### Question 2
**Explain the term "partially permeable" and state which part of a cell is described this way.**
*Guide*: Define the term (allows some substances to pass but not others). Identify the cell membrane as the structure with this property and explain why this selective control is vital.

### Question 3
**Compare and contrast diffusion, osmosis, and active transport.**
*Guide*: Define each process. Highlight key differences: energy requirement (active transport), direction of movement, and specific substances involved (osmosis is only for water).

### Question 4
**A red blood cell is placed in pure water. Describe and explain what is likely to happen.**
*Guide*: Identify osmosis as the process. Explain that pure water has higher water potential than cytoplasm. Describe net movement of water (into cell) and outcome (cell swells and bursts). Explain why this happens in animal cells (no cell wall).`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "A cell is the smallest structural and functional unit of an organism - all living things are made of cells",
            "Living cells exhibit seven life processes: Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, and Nutrition",
            "Prokaryotic cells (bacteria) have no nucleus or mitochondria; Eukaryotic cells have a true nucleus and membrane-bound organelles",
            "Plant cells have cell walls (cellulose), chloroplasts, and large permanent vacuoles; animal cells lack these",
            "The nucleus is the control centre containing DNA; cytoplasm is where metabolic reactions occur",
            "Mitochondria are the 'powerhouses' - site of aerobic respiration; ribosomes are sites of protein synthesis",
            "Chloroplasts contain chlorophyll and are the site of photosynthesis in plant cells",
            "Diffusion: net movement from high to low concentration (passive, no energy required)",
            "Osmosis: diffusion of water through a partially permeable membrane from high to low water potential",
            "Active transport: movement against concentration gradient, requires energy from respiration",
            "Plant cells become turgid in water but cannot burst due to cell wall; animal cells can burst (lysis)",
            "Light microscopes magnify up to ×1500; electron microscopes up to ×500,000 for seeing smaller organelles"
        ],
        exam_tips: [
            "Always use precise definitions - include key words like 'partially permeable membrane' for osmosis",
            "When comparing cells, use a TABLE format to clearly show similarities and differences",
            "Link STRUCTURE to FUNCTION for every organelle (e.g., mitochondria contain enzymes for respiration)",
            "For osmosis questions, always mention: water potential, direction of movement, and partially permeable membrane",
            "Remember the hierarchy: Cell → Tissue → Organ → Organ System → Organism",
            "Distinguish between TURGID (firm plant cell), FLACCID (limp), and PLASMOLYSED (shrunken)",
            "Animal cells have NO cell wall - this is why they can burst in pure water",
            "Active transport is the ONLY process that requires energy and moves AGAINST the concentration gradient",
            "For microscopy questions: stains make transparent structures visible; start with low-power lens",
            "Common mistake: Don't say animal cells have no vacuoles - they have SMALL, TEMPORARY vesicles"
        ]
    },

    "Movement In and Out of Cells": {
        topic: "Movement In and Out of Cells",
        subject: "Biology",
        summary: "Every living cell is a bustling hub of chemical activity, constantly requiring a controlled exchange of substances with its surrounding environment. To survive, grow, and function, cells must take in essential nutrients like oxygen and glucose, and expel waste products like carbon dioxide. The boundary that controls this vital traffic is the cell surface membrane, acting as a selective gatekeeper regulating what enters and leaves the cell's cytoplasm.",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Biology%20/Movement%20in%20and%20out%20of%20the%20cell.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9CaW9sb2d5IC9Nb3ZlbWVudCBpbiBhbmQgb3V0IG9mIHRoZSBjZWxsLm00YSIsImlhdCI6MTc2NTI1MzUwMiwiZXhwIjo1MjY1NzQ5NTAyfQ.NGfqS9Nd1tBNe39bGgDmP2rld_slprMNxkijhBykhwk",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Biology/Movement_In_&_Out_of_Cells.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0Jpb2xvZ3kvTW92ZW1lbnRfSW5fJl9PdXRfb2ZfQ2VsbHMubXA0IiwiaWF0IjoxNzY1ODI4MDExLCJleHAiOjUyNjYzMjQwMTF9.auUwtpAyIXjmBff8VKRcYNaQ4FrPeL4S_K1uzDafx9k",
        sections: [
            {
                title: "1. Introduction: The Cell's Vital Gateway",
                content: `## Why Cells Need to Exchange Substances

Every living cell is a bustling hub of chemical activity, constantly requiring a controlled exchange of substances with its surrounding environment. To survive, grow, and function, cells must:
- **Take in** essential nutrients like oxygen and glucose
- **Expel** waste products like carbon dioxide

The boundary that controls this vital traffic is the **cell surface membrane**. This membrane acts as a selective gatekeeper, regulating what enters and leaves the cell's cytoplasm.

## The Cell Surface Membrane

The movement of substances in and out of cells is defined by how they cross the cell surface membrane. This can happen in several ways, each suited to different molecules and cellular needs:

- Some methods occur naturally **without any energy cost** to the cell
- Others require the cell to actively **expend energy** to move substances where they are needed

These transport processes are fundamental to life, underpinning everything from energy production to waste removal and the maintenance of a stable internal environment, a state known as **homeostasis**.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Passive Transport: Moving with the Flow",
                content: `## What is Passive Transport?

**Passive transport** is a category of movement that does not require the cell to expend metabolic energy. Instead, it relies on the natural, random motion of particles.

In passive transport, substances always move "**downhill**" from an area where they are in high concentration to an area where their concentration is lower. This difference in concentration is known as a **concentration gradient**, and it provides the driving force for movement.

## 2.1 Diffusion: The Random Spread of Particles

> **Key Definition:** Diffusion is the net movement of molecules and ions from a region of their **higher concentration** to a region of their **lower concentration** down a concentration gradient, as a result of their random movement.

### How Diffusion Works

Diffusion is driven by the inherent **kinetic energy** of all molecules and ions. These particles are in constant, random motion, colliding with one another and spreading out over time.

- While individual particles move randomly, the overall, or **net**, movement is always from higher to lower concentration
- This continues until particles are **evenly distributed** (equilibrium)

*Example: A drop of ink in water—the ink particles naturally spread until the entire container is a uniform colour.*

### Biological Importance of Diffusion

| Process | Description |
|---------|-------------|
| **Gas Exchange for Photosynthesis** | CO₂ concentration is higher outside the leaf than inside, so it diffuses through stomata into the leaf |
| **Gas Exchange for Respiration** | O₂ diffuses from lungs → blood → body cells; CO₂ diffuses out of cells → blood → lungs |
| **Absorption of Nutrients** | After a meal, digested food molecules (glucose) diffuse from the ileum (small intestine) into the bloodstream |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Osmosis: The Special Case of Water",
                content: `## What is Osmosis?

> **Key Definition:** Osmosis is the diffusion of water molecules from a region of **higher water potential** (dilute solution) to a region of **lower water potential** (concentrated solution), through a **partially permeable membrane**.

Osmosis is a specific type of diffusion that deals exclusively with the movement of **water** across a **partially permeable membrane**, like a cell membrane.

## Understanding Water Potential

While we can talk about "water concentration," biologists prefer the more precise term **water potential**:

| Solution Type | Water Potential | Description |
|--------------|-----------------|-------------|
| **Dilute solution** | HIGH water potential | Lots of water molecules, few solute particles |
| **Concentrated solution** | LOW water potential | Less water, more solute particles |

**Water always moves by osmosis from HIGH water potential to LOW water potential.**

## Effects of Osmosis on Cells

The effects of osmosis differ significantly between animal and plant cells because of the presence of a strong **cell wall** in plants.

| Condition | Effect on Animal Cells | Effect on Plant Cells |
|-----------|----------------------|---------------------|
| **Placed in Pure Water (High Water Potential)** | Water enters by osmosis, cell swells, membrane stretches, cell eventually **bursts** (no cell wall protection) | Water enters by osmosis, vacuole and cytoplasm swell, membrane pushes against cell wall. Cell becomes firm and **turgid** but does not burst. |
| **Placed in Concentrated Solution (Low Water Potential)** | Water leaves by osmosis, cell shrinks and **shrivels** | Water leaves the vacuole and cytoplasm. Cell loses firmness and becomes **flaccid**. If severe, membrane pulls away from cell wall: **plasmolysis**. |

## Biological Importance of Turgor

The **turgor pressure** created in plant cells is biologically very important:
- When all cells in a plant stem and leaves are **turgid**, they press against each other
- This provides the collective strength and support that keeps plants' leaves firm and stems upright`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Active Transport: Moving Against the Current",
                content: `## When Passive Transport Isn't Enough

Sometimes, a cell's survival depends on its ability to:
- **Accumulate** substances to a much higher concentration than exists in its environment
- **Remove** substances that are already in low concentration outside

This movement **against** a concentration gradient cannot happen passively. For these situations, cells employ a dedicated, energy-driven mechanism called **active transport**.

> **Key Definition:** Active transport is the movement of molecules and ions in or out of a cell through the cell membrane, **against a concentration gradient**, using **energy from respiration**.

## Key Features of Active Transport

This process highlights two key features:
1. **Movement against the gradient** (from low to high concentration)
2. **Requirement for energy** (supplied as ATP from cellular respiration)

## How Active Transport Works

The process is carried out by special **transport proteins** (carrier proteins) embedded within the cell membrane:

1. The carrier protein **binds** to a specific molecule or ion
2. The protein uses **energy (ATP)** to change its shape
3. The substance is effectively **pushed across** the membrane
4. This occurs even if concentration is already high inside the cell

## Examples of Active Transport

| Example | Description |
|---------|-------------|
| **Mineral Absorption in Plants** | Root hair cells absorb mineral ions (nitrates) from soil, even when concentration is already higher inside the root cell |
| **Nutrient Absorption in Humans** | Glucose is actively transported from the small intestine and kidney tubules back into the blood, ensuring all useful glucose is recovered |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Factors Influencing the Rate of Transport",
                content: `## Physical Factors Affecting Transport

The efficiency of diffusion, osmosis, and active transport is not constant; it can be significantly influenced by several physical factors.

## 1. Concentration Gradient

The "steepness" of the concentration gradient is a key determinant of the rate of net movement in passive transport:

- **Steeper gradient** (larger difference) = **Faster** rate of diffusion or osmosis
- As substances spread out and the gradient becomes **less steep**, the rate of transport **slows down**

## 2. Temperature

Temperature is a measure of the average kinetic energy of particles:

- **Higher temperatures** = Molecules have **more kinetic energy**
- This means they move **faster** and collide more often
- This increased random motion directly **increases the rate of diffusion**

## 3. Membrane Permeability

The nature of the barriers involved is fundamental:

| Barrier | Permeability | Role |
|---------|-------------|------|
| **Cell Wall** (plants) | **Fully permeable** | Many small gaps between fibres allow water and dissolved solutes to pass freely |
| **Cell Membrane** | **Partially permeable** (selectively permeable) | Allows some substances through but restricts others |

The **cell membrane** is the ultimate gatekeeper—it truly controls which substances can enter and leave the cytoplasm.

This is why water can easily pass through the cell wall, but its movement into the cytoplasm is ultimately controlled by **osmosis across the partially permeable cell membrane**.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Practical Investigations: Seeing Transport in Action",
                content: `## Laboratory Experiments

Laboratory experiments provide tangible, visible evidence for the invisible molecular processes of diffusion and osmosis.

## Demonstrating Diffusion in a Solution

**Method**: Place a single crystal of a coloured salt (e.g., potassium permanganate) at the bottom of a beaker of still water.

**Observation**: Over time, the distinct purple colour spreads outwards from the area of high concentration (the crystal) into the area of low concentration (the surrounding water), eventually colouring all the water.

**Conclusion**: This demonstrates the net movement of particles down a concentration gradient.

## Investigating a Partially Permeable Membrane

**Using Visking Tubing** (a model for a partially permeable membrane):

1. Fill a bag made of Visking tubing with **starch solution**
2. Place it in a beaker of **iodine solution**
3. After some time, the solution **inside the bag turns blue-black**

**Interpretation**:
- Small **iodine molecules** diffused through the tubing into the bag
- The water **outside does not turn blue-black**—the larger **starch molecules** could not diffuse out
- This models how a cell membrane allows some substances to pass while blocking others

## Observing Osmosis in Plant Tissue (Plasmolysis)

**Method**: Place a thin layer of onion epidermis in a concentrated salt or sugar solution (low water potential).

**Observation under microscope**:
- The vacuole **shrinks**
- The cell membrane **pulls away from the cell wall**

**Conclusion**: This provides clear, microscopic evidence of water **leaving** the cell due to osmosis.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Exam Preparation and Key Concepts",
                content: `## Core Definitions for Revision

| Term | Definition |
|------|------------|
| **Diffusion** | The net movement of molecules and ions from a region of their higher concentration to a region of their lower concentration down a concentration gradient, as a result of their random movement |
| **Osmosis** | The diffusion of water molecules from a region of higher water potential (dilute solution) to a region of lower water potential (concentrated solution), through a partially permeable membrane |
| **Active Transport** | The movement of molecules and ions in or out of a cell through the cell membrane, against a concentration gradient, using energy from respiration |
| **Partially Permeable Membrane** | A membrane that will let some substances through but not others |
| **Turgid** | The state of a plant cell when it is firm and tight due to high internal water pressure (turgor pressure) |
| **Flaccid** | The state of a plant cell when it has lost water and is no longer firm |
| **Plasmolysis** | The process in which the cell membrane of a plant cell pulls away from the cell wall as a result of water loss through osmosis |

## Common Misconceptions to Avoid

1. **Osmosis vs. Diffusion**: Osmosis is a specific type of diffusion. Key differences:
   - Osmosis exclusively describes the movement of **water molecules**
   - Osmosis must occur across a **partially permeable membrane**

2. **Cell Wall vs. Cell Membrane**: Don't confuse their roles:
   - **Cell wall** is fully permeable; its role is structural support
   - **Cell membrane** is partially permeable; it controls what enters/leaves the cytoplasm

3. **Energy Requirement**: Crucial distinction:
   - Diffusion and osmosis are **passive** (no metabolic energy needed)
   - Active transport is **active** (requires energy from respiration)

## Practice Exam Questions

### Question 1
**"Explain why diffusion happens faster when the temperature rises."**

*Key Points for Your Answer:*
- Define diffusion as net movement from high to low concentration
- State that particles possess kinetic energy and are in constant random motion
- Explain that higher temperature increases kinetic energy
- Connect to faster movement and more frequent collisions
- Conclude that this increases the rate of diffusion

### Question 2
**"The concentration of potassium ions is much higher inside plant cells than in the surrounding pond water. Explain how cells move these ions from the water into cells."**

*Key Points for Your Answer:*
- Identify movement from low concentration (pond) to high concentration (cells)
- This is movement AGAINST a concentration gradient
- Cannot be diffusion (only moves down gradient)
- Name the correct process: **active transport**
- Explain it requires **energy from respiration**
- Mention role of **carrier proteins** in the cell membrane

## At-a-Glance Comparison Table

| Characteristic | Diffusion | Osmosis | Active Transport |
|---------------|-----------|---------|------------------|
| **Energy Required?** | No (passive) | No (passive) | Yes (from respiration) |
| **Direction of Movement** | Down concentration gradient | Down water potential gradient | Against concentration gradient |
| **Membrane Required?** | No | Yes (partially permeable) | Yes (carrier proteins) |
| **Substances Moved** | Any small particles (ions, molecules) | Water molecules only | Specific ions or molecules |`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "The cell surface membrane acts as a selective gatekeeper, controlling what enters and leaves the cell's cytoplasm",
            "Diffusion is the net movement of molecules and ions from higher to lower concentration, down a concentration gradient, due to random movement",
            "Osmosis is the diffusion of water molecules from higher water potential to lower water potential, through a partially permeable membrane",
            "Active transport moves molecules and ions against a concentration gradient, using energy from respiration",
            "Passive transport (diffusion, osmosis) requires no energy; active transport requires ATP from respiration",
            "In pure water: animal cells swell and burst; plant cells become turgid (cell wall prevents bursting)",
            "In concentrated solution: animal cells shrink and shrivel; plant cells become flaccid and may undergo plasmolysis",
            "Turgor pressure from turgid cells provides support to keep plant stems upright and leaves firm",
            "Rate of diffusion increases with: steeper concentration gradient, higher temperature",
            "Cell wall is fully permeable (structural support); cell membrane is partially permeable (controls transport)",
            "Active transport uses carrier proteins in the cell membrane and energy (ATP) to move specific substances",
            "Root hair cells use active transport to absorb mineral ions from soil against concentration gradients"
        ],
        exam_tips: [
            "Always include key words in definitions: 'net movement', 'concentration gradient', 'water potential', 'partially permeable membrane'",
            "Osmosis is a SPECIFIC type of diffusion—it applies ONLY to water and MUST involve a partially permeable membrane",
            "Don't confuse cell wall (fully permeable, structural support) with cell membrane (partially permeable, controls transport)",
            "Remember: Diffusion and osmosis are PASSIVE (no energy); Active transport needs ENERGY from respiration",
            "Turgid = firm plant cell in water; Flaccid = limp; Plasmolysed = membrane pulled away from wall",
            "For temperature questions: explain that higher temperature → more kinetic energy → faster particle movement → faster diffusion",
            "Active transport moves substances AGAINST the gradient—this is why it needs energy and carrier proteins",
            "Use real-life examples to score marks: root hairs absorbing minerals (active transport), gas exchange in lungs (diffusion)",
            "When asked to compare processes, use a TABLE format for clarity",
            "Common mistake: Saying all transport needs energy. Only ACTIVE transport needs energy—diffusion and osmosis are passive!"
        ]
    },

    "Enzymes": {
        topic: "Enzymes",
        subject: "Biology",
        summary: "Inside every living organism, countless chemical reactions (metabolic reactions) are occurring every second to build new materials, release energy, and break down waste. For life to be sustained, these reactions must happen incredibly quickly and efficiently. Enzymes are the body's high-speed, precision managers—proteins that function as biological catalysts, ensuring that life's chemical assembly line runs flawlessly and at pace.",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Biology%20/Enzymes.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9CaW9sb2d5IC9Fbnp5bWVzLm00YSIsImlhdCI6MTc2NTI1Mzc2NSwiZXhwIjo1MjY1NzQ5NzY1fQ.zeYa5GvWXb7bU3uiuamaQ-bMV4zuis4B__ItqFHSXgI",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Biology/Enzymes.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0Jpb2xvZ3kvRW56eW1lcy5tcDQiLCJpYXQiOjE3NjU4Mjc4NjcsImV4cCI6NTI2NjMyMzg2N30.PXbCX6zDNrRwuAhWLsLAH3CrwmtDs2XqbZQhWDy-XoI",
        sections: [
            {
                title: "1. Introduction to Enzymes: The Catalysts of Life",
                content: `## What Are Enzymes?

To understand enzymes, we first need to define a related term:

> **Catalyst**: A substance that increases the rate of a chemical reaction without being changed itself by the reaction.

Enzymes are a special type of catalyst found within living things.

> **Enzymes are proteins that function as biological catalysts.**

Almost every metabolic reaction that occurs in a cell is controlled by a specific enzyme. They are the workforce that drives the chemistry of life.

## Why Are Enzymes Essential?

The role of enzymes is not just helpful; it is **absolutely critical**. Without enzymes, the rates of metabolic reactions would be far too slow to sustain life. They speed up reactions that would otherwise happen at a snail's pace, or not at all under the conditions found in a living cell.

### Two Key Examples:

| Example | Function |
|---------|----------|
| **In the Alimentary Canal** | Enzymes are responsible for digestion. They break down large, complex food molecules into smaller ones that can be absorbed and used by the body. |
| **Inside Cells (Catalase)** | Many reactions produce dangerous hydrogen peroxide. The enzyme catalase breaks down this harmful substance into harmless water and oxygen, protecting the cell from damage. |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. The Structure and Specificity of Enzymes",
                content: `## The Protein Nature of Enzymes

It is a fundamental fact that **all enzymes are proteins**. Proteins are large, complex molecules built from long chains of smaller units called **amino acids**.

- There are about 20 different kinds of amino acids
- The specific sequence in which amino acids are joined determines how the chain will fold
- This folding creates a unique, intricate, and stable **three-dimensional shape**
- This shape is absolutely essential for the protein's function as an enzyme
- A small difference in the order of amino acids makes a different protein

## The Active Site: The Engine of the Enzyme

On the surface of each large, folded enzyme molecule is a specific region where the chemical reaction takes place. This region is a small depression or groove known as the **active site**.

### Key Terms:

| Term | Definition |
|------|------------|
| **Substrate** | The molecule that the enzyme acts upon; the reactant at the beginning of the reaction |
| **Product** | The molecule(s) that are formed as a result of the reaction |
| **Active Site** | The specific region on the enzyme's surface where the substrate binds and the reaction occurs |

The active site is perfectly shaped to bind to the substrate, creating the ideal environment for the reaction to occur.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. The 'Lock and Key' Model of Enzyme Action",
                content: `## Understanding Enzyme Specificity

To explain the remarkable specificity of enzymes—how one enzyme can catalyse only one type of reaction—we use the **'lock and key' model**. This analogy helps visualize how an enzyme and its substrate interact with perfect precision.

## The Mechanism Step by Step:

### Step 1: Specificity
The three-dimensional shape of the substrate molecule is **complementary** to the shape of the enzyme's active site. This means they are shaped to fit together perfectly.

*An enzyme that breaks down starch, for example, has an active site that will not fit a protein molecule.*

### Step 2: Binding
The substrate molecule fits neatly into the active site of the enzyme, just as a specific key fits into its corresponding lock. This temporary binding forms what is known as an **enzyme-substrate complex**.

### Step 3: Catalysis
Once the substrate is bound within the active site, the enzyme facilitates the chemical reaction. It might help to:
- **Break** a large substrate molecule into smaller products (like in digestion)
- **Join** smaller substrate molecules together

### Step 4: Release
After the reaction is complete, the product(s) are released from the active site. The enzyme itself is left **completely unchanged** and is immediately ready to bind with another substrate molecule and catalyse the reaction all over again.

## The Lock and Key Analogy:

| Component | Analogy |
|-----------|---------|
| Enzyme | Lock |
| Substrate | Key |
| Active Site | Keyhole |

This model explains how enzymes can be both incredibly **efficient** and highly **specific**.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Factors Affecting Enzyme Activity",
                content: `## The Effect of Temperature

At **low temperatures**, the rate of reaction is slow because both enzyme and substrate molecules possess little kinetic energy. They move around slowly, resulting in infrequent collisions between them.

As the **temperature rises**, kinetic energy increases, causing molecules to move faster and collide more often and with greater force, which increases the reaction rate.

This continues until the enzyme reaches its **optimum temperature**—the temperature at which it works most efficiently and the reaction rate is at its peak.

### Optimum Temperatures for Different Enzymes:

| Enzyme Source | Optimum Temperature |
|--------------|---------------------|
| Human digestive enzymes | ~37°C |
| Plant enzymes | ~28°C to 30°C |
| Hot spring bacteria | Up to 75°C |

### Above the Optimum:
If the temperature increases too far beyond the optimum (e.g., above 45°C for human enzymes):
- The enzyme molecule begins to vibrate too vigorously
- This breaks the bonds holding the protein in its specific 3D shape
- The enzyme loses its shape and the active site is altered
- The substrate can no longer fit
- The enzyme is said to be **denatured**
- **This change is irreversible**

## The Effect of pH

The pH of a solution—its level of acidity or alkalinity—also has a profound effect on an enzyme's shape and function.

| Condition | Effect |
|-----------|--------|
| **Optimum pH** | Maximum activity because shape is perfectly maintained. For most enzymes in the body, this is around neutral (pH 7). |
| **Extreme pH** (too acidic or too alkaline) | Shape changes, active site altered, enzyme becomes **denatured** |

### An Important Exception: Pepsin
Not all enzymes work best at pH 7. **Pepsin** is a protease (protein-digesting enzyme) found in the highly acidic environment of the stomach. Its optimum pH is about **2**.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Investigating Enzyme Activity: A Practical Guide",
                content: `## The Action of Catalase

Understanding the properties of enzymes is best achieved through practical investigation.

### What is Catalase?
Catalase is a very common enzyme found in the cells of almost all living things, including tissues from potatoes and liver.

### What Does it Do?
Its function is to protect the cell by breaking down the harmful chemical **hydrogen peroxide** into two harmless substances: **water** and **oxygen**.

### Observing the Reaction
The basic experiment involves adding a piece of tissue containing catalase (like raw potato or liver) to a solution of hydrogen peroxide. The evidence that a reaction is occurring is the immediate production of **gas bubbles** (oxygen being released).

## Investigating the Effect of pH on Catalase

### Objective
A common follow-up investigation is to measure and compare the rate of the catalase reaction at different pH levels (acidic, neutral, and alkaline).

### Measuring the Rate of Reaction

**Method: The Rising Disc Technique**
1. Soak a small square of filter paper in a catalase solution
2. Drop it into a beaker of hydrogen peroxide
3. The disc will initially **sink**
4. As catalase breaks down the hydrogen peroxide, bubbles of oxygen collect on the disc's surface
5. Eventually, the disc **floats** to the surface
6. Time how long it takes for the paper to rise
7. Repeat at different pH values to find the optimum pH for catalase

**Interpretation**: A shorter time to rise = faster reaction rate = closer to optimum pH`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Exam Focus and Revision Guide",
                content: `## Key Terminology for Exams

| Term | Clear Definition |
|------|------------------|
| **Enzyme** | A protein that functions as a biological catalyst |
| **Catalyst** | A substance that increases the rate of a chemical reaction and is not changed by the reaction |
| **Substrate** | The substance that an enzyme acts upon; the reactant in the reaction |
| **Product** | The substance that is made by an enzyme-catalysed reaction |
| **Active Site** | The specific region or depression on an enzyme's surface where the substrate binds and the reaction occurs |
| **Optimum Temperature** | The temperature at which an enzyme works fastest and its activity is at a maximum |
| **Optimum pH** | The specific pH at which an enzyme shows maximum activity |
| **Denaturation** | The irreversible change in the three-dimensional shape of an enzyme caused by extreme heat or pH, which alters the active site and stops its function |

## Core Principles at a Glance

For quick revision, remember these six fundamental properties of enzymes:

1. All enzymes are **proteins**
2. Enzymes are made inactive by high temperatures (they **denature**)
3. Enzymes work best at a specific **optimum temperature**
4. Enzymes work best at a specific **optimum pH**
5. Enzymes are **catalysts** and can be used over and over again
6. Enzymes are **specific** and only catalyse one type of reaction

## Common Misconception to Avoid

> ❌ **Mistake**: Saying enzymes are 'killed'

Enzymes are **non-living chemical molecules** (proteins), and therefore they **cannot be killed**. The correct term is **denatured**. Denaturation accurately describes the process where the enzyme's complex shape is irreversibly changed, destroying its ability to function.

## Practice Exam Questions

### Question 1
**Using the 'lock and key' model, explain why an amylase enzyme can break down starch but not protein.**

*Guidance for Answering:*
- Begin by stating: enzymes are **specific** in their action
- Describe the active site of amylase as having a unique, precise 3D shape
- Explain that starch's shape is **complementary** to the amylase active site
- State that protein has a **different shape** that is not complementary to the active site
- Conclude: because protein cannot fit into the active site, no reaction can be catalysed

### Question 2
**Describe and explain what happens to the activity of a human enzyme as temperature increases from 0°C to 100°C.**

*Guidance for Answering:*
- **0°C to ~37°C**: Rate of reaction increases. Enzyme and substrate molecules gain kinetic energy, move faster, more frequent/energetic collisions.
- **At ~37°C (Optimum)**: Maximum rate of reaction.
- **Above ~45°C**: Enzyme denatures. Loses its specific 3D shape, active site is altered.
- **Towards 100°C**: Enzyme fully denatured. Substrate cannot bind to altered active site. Reaction stops completely.`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Enzymes are proteins that function as biological catalysts, speeding up metabolic reactions",
            "A catalyst increases the rate of a chemical reaction without being changed itself by the reaction",
            "Without enzymes, metabolic reactions would be far too slow to sustain life",
            "All enzymes are proteins, made from chains of amino acids folded into a specific 3D shape",
            "The active site is a specific region on the enzyme's surface where the substrate binds and the reaction occurs",
            "The 'lock and key' model explains enzyme specificity: substrate shape is complementary to the active site shape",
            "Enzymes form an enzyme-substrate complex, catalyse the reaction, release products, and remain unchanged",
            "Each enzyme has an optimum temperature at which it works most efficiently (37°C for human enzymes)",
            "Each enzyme has an optimum pH at which it shows maximum activity (pH 7 for most, pH 2 for pepsin)",
            "Denaturation is the irreversible change in enzyme shape caused by extreme heat or pH, destroying the active site",
            "Catalase breaks down harmful hydrogen peroxide into harmless water and oxygen",
            "Enzymes can be used repeatedly—they are not used up in reactions"
        ],
        exam_tips: [
            "Always define enzymes as 'proteins that function as biological catalysts'—include both key words",
            "Never say enzymes are 'killed'—the correct term is 'denatured' (enzymes are non-living molecules)",
            "For the lock and key model: substrate is 'complementary' to the active site (like a key fitting a lock)",
            "Know the difference: optimum temperature is where enzymes work BEST; above this they DENATURE",
            "Remember specific pH values: Pepsin = pH 2 (acidic), most enzymes = pH 7 (neutral)",
            "Denaturation is IRREVERSIBLE—the enzyme's 3D shape is permanently changed",
            "For temperature graphs: activity increases to optimum, then drops sharply due to denaturation",
            "Explain enzyme specificity by stating that different substrates have different shapes that don't fit the active site",
            "The enzyme is UNCHANGED after the reaction—it can catalyse the same reaction many times",
            "For practical questions: rate of reaction can be measured by timing how quickly oxygen gas is produced"
        ]
    },

    "Plant Nutrition": {
        topic: "Plant Nutrition",
        subject: "Biology",
        summary: "Nutrition is a fundamental characteristic shared by all living organisms, defining the processes by which they acquire and use materials for energy, growth, and development. Plants, as primary producers, have a unique ability to create their own food from simple inorganic substances through photosynthesis. This foundational process supports nearly all other life on Earth, forming the basis of energy flow through entire ecosystems.",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Biology%20/Plant%20Nutrition.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9CaW9sb2d5IC9QbGFudCBOdXRyaXRpb24ubTRhIiwiaWF0IjoxNzY1MjUzNTQ4LCJleHAiOjUyNjU3NDk1NDh9.wJdnoQkHWFvLebdw0bwrXdYqgk58JroJln4YpC9HhUM",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Biology/Plant_Nutrition.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0Jpb2xvZ3kvUGxhbnRfTnV0cml0aW9uLm1wNCIsImlhdCI6MTc2NTgyODExMSwiZXhwIjo4NzY2ODIwMTExfQ.rWYpw-4FNSHuZrNrz5gTQtmubC387cHOO99M3WoGE08",
        sections: [
            {
                title: "1. Introduction to Plant Nutrition",
                content: `## What is Nutrition?

> **Nutrition** is the taking in of materials for energy, growth and development.

Understanding nutrition is strategically vital as it forms the basis of **energy flow through entire ecosystems**. This flow begins with plants, which, as primary producers, have a unique ability to create their own food from simple inorganic substances.

## What Plants Require

Plants require the following to produce their own food:

| Requirement | Source |
|-------------|--------|
| **Light** | Typically from the sun, providing the essential energy for food synthesis |
| **Carbon dioxide** | A gas taken from the atmosphere |
| **Water** | Absorbed from the soil |
| **Ions** | Mineral salts also absorbed from the soil |

## Autotrophs vs Heterotrophs

This method of nourishment fundamentally distinguishes plants from animals:

| Type | Definition | Examples |
|------|------------|----------|
| **Autotrophs** | Self-sufficient organisms that manufacture complex food molecules from simple raw materials | Plants, algae, some bacteria |
| **Heterotrophs** | Organisms that must "feed on organic substances made by other living organisms" | Animals, fungi, most bacteria |

Plants achieve their remarkable self-sufficiency through a single, elegant process that converts light energy into chemical energy, known as **photosynthesis**.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Autotrophic Nutrition: The Process of Photosynthesis",
                content: `## What is Photosynthesis?

Photosynthesis is the cornerstone of autotrophic nutrition in plants. This vital biochemical process is of immense **strategic importance**, as it is the primary mechanism by which light energy from the sun is converted into chemical energy stored in organic molecules.

> **Photosynthesis** is the process where plants utilize energy from sunlight to synthesize glucose (a type of sugar) from carbon dioxide and water.

This conversion from simple inorganic molecules to complex energy-rich compounds is what defines plants as **producers**.

## The Cellular Site of Photosynthesis

This critical process takes place within specialized organelles inside plant cells called **chloroplasts**. These structures:
- Are typically absent in animal cells
- Are concentrated in the green parts of a plant, such as its leaves
- Contain a green pigment known as **chlorophyll**
- Chlorophyll is uniquely capable of absorbing energy from sunlight
- This absorbed light energy powers the chemical reactions of photosynthesis

## Products and Energy Storage

| Stage | Product | Purpose |
|-------|---------|---------|
| **Immediate** | Glucose | A simple sugar that the plant can use for energy |
| **Long-term Storage** | Starch | Excess glucose is converted to this complex carbohydrate |
| **Storage Location** | Starch grains | Found directly within the chloroplasts where they were produced |

This efficient storage system allows the plant to have a ready supply of energy when light is unavailable.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Acquiring Raw Materials: Absorption and Transport",
                content: `## Overview

For photosynthesis to occur, plants must have efficient systems for:
- **Absorbing** raw materials from the air and soil
- **Transporting** them to the leaves, where the majority of food production takes place

This involves drawing water and mineral ions up from the ground and taking in carbon dioxide from the atmosphere.

## Absorption of Mineral Ions from the Soil

In addition to water, plants must absorb essential mineral salts, or **ions**, from the soil. This task is primarily carried out by specialized **root hair cells** located near the tips of the roots.

### The Challenge: Concentration Gradient

Often, the concentration of mineral ions like nitrates is already **higher inside the root hair cells** than in the surrounding soil. To move more ions into the root against this concentration gradient, plants use a process called **active transport**.

> **Active transport** is the movement of molecules and ions through a cell membrane, **against their concentration gradient**, using energy derived from respiration.

### How Active Transport Works

| Step | Process |
|------|---------|
| 1 | Specific **transport proteins** (carrier proteins) are embedded in the cell membrane |
| 2 | These proteins use **energy from respiration** to change shape |
| 3 | Ions are actively pushed from the soil into the cytoplasm of the root cell |
| 4 | This allows root hair cells to **accumulate ions** even from nutrient-poor soil |

## Internal Transport Systems

Once absorbed by the roots, water and mineral salts must be transported upwards to the leaves and other parts of the plant.

> **Xylem** vessels are the structures specifically adapted for the transport of water and mineral salts from the roots up to the rest of the plant.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Practical Investigation: Testing for Starch",
                content: `## Why Test for Starch?

In science, experimental evidence is crucial for verifying biological principles. Testing for the presence of starch is a fundamental and direct method to confirm that:
- **Photosynthesis has taken place**
- A plant has successfully **stored the energy** it produced

A positive result provides clear evidence of a plant's nutritional success.

## The Iodine Test

The standard laboratory procedure for detecting starch is the **iodine test**.

### Procedure

1. Draw a results chart to record your observations
2. Put a small piece of the food or plant material to be tested onto a **white tile**
3. Add a **drop or two** of the orange-brown iodine solution
4. Observe for any **colour change** and record the results in your chart

### Expected Results

| Result | Colour Change | Interpretation |
|--------|---------------|----------------|
| **Positive** | Orange-brown → **Blue-black** | Starch IS present |
| **Negative** | Remains **orange-brown** | Starch is NOT present |

## Interpreting the Evidence

This simple test is a powerful diagnostic tool:
- Finding starch in a plant tissue (such as a potato tuber or a leaf that has been in the light) is **direct evidence** of the plant's ability to create and store its own food
- It confirms that the processes of **photosynthesis and energy storage** have been successful`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Exam-Focused Key Terminology",
                content: `## Core Definitions

A clear understanding of scientific vocabulary is critical for interpreting questions and formulating accurate, concise answers in assessments.

| Term | Definition |
|------|------------|
| **Nutrition** | The taking in of materials for energy, growth and development |
| **Photosynthesis** | The process by which plants use energy from sunlight to make glucose, using carbon dioxide and water from the environment |
| **Chloroplast** | An organelle found in plant cells that contains chlorophyll and is the site of photosynthesis. Chloroplasts often contain stored starch grains. |
| **Chlorophyll** | The green pigment found in chloroplasts that absorbs energy from sunlight, which is then used for making food for the plant |
| **Active Transport** | The movement of molecules and ions in or out of a cell through the cell membrane, against a concentration gradient, using energy from respiration |
| **Xylem** | A type of plant tissue containing vessels that are responsible for the transport of water and mineral salts from the roots to the leaves |
| **Starch** | A complex carbohydrate (a polysaccharide) that is insoluble in water. It is the form in which plants store excess carbohydrates produced during photosynthesis. |

## Key Concepts Summary

1. Plants are **autotrophs** that make their own food through photosynthesis
2. **Chlorophyll** in chloroplasts absorbs light energy for photosynthesis
3. **Glucose** is the immediate product of photosynthesis; **starch** is for long-term storage
4. Root hair cells use **active transport** to absorb mineral ions against a concentration gradient
5. **Xylem** transports water and minerals from roots to leaves
6. The **iodine test** detects starch: positive result = blue-black colour`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Nutrition is the taking in of materials for energy, growth and development",
            "Plants are autotrophs - they manufacture complex food molecules from simple raw materials",
            "Animals are heterotrophs - they must feed on organic substances made by other living organisms",
            "Photosynthesis is the process where plants use energy from sunlight to synthesize glucose from carbon dioxide and water",
            "Chloroplasts are organelles that contain chlorophyll and are the site of photosynthesis",
            "Chlorophyll is the green pigment that absorbs energy from sunlight",
            "Glucose is the immediate product of photosynthesis; excess is converted to starch for long-term storage",
            "Starch grains are often found within chloroplasts where they were produced",
            "Active transport moves molecules and ions against their concentration gradient using energy from respiration",
            "Root hair cells use active transport to absorb mineral ions even from nutrient-poor soil",
            "Xylem vessels transport water and mineral salts from the roots up to the rest of the plant",
            "The iodine test detects starch: a blue-black colour indicates a positive result"
        ],
        exam_tips: [
            "Define nutrition precisely: 'the taking in of materials for energy, growth and development'",
            "Distinguish clearly between autotrophs (make own food) and heterotrophs (consume other organisms)",
            "Remember: Chloroplasts contain chlorophyll and are the SITE of photosynthesis",
            "Starch is the STORAGE form of glucose - plants convert excess glucose to starch",
            "Active transport requires ENERGY from respiration - it moves substances AGAINST the concentration gradient",
            "Root hair cells use active transport because mineral concentration is often HIGHER inside the cell than in soil",
            "Know your transport proteins: carrier proteins facilitate active transport by changing shape using ATP",
            "Xylem transports water and minerals UP from roots to leaves",
            "For the iodine test: orange-brown iodine turns BLUE-BLACK in the presence of starch",
            "A positive starch test provides EVIDENCE that photosynthesis has occurred and glucose has been stored"
        ]
    },

    "Animal Nutrition": {
        topic: "Animal Nutrition",
        subject: "Biology",
        summary: "Nutrition is the foundational process by which all animals obtain the necessary materials to live, grow, and function. It encompasses the intake and use of food, which provides both the energy to power our bodies and the raw materials to build and maintain them. This process ensures that every cell in an animal's body receives what it needs to perform its specific role, from muscle contraction to nerve impulses.",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Biology%20/Human%20Nutrition.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9CaW9sb2d5IC9IdW1hbiBOdXRyaXRpb24ubTRhIiwiaWF0IjoxNzY1MjUzNjIxLCJleHAiOjUyNjU3NDk2MjF9.VKKCAsrsGHS9PwFT4a0nPFSKeE6U_LVa6hXBN_kufGE",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Biology/Animal%20Transport.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0Jpb2xvZ3kvQW5pbWFsIFRyYW5zcG9ydC5tcDQiLCJpYXQiOjE3NjU4Mjc3ODQsImV4cCI6NTI2NjMyMzc4NH0.3YzlqwUaXD5QQZgh-D5d429Nw1GERZ9DubPnA-gD0LY",
        sections: [
            {
                title: "1. Introduction to Animal Nutrition",
                content: `## Defining Nutrition

> **Nutrition** is the "taking in of materials for energy, growth and development; plants require light, carbon dioxide, water and ions; animals need organic compounds and ions and usually need water."

This definition highlights the **three core purposes of eating**:

| Purpose | Description |
|---------|-------------|
| **Energy** | Nutrients in food (particularly carbohydrates and fats) are broken down through respiration. This releases energy for movement, maintaining body temperature, and cellular activities. |
| **Growth** | Materials from food are the building blocks for new cells and tissues. Growth is defined as a **permanent increase in size and mass**. Proteins are especially critical. |
| **Development & Health** | Nutrients are vital for repairing damaged tissues, producing essential molecules like enzymes and antibodies, and maintaining overall healthy functioning. |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. The Building Blocks: Types of Nutrients",
                content: `## 2.1 Carbohydrates

Carbohydrates are molecules made up of **carbon (C), hydrogen (H), and oxygen (O)**. They serve as the body's **primary and most readily available source of energy**.

| Type | Description | Examples |
|------|-------------|----------|
| **Simple sugars (monosaccharides)** | Small, soluble molecules that taste sweet | Glucose (main fuel for respiration) |
| **Complex carbohydrates (polysaccharides)** | Large molecules made of many sugar units joined together; typically insoluble | Starch, glycogen |

**Function**: Provide energy. Breakdown of 1g releases approximately **17 kJ of energy**.

**Storage**: Animals store excess carbohydrates in liver and muscles as **glycogen**.

## 2.2 Proteins

Proteins are large, complex molecules constructed from smaller units called **amino acids**. They contain **carbon, hydrogen, oxygen, nitrogen (N)** and sometimes **sulfur (S)**.

| Function | Description |
|----------|-------------|
| **Growth and Repair** | Primary building materials for making new cells and repairing damaged tissues |
| **Enzymes** | All enzymes are proteins—biological catalysts that speed up reactions |
| **Antibodies** | Specialized proteins that defend against pathogens |
| **Haemoglobin** | Protein in red blood cells that transports oxygen |

## 2.3 Fats (Lipids)

Fats are molecules made from **fatty acids and glycerol**. Like carbohydrates, they contain **carbon, hydrogen, and oxygen**.

| Function | Description |
|----------|-------------|
| **Energy Storage** | Most concentrated energy source. 1g of fat releases about **39 kJ of energy** (more than double carbohydrates) |
| **Insulation** | Adipose tissue beneath the skin reduces heat loss |
| **Cell Membranes** | Fats are fundamental structural components of all cell membranes |

## 2.4 Water

Water makes up approximately **80% of the human body**. Its unique properties make it essential for life:

- **Solvent**: Many substances dissolve in water; all metabolic reactions occur in solution
- **Cytoplasm**: The cytoplasm of cells is mostly water
- **Waste Removal**: Crucial for dissolving waste products (e.g., urea forms urine)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. From Food to Fuel: Digestion and Absorption",
                content: `## Why Digestion is Necessary

The nutrients we consume—such as starch and protein—are typically **large, complex, and insoluble molecules**. They are far too big to pass through intestine walls into the bloodstream.

The body must first **break them down into smaller, soluble molecules** that can be absorbed and transported to cells. This chemical breakdown process is called **digestion**.

## Chemical Digestion: The Role of Enzymes

Chemical digestion is carried out by **enzymes**—protein molecules that function as **biological catalysts**.

> A **catalyst** is a substance that speeds up a chemical reaction without being changed or used up by the reaction itself.

Enzymes are **highly specific**—each type acts on only one type of substrate:

| Enzyme Type | Substrate | Products |
|-------------|-----------|----------|
| **Carbohydrases** (e.g., amylase) | Starch | Simple sugars |
| **Proteases** (e.g., pepsin) | Proteins | Amino acids |
| **Lipases** | Fats (lipids) | Fatty acids and glycerol |

## The Lock-and-Key Mechanism

This specificity is explained by the **lock-and-key model**:
- Every enzyme has a uniquely shaped region called the **active site**
- The substrate has a **complementary shape** that fits perfectly into the active site
- When the substrate binds, the enzyme facilitates the reaction that breaks the substrate apart

*Example: A starch molecule fits into the active site of amylase, where it is broken down into smaller sugar molecules.*`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Factors Affecting Enzyme Action",
                content: `## Temperature

As temperature increases, molecules move faster, leading to **more frequent collisions** between enzymes and substrates, increasing the rate of reaction.

| Condition | Effect |
|-----------|--------|
| **Below optimum** | Reaction rate increases with temperature |
| **Optimum temperature** | Maximum enzyme efficiency (around **37°C** for human enzymes) |
| **Above optimum** | Enzyme structure breaks down; active site shape changes permanently |

When the enzyme's shape is permanently altered and it can no longer function, the enzyme is said to be **denatured**.

## pH

Each enzyme has an **optimal pH** at which it functions best.

| Condition | Effect |
|-----------|--------|
| **Optimal pH** | Maximum enzyme activity (pH 7 for most enzymes) |
| **Too acidic or alkaline** | Enzyme shape is altered; becomes **denatured** |

> **Key Exception**: **Pepsin** is a protease found in the stomach that functions optimally at a highly acidic **pH of around 2**.

## Summary Table

| Factor | Effect on Enzyme Activity |
|--------|---------------------------|
| Temperature | Increases rate up to optimum; DENATURES above optimum |
| pH | Works best at optimum pH; DENATURES at extreme pH values |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Absorption of Nutrients",
                content: `## How Nutrients Enter the Blood

Once digestion is complete, the resulting small, soluble molecules (glucose, amino acids, fatty acids, glycerol) are **absorbed from the intestine into the bloodstream**.

This occurs through two primary mechanisms:

## 1. Diffusion

> **Diffusion** is the "net movement of molecules and ions from a region of their **higher concentration** to a region of their **lower concentration** down a concentration gradient, as a result of their random movement."

After a meal:
- Concentration of digested food molecules is **high in the intestine**
- Concentration is **low in the blood**
- Nutrients move into the blood **via diffusion**

## 2. Active Transport

> **Active transport** is the "movement of molecules and ions in or out of a cell through the cell membrane, **against a concentration gradient**, using energy from respiration."

Active transport ensures that valuable nutrients like glucose can be efficiently absorbed from the intestine into the cells of the villi, **even when their concentration in the blood is already higher**.

## Comparison Table

| Feature | Diffusion | Active Transport |
|---------|-----------|------------------|
| **Direction** | High → Low concentration | Low → High concentration |
| **Energy Required** | No | Yes (from respiration) |
| **Example** | Nutrients moving after a meal | Glucose absorption when blood level is high |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Practical Investigations: Chemical Food Tests",
                content: `## Test for Starch

1. Place food sample onto a white tile or in a test tube
2. Add a few drops of **iodine solution**

| Result | Colour Change |
|--------|---------------|
| **Positive** | Orange-brown → **Blue-black** |
| **Negative** | Remains orange-brown |

## Test for Reducing Sugars (Benedict's Test)

1. Grind food and place in test tube with water; shake to dissolve
2. Add **Benedict's solution**
3. Heat in water bath at about **80°C** for a few minutes

| Result | Colour Change |
|--------|---------------|
| **Positive** | Blue → green → yellow → orange → **brick-red** (highest concentration) |
| **Negative** | Remains blue |

## Test for Protein (Biuret Test)

1. Place food sample in test tube with water
2. Add **potassium hydroxide solution**; shake
3. Add **two drops of copper sulfate solution**; shake gently

| Result | Colour Change |
|--------|---------------|
| **Positive** | Blue → **Purple** |
| **Negative** | Remains blue |

## Test for Fats (Ethanol Emulsion Test)

1. Chop food and place in a **dry** test tube
2. Add **absolute ethanol**; shake thoroughly
3. Pour ethanol into a test tube containing **water**

| Result | Appearance |
|--------|------------|
| **Positive** | **Milky-white precipitate** (emulsion) forms |
| **Negative** | Solution remains clear |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Nutrition and Human Health",
                content: `## The Importance of a Balanced Diet

A diet is considered **balanced** when it contains all the necessary nutrients in the correct proportions.

| Purpose | Key Nutrients | Importance |
|---------|---------------|------------|
| **For Energy** | Carbohydrates, Fats | Fuel all body activities and meet daily metabolic demands |
| **For Growth and Repair** | Proteins | Provide amino acids for new cells and tissue repair |
| **For Protection** | Proteins | Proteins produce **antibodies** that defend against pathogens |

## Water's Essential Role in Health

Adequate water intake is critical for maintaining health:
- **Universal solvent** for all metabolic reactions
- Main component of **blood plasma**
- Transports nutrients, hormones, and oxygen to cells
- Carries waste products away from cells`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Exam Focus and Revision Guide",
                content: `## Key Terminology

| Term | Definition |
|------|------------|
| **Nutrition** | Taking in of materials for energy, growth and development |
| **Enzyme** | A protein that functions as a biological catalyst |
| **Catalyst** | A substance that increases the rate of a chemical reaction and is not changed by the reaction |
| **Diffusion** | The net movement of molecules and ions from higher to lower concentration, down a concentration gradient, as a result of random movement |
| **Active Transport** | The movement of molecules and ions against a concentration gradient, using energy from respiration |
| **Denaturation** | The permanent change in enzyme shape caused by extreme temperature or pH |

## Core Concepts for Quick Revision

1. **Three main food groups**: carbohydrates, proteins, and fats—each with specific functions for energy, growth, and repair
2. **Enzymes are protein catalysts** that speed up the chemical reactions of digestion
3. Enzyme activity is described by the **lock-and-key model** and is highly affected by temperature and pH
4. High temperatures or extreme pH will permanently change enzyme shape, causing **denaturation**
5. Simple chemical tests identify nutrients: **iodine** for starch, **Benedict's** for sugars, **Biuret** for protein, **ethanol** for fat

## Common Misconceptions to Avoid

| ❌ Don't Say... | ✅ Do Say... |
|----------------|--------------|
| "High temperatures **kill** enzymes." | "High temperatures **denature** enzymes." (Enzymes are chemicals, not living organisms.) |
| "We need water so we don't dry out." | "Water is an essential **solvent for metabolic reactions** and is needed to **transport substances** around the body." |`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Nutrition is the taking in of materials for energy, growth and development",
            "Carbohydrates provide readily available energy (17 kJ/g); animals store excess as glycogen",
            "Proteins are made from amino acids and are essential for growth, repair, enzymes, and antibodies",
            "Fats provide concentrated long-term energy storage (39 kJ/g) and insulation",
            "Water is essential as a solvent for metabolic reactions and for transporting substances",
            "Digestion breaks down large, insoluble food molecules into small, soluble molecules for absorption",
            "Enzymes are biological catalysts that are highly specific to their substrates (lock-and-key model)",
            "Enzymes have an optimum temperature (37°C for humans) and optimum pH; extreme conditions cause denaturation",
            "Absorption occurs via diffusion (down concentration gradient) and active transport (against gradient, needs energy)",
            "Chemical food tests: iodine for starch, Benedict's for sugars, Biuret for protein, ethanol emulsion for fat",
            "A balanced diet provides all nutrients in correct proportions for energy, growth, repair, and protection",
            "Denaturation is the permanent change in enzyme shape—enzymes cannot be 'killed' as they are not living"
        ],
        exam_tips: [
            "Define nutrition precisely: 'the taking in of materials for energy, growth and development'",
            "Know the elements in each nutrient: Carbohydrates (C,H,O), Proteins (C,H,O,N), Fats (C,H,O)",
            "Remember energy values: Carbohydrates = 17 kJ/g, Fats = 39 kJ/g (more than double!)",
            "Enzymes are SPECIFIC—use the lock-and-key model to explain substrate fits into active site",
            "Never say enzymes are 'killed'—say 'DENATURED' (they are chemicals, not living things)",
            "Know optimum conditions: most enzymes work best at 37°C and pH 7; pepsin is an exception (pH 2)",
            "For food tests: state the reagent, method, AND positive result colour change",
            "Distinguish diffusion (passive, down gradient) from active transport (needs energy, against gradient)",
            "Glycogen is how ANIMALS store carbohydrates; starch is how PLANTS store carbohydrates",
            "A balanced diet is essential for three reasons: energy, growth/repair, and protection (antibodies)"
        ]
    },

    "Transport in Plants": {
        topic: "Transport in Plants",
        subject: "Biology",
        summary: "Multicellular plants, with specialized parts like roots buried in the soil and leaves reaching for the sun, require a dedicated internal transport system for survival. This biological plumbing network ensures that every cell receives the water and minerals it requires to function. The system acts as a distribution network using specialized tissues and cellular mechanisms including diffusion, osmosis, and active transport.",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Biology%20/Plant%20Transport.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9CaW9sb2d5IC9QbGFudCBUcmFuc3BvcnQubTRhIiwiaWF0IjoxNzY1MjUzNTMwLCJleHAiOjUyNjU3NDk1MzB9.FKAFgPEyXENkyvmBxFEeOMtuW2dICOVe-6-eAz5CO1U",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Biology/How_Plants_Defy_Gravity.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0Jpb2xvZ3kvSG93X1BsYW50c19EZWZ5X0dyYXZpdHkubXA0IiwiaWF0IjoxNzY1ODI3OTcxLCJleHAiOjg3NjY4MTk5NzF9.iS3kBTS0hUK_ci0uQ5b7sE0Lr0CN89KGmjoFYk5M4Eg",
        sections: [
            {
                title: "1. Introduction: The Vital Need for Transport in Plants",
                content: `## Why Plants Need a Transport System

Multicellular plants, unlike single-celled organisms that can absorb all necessary substances directly from their environment, face a significant logistical challenge. With specialized parts like roots buried in the soil and leaves reaching for the sun, a dedicated internal transport system is essential for survival and growth.

> **Transport in plants** is the internal movement of water and mineral salts from where they are absorbed (e.g., the roots) to all other parts of the plant where they are needed for life processes.

## Fundamental Roles of Plant Transport

| Role | Description |
|------|-------------|
| **Supplying Water and Minerals** | Delivering water and dissolved mineral salts absorbed by the roots to the leaves and other parts of the plant |
| **Providing Structural Support** | The movement and presence of water within plant tissues contribute to their rigidity, helping to support stems and leaves |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. The Cellular Basis of Movement: How Substances Cross Membranes",
                content: `## 2.1 Diffusion

> **Diffusion** is the net movement of molecules and ions from a region of their **higher concentration** to a region of their **lower concentration** down a concentration gradient, as a result of their random movement.

Diffusion is a **passive process**—it does not require the cell to expend any energy. It occurs because molecules are in constant, random motion.

**Biological Significance**: Plants require carbon dioxide for photosynthesis. The concentration of CO₂ is higher in the air than inside the leaf, so it **diffuses into the leaf**. Oxygen diffuses out in the opposite direction.

## 2.2 Osmosis

> **Osmosis** is the diffusion of water molecules from a region of **higher water potential** (dilute solution) to a region of **lower water potential** (concentrated solution), through a **partially permeable membrane**.

Osmosis is a special type of diffusion that applies exclusively to the movement of **water**. Water always moves down a water potential gradient.

| Cell Condition | What Happens | Result |
|---------------|--------------|--------|
| In pure water (high water potential) | Water enters cell via osmosis | Cell becomes firm and **turgid** |
| In concentrated solution (low water potential) | Water moves out of cell | Cell becomes **flaccid**; severe loss causes **plasmolysis** |

**Biological Significance**: Osmosis is the primary mechanism by which plant roots absorb water from the soil. Turgor pressure provides structural support.

## 2.3 Active Transport

> **Active transport** is the movement of molecules and ions in or out of a cell through the cell membrane, **against a concentration gradient**, using **energy from respiration**.

Active transport is fundamentally different—it **requires energy** from cellular respiration to move substances from low to high concentration.

**Biological Significance**: Allows plant roots to absorb and accumulate essential mineral ions (e.g., nitrates) from the soil, even when soil concentration is very low.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Specialized Structures for Transport",
                content: `## 3.1 Root Hair Cells: The Plant's Interface with the Soil

**Root hair cells** are specialized cells located near the tips of plant roots. Their primary function is to **absorb water and mineral salts** from the soil.

| Feature | Importance |
|---------|------------|
| **Location** | Near tips of plant roots |
| **Function** | Absorb water (by osmosis) and mineral salts (by active transport) |
| **Critical Role** | Main point of entry for water needed for photosynthesis and turgor, and minerals required for proteins |

## 3.2 Xylem Vessels: The Water and Mineral Superhighway

**Xylem vessels** are found in the stems, roots, and leaves of plants. They form a continuous network of hollow tubes throughout the plant.

### Two Essential Functions:

| Function | Description |
|----------|-------------|
| **Transport** | Transport water and dissolved mineral salts from the roots up to the rest of the plant, including stems and leaves |
| **Support** | Strong walls of xylem vessels provide mechanical strength and help support the plant structure |

These specialized structures work in concert—root hairs absorb substances that are then passed to the xylem for long-distance bulk transport.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Core Transport Processes Explained",
                content: `## 4.1 The Mechanism of Water Uptake

The absorption of water by a plant root is a direct application of **osmosis**.

### The Process:

1. Cell sap inside the root hair cell's vacuole contains sugars and salts
2. This gives it a **lower water potential** than soil water
3. Soil water is a dilute solution with **high water potential**
4. This difference establishes a **water potential gradient**
5. Water molecules move via osmosis from high potential (soil) to low potential (root hair cell)

## 4.2 The Mechanism of Mineral Absorption

Mineral uptake by roots relies heavily on **active transport** because plants need to accumulate essential ions to concentrations much higher than those found in the soil.

| Process | When It Occurs | Energy Required |
|---------|----------------|-----------------|
| **Active Transport** | Mineral concentration is LOWER in soil than inside root (most common) | YES (from respiration) |
| **Diffusion** | Mineral concentration happens to be HIGHER in soil than inside root | NO |

**Example**: The concentration of nitrate ions inside a root hair cell is often higher than in the soil. The plant must use energy to actively pump more nitrate ions into the root against the concentration gradient.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Exam-Focused Revision Guide",
                content: `## Key Term Definitions

| Term | Definition |
|------|------------|
| **Diffusion** | The net movement of molecules and ions from higher to lower concentration down a concentration gradient, as a result of random movement |
| **Osmosis** | The diffusion of water molecules from higher water potential to lower water potential through a partially permeable membrane |
| **Active Transport** | The movement of molecules and ions against a concentration gradient, using energy from respiration |
| **Partially permeable membrane** | A membrane that allows small molecules like water to pass but not larger solute molecules |
| **Water Potential** | A measure of the concentration of free water molecules; pure water has the highest water potential |
| **Turgid** | State of a plant cell when firm and swollen with water due to high internal pressure against the cell wall |
| **Plasmolysis** | Process where the cell membrane pulls away from the cell wall due to loss of water through osmosis |
| **Xylem Vessel** | Tissue that transports water and mineral salts from roots, and provides structural support |
| **Root Hair Cell** | Specialized cell that absorbs water and mineral salts from the soil |

## Core Concepts for Quick Revision

1. **Diffusion and osmosis are PASSIVE** processes—no energy required
2. **Active transport requires ENERGY** from respiration
3. **Osmosis is only about water** moving across a partially permeable membrane
4. Plant cells in pure water become **turgid but do not burst** (cellulose cell wall protection)
5. Plants use **active transport** to accumulate mineral ions like nitrates

## Common Misconceptions to Avoid

| ❌ Misconception | ✅ Clarification |
|-----------------|------------------|
| "Diffusion and osmosis are the same thing" | **Osmosis** is a SPECIFIC type of diffusion—only water molecules, only across a partially permeable membrane |
| "Water and minerals are absorbed in the same way" | **Water** is absorbed by osmosis (passive). **Minerals** are primarily absorbed by active transport (requires energy) |`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Transport in plants is the internal movement of water and mineral salts from roots to all other parts of the plant",
            "Diffusion is the net movement of molecules from higher to lower concentration—passive, no energy required",
            "Osmosis is the diffusion of water molecules from higher to lower water potential through a partially permeable membrane",
            "Active transport moves substances against a concentration gradient using energy from respiration",
            "Root hair cells absorb water by osmosis and mineral salts primarily by active transport",
            "Xylem vessels transport water and minerals upward AND provide structural support to the plant",
            "Turgid cells (full of water) provide support to plant structures; flaccid cells cause wilting",
            "Plasmolysis occurs when a plant cell loses so much water that the membrane pulls away from the cell wall",
            "Water potential gradient drives osmosis: water moves from high potential (dilute) to low potential (concentrated)",
            "Plants use active transport to accumulate minerals even when soil concentration is very low",
            "The cellulose cell wall prevents plant cells from bursting when they become turgid",
            "Diffusion allows gas exchange: CO₂ enters leaves (for photosynthesis), O₂ exits"
        ],
        exam_tips: [
            "Know the THREE key definitions precisely: diffusion, osmosis, active transport—these are frequently tested",
            "Osmosis is a SPECIFIC type of diffusion—only applies to WATER across a PARTIALLY PERMEABLE membrane",
            "Don't confuse how water and minerals are absorbed: water = osmosis (passive), minerals = active transport (needs energy)",
            "Remember: PASSIVE processes (diffusion, osmosis) need NO energy; ACTIVE transport REQUIRES energy from respiration",
            "Turgid = firm with water, Flaccid = limp, Plasmolysis = membrane pulls away from wall",
            "Xylem has TWO functions: transport of water/minerals AND structural support",
            "Water potential: pure water = highest; solutions have lower water potential",
            "Plant cells DON'T burst in pure water because the cellulose cell wall provides strength",
            "Active transport allows accumulation AGAINST the gradient—this is why it needs energy",
            "For exam questions about mineral absorption, mention active transport, energy from respiration, and against gradient"
        ]
    },

    "Transport in Humans": {
        topic: "Transport in Humans",
        subject: "Biology",
        summary: "In any complex, multicellular organism like a human, millions of individual cells require a constant supply of essential substances and a reliable method for removing waste products. The transport system is the body's internal delivery and waste disposal service, ensuring that every cell remains alive and functional. It delivers nutrients and oxygen, removes waste products, and transports key molecules like enzymes and antibodies.",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Biology%20/Human%20Transport.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9CaW9sb2d5IC9IdW1hbiBUcmFuc3BvcnQubTRhIiwiaWF0IjoxNzY1MjUzNjAyLCJleHAiOjUyNjU3NDk2MDJ9.9s4ztb4rdugaWg6YvAuY8KSbi18K0_3w1ZJ0FIFcHLQ",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Biology/Transport_in_Humans.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0Jpb2xvZ3kvVHJhbnNwb3J0X2luX0h1bWFucy5tcDQiLCJpYXQiOjE3NjU4MjgxNzksImV4cCI6NTI2NjMyNDE3OX0.vSYEqMA93a5SJXG5MsMl_9UdTxWF2chJV3QocLiPcys",
        sections: [
            {
                title: "1. Introduction: Why Transport is Essential for Life",
                content: `## The Need for a Transport System

In any complex, multicellular organism like a human, the body is composed of millions of individual cells working together. The vast majority of cells are located deep inside the body, far from any direct source of food or oxygen.

> The transport system is the body's internal **delivery and waste disposal service**, ensuring that every cell remains alive and functional.

## Core Functions of the Human Transport System

| Function | Description |
|----------|-------------|
| **Delivering Nutrients** | Simple sugars like glucose are transported in blood plasma to all cells for respiration |
| **Supplying Oxygen** | Red blood cells transport oxygen from the lungs to every tissue in the body |
| **Removing Waste Products** | Toxic waste products are carried away from cells to organs that can remove them from the body |
| **Transporting Key Molecules** | Enzymes (biological catalysts), antibodies (for fighting disease), and other vital substances |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. The Core Components: Cells and the Molecules of Life",
                content: `## 2.1 Water

Water is arguably the most important chemical for life:
- **Essential solvent** in which all metabolic reactions take place
- Substances must be **dissolved in water** to be transported in the blood
- Vital for helping to **get rid of waste products** from the body

## 2.2 Carbohydrates

Carbohydrates are the **primary source of energy** for the body:
- The simplest form is a sugar called **glucose**
- Glucose is transported around the body in the blood
- Used in **respiration** to release energy for cellular processes

## 2.3 Proteins

Proteins have a vast range of functions:

| Protein Type | Function |
|--------------|----------|
| **Haemoglobin** | Carries oxygen in red blood cells |
| **Antibodies** | Help protect the body from bacteria and viruses |
| **Enzymes** | Biological catalysts for all metabolic reactions |

## Red Blood Cells

Red blood cells are specialized for **transporting oxygen**:
- Contain haemoglobin (a protein that binds to oxygen)
- No nucleus—more room for haemoglobin
- Biconcave disc shape—large surface area for gas exchange`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. The Mechanisms of Movement: Crossing Cell Membranes",
                content: `## 3.1 Diffusion

> **Diffusion** is the net movement of molecules and ions from a region of their **higher concentration** to a region of their **lower concentration** down a concentration gradient, as a result of their random movement.

This process is **passive**—it does not require the cell to expend any energy.

**Biological Example**: Oxygen (high concentration in blood) **diffuses into body cells** (where concentration is lower). Carbon dioxide diffuses out in the opposite direction.

## 3.2 Osmosis

> **Osmosis** is the diffusion of water molecules from a region of **higher water potential** (dilute solution) to a region of **lower water potential** (concentrated solution), through a **partially permeable membrane**.

### Effect on Animal Cells:

| Condition | What Happens | Result |
|-----------|--------------|--------|
| **In Pure Water** (high water potential) | Water moves INTO the cell | Cell swells and may **BURST** (no cell wall to protect it) |
| **In Concentrated Solution** (low water potential) | Water moves OUT of the cell | Cell **shrinks and shrivels** |

## 3.3 Active Transport

> **Active Transport** is the movement of molecules and ions in or out of a cell through the cell membrane, **against a concentration gradient**, using **energy from respiration**.

Unlike diffusion and osmosis, this process **requires energy** and uses **carrier proteins** in the cell membrane.

**Biological Example**: Glucose absorption from the small intestine into the blood—even when blood glucose is already higher than in the intestine.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Comparison of Transport Mechanisms",
                content: `## Summary Table

| Feature | Diffusion | Osmosis | Active Transport |
|---------|-----------|---------|------------------|
| **Definition** | Net movement of particles from higher to lower concentration | Net movement of water from higher to lower water potential, across a partially permeable membrane | Movement of particles against a concentration gradient |
| **Energy Requirement** | **Passive** (no energy required) | **Passive** (no energy required) | **Active** (requires energy from respiration) |
| **Direction** | Down concentration gradient (high → low) | Down water potential gradient (high → low) | Against concentration gradient (low → high) |
| **Carrier Proteins?** | No | No | **Yes** |
| **Biological Example** | Oxygen diffusing from blood into body cells | Water moving into an animal cell, causing it to swell | Glucose absorbed from small intestine into blood |

## Key Differences to Remember

1. **Diffusion vs Osmosis**: Osmosis is a SPECIFIC type of diffusion—only water molecules, only across a partially permeable membrane
2. **Passive vs Active**: Diffusion and osmosis are PASSIVE (no energy); active transport is ACTIVE (needs energy)
3. **Direction**: Diffusion and osmosis move DOWN the gradient; active transport moves AGAINST the gradient`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Exam-Focused Revision Guide",
                content: `## Key Definitions

| Term | Definition |
|------|------------|
| **Diffusion** | The net movement of molecules and ions from higher to lower concentration down a concentration gradient, as a result of random movement |
| **Osmosis** | The diffusion of water molecules from higher water potential to lower water potential, through a partially permeable membrane |
| **Active Transport** | The movement of molecules and ions against a concentration gradient, using energy from respiration |
| **Enzyme** | A protein that functions as a biological catalyst |
| **Tissue** | A group of cells with similar structures, working together to perform a shared function |
| **Organ** | A structure made up of a group of tissues, working together to perform specific functions |
| **Organ System** | A group of organs with related functions, working together to perform body functions |

## Practice Questions

### Question 1: Differentiate between diffusion and active transport

**Key points to include:**
- Diffusion is **passive** (no energy); active transport **requires energy** from respiration
- Diffusion moves **down** concentration gradient; active transport moves **against** it
- Active transport requires **carrier proteins**; diffusion does not
- Example: Oxygen diffusing into cells (diffusion); glucose absorbed from intestine (active transport)

### Question 2: Animal cell in high water potential solution

**Key points to include:**
- Solution has **higher water potential** than cell's cytoplasm
- Water moves **INTO the cell** by osmosis
- Movement is across the **partially permeable membrane**
- Cell **swells and bursts** (animal cells lack a cell wall)

### Question 3: Why are water and proteins essential?

**Key points to include:**
- **Water**: Acts as a solvent for metabolic reactions; medium for transporting substances in blood
- **Proteins**: Haemoglobin carries oxygen; antibodies fight infection; enzymes catalyse reactions`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "The transport system delivers nutrients and oxygen to cells and removes waste products",
            "Glucose is the carbohydrate transported in blood—used for respiration to release energy",
            "Water is the essential solvent for metabolic reactions and transport of substances",
            "Proteins have multiple functions: haemoglobin (oxygen transport), antibodies (immunity), enzymes (catalysts)",
            "Diffusion is passive movement from high to low concentration—no energy required",
            "Osmosis is diffusion of water from high to low water potential through a partially permeable membrane",
            "Active transport moves substances AGAINST the concentration gradient using energy from respiration",
            "Animal cells in pure water will swell and burst (no cell wall protection)",
            "Animal cells in concentrated solutions will shrink and shrivel (water leaves by osmosis)",
            "Active transport requires carrier proteins embedded in the cell membrane",
            "Glucose absorption from the intestine is an example of active transport",
            "Red blood cells contain haemoglobin and are specialized for oxygen transport"
        ],
        exam_tips: [
            "Know the THREE key definitions precisely: diffusion, osmosis, active transport—these are frequently tested",
            "Always state whether a process is PASSIVE (no energy) or ACTIVE (requires energy from respiration)",
            "For diffusion: movement is HIGH to LOW concentration, PASSIVE, no carrier proteins needed",
            "For active transport: movement is LOW to HIGH concentration, ACTIVE, carrier proteins required",
            "Osmosis is a SPECIFIC type of diffusion—only applies to WATER across a PARTIALLY PERMEABLE membrane",
            "Animal cells BURST in pure water (unlike plant cells which become turgid due to cell wall)",
            "Animal cells SHRINK in concentrated solutions (water leaves by osmosis)",
            "Always give a biological example when asked to explain a transport mechanism",
            "Remember the four functions of transport: nutrients, oxygen, waste removal, and key molecules",
            "Water is a SOLVENT for metabolic reactions—this is its key role"
        ]
    },

    "Respiration": {
        topic: "Respiration",
        subject: "Biology",
        summary: "Respiration is the chemical reactions in cells that break down nutrient molecules and release energy for metabolism. This energy fuels every action, from movement and growth to complex chemical processes. The process occurs in all living organisms, with glucose as the primary fuel source, and takes place in specialized organelles called mitochondria.",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Biology%20/Respiration.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9CaW9sb2d5IC9SZXNwaXJhdGlvbi5tNGEiLCJpYXQiOjE3NjUyNTM1NzQsImV4cCI6NTI2NTc0OTU3NH0.0mK5SjVqZz6gdjTAlMzekrlFUPdurYfCdy3Mnbmv3Lg",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Biology/Respiration.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0Jpb2xvZ3kvUmVzcGlyYXRpb24ubXA0IiwiaWF0IjoxNzY1ODI4MTUxLCJleHAiOjUyNjYzMjQxNTF9.xJEcKEdWm3t58_J0ZB3aGU0g7b4TSrDus15dwiGw_-k",
        sections: [
            {
                title: "1. Introduction to Respiration: The Energy of Life",
                content: `## What is Respiration?

> **Respiration** is the chemical reactions in cells that break down nutrient molecules and release energy for metabolism.

All living organisms require a constant supply of energy to survive. This energy fuels every action, from movement and growth to the complex chemical processes occurring within every cell.

## Core Principles of Respiration

| Principle | Description |
|-----------|-------------|
| **Energy Release** | The primary function is to release the energy locked within nutrient molecules |
| **Universal Process** | Respiration occurs in the cells of ALL living things, including plants |
| **Fuel Source** | The carbohydrate **glucose** is the nutrient normally used by cells to fuel this process |

## The Purpose of Released Energy

The energy released powers **metabolism**—all the chemical reactions that happen inside a living organism to maintain life.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. The Site of Respiration: The Mitochondrion",
                content: `## The Powerhouse of the Cell

> **Mitochondria** (singular: mitochondrion) are the specific sites where **aerobic respiration** takes place.

Often called the "powerhouses of the cell," mitochondria are found in almost all cells, with the notable exception of prokaryotes (like bacteria).

## Mitochondria and Energy Demands

The number of mitochondria within a cell is directly related to its **energy requirements**. Cells with high metabolic activity are packed with thousands of these organelles.

| Cell Type | Why They Need Many Mitochondria |
|-----------|--------------------------------|
| **Muscle cells** | Require vast amounts of energy to contract and enable movement |
| **Sperm cells** | Need significant energy to power the tail for swimming towards the egg |
| **Nerve cells (neurones)** | Transmission of nerve impulses is an energy-intensive process |

## Key Point

The more energy a cell needs, the more mitochondria it contains.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Energy in Action: Powering Active Transport",
                content: `## The Link Between Respiration and Active Transport

The energy released during respiration is the **currency** that cells use to perform work. One of the most important jobs powered by this energy is **active transport**.

> **Active transport** is the movement of molecules and ions in or out of a cell through the cell membrane, **against a concentration gradient**, using energy from respiration.

## How Energy Powers Active Transport

| Step | Process |
|------|---------|
| 1 | Chemical energy is released from glucose during respiration |
| 2 | This energy is used by **transport proteins** embedded in the cell membrane |
| 3 | The energy forces proteins to **change shape** |
| 4 | This creates kinetic energy to actively **push molecules and ions** across the membrane |
| 5 | Substances move from **low concentration to high concentration** |

## Biological Example

This allows a cell to **accumulate essential substances**, like nitrate ions in plant root hairs, even when their concentration is higher inside the cell than in the surrounding soil.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Fuel for the Cell: The Chemicals of Life",
                content: `## The Primary Fuel: Glucose

The single most important fuel for respiration in both plant and animal cells is **glucose**, a simple carbohydrate. It is the molecule that cells normally break down to release energy for all metabolic processes.

## Macromolecules as Energy Sources

| Macromolecule | Primary Role in Energy | Key Facts |
|---------------|------------------------|-----------|
| **Carbohydrates** | The **normal and most readily available** source of energy for cells | Glucose is transported in blood plasma to all cells that need it |
| **Fats** | A **secondary, high-yield** energy source and long-term store | One gram of fat releases **more than twice** as much energy as one gram of carbohydrate. Used only after carbohydrates are depleted |
| **Proteins** | **Not normally used** to provide energy | Primary roles are for growth, repairing damaged parts, and making new cells, antibodies, and enzymes |

## Energy Priority

1. **First**: Carbohydrates (glucose)
2. **Second**: Fats (only when carbohydrates are depleted)
3. **Last resort**: Proteins (not normally used for energy)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Controlling the Reaction: The Role of Enzymes",
                content: `## Enzymes in Respiration

Respiration is a complex metabolic pathway consisting of many individual chemical reactions. These reactions require **biological catalysts** to proceed at a rate fast enough to sustain life.

> **Enzymes** are proteins that speed up the rate of a chemical reaction without being used up or changed in the process.

## Factors Affecting Enzyme Activity

### Temperature

| Condition | Effect |
|-----------|--------|
| **Increasing temperature** | Molecules move faster → more collisions → faster reaction rate |
| **Optimum temperature** | Maximum efficiency (around **37°C** for most human enzymes) |
| **Too high temperature** | Bonds break → enzyme loses shape → **DENATURATION** |

### pH

| Condition | Effect |
|-----------|--------|
| **Optimum pH** | Maximum efficiency (around **pH 7** for most enzymes) |
| **Too acidic or alkaline** | Enzyme shape is altered → **DENATURATION** |

## Key Point

Because enzymes control respiration, the **rate of respiration** is directly affected by temperature and pH. Extreme conditions cause denaturation, stopping the reaction.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Exam-Focused Revision Guide",
                content: `## Key Terminology

| Term | Definition |
|------|------------|
| **Respiration** | The chemical reactions in cells that break down nutrient molecules and release energy for metabolism |
| **Mitochondria** | Organelles known as the "powerhouses of the cell," which are the sites of aerobic respiration |
| **Active Transport** | The movement of molecules and ions against a concentration gradient, using energy from respiration |
| **Enzyme** | A protein that functions as a biological catalyst, increasing the rate of a chemical reaction without being changed by it |
| **Denaturation** | The permanent change in enzyme shape caused by extreme temperature or pH |

## Core Revision Points

1. **Purpose of Respiration**: Breaks down nutrient molecules (like glucose) to release energy for ALL metabolic reactions
2. **Site of Aerobic Respiration**: Occurs inside the **mitochondria** in cells of animals, plants, and most other organisms
3. **High energy cells**: Muscle cells, sperm cells, and nerve cells have HIGH numbers of mitochondria
4. **Energy Use**: Energy from respiration powers cellular work, including **active transport**
5. **Fuel Sources**: Preferred fuel is **carbohydrates (glucose)**; fats are secondary; proteins are NOT normally used for energy
6. **Enzymatic Control**: Respiration is controlled by enzymes; affected by temperature and pH; extreme conditions cause **denaturation**

## Common Misconception

| ❌ Don't Confuse | ✅ Remember |
|-----------------|-------------|
| Respiration ≠ Breathing | **Respiration** is a chemical reaction in cells; **breathing** (ventilation) is the physical movement of air in and out of lungs |`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Respiration is the chemical reactions in cells that break down nutrient molecules and release energy for metabolism",
            "Respiration occurs in ALL living organisms, including plants—it is a universal process",
            "Glucose is the carbohydrate normally used by cells as the primary fuel for respiration",
            "Mitochondria are the sites of aerobic respiration—they are the 'powerhouses of the cell'",
            "Cells with high energy demands (muscle, sperm, nerve cells) contain many mitochondria",
            "The energy released by respiration powers active transport and other cellular work",
            "Active transport moves substances against a concentration gradient using energy from respiration",
            "Carbohydrates are the primary energy source; fats are secondary (release more than 2x energy per gram)",
            "Proteins are NOT normally used for energy—they are for growth, repair, and making enzymes/antibodies",
            "Enzymes control the rate of respiration and are affected by temperature and pH",
            "Enzymes have an optimum temperature (37°C) and pH (7); extreme conditions cause denaturation",
            "Denaturation is the permanent change in enzyme shape that stops the reaction"
        ],
        exam_tips: [
            "Define respiration precisely: 'chemical reactions in cells that break down nutrient molecules and release energy for metabolism'",
            "Don't confuse RESPIRATION (chemical reaction in cells) with BREATHING (ventilation—physical movement of air)",
            "Mitochondria are the SITE of aerobic respiration—remember they are the 'powerhouses of the cell'",
            "Link respiration to active transport: respiration releases energy that POWERS active transport",
            "Know the fuel priority: Carbohydrates FIRST, then fats, proteins are NOT normally used for energy",
            "Fats release MORE THAN TWICE the energy per gram compared to carbohydrates",
            "Cells with high energy needs have MANY mitochondria—give examples: muscle cells, sperm cells, nerve cells",
            "Enzymes have OPTIMUM temperature (37°C) and pH (7)—extreme conditions cause DENATURATION",
            "Denaturation is PERMANENT—the enzyme loses its shape and can no longer catalyse the reaction",
            "Remember: respiration occurs in ALL living organisms, not just animals"
        ]
    },

    "Excretion": {
        topic: "Excretion",
        subject: "Biology",
        summary: "Excretion is one of the fundamental processes that distinguishes living things from non-living objects. It is a vital activity carried out by all organisms, essential for maintaining a stable, constant internal environment. By removing harmful and unnecessary substances—including metabolic waste products, toxic materials, and substances in excess of requirements—excretion ensures that the body's internal chemistry remains balanced and life can be sustained.",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Biology%20/Excretion.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9CaW9sb2d5IC9FeGNyZXRpb24ubTRhIiwiaWF0IjoxNzY1MjUzNjc4LCJleHAiOjUyNjU3NDk2Nzh9.tOR6Sw5EtRl_RUYRRXf9SBw9BcbVSl0PD8yUMCg1BL4",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Biology/Excretion__Your_Body_s_Cleanup_Crew.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0Jpb2xvZ3kvRXhjcmV0aW9uX19Zb3VyX0JvZHlfc19DbGVhbnVwX0NyZXcubXA0IiwiaWF0IjoxNzY1ODI3ODc5LCJleHAiOjUyNjYzMjM4Nzl9.kPwPg4xwfj9CbH7r5JIFI06-YP7q7RgK6HrVVLdRs6U",
        sections: [
            {
                title: "1. Introduction to Excretion",
                content: `## What is Excretion?

> **Excretion** is the removal from organisms of the **waste products of metabolism** (chemical reactions in cells including respiration), **toxic materials**, and **substances in excess of requirements**.

Excretion is one of the fundamental characteristics of all living organisms. It is essential for maintaining a stable, constant internal environment, which is critical for the proper functioning of cells and the survival of the organism.

## The Importance of Excretion

The definition outlines **three distinct reasons** why excretion is vital for survival:

| Type of Substance | Why Removal is Essential |
|-------------------|-------------------------|
| **Waste products of metabolism** | By-products of processes like respiration. If allowed to accumulate, they interfere with cell function and become poisonous. |
| **Toxic materials** | Substances that are inherently poisonous. Must be eliminated before they damage cells and tissues. |
| **Substances in excess of requirements** | Too much of any substance (e.g., water, mineral ions) disrupts the internal balance. Excretion removes the surplus. |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Excretory Organs in Humans",
                content: `## The Excretory System

In complex organisms such as humans, excretion is not handled by a single organ but by a **coordinated system of organs**. These specialized structures filter the blood and remove specific types of waste products.

## The Kidneys: Key Excretory Organs

The kidneys are the primary excretory organs in humans. Their function is to:
- **Remove the waste product urea** from the blood
- **Dissolve urea in water** to form urine
- **Filter blood** continuously to maintain internal balance

## Urea Formation

| Step | Process |
|------|---------|
| 1 | Excess **amino acids** are taken to the **liver** |
| 2 | The liver breaks down amino acids in a process called **deamination** |
| 3 | This produces the waste product **urea** |
| 4 | Urea is transported in the **blood** to the kidneys |
| 5 | The kidneys remove urea from the blood and excrete it as **urine** |

## Other Excretory Organs

| Organ | What It Excretes |
|-------|------------------|
| **Kidneys** | Urea, excess water, excess salts (as urine) |
| **Lungs** | Carbon dioxide (and water vapour) |
| **Skin** | Water, salts, some urea (as sweat) |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. The Structure of the Kidney",
                content: `## External Structure

Each kidney receives blood via the **renal artery** and returns filtered blood via the **renal vein**. The **ureter** carries urine from the kidney to the bladder.

## Internal Regions

| Region | Location | Function |
|--------|----------|----------|
| **Cortex** | Outer region | Contains the filtering units (Bowman's capsules and glomeruli) |
| **Medulla** | Inner region | Contains collecting tubules that concentrate urine |
| **Renal pelvis** | Central cavity | Collects urine before it passes to the ureter |

## The Nephron: Functional Unit of the Kidney

Each kidney contains over **one million nephrons**. These microscopic structures are responsible for filtering blood and producing urine.

### Key Parts of a Nephron:

| Structure | Function |
|-----------|----------|
| **Bowman's capsule** | Cup-shaped structure that surrounds the glomerulus; receives filtrate |
| **Glomerulus** | A knot of capillaries where blood is filtered under high pressure |
| **Proximal convoluted tubule** | Reabsorbs useful substances (glucose, amino acids, some water) |
| **Loop of Henle** | Creates concentration gradient for water reabsorption |
| **Distal convoluted tubule** | Fine-tunes salt and water balance |
| **Collecting duct** | Collects urine from multiple nephrons; final water reabsorption |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Processes in Excretion",
                content: `## Urine Formation: A Multi-Step Process

The kidneys form urine through three key processes:

### 1. Ultrafiltration

| Feature | Description |
|---------|-------------|
| **Location** | Glomerulus and Bowman's capsule |
| **Process** | Blood is filtered under high pressure |
| **What passes through** | Water, glucose, amino acids, urea, salts (small molecules) |
| **What stays in blood** | Large molecules (proteins) and blood cells |

### 2. Selective Reabsorption

| Feature | Description |
|---------|-------------|
| **Location** | Proximal convoluted tubule (mainly) |
| **Process** | Useful substances are reabsorbed back into the blood |
| **What is reabsorbed** | ALL glucose, ALL amino acids, MOST water, SOME salts |
| **How** | Combination of diffusion and **active transport** (requires energy) |

### 3. Secretion and Concentration

- Additional waste substances may be **secreted** into the tubule
- Water is reabsorbed in the collecting duct to **concentrate urine**
- The remaining liquid (containing urea, excess salts, excess water) is **urine**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Exam-Focused Revision Guide",
                content: `## Key Definition

> **Excretion**: Removal from organisms of the waste products of metabolism (chemical reactions in cells including respiration), toxic materials, and substances in excess of requirements.

## Core Revision Points

1. **Excretion is a characteristic of ALL living organisms**
2. The process removes THREE types of substances: metabolic waste, toxic materials, and excess substances
3. **Kidneys** are the main excretory organs in humans—they form urine by removing urea from the blood
4. **Urea** is produced by the liver from excess amino acids (deamination)
5. Urea is dissolved in water to form **urine**

## Key Structures Summary

| Structure | Role in Excretion |
|-----------|-------------------|
| **Liver** | Produces urea from excess amino acids |
| **Kidneys** | Filter blood, remove urea, form urine |
| **Lungs** | Excrete carbon dioxide |
| **Skin** | Excretes water, salts, and some urea (sweat) |

## Common Misconception

| ❌ Don't Confuse | ✅ Clarification |
|-----------------|------------------|
| **Excretion** | Removal of metabolic WASTE PRODUCTS (substances produced BY the body's cells) |
| **Egestion** | Removal of UNDIGESTED FOOD (substances that were never absorbed into the body) |

**Remember**: Faeces contain undigested food and are removed by egestion, NOT excretion.`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Excretion is the removal from organisms of metabolic waste products, toxic materials, and substances in excess of requirements",
            "Excretion is one of the fundamental characteristics of ALL living organisms",
            "Metabolic waste products must be removed because they would become poisonous if allowed to accumulate",
            "The kidneys are the main excretory organs in humans—they form urine by removing urea from blood",
            "Urea is produced by the liver from excess amino acids through a process called deamination",
            "Urea is dissolved in water to form urine, which is excreted from the body",
            "Lungs excrete carbon dioxide (a waste product of respiration) and water vapour",
            "Skin excretes water, salts, and some urea through sweat",
            "The nephron is the functional unit of the kidney—each kidney contains over one million nephrons",
            "Ultrafiltration occurs in the glomerulus; useful substances are reabsorbed in the tubules",
            "Selective reabsorption uses active transport to reabsorb glucose and amino acids back into the blood",
            "Excretion is different from egestion—egestion removes undigested food, not metabolic waste"
        ],
        exam_tips: [
            "Define excretion precisely: 'removal of metabolic waste products, toxic materials, and substances in excess of requirements'",
            "Don't confuse EXCRETION (metabolic waste) with EGESTION (undigested food—faeces)",
            "Remember the THREE things excretion removes: metabolic waste, toxic materials, excess substances",
            "Urea is made in the LIVER from excess amino acids (deamination), then transported to KIDNEYS",
            "Know the excretory organs: Kidneys (urea/urine), Lungs (CO₂), Skin (sweat)",
            "Ultrafiltration occurs at high pressure in the glomerulus—small molecules pass through, large ones don't",
            "Selective reabsorption uses ACTIVE TRANSPORT (needs energy) to reabsorb glucose and amino acids",
            "ALL glucose and amino acids are reabsorbed—they should NOT appear in urine",
            "If glucose appears in urine, it indicates a problem (e.g., diabetes)",
            "Remember: excretion maintains the stable internal environment needed for cell function"
        ]
    },

    "Coordination and Response": {
        topic: "Coordination and Response",
        subject: "Biology",
        summary: "For any living organism to survive, it must be able to interact with its environment by detecting changes and reacting appropriately. This ability is called sensitivity—the ability to detect stimuli in the internal or external environment and make appropriate responses. The body uses two coordination systems: the nervous system (fast, electrical impulses) and the endocrine system (slower, chemical hormones).",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Biology%20/Biological_Foundation_Cells_Transport_Enzymes.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9CaW9sb2d5IC9CaW9sb2dpY2FsX0ZvdW5kYXRpb25fQ2VsbHNfVHJhbnNwb3J0X0VuenltZXMubTRhIiwiaWF0IjoxNzY1MjUzNzg2LCJleHAiOjUyNjU3NDk3ODZ9.6FHGyq2SbYDA4XyLrlIusUYhMaMLLqu7eiwFZMQSkfY",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Biology/Coordination_and_Response.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0Jpb2xvZ3kvQ29vcmRpbmF0aW9uX2FuZF9SZXNwb25zZS5tcDQiLCJpYXQiOjE3NjU4Mjc4MTAsImV4cCI6NTI2NjMyMzgxMH0.ah4eeWUwmNw1dCii8OO84Y9Gm2HnkZSbJ2BDeKdGOKc",
        sections: [
            {
                title: "1. Introduction to Coordination and Response",
                content: `## The Core Principle of Sensitivity

For any living organism to survive, it must be able to interact with its environment. This interaction is a carefully managed process of detecting changes and reacting to them in a way that promotes survival and well-being.

> **Sensitivity** is the ability to detect or sense stimuli in the internal or external environment and to make **appropriate responses**.

## Why Sensitivity is Essential for Survival

| Function | Importance |
|----------|------------|
| **Finding resources** | Detecting food, water, and shelter |
| **Avoiding harm** | Escaping predators and dangerous conditions |
| **Maintaining balance** | Keeping a stable internal state (**homeostasis**) |

## The Stimulus-Response Chain

| Step | Component | Function |
|------|-----------|----------|
| 1 | **Stimulus** | A change in the environment (internal or external) |
| 2 | **Receptor** | Detects the stimulus |
| 3 | **Coordinator** | Processes information (brain, spinal cord) |
| 4 | **Effector** | Produces a response (muscles, glands) |
| 5 | **Response** | The action taken in response to the stimulus |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. The Nervous System: The Body's Communication Network",
                content: `## The Role of the Nervous System

The nervous system acts as the body's **high-speed electrochemical communication network**. Its strategic importance lies in its ability to transmit information with incredible speed, allowing for near-instantaneous coordination of different body parts.

## Nerve Cells (Neurones)

The fundamental units of the nervous system are specialized cells called **nerve cells** or **neurones**.

> **Function of nerve cells**: To transmit information throughout the body in the form of **electrical impulses**.

## Why Nerve Cells Need Many Mitochondria

Transmitting electrical signals is **extremely energy-intensive**. Nerve cells contain a **large number of mitochondria** to supply the substantial amount of energy required for impulse transmission.

| Feature | Significance |
|---------|-------------|
| **Electrical impulses** | Fast transmission of signals throughout the body |
| **Many mitochondria** | Provide energy (from aerobic respiration) for impulse transmission |
| **Specialized structure** | Long axons allow impulses to travel great distances |

## The Central Nervous System (CNS)

| Component | Function |
|-----------|----------|
| **Brain** | Processes information, makes decisions, coordinates responses |
| **Spinal cord** | Relays information between brain and body; controls reflex actions |

## The Peripheral Nervous System (PNS)

Nerves that connect the CNS to the rest of the body, carrying impulses to and from receptors and effectors.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Sense Organs and Receptors: Detecting the World",
                content: `## The Role of Receptors

Sense organs and receptors serve as the **critical gateways** through which an organism receives information about its external and internal world. They detect specific types of stimuli and convert them into electrical signals.

## Types of Receptors

| Receptor Type | What It Detects | Location/Sense Organ |
|---------------|-----------------|---------------------|
| **Photoreceptors** | Light | Eye (retina) |
| **Chemoreceptors** | Chemicals | Tongue (taste), Nose (smell) |
| **Thermoreceptors** | Temperature changes | Skin |
| **Mechanoreceptors** | Pressure, touch, sound | Skin, Ear |
| **Proprioceptors** | Body position | Muscles, joints |

## The Eye: Key Sense Organ

The eye contains **photoreceptors** (rods and cones) that detect light and enable vision.

| Part | Function |
|------|----------|
| **Cornea** | Refracts (bends) light entering the eye |
| **Iris** | Controls the amount of light entering (pupil size) |
| **Lens** | Focuses light onto the retina |
| **Retina** | Contains photoreceptors; converts light into nerve impulses |
| **Optic nerve** | Carries impulses from the retina to the brain |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. The Endocrine System: Chemical Coordination",
                content: `## Introduction to the Endocrine System

In addition to the nervous system, the body has a second coordination system: the **endocrine system**. This system uses chemical messengers called **hormones**.

## Comparing the Two Systems

| Feature | Nervous System | Endocrine System |
|---------|----------------|------------------|
| **Signal type** | Electrical impulses | Chemical hormones |
| **Speed** | Very fast (milliseconds) | Slower (seconds to hours) |
| **Duration** | Short-lived | Longer-lasting effects |
| **Pathway** | Along nerves | Through bloodstream |
| **Target** | Specific muscles/glands | Target organs throughout body |

## Key Hormones and Their Functions

| Hormone | Gland | Function |
|---------|-------|----------|
| **Adrenaline** | Adrenal glands | Prepares body for "fight or flight" |
| **Insulin** | Pancreas | Lowers blood glucose levels |
| **Glucagon** | Pancreas | Raises blood glucose levels |
| **Growth hormone** | Pituitary | Promotes growth and development |

## Hormones and Homeostasis

Hormones play a crucial role in maintaining a **stable internal environment** (homeostasis), including regulating:
- Blood glucose levels (insulin and glucagon)
- Water balance
- Body temperature`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Exam-Focused Revision Guide",
                content: `## Key Definition

> **Sensitivity**: The ability to detect or sense stimuli in the internal or external environment and to make appropriate responses.

## Core Revision Points

1. **Sensitivity** is a fundamental characteristic of all living organisms
2. The **nervous system** uses electrical impulses for fast, short-lived responses
3. The **endocrine system** uses hormones for slower, longer-lasting responses
4. **Nerve cells** transmit electrical impulses and contain many mitochondria for energy
5. **Receptors** detect stimuli; **effectors** (muscles, glands) produce responses

## Key Terms Summary

| Term | Definition |
|------|------------|
| **Stimulus** | A change in the environment that can be detected |
| **Receptor** | A structure that detects stimuli |
| **Effector** | A structure that produces a response (muscle or gland) |
| **Neurone** | A nerve cell that transmits electrical impulses |
| **Hormone** | A chemical messenger transported in the blood |
| **Homeostasis** | Maintaining a stable internal environment |

## Nervous vs Endocrine: Key Comparison

| Nervous System | Endocrine System |
|----------------|------------------|
| Fast | Slow |
| Electrical impulses | Chemical hormones |
| Short-lived effects | Long-lasting effects |
| Transmitted along nerves | Transported in blood |`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Sensitivity is the ability to detect stimuli and make appropriate responses—a fundamental characteristic of life",
            "The nervous system transmits electrical impulses for fast, short-lived coordination",
            "The endocrine system uses chemical hormones for slower, longer-lasting coordination",
            "Nerve cells (neurones) transmit information as electrical impulses throughout the body",
            "Nerve cells contain many mitochondria because impulse transmission requires large amounts of energy",
            "The CNS consists of the brain and spinal cord; the PNS connects the CNS to the rest of the body",
            "Receptors detect stimuli (e.g., photoreceptors detect light); effectors produce responses",
            "Hormones are chemical messengers transported in the bloodstream to target organs",
            "The stimulus-response chain: Stimulus → Receptor → Coordinator → Effector → Response",
            "Homeostasis is maintaining a stable internal environment, regulated by hormones",
            "Adrenaline prepares the body for 'fight or flight'; insulin lowers blood glucose",
            "The eye contains photoreceptors in the retina that convert light into nerve impulses"
        ],
        exam_tips: [
            "Define sensitivity precisely: 'the ability to detect stimuli and make appropriate responses'",
            "Know the stimulus-response chain: Stimulus → Receptor → Coordinator → Effector → Response",
            "Nerve cells have MANY MITOCHONDRIA because impulse transmission needs lots of ENERGY",
            "Nervous system = FAST, ELECTRICAL, SHORT-LIVED; Endocrine = SLOW, CHEMICAL, LONG-LASTING",
            "CNS = Brain + Spinal cord; PNS = nerves connecting CNS to body",
            "Receptors DETECT stimuli; Effectors PRODUCE responses (muscles contract, glands secrete)",
            "Hormones travel in the BLOOD to reach their target organs",
            "Know key hormones: Adrenaline (fight/flight), Insulin (lowers glucose), Glucagon (raises glucose)",
            "Homeostasis = maintaining STABLE INTERNAL ENVIRONMENT (e.g., blood glucose, temperature)",
            "The eye: Cornea refracts light → Lens focuses → Retina contains receptors → Optic nerve to brain"
        ]
    },

    "Reproduction": {
        topic: "Reproduction",
        subject: "Biology",
        summary: "Reproduction ensures the continuation of species through asexual or sexual reproduction.",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Biology%20/Fertile_Offspring_DNA_and_Hormones.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9CaW9sb2d5IC9GZXJ0aWxlX09mZnNwcmluZ19ETkFfYW5kX0hvcm1vbmVzLm00YSIsImlhdCI6MTc2NTI1MzY1MCwiZXhwIjo1MjY1NzQ5NjUwfQ.12jtglK9kisa9KCsfPGiQzGuGUjfj_mcszmmNUUBV6s",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Biology/Reproduction__Life_s_Greatest_Story.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0Jpb2xvZ3kvUmVwcm9kdWN0aW9uX19MaWZlX3NfR3JlYXRlc3RfU3RvcnkubXA0IiwiaWF0IjoxNzY1ODI4MTI4LCJleHAiOjUyNjYzMjQxMjh9.0Fr3y3yVWgI0CovgZSqmCgHKFcdosGsp0mLK9HRC0zE",
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
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Biology%20/Cell_Structure_Function_Organization_and_Life.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9CaW9sb2d5IC9DZWxsX1N0cnVjdHVyZV9GdW5jdGlvbl9Pcmdhbml6YXRpb25fYW5kX0xpZmUubTRhIiwiaWF0IjoxNzY1NTc5MzgxLCJleHAiOjUyNjYwNzUzODF9.mjGx73Uw3iKpp0VxVY1s-jaadfD8KGbuXe7rI71wj9c",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Biology/Organisms%20and%20Environment.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0Jpb2xvZ3kvT3JnYW5pc21zIGFuZCBFbnZpcm9ubWVudC5tcDQiLCJpYXQiOjE3NjU4MjgwNTMsImV4cCI6ODc2NjgyMDA1M30.6sqYFFQClcZlSHZi2dpMdflLKMgowV28R3MBaI3Rsb8",
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
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Biology%20/Cell_Structure_Transport_and_Enzymes.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9CaW9sb2d5IC9DZWxsX1N0cnVjdHVyZV9UcmFuc3BvcnRfYW5kX0VuenltZXMubTRhIiwiaWF0IjoxNzY1NDcyNjYyLCJleHAiOjUyNjU5Njg2NjJ9.SDjQaBH2AZ97U4mVvmdTb-HZC81St3P25axNcoj2698",
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
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Biology%20/Naming_Life_and_The_Five_Kingdoms.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9CaW9sb2d5IC9OYW1pbmdfTGlmZV9hbmRfVGhlX0ZpdmVfS2luZ2RvbXMubTRhIiwiaWF0IjoxNzY1NDY3OTc4LCJleHAiOjUyNjU5NjM5Nzh9.tnV1OnmqkvJoG-jcTa3ol20A7KalhFb2hleC5wldIGA",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Biology/Lets%20Classification%20of%20orgnisms.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0Jpb2xvZ3kvTGV0cyBDbGFzc2lmaWNhdGlvbiBvZiBvcmduaXNtcy5tcDQiLCJpYXQiOjE3NjU4Mjc5OTEsImV4cCI6NTI2NjMyMzk5MX0.P5axp4sSHxRB27FpcMnJZol80PB7l92Ux3XyJXrOmcE",
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
