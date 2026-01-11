// A Level Physics Notes - Comprehensive notes for each topic
import { TopicNotes } from '../scienceNotes/types';

console.log('🚀 A Level Physics notes.ts file is being loaded!');

// Complete notes for each A Level Physics topic
export const aLevelPhysicsNotes: Record<string, TopicNotes> = {
    "Physical Quantities and Units": {
        topic: "Physical Quantities and Units",
        TEST_MARKER: "FILE_LOADED_2026", // DELETE THIS LINE AFTER TESTING
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/A%20level/Physical_Quantities_&_Units.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvQSBsZXZlbC9QaHlzaWNhbF9RdWFudGl0aWVzXyZfVW5pdHMubXA0IiwiaWF0IjoxNzY4MTA2ODc1LCJleHAiOjUyNjg2MDI4NzV9.ekYrH9aW-IMS57rjenTjrLjq2YqmGP6kv0_Ofu2TaZs",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/A%20level/SI_Units_Vectors_and_Measurement_Uncertainty.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL0EgbGV2ZWwvU0lfVW5pdHNfVmVjdG9yc19hbmRfTWVhc3VyZW1lbnRfVW5jZXJ0YWludHkubTRhIiwiaWF0IjoxNzY4MDc1NTAyLCJleHAiOjUyNjg1NzE1MDJ9.SrkiAv2LESTZLflqe2FZ1oaFdYSCofPobX-Bzg30yIc",
        subject: "A Level Physics",
        summary: "Physical quantities and units form the foundation of physics. This topic covers SI base units and derived units, standard prefixes, dimension analysis, uncertainties in measurements, and the distinction between scalar and vector quantities. Understanding these concepts is essential for all physics calculations and experimental work.",
        sections: [
            {
                title: "1. SI Base Units",
                content: `## The International System of Units

Physics relies on precise measurement, and all measurements require units. The **SI system** (Système International) provides a standardised set of units used worldwide.

### The Seven SI Base Units

| Quantity | Unit | Symbol |
|----------|------|--------|
| Mass | kilogram | kg |
| Length | metre | m |
| Time | second | s |
| Electric current | ampere | A |
| Temperature | kelvin | K |
| Amount of substance | mole | mol |
| Luminous intensity | candela | cd |

**Key Points:**
- These are the ONLY base units - all others are derived from them
- The kilogram (not gram) is the base unit for mass
- Temperature uses Kelvin (not Celsius) in physics equations

### Why SI Units Matter

1. **Universal communication** - Scientists worldwide use the same system
2. **Consistency in equations** - Physics equations work correctly with SI units
3. **Avoid errors** - Conversion mistakes can be catastrophic (Mars Climate Orbiter crash)

### Converting to SI

Always convert to SI base units before calculations:
- km → m (multiply by 1000)
- g → kg (divide by 1000)
- °C → K (add 273)
- hours → seconds (multiply by 3600)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. SI Derived Units",
                content: `## Units Derived from Base Units

**Derived units** are combinations of base units, created through multiplication or division.

### Common Derived Units

| Quantity | Unit | Symbol | In Base Units |
|----------|------|--------|---------------|
| Force | newton | N | kg m s⁻² |
| Energy | joule | J | kg m² s⁻² |
| Power | watt | W | kg m² s⁻³ |
| Pressure | pascal | Pa | kg m⁻¹ s⁻² |
| Frequency | hertz | Hz | s⁻¹ |
| Charge | coulomb | C | A s |
| Potential difference | volt | V | kg m² s⁻³ A⁻¹ |
| Resistance | ohm | Ω | kg m² s⁻³ A⁻² |

### Deriving Units

**Example 1: Force (F = ma)**
- Force = mass × acceleration
- [F] = kg × m s⁻² = kg m s⁻²
- This is the newton (N)

**Example 2: Energy (E = Fd)**
- Energy = force × distance
- [E] = N × m = kg m s⁻² × m = kg m² s⁻²
- This is the joule (J)

**Example 3: Power (P = E/t)**
- Power = energy / time
- [P] = J / s = kg m² s⁻² / s = kg m² s⁻³
- This is the watt (W)

### Checking Equations with Units

Dimensional analysis can verify if an equation is correct:
- Both sides of an equation must have the same units
- If units don't match, the equation is wrong`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. SI Prefixes",
                content: `## Standard Prefixes for Powers of Ten

Prefixes avoid writing very large or very small numbers.

### Common Prefixes

| Prefix | Symbol | Power | Example |
|--------|--------|-------|---------|
| tera | T | 10¹² | 1 THz = 10¹² Hz |
| giga | G | 10⁹ | 1 GW = 10⁹ W |
| mega | M | 10⁶ | 1 MΩ = 10⁶ Ω |
| kilo | k | 10³ | 1 km = 10³ m |
| centi | c | 10⁻² | 1 cm = 10⁻² m |
| milli | m | 10⁻³ | 1 ms = 10⁻³ s |
| micro | μ | 10⁻⁶ | 1 μm = 10⁻⁶ m |
| nano | n | 10⁻⁹ | 1 nm = 10⁻⁹ m |
| pico | p | 10⁻¹² | 1 pF = 10⁻¹² F |
| femto | f | 10⁻¹⁵ | 1 fm = 10⁻¹⁵ m |

### Converting Between Prefixes

**Method 1: Via base units**
1. Convert to base units first
2. Then convert to target prefix

**Example:** Convert 2.5 km to mm
- 2.5 km = 2.5 × 10³ m
- = 2.5 × 10³ × 10³ mm
- = 2.5 × 10⁶ mm

**Method 2: Direct conversion**
Count the power difference:
- km to mm: 10³ to 10⁻³ = difference of 10⁶
- So multiply by 10⁶

### Common Mistakes to Avoid

1. **Squared/cubed units:** cm² to m² is NOT just ÷100
   - 1 cm² = (10⁻² m)² = 10⁻⁴ m²
   
2. **Negative exponents:** μ (10⁻⁶) and M (10⁶) are NOT the same
   
3. **Forgetting conversions:** Mixing km with m in the same calculation`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Scalars and Vectors",
                content: `## Two Types of Physical Quantities

### Scalar Quantities

A **scalar** has magnitude (size) only.

**Examples of scalars:**
- Mass (5 kg)
- Temperature (300 K)
- Speed (20 m s⁻¹)
- Energy (1000 J)
- Time (10 s)
- Distance (50 m)

### Vector Quantities

A **vector** has both magnitude AND direction.

**Examples of vectors:**
- Displacement (50 m north)
- Velocity (20 m s⁻¹ east)
- Force (10 N downward)
- Acceleration (9.8 m s⁻² down)
- Momentum (500 kg m s⁻¹ west)

### Adding Vectors

Vectors cannot simply be added numerically - direction matters!

**Parallel vectors:**
- Same direction: add magnitudes
- Opposite direction: subtract magnitudes

**Perpendicular vectors:**
- Use Pythagoras: R = √(A² + B²)
- Use trigonometry for angle: tan θ = B/A

**Vectors at any angle:**
- Draw to scale (tip-to-tail method)
- Or use components (resolve into x and y)

### Resolving Vectors into Components

Any vector can be split into perpendicular components:

**Horizontal component:** Fx = F cos θ
**Vertical component:** Fy = F sin θ

Where θ is the angle from the horizontal.

### Resultant Vector

The **resultant** is the single vector that has the same effect as two or more vectors combined.

**Magnitude:** R = √(Rx² + Ry²)
**Direction:** θ = tan⁻¹(Ry/Rx)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Uncertainties in Measurements",
                content: `## Dealing with Experimental Error

All measurements have some uncertainty - no measurement is perfectly precise.

### Types of Error

**Random errors:**
- Cause readings to scatter around the true value
- Reduced by taking multiple readings and averaging
- Examples: timing reaction, parallax when reading scales

**Systematic errors:**
- Cause readings to be consistently too high or too low
- NOT reduced by averaging
- Examples: zero error, calibration error, wrong technique

### Expressing Uncertainty

**Absolute uncertainty:** x = (5.0 ± 0.1) mm
**Percentage uncertainty:** (0.1/5.0) × 100% = 2%

### Combining Uncertainties

**Addition/Subtraction:**
Add the absolute uncertainties:
If z = x + y, then Δz = Δx + Δy

**Multiplication/Division:**
Add the percentage uncertainties:
If z = xy, then %Δz = %Δx + %Δy

**Powers:**
Multiply percentage uncertainty by the power:
If z = x^n, then %Δz = n × %Δx

### Worked Example

Calculate the density of a block where:
- Mass m = (200 ± 5) g
- Volume V = (50 ± 2) cm³

ρ = m/V = 200/50 = 4.0 g cm⁻³

%Δm = (5/200) × 100% = 2.5%
%ΔV = (2/50) × 100% = 4.0%

%Δρ = %Δm + %ΔV = 2.5% + 4.0% = 6.5%

Δρ = 6.5% × 4.0 = 0.26 ≈ 0.3 g cm⁻³

**Result:** ρ = (4.0 ± 0.3) g cm⁻³`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Estimation and Orders of Magnitude",
                content: `## Making Reasonable Estimates

Physicists often need to estimate quantities without precise data.

### Orders of Magnitude

An **order of magnitude** is the power of 10 closest to a value.

| Value | Order of Magnitude |
|-------|-------------------|
| 800 | 10³ |
| 0.003 | 10⁻³ |
| 5 × 10⁻⁸ | 10⁻⁷ (rounds up) |

**Rule:** If the number is ≥3.16 (√10), round up; otherwise round down.

### Useful Estimates to Know

| Quantity | Approximate Value |
|----------|-------------------|
| Mass of person | 70 kg |
| Height of person | 1.7 m |
| Walking speed | 1.5 m s⁻¹ |
| Running speed | 8 m s⁻¹ |
| Car speed (motorway) | 30 m s⁻¹ |
| Diameter of atom | 10⁻¹⁰ m |
| Diameter of nucleus | 10⁻¹⁵ m |
| Mass of electron | 10⁻³⁰ kg |
| Mass of proton | 10⁻²⁷ kg |
| Speed of sound | 340 m s⁻¹ |
| Speed of light | 3 × 10⁸ m s⁻¹ |

### Estimation Strategy

1. Identify the relevant physics equation
2. Estimate each variable's order of magnitude
3. Combine using the equation
4. Give answer as a power of 10

### Fermi Questions

Named after Enrico Fermi - estimate by breaking into simpler parts.

**Example:** How many piano tuners in London?
- Population of London: ~10⁷
- People per household: ~3, so households: ~3 × 10⁶
- Fraction with pianos: ~1/20, so pianos: ~1.5 × 10⁵
- Tunings per piano per year: ~2
- Time per tuning: ~2 hours
- Work hours per tuner per year: ~2000
- Tunings per tuner per year: ~1000
- Number of tuners: ~300

Answer: Order of magnitude = 10² to 10³`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Seven SI base units: kg, m, s, A, K, mol, cd",
            "Derived units are combinations of base units (e.g., N = kg m s⁻²)",
            "Always convert to SI base units before calculations",
            "Prefixes: nano (10⁻⁹), micro (10⁻⁶), milli (10⁻³), kilo (10³), mega (10⁶), giga (10⁹)",
            "Scalars have magnitude only; vectors have magnitude AND direction",
            "Resolve vectors into components: Fx = F cos θ, Fy = F sin θ",
            "Resultant: R = √(Fx² + Fy²), θ = tan⁻¹(Fy/Fx)",
            "Uncertainties: add absolute for +/-, add percentages for ×/÷",
            "For powers: %Δz = n × %Δx when z = xⁿ",
            "Order of magnitude: express as power of 10"
        ],
        exam_tips: [
            "Check units match on both sides of any equation",
            "When squaring units, square the conversion factor too (cm² to m² is ÷10000)",
            "Draw vector diagrams clearly with arrows showing direction",
            "For 2D vectors, always resolve into components first",
            "State type of error in practicals: random (scatter) vs systematic (offset)",
            "Round final uncertainty to 1 significant figure",
            "Know common estimates: human mass ~70 kg, walking ~1.5 m/s, atom ~10⁻¹⁰ m"
        ]
    },
    "Kinematics": {
        topic: "Kinematics",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/A%20level/Kinematics__Physics_of_Motion.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvQSBsZXZlbC9LaW5lbWF0aWNzX19QaHlzaWNzX29mX01vdGlvbi5tcDQiLCJpYXQiOjE3NjgxMDYyOTEsImV4cCI6NTI2ODYwMjI5MX0.sAUDIl0yaewEOnW5I_xQE9MzJU2Mn3MQzh9Cj-l9fL0",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/A%20level/Kinematics_Definitions_Graphs_and_SUVAT_Equations.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL0EgbGV2ZWwvS2luZW1hdGljc19EZWZpbml0aW9uc19HcmFwaHNfYW5kX1NVVkFUX0VxdWF0aW9ucy5tNGEiLCJpYXQiOjE3NjgwNzUyMzMsImV4cCI6NTI2ODU3MTIzM30.FANZf8_thNDdu8rnLxiJEbR6Q1YMfEyFH-bd-JU3VxM",
        subject: "A Level Physics",
        summary: "Kinematics is the study of motion without considering the forces causing it. This topic covers displacement, velocity, acceleration, the equations of uniformly accelerated motion (SUVAT equations), motion graphs, projectile motion, experimental methods for studying motion, and the calculus approach to kinematics.",
        sections: [
            {
                title: "1. Describing Motion - Fundamental Concepts",
                content: `## Key Definitions

Understanding the precise meaning of each term is essential for all motion problems.

### Displacement (s)

**Definition:** The distance travelled in a specified direction - the straight-line distance from start to finish with direction specified.

**Unit:** metre (m)
**Type:** Vector quantity

**Key Distinction from Distance:**
- Distance is the total path length (scalar) - always positive
- Displacement is the shortest path from start to end (vector) - can be positive or negative

**Example:** A runner completes a 400m track race:
- Distance travelled = 400 m
- Displacement = 0 m (returned to starting point)

**Example 2:** Walking 3 m east then 4 m north:
- Distance = 3 + 4 = 7 m
- Displacement = √(3² + 4²) = 5 m at 53° from east (using Pythagoras)

### Velocity (v)

**Definition:** The rate of change of displacement with respect to time.

**Unit:** m s⁻¹
**Type:** Vector quantity

**Average velocity:**
**v̄ = Δs/Δt = (s₂ - s₁)/(t₂ - t₁)**

**Instantaneous velocity:**
**v = ds/dt** (the derivative of displacement with respect to time)

**Key Distinction from Speed:**
- Speed is the rate of change of distance (scalar) - always positive
- Velocity is the rate of change of displacement (vector) - can be positive or negative

**Example:** A car travels 100 m east in 5 s, then 60 m west in 5 s.
- Total distance = 160 m; total time = 10 s
- Average speed = 160/10 = 16 m s⁻¹
- Total displacement = 100 - 60 = 40 m east
- Average velocity = 40/10 = 4 m s⁻¹ east

### Acceleration (a)

**Definition:** The rate of change of velocity with respect to time.

**Unit:** m s⁻² (metres per second per second)
**Type:** Vector quantity

**Average acceleration:**
**ā = Δv/Δt = (v₂ - v₁)/(t₂ - t₁)**

**Instantaneous acceleration:**
**a = dv/dt = d²s/dt²** (second derivative of displacement)

**Important Understanding:**
Acceleration occurs when:
1. Speed increases (commonly called "accelerating")
2. Speed decreases (commonly called "decelerating" - negative acceleration)
3. Direction changes (even at constant speed, e.g., circular motion)

**Deceleration vs Negative Acceleration:**
- Deceleration means slowing down (acceleration opposite to velocity)
- Negative acceleration means acceleration in the negative direction
- These are NOT always the same!`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. SUVAT Equations - Derivations and Applications",
                content: `## The Five Equations of Uniformly Accelerated Motion

These equations apply ONLY when acceleration is constant (uniform).

### The Five SUVAT Equations

| # | Equation | Variables Missing |
|---|----------|------------------|
| 1 | v = u + at | s |
| 2 | s = ½(u + v)t | a |
| 3 | s = ut + ½at² | v |
| 4 | s = vt - ½at² | u |
| 5 | v² = u² + 2as | t |

### Variable Definitions

- **s** = displacement (m)
- **u** = initial velocity (m s⁻¹)
- **v** = final velocity (m s⁻¹)
- **a** = acceleration (m s⁻² - must be constant!)
- **t** = time (s)

### Derivations from First Principles

**Equation 1: v = u + at**
From definition: a = (v - u)/t
Rearranging: v = u + at ✓

**Equation 2: s = ½(u + v)t**
Average velocity = (u + v)/2
Displacement = average velocity × time
s = ½(u + v)t ✓

**Equation 3: s = ut + ½at²**
Substitute v = u + at into equation 2:
s = ½(u + u + at)t = ½(2u + at)t = ut + ½at² ✓

**Equation 4: s = vt - ½at²**
From v = u + at: u = v - at
Substitute into equation 3:
s = (v - at)t + ½at² = vt - at² + ½at² = vt - ½at² ✓

**Equation 5: v² = u² + 2as**
From equation 1: t = (v - u)/a
Substitute into equation 2:
s = ½(u + v) × (v - u)/a = (v² - u²)/(2a)
Therefore: v² = u² + 2as ✓

### Problem-Solving Strategy

**Step 1:** List all known quantities (you need 3 of the 5)
**Step 2:** Identify the unknown you're looking for
**Step 3:** Choose the equation that contains the 3 knowns and 1 unknown
**Step 4:** Substitute and solve
**Step 5:** Check your answer makes physical sense

### Worked Example 1: Basic SUVAT

A car accelerates uniformly from 10 m s⁻¹ to 30 m s⁻¹ over a distance of 200 m. Calculate:
(a) the acceleration
(b) the time taken

**Part (a):**
u = 10 m s⁻¹, v = 30 m s⁻¹, s = 200 m, a = ?

Use v² = u² + 2as:
30² = 10² + 2 × a × 200
900 = 100 + 400a
a = 800/400 = **2.0 m s⁻²**

**Part (b):**
Now find t using v = u + at:
30 = 10 + 2.0 × t
t = 20/2.0 = **10 s**

Check: s = ½(u + v)t = ½(10 + 30) × 10 = 200 m ✓

### Worked Example 2: Two-Stage Motion

A train accelerates at 0.5 m s⁻² from rest for 40 s, then decelerates at 0.25 m s⁻² until it stops. Find the total distance.

**Stage 1:** u = 0, a = 0.5 m s⁻², t = 40 s
v = u + at = 0 + 0.5 × 40 = 20 m s⁻¹
s₁ = ut + ½at² = 0 + ½ × 0.5 × 40² = 400 m

**Stage 2:** u = 20 m s⁻¹, v = 0, a = -0.25 m s⁻²
v² = u² + 2as
0 = 400 + 2 × (-0.25) × s₂
s₂ = 400/0.5 = 800 m

**Total distance = 400 + 800 = 1200 m**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Motion Graphs - Analysis and Interpretation",
                content: `## Graphical Representation of Motion

Graphs provide visual understanding of motion and allow quantities to be found without complex calculations.

### Displacement-Time (s-t) Graphs

| Feature | Interpretation |
|---------|---------------|
| Gradient at any point | Instantaneous velocity |
| Straight line | Constant velocity |
| Horizontal line | Stationary (v = 0) |
| Steeper line | Greater velocity |
| Positive gradient | Moving in positive direction |
| Negative gradient | Moving in negative direction |
| Curved line | Changing velocity (acceleration) |

**Finding velocity from s-t graph:**
For straight line: v = Δs/Δt = (s₂ - s₁)/(t₂ - t₁)
For curve: draw tangent at the point, find gradient of tangent

**Example interpretation:**
- Line curving upward (concave up): positive acceleration
- Line curving downward (concave down): negative acceleration

### Velocity-Time (v-t) Graphs

| Feature | Interpretation |
|---------|---------------|
| Gradient at any point | Acceleration |
| Area under graph | Displacement |
| Straight line | Constant acceleration |
| Horizontal line | Constant velocity (a = 0) |
| Line through time axis | Direction reversal |
| Positive area | Positive displacement |
| Negative area (below axis) | Negative displacement |

**Finding acceleration from v-t graph:**
a = Δv/Δt = (v₂ - v₁)/(t₂ - t₁)

**Finding displacement from v-t graph:**
s = Area under the curve
- Rectangle: s = v × t
- Triangle: s = ½ × base × height
- Trapezium: s = ½(v₁ + v₂) × t
- Irregular: count squares or use integration

### Acceleration-Time (a-t) Graphs

| Feature | Interpretation |
|---------|---------------|
| Area under graph | Change in velocity |
| Horizontal line | Constant acceleration |
| Line at a = 0 | Zero acceleration (constant velocity) |

**Finding change in velocity:**
Δv = ∫a dt = Area under a-t graph

### Worked Example: Graph Analysis

A car's v-t graph shows:
- 0 to 10 s: velocity increases from 0 to 20 m s⁻¹ (straight line)
- 10 to 25 s: constant velocity at 20 m s⁻¹
- 25 to 30 s: velocity decreases from 20 to 0 m s⁻¹ (straight line)

**Find: (a) acceleration in each phase (b) total displacement**

**(a) Accelerations:**
Phase 1: a = (20 - 0)/(10 - 0) = 2 m s⁻²
Phase 2: a = 0 (constant velocity)
Phase 3: a = (0 - 20)/(30 - 25) = -4 m s⁻²

**(b) Total displacement:**
Phase 1: s₁ = ½ × 10 × 20 = 100 m (triangle)
Phase 2: s₂ = 20 × 15 = 300 m (rectangle)
Phase 3: s₃ = ½ × 5 × 20 = 50 m (triangle)
**Total: 100 + 300 + 50 = 450 m**

### Drawing Tangents to Curves

For curved graphs, to find instantaneous values:
1. Draw a straight line that touches the curve at exactly one point
2. Extend this tangent line
3. Choose two points on the tangent far apart (for accuracy)
4. Calculate gradient using these points`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Free Fall and Motion Under Gravity",
                content: `## Objects Moving Under Gravitational Acceleration

### Free Fall Definition

**Free fall** is motion under the influence of gravity alone, with no other forces acting (air resistance is neglected).

### Key Facts About Gravitational Acceleration

1. **Value:** g = 9.81 m s⁻² (often approximated as 10 m s⁻² for quick calculations)
2. **Direction:** Always vertically downward toward Earth's centre
3. **Independence of mass:** All objects fall with the same acceleration (Galileo's discovery)
4. **Consistency:** g is constant near Earth's surface (varies with altitude and latitude)

### Sign Conventions

**Choose your positive direction carefully and stick with it:**

**Option 1: Upward positive**
- Initial upward velocity: u = +ve
- Acceleration: a = -g = -9.81 m s⁻²
- Downward displacement: s = -ve

**Option 2: Downward positive**
- Initial upward velocity: u = -ve
- Acceleration: a = +g = +9.81 m s⁻²
- Downward displacement: s = +ve

### Equations for Dropping Objects (u = 0)

Starting from rest and falling downward (taking down as positive):

| Quantity | Equation |
|----------|----------|
| Velocity after time t | v = gt |
| Displacement after time t | s = ½gt² |
| Velocity after falling distance s | v = √(2gs) |
| Time to fall distance s | t = √(2s/g) |

### Equations for Objects Thrown Upward

Taking upward as positive, a = -g:

**At maximum height:**
- v = 0 (instantaneous rest)
- Time to reach max height: t = u/g
- Maximum height: h = u²/(2g)

**Returning to start:**
- Total time of flight: T = 2u/g
- Final velocity: v = -u (same speed, opposite direction)

### Worked Example 1: Dropped Object

A stone is dropped from a bridge 45 m above water. Find:
(a) Time to hit water
(b) Speed on impact

Taking down as positive: u = 0, s = 45 m, a = 9.81 m s⁻²

**(a) Time:**
s = ut + ½at²
45 = 0 + ½ × 9.81 × t²
t² = 90/9.81 = 9.17
**t = 3.03 s**

**(b) Speed:**
v² = u² + 2as = 0 + 2 × 9.81 × 45 = 883
**v = 29.7 m s⁻¹**

### Worked Example 2: Thrown Upward

A ball is thrown vertically upward at 25 m s⁻¹. Find:
(a) Maximum height
(b) Time in the air
(c) Velocity when 20 m above the ground

Taking up as positive: u = 25 m s⁻¹, a = -9.81 m s⁻²

**(a) Maximum height:** At max height, v = 0
v² = u² + 2as
0 = 625 + 2(-9.81)h
**h = 31.9 m**

**(b) Total time:** T = 2u/g = 2 × 25/9.81 = **5.10 s**

**(c) Velocity at 20 m:**
v² = 625 + 2(-9.81)(20) = 625 - 392.4 = 232.6
v = ±15.3 m s⁻¹

**Two answers:** +15.3 m s⁻¹ going up, -15.3 m s⁻¹ coming down`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Projectile Motion - Complete Analysis",
                content: `## Two-Dimensional Motion Under Gravity

### The Independence Principle

**The horizontal and vertical components of projectile motion are completely independent.**

This is the key to solving all projectile problems:
- Analyse horizontal motion separately
- Analyse vertical motion separately
- Combine results using common time parameter

### Horizontal Motion (ax = 0)

With no air resistance, horizontal velocity is constant:
- vₓ = uₓ = u cos θ (constant throughout flight)
- sₓ = uₓt = (u cos θ)t

### Vertical Motion (ay = -g)

Standard SUVAT with a = -g (taking up as positive):
- uy = u sin θ
- vy = uy - gt = u sin θ - gt
- sy = uyt - ½gt² = (u sin θ)t - ½gt²
- vy² = uy² - 2gsy

### Step-by-Step Problem Solving

**Step 1:** Resolve initial velocity
- uₓ = u cos θ
- uy = u sin θ

**Step 2:** Identify what's known and required
- Usually time links horizontal and vertical

**Step 3:** Solve vertical motion first
- Often to find time of flight

**Step 4:** Use time to find horizontal quantities

**Step 5:** Combine for final answer

### Key Projectile Equations

**Time of flight (returning to same level):**
T = 2uy/g = 2u sin θ/g

**Maximum height:**
H = uy²/(2g) = u² sin² θ/(2g)

**Horizontal range:**
R = uₓT = u cos θ × 2u sin θ/g = u² sin 2θ/g

**Maximum range occurs when θ = 45°:**
Rmax = u²/g

### The Parabolic Path

The trajectory equation:
**y = x tan θ - gx²/(2u² cos² θ)**

This is a parabola with:
- Maximum at x = R/2
- Symmetric about the maximum point

### Worked Example 1: Full Analysis

A cricket ball is hit at 30 m s⁻¹ at 40° to the horizontal from ground level. Find:
(a) Time of flight
(b) Maximum height
(c) Horizontal range
(d) Velocity when landing

**Initial components:**
uₓ = 30 cos 40° = 22.98 m s⁻¹
uy = 30 sin 40° = 19.28 m s⁻¹

**(a) Time of flight:**
T = 2uy/g = 2 × 19.28/9.81 = **3.93 s**

**(b) Maximum height:**
H = uy²/(2g) = 19.28²/(2 × 9.81) = **18.96 m**

**(c) Range:**
R = uₓT = 22.98 × 3.93 = **90.3 m**

**(d) Landing velocity:**
vₓ = 22.98 m s⁻¹ (unchanged)
vy = -19.28 m s⁻¹ (equal and opposite to initial)
v = √(22.98² + 19.28²) = **30 m s⁻¹** at 40° below horizontal

### Worked Example 2: Horizontal Projection

A stone is thrown horizontally at 15 m s⁻¹ from a cliff 40 m high. Find:
(a) Time to reach ground
(b) Horizontal distance travelled
(c) Angle of impact

**Initial conditions:** ux = 15 m s⁻¹, uy = 0, height = 40 m

**(a) Time (vertical motion):**
sy = uyt + ½gt² (taking down as positive)
40 = 0 + ½ × 9.81 × t²
t = √(80/9.81) = **2.86 s**

**(b) Horizontal distance:**
sx = uxt = 15 × 2.86 = **42.9 m**

**(c) Angle of impact:**
vy = gt = 9.81 × 2.86 = 28.1 m s⁻¹
tan θ = vy/vx = 28.1/15 = 1.87
**θ = 62° below horizontal**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Experimental Methods and Calculus Approach",
                content: `## Measuring Motion Experimentally

### Light Gates and Data Loggers

**Principle:** An object passing through a light gate triggers a timer.

**Measuring velocity:**
- Interrupt card of known length L passes through gate
- Timer records duration t
- Velocity v = L/t

**Measuring acceleration:**
- Two light gates separated by distance d
- Measure velocity at each gate (v₁ and v₂)
- a = (v₂² - v₁²)/(2d)

### Motion Sensors (Position Sensors)

**Principle:** Ultrasonic sensor measures distance by timing echo.

**Advantages:**
- Direct measurement of displacement
- Can calculate velocity and acceleration from data
- Continuous data collection

**Analysis:**
- Plot s-t graph from data
- Gradient gives velocity
- Second derivative (or gradient of v-t) gives acceleration

### Ticker Tape Timer

**Principle:** Dots marked on tape at regular intervals (usually 50 Hz = 0.02 s between dots).

**Measuring velocity:**
- Distance between dots ÷ time interval
- Larger spacing = higher velocity

**Finding acceleration:**
- Cut tape into sections of equal number of dots
- Stick sections side by side as bar chart
- If height increases uniformly, acceleration is constant

### Video Analysis

**Principle:** Film motion with known frame rate and scale.

**Method:**
1. Film object moving past ruler/scale
2. Extract frames at known time intervals
3. Measure position in each frame
4. Calculate velocity from position changes
5. Calculate acceleration from velocity changes

### Calculus in Kinematics

**Differentiation (rates of change):**
- Velocity = ds/dt (derivative of displacement)
- Acceleration = dv/dt = d²s/dt² (derivative of velocity)

**Integration (accumulation):**
- Displacement = ∫v dt (integral of velocity)
- Velocity = ∫a dt (integral of acceleration)

### Example: Variable Acceleration

If displacement varies as s = 2t³ - 3t² + t, find velocity and acceleration at t = 2 s.

**Velocity:** v = ds/dt = 6t² - 6t + 1
At t = 2: v = 6(4) - 6(2) + 1 = 24 - 12 + 1 = **13 m s⁻¹**

**Acceleration:** a = dv/dt = 12t - 6
At t = 2: a = 12(2) - 6 = **18 m s⁻²**

### Example: Finding Displacement from Velocity

A particle has velocity v = 3t² + 2t (m s⁻¹). Find displacement from t = 0 to t = 3 s.

s = ∫v dt = ∫(3t² + 2t) dt = t³ + t² + C

Since s = 0 when t = 0: C = 0

At t = 3: s = 27 + 9 = **36 m**`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Displacement is distance in a specified direction (vector); distance is total path length (scalar)",
            "Velocity = rate of change of displacement (v = ds/dt); speed is rate of change of distance",
            "Acceleration = rate of change of velocity (a = dv/dt = d²s/dt²); occurs with speed OR direction change",
            "SUVAT equations apply ONLY for constant acceleration: v = u + at, s = ut + ½at², v² = u² + 2as",
            "All SUVAT equations can be derived from a = dv/dt and v = ds/dt",
            "s-t graph: gradient = velocity; v-t graph: gradient = acceleration, area = displacement",
            "For curved graphs, draw tangent at the point to find instantaneous gradient",
            "Free fall: a = g = 9.81 m s⁻² downward for all masses (air resistance neglected)",
            "Projectile motion: horizontal (constant v) and vertical (a = -g) are completely independent",
            "Time of flight T = 2u sin θ/g; Max height H = u² sin² θ/(2g); Range R = u² sin 2θ/g",
            "Maximum range occurs at 45° projection angle for flat ground",
            "Calculus: v = ds/dt, a = dv/dt; s = ∫v dt, v = ∫a dt"
        ],
        exam_tips: [
            "Always define your positive direction before starting any problem - consistency is crucial",
            "For vertical motion problems, clearly state whether up or down is positive",
            "When an object returns to starting height, total displacement = 0, not total distance",
            "For projectiles, find time from vertical motion first, then use for horizontal",
            "At maximum height, vertical velocity = 0 (but horizontal velocity continues)",
            "For v-t graphs, area below the time axis represents negative displacement",
            "When drawing tangents to curves, make the line as long as possible for accuracy",
            "Check answers using alternative methods or dimensional analysis",
            "Use g = 10 m s⁻² for quick estimates, g = 9.81 m s⁻² for precise calculations",
            "For two-stage motion problems, final velocity of stage 1 = initial velocity of stage 2"
        ]
    },
    "Dynamics": {
        topic: "Dynamics",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/A%20level/F_equals_ma_and_Free_Body_Diagrams.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL0EgbGV2ZWwvRl9lcXVhbHNfbWFfYW5kX0ZyZWVfQm9keV9EaWFncmFtcy5tNGEiLCJpYXQiOjE3NjgwNzUxNDksImV4cCI6NTI2ODU3MTE0OX0.uRH_VILVNT63h9dSmjsJG9K8dMimaFbfNggHb0VpK4I",
        subject: "A Level Physics",
        summary: "Dynamics is the study of motion and the forces that cause it. This topic covers Newton's three laws of motion in depth, momentum, impulse, conservation of momentum, and the analysis of various types of collisions. Understanding dynamics is essential for analysing real-world situations from car crashes and sports to rocket propulsion and particle physics.",
        sections: [
            {
                title: "1. Newton's First Law - The Law of Inertia",
                content: `## Understanding Inertia and Equilibrium

### Newton's First Law Statement

**"An object remains at rest or continues to move with constant velocity unless acted upon by a resultant (net) force."**

This seemingly simple statement has profound implications for understanding motion.

### Key Concept: Inertia

**Inertia:** The natural tendency of an object to resist changes in its state of motion.

**Understanding Inertia:**
- An object at rest "wants" to stay at rest
- An object moving "wants" to keep moving at the same velocity
- Greater mass = greater inertia = harder to accelerate or decelerate

**Mass as a Measure of Inertia:**
- Mass is NOT the same as weight
- Mass measures how much an object resists acceleration
- Same mass on Earth and Moon, but different weight

### The Concept of Resultant Force

**Resultant Force (Net Force):** The single force that has the same effect as all forces acting on an object combined.

**Calculating Resultant Force:**
- For forces in the same direction: add magnitudes
- For forces in opposite directions: subtract magnitudes
- For forces at angles: use vector addition

**When resultant force = 0:**
- Object at rest stays at rest
- Object in motion continues at constant velocity
- Object is in EQUILIBRIUM

### Types of Equilibrium

**Static Equilibrium:**
- Object is stationary (at rest)
- ΣF = 0 (sum of all forces = 0)
- ΣMoments = 0 (for extended objects)

**Dynamic Equilibrium:**
- Object is moving at constant velocity
- ΣF = 0 (still! - no NET force)
- Velocity is constant (both speed and direction)

### Real-World Examples

**Example 1: Book on a Table**
- Weight acts downward: W = mg
- Normal force acts upward: N
- Since book is stationary: N = W, so ΣF = 0

**Example 2: Car at Constant Speed**
- Driving force forward: F_engine
- Drag and friction backward: F_resist
- If F_engine = F_resist, then ΣF = 0 → constant velocity

**Example 3: Skydiver at Terminal Velocity**
- Weight downward: W = mg
- Air resistance upward: D
- When D = W, ΣF = 0 → constant velocity (terminal velocity)

**Example 4: Object in Space**
- No resistive forces
- Once moving, continues forever at constant velocity
- This is why spacecraft don't need engines for cruising

### Common Misconception

**Wrong:** "A force is needed to keep an object moving"
**Right:** "A force is needed to CHANGE an object's motion"

In everyday life, friction makes objects stop, giving the illusion that force is needed for motion.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Newton's Second Law - Force and Acceleration",
                content: `## The Fundamental Equation of Dynamics

### Newton's Second Law Statement

**"The rate of change of momentum of an object is directly proportional to the resultant force acting on it, and the change takes place in the direction of that force."**

### Mathematical Forms

**General form (momentum form):**
**F = dp/dt = Δp/Δt**

**For constant mass:**
**F = ma**

Where:
- F = resultant force (N)
- m = mass (kg)
- a = acceleration (m s⁻²)
- p = momentum (kg m s⁻¹)

### Understanding F = ma

**Key relationships:**
- Double the force → double the acceleration (constant mass)
- Double the mass → half the acceleration (constant force)
- Acceleration is ALWAYS in the direction of the resultant force
- If F = 0, then a = 0 (returns to Newton's First Law)

### The Newton as a Unit

**Definition of 1 newton:** The force required to give a mass of 1 kg an acceleration of 1 m s⁻².

**1 N = 1 kg × 1 m s⁻² = 1 kg m s⁻²**

### Weight vs Mass

| Property | Mass (m) | Weight (W) |
|----------|----------|------------|
| Definition | Amount of matter | Gravitational force on object |
| Unit | kg | N |
| Type | Scalar | Vector (downward) |
| Varies with location? | No | Yes |
| On Moon | Same as Earth | About 1/6 of Earth |

**Weight equation: W = mg**

Where g = gravitational field strength (acceleration due to gravity)
- On Earth: g ≈ 9.81 N kg⁻¹
- On Moon: g ≈ 1.62 N kg⁻¹

### Free Body Diagrams - Essential Problem-Solving Tool

**Steps to draw free body diagrams:**
1. Identify the object of interest
2. Draw the object as a simple shape (often a box or dot)
3. Draw ALL forces acting ON the object as arrows
4. Label each force with its name and magnitude
5. Forces act FROM the object's centre or contact point

**Common forces to include:**
- Weight (W = mg, downward)
- Normal force (N, perpendicular to surface)
- Friction (f, parallel to surface, opposing motion)
- Tension (T, along string/rope)
- Applied/driving force (F, as specified)
- Air resistance/drag (D, opposing motion)

### Worked Example 1: Horizontal Motion

A 1500 kg car experiences a driving force of 4500 N and resistive forces of 1500 N. Calculate:
(a) The acceleration
(b) The distance travelled in 10 s from rest
(c) The final velocity

**Solution:**
(a) Resultant force: F_net = 4500 - 1500 = 3000 N
    Acceleration: a = F/m = 3000/1500 = **2.0 m s⁻²**

(b) Using s = ut + ½at²:
    s = 0 + ½ × 2.0 × 10² = **100 m**

(c) Using v = u + at:
    v = 0 + 2.0 × 10 = **20 m s⁻¹**

### Worked Example 2: Inclined Plane

A 5 kg block slides down a frictionless plane inclined at 30° to horizontal. Find:
(a) The acceleration down the plane
(b) The time to slide 10 m from rest

**Solution:**
(a) Force down the plane = component of weight = mg sin θ
    F = 5 × 9.81 × sin 30° = 5 × 9.81 × 0.5 = 24.5 N
    a = F/m = 24.5/5 = **4.9 m s⁻²** (or g sin 30° directly!)

(b) Using s = ut + ½at²:
    10 = 0 + ½ × 4.9 × t²
    t² = 20/4.9 = 4.08
    t = **2.02 s**

### Worked Example 3: Connected Objects (Pulley System)

Two masses (4 kg and 6 kg) are connected by a light inextensible string over a frictionless pulley. Find the acceleration and tension.

**Solution:**
Let acceleration = a (6 kg accelerates down, 4 kg accelerates up)

For 6 kg mass: 6g - T = 6a ... (1)
For 4 kg mass: T - 4g = 4a ... (2)

Adding equations: 6g - 4g = 10a
2g = 10a
a = g/5 = **1.96 m s⁻²**

Substituting back: T = 4g + 4a = 4(9.81) + 4(1.96) = **47.1 N**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Newton's Third Law - Action and Reaction",
                content: `## Forces Come in Pairs

### Newton's Third Law Statement

**"When object A exerts a force on object B, object B simultaneously exerts an equal and opposite force on object A."**

Often simplified as: "For every action, there is an equal and opposite reaction."

### Characteristics of Third Law Force Pairs

Third law force pairs MUST have ALL of these properties:

| Property | Requirement |
|----------|-------------|
| Magnitude | Equal |
| Direction | Opposite |
| Type | Same (both gravitational, both contact, etc.) |
| Objects | Act on DIFFERENT objects |
| Timing | Simultaneous |

### Identifying Third Law Pairs

**Format:** If A pushes B, then B pushes A

| Object A's Force | Object B's Force |
|------------------|------------------|
| Earth pulls person down (gravitational) | Person pulls Earth up (gravitational) |
| Table pushes book up (contact/normal) | Book pushes table down (contact/normal) |
| Hammer hits nail forward (contact) | Nail hits hammer backward (contact) |
| Rocket pushes exhaust down | Exhaust pushes rocket up |
| Swimmer pushes water backward | Water pushes swimmer forward |

### Critical Misconception: Weight and Normal Force

**COMMON ERROR:** Thinking weight and normal force are a third law pair.

**Why they're NOT:**
- Both forces act on the SAME object (the book)
- Third law pairs must act on DIFFERENT objects

**The ACTUAL third law pairs for a book on a table:**
1. Earth pulls book down ↔ Book pulls Earth up (gravitational)
2. Table pushes book up ↔ Book pushes table down (contact)

### Why Don't Third Law Pairs Cancel?

If forces are equal and opposite, why doesn't everything cancel out?

**Answer:** The forces act on DIFFERENT objects!
- Each object only "feels" the force acting ON IT
- The reaction force acts on the OTHER object

**Example: Tug of War**
- Team A pulls rope one way with force F
- Rope pulls Team A back with force F
- Team B pulls rope other way with force F
- Rope pulls Team B back with force F
- The winning team is the one with better grip (friction with ground)

### Applications of Newton's Third Law

**Walking:**
- Your foot pushes the ground backward
- The ground pushes your foot forward
- This forward force accelerates you

**Swimming:**
- Your hands push water backward
- Water pushes your hands (and body) forward

**Flying (birds/planes):**
- Wings push air downward
- Air pushes wings upward (lift)

**Rockets:**
- Engine expels exhaust at high speed downward
- Exhaust pushes rocket upward
- Works in space where there's nothing to push against!

### Worked Example: Rocket Motion

A rocket of mass 500 kg expels 2 kg of exhaust gas at a velocity of 3000 m s⁻¹ relative to the rocket. Calculate the change in velocity of the rocket.

**Solution:**
Using conservation of momentum:
Initial momentum = 0 (rocket at rest)

After expulsion:
m_rocket × v_rocket + m_exhaust × v_exhaust = 0
498 × v + 2 × (-3000) = 0
498v = 6000
v = **12.0 m s⁻¹**

Note: Exhaust velocity is negative (opposite direction to rocket)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Momentum - The Quantity of Motion",
                content: `## Linear Momentum

### Definition and Properties

**Momentum (p):** The product of an object's mass and velocity.

**p = mv**

| Property | Details |
|----------|---------|
| Symbol | p |
| Equation | p = mv |
| Unit | kg m s⁻¹ (or N s) |
| Type | Vector (same direction as velocity) |

### Physical Meaning

Momentum represents the "quantity of motion" - how much effort is needed to stop something:
- A fast-moving car has more momentum than a slow one
- A heavy lorry has more momentum than a light car at the same speed
- Both mass AND velocity contribute to momentum

### Newton's Second Law in Momentum Form

**F = dp/dt = Δp/Δt**

This is the MORE GENERAL form of Newton's Second Law.

**Derivation of F = ma from F = dp/dt:**
F = dp/dt = d(mv)/dt

If mass is constant:
F = m(dv/dt) = ma ✓

### Conservation of Momentum

**The Principle of Conservation of Linear Momentum:**
"In a closed system where no external forces act, the total momentum before an interaction equals the total momentum after the interaction."

**Mathematical Expression:**
**Σp_before = Σp_after**
**m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂**

### Why Momentum is Conserved

Newton's Third Law explains conservation:
1. During collision, A exerts force F on B
2. B exerts force -F on A (third law)
3. Both forces act for the same time interval Δt
4. Impulse on A = FΔt; Impulse on B = -FΔt
5. Total impulse = 0, so total Δp = 0
6. Therefore, total momentum is unchanged

### Worked Example 1: Simple Collision

A 2 kg ball moving at 6 m s⁻¹ collides with a stationary 4 kg ball. After collision, the 2 kg ball moves at 1 m s⁻¹ in the same direction. Find the velocity of the 4 kg ball.

**Solution:**
Before: p_total = 2 × 6 + 4 × 0 = 12 kg m s⁻¹
After: p_total = 2 × 1 + 4 × v = 2 + 4v

Conservation: 12 = 2 + 4v
4v = 10
v = **2.5 m s⁻¹**

### Worked Example 2: Objects Moving in Opposite Directions

A 3 kg object moving at 4 m s⁻¹ to the right collides head-on with a 2 kg object moving at 6 m s⁻¹ to the left. They stick together. Find the final velocity.

**Solution:**
Define right as positive.

Before: p = 3 × (+4) + 2 × (-6) = 12 - 12 = 0 kg m s⁻¹

After (stuck together, mass = 5 kg):
0 = 5 × v
v = **0 m s⁻¹** (they stop!)

### Worked Example 3: Recoil

A 50 kg person standing on frictionless ice throws a 5 kg ball horizontally at 10 m s⁻¹. Find the person's recoil velocity.

**Solution:**
Initial momentum = 0 (both at rest)

Final: m_person × v_person + m_ball × v_ball = 0
50 × v + 5 × 10 = 0
50v = -50
v = **-1.0 m s⁻¹** (opposite direction to ball)

### 2D Momentum Problems

For two-dimensional collisions, momentum is conserved in EACH direction independently:

**x-direction:** Σp_x before = Σp_x after
**y-direction:** Σp_y before = Σp_y after

**Example:** Snooker ball collisions require resolving momentum into components.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Impulse - Force Over Time",
                content: `## Relating Force, Time, and Momentum Change

### Definition of Impulse

**Impulse (J):** The product of force and the time for which it acts.

**J = FΔt = Δp**

| Property | Details |
|----------|---------|
| Symbol | J |
| Equation | J = FΔt = Δp = mv - mu |
| Unit | N s (or kg m s⁻¹) |
| Type | Vector (same direction as force) |

### The Impulse-Momentum Theorem

**Impulse = Change in Momentum**

**FΔt = Δp = mv - mu**

This comes directly from Newton's Second Law:
F = dp/dt → F × dt = dp → FΔt = Δp

### Force-Time Graphs

The area under a force-time graph equals the impulse (change in momentum).

**For constant force:** J = F × Δt (rectangle area)
**For varying force:** J = ∫F dt (total area under curve)

**Reading F-t graphs:**
- Height = force magnitude
- Width = time interval
- Area = impulse = change in momentum

### Practical Applications of Impulse

**Principle:** For a given change in momentum, increasing the collision time decreases the average force.

If Δp is fixed and Δt increases → F must decrease (since FΔt = Δp)

**Car Safety Features:**

| Feature | How It Works |
|---------|--------------|
| Crumple zones | Car body collapses progressively, extending collision time |
| Airbags | Inflate and deflate slowly, cushioning impact over longer time |
| Seatbelts | Stretch slightly, spreading deceleration over longer time |
| Crash barriers | Deform on impact, extending collision time |
| Helmet padding | Compresses on impact, increasing deceleration time |

**Sports Applications:**

| Technique | Purpose |
|-----------|---------|
| Bending knees when landing | Increases time of deceleration |
| Following through in tennis | Increases contact time, increases impulse |
| Catching with soft hands | Increases stopping time, reduces force |
| Rolling when falling (martial arts) | Extends impact time |

### Worked Example 1: Car Crash

A 1200 kg car travelling at 25 m s⁻¹ crashes into a wall and stops.
(a) If impact time is 0.1 s, find the average force.
(b) If crumple zones extend impact to 0.5 s, find the new average force.

**Solution:**
Δp = mv - mu = 0 - 1200 × 25 = -30,000 kg m s⁻¹
(The magnitude is 30,000 kg m s⁻¹)

(a) F = Δp/Δt = 30,000/0.1 = **300,000 N = 300 kN**

(b) F = 30,000/0.5 = **60,000 N = 60 kN**

The crumple zone reduces force by 5 times!

### Worked Example 2: Tennis Serve

A tennis ball (mass 60 g) is served from rest at 50 m s⁻¹. The racket is in contact for 5 ms. Calculate:
(a) The impulse on the ball
(b) The average force exerted by the racket

**Solution:**
(a) J = Δp = mv - mu = 0.06 × 50 - 0 = **3.0 N s**

(b) F = J/Δt = 3.0/(5 × 10⁻³) = **600 N**

### Worked Example 3: Ball Bouncing

A 0.2 kg ball falls from 5 m height and bounces back to 3.2 m. Contact time with ground is 0.02 s. Find the average force.

**Solution:**
Speed just before hitting ground: v₁ = √(2gh) = √(2 × 10 × 5) = 10 m s⁻¹ (downward)

Speed just after bouncing: v₂ = √(2 × 10 × 3.2) = 8 m s⁻¹ (upward)

Taking upward as positive:
Δp = m(v₂ - v₁) = 0.2(8 - (-10)) = 0.2 × 18 = 3.6 kg m s⁻¹

F = Δp/Δt = 3.6/0.02 = **180 N**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Types of Collisions - Elastic and Inelastic",
                content: `## Conservation Laws in Collisions

### Momentum in All Collisions

**Momentum is ALWAYS conserved** in collisions (assuming no external forces).

This is true regardless of whether the collision is elastic or inelastic.

### Kinetic Energy in Collisions

**Kinetic Energy may or may not be conserved** - this determines the collision type.

**Total energy is always conserved**, but kinetic energy may be converted to other forms (heat, sound, deformation).

### Classification of Collisions

| Collision Type | Momentum | Kinetic Energy |
|----------------|----------|----------------|
| Elastic | Conserved | Conserved |
| Inelastic | Conserved | NOT conserved (some lost) |
| Perfectly Inelastic | Conserved | Maximum loss (objects stick together) |

### Elastic Collisions

**Definition:** Both momentum AND kinetic energy are conserved.

**Characteristics:**
- No permanent deformation
- No energy lost to heat or sound
- Objects bounce apart
- Rare in everyday life, common at atomic level

**Examples:**
- Collisions between air molecules
- Collisions between billiard balls (approximately)
- Atomic and subatomic particle collisions

**Equations for Elastic Collision:**
1. m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂ (momentum)
2. ½m₁u₁² + ½m₂u₂² = ½m₁v₁² + ½m₂v₂² (kinetic energy)

**Special Cases:**
- Equal masses, one stationary: velocities exchange
- Heavy object hits light stationary object: light object moves at ~2× heavy object's speed
- Light object hits heavy stationary object: light object bounces back

### Inelastic Collisions

**Definition:** Momentum is conserved, but kinetic energy is NOT conserved.

**Characteristics:**
- Some KE converted to heat, sound, deformation
- Objects may or may not stick together
- Most real-world collisions are inelastic

**Examples:**
- Car crashes
- Dropping a ball that doesn't bounce to original height
- Catching a ball

**Calculating Energy Loss:**
Energy lost = KE_before - KE_after
% Energy lost = (KE_before - KE_after)/KE_before × 100%

### Perfectly Inelastic Collisions

**Definition:** Objects stick together after collision - maximum kinetic energy loss.

**Equation:** m₁u₁ + m₂u₂ = (m₁ + m₂)v

**Examples:**
- Coupled railway carriages
- Catching and holding a ball
- Bullet embedding in target
- Throwing mud at a wall

### Explosions

**Definition:** An "inverse" collision where objects fly apart.

**Characteristics:**
- Initial momentum usually = 0
- Final momentum must also = 0
- Kinetic energy INCREASES (from chemical/nuclear energy)

**Equation (from rest):**
m₁v₁ + m₂v₂ = 0
m₁v₁ = -m₂v₂

### Worked Example 1: Elastic Collision Check

A 2 kg ball at 4 m s⁻¹ collides with a 3 kg ball at rest. After collision, the 2 kg ball moves at 0.8 m s⁻¹ and the 3 kg ball at 2.4 m s⁻¹. Is this elastic?

**Solution:**
Momentum before: 2 × 4 + 3 × 0 = 8 kg m s⁻¹
Momentum after: 2 × 0.8 + 3 × 2.4 = 1.6 + 7.2 = 8.8 kg m s⁻¹

Momentum is NOT conserved! This scenario is **impossible** (error in data).

Let's recalculate assuming momentum IS conserved:
After: 2 × 0.8 + 3 × v = 8
3v = 6.4, v = 2.13 m s⁻¹ (not 2.4)

### Worked Example 2: Perfectly Inelastic

A 4 kg block moving at 6 m s⁻¹ collides with and sticks to a 2 kg block at rest.
(a) Find the final velocity
(b) Calculate the kinetic energy lost
(c) What percentage of KE was lost?

**Solution:**
(a) Momentum: 4 × 6 + 2 × 0 = (4 + 2) × v
24 = 6v
v = **4 m s⁻¹**

(b) KE_before = ½ × 4 × 6² = 72 J
KE_after = ½ × 6 × 4² = 48 J
Energy lost = 72 - 48 = **24 J**

(c) % lost = 24/72 × 100 = **33.3%**

### Worked Example 3: Explosion

A 10 kg shell at rest explodes into two pieces. A 4 kg piece flies off at 15 m s⁻¹. Find:
(a) Velocity of the 6 kg piece
(b) Total kinetic energy after explosion

**Solution:**
(a) Initial momentum = 0
4 × 15 + 6 × v = 0
60 = -6v
v = **-10 m s⁻¹** (opposite direction)

(b) KE = ½ × 4 × 15² + ½ × 6 × 10²
= 450 + 300 = **750 J**

(This energy came from the explosive chemical energy)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Two-Dimensional Collisions",
                content: `## Vector Nature of Momentum

### Principle

In 2D collisions, momentum is conserved in EACH direction independently:

**x-direction:** Σm_i u_ix = Σm_i v_ix
**y-direction:** Σm_i u_iy = Σm_i v_iy

### Problem-Solving Strategy

1. Choose convenient x and y axes
2. Resolve all initial velocities into components
3. Apply conservation of momentum to x-direction
4. Apply conservation of momentum to y-direction
5. Solve the simultaneous equations

### Worked Example: Snooker Ball Collision

A cue ball (mass 0.17 kg) moving at 5 m s⁻¹ strikes a stationary red ball (same mass) off-centre. After collision:
- Cue ball moves at 3 m s⁻¹ at 30° to original direction
- Find velocity and direction of red ball

**Solution:**
Let cue ball initial direction be x-axis.

**x-direction:**
Before: 0.17 × 5 = 0.85 kg m s⁻¹
After: 0.17 × 3 × cos30° + 0.17 × v × cosθ
0.85 = 0.442 + 0.17v cosθ
0.17v cosθ = 0.408 ... (1)

**y-direction:**
Before: 0
After: 0.17 × 3 × sin30° + 0.17 × v × sinθ (taking red ball angle as θ below x-axis)
0 = 0.255 - 0.17v sinθ
0.17v sinθ = 0.255 ... (2)

Dividing (2) by (1):
tanθ = 0.255/0.408 = 0.625
θ = **32°** below original direction

From (1): v = 0.408/(0.17 × cos32°) = **2.83 m s⁻¹**

### Real-World Applications

**Car collisions at intersections:**
- Police use debris patterns and final positions
- Apply 2D momentum conservation
- Calculate pre-collision speeds

**Particle physics:**
- Collision debris analyzed in bubble chambers
- Momentum conservation identifies unknown particles
- This is how many particles were discovered`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Newton's 1st Law: Object stays at rest or constant velocity unless resultant force acts (inertia)",
            "Newton's 2nd Law: F = ma (constant mass) or F = dp/dt (general form); acceleration in direction of resultant force",
            "Newton's 3rd Law: Equal and opposite forces on DIFFERENT objects; same type, simultaneous",
            "Weight W = mg is force of gravity; mass is constant, weight varies with g",
            "Momentum p = mv (vector); same direction as velocity; unit: kg m s⁻¹ or N s",
            "Conservation of momentum: total momentum constant in closed system with no external forces",
            "Impulse J = FΔt = Δp; equals area under F-t graph",
            "Longer collision time → smaller force (for same momentum change) - basis for safety features",
            "Elastic collision: both momentum and KE conserved; Inelastic: only momentum conserved",
            "Perfectly inelastic (objects stick): maximum KE loss; Explosion: KE increases",
            "2D collisions: conserve momentum separately in x and y directions",
            "Third law pairs: equal magnitude, opposite direction, same type, different objects, simultaneous"
        ],
        exam_tips: [
            "ALWAYS draw free body diagrams showing ALL forces ON the object - this is often required for marks",
            "Third law pairs must act on DIFFERENT objects - weight and normal force are NOT a pair",
            "Define positive direction before starting momentum problems and stay consistent",
            "To check if collision is elastic: calculate KE before and after - if equal, elastic",
            "For explosions from rest: total momentum = 0 before AND after",
            "Impulse = change in momentum = area under F-t graph - may need to estimate area",
            "Car safety question: explain that longer time gives smaller force for same momentum change",
            "For connected objects (pulleys), acceleration is same for both; tension is internal force",
            "In 2D problems, momentum conserved independently in each direction - two equations",
            "When objects stick together (perfectly inelastic), they have the SAME final velocity"
        ]
    },
    "Forces, Density, and Pressure": {
        topic: "Forces, Density, and Pressure",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/A%20level/A-Level_Physics__Force_&_Pressure.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvQSBsZXZlbC9BLUxldmVsX1BoeXNpY3NfX0ZvcmNlXyZfUHJlc3N1cmUubXA0IiwiaWF0IjoxNzY4MTA1OTY2LCJleHAiOjUyNjg2MDE5NjZ9._T_CxSC4BFixwI8m1X1gQ2bTSCCUlg3cWzINFQ3Hg4g",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/A%20level/Force_Density_and_Pressure_Exam_Mastery.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL0EgbGV2ZWwvRm9yY2VfRGVuc2l0eV9hbmRfUHJlc3N1cmVfRXhhbV9NYXN0ZXJ5Lm00YSIsImlhdCI6MTc2ODA3NTE3MiwiZXhwIjo1MjY4NTcxMTcyfQ.sblxOTVy3PLKBW8Gvxs4conuE1BTpnOjPv9XMQ1defs",
        subject: "A Level Physics",
        summary: "This topic covers the nature of fundamental and contact forces, including gravitational, electromagnetic, and nuclear forces. It extends to the concepts of density and pressure, with detailed applications in fluids including hydrostatic pressure, upthrust, and Archimedes' principle. Understanding these concepts is essential for analysing static systems and fluid behaviour.",
        sections: [
            {
                title: "1. Fundamental Forces of Nature",
                content: `## The Four Fundamental Forces

All forces in the universe can be traced back to four fundamental interactions.

### The Four Fundamental Forces

| Force | Range | Relative Strength | Acts On | Carrier Particle |
|-------|-------|-------------------|---------|------------------|
| Gravitational | Infinite | 1 | All matter (mass) | Graviton (theoretical) |
| Electromagnetic | Infinite | 10³⁷ | Charged particles | Photon |
| Strong Nuclear | ~10⁻¹⁵ m | 10³⁹ | Quarks, gluons | Gluon |
| Weak Nuclear | ~10⁻¹⁸ m | 10²⁵ | All particles | W and Z bosons |

### Gravitational Force

**Characteristics:**
- Always attractive (never repulsive)
- Acts between all objects with mass
- Very weak but infinite range
- Dominates at large scales (planets, stars, galaxies)
- Cannot be shielded against

**Equation:** F = Gm₁m₂/r² (Newton's Law of Gravitation)

### Electromagnetic Force

**Characteristics:**
- Can be attractive or repulsive
- Acts between charged particles
- Infinite range (but often cancelled by opposite charges)
- Responsible for most everyday forces
- Can be shielded

**Includes:** Electric force, magnetic force, light, radio waves

### Strong Nuclear Force

**Characteristics:**
- Very strong but very short range
- Holds quarks together inside protons and neutrons
- Holds protons and neutrons together in nucleus
- Overcomes electromagnetic repulsion between protons
- Responsible for nuclear binding energy

### Weak Nuclear Force

**Characteristics:**
- Very short range
- Responsible for radioactive beta decay
- Changes one type of quark into another
- Important in nuclear fusion in stars`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Contact Forces in Detail",
                content: `## Forces Requiring Physical Contact

Contact forces appear when surfaces touch. At the atomic level, they are electromagnetic interactions between electron clouds.

### Normal Force (N or R)

**Definition:** The force perpendicular to a surface that prevents objects passing through each other.

**Key Points:**
- Always perpendicular to the contact surface
- Adjusts automatically to prevent penetration
- NOT always equal to weight (only when on horizontal surface with no other vertical forces)

**On horizontal surface:** N = mg (if no other vertical forces)
**On inclined plane:** N = mg cos θ

### Friction Force (f)

**Definition:** The force parallel to a surface that opposes relative motion or attempted motion.

**Types of Friction:**

| Type | Situation | Formula |
|------|-----------|---------|
| Static friction | Object not yet moving | f ≤ μₛN |
| Kinetic (dynamic) friction | Object sliding | f = μₖN |
| Limiting friction | Maximum static friction | f = μₛN |

**Coefficient of Friction (μ):**
- μₛ = coefficient of static friction
- μₖ = coefficient of kinetic friction
- Usually μₛ > μₖ (harder to start moving than to keep moving)
- μ depends on the two surfaces in contact
- μ is dimensionless (no units)

**Typical Values:**
| Surfaces | μ (approximate) |
|----------|-----------------|
| Rubber on concrete | 0.8-1.0 |
| Wood on wood | 0.25-0.5 |
| Steel on steel | 0.1-0.15 |
| Ice on ice | 0.03 |
| Teflon on teflon | 0.04 |

### Tension (T)

**Definition:** The force transmitted through a string, rope, cable, or similar when pulled at both ends.

**Key Points:**
- Acts along the direction of the string
- Constant throughout an ideal (massless, inextensible) string
- Tension at both ends equal and opposite for massless string

### Worked Example: Block on Inclined Plane with Friction

A 10 kg block rests on a plane inclined at 30° to horizontal. If μₛ = 0.6, will the block slide? If it does slide, find acceleration given μₖ = 0.5.

**Solution:**
Weight component down plane: mg sin θ = 10 × 10 × sin 30° = 50 N
Normal force: N = mg cos θ = 10 × 10 × cos 30° = 86.6 N
Maximum static friction: f_max = μₛN = 0.6 × 86.6 = 52 N

Since mg sin θ (50 N) < f_max (52 N), **block will NOT slide**

If it were steeper and did slide:
Kinetic friction: f_k = μₖN = 0.5 × 86.6 = 43.3 N
Net force down: 50 - 43.3 = 6.7 N
Acceleration: a = 6.7/10 = **0.67 m s⁻²**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Density - Mass Per Unit Volume",
                content: `## Understanding Density

### Definition and Equation

**Density (ρ):** The mass per unit volume of a material.

**ρ = m/V**

| Symbol | Quantity | Unit |
|--------|----------|------|
| ρ | Density | kg m⁻³ |
| m | Mass | kg |
| V | Volume | m³ |

### Important Concepts

**Density is a material property:**
- Same material always has same density (at same conditions)
- Independent of amount of material
- A large block of iron has same density as a small piece

**Comparing States:**
- Generally: Solid > Liquid > Gas (for same substance)
- Exception: Water/Ice (ice is less dense than water at 0°C)

### Common Densities

| Substance | Density (kg m⁻³) | Notes |
|-----------|-----------------|-------|
| Air (at STP) | 1.2 | Varies with temperature/pressure |
| Water | 1000 | Maximum at 4°C |
| Ice | 917 | Why ice floats |
| Ethanol | 790 | Less dense than water |
| Aluminium | 2700 | Light metal |
| Iron/Steel | 7900 | Typical structural metal |
| Copper | 8900 | Dense metal |
| Lead | 11300 | Very dense |
| Gold | 19300 | Very dense precious metal |
| Mercury | 13600 | Liquid metal |
| Sun (average) | 1400 | Mostly hydrogen |
| Earth (average) | 5500 | Iron core |

### Measuring Density

**Regular Solid:**
1. Measure mass using balance (m)
2. Measure dimensions using ruler/vernier
3. Calculate volume from geometry (V)
4. Calculate ρ = m/V

**Irregular Solid:**
1. Measure mass using balance (m)
2. Use displacement method for volume:
   - Partially fill measuring cylinder with water
   - Record initial volume (V₁)
   - Lower object into water
   - Record final volume (V₂)
   - Volume of object = V₂ - V₁
3. Calculate ρ = m/(V₂ - V₁)

**Liquid:**
1. Weigh empty measuring cylinder (m₁)
2. Add known volume of liquid (V)
3. Weigh measuring cylinder with liquid (m₂)
4. Mass of liquid = m₂ - m₁
5. Calculate ρ = (m₂ - m₁)/V

### Worked Example: Composite Object

A hollow metal sphere has outer radius 5 cm and inner radius 4 cm. The metal has density 8000 kg m⁻³. Find the mass of the sphere.

**Solution:**
Volume of solid sphere (r = 0.05 m): V_outer = (4/3)π(0.05)³ = 5.24 × 10⁻⁴ m³
Volume of hollow (r = 0.04 m): V_inner = (4/3)π(0.04)³ = 2.68 × 10⁻⁴ m³
Volume of metal: V = V_outer - V_inner = 2.56 × 10⁻⁴ m³

Mass = ρV = 8000 × 2.56 × 10⁻⁴ = **2.05 kg**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Pressure - Force Per Unit Area",
                content: `## Understanding Pressure

### Definition and Equation

**Pressure (P):** The force acting perpendicularly per unit area.

**P = F/A**

| Symbol | Quantity | Unit |
|--------|----------|------|
| P | Pressure | Pa (pascal) |
| F | Force (perpendicular) | N |
| A | Area | m² |

**Unit Conversions:**
- 1 Pa = 1 N m⁻² = 1 kg m⁻¹ s⁻²
- 1 kPa = 1000 Pa
- 1 bar = 100,000 Pa = 100 kPa
- 1 atm = 101,325 Pa ≈ 101 kPa

### Atmospheric Pressure

**At sea level:** P_atm ≈ 101,000 Pa ≈ 101 kPa

This means atmospheric air exerts a force of about 101,000 N on every square metre!

**Why don't we feel it?**
- Pressure acts equally from all directions
- Internal body pressure matches external
- We've evolved to function at this pressure

### The Relationship Between Force, Pressure, and Area

**Same force, different pressures:**
- Smaller area → higher pressure
- Larger area → lower pressure

**This explains many practical applications:**

| Application | How It Works |
|-------------|--------------|
| Knife blade | Small area → high pressure → cuts easily |
| Drawing pin | Sharp point has tiny area → penetrates |
| Snowshoes | Large area → low pressure → don't sink |
| Wide tyres | Large area → low pressure → less damage to road |
| Stiletto heels | Tiny area → high pressure → damages floors |
| Elephant feet | Large area → lower pressure than high heels! |

### Worked Example 1: Walking vs Standing

A 60 kg person stands on both feet (total area 400 cm²) vs walking on one foot (200 cm²).

**Standing (both feet):**
Pressure = mg/A = (60 × 10)/(400 × 10⁻⁴) = 600/0.04 = **15,000 Pa = 15 kPa**

**Walking (one foot):**
Pressure = 600/(200 × 10⁻⁴) = 600/0.02 = **30,000 Pa = 30 kPa**

Pressure doubles when walking!

### Worked Example 2: Elephant vs Stiletto

| Property | Elephant | Woman in stilettos |
|----------|----------|-------------------|
| Mass | 5000 kg | 50 kg |
| Weight | 50,000 N | 500 N |
| Foot area | 4 × 0.1 m² = 0.4 m² | 2 × 0.5 cm² = 10⁻⁴ m² |
| Pressure | 125,000 Pa | 5,000,000 Pa |

The stiletto heel exerts **40× more pressure** than an elephant!`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Hydrostatic Pressure - Pressure in Fluids",
                content: `## Pressure at Depth in a Fluid

### The Hydrostatic Pressure Equation

**P = ρgh**

| Symbol | Quantity | Unit |
|--------|----------|------|
| P | Pressure (due to fluid) | Pa |
| ρ | Fluid density | kg m⁻³ |
| g | Gravitational field strength | N kg⁻¹ or m s⁻² |
| h | Depth below surface | m |

### Derivation

Consider a column of fluid of height h and cross-sectional area A:
- Volume of column: V = Ah
- Mass of column: m = ρV = ρAh
- Weight of column: W = mg = ρAhg
- Force on base: F = W = ρAhg
- Pressure = F/A = ρAhg/A = **ρgh** ✓

### Key Properties of Fluid Pressure

1. **Pressure increases with depth** (proportional to h)
2. **Pressure depends on fluid density** (denser fluid = more pressure)
3. **Pressure acts equally in all directions** at any given point (Pascal's principle)
4. **Pressure doesn't depend on container shape** - only on vertical depth
5. **Same pressure at same horizontal level** in a connected fluid

### Total Pressure at Depth

When accounting for atmospheric pressure above the fluid:

**P_total = P_atm + ρgh**

This is also called **absolute pressure**.

**Gauge pressure** = P_total - P_atm = ρgh (pressure above atmospheric)

### Worked Example 1: Pressure in a Lake

Calculate the total pressure on a diver 25 m below the surface of a freshwater lake.
(Take P_atm = 101 kPa, ρ_water = 1000 kg m⁻³, g = 10 m s⁻²)

**Solution:**
P_total = P_atm + ρgh
P_total = 101,000 + (1000 × 10 × 25)
P_total = 101,000 + 250,000
P_total = **351,000 Pa = 351 kPa**

This is about 3.5 atmospheres - significant compression!

### Worked Example 2: Oil and Water Layers

A tank contains oil (ρ = 800 kg m⁻³) floating on water. The oil layer is 2 m deep and the water layer is 3 m deep. Find the pressure at the bottom.

**Solution:**
Pressure at bottom of oil = ρ_oil × g × h_oil = 800 × 10 × 2 = 16,000 Pa

This acts at the top of the water layer.

Pressure at bottom of water = 16,000 + ρ_water × g × h_water
= 16,000 + 1000 × 10 × 3
= 16,000 + 30,000
= **46,000 Pa** (gauge) or **147,000 Pa** (absolute)

### Applications

**Barometers:** Measure atmospheric pressure using column of mercury
- Height of mercury column ≈ 760 mm at 1 atm
- P = ρ_Hg × g × h = 13,600 × 10 × 0.76 ≈ 101 kPa ✓

**Manometers:** Measure pressure differences using U-tube
- Difference in height gives pressure difference
- ΔP = ρgΔh

**Hydraulic Systems:** Transmit pressure through fluids
- Pascal's principle: pressure applied to enclosed fluid transmitted equally
- Hydraulic brakes, jacks, lifts`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Upthrust and Archimedes' Principle",
                content: `## Buoyancy Forces

### What is Upthrust?

**Upthrust (F_u or U):** The upward buoyancy force exerted on an object immersed (fully or partially) in a fluid.

### Origin of Upthrust

Upthrust arises because of the pressure difference between top and bottom of an immersed object:

- Pressure increases with depth: P = ρgh
- Bottom of object is deeper than top
- Therefore, pressure on bottom > pressure on top
- Net upward force = upthrust

### Archimedes' Principle

**"The upthrust on an object immersed in a fluid equals the weight of the fluid displaced."**

**U = ρ_fluid × V_displaced × g = m_fluid displaced × g = W_fluid displaced**

**Key points:**
- V_displaced = volume of object below fluid surface
- For fully immersed object: V_displaced = V_object
- Upthrust depends on FLUID density, not object density

### Three Scenarios for Objects in Fluids

| Condition | Result | What Happens |
|-----------|--------|--------------|
| ρ_object < ρ_fluid | Upthrust > Weight | Object floats |
| ρ_object = ρ_fluid | Upthrust = Weight | Object hovers |
| ρ_object > ρ_fluid | Upthrust < Weight | Object sinks |

### Floating Objects (Equilibrium)

For a floating object:
**Upthrust = Weight**
**ρ_fluid × V_submerged × g = ρ_object × V_total × g**

Simplifying:
**V_submerged/V_total = ρ_object/ρ_fluid**

This gives the **fraction submerged**.

### Worked Example 1: Fraction of Iceberg Underwater

An iceberg has density 917 kg m⁻³. Sea water has density 1025 kg m⁻³. What fraction is underwater?

**Solution:**
Fraction submerged = ρ_ice/ρ_seawater = 917/1025 = **0.895 = 89.5%**

Only about 10.5% of an iceberg is visible above water!

### Worked Example 2: Block of Wood

A wooden block (ρ = 600 kg m⁻³, volume 0.01 m³) floats in water.
(a) What volume is submerged?
(b) What is the upthrust?
(c) What mass could be placed on top before it sinks?

**Solution:**
(a) V_sub/V = ρ_wood/ρ_water = 600/1000 = 0.6
V_sub = 0.6 × 0.01 = **0.006 m³**

(b) U = Weight of wood = ρ_wood × V × g = 600 × 0.01 × 10 = **60 N**

(c) Maximum upthrust (when fully submerged):
U_max = ρ_water × V × g = 1000 × 0.01 × 10 = 100 N
Extra weight supported = 100 - 60 = 40 N
Extra mass = 40/10 = **4 kg**

### Apparent Weight

When an object is weighed in a fluid, the scale reads:

**Apparent weight = True weight - Upthrust**
**W_apparent = W - U = ρ_object × V × g - ρ_fluid × V × g**
**W_apparent = V × g × (ρ_object - ρ_fluid)**

### Worked Example 3: Weighing in Water

A metal block weighs 50 N in air and 32 N when fully immersed in water. Find:
(a) The upthrust
(b) The volume of the block
(c) The density of the metal

**Solution:**
(a) Upthrust = 50 - 32 = **18 N**

(b) Upthrust = ρ_water × V × g
18 = 1000 × V × 10
V = 18/10,000 = **1.8 × 10⁻³ m³**

(c) Weight = ρ × V × g
50 = ρ × 1.8 × 10⁻³ × 10
ρ = 50/(0.018) = **2778 kg m⁻³** (probably aluminium)

### Real-World Applications

**Ships:** Float because average density (steel hull + air inside) < water density. Ballast tanks adjust buoyancy.

**Submarines:** Fill ballast tanks with water to sink, pump out to rise.

**Hot Air Balloons:** Hot air is less dense than cold air → U > W → rises

**Fish Swim Bladders:** Adjust volume to control buoyancy at different depths

**Hydrometers:** Float higher in denser liquids; scale reads density directly`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Four fundamental forces: gravitational, electromagnetic, strong nuclear, weak nuclear",
            "Contact forces (normal, friction, tension) are electromagnetic at atomic level",
            "Friction: f ≤ μₛN (static); f = μₖN (kinetic); usually μₛ > μₖ",
            "Density ρ = m/V; unit: kg m⁻³; is a property of the material, not the object",
            "Object floats if its average density < fluid density",
            "Pressure P = F/A; unit: Pa = N m⁻²; force must be perpendicular",
            "Atmospheric pressure ≈ 101 kPa at sea level",
            "Hydrostatic pressure P = ρgh; increases with depth; independent of container shape",
            "Total pressure at depth = P_atm + ρgh",
            "Archimedes' Principle: Upthrust = weight of fluid displaced = ρ_fluid × V_sub × g",
            "For floating objects: fraction submerged = ρ_object/ρ_fluid",
            "Apparent weight = True weight - Upthrust"
        ],
        exam_tips: [
            "Convert all units to SI before calculating (especially cm² to m², cm³ to m³)",
            "Pressure = PERPENDICULAR force / area - always check force is perpendicular",
            "Hydrostatic pressure ρgh doesn't depend on container shape, only vertical depth",
            "For floating objects, upthrust = weight (equilibrium condition)",
            "Upthrust depends on FLUID density, not object density",
            "Remember friction is PARALLEL to surface, normal force is PERPENDICULAR",
            "Ships float because average density (including air inside) < water density",
            "The fraction submerged = ρ_object/ρ_fluid is a useful shortcut",
            "When asked about water pressure, check if they want gauge or absolute pressure",
            "μ is dimensionless - if your answer has units, you've made an error"
        ]
    },
    "Work, Energy, and Power": {
        topic: "Work, Energy, and Power",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/A%20level/Work,_Energy_&_Power.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvQSBsZXZlbC9Xb3JrLF9FbmVyZ3lfJl9Qb3dlci5tcDQiLCJpYXQiOjE3NjgxMDY5OTgsImV4cCI6NTI2ODYwMjk5OH0.FrlHh8D5Ll-zTzGXKxYiekatYFnFS3Sroz9zyFxG5Ds",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/A%20level/A-Level_Physics_Work_Energy_Power_Definitions.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL0EgbGV2ZWwvQS1MZXZlbF9QaHlzaWNzX1dvcmtfRW5lcmd5X1Bvd2VyX0RlZmluaXRpb25zLm00YSIsImlhdCI6MTc2ODA3NTAxNSwiZXhwIjo1MjY4NTcxMDE1fQ.Ppy6rv0PV5avMWgRHqmqeScuAeBTeBOWLOR5MTj-6V0",
        subject: "A Level Physics",
        summary: "This topic explores the fundamental concepts of energy transfer, including work done by forces, kinetic and potential energy, power, and efficiency. The conservation of energy is a key principle that underpins all of physics and is essential for solving mechanics problems.",
        sections: [
            {
                title: "1. Work Done - Energy Transfer by Forces",
                content: `## Understanding Work

### Definition and Equation

**Work (W):** The energy transferred when a force causes an object to move through a displacement.

**W = Fs cos θ**

| Symbol | Quantity | Unit |
|--------|----------|------|
| W | Work done | J (joule) |
| F | Force | N |
| s | Displacement | m |
| θ | Angle between force and displacement | degrees or radians |

### Understanding the Angle θ

The angle θ is measured between the force direction and the displacement direction:

| Angle | cos θ | Work Done | Description |
|-------|-------|-----------|-------------|
| 0° | 1 | W = Fs | Force and motion same direction |
| 90° | 0 | W = 0 | Force perpendicular to motion |
| 180° | -1 | W = -Fs | Force opposite to motion |

### Special Cases

**Force parallel to motion (θ = 0°):**
W = Fs cos 0° = Fs × 1 = **Fs**
- Maximum work done
- Force and motion in same direction
- Energy given TO the object

**Force perpendicular to motion (θ = 90°):**
W = Fs cos 90° = Fs × 0 = **0**
- NO work done
- Force doesn't cause motion in its direction

**Examples of zero work:**
- Carrying a box horizontally (upward force, horizontal motion)
- Satellite in circular orbit (gravitational force perpendicular to velocity)
- Charged particle in magnetic field (force perpendicular to velocity)

**Force opposite to motion (θ = 180°):**
W = Fs cos 180° = Fs × (-1) = **-Fs**
- Negative work done
- Energy taken FROM the object
- Examples: friction, braking

### Work Done Against Gravity

When lifting an object vertically:
**W = mgh**

Where:
- m = mass (kg)
- g = gravitational field strength (9.81 N kg⁻¹)
- h = vertical height gained (m)

This equals the gravitational potential energy gained.

### Work Done by Variable Forces

If force varies with position, work is the area under the F-x graph:

**W = ∫F dx**

For a spring: W = ∫kx dx = ½kx²

### Worked Example 1: Pulling at an Angle

A person pulls a sled 50 m along flat snow with a force of 200 N at 30° above horizontal. Calculate the work done.

**Solution:**
W = Fs cos θ = 200 × 50 × cos 30° = 200 × 50 × 0.866 = **8660 J**

### Worked Example 2: Work Against Friction

A box is pushed 20 m across a floor against a friction force of 80 N. Calculate the work done against friction.

**Solution:**
Work against friction = friction force × distance = 80 × 20 = **1600 J**
This appears as heat (thermal energy).

### Worked Example 3: Multiple Forces

A 10 kg box is pushed 5 m along a floor. The pushing force is 100 N, and friction is 40 N. Find:
(a) Work done by pushing force
(b) Work done by friction
(c) Net work done

**Solution:**
(a) W_push = 100 × 5 = **500 J**
(b) W_friction = -40 × 5 = **-200 J** (negative - against motion)
(c) W_net = 500 - 200 = **300 J**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Kinetic Energy - Energy of Motion",
                content: `## Understanding Kinetic Energy

### Definition and Equation

**Kinetic Energy (KE or Eₖ):** The energy an object possesses due to its motion.

**KE = ½mv²**

| Symbol | Quantity | Unit |
|--------|----------|------|
| KE | Kinetic energy | J |
| m | Mass | kg |
| v | Speed | m s⁻¹ |

### Key Features

- KE is always positive (v² is always positive)
- KE depends on speed squared (double speed → quadruple KE)
- KE is a scalar quantity

### Derivation of KE = ½mv²

Starting from rest, work done to accelerate object:
W = Fs = ma × s

Using SUVAT with u = 0:
v² = u² + 2as → s = v²/(2a)

Substituting:
W = ma × v²/(2a) = **½mv²**

This work done = KE gained ✓

### The Work-Energy Theorem

**Net work done on an object = Change in its kinetic energy**

**W_net = ΔKE = ½mv² - ½mu²**

This is one of the most important relationships in mechanics!

### Relationship to Momentum

Since p = mv, we can write:
**KE = p²/(2m)**

This is useful in collision problems.

### Worked Example 1: Kinetic Energy Calculation

A car of mass 1200 kg accelerates from 10 m s⁻¹ to 30 m s⁻¹. Calculate:
(a) Initial KE
(b) Final KE
(c) Work done by engine

**Solution:**
(a) KE₁ = ½ × 1200 × 10² = **60,000 J = 60 kJ**
(b) KE₂ = ½ × 1200 × 30² = **540,000 J = 540 kJ**
(c) Work = ΔKE = 540 - 60 = **480 kJ**

### Worked Example 2: Braking Distance

A car of mass 1500 kg travelling at 25 m s⁻¹ brakes. The braking force is constant at 7500 N. Find the stopping distance.

**Solution:**
Initial KE = ½ × 1500 × 25² = 468,750 J
Work done by brakes = KE lost (all of it)
Force × distance = 468,750
7500 × d = 468,750
d = **62.5 m**

Note: At double the speed (50 m s⁻¹), the stopping distance would be 4× longer!

### Worked Example 3: Speed from Height

A 2 kg ball is dropped from 20 m. Find its speed just before hitting the ground.

**Solution:**
Using conservation of energy:
GPE lost = KE gained
mgh = ½mv²
gh = ½v²
v = √(2gh) = √(2 × 10 × 20) = √400 = **20 m s⁻¹**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Potential Energy - Stored Energy",
                content: `## Types of Potential Energy

### Gravitational Potential Energy (GPE)

**GPE = mgh**

| Symbol | Quantity | Unit |
|--------|----------|------|
| GPE | Gravitational potential energy | J |
| m | Mass | kg |
| g | Gravitational field strength | N kg⁻¹ |
| h | Height above reference point | m |

**Key Points:**
- GPE is relative to a chosen reference point (usually ground level)
- Only CHANGES in GPE matter, not absolute values
- Valid near Earth's surface where g is approximately constant
- At A-Level, the reference point is usually stated or obvious

### Derivation of GPE = mgh

Work done to lift object against gravity:
W = Force × distance = mg × h = mgh

This work is stored as GPE ✓

### Elastic Potential Energy (EPE)

**EPE = ½kx² = ½Fx**

| Symbol | Quantity | Unit |
|--------|----------|------|
| EPE | Elastic potential energy | J |
| k | Spring constant | N m⁻¹ |
| x | Extension | m |
| F | Force (= kx) | N |

**Key Points:**
- EPE = Area under force-extension graph
- Valid when spring obeys Hooke's Law
- x can be extension or compression
- Same formula for both

### Derivation of EPE = ½kx²

Work done to stretch spring:
W = ∫F dx = ∫kx dx = ½kx²

This work is stored as EPE ✓

### Electric Potential Energy

EPE = qV (charge × potential)
EPE = kq₁q₂/r (between point charges)

### Worked Example 1: GPE Calculation

A crane lifts a 500 kg load 25 m. Calculate the GPE gained.

**Solution:**
GPE = mgh = 500 × 10 × 25 = **125,000 J = 125 kJ**

### Worked Example 2: Spring Energy

A spring with k = 800 N m⁻¹ is compressed by 0.05 m. Calculate:
(a) The EPE stored
(b) The force applied

**Solution:**
(a) EPE = ½kx² = ½ × 800 × 0.05² = ½ × 800 × 0.0025 = **1.0 J**
(b) F = kx = 800 × 0.05 = **40 N**

### Worked Example 3: Multiple Energy Stores

A 0.2 kg ball is dropped from 5 m above a spring (k = 1000 N m⁻¹). How much does the spring compress?

**Solution:**
At maximum compression, all GPE → EPE (momentarily at rest)

Let compression = x
Total fall = 5 + x (ball falls past loading point)

mg(5 + x) = ½kx²
0.2 × 10 × (5 + x) = ½ × 1000 × x²
2(5 + x) = 500x²
10 + 2x = 500x²
500x² - 2x - 10 = 0

Using quadratic formula: x = **0.144 m = 14.4 cm**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Conservation of Energy",
                content: `## The Fundamental Principle

### The Law of Conservation of Energy

**"Energy cannot be created or destroyed, only transferred from one form to another or from one object to another."**

This is one of the most fundamental laws in all of physics!

### Total Energy in a Closed System

**Total energy before = Total energy after**
**KE₁ + GPE₁ + EPE₁ + ... = KE₂ + GPE₂ + EPE₂ + ...**

### Common Energy Transformations

| Process | Energy Transformation |
|---------|----------------------|
| Falling object | GPE → KE |
| Throwing upward | KE → GPE |
| Braking car | KE → Heat (internal energy) |
| Stretching spring | KE → EPE |
| Spring release | EPE → KE |
| Pendulum swing | GPE ↔ KE (continuous exchange) |
| Roller coaster | GPE ↔ KE (with losses to friction) |

### Free Fall Analysis

Object dropped from height h:
- At TOP: GPE = mgh, KE = 0, Total = mgh
- At BOTTOM: GPE = 0, KE = ½mv², Total = ½mv²

Conservation: mgh = ½mv²
Therefore: **v = √(2gh)**

This is independent of mass!

### Pendulum Analysis

At any height h below maximum height H:
mgh_max = mgh + ½mv²

Rearranging: v = √(2g(h_max - h))

At lowest point (h = 0): v_max = √(2gh_max)

### Including Energy Dissipation

When friction or air resistance is present:
**Initial Total Energy = Final Total Energy + Energy Dissipated**

KE₁ + GPE₁ = KE₂ + GPE₂ + W_friction

Where W_friction = friction force × distance

### Worked Example 1: Roller Coaster

A 500 kg roller coaster car starts from rest at 40 m height. Find its speed at:
(a) 10 m height
(b) ground level
(Ignore friction)

**Solution:**
(a) At 10 m: mgh₁ = mgh₂ + ½mv²
gh₁ = gh₂ + ½v²
10 × 40 = 10 × 10 + ½v²
400 = 100 + ½v²
v² = 600
v = **24.5 m s⁻¹**

(b) At ground: mgh = ½mv²
v = √(2gh) = √(2 × 10 × 40) = **28.3 m s⁻¹**

### Worked Example 2: With Friction

A 2 kg block slides down a ramp from 3 m height. At the bottom, its speed is 6 m s⁻¹. Calculate the energy lost to friction.

**Solution:**
Initial: GPE = mgh = 2 × 10 × 3 = 60 J, KE = 0
Final: GPE = 0, KE = ½ × 2 × 6² = 36 J

Energy lost = 60 - 36 = **24 J**

### Worked Example 3: Projectile

A ball is thrown upward at 15 m s⁻¹. Find its maximum height.

**Solution:**
At max height, KE → GPE:
½mv² = mgh
½v² = gh
h = v²/(2g) = 15²/(2 × 10) = **11.25 m**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Power - Rate of Energy Transfer",
                content: `## Understanding Power

### Definition and Equations

**Power (P):** The rate of doing work or transferring energy.

**P = W/t = ΔE/t**

| Symbol | Quantity | Unit |
|--------|----------|------|
| P | Power | W (watt) |
| W | Work done | J |
| t | Time | s |
| ΔE | Energy transferred | J |

**1 watt = 1 joule per second = 1 J s⁻¹**

### Power and Force (for constant velocity)

**P = Fv**

**Derivation:**
P = W/t = Fs/t = F × (s/t) = F × v = **Fv**

This is extremely useful when force and velocity are known.

### Power at Varying Velocity

For instantaneous power:
**P = Fv** (where v is instantaneous velocity)

When accelerating, power changes as velocity changes.

### Applications

**Car Engine Power:**
- At constant speed: driving force = resistive forces
- Maximum speed determined by power: P = F_resistance × v_max
- If air resistance ∝ v², then power ∝ v³ at high speeds

**Human Power:**
| Activity | Power (W) |
|----------|-----------|
| Resting metabolic | ~80 W |
| Walking | ~250 W |
| Cycling (leisure) | ~75 W |
| Cycling (racing) | ~400 W |
| Sprinting | ~2000 W (short burst) |
| Elite cycling (1 hour) | ~400 W |

### Power Units

| Unit | Equivalent |
|------|------------|
| 1 W | 1 J s⁻¹ |
| 1 kW | 1000 W |
| 1 MW | 10⁶ W |
| 1 hp (horsepower) | 746 W |

### Worked Example 1: Lift Motor

A lift motor raises a 1800 kg cabin (including passengers) 25 m in 20 s. Calculate:
(a) Work done
(b) Power output

**Solution:**
(a) W = mgh = 1800 × 10 × 25 = **450,000 J = 450 kJ**
(b) P = W/t = 450,000/20 = **22,500 W = 22.5 kW**

### Worked Example 2: Car at Constant Speed

A car travels at constant 30 m s⁻¹ against resistive forces of 800 N. Calculate the power output of the engine.

**Solution:**
At constant speed, driving force = resistive force = 800 N
P = Fv = 800 × 30 = **24,000 W = 24 kW**

### Worked Example 3: Maximum Speed

A car has maximum engine power 80 kW. At high speed, air resistance is the dominant force, given by F = 0.5v². Find the maximum speed.

**Solution:**
At maximum speed, P = Fv:
80,000 = 0.5v² × v = 0.5v³
v³ = 160,000
v = **54.3 m s⁻¹** (about 195 km/h)

### Worked Example 4: Climbing

A cyclist of total mass 80 kg climbs a hill at constant 5 m s⁻¹. The hill rises 1 m for every 20 m along the road. Calculate the power output.

**Solution:**
Vertical speed = 5/20 = 0.25 m s⁻¹
Power = rate of GPE gain = mg × vertical speed
P = 80 × 10 × 0.25 = **200 W**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Efficiency - Useful Energy Output",
                content: `## Measuring Effectiveness of Energy Transfer

### Definition and Equation

**Efficiency:** The ratio of useful energy output to total energy input.

**Efficiency = (Useful output / Total input) × 100%**

**η = (E_useful / E_input) × 100%**

Or equivalently using power:
**η = (P_useful / P_input) × 100%**

### Key Points

- Efficiency is always less than 100% (no perfect machine)
- Efficiency has no units (it's a ratio, often given as %)
- The "missing" energy is dissipated (usually as heat)
- Energy is conserved; it just becomes less useful

### Wasted Energy

**E_input = E_useful + E_wasted**
**P_input = P_useful + P_wasted**

Usually wasted as:
- Heat (friction, electrical resistance)
- Sound (vibrations, air movement)
- Unwanted radiation

### Typical Efficiencies

| Device | Efficiency | Where Energy is Lost |
|--------|------------|---------------------|
| Electric motor | 85-95% | Heat in windings |
| LED light | 40-50% | Heat |
| Incandescent bulb | 5% | Heat (95% wasted!) |
| Car petrol engine | 25-30% | Heat, exhaust |
| Diesel engine | 35-45% | Heat, exhaust |
| Human body | 25% | Heat |
| Power station | 30-40% | Heat to cooling towers |
| Electric kettle | 90-95% | Heat to surroundings |
| Solar panel | 15-25% | Reflection, heat |

### Efficiency of Multiple Stages

For a system with multiple energy transfers:
**Overall efficiency = η₁ × η₂ × η₃ × ...**

Example: Power station (40%) → transmission (95%) → motor (90%)
Overall = 0.40 × 0.95 × 0.90 = **0.342 = 34.2%**

### Worked Example 1: Motor Efficiency

A motor uses 2000 J of electrical energy to lift a 50 kg load by 3 m. Calculate the efficiency.

**Solution:**
Useful output = GPE = mgh = 50 × 10 × 3 = 1500 J
Efficiency = 1500/2000 × 100% = **75%**

Energy wasted = 2000 - 1500 = **500 J** (as heat)

### Worked Example 2: Car Efficiency

A car engine has input power 60 kW. At a constant speed of 25 m s⁻¹, the resistive forces total 1500 N.
(a) Calculate the useful power output
(b) Calculate the efficiency
(c) Calculate the power wasted

**Solution:**
(a) Useful power = Fv = 1500 × 25 = **37,500 W = 37.5 kW**
(b) Efficiency = 37.5/60 × 100% = **62.5%**
(c) Power wasted = 60 - 37.5 = **22.5 kW**

### Worked Example 3: Pump System

A pump lifts water from 10 m depth at a rate of 50 kg per minute. The pump motor draws 200 W from the supply. Calculate the overall efficiency.

**Solution:**
Useful power = mass flow rate × g × height
= (50/60) × 10 × 10 = 83.3 W

Efficiency = 83.3/200 × 100% = **41.7%**`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Work done W = Fs cos θ; unit: joule (J); only force component in direction of motion does work",
            "No work done if force perpendicular to motion (cos 90° = 0)",
            "Kinetic energy KE = ½mv²; doubles when v increases by √2",
            "Gravitational potential energy GPE = mgh (near Earth's surface, constant g)",
            "Elastic potential energy EPE = ½kx² = ½Fx = area under F-x graph",
            "Work-Energy Theorem: Net work = ΔKE = ½mv² - ½mu²",
            "Conservation of Energy: Total energy constant in closed system; can be transformed, not created/destroyed",
            "For free fall: v = √(2gh) - independent of mass",
            "Power P = W/t = ΔE/t = Fv; unit: watt (W) = J s⁻¹",
            "Car maximum speed: P = F_resistance × v_max",
            "Efficiency = useful output / total input × 100%; always < 100%",
            "Energy 'lost' is dissipated as heat - total energy is always conserved"
        ],
        exam_tips: [
            "Check angle θ in W = Fs cos θ; if force parallel to motion, θ = 0°, cos θ = 1",
            "Use v = √(2gh) for free fall from height h - equation from energy conservation",
            "Braking distance ∝ speed² because KE ∝ v²",
            "Always account for energy 'lost' to friction in calculations",
            "P = Fv is valid only when F and v are parallel; useful for constant speed problems",
            "At maximum speed, driving force = resistive forces (acceleration = 0)",
            "For efficiency, check whether given values are energy or power - formula works for both",
            "Draw energy bar charts or flow diagrams to visualise energy transformations",
            "GPE reference point can be chosen freely - only changes in GPE matter",
            "Springs store ½kx² whether stretched OR compressed"
        ]
    },
    "Deformation of Solids": {
        topic: "Deformation of Solids",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/A%20level/Deformation_of_Solids.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvQSBsZXZlbC9EZWZvcm1hdGlvbl9vZl9Tb2xpZHMubXA0IiwiaWF0IjoxNzY4MTA2MTQzLCJleHAiOjUyNjg2MDIxNDN9.jFAcaXYwxvHW71r-166Mc0SYC6RDJxiDt_okF60SYa4",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/A%20level/Stress_Strain_and_Young_Modulus_Explained.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL0EgbGV2ZWwvU3RyZXNzX1N0cmFpbl9hbmRfWW91bmdfTW9kdWx1c19FeHBsYWluZWQubTRhIiwiaWF0IjoxNzY4MDc1NTE2LCJleHAiOjUyNjg1NzE1MTZ9.KtDVq26V-3OpbpY94ElHD8kQhNcEziDimsCZ-jCLnm4",
        subject: "A Level Physics",
        summary: "This topic explores how solid materials respond to forces, including Hooke's law, stress and strain, Young's modulus, and the energy stored in deformed materials. Understanding deformation is crucial for engineering, materials science, and structural design.",
        sections: [
            {
                title: "1. Hooke's Law - Springs and Elasticity",
                content: `## Understanding Spring Behaviour

### Hooke's Law Statement

**"The extension of a spring is directly proportional to the applied force, provided the elastic limit is not exceeded."**

**F = kx**

| Symbol | Quantity | Unit |
|--------|----------|------|
| F | Force (or load) | N |
| k | Spring constant | N m⁻¹ |
| x | Extension | m |

### Spring Constant (k)

**Definition:** The force required to produce unit extension.

**k = F/x = gradient of force-extension graph**

| Spring Constant | Description |
|-----------------|-------------|
| High k | Stiff spring, hard to stretch |
| Low k | Soft spring, easy to stretch |

### Important Limits

| Term | Definition |
|------|------------|
| Limit of proportionality | End of linear F-x region |
| Elastic limit | Beyond this, permanent deformation occurs |
| Yield point | Stress at which sudden plastic flow begins |

**Within elastic limit:** Spring returns to original length when unloaded
**Beyond elastic limit:** Permanent (plastic) deformation occurs

### Loading and Unloading

**Elastic behaviour:**
- Loading and unloading curves are identical
- All energy stored is recovered
- No hysteresis

**Beyond elastic limit:**
- Unloading curve lies below loading curve
- Permanent extension remains
- Area between curves = energy dissipated as heat

### Combinations of Springs

**Springs in Series (end to end):**
- Same force acts on each spring
- Total extension = sum of individual extensions
- **1/k_total = 1/k₁ + 1/k₂ + ...**
- Combined spring is LESS stiff

**Springs in Parallel (side by side):**
- Each spring shares the load
- Same extension for each spring
- **k_total = k₁ + k₂ + ...**
- Combined spring is MORE stiff

### Worked Example 1: Finding Spring Constant

A spring extends from 10.0 cm to 18.5 cm when a 3.0 kg mass is hung from it. Find the spring constant.

**Solution:**
Extension x = 18.5 - 10.0 = 8.5 cm = 0.085 m
Force F = mg = 3.0 × 10 = 30 N
k = F/x = 30/0.085 = **353 N m⁻¹**

### Worked Example 2: Springs in Series

Two springs with constants 200 N m⁻¹ and 300 N m⁻¹ are connected in series. Find the total extension when a 12 N force is applied.

**Solution:**
1/k_total = 1/200 + 1/300 = 3/600 + 2/600 = 5/600
k_total = 600/5 = 120 N m⁻¹

Extension = F/k = 12/120 = **0.10 m = 10 cm**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Stress and Strain - Material Properties",
                content: `## Size-Independent Material Properties

### Why Use Stress and Strain?

Force and extension depend on the SIZE of the sample.
Stress and strain are MATERIAL PROPERTIES - independent of sample size.

### Tensile Stress (σ)

**Definition:** Force per unit cross-sectional area.

**σ = F/A**

| Symbol | Quantity | Unit |
|--------|----------|------|
| σ | Stress | Pa (or N m⁻²) |
| F | Force | N |
| A | Cross-sectional area | m² |

**Types of stress:**
- Tensile stress: pulling (stretching)
- Compressive stress: pushing (squashing)
- Shear stress: parallel forces in opposite directions

### Tensile Strain (ε)

**Definition:** Extension per unit original length (fractional change in length).

**ε = Δx/x₀ = extension/original length**

| Symbol | Quantity | Unit |
|--------|----------|------|
| ε | Strain | No units (ratio) |
| Δx | Extension | m |
| x₀ | Original length | m |

**Note:** Strain is often expressed as a percentage: ε × 100%

### Comparison

| Property | Force-Extension | Stress-Strain |
|----------|-----------------|---------------|
| Depends on | Sample dimensions | Material only |
| Graph for different samples | Different curves | Same curve for same material |
| Useful for | Specific springs/wires | Material properties |

### Worked Example: Calculating Stress and Strain

A steel wire of length 2.0 m and diameter 0.80 mm is stretched by a force of 200 N, producing an extension of 1.2 mm.

Calculate: (a) stress, (b) strain

**Solution:**
(a) **Stress:**
Radius = 0.40 mm = 0.40 × 10⁻³ m
Area = πr² = π × (0.40 × 10⁻³)² = 5.03 × 10⁻⁷ m²
σ = F/A = 200/(5.03 × 10⁻⁷) = **3.98 × 10⁸ Pa = 398 MPa**

(b) **Strain:**
ε = Δx/x₀ = 0.0012/2.0 = **6.0 × 10⁻⁴ = 0.06%**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Young's Modulus - Measuring Stiffness",
                content: `## The Elastic Modulus

### Definition

**Young's Modulus (E):** The ratio of stress to strain in the linear (elastic) region.

**E = σ/ε = stress/strain**

Or, expanding:
**E = (F/A)/(Δx/x₀) = (F × x₀)/(A × Δx)**

| Symbol | Quantity | Unit |
|--------|----------|------|
| E | Young's modulus | Pa (typically GPa) |

### Significance

Young's modulus is:
- A measure of STIFFNESS (not strength)
- A material constant (independent of sample size)
- Higher E = stiffer material (harder to stretch)
- Temperature dependent

### Typical Values

| Material | E (GPa) | Description |
|----------|---------|-------------|
| Diamond | 1000 | Extremely stiff |
| Steel | 200 | Very stiff |
| Copper | 130 | Moderately stiff |
| Aluminium | 70 | Less stiff |
| Glass | 70 | Brittle |
| Bone | 10-20 | Biological |
| Rubber | 0.01-0.1 | Very stretchy |
| Wood | 10-15 | Along grain |

### Determining Young's Modulus

**From stress-strain graph:**
E = gradient of the linear (elastic) region

**Experimentally (Searle's apparatus):**
1. Measure original length x₀
2. Measure diameter (to calculate area A)
3. Add known masses, measure extensions
4. Plot stress vs strain graph
5. Calculate gradient = E

### Worked Example 1: Calculate Young's Modulus

A copper wire 2.5 m long and 0.60 mm diameter extends by 0.35 mm when a 50 N load is applied.

**Solution:**
Area = π(0.30 × 10⁻³)² = 2.83 × 10⁻⁷ m²
Stress = F/A = 50/(2.83 × 10⁻⁷) = 1.77 × 10⁸ Pa
Strain = Δx/x₀ = (0.35 × 10⁻³)/2.5 = 1.40 × 10⁻⁴

E = σ/ε = (1.77 × 10⁸)/(1.40 × 10⁻⁴) = **1.3 × 10¹² Pa = 130 GPa** ✓ (matches copper!)

### Worked Example 2: Finding Extension

A steel rod (E = 200 GPa) has length 1.5 m and cross-sectional area 2.0 × 10⁻⁴ m². Find the extension when a 80 kN tensile force is applied.

**Solution:**
E = (F × x₀)/(A × Δx)
Rearranging: Δx = (F × x₀)/(A × E)
Δx = (80,000 × 1.5)/(2.0 × 10⁻⁴ × 200 × 10⁹)
Δx = 120,000/(4.0 × 10⁷)
Δx = **3.0 × 10⁻³ m = 3.0 mm**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Stress-Strain Graphs - Material Behaviour",
                content: `## Interpreting Material Curves

### Key Features on a Stress-Strain Graph

| Point/Region | Description |
|--------------|-------------|
| O | Origin - no stress, no strain |
| Limit of proportionality (P) | End of linear region, Hooke's Law ends |
| Elastic limit (E) | Beyond this, permanent deformation |
| Yield point (Y) | Sudden plastic flow begins |
| Plastic region | Permanent deformation zone |
| Ultimate tensile stress (UTS) | Maximum stress before breaking |
| Fracture point (F) | Material breaks |

### Material Classifications

**Ductile Materials (e.g., copper, mild steel):**
- Large plastic region before breaking
- Can be drawn into wires
- Considerable extension before fracture
- Show necking (localised narrowing) before breaking
- Warning before failure!

**Brittle Materials (e.g., glass, cast iron, ceramics):**
- Little or no plastic region
- Break suddenly without warning
- Fracture occurs at or near elastic limit
- Small strain at fracture
- Dangerous failure mode

**Elastic Materials (e.g., rubber):**
- Non-linear stress-strain curve
- Very large strains possible
- Complete elastic recovery (within limits)
- Hysteresis loop on loading/unloading
- Energy dissipated as heat

### Comparing Materials Graphically

| Material Property | Graph Feature |
|-------------------|---------------|
| Stiffness | Gradient (steeper = stiffer) |
| Strength | Maximum stress (UTS) |
| Ductility | Strain at fracture |
| Brittleness | No plastic region |
| Toughness | Area under curve |

### Polymers

Behaviour depends on:
- Temperature (glass transition)
- Rate of loading
- Molecular structure

Can be: brittle, ductile, or rubbery depending on conditions.

May show **creep**: continued extension under constant load over time.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Strain Energy - Energy in Deformation",
                content: `## Energy Stored in Stretched Materials

### Strain Energy Definition

**Strain Energy:** The potential energy stored in a material when it is deformed.

### From Force-Extension Graph

**Strain energy = Area under the F-x graph**

For linear (Hookean) behaviour:
**E = ½Fx = ½kx²**

Derivation: Area of triangle = ½ × base × height = ½ × x × F = ½Fx

Since F = kx:
**E = ½(kx)x = ½kx²**

### Energy Per Unit Volume

For comparing different samples, use energy per unit volume:

**Strain energy per unit volume = ½ × stress × strain**
**u = ½σε**

This equals the area under the stress-strain graph.

### Energy in Elastic vs Plastic Deformation

**Elastic deformation (within elastic limit):**
- All strain energy is recoverable
- Loading curve = unloading curve
- No energy dissipated

**Plastic deformation (beyond elastic limit):**
- Some energy is NOT recoverable
- Unloading curve below loading curve
- Energy dissipated = area of hysteresis loop
- Dissipated energy → heat

### Hysteresis

**Definition:** The difference between loading and unloading curves.

**Hysteresis loop area = Energy dissipated per cycle**

Applications:
- Rubber absorbs vibrations (car suspension bushings)
- Shock absorbers use hysteresis
- Internal heating in tyres

### Worked Example 1: Spring Energy

A spring with k = 800 N m⁻¹ is stretched by 0.15 m. Calculate the strain energy stored.

**Solution:**
E = ½kx² = ½ × 800 × 0.15² = ½ × 800 × 0.0225 = **9.0 J**

### Worked Example 2: Wire Energy

A wire is stretched by a 500 N force producing an extension of 2.0 mm. Calculate the strain energy stored, assuming Hooke's Law is obeyed.

**Solution:**
E = ½Fx = ½ × 500 × (2.0 × 10⁻³) = **0.50 J**

### Worked Example 3: Energy per Unit Volume

A steel bar (E = 200 GPa) experiences a stress of 400 MPa. Calculate the strain energy per unit volume.

**Solution:**
First find strain: ε = σ/E = (400 × 10⁶)/(200 × 10⁹) = 0.002

Energy per unit volume = ½σε = ½ × (400 × 10⁶) × 0.002 = **400,000 J m⁻³ = 400 kJ m⁻³**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Experimental Methods",
                content: `## Measuring Material Properties

### Searle's Apparatus for Young's Modulus

**Purpose:** Accurate determination of Young's modulus

**Method:**
1. Use two identical wires (reference and test wire)
2. Reference wire keeps system vertical
3. Add known masses to test wire
4. Measure extension using vernier/micrometer
5. Plot force vs extension graph

**Advantages:**
- Reference wire eliminates thermal expansion errors
- Vernier scale gives precise extension measurement
- Systematic errors are minimised

### Simple Wire Extension Experiment

**Equipment needed:**
- Long thin wire (e.g., copper, 2-3 m)
- Ruler and metre rule
- Micrometer screw gauge
- Masses (slotted, known mass)
- Pulley and clamp system
- Marker on wire for reference

**Procedure:**
1. Measure original length with metre rule
2. Measure diameter with micrometer (multiple points)
3. Add masses incrementally
4. Record extension for each load
5. Plot stress-strain graph
6. Calculate E from gradient

### Measuring Spring Constant

**Static method:**
1. Hang spring vertically
2. Add masses, record extension
3. Plot F-x graph
4. Gradient = k

**Dynamic method:**
1. Oscillate mass on spring
2. Measure period T
3. Use T = 2π√(m/k)
4. Calculate k

### Sources of Error

| Source | How to Minimise |
|--------|-----------------|
| Zero error | Check reading with no load |
| Parallax error | View ruler/scale perpendicularly |
| Wire slipping | Secure clamping |
| Plastic deformation | Don't exceed elastic limit |
| Temperature changes | Use reference wire |
| Measuring diameter | Take multiple readings, calculate mean |`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Hooke's Law: F = kx (within elastic limit only)",
            "Spring constant k = F/x = gradient of F-x graph; unit: N m⁻¹",
            "Elastic limit: beyond this, permanent deformation occurs",
            "Springs in series: 1/k_total = 1/k₁ + 1/k₂; in parallel: k_total = k₁ + k₂",
            "Stress σ = F/A; unit: Pa (N m⁻²); force per unit cross-sectional area",
            "Strain ε = Δx/x₀; no units (dimensionless ratio)",
            "Young's modulus E = σ/ε = gradient of linear stress-strain region; unit: Pa",
            "Stress and strain are material properties (size-independent)",
            "Strain energy = ½Fx = ½kx² = area under F-x graph",
            "Energy per unit volume = ½σε = area under σ-ε graph",
            "Ductile materials: large plastic region; Brittle: break suddenly without warning",
            "Hysteresis loop area = energy dissipated per cycle (as heat)"
        ],
        exam_tips: [
            "Strain energy = area under graph = TRIANGLE (½Fx), not rectangle (Fx)",
            "Young's modulus only valid in LINEAR region of stress-strain graph",
            "Stress = Force / CROSS-SECTIONAL area (not surface area)",
            "Strain has NO UNITS - it's a ratio (extension/original length)",
            "For springs in series, use reciprocal rule (like resistors in parallel)",
            "When describing graphs: identify proportionality limit, elastic limit, yield, UTS, fracture",
            "Calculate area correctly for cross-section: A = πr² or πd²/4",
            "Energy dissipated = hysteresis loop area (difference between loading and unloading)",
            "Check units: E should be in Pa (or GPa); strain is dimensionless",
            "Ductile = warning before failure; Brittle = sudden failure without warning"
        ]
    },
    "Waves": {
        topic: "Waves",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/A%20level/A-Level_Waves_Core_Physics_Study_Guide.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL0EgbGV2ZWwvQS1MZXZlbF9XYXZlc19Db3JlX1BoeXNpY3NfU3R1ZHlfR3VpZGUubTRhIiwiaWF0IjoxNzY4MDc1MDk0LCJleHAiOjUyNjg1NzEwOTR9.lyLZgK6HcSmseCwx99KT_zfCQeQt9eQ2ABfY6LlYTDM",
        subject: "A Level Physics",
        summary: "Waves transfer energy without transferring matter. This topic covers wave properties and terminology, the wave equation, transverse and longitudinal waves, polarisation, the electromagnetic spectrum, and the inverse square law for intensity. Understanding waves is fundamental to many areas of physics.",
        sections: [
            {
                title: "1. Wave Properties and Terminology",
                content: `## Describing Waves

### Key Definitions

| Term | Definition | Unit |
|------|------------|------|
| Wavelength (λ) | Distance between adjacent points in phase | m |
| Frequency (f) | Number of complete oscillations per second | Hz (s⁻¹) |
| Period (T) | Time for one complete oscillation | s |
| Amplitude (A) | Maximum displacement from equilibrium | m |
| Wave speed (v) | Distance travelled by wave per unit time | m s⁻¹ |

### Relationships

**Period and Frequency:**
**T = 1/f** or **f = 1/T**

These are reciprocals - if one doubles, the other halves.

### The Wave Equation

**v = fλ**

| Symbol | Quantity | Unit |
|--------|----------|------|
| v | Wave speed | m s⁻¹ |
| f | Frequency | Hz |
| λ | Wavelength | m |

**Derivation:**
In time T (one period), the wave travels one wavelength λ.
Speed = distance/time = λ/T = λ × (1/T) = λ × f = **fλ** ✓

### Phase and Phase Difference

**Phase:** Position in the oscillation cycle (measured in degrees or radians).

**Phase difference (φ):** How far apart two points are in their oscillation cycles.

| Phase Difference | Meaning |
|------------------|---------|
| 0° (0 rad) | In phase - same displacement, same direction |
| 180° (π rad) | Antiphase - completely out of phase |
| 90° (π/2 rad) | Quarter wave apart |
| 360° (2π rad) | Back in phase (one complete cycle) |

**Phase difference from path difference:**
**φ = (path difference / λ) × 2π** (in radians)
**φ = (path difference / λ) × 360°** (in degrees)

### Worked Example 1: Wave Equation

A radio wave has frequency 100 MHz. Calculate its wavelength.

**Solution:**
c = fλ
λ = c/f = (3 × 10⁸)/(100 × 10⁶) = **3.0 m**

### Worked Example 2: Phase Difference

Two points on a sound wave are 0.25 m apart. If the wavelength is 0.50 m, find the phase difference.

**Solution:**
Path difference = 0.25 m = 0.50 × λ = λ/2
Phase difference = (0.25/0.50) × 360° = **180°** (antiphase)
Or in radians: (0.25/0.50) × 2π = **π rad**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Types of Waves - Transverse and Longitudinal",
                content: `## Wave Classification

### Transverse Waves

**Definition:** Oscillations are PERPENDICULAR to the direction of energy transfer.

**Examples:**
- Light and all electromagnetic waves
- Water surface waves
- Waves on a string
- S-waves (secondary seismic waves)

**Key Feature:** Can be represented by displacement perpendicular to propagation direction.

### Longitudinal Waves

**Definition:** Oscillations are PARALLEL to the direction of energy transfer.

**Examples:**
- Sound waves
- P-waves (primary seismic waves)
- Compression waves in springs (slinky)
- Ultrasound

**Key Features:**
- **Compressions:** Regions of high pressure/density (particles close together)
- **Rarefactions:** Regions of low pressure/density (particles spread apart)
- Wavelength = distance from compression to compression

### Comparing Wave Types

| Property | Transverse | Longitudinal |
|----------|------------|--------------|
| Oscillation direction | Perpendicular to propagation | Parallel to propagation |
| Can be polarised? | YES | NO |
| In vacuum? | EM waves: yes | Sound: no (needs medium) |
| Examples | Light, water | Sound, P-waves |

### Mechanical vs Electromagnetic Waves

| Mechanical Waves | Electromagnetic Waves |
|------------------|----------------------|
| Need a medium to travel | Travel through vacuum |
| Speed depends on medium | All travel at c in vacuum |
| Particles oscillate | Electric and magnetic fields oscillate |
| Examples: sound, water waves | Examples: light, radio, X-rays |

### Wave Fronts and Rays

**Wave front:** A line or surface connecting points at the same phase.
**Ray:** A line perpendicular to wave fronts showing direction of propagation.

- For a point source: circular (2D) or spherical (3D) wave fronts
- Far from source: wave fronts appear plane (flat)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Polarisation - Transverse Wave Property",
                content: `## Restricting Oscillation Direction

### What is Polarisation?

**Polarisation:** Restricting the oscillations of a transverse wave to one plane only.

**Unpolarised light:** Electric field oscillates in all directions perpendicular to propagation.
**Polarised light:** Electric field oscillates in ONE direction only.

### The Key Proof

**Only transverse waves can be polarised.**

Longitudinal waves (like sound) cannot be polarised because their oscillations are already in one direction (the direction of propagation).

**This proves light is a transverse wave** - critical evidence!

### Polarising Filters (Polaroids)

**Polariser:** Converts unpolarised light to plane-polarised light
**Analyser:** Tests whether light is polarised (second filter)

**When unpolarised light passes through one polariser:**
- Output is plane-polarised
- Intensity reduced to half: **I = I₀/2**

### Malus's Law

When **already polarised** light passes through an analyser at angle θ:

**I = I₀ cos²θ**

| Angle θ | cos²θ | Transmitted Intensity |
|---------|-------|----------------------|
| 0° | 1 | I₀ (maximum) |
| 30° | 0.75 | 0.75 I₀ |
| 45° | 0.5 | 0.5 I₀ |
| 60° | 0.25 | 0.25 I₀ |
| 90° | 0 | 0 (complete blocking) |

### Crossed Polarisers

Two polarisers at 90° to each other: NO light passes through!

### Applications of Polarisation

| Application | How It Works |
|-------------|--------------|
| Polaroid sunglasses | Block horizontally polarised glare from surfaces |
| LCD screens | Liquid crystals rotate polarisation between crossed polarisers |
| Stress analysis | Stress patterns visible between crossed polarisers |
| 3D cinema | Different polarisations for left and right eye |
| Photography filters | Reduce reflections/enhance contrast |

### Worked Example: Malus's Law

Polarised light of intensity 40 W m⁻² passes through an analyser at 60° to the polarisation direction.

**Solution:**
I = I₀ cos²θ = 40 × cos²60° = 40 × 0.25 = **10 W m⁻²**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. The Electromagnetic Spectrum",
                content: `## The Family of EM Waves

### Common Properties of All EM Waves

All electromagnetic waves:
- Are **transverse** (oscillating E and B fields perpendicular to direction)
- Travel at **c = 3.00 × 10⁸ m s⁻¹** in vacuum
- Are produced by **oscillating/accelerating charges**
- Can be **polarised**
- Transfer **energy** without transferring matter
- Do NOT require a medium

### The Spectrum (Increasing Frequency Order)

| Wave Type | Wavelength | Frequency | Production | Detection | Uses |
|-----------|------------|-----------|------------|-----------|------|
| Radio | > 1 mm | < 10¹¹ Hz | Oscillating circuits | Aerial/antenna | Broadcasting, communication |
| Microwave | 1 mm - 0.1 m | 10⁹ - 10¹¹ Hz | Magnetron | Aerial | Cooking, phones, radar |
| Infrared | 700 nm - 1 mm | 10¹¹ - 10¹⁴ Hz | Hot objects | Thermometers, films | Heating, night vision, remotes |
| Visible | 400 - 700 nm | ~10¹⁴ Hz | Hot objects, atoms | Eye, photographic film | Vision, lighting |
| Ultraviolet | 10 - 400 nm | 10¹⁵ - 10¹⁶ Hz | Sun, special lamps | Photographic film | Sterilisation, sun tan, detecting forgeries |
| X-rays | 10⁻¹¹ - 10⁻⁸ m | 10¹⁶ - 10¹⁹ Hz | High-speed electrons hitting metal | Photographic film | Medical imaging, security |
| Gamma (γ) | < 10⁻¹¹ m | > 10¹⁹ Hz | Nuclear decay | GM tube | Cancer treatment, sterilisation |

### The Visible Spectrum

**ROYGBIV:** Red, Orange, Yellow, Green, Blue, Indigo, Violet

| Colour | Wavelength (nm) |
|--------|-----------------|
| Red | ~700 |
| Orange | ~620 |
| Yellow | ~580 |
| Green | ~530 |
| Blue | ~470 |
| Violet | ~400 |

### Speed, Frequency, and Wavelength

**c = fλ** where c = 3.00 × 10⁸ m s⁻¹

- Higher frequency = shorter wavelength = more energy per photon
- Lower frequency = longer wavelength = less energy per photon

### Worked Example: Wavelength Calculation

Calculate the wavelength of green light with frequency 5.5 × 10¹⁴ Hz.

**Solution:**
λ = c/f = (3.0 × 10⁸)/(5.5 × 10¹⁴) = **5.45 × 10⁻⁷ m = 545 nm** ✓`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Intensity and the Inverse Square Law",
                content: `## Energy Transfer by Waves

### Intensity Definition

**Intensity (I):** Power per unit area (energy per unit area per unit time).

**I = P/A**

| Symbol | Quantity | Unit |
|--------|----------|------|
| I | Intensity | W m⁻² |
| P | Power | W |
| A | Area | m² |

### Intensity and Amplitude

**I ∝ A²**

Intensity is proportional to the SQUARE of amplitude.

| Amplitude Change | Intensity Change |
|------------------|------------------|
| Double (×2) | Quadruple (×4) |
| Triple (×3) | ×9 |
| Halve (÷2) | Quarter (÷4) |

### The Inverse Square Law

For a **point source** radiating equally in all directions (isotropically):

**I = P/(4πr²)**

At distance r, power P spreads over sphere of surface area 4πr².

**I ∝ 1/r²**

### Consequences of Inverse Square Law

| Distance Change | Intensity Change |
|-----------------|------------------|
| Double (×2) | Quarter (÷4) |
| Triple (×3) | ÷9 |
| Halve (÷2) | Quadruple (×4) |
| ×10 | ÷100 |

### Combining the Relationships

For a point source:
- **I ∝ 1/r²** (inverse square law)
- **I ∝ A²** (amplitude relationship)

Therefore: **A ∝ 1/r** (amplitude decreases with distance)

### When Inverse Square Law Applies

**Applies when:**
- Point source (or very far from extended source)
- Uniform radiation in all directions
- No absorption by medium
- No reflection from surfaces

**Does NOT apply:**
- Close to extended sources
- Collimated beams (lasers)
- Plane waves
- With significant absorption

### Worked Example 1: Intensity Calculation

A 100 W light bulb radiates uniformly. Calculate the intensity at 5.0 m.

**Solution:**
I = P/(4πr²) = 100/(4π × 5²) = 100/(314) = **0.318 W m⁻²**

### Worked Example 2: Distance Calculation

The intensity of sunlight at Earth is 1400 W m⁻². At what distance would it be 350 W m⁻²?

**Solution:**
I₁r₁² = I₂r₂² (from inverse square law)
1400 × r_Earth² = 350 × r₂²
r₂² = 4 × r_Earth²
r₂ = **2 × r_Earth** (twice as far from the Sun)

### Worked Example 3: Combined Problem

A source produces intensity 80 W m⁻² at 2 m distance, creating amplitude A. Find the intensity and amplitude at 4 m.

**Solution:**
Intensity: I ∝ 1/r²
I₂ = I₁ × (r₁/r₂)² = 80 × (2/4)² = 80 × 0.25 = **20 W m⁻²**

Amplitude: A ∝ 1/r
A₂ = A₁ × (r₁/r₂) = A × (2/4) = **A/2** (half the amplitude)`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Wave equation: v = fλ; Period T = 1/f",
            "Wavelength λ = distance between adjacent points in phase",
            "Transverse waves: oscillations perpendicular to direction of energy transfer",
            "Longitudinal waves: oscillations parallel to direction of energy transfer (compressions and rarefactions)",
            "Only transverse waves can be polarised - this proves light is transverse",
            "Malus's Law: I = I₀cos²θ for polarised light through analyser",
            "All EM waves travel at c = 3.00 × 10⁸ m s⁻¹ in vacuum",
            "EM spectrum (increasing frequency): radio, microwave, IR, visible, UV, X-rays, gamma",
            "Intensity I = P/A; unit: W m⁻²",
            "Intensity ∝ amplitude² (I ∝ A²)",
            "Inverse square law: I = P/(4πr²); I ∝ 1/r² for point source",
            "Phase difference φ = (path difference/λ) × 2π radians"
        ],
        exam_tips: [
            "Phase difference in radians = (path difference/λ) × 2π; or in degrees × 360°",
            "Polarisation proves light is transverse - use this in 'evidence for' questions",
            "Remember: I ∝ A² means double amplitude = 4× intensity",
            "Inverse square law only applies to POINT sources radiating uniformly",
            "Know typical wavelengths: visible light 400-700 nm, radio > 1 mm",
            "Sound cannot be polarised because it's longitudinal",
            "For crossed polarisers at 90°: NO light passes through",
            "When unpolarised light passes through polariser: I = I₀/2",
            "c = fλ works for ALL waves (not just EM) - use appropriate speed",
            "Higher frequency = shorter wavelength = more energy per photon"
        ]
    },
    "Superposition": {
        topic: "Superposition",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/A%20level/A-Level_Physics__Superposition.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvQSBsZXZlbC9BLUxldmVsX1BoeXNpY3NfX1N1cGVycG9zaXRpb24ubXA0IiwiaWF0IjoxNzY4MTA2MDUyLCJleHAiOjUyNjg2MDIwNTJ9.99aj6PlbcKNhyyfbgxoQQNHB_oye3943DCFLEJb7a_w",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/A%20level/A-Level_Physics_Superposition_and_Waves_Revision.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL0EgbGV2ZWwvQS1MZXZlbF9QaHlzaWNzX1N1cGVycG9zaXRpb25fYW5kX1dhdmVzX1JldmlzaW9uLm00YSIsImlhdCI6MTc2ODA3NDk5NywiZXhwIjo1MjY4NTcwOTk3fQ.Vio2CZ2-9u70Oa3gw9Of5NF6JfQrB2_BfnFlmXD52AI",
        subject: "A Level Physics",
        summary: "Superposition occurs when two or more waves meet at a point. This topic covers the principle of superposition, interference patterns, Young's double-slit experiment, diffraction gratings, and stationary waves. These concepts are fundamental to understanding wave behaviour and optical instruments.",
        sections: [
            {
                title: "1. Principle of Superposition and Interference",
                content: `## Waves Meeting

### The Principle of Superposition

**"When two or more waves meet at a point, the resultant displacement is the vector sum of the individual displacements."**

This applies to all types of waves and is the basis for interference.

### Types of Interference

| Type | Phase Difference | Path Difference | Result |
|------|------------------|-----------------|--------|
| Constructive | 0, 2π, 4π... (0°, 360°, 720°...) | nλ | Maximum amplitude |
| Destructive | π, 3π, 5π... (180°, 540°...) | (n+½)λ | Minimum/zero amplitude |

### Constructive Interference

- Waves are **in phase**
- Crests meet crests, troughs meet troughs
- Path difference = 0, λ, 2λ, 3λ... = **nλ**
- Resultant amplitude = A₁ + A₂

### Destructive Interference

- Waves are in **antiphase**
- Crests meet troughs
- Path difference = λ/2, 3λ/2, 5λ/2... = **(n+½)λ**
- Resultant amplitude = |A₁ - A₂|
- If A₁ = A₂, resultant = 0 (complete cancellation)

### Coherence - Essential for Observable Interference

For a **stable, observable interference pattern**, waves must be:

1. **Coherent:** Constant phase relationship (same frequency)
2. **Same wavelength:** For sustained pattern
3. **Similar amplitude:** For good contrast

**Incoherent sources** (e.g., two separate light bulbs) do not produce stable interference patterns.

### Path Difference Calculation

**Path difference = |S₁P - S₂P|**

Where S₁P and S₂P are distances from sources to point P.

### Worked Example: Interference Condition

Two speakers 2.0 m apart emit sound of wavelength 0.5 m. A point P is 4.0 m from speaker 1 and 5.0 m from speaker 2. Is there constructive or destructive interference at P?

**Solution:**
Path difference = |5.0 - 4.0| = 1.0 m
1.0 m = 2 × 0.5 m = **2λ**
This is a whole number of wavelengths, so **constructive interference** ✓`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Young's Double-Slit Experiment",
                content: `## Demonstrating the Wave Nature of Light

### Historical Significance

Young's experiment (1801) provided critical evidence that light is a wave, not a particle. It showed that light exhibits interference, which only waves can do.

### Experimental Setup

1. Monochromatic light source (single wavelength)
2. Single slit (to create coherent source)
3. Double slit (two narrow parallel slits)
4. Screen to observe pattern

### The Double-Slit Formula

**λ = ax/D** or rearranged: **x = λD/a**

| Symbol | Quantity | Unit |
|--------|----------|------|
| λ | Wavelength | m |
| a | Slit separation | m |
| x | Fringe spacing | m |
| D | Distance to screen | m |

### Pattern Description

- **Central bright fringe:** At centre (path difference = 0)
- **Alternating bright and dark fringes**
- **Bright fringes:** Constructive interference (path difference = nλ)
- **Dark fringes:** Destructive interference (path difference = (n+½)λ)
- **Equally spaced fringes** (for small angles)

### Derivation (For Small Angles)

For the nth bright fringe at position xₙ:
- Path difference = a sin θ ≈ a tan θ = ax/D
- For bright fringe: a sin θ = nλ
- Therefore: xₙ = nλD/a
- Fringe spacing: x = λD/a ✓

### Effect of Changing Variables

| Change | Effect on Fringe Spacing |
|--------|-------------------------|
| Increase wavelength λ | Fringes wider apart |
| Increase slit separation a | Fringes closer together |
| Increase screen distance D | Fringes wider apart |
| Use red instead of blue | Fringes wider (red has longer λ) |

### White Light Pattern

With white light:
- Central fringe is **white** (all colours overlap)
- Side fringes show **colours** (spectra)
- Blue closer to centre, red further out
- Pattern becomes less distinct away from centre

### Worked Example 1: Calculate Wavelength

In a double-slit experiment, slits are 0.5 mm apart, screen is 2.0 m away, and fringe spacing is 2.5 mm. Find the wavelength.

**Solution:**
λ = ax/D = (0.5 × 10⁻³ × 2.5 × 10⁻³)/(2.0)
λ = 1.25 × 10⁻⁶/2.0 = **6.25 × 10⁻⁷ m = 625 nm** (orange light)

### Worked Example 2: Calculate Fringe Spacing

Light of wavelength 500 nm passes through slits 0.3 mm apart. The screen is 1.5 m away. Find the fringe spacing.

**Solution:**
x = λD/a = (500 × 10⁻⁹ × 1.5)/(0.3 × 10⁻³)
x = 7.5 × 10⁻⁷/3 × 10⁻⁴ = **2.5 × 10⁻³ m = 2.5 mm**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Diffraction Gratings",
                content: `## Multiple-Slit Interference

### What is a Diffraction Grating?

A plate with many parallel slits (typically 300-1000 slits per mm), producing sharp, bright interference maxima.

### The Grating Equation

**d sin θ = nλ**

| Symbol | Quantity | Unit |
|--------|----------|------|
| d | Grating spacing (distance between slits) | m |
| θ | Angle of diffraction | degrees or radians |
| n | Order number (0, 1, 2, 3...) | - |
| λ | Wavelength | m |

### Calculating Grating Spacing

If grating has N lines per metre: **d = 1/N**
If N lines per millimetre: **d = 1/(1000N) metres** = **10⁻³/N metres**

**Example:** 500 lines/mm → d = 10⁻³/500 = 2.0 × 10⁻⁶ m = 2.0 μm

### Diffraction Orders

| Order | Position | Path Difference |
|-------|----------|-----------------|
| n = 0 | θ = 0° (straight through) | 0 |
| n = 1 | First order maximum | λ |
| n = 2 | Second order maximum | 2λ |
| n = 3 | Third order maximum | 3λ |

### Maximum Order Visible

Since sin θ ≤ 1:
**n_max = d/λ** (rounded DOWN to nearest integer)

Orders beyond n_max cannot be observed.

### Advantages Over Double Slit

| Double Slit | Diffraction Grating |
|-------------|---------------------|
| Broad, dim fringes | Sharp, bright maxima |
| Low resolution | High resolution |
| Overlapping orders | Clear separation |
| Less accurate λ measurement | Very accurate λ measurement |

### White Light Through Grating

- **n = 0:** White central maximum
- **n = 1, 2...:** Spectra (each colour at different angle)
- Red diffracts MORE than violet (larger θ for longer λ)
- Higher orders may overlap

### Worked Example 1: Find Wavelength

A grating with 600 lines/mm causes first order maximum at 22°. Find the wavelength.

**Solution:**
d = 10⁻³/600 = 1.67 × 10⁻⁶ m
d sin θ = nλ
λ = d sin θ/n = (1.67 × 10⁻⁶ × sin 22°)/1
λ = 1.67 × 10⁻⁶ × 0.374 = **6.25 × 10⁻⁷ m = 625 nm**

### Worked Example 2: Maximum Order

Light of wavelength 550 nm falls on a grating with 400 lines/mm. What is the maximum order visible?

**Solution:**
d = 10⁻³/400 = 2.5 × 10⁻⁶ m
n_max = d/λ = (2.5 × 10⁻⁶)/(550 × 10⁻⁹) = 4.54
Maximum order = **4** (rounded down)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Stationary (Standing) Waves",
                content: `## Waves That Don't Travel

### What is a Stationary Wave?

**Stationary wave:** Formed when two waves of the same frequency and amplitude travel in OPPOSITE directions and superpose.

Common formation: **Incident wave + Reflected wave**

### Key Features

| Feature | Description |
|---------|-------------|
| **Nodes (N)** | Points of ZERO displacement; always destructive interference |
| **Antinodes (A)** | Points of MAXIMUM displacement; always constructive interference |
| Node-to-node distance | λ/2 |
| Antinode-to-antinode distance | λ/2 |
| Node-to-antinode distance | λ/4 |

### Comparing Progressive and Stationary Waves

| Property | Progressive Wave | Stationary Wave |
|----------|-----------------|-----------------|
| Energy transfer | YES - energy travels | NO - energy trapped between nodes |
| Amplitude | Same everywhere | Varies: 0 at nodes, max at antinodes |
| Phase | Changes continuously along wave | Same between adjacent nodes, opposite sides of node are antiphase |
| Wavelength | Distance for one complete cycle | 2 × distance between adjacent nodes |

### Phase in Stationary Waves

- All points between two adjacent nodes oscillate **in phase**
- Points either side of a node oscillate in **antiphase** (180° out of phase)
- At different times, the wave envelope changes shape but nodes remain fixed

### Harmonics on a String (Both Ends Fixed)

Both ends must be **nodes** (fixed points).

| Harmonic | Nodes | Antinodes | Wavelength | Frequency |
|----------|-------|-----------|------------|-----------|
| 1st (Fundamental) | 2 | 1 | λ₁ = 2L | f₁ = v/2L |
| 2nd | 3 | 2 | λ₂ = L | f₂ = 2f₁ |
| 3rd | 4 | 3 | λ₃ = 2L/3 | f₃ = 3f₁ |
| nth | n+1 | n | λₙ = 2L/n | fₙ = nf₁ |

### General Formulas

**λₙ = 2L/n**
**fₙ = nv/(2L) = nf₁**

### Speed on a String

**v = √(T/μ)**

Where:
- T = tension in string (N)
- μ = mass per unit length (kg m⁻¹)

### Worked Example: String Harmonics

A guitar string of length 0.65 m has fundamental frequency 330 Hz.
(a) Find the wave speed
(b) Find the frequencies of the 2nd and 3rd harmonics

**Solution:**
(a) f₁ = v/(2L) → v = 2Lf₁ = 2 × 0.65 × 330 = **429 m s⁻¹**

(b) f₂ = 2f₁ = 2 × 330 = **660 Hz**
    f₃ = 3f₁ = 3 × 330 = **990 Hz**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Stationary Waves in Pipes",
                content: `## Sound Waves in Air Columns

### Key Principle

- **Open end:** Must be an ANTINODE (air free to oscillate)
- **Closed end:** Must be a NODE (air cannot oscillate)

### Open Pipe (Both Ends Open)

Antinodes at both ends.

| Harmonic | Pattern | Wavelength | Frequency |
|----------|---------|------------|-----------|
| 1st | A-N-A | λ₁ = 2L | f₁ = v/(2L) |
| 2nd | A-N-A-N-A | λ₂ = L | f₂ = 2f₁ |
| 3rd | A-N-A-N-A-N-A | λ₃ = 2L/3 | f₃ = 3f₁ |

**All harmonics possible:** f₁, 2f₁, 3f₁, 4f₁...

### Closed Pipe (One End Closed)

Node at closed end, antinode at open end.

| Harmonic | Pattern | Wavelength | Frequency |
|----------|---------|------------|-----------|
| 1st | N-A | λ₁ = 4L | f₁ = v/(4L) |
| 3rd | N-A-N-A | λ₃ = 4L/3 | f₃ = 3f₁ |
| 5th | N-A-N-A-N-A | λ₅ = 4L/5 | f₅ = 5f₁ |

**Only ODD harmonics possible:** f₁, 3f₁, 5f₁, 7f₁...

### End Correction

Real pipes have an **end correction** because the antinode forms slightly beyond the open end:
- Effective length = L + e (where e ≈ 0.3 × diameter)

### Comparing Open and Closed Pipes

| Property | Open Pipe | Closed Pipe |
|----------|-----------|-------------|
| Fundamental | f₁ = v/(2L) | f₁ = v/(4L) |
| Harmonics | All (1st, 2nd, 3rd...) | Odd only (1st, 3rd, 5th...) |
| Sound quality | Richer (more harmonics) | Different timbre |

### Worked Example 1: Open Pipe

An open pipe has length 0.5 m. Speed of sound = 340 m s⁻¹.
Find the fundamental and first two overtones.

**Solution:**
f₁ = v/(2L) = 340/(2 × 0.5) = **340 Hz**
f₂ = 2f₁ = **680 Hz**
f₃ = 3f₁ = **1020 Hz**

### Worked Example 2: Closed Pipe

A closed pipe produces fundamental frequency 256 Hz. Speed of sound = 340 m s⁻¹.
Find the pipe length and next two resonant frequencies.

**Solution:**
f₁ = v/(4L) → L = v/(4f₁) = 340/(4 × 256) = **0.332 m**

Next resonances (odd harmonics only):
f₃ = 3f₁ = 3 × 256 = **768 Hz**
f₅ = 5f₁ = 5 × 256 = **1280 Hz**`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Superposition: resultant displacement = vector sum of individual displacements",
            "Constructive interference: in phase (φ = 0, 2π...), path difference = nλ",
            "Destructive interference: antiphase (φ = π, 3π...), path difference = (n+½)λ",
            "Coherence (constant phase relationship) needed for stable interference pattern",
            "Young's double slit: λ = ax/D or x = λD/a",
            "Diffraction grating: d sin θ = nλ; maximum order n_max = d/λ",
            "Grating spacing: d = 1/N (N = lines per metre)",
            "Stationary wave: nodes (zero displacement) and antinodes (maximum displacement)",
            "Distance between adjacent nodes = λ/2",
            "String (both ends fixed): all harmonics possible, fₙ = nf₁ = nv/(2L)",
            "Open pipe: all harmonics, f₁ = v/(2L)",
            "Closed pipe: ODD harmonics only, f₁ = v/(4L)"
        ],
        exam_tips: [
            "Path difference for bright fringe = whole number of wavelengths (nλ)",
            "For gratings, calculate d FIRST: d = 1/N (convert to metres)",
            "Maximum order: n_max = d/λ, round DOWN to integer",
            "All points between stationary wave nodes oscillate IN PHASE",
            "Points either side of a node are in ANTIPHASE (180° out of phase)",
            "Draw diagrams showing nodes (N) and antinodes (A) for pipe questions",
            "Closed pipes: ONLY odd harmonics (1st, 3rd, 5th...) - remember this!",
            "For string: v = √(T/μ) relates tension, mass per unit length, and wave speed",
            "Red light diffracts MORE than blue (longer wavelength, larger angle)",
            "Central maximum with white light is WHITE (all colours overlap at θ = 0)"
        ]
    },
    "Electricity": {
        topic: "Electricity",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/A%20level/A-Level_Electricity_Definitions_and_Equations.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL0EgbGV2ZWwvQS1MZXZlbF9FbGVjdHJpY2l0eV9EZWZpbml0aW9uc19hbmRfRXF1YXRpb25zLm00YSIsImlhdCI6MTc2ODA3NDk2OSwiZXhwIjo1MjY4NTcwOTY5fQ.Zcym-KaYgwlUmCGWBnX-o_DWNMleEQp7gR2RtTeYSTk",
        subject: "A Level Physics",
        summary: "Electricity covers the fundamentals of electric current, potential difference, resistance, and electrical power. This topic includes charge flow, the drift velocity equation, Ohm's law, I-V characteristics for different components, resistivity as a material property, and power/energy calculations. Understanding these concepts is essential for circuit analysis.",
        sections: [
            {
                title: "1. Current and Charge - The Flow of Charge",
                content: `## Understanding Electric Current

### Definition of Current

**Current (I):** The rate of flow of charge past a point in a circuit.

**I = Q/t** or **I = ΔQ/Δt**

| Symbol | Quantity | Unit |
|--------|----------|------|
| I | Current | A (ampere) |
| Q | Charge | C (coulomb) |
| t | Time | s |

**1 ampere = 1 coulomb per second = 1 C s⁻¹**

### Electric Charge

**Elementary charge:** e = 1.60 × 10⁻¹⁹ C

This is the fundamental unit of charge - all charges are multiples of e.

| Particle | Charge |
|----------|--------|
| Electron | -e = -1.60 × 10⁻¹⁹ C |
| Proton | +e = +1.60 × 10⁻¹⁹ C |
| Neutron | 0 |

### Charge Quantisation

**Q = ne**

Where n = number of charge carriers (usually electrons)

Charge is **quantised** - it only exists in discrete amounts (integer multiples of e).

### Conventional Current vs Electron Flow

| Conventional Current | Electron Flow |
|---------------------|---------------|
| From + to - terminal | From - to + terminal |
| Direction of positive charge flow | Actual direction electrons move |
| Used in circuit diagrams | Physical reality in metals |

This historical convention predates the discovery of the electron!

### Current in Conductors - The Drift Velocity Equation

**I = nAvq**

| Symbol | Quantity | Unit |
|--------|----------|------|
| I | Current | A |
| n | Number density of charge carriers | m⁻³ |
| A | Cross-sectional area | m² |
| v | Drift velocity | m s⁻¹ |
| q | Charge on each carrier | C |

### Number Density (n)

The number of free charge carriers per unit volume.

| Material | Approximate n (m⁻³) |
|----------|-------------------|
| Copper | 8.5 × 10²⁸ |
| Aluminium | 6.0 × 10²⁸ |
| Semiconductor | ~10¹⁶ - 10²³ |
| Insulator | ~10⁷ |

### Drift Velocity

**Drift velocity is VERY slow!** Typically ~mm/s for normal currents.

But the electric field propagates at near light speed, which is why the circuit responds instantly.

### Worked Example 1: Charge Flow

A current of 2.5 A flows for 30 seconds. How much charge flows and how many electrons is this?

**Solution:**
Q = It = 2.5 × 30 = **75 C**
n = Q/e = 75/(1.60 × 10⁻¹⁹) = **4.69 × 10²⁰ electrons**

### Worked Example 2: Drift Velocity

A copper wire has cross-sectional area 2.0 mm² and carries current 3.0 A. Given n = 8.5 × 10²⁸ m⁻³, find the drift velocity.

**Solution:**
A = 2.0 × 10⁻⁶ m²
v = I/(nAq) = 3.0/(8.5 × 10²⁸ × 2.0 × 10⁻⁶ × 1.60 × 10⁻¹⁹)
v = 3.0/(2.72 × 10⁴) = **1.1 × 10⁻⁴ m s⁻¹ = 0.11 mm s⁻¹**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Potential Difference and EMF",
                content: `## Energy and Charge

### Potential Difference (p.d.)

**Definition:** The energy transferred per unit charge passing between two points.

**V = W/Q** or **V = E/Q**

| Symbol | Quantity | Unit |
|--------|----------|------|
| V | Potential difference | V (volt) |
| W | Work done / Energy transferred | J |
| Q | Charge | C |

**1 volt = 1 joule per coulomb = 1 J C⁻¹**

p.d. is the energy USED by a component per coulomb of charge.

### Electromotive Force (EMF)

**EMF (ε):** The energy transferred per unit charge BY A SOURCE (cell, battery, generator).

**ε = W/Q** (energy supplied TO the circuit)

### EMF vs Potential Difference

| EMF (ε) | Potential Difference (V) |
|---------|-------------------------|
| Energy SUPPLIED | Energy USED |
| In power sources | Across components |
| Drives current around circuit | Opposes current flow |
| Chemical → electrical energy | Electrical → other energy |

### The Electronvolt (eV)

**Definition:** The energy gained by an electron accelerated through a p.d. of 1 volt.

**1 eV = 1.60 × 10⁻¹⁹ J**

Derivation: W = QV = e × 1 = 1.60 × 10⁻¹⁹ J ✓

Very useful for atomic/particle physics where joules are inconveniently large.

### Common Energy Conversions

| eV | J |
|----|---|
| 1 eV | 1.60 × 10⁻¹⁹ J |
| 1 keV | 1.60 × 10⁻¹⁶ J |
| 1 MeV | 1.60 × 10⁻¹³ J |
| 1 GeV | 1.60 × 10⁻¹⁰ J |

### Worked Example: Energy Calculation

An electron is accelerated through a p.d. of 500 V. Calculate the energy gained in (a) eV and (b) J.

**Solution:**
(a) Energy = 500 eV (directly from definition)
(b) Energy = 500 × 1.60 × 10⁻¹⁹ = **8.0 × 10⁻¹⁷ J**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Resistance and Ohm's Law",
                content: `## Opposition to Current Flow

### Definition of Resistance

**Resistance (R):** The ratio of p.d. across a component to the current through it.

**R = V/I**

| Symbol | Quantity | Unit |
|--------|----------|------|
| R | Resistance | Ω (ohm) |
| V | Potential difference | V |
| I | Current | A |

**1 ohm = 1 volt per ampere = 1 V A⁻¹**

### Ohm's Law

**"For a metallic conductor at constant temperature, the current is directly proportional to the potential difference."**

**V = IR** (for ohmic conductors)

**Key point:** This is ONLY true for OHMIC conductors (e.g., metal wires at constant temperature).

### Ohmic vs Non-Ohmic Conductors

| Ohmic | Non-Ohmic |
|-------|-----------|
| V ∝ I | V not proportional to I |
| Constant R | R varies with I or V |
| Linear I-V graph through origin | Curved or non-linear I-V graph |
| Example: metal wire at constant T | Examples: filament lamp, diode, thermistor |

### Factors Affecting Resistance

For a uniform conductor (wire):

**R = ρL/A**

| Symbol | Quantity | Unit |
|--------|----------|------|
| R | Resistance | Ω |
| ρ | Resistivity | Ω m |
| L | Length | m |
| A | Cross-sectional area | m² |

**Key Relationships:**
- R ∝ L (double length → double R)
- R ∝ 1/A (double area → halve R)
- ρ is a material property

### Why Does Resistance Occur?

In a metal:
- Free electrons collide with positive ion lattice
- Energy transferred to ions (heating)
- Higher temperature → more vibration → more collisions → higher R

### Worked Example: Wire Resistance

A copper wire (ρ = 1.7 × 10⁻⁸ Ω m) has length 2.0 m and diameter 0.5 mm. Calculate its resistance.

**Solution:**
A = πr² = π × (0.25 × 10⁻³)² = 1.96 × 10⁻⁷ m²
R = ρL/A = (1.7 × 10⁻⁸ × 2.0)/(1.96 × 10⁻⁷)
R = 3.4 × 10⁻⁸/1.96 × 10⁻⁷ = **0.17 Ω**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. I-V Characteristics",
                content: `## Current-Voltage Graphs

Understanding I-V characteristics is crucial for identifying component behaviour.

### Ohmic Conductor (Metal Wire at Constant Temperature)

**Graph features:**
- Straight line through origin
- Constant gradient = 1/R
- Symmetrical for ±V

**Why straight?** R remains constant because temperature is constant.

### Filament Lamp

**Graph features:**
- Curved line through origin
- Gradient DECREASES as V increases
- Symmetrical for ±V

**Explanation:**
- Higher current → more power dissipation → hotter filament
- Hotter → more lattice vibration → higher resistance
- R increases with I (and temperature)

### Semiconductor Diode

**Graph features:**
- Asymmetric
- Forward bias (positive V): current flows above threshold (~0.6 V for silicon)
- Reverse bias (negative V): negligible current (until breakdown)

**Key values:**
- Silicon diode threshold: ~0.6-0.7 V
- Germanium diode threshold: ~0.2-0.3 V

### Thermistor (NTC - Negative Temperature Coefficient)

**Behaviour:**
- Resistance DECREASES as temperature increases
- Self-heating causes curved I-V

**Why?** More thermal energy → more electrons freed from atoms → more charge carriers → lower R

### LDR (Light Dependent Resistor)

**Behaviour:**
- Resistance DECREASES as light intensity increases
- Not visible on I-V graph (depends on light, not voltage)

**Why?** Photons free electrons from atoms → more charge carriers → lower R

### Measuring I-V Characteristics

**Circuit setup:**
1. Component under test
2. Ammeter in SERIES (measures current through component)
3. Voltmeter in PARALLEL (measures p.d. across component)
4. Variable power supply (or rheostat) to vary V
5. Reversing switch for negative values

### Comparison Table

| Component | I-V Shape | R Behaviour |
|-----------|-----------|-------------|
| Metal wire | Linear | Constant |
| Filament lamp | Curved | Increases with I |
| Diode | Threshold + exponential | Very high in reverse |
| NTC thermistor | Curved | Decreases with T |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Resistivity - A Material Property",
                content: `## Understanding Resistivity

### Definition

**Resistivity (ρ):** A material property that quantifies how strongly a material opposes current flow.

**ρ = RA/L**

| Symbol | Quantity | Unit |
|--------|----------|------|
| ρ | Resistivity | Ω m |
| R | Resistance | Ω |
| A | Cross-sectional area | m² |
| L | Length | m |

### Resistivity vs Resistance

| Resistivity | Resistance |
|-------------|------------|
| Material property | Component property |
| Independent of dimensions | Depends on dimensions |
| Same for all samples of material | Different for different samples |
| Unit: Ω m | Unit: Ω |

### Typical Resistivity Values

| Material | Resistivity (Ω m) | Type |
|----------|------------------|------|
| Silver | 1.6 × 10⁻⁸ | Conductor |
| Copper | 1.7 × 10⁻⁸ | Conductor |
| Aluminium | 2.8 × 10⁻⁸ | Conductor |
| Tungsten | 5.5 × 10⁻⁸ | Conductor |
| Constantan | 5.0 × 10⁻⁷ | Alloy |
| Carbon | 3.5 × 10⁻⁵ | Semi-metal |
| Silicon | 0.1 - 60 | Semiconductor |
| Glass | 10¹⁰ - 10¹⁴ | Insulator |
| Air | ~10¹⁶ | Insulator |

### Conductivity

**Conductivity (σ) = 1/ρ**

Unit: S m⁻¹ (siemens per metre) or Ω⁻¹ m⁻¹

Higher conductivity = better conductor = lower resistivity

### Temperature Effects on Resistivity

**Metals:**
- Resistivity INCREASES with temperature
- More lattice vibration → more electron collisions
- Positive temperature coefficient

**Semiconductors:**
- Resistivity DECREASES with temperature
- More charge carriers freed at higher T
- Negative temperature coefficient

**Superconductors:**
- Resistivity = 0 below critical temperature
- No energy loss to resistance!

### Worked Example: Finding Resistivity

A wire of length 1.5 m and diameter 0.8 mm has resistance 0.15 Ω. Calculate the resistivity.

**Solution:**
A = πr² = π × (0.4 × 10⁻³)² = 5.03 × 10⁻⁷ m²
ρ = RA/L = (0.15 × 5.03 × 10⁻⁷)/1.5
ρ = 7.54 × 10⁻⁸/1.5 = **5.0 × 10⁻⁸ Ω m** (tungsten)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Electrical Power and Energy",
                content: `## Energy Transfer in Circuits

### Electrical Power

**Power (P):** Rate of energy transfer.

**P = IV**

| Symbol | Quantity | Unit |
|--------|----------|------|
| P | Power | W (watt) |
| I | Current | A |
| V | Potential difference | V |

### Alternative Power Formulas

Using V = IR, we can derive:

**P = IV = I(IR) = I²R**
**P = IV = (V/R)V = V²/R**

| Formula | Use When |
|---------|----------|
| P = IV | I and V both known |
| P = I²R | Current and resistance known |
| P = V²/R | Voltage and resistance known |

### Electrical Energy

**E = Pt = IVt**

| Symbol | Quantity | Unit |
|--------|----------|------|
| E | Energy | J |
| P | Power | W |
| t | Time | s |

Alternative forms:
**E = I²Rt** or **E = V²t/R**

### The kilowatt-hour (kWh)

**1 kWh = 1000 W × 3600 s = 3.6 × 10⁶ J = 3.6 MJ**

This is the unit used for domestic electricity billing.

**Cost = Energy (kWh) × Price per kWh**

### Power Dissipation in Resistors

ALL resistors convert electrical energy to thermal energy (heat).

**Useful applications:**
- Heaters, kettles, toasters
- Incandescent light bulbs
- Fuses (deliberate overload protection)

**Wasteful energy loss:**
- Power transmission lines
- Electronic circuits

### Worked Example 1: Kettle Power

A kettle operates at 230 V and draws 10 A current.
(a) Calculate the power
(b) Calculate energy used in 3 minutes
(c) Calculate the cost if electricity is 15p per kWh

**Solution:**
(a) P = IV = 10 × 230 = **2300 W = 2.3 kW**
(b) E = Pt = 2300 × 180 = **414,000 J = 414 kJ**
    Or: E = 2.3 kW × (3/60) h = **0.115 kWh**
(c) Cost = 0.115 × 15 = **1.73 p**

### Worked Example 2: Resistance from Power

A 60 W light bulb operates at 230 V. Find its resistance.

**Solution:**
P = V²/R → R = V²/P = 230²/60 = 52900/60 = **882 Ω**`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Current I = Q/t; 1 A = 1 C s⁻¹; charge is quantised (e = 1.60 × 10⁻¹⁹ C)",
            "Drift velocity equation: I = nAvq; drift velocity is very slow (~mm/s)",
            "p.d. V = W/Q; 1 volt = 1 joule per coulomb",
            "EMF = energy supplied per coulomb; p.d. = energy used per coulomb",
            "1 eV = 1.60 × 10⁻¹⁹ J (energy when electron accelerated through 1 V)",
            "Resistance R = V/I; Ohm's law V = IR (ohmic conductors at constant T)",
            "Resistance formula: R = ρL/A; R ∝ L; R ∝ 1/A",
            "Resistivity ρ is a material property; unit: Ω m",
            "I-V: filament lamp curves (R increases), diode has threshold, thermistor decreases R with T",
            "Power: P = IV = I²R = V²/R; Energy: E = Pt = IVt",
            "1 kWh = 3.6 × 10⁶ J"
        ],
        exam_tips: [
            "Conventional current: + to -; electron flow: - to +",
            "For I-V graphs, gradient = 1/R (steeper = lower R)",
            "Resistivity is per MATERIAL; resistance is per COMPONENT",
            "Use appropriate power formula based on known quantities",
            "Convert time to seconds and power to watts before calculating energy",
            "Drift velocity is VERY slow - don't confuse with signal speed",
            "Thermistor (NTC): R decreases with T; LDR: R decreases with light",
            "Calculate area carefully: A = πr² = πd²/4",
            "Check units: ρ should be in Ω m, not Ω cm",
            "For diodes: negligible current below threshold (~0.6 V for silicon)"
        ]
    },
    "D.C. Circuits": {
        topic: "D.C. Circuits",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/A%20level/Mastering_DC_Circuits.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvQSBsZXZlbC9NYXN0ZXJpbmdfRENfQ2lyY3VpdHMubXA0IiwiaWF0IjoxNzY4MTA2NzU0LCJleHAiOjIxMTUwMDI3NTR9.f8huiGqFYAyd-mnzqs942plYgxbrwFreUmmGB8cXZa0",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/A%20level/DC_Circuits_Charge_Laws_and_Errors.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL0EgbGV2ZWwvRENfQ2lyY3VpdHNfQ2hhcmdlX0xhd3NfYW5kX0Vycm9ycy5tNGEiLCJpYXQiOjE3NjgwNzUxMTYsImV4cCI6NTI2ODU3MTExNn0.LCwtxMaqm7CAEHlI5A8RLemg18zE1TxWE74q8GNd5LE",
        subject: "A Level Physics",
        summary: "D.C. circuits covers the analysis of series and parallel circuits, Kirchhoff's laws (based on conservation of charge and energy), potential dividers and their applications, and the concepts of EMF and internal resistance. These principles are fundamental for understanding and designing electrical systems.",
        sections: [
            {
                title: "1. Series and Parallel Circuits",
                content: `## Combining Resistors

### Series Circuits

Components connected **end-to-end** with ONE path for current.

| Property | Series Rule |
|----------|-------------|
| Current | Same through all: I = I₁ = I₂ = I₃ |
| Voltage | Sum of individual: V = V₁ + V₂ + V₃ |
| Resistance | Sum: R_total = R₁ + R₂ + R₃ + ... |

**Total resistance is GREATER than any individual resistance.**

### Parallel Circuits

Components connected **across each other** with MULTIPLE paths for current.

| Property | Parallel Rule |
|----------|---------------|
| Current | Sum of branches: I = I₁ + I₂ + I₃ |
| Voltage | Same across all: V = V₁ = V₂ = V₃ |
| Resistance | 1/R_total = 1/R₁ + 1/R₂ + 1/R₃ + ... |

**Total resistance is LESS than the smallest individual resistance.**

### Two Resistors in Parallel - Product Over Sum

**R_total = (R₁ × R₂)/(R₁ + R₂)**

This is often the quickest formula for two parallel resistors.

### Special Cases

**n identical resistors (each R):**
- In series: R_total = nR
- In parallel: R_total = R/n

### Current Division in Parallel

For two resistors in parallel:
- I₁ = I × R₂/(R₁ + R₂)
- I₂ = I × R₁/(R₁ + R₂)

**Current takes the path of least resistance!**

### Worked Example 1: Series Combination

Three resistors of 4Ω, 6Ω, and 10Ω are connected in series to a 12V supply.
(a) Find total resistance
(b) Find current

**Solution:**
(a) R_total = 4 + 6 + 10 = **20 Ω**
(b) I = V/R = 12/20 = **0.6 A**

### Worked Example 2: Parallel Combination

Two resistors of 6Ω and 3Ω are connected in parallel to a 12V supply.
(a) Find total resistance
(b) Find total current
(c) Find current through each resistor

**Solution:**
(a) R = (6 × 3)/(6 + 3) = 18/9 = **2 Ω**
(b) I = V/R = 12/2 = **6 A**
(c) I₆Ω = 12/6 = **2 A**; I₃Ω = 12/3 = **4 A** (Check: 2 + 4 = 6 ✓)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Kirchhoff's Laws - Conservation Principles",
                content: `## Fundamental Circuit Laws

### Kirchhoff's First Law (KCL) - Current Law

**"The sum of currents entering a junction equals the sum of currents leaving."**

**ΣI_in = ΣI_out**

| Basis | Conservation of CHARGE |
|-------|----------------------|
| At any junction | Charge cannot accumulate |
| Mathematical form | I₁ + I₂ = I₃ + I₄ |

### Kirchhoff's Second Law (KVL) - Voltage Law

**"The sum of EMFs around a closed loop equals the sum of p.d.s around that loop."**

**Σε = ΣIR** or **ΣV = 0** (around any closed loop)

| Basis | Conservation of ENERGY |
|-------|----------------------|
| Around any closed path | Energy gained = Energy lost |
| Mathematical form | ε₁ + ε₂ = V₁ + V₂ + V₃ |

### Sign Conventions for KVL

**For EMFs:**
- POSITIVE if traversing from - to + (energy gained)
- NEGATIVE if traversing from + to - (against the EMF)

**For p.d.s (IR drops):**
- POSITIVE if traversing AGAINST assumed current direction
- NEGATIVE if traversing WITH assumed current direction

### Systematic Problem-Solving

1. **Label all currents** (assume directions - if wrong, answer will be negative)
2. **Apply KCL** at each junction
3. **Apply KVL** around enough loops
4. **Solve simultaneous equations**
5. Check your answer makes physical sense

### Worked Example: Two-Loop Circuit

A circuit has: ε₁ = 6V, R₁ = 2Ω in series, and ε₂ = 4V, R₂ = 3Ω in parallel branch. Find currents.

**Solution:**
Using KVL around outer loop:
6 - 2I₁ - 3I₂ + 4 = 0
10 = 2I₁ + 3I₂ ... (equation 1)

Using KCL at junction:
I₁ = I₂ + I₃ ... (equation 2)

(Continue with more equations if needed to solve for all unknowns)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Potential Dividers - Voltage Control",
                content: `## Dividing Voltage

### The Potential Divider Circuit

Two or more resistors in series with a voltage source divide the voltage proportionally.

### The Potential Divider Formula

For two resistors R₁ and R₂ in series with V_in:

**V_out = V_in × R₂/(R₁ + R₂)**

Where V_out is the p.d. across R₂.

### Understanding the Formula

The voltage divides in the ratio of the resistances:
- V₁/V₂ = R₁/R₂
- Each resistor gets voltage proportional to its resistance

### Sensor Applications

**1. Thermistor in Potential Divider (Temperature Sensor):**

| Temperature | Thermistor R | V_out |
|-------------|-------------|-------|
| Increases | Decreases | Changes |
| Decreases | Increases | Changes |

Configuration determines whether V_out increases or decreases with temperature.

**2. LDR in Potential Divider (Light Sensor):**

| Light Level | LDR R | V_out |
|-------------|-------|-------|
| Brighter | Decreases | Changes |
| Darker | Increases | Changes |

### The Potentiometer

A variable resistor with three terminals that can provide any voltage from 0 to V_in.

- Wiper position determines the division ratio
- Used for volume controls, dimmer switches, etc.

### Loading Effect - IMPORTANT!

When a load is connected across V_out:
- The effective resistance of R₂ section changes
- V_out becomes LESS than calculated
- For minimal loading effect: R_load >> R₂

**Loaded potential divider formula:**
R₂_effective = (R₂ × R_load)/(R₂ + R_load)

### Worked Example 1: Basic Potential Divider

A 12V supply is connected to a 4kΩ and 8kΩ resistor in series. Find V_out across the 8kΩ resistor.

**Solution:**
V_out = 12 × 8000/(4000 + 8000) = 12 × 8/12 = **8 V**

### Worked Example 2: Sensor Circuit

A thermistor (R varies 500Ω to 5kΩ) is in series with a 2kΩ fixed resistor and 6V supply. V_out is measured across the 2kΩ.

At high temperature (R_therm = 500Ω):
V_out = 6 × 2000/(500 + 2000) = 6 × 2/2.5 = **4.8 V**

At low temperature (R_therm = 5000Ω):
V_out = 6 × 2000/(5000 + 2000) = 6 × 2/7 = **1.7 V**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. EMF and Internal Resistance",
                content: `## Real Power Sources

### Why Internal Resistance Matters

Real cells and batteries are NOT ideal voltage sources. They have **internal resistance (r)** that causes:
- Energy loss within the cell itself
- Terminal p.d. to be LESS than EMF when current flows
- Power "wasted" inside the cell

### The Terminal p.d. Equation

When current I flows from a cell with EMF ε and internal resistance r:

**V = ε - Ir**

Or rearranged: **ε = V + Ir** (EMF = terminal p.d. + lost volts)

| Symbol | Meaning | Unit |
|--------|---------|------|
| ε | EMF | V |
| V | Terminal p.d. | V |
| I | Current | A |
| r | Internal resistance | Ω |

### Lost Volts

**Lost volts = Ir**

This is the p.d. "dropped" across the internal resistance.
- Represents energy dissipated as heat inside the cell
- NOT available to external circuit

### When V = ε (Terminal p.d. = EMF)

This only occurs when **I = 0** (no current flowing):
- Open circuit condition
- High resistance voltmeter connected

### Maximum Current

When terminals are short-circuited (V = 0):
**I_max = ε/r**

(DANGEROUS - causes rapid heating!)

### Maximum Power Transfer

Maximum power is delivered to an external load when:
**R = r** (external resistance = internal resistance)

At this point: **P_max = ε²/(4r)**

Only 50% efficient at maximum power transfer!

### Measuring EMF and Internal Resistance

**Method 1: V-I Graph**
1. Connect cell to variable resistor
2. Measure V and I for several resistance values
3. Plot V against I
4. **y-intercept = ε** (when I = 0)
5. **Gradient = -r**

**Method 2: Two Measurements**
1. Measure V₁ and I₁ with one resistor
2. Measure V₂ and I₂ with different resistor
3. Use ε = V + Ir for both to form simultaneous equations
4. Solve for ε and r

### Worked Example 1: Basic Calculation

A cell with EMF 1.5V and internal resistance 0.5Ω is connected to a 2.5Ω resistor.

**Solution:**
Total resistance = R + r = 2.5 + 0.5 = 3.0 Ω
Current I = ε / R_total = 1.5 / 3.0 = **0.5 A**
Lost volts = Ir = 0.5 × 0.5 = 0.25 V
Terminal p.d. = ε - Ir = 1.5 - 0.25 = **1.25 V**

### Worked Example 2: Finding ε and r

A cell gives terminal p.d. 1.4V when drawing 0.2A, and 1.2V when drawing 0.4A.

**Solution:**
Using ε = V + Ir:
ε = 1.4 + 0.2r ... (1)
ε = 1.2 + 0.4r ... (2)

Subtracting: 0 = 0.2 - 0.2r → r = 1 Ω
Substituting: ε = 1.4 + 0.2(1) = **1.6 V**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Power in Circuits",
                content: `## Power Distribution

### Power Delivered by Source

**P_source = εI** (total power from EMF)

### Power Dissipated in External Circuit

**P_external = VI = I²R**

Where V is terminal p.d. and R is external resistance.

### Power Lost to Internal Resistance

**P_lost = I²r**

### Conservation of Power

**P_source = P_external + P_lost**
**εI = VI + I²r** ✓

### Efficiency of Power Transfer

**Efficiency = P_external / P_source × 100%**
**Efficiency = V/ε × 100%**
**Efficiency = R/(R + r) × 100%**

### How Efficiency Varies with Load

| Load R | Current I | Efficiency | Power to load |
|--------|-----------|------------|---------------|
| R → 0 | High (I_max) | 0% | 0 |
| R = r | Medium | 50% | Maximum (P_max) |
| R → ∞ | Low (→0) | 100% | 0 |

### Worked Example: Power Distribution

A cell (ε = 6V, r = 2Ω) is connected to R = 4Ω.

**Solution:**
I = ε/(R + r) = 6/(4 + 2) = 1 A

Power from source = εI = 6 × 1 = **6 W**
Power to load = I²R = 1² × 4 = **4 W**
Power lost = I²r = 1² × 2 = **2 W**
(Check: 4 + 2 = 6 ✓)

Efficiency = R/(R + r) = 4/6 = **67%**`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Series: same current, voltages add, R_total = R₁ + R₂ + ...",
            "Parallel: same voltage, currents add, 1/R_total = 1/R₁ + 1/R₂ + ...",
            "Two in parallel: R = (R₁ × R₂)/(R₁ + R₂) (product over sum)",
            "KCL: ΣI_in = ΣI_out at junction (charge conservation)",
            "KVL: Σε = ΣIR around closed loop (energy conservation)",
            "Potential divider: V_out = V_in × R₂/(R₁ + R₂)",
            "Terminal p.d.: V = ε - Ir; Lost volts = Ir",
            "From V-I graph: y-intercept = ε, gradient = -r",
            "Maximum power transfer when R = r; then P_max = ε²/(4r)",
            "Efficiency = V/ε = R/(R + r) × 100%"
        ],
        exam_tips: [
            "Parallel resistance answer MUST be less than smallest individual R",
            "For KVL, be CONSISTENT with sign conventions - stick to one direction",
            "Potential divider: V_out is across the LOWER resistor in the standard formula",
            "Watch for loading effects reducing V_out below calculated value",
            "When measuring ε and r, plot V against I (not I against V)",
            "Maximum power transfer occurs when R = r, but efficiency is only 50%",
            "For high efficiency, use R >> r (but power transferred is low)",
            "Lost volts = Ir represents energy wasted as HEAT inside the cell",
            "When I = 0, terminal p.d. = EMF (use high-resistance voltmeter)"
        ]
    },
    "Particle Physics": {
        topic: "Particle Physics",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/A%20level/Particle_Physics__An_A-Level_Explainer.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvQSBsZXZlbC9QYXJ0aWNsZV9QaHlzaWNzX19Bbl9BLUxldmVsX0V4cGxhaW5lci5tcDQiLCJpYXQiOjE3NjgxMDY4MzksImV4cCI6NTI2ODYwMjgzOX0.PChx48C2fweYEg4Glk1ch8LnUj8i8nm0pceXjzc6ubM",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/A%20level/Quarks_Leptons_and_Conservation_Laws.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL0EgbGV2ZWwvUXVhcmtzX0xlcHRvbnNfYW5kX0NvbnNlcnZhdGlvbl9MYXdzLm00YSIsImlhdCI6MTc2ODA3NTM4MCwiZXhwIjo1MjY4NTcxMzgwfQ.pIGdQQEMNAkJbKhAqD6vTjlb4fbFi5Jwk_K7RnWjsVo",
        subject: "A Level Physics",
        summary: "Particle Physics explores the fundamental building blocks of matter and the forces between them. This topic covers atomic structure, quarks, leptons, hadrons (baryons and mesons), conservation laws (charge, baryon number, lepton number, strangeness), and fundamental interactions.",
        sections: [
            {
                title: "1. Atomic Structure and Constituents",
                content: `## Inside the Atom

### Subatomic Particles

| Particle | Symbol | Absolute Charge (C) | Relative Charge | Mass (kg) | Relative Mass | Specific Charge (C kg⁻¹) |
|----------|--------|---------------------|-----------------|-----------|---------------|--------------------------|
| Proton | p | +1.60 × 10⁻¹⁹ | +1 | 1.673 × 10⁻²⁷ | 1 | 9.58 × 10⁷ |
| Neutron | n | 0 | 0 | 1.675 × 10⁻²⁷ | 1 | 0 |
| Electron | e⁻ | -1.60 × 10⁻¹⁹ | -1 | 9.11 × 10⁻³¹ | 1/1840 | 1.76 × 10¹¹ |

**Specific Charge:** The ratio of charge to mass of a particle.
**Specific Charge = Q/m**

### Nucleon Number and Proton Number

**ᴬ_Z X**

- **Proton number (Z):** Number of protons in nucleus (defines the element).
- **Nucleon number (A):** Total number of protons and neutrons (mass number).
- **Isotopes:** Atoms with the same Z but different A (same p, different n).

### The Strong Nuclear Force

The force that holds the nucleus together against electrostatic repulsion.

**Range and Characteristics:**
- **Short range:** Effective only up to ~3 fm (3 × 10⁻¹⁵ m).
- **Attractive:** Between ~0.5 fm and ~3 fm.
- **Repulsive:** Below ~0.5 fm (prevents nucleus collapsing).
- **Negligible:** Beyond ~3 fm.

### Alpha Decay

Nucleus emits an alpha particle (Helium nucleus, ⁴₂He).
Occurs in very large nuclei (e.g., Uranium).

Equation: **ᴬ_Z X → ᴬ⁻⁴_{Z-2} Y + ⁴₂α**

### Beta-Minus (β⁻) Decay

Neutron turns into a proton, electron, and electron antineutrino.
Occurs in neutron-rich nuclei.
mediated by Weak interaction.

Equation: **n → p + e⁻ + ν̄ₑ**

### Beta-Plus (β⁺) Decay

Proton turns into a neutron, positron, and electron neutrino.
Occurs in proton-rich nuclei.

Equation: **p → n + e⁺ + νₑ**

### Worked Example: Specific Charge

Calculate the specific charge of a Carbon-12 nucleus (¹²₆C).

**Solution:**
Charge Q = 6 × 1.60 × 10⁻¹⁹ = 9.6 × 10⁻¹⁹ C
Mass m = 12 × 1.67 × 10⁻²⁷ kg (approx nucleon mass)
Specific Charge = Q/m = (9.6 × 10⁻¹⁹) / (2.0 × 10⁻²⁶) = **4.8 × 10⁷ C kg⁻¹**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Particles and Antiparticles",
                content: `## Matter and Antimatter

### Antimatter Properties

Every particle has a corresponding antiparticle with:
- **Same mass**
- **Same rest energy**
- **Opposite charge**
- **Opposite quantum numbers** (Baryon number, Lepton number, Strangeness)

| Particle | Antiparticle | Symbol | Charge |
|----------|--------------|--------|--------|
| Electron | Positron | e⁺ | +1 |
| Proton | Antiproton | p̄ | -1 |
| Neutron | Antineutron | n̄ | 0 |
| Neutrino | Antineutrino | ν̄ | 0 |

### Photons

Light energy comes in packets called photons.
**Energy of a photon: E = hf = hc/λ**

Where:
- h = Planck's constant (6.63 × 10⁻³⁴ J s)
- f = frequency (Hz)
- c = speed of light
- λ = wavelength

### Annihilation

When a particle meets its antiparticle, they annihilate, converting ALL mass into energy (two photons).

**Particle + Antiparticle → 2 Photons**

**2mc² = 2hf_min** (for particles at rest)
**hf_min = mc²** (minimum energy of EACH photon)

### Pair Production

A single high-energy photon converts into a particle-antiparticle pair.
(Usually happens near a nucleus to conserve momentum).

**Photon → Particle + Antiparticle**

**hf_min = 2mc²**

### The Electronvolt (eV)

**1 eV = 1.60 × 10⁻¹⁹ J**
1 MeV = 1.60 × 10⁻¹³ J
1 GeV = 1.60 × 10⁻¹⁰ J

### Worked Example: Annihilation

Calculate the minimum frequency of photons produced when an electron and positron annihilate.

**Solution:**
Mass of electron m = 9.11 × 10⁻³¹ kg
Rest energy = mc² = 9.11 × 10⁻³¹ × (3.0 × 10⁸)² = 8.2 × 10⁻¹⁴ J
Formula: hf = mc² (for each photon)
f = mc²/h = (8.2 × 10⁻¹⁴) / (6.63 × 10⁻³⁴)
f = **1.24 × 10²⁰ Hz**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Classification of Particles",
                content: `## The Particle Zoo

### Hadrons

- Made of **quarks**.
- Experience the **strong nuclear force**.
- Two types:
  1. **Baryons** (3 quarks, B=1): Proton (stable), Neutron (unstable)
  2. **Mesons** (quark-antiquark pair, B=0): Pions, Kaons

### Leptons

- **Fundamental** particles (not made of quarks).
- Do **NOT** experience strong nuclear force.
- Experience weak interaction (and EM if charged).
- Examples: Electron, Muon, Tau, Neutrinos.

### The Standard Model Generations

| Generation | Quarks | Leptons |
|------------|--------|---------|
| 1st | Up (u), Down (d) | Electron (e⁻), νₑ |
| 2nd | Charm (c), Strange (s) | Muon (μ⁻), νμ |
| 3rd | Top (t), Bottom (b) | Tau (τ⁻), ντ |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Quarks and Antiquarks",
                content: `## Building Block Properties

### Quark Properties

| Quark | Symbol | Charge (Q) | Baryon No. (B) | Strangeness (S) |
|-------|--------|------------|----------------|-----------------|
| Up | u | +2/3 | +1/3 | 0 |
| Down | d | -1/3 | +1/3 | 0 |
| Strange | s | -1/3 | +1/3 | -1 |

**Note:** The Strange quark has strangeness -1.
Antiquarks have opposite signs for Q, B, and S.

### Baryon Compositions (qqq)

- **Proton:** uud (2/3 + 2/3 - 1/3 = +1 charge)
- **Neutron:** udd (2/3 - 1/3 - 1/3 = 0 charge)
- **Antiproton:** ūūdT (antiparticles)

### Meson Compositions (qq̄)

- **Pions (π):** Made of u, d combinations. S=0.
  - π⁺: ud̄
  - π⁻: dū
  - π⁰: uū or dd̄
- **Kaons (K):** Contain strange quarks. S = ±1.
  - K⁺: us̄ (S = +1)
  - K⁻: sū (S = -1)
  - K⁰: ds̄ (S = +1)

### Worked Example: Identifying a Particle

A particle has quark composition **uds**. Identify its charge, baryon number, and strangeness.

**Solution:**
Charge = 2/3 - 1/3 - 1/3 = **0**
Baryon No = 1/3 + 1/3 + 1/3 = **+1** (It is a baryon)
Strangeness = 0 + 0 - 1 = **-1**
Particle is the Lambda baryon (Λ⁰).`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Conservation Laws",
                content: `## Rules of Interaction

### Always Conserved

In **ALL** interactions (Strong, Weak, EM, Gravity):
1. **Charge (Q)**
2. **Baryon Number (B)**
3. **Lepton Number (L)** (Must be conserved for each generation separately: Lₑ, Lμ)
4. **Energy and Momentum**

### Conservation of Strangeness

- **Conserved in STRONG** interactions.
- **NOT conserved in WEAK** interactions (can change by ±1).
- This is why strange particles are produced in pairs (Strong) but decay individually (Weak).

### Fundamental Interactions

| Interaction | Exchange Particle (Boson) | Acts on | Range | Key Features |
|-------------|---------------------------|---------|-------|--------------|
| **Strong** | Gluon (between quarks), Pion (between nucleons) | Quarks, Hadrons | ~3 fm | Holds nucleus together |
| **Weak** | W⁺, W⁻, Z⁰ | All particles | ~0.001 fm | Responsible for β-decay, quark flavour change |
| **Electromagnetic** | Virtual Photon (γ) | Charged particles | Infinite | Forces between charges |
| **Gravity** | Graviton (theoretical) | All particles with mass | Infinite | Weakest force |

### Interaction Examples

**1. Beta-minus decay (Weak):**
n → p + e⁻ + ν̄ₑ
- d quark turns into u quark (flavour change = Weak)
- Exchange particle: W⁻ boson

**2. Electron capture:**
p + e⁻ → n + νₑ
- Exchange particle: W⁺ boson

### Worked Example: Checking Validity

Check if this interaction is possible: **p + p → p + n + π⁺**

**Analysis:**
1. **Charge:** +1 + 1 = +1 + 0 + 1 → 2 = 2 (Conserved ✓)
2. **Baryon No:** 1 + 1 = 1 + 1 + 0 → 2 = 2 (Conserved ✓)
3. **Lepton No:** 0 = 0 (Conserved ✓)
**Result:** Interaction is **POSSIBLE** (via Strong interaction as no leptons involved and S=0).`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Specific Charge = Charge / Mass",
            "Isotopes: Same proton number, different nucleon number",
            "Strong nuclear force: Attractive 0.5-3 fm, repulsive < 0.5 fm",
            "Antiparticles: Opposite charge, B, L, S; same mass and rest energy",
            "Annihilation: E = mc² used to find photon energy",
            "Hadrons = Baryons (qqq, B=1) + Mesons (qq̄, B=0)",
            "Leptons: Fundamental (e⁻, μ⁻, ν), interact via Weak force",
            "Quarks: u (+2/3), d (-1/3), s (-1/3, S=-1)",
            "Conservation: Q, B, L always conserved",
            "Strangeness conserved in Strong, can change by ±1 in Weak interactions"
        ],
        exam_tips: [
            "Remember 'Strange Pions' don't exist - Pions have S=0",
            "Kaons have interactions with Strangeness",
            "Beta decay involves the WEAK interaction (quark flavour changes)",
            "In annihilation calculations, remember there are TWO photons (divide specific energy by 2 if needed)",
            "Specific charge implies Q/m, not just charge",
            "Neutrinos have Lepton number +1, Antineutrinos -1",
            "Learn the quark composition of protons (uud) and neutrons (udd)",
            "Exchange particle for EM is virtual photon; for Weak is W boson"
        ]
    },
    "Motion in a Circle": {
        topic: "Motion in a Circle",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/A%20level/Motion_in_a_Circle.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvQSBsZXZlbC9Nb3Rpb25faW5fYV9DaXJjbGUubXA0IiwiaWF0IjoxNzY4MTA2Nzk3LCJleHAiOjUyNjg2MDI3OTd9.R5MNtBvHfSWW3M_J-E6NDFuXbHFhy-u3pdwhlqfxr_E",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/A%20level/Mastering_A-Level_Circular_Motion_Dynamics.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL0EgbGV2ZWwvTWFzdGVyaW5nX0EtTGV2ZWxfQ2lyY3VsYXJfTW90aW9uX0R5bmFtaWNzLm00YSIsImlhdCI6MTc2ODA3NTI3MywiZXhwIjo1MjY4NTcxMjczfQ.xsutCQ4d1gU5Jf38q1-aOeVRJZIktn6c23BJhHZPSk4",
        subject: "A Level Physics",
        summary: "Motion in a circle involves objects moving along curved paths, requiring a centripetal force directed toward the centre. This topic covers angular velocity, radians, centripetal acceleration and force, and advanced applications including banked tracks, conical pendulums, and vertical circular motion.",
        sections: [
            {
                title: "1. Angular Kinematics",
                content: `## Describing Rotation

### Radians

The radian is the natural unit for angles in physics.
**1 radian** is the angle subtended at the centre of a circle by an arc equal in length to the radius.

**2π rad = 360°**
**1 rad ≈ 57.3°**

**Conversions:**
- Degrees to Radians: **× π/180**
- Radians to Degrees: **× 180/π**

### Angular Displacement (θ)

The angle turned through: **θ = s/r**
Where s is arc length and r is radius.

### Angular Velocity (ω)

The rate of change of angular displacement.

**ω = Δθ / Δt**

**Units:** rad s⁻¹ (radians per second)

### Relationship with Period and Frequency

If an object completes one full circle (2π radians) in time T (period):
**ω = 2π/T**

Since frequency f = 1/T:
**ω = 2πf**

### Linear vs Angular Speed

For an object moving in a circle of radius r:
**v = rω**

- v = linear speed (m s⁻¹)
- r = radius (m)
- ω = angular velocity (rad s⁻¹)

### Worked Example: Hard Drive

A hard drive platter spins at 7200 rpm (revolutions per minute).
(a) Calculate angular velocity in rad s⁻¹.
(b) Calculate linear speed of a point 4 cm from centre.

**Solution:**
(a) 7200 rpm = 7200/60 = 120 rev/s
ω = 120 × 2π = 240π = **754 rad s⁻¹**

(b) v = rω
v = 0.04 × 754 = **30.2 m s⁻¹**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Centripetal Acceleration",
                content: `## Acceleration Toward the Centre

### The concept

Even if an object moves at a constant *speed* in a circle, its *velocity* is constantly changing (because direction changes).
Therefore, it is accelerating.

**Direction:** Always toward the centre of the circle (perpendicular to velocity).

### Formulae

**a = v²/r**
Using v = rω:
**a = (rω)²/r = rω²**

So: **a = v²/r = rω²**

### Derivation (Small Angle Approximation)

1. In time Δt, object moves distance vΔt along arc.
2. Angle turned Δθ = ωΔt.
3. Change in velocity vector Δv points toward centre.
4. Magnitude |Δv| ≈ v × Δθ = v(ωΔt).
5. Acceleration a = Δv/Δt = vω.
6. Substitute v=rω → a = rω².`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Centripetal Force",
                content: `## The Net Force

Newton's 2nd Law (F=ma) implies that if there is centripetal acceleration, there must be a resultant force causing it.

**F = ma = mv²/r = mrω²**

**Crucial Concept:** "Centripetal force" is NOT a physical force like gravity or friction. It is the label we give to the **resultant force** directed towards the centre.

### Identifying the Source

| Situation | Source of Centripetal Force |
|-----------|-----------------------------|
| Planet orbiting Sun | Gravitational force |
| Car turning corner | Friction between tyres and road |
| Ball on string | Tension in string |
| Electron in atom | Electrostatic force |
| Banked aircraft turn | Horizontal component of Lift |

### Worked Example: Car on Corner

A 1000 kg car turns a corner of radius 50 m. The coefficient of friction is 0.8. Calculate max speed.

**Solution:**
Centripetal force is provided by friction.
mv²/r ≤ F_friction
mv²/r ≤ μmg
v² ≤ μrg
v_max = √(0.8 × 50 × 9.81) = √392.4 = **19.8 m s⁻¹** (approx 71 km/h)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Advanced Applications",
                content: `## Banking and Pendulums

### Conical Pendulum

A mass m on a string of length L swings in a horizontal circle. String makes angle θ with vertical.

**Vertical:** T cos θ = mg (equilibrium)
**Horizontal:** T sin θ = mv²/r (centripetal force)

Dividing horizontal by vertical:
(T sin θ) / (T cos θ) = (mv²/r) / mg
**tan θ = v²/rg**

Independent of mass!

### Banked Tracks (No Friction Case)

Tracks are banked at angle θ so the normal reaction force provides the centripetal force component, reducing reliance on friction.

**Vertical:** N cos θ = mg
**Horizontal:** N sin θ = mv²/r

Dividing: **tan θ = v²/rg**
This gives the "design speed" for the bend where no friction is needed.

### Worked Example: Banked Velodrome

A cyclist travels at 15 m s⁻¹ around a curve of radius 25 m. What is the ideal banking angle?

**Solution:**
tan θ = v²/rg = 15² / (25 × 9.81)
tan θ = 225 / 245.25 = 0.917
θ = tan⁻¹(0.917) = **42.5°**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Vertical Circular Motion",
                content: `## Motion Against Gravity

Speed is often not constant in vertical circles due to energy exchange between KE and GPE.

### Forces at the Top

Weight acts DOWN (towards centre).
Tension/Reaction acts DOWN (towards centre).

F_net = T + mg = mv²/r
**T = mv²/r - mg**

**Minimum Speed (Loop-the-loop):**
For string to stay taut (or car to stay on track), T ≥ 0 (or N ≥ 0).
mv²/r - mg ≥ 0
v² ≥ gr
**v_min = √(gr)**

### Forces at the Bottom

Weight acts DOWN (away from centre).
Tension/Reaction acts UP (towards centre).

F_net = T - mg = mv²/r
**T = mv²/r + mg**

**Maximum Tension:** Occurs at the bottom because velocity is highest (energy conservation) AND weight opposes tension.

### Energy Conservation

If length is r:
GPE change from top to bottom = mg(2r).
½mv_bottom² = ½mv_top² + mg(2r)

### Worked Example: Bucket of Water

A bucket is spun in a vertical circle of radius 0.8 m. What is the minimum speed at the top so water doesn't fall out?

**Solution:**
Condition: Weight alone provides centripetal force (Normal reaction from bucket bottom = 0).
mg = mv²/r
v = √(gr) = √(9.81 × 0.8) = √7.848
**v = 2.8 m s⁻¹**`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Radiant measure: 2π rad = 360°",
            "Angular velocity ω = 2π/T = 2πf",
            "Linear speed v = rω",
            "Centripetal acceleration a = v²/r = rω² (always towards centre)",
            "Centripetal force is a RESULTANT force, provided by T, mg, Friction, etc.",
            "Banked tracks: tan θ = v²/rg (ideal angle)",
            "Vertical circle top: T = mv²/r - mg; Min speed v = √(gr)",
            "Vertical circle bottom: T = mv²/r + mg; Max tension occurs here"
        ],
        exam_tips: [
            "Always convert rpm to rad/s or Hz first",
            "Draw a free-body diagram to identify WHICH forces provide the centripetal component",
            "Remember: Centripetal force acts perpendicular to velocity, so it does NO WORK (speed is constant if circle is horizontal)",
            "In vertical circles, use conservation of energy to find speed differences",
            "For 'weightlessness' at the top of a hump-back bridge, set mg = mv²/r",
            "Don't forget the mass in F=ma, but notice it cancels in tan θ = v²/rg"
        ]
    },
    "Gravitational Fields": {
        topic: "Gravitational Fields",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/A%20level/A-Level_Physics__Gravitational_Fields.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvQSBsZXZlbC9BLUxldmVsX1BoeXNpY3NfX0dyYXZpdGF0aW9uYWxfRmllbGRzLm1wNCIsImlhdCI6MTc2ODEwNTk4NSwiZXhwIjo1MjY4NjAxOTg1fQ.QbuI8VqP40ea-MEoKVb346rvogtvOkMID8idQ9TTD8U",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/A%20level/Gravitational_Fields_Force_Energy_Orbits.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL0EgbGV2ZWwvR3Jhdml0YXRpb25hbF9GaWVsZHNfRm9yY2VfRW5lcmd5X09yYml0cy5tNGEiLCJpYXQiOjE3NjgwNzUyMTksImV4cCI6NTI2ODU3MTIxOX0.4ZEy-4UxGiHLtrsxMIbccXZHj0LAjRPuDxujYZ72WqY",
        subject: "A Level Physics",
        summary: "Gravitational fields describe how massive objects interact through the force of gravity. This topic covers Newton's law of gravitation, gravitational field strength, gravitational potential, orbital motion, and escape velocity.",
        sections: [
            {
                title: "1. Newton's Law of Gravitation",
                content: `## The Universal Force

**Newton's Law of Gravitation:** Every particle of matter attracts every other particle with a force directly proportional to the product of their masses and inversely proportional to the square of the distance between their centres.

### Formula

**F = -GMm/r²**

- F = gravitational force (N)
- G = gravitational constant = 6.67 × 10⁻¹¹ N m² kg⁻²
- M, m = the two masses (kg)
- r = distance between centres (m)

**Note:** The minus sign indicates an ATTRACTIVE force (convention), though often omitted when calculating magnitude.

### Key Features

1.  **Always attractive:** Gravity never repels.
2.  **Infinite range:** Although it weakens with distance (1/r²), it never reaches zero.
3.  **Inverse Square Law:** If distance doubles, force reduces by factor of 4.

### Worked Example: Earth-Moon Force

Calculate the force between Earth (6.0 × 10²⁴ kg) and Moon (7.4 × 10²² kg) separated by 3.8 × 10⁸ m.

**Solution:**
F = (6.67 × 10⁻¹¹ × 6.0 × 10²⁴ × 7.4 × 10²²) / (3.8 × 10⁸)²
F = (2.96 × 10³⁷) / (1.44 × 10¹⁷)
F = **2.05 × 10²⁰ N**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Gravitational Field Strength (g)",
                content: `## The Field Concept

**Definition:** The force per unit mass on a small test mass placed in the field.

**g = F/m** (N kg⁻¹)

### Field of a Point Mass (Radial Field)

Substituting F = GMm/r²:
**g = GM/r²**

- **radial field:** Field lines point towards the centre.
- g follows an inverse square law.

### Field Inside a Uniform Sphere

If you tunnel into the Earth (assuming uniform density):
g ∝ r
(g decreases linearly to zero at the centre).

## Uniform Fields

Near the surface of a planet:
- Field lines are parallel and equally spaced.
- g is approximately constant (e.g., 9.81 N kg⁻¹).

### Graphs

**g vs r graph:**
- Inside sphere (0 < r < R): Linear increase.
- Outside sphere (r > R): 1/r² decay curve.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Gravitational Potential (Φ)",
                content: `## Energy in Fields

**Definition:** The work done per unit mass to bring a small test mass from infinity to a point in the field.

**Φ = -GM/r**

- Φ = gravitational potential (J kg⁻¹)
- It is a **scalar** quantity.
- It is always **NEGATIVE** (0 at infinity).

### Gravitational Potential Energy (Ep)

**Ep = mΦ = -GMm/r**

- Work done moving mass m from infinity to point r.

### Change in Potential Energy

Moving from r₁ to r₂:
**ΔEp = -GMm(1/r₂ - 1/r₁)**

### Relationship Between g and Φ

**g = -dΦ/dr**
(Field strength is the negative gradient of potential).

### Graphs

**Φ vs r graph:**
- Starts at large negative value at surface (R).
- Increases towards zero as r → ∞.
- Curve is 1/r shape.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Orbital Motion",
                content: `## Satellites and Planets

For any object in circular orbit, **Gravity provides the Centripetal Force**.

F_grav = F_centripetal
GMm/r² = mv²/r

### Orbital Speed

Rearranging the above:
v² = GM/r
**v = √(GM/r)**

- Speed decreases as radius increases.
- Independent of satellite mass m.

### Orbital Period (Kepler's 3rd Law)

Using v = 2πr/T:
(2πr/T)² = GM/r
4π²r²/T² = GM/r
**T² = (4π²/GM)r³**

**T² ∝ r³** is the key relationship.

### Geostationary Orbits

A satellite that stays above the same point on Earth.
**Conditions:**
1. Period T = 24 hours (86400 s).
2. Orbit must be directly above the Equator.
3. Direction: West to East (same as Earth's rotation).

**Radius Calculation:**
r³ = T²GM/4π²
r ≈ 4.23 × 10⁷ m (42,300 km from centre).
Height ≈ 36,000 km above surface.

### Worked Example: Geostationary Speed

Calculate speed of a geostationary satellite.
r = 4.23 × 10⁷ m

**Solution:**
v = 2πr/T = (2π × 4.23 × 10⁷) / 86400
v = **3076 m s⁻¹** (approx 3.1 km/s)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Energy in Orbits & Escape Velocity",
                content: `## Total Energy and Escape

### Total Orbital Energy

Total E = Kinetic Energy + Potential Energy
E_total = ½mv² - GMm/r

Since mv²/r = GMm/r² → ½mv² = GMm/2r

E_total = GMm/2r - GMm/r
**E_total = -GMm/2r**

- Total energy is negative (bound state).
- Magnitude is half the potential energy.

### Escape Velocity

Minimum speed to escape to infinity (where total energy = 0).
KE + PE = 0
½mv² - GMm/r = 0
v² = 2GM/r
**v_esc = √(2GM/r)**

**Note:** Escape velocity is √2 times the orbital velocity for a low circular orbit.

For Earth: v_esc ≈ 11.2 km s⁻¹.`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "F = -GMm/r² (Newton's Law of Gravitation)",
            "Field strength g = GM/r² (N kg⁻¹)",
            "Potential Φ = -GM/r (J kg⁻¹, always negative)",
            "g is the negative gradient of potential (g = -ΔΦ/Δr)",
            "Orbital Speed: v = √(GM/r)",
            "Kepler's 3rd Law: T² ∝ r³",
            "Geostationary: T=24h, Equatorial, West to East",
            "Total Satellite Energy: E = -GMm/2r",
            "Escape Velocity: v = √(2GM/r)"
        ],
        exam_tips: [
            "Use r from CENTRE of mass, so r = Radius of planet + Altitude",
            "Potential Φ is zero at infinity and negative everywhere else",
            "For geostationary orbit questions, T must be in seconds (86400 s)",
            "g vs r graph follows 1/r²; Φ vs r graph follows 1/r",
            "Force is vector, Potential is scalar",
            "Remember escape velocity is independent of the projectile's mass"
        ]
    },
    "Temperature": {
        topic: "Temperature",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/A%20level/Temperature_&_Thermal_Physics.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvQSBsZXZlbC9UZW1wZXJhdHVyZV8mX1RoZXJtYWxfUGh5c2ljcy5tcDQiLCJpYXQiOjE3NjgxMDY5MzMsImV4cCI6NTI2ODYwMjkzM30.7Fdd_qYQZFXxxwPi8RIHfo5HPY9ZqLCg0YyfTRXrcJo",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/A%20level/A-Level_Thermal_Physics_Syllabus_Shortcut.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL0EgbGV2ZWwvQS1MZXZlbF9UaGVybWFsX1BoeXNpY3NfU3lsbGFidXNfU2hvcnRjdXQubTRhIiwiaWF0IjoxNzY4MDc1MDU0LCJleHAiOjUyNjg1NzEwNTR9.pATM5CyYu75t3HFtjwlB9qLTChY7xQyhDAf2JDf5wYE",
        subject: "A Level Physics",
        summary: "Temperature is a measure of the average kinetic energy of particles in a substance. This topic covers thermal equilibrium, temperature scales (Celsius and Kelvin), specific heat capacity, specific latent heat, and experimental methods involved in thermal physics.",
        sections: [
            {
                title: "1. Thermal Equilibrium and Temperature",
                content: `## What Is Temperature?

**Temperature:** A measure of the **average kinetic energy** of the particles in a substance.
- It determines the direction of net thermal energy transfer.
- Energy flows from high T to low T.

### Thermal Equilibrium

**Definition:** When two objects in thermal contact have **no net transfer of thermal energy** between them. They are at the same temperature.

### The Zeroth Law of Thermodynamics

"If object A is in thermal equilibrium with object B, and B is in thermal equilibrium with object C, then A and C are in thermal equilibrium with each other."

This is the principle that allows **thermometers** to work. The thermometer reaches thermal equilibrium with the object being measured.

### Absolute Scale (Kelvin)

The SI unit of temperature is the Kelvin (K).

**Absolute Zero (0 K):**
- The lowest possible temperature.
- Particles have **minimum internal energy** (kinetic energy is effectively zero).
- 0 K = -273.15 °C

**Conversions:**
- T(K) = T(°C) + 273.15
- Change in T(K) = Change in T(°C) (i.e., ΔT = 1 K is same size as ΔT = 1 °C)

| Point | Celsius (°C) | Kelvin (K) |
|-------|--------------|------------|
| Absolute Zero | -273.15 | 0 |
| Freezing Point of Water | 0 | 273.15 |
| Boiling Point of Water | 100 | 373.15 |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Specific Heat Capacity (c)",
                content: `## Heating Substances

**Definition:** The energy required per unit mass to raise the temperature of a substance by 1 K (or 1 °C).

### Formula

**E = mcΔT** (or Q = mcΔθ)

- E = thermal energy supplied (J)
- m = mass (kg)
- c = specific heat capacity (J kg⁻¹ K⁻¹)
- ΔT = change in temperature (K or °C)

**Note:** Since it involves ΔT, you can use Celsius or Kelvin differences.

### Significance

- **High c (e.g., Water ~4200 J kg⁻¹ K⁻¹):** Requires lots of energy to heat up; cools down slowly. Used in cooling systems (car radiators) and stabilizes climate.
- **Low c (e.g., Copper ~390 J kg⁻¹ K⁻¹):** Heats up and cools down quickly. Good for cooking pans.

### Worked Example: Kettle

Calculate energy to heat 1.5 kg of water from 20°C to 100°C. (c_water = 4180 J kg⁻¹ K⁻¹)

**Solution:**
ΔT = 100 - 20 = 80 K
E = mcΔT = 1.5 × 4180 × 80
E = **501,600 J** ≈ **502 kJ**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Specific Latent Heat (L)",
                content: `## Phase Changes

**Definition:** The energy required per unit mass to change the phase (state) of a substance at **constant temperature**.

### Formula

**E = mL**

- E = energy supplied (J)
- m = mass changing phase (kg)
- L = specific latent heat (J kg⁻¹)

### Two Types

1.  **Latent Heat of Fusion (Lf):**
    - Solid ↔ Liquid (Melting/Freezing)
    - Energy goes into breaking intermolecular bonds between solid particles.
    - Example (Ice): Lf ≈ 3.34 × 10⁵ J kg⁻¹

2.  **Latent Heat of Vaporisation (Lv):**
    - Liquid ↔ Gas (Boiling/Condensing)
    - Energy goes into completely separating particles against atmospheric pressure.
    - Lv is usually **much larger** than Lf because much more work is done against intermolecular forces.
    - Example (Water): Lv ≈ 2.26 × 10⁶ J kg⁻¹

### Internal Energy During Phase Change

- **Kinetic Energy:** Remains constant (Temperature is constant).
- **Potential Energy:** Increases (bonds are broken/stretched).
- **Total Internal Energy:** Increases.

### Heating Curves (Temperature vs Time)

- **Sloped sections:** E = mcΔT (Kinetic energy increasing).
- **Flat sections:** E = mL (Potential energy increasing, Phase change occurring).`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Experimental Methods",
                content: `## Measuring Thermal Properties

### Determining Specific Heat Capacity (Electrical Method)

**Setup:**
- Block of metal (mass m) with heater and thermometer inserted.
- Insulate the block well.

**Procedure:**
1. Measure initial temp T₁.
2. Switch on heater (Current I, Voltage V) for time t.
3. Measure final max temp T₂.

**Calculation:**
Electrical Energy = Thermal Energy (+ Loss)
VIt = mc(T₂ - T₁)
**c = VIt / m(T₂ - T₁)**

**Improving Accuracy:**
- Correct for heat loss: Use a cooling correction graph.
- Plot T vs t: Linear part gradient = P/mc.

### Measuring Latent Heat of Vaporisation

**Setup:**
- Heater in flask of boiling water.
- Condenser to collect distilled water.

**Procedure:**
1. Water brought to boil.
2. Collect mass m of condensed steam in time t.
3. Measure V and I of heater.

**Calculation:**
VIt = mL (+ Energy lost to surroundings)
**L = VIt / m**

**Note:** Heat loss is significant here. A "continuous flow" method eliminates heat loss error by using two different flow rates.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Comprehensive Worked Example",
                content: `## Combining Concepts

**Question:**
Ice at -10°C (mass 0.5 kg) is heated until it becomes water at 50°C.
Calculate total energy supplied.
- c_ice = 2100 J kg⁻¹ K⁻¹
- c_water = 4200 J kg⁻¹ K⁻¹
- L_fusion = 3.3 × 10⁵ J kg⁻¹

**Solution:**
We need to calculate energy in **three stages**:

**Stage 1: Heating ice (-10°C to 0°C)**
E₁ = mcΔT = 0.5 × 2100 × (0 - (-10))
E₁ = 0.5 × 2100 × 10 = **10,500 J**

**Stage 2: Melting ice at 0°C**
E₂ = mL = 0.5 × 3.3 × 10⁵
E₂ = **165,000 J**

**Stage 3: Heating water (0°C to 50°C)**
E₃ = mcΔT = 0.5 × 4200 × (50 - 0)
E₃ = 0.5 × 4200 × 50 = **105,000 J**

**Total Energy:**
E_total = E₁ + E₂ + E₃
E_total = 10500 + 165000 + 105000
E_total = **280,500 J** ≈ **281 kJ**`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Temperature measures average kinetic energy",
            "Absolute Zero = 0 K = -273.15 °C",
            "T(K) = T(°C) + 273.15",
            "Specific Heat Capacity c: E = mcΔT",
            "Specific Latent Heat L: E = mL",
            "Latent heat of vaporisation > Latent heat of fusion",
            "Internal energy = Kinetic Energy + Potential Energy of particles",
            "During phase change: KE constant (so T constant), PE increases",
            "Experimentally determine c using VIt = mcΔT"
        ],
        exam_tips: [
            "Always check if you need to add 273 to convert to Kelvin (essential for gas laws, optional for ΔT)",
            "In 'mixing' questions (e.g., hot block in cold water), assume Energy Lost by Hot = Energy Gained by Cold",
            "Watch out for phase changes hidden in questions (e.g., ice melting before heating up)",
            "Remember power P = E/t, so P = mcΔT/t for continuous flow",
            "Lv is usually much larger than Lf because gas molecules are completely separated"
        ]
    },
    "Ideal Gases": {
        topic: "Ideal Gases",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/A%20level/A-Level_Physics__Ideal_Gases.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvQSBsZXZlbC9BLUxldmVsX1BoeXNpY3NfX0lkZWFsX0dhc2VzLm1wNCIsImlhdCI6MTc2ODEwNjAzMSwiZXhwIjo1MjY4NjAyMDMxfQ.KPM-iDqnD1MYhxSDRYoxPAxaPLr1wdCv0tYNz834igw",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/A%20level/Kinetic_Theory_and_Ideal_Gas_Assumptions.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL0EgbGV2ZWwvS2luZXRpY19UaGVvcnlfYW5kX0lkZWFsX0dhc19Bc3N1bXB0aW9ucy5tNGEiLCJpYXQiOjE3NjgwNzUyNTEsImV4cCI6NTI2ODU3MTI1MX0.rgnlInCMJfcFEyUnQIWebpxqYNJ-8DU-to-vjIM2y9s",
        subject: "A Level Physics",
        summary: "The ideal gas model provides a simplified description of how gases behave based on microscopic particle motion. This topic covers the empirical gas laws, the ideal gas equation, kinetic theory assumptions, derivation of pressure, and the link between temperature and kinetic energy.",
        sections: [
            {
                title: "1. The Gas Laws",
                content: `## Empirical Gas Relationships

### Boyle's Law (Isothermal Change)

**Statement:** For a fixed mass of gas at constant temperature, pressure is inversely proportional to volume.

**pV = constant**
**p₁V₁ = p₂V₂**

- Graph of p vs V: Inverse curve (hyperbola).
- Graph of p vs 1/V: Straight line through origin.

### Charles's Law (Isobaric Change)

**Statement:** For a fixed mass of gas at constant pressure, volume is directly proportional to absolute temperature.

**V/T = constant**
**V₁/T₁ = V₂/T₂**

- **T must be in Kelvin.**
- Graph of V vs T(K): Straight line through origin.
- Graph of V vs T(°C): Straight line intersecting x-axis at -273°C.

### Pressure Law (Gay-Lussac's Law)

**Statement:** For a fixed mass of gas at constant volume, pressure is directly proportional to absolute temperature.

**p/T = constant**
**p₁/T₁ = p₂/T₂**

### The Ideal Gas Equation

Combining the three laws:

**pV = nRT**

- p = pressure (Pa)
- V = volume (m³)
- n = amount of substance (moles)
- R = Molar Gas Constant (8.31 J mol⁻¹ K⁻¹)
- T = temperature (K)

### Worked Example: Balloon Expansion

A balloon contains 0.05 moles of helium at 20°C and 100 kPa.
(a) Calculate volume.
(b) If heated to 60°C at constant pressure, find new volume.

**Solution:**
(a) pV = nRT
V = nRT/p
V = (0.05 × 8.31 × 293) / 100,000
V = **1.22 × 10⁻³ m³** (1.22 litres)

(b) V₁/T₁ = V₂/T₂
V₂ = V₁ × (T₂/T₁)
V₂ = 1.22 × 10⁻³ × (333/293)
V₂ = **1.39 × 10⁻³ m³**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. The Kinetic Theory Model",
                content: `## Microscopic Explanations

### Assumptions of an Ideal Gas

1.  **Large number of molecules** in rapid, random motion.
2.  **Negligible volume** of molecules compared to the volume of the container.
3.  **Elastic collisions:** Kinetic energy is conserved in collisions.
4.  **Negligible time** of collision compared to time between collisions.
5.  **No intermolecular forces** between molecules (except during collisions).

### Explaining Pressure

Pressure is caused by the **collisions** of gas molecules with the container walls.
- Molecule helps momentum change (bounce).
- Change in momentum → Force (Newton's 2nd Law).
- Total force from many impacts over Area → Pressure (p=F/A).

### The Kinetic Theory Equation

**pV = ⅓Nm<c²>**

- N = total number of molecules
- m = mass of one molecule (kg)
- <c²> = mean square speed (m² s⁻²)

**Alternative form using density (ρ):**
Since Nm = Total mass M_total, and ρ = M_total/V:
**p = ⅓ρ<c²>**

### Root Mean Square Speed (c_rms)

A statistical measure of the speed of gas molecules.

**c_rms = √<c²>**

**c_rms = √(3pV/Nm)** or **c_rms = √(3RT/M_molar)**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Boltzmann Constant (k)",
                content: `## Per-Molecule Constants

The gas constant R is for one **mole**.
The Boltzmann constant k is for one **molecule**.

**k = R / N_A**

- R = 8.31 J mol⁻¹ K⁻¹
- N_A = Avogadro constant (6.02 × 10²³ mol⁻¹)
- **k = 1.38 × 10⁻²³ J K⁻¹**

### Equation Forms

| Molar Form | Molecular Form |
|------------|----------------|
| pV = nRT | pV = NkT |
| Energy = 3/2 RT | Energy = 3/2 kT |

Where n = moles, N = number of molecules.
**N = n × N_A**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Kinetic Energy and Temperature",
                content: `## The Meaning of Temperature

### Driving the Relationship

Comparing pV = ⅓Nm<c²> and pV = NkT:

⅓Nm<c²> = NkT
⅓m<c²> = kT
⅔(½m<c²>) = kT

**Average Translational Kinetic Energy:**
**E_k = ½m<c²> = 3/2 kT**

### Key Implications

1.  **Temperature is proportional to Average KE:**
    The absolute temperature of an ideal gas is a direct measure of the average random kinetic energy of its molecules.

2.  **Independence:**
    Average KE depends ONLY on temperature, not on the mass of the gas. (e.g., at the same T, Hydrogen and Oxygen have same average KE, but Hydrogen moves faster because it has less mass).

3.  **Internal Energy (U):**
    For an ideal gas, there is no potential energy (no bonds).
    Internal Energy = Total Kinetic Energy.
    **U = 3/2 NkT** (for monatomic gas).

### Worked Example: Speed Calculation

Calculate the rms speed of Oxygen molecules (O₂) at 20°C.
(Molar mass of O₂ = 0.032 kg mol⁻¹)

**Solution:**
T = 293 K
c_rms = √(3RT/M)
c_rms = √(3 × 8.31 × 293 / 0.032)
c_rms = √(228,251)
c_rms = **478 m s⁻¹**

(Approx 1700 km/h - gas molecules move very fast!)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Real vs Ideal Gases",
                content: `## Method Limitations

### Limitations of the Ideal Model

Real gases behave like ideal gases at:
- **Low Pressures** (Volume of molecules becomes negligible).
- **High Temperatures** (Fast moving, so intermolecular forces negligible).

### Deviations

At **very high pressures** or **very low temperatures**:
- Molecules are close together.
- Volume of molecules matters.
- Intermolecular forces (Van der Waals) become significant.
- Gas may liquefy (phase change not predicted by ideal law).`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Use Kelvin (K) for all gas equations",
            "pV = nRT (moles) or pV = NkT (molecules)",
            "Assumptions: large N, random motion, negligible volume, elastic collisions",
            "Pressure is due to rate of change of momentum of collisions with walls",
            "Mean KE per molecule = 3/2 kT",
            "Internal energy of ideal gas is purely Kinetic Energy",
            "T ∝ Average KE",
            "c_rms = √(3RT/M_molar); lighter molecules move faster at same T"
        ],
        exam_tips: [
            "Common error: using Celsius in pV=nRT. Always +273!",
            "Common error: confusing n (moles) and N (molecules). N = n × Avogadro",
            "Common error: using molar mass in g/mol. Convert to kg/mol for rms speed! (e.g., O2 is 0.032 kg/mol)",
            "Be able to state the assumption that leads to 'Internal Energy = Kinetic Energy' (no PE/no bonds)",
            "Explain pressure in terms of momentum change: mc - (-mc) = 2mc"
        ]
    },
    "Thermodynamics": {
        topic: "Thermodynamics",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/A%20level/A-Level_Physics__Thermodynamics.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvQSBsZXZlbC9BLUxldmVsX1BoeXNpY3NfX1RoZXJtb2R5bmFtaWNzLm1wNCIsImlhdCI6MTc2ODEwNjA4OSwiZXhwIjo1MjY4NjAyMDg5fQ.jw4kZna4FvGpxznkahLxB3oRkUUD2_4n5TprZqiKac4",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/A%20level/Thermodynamics_Heat_Work_and_Kinetic_Theory.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL0EgbGV2ZWwvVGhlcm1vZHluYW1pY3NfSGVhdF9Xb3JrX2FuZF9LaW5ldGljX1RoZW9yeS5tNGEiLCJpYXQiOjE3NjgwNzU1MzAsImV4cCI6NTI2ODU3MTUzMH0.9cgjCr16Wu4lHpNyKxCi2HOqoGkDewSOTApx5ToIyWU",
        subject: "A Level Physics",
        summary: "Thermodynamics deals with heat, work, and energy transfer in systems. This topic covers the first law of thermodynamics, work done by gases, p-V diagrams, and the concept of internal energy.",
        sections: [
            {
                title: "1. Internal Energy (U)",
                content: `## Energy Inside a System

**Definition:** The **sum** of the random kinetic energies and potential energies of all the molecules in a system.

**U = ΣKE + ΣPE**

- **Kinetic Energy (KE):** Due to random motion (translation, rotation, vibration). Increases with Temperature.
- **Potential Energy (PE):** Due to intermolecular forces (bonds). Changes with Phase and Separation (Volume).

### For an Ideal Gas

- **Assumption:** No intermolecular forces (PE = 0).
- **Result:** Internal energy depends **ONLY** on kinetic energy.
- Therefore, for an ideal gas, **U depends ONLY on Temperature**.

**U ∝ T**
(If T is constant, U is constant for an ideal gas).

### Real Gases
- U depends on both Temperature (KE) and Volume (PE).
- Compressing a real gas changes PE, thus changing U even if T is constant initially.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. First Law of Thermodynamics",
                content: `## Conservation of Energy

**Statement:** The increase in internal energy of a system is equal to the heat supplied to the system minus the work done by the system.

### Equation

**ΔU = q - W**

Or forms like: **q = ΔU + W**

Where:
- **ΔU** = Change in internal energy (J)
- **q** = Heat energy supplied TO the system (J)
- **W** = Work done BY the system (J)

### Sign Convention (CRITICAL)

| Quantity | Positive (+) Value Means | Negative (-) Value Means |
|----------|--------------------------|--------------------------|
| **q** | Heat added TO system | Heat removed FROM system |
| **W** | Work done BY gas (Expansion) | Work done ON gas (Compression) |
| **ΔU** | Internal energy Increases (Temp rises*) | Internal energy Decreases (Temp falls*) |

*For ideal gas.

**Note:** Some exam boards use ΔU = Q + W where W is work done ON system. ALWAYS check your specific syllabus sign convention. The form ΔU = q - W (where W is work done BY gas) is standard for engines.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Work Done by a Gas",
                content: `## Mechanical Energy Transfer

Work is done when a gas expands or is compressed against external pressure.

### Formula at Constant Pressure

**W = pΔV**

- p = pressure (Pa)
- ΔV = change in volume (m³)

### Determining Work from p-V Diagrams

**Work Done = Area under the p-V graph**

- **Expansion:** Arrow points right → Positive Work (done BY gas).
- **Compression:** Arrow points left → Negative Work (done ON gas).
- **Cyclic Process:** Net Work = Area ENCLOSED by the loop.
  - Clockwise cycle = Net work OUT (Engine).
  - Anticlockwise cycle = Net work IN (Refrigerator).

### Worked Example: Constant Pressure Expansion

Gas at 200 kPa expands from 0.03 m³ to 0.05 m³ at constant pressure. Calculate work done.

**Solution:**
W = pΔV = 200,000 × (0.05 - 0.03)
W = 200,000 × 0.02
W = **4000 J**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Specific Thermodynamic Processes",
                content: `## Types of Changes

Applying the First Law (ΔU = q - W) to specific situations:

### 1. Isochoric (Constant Volume)
- **ΔV = 0**, so **W = 0**.
- **ΔU = q**
- All heat added goes directly into increasing internal energy (Temperature rises).
- p/T = constant (Pressure Law).
- Vertical line on p-V diagram.

### 2. Isobaric (Constant Pressure)
- W = pΔV (Work is done).
- q = ΔU + W
- Heat added goes into BOTH increasing internal energy AND doing expansion work.
- V/T = constant (Charles's Law).
- Horizontal line on p-V diagram.

### 3. Isothermal (Constant Temperature)
- **ΔT = 0**, so **ΔU = 0** (for ideal gas).
- **q = W**
- All heat added is converted entirely into work (expansion).
- pV = constant (Boyle's Law).
- Curve (Hyperbola) on p-V diagram.

### 4. Adiabatic (No Heat Transfer)
- **q = 0** (Insulated or very fast process).
- **ΔU = -W**
- Work is done at the expense of internal energy.
- Expansion causes cooling (W is +ve, so ΔU is -ve).
- Correction curve steeper than isothermal on p-V diagram.
- Equation: pV^γ = constant.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Comprehensive Worked Example",
                content: `## Analysing a Cycle

**Problem:**
A gas goes through a cycle:
A → B: Heating at constant volume (p increases).
B → C: Expansion at constant pressure.
C → A: Compression back to start.

(1) A → B: Volume 0.02 m³, Pressure 100 kPa → 300 kPa. Heat added = 500 J.
(2) B → C: Pressure 300 kPa, Volume 0.02 m³ → 0.05 m³.

Calculate ΔU and W for each step.

**Solution:**

**Step A → B (Isochoric):**
- W = pΔV = 0 (No volume change).
- ΔU = q - W = 500 - 0 = **+500 J**

**Step B → C (Isobaric):**
- W = pΔV = 300,000 × (0.05 - 0.02) = 300,000 × 0.03 = **+9000 J**`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Internal energy U = sum of molecular KE + PE",
            "For ideal gas: U = KE only (no intermolecular PE)",
            "First Law: ΔU = Q - W (energy conservation)",
            "Q > 0: heat into system; W > 0: work done by system",
            "Work done by gas at constant pressure: W = pΔV",
            "Work = area under p-V curve",
            "Isothermal: ΔT = 0, ΔU = 0, Q = W",
            "Adiabatic: Q = 0, ΔU = -W",
            "Isochoric: ΔV = 0, W = 0, Q = ΔU",
            "Cycle: ΔU = 0, W_net = Q_net = area enclosed"
        ],
        exam_tips: [
            "Be careful with sign convention: define clearly",
            "On p-V diagrams, work is area (positive for expansion)",
            "For isothermal process ideal gas, pV = constant",
            "Adiabatic is steeper than isothermal on p-V diagram",
            "For cyclic process, total ΔU = 0",
            "Remember: for ideal monatomic gas, U = 3/2 nRT"
        ]
    },
    "Oscillations": {
        topic: "Oscillations",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/A%20level/The_Physics_of_Oscillation.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvQSBsZXZlbC9UaGVfUGh5c2ljc19vZl9Pc2NpbGxhdGlvbi5tcDQiLCJpYXQiOjE3NjgxMDY5NTQsImV4cCI6NTI2ODYwMjk1NH0.CWq6KDVwZG9GCr6bi3CeoxERNPIV5ARyPlY0rDRTAUA",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/A%20level/Oscillations_Simple_Harmonic_Motion_Damping_Resonance.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL0EgbGV2ZWwvT3NjaWxsYXRpb25zX1NpbXBsZV9IYXJtb25pY19Nb3Rpb25fRGFtcGluZ19SZXNvbmFuY2UubTRhIiwiaWF0IjoxNzY4MDc1MzU5LCJleHAiOjUyNjg1NzEzNTl9.AE8PBseduWOY90SWlKAnWEXRISAPA0f1IReaNuXG0v8",
        subject: "A Level Physics",
        summary: "Oscillations describe repetitive motion about an equilibrium position. This topic covers simple harmonic motion (SHM), energy in oscillations, damping, and resonance.",
        sections: [
            {
                title: "1. Simple Harmonic Motion (SHM)",
                content: `## The Definition

**Simple Harmonic Motion:** Motion where the acceleration is directly proportional to the displacement from a fixed equilibrium position and carries a negative sign, indicating a restoring force.

**a = -ω²x**

- a = acceleration (m s⁻²)
- ω = angular frequency (rad s⁻¹)
- x = displacement from equilibrium (m)
- Minus sign: Acceleration and force are always directed **opposing** displacement (towards equilibrium).

### Angular Frequency
**ω = 2πf = 2π/T**

### Key Characteristics
- **Isochronous:** Period T is independent of Amplitude A.
- **Sinusoidal:** Displacement varies as sine or cosine with time.

### Examples
- Simple Pendulum (small angles)
- Mass on a Spring
- Vibrating Atoms in a Lattice
- Liquid in a U-tube`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Kinematics of SHM",
                content: `## Equations of Motion

If timing starts at equilibrium (x=0 at t=0):
**x = x₀ sin(ωt)**

If timing starts at maximum displacement (x=x₀ at t=0):
**x = x₀ cos(ωt)**

### Velocity (v)
Velocity is the gradient of displacement-time graph.
**v = dx/dt = v₀ cos(ωt)** (if x was sine)

**v = ±ω√(x₀² - x²)** (Velocity at a specific position)

- Max velocity **v₀ = ωx₀** (at equilibrium, x=0)
- Zero velocity at extremes (x=±x₀)

### Acceleration (a)
Acceleration is the gradient of velocity-time graph.
**a = dv/dt = -ω²x**

- Max acceleration **a₀ = ω²x₀** (at extremes)
- Zero acceleration at equilibrium.

### Phase Difference
- Velocity leads Displacement by π/2 (90°).
- Acceleration leads Velocity by π/2 (90°).
- Acceleration is in anti-phase (π or 180°) with Displacement.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Energy in SHM",
                content: `## Energy Transformations

Total Energy is conserved (in undamped SHM). It continuously converts between Kinetic Energy (KE) and Potential Energy (PE).

### Equations
**Total Energy (E_total):**
**E_total = ½mω²x₀²**
- Depends on square of amplitude (A²) and square of frequency (f²).

**Kinetic Energy (KE):**
**KE = ½mv² = ½mω²(x₀² - x²)**
- Parabolic shape (inverted). Max at equilibrium.

**Potential Energy (PE):**
**PE = ½kx² = ½mω²x²**
- Parabolic shape. Max at extremes.

### Graphs
- **PE vs Displacement:** Parabola opening UP.
- **KE vs Displacement:** Parabola opening DOWN.
- **Total Energy:** Horizontal line above the parabolas.
- At any point x: KE + PE = Constant.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Damped Oscillations",
                content: `## Energy Loss

**Damping:** The removal of energy from an oscillating system, typically due to resistive forces (air resistance, friction).

### Types of Damping

1.  **Light Damping:**
    - Amplitude decreases exponentially with time.
    - Period T remains roughly constant.
    - Oscillations continue for many cycles.

2.  **Critical Damping:**
    - System returns to equilibrium in the **shortest possible time** without oscillating.
    - Essential for car suspension, shock absorbers.

3.  **Heavy (Over) Damping:**
    - System returns to equilibrium very slowly.
    - No oscillation occurs.
    - Example: Door closer mechanisms.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Resonance",
                content: `## Forced Oscillations

**Forced Oscillation:** When an external periodic driving force acts on a system.

- **Driving Frequency (f):** Frequency of the external force.
- **Natural Frequency (f₀):** Frequency at which the system oscillates freely.

### Resonance Condition
Occurs when: **Driving Frequency = Natural Frequency (f ≈ f₀)**

**Features at Resonance:**
1.  **Maximum Amplitude:** The transfer of energy from driver to system is most efficient.
2.  **Maximum Power Transfer:** Rate of energy input is max.
3.  **Phase Difference:** Driver is π/2 (90°) ahead of displacement.

### Effect of Damping on Resonance Curve
(Graph of Amplitude vs Driving Frequency)

- **Light Damping:** Sharp, high peak at f₀.
- **Heavy Damping:** Broader, lower peak. Peak shifts slightly to left of f₀.`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "SHM: a = -ω²x (acceleration ∝ displacement, opposite direction)",
            "Displacement: x = A cos(ωt) or x = A sin(ωt)",
            "Velocity: v = ±ω√(A² - x²); v_max = Aω at x = 0",
            "Acceleration: a_max = ω²A at x = ±A  ",
            "Total energy E = ½mω²A² = constant (proportional to A²)",
            "Mass-spring: T = 2π√(m/k); Pendulum: T = 2π√(L/g)",
            "Period independent of amplitude in SHM",
            "Damping: light (exponential decay), critical (fastest return), heavy (slow return)",
            "Resonance: maximum amplitude when f_driving = f_natural",
            "Damping reduces resonance amplitude and broadens peak"
        ],
        exam_tips: [
            "Check initial conditions to choose sin or cos for displacement",
            "v = 0 at maximum displacement; a = 0 at equilibrium",
            "For small angle pendulum, T doesn't depend on mass",
            "Energy ∝ A², so halving amplitude quarters energy",
            "At resonance, driving frequency matches natural frequency",
            "Draw clear graphs showing relationships between x, v, a vs t"
        ]
    },
    "Electric Fields": {
        topic: "Electric Fields",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/A%20level/A-Level__Electric_Fields.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvQSBsZXZlbC9BLUxldmVsX19FbGVjdHJpY19GaWVsZHMubXA0IiwiaWF0IjoxNzY4MTA1OTQ2LCJleHAiOjUyNjg2MDE5NDZ9.grNDogWm9X9HMDyZLfm1bX9BR6-WDAS1K5CFru2UsDk",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/A%20level/Electrostatics_Masterclass_Fields_Potential_Capacitance.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL0EgbGV2ZWwvRWxlY3Ryb3N0YXRpY3NfTWFzdGVyY2xhc3NfRmllbGRzX1BvdGVudGlhbF9DYXBhY2l0YW5jZS5tNGEiLCJpYXQiOjE3NjgwNzUxMjksImV4cCI6NTI2ODU3MTEyOX0.YwiS1MVDmM0SRR3PvmAEkoykAvV7YQZJFkBAyV8QWKM",
        subject: "A Level Physics",
        summary: "Electric fields describe how charged particles interact through electric forces. This topic covers Coulomb's law, electric field strength, electric potential, and motion of charges in electric fields.",
        sections: [
            {
                title: "1. Coulomb's Law",
                content: `## Forces Between Point Charges

**Coulomb's Law:** The electric force between two point charges is proportional to the product of their charges and inversely proportional to the square of their separation.

### Formula
**F = kQ₁Q₂/r²**

**F = Q₁Q₂ / (4πε₀r²)**

- **F:** Electric Force (N)
- **Q₁, Q₂:** Charges (C)
- **r:** Separation distance (m)
- **ε₀:** Permittivity of free space (8.85 × 10⁻¹² F m⁻¹)
- **k:** Coulomb constant (≈ 8.99 × 10⁹ N m² C⁻²)

### Key Features
- **Force Type:** Vector quantity (Force).
- **Direction:** Repulsive for like charges (++ or --), Attractive for unlike charges (+-).
- **Inverse Square Law:** If distance doubles, force reduces by factor of 4.

### Comparison with Gravitation
| Feature | Electric Field (Coulomb) | Gravitational Field (Newton) |
|---------|--------------------------|------------------------------|
| Formula | F = kQ₁Q₂/r² | F = (-GmM)/r² |
| Property | Charge (Q) | Mass (m) |
| Forces | Attractive OR Repulsive | Always Attractive |
| Constant | k (very large) | G (very small) |
| Medium | Depends on Permittivity | Independent of Medium |

**Note:** Electric forces are typically much stronger than gravitational forces on atomic scales.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Electric Field Strength",
                content: `## Defining the Field

**Definition:** The electric field strength (E) at a point is the force per unit positive charge acting on a small stationary test charge placed at that point.

**E = F/q**

- **E:** Electric Field Strength (N C⁻¹ or V m⁻¹)
- **F:** Force (N)
- **q:** Charge (C)
- **Vector Quantity:** Direction is the direction of force on a positive charge.

### Field Interactions

1.  **Radial Field (Point Charge):**
    - Generated by a single point charge Q.
    - **E = kQ/r²**
    - Field lines radiate outwards (+Q) or inwards (-Q).
    - Non-uniform field (E decreases as r² increases).

2.  **Uniform Field (Parallel Plates):**
    - Generated between two parallel charged plates.
    - **E = V/d** (or ΔV/Δd)
    - **V:** Potential difference between plates (V).
    - **d:** Separation distance (m).
    - Field strength is same everywhere between plates (except edges).
    - Field lines are parallel and equally spaced.

### Field Lines Rules
- Start on Positive, End on Negative.
- Cannot cross each other.
- Closer lines = Stronger field.
- Perpendicular to surface of conductor in equilibrium.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Electric Potential (V)",
                content: `## Energy in the Field

**Definition:** The electric potential (V) at a point is the work done per unit positive charge in bringing a small test charge from infinity to that point.

**V = W/Q**

- **V:** Electric Potential (Volts, V = J C⁻¹)
- **W:** Work Done (J)
- **Q:** Charge (C)
- **Scalar Quantity:** Can be positive (+) or negative (-) depending on the source charge.

### Potential of a Point Charge
**V = kQ/r**

- Graph of V vs r is proportional to 1/r.
- Potential is zero at infinity.
- Positive charge creates positive potential "hill".
- Negative charge creates negative potential "well".

### Potential Difference (p.d.)
The work done per unit charge moving between two points.
**ΔV = V₂ - V₁**

### Relation to Field Strength
Electric Field Strength is the negative potential gradient.

**E = -dV/dr**

- **Uniform Field:** E = ΔV/d
- Field lines point from **High Potential** to **Low Potential**.
- Steepest gradient = Strongest Field.

### Equipotentials
- Surfaces where potential is constant everywhere.
- No work is done moving a charge along an equipotential surface.
- Always perpendicular to Field Lines.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Motion of Charged Particles",
                content: `## Dynamics in Fields

Charged particles experience a force **F = qE** in an electric field.

### Acceleration
From Newton's Second Law (F=ma):
**a = F/m = qE/m**

### Motion in Uniform Field (Parallel Plates)
1.  **Parallel to Field:**
    - Constant acceleration.
    - Use SUVAT equations (v² = u² + 2as).
    - Gain/Loss of KE = Work Done = qΔV.

2.  **Perpendicular to Field (Parabolic Motion):**
    - Similar to Projectile Motion.
    - **Horizontal constant velocity:** No force component.
    - **Vertical constant acceleration:** Force qE acts vertically.
    - Resulting path is a parabola.

### The Electronvolt (eV)
**Definition:** The energy gained by an electron accelerating through a potential difference of 1 Volt.

**1 eV = 1.60 × 10⁻¹⁹ J**

**Conversion:**
- eV → J: Multiply by 1.60 × 10⁻¹⁹
- J → eV: Divide by 1.60 × 10⁻¹⁹

### Worked Example: Beams
An electron accelerates from rest through 2000V.
**Energy Gained = qV**
E = 1.60 × 10⁻¹⁹ × 2000 = 3.2 × 10⁻¹⁶ J

**Speed Calculation:**
½mv² = qV
v = √(2qV/m)
v = √(2 × 3.2 × 10⁻¹⁶ / 9.11 × 10⁻³¹)
v = **2.65 × 10⁷ m s⁻¹**`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Coulomb's law: F = kQ₁Q₂/r² where k = 8.99 × 10⁹ N m² C⁻²",
            "Like charges repel; unlike charges attract",
            "Field strength E = F/q (N C⁻¹ or V m⁻¹)",
            "Point charge field: E = kQ/r²",
            "Uniform field (parallel plates): E = V/d",
            "Potential V = W/Q; for point charge V = kQ/r",
            "E = -dV/dr (field = negative gradient of potential)",
            "Force on charge: F = qE",
            "Work done: W = qV = change in KE",
            "1 eV = 1.60 × 10⁻¹⁹ J"
        ],
        exam_tips: [
            "Keep track of signs for charges and potentials",
            "Field lines from + to -, perpendicular to equipotentials",
            "In uniform field, use E = V/d not kQ/r²",
            "For motion, resolve into parallel and perpendicular to field",
            "Check units: E in N C⁻¹ or V m⁻¹ (equivalent)",
            "Electron charge is NEGATIVE - affects direction of force"
        ]
    },
    "Capacitance": {
        topic: "Capacitance",
        subject: "A Level Physics",
        summary: "Capacitors store electrical energy by separating charges. This topic covers capacitance, parallel plate capacitors, energy storage, and the charging/discharging of capacitors through resistors.",
        sections: [
            {
                title: "1. Capacitance Basics",
                content: `## Storing Charge

**Capacitance (C):** The ability of a system to store electric charge per unit potential difference.

**C = Q/V**

- **C:** Capacitance (Farads, F = C V⁻¹)
- **Q:** Charge stored on one plate (C)
- **V:** Potential difference between plates (V)

**Units:**
- 1 Farad (F) is very large.
- Typical values: μF (10⁻⁶), nF (10⁻⁹), pF (10⁻¹²).

### Parallel Plate Capacitor
Consists of two parallel conductive plates separated by an insulator (dielectric).

**C = εA/d = ε₀εᵣA/d**

- **A:** Overlapping area of plates (m²).
- **d:** Separation distance (m).
- **ε₀:** Permittivity of free space (8.85 × 10⁻¹² F m⁻¹).
- **εᵣ:** Relative permittivity of dielectric (≥ 1).

**To Increase Capacitance:**
- Increase Area (A)
- Decrease Separation (d)
- Use dielectric with high εᵣ`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Energy Stored in a Capacitor",
                content: `## Electric Potential Energy

Work must be done to push electrons onto the negative plate against repulsion. This work is stored as potential energy.

### Equations
Since V changes as Q increases (V ∝ Q):

**W = ½QV**

Substituting Q=CV or V=Q/C:

**E = ½CV²**
**E = ½Q²/C**

- **E:** Energy stored (J)

### Graphical Interpretation
On a graph of **p.d. (V) against Charge (Q)**:
- Line is straight through origin (V ∝ Q).
- **Gradient** = 1/C.
- **Area under graph** = Work Done = Energy Stored = ½QV.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Capacitors in Circuits",
                content: `## Combination Rules

### Parallel Combination
- V is same across all capacitors.
- Total Charge Q = Q₁ + Q₂ + ...
- **C_total = C₁ + C₂ + C₃ + ...**
- (Note: Rule is opposite to resistors).

### Series Combination
- Charge Q is same on all capacitors.
- Total V = V₁ + V₂ + ...
- **1/C_total = 1/C₁ + 1/C₂ + 1/C₃ + ...**
- Total C is always less than the smallest individual C.

### Energy Distribution
- In series, high C has low V (since V=Q/C). Low C stores more energy? No, E = ½Q²/C, so small C stores MORE energy for same Q.
- In parallel, high C has same V. E = ½CV², so large C stores MORE energy.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Discharge of a Capacitor",
                content: `## Exponential Decay

When a capacitor discharges through a resistor R:
- Rate of flow of charge (Current I) depends on p.d.
- p.d. depends on charge remaining.
- Thus, rate of decay is proportional to amount remaining → Exponential.

### The Equations
**Q = Q₀ e^(-t/RC)**
**V = V₀ e^(-t/RC)**
**I = I₀ e^(-t/RC)**

- **t:** Time elapsed (s)
- **RC:** Time Constant (τ)

### Time Constant (τ)
**τ = RC** (Resistance × Capacitance)

- **Definition:** Time taken for Q (or V, I) to fall to **1/e (≈ 37%)** of its initial value.
- After 5τ, capacitor is considered fully discharged (< 1% remains).

### Graphical Analysis
- Plot ln(Q) vs t.
- Equation: ln(Q) = ln(Q₀) - t/RC.
- **Gradient = -1/RC.**
- **Y-intercept = ln(Q₀).**`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Capacitance C = Q/V; unit: farad (F)",
            "Parallel plate: C = ε₀εᵣA/d",
            "Parallel: C_total = C₁ + C₂ (add up)",
            "Series: 1/C_total = 1/C₁ + 1/C₂ (reciprocal sum)",
            "Energy stored: E = ½QV = ½CV² = ½Q²/C",
            "Time constant τ = RC",
            "Discharging: Q = Q₀e^(-t/RC)",
            "Charging: Q = Q₀(1 - e^(-t/RC))",
            "After 1τ: 63% charged or 37% remaining",
            "After 5τ: essentially fully charged/discharged"
        ],
        exam_tips: [
            "Capacitor rules are OPPOSITE to resistor rules",
            "Energy equation: use the form that matches given data",
            "τ = RC: check units work (Ω × F = s)",
            "For exponential decay, plot ln(Q) vs t for straight line",
            "At t = 0, capacitor acts like short circuit; at t = ∞, like open circuit",
            "For charging, current starts at maximum and decreases"
        ]
    },
    "Magnetic Fields": {
        topic: "Magnetic Fields",
        subject: "A Level Physics",
        summary: "Magnetic fields arise from moving charges and currents. This topic covers magnetic flux density, forces on conductors and moving charges, electromagnetic induction, and transformers.",
        sections: [
            {
                title: "1. Magnetic Fields and Flux",
                content: `## The Magnetic Field

**Magnetic Flux Density (B):** The force acting per unit current per unit length on a wire placed at right angles to the magnetic field.
**Unit:** Tesla (T) = N A⁻¹ m⁻¹

### Magnetic Flux (Φ)
**Φ = BA cos(θ)**

- **Φ:** Magnetic Flux (Weber, Wb)
- **B:** Magnetic Flux Density (T)
- **A:** Area (m²)
- **θ:** Angle between field lines and the **normal** to the area.
- If field is perpendicular to area, θ=0 and Φ=BA.

### Flux Linkage
For a coil with N turns:
**Flux Linkage = NΦ = BAN cos(θ)**
**Unit:** Weber-turns (Wb-turns) or just Webers (Wb).`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Forces on Charges and Conductors",
                content: `## The Motor Effect

### Force on a Current-Carrying Conductor
**F = BIL sin(θ)**

- **F:** Magnetic Force (N)
- **B:** Magnetic Flux Density (T)
- **I:** Current (A)
- **L:** Length of conductor in field (m)
- **θ:** Angle between current and field lines.
- **Direction:** Fleming's Left-Hand Rule (Thumb=Force, First=Field, Second=Current).

### Force on a Moving Charge
**F = Bqv sin(θ)**

- **q:** Charge (C)
- **v:** Velocity (m s⁻¹)
- **θ:** Angle between velocity and field.

**Circular Motion:**
If v is perpendicular to B, force is always perpendicular to velocity → Centripetal Force.
**Bqv = mv²/r**
**r = mv/Bq**
- Used in cyclotrons and mass spectrometers.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Electromagnetic Induction",
                content: `## Generating Electricity

**Electromagnetic Induction:** The production of an electromotive force (EMF) across an electrical conductor in a changing magnetic field.

### Faraday's Law
The magnitude of the induced EMF is directly proportional to the rate of change of magnetic flux linkage.

**ε = Δ(NΦ) / Δt** (Ignoring sign)

### Lenz's Law
The direction of the induced EMF (or current) is such that it sets up a magnetic field to oppose the change of magnetic flux that produced it.

**ε = - Δ(NΦ) / Δt** (Including sign)
- This is a consequence of Conservation of Energy.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Transformers",
                content: `## Changing A.C. Voltages

**Step-Up:** Increases Voltage (keeps Power constant).
**Step-Down:** Decreases Voltage.

### Transformer Equation
For an ideal transformer (100% efficiency):

**Vₛ / Vₚ = nₛ / nₚ = Iₚ / Iₛ**

- **V:** Voltage (V)
- **n:** Number of turns on coil
- **I:** Current (A)
- p = primary, s = secondary

### Efficiency and Losses
Real transformers are not 100% efficient due to:
1.  **Resistance of windings:** Power lost as heat (I²R). Minimized by thick copper wire.
2.  **Eddy Currents:** Inducted currents in iron core cause heating. Minimized by laminating the core.
3.  **Hysteresis:** Energy lost magnetizing/demagnetizing core. Minimized by using soft iron.
4.  **Flux Leakage:** Not all flux from primary links secondary. Minimized by good core design.`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Magnetic flux density B: unit tesla (T)",
            "Magnetic flux Φ = BA cos θ; unit weber (Wb)",
            "Force on conductor: F = BIL sin θ",
            "Fleming's Left-Hand Rule: First = Field, seCond = Current, thuMb = Motion",
            "Force on moving charge: F = Bqv sin θ",
            "Circular motion: r = mv/(Bq)",
            "Faraday's Law: ε = -N dΦ/dt",
            "Lenz's Law: induced EMF opposes the change causing it",
            "Transformer: Vₛ/Vₚ = Nₛ/Nₚ",
            "Eddy current losses reduced by laminated core"
        ],
        exam_tips: [
            "Use Fleming's LEFT hand for motor effect, RIGHT for generator",
            "For force on wire, θ is angle between I and B",
            "Lenz's Law is about conservation of energy",
            "Transformers only work with AC (need changing flux)",
            "Power transmission: step up to reduce I, therefore reduce I²R losses",
            "Flux linkage = N × Φ (include number of turns)"
        ]
    },
    "Alternating Currents": {
        topic: "Alternating Currents",
        subject: "A Level Physics",
        summary: "Alternating current (AC) varies sinusoidally with time. This topic covers the properties of AC, RMS values, power in AC circuits, and rectification.",
        sections: [
            {
                title: "1. Properties of AC",
                content: `## Sinusoidal Variation

**Alternating Current (AC):** A current that periodically reverses its direction and changes its magnitude continuously with time.

**Equations:**
**I = I₀ sin(ωt)**
**V = V₀ sin(ωt)**

- **I₀, V₀:** Peak values (Amplitude).
- **ω:** Angular frequency (rad s⁻¹) = 2πf.
- **f:** Frequency (Hz).
- **t:** Time (s).

### Period and Frequency
- **Period (T):** Time for one complete cycle.
- **Frequency (f):** Number of cycles per second.
- **f = 1/T**

### Mains Electricity (UK)
- **Frequency:** 50 Hz
- **Peak Voltage:** ≈ 325 V
- **RMS Voltage:** 230 V`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. RMS Values",
                content: `## Root Mean Square (RMS)

**Definition:** The RMS value of an AC current is the value of the steady Direct Current (DC) that would dissipate heat at the same average rate in a given resistor.

### Formulas
**I_rms = I₀ / √2 ≈ 0.707 I₀**
**V_rms = V₀ / √2 ≈ 0.707 V₀**

**Note:** These formulas only apply to **sinusoidal** waveforms.

### Why Use RMS?
- It allows fair comparison between AC and DC power.
- "230V AC" means 230V RMS, so it provides the same power as a 230V battery.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Power in AC Circuits",
                content: `## Calculating Power

### Average Power (Resistive Load)
Power varies with time (sinusoidal squared). We are interested in the **average** power.

**P_avg = I_rms × V_rms**

Using Peak Values:
**P_avg = (I₀/√2) × (V₀/√2) = ½ I₀V₀**

### Derivation
Instantaneous Power **p = iv = I₀V₀ sin²(ωt)**.
The average value of sin²(ωt) over a cycle is **½**.
Therefore, P_avg = ½ I₀V₀.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Rectification",
                content: `## AC to DC Conversion

**Rectification:** The process of converting AC to DC.

### Half-Wave Rectification
- Uses **one diode**.
- Only allows current to flow during the positive half-cycle.
- Negative half blocked (Reverse Bias).
- Output: Pulses of DC (0V during negative half).
- **V_rms** is significantly reduced.

### Full-Wave Rectification (Bridge Rectifier)
- Uses **four diodes** arranged in a diamond bridge.
- Allows current to flow through load in the **same direction** during BOTH half-cycles.
- Output: Pulses of DC (no gaps).
- **V_rms** is higher than half-wave.
- Frequency of output ripple is **2f**.

### Smoothing
- A **capacitor** is placed in parallel with the load resistor.
- Capacitor charges up to peak voltage.
- Discharges slowly through the resistor when rectified voltage drops.
- Result: A steady DC voltage with a small "ripple".
- **Larger C × R (Time Constant) → Less Ripple → Smoother DC.**`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "AC varies sinusoidally: I = I₀ sin(ωt)",
            "RMS values give equivalent DC heating effect",
            "I_rms = I₀/√2; V_rms = V₀/√2",
            "UK mains: 230 V RMS, 50 Hz, peak 325 V",
            "Power: P = I_rms V_rms (for resistive load)",
            "Half-wave rectification: single diode, uses half the power",
            "Full-wave rectification: bridge of 4 diodes, uses both halves",
            "Smoothing capacitor reduces ripple voltage",
            "Larger C and R give smoother output"
        ],
        exam_tips: [
            "Meters show RMS values, not peak values",
            "To find peak from RMS: multiply by √2",
            "Power in AC uses RMS values, not peak",
            "Full-wave output has DOUBLE the frequency of input",
            "Describe both bridge rectifier structure and smoothing",
            "Ripple depends on C, R, and frequency"
        ]
    },
    "Quantum Physics": {
        topic: "Quantum Physics",
        subject: "A Level Physics",
        summary: "Quantum physics reveals that light and matter have both wave and particle properties. This topic covers photons, the photoelectric effect, wave-particle duality, and energy levels in atoms.",
        sections: [
            {
                title: "1. Photons",
                content: `## The Particle Nature of Light

**Photon:** A discrete packet (quantum) of electromagnetic energy.

### Photon Energy
**E = hf = hc/λ**

- **E:** Energy (J)
- **h:** Planck's Constant (6.63 × 10⁻³⁴ J s)
- **f:** Frequency (Hz)
- **c:** Speed of light (3.00 × 10⁸ m s⁻¹)
- **λ:** Wavelength (m)

### Photon Momentum
Although massless, photons have momentum:
**p = E/c = h/λ**

### The Electronvolt (eV)
Energy gained by an electron accelerating through 1 Volt.
**1 eV = 1.60 × 10⁻¹⁹ J**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. The Photoelectric Effect",
                content: `## Evidence for Particulate Nature

**Definition:** The emission of electrons from a metal surface when electromagnetic radiation of high enough frequency is incident upon it.

### Key Observations (Unexplained by Wave Theory)
1.  **Threshold Frequency (f₀):** Below a certain frequency, NO electrons are emitted, regardless of intensity.
2.  **Instantaneous Emission:** No time delay for energy buildup.
3.  **Max KE:** Depends on frequency, not intensity.

### Einstein's Photoelectric Equation
**hf = φ + KE_max**

- **hf:** Energy of incident photon.
- **φ (Phi):** Work Function (Minimum energy required to escape surface).
- **KE_max:** Maximum kinetic energy of emitted electron.

**Stopping Potential (V_s):**
The minimum negative potential needed to stop the fastest electrons.
**KE_max = eV_s**
So: **hf = φ + eV_s**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Wave-Particle Duality",
                content: `## De Broglie Hypothesis

Matter (like electrons) can behave as waves.

### De Broglie Wavelength
**λ = h / p = h / mv**

- **λ:** Associated wavelength (m)
- **p:** Momentum (kg m s⁻¹)
- **m:** Mass (kg)
- **v:** Velocity (m s⁻¹)

**Significance:**
- Wave properties (diffraction) are observable only when the gap size is comparable to λ.
- For everyday objects, λ is negligible.
- For electrons, λ ≈ atomic spacing, so electron diffraction occurs in crystals.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Energy Levels and Spectra",
                content: `## Quantised Energy

Electrons in atoms can only exist in discrete energy levels.

### Transitions
1.  **Excitation (Absorption):** Electron absorbs a photon of exact energy difference and moves to a higher level.
    **hf = E₂ - E₁**
2.  **De-excitation (Emission):** Electron falls to a lower level, emitting a photon of exact energy difference.
    **hf = E₂ - E₁**

### Line Spectra
- **Emission Spectra:** Bright colored lines on a black background. Evidence of discrete energy levels.
- **Absorption Spectra:** Dark lines on a continuous spectrum.

**Calculation Example:**
Transition from -1.5eV to -3.4eV.
ΔE = -1.5 - (-3.4) = 1.9 eV.
Energy in Joules = 1.9 × 1.60×10⁻¹⁹ = 3.04×10⁻¹⁹ J.
Frequency f = E/h = 3.04×10⁻¹⁹ / 6.63×10⁻³⁴ = 4.59×10¹⁴ Hz.`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Photon energy: E = hf = hc/λ",
            "h = 6.63 × 10⁻³⁴ J s (Planck's constant)",
            "Photoelectric effect: hf = φ + KE_max",
            "Work function φ = hf₀ (threshold frequency)",
            "No emission below threshold frequency regardless of intensity",
            "De Broglie wavelength: λ = h/p = h/mv",
            "Electron diffraction proves wave nature of particles",
            "Energy levels in atoms are quantised (discrete)",
            "ΔE = hf for transitions between levels",
            "Hydrogen energy levels: Eₙ = -13.6/n² eV"
        ],
        exam_tips: [
            "Convert energy units: 1 eV = 1.60 × 10⁻¹⁹ J",
            "Photoelectric effect proves particle nature of light",
            "Electron diffraction proves wave nature of electrons",
            "For energy level diagrams, more negative = lower = more stable",
            "Threshold frequency means lower frequencies don't work, ever",
            "Line spectra → unique to each element (fingerprint)"
        ]
    },
    "Nuclear Physics": {
        topic: "Nuclear Physics",
        subject: "A Level Physics",
        summary: "Nuclear physics explores the structure and properties of atomic nuclei, including radioactive decay, nuclear reactions, and nuclear energy. This topic covers nuclear structure, radioactivity, decay equations, fission, and fusion.",
        sections: [
            {
                title: "1. Nuclear Structure",
                content: `## Inside the Nucleus

**Nucleon:** A particle within the nucleus (proton or neutron).
**Nuclide:** A specific species of nucleus characterised by its proton number Z and nucleon number A.

**Notation:**
**ᴬ_Z X**
- **A:** Nucleon Number (Mass Number) = Z + N.
- **Z:** Proton Number (Atomic Number).
- **N:** Neutron Number.

### Isotopes
Nuclei of the same element (same Z) with different numbers of neutrons (different N and A).
- Same chemical properties (determined by electrons).
- Different physical properties (mass, stability).

### Nuclear Radius and Density
Experimental evidence (electron diffraction) shows:
**R = R₀ A^(1/3)**

- **R:** Nuclear Radius (m).
- **R₀:** Fermi Constant (≈ 1.2 fm = 1.2 × 10⁻¹⁵ m).
- **A:** Nucleon Number.

**Conclusion:**
Since Volume V ∝ R³ ∝ A, and Mass M ∝ A.
**Density ρ = M/V = Constant.**
Nuclear matter has constant density regardless of size (~10¹⁷ kg m⁻³).`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Radioactivity",
                content: `## Unstable Nuclei

Random and spontaneous disintegration of an unstable nucleus to form a more stable one, emitting particles or radiation.

### Types of Decay

1.  **Alpha (α):** Helium nucleus (⁴₂He).
    - Highly ionizing, low penetration (paper).
    - **ᴬ_Z X → ᴬ⁻⁴_Z-₂ Y + ⁴₂He**

2.  **Beta-Minus (β⁻):** Electron (⁰₋₁e).
    - Neutron turns into proton.
    - Medium ionizing/penetration (Aluminum).
    - **ᴬ_Z X → ᴬ_Z+₁ Y + ⁰₋₁e + ̅νₑ** (Antineutrino emitted).

3.  **Beta-Plus (β⁺):** Positron (⁰₊₁e).
    - Proton turns into neutron.
    - **ᴬ_Z X → ᴬ_Z-₁ Y + ⁰₊₁e + νₑ** (Neutrino emitted).

4.  **Gamma (γ):** High energy photon.
    - Low ionizing, high penetration (Lead/Concrete).
    - No change in A or Z, just energy loss.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Radioactive Decay Law",
                content: `## Exponential Decay

The rate of decay is proportional to the number of undecayed nuclei remaining.

**Activity (A):** The number of decays per unit time. Unit: Becquerel (Bq).
**A = -dN/dt = λN**

- **λ (Lambda):** Decay Constant (probability of decay per unit time, s⁻¹).
- **N:** Number of undecayed nuclei.

### Decay Equation
**N = N₀ e^(-λt)**
**A = A₀ e^(-λt)**

### Half-Life (T₁/₂)
The average time taken for the number of undecayed nuclei (or activity) to halve.

**T₁/₂ = ln(2) / λ ≈ 0.693 / λ**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Mass-Energy and Binding Energy",
                content: `## E = mc²

**Mass Defect (Δm):** The difference between the mass of a nucleus and the sum of the masses of its constituent nucleons.
**Δm = (Z m_p + N m_n) - M_nucleus**

**Binding Energy (BE):** The energy required to separate a nucleus into its constituent nucleons (or energy released when nucleus forms).
**BE = Δm c²**

### BE per Nucleon Curve
A graph of **BE/A** vs **Nucleon Number (A)**.
- **Max:** Iron-56 (most stable).
- **Fusion:** Light nuclei (low A) join to increase BE/A.
- **Fission:** Heavy nuclei (high A) split to increase BE/A.
- Energy released is the difference in total Binding Energy.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Fission and Fusion",
                content: `## Nuclear Reactions

### Induced Fission
A heavy nucleus (e.g., Uranium-235) absorbs a slow (thermal) neutron, becomes unstable, and splits into two lighter daughter nuclei and 2-3 fast neutrons.
**²³⁵U + ¹n → ⁹²Kr + ¹⁴¹Ba + 3 ¹n + Energy**
- **Chain Reaction:** Neutrons released can trigger further fissions.
- **Control Rods:** Absorb neutrons to control rate (Boron/Cadmium).
- **Moderator:** Slows down fast neutrons to thermal speeds for absorption (Graphite/Water).

### Nuclear Fusion
Two light nuclei join to form a heavier nucleus.
**²H + ³H → ⁴He + ¹n + Energy**
- Releases more energy per kg than fission.
- Requires extremely high temperatures (plasma) to overcome electrostatic repulsion between positive nuclei.
- Power source of stars.`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Nuclear notation: ᴬ_Z X (A = mass number, Z = atomic number)",
            "Nuclear radius: r = r₀A^(1/3) where r₀ ≈ 1.2 fm",
            "Alpha: helium nucleus, short range, highly ionising",
            "Beta-minus: electron + antineutrino; Beta-plus: positron + neutrino",
            "Gamma: high-energy photon, penetrating, least ionising",
            "Decay law: N = N₀e^(-λt); Half-life: t₁/₂ = ln2/λ",
            "Activity A = λN (unit: becquerel, Bq)",
            "Mass-energy: E = mc²; Binding energy = Δmc²",
            "BE per nucleon peaks at iron-56 (most stable)",
            "Fission: heavy → lighter + energy; Fusion: light → heavier + energy"
        ],
        exam_tips: [
            "Balance both mass number AND atomic number in equations",
            "Half-life: after n half-lives, 1/2ⁿ remains",
            "Know properties of α, β, γ (ionising power, range, stopping material)",
            "Binding energy graph: fusion left of Fe, fission right of Fe",
            "Convert units carefully: u, MeV, J, kg",
            "For decay graphs, plot ln(A) vs t for straight line with gradient -λ"
        ]
    },
    "Astronomy and Cosmology": {
        topic: "Astronomy and Cosmology",
        subject: "A Level Physics",
        summary: "Astronomy and cosmology explore the universe from stars to galaxies and the Big Bang. This topic covers stellar evolution, the Hertzsprung-Russell diagram, Hubble's law, and the expanding universe.",
        sections: [
            {
                title: "1. Stars and Stellar Evolution",
                content: `## The Life Cycle of Stars

### Star Formation

1. **Nebula:** Cloud of gas and dust collapses under gravity
2. **Protostar:** Core heats up by gravitational compression
3. **Main sequence:** Hydrogen fusion begins in core

### Main Sequence

Stars spend most of their lives here, fusing H → He.

**Equilibrium:** Radiation pressure out = gravitational collapse in

**Mass determines:**
- Luminosity (L ∝ M³·⁵)
- Lifetime (τ ∝ M/L ∝ M⁻²·⁵)
- End state

### After Main Sequence

**Low/medium mass (like Sun):**
→ Red giant → Planetary nebula → White dwarf

**High mass:**
→ Red supergiant → Supernova → Neutron star or Black hole

### Chandrasekhar Limit

Maximum mass for white dwarf: **~1.4 M_Sun**

Above this, electron degeneracy pressure cannot support the star.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Hertzsprung-Russell Diagram",
                content: `## Classifying Stars

The H-R diagram plots:
- **Luminosity** (y-axis, log scale)
- **Temperature** (x-axis, DECREASING left to right)

### Main Features

**Main sequence:** Diagonal band from top-left to bottom-right
- Hot, bright stars at top-left
- Cool, dim stars at bottom-right

**Red giants:** Upper right (cool but bright → large)

**White dwarfs:** Lower left (hot but dim → small)

**Supergiants:** Top of diagram (very luminous)

### Stefan-Boltzmann Law

**L = 4πr²σT⁴**

- L = luminosity (W)
- r = stellar radius (m)
- σ = 5.67 × 10⁻⁸ W m⁻² K⁻⁴
- T = surface temperature (K)

### Wien's Law

**λ_max T = 2.9 × 10⁻³ m K**

Peak wavelength shifts with temperature:
- Hot stars: blue (short λ)
- Cool stars: red (long λ)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Distance Measurement",
                content: `## Measuring Cosmic Distances

### Stellar Parallax

**d = 1/p**

- d = distance in parsecs (pc)
- p = parallax angle in arcseconds

**1 parsec = 3.26 light years = 3.09 × 10¹⁶ m**

Limited to nearby stars (~few hundred pc).

### Standard Candles

Objects of known luminosity used to find distance.

**Types:**
- Cepheid variables (pulsating stars)
- Type Ia supernovae

### Luminosity and Apparent Brightness

**Apparent brightness:** b = L/(4πd²)

**Inverse square law:** observed brightness decreases with distance squared.

### Worked Example

A star has parallax 0.04 arcsec. Find its distance.

d = 1/p = 1/0.04 = **25 pc** = 25 × 3.26 = **81.5 light years**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Hubble's Law and the Expanding Universe",
                content: `## Evidence for Expansion

### Redshift

Light from distant galaxies is shifted toward red (longer wavelengths).

**z = Δλ/λ = v/c** (for v << c)

### Hubble's Law

**v = H₀d**

- v = recession velocity (km s⁻¹)
- H₀ = Hubble constant ≈ 70 km s⁻¹ Mpc⁻¹
- d = distance (Mpc)

### Interpretation

- Galaxies are moving away from us
- Further galaxies move faster
- Universe is expanding
- Not galaxies moving THROUGH space, but space itself expanding

### Age of Universe

**t ≈ 1/H₀**

Using H₀ ≈ 70 km s⁻¹ Mpc⁻¹:
t ≈ 14 billion years`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. The Big Bang and Cosmology",
                content: `## The Origin of the Universe

### Evidence for the Big Bang

**1. Cosmic Microwave Background (CMB):**
- Uniform radiation at T ≈ 2.7 K
- "Afterglow" of the Big Bang
- Discovered 1965 by Penzias and Wilson

**2. Hubble's Law:**
- Universe is expanding
- Trace back → all matter was at one point

**3. Abundance of light elements:**
- Hydrogen and helium ratios match predictions
- Formed in first few minutes after Big Bang

### The Early Universe

- t = 0: Singularity
- t = 10⁻⁴³ s: Planck era (quantum gravity)
- t = 10⁻⁶ s: Quarks combine to form protons/neutrons
- t = 3 min: Nucleosynthesis (H, He nuclei form)
- t = 380,000 years: CMB released (universe becomes transparent)

### Current Questions

- What is dark matter?
- What is dark energy?
- Will universe expand forever?`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Stars form from nebulae; main sequence = H fusion equilibrium",
            "Star lifetime: τ ∝ M⁻²·⁵ (massive stars die faster)",
            "End states: white dwarf (< 1.4 M_Sun), neutron star, black hole",
            "H-R diagram: temperature (x, decreasing) vs luminosity (y, increasing)",
            "Stefan-Boltzmann: L = 4πr²σT⁴",
            "Wien's Law: λ_max T = 2.9 × 10⁻³ m K",
            "Parallax: d = 1/p (d in pc, p in arcsec)",
            "Hubble's Law: v = H₀d; universe is expanding",
            "Age of universe: t ≈ 1/H₀ ≈ 14 billion years",
            "Big Bang evidence: CMB, redshift, element abundances"
        ],
        exam_tips: [
            "H-R diagram: temperature DECREASES left to right",
            "Red giants are cool but bright → must be large",
            "White dwarfs are hot but dim → must be small",
            "Parallax only works for nearby stars",
            "Redshift z > 0 means moving away; blue shift = approaching",
            "Know the three pieces of evidence for the Big Bang"
        ]
    },
    "Electric Fields": {
        topic: "Electric Fields",
        subject: "A Level Physics",
        summary: "The study of electric fields is a cornerstone of A-Level Physics, providing foundational principles for understanding interactions between charged particles. This topic covers Coulomb's Law, electric field strength, superposition of fields, electric potential, uniform electric fields, capacitance and energy storage, electric field lines, and experimental investigation. Understanding electric fields is essential for grasping everything from atomic structure to electronic devices.",
        sections: [
            {
                title: "1. Introduction to Electric Fields",
                content: `## Understanding Electric Fields

An **Electric Field** is formally defined as a region of space where a stationary electric charge experiences a force. Just as mass creates a gravitational field, an electric charge creates an electric field that extends outward into the space surrounding it.

### Visualising Electric Fields

We can visualise these invisible fields using **electric field lines**:
- The **direction** of lines indicates the direction of force on a positive test charge
- The **density** of lines (how close they are) represents field strength
- Closer lines = stronger field

### Types of Electric Fields

| Field Type | Configuration | Characteristics |
|------------|---------------|-----------------|
| Radial Field | Point charge or charged sphere | Field strength ∝ 1/r² |
| Uniform Field | Parallel plates | Constant field strength |

### Two Perspectives on Electric Fields

**1. Force Perspective (Vector)**
- Electric field strength E = F/q
- Tells us about forces acting on charges

**2. Energy Perspective (Scalar)**
- Electric potential V = W/Q
- Provides an "energy map" of space around charges

### Analogy with Gravitational Fields

| Gravitational | Electric |
|---------------|----------|
| Mass creates field | Charge creates field |
| g = F/m | E = F/q |
| Φ = -GM/r | V = Q/(4πε₀r) |
| Always attractive | Can be attractive or repulsive |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Coulomb's Law",
                content: `## The Foundation of Electrostatics

**Coulomb's Law** provides a precise way to calculate the magnitude of the electrostatic force between two stationary point charges.

### The Law Statement

The force between two point charges is:
- **Proportional** to the product of the charges
- **Inversely proportional** to the square of the distance between them

### The Formula

**F = Qq / (4πε₀r²)**

Or equivalently: **F = kQq/r²** where k = 1/(4πε₀) = 8.99 × 10⁹ N m² C⁻²

### Variables Explained

| Symbol | Quantity | Unit |
|--------|----------|------|
| F | Electrostatic force | N |
| Q, q | Point charges | C |
| r | Separation between charge centres | m |
| ε₀ | Permittivity of free space | 8.85 × 10⁻¹² F m⁻¹ |

### Key Points

1. **Vector quantity**: Force acts along the line connecting the charges
2. **Repulsive** if charges have same sign (both + or both -)
3. **Attractive** if charges have opposite signs
4. **Common mistakes**:
   - Forgetting to square r
   - Using cm instead of m
   - Forgetting the sign indicates direction

### Multiple Charges

For systems with more than two charges, the **net force** on any charge is the **vector sum** of individual forces from all other charges.

---

## Worked Example: Calculating Electrostatic Force

**Question:** Two point charges, Q₁ = +2.0 nC and Q₂ = -5.0 nC, are separated by 4.0 cm in a vacuum. Calculate the magnitude of the force.

**Solution:**

**Step 1: Convert units**
- Q₁ = +2.0 × 10⁻⁹ C
- Q₂ = -5.0 × 10⁻⁹ C  
- r = 0.040 m

**Step 2: Apply Coulomb's Law**
F = (Q₁ × Q₂)/(4πε₀r²)
F = (2.0 × 10⁻⁹ × 5.0 × 10⁻⁹)/(4π × 8.85 × 10⁻¹² × 0.040²)
F = (1.0 × 10⁻¹⁷)/(1.77 × 10⁻¹³)
**F = 5.6 × 10⁻⁵ N**

Since charges have opposite signs, this is an **attractive force**.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Electric Field Strength (E)",
                content: `## Quantifying Field Intensity

**Electric field strength (E)** is a vector quantity that quantifies the intensity of an electric field at a specific point.

### Definition

Electric field strength is defined as the **force per unit positive charge** acting on a small stationary positive test charge at that point.

### The Formula

**E = F/q**

### Derived Formula for Point Charge

Combining with Coulomb's Law (F = Qq/4πε₀r²):

**E = Q/(4πε₀r²)**

Or: **E = kQ/r²**

### Units of E

From E = F/q:
- **N C⁻¹** (newtons per coulomb)

From V = Ed (uniform field):
- **V m⁻¹** (volts per metre)

These are equivalent units!

### Direction of E

- For a **positive** source charge: E points **away** from the charge
- For a **negative** source charge: E points **toward** the charge

### Field Strength Comparison

| Distance | Field Strength |
|----------|----------------|
| r | E |
| 2r | E/4 |
| 3r | E/9 |
| r/2 | 4E |

The inverse square relationship means field strength drops rapidly with distance.

### Key Point

The test charge must be:
1. **Small** - so it doesn't disturb the field
2. **Positive** - by convention, for direction
3. **Stationary** - to avoid magnetic effects`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Superposition of Electric Fields",
                content: `## Combining Multiple Fields

The **Principle of Superposition** states that the net effect of multiple sources is the sum of their individual effects.

### Application to Electric Fields

The net electric field strength at any point is the **vector sum** of the fields created by each individual source charge:

**E_net = E₁ + E₂ + E₃ + ...**

### Vector Addition Method

1. Calculate the field from each charge at the point
2. Determine the direction of each field
3. Resolve each field into x and y components
4. Sum the components: E_x = E₁ₓ + E₂ₓ + ...
5. Find resultant: E_net = √(E_x² + E_y²)
6. Find direction: θ = tan⁻¹(E_y/E_x)

---

## Worked Example: Superposition of Fields

**Question:** Two charges, Q₁ = +3.0 nC at (0, 3.0 cm) and Q₂ = -4.0 nC at (4.0 cm, 0), exist in space. Find the resultant field at the origin P(0,0).

**Solution:**

**Step 1: Calculate E₁ due to Q₁**
- Distance r₁ = 0.030 m
- E₁ = Q₁/(4πε₀r₁²) = (3.0 × 10⁻⁹)/(4π × 8.85 × 10⁻¹² × 0.030²)
- E₁ = 3.0 × 10⁴ N C⁻¹
- Direction: **Away from Q₁** (positive charge) = **negative y-direction**

**Step 2: Calculate E₂ due to Q₂**
- Distance r₂ = 0.040 m
- E₂ = |Q₂|/(4πε₀r₂²) = (4.0 × 10⁻⁹)/(4π × 8.85 × 10⁻¹² × 0.040²)
- E₂ = 2.25 × 10⁴ N C⁻¹
- Direction: **Toward Q₂** (negative charge) = **positive x-direction**

**Step 3: Vector Sum**
The fields are perpendicular (E₁ vertical, E₂ horizontal):

E_net = √(E₁² + E₂²) = √((3.0 × 10⁴)² + (2.25 × 10⁴)²)
E_net = √(1.404 × 10⁹) = **3.7 × 10⁴ N C⁻¹**

**Step 4: Direction**
θ = tan⁻¹(E₁/E₂) = tan⁻¹(3.0/2.25) = **53° below positive x-axis**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Electric Potential (V)",
                content: `## The Energy Perspective

While electric field strength tells us about forces, **electric potential** provides an "energy map" of space around charges.

### Definition

**Electric Potential (V)** at a point is the work done per unit positive charge in bringing a small test charge from infinity to that point.

### The Formula

**V = W/Q**

### Potential Due to a Point Charge

**V = Q/(4πε₀r)**

Or: **V = kQ/r**

### Key Properties

| Property | Description |
|----------|-------------|
| Type | Scalar quantity |
| Unit | Volt (V) = J/C |
| At infinity | V = 0 (reference point) |
| Positive charge | Creates positive potential |
| Negative charge | Creates negative potential |

### Superposition of Potentials

Since potential is a scalar, potentials simply add algebraically:

**V_total = V₁ + V₂ + V₃ + ...**

No vector addition needed!

### Electric Potential Energy

The potential energy of a system of two charges Q and q separated by distance r:

**Eₚ = Qq/(4πε₀r)**

This represents the work done to bring the charges from infinite separation to distance r.

### Relationship: Field and Potential

Electric field strength equals the **negative of the potential gradient**:

**E = -dV/dr**

- E points in direction of decreasing potential
- Field lines are perpendicular to equipotentials
- Closer equipotentials = stronger field

### Equipotential Lines

- Lines of constant potential
- No work done moving along an equipotential
- Always perpendicular to field lines
- For point charge: concentric circles`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Uniform Electric Fields",
                content: `## Fields Between Parallel Plates

A **uniform electric field** has the same magnitude and direction at all points. It is created between two large, parallel conducting plates with equal and opposite charges.

### Properties of Uniform Fields

| Property | Value |
|----------|-------|
| Field strength | Constant everywhere |
| Field lines | Parallel, equally spaced |
| Direction | Positive plate → Negative plate |
| E = | V/d |

### Electric Field Formula

**E = V/d**

Where:
- V = potential difference between plates (V)
- d = separation between plates (m)

### Force on a Charge

The force on a charge q in a uniform field E is constant:

**F = qE**

### Motion of Charged Particles

A charge in a uniform field experiences **constant acceleration**:

**a = F/m = qE/m**

This leads to **parabolic motion** (like projectiles under gravity).

### Horizontal Entry Analysis

For a charge entering perpendicular to the field:

**Horizontal motion** (constant velocity):
- vₓ = constant
- x = vₓt

**Vertical motion** (constant acceleration):
- aᵧ = qE/m
- sᵧ = ½aᵧt²

---

## Worked Example: Motion in Uniform Field

**Question:** An electron enters a uniform field of 200 N C⁻¹ (directed downward) at 3.0 × 10⁶ m s⁻¹ horizontally. The plates are 5.0 cm long. Find the vertical displacement.

**Given:** mₑ = 9.11 × 10⁻³¹ kg, e = 1.60 × 10⁻¹⁹ C

**Solution:**

**Step 1: Time of flight**
t = distance/horizontal velocity = 0.050/(3.0 × 10⁶) = 1.67 × 10⁻⁸ s

**Step 2: Vertical acceleration**
- Force: F = qE = 1.60 × 10⁻¹⁹ × 200 = 3.20 × 10⁻¹⁷ N
- The electron has **negative** charge, so force is **opposite** to field direction (upward)
- a = F/m = 3.20 × 10⁻¹⁷ / 9.11 × 10⁻³¹ = 3.51 × 10¹³ m s⁻²

**Step 3: Vertical displacement**
s = ½at² = ½ × 3.51 × 10¹³ × (1.67 × 10⁻⁸)²
s = **4.9 mm**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Capacitance and Energy Stored",
                content: `## Storing Charge and Energy

**Capacitance** measures a component's ability to store electric charge and potential energy. Capacitors are fundamental in electronic circuits.

### Definition of Capacitance

**Capacitance (C)** is the ratio of charge stored on one plate to the potential difference between the plates:

**C = Q/V**

### Units

| Quantity | Unit | Symbol |
|----------|------|--------|
| Capacitance | farad | F |
| Common values | microfarad, nanofarad, picofarad | μF, nF, pF |

1 F = 1 C/V (one farad is very large!)

### Parallel Plate Capacitor

For a capacitor with:
- Plate area A
- Separation d
- Dielectric with relative permittivity εᵣ

**C = ε₀εᵣA/d**

For air/vacuum (εᵣ ≈ 1):

**C = ε₀A/d**

### Effect of Dielectric

The dielectric material becomes polarized, creating an opposing field that:
- Reduces potential difference for same charge
- Increases capacitance (C = Q/V)
- Allows more charge storage

### Energy Stored in a Capacitor

A charged capacitor stores electrical potential energy in the electric field between its plates:

**W = ½QV = ½CV² = ½Q²/C**

### How Energy is Stored

- Work is done to move charge against the electric field
- This work is stored as potential energy
- Energy can be released when capacitor discharges

---

## Worked Example: Capacitor Calculation

**Question:** A parallel plate capacitor has plates of area 150 cm², separated by 0.50 mm of air. Calculate:
(a) the capacitance
(b) the energy stored when charged to 12 V

**Solution:**

**(a) Capacitance:**
- A = 150 cm² = 150 × 10⁻⁴ m² = 0.015 m²
- d = 0.50 mm = 0.50 × 10⁻³ m

C = ε₀A/d = (8.85 × 10⁻¹²)(0.015)/(0.50 × 10⁻³)
**C = 2.7 × 10⁻¹⁰ F (270 pF)**

**(b) Energy stored:**
W = ½CV² = ½ × 2.655 × 10⁻¹⁰ × 12²
**W = 1.9 × 10⁻⁸ J**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Electric Field Lines",
                content: `## Visualising Electric Fields

**Electric field lines** are imaginary constructs that provide an intuitive map of an electric field, showing direction and relative strength.

### Rules for Field Lines

| Rule | Meaning |
|------|---------|
| Tangent to line | Direction of field (and force on +ve charge) |
| Originate | From positive charges |
| Terminate | On negative charges (or at infinity) |
| Density | Proportional to field strength |
| Never cross | Field can only have one direction at each point |

### Common Field Patterns

**1. Isolated Positive Point Charge**
- Lines radiate uniformly outward in all directions
- Spread out with distance → field weakens as 1/r²
- Like quills on a porcupine

**2. Isolated Negative Point Charge**
- Lines point radially inward
- Same pattern as positive, but opposite direction
- Positive test charge would be attracted

**3. Parallel Plates (Uniform Field)**
- Lines are parallel and equally spaced
- Direction: positive plate → negative plate
- Constant field strength throughout central region
- Edge effects at plate edges (lines curve outward)

**4. Two Equal Unlike Charges (Dipole)**
- Lines from +ve to -ve
- Denser near charges
- Symmetrical pattern

**5. Two Equal Like Charges**
- Lines repel in the middle
- Neutral point exists where E = 0

### Equipotential Lines

- Perpendicular to field lines everywhere
- No work done moving along them
- Closer together = stronger field

### Interpreting Field Line Diagrams

| Observation | Conclusion |
|-------------|------------|
| Lines close together | Strong field |
| Lines far apart | Weak field |
| Lines uniformly spaced | Uniform field |
| Lines converge | Field getting stronger |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "9. Experimental Investigation",
                content: `## Measuring Electric Fields

The validity of theoretical models must be confirmed through experimental measurement.

### Core Principle

From the definition E = F/q, to determine field strength:
1. Place a small, known test charge q at the point
2. Measure the force F on the charge
3. Calculate E = F/q

### Equipment

- Sensitive force sensor or electrostatic balance
- Electroscope for charge detection
- Multimeter for potential difference
- Known test charges (usually on insulating handles)

### Sources of Error

**Systematic Errors:**
- Consistent errors affecting all measurements the same way
- Examples: uncalibrated instruments, zero errors
- NOT reduced by averaging

**Precaution:** Check instrument calibration against known standards. Zero meters before reading.

**Random Errors:**
- Unpredictable fluctuations in measurements
- Examples: environmental variations, parallax, reaction time
- Reduced by averaging multiple readings

**Precaution:** Take multiple readings and calculate the mean.

**Precision of Instruments:**
- Resolution must be appropriate for measurements
- e.g., using metre rule for mm measurements introduces significant uncertainty

**Precaution:** Select instruments with resolution much smaller than quantities being measured.

### Safety Considerations

- High voltages can be used (EHT supplies)
- Ensure proper insulation
- Discharge capacitors before handling
- Keep one hand behind back when working with high voltage`,
                diagrams: [],
                subsections: []
            },
            {
                title: "10. Summary of Key Formulae",
                content: `## Quick Reference Table

### Electric Field Concepts

| Concept | Definition/Formula |
|---------|---------------------|
| Electric Field | Region where charge experiences force |
| Field Strength | Force per unit positive charge: **E = F/q** |
| Field due to point charge | **E = Q/(4πε₀r²)** |

### Coulomb's Law

| Quantity | Formula |
|----------|---------|
| Force between charges | **F = Qq/(4πε₀r²)** |
| Alternative form | F = kQq/r² where k = 8.99 × 10⁹ N m² C⁻² |

### Electric Potential

| Quantity | Formula |
|----------|---------|
| Definition | Work per unit charge: **V = W/Q** |
| Due to point charge | **V = Q/(4πε₀r)** |
| Potential energy | **Eₚ = Qq/(4πε₀r)** |

### Uniform Fields

| Quantity | Formula |
|----------|---------|
| Field between plates | **E = V/d** |
| Force on charge | **F = qE** |

### Capacitance

| Quantity | Formula |
|----------|---------|
| Definition | **C = Q/V** |
| Parallel plates | **C = ε₀εᵣA/d** |
| Energy stored | **W = ½QV = ½CV² = ½Q²/C** |

### Constants

| Constant | Value |
|----------|-------|
| ε₀ (permittivity of free space) | 8.85 × 10⁻¹² F m⁻¹ |
| k (Coulomb constant) | 8.99 × 10⁹ N m² C⁻² |
| e (elementary charge) | 1.60 × 10⁻¹⁹ C |

### Relationships

- **E = -dV/dr** (field is negative potential gradient)
- **1/(4πε₀) = k = 8.99 × 10⁹ N m² C⁻²**
- **Eₚ = F × r** (potential energy = force × distance at that point)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "11. Exam-Style Practice Questions",
                content: `## Testing Your Understanding

### Question 1: Alpha Particle and Gold Nucleus

An α-particle (mass 6.6 × 10⁻²⁷ kg, charge +3.2 × 10⁻¹⁹ C) is at distance 4.7 × 10⁻¹⁴ m from a gold nucleus (charge +79e).

**(a) Calculate the electric force**

Charge of gold nucleus: Q = 79 × 1.6 × 10⁻¹⁹ = 1.264 × 10⁻¹⁷ C

F = Qq/(4πε₀r²)
F = (1.264 × 10⁻¹⁷ × 3.2 × 10⁻¹⁹)/(4π × 8.85 × 10⁻¹² × (4.7 × 10⁻¹⁴)²)
**F = 16 N** (repulsive)

**(b) Calculate mutual potential energy**

Eₚ = Qq/(4πε₀r) = F × r
Eₚ = 16.5 × 4.7 × 10⁻¹⁴
**Eₚ = 7.7 × 10⁻¹³ J**

---

### Question 2: Parallel Plate Capacitor

A capacitor has plates of area 250 cm², separated by 0.30 mm in air.

**(a) Calculate capacitance**

A = 250 × 10⁻⁴ = 0.025 m²
d = 0.30 × 10⁻³ m

C = ε₀A/d = (8.85 × 10⁻¹²)(0.025)/(0.30 × 10⁻³)
**C = 7.4 × 10⁻¹⁰ F (740 pF)**

**(b) With 6.0 V supply, find:**

(i) Charge: Q = CV = 7.375 × 10⁻¹⁰ × 6.0
**Q = 4.4 × 10⁻⁹ C (4.4 nC)**

(ii) Energy: W = ½QV = ½ × 4.425 × 10⁻⁹ × 6.0
**W = 1.3 × 10⁻⁸ J**

---

### Conceptual Questions

**Q: What is meant by electric potential at a point?**

Electric potential at a point is **the work done per unit positive charge** in bringing a small test charge from **infinity** to that point. Unit: volt (V) = J/C

**Q: Define capacitance.**

Capacitance is the **ratio of charge stored on one plate to the potential difference** between the plates. It measures a capacitor's ability to store charge. Unit: farad (F)`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Electric Field: region where a stationary charge experiences a force",
            "Coulomb's Law: F = Qq/(4πε₀r²) — force between two point charges",
            "Electric Field Strength: E = F/q = Q/(4πε₀r²) in N C⁻¹ or V m⁻¹",
            "Superposition: net field = vector sum of individual fields",
            "Electric Potential: V = W/Q = Q/(4πε₀r) — work per unit charge from infinity",
            "Potential is scalar — can simply add values algebraically",
            "Uniform Field: E = V/d between parallel plates",
            "Motion in uniform field: constant acceleration a = qE/m",
            "Capacitance: C = Q/V, for parallel plates C = ε₀εᵣA/d",
            "Energy stored: W = ½QV = ½CV² = ½Q²/C"
        ],
        exam_tips: [
            "Always convert distances to metres and charges to coulombs before calculations",
            "Remember: electrostatic force is attractive for opposite charges, repulsive for like charges",
            "For electrons in fields: force direction is OPPOSITE to field direction (negative charge)",
            "When finding resultant field from multiple charges, treat as vector addition",
            "Potential is scalar — simply add values; field strength is vector — use components",
            "Check units: E can be N C⁻¹ or V m⁻¹ (these are equivalent)"
        ]
    },
    "Oscillations": {
        topic: "Oscillations",
        subject: "A Level Physics",
        summary: "The study of oscillations deals with repetitive, cyclical motion fundamental to understanding a vast range of physical systems. This topic explores Simple Harmonic Motion (SHM), the mathematical descriptions of displacement, velocity and acceleration, graphical representations, energy considerations, damped and forced oscillations, and the important phenomenon of resonance. These principles provide a powerful model for analyzing waves, alternating currents, and many other advanced physics concepts.",
        sections: [
            {
                title: "1. Introduction to Oscillations",
                content: `## Understanding Oscillatory Motion

**Oscillations** are repetitive, cyclical motions where an object moves back and forth about a central equilibrium position. This type of motion is fundamental throughout physics.

### Examples of Oscillating Systems

| System | Restoring Force |
|--------|-----------------|
| Pendulum | Component of weight |
| Mass on spring | Elastic force |
| Vibrating guitar string | Tension |
| Atoms in solids | Interatomic forces |
| AC current | Electromagnetic |

### Key Terms

**Equilibrium Position:** The position where the net force on the object is zero.

**Displacement (x):** The distance and direction from the equilibrium position.

**Amplitude (x₀ or A):** The maximum displacement from equilibrium.

**Period (T):** The time for one complete oscillation (one full cycle).

**Frequency (f):** The number of oscillations per unit time.
- f = 1/T
- Unit: hertz (Hz) = s⁻¹

**Angular Frequency (ω):**
- ω = 2πf = 2π/T
- Unit: rad s⁻¹

### Types of Oscillations

| Type | Description |
|------|-------------|
| Free | Only restoring force acts; constant amplitude |
| Damped | Resistive forces dissipate energy; decreasing amplitude |
| Forced | External periodic driving force applied |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Simple Harmonic Motion (SHM) - Definition",
                content: `## The Most Important Type of Oscillation

**Simple Harmonic Motion (SHM)** is a special type of oscillatory motion characterised by a very specific relationship between acceleration and displacement.

### Definition

Simple Harmonic Motion is the motion of a particle about a fixed point such that:
1. Its **acceleration is proportional** to its displacement from the fixed point
2. The acceleration is always **directed towards** the fixed point (opposite to displacement)

### The Defining Equation

**a = -ω²x**

Where:
- a = acceleration (m s⁻²)
- x = displacement from equilibrium (m)
- ω = angular frequency (rad s⁻¹)

### Understanding the Equation

| Feature | Meaning |
|---------|---------|
| Negative sign | Acceleration OPPOSES displacement |
| a ∝ x | Larger displacement → larger acceleration |
| ω² is constant | Determines the "stiffness" of the system |

### The Restoring Force

Since F = ma, and a = -ω²x:

**F = -mω²x**

This shows:
- Force is proportional to displacement
- Force is always directed toward equilibrium
- This is the **restoring force**

### Conditions for SHM

For a system to undergo SHM:
1. There must be a stable equilibrium position
2. The restoring force must be proportional to displacement
3. The restoring force must always point toward equilibrium

### Examples of SHM Systems

**Mass-Spring System:**
- Restoring force: F = -kx (Hooke's Law)
- Angular frequency: ω = √(k/m)
- Period: **T = 2π√(m/k)**

**Simple Pendulum (small angles):**
- Restoring force: F ≈ -(mg/L)x
- Angular frequency: ω = √(g/L)
- Period: **T = 2π√(L/g)**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Kinematic Equations of SHM",
                content: `## Describing Motion as Functions of Time

The solutions to the SHM defining equation (a = -ω²x) give us displacement, velocity, and acceleration as sinusoidal functions of time.

### Displacement Equations

The form depends on the **initial conditions** (where the oscillation starts):

**Starting at equilibrium (x = 0 at t = 0):**
**x = x₀ sin(ωt)**

**Starting at maximum displacement (x = x₀ at t = 0):**
**x = x₀ cos(ωt)**

Where:
- x₀ = amplitude (m)
- ω = angular frequency (rad s⁻¹)
- t = time (s)

### Velocity Equations

Velocity is the derivative of displacement with respect to time.

**If x = x₀ sin(ωt):**
**v = x₀ω cos(ωt) = v₀ cos(ωt)**

**If x = x₀ cos(ωt):**
**v = -x₀ω sin(ωt) = -v₀ sin(ωt)**

### Maximum Velocity

The maximum velocity occurs when the object passes through equilibrium:

**v₀ = x₀ω = 2πfx₀**

### Acceleration Equations

Acceleration is the derivative of velocity (or second derivative of displacement).

**a = -ω²x₀ sin(ωt) = -ω²x**

or

**a = -ω²x₀ cos(ωt) = -ω²x**

### Maximum Acceleration

**a₀ = ω²x₀**

The maximum acceleration occurs at maximum displacement.

### Velocity as Function of Displacement

An important relationship derives from energy considerations:

**v = ±ω√(x₀² - x²)**

This shows:
- v = ±v₀ when x = 0 (at equilibrium)
- v = 0 when x = ±x₀ (at maximum displacement)

### Summary Table

| Quantity | Equation | Maximum Value |
|----------|----------|---------------|
| Displacement | x = x₀ sin(ωt) | x₀ |
| Velocity | v = v₀ cos(ωt) | v₀ = x₀ω |
| Acceleration | a = -a₀ sin(ωt) | a₀ = ω²x₀ |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Graphical Representation of SHM",
                content: `## Visualising SHM

Graphs are essential for understanding the phase relationships between displacement, velocity, and acceleration in SHM.

### Displacement-Time Graph

For x = x₀ sin(ωt):
- **Shape:** Sine wave
- **Starts at:** x = 0 (equilibrium)
- **Rises to:** +x₀ (amplitude)
- **Falls to:** -x₀
- **Period:** One complete cycle takes time T

### Velocity-Time Graph

For v = v₀ cos(ωt):
- **Shape:** Cosine wave
- **Starts at:** v = v₀ (maximum)
- **When x = 0:** v = ±v₀ (maximum speed)
- **When x = ±x₀:** v = 0 (momentarily at rest)

### Acceleration-Time Graph

For a = -a₀ sin(ωt):
- **Shape:** Inverted sine wave (negative of displacement graph)
- **When x = +x₀:** a = -a₀ (maximum negative)
- **When x = -x₀:** a = +a₀ (maximum positive)
- **When x = 0:** a = 0

### Phase Relationships

| Relationship | Phase Difference |
|--------------|------------------|
| Velocity leads displacement | π/2 rad (90°) |
| Acceleration leads velocity | π/2 rad (90°) |
| Acceleration leads displacement | π rad (180°) |

**Key insight:** Displacement and acceleration are in **antiphase** (π radians out of phase).

### Reading Values from Graphs

**From displacement-time graph:**
- Amplitude = maximum value
- Period = time for one complete cycle
- Gradient at any point = instantaneous velocity

**From velocity-time graph:**
- Maximum velocity = v₀ = x₀ω
- Gradient at any point = instantaneous acceleration

### Gradient Relationships

| Graph | Gradient Gives |
|-------|----------------|
| x-t graph | Velocity v = dx/dt |
| v-t graph | Acceleration a = dv/dt |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Energy in SHM",
                content: `## Energy Conservation in Oscillations

In an ideal SHM system (no damping), energy is continuously exchanged between kinetic and potential forms, but the total mechanical energy remains constant.

### Kinetic Energy

**Eₖ = ½mv²**

Using v = ω√(x₀² - x²):

**Eₖ = ½mω²(x₀² - x²)**

- Maximum at equilibrium (x = 0): Eₖ = ½mω²x₀²
- Zero at maximum displacement (x = ±x₀)

### Potential Energy

**Eₚ = ½mω²x²**

For a spring system: Eₚ = ½kx²

- Zero at equilibrium (x = 0)
- Maximum at maximum displacement: Eₚ = ½mω²x₀²

### Total Energy

**E = Eₖ + Eₚ = ½mω²x₀² = constant**

Or: **E = ½mv₀² = ½kx₀²**

### Energy Equations Summary

| Energy Type | As function of x | At x = 0 | At x = ±x₀ |
|-------------|------------------|----------|------------|
| Kinetic | ½mω²(x₀² - x²) | Maximum | Zero |
| Potential | ½mω²x² | Zero | Maximum |
| Total | ½mω²x₀² | ½mω²x₀² | ½mω²x₀² |

### Energy-Displacement Graph

- Eₖ curve: inverted parabola, max at x = 0
- Eₚ curve: parabola, min at x = 0
- E_total: horizontal line (constant)
- Eₖ + Eₚ = E at all points

### Energy-Time Graph

Both Eₖ and Eₚ vary sinusoidally with time at **twice the frequency** of the displacement.

**Eₖ = ½mω²x₀²cos²(ωt)**
**Eₚ = ½mω²x₀²sin²(ωt)**

### Free Oscillations

**Free oscillations** occur when:
- Only the restoring force acts
- No energy is dissipated
- Amplitude remains constant
- Total energy is conserved

This is an idealised case; real systems always have some damping.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Damped Oscillations",
                content: `## Real Oscillations with Energy Loss

In real systems, resistive forces (friction, air resistance, internal forces) dissipate energy from the oscillator. This is called **damping**.

### Effects of Damping

1. **Amplitude decreases** progressively over time
2. **Energy is lost** (usually as heat)
3. **Motion eventually stops**
4. Period may be slightly affected

### Types of Damping

**1. Light Damping (Underdamping)**
- System oscillates with gradually decreasing amplitude
- Many oscillations occur before motion stops
- Amplitude decreases exponentially: A = A₀e^(-γt)
- Example: Pendulum in air

**2. Critical Damping**
- System returns to equilibrium in the **shortest possible time**
- **No oscillation** occurs
- Optimal for many applications
- Example: Car suspension, door closers

**3. Heavy Damping (Overdamping)**
- System returns to equilibrium **very slowly**
- **No oscillation** occurs
- Takes longer than critical damping
- Example: Door with very stiff closer

### Amplitude Decay

For light damping, amplitude follows an exponential decay:

**A(t) = A₀e^(-γt)**

Where:
- A₀ = initial amplitude
- γ = damping coefficient
- t = time

The envelope of the oscillation follows this exponential curve.

### Energy Decay

Since energy ∝ amplitude²:

**E(t) = E₀e^(-2γt)**

Energy decays at twice the rate of amplitude.

### Q-Factor (Quality Factor)

The Q-factor measures how "underdamped" an oscillator is:

**Q = 2π × (energy stored)/(energy lost per cycle)**

- High Q: Low damping, many oscillations
- Low Q: High damping, few oscillations

### Practical Applications

| Application | Damping Type | Reason |
|-------------|--------------|--------|
| Car suspension | Critical | Smooth ride, no bouncing |
| Seismometer | Very light | Measure small vibrations |
| Voltmeter needle | Critical | Quick, stable reading |
| Instrument strings | Light | Sustained notes |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Forced Oscillations and Resonance",
                content: `## Driven Oscillations

**Forced oscillations** occur when a periodic external driving force is applied to an oscillating system.

### Key Terminology

**Driving Force:** External periodic force applied to the system

**Driving Frequency (f_d):** Frequency of the applied force

**Natural Frequency (f₀):** Frequency at which system oscillates when displaced and released (free oscillation)

### Behaviour of Driven Systems

When a driving force is applied:
1. Initially, motion is complex (transient phase)
2. Eventually, system oscillates at the **driving frequency**
3. Amplitude depends on relationship between f_d and f₀

### Resonance

**Resonance** occurs when the driving frequency equals the natural frequency:

**f_d = f₀**

At resonance:
- **Amplitude reaches maximum**
- **Energy transfer is most efficient**
- System absorbs maximum power from driver

### Amplitude-Frequency Graph

The graph of amplitude vs driving frequency shows:
- Peak at f_d = f₀ (resonance)
- Amplitude decreases for f_d ≠ f₀
- Width of peak depends on damping

### Effect of Damping on Resonance

| Damping Level | Peak Height | Peak Width |
|---------------|-------------|------------|
| Light | Very tall | Narrow |
| Moderate | Medium | Medium |
| Heavy | Short | Wide |

With more damping:
- Maximum amplitude is reduced
- Resonance peak is broader
- Peak may shift to slightly lower frequency

### Phase at Resonance

At resonance, the displacement of the oscillator is **90° behind** the driving force.

| Condition | Phase Difference |
|-----------|------------------|
| f_d << f₀ | ~0° (in phase) |
| f_d = f₀ | 90° |
| f_d >> f₀ | ~180° (antiphase) |

### Barton's Pendulums Demonstration

Classic demonstration of resonance:
- Several pendulums of different lengths hang from a common support
- One heavy "driver" pendulum is set oscillating
- The pendulum with **same length as driver** (same natural frequency) oscillates with largest amplitude
- Other pendulums show smaller oscillations

### Practical Examples

**Beneficial Resonance:**
- Musical instruments (strings, air columns)
- Radio tuning circuits
- MRI scanners
- Microwave ovens

**Destructive Resonance:**
- Tacoma Narrows Bridge collapse
- Building damage in earthquakes
- Wine glass shattering from sound
- Mechanical vibrations in machinery`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Summary of Key Formulae",
                content: `## Quick Reference for Oscillations

### Defining Relationships

| Quantity | Formula |
|----------|---------|
| Angular frequency | **ω = 2πf = 2π/T** |
| Defining equation of SHM | **a = -ω²x** |
| Condition for SHM | Acceleration ∝ displacement, directed to equilibrium |

### Kinematic Equations (starting at x = 0)

| Quantity | Equation |
|----------|----------|
| Displacement | **x = x₀ sin(ωt)** |
| Velocity | **v = x₀ω cos(ωt) = v₀ cos(ωt)** |
| Acceleration | **a = -x₀ω² sin(ωt) = -ω²x** |

### Kinematic Equations (starting at x = x₀)

| Quantity | Equation |
|----------|----------|
| Displacement | **x = x₀ cos(ωt)** |
| Velocity | **v = -x₀ω sin(ωt)** |
| Acceleration | **a = -x₀ω² cos(ωt) = -ω²x** |

### Maximum Values

| Quantity | Maximum Value |
|----------|---------------|
| Displacement | x₀ (amplitude) |
| Velocity | **v₀ = x₀ω = 2πfx₀** |
| Acceleration | **a₀ = x₀ω² = 4π²f²x₀** |

### Velocity-Displacement Relationship

**v = ±ω√(x₀² - x²)**

### Period of Specific Systems

| System | Period |
|--------|--------|
| Mass-spring | **T = 2π√(m/k)** |
| Simple pendulum | **T = 2π√(L/g)** |

### Energy Equations

| Energy | Formula |
|--------|---------|
| Kinetic | **Eₖ = ½mv² = ½mω²(x₀² - x²)** |
| Potential | **Eₚ = ½mω²x² = ½kx²** |
| Total | **E = ½mω²x₀² = ½mv₀² = ½kx₀²** |

### Damping

| Quantity | Formula |
|----------|---------|
| Amplitude decay | **A = A₀e^(-γt)** |
| Energy decay | **E = E₀e^(-2γt)** |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "9. Exam-Style Practice",
                content: `## Testing Your Understanding

### Question 1: Basic SHM Calculations

A particle oscillates in SHM with period 2.5 ms and amplitude 4.0 mm. At t = 0, the particle is at equilibrium.

**Calculate:**

**(a) Frequency**
f = 1/T = 1/(2.5 × 10⁻³) = **400 Hz**

**(b) Angular frequency**
ω = 2πf = 2π × 400 = **2510 rad s⁻¹** (or 800π rad s⁻¹)

**(c) Maximum speed**
v₀ = x₀ω = 4.0 × 10⁻³ × 2510 = **10.0 m s⁻¹**

**(d) Maximum acceleration**
a₀ = x₀ω² = 4.0 × 10⁻³ × 2510² = **2.5 × 10⁴ m s⁻²**

**(e) Displacement at t = 0.8 ms**
x = x₀ sin(ωt) = 4.0 × 10⁻³ × sin(2510 × 0.8 × 10⁻³)
x = 4.0 × 10⁻³ × sin(2.01) = **3.6 mm**

**(f) Speed at t = 1.0 ms**
v = v₀ cos(ωt) = 10.0 × cos(2510 × 1.0 × 10⁻³)
v = 10.0 × cos(2.51) = **-8.1 m s⁻¹** (magnitude 8.1 m s⁻¹)

---

### Question 2: Mass-Spring System

A 0.50 kg mass attached to a spring of spring constant 200 N m⁻¹ is displaced 0.10 m and released.

**(a) Period of oscillation**
T = 2π√(m/k) = 2π√(0.50/200) = **0.31 s**

**(b) Maximum velocity**
ω = √(k/m) = √(200/0.50) = 20 rad s⁻¹
v₀ = x₀ω = 0.10 × 20 = **2.0 m s⁻¹**

**(c) Maximum acceleration**
a₀ = x₀ω² = 0.10 × 20² = **40 m s⁻²**

**(d) Total energy**
E = ½kx₀² = ½ × 200 × 0.10² = **1.0 J**

---

### Question 3: Simple Pendulum

A simple pendulum has length 0.80 m. Find its period on Earth (g = 9.81 m s⁻²).

T = 2π√(L/g) = 2π√(0.80/9.81) = **1.8 s**

---

### Conceptual Questions

**Q: Explain why acceleration and displacement are in antiphase in SHM.**

Since a = -ω²x, when displacement is at its positive maximum (+x₀), acceleration is at its negative maximum (-ω²x₀), and vice versa. The negative sign in the defining equation means they are always in opposite directions, giving a phase difference of π radians (180°).

**Q: Why does resonance produce maximum amplitude?**

At resonance (f_d = f₀), the driving force is always in the same direction as the velocity of the oscillator. This means the driver does positive work on the system throughout the cycle, efficiently transferring energy and building up a large amplitude.`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "SHM: acceleration proportional to displacement, directed toward equilibrium: a = -ω²x",
            "Angular frequency: ω = 2πf = 2π/T",
            "Displacement: x = x₀ sin(ωt) or x = x₀ cos(ωt) depending on start position",
            "Maximum velocity: v₀ = x₀ω (at equilibrium position)",
            "Maximum acceleration: a₀ = ω²x₀ (at maximum displacement)",
            "Velocity from displacement: v = ±ω√(x₀² - x²)",
            "Mass-spring period: T = 2π√(m/k); Pendulum period: T = 2π√(L/g)",
            "Total energy constant in ideal SHM: E = ½mω²x₀²",
            "Damping: light (oscillates, decreases), critical (fastest return, no oscillation), heavy (slow return)",
            "Resonance: maximum amplitude when driving frequency = natural frequency"
        ],
        exam_tips: [
            "Check if displacement starts at 0 (use sin) or at maximum (use cos)",
            "Remember velocity is maximum when displacement is zero, and vice versa",
            "The negative sign in a = -ω²x is essential — it shows acceleration opposes displacement",
            "For period equations, mass-spring uses mass; pendulum uses length",
            "At resonance, amplitude is maximum AND phase difference is 90° between driver and oscillator",
            "Know that damping reduces amplitude AND broadens the resonance peak"
        ]
    },
    "Thermodynamics": {
        topic: "Thermodynamics",
        subject: "A Level Physics",
        summary: "Thermodynamics is the branch of physics dealing with energy transformations, focusing on relationships between heat, work, and internal energy. This topic covers the First Law of Thermodynamics (ΔU = q + w), internal energy of ideal gases, thermodynamic processes (isochoric, isobaric, isothermal), and energy changes during phase transitions. Understanding these principles is essential for analyzing engines, refrigerators, and countless physical systems.",
        sections: [
            {
                title: "1. Introduction to Thermodynamics",
                content: `## The Study of Energy Transformations

**Thermodynamics** is the branch of physics that deals with energy transformations, focusing on the relationships between heat, work, and the internal energy of a system.

### Core Principle

Thermodynamics is fundamentally an application of the **law of conservation of energy**:
- Energy cannot be created or destroyed
- Energy can only be converted from one form to another

### Key Terminology

| Term | Symbol | Definition |
|------|--------|------------|
| System | - | The object or region being studied |
| Surroundings | - | Everything outside the system |
| Heat | q | Energy transferred due to temperature difference |
| Work | w | Energy transferred by mechanical means |
| Internal Energy | U | Total energy stored within the system |

### Why Thermodynamics Matters

Thermodynamics provides the framework for understanding:
- Engines and power plants
- Refrigerators and heat pumps
- Chemical reactions
- Phase transitions
- Atmospheric processes
- Stellar evolution

### Types of Systems

| Type | Description |
|------|-------------|
| Isolated | No exchange of energy or matter with surroundings |
| Closed | Energy exchange allowed, but no matter exchange |
| Open | Both energy and matter can be exchanged |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Internal Energy (U)",
                content: `## The Energy Within a System

**Internal energy (U)** is defined as the sum of the random kinetic and potential energies of the molecules in the system.

### Components of Internal Energy

**1. Kinetic Energy**
- Arises from random translational motion of molecules
- Includes rotational and vibrational motion in polyatomic molecules
- Directly related to temperature

**2. Potential Energy**
- Arises from intermolecular forces
- Depends on molecular separation
- Related to the state (solid, liquid, gas) of the substance

### Internal Energy of an Ideal Gas

For an **ideal gas**, a critical simplification applies:
- Intermolecular forces are assumed negligible
- No significant molecular potential energy exists

Therefore:

**The internal energy of an ideal gas is exclusively the total kinetic energy of random motion of the molecules.**

### Temperature Relationship

Since average kinetic energy ∝ absolute temperature:

**U ∝ T** (for an ideal gas)

The internal energy of an ideal gas depends ONLY on its temperature.

### Change in Internal Energy (ΔU)

| Sign | Meaning |
|------|---------|
| ΔU > 0 (positive) | Internal energy increases |
| ΔU < 0 (negative) | Internal energy decreases |

### How to Change Internal Energy

Internal energy can be altered by:
1. **Heating (or cooling)** - transferring thermal energy q
2. **Doing work** - mechanical energy transfer w

These two mechanisms form the basis of the First Law of Thermodynamics.

### Exam Tip

Always check if the question specifies an 'ideal gas'. This allows you to directly link internal energy changes to temperature changes alone, since U depends only on T for ideal gases.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. The First Law of Thermodynamics",
                content: `## Conservation of Energy for Thermodynamic Systems

The **First Law of Thermodynamics** is a formal statement of energy conservation applied to thermodynamic systems.

### The First Law Equation

**ΔU = q + w**

Where:
- **ΔU** = increase in internal energy of the system (J)
- **q** = energy transferred TO the system by heating (J)
- **w** = work done ON the system (J)

### Sign Conventions (CRITICAL!)

| Quantity | Positive | Negative |
|----------|----------|----------|
| q | Heat added TO system | Heat removed FROM system |
| w | Work done ON system (compression) | Work done BY system (expansion) |
| ΔU | Internal energy increases | Internal energy decreases |

### Understanding the Sign of Work

This is the most common source of errors!

**When gas expands:**
- Gas does work ON surroundings (positive work by gas)
- Work done ON system (w) is NEGATIVE
- Energy leaves the system

**When gas is compressed:**
- Surroundings do work ON gas (positive work on gas)
- Work done ON system (w) is POSITIVE
- Energy enters the system

### Physical Interpretation

The First Law states:
> The increase in a system's internal energy equals the energy added by heating PLUS the work done on the system.

Think of internal energy as a "bank account":
- q is a deposit/withdrawal from heating
- w is a deposit/withdrawal from mechanical work
- ΔU is the net change in your balance

### Work Done by/on a Gas

For expansion/compression at constant pressure:

**Work done by gas = pΔV**
**Work done on gas = -pΔV**

In the First Law: **w = -pΔV**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Thermodynamic Processes",
                content: `## Special Cases of the First Law

By holding one variable constant, we can simplify the First Law and gain insight into specific processes.

### Isochoric Process (Constant Volume)

**Definition:** A process occurring at constant volume (ΔV = 0)

**Condition:** No work is done (w = 0) since w = -pΔV and ΔV = 0

**First Law Simplification:**
**ΔU = q**

**Physical Meaning:**
- All heat added goes directly into internal energy
- Heating a gas in a rigid, sealed container
- Temperature and pressure change, volume stays fixed

**Using q = mcΔθ:**
**ΔU = mcΔθ** (at constant volume)

---

### Isobaric Process (Constant Pressure)

**Definition:** A process occurring at constant pressure

**Work Done:** If gas expands by ΔV at pressure p:
- Work done BY gas = pΔV
- Work done ON system: **w = -pΔV**

**First Law Application:**
**ΔU = q - pΔV**

**Physical Meaning:**
- Some heat goes into internal energy (ΔU)
- The rest does work on surroundings (pΔV)
- Example: Gas heated in a cylinder with a movable piston

---

### Isothermal Process (Constant Temperature)

**Definition:** A process occurring at constant temperature (ΔT = 0)

**Condition:** For an ideal gas, U ∝ T, so if ΔT = 0 then **ΔU = 0**

**First Law Simplification:**
**0 = q + w**
**q = -w**

**Physical Meaning:**
- All heat added is converted to work done by the gas
- All work done on the gas is released as heat
- Gas must be in thermal contact with a heat reservoir
- Process must be slow (quasi-static) to maintain constant T

---

### Adiabatic Process (No Heat Transfer)

**Definition:** A process with no heat exchange with surroundings (q = 0)

**First Law Simplification:**
**ΔU = w**

**Physical Meaning:**
- Work done ON gas → internal energy increases → temperature rises
- Work done BY gas → internal energy decreases → temperature falls
- Example: Rapid compression/expansion (no time for heat transfer)

### Summary Table

| Process | Constant | Simplification |
|---------|----------|----------------|
| Isochoric | Volume (V) | ΔU = q |
| Isobaric | Pressure (p) | ΔU = q - pΔV |
| Isothermal | Temperature (T) | q = -w (ΔU = 0) |
| Adiabatic | Heat (q = 0) | ΔU = w |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Energy Changes During Phase Transitions",
                content: `## Applying the First Law to Changes of State

When a substance changes phase (e.g., liquid to gas), the First Law provides a complete energy accounting.

### Evaporation at Constant Pressure

When a liquid evaporates (boils) at constant pressure:

**Thermal energy supplied:** q = mL (latent heat)

This energy is used for TWO purposes:

**1. Increasing Internal Energy (ΔU)**
- Overcomes intermolecular forces holding liquid molecules together
- Increases potential energy as molecules move apart
- ΔU is positive

**2. Doing Work on Surroundings (-w)**
- Gas occupies much larger volume than liquid
- Gas pushes back the atmosphere as it expands
- Work done BY system = pΔV
- Work done ON system: w = -pΔV

### Complete Energy Accounting

Applying the First Law (ΔU = q + w):

**ΔU = mL - pΔV**

Or rearranged:

**mL = ΔU + pΔV**

This shows:
- Not ALL latent heat goes into internal energy
- Some energy does work against atmospheric pressure
- The pΔV term is typically much smaller than ΔU

### Example: Boiling Water

When 1 kg of water boils at 100°C and 1 atm:
- Latent heat supplied: q = mL = 1 × 2.26 × 10⁶ = 2.26 MJ
- Volume change: ~1.67 m³ (steam has much larger volume)
- Work done: pΔV ≈ 1.01 × 10⁵ × 1.67 ≈ 0.17 MJ
- Internal energy increase: ΔU ≈ 2.09 MJ

About 92% goes into breaking bonds (ΔU), 8% does expansion work.

### Specific Heat Capacity and Latent Heat

| Quantity | Formula | Description |
|----------|---------|-------------|
| Specific Heat Capacity | q = mcΔθ | Energy to raise temperature by 1 K per kg |
| Specific Latent Heat | q = mL | Energy to change state per kg (no temp change) |

### Units

| Quantity | Unit |
|----------|------|
| Specific heat capacity (c) | J kg⁻¹ K⁻¹ |
| Specific latent heat (L) | J kg⁻¹ |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Summary of Key Formulae and Exam Practice",
                content: `## Quick Reference

### Core Equations

| Equation | Application |
|----------|-------------|
| **ΔU = q + w** | First Law of Thermodynamics |
| **w = -pΔV** | Work done ON system at constant pressure |
| **q = mcΔθ** | Heating with temperature change |
| **q = mL** | Heating during phase change |

### Process Summary

| Process | Condition | Result |
|---------|-----------|--------|
| Isochoric | ΔV = 0 | ΔU = q |
| Isobaric | p = constant | ΔU = q - pΔV |
| Isothermal | ΔT = 0 | q = -w |
| Adiabatic | q = 0 | ΔU = w |

---

## Exam-Style Practice

### Problem 1: Isothermal Expansion

**An ideal gas expands isothermally, doing 250 J of work on its surroundings. Find ΔU and q.**

**Solution:**

Step 1: Isothermal → ΔT = 0 → **ΔU = 0** (for ideal gas)

Step 2: Gas does 250 J work ON surroundings
→ Work done ON system: w = -250 J

Step 3: Apply First Law
ΔU = q + w
0 = q + (-250)
**q = +250 J**

**Answer:** ΔU = 0 J; the gas absorbs 250 J of heat.

---

### Problem 2: Heating and Expansion

**50 J of heat is supplied to a gas. The gas expands, doing 20 J of work. Calculate ΔU.**

**Solution:**

Step 1: Heat supplied → q = +50 J

Step 2: Gas does 20 J work on surroundings
→ Work done ON system: w = -20 J

Step 3: Apply First Law
ΔU = q + w
ΔU = (+50) + (-20)
**ΔU = +30 J**

**Answer:** Internal energy increases by 30 J.

---

### Problem 3: Compression

**A gas is compressed, with 300 J of work done on it. During compression, 100 J of heat is released. Find ΔU.**

**Solution:**

Step 1: Work done ON gas → w = +300 J

Step 2: Heat released → q = -100 J

Step 3: Apply First Law
ΔU = q + w
ΔU = (-100) + (+300)
**ΔU = +200 J**

**Answer:** Internal energy increases by 200 J.

---

### Conceptual Question

**Q: Why does the temperature decrease when an ideal gas expands adiabatically?**

**A:** In an adiabatic process, q = 0, so ΔU = w. When the gas expands, it does work ON the surroundings, meaning work done ON the system is negative (w < 0). Therefore ΔU < 0, meaning internal energy decreases. Since internal energy of an ideal gas depends only on temperature, a decrease in U means temperature must decrease.`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Internal energy U = sum of random kinetic + potential energies of molecules",
            "For ideal gas: U = kinetic energy only (no intermolecular potential energy)",
            "Internal energy of ideal gas depends only on temperature: U ∝ T",
            "First Law: ΔU = q + w (energy conservation for thermodynamic systems)",
            "Sign convention: q positive = heat IN; w positive = work done ON system",
            "Work on gas at constant pressure: w = -pΔV",
            "Isochoric (constant V): ΔU = q (no work done)",
            "Isobaric (constant p): ΔU = q - pΔV",
            "Isothermal (constant T): ΔU = 0, so q = -w",
            "Phase change: mL = ΔU + pΔV (latent heat = internal energy + expansion work)"
        ],
        exam_tips: [
            "ALWAYS check the sign convention: work BY system means w is NEGATIVE in ΔU = q + w",
            "For ideal gases, if T is constant then ΔU = 0, regardless of other changes",
            "Identify the process type FIRST (isochoric, isobaric, isothermal, adiabatic)",
            "Remember: compression → w positive; expansion → w negative",
            "For phase changes at constant pressure, not all latent heat becomes internal energy",
            "Read questions carefully: 'work done on' vs 'work done by' determines the sign"
        ]
    },
    "Ideal Gases": {
        topic: "Ideal Gases",
        subject: "A Level Physics",
        summary: "An ideal gas is a theoretical model providing a simplified but powerful way to describe gas behaviour. This topic covers the kinetic theory of gases, the ideal gas equations (pV = nRT and pV = NkT), the relationship between temperature and molecular kinetic energy, root-mean-square speed, internal energy of gases, and work done during gas expansion/compression. Understanding these principles is essential for thermodynamics and many practical applications.",
        sections: [
            {
                title: "1. Introduction to Ideal Gases",
                content: `## The Ideal Gas Model

An **ideal gas** is a theoretical model that simplifies the behaviour of real gases, allowing us to establish fundamental relationships between pressure, volume, and temperature.

### Definition

An ideal gas is a gas that perfectly obeys:
- The assumptions of the kinetic theory
- The equation of state: **pV ∝ T** (where T is in Kelvin)

### Key Differences from Real Gases

| Property | Ideal Gas | Real Gas |
|----------|-----------|----------|
| Molecular volume | Negligible compared to container | Finite (small but non-zero) |
| Intermolecular forces | None (except during collisions) | Weak forces always present |
| Behaviour at extremes | Always obeys gas laws | Deviates at high p, low T |

### Applications of the Ideal Gas Model

1. **Simplifying thermodynamic calculations**
2. **Foundation for kinetic theory**
3. **Excellent approximation for real gases** at low pressure and high temperature
4. **Understanding heat engines and refrigerators**

### When Does the Model Work?

The ideal gas model works well when:
- Pressure is not too high (molecules far apart)
- Temperature is not too low (molecules moving fast)
- Gas is not near its liquefaction point`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Assumptions of the Kinetic Theory",
                content: `## The Microscopic Model

The **kinetic theory of gases** explains macroscopic properties (pressure, temperature) through the microscopic behaviour of molecules.

### The Basic Assumptions

**1. Molecules are identical, hard, perfectly elastic spheres**
- All collisions conserve both momentum AND kinetic energy
- No energy is lost during collisions

**2. Molecular volume is negligible**
- The total volume of all molecules is tiny compared to container volume
- Most of the container is empty space

**3. No intermolecular forces (except during collisions)**
- Molecules travel in straight lines between collisions
- Potential energy between molecules is zero
- Forces only act during brief collision moments

**4. Very large number of molecules in random motion**
- Motion is random in direction and speed
- Molecules are evenly distributed throughout container
- Collisions with walls are uniform over any area

### Implications of These Assumptions

| Assumption | Consequence |
|------------|-------------|
| Elastic collisions | Kinetic energy is conserved |
| Negligible volume | pV relationship is simple |
| No forces | Potential energy = 0, U = KE only |
| Random motion | Uniform pressure on all walls |

### Origin of Pressure

Gas pressure arises from the **sum of forces** from countless molecular collisions with container walls.

Each collision:
1. Changes the molecule's momentum
2. By Newton's 2nd law, this means a force on the wall
3. Force per unit area = Pressure`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. The Kinetic Theory Equation",
                content: `## Deriving Pressure from Molecular Motion

The kinetic theory provides a mathematical link between molecular motion and gas pressure.

### The Kinetic Theory Equation

**pV = ⅓Nm⟨c²⟩**

Where:
- p = pressure (Pa)
- V = volume (m³)
- N = number of molecules
- m = mass of one molecule (kg)
- ⟨c²⟩ = mean-square speed (m² s⁻²)

### Understanding the Derivation (Not Examinable)

The logical steps are:

1. **Single molecule collision:** A molecule hits a wall, reversing its velocity component, causing momentum change Δp = 2mc

2. **Rate of collisions:** The molecule travels back and forth in the container. Time between collisions with same wall depends on box size and speed.

3. **Force from one molecule:** Using F = Δp/Δt, calculate the average force from one molecule.

4. **Extend to N molecules:** Sum over all N molecules, using the average of their squared speeds ⟨c²⟩.

5. **Account for 3D motion:** Molecules move in all three dimensions randomly, so only ⅓ contribute to pressure on any one wall.

### Alternative Form

Since Nm = total mass, and density ρ = mass/volume:

**p = ⅓ρ⟨c²⟩**

This relates pressure directly to gas density and molecular speeds.

### What You Need to Know

- The equation pV = ⅓Nm⟨c²⟩
- That pressure arises from momentum changes during collisions
- How this links macroscopic (p, V) to microscopic (N, m, ⟨c²⟩) properties`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Molecular Speeds",
                content: `## Mean Speed, Mean-Square Speed, and RMS Speed

Gas molecules move at a wide range of speeds. We use statistical averages to describe their motion.

### Three Different "Average" Speeds

**1. Mean Speed ⟨c⟩**
- Simple arithmetic average of all speeds
- ⟨c⟩ = (c₁ + c₂ + c₃ + ... + cₙ)/N

**2. Mean-Square Speed ⟨c²⟩**
- Average of the squared speeds
- ⟨c²⟩ = (c₁² + c₂² + c₃² + ... + cₙ²)/N
- This quantity appears in the kinetic theory equation

**3. Root-Mean-Square (RMS) Speed √⟨c²⟩**
- Square root of the mean-square speed
- c_rms = √⟨c²⟩
- A representative speed used in calculations

### Important Relationship

**⟨c²⟩ ≠ ⟨c⟩²**

The mean-square speed is NOT the square of the mean speed!

Always: **√⟨c²⟩ > ⟨c⟩** (RMS speed > mean speed)

---

### Worked Example

Seven molecules have speeds: 2, 4, 6, 8, 10, 12, 14 units

**(a) Mean speed ⟨c⟩:**
⟨c⟩ = (2 + 4 + 6 + 8 + 10 + 12 + 14)/7 = 56/7 = **8.0 units**

**(b) Square of mean speed ⟨c⟩²:**
⟨c⟩² = 8.0² = **64 units²**

**(c) Mean-square speed ⟨c²⟩:**
⟨c²⟩ = (4 + 16 + 36 + 64 + 100 + 144 + 196)/7 = 560/7 = **80 units²**

**(d) RMS speed √⟨c²⟩:**
c_rms = √80 = **8.9 units**

Notice: RMS speed (8.9) > mean speed (8.0)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Temperature and Molecular Kinetic Energy",
                content: `## The Meaning of Temperature

The kinetic theory reveals that **temperature is a measure of the average random kinetic energy of molecules**.

### The Fundamental Relationship

By combining:
- Kinetic theory equation: pV = ⅓Nm⟨c²⟩
- Ideal gas equation: pV = NkT

We derive:

**⟨Eₖ⟩ = ½m⟨c²⟩ = 3/2 kT**

Where:
- ⟨Eₖ⟩ = average translational kinetic energy per molecule (J)
- k = Boltzmann constant = 1.38 × 10⁻²³ J K⁻¹
- T = thermodynamic temperature (K)

### Key Insights

| Insight | Implication |
|---------|-------------|
| ⟨Eₖ⟩ ∝ T | Double temperature → double average KE |
| ⟨Eₖ⟩ = 3/2 kT | Temperature has a direct molecular meaning |
| Same T means same ⟨Eₖ⟩ | All gases at same T have same average molecular KE |

### RMS Speed from Temperature

From ⟨Eₖ⟩ = ½m⟨c²⟩ = 3/2 kT:

**⟨c²⟩ = 3kT/m**

**c_rms = √(3kT/m)**

This shows:
- Higher T → higher molecular speeds
- Lighter molecules (smaller m) → higher speeds at same T

### Total Kinetic Energy

For N molecules:
**Total KE = N × ⟨Eₖ⟩ = N × (3/2)kT = (3/2)NkT**

For n moles (using Nk = nR):
**Total KE = (3/2)nRT**

---

### Worked Example

Calculate total KE of molecules in 1 mole of gas at 273 K.

Total KE = (3/2)nRT = (3/2) × 1 × 8.31 × 273 = **3400 J**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. The Ideal Gas Equations",
                content: `## Equations of State

The ideal gas equation connects the macroscopic variables of a gas in a single, comprehensive relationship.

### Two Forms of the Equation

**In terms of moles:**

**pV = nRT**

| Symbol | Quantity | Unit |
|--------|----------|------|
| p | Pressure | Pa |
| V | Volume | m³ |
| n | Number of moles | mol |
| R | Molar gas constant | 8.31 J K⁻¹ mol⁻¹ |
| T | Temperature | K |

**In terms of molecules:**

**pV = NkT**

| Symbol | Quantity | Unit |
|--------|----------|------|
| p | Pressure | Pa |
| V | Volume | m³ |
| N | Number of molecules | - |
| k | Boltzmann constant | 1.38 × 10⁻²³ J K⁻¹ |
| T | Temperature | K |

### Connecting the Constants

The Avogadro constant Nₐ = 6.02 × 10²³ mol⁻¹

**k = R/Nₐ**

The Boltzmann constant is the gas constant per molecule.

### CRITICAL: Temperature Must Be in Kelvin!

**T(K) = T(°C) + 273**

The ideal gas equations ONLY work with thermodynamic temperature (Kelvin).

### Combining Gas Laws

For a fixed amount of gas (n constant):

**p₁V₁/T₁ = p₂V₂/T₂**

This is useful for comparing states of the same gas sample.

---

### Worked Example

A cylinder contains 0.050 m³ of gas at 2.0 × 10⁵ Pa and 300 K. Calculate the number of moles.

n = pV/RT = (2.0 × 10⁵ × 0.050)/(8.31 × 300)
n = 10000/2493 = **4.0 mol**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Internal Energy of an Ideal Gas",
                content: `## The Energy Stored in a Gas

### Definition of Internal Energy

**Internal energy (U)** = sum of random kinetic + potential energies of all molecules

### Simplification for Ideal Gases

For an ideal gas:
- No intermolecular forces → No potential energy
- **U = total random kinetic energy only**

### Formula for Monatomic Ideal Gas

Since ⟨Eₖ⟩ = (3/2)kT per molecule:

**U = N × (3/2)kT = (3/2)NkT**

Using Nk = nR:

**U = (3/2)nRT**

### Key Insight

For an ideal gas:

**U ∝ T**

Internal energy depends ONLY on temperature.

| Temperature Change | Internal Energy Change |
|-------------------|------------------------|
| T doubles | U doubles |
| T constant | U constant |
| T decreases | U decreases |

### Implications

1. **Isothermal process (ΔT = 0):** ΔU = 0 for ideal gas
2. **Heating increases U:** More kinetic energy
3. **Cooling decreases U:** Less kinetic energy

### For Diatomic Gases

Diatomic molecules (like O₂, N₂) have additional rotational modes:

U = (5/2)nRT (at room temperature)

But for A-Level, we primarily use the monatomic formula unless specified.

### Changing Internal Energy

Internal energy can be changed by:
1. **Adding/removing heat (q)**
2. **Doing work on/by the gas (w)**

This leads to the First Law: ΔU = q + w`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Work Done by a Gas",
                content: `## Mechanical Energy Transfer

When a gas changes volume, energy is transferred as work.

### Work Done BY an Expanding Gas

At constant pressure p, expanding by volume ΔV:

**Work done BY gas = pΔV**

- Gas pushes outward on surroundings
- Energy leaves the gas
- This is positive work done BY the gas

### Sign Convention for First Law

The First Law is written as: **ΔU = q + w**

Where w = work done ON the system:

| Process | Work BY gas | Work ON gas (w) |
|---------|-------------|-----------------|
| Expansion | +pΔV | w = -pΔV |
| Compression | -pΔV | w = +pΔV |

### Common Pitfall!

"Work done BY the gas" and "work done ON the gas" have OPPOSITE signs!

- Gas expands → does work ON surroundings → w = -pΔV (negative)
- Gas compressed → work done ON gas → w = +pΔV (positive)

### Work in Different Processes

**Isobaric (constant p):**
w = -pΔV (expansion) or w = +pΔV (compression)

**Isochoric (constant V):**
ΔV = 0, so **w = 0**

**Isothermal (constant T):**
ΔU = 0 (for ideal gas), so q + w = 0, meaning **q = -w**

---

### Worked Example

1.0 g of liquid evaporates. Volume increases by 1600 cm³ against atmospheric pressure (1.0 × 10⁵ Pa). Latent heat = 2300 J g⁻¹.

**(a) Work done against atmosphere:**
ΔV = 1600 cm³ = 1600 × 10⁻⁶ m³
Work BY vapor = pΔV = 1.0 × 10⁵ × 1600 × 10⁻⁶ = **160 J**

**(b) Increase in internal energy:**
q = mL = 1.0 × 2300 = 2300 J
w = -160 J (vapor did work on surroundings)
ΔU = q + w = 2300 + (-160) = **2140 J**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "9. Applications of Ideal Gas Laws",
                content: `## Real-World Uses

Despite being a theoretical model, the ideal gas law has many practical applications.

### Atmospheric Physics

- Explains how pressure, density, and temperature vary with altitude
- Essential for weather forecasting and climate modelling
- Understanding atmospheric layers

### Laboratory Measurements

Use pV = nRT to determine:
- Amount of gas (n) produced in a reaction
- Molar mass of unknown gases
- Verification of stoichiometry

### Heat Engines

Ideal gas analysis helps understand:
- Internal combustion engines
- Steam turbines
- Refrigeration cycles
- Air conditioning

**Engine cycle stages:**
1. Compression (work ON gas, T increases)
2. Ignition (heat added at constant V)
3. Expansion (work BY gas)
4. Exhaust/cooling (heat removed)

### Scuba Diving

**Pressure with depth:** p = p₀ + ρgh

At 20 m depth (~3 atm total):
- Air consumption is 3× faster than at surface
- Boyle's Law: p₁V₁ = p₂V₂ explains why you must never hold breath during ascent

### Tyre Pressure

- Tyre pressure increases on hot days (p ∝ T at constant V)
- Must account for temperature when inflating

### Balloons and Airships

- Hot air balloons: heating air decreases density
- Weather balloons: expand as they rise (p decreases)

---

### Worked Example

A cylinder has 0.050 m³ of gas at 2.0 × 10⁵ Pa, 300 K. Molar mass = 4.0 × 10⁻² kg mol⁻¹.

**(a) Amount of gas:**
n = pV/RT = (2.0 × 10⁵ × 0.050)/(8.31 × 300) = **4.0 mol**

**(b) Mass of gas:**
Mass = n × M = 4.0 × (4.0 × 10⁻²) = **0.16 kg**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "10. Limitations of the Ideal Gas Model",
                content: `## When the Model Fails

Real gases deviate from ideal behaviour under extreme conditions.

### Conditions That Cause Deviation

| Condition | Why the Model Fails |
|-----------|---------------------|
| **High Pressure** | Molecular volume becomes significant fraction of total volume |
| **Low Temperature** | Intermolecular attractive forces become significant |
| **Near liquefaction** | Gas is about to condense; strong molecular interactions |

### High Pressure Effects

At high pressure:
- Molecules are forced very close together
- Their finite volume is no longer negligible
- Measured volume is larger than predicted by pV = nRT

### Low Temperature Effects

At low temperature:
- Molecules move slowly
- Weak attractive forces (always present) become significant
- Molecules are "pulled back" before hitting walls
- Measured pressure is LOWER than ideal gas prediction

### The Real Gas Behaviour

| Condition | Real Gas vs Ideal Prediction |
|-----------|------------------------------|
| High p | V(real) > V(ideal) |
| Low T | p(real) < p(ideal) |

### When Is the Ideal Model Good?

The ideal gas approximation works well when:
- Pressure is low (< few atmospheres)
- Temperature is high (well above boiling point)
- Gas is far from condensation conditions

### Beyond A-Level

More advanced models (like the van der Waals equation) include corrections for:
- Finite molecular volume (b term)
- Intermolecular attractions (a term)

These are not required for A-Level but help understand why deviations occur.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "11. Summary of Key Formulae",
                content: `## Quick Reference

### Ideal Gas Equations

| Equation | Description |
|----------|-------------|
| **pV = nRT** | Ideal gas equation (moles) |
| **pV = NkT** | Ideal gas equation (molecules) |
| **k = R/Nₐ** | Boltzmann constant relation |
| **p₁V₁/T₁ = p₂V₂/T₂** | Combined gas law |

### Kinetic Theory

| Equation | Description |
|----------|-------------|
| **pV = ⅓Nm⟨c²⟩** | Kinetic theory equation |
| **p = ⅓ρ⟨c²⟩** | Pressure from density and speed |
| **⟨Eₖ⟩ = ½m⟨c²⟩ = 3/2 kT** | Average molecular KE |
| **c_rms = √(3kT/m)** | RMS speed from temperature |

### Internal Energy

| Equation | Description |
|----------|-------------|
| **U = (3/2)NkT = (3/2)nRT** | Internal energy of monatomic ideal gas |

### Work and First Law

| Equation | Description |
|----------|-------------|
| **w = -pΔV** | Work done ON expanding gas |
| **ΔU = q + w** | First Law of Thermodynamics |

### Constants

| Constant | Symbol | Value |
|----------|--------|-------|
| Molar gas constant | R | 8.31 J K⁻¹ mol⁻¹ |
| Boltzmann constant | k | 1.38 × 10⁻²³ J K⁻¹ |
| Avogadro constant | Nₐ | 6.02 × 10²³ mol⁻¹ |

### Temperature Conversion

**T(K) = T(°C) + 273**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "12. Exam-Style Practice",
                content: `## Testing Your Understanding

### Question 1: Moles Calculation

A cylinder contains gas at V = 0.024 m³, p = 1.2 × 10⁵ Pa, T = 27°C. Calculate the number of moles.

**Solution:**

Step 1: Convert temperature to Kelvin
T = 27 + 273 = 300 K

Step 2: Apply ideal gas equation
n = pV/RT = (1.2 × 10⁵ × 0.024)/(8.31 × 300)
n = 2880/2493 = **1.2 mol**

---

### Question 2: RMS Speed and Kinetic Energy

Gas density = 1.25 kg m⁻³, p = 1.0 × 10⁵ Pa, T = 290 K.

**(a) Find RMS speed**

Using p = ⅓ρ⟨c²⟩:
⟨c²⟩ = 3p/ρ = (3 × 1.0 × 10⁵)/1.25 = 2.4 × 10⁵ m² s⁻²
c_rms = √(2.4 × 10⁵) = **490 m s⁻¹**

**(b) Find average KE per atom**

⟨Eₖ⟩ = (3/2)kT = (3/2) × 1.38 × 10⁻²³ × 290
⟨Eₖ⟩ = **6.0 × 10⁻²¹ J**

---

### Question 3: First Law Application

50 J of heat is supplied to a gas. The gas expands, doing 20 J of work. Find ΔU and state what happens to temperature.

**Solution:**

q = +50 J (heat supplied)
Gas does 20 J work on surroundings → w = -20 J

ΔU = q + w = 50 + (-20) = **+30 J**

Since ΔU > 0, internal energy increases.
For ideal gas, U ∝ T, so **temperature increases**.

---

### Conceptual Question

**Q: State the assumptions of the kinetic theory of gases.**

**A:**
1. Molecules are identical, hard, perfectly elastic spheres
2. Volume of molecules is negligible compared to container volume
3. No intermolecular forces except during collisions
4. Very large number of molecules in random motion`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Ideal gas: obeys pV ∝ T and kinetic theory assumptions",
            "Kinetic theory assumptions: negligible molecular volume, no intermolecular forces, elastic collisions, random motion",
            "Kinetic theory equation: pV = ⅓Nm⟨c²⟩",
            "Average molecular KE: ⟨Eₖ⟩ = ½m⟨c²⟩ = (3/2)kT",
            "RMS speed: c_rms = √⟨c²⟩ = √(3kT/m)",
            "Ideal gas equation (moles): pV = nRT with R = 8.31 J K⁻¹ mol⁻¹",
            "Ideal gas equation (molecules): pV = NkT with k = 1.38 × 10⁻²³ J K⁻¹",
            "Internal energy of ideal gas: U = (3/2)nRT (monatomic); depends only on T",
            "Work done ON expanding gas: w = -pΔV",
            "Real gases deviate from ideal at high pressure and low temperature"
        ],
        exam_tips: [
            "ALWAYS convert temperature to Kelvin before using gas equations",
            "RMS speed ≠ mean speed; ⟨c²⟩ ≠ ⟨c⟩²",
            "Know all four assumptions of kinetic theory — they are frequently examined",
            "For ideal gas: U depends ONLY on T, so isothermal means ΔU = 0",
            "Remember k = R/Nₐ connects the two forms of the ideal gas equation",
            "Watch the sign convention: work done BY gas is negative in ΔU = q + w"
        ]
    },
    "Temperature": {
        topic: "Temperature",
        subject: "A Level Physics",
        summary: "Temperature is fundamental to understanding the physical world, bridging microscopic particle behaviour with macroscopic properties of matter. This topic covers the definition of temperature as average molecular kinetic energy, internal energy, temperature scales (Kelvin and Celsius), specific heat capacity, latent heat, kinetic theory connections, and thermal equilibrium. These concepts are essential for thermodynamics and practical applications in engineering and science.",
        sections: [
            {
                title: "1. Introduction to Temperature",
                content: `## What is Temperature?

**Temperature** is formally defined as a measure of the **average random kinetic energy** of the particles (atoms or molecules) within a substance.

### Microscopic Meaning

- Atoms in a solid vibrate with kinetic energy that depends on temperature
- Molecules in a gas move with random motion; their kinetic energy depends on temperature
- Higher temperature → faster particle motion → greater kinetic energy

### Temperature vs Heat

| Property | Temperature | Heat (Thermal Energy) |
|----------|-------------|----------------------|
| Definition | Average molecular KE | Energy transferred due to temperature difference |
| Type | Property of the system | Energy in transit |
| Depends on | Particle motion | Temperature difference |
| Units | K or °C | J (joules) |

### Important Distinction

- **Temperature** tells us HOW HOT something is
- **Heat** is the ENERGY TRANSFERRED from hot to cold
- A spark is very hot (high T) but has little heat energy (low q)
- A bathtub of warm water has much more heat energy than a spark

### Temperature Units

| Unit | Symbol | Description |
|------|--------|-------------|
| Kelvin | K | SI base unit for thermodynamic temperature |
| Celsius | °C | Common scale for everyday use |

The relationship between temperature and molecular motion leads directly to the concept of internal energy.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Internal Energy (U)",
                content: `## The Total Energy Within a System

**Internal energy (U)** is defined as the sum of the random kinetic and potential energies of all the molecules in a system.

### Two Components of Internal Energy

**1. Random Kinetic Energy**
- Arises from translational, rotational, and vibrational motion
- Directly related to temperature
- ⟨Eₖ⟩ = (3/2)kT per molecule (for ideal gas)

**2. Potential Energy**
- Arises from intermolecular forces
- Depends on molecular separation
- Work done against forces is stored as potential energy

### Internal Energy Formula

**U = Total KE + Total PE**

For N molecules:
- U = Σ(KE) + Σ(PE)

### Special Case: Ideal Gas

For an ideal gas:
- No intermolecular forces → No potential energy
- **U = total kinetic energy only**
- **U = (3/2)NkT = (3/2)nRT**

### Factors Affecting Internal Energy

| Factor | Effect on U |
|--------|-------------|
| Temperature | Higher T → more KE → higher U |
| State of matter | Different PE due to molecular spacing |
| Mass | More molecules → higher total U |

### During a Phase Change

When a substance melts or boils:
- Temperature stays CONSTANT
- Kinetic energy stays CONSTANT
- Potential energy INCREASES (bonds break)
- Internal energy INCREASES despite constant T

### Key Insight

Internal energy can change even without temperature change — this is what happens during phase transitions.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Temperature Scales",
                content: `## Measuring Temperature

To quantify temperature, we use standardized scales. The main scales in physics are Kelvin and Celsius.

### The Kelvin Scale

The **Kelvin (K)** is the SI base unit for thermodynamic temperature.

Key features:
- **Absolute scale** — zero is the lowest possible temperature
- Directly proportional to average molecular KE
- No negative values possible

### Absolute Zero

**Absolute zero** is defined as 0 K (or -273.15°C).

At absolute zero:
- Particles have minimum possible internal energy
- Classical view: all motion stops (quantum effects modify this)
- It is impossible to reach absolute zero exactly

### Temperature Conversion

**From Celsius to Kelvin:**
**T(K) = θ(°C) + 273.15**

(Often approximated as T = θ + 273)

**From Kelvin to Celsius:**
**θ(°C) = T(K) - 273.15**

### Temperature vs Temperature CHANGE

| Type | Conversion |
|------|------------|
| Absolute temperature | T(K) = θ(°C) + 273 |
| Temperature change | ΔT(K) = Δθ(°C) |

**The size of one degree is the SAME on both scales!**

A change of 1 K = a change of 1°C

### Common Exam Error

Many students forget to convert to Kelvin when using gas laws (pV = nRT) but correctly use Celsius for heat capacity problems (ΔQ = mcΔθ).

- For gas laws: ALWAYS use Kelvin
- For heat capacity: Either works (since it's a change)

### Key Temperatures

| Temperature | Kelvin | Celsius |
|-------------|--------|---------|
| Absolute zero | 0 K | -273°C |
| Water freezes | 273 K | 0°C |
| Room temperature | ~293 K | ~20°C |
| Water boils | 373 K | 100°C |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Specific Heat Capacity",
                content: `## Resistance to Temperature Change

Different materials respond differently to the same amount of heating — some heat up quickly, others slowly. This property is quantified by specific heat capacity.

### Definition

**Specific heat capacity (c)** is the thermal energy per unit mass required to raise the temperature of a substance by one degree.

### The Equation

**ΔQ = mcΔθ**

Where:
- ΔQ = thermal energy supplied (J)
- m = mass (kg)
- c = specific heat capacity (J kg⁻¹ K⁻¹)
- Δθ = temperature change (K or °C)

### Units

From c = ΔQ/(mΔθ):

**c is measured in J kg⁻¹ K⁻¹** (or J kg⁻¹ °C⁻¹)

### Physical Meaning

High specific heat capacity means:
- Takes more energy to heat up
- Releases more energy when cooling
- Good for storing thermal energy

| Substance | c (J kg⁻¹ K⁻¹) | Property |
|-----------|----------------|----------|
| Water | 4200 | Very high — excellent heat store |
| Aluminium | 900 | Medium |
| Copper | 390 | Lower — heats quickly |
| Lead | 130 | Very low |

### Why Water is Special

Water has an exceptionally high specific heat capacity:
- Moderates climate (coastal areas have stable temperatures)
- Used in cooling systems
- Excellent for hot water bottles and heating systems

### Experimental Determination

To find c experimentally:
1. Measure mass m of substance
2. Supply known energy ΔQ (e.g., electrical heater: ΔQ = Pt)
3. Measure temperature change Δθ
4. Calculate c = ΔQ/(mΔθ)

**Sources of error:**
- Heat loss to surroundings
- Incomplete thermal equilibrium
- Thermometer uncertainty`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Latent Heat",
                content: `## Energy for Phase Changes

During a phase change (melting, boiling, etc.), temperature remains CONSTANT even though energy is being supplied. This energy is called **latent heat**.

### Why Temperature Stays Constant

During phase changes:
- Energy goes into breaking intermolecular bonds
- Potential energy INCREASES
- Kinetic energy stays CONSTANT
- Temperature stays CONSTANT (since T measures average KE)

### Two Types of Specific Latent Heat

**1. Specific Latent Heat of Fusion (Lf)**
- Energy per unit mass to convert solid → liquid
- Bonds partially broken; molecules can move past each other
- Example: ice → water at 0°C

**2. Specific Latent Heat of Vaporisation (Lv)**
- Energy per unit mass to convert liquid → gas
- Bonds fully broken; molecules become widely separated
- Example: water → steam at 100°C
- Lv > Lf (takes more energy to fully separate molecules)

### The Equation

**Q = mL**

Where:
- Q = thermal energy absorbed or released (J)
- m = mass undergoing phase change (kg)
- L = specific latent heat (J kg⁻¹)

### For Water

| Phase Change | L (J kg⁻¹) |
|--------------|------------|
| Fusion (melting) | 3.34 × 10⁵ |
| Vaporisation (boiling) | 2.26 × 10⁶ |

Note: Lv ≈ 7 × Lf for water

### Heating Curve Interpretation

When heating a substance through phase changes:
- Sloped sections: Temperature rising (Q = mcΔθ)
- Flat sections: Phase change occurring (Q = mL)

### Reverse Processes

**Freezing** releases latent heat of fusion
**Condensation** releases latent heat of vaporisation

---

### Worked Example

Steam (100°C) condenses to water (100°C). Volume decreases by 1600 cm³ at 1.0 × 10⁵ Pa. Lv = 2.3 × 10⁶ J kg⁻¹. Find ΔU for 1.0 g.

**Solution:**
Using ΔU = q + w

q = -mLv = -1.0 × 10⁻³ × 2.3 × 10⁶ = -2300 J (released)

w = +pΔV = +1.0 × 10⁵ × 1.6 × 10⁻³ = +160 J (atmosphere does work ON system)

ΔU = -2300 + 160 = **-2140 J**

Internal energy decreases by 2140 J.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Kinetic Theory Connection",
                content: `## Linking Temperature to Molecular Motion

The kinetic theory of gases provides the microscopic explanation for temperature and internal energy.

### Key Kinetic Theory Result

**⟨Eₖ⟩ = (1/2)m⟨c²⟩ = (3/2)kT**

Where:
- ⟨Eₖ⟩ = average translational kinetic energy per molecule
- k = Boltzmann constant = 1.38 × 10⁻²³ J K⁻¹
- T = thermodynamic temperature (K)

### What This Tells Us

1. **Temperature is proportional to average KE**
   - T ∝ ⟨Eₖ⟩
   - Double the temperature → double the average KE

2. **Same temperature means same average KE**
   - All gases at the same T have the same average molecular KE
   - (regardless of molecular mass)

3. **Absolute zero means minimum KE**
   - At T = 0 K, ⟨Eₖ⟩ = 0 (classically)

### Internal Energy Connection

For an ideal monatomic gas:
- U = total KE of all molecules
- U = N × ⟨Eₖ⟩ = (3/2)NkT = (3/2)nRT

This shows U depends ONLY on T for an ideal gas.

### Temperature Changes

| Change | Molecular Effect | Thermal Effect |
|--------|------------------|----------------|
| Heating | Molecules speed up | T increases |
| Cooling | Molecules slow down | T decreases |
| Phase change | Bond energy changes | T stays constant |

### RMS Speed and Temperature

From ⟨Eₖ⟩ = (1/2)m⟨c²⟩ = (3/2)kT:

**c_rms = √(3kT/m) = √(3RT/M)**

Higher temperature → faster molecular speeds`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Thermal Equilibrium",
                content: `## When Heat Flow Stops

**Thermal equilibrium** is the state where no net flow of thermal energy occurs between objects in thermal contact.

### Definition

Two regions are in **thermal equilibrium** when they are at the **same temperature**.

### How Equilibrium is Reached

1. Hot object placed in contact with cold object
2. Thermal energy flows from hot → cold
3. Hot object cools; cold object warms
4. Eventually both reach same temperature
5. Net energy flow stops — equilibrium reached

### The Zeroth Law of Thermodynamics

If A is in thermal equilibrium with B, and B is in thermal equilibrium with C, then A is in thermal equilibrium with C.

(This fundamental principle allows temperature measurement!)

### How Thermometers Work

A thermometer relies on:
1. A physical property that changes with temperature
2. Calibrated scale to read the value
3. Reaching thermal equilibrium with the object being measured

**Examples of thermometric properties:**

| Property | Thermometer Type |
|----------|------------------|
| Volume of liquid | Mercury/alcohol thermometer |
| Electrical resistance | Resistance thermometer |
| EMF (voltage) | Thermocouple |
| Pressure of gas | Gas thermometer |

### Measurement Process

1. Thermometer placed in contact with object
2. Heat flows until equilibrium reached
3. Thermometer and object reach same temperature
4. Reading taken from calibrated scale

### Practical Considerations

- Allow sufficient time for equilibrium
- Thermometer should have small heat capacity
- Minimize heat loss to surroundings during measurement`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Experimental Methods",
                content: `## Practical Skills in Thermal Physics

Accurate measurements in thermal physics require careful technique and attention to sources of error.

### Key Measurements

**Temperature:**
- Thermometer or temperature sensor
- Allow time for thermal equilibrium
- Read at eye level (avoid parallax)

**Mass:**
- Top-pan balance
- Zero the balance first
- Handle hot objects with tongs

**Time:**
- Stopwatch or timer
- For repeated events, time multiple cycles and divide

**Energy (electrical heating):**
- E = Pt = VIt
- Measure V, I, and t carefully

### Data Presentation

Tables should have:
- Clear headings with quantity and unit (e.g., T / K)
- Consistent significant figures
- Units in header, not every cell

### Error Analysis

**Systematic Errors:**
- Consistent offset in all readings
- Examples: zero error, calibration error
- NOT reduced by averaging

**Random Errors:**
- Scatter around true value
- Examples: reaction time, reading fluctuation
- Reduced by taking multiple readings and averaging

### Uncertainty Calculation

For repeated readings:
**Uncertainty = ± (max - min) / 2**

### Common Sources of Error in Thermal Experiments

| Error | Type | Mitigation |
|-------|------|------------|
| Heat loss to surroundings | Systematic | Insulation, rapid measurement |
| Parallax reading thermometer | Random | Read at eye level |
| Incomplete equilibrium | Systematic | Allow more time |
| Non-uniform heating | Random | Stir the substance |

### Graphical Analysis

- Plot graphs to identify relationships
- Calculate gradient with units
- Draw best-fit line through data points
- Identify anomalous results`,
                diagrams: [],
                subsections: []
            },
            {
                title: "9. Key Definitions and Formulae",
                content: `## Quick Reference Summary

### Core Definitions

| Term | Definition |
|------|------------|
| Temperature | Measure of the average random kinetic energy of molecules |
| Internal Energy | Sum of random kinetic and potential energies of all molecules |
| Specific Heat Capacity | Thermal energy per unit mass per degree temperature rise |
| Specific Latent Heat | Thermal energy per unit mass for phase change (no temp change) |
| Thermal Equilibrium | State where no net thermal energy flows between objects |

### Key Equations

| Equation | Description | When to Use |
|----------|-------------|-------------|
| **ΔQ = mcΔθ** | Heating/cooling | Temperature change, no phase change |
| **Q = mL** | Phase change | Melting, boiling, etc. |
| **⟨Eₖ⟩ = (3/2)kT** | Kinetic energy-temperature | Relating T to molecular motion |
| **T(K) = θ(°C) + 273** | Temperature conversion | Converting to Kelvin |

### Units Summary

| Quantity | SI Unit |
|----------|---------|
| Temperature | K (kelvin) |
| Thermal energy | J (joule) |
| Specific heat capacity | J kg⁻¹ K⁻¹ |
| Specific latent heat | J kg⁻¹ |
| Internal energy | J |

### Constants

| Constant | Value |
|----------|-------|
| Boltzmann constant k | 1.38 × 10⁻²³ J K⁻¹ |
| Absolute zero | 0 K = -273°C |
| Lf for water | 3.34 × 10⁵ J kg⁻¹ |
| Lv for water | 2.26 × 10⁶ J kg⁻¹ |
| c for water | 4200 J kg⁻¹ K⁻¹ |

### Quick Checks

- Temperature change: use ΔQ = mcΔθ
- Phase change: use Q = mL
- For ideal gas: U depends only on T
- Temperature in Kelvin for gas equations
- Δθ is same in K and °C`,
                diagrams: [],
                subsections: []
            },
            {
                title: "10. Exam-Style Practice",
                content: `## Testing Your Understanding

### Problem 1: Work Done by Boiling Water

Water boils at 101 kPa. 1.00 cm³ of liquid becomes 1560 cm³ of steam. Calculate work done when 45 cm³ of water boils dry.

**Solution:**

Step 1: Find total volume change
- Volume change for 1 cm³ water ≈ 1560 cm³
- For 45 cm³: ΔV = 45 × 1560 = 70,200 cm³

Step 2: Convert to SI
- ΔV = 70,200 × 10⁻⁶ m³ = 0.0702 m³
- p = 101 × 10³ Pa

Step 3: Calculate work
- w = pΔV = 101 × 10³ × 0.0702
- **w = 7090 J** (or 7.09 kJ)

---

### Problem 2: Heating Calculation

0.50 kg of water at 20°C is heated to boiling (100°C). How much energy is needed? (c = 4200 J kg⁻¹ K⁻¹)

**Solution:**

ΔQ = mcΔθ
ΔQ = 0.50 × 4200 × (100 - 20)
ΔQ = 0.50 × 4200 × 80
**ΔQ = 168,000 J = 168 kJ**

---

### Problem 3: Melting Ice

How much energy is needed to melt 200 g of ice at 0°C? (Lf = 3.34 × 10⁵ J kg⁻¹)

**Solution:**

Q = mL
Q = 0.200 × 3.34 × 10⁵
**Q = 66,800 J = 66.8 kJ**

---

### Conceptual Question

**Q: The internal energy of an ideal gas decreases by 313 J. What happens to the temperature?**

**A:** For an ideal gas:
- Internal energy U = total random kinetic energy only
- U ∝ T (internal energy proportional to temperature)

Since U decreased:
- Total kinetic energy decreased
- Average kinetic energy decreased
- **Temperature must decrease**

---

### Conceptual Question

**Q: Why does temperature remain constant during melting?**

**A:** During melting:
- Energy supplied breaks intermolecular bonds
- This increases potential energy (not kinetic energy)
- Since temperature measures average kinetic energy
- And kinetic energy stays constant
- **Temperature remains constant**`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Temperature: measure of average random kinetic energy of molecules",
            "Internal energy U = sum of random kinetic + potential energies of molecules",
            "For ideal gas: U = kinetic energy only (no intermolecular PE)",
            "Kelvin is absolute scale; T(K) = θ(°C) + 273",
            "Temperature change: ΔT(K) = Δθ(°C) — same magnitude",
            "Specific heat capacity: ΔQ = mcΔθ (temperature change, no phase change)",
            "Latent heat: Q = mL (phase change, no temperature change)",
            "During phase change: PE increases, KE constant, T constant",
            "Average molecular KE: ⟨Eₖ⟩ = (3/2)kT",
            "Thermal equilibrium: no net heat flow; objects at same temperature"
        ],
        exam_tips: [
            "Use Kelvin for gas law equations (pV = nRT); either scale works for mcΔθ",
            "During phase change, temperature is CONSTANT — use Q = mL not mcΔθ",
            "For ideal gas, internal energy depends ONLY on temperature",
            "Remember: heat is energy transferred; temperature is a property",
            "Lv > Lf always — takes more energy to vaporise than to melt",
            "Watch units: c is in J kg⁻¹ K⁻¹, L is in J kg⁻¹"
        ]
    },
    "Physical Quantities and Units": {
        topic: "Physical Quantities and Units",
        subject: "A Level Physics",
        summary: "Physical quantities and units form the foundational language of physics. This topic covers SI base units, derived quantities and units, unit prefixes, scalars and vectors, measurement techniques, errors and uncertainties, significant figures, orders of magnitude, and dimensional analysis. Mastering these concepts is critical for success as they underpin every other topic in the syllabus.",
        sections: [
            {
                title: "1. Understanding Physical Quantities",
                content: `## The Building Blocks of Measurement

A **physical quantity** consists of a numerical magnitude and a unit.

### Two Types of Physical Quantities

**Base Quantities**
- Fundamental quantities defined independently
- The seven pillars of physical measurement
- Cannot be derived from other quantities

**Derived Quantities**
- Expressed as combinations of base quantities
- Through multiplication or division
- Examples: velocity, force, energy, density

### Examples

| Type | Quantity | Unit |
|------|----------|------|
| Base | Mass | kg |
| Base | Length | m |
| Base | Time | s |
| Derived | Velocity | m s⁻¹ |
| Derived | Force | kg m s⁻² |
| Derived | Energy | kg m² s⁻² |

### Why This Matters

Physical quantities allow us to:
- Describe and compare the physical world
- Communicate findings without ambiguity
- Perform calculations and make predictions`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. SI Base Quantities and Units",
                content: `## The International System

The **SI system** (Système International d'Unités) provides a universal standard for measurement in science.

### The Seven SI Base Quantities

| Base Quantity | SI Unit | Symbol |
|---------------|---------|--------|
| Mass | kilogram | kg |
| Length | metre | m |
| Time | second | s |
| Electric Current | ampere | A |
| Temperature | kelvin | K |
| Amount of Substance | mole | mol |
| Luminous Intensity | candela | cd |

### Key Points

- These seven are the **foundation** of all measurement
- All other units are derived from these
- Definitions are agreed at international conventions
- SI units ensure reproducible, universal results

### Why SI Units Matter

Without standard units:
- Experiments couldn't be replicated
- Scientific communication would fail
- Engineering would be impossible
- Mars Climate Orbiter crashed due to unit confusion!

### Memory Tip

**M**ass, **L**ength, **T**ime, **C**urrent, **T**emperature, **A**mount, **L**uminosity

"**M**y **L**ittle **T**urtle **C**an **T**alk **A**bout **L**ights"`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Derived Quantities and Units",
                content: `## Building on the Foundation

**Derived units** are combinations of base units formed by multiplication or division.

### How Derived Units are Formed

The structure of the derived unit mirrors the defining formula:
- Speed = distance/time → m/s = m s⁻¹
- Force = mass × acceleration → kg × m s⁻² = kg m s⁻²

### Common Derived Quantities

| Quantity | Formula | Derived Unit | SI Base Units |
|----------|---------|--------------|---------------|
| Velocity | s/t | m s⁻¹ | m s⁻¹ |
| Acceleration | v/t | m s⁻² | m s⁻² |
| Force | ma | newton (N) | kg m s⁻² |
| Energy | Fd | joule (J) | kg m² s⁻² |
| Power | E/t | watt (W) | kg m² s⁻³ |
| Pressure | F/A | pascal (Pa) | kg m⁻¹ s⁻² |
| Density | m/V | kg m⁻³ | kg m⁻³ |
| Charge | It | coulomb (C) | A s |
| Voltage | E/Q | volt (V) | kg m² s⁻³ A⁻¹ |
| Resistance | V/I | ohm (Ω) | kg m² s⁻³ A⁻² |

### Expressing Units as Base Units

To find base units of any quantity:
1. Write down its defining equation
2. Substitute base units for each term
3. Simplify using index laws

**Example: Pressure P = F/A**
- F has units kg m s⁻²
- A has units m²
- P = (kg m s⁻²)/(m²) = kg m⁻¹ s⁻²`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Unit Prefixes and Conversions",
                content: `## Handling Large and Small Quantities

SI prefixes denote multiples and sub-multiples of units.

### Standard Prefixes

| Prefix | Symbol | Factor | Example |
|--------|--------|--------|---------|
| tera | T | 10¹² | THz (terahertz) |
| giga | G | 10⁹ | GW (gigawatt) |
| mega | M | 10⁶ | MHz (megahertz) |
| kilo | k | 10³ | km (kilometre) |
| deci | d | 10⁻¹ | dm (decimetre) |
| centi | c | 10⁻² | cm (centimetre) |
| milli | m | 10⁻³ | mm (millimetre) |
| micro | µ | 10⁻⁶ | µm (micrometre) |
| nano | n | 10⁻⁹ | nm (nanometre) |
| pico | p | 10⁻¹² | pF (picofarad) |

### Common Conversion Errors (CRITICAL!)

When converting areas and volumes, the factor must also be squared or cubed:

**For Area:**
- 1 cm = 10⁻² m
- 1 cm² = (10⁻²)² m² = **10⁻⁴ m²**
- 1 mm² = (10⁻³)² m² = **10⁻⁶ m²**

**For Volume:**
- 1 cm = 10⁻² m
- 1 cm³ = (10⁻²)³ m³ = **10⁻⁶ m³**

### Common Mistake

❌ 1 cm² = 10⁻² m² (WRONG!)
✓ 1 cm² = 10⁻⁴ m² (CORRECT!)

❌ 1 cm³ = 10⁻² m³ (WRONG!)
✓ 1 cm³ = 10⁻⁶ m³ (CORRECT!)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Scalars and Vectors",
                content: `## Direction Matters!

A critical distinction in physics is between scalar and vector quantities.

### Definitions

**Scalar:** Fully described by magnitude and unit only

**Vector:** Requires magnitude, unit, AND direction

### Examples

| Scalars | Vectors |
|---------|---------|
| Distance | Displacement |
| Speed | Velocity |
| Mass | Acceleration |
| Energy | Force |
| Time | Weight |
| Temperature | Momentum |
| Power | Electric field |

### Vector Operations

**Collinear Vectors (same line):**
- Same direction: add magnitudes
- Opposite direction: subtract magnitudes

**Non-Collinear Vectors:**
- Use vector triangle (head-to-tail method)
- Or use trigonometry and components

### Resolving Vectors

A vector F at angle θ to horizontal can be split into:

**Horizontal component:** F_x = F cos θ

**Vertical component:** F_y = F sin θ

### Adding Perpendicular Vectors

For vectors A and B at right angles:

**Magnitude of resultant:** R = √(A² + B²)

**Angle to A:** tan α = B/A

---

### Worked Example

Two forces: 450 N and 240 N
**(a) Maximum resultant:** 450 + 240 = **690 N** (same direction)
**(b) Minimum resultant:** 450 - 240 = **210 N** (opposite)
**(c) At right angles:** √(450² + 240²) = **510 N**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Measurement and Instruments",
                content: `## Choosing the Right Tool

The precision of an instrument must match the measurement being made.

### Common Measuring Instruments

| Instrument | Typical Resolution | Used For |
|------------|-------------------|----------|
| Metre rule | 0.5 mm - 1 mm | Lengths > 10 cm |
| Vernier calipers | 0.1 mm or 0.02 mm | Small lengths, diameters |
| Micrometer | 0.01 mm | Very small lengths |
| Top-pan balance | 0.1 g or 0.01 g | Mass |
| Stopwatch | 0.01 s | Time intervals |
| Ammeter | varies | Electric current |
| Voltmeter | varies | Potential difference |

### Choosing the Right Instrument

**Principle:** Instrument precision must be appropriate for the quantity.

Example: To measure hair diameter (~0.05 mm):
- Metre rule (0.5 mm precision): ❌ Useless
- Micrometer (0.01 mm precision): ✓ Appropriate

### Reading Scales

**Metre rule:** Read to nearest 0.5 mm
**Vernier:** Align marks to get additional precision
**Micrometer:** Read main scale + thimble scale

### Key Skill

Always estimate the uncertainty of your measuring instrument:
- Usually ± half the smallest division
- Or ± the smallest division for digital instruments`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Errors and Uncertainties",
                content: `## No Measurement is Perfect

All measurements have associated errors and uncertainties.

### Types of Errors

**Systematic Errors:**
- Consistent offset in ONE direction
- Cannot be reduced by averaging
- Examples: zero error, calibration error
- Must be identified and corrected

**Random Errors:**
- Scatter of readings around true value
- CAN be reduced by averaging multiple readings
- Examples: reaction time, reading fluctuations

### Accuracy vs Precision

**Accuracy:** How close to the TRUE value
**Precision:** How small the SPREAD of values

| Scenario | Accuracy | Precision |
|----------|----------|-----------|
| Tight cluster near target | High | High |
| Tight cluster far from target | Low | High |
| Wide scatter around target | High | Low |
| Wide scatter far from target | Low | Low |

### Expressing Uncertainty

**Absolute uncertainty:** Δx (e.g., 20.0 ± 0.1 cm)
**Fractional uncertainty:** Δx/x
**Percentage uncertainty:** (Δx/x) × 100%

### Combining Uncertainties (MEMORISE THESE!)

**Addition/Subtraction:** Add absolute uncertainties
- If x = y ± z, then **Δx = Δy + Δz**

**Multiplication/Division:** Add percentage uncertainties
- If x = yz or x = y/z, then **Δx/x = Δy/y + Δz/z**

**Powers:** Multiply percentage uncertainty by power
- If x = yⁿ, then **Δx/x = n × (Δy/y)**

---

### Worked Example

Calculate g = 4π²l/T² where l has 1% uncertainty and T has 2% uncertainty.

% uncertainty in g = % in l + 2 × (% in T)
= 1% + 2 × 2% = **5%**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Significant Figures",
                content: `## Precision in Calculation

Calculated results must reflect the precision of input measurements.

### The Rule

**The number of significant figures in a result should not exceed the least number of significant figures in the input data.**

### Counting Significant Figures

| Number | Sig Figs | Notes |
|--------|----------|-------|
| 1234 | 4 | All non-zero digits count |
| 1200 | 2 (usually) | Trailing zeros ambiguous |
| 1.2 × 10³ | 2 | Use scientific notation |
| 0.0034 | 2 | Leading zeros don't count |
| 3.400 | 4 | Trailing zeros after decimal count |
| 100.0 | 4 | Zeros between/after decimal count |

### Example Calculation

Distance = 4.51 m (3 s.f.)
Time = 2.1 s (2 s.f.)

Speed = 4.51/2.1 = 2.1476... m s⁻¹

**Answer: 2.1 m s⁻¹** (2 s.f. — matches lowest precision)

### Common Mistakes

❌ Writing 2.147619 m s⁻¹ (too many figures)
❌ Writing 2 m s⁻¹ (too few figures)
✓ Writing 2.1 m s⁻¹ (appropriate precision)

### Intermediate Calculations

Keep extra figures DURING calculations to avoid rounding errors. Round only the FINAL answer.

### Exam Tip

Quoting a result to 6 significant figures when your data has only 2 signals you don't understand experimental precision — and costs marks!`,
                diagrams: [],
                subsections: []
            },
            {
                title: "9. Orders of Magnitude",
                content: `## A Sense of Scale

**Order of magnitude** is a quantity's value expressed as the nearest power of ten.

### Purpose

- Quick comparisons without precise figures
- Checking if answers are "in the ballpark"
- Understanding the scale of physical phenomena

### Estimation Examples

You should be able to estimate:

| Quantity | Estimate |
|----------|----------|
| Mass of an apple | ~0.2 kg ≈ 10⁻¹ kg |
| Height of a person | ~2 m ≈ 10⁰ m |
| Speed of walking | ~1.5 m s⁻¹ ≈ 10⁰ m s⁻¹ |
| Thickness of paper | ~0.1 mm ≈ 10⁻⁴ m |

### Range of Lengths

| Object | Length (m) |
|--------|------------|
| Observable universe | 4 × 10²⁶ |
| Earth diameter | 1.3 × 10⁷ |
| Human height | 2 × 10⁰ |
| Human hair diameter | 5 × 10⁻⁵ |
| Atom | 1 × 10⁻¹⁰ |
| Nucleus | 6 × 10⁻¹⁵ |

### Range of Masses

| Object | Mass (kg) |
|--------|-----------|
| Sun | 2 × 10³⁰ |
| Earth | 6 × 10²⁴ |
| Human | 7 × 10¹ |
| Apple | 2 × 10⁻¹ |
| Proton | 1.7 × 10⁻²⁷ |
| Electron | 9 × 10⁻³¹ |

### Comparing Orders of Magnitude

If A = 10⁶ and B = 10³, then A is **3 orders of magnitude** larger than B.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "10. Dimensional Analysis",
                content: `## Checking Equation Validity

**Dimensional analysis** uses the principle that valid equations must have the same base units on both sides.

### The Principle of Homogeneity

For an equation to be physically valid, **every term must have the same SI base units**.

### Testing an Equation

**Example:** Test s = ut + ½at²

**Term 1:** s (displacement) = m

**Term 2:** ut = (m s⁻¹)(s) = m ✓

**Term 3:** ½at² = (m s⁻²)(s²) = m ✓

All terms have units of metres → **equation is homogeneous** ✓

### Finding Unknown Units

If an equation is known to be correct, we can find the units of an unknown quantity.

**Example:** T = 2π√(I/Mgh). Find the units of I.

Step 1: Square both sides
T² = 4π²(I/Mgh)

Step 2: Rearrange for I
I = T²Mgh

Step 3: Substitute base units
I = (s²)(kg)(m s⁻²)(m)
I = kg × m² × s² × s⁻²
I = **kg m²**

### What Dimensional Analysis Can Do

✓ Check if an equation is valid
✓ Find units of unknown quantities
✓ Derive possible forms of equations

### What It Cannot Do

✗ Give you numerical constants (like 2π or ½)
✗ Confirm equation is correct (only that it's consistent)
✗ Distinguish between different possible equations`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Physical quantity = numerical magnitude + unit",
            "Seven SI base units: kg, m, s, A, K, mol, cd",
            "Derived units are combinations of base units (e.g., N = kg m s⁻²)",
            "Know all prefixes from pico (10⁻¹²) to tera (10¹²)",
            "For areas/volumes: square/cube the conversion factor",
            "Scalars have magnitude only; vectors have magnitude AND direction",
            "Systematic errors cause offset; random errors cause scatter",
            "Add absolute uncertainties for +/-; add % uncertainties for ×/÷",
            "Significant figures in answer ≤ least precise input",
            "Homogeneous equations have same base units on both sides"
        ],
        exam_tips: [
            "ALWAYS square/cube conversion factors for area/volume (1 cm² = 10⁻⁴ m²)",
            "Know the difference between scalar and vector — direction matters!",
            "Memorise uncertainty combination rules: ADD absolute for ±; ADD % for ×÷",
            "For powers, MULTIPLY the percentage uncertainty by the power",
            "Label graph axes and table columns as: quantity / unit (e.g., v / m s⁻¹)",
            "Use dimensional analysis to check your derived equations"
        ]
    },
    "Kinematics": {
        topic: "Kinematics",
        subject: "A Level Physics",
        summary: "Kinematics is the branch of physics that describes the motion of objects without considering the forces that cause the motion. This topic covers displacement, velocity, acceleration, motion graphs, the SUVAT equations for uniform acceleration, and motion under gravity. These concepts form the foundational language for analyzing and predicting the movement of objects in mechanics.",
        sections: [
            {
                title: "1. Introduction to Kinematics",
                content: `## Describing Motion

**Kinematics** is the study of motion without considering the forces that cause it.

### Core Kinematic Quantities

Motion is described using three key quantities:
1. **Displacement** — where? (position change)
2. **Velocity** — how fast and which direction?
3. **Acceleration** — how is velocity changing?

### Kinematics vs Dynamics

| Branch | Describes | Key Question |
|--------|-----------|--------------|
| Kinematics | How motion occurs | "How fast? How far?" |
| Dynamics | Why motion occurs | "What force caused it?" |

Kinematics focuses on describing motion; dynamics explains why motion happens (using Newton's Laws).

### Applications

Kinematics is used for:
- Calculating braking distances
- Analyzing projectile motion
- Predicting positions of moving objects
- Designing transportation systems

### Why This Topic Matters

Kinematics provides the mathematical language for all mechanics problems. You cannot study forces (dynamics) without first understanding how to describe motion (kinematics).`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Distance and Displacement",
                content: `## The Difference Between Path and Position

### Definitions

**Distance:** Total length along the actual path travelled (scalar)

**Displacement:** Change in position from start to end point (vector)

### Key Differences

| Property | Distance | Displacement |
|----------|----------|--------------|
| Type | Scalar | Vector |
| Direction | None | Required |
| Path | Total path length | Straight line |
| Can be negative | No | Yes |

### Example

A car travels 8 km east, then 6 km north.

**Distance:** 8 + 6 = **14 km** (total path)

**Displacement:**
- Magnitude: √(8² + 6²) = √100 = **10 km**
- Direction: tan⁻¹(6/8) = **36.9° north of east**

### Vector Nature of Displacement

Displacement must include:
1. Magnitude (how far)
2. Direction (which way)

Without direction, you only have distance, not displacement.

### Sign Conventions

Define a positive direction (e.g., right = positive):
- Movement in positive direction → positive displacement
- Movement in opposite direction → negative displacement

### Exam Tip

Always specify direction for displacement. "10 m" is incomplete; "10 m to the right" or "10 m at 30° to horizontal" is correct.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Speed and Velocity",
                content: `## Rate of Motion

### Definitions

**Speed:** Rate of change of distance (scalar)

**Velocity:** Rate of change of displacement (vector)

### Formulas

**Average Speed:**
**Average speed = Total distance / Total time**

**Average Velocity:**
**Average velocity = Total displacement / Total time**

### Key Distinction

| Property | Speed | Velocity |
|----------|-------|----------|
| Type | Scalar | Vector |
| Direction | None | Required |
| Can be negative | No | Yes |
| What it measures | How fast | How fast AND which direction |

### Units

SI unit: **m s⁻¹** (metres per second)

### Why the Distinction Matters

An object can have:
- **Constant speed but changing velocity** (circular motion — direction changes)
- **Zero average velocity but non-zero average speed** (returning to start)

### Example

A runner completes a 400 m track in 50 s, ending at the start.

- Average speed = 400/50 = **8 m s⁻¹**
- Average velocity = 0/50 = **0 m s⁻¹** (displacement is zero!)

### Instantaneous vs Average

**Instantaneous velocity:** Velocity at a specific moment (gradient of displacement-time graph at a point)

**Average velocity:** Overall velocity for the whole journey`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Acceleration",
                content: `## Rate of Change of Velocity

### Definition

**Acceleration** is the rate of change of velocity.

### Formula

**a = (v - u) / t**

Where:
- a = acceleration (m s⁻²)
- v = final velocity (m s⁻¹)
- u = initial velocity (m s⁻¹)
- t = time taken (s)

### Units

SI unit: **m s⁻²** (metres per second squared)

### Vector Nature

Acceleration is a **vector** — it has direction.

The direction of acceleration is the direction of the change in velocity.

### Types of Acceleration

| Situation | Acceleration | Description |
|-----------|--------------|-------------|
| Speeding up | Positive | Velocity increasing |
| Slowing down | Negative (deceleration) | Velocity decreasing |
| Changing direction | Present | Even if speed is constant |
| Constant velocity | Zero | No change in velocity |

### Negative Acceleration (Deceleration)

When an object slows down:
- Final velocity < Initial velocity
- a = (v - u)/t gives a negative value
- The object is decelerating

### Example

A car slows from 20 m s⁻¹ to 8 m s⁻¹ in 4 s.

a = (8 - 20)/4 = -12/4 = **-3 m s⁻²**

The negative sign indicates deceleration.

### Uniform vs Non-Uniform Acceleration

**Uniform acceleration:** Constant rate of change of velocity (SUVAT applies)

**Non-uniform acceleration:** Varying rate (requires calculus or graphs)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Motion Graphs",
                content: `## Visualizing Motion

Motion graphs allow us to extract kinematic information visually.

### Displacement-Time Graphs

**Gradient = Velocity**

| Feature | Meaning |
|---------|---------|
| Horizontal line | Stationary (v = 0) |
| Straight diagonal line | Constant velocity |
| Curved line | Changing velocity (acceleration) |
| Positive gradient | Moving in positive direction |
| Negative gradient | Moving in negative direction |

### Velocity-Time Graphs

**Gradient = Acceleration**
**Area under curve = Displacement**

| Feature | Meaning |
|---------|---------|
| Horizontal line | Constant velocity (a = 0) |
| Straight diagonal line | Constant acceleration |
| Positive gradient | Accelerating |
| Negative gradient | Decelerating |
| Above time axis | Positive velocity |
| Below time axis | Negative velocity |

### Calculating Area Under v-t Graph

For irregular shapes, split into:
- **Rectangles:** Area = base × height
- **Triangles:** Area = ½ × base × height
- **Trapezoids:** Area = ½(a + b) × h

### Worked Example

A car accelerates uniformly from 0 to 20 m s⁻¹ in 10 s, then travels at constant 20 m s⁻¹ for 5 s.

**Total displacement:**
- Triangle (0-10 s): ½ × 10 × 20 = 100 m
- Rectangle (10-15 s): 5 × 20 = 100 m
- Total: **200 m**

### Graph Axis Labels

Use Cambridge convention:
- Time axis: **t / s**
- Velocity axis: **v / m s⁻¹**
- Displacement axis: **s / m**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Equations of Motion (SUVAT)",
                content: `## The Five SUVAT Equations

These equations solve problems involving **constant (uniform) acceleration** in a straight line.

### The Variables

| Symbol | Quantity | Unit |
|--------|----------|------|
| s | Displacement | m |
| u | Initial velocity | m s⁻¹ |
| v | Final velocity | m s⁻¹ |
| a | Acceleration | m s⁻² |
| t | Time | s |

### The Equations

**Equation 1:** v = u + at

**Equation 2:** s = ut + ½at²

**Equation 3:** v² = u² + 2as

**Equation 4:** s = ½(u + v)t

### Which Equation to Use

| Missing Variable | Use Equation |
|------------------|--------------|
| s | v = u + at |
| t | v² = u² + 2as |
| v | s = ut + ½at² |
| a | s = ½(u + v)t |
| u | s = vt - ½at² |

### CRITICAL: Conditions for Use

✓ Motion must be in a **straight line**
✓ Acceleration must be **constant**

### Worked Example

A car accelerates from rest to 6.0 m s⁻¹ in 1.5 s. Find displacement.

**Given:** u = 0, v = 6.0 m s⁻¹, t = 1.5 s
**Find:** s

**Method 1:** Using s = ½(u + v)t
s = ½(0 + 6.0)(1.5) = **4.5 m**

**Method 2:** First find a, then use s = ut + ½at²
a = (6.0 - 0)/1.5 = 4.0 m s⁻²
s = 0(1.5) + ½(4.0)(1.5)² = **4.5 m**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Motion Under Gravity",
                content: `## Free Fall

All objects near Earth's surface experience the same gravitational acceleration (ignoring air resistance).

### Acceleration of Free Fall

**g ≈ 9.81 m s⁻²** (downward)

Key insight: All objects fall at the same rate regardless of mass (Galileo's discovery)

### Sign Conventions (CRUCIAL!)

Define a positive direction FIRST, then apply consistently.

**Convention 1: Upward positive**
- Upward displacement/velocity: positive
- Downward displacement/velocity: negative
- g = **-9.81 m s⁻²**

**Convention 2: Downward positive**
- Downward displacement/velocity: positive
- Upward displacement/velocity: negative
- g = **+9.81 m s⁻²**

### Object Thrown Upward

At maximum height:
- Instantaneous velocity v = 0
- Object momentarily stationary before falling

### Worked Example

Ball thrown upward at 18.0 m s⁻¹. Find maximum height.

**Given:** u = +18.0 m s⁻¹, v = 0 (at max height), a = -9.81 m s⁻²

**Using v² = u² + 2as:**
0 = (18.0)² + 2(-9.81)s
0 = 324 - 19.62s
s = 324/19.62 = **16.5 m**

### Symmetry of Vertical Motion

For an object thrown upward (no air resistance):
- Time up = Time down
- Speed leaving ground = Speed returning
- Path up mirrors path down

### Exam Tip

Always state your sign convention explicitly in exam answers!`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Experimental Methods",
                content: `## Measuring Kinematic Quantities

### Methods for Measuring g

**1. Light Gates**
- Steel sphere released through two light gates
- Gates measure time to travel known distance
- Use SUVAT equations to calculate g

**2. Stroboscope Photography**
- Strobe flashes at known frequency
- Camera captures ball positions at equal time intervals
- Measure positions against metre rule
- Plot graph and calculate g from gradient

**3. Ticker Timer**
- Tape attached to falling object
- Timer marks dots at regular intervals (e.g., 50 Hz)
- Measure distances between dots
- Calculate velocity and acceleration

### Sources of Error

**Systematic Errors:**
- Zero error on measuring instruments
- Consistently wrong calibration
- Cannot be reduced by averaging

**Random Errors:**
- Reaction time in starting/stopping timer
- Parallax when reading scales
- Air currents affecting motion
- CAN be reduced by averaging multiple readings

### Improving Experiments

| Improvement | Effect |
|-------------|--------|
| Multiple readings | Reduces random error |
| Longer distances | Reduces percentage uncertainty |
| Electronic timing | Eliminates reaction time |
| Vacuum conditions | Eliminates air resistance |

### Accuracy vs Precision

**Accuracy:** How close to true value
**Precision:** How reproducible (small spread)

High precision ≠ High accuracy!
(Consistent but wrong values = precise but inaccurate)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "9. Key Formulae and Exam Tips",
                content: `## Quick Reference

### SUVAT Equations

| Equation | Missing Variable |
|----------|------------------|
| v = u + at | s |
| s = ut + ½at² | v |
| v² = u² + 2as | t |
| s = ½(u + v)t | a |

### Kinematic Quantities Summary

| Quantity | Type | Definition |
|----------|------|------------|
| Distance | Scalar | Total path length |
| Displacement | Vector | Change in position |
| Speed | Scalar | Rate of change of distance |
| Velocity | Vector | Rate of change of displacement |
| Acceleration | Vector | Rate of change of velocity |

### Graph Relationships

| Graph | Gradient | Area |
|-------|----------|------|
| s-t | Velocity | — |
| v-t | Acceleration | Displacement |
| a-t | — | Change in velocity |

### Common Exam Errors

❌ Forgetting direction for vectors
❌ Using SUVAT for non-uniform acceleration
❌ Wrong sign for g (inconsistent convention)
❌ Wrong unit conversions (km/h to m/s)
❌ Confusing speed with velocity

### Unit Conversions

- km/h to m/s: divide by 3.6
- m/s to km/h: multiply by 3.6

### Problem-Solving Strategy

1. Draw a diagram
2. List known values (s, u, v, a, t)
3. Identify what you need to find
4. Choose appropriate equation
5. Substitute values carefully
6. Check units and sign of answer`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Distance is scalar (total path); displacement is vector (straight-line change in position)",
            "Speed is scalar (rate of change of distance); velocity is vector (rate of change of displacement)",
            "Acceleration = (v - u)/t; it's a vector with direction",
            "Gradient of s-t graph = velocity; gradient of v-t graph = acceleration",
            "Area under v-t graph = displacement",
            "SUVAT equations: v = u + at, s = ut + ½at², v² = u² + 2as, s = ½(u + v)t",
            "SUVAT only works for CONSTANT acceleration in a STRAIGHT LINE",
            "Acceleration of free fall g ≈ 9.81 m s⁻² (downward)",
            "Always define sign convention for vertical motion problems",
            "At maximum height of vertical motion, instantaneous velocity = 0"
        ],
        exam_tips: [
            "Always specify direction for vectors (displacement, velocity, acceleration)",
            "State your sign convention explicitly in vertical motion problems",
            "Remember: SUVAT only applies to UNIFORM (constant) acceleration",
            "Check if question asks for speed or velocity — they need different treatment",
            "For multi-part journeys, apply SUVAT to each part separately",
            "Common trap: at max height v = 0, but a = g (not zero!)"
        ]
    },
    "Dynamics": {
        topic: "Dynamics",
        subject: "A Level Physics",
        summary: "Dynamics is the branch of mechanics that explains WHY objects move by examining forces. This topic covers Newton's three laws of motion, types of forces, free-body diagrams, the distinction between mass and weight, friction and drag, terminal velocity, momentum, and equilibrium. These principles form the foundation for understanding how forces govern all motion from everyday objects to astronomical bodies.",
        sections: [
            {
                title: "1. Introduction to Dynamics",
                content: `## The Study of Forces and Motion

**Dynamics** explains WHY objects move by studying the forces that cause motion.

### Kinematics vs Dynamics

| Aspect | Kinematics | Dynamics |
|--------|------------|----------|
| Core Question | How do objects move? | Why do objects move? |
| Focus | Description of motion | Causes of motion |
| Key Quantities | s, v, a, t | Force, mass, momentum |
| Governing Laws | SUVAT equations | Newton's Laws |

### Why Dynamics Matters

Dynamics allows us to:
- Predict motion from known forces
- Calculate forces from observed motion
- Design structures, vehicles, and machines
- Understand everything from car brakes to rocket launches

### The Role of Force

**Force** is the agent that causes a change in motion.

Effects of forces:
1. **Acceleration** — change in velocity
2. **Deformation** — change in shape
3. **Stretching** — extension of materials

Without a net force, motion continues unchanged (Newton's First Law).`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Types of Forces",
                content: `## Common Forces in A-Level Physics

### Contact vs Non-Contact Forces

| Type | Examples |
|------|----------|
| Contact | Normal reaction, tension, friction, drag |
| Non-Contact | Weight (gravity), electromagnetic forces |

### Key Forces

**Weight (W)**
- Gravitational force on a mass
- Always acts downward (toward Earth's center)
- Vector quantity
- W = mg

**Normal Reaction (R or N)**
- Perpendicular force from a surface
- Prevents objects passing through surfaces
- Acts perpendicular to contact surface

**Tension (T)**
- Pulling force in strings, ropes, cables
- Acts along the length of the string
- Same throughout an ideal string

**Friction**
- Opposes relative motion between surfaces
- Acts parallel to contact surface
- Can be static (no motion) or kinetic (sliding)

**Air Resistance (Drag)**
- Opposes motion through air
- Increases with speed
- Depends on shape and surface area

**Thrust**
- Propulsive force (e.g., from engines)
- Reaction to ejected matter (Newton's 3rd Law)

### Units

All forces measured in **newtons (N)**

1 N = 1 kg m s⁻² (force to accelerate 1 kg at 1 m s⁻²)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Free-Body Diagrams",
                content: `## Visualizing Forces

A **free-body diagram** shows ALL external forces acting on a single object.

### How to Draw a Free-Body Diagram

1. **Isolate the object** — draw it as a point or simple shape
2. **Draw force arrows** — from the object, in correct directions
3. **Label each force** — use standard symbols (W, R, T, f)
4. **Show relative magnitudes** — longer arrows for larger forces

### Rules

✓ Show only forces ON the object
✗ Don't show forces BY the object
✗ Don't show internal forces

### Example: Book on a Table

Forces on the book:
- Weight W (downward) — gravitational pull
- Normal reaction R (upward) — from table surface

If R = W, the book is in equilibrium.

### Common Force Systems

**Object on horizontal surface:**
- Weight (down)
- Normal reaction (up)
- Friction (opposing motion)
- Applied force (if pushed)

**Object on inclined plane:**
- Weight (vertically down)
- Normal reaction (perpendicular to surface)
- Friction (along surface, opposing motion)

### Key Insight

Free-body diagrams are ESSENTIAL for solving dynamics problems. Always draw one first!`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Newton's Laws of Motion",
                content: `## The Three Laws

### Newton's First Law (Law of Inertia)

**"Every object continues in its state of rest, or with uniform velocity, unless acted upon by a resultant force."**

Key concepts:
- **Inertia** — resistance to change in motion
- **Mass** measures inertia
- Zero resultant force → zero acceleration

### Newton's Second Law

**"The resultant force on an object is proportional to the rate of change of its momentum."**

**F = Δp/Δt** (fundamental form)

For constant mass:
**F = ma**

Where:
- F = resultant force (N)
- m = mass (kg)
- a = acceleration (m s⁻²)

Force and acceleration are in the SAME direction.

### Newton's Third Law

**"When one object exerts a force on another, the second object exerts an equal and opposite force on the first."**

Properties of action-reaction pairs:
- Equal magnitude
- Opposite direction
- Act on DIFFERENT objects
- Same type of force

### Common Misconception

Action-reaction forces do NOT cancel out because they act on different objects!

### Example: Book on Table

- Book pushes table DOWN (normal force from book)
- Table pushes book UP (normal force from table)

These are an action-reaction pair.

The book's weight and the normal force on the book are NOT a pair (both act on the book).`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Mass and Weight",
                content: `## Two Different Quantities

This distinction is CRITICAL — confusing them loses marks!

### Definitions

**Mass (m):** Property that resists change in motion (inertia)

**Weight (W):** Gravitational force on an object

### Key Differences

| Property | Mass | Weight |
|----------|------|--------|
| Type | Scalar | Vector |
| SI Unit | kg | N |
| Location dependence | Constant everywhere | Varies with g |
| Measurement | Balance | Spring balance |
| What it measures | Amount of matter | Gravitational force |

### The Relationship

**W = mg**

Where:
- W = weight (N)
- m = mass (kg)
- g = gravitational field strength (N kg⁻¹)

At Earth's surface: g ≈ 9.81 N kg⁻¹

### Examples

A 1 kg mass has weight:
- On Earth: W = 1 × 9.81 = 9.81 N
- On Moon: W = 1 × 1.62 = 1.62 N
- In deep space: W ≈ 0 N

But mass remains 1 kg everywhere!

### Common Exam Error

"5 kg weight" is WRONG — weight is in newtons!
"5 kg mass" or "49 N weight" is correct.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Friction and Drag",
                content: `## Resistive Forces

### Friction

Force that opposes relative motion between surfaces in contact.

**Direction:** Opposite to motion (or attempted motion)

**Types:**
- Static friction — prevents motion starting
- Kinetic friction — opposes sliding motion

Static friction can vary up to a maximum value.

### Air Resistance (Drag)

Force opposing motion through air (or any fluid).

**Key relationship:** Drag INCREASES with speed

At low speeds: F_drag ∝ v
At high speeds: F_drag ∝ v²

### Terminal Velocity

When drag force equals weight, acceleration becomes zero.

**Process for a falling object:**

1. **Initially:** Weight >> Drag, large acceleration downward
2. **Speeding up:** Drag increases with speed
3. **Eventually:** Weight = Drag, acceleration = 0
4. **Result:** Constant speed = **terminal velocity**

### Reaching Terminal Velocity

| Phase | Weight vs Drag | Resultant Force | Acceleration |
|-------|----------------|-----------------|--------------|
| Start | W >> D | Large downward | Large |
| Middle | W > D | Smaller downward | Smaller |
| Terminal | W = D | Zero | Zero |

### Practical Example: Skydiver

- Terminal velocity ~55 m s⁻¹ (body spread)
- Opens parachute → surface area increases → drag increases
- Drag > Weight → net upward force → deceleration
- New terminal velocity ~5 m s⁻¹`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Linear Momentum",
                content: `## The "Quantity of Motion"

### Definition

**Momentum (p)** = mass × velocity

**p = mv**

Where:
- p = momentum (kg m s⁻¹)
- m = mass (kg)
- v = velocity (m s⁻¹)

Momentum is a **vector** — direction matters!

### Newton's Second Law (Momentum Form)

**F = Δp/Δt**

Force equals rate of change of momentum.

This is more fundamental than F = ma because it works when mass changes (e.g., rockets).

### Impulse

**Impulse = FΔt = Δp**

Impulse is the change in momentum.

Units: N s or kg m s⁻¹ (equivalent)

### Conservation of Momentum

**In an isolated system (no external forces), total momentum is conserved.**

m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂

### Types of Collisions

**Elastic collision:**
- Momentum conserved ✓
- Kinetic energy conserved ✓

**Inelastic collision:**
- Momentum conserved ✓
- Kinetic energy NOT conserved ✗

### Worked Example

Bullet (12 g, 180 m s⁻¹) hits stationary block (2000 g) and embeds.

m₁u₁ + m₂u₂ = (m₁ + m₂)v
(0.012)(180) + (2.0)(0) = (2.012)v
2.16 = 2.012v
v = **1.07 m s⁻¹**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Equilibrium",
                content: `## When Forces Balance

### Definition

An object is in **equilibrium** when:
1. Resultant force = 0 (no linear acceleration)
2. Resultant moment = 0 (no rotational acceleration)

### Types of Equilibrium

**Static equilibrium:** Object at rest (v = 0, a = 0)

**Dynamic equilibrium:** Object moving at constant velocity (v ≠ 0, a = 0)

Both satisfy Newton's First Law — no net force.

### Conditions for Equilibrium

For translational equilibrium:
- ΣF_x = 0 (horizontal forces balance)
- ΣF_y = 0 (vertical forces balance)

For rotational equilibrium:
- Σ(clockwise moments) = Σ(anticlockwise moments)

### Three Coplanar Forces in Equilibrium

When three forces act on a body in equilibrium, they form a **closed vector triangle**.

Draw forces head-to-tail → they form a closed loop.

### Resolving for Equilibrium

For a body on an inclined plane at angle θ:

**Parallel to slope:** F_parallel = mg sin θ
**Perpendicular to slope:** F_perp = mg cos θ

For equilibrium:
- Normal reaction R = mg cos θ
- Friction f = mg sin θ (if stationary)

### The Principle of Moments

For rotational equilibrium about any point:

**Sum of clockwise moments = Sum of anticlockwise moments**

Moment = Force × Perpendicular distance from pivot`,
                diagrams: [],
                subsections: []
            },
            {
                title: "9. Problem-Solving Methodology",
                content: `## Systematic Approach

### Steps for Dynamics Problems

1. **Draw a free-body diagram** — show ALL forces on the object
2. **Choose coordinate axes** — define positive directions
3. **Resolve forces** — break into x and y components
4. **Apply Newton's Laws:**
   - If accelerating: ΣF = ma
   - If in equilibrium: ΣF = 0
5. **Solve equations** — find unknowns

### Worked Example: Braking Car

A 1500 kg car traveling at 80 km/h brakes to rest in 11 s. Find the braking force.

**Step 1:** Convert units
u = 80 km/h = 80/3.6 = 22 m s⁻¹

**Step 2:** Find acceleration
v = u + at
0 = 22 + a(11)
a = -2.0 m s⁻²

**Step 3:** Apply F = ma
F = 1500 × (-2.0) = **-3000 N**

Magnitude of braking force = 3.0 kN

### Connected Systems

For objects connected by strings:
- Same acceleration (if string is taut)
- Tension is same throughout (ideal string)
- Apply F = ma to EACH object separately

### Inclined Planes

For mass m on plane at angle θ:
- Component down slope: mg sin θ
- Component into slope: mg cos θ

If sliding without friction:
a = g sin θ`,
                diagrams: [],
                subsections: []
            },
            {
                title: "10. Key Formulae and Exam Practice",
                content: `## Quick Reference

### Essential Equations

| Formula | Description |
|---------|-------------|
| F = ma | Newton's Second Law (constant mass) |
| F = Δp/Δt | Newton's Second Law (general) |
| p = mv | Momentum |
| W = mg | Weight |
| Impulse = FΔt = Δp | Impulse-momentum |

### Common Exam Errors

❌ Confusing mass (kg) and weight (N)
❌ Putting action-reaction on same free-body diagram
❌ Forgetting that acceleration has direction
❌ Not converting units (km/h to m/s)
❌ Sign errors with vectors

### Exam Practice

**Q1:** Ball (45 g, 12 m s⁻¹) hits wall at 30° and rebounds at same speed/angle. Contact time = 15 ms. Find impulse and force.

**Solution:**
- Change in perpendicular velocity = 12cos60° - (-12cos60°) = 12 m s⁻¹
- Δp = mΔv = 0.045 × 12 = **0.54 kg m s⁻¹**
- F = Δp/Δt = 0.54/0.015 = **36 N**

**Q2:** Two balls X (50g, +4.5 m s⁻¹) and Y (M, -2.8 m s⁻¹) collide. After: X at -1.8 m s⁻¹, Y at +1.4 m s⁻¹. Find M.

**Solution:**
Conservation of momentum:
50(4.5) + M(-2.8) = 50(-1.8) + M(1.4)
225 - 2.8M = -90 + 1.4M
315 = 4.2M
M = **75 g**`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Dynamics explains WHY objects move (forces); kinematics describes HOW they move",
            "Newton's 1st Law: Objects stay at rest or constant velocity unless acted on by resultant force",
            "Newton's 2nd Law: F = ma (constant mass) or F = Δp/Δt (general)",
            "Newton's 3rd Law: Action-reaction pairs are equal, opposite, and act on DIFFERENT objects",
            "Mass (kg) is a scalar measure of inertia; Weight (N) is the gravitational force = mg",
            "Free-body diagrams show all forces ON an object only",
            "Terminal velocity: when drag = weight, so acceleration = 0",
            "Momentum p = mv is conserved in isolated systems",
            "Equilibrium: resultant force = 0 AND resultant moment = 0",
            "Impulse = FΔt = change in momentum"
        ],
        exam_tips: [
            "Always draw a free-body diagram FIRST — most errors come from missing forces",
            "Weight and normal reaction are NOT an action-reaction pair (both act on same object)",
            "Use F = Δp/Δt when mass changes (rockets); use F = ma when mass is constant",
            "State your sign convention clearly in calculations",
            "Check units: mass in kg, weight in N, speed in m s⁻¹",
            "For inclined planes: weight component down slope = mg sin θ"
        ]
    },
    "Force, Density and Pressure": {
        topic: "Force, Density and Pressure",
        subject: "A Level Physics",
        summary: "Force, density, and pressure are foundational concepts in mechanics and fluid dynamics. This topic covers types of forces, free-body diagrams, density calculations, pressure in solids and liquids, hydrostatic pressure (Δp = ρgh), upthrust and Archimedes' principle, gas pressure from a molecular perspective, and practical applications. These principles explain everything from floating and sinking to the immense pressures at ocean depths.",
        sections: [
            {
                title: "1. Forces - Review and Applications",
                content: `## Introduction to Forces

A **force** is an interaction that can change the motion or shape of an object.

### Effects of Forces

1. **Change in motion** — causes acceleration (F = ma)
2. **Deformation** — changes shape or size

### Contact vs Non-Contact Forces

| Type | Examples |
|------|----------|
| Contact | Friction, tension, normal reaction |
| Non-Contact | Weight (gravity), electromagnetic |

### Common Forces in Mechanics

**Weight (W)**
- Force of gravity on an object
- Always acts vertically downward
- W = mg

**Normal Reaction (R or N)**
- Perpendicular force from a surface
- Prevents objects passing through

**Tension (T)**
- Pulling force in strings/ropes
- Acts along the string length

**Friction**
- Opposes motion between surfaces
- Acts parallel to surfaces

**Upthrust (Buoyancy)**
- Upward force from a fluid
- Opposes weight of immersed object

**Drag / Air Resistance**
- Opposes motion through fluids
- Increases with speed`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Free-Body Diagrams",
                content: `## Essential Tool for Mechanics

A **free-body diagram** shows ALL forces acting on a single object.

### How to Draw Free-Body Diagrams

1. Represent object as a point or simple shape
2. Draw force arrows from the object
3. Show direction and relative magnitude
4. Label each force clearly

### Rules

✓ Show only forces ON the object
✗ Don't show forces BY the object
✗ Don't include internal forces

### Using Free-Body Diagrams

Once drawn:
1. Resolve forces into perpendicular components
2. Apply Newton's Laws:
   - If ΣF = 0 → equilibrium (constant velocity)
   - If ΣF ≠ 0 → acceleration (F = ma)

### Common Setups

**Object on surface:**
- Weight (down)
- Normal reaction (up)
- Friction (if moving/attempting to move)

**Object on incline:**
- Weight (vertically down)
- Normal reaction (perpendicular to surface)
- Friction (parallel to surface)

### Exam Tip

Drawing a correct free-body diagram is the FIRST step to solving ANY mechanics problem. Get this wrong and everything else fails!`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Density",
                content: `## Mass Per Unit Volume

### Definition

**Density (ρ)** is the mass per unit volume of a substance.

### Formula

**ρ = m / V**

Where:
- ρ = density (kg m⁻³)
- m = mass (kg)
- V = volume (m³)

### SI Units

Density: **kg m⁻³**

Common alternative: g cm⁻³
Conversion: 1 g cm⁻³ = 1000 kg m⁻³

### Measuring Density

**Regular solids:**
- Measure mass (balance)
- Calculate volume from dimensions
- ρ = m/V

**Irregular solids:**
- Measure mass (balance)
- Use displacement method for volume
- Submerge in measuring cylinder
- Volume = final level - initial level

**Liquids:**
- Measure mass of empty cylinder
- Add liquid, measure combined mass
- Mass of liquid = difference
- Read volume from cylinder

### Typical Densities

| Substance | Density (kg m⁻³) |
|-----------|------------------|
| Air | 1.3 |
| Water | 1000 |
| Ice | 920 |
| Steel | 7800 |
| Lead | 11300 |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Pressure in Solids",
                content: `## Force Per Unit Area

### Definition

**Pressure** is the force acting perpendicularly per unit area.

### Formula

**p = F / A**

Where:
- p = pressure (Pa)
- F = force perpendicular to surface (N)
- A = area (m²)

### SI Unit

**Pascal (Pa)** = 1 N m⁻²

### Base Units

p = F/A → (kg m s⁻²)/m² = **kg m⁻¹ s⁻²**

### Understanding Pressure

Pressure depends on:
1. **Force** — more force = more pressure
2. **Area** — smaller area = more pressure

### Applications

**Sharp knife vs blunt knife:**
- Same force applied
- Sharp knife has smaller contact area
- Higher pressure → cuts more easily

**Snowshoes:**
- Spread weight over large area
- Lower pressure on snow → less sinking

### Worked Example

Concrete slab: 2.5 m × 2.5 m × 0.12 m, density 2200 kg m⁻³

Volume = 2.5 × 2.5 × 0.12 = 0.75 m³
Mass = 2200 × 0.75 = 1650 kg
Weight = 1650 × 9.81 = 16187 N

Maximum pressure (smallest face):
Area = 2.5 × 0.12 = 0.30 m²
p = 16187/0.30 = **5.4 × 10⁴ Pa**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Pressure in Liquids",
                content: `## Hydrostatic Pressure

Pressure in a liquid increases with depth due to the weight of liquid above.

### Derivation of Δp = ρgh

Consider a column of liquid:
- Height: h
- Cross-sectional area: A
- Density: ρ

Weight of column = mg = ρVg = ρAhg

Pressure = F/A = ρAhg/A = **ρgh**

### Formula

**Δp = ρgh**

Where:
- Δp = pressure difference (Pa)
- ρ = density of liquid (kg m⁻³)
- g = gravitational field strength (N kg⁻¹)
- h = vertical depth (m)

### Key Points

1. Pressure is **proportional to depth**
2. Pressure is **proportional to density**
3. Pressure is the **same at all points at the same depth**
4. Pressure acts **equally in all directions** at a point

### Applications

**Dam design:**
- Pressure greatest at base (largest h)
- Dam walls thicker at bottom

**Submarines:**
- Must withstand enormous pressures
- At 150 m: Δp = 1030 × 9.81 × 150 ≈ 1.5 MPa

### Total Pressure

Total pressure at depth h:
**p_total = p_atmospheric + ρgh**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Upthrust and Buoyancy",
                content: `## Why Objects Float

### Origin of Upthrust

**Upthrust** is caused by the pressure difference between top and bottom of a submerged object.

Since p = ρgh:
- Bottom of object is deeper → higher pressure
- Top of object is shallower → lower pressure
- Net upward force = **upthrust**

### Archimedes' Principle

**The upthrust on an object immersed in a fluid equals the weight of fluid displaced.**

### Formula for Upthrust

**F = ρ_fluid × g × V_displaced**

Where:
- F = upthrust (N)
- ρ_fluid = density of fluid (kg m⁻³)
- V_displaced = volume of fluid displaced (m³)

### Floating and Sinking

| Condition | Result |
|-----------|--------|
| Weight > Upthrust_max | Object sinks |
| Weight = Upthrust | Object floats |
| Weight < Upthrust (submerged) | Object rises |

### Density Rule

- Object sinks if: ρ_object > ρ_fluid
- Object floats if: ρ_object < ρ_fluid

### Worked Example

Metal cylinder: V = 0.50 m³, ρ_metal = 7800 kg m⁻³

**Force to lift in air:**
m = 7800 × 0.50 = 3900 kg
W = 3900 × 9.81 = **38300 N**

**Force to lift in water:** (ρ_water = 1000 kg m⁻³)
Upthrust = 1000 × 9.81 × 0.50 = 4905 N
Force needed = 38300 - 4905 = **33400 N**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Pressure in Gases",
                content: `## Molecular Explanation

Gas pressure arises from molecular collisions with container walls.

### Kinetic Theory Model

Key assumptions:
- Large number of identical molecules
- Continuous, rapid, random motion
- Collisions are elastic

### Origin of Gas Pressure

1. Molecules collide with container walls
2. Each collision involves change in momentum
3. Wall exerts force on molecule (Newton's 2nd Law)
4. Molecule exerts equal opposite force on wall (Newton's 3rd Law)
5. **Billions of collisions per second → measurable pressure**

### Factors Affecting Gas Pressure

**Decreasing Volume (constant T, n):**
- Molecules more closely packed
- More frequent wall collisions
- **Pressure increases**

**Increasing Temperature (constant V, n):**
- Molecules move faster
- More frequent AND more forceful collisions
- **Pressure increases**

**Increasing Number of Molecules (constant V, T):**
- More particles to collide with walls
- Higher collision rate
- **Pressure increases**

### Applications

**Car tyres:**
- Air compressed into fixed volume
- High collision rate with inner walls
- Creates pressure to support vehicle

**Inflating a balloon:**
- Adding molecules increases pressure
- Pressure pushes outward on elastic material
- Balloon expands`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Experimental Methods",
                content: `## Measuring Density and Pressure

### Key Instruments

| Instrument | Measures | Notes |
|------------|----------|-------|
| Top-pan balance | Mass | Zero before use |
| Measuring cylinder | Volume | Read at meniscus, eye level |
| Ruler/Calipers | Dimensions | Choose appropriate precision |
| Newton meter | Force/Weight | Check zero error |

### Sources of Error

**Systematic Errors:**
- Zero error on balance
- Miscalibrated instruments
- Cannot be reduced by averaging

**Random Errors:**
- Parallax error reading scales
- Reaction time in measurements
- Reduced by repeating and averaging

### Accuracy vs Precision

**Accuracy:** How close to TRUE value
**Precision:** How close repeated values are to EACH OTHER

Can be precise but not accurate (systematic error)!

### Improving Experiments

| Method | Type of Error Reduced |
|--------|----------------------|
| Repeat and average | Random |
| Check zero error | Systematic |
| Use digital instruments | Both |
| Increase measured quantities | Reduces % uncertainty |

### Density Measurement Methods

**Regular solid:** dimensions + mass
**Irregular solid:** displacement method
**Liquid:** mass difference in known volume`,
                diagrams: [],
                subsections: []
            },
            {
                title: "9. Key Formulae Summary",
                content: `## Essential Equations

### Force and Motion

| Formula | Quantity |
|---------|----------|
| F = ma | Resultant force |
| W = mg | Weight |

### Density

**ρ = m/V**

Unit: kg m⁻³

### Pressure

| Formula | Application |
|---------|-------------|
| p = F/A | General pressure |
| Δp = ρgh | Hydrostatic pressure |
| F = ρgV | Upthrust |

### Units

| Quantity | SI Unit | Base Units |
|----------|---------|------------|
| Force | N | kg m s⁻² |
| Pressure | Pa | kg m⁻¹ s⁻² |
| Density | kg m⁻³ | kg m⁻³ |

### Key Relationships

1. Pressure ∝ depth (in liquids)
2. Pressure ∝ 1/area (for constant force)
3. Upthrust = weight of displaced fluid
4. Objects float when ρ_object < ρ_fluid

### Common Conversions

- 1 cm³ = 10⁻⁶ m³
- 1 g cm⁻³ = 1000 kg m⁻³
- 1 bar = 10⁵ Pa
- 1 atm ≈ 101325 Pa`,
                diagrams: [],
                subsections: []
            },
            {
                title: "10. Exam Practice",
                content: `## Worked Examples

### Example 1: Weight from Density

Cylindrical disc: diameter 28 mm, thickness 12 mm, density 6.8 × 10³ kg m⁻³

**Solution:**
r = 14 mm = 0.014 m
h = 12 mm = 0.012 m

V = πr²h = π × (0.014)² × 0.012 = 7.39 × 10⁻⁶ m³
m = ρV = 6800 × 7.39 × 10⁻⁶ = 0.0503 kg
W = mg = 0.0503 × 9.81 = **0.49 N**

---

### Example 2: Free Fall

Ball falls 192 m from rest, mass 270 g.

**(a) Time to fall:**
s = ut + ½at²
192 = 0 + ½ × 9.81 × t²
t = √(384/9.81) = **6.3 s**

**(b) Maximum KE:**
v² = u² + 2as = 0 + 2 × 9.81 × 192 = 3767
KE = ½mv² = ½ × 0.27 × 3767 = **510 J**

Or: KE = mgh = 0.27 × 9.81 × 192 = **510 J**

---

### Common Exam Errors

❌ Forgetting to convert cm² to m² for pressure
❌ Confusing mass (kg) and weight (N)
❌ Using object density instead of fluid density for upthrust
❌ Not drawing free-body diagram first
❌ Wrong units for density (mixing g/cm³ and kg/m³)`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Force causes acceleration (F = ma) or deformation",
            "Weight = mg; it's a force (N), not mass (kg)",
            "Density ρ = m/V (kg m⁻³)",
            "Pressure p = F/A (Pa = N m⁻²)",
            "Hydrostatic pressure: Δp = ρgh — pressure increases with depth",
            "Pressure at same depth is equal in all directions",
            "Upthrust = weight of displaced fluid (Archimedes' Principle)",
            "Upthrust = ρ_fluid × g × V_displaced",
            "Object floats if its density < fluid density",
            "Gas pressure arises from molecular collisions with walls"
        ],
        exam_tips: [
            "Always convert areas to m² for pressure calculations (1 cm² = 10⁻⁴ m²)",
            "For upthrust, use FLUID density, not object density",
            "Draw free-body diagrams BEFORE attempting any mechanics problem",
            "Remember: pressure increases with DEPTH, not total volume of liquid",
            "Check units carefully — density in kg m⁻³, pressure in Pa",
            "For floating objects: Weight = Upthrust (they're in equilibrium)"
        ]
    },
    "Work, Energy and Power": {
        topic: "Work, Energy and Power",
        subject: "A Level Physics",
        summary: "Work, energy, and power are fundamental pillars of mechanics that quantify energy transfers in physical systems. This topic covers work done (W = Fs cos θ), kinetic energy (½mv²), gravitational potential energy (mgh), elastic potential energy (½kx²), the principle of conservation of energy, power (P = W/t and P = Fv), and efficiency. These concepts provide the 'accounting system' for tracking energy transformations in any mechanical system.",
        sections: [
            {
                title: "1. Introduction to Work, Energy and Power",
                content: `## The Energy Framework

Work, energy, and power form the 'accounting system' for mechanics.

### Core Concepts

**Energy:** The ability to do work

**Work:** Done when a force moves its point of application in the direction of the force

**Power:** The rate of doing work or converting energy

### The Principle of Conservation of Energy

**Energy cannot be created or destroyed, only converted from one form to another.**

This fundamental principle allows us to:
- Track energy flowing through systems
- Solve complex problems by equating initial and final energies
- Predict motion without complex force/acceleration calculations

### Why These Concepts Matter

Understanding work and energy allows us to:
- Bypass complex kinematics calculations
- Analyze energy efficiency in machines
- Understand real-world systems (vehicles, power plants)

### Key Relationship

**Work is the mechanism by which energy is transferred between systems.**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Work Done",
                content: `## Energy Transfer Through Force

### Definition

**Work is done when a force moves its point of application in the direction of the force.**

### Formula

**W = Fs cos θ**

Where:
- W = work done (J)
- F = force applied (N)
- s = displacement (m)
- θ = angle between force and displacement

### SI Unit

**Joule (J)** = 1 N m

### Conditions for Work

Two conditions must be met:
1. A force must be applied
2. Displacement must have a component in the force's direction

### Special Cases

**Force parallel to displacement (θ = 0°):**
cos 0° = 1, so **W = Fs** (maximum work)

**Force perpendicular to displacement (θ = 90°):**
cos 90° = 0, so **W = 0** (no work done)

### Examples

**Work done by gravity lifting an object:**
W = mgh

**Satellite in circular orbit:**
Gravitational force ⊥ to motion → No work done

### Worked Example

Force 1.5 N moves object 1.2 m in direction of force.

W = Fs = 1.5 × 1.2 = **1.8 J**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Kinetic Energy",
                content: `## Energy of Motion

### Definition

**Kinetic energy** is the energy an object possesses due to its motion.

### Formula

**E_k = ½mv²**

Where:
- E_k = kinetic energy (J)
- m = mass (kg)
- v = speed (m s⁻¹)

### Key Relationships

- KE is **proportional to mass** (double m → double KE)
- KE is **proportional to v²** (double v → quadruple KE)

Speed is the dominant factor in kinetic energy!

### The Work-Energy Principle

**Work done on an object = Change in kinetic energy**

W = ΔE_k = ½mv² - ½mu²

This is incredibly useful for calculating final speeds.

### Deriving KE from Work Done

For an object accelerated from rest by force F:
- Work done = Fs
- Using v² = u² + 2as: s = v²/2a
- And F = ma
- W = ma × v²/2a = **½mv²**

### Worked Example

Car: m = 900 kg, v = 20 m s⁻¹

E_k = ½ × 900 × 20² = ½ × 900 × 400 = **180,000 J**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Gravitational Potential Energy",
                content: `## Energy of Position

### Definition

**Gravitational potential energy (GPE)** is the energy stored in an object due to its position in a gravitational field.

### Formula (near Earth's surface)

**ΔE_p = mgΔh**

Where:
- ΔE_p = change in GPE (J)
- m = mass (kg)
- g = gravitational field strength (9.81 N kg⁻¹)
- Δh = change in vertical height (m)

### Derivation

To lift mass m through height h:
- Force needed = weight = mg
- Work done = force × distance = mg × h
- This work is stored as GPE

### Reference Level

The choice of h = 0 is arbitrary — what matters is the **change** in height.

### Worked Examples

**Gain in GPE:**
Person (70 kg) climbs 19 m cliff:
ΔE_p = 70 × 9.81 × 19 = **13,000 J**

**Loss in GPE:**
Aircraft (2.5 × 10⁵ kg) descends 980 m:
ΔE_p = 2.5 × 10⁵ × 9.81 × 980 = **2.4 × 10⁹ J**

### Key Point

GPE is energy "stored" by lifting against gravity. It can be released as kinetic energy when the object falls.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Elastic Potential Energy",
                content: `## Energy of Deformation

### Definition

**Elastic potential energy** is the energy stored in an object as a result of reversible deformation (stretching or compressing).

### Hooke's Law

Within the limit of proportionality:

**F = kx**

Where:
- F = force applied (N)
- k = spring constant (N m⁻¹)
- x = extension (m)

### Formula for Elastic PE

**E_p = ½kx²**

Or equivalently: **E_p = ½Fx** (since F = kx)

### Why ½kx² (not kx²)?

The force is NOT constant — it increases from 0 to kx.

The work done is the **area under the F-x graph**:
Area of triangle = ½ × base × height = ½ × x × kx = **½kx²**

### Key Points

**Limit of Proportionality:**
Point up to which F ∝ x (Hooke's Law valid)

**Elastic Limit:**
Point beyond which material undergoes **permanent** deformation

### Applications

- Springs in mattresses and suspension systems
- Elastic bands and bungee cords
- Trampolines

### Energy Conservation with Springs

When a compressed spring is released:
Elastic PE → Kinetic Energy`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Conservation of Energy",
                content: `## The Fundamental Principle

### Statement

**Energy cannot be created or destroyed, only converted from one form to another.**

In any isolated system, total energy remains constant.

### Common Energy Transformations

| System | From | To |
|--------|------|-----|
| Falling object | GPE | KE |
| Rollercoaster | GPE | KE + heat |
| Bow and arrow | Elastic PE | KE |
| Braking car | KE | Heat |

### Problem-Solving Strategy

For energy conservation problems:
1. Identify initial energy forms
2. Identify final energy forms
3. Equate: Total E_initial = Total E_final
4. Solve for unknown

### Key Equation for Falling Objects

GPE lost = KE gained

mgh = ½mv²

Mass cancels: **v = √(2gh)**

### Worked Example

Stone dropped from 9.5 m. Find speed at bottom.

Using mgh = ½mv²:
gh = ½v²
v = √(2gh) = √(2 × 9.81 × 9.5) = **13.7 m s⁻¹**

### Including Energy Losses

Real systems lose energy to friction, air resistance, sound.

Total E_initial = Useful E_final + Energy "lost"

The "lost" energy is usually converted to heat.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Power",
                content: `## Rate of Energy Transfer

### Definition

**Power** is the rate of doing work or the rate of energy transfer.

### Formulas

**P = W/t** (primary formula)

**P = Fv** (for constant force and velocity)

Where:
- P = power (W)
- W = work done (J)
- t = time (s)
- F = force (N)
- v = velocity (m s⁻¹)

### SI Unit

**Watt (W)** = 1 J s⁻¹

Common multiples:
- 1 kW = 1000 W
- 1 MW = 10⁶ W

### The P = Fv Formula

Very useful for vehicles at constant velocity!

At constant velocity:
- Acceleration = 0
- Driving force = Resistive forces

So if you know power and velocity, you can find the resistive force.

### Worked Example 1

Force 1.5 N moves object 1.2 m in 2.7 s.

W = Fs = 1.5 × 1.2 = 1.8 J
P = W/t = 1.8/2.7 = **0.67 W**

### Worked Example 2

Train: Power = 3.6 MW, speed = 30 m s⁻¹ (constant)

At constant speed, driving force = resistive force
F = P/v = 3.6 × 10⁶ / 30 = **1.2 × 10⁵ N**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Efficiency",
                content: `## Measuring Performance

### Definition

**Efficiency** is the ratio of useful energy output to total energy input.

### Formulas

**Efficiency = Useful Energy Output / Total Energy Input**

**Efficiency = Useful Power Output / Total Power Input**

### As a Percentage

Multiply by 100 to express as percentage.

### Key Points

- Efficiency is dimensionless (no units)
- Maximum efficiency = 1 (or 100%)
- Efficiency can NEVER exceed 100%
- Real machines always have efficiency < 100%

### Why Efficiency < 100%?

Energy is "lost" to:
- Friction (heat)
- Air resistance
- Sound
- Electrical resistance

This energy isn't destroyed — it's converted to non-useful forms.

### Worked Example

Elevator motor uses 630 kJ to lift weight 12,500 N through 29 m.

**Useful output:**
Work done = F × d = 12,500 × 29 = 362,500 J

**Efficiency:**
η = 362,500 / 630,000 = **0.58 (or 58%)**

### Improving Efficiency

- Reduce friction (lubrication)
- Reduce air resistance (streamlining)
- Use better insulation
- Improve mechanical design`,
                diagrams: [],
                subsections: []
            },
            {
                title: "9. Key Formulae Summary",
                content: `## Essential Equations

### Work Done

| Formula | Condition |
|---------|-----------|
| W = Fs cos θ | General case |
| W = Fs | Force parallel to motion |
| W = mgh | Work against gravity |

### Energy Forms

| Type | Formula |
|------|---------|
| Kinetic Energy | E_k = ½mv² |
| Gravitational PE | ΔE_p = mgΔh |
| Elastic PE | E_p = ½kx² |

### Power

| Formula | Application |
|---------|-------------|
| P = W/t | General |
| P = Fv | Constant velocity |

### Efficiency

Efficiency = Useful Output / Total Input

### Conservation of Energy

E_initial = E_final

For falling: mgh = ½mv² → v = √(2gh)

### Units Summary

| Quantity | SI Unit |
|----------|---------|
| Work / Energy | J (joule) |
| Power | W (watt) |
| Efficiency | dimensionless |

### Common Conversions

- 1 kJ = 1000 J
- 1 MJ = 10⁶ J
- 1 kW = 1000 W
- 1 MW = 10⁶ W`,
                diagrams: [],
                subsections: []
            },
            {
                title: "10. Exam Practice",
                content: `## Worked Problems

### Problem 1: Conservation of Energy

Stone (120 g) dropped 9.5 m into well.

**(a) Loss of PE:**
ΔE_p = mgh = 0.120 × 9.81 × 9.5 = **11.2 J**

**(b) Speed at water:**
Using conservation: mgh = ½mv²
v = √(2gh) = √(2 × 9.81 × 9.5) = **13.7 m s⁻¹**

---

### Problem 2: Power and Efficiency

Elevator uses 630 kJ to lift 12,500 N through 29 m.

**Useful work done:**
W = Fd = 12,500 × 29 = 362,500 J

**Efficiency:**
η = 362,500/630,000 = **0.58 (58%)**

---

### Problem 3: P = Fv Application

Train: P = 3.6 MW at constant 30 m s⁻¹.

At constant speed: Driving force = Resistive force

F = P/v = 3.6 × 10⁶ / 30 = **1.2 × 10⁵ N**

---

### Common Exam Errors

❌ Using W = Fs when force not parallel to motion
❌ Forgetting to convert units to SI
❌ Using speed instead of speed² in KE
❌ Confusing power (rate) with energy (amount)
❌ Giving efficiency > 100%`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Work done W = Fs cos θ (only component in direction of motion counts)",
            "Work done when force is perpendicular to motion = ZERO",
            "Kinetic energy E_k = ½mv² (proportional to v²)",
            "Gravitational PE: ΔE_p = mgΔh",
            "Elastic PE: E_p = ½kx² (area under F-x graph)",
            "Conservation of Energy: energy cannot be created or destroyed",
            "For falling objects: v = √(2gh)",
            "Power P = W/t = Fv",
            "At constant velocity: driving force = resistive force",
            "Efficiency = useful output / total input (always ≤ 100%)"
        ],
        exam_tips: [
            "Use P = Fv for vehicles at constant velocity — very common exam question",
            "Mass cancels in mgh = ½mv² giving v = √(2gh) — a useful shortcut",
            "Always convert to SI units before calculating (J, W, kg, m, s)",
            "Remember: efficiency can NEVER exceed 100% (or 1.0)",
            "For W = Fs cos θ, identify the angle between force and displacement",
            "KE depends on v², so doubling speed quadruples kinetic energy"
        ]
    },
    "Deformation of Solids": {
        topic: "Deformation of Solids",
        subject: "A Level Physics",
        summary: "Deformation of solids examines how materials respond to applied forces, focusing on tensile and compressive stress. This topic covers stress (σ = F/A), strain (ε = ΔL/L₀), Hooke's Law (F = kx), the Young Modulus (E = σ/ε), elastic and plastic deformation, force-extension graphs, stress-strain graphs, and elastic potential energy (½kx²). Understanding material properties is essential for engineering and materials science.",
        sections: [
            {
                title: "1. Introduction to Deformation",
                content: `## How Materials Respond to Forces

**Deformation** is a change in the shape or size of a solid when external forces are applied.

### Elastic vs Plastic Deformation

**Elastic Deformation:**
- Temporary and reversible
- Object returns to original shape when force removed
- Example: stretched rubber band

**Plastic Deformation:**
- Permanent and irreversible
- Object does NOT return to original shape
- Example: bent paperclip

### Comparison Table

| Property | Elastic | Plastic |
|----------|---------|---------|
| Change | Temporary | Permanent |
| Reversible? | Yes | No |
| Energy | Stored and released | Dissipated |

### Types of Forces

**Tensile forces:** Pull/stretch the object (elongation)

**Compressive forces:** Push/squeeze the object (compression)

### Real-World Examples

- Car suspension springs (elastic)
- Car crumple zones (plastic — absorbs crash energy)
- Bungee cords (elastic)
- Metal forming/shaping (plastic)

### Why This Topic Matters

Understanding deformation is crucial for:
- Designing safe structures
- Selecting appropriate materials
- Predicting failure points`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Stress (σ)",
                content: `## Force Per Unit Area

### Definition

**Tensile stress** is the force applied per unit cross-sectional area.

### Formula

**σ = F / A**

Where:
- σ (sigma) = stress (Pa or N m⁻²)
- F = applied force (N)
- A = cross-sectional area (m²)

### SI Unit

**Pascal (Pa)** = N m⁻²

### Why Use Stress?

Stress normalizes force by considering area:
- 100 N through a needle point = high stress
- 100 N spread over palm = low stress

This allows comparison of different-sized samples of the same material.

### Types of Stress

**Tensile stress:** From forces that stretch (elongate)

**Compressive stress:** From forces that squeeze (compress)

### Calculating Area

For a circular wire of diameter d:

**A = π(d/2)² = πd²/4**

⚠️ Common error: Using diameter instead of radius!

### Units Warning

If diameter is in mm, convert to m before calculating area:
- 1 mm = 10⁻³ m
- Area will be in m²`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Strain (ε)",
                content: `## Normalized Extension

### Definition

**Tensile strain** is the ratio of extension to original length.

### Formula

**ε = ΔL / L₀**

Where:
- ε (epsilon) = strain (no units)
- ΔL = extension/change in length (m)
- L₀ = original length (m)

### No Units!

Strain is **dimensionless** because it's a ratio of two lengths.

Strain can be expressed as:
- A decimal (e.g., 0.005)
- A percentage (e.g., 0.5%)

### Why Use Strain?

Strain normalizes deformation to original size:
- Long wire and short wire can be compared
- Thick sample and thin sample can be compared

### Types of Strain

**Tensile strain:** Fractional increase in length

**Compressive strain:** Fractional decrease in length

### Key Point

Both stress AND strain are needed to describe material behavior independently of sample dimensions.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Hooke's Law",
                content: `## The Linear Relationship

### Statement

**Within the limit of proportionality, extension is directly proportional to the applied force.**

### Formula

**F = kx**

Where:
- F = applied force (N)
- k = spring constant (N m⁻¹)
- x = extension (m)

### Spring Constant (k)

**k = F/x**

The spring constant is a measure of **stiffness**:
- High k = stiff spring (hard to stretch)
- Low k = soft spring (easy to stretch)

### Important Limits

**Limit of Proportionality (P):**
- End of the linear (straight-line) region
- Beyond this, F is no longer ∝ x
- Hooke's Law no longer applies

**Elastic Limit:**
- Maximum stress for elastic behavior
- Beyond this → permanent (plastic) deformation
- Material won't return to original length

### Order of Points

Limit of Proportionality → Elastic Limit → Plastic Region

(P comes just before the elastic limit)

### Graphical Representation

On a Force-Extension graph:
- Linear region: Hooke's Law applies
- Gradient = spring constant k`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Young Modulus (E)",
                content: `## Material Stiffness

### Definition

The **Young Modulus** is the ratio of tensile stress to tensile strain, provided the limit of proportionality is not exceeded.

### Formula

**E = σ / ε = Stress / Strain**

Expanded form:

**E = (F/A) / (ΔL/L₀) = FL₀ / AΔL**

### SI Unit

**Pascal (Pa)** or N m⁻²

(Same as stress, since strain is dimensionless)

### What Young Modulus Tells Us

E measures a material's **stiffness**:
- High E → stiff material (steel: ~200 GPa)
- Low E → flexible material (rubber: ~0.01 GPa)

### Typical Values

| Material | Young Modulus (GPa) |
|----------|---------------------|
| Steel | 200 |
| Copper | 120 |
| Aluminium | 70 |
| Glass | 70 |
| Rubber | 0.01 |

### Key Points

- E is a **material property** (not object property)
- Independent of sample dimensions
- Only valid within limit of proportionality

### Rearranging for Extension

**ΔL = FL₀ / AE**

Extension depends on:
- Force F (↑ extension)
- Original length L₀ (↑ extension)
- Area A (↓ extension)
- Young Modulus E (↓ extension)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Force-Extension Graphs",
                content: `## Visualizing Material Behavior

### Key Features

**Linear Region:**
- Straight line through origin
- Hooke's Law applies (F ∝ x)
- Gradient = spring constant k

**Limit of Proportionality (P):**
- Where graph starts to curve
- End of linear relationship

**Elastic Limit:**
- Beyond this → permanent deformation
- Material won't return to original length

**Plastic Region:**
- Beyond elastic limit
- Irreversible deformation

### The Spring Constant

**k = gradient = ΔF/Δx**

### Energy Stored

The **area under the graph** equals work done = elastic PE stored.

For linear region (triangle):

**E_p = ½Fx = ½kx²**

### Loading and Unloading

For elastic materials:
- Loading curve = unloading curve
- All energy returned

For plastic deformation:
- Unloading curve is parallel but shifted
- Area between curves = energy lost (dissipated as heat)

### Reading Graphs Carefully

- Check x-axis units (often mm, not m)
- Check y-axis units
- Convert to SI units for calculations`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Stress-Strain Graphs",
                content: `## Material Properties Independent of Dimensions

### Why Use Stress-Strain?

Force-extension depends on sample dimensions.

Stress-strain shows **intrinsic material properties**, allowing direct comparison between materials.

### Key Features

**Elastic Region:**
- Straight line through origin
- σ ∝ ε
- Material returns to original dimensions

**Gradient = Young Modulus (E)**

### Deriving Young Modulus

From stress-strain graph:

**E = Gradient = Δσ/Δε**

### Comparison: Force-Extension vs Stress-Strain

| Graph | Gradient | Area Under |
|-------|----------|------------|
| F-x | Spring constant k | Energy stored |
| σ-ε | Young Modulus E | Energy per unit volume |

### Important Note

The stress-strain curve is the same for ALL samples of a given material, regardless of size!

This makes it the preferred graph for comparing materials.

### Energy Per Unit Volume

Area under stress-strain graph = energy stored per unit volume

For linear region:
Energy/volume = ½ × stress × strain = ½σε`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Elastic Potential Energy",
                content: `## Energy Stored in Deformation

### Definition

**Elastic potential energy** is energy stored in an object due to elastic deformation.

### Formulae

**E_p = ½Fx** (general for elastic region)

**E_p = ½kx²** (using Hooke's Law: F = kx)

Where:
- E_p = elastic potential energy (J)
- F = force (N)
- x = extension (m)
- k = spring constant (N m⁻¹)

### Graphical Interpretation

E_p = **area under force-extension graph**

For linear region: Area of triangle = ½ × base × height

### Energy Changes During Extension

When stretching from x₁ to x₂:

**ΔE_p = ½k(x₂)² - ½k(x₁)²**

Or: **ΔE_p = ½k(x₂² - x₁²)**

### Worked Example

Spring: k = 200 N m⁻¹
Extended from 5.0 cm to 9.0 cm

x₁ = 0.050 m, x₂ = 0.090 m

ΔE_p = ½ × 200 × (0.090² - 0.050²)
ΔE_p = 100 × (0.0081 - 0.0025)
ΔE_p = 100 × 0.0056 = **0.56 J**

### Key Point

Energy stored only applies within the elastic limit. Beyond this, energy is dissipated, not stored.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "9. Experimental Determination of Young Modulus",
                content: `## Laboratory Method

### Equipment

- Long wire (>1 m for measurable extension)
- Clamp stand/support
- Mass hanger + masses
- Vernier scale for measuring extension
- Metre rule for original length
- Micrometer screw gauge for diameter

### Procedure

1. Measure original length L₀ (metre rule)
2. Measure diameter at several points (micrometer)
3. Calculate area: A = πd²/4
4. Add masses incrementally
5. Record extension for each load
6. Plot stress-strain graph
7. Calculate Young Modulus from gradient

### Sources of Error

**Systematic errors:**
- Zero error on measuring instruments
- Thermal expansion of wire

**Random errors:**
- Parallax when reading scales
- Variations in wire diameter
- Difficulty judging exact extension

### Reducing Errors

| Error | Solution |
|-------|----------|
| Parallax | Read at eye level |
| Diameter uncertainty | Multiple measurements, average |
| Small extensions | Use long wire |
| Thermal effects | Use reference wire |

### Propagation of Uncertainty

Since A = πd²/4:

**% uncertainty in A = 2 × (% uncertainty in d)**

1% error in diameter → 2% error in area → 2% error in E`,
                diagrams: [],
                subsections: []
            },
            {
                title: "10. Key Formulae and Exam Practice",
                content: `## Essential Equations

| Quantity | Formula | Unit |
|----------|---------|------|
| Stress | σ = F/A | Pa |
| Strain | ε = ΔL/L₀ | none |
| Hooke's Law | F = kx | - |
| Young Modulus | E = σ/ε | Pa |
| Elastic PE | E_p = ½kx² | J |

---

## Worked Example 1

Wire: L₀ = 1.70 m, A = 5.74 × 10⁻⁸ m², E = 1.60 × 10¹¹ Pa, F = 25.0 N

Find extension.

**Using E = FL₀/AΔL:**
ΔL = FL₀/AE = (25 × 1.70)/(5.74 × 10⁻⁸ × 1.60 × 10¹¹)
ΔL = 42.5/9184 = **4.63 × 10⁻³ m**

---

## Worked Example 2

Same material, twice the length, twice the diameter.

- Double L₀ → double extension
- Double d → quadruple A → quarter extension

Net effect: **Extension is halved**

---

## Common Exam Errors

❌ Confusing stress (F/A) and strain (ΔL/L₀)
❌ Using diameter instead of radius for area
❌ Forgetting to convert mm to m
❌ Getting gradient from wrong graph type
❌ Applying Hooke's Law beyond limit of proportionality`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Elastic deformation is reversible; plastic deformation is permanent",
            "Stress σ = F/A (Pa); strain ε = ΔL/L₀ (dimensionless)",
            "Hooke's Law: F = kx (valid up to limit of proportionality)",
            "Spring constant k = F/x = gradient of F-x graph",
            "Young Modulus E = σ/ε = gradient of stress-strain graph",
            "E is a material property; k is an object property",
            "Elastic limit: beyond this, deformation is permanent",
            "Elastic PE = ½kx² = ½Fx = area under F-x graph",
            "For circular wire: A = πd²/4 (use diameter carefully)",
            "% uncertainty in A = 2 × (% uncertainty in d)"
        ],
        exam_tips: [
            "Always use radius (not diameter) in A = πr², OR use A = πd²/4",
            "Convert all measurements to SI units (mm → m) before calculating",
            "Gradient of F-x graph = k; gradient of σ-ε graph = E",
            "Remember: stress has units (Pa), strain has NO units",
            "For extension problems, rearrange to ΔL = FL₀/AE",
            "Doubling diameter quadruples area (halves stress for same force)"
        ]
    },
    "Waves": {
        topic: "Waves",
        subject: "A Level Physics",
        summary: "Waves transfer energy without net transfer of matter. This topic covers transverse and longitudinal waves, wave terminology (amplitude, wavelength, frequency, period), the wave equation (v = fλ), reflection, refraction, diffraction, superposition and interference, Young's double-slit experiment, standing waves with nodes and antinodes, and the diffraction grating equation (d sin θ = nλ). Understanding wave behavior is essential for optics, acoustics, and telecommunications.",
        sections: [
            {
                title: "1. Introduction to Waves",
                content: `## Energy Transfer Without Matter Transfer

### What is a Wave?

A **wave** is a disturbance that propagates from one place to another, transferring energy as it travels.

### The Key Principle

**Waves transfer energy without transferring matter.**

The particles of the medium oscillate about their equilibrium positions but do not travel with the wave.

### Example: Cork on Water

When a ripple passes:
- Cork bobs up and down
- Returns to original position
- Energy has traveled across
- Water (matter) has NOT traveled

### Types of Waves by Medium

**Mechanical waves:**
- Require a medium (substance) to travel
- Examples: sound, water waves, waves on strings

**Electromagnetic waves:**
- Do NOT require a medium
- Can travel through vacuum
- Examples: light, radio waves, X-rays
- All travel at c = 3.00 × 10⁸ m s⁻¹ in vacuum`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Transverse and Longitudinal Waves",
                content: `## Classification by Oscillation Direction

### Transverse Waves

**Oscillations are PERPENDICULAR to direction of energy transfer.**

Features:
- Crests (maximum positive displacement)
- Troughs (maximum negative displacement)

Examples:
- Waves on a string/rope
- Water waves (surface)
- ALL electromagnetic waves

### Longitudinal Waves

**Oscillations are PARALLEL to direction of energy transfer.**

Features:
- Compressions (particles close together, high pressure)
- Rarefactions (particles spread apart, low pressure)

Primary example:
- **Sound waves** (pressure waves)

### Comparison Table

| Property | Transverse | Longitudinal |
|----------|------------|--------------|
| Oscillation | ⊥ to travel | ∥ to travel |
| Features | Crests, troughs | Compressions, rarefactions |
| EM waves? | Yes | No |
| Polarization? | Yes | No |

### Key Point

All electromagnetic waves are transverse. Sound is longitudinal.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Wave Terminology",
                content: `## The Language of Waves

### Displacement (x or y)

Position of a particle from its equilibrium (rest) position.

### Amplitude (A or x₀)

**Maximum displacement** from equilibrium position.

Unit: metres (m)

### Wavelength (λ)

**Shortest distance** between two consecutive points that are **in phase**.

Examples: crest to crest, trough to trough

Unit: metres (m)

### Period (T)

**Time for one complete oscillation.**

Time for one wavelength to pass a point.

Unit: seconds (s)

### Frequency (f)

**Number of complete oscillations per unit time.**

**f = 1/T**

Unit: Hertz (Hz) = s⁻¹

### Wave Speed (v)

Speed at which energy is transferred.

Unit: m s⁻¹

### Phase Difference

How "in step" two points are:
- **In phase:** 0° or 360° (crest meets crest)
- **In antiphase:** 180° (crest meets trough)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. The Wave Equation",
                content: `## The Fundamental Formula

### The Wave Equation

**v = fλ**

Where:
- v = wave speed (m s⁻¹)
- f = frequency (Hz)
- λ = wavelength (m)

### Derivation

In one period T:
- Wave travels distance = one wavelength λ
- Speed = distance/time = λ/T
- Since f = 1/T: **v = fλ**

### Key Relationships

**f = v/λ**

**λ = v/f**

**T = 1/f = λ/v**

### What Determines What?

- **Wave speed:** Determined by the MEDIUM
- **Frequency:** Determined by the SOURCE
- **Wavelength:** Depends on both (λ = v/f)

### When Wave Changes Medium

If speed changes:
- Frequency stays CONSTANT
- Wavelength must change

### Worked Example

Radio wave: λ = 250 m, v = 3.00 × 10⁸ m s⁻¹

f = v/λ = 3.00 × 10⁸ / 250 = **1.2 × 10⁶ Hz** (1.2 MHz)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Reflection and Refraction",
                content: `## Wave Behavior at Boundaries

### Reflection

**Waves bounce off boundaries.**

Key feature: **Phase change of π (180°) at a fixed end**
- Crest reflects as trough
- Trough reflects as crest

Examples:
- Echo (sound reflection)
- Mirror images (light reflection)
- Microwaves from metal plate

### Refraction

**Waves change direction when speed changes.**

Occurs when wave passes from one medium to another.

### What Changes in Refraction?

| Property | Change? |
|----------|---------|
| Speed | YES |
| Wavelength | YES |
| Frequency | NO (constant) |
| Direction | YES (unless normal incidence) |

### The Rule

When wave slows down:
- Wavelength decreases
- Wave bends TOWARD normal

When wave speeds up:
- Wavelength increases
- Wave bends AWAY from normal

### Key Point

Frequency is determined by the source and NEVER changes when a wave enters a new medium.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Diffraction",
                content: `## Spreading of Waves

### Definition

**Diffraction** is the spreading of a wave as it passes through a gap or around an obstacle.

### Condition for Significant Diffraction

Diffraction is most noticeable when:

**Wavelength ≈ Gap size**

- Gap >> λ: Little spreading
- Gap ≈ λ: Maximum spreading
- Gap << λ: Wave blocked

### Single Slit Diffraction

When monochromatic light passes through a narrow slit:

Pattern produced:
- Wide, bright central maximum
- Alternating dark and bright fringes
- Side maxima are narrower and dimmer

### Why Diffraction Matters

Diffraction is evidence of wave nature:
- If something diffracts, it behaves as a wave
- Light diffracts → light is a wave

### Applications

- Optical instruments (resolution limits)
- Radio waves bending around buildings
- Sound spreading through doorways`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Superposition and Interference",
                content: `## When Waves Meet

### Principle of Superposition

**When two or more waves meet at a point, the resultant displacement is the vector sum of the individual displacements.**

### Constructive Interference

Waves meet **in phase** (crest + crest):
- Displacements ADD
- Resultant amplitude = sum of amplitudes
- Bright fringe in light experiments

**Condition:** Path difference = nλ
(n = 0, 1, 2, 3...)

### Destructive Interference

Waves meet **in antiphase** (crest + trough):
- Displacements CANCEL
- Resultant amplitude = difference
- Dark fringe (if equal amplitudes → zero)

**Condition:** Path difference = (n + ½)λ
(n = 0, 1, 2, 3...)

### Requirements for Observable Interference

Sources must be **coherent**:
- Same frequency
- Constant phase difference

### Path Difference

The difference in distance traveled by two waves to reach a point.

If path difference = whole wavelengths → constructive
If path difference = half wavelengths → destructive`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Young's Double-Slit Experiment",
                content: `## Evidence for Wave Nature of Light

### The Setup

1. Monochromatic light (single wavelength)
2. Two narrow, closely spaced slits
3. Screen to observe pattern

### What Happens

1. Light diffracts through each slit
2. Two slits act as coherent sources
3. Waves overlap and interfere
4. **Interference pattern** of alternating bright and dark fringes

### The Pattern

- Bright fringes: Constructive interference
- Dark fringes: Destructive interference
- Central maximum: Path difference = 0
- Equally spaced fringes

### Fringe Separation Formula

**x = λD/a**

Where:
- x = fringe separation (m)
- λ = wavelength (m)
- D = distance to screen (m)
- a = slit separation (m)

### Key Relationships

- Larger λ → wider spacing
- Larger D → wider spacing
- Larger a → narrower spacing

### Why This Experiment Matters

Provided first definitive evidence that light is a wave.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "9. Standing Waves",
                content: `## Waves in Confinement

### Definition

A **standing (stationary) wave** is formed when two progressive waves of the same frequency and amplitude travel in opposite directions and superpose.

### Formation

Typically: wave + its own reflection

### Key Features

**Nodes:**
- Points of ZERO amplitude
- Permanent destructive interference
- Particles don't move

**Antinodes:**
- Points of MAXIMUM amplitude
- Permanent constructive interference
- Maximum oscillation

### Comparison: Standing vs Progressive

| Property | Progressive | Standing |
|----------|-------------|----------|
| Energy | Transfers | Stores (no net transfer) |
| Amplitude | Same for all particles | Varies: 0 at nodes, max at antinodes |
| Phase | Varies continuously | All in phase between nodes; adjacent loops antiphase |

### Distance Relationships

- Node to node = λ/2
- Antinode to antinode = λ/2
- Node to adjacent antinode = λ/4`,
                diagrams: [],
                subsections: []
            },
            {
                title: "10. Harmonics on Strings",
                content: `## Resonant Frequencies

### String Fixed at Both Ends

Both ends must be **nodes** (can't move).

### Fundamental Mode (1st Harmonic)

- Lowest possible frequency
- One antinode in middle
- Nodes at each end
- L = λ/2

**f₁ = v/2L**

### Second Harmonic

- Two antinodes
- Three nodes (including ends)
- L = λ

**f₂ = v/L = 2f₁**

### Third Harmonic

- Three antinodes
- Four nodes
- L = 3λ/2

**f₃ = 3v/2L = 3f₁**

### General Formula

**fₙ = nv/2L = nf₁**

Where n = 1, 2, 3... (harmonic number)

### Number of Antinodes

For the nth harmonic:
- n antinodes
- (n + 1) nodes

### Calculating from Given Data

If you know string length L and wavelength λ:
Number of half-wavelengths = L/(λ/2) = 2L/λ`,
                diagrams: [],
                subsections: []
            },
            {
                title: "11. Diffraction Grating",
                content: `## Multiple Slit Interference

### What is a Diffraction Grating?

An optical component with many parallel slits, very closely spaced.

Typical: 300-600 lines per mm

### The Diffraction Grating Equation

**d sin θ = nλ**

Where:
- d = slit separation (distance between adjacent slits)
- θ = angle to nth order maximum
- n = order of diffraction (0, 1, 2, 3...)
- λ = wavelength

### Finding d from Lines per mm

If grating has N lines per mm:

**d = 1/N mm = (1/N) × 10⁻³ m**

Example: 500 lines/mm → d = 2 × 10⁻⁶ m

### The Pattern

- Central maximum (n = 0) at θ = 0°
- First order maxima (n = 1) at angle θ₁
- Second order (n = 2) at larger angle θ₂
- Maxima are sharp and widely spaced

### Maximum Order

Since sin θ ≤ 1:

n_max = d/λ (rounded down)

### Advantages Over Double Slit

- Sharper, brighter maxima
- More precise wavelength measurement`,
                diagrams: [],
                subsections: []
            },
            {
                title: "12. Key Formulae and Exam Practice",
                content: `## Essential Equations

| Equation | Application |
|----------|-------------|
| v = fλ | Wave equation |
| f = 1/T | Frequency and period |
| Path diff = nλ | Constructive interference |
| Path diff = (n+½)λ | Destructive interference |
| x = λD/a | Double-slit fringe separation |
| d sin θ = nλ | Diffraction grating |
| fₙ = nv/2L | Harmonics on string |

---

## Worked Example 1

Wave: T = 0.8 s, λ = 4.0 cm

f = 1/T = 1/0.8 = **1.25 Hz**
v = fλ = 1.25 × 0.04 = **0.05 m s⁻¹**

---

## Worked Example 2

Standing wave: v = 40 m s⁻¹, f = 50 Hz, L = 0.60 m

λ = v/f = 40/50 = **0.80 m**
Number of half-wavelengths = L/(λ/2) = 0.60/0.40 = 1.5

Since we need whole number: **1 antinode** (fundamental)

---

## Common Exam Errors

❌ Thinking frequency changes when wave enters new medium
❌ Confusing nodes (zero) with antinodes (max)
❌ Forgetting to convert lines/mm to d in metres
❌ Using degrees instead of radians for sin θ
❌ Confusing path difference conditions`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Waves transfer energy WITHOUT transferring matter",
            "Transverse: oscillations ⊥ to wave travel; Longitudinal: oscillations ∥ to travel",
            "Wave equation: v = fλ",
            "Frequency is set by source and NEVER changes between media",
            "When speed changes, wavelength changes (v and λ proportional)",
            "Superposition: resultant displacement = vector sum of individual displacements",
            "Constructive interference: path difference = nλ",
            "Destructive interference: path difference = (n + ½)λ",
            "Standing waves: nodes (zero amplitude), antinodes (maximum amplitude)",
            "Diffraction grating: d sin θ = nλ"
        ],
        exam_tips: [
            "Frequency is ALWAYS constant when wave enters new medium — only v and λ change",
            "For standing waves: node-to-node = λ/2, node-to-antinode = λ/4",
            "Convert lines per mm to d in metres: d = (1/N) × 10⁻³ m",
            "For coherent sources: same frequency AND constant phase difference",
            "In double-slit: wider slit separation → narrower fringe spacing",
            "Check if question asks for orders or angles in diffraction grating problems"
        ]
    },
    "Superposition": {
        topic: "Superposition",
        subject: "A Level Physics",
        summary: "Superposition describes how waves interact when they meet. This topic covers the principle of superposition (resultant = vector sum of displacements), coherence, path difference, constructive interference (path diff = nλ), destructive interference (path diff = (n+½)λ), Young's double-slit experiment (x = λD/a), and standing waves with nodes and antinodes. These principles explain phenomena from soap bubble colours to noise-cancelling headphones.",
        sections: [
            {
                title: "1. The Principle of Superposition",
                content: `## How Waves Interact

### Definition

**When two or more waves of the same type meet at a point, the resultant displacement is the vector sum of the individual displacements.**

### Key Points

- Applies to ALL types of waves
- Displacements add as vectors
- Takes into account direction (+ or -)

### Examples

**Crest + Crest:**
Both positive → larger positive displacement

**Crest + Trough:**
Positive + Negative → reduced or zero displacement

**Trough + Trough:**
Both negative → larger negative displacement

### Importance

Superposition is the foundation for:
- Interference patterns
- Standing waves
- Many wave phenomena

### Applications

- Noise-cancelling headphones
- Holography
- Musical instruments
- Optical coatings`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Coherence and Path Difference",
                content: `## Requirements for Stable Interference

### Coherence

**Two sources are coherent if they emit waves with a constant phase difference.**

Requirements for coherence:
- Same frequency
- Constant phase relationship

Examples:
- Laser light (highly coherent)
- Two slits illuminated by same source

### Path Difference

**The difference in distance traveled by two waves from their sources to a given point.**

### Phase Difference

How "in step" or "out of step" waves are:
- 0° or 360° → in phase
- 180° → antiphase (completely out of phase)

### The Critical Link

| Path Difference | Phase Difference | Result |
|-----------------|------------------|--------|
| 0 | 0° | In phase |
| λ/2 | 180° | Antiphase |
| λ | 360° | In phase |
| 3λ/2 | 540° (=180°) | Antiphase |
| 2λ | 720° (=0°) | In phase |

### Key Relationship

Path difference of λ → Phase difference of 360° (2π rad)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Constructive Interference",
                content: `## Waves Adding Together

### Definition

**Constructive interference** occurs when superposing waves combine to produce a resultant with **greater amplitude**.

### When Does It Happen?

Waves meet **in phase**:
- Crest meets crest
- Trough meets trough

### The Result

- Displacements ADD
- Maximum amplitude
- **Bright fringe** in light experiments
- **Loud sound** in acoustics

### Condition for Constructive Interference

**Path difference = nλ**

Where:
- n = 0, 1, 2, 3... (integer)
- λ = wavelength

### Examples

| n | Path Difference |
|---|-----------------|
| 0 | 0 (same distance) |
| 1 | λ |
| 2 | 2λ |
| 3 | 3λ |

### Energy at Maxima

At points of constructive interference:
- Maximum intensity
- Energy from both waves combines`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Destructive Interference",
                content: `## Waves Cancelling Out

### Definition

**Destructive interference** occurs when superposing waves combine to produce a resultant with **smaller or zero amplitude**.

### When Does It Happen?

Waves meet **in antiphase**:
- Crest meets trough
- Displacements are opposite

### The Result

- Displacements CANCEL
- Minimum or zero amplitude
- **Dark fringe** in light experiments
- **Silence** in acoustics

### Condition for Destructive Interference

**Path difference = (n + ½)λ**

Where:
- n = 0, 1, 2, 3... (integer)
- λ = wavelength

### Examples

| n | Path Difference |
|---|-----------------|
| 0 | λ/2 |
| 1 | 3λ/2 |
| 2 | 5λ/2 |
| 3 | 7λ/2 |

### Complete Cancellation

For total destructive interference:
- Waves must have equal amplitude
- Perfect antiphase alignment`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Young's Double-Slit Experiment",
                content: `## Proof of Wave Nature of Light

### Historical Significance

Thomas Young (1801) — provided definitive proof that light is a wave.

### Experimental Setup

1. **Monochromatic light** (single wavelength)
2. **Single slit** — creates point source
3. **Double slit** — creates two coherent sources
4. **Screen** — observe interference pattern

### Why It Works

- Light from same source → coherent
- Diffraction at each slit
- Overlapping waves interfere

### The Pattern

**Bright fringes:** Constructive interference (path diff = nλ)
**Dark fringes:** Destructive interference (path diff = (n+½)λ)

### The Fringe Spacing Formula

**x = λD/a**

Where:
- x = fringe separation (m)
- λ = wavelength (m)
- D = distance to screen (m)
- a = slit separation (m)

### Key Relationships

- ↑ λ (longer wavelength) → ↑ x (wider spacing)
- ↑ D (screen further) → ↑ x (wider spacing)
- ↑ a (slits further apart) → ↓ x (narrower spacing)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Formation of Standing Waves",
                content: `## Waves That Don't Travel

### Definition

A **standing (stationary) wave** is formed when two progressive waves superpose to create a pattern that remains in a constant position.

### Conditions for Formation

Two waves with:
- Same frequency
- Same amplitude
- Travelling in **opposite directions**

### How They Form

Typically: **wave + its own reflection**

Example: Wave on a string reflects from fixed end

### Phase Change on Reflection

At a **fixed end**:
- Reflected wave undergoes **180° phase change**
- Crest becomes trough
- Ensures a node at the fixed point

### Key Difference from Progressive Waves

| Property | Progressive Wave | Standing Wave |
|----------|------------------|---------------|
| Energy | Transfers | Stores |
| Pattern | Moves | Stationary |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Nodes and Antinodes",
                content: `## Structure of Standing Waves

### Nodes (N)

**Points of ZERO amplitude**

- Permanent destructive interference
- Particles don't move
- Always at fixed ends

### Antinodes (A)

**Points of MAXIMUM amplitude**

- Permanent constructive interference
- Maximum oscillation
- Always at open ends

### Distance Relationships

| Between | Distance |
|---------|----------|
| Node to node | λ/2 |
| Antinode to antinode | λ/2 |
| Node to adjacent antinode | λ/4 |

### Phase Relationships

**Between adjacent nodes:**
All particles oscillate in phase (together)

**In adjacent segments:**
Particles oscillate in antiphase (180° out of phase)

### Counting Nodes and Antinodes

For nth harmonic on a string fixed at both ends:
- Number of antinodes = n
- Number of nodes = n + 1`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Harmonics and Resonance",
                content: `## Vibration Modes

### Resonant Frequencies

A stretched string can only vibrate at specific frequencies called **harmonics**.

### Fundamental (1st Harmonic)

- Lowest possible frequency
- One antinode
- Nodes at each end
- L = λ/2

**f₁ = v/2L**

### Higher Harmonics

**2nd Harmonic:** f₂ = 2f₁, L = λ
**3rd Harmonic:** f₃ = 3f₁, L = 3λ/2
**nth Harmonic:** fₙ = nf₁

### General Formula

**fₙ = nv/2L**

Where:
- n = harmonic number (1, 2, 3...)
- v = wave speed on string
- L = length of string

### Air Columns

Similar principles apply to standing waves in pipes:

**Open at both ends:** Antinodes at ends
**Closed at one end:** Node at closed end, antinode at open end`,
                diagrams: [],
                subsections: []
            },
            {
                title: "9. Practical Demonstrations",
                content: `## Experiments with Superposition

### Laser Double-Slit Experiment

**Setup:**
- Laser → double slit → screen

**Observation:**
- Clear bright and dark fringes

**Analysis:**
- Measure x, D, a
- Calculate λ using x = λD/a

### Standing Waves on a String

**Setup:**
- String attached to vibrator
- Vibrator connected to signal generator
- Other end fixed

**Observation:**
- At resonant frequencies, clear standing wave patterns
- Nodes and antinodes visible

**Analysis:**
- Identify harmonic number
- Measure wavelength from node spacing

### Standing Waves with Microwaves

**Setup:**
- Microwave transmitter → metal reflector
- Probe detector between them

**Observation:**
- Detector signal varies as probe moves
- Maxima at antinodes, minima at nodes

**Analysis:**
- Distance between nodes = λ/2
- Calculate microwave wavelength`,
                diagrams: [],
                subsections: []
            },
            {
                title: "10. Key Formulae and Exam Practice",
                content: `## Essential Equations

| Formula | Application |
|---------|-------------|
| Path diff = nλ | Constructive interference |
| Path diff = (n+½)λ | Destructive interference |
| x = λD/a | Double-slit fringe spacing |
| fₙ = nv/2L | Harmonics on string |

---

## Worked Example 1

Double-slit: λ = 680 nm, D = 3.0 m, x = 6.0 mm

Find slit separation a.

**Solution:**
a = λD/x = (680 × 10⁻⁹ × 3.0)/(6.0 × 10⁻³)
a = **3.4 × 10⁻⁴ m** (0.34 mm)

---

## Worked Example 2

String: vibrator frequency 50 Hz, wave speed 40 m s⁻¹

**Wavelength:**
λ = v/f = 40/50 = **0.80 m**

**How standing wave forms:**
1. Wave travels along string
2. Reflects from fixed end
3. Reflected wave travels back
4. Same f, same A, opposite directions
5. Superposition → standing wave

---

## Common Exam Errors

❌ Forgetting unit conversions (nm → m, mm → m)
❌ Confusing constructive (nλ) and destructive ((n+½)λ)
❌ Mixing up nodes (zero) and antinodes (maximum)
❌ Wrong formula for harmonics`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Superposition: resultant displacement = vector sum of individual displacements",
            "Coherent sources: same frequency AND constant phase difference",
            "Constructive interference: path difference = nλ (bright fringes)",
            "Destructive interference: path difference = (n + ½)λ (dark fringes)",
            "Young's double-slit: x = λD/a",
            "Standing waves form from two identical waves travelling in opposite directions",
            "Nodes: zero amplitude; Antinodes: maximum amplitude",
            "Node to node = λ/2; node to antinode = λ/4",
            "Harmonics: fₙ = nv/2L",
            "Reflection at fixed end causes 180° phase change"
        ],
        exam_tips: [
            "Always convert units to SI before using x = λD/a (especially nm → m)",
            "Path difference conditions: memorise nλ vs (n+½)λ",
            "For standing waves, adjacent segments are in ANTIPHASE (180° out of phase)",
            "Intensity ∝ amplitude², so double amplitude = 4× intensity",
            "In Young's experiment: increasing slit separation DECREASES fringe spacing",
            "Check whether question asks for path difference in terms of λ or in metres"
        ]
    },
    "Electricity": {
        topic: "Electricity",
        subject: "A Level Physics",
        summary: "Electricity describes the flow of charge and energy transfer in circuits. This topic covers electric current (I = Q/t), potential difference (V = W/Q), resistance (R = V/I), Ohm's Law, resistivity (R = ρL/A), electrical power (P = VI = I²R = V²/R), EMF and internal resistance (V = E - Ir), resistors in series and parallel, potential dividers, and I-V characteristics of ohmic and non-ohmic components.",
        sections: [
            {
                title: "1. Electric Charge and Current",
                content: `## The Flow of Charge

### Electric Charge (Q)

**Charge** is a fundamental property of matter.

**SI Unit:** Coulomb (C)

**Elementary charge:** e = 1.60 × 10⁻¹⁹ C (charge on one electron/proton)

### Electric Current (I)

**Current** is the rate of flow of electric charge.

**Formula:**

**Q = It**

Where:
- Q = charge (C)
- I = current (A)
- t = time (s)

**SI Unit:** Ampere (A) — a base SI unit

1 A = 1 C s⁻¹

### Conventional Current vs Electron Flow

| Direction | Description |
|-----------|-------------|
| Conventional current | + to − (assumed positive charge flow) |
| Electron flow | − to + (actual electron movement in metals) |

**We use conventional current in circuit analysis.**

### Worked Example

Current = 0.03 A, time = 1 minute

Q = It = 0.03 × 60 = **1.8 C**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Potential Difference and EMF",
                content: `## Energy in Circuits

### Potential Difference (V)

**P.D.** is the energy transferred per unit charge passing through a component.

**V = W/Q**

Where:
- V = potential difference (V)
- W = work done/energy transferred (J)
- Q = charge (C)

**SI Unit:** Volt (V) = J C⁻¹

### Electromotive Force (EMF)

**EMF (E or ε)** is the total energy transferred per unit charge in driving charge around a complete circuit.

- EMF is what the source PROVIDES
- P.D. is what components USE

### EMF vs Terminal Voltage

Real power sources have **internal resistance (r)**.

**V = E − Ir**

Where:
- V = terminal voltage (p.d. across external circuit)
- E = EMF of source
- I = current
- r = internal resistance
- Ir = "lost volts" (energy dissipated inside source)

### Key Point

Terminal voltage = EMF only when:
- No current flows (I = 0), OR
- Internal resistance is zero (r = 0)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Resistance and Ohm's Law",
                content: `## Opposition to Current Flow

### Definition of Resistance

**Resistance (R)** is the ratio of p.d. across a component to the current through it.

**R = V/I**

**SI Unit:** Ohm (Ω) = V A⁻¹

### Ohm's Law

**For a metallic conductor at constant temperature, current is proportional to potential difference.**

V = IR (or I ∝ V at constant T)

### Ohmic vs Non-Ohmic Conductors

**Ohmic conductors:**
- Obey Ohm's Law
- Constant resistance
- I-V graph: straight line through origin
- Example: metal wire at constant temperature

**Non-ohmic conductors:**
- Do NOT obey Ohm's Law
- Resistance varies with current/voltage
- Examples: filament lamp, diode, thermistor

### Filament Lamp

As current increases:
- Temperature increases
- Lattice ions vibrate more
- Electrons collide more often
- **Resistance increases**

I-V graph curves — NOT a straight line`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Resistivity",
                content: `## Material Property

### Definition

**Resistivity (ρ)** is an intrinsic property of a material that quantifies its opposition to current flow.

### Formula

**R = ρL/A**

Where:
- R = resistance (Ω)
- ρ = resistivity (Ω m)
- L = length (m)
- A = cross-sectional area (m²)

**SI Unit:** Ohm-metre (Ω m)

### What Affects Resistance?

| Factor | Effect |
|--------|--------|
| Length ↑ | Resistance ↑ |
| Area ↑ | Resistance ↓ |
| Resistivity ↑ | Resistance ↑ |

### Typical Resistivity Values

| Material | Type | ρ (Ω m) |
|----------|------|---------|
| Copper | Conductor | 1.7 × 10⁻⁸ |
| Silicon | Semiconductor | 2.3 × 10³ |
| Glass | Insulator | ~10¹² |

### Temperature Effects

**Metals:** ρ increases with temperature
**Semiconductors:** ρ decreases with temperature

### Worked Example

Copper wire: L = 2.0 m, A = 1.0 mm², ρ = 1.7 × 10⁻⁸ Ω m

A = 1.0 × 10⁻⁶ m²

R = ρL/A = (1.7 × 10⁻⁸ × 2.0)/(1.0 × 10⁻⁶) = **0.034 Ω**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Electrical Power",
                content: `## Rate of Energy Transfer

### Definition

**Power** is the rate of doing work or transferring energy.

**SI Unit:** Watt (W) = J s⁻¹

### Power Formulae

**P = VI** (primary formula)

Using V = IR:

**P = I²R** (useful when you know I and R)

**P = V²/R** (useful when you know V and R)

### Energy Calculation

**E = Pt = VIt**

Where E is energy in joules, t is time in seconds.

### Worked Example

Resistor: R = 5.0 Ω, V = 12 V

P = V²/R = 144/5.0 = **28.8 W**

### Power in Real Circuits

Power dissipated in internal resistance:
P_internal = I²r

Power delivered to external circuit:
P_external = I²R = VI

Total power from source:
P_total = EI`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Internal Resistance",
                content: `## Real Power Sources

### What is Internal Resistance?

**Internal resistance (r)** is the resistance within the power source itself.

All real batteries/cells have internal resistance.

### The Key Equation

**V = E − Ir**

Or equivalently: **E = V + Ir**

Where:
- E = EMF (what source provides)
- V = terminal p.d. (what external circuit receives)
- Ir = "lost volts" (dissipated inside source)

### Circuit Equation

For a complete circuit with external resistance R:

**I = E/(R + r)**

Total resistance = R + r (internal in series with external)

### Worked Example

Battery: E = 13.0 V (measured with no current)
Under load: V = 12.0 V when I = 3.0 A

**Lost volts:** E − V = 13.0 − 12.0 = 1.0 V

**Internal resistance:**
r = (lost volts)/I = 1.0/3.0 = **0.33 Ω**

### Maximum Power Transfer

Maximum power is delivered to external circuit when R = r`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Resistors in Series",
                content: `## End-to-End Connection

### Series Circuit Properties

**Current:** Same through each resistor
I_total = I₁ = I₂ = I₃

**Voltage:** Divided between resistors
V_total = V₁ + V₂ + V₃

### Formula for Total Resistance

**R_total = R₁ + R₂ + R₃ + ...**

### Why This Works

Same current through each resistor, voltages add:
V = IR₁ + IR₂ + IR₃ = I(R₁ + R₂ + R₃)

So R_total = R₁ + R₂ + R₃

### Key Points

- Total resistance is GREATER than any individual
- If one component fails (breaks), entire circuit stops
- Current is the same everywhere in series

### Example

R₁ = 10 Ω, R₂ = 20 Ω, R₃ = 30 Ω

R_total = 10 + 20 + 30 = **60 Ω**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Resistors in Parallel",
                content: `## Side-by-Side Connection

### Parallel Circuit Properties

**Voltage:** Same across each resistor
V_total = V₁ = V₂ = V₃

**Current:** Divided between branches
I_total = I₁ + I₂ + I₃

### Formula for Total Resistance

**1/R_total = 1/R₁ + 1/R₂ + 1/R₃ + ...**

For two resistors:
**R_total = (R₁ × R₂)/(R₁ + R₂)**

### Why This Works

Same voltage, currents add:
I = V/R₁ + V/R₂ = V(1/R₁ + 1/R₂)

So 1/R_total = 1/R₁ + 1/R₂

### Key Points

- Total resistance is LESS than smallest individual
- If one branch fails, others continue to work
- Voltage is the same across parallel branches

### Example

R₁ = 6 Ω, R₂ = 12 Ω

1/R = 1/6 + 1/12 = 2/12 + 1/12 = 3/12 = 1/4

R_total = **4 Ω**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "9. Potential Dividers",
                content: `## Voltage Splitting Circuits

### What is a Potential Divider?

Two or more resistors in series that "divide" the supply voltage.

### The Formula

**V_out = (R₂/(R₁ + R₂)) × V_in**

Where V_out is measured across R₂.

### Derivation

Current through both resistors:
I = V_in/(R₁ + R₂)

Voltage across R₂:
V_out = IR₂ = V_in × R₂/(R₁ + R₂)

### Key Relationships

- V₁/V₂ = R₁/R₂ (voltage ratio = resistance ratio)
- V₁ + V₂ = V_in (voltages add to supply)

### Applications

**Sensor circuits:**
- Thermistor: Temperature changes → R changes → V_out changes
- LDR: Light changes → R changes → V_out changes

### Worked Example

V_in = 12 V, R₁ = 2.0 kΩ, R₂ = 4.0 kΩ

V_out = (4.0/(2.0 + 4.0)) × 12 = (4/6) × 12 = **8.0 V**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "10. I-V Characteristics",
                content: `## Graphical Analysis

### Ohmic Conductor (e.g., metal wire at constant T)

- Straight line through origin
- Constant gradient = constant resistance
- R = V/I (same at all points)

### Filament Lamp

- Curved line through origin
- Gradient decreases as V increases
- Resistance INCREASES at higher currents
- Due to heating effect

### Semiconductor Diode

- Highly asymmetric graph
- Forward bias: Low resistance, current flows
- Reverse bias: Very high resistance, no current
- Non-linear, non-ohmic

### Thermistor (NTC type)

- Resistance DECREASES as temperature increases
- Used in temperature sensors

### LDR (Light Dependent Resistor)

- Resistance DECREASES as light intensity increases
- Used in light sensors

### Determining Resistance from I-V Graph

**At any point:** R = V/I (NOT the gradient)

**Gradient of I-V graph = 1/R** (conductance)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "11. Kirchhoff's Laws",
                content: `## Circuit Analysis Rules

### Kirchhoff's First Law (Conservation of Charge)

**The sum of currents entering a junction equals the sum of currents leaving.**

ΣI_in = ΣI_out

Based on: Conservation of charge

### Kirchhoff's Second Law (Conservation of Energy)

**The sum of EMFs around any closed loop equals the sum of p.d.s around that loop.**

ΣE = ΣIR

Based on: Conservation of energy

### Applying the Laws

**First Law (at junctions):**
If I₁ enters and I₂, I₃ leave: I₁ = I₂ + I₃

**Second Law (around loops):**
Going around a loop, EMFs = sum of (IR) drops

### Sign Conventions

- EMF: + if loop goes − to + through source
- EMF: − if loop goes + to − through source
- IR: + if loop goes with current direction
- IR: − if loop goes against current direction

### When to Use

- Complex circuits with multiple loops
- Circuits with multiple EMF sources
- When series/parallel rules don't apply simply`,
                diagrams: [],
                subsections: []
            },
            {
                title: "12. Key Formulae and Exam Practice",
                content: `## Essential Equations

| Formula | Application |
|---------|-------------|
| Q = It | Charge and current |
| V = W/Q | Potential difference |
| V = IR | Ohm's Law |
| R = ρL/A | Resistivity |
| P = VI = I²R = V²/R | Power |
| V = E − Ir | Internal resistance |
| R = R₁ + R₂ | Series resistors |
| 1/R = 1/R₁ + 1/R₂ | Parallel resistors |
| V_out = R₂V_in/(R₁+R₂) | Potential divider |

---

## Worked Example 1

Battery E = 6.0 V (negligible r), voltmeter reads 4.8 V across 32 Ω resistor.

**Current in 32 Ω:**
I = V/R = 4.8/32 = **0.15 A**

**Total power:**
P = EI = 6.0 × 0.15 = **0.90 W**

---

## Worked Example 2

Number of electrons in 25 s when I = 0.15 A:

Q = It = 0.15 × 25 = 3.75 C
n = Q/e = 3.75/(1.6 × 10⁻¹⁹) = **2.3 × 10¹⁹**

---

## Common Exam Errors

❌ Confusing EMF with terminal voltage
❌ Using R = R₁ + R₂ for parallel circuits
❌ Forgetting internal resistance in total circuit R
❌ Not converting mm² to m² for area`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Current I = Q/t (rate of flow of charge)",
            "Potential difference V = W/Q (energy per unit charge)",
            "Resistance R = V/I; Ohm's Law: V = IR at constant T",
            "Resistivity: R = ρL/A (material property)",
            "Power: P = VI = I²R = V²/R",
            "Internal resistance: V = E − Ir (terminal voltage < EMF)",
            "Series: R_total = R₁ + R₂ (current same, voltage divides)",
            "Parallel: 1/R_total = 1/R₁ + 1/R₂ (voltage same, current divides)",
            "Potential divider: V_out = R₂V_in/(R₁ + R₂)",
            "Kirchhoff's Laws: conservation of charge and energy"
        ],
        exam_tips: [
            "Always include internal resistance when calculating total circuit resistance",
            "Convert mm² to m² for area: 1 mm² = 1 × 10⁻⁶ m²",
            "For parallel: answer must be LESS than smallest resistor",
            "Resistance from I-V graph = V/I at a point, NOT the gradient",
            "EMF = terminal p.d. only when I = 0 or r = 0",
            "In potential divider, larger resistor has larger share of voltage"
        ]
    },
    "DC Circuits": {
        topic: "DC Circuits",
        subject: "A Level Physics",
        summary: "DC (Direct Current) circuits involve current flowing in one constant direction. This topic covers Ohm's Law (V = IR), resistors in series and parallel, Kirchhoff's Current and Voltage Laws, EMF and internal resistance (V = E - Ir), potential dividers, electrical power (P = VI), and the analysis of complex circuit networks. Understanding DC circuits is fundamental to electronics and electrical engineering.",
        sections: [
            {
                title: "1. Introduction to DC Circuits",
                content: `## Fundamentals of Direct Current

### What is a DC Circuit?

A **DC (Direct Current) circuit** is one where current flows in a single, constant direction.

### Key Components

| Component | Function |
|-----------|----------|
| Cell/Battery | Provides EMF (energy source) |
| Resistor | Controls current, creates p.d. |
| Switch | Opens/closes circuit |
| Ammeter | Measures current (in series) |
| Voltmeter | Measures p.d. (in parallel) |
| Lamp | Converts electrical to light energy |

### Conventional Current

**Conventional current:** Direction of positive charge flow (+ to −)

**Electron flow:** Actual movement in metals (− to +)

We use **conventional current** in all circuit analysis.

### Circuit Symbols

Learn and recognize standard circuit symbols for:
- Cells and batteries
- Resistors (fixed and variable)
- Ammeters and voltmeters
- Switches
- Lamps and LEDs`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Ohm's Law Revisited",
                content: `## The Fundamental Relationship

### Statement

**For a metallic conductor at constant temperature, current is proportional to potential difference.**

### Formula

**V = IR**

Where:
- V = potential difference (V)
- I = current (A)
- R = resistance (Ω)

### Ohmic Conductors

- Obey Ohm's Law
- Constant resistance
- I-V graph: straight line through origin

### Non-Ohmic Conductors

**Filament Lamp:**
- As I increases, temperature rises
- Increased ion vibrations
- **Resistance increases**
- Curved I-V graph

**Semiconductor Diode:**
- Forward bias: low R, current flows
- Reverse bias: very high R, no current
- Asymmetric I-V graph

### Worked Example

Heater: V = 240 V, I = 4.2 A

R = V/I = 240/4.2 = **57.1 Ω**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Resistors in Series",
                content: `## Single Path Circuits

### Properties of Series Circuits

**Current:** Same through all components
I_total = I₁ = I₂ = I₃

**Voltage:** Shared between components
V_total = V₁ + V₂ + V₃

### Formula

**R_total = R₁ + R₂ + R₃ + ...**

### Why This Works

Same current I through each:
V_total = IR₁ + IR₂ + IR₃ = I(R₁ + R₂ + R₃)

### Key Points

- Total R is GREATER than any individual R
- If one component breaks, circuit stops
- Voltage divides in proportion to resistance

### Example

R₁ = 10 Ω, R₂ = 20 Ω, R₃ = 30 Ω in series

R_total = 10 + 20 + 30 = **60 Ω**

### Voltage Distribution

V₁ : V₂ : V₃ = R₁ : R₂ : R₃`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Resistors in Parallel",
                content: `## Multiple Path Circuits

### Properties of Parallel Circuits

**Voltage:** Same across all branches
V_total = V₁ = V₂ = V₃

**Current:** Divides between branches
I_total = I₁ + I₂ + I₃

### Formula

**1/R_total = 1/R₁ + 1/R₂ + 1/R₃ + ...**

For two resistors:
**R_total = (R₁ × R₂)/(R₁ + R₂)**

### Why This Works

Same voltage V across each:
I_total = V/R₁ + V/R₂ = V(1/R₁ + 1/R₂)

### Key Points

- Total R is LESS than smallest individual R
- If one branch fails, others continue
- Current divides inversely to resistance

### Example

R₁ = 6 Ω, R₂ = 12 Ω in parallel

1/R = 1/6 + 1/12 = 3/12

R_total = **4 Ω** (less than 6 Ω)

### Current Distribution

I₁ : I₂ = R₂ : R₁ (inverse ratio)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Kirchhoff's Laws",
                content: `## Conservation Laws in Circuits

### Kirchhoff's Current Law (KCL)

**The sum of currents entering a junction equals the sum leaving.**

ΣI_in = ΣI_out

Based on: **Conservation of charge**

### Kirchhoff's Voltage Law (KVL)

**In any closed loop, the sum of EMFs equals the sum of p.d.s.**

ΣE = ΣIR

Based on: **Conservation of energy**

### Applying KVL

1. Choose a loop direction (e.g., clockwise)
2. EMF: + if you go − to + through source
3. EMF: − if you go + to − through source
4. IR: consider direction relative to current

### Worked Example

Two cells: E₁ = 3.0 V, E₂ = 1.5 V (opposing)
Resistors: R₁ = 2.0 Ω, R₂ = 4.0 Ω

ΣE = 3.0 − 1.5 = 1.5 V
ΣIR = I(2.0 + 4.0) = 6.0I

I = 1.5/6.0 = **0.25 A**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. EMF and Internal Resistance",
                content: `## Real Power Sources

### Definitions

**EMF (E):** Total energy transferred per unit charge by source

**Internal resistance (r):** Resistance within the source itself

### The Key Equation

**V = E − Ir**

Where:
- V = terminal p.d. (what external circuit gets)
- E = EMF (what source provides)
- Ir = "lost volts" (dissipated inside source)

### Important Points

- Terminal p.d. < EMF when current flows
- Terminal p.d. = EMF only when I = 0
- Lost volts increase with current

### Total Circuit Equation

**I = E/(R + r)**

where R is external resistance, r is internal

### Worked Example

Open circuit: V = 13.0 V → **E = 13.0 V**
Under load: V = 12.0 V when I = 3.0 A

Lost volts = E − V = 13.0 − 12.0 = 1.0 V

r = (lost volts)/I = 1.0/3.0 = **0.33 Ω**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Potential Dividers",
                content: `## Voltage Control Circuits

### What is a Potential Divider?

Two (or more) resistors in series that "divide" the supply voltage.

### The Formula

**V_out = V_in × (R₂/(R₁ + R₂))**

Where V_out is taken across R₂.

### Key Relationship

V₁/V₂ = R₁/R₂

Voltage divides in proportion to resistance.

### Applications

**Sensor circuits:**
- Thermistor: R changes with temperature
- LDR: R changes with light intensity
- Output voltage varies with conditions

**Variable voltage supply:**
- Use potentiometer (variable R)
- Adjust output from 0 to V_in

### Worked Example

V_in = 12 V, R₁ = 2.0 kΩ, R₂ = 4.0 kΩ

V_out = 12 × (4.0/(2.0 + 4.0))
V_out = 12 × (4/6) = **8.0 V**

V across R₁ = 12 − 8 = **4.0 V**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Power in DC Circuits",
                content: `## Energy Transfer Rate

### Power Formulae

**P = VI** (primary)

**P = I²R** (when I and R known)

**P = V²/R** (when V and R known)

### Units

Power in watts (W) = J s⁻¹

### Energy Calculation

**E = Pt = VIt**

### Power Distribution in Circuits

**Total power from source:**
P_total = EI

**Power in external circuit:**
P_external = VI = I²R

**Power in internal resistance:**
P_internal = I²r (wasted as heat)

### Worked Example

Resistor: R = 12 Ω, V = 24 V

P = V²/R = 576/12 = **48 W**

### Maximum Power Transfer

Maximum power to external load when **R = r**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "9. Measurement and Instrumentation",
                content: `## Practical Circuit Analysis

### Ammeter

- Measures current
- Connected in **series**
- Ideal ammeter has **zero resistance**

### Voltmeter

- Measures potential difference
- Connected in **parallel**
- Ideal voltmeter has **infinite resistance**

### Real Instruments

Real ammeters have small resistance → slightly reduces current

Real voltmeters have high (not infinite) resistance → draw small current

### Common Experimental Errors

**Systematic errors:**
- Zero error (meter doesn't read 0 when it should)
- Calibration error
- Correction: check against known standard

**Random errors:**
- Fluctuating readings
- Parallax error
- Correction: take multiple readings, calculate average

### Good Practice

- Check zero before measuring
- Use appropriate range for instrument
- Connect ammeter in series, voltmeter in parallel
- Account for meter resistance if given`,
                diagrams: [],
                subsections: []
            },
            {
                title: "10. Key Formulae and Exam Practice",
                content: `## Essential Equations

| Formula | Application |
|---------|-------------|
| V = IR | Ohm's Law |
| R = R₁ + R₂ | Series resistors |
| 1/R = 1/R₁ + 1/R₂ | Parallel resistors |
| ΣI = 0 | Kirchhoff's Current Law |
| ΣE = ΣIR | Kirchhoff's Voltage Law |
| V = E − Ir | Internal resistance |
| V_out = V_in(R₂/(R₁+R₂)) | Potential divider |
| P = VI = I²R = V²/R | Power |

---

## Worked Example 1

Battery E = 6.0 V, negligible r
Voltmeter reads 4.8 V across 32 Ω resistor Z

**Current in Z:**
I = V/R = 4.8/32 = **0.15 A**

**Total power:**
P = EI = 6.0 × 0.15 = **0.90 W**

---

## Worked Example 2

Electrons in 25 s when I = 0.15 A:

Q = It = 0.15 × 25 = 3.75 C
n = Q/e = 3.75/(1.6 × 10⁻¹⁹) = **2.3 × 10¹⁹**

---

## Common Exam Errors

❌ Using series formula for parallel
❌ Forgetting internal resistance
❌ Ammeter in parallel, voltmeter in series
❌ Wrong signs in Kirchhoff's Voltage Law`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Ohm's Law: V = IR (for metallic conductor at constant T)",
            "Series: R_total = R₁ + R₂; current same, voltage divides",
            "Parallel: 1/R_total = 1/R₁ + 1/R₂; voltage same, current divides",
            "KCL: ΣI_in = ΣI_out at any junction",
            "KVL: ΣE = ΣIR around any closed loop",
            "Internal resistance: V = E − Ir (terminal < EMF)",
            "Total current: I = E/(R + r)",
            "Potential divider: V_out = V_in × R₂/(R₁ + R₂)",
            "Power: P = VI = I²R = V²/R",
            "Ammeter in series (low R); Voltmeter in parallel (high R)"
        ],
        exam_tips: [
            "Always identify series vs parallel before applying formulae",
            "Include internal resistance in total circuit resistance",
            "For parallel, answer must be LESS than smallest resistor",
            "In KVL, be careful with signs for opposing EMFs",
            "Check: V_out cannot exceed V_in in potential divider",
            "For maximum power transfer: external R = internal r"
        ]
    },
    "Deformation of Solids": {
        topic: "Deformation of Solids",
        subject: "A Level Physics",
        summary: "Deformation describes how solids change shape under applied forces. This topic covers elastic vs plastic deformation, stress (σ = F/A), strain (ε = ΔL/L₀), Hooke's Law (F = kx), the Young Modulus (E = stress/strain), force-extension and stress-strain graphs, elastic potential energy (Eₚ = ½kx²), and experimental determination of Young Modulus. Understanding material properties is essential for engineering and structural design.",
        sections: [
            {
                title: "1. Elastic and Plastic Deformation",
                content: `## Types of Deformation

### Deformation

**Deformation** is the change in shape or size of a solid when forces are applied.

### Elastic Deformation

- **Reversible** change
- Object returns to original shape when force removed
- Example: stretched rubber band

### Plastic Deformation

- **Irreversible** change
- Object permanently deformed
- Example: bent paperclip

### Comparison

| Property | Elastic | Plastic |
|----------|---------|---------|
| Reversible? | Yes | No |
| Permanent? | No | Yes |
| Returns to original? | Yes | No |

### Real-World Examples

**Elastic:** Car suspension springs, trampoline

**Plastic:** Car body in crash (absorbs energy), metal forming

### Key Limits

**Elastic limit:** Maximum force for elastic behaviour

Beyond elastic limit → permanent deformation`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Stress (σ)",
                content: `## Force Per Unit Area

### Definition

**Tensile stress** is the force applied per unit cross-sectional area.

### Formula

**σ = F/A**

Where:
- σ (sigma) = stress (Pa or N m⁻²)
- F = applied force (N)
- A = cross-sectional area (m²)

### SI Unit

Pascal (Pa) = N m⁻²

### Types of Stress

**Tensile stress:** Forces pulling/stretching

**Compressive stress:** Forces pushing/squeezing

### Why Stress is Useful

- Independent of object size
- Intrinsic property comparison
- Same material, different sizes → same stress for same strain

### Calculating Area

For circular wire:
A = πr² = π(d/2)² = πd²/4

**Common error:** Using diameter instead of radius!`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Strain (ε)",
                content: `## Fractional Change in Length

### Definition

**Tensile strain** is the ratio of extension to original length.

### Formula

**ε = ΔL/L₀**

Where:
- ε (epsilon) = strain (no units)
- ΔL = extension (m)
- L₀ = original length (m)

### Units

Strain is **dimensionless** (ratio of two lengths)

Often expressed as percentage: strain × 100%

### Types of Strain

**Tensile strain:** Fractional increase in length

**Compressive strain:** Fractional decrease in length

### Why Strain is Useful

- Normalizes deformation to original size
- Allows comparison between different sized samples
- Intrinsic material property

### Example

Wire: L₀ = 2.0 m, extends by 4.0 mm

ε = ΔL/L₀ = 0.004/2.0 = **0.002** (or 0.2%)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Hooke's Law",
                content: `## Proportionality of Force and Extension

### Statement

**Within the limit of proportionality, extension is directly proportional to applied force.**

### Formula

**F = kx**

Where:
- F = applied force (N)
- k = spring constant (N m⁻¹)
- x = extension (m)

### Spring Constant (k)

**k = F/x**

- Measures stiffness
- Higher k = stiffer spring
- Units: N m⁻¹

### Important Limits

**Limit of proportionality (P):**
- End of linear region on F-x graph
- F ∝ x no longer valid beyond this

**Elastic limit:**
- Beyond this → permanent deformation
- Usually just after P

### Force-Extension Graph

- Linear region: obeys Hooke's Law
- Gradient = spring constant k
- Beyond P: curve, no longer proportional`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Young Modulus (E)",
                content: `## Material Stiffness

### Definition

**Young Modulus** is the ratio of stress to strain within the limit of proportionality.

### Formula

**E = σ/ε = (F/A)/(ΔL/L₀)**

Rearranging:

**E = FL₀/(AΔL)**

### SI Unit

Pascal (Pa) or N m⁻² (same as stress)

### Physical Meaning

- Measures material **stiffness**
- High E = stiff material (steel, diamond)
- Low E = flexible material (rubber)

### Typical Values

| Material | Young Modulus (GPa) |
|----------|---------------------|
| Steel | 200 |
| Copper | 120 |
| Aluminium | 70 |
| Glass | 70 |
| Rubber | 0.01-0.1 |

### Key Point

Young Modulus is a **material property** — same for all samples of same material, regardless of dimensions.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Force-Extension Graphs",
                content: `## Graphical Analysis

### Features of F-x Graph

**Linear region (origin to P):**
- Obeys Hooke's Law
- Gradient = spring constant k

**Limit of proportionality (P):**
- End of straight line
- F ∝ x ends here

**Elastic limit:**
- Beyond here → plastic deformation
- Material won't return to original length

**Plastic region:**
- Curve beyond elastic limit
- Permanent deformation

### Spring Constant from Graph

**k = gradient = ΔF/Δx**

### Energy from Graph

**Area under F-x graph = work done = energy stored**

For linear region (triangle):
**Eₚ = ½Fx = ½kx²**

### Loading and Unloading

**Elastic material:**
Loading and unloading follow same path

**Plastic deformation:**
Unloading returns parallel but offset`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Stress-Strain Graphs",
                content: `## Material Properties

### Advantages Over F-x Graphs

- Independent of sample dimensions
- Show **intrinsic material properties**
- Allow direct comparison of materials

### Features

**Linear region:**
- Stress ∝ strain
- Gradient = **Young Modulus E**

**Elastic region:**
- Returns to origin when stress removed

**Plastic region:**
- Permanent deformation
- Won't return to origin

### Young Modulus from Graph

**E = gradient = Δσ/Δε**

### Area Under Curve

Area = energy stored per unit volume (J m⁻³)

### Comparing Materials

**Steeper gradient:** Higher E, stiffer

**Larger area:** More energy absorbed before failure`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Elastic Potential Energy",
                content: `## Stored Energy

### Definition

**Elastic potential energy** is energy stored in a deformed elastic material.

### Formulae

**Eₚ = ½Fx** (area of triangle)

**Eₚ = ½kx²** (using F = kx)

Where:
- Eₚ = elastic potential energy (J)
- F = force (N)
- x = extension (m)
- k = spring constant (N m⁻¹)

### Energy for Non-Zero Start

If extension changes from x₁ to x₂:

**ΔEₚ = ½k(x₂² − x₁²)**

### Worked Example

k = 200 N m⁻¹, x₁ = 5.0 cm, x₂ = 9.0 cm

ΔEₚ = ½ × 200 × (0.09² − 0.05²)
ΔEₚ = 100 × (0.0081 − 0.0025)
ΔEₚ = **0.56 J**

### Energy Recovery

- Elastic: all energy recovered
- Plastic: some energy permanently lost (heat)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "9. Experimental Determination of Young Modulus",
                content: `## Practical Method

### Equipment

- Long wire (>1 m for measurable extension)
- Micrometer (for diameter)
- Metre rule (for length)
- Vernier scale (for extension)
- Mass hanger and masses

### Procedure

1. Measure original length L₀
2. Measure diameter at several points (average)
3. Add masses incrementally
4. Record extension for each load
5. Plot stress-strain graph

### Calculations

**Area:** A = π(d/2)² = πd²/4

**Stress:** σ = F/A = mg/A

**Strain:** ε = ΔL/L₀

**Young Modulus:** E = gradient of σ-ε graph

### Sources of Uncertainty

**Diameter measurement:**
- Biggest source of error
- % error in A = 2 × % error in d

**Other errors:**
- Parallax when reading extension
- Kinks in wire
- Exceeding elastic limit`,
                diagrams: [],
                subsections: []
            },
            {
                title: "10. Key Formulae and Exam Practice",
                content: `## Essential Equations

| Formula | Quantity |
|---------|----------|
| σ = F/A | Stress |
| ε = ΔL/L₀ | Strain |
| E = σ/ε | Young Modulus |
| F = kx | Hooke's Law |
| Eₚ = ½kx² | Elastic PE |
| Eₚ = ½Fx | Elastic PE |

---

## Worked Example 1

Wire: L₀ = 1.70 m, A = 5.74 × 10⁻⁸ m²
E = 1.60 × 10¹¹ Pa, F = 25.0 N

**Extension:**
ΔL = FL₀/(AE)
ΔL = (25 × 1.70)/(5.74 × 10⁻⁸ × 1.60 × 10¹¹)
ΔL = 42.5/9184 = **4.63 mm**

---

## Effect of Dimensions

**Double length:** Extension doubles
**Double diameter:** Area × 4, extension ÷ 4

Net effect of both: extension halved

---

## Common Exam Errors

❌ Using diameter instead of radius for area
❌ Forgetting to convert mm to m
❌ Confusing F-x gradient (k) with σ-ε gradient (E)
❌ Applying formulae beyond elastic limit`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Elastic deformation: reversible; Plastic: permanent",
            "Stress σ = F/A (Pa); Strain ε = ΔL/L₀ (dimensionless)",
            "Hooke's Law: F = kx (within limit of proportionality)",
            "Spring constant k = F/x (gradient of F-x graph)",
            "Young Modulus E = σ/ε = FL₀/AΔL (gradient of σ-ε graph)",
            "Elastic potential energy: Eₚ = ½Fx = ½kx²",
            "Area under F-x graph = work done = energy stored",
            "Young Modulus is a material property (independent of dimensions)",
            "Elastic limit: max stress for elastic behaviour",
            "Doubling diameter quadruples area, quarters extension"
        ],
        exam_tips: [
            "Always use radius (not diameter) in A = πr²",
            "Convert mm to m before calculations",
            "Gradient of F-x graph = k; gradient of σ-ε graph = E",
            "For extension problems, rearrange to ΔL = FL₀/AE",
            "Remember: stress has units (Pa), strain has NO units",
            "% error in area = 2 × % error in diameter"
        ]
    },
    "Particle Physics": {
        topic: "Particle Physics",
        subject: "A Level Physics",
        summary: "Particle physics studies the fundamental constituents of matter and their interactions. This topic covers the classification of particles (hadrons vs leptons), quarks (up and down with fractional charges), baryons (proton = uud, neutron = udd), mesons, antiparticles, pair annihilation, the four fundamental forces, conservation laws (charge, nucleon number), alpha and beta decay, and applications like PET scanning.",
        sections: [
            {
                title: "1. Introduction to Particle Physics",
                content: `## The Fundamental Building Blocks

### What is Particle Physics?

The study of the ultimate constituents of matter and the interactions between them.

### Fundamental Particles

Particles with no smaller constituent parts — the most elementary objects known.

### Two Main Families

**Hadrons:**
- Affected by strong nuclear force
- Made of smaller particles called quarks
- Examples: proton, neutron

**Leptons:**
- NOT affected by strong nuclear force
- Fundamental (not made of quarks)
- Examples: electron (e⁻), positron (e⁺), neutrino (ν)

### Key Concept

Understanding particles requires understanding both:
1. The particles themselves
2. The forces that act between them`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. The Four Fundamental Forces",
                content: `## Forces That Govern the Universe

### Strong Nuclear Force

- Acts on hadrons (particles made of quarks)
- Binds quarks together in protons/neutrons
- Binds protons and neutrons in nucleus
- Overcomes electrostatic repulsion

### Electromagnetic Force

- Acts on charged particles
- Binds electrons to nucleus
- Responsible for chemistry
- Infinite range (decreases with distance)

### Weak Nuclear Force

- Responsible for beta decay
- Changes quark flavour (d → u or u → d)
- Short range

### Gravitational Force

- Acts on all particles with mass
- Weakest at particle level
- Dominates at large scales

| Force | Acts On | Responsible For |
|-------|---------|-----------------|
| Strong | Hadrons | Binding quarks, holding nucleus |
| EM | Charged particles | Atomic structure |
| Weak | All particles | Beta decay |
| Gravity | Mass | Large-scale structure |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Classification of Particles",
                content: `## Organizing the Particle Zoo

### Leptons

**Fundamental particles** not subject to strong force.

| Particle | Symbol | Charge |
|----------|--------|--------|
| Electron | e⁻ | −e |
| Positron | e⁺ | +e |
| Neutrino | ν | 0 |
| Antineutrino | ν̅ | 0 |

### Hadrons

**Composite particles** made of quarks, subject to strong force.

**Baryons** (3 quarks):
- Proton (p): uud, charge = +e
- Neutron (n): udd, charge = 0

**Mesons** (quark + antiquark):
- Pion π⁺: ud̅, charge = +e
- Pion π⁻: dū, charge = −e

### Summary Table

| Particle | Category | Composition | Charge |
|----------|----------|-------------|--------|
| Proton | Baryon | uud | +e |
| Neutron | Baryon | udd | 0 |
| Electron | Lepton | Fundamental | −e |
| Positron | Lepton | Fundamental | +e |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Quarks",
                content: `## Fundamental Constituents of Hadrons

### The Quark Model

Hadrons are NOT fundamental — they are made of quarks.

### Up and Down Quarks

| Quark | Symbol | Charge |
|-------|--------|--------|
| Up | u | +⅔ e |
| Down | d | −⅓ e |

### Antiquarks

| Antiquark | Symbol | Charge |
|-----------|--------|--------|
| Anti-up | ū | −⅔ e |
| Anti-down | d̅ | +⅓ e |

### Proton Composition

**uud**
Charge = (+⅔) + (+⅔) + (−⅓) = **+1e** ✓

### Neutron Composition

**udd**
Charge = (+⅔) + (−⅓) + (−⅓) = **0** ✓

### Key Point

Quarks have **fractional charges** but combine to give integer charges for hadrons.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Antiparticles",
                content: `## Mirror Matter

### Definition

For every particle, there exists an **antiparticle** with:
- Same mass
- Opposite charge
- Opposite other quantum numbers

### Examples

| Particle | Antiparticle | Mass | Charge |
|----------|--------------|------|--------|
| Electron (e⁻) | Positron (e⁺) | Same | Opposite |
| Proton (p) | Antiproton (p̅) | Same | Opposite |
| Neutrino (ν) | Antineutrino (ν̅) | Same | 0 |

### Pair Annihilation

When particle meets antiparticle:

**e⁻ + e⁺ → 2γ**

1. Matter and antimatter collide
2. Total mass converted to energy (E = mc²)
3. Two gamma-ray photons produced
4. Photons travel in **opposite directions** (conserve momentum)

### Why Two Photons?

- Conserve momentum
- If initial momentum ≈ 0, final momentum must be 0
- Two photons in opposite directions achieve this`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Conservation Laws",
                content: `## Rules That Must Be Obeyed

### Conservation of Charge

Total electric charge before = total after

### Conservation of Nucleon Number (A)

Total nucleons before = total nucleons after

| Particle | Nucleon Number |
|----------|----------------|
| Proton | 1 |
| Neutron | 1 |
| Electron | 0 |
| Positron | 0 |

### Conservation of Energy and Momentum

Total energy and momentum are always conserved.

### Worked Example: β⁻ Decay

⁹⁰₃₈Sr → ⁹⁰₃₉Y + e⁻ + ν̅

**Check nucleon number:**
Before: 90
After: 90 + 0 + 0 = 90 ✓

**Check charge:**
Before: +38
After: +39 + (−1) + 0 = +38 ✓

Both conservation laws satisfied!`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Alpha and Beta Decay",
                content: `## Radioactive Transformations

### Alpha (α) Decay

Emission of helium nucleus (⁴₂He)

**General form:**
ᴬzX → ᴬ⁻⁴z₋₂Y + ⁴₂He

**Example:**
²³⁸₉₂U → ²³⁴₉₀Th + ⁴₂He

**Energy:** α-particles have discrete (fixed) energy

### Beta-minus (β⁻) Decay

Neutron → proton + electron + antineutrino

**n → p + e⁻ + ν̅**

Quark level: **d → u**

### Beta-plus (β⁺) Decay

Proton → neutron + positron + neutrino

**p → n + e⁺ + ν**

Quark level: **u → d**

### Energy Spectra

| Decay | Energy Spectrum |
|-------|-----------------|
| Alpha | Discrete (fixed) |
| Beta | Continuous (range) |

**Why continuous for beta?**
Energy shared between 3 particles (nucleus, beta, neutrino)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Quark Transformations in Beta Decay",
                content: `## The Quark Level View

### β⁻ Decay at Quark Level

**Neutron becomes proton**

Before: n = udd
After: p = uud

**One down quark changes to up:**
d → u

This releases an electron and antineutrino.

### β⁺ Decay at Quark Level

**Proton becomes neutron**

Before: p = uud
After: n = udd

**One up quark changes to down:**
u → d

This releases a positron and neutrino.

### Charge Conservation Check

**d → u transformation:**
Before: −⅓ e
After: +⅔ e + (−1 e) = −⅓ e ✓

The electron carries away the charge difference.

### The Weak Force

Beta decay is mediated by the **weak nuclear force**.

This is the only force that can change quark flavour.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "9. PET Scanning Application",
                content: `## Medical Use of Antimatter

### Positron Emission Tomography (PET)

A medical imaging technique using positron annihilation.

### How It Works

**Step 1: Tracer injection**
- Radioactive β⁺ emitter attached to glucose
- Injected into patient
- Accumulates in metabolically active areas (tumours)

**Step 2: Positron emission**
- Tracer decays, emitting positron

**Step 3: Annihilation**
- Positron meets electron in tissue
- e⁺ + e⁻ → 2γ

**Step 4: Detection**
- Two gamma photons travel in opposite directions
- Ring of detectors records simultaneous arrivals

**Step 5: Image reconstruction**
- Computer calculates line of annihilation
- Millions of events create 3D image

### Why Two Photons in Opposite Directions?

Conservation of momentum when initial momentum ≈ 0`,
                diagrams: [],
                subsections: []
            },
            {
                title: "10. Key Formulae and Exam Practice",
                content: `## Essential Information

### Key Formulae

| Formula | Meaning |
|---------|---------|
| E = mc² | Mass-energy equivalence |
| E = hf | Photon energy |

### Particle Summary

| Particle | Composition | Charge |
|----------|-------------|--------|
| Proton | uud | +e |
| Neutron | udd | 0 |
| π⁺ meson | ud̅ | +e |

### Quark Charges

u quark: +⅔ e
d quark: −⅓ e

---

## Worked Example

**Show π⁺ meson (ud̅) has charge +e**

Charge = (+⅔ e) + (+⅓ e) = **+1e** ✓

(d̅ has opposite charge to d, so +⅓ e)

---

## Common Exam Errors

❌ Forgetting antiquarks have opposite charge
❌ Wrong quark composition for proton/neutron
❌ Not checking conservation laws in decay equations
❌ Confusing β⁻ (electron) with β⁺ (positron)`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Hadrons (strong force) vs Leptons (no strong force)",
            "Baryons = 3 quarks; Mesons = quark + antiquark",
            "Proton = uud (+e); Neutron = udd (0)",
            "Up quark: +⅔ e; Down quark: −⅓ e",
            "Antiquarks have opposite charge to quarks",
            "Annihilation: e⁻ + e⁺ → 2γ (opposite directions)",
            "β⁻ decay: n → p + e⁻ + ν̅ (d → u at quark level)",
            "β⁺ decay: p → n + e⁺ + ν (u → d at quark level)",
            "Conservation: charge and nucleon number must balance",
            "PET scanning uses positron-electron annihilation"
        ],
        exam_tips: [
            "Check both charge AND nucleon number are conserved in decays",
            "Remember: antiquark charge = opposite of quark charge",
            "Beta particles have continuous energy spectrum (shared with neutrino)",
            "Alpha particles have discrete energy spectrum (2-body decay)",
            "For quark compositions, always verify total charge matches particle",
            "In annihilation, two photons go in opposite directions (momentum conservation)"
        ]
    },
    "Motion in a Circle": {
        topic: "Motion in a Circle",
        subject: "A Level Physics",
        summary: "Motion in a circle involves objects following curved paths, requiring continuous acceleration even at constant speed. This topic covers angular quantities (θ, ω), the relationship v = rω, centripetal acceleration (a = v²/r = rω²), centripetal force (F = mv²/r = mrω²), vertical circular motion, and practical applications like satellites and theme park rides. Understanding that centripetal force is provided by real forces (gravity, tension, friction) is crucial.",
        sections: [
            {
                title: "1. Introduction to Circular Motion",
                content: `## Motion Along a Curved Path

### Types of Circular Motion

**Uniform circular motion:**
- Constant speed
- Changing velocity (direction changes)
- Centripetal acceleration

**Non-uniform circular motion:**
- Speed varies
- Both tangential and centripetal acceleration

### Key Insight

Even at **constant speed**, an object in circular motion is **accelerating** because velocity direction continuously changes.

### Real-World Examples

| Example | Object in Motion |
|---------|------------------|
| Planet orbiting Sun | Planet |
| Satellite orbiting Earth | Satellite |
| Car cornering | Car/passengers |
| Theme park ride | Passengers |
| Electron in magnetic field | Electron |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Angular Quantities",
                content: `## Describing Rotation

### The Radian

**Definition:** The angle subtended at the centre by an arc equal in length to the radius.

**Full circle:** 2π radians = 360°

**Conversion:** 1 rad = 180°/π ≈ 57.3°

### Angular Displacement (θ)

Angle swept out, measured in radians.

**θ = s/r**

Where s = arc length, r = radius

### Angular Speed (ω)

Rate of change of angular displacement.

**ω = Δθ/Δt**

**SI Unit:** rad s⁻¹

### Period and Frequency

**Period (T):** Time for one complete revolution

**Frequency (f):** Revolutions per second

**ω = 2π/T = 2πf**

### Relationship: Linear and Angular

**v = rω**

Linear speed = radius × angular speed`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Centripetal Acceleration",
                content: `## Acceleration Towards the Centre

### Why Acceleration Exists

- Velocity is a **vector** (magnitude + direction)
- Direction continuously changes in circular motion
- Change in velocity = acceleration
- Direction of acceleration: towards centre

### Centripetal Acceleration Formulae

**a = v²/r**

**a = rω²**

**a = vω** (combining the above)

Where:
- a = centripetal acceleration (m s⁻²)
- v = linear speed (m s⁻¹)
- r = radius (m)
- ω = angular speed (rad s⁻¹)

### Key Point

The acceleration is always **perpendicular** to velocity and **towards the centre**.

### Worked Example

Rocket: v = 240 m s⁻¹, r = 150 m

ω = v/r = 240/150 = **1.6 rad s⁻¹**

a = v²/r = 240²/150 = **384 m s⁻²**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Centripetal Force",
                content: `## Force Towards the Centre

### Newton's Second Law Applied

F = ma, and a = v²/r, therefore:

**F = mv²/r**

**F = mrω²**

Where:
- F = centripetal force (N)
- m = mass (kg)
- v = linear speed (m s⁻¹)
- r = radius (m)

### Critical Understanding

**Centripetal force is NOT a new type of force!**

It is the **resultant** of real forces acting towards centre:

| Scenario | Force Providing Centripetal |
|----------|----------------------------|
| Planet orbiting Sun | Gravitational force |
| Satellite in orbit | Gravitational force |
| Car on curved road | Friction |
| Ball on string | Tension |
| Theme park ride | Normal force + weight |

### Free-Body Diagrams

Never label "centripetal force" — label the actual forces (tension, weight, friction, normal).

The resultant towards centre IS the centripetal force.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Vertical Circular Motion",
                content: `## Weight Varies Its Contribution

### The Challenge

Weight (mg) always acts **downwards**.

At different points, it either helps or opposes centripetal force.

### At the TOP of the Circle

Both weight and normal force act DOWN (towards centre)

**mv²/r = N_top + mg**

Normal force is **minimum** here.

### At the BOTTOM of the Circle

Normal force UP, weight DOWN

**mv²/r = N_bottom − mg**

Normal force is **maximum** here.
Passenger feels **heaviest**.

### Minimum Speed at Top

For object to maintain contact: N_top ≥ 0

Minimum when N_top = 0:

**mv²/r = mg**

**v_min = √(gr)**

### Common Error

Don't forget direction! Draw free-body diagram for each position.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Energy in Circular Motion",
                content: `## Conservation Principles

### Uniform Horizontal Circle

- Centripetal force ⊥ velocity
- No work done by centripetal force
- KE remains constant

### Vertical Circle (No friction)

Total mechanical energy conserved:

**KE + PE = constant**

**½mv² + mgh = constant**

### At Bottom vs Top

**At bottom:** Maximum KE, minimum PE
**At top:** Minimum KE, maximum PE

Taking bottom as h = 0:

½mv²_bottom = ½mv²_top + mg(2r)

### Solving Problems

Use energy conservation to relate speeds at different points without analysing forces at intermediate positions.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Satellites and Orbits",
                content: `## Gravitational Centripetal Force

### Orbital Motion

For a satellite, gravity provides centripetal force:

**GMm/r² = mv²/r**

This gives:

**v = √(GM/r)**

### Key Relationships

**Orbital speed decreases with radius**

Higher orbit = slower speed

### Orbital Period

From v = 2πr/T and v = √(GM/r):

**T² ∝ r³** (Kepler's Third Law)

### Common Mistake

**Orbital radius = R_planet + altitude**

Not just the altitude!

### Example

Earth radius = 6400 km, altitude = 200 km
Orbital radius = 6400 + 200 = **6600 km**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Practical Applications",
                content: `## Real-World Circular Motion

### Banked Tracks

On a banked curve, horizontal component of normal force provides centripetal force.

For ideal banking angle θ:
**tan θ = v²/(rg)**

No friction needed at this speed.

### Theme Park Rides

At the loop top: passengers feel lighter
At the loop bottom: passengers feel heavier

Design must ensure v > v_min at top.

### Centrifuges

Use high ω to create large centripetal acceleration.

Applications:
- Separating blood components
- Training astronauts (20g centrifuge)
- Industrial separation

### Experimental Verification

Measure T for multiple rotations → calculate ω
Verify F = mrω² by varying m, r, ω`,
                diagrams: [],
                subsections: []
            },
            {
                title: "9. Key Formulae and Exam Practice",
                content: `## Essential Equations

| Formula | Meaning |
|---------|---------|
| ω = 2π/T = 2πf | Angular speed |
| v = rω | Linear-angular relation |
| a = v²/r = rω² | Centripetal acceleration |
| F = mv²/r = mrω² | Centripetal force |
| v_min = √(gr) | Minimum speed at top |

---

## Worked Example 1: Centrifuge

20g centrifuge, arm length r = 17.8 m

**Angular speed:**
a = rω² → ω = √(a/r)
a = 20 × 9.81 = 196.2 m s⁻²
ω = √(196.2/17.8) = **3.3 rad s⁻¹**

**Frequency:**
f = ω/2π = 3.3/2π = **0.53 Hz**

---

## Worked Example 2: Satellite

Altitude 200 km, a = 9.2 m s⁻²

Radius = 6400 + 200 = 6600 km = 6.6 × 10⁶ m

**Speed:** v = √(ar) = √(9.2 × 6.6 × 10⁶) = **7800 m s⁻¹**

**Period:** T = 2πr/v = 2π × 6.6 × 10⁶/7800 = **5300 s**

---

## Common Errors

❌ Using altitude instead of orbital radius
❌ Forgetting v²/r gives acceleration, not force
❌ Wrong direction for forces in vertical circle`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Constant speed ≠ constant velocity (direction changes)",
            "Angular speed: ω = 2π/T = 2πf",
            "Linear-angular relation: v = rω",
            "Centripetal acceleration: a = v²/r = rω² (towards centre)",
            "Centripetal force: F = mv²/r = mrω² (towards centre)",
            "Centripetal force is provided by real forces (gravity, tension, friction)",
            "Vertical circle: at top, mg helps; at bottom, mg opposes",
            "Minimum speed at top of vertical circle: v = √(gr)",
            "Orbital radius = planet radius + altitude",
            "No work done by centripetal force (perpendicular to motion)"
        ],
        exam_tips: [
            "Always use orbital radius = R + altitude for satellites",
            "Draw free-body diagrams at specific positions in vertical circles",
            "Never label 'centripetal force' — label actual forces",
            "Check units: convert km to m, rpm to rad s⁻¹",
            "At top of loop: resultant = tension + weight (both towards centre)",
            "Time many oscillations and divide for accurate period"
        ]
    },
    "Gravitational Fields": {
        topic: "Gravitational Fields",
        subject: "A Level Physics",
        summary: "Gravitational fields describe the region around a mass where other masses experience a force. This topic covers Newton's Law of Gravitation (F = GMm/r²), gravitational field strength (g = GM/r²), gravitational potential (Φ = -GM/r), potential energy (Ep = -GMm/r), orbital motion, Kepler's Third Law (T² ∝ r³), and geostationary satellites. The negative sign in potential indicates that work must be done against gravity to escape the field.",
        sections: [
            {
                title: "1. Introduction to Gravitational Fields",
                content: `## Fields of Force

### Definition

A **gravitational field** is a region around a mass where another mass experiences a force.

### Field Lines

**Radial field (point mass):**
- Lines point directly towards centre
- Field strength decreases with distance
- Lines get further apart

**Uniform field (near Earth's surface):**
- Parallel, equally-spaced lines
- Point vertically downwards
- Field strength approximately constant

### Key Principle

For a **uniform sphere**, gravitational effects can be calculated as if all mass were concentrated at its centre.

### Direction

Field lines show direction of force on a **test mass**.

Field lines point **towards** the mass (attractive force).`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Newton's Law of Gravitation",
                content: `## The Universal Law

### Statement

Any two point masses attract each other with a force:
- Proportional to the product of their masses
- Inversely proportional to the square of their separation

### Formula

**F = GMm/r²**

Where:
- F = gravitational force (N)
- G = gravitational constant = 6.67 × 10⁻¹¹ N m² kg⁻²
- M, m = masses (kg)
- r = distance between centres (m)

### Key Features

- Universal — applies to all masses
- Attractive only (unlike electric force)
- Inverse square law: F ∝ 1/r²

### Newton's Third Law

Force on m due to M = Force on M due to m

(Equal and opposite)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Gravitational Field Strength (g)",
                content: `## Force Per Unit Mass

### Definition

**Gravitational field strength** at a point is the force per unit mass on a small test mass placed there.

### Formula (from definition)

**g = F/m**

### For a Point Mass M

Combining with Newton's Law:

**g = GM/r²**

### Units

N kg⁻¹ = m s⁻² (equivalent units)

### Important Connection

g at a point = acceleration due to gravity at that point

### At Earth's Surface

g ≈ 9.81 N kg⁻¹ (or m s⁻²)

### Variation with Distance

| Location | g value |
|----------|---------|
| Earth's surface | 9.81 m s⁻² |
| At altitude h | GM/(R+h)² |
| At 2R from centre | g/4 |
| At infinity | 0 |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Gravitational Potential (Φ)",
                content: `## Energy Per Unit Mass

### Definition

**Gravitational potential** at a point is the work done per unit mass in bringing a test mass from infinity to that point.

### Formula

**Φ = −GM/r**

### Units

J kg⁻¹

### Why Negative?

- Potential at infinity = 0 (reference)
- Gravity does positive work as mass falls
- System loses potential energy
- So potential is negative everywhere

### Key Points

- Φ is a **scalar** (no direction)
- Always **negative** (attractive field)
- Increases (becomes less negative) with distance
- Maximum value = 0 at infinity

### Worked Example

At Earth's surface:
Φ = −GM/R = −(6.67 × 10⁻¹¹ × 5.98 × 10²⁴)/(6.38 × 10⁶)
Φ = **−6.25 × 10⁷ J kg⁻¹**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Gravitational Potential Energy (Ep)",
                content: `## Total Energy Stored

### Relationship to Potential

**Ep = mΦ**

### Formula

**Ep = −GMm/r**

### For Two Masses

Mutual gravitational PE:

**Ep = −Gm₁m₂/r**

### Comparison with mgh

| Formula | Use |
|---------|-----|
| Ep = mgh | Near surface (uniform g) |
| Ep = −GMm/r | General (non-uniform g) |

### Key Points

- Ep is **negative** (bound system)
- Ep = 0 at infinite separation
- Energy needed to separate to infinity = |Ep|

### Escape Energy

To escape from surface: need energy = GMm/R

This leads to escape velocity derivation.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Orbital Motion",
                content: `## Gravity as Centripetal Force

### Circular Orbits

Gravitational force provides centripetal force:

**GMm/r² = mv²/r**

This gives:

**v = √(GM/r)**

### Key Result

Orbital speed **decreases** with increasing radius.

### Kepler's Third Law

From v = 2πr/T and GM/r = v²:

**T² = (4π²/GM) × r³**

Or: **T² ∝ r³**

For same central body, all orbits satisfy same relationship.

### Orbital Energy

**Total energy = KE + PE**

E_total = ½mv² + (−GMm/r)

E_total = GMm/2r − GMm/r = **−GMm/2r**

Total orbital energy is **negative** (bound orbit).`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Geostationary Satellites",
                content: `## Stationary Relative to Earth

### Definition

A **geostationary satellite** remains above the same point on Earth's surface.

### Requirements

1. **Period = 24 hours** (matches Earth's rotation)
2. **Equatorial orbit** (above equator)
3. **Circular orbit**
4. **Same direction** as Earth's rotation

### Calculating Orbital Radius

Using T² = 4π²r³/GM with T = 86400 s:

r ≈ 4.22 × 10⁷ m (from Earth's centre)

### Height Above Surface

h = r − R_E = 4.22 × 10⁷ − 6.38 × 10⁶
h ≈ **35,800 km**

### Orbital Speed

v = 2πr/T = 2π × 4.22 × 10⁷/86400
v ≈ **3.1 km s⁻¹**

### Applications

- Communications satellites
- Weather monitoring
- TV broadcasting`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Key Formulae and Exam Practice",
                content: `## Essential Equations

| Formula | Meaning |
|---------|---------|
| F = GMm/r² | Newton's Law of Gravitation |
| g = GM/r² | Field strength (point mass) |
| Φ = −GM/r | Gravitational potential |
| Ep = −GMm/r | Gravitational PE |
| v = √(GM/r) | Orbital speed |
| T² = 4π²r³/GM | Kepler's Third Law |

**G = 6.67 × 10⁻¹¹ N m² kg⁻²**

---

## Worked Example: Mass of Mars

g_surface = 3.7 m s⁻², r = 3.4 × 10⁶ m

**Find mass:**
g = GM/r² → M = gr²/G
M = (3.7 × (3.4 × 10⁶)²)/(6.67 × 10⁻¹¹)
M = **6.4 × 10²³ kg**

**Find density:**
V = (4/3)πr³ = 1.65 × 10²⁰ m³
ρ = M/V = **3900 kg m⁻³**

---

## Common Errors

❌ Forgetting negative sign in Φ and Ep
❌ Using altitude instead of orbital radius
❌ Confusing g (field strength) with G (constant)
❌ Using r instead of r² in Newton's Law`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Gravitational field: region where mass experiences force",
            "Newton's Law: F = GMm/r² (inverse square law)",
            "Field strength: g = GM/r² (force per unit mass)",
            "g at surface = acceleration due to gravity",
            "Potential: Φ = −GM/r (work done per unit mass from infinity)",
            "Potential energy: Ep = −GMm/r (always negative)",
            "Orbital speed: v = √(GM/r) decreases with radius",
            "Kepler's Third Law: T² ∝ r³",
            "Geostationary: T = 24h, equatorial, h ≈ 36,000 km",
            "Total orbital energy = −GMm/2r (negative = bound)"
        ],
        exam_tips: [
            "Don't forget negative signs in Φ and Ep",
            "Orbital radius = planet radius + altitude",
            "G is constant (6.67 × 10⁻¹¹); g varies with position",
            "For uniform sphere, treat mass as if at centre",
            "From graph of T² vs r³, gradient = 4π²/GM",
            "Check units: g has units N kg⁻¹ = m s⁻²"
        ]
    },
    "Temperature and Thermal Physics": {
        topic: "Temperature and Thermal Physics",
        subject: "A Level Physics",
        summary: "Temperature is a measure of average random kinetic energy of molecules. This topic covers the Kelvin and Celsius scales, internal energy (kinetic + potential), specific heat capacity (ΔQ = mcΔθ), latent heat (Q = mL), kinetic theory of gases (⟨Ek⟩ = 3/2 kT), thermal equilibrium, and the first law of thermodynamics. Understanding the difference between heat (energy transfer) and temperature (system property) is fundamental.",
        sections: [
            {
                title: "1. Introduction to Temperature",
                content: `## What is Temperature?

### Definition

**Temperature** is a measure of the average random kinetic energy of the particles in a substance.

### Temperature vs Thermal Energy

| Quantity | Definition |
|----------|------------|
| Temperature | Property of system — average KE |
| Thermal energy (heat) | Energy transferred due to temperature difference |

### Key Insight

Heat flows from hot to cold until thermal equilibrium is reached.

### Temperature Scales

| Scale | Unit | Zero Point |
|-------|------|------------|
| Kelvin | K | Absolute zero |
| Celsius | °C | Freezing point of water |

### Conversion

**T (K) = θ (°C) + 273.15**

For temperature **changes**: ΔT (K) = Δθ (°C)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Internal Energy",
                content: `## Total Microscopic Energy

### Definition

**Internal energy (U)** is the sum of the random kinetic and potential energies of all molecules in a system.

### Components

**Kinetic Energy:**
- Translational, rotational, vibrational motion
- Depends on temperature

**Potential Energy:**
- Due to intermolecular forces
- Depends on molecular separation

### For an Ideal Gas

No intermolecular forces → no potential energy

**U = total kinetic energy only**

### Factors Affecting Internal Energy

1. **Temperature** — affects KE component
2. **State of matter** — affects PE component
3. **Mass** — more molecules = more energy

### Phase Changes

During melting/boiling:
- Energy increases PE (breaking bonds)
- KE stays constant
- Temperature stays constant`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. The Kelvin Scale",
                content: `## Absolute Temperature

### Absolute Zero

**0 K = −273.15°C**

The lowest possible temperature where particles have minimum internal energy.

### Properties of Kelvin Scale

- SI base unit for temperature
- Absolute scale (no negative values)
- Average KE ∝ T (in kelvin)

### Conversion Formulae

**Absolute temperature:**
T (K) = θ (°C) + 273.15

**Temperature change:**
ΔT (K) = Δθ (°C)

### Common Error!

For a temperature **change** of 20°C:
This equals a change of 20 K

For a temperature **of** 20°C:
This equals 293 K

Don't confuse these!`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Specific Heat Capacity",
                content: `## Thermal Inertia

### Definition

**Specific heat capacity (c)** is the thermal energy per unit mass required to raise the temperature by 1 K (or 1°C).

### Formula

**ΔQ = mcΔθ**

Where:
- ΔQ = thermal energy (J)
- m = mass (kg)
- c = specific heat capacity (J kg⁻¹ K⁻¹)
- Δθ = temperature change (K or °C)

### Units

J kg⁻¹ K⁻¹ or J kg⁻¹ °C⁻¹

### Physical Meaning

High c → large energy needed for small ΔT
Low c → small energy causes large ΔT

### Typical Values

| Substance | c (J kg⁻¹ K⁻¹) |
|-----------|----------------|
| Water | 4200 |
| Aluminium | 900 |
| Copper | 390 |
| Iron | 450 |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Latent Heat",
                content: `## Energy Without Temperature Change

### Definition

**Specific latent heat (L)** is the thermal energy per unit mass required to change state without temperature change.

### Two Types

**Latent heat of fusion (Lf):**
Energy to change solid → liquid

**Latent heat of vaporisation (Lv):**
Energy to change liquid → gas

### Formula

**Q = mL**

Where:
- Q = thermal energy (J)
- m = mass (kg)
- L = specific latent heat (J kg⁻¹)

### Why No Temperature Change?

Energy goes into:
- Breaking intermolecular bonds
- Increasing potential energy
- NOT increasing kinetic energy

### Typical Values for Water

| Process | L (J kg⁻¹) |
|---------|------------|
| Fusion (melting) | 3.34 × 10⁵ |
| Vaporisation (boiling) | 2.26 × 10⁶ |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Kinetic Theory of Gases",
                content: `## Microscopic Model

### Assumptions of Ideal Gas

1. Molecules are identical, hard, elastic spheres
2. Molecular volume negligible vs container
3. No intermolecular forces
4. Many molecules moving randomly

### Key Equation

**⟨Ek⟩ = ½m⟨c²⟩ = (3/2)kT**

Where:
- ⟨Ek⟩ = average kinetic energy (J)
- m = mass of one molecule (kg)
- ⟨c²⟩ = mean square speed (m² s⁻²)
- k = Boltzmann constant (1.38 × 10⁻²³ J K⁻¹)
- T = temperature (K)

### Physical Meaning

**Temperature ∝ average kinetic energy**

This is the microscopic definition of temperature!

### Root Mean Square Speed

c_rms = √⟨c²⟩ = √(3kT/m)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Thermal Equilibrium",
                content: `## No Net Energy Flow

### Definition

**Thermal equilibrium** exists when two objects in thermal contact are at the same temperature.

At equilibrium:
- No net heat flow
- Temperatures are equal
- Energy still exchanged microscopically

### Principle of Thermometry

A thermometer works by reaching thermal equilibrium with the object being measured.

### Thermometric Properties

Properties that vary with temperature:

| Property | Device |
|----------|--------|
| Volume of liquid | Mercury thermometer |
| Electrical resistance | Resistance thermometer |
| EMF | Thermocouple |
| Gas pressure | Constant volume gas thermometer |

### Zeroth Law of Thermodynamics

If A is in equilibrium with B, and B with C, then A is in equilibrium with C.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. First Law of Thermodynamics",
                content: `## Conservation of Energy

### Statement

**ΔU = q + w**

Where:
- ΔU = change in internal energy
- q = thermal energy supplied TO system
- w = work done ON system

### Sign Convention

| Process | Sign |
|---------|------|
| Heat INTO system | q positive |
| Heat OUT OF system | q negative |
| Work done ON gas | w positive |
| Work done BY gas | w negative |

### Work Done by Gas

**w = pΔV** (at constant pressure)

For expansion: ΔV > 0, work BY gas
For compression: ΔV < 0, work ON gas

### Applications

Isothermal: ΔT = 0, so ΔU = 0
Adiabatic: q = 0
Isochoric: ΔV = 0, so w = 0`,
                diagrams: [],
                subsections: []
            },
            {
                title: "9. Experimental Methods",
                content: `## Measuring Thermal Properties

### Determining Specific Heat Capacity

**Equipment:**
- Electrical heater (known power P)
- Thermometer
- Insulated container
- Balance

**Method:**
1. Measure mass m
2. Supply energy ΔQ = PΔt
3. Measure temperature change Δθ
4. Calculate c = ΔQ/(mΔθ)

### Sources of Error

**Systematic errors:**
- Heat loss to surroundings
- Zero error on thermometer

**Random errors:**
- Reading thermometer
- Timing measurements

### Reducing Errors

- Use insulation (lagging)
- Repeat measurements
- Plot cooling curve to extrapolate
- Use large temperature change`,
                diagrams: [],
                subsections: []
            },
            {
                title: "10. Key Formulae and Exam Practice",
                content: `## Essential Equations

| Formula | Meaning |
|---------|---------|
| ΔQ = mcΔθ | Specific heat capacity |
| Q = mL | Latent heat |
| ⟨Ek⟩ = 3/2 kT | Kinetic energy of gas molecule |
| ΔU = q + w | First law of thermodynamics |
| T(K) = θ(°C) + 273 | Temperature conversion |

**k = 1.38 × 10⁻²³ J K⁻¹**

---

## Worked Example

Steam condensing: m = 1.0 g, Lv = 2.3 × 10⁶ J kg⁻¹
Volume change: ΔV = 1600 cm³, p = 1.0 × 10⁵ Pa

**Thermal energy released:**
q = −mLv = −1.0 × 10⁻³ × 2.3 × 10⁶ = **−2300 J**

**Work done ON system:**
w = pΔV = 1.0 × 10⁵ × 1.6 × 10⁻³ = **+160 J**

**Change in internal energy:**
ΔU = q + w = −2300 + 160 = **−2140 J**

---

## Common Errors

❌ Using °C instead of K in kinetic theory
❌ Confusing ΔT with T in conversions
❌ Wrong sign in first law calculations`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Temperature = measure of average random kinetic energy",
            "Internal energy = sum of kinetic + potential energies",
            "Specific heat capacity: ΔQ = mcΔθ",
            "Latent heat: Q = mL (no temperature change)",
            "During phase change: PE increases, KE constant, T constant",
            "Ideal gas: internal energy = kinetic energy only",
            "Average KE of gas molecule: ⟨Ek⟩ = 3/2 kT",
            "First law: ΔU = q + w (energy conservation)",
            "Thermal equilibrium: no net heat flow, equal temperatures",
            "Kelvin: T(K) = θ(°C) + 273.15"
        ],
        exam_tips: [
            "Use Kelvin for kinetic theory equations (⟨Ek⟩ = 3/2 kT)",
            "For temperature CHANGES: ΔT(K) = Δθ(°C)",
            "Phase changes: use Q = mL, NOT ΔQ = mcΔθ",
            "Watch sign convention in first law problems",
            "Heat loss is main systematic error in calorimetry",
            "Lv > Lf because more bonds broken in vaporisation"
        ]
    },
    "Nuclear Physics": {
        topic: "Nuclear Physics",
        subject: "A Level Physics",
        summary: "Nuclear physics studies the structure of the nucleus and radioactive decay. This topic covers atomic structure (protons, neutrons, electrons), nuclide notation, isotopes, radioactive decay (α, β⁻, β⁺, γ), nuclear equations, decay constant (λ), activity (A = λN), half-life (t½ = 0.693/λ), exponential decay (N = N₀e⁻λt), mass defect, binding energy, and nuclear reactions (fission and fusion).",
        sections: [
            {
                title: "1. Atomic and Nuclear Structure",
                content: `## Composition of the Atom

### The Atom

- **Nucleus:** Small, dense, positive (protons + neutrons)
- **Electrons:** Orbit nucleus, negative charge

### Particles

| Particle | Charge | Location |
|----------|--------|----------|
| Proton | +e | Nucleus |
| Neutron | 0 | Nucleus |
| Electron | −e | Orbits |

### Key Terminology

| Term | Definition |
|------|------------|
| Proton number (Z) | Number of protons |
| Nucleon number (A) | Total protons + neutrons |
| Isotopes | Same Z, different A |
| Nuclide | Specific nucleus (Z and A) |

### Nuclide Notation

**ᴬzX**

Example: ²¹⁴₈₂Pb (Lead-214)
- A = 214 nucleons
- Z = 82 protons`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Radioactive Decay",
                content: `## Spontaneous Nuclear Change

### Nature of Radioactive Decay

**Spontaneous:** Cannot be triggered
**Random:** Cannot predict when specific nucleus decays
**Not affected** by external conditions (temperature, pressure)

### Types of Radiation

| Type | Nature | Mass | Charge |
|------|--------|------|--------|
| Alpha (α) | Helium nucleus | 4u | +2e |
| Beta⁻ (β⁻) | Electron | ~u/2000 | −e |
| Beta⁺ (β⁺) | Positron | ~u/2000 | +e |
| Gamma (γ) | EM radiation | 0 | 0 |

### Antiparticles

**Positron (e⁺):** Antiparticle of electron
- Same mass, opposite charge
- Particle + antiparticle → annihilation → γ rays

### Energy Spectra

**α-particles:** Discrete (single) energy
**β-particles:** Continuous spectrum (energy shared with neutrino)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Nuclear Equations",
                content: `## Balanced Nuclear Reactions

### Conservation Laws

1. **Nucleon number (A):** Same before and after
2. **Charge (Z):** Same before and after

### Alpha (α) Decay

Parent loses 4 nucleons and 2 protons:

**²³⁸₉₂U → ²³⁴₉₀Th + ⁴₂He**

### Beta-minus (β⁻) Decay

Neutron → proton + electron + antineutrino:

**²¹⁴₈₂Pb → ²¹⁴₈₃Bi + ⁰₋₁e + ν̄**

A stays same, Z increases by 1

### Beta-plus (β⁺) Decay

Proton → neutron + positron + neutrino:

**³⁰₁₅P → ³⁰₁₄Si + ⁰₊₁e + ν**

A stays same, Z decreases by 1

### Gamma (γ) Emission

Excited nucleus → ground state + photon:

**²³⁴₉₀Th* → ²³⁴₉₀Th + γ**

A and Z unchanged`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Activity and Decay Constant",
                content: `## Measuring Decay Rate

### Activity (A)

**Definition:** Number of decays per unit time

**Unit:** Becquerel (Bq) = 1 decay per second

### Decay Constant (λ)

**Definition:** Probability of decay per unit time for a single nucleus

**Unit:** s⁻¹ (or hr⁻¹, year⁻¹)

### The Activity Equation

**A = λN**

Where:
- A = activity (Bq)
- λ = decay constant (s⁻¹)
- N = number of undecayed nuclei

### Key Relationship

Activity is proportional to number of remaining nuclei.

As N decreases, A decreases.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Half-Life",
                content: `## The Decay Timescale

### Definition

**Half-life (t½)** is the time for the number of undecayed nuclei to halve.

### Exponential Decay Equation

**N = N₀e⁻λt**

Or equivalently:
**A = A₀e⁻λt**

Where:
- N₀, A₀ = initial values
- N, A = values at time t
- λ = decay constant
- t = time elapsed

### Half-Life and Decay Constant

**λ = 0.693/t½**

Or: **t½ = 0.693/λ**

### From Decay Curve

1. Find initial value N₀
2. Find time when N = N₀/2
3. This time = one half-life

### After n Half-Lives

N = N₀ × (½)ⁿ`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Mass-Energy Equivalence",
                content: `## Einstein's Famous Equation

### The Principle

Mass and energy are equivalent and interconvertible.

**E = mc²**

Where:
- E = energy (J)
- m = mass (kg)
- c = speed of light (3 × 10⁸ m s⁻¹)

### Atomic Mass Unit

1 u = 1.661 × 10⁻²⁷ kg

Energy equivalent: 1 u = 931.5 MeV

### Mass Defect

**Definition:** Difference between total mass of separate nucleons and actual nuclear mass.

Mass defect = Σ(mass of nucleons) − mass of nucleus

### Why Mass is "Lost"

When nucleons bind, energy is released.

This energy comes from mass (E = mc²).

The nucleus has less mass than its parts.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Binding Energy",
                content: `## Nuclear Stability

### Definition

**Binding energy** is the energy required to completely separate all nucleons in a nucleus.

Binding Energy = Mass Defect × c²

### Binding Energy per Nucleon

**BE per nucleon = Total BE / A**

This measures nuclear **stability**.

Higher BE per nucleon = more stable

### The Stability Curve

| Region | BE per nucleon | Stability |
|--------|----------------|-----------|
| Light nuclei (H, He) | Low | Less stable |
| Medium nuclei (~Fe-56) | Maximum | Most stable |
| Heavy nuclei (U, Pu) | Lower | Less stable |

### Key Insight

- Iron-56 has maximum BE per nucleon (~8.8 MeV)
- Nuclei tend to move towards this maximum
- This drives fusion (light → heavier) and fission (heavy → lighter)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Fission and Fusion",
                content: `## Energy-Releasing Reactions

### Nuclear Fission

Heavy nucleus **splits** into lighter nuclei.

**Example:**
²³⁵₉₂U + ¹₀n → ¹⁴¹₅₆Ba + ⁹²₃₆Kr + 3¹₀n + energy

**Why energy released?**
Products have higher BE per nucleon than uranium.

### Nuclear Fusion

Light nuclei **combine** into heavier nucleus.

**Example:**
²₁H + ³₁H → ⁴₂He + ¹₀n + energy

**Why energy released?**
Product (He-4) has higher BE per nucleon than reactants.

### Energy Comparison

| Process | Energy per nucleon |
|---------|-------------------|
| Fission | ~0.9 MeV |
| Fusion | ~3.5 MeV |

Fusion releases more energy per nucleon!

### Challenges

**Fusion:** Requires extreme temperature (millions of K) to overcome electrostatic repulsion`,
                diagrams: [],
                subsections: []
            },
            {
                title: "9. Decay Curves and Graphs",
                content: `## Visualizing Exponential Decay

### Activity vs Time Graph

- Starts at A₀
- Exponential decrease
- Never reaches zero
- Characteristic curve shape

### Reading Half-Life from Graph

1. Find A₀ on y-axis
2. Find A₀/2 on y-axis
3. Read corresponding time on x-axis
4. This is t½

### Verification

Check: time from A₀/2 to A₀/4 should also equal t½

### Linearizing the Graph

Taking natural log: ln(N) = ln(N₀) − λt

Plot ln(N) vs t:
- Straight line
- Gradient = −λ
- Intercept = ln(N₀)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "10. Key Formulae and Exam Practice",
                content: `## Essential Equations

| Formula | Meaning |
|---------|---------|
| A = λN | Activity equation |
| N = N₀e⁻λt | Exponential decay |
| λ = 0.693/t½ | Decay constant |
| E = mc² | Mass-energy equivalence |

---

## Worked Example 1

Activity falls from 4.5 × 10¹⁰ Bq to 1.2 × 10¹⁰ Bq in 5.0 hours.

**Find half-life:**

A = A₀e⁻λt
1.2 × 10¹⁰ = 4.5 × 10¹⁰ × e⁻⁵λ
0.267 = e⁻⁵λ
ln(0.267) = −5λ
λ = 0.264 hr⁻¹

t½ = 0.693/0.264 = **2.6 hours**

---

## Worked Example 2

N₀ = 8.0 × 10²², t½ = 14 minutes

**Find initial activity:**

λ = 0.693/(14 × 60) = 8.25 × 10⁻⁴ s⁻¹

A₀ = λN₀ = 8.25 × 10⁻⁴ × 8.0 × 10²²
A₀ = **6.6 × 10¹⁹ Bq**

---

## Common Errors

❌ Forgetting to convert time units for λ
❌ Using A instead of N in calculations
❌ Not checking conservation in nuclear equations`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Nuclide notation: ᴬzX (A = nucleons, Z = protons)",
            "Isotopes: same Z, different A",
            "α decay: loses ⁴₂He; β⁻: n→p; β⁺: p→n",
            "Radioactive decay is random and spontaneous",
            "Activity: A = λN (decays per second)",
            "Exponential decay: N = N₀e⁻λt",
            "Half-life: t½ = 0.693/λ",
            "Mass defect = mass of nucleons − mass of nucleus",
            "Binding energy = mass defect × c²",
            "Fission (heavy→light) and fusion (light→heavy) release energy"
        ],
        exam_tips: [
            "Always check A and Z are conserved in nuclear equations",
            "Convert half-life to seconds before calculating λ",
            "α has discrete energy; β has continuous spectrum",
            "Higher BE per nucleon = more stable nucleus",
            "Use ln form of decay equation for finding λ from data",
            "Remember: 1 u = 931.5 MeV for mass-energy conversions"
        ]
    },
    "Magnetic Fields": {
        topic: "Magnetic Fields",
        subject: "A Level Physics",
        summary: "Magnetic fields describe the region where magnetic poles and moving charges experience forces. This topic covers magnetic flux density (B), force on current-carrying conductors (F = BIL sin θ), force on moving charges (F = BQv sin θ), circular motion of charged particles (r = mv/BQ), Fleming's Left-Hand Rule, magnetic field patterns from currents (wires, coils, solenoids), and forces between parallel conductors.",
        sections: [
            {
                title: "1. Magnetic Fields and Field Lines",
                content: `## The Nature of Magnetic Fields

### Definition

A **magnetic field** is a region where a magnetic pole experiences a force.

### Magnetic Poles

Every magnet has:
- **North-seeking pole (N)**
- **South-seeking pole (S)**

### Pole Interactions

**Like poles repel. Unlike poles attract.**

### Magnetic Field Lines

Properties:
- Direction shows force on a free N pole
- Lines never touch or cross
- Closer lines = stronger field
- Emerge from N, enter S pole

### Field Patterns

**Bar magnet:** Lines curve from N to S pole

**Uniform field:** Parallel, equally-spaced lines`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Magnetic Flux Density (B)",
                content: `## Measuring Field Strength

### Definition

**Magnetic flux density (B)** is the force per unit current per unit length on a wire at right angles to the field.

### The Tesla (T)

**1 tesla:** Force of 1 N on a 1 m wire carrying 1 A perpendicular to field.

Earth's field ≈ 44 µT (very weak!)

### Force on a Current-Carrying Conductor

**F = BIL sin θ**

Where:
- F = force (N)
- B = magnetic flux density (T)
- I = current (A)
- L = length in field (m)
- θ = angle between wire and field

### Key Cases

| θ | sin θ | Force |
|---|-------|-------|
| 90° | 1 | Maximum |
| 0° | 0 | Zero |

### Fleming's Left-Hand Rule

- **Thumb:** Force (thrust)
- **First finger:** Field (N to S)
- **Second finger:** Current (+ve to −ve)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Force on a Moving Charge",
                content: `## Single Particle in a Field

### Formula

**F = BQv sin θ**

Where:
- F = force (N)
- B = magnetic flux density (T)
- Q = charge (C)
- v = velocity (m s⁻¹)
- θ = angle between velocity and field

### Key Characteristics

- Force is always **perpendicular** to velocity
- Force does **no work** (no energy transfer)
- Speed remains **constant**
- Only **direction** changes

### Maximum Force

When v is perpendicular to B (θ = 90°):

**F = BQv**

### Relating to Current Formula

Current = charge flow rate: I = Q/t

For N charges: F = BIL becomes F = BQv`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Circular Motion in Magnetic Fields",
                content: `## Charged Particles in Uniform Fields

### Why Circular?

Magnetic force is perpendicular to velocity.

This provides **centripetal force** → circular path.

### Deriving the Radius

Equate magnetic and centripetal force:

BQv = mv²/r

Solving for r:

**r = mv/BQ**

### Key Relationships

| Factor | Effect on r |
|--------|-------------|
| Increase v (or p = mv) | r increases |
| Increase B | r decreases |
| Increase Q | r decreases |
| Increase m | r increases |

### Applications

**Mass spectrometer:** Separates ions by m/Q ratio
**Cyclotron:** Accelerates particles in spiral path
**Particle detectors:** Curved tracks reveal particle properties`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Velocity Selector",
                content: `## Selecting Particles by Speed

### Principle

Crossed electric and magnetic fields.

Only particles with specific speed pass through undeflected.

### Balancing Forces

**Electric force:** F_E = EQ (vertical)
**Magnetic force:** F_B = BQv (vertical, opposite)

For no deflection: EQ = BQv

### Selected Speed

**v = E/B**

Charge Q cancels out!

### Key Points

- Independent of charge magnitude
- Independent of mass
- Only depends on field strengths
- Used in mass spectrometers

### After the Selector

Particles then enter another magnetic field where r = mv/BQ separates by mass-to-charge ratio.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Magnetic Fields from Currents",
                content: `## Currents as Field Sources

### Long Straight Wire

- **Pattern:** Concentric circles
- **Plane:** Perpendicular to wire
- **Direction:** Right-hand grip rule

Grip wire with thumb in current direction;
fingers curl in field direction.

### Flat Circular Coil

- Field passes through centre
- Strongest at centre
- Right-hand grip applies

### Solenoid (Long Coil)

- **Inside:** Strong, uniform, parallel to axis
- **Outside:** Weak, like bar magnet
- Ends act as N and S poles

### Enhancing Field Strength

Insert **ferrous core** (soft iron) → electromagnet

### Parallel Conductors

| Currents | Force |
|----------|-------|
| Same direction | Attract |
| Opposite direction | Repel |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Worked Examples",
                content: `## Applying the Formulae

### Example 1: Force on Wire

Earth's horizontal B = 1.8 × 10⁻⁵ T
Cable current I = 120 A

**Maximum force per unit length:**
F/L = BI sin 90° = 1.8 × 10⁻⁵ × 120 × 1
F/L = **2.2 × 10⁻³ N m⁻¹**

**Minimum force:**
When θ = 0°, F = 0

---

### Example 2: Circular Path

Proton: m = 1.67 × 10⁻²⁷ kg, Q = 1.6 × 10⁻¹⁹ C
v = 2.0 × 10⁶ m s⁻¹, B = 0.5 T

**Radius:**
r = mv/BQ
r = (1.67 × 10⁻²⁷ × 2.0 × 10⁶)/(0.5 × 1.6 × 10⁻¹⁹)
r = 3.34 × 10⁻²¹/8.0 × 10⁻²⁰
r = **0.042 m = 4.2 cm**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Key Formulae and Exam Tips",
                content: `## Essential Equations

| Formula | Meaning |
|---------|---------|
| F = BIL sin θ | Force on current-carrying wire |
| F = BQv sin θ | Force on moving charge |
| r = mv/BQ | Radius of circular path |
| v = E/B | Selected velocity in crossed fields |

---

## Key Rules

**Fleming's Left-Hand Rule:**
- Thumb = Force
- First finger = Field
- Second finger = Current

**Right-Hand Grip Rule:**
- Thumb = Current
- Fingers = Field direction

---

## Common Exam Errors

❌ Forgetting sin θ (especially when θ = 90°)
❌ Using wrong hand rule (Left for motors, Right for generators)
❌ Confusing B (flux density) with Φ (flux)
❌ Forgetting force is perpendicular to velocity

---

## Unit Check

1 T = 1 N A⁻¹ m⁻¹ = 1 kg A⁻¹ s⁻²`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Magnetic field: region where magnetic pole experiences force",
            "Flux density B: force per unit current per unit length at 90°",
            "Force on wire: F = BIL sin θ (max when perpendicular)",
            "Force on charge: F = BQv sin θ (always perpendicular to v)",
            "Magnetic force does no work (changes direction only)",
            "Circular path radius: r = mv/BQ",
            "Velocity selector: v = E/B (undeflected particles)",
            "Fleming's Left-Hand Rule: Thumb-Force, First-Field, Second-Current",
            "Parallel currents: same direction attract, opposite repel",
            "Solenoid: uniform field inside, bar magnet field outside"
        ],
        exam_tips: [
            "Check angle θ — force is zero when parallel to field",
            "Use Fleming's LEFT hand for motors (force on current)",
            "Magnetic force on moving charge does NO work",
            "For circular motion, equate BQv = mv²/r",
            "Velocity selector: E and B fields are crossed (perpendicular)",
            "Remember: 1 T = 1 N A⁻¹ m⁻¹"
        ]
    },
    "Electromagnetic Induction": {
        topic: "Electromagnetic Induction",
        subject: "A Level Physics",
        summary: "Electromagnetic induction describes how changing magnetic fields generate EMF. This topic covers magnetic flux (Φ = BA), flux linkage (NΦ), Faraday's Law (EMF ∝ rate of change of flux linkage), Lenz's Law (induced EMF opposes change), generators and alternators, eddy currents, and transformers. The key principle is that it's the RATE OF CHANGE of flux that induces EMF, not just flux itself.",
        sections: [
            {
                title: "1. Magnetic Flux (Φ)",
                content: `## The 'Amount' of Field

### Definition

**Magnetic flux (Φ)** is the total magnetic field passing through an area at right angles.

### Formula

**Φ = BA cos θ**

Where:
- Φ = magnetic flux (Wb, weber)
- B = magnetic flux density (T)
- A = area (m²)
- θ = angle between field and normal to surface

### Units

1 weber (Wb) = 1 T m²

### Key Cases

| Angle | cos θ | Flux |
|-------|-------|------|
| 0° (perpendicular) | 1 | Maximum (Φ = BA) |
| 90° (parallel) | 0 | Zero |

### Physical Picture

Think of flux as "number of field lines" passing through the area.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Flux Linkage (NΦ)",
                content: `## Multiple Turns

### Definition

**Flux linkage (NΦ)** is the product of magnetic flux and number of turns in a coil.

### Formula

**Flux linkage = NΦ = NBA cos θ**

Where:
- N = number of turns
- Φ = flux through one turn

### Units

Weber-turns (Wb) or simply Wb

### Why Flux Linkage Matters

Each turn acts like a small battery in series.

Total EMF = sum of EMFs in all turns.

More turns → greater flux linkage → greater induced EMF.

### Key Point

It is the **change in flux linkage** that induces EMF, not the flux linkage itself.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Faraday's Law",
                content: `## The Central Principle

### Statement

The magnitude of the induced EMF is proportional to the **rate of change** of magnetic flux linkage.

### Formula

**EMF = −d(NΦ)/dt**

Or for average EMF:

**EMF = −Δ(NΦ)/Δt**

### Key Insight

It's NOT the flux that matters — it's HOW FAST it changes!

| Flux Change | EMF |
|-------------|-----|
| Slow change | Small EMF |
| Fast change | Large EMF |
| No change | Zero EMF |

### Increasing Induced EMF

- Move magnet/coil **faster**
- Use **stronger** magnet (larger B)
- Use **more turns** (larger N)
- Use **larger area** coil (larger A)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Lenz's Law",
                content: `## The Direction Rule

### Statement

The direction of the induced EMF (and current) is such that it **opposes the change** causing it.

### Why Opposition?

**Conservation of energy!**

If the induced current assisted the change:
→ More change → more current → more change
→ Energy created from nothing (impossible!)

### The Negative Sign

The minus sign in EMF = −d(NΦ)/dt represents Lenz's Law mathematically.

### Applying Lenz's Law

**N pole approaching coil:**
- Flux through coil increases
- Induced current creates field opposing this
- Coil acts like N pole facing magnet → repels

**N pole leaving coil:**
- Flux through coil decreases
- Induced current opposes the decrease
- Coil acts like S pole → attracts (slows departure)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Induced EMF vs Current",
                content: `## Cause and Effect

### Induced EMF

- **Voltage** generated by changing flux
- Exists whether or not circuit is closed
- Determined by Faraday's Law

### Induced Current

- **Flow of charge** resulting from EMF
- Only flows if circuit is complete
- Magnitude: I = EMF/R

### Exam Tip

Be precise with language!

**EMF** = cause (voltage generated)
**Current** = effect (charge flow)

No closed circuit → EMF exists but no current flows.

### Summary

| Quantity | Exists in open circuit? |
|----------|------------------------|
| Induced EMF | Yes |
| Induced current | No |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Generators and Alternators",
                content: `## Producing Electricity

### Principle

Mechanical rotation causes continuous change in flux linkage.

By Faraday's Law → continuous EMF induced.

### How It Works

1. Coil rotates in magnetic field
2. Flux linkage varies sinusoidally
3. EMF = −d(NΦ)/dt → sinusoidal EMF

### Output

**Alternating EMF** (and current if connected)

EMF = EMF₀ sin(ωt)

### Maximizing Output

- Stronger magnetic field
- More turns on coil
- Faster rotation (higher ω)
- Larger coil area

### AC vs DC Generators

**Alternator:** Slip rings → AC output
**Dynamo:** Commutator → DC (rectified) output`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Eddy Currents",
                content: `## Currents in Bulk Metal

### What Are They?

Circulating currents induced in solid conducting material when subjected to changing magnetic flux.

### Cause

Moving conductor through field, or changing field through stationary conductor.

Induced EMF → current loops within metal.

### Effect (Lenz's Law)

Eddy currents create opposing magnetic field.

Result: **Resistive/braking force** on motion.

### Applications

| Application | Principle |
|-------------|-----------|
| Electromagnetic braking | Motion opposed |
| Induction heating | Resistance causes heating |
| Metal detectors | Eddy currents detected |

### Reducing Eddy Currents

**Laminations:** Thin insulated sheets reduce current loops.

Used in transformer cores to reduce energy loss.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Transformers",
                content: `## Changing AC Voltages

### Principle

Mutual electromagnetic induction between two coils sharing magnetic flux.

### Structure

- **Primary coil:** Connected to AC supply
- **Secondary coil:** Where output is taken
- **Iron core:** Links magnetic flux

### How It Works

1. AC in primary → changing magnetic field
2. Iron core guides field to secondary
3. Changing flux linkage → EMF in secondary

### Transformer Equation

**Vp/Vs = Np/Ns**

Where:
- Vp, Vs = primary, secondary voltages
- Np, Ns = number of turns

### Types

**Step-up:** Ns > Np → Vs > Vp
**Step-down:** Ns < Np → Vs < Vp

### Efficiency

Ideal: Power in = Power out
VpIp = VsIs`,
                diagrams: [],
                subsections: []
            },
            {
                title: "9. Key Formulae and Exam Practice",
                content: `## Essential Equations

| Formula | Meaning |
|---------|---------|
| Φ = BA cos θ | Magnetic flux |
| Flux linkage = NΦ | For N turns |
| EMF = −Δ(NΦ)/Δt | Faraday's Law |
| Vp/Vs = Np/Ns | Transformer ratio |

---

## Worked Example

B = 0.075 T, N = 200 turns, A = 4.8 cm², t = 0.24 s

**Step 1: Convert area**
A = 4.8 × 10⁻⁴ m²

**Step 2: Calculate flux**
Φ = BA = 0.075 × 4.8 × 10⁻⁴ = 3.6 × 10⁻⁵ Wb

**Step 3: Calculate flux linkage change**
ΔNΦ = 200 × 3.6 × 10⁻⁵ = 7.2 × 10⁻³ Wb

**Step 4: Calculate average EMF**
EMF = ΔNΦ/Δt = 7.2 × 10⁻³/0.24 = **0.030 V = 30 mV**

---

## Common Errors

❌ Forgetting to convert cm² to m²
❌ Confusing flux (Φ) with flux linkage (NΦ)
❌ Ignoring cos θ when surface not perpendicular`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Magnetic flux: Φ = BA cos θ (units: Wb)",
            "Flux linkage = NΦ = NBA cos θ",
            "Faraday's Law: EMF ∝ rate of change of flux linkage",
            "EMF = −Δ(NΦ)/Δt (negative sign = Lenz's Law)",
            "Lenz's Law: induced EMF opposes the change",
            "EMF exists in open circuit; current needs closed circuit",
            "Generators: rotation → changing flux → AC EMF",
            "Eddy currents: loops in bulk metal → braking effect",
            "Transformer: Vp/Vs = Np/Ns (mutual induction)",
            "Faster change = larger induced EMF"
        ],
        exam_tips: [
            "It's RATE of change of flux that matters, not flux itself",
            "Always convert area to m² (cm² × 10⁻⁴)",
            "Lenz's Law = conservation of energy",
            "Distinguish carefully between EMF and current",
            "Gradient of flux-time graph = induced EMF",
            "Laminated cores reduce eddy current losses"
        ]
    },
    "Alternating Currents": {
        topic: "Alternating Currents",
        subject: "A Level Physics",
        summary: "Alternating current (AC) periodically reverses direction, described by sinusoidal equations (V = V₀ sin ωt). This topic covers peak and RMS values (V_rms = V₀/√2), power in resistive circuits (P = I²_rms R), rectification (half-wave and full-wave), smoothing with capacitors, and measurement using a CRO. The RMS value is key: it's the equivalent DC value that produces the same heating effect.",
        sections: [
            {
                title: "1. Introduction to AC",
                content: `## Alternating Current Basics

### Definition

**Alternating current (AC):** Current that periodically reverses direction.

**Alternating voltage:** Voltage whose polarity periodically reverses.

### Key Terms

| Term | Definition | Unit |
|------|------------|------|
| Period (T) | Time for one complete cycle | s |
| Frequency (f) | Cycles per second | Hz |

**f = 1/T**

### Sinusoidal Form

**x = x₀ sin(ωt)**

Where:
- x = instantaneous value (V or I)
- x₀ = peak value (V₀ or I₀)
- ω = angular frequency (rad s⁻¹)
- t = time (s)

### Angular Frequency

**ω = 2πf**

UK mains: f = 50 Hz → ω = 314 rad s⁻¹`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Peak and RMS Values",
                content: `## Describing AC Magnitude

### Peak Value (x₀)

Maximum value reached during cycle.

Peak-to-peak = 2x₀

### Mean Value

For symmetrical sinusoidal AC:

**Mean value = 0** (over complete cycle)

Positive and negative halves cancel!

### Root-Mean-Square (RMS) Value

**The effective value of AC.**

### Physical Meaning

The RMS value of an AC is the DC value that produces the **same heating effect** in a resistor.

### Key Formulae

**V_rms = V₀/√2 ≈ 0.707 V₀**

**I_rms = I₀/√2 ≈ 0.707 I₀**

### Example

UK mains: 230 V is the RMS value.

Peak voltage: V₀ = 230 × √2 ≈ **325 V**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Power in AC Circuits",
                content: `## Power Dissipation

### Important Concept

Mean current = 0, but mean power ≠ 0!

Power is dissipated during BOTH half-cycles.

### Instantaneous Power

P = I²R = I₀²R sin²(ωt)

Power is always positive (sin² ≥ 0).

### Peak Power

**P_max = I₀²R**

Occurs twice per cycle (at I = ±I₀).

### Mean Power

**P_mean = ½I₀²R = ½P_max**

### Using RMS Values

With RMS values, use DC power formulae:

**P = I²_rms R**

**P = V_rms × I_rms**

**P = V²_rms/R**

### Why RMS is Useful

RMS lets us use simple DC formulae for AC power calculations.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Rectification",
                content: `## Converting AC to DC

### Definition

**Rectification:** Converting AC to DC using diodes.

### Diode Behaviour

- Allows current in one direction only
- Acts as one-way valve for current

### Half-Wave Rectification

**Single diode** in series with load.

- Passes positive half-cycles
- Blocks negative half-cycles
- Output: intermittent, pulsating DC

| Property | Value |
|----------|-------|
| Mean voltage | ≈ 0.32 V₀ |
| Frequency | Same as input |

### Full-Wave Rectification

**Bridge rectifier** (4 diodes).

- Inverts negative half-cycles
- All cycles become positive
- Output: continuous pulsating DC

| Property | Value |
|----------|-------|
| Mean voltage | ≈ 0.64 V₀ |
| Output frequency | 2 × input |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Smoothing",
                content: `## Reducing Ripple

### The Problem

Rectified DC is pulsating, not steady.

Electronics need smooth, constant DC.

### Solution: Capacitor Smoothing

Connect capacitor in **parallel** with load.

### How It Works

1. Capacitor charges as voltage rises to peak
2. As voltage falls, capacitor discharges through load
3. Maintains voltage above minimum
4. Result: smoother DC with small ripple

### Time Constant (τ = RC)

**Larger RC → slower discharge → smaller ripple**

### Reducing Ripple

- Use larger capacitance
- Use larger load resistance
- Use full-wave rectification (more pulses)

### Practical Note

Very large capacitors can draw damaging surge currents at switch-on.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. CRO Measurements",
                content: `## Using the Oscilloscope

### What a CRO Shows

Graph of voltage (y-axis) vs time (x-axis).

### Measuring Peak Voltage

1. Measure vertical height (peak-to-peak)
2. Multiply by Y-gain setting (V/div)
3. Divide by 2 for V₀

**V₀ = (Vertical divisions × Y-gain)/2**

### Measuring Period

1. Measure horizontal length of one cycle
2. Multiply by time-base setting (s/div)

**T = Horizontal divisions × Time-base**

### Measuring Frequency

**f = 1/T**

### Exam Tip

For accuracy, measure **several cycles** and divide.

### Example

3 complete cycles span 6.0 divisions
Time-base = 5 ms/div

T = (6.0 × 5)/3 = 10 ms
f = 1/0.010 = **100 Hz**`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Key Formulae and Exam Practice",
                content: `## Essential Equations

| Formula | Meaning |
|---------|---------|
| x = x₀ sin(ωt) | Sinusoidal waveform |
| ω = 2πf | Angular frequency |
| V_rms = V₀/√2 | RMS voltage |
| I_rms = I₀/√2 | RMS current |
| P = I²_rms R | Mean power |
| f = 1/T | Frequency-period relation |

---

## Worked Example

V = 24 sin(380t)

**Find peak voltage:**
Comparing with V = V₀ sin(ωt):
V₀ = **24 V**

**Find frequency:**
ω = 380 rad s⁻¹
f = ω/2π = 380/(2π) = **60 Hz**

**Find RMS voltage:**
V_rms = V₀/√2 = 24/√2 = **17 V**

---

## Common Errors

❌ Confusing peak with RMS (V₀ ≠ V_rms)
❌ Forgetting √2 factor in conversions
❌ Using peak values in power formulae
❌ Thinking mean current = 0 means mean power = 0`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "AC periodically reverses direction; DC flows one way",
            "Sinusoidal form: x = x₀ sin(ωt), ω = 2πf",
            "Mean value of symmetrical AC = 0",
            "RMS = peak/√2 (effective DC equivalent)",
            "RMS value gives same heating as equivalent DC",
            "Mean power: P = I²_rms R = ½I₀²R",
            "Half-wave rectification: single diode, pulsating DC",
            "Full-wave rectification: bridge (4 diodes), smoother DC",
            "Smoothing: capacitor in parallel reduces ripple",
            "CRO: measures V₀ from Y-gain, T from time-base"
        ],
        exam_tips: [
            "UK mains 230 V is RMS — peak is 325 V",
            "Use RMS values in power calculations",
            "Mean power = ½ × peak power for sinusoidal AC",
            "Full-wave output frequency = 2 × input frequency",
            "Larger RC time constant → less ripple",
            "When reading CRO, measure multiple cycles for accuracy"
        ]
    },
    "Quantum Physics": {
        topic: "Quantum Physics",
        subject: "A Level Physics",
        summary: "Quantum physics reveals that light and matter exhibit wave-particle duality. This topic covers photons (E = hf), the photoelectric effect (hf = Φ + ½mv²), threshold frequency, work function, energy levels in atoms, emission and absorption spectra, and the de Broglie wavelength (λ = h/p). The key insight is that energy is quantized — it comes in discrete packets called quanta.",
        sections: [
            {
                title: "1. Wave-Particle Duality",
                content: `## The Dual Nature of Light

### Classical View

Light was understood as a continuous electromagnetic wave.

### The Quantum Revolution

Experiments showed light has BOTH wave and particle properties!

### Evidence for Wave Nature

- **Interference** (double-slit patterns)
- **Diffraction** (bending around obstacles)

### Evidence for Particle Nature

- **Photoelectric effect** (light ejects electrons from metals)

### The Duality Principle

Light behaves as:
- **Waves** in propagation (interference, diffraction)
- **Particles** in interaction (photoelectric effect)

This duality extends to ALL matter!`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Photons and Photon Energy",
                content: `## Quanta of Light

### What is a Photon?

A **photon** is a quantum (discrete packet) of electromagnetic energy.

### Photon Energy

**E = hf**

Where:
- E = photon energy (J)
- h = Planck constant (6.63 × 10⁻³⁴ J s)
- f = frequency (Hz)

### Alternative Form

Using c = fλ:

**E = hc/λ**

### Key Insight

Higher frequency → higher energy photon

| Radiation | Relative Energy |
|-----------|----------------|
| Gamma rays | Highest |
| X-rays | Very high |
| UV | High |
| Visible | Medium |
| Infrared | Low |
| Radio | Lowest |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. The Electronvolt (eV)",
                content: `## A Convenient Energy Unit

### Definition

**1 electronvolt (eV)** = energy gained by an electron accelerated through 1 V.

### Conversion

**1 eV = 1.60 × 10⁻¹⁹ J**

### Why Use eV?

Atomic energies are tiny in joules.

Example: 
- 2.0 × 10⁻¹⁹ J = 1.25 eV (much easier!)

### Converting

| To convert | Multiply by |
|------------|-------------|
| eV → J | 1.60 × 10⁻¹⁹ |
| J → eV | 6.25 × 10¹⁸ |

### Common Values

| Quantity | Typical Value |
|----------|---------------|
| Visible photon | 1.8 – 3.1 eV |
| UV photon | 3.1 – 124 eV |
| X-ray photon | keV to MeV |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. The Photoelectric Effect",
                content: `## Light Ejects Electrons

### Definition

**Photoelectric effect:** Emission of electrons from a metal surface when illuminated by EM radiation.

### Key Observations

1. **Threshold frequency exists**
   - Below f₀: NO electrons emitted (regardless of intensity)
   
2. **Instantaneous emission**
   - No time delay, even at low intensity

3. **Rate ∝ intensity**
   - Brighter light → more electrons/second

4. **KE depends on frequency only**
   - NOT on intensity

### Classical Failure

Wave theory predicted:
- Any frequency works if bright enough ❌
- Time delay at low intensity ❌
- Brighter = faster electrons ❌

All wrong! Only photon theory explains this.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Work Function and Threshold Frequency",
                content: `## The Energy Barrier

### Work Function (Φ)

**Definition:** The minimum energy required to free an electron from a metal surface.

Different metals have different work functions.

| Metal | Φ (eV) |
|-------|--------|
| Caesium | 1.9 |
| Sodium | 2.3 |
| Zinc | 4.3 |
| Platinum | 5.6 |

### Threshold Frequency (f₀)

**Definition:** The minimum frequency needed to cause photoemission.

### Relationship

At threshold: photon energy = work function

**Φ = hf₀**

Rearranged:

**f₀ = Φ/h**

### Key Point

If f < f₀: NO photoemission (photon has insufficient energy)
If f ≥ f₀: Electrons ARE emitted`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Einstein's Photoelectric Equation",
                content: `## Conservation of Energy

### The Equation

**hf = Φ + ½mv²_max**

Or:

**hf = Φ + KE_max**

### Meaning

Photon energy = Work function + Maximum KE

### Rearranged Form

**KE_max = hf − Φ**

This is a straight line: y = mx + c

### Graphical Analysis

Plot KE_max vs f:

| Feature | Meaning |
|---------|---------|
| Gradient | h (Planck constant) |
| x-intercept | f₀ (threshold frequency) |
| y-intercept | −Φ (negative work function) |

### Key Insight

- Increasing frequency → increases KE_max
- Increasing intensity → increases NUMBER of electrons only`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Energy Levels in Atoms",
                content: `## Quantized Electron Energies

### Discrete Levels

Electrons can only exist at **specific energy levels**.

Cannot have energies between levels!

### Ground State

The **lowest** energy level an electron can occupy.

Most stable state.

### Excited State

Any energy level **above** the ground state.

Unstable — electron will eventually drop down.

### Energy Level Diagram

Levels shown as horizontal lines.

**Energy increases upwards** (toward zero).

Typical hydrogen values:
- Ground state: −13.6 eV
- First excited: −3.4 eV
- Second excited: −1.5 eV
- Ionization: 0 eV`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Emission and Absorption Spectra",
                content: `## Photons and Transitions

### Absorption

Electron absorbs photon → jumps UP to higher level.

**Photon energy = energy difference between levels**

ΔE = E_final − E_initial = hf

### Emission

Electron drops DOWN → emits photon.

**Photon energy = energy released**

### Line Spectra

**Emission spectrum:** Bright lines on dark background
- Atom emits specific frequencies

**Absorption spectrum:** Dark lines on continuous background
- Atom absorbs specific frequencies

### Why Lines?

Only certain energy transitions are possible.

Each transition → specific frequency photon.

Each element has **unique** spectrum (fingerprint)!`,
                diagrams: [],
                subsections: []
            },
            {
                title: "9. de Broglie Wavelength",
                content: `## Matter Waves

### de Broglie's Hypothesis (1924)

ALL moving particles have an associated wavelength!

### The de Broglie Equation

**λ = h/p = h/mv**

Where:
- λ = de Broglie wavelength (m)
- h = Planck constant (6.63 × 10⁻³⁴ J s)
- p = momentum (kg m s⁻¹)
- m = mass (kg)
- v = velocity (m s⁻¹)

### Evidence: Electron Diffraction

Electrons passed through crystal lattice produce **diffraction pattern**.

Only waves diffract → electrons have wave nature!

### Key Relationships

| Factor | Effect on λ |
|--------|-------------|
| Increase momentum | λ decreases |
| Increase mass | λ decreases |
| Increase velocity | λ decreases |

Massive objects → λ too small to observe.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "10. Key Formulae and Exam Practice",
                content: `## Essential Equations

| Formula | Meaning |
|---------|---------|
| E = hf | Photon energy |
| hf = Φ + KE_max | Photoelectric equation |
| Φ = hf₀ | Work function |
| λ = h/p | de Broglie wavelength |
| 1 eV = 1.60 × 10⁻¹⁹ J | Energy conversion |

**h = 6.63 × 10⁻³⁴ J s**

---

## Worked Example

Hydrogen transition: −13.58 eV → −0.38 eV

**Step 1: Energy difference**
ΔE = −0.38 − (−13.58) = 13.20 eV

**Step 2: Convert to joules**
ΔE = 13.20 × 1.60 × 10⁻¹⁹ = 2.11 × 10⁻¹⁸ J

**Step 3: Find frequency**
f = E/h = 2.11 × 10⁻¹⁸/6.63 × 10⁻³⁴
f = **3.19 × 10¹⁵ Hz**

---

## Common Errors

❌ Forgetting to convert eV to J
❌ Using wrong sign for energy levels
❌ Confusing wavelength with frequency in E = hf`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Photon: quantum of EM energy (E = hf)",
            "Wave-particle duality: light and matter show both behaviours",
            "Photoelectric effect: evidence for particle nature of light",
            "Threshold frequency f₀: minimum f for photoemission",
            "Work function Φ: minimum energy to free electron (Φ = hf₀)",
            "Einstein's equation: hf = Φ + KE_max",
            "1 eV = 1.60 × 10⁻¹⁹ J",
            "Energy levels: electrons exist only at discrete energies",
            "Line spectra: unique atomic fingerprints",
            "de Broglie wavelength: λ = h/p (matter waves)"
        ],
        exam_tips: [
            "Always convert eV to J before using E = hf",
            "Gradient of KE vs f graph = Planck constant h",
            "x-intercept of KE vs f graph = threshold frequency",
            "Intensity affects NUMBER of electrons, not their KE",
            "Electron diffraction proves wave nature of matter",
            "For transitions: ΔE = E_final − E_initial = hf"
        ]
    },
    "Capacitance": {
        topic: "Capacitance",
        subject: "A Level Physics",
        summary: "Capacitors store electrical energy by separating charge. This topic covers capacitance (C = Q/V), energy stored (E = ½CV² = ½QV = ½Q²/C), parallel plate capacitors (C = ε₀A/d), capacitors in series and parallel, and the exponential charging/discharging of capacitors through resistors with time constant τ = RC.",
        sections: [
            {
                title: "1. Capacitors and Capacitance",
                content: `## Storing Charge

### What is a Capacitor?

A device that stores electrical charge and energy.

Basic structure: two conducting plates separated by an insulator (dielectric).

### Capacitance (C)

**Definition:** The charge stored per unit potential difference.

**C = Q/V**

Where:
- C = capacitance (F, farads)
- Q = charge stored (C)
- V = potential difference (V)

### Units

1 farad (F) = 1 C V⁻¹

Practical units:
- μF = 10⁻⁶ F (microfarad)
- nF = 10⁻⁹ F (nanofarad)
- pF = 10⁻¹² F (picofarad)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Energy Stored in Capacitors",
                content: `## Electrical Potential Energy

### Energy Storage

Work is done to charge a capacitor → energy stored in electric field.

### Three Equivalent Formulae

**E = ½QV**

**E = ½CV²**

**E = ½Q²/C**

Where:
- E = energy stored (J)
- Q = charge (C)
- V = voltage (V)
- C = capacitance (F)

### Derivation

Area under Q-V graph = energy stored = ½ × base × height = ½QV

### Key Point

Energy stored in the **electric field** between the plates, not on the plates themselves.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Parallel Plate Capacitors",
                content: `## Capacitance of Parallel Plates

### Formula

**C = ε₀εᵣA/d**

Where:
- C = capacitance (F)
- ε₀ = permittivity of free space (8.85 × 10⁻¹² F m⁻¹)
- εᵣ = relative permittivity (dielectric constant)
- A = area of overlap (m²)
- d = separation between plates (m)

### Factors Affecting Capacitance

| Factor | Effect on C |
|--------|-------------|
| Increase A | C increases |
| Increase d | C decreases |
| Insert dielectric | C increases |

### Dielectric Materials

Insulators placed between plates:
- Increase capacitance
- Allow higher voltages
- Examples: air, paper, ceramic, plastic`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Capacitors in Parallel",
                content: `## Parallel Combination

### Configuration

All capacitors have SAME voltage across them.

### Total Capacitance

**C_total = C₁ + C₂ + C₃ + ...**

Capacitances ADD directly.

### Why?

- Same V across each capacitor
- Total charge: Q_total = Q₁ + Q₂ + Q₃
- Q = CV, so CV_total = C₁V + C₂V + C₃V
- C_total = C₁ + C₂ + C₃

### Key Point

Parallel capacitors: **greater** total capacitance.

Think: more storage area available.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Capacitors in Series",
                content: `## Series Combination

### Configuration

All capacitors have the SAME charge stored.

### Total Capacitance

**1/C_total = 1/C₁ + 1/C₂ + 1/C₃ + ...**

Reciprocals add.

### For Two Capacitors

**C_total = (C₁ × C₂)/(C₁ + C₂)**

### Why Same Charge?

Charge cannot accumulate between capacitors.

Whatever charge leaves one plate must equal charge arriving at next.

### Key Point

Series capacitors: **smaller** total capacitance than smallest individual.

Think: weakest link limits storage.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Charging and Discharging",
                content: `## Through a Resistor

### Charging a Capacitor

Connect to voltage source through resistor:

**Q = Q₀(1 − e⁻ᵗ/ᴿᶜ)**

**V = V₀(1 − e⁻ᵗ/ᴿᶜ)**

**I = I₀e⁻ᵗ/ᴿᶜ**

### Discharging a Capacitor

**Q = Q₀e⁻ᵗ/ᴿᶜ**

**V = V₀e⁻ᵗ/ᴿᶜ**

**I = I₀e⁻ᵗ/ᴿᶜ**

### Key Features

| Process | Q, V | I |
|---------|------|---|
| Charging | Exponential growth | Exponential decay |
| Discharging | Exponential decay | Exponential decay |

Current ALWAYS decays exponentially!`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Time Constant",
                content: `## The RC Time Constant

### Definition

**τ = RC**

Where:
- τ = time constant (s)
- R = resistance (Ω)
- C = capacitance (F)

### Physical Meaning

Time for charge/voltage to reach:
- **63%** of final value (charging)
- **37%** of initial value (discharging)

### Why 63% and 37%?

At t = τ: e⁻¹ ≈ 0.37

Charging: 1 − 0.37 = 0.63 (63%)
Discharging: 0.37 (37%)

### Practical Rule

After 5τ: capacitor is ~99% charged/discharged.

| Time | Charging | Discharging |
|------|----------|-------------|
| 1τ | 63% | 37% |
| 2τ | 86% | 14% |
| 3τ | 95% | 5% |
| 5τ | 99% | 1% |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Key Formulae and Exam Practice",
                content: `## Essential Equations

| Formula | Meaning |
|---------|---------|
| C = Q/V | Definition of capacitance |
| E = ½CV² = ½QV | Energy stored |
| C = ε₀εᵣA/d | Parallel plate capacitor |
| C_parallel = C₁ + C₂ | Parallel combination |
| 1/C_series = 1/C₁ + 1/C₂ | Series combination |
| Q = Q₀e⁻ᵗ/ᴿᶜ | Discharge equation |
| τ = RC | Time constant |

---

## Worked Example

C = 100 μF, R = 10 kΩ, V₀ = 12 V

**Time constant:**
τ = RC = 10000 × 100 × 10⁻⁶ = **1.0 s**

**Voltage after 2.0 s:**
V = V₀e⁻ᵗ/τ = 12 × e⁻²/¹ = 12 × 0.135
V = **1.6 V**

---

## Common Errors

❌ Using wrong series/parallel formula
❌ Forgetting to convert μF to F
❌ Confusing charging and discharging equations`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Capacitance: C = Q/V (charge per volt)",
            "Energy stored: E = ½CV² = ½QV = ½Q²/C",
            "Parallel plate: C = ε₀εᵣA/d",
            "Parallel capacitors: C_total = C₁ + C₂ (add)",
            "Series capacitors: 1/C_total = 1/C₁ + 1/C₂",
            "Discharge: Q = Q₀e⁻ᵗ/ᴿᶜ (exponential decay)",
            "Time constant: τ = RC",
            "At t = τ: 37% remaining (discharge) or 63% charged",
            "After 5τ: capacitor ~99% charged/discharged",
            "Energy stored in electric field between plates"
        ],
        exam_tips: [
            "Convert μF to F before calculations (× 10⁻⁶)",
            "Series: total C is LESS than smallest individual",
            "Parallel: total C is MORE than largest individual",
            "Current always decays exponentially (both charging/discharging)",
            "Use ln form: ln(Q/Q₀) = −t/RC for finding time",
            "Check units: RC should give seconds"
        ]
    },
    "Medical Physics": {
        topic: "Medical Physics",
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/A%20level/Physics_of_Medical_Imaging.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvQSBsZXZlbC9QaHlzaWNzX29mX01lZGljYWxfSW1hZ2luZy5tcDQiLCJpYXQiOjE3NjgxMDY5MDUsImV4cCI6NTI2ODYwMjkwNX0.UWT1wwxaWU8COPoFKLPJJOI5I44bqYJe_1Ee1ATocIM",
        subject: "A Level Physics",
        summary: "Medical physics applies physics principles to healthcare. This topic covers diagnostic imaging techniques including X-rays (production, attenuation, CT scanning), ultrasound (reflection, A-scans, B-scans, acoustic impedance), and nuclear medicine (radioactive tracers, PET scanning using positron-electron annihilation). Understanding the physics behind each technique reveals its advantages, limitations, and safety considerations.",
        sections: [
            {
                title: "1. X-Ray Production",
                content: `## Generating X-Rays

### The X-Ray Tube

- Electrons accelerated through high voltage (kV)
- Strike metal target (tungsten)
- Produce X-rays

### Two Mechanisms

**Bremsstrahlung (braking radiation):**
- Electrons decelerated by target nuclei
- Continuous spectrum of X-ray energies

**Characteristic X-rays:**
- Electrons knock out inner shell electrons
- Outer electrons fill gap, emit specific energy

### Key Factors

| Factor | Effect |
|--------|--------|
| Tube voltage (kV) | Maximum X-ray energy |
| Tube current (mA) | Intensity (number of X-rays) |
| Target material | Characteristic spectrum |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. X-Ray Attenuation",
                content: `## Absorption in Matter

### Attenuation

Reduction in X-ray intensity as beam passes through material.

### Exponential Law

**I = I₀e⁻ᵘˣ**

Where:
- I = transmitted intensity
- I₀ = incident intensity
- μ = linear attenuation coefficient (m⁻¹)
- x = thickness (m)

### Half-Value Thickness (HVT)

Thickness that reduces intensity by half.

**x½ = ln2/μ = 0.693/μ**

### Factors Affecting Attenuation

| Factor | Higher μ when... |
|--------|-----------------|
| Density | Higher |
| Atomic number | Higher |
| X-ray energy | Lower |

Bone (high Z, dense) → high attenuation
Soft tissue → lower attenuation`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. CT Scanning",
                content: `## Computed Tomography

### Principle

Multiple X-ray images from different angles.

Computer reconstructs cross-sectional image.

### Advantages over Plain X-ray

- 3D imaging
- Better soft tissue contrast
- No superposition of structures

### Process

1. X-ray source rotates around patient
2. Detectors measure transmitted intensity
3. Computer processes data
4. Reconstructs slice image

### Applications

- Brain imaging (strokes, tumours)
- Chest and abdominal scans
- Bone fractures
- Vascular imaging (with contrast)

### Limitations

- Higher radiation dose than plain X-ray
- Cost
- Some patients too large for scanner`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Ultrasound Basics",
                content: `## Sound Above 20 kHz

### Production

**Piezoelectric transducer:**
- Crystal vibrates when voltage applied
- Produces ultrasound waves
- Also detects returning echoes

### Typical Frequencies

Medical ultrasound: 1-15 MHz

### Key Properties

**Speed in tissue:**
v ≈ 1500 m s⁻¹ (similar to water)

**Wavelength:**
λ = v/f

Higher frequency → shorter λ → better resolution

### Reflection at Boundaries

Ultrasound reflects at interfaces between tissues with different acoustic impedances.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Acoustic Impedance",
                content: `## Matching Sound to Medium

### Definition

**Z = ρc**

Where:
- Z = acoustic impedance (kg m⁻² s⁻¹)
- ρ = density (kg m⁻³)
- c = speed of sound (m s⁻¹)

### Reflection Coefficient

At boundary between media 1 and 2:

**I_r/I₀ = (Z₂ − Z₁)²/(Z₂ + Z₁)²**

### Key Insight

**Similar Z:** Most transmitted, little reflection
**Very different Z:** Strong reflection

### Practical Application

**Coupling gel:**
- Air has very different Z from skin
- Gel matches impedances
- Allows ultrasound to enter body

### Typical Z Values

| Material | Z (× 10⁶) |
|----------|-----------|
| Air | 0.0004 |
| Soft tissue | 1.6 |
| Bone | 7.8 |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. Ultrasound Scanning",
                content: `## A-Scans and B-Scans

### A-Scan (Amplitude)

- Single transducer position
- Displays amplitude vs time
- Used for measuring distances
- Example: eye measurements

### B-Scan (Brightness)

- Transducer moved across body
- Amplitude shown as brightness
- Creates 2D image
- Example: fetal scanning

### Distance Calculation

**d = ct/2**

Where:
- d = depth of reflector
- c = speed of sound in tissue
- t = time for echo return

Divide by 2: wave travels there AND back!

### Advantages of Ultrasound

- No ionizing radiation
- Real-time imaging
- Portable equipment
- Relatively inexpensive`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. PET Scanning",
                content: `## Positron Emission Tomography

### Principle

Uses radioactive tracers that emit positrons.

### The Process

1. **Tracer injection:** Patient given radioactive isotope (e.g., F-18)
2. **Positron emission:** Isotope decays, emits positron (β⁺)
3. **Annihilation:** Positron meets electron
4. **Gamma rays:** Two 511 keV photons emitted in opposite directions
5. **Detection:** Ring of detectors record coincident events
6. **Reconstruction:** Computer builds 3D image

### Key Physics

**Annihilation equation:**
e⁺ + e⁻ → 2γ

Each gamma: E = 511 keV (electron rest mass energy)

Photons travel at 180° to each other.

### Applications

- Cancer detection (metabolic activity)
- Brain function studies
- Heart disease diagnosis`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Key Formulae and Comparison",
                content: `## Essential Equations

| Formula | Application |
|---------|-------------|
| I = I₀e⁻ᵘˣ | X-ray attenuation |
| x½ = 0.693/μ | Half-value thickness |
| Z = ρc | Acoustic impedance |
| d = ct/2 | Ultrasound depth |

---

## Comparison of Techniques

| Technique | Radiation | Best For |
|-----------|-----------|----------|
| X-ray | Ionizing | Bones, chest |
| CT | Ionizing (higher) | 3D imaging, soft tissue |
| Ultrasound | None | Fetus, soft tissue, real-time |
| PET | Ionizing | Metabolic activity, cancer |

---

## Safety Considerations

**Ionizing radiation (X-ray, CT, PET):**
- ALARA principle
- Lead shielding
- Limit exposure

**Ultrasound:**
- Generally considered safe
- Avoid excessive heating
- Limit fetal scanning time`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "X-rays: electrons hit target → bremsstrahlung + characteristic",
            "X-ray attenuation: I = I₀e⁻ᵘˣ (exponential)",
            "Half-value thickness: x½ = 0.693/μ",
            "CT: multiple X-ray angles → 3D reconstruction",
            "Acoustic impedance: Z = ρc",
            "Reflection stronger when Z difference is larger",
            "Coupling gel eliminates air gap for ultrasound",
            "Ultrasound depth: d = ct/2",
            "PET: β⁺ + e⁻ → two 511 keV gamma photons at 180°",
            "Annihilation: mass converted to energy (E = mc²)"
        ],
        exam_tips: [
            "Remember: d = ct/2 (divide by 2 for echo return)",
            "Higher frequency ultrasound = better resolution but less penetration",
            "X-ray attenuation depends on density and atomic number",
            "PET gamma photons are ALWAYS 511 keV each",
            "Coupling gel matches acoustic impedance to skin",
            "CT has higher radiation dose than plain X-ray"
        ]
    },
    "Cosmology": {
        topic: "Cosmology",
        subject: "A Level Physics",
        summary: "Cosmology studies the origin, structure, and evolution of the universe. This topic covers stellar properties (luminosity, temperature, Stefan-Boltzmann law), Wien's displacement law, standard candles for distance measurement, Hubble's law (v = H₀d) showing universe expansion, and the evidence for the Big Bang including cosmic microwave background radiation.",
        sections: [
            {
                title: "1. Stellar Luminosity",
                content: `## Power Output of Stars

### Luminosity (L)

**Definition:** Total power radiated by a star (all wavelengths).

Unit: watts (W)

### Stefan-Boltzmann Law

For a perfect blackbody radiator:

**L = 4πr²σT⁴**

Where:
- L = luminosity (W)
- r = radius of star (m)
- σ = Stefan-Boltzmann constant (5.67 × 10⁻⁸ W m⁻² K⁻⁴)
- T = surface temperature (K)

### Key Relationships

| Factor | Effect on L |
|--------|-------------|
| Double radius | L × 4 |
| Double temperature | L × 16 |

Temperature has much greater effect!`,
                diagrams: [],
                subsections: []
            },
            {
                title: "2. Wien's Displacement Law",
                content: `## Peak Wavelength and Temperature

### The Law

**λ_max T = constant**

**λ_max T = 2.898 × 10⁻³ m K**

Where:
- λ_max = peak wavelength (m)
- T = surface temperature (K)

### Physical Meaning

Hotter objects emit at shorter wavelengths.

### Star Colors

| Colour | Temperature | λ_max |
|--------|-------------|-------|
| Blue | ~30,000 K | ~100 nm |
| White | ~10,000 K | ~300 nm |
| Yellow | ~6,000 K | ~500 nm |
| Red | ~3,000 K | ~1000 nm |

### Application

Measure λ_max from star's spectrum → determine T.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "3. Standard Candles",
                content: `## Measuring Cosmic Distances

### The Problem

Direct measurement only works for nearby stars.

Need alternative methods for distant objects.

### Standard Candle

An object of **known luminosity**.

Compare apparent brightness with known L → find distance.

### Inverse Square Law

**I = L/(4πd²)**

Where:
- I = intensity (apparent brightness) (W m⁻²)
- L = luminosity (W)
- d = distance (m)

### Types of Standard Candles

| Object | Distance Range |
|--------|----------------|
| Cepheid variables | Nearby galaxies |
| Type Ia supernovae | Distant galaxies |

### Cepheid Variables

Period of brightness variation → luminosity.

Longer period = higher luminosity.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "4. Hubble's Law",
                content: `## The Expanding Universe

### Observation

Distant galaxies are moving away from us.

Greater distance → faster recession.

### Hubble's Law

**v = H₀d**

Where:
- v = recession velocity (m s⁻¹ or km s⁻¹)
- H₀ = Hubble constant (~70 km s⁻¹ Mpc⁻¹)
- d = distance (m or Mpc)

### Measuring Recession Velocity

**Redshift (z):**

z = Δλ/λ₀ ≈ v/c (for v << c)

### The Hubble Constant

Current estimate: H₀ ≈ 70 km s⁻¹ Mpc⁻¹

1 Mpc = 3.09 × 10²² m (megaparsec)

### Interpretation

Universe is expanding!

All galaxies receding from each other.`,
                diagrams: [],
                subsections: []
            },
            {
                title: "5. Age of the Universe",
                content: `## Estimating Cosmic Age

### From Hubble's Law

If expansion is constant:

**Age ≈ 1/H₀**

### Calculation

H₀ = 70 km s⁻¹ Mpc⁻¹

Convert to SI:
H₀ = 70 × 10³ m s⁻¹ / (3.09 × 10²² m)
H₀ ≈ 2.3 × 10⁻¹⁸ s⁻¹

Age = 1/H₀ = 4.4 × 10¹⁷ s ≈ **14 billion years**

### Limitations

- Assumes constant expansion rate
- Gravity slows expansion
- Dark energy accelerates expansion
- Current best estimate: 13.8 billion years`,
                diagrams: [],
                subsections: []
            },
            {
                title: "6. The Big Bang",
                content: `## Origin of the Universe

### The Theory

Universe began in an extremely hot, dense state.

Has been expanding and cooling ever since.

### Evidence for the Big Bang

**1. Hubble's Law (expansion)**
- Universe is expanding
- Run time backwards → everything at one point

**2. Cosmic Microwave Background (CMB)**
- Uniform radiation from all directions
- Temperature: 2.7 K
- Remnant heat from early universe

**3. Abundance of light elements**
- H, He, Li in predicted proportions
- Formed in first few minutes

### Cosmic Microwave Background

- Discovered 1965 (Penzias & Wilson)
- Peak wavelength: ~1 mm (microwave)
- Temperature: 2.725 K
- Nearly isotropic (same in all directions)`,
                diagrams: [],
                subsections: []
            },
            {
                title: "7. Dark Matter and Dark Energy",
                content: `## The Unseen Universe

### Dark Matter

**Evidence:**
- Galaxy rotation curves (stars orbit too fast)
- Gravitational lensing
- Galaxy cluster dynamics

**Properties:**
- Does not emit/absorb light
- Has gravitational effects
- ~27% of universe

### Dark Energy

**Evidence:**
- Distant supernovae fainter than expected
- Universe's expansion is accelerating

**Properties:**
- Causes accelerating expansion
- ~68% of universe
- Nature unknown

### Composition of Universe

| Component | Percentage |
|-----------|------------|
| Dark energy | 68% |
| Dark matter | 27% |
| Ordinary matter | 5% |`,
                diagrams: [],
                subsections: []
            },
            {
                title: "8. Key Formulae and Exam Practice",
                content: `## Essential Equations

| Formula | Meaning |
|---------|---------|
| L = 4πr²σT⁴ | Stefan-Boltzmann law |
| λ_max T = 2.898 × 10⁻³ | Wien's law |
| I = L/(4πd²) | Inverse square law |
| v = H₀d | Hubble's law |
| z = Δλ/λ ≈ v/c | Redshift |
| Age ≈ 1/H₀ | Universe age |

---

## Worked Example

Star with λ_max = 500 nm, T_Sun = 5800 K

**Find temperature:**
λ_max T = 2.898 × 10⁻³
T = 2.898 × 10⁻³ / (500 × 10⁻⁹)
T = **5800 K** (same as Sun)

---

## Common Errors

❌ Forgetting T is in Kelvin
❌ Using diameter instead of radius in L = 4πr²σT⁴
❌ Wrong units for Hubble constant`,
                diagrams: [],
                subsections: []
            }
        ],
        key_points: [
            "Luminosity: L = 4πr²σT⁴ (Stefan-Boltzmann)",
            "Wien's law: λ_max T = 2.898 × 10⁻³ m K",
            "Hotter stars: shorter peak wavelength (bluer)",
            "Standard candles: objects of known luminosity",
            "Inverse square law: I = L/(4πd²)",
            "Hubble's law: v = H₀d (expansion)",
            "Redshift: z = Δλ/λ ≈ v/c",
            "Age of universe ≈ 1/H₀ ≈ 14 billion years",
            "CMB: 2.7 K radiation, evidence for Big Bang",
            "Universe: 68% dark energy, 27% dark matter, 5% matter"
        ],
        exam_tips: [
            "L ∝ T⁴: temperature has huge effect on luminosity",
            "Wien's law: use wavelength in metres, T in Kelvin",
            "Cepheid period-luminosity relation for distances",
            "Hubble constant: watch units (km/s/Mpc or s⁻¹)",
            "CMB temperature is 2.7 K (not 2.7°C)",
            "Blue stars are hotter than red stars"
        ]
    }
};

// Helper function to get notes for a topic
export function getTopicNotes(topicName: string): TopicNotes | null {
    console.log('🔍 Physics getTopicNotes called with:', topicName);
    console.log('Available keys:', Object.keys(aLevelPhysicsNotes).slice(0, 5));
    const result = aLevelPhysicsNotes[topicName] || null;
    console.log('Result found:', !!result);
    if (result) {
        console.log('ALL OBJECT KEYS:', Object.keys(result));
        console.log('TEST_MARKER value:', (result as any).TEST_MARKER);
        console.log('Result has videoUrl:', !!result.videoUrl);
        console.log('Result has audioUrl:', !!result.audioUrl);
        if (result.videoUrl) {
            console.log('videoUrl value:', result.videoUrl.substring(0, 100));
        }
    }
    return result;
}

// Get all available topic names
export function getAllTopicNames(): string[] {
    return Object.keys(aLevelPhysicsNotes);
}
