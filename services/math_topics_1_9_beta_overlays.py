#!/usr/bin/env python3
"""
ZIMSEC O-Level Mathematics – Beta overlays for Topics 1–9.
Uses MASTER-INDEX-All-Topics.md and ZIMSEC-O-Level-Math-Complete-Guide.md only.
No full question templates (those are in ZIMSEC_Complete_All_13_Topics.md, not provided).
Expand using subtopics, exam types, key formulas. Example styles are short generic patterns.
Contract: {subtopic, prompts: {easy, medium, difficult}}; each prompt {id, subtopic, prompt, learning_objective}.
"""

def _base(subtopic, objectives, exam_types, formulas, requirements, examples, diff_tag):
    fblock = f"\nKEY FORMULAS (if applicable):\n{formulas}\n" if formulas.strip() else ""
    return f"""SUBTOPIC: {subtopic}

LEARNING OBJECTIVES:
{chr(10).join(f'- {o}' for o in objectives)}

EXAM QUESTION TYPES (ZIMSEC):
{chr(10).join(f'- {e}' for e in exam_types)}
{fblock}
REQUIREMENTS:
{requirements}

EXAMPLE QUESTION STYLES (generic; vary numbers and contexts):
{examples}

DIFFICULTY: {diff_tag}. Use plain-text math only (no LaTeX). Return valid JSON with question, solution, answer, points, explanation, teaching_explanation, zimsec_paper_reference, marking_notes."""


# ---- REAL NUMBERS ----
RN_APPROX = {
    "subtopic": "Approximations and Standard Form",
    "prompts": {
        "easy": [{"id": "RN_BETA_App_E01", "subtopic": "Approximations and Standard Form",
            "prompt": _base("Approximations and Standard Form",
                ["Round to decimal places, significant figures", "Estimate calculations", "Use standard form a × 10ⁿ, 1 ≤ a < 10"],
                ["P1, P2: Rounding", "P1, P2: Standard form", "P2: Estimate"],
                "Standard form: a × 10ⁿ, 1 ≤ a < 10. Percentage: (Part/Whole) × 100.",
                "Round to 2 d.p. or 2 s.f. Convert to/from standard form. Estimate 4.2 × 19.8.",
                "Round 5764 to nearest thousand. Write 0.00092 in standard form. Estimate (9.79 × 0.765) / 41.3.",
                "easy"), "learning_objective": "Round, estimate, use standard form"}],
        "medium": [{"id": "RN_BETA_App_M01", "subtopic": "Approximations and Standard Form",
            "prompt": _base("Approximations and Standard Form",
                ["Upper/lower bounds", "Limits of accuracy", "Calculations with rounded data"],
                ["P2: Bounds", "P2: Limits of accuracy"],
                "Bounds: half unit either side. Propagation in area/perimeter/speed.",
                "Length 12 cm to nearest cm. Give upper/lower bounds. Perimeter of rectangle 10×12 cm (to nearest cm): bounds?",
                "Upper/lower bounds for given accuracy; bounds of area, perimeter, or speed.",
                "medium"), "learning_objective": "Use bounds and limits of accuracy"}],
        "difficult": [],
    },
}
RN_RATIO = {
    "subtopic": "Ratios, Rates, Proportions",
    "prompts": {
        "easy": [{"id": "RN_BETA_Rat_E01", "subtopic": "Ratios, Rates, Proportions",
            "prompt": _base("Ratios, Rates, Proportions",
                ["Simplify ratios", "Divide quantity in given ratio", "Use ratio in context"],
                ["P1, P2: Simplify ratio", "P2: Divide in ratio", "P2: Map scales, best value"],
                "Ratio division: Amount × (share / total shares).",
                "Simplify 20:30:40. Divide 60 in ratio 2:3. Use map scale or best-value comparison.",
                "Give ratio in simplest form. Share amount in ratio. Use scale 1:50000.",
                "easy"), "learning_objective": "Simplify ratios and divide in ratio"}],
        "medium": [], "difficult": [],
    },
}
for _b in (RN_APPROX, RN_RATIO):
    for d in ("easy", "medium", "difficult"):
        _b["prompts"].setdefault(d, [])
REAL_NUMBERS_BETA = [RN_APPROX, RN_RATIO]

