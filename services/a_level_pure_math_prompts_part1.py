"""
A-Level Pure Mathematics – Expanded prompt data (Part 1).
From ZIMSEC A-Level-Pure-Math-Part1.md: Topics 1–8 (Polynomials through Binomial Theorem).
Provides learning_objectives, subtopics, exam_question_types, and question templates
for richer, more diverse question generation.
"""

# Topics 1–8 only. Part 2 will add Topics 9–12 (and Upper Sixth as needed).

A_LEVEL_PURE_MATH_PART1 = {
    "Polynomials": {
        "subtopics": [
            "Polynomial Operations (addition, subtraction, multiplication, division)",
            "Factorization (quadratic, cubic)",
            "Factor Theorem (finding factors, unknown coefficients)",
            "Remainder Theorem (finding remainders without division)",
        ],
        "learning_objectives": [
            "Carry out operations: +, -, ×, ÷ of polynomials",
            "Factorize quadratic polynomials (real factors, rational coefficients only)",
            "Use factor theorem to find factors",
            "Evaluate unknown coefficients using factor theorem",
            "Solve cubic equations when at least one rational root exists",
            "Apply remainder theorem",
        ],
        "exam_question_types": [
            "Basic Operations | P1, P2 | Add/multiply polynomials",
            "Factorization | P1, P2 | Factorize x² + 5x + 6",
            "Factor Theorem | P1, P2 | Find value of k if (x-2) is factor",
            "Division | P1, P2 | Divide x³ - 2x² + x - 3 by (x-1)",
            "Cubic Equations | P2 | Solve x³ - 6x² + 11x - 6 = 0",
        ],
        "templates": [
            {
                "name": "Template 1: Polynomial Operations",
                "pattern": "Given P(x) = 2x³ - 3x² + 4x - 1 and Q(x) = x² - 2x + 3. (a) Find P(x) + Q(x). (b) Find P(x) - 2Q(x). (c) Find P(x) × (x - 1). (d) Express P(x) in the form (x - 2)q(x) + r.",
                "skills": "Addition, subtraction, multiplication, division of polynomials",
            },
            {
                "name": "Template 2: Factor Theorem Application",
                "pattern": "(a) Given f(x) = x³ - 7x + 6, show that (x - 1) is a factor. (b) Hence factorize f(x) completely. (c) Solve x³ - 7x + 6 = 0. (d) g(x) = 2x³ + kx² - 5x + 3 has (x + 1) as a factor. Find k.",
                "skills": "Factor theorem, complete factorization, solving cubic equations",
            },
            {
                "name": "Template 3: Remainder Theorem",
                "pattern": "(a) Find remainder when P(x) = x³ - 4x² + 5x - 2 is divided by (x - 2). (b) Q(x) = 2x³ + ax² - 3x + b: remainder 4 when ÷ (x-1), -8 when ÷ (x+2). Find a and b. (c) Show (x - 3) is a factor of P(x) = x⁴ - 5x³ + 3x² + 9x - 18.",
                "skills": "Remainder theorem, simultaneous equations, factorization",
            },
            {
                "name": "Template 4: Cubic Factorization",
                "pattern": "(a) Solve x³ - 6x² + 11x - 6 = 0 by finding a rational root. (b) Factorize completely: 2x³ - x² - 13x - 6. (c) Find all roots of 4x³ + 8x² - x - 2 = 0. (d) f(x) = x³ + px² + qx + 6 has factors (x-1) and (x+2). Find p and q.",
                "skills": "Finding rational roots, complete factorization, solving equations",
            },
            {
                "name": "Template 5: Division of Polynomials",
                "pattern": "(a) Divide 3x⁴ - 2x³ + 5x² - 3x + 1 by (x² - x + 2). (b) Express x⁴ - 3x³ + 2x² + x - 5 in the form (x² - 2x + 1)Q(x) + ax + b. (c) When P(x) ÷ (x-2)(x+1), quotient x² + 3x + 1, remainder 5x - 2. Find P(x).",
                "skills": "Long division, quotient-remainder form",
            },
        ],
    },
    "Rational Functions": {
        "subtopics": [
            "Partial Fractions (linear factors, repeated factors)",
            "Improper Fractions (degree numerator ≥ denominator)",
            "Denominators: (ax+b)(cx+d), (ax+b)², (ax+b)(x²+c²)",
        ],
        "learning_objectives": [
            "Recall appropriate forms for partial fractions",
            "Decompose rational expressions into partial fractions",
            "Handle denominators: (ax+b)(cx+d)(ex+f), (ax+b)(cx+d)², (ax+b)(x²+c²)",
            "Deal with improper fractions (divide first if necessary)",
        ],
        "exam_question_types": [
            "Linear Factors | P1, P2 | Express (3x+1)/[(x+1)(x-2)] in partial fractions",
            "Repeated Factors | P1, P2 | (5x-2)/(x-1)²",
            "Quadratic Factor | P2 | (2x²+3)/[(x+1)(x²+4)]",
            "Improper Fractions | P2 | (x³+1)/(x²-1)",
        ],
        "templates": [
            {
                "name": "Template 1: Linear Distinct Factors",
                "pattern": "Express in partial fractions: (a) (5x-2)/[(x-1)(x+3)]. (b) (3x²+11x+5)/[(x+1)(x+2)(x-3)]. (c) (4x-7)/[(2x-1)(x+4)]. (d) Hence find ∫[(5x-2)/[(x-1)(x+3)]] dx.",
                "skills": "Partial fractions with distinct linear factors, integration application",
            },
            {
                "name": "Template 2: Repeated Linear Factors",
                "pattern": "(a) Express (7x+5)/(x-2)² in partial fractions. (b) (3x²-5x+2)/[(x+1)(x-1)²]. (c) Hence find ∫[(7x+5)/(x-2)²] dx. (d) Solve (7x+5)/(x-2)² = 3.",
                "skills": "Repeated factors, integration, equations",
            },
            {
                "name": "Template 3: Quadratic Factors",
                "pattern": "Express in partial fractions: (a) (5x²+2x+3)/[(x+1)(x²+1)]. (b) (3x²-x+7)/[(x-2)(x²+4)]. (c) Show ∫₀¹ [(5x²+2x+3)/[(x+1)(x²+1)]] dx = ln 2 + π/4.",
                "skills": "Irreducible quadratic factors, integration",
            },
            {
                "name": "Template 4: Improper Fractions",
                "pattern": "(a) Express (x³+2x²-3x+1)/(x²-1) as polynomial + proper fraction. (b) Hence in partial fractions. (c) Find ∫[(x³+2x²-3x+1)/(x²-1)] dx. (d) Sketch y = (x³+2x²-3x+1)/(x²-1), showing asymptotes.",
                "skills": "Improper fractions, division, partial fractions, graphing",
            },
            {
                "name": "Template 5: Applications",
                "pattern": "(a) Express f(x) = (6x+5)/[(2x-1)(x+2)] in partial fractions. (b) Hence find derivative of f(x). (c) Solve f(x) = 2. (d) Use partial fractions to show Σ[r=1 to n] 1/(r(r+1)) = n/(n+1).",
                "skills": "Partial fractions, differentiation, equations, summation",
            },
        ],
    },
    "Indices, Surds and Logarithms": {
        "subtopics": [
            "Laws of Indices (rational, negative, zero)",
            "Surds (simplification, rationalization)",
            "Exponential Functions (growth and decay)",
            "Logarithms (laws, equations)",
            "Change of Base",
        ],
        "learning_objectives": [
            "Understand rational indices (positive, negative, zero)",
            "Recall and use rules of indices",
            "Simplify surds: √(ab) = √a×√b, √(a/b) = √a/√b; rationalize denominators",
            "Understand logarithm-index relationship; recall and use laws of logarithms",
            "Sketch log and exponential graphs; exponential growth/decay",
            "Solve aˣ = b using logarithms; linearize relationships using logs",
        ],
        "exam_question_types": [
            "Indices | P1 | Simplify (8^(2/3))/(4^(3/2))",
            "Surds | P1 | Rationalize 3/(2+√5)",
            "Exponential Equations | P1, P2 | Solve 2^(3x-1) = 16",
            "Logarithms | P1, P2 | Solve log₂(x-3) + log₂(x+1) = 3",
            "Linearization | P2 | y = abˣ, plot to find a, b",
        ],
        "templates": [
            {
                "name": "Template 1: Laws of Indices",
                "pattern": "Simplify in index form: (a) 2⁵×2³÷2⁴. (b) (3²)⁴×3⁻⁵. (c) 16^(3/4). (d) 27^(-2/3). (e) Solve 4ˣ×2^(x+3) = 8^(2x-1).",
                "skills": "Index laws, negative/fractional indices, equations",
            },
            {
                "name": "Template 2: Surds",
                "pattern": "(a) Simplify √50 + 3√8 - 2√18. (b) Expand (2+√3)(3-√3). (c) Rationalize 6/(3-√2). (d) Solve (√x+1)² = 5+2√x. (e) Express (3+√2)/(1-√2) in form a+b√2.",
                "skills": "Surd operations, rationalization, equations",
            },
            {
                "name": "Template 3: Exponential Functions",
                "pattern": "(a) Sketch y = 2ˣ and y = 2⁻ˣ. (b) Solve 3^(2x-1) = 27. (c) P = 1000×1.05ᵗ: initial, after 10 years, when P = 2000. (d) M = M₀e^(-0.03t): half-life?",
                "skills": "Exponential graphs, growth/decay models",
            },
            {
                "name": "Template 4: Logarithms – Laws & Equations",
                "pattern": "(a) Simplify 2log₃(9) - log₃(27) + log₃(81). (b) Solve log₄(x+3) + log₄(x-1) = 2. (c) Solve log₂(x) - log₂(x-3) = 1. (d) log_a(2)=0.301: find log_a(8), log_a(1/2). (e) Prove log_a(b) = 1/log_b(a).",
                "skills": "Log laws, solving log equations, properties",
            },
            {
                "name": "Template 5: Linearization",
                "pattern": "y = abˣ. Table: x=0,1,2,3 → y=5,10,20,40. (a) Show exponential. (b) log y = log a + x log b. (c) Plot log y vs x. (d) Gradient and intercept. (e) Find a and b.",
                "skills": "Logarithmic transformation, straight line graphs",
            },
        ],
    },
    "Quadratic Functions": {
        "subtopics": [
            "Quadratic Equations (factorization, formula, completing square)",
            "Discriminant (nature of roots)",
            "Completing the Square (max/min values)",
            "Quadratic Inequalities",
            "Simultaneous Equations (one linear, one quadratic)",
        ],
        "learning_objectives": [
            "Distinguish identities and equations; complete the square",
            "Determine extreme values; solve quadratics (factor, formula, complete square)",
            "Use discriminant b² - 4ac for number of real roots",
            "Solve simultaneous (one linear, one quadratic); quadratic inequalities",
            "Recognize equations quadratic in another function",
        ],
        "exam_question_types": [
            "Completing Square | P1, P2 | Express x² - 6x + 11 as (x-a)² + b",
            "Discriminant | P1, P2 | Find k so kx² + 3x + 1 = 0 has equal roots",
            "Simultaneous | P2 | Solve y = x² - 3, y = 2x + 1",
            "Inequalities | P2 | Solve x² - 5x + 6 > 0",
            "Max/Min | P2 | Find maximum of 8 - 2x - x²",
        ],
        "templates": [
            {
                "name": "Template 1: Completing the Square",
                "pattern": "f(x) = x² - 8x + 19. (a) Express as (x-a)² + b. (b) State minimum and x where it occurs. (c) Solve x² - 8x + 19 = 3. (d) Sketch y = f(x). (e) Range of f for x ≥ 2.",
                "skills": "Completing square, min/max, solving, graphing",
            },
            {
                "name": "Template 2: Discriminant Applications",
                "pattern": "(a) Discriminant of 2x² - 3x + 5 = 0; nature of roots? (b) kx² + 4x + k = 0 has equal roots: find k. (c) y = mx + 3 meets y = x² + 2x - 1: find m for two intersections, tangent, no intersection. (d) Show x² + px + q has real roots if p² ≥ 4q.",
                "skills": "Discriminant, nature of roots, tangency",
            },
            {
                "name": "Template 3: Simultaneous Equations",
                "pattern": "Solve: (a) y = x² - 2x + 3, y = x + 5. (b) x² + y² = 25, y = x + 1. (c) xy = 12, x + y = 7. (d) 2x² + 3y² = 35, x - y = 1.",
                "skills": "Substitution, elimination for quadratic systems",
            },
            {
                "name": "Template 4: Quadratic Inequalities",
                "pattern": "Solve: (a) x² - 7x + 10 > 0. (b) 2x² + 5x - 3 ≤ 0. (c) (x-1)(x+3) < 5. (d) x² < 9. (e) x for which x² - 4x + 3 < 2x - 1.",
                "skills": "Quadratic inequalities, interval notation",
            },
            {
                "name": "Template 5: Quadratic in Disguise",
                "pattern": "Solve: (a) x⁴ - 5x² + 4 = 0. (b) 2(2ˣ)² - 9(2ˣ) + 4 = 0. (c) sin²θ + 3sinθ - 4 = 0, 0° ≤ θ ≤ 360°. (d) e^(2x) - 6eˣ + 8 = 0.",
                "skills": "Substitution to reduce to quadratic form",
            },
        ],
    },
    "Functions": {
        "subtopics": [
            "Function Concepts (domain, range, one-one, inverse)",
            "Function Notation (f(x), f⁻¹(x), fg(x))",
            "Transformations (translations, reflections, stretches)",
            "Composite Functions (f(g(x)), g(f(x)))",
            "Modulus Function |f(x)|",
        ],
        "learning_objectives": [
            "Understand function, domain, range, one-one, inverse, composition",
            "Illustrate f(x) and f⁻¹(x) graphically",
            "Use transformations: y = af(x), y = f(x)+a, y = f(x+a), y = f(ax)",
            "Express in terms of translations, reflections, stretches; recognize y = af(x+b)",
            "Understand relationship between y = f(x) and y = |f(x)|",
        ],
        "exam_question_types": [
            "Domain/Range | P1, P2 | State domain and range of f(x) = √(x-2)",
            "Inverse | P2 | Find f⁻¹(x) for f(x) = (2x+1)/(x-3)",
            "Composition | P2 | Find fg(x) and gf(x)",
            "Transformations | P2 | Describe transformation from f(x) to 2f(x-3)+1",
            "Modulus | P2 | Sketch y = |2x - 3|",
        ],
        "templates": [
            {
                "name": "Template 1: Domain & Range",
                "pattern": "State domain and range: (a) f(x) = √(4-x²). (b) g(x) = 1/(x²-9). (c) h(x) = ln(x-2). (d) k(x) = (x+1)/(x-3). (e) Sketch to illustrate.",
                "skills": "Domain/range identification, graphing",
            },
            {
                "name": "Template 2: Inverse Functions",
                "pattern": "(a) f(x) = 3x - 5: find f⁻¹(x), show ff⁻¹(x) = x. (b) g(x) = (2x+1)/(x-3), x≠3: find g⁻¹(x). (c) h(x) = x² - 4x + 5, x≥2: find h⁻¹(x). (d) Sketch y = h(x) and y = h⁻¹(x) with y = x.",
                "skills": "Finding inverses, domain restrictions, graphing",
            },
            {
                "name": "Template 3: Composite Functions",
                "pattern": "f(x) = 2x + 3, g(x) = x² - 1. (a) Find fg(x) and gf(x). (b) Are fg and gf the same? (c) Solve fg(x) = 15. (d) Find (f⁻¹g)(x). (e) h(x) = x + 4: find fgh(2).",
                "skills": "Composition, solving composite equations",
            },
            {
                "name": "Template 4: Transformations",
                "pattern": "Given y = f(x). Sketch: (a) y = f(x) + 3. (b) y = f(x - 2). (c) y = 2f(x). (d) y = f(2x). (e) y = -f(x). (f) y = f(-x). (g) y = 2f(x-1) + 3.",
                "skills": "Function transformations, graph sketching",
            },
            {
                "name": "Template 5: Modulus Functions",
                "pattern": "(a) Sketch y = |x - 3|. (b) Sketch y = |2x + 1|. (c) Solve |x - 3| = 5. (d) Solve |2x + 1| < 7. (e) Sketch y = f(x) for f(x) = x² - 4, then y = |f(x)|. (f) Solve |x² - 4| = 3.",
                "skills": "Modulus concepts, equations, inequalities",
            },
        ],
    },
    "Coordinate Geometry": {
        "subtopics": [
            "Straight Lines (gradient, equations, parallel/perpendicular)",
            "Circles (standard form, center, radius)",
            "Parametric Equations",
            "Linearization (reducing to linear form)",
        ],
        "learning_objectives": [
            "Use Cartesian coordinates; graph-equation relationships",
            "Calculate distance, gradient, midpoint; line equations (2 points, point + gradient)",
            "Use ax + by + c = 0, y = mx + c; parallel/perpendicular gradient relationships",
            "Reduce equations to linear form; circle (x-a)² + (y-b)² = r², center and radius",
            "Use parametric representations",
        ],
        "exam_question_types": [
            "Line Equations | P1, P2 | Equation through (2,3) and (5,9)",
            "Parallel/Perpendicular | P2 | Line parallel to y = 3x + 1 through (4,-2)",
            "Circles | P2 | Center and radius of x² + y² - 6x + 4y = 12",
            "Parametric | P2 | Eliminate parameter from x = 2t, y = t²",
            "Linearization | P2 | Plot to find constants in y = axⁿ",
        ],
        "templates": [
            {
                "name": "Template 1: Straight Lines",
                "pattern": "(a) Equation through (3,-2) and (7,6). (b) Line through (4,5), gradient -2. (c) Express 3x - 4y + 12 = 0 as y = mx + c. (d) x- and y-intercepts. (e) Perpendicular distance from (1,2) to line.",
                "skills": "Line equations, intercepts, distance",
            },
            {
                "name": "Template 2: Parallel & Perpendicular",
                "pattern": "L₁: 2x + 3y = 6. (a) Gradient of L₁. (b) Line parallel to L₁ through (3,-1). (c) Line perpendicular to L₁ through (0,5). (d) Where parallel and perpendicular meet. (e) Show three lines form right triangle; area.",
                "skills": "Gradients, parallel/perpendicular, intersections",
            },
            {
                "name": "Template 3: Circle Equations",
                "pattern": "(a) Center and radius: x² + y² = 25. (b) (x-3)² + (y+2)² = 16. (c) x² + y² - 6x + 8y = 0 in standard form. (d) Circle center (2,-1), radius 5. (e) Circle through (0,0), (6,0), (0,8): find equation.",
                "skills": "Circle equations, completing square",
            },
            {
                "name": "Template 4: Lines & Circles",
                "pattern": "C: x² + y² = 25, L: y = x + k. (a) Show intersections satisfy x² + (x+k)² = 25. (b) Range of k for two intersections. (c) k for tangency. (d) Tangents from (5,5) to circle. (e) Chord length when k = 0.",
                "skills": "Intersection, discriminant, tangency",
            },
            {
                "name": "Template 5: Parametric Curves",
                "pattern": "C: x = 3t, y = 2/t, t≠0. (a) Cartesian equation. (b) Sketch. (c) Gradient at t = 2 (dy/dx = (dy/dt)/(dx/dt)). (d) Tangent at t = 1. (e) Normal at t = 2.",
                "skills": "Parametric equations, Cartesian form, calculus",
            },
        ],
    },
    "Sequences and Series": {
        "subtopics": [
            "Sequences (recursive, explicit)",
            "Arithmetic Progressions (nth term, sum)",
            "Geometric Progressions (nth term, sum, sum to infinity)",
            "Sigma Notation",
            "Convergence",
        ],
        "learning_objectives": [
            "Understand Uₙ = n², Uₙ₊₁ = 2Uₙ; periodicity, oscillation, convergence, divergence",
            "Use Σ notation; recognize AP and GP",
            "Use nth term and sum of first n terms; convergence for GP (|r| < 1); sum to infinity",
        ],
        "exam_question_types": [
            "AP nth term | P1 | 3rd term = 7, 8th = 22: find first term",
            "AP Sum | P1 | Sum first 50 terms of 2 + 5 + 8 + ...",
            "GP nth term | P1, P2 | 2, 6, 18,...: 10th term",
            "GP Sum to ∞ | P2 | Sum 1 + 1/3 + 1/9 + ...",
            "Mixed | P2 | Prove sum of AP then GP",
        ],
        "templates": [
            {
                "name": "Template 1: Arithmetic Progressions",
                "pattern": "AP: first term a, common difference d. (a) 5th = 17, 12th = 38: find a, d. (b) Sum of first 20 terms. (c) Which term = 73? (d) Sum of first n terms = 480: find n. (e) Three numbers in AP: sum 24, product 440.",
                "skills": "AP formulas, solving systems",
            },
            {
                "name": "Template 2: Geometric Progressions",
                "pattern": "GP: first term a, ratio r. (a) 3rd = 12, 6th = 96: find a, r. (b) 10th term. (c) Sum of first 8 terms. (d) Convergent? If yes, sum to infinity. (e) Insert 3 geometric means between 2 and 162.",
                "skills": "GP formulas, convergence",
            },
            {
                "name": "Template 3: Sum to Infinity",
                "pattern": "(a) Sum 1 + 1/2 + 1/4 + 1/8 + ... (b) Sum 3 - 1 + 1/3 - 1/9 + ... (c) Express 0.777... as fraction using GP. (d) GP: sum to ∞ = 9, first term = 3: find r. (e) Show Σ[n=1 to ∞] (2/3)ⁿ = 2.",
                "skills": "Infinite GP, recurring decimals",
            },
            {
                "name": "Template 4: Sigma Notation",
                "pattern": "Evaluate: (a) Σ[r=1 to 10] r. (b) Σ[r=1 to 20] (2r-1). (c) Σr² = n(n+1)(2n+1)/6 given: find Σ[r=1 to 15] r². (d) 2+4+6+...+40 in sigma notation. (e) Simplify Σ[r=1 to n] (3r+2).",
                "skills": "Sigma notation, summation formulas",
            },
            {
                "name": "Template 5: Mixed Sequences",
                "pattern": "(a) U₁ = 2, Uₙ₊₁ = 3Uₙ - 1: find U₂, U₃, U₄. (b) Converge? Limit? (c) Uₙ = (2n+1)/(n+3): lim Uₙ. (d) Sum 1+3+5+...+99. (e) Sum 1+3+9+27+...+3⁸.",
                "skills": "Recursive sequences, limits, mixed series",
            },
        ],
    },
    "Binomial Theorem": {
        "subtopics": [
            "Binomial Expansion (a+b)ⁿ, n positive integer",
            "Binomial Coefficients (nCr, n!, Pascal's triangle)",
            "General Term (finding specific terms)",
            "Fractional/Negative Indices (1+x)ⁿ, |x|<1, n rational",
        ],
        "learning_objectives": [
            "Use (a+b)ⁿ for positive integer n; (1+x)ⁿ for rational n, |x| < 1",
            "Use n! and C(n,r); find general term; binomial approximations",
        ],
        "exam_question_types": [
            "Integer Index | P1 | Expand (2x - 3)⁴",
            "Coefficients | P1 | Coefficient of x³ in (1+2x)⁶",
            "Fractional Index | P2 | First 4 terms of (1+x)^(1/2)",
            "Approximation | P2 | Approximate (1.02)⁵ using binomial",
            "Conditions | P2 | Range of x for validity",
        ],
        "templates": [
            {
                "name": "Template 1: Positive Integer Index",
                "pattern": "(a) Expand (x+2)⁵. (b) Coefficient of x³ in (2x-1)⁶. (c) Expand (1+3x)⁴; hence (1.03)⁴ to 4 d.p. (d) (2-x)⁷: constant term, coefficient of x⁴. (e) Term independent of x in (x² + 1/x)⁶.",
                "skills": "Binomial expansion, specific terms",
            },
            {
                "name": "Template 2: Binomial Coefficients",
                "pattern": "(a) Calculate C(8,3). (b) Show C(n,r) = C(n,n-r). (c) Solve C(n,2) = 28. (d) (1+x)ⁿ: coefficients of x² and x³ equal. Find n. (e) Prove C(n,r) + C(n,r+1) = C(n+1,r+1).",
                "skills": "Combinatorics, properties",
            },
            {
                "name": "Template 3: Rational Index Expansion",
                "pattern": "(a) First 4 terms of (1+x)^(1/2). (b) Validity range. (c) Estimate √1.04 to 4 d.p. (d) First 3 terms of (1-2x)⁻¹. (e) Hence 1/0.98 approximately.",
                "skills": "Fractional/negative indices, validity, approximation",
            },
            {
                "name": "Template 4: Combined Expansions",
                "pattern": "(a) Expand (1+x)⁵ up to x³. (b) (1-2x)⁴ up to x³. (c) First 3 terms of (1+x)⁵(1-2x)⁴. (d) Coefficient of x² in (2+x)³(1-x)⁵. (e) Validity of (4+x)^(1/2)?",
                "skills": "Product of expansions, validity",
            },
            {
                "name": "Template 5: Applications",
                "pattern": "(a) Use binomial to prove (1.001)^1000 > 2. (b) Expand √(1+x) up to x³. (c) Hence √1.02 approximately. (d) Percentage error. (e) (1+x)ⁿ ≈ 1+5x+10x² for small x: find n.",
                "skills": "Binomial applications, approximation, errors",
            },
        ],
    },
}


def get_part1_topic_keys():
    """Return topic names that have Part 1 expanded data."""
    return list(A_LEVEL_PURE_MATH_PART1.keys())
