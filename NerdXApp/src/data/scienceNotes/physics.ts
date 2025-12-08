// Physics Notes - All 5 Topics for ZIMSEC Combined Science
import { TopicNotes } from './types';

// List of all Physics topics (matching constants.py)
export const physicsTopics: string[] = [
    "Motion, Forces and Energy",
    "Thermal Physics",
    "Waves",
    "Electricity",
    "Nuclear Physics"
];

// Complete notes for each Physics topic
export const physicsNotes: Record<string, TopicNotes> = {
    "Motion, Forces and Energy": {
        topic: "Motion, Forces and Energy",
        subject: "Physics",
        summary: "This topic covers the fundamentals of motion, forces, and energy including speed, velocity, acceleration, Newton's laws, and the different forms of energy.",
        sections: [
            {
                title: "1. Speed, Distance, and Time",
                content: `## Speed

**Speed** is the distance traveled per unit time.

### Formula:
**Speed = Distance ÷ Time**

s = d / t

### Units:
- Speed: meters per second (m/s) or km/h
- Distance: meters (m) or kilometers (km)
- Time: seconds (s) or hours (h)

### Example:
A car travels 100m in 5 seconds.
Speed = 100 ÷ 5 = 20 m/s

## Velocity

**Velocity** is speed in a specific direction (vector quantity).
- Speed = magnitude only (scalar)
- Velocity = magnitude AND direction (vector)

## Acceleration

**Acceleration** is the rate of change of velocity.

### Formula:
**Acceleration = (Final velocity - Initial velocity) ÷ Time**

a = (v - u) / t

### Units:
- Acceleration: m/s²

### Deceleration:
- Negative acceleration
- Object is slowing down`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Forces",
                content: `## What is a Force?

A **force** is a push or pull that can change an object's:
- Speed (faster or slower)
- Direction
- Shape

### Units:
Force is measured in **Newtons (N)**

## Newton's Laws:

### First Law (Inertia):
An object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless acted on by an unbalanced force.

### Second Law:
Force = Mass × Acceleration
**F = ma**

### Third Law:
For every action, there is an equal and opposite reaction.

## Types of Forces:

**Weight:** Force due to gravity (W = mg)
**Friction:** Opposes motion
**Normal/Reaction:** Perpendicular to surface
**Tension:** Force in a stretched string
**Air Resistance:** Friction with air

## Balanced and Unbalanced Forces:

**Balanced forces (resultant = 0):**
- No change in motion
- Object at rest OR constant velocity

**Unbalanced forces (resultant ≠ 0):**
- Object accelerates
- Changes speed or direction`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Energy",
                content: `## Forms of Energy

1. **Kinetic Energy (KE)** - energy of movement
2. **Potential Energy (PE)** - stored energy
   - Gravitational PE
   - Elastic PE
   - Chemical PE
3. **Thermal Energy** - heat energy
4. **Light Energy**
5. **Sound Energy**
6. **Electrical Energy**
7. **Nuclear Energy**

## Energy Formulas:

### Kinetic Energy:
KE = ½mv²
(m = mass, v = velocity)

### Gravitational Potential Energy:
GPE = mgh
(m = mass, g = gravity, h = height)

## Work Done:

**Work = Force × Distance**
W = F × d

### Units:
- Work is measured in Joules (J)
- 1 J = 1 N × 1 m

## Power:

**Power = Work ÷ Time**
P = W / t

### Units:
- Power is measured in Watts (W)
- 1 W = 1 J/s

## Conservation of Energy:

Energy cannot be created or destroyed, only transformed from one form to another.

Total energy before = Total energy after`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Speed = distance ÷ time (m/s)",
            "Velocity is speed with direction",
            "Acceleration = change in velocity ÷ time (m/s²)",
            "Force = mass × acceleration (F = ma)",
            "Newton's 3rd Law: Every action has equal and opposite reaction",
            "KE = ½mv², GPE = mgh",
            "Work = Force × Distance",
            "Power = Work ÷ Time (Watts)",
            "Energy is conserved - only transformed"
        ],
        exam_tips: [
            "Always include units in your answers",
            "Draw force diagrams clearly with arrows",
            "Check if forces are balanced or unbalanced",
            "Use correct formulas and rearrange if needed"
        ]
    },

    "Thermal Physics": {
        topic: "Thermal Physics",
        subject: "Physics",
        summary: "Thermal physics covers heat energy, temperature, and heat transfer. It explains how heat moves and affects matter.",
        sections: [
            {
                title: "1. Heat and Temperature",
                content: `## Temperature

**Temperature** is a measure of how hot or cold something is (average kinetic energy of particles).

### Units:
- Celsius (°C)
- Kelvin (K): K = °C + 273

## Heat Energy

**Heat** is thermal energy transferred from hot to cold objects.
- Heat flows from HIGH to LOW temperature
- Continues until thermal equilibrium

### Units:
- Heat is measured in Joules (J)

## Specific Heat Capacity

The energy needed to raise the temperature of 1 kg of a substance by 1°C.

### Formula:
**Q = mcΔT**

Where:
- Q = heat energy (J)
- m = mass (kg)
- c = specific heat capacity (J/kg°C)
- ΔT = change in temperature (°C)

### Example Values:
- Water: c = 4200 J/kg°C (high)
- Copper: c = 390 J/kg°C (low)

Water's high specific heat capacity means it:
- Heats up slowly
- Cools down slowly
- Good for storing heat`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Heat Transfer",
                content: `## Three Methods of Heat Transfer

### 1. Conduction

Heat transfer through a material by vibrating particles.
- Particles vibrate and pass energy to neighbors
- Best in solids (particles close together)
- Metals are best conductors (have free electrons)
- Insulators are poor conductors (wood, plastic, air)

### 2. Convection

Heat transfer by the movement of fluid (liquid or gas).
- Hot fluid rises (less dense)
- Cold fluid sinks (more dense)
- Creates convection currents
- Cannot occur in solids

**Examples:**
- Sea breezes
- Heating a room
- Water in a kettle

### 3. Radiation

Heat transfer by electromagnetic waves.
- Does not need a medium
- Can travel through vacuum (space)
- All objects emit radiation
- Hotter objects emit more radiation

**Surfaces:**
- Dark, matt surfaces: good absorbers AND emitters
- Light, shiny surfaces: poor absorbers AND emitters, good reflectors

**Example:** Thermos flask:
- Vacuum: prevents conduction and convection
- Silvered surfaces: reduce radiation`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Heat flows from hot to cold until equilibrium",
            "Q = mcΔT (heat = mass × specific heat capacity × temp change)",
            "Conduction: through material (best in solids/metals)",
            "Convection: by fluid movement (liquids and gases)",
            "Radiation: electromagnetic waves (can travel through vacuum)",
            "Dark matt surfaces are good absorbers and emitters",
            "Shiny surfaces are good reflectors"
        ],
        exam_tips: [
            "Explain each heat transfer method with particle movement",
            "Know how to reduce heat loss (insulation)",
            "Use examples like thermos flask to explain applications"
        ]
    },

    "Waves": {
        topic: "Waves",
        subject: "Physics",
        summary: "Waves transfer energy without transferring matter. This topic covers wave properties, types of waves, and wave phenomena.",
        sections: [
            {
                title: "1. Wave Properties",
                content: `## What is a Wave?

A **wave** is a disturbance that transfers energy from one place to another without transferring matter.

## Wave Properties:

**Amplitude (A):** Maximum displacement from rest position (meters)
**Wavelength (λ):** Distance between two consecutive points in phase (meters)
**Frequency (f):** Number of waves per second (Hertz, Hz)
**Period (T):** Time for one complete wave (seconds)
**Wave speed (v):** How fast the wave travels (m/s)

## Wave Equation:

**v = f × λ**

Wave speed = frequency × wavelength

## Types of Waves:

### Transverse Waves:
- Oscillations perpendicular to direction of travel
- Examples: Light, water waves, electromagnetic waves
- Can be polarized

### Longitudinal Waves:
- Oscillations parallel to direction of travel
- Examples: Sound waves
- Have compressions and rarefactions
- Cannot be polarized`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Sound and Light",
                content: `## Sound Waves

- Longitudinal waves
- Need a medium (cannot travel through vacuum)
- Speed depends on medium:
  - Air: ~340 m/s
  - Water: ~1500 m/s
  - Solids: fastest

### Pitch and Volume:
- **Pitch** = frequency (higher frequency = higher pitch)
- **Loudness** = amplitude (larger amplitude = louder)

### Echoes:
Sound reflected off surfaces
- Used in SONAR and medical imaging

## Light and the EM Spectrum

Light is a transverse electromagnetic wave.

### Electromagnetic Spectrum (in order):
1. Radio waves (longest wavelength)
2. Microwaves
3. Infrared
4. Visible light (ROYGBIV)
5. Ultraviolet
6. X-rays
7. Gamma rays (shortest wavelength)

### All EM waves:
- Travel at speed of light (3 × 10⁸ m/s)
- Are transverse
- Can travel through vacuum

## Reflection and Refraction:

### Reflection:
- Angle of incidence = Angle of reflection
- Law of reflection

### Refraction:
- Light bends when entering different medium
- Towards normal when slowing down
- Away from normal when speeding up`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Waves transfer energy, not matter",
            "v = fλ (wave speed = frequency × wavelength)",
            "Transverse: oscillations perpendicular to travel",
            "Longitudinal: oscillations parallel to travel",
            "Sound needs a medium; light does not",
            "Angle of incidence = Angle of reflection",
            "Light refracts when changing medium",
            "EM spectrum: Radio → Microwave → IR → Visible → UV → X-ray → Gamma"
        ],
        exam_tips: [
            "Label wave diagrams clearly (amplitude, wavelength)",
            "Use the wave equation correctly",
            "Draw ray diagrams for reflection and refraction",
            "Know uses and dangers of each EM wave type"
        ]
    },

    "Electricity": {
        topic: "Electricity",
        subject: "Physics",
        summary: "Electricity is the flow of electric charge. This topic covers circuits, current, voltage, resistance, and electrical power.",
        sections: [
            {
                title: "1. Electric Circuits",
                content: `## Current

**Current** is the rate of flow of electric charge.

### Formula:
I = Q / t
Current = Charge ÷ Time

### Units:
- Current: Amperes (A)
- Charge: Coulombs (C)
- Time: seconds (s)

### Conventional current:
- Flows from positive to negative
- Electrons actually flow negative to positive

## Voltage (Potential Difference)

**Voltage** is the energy transferred per unit charge.

### Units:
- Voltage: Volts (V)

## Resistance

**Resistance** opposes the flow of current.

### Units:
- Resistance: Ohms (Ω)

## Ohm's Law:

**V = IR**
Voltage = Current × Resistance

### Rearranged:
- I = V / R
- R = V / I`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Series and Parallel Circuits",
                content: `## Series Circuits

Components connected in a single loop.

### Properties:
- Same current throughout: I₁ = I₂ = I₃
- Voltage is shared: V = V₁ + V₂ + V₃
- Total resistance: R = R₁ + R₂ + R₃
- If one component breaks, circuit stops

## Parallel Circuits

Components connected in separate branches.

### Properties:
- Voltage same across each branch: V₁ = V₂ = V₃
- Current is shared: I = I₁ + I₂ + I₃
- Total resistance: 1/R = 1/R₁ + 1/R₂ + 1/R₃
- If one branch breaks, others still work

## Electrical Power

**Power** is the rate of energy transfer.

### Formulas:
P = IV (Power = Current × Voltage)
P = I²R
P = V²/R

### Units:
- Power: Watts (W)

## Energy

**Energy = Power × Time**
E = Pt

### Units:
- Energy: Joules (J)
- Or kilowatt-hours (kWh) for domestic use

**1 kWh = 1000 W × 1 hour**`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Current = charge ÷ time (I = Q/t)",
            "Ohm's Law: V = IR",
            "Series: same current, voltage shared, R = R₁ + R₂",
            "Parallel: same voltage, current shared, 1/R = 1/R₁ + 1/R₂",
            "Power: P = IV = I²R = V²/R",
            "Energy: E = Pt",
            "1 kWh = 1000W for 1 hour"
        ],
        exam_tips: [
            "Draw circuit diagrams with correct symbols",
            "Use Ohm's Law correctly in calculations",
            "Know the differences between series and parallel",
            "Calculate power and energy for domestic appliances"
        ]
    },

    "Nuclear Physics": {
        topic: "Nuclear Physics",
        subject: "Physics",
        summary: "Nuclear physics covers atomic structure, radioactivity, and nuclear reactions. Understanding radiation helps us use it safely.",
        sections: [
            {
                title: "1. Atomic Structure",
                content: `## The Atom

### Parts of an Atom:

**Nucleus (center):**
- Protons (positive charge, mass = 1)
- Neutrons (no charge, mass = 1)
- Contains most of atom's mass

**Electron cloud:**
- Electrons (negative charge, mass ≈ 0)
- Orbit the nucleus
- Equal to protons in neutral atom

### Atomic Numbers:

**Atomic Number (Z):** Number of protons
**Mass Number (A):** Protons + Neutrons
**Neutrons = Mass Number - Atomic Number**

### Isotopes:

Atoms of same element with different numbers of neutrons.
- Same atomic number
- Different mass number

**Example:** Carbon-12 and Carbon-14
- Both have 6 protons
- C-12 has 6 neutrons
- C-14 has 8 neutrons`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Radioactivity",
                content: `## Types of Radiation

### Alpha (α) Radiation:
- 2 protons + 2 neutrons (helium nucleus)
- Charge: +2
- Mass: 4
- Ionizing power: HIGH
- Penetrating power: LOW (stopped by paper)

### Beta (β) Radiation:
- Fast-moving electron
- Charge: -1
- Mass: ~0
- Ionizing power: MEDIUM
- Penetrating power: MEDIUM (stopped by aluminum)

### Gamma (γ) Radiation:
- Electromagnetic wave
- Charge: 0
- Mass: 0
- Ionizing power: LOW
- Penetrating power: HIGH (reduced by lead/concrete)

## Half-Life

**Half-life** is the time taken for half of radioactive atoms to decay.

### Properties:
- Different for each isotope
- Cannot be changed
- Random process

### Uses of Radioactivity:
- Medical imaging and treatment
- Carbon dating
- Smoke detectors
- Sterilization
- Power generation

### Dangers:
- Can damage cells
- Causes cancer
- Must be used safely`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Atoms: protons (+), neutrons (0), electrons (-)",
            "Atomic number = protons, Mass number = protons + neutrons",
            "Isotopes: same protons, different neutrons",
            "Alpha: heaviest, most ionizing, least penetrating",
            "Beta: medium ionizing and penetrating",
            "Gamma: least ionizing, most penetrating",
            "Half-life: time for half of atoms to decay",
            "Uses: medical, dating, detectors, power"
        ],
        exam_tips: [
            "Know properties of each radiation type",
            "Compare ionizing and penetrating power",
            "Calculate half-life problems",
            "Give uses and safety precautions for radiation"
        ]
    }
};
