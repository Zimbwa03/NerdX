#!/usr/bin/env python3
"""Mathematics Graphs, Variation, Geometry, Statistics Prompts - 720 Total (180 each)"""

# GRAPHS - 180 Prompts
GRAPHS_TOPICS = ["Coordinates", "Distance-Time", "Speed-Time", "Linear y=mx+c", "Gradient", "Equation of Line", "Quadratic", "Cubic/Reciprocal", "Graphical Solutions", "Regions", "Conversion", "Real-life"]

GRAPHS_PROMPTS = [{"subtopic": t, "prompts": {d: [{"id": f"GR_{t[:2].upper()}{d[0].upper()}{i}", "subtopic": f"{t}-{d}", "prompt": f"Generate {t} {d} question", "learning_objective": f"Work with {t}"} for i in range(1,6)] for d in ["easy", "medium", "difficult"]}} for t in GRAPHS_TOPICS]

# VARIATION - 180 Prompts  
VARIATION_TOPICS = ["Direct Proportion", "Inverse Proportion", "Direct y∝x", "Inverse y∝1/x", "Square y∝x²", "Square Root", "Joint Variation", "Partial Variation", "Finding Constants", "Word Problems", "Combined", "Graphical"]

VARIATION_PROMPTS = [{"subtopic": t, "prompts": {d: [{"id": f"VA_{t[:2].upper()}{d[0].upper()}{i}", "subtopic": f"{t}-{d}", "prompt": f"Generate {t} {d} question", "learning_objective": f"Work with {t}"} for i in range(1,6)] for d in ["easy", "medium", "difficult"]}} for t in VARIATION_TOPICS]

# GEOMETRY - 180 Prompts
GEOMETRY_TOPICS = ["Angles Types", "Angles Lines/Points", "Angles Triangles", "Angles Polygons", "Parallel Lines", "Pythagoras", "Congruent Triangles", "Similar Triangles", "Circle Theorems", "Constructions", "Loci", "Bearings"]

GEOMETRY_PROMPTS = [{"subtopic": t, "prompts": {d: [{"id": f"GE_{t[:2].upper()}{d[0].upper()}{i}", "subtopic": f"{t}-{d}", "prompt": f"Generate {t} {d} question", "learning_objective": f"Work with {t}"} for i in range(1,6)] for d in ["easy", "medium", "difficult"]}} for t in GEOMETRY_TOPICS]

# STATISTICS - 180 Prompts
STATISTICS_TOPICS = ["Data Collection", "Frequency Tables", "Bar Charts", "Pie Charts", "Line Graphs", "Histograms", "Mean/Median/Mode", "Grouped Mean", "Cumulative Frequency", "Quartiles/IQR", "Standard Deviation", "Interpreting Data"]

STATISTICS_PROMPTS = [{"subtopic": t, "prompts": {d: [{"id": f"ST_{t[:2].upper()}{d[0].upper()}{i}", "subtopic": f"{t}-{d}", "prompt": f"Generate {t} {d} question", "learning_objective": f"Work with {t}"} for i in range(1,6)] for d in ["easy", "medium", "difficult"]}} for t in STATISTICS_TOPICS]

def get_prompt_count(prompts_list):
    return sum(len(s["prompts"]["easy"]) + len(s["prompts"]["medium"]) + len(s["prompts"]["difficult"]) for s in prompts_list)

def get_all_graphs():
    return GRAPHS_PROMPTS

def get_all_variation():
    return VARIATION_PROMPTS

def get_all_geometry():
    return GEOMETRY_PROMPTS

def get_all_statistics():
    return STATISTICS_PROMPTS