# ---- SETS ----
SETS_VENN = {
    "subtopic": "Venn Diagrams",
    "prompts": {
        "easy": [{"id": "ST_BETA_Venn_E01", "subtopic": "Venn Diagrams",
            "prompt": _base("Venn Diagrams",
                ["Two-set Venn diagrams", "Shade regions", "n(A), n(A∪B), n(A∩B)"],
                ["P1, P2: Shade region", "P2: n(A∪B), n(A∩B)", "P2: Survey problems"],
                "",
                "Use ∈, ∉, ∅, ∪, ∩. Two or three sets.",
                "Shade (A∩B)', A∪B. Given n(A), n(B), n(A∩B), find n(A∪B). Survey: 30 like X, 20 like Y, 10 both.",
                "easy"), "learning_objective": "Use Venn diagrams and set notation"}],
        "medium": [{"id": "ST_BETA_Venn_M01", "subtopic": "Venn Diagrams",
            "prompt": _base("Venn Diagrams",
                ["Three-set Venn", "Set builder notation", "Counting from Venn"],
                ["P2: Three sets", "P2: Set builder", "P2: Complex counting"],
                "",
                "Three sets; set builder {x: …}. Shade (A∩B)∪C etc.",
                "Three sets. Shade (A∪B)∩C'. Express {2,4,6,8} in set builder. Find n(A∪B∪C) from Venn.",
                "medium"), "learning_objective": "Use three-set Venn diagrams and set builder"}],
        "difficult": [],
    },
}
SETS_NOTATION = {
    "subtopic": "Set Notation and Operations",
    "prompts": {
        "easy": [{"id": "ST_BETA_Not_E01", "subtopic": "Set Notation and Operations",
            "prompt": _base("Set Notation and Operations",
                ["∈, ∉, ⊂, ∅", "Union and intersection", "List elements", "n(A)"],
                ["P1, P2: Set notation", "P1, P2: n(A)", "P2: Union/intersection"],
                "",
                "Use ⊆, ∪, ∩, ∅, ∈, ∉. List elements; find n(A).",
                "A = {1,2,3,4}, B = {3,4,5}. Find A∩B, A∪B, n(A∪B). Is 2 ∈ A?",
                "easy"), "learning_objective": "Use set notation and basic operations"}],
        "medium": [], "difficult": [],
    },
}
for _b in (SETS_VENN, SETS_NOTATION):
    for d in ("easy", "medium", "difficult"):
        _b["prompts"].setdefault(d, [])
SETS_BETA = [SETS_VENN, SETS_NOTATION]

# ---- FINANCIAL MATHEMATICS ----
FM_INTEREST = {
    "subtopic": "Interest and Hire Purchase",
    "prompts": {
        "easy": [{"id": "FM_BETA_Int_E01", "subtopic": "Interest and Hire Purchase",
            "prompt": _base("Interest and Hire Purchase",
                ["Simple interest I = PRT/100", "Percentage profit (Profit/CP)×100", "Basic profit/loss"],
                ["P1, P2: Profit/loss", "P2: Simple interest", "P2: Hire purchase"],
                "Simple Interest: I = PRT/100. Compound: A = P(1 + r/100)ⁿ. Percentage profit: (Profit/CP) × 100.",
                "Use principal, rate, time. Round money to 2 d.p.",
                "Find simple interest on $500 at 6% for 3 years. Cost price $80, sell $100: profit %? Hire purchase: deposit + instalments.",
                "easy"), "learning_objective": "Use simple interest and profit/loss"}],
        "medium": [{"id": "FM_BETA_Int_M01", "subtopic": "Interest and Hire Purchase",
            "prompt": _base("Interest and Hire Purchase",
                ["Compound interest", "Hire purchase", "Reverse percentage"],
                ["P2: Compound interest", "P2: Hire purchase", "P2: Find CP given SP and profit %"],
                "Compound: A = P(1 + r/100)ⁿ. Reverse %: CP = SP / (1 + p/100) etc.",
                "Compound interest over 2–3 years. HP: deposit + instalments, total cost. Find CP given SP and profit %.",
                "Compound interest. HP total cost. Reverse percentage.",
                "medium"), "learning_objective": "Use compound interest and hire purchase"}],
        "difficult": [],
    },
}
FM_TAX_FX = {
    "subtopic": "Taxation and Foreign Exchange",
    "prompts": {
        "easy": [], "medium": [{"id": "FM_BETA_Tax_M01", "subtopic": "Taxation and Foreign Exchange",
            "prompt": _base("Taxation and Foreign Exchange",
                ["Foreign exchange", "VAT, PAYE, customs (as per syllabus)"],
                ["P2: Exchange rates", "P2: Taxation"],
                "",
                "Convert currency using rate. Simple VAT or tax on amount.",
                "Convert $100 to ZWL at given rate. Find VAT on amount. Simple PAYE or customs.",
                "medium"), "learning_objective": "Use exchange rates and basic tax"}],
        "difficult": [],
    },
}
for _b in (FM_INTEREST, FM_TAX_FX):
    for d in ("easy", "medium", "difficult"):
        _b["prompts"].setdefault(d, [])
