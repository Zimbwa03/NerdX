#!/usr/bin/env python3
"""
ZIMSEC O-Level Mathematics – Probability beta prompts.
Uses NerdX learning objectives, ZIMSEC O-Level / index/guide guidance.
No full ZIMSEC topic templates; aligned with Statistics (experimental vs theoretical, sample space, two-way tables).
Contract: {subtopic, prompts: {easy, medium, difficult}}; each prompt {id, subtopic, prompt, learning_objective}.
"""

def _base(subtopic, objectives, exam_types, requirements, examples, skills, diff_tag):
    return f"""SUBTOPIC: {subtopic}

LEARNING OBJECTIVES:
{chr(10).join(f'- {o}' for o in objectives)}

EXAM QUESTION TYPES (ZIMSEC / O-Level):
{chr(10).join(f'- {e}' for e in exam_types)}

REQUIREMENTS:
{requirements}

EXAMPLE QUESTION STYLES (vary numbers and contexts):
{examples}

SKILLS TO TEST: {skills}

DIFFICULTY: {diff_tag}. Use plain-text math only (no LaTeX). Return valid JSON with question, solution, answer, points, explanation, teaching_explanation, zimsec_paper_reference, marking_notes."""


PROB_BASIC = {
    "subtopic": "Basic Probability",
    "prompts": {
        "easy": [
            {
                "id": "PR_BETA_Basic_E01",
                "subtopic": "Basic Probability",
                "prompt": _base(
                    "Basic Probability",
                    [
                        "Use probability scale 0 to 1",
                        "P(A) notation; P(A') = 1 - P(A)",
                        "Single event: P = favourable / total",
                    ],
                    ["P1, P2: P(single event)", "P2: P(not A)"],
                    "Fair dice, coins, bags. Small integers. Fractions or decimals.",
                    "Bag: 3 red, 5 blue. P(red)? Fair die: P(>4)? Two coins: P(at least one head)?",
                    "Probability scale, P(A), complement",
                    "easy",
                ),
                "learning_objective": "Calculate simple single-event probability and use complement",
            },
        ],
        "medium": [],
        "difficult": [],
    },
}

PROB_SAMPLE_SPACE = {
    "subtopic": "Sample Space",
    "prompts": {
        "easy": [],
        "medium": [
            {
                "id": "PR_BETA_Samp_M01",
                "subtopic": "Sample Space",
                "prompt": _base(
                    "Sample Space",
                    [
                        "List sample space for 2 dice, 2 coins, etc.",
                        "Count favourable outcomes",
                        "Use sample space for combined events",
                    ],
                    ["P2: List outcomes", "P2: P from sample space"],
                    "Two dice, two coins, or simple spinner. List S explicitly.",
                    "Two fair dice. List sample space. Find P(sum = 7). Find P(both even).",
                    "Sample space, counting outcomes",
                    "medium",
                ),
                "learning_objective": "Use sample space for combined events",
            },
        ],
        "difficult": [],
    },
}

PROB_MUTUALLY_EXCLUSIVE = {
    "subtopic": "Mutually Exclusive / Addition Rule",
    "prompts": {
        "easy": [],
        "medium": [
            {
                "id": "PR_BETA_ME_M01",
                "subtopic": "Mutually Exclusive / Addition Rule",
                "prompt": _base(
                    "Mutually Exclusive / Addition Rule",
                    [
                        "Identify mutually exclusive events",
                        "Use P(A or B) = P(A) + P(B) when A, B mutually exclusive",
                        "Use Venn diagrams where helpful",
                    ],
                    ["P2: P(A or B)", "P2: Mutually exclusive check"],
                    "Disjoint events. Simple contexts (dice, cards, spinners).",
                    "P(A)=0.3, P(B)=0.5, A and B mutually exclusive. Find P(A or B). Spinner: P(1)=1/4, P(2)=1/3, P(3)=1/6. P(1 or 2)?",
                    "Mutually exclusive, addition rule",
                    "medium",
                ),
                "learning_objective": "Apply addition rule for mutually exclusive events",
            },
        ],
        "difficult": [],
    },
}

PROB_INDEPENDENT = {
    "subtopic": "Independent Events / Multiplication Rule",
    "prompts": {
        "easy": [],
        "medium": [
            {
                "id": "PR_BETA_Ind_M01",
                "subtopic": "Independent Events / Multiplication Rule",
                "prompt": _base(
                    "Independent Events / Multiplication Rule",
                    [
                        "Identify independent events",
                        "Use P(A and B) = P(A) × P(B) when independent",
                    ],
                    ["P2: P(both)", "P2: Independent events"],
                    "With replacement, or clearly independent trials. Two dice, two coins, draws with replacement.",
                    "Two fair dice. P(both 6)? Coin tossed 3 times. P(3 heads)? Bag: 2 red, 3 blue. Draw two with replacement. P(both red)?",
                    "Independent events, multiplication rule",
                    "medium",
                ),
                "learning_objective": "Apply multiplication rule for independent events",
            },
        ],
        "difficult": [],
    },
}

