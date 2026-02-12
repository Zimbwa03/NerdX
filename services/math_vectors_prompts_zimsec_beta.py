#!/usr/bin/env python3
"""
ZIMSEC O-Level Mathematics – Vectors beta prompts.
Template-based, expanded prompts from ZIMSEC-Topics-10-13-Complete.md.
Contract: {subtopic, prompts: {easy, medium, difficult}}; each prompt {id, subtopic, prompt, learning_objective}.
"""

def _base(subtopic, form_coverage, objectives, exam_types, requirements, examples, skills, diff_tag):
    return f"""SUBTOPIC: {subtopic}
FORM COVERAGE: {form_coverage}

LEARNING OBJECTIVES:
{chr(10).join(f'- {o}' for o in objectives)}

EXAM QUESTION TYPES (ZIMSEC):
{chr(10).join(f'- {e}' for e in exam_types)}

REQUIREMENTS:
{requirements}

EXAMPLE QUESTION STYLES / TEMPLATES (vary numbers and contexts):
{examples}

SKILLS TO TEST: {skills}

DIFFICULTY: {diff_tag}. Use standard LaTeX for all mathematical expressions (inline $...$ and display $$...$$ where needed). Return valid JSON with question, solution, answer, points, explanation, teaching_explanation, zimsec_paper_reference, marking_notes."""


VEC_NOTATION_OPS = {
    "subtopic": "Vector Notation and Basic Operations",
    "prompts": {
        "easy": [
            {
                "id": "VE_BETA_Not_E01",
                "subtopic": "Vector Notation and Basic Operations",
                "prompt": _base(
                    "Vector Notation and Basic Operations",
                    "Form 1–2",
                    [
                        "Use column form (x, y) or xi + yj",
                        "Add and subtract vectors",
                        "Multiply by scalar",
                    ],
                    ["P1, P2: Find a + b, a - b, ka", "P2: Column vector addition/subtraction"],
                    "Use 2D column vectors. Small integers. Include a + b, a - c, 2a, 3b - 2c, or a + b + c style.",
                    "Vectors a=(3,2), b=(-1,4), c=(2,-3). Find: (a) a+b (b) a-c (c) 2a (d) 3b-2c (e) a+b+c.",
                    "Column vector operations",
                    "easy",
                ),
                "learning_objective": "Add, subtract, and scalar-multiply vectors in column form",
            },
        ],
        "medium": [
            {
                "id": "VE_BETA_Not_M01",
                "subtopic": "Vector Notation and Basic Operations",
                "prompt": _base(
                    "Vector Notation and Basic Operations",
                    "Form 1–2",
                    [
                        "Combine operations (e.g. 2a - 3b + c)",
                        "Use in coordinate contexts",
                    ],
                    ["P2: 2a + 3b - c", "P2: Express in terms of given vectors"],
                    "Combine three or more operations. Use i, j or column form.",
                    "Given a, b, c, find 2a - 3b + c. Or: Express OA + AB + BC in terms of position vectors.",
                    "Combined vector operations",
                    "medium",
                ),
                "learning_objective": "Perform combined vector operations",
            },
        ],
        "difficult": [],
    },
}

VEC_MAGNITUDE = {
    "subtopic": "Magnitude of Vectors",
    "prompts": {
        "easy": [],
        "medium": [
            {
                "id": "VE_BETA_Mag_M01",
                "subtopic": "Magnitude of Vectors",
                "prompt": _base(
                    "Magnitude of Vectors",
                    "Form 3",
                    [
                        "Use |v| = √(x² + y²)",
                        "Find unit vector; find vector of given magnitude in same direction",
                    ],
                    ["P2: Find |v|", "P2: Unit vector", "P2: Vector of given magnitude"],
                    "Use integer components where possible. Unit vector = v/|v|.",
                    "(a) v=(6,8). Find |v|. (b) Unit vector in direction of (3,4)? (c) Vector magnitude 10, same direction as (3,4). (d) |a|=5, |b|=12, a⊥b. Find |a+b|.",
                    "|v| = √(x² + y²), unit vectors",
                    "medium",
                ),
                "learning_objective": "Calculate magnitude and unit vectors",
            },
        ],
        "difficult": [],
    },
}

