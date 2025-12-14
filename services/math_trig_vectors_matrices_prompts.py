#!/usr/bin/env python3
"""Mathematics Trigonometry, Vectors, Matrices Prompts - 540 Total (180 each)"""

# TRIGONOMETRY - 180 Prompts
TRIG_TOPICS = ["Right Triangle Ratios", "Finding Sides", "Finding Angles", "Elevation/Depression", "Sine Rule", "Cosine Rule", "Area ½ab sinC", "3D Trigonometry", "Trig Graphs", "Trig Identities", "Trig Equations", "Bearings with Trig"]

TRIG_PROMPTS = [{"subtopic": t, "prompts": {d: [{"id": f"TR_{t[:2].upper()}{d[0].upper()}{i}", "subtopic": f"{t}-{d}", "prompt": f"Generate {t} {d} question for ZIMSEC O-Level trigonometry", "learning_objective": f"Work with {t}"} for i in range(1,6)] for d in ["easy", "medium", "difficult"]}} for t in TRIG_TOPICS]

# VECTORS - 180 Prompts
VECTOR_TOPICS = ["Vector Notation", "Column Vectors", "Magnitude", "Adding Vectors", "Scalar Multiplication", "Position Vectors", "Vector Geometry", "Parallel Vectors", "Midpoint Problems", "Ratio Problems", "Unit Vectors", "Vector Proofs"]

VECTOR_PROMPTS = [{"subtopic": t, "prompts": {d: [{"id": f"VE_{t[:2].upper()}{d[0].upper()}{i}", "subtopic": f"{t}-{d}", "prompt": f"Generate {t} {d} question for ZIMSEC O-Level vectors", "learning_objective": f"Work with {t}"} for i in range(1,6)] for d in ["easy", "medium", "difficult"]}} for t in VECTOR_TOPICS]

# MATRICES - 180 Prompts
MATRIX_TOPICS = ["Matrix Notation", "Order of Matrices", "Addition/Subtraction", "Scalar Multiplication", "Matrix Multiplication", "Identity Matrix", "Determinant 2x2", "Inverse Matrix 2x2", "Solving Equations", "Singular Matrices", "Matrix Transformations", "Combined Transformations"]

MATRIX_PROMPTS = [{"subtopic": t, "prompts": {d: [{"id": f"MA_{t[:2].upper()}{d[0].upper()}{i}", "subtopic": f"{t}-{d}", "prompt": f"Generate {t} {d} question for ZIMSEC O-Level matrices", "learning_objective": f"Work with {t}"} for i in range(1,6)] for d in ["easy", "medium", "difficult"]}} for t in MATRIX_TOPICS]

def get_prompt_count(prompts_list):
    return sum(len(s["prompts"]["easy"]) + len(s["prompts"]["medium"]) + len(s["prompts"]["difficult"]) for s in prompts_list)

def get_all_trig():
    return TRIG_PROMPTS

def get_all_vectors():
    return VECTOR_PROMPTS

def get_all_matrices():
    return MATRIX_PROMPTS