FINANCIAL_MATH_BETA = [FM_INTEREST, FM_TAX_FX]

# ---- MEASURES AND MENSURATION ----
MM_AREA_VOL = {
    "subtopic": "Perimeter, Area, Volume",
    "prompts": {
        "easy": [{"id": "MM_BETA_AV_E01", "subtopic": "Perimeter, Area, Volume",
            "prompt": _base("Perimeter, Area, Volume",
                ["Perimeter and area of rectangle, triangle, parallelogram, trapezium", "Unit conversion"],
                ["P1, P2: Perimeter/area", "P1, P2: Unit conversion", "P2: Volume"],
                "Area circle: πr². Volume cylinder: πr²h; sphere (4/3)πr³; cone (1/3)πr²h. Density: D = M/V.",
                "Use mm, cm, m, km; mm², cm², m²; cm³, m³; ml, L; g, kg. Convert between units.",
                "Find area of triangle base 10, height 6. Perimeter of rectangle 8×5. Convert 2.5 m to cm. Volume of cylinder r=3, h=7.",
                "easy"), "learning_objective": "Calculate perimeter, area, volume; convert units"}],
        "medium": [{"id": "MM_BETA_AV_M01", "subtopic": "Perimeter, Area, Volume",
            "prompt": _base("Perimeter, Area, Volume",
                ["Combined shapes", "Surface area", "Density"],
                ["P2: Combined shapes", "P2: Surface area", "P2: Density"],
                "Density D = M/V. Surface area cylinder 2πrh; sphere 4πr².",
                "Compound shape: rectangle + triangle or semicircle. Surface area of cylinder. Density from mass and volume.",
                "Area of L-shape. Surface area cylinder. Find density given mass and volume.",
                "medium"), "learning_objective": "Solve combined shapes, surface area, density"}],
        "difficult": [],
    },
}
MM_UNITS_SCALE = {
    "subtopic": "Units and Scale",
    "prompts": {
        "easy": [{"id": "MM_BETA_Scale_E01", "subtopic": "Units and Scale",
            "prompt": _base("Units and Scale",
                ["Convert lengths, areas, volumes", "Map scale 1:n", "Scale drawings"],
                ["P1, P2: Unit conversion", "P2: Map scale", "P2: Scale drawing"],
                "Scale 1:n means 1 cm on map = n cm real. Convert using 1 m = 100 cm, etc.",
                "Use mm, cm, m, km; convert between units. Use scale to find real distance from map distance.",
                "Convert 2.5 km to m. Map scale 1:50000; 4 cm on map = ? km real. Scale drawing.",
                "easy"), "learning_objective": "Convert units; use map scale and scale drawings"}],
        "medium": [], "difficult": [],
    },
}
for _b in (MM_AREA_VOL, MM_UNITS_SCALE):
    for d in ("easy", "medium", "difficult"):
        _b["prompts"].setdefault(d, [])
MENSURATION_BETA = [MM_AREA_VOL, MM_UNITS_SCALE]

# ---- GRAPHS ----
GR_LINEAR = {
    "subtopic": "Linear and Quadratic Graphs",
    "prompts": {
        "easy": [{"id": "GR_BETA_Lin_E01", "subtopic": "Linear and Quadratic Graphs",
            "prompt": _base("Linear and Quadratic Graphs",
                ["Cartesian plane", "Plot points", "y = mx + c", "Gradient and intercept"],
                ["P1, P2: Coordinates", "P2: Linear graphs", "P2: Gradient/intercept"],
                "",
                "Use tables of values. Plot accurately. Gradient = Δy/Δx.",
                "Draw y = 2x - 3 for -2 ≤ x ≤ 3. State gradient and y-intercept. Find x when y = 0.",
                "easy"), "learning_objective": "Draw linear graphs; interpret gradient and intercept"}],
        "medium": [{"id": "GR_BETA_Lin_M01", "subtopic": "Linear and Quadratic Graphs",
            "prompt": _base("Linear and Quadratic Graphs",
                ["Quadratic graphs", "Distance-time, speed-time", "Solve equations graphically"],
                ["P2: Quadratic graphs", "P2: Travel graphs", "P2: Solving by graph"],
                "",
                "Parabola: vertex, axis, roots. Distance-time: gradient = speed. Speed-time: area = distance.",
                "Draw y = x² - 4x - 5. Find roots, turning point. Interpret distance-time or speed-time graph. Solve x² - 4 = 2x by graph.",
                "medium"), "learning_objective": "Draw and interpret quadratic and travel graphs"}],
        "difficult": [],
    },
}
GR_TRAVEL = {
    "subtopic": "Travel and Real-World Graphs",
    "prompts": {
        "easy": [{"id": "GR_BETA_Trav_E01", "subtopic": "Travel and Real-World Graphs",
            "prompt": _base("Travel and Real-World Graphs",
                ["Distance–time graphs", "Speed–time graphs", "Gradient = speed", "Area under curve"],
                ["P2: Distance–time", "P2: Speed–time", "P2: Interpret"],
                "Distance–time: gradient = speed. Speed–time: area = distance.",
                "Interpret distance–time: constant speed, at rest, return. Interpret speed–time; find distance.",
                "From distance–time graph: find speed, when at rest, total distance. From speed–time: find distance from area.",
                "easy"), "learning_objective": "Interpret travel graphs"}],
        "medium": [], "difficult": [],
    },
}
for _b in (GR_LINEAR, GR_TRAVEL):
    for d in ("easy", "medium", "difficult"):
        _b["prompts"].setdefault(d, [])
