// Chemistry Notes - All 11 Topics for ZIMSEC Combined Science
import type { TopicNotes } from './types';

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
        summary: "The Kinetic Particle Theory explains the physical properties of matter and how it behaves during changes of state. The core principle is that everything is made of particles, and the physical form that matter takes—solid, liquid, or gas—depends entirely on how these particles are arranged and how they move. This topic is foundational for understanding chemical reactions and industrial processes.",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/remaing/States_of_Matter.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9yZW1haW5nL1N0YXRlc19vZl9NYXR0ZXIubXA0IiwiaWF0IjoxNzY4NjgyOTI1LCJleHAiOjUyNjkxNzg5MjV9.qs8CJOAKmOrgfsMIK_8xq2jdqJ3hCVdo-BCe0mDqjj0",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Kinetic_Theory_States_of_Matter_Explained.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL0tpbmV0aWNfVGhlb3J5X1N0YXRlc19vZl9NYXR0ZXJfRXhwbGFpbmVkLm00YSIsImlhdCI6MTc2NTQ3MDI0MiwiZXhwIjo1MjY1OTY2MjQyfQ._HXh5bEmEzGe8jd34j8GoO4I9HOK40iIswemyI5O5sM",
        sections: [
            {
                title: "1. Introduction and The Kinetic Particle Theory",
                content: `## Why Study States of Matter?

| Reason | Explanation |
|--------|-------------|
| **Foundation of Chemical Reactions** | Understanding particle behaviour explains how and why reactions occur |
| **Explaining Physical Properties** | Why are some substances hard while others flow? Answers lie in particle arrangement |
| **Industrial Processes** | Making plastics, extracting metals — all involve controlling states of matter |

---

## The Kinetic Particle Theory

The **Kinetic Particle Theory** is a model explaining the properties and behaviour of solids, liquids, and gases.

### Three Key Assumptions:

1. **All substances are made of tiny, moving particles**
2. **Particles have kinetic energy** — their speed and energy increase with temperature
3. **The differences between states are due to particle arrangement and movement**

> **Key Term:** "Kinetic" means "about motion" — the theory is built on the idea that particles are always moving.

---

## Evidence for Particle Theory

### Brownian Motion

**Definition:** The random, erratic, jerky movement of microscopic particles suspended in a fluid.

**Observation:** Smoke particles in air appear to dance randomly in a zigzag path.

**Explanation:** Smoke particles are bombarded by millions of tiny, invisible, fast-moving air molecules. Uneven collisions cause the visible particle to jerk in random directions.

### Diffusion

**Definition:** The spontaneous net movement of particles from a region of **higher concentration** to a region of **lower concentration**.

**Factors Affecting Diffusion Rate:**

| Factor | Effect |
|--------|--------|
| **State of Matter** | Fastest in gases, slower in liquids, negligible in solids |
| **Molecular Mass** | Lighter particles diffuse faster than heavier ones |
| **Temperature** | Higher temperature = faster diffusion |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. The Three States of Matter",
                content: `## Solids

| Property | Particle-Level Explanation |
|----------|---------------------------|
| **Shape & Volume** | Definite shape, definite volume — particles held in fixed positions by very strong forces |
| **Arrangement** | Regular, fixed pattern (lattice) — strong forces lock particles in ordered structure |
| **Movement** | Vibrate in fixed positions — particles have kinetic energy but cannot move from place to place |
| **Forces** | Very strong — hold particles tightly in fixed positions |
| **Compressibility** | Cannot be compressed — particles already packed as closely as possible |

**Examples:** Ice, chalk, sulfur

---

## Liquids

| Property | Particle-Level Explanation |
|----------|---------------------------|
| **Shape & Volume** | No definite shape, BUT definite volume — particles can slide past each other but forces keep them close |
| **Arrangement** | Random, but close together — not in fixed pattern, free to move throughout liquid |
| **Movement** | Move randomly and slide past one another — kinetic energy allows movement within the volume |
| **Forces** | Strong — keep particles in close contact but allow them to move past each other |
| **Compressibility** | Cannot be compressed — particles in close contact, negligible space between them |

**Examples:** Water, molten iron

---

## Gases

| Property | Particle-Level Explanation |
|----------|---------------------------|
| **Shape & Volume** | No definite shape, no definite volume — forces are very weak, particles have high kinetic energy |
| **Arrangement** | Very far apart and random — no order due to high energy and negligible forces |
| **Movement** | Move rapidly and randomly — collide with each other and container walls |
| **Forces** | Very weak (negligible) — particles move independently and far from one another |
| **Compressibility** | Easily compressed — large empty spaces between particles can be reduced |

**Examples:** Steam (water vapour), air, oxygen

---

## Summary Comparison

| Property | Solid | Liquid | Gas |
|----------|-------|--------|-----|
| **Shape** | Fixed | Takes container shape | Fills container |
| **Volume** | Fixed | Fixed | Variable |
| **Particle Arrangement** | Regular lattice | Random, close | Random, far apart |
| **Particle Movement** | Vibrate in place | Slide past each other | Move rapidly, randomly |
| **Forces** | Very strong | Strong | Very weak |
| **Compressibility** | No | No | Yes |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Changes of State",
                content: `## Overview of State Changes

When a substance is heated or cooled, its particles gain or lose energy, which can cause it to change state.

---

## Melting (Solid → Liquid)

| Aspect | Details |
|--------|---------|
| **Definition** | Solid turns into a liquid |
| **Particle Behaviour** | Particles gain energy, vibrate more vigorously. At **melting point**, particles break free from fixed positions in lattice |
| **Energy Change** | Energy is **taken in (ENDOTHERMIC)** |

---

## Freezing/Solidification (Liquid → Solid)

| Aspect | Details |
|--------|---------|
| **Definition** | Liquid turns into a solid |
| **Particle Behaviour** | Particles lose kinetic energy, move more slowly. Forces pull them into fixed positions, forming regular lattice |
| **Energy Change** | Energy is **given out (EXOTHERMIC)** |

---

## Boiling (Liquid → Gas)

| Aspect | Details |
|--------|---------|
| **Definition** | Liquid turns into a gas at a specific temperature |
| **Particle Behaviour** | Particles gain enough energy to overcome all forces of attraction. Bubbles form throughout liquid |
| **Energy Change** | Energy is **taken in (ENDOTHERMIC)** |

---

## Evaporation (Liquid → Gas)

| Aspect | Details |
|--------|---------|
| **Definition** | Liquid turns into gas at temperature **below** boiling point |
| **Particle Behaviour** | Occurs only at **surface**. Some particles gain enough energy through random collisions to escape into air |
| **Energy Change** | Energy is **taken in (ENDOTHERMIC)** |

---

## Condensation (Gas → Liquid)

| Aspect | Details |
|--------|---------|
| **Definition** | Gas turns into a liquid |
| **Particle Behaviour** | Particles lose kinetic energy, move more slowly. Forces of attraction cause them to stay close together |
| **Energy Change** | Energy is **given out (EXOTHERMIC)** |

---

## Boiling vs Evaporation (EXAM FOCUS)

| Feature | Boiling | Evaporation |
|---------|---------|-------------|
| **Temperature** | Only at boiling point | Any temperature below boiling point |
| **Location** | Throughout liquid (bubbles) | Surface only |
| **Speed** | Fast, vigorous | Slow, gradual |
| **Energy Source** | External heat applied | Surroundings or liquid itself |

---

## Heating and Cooling Curves

**Sloped Lines:** Temperature rising — heat converted to kinetic energy, particles move faster

**Flat Lines (Plateaus):** Change of state occurring
- Temperature stays constant even though heat is applied
- Energy used to break intermolecular bonds, NOT increase speed
- This "hidden" energy is called **Latent Heat**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Effect of Temperature and Pressure",
                content: `## The Effect of Heating

When a substance is heated:
1. Particles **absorb heat energy** → convert to kinetic energy
2. Particles **move faster**
3. In solids: vibrate more; in liquids/gases: move more quickly
4. Substance **expands**
5. If enough heat: melting or boiling occurs

**Example:** Scent of flowers travels faster in a warm room — gas particles have more kinetic energy and diffuse more quickly.

---

## The Effect of Cooling

When a substance is cooled:
1. Particles **lose kinetic energy** → slow down
2. Forces of attraction **pull particles closer together**
3. Substance **contracts**
4. If cooled enough: gas condenses, liquid freezes

---

## Gas Pressure

**Definition:** Force exerted by gas particles colliding with container walls.

**Cause:** Constant motion of particles → frequent collisions with walls → billions of collisions per second create steady pressure.

### Factors Affecting Gas Pressure:

| Factor | Effect |
|--------|--------|
| **Temperature ↑** | Particles move faster → hit walls harder and more often → **pressure increases** |
| **Volume ↓** | Same particles in smaller space → collide with walls more frequently → **pressure increases** |
| **Number of particles ↑** | More collisions with walls → **pressure increases** |

---

## Practical Examples

| Scenario | Explanation |
|----------|-------------|
| **Pumping bicycle tyre** | Forcing more air particles into fixed volume → more frequent collisions → higher pressure |
| **Balloon bursting** | Adding more particles → pressure increases → eventually too great for balloon material |
| **Sealed container cooled** | Particles lose energy, move slower → fewer, weaker collisions → pressure decreases |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Real-Life Applications",
                content: `## Applications of States of Matter

| Application | Scientific Explanation |
|-------------|----------------------|
| **Pressure Cookers** | Water vapour heated above 100°C in sealed container. High kinetic energy → frequent, forceful collisions → very high pressure. Higher pressure raises boiling point → food cooks faster |
| **Smell of Flowers/Burnt Food** | Scent travels via **diffusion**. Gas particles move randomly from high to low concentration, colliding with air particles. Faster at higher temperatures due to increased kinetic energy |
| **Pumping Bicycle Tyre** | Gas compression. Air forced into fixed volume → more particles → more frequent collisions → higher pressure |
| **Molten Iron** | At temperatures over 1540°C, particles in solid iron gain enough kinetic energy to overcome strong forces → iron melts → can be poured and shaped |

---

## Diffusion Rate Comparison

**Classic Experiment:** Cotton wool soaked in ammonia and HCl placed at opposite ends of sealed tube.

| Gas | Relative Molecular Mass | Speed |
|-----|------------------------|-------|
| Ammonia (NH₃) | 17 | Faster (lighter) |
| Hydrogen Chloride (HCl) | 36.5 | Slower (heavier) |

**Result:** White ring of ammonium chloride forms **closer to the HCl end** because ammonia traveled further in the same time.

**Rule:** Lower Mr = Faster diffusion`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Exam Focus: Common Questions and Keywords",
                content: `## Essential Keywords for Top Marks

### For Solids:
- Vibrate in fixed positions
- Strong forces of attraction
- Regular lattice
- Packed closely together

### For Liquids:
- Slide past one another
- Overcome forces of attraction
- Random arrangement
- Close together

### For Gases:
- Move rapidly and randomly
- Far apart
- Negligible/weak forces
- Collide with container walls

### For Changes of State:
- Gain/lose kinetic energy
- Overcome the forces
- Break free from positions

---

## Sample Exam Questions with Guidance

### Q1: Why does the smell of burnt food travel through the house?

**Answer Structure:**
1. Smell is caused by **gas particles**
2. Gas particles **move randomly and quickly** in all directions
3. **Diffusion** — particles spread from high to low concentration
4. Particles **collide with air particles**, bouncing in all directions, helping them spread

---

### Q2: Why does a balloon burst if you keep blowing?

**Answer Structure:**
1. Blowing **increases number of gas particles** inside
2. More particles = **more frequent collisions** with balloon walls
3. Increased collision frequency = **increased pressure**
4. Balloon bursts when **pressure exceeds material strength**

---

### Q3: Why can you pour liquids?

**Answer Structure:**
1. Particles are **close together but not in fixed positions**
2. Forces are **strong enough to keep particles together**
3. But **weak enough to allow particles to slide past each other**
4. This sliding ability allows **flowing and pouring**

---

### Q4: Why do solids expand on heating?

**Answer Structure:**
1. Particles in solid are held in **fixed lattice**, can only **vibrate**
2. When heated, particles **gain energy**
3. Converted to **kinetic energy** → **vibrate more vigorously**
4. Increased vibration makes particles take up **slightly more space** → solid **expands**`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "All matter is made of particles in constant motion (Kinetic Particle Theory)",
            "Temperature measures the average kinetic energy of particles",
            "Brownian motion provides visual evidence for particle theory",
            "Diffusion: movement from high to low concentration; faster with lower molecular mass",
            "Solids: fixed shape, particles vibrate in regular lattice, very strong forces",
            "Liquids: fixed volume, particles slide past each other, strong forces",
            "Gases: no fixed shape/volume, particles move rapidly and randomly, very weak forces",
            "Melting and boiling are ENDOTHERMIC (energy taken in); freezing and condensation are EXOTHERMIC (energy given out)",
            "Latent heat: energy used to change state without changing temperature",
            "Evaporation occurs at surface at any temperature; boiling occurs throughout at boiling point",
            "Gas pressure caused by particle collisions with container walls",
            "Increasing temperature or decreasing volume increases gas pressure",
            "Lighter molecules (lower Mr) diffuse faster than heavier ones"
        ],
        exam_tips: [
            "ALWAYS explain using particles — examiners want particle-level explanations, not just observations",
            "Use specific keywords: 'vibrate in fixed positions' for solids, 'slide past one another' for liquids",
            "Draw particle diagrams showing correct arrangement and spacing for each state",
            "Explain Brownian motion as collisions with invisible particles causing random movement",
            "For heating/cooling curves, explain flat sections using latent heat — energy breaks bonds, not increases temperature",
            "Compare boiling vs evaporation using at least 3 differences (temperature, location, speed)",
            "Calculate Mr to predict which gas diffuses faster — lower Mr = faster diffusion",
            "Explain gas pressure in terms of frequency and force of particle collisions with walls",
            "Link real-life examples (pressure cooker, bike pump) to particle behaviour and pressure"
        ]
    },

    "Atoms, Elements and Compounds": {
        topic: "Atoms, Elements and Compounds",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/Building_Blocks_of_Reality.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9CdWlsZGluZ19CbG9ja3Nfb2ZfUmVhbGl0eS5tcDQiLCJpYXQiOjE3NjU4Njk4NzYsImV4cCI6NTI2NjM2NTg3Nn0.lvGS0nLBqFV_MXHnh_Tj26xDY-axr4SkYLZa7juyhRk",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/remaining/The_Massive_Illusion_of_Solid_Matter.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL3JlbWFpbmluZy9UaGVfTWFzc2l2ZV9JbGx1c2lvbl9vZl9Tb2xpZF9NYXR0ZXIubTRhIiwiaWF0IjoxNzY4NjgyMDI4LCJleHAiOjUyNjkxNzgwMjh9.Dkta8Q1xiPKNcbmpwY5HrwjdK60owrMWIRd0euVr0fQ",
        subject: "Chemistry",
        summary: "All physical substances in the universe are composed of atoms, elements, and compounds. Understanding atomic structure explains why elements behave the way they do and how they interact to form compounds. This topic covers subatomic particles, proton and nucleon numbers, electron arrangement, the difference between elements, compounds, and mixtures, and the formation of molecules and ions through bonding.",
        sections: [
            {
                title: "1. Introduction: The Building Blocks of Matter",
                content: `## Defining the Basics

| Concept | Core Definition | Simple Example |
|---------|-----------------|----------------|
| **Atom** | The smallest particle of an element | A single carbon atom |
| **Element** | A pure substance consisting of only one type of atom | The element carbon |
| **Compound** | A substance consisting of different elements chemically bonded together | Carbon dioxide (CO₂) |

---

## The Importance of This Topic

Understanding atoms, elements, and compounds is the **absolute foundation** of chemistry:
- **Medicines** that keep us healthy
- **Materials** used to build aircraft
- **Pollutants** that affect our environment

All are composed of these basic components. Mastering these concepts is the **first and most critical step** to understanding how the material world works.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. The Structure of an Atom",
                content: `## Subatomic Particles

Atoms are composed of three types of **subatomic particles**:

| Particle | Relative Mass | Electric Charge | Position in Atom |
|----------|---------------|-----------------|------------------|
| **Proton** | 1 unit | Positive (+1) | In the nucleus |
| **Neutron** | 1 unit | None (0) | In the nucleus |
| **Electron** | Almost nothing (~1/1840) | Negative (−1) | Moving around nucleus |

---

## Why Atoms Are Electrically Neutral

An atom has **no overall electrical charge** because it contains an **equal number** of positive protons and negative electrons.

**Example:** Sodium atom contains:
- 11 protons (+11 charge)
- 11 electrons (−11 charge)
- Overall charge = **zero**

---

## Proton Number and Nucleon Number

| Term | Definition | Importance |
|------|------------|------------|
| **Proton Number (Z)** | Number of protons in the nucleus | **Uniquely identifies** an element |
| **Nucleon Number (A)** | Total number of protons + neutrons | Also called Mass Number |

### Formula:
$$\\text{Number of Neutrons} = \\text{Nucleon Number} - \\text{Proton Number}$$
$$n = A - Z$$

---

## Electron Shells (Bohr Model)

Electrons orbit the nucleus in specific regions called **electron shells**.

### Shell Filling Rules:

| Shell | Maximum Electrons |
|-------|-------------------|
| **1st Shell** | 2 electrons |
| **2nd Shell** | 8 electrons |
| **3rd Shell** | 8 electrons (for first 20 elements) |

### Example Electron Distributions:

| Element | Protons | Electron Configuration |
|---------|---------|----------------------|
| Hydrogen (H) | 1 | 1 |
| Carbon (C) | 6 | 2,4 |
| Sodium (Na) | 11 | 2,8,1 |
| Chlorine (Cl) | 17 | 2,8,7 |
| Calcium (Ca) | 20 | 2,8,8,2 |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Elements: Pure Substances",
                content: `## Definition

An **element** is a pure substance made up of **only one type of atom**.

Each element is represented by a unique **chemical symbol** (e.g., C for Carbon, Na for Sodium).

---

## Atoms vs Elements

It is crucial to distinguish between these terms:

| Term | Meaning | Analogy |
|------|---------|---------|
| **Atom** | A single, individual particle | A single brick |
| **Element** | The bulk substance composed of many identical atoms | An entire wall built from one type of brick |

---

## Isotopes

**Isotopes** are atoms of the **same element** with the **same number of protons** but **different numbers of neutrons**.

### Properties of Isotopes:

| Property Type | Same or Different? | Explanation |
|---------------|-------------------|-------------|
| **Chemical properties** | SAME | Same electron arrangement |
| **Physical properties** | DIFFERENT | Different masses, densities, melting points |

### Example: Chlorine Isotopes

| Isotope | Protons | Neutrons | Abundance |
|---------|---------|----------|-----------|
| ³⁵Cl | 17 | 18 | 75% |
| ³⁷Cl | 17 | 20 | 25% |

**Relative Atomic Mass of Cl = 35.5** (weighted average)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Compounds: Chemically Combined Elements",
                content: `## How Compounds Are Formed

**Compounds** are new substances formed when atoms of different elements join together during a **chemical reaction** through **chemical bonds**.

---

## Signs of a Chemical Change

1. **New substance formed** — with different properties
2. **Energy change** — heat/light given out or taken in

---

## Classic Example: Iron + Sulfur

When iron powder and sulfur powder react:
- Mixture glows brightly (energy given out)
- New black substance forms: **iron(II) sulfide**
- New substance is NOT magnetic (unlike iron)

---

## Mixtures vs Compounds (EXAM FOCUS)

| Feature | Mixture | Compound |
|---------|---------|----------|
| **Formation** | Simple physical mixing | Chemical reaction |
| **Separation** | Physical methods (magnet, filtration) | Only by chemical reactions |
| **Properties** | Components keep original properties | New properties, different from elements |
| **Composition** | Variable proportions | Fixed ratio |
| **Bonding** | No chemical bonds | Chemical bonds present |

---

## Physical vs Chemical Change

| Physical Change | Chemical Change |
|-----------------|-----------------|
| No new substance formed | New substance formed |
| Usually reversible | Usually difficult to reverse |
| Small energy change | Often large energy change |
| Example: dissolving sugar | Example: burning wood |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Molecules and Ions",
                content: `## Molecules

A **molecule** is a distinct group of two or more atoms held together by **covalent bonds** (shared electrons).

**Examples:** H₂O (water), CH₄ (methane), H₂ (hydrogen gas), CO₂ (carbon dioxide)

---

## Covalent Bonding

**Covalent bond:** Chemical bond formed when atoms **share electrons**.

This allows atoms to achieve a **stable arrangement** of electrons in their outer shells (like noble gases).

---

## Ions

An **ion** is an atom (or group of atoms) that has **lost or gained** one or more electrons, resulting in an **electrical charge**.

### Types of Ions:

| Type | Formation | Charge | Example |
|------|-----------|--------|---------|
| **Cation** (positive ion) | Metal atom **loses** electrons | Positive (+) | Na⁺, Mg²⁺, Al³⁺ |
| **Anion** (negative ion) | Non-metal atom **gains** electrons | Negative (−) | Cl⁻, O²⁻, S²⁻ |

---

## Ionic Bonding

**Ionic bond:** The strong **electrostatic force of attraction** between oppositely charged ions.

**Examples:** NaCl (sodium chloride), MgO (magnesium oxide)

### Formation of NaCl:
1. Sodium atom **loses 1 electron** → Na⁺
2. Chlorine atom **gains 1 electron** → Cl⁻
3. Opposite charges attract → ionic bond forms

---

## Summary: Covalent vs Ionic

| Feature | Covalent Bonding | Ionic Bonding |
|---------|------------------|---------------|
| **Between** | Non-metal + Non-metal | Metal + Non-metal |
| **Process** | Electron **sharing** | Electron **transfer** |
| **Particles formed** | Molecules | Ions |
| **Examples** | H₂O, CO₂, CH₄ | NaCl, MgO, CaCl₂ |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Summary: Atoms, Elements, and Compounds",
                content: `## Key Distinctions

| Feature | Atom | Element | Compound |
|---------|------|---------|----------|
| **Definition** | Smallest particle of an element | Pure substance of one type of atom | Different atoms chemically bonded |
| **Composition** | Protons, neutrons, electrons | Many identical atoms | Different atoms in fixed ratio |
| **Representation** | Symbol (e.g., Na) | Symbol (e.g., Na) | Formula (e.g., NaCl) |
| **Can be broken down?** | Only into subatomic particles | Not by chemical means | Yes, into elements by chemical reactions |

---

## Illustrative Example

| Substance | Type | Description |
|-----------|------|-------------|
| Sodium (Na) | Element | Reactive, soft metal |
| Chlorine (Cl₂) | Element | Poisonous, green gas |
| Sodium Chloride (NaCl) | Compound | White, edible crystal (table salt) |

> **Key Point:** The compound NaCl has **completely different properties** from its constituent elements Na and Cl₂.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. The Evolving Model of the Atom",
                content: `## Historical Development

| Scientist | Model | Key Features |
|-----------|-------|--------------|
| **John Dalton** | Solid sphere | Atoms are tiny, solid, indivisible particles |
| **J.J. Thomson** | Plum pudding | Sphere of positive charge with electrons embedded like "raisins in a bun" |
| **Ernest Rutherford** | Nuclear model | Mostly empty space with tiny, dense, positive nucleus at center |
| **Niels Bohr** | Planetary model | Electrons orbit nucleus in fixed energy levels (shells) |
| **James Chadwick** | Modern model | Added neutrons (mass but no charge) to the nucleus |

---

## Dot-and-Cross Diagrams

Chemists use **dot-and-cross diagrams** to show electron arrangement in bonding:
- Electrons from one atom shown as **dots (•)**
- Electrons from other atom shown as **crosses (x)**

### Ionic Bonding Example (NaCl):
- Na transfers 1 electron (shown as x) to Cl
- Na becomes Na⁺ (2,8 configuration)
- Cl becomes Cl⁻ (2,8,8 configuration)

### Covalent Bonding Example (H₂O):
- Oxygen shares electrons with 2 hydrogen atoms
- All atoms achieve stable configurations`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Real-Life Applications",
                content: `## Applications in Industry

| Substance | Application |
|-----------|-------------|
| **Iron** | Making steel for buildings, bridges, cars |
| **Aluminium** | Aircraft (strong + low density) |
| **Ammonia (compound)** | Fertilisers (Haber process) |
| **Limestone (CaCO₃)** | Cement and lime production |

---

## Applications in Medicine

| Substance | Application |
|-----------|-------------|
| **Cobalt-60** | Cancer radiotherapy |
| **Chlorine compounds** | Manufacturing many medical drugs |
| **Oxygen** | Life support in hospitals |

---

## Applications in Daily Life

| Substance | Application |
|-----------|-------------|
| **Copper** | Electrical wiring (excellent conductor) |
| **Sodium chloride** | Table salt for seasoning |
| **Carbon dioxide** | Fizz in carbonated drinks |
| **Methane** | Fuel for heating and cooking |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "9. Common Exam Questions and Mistakes",
                content: `## Sample Exam Questions

### Q1: "An atom has 9 protons. Which element is it?"

**Answer:** Look up element with proton number 9 in Periodic Table → **Fluorine (F)**

---

### Q2: "Which two particles are isotopes?"

**How to Answer:**
- Find particles with **same proton number** but **different nucleon number**
- Isotopes = same element, different neutrons

---

### Q3: "Explain the difference between a mixture of iron and sulfur and the compound iron sulfide."

**Answer Structure:**
1. **Formation:** Mixture = physical mixing; Compound = chemical reaction
2. **Separation:** Mixture = magnet; Compound = only by chemical reaction
3. **Properties:** Mixture = iron still magnetic; Compound = new properties, not magnetic

---

## Common Mistakes to Avoid

| Common Mistake | Correct Understanding |
|----------------|----------------------|
| Confusing Nucleon Number with neutrons | Nucleon Number = protons + neutrons. Subtract proton number to find neutrons |
| Using "atom," "molecule," "element" interchangeably | Atom = single particle; Element = bulk substance; Molecule = atoms joined by covalent bonds |
| Thinking mixture = compound | Mixture = no chemical bonds, original properties; Compound = chemical bonds, new properties |
| Believing neutrons affect chemical properties | Chemical properties determined by **electrons** (= protons in neutral atom), NOT neutrons |`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Atom: smallest particle of an element; Element: pure substance of one atom type; Compound: different atoms chemically bonded",
            "Subatomic particles: protons (+1, in nucleus), neutrons (0, in nucleus), electrons (−1, in shells)",
            "Proton number uniquely identifies an element; Number of neutrons = Nucleon number − Proton number",
            "Atoms are electrically neutral: number of protons = number of electrons",
            "Electron shell rules: 1st shell = 2, 2nd shell = 8, 3rd shell = 8 (for first 20 elements)",
            "Isotopes: same protons, different neutrons — same chemical properties, different physical properties",
            "Compounds formed by chemical reactions have NEW properties different from constituent elements",
            "Mixtures: no chemical bonds, physical separation; Compounds: chemical bonds, chemical separation only",
            "Molecules: atoms joined by covalent bonds (sharing electrons) — non-metal + non-metal",
            "Ions: atoms that have lost/gained electrons; Ionic bonds: metal + non-metal (electron transfer)",
            "Chemical properties are determined by electrons in outer shell, not by neutrons"
        ],
        exam_tips: [
            "Use the formula: Neutrons = Nucleon Number − Proton Number (n = A − Z)",
            "To identify an element, use its proton number and look it up in the Periodic Table",
            "Isotopes have SAME proton number but DIFFERENT nucleon number — learn to spot them in tables",
            "Draw dot-and-cross diagrams showing electron transfer (ionic) or sharing (covalent)",
            "When comparing mixtures vs compounds, discuss: formation, separation method, and properties",
            "Remember: compounds have FIXED composition and NEW properties unlike their elements",
            "For ionic compounds, metals LOSE electrons (form cations), non-metals GAIN electrons (form anions)",
            "Know historical atomic models: Dalton → Thomson → Rutherford → Bohr → Chadwick",
            "Link electron configuration to Group number: outer electrons = Group number"
        ]
    },

    "Chemical Bonding": {
        topic: "Chemical Bonding",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Ionic_Covalent_and_Metallic_Bonding_Explained.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL0lvbmljX0NvdmFsZW50X2FuZF9NZXRhbGxpY19Cb25kaW5nX0V4cGxhaW5lZC5tNGEiLCJpYXQiOjE3NjU0NzAyMjAsImV4cCI6NTI2NTk2NjIyMH0.g9uIb2Bt8YQojNsXSBHaUuqpBVZ60o-9Y6sXIDdIbb8",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/Understanding_Chemical_Bonding.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9VbmRlcnN0YW5kaW5nX0NoZW1pY2FsX0JvbmRpbmcubXA0IiwiaWF0IjoxNzY1ODcwMjEzLCJleHAiOjUyNjYzNjYyMTN9.ikscsYUmSpPCPsXvL8HgrHph9tubLOI3EBFLs9WpPTg",
        subject: "Chemistry",
        summary: "Chemical bonding is the force of attraction that holds atoms together. Atoms bond to achieve a stable electron arrangement (full outer shell like noble gases). The three main types are ionic (electron transfer between metal and non-metal), covalent (electron sharing between non-metals), and metallic (sea of delocalised electrons). Each type results in distinct structures and properties.",
        sections: [
            {
                title: "1. Introduction to Chemical Bonding",
                content: `## What is Chemical Bonding?

**Chemical bonding** is the force of attraction that holds atoms together in elements and compounds.

When atoms of different elements bond, a **new substance with unique properties** is formed.

---

## Why Do Atoms Bond?

Atoms bond to achieve a **stable electron arrangement** — a **full outer shell of electrons** like the noble gases.

### Noble Gas Electron Configurations (Stable):

| Noble Gas | Electron Configuration | Outer Shell |
|-----------|----------------------|-------------|
| **Helium (He)** | 2 | Full (2 electrons) |
| **Neon (Ne)** | 2.8 | Full (8 electrons) |
| **Argon (Ar)** | 2.8.8 | Full (8 electrons) |

> **Key Point:** Noble gases are **unreactive** because they already have full outer shells. Other atoms must **lose, gain, or share electrons** to achieve this stable configuration.

---

## The Three Main Types of Chemical Bonds

| Bond Type | Description |
|-----------|-------------|
| **Ionic** | Transfer of electrons from metal to non-metal → oppositely charged ions attract |
| **Covalent** | Sharing of electron pairs between non-metal atoms |
| **Metallic** | Attraction between positive metal ions and a "sea" of delocalised electrons |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Ionic Bonding: Electron Transfer",
                content: `## Definition

An **ionic bond** is the **strong electrostatic force of attraction** between **oppositely charged ions**.

This type of bond forms between **metals and non-metals**.

---

## How Ions Are Formed: Example — Sodium Chloride (NaCl)

### Step-by-Step Process:

| Step | What Happens |
|------|--------------|
| **1. Metal Atom** | Sodium (Na) has configuration 2.8.1 — needs to lose 1 electron to achieve stable 2.8 |
| **2. Non-Metal Atom** | Chlorine (Cl) has configuration 2.8.7 — needs to gain 1 electron to achieve stable 2.8.8 |
| **3. Electron Transfer** | Sodium's outer electron transfers to chlorine |
| **4. Ion Formation** | Na⁺ (positive ion) and Cl⁻ (negative ion) formed |
| **5. Ionic Bond** | Oppositely charged ions attract → ionic bond forms |

---

## Example: Magnesium Oxide (MgO)

Ionic bonding can involve transfer of **more than one electron**:

| Atom | Configuration | Electrons Transferred | Ion Formed |
|------|---------------|----------------------|------------|
| Magnesium (Mg) | 2.8.2 | Loses 2 electrons | Mg²⁺ |
| Oxygen (O) | 2.6 | Gains 2 electrons | O²⁻ |

---

## Giant Ionic Lattice Structure

In solid state, ionic compounds form a **giant ionic lattice** — a regular, repeating 3D arrangement of alternating positive and negative ions.

In NaCl, each Na⁺ is surrounded by 6 Cl⁻ ions.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Properties of Ionic Compounds",
                content: `## Properties and Explanations

| Property | Description | Explanation (Why?) |
|----------|-------------|-------------------|
| **High Melting & Boiling Points** | Crystalline solids at room temperature | Large amount of energy needed to overcome **strong electrostatic forces** between ions in the lattice |
| **Electrical Conductivity (Solid)** | Do NOT conduct when solid | Ions are **fixed in position** in the lattice, cannot move |
| **Electrical Conductivity (Molten/Aqueous)** | DO conduct when molten or dissolved | Ions are **free to move** and carry electric charge |
| **Solubility** | Many are soluble in water | **Polar water molecules** can surround ions and pull them from the lattice |
| **Brittle** | Shatter when struck | When layers shift, **same-charge ions repel** → structure breaks |

---

## Effect of Ion Charge

Higher charges = Stronger attraction = Higher melting point

| Compound | Ion Charges | Melting Point |
|----------|-------------|---------------|
| NaCl | +1 and −1 | 801°C |
| MgO | +2 and −2 | 2852°C |

> **Exam Tip:** MgO has a higher melting point than NaCl because the ions have greater charges, leading to stronger electrostatic attraction.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Covalent Bonding: Electron Sharing",
                content: `## Definition

A **covalent bond** is formed when two atoms **share one or more pairs of electrons**.

More precisely: The **strong electrostatic attraction** between the **positively charged nuclei** and the **shared pair of electrons** between them.

Covalent bonding occurs between **non-metal atoms**.

---

## How Electrons Are Shared: Example — Hydrogen (H₂)

1. Each hydrogen atom has **1 electron**
2. Two hydrogen atoms **share their electrons** to form a **shared pair**
3. The shared pair orbits **both nuclei**
4. Each hydrogen now effectively has **2 electrons** (stable like helium)

---

## Types of Covalent Bonds

| Type | Shared Pairs | Examples | Notes |
|------|--------------|----------|-------|
| **Single Bond** | 1 pair | H₂, Cl₂, H₂O, CH₄ | Most common |
| **Double Bond** | 2 pairs | O₂, CO₂ | Stronger, shorter than single |
| **Triple Bond** | 3 pairs | N₂ | Very strong, very unreactive |

---

## Key Examples

### Methane (CH₄)
- Carbon (2.4) shares 4 electrons with 4 hydrogen atoms
- Each C-H bond is a single covalent bond

### Carbon Dioxide (CO₂)
- Carbon forms **2 double bonds** (one with each oxygen)
- O=C=O

### Nitrogen (N₂)
- Each nitrogen (2.5) needs 3 more electrons
- They share **3 pairs** → triple bond (N≡N)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Properties of Covalent Substances",
                content: `## Type A: Simple Molecular Structures

**Examples:** H₂O, CO₂, CH₄, NH₃, Cl₂

These consist of **individual molecules** held together by **weak intermolecular forces**.

| Property | Explanation |
|----------|-------------|
| **Low Melting & Boiling Points** | The **forces between molecules** (intermolecular) are **weak** and require little energy to overcome |
| **Poor Electrical Conductivity** | No free-moving charged particles (no ions, no free electrons) |
| **Usually Insoluble in Water** | Non-polar molecules; dissolve in organic solvents |

> **COMMON MISTAKE:** Students often say "covalent bonds are weak." This is WRONG! The **covalent bonds within molecules are STRONG**. It is the **intermolecular forces between molecules that are weak**.

---

## Type B: Giant Covalent Structures

In these structures, **all atoms are linked by a network of strong covalent bonds** throughout the entire crystal.

### Diamond (Pure Carbon)

| Feature | Details |
|---------|---------|
| **Structure** | Each C bonds to **4 others** in rigid tetrahedral arrangement |
| **Hardness** | **Hardest known natural substance** |
| **Melting Point** | Very high (3500°C+) — many strong bonds to break |
| **Conductivity** | **Insulator** — all electrons locked in bonds |
| **Uses** | Cutting tools, drill bits |

### Graphite (Pure Carbon)

| Feature | Details |
|---------|---------|
| **Structure** | Each C bonds to **3 others** → hexagonal layers |
| **Between Layers** | Weak forces — layers slide easily |
| **Hardness** | **Soft and slippery** |
| **Conductivity** | **CONDUCTS electricity** — 4th electron is delocalised |
| **Uses** | Lubricant, pencil "lead," electrodes |

### Silicon Dioxide (SiO₂)

- Similar structure to diamond
- Hard, high melting point, insulator
- Used for glass and lining furnaces`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Metallic Bonding: Sea of Electrons",
                content: `## Definition and Structure

**Metallic bonding** is the **electrostatic attraction** between:
- A **regular lattice of positive metal ions**
- A **"sea" of delocalised electrons**

---

## How Metallic Bonding Works

1. Metal atoms **lose outer-shell electrons**
2. Atoms become **positive ions**
3. Ions pack in **regular layers** (lattice)
4. Outer electrons become **delocalised** (free to move throughout structure)
5. These form a **"sea of electrons"** surrounding the positive ions

---

## Properties of Metals Explained

| Property | Explanation |
|----------|-------------|
| **Good Electrical Conductivity** | Delocalised electrons are **free to move** and carry electric charge when voltage applied |
| **Good Thermal Conductivity** | Free-moving electrons **absorb and transfer heat energy** quickly throughout the structure |
| **High Melting Points** | **Strong attraction** between positive ions and electron sea requires much energy to break |
| **Malleable (can be hammered)** | Layers of ions can **slide over each other** without breaking bonds — electron sea moves and maintains bonding |
| **Ductile (can be drawn into wire)** | Same reason as malleability — structure is flexible |

---

## Effect of Number of Electrons

More electrons donated = Stronger metallic bond = Higher melting point

| Metal | Electrons Donated | Relative Melting Point |
|-------|-------------------|----------------------|
| Sodium (Na) | 1 | Lower |
| Magnesium (Mg) | 2 | Higher |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. How Bonding Determines Properties",
                content: `## Master Comparison Table

| Structure Type | Bonding | Melting/Boiling Point | Electrical Conductivity |
|----------------|---------|----------------------|------------------------|
| **Ionic Lattice** (NaCl) | Ionic | HIGH — strong electrostatic forces between ions | Solid: NO (ions fixed). Molten/Aqueous: YES (ions free) |
| **Simple Molecular** (H₂O, CO₂) | Covalent within molecules | LOW — weak intermolecular forces | NO — no free particles |
| **Giant Covalent** (Diamond) | Covalent throughout | VERY HIGH — vast network of strong bonds | NO — electrons fixed in bonds |
| **Giant Covalent** (Graphite) | Covalent (3 bonds/atom) | VERY HIGH | YES — delocalised electrons |
| **Metallic** (Cu, Fe) | Metallic | HIGH — strong ion-electron attraction | YES — free electrons in solid AND liquid |

---

## Key Principle

> **The type of bonding within a substance determines its physical properties, especially melting point and electrical conductivity.**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Representing Bonds with Diagrams",
                content: `## Dot-and-Cross Diagrams

**Purpose:** Show outer-shell electrons involved in bonding.

**Convention:**
- Electrons from one atom shown as **dots (•)**
- Electrons from other atom shown as **crosses (×)**

---

## Ionic Bonding Diagrams

For ionic compounds:
1. Show electron transfer from metal to non-metal
2. Place square brackets around each ion
3. **Write the charge** on each ion (e.g., Na⁺, Cl⁻)
4. Show full outer shells after transfer

### Example: NaCl
- Na transfers 1 electron to Cl
- Na⁺ (2.8) and Cl⁻ (2.8.8)

---

## Covalent Bonding Diagrams

For covalent compounds:
1. Show shared pairs between atoms
2. Draw **complete outer shells** for all atoms
3. Shared electrons shown overlapping between atoms

### Example: H₂O
- Oxygen shares 2 electrons (one with each hydrogen)
- Oxygen achieves stable 8, each hydrogen achieves stable 2

### Example: CH₄
- Carbon shares 4 electrons with 4 hydrogen atoms
- Carbon achieves stable 8, each H achieves stable 2

---

## Giant Structure Lattice Diagrams

Show the **regular, repeating arrangement** of particles:
- **Ionic lattice:** Alternating positive and negative ions
- **Diamond lattice:** Each carbon bonded to 4 others in 3D network`,
                diagrams: [],
                subsections: []
            },
            {
                title: "9. Real-Life Applications",
                content: `## Applications Based on Bonding Properties

| Substance | Structure | Property Used | Application |
|-----------|-----------|---------------|-------------|
| **Diamond** | Giant covalent | Extreme hardness | Drilling/cutting tools |
| **Graphite** | Giant covalent (layers) | Slippery layers | Lubricant, pencil "lead" |
| **Graphite** | Giant covalent | Conducts electricity | Electrodes, electric motor brushes |
| **Silica (SiO₂)** | Giant covalent | Transparent, hard | Glass-making |
| **Silica** | Giant covalent | Very high melting point | Furnace linings |
| **Copper** | Metallic | Excellent conductor, ductile | Electrical wiring |
| **Iron** | Metallic | Strong | Steel for buildings, bridges |
| **Aluminium** | Metallic | Strong but light | Aircraft construction |

---

## Why Structure Matters

The connection between bonding → properties → uses is central to chemistry and engineering.

Understanding HOW atoms are bonded explains WHY substances behave as they do and WHERE they can be used.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "10. Common Exam Questions",
                content: `## Q1: Ionic Bonding Question

**"Lithium (proton number 3) reacts with Fluorine (proton number 9). Draw a dot-and-cross diagram. Describe the structure of lithium fluoride."**

### Model Answer:

1. **Electron configurations:**
   - Lithium: 2.1 (needs to lose 1 electron)
   - Fluorine: 2.7 (needs to gain 1 electron)

2. **Transfer:** Li transfers 1 electron to F

3. **Ions formed:** Li⁺ (2) and F⁻ (2.8)

4. **Structure:** Giant ionic lattice — regular, repeating arrangement of alternating Li⁺ and F⁻ ions held by strong electrostatic forces

---

## Q2: Covalent Bonding Question

**"Draw a dot-and-cross diagram for methane (CH₄). State two physical properties and explain why."**

### Model Answer:

1. **Diagram:** Carbon at center, sharing 1 electron with each of 4 hydrogen atoms

2. **Property 1: Low melting/boiling point**
   - Methane exists as simple individual molecules
   - Forces **between molecules** are very weak
   - Little energy needed to overcome them

3. **Property 2: Does not conduct electricity**
   - No ions or delocalised electrons
   - No free-moving charged particles

---

## Q3: Comparison Question

**"Explain why graphite conducts electricity but diamond does not."**

### Model Answer:

- **Diamond:** Each carbon is bonded to **4 others**. All 4 outer electrons are in bonds, **held tightly in fixed positions**. No free electrons → cannot conduct.

- **Graphite:** Each carbon is bonded to **3 others**. The **4th electron is delocalised** and free to move along the layers. These mobile electrons can carry current → conducts electricity.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "11. Common Mistakes and Summary",
                content: `## Common Mistakes to Avoid

| Common Mistake | Correct Understanding |
|----------------|----------------------|
| "Simple molecular substances have weak covalent bonds" | **WRONG!** Covalent bonds within molecules are STRONG. The **intermolecular forces** are weak |
| Forgetting charges on ionic diagrams | Always add **square brackets AND charges** (e.g., [Na]⁺, [Cl]⁻) |
| Drawing incomplete outer shells in covalent diagrams | Show **complete outer shells** for ALL atoms to demonstrate stable configuration |
| "Ionic compounds conduct electricity" | Too vague! They conduct **only when molten or dissolved** — NOT when solid |

---

## Master Summary Table

| Feature | Ionic | Covalent | Metallic |
|---------|-------|----------|----------|
| **Atoms Involved** | Metal + Non-metal | Non-metal + Non-metal | Metal atoms only |
| **Bond Formation** | Electron TRANSFER → ions attract | Electron SHARING → shared pairs | Ions + delocalised electrons |
| **Structure** | Giant ionic lattice | Simple molecular OR Giant covalent | Giant metallic lattice |
| **Example** | NaCl, MgO | H₂O, CH₄, Diamond | Cu, Fe, Mg |
| **Melting Point** | High | Simple: Low; Giant: Very High | High |
| **Conductivity** | Solid: No; Molten/Aq: Yes | Simple: No; Graphite: Yes | Yes (solid and liquid) |
| **Other Properties** | Brittle, water soluble | Simple: gases/liquids | Malleable, ductile |`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Atoms bond to achieve a full outer shell (stable Noble Gas configuration)",
            "Ionic bonding: TRANSFER of electrons from metal to non-metal → oppositely charged ions → giant ionic lattice",
            "Ionic compounds: high m.p., conduct when molten/dissolved (NOT solid), brittle, often water soluble",
            "Covalent bonding: SHARING of electron pairs between non-metal atoms",
            "Simple molecular structures: low m.p. (weak INTERMOLECULAR forces), do not conduct",
            "Covalent bonds inside molecules are STRONG — intermolecular forces are weak",
            "Giant covalent structures (diamond, graphite, silica): very high m.p., many strong bonds to break",
            "Diamond: 4 bonds per C, hardest natural substance, insulator",
            "Graphite: 3 bonds per C, layers slide, CONDUCTS (delocalised 4th electron)",
            "Metallic bonding: positive ions in sea of delocalised electrons → conduct, malleable, ductile",
            "Conductivity depends on free-moving charged particles (ions or electrons)"
        ],
        exam_tips: [
            "Always distinguish between INTERMOLECULAR forces (weak, between molecules) and COVALENT bonds (strong, within molecules)",
            "Ionic compounds conduct when MOLTEN or DISSOLVED — never say 'ionic compounds conduct' without qualification",
            "For ionic dot-and-cross diagrams: show transfer, use square brackets, write ion charges",
            "For covalent diagrams: show complete outer shells for all atoms",
            "Explain graphite vs diamond: graphite has delocalised electrons (3 bonds per C), diamond doesn't (4 bonds per C)",
            "Higher ion charges = stronger ionic bonds = higher melting point (MgO > NaCl)",
            "Metals are malleable because layers slide while electron sea maintains bonding",
            "Link structure → properties → uses in application questions"
        ]
    },

    "Stoichiometry": {
        topic: "Stoichiometry",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/Stoichiometry__The_Recipe.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9TdG9pY2hpb21ldHJ5X19UaGVfUmVjaXBlLm1wNCIsImlhdCI6MTc2NTg3MDE2MSwiZXhwIjo1MjY2MzY2MTYxfQ.6ttVeW0TsinpTrk_HIIo8UR6AFyVbvJYj3X7WNxWBlA",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/remaining/Weighing_Invisible_Atoms_with_Stoichiometry.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL3JlbWFpbmluZy9XZWlnaGluZ19JbnZpc2libGVfQXRvbXNfd2l0aF9TdG9pY2hpb21ldHJ5Lm00YSIsImlhdCI6MTc2ODY4MjA0MiwiZXhwIjo1MjY5MTc4MDQyfQ.fTyjNm6NgyurV_2kCHvQPAMon0AK8_QOG-zM9atljls",
        subject: "Chemistry",
        summary: "Stoichiometry is the area of chemistry that involves using relationships between reactants and products in chemical reactions to determine quantitative data. From balanced equations, we can determine mole ratios and convert between moles, masses, volumes, and concentrations. Stoichiometry is the 'recipe' aspect of chemistry, essential for predicting outcomes and optimizing reactions.",
        sections: [
            {
                title: "1. Introduction to Stoichiometry",
                content: `## What is Stoichiometry?

**Stoichiometry** is the area of chemistry that deals with the **quantitative relationships** in chemical reactions.

From a balanced equation, we can determine:
- How many **moles** react
- How these convert to **grams** using Ar and Mr

---

## Why is Stoichiometry Important?

| Purpose | Description |
|---------|-------------|
| **Predicting Outcomes** | Calculate the expected amount of product (theoretical yield) |
| **Optimising Reactions** | Determine precise amounts of reactants needed for complete reaction |
| **Industrial Applications** | Essential in Haber process, Contact process, etc. — minimise waste |

---

## The Foundation

The **balanced chemical equation** provides the exact **mole ratio** — the recipe for the reaction.

**Example:** C(s) + O₂(g) → CO₂(g)
- 1 mole of carbon atoms reacts with 1 mole of oxygen molecules
- Produces 1 mole of carbon dioxide molecules`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Chemical Formulae and Equations",
                content: `## Writing Correct Chemical Formulae

A chemical formula uses element symbols and subscripts to show the number of atoms.

| Compound | Constituent Atoms | Chemical Formula |
|----------|-------------------|------------------|
| Water | 2 Hydrogen, 1 Oxygen | H₂O |
| Carbon dioxide | 1 Carbon, 2 Oxygen | CO₂ |
| Ethanol | 2 Carbon, 6 Hydrogen, 1 Oxygen | C₂H₅OH |

---

## Writing Word Equations

Word equations show names of reactants and products:

**iron + sulfur → iron(II) sulfide**

- The **+** symbol means "reacts with"
- The **→** symbol means "to form"

---

## Balancing Chemical Equations

Equations must be balanced to obey the **Law of Conservation of Mass**: atoms are not created or destroyed in reactions.

### Example: Sodium + Chlorine

**Unbalanced:** Na(s) + Cl₂(g) → NaCl(s)
- Problem: 2 Cl atoms on left, 1 on right

**Balanced:** 2Na(s) + Cl₂(g) → 2NaCl(s)
- Now: 2 Na and 2 Cl on both sides ✓

---

## State Symbols

| Symbol | Meaning |
|--------|---------|
| **(s)** | Solid |
| **(l)** | Liquid |
| **(g)** | Gas |
| **(aq)** | Aqueous (dissolved in water) |

> **Critical:** Without a balanced equation, all subsequent calculations will be incorrect!`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. The Mole Concept",
                content: `## What is a Mole?

The **mole** is the chemist's fundamental unit for amount of substance.

All stoichiometric calculations are routed through moles.

---

## Relative Masses

### Relative Atomic Mass (Ar)
- The relative mass of an atom of an element
- Found in the Periodic Table
- **No units** (it's relative to Carbon-12)

### Relative Formula Mass (Mr)
- The **sum of all Ar values** in a formula

| Substance | Atoms | Calculation | Mr |
|-----------|-------|-------------|-----|
| Ammonia (NH₃) | 1 N, 3 H | (1×14) + (3×1) | **17** |
| Magnesium Nitrate Mg(NO₃)₂ | 1 Mg, 2 N, 6 O | 24 + (2×14) + (6×16) | **148** |

---

## The Key Formula

$$n = \\frac{m}{M_r}$$

Where:
- **n** = moles
- **m** = mass in grams
- **Mr** = molar mass (g/mol)

### Rearrangements:
- **Mass** = n × Mr
- **Mr** = m ÷ n

---

## Worked Example: Mass to Moles

**Question:** 1.4 g of iron displaces 1.6 g of copper. Find the mole ratio. (Ar: Fe = 56, Cu = 64)

**Solution:**
1. Moles of Fe = 1.4 ÷ 56 = **0.025 mol**
2. Moles of Cu = 1.6 ÷ 64 = **0.025 mol**
3. Mole ratio = **1:1**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Stoichiometric Calculations",
                content: `## From Mass of Reactant to Mass of Product

### Worked Example: Carbon + Oxygen

**Equation:** C + O₂ → CO₂

| Step | Action |
|------|--------|
| **1. Write Balanced Equation** | C + O₂ → CO₂ |
| **2. Write Mole Relationship** | 1 mol C : 1 mol O₂ : 1 mol CO₂ |
| **3. Convert to Grams** | 12g C : 32g O₂ : 44g CO₂ |

**Question:** What mass of CO₂ is produced from 6g of carbon?

**Solution:**
- 12g C produces 44g CO₂
- 6g C is half of 12g
- Mass of CO₂ = 44 ÷ 2 = **22g**

---

## Working Out Equations from Masses

### Worked Example

**Given:** 1.4g Fe reacts with CuSO₄ to produce 1.6g Cu

**Solution:**
1. Moles of Fe = 1.4 ÷ 56 = 0.025 mol
2. Moles of Cu = 1.6 ÷ 64 = 0.025 mol
3. Mole ratio = 1:1
4. **Equation:** Fe(s) + CuSO₄(aq) → Cu(s) + FeSO₄(aq)

---

## Standard Calculation Steps

1. **Balance** the equation
2. **Calculate moles** of known substance
3. **Use ratio** to find moles of unknown
4. **Convert** moles to required units`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Limiting and Excess Reactants",
                content: `## Definitions

### Excess Reactant
The reactant that is **NOT completely used up** — some is left over after reaction.

### Limiting Reactant
The reactant that is **completely consumed** — determines the maximum amount of product.

---

## How to Identify

In exam questions:
- **Limiting reactant:** Quantity given precisely
- **Excess reactant:** Described as "in excess" or "until no more dissolves"

### Example:
"10g of chalk was reacted with an **excess** of dilute hydrochloric acid."

| Reactant | Type | Reason |
|----------|------|--------|
| Chalk (CaCO₃) | Limiting | Precise quantity given (10g) |
| HCl | Excess | Described as "excess" |

> **Critical:** All calculations must be based on the **limiting reactant**.

---

## Importance

Identifying the limiting reactant is essential for calculating:
- The **maximum possible product** (theoretical yield)
- How much excess reactant remains

---

## Practical Example: Salt Preparation

When preparing a salt from an insoluble base and acid:
- Base is added **in excess** until no more dissolves
- Acid is the **limiting reactant** — completely used up
- Undissolved base is filtered off`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Percentage Yield",
                content: `## Definition

**Percentage yield** measures the **efficiency** of a reaction — comparing actual product with theoretical maximum.

---

## The Formula

$$\\% \\text{ Yield} = \\frac{\\text{Actual Mass Obtained}}{\\text{Calculated (Theoretical) Mass}} \\times 100\\%$$

---

## Worked Example: Aspirin Synthesis

**Given:**
- 100.0g salicylic acid (C₇H₆O₃) produces 121.2g aspirin (C₉H₈O₄)
- Mole ratio = 1:1

### Step 1: Calculate Theoretical Mass

| Calculation | Value |
|-------------|-------|
| Mr of salicylic acid | 138 |
| Mr of aspirin | 180 |
| From 138g salicylic acid → | 180g aspirin |
| From 100.0g salicylic acid → | (180/138) × 100.0 = **130.5g** |

### Step 2: Apply Formula

$$\\% \\text{ Yield} = \\frac{121.2}{130.5} \\times 100 = \\textbf{92.9\\%}$$

---

## Why is Yield Less Than 100%?

| Reason | Explanation |
|--------|-------------|
| **Reversible reactions** | Equilibrium reached before completion |
| **Product lost** | During separation/purification |
| **Side reactions** | By-products formed |
| **Impure reactants** | Less active material than expected |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Diagrams and Mole Ratios",
                content: `## Interpreting Reaction Diagrams

Diagrams show the same reaction at two scales:

| Level | Interpretation | Example |
|-------|----------------|---------|
| **Particle (Microscopic)** | 1 atom of C + 1 molecule of O₂ → 1 molecule of CO₂ |
| **Mole (Macroscopic)** | 1 mol of C + 1 mol of O₂ → 1 mol of CO₂ |

---

## Key Insight

The **ratio remains the same** at both scales:
- Ratio of particles (1:1:1) = Ratio of moles (1:1:1)

This mole ratio is the essential link used in **all stoichiometric calculations**.

---

## Coefficients = Mole Ratio

In the balanced equation: **2Mg + O₂ → 2MgO**

| Substance | Coefficient | Moles |
|-----------|-------------|-------|
| Mg | 2 | 2 mol |
| O₂ | 1 | 1 mol |
| MgO | 2 | 2 mol |

The mole ratio is **2:1:2**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Real-Life Applications",
                content: `## Industrial Applications

| Application | Use of Stoichiometry |
|-------------|---------------------|
| **Haber Process** (Ammonia) | Calculate precise ratio of N₂ and H₂ to maximise yield |
| **Contact Process** (Sulfuric Acid) | Optimise reactant ratios for economic efficiency |
| **Blast Furnace** (Iron) | Determine amount of coke (carbon) needed to reduce all iron ore |

---

## Laboratory Applications

### Making Salts
- Add base **in excess** to ensure acid (limiting reactant) is completely used
- Filter off excess base
- Pure salt obtained

### Titration
A practical application of stoichiometry:

1. React solution of **known concentration** with **unknown concentration**
2. Measure exact volume needed for neutralisation
3. Use mole ratios to calculate unknown concentration

**Formula flow:**
- n(known) = C × V
- Use mole ratio from equation
- C(unknown) = n ÷ V

---

## Why This Matters

Stoichiometry ensures:
- **Maximum efficiency** — no wasted reactants
- **Cost control** — precise quantities used
- **Quality control** — predictable product amounts`,
                diagrams: [],
                subsections: []
            },
            {
                title: "9. Common Exam Questions",
                content: `## Example 1: Calculate Mr

**Question:** Calculate the Mr of NH₄NO₃

**Approach:**
1. Count atoms: N = 2, H = 4, O = 3
2. Find Ar values: N = 14, H = 1, O = 16
3. Calculate: (2×14) + (4×1) + (3×16) = 28 + 4 + 48 = **80**

---

## Example 2: Mass-to-Mass Calculation

**Question:** 7.00 kg of CaO was formed. What mass of CaCO₃ was heated?

**Approach:**
1. Balanced equation: CaCO₃ → CaO + CO₂ (ratio 1:1)
2. Calculate Mr:
   - CaCO₃: 40 + 12 + 48 = 100
   - CaO: 40 + 16 = 56
3. Mass ratio: 100g CaCO₃ produces 56g CaO
4. Solve: Mass CaCO₃ = (7.00 ÷ 56) × 100 = **12.5 kg**

---

## Example 3: Titration Calculation

**Approach:**
1. Calculate moles of known: n = C × V (volume in dm³)
2. Use mole ratio from equation
3. Calculate unknown concentration: C = n ÷ V

---

## Key Calculation Steps

| Step | Action |
|------|--------|
| 1 | Write BALANCED equation |
| 2 | Calculate MOLES of known substance |
| 3 | Use MOLE RATIO from equation |
| 4 | Convert to required UNITS (mass, concentration, volume) |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "10. Common Mistakes and Summary",
                content: `## Common Mistakes to Avoid

| Common Mistake | Correct Approach |
|----------------|------------------|
| **Forgetting to balance** | ALWAYS balance equation first — mole ratios come from coefficients |
| **Using mass directly in ratio** | Coefficients represent MOLES, not mass. Convert mass → moles first |
| **Errors with brackets in Mr** | Mg(NO₃)₂ has 2 N atoms (1×2) and 6 O atoms (3×2) |
| **Wrong volume units** | Convert cm³ to dm³ by ÷1000 before using concentration formula |

---

## The Stoichiometry Workflow

1. **Foundation:** Balanced chemical equation (provides mole ratio)
2. **Central Unit:** Convert given quantity to MOLES
3. **The Bridge:** Use mole ratio to find moles of target substance
4. **Final Answer:** Convert moles to required units
5. **Reality Check:** Apply percentage yield for actual results

---

## Master Summary

| Concept | Formula/Definition |
|---------|-------------------|
| **Mr** | Sum of all Ar values in formula |
| **Moles from mass** | n = m ÷ Mr |
| **Moles from concentration** | n = C × V (V in dm³) |
| **Moles from gas volume** | n = V ÷ 24 (V in dm³ at r.t.p.) |
| **Limiting reactant** | Completely consumed; determines max product |
| **Percentage yield** | (Actual ÷ Theoretical) × 100% |`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Stoichiometry uses balanced equations to calculate amounts in reactions",
            "The balanced equation provides the exact mole ratio — the reaction 'recipe'",
            "n = m/Mr (moles = mass ÷ molar mass) — the key conversion formula",
            "Mr is the sum of all Ar values in the formula — watch brackets carefully",
            "Coefficients in equations represent moles, NOT masses",
            "Convert mass to moles BEFORE using mole ratios",
            "Limiting reactant: completely consumed, determines maximum product",
            "Excess reactant: some left over after reaction",
            "% Yield = (Actual/Theoretical) × 100 — measures reaction efficiency",
            "Always check equation is balanced before starting calculations",
            "Standard workflow: Equation → Moles → Ratio → Convert to answer"
        ],
        exam_tips: [
            "ALWAYS balance the equation first — unbalanced = wrong mole ratio = wrong answer",
            "Show all working: formula → substitution → answer with units",
            "Coefficients represent MOLES not GRAMS — always convert mass to moles first",
            "Watch brackets in Mr calculations: Mg(NO₃)₂ has 2 N and 6 O atoms",
            "Convert cm³ to dm³ (÷1000) before concentration calculations",
            "Identify the limiting reactant — all calculations are based on this",
            "For % yield, calculate theoretical yield first, then apply formula",
            "Use the standard workflow: Balance → Moles → Ratio → Convert"
        ]
    },

    "Chemical Reactions": {
        topic: "Chemical Reactions",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/remaing/Chem_Reactions__Engine_of_Change.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9yZW1haW5nL0NoZW1fUmVhY3Rpb25zX19FbmdpbmVfb2ZfQ2hhbmdlLm1wNCIsImlhdCI6MTc2ODY4Mjg5OCwiZXhwIjo1MjY5MTc4ODk4fQ.kJKpuVqtD7vJxt_qi_X6ze2bxvuNsoVM_wQIm9bEkOY",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Measuring_and_Controlling_Chemical_Reaction_Rates.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL01lYXN1cmluZ19hbmRfQ29udHJvbGxpbmdfQ2hlbWljYWxfUmVhY3Rpb25fUmF0ZXMubTRhIiwiaWF0IjoxNzY1NDcxMDA2LCJleHAiOjUyNjU5NjcwMDZ9.om3jfafEvzF08-sylkgXd4Onr7T2fK_M2aRgLlnmf1E",
        subject: "Chemistry",
        summary: "A chemical reaction is a process that leads to the transformation of one set of chemical substances to another. These processes are fundamental to chemistry, converting reactants into products. Understanding reaction types, energy changes, reaction rates, and reversibility is essential for predicting outcomes and controlling reactions in both laboratory and industrial settings.",
        sections: [
            {
                title: "1. Introduction to Chemical Reactions",
                content: `## What is a Chemical Reaction?

A **chemical reaction** is a process that leads to the **chemical transformation** of one set of substances to another.

---

## Chemical Change vs Physical Change

| Feature | Chemical Change | Physical Change |
|---------|-----------------|-----------------|
| **New substances** | New substances formed with different properties | No new substances formed |
| **Energy** | Significant energy change (heat, light) | Small energy changes (state changes) |
| **Reversibility** | Difficult to reverse | Usually easy to reverse |
| **Example** | Fe + S → FeS (iron(II) sulfide) | Dissolving sugar in water |

---

## Signs of a Chemical Change

1. **New substances formed** with different properties
2. **Energy taken in or given out** (heat, light, sound)
3. **Difficult to reverse**

### Example: Iron + Sulfur

When iron powder and sulfur are heated:
- New black compound (iron(II) sulfide) forms
- Reaction glows brightly (energy released)
- Cannot easily separate Fe and S again`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Types of Chemical Reactions",
                content: `## 1. Combination Reactions

Elements or compounds **join together** to form a more complex product.

**Example:** 2Mg(s) + O₂(g) → 2MgO(s)
- Magnesium + Oxygen → Magnesium oxide

---

## 2. Decomposition Reactions

A compound **breaks down** into simpler substances (often requires heat).

**Example 1:** CaCO₃(s) → CaO(s) + CO₂(g)
- Calcium carbonate decomposes on heating

**Example 2:** 2H₂O₂(aq) → 2H₂O(l) + O₂(g)
- Hydrogen peroxide decomposition (catalysed by MnO₂)

---

## 3. Displacement Reactions

A **more reactive element displaces** a less reactive element from a compound.

**Example:** Zn(s) + H₂SO₄(aq) → ZnSO₄(aq) + H₂(g)
- Zinc displaces hydrogen from sulfuric acid

> Predicted by the **reactivity series**

---

## 4. Double Displacement (Precipitation)

Two soluble compounds react to form an **insoluble solid (precipitate)**.

**Example:** BaCl₂(aq) + MgSO₄(aq) → BaSO₄(s) + MgCl₂(aq)
- White precipitate of barium sulfate forms

---

## 5. Neutralisation Reactions

An **acid + base → salt + water**

**Example:** HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Writing and Balancing Equations",
                content: `## Word Equations

The simplest description of a reaction:

**iron + sulfur → iron(II) sulfide**

- **+** means "reacts with"
- **→** means "to form"

---

## Symbol Equations with State Symbols

| Symbol | Meaning |
|--------|---------|
| **(s)** | Solid |
| **(l)** | Liquid |
| **(g)** | Gas |
| **(aq)** | Aqueous (dissolved in water) |

---

## Balancing Equations

### The Law of Conservation of Mass
> Atoms are NOT created or destroyed in a reaction

### Rules:
1. Only change **coefficients** (big numbers in front)
2. NEVER change **subscripts** (small numbers in formulae)

---

## Worked Example 1: Sodium + Chlorine

**Unbalanced:** Na + Cl₂ → NaCl
- Left: 1 Na, 2 Cl | Right: 1 Na, 1 Cl ❌

**Balancing:**
1. Put 2 in front of NaCl: Na + Cl₂ → 2NaCl
2. Put 2 in front of Na: 2Na + Cl₂ → 2NaCl

**Balanced:** 2Na(s) + Cl₂(g) → 2NaCl(s) ✓

---

## Worked Example 2: Aluminium + Oxygen

**Unbalanced:** Al + O₂ → Al₂O₃
- Left: 1 Al, 2 O | Right: 2 Al, 3 O ❌

**Balancing:**
1. Find LCM for oxygen (6): Al + 3O₂ → 2Al₂O₃
2. Balance aluminium (4): 4Al + 3O₂ → 2Al₂O₃

**Balanced:** 4Al(s) + 3O₂(g) → 2Al₂O₃(s) ✓`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Energy Changes in Reactions",
                content: `## Exothermic Reactions

Reactions that **give out energy** to the surroundings.

| Feature | Details |
|---------|---------|
| **Energy flow** | Released to surroundings |
| **Temperature** | Surroundings get HOTTER |
| **Energy diagram** | Products LOWER than reactants |

### Examples:
- Burning fuels (combustion)
- Sodium reacting with water
- Respiration in cells

---

## Endothermic Reactions

Reactions that **take in energy** from the surroundings.

| Feature | Details |
|---------|---------|
| **Energy flow** | Absorbed from surroundings |
| **Temperature** | Surroundings get COLDER |
| **Energy diagram** | Products HIGHER than reactants |

### Examples:
- Photosynthesis
- Thermal decomposition of CaCO₃
- Ethanoic acid + sodium carbonate

---

## Bond Energy Explanation

| Process | Energy |
|---------|--------|
| **Breaking bonds** | TAKES IN energy (endothermic) |
| **Making bonds** | RELEASES energy (exothermic) |

### Overall Energy Change:
- **Exothermic:** Energy released by new bonds > Energy needed to break old bonds
- **Endothermic:** Energy needed to break old bonds > Energy released by new bonds`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Rate of Chemical Reactions",
                content: `## What is Reaction Rate?

The **speed** at which reactants are used up or products are formed.

$$\\text{Rate} = \\frac{\\text{Amount of product formed}}{\\text{Time taken}}$$

**Example:** Volume of H₂ produced per minute (cm³/min)

---

## Collision Theory

For a reaction to occur:
1. Particles must **collide**
2. Collisions must have **sufficient energy**
3. Only **successful collisions** lead to reaction

---

## Factors Affecting Rate

| Factor | Effect | Explanation |
|--------|--------|-------------|
| **Temperature ↑** | Rate increases | Particles move faster, more frequent AND more energetic collisions |
| **Concentration ↑** | Rate increases | More particles in same volume = more frequent collisions |
| **Surface Area ↑** | Rate increases | More particles exposed = more frequent collisions |
| **Catalyst added** | Rate increases | Provides alternative pathway with LOWER activation energy |

---

## Catalysts

A **catalyst** is a substance that:
- **Increases** the rate of reaction
- Is **chemically unchanged** at the end
- Can be **recovered and reused**

### Examples:
- MnO₂ catalyses H₂O₂ decomposition
- Iron catalyst in Haber process

---

## Enzymes: Biological Catalysts

**Enzymes** are proteins made by living things that catalyse reactions in cells.

### Examples:
- Amylase in saliva (breaks down starch)
- Enzymes in biological detergents`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Reversible Reactions and Equilibrium",
                content: `## Reversible Reactions

Some reactions can proceed in **both directions**:
- Forward: Reactants → Products
- Reverse: Products → Reactants

Shown with double arrow: **⇌**

---

## Classic Example: Hydrated Copper Sulfate

$$\\text{CuSO}_4\\cdot5\\text{H}_2\\text{O (s)} \\rightleftharpoons \\text{CuSO}_4\\text{ (s)} + 5\\text{H}_2\\text{O (l)}$$

| State | Colour | Name |
|-------|--------|------|
| **Hydrated** | BLUE crystals | Copper sulfate pentahydrate |
| **Anhydrous** | WHITE powder | Anhydrous copper sulfate |

- Heating removes water (turns white)
- Adding water restores blue colour (releases heat)

---

## Dynamic Equilibrium

In a **closed system**, reversible reactions reach **equilibrium** when:
- Rate of forward reaction = Rate of reverse reaction
- Concentrations remain CONSTANT
- Reactions are still occurring (hence "dynamic")

---

## Industrial Example: Haber Process

$$\\text{N}_2\\text{(g)} + 3\\text{H}_2\\text{(g)} \\rightleftharpoons 2\\text{NH}_3\\text{(g)}$$

Conditions are manipulated (temperature, pressure) to maximise ammonia yield.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Interpreting Diagrams and Graphs",
                content: `## Rate of Reaction Graphs

### What the Graph Shows:
- **Y-axis:** Amount of product (e.g., volume of gas)
- **X-axis:** Time

### Key Features:

| Feature | Meaning |
|---------|---------|
| **Steep curve** | Fast reaction rate |
| **Shallow curve** | Slow reaction rate |
| **Curve flattens** | Reaction has STOPPED (limiting reactant used up) |
| **Same final height** | Same amount of limiting reactant |

---

## Comparing Experiments

If Curve B is steeper than Curve A:
- Experiment B has **faster rate**
- Could be due to: higher temperature, higher concentration, larger surface area, or catalyst

If both reach same final volume:
- Same amount of **limiting reactant** was used

---

## Apparatus Diagrams to Know

### Filtration
- Separates **insoluble solid** from liquid
- Residue (solid) trapped by filter paper
- Filtrate (liquid) passes through

### Crystallisation
- Obtains dissolved solid from solution
- Heat to concentrate → cool to crystallise

### Simple Distillation
- Separates liquid solvent from solution
- Flask → Condenser → Collection beaker`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Real-Life Applications",
                content: `## Industrial Processes

| Process | Reaction Type | Application |
|---------|---------------|-------------|
| **Haber Process** | Reversible, combination | Ammonia for fertilisers |
| **Contact Process** | Reversible | Sulfuric acid production |
| **Blast Furnace** | Reduction (redox) | Iron extraction from ore |
| **Electrolysis of Brine** | Electrolysis | Chlorine, NaOH, hydrogen |
| **Cracking** | Decomposition | Petrol and alkenes from crude oil |

---

## Biological Reactions

| Process | Type | Details |
|---------|------|---------|
| **Photosynthesis** | Endothermic | Plants convert CO₂ + H₂O → glucose + O₂ using light |
| **Respiration** | Exothermic | Cells release energy from glucose + O₂ → CO₂ + H₂O |

---

## Environmental Reactions

| Reaction | Details |
|----------|---------|
| **Rusting** | Slow oxidation of iron requiring O₂ and H₂O |
| **Acid Rain** | SO₂ from fossil fuels reacts with O₂ and H₂O in atmosphere |

### Rusting:
$$4\\text{Fe} + 3\\text{O}_2 + 2x\\text{H}_2\\text{O} \\rightarrow 2\\text{Fe}_2\\text{O}_3\\cdot x\\text{H}_2\\text{O}$$`,
                diagrams: [],
                subsections: []
            },
            {
                title: "9. Common Exam Questions",
                content: `## Example 1: Balancing Equations

**Question:** Balance: Na + H₂O → NaOH + H₂

**Method:**
1. Right side: 2 Na, 4 H, 2 O (in 2NaOH + H₂)
2. Balance Na: put 2 in front of Na
3. Balance O: put 2 in front of H₂O

**Answer:** 2Na + 2H₂O → 2NaOH + H₂ ✓

---

## Example 2: Reactivity Observations

**Question:** Calcium produces "many bubbles rapidly" with HCl. Iron produces "a few bubbles very slowly". Arrange in order of reactivity.

**Method:**
- More bubbles + faster = MORE reactive
- Few bubbles + slow = LESS reactive

**Answer:** Iron < Calcium (increasing reactivity)

---

## Example 3: Rate Graph Interpretation

**Question:** At what time did the reaction stop? Write the word equation.

**Method:**
1. Reaction stops when curve becomes **horizontal**
2. Read time value from x-axis
3. Metal carbonate + acid → salt + water + carbon dioxide

**Answer:**
- Time when curve flattens
- Calcium carbonate + Hydrochloric acid → Calcium chloride + Water + Carbon dioxide`,
                diagrams: [],
                subsections: []
            },
            {
                title: "10. Common Mistakes to Avoid",
                content: `## Mistakes Table

| Common Mistake | Correct Understanding |
|----------------|----------------------|
| **Changing subscripts to balance** | Only change COEFFICIENTS (big numbers in front), never subscripts |
| **Confusing displacement and decomposition** | Displacement: A + BC → AC + B. Decomposition: AB → A + B |
| **Aqueous electrolysis product errors** | If metal is very reactive, HYDROGEN forms at cathode instead of metal |
| **Thinking catalyst is "used up"** | Catalyst is UNCHANGED at end and can be RECOVERED |
| **Confusing exothermic and endothermic** | Exothermic = gives OUT heat (surroundings get HOT). Endothermic = takes IN heat (surroundings get COLD) |

---

## Key Reminders

- Always **balance equations** before calculations
- Identify reaction type from reactants and products
- Rate graphs: **steeper = faster**, **flat = stopped**
- Catalysts provide **alternative pathway with lower energy**
- Reversible reactions use **double arrow (⇌)**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "11. Detailed Summary",
                content: `## Core Concepts

| Concept | Key Points |
|---------|------------|
| **Chemical vs Physical Change** | Chemical = new substances, energy change, hard to reverse |
| **Reaction Types** | Combination, Decomposition, Displacement, Precipitation, Neutralisation |
| **Balanced Equations** | Same atoms on both sides; only change coefficients |

---

## Energy in Reactions

| Type | Energy Flow | Temperature Change |
|------|-------------|-------------------|
| **Exothermic** | Releases energy | Surroundings get hotter |
| **Endothermic** | Absorbs energy | Surroundings get colder |

- Bond breaking = endothermic
- Bond making = exothermic

---

## Rate of Reaction

| Factor | How it Increases Rate |
|--------|----------------------|
| **↑ Temperature** | Faster, more energetic collisions |
| **↑ Concentration** | More frequent collisions |
| **↑ Surface Area** | More particles exposed |
| **Catalyst** | Lower activation energy pathway |

---

## Reversible Reactions

- Can proceed in BOTH directions
- Reach **dynamic equilibrium** when rates are equal
- Represented by ⇌ symbol`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Chemical change: new substances formed, energy change, difficult to reverse",
            "Physical change: no new substances, easily reversed",
            "Reaction types: Combination, Decomposition, Displacement, Precipitation, Neutralisation",
            "Balanced equations have same atoms on both sides — only change coefficients, not subscripts",
            "Exothermic reactions RELEASE energy — surroundings get hotter",
            "Endothermic reactions ABSORB energy — surroundings get colder",
            "Rate affected by: temperature, concentration, surface area, catalysts",
            "Collision theory: particles must collide with sufficient energy",
            "Catalysts increase rate without being chemically changed",
            "Reversible reactions can proceed in both directions (⇌)",
            "Dynamic equilibrium: forward rate = reverse rate, no net change"
        ],
        exam_tips: [
            "When balancing, only change COEFFICIENTS (big numbers), never subscripts",
            "Know the products of each reaction type: acid + carbonate → salt + water + CO₂",
            "Exothermic = exo = exit = energy EXITS (releases). Endothermic = energy enters (absorbs)",
            "Rate graphs: steeper curve = faster reaction; flat line = reaction stopped",
            "A catalyst is NOT used up — it can be recovered unchanged",
            "For electrolysis of aqueous solutions: if metal is reactive, H₂ forms at cathode instead",
            "Remember state symbols: (s) solid, (l) liquid, (g) gas, (aq) aqueous",
            "Displacement reactions are predicted by the reactivity series"
        ]
    },

    "The Periodic Table": {
        topic: "The Periodic Table",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/Periodic_Table__Chaos_to_Order.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9QZXJpb2RpY19UYWJsZV9fQ2hhb3NfdG9fT3JkZXIubXA0IiwiaWF0IjoxNzY1ODcwMTI1LCJleHAiOjUyNjYzNjYxMjV9.q8Cy-SpEI50mjSdJmABup2QDX_KoDiXc7axR0ge_i4E",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/remaining/The_Ingredients_List_For_The_Universe.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL3JlbWFpbmluZy9UaGVfSW5ncmVkaWVudHNfTGlzdF9Gb3JfVGhlX1VuaXZlcnNlLm00YSIsImlhdCI6MTc2ODY4MjAxNiwiZXhwIjo1MjY5MTc4MDE2fQ.EOQA5c7KYgsIIKdXJ_tjSfeGXmBXUjWOjfnRz02l1jE",
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



    "Chemical Energetics": {
        topic: "Chemical Energetics",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Bond_Breaking_and_Forming_Energy_Payoff.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL0JvbmRfQnJlYWtpbmdfYW5kX0Zvcm1pbmdfRW5lcmd5X1BheW9mZi5tNGEiLCJpYXQiOjE3NjU0NzAxMjgsImV4cCI6NTI2NTk2NjEyOH0.58DuvE1w_aCjNQUjwGxpQjlhTuaB4l65S_MuKXqHMq4",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/Chemical_Energetics%20(1).mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9DaGVtaWNhbF9FbmVyZ2V0aWNzICgxKS5tcDQiLCJpYXQiOjE3NjU4Njk4OTAsImV4cCI6NTI2NjM2NTg5MH0.y347fd66JwJX0L3JmRTViWAitgWDl3V--aDjDbHfSuI",
        subject: "Chemistry",
        summary: "Chemical reactions involve energy transfer. Exothermic reactions release heat (temperature rises), while endothermic reactions absorb heat (temperature falls). The overall energy change depends on bond breaking (endothermic) versus bond forming (exothermic). This topic also covers fuels, electrochemical cells, and equilibrium.",
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
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Electrolysis_and_the_Four_Conductors.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL0VsZWN0cm9seXNpc19hbmRfdGhlX0ZvdXJfQ29uZHVjdG9ycy5tNGEiLCJpYXQiOjE3NjU0NzAxNjEsImV4cCI6NTI2NTk2NjE2MX0.sxl-oyxt64GLw0rRgQhgPKFb_16ofMBqV9PYg7oomKI",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/Electrochemistry.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9FbGVjdHJvY2hlbWlzdHJ5Lm1wNCIsImlhdCI6MTc2NTg2OTkxOCwiZXhwIjo1MjY2MzY1OTE4fQ.fKL2xNYiSCTg8yeJ960tiBoHiGfeJdo8B-MuwBRxplA",
        subject: "Chemistry",
        summary: "Electrochemistry covers the relationship between electricity and chemical reactions. Electrolysis uses electricity to decompose ionic compounds. Electrochemical cells use chemical reactions to generate electricity. Key concepts include conductors, electrolytes, and predicting products at electrodes.",
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
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/Redox_Reactions__The_Electron_Exchange.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9SZWRveF9SZWFjdGlvbnNfX1RoZV9FbGVjdHJvbl9FeGNoYW5nZS5tcDQiLCJpYXQiOjE3NjU4NzAxNDcsImV4cCI6NTI2NjM2NjE0N30.Zaw3oQ0C30mOMfsM2eDgvmwh5o8AUS3rWU4Xt1tU9z4",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Oxidation_Reduction_The_Universal_Chemistry_Rule%20(1).m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL094aWRhdGlvbl9SZWR1Y3Rpb25fVGhlX1VuaXZlcnNhbF9DaGVtaXN0cnlfUnVsZSAoMSkubTRhIiwiaWF0IjoxNzY1NDcxMDM0LCJleHAiOjUyNjU5NjcwMzR9.TvxrOLfAF5O_sdTDXsakebHvskCt1myAMthONa4svx0",
        subject: "Chemistry",
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
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/Acids,_Bases,_&_Salts.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9BY2lkcyxfQmFzZXMsXyZfU2FsdHMubXA0IiwiaWF0IjoxNzY1ODY5ODYxLCJleHAiOjUyNjYzNjU4NjF9.NXMIYW7xDXx8atobAjJE_SvDq9tkNeNEkIDhENlLEOM",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/remaining/Acids,_Bases,_and_the_Proton_War.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL3JlbWFpbmluZy9BY2lkcyxfQmFzZXMsX2FuZF90aGVfUHJvdG9uX1dhci5tNGEiLCJpYXQiOjE3Njg2ODE5NzAsImV4cCI6MzY4MDUxNzc5NzB9.Q45LF7kOFcX4kxIo9Tc6OwQtu60aisYI-dXJ9vvZuYQ",
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
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/The_Explainer__Metals.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9UaGVfRXhwbGFpbmVyX19NZXRhbHMubXA0IiwiaWF0IjoxNzY1ODcwMTk3LCJleHAiOjUyNjYzNjYxOTd9.G3HP5FrivaW4Cz2M3F9tMUvEEQvNznsVC0G0eegYwU8",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/remaining/From_Electron_Seas_to_Blast_Furnaces.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL3JlbWFpbmluZy9Gcm9tX0VsZWN0cm9uX1NlYXNfdG9fQmxhc3RfRnVybmFjZXMubTRhIiwiaWF0IjoxNzY4NjgyMDAyLCJleHAiOjUyNjkxNzgwMDJ9.7lD4jWZEEsRel4FVO39x_mX-ZNdCilalkC1Yhxkz96I",
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
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/remaing/Non-metals__Unsung_Heroes.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9yZW1haW5nL05vbi1tZXRhbHNfX1Vuc3VuZ19IZXJvZXMubXA0IiwiaWF0IjoxNzY4NjgyOTA5LCJleHAiOjUyNjkxNzg5MDl9.eoA3FUOn6m_8tuhMX_AkZfJ4Com0wk2YTaU5GCof2ds",
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
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Proving_Water_Identity_and_Purity.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL1Byb3ZpbmdfV2F0ZXJfSWRlbnRpdHlfYW5kX1B1cml0eS5tNGEiLCJpYXQiOjE3NjU0NzEwNzMsImV4cCI6NTI2NTk2NzA3M30.6DzLpihrabU9gIwrwYr9bppQlg2nZlWqNaCADVwNirY",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/The_Chemistry_of_Our_Environment.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9UaGVfQ2hlbWlzdHJ5X29mX091cl9FbnZpcm9ubWVudC5tcDQiLCJpYXQiOjE3NjU4NzAxODEsImV4cCI6NTI2NjM2NjE4MX0.jKlQDvHi6oPM0-MbHkYfrbhkoPNa-ZtOzBCQVXWHaCA",
        subject: "Chemistry",
        summary: "Environmental chemistry covers water treatment, air composition, pollution, and climate change. Key topics include the water treatment process, fractional distillation of air, acid rain formation, the greenhouse effect, and ozone layer depletion by CFCs.",
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
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/How_Carbon_Builds_Life_and_Plastic.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL0hvd19DYXJib25fQnVpbGRzX0xpZmVfYW5kX1BsYXN0aWMubTRhIiwiaWF0IjoxNzY1NDcwMTgxLCJleHAiOjUyNjU5NjYxODF9.1YqEZUZcHLpPBF-7BVuPje_OfMv65EU_FQNFpF0h8nc",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/Organic_Chemistry.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9PcmdhbmljX0NoZW1pc3RyeS5tcDQiLCJpYXQiOjE3NjU4NzAxMDQsImV4cCI6NTI2NjM2NjEwNH0.aLnvV2qklP8es74z5MAa2365hLQOHA-MLIAu0cdqu2Q",
        subject: "Chemistry",
        summary: "Organic chemistry is the study of carbon compounds. Carbon's unique properties (tetravalency, catenation) allow millions of compounds. Key topics include crude oil fractionation, alkanes (saturated), alkenes (unsaturated), combustion, addition reactions, alcohols, and polymers.",
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
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Chemical_Separation_Purity_and_Identification_Techniques.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL0NoZW1pY2FsX1NlcGFyYXRpb25fUHVyaXR5X2FuZF9JZGVudGlmaWNhdGlvbl9UZWNobmlxdWVzLm00YSIsImlhdCI6MTc2NTQ3MDE0NiwiZXhwIjo1MjY1OTY2MTQ2fQ.geDywo9wENvXFpqYZ1yCGYjNsjMCvouczL2eLQ6QlR4",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/Experimental_Techniques.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9FeHBlcmltZW50YWxfVGVjaG5pcXVlcy5tcDQiLCJpYXQiOjE3NjU4Njk5NDIsImV4cCI6NTI2NjM2NTk0Mn0.DhWSK0NLkKVbLPnSefOYZ-YvW6FCxnnr-bC9QQTX72w",
        subject: "Chemistry",
        summary: "Experimental chemistry covers laboratory apparatus, measuring techniques, purity testing using melting/boiling points, separation methods (filtration, crystallisation, distillation, chromatography), and qualitative analysis including tests for cations, anions, and gases.",
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
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/remaing/The_Particulate_Nature_of_Matter.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9yZW1haW5nL1RoZV9QYXJ0aWN1bGF0ZV9OYXR1cmVfb2ZfTWF0dGVyLm1wNCIsImlhdCI6MTc2ODY4Mjk0MiwiZXhwIjo1MjY5MTc4OTQyfQ.dJcjAECqaGJ_OrSGYTHbAr_pT841-ed1DRjYHm6FdWw",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Kinetic_Theory_States_of_Matter_Explained.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL0tpbmV0aWNfVGhlb3J5X1N0YXRlc19vZl9NYXR0ZXJfRXhwbGFpbmVkLm00YSIsImlhdCI6MTc2NTQ3MDI0MiwiZXhwIjo1MjY1OTY2MjQyfQ._HXh5bEmEzGe8jd34j8GoO4I9HOK40iIswemyI5O5sM",
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
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/Stoichiometry__The_Recipe.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9TdG9pY2hpb21ldHJ5X19UaGVfUmVjaXBlLm1wNCIsImlhdCI6MTc2NTg3MDE2MSwiZXhwIjo1MjY2MzY2MTYxfQ.6ttVeW0TsinpTrk_HIIo8UR6AFyVbvJYj3X7WNxWBlA",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/remaining/Counting_Atoms_by_Weighing_Them.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL3JlbWFpbmluZy9Db3VudGluZ19BdG9tc19ieV9XZWlnaGluZ19UaGVtLm00YSIsImlhdCI6MTc2ODY4MTk4OCwiZXhwIjo1MjY5MTc3OTg4fQ.yC55Oarmb98YkgqO5-b5AUkJlN-a5g_f6ErsnlR5Wbw",
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
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Electrolysis_and_the_Four_Conductors.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL0VsZWN0cm9seXNpc19hbmRfdGhlX0ZvdXJfQ29uZHVjdG9ycy5tNGEiLCJpYXQiOjE3NjU0NzAxNjEsImV4cCI6NTI2NTk2NjE2MX0.sxl-oyxt64GLw0rRgQhgPKFb_16ofMBqV9PYg7oomKI",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/Electrochemistry.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9FbGVjdHJvY2hlbWlzdHJ5Lm1wNCIsImlhdCI6MTc2NTg2OTkxOCwiZXhwIjo1MjY2MzY1OTE4fQ.fKL2xNYiSCTg8yeJ960tiBoHiGfeJdo8B-MuwBRxplA",
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
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Bond_Breaking_and_Forming_Energy_Payoff.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL0JvbmRfQnJlYWtpbmdfYW5kX0Zvcm1pbmdfRW5lcmd5X1BheW9mZi5tNGEiLCJpYXQiOjE3NjU0NzAxMjgsImV4cCI6NTI2NTk2NjEyOH0.58DuvE1w_aCjNQUjwGxpQjlhTuaB4l65S_MuKXqHMq4",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/Chemical_Energetics%20(1).mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9DaGVtaWNhbF9FbmVyZ2V0aWNzICgxKS5tcDQiLCJpYXQiOjE3NjU4Njk4OTAsImV4cCI6NTI2NjM2NTg5MH0.y347fd66JwJX0L3JmRTViWAitgWDl3V--aDjDbHfSuI",
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

    "Periodic Table": {
        topic: "Periodic Table",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/Periodic_Table__Chaos_to_Order.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9QZXJpb2RpY19UYWJsZV9fQ2hhb3NfdG9fT3JkZXIubXA0IiwiaWF0IjoxNzY1ODcwMTI1LCJleHAiOjUyNjYzNjYxMjV9.q8Cy-SpEI50mjSdJmABup2QDX_KoDiXc7axR0ge_i4E",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/remaining/The_Ingredients_List_For_The_Universe.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL3JlbWFpbmluZy9UaGVfSW5ncmVkaWVudHNfTGlzdF9Gb3JfVGhlX1VuaXZlcnNlLm00YSIsImlhdCI6MTc2ODY4MjAxNiwiZXhwIjo1MjY5MTc4MDE2fQ.EOQA5c7KYgsIIKdXJ_tjSfeGXmBXUjWOjfnRz02l1jE",
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



    "Chemistry of Environment": {
        topic: "Chemistry of Environment",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Proving_Water_Identity_and_Purity.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL1Byb3ZpbmdfV2F0ZXJfSWRlbnRpdHlfYW5kX1B1cml0eS5tNGEiLCJpYXQiOjE3NjU0NzEwNzMsImV4cCI6NTI2NTk2NzA3M30.6DzLpihrabU9gIwrwYr9bppQlg2nZlWqNaCADVwNirY",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/The_Chemistry_of_Our_Environment.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9UaGVfQ2hlbWlzdHJ5X29mX091cl9FbnZpcm9ubWVudC5tcDQiLCJpYXQiOjE3NjU4NzAxODEsImV4cCI6NTI2NjM2NjE4MX0.jKlQDvHi6oPM0-MbHkYfrbhkoPNa-ZtOzBCQVXWHaCA",
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



    "Experimental Techniques and Chemical Analysis": {
        topic: "Experimental Techniques and Chemical Analysis",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Chemistry%20/Chemical_Separation_Purity_and_Identification_Techniques.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9DaGVtaXN0cnkgL0NoZW1pY2FsX1NlcGFyYXRpb25fUHVyaXR5X2FuZF9JZGVudGlmaWNhdGlvbl9UZWNobmlxdWVzLm00YSIsImlhdCI6MTc2NTQ3MDE0NiwiZXhwIjo1MjY1OTY2MTQ2fQ.geDywo9wENvXFpqYZ1yCGYjNsjMCvouczL2eLQ6QlR4",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Chemistry/Experimental_Techniques.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL0NoZW1pc3RyeS9FeHBlcmltZW50YWxfVGVjaG5pcXVlcy5tcDQiLCJpYXQiOjE3NjU4Njk5NDIsImV4cCI6NTI2NjM2NTk0Mn0.DhWSK0NLkKVbLPnSefOYZ-YvW6FCxnnr-bC9QQTX72w",
        subject: "Chemistry",
        summary: "Mastery of experimental techniques and qualitative analysis is paramount for success in the O-Level Pure Chemistry Practical Examination. These skills form the foundational bedrock of the subject, demanding not only procedural accuracy in handling apparatus and executing experiments but also the diligent memorization of key chemical tests and their corresponding observations.",
        sections: [
            {
                title: "1. Selection and Use of Laboratory Apparatus",
                content: `## The Principle of "Fit for Purpose"

In practical chemistry, the strategic selection of laboratory apparatus is a critical skill. The principle of **"fit for purpose"** dictates that the chosen instrument must match the requirements of the task, particularly concerning the level of precision needed.

> **Examiner's Note:** In a practical examination, choosing an apparatus with the appropriate degree of precision is as important as the measurement itself.

---

## Measuring Volume: A Comparison of Precision

| Apparatus | Primary Use Case | Level of Accuracy | Examiner's Note |
|-----------|------------------|-------------------|-----------------|
| **Beaker** | Holding solutions, carrying out reactions, approximate volume measurements | Low (Approximate) | Suitable for holding reagents but should **never** be used for accurate volume measurement |
| **Measuring Cylinder** | Measuring approximate volumes where high precision is not required | Medium | Use for measuring volumes of reagents for preparations, but not for volumetric analysis like titration |
| **Burette** | Accurately delivering variable volumes of a liquid, most commonly in titrations | High (Precise) | The standard instrument for adding the titrant (e.g., acid) to the flask. Allows for precise volume control |
| **Pipette** | Accurately delivering a fixed, predetermined volume of a liquid | High (Precise) | Essential for measuring the fixed volume of a solution (e.g., alkali) into the conical flask for titration |

---

## Measuring Mass and Time

For accurate measurements of mass and time in the school laboratory, the standard instruments are:

| Quantity | Instrument | Purpose |
|----------|------------|---------|
| **Mass** | Electronic Balance | Provides direct, precise readings of mass in grams |
| **Time** | Stopwatch | Essential for quantitative experiments, such as determining reaction rates |

---

## Methods for the Collection of Gases

The method chosen to collect a gas depends on its physical properties, specifically its **density relative to air** and its **solubility in water**.

| Collection Method | Principle of Use | Suitable Gases |
|-------------------|------------------|----------------|
| **Upward displacement of air** (Downward delivery) | Used for gases that are **heavier (denser) than air**. The gas sinks and pushes the lighter air upwards and out of the gas jar. | Carbon dioxide (CO₂) |
| **Downward displacement of air** (Upward delivery) | Used for gases that are **lighter (less dense) than air**. The gas rises and pushes the heavier air downwards and out. | Ammonia (NH₃), Hydrogen (H₂) |
| **Over water** | Used for gases that are **sparingly soluble in water**. The gas displaces the water from an inverted measuring cylinder or gas jar. | Hydrogen (H₂), Oxygen (O₂) |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Methods of Purification and Assessing Purity",
                content: `## The Importance of Purity

Achieving and verifying the purity of a substance is a fundamental objective in chemistry. The presence of impurities can alter the physical and chemical properties of a substance, leading to unreliable experimental results and potentially unsafe commercial products.

---

## The Criteria of Purity

Melting and boiling points serve as crucial indicators of a substance's purity.

| Substance Type | Melting/Boiling Point Behaviour |
|----------------|--------------------------------|
| **Pure Substance** | Sharp, fixed melting point and boiling point (e.g., pure water boils at exactly 100°C and freezes at 0°C) |
| **Impure Substance** | Melts and boils over a **range** of temperatures, not at a single fixed point |

### Effect of Impurities:
- **Impurities LOWER the melting point** (and cause it to melt over a range)
- **Impurities RAISE the boiling point**

> **Examiner's Note:** Simply stating that 'impurities lower the melting point' is insufficient. For full credit, you must also state that impurities cause the substance to **melt over a range of temperatures**. A sharp, fixed melting point is the definitive characteristic of a pure substance.

---

## Separation and Purification Techniques

### 1. Filtration
**Purpose:** Separate an **insoluble solid** from a liquid

**Process:**
- The mixture is poured through filter paper, which acts as a sieve
- Solid particles (too large to pass through) are trapped and collected as the **residue**
- The liquid that passes through is known as the **filtrate**

---

### 2. Crystallisation
**Purpose:** Obtain a pure **soluble solid** (solute) from its solution

**Principle:** Most soluble solids are less soluble at lower temperatures

**Process:**
1. Heat the solution to evaporate some solvent → creates a saturated solution
2. Cool the solution → solubility decreases
3. Solute forms pure solid crystals
4. Collect crystals by filtration

---

### 3. Simple Distillation
**Purpose:** Separate a **pure solvent** from a solution

**Process:**
1. Heat the solution to boil the solvent (it turns into vapor)
2. Dissolved solutes are left behind
3. Vapor passes through a condenser
4. Vapor cools and condenses back into pure liquid for collection

---

### 4. Fractional Distillation
**Purpose:** Separate a mixture of two or more **miscible liquids** with different boiling points

**Process:**
1. Heat the mixture → liquid with lower boiling point vaporizes first
2. Vapors rise through a **fractionating column**
3. Repeated condensation and vaporization separates the liquids
4. More volatile liquid reaches the top first and is distilled over

**Example:** Separating ethanol (b.p. 78°C) from water (b.p. 100°C)

---

### 5. Paper Chromatography
**Purpose:** Separate a mixture of substances based on differing solubilities and attraction to paper

**Process:**
1. Solvent moves up the paper by capillary action
2. Dissolved substances are carried at different rates
3. Substances separate into distinct spots

**Identifying Purity:**
- **Pure substance** = produces only ONE spot
- **Impure substance** = produces MULTIPLE spots

### The Rf (Retention Factor) Value:

$$R_f = \\frac{\\text{Distance travelled by spot}}{\\text{Distance travelled by solvent front}}$$

Each substance has a characteristic Rf value under specific conditions.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Qualitative Analysis: Testing for Cations",
                content: `## The Logic of Ion Testing

Qualitative Analysis is a systematic, investigative process used to identify the presence of specific ions in an unknown substance. It involves prescribed chemical tests that produce distinct and observable results, such as:
- Formation of a **precipitate**
- A **colour change**
- Evolution of a **gas**

---

## Testing for Cations (Positive Ions)

The standard tests for identifying common cations use **aqueous sodium hydroxide (NaOH)** and **aqueous ammonia (NH₃)**.

| Cation | Test with Aqueous NaOH | Test with Aqueous Ammonia |
|--------|------------------------|---------------------------|
| **Copper(II) Cu²⁺** | **Light blue precipitate** forms, **insoluble** in excess NaOH | **Light blue precipitate** forms, **dissolves in excess** ammonia to form a **dark blue solution** |
| **Iron(II) Fe²⁺** | **Green precipitate** forms, **insoluble** in excess NaOH | **Green precipitate** forms, **insoluble** in excess ammonia |
| **Iron(III) Fe³⁺** | **Red-brown precipitate** forms, **insoluble** in excess NaOH | **Red-brown precipitate** forms, **insoluble** in excess ammonia |
| **Aluminium Al³⁺** | **White precipitate** forms, **soluble in excess** NaOH to form a **colourless solution** | **White precipitate** forms, **insoluble** in excess ammonia |
| **Zinc Zn²⁺** | **White precipitate** forms, **soluble in excess** NaOH to form a **colourless solution** | **White precipitate** forms, **soluble in excess** ammonia to form a **colourless solution** |
| **Calcium Ca²⁺** | **White precipitate** forms, **insoluble** in excess NaOH | **No precipitate**, or very slight white precipitate |
| **Ammonium NH₄⁺** | Add NaOH and **heat gently**. Ammonia gas evolved → turns **damp red litmus paper blue** | No reaction |

---

## Memory Tips for Cation Tests

### Precipitate Colours:
- **Blue** = Copper(II)
- **Green** = Iron(II)
- **Red-brown** = Iron(III)
- **White** = Aluminium, Zinc, Calcium

### Solubility in Excess NaOH:
- **Dissolves** = Aluminium, Zinc (amphoteric hydroxides)
- **Does NOT dissolve** = Copper, Iron(II), Iron(III), Calcium

### Solubility in Excess Ammonia:
- **Dissolves** to give **dark blue** = Copper(II)
- **Dissolves** to give **colourless** = Zinc
- **All others** = Insoluble`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Qualitative Analysis: Testing for Anions",
                content: `## Testing for Anions (Negative Ions)

The identification of anions follows a set of specific tests with predictable positive results.

---

### Carbonate (CO₃²⁻)

| Test | Observation | Ionic Equation |
|------|-------------|----------------|
| Add a **dilute acid** (e.g., HCl) | **Effervescence** (fizzing) observed. Gas produced turns **limewater milky/cloudy** | CO₃²⁻(aq) + 2H⁺(aq) → H₂O(l) + CO₂(g) |

---

### Halide Ions: Chloride, Bromide, Iodide

> **IMPORTANT:** Always **acidify with dilute nitric acid first**, then add aqueous silver nitrate.

| Halide Ion | Precipitate Colour | Ionic Equation |
|------------|-------------------|----------------|
| **Chloride (Cl⁻)** | **White** precipitate of silver chloride | Ag⁺(aq) + Cl⁻(aq) → AgCl(s) |
| **Bromide (Br⁻)** | **Cream** precipitate of silver bromide | Ag⁺(aq) + Br⁻(aq) → AgBr(s) |
| **Iodide (I⁻)** | **Yellow** precipitate of silver iodide | Ag⁺(aq) + I⁻(aq) → AgI(s) |

> **Examiner's Note:** A common error is to forget the initial acidification with dilute nitric acid. This step is crucial because it removes interfering ions, such as carbonate ions, which would also form a precipitate with silver nitrate, leading to a **false positive result**. Marks are consistently lost for this omission.

---

### Sulfate (SO₄²⁻)

| Test | Observation | Ionic Equation |
|------|-------------|----------------|
| Acidify with dilute acid (e.g., HCl or HNO₃), then add **aqueous barium nitrate** or **barium chloride** | **White precipitate** of barium sulfate forms | Ba²⁺(aq) + SO₄²⁻(aq) → BaSO₄(s) |

---

### Nitrate (NO₃⁻)

| Test | Observation |
|------|-------------|
| Add **aqueous sodium hydroxide** and a piece of **aluminium foil**, then **warm gently** | **Ammonia gas** is produced, which turns **damp red litmus paper blue** |

**Ionic Equation:**
8Al(s) + 3NO₃⁻(aq) + 5OH⁻(aq) + 2H₂O(l) → 8AlO₂⁻(aq) + 3NH₃(g)

---

## Summary Table: Anion Tests

| Anion | Reagent(s) | Positive Result |
|-------|------------|-----------------|
| **CO₃²⁻** | Dilute acid | Effervescence, gas turns limewater milky |
| **Cl⁻** | Dilute HNO₃ + AgNO₃ | White precipitate |
| **Br⁻** | Dilute HNO₃ + AgNO₃ | Cream precipitate |
| **I⁻** | Dilute HNO₃ + AgNO₃ | Yellow precipitate |
| **SO₄²⁻** | Dilute acid + BaCl₂/Ba(NO₃)₂ | White precipitate |
| **NO₃⁻** | NaOH + Al foil + heat | Ammonia gas (turns red litmus blue) |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Identification of Common Laboratory Gases",
                content: `## Confirmatory Gas Tests

When a chemical test results in the evolution of a gas, a secondary confirmatory test is required to positively identify it.

---

## Summary of Gas Tests

| Gas | Formula | Test | Positive Result |
|-----|---------|------|-----------------|
| **Ammonia** | NH₃ | Hold damp red litmus paper at the mouth of the tube | Litmus paper turns **blue** |
| **Carbon Dioxide** | CO₂ | Bubble through limewater (calcium hydroxide solution) | Limewater turns **milky/cloudy** |
| **Chlorine** | Cl₂ | Hold damp litmus paper at the mouth of the tube | Litmus paper is **bleached white** |
| **Hydrogen** | H₂ | Hold a **lighted splint** at the mouth of the tube | Gas burns with a **'squeaky pop'** sound |
| **Oxygen** | O₂ | Insert a **glowing splint** into the tube | Splint **relights** |

---

## Important Safety Notes

⚠️ **Chlorine (Cl₂)** is a **poisonous gas**. Always perform tests in a fume cupboard or well-ventilated area.

⚠️ **Hydrogen (H₂)** is **flammable**. Test only small quantities.

---

## Distinguishing Between Gases: Quick Reference

| Property | Ammonia | Carbon Dioxide | Chlorine | Hydrogen | Oxygen |
|----------|---------|----------------|----------|----------|--------|
| **Colour** | Colourless | Colourless | Yellow-green | Colourless | Colourless |
| **Smell** | Pungent | Odourless | Choking/bleach | Odourless | Odourless |
| **Density vs Air** | Lighter | Heavier | Heavier | Much lighter | Slightly heavier |
| **Solubility** | Very soluble | Slightly soluble | Soluble | Sparingly soluble | Sparingly soluble |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Volumetric Analysis: Titration",
                content: `## The Purpose of Titration

Acid-base titration is a fundamental **quantitative technique** used to determine the exact concentration of a solution by reacting it with a solution of known concentration. The procedure demands:
- Careful technique
- Precise volume measurements using a burette and pipette
- Correct use of an acid-base indicator

---

## Step-by-Step Titration Procedure

### Step 1: Preparation
Use a **pipette** to accurately measure a fixed volume (e.g., 25.0 cm³) of the alkali and transfer it into a clean **conical flask**.

### Step 2: Add Indicator
Add **2-3 drops** of a suitable indicator (e.g., methyl orange) to the alkali in the conical flask.

### Step 3: Apparatus Setup
Place the conical flask on a **white tile** directly beneath the burette. The white background makes the colour change at the end-point easier to see.

### Step 4: Initial Reading
Fill the burette with the acid, ensuring the space below the tap is filled. Record the **initial volume reading** to **two decimal places**.

### Step 5: Titration
Add the acid from the burette to the flask **gradually** while **continuously swirling** the flask to ensure the solutions mix thoroughly.

### Step 6: End-Point
**Stop adding acid** at the exact moment the indicator shows a **permanent colour change**. This is the **end-point** of the titration.

### Step 7: Final Reading
Record the **final volume reading** from the burette. The volume of acid added (the **titre**) is calculated by:

$$\\text{Titre} = \\text{Final Reading} - \\text{Initial Reading}$$

### Step 8: Repeatability
Repeat the entire titration at least **two more times**. Consistent results (titres within **0.20 cm³** of each other) are known as **concordant results** and are used to calculate an average.

---

## Choice of Indicators

The choice of indicator is important for accurately determining the end-point.

| Indicator | Colour in Alkali | Colour at End-Point (Acid Added) | Suitable For |
|-----------|------------------|----------------------------------|--------------|
| **Methyl Orange** | Yellow | Orange/Red | Strong acid + Strong/Weak alkali |
| **Phenolphthalein** | Pink | Colourless | Strong alkali + Strong/Weak acid |

---

## Common Errors in Titration

| Error | Effect on Results |
|-------|-------------------|
| Air bubbles in burette | Inaccurate volume reading |
| Not swirling flask | Incomplete mixing, false end-point |
| Over-running end-point | Titre too high |
| Reading burette at wrong angle (parallax) | Inaccurate volume reading |
| Not rinsing equipment properly | Contamination |

---

## Calculating Concentration from Titration

Using the formula:

$$\\text{moles} = \\text{concentration (mol/dm³)} \\times \\text{volume (dm³)}$$

**Remember:** Volume in cm³ ÷ 1000 = Volume in dm³`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Choose apparatus based on 'fit for purpose' principle - burette and pipette for precise measurements",
            "Pure substances have sharp, fixed melting and boiling points",
            "Impurities LOWER melting point (with range) and RAISE boiling point",
            "Filtration separates insoluble solid from liquid; crystallisation obtains pure soluble solid",
            "Simple distillation separates solvent from solution; fractional distillation separates miscible liquids",
            "Rf value = Distance by spot ÷ Distance by solvent front",
            "Cation tests use NaOH(aq) and NH₃(aq) - note precipitate colours and solubility in excess",
            "Copper gives dark blue solution in excess ammonia; Al and Zn dissolve in excess NaOH",
            "For halide tests: ALWAYS acidify with HNO₃ first, then add AgNO₃",
            "Halide precipitates: Cl⁻ = white, Br⁻ = cream, I⁻ = yellow",
            "Gas tests: H₂ = squeaky pop, O₂ = relights splint, CO₂ = milky limewater, NH₃ = blue litmus",
            "Titration requires concordant results (within 0.20 cm³) for reliable average"
        ],
        exam_tips: [
            "Always state the accuracy level when selecting apparatus - examiners want to see you understand precision",
            "When testing for purity, mention BOTH the lowered melting point AND the range of temperatures",
            "For chromatography questions, always calculate and show the Rf value calculation",
            "In cation tests, clearly state the precipitate colour AND what happens in excess reagent",
            "NEVER forget to acidify with dilute nitric acid before adding silver nitrate for halide tests",
            "For gas tests, state both the test AND the expected observation",
            "In titration, emphasize concordant results and the importance of swirling",
            "Always record burette readings to TWO decimal places",
            "Know the ionic equations for precipitation reactions - examiners often ask for these"
        ]
    },














};
