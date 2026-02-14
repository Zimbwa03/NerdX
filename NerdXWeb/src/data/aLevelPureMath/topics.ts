// ZIMSEC A Level Pure Mathematics Topics Data (Code: 6042)
// Comprehensive coverage of the entire ZIMSEC A Level Pure Mathematics syllabus
// Using DeepSeek for AI-powered question generation

export interface ALevelPureMathTopic {
    id: string;
    name: string;
    description: string;
    learningObjectives: string[];
    keyFormulas?: string[];
    difficulty: 'Lower Sixth' | 'Upper Sixth';
    paperRelevance: 'Paper 1' | 'Paper 2' | 'Both';
}

// Complete ZIMSEC A Level Pure Mathematics Topics
export const aLevelPureMathTopics: ALevelPureMathTopic[] = [
    // ============================================
    // LOWER SIXTH (Form 5) - Topics 1-12
    // ============================================
    {
        id: 'polynomials',
        name: 'Polynomials',
        description: 'Polynomial operations, factor theorem, remainder theorem, and roots of equations',
        difficulty: 'Lower Sixth',
        paperRelevance: 'Paper 1',
        learningObjectives: [
            'Add, subtract, multiply and divide polynomials',
            'Apply the Factor Theorem: f(a) = 0 ⟹ (x - a) is a factor',
            'Apply the Remainder Theorem: f(a) = remainder when f(x) ÷ (x - a)',
            'Find factors and roots of polynomial equations up to degree 4',
            'Solve polynomial equations using factorisation',
            'Understand the relationship between roots and coefficients'
        ],
        keyFormulas: [
            'Factor Theorem: (x - a) is a factor of f(x) if f(a) = 0',
            'Remainder Theorem: f(x) ÷ (x - a) has remainder f(a)',
            'Sum of roots: α + β = -b/a for ax² + bx + c = 0',
            'Product of roots: αβ = c/a for ax² + bx + c = 0'
        ]
    },
    {
        id: 'rational_functions',
        name: 'Rational Functions',
        description: 'Properties of rational functions, asymptotes, and partial fractions',
        difficulty: 'Lower Sixth',
        paperRelevance: 'Paper 1',
        learningObjectives: [
            'Decompose rational functions into partial fractions',
            'Handle proper and improper fractions',
            'Identify vertical and horizontal asymptotes',
            'Sketch graphs of rational functions',
            'Solve equations involving rational expressions',
            'Apply partial fractions to integration problems'
        ],
        keyFormulas: [
            'Linear factors: A/(x-a) + B/(x-b)',
            'Repeated linear: A/(x-a) + B/(x-a)²',
            'Irreducible quadratic: (Ax+B)/(x²+px+q)',
            'Improper fractions: Divide first, then decompose remainder'
        ]
    },
    {
        id: 'indices_surds_logs',
        name: 'Indices, Surds and Logarithms',
        description: 'Laws of indices, manipulation of surds, and logarithmic functions',
        difficulty: 'Lower Sixth',
        paperRelevance: 'Paper 1',
        learningObjectives: [
            'Apply laws of indices including fractional and negative exponents',
            'Simplify expressions involving surds',
            'Rationalise denominators with surds',
            'Convert between exponential and logarithmic forms',
            'Apply laws of logarithms to simplify expressions',
            'Solve exponential and logarithmic equations',
            'Work with natural logarithms (ln) and exponential function (e)'
        ],
        keyFormulas: [
            'aᵐ × aⁿ = aᵐ⁺ⁿ, aᵐ ÷ aⁿ = aᵐ⁻ⁿ, (aᵐ)ⁿ = aᵐⁿ',
            'a⁰ = 1, a⁻ⁿ = 1/aⁿ, a^(m/n) = ⁿ√(aᵐ)',
            'logₐ(xy) = logₐx + logₐy',
            'logₐ(x/y) = logₐx - logₐy',
            'logₐ(xⁿ) = n·logₐx',
            'logₐb = logc b / logc a (change of base)',
            'y = aˣ ⟺ x = logₐy'
        ]
    },
    {
        id: 'quadratic_functions',
        name: 'Quadratic Functions',
        description: 'Quadratic equations, completing the square, nature of roots, and graphs',
        difficulty: 'Lower Sixth',
        paperRelevance: 'Paper 1',
        learningObjectives: [
            'Solve quadratic equations by factorisation, formula, and completing the square',
            'Complete the square to find vertex form',
            'Analyse the discriminant to determine nature of roots',
            'Sketch quadratic graphs showing key features',
            'Solve quadratic inequalities',
            'Form quadratic equations given the roots',
            'Solve simultaneous equations (one linear, one quadratic)'
        ],
        keyFormulas: [
            'x = (-b ± √(b² - 4ac)) / 2a',
            'Discriminant Δ = b² - 4ac',
            'Δ > 0: two distinct real roots',
            'Δ = 0: one repeated real root',
            'Δ < 0: no real roots (complex roots)',
            'Vertex: (-b/2a, f(-b/2a))'
        ]
    },
    {
        id: 'functions',
        name: 'Functions',
        description: 'Domain, range, composite functions, inverse functions, and transformations',
        difficulty: 'Lower Sixth',
        paperRelevance: 'Paper 1',
        learningObjectives: [
            'Define function, domain, range, and mapping',
            'Determine if a mapping is a function (one-to-one, many-to-one)',
            'Find composite functions fg(x) and gf(x)',
            'Find inverse functions f⁻¹(x)',
            'Apply transformations: translations, reflections, stretches',
            'Sketch graphs of transformed functions',
            'Understand modulus function |f(x)|'
        ],
        keyFormulas: [
            'f(g(x)) = (f ∘ g)(x) - composite function',
            'f(f⁻¹(x)) = x = f⁻¹(f(x)) - inverse property',
            'y = f(x) + a: translate a units vertically',
            'y = f(x + a): translate a units left',
            'y = af(x): vertical stretch, factor a',
            'y = f(ax): horizontal stretch, factor 1/a',
            'y = -f(x): reflect in x-axis',
            'y = f(-x): reflect in y-axis'
        ]
    },
    {
        id: 'coordinate_geometry',
        name: 'Coordinate Geometry',
        description: 'Straight lines, circles, intersection of curves, and parametric equations',
        difficulty: 'Lower Sixth',
        paperRelevance: 'Paper 1',
        learningObjectives: [
            'Find gradient, distance, and midpoint between points',
            'Write equations of lines in various forms',
            'Find equations of parallel and perpendicular lines',
            'Write and manipulate circle equations',
            'Find intersection points of lines and curves',
            'Understand and use parametric equations',
            'Convert between parametric and Cartesian forms'
        ],
        keyFormulas: [
            'Gradient: m = (y₂ - y₁)/(x₂ - x₁)',
            'Distance: d = √((x₂-x₁)² + (y₂-y₁)²)',
            'Midpoint: M = ((x₁+x₂)/2, (y₁+y₂)/2)',
            'y - y₁ = m(x - x₁) - point-slope form',
            'y = mx + c - slope-intercept form',
            'Perpendicular: m₁ × m₂ = -1',
            'Circle: (x-a)² + (y-b)² = r²',
            'Parametric: x = f(t), y = g(t)'
        ]
    },
    {
        id: 'sequences_series',
        name: 'Sequences and Series',
        description: 'Arithmetic progressions, geometric progressions, and sigma notation',
        difficulty: 'Lower Sixth',
        paperRelevance: 'Paper 1',
        learningObjectives: [
            'Find nth term and sum of arithmetic progressions',
            'Find nth term and sum of geometric progressions',
            'Determine convergence of infinite geometric series',
            'Use sigma notation (Σ) for series',
            'Apply standard summation formulae',
            'Solve problems involving AP and GP applications'
        ],
        keyFormulas: [
            'AP: uₙ = a + (n-1)d',
            'AP: Sₙ = n/2[2a + (n-1)d] = n/2(a + l)',
            'GP: uₙ = arⁿ⁻¹',
            'GP: Sₙ = a(1 - rⁿ)/(1 - r), r ≠ 1',
            'GP: S∞ = a/(1 - r), |r| < 1',
            'Σ(r=1 to n) r = n(n+1)/2',
            'Σ(r=1 to n) r² = n(n+1)(2n+1)/6'
        ]
    },
    {
        id: 'binomial_theorem',
        name: 'Binomial Theorem',
        description: 'Binomial expansion for positive and negative/fractional indices',
        difficulty: 'Lower Sixth',
        paperRelevance: 'Paper 1',
        learningObjectives: [
            'Expand (a + b)ⁿ for positive integer n',
            'Find specific terms in binomial expansions',
            'Use Pascals triangle and nCr notation',
            'Expand (1 + x)ⁿ for any rational n (|x| < 1)',
            'Find range of validity for expansions',
            'Apply binomial expansion to approximations'
        ],
        keyFormulas: [
            '(a + b)ⁿ = Σ(r=0 to n) ⁿCᵣ aⁿ⁻ʳbʳ',
            'ⁿCᵣ = n!/(r!(n-r)!)',
            '(1 + x)ⁿ = 1 + nx + n(n-1)x²/2! + ...',
            'General term: ⁿCᵣ aⁿ⁻ʳbʳ (r+1)th term',
            'Valid for |x| < 1 when n is not a positive integer'
        ]
    },
    {
        id: 'trigonometry_basic',
        name: 'Trigonometry (Identities & Equations)',
        description: 'Trigonometric identities, equations, and compound angle formulae',
        difficulty: 'Lower Sixth',
        paperRelevance: 'Paper 1',
        learningObjectives: [
            'Use fundamental identities: sin²θ + cos²θ = 1',
            'Apply double angle formulae',
            'Apply compound angle formulae',
            'Express a·sinθ + b·cosθ in R·sin(θ + α) form',
            'Solve trigonometric equations in given intervals',
            'Sketch graphs of trigonometric functions',
            'Apply factor formulae for sums and products'
        ],
        keyFormulas: [
            'sin²θ + cos²θ = 1',
            '1 + tan²θ = sec²θ',
            '1 + cot²θ = csc²θ',
            'sin(A ± B) = sinA·cosB ± cosA·sinB',
            'cos(A ± B) = cosA·cosB ∓ sinA·sinB',
            'tan(A ± B) = (tanA ± tanB)/(1 ∓ tanA·tanB)',
            'sin2A = 2sinA·cosA',
            'cos2A = cos²A - sin²A = 2cos²A - 1 = 1 - 2sin²A'
        ]
    },
    {
        id: 'differentiation_basic',
        name: 'Differentiation',
        description: 'First principles, rules of differentiation, and applications',
        difficulty: 'Lower Sixth',
        paperRelevance: 'Paper 1',
        learningObjectives: [
            'Differentiate from first principles',
            'Apply power rule, product rule, quotient rule, chain rule',
            'Differentiate trigonometric, exponential, and logarithmic functions',
            'Find equations of tangents and normals',
            'Determine stationary points and their nature',
            'Solve optimization problems',
            'Find rates of change and related rates problems'
        ],
        keyFormulas: [
            'dy/dx = lim(h→0) [f(x+h) - f(x)]/h',
            'd/dx(xⁿ) = nxⁿ⁻¹',
            'd/dx(eˣ) = eˣ, d/dx(aˣ) = aˣ ln(a)',
            'd/dx(ln x) = 1/x',
            'd/dx(sin x) = cos x, d/dx(cos x) = -sin x',
            'Product: d/dx(uv) = u·dv/dx + v·du/dx',
            'Quotient: d/dx(u/v) = (v·du/dx - u·dv/dx)/v²',
            'Chain: dy/dx = dy/du × du/dx'
        ]
    },
    {
        id: 'applications_differentiation',
        name: 'Applications of Differentiation',
        description: 'Curve sketching, optimization, rates of change, and small changes',
        difficulty: 'Lower Sixth',
        paperRelevance: 'Paper 1',
        learningObjectives: [
            'Determine increasing and decreasing intervals',
            'Classify stationary points using first and second derivatives',
            'Sketch curves showing all key features',
            'Solve maximum/minimum problems in context',
            'Apply differentiation to rates of change',
            'Use small increments: δy ≈ (dy/dx)δx',
            'Determine convexity and points of inflection'
        ],
        keyFormulas: [
            'Stationary point: dy/dx = 0',
            'd²y/dx² > 0: minimum, d²y/dx² < 0: maximum',
            'd²y/dx² = 0: possible inflection point',
            'δy ≈ (dy/dx)·δx for small changes',
            'Percentage error ≈ (δy/y) × 100%'
        ]
    },
    {
        id: 'integration_basic',
        name: 'Integration',
        description: 'Indefinite and definite integrals, area under curves, and basic techniques',
        difficulty: 'Lower Sixth',
        paperRelevance: 'Paper 1',
        learningObjectives: [
            'Understand integration as reverse of differentiation',
            'Integrate polynomial, trigonometric, exponential functions',
            'Evaluate definite integrals',
            'Calculate areas under curves and between curves',
            'Apply integration by substitution',
            'Integrate using standard results',
            'Calculate volumes of revolution'
        ],
        keyFormulas: [
            '∫xⁿ dx = xⁿ⁺¹/(n+1) + C, n ≠ -1',
            '∫1/x dx = ln|x| + C',
            '∫eˣ dx = eˣ + C',
            '∫sin x dx = -cos x + C',
            '∫cos x dx = sin x + C',
            '∫sec²x dx = tan x + C',
            'Area = ∫[a to b] y dx',
            'Volume = π∫[a to b] y² dx (rotation about x-axis)'
        ]
    },

    // ============================================
    // UPPER SIXTH (Form 6) - Topics 13-24
    // ============================================
    {
        id: 'further_trigonometry',
        name: 'Further Trigonometry',
        description: 'Inverse trig functions, general solutions, and small angle approximations',
        difficulty: 'Upper Sixth',
        paperRelevance: 'Paper 1',
        learningObjectives: [
            'Use inverse trigonometric functions and their properties',
            'Find general solutions of trigonometric equations',
            'Apply half-angle formulae',
            't-substitution: t = tan(θ/2)',
            'Use small angle approximations: sin θ ≈ θ, cos θ ≈ 1 - θ²/2',
            'Prove trigonometric identities',
            'Solve equations involving multiple angles'
        ],
        keyFormulas: [
            'sin⁻¹x: domain [-1,1], range [-π/2, π/2]',
            'cos⁻¹x: domain [-1,1], range [0, π]',
            'tan⁻¹x: domain ℝ, range (-π/2, π/2)',
            't = tan(θ/2): sin θ = 2t/(1+t²), cos θ = (1-t²)/(1+t²)',
            'sin θ ≈ θ, tan θ ≈ θ, cos θ ≈ 1 - θ²/2 (radians, θ small)'
        ]
    },
    {
        id: 'hyperbolic_functions',
        name: 'Hyperbolic Functions',
        description: 'Definitions, properties, graphs, and inverse hyperbolic functions',
        difficulty: 'Upper Sixth',
        paperRelevance: 'Paper 1',
        learningObjectives: [
            'Define sinh, cosh, tanh and their inverses',
            'Sketch graphs of hyperbolic functions',
            'Prove and use hyperbolic identities',
            'Differentiate and integrate hyperbolic functions',
            'Solve equations involving hyperbolic functions',
            'Express inverse hyperbolic functions in logarithmic form'
        ],
        keyFormulas: [
            'sinh x = (eˣ - e⁻ˣ)/2',
            'cosh x = (eˣ + e⁻ˣ)/2',
            'tanh x = sinh x / cosh x',
            'cosh²x - sinh²x = 1',
            'd/dx(sinh x) = cosh x',
            'd/dx(cosh x) = sinh x',
            'sinh⁻¹x = ln(x + √(x² + 1))',
            'cosh⁻¹x = ln(x + √(x² - 1)), x ≥ 1'
        ]
    },
    {
        id: 'further_differentiation',
        name: 'Further Differentiation',
        description: 'Implicit, parametric, and logarithmic differentiation',
        difficulty: 'Upper Sixth',
        paperRelevance: 'Paper 1',
        learningObjectives: [
            'Differentiate implicitly defined functions',
            'Differentiate parametric equations',
            'Find second derivatives of parametric curves',
            'Apply logarithmic differentiation',
            'Differentiate inverse trigonometric functions',
            'Find higher order derivatives',
            'Maclaurin series expansions'
        ],
        keyFormulas: [
            'Implicit: d/dx(f(y)) = f\'(y)·(dy/dx)',
            'Parametric: dy/dx = (dy/dt)/(dx/dt)',
            'd²y/dx² = d/dt(dy/dx) ÷ (dx/dt)',
            'd/dx(sin⁻¹x) = 1/√(1-x²)',
            'd/dx(cos⁻¹x) = -1/√(1-x²)',
            'd/dx(tan⁻¹x) = 1/(1+x²)',
            'Logarithmic: ln y = ... then (1/y)(dy/dx) = ...'
        ]
    },
    {
        id: 'further_integration',
        name: 'Further Integration Techniques',
        description: 'Integration by parts, partial fractions, and standard integrals',
        difficulty: 'Upper Sixth',
        paperRelevance: 'Paper 1',
        learningObjectives: [
            'Apply integration by parts: ∫u dv = uv - ∫v du',
            'Integrate using partial fractions',
            'Use trigonometric and hyperbolic substitutions',
            'Integrate rational functions with quadratic denominators',
            'Apply reduction formulae',
            'Evaluate improper integrals',
            'Use Wallis formula and gamma-type integrals'
        ],
        keyFormulas: [
            '∫u dv = uv - ∫v du (integration by parts)',
            '∫1/(a²+x²) dx = (1/a)tan⁻¹(x/a) + C',
            '∫1/√(a²-x²) dx = sin⁻¹(x/a) + C',
            '∫1/(a²-x²) dx = (1/2a)ln|(a+x)/(a-x)| + C',
            '∫1/√(x²±a²) dx = ln|x + √(x²±a²)| + C'
        ]
    },
    {
        id: 'differential_equations',
        name: 'Differential Equations',
        description: 'First and second order differential equations with applications',
        difficulty: 'Upper Sixth',
        paperRelevance: 'Paper 1',
        learningObjectives: [
            'Solve separable first-order differential equations',
            'Solve first-order linear equations using integrating factor',
            'Solve homogeneous first-order equations',
            'Solve second-order homogeneous equations with constant coefficients',
            'Find particular integrals for non-homogeneous equations',
            'Model real-world problems with differential equations',
            'Interpret solution behavior (growth, decay, oscillation)'
        ],
        keyFormulas: [
            'Separable: dy/dx = f(x)g(y) → ∫(1/g(y))dy = ∫f(x)dx',
            'Integrating factor: e^∫P(x)dx for dy/dx + P(x)y = Q(x)',
            'Auxiliary equation: am² + bm + c = 0',
            'Distinct roots m₁,m₂: y = Ae^(m₁x) + Be^(m₂x)',
            'Repeated root m: y = (A + Bx)e^(mx)',
            'Complex roots α ± βi: y = e^(αx)(A cos βx + B sin βx)'
        ]
    },
    {
        id: 'complex_numbers',
        name: 'Complex Numbers',
        description: 'Argand diagrams, modulus-argument form, De Moivre\'s theorem, and roots',
        difficulty: 'Upper Sixth',
        paperRelevance: 'Paper 1',
        learningObjectives: [
            'Perform arithmetic with complex numbers',
            'Represent complex numbers on Argand diagrams',
            'Convert between Cartesian and polar forms',
            'Apply De Moivre\'s theorem',
            'Find nth roots of complex numbers',
            'Solve polynomial equations with complex roots',
            'Understand loci in the complex plane',
            'Use exponential form z = re^(iθ)'
        ],
        keyFormulas: [
            'z = a + bi = r(cos θ + i sin θ) = re^(iθ)',
            '|z| = √(a² + b²), arg(z) = tan⁻¹(b/a)',
            'z* = a - bi (conjugate)',
            'z·z* = |z|²',
            '(cos θ + i sin θ)ⁿ = cos nθ + i sin nθ (De Moivre)',
            'e^(iθ) = cos θ + i sin θ (Euler\'s formula)',
            'Roots: z^(1/n) = r^(1/n)·e^(i(θ + 2kπ)/n), k = 0,1,...,n-1'
        ]
    },
    {
        id: 'matrices',
        name: 'Matrices and Determinants',
        description: 'Matrix operations, determinants, inverses, and linear transformations',
        difficulty: 'Upper Sixth',
        paperRelevance: 'Paper 1',
        learningObjectives: [
            'Perform matrix addition, subtraction, and multiplication',
            'Calculate determinants of 2×2 and 3×3 matrices',
            'Find inverse matrices',
            'Solve systems of linear equations using matrices',
            'Understand eigenvalues and eigenvectors',
            'Apply matrices to linear transformations',
            'Find the inverse of 3×3 matrices'
        ],
        keyFormulas: [
            'det(AB) = det(A)·det(B)',
            '2×2 inverse: A⁻¹ = (1/det A)·adj(A)',
            'For 2×2: if A = [a b; c d], A⁻¹ = (1/(ad-bc))[d -b; -c a]',
            'Ax = b → x = A⁻¹b',
            'Characteristic equation: det(A - λI) = 0',
            '(A⁻¹)⁻¹ = A, (AB)⁻¹ = B⁻¹A⁻¹'
        ]
    },
    {
        id: 'vectors_3d',
        name: 'Vectors in 3D',
        description: 'Vector operations, scalar and vector products, lines and planes',
        difficulty: 'Upper Sixth',
        paperRelevance: 'Paper 1',
        learningObjectives: [
            'Perform vector operations in 3D',
            'Calculate scalar (dot) product and interpret geometrically',
            'Calculate vector (cross) product',
            'Find equations of lines in 3D (vector and parametric)',
            'Find equations of planes in various forms',
            'Calculate distances, angles, and intersections',
            'Determine if lines are parallel, skew, or intersecting'
        ],
        keyFormulas: [
            'a · b = |a||b|cos θ = a₁b₁ + a₂b₂ + a₃b₃',
            'a × b = |a||b|sin θ n̂ (perpendicular to both)',
            'a × b = (a₂b₃-a₃b₂)i + (a₃b₁-a₁b₃)j + (a₁b₂-a₂b₁)k',
            'Line: r = a + λb',
            'Plane: r · n = d or ax + by + cz = d',
            'Distance from point P to plane: |n · (P - A)|/|n|',
            'Angle between planes: cos θ = |n₁ · n₂|/(|n₁||n₂|)'
        ]
    },
    {
        id: 'summation_series',
        name: 'Summation of Series',
        description: 'Method of differences, standard results, and convergence',
        difficulty: 'Upper Sixth',
        paperRelevance: 'Both',
        learningObjectives: [
            'Apply the method of differences to sum series',
            'Use standard summation formulae',
            'Sum series using partial fractions',
            'Prove summation results by induction',
            'Determine convergence of series',
            'Apply Maclaurin series for approximations'
        ],
        keyFormulas: [
            'Σ(r=1 to n) r = n(n+1)/2',
            'Σ(r=1 to n) r² = n(n+1)(2n+1)/6',
            'Σ(r=1 to n) r³ = [n(n+1)/2]²',
            'Method of differences: Σ[f(r) - f(r-1)] = f(n) - f(0)',
            'Partial fractions: 1/(r(r+1)) = 1/r - 1/(r+1)'
        ]
    },
    {
        id: 'numerical_methods',
        name: 'Numerical Methods',
        description: 'Root finding, numerical integration, and iterative methods',
        difficulty: 'Upper Sixth',
        paperRelevance: 'Paper 1',
        learningObjectives: [
            'Locate roots using sign change',
            'Apply the Newton-Raphson method',
            'Understand and use iterative methods xₙ₊₁ = g(xₙ)',
            'Determine convergence of iterations',
            'Apply the trapezium rule for integration',
            'Apply Simpsons rule for integration',
            'Estimate errors in numerical methods'
        ],
        keyFormulas: [
            'Newton-Raphson: xₙ₊₁ = xₙ - f(xₙ)/f\'(xₙ)',
            'Trapezium rule: ∫[a to b] y dx ≈ h/2[y₀ + 2(y₁+...+yₙ₋₁) + yₙ]',
            'Simpson\'s rule: ∫[a to b] y dx ≈ h/3[y₀ + 4(y₁+y₃+...) + 2(y₂+y₄+...) + yₙ]',
            'Convergence: |g\'(x)| < 1 near root'
        ]
    },
    {
        id: 'proof',
        name: 'Proof and Mathematical Induction',
        description: 'Methods of proof including induction, contradiction, and counterexample',
        difficulty: 'Upper Sixth',
        paperRelevance: 'Paper 1',
        learningObjectives: [
            'Prove results by mathematical induction',
            'Construct proofs by contradiction',
            'Use direct proof techniques',
            'Disprove statements using counterexamples',
            'Prove divisibility results',
            'Prove inequalities using induction',
            'Understand the structure of mathematical proofs'
        ],
        keyFormulas: [
            'Induction: (1) Base case, (2) Assume P(k), (3) Prove P(k+1)',
            'Contradiction: Assume negation, derive contradiction',
            'Contrapositive: Prove ¬Q → ¬P instead of P → Q'
        ]
    },
    {
        id: 'groups',
        name: 'Group Theory',
        description: 'Introduction to groups, subgroups, isomorphism, and applications',
        difficulty: 'Upper Sixth',
        paperRelevance: 'Paper 2',
        learningObjectives: [
            'Understand the definition and axioms of a group',
            'Verify group properties (closure, associativity, identity, inverse)',
            'Identify common groups: (ℤₙ, +), symmetry groups',
            'Find subgroups of a group',
            'Understand cyclic groups and generators',
            'Recognize isomorphic groups',
            'Apply Lagranges theorem on subgroup orders'
        ],
        keyFormulas: [
            'Group axioms: Closure, Associativity, Identity, Inverse',
            'Order of element a: smallest n where aⁿ = e',
            'Lagrange: order of subgroup divides order of group',
            'Cyclic group: generated by single element ⟨g⟩',
            'Isomorphism: bijection preserving group operation'
        ]
    }
];

// Helper function to get topic by ID
export function getTopicById(id: string): ALevelPureMathTopic | undefined {
    return aLevelPureMathTopics.find(topic => topic.id === id);
}

// Get topics by difficulty level
export function getTopicsByLevel(level: 'Lower Sixth' | 'Upper Sixth'): ALevelPureMathTopic[] {
    return aLevelPureMathTopics.filter(topic => topic.difficulty === level);
}

// Get all topic names
export function getAllTopicNames(): string[] {
    return aLevelPureMathTopics.map(topic => topic.name);
}

// Get topics by paper relevance
export function getTopicsByPaper(paper: 'Paper 1' | 'Paper 2' | 'Both'): ALevelPureMathTopic[] {
    return aLevelPureMathTopics.filter(
        topic => topic.paperRelevance === paper || topic.paperRelevance === 'Both'
    );
}

// Export topic count for display
export const topicCounts = {
    lowerSixth: aLevelPureMathTopics.filter(t => t.difficulty === 'Lower Sixth').length,
    upperSixth: aLevelPureMathTopics.filter(t => t.difficulty === 'Upper Sixth').length,
    total: aLevelPureMathTopics.length
};