GRAPHS_BETA = [GR_LINEAR, GR_TRAVEL]

# ---- VARIATION ----
VAR_DIRECT = {
    "subtopic": "Direct and Inverse Variation",
    "prompts": {
        "easy": [{"id": "VR_BETA_Dir_E01", "subtopic": "Direct and Inverse Variation",
            "prompt": _base("Direct and Inverse Variation",
                ["y ∝ x", "y ∝ 1/x", "Find constant k", "Use y = kx or y = k/x"],
                ["P2: Direct variation", "P2: Inverse variation"],
                "",
                "One pair of values to find k. Then find unknown.",
                "y ∝ x; y=18 when x=6. Find k and y when x=10. y ∝ 1/x; y=5 when x=12. Find y when x=20.",
                "easy"), "learning_objective": "Use direct and inverse variation"}],
        "medium": [{"id": "VR_BETA_Dir_M01", "subtopic": "Direct and Inverse Variation",
            "prompt": _base("Direct and Inverse Variation",
                ["Joint variation", "Partial variation", "y ∝ x²/z type"],
                ["P2: Joint variation", "P2: Partial variation"],
                "",
                "y ∝ xz or y ∝ x²/z. Use given data to find k.",
                "y ∝ x²/z; y=12 when x=3, z=2. Find y when x=5, z=4. Partial variation: y = ax + b.",
                "medium"), "learning_objective": "Use joint and partial variation"}],
        "difficult": [],
    },
}
for d in ("easy", "medium", "difficult"):
    VAR_DIRECT["prompts"].setdefault(d, [])
VARIATION_BETA = [VAR_DIRECT]