VEC_POSITION = {
    "subtopic": "Position Vectors",
    "prompts": {
        "easy": [
            {
                "id": "VE_BETA_Pos_E01",
                "subtopic": "Position Vectors",
                "prompt": _base(
                    "Position Vectors",
                    "Form 2–3",
                    [
                        "Write OA, OB, OC for points A, B, C",
                        "Use AB = OB - OA",
                        "Find vectors between points",
                    ],
                    ["P2: Position vectors OA, OB", "P2: Find AB, BC"],
                    "Use coordinates with small integers. O is origin.",
                    "Points A(2,3), B(5,7), C(-1,4). (a) Write OA, OB, OC. (b) Find AB, BC, AC. (c) Is A,B,C collinear?",
                    "Position vectors, AB = OB - OA",
                    "easy",
                ),
                "learning_objective": "Use position vectors and AB = OB - OA",
            },
        ],
        "medium": [
            {
                "id": "VE_BETA_Pos_M01",
                "subtopic": "Position Vectors",
                "prompt": _base(
                    "Position Vectors",
                    "Form 2–3",
                    [
                        "Midpoint M: OM = (OA + OB)/2",
                        "Point dividing AB in ratio",
                    ],
                    ["P2: Midpoint", "P2: Ratio division"],
                    "Ratio division from A: OP = (1-t)OA + t OB where t = ratio fraction.",
                    "A, B position vectors a, b. (a) Midpoint M – find OM. (b) P divides AB 2:1 from A – find OP. (c) Q divides AB 3:2 from A – find OQ.",
                    "Midpoint = (a+b)/2, ratio division",
                    "medium",
                ),
                "learning_objective": "Find midpoint and ratio division using position vectors",
            },
        ],
        "difficult": [],
    },
}

VEC_PARALLEL = {
    "subtopic": "Parallel and Scalar Multiples",
    "prompts": {
        "easy": [],
        "medium": [
            {
                "id": "VE_BETA_Par_M01",
                "subtopic": "Parallel and Scalar Multiples",
                "prompt": _base(
                    "Parallel and Scalar Multiples",
                    "Form 3–4",
                    [
                        "Recognise q = kp => parallel",
                        "Use parallel vectors in geometry",
                    ],
                    ["P2: Show q = kp", "P2: Conclude AB ∥ CD"],
                    "Use clear scalar multiples. Same direction or opposite.",
                    "(a) p=(2,3), q=(4,6). Show q=kp; parallel? (b) AB=2i+3j, DC=4i+6j. Conclude? (c) r=3i-2j, s=-6i+4j. Relationship?",
                    "Parallel vectors, scalar multiples",
                    "medium",
                ),
                "learning_objective": "Identify parallel vectors via scalar multiples",
            },
        ],
        "difficult": [],
    },
}

VEC_GEOMETRY = {
    "subtopic": "Vector Geometry",
    "prompts": {
        "easy": [],
        "medium": [
            {
                "id": "VE_BETA_Geo_M01",
                "subtopic": "Vector Geometry",
                "prompt": _base(
                    "Vector Geometry",
                    "Form 4",
                    [
                        "Express sides/diagonals in terms of given vectors",
                        "Use midpoints in shapes (e.g. parallelogram)",
                    ],
                    ["P2: Parallelogram OB, OM, etc.", "P2: Show collinear"],
                    "Parallelogram OABC: OA=a, OC=c. OB=a+c. Use midpoints of diagonals.",
                    "Parallelogram OABC. OA=a, OC=c. (a) OB in terms of a,c. (b) M midpoint of AC – OM? (c) N midpoint of OB. Show O,M,N collinear. (d) Ratio M divides AC?",
                    "Vector geometry, proofs",
                    "medium",
                ),
                "learning_objective": "Apply vectors in parallelogram and midpoint proofs",
            },
        ],
        "difficult": [
            {
                "id": "VE_BETA_Geo_D01",
                "subtopic": "Vector Geometry",
                "prompt": _base(
                    "Vector Geometry",
                    "Form 4",
                    [
                        "Prove collinearity using vectors",
                        "Express vectors in terms of two base vectors",
                        "Use ratio division in proofs",
                    ],
                    ["P2: Prove O,P,Q collinear", "P2: Ratio division in quadrilateral"],
                    "Triangle or quadrilateral. Medians, ratio division. Show collinearity via parallel vectors or c = λa + μb with λ+μ=1.",
                    "Triangle OAB. OA=a, OB=b. M midpoint of AB, N divides OB 2:1 from O. (a) OM, ON. (b) P on OM with OP=(2/3)OM – express OP. (c) Q on AN, AQ=(2/3)AN – OQ. (d) Prove O,P,Q collinear.",
                    "Vector proofs, medians, collinearity",
                    "difficult",
                ),
                "learning_objective": "Prove collinearity and use vectors in complex geometry",
            },
        ],
    },
}

