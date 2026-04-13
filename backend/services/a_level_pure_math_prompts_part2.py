"""
A-Level Pure Mathematics – Expanded prompt data (Part 2).
From ZIMSEC A-Level-Part2-Topics-9-12.md: Topics 9–12 (Trigonometry through Integration).
Provides learning_objectives, subtopics, exam_question_types, and question templates.
"""

# Topics 9–12: Lower Sixth completion.

A_LEVEL_PURE_MATH_PART2 = {
    "Trigonometry (Identities & Equations)": {
        "subtopics": [
            "Radian Measure (conversion, arc length, sector area)",
            "Trigonometric Identities (Pythagorean, compound angle, double angle)",
            "Solving Equations (general solutions, specific ranges)",
            "R-formula: a sin θ + b cos θ = R sin(θ ± α)",
            "Small Angle Approximations (sin θ ≈ θ, cos θ ≈ 1 - θ²/2)",
        ],
        "learning_objectives": [
            "Understand radian measure: convert degrees ↔ radians",
            "Use formulas: arc length = rθ, sector area = ½r²θ",
            "Prove and use identities: sin²θ + cos²θ = 1, tan²θ + 1 = sec²θ",
            "Apply compound angle formulas: sin(A±B), cos(A±B), tan(A±B)",
            "Use double angle formulas: sin 2A, cos 2A, tan 2A",
            "Express a sin θ + b cos θ as R sin(θ±α) or R cos(θ±α)",
            "Solve trigonometric equations for general solutions",
            "Use small angle approximations",
        ],
        "exam_question_types": [
            "Radians | P1, P2 | Convert 135° to radians, arc length",
            "Identities | P1, P2 | Prove tan²θ = sec²θ - 1",
            "Equations | P1, P2 | Solve 2sin²θ + 3cos θ = 0",
            "R-formula | P2 | Express 3sin θ + 4cos θ in form R sin(θ + α)",
            "Compound Angles | P2 | Find exact value of sin 75°",
        ],
        "templates": [
            {
                "name": "Template 1: Radian Measure",
                "pattern": "(a) Convert to radians: 30°, 135°, 270°. (b) Convert to degrees: π/6, 2π/3, 5π/4. (c) Circle radius 8 cm, sector angle π/3: arc length, sector area, perimeter. (d) Sector area 50 cm², radius 10 cm: find angle in radians. (e) Two concentric circles radii 5 and 8 cm, sector π/6: area between them.",
                "skills": "Radian conversion, arc length, sector area",
            },
            {
                "name": "Template 2: Trigonometric Identities",
                "pattern": "(a) Prove sin²θ + cos²θ = 1. (b) Show 1 + tan²θ = sec²θ. (c) Prove 1 + cot²θ = cosec²θ. (d) Simplify (sin²θ)/(1 - cos²θ). (e) Prove (1 - cos 2θ)/(sin 2θ) = tan θ. (f) Show sin⁴θ - cos⁴θ = sin²θ - cos²θ.",
                "skills": "Pythagorean identities, algebraic manipulation",
            },
            {
                "name": "Template 3: Compound Angle Formulas",
                "pattern": "(a) Find exact sin 75° using sin(45°+30°). (b) Exact cos 15° using cos(45°-30°). (c) Prove sin(A+B) = sin A cos B + cos A sin B. (d) sin A = 3/5, cos B = 12/13 (acute): find sin(A+B), cos(A-B), tan(A+B). (e) Express sin(θ+60°) in terms of sin θ and cos θ.",
                "skills": "Compound angle formulas, exact values",
            },
            {
                "name": "Template 4: Double Angle Formulas",
                "pattern": "(a) Prove sin 2A = 2 sin A cos A. (b) Prove cos 2A = cos²A - sin²A = 2cos²A - 1 = 1 - 2sin²A. (c) sin θ = 4/5, 0<θ<π/2: find sin 2θ, cos 2θ, tan 2θ. (d) Solve sin 2θ = sin θ, 0° ≤ θ ≤ 360°. (e) Prove (1+cos 2θ)/(sin 2θ) = cot θ.",
                "skills": "Double angle identities, solving equations",
            },
            {
                "name": "Template 5: R-formula",
                "pattern": "(a) Express 3 sin θ + 4 cos θ as R sin(θ+α), R>0, 0<α<90°. (b) Hence max, min, and θ when max occurs. (c) Solve 3 sin θ + 4 cos θ = 2, 0° ≤ θ ≤ 360°. (d) Express 5 cos θ - 12 sin θ as R cos(θ+α). (e) Solve 5 cos θ - 12 sin θ = 6.5.",
                "skills": "R-formula, max/min values, solving equations",
            },
        ],
    },
    "Differentiation": {
        "subtopics": [
            "First Principles (definition of derivative)",
            "Standard Derivatives (powers, trig, exponential, log)",
            "Rules of Differentiation (sum, product, quotient, chain)",
            "Second Derivatives (f''(x), acceleration)",
        ],
        "learning_objectives": [
            "Understand derivative as gradient/rate of change",
            "Use first principles: f'(x) = lim[h→0] [f(x+h)-f(x)]/h",
            "Differentiate xⁿ, sin x, cos x, eˣ, ln x",
            "Apply sum/difference, product, quotient, chain rules",
            "Find second and higher derivatives",
        ],
        "exam_question_types": [
            "First Principles | P1, P2 | Find f'(x) for f(x)=x² from first principles",
            "Standard Derivatives | P1 | Differentiate x⁵, sin x, eˣ",
            "Product Rule | P1, P2 | Differentiate x² sin x",
            "Quotient Rule | P2 | Differentiate (x+1)/(x-2)",
            "Chain Rule | P1, P2 | Differentiate (2x+1)⁵",
        ],
        "templates": [
            {
                "name": "Template 1: First Principles",
                "pattern": "Using first principles, find f'(x) for: (a) f(x)=x². (b) f(x)=3x+5. (c) f(x)=x³. (d) f(x)=1/x. (e) Hence tangent to y=x² at (2,4).",
                "skills": "Definition of derivative, limits, tangent equations",
            },
            {
                "name": "Template 2: Standard Derivatives",
                "pattern": "Differentiate w.r.t. x: (a) y=x⁷. (b) y=5x⁴-3x²+7x-2. (c) y=√x+1/x². (d) y=sin x+cos x. (e) y=3eˣ-2 ln x. (f) y=x⁻³+x^(1/2).",
                "skills": "Power rule, trig, exponential, log derivatives",
            },
            {
                "name": "Template 3: Product Rule",
                "pattern": "Differentiate: (a) y=x² sin x. (b) y=(2x+1)(x³-4). (c) y=x eˣ. (d) y=(x²+1) ln x. (e) y=eˣ sin x. (f) Gradient of y=x² cos x at x=π/4.",
                "skills": "Product rule application",
            },
            {
                "name": "Template 4: Quotient Rule",
                "pattern": "Differentiate: (a) y=(x+1)/(x-2). (b) y=x²/(x+3). (c) y=sin x/x. (d) y=eˣ/(x²+1). (e) y=(2x-1)/(3x+2). (f) Stationary points of y=x/(x²+1).",
                "skills": "Quotient rule, stationary points",
            },
            {
                "name": "Template 5: Chain Rule",
                "pattern": "Differentiate: (a) y=(2x+1)⁵. (b) y=sin(3x). (c) y=e^(2x+1). (d) y=ln(x²+1). (e) y=(x²-3x+2)⁴. (f) y=√(4-x²). (g) dy/dx when y=cos(x²) at x=√(π/2).",
                "skills": "Chain rule, composite functions",
            },
        ],
    },
    "Applications of Differentiation": {
        "subtopics": [
            "Tangents and Normals (equations at given points)",
            "Stationary Points (max, min, inflection)",
            "Curve Sketching (using derivatives)",
            "Optimization (max/min problems)",
            "Rates of Change (real-world applications)",
        ],
        "learning_objectives": [
            "Find equations of tangents and normals",
            "Identify stationary points using f'(x)=0; classify via second derivative",
            "Sketch curves showing key features",
            "Solve optimization problems; apply to rates of change, kinematics",
            "Understand increasing/decreasing functions",
        ],
        "exam_question_types": [
            "Tangent/Normal | P1, P2 | Find tangent to y=x² at (1,1)",
            "Stationary Points | P1, P2 | Find and classify for y=x³-3x",
            "Optimization | P2 | Maximize area with fixed perimeter",
            "Rates of Change | P2 | Volume increasing 5 cm³/s, find dr/dt",
            "Curve Sketching | P2 | Sketch y=x³-6x²+9x",
        ],
        "templates": [
            {
                "name": "Template 1: Tangents and Normals",
                "pattern": "Curve y=x³-2x²+3x-1: (a) Gradient at (2,5). (b) Tangent at (2,5). (c) Normal at (2,5). (d) Where tangent horizontal. (e) Where tangent parallel to y=4x.",
                "skills": "Derivatives, tangent/normal equations",
            },
            {
                "name": "Template 2: Stationary Points",
                "pattern": "(a) Stationary points of f(x)=x³-6x²+9x+2. (b) Nature via second derivative. (c) Sketch showing stationary points. (d) Stationary points of g(x)=x+1/x, x>0. (e) h(x)=x²e⁻ˣ: find and classify.",
                "skills": "f'(x)=0, second derivative test, classification",
            },
            {
                "name": "Template 3: Optimization Problems",
                "pattern": "(a) Rectangle perimeter 40 cm: dimensions for max area. (b) Cylinder volume 1000 cm³: radius and height to minimize surface area. (c) 100 m fencing, rectangular enclosure against wall: max area. (d) Box square base, volume 500 cm³: minimize surface area. (e) N such that N+1/N is minimum.",
                "skills": "Setting up equations, optimization, constraints",
            },
            {
                "name": "Template 4: Rates of Change",
                "pattern": "(a) Circle radius increasing 2 cm/s: rate of area increase when r=5. (b) Cube edge 0.5 cm/s: rate of volume when edge=10. (c) Ladder 5 m, top down 0.8 m/s when 3 m high: how fast is bottom? (d) Cone vertex-down, water out 5 cm³/s: rate of depth when h=6, r=4 (r/h=2/3).",
                "skills": "Related rates, implicit differentiation",
            },
            {
                "name": "Template 5: Curve Sketching",
                "pattern": "f(x)=x³-3x²-9x+5: (a) f'(x), f''(x). (b) Stationary points, classify. (c) Points of inflection. (d) Intercepts. (e) Sketch with key features. (f) Intervals increasing/decreasing. (g) Intervals concave up/down.",
                "skills": "Complete curve analysis, sketching",
            },
        ],
    },
    "Integration": {
        "subtopics": [
            "Indefinite Integration (antiderivatives, +C)",
            "Definite Integration (limits, evaluation)",
            "Area Under Curves (between curve and x-axis)",
            "Area Between Curves (two functions)",
            "Volumes of Revolution (rotation about axes)",
        ],
        "learning_objectives": [
            "Understand integration as reverse of differentiation",
            "Integrate xⁿ, sin x, cos x, eˣ, 1/x; indefinite (+C), definite",
            "Calculate areas under curves, between two curves",
            "Volumes of revolution about x- and y-axes; kinematics applications",
        ],
        "exam_question_types": [
            "Indefinite | P1 | Find ∫(x³+2x) dx",
            "Definite | P1, P2 | Evaluate ∫[1 to 3] (x²-1) dx",
            "Area | P2 | Area under y=x² from 0 to 2",
            "Between Curves | P2 | Area between y=x² and y=x",
            "Volume | P2 | Volume when y=x² rotated about x-axis",
        ],
        "templates": [
            {
                "name": "Template 1: Indefinite Integration",
                "pattern": "Find: (a) ∫x⁴ dx. (b) ∫(3x²-5x+2) dx. (c) ∫(√x+1/x²) dx. (d) ∫(sin x+cos x) dx. (e) ∫eˣ dx. (f) ∫(2x+1)³ dx.",
                "skills": "Standard integrals, indefinite integration",
            },
            {
                "name": "Template 2: Definite Integration",
                "pattern": "Evaluate: (a) ∫[0 to 2] x² dx. (b) ∫[1 to 4] (x+1/x) dx. (c) ∫[0 to π/2] sin x dx. (d) ∫[0 to 1] eˣ dx. (e) ∫[-1 to 1] (x³-x) dx. (f) Show ∫[a to b] f = -∫[b to a] f.",
                "skills": "Definite integrals, limits, properties",
            },
            {
                "name": "Template 3: Area Under Curves",
                "pattern": "(a) Area under y=x² from 0 to 3. (b) Area between y=x³, x-axis, x=1 and 2. (c) Area between y=sin x, x-axis, 0 to π. (d) y=4-x²: area between curve and x-axis. (e) y=eˣ, area 0 to 2.",
                "skills": "Area calculation, definite integrals",
            },
            {
                "name": "Template 4: Area Between Curves",
                "pattern": "(a) Area between y=x² and y=x, 0 to 1. (b) Area enclosed by y=x² and y=2x. (c) Area between y=sin x and y=cos x, 0 to π/4. (d) y=x² and y=4-x²: area between them. (e) Area between y=eˣ and y=e⁻ˣ, 0 to 1.",
                "skills": "Area between two curves, finding intersections",
            },
            {
                "name": "Template 5: Volumes of Revolution",
                "pattern": "(a) y=x about x-axis, 0 to 2: volume. (b) y=x² about x-axis, 0 to 1. (c) y=√x about x-axis, 0 to 4. (d) Circle x²+y²=r² about x-axis: show volume = (4/3)πr³. (e) y=sin x, 0≤x≤π, about x-axis: volume.",
                "skills": "V=π∫y² dx, volumes of revolution",
            },
        ],
    },
}


def get_part2_topic_keys():
    """Return topic names that have Part 2 expanded data."""
    return list(A_LEVEL_PURE_MATH_PART2.keys())
