#!/usr/bin/env python3
"""
ZIMSEC O-Level Mathematics – Beta prompts master aggregator.
Use when USE_ZIMSEC_BETA_MATH_PROMPTS is enabled.
Combines Topics 1–9 overlays (index + guide) and Topics 10–13 + Probability
template-based beta modules (ZIMSEC-Topics-10-13-Complete, NerdX).
Same contract as math_prompts_master: get_prompts_for_topic, get_prompt, get_random_prompt,
get_all_topics, get_subtopics, count_prompts.
"""

from services.math_topics_1_9_beta_overlays import (
    REAL_NUMBERS_BETA,
    SETS_BETA,
    FINANCIAL_MATH_BETA,
    MENSURATION_BETA,
    GRAPHS_BETA,
    VARIATION_BETA,
    ALGEBRA_BETA,
    GEOMETRY_BETA,
    STATISTICS_BETA,
)
from services.math_trig_prompts_zimsec_beta import TRIG_PROMPTS_BETA
from services.math_vectors_prompts_zimsec_beta import VECTOR_PROMPTS_BETA
from services.math_matrices_prompts_zimsec_beta import MATRIX_PROMPTS_BETA
from services.math_transformation_prompts_zimsec_beta import TRANSFORMATION_PROMPTS_BETA
from services.math_probability_prompts_zimsec_beta import PROBABILITY_PROMPTS_BETA

ALL_MATH_PROMPTS_BETA = {
    "Real Numbers": REAL_NUMBERS_BETA,
    "Sets": SETS_BETA,
    "Financial Mathematics": FINANCIAL_MATH_BETA,
    "Measures and Mensuration": MENSURATION_BETA,
    "Graphs": GRAPHS_BETA,
    "Variation": VARIATION_BETA,
    "Algebra": ALGEBRA_BETA,
    "Geometry": GEOMETRY_BETA,
    "Statistics": STATISTICS_BETA,
    "Trigonometry": TRIG_PROMPTS_BETA,
    "Vectors": VECTOR_PROMPTS_BETA,
    "Matrices": MATRIX_PROMPTS_BETA,
    "Transformation": TRANSFORMATION_PROMPTS_BETA,
    "Probability": PROBABILITY_PROMPTS_BETA,
}


def get_prompts_for_topic(topic_name):
    """Get all prompts for a specific topic."""
    return ALL_MATH_PROMPTS_BETA.get(topic_name, [])


def get_prompt(topic_name, subtopic=None, difficulty=None):
    """Get prompts filtered by topic, subtopic, and/or difficulty."""
    prompts = get_prompts_for_topic(topic_name)
    if not prompts:
        return []

    results = []
    for subtopic_data in prompts:
        if subtopic and subtopic_data.get("subtopic") != subtopic:
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
            len(s["prompts"].get("easy", []))
            + len(s["prompts"].get("medium", []))
            + len(s["prompts"].get("difficult", []))
            for s in prompts
        )
    return sum(count_prompts(t) for t in ALL_MATH_PROMPTS_BETA.keys())


def get_all_topics():
    """Get list of all available topics."""
    return list(ALL_MATH_PROMPTS_BETA.keys())


def get_subtopics(topic_name):
    """Get all subtopics for a given topic."""
    prompts = get_prompts_for_topic(topic_name)
    return [s.get("subtopic") for s in prompts]


if __name__ == "__main__":
    print("=== ZIMSEC Beta Mathematics Prompts ===")
    print(f"Total Topics: {len(ALL_MATH_PROMPTS_BETA)}")
    total = 0
    for topic in ALL_MATH_PROMPTS_BETA:
        count = count_prompts(topic)
        total += count
        print(f"  {topic}: {count} prompts")
    print(f"TOTAL: {total} prompts")
