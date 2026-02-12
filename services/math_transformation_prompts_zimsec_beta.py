#!/usr/bin/env python3
"""
ZIMSEC O-Level Mathematics – Transformation beta prompts.
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


TF_TRANSLATION = {
    "subtopic": "Translation",
    "prompts": {
        "easy": [
            {
                "id": "TF_BETA_Trn_E01",
                "subtopic": "Translation",
                "prompt": _base(
                    "Translation",
                    "Form 1–3",
                    [
                        "Translate shape by vector (x, y)",
                        "Find image vertices",
                        "Describe single translation mapping one shape to another",
                        "Find inverse vector (map back)",
                    ],
                    ["P2: Translate by vector", "P2: Describe A → C", "P2: Vector mapping C → A"],
                    "Use column vector (x, y). Integer coordinates. Triangle or simple polygon.",
                    "Triangle A: (1,2), (3,2), (2,4). (a) Translate by (3,-1). Draw B. (b) Translate B by (-2,3). Draw C. (c) Describe single transformation A→C. (d) Vector mapping C→A?",
                    "Translation vectors, inverse",
                    "easy",
                ),
                "learning_objective": "Translate shapes by vectors and describe/invert translations",
            },
        ],
        "medium": [],
        "difficult": [],
    },
}

TF_REFLECTION = {
    "subtopic": "Reflection",
    "prompts": {
        "easy": [
            {
                "id": "TF_BETA_Ref_E01",
                "subtopic": "Reflection",
                "prompt": _base(
                    "Reflection",
                    "Form 2–4",
                    [
                        "Reflect in x-axis, y-axis, y = x, y = -x",
                        "Draw images; state mirror line",
                    ],
                    ["P2: Reflect in y-axis", "P2: Reflect in x-axis", "P2: Reflect in y = x or y = -x"],
                    "Use axes or diagonal lines. Integer coordinates. x-axis: (x,y)→(x,-y); y-axis: (-x,y); y=x: (y,x); y=-x: (-y,-x).",
                    "Triangle P: (1,1), (3,1), (2,3). (a) Reflect in x-axis → Q. (b) Reflect in y-axis → R. (c) Reflect in y=x → S. (d) Reflect in y=-x → T. (e) Describe P→Q→R.",
                    "Reflections in axes and diagonal lines",
                    "easy",
                ),
                "learning_objective": "Reflect shapes in axes and y=x, y=-x",
            },
        ],
        "medium": [],
        "difficult": [],
    },
}

TF_ROTATION = {
    "subtopic": "Rotation",
    "prompts": {
        "easy": [],
        "medium": [
            {
                "id": "TF_BETA_Rot_M01",
                "subtopic": "Rotation",
                "prompt": _base(
                    "Rotation",
                    "Form 3–4",
                    [
                        "Rotate 90° acw/cw about origin",
                        "Rotate 180° about origin or other point",
                        "Describe single transformation (e.g. two 90° rotations = 180°)",
                    ],
                    ["P2: Rotate 90° about origin", "P2: Rotate 180° about point", "P2: Describe A→C"],
                    "State centre, angle, direction. 90° acw about O: (x,y)→(-y,x); 180°: (-x,-y).",
                    "Square A: (1,0), (2,0), (2,1), (1,1). (a) Rotate 90° acw about O → B. (b) Rotate B 90° acw about O → C. (c) Single transformation A→C? (d) Rotate 180° about (1,1) → D.",
                    "Rotation about origin and other points",
                    "medium",
                ),
                "learning_objective": "Rotate shapes and describe composite rotations",
            },
        ],
        "difficult": [],
    },
}

TF_ENLARGEMENT = {
    "subtopic": "Enlargement",
    "prompts": {
        "easy": [],
        "medium": [
            {
                "id": "TF_BETA_Enl_M01",
                "subtopic": "Enlargement",
                "prompt": _base(
                    "Enlargement",
                    "Form 3–4",
                    [
                        "Enlarge by positive scale factor from origin or centre",
                        "Enlarge by fractional scale factor",
                        "Enlarge by negative scale factor (invariant point = centre)",
                        "Identify scale factor -1 as half-turn about centre",
                    ],
                    ["P2: Enlarge scale factor 2, centre (0,0)", "P2: Enlarge scale factor 3, centre (1,1)", "P2: What is scale factor -1?"],
                    "State centre and scale factor. Positive: enlarge; 0<k<1: reduce; k<0: enlarge + inversion.",
                    "Triangle P: (1,1), (2,1), (1,2). (a) Enlarge sf 2, centre O → Q. (b) Enlarge sf -1, centre O → R. (c) Enlarge sf 3, centre (1,1) → S. (d) What transformation is sf -1?",
                    "Positive and negative scale factors, different centres",
                    "medium",
                ),
                "learning_objective": "Enlarge shapes with positive, fractional, and negative scale factors",
            },
        ],
        "difficult": [],
    },
}

TF_COMBINED = {
    "subtopic": "Combined Transformations",
    "prompts": {
        "easy": [],
        "medium": [
            {
                "id": "TF_BETA_Comb_M01",
                "subtopic": "Combined Transformations",
                "prompt": _base(
                    "Combined Transformations",
                    "Form 3–4",
                    [
                        "Perform reflection then rotation (or similar)",
                        "Describe single transformation mapping object to final image",
                        "Find 2×2 matrix for composite transformation",
                    ],
                    ["P2: Reflect then rotate", "P2: Describe A→C", "P2: Matrix for A→C"],
                    "Apply in order. Matrix product = right-to-left order of operations.",
                    "Shape A: (1,2), (3,2), (2,4). (a) Reflect in y-axis → B. (b) Rotate B 90° clockwise about O → C. (c) Describe single transformation A→C. (d) Matrix for A→C.",
                    "Composite transformations",
                    "medium",
                ),
                "learning_objective": "Perform and describe combined transformations; use matrices",
            },
        ],
        "difficult": [],
    },
}

TF_MATRICES = {
    "subtopic": "Transformation Matrices",
    "prompts": {
        "easy": [],
        "medium": [
            {
                "id": "TF_BETA_Mat_M01",
                "subtopic": "Transformation Matrices",
                "prompt": _base(
                    "Transformation Matrices",
                    "Form 4",
                    [
                        "Give 2×2 matrix for reflection in x-axis, y-axis, y=x",
                        "Give matrix for rotation 90° acw, 180° about origin",
                        "Give matrix for enlargement scale factor k, centre origin",
                    ],
                    ["P2: Matrix for reflection/rotation/enlargement"],
                    "Reflection x: [-1 0; 0 1]; y: [1 0; 0 -1]; y=x: [0 1; 1 0]. Rotation 90° acw: [0 -1; 1 0]; 180°: [-1 0; 0 -1]. Enlargement k: [k 0; 0 k].",
                    "Find matrix for: (a) reflection in x-axis (b) y-axis (c) y=x (d) rotation 90° acw about O (e) 180° about O (f) enlargement sf k, centre O.",
                    "Transformation matrices",
                    "medium",
                ),
                "learning_objective": "Write 2×2 matrices for standard transformations",
            },
        ],
        "difficult": [],
    },
}

TF_STRETCH = {
    "subtopic": "Stretch",
    "prompts": {
        "easy": [],
        "medium": [],
        "difficult": [
            {
                "id": "TF_BETA_Str_D01",
                "subtopic": "Stretch",
                "prompt": _base(
                    "Stretch",
                    "Form 4",
                    [
                        "One-way stretch parallel to x-axis or y-axis",
                        "Two-way stretch",
                        "Matrix form [k 0; 0 1], [1 0; 0 k], [k 0; 0 m]",
                        "Identify invariant lines",
                    ],
                    ["P2: One-way/two-way stretch", "P2: Matrix", "P2: Invariant line"],
                    "One-way: one axis invariant. Two-way: both scale.",
                    "Rectangle (0,0), (4,0), (4,2), (0,2). (a) One-way stretch factor 2 || x-axis. Draw image. (b) Factor 3 || y-axis. (c) Two-way: 2 (x), 3 (y). (d) Matrix for (c). (e) Invariant line in (a)?",
                    "Stretch matrices, invariant lines",
                    "difficult",
                ),
                "learning_objective": "Apply stretch transformations and use matrices",
            },
        ],
    },
}

TF_SHEAR = {
    "subtopic": "Shear",
    "prompts": {
        "easy": [],
        "medium": [],
        "difficult": [
            {
                "id": "TF_BETA_Shr_D01",
                "subtopic": "Shear",
                "prompt": _base(
                    "Shear",
                    "Form 4",
                    [
                        "Shear with x-axis or y-axis invariant",
                        "Use matrix [1 k; 0 1] or [1 0; k 1]",
                        "Given invariant line and image of one point, find matrix",
                    ],
                    ["P2: Shear", "P2: Matrix for shear"],
                    "x-axis invariant: [1 k; 0 1]; (0,1)→(k,1). y-axis invariant: [1 0; k 1]; (1,0)→(1,k).",
                    "Square (0,0), (2,0), (2,2), (0,2). (a) Shear: x-axis invariant, (0,1)→(1,1). Draw image. (b) Matrix. (c) Shear: y-axis invariant, (1,0)→(1,2). (d) Matrix for (c).",
                    "Shear matrices [1 k; 0 1], [1 0; k 1]",
                    "difficult",
                ),
                "learning_objective": "Apply shear and write shear matrices",
            },
        ],
    },
}

TF_DESCRIBING = {
    "subtopic": "Describing Transformations",
    "prompts": {
        "easy": [],
        "medium": [
            {
                "id": "TF_BETA_Des_M01",
                "subtopic": "Describing Transformations",
                "prompt": _base(
                    "Describing Transformations",
                    "Form 3–4",
                    [
                        "Fully describe transformation mapping A to B",
                        "Include type, centre/mirror line, scale factor/angle as applicable",
                    ],
                    ["P2: Describe transformation A→B"],
                    "From coordinate changes or diagram. Reflection: mirror line. Rotation: centre, angle, direction. Enlargement: centre, scale factor. Translation: vector.",
                    "Object A, image B. Describe fully: (a) A(2,3)→B(-2,3) (b) A(1,2)→B(2,4) (c) A(2,1)→B(1,2) (d) triangle→triangle twice as large.",
                    "Identifying transformation type and properties",
                    "medium",
                ),
                "learning_objective": "Describe transformations fully from object and image",
            },
        ],
        "difficult": [],
    },
}

TF_INVARIANT = {
    "subtopic": "Invariant Points and Lines",
    "prompts": {
        "easy": [],
        "medium": [],
        "difficult": [
            {
                "id": "TF_BETA_Inv_D01",
                "subtopic": "Invariant Points and Lines",
                "prompt": _base(
                    "Invariant Points and Lines",
                    "Form 4",
                    [
                        "Find invariant points (map to themselves)",
                        "Find invariant lines (line maps to itself)",
                    ],
                    ["P2: Invariant points", "P2: Invariant lines"],
                    "Reflection in y=x: points on line invariant. Rotation 180°: centre only. Enlargement: centre only. Shear: invariant axis.",
                    "(a) Reflection in y=x: invariant points? (b) Rotation 180° about O: invariant point? (c) Enlargement sf 3, centre (2,3): invariant? (d) Shear [1 2; 0 1]: invariant line? (e) [2 0; 0 2]: invariant points?",
                    "Invariance concepts",
                    "difficult",
                ),
                "learning_objective": "Find invariant points and lines for transformations",
            },
        ],
    },
}

for _b in (TF_TRANSLATION, TF_REFLECTION, TF_ROTATION, TF_ENLARGEMENT, TF_COMBINED,
           TF_MATRICES, TF_STRETCH, TF_SHEAR, TF_DESCRIBING, TF_INVARIANT):
    for d in ("easy", "medium", "difficult"):
        _b["prompts"].setdefault(d, [])

TRANSFORMATION_PROMPTS_BETA = [
    TF_TRANSLATION,
    TF_REFLECTION,
    TF_ROTATION,
    TF_ENLARGEMENT,
    TF_COMBINED,
    TF_MATRICES,
    TF_STRETCH,
    TF_SHEAR,
    TF_DESCRIBING,
    TF_INVARIANT,
]
