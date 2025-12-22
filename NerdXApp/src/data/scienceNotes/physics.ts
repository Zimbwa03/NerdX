// Physics Notes - All 10 Topics for ZIMSEC O-Level Combined Science
import { TopicNotes } from './types';

// List of all Physics topics (matching constants.py) - ZIMSEC O-Level Syllabus
export const physicsTopics: string[] = [
    // Measurement & Mechanics
    "Measurement and Physical Quantities",
    "Kinematics (Speed, Velocity, Acceleration, Graphs of Motion)",
    "Forces (Including Machines, Turning Effects, Friction, and Mechanical Structures)",
    "Work, Energy and Power",
    // Thermal & Waves
    "Thermal Physics (Kinetic Theory, Thermal Properties, Heat Transfer)",
    "Waves (General Wave Properties, Optics, Sound)",
    // Electricity & Magnetism
    "Electricity (Current Electricity, Circuits)",
    "Magnetism and Electromagnetism",
    // Electronics & Modern Physics
    "Electronics (Logic Gates, Components)",
    "Atomic and Nuclear Physics (Modern Physics)"
];

// Complete notes for each Physics topic
export const physicsNotes: Record<string, TopicNotes> = {
    "Measurement and Physical Quantities": {
        topic: "Measurement and Physical Quantities",
        subject: "Physics",
        summary: "This topic covers the fundamental concepts of physical quantities, SI units, and measurement techniques. It includes the use of precision instruments like vernier calipers and micrometers, time measurement using pendulums, and the distinction between mass and weight. Understanding accurate measurement is essential for all experimental physics.",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/From_SI_Units_to_Micrometer_Precision.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL0Zyb21fU0lfVW5pdHNfdG9fTWljcm9tZXRlcl9QcmVjaXNpb24ubTRhIiwiaWF0IjoxNzY1NjAxMDY2LCJleHAiOjUyNjYwOTcwNjZ9.8fuO1vBYaVh5Q01J4_f_CJ1Qhs2wFvZs3L7re5rSSuw",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/The_Language_of_Physics.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvVGhlX0xhbmd1YWdlX29mX1BoeXNpY3MubXA0IiwiaWF0IjoxNzY1Nzk3MzQ3LCJleHAiOjUyNjYyOTMzNDd9.2dd9hRzHol6avdWy2nP4Yt-OMS0e947Lud3VUAczz-o",
        sections: [
            {
                title: "1. Physical Quantities and Units",
                content: `## A. Definition and Nature

**Physical Quantity:** A physical quantity is any feature, property, or characteristic of an object or phenomenon that can be quantified (measured) and expressed numerically.

Unlike qualitative descriptions (e.g., "hot," "heavy"), physical quantities provide precise, standardized data (e.g., "300 Kelvin," "50 kilograms").

### Structure of a Measurement
A complete measurement consists of two essential parts:
- **Numerical Magnitude:** The number representing the size or amount
- **Unit:** The standard reference used for comparison

**Example:** If you state a length is "5.0", it is meaningless without the unit. "5.0 metres" gives specific scientific meaning.

## B. Base Quantities and SI Units

The scientific community uses the **International System of Units (SI Units)** for global consistency.

| Base Quantity | SI Unit | Symbol | Definition Note |
|---------------|---------|--------|-----------------|
| **Length** | metre | m | Distance light travels in vacuum in 1/299,792,458 of a second |
| **Mass** | kilogram | kg | Amount of matter in an object (only base unit with prefix 'kilo') |
| **Time** | second | s | Defined by radiation frequency of Caesium-133 atoms |
| **Electric Current** | ampere | A | Rate of flow of electric charge |
| **Temperature** | kelvin | K | Based on absolute zero and triple point of water |

## C. Derived Quantities

**Definition:** Quantities calculated by combining two or more base quantities through multiplication or division.

| Derived Quantity | Derivation | Unit |
|------------------|------------|------|
| **Area** | length × length | m² |
| **Volume** | length × width × height | m³ |
| **Speed** | distance ÷ time | m/s |
| **Density** | mass ÷ volume | kg/m³ |
| **Force (Newton)** | mass × acceleration | kg·m/s² |

## D. Prefixes (Standard Form)

Prefixes allow us to express very large or very small values concisely.

| Prefix | Symbol | Factor | Scientific Notation | Example |
|--------|--------|--------|---------------------|---------|
| Giga | G | 1,000,000,000 | 10⁹ | Gigabytes, GHz |
| Mega | M | 1,000,000 | 10⁶ | Megawatts |
| Kilo | k | 1,000 | 10³ | km, kg |
| Centi | c | 0.01 | 10⁻² | cm |
| Milli | m | 0.001 | 10⁻³ | mm, mg |
| Micro | μ | 0.000001 | 10⁻⁶ | Biological cells |
| Nano | n | 0.000000001 | 10⁻⁹ | Wavelength of light |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Measurement of Length",
                content: `## A. Metre Rule / Tape Measure

**Application:** Used for medium lengths (tables, rooms, wires)
**Range:** 0-100 cm (metre rule); several metres (tape measure)
**Precision:** Smallest division is usually 1 mm (0.1 cm)

### Critical Precautions:

**Parallax Error:** Occurs when eye is not directly in line with reading
- **Correction:** Place eye perpendicular (90°) to scale mark
- Place rule's edge directly against object

**Zero Error:** Ends of wooden rules often wear down
- **Correction:** Start from 1.0 cm mark and subtract from final reading

## B. Vernier Calipers

Designed for precision measurements smaller than a millimetre.

### Uses:
- **External Jaws:** Outer diameter of cylinder or sphere
- **Internal Jaws:** Inner diameter of test tube or ring
- **Tail/Depth Probe:** Depth of hole or beaker

**Precision:** Typically 0.1 mm or 0.01 cm

### Reading Technique:
1. **Main Scale:** Read value immediately left of Vernier '0' mark (e.g., 2.4 cm)
2. **Vernier Coincidence:** Find line that aligns perfectly with main scale (e.g., 7th division)
3. **Calculation:** Multiply Vernier division by precision (7 × 0.01 = 0.07 cm)
4. **Final Result:** 2.4 + 0.07 = **2.47 cm**

## C. Micrometer Screw Gauge

The most precise mechanical handheld instrument.

**Uses:** Diameter of thin wires, thickness of paper, pipe walls
**Precision:** Typically 0.01 mm

### Structure:
- **Anvil & Spindle:** Hold the object
- **Sleeve (Main Scale):** Fixed scale with mm and 0.5 mm marks
- **Thimble (Rotating Scale):** Usually 50 divisions
- **Ratchet:** Safety mechanism for uniform pressure

### Reading Technique:
1. **Sleeve Reading:** Note last visible mark, check for 0.5 mm mark (e.g., 5.5 mm)
2. **Thimble Reading:** Note division aligned with datum line (e.g., 32)
3. **Calculation:** 32 × 0.01 = 0.32 mm
4. **Final Result:** 5.5 + 0.32 = **5.82 mm**

**Precaution:** Always use the ratchet until it "clicks" - never tighten using thimble directly!`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Measurement of Time",
                content: `## A. Instruments

| Instrument | Type | Precision | Notes |
|------------|------|-----------|-------|
| Analogue Stopwatch | Mechanical | ~0.1 s | Prone to reading errors |
| Digital Stopwatch | Electronic | 0.01 s | Subject to human reaction time |

## B. The Simple Pendulum Experiment

The pendulum provides a standard method for measuring time intervals.

### Key Definitions:
- **Oscillation:** One complete to-and-fro motion (A → B → A)
- **Period (T):** Time for exactly one complete oscillation

### Experimental Procedure:
1. Suspend a small bob on a string from a retort stand
2. Displace bob by small angle (less than 10°)
3. Use a **fiducial marker** at centre of swing
4. Start stopwatch as bob passes marker
5. Count **20 complete oscillations** and stop watch
6. Calculate: **T = Total Time ÷ 20**

### Accuracy Tips:
- Timing multiple oscillations (20) reduces percentage error from human reaction time (~0.2s)
- Repeat timing and take an average

### Factors Affecting Period:

| Factor | Effect on Period |
|--------|------------------|
| **Length (L)** | T² ∝ L (Period squared proportional to length) |
| **Mass of bob** | NO effect on period |
| **Amplitude** | NO effect for small angles (Isochronism) |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Measurement of Mass and Weight",
                content: `## Mass vs Weight - Key Differences

| Feature | Mass (m) | Weight (W) |
|---------|----------|------------|
| **Definition** | Amount of matter in an object; measure of inertia | Gravitational force on an object |
| **Quantity Type** | Scalar (magnitude only) | Vector (magnitude and direction) |
| **Unit** | Kilogram (kg) | Newton (N) |
| **Constancy** | Constant everywhere in universe | Variable - depends on gravity |
| **Measurement** | Beam Balance or Electronic Balance | Spring Balance (Newton meter) |

## The Relationship

$$W = m \\times g$$

Where:
- **W** = Weight (N)
- **m** = Mass (kg)
- **g** = Gravitational field strength

### Gravitational Field Strength
On Earth: **g ≈ 10 N/kg**

This means gravity pulls with a force of approximately 10 N for every 1 kg of mass.

**Example:** A 5 kg object has weight = 5 × 10 = **50 N** on Earth`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Measurement of Volume",
                content: `## A. Regular Solids

For objects with geometric shapes, calculate mathematically:

| Shape | Formula |
|-------|---------|
| **Cube** | V = l³ |
| **Rectangular Block** | V = l × w × h |
| **Sphere** | V = (4/3)πr³ |
| **Cylinder** | V = πr²h |

## B. Liquids

**Instrument:** Measuring Cylinder (or Burette/Pipette for precision)

### Meniscus Reading:
- **Water:** Curves downward (concave) → Read **bottom** of meniscus
- **Mercury:** Curves upward (convex) → Read **top** of meniscus
- Position eye level with liquid surface to avoid parallax error

## C. Irregular Solids (Displacement Method)

Used for objects like stones with no geometric formula. Based on principle: **object displaces fluid equal to its own volume**.

### Method 1: Measuring Cylinder (Small Objects)
1. Fill cylinder partially, record initial volume (V₁)
2. Tie object to thread, submerge fully
3. Record new water level (V₂)
4. **Volume = V₂ - V₁**

### Method 2: Eureka Can (Large Objects)
1. Fill can until water reaches spout level
2. Collect displaced water in measuring cylinder
3. Gently lower object into can
4. Measure volume of displaced water = Volume of object

**Note:** Object must be denser than water to sink completely`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Physical quantity = Numerical magnitude + Unit",
            "SI base units: metre (m), kilogram (kg), second (s), ampere (A), kelvin (K)",
            "Derived quantities combine base quantities (e.g., speed = m/s)",
            "Prefixes: kilo (10³), centi (10⁻²), milli (10⁻³), micro (10⁻⁶)",
            "Vernier caliper precision: 0.01 cm; Micrometer precision: 0.01 mm",
            "Always use ratchet on micrometer for uniform pressure",
            "Pendulum period: T² ∝ L; mass and small amplitude have no effect",
            "Mass is constant; Weight varies with gravity (W = mg)",
            "g ≈ 10 N/kg on Earth",
            "Displacement method measures volume of irregular solids"
        ],
        exam_tips: [
            "Always include units in measurements and final answers",
            "Read vernier and micrometer scales carefully - practice reading diagrams",
            "Explain how to reduce parallax error (eye perpendicular to scale)",
            "Know why we time multiple pendulum oscillations (reduces % error)",
            "Distinguish between mass (kg, constant) and weight (N, variable)",
            "Use displacement method for irregular objects",
            "Convert between units using prefixes and standard form"
        ]
    },

    "Kinematics (Speed, Velocity, Acceleration, Graphs of Motion)": {
        topic: "Kinematics (Speed, Velocity, Acceleration, Graphs of Motion)",
        subject: "Physics",
        summary: "Kinematics is the study of motion without considering the forces causing it. This topic covers the fundamental concepts of distance, displacement, speed, velocity, and acceleration. It includes graphical analysis of motion, the equations of uniformly accelerated motion (SUVAT), free fall under gravity, and experimental techniques using ticker tape timers.",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/The_Physics_of_Motion_Kinematics_Explained.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL1RoZV9QaHlzaWNzX29mX01vdGlvbl9LaW5lbWF0aWNzX0V4cGxhaW5lZC5tNGEiLCJpYXQiOjE3NjU2MDEzMjUsImV4cCI6NTI2NjA5NzMyNX0.7XkYX0oCebBVcsoajY4asJS3OdzECNyYaMVnxc6W_iw",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/The_World_in_Motion.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvVGhlX1dvcmxkX2luX01vdGlvbi5tcDQiLCJpYXQiOjE3NjU3OTczODYsImV4cCI6NTI2NjI5MzM4Nn0.sehNa3WVKbZVrVYWX6o36hMn9wRfLAMm6Td1uMQMOlM",
        sections: [
            {
                title: "1. Fundamentals of Motion",
                content: `## A. The Concept of Relativity in Motion

Motion is **relative** - an object is only "moving" if its position changes relative to a specific reference point.

### Rest vs. Motion:
- **At Rest:** Position relative to surroundings remains unchanged over time
- **In Motion:** Position relative to surroundings changes

**Example:** A passenger in a moving train is at rest relative to other passengers, but in motion relative to someone on the platform.

## B. Linear Motion Types

**Uniform Motion:** Object travels equal distances in equal time intervals → Constant speed

**Non-Uniform Motion:** Object travels unequal distances in equal time intervals → Speed is changing (accelerating/decelerating)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Distance vs. Displacement",
                content: `## A. Distance (d)

**Definition:** The total length of the actual path travelled by an object.

### Characteristics:
- **Scalar Quantity:** Magnitude only, direction irrelevant
- **Always Positive:** Can never be negative
- **Path Dependent:** Different routes = different distances

## B. Displacement (s or x)

**Definition:** The shortest straight-line distance from initial to final position, in a specific direction.

### Characteristics:
- **Vector Quantity:** Has both magnitude AND direction (e.g., "50m North")
- **Sign Sensitive:** Can be positive, negative, or zero
- **Path Independent:** Depends only on start and end points

## Example Case:
**Scenario:** An athlete runs one complete lap around a 400m track.
- **Distance:** 400m (total ground covered)
- **Displacement:** 0m (start point = end point)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Speed and Velocity",
                content: `## A. Speed

**Definition:** The rate of change of distance with respect to time.

$$\\text{Speed} = \\frac{\\text{Distance}}{\\text{Time}}$$

### Types:
- **Instantaneous Speed:** Speed at a specific moment (what speedometer shows)
- **Average Speed:** Total distance ÷ Total time

### Unit Conversion:
- **km/h → m/s:** Divide by 3.6
- **m/s → km/h:** Multiply by 3.6

## B. Velocity

**Definition:** The rate of change of displacement (speed in a specific direction).

$$v = \\frac{s}{t}$$

### Changing Velocity:
Velocity can change by:
1. **Change in magnitude:** Speeding up or slowing down
2. **Change in direction:** Even at constant speed!

**Example:** A satellite orbiting Earth at constant speed has changing velocity because its direction constantly curves - therefore it is accelerating!`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Acceleration",
                content: `## A. Definition and Concept

**Acceleration** describes how quickly velocity changes - the "rate of a rate."

$$a = \\frac{v - u}{t}$$

Where:
- **v** = final velocity (m/s)
- **u** = initial velocity (m/s)
- **t** = time (s)

**SI Unit:** m/s² (metres per second squared)

## B. Types of Acceleration

| Type | Description |
|------|-------------|
| **Positive Acceleration** | Velocity increasing (speeding up forward) |
| **Deceleration (Retardation)** | Object slowing down (negative value) |
| **Uniform Acceleration** | Velocity changes by same amount every second |
| **Non-Uniform Acceleration** | Rate of velocity change varies |

**Note:** If v < u, acceleration is negative (e.g., -5 m/s²)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Graphical Representation of Motion",
                content: `## A. Displacement-Time Graphs (s-t)

**The Gradient Rule:** Gradient of s-t graph = **Velocity**

$$\\text{Gradient} = \\frac{\\Delta s}{\\Delta t} = v$$

| Shape of Line | Interpretation |
|---------------|----------------|
| Horizontal line | Stationary (not moving) |
| Straight diagonal (up) | Uniform velocity (constant speed away) |
| Straight diagonal (down) | Negative uniform velocity (returning) |
| Curve (getting steeper) | Acceleration |
| Curve (getting flatter) | Deceleration |

## B. Velocity-Time Graphs (v-t)

### Feature 1: The Gradient = **Acceleration**
- Steep slope = High acceleration
- Flat line = Zero acceleration (constant velocity)
- Negative slope = Deceleration

### Feature 2: Area Under Graph = **Displacement/Distance**

**Calculation:** Split into geometric shapes:
- Triangle: Area = ½ × base × height
- Rectangle: Area = base × height
- **Total Distance = Sum of all areas**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Equations of Motion (SUVAT)",
                content: `## Variables:
- **s** = displacement (m)
- **u** = initial velocity (m/s)
- **v** = final velocity (m/s)
- **a** = acceleration (m/s²)
- **t** = time (s)

## The 4 Equations:

### 1. To find velocity given time:
$$v = u + at$$

### 2. To find displacement given time:
$$s = ut + \\frac{1}{2}at^2$$

### 3. Without time (velocity-displacement):
$$v^2 = u^2 + 2as$$

### 4. Using average velocity:
$$s = \\left(\\frac{u + v}{2}\\right) \\times t$$

## Problem-Solving Strategy:
1. List variables you know (e.g., u=0, t=5, a=10)
2. Identify variable to find
3. Select equation containing knowns and unknown
4. Substitute and solve`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Motion Under Gravity (Free Fall)",
                content: `## A. Acceleration of Free Fall (g)

In absence of air resistance, **all objects fall at the same rate** regardless of mass.

**Value:** g ≈ 9.81 m/s² (Use **10 m/s²** in O Level exams)

### Sign Convention:
- **Motion Upwards:** a = -10 m/s² (gravity opposes motion)
- **Motion Downwards:** a = +10 m/s² (gravity assists motion)

## B. Vertical Projection (Throwing Ball Up)

| Stage | What Happens |
|-------|--------------|
| **Ascent** | Velocity decreases by 10 m/s every second |
| **Maximum Height** | Velocity = 0 m/s (but a = 10 m/s² still!) |
| **Descent** | Velocity increases by 10 m/s every second |

**Symmetry:** Time up = Time down; Speed of release = Speed of impact

## C. Terminal Velocity

In real world, air resistance affects falling objects:

1. **Initial Fall:** Low speed → Low air resistance → Accelerates at ~10 m/s²
2. **Speed Increases:** Air resistance increases → Net force decreases → Acceleration drops
3. **Terminal Velocity:** Air resistance = Weight → Net force = 0 → Constant maximum speed`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Experimental Measurements (Ticker Tape Timer)",
                content: `## Mechanism

- Vibrating arm strikes carbon disc **50 times per second** (50 Hz)
- Makes dots on moving paper tape
- **Time between consecutive dots = 1/50 = 0.02 s**

## Interpreting the Tape:

| Pattern | Meaning |
|---------|---------|
| Dots close together | Slow speed |
| Dots far apart | High speed |
| Spacing increases | Acceleration |
| Spacing decreases | Deceleration |

## Calculating Acceleration from Tape:

1. Measure length of **first 5 gaps** → Calculate initial velocity (u)
2. Measure length of **last 5 gaps** → Calculate final velocity (v)
3. Count total gaps between sections → Find total time (t)
4. Apply: **a = (v - u) / t**`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Motion is relative - depends on frame of reference",
            "Distance (scalar, path-dependent) vs Displacement (vector, shortest path)",
            "Speed = distance/time; Velocity = displacement/time (includes direction)",
            "Acceleration a = (v-u)/t measured in m/s²",
            "s-t graph: gradient = velocity",
            "v-t graph: gradient = acceleration; area = distance",
            "SUVAT equations: v=u+at, s=ut+½at², v²=u²+2as, s=(u+v)t/2",
            "Free fall: g ≈ 10 m/s² (all objects fall at same rate in vacuum)",
            "Terminal velocity: when air resistance = weight, acceleration = 0",
            "Ticker tape: 0.02s between dots; spacing shows acceleration"
        ],
        exam_tips: [
            "Convert km/h to m/s by dividing by 3.6",
            "For v-t graphs: calculate area under graph for distance",
            "Choose correct SUVAT equation based on known and unknown variables",
            "At maximum height, v=0 but acceleration is still g",
            "Time up = Time down for vertical projection (no air resistance)",
            "Draw and label motion graphs clearly with axes and units",
            "Ticker tape: count gaps, not dots, for time calculations"
        ]
    },

    "Forces (Including Machines, Turning Effects, Friction, and Mechanical Structures)": {
        topic: "Forces (Including Machines, Turning Effects, Friction, and Mechanical Structures)",
        subject: "Physics",
        summary: "This topic covers the fundamental concept of force as a push or pull that can change motion or shape. It includes vector representation of forces, motion under gravity (vertical projection), terminal velocity in fluids, and experimental analysis using ticker tape timers. Understanding forces is essential for explaining how objects interact and move.",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/Newton_s_Laws_and_Terminal_Velocity.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL05ld3Rvbl9zX0xhd3NfYW5kX1Rlcm1pbmFsX1ZlbG9jaXR5Lm00YSIsImlhdCI6MTc2NTYwMTE4OSwiZXhwIjoxNzc1MTkxNTg5fQ.TKaKtvSdeKCzRZi1ka-8dM2OoJlcpIUn-M4hTeP_d0U",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/Forces__Push_and_Pull.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvRm9yY2VzX19QdXNoX2FuZF9QdWxsLm1wNCIsImlhdCI6MTc2NTc5NzI4MSwiZXhwIjo1MjY2MjkzMjgxfQ.lrlz6g93CDfohdI_dvAyf3kxzqCXkWBAjU2KHg1NmpM",
        sections: [
            {
                title: "1. Introduction to Forces",
                content: `## A. Definition and Nature

**Force:** A push or a pull exerted on an object resulting from interaction with another object. Forces are the fundamental agents of change in the universe.

### Effects of Forces:
- **Accelerate** (speed up)
- **Decelerate** (slow down)
- **Change direction** of travel
- **Cause deformation** (change shape or size)

**Key Principle:** Whenever two objects interact, there is a force acting upon each object. When the interaction ceases, the force no longer exists.

## B. Force as a Vector Quantity

Force has both **magnitude** (size) and **direction** - making it a vector.

**Incomplete:** "10 N"
**Complete:** "10 N pushing to the right" or "10 N pulling downwards"

### Why Direction Matters:
- Forces in **opposite directions** can cancel out
- Forces in **same direction** add up
- Represent forces as **arrows** (length = magnitude, head = direction)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Motion Under Gravity (Vertical Projection)",
                content: `## Throwing an Object Upwards

When an object is projected vertically upwards (ignoring air resistance):

### Ascent Phase:
- Gravity acts **downwards**, opposing upward motion
- Constant **deceleration** of ~10 m/s²
- Kinetic energy → Gravitational potential energy
- Velocity decreases by 10 m/s every second

### At Maximum Height:
- Velocity = **0 m/s** (momentarily stops)
- **Acceleration is still 10 m/s² downwards!**

> **Common Misconception:** Acceleration is NOT zero at the top. Gravity never "switches off" - if a = 0, the object would hover forever!

### Descent Phase:
- Gravity acts in **same direction** as motion
- Constant **acceleration** of 10 m/s²
- Gravitational potential energy → Kinetic energy
- Velocity increases by 10 m/s every second

## Symmetry of Motion

| Property | Relationship |
|----------|--------------|
| **Time** | Time up = Time down |
| **Speed** | Release speed = Return speed |
| **Velocity** | Same magnitude, opposite direction |

**Example:** Released at +20 m/s up, returns at -20 m/s down`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Terminal Velocity (Falling in Fluids)",
                content: `## Air Resistance (Drag)

In real-world scenarios, objects fall through fluids (air/water), not vacuum.

**Air Resistance:**
- Always **opposes** direction of motion
- **Increases** with speed and surface area
- Changes the dynamics of falling significantly

## The Three Stages of Falling

### Stage 1: Initial Acceleration
- Object released: velocity = 0
- Air resistance = 0 (depends on speed)
- Only force = Weight (W) downwards
- Net force = W, so object accelerates at **~10 m/s²**
- This is **maximum acceleration**

### Stage 2: Decreasing Acceleration
- As speed increases, air resistance (R) increases
- Net force = W - R (becoming smaller)
- Object still speeds up, but **rate of acceleration decreases**
- Gaining speed, but not as quickly as before

### Stage 3: Terminal Velocity
- Speed reaches point where **R = W**
- **Net Force = 0** (forces balanced/equilibrium)
- **Acceleration = 0** (Newton's First Law)
- Object falls at **constant maximum speed**

$$\\text{Terminal Velocity: When } R = W$$

## Factors Affecting Terminal Velocity

| Factor | Effect |
|--------|--------|
| **Surface Area** | Larger area → More drag → Lower terminal velocity (parachute!) |
| **Mass** | Heavier object → Greater weight → Needs higher speed for R=W → Higher terminal velocity |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Ticker Tape Timer Experiments",
                content: `## A. Mechanism and Setup

**Operation:** Vibrating metal arm strikes carbon disc **50 times per second** (50 Hz)

**The Tape:** Paper tape attached to moving object, pulled through timer

**The Dots:** Each strike stamps a dot on the tape

### Time Interval:
$$t = \\frac{1}{50} = \\textbf{0.02 s}$$

A "10-dot" interval = 10 × 0.02 = **0.2 seconds**

## B. Interpreting Tape Patterns

| Pattern | Motion |
|---------|--------|
| **Constant spacing** | Constant velocity (no acceleration) |
| **Spacing increases** | Acceleration (speeding up) |
| **Spacing decreases** | Deceleration (slowing down) |

## C. Calculating Motion from Tape

### 1. Calculating Velocity:
1. Count **gaps** (not dots!) - 5 dots = 4 gaps
2. Measure total length (d) in metres
3. Time = Number of gaps × 0.02 s
4. Velocity = Distance ÷ Time

### 2. Calculating Acceleration:
1. **Initial velocity (u):** Measure first 5 gaps, calculate u = distance₁ ÷ (5 × 0.02)
2. **Final velocity (v):** Measure last 5 gaps, calculate v = distance₂ ÷ (5 × 0.02)
3. **Time (t):** Count total gaps between centres of measured sections × 0.02 s
4. **Apply:** a = (v - u) / t

**Positive result = Acceleration | Negative result = Deceleration**`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Force is a push or pull that can change motion or shape",
            "Force is a vector: must specify magnitude AND direction",
            "At maximum height: v = 0 but acceleration = 10 m/s² (gravity doesn't stop!)",
            "Time up = Time down; Release speed = Return speed",
            "Air resistance increases with speed and opposes motion",
            "Terminal velocity: when air resistance = weight, acceleration = 0",
            "Larger surface area = lower terminal velocity (parachute effect)",
            "Heavier objects have higher terminal velocity",
            "Ticker tape: 0.02 s between dots (50 Hz)",
            "Count gaps, not dots, for time calculations"
        ],
        exam_tips: [
            "Always draw force arrows with correct direction and relative size",
            "Remember: acceleration ≠ 0 at maximum height of projection",
            "Explain terminal velocity using the three stages",
            "Know factors affecting terminal velocity (mass, surface area)",
            "Ticker tape: gaps = dots - 1",
            "For ticker tape acceleration: measure start and end sections separately"
        ]
    },

    "Work, Energy and Power": {
        topic: "Work, Energy and Power",
        subject: "Physics",
        summary: "This topic covers the physics of work, energy, and power. It includes the conditions for work to be done, various forms of energy stores, the principle of conservation of energy, and the formulas for kinetic and gravitational potential energy. Power as the rate of doing work and efficiency calculations are also covered, along with renewable and non-renewable energy resources.",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/Work_Energy_and_Power_Defined.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL1dvcmtfRW5lcmd5X2FuZF9Qb3dlcl9EZWZpbmVkLm00YSIsImlhdCI6MTc2NTYwMTM1MywiZXhwIjo1MjY2MDk3MzUzfQ.UMtOickFHVPV9VMTjQxM5N7BSh6s_-DKvkQyMlAC7M4",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/WORK,_ENERGY,_&_POWER.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvV09SSyxfRU5FUkdZLF8mX1BPV0VSLm1wNCIsImlhdCI6MTc2NTc5NzQxNywiZXhwIjo1MjY2MjkzNDE3fQ.617GpxWwmyCbC6Py_0bglzyxy5QBHJJAZyfbAaA4iFU",
        sections: [
            {
                title: "1. Work Done",
                content: `## A. The Physics Definition of Work

**Condition for Work:** Work is done only when:
1. A **force** is applied to an object, AND
2. The object **moves** in the direction of the force

**Work as Energy Transfer:** Doing work = transferring energy from one store to another.

## B. Scenarios of Zero Work

| Scenario | Why No Work Done |
|----------|------------------|
| Push a wall but it doesn't move | Distance d = 0 |
| Carry bucket while walking horizontally | Force (up) perpendicular to motion (horizontal) |
| Satellite in circular orbit | Gravity perpendicular to motion |

## C. Calculating Work

$$W = F \\times d$$

Where:
- **W** = Work Done (Joules, J)
- **F** = Force applied (Newtons, N)
- **d** = Distance in direction of force (metres, m)

**The Joule:** 1 J = work done when 1 N moves object 1 m

## D. Work Done Against Gravity

When lifting an object:
- Force needed = Weight = mg
- Distance = Height (h)

$$W = mgh$$

**Example:** Crane lifting 500 kg to 20 m height:
W = 500 × 10 × 20 = **100,000 J** (stored as GPE)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Forms of Energy",
                content: `## A. The Concept of Energy

**Definition:** Energy is the capacity to do work - the "currency" of the universe.

- **Scalar Quantity:** Has magnitude only, no direction
- **SI Unit:** Joules (J) - same as Work

## B. Energy Stores

| Energy Type | Description | Examples |
|-------------|-------------|----------|
| **Kinetic (KE)** | Energy of motion | Moving car, running person |
| **Gravitational Potential (GPE)** | Energy of position/height | Object on shelf, water behind dam |
| **Chemical Potential** | Energy in atomic bonds | Fuel, food, batteries |
| **Elastic Potential** | Energy in stretched/compressed objects | Spring, rubber band, bow |
| **Thermal (Internal)** | Random motion of particles | Hot coffee, warm engine |
| **Nuclear** | Energy in atomic nucleus | Uranium, Sun's fusion |
| **Electrical** | Moving electric charges | Current in wires |
| **Radiant (Light)** | Electromagnetic waves | Sunlight, X-rays |
| **Sound** | Vibration of particles | Speaker, explosion |

## C. Conservation of Energy

> **The Golden Rule:** Energy cannot be created or destroyed - only converted from one form to another.

**Energy Dissipation:** Energy often transforms into "less useful" forms (usually thermal energy from friction).

### Energy Transformation Examples:
- **Dropping ball:** GPE → KE → Heat + Sound
- **Electric motor:** Electrical → Kinetic + Thermal (waste)
- **Battery:** Chemical → Electrical`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Energy Formulas",
                content: `## A. Kinetic Energy (KE)

$$KE = \\frac{1}{2}mv^2$$

- **m** = Mass (kg)
- **v** = Speed (m/s)

> **Important:** Velocity is **squared** - double the speed = **4× the kinetic energy** (and 4× braking distance!)

## B. Gravitational Potential Energy (GPE)

$$GPE = mgh$$

- **m** = Mass (kg)
- **g** = Gravity (10 m/s² on Earth)
- **h** = Height (m)

## C. Mechanical Energy Conversion

In frictionless systems:

$$\\text{Loss in GPE} = \\text{Gain in KE}$$

$$mgh = \\frac{1}{2}mv^2$$

**Mass cancels out:**

$$v = \\sqrt{2gh}$$

This proves: **falling speed depends only on height, not mass!** (Galileo's discovery)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Power",
                content: `## A. Definition

**Power** is the **rate** of doing work (how fast work is done).

## B. Formulas

### Standard Formula:
$$P = \\frac{W}{t} = \\frac{E}{t}$$

- **P** = Power (Watts, W)
- **W** = Work Done (J)
- **E** = Energy transferred (J)
- **t** = Time (s)

### For Moving Vehicles:
$$P = F \\times v$$

(Useful for calculating engine power at constant speed)

## C. Units

**SI Unit:** Watt (W)

**Definition:** 1 W = 1 J/s (1 Joule per second)

| Prefix | Value |
|--------|-------|
| 1 kilowatt (kW) | 1,000 W |
| 1 megawatt (MW) | 1,000,000 W |

**Example:** 60W bulb transfers 60 J of energy every second`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Efficiency",
                content: `## A. The Reality of Waste

No machine is 100% efficient - some energy is always "wasted" (usually as heat from friction).

- **Input Energy:** Total energy put into machine
- **Useful Output:** Energy machine was designed to produce
- **Wasted Energy:** Energy that doesn't accomplish intended goal

## B. Calculating Efficiency

$$\\text{Efficiency} = \\frac{\\text{Useful Energy Output}}{\\text{Total Energy Input}} \\times 100\\%$$

Or using Power:

$$\\text{Efficiency} = \\frac{\\text{Useful Power Output}}{\\text{Total Power Input}} \\times 100\\%$$

**Note:** Efficiency > 100% is **impossible** (would violate conservation of energy!)

## C. Sankey Diagrams

Visual representations of energy flow:
- **Width of arrow** = Amount of energy
- **Straight arrows** = Useful energy
- **Downward/side arrows** = Wasted energy (heat/sound)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Energy Resources",
                content: `## A. The Sun: Ultimate Source

Almost all energy originates from the Sun:
- **Fossil Fuels:** Ancient plants stored solar energy
- **Wind/Waves:** Sun heats Earth unevenly → convection currents
- **Hydroelectric:** Sun drives water cycle
- **Solar:** Direct collection

**Exceptions:** Geothermal, Nuclear, Tidal

## B. Renewable Resources

| Resource | How It Works | Pros | Cons |
|----------|--------------|------|------|
| **Solar** | Cells convert light to electricity | Zero pollution, free fuel | Unreliable, needs large area |
| **Wind** | Turbines driven by wind | Zero pollution | Noise, needs specific wind speeds |
| **Hydroelectric** | Falling water drives turbines | Reliable, instant response | Floods land, expensive |
| **Geothermal** | Steam from hot rocks | Very reliable | Only in volcanic areas |
| **Biofuels** | Burning plant/animal matter | Carbon neutral | Uses food-growing land |

## C. Non-Renewable Resources

| Resource | Pros | Cons |
|----------|------|------|
| **Fossil Fuels** (Coal, Oil, Gas) | Reliable, high energy density, cheap | CO₂ (global warming), SO₂ (acid rain), finite supply |
| **Nuclear Fission** | No greenhouse gases, high energy density | Radioactive waste, accident risk, expensive |`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Work = Force × Distance (W = Fd); Unit: Joules (J)",
            "Work against gravity: W = mgh",
            "No work done if: no movement OR force perpendicular to motion",
            "Energy cannot be created or destroyed - only converted",
            "KE = ½mv² (doubling speed = 4× kinetic energy)",
            "GPE = mgh",
            "Falling speed v = √(2gh) - independent of mass",
            "Power = Work ÷ Time = Energy ÷ Time (Unit: Watts)",
            "P = Fv for moving vehicles",
            "Efficiency = Useful Output ÷ Total Input × 100%",
            "Most energy resources originate from the Sun"
        ],
        exam_tips: [
            "Always state the energy transformation in questions",
            "Remember v² in KE formula - doubling speed quadruples energy",
            "Use conservation of energy: GPE lost = KE gained",
            "Check units: J for energy/work, W for power",
            "Know pros and cons of different energy resources",
            "Efficiency can never exceed 100%",
            "Draw Sankey diagrams with arrow width proportional to energy"
        ]
    },

    "Thermal Physics (Kinetic Theory, Thermal Properties, Heat Transfer)": {
        topic: "Thermal Physics (Kinetic Theory, Thermal Properties, Heat Transfer)",
        subject: "Physics",
        summary: "The Kinetic Theory of Matter explains the physical properties of solids, liquids, and gases by considering matter as tiny, constantly moving particles. This topic covers states of matter, Brownian motion as evidence for particle theory, gas laws (pressure, volume, temperature relationships), thermal expansion, specific heat capacity, specific latent heat, and the three mechanisms of heat transfer: conduction, convection, and radiation.",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/Kinetic_Theory_Brownian_Motion_and_Pressure.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL0tpbmV0aWNfVGhlb3J5X0Jyb3duaWFuX01vdGlvbl9hbmRfUHJlc3N1cmUubTRhIiwiaWF0IjoxNzY1NjAxMDkxLCJleHAiOjUyNjYwOTcwOTF9.YriBHZhnt43-Af0X2MA5O8Y6b5r4EHZy9J2W94ACx7A",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/Thermal_Physics.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvVGhlcm1hbF9QaHlzaWNzLm1wNCIsImlhdCI6MTc2NTc5ODQ3MSwiZXhwIjo1MjY2Mjk0NDcxfQ.2gBwVJMKEeRUm80K6jhpP516h2q-WuUU237GIdZKj54",
        sections: [
            {
                title: "1. The Kinetic Theory of Matter",
                content: `## Introduction

The Kinetic Theory of Matter serves as the fundamental model for explaining the physical properties of solids, liquids, and gases. It connects the microscopic behaviour of individual particles to the macroscopic thermal phenomena we can observe and measure.

## States of Matter: A Molecular Comparison

| State | Molecular Arrangement & Motion | Intermolecular Forces |
|-------|-------------------------------|----------------------|
| **Solid** | Close together in regular pattern. Each molecule **vibrates about a fixed position** | Strong attractive and repulsive forces create stable structure |
| **Liquid** | Close together but not fixed. Able to **move and slide past each other** | Forces strong enough to keep molecules together (definite volume) |
| **Gas** | Far apart, move **randomly and rapidly**. Occupy entire container volume | Negligibly small except during brief collisions |

## Brownian Motion: Visualizing the Invisible

**Evidence for the existence of unseen, fast-moving particles.**

### Classic Demonstration:
Observe tiny smoke particles in a glass cell under a microscope → particles move **randomly and haphazardly**.

### The Mechanism:
1. A smoke particle is **massive** compared to individual air molecules
2. Bombarded on all sides by countless air molecules
3. Random motion means **unequal collisions** on different sides
4. Creates **net force** in a specific direction
5. Net force changes rapidly as collision pattern shifts → **jerky, zig-zag motion**

## The Gas Laws

For a **fixed mass of gas**, clear relationships exist between pressure, volume, and temperature:

| Relationship | At Constant... | Effect |
|--------------|----------------|--------|
| **Pressure ↔ Volume** | Temperature | P ↑ → V ↓ (Boyle's Law) |
| **Volume ↔ Temperature** | Pressure | T ↑ → V ↑ |
| **Pressure ↔ Temperature** | Volume | T ↑ → P ↑ |

## Absolute Zero and the Kelvin Scale

When gas properties are plotted against temperature, extrapolation reaches **-273 °C** — called **Absolute Zero** (where molecules theoretically stop moving).

**Conversion:** $$T(K) = θ(°C) + 273$$

## The Combined Gas Law

$$\\frac{p_1 V_1}{T_1} = \\frac{p_2 V_2}{T_2}$$

**Example:** Bicycle pump with 50 cm³ air at 17°C and 1.0 atm. Find pressure when compressed to 10 cm³ at 27°C.

**Solution:**
1. T₁ = 17 + 273 = 290 K
2. T₂ = 27 + 273 = 300 K
3. p₂ = (p₁V₁T₂)/(V₁T₁) = (1.0 × 50 × 300)/(10 × 290) ≈ **5.2 atm**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Thermal Properties and Energy Transfer",
                content: `## Thermal Expansion

Matter expands when heated and contracts when cooled. When heated, molecules gain kinetic energy and vibrate more rapidly, forcing them slightly further apart.

### Degree of Expansion:
- **Gases** expand the most
- **Liquids** expand more than solids
- **Solids** expand the least

## Specific Heat Capacity (c)

> **Definition:** The energy needed to raise the temperature of **1 kg** of a substance by **1 °C**.

**Formula:** $$E = mcΔT$$

Where:
- E = Energy transferred (J)
- m = Mass (kg)
- c = Specific heat capacity (J/kg°C)
- ΔT = Temperature change (°C)

### Sample Values:

| Substance | Specific Heat Capacity |
|-----------|----------------------|
| Water | **4200 J/(kg°C)** |
| Ice | 2000 J/(kg°C) |
| Aluminium | 900 J/(kg°C) |

**High c (water):** Requires large energy to heat—excellent coolant.
**Low c (aluminium):** Heats up quickly.

## Specific Latent Heat (l)

> **Definition:** The thermal energy required to change the state of **1 kg** of a substance **without any temperature change**.

Energy is used to **break intermolecular bonds**, not increase kinetic energy.

**Formula:** $$E = ml$$

### Two Types:

| Type | Process | Value (Water) |
|------|---------|---------------|
| **Latent Heat of Fusion (lf)** | Solid → Liquid | 340,000 J/kg |
| **Latent Heat of Vaporisation (lv)** | Liquid → Gas | 2,300,000 J/kg |

**Note:** lv >> lf (vaporization requires more energy)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Multi-Stage Heat Transfer Calculation",
                content: `## Example: Ice to Steam

**Problem:** How much heat is needed to change **20 g of ice at 0°C** to **steam at 100°C**?

### Stage 1: Melting the Ice (0°C)

Energy to change state from solid ice to liquid water:

$$E_1 = m × l_f = 20g × 340 J/g = \\textbf{6800 J}$$

### Stage 2: Heating the Water (0°C → 100°C)

Energy to heat liquid water from melting point to boiling point:

$$E_2 = m × c × ΔT = 20g × 4.2 J/(g°C) × 100°C = \\textbf{8400 J}$$

### Stage 3: Boiling the Water (100°C)

Energy to change state from liquid water to steam:

$$E_3 = m × l_v = 20g × 2300 J/g = \\textbf{46000 J}$$

### Total Heat Required:

$$E_{total} = E_1 + E_2 + E_3 = 6800 + 8400 + 46000 = \\textbf{61200 J}$$

## Key Insight

| Stage | Temperature Change? | Where Energy Goes |
|-------|--------------------|--------------------|
| Heating | YES | Increases particle kinetic energy |
| State Change | NO (constant T) | Breaks intermolecular bonds |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Mechanisms of Heat Transfer",
                content: `## Conduction

Heat flows through matter from higher to lower temperature **without movement of matter as a whole**. Most significant in **solids**.

### Two Mechanisms:

| Mechanism | How It Works | Where |
|-----------|--------------|-------|
| **Lattice Vibrations** | Heated molecules vibrate more vigorously, passing energy to neighbours | All solids |
| **Free Electron Flow** | Electrons gain kinetic energy and travel quickly, transferring energy | **Metals only** |

**Metals = excellent conductors** (free electrons), **Non-metals = insulators**

## Convection

Heat transfer through **fluids** (liquids and gases) via **movement of the fluid itself**. Relies on density changes.

### The Convection Current Cycle:

1. Fluid is heated → expands → becomes **less dense**
2. Less dense warm fluid **rises**
3. Cooler, denser fluid **sinks** to take its place
4. This fluid is heated and the **cycle repeats**

## Radiation

Heat transfer by **electromagnetic waves** (mostly infrared), **does NOT require a medium**.

This is how Earth receives energy from the Sun (through vacuum of space).

### Surface Effects:

| Surface Type | Emission | Absorption |
|--------------|----------|------------|
| **Dull, black** | Best emitter | Best absorber |
| **Shiny, polished** | Poor emitter | Poor absorber |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Application: The Vacuum Flask",
                content: `## Design Excellence

The vacuum flask minimizes heat transfer by **all three mechanisms** simultaneously.

## How Each Mechanism is Stopped:

### 1. Stopping Conduction & Convection

Double-walled glass vessel with **vacuum** between walls.

**Why it works:** Both conduction and convection require **particles** to transfer energy. The near-total absence of particles in the vacuum almost completely prevents heat transfer.

### 2. Reducing Radiation

The walls facing the vacuum are **silvered** (shiny and reflective).

**Why it works:** Shiny surfaces are **poor emitters** and **poor absorbers** of radiation.
- For hot liquids: reflects thermal radiation back into the liquid
- For cold liquids: reflects external radiation away

### 3. Residual Transfer

Small amount of heat can still transfer through:
- Thin glass at top where walls meet
- The stopper

## Summary Table

| Mechanism | How Flask Stops It |
|-----------|-------------------|
| Conduction | Vacuum (no particles) |
| Convection | Vacuum (no fluid to flow) |
| Radiation | Silvered surfaces (reflect infrared) |`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Kinetic Theory: all matter consists of particles in constant motion; explains solid/liquid/gas properties",
            "Brownian motion: random zig-zag motion of smoke particles = evidence for invisible air molecules",
            "Gas laws: P↔V (at constant T), V↔T (at constant P), P↔T (at constant V)",
            "Absolute Zero = -273°C (0 K); use Kelvin for gas law calculations: T(K) = θ(°C) + 273",
            "Combined gas law: p₁V₁/T₁ = p₂V₂/T₂ for fixed mass of gas",
            "Thermal expansion: Gases > Liquids > Solids",
            "Specific heat capacity: E = mcΔT; water has high c (4200 J/kg°C) = excellent coolant",
            "Specific latent heat: E = ml; lv >> lf (vaporization requires more energy than fusion)",
            "During state changes, temperature stays constant (energy breaks bonds, not increases KE)",
            "Conduction: through material via lattice vibrations + free electrons (metals best)",
            "Convection: fluid movement (hot rises, cold sinks) creating convection currents",
            "Radiation: EM waves through vacuum; dull black surfaces = best absorbers AND emitters"
        ],
        exam_tips: [
            "ALWAYS convert to Kelvin for gas law calculations (add 273 to Celsius)",
            "Explain Brownian motion in terms of unequal molecular bombardment",
            "Know why temperature stays constant during state changes (energy breaks bonds)",
            "Multi-stage calculations: identify heating stages (E=mcΔT) and state change stages (E=ml)",
            "Explain why metals conduct heat better than non-metals (free electrons)",
            "Convection only works in fluids (cannot occur in solids or vacuum)",
            "Radiation is only method that works through a vacuum",
            "Vacuum flask: vacuum stops conduction/convection, silvered surfaces reduce radiation",
            "Black surfaces are both best absorbers AND best emitters of radiation"
        ]
    },

    "Waves (General Wave Properties, Optics, Sound)": {
        topic: "Waves (General Wave Properties, Optics, Sound)",
        subject: "Physics",
        summary: "This comprehensive topic covers the fundamental principles of waves, light (optics), and sound. It establishes the essential vocabulary and mathematical relationships that describe all mechanical waves, analyzes the phenomena of reflection and refraction, explains how lenses form images, and explores the nature of sound as a longitudinal wave with practical applications including echoes and speed of sound calculations.",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/The_Core_Rules_of_All_Waves.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL1RoZV9Db3JlX1J1bGVzX29mX0FsbF9XYXZlcy5tNGEiLCJpYXQiOjE3NjU2MDEzMDIsImV4cCI6NTI2NjA5NzMwMn0.lVTNfc3jxXoE2IoFEP19Q8JBwmEq0QRHVipaOj7Jsa0",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/Understanding_Waves.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvVW5kZXJzdGFuZGluZ19XYXZlcy5tcDQiLCJpYXQiOjE3NjU3OTczOTgsImV4cCI6NTI2NjI5MzM5OH0.jfXt8-baLWLSw-qO5mMwf-hanVjvZEzPtVzMqdeUwVk",
        sections: [
            {
                title: "1. General Wave Properties",
                content: `## A. Core Wave Terminology

The following terms are essential for describing wave characteristics:

| Term | Symbol | Definition | Unit |
|------|--------|------------|------|
| **Wavelength** | λ (lambda) | The distance between successive crests of a wave | m |
| **Frequency** | f | The number of complete waves generated per second, or the number of crests passing a chosen point per second | Hz |
| **Amplitude** | a | The height of a crest or the depth of a trough, measured from the undisturbed position of the medium | m |
| **Speed** | v | The distance moved in the direction of travel by a crest or any point on the wave in one second | m/s |

## B. The Wave Equation

A fundamental relationship connects the speed, frequency, and wavelength of any wave:

$$v = f \\times \\lambda$$

This equation states that the **speed of a wave is the product of its frequency and wavelength**.

### Worked Example:

**Given:** A wave with frequency = 3 Hz and wavelength = 20 cm

**Solution:**
$$v = f \\times \\lambda = 3 \\text{ Hz} \\times 20 \\text{ cm} = 60 \\text{ cm/s}$$

## C. Classifying Waves: Transverse vs. Longitudinal

Mechanical waves are classified into two primary types based on particle motion relative to wave travel:

| Wave Type | Key Differentiator | Structure | Examples |
|-----------|-------------------|-----------|----------|
| **Transverse** | Particles vibrate **at right angles** to the direction of wave travel | Crests (highest) and Troughs (lowest) | Water waves, light, EM waves, guitar strings |
| **Longitudinal** | Particles vibrate **to and fro along the same line** as the wave's direction | Compressions (closer) and Rarefactions (further apart) | Sound waves, ultrasound, P-waves (earthquakes) |

> **Key Insight:** Visualize a longitudinal wave by pushing and pulling the end of a spring - this sends compressions and rarefactions along its length.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. The Physics of Light (Optics)",
                content: `## A. The Law of Reflection

The Law of Reflection governs how light bounces off a surface:

> **Angle of incidence (i) = Angle of reflection (r)**

Both angles are measured relative to the **normal**, which is a line perpendicular to the reflecting surface at the point of incidence.

## B. The Law of Refraction (Snell's Law)

Refraction is the **bending of light** as it passes from one medium to another. This occurs because the **speed of light changes** when it crosses the boundary between different materials.

### Refractive Index (n):

$$n = \\frac{\\text{Speed of light in air (or vacuum)}}{\\text{Speed of light in medium}}$$

A medium with a higher refractive index is considered **"optically denser"**.

### Snell's Law:

$$n = \\frac{\\sin i}{\\sin r}$$

### Key Principles of Refraction:

| Transition | Light Behaviour | Angle Comparison |
|------------|-----------------|------------------|
| **Air → Glass** (less dense → more dense) | Bends **towards** the normal | i > r |
| **Glass → Air** (more dense → less dense) | Bends **away from** the normal | i < r |
| **Along the normal** | No refraction (straight line) | i = r = 0° |

## C. Converging Lenses and Image Formation

A **converging lens** is thicker at the centre than at the edge. It causes parallel rays of light to converge.

### Key Terminology:

| Term | Definition |
|------|------------|
| **Principal Focus (F)** | The point on the principal axis to which a beam of light parallel to the axis is converged after passing through the lens |
| **Focal Length (f)** | The distance from the centre of the lens to the principal focus |

### Ray Diagram Construction:

To determine the position and nature of an image:
1. A ray travelling **parallel to the principal axis** is refracted to pass through the principal focus (F)
2. A ray passing through the **centre of the lens** continues undeviated
3. The point where these rays intersect marks the **top of the image**

### Image Types:

| Image Type | Characteristics | How Formed |
|------------|-----------------|------------|
| **Real Image** | Can be projected onto a screen | Light rays actually converge at this point |
| **Virtual Image** | Cannot be formed on a screen; only seen by looking through the lens | Light rays appear to diverge from this point |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. The Physics of Sound",
                content: `## A. The Nature of Sound Waves

Sound is a **mechanical wave** that requires a medium for its transmission. It cannot travel through a vacuum.

> **Bell Jar Experiment:** A ringing bell inside a sealed jar becomes inaudible as the air is pumped out - demonstrating sound needs a medium.

### Key Properties:

| Property | Description |
|----------|-------------|
| **Wave Type** | Progressive longitudinal wave |
| **Particle Motion** | Vibrate back and forth parallel to the direction of wave motion |
| **Wave Propagation** | Series of **compressions** (particles closer together) and **rarefactions** (particles spread further apart) |

## B. Echoes and Speed of Sound Calculation

### What is an Echo?

An **echo** is simply the **reflection of a sound wave**. When a sound wave encounters a hard surface (wall, cliff), it bounces back.

### Calculating the Speed of Sound:

The phenomenon of echoes can be used to measure the speed of sound.

**Method:**
1. Measure the **total time (t)** for a sound to travel to a barrier and return
2. Know the **distance (d)** to the barrier
3. Remember: sound travels **to the barrier AND back** = total distance of **2d**

### Formula:

$$v = \\frac{2d}{t}$$

Where:
- **v** = Speed of sound (m/s)
- **d** = Distance to the barrier (m)
- **t** = Total time for round trip (s)

### Worked Example:

**Given:** A person claps 50 m from a wall and hears the echo after 0.3 seconds.

**Solution:**
$$v = \\frac{2d}{t} = \\frac{2 \\times 50}{0.3} = \\frac{100}{0.3} = 333.3 \\text{ m/s}$$`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Wavelength (λ): Distance between successive crests of a wave",
            "Frequency (f): Number of complete waves per second, measured in Hz",
            "Amplitude: Height of crest/depth of trough from undisturbed position",
            "Wave equation: v = f × λ (speed = frequency × wavelength)",
            "Transverse waves: Particles vibrate perpendicular to wave direction (water, light)",
            "Longitudinal waves: Particles vibrate parallel to wave direction (sound)",
            "Law of Reflection: Angle of incidence = Angle of reflection (i = r)",
            "Refractive index (n): Speed in air ÷ Speed in medium",
            "Snell's Law: n = sin i / sin r",
            "Light bends towards normal when entering denser medium (i > r)",
            "Light bends away from normal when entering less dense medium (i < r)",
            "Converging lens: Thicker in centre, brings parallel rays to principal focus",
            "Real image: Can be projected; Virtual image: Only seen through lens",
            "Sound is a longitudinal mechanical wave requiring a medium",
            "Echo calculation: v = 2d/t (remember sound travels there AND back)"
        ],
        exam_tips: [
            "Always identify wave type first: transverse (perpendicular) or longitudinal (parallel)",
            "Use the wave equation v = fλ - ensure units are consistent (m, Hz, m/s)",
            "For reflection problems: always draw the normal line first, then measure angles from it",
            "Snell's Law: remember n = sin i / sin r (angle in air is typically angle i)",
            "When light enters denser medium → slows down → bends towards normal",
            "When light enters less dense medium → speeds up → bends away from normal",
            "For lens ray diagrams: always draw the two key rays (parallel to axis, through centre)",
            "Sound needs medium - this is why the bell jar experiment is important to describe",
            "Echo problems: CRITICAL - use 2d not d because sound travels to barrier AND back",
            "Always state what an echo is (reflection of sound) before calculating"
        ]
    },

    "Electricity (Current Electricity, Circuits)": {
        topic: "Electricity (Current Electricity, Circuits)",
        subject: "Physics",
        summary: "This topic covers electric current as the flow of charge, electromotive force (e.m.f.) and potential difference (p.d.), resistance and Ohm's Law, I-V characteristic graphs, series and parallel circuits, potential dividers with sensors, electrical power and energy calculations, and electrical safety features including fuses, circuit breakers, and earthing.",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/Circuit_Fundamentals_Current_Voltage_Resistance.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL0NpcmN1aXRfRnVuZGFtZW50YWxzX0N1cnJlbnRfVm9sdGFnZV9SZXNpc3RhbmNlLm00YSIsImlhdCI6MTc2NTYwMTAzMCwiZXhwIjo1MjY2MDk3MDMwfQ.C0d-IHvSd8OcZpX3HWA5VrSRj2P3g1EfVjB8ZnCRBKY",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/The_Explainer__Electricity.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvVGhlX0V4cGxhaW5lcl9fRWxlY3RyaWNpdHkubXA0IiwiaWF0IjoxNzY1Nzk3MzMxLCJleHAiOjUyNjYyOTMzMzF9.-CBJD9bf62qdpASxMdgmu7eFAHpxwD_gfNPqPxKrPBA",
        sections: [
            {
                title: "1. Electric Current",
                content: `## A. Definition

**Electric Current (I):** The rate of flow of electric charge.

### Charge Carriers:
- **In Metals:** Free/delocalized electrons
- **In Electrolytes:** Positive and negative ions

### Formula:
$$I = \\frac{Q}{t}$$

Where:
- **I** = Current (Amperes, A)
- **Q** = Charge (Coulombs, C)
- **t** = Time (seconds, s)

**1 Ampere = 1 Coulomb per second**

### Measurement:
- **Ammeter** connected in **SERIES**
- Ideal ammeter has **zero resistance**

## B. Current Direction

| Type | Direction | Usage |
|------|-----------|-------|
| **Conventional Current** | + to − | Circuit diagrams, physics rules |
| **Electron Flow** | − to + | Actual electron movement |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. E.M.F. and Potential Difference",
                content: `## A. Electromotive Force (e.m.f.)

**Definition:** Total energy supplied by the source per unit charge to drive current around complete circuit.

**Energy Conversion:**
- Battery: Chemical → Electrical
- Generator: Mechanical → Electrical
- Solar Cell: Light → Electrical

## B. Potential Difference (p.d.)

**Definition:** Energy converted by a component per unit charge passing through it.

### Formula:
$$V = \\frac{W}{Q}$$

Where:
- **V** = Potential Difference (Volts, V)
- **W** = Work/Energy (Joules, J)
- **Q** = Charge (Coulombs, C)

**1 Volt = 1 Joule per Coulomb**

### Measurement:
- **Voltmeter** connected in **PARALLEL**
- Ideal voltmeter has **infinite resistance**

| Quantity | Measures | Connection | Ideal Resistance |
|----------|----------|------------|------------------|
| Ammeter | Current | Series | Zero |
| Voltmeter | Voltage | Parallel | Infinite |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Resistance and Ohm's Law",
                content: `## A. Resistance (R)

**Definition:** Opposition to current flow.

**Cause:** Electrons collide with vibrating metal ions in the lattice, losing energy as heat.

### Formula:
$$R = \\frac{V}{I}$$

**Unit:** Ohms (Ω)

## B. Ohm's Law

> Current through a metallic conductor is **directly proportional** to voltage, if temperature is constant.

$$V = IR$$

## C. I-V Characteristic Graphs

| Component | Graph Shape | Resistance |
|-----------|-------------|------------|
| **Ohmic Conductor** | Straight line through origin | Constant |
| **Filament Lamp** | S-curve (flattens at high V) | Increases with temperature |
| **Diode** | Zero until ~0.6V, then steep rise | Very low forward, infinite reverse |

## D. Factors Affecting Resistance

| Factor | Relationship | Reason |
|--------|--------------|--------|
| **Length (L)** | R ∝ L | More collisions over longer distance |
| **Area (A)** | R ∝ 1/A | Thicker wire = more "lanes" for electrons |
| **Material (ρ)** | Depends on resistivity | Different atomic structures |
| **Temperature** | Metals: ↑T = ↑R | More ion vibration = more collisions |

### Resistivity Equation:
$$R = \\frac{\\rho L}{A}$$`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Series and Parallel Circuits",
                content: `## A. Series Circuits

Components in a single chain.

| Property | Rule |
|----------|------|
| **Current** | Same throughout: I = I₁ = I₂ |
| **Voltage** | Shared: V = V₁ + V₂ |
| **Resistance** | Adds up: R = R₁ + R₂ |

**Effect:** More resistors = Higher total R = Lower current

## B. Parallel Circuits

Components in separate branches.

| Property | Rule |
|----------|------|
| **Current** | Splits: I = I₁ + I₂ |
| **Voltage** | Same in each branch: V = V₁ = V₂ |
| **Resistance** | 1/R = 1/R₁ + 1/R₂ |

**Two Resistor Shortcut:**
$$R_{total} = \\frac{R_1 \\times R_2}{R_1 + R_2}$$

**Effect:** More branches = Lower total R = Higher current

## C. Potential Dividers

Two resistors in series to split voltage.

$$V_{out} = V_{in} \\times \\frac{R_2}{R_1 + R_2}$$

**Application:** Replace one resistor with LDR or thermistor for automatic switching circuits.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Input Transducers (Sensors)",
                content: `## A. Light Dependent Resistor (LDR)

**Function:** Resistance changes with light intensity.

| Condition | Resistance |
|-----------|------------|
| **Bright Light** | LOW (photons release electrons) |
| **Darkness** | HIGH (few free electrons) |

**Mnemonic: LURD** (Light Up, Resistance Down)

**Use:** Street lights, automatic garden lights

## B. Thermistor (NTC Type)

**Function:** Resistance changes with temperature.
(NTC = Negative Temperature Coefficient)

| Condition | Resistance |
|-----------|------------|
| **Hot** | LOW (thermal energy releases carriers) |
| **Cold** | HIGH (carriers less mobile) |

**Mnemonic: TURD** (Temperature Up, Resistance Down)

**Use:** Fire alarms, thermostats, car temperature gauges`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Electrical Power and Energy",
                content: `## A. Power

**Definition:** Rate of energy transfer.

### Formulas:
$$P = VI$$
$$P = I^2R$$ (heat loss in cables)
$$P = \\frac{V^2}{R}$$ (when voltage constant)

**Unit:** Watt (W)

## B. Energy

### Formula:
$$E = Pt = VIt$$

### Units:
- **Joules (J):** SI unit
- **Kilowatt-hour (kWh):** Commercial/billing unit

**1 kWh = 1000 W × 1 hour = 3,600,000 J**

**Example:** 2 kW heater for 3 hours = 2 × 3 = 6 kWh`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Electrical Safety",
                content: `## A. Hazards

| Hazard | Danger |
|--------|--------|
| **Damaged insulation** | Exposed live wires → shock |
| **Overloading** | Excess current → overheating → fire |
| **Damp conditions** | Water conducts → shock |

## B. Safety Features

### Fuse:
- Thin wire rated for maximum current (e.g., 3A, 13A)
- Melts ("blows") if current exceeds rating
- Breaks circuit to prevent fire

### Circuit Breaker:
- Electromagnetic switch that "trips" when current too high
- **Advantage:** Faster, can be reset (no replacement needed)

### Earthing (Earth Wire):
- Green/yellow wire connected to metal casing
- If live wire touches casing, current flows to ground
- Large surge blows fuse instantly

### Double Insulation:
- Plastic casing (insulator) instead of metal
- No earth wire needed
- **Symbol:** □ inside □`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Current I = Q/t; measured with ammeter in series",
            "Voltage V = W/Q; measured with voltmeter in parallel",
            "Ohm's Law: V = IR (current ∝ voltage at constant temperature)",
            "Resistance factors: length (R∝L), area (R∝1/A), material, temperature",
            "Series: same current, V shared, R adds up",
            "Parallel: same voltage, I splits, 1/R = 1/R₁ + 1/R₂",
            "LDR: Light up = Resistance down (LURD)",
            "Thermistor: Temperature up = Resistance down (TURD)",
            "Power: P = VI = I²R = V²/R",
            "Energy: E = Pt; 1 kWh = 3,600,000 J",
            "Fuse melts to break circuit; earth wire provides safe path to ground"
        ],
        exam_tips: [
            "Remember: ammeter in SERIES, voltmeter in PARALLEL",
            "Use correct power formula based on given values",
            "Calculate total resistance correctly for series vs parallel",
            "Know I-V graph shapes for resistor, lamp, and diode",
            "LDR and thermistor: know how resistance changes",
            "Explain how earthing + fuse work together for safety",
            "Convert between J and kWh for energy calculations"
        ]
    },

    "Magnetism and Electromagnetism": {
        topic: "Magnetism and Electromagnetism",
        subject: "Physics",
        summary: "Electromagnetic induction is the phenomenon where a voltage is produced (induced) in an electrical conductor by moving it through a magnetic field or by changing the magnetic field around it. This principle forms the fundamental basis for modern electricity generation and power transmission. The key laws governing induction are Faraday's Law (magnitude of induced voltage) and Lenz's Law (direction of induced current). Applications include AC and DC generators, and transformers for efficient power distribution.",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/Magnetic_Domains_and_How_to_Control_Them.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL01hZ25ldGljX0RvbWFpbnNfYW5kX0hvd190b19Db250cm9sX1RoZW0ubTRhIiwiaWF0IjoxNzY1NjAxMTY3LCJleHAiOjUyNjYwOTcxNjd9.jUhA2hhqgu1sr7JM1saParWaxfgn9Xvt2k6hrko5AcE",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/Magnetism__The_Hidden_Force.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvTWFnbmV0aXNtX19UaGVfSGlkZGVuX0ZvcmNlLm1wNCIsImlhdCI6MTc2NTc5NzI5NywiZXhwIjo1MjY2MjkzMjk3fQ.bnVjVTBvjBY0vlzKSLcDRk3qWKoR0j8NCMLksJ_bhrY",
        sections: [
            {
                title: "1. Introduction to Electromagnetic Induction",
                content: `## What is Electromagnetic Induction?

> **Electromagnetic induction** is the phenomenon where a voltage is produced (induced) in an electrical conductor by moving it through a magnetic field or by changing the magnetic field around it.

This principle forms the fundamental basis for **modern electricity generation** and large-scale power transmission.

## Demonstrating Electromagnetic Induction

### Experiment 1: Moving Wire in Magnetic Field
- Connect a wire to a sensitive meter
- Move the wire **up or down** between the poles of a magnet
- **Result**: Meter shows a deflection (current induced)
- **Crucial**: Deflection only occurs **while the wire is in motion**
- If wire is stationary, **no current** is produced

### Experiment 2: Magnet Moving into Coil
- Push a bar magnet **into** a coil of wire → Current induced in one direction
- Pull the magnet **out** of the coil → Current induced in **opposite direction**
- Hold magnet **stationary** inside coil → **No current flows**

## The Core Principle

| Key Requirement | Effect |
|-----------------|--------|
| **Relative motion** between conductor and magnetic field | Conductor "cuts" through magnetic field lines |
| **Cutting field lines** | Direct cause of induced voltage |
| **No motion** | No induced voltage |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. The Governing Laws of Induction",
                content: `## Faraday's Law: The Magnitude of Induced Voltage

> **Faraday's Law** states that a voltage is induced in a conductor whenever it cuts magnetic field lines. The magnitude of the induced voltage is proportional to the **rate of change of magnetic flux**.

### Three Factors That Increase Induced Voltage:

| Factor | Explanation |
|--------|-------------|
| **Speed** | Increasing the speed at which the conductor moves through the field (cuts field lines faster) |
| **Field Strength** | Using a stronger magnet (more field lines to cut) |
| **Conductor Length** | Increasing the length of conductor in the field (use a coil with many turns) |

**Memory Aid**: "Faster you cut field lines = More voltage"

## Lenz's Law: The Direction of Induced Current

> **Lenz's Law** states: "The direction of the induced current is such as to **oppose the change** causing it."

### Conservation of Energy Explanation

| Action | Result | Why? |
|--------|--------|------|
| Push N-pole into coil | Coil creates N-pole at that end | Repels incoming magnet |
| Work must be done | Against this opposing force | This work provides energy for the induced current |

**Key Insight**: The induced magnetic field always **opposes** the motion that created it.

## Fleming's Right-Hand Rule

A practical tool to determine the direction of induced current.

### Hold Right Hand with Thumb + First + Second Fingers at 90°:

| Finger | Represents | Memory Aid |
|--------|------------|------------|
| **Thumb** | Direction of **M**otion (conductor) | thu**M**b = **M**otion |
| **First Finger** | Direction of magnetic **F**ield (N→S) | **F**irst = **F**ield |
| **Second Finger** | Direction of induced **C**urrent | se**C**ond = **C**urrent |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Electrical Generators",
                content: `## The A.C. Generator (Alternator)

The most significant application of electromagnetic induction—converts **mechanical energy → electrical energy**.

### Key Components:

| Component | Function |
|-----------|----------|
| **Rectangular coil** | Rotates in the magnetic field |
| **Permanent magnet** | Provides the magnetic field |
| **Slip rings** | Fixed to axle, rotate with coil |
| **Carbon brushes** | Maintain contact with slip rings |

### How It Works:

1. As the coil rotates, one side moves **upward** and the other **downward**
2. Current is induced in one direction
3. After 180° rotation, the direction of motion reverses
4. **Current direction reverses** → produces **Alternating Current (A.C.)**

### The Output Waveform:

| Coil Position | Rate of Cutting Field Lines | Voltage |
|---------------|----------------------------|---------|
| **Horizontal** | Maximum (moving vertically through field) | **Peak voltage** |
| **Vertical** | Zero (moving parallel to field) | **Zero voltage** |

This produces a **sinusoidal (sine wave)** output.

## The D.C. Generator (Dynamo)

Similar to the A.C. generator but produces **Direct Current**.

### The Critical Difference:

| Feature | A.C. Generator | D.C. Generator |
|---------|----------------|----------------|
| **Output connector** | Slip rings | **Split-ring commutator** |
| **Current direction** | Alternates | Always same direction |

### How the Commutator Works:

1. Commutator is a ring split into two halves
2. Each half connects to one end of the coil
3. Every half-rotation, the segments **swap contact** with the brushes
4. This happens **exactly when** current in the coil reverses
5. **Result**: Current in external circuit always flows in the **same direction**

The output is **pulsating D.C.**—rises and falls in magnitude but never reverses.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Transformers",
                content: `## What is a Transformer?

> A **transformer** is a passive electrical device that uses electromagnetic induction to efficiently **change the voltage** of an alternating current.

Transformers are **indispensable** in the electrical grid for:
- **Step-up**: Increase voltage for efficient long-distance transmission
- **Step-down**: Decrease voltage to safe, usable levels for consumers

## Structure and Principle of Operation

### Key Components:

| Component | Function |
|-----------|----------|
| **Primary coil** | Input coil (connected to A.C. supply) |
| **Secondary coil** | Output coil (connected to load) |
| **Soft iron core** | Links magnetic flux between coils |

### How It Works:

1. A.C. flows through primary coil
2. Creates a **continuously changing magnetic field** in the iron core
3. Iron core **guides** this changing field to the secondary coil
4. Changing field **induces an alternating voltage** in secondary coil

> ⚠️ **CRITICAL**: Transformers **ONLY work with A.C.** — D.C. produces a steady, unchanging magnetic field, so no induction occurs!

## Transformer Equations

### Voltage-Turns Ratio:

$$\\frac{V_p}{V_s} = \\frac{N_p}{N_s}$$

| Symbol | Meaning |
|--------|---------|
| Vp | Primary voltage |
| Vs | Secondary voltage |
| Np | Number of turns on primary coil |
| Ns | Number of turns on secondary coil |

### Types of Transformers:

| Type | Turns Relationship | Voltage | Current |
|------|-------------------|---------|---------|
| **Step-Up** | Ns > Np | **Increases** | Decreases |
| **Step-Down** | Ns < Np | **Decreases** | Increases |

### Power Conservation (Ideal Transformer):

$$V_p \\times I_p = V_s \\times I_s$$

**Key Insight**: If voltage steps **up**, current steps **down** (and vice versa) to conserve energy.

## Power Transmission

### The Problem:
Power loss in cables = **I²R** (heat loss)

### The Solution:
Transmit at **HIGH VOLTAGE** (e.g., 400,000V)

| Step | Purpose |
|------|---------|
| Step-up transformer at power station | Increases V, decreases I |
| Lower current | **Much less I²R heat loss** |
| Step-down transformers locally | Reduces voltage to safe 230V |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Summary of Key Principles",
                content: `## Core Takeaways for Revision

| Principle | Key Points |
|-----------|------------|
| **Core Requirement** | Electric current is induced ONLY when there is **relative motion** between conductor and magnetic field |
| **Faraday's Law** | Magnitude of induced voltage ∝ rate of cutting field lines (speed, field strength, conductor length) |
| **Lenz's Law** | Induced current creates a magnetic field that **OPPOSES the change** causing it (conservation of energy) |
| **Generators** | Use continuous rotation to induce continuous current; slip rings for A.C., commutator for D.C. |
| **Transformers** | Use EM induction between coils to change A.C. voltages; essential for efficient power distribution |

## Fleming's Right-Hand Rule Summary

| Finger | Represents |
|--------|------------|
| **Thumb** | Motion of conductor |
| **First (index)** | Field direction (N→S) |
| **Second (middle)** | Current direction |

## Generator Comparison

| Feature | A.C. Generator | D.C. Generator |
|---------|----------------|----------------|
| Output type | Alternating current | Direct current |
| Connector | Slip rings | Split-ring commutator |
| Waveform | Sine wave | Pulsating D.C. |

## Transformer Equation Summary

| Equation | Purpose |
|----------|---------|
| Vp/Vs = Np/Ns | Voltage-turns relationship |
| Vp × Ip = Vs × Is | Power conservation |`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Electromagnetic induction: voltage is induced when a conductor moves through a magnetic field (or field changes around it)",
            "Induction requires RELATIVE MOTION between conductor and field—no motion means no induced voltage",
            "Faraday's Law: induced voltage ∝ rate of cutting field lines (increase speed, field strength, or number of turns)",
            "Lenz's Law: induced current opposes the change causing it (conservation of energy)",
            "Fleming's Right-Hand Rule: thuMb=Motion, First=Field, seCond=Current",
            "A.C. Generator uses SLIP RINGS to produce alternating current (sine wave output)",
            "D.C. Generator uses SPLIT-RING COMMUTATOR to produce direct current (pulsating output)",
            "Horizontal coil = maximum e.m.f.; Vertical coil = zero e.m.f.",
            "Transformers ONLY work with A.C. (D.C. produces constant field = no induction)",
            "Transformer equation: Vp/Vs = Np/Ns; Power: Vp × Ip = Vs × Is",
            "Step-up transformer: increases voltage, decreases current; Step-down: decreases voltage, increases current",
            "High voltage transmission reduces power loss (P = I²R, so lower I = much less heat loss)"
        ],
        exam_tips: [
            "Always state that induction requires RELATIVE MOTION or CHANGING magnetic field",
            "Use Fleming's RIGHT-Hand Rule for generators; LEFT-Hand Rule for motors",
            "Know why there's NO current when magnet is stationary inside coil (no field change)",
            "Explain Lenz's Law in terms of conservation of energy (work must be done against opposing force)",
            "Distinguish between slip rings (A.C.) and split-ring commutator (D.C.)",
            "Remember: horizontal coil = max voltage, vertical coil = zero voltage",
            "Explain why transformers don't work with D.C. (steady field = no induction)",
            "Practice transformer calculations: Vp/Vs = Np/Ns",
            "Know why high voltage is used for transmission (reduces I²R power loss)",
            "If voltage steps UP, current steps DOWN (conservation of energy)"
        ]
    },

    "Electronics (Logic Gates, Components)": {
        topic: "Electronics (Logic Gates, Components)",
        subject: "Physics",
        summary: "This comprehensive topic covers the essential building blocks of electronic systems, including core components that direct and control the flow of electric current (diodes, capacitors, LDRs, thermistors) and digital logic gates (NOT, AND, OR, NAND, NOR) that serve as the foundation for digital circuits and computation.",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/Analogue_Digital_Signals_and_Logic_Gates.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL0FuYWxvZ3VlX0RpZ2l0YWxfU2lnbmFsc19hbmRfTG9naWNfR2F0ZXMubTRhIiwiaWF0IjoxNzY1NjAxMDExLCJleHAiOjUyNjYwOTcwMTF9.9prhXiTd9i3aBjCqdVd1XXBtMshtSSsRnHaoDbWpgpo",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/The_Logic_of_Electronics.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvVGhlX0xvZ2ljX29mX0VsZWN0cm9uaWNzLm1wNCIsImlhdCI6MTc2NTc5NzM2MiwiZXhwIjo1MjY2MjkzMzYyfQ.YgTLz1aPtXIfV4R0-iKv3NGkfoAYaws-1703XGMPp4s",
        sections: [
            {
                title: "1. Core Electronic Components",
                content: `## A. Diodes

A **semiconductor diode** is a component that permits current to flow in **only one direction**, a critical function known as **rectification**.

### Function:
- Allows passage of one half of an alternating current (a.c.) cycle while blocking the other
- Effectively converts **a.c. into direct current (d.c.)**
- Essential for powering electronic devices that require a steady, one-directional current

## B. Capacitors

The primary function of a **capacitor** is to **store electric charge**.

### How It Works:
1. When connected to a power source, the positive terminal attracts electrons from one plate
2. The negative terminal repels electrons onto the other plate
3. This builds up a **positive charge** on the first plate and an **equal negative charge** on the second
4. A **potential difference** is established across the capacitor
5. Once fully charged to the voltage of the supply, the capacitor effectively **blocks the flow of direct current**

## C. Input Sensors

### Light-Dependent Resistor (LDR):
- An input transducer whose resistance changes in response to **light intensity**
- **Key Principle:** Resistance **decreases** as light intensity **increases**

### Thermistor:
- An input transducer whose resistance changes significantly with **temperature**
- **Key Principle:** Resistance **falls** as temperature **rises**

### Applications:
Both LDR and thermistor are frequently used as **variable resistors** within **potential divider circuits**, allowing changes in light or temperature to be converted into a **voltage signal** that can control other parts of a system, such as a transistor switch.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Digital Logic Gates",
                content: `## What Are Logic Gates?

Logic gates are the **fundamental building blocks of digital electronic circuits**. They perform logical operations on one or more binary inputs to produce a single binary output.

### Binary States:
| State | Representation |
|-------|----------------|
| **Low** | 0 |
| **High** | 1 |

## NOT Gate (Inverter)

A NOT gate is an **inverter** that produces an output which is the **logical opposite** of its single input.

| Input | Output |
|-------|--------|
| 0 | **1** |
| 1 | **0** |

## AND Gate

An AND gate produces a **high (1) output only if ALL of its inputs are high (1)**.

| Input A | Input B | Output |
|---------|---------|--------|
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | **1** |

## OR Gate

An OR gate produces a **high (1) output if ANY of its inputs are high (1)**.

| Input A | Input B | Output |
|---------|---------|--------|
| 0 | 0 | 0 |
| 0 | 1 | **1** |
| 1 | 0 | **1** |
| 1 | 1 | **1** |

## NAND Gate (NOT-AND)

A NAND gate produces a **low (0) output only if ALL of its inputs are high (1)**.

| Input A | Input B | Output |
|---------|---------|--------|
| 0 | 0 | **1** |
| 0 | 1 | **1** |
| 1 | 0 | **1** |
| 1 | 1 | 0 |

> **Construction:** AND gate followed by NOT gate

## NOR Gate (NOT-OR)

A NOR gate produces a **high (1) output only if ALL of its inputs are low (0)**.

| Input A | Input B | Output |
|---------|---------|--------|
| 0 | 0 | **1** |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 0 |

> **Construction:** OR gate followed by NOT gate`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Diode: Allows current flow in one direction only (rectification) - converts a.c. to d.c.",
            "Capacitor: Stores electric charge; blocks d.c. when fully charged",
            "LDR (Light-Dependent Resistor): Resistance DECREASES as light intensity INCREASES",
            "Thermistor: Resistance FALLS as temperature RISES",
            "LDR and thermistor used in potential divider circuits as variable resistors",
            "Logic gates: Fundamental building blocks of digital circuits",
            "NOT gate: Inverts input (0→1, 1→0)",
            "AND gate: Output HIGH only if ALL inputs are HIGH",
            "OR gate: Output HIGH if ANY input is HIGH",
            "NAND gate: Opposite of AND - output LOW only if ALL inputs HIGH",
            "NOR gate: Opposite of OR - output HIGH only if ALL inputs LOW",
            "NAND = AND followed by NOT; NOR = OR followed by NOT"
        ],
        exam_tips: [
            "Diodes allow current in ONE direction only - draw arrow showing current direction",
            "Remember: LDR - Light UP, Resistance DOWN; Thermistor - Temp UP, Resistance DOWN",
            "Memorize all five logic gate truth tables - they are frequently examined",
            "NOT gate is the only single-input gate; all others have two inputs",
            "AND gate: Think 'both A AND B must be 1'",
            "OR gate: Think 'A OR B (or both) must be 1'",
            "NAND truth table: Opposite of AND (flip all outputs)",
            "NOR truth table: Opposite of OR (flip all outputs)",
            "Be able to construct truth tables for combined logic gate circuits",
            "Know the applications of input sensors (LDR in light-sensitive circuits, thermistor in temperature-sensitive circuits)"
        ]
    },


    "Atomic and Nuclear Physics (Modern Physics)": {
        topic: "Atomic and Nuclear Physics (Modern Physics)",
        subject: "Physics",
        summary: "The nuclear model describes the atom as having an incredibly dense, positively charged central core—the nucleus—containing almost all of the atom's mass. The nucleus is composed of protons and neutrons (nucleons), with the proton number defining the element. Radioactivity is the spontaneous emission of radiation from unstable nuclei, with three types: alpha (helium nuclei), beta (electrons), and gamma (electromagnetic waves). Half-life quantifies decay rate, and radioactive materials have important applications in medicine, industry, and research.",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/The_Atom_Is_Mostly_Empty_Space%20(1).m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL1RoZV9BdG9tX0lzX01vc3RseV9FbXB0eV9TcGFjZSAoMSkubTRhIiwiaWF0IjoxNzY1NjAxMjEwLCJleHAiOjUyNjYwOTcyMTB9.9xI06cISSA7M9623jS5mGCK25wO65JnfcG-JPdNPqZQ",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/Atomic_&_Nuclear_Physics.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvQXRvbWljXyZfTnVjbGVhcl9QaHlzaWNzLm1wNCIsImlhdCI6MTc2NTc5NzI2NCwiZXhwIjo1MjY2MjkzMjY0fQ.14qsNly_ar7TUbW5-9wfjSFCz3WM0rfJZHDi-HDB_NM",
        sections: [
            {
                title: "1. The Structure of the Atom: The Nuclear Model",
                content: `## The Nuclear Model

The nuclear model describes the atom as a system with an incredibly dense, positively charged central core—the ** nucleus **—which contains almost all of the atom's mass.

## Defining the Nucleus: Protons and Nucleons

The nucleus is composed of two primary types of particles, collectively known as ** nucleons **:

| Particle | Symbol | Charge | Mass | Role |
| ----------| --------| --------| ------| ------|
| ** Proton ** | p | +1 | 1 | Identifies element(defines Z) |
| ** Neutron ** | n | 0 | 1 | Adds mass, provides stability |

### Key Numbers:

| Number | Symbol | Definition |
| --------| --------| ------------|
| ** Proton Number(Z) ** | Z | Number of protons in the nucleus |
| ** Nucleon Number(A) ** | A | Total number of nucleons(protons + neutrons) |
| ** Neutrons ** | A - Z | Calculated by subtracting Z from A |

## Standard Nuclide Notation

To uniquely identify a specific nucleus(nuclide), use this format:

$$ ^ A_Z X$$

Where:
- ** X ** = Chemical symbol of the element
    - ** A ** (superscript) = Nucleon Number(mass number) — ** always the larger number **
- ** Z ** (subscript) = Proton Number(atomic number)

    ** Example:** $$ ^ { 226}_{ 88 } Ra$$(Radium)
        - Proton Number(Z) = 88
            - Nucleon Number(A) = 226
                - Neutrons = 226 - 88 = ** 138 **

## Understanding Isotopes

    > ** Isotopes ** are atoms of the same element that contain the same number of protons but have a ** different number of neutrons **.

| Property | Same or Different ? |
| ----------| -------------------|
| Proton number(Z) | ** Same ** |
| Nucleon number(A) | ** Different ** |
| Chemical properties | ** Same ** (same electrons) |
| Physical properties | ** Different ** (different mass) |

** Example:** Carbon - 12(6p, 6n) vs Carbon - 14(6p, 8n)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. The Nature of Radioactivity and its Emissions",
                content: `## What is Radioactivity ?

    Radioactivity is a natural process originating from the nuclei of ** unstable atoms **.In an attempt to become more stable, these nuclei emit energy in the form of radiation.

## The Three Types of Radiation

    | Radiation Type | Nature | Penetrating Power | Ionising Power |
| ----------------| --------| -------------------| ----------------|
| ** Alpha(α) ** | Helium nucleus(2p + 2n) | Stopped by ** paper ** or few cm of air | ** High ** |
| ** Beta(β) ** | Fast - moving electrons | Stopped by ** few mm of aluminium ** | Medium |
| ** Gamma(γ) ** | Electromagnetic waves | Reduced by ** several cm of lead ** | Low |

## Behaviour in Electric Fields

    | Radiation | Behaviour | Reason |
| -----------| -----------| --------|
| ** Alpha(α) ** | Deflected towards ** negative plate ** | Positively charged(+2), but large mass = less deflection |
| ** Beta(β) ** | Strongly deflected towards ** positive plate ** | Negatively charged(-1), very small mass = large deflection |
| ** Gamma(γ) ** | ** Completely undeflected ** | No charge |

## Behaviour in Magnetic Fields

    - Magnetic fields exert force on ** moving charged particles **, causing curved paths
        - Use ** Fleming's Left-Hand Rule** to predict direction
            - ** Beta particles ** (negative) deflect ** opposite ** to conventional current direction
                - ** Gamma rays ** are ** unaffected ** (no charge)

## Detecting Radiation

### Geiger - Müller(GM) Tube:
1. Radiation enters through thin ** mica window **
    2. ** Ionizes argon gas ** atoms
3. Electrons accelerated by high voltage → cascade of ionization
4. Creates ** current pulse ** → registered as a "click"

### Background Radiation:
Always present from natural sources(radon gas, cosmic rays, Carbon - 14)
    - Must ** subtract ** from readings for "corrected count rate"`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. The Process of Radioactive Decay",
                content: `## The Spontaneous and Random Nature of Decay

Radioactive decay is defined by two key characteristics:

| Characteristic | Meaning |
| ----------------| ---------|
| ** Spontaneous ** | The decay process is NOT influenced by external factors(temperature, pressure, chemical environment) |
| ** Random ** | It is ** impossible to predict ** which specific nucleus will decay at any given moment |

> ** Exam Tip:** "Random" means you cannot predict which individual nucleus decays next or when—we can only describe the overall rate for a large number of nuclei.

## Balancing Nuclear Equations

When a nucleus decays, both ** Nucleon Number(A) ** and ** Proton Number(Z) ** must be conserved on both sides of the equation.

## Alpha(α) Decay

The nucleus emits an alpha particle(Helium nucleus: $$ ^ 4_2He$$)

    | Change | Effect |
| --------| --------|
| Nucleon Number(A) | ** Decreases by 4 ** |
| Proton Number(Z) | ** Decreases by 2 ** |

** Example:** $$ ^ { 226}_{ 88 } Ra \\rightarrow ^ { 222}_{ 86 } Rn + ^ 4_2He$$

## Beta(β) Decay

The nucleus emits a beta particle(high - energy electron: $$ ^0_{- 1}e$$)
This occurs when a ** neutron converts to a proton ** and an electron.

| Change | Effect |
| --------| --------|
| Nucleon Number(A) | ** Unchanged ** |
| Proton Number(Z) | ** Increases by 1 ** |

** Example:** $$ ^ { 234}_{ 90 } Th \\rightarrow ^ { 234}_{ 91 } Pa + ^0_{ -1 } e$$

## Gamma(γ) Decay

Emission of a high - energy photon—allows nucleus to transition from high - energy state to lower, more stable state.Often occurs after alpha or beta decay.

| Change | Effect |
| --------| --------|
| Nucleon Number(A) | ** Unchanged ** |
| Proton Number(Z) | ** Unchanged ** | `,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Understanding and Calculating Half-Life",
                content: `## Defining Half - Life(t₁/₂)

    > The ** half - life ** of a radioactive element is the average time taken for ** half of the atoms ** in a given sample to decay.

        Alternatively: The time required for the ** activity ** (rate of decay) to fall to half of its initial value.

## Interpreting the Decay Curve

### Steps to find half - life from a graph:

1. ** Identify Initial Activity:** Note the activity at t = 0(e.g., 80 units)
2. ** Calculate Half - Activity:** Divide by 2(80 ÷ 2 = 40 units)
3. ** Find the First Half - Life:** Trace from 40 units horizontally to curve, then down to time axis
4. ** Confirm the Constant:** Repeat from 40 to 20 units—time should be the same

## Solving Half - Life Problems

### Example Problem:
"In an experiment, the count-rate falls from **200 counts/s to 25 counts/s** in **75 minutes**. What is the half-life?"

### Solution:

** Step 1:** Track the decay by successive halving:

| Half - Life | Count Rate |
| -----------| ------------|
| Start | 200 counts / s |
| 1st half - life | 100 counts / s |
| 2nd half - life | 50 counts / s |
| 3rd half - life | ** 25 counts / s ** |

** Step 2:** Count the number of half - lives: ** 3 half - lives **

** Step 3:** Calculate:
- 3 half - lives = 75 minutes
    - 1 half - life = 75 ÷ 3 = ** 25 minutes **

## Quick Reference

    | Starting Activity | After 1 t₁/₂ | After 2 t₁/₂ | After 3 t₁/₂ |
        | -------------------| --------------| --------------| --------------|
| 100 % | 50 % | 25 % | 12.5 % | `,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Applications and Safety of Radioactive Materials",
                content: `## Detecting Radiation

### Geiger - Müller(GM) Tube:
1. Metal cylinder(cathode) with central wire(anode)
2. Filled with low - pressure argon gas, sealed by thin mica window
3. Radiation ionizes argon gas
4. Electrons accelerated → cascade of ionization
5. Current pulse registered as a "click" on counter

### Cloud and Bubble Chambers:
Visualize paths of individual particles—radiation leaves visible trails in supersaturated vapour.

## Practical Uses of Radioisotopes

    | Application | Radiation Type | Why This Type ? |
| -------------| ----------------| ----------------|
| ** Radioactive Tracers ** | Gamma | Can be detected outside the body |
| ** Thickness Control ** | Beta | Absorbed proportionally by material thickness |
| ** Sterilization ** | Gamma | High penetrating power—reaches all parts |

### Thickness Control(Paper Mills):
- Beta source on one side, detector on the other
    - If paper too thick → less radiation detected → adjust rollers
        - Alpha too easily stopped; Gamma too penetrating

### Sterilization:
Gamma rays used due to ** high penetrating power **—sterilizes even inside packaging.

## Essential Safety Precautions

Ionizing radiation damages living tissue(DNA damage → mutations / cancer)

### The Three Core Principles:

| Principle | Method |
| -----------| --------|
| ** Distance ** | Use forceps / tongs to maximize distance from source.Intensity drops with distance² |
| ** Shielding ** | Store in ** lead - lined boxes **.Lead absorbs all three types, especially gamma |
| ** Time ** | Limit exposure duration to the ** absolute minimum ** necessary | `,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "The nucleus contains protons and neutrons (nucleons); proton number (Z) identifies the element",
            "Nuclide notation: $$^A_Z X$$ where A (top) = nucleon number, Z (bottom) = proton number",
            "Isotopes: same proton number, different neutron number → same chemical properties, different mass",
            "Radioactive decay is SPONTANEOUS (unaffected by external conditions) and RANDOM (cannot predict which nucleus decays)",
            "Alpha (α): helium nucleus (+2), stopped by paper, highest ionizing power",
            "Beta (β): fast electron (-1), stopped by aluminium, deflected towards positive plate",
            "Gamma (γ): EM wave (neutral), reduced by lead, undeflected by fields",
            "Alpha decay: A decreases by 4, Z decreases by 2; Beta decay: A unchanged, Z increases by 1",
            "Half-life: average time for half of the radioactive nuclei to decay",
            "Half-life calculations: divide by 2 for each half-life, count how many halvings",
            "Radioisotope applications depend on penetrating power and half-life",
            "Safety precautions: Distance (use tongs), Shielding (lead-lined boxes), Time (minimize exposure)"
        ],
        exam_tips: [
            "Remember nuclide notation: A (mass) is the LARGER number on TOP, Z (atomic) is on BOTTOM",
            "Calculate neutrons: Neutrons = A - Z (nucleon number minus proton number)",
            "Know the behaviour of each radiation type in electric and magnetic fields",
            "Explain why 'random' means we cannot predict which nucleus decays next",
            "Practice balancing nuclear equations: A and Z must be conserved on both sides",
            "For half-life problems: track successive halvings to find number of half-lives, then divide total time",
            "Explain why specific radioisotopes are chosen for specific applications (penetrating power + half-life)",
            "Know the three safety principles: Distance, Shielding, Time",
            "Beta particles deflect opposite to conventional current (they are negative)",
            "Gamma rays are unaffected by fields because they have no charge"
        ]
    }
};