# ---- ALGEBRA (multiple subtopics for rotation) ----
ALG_INDICES = {
    "subtopic": "Indices",
    "prompts": {
        "easy": [{"id": "AL_BETA_Idx_E01", "subtopic": "Indices",
            "prompt": _base("Indices",
                ["a^m × a^n = a^(m+n)", "a^m ÷ a^n = a^(m-n)", "a⁰ = 1", "Simplify using index laws"],
                ["P1, P2: Simplify indices", "P1, P2: Evaluate powers"],
                "aᵐ × aⁿ = aᵐ⁺ⁿ; aᵐ ÷ aⁿ = aᵐ⁻ⁿ; (aᵐ)ⁿ = aᵐⁿ; a⁰ = 1.",
                "Use positive integer indices only. Whole number bases.",
                "Simplify 2³ × 2⁵. Simplify 3⁷ ÷ 3⁴. Evaluate 5⁰. Write 2² × 2⁴ as single power.",
                "easy"), "learning_objective": "Use laws of indices for positive integers"}],
        "medium": [{"id": "AL_BETA_Idx_M01", "subtopic": "Indices",
            "prompt": _base("Indices",
                ["Negative indices a⁻ⁿ = 1/aⁿ", "Fractional indices", "Simplify expressions with mixed indices"],
                ["P1, P2: Negative indices", "P2: Fractional indices"],
                "a⁻ⁿ = 1/aⁿ. a^(1/n) = ⁿ√a. a^(m/n) = ⁿ√(aᵐ).",
                "Simplify 2⁻³, 5^(-2). Simplify 8^(1/3), 16^(3/4). Combine laws.",
                "Simplify 3⁻² × 3⁵. Evaluate 27^(2/3). Express with positive indices.",
                "medium"), "learning_objective": "Use negative and fractional indices"}],
        "difficult": [],
    },
}
ALG_FRACTIONS = {
    "subtopic": "Algebraic Fractions",
    "prompts": {
        "easy": [{"id": "AL_BETA_Frac_E01", "subtopic": "Algebraic Fractions",
            "prompt": _base("Algebraic Fractions",
                ["Simplify by cancelling common factors", "Multiply and divide simple algebraic fractions"],
                ["P1, P2: Simplify", "P2: Multiply/divide"],
                "Factorise numerator and denominator; cancel. (a/b)×(c/d) = ac/(bd); (a/b)÷(c/d) = ad/(bc).",
                "Single variable. Factorise quadratics in num/denom.",
                "Simplify (x²-4)/(x+2). Simplify (2x+6)/(4x+12). Multiply (x/3)×(6/(x+2)).",
                "easy"), "learning_objective": "Simplify and multiply/divide algebraic fractions"}],
        "medium": [{"id": "AL_BETA_Frac_M01", "subtopic": "Algebraic Fractions",
            "prompt": _base("Algebraic Fractions",
                ["Add and subtract with different denominators", "Express as single fraction", "Simplify complex fractions"],
                ["P2: Add/subtract", "P2: Single fraction"],
                "LCD; combine numerators. Simplify (A/B) ± (C/D) = (AD ± BC)/(BD).",
                "Find LCD, combine. Factorise where needed.",
                "Add 1/(x+1) + 2/(x-1). Express 3/(x+2) - 1/x as single fraction. Simplify (1 + 1/x) / (1 - 1/x).",
                "medium"), "learning_objective": "Add, subtract, and simplify algebraic fractions"}],
        "difficult": [],
    },
}
ALG_FACTORISE = {
    "subtopic": "Factorisation",
    "prompts": {
        "easy": [{"id": "AL_BETA_Fac_E01", "subtopic": "Factorisation",
            "prompt": _base("Factorisation",
                ["Common factor", "Difference of two squares", "Quadratic trinomials ax²+bx+c"],
                ["P1, P2: Common factor", "P1, P2: Difference of two squares", "P1, P2: Factorise quadratics"],
                "a² - b² = (a-b)(a+b). ax²+bx+c with a=1 or simple a.",
                "Integer coefficients. No fancy quadratics.",
                "Factorise 6x+12. Factorise x²-9. Factorise x²+5x+6. Factorise 2x²+7x+3.",
                "easy"), "learning_objective": "Factorise using common factor, difference of two squares, quadratics"}],
        "medium": [{"id": "AL_BETA_Fac_M01", "subtopic": "Factorisation",
            "prompt": _base("Factorisation",
                ["Grouping", "Quadratics with a>1", "Factorise and solve"],
                ["P2: Grouping", "P2: Harder quadratics", "P2: Solve by factorising"],
                "Grouping: ax+ay+bx+by = a(x+y)+b(x+y) = (a+b)(x+y).",
                "Factorise by grouping; quadratics with a>1; solve equations by factorising.",
                "Factorise 2x²+4x+3x+6. Factorise 6x²-7x-20. Solve x²-5x+6=0 by factorising.",
                "medium"), "learning_objective": "Factorise by grouping and harder quadratics; solve"}],
        "difficult": [],
    },
}
ALG_LINEAR_EQ = {
    "subtopic": "Linear Equations",
    "prompts": {
        "easy": [{"id": "AL_BETA_Lin_E01", "subtopic": "Linear Equations",
            "prompt": _base("Linear Equations",
                ["One- and two-step equations", "Equations with brackets", "Fractions in equations"],
                ["P1, P2: Solve linear", "P2: Brackets", "P2: Fractions"],
                "Expand brackets; clear fractions by multiplying through by LCD.",
                "Integer solutions or simple fractions.",
                "Solve 3x+4=13. Solve 2(x-3)=10. Solve (x/2) + (x/3) = 5.",
                "easy"), "learning_objective": "Solve linear equations including brackets and fractions"}],
        "medium": [{"id": "AL_BETA_Lin_M01", "subtopic": "Linear Equations",
            "prompt": _base("Linear Equations",
                ["Variables on both sides", "Form equations from word problems", "Change of subject"],
                ["P2: Both sides", "P2: Word problems", "P2: Change subject"],
                "Collect like terms; isolate variable. Form equation from context.",
                "Avoid 'length in between' style only; use variety: ages, costs, distances, etc.",
                "Solve 5x-3 = 2x+9. Form equation: 'John is 3 years older than Mary...'. Make t subject of s = ut + ½at².",
                "medium"), "learning_objective": "Solve harder linear equations; form equations; change subject"}],
        "difficult": [],
    },
}
ALG_QUADRATICS = {
    "subtopic": "Quadratics",
    "prompts": {
        "easy": [{"id": "AL_BETA_Quad_E01", "subtopic": "Quadratics",
            "prompt": _base("Quadratics",
                ["Solve by factorisation", "Use formula x = (-b ± √(b²-4ac))/(2a)", "Completing the square"],
                ["P1, P2: Factorise", "P2: Formula", "P2: Completing square"],
                "Formula: x = (-b ± √(b²-4ac))/(2a). Complete square: x²+bx+c = (x + b/2)² + (c - b²/4).",
                "Real roots. Give exact or rounded answers as appropriate.",
                "Solve x²-5x+6=0. Solve 2x²+3x-2=0 using formula. Write x²+6x+5 in form (x+p)²+q.",
                "easy"), "learning_objective": "Solve quadratic equations; complete the square"}],
        "medium": [{"id": "AL_BETA_Quad_M01", "subtopic": "Quadratics",
            "prompt": _base("Quadratics",
                ["Discriminant b²-4ac", "Quadratic word problems", "Find range of values for real roots"],
                ["P2: Discriminant", "P2: Word problems", "P2: Conditions on k"],
                "Δ = b²-4ac. Real roots ⟺ Δ ≥ 0; equal roots ⟺ Δ = 0.",
                "Vary contexts: area, projectile, profit, etc. Not only 'length between'.",
                "Find k so x²+kx+4=0 has equal roots. For what k does 2x²-5x+k=0 have real roots? Area of rectangle 24; perimeter 20. Find dimensions.",
                "medium"), "learning_objective": "Use discriminant; quadratic word problems"}],
        "difficult": [],
    },
}
ALG_SIMULTANEOUS = {
    "subtopic": "Simultaneous Equations",
    "prompts": {
        "easy": [{"id": "AL_BETA_Sim_E01", "subtopic": "Simultaneous Equations",
            "prompt": _base("Simultaneous Equations",
                ["Elimination", "Substitution", "Both linear"],
                ["P1, P2: Elimination", "P1, P2: Substitution"],
                "Two linear equations. Eliminate or substitute.",
                "Integer or simple fractional solutions.",
                "Solve 2x+y=7, x-y=2. Solve 3x+2y=12, 2x+3y=13.",
                "easy"), "learning_objective": "Solve linear simultaneous equations"}],
        "medium": [{"id": "AL_BETA_Sim_M01", "subtopic": "Simultaneous Equations",
            "prompt": _base("Simultaneous Equations",
                ["One linear, one quadratic", "Form from word problems"],
                ["P2: Linear–quadratic", "P2: Word problems"],
                "Substitute from linear into quadratic; solve resulting quadratic.",
                "Vary contexts.",
                "Solve y=2x+1, x²+y²=25. Form and solve: two numbers sum 12, product 35.",
                "medium"), "learning_objective": "Solve linear–quadratic simultaneous; form from context"}],
        "difficult": [],
    },
}
ALG_INEQUALITIES = {
    "subtopic": "Inequalities",
    "prompts": {
        "easy": [{"id": "AL_BETA_Ineq_E01", "subtopic": "Inequalities",
            "prompt": _base("Inequalities",
                ["Linear inequalities", "Number line", "Integer solutions"],
                ["P1, P2: Solve inequality", "P2: Number line"],
                "Same steps as equations; reverse inequality when ×/÷ by negative.",
                "Solve linear inequalities; represent on number line; list integer solutions in range.",
                "Solve 2x+3 < 11. Represent x ≥ -2 on number line. List integer x such that -3 < x ≤ 4.",
                "easy"), "learning_objective": "Solve linear inequalities; number line"}],
        "medium": [{"id": "AL_BETA_Ineq_M01", "subtopic": "Inequalities",
            "prompt": _base("Inequalities",
                ["Quadratic inequalities", "Simultaneous inequalities"],
                ["P2: Quadratic inequalities", "P2: Combined"],
                "Solve x²-5x+6>0 via sign chart or sketch. Combine ranges.",
                "Quadratic: factorise, sign chart, solution set. Combined: intersect solution sets.",
                "Solve x²-4<0. Solve 2x+1>3 and x-1<7; represent solution.",
                "medium"), "learning_objective": "Solve quadratic and combined inequalities"}],
        "difficult": [],
    },
}
ALG_SEQUENCES = {
    "subtopic": "Sequences",
    "prompts": {
        "easy": [{"id": "AL_BETA_Seq_E01", "subtopic": "Sequences",
            "prompt": _base("Sequences",
                ["Term-to-term rule", "nth term (linear)", "Find missing terms"],
                ["P1, P2: Next terms", "P1, P2: nth term", "P2: Missing terms"],
                "AP: nth term a+(n-1)d; first n terms S = n/2(2a+(n-1)d).",
                "Identify AP; find d, a; nth term and sum.",
                "2, 5, 8, 11, ... Write nth term. Find 10th term. Find sum of first 20 terms.",
                "easy"), "learning_objective": "Use term-to-term and nth term for AP"}],
        "medium": [{"id": "AL_BETA_Seq_M01", "subtopic": "Sequences",
            "prompt": _base("Sequences",
                ["Geometric progressions", "nth term GP", "Sum to n terms", "Simple series"],
                ["P2: GP nth term", "P2: Sum GP", "P2: Sum to infinity"],
                "GP: nth term ar^(n-1); S_n = a(1-r^n)/(1-r); S∞ = a/(1-r) when |r|<1.",
                "Identify GP; find r, a; nth term, sum, sum to infinity where applicable.",
                "3, 6, 12, ... GP. Find 8th term. Sum of first 10 terms. Sum to infinity?",
                "medium"), "learning_objective": "Use GP; nth term; sum; sum to infinity"}],
        "difficult": [],
    },
}
ALG_CHANGE_SUBJECT = {
    "subtopic": "Change of Subject",
    "prompts": {
        "easy": [{"id": "AL_BETA_Subj_E01", "subtopic": "Change of Subject",
            "prompt": _base("Change of Subject",
                ["Two-step formulae", "Make variable subject"],
                ["P1, P2: Change subject"],
                "Reverse operations: +/− then ×/÷; squares and square roots.",
                "Linear or simple rearrangement.",
                "Make x subject of y = 2x + 5. Make r subject of A = πr².",
                "easy"), "learning_objective": "Change subject of simple formulae"}],
        "medium": [{"id": "AL_BETA_Subj_M01", "subtopic": "Change of Subject",
            "prompt": _base("Change of Subject",
                ["Subject in multiple terms", "Formulae with fractions", "Roots and powers"],
                ["P2: Harder change of subject"],
                "Collect terms in subject; factorise; divide. Use ± for square roots.",
                "Subject appears in more than one term; formulae with fractions or roots.",
                "Make t subject of v = u + at. Make h subject of A = ½(a+b)h. Make x subject of y = (2x+1)/(x-3).",
                "medium"), "learning_objective": "Change subject in harder formulae"}],
        "difficult": [],
    },
}
for _b in (ALG_INDICES, ALG_FRACTIONS, ALG_FACTORISE, ALG_LINEAR_EQ, ALG_QUADRATICS, ALG_SIMULTANEOUS, ALG_INEQUALITIES, ALG_SEQUENCES, ALG_CHANGE_SUBJECT):
    for d in ("easy", "medium", "difficult"):
        _b["prompts"].setdefault(d, [])
