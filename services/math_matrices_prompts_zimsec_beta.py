#!/usr/bin/env python3
"""
ZIMSEC O-Level Mathematics – Matrices beta prompts.
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


MAT_ORDER_TYPES = {
    "subtopic": "Order and Types of Matrices",
    "prompts": {
        "easy": [
            {
                "id": "MA_BETA_Ord_E01",
                "subtopic": "Order and Types of Matrices",
                "prompt": _base(
                    "Order and Types of Matrices",
                    "Form 1",
                    [
                        "State order (m × n)",
                        "Identify row, column, square, zero, identity",
                    ],
                    ["P1, P2: State order", "P2: Identify type"],
                    "Use 2×2 or 2×3, 1×n, n×1. Identity I = [1 0; 0 1]. Zero = [0 0; 0 0].",
                    "State order and type: (a) [2 3 5] (b) [1 0; 0 1] (c) [2; 3; 4] (d) [0 0; 0 0] (e) [1 2 3; 4 5 6].",
                    "Matrix identification",
                    "easy",
                ),
                "learning_objective": "Identify order and type of matrices",
            },
        ],
        "medium": [],
        "difficult": [],
    },
}

MAT_ADD_SUB = {
    "subtopic": "Addition and Subtraction",
    "prompts": {
        "easy": [
            {
                "id": "MA_BETA_Add_E01",
                "subtopic": "Addition and Subtraction",
                "prompt": _base(
                    "Addition and Subtraction",
                    "Form 2",
                    [
                        "Add and subtract matrices of same order",
                        "Combine with scalar multiplication (e.g. 2A + B)",
                    ],
                    ["P1, P2: A + B, A - C", "P2: A + B - C, 2A + B"],
                    "Same order. Small integers.",
                    "A=[2 3; 5 1], B=[1 4; 2 3], C=[3 1; 0 2]. Find (a) A+B (b) A-C (c) A+B-C (d) 2A+B.",
                    "Matrix addition/subtraction, scalar multiplication",
                    "easy",
                ),
                "learning_objective": "Add and subtract matrices; scalar multiplication",
            },
        ],
        "medium": [],
        "difficult": [],
    },
}

MAT_MULTIPLY = {
    "subtopic": "Matrix Multiplication",
    "prompts": {
        "easy": [],
        "medium": [
            {
                "id": "MA_BETA_Mul_M01",
                "subtopic": "Matrix Multiplication",
                "prompt": _base(
                    "Matrix Multiplication",
                    "Form 2–3",
                    [
                        "Multiply matrices (compatible orders)",
                        "Check AB ≠ BA in general",
                        "Use identity: AI = IA = A",
                    ],
                    ["P2: AB, BA", "P2: AC = A when C = I", "P2: A²"],
                    "2×2 matrices. Use small integers. Note non-commutativity.",
                    "A=[2 3; 1 4], B=[3 1; 2 5], C=I. Find (a) AB (b) BA (c) AC (d) Is AB=BA? (e) A².",
                    "Matrix multiplication, commutativity",
                    "medium",
                ),
                "learning_objective": "Multiply matrices and understand non-commutativity",
            },
        ],
        "difficult": [],
    },
}

MAT_DETERMINANT = {
    "subtopic": "Determinants",
    "prompts": {
        "easy": [],
        "medium": [
            {
                "id": "MA_BETA_Det_M01",
                "subtopic": "Determinants",
                "prompt": _base(
                    "Determinants",
                    "Form 3",
                    [
                        "Use det(A) = ad - bc for 2×2",
                        "Identify singular (det = 0)",
                    ],
                    ["P2: Find det(A)", "P2: Find k for singular"],
                    "2×2 only. Include negative entries. Singular: det = 0.",
                    "Find det: (a) [3 2; 5 4] (b) [2 -3; 4 5] (c) [6 3; 4 2]. (d) For what k is [2 k; 4 6] singular?",
                    "det(A) = ad - bc, singular matrices",
                    "medium",
                ),
                "learning_objective": "Calculate determinants and identify singular matrices",
            },
        ],
        "difficult": [],
    },
}

MAT_INVERSE = {
    "subtopic": "Inverse Matrices",
    "prompts": {
        "easy": [],
        "medium": [
            {
                "id": "MA_BETA_Inv_M01",
                "subtopic": "Inverse Matrices",
                "prompt": _base(
                    "Inverse Matrices",
                    "Form 3",
                    [
                        "Find A⁻¹ = (1/det)[d -b; -c a] for 2×2",
                        "Verify AA⁻¹ = I",
                    ],
                    ["P2: Find A⁻¹", "P2: Verify AA⁻¹ = I"],
                    "Non-singular 2×2. Integer entries where possible.",
                    "Find inverse: (a) [2 3; 1 4] (b) [5 2; 3 1]. (c) Verify AA⁻¹=I for (a). (d) [4 3; 3 2].",
                    "A⁻¹ = (1/det)[d -b; -c a]",
                    "medium",
                ),
                "learning_objective": "Find inverse of 2×2 matrix and verify",
            },
        ],
        "difficult": [],
    },
}

MAT_SIMULTANEOUS = {
    "subtopic": "Simultaneous Equations",
    "prompts": {
        "easy": [],
        "medium": [
            {
                "id": "MA_BETA_Sim_M01",
                "subtopic": "Simultaneous Equations",
                "prompt": _base(
                    "Simultaneous Equations",
                    "Form 3",
                    [
                        "Write system as AX = B",
                        "Solve X = A⁻¹B",
                    ],
                    ["P2: Solve 2×2 system using matrices"],
                    "Two equations, two unknowns. Integer or simple fraction solutions.",
                    "Solve using matrices: (a) 2x+3y=11, x+4y=13 (b) 5x+2y=9, 3x+y=5. (c) Write 4x-y=7, 3x+2y=8 in matrix form and solve.",
                    "AX = B, X = A⁻¹B",
                    "medium",
                ),
                "learning_objective": "Solve simultaneous equations using matrices",
            },
        ],
        "difficult": [],
    },
}

MAT_EQUATIONS = {
    "subtopic": "Matrix Equations",
    "prompts": {
        "easy": [],
        "medium": [
            {
                "id": "MA_BETA_Eq_M01",
                "subtopic": "Matrix Equations",
                "prompt": _base(
                    "Matrix Equations",
                    "Form 3",
                    [
                        "Solve AX = B for X",
                        "Evaluate A² - 5A + 2I type expressions",
                    ],
                    ["P2: Find X from AX = B", "P2: Polynomial in A"],
                    "2×2. X column vector or 2×2 as appropriate.",
                    "(a) [2 3; 1 4]X = [5; 7]. Find X. (b) A=[1 2; 3 4]. Find A² - 5A + 2I. (c) [a b; c d][2; 3]=[8; 10]. Find a+c and b+d.",
                    "Solving matrix equations",
                    "medium",
                ),
                "learning_objective": "Solve matrix equations and evaluate matrix expressions",
            },
        ],
        "difficult": [],
    },
}

MAT_TRANSFORM = {
    "subtopic": "Transformation Matrices",
    "prompts": {
        "easy": [],
        "medium": [
            {
                "id": "MA_BETA_Tra_M01",
                "subtopic": "Transformation Matrices",
                "prompt": _base(
                    "Transformation Matrices",
                    "Form 3–4",
                    [
                        "Identify transformation from matrix",
                        "Give matrix for reflection in x/y-axis, rotation 90°, enlargement",
                    ],
                    ["P2: What transformation?", "P2: Matrix for reflection/rotation/enlargement"],
                    "Link to Topic 13. Reflection x-axis: [-1 0; 0 1]. y-axis: [1 0; 0 -1]. Rotation 90° acw: [0 -1; 1 0]. Enlargement k: [k 0; 0 k].",
                    "(a) [0 -1; 1 0] represents what? (b) Matrix for reflection in x-axis. (c) Rotation 90° acw about origin. (d) Enlargement scale factor 3, centre origin.",
                    "Transformation matrices",
                    "medium",
                ),
                "learning_objective": "Relate 2×2 matrices to transformations",
            },
        ],
        "difficult": [],
    },
}

MAT_COMBINED = {
    "subtopic": "Combined Operations",
    "prompts": {
        "easy": [],
        "medium": [],
        "difficult": [
            {
                "id": "MA_BETA_Comb_D01",
                "subtopic": "Combined Operations",
                "prompt": _base(
                    "Combined Operations",
                    "Form 3",
                    [
                        "Use det(PQ) = det(P)det(Q)",
                        "Use (PQ)⁻¹ = Q⁻¹P⁻¹",
                    ],
                    ["P2: PQ, det(P), det(Q), det(PQ)", "P2: (PQ)⁻¹ vs Q⁻¹P⁻¹"],
                    "2×2. Verify det and inverse properties.",
                    "P=[2 1; 3 2], Q=[1 3; 2 4]. (a) PQ (b) det(P), det(Q) (c) det(PQ) (d) det(PQ)=det(P)det(Q)? (e) P⁻¹, Q⁻¹ (f) (PQ)⁻¹ (g) (PQ)⁻¹=Q⁻¹P⁻¹?",
                    "Multiple matrix properties",
                    "difficult",
                ),
                "learning_objective": "Apply determinant and inverse properties",
            },
        ],
    },
}

MAT_APPLICATION = {
    "subtopic": "Matrix Applications",
    "prompts": {
        "easy": [],
        "medium": [
            {
                "id": "MA_BETA_App_M01",
                "subtopic": "Matrix Applications",
                "prompt": _base(
                    "Matrix Applications",
                    "Form 3",
                    [
                        "Form linear system from real-world context",
                        "Solve via matrix method",
                        "Use solution for further calculation",
                    ],
                    ["P2: Word problem → matrix → solve → apply"],
                    "Two unknowns (e.g. price of two items). Integer or simple decimal data.",
                    "Shop: Monday 20 apples, 15 oranges, $65; Tuesday 15 apples, 25 oranges, $75. (a) Equations for apple (a) and orange (o). (b) Matrix form. (c) Solve. (d) Cost of 30 apples and 20 oranges.",
                    "Real-world matrix applications",
                    "medium",
                ),
                "learning_objective": "Apply matrices to word problems",
            },
        ],
        "difficult": [],
    },
}

for _b in (MAT_ORDER_TYPES, MAT_ADD_SUB, MAT_MULTIPLY, MAT_DETERMINANT, MAT_INVERSE,
           MAT_SIMULTANEOUS, MAT_EQUATIONS, MAT_TRANSFORM, MAT_COMBINED, MAT_APPLICATION):
    for d in ("easy", "medium", "difficult"):
        _b["prompts"].setdefault(d, [])

MATRIX_PROMPTS_BETA = [
    MAT_ORDER_TYPES,
    MAT_ADD_SUB,
    MAT_MULTIPLY,
    MAT_DETERMINANT,
    MAT_INVERSE,
    MAT_SIMULTANEOUS,
    MAT_EQUATIONS,
    MAT_TRANSFORM,
    MAT_COMBINED,
    MAT_APPLICATION,
]
