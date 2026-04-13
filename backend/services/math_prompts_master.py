#!/usr/bin/env python3
"""
Master Mathematics Prompts Aggregator
Combines all 14 ZIMSEC O-Level Mathematics Topics
Total: 2,520 Prompts (180 per topic × 14 topics)
"""

# Import all topic modules
from services.math_algebra_prompts import ALGEBRA_PROMPTS
from services.math_real_numbers_prompts import REAL_NUMBERS_PROMPTS
from services.math_sets_prompts import SETS_PROMPTS
from services.math_financial_prompts import FINANCIAL_MATH_PROMPTS
from services.math_mensuration_prompts import MENSURATION_PROMPTS
from services.math_graphs_variation_geometry_stats_prompts import (
    GRAPHS_PROMPTS, VARIATION_PROMPTS, GEOMETRY_PROMPTS, STATISTICS_PROMPTS
)
from services.math_trig_vectors_matrices_prompts import (
    TRIG_PROMPTS, VECTOR_PROMPTS, MATRIX_PROMPTS  
)
from services.math_transformation_probability_prompts import (
    TRANSFORM_PROMPTS, PROB_PROMPTS
)

# ============================================================================
# MASTER PROMPTS DICTIONARY - Maps topic names to their prompts
# ============================================================================

ALL_MATH_PROMPTS = {
    "Algebra": ALGEBRA_PROMPTS,
    "Real Numbers": REAL_NUMBERS_PROMPTS,
    "Sets": SETS_PROMPTS,
    "Financial Mathematics": FINANCIAL_MATH_PROMPTS,
    "Measures and Mensuration": MENSURATION_PROMPTS,
    "Graphs": GRAPHS_PROMPTS,
    "Variation": VARIATION_PROMPTS,
    "Geometry": GEOMETRY_PROMPTS,
    "Statistics": STATISTICS_PROMPTS,
    "Trigonometry": TRIG_PROMPTS,
    "Vectors": VECTOR_PROMPTS,
    "Matrices": MATRIX_PROMPTS,
    "Transformation": TRANSFORM_PROMPTS,
    "Probability": PROB_PROMPTS,
}

def get_prompts_for_topic(topic_name):
    """Get all prompts for a specific topic."""
    return ALL_MATH_PROMPTS.get(topic_name, [])

def get_prompt(topic_name, subtopic=None, difficulty=None):
    """Get prompts filtered by topic, subtopic, and/or difficulty."""
    prompts = get_prompts_for_topic(topic_name)
    if not prompts:
        return []
    
    results = []
    for subtopic_data in prompts:
        block_label = subtopic_data.get("subtopic") or subtopic_data.get("topic")
        if subtopic and block_label != subtopic:
            continue
        
        if difficulty:
            results.extend(subtopic_data["prompts"].get(difficulty, []))
        else:
            for diff in ["easy", "medium", "difficult"]:
                results.extend(subtopic_data["prompts"].get(diff, []))
    
    return results

def get_random_prompt(topic_name, difficulty=None):
    """Get a random prompt for a topic and optional difficulty."""
    import random
    prompts = get_prompt(topic_name, difficulty=difficulty)
    return random.choice(prompts) if prompts else None


def get_random_prompt_subtopic_first(topic_name, difficulty=None, recent_subtopics=None):
    """Pick a random subtopic, then a random prompt for that subtopic. Prefer subtopics not in recent_subtopics."""
    import random
    subtopics = [s for s in get_subtopics(topic_name) if s]
    if not subtopics:
        return get_random_prompt(topic_name, difficulty=difficulty)
    recent = list(recent_subtopics) if recent_subtopics else []
    preferred = [s for s in subtopics if s not in recent]
    pool = preferred if preferred else subtopics
    chosen = random.choice(pool)
    candidates = get_prompt(topic_name, subtopic=chosen, difficulty=difficulty)
    if candidates:
        return random.choice(candidates)
    return get_random_prompt(topic_name, difficulty=difficulty)


def count_prompts(topic_name=None):
    """Count prompts for a topic or all topics."""
    if topic_name:
        prompts = get_prompts_for_topic(topic_name)
        return sum(
            len(s["prompts"].get("easy", [])) + 
            len(s["prompts"].get("medium", [])) + 
            len(s["prompts"].get("difficult", []))
            for s in prompts
        )
    else:
        return sum(count_prompts(t) for t in ALL_MATH_PROMPTS.keys())

def get_all_topics():
    """Get list of all available topics."""
    return list(ALL_MATH_PROMPTS.keys())

def get_subtopics(topic_name):
    """Get all subtopics for a given topic (block-level subtopic or topic)."""
    prompts = get_prompts_for_topic(topic_name)
    return [s.get("subtopic") or s.get("topic") for s in prompts]

# Quick stats when run directly
if __name__ == "__main__":
    print("=== ZIMSEC O-Level Mathematics Prompts ===")
    print(f"Total Topics: {len(ALL_MATH_PROMPTS)}")
    total = 0
    for topic in ALL_MATH_PROMPTS:
        count = count_prompts(topic)
        total += count
        print(f"  {topic}: {count} prompts")
    print(f"TOTAL: {total} prompts")
