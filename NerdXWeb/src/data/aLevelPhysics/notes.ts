// A Level Physics Notes - Comprehensive notes for each topic
import type { TopicNotes } from '../scienceNotes/types';


// Complete notes for each A Level Physics topic
export const aLevelPhysicsNotes: Record<string, TopicNotes> = {
    "Physical Quantities and Units": {
        topic: "Physical Quantities and Units",
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
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/A%20level/remaining/Dynamics__Science_of_Motion.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvQSBsZXZlbC9yZW1haW5pbmcvRHluYW1pY3NfX1NjaWVuY2Vfb2ZfTW90aW9uLm1wNCIsImlhdCI6MTc2ODY3ODUzMSwiZXhwIjo1MjY5MTc0NTMxfQ.0KVCXwgoKEqkoU3ad0oBIk6lUYAAmkvB0QAL6LpBfqE",
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
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/A%20level/remaining/The_Explainer__Waves.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvQSBsZXZlbC9yZW1haW5pbmcvVGhlX0V4cGxhaW5lcl9fV2F2ZXMubXA0IiwiaWF0IjoxNzY4Njc4NjUzLCJleHAiOjUyNjkxNzQ2NTN9.p4Dw9_cghaq2u1DdL4NiFdRdH6Uw8MRxE8WktPg12E0",
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
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/A%20level/remaining/Electricity__The_Journey_of_a_Charge.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvQSBsZXZlbC9yZW1haW5pbmcvRWxlY3RyaWNpdHlfX1RoZV9Kb3VybmV5X29mX2FfQ2hhcmdlLm1wNCIsImlhdCI6MTc2ODY3ODU2NSwiZXhwIjo1MjY5MTc0NTY1fQ.ci-HGtTKJJ1cuoDb9n_CnCyuVsyVL4ovhKV891hJPWQ",
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
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/A%20level/remaning/Capacitance_Dielectrics_and_Power_Smoothing.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL0EgbGV2ZWwvcmVtYW5pbmcvQ2FwYWNpdGFuY2VfRGllbGVjdHJpY3NfYW5kX1Bvd2VyX1Ntb290aGluZy5tNGEiLCJpYXQiOjE3Njg2NzcxNTYsImV4cCI6NTI2OTE3MzE1Nn0.qkRX5srzle72cQsWpMF1Mko5KrNjKOKhOYVXtF5yMSU",
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
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/A%20level/remaining/Understanding_Magnetic_Fields.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvQSBsZXZlbC9yZW1haW5pbmcvVW5kZXJzdGFuZGluZ19NYWduZXRpY19GaWVsZHMubXA0IiwiaWF0IjoxNzY4Njc4NjY5LCJleHAiOjUyNjkxNzQ2Njl9.r-ZLorxpZU6ct3RvTRxGlo58qSHveJqFC-FDzCUKYyY",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/A%20level/remaning/The_Foundational_Physics_of_Magnetic_Fields.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL0EgbGV2ZWwvcmVtYW5pbmcvVGhlX0ZvdW5kYXRpb25hbF9QaHlzaWNzX29mX01hZ25ldGljX0ZpZWxkcy5tNGEiLCJpYXQiOjE3Njg2NzcyMzAsImV4cCI6NTI2OTE3MzIzMH0.LauDlOgED9TMRQrOnQjEoNtJ7lqs_pfLwrZkYliW-pc",
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
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/A%20level/remaining/Alternating_Currents.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvQSBsZXZlbC9yZW1haW5pbmcvQWx0ZXJuYXRpbmdfQ3VycmVudHMubXA0IiwiaWF0IjoxNzY4Njc4NTAyLCJleHAiOjUyNjkxNzQ1MDJ9.-uQRhtT2HsHu63HK-5hvrVpzGorDIkT0WzORhLeQWjU",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/A%20level/remaning/AC_Power_Decoded_Root_Mean_Square_and_DC_Conversion.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL0EgbGV2ZWwvcmVtYW5pbmcvQUNfUG93ZXJfRGVjb2RlZF9Sb290X01lYW5fU3F1YXJlX2FuZF9EQ19Db252ZXJzaW9uLm00YSIsImlhdCI6MTc2ODY3NzEzNywiZXhwIjo1MjY5MTczMTM3fQ.vvJvnl1HbbH0RZIo4cbMMhalXmJxvpzrxQMpyplmk3I",
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
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/A%20level/remaining/Physics_of_Medical_Imaging.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvQSBsZXZlbC9yZW1haW5pbmcvUGh5c2ljc19vZl9NZWRpY2FsX0ltYWdpbmcubXA0IiwiaWF0IjoxNzY4Njc4NjI3LCJleHAiOjUyNjkxNzQ2Mjd9.fWPBCAgEM6p18xqTvccdivkF_fBDHZzkxo8R9ztcoVI",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/A%20level/remaning/How_Quantum_Physics_Ended_Continuity.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL0EgbGV2ZWwvcmVtYW5pbmcvSG93X1F1YW50dW1fUGh5c2ljc19FbmRlZF9Db250aW51aXR5Lm00YSIsImlhdCI6MTc2ODY3NzE4MywiZXhwIjo1MjY5MTczMTgzfQ.u_Ly2f1kpqxd5lHWlHQjO7w19_1oYFLfOVFif3ysgNU",
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
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/A%20level/remaining/Nuclear_Physics.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvQSBsZXZlbC9yZW1haW5pbmcvTnVjbGVhcl9QaHlzaWNzLm1wNCIsImlhdCI6MTc2ODY3ODYwNSwiZXhwIjo1MjY5MTc0NjA1fQ.NMj7CKZ-BhsdMRqHjVzf8tUO5bWxPv9AAfx5F1rd_wk",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/A%20level/remaning/Mass_Defect_Quarks_and_Atomic_Energy.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL0EgbGV2ZWwvcmVtYW5pbmcvTWFzc19EZWZlY3RfUXVhcmtzX2FuZF9BdG9taWNfRW5lcmd5Lm00YSIsImlhdCI6MTc2ODY3NzIwNCwiZXhwIjo1MjY5MTczMjA0fQ.uNrl8UiN93i6ngyR4td8SOvB8IZWIGs4xViojX7PA_s",
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
        videoUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Video/Science/Physics/A%20level/remaining/Astronomy_and_Cosmology.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWRlby9TY2llbmNlL1BoeXNpY3MvQSBsZXZlbC9yZW1haW5pbmcvQXN0cm9ub215X2FuZF9Db3Ntb2xvZ3kubXA0IiwiaWF0IjoxNzY4Njc4NTE1LCJleHAiOjUyNjkxNzQ1MTV9.hVqAnv8PzG4zdo-H3sKcxFbnwPvIBFkRxdgCtw8isqo",
        audioUrl: "https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/sign/Audio_Notes/Physics/A%20level/remaning/Sizing_Stars_and_Proving_Expansion.m4a?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNzUyNjcyMy1jNjY2LTRjMzQtOWFmYy1hZDBjMmI3ZGYyMGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpb19Ob3Rlcy9QaHlzaWNzL0EgbGV2ZWwvcmVtYW5pbmcvU2l6aW5nX1N0YXJzX2FuZF9Qcm92aW5nX0V4cGFuc2lvbi5tNGEiLCJpYXQiOjE3Njg2NzcyMTYsImV4cCI6NTI2OTE3MzIxNn0.UeLpHeqNGvMz3K-r8hlETya8YUC-Mv5UTpzy_JP90OM",
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





};

export function getTopicNotes(topicName: string): TopicNotes | null {
    return aLevelPhysicsNotes[topicName] ?? null;
}

// Get all available topic names
export function getAllTopicNames(): string[] {
    return Object.keys(aLevelPhysicsNotes);
}