PROB_TREE = {
    "subtopic": "Tree Diagrams",
    "prompts": {
        "easy": [],
        "medium": [
            {
                "id": "PR_BETA_Tree_M01",
                "subtopic": "Tree Diagrams",
                "prompt": _base(
                    "Tree Diagrams",
                    [
                        "Draw tree diagram for two-stage (or simple three-stage) experiment",
                        "Multiply along branches; add for mutually exclusive paths",
                        "Use for with- or without-replacement",
                    ],
                    ["P2: Tree diagram", "P2: P from tree"],
                    "Two stages. Probabilities on branches. Outcomes at end.",
                    "Bag: 3 red, 2 blue. Two draws. (a) With replacement: draw tree; find P(both red). (b) Without replacement: draw tree; find P(both red).",
                    "Tree diagrams, path probabilities",
                    "medium",
                ),
                "learning_objective": "Use tree diagrams for multi-stage probability",
            },
        ],
        "difficult": [
            {
                "id": "PR_BETA_Tree_D01",
                "subtopic": "Tree Diagrams",
                "prompt": _base(
                    "Tree Diagrams",
                    [
                        "Three-stage or combined (at least one, exactly one)",
                        "Without replacement; conditional structure",
                    ],
                    ["P2: Tree, 3 stages", "P2: Without replacement"],
                    "Without replacement. 'At least one', 'exactly one' type questions.",
                    "Bag 4 red, 3 blue. Three draws without replacement. Draw tree. Find P(exactly 2 red). Find P(at least 1 blue).",
                    "Tree diagrams, without replacement, combined outcomes",
                    "difficult",
                ),
                "learning_objective": "Use tree diagrams for without-replacement and combined outcomes",
            },
        ],
    },
}

PROB_TWO_WAY = {
    "subtopic": "Two-Way Tables",
    "prompts": {
        "easy": [],
        "medium": [
            {
                "id": "PR_BETA_2W_M01",
                "subtopic": "Two-Way Tables",
                "prompt": _base(
                    "Two-Way Tables",
                    [
                        "Complete two-way table from given totals and some cells",
                        "Find P(A), P(B), P(A and B), P(A|B) from table",
                    ],
                    ["P2: Two-way table", "P2: P from table"],
                    "Simple 2×2 or 2×3. Row/column totals.",
                    "Survey: Male/Female, Left/Right. Totals given, some cells. Complete table. Find P(Female), P(Left and Female), etc.",
                    "Two-way tables, conditional from table",
                    "medium",
                ),
                "learning_objective": "Use two-way tables for probability",
            },
        ],
        "difficult": [],
    },
}

PROB_EXP_VS_THEORY = {
    "subtopic": "Experimental vs Theoretical",
    "prompts": {
        "easy": [
            {
                "id": "PR_BETA_Exp_E01",
                "subtopic": "Experimental vs Theoretical",
                "prompt": _base(
                    "Experimental vs Theoretical",
                    [
                        "Relative frequency as estimate of probability",
                        "Expected frequency = P × number of trials",
                        "Fair, bias, random (O-Level)",
                    ],
                    ["P2: Relative frequency", "P2: Expected frequency"],
                    "Spinner, dice, or simple experiment. Compare theory vs experiment.",
                    "Spinner 100 times: 40 red. Estimate P(red). If P(red)=0.35, how many red in 200 spins? Is spinner fair?",
                    "Relative frequency, expected frequency",
                    "easy",
                ),
                "learning_objective": "Use relative and expected frequency; compare experimental and theoretical",
            },
        ],
        "medium": [],
        "difficult": [],
    },
}

for _b in (PROB_BASIC, PROB_SAMPLE_SPACE, PROB_MUTUALLY_EXCLUSIVE, PROB_INDEPENDENT, PROB_TREE, PROB_TWO_WAY, PROB_EXP_VS_THEORY):
    for d in ("easy", "medium", "difficult"):
        _b["prompts"].setdefault(d, [])

PROBABILITY_PROMPTS_BETA = [
    PROB_BASIC,
    PROB_SAMPLE_SPACE,
    PROB_MUTUALLY_EXCLUSIVE,
    PROB_INDEPENDENT,
    PROB_TREE,
    PROB_TWO_WAY,
    PROB_EXP_VS_THEORY,
]
