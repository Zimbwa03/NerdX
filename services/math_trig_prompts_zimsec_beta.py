#!/usr/bin/env python3
"""
ZIMSEC O-Level Mathematics – Trigonometry beta prompts.
Template-based, expanded prompts from ZIMSEC-Topics-10-13-Complete.md.
Contract: {subtopic, prompts: {easy, medium, difficult}}; each prompt {id, subtopic, prompt, learning_objective}.
"""

# Subtopics from ZIMSEC: Pythagoras, Trig Ratios Acute, Solving Right Triangles, Elevation/Depression,
# Obtuse Trig, Sine Rule, Cosine Rule, Area of Triangle, 3D Trig, Mixed Trig.

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

DIFFICULTY: {diff_tag} – Vary scenario and calculations accordingly. Use plain-text math only (no LaTeX).
Return valid JSON with question, solution, answer, points, explanation, teaching_explanation, zimsec_paper_reference, marking_notes."""


TRIG_PYTHAGORAS = {
    "subtopic": "Pythagoras Theorem",
    "prompts": {
        "easy": [
            {
                "id": "TR_BETA_Pyth_E01",
                "subtopic": "Pythagoras Theorem",
                "prompt": _base(
                    "Pythagoras Theorem",
                    "Form 2–3",
                    [
                        "Apply a² + b² = c² in right-angled triangles",
                        "Identify Pythagorean triples",
                        "Use Pythagoras in simple applications (ladder, rectangle diagonal)",
                    ],
                    ["P1, P2: Find hypotenuse given two sides", "P1, P2: Find one side given hypotenuse and other side", "P2: Pythagorean triple check", "P2: Ladder/wall or rectangle diagonal"],
                    "Right-angled triangles only. Use integer or simple decimal sides (e.g. 3, 4, 5 or 5, 12, 13). Give lengths in cm or m. Angles in degrees.",
                    "(a) Right triangle: sides 5 cm and 12 cm. Find hypotenuse. (b) Hypotenuse 13 cm, one side 5 cm. Find other side. (c) Are 9, 12, 15 a Pythagorean triple? (d) Ladder 10 m leans against wall, foot 6 m from wall. Height reached? (e) Rectangle diagonal 15 cm, length 12 cm. Find width.",
                    "a² + b² = c², Pythagorean triples, applications",
                    "easy",
                ),
                "learning_objective": "Apply Pythagoras theorem and recognise Pythagorean triples",
            },
        ],
        "medium": [
            {
                "id": "TR_BETA_Pyth_M01",
                "subtopic": "Pythagoras Theorem",
                "prompt": _base(
                    "Pythagoras Theorem",
                    "Form 2–3",
                    [
                        "Apply Pythagoras in multi-step or real-world problems",
                        "Combine with unit conversion or basic algebra where appropriate",
                    ],
                    ["P2: Ladder/wall, rectangle diagonal", "P2: Combined shape (e.g. isosceles triangle height then area)"],
                    "Use real-world contexts (ladder, building, field). Allow one unknown side in terms of another if appropriate.",
                    "Ladder 10 m, foot 6 m from wall – height? Rectangle 15 cm diagonal, 12 cm length – width? Find height of isosceles triangle with equal sides 10 cm and base 12 cm, then area.",
                    "Pythagoras in applications, multi-step",
                    "medium",
                ),
                "learning_objective": "Use Pythagoras in applied and multi-step problems",
            },
        ],
        "difficult": [
            {
                "id": "TR_BETA_Pyth_D01",
                "subtopic": "Pythagoras Theorem",
                "prompt": _base(
                    "Pythagoras Theorem",
                    "Form 2–3",
                    [
                        "Apply Pythagoras in non-routine or compound shapes",
                        "Link to other concepts (e.g. perimeter, area, optimisation)",
                    ],
                    ["P2: Compound shapes", "P2: Word problems with two right triangles"],
                    "Compound shapes or two right-angled triangles sharing a side. May involve perimeter/area.",
                    "Two right triangles share a common side; given some sides find another. Or: rectangular plot with diagonal path – find total distance or cost.",
                    "Pythagoras in compound figures, optimisation",
                    "difficult",
                ),
                "learning_objective": "Apply Pythagoras in compound shapes and non-routine problems",
            },
        ],
    },
}

TRIG_RATIOS_ACUTE = {
    "subtopic": "Trig Ratios – Acute Angles",
    "prompts": {
        "easy": [
            {
                "id": "TR_BETA_Acute_E01",
                "subtopic": "Trig Ratios – Acute Angles",
                "prompt": _base(
                    "Trig Ratios – Acute Angles",
                    "Form 2",
                    ["Define and use sin, cos, tan for acute angles", "Use SOH CAH TOA", "Find exact or calculator values"],
                    ["P2: Find sin, cos, tan of an angle", "P2: Given sides, find ratios"],
                    "Right-angled triangles. Use simple side lengths (e.g. 3, 4, 5 or 5, 12, 13). Angles to 1 d.p. where needed.",
                    "Right-angled triangle ABC, right angle at B. AB = 3 cm, BC = 4 cm. (a) Find AC (b) Find sin A, cos A, tan A (c) Find angle A to 1 d.p.",
                    "SOH CAH TOA, exact values",
                    "easy",
                ),
                "learning_objective": "Use sin, cos, tan for acute angles in right-angled triangles",
            },
        ],
        "medium": [
            {
                "id": "TR_BETA_Acute_M01",
                "subtopic": "Trig Ratios – Acute Angles",
                "prompt": _base(
                    "Trig Ratios – Acute Angles",
                    "Form 2",
                    ["Find unknown sides using trig ratios", "Find angles using inverse trig"],
                    ["P2: Angle and one side given, find another side", "P2: Two sides given, find angle"],
                    "Right-angled only. Use inverse sin/cos/tan for angles. Round angles to 1 d.p.",
                    "Right triangle: one angle 35°, hypotenuse 10 cm – find opposite and adjacent. Or: opposite 8 cm, adjacent 6 cm – find acute angles.",
                    "Sin, cos, tan; inverse trig functions",
                    "medium",
                ),
                "learning_objective": "Solve right-angled triangles using trig ratios and inverse trig",
            },
        ],
        "difficult": [],
    },
}

TRIG_RIGHT_TRIANGLES = {
    "subtopic": "Solving Right Triangles",
    "prompts": {
        "easy": [],
        "medium": [
            {
                "id": "TR_BETA_Right_M01",
                "subtopic": "Solving Right Triangles",
                "prompt": _base(
                    "Solving Right Triangles",
                    "Form 2–3",
                    ["Solve (find all unknown sides and angles) in right-angled triangles", "Use sin, cos, tan and inverse trig"],
                    ["P2: One angle and one side given", "P2: Two sides given"],
                    "Right-angled triangles only. Give all sides and angles. Use degrees, 1 d.p. for angles.",
                    "(a) One angle 35°, hypotenuse 10 cm. (b) One angle 52°, adjacent 7 cm. (c) Opposite 8 cm, adjacent 6 cm. (d) Hypotenuse 15 cm, one side 9 cm. Find all unknowns.",
                    "Sin, cos, tan; inverse trig functions",
                    "medium",
                ),
                "learning_objective": "Solve right-angled triangles completely using trig",
            },
        ],
        "difficult": [],
    },
}

TRIG_ELEVATION_DEPRESSION = {
    "subtopic": "Angles of Elevation and Depression",
    "prompts": {
        "easy": [
            {
                "id": "TR_BETA_Elev_E01",
                "subtopic": "Angles of Elevation and Depression",
                "prompt": _base(
                    "Angles of Elevation and Depression",
                    "Form 3",
                    ["Apply trig to angles of elevation and depression", "Solve for height or horizontal distance"],
                    ["P2: Tower height from angle and distance", "P2: Distance from cliff to boat using depression"],
                    "Real-world contexts: tower, cliff, building, observer height. Use clear diagrams. Angles in degrees.",
                    "(a) From 50 m from tower base, angle of elevation to top 38°. Tower height? (b) From top of 80 m cliff, angle of depression to boat 25°. Distance of boat from cliff base? (c) Person 1.6 m tall, top of building at 42° elevation from 30 m away. Building height?",
                    "Elevation/depression, real-world applications",
                    "easy",
                ),
                "learning_objective": "Apply trig to elevation and depression problems",
            },
        ],
        "medium": [
            {
                "id": "TR_BETA_Elev_M01",
                "subtopic": "Angles of Elevation and Depression",
                "prompt": _base(
                    "Angles of Elevation and Depression",
                    "Form 3",
                    ["Include observer height", "Two-step problems (e.g. find distance then height)"],
                    ["P2: Building height with observer height", "P2: Two positions (e.g. approach)"],
                    "Include observer height where relevant. Multi-step allowed.",
                    "Person 1.6 m tall observes top of tree at 28° from 20 m. Find tree height. Or: from two points different distances from a tower, angles given – find height.",
                    "Elevation/depression with observer height, two-step",
                    "medium",
                ),
                "learning_objective": "Solve elevation/depression problems with observer height or two steps",
            },
        ],
        "difficult": [],
    },
}

TRIG_OBTUSE = {
    "subtopic": "Obtuse Angle Trigonometry",
    "prompts": {
        "easy": [],
        "medium": [
            {
                "id": "TR_BETA_Obtuse_M01",
                "subtopic": "Obtuse Angle Trigonometry",
                "prompt": _base(
                    "Obtuse Angle Trigonometry",
                    "Form 3",
                    ["Use sin, cos, tan for 0° ≤ θ ≤ 180°", "Solve sin θ = k, cos θ = k, tan θ = k in given range"],
                    ["P2: Find sin 120°, cos 135°, tan 150°", "P2: Solve sin θ = 0.5, 0° ≤ θ ≤ 180°"],
                    "Angles 0°–180° only. Use calculator or exact values where appropriate. CAST diagram may be referenced.",
                    "(a) Find sin 120°, cos 135°, tan 150°. (b) Solve for 0° ≤ θ ≤ 180°: sin θ = 0.5; cos θ = -0.707; tan θ = -1.",
                    "Obtuse angle trig, CAST diagram",
                    "medium",
                ),
                "learning_objective": "Use trig for obtuse angles and solve simple trig equations in 0°–180°",
            },
        ],
        "difficult": [],
    },
}

TRIG_SINE_RULE = {
    "subtopic": "Sine Rule",
    "prompts": {
        "easy": [],
        "medium": [
            {
                "id": "TR_BETA_Sine_M01",
                "subtopic": "Sine Rule",
                "prompt": _base(
                    "Sine Rule",
                    "Form 4",
                    ["Apply a/sin A = b/sin B = c/sin C", "Find a side or angle in non–right-angled triangles"],
                    ["P2: Two angles and a side → find another side", "P2: Two sides and non-included angle → find angle"],
                    "Any triangle. Use degrees. Round sides/angles appropriately. Mention ambiguous case only when relevant.",
                    "Triangle ABC: A=50°, B=60°, a=7 cm. Find b. Or: a=8, b=10, A=40° – find B. Or: A=35°, a=6, C=75° – find c.",
                    "a/sin A = b/sin B = c/sin C",
                    "medium",
                ),
                "learning_objective": "Apply sine rule to find sides and angles",
            },
        ],
        "difficult": [
            {
                "id": "TR_BETA_Sine_D01",
                "subtopic": "Sine Rule",
                "prompt": _base(
                    "Sine Rule",
                    "Form 4",
                    ["Handle ambiguous case (SSA)", "Use sine rule in multi-step or combined problems"],
                    ["P2: Ambiguous case – how many triangles?"],
                    "Include ambiguous case when two sides and a non-included angle given. Ask 'How many triangles possible?' or 'Find all possible values' where appropriate.",
                    "a=7 cm, b=9 cm, A=30°. How many triangles possible? Find B (or both values) and subsequent sides.",
                    "Sine rule, ambiguous case",
                    "difficult",
                ),
                "learning_objective": "Apply sine rule including ambiguous case",
            },
        ],
    },
}

TRIG_COSINE_RULE = {
    "subtopic": "Cosine Rule",
    "prompts": {
        "easy": [],
        "medium": [
            {
                "id": "TR_BETA_Cos_M01",
                "subtopic": "Cosine Rule",
                "prompt": _base(
                    "Cosine Rule",
                    "Form 4",
                    ["Apply a² = b² + c² - 2bc cos A", "Find angle when three sides known; find side when two sides and included angle known"],
                    ["P2: Three sides → largest angle", "P2: Two sides and included angle → third side"],
                    "Any triangle. Use degrees. Round sensibly.",
                    "Triangle PQR: p=5, q=7, r=8 cm. Find angle P. Or: q=6, r=9, P=65° – find p. Sides 4, 5, 7 cm – find largest angle.",
                    "a² = b² + c² - 2bc cos A",
                    "medium",
                ),
                "learning_objective": "Apply cosine rule to find sides and angles",
            },
        ],
        "difficult": [],
    },
}

TRIG_AREA = {
    "subtopic": "Area of Triangle",
    "prompts": {
        "easy": [],
        "medium": [
            {
                "id": "TR_BETA_Area_M01",
                "subtopic": "Area of Triangle",
                "prompt": _base(
                    "Area of Triangle",
                    "Form 4",
                    ["Use area = ½ab sin C", "Combine with cosine rule when three sides given"],
                    ["P2: Two sides and included angle → area", "P2: Three sides → area (cosine rule first)"],
                    "Use ½ab sin C. If only three sides given, use cosine rule to find an angle first.",
                    "(a) Sides 6 cm and 8 cm, included angle 50°. (b) Triangle ABC: a=7, b=5, C=72°. (c) Sides 5, 6, 7 cm – find area (use cosine rule first).",
                    "Area = ½ab sin C",
                    "medium",
                ),
                "learning_objective": "Calculate area using ½ab sin C and cosine rule when needed",
            },
        ],
        "difficult": [],
    },
}

TRIG_3D = {
    "subtopic": "3D Trigonometry",
    "prompts": {
        "easy": [],
        "medium": [],
        "difficult": [
            {
                "id": "TR_BETA_3D_D01",
                "subtopic": "3D Trigonometry",
                "prompt": _base(
                    "3D Trigonometry",
                    "Form 4",
                    ["Use Pythagoras in 3D (cuboid diagonal)", "Find angle between diagonal and base or vertical edge"],
                    ["P2: Cuboid diagonal length", "P2: Angle diagonal makes with base or vertical"],
                    "Cuboid or similar 3D shape. Clear labelling of dimensions.",
                    "Cuboid 8×6×5 cm. (a) Length of space diagonal. (b) Angle diagonal makes with base. (c) Angle between diagonal and vertical edge.",
                    "3D Pythagoras, angles in 3D",
                    "difficult",
                ),
                "learning_objective": "Apply Pythagoras and trig in 3D contexts",
            },
        ],
    },
}

TRIG_MIXED = {
    "subtopic": "Mixed Trigonometry",
    "prompts": {
        "easy": [],
        "medium": [],
        "difficult": [
            {
                "id": "TR_BETA_Mix_D01",
                "subtopic": "Mixed Trigonometry",
                "prompt": _base(
                    "Mixed Trigonometry",
                    "Form 4",
                    ["Combine cosine rule, sine rule, area", "Multi-step problems in quadrilaterals or compound shapes"],
                    ["P2: Quadrilateral split into triangles", "P2: Multiple parts (a)–(e)"],
                    "Quadrilateral or compound figure. Use cosine rule, sine rule, ½ab sin C as appropriate. Multi-step.",
                    "Quadrilateral ABCD: AB=7, BC=8, CD=6 cm, angle ABC=110°, angle BCD=85°. (a) Use cosine rule to find AC. (b) Use sine rule in triangle BCD for angle CBD. (c) Area of triangle ABC. (d) Area of BCD. (e) Total area.",
                    "Combined trig techniques, multi-step problem-solving",
                    "difficult",
                ),
                "learning_objective": "Combine sine rule, cosine rule, and area in multi-step problems",
            },
        ],
    },
}

# Ensure every subtopic has all three keys
for _b in (TRIG_PYTHAGORAS, TRIG_RATIOS_ACUTE, TRIG_RIGHT_TRIANGLES, TRIG_ELEVATION_DEPRESSION,
           TRIG_OBTUSE, TRIG_SINE_RULE, TRIG_COSINE_RULE, TRIG_AREA, TRIG_3D, TRIG_MIXED):
    for d in ("easy", "medium", "difficult"):
        _b["prompts"].setdefault(d, [])

TRIG_PROMPTS_BETA = [
    TRIG_PYTHAGORAS,
    TRIG_RATIOS_ACUTE,
    TRIG_RIGHT_TRIANGLES,
    TRIG_ELEVATION_DEPRESSION,
    TRIG_OBTUSE,
    TRIG_SINE_RULE,
    TRIG_COSINE_RULE,
    TRIG_AREA,
    TRIG_3D,
    TRIG_MIXED,
]