ALGEBRA_BETA = [ALG_INDICES, ALG_FRACTIONS, ALG_FACTORISE, ALG_LINEAR_EQ, ALG_QUADRATICS, ALG_SIMULTANEOUS, ALG_INEQUALITIES, ALG_SEQUENCES, ALG_CHANGE_SUBJECT]

# ---- GEOMETRY ----
GEO_ANGLES = {
    "subtopic": "Angles, Polygons, Bearings",
    "prompts": {
        "easy": [{"id": "GEO_BETA_Ang_E01", "subtopic": "Angles, Polygons, Bearings",
            "prompt": _base("Angles, Polygons, Bearings",
                ["Angles at a point, on a line", "Vertically opposite", "Parallel lines: corresponding, alternate", "Interior sum of polygon"],
                ["P1, P2: Angle calculations", "P1, P2: Polygon angles", "P2: Bearings"],
                "",
                "Sum at point 360°; on line 180°. (n-2)×180° for polygon. Bearings 000°–360° from N.",
                "Find x in angle diagram. Each interior angle of regular hexagon? Bearing of B from A.",
                "easy"), "learning_objective": "Use angle facts and polygon properties"}],
        "medium": [{"id": "GEO_BETA_Ang_M01", "subtopic": "Angles, Polygons, Bearings",
            "prompt": _base("Angles, Polygons, Bearings",
                ["Circle theorems", "Similarity and congruency", "Pythagoras", "Constructions and loci"],
                ["P2: Circle theorems", "P2: Similarity", "P2: Constructions", "P2: Loci"],
                "Pythagoras: a²+b²=c². Angle in semicircle 90°; tangent ⊥ radius; angle at centre = 2×angle at circumference.",
                "Find angle using circle theorem. Similar triangles: scale factor, area scale k². Construct perpendicular bisector. Locus equidistant from two points.",
                "Circle theorem proof. Similar triangles. Simple construction or locus.",
                "medium"), "learning_objective": "Apply circle theorems, similarity, constructions"}],
        "difficult": [],
    },
}
GEO_PYTH_LOCI = {
    "subtopic": "Pythagoras and Loci",
    "prompts": {
        "easy": [{"id": "GEO_BETA_Pyth_E01", "subtopic": "Pythagoras and Loci",
            "prompt": _base("Pythagoras and Loci",
                ["Pythagoras a²+b²=c²", "Find side or diagonal", "Simple loci (circle, perpendicular bisector)"],
                ["P1, P2: Pythagoras", "P2: Loci"],
                "a²+b²=c². Locus: equidistant from point (circle); equidistant from two points (perpendicular bisector).",
                "Find hypotenuse or shorter side. Construct perpendicular bisector of AB. Locus of P such that PA = 5 cm.",
                "Right triangle sides 3, 4, 5: find hypotenuse. Rectangle 6×8: diagonal length? Locus of points 5 cm from A.",
                "easy"), "learning_objective": "Use Pythagoras; simple loci"}],
        "medium": [], "difficult": [],
    },
}
for _b in (GEO_ANGLES, GEO_PYTH_LOCI):
    for d in ("easy", "medium", "difficult"):
        _b["prompts"].setdefault(d, [])
