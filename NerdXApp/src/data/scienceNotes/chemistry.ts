// Chemistry Notes - All 11 Topics for ZIMSEC Combined Science
import { TopicNotes } from './types';

// List of all Chemistry topics (matching constants.py)
export const chemistryTopics: string[] = [
    "Experimental Chemistry",
    "Particulate Nature of Matter",
    "Formulae and Stoichiometry",
    "Electrolysis",
    "Energy from Chemicals",
    "Chemical Reactions",
    "Acids, Bases and Salts",
    "Periodic Table",
    "Metals",
    "Chemistry of Environment",
    "Organic Chemistry"
];

// Complete notes for each Chemistry topic
export const chemistryNotes: Record<string, TopicNotes> = {
    "Experimental Chemistry": {
        topic: "Experimental Chemistry",
        subject: "Chemistry",
        summary: "Laboratory safety, apparatus, and experimental techniques are fundamental to studying chemistry. This topic covers the safe handling of chemicals, common apparatus, and basic experimental procedures.",
        sections: [
            {
                title: "1. Laboratory Safety",
                content: `## Safety Rules

### General Safety:
- Always wear safety goggles and lab coat
- Never eat, drink, or taste chemicals
- Report all accidents immediately
- Know the location of safety equipment

### Hazard Symbols:
- **Flammable** - catches fire easily
- **Corrosive** - destroys living tissue and materials
- **Toxic** - poisonous
- **Irritant** - causes redness or blisters
- **Oxidizing** - provides oxygen for fire
- **Harmful** - can cause health problems

### Handling Chemicals:
- Always read labels before use
- Never point test tubes at anyone
- Use fume cupboard for toxic gases
- Wash hands after experiments`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Common Apparatus",
                content: `## Laboratory Equipment

### Measuring Volume:
- **Measuring cylinder** - accurate volume measurement
- **Burette** - very accurate, for titrations
- **Pipette** - fixed accurate volumes
- **Beaker** - approximate volumes

### Heating:
- **Bunsen burner** - most common heat source
- **Tripod and gauze** - support beakers over flame
- **Evaporating dish** - concentrate solutions
- **Test tube** - small-scale reactions

### Separation:
- **Filter funnel and paper** - separate solids from liquids
- **Separating funnel** - separate immiscible liquids
- **Condenser** - for distillation

### Safety Equipment:
- Safety goggles
- Fire extinguisher
- Fire blanket
- Eye wash station
- First aid kit`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Always wear safety goggles and lab coat",
            "Know the hazard symbols and their meanings",
            "Use a measuring cylinder for accurate liquid volumes",
            "Bunsen burner has two flames: safety (yellow) and heating (blue)",
            "Never heat a closed container",
            "Filter paper separates insoluble solids from liquids"
        ],
        exam_tips: [
            "Learn all hazard symbols and what they mean",
            "Know the names and uses of common apparatus",
            "Describe safety precautions in practical questions"
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

    "Chemical Reactions": {
        topic: "Chemical Reactions",
        subject: "Chemistry",
        summary: "Chemical reactions involve the rearrangement of atoms. This topic covers types of reactions, rates, and factors affecting reaction rate.",
        sections: [
            {
                title: "1. Types of Chemical Reactions",
                content: `## Common Reaction Types

### Combination (Synthesis):
A + B → AB
Example: 2Mg + O₂ → 2MgO

### Decomposition:
AB → A + B
Example: CaCO₃ → CaO + CO₂

### Displacement:
A + BC → AC + B
Example: Zn + CuSO₄ → ZnSO₄ + Cu

### Neutralization:
Acid + Base → Salt + Water
Example: HCl + NaOH → NaCl + H₂O

### Combustion:
Fuel + O₂ → CO₂ + H₂O + Energy
Example: CH₄ + 2O₂ → CO₂ + 2H₂O

### Redox (Oxidation-Reduction):
Involves electron transfer
- Oxidation = loss of electrons
- Reduction = gain of electrons`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Rates of Reaction",
                content: `## Collision Theory

For a reaction to occur:
1. Particles must COLLIDE
2. With enough ENERGY (activation energy)
3. In the correct ORIENTATION

### Factors Affecting Rate:

**1. Temperature:**
- Higher temperature → faster particles → more collisions → faster rate

**2. Concentration:**
- Higher concentration → more particles → more collisions → faster rate

**3. Surface Area:**
- Larger surface area → more exposed particles → more collisions → faster rate
- Powder reacts faster than lumps

**4. Catalyst:**
- Lowers activation energy
- Provides alternative pathway
- Not used up in reaction

**5. Pressure (for gases):**
- Higher pressure → particles closer → more collisions → faster rate`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Know the five main types of reactions",
            "Collision theory explains reaction rates",
            "Higher temperature, concentration, surface area = faster rate",
            "Catalysts lower activation energy",
            "Catalysts are not used up in reactions"
        ],
        exam_tips: [
            "Use collision theory to explain rate changes",
            "Give examples for each factor affecting rate",
            "Draw graphs showing rate with and without catalyst"
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
