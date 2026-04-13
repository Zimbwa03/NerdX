#!/usr/bin/env python3
"""Mathematics Transformation and Probability Prompts - 360 Total (180 each)"""

# TRANSFORMATION - 180 Prompts
TRANSFORM_TOPICS = ["Translation", "Reflection in Axes", "Rotation Origin", "Rotation Other Points", "Enlargement Positive", "Enlargement Fractional/Negative", "Describing Transformations", "Combined Transformations", "Transformation Matrices", "Stretch and Shear", "Invariant Points", "Inverse Transformations"]

TRANSFORM_PROMPTS = [{"subtopic": t, "prompts": {d: [{"id": f"TF_{t[:2].upper()}{d[0].upper()}{i}", "subtopic": f"{t}-{d}", "prompt": f"Generate {t} {d} question for ZIMSEC O-Level transformations", "learning_objective": f"Work with {t}"} for i in range(1,6)] for d in ["easy", "medium", "difficult"]}} for t in TRANSFORM_TOPICS]

# PROBABILITY - 180 Prompts
PROB_TOPICS = ["Basic Concepts", "Probability Scale", "Experimental vs Theoretical", "Sample Space", "Mutually Exclusive", "Addition Rule", "Independent Events", "Multiplication Rule", "Tree Diagrams", "Conditional Probability", "Without Replacement", "Combined Events"]

PROB_PROMPTS = [{"subtopic": t, "prompts": {d: [{"id": f"PR_{t[:2].upper()}{d[0].upper()}{i}", "subtopic": f"{t}-{d}", "prompt": f"Generate {t} {d} question for ZIMSEC O-Level probability", "learning_objective": f"Work with {t}"} for i in range(1,6)] for d in ["easy", "medium", "difficult"]}} for t in PROB_TOPICS]

def get_prompt_count(prompts_list):
    return sum(len(s["prompts"]["easy"]) + len(s["prompts"]["medium"]) + len(s["prompts"]["difficult"]) for s in prompts_list)

def get_all_transformations():
    return TRANSFORM_PROMPTS

def get_all_probability():
    return PROB_PROMPTS

# ============================================================================
# MASTER PROMPTS AGGREGATOR
# ============================================================================

ALL_MATH_PROMPTS = {
    "transformation": TRANSFORM_PROMPTS,
    "probability": PROB_PROMPTS
}
