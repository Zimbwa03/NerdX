"""
A-Level Pure Mathematics – Expanded prompt data (Part 3).
From ZIMSEC A-Level-Part3-Topics-13-22.md: Upper Sixth Topics 13–22.
Provides learning_objectives, subtopics, exam_question_types, and question templates.
"""

# Topics 13–22: Upper Sixth (Form 6).

A_LEVEL_PURE_MATH_PART3 = {
    "Further Trigonometry": {
        "subtopics": [
            "Multiple Angle Formulas (triple angles, half angles)",
            "Factor Formulas (sum/difference to products)",
            "Inverse Trigonometric Functions (arcsin, arccos, arctan)",
            "General Solutions (all solutions to trig equations)",
        ],
        "learning_objectives": [
            "Derive and use multiple angle formulas",
            "Convert sums to products using factor formulas",
            "Understand domains and ranges of inverse trig functions",
            "Solve equations involving inverse trig",
            "Find general solutions: θ = nπ ± α patterns",
            "Apply to complex problems",
        ],
        "exam_question_types": [
            "Triple Angle | P2 | Express sin 3θ in terms of sin θ",
            "Factor Formulas | P2 | Express sin A + sin B as product",
            "Inverse Trig | P2 | Solve arcsin x + arccos x = π/3",
            "General Solutions | P2 | Find all solutions of sin 2θ = cos θ",
        ],
        "templates": [
            {
                "name": "Template 1: Multiple Angle Formulas",
                "pattern": "(a) Prove sin 3A = 3 sin A - 4 sin³A. (b) Prove cos 3A = 4 cos³A - 3 cos A. (c) Express tan 3A in terms of tan A. (d) sin θ = 3/5, 0<θ<π/2: find sin 3θ. (e) Solve sin 3θ = sin θ, 0° ≤ θ ≤ 180°.",
                "skills": "Triple angle formulas, derivation, solving",
            },
            {
                "name": "Template 2: Factor Formulas",
                "pattern": "(a) Prove sin A + sin B = 2 sin((A+B)/2) cos((A-B)/2). (b) Prove cos A + cos B = 2 cos((A+B)/2) cos((A-B)/2). (c) Express as product: sin 5θ + sin 3θ. (d) cos 7θ - cos 3θ. (e) Solve sin 5x + sin 3x = 0, 0° ≤ x ≤ 180°. (f) Prove (sin 5θ+sin 3θ)/(cos 5θ+cos 3θ) = tan 4θ.",
                "skills": "Factor formulas, sum-to-product conversions",
            },
            {
                "name": "Template 3: Inverse Trigonometric Functions",
                "pattern": "(a) arcsin(1/2). (b) arccos(√3/2). (c) arctan(1). (d) Solve arcsin(x) = π/6. (e) Solve arccos(2x-1) = π/3. (f) Prove arcsin x + arccos x = π/2. (g) Simplify sin(arccos x).",
                "skills": "Inverse trig functions, domains, ranges",
            },
            {
                "name": "Template 4: General Solutions",
                "pattern": "General solutions: (a) sin θ = 1/2. (b) cos θ = -√3/2. (c) tan θ = 1. (d) sin 2θ = cos θ. (e) sin θ = sin 3θ. (f) cos 2θ = cos θ + 2.",
                "skills": "General solution patterns, all solutions",
            },
            {
                "name": "Template 5: Advanced Applications",
                "pattern": "(a) Solve 2 sin²θ + 3 cos θ = 0, general solution. (b) Prove tan(π/4+θ) = (1+tan θ)/(1-tan θ). (c) Max of 5 sin θ + 12 cos θ + 3. (d) Solve arctan(2x) + arctan(x) = π/4. (e) Express sin 4θ in terms of sin θ and cos θ.",
                "skills": "Complex trig equations, proofs, applications",
            },
        ],
    },
    "Further Differentiation": {
        "subtopics": [
            "Implicit Differentiation (dy/dx when y not explicit)",
            "Parametric Differentiation (dx/dt, dy/dt)",
            "Related Rates (multiple changing variables)",
            "Logarithmic Differentiation (products and powers)",
        ],
        "learning_objectives": [
            "Differentiate implicitly: d/dx of terms in x and y",
            "Find dy/dx from parametric equations: (dy/dt)/(dx/dt)",
            "Find second derivatives for parametric equations",
            "Apply to related rates; use logarithmic differentiation for y = [f(x)]^[g(x)]",
            "Differentiate inverse trig functions",
        ],
        "exam_question_types": [
            "Implicit | P2 | Find dy/dx for x² + y² = 25",
            "Parametric | P2 | x = t², y = t³, find dy/dx",
            "Related Rates | P2 | Connected rates of change",
            "Logarithmic Diff | P2 | Differentiate y = x^x",
        ],
        "templates": [
            {
                "name": "Template 1: Implicit Differentiation",
                "pattern": "Find dy/dx implicitly: (a) x²+y²=25. (b) x³+y³=3xy. (c) x²+xy+y²=7. (d) sin(xy)=y. (e) e^(xy)=x+y. (f) Circle x²+y²=25: tangent at (3,4).",
                "skills": "Implicit differentiation, tangent equations",
            },
            {
                "name": "Template 2: Parametric Differentiation",
                "pattern": "Find dy/dx: (a) x=t², y=t³. (b) x=3t, y=2/t. (c) x=a cos θ, y=a sin θ. (d) x=θ+sin θ, y=1-cos θ. (e) x=e^t, y=e^(-t). (f) x=2t, y=t²: find d²y/dx².",
                "skills": "Parametric derivatives, second derivatives",
            },
            {
                "name": "Template 3: Logarithmic Differentiation",
                "pattern": "Logarithmic differentiation for dy/dx: (a) y=x^x. (b) y=(x+1)^x. (c) y=x^(sin x). (d) y=(sin x)^x. (e) y=[(x-1)(x-2)]/(x-3). (f) y=x^(1/x).",
                "skills": "Logarithmic differentiation, power functions",
            },
            {
                "name": "Template 4: Related Rates Advanced",
                "pattern": "(a) Sphere r increasing 0.5 cm/s: rate of surface area when r=10. (b) Cone vertex-down, water in 10 cm³/s; h=15, r=5 (r/h=1/3): rate of height. (c) Cars A north 60 km/h, B east 80 km/h: rate of distance. (d) Kite 100 m high, string in 2 m/s: horizontal speed when 125 m out.",
                "skills": "Related rates, 3D problems",
            },
            {
                "name": "Template 5: Inverse Trig Derivatives",
                "pattern": "(a) Prove d/dx(arcsin x)=1/√(1-x²). (b) d/dx(arccos x)=-1/√(1-x²). (c) d/dx(arctan x)=1/(1+x²). (d) y=arcsin(2x): dy/dx. (e) y=arctan(x²). (f) y=x arcsin x.",
                "skills": "Inverse trig derivatives, proofs",
            },
        ],
    },
    "Further Integration Techniques": {
        "subtopics": [
            "Integration by Substitution (u-substitution)",
            "Integration by Parts (∫u dv = uv - ∫v du)",
            "Partial Fractions Integration",
            "Reduction Formulas (recursive integration)",
        ],
        "learning_objectives": [
            "Use substitution ∫f(g(x))g'(x) dx",
            "Apply integration by parts; choose u and dv appropriately",
            "Integrate using partial fractions",
            "Derive and use reduction formulas; integrate rational functions",
        ],
        "exam_question_types": [
            "Substitution | P2 | ∫ 2x(x²+1)³ dx",
            "By Parts | P2 | ∫ x sin x dx",
            "Partial Fractions | P2 | ∫ 1/[(x-1)(x+2)] dx",
            "Reduction | P2 | ∫ xⁿ eˣ dx",
        ],
        "templates": [
            {
                "name": "Template 1: Integration by Substitution",
                "pattern": "Substitution: (a) ∫ 2x(x²+1)⁴ dx, u=x²+1. (b) ∫ sin³x cos x dx, u=sin x. (c) ∫ eˣ/(1+eˣ) dx, u=1+eˣ. (d) ∫ x/√(x²+4) dx. (e) ∫[0 to 1] x(x²+1)³ dx. (f) ∫ tan x dx.",
                "skills": "u-substitution, definite integrals",
            },
            {
                "name": "Template 2: Integration by Parts",
                "pattern": "By parts: (a) ∫ x sin x dx. (b) ∫ x eˣ dx. (c) ∫ x² eˣ dx. (d) ∫ x ln x dx. (e) ∫ eˣ sin x dx (twice). (f) ∫[0 to π] x sin x dx.",
                "skills": "Integration by parts, choosing u and dv",
            },
            {
                "name": "Template 3: Partial Fractions Integration",
                "pattern": "(a) Express 1/[(x-1)(x+2)] in partial fractions, then integrate. (b) ∫ (3x+1)/[(x+1)(x-2)] dx. (c) ∫ x/[(x-1)(x+3)] dx. (d) ∫[2 to 3] 1/(x²-1) dx. (e) ∫ (2x+3)/(x²-x-6) dx.",
                "skills": "Partial fractions, logarithmic integrals",
            },
            {
                "name": "Template 4: Reduction Formulas",
                "pattern": "(a) Iₙ=∫ xⁿ eˣ dx: show Iₙ=xⁿ eˣ - n Iₙ₋₁. (b) Hence ∫ x³ eˣ dx. (c) Iₙ=∫ sinⁿx dx: derive reduction. (d) Iₙ=∫ xⁿ ln x dx: reduction. (e) ∫ x⁴ ln x dx.",
                "skills": "Reduction formulas, recursive integration",
            },
            {
                "name": "Template 5: Mixed Techniques",
                "pattern": "Find (choose method): (a) ∫ x√(x+1) dx. (b) ∫ ln x dx. (c) ∫ 1/(x²-4) dx. (d) ∫ x sec²x dx. (e) ∫ sin x cos x dx. (f) ∫ eˣ cos x dx.",
                "skills": "Selecting integration technique",
            },
        ],
    },
    "Differential Equations": {
        "subtopics": [
            "Formation (setting up DEs from context)",
            "Separable Variables (dy/dx = f(x)g(y))",
            "Initial Conditions (finding constants)",
            "Applications (growth, decay, motion)",
        ],
        "learning_objectives": [
            "Form differential equations from problems",
            "Solve by separating variables; apply initial conditions",
            "Model real-world: population, temperature, motion",
            "Understand family of solutions vs particular solution",
        ],
        "exam_question_types": [
            "Formation | P1, P2 | Set up DE from problem",
            "Separable | P1, P2 | Solve dy/dx = xy",
            "Initial Value | P2 | Find particular solution",
            "Modeling | P2 | Exponential growth/decay",
        ],
        "templates": [
            {
                "name": "Template 1: Forming Differential Equations",
                "pattern": "Form DEs for: (a) Rate of population ∝ current population. (b) Cooling rate ∝ temp difference with surroundings. (c) Falling object: a = g - kv². (d) Salt dissolving rate ∝ undissolved. (e) Curve where gradient = 2y.",
                "skills": "Translating words to DEs",
            },
            {
                "name": "Template 2: Separable Variables",
                "pattern": "Solve: (a) dy/dx = 2x. (b) dy/dx = y. (c) dy/dx = xy. (d) dy/dx = y/x. (e) dy/dx = (1+y²)/(1+x²). (f) dy/dx = y² sin x.",
                "skills": "Separation of variables, integration",
            },
            {
                "name": "Template 3: Initial Value Problems",
                "pattern": "Solve with conditions: (a) dy/dx = 3x², y=2 when x=1. (b) dy/dx = y, y=5 when x=0. (c) dy/dx = xy, y=2 when x=0. (d) dy/dx = y/x, y=4 when x=2. (e) dy/dx = 2y cos x, y=1 when x=0.",
                "skills": "Particular solutions, initial conditions",
            },
            {
                "name": "Template 4: Exponential Growth/Decay",
                "pattern": "(a) dP/dt = 0.05P, P(0)=1000: P(t). (b) dN/dt = -0.03N, N(0)=500: half-life. (c) dT/dt = -0.1(T-20), T(0)=100: T(t). (d) dV/dt = 0.08V, V(0)=5000: when V=10000. (e) dC/dt = -0.2C, C(0)=50: C after 5 h.",
                "skills": "Exponential models, real applications",
            },
            {
                "name": "Template 5: Motion Problems",
                "pattern": "(a) dv/dt = -kv, v(0)=20: v(t) and distance. (b) dv/dt = 10 - 0.1v², v(0)=0: terminal velocity. (c) d²x/dt² = -4x, x(0)=2, v(0)=0: x(t). (d) dv/dt + 2v = 0, v(0)=10: v(t). (e) Cooling: T 100°→60° in 10 min, find k.",
                "skills": "Motion DEs, second order reduction",
            },
        ],
    },
    "Complex Numbers": {
        "subtopics": [
            "Algebraic Form (a+bi operations)",
            "Argand Diagram (geometric representation)",
            "Modulus and Argument (|z|, arg z)",
            "Polar Form (r(cos θ + i sin θ) = re^(iθ))",
            "de Moivre's Theorem ((cos θ + i sin θ)ⁿ)",
            "Roots of Unity (solving zⁿ = 1)",
        ],
        "learning_objectives": [
            "Add, subtract, multiply, divide complex numbers; conjugate and properties",
            "Plot on Argand diagram; find modulus and argument",
            "Convert between Cartesian and polar; apply de Moivre's theorem",
            "Find nth roots; solve polynomial equations with complex roots",
        ],
        "exam_question_types": [
            "Operations | P1, P2 | (2+3i)(4-i)",
            "Modulus/Argument | P2 | |3+4i|, arg(3+4i)",
            "Polar Form | P2 | Express 1+i in polar form",
            "de Moivre | P2 | (cos θ + i sin θ)⁵",
            "Roots | P2 | Solve z³ = 8",
        ],
        "templates": [
            {
                "name": "Template 1: Complex Number Operations",
                "pattern": "(a) (3+2i)+(4-5i). (b) (2+3i)(1-2i). (c) (3+4i)/(2-i) in a+bi. (d) (1+i)⁴. (e) z=2+3i: z², z̄. (f) (2+i)z = 5-i.",
                "skills": "Complex arithmetic, division, equations",
            },
            {
                "name": "Template 2: Argand Diagram & Modulus",
                "pattern": "(a) Plot 3+2i, -1+4i, 2-3i. (b) |3+4i|, |5-12i|, |-6+8i|. (c) arg(1+i), arg(-1+√3 i), arg(4-3i). (d) |z-2|=3: locus. (e) arg(z)=π/4: locus.",
                "skills": "Argand plotting, modulus, argument, loci",
            },
            {
                "name": "Template 3: Polar Form & Exponential",
                "pattern": "(a) Polar form: 1+i, -√3+i, 4i. (b) 2(cos π/3 + i sin π/3) to Cartesian. (c) 3+4i as re^(iθ). (d) (2 cis 30°)(3 cis 45°). (e) (4 cis 120°)/(2 cis 30°).",
                "skills": "Polar conversion, multiplication/division in polar",
            },
            {
                "name": "Template 4: de Moivre's Theorem",
                "pattern": "(a) de Moivre: (cos θ + i sin θ)⁵. (b) (1+i)⁸ via polar. (c) cos 5θ in terms of cos θ. (d) sin 3θ in terms of sin θ. (e) z⁴ = 16. (f) Cube roots of 8i.",
                "skills": "de Moivre's theorem, powers, roots",
            },
            {
                "name": "Template 5: Roots & Equations",
                "pattern": "(a) z²+2z+5=0. (b) z³=1. (c) z⁴=-16. (d) Roots of z³=1: equilateral triangle. (e) α root of z²-4z+5=0: α², 1/α. (f) z⁴-4z²+8=0.",
                "skills": "Quadratic formula for complex, nth roots, geometry",
            },
        ],
    },
    "Matrices and Determinants": {
        "subtopics": [
            "Matrix Operations (addition, multiplication)",
            "Determinants (2×2 and 3×3)",
            "Inverse Matrices (finding A⁻¹)",
            "Linear Equations (solving systems using matrices)",
            "Transformations (matrix representation)",
        ],
        "learning_objectives": [
            "Add, subtract, multiply matrices; determinants 2×2, 3×3",
            "Find inverse of 2×2 and 3×3; solve AX = B using A⁻¹",
            "Represent geometric transformations; singular vs non-singular",
        ],
        "exam_question_types": [
            "Operations | P2 | Multiply two 2×2 matrices",
            "Determinant | P2 | Find det(A)",
            "Inverse | P2 | Find A⁻¹",
            "Systems | P2 | Solve 2x+3y=7, 4x-y=5 using matrices",
            "Transformations | P2 | Matrix for reflection in y=x",
        ],
        "templates": [
            {
                "name": "Template 1: Matrix Operations",
                "pattern": "A=[2 3; 1 4], B=[5 -1; 2 3], C=[1 0; 0 -1]: (a) A+B. (b) 2A-3B. (c) AB. (d) BA; AB=BA? (e) A². (f) (AB)C and A(BC).",
                "skills": "Matrix addition, scalar mult, matrix multiplication",
            },
            {
                "name": "Template 2: Determinants",
                "pattern": "(a) det [3 5; 2 4]. (b) det [a b; c d]. (c) det [2 -1 3; 1 4 0; -2 3 1]. (d) k for [2 k; 4 8] singular. (e) det(A)=3, det(B)=2: det(AB). (f) det(A⁻¹)=1/det(A).",
                "skills": "Determinant calculation, singularity, properties",
            },
            {
                "name": "Template 3: Inverse Matrices",
                "pattern": "(a) Inverse [3 2; 5 4]. (b) [2 -1; 4 3]. (c) Verify AA⁻¹=I. (d) Inverse [1 2 0; 0 1 3; 2 0 1]. (e) k for [2 k; 1 3] no inverse.",
                "skills": "Finding inverses, 2×2 and 3×3, verification",
            },
            {
                "name": "Template 4: Solving Linear Systems",
                "pattern": "Solve by matrices: (a) 2x+3y=7, x-y=1. (b) x+2y=5, 3x-y=7. (c) 2x+y+z=9, x-y+2z=5, 3x+2y-z=4. (d) Cramer for (a). (e) No solution, unique, infinite: conditions.",
                "skills": "Matrix equations, inverse, Cramer's rule",
            },
            {
                "name": "Template 5: Transformations",
                "pattern": "Matrix for: (a) Reflection in x-axis. (b) y-axis. (c) y=x. (d) Rotation 90° anticlockwise. (e) Enlargement scale 2. (f) Reflection in x then rotation 90°. (g) Image of (3,2) under (f).",
                "skills": "Transformation matrices, composition",
            },
        ],
    },
    "Vectors in 3D": {
        "subtopics": [
            "Vector Operations (in 3D)",
            "Scalar Product (dot product, angles)",
            "Vector Product (cross product, areas)",
            "Lines in 3D (vector equations)",
            "Planes (equations, intersections)",
        ],
        "learning_objectives": [
            "Represent vectors in 3D (i, j, k); magnitude and direction",
            "Scalar product a·b = |a||b|cos θ; vector product a×b",
            "Lines r = a + λb; planes r·n = d",
            "Find angles, distances, intersections",
        ],
        "exam_question_types": [
            "Operations | P2 | Add 3i+2j-k and i-3j+2k",
            "Scalar Product | P2 | Angle between two vectors",
            "Vector Product | P2 | Find a×b",
            "Lines | P2 | Equation of line through two points",
            "Planes | P2 | Equation of plane",
        ],
        "templates": [
            {
                "name": "Template 1: 3D Vector Operations",
                "pattern": "a=3i+2j-k, b=i-j+2k, c=2i+3k: (a) a+b. (b) 2a-3b. (c) |a|,|b|,|c|. (d) Unit vector in direction of a. (e) Vector from (1,2,3) to (4,-1,5).",
                "skills": "3D vector arithmetic, magnitude, unit vectors",
            },
            {
                "name": "Template 2: Scalar Product",
                "pattern": "a=2i+3j-k, b=i-2j+2k: (a) a·b. (b) Angle between a,b. (c) Show 3i+2j-k ⊥ i-j+k. (d) λ if 2i+λj-k ⊥ 3i-j+2k. (e) Angle between (1,2,2) and (2,-1,2). (f) Projection of a on b.",
                "skills": "Dot product, angles, perpendicularity",
            },
            {
                "name": "Template 3: Vector Product",
                "pattern": "a=i+2j+3k, b=2i-j+k: (a) a×b. (b) |a×b|. (c) Area of triangle O, A(1,2,3), B(2,-1,1). (d) a×b ⊥ a and b. (e) Unit vector ⊥ i+j and j+k. (f) a×b = -b×a.",
                "skills": "Cross product, areas, perpendicularity",
            },
            {
                "name": "Template 4: Lines in 3D",
                "pattern": "(a) Line through (2,-1,3) ∥ i+2j-k. (b) Line through (1,2,3) and (4,-1,5). (c) r=i+λ(2j+k) and r=2i+j+μ(i-k): intersect? (d) Intersection. (e) Angle between two lines. (f) Distance from (1,2,3) to line r=i+j+k+λ(2i-j).",
                "skills": "Line equations, intersections, angles, distances",
            },
            {
                "name": "Template 5: Planes in 3D",
                "pattern": "(a) Plane through (1,2,3), normal i+2j-k. (b) Plane through (1,0,-1), (2,1,0), (0,1,2). (c) Angle between r·(i+j+k)=3 and r·(2i-j+k)=5. (d) Line of intersection of x+2y-z=3 and 2x-y+z=1. (e) Distance (2,1,-1) to 2x-y+2z=6. (f) Reflection of (1,2,3) in x+y+z=6.",
                "skills": "Plane equations, angles, intersections, distances",
            },
        ],
    },
    "Summation of Series": {
        "subtopics": [
            "Method of Differences (telescoping series)",
            "Partial Sums (sum of first n terms)",
            "Standard Results (Σr, Σr², Σr³)",
        ],
        "learning_objectives": [
            "Use method of differences for summation",
            "Apply standard results; manipulate series algebraically",
            "Prove summation formulas",
        ],
        "exam_question_types": [
            "Method of Differences | P2 | Σ 1/(r(r+1))",
            "Standard Sums | P2 | Use Σr² = n(n+1)(2n+1)/6",
            "Proof | P2 | Prove Σr³ = [n(n+1)/2]²",
        ],
        "templates": [
            {
                "name": "Template 1: Method of Differences",
                "pattern": "(a) Show 1/(r(r+1)) = 1/r - 1/(r+1). (b) Hence Σ[r=1 to n] 1/(r(r+1)). (c) Σ[r=1 to 50]. (d) 1/(r(r+2)) partial fractions. (e) Hence Σ[r=1 to n] 1/(r(r+2)).",
                "skills": "Partial fractions, telescoping series",
            },
            {
                "name": "Template 2: Standard Summation Formulas",
                "pattern": "Given Σr, Σr²: (a) Σ[r=1 to 20] r. (b) Σ[r=1 to 15] r². (c) Σ[r=1 to n] (2r+1). (d) Σ[r=1 to n] (3r²-2r+1). (e) Σ[r=10 to 20] r².",
                "skills": "Using standard formulas, manipulation",
            },
            {
                "name": "Template 3: Proving Summation Formulas",
                "pattern": "(a) Prove by induction Σr = n(n+1)/2. (b) Prove Σr³ = [n(n+1)/2]². (c) 1²+3²+5²+...+(2n-1)² = n(2n-1)(2n+1)/3. (d) Σ(2r-1) = n². (e) Formula for Σr(r+1).",
                "skills": "Induction, algebraic proof",
            },
            {
                "name": "Template 4: Advanced Series",
                "pattern": "(a) Σ[r=1 to n] r(r+1). (b) Σ r²(r+1). (c) Σ 1/(r(r+1)(r+2)) = n(n+3)/[4(n+1)(n+2)]. (d) Σ r·2^r. (e) Σ[r=1 to ∞] 1/(r²+3r+2).",
                "skills": "Complex series, infinite series",
            },
            {
                "name": "Template 5: Applications",
                "pattern": "(a) Sum of squares of first n odd numbers. (b) Sum of cubes of first n naturals. (c) Σ r(r+1)(r+2). (d) 1×2+2×3+...+n(n+1). (e) Σ[r=1 to 100] (r³-r).",
                "skills": "Pattern recognition, application of formulas",
            },
        ],
    },
    "Numerical Methods": {
        "subtopics": [
            "Root Finding (interval bisection, iteration)",
            "Newton-Raphson (fast convergence)",
            "Numerical Integration (trapezium rule)",
            "Error Analysis (accuracy, convergence)",
        ],
        "learning_objectives": [
            "Locate roots by change of sign; use xₙ₊₁ = g(xₙ)",
            "Apply Newton-Raphson xₙ₊₁ = xₙ - f(xₙ)/f'(xₙ)",
            "Use trapezium rule; understand convergence and errors",
        ],
        "exam_question_types": [
            "Change of Sign | P1, P2 | Show root between 1 and 2",
            "Iteration | P2 | Use xₙ₊₁ = √(2+xₙ) to find root",
            "Newton-Raphson | P2 | Root of x³-2x-5=0",
            "Trapezium Rule | P1, P2 | Estimate ∫[0 to 2] √(1+x²) dx",
        ],
        "templates": [
            {
                "name": "Template 1: Locating Roots",
                "pattern": "(a) f(x)=x³-2x-5 has root between 2 and 3. (b) x=cos x has root in [0,π/2]. (c) Bisection twice. (d) Number of roots of x³-3x+1=0. (e) Locate each to nearest integer.",
                "skills": "Change of sign, interval bisection",
            },
            {
                "name": "Template 2: Iterative Methods",
                "pattern": "(a) Rearrange x²-3x+1=0 as x=g(x). (b) xₙ₊₁=(xₙ²+1)/3, x₀=1: x₁,x₂,x₃. (c) xₙ₊₁=√(3xₙ-1) converges. (d) x=cos x via xₙ₊₁=cos xₙ, x₀=0.5, 5 iters. (e) Which rearrangements converge?",
                "skills": "Rearrangement, iteration, convergence",
            },
            {
                "name": "Template 3: Newton-Raphson",
                "pattern": "(a) Derive NR formula. (b) x³-2x-5=0, x₀=2, 3 iters. (c) x=2 sin x, x₀=2. (d) e^x=3x via NR. (e) When does NR fail? (f) NR vs simple iteration.",
                "skills": "Newton-Raphson, rapid convergence",
            },
            {
                "name": "Template 4: Trapezium Rule",
                "pattern": "(a) State trapezium rule. (b) Estimate ∫[0 to 2] (1+x²) dx, 4 strips. (c) Exact value, % error. (d) ∫[1 to 3] ln x dx, 5 strips. (e) Error vs strips. (f) ∫[0 to π/2] √(sin x) dx.",
                "skills": "Trapezium rule, error analysis",
            },
            {
                "name": "Template 5: Mixed Applications",
                "pattern": "(a) x³=5: iteration and NR, compare. (b) Positive root of x³-3x-1=0 to 3 d.p. (c) ∫[0 to 1] e^(x²) dx. (d) tan x=x, smallest positive root. (e) √50 via NR on x²-50=0.",
                "skills": "Method selection, accuracy, applications",
            },
        ],
    },
    "Proof and Mathematical Induction": {
        "subtopics": [
            "Direct Proof (logical deduction)",
            "Proof by Contradiction (assume opposite, derive contradiction)",
            "Mathematical Induction (base case + inductive step)",
            "Induction Applications (series, divisibility, inequalities)",
        ],
        "learning_objectives": [
            "Construct logical proofs; use proof by contradiction",
            "Apply mathematical induction",
            "Prove summation formulas, divisibility, inequalities",
        ],
        "exam_question_types": [
            "Direct Proof | P2 | Prove n²+n is always even",
            "Contradiction | P2 | Prove √2 is irrational",
            "Induction - Series | P2 | Prove Σr = n(n+1)/2",
            "Induction - Divisibility | P2 | Prove 7^n-1 divisible by 6",
            "Induction - Inequality | P2 | Prove 2^n > n² for n≥5",
        ],
        "templates": [
            {
                "name": "Template 1: Direct Proof",
                "pattern": "Prove directly: (a) Sum of two evens is even. (b) Product of two odds is odd. (c) n²+n even for integer n. (d) n³-n divisible by 6. (e) If n² even then n even.",
                "skills": "Direct proof, logical reasoning",
            },
            {
                "name": "Template 2: Proof by Contradiction",
                "pattern": "Prove by contradiction: (a) √2 irrational. (b) Infinitely many primes. (c) √3 irrational. (d) If n² divisible by 3 then n divisible by 3. (e) log₂ 3 irrational.",
                "skills": "Contradiction method, indirect proof",
            },
            {
                "name": "Template 3: Induction - Summation",
                "pattern": "Prove by induction: (a) 1+2+...+n = n(n+1)/2. (b) 1²+2²+...+n² = n(n+1)(2n+1)/6. (c) 1³+...+n³ = [n(n+1)/2]². (d) 1+3+5+...+(2n-1) = n². (e) 2+4+...+2n = n(n+1).",
                "skills": "Mathematical induction, base case, inductive step",
            },
            {
                "name": "Template 4: Induction - Divisibility",
                "pattern": "Prove by induction: (a) 7^n-1 divisible by 6, n≥1. (b) 5^n-1 by 4. (c) n³+2n by 3. (d) 9^n-1 by 8. (e) 11^n-6 by 5.",
                "skills": "Divisibility proofs, induction",
            },
            {
                "name": "Template 5: Induction - Inequalities",
                "pattern": "Prove by induction: (a) 2^n > n, n≥1. (b) 2^n > n², n≥5. (c) n! > 2^n, n≥4. (d) (1+x)^n ≥ 1+nx, n≥1, x>-1 (Bernoulli). (e) 1+1/2+...+1/n < 2√n, n≥2.",
                "skills": "Inequality proofs, induction technique",
            },
        ],
    },
}


def get_part3_topic_keys():
    """Return topic names that have Part 3 expanded data."""
    return list(A_LEVEL_PURE_MATH_PART3.keys())
