// Chemistry Notes - All 11 Topics for ZIMSEC Combined Science
import { TopicNotes } from './types';

// List of all Chemistry topics (matching constants.py) - ZIMSEC O-Level Syllabus
export const chemistryTopics: string[] = [
    // Physical & Theoretical Chemistry
    "States of Matter",
    "Atoms, Elements and Compounds",
    "Chemical Bonding",
    "Stoichiometry",
    "The Periodic Table",
    // Reaction Dynamics & Energy
    "Chemical Reactions",
    "Chemical Energetics",
    "Electrochemistry",
    "Redox Reactions",
    // Inorganic & Environmental Chemistry
    "Acids, Bases and Salts",
    "Metals",
    "Non-metals",
    "Chemistry of the Environment",
    // Organic & Practical Chemistry
    "Organic Chemistry",
    "Experimental Techniques and Chemical Analysis"
];

// Complete notes for each Chemistry topic
export const chemistryNotes: Record<string, TopicNotes> = {
    "States of Matter": {
        topic: "States of Matter",
        subject: "Chemistry",
        summary: "The Kinetic Particle Theory explains the physical properties of matter and how it behaves during changes of state. All matter is composed of tiny particles (atoms, molecules, or ions) that are in constant motion. The properties of solids, liquids, and gases are determined by the arrangement, proximity, and movement of these particles.",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Kinetic_Theory_States_of_Matter_Explained.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL0tpbmV0aWNfVGhlb3J5X1N0YXRlc19vZl9NYXR0ZXJfRXhwbGFpbmVkLm00YSIsImlhdCI6MTc2NTQ3MDI0MiwiZXhwIjo1MjY1OTY2MjQyfQ._HXh5bEmEzGe8jd34j8GoO4I9HOK40iIswemyI5O5sM",
        sections: [
            {
                title: "1. The Kinetic Particle Theory",
                content: `## Key Principles

**Composition:** All matter is composed of minute particles that are too small to be seen even with ordinary microscopes.

**Motion:** These particles are continuously moving. In solids, they vibrate; in liquids and gases, they move randomly and collide with one another.

**Energy & Temperature:** Temperature is a measure of the average kinetic energy of particles. As a substance absorbs heat energy, particles gain kinetic energy and move faster.

## Evidence for Particle Theory

### A. Brownian Motion
The random, erratic, jerky movement of microscopic visible particles suspended in a fluid.

**Observation:** Smoke particles suspended in air appear to dance around randomly in a zigzag path.

**Explanation:** The smoke particles are being bombarded by millions of tiny, invisible, fast-moving air molecules. Uneven collisions cause the visible particle to jerk in random directions.

### B. Diffusion
The spontaneous net movement of particles from a region of **higher concentration** to a region of **lower concentration**.

**Process:** Occurs due to random motion of particles. They spread out until evenly distributed (equilibrium).

**Factors Affecting Diffusion:**
- **State of Matter:** Fastest in gases (high kinetic energy, large spaces), slower in liquids, negligible in solids
- **Molecular Mass:** Lighter particles diffuse faster than heavier ones
- **Temperature:** Higher temperature = faster diffusion

**Examples:**
- Potassium manganate(VII) crystal spreading purple colour in water
- Perfume scent spreading across a room`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. The Three States of Matter",
                content: `## Comparison of Properties

| Property | Solid | Liquid | Gas |
|----------|-------|--------|-----|
| **Shape** | Fixed shape | Takes container shape | Fills any container |
| **Volume** | Fixed volume | Fixed volume | No fixed volume |
| **Compressibility** | Cannot compress | Cannot compress easily | Easily compressed |
| **Fluidity** | Does not flow | Flows easily | Flows freely |

## Particle Arrangement & Motion

### Solid
- **Packing:** Tightly packed in fixed, regular pattern (lattice)
- **Forces:** Strong intermolecular forces hold particles firmly
- **Movement:** Particles vibrate about fixed positions

### Liquid
- **Packing:** Closely packed but irregular, disordered arrangement
- **Forces:** Weaker forces than solids; particles stay in contact but not locked
- **Movement:** Particles slide past one another, move randomly over short distances

### Gas
- **Packing:** Far apart with large empty spaces; no regular arrangement
- **Forces:** Negligible forces of attraction; particles act independently
- **Movement:** Move randomly at high speeds in all directions, colliding frequently`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Changes of State",
                content: `## The Processes

### Melting (Solid → Liquid)
- **Energy:** Absorbs heat (Endothermic)
- **Mechanism:** Energy makes particles vibrate more vigorously. At melting point, particles overcome forces holding the lattice
- **Result:** Rigid structure collapses; particles slide over one another

### Freezing (Liquid → Solid)
- **Energy:** Releases heat (Exothermic)
- **Mechanism:** Particles lose kinetic energy, move slower. Forces lock particles back into fixed lattice

### Boiling (Liquid → Gas)
- **Energy:** Requires significant heat
- **Mechanism:** Particles move fast enough to completely overcome intermolecular forces
- **Result:** Bubbles form inside liquid and rise. Occurs at specific **boiling point**

### Evaporation (Liquid → Gas)
- **Location:** Occurs at surface only, below boiling point
- **Mechanism:** High-energy surface particles escape into air
- **Cooling Effect:** Fastest particles leave, so remaining liquid cools (e.g., sweating)

### Condensation (Gas → Liquid)
- Gas particles lose energy, slow down, forces clump them together

### Sublimation (Solid → Gas)
- Direct change without becoming liquid
- **Examples:** Iodine crystals, Dry Ice, Ammonium Chloride

### Deposition (Gas → Solid)
- Direct change without becoming liquid
- **Example:** Frost forming on cold windows

## Boiling vs Evaporation

| Feature | Boiling | Evaporation |
|---------|---------|-------------|
| **Temperature** | Only at boiling point | Any temperature |
| **Location** | Throughout liquid (bubbles) | Surface only |
| **Speed** | Fast, vigorous | Slow, gradual |
| **Energy Source** | External heat | Surroundings or liquid itself |

## Heating and Cooling Curves

**Sloped Lines:** Temperature rising, heat converted to kinetic energy, particles move faster

**Flat Lines (Plateaus):** Change of state occurring
- Temperature doesn't rise even though heat is applied
- Energy used to break intermolecular bonds, not increase speed
- This "hidden" energy is called **Latent Heat**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Behavior of Gases",
                content: `## Gas Pressure

**Definition:** Force exerted per unit area on container walls

**Cause:** Gas particles in constant random motion collide frequently with container walls. Billions of collisions per second create steady pressure.

**Temperature Effect:**
- Heating transfers energy to particles → move faster
- Hit walls harder (more force) and more often
- **Pressure rises**

**Volume Effect (Boyle's Law):**
- Compressing gas into smaller volume
- Particles hit walls more often (less space to travel)
- **Pressure rises**

## Factors Affecting Diffusion Rate

### 1. Temperature
Higher temperature → Higher kinetic energy → Faster particle movement → **Faster diffusion**

### 2. Relative Molecular Mass (Mr)
Heavier particles move slower at same temperature.

**The Rule:** Lower Mr = Faster diffusion

**Example:** 
- Ammonia (NH₃, Mr = 17) is lighter than Hydrogen Chloride (HCl, Mr = 36.5)
- Therefore, Ammonia diffuses faster

**Classic Experiment:**
Cotton wool soaked in Ammonia and HCl placed at opposite ends of sealed tube. White ring of Ammonium Chloride forms **closer to the HCl end** because Ammonia traveled further in the same time.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Purity and States of Matter",
                content: `## Defining Purity

In chemistry, a **pure substance** consists of only one type of substance (element or compound) with no impurities. It has distinct physical properties.

**Example:** Pure water = 100% H₂O molecules. Tap water is a "mixture" (contains dissolved minerals and chlorine).

## Effect of Impurities

Impurities disrupt regular particle arrangement in solids and alter forces between particles in liquids.

### Melting Point
- Impurities **lower** the melting point
- Substance melts over a **range** of temperatures instead of sharp point
- **Application:** Salt on icy roads lowers ice melting point, causing it to melt below 0°C

### Boiling Point
- Impurities **raise** the boiling point
- **Example:** Pure water boils at exactly 100°C. Salt water boils above 100°C.

## Testing for Purity
- Pure substances have **sharp, fixed** melting and boiling points
- Impure substances melt/boil over a **range** of temperatures`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "All matter is made of particles in constant motion (Kinetic Theory)",
            "Temperature measures the average kinetic energy of particles",
            "Brownian motion provides visual evidence for particle theory",
            "Diffusion is movement from high to low concentration",
            "Solids: fixed shape, particles vibrate in lattice",
            "Liquids: fixed volume, particles slide past each other",
            "Gases: no fixed shape/volume, particles move freely",
            "Latent heat is energy used to change state without changing temperature",
            "Evaporation occurs at surface; boiling occurs throughout liquid",
            "Lighter molecules (lower Mr) diffuse faster",
            "Impurities lower melting point and raise boiling point"
        ],
        exam_tips: [
            "Draw particle diagrams for each state showing arrangement and spacing",
            "Explain Brownian motion using collisions with invisible particles",
            "Use kinetic theory to explain why temperature stays constant during state changes",
            "Compare boiling vs evaporation using at least 3 differences",
            "Calculate Mr to predict which gas diffuses faster",
            "Explain gas pressure in terms of particle collisions with walls",
            "Know how impurities affect melting (lower/range) and boiling points (raise)"
        ]
    },

    "Atoms, Elements and Compounds": {
        topic: "Atoms, Elements and Compounds",
        subject: "Chemistry",
        summary: "Everything in the physical universe is made of matter composed of atoms. Understanding atomic structure explains why elements behave the way they do and how they interact to form compounds. This topic covers atomic structure, electron arrangement, the periodic table, and different types of chemical bonding.",
        sections: [
            {
                title: "1. Atomic Structure",
                content: `## The Structure of an Atom

An **atom** is the smallest particle of a chemical element that can exist while retaining the chemical properties of that element.

### Sub-atomic Particles

| Particle | Charge | Relative Mass | Location |
|----------|--------|---------------|----------|
| **Proton** | +1 | 1 | Nucleus |
| **Neutron** | 0 | 1 | Nucleus |
| **Electron** | -1 | ~1/1840 (negligible) | Shells around nucleus |

**Note on Size:** If an atom were the size of a football stadium, the nucleus would be a marble on the center spot. Most of an atom is empty space.

## Key Definitions

**Proton Number (Atomic Number, Z):** Number of protons in the nucleus - the "identity card" for an element.

**Electrical Neutrality:** In a neutral atom: Number of Protons = Number of Electrons

**Nucleon Number (Mass Number, A):** Total of protons + neutrons in the nucleus.

**Formula:** Number of Neutrons = A - Z

## Isotopes

**Isotopes** are atoms of the same element with the same number of protons but different numbers of neutrons.

### Chemical vs Physical Properties
- **Chemical:** Identical (same electron arrangement)
- **Physical:** Different masses, densities, melting points, diffusion rates

**Example - Chlorine:**
- ³⁵Cl (18 neutrons, 75% abundance)
- ³⁷Cl (20 neutrons, 25% abundance)
- Relative Atomic Mass = 35.5 (average)

### Uses of Radioisotopes
- **Medical:** Cobalt-60 for cancer radiotherapy, sterilizing surgical instruments
- **Industrial:** Tracers for detecting pipe leaks, thickness gauges in paper/metal mills`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Electron Arrangement and the Periodic Table",
                content: `## Shell Rules (Electronic Configuration)

- **1st Shell:** Maximum 2 electrons
- **2nd Shell:** Maximum 8 electrons
- **3rd Shell:** Maximum 8 electrons (for first 20 elements)
- **Filling Order:** Lowest energy shell fills first

**Example - Sodium (²³₁₁Na):** 11 electrons → Configuration: **2.8.1**

## The Periodic Table Structure

Elements are arranged by increasing proton number.

### Groups (Vertical Columns)
Elements in the same group have the **same number of outer shell electrons** and react similarly.

| Group | Outer Electrons | Name | Properties |
|-------|-----------------|------|------------|
| I | 1 | Alkali Metals | Highly reactive, lose 1 electron easily |
| VII | 7 | Halogens | Reactive non-metals, gain 1 electron |
| 0/VIII | 8 (or 2 for He) | Noble Gases | Full outer shell, unreactive (inert) |

### Periods (Horizontal Rows)
The period number = number of electron shells occupied.

**Trend across period:** Character changes from metallic → non-metallic`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Elements, Mixtures, and Compounds",
                content: `## Definitions

### Element
A pure substance consisting of only **one type of atom** (e.g., O₂, Fe, Na). Cannot be broken down further by chemical means.

### Compound
Two or more different elements **chemically bonded** in a fixed ratio (e.g., H₂O, CO₂, NaCl).
- **Fixed Composition:** H₂O is always H₂O; H₂O₂ is different (hydrogen peroxide)
- **New Properties:** Na (reactive metal) + Cl₂ (poisonous gas) → NaCl (safe table salt)

### Mixture
Two or more substances **physically mixed** but not chemically bonded (e.g., air, saltwater, brass).
- Components retain individual properties
- Variable composition
- Can be separated by physical methods

## Separation Techniques

| Method | Separates | Principle |
|--------|-----------|-----------|
| **Filtration** | Insoluble solid from liquid | Particle size (filter paper as sieve) |
| **Crystallisation** | Soluble solid from solution | Solubility decreases on cooling |
| **Simple Distillation** | Solvent from solution | Large boiling point difference |
| **Fractional Distillation** | Miscible liquids | Small boiling point differences |
| **Chromatography** | Substances with different solubilities | Solubility competition |
| **Magnetism** | Magnetic from non-magnetic | Magnetic properties |

## Chromatography Details

**Purity Test:** Pure substance = single spot; Impure = multiple spots

**Rf Value (Retention Factor):**
$$R_f = \\frac{\\text{Distance moved by substance}}{\\text{Distance moved by solvent front}}$$

**Locating Agents:** Chemicals that reveal colorless substances (e.g., Ninhydrin turns amino acids purple)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Bonding: The Structure of Matter",
                content: `## Why Atoms Bond
Atoms bond to achieve a **stable electron configuration** (full outer shell like Noble Gases).

## A. Ionic Bonding

**Occurs between:** Metal + Non-metal

**Process:** Complete **transfer of electrons**
- Metal loses electrons → Positive ion (Cation)
- Non-metal gains electrons → Negative ion (Anion)

**The Bond:** Strong electrostatic attraction between oppositely charged ions

**Structure:** Giant Ionic Lattice (regular 3D arrangement)

**Properties:**
- High melting/boiling points (strong forces)
- Conducts electricity when molten or dissolved (ions free to move)
- Does NOT conduct when solid (ions locked in place)
- Often soluble in water

**Example:** NaCl - Sodium (2.8.1) transfers 1 electron to Chlorine (2.8.7) → Na⁺ (2.8) and Cl⁻ (2.8.8)

## B. Covalent Bonding

**Occurs between:** Non-metal + Non-metal

**Process:** **Sharing pairs of electrons**

**The Bond:** Attraction between shared electrons and both nuclei

### Simple Molecular Structures (e.g., H₂O, CO₂, CH₄)
- Low melting/boiling points (weak forces between molecules)
- Do NOT conduct electricity (no free ions or electrons)
- Usually gases or liquids at room temperature

### Giant Covalent Structures

| Substance | Structure | Properties |
|-----------|-----------|------------|
| **Diamond** | Each C bonds to 4 others | Very hard, high m.p., insulator |
| **Graphite** | C bonds to 3 others, sheets | Soft, slippery, CONDUCTS (delocalised electrons) |
| **Silicon Dioxide** | Similar to diamond | Hard, high m.p. |

## C. Metallic Bonding

**Occurs in:** Pure metals and alloys

**Structure:** Lattice of positive ions surrounded by "sea" of delocalised electrons

**The Bond:** Attraction between positive ions and electron sea

**Properties:**
- **Excellent conductors:** Delocalised electrons carry charge
- **Malleable/Ductile:** Layers slide without breaking
- **High melting points:** Strong attractions`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Atoms contain protons (+), neutrons (0), and electrons (-)",
            "Proton number defines the element; neutrons affect mass only",
            "Isotopes: same protons, different neutrons",
            "Electron configuration: 2, 8, 8 for first 20 elements",
            "Group number = number of outer electrons",
            "Compounds have fixed composition and new properties",
            "Mixtures can be separated by physical methods",
            "Ionic bonding: electron transfer, metal + non-metal",
            "Covalent bonding: electron sharing, non-metal + non-metal",
            "Metallic bonding: sea of delocalised electrons",
            "Graphite conducts; Diamond doesn't (delocalised electrons)"
        ],
        exam_tips: [
            "Calculate protons, neutrons, electrons from nuclide notation (ᴬzX)",
            "Write electron configurations and link to Group number",
            "Draw dot-and-cross diagrams for ionic and covalent compounds",
            "Compare ionic vs covalent properties (m.p., conductivity)",
            "Explain why graphite conducts but diamond doesn't",
            "Choose correct separation method based on physical properties",
            "Calculate Rf values in chromatography"
        ]
    },

    "Chemical Bonding": {
        topic: "Chemical Bonding",
        subject: "Chemistry",
        summary: "Chemical bonding explains how atoms combine to form compounds. Atoms bond to achieve a stable electron configuration (full outer shell). The three main types of bonding are ionic (electron transfer), covalent (electron sharing), and metallic (sea of delocalised electrons).",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Ionic_Covalent_and_Metallic_Bonding_Explained.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL0lvbmljX0NvdmFsZW50X2FuZF9NZXRhbGxpY19Cb25kaW5nX0V4cGxhaW5lZC5tNGEiLCJpYXQiOjE3NjU0NzAyMjAsImV4cCI6NTI2NTk2NjIyMH0.g9uIb2Bt8YQojNsXSBHaUuqpBVZ60o-9Y6sXIDdIbb8",
        sections: [
            {
                title: "1. Why Do Atoms Bond?",
                content: `## The Goal: A Full Outer Shell

**Noble Gases (Group 0/VIII):** Helium, Neon, Argon are chemically inert because they have a full outer shell.
- Helium: stable duplet (2 electrons)
- Others: stable octet (8 electrons)

**Other Elements:** Atoms with incomplete outer shells are unstable and reactive. They must interact with other atoms to achieve Noble Gas configuration by:
- **Transferring electrons** (Ionic bonding)
- **Sharing electrons** (Covalent bonding)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Ionic Bonding",
                content: `## The Process: Electron Transfer

Occurs between: **Metal + Non-metal**

### The Metal (Giver)
- Has few outer electrons (1, 2, or 3)
- **Loses electrons** to empty outer shell
- Becomes a **Positive Ion (Cation)**
- Example: Na (2.8.1) → Na⁺ (2.8) [loses 1 electron]

### The Non-Metal (Taker)
- Has nearly full outer shell (5, 6, or 7 electrons)
- **Gains electrons** to complete octet
- Becomes a **Negative Ion (Anion)**
- Example: Cl (2.8.7) → Cl⁻ (2.8.8) [gains 1 electron]

## The Ionic Bond
Strong **electrostatic attraction** between oppositely charged ions. Acts in all directions (non-directional).

## Giant Ionic Lattice Structure
Millions of ions stack in a regular, repeating 3D pattern. In NaCl, every Na⁺ is surrounded by 6 Cl⁻ ions.

## Properties of Ionic Compounds

| Property | Explanation |
|----------|-------------|
| **High m.p./b.p.** | Strong forces between millions of ions |
| **Conducts when molten/dissolved** | Ions free to move |
| **Insulator when solid** | Ions locked in lattice |
| **Soluble in water** | Polar water molecules pull ions apart |
| **Brittle** | Same-charge ions repel when layers shift |

**Note:** Higher charges = stronger attraction. MgO (2+ and 2-) has higher m.p. than NaCl (1+ and 1-)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Covalent Bonding",
                content: `## The Process: Electron Sharing

Occurs between: **Non-metal + Non-metal**

Both atoms need to gain electrons, so they **share pairs** instead. Shared electrons count toward both atoms' outer shells.

## Types of Covalent Bonds
- **Single bond:** 1 shared pair (H-H, Cl-Cl, H-O-H)
- **Double bond:** 2 shared pairs (O=O, O=C=O) - stronger, shorter
- **Triple bond:** 3 shared pairs (N≡N) - very strong, unreactive

## Type A: Simple Molecular Structures
Small distinct molecules (H₂O, CO₂, CH₄, NH₃)

| Property | Explanation |
|----------|-------------|
| **Low m.p./b.p.** | Weak forces BETWEEN molecules (intermolecular) |
| **Insulator** | No ions, no free electrons |
| **Usually insoluble in water** | Non-polar; dissolve in organic solvents |

**Key Point:** Covalent bonds INSIDE molecules are strong. Only weak intermolecular forces break when melting/boiling.

## Type B: Giant Covalent Structures

### Diamond (Pure Carbon)
- Each C bonds to **4 others** in rigid tetrahedral arrangement
- **Hardest natural substance** (cutting tools, drill bits)
- **Very high m.p.** (3500°C+)
- **Insulator** - all electrons in bonds

### Graphite (Pure Carbon)
- Each C bonds to **3 others** forming flat hexagonal sheets
- **Soft and slippery** - weak forces between layers (lubricant, pencils)
- **Conducts electricity** - 4th electron is delocalised and free to move
- Used in electrodes

### Silicon Dioxide (SiO₂)
- Similar to diamond structure
- Hard, high m.p., insulator
- Main component of glass and sand`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Metallic Bonding",
                content: `## The Structure

**Occurs in:** Pure metals and alloys (Cu, Fe, Mg)

- Metal atoms lose outer electrons → **Positive ions**
- Ions pack in regular layers (lattice)
- Outer electrons become **delocalised** (free to move)
- Forms a **"sea of electrons"** surrounding the ions

## The Metallic Bond
Strong **electrostatic attraction** between positive metal ions and negative sea of delocalised electrons.

## Properties of Metals

| Property | Explanation |
|----------|-------------|
| **Excellent conductors** | Delocalised electrons carry current |
| **Good heat conductors** | Mobile electrons transfer kinetic energy |
| **High m.p.** | Strong attraction between ions and electron sea |
| **Malleable & Ductile** | Layers slide; electron sea maintains bond |

**Malleability:** Metals can be hammered into shape without breaking because layers of ions slide over each other while the electron sea keeps them bonded.

**More electrons donated = stronger bond = higher m.p.**
(Mg donates 2e⁻ → higher m.p. than Na which donates 1e⁻)

## Summary Comparison Table

| Feature | Ionic | Simple Covalent | Giant Covalent | Metallic |
|---------|-------|-----------------|----------------|----------|
| Particles | Ions | Molecules | Atoms | Ions + electrons |
| M.P. | High | Low | Very High | High |
| Conductivity | Molten/aqueous only | No | No (except graphite) | Yes |
| Solubility | Water soluble | Usually insoluble | Insoluble | Insoluble |`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Atoms bond to achieve full outer shell (Noble Gas configuration)",
            "Ionic: Metal TRANSFERS electrons to non-metal → ions → lattice",
            "Ionic compounds: high m.p., conduct when molten/dissolved, brittle",
            "Covalent: Non-metals SHARE electrons → molecules or giant structures",
            "Simple covalent: low m.p. (weak intermolecular forces), insulators",
            "Diamond: 4 bonds per C, hard, insulator",
            "Graphite: 3 bonds per C, soft layers, CONDUCTS (delocalised electrons)",
            "Metallic: positive ions in sea of delocalised electrons",
            "Metals: conduct, malleable, ductile (layers slide, electrons maintain bond)"
        ],
        exam_tips: [
            "Distinguish intramolecular (within molecule) vs intermolecular (between molecules) forces",
            "Explain why ionic compounds conduct when molten but not solid (ion movement)",
            "Describe sea of electrons model for metallic bonding",
            "Explain graphite's uses: pencils (slippery layers), electrodes (conducts)",
            "Deduce ionic compound formulas from group numbers (Group 2 + Group 7 → MCl₂)",
            "Draw dot-and-cross diagrams for ionic and covalent bonds"
        ]
    },

    "Stoichiometry": {
        topic: "Stoichiometry",
        subject: "Chemistry",
        summary: "Stoichiometry is the calculation of quantities in chemical reactions. It covers naming compounds, writing formulae, balancing equations, the mole concept, and calculations involving reacting masses, gas volumes, and solution concentrations.",
        sections: [
            {
                title: "1. Naming Compounds and Writing Formulae",
                content: `## Naming Compounds

### Metal + Non-metal (Ionic)
- Metal named first (unchanged)
- Non-metal ending changes to **-ide**
- Examples: Sodium Chloride (NaCl), Magnesium Oxide (MgO)
- With oxygen + another non-metal: ending often **-ate** (e.g., Copper Sulfate)

### Two Non-metals (Covalent)
Use Greek prefixes to show number of atoms:
- Mono- (1), Di- (2), Tri- (3), Tetra- (4), Penta- (5)
- Examples: Carbon Dioxide (CO₂), Sulfur Trioxide (SO₃)

### Transition Metals (Variable Valency)
Roman numerals show the charge:
- Copper(I) Oxide = Cu₂O (Cu⁺)
- Copper(II) Oxide = CuO (Cu²⁺)
- Iron(III) Chloride = FeCl₃ (Fe³⁺)

## Valency (Combining Power)

| Group | Valency | Action |
|-------|---------|--------|
| I | 1 | Lose 1e⁻ |
| II | 2 | Lose 2e⁻ |
| III | 3 | Lose 3e⁻ |
| V | 3 | Gain/Share 3e⁻ |
| VI | 2 | Gain/Share 2e⁻ |
| VII | 1 | Gain/Share 1e⁻ |

## Cross-Over Method for Formulae
1. Write symbols and valencies
2. Cross valencies to become subscripts
3. Simplify if possible

**Example:** Al (valency 3) + O (valency 2) → Al₂O₃

## Common Compound Ions
- NH₄⁺ (Ammonium), OH⁻ (Hydroxide), NO₃⁻ (Nitrate)
- SO₄²⁻ (Sulfate), CO₃²⁻ (Carbonate), PO₄³⁻ (Phosphate)

**Use brackets for multiple ions:** Ca(NO₃)₂`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Chemical Equations",
                content: `## Law of Conservation of Mass
Mass is neither created nor destroyed - atoms are rearranged.

## Word Equations
Reactants → Products
Example: Magnesium + Oxygen → Magnesium Oxide

## Balancing Symbol Equations
**Rule:** Only change coefficients (big numbers), NEVER subscripts

**Steps:**
1. Count atoms on each side
2. Add coefficients to balance
3. Check all elements are balanced

**Example:** Mg + O₂ → MgO
- Left: 1 Mg, 2 O | Right: 1 Mg, 1 O ❌
- Balance O: Mg + O₂ → 2MgO
- Balance Mg: **2Mg + O₂ → 2MgO** ✓

**Complex Example:** C₃H₈ + O₂ → CO₂ + H₂O
1. Balance C: need 3 CO₂
2. Balance H: need 4 H₂O
3. Balance O: (3×2) + (4×1) = 10 O → need 5 O₂
4. **C₃H₈ + 5O₂ → 3CO₂ + 4H₂O**

## State Symbols
- **(s)** = Solid
- **(l)** = Liquid
- **(g)** = Gas
- **(aq)** = Aqueous (dissolved in water)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Relative Masses",
                content: `## The Standard: Carbon-12
All atomic masses are compared to ¹²C (assigned mass = 12.000)

**1 atomic mass unit = 1/12 mass of Carbon-12 atom**

## Relative Atomic Mass (Aᵣ)
Weighted average mass of isotopes compared to ¹²C

- **No units** (it's relative)
- Accounts for isotope abundance
- Chlorine: 35.5 (75% ³⁵Cl + 25% ³⁷Cl)

Common values: H=1, C=12, N=14, O=16, Na=23, Mg=24, S=32, Cl=35.5, Cu=64

## Relative Molecular/Formula Mass (Mᵣ)
Sum of Aᵣ of all atoms in formula

**Example:** CuSO₄·5H₂O
- Cu = 64
- S = 32
- 4×O = 64
- 5×H₂O = 5×18 = 90
- **Total Mᵣ = 250**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. The Mole Concept",
                content: `## Definition
**One mole** = amount containing same number of particles as atoms in 12g of Carbon-12

## Avogadro Constant (L)
**L = 6.02 × 10²³ particles per mole**

- 1 mol of H atoms = 6.02 × 10²³ atoms
- 1 mol of H₂ molecules = 6.02 × 10²³ molecules

## Molar Mass
Mass of 1 mole = Aᵣ or Mᵣ in **grams**

- Aᵣ of Fe = 56 → 1 mol Fe = 56g
- Mᵣ of CO₂ = 44 → 1 mol CO₂ = 44g

## The Key Formula

$$n = \\frac{m}{M_r}$$

Where: n = moles, m = mass (g), Mᵣ = molar mass

**Rearrangements:**
- Mass = n × Mᵣ
- Mᵣ = m ÷ n

**Example:** Moles in 250g of CaCO₃?
- Mᵣ = 40 + 12 + 48 = 100
- n = 250 ÷ 100 = **2.5 mol**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Calculations from Equations",
                content: `## The Mole Ratio
Coefficients in balanced equations = mole ratio

**2Mg + O₂ → 2MgO**
Meaning: 2 mol Mg : 1 mol O₂ : 2 mol MgO

## Standard Calculation Steps
1. **Balance** the equation
2. **Calculate moles** of known substance
3. **Use ratio** to find moles of unknown
4. **Convert** moles to mass

**Example:** Mass of Fe from 160g Fe₂O₃?
Equation: Fe₂O₃ + 3CO → 2Fe + 3CO₂

1. Mᵣ of Fe₂O₃ = 160
2. Moles = 160 ÷ 160 = 1 mol
3. Ratio: 1 mol Fe₂O₃ → 2 mol Fe
4. Mass = 2 × 56 = **112g Fe**

## Limiting Reactant
- **Limiting reactant:** Completely consumed; determines max product
- **Excess reactant:** Left over after reaction
- Always calculate using the limiting reactant`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Reactions Involving Gases",
                content: `## Avogadro's Law
Equal volumes of gases at same T and P contain equal numbers of molecules

## Molar Gas Volume (Vₘ)
At room temperature and pressure (r.t.p.):
**1 mol of any gas = 24 dm³ = 24,000 cm³**

## Gas Volume Formula

$$n = \\frac{V}{24}$$ (V in dm³)

$$n = \\frac{V}{24000}$$ (V in cm³)

**Example:** Volume of H₂ from 6g Mg with excess acid?
Mg + 2HCl → MgCl₂ + H₂

1. Moles Mg = 6 ÷ 24 = 0.25 mol
2. Ratio: 1 mol Mg → 1 mol H₂
3. Volume = 0.25 × 24 = **6 dm³**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Concentration of Solutions",
                content: `## Molarity (mol/dm³)
1M solution = 1 mole dissolved in 1 dm³ (1 litre)

## The Concentration Formula

$$n = C \\times V$$

Where: n = moles, C = concentration (mol/dm³), V = volume (dm³)

**CRITICAL:** Convert cm³ to dm³ by ÷1000

**Example:** Moles in 50 cm³ of 2.0 mol/dm³ H₂SO₄?
- V = 50 ÷ 1000 = 0.05 dm³
- n = 2.0 × 0.05 = **0.1 mol**

## Titration Calculations
1. Write balanced equation
2. Calculate moles of known (n = C × V)
3. Use ratio for moles of unknown
4. Calculate concentration (C = n ÷ V)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Formulae Calculations",
                content: `## Percentage Composition by Mass

$$\\% = \\frac{A_r \\times \\text{atoms}}{M_r} \\times 100$$

**Example:** % Nitrogen in NH₄NO₃?
- Mᵣ = 14 + 4 + 14 + 48 = 80
- N atoms = 2, mass = 28
- % N = (28 ÷ 80) × 100 = **35%**

## Empirical Formula
Simplest whole-number ratio of atoms

**Method:**
1. Write mass (or %) of each element
2. Divide by Aᵣ to get moles
3. Divide all by smallest number
4. Round to whole numbers (×2 if 0.5)

## Molecular Formula
Actual number of atoms in molecule

**Method:**
1. Find mass of empirical formula
2. n = Actual Mᵣ ÷ Empirical mass
3. Multiply empirical formula by n

**Example:** Empirical = CH₂ (mass 14), Mᵣ = 42
- n = 42 ÷ 14 = 3
- Molecular = **C₃H₆**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "9. Yield and Purity",
                content: `## Percentage Yield

$$\\% \\text{ Yield} = \\frac{\\text{Actual Yield}}{\\text{Theoretical Yield}} \\times 100$$

**Why less than 100%?**
- Reversible reactions (equilibrium)
- Product lost during separation
- Side reactions create by-products
- Impure reactants

## Percentage Purity

$$\\% \\text{ Purity} = \\frac{\\text{Mass of Pure Substance}}{\\text{Total Mass}} \\times 100$$

**Important:** Only pure substance reacts!
- 100g limestone at 80% purity = use 80g in calculations`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Metal + non-metal: name ends in -ide (e.g., chloride, oxide)",
            "Use cross-over method: valencies become subscripts",
            "Balance equations by changing coefficients only, not subscripts",
            "n = m/Mᵣ (moles = mass ÷ molar mass)",
            "Avogadro constant: 6.02 × 10²³ particles per mole",
            "1 mol of any gas = 24 dm³ at r.t.p.",
            "n = C × V (concentration × volume in dm³)",
            "Empirical formula: simplest ratio; Molecular: actual atoms",
            "% Yield = (Actual/Theoretical) × 100",
            "Limiting reactant determines maximum product"
        ],
        exam_tips: [
            "Always show working: formula, substitution, answer with units",
            "Convert cm³ to dm³ (÷1000) before concentration calculations",
            "Check equations are balanced before doing mole calculations",
            "For gases: use 24 dm³ per mole at r.t.p.",
            "Identify limiting reactant - calculate moles of both reactants",
            "For impure samples: calculate mass of pure substance first",
            "Round empirical formula ratios carefully (1.5 → multiply by 2)"
        ]
    },

    "The Periodic Table": {
        topic: "The Periodic Table",
        subject: "Chemistry",
        summary: "The Periodic Table is a systematic classification of elements arranged by increasing proton number. Elements with similar properties are in the same vertical groups. This topic covers the structure, Group I (Alkali Metals), Group VII (Halogens), Group 0 (Noble Gases), Transition Elements, and trends across periods.",
        sections: [
            {
                title: "1. Structure of the Periodic Table",
                content: `## Groups (Vertical Columns)
Numbered I to VII and 0 (or VIII)

**Golden Rule:** Elements in same group have **same number of outer shell electrons**

Because reactions involve outer electrons, elements in same group behave similarly.

## Periods (Horizontal Rows)
Numbered 1 to 7

**Period number = number of electron shells**

## Metals vs Non-metals
- **Metals:** Left and center - lose electrons → positive ions
- **Non-metals:** Right side - gain/share electrons
- **Metalloids:** Touch the zig-zag line (e.g., Silicon) - properties of both

## Periodicity
Properties repeat in predictable patterns across periods.

**Trend across period:** Metallic → Non-metallic (left to right)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Group I: The Alkali Metals",
                content: `## Elements
Lithium (Li), Sodium (Na), Potassium (K), Rubidium (Rb), Caesium (Cs)

## Physical Properties

| Property | Trend Down Group |
|----------|------------------|
| Softness | Increases (cut with knife) |
| Density | Generally increases (but Li, Na, K float on water) |
| Melting Point | Decreases (Li: 181°C → K: 63°C) |

## Chemical Properties
All have **1 outer electron** → lose it to form **M⁺ ion**

### Reactivity INCREASES Down Group
**Why?** Larger atoms → outer electron further from nucleus → more shielding → easier to lose

## Reactions

### With Water
Produces hydrogen gas + metal hydroxide (alkaline solution)

**2M + 2H₂O → 2MOH + H₂**

| Metal | Observation |
|-------|-------------|
| Li | Fizzes steadily, floats |
| Na | Fizzes rapidly, melts into ball, darts around |
| K | Violent, ignites with lilac flame |

### With Chlorine
Burns brightly → white metal chloride
**2Na + Cl₂ → 2NaCl**

### Storage
Stored under oil (react with air/moisture)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Group VII: The Halogens",
                content: `## Elements
Fluorine (F₂), Chlorine (Cl₂), Bromine (Br₂), Iodine (I₂)

## Physical Properties

| Element | Appearance at Room Temp |
|---------|------------------------|
| Fluorine | Pale yellow gas |
| Chlorine | Pale green gas (poisonous) |
| Bromine | Red-brown liquid (volatile) |
| Iodine | Grey-black solid (sublimes to purple vapor) |

**All exist as diatomic molecules** (F₂, Cl₂, Br₂, I₂)

### Trends Down Group
- Color: Gets **darker**
- State: Gas → Liquid → Solid
- Melting/Boiling point: **Increases** (larger molecules, stronger intermolecular forces)

## Chemical Properties
All have **7 outer electrons** → gain 1 to form **X⁻ ion**

### Reactivity DECREASES Down Group
**Why?** Larger atoms → outer shell further from nucleus → harder to attract extra electron

## Displacement Reactions
**More reactive halogen displaces less reactive one**

| Reaction | Result |
|----------|--------|
| Cl₂ + 2KBr → 2KCl + Br₂ | Solution turns orange (Br₂ released) |
| Cl₂ + 2KI → 2KCl + I₂ | Solution turns brown (I₂ released) |
| Br₂ + 2KCl → ? | **No reaction** (Br less reactive than Cl) |

**Ionic equation:** Cl₂ + 2Br⁻ → 2Cl⁻ + Br₂`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Group 0: The Noble Gases",
                content: `## Elements
Helium (He), Neon (Ne), Argon (Ar), Krypton (Kr), Xenon (Xe)

## Properties
- **Unreactive (Inert):** Full outer shell - no need to gain/lose electrons
  - He: 2 electrons (stable duplet)
  - Others: 8 electrons (stable octet)
- **Monatomic:** Exist as single atoms (not molecules)
- **Colorless gases**

## Uses (based on inertness or low density)

| Gas | Use | Why |
|-----|-----|-----|
| **Helium** | Balloons, airships | Less dense than air, non-flammable (unlike H₂) |
| **Neon** | Advertising signs | Glows red-orange when electricity passes through |
| **Argon** | Light bulbs, welding | Inert - stops filament burning, protects hot metal |
| **Krypton/Xenon** | Lasers, camera flash | Special lighting properties |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. The Transition Elements",
                content: `## Location
Block between Group II and Group III

## Examples
Iron (Fe), Copper (Cu), Zinc (Zn), Silver (Ag), Gold (Au), Nickel (Ni)

## Physical Properties (compare to Group I)

| Property | Transition Metals | Group I |
|----------|-------------------|---------|
| Hardness | Hard and strong | Soft |
| Melting Point | Very high (Fe: 1538°C) | Low (Na: 98°C) |
| Density | High (heavy) | Low (float on water) |

Exception: Mercury (Hg) is liquid at room temperature

## Unique Chemical Properties

### 1. Variable Valency (Oxidation States)
Can form ions with different charges:
- Iron: Fe²⁺ or Fe³⁺
- Copper: Cu⁺ or Cu²⁺

Hence Roman numerals: Iron(II) Oxide vs Iron(III) Oxide

### 2. Coloured Compounds
| Ion | Colour |
|-----|--------|
| Cu²⁺ | Blue |
| Fe²⁺ | Pale green |
| Fe³⁺ | Red-brown (rust) |

(Group I/II compounds are usually white)

### 3. Catalysts
Speed up reactions without being used up:
- **Iron:** Haber Process (making ammonia)
- **Nickel:** Hydrogenation of oils → margarine
- **V₂O₅:** Contact Process (making sulfuric acid)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Trends Across a Period (Period 3)",
                content: `## Period 3 Elements
Na → Mg → Al → Si → P → S → Cl → Ar

## Electron Arrangement
Outer electrons increase: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8

## Character Change (Left to Right)

| Position | Elements | Character |
|----------|----------|-----------|
| Left | Na, Mg, Al | **Metals** - shiny, conduct, lose electrons |
| Middle | Si | **Metalloid** - semiconductor |
| Right | P, S, Cl, Ar | **Non-metals** - insulators, gain electrons |

## Nature of Oxides

| Type | Examples | Acid-Base Character |
|------|----------|---------------------|
| Metal oxides | Na₂O, MgO | **Basic** (react with acids) |
| Aluminium oxide | Al₂O₃ | **Amphoteric** (reacts with acids AND bases) |
| Non-metal oxides | SO₂, P₄O₁₀ | **Acidic** (react with alkalis, form acids in water) |

## Other Trends Across Period 3
- **Electrical conductivity:** Decreases (metals → insulators)
- **Atomic radius:** Decreases (more protons pull electrons closer)
- **Ionization energy:** Generally increases`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Group number = number of outer electrons",
            "Period number = number of electron shells",
            "Group I: 1 outer electron, reactivity INCREASES down (easier to lose electron)",
            "Group VII: 7 outer electrons, reactivity DECREASES down (harder to gain electron)",
            "Group 0: Full outer shell = unreactive (inert)",
            "Displacement: More reactive halogen displaces less reactive one",
            "Transition metals: variable valency, coloured compounds, good catalysts",
            "Across period: Metallic → Non-metallic character",
            "Metal oxides are basic; non-metal oxides are acidic"
        ],
        exam_tips: [
            "Explain Group I reactivity using electron shells and shielding",
            "Predict halogen states: F₂/Cl₂ gas, Br₂ liquid, I₂ solid → Astatine solid",
            "Write ionic equations for displacement reactions",
            "Explain Noble Gas uses based on inertness",
            "Compare Transition metals to Group I (hard, high m.p., variable valency, coloured)",
            "Describe trends across Period 3 (conductivity, oxide character)"
        ]
    },

    "Chemical Reactions": {
        topic: "Chemical Reactions",
        subject: "Chemistry",
        summary: "The rate of reaction measures how fast reactants are converted to products. It is affected by concentration, pressure, surface area, temperature, and catalysts. Collision theory explains why these factors work - reactions require successful collisions with sufficient activation energy.",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Measuring_and_Controlling_Chemical_Reaction_Rates.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL01lYXN1cmluZ19hbmRfQ29udHJvbGxpbmdfQ2hlbWljYWxfUmVhY3Rpb25fUmF0ZXMubTRhIiwiaWF0IjoxNzY1NDcxMDA2LCJleHAiOjUyNjU5NjcwMDZ9.om3jfafEvzF08-sylkgXd4Onr7T2fK_M2aRgLlnmf1E",
        sections: [
            {
                title: "1. What is the Rate of Reaction?",
                content: `## Definition
Rate = change in concentration (or mass/volume) of reactant/product per unit time

$$\\text{Rate} = \\frac{\\text{Amount of Reactant Used}}{\\text{Time}}$$

$$\\text{Rate} = \\frac{\\text{Amount of Product Formed}}{\\text{Time}}$$

## Measuring Rate in the Lab

### 1. Volume of Gas Produced
- **Use for:** Reactions producing gas (H₂, CO₂)
- **Method:** Gas syringe or inverted measuring cylinder
- **Data:** Volume vs time graph; gradient = rate

### 2. Loss in Mass
- **Use for:** Reactions producing heavy gas (CO₂)
- **Method:** Flask on balance with cotton wool plug
- **Data:** Mass decreases as gas escapes

### 3. Change in Color/Turbidity
- **Use for:** Precipitate forming (solution goes cloudy)
- **Method:** "Disappearing cross" - time until X invisible
- **Formula:** Rate ∝ 1/time (shorter time = faster rate)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Factors Affecting Rate of Reaction",
                content: `## A. Concentration of Reactants
**Effect:** Higher concentration → Faster rate

**Why?** More particles in same volume → particles closer together → more frequent collisions → faster reaction

## B. Pressure (for Gases)
**Effect:** Higher pressure → Faster rate

**Why?** Same particles squeezed into smaller volume → particles closer → more frequent collisions

## C. Surface Area of Solids
**Effect:** Larger surface area (powder) → Faster rate

**Why?** Powder exposes more particles at surface → more collision sites available → more simultaneous collisions

### ⚠️ Dust Explosions
Fine flour/coal dust in air has massive surface area. A spark can cause instant combustion → explosion (flour mills, coal mines)

## D. Temperature
**Effect:** Higher temperature → Much faster rate
*Rule of thumb: +10°C roughly doubles the rate*

**Why? (Double Effect)**
1. **Faster movement:** Particles have more kinetic energy → collide more often
2. **More energy per collision:** More particles have energy ≥ Activation Energy → higher proportion of successful collisions

**The Major Factor:** Increased successful collisions (not just more collisions)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Collision Theory",
                content: `## Key Principles
For a reaction to occur, TWO conditions must be met:

1. **Collision:** Particles must physically collide
2. **Activation Energy (Eₐ):** Collision must have sufficient energy to break existing bonds

## Types of Collisions

### Unsuccessful (Ineffective) Collision
- Low energy collision (E < Eₐ)
- Particles bounce off unchanged
- No reaction occurs
- Most collisions at room temperature are unsuccessful

### Successful (Effective) Collision
- High energy collision (E ≥ Eₐ)
- Bonds break, atoms rearrange
- Products formed

## Summary
**Rate depends on frequency of SUCCESSFUL collisions**

| Factor | Effect on Collisions |
|--------|---------------------|
| Concentration/Pressure/Surface Area | Increases FREQUENCY of collisions |
| Temperature | Increases ENERGY of collisions (more successful) |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Catalysts",
                content: `## Definition
A catalyst speeds up a reaction without being consumed (unchanged at end)

## How Catalysts Work
- **Do NOT** increase collision frequency
- **DO** provide alternative pathway with **lower Activation Energy**
- Lower Eₐ → more particles have sufficient energy → more successful collisions
- Catalyst can be reused

## Important Industrial Catalysts

| Catalyst | Reaction | Process |
|----------|----------|---------|
| **MnO₂** | 2H₂O₂ → 2H₂O + O₂ | Decomposition of hydrogen peroxide |
| **Iron (Fe)** | N₂ + 3H₂ → 2NH₃ | Haber Process (ammonia) |
| **V₂O₅** | SO₂ → SO₃ | Contact Process (sulfuric acid) |

## Enzymes (Biological Catalysts)
- Complex protein molecules
- Control reactions in living organisms
- Example: Amylase (breaks starch → sugars)

**Properties:**
- **Highly specific:** "Lock and key" - one enzyme, one reaction
- **Sensitive:** High temperature or extreme pH causes **denaturation** (shape destroyed, stops working)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Photochemical Reactions",
                content: `## Definition
Reactions that derive activation energy from **light** instead of heat

## Photosynthesis
The most important photochemical reaction for life

**Equation:**
$$6CO_2 + 6H_2O \\xrightarrow{\\text{light}} C_6H_{12}O_6 + 6O_2$$

- **Catalyst:** Chlorophyll (green pigment)
- **Rate factor:** Light intensity (brighter = faster; dark = stops)

## Silver Salts (Photography)
How black-and-white film worked before digital cameras

**Reaction:**
$$2AgBr \\xrightarrow{\\text{light}} 2Ag + Br_2$$

- Film coated with silver bromide (AgBr) crystals
- Light provides energy to convert Ag⁺ → Ag atoms (black specks)
- Brighter light → more reaction → darker areas on negative
- Dark areas → less reaction → pale areas`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Rate = amount of reactant used (or product formed) per unit time",
            "Measure rate via: gas volume, mass loss, or disappearing cross",
            "Concentration/Pressure/Surface Area: increase collision frequency",
            "Temperature: increases energy AND frequency of collisions",
            "Collision theory: reactions need collision + activation energy",
            "Most collisions are unsuccessful (insufficient energy)",
            "Catalysts provide alternative pathway with lower Eₐ",
            "Enzymes are biological catalysts - specific and sensitive to conditions",
            "Photochemical reactions use light energy (photosynthesis, photography)"
        ],
        exam_tips: [
            "Calculate rate from graph gradient (tangent to curve)",
            "Draw apparatus for gas collection (syringe) vs precipitate (cross method)",
            "Explain temperature effect using: kinetic energy, Eₐ, successful collisions",
            "Explain dust explosions using surface area concept",
            "Sketch energy profile showing catalyst lowering Eₐ 'hump'",
            "Know industrial catalysts: Fe (Haber), V₂O₅ (Contact), MnO₂ (H₂O₂)"
        ]
    },

    "Chemical Energetics": {
        topic: "Chemical Energetics",
        subject: "Chemistry",
        summary: "Chemical reactions involve energy transfer. Exothermic reactions release heat (temperature rises), while endothermic reactions absorb heat (temperature falls). The overall energy change depends on bond breaking (endothermic) versus bond forming (exothermic). This topic also covers fuels, electrochemical cells, and equilibrium.",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Bond_Breaking_and_Forming_Energy_Payoff.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL0JvbmRfQnJlYWtpbmdfYW5kX0Zvcm1pbmdfRW5lcmd5X1BheW9mZi5tNGEiLCJpYXQiOjE3NjU0NzAxMjgsImV4cCI6NTI2NTk2NjEyOH0.58DuvE1w_aCjNQUjwGxpQjlhTuaB4l65S_MuKXqHMq4",
        sections: [
            {
                title: "1. Exothermic and Endothermic Reactions",
                content: `## Exothermic Reactions ("Exo" = out)
Releases heat energy to surroundings

- **Temperature Change:** Rises (gets hot)
- **Energy Level:** Products have LESS energy than reactants
- **ΔH:** Negative (e.g., ΔH = -890 kJ/mol)

**Examples:**
- Combustion (burning fuels)
- Respiration (glucose + oxygen in cells)
- Neutralisation (acid + alkali)
- Metals + Acid

## Endothermic Reactions ("Endo" = in)
Absorbs heat energy from surroundings

- **Temperature Change:** Falls (gets cold)
- **Energy Level:** Products have MORE energy than reactants
- **ΔH:** Positive (e.g., ΔH = +178 kJ/mol)

**Examples:**
- Photosynthesis (plants absorb light energy)
- Thermal decomposition (e.g., CaCO₃ → CaO + CO₂)
- Dissolving ammonium nitrate (cold packs)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Bond Breaking and Forming",
                content: `## The Energy Process

### Bond Breaking (Energy Cost)
- Must pull atoms apart against attractive forces
- **Always ENDOTHERMIC** (absorbs energy)

### Bond Forming (Energy Payoff)
- Atoms come together to lower energy state
- **Always EXOTHERMIC** (releases energy)

## Overall Energy Change

$$\\Delta H = \\text{Energy to Break Bonds} - \\text{Energy Released Forming Bonds}$$

| Result | Meaning |
|--------|---------|
| **ΔH negative** | More energy released than absorbed → **Exothermic** |
| **ΔH positive** | More energy absorbed than released → **Endothermic** |

## Bond Energy Calculation Example
**Reaction:** H-H + Cl-Cl → 2(H-Cl)
**Bond Energies:** H-H = 436, Cl-Cl = 242, H-Cl = 431 kJ/mol

1. **Breaking:** 436 + 242 = 678 kJ
2. **Forming:** 2 × 431 = 862 kJ
3. **ΔH:** 678 - 862 = **-184 kJ** (Exothermic)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Energy from Fuels",
                content: `## Fossil Fuels
"Ancient sunlight" stored in chemical bonds

| Type | State | Example |
|------|-------|---------|
| Coal | Solid | Carbon |
| Petroleum | Liquid | Hydrocarbons |
| Natural Gas | Gas | Methane (CH₄) |

**Pros:** Energy-dense, easy transport
**Cons:** Non-renewable, CO₂ (global warming), SO₂ (acid rain)

## Alternative Fuels

### Ethanol (C₂H₅OH)
- Made by fermenting plant sugars
- **Renewable** - plants absorb CO₂ as they grow
- C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O

### Hydrogen (H₂)
- 2H₂ + O₂ → 2H₂O
- **Zero pollution** - only water produced
- Highest energy per gram
- **Drawback:** Difficult to store and transport

### Nuclear (Uranium)
- Nuclear fission releases vast energy
- **No CO₂** during operation
- **Drawback:** Radioactive waste, accident risk`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Electrochemical Cells (Batteries)",
                content: `## Simple Cell
Generates electricity using reactivity difference between two metals

**Setup:** Two different metals in an electrolyte (ionic solution)

### The Process
1. **Anode (-):** More reactive metal OXIDIZES
   - Mg → Mg²⁺ + 2e⁻ (electrons released)
2. **Electrons flow** through wire (electric current)
3. **Cathode (+):** Less reactive metal - electrons accepted
   - 2H⁺ + 2e⁻ → H₂

**Voltage:** Greater reactivity difference = Higher voltage
- Mg/Cu = High voltage
- Zn/Fe = Low voltage

## Hydrogen Fuel Cell
Converts chemical energy directly to electricity

**Inputs:** H₂ (fuel) + O₂ (from air)
**Output:** Water + Electricity

**Overall:** 2H₂ + O₂ → 2H₂O

**Pros:** Only exhaust is water, silent, efficient
**Cons:** H₂ expensive to produce and store`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Reversible Reactions and Equilibrium",
                content: `## Reversible Reactions
Products can reform into reactants

**Symbol:** Double arrow ⇌

**Example - Hydrated Copper Sulfate:**
$$CuSO_4 \\cdot 5H_2O \\rightleftharpoons CuSO_4 + 5H_2O$$

| Direction | Observation | Energy |
|-----------|-------------|--------|
| Forward (heat) | Blue → White | Endothermic |
| Backward (add water) | White → Blue + heat | Exothermic |

**Rule:** If forward is exothermic, backward is endothermic (same magnitude)

## Dynamic Equilibrium
In a closed system, reversible reactions reach equilibrium:

- **Dynamic:** Reactions still occurring in BOTH directions
- **Equilibrium:** Rate forward = Rate backward
- **Result:** Concentrations stay constant (appears nothing happening)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Le Chatelier's Principle",
                content: `## The Principle
If you change conditions at equilibrium, the system shifts to OPPOSE that change.

## Effect of Temperature

| Change | System Response | Equilibrium Shifts To |
|--------|-----------------|----------------------|
| Increase temp | Tries to cool down | **Endothermic side** |
| Decrease temp | Tries to heat up | **Exothermic side** |

## Effect of Pressure (Gases Only)

| Change | System Response | Equilibrium Shifts To |
|--------|-----------------|----------------------|
| Increase pressure | Reduces gas molecules | Side with **fewer moles** |
| Decrease pressure | Creates more molecules | Side with **more moles** |

## Effect of Catalyst
- Speeds up BOTH forward and backward equally
- **Does NOT change position** of equilibrium
- Only reaches equilibrium faster

## Haber Process Example
N₂ + 3H₂ ⇌ 2NH₃ (Exothermic)

- ↑ Temperature → Shifts LEFT (less NH₃) - but faster
- ↑ Pressure → Shifts RIGHT (fewer moles) - more NH₃
- Catalyst (Fe) → Faster, no yield change`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Exothermic: releases heat, temp rises, ΔH negative",
            "Endothermic: absorbs heat, temp falls, ΔH positive",
            "Bond breaking = endothermic; Bond forming = exothermic",
            "ΔH = Energy to break - Energy released forming",
            "Fossil fuels: non-renewable, cause pollution",
            "Hydrogen fuel: zero pollution but hard to store",
            "Simple cell: reactivity difference → voltage",
            "Equilibrium: rate forward = rate backward",
            "Le Chatelier: system opposes changes to conditions",
            "Catalyst speeds up equilibrium but doesn't change position"
        ],
        exam_tips: [
            "Distinguish exothermic (heat out) from endothermic (heat in)",
            "Sketch energy profile diagrams with Eₐ and ΔH labeled",
            "Calculate ΔH using bond energies (break - form)",
            "Predict voltage: further apart in reactivity = higher",
            "Apply Le Chatelier: identify endo/exo, count gas moles",
            "Know Haber Process conditions and why compromise is needed"
        ]
    },

    "Electrochemistry": {
        topic: "Electrochemistry",
        subject: "Chemistry",
        summary: "Electrochemistry covers the relationship between electricity and chemical reactions. Electrolysis uses electricity to decompose ionic compounds. Electrochemical cells use chemical reactions to generate electricity. Key concepts include conductors, electrolytes, and predicting products at electrodes.",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Electrolysis_and_the_Four_Conductors.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL0VsZWN0cm9seXNpc19hbmRfdGhlX0ZvdXJfQ29uZHVjdG9ycy5tNGEiLCJpYXQiOjE3NjU0NzAxNjEsImV4cCI6NTI2NTk2NjE2MX0.sxl-oyxt64GLw0rRgQhgPKFb_16ofMBqV9PYg7oomKI",
        sections: [
            {
                title: "1. Conductors, Insulators, and Electrolytes",
                content: `## Conductors
Allow electricity to pass through

### Metals
- Lattice of positive ions in "sea of delocalised electrons"
- Electrons carry the current

### Graphite
- Free electrons between layers
- Used for electrodes (inert, unreactive)

## Insulators
Do not conduct - all electrons locked in bonds
Examples: Plastics, ceramics, glass, rubber

## Electrolytes
Ionic compounds that conduct ONLY when molten or dissolved

- **Solid:** Ions locked in lattice - cannot move
- **Molten/Dissolved:** Lattice breaks down - ions FREE to move
- Current carried by IONS (not electrons)
- **Decomposed** by electricity

## Non-electrolytes
Never conduct (any state): Ethanol, sugar solution, pure water, oil
Reason: Only neutral molecules, no ions`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Electrolysis: The Process",
                content: `## Definition
Using electrical energy to decompose an ionic compound

## Setup
- **DC Power Supply:** Essential for one-way electron flow
- **Electrodes:** Conduct current into/out of electrolyte
  - **Inert:** Graphite/Platinum (don't react)
  - **Active:** Metals (participate in reaction)

## Terminology (PANIC: Positive Anode, Negative Is Cathode)
- **Anode:** Positive electrode (+)
- **Cathode:** Negative electrode (-)

## The Mechanism

### At Cathode (-) - REDUCTION
Positive ions (cations) attracted → gain electrons → become atoms
$$M^{n+} + ne^- \\rightarrow M$$

### At Anode (+) - OXIDATION
Negative ions (anions) attracted → lose electrons → become atoms
$$X^{n-} \\rightarrow X + ne^-$$

**Memory: OIL RIG**
- Oxidation Is Loss (of electrons)
- Reduction Is Gain (of electrons)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Electrolysis of Molten Compounds",
                content: `## Simple Case
Only two types of ions present (no water)

## Example: Molten Lead(II) Bromide (PbBr₂)

**Ions Present:** Pb²⁺ and Br⁻

### At Cathode (-)
- Pb²⁺ ions migrate to negative electrode
- **REDUCTION:** Pb²⁺ + 2e⁻ → Pb(l)
- **Observation:** Shiny silvery bead of molten lead

### At Anode (+)
- Br⁻ ions migrate to positive electrode
- **OXIDATION:** 2Br⁻ → Br₂(g) + 2e⁻
- **Observation:** Red-brown bromine gas bubbles

## General Rule for Molten Salts
- **Cathode:** Metal deposited
- **Anode:** Non-metal released (usually gas)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Electrolysis of Aqueous Solutions",
                content: `## Complication: Water
Water provides extra ions: H₂O ⇌ H⁺ + OH⁻

**Competition at each electrode:**
- Cathode: Metal ion vs H⁺
- Anode: Anion vs OH⁻

## Rules for Discharge

### At Cathode (-) - Reactivity Rule
**Less reactive ion wins (easier to reduce)**

| Metal Reactivity | Product |
|------------------|---------|
| MORE reactive than H (K,Na,Ca,Mg,Zn) | **Hydrogen gas** |
| LESS reactive than H (Cu,Ag,Au) | **Metal deposited** |

### At Anode (+) - Concentration Rule

| Condition | Product |
|-----------|---------|
| Concentrated halide (Cl⁻,Br⁻,I⁻) | **Halogen gas** |
| Dilute solution OR sulfate/nitrate | **Oxygen gas** |

Oxygen equation: 4OH⁻ → 2H₂O + O₂ + 4e⁻

## Case Studies

### Concentrated NaCl (Brine)
- Cathode: H₂ (Na more reactive)
- Anode: Cl₂ (concentrated halide)
- Left in solution: NaOH

### Dilute H₂SO₄
- Cathode: H₂
- Anode: O₂ (sulfate too stable)
- Result: Electrolysis of water (H₂:O₂ = 2:1)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Industrial Applications",
                content: `## A. Extraction of Aluminium
Reactive metals can't be reduced by carbon

**Process:**
- Ore: Bauxite (Al₂O₃)
- Dissolved in molten cryolite (lowers m.p. from 2000°C to 950°C)

**At Cathode (carbon lining):**
Al³⁺ + 3e⁻ → Al(l)

**At Anode (carbon blocks):**
2O²⁻ → O₂ + 4e⁻
**Problem:** O₂ burns carbon anodes → must replace regularly

## B. Purifying Copper
Electrical wiring needs 99.9% purity

| Electrode | Material | Reaction |
|-----------|----------|----------|
| Anode (+) | Impure copper | Cu → Cu²⁺ + 2e⁻ (dissolves) |
| Cathode (-) | Pure copper | Cu²⁺ + 2e⁻ → Cu (plates on) |

**Electrolyte:** CuSO₄ solution
**Anode sludge:** Gold/silver impurities fall off (sold!)

## C. Electroplating
Coat object with thin metal layer

- **Object:** Cathode (-)
- **Plating metal:** Anode (+)
- **Electrolyte:** Contains plating metal ions

Example: Silver plating spoon
- Cathode: Spoon
- Anode: Pure silver
- Electrolyte: Silver nitrate`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Electrochemical Cells",
                content: `## Simple Cell
Uses chemical reaction to GENERATE electricity

**Setup:** Two different metals in electrolyte

### How It Works
1. **More reactive metal (-):** Oxidizes, releases electrons
   - Zn → Zn²⁺ + 2e⁻
2. **Electrons flow** through wire (current)
3. **Less reactive metal (+):** Electrons arrive
   - 2H⁺ + 2e⁻ → H₂ (bubbles on copper)

### Voltage
Greater reactivity difference = Higher voltage
- Mg/Cu = High voltage
- Zn/Fe = Low voltage

## Hydrogen Fuel Cell
Clean energy technology

**Inputs:** H₂ (fuel) + O₂ (from air)

**At negative electrode:** H₂ → 2H⁺ + 2e⁻
**Electrons power motor**
**At positive electrode:** O₂ + 4H⁺ + 4e⁻ → 2H₂O

**Overall:** 2H₂ + O₂ → 2H₂O

| Advantages | Disadvantages |
|------------|---------------|
| Zero emissions (water only) | H₂ expensive to produce |
| Efficient | Hard to store (flammable) |
| Quiet | Few fuel stations |`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Electrolytes conduct only when molten/dissolved (ions free to move)",
            "Anode (+), Cathode (-) — PANIC: Positive Anode, Negative Is Cathode",
            "Cathode: Reduction (gain electrons); Anode: Oxidation (lose electrons)",
            "OIL RIG: Oxidation Is Loss, Reduction Is Gain",
            "Aqueous: Reactivity rule (cathode), Concentration rule (anode)",
            "Reactive metals → H₂ at cathode; Unreactive → metal deposited",
            "Concentrated halides → halogen; Dilute/sulfate → O₂ at anode",
            "Aluminium extraction: cryolite lowers melting point",
            "Copper purification: impure anode dissolves, pure copper plates at cathode",
            "Simple cell: more reactive metal = negative pole"
        ],
        exam_tips: [
            "Define electrolysis, anode, cathode, electrolyte precisely",
            "Predict products using reactivity and concentration rules",
            "Write half-equations: 4OH⁻ → 2H₂O + O₂ + 4e⁻",
            "Draw electroplating setup (object at cathode)",
            "Explain why carbon anodes burn away in Al extraction",
            "Identify negative pole in cell (more reactive metal)"
        ]
    },

    "Redox Reactions": {
        topic: "Redox Reactions",
        subject: "Chemistry",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Oxidation_Reduction_The_Universal_Chemistry_Rule%20(1).m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL094aWRhdGlvbl9SZWR1Y3Rpb25fVGhlX1VuaXZlcnNhbF9DaGVtaXN0cnlfUnVsZSAoMSkubTRhIiwiaWF0IjoxNzY1NDcxMDM0LCJleHAiOjUyNjU5NjcwMzR9.TvxrOLfAF5O_sdTDXsakebHvskCt1myAMthONa4svx0",
        summary: "Redox reactions involve simultaneous oxidation and reduction. Oxidation is loss of electrons (or gain of oxygen); Reduction is gain of electrons (or loss of oxygen). Remember OIL RIG. Oxidation states help track electron movement, and tests can identify oxidising/reducing agents.",
        sections: [
            {
                title: "1. Defining Oxidation and Reduction",
                content: `## Definition 1: Oxygen Transfer (Classical)

| Process | Definition | Example |
|---------|------------|---------|
| **Oxidation** | Gain of oxygen | 2Mg + O₂ → 2MgO (Mg oxidized) |
| **Reduction** | Loss of oxygen | CuO + H₂ → Cu + H₂O (CuO reduced) |

## Definition 2: Electron Transfer (OIL RIG)

**OIL RIG:**
- **O**xidation **I**s **L**oss (of electrons)
- **R**eduction **I**s **G**ain (of electrons)

| Process | Electron Change | Example |
|---------|-----------------|---------|
| **Oxidation** | Loses electrons | Na → Na⁺ + e⁻ |
| **Reduction** | Gains electrons | Cl + e⁻ → Cl⁻ |

**Key Point:** Oxidation and reduction ALWAYS occur together (you can't lose electrons without something gaining them)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Half-Equations",
                content: `## Writing Half-Equations
Split the full reaction to show electron transfer clearly

### Steps:
1. Identify which species changes charge
2. Write reactant → product
3. Balance atoms if needed
4. Add electrons to balance charge

## Example: Magnesium + Oxygen

**Overall:** 2Mg + O₂ → 2MgO (ionic: Mg²⁺ and O²⁻)

### Oxidation Half-Equation (Mg)
$$Mg \\rightarrow Mg^{2+} + 2e^-$$
Electrons on RIGHT = lost = **Oxidation**

### Reduction Half-Equation (O)
$$O_2 + 4e^- \\rightarrow 2O^{2-}$$
Electrons on LEFT = gained = **Reduction**

## Example: Displacement (Zn + CuSO₄)

**Net Ionic:** Zn + Cu²⁺ → Zn²⁺ + Cu

| Half-Equation | Process |
|---------------|---------|
| Zn → Zn²⁺ + 2e⁻ | Oxidation |
| Cu²⁺ + 2e⁻ → Cu | Reduction |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Oxidation States",
                content: `## Rules for Assigning Oxidation States

| Rule | Value | Examples |
|------|-------|----------|
| Uncombined elements | **0** | Na, Cl₂, O₂, Fe |
| Simple ions | **= charge** | Na⁺ = +1, Cl⁻ = -1 |
| Compounds | **Sum = 0** | NaCl: +1 + (-1) = 0 |
| Hydrogen | **+1** (usually) | Exception: -1 in NaH |
| Oxygen | **-2** (usually) | Exception: -1 in H₂O₂ |

## Identifying Redox Using Oxidation States

| Change | Meaning |
|--------|---------|
| **Increase** (e.g., 0 → +2) | **Oxidation** (lost electrons) |
| **Decrease** (e.g., 0 → -2) | **Reduction** (gained electrons) |

## Example: Fe + S → FeS

**Reactants:** Fe = 0, S = 0
**Products:** In FeS, S = -2, so Fe = +2

| Element | Change | Process |
|---------|--------|---------|
| Fe | 0 → +2 | Oxidized |
| S | 0 → -2 | Reduced |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Oxidising and Reducing Agents",
                content: `## Definitions (Names seem backward!)

| Agent | What it does | What happens to it |
|-------|--------------|-------------------|
| **Oxidising Agent** | Oxidizes another (takes electrons) | Gets REDUCED |
| **Reducing Agent** | Reduces another (gives electrons) | Gets OXIDIZED |

## Common Agents

| Oxidising Agents | Reducing Agents |
|------------------|-----------------|
| Oxygen (O₂) | Hydrogen (H₂) |
| Chlorine (Cl₂) | Carbon (C) |
| Conc. H₂SO₄ | Carbon monoxide (CO) |
| KMnO₄ | Reactive metals (Na, Mg, Zn) |

## Lab Tests

### Test for Reducing Agents: KMnO₄
- Potassium manganate(VII) is an oxidising agent
- **Color change:** Purple → Colorless
- MnO₄⁻ (purple) is reduced to Mn²⁺ (colorless)

### Test for Oxidising Agents: KI
- Potassium iodide is a reducing agent
- **Color change:** Colorless → Red-Brown
- I⁻ (colorless) is oxidized to I₂ (red-brown)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Everyday Examples of Redox",
                content: `## Combustion
Rapid oxidation of fuel
- Carbon + Oxygen → Carbon dioxide + Energy
- All burning is oxidation

## Respiration
"Biological burning" in cells
- Glucose + Oxygen → CO₂ + H₂O + Energy
- Glucose is oxidized

## Rusting
Slow oxidation of iron
$$4Fe + 3O_2 + xH_2O \\rightarrow 2Fe_2O_3 \\cdot xH_2O$$
- Iron is oxidized to iron(III) oxide (rust)
- Destructive process

## Metal Extraction (Blast Furnace)
Reduction of metal ores
$$Fe_2O_3 + 3CO \\rightarrow 2Fe + 3CO_2$$
- Iron oxide is REDUCED (loses oxygen)
- Carbon monoxide is the REDUCING AGENT

## Photography
Light reduces silver ions to silver metal
- Ag⁺ + e⁻ → Ag
- Silver grains create dark areas on film`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Redox = Reduction + Oxidation occurring together",
            "OIL RIG: Oxidation Is Loss, Reduction Is Gain (of electrons)",
            "Oxidation: gain oxygen OR lose electrons OR increase oxidation state",
            "Reduction: lose oxygen OR gain electrons OR decrease oxidation state",
            "Half-equations show electron transfer explicitly",
            "Oxidising agent: takes electrons, gets reduced itself",
            "Reducing agent: gives electrons, gets oxidized itself",
            "KMnO₄ test: purple → colorless = reducing agent present",
            "KI test: colorless → red-brown = oxidising agent present",
            "Common examples: combustion, respiration, rusting, metal extraction"
        ],
        exam_tips: [
            "Define oxidation/reduction in three ways (oxygen, electrons, oxidation state)",
            "Identify oxidized/reduced substances AND oxidising/reducing agents",
            "Write half-equations: balance atoms, then add e⁻ to balance charge",
            "Describe KMnO₄ color change: Purple → Colorless",
            "Calculate oxidation states (O = -2, H = +1, compound = 0)",
            "In CuO + Mg → MgO + Cu: Mg oxidized, CuO reduced, CuO is oxidising agent"
        ]
    },

    "Acids, Bases and Salts": {
        topic: "Acids, Bases and Salts",
        subject: "Chemistry",
        summary: "Acids release H⁺ ions in water; alkalis release OH⁻ ions. The pH scale measures acidity (0-14). Acids react with metals, bases, and carbonates to form salts. Salts can be prepared by titration, excess solid method, or precipitation depending on solubility.",
        sections: [
            {
                title: "1. Acids and Alkalis",
                content: `## Acids
Dissolve in water to produce **Hydrogen ions (H⁺)**

### Common Acids
| Type | Examples |
|------|----------|
| **Mineral (Strong)** | HCl, H₂SO₄, HNO₃ |
| **Organic (Weak)** | CH₃COOH (vinegar), Citric acid |

**Properties:**
- Turn blue litmus RED
- Conduct electricity (electrolytes)
- Corrosive

## Alkalis (Soluble Bases)
Dissolve in water to produce **Hydroxide ions (OH⁻)**

### Common Alkalis
- NaOH (caustic soda)
- KOH (caustic potash)
- Ca(OH)₂ (limewater)
- NH₃(aq) (ammonia solution)

**Properties:**
- Turn red litmus BLUE
- Feel soapy/slippery
- Corrosive (can be more dangerous than acids)

## Base Definition
Any substance that neutralizes an acid → Salt + Water
Bases include metal oxides and metal hydroxides`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. The pH Scale and Indicators",
                content: `## The pH Scale (0-14)
Measures H⁺ concentration (logarithmic: 1 pH unit = 10× change)

| pH | Type | Examples | Universal Indicator |
|----|------|----------|---------------------|
| 0-2 | Strong acid | Battery acid, stomach acid | Red |
| 3-6 | Weak acid | Vinegar, lemon juice | Orange/Yellow |
| 7 | Neutral | Pure water, salt solution | Green |
| 8-11 | Weak alkali | Baking soda, toothpaste | Blue |
| 12-14 | Strong alkali | Bleach, drain cleaner | Purple |

## Universal Indicator
Mixture of dyes - gives color across whole pH range

## Specific Indicators for Titration

| Indicator | In Acid | In Alkali |
|-----------|---------|-----------|
| Litmus | Red | Blue |
| Phenolphthalein | Colorless | Pink |
| Methyl Orange | Red | Yellow |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Strength vs Concentration",
                content: `## Concentration (Amount Dissolved)
- **Concentrated:** Many particles in small volume
- **Dilute:** Few particles in large volume

## Strength (Degree of Ionisation)

### Strong Acids/Alkalis
**100% ionisation** - every molecule splits into ions

$$HCl \\rightarrow H^+ + Cl^-$$

- High conductivity
- Very low/high pH (0-1 or 13-14)
- Examples: HCl, H₂SO₄, HNO₃, NaOH, KOH

### Weak Acids/Alkalis
**Partial ionisation** (~1%) - most stay as molecules

$$CH_3COOH \\rightleftharpoons H^+ + CH_3COO^-$$

- Lower conductivity
- Moderate pH (3-5 or 9-11)
- Examples: CH₃COOH (ethanoic), citric acid, NH₃

**Key Point:** You can have concentrated weak acid or dilute strong acid!`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Reactions of Acids",
                content: `## Reaction 1: Acid + Metal → Salt + Hydrogen

$$Mg + 2HCl \\rightarrow MgCl_2 + H_2$$

- Works with reactive metals (Mg, Zn, Fe)
- NOT very reactive (K, Na) - too dangerous!
- NOT unreactive (Cu, Ag, Au) - no reaction
- **Test for H₂:** Squeaky pop with lighted splint

## Reaction 2: Acid + Base → Salt + Water (Neutralisation)

$$H_2SO_4 + CuO \\rightarrow CuSO_4 + H_2O$$

**Ionic equation:** H⁺ + OH⁻ → H₂O

- Base = metal oxide or metal hydroxide
- Observation: solid dissolves, flask gets warm

## Reaction 3: Acid + Carbonate → Salt + Water + CO₂

$$2HCl + CaCO_3 \\rightarrow CaCl_2 + H_2O + CO_2$$

- Immediate vigorous fizzing
- **Test for CO₂:** Limewater turns milky/cloudy`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Types of Oxides",
                content: `## Basic Oxides (Metal Oxides)
- React with acids to form salts
- Examples: MgO, CuO, CaO
- Some dissolve to form alkalis (Na₂O, K₂O)

## Acidic Oxides (Non-metal Oxides)
- React with alkalis to form salts
- Dissolve in water to form acids
- Examples: SO₂, CO₂, NO₂
- Cause of **Acid Rain:** SO₂ + H₂O → H₂SO₃

## Amphoteric Oxides
React with BOTH acids AND alkalis

**Examples:** Al₂O₃, ZnO

| Reaction | Acts as |
|----------|---------|
| ZnO + 2HCl → ZnCl₂ + H₂O | Base |
| ZnO + 2NaOH → Na₂ZnO₂ + H₂O | Acid |

## Neutral Oxides
No reaction with acids or alkalis
Examples: H₂O, CO, N₂O`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Preparation of Salts",
                content: `## Solubility Rules (MEMORIZE)

| Soluble | Insoluble |
|---------|-----------|
| All nitrates | - |
| All Na⁺, K⁺, NH₄⁺ salts | - |
| Most chlorides | AgCl, PbCl₂ |
| Most sulfates | BaSO₄, CaSO₄, PbSO₄ |
| Na/K/NH₄ carbonates | All other carbonates |

## Method A: Titration
**For:** Soluble salts from two soluble reactants (NaCl, K₂SO₄)

1. Pipette 25cm³ alkali + indicator
2. Add acid from burette until color change
3. Repeat WITHOUT indicator
4. Evaporate to crystallize

## Method B: Excess Solid
**For:** Soluble salts from insoluble base (CuSO₄, MgCl₂)

1. Warm acid, add excess solid base
2. Filter (remove excess solid)
3. Evaporate filtrate to crystallize

## Method C: Precipitation
**For:** Insoluble salts (BaSO₄, AgCl)

1. Mix two soluble salt solutions
2. Precipitate forms instantly
3. Filter, wash, dry`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Acids produce H⁺ ions; Alkalis produce OH⁻ ions",
            "pH scale: 0-6 acidic, 7 neutral, 8-14 alkaline",
            "Strong = 100% ionised; Weak = partially ionised",
            "Acid + Metal → Salt + H₂ (squeaky pop test)",
            "Acid + Base → Salt + H₂O (neutralisation)",
            "Acid + Carbonate → Salt + H₂O + CO₂ (limewater test)",
            "Amphoteric oxides react with both acids AND alkalis",
            "All nitrates soluble; Most carbonates insoluble",
            "Titration for soluble + soluble; Excess method for soluble + insoluble",
            "Precipitation for insoluble salts"
        ],
        exam_tips: [
            "Distinguish strength (ionisation) from concentration (amount)",
            "Write ionic equation for neutralisation: H⁺ + OH⁻ → H₂O",
            "Know tests: H₂ (squeaky pop), CO₂ (limewater cloudy)",
            "Identify amphoteric oxides (Al₂O₃, ZnO) and write both reactions",
            "Choose correct salt preparation method based on solubility",
            "Know solubility rules - especially exceptions (AgCl, BaSO₄)"
        ]
    },

    "Metals": {
        topic: "Metals",
        subject: "Chemistry",
        summary: "Metals have characteristic properties due to metallic bonding (delocalised electrons). The Reactivity Series ranks metals by their tendency to form ions. Extraction method depends on reactivity: electrolysis for reactive metals, carbon reduction for less reactive. Alloys are harder than pure metals due to disrupted layers.",
        sections: [
            {
                title: "1. General Properties of Metals",
                content: `## Physical Properties (due to metallic bonding)

| Property | Explanation |
|----------|-------------|
| **Conductivity** | Delocalised electrons carry current/heat |
| **Malleability** | Layers slide; electron sea maintains bond |
| **Ductility** | Can be drawn into wires |
| **Lustre** | Electrons reflect light (shiny) |
| **High m.p.** | Strong ion-electron attraction |
| **High density** | Atoms packed tightly |

**Exceptions:**
- Group I metals (Li, Na, K) - low density, float on water
- Mercury (Hg) - liquid at room temperature

## Chemical Properties

- **Form positive ions** by losing electrons
  - Na → Na⁺ + e⁻
  - Mg → Mg²⁺ + 2e⁻
- **React with oxygen** → Metal oxides (basic)
- **React with acids** → Salt + Hydrogen`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. The Reactivity Series",
                content: `## Order (Most → Least Reactive)

**K** - Potassium
**Na** - Sodium
**Ca** - Calcium
**Mg** - Magnesium
**Al** - Aluminium
*(Carbon)*
**Zn** - Zinc
**Fe** - Iron
**Pb** - Lead
*(Hydrogen)*
**Cu** - Copper
**Ag** - Silver
**Au** - Gold

## Reactions with Water

| Metal | Reaction | Product |
|-------|----------|---------|
| K, Na | Violent with cold water | MOH + H₂ |
| Ca | Steady with cold water | Ca(OH)₂ + H₂ |
| Mg | Very slow cold; vigorous with steam | MgO + H₂ |
| Zn, Fe | Slow with steam | Oxide + H₂ |
| Cu, Ag, Au | **No reaction** | - |

## Reactions with Dilute Acid

| Metal | Reaction |
|-------|----------|
| K, Na, Ca | Too dangerous! |
| Mg | Vigorous fizzing |
| Zn | Steady bubbling |
| Fe | Slow bubbling |
| Cu, Ag, Au | **No reaction** (below H) |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Displacement Reactions",
                content: `## Rule
**More reactive metal displaces less reactive metal from its compound**

## Displacement with Oxides (Thermite)

$$Mg + CuO \\rightarrow MgO + Cu$$

- Mg is more reactive → steals oxygen
- Mg is **oxidized** (gains O)
- Cu is **reduced** (loses O)
- **No reaction:** Cu + MgO (Cu can't steal O back)

## Displacement in Solution

$$Zn(s) + CuSO_4(aq) \\rightarrow ZnSO_4(aq) + Cu(s)$$

**Observations:**
- Blue solution → colorless
- Red-brown copper deposits on zinc
- Zinc dissolves

**Ionic equation:**
$$Zn + Cu^{2+} \\rightarrow Zn^{2+} + Cu$$

Zinc loses electrons (oxidized), Copper gains electrons (reduced)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Extraction of Metals",
                content: `## Method Depends on Reactivity

| Reactivity | Metals | Method |
|------------|--------|--------|
| High | K, Na, Ca, Mg, Al | **Electrolysis** |
| Medium | Zn, Fe, Pb | **Carbon reduction** |
| Low | Cu, Ag, Au | Found native/heating |

## Electrolysis: Aluminium Extraction

**Ore:** Bauxite (Al₂O₃)
**Dissolved in:** Molten cryolite (lowers m.p. from 2000°C to 950°C)

| Electrode | Reaction |
|-----------|----------|
| Cathode (-) | Al³⁺ + 3e⁻ → Al(l) |
| Anode (+) | 2O²⁻ → O₂ + 4e⁻ |

**Problem:** O₂ burns carbon anodes → must replace regularly

## Carbon Reduction: Blast Furnace (Iron)

**Raw materials:** Haematite (Fe₂O₃), Coke (C), Limestone, Hot air

**Key Reactions:**
1. C + O₂ → CO₂ (heat)
2. C + CO₂ → 2CO (reducing agent)
3. **Fe₂O₃ + 3CO → 2Fe + 3CO₂** (reduction)

**Slag formation:**
- CaCO₃ → CaO + CO₂
- CaO + SiO₂ → CaSiO₃ (removes impurities)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Alloys",
                content: `## Why Alloys?
Pure metals often too soft for practical use

## Structure Comparison

**Pure Metal:**
- Same-sized atoms in regular layers
- Layers slide easily → soft

**Alloy:**
- Different-sized atoms disrupt layers
- Layers can't slide → **harder and stronger**

## Common Alloys

| Alloy | Composition | Properties/Uses |
|-------|-------------|-----------------|
| **Mild Steel** | Fe + 0.25% C | Strong, malleable; car bodies |
| **Stainless Steel** | Fe + Cr + Ni | Rust-resistant; cutlery, surgery |
| **Brass** | Cu + Zn | Hard, doesn't corrode; instruments |
| **Bronze** | Cu + Sn | Very hard; statues, propellers |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Corrosion (Rusting)",
                content: `## Conditions for Rusting
Iron rusts ONLY when **Oxygen AND Water** both present

**Product:** Hydrated iron(III) oxide (Fe₂O₃·xH₂O)
- Red-brown, flaky
- Flakes off → exposes more iron → destructive

## Prevention Methods

### 1. Barrier Methods
- Paint, grease, plastic coating
- Another metal layer
- Stops O₂ and H₂O reaching iron

### 2. Galvanising
- Coat with Zinc layer
- Zinc is more reactive → oxidizes first
- Protects even if scratched

### 3. Sacrificial Protection
- Bolt blocks of Mg or Zn to iron
- More reactive metal corrodes instead
- Used on ships, pipelines
- Must replace sacrificial blocks regularly`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Metallic bonding: positive ions in sea of delocalised electrons",
            "Reactivity series: K > Na > Ca > Mg > Al > (C) > Zn > Fe > (H) > Cu > Ag > Au",
            "More reactive metal displaces less reactive from compounds",
            "Reactive metals (K-Al): extracted by electrolysis",
            "Less reactive metals (Zn-Pb): extracted by carbon reduction",
            "Blast furnace: CO reduces Fe₂O₃; limestone removes impurities",
            "Aluminium: cryolite lowers m.p.; anodes burn away",
            "Alloys harder than pure metals (different atom sizes disrupt layers)",
            "Rusting needs oxygen AND water",
            "Prevent rust: barrier, galvanising, or sacrificial protection"
        ],
        exam_tips: [
            "List reactivity series with Carbon and Hydrogen positions",
            "Predict displacement: more reactive wins",
            "Write blast furnace equations (CO formation and ore reduction)",
            "Explain cryolite's role and why anodes need replacing",
            "Draw alloy structure showing different-sized atoms",
            "Explain galvanising: Zn more reactive, oxidizes first"
        ]
    },

    "Non-metals": {
        topic: "Non-metals",
        subject: "Chemistry",
        summary: "Non-metals include essential elements like hydrogen, nitrogen, sulfur, and carbon. Key industrial processes include the Haber Process (ammonia from N₂ + H₂), Contact Process (sulfuric acid from sulfur), and the Limestone Cycle. Understanding environmental impacts like acid rain and eutrophication is crucial.",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Why_Non-Metals_Rule_the_World.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL1doeV9Ob24tTWV0YWxzX1J1bGVfdGhlX1dvcmxkLm00YSIsImlhdCI6MTc2NTQ3MTA5NCwiZXhwIjo1MjY1OTY3MDk0fQ.gyP9bkFB1aeunr7wuMTdikPOTBY7Qh_RSqI6I4tq2kI",
        sections: [
            {
                title: "1. Hydrogen (H₂)",
                content: `## Properties
- Colorless, odorless, tasteless gas
- **Lightest gas** - 14× less dense than air
- Insoluble in water
- **Highly flammable:** 2H₂ + O₂ → 2H₂O + Energy

**Test:** Burns with "squeaky pop" with lighted splint

## Uses

### Haber Process
Reacts with N₂ to make ammonia (fertilizers)

### Hardening Oils (Margarine)
- Unsaturated oils have C=C double bonds (liquid)
- **Hydrogenation:** H₂ + Nickel catalyst at 60°C
- Adds H across C=C → saturated fat (solid)

### Fuel Technology
- **Rocket fuel:** Highest energy-to-weight ratio
- **Fuel cells:** H₂ + O₂ → H₂O + electricity
  - Zero emissions (only water)
  - Quiet and efficient`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Nitrogen (N₂) and Ammonia (NH₃)",
                content: `## Nitrogen
- 78% of atmosphere
- **Very unreactive** due to N≡N triple bond
- Uses: cryogenic cooling, food packaging

## Ammonia (NH₃)
- Colorless gas, **pungent smell**
- **Extremely soluble** (fountain experiment)
- **Only common alkaline gas**

$$NH_3 + H_2O \\rightleftharpoons NH_4^+ + OH^-$$

Turns red litmus BLUE

## The Haber Process

$$N_2 + 3H_2 \\rightleftharpoons 2NH_3$$ (Exothermic)

| Condition | Value | Reason |
|-----------|-------|--------|
| Temperature | 450°C | Compromise: too low = slow, too high = low yield |
| Pressure | 200 atm | Fewer moles on right → high P favors products |
| Catalyst | Iron | Speeds up reaction (doesn't change yield) |

**Yield:** ~15% per pass; unreacted gases recycled

## Fertilizers (NPK)
- **N:** Leaf growth (from NH₃)
- **P:** Root development
- **K:** Disease resistance

**Ammonium Nitrate:** NH₃ + HNO₃ → NH₄NO₃

### Eutrophication (Environmental Problem)
1. Fertilizers leach into water
2. Algae bloom (blocks light)
3. Plants die, bacteria multiply
4. Bacteria consume all oxygen
5. Fish suffocate → "dead zone"`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Sulfur and Sulfuric Acid",
                content: `## Sulfur Dioxide (SO₂)
- Colorless, choking smell
- S + O₂ → SO₂
- **Uses:** Food preservative, bleaching agent
- **Problem:** Causes ACID RAIN

## The Contact Process

### Stage 1: Make SO₂
$$S + O_2 \\rightarrow SO_2$$

### Stage 2: Convert to SO₃
$$2SO_2 + O_2 \\rightleftharpoons 2SO_3$$

| Condition | Value | Reason |
|-----------|-------|--------|
| Temperature | 450°C | Compromise (exothermic reaction) |
| Pressure | 1-2 atm | Yield already high (~98%) |
| Catalyst | V₂O₅ | Speeds up oxidation |

### Stage 3: Make H₂SO₄
**NOT** direct: SO₃ + H₂O (too dangerous - acid mist!)

1. SO₃ dissolved in conc. H₂SO₄ → **Oleum** (H₂S₂O₇)
2. Oleum + H₂O → 2H₂SO₄

## Uses of H₂SO₄
- **Car batteries** (electrolyte)
- **Fertilizers** (ammonium sulfate)
- **Paints** (TiO₂ pigment)
- **Detergents**

## Dehydrating Agent
Removes water from compounds:
- Blue CuSO₄·5H₂O → White CuSO₄
- Sugar → Black carbon + steam`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Carbon and Carbonates",
                content: `## Carbon Dioxide (CO₂)

**Preparation:** Acid + Carbonate
$$CaCO_3 + 2HCl \\rightarrow CaCl_2 + H_2O + CO_2$$

**Properties:**
- 1.5× denser than air
- Slightly acidic in water (carbonic acid)

**Uses:** Fire extinguishers, carbonated drinks, dry ice

**Environmental:** Major GREENHOUSE GAS → global warming

## Carbon Monoxide (CO) - "Silent Killer"
- From **incomplete combustion**
- Colorless, odorless, TOXIC
- Binds to haemoglobin 200× stronger than O₂
- Prevents blood carrying oxygen → death

## The Limestone Cycle

### 1. Limestone (CaCO₃)
Starting material - quarried

### 2. Quicklime (CaO)
$$CaCO_3 \\xrightarrow{heat} CaO + CO_2$$
Use: Neutralize acidic soil rapidly

### 3. Slaked Lime (Ca(OH)₂ solid)
$$CaO + H_2O \\rightarrow Ca(OH)_2$$ (Exothermic!)
Use: Neutralize acidity slowly

### 4. Limewater (Ca(OH)₂ solution)
**Test for CO₂:** Turns milky/cloudy
$$Ca(OH)_2 + CO_2 \\rightarrow CaCO_3 + H_2O$$

## Industrial Uses of Limestone
- **Blast furnace:** Removes silica impurities
- **Cement:** Limestone + clay heated
- **Flue gas scrubbing:** Neutralizes SO₂`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "H₂ test: squeaky pop; lightest gas; used in Haber Process",
            "N₂ unreactive (triple bond); NH₃ is alkaline gas",
            "Haber: N₂ + 3H₂ ⇌ 2NH₃ at 450°C, 200 atm, Fe catalyst",
            "Eutrophication: fertilizer runoff → algae → oxygen depletion → fish death",
            "Contact: SO₂ → SO₃ → Oleum → H₂SO₄ (V₂O₅ catalyst)",
            "H₂SO₄ uses: batteries, fertilizers, paints, dehydrating agent",
            "CO₂: greenhouse gas; test with limewater",
            "CO: silent killer - binds haemoglobin 200× stronger than O₂",
            "Limestone cycle: CaCO₃ → CaO → Ca(OH)₂ → limewater"
        ],
        exam_tips: [
            "Justify Haber conditions: 450°C compromise, 200 atm for fewer moles",
            "Describe eutrophication step by step",
            "Explain why SO₃ not added directly to water (dangerous mist)",
            "List H₂SO₄ uses: batteries, fertilizers, paints",
            "Write limestone cycle equations",
            "Explain CO toxicity mechanism (binds haemoglobin)"
        ]
    },

    "Chemistry of the Environment": {
        topic: "Chemistry of the Environment",
        subject: "Chemistry",
        summary: "Environmental chemistry covers water treatment, air composition, pollution, and climate change. Key topics include the water treatment process, fractional distillation of air, acid rain formation, the greenhouse effect, and ozone layer depletion by CFCs.",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Proving_Water_Identity_and_Purity.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL1Byb3ZpbmdfV2F0ZXJfSWRlbnRpdHlfYW5kX1B1cml0eS5tNGEiLCJpYXQiOjE3NjU0NzEwNzMsImV4cCI6NTI2NTk2NzA3M30.6DzLpihrabU9gIwrwYr9bppQlg2nZlWqNaCADVwNirY",
        sections: [
            {
                title: "1. Water (H₂O)",
                content: `## Tests for Water

### Anhydrous Copper(II) Sulfate
$$CuSO_4 \\text{ (White)} + 5H_2O \\rightarrow CuSO_4 \\cdot 5H_2O \\text{ (Blue)}$$

### Cobalt Chloride Paper
Blue → Pink in presence of water

**Note:** These tests confirm water is PRESENT, not that it's PURE

## Test for Purity
- **Boiling point:** Pure water boils at exactly 100°C
- **Freezing point:** Pure water freezes at exactly 0°C
- Impurities raise b.p. and lower f.p.

## Water Treatment (4 Steps)

| Step | Process | Purpose |
|------|---------|---------|
| 1. Screening | Metal grids | Remove large debris |
| 2. Coagulation | Add aluminium sulfate | Clumps particles (floc) → sink |
| 3. Filtration | Sand and gravel beds | Trap fine particles |
| 4. Chlorination | Add chlorine | Kill bacteria/viruses |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Air and its Composition",
                content: `## Composition of Clean Dry Air

| Gas | Percentage | Notes |
|-----|------------|-------|
| Nitrogen (N₂) | 78% | Inert, dilutes O₂ |
| Oxygen (O₂) | 21% | Respiration, combustion |
| Argon (Ar) | 0.9% | Noble gas, inert |
| Carbon Dioxide | 0.04% | Photosynthesis, greenhouse gas |

**Variable:** Water vapor (0-4%), pollutants

## Fractional Distillation of Air

### Step 1: Purification
Remove CO₂ and H₂O (would freeze and block pipes)

### Step 2: Liquefaction
Compress and cool to -200°C → liquid air

### Step 3: Fractional Distillation

| Gas | Boiling Point | Collection |
|-----|---------------|------------|
| Nitrogen | -196°C | Top (lowest b.p., boils first) |
| Argon | -186°C | Middle |
| Oxygen | -183°C | Bottom (highest b.p., stays liquid) |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Air Pollution",
                content: `## Major Pollutants

| Pollutant | Source | Effect |
|-----------|--------|--------|
| **CO** | Incomplete combustion | Binds haemoglobin → death |
| **SO₂** | Burning coal/oil | Acid rain, respiratory issues |
| **NOₓ** | Car engines (high temp) | Acid rain, smog |
| **Lead** | Leaded petrol (banned) | Brain/nerve damage |

## Acid Rain Formation

$$2SO_2 + O_2 + 2H_2O \\rightarrow 2H_2SO_4$$
$$4NO_2 + O_2 + 2H_2O \\rightarrow 4HNO_3$$

### Effects
- **Soil/Trees:** Leaches nutrients, kills roots
- **Lakes:** Fish die below pH 4
- **Buildings:** Corrodes limestone

## Solutions

### Catalytic Converters (Cars)
$$2CO + 2NO \\rightarrow 2CO_2 + N_2$$
Platinum/Rhodium catalyst converts toxic → harmless

### Flue Gas Desulfurisation (Power Stations)
$$CaCO_3 + SO_2 \\rightarrow CaSO_3 + CO_2$$
Limestone neutralizes SO₂ → produces gypsum`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Climate Change: The Greenhouse Effect",
                content: `## The Mechanism

1. **Sun** → short-wave radiation passes through atmosphere
2. **Earth absorbs** → warms up
3. **Earth re-emits** → long-wave infrared (IR)
4. **Greenhouse gases absorb IR** → re-radiate heat back

## Greenhouse Gases

| Gas | Source | Notes |
|-----|--------|-------|
| **CO₂** | Fossil fuels, deforestation | Main contributor (volume) |
| **CH₄** | Landfills, cattle, rice paddies | 25× more effective per molecule |

## Consequences of Global Warming

- **Rising sea levels:** Ice melts + thermal expansion
- **Extreme weather:** Hurricanes, droughts, floods
- **Ecosystem damage:** Coral bleaching, habitat loss
- **Coastal flooding:** Threatens low-lying nations`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. The Ozone Layer",
                content: `## Function
- Located in stratosphere (20-30 km up)
- Absorbs harmful UV radiation
- Protects from skin cancer, cataracts

## Ozone Depletion

### The Cause: CFCs (Chlorofluorocarbons)
- Used in: refrigerators, aerosols, foam
- Properties: non-toxic, non-flammable, inert at ground level

### The Mechanism
1. CFCs drift to stratosphere (unreactive, don't break down)
2. UV breaks C-Cl bond → releases Cl atoms
3. Cl attacks O₃ → O₂
4. **One Cl destroys 100,000+ O₃ molecules** (catalytic)

## Solution: Montreal Protocol (1987)
- International ban on CFC production
- Replaced with HFCs (no chlorine)
- Ozone layer slowly recovering`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Test for water: CuSO₄ (white→blue) or CoCl₂ paper (blue→pink)",
            "Pure water: b.p. 100°C, f.p. 0°C exactly",
            "Water treatment: screen → coagulate → filter → chlorinate",
            "Air: 78% N₂, 21% O₂, 0.9% Ar, 0.04% CO₂",
            "Fractional distillation: N₂ out top (lowest b.p.), O₂ stays bottom",
            "Acid rain: SO₂ + NOₓ → H₂SO₄ + HNO₃",
            "Catalytic converter: 2CO + 2NO → 2CO₂ + N₂",
            "Greenhouse effect: CO₂ and CH₄ trap infrared radiation",
            "CFCs destroy ozone catalytically (1 Cl → 100,000 O₃)",
            "Montreal Protocol banned CFCs → ozone recovering"
        ],
        exam_tips: [
            "Describe 4-step water treatment process",
            "Explain fractional distillation of air (b.p. differences)",
            "Write acid rain equations (SO₂ and NOₓ)",
            "Explain catalytic converter reaction",
            "Describe greenhouse effect mechanism",
            "Explain how CFCs destroy ozone (catalytic cycle)"
        ]
    },

    "Organic Chemistry": {
        topic: "Organic Chemistry",
        subject: "Chemistry",
        summary: "Organic chemistry is the study of carbon compounds. Carbon's unique properties (tetravalency, catenation) allow millions of compounds. Key topics include crude oil fractionation, alkanes (saturated), alkenes (unsaturated), combustion, addition reactions, alcohols, and polymers.",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/How_Carbon_Builds_Life_and_Plastic.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL0hvd19DYXJib25fQnVpbGRzX0xpZmVfYW5kX1BsYXN0aWMubTRhIiwiaWF0IjoxNzY1NDcwMTgxLCJleHAiOjUyNjU5NjYxODF9.1YqEZUZcHLpPBF-7BVuPje_OfMv65EU_FQNFpF0h8nc",
        sections: [
            {
                title: "1. Introduction and Crude Oil",
                content: `## Carbon's Unique Properties

- **Tetravalency:** Forms 4 covalent bonds (Group IV)
- **Catenation:** Bonds to other carbons (chains, branches, rings)
- **Multiple bonds:** Single (C-C), Double (C=C), Triple (C≡C)

## Fractional Distillation of Crude Oil

Crude oil = mixture of hydrocarbons, separated by boiling point

| Fraction | Carbons | B.P. | Uses |
|----------|---------|------|------|
| Refinery Gas | C₁₋₄ | <40°C | LPG, cooking |
| Petrol | C₅₋₁₀ | 40-110°C | Car fuel |
| Naphtha | C₇₋₁₄ | 110-180°C | Chemicals, plastics |
| Kerosene | C₁₁₋₁₆ | 180-250°C | Jet fuel |
| Diesel | C₁₅₋₂₀ | 250-350°C | Lorries, trains |
| Bitumen | >C₇₀ | Residue | Roads, roofing |

**Trends:** Longer chain → higher b.p., more viscous, less flammable

## Cracking
Breaks long chains into short (useful) ones

$$C_{10}H_{22} \\xrightarrow{heat/catalyst} C_8H_{18} + C_2H_4$$

Products: Short alkane + Alkene (for plastics)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Alkanes and Alkenes",
                content: `## Alkanes (Saturated)

**General Formula:** CₙH₂ₙ₊₂
**Bonds:** Single C-C bonds only
**Reactivity:** Unreactive (strong C-C and C-H bonds)

| Name | Formula | Structure |
|------|---------|-----------|
| Methane | CH₄ | CH₄ |
| Ethane | C₂H₆ | CH₃-CH₃ |
| Propane | C₃H₈ | CH₃-CH₂-CH₃ |
| Butane | C₄H₁₀ | CH₃-CH₂-CH₂-CH₃ |

**Isomers:** Same formula, different structure (e.g., butane vs 2-methylpropane)

## Alkenes (Unsaturated)

**General Formula:** CₙH₂ₙ
**Bonds:** Contains C=C double bond
**Reactivity:** Very reactive (double bond breaks open)

| Name | Formula |
|------|---------|
| Ethene | C₂H₄ |
| Propene | C₃H₆ |

## Test for Unsaturation (Bromine Water)

| Sample | Result |
|--------|--------|
| Alkene | Orange → **Colorless** (decolorized) |
| Alkane | Stays orange (no reaction) |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Reactions of Hydrocarbons",
                content: `## Combustion

### Complete (plenty of O₂)
$$CH_4 + 2O_2 \\rightarrow CO_2 + 2H_2O$$
- Blue flame, maximum energy
- Products: CO₂ + H₂O

### Incomplete (limited O₂)
- Products: CO (toxic) + C (soot) + H₂O
- Yellow flame, less energy
- **Danger:** CO binds to haemoglobin

## Alkane Reactions: Substitution

Requires **UV light**
$$CH_4 + Cl_2 \\xrightarrow{UV} CH_3Cl + HCl$$
One H replaced by halogen

## Alkene Reactions: Addition

Double bond opens, atoms add on

### Hydrogenation (+ H₂)
$$C_2H_4 + H_2 \\xrightarrow{Ni, 150°C} C_2H_6$$
Makes margarine from oils

### Hydration (+ Steam)
$$C_2H_4 + H_2O \\xrightarrow{H_3PO_4} C_2H_5OH$$
Makes ethanol industrially

### Halogenation (+ Br₂)
$$C_2H_4 + Br_2 \\rightarrow C_2H_4Br_2$$
Bromine water test`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Alcohols",
                content: `## Functional Group: -OH (Hydroxyl)

**General Formula:** CₙH₂ₙ₊₁OH

| Name | Formula |
|------|---------|
| Methanol | CH₃OH |
| Ethanol | C₂H₅OH |
| Propanol | C₃H₇OH |

**Properties:**
- Small alcohols soluble in water (polar -OH)
- Burn with clean blue flame (good fuel)
- Can be oxidized to acids

## Making Ethanol

### Method 1: Fermentation (Biological)
$$C_6H_{12}O_6 \\xrightarrow{yeast} 2C_2H_5OH + 2CO_2$$

| Pros | Cons |
|------|------|
| Renewable (sugar) | Slow batch process |
| Low energy | Impure (needs distillation) |

### Method 2: Hydration (Industrial)
$$C_2H_4 + H_2O \\xrightarrow{H_3PO_4} C_2H_5OH$$

| Pros | Cons |
|------|------|
| Fast, continuous | Uses crude oil (non-renewable) |
| Pure product | High energy costs |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Polymers and Plastics",
                content: `## Addition Polymerisation

**Monomer:** Must be an alkene (C=C)
**Process:** Double bonds open and link together

$$n(CH_2=CH_2) \\rightarrow -(CH_2-CH_2)_n-$$

- No atoms lost (mass conserved)
- Polymer is saturated and unreactive

## Common Polymers

| Polymer | Monomer | Uses |
|---------|---------|------|
| Poly(ethene) | Ethene | Bags, bottles |
| Poly(propene) | Propene | Ropes, crates |
| PVC | Chloroethene | Pipes, cables |

## Environmental Problems

**Non-biodegradable:** Strong C-C bonds; bacteria can't break down
**Marine pollution:** Microplastics in food chain

## Disposal Solutions

| Method | Benefit | Problem |
|--------|---------|---------|
| **Recycling** | Saves oil, reduces landfill | Sorting is expensive |
| **Incineration** | Generates energy | CO₂, toxic gases (HCl from PVC) |
| **Biodegradable** | Bacteria break down | Still developing |`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Carbon: tetravalent (4 bonds), catenation (chains), multiple bonds",
            "Fractional distillation separates crude oil by b.p.",
            "Cracking: long chain → short alkane + alkene",
            "Alkanes CₙH₂ₙ₊₂ (saturated, unreactive); Alkenes CₙH₂ₙ (unsaturated, reactive)",
            "Test for unsaturation: bromine water decolorized by alkenes",
            "Complete combustion → CO₂ + H₂O; Incomplete → CO + C",
            "Alkane substitution needs UV light; Alkene addition opens C=C",
            "Ethanol: fermentation (renewable) or hydration (fast, pure)",
            "Addition polymers: alkene monomers, C=C opens and links",
            "Plastics non-biodegradable; solutions: recycle, incinerate, biodegradable"
        ],
        exam_tips: [
            "Draw structural formulae for first 4 alkanes and first 2 alkenes",
            "Describe bromine water test (orange → colorless = alkene)",
            "Write complete vs incomplete combustion equations",
            "Compare fermentation vs hydration for ethanol production",
            "Draw repeat unit of polymer from monomer",
            "Explain why plastics are non-biodegradable (strong C-C bonds)"
        ]
    },

    "Experimental Techniques": {
        topic: "Experimental Techniques",
        subject: "Chemistry",
        summary: "Experimental chemistry covers laboratory apparatus, measuring techniques, purity testing using melting/boiling points, separation methods (filtration, crystallisation, distillation, chromatography), and qualitative analysis including tests for cations, anions, and gases.",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Chemical_Separation_Purity_and_Identification_Techniques.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL0NoZW1pY2FsX1NlcGFyYXRpb25fUHVyaXR5X2FuZF9JZGVudGlmaWNhdGlvbl9UZWNobmlxdWVzLm00YSIsImlhdCI6MTc2NTQ3MDE0NiwiZXhwIjo1MjY1OTY2MTQ2fQ.geDywo9wENvXFpqYZ1yCGYjNsjMCvouczL2eLQ6QlR4",
        sections: [
            {
                title: "1. Laboratory Apparatus and Measurement",
                content: `## Measuring Time, Temperature, Mass

| Measurement | Apparatus | Units |
|-------------|-----------|-------|
| Time | Stopwatch | Seconds (s) |
| Temperature | Thermometer | °C |
| Mass | Top-pan balance | Grams (g) |

**Technique:** "Tare" balance with empty container before adding chemicals

## Measuring Volume of Liquids

| Apparatus | Accuracy | Use |
|-----------|----------|-----|
| Beaker | Low | Holding, mixing, heating |
| Measuring Cylinder | Medium | Variable volumes |
| Pipette | High | Fixed volume (e.g., 25.0 cm³) |
| Burette | High | Variable, drop-by-drop (titrations) |

**Reading liquids:** Read from bottom of meniscus at eye level`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Purity and Melting/Boiling Points",
                content: `## Testing for Purity

Pure substances have **sharp, fixed** melting and boiling points

### Melting Point
| Sample | Behavior |
|--------|----------|
| **Pure** | Melts at exact temperature (e.g., 0°C) |
| **Impure** | Melts LOWER and over a RANGE |

### Boiling Point
| Sample | Behavior |
|--------|----------|
| **Pure** | Boils at exact temperature (e.g., 100°C) |
| **Impure** | Boils HIGHER and over a RANGE |

**Why?** Impurities disrupt molecular structure`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Methods of Separation",
                content: `## A. Filtration
**Separates:** Insoluble solid from liquid
- **Filtrate:** Liquid that passes through
- **Residue:** Solid trapped on paper

## B. Crystallisation
**Separates:** Soluble solid from solution
1. Heat to evaporate solvent
2. Test with glass rod (crystals form when saturated)
3. Cool slowly for large crystals
4. Filter and dry

## C. Simple Distillation
**Separates:** Pure solvent from dissolved solid
- Solvent boils, condenser cools vapor back to liquid
- Solid stays in flask

## D. Fractional Distillation
**Separates:** Miscible liquids with different b.p.
- Uses fractionating column (glass beads)
- Lowest b.p. collected first at top

## E. Chromatography
**Separates:** Substances by solubility differences

$$R_f = \\frac{\\text{Distance moved by spot}}{\\text{Distance moved by solvent}}$$

- Rf always between 0 and 1
- **Locating agents** for colorless substances`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Testing for Cations (Positive Ions)",
                content: `## Using NaOH and Ammonia

| Cation | NaOH (excess) | Ammonia (excess) |
|--------|---------------|------------------|
| **Al³⁺** | White ppt, dissolves | White ppt, insoluble |
| **Zn²⁺** | White ppt, dissolves | White ppt, dissolves |
| **Ca²⁺** | White ppt, insoluble | No ppt |
| **Cu²⁺** | Blue ppt, insoluble | Blue ppt → **dark blue solution** |
| **Fe²⁺** | Green ppt, insoluble | Green ppt |
| **Fe³⁺** | Red-brown ppt | Red-brown ppt |
| **NH₄⁺** | Warm → ammonia gas | - |

**Key Distinctions:**
- Al vs Zn: Zn dissolves in excess ammonia
- Fe²⁺ vs Fe³⁺: Green vs red-brown
- Cu²⁺: Dark blue in excess ammonia`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Testing for Anions (Negative Ions)",
                content: `## Anion Tests

| Anion | Test | Positive Result |
|-------|------|-----------------|
| **CO₃²⁻** | Add dilute acid | Fizzes; gas turns limewater milky |
| **Cl⁻** | Acidify + AgNO₃ | **White** precipitate |
| **Br⁻** | Acidify + AgNO₃ | **Cream** precipitate |
| **I⁻** | Acidify + AgNO₃ | **Yellow** precipitate |
| **SO₄²⁻** | Acidify + BaNO₃ | **White** precipitate |
| **NO₃⁻** | NaOH + Al foil, warm | Ammonia gas (turns red litmus blue) |

**Why acidify first?**
Removes carbonates which also form white precipitates (false positive)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Testing for Gases and Flame Tests",
                content: `## Gas Tests

| Gas | Test | Result |
|-----|------|--------|
| **NH₃** | Damp red litmus | Turns **blue** (only alkaline gas) |
| **CO₂** | Limewater | Turns **milky/cloudy** |
| **Cl₂** | Damp litmus | **Bleaches white** |
| **H₂** | Lighted splint | **Squeaky pop** |
| **O₂** | Glowing splint | **Relights** |

## Flame Tests (Metal Ions)

| Ion | Flame Color |
|-----|-------------|
| **Li⁺** | Red (crimson) |
| **Na⁺** | Yellow (intense) |
| **K⁺** | Lilac (pink-purple) |
| **Cu²⁺** | Blue-green |

**Method:** Clean wire in acid → dip in salt → hold in blue flame`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Pipette = fixed volume; Burette = variable, accurate",
            "Pure substances: sharp m.p./b.p.; Impure: range, lower m.p., higher b.p.",
            "Filtration: insoluble solid; Crystallisation: soluble solid",
            "Fractional distillation: lowest b.p. collected first",
            "Rf = distance spot / distance solvent (0 to 1)",
            "Al vs Zn: both dissolve in NaOH, only Zn dissolves in excess NH₃",
            "Halide precipitates: Cl⁻ white, Br⁻ cream, I⁻ yellow",
            "Acidify before halide/sulfate tests to remove carbonates",
            "H₂ = squeaky pop; O₂ = relights splint; CO₂ = limewater milky"
        ],
        exam_tips: [
            "Distinguish pipette vs burette vs measuring cylinder",
            "Explain why fractional distillation needs fractionating column",
            "Calculate Rf values from diagrams",
            "Distinguish Al³⁺ from Zn²⁺ using ammonia",
            "Know silver halide precipitate colors",
            "Explain why acid added before testing for sulfates"
        ]
    },

    "Particulate Nature of Matter": {
        topic: "Particulate Nature of Matter",
        subject: "Chemistry",
        summary: "All matter is made of tiny particles. This topic covers the three states of matter, particle arrangement, changes of state, and the kinetic theory.",
        sections: [
            {
                title: "1. States of Matter",
                content: `## Three States of Matter

### Solid:
- Particles vibrate in fixed positions
- Strong forces between particles
- Fixed shape and volume
- Cannot be compressed
- High density

### Liquid:
- Particles move around each other
- Weaker forces than solids
- Fixed volume, no fixed shape
- Cannot be compressed easily
- Medium density

### Gas:
- Particles move freely and randomly
- Very weak forces between particles
- No fixed shape or volume
- Can be compressed easily
- Low density

## Changes of State:

- **Melting**: Solid → Liquid (add heat)
- **Freezing**: Liquid → Solid (remove heat)
- **Boiling/Evaporation**: Liquid → Gas (add heat)
- **Condensation**: Gas → Liquid (remove heat)
- **Sublimation**: Solid → Gas directly
- **Deposition**: Gas → Solid directly`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Kinetic Theory",
                content: `## The Kinetic Theory

All particles have kinetic energy and are in constant motion.

### Key Points:

1. **All matter is made of particles** (atoms, molecules, or ions)
2. **Particles are constantly moving** (vibrating, rotating, translating)
3. **Higher temperature = more kinetic energy** = faster movement
4. **Collisions cause pressure** in gases
5. **Forces between particles** determine state of matter

### Diffusion:

**Diffusion** is the spreading out of particles from high concentration to low concentration.

**Evidence:**
- Bromine vapor spreads in a jar
- Ammonia and HCl form white smoke when they meet
- Smell spreads across a room

**Factors affecting diffusion:**
- Temperature (higher = faster)
- Concentration gradient
- Particle size (smaller = faster)

### Brownian Motion:

Random movement of particles in a fluid caused by collisions with invisible molecules.

**Evidence:** Smoke particles in air move randomly when observed under a microscope.`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Solids have fixed shape and volume; particles vibrate in place",
            "Liquids have fixed volume but no fixed shape; particles slide past each other",
            "Gases have no fixed shape or volume; particles move freely",
            "Temperature increases = particles move faster = more kinetic energy",
            "Diffusion is movement of particles from high to low concentration",
            "Brownian motion proves particles exist and are moving"
        ],
        exam_tips: [
            "Draw particle diagrams for each state of matter",
            "Explain changes of state in terms of energy and particle movement",
            "Use kinetic theory to explain diffusion and gas pressure"
        ]
    },

    "Formulae and Stoichiometry": {
        topic: "Formulae and Stoichiometry",
        subject: "Chemistry",
        summary: "Chemical formulae represent compounds. Stoichiometry is the calculation of quantities in chemical reactions.",
        sections: [
            {
                title: "1. Chemical Formulae",
                content: `## Writing Chemical Formulae

### Common Ions:
**Positive ions (cations):**
- Na⁺, K⁺, Ag⁺ (Group 1)
- Ca²⁺, Mg²⁺, Zn²⁺ (Group 2)
- Al³⁺, Fe³⁺ (Group 3)

**Negative ions (anions):**
- Cl⁻, Br⁻, I⁻ (Halogens)
- O²⁻, S²⁻
- NO₃⁻, OH⁻, HCO₃⁻
- SO₄²⁻, CO₃²⁻

### Balancing Charges:
The total positive charge must equal total negative charge.

**Example:** Calcium chloride
- Ca²⁺ and Cl⁻
- Need 2 Cl⁻ to balance Ca²⁺
- Formula: CaCl₂

### Relative Atomic Mass (Ar):
The average mass of an atom relative to carbon-12.
- H = 1, C = 12, O = 16, Na = 23, Mg = 24, Cl = 35.5

### Relative Molecular Mass (Mr):
Add up all the Ar values in the formula.
- H₂O: (2 × 1) + 16 = 18
- CO₂: 12 + (2 × 16) = 44`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Mole Calculations",
                content: `## The Mole

One mole = 6.02 × 10²³ particles (Avogadro's number)

### Key Formulas:

**Number of moles = mass ÷ molar mass**
- n = m / Mr

**Mass = moles × molar mass**
- m = n × Mr

**Volume of gas at STP = moles × 24 dm³**
- V = n × 24 (at room temperature and pressure)

### Percentage Composition:

(Mass of element ÷ Mr of compound) × 100%

**Example:** Find % of oxygen in H₂O
- Mr of H₂O = 18
- Mass of O = 16
- % O = (16 ÷ 18) × 100 = 88.9%

### Balancing Equations:

Same number of each atom on both sides.

**Example:** Mg + O₂ → MgO
Balanced: 2Mg + O₂ → 2MgO`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Chemical formula shows atoms in a compound",
            "Molar mass (Mr) is the sum of all atomic masses in formula",
            "One mole contains 6.02 × 10²³ particles",
            "n = m/Mr (moles = mass/molar mass)",
            "Always balance chemical equations",
            "One mole of gas at STP occupies 24 dm³"
        ],
        exam_tips: [
            "Show all working in calculations",
            "Learn common ion charges",
            "Check equations are balanced before doing calculations"
        ]
    },

    "Electrolysis": {
        topic: "Electrolysis",
        subject: "Chemistry",
        summary: "Electrolysis uses electrical energy to decompose ionic compounds. It has many industrial applications.",
        sections: [
            {
                title: "1. Principles of Electrolysis",
                content: `## What is Electrolysis?

**Electrolysis** is the decomposition of an ionic compound by passing an electric current through it when molten or in solution.

### Key Terms:
- **Electrolyte** - ionic compound that conducts when molten/in solution
- **Electrode** - conductor that carries current into electrolyte
- **Anode** - positive electrode (oxidation occurs)
- **Cathode** - negative electrode (reduction occurs)
- **Cation** - positive ion (moves to cathode)
- **Anion** - negative ion (moves to anode)

### What Happens:
1. Electrolyte contains free ions
2. DC current applied
3. Cations move to cathode, gain electrons (REDUCTION)
4. Anions move to anode, lose electrons (OXIDATION)

### Remember: OIL RIG
- **O**xidation **I**s **L**oss of electrons
- **R**eduction **I**s **G**ain of electrons`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Industrial Applications",
                content: `## Industrial Electrolysis

### Electroplating:
Coating a metal object with a thin layer of another metal.
- Object to be plated = cathode
- Plating metal = anode
- Electrolyte = solution of plating metal ions

### Extraction of Aluminum:
- Ore: Bauxite (Al₂O₃)
- Dissolved in molten cryolite (lowers melting point)
- At cathode: Al³⁺ + 3e⁻ → Al
- At anode: 2O²⁻ → O₂ + 4e⁻
- Carbon anodes burn away and need replacing

### Purification of Copper:
- Impure copper = anode
- Pure copper = cathode
- Electrolyte = copper sulfate solution
- Copper dissolves from anode, deposits on cathode`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Electrolysis breaks down ionic compounds using electricity",
            "Cations go to cathode (negative), anions go to anode (positive)",
            "Oxidation at anode, reduction at cathode",
            "OIL RIG: Oxidation Is Loss, Reduction Is Gain",
            "Aluminum extracted from bauxite by electrolysis",
            "Copper purified by electrolysis"
        ],
        exam_tips: [
            "Always state which ion goes to which electrode",
            "Write half-equations for electrode reactions",
            "Explain why DC current is needed (not AC)"
        ]
    },

    "Energy from Chemicals": {
        topic: "Energy from Chemicals",
        subject: "Chemistry",
        summary: "Chemical reactions involve energy changes. Reactions can be exothermic (release heat) or endothermic (absorb heat).",
        sections: [
            {
                title: "1. Energy Changes in Reactions",
                content: `## Exothermic and Endothermic Reactions

### Exothermic Reactions:
- Release energy to surroundings
- Temperature increases
- Energy is a PRODUCT
- ΔH is negative

**Examples:**
- Combustion (burning)
- Neutralization
- Respiration
- Hand warmers

### Endothermic Reactions:
- Absorb energy from surroundings
- Temperature decreases
- Energy is a REACTANT
- ΔH is positive

**Examples:**
- Photosynthesis
- Thermal decomposition
- Dissolving ammonium nitrate
- Cold packs

### Bond Energy:
- Breaking bonds = ENDOTHERMIC (needs energy)
- Making bonds = EXOTHERMIC (releases energy)

**Overall energy change:**
Energy in = bonds broken (endothermic)
Energy out = bonds formed (exothermic)
ΔH = Energy in - Energy out`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Exothermic reactions release heat (temperature rises)",
            "Endothermic reactions absorb heat (temperature falls)",
            "Breaking bonds requires energy (endothermic)",
            "Making bonds releases energy (exothermic)",
            "Combustion and neutralization are exothermic",
            "Photosynthesis and thermal decomposition are endothermic"
        ],
        exam_tips: [
            "Draw energy level diagrams for both types",
            "Give practical examples of each type",
            "Calculate energy changes using bond energies"
        ]
    },

    "Acids, Bases and Salts": {
        topic: "Acids, Bases and Salts",
        subject: "Chemistry",
        summary: "Acids and bases are important chemicals. Their reactions produce salts which have many uses.",
        sections: [
            {
                title: "1. Properties of Acids and Bases",
                content: `## Acids

### Properties:
- Sour taste
- pH less than 7
- Turn litmus red
- Contain H⁺ ions

### Common Acids:
- HCl - Hydrochloric acid
- H₂SO₄ - Sulfuric acid
- HNO₃ - Nitric acid
- CH₃COOH - Ethanoic acid (weak)

### Reactions of Acids:

**1. With Metals:**
Acid + Metal → Salt + Hydrogen
Mg + 2HCl → MgCl₂ + H₂

**2. With Bases:**
Acid + Base → Salt + Water
HCl + NaOH → NaCl + H₂O

**3. With Carbonates:**
Acid + Carbonate → Salt + Water + CO₂
2HCl + CaCO₃ → CaCl₂ + H₂O + CO₂

## Bases and Alkalis

### Bases:
- Metal oxides and hydroxides
- React with acids to form salts

### Alkalis:
- Soluble bases
- pH greater than 7
- Turn litmus blue
- Contain OH⁻ ions
- Examples: NaOH, KOH, Ca(OH)₂`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Acids contain H⁺ ions, pH < 7",
            "Alkalis contain OH⁻ ions, pH > 7",
            "Neutral pH = 7",
            "Neutralization: Acid + Base → Salt + Water",
            "Name of salt from acid: HCl → chloride, H₂SO₄ → sulfate, HNO₃ → nitrate"
        ],
        exam_tips: [
            "Know the reactions of acids with metals, bases, and carbonates",
            "Use word equations and symbol equations",
            "Describe how to prepare a pure, dry sample of a salt"
        ]
    },

    "Periodic Table": {
        topic: "Periodic Table",
        subject: "Chemistry",
        summary: "The periodic table organizes elements by atomic number and properties. Elements in the same group have similar chemical properties.",
        sections: [
            {
                title: "1. Structure of the Periodic Table",
                content: `## Organization

- Elements arranged by ATOMIC NUMBER (protons)
- Horizontal rows = PERIODS (1-7)
- Vertical columns = GROUPS (1-8 or 0)
- Elements in same group have similar properties

### Groups:

**Group 1 - Alkali Metals:**
- Lithium, Sodium, Potassium
- Soft, low density, reactive
- Form +1 ions
- Reactivity INCREASES down group

**Group 7 - Halogens:**
- Fluorine, Chlorine, Bromine, Iodine
- Diatomic molecules (F₂, Cl₂, etc.)
- Form -1 ions
- Reactivity DECREASES down group

**Group 0 - Noble Gases:**
- Helium, Neon, Argon
- Unreactive (full outer shell)
- Monatomic

### Trends Across Periods:
- Metallic character decreases left to right
- Atomic radius decreases left to right
- Reactivity varies`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Elements arranged by atomic number",
            "Groups = columns (similar properties)",
            "Periods = rows",
            "Group 1 reactivity increases down",
            "Group 7 reactivity decreases down",
            "Group 0 are unreactive (full outer shell)"
        ],
        exam_tips: [
            "Know properties of Groups 1, 7, and 0",
            "Explain trends using electron configuration",
            "Compare reactivity within groups"
        ]
    },

    "Metals": {
        topic: "Metals",
        subject: "Chemistry",
        summary: "Metals have characteristic physical and chemical properties. They can be extracted from ores and are widely used in everyday life.",
        sections: [
            {
                title: "1. Properties of Metals",
                content: `## Physical Properties:
- Good conductors of heat and electricity
- Shiny (lustrous) when polished
- Malleable (can be hammered into shapes)
- Ductile (can be drawn into wires)
- High melting and boiling points
- High density

## Chemical Properties:
- Form positive ions (lose electrons)
- React with oxygen to form metal oxides
- React with water/acids (varies by reactivity)

## Reactivity Series:
**Most reactive:**
Potassium (K)
Sodium (Na)
Calcium (Ca)
Magnesium (Mg)
Aluminum (Al)
(Carbon)
Zinc (Zn)
Iron (Fe)
(Hydrogen)
Copper (Cu)
Silver (Ag)
Gold (Au)
**Least reactive**

### Extraction:
- Above carbon: Electrolysis
- Below carbon: Reduction with carbon`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Metals are good conductors, malleable, ductile",
            "Metals form positive ions by losing electrons",
            "Reactivity series: K, Na, Ca, Mg, Al, Zn, Fe, Cu, Ag, Au",
            "Metals above carbon extracted by electrolysis",
            "Metals below carbon extracted by reduction with carbon"
        ],
        exam_tips: [
            "Memorize the reactivity series",
            "Predict displacement reactions using reactivity",
            "Link extraction method to position in reactivity series"
        ]
    },

    "Chemistry of Environment": {
        topic: "Chemistry of Environment",
        subject: "Chemistry",
        summary: "Environmental chemistry covers the atmosphere, water, and pollution. Understanding these helps us protect our environment.",
        sections: [
            {
                title: "1. The Atmosphere",
                content: `## Composition of Air:
- Nitrogen: 78%
- Oxygen: 21%
- Argon: 0.9%
- Carbon dioxide: 0.04%
- Water vapor: variable

## Pollution:

### Air Pollution:
**Carbon Monoxide (CO):**
- From incomplete combustion
- Toxic: binds to hemoglobin

**Sulfur Dioxide (SO₂):**
- From burning fossil fuels
- Causes acid rain

**Nitrogen Oxides (NOₓ):**
- From vehicle engines
- Cause acid rain and smog

**Carbon Dioxide (CO₂):**
- From combustion
- Greenhouse gas (global warming)

### Acid Rain:
- SO₂ + H₂O → H₂SO₃ (sulfurous acid)
- Effects: damages buildings, kills fish, harms forests

### Greenhouse Effect:
- CO₂ and methane trap heat
- Causes global warming
- Effects: rising sea levels, climate change`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Air is 78% nitrogen, 21% oxygen",
            "CO₂ is a greenhouse gas causing global warming",
            "SO₂ and NOₓ cause acid rain",
            "CO is toxic - binds to hemoglobin",
            "Burning fossil fuels releases pollutants"
        ],
        exam_tips: [
            "Know sources and effects of each pollutant",
            "Explain greenhouse effect and acid rain formation",
            "Suggest ways to reduce pollution"
        ]
    },

    "Organic Chemistry": {
        topic: "Organic Chemistry",
        subject: "Chemistry",
        summary: "Organic chemistry is the study of carbon compounds. This includes hydrocarbons (alkanes, alkenes) and their reactions.",
        sections: [
            {
                title: "1. Hydrocarbons",
                content: `## Alkanes (Saturated)

**General Formula:** CₙH₂ₙ₊₂

**Examples:**
- Methane: CH₄
- Ethane: C₂H₆
- Propane: C₃H₈
- Butane: C₄H₁₀

**Properties:**
- Single bonds only (C-C)
- Saturated
- Burn in air (combustion)
- Undergo substitution reactions

## Alkenes (Unsaturated)

**General Formula:** CₙH₂ₙ

**Examples:**
- Ethene: C₂H₄
- Propene: C₃H₆

**Properties:**
- Contains C=C double bond
- Unsaturated
- More reactive than alkanes
- Undergo addition reactions
- Decolorize bromine water (test)

## Combustion:
Complete: CH₄ + 2O₂ → CO₂ + 2H₂O
Incomplete: CH₄ + O₂ → CO + 2H₂O (not enough oxygen)`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Alkanes are saturated (single bonds only), CₙH₂ₙ₊₂",
            "Alkenes are unsaturated (have C=C), CₙH₂ₙ",
            "Alkenes decolorize bromine water",
            "Complete combustion produces CO₂ and H₂O",
            "Incomplete combustion produces CO (toxic)"
        ],
        exam_tips: [
            "Know the first four alkanes and alkenes",
            "Draw structural formulas correctly",
            "Describe the bromine water test for unsaturation"
        ]
    }
};
