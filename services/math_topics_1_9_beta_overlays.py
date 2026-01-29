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
for d in ("easy", "medium", "difficult"):
    SETS_VENN["prompts"].setdefault(d, [])
SETS_BETA = [SETS_VENN]

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
for d in ("easy", "medium", "difficult"):
    MM_AREA_VOL["prompts"].setdefault(d, [])
MENSURATION_BETA = [MM_AREA_VOL]

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
for d in ("easy", "medium", "difficult"):
    GR_LINEAR["prompts"].setdefault(d, [])
GRAPHS_BETA = [GR_LINEAR]

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

# ---- ALGEBRA (light overlay; already rich in main prompts) ----
ALG_EXPRESSIONS = {
    "subtopic": "Algebraic Manipulation and Equations",
    "prompts": {
        "easy": [{"id": "AL_BETA_Expr_E01", "subtopic": "Algebraic Manipulation and Equations",
            "prompt": _base("Algebraic Manipulation and Equations",
                ["Simplify, expand, factorise", "Linear equations", "Change of subject"],
                ["P1, P2: Simplify", "P1, P2: Factorise", "P1, P2: Solve linear equation", "P2: Change subject"],
                "",
                "Expand (a+b)(c+d). Factorise ax²+bx+c. Solve 3x+4=10. Make x subject of y=2x-5.",
                "Expand and simplify. Factorise. Solve 5-2x=3(x+7). Make t subject of v=u+at.",
                "easy"), "learning_objective": "Simplify, expand, factorise; solve linear equations"}],
        "medium": [{"id": "AL_BETA_Expr_M01", "subtopic": "Algebraic Manipulation and Equations",
            "prompt": _base("Algebraic Manipulation and Equations",
                ["Simultaneous equations", "Quadratic equations", "Inequalities", "Indices"],
                ["P2: Simultaneous", "P2: Quadratics", "P2: Inequalities", "P1, P2: Indices"],
                "",
                "Elimination or substitution. Factorise or formula for quadratics. Solve 2x+3 < 7. Use a^m × a^n = a^(m+n) etc.",
                "Solve 2x+y=11, x-y=1. Solve x²-7x+10=0. Solve -3x+4 ≤ 16. Simplify 2³ × 2⁵.",
                "medium"), "learning_objective": "Solve simultaneous and quadratic equations; use indices"}],
        "difficult": [],
    },
}
for d in ("easy", "medium", "difficult"):
    ALG_EXPRESSIONS["prompts"].setdefault(d, [])
ALGEBRA_BETA = [ALG_EXPRESSIONS]

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
for d in ("easy", "medium", "difficult"):
    GEO_ANGLES["prompts"].setdefault(d, [])
GEOMETRY_BETA = [GEO_ANGLES]

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
for d in ("easy", "medium", "difficult"):
    STAT_REPRESENT["prompts"].setdefault(d, [])
STATISTICS_BETA = [STAT_REPRESENT]