VEC_COLLINEAR = {
    "subtopic": "Collinear Points",
    "prompts": {
        "easy": [],
        "medium": [
            {
                "id": "VE_BETA_Col_M01",
                "subtopic": "Collinear Points",
                "prompt": _base(
                    "Collinear Points",
                    "Form 4",
                    [
                        "C divides AB in ratio => express c in terms of a, b",
                        "Show collinearity from c = (λa + μb)/(λ+μ)",
                    ],
                    ["P2: Express c", "P2: Show A,B,C collinear", "P2: Ratio C divides AB"],
                    "Use ratio form for division. Collinear iff vectors parallel.",
                    "(a) C divides AB 2:3 from A – express c in terms of a,b. (b) Given c=(2a+3b)/5, show A,B,C collinear. (c) Ratio C divides AB?",
                    "Collinearity, ratio division",
                    "medium",
                ),
                "learning_objective": "Use ratio division and prove collinearity",
            },
        ],
        "difficult": [],
    },
}

VEC_COORDINATE = {
    "subtopic": "Vectors in Coordinate Plane",
    "prompts": {
        "easy": [],
        "medium": [
            {
                "id": "VE_BETA_Coord_M01",
                "subtopic": "Vectors in Coordinate Plane",
                "prompt": _base(
                    "Vectors in Coordinate Plane",
                    "Form 3–4",
                    [
                        "Find AB, BC, CD, DA as column vectors",
                        "Use |AB|, |BC|",
                        "Show parallel (e.g. AB ∥ DC) and identify quadrilateral",
                    ],
                    ["P2: Sides as vectors", "P2: Show parallel", "P2: Type of quadrilateral"],
                    "Four points given. Compute sides, magnitudes, check parallel pairs.",
                    "A(1,2), B(4,6), C(7,3), D(4,-1). (a) AB, BC, CD, DA. (b) |AB|, |BC|. (c) Show AB ∥ DC. (d) What is ABCD?",
                    "Coordinate vectors, properties",
                    "medium",
                ),
                "learning_objective": "Use vectors in coordinate geometry and identify shapes",
            },
        ],
        "difficult": [],
    },
}

VEC_COMBINED = {
    "subtopic": "Combined Vector Problems",
    "prompts": {
        "easy": [],
        "medium": [],
        "difficult": [
            {
                "id": "VE_BETA_Comb_D01",
                "subtopic": "Combined Vector Problems",
                "prompt": _base(
                    "Combined Vector Problems",
                    "Form 4",
                    [
                        "Express OB, OD etc. in terms of a, c",
                        "Prove collinearity (e.g. C, D, E)",
                        "Find ratio division",
                    ],
                    ["P2: Multi-part quadrilateral", "P2: Prove collinear", "P2: Ratio"],
                    "Quadrilateral OABC. B on AC, D on OB, E midpoint OA. Combine ratio division, midpoints, collinearity.",
                    "OABC. OA=6a, OC=6c. B divides AC 3:1 from A. (a) OB in terms of a,c. (b) D on OB, OD:DB=2:1 – OD? (c) E midpoint OA. Prove C,D,E collinear. (d) Ratio D divides CE?",
                    "Multiple vector concepts, complex proof",
                    "difficult",
                ),
                "learning_objective": "Solve combined vector problems and prove collinearity",
            },
        ],
    },
}

for _b in (VEC_NOTATION_OPS, VEC_MAGNITUDE, VEC_POSITION, VEC_PARALLEL, VEC_GEOMETRY, VEC_COLLINEAR, VEC_COORDINATE, VEC_COMBINED):
    for d in ("easy", "medium", "difficult"):
        _b["prompts"].setdefault(d, [])

VECTOR_PROMPTS_BETA = [
    VEC_NOTATION_OPS,
    VEC_MAGNITUDE,
    VEC_POSITION,
    VEC_PARALLEL,
    VEC_GEOMETRY,
    VEC_COLLINEAR,
    VEC_COORDINATE,
    VEC_COMBINED,
]