GEOMETRY_BETA = [GEO_ANGLES, GEO_PYTH_LOCI]

# ---- STATISTICS ----
STAT_REPRESENT = {
    "subtopic": "Data Representation and Averages",
    "prompts": {
        "easy": [{"id": "ST_BETA_Rep_E01", "subtopic": "Data Representation and Averages",
            "prompt": _base("Data Representation and Averages",
                ["Frequency tables", "Bar charts, pie charts", "Mean, median, mode", "Range"],
                ["P1, P2: Frequency tables", "P2: Bar/pie charts", "P1, P2: Mean/median/mode", "P2: Histogram"],
                "",
                "Discrete or grouped data. Find mean, median, mode, range. Draw or interpret bar/pie chart.",
                "Complete frequency table. Find mean, median, mode of 5, 7, 3, 7, 9. Draw bar chart. Interpret pie chart.",
                "easy"), "learning_objective": "Use frequency tables, charts, and averages"}],
        "medium": [{"id": "ST_BETA_Rep_M01", "subtopic": "Data Representation and Averages",
            "prompt": _base("Data Representation and Averages",
                ["Grouped data", "Estimate of mean", "Cumulative frequency", "Histogram"],
                ["P2: Grouped mean", "P2: Cumulative frequency", "P2: Histogram"],
                "Estimated mean: Σ(f×x)/Σf. Cumulative frequency; median, IQR from curve.",
                "Estimate mean for grouped data. Draw cumulative frequency curve; estimate median, quartiles. Draw histogram; use frequency density.",
                "Estimated mean. Cumulative frequency diagram. Histogram.",
                "medium"), "learning_objective": "Use grouped data, cumulative frequency, histograms"}],
        "difficult": [],
    },
}
STAT_PROB = {
    "subtopic": "Probability and Counting",
    "prompts": {
        "easy": [{"id": "ST_BETA_Prob_E01", "subtopic": "Probability and Counting",
            "prompt": _base("Probability and Counting",
                ["Simple probability P(A) = n(A)/n(S)", "Expected frequency", "Listing outcomes"],
                ["P1, P2: Simple probability", "P2: Expected frequency"],
                "P(A) = n(A)/n(S). Expected freq = P × number of trials.",
                "Single event. Dice, cards, beads. Find P(red). Expected number of red in 60 draws.",
                "Bag 3 red, 5 blue: P(red)? Fair dice: P(6). Expected 6s in 120 rolls.",
                "easy"), "learning_objective": "Simple probability and expected frequency"}],
        "medium": [], "difficult": [],
    },
}
for _b in (STAT_REPRESENT, STAT_PROB):
    for d in ("easy", "medium", "difficult"):
        _b["prompts"].setdefault(d, [])
STATISTICS_BETA = [STAT_REPRESENT, STAT_PROB]
