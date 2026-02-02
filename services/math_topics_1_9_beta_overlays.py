#!/usr/bin/env python3
"""
ZIMSEC O-Level Mathematics - Beta prompts for Topics 1-9.
Template-based, expanded prompts aligned with the strict structure used for Topics 10-13.
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

DIFFICULTY: {diff_tag}. Use plain-text math only (no LaTeX). Return valid JSON with question, solution, answer, points, explanation, teaching_explanation, zimsec_paper_reference, marking_notes."""


# ---- REAL NUMBERS ----
RN_NUMBERS = {
    "subtopic": "Number Types and Sets",
    "prompts": {
        "easy": [
            {
                "id": "RN_BETA_Num_E01",
                "subtopic": "Number Types and Sets",
                "prompt": _base(
                    "Number Types and Sets",
                    "Form 1-2",
                    [
                        "Classify numbers as natural, integer, rational, irrational, real",
                        "Use set symbols N, Z, Q, R",
                        "Locate numbers on a number line",
                    ],
                    ["P1, P2: Classify numbers", "P1, P2: Membership in sets", "P1, P2: Order numbers"],
                    "Use small integers, simple fractions, and simple surds. Ask for classification and ordering.",
                    "Classify 5, -3, 2/5, sqrt(9), sqrt(2). State which belong to N, Z, Q, R. Place -2, 0, 1.5 on a number line.",
                    "Classification, ordering, number line",
                    "easy",
                ),
                "learning_objective": "Classify and order real numbers using set names",
            },
        ],
        "medium": [
            {
                "id": "RN_BETA_Num_M01",
                "subtopic": "Number Types and Sets",
                "prompt": _base(
                    "Number Types and Sets",
                    "Form 2-3",
                    [
                        "Order mixed numbers including fractions and surds",
                        "Recognize recurring decimals as rational numbers",
                        "Use set notation to describe a list",
                    ],
                    ["P1, P2: Ordering mixed types", "P2: Recurring decimals to fraction", "P2: Set description"],
                    "Include a recurring decimal and a surd. Require ordering from least to greatest.",
                    "Order 0.6, 2/3, 0.666..., sqrt(2), 1.4. Write 0.333... as a fraction. Describe the set {2,4,6,8} in words.",
                    "Ordering, rational vs irrational, set description",
                    "medium",
                ),
                "learning_objective": "Order mixed real numbers and recognize rational forms",
            },
        ],
        "difficult": [
            {
                "id": "RN_BETA_Num_D01",
                "subtopic": "Number Types and Sets",
                "prompt": _base(
                    "Number Types and Sets",
                    "Form 3-4",
                    [
                        "Justify whether a number is rational or irrational",
                        "Use properties of real numbers in reasoning",
                    ],
                    ["P2: Reasoning about irrationality", "P2: True/false statements with justification"],
                    "Require short justification in words. Use sqrt values or pi.",
                    "Decide if each statement is true and explain: (a) sqrt(18) is rational (b) 0.101001000... is rational (c) 3.14159 is rational. Give reasons.",
                    "Reasoning and justification with real number properties",
                    "difficult",
                ),
                "learning_objective": "Reason about rational and irrational numbers",
            },
        ],
    },
}

RN_FRACTIONS = {
    "subtopic": "Fractions, Decimals, Recurring",
    "prompts": {
        "easy": [
            {
                "id": "RN_BETA_Fra_E01",
                "subtopic": "Fractions, Decimals, Recurring",
                "prompt": _base(
                    "Fractions, Decimals, Recurring",
                    "Form 1-2",
                    [
                        "Simplify fractions",
                        "Convert fractions to decimals and decimals to fractions",
                        "Add and subtract simple fractions",
                    ],
                    ["P1, P2: Simplify fractions", "P1, P2: Convert between forms", "P1, P2: Add/subtract fractions"],
                    "Use proper fractions and simple decimals. Denominators up to 12.",
                    "Simplify 18/24. Convert 3/8 to a decimal. Calculate 2/3 + 1/6. Convert 0.75 to a fraction in simplest form.",
                    "Fraction simplification and basic operations",
                    "easy",
                ),
                "learning_objective": "Simplify and convert fractions and decimals",
            },
        ],
        "medium": [
            {
                "id": "RN_BETA_Fra_M01",
                "subtopic": "Fractions, Decimals, Recurring",
                "prompt": _base(
                    "Fractions, Decimals, Recurring",
                    "Form 2-3",
                    [
                        "Add, subtract, multiply, and divide fractions and mixed numbers",
                        "Convert simple recurring decimals to fractions",
                    ],
                    ["P2: Operations with fractions", "P2: Mixed numbers", "P2: Recurring decimals"],
                    "Include mixed numbers and at least one recurring decimal.",
                    "Find 3 1/2 + 2 3/4. Calculate (5/6) - (1/4). Convert 0.3 recurring to a fraction. Evaluate 1.2 * 5/8.",
                    "Fraction operations and recurring decimals",
                    "medium",
                ),
                "learning_objective": "Operate with fractions and recurring decimals",
            },
        ],
        "difficult": [
            {
                "id": "RN_BETA_Fra_D01",
                "subtopic": "Fractions, Decimals, Recurring",
                "prompt": _base(
                    "Fractions, Decimals, Recurring",
                    "Form 3-4",
                    [
                        "Solve multi-step fraction problems",
                        "Convert recurring decimals with two-digit repeat",
                        "Work with complex fractions",
                    ],
                    ["P2: Complex fractions", "P2: Recurring decimal to fraction", "P2: Multi-step operations"],
                    "Use at least one complex fraction or nested fraction. Require simplification to lowest terms.",
                    "Simplify (1/2 + 3/4) / (5/6). Convert 0.27 recurring to a fraction. Evaluate (3/5) + (2/3) - (1/6).",
                    "Complex fraction manipulation",
                    "difficult",
                ),
                "learning_objective": "Handle complex fraction operations and recurring decimals",
            },
        ],
    },
}

RN_PERCENT = {
    "subtopic": "Percentages, Ratio, Rates",
    "prompts": {
        "easy": [
            {
                "id": "RN_BETA_Pct_E01",
                "subtopic": "Percentages, Ratio, Rates",
                "prompt": _base(
                    "Percentages, Ratio, Rates",
                    "Form 1-2",
                    [
                        "Find a percentage of a quantity",
                        "Simplify ratios",
                        "Share a quantity in a given ratio",
                    ],
                    ["P1, P2: Percent of a quantity", "P1, P2: Simplify ratio", "P2: Share in a ratio"],
                    "Use whole numbers. Keep contexts simple.",
                    "Find 20% of 60. Simplify the ratio 6:9. Share 90 in the ratio 2:1.",
                    "Percent and ratio basics",
                    "easy",
                ),
                "learning_objective": "Use percentage and ratio in simple contexts",
            },
        ],
        "medium": [
            {
                "id": "RN_BETA_Pct_M01",
                "subtopic": "Percentages, Ratio, Rates",
                "prompt": _base(
                    "Percentages, Ratio, Rates",
                    "Form 2-3",
                    [
                        "Calculate percentage increase/decrease",
                        "Find original value (reverse percentage)",
                        "Use unit rates and ratios with three parts",
                    ],
                    ["P2: Percentage change", "P2: Reverse percentage", "P2: Unit rate"],
                    "Include a two-step percentage or a three-part ratio.",
                    "Increase 80 by 15%. A price after 20% discount is $48; find the original price. Share $360 in the ratio 2:3:4.",
                    "Percentage change and ratio sharing",
                    "medium",
                ),
                "learning_objective": "Solve percentage change and ratio sharing problems",
            },
        ],
        "difficult": [
            {
                "id": "RN_BETA_Pct_D01",
                "subtopic": "Percentages, Ratio, Rates",
                "prompt": _base(
                    "Percentages, Ratio, Rates",
                    "Form 3-4",
                    [
                        "Solve multi-step ratio and percentage problems",
                        "Compare unit costs and best buys",
                    ],
                    ["P2: Multi-step percent", "P2: Best buy comparisons"],
                    "Use a word problem with at least two operations.",
                    "A bag of rice is discounted by 10% and then VAT of 15% is added. Find the final price of a $200 bag. Compare best buys: 750 g for $3.00 or 1 kg for $3.80.",
                    "Multi-step percent and unit rate comparison",
                    "difficult",
                ),
                "learning_objective": "Handle multi-step percentage and best-buy tasks",
            },
        ],
    },
}

RN_ORDER = {
    "subtopic": "Order of Operations and Evaluation",
    "prompts": {
        "easy": [
            {
                "id": "RN_BETA_Bod_E01",
                "subtopic": "Order of Operations and Evaluation",
                "prompt": _base(
                    "Order of Operations and Evaluation",
                    "Form 1-2",
                    [
                        "Apply BODMAS to evaluate expressions",
                        "Work with integers",
                    ],
                    ["P1, P2: Evaluate expressions"],
                    "Use integers and simple brackets.",
                    "Evaluate 3 + 4 * 2. Evaluate (5 + 3) * 2. Evaluate 18 / (3 + 3).",
                    "Order of operations",
                    "easy",
                ),
                "learning_objective": "Evaluate expressions using BODMAS",
            },
        ],
        "medium": [
            {
                "id": "RN_BETA_Bod_M01",
                "subtopic": "Order of Operations and Evaluation",
                "prompt": _base(
                    "Order of Operations and Evaluation",
                    "Form 2-3",
                    [
                        "Evaluate expressions with powers and fractions",
                        "Use brackets correctly",
                    ],
                    ["P1, P2: Powers and fractions"],
                    "Include a square and a fraction term.",
                    "Evaluate 12 / (3 + 1) + 2^3. Evaluate (3/4 + 1/2) * 8.",
                    "BODMAS with powers and fractions",
                    "medium",
                ),
                "learning_objective": "Evaluate expressions with powers and fractions",
            },
        ],
        "difficult": [
            {
                "id": "RN_BETA_Bod_D01",
                "subtopic": "Order of Operations and Evaluation",
                "prompt": _base(
                    "Order of Operations and Evaluation",
                    "Form 3-4",
                    [
                        "Evaluate expressions with negatives and decimals",
                        "Substitute values into a formula",
                    ],
                    ["P2: Evaluate with substitution"],
                    "Include substitution in a formula and at least one negative value.",
                    "If x = -2 and y = 3, evaluate 2x^2 - 3y + 4. Evaluate A = (1/2) b h when b = 7.5 and h = 6.",
                    "Substitution and evaluation",
                    "difficult",
                ),
                "learning_objective": "Evaluate expressions with substitution and negatives",
            },
        ],
    },
}

RN_APPROX = {
    "subtopic": "Approximation and Estimation",
    "prompts": {
        "easy": [
            {
                "id": "RN_BETA_App_E01",
                "subtopic": "Approximation and Estimation",
                "prompt": _base(
                    "Approximation and Estimation",
                    "Form 1-2",
                    [
                        "Round to decimal places and significant figures",
                        "Round whole numbers",
                    ],
                    ["P1, P2: Rounding"],
                    "Round to 1 or 2 decimal places or significant figures.",
                    "Round 4728 to 2 significant figures. Round 3.146 to 2 decimal places. Round 895 to the nearest hundred.",
                    "Rounding and approximation",
                    "easy",
                ),
                "learning_objective": "Round numbers to required accuracy",
            },
        ],
        "medium": [
            {
                "id": "RN_BETA_App_M01",
                "subtopic": "Approximation and Estimation",
                "prompt": _base(
                    "Approximation and Estimation",
                    "Form 2-3",
                    [
                        "Estimate products and quotients",
                        "Choose suitable rounding for estimation",
                    ],
                    ["P2: Estimation of calculations"],
                    "Use rounding to 1 significant figure for estimation.",
                    "Estimate the value of (4.92 * 19.7) / 3.1 using suitable rounding. Show the rounded values used.",
                    "Estimation of calculations",
                    "medium",
                ),
                "learning_objective": "Estimate values using sensible rounding",
            },
        ],
        "difficult": [
            {
                "id": "RN_BETA_App_D01",
                "subtopic": "Approximation and Estimation",
                "prompt": _base(
                    "Approximation and Estimation",
                    "Form 3-4",
                    [
                        "Estimate multi-step expressions",
                        "Comment on reasonableness of results",
                    ],
                    ["P2: Estimation with justification"],
                    "Include a multi-step expression and ask for a comment on reasonableness.",
                    "Estimate (198.6 * 0.48) / 2.97 to 2 significant figures. State whether your estimate is likely to be above or below the exact value and why.",
                    "Estimation and reasoning",
                    "difficult",
                ),
                "learning_objective": "Estimate and justify reasonableness",
            },
        ],
    },
}

RN_BOUNDS = {
    "subtopic": "Bounds and Limits of Accuracy",
    "prompts": {
        "easy": [
            {
                "id": "RN_BETA_Bnd_E01",
                "subtopic": "Bounds and Limits of Accuracy",
                "prompt": _base(
                    "Bounds and Limits of Accuracy",
                    "Form 2",
                    [
                        "Find upper and lower bounds for a rounded value",
                    ],
                    ["P2: Bounds"],
                    "Values are rounded to the nearest unit or 1 decimal place.",
                    "A length is 12 cm correct to the nearest cm. Find the lower and upper bounds. A mass is 4.6 kg correct to 1 decimal place. Find the bounds.",
                    "Bounds for rounded values",
                    "easy",
                ),
                "learning_objective": "Find upper and lower bounds",
            },
        ],
        "medium": [
            {
                "id": "RN_BETA_Bnd_M01",
                "subtopic": "Bounds and Limits of Accuracy",
                "prompt": _base(
                    "Bounds and Limits of Accuracy",
                    "Form 3",
                    [
                        "Use bounds to find maximum and minimum values",
                        "Apply bounds to perimeter, area, or speed",
                    ],
                    ["P2: Bounds in calculations"],
                    "Use rectangle or speed problems with given rounded measurements.",
                    "The length and width of a rectangle are 10 cm and 6 cm, each correct to the nearest cm. Find the greatest possible perimeter and the least possible perimeter.",
                    "Bounds in calculations",
                    "medium",
                ),
                "learning_objective": "Apply bounds to compute ranges of values",
            },
        ],
        "difficult": [
            {
                "id": "RN_BETA_Bnd_D01",
                "subtopic": "Bounds and Limits of Accuracy",
                "prompt": _base(
                    "Bounds and Limits of Accuracy",
                    "Form 3-4",
                    [
                        "Use bounds in multi-step expressions",
                        "Interpret percentage error or accuracy",
                    ],
                    ["P2: Error and accuracy"],
                    "Include a multi-step formula such as area or speed with bounds for each measurement.",
                    "A distance is 85 m correct to the nearest meter and a time is 12.4 s correct to 0.1 s. Find the greatest and least possible speed and the maximum percentage error.",
                    "Bounds and error analysis",
                    "difficult",
                ),
                "learning_objective": "Use bounds to analyze error in calculations",
            },
        ],
    },
}

RN_STANDARD = {
    "subtopic": "Standard Form",
    "prompts": {
        "easy": [
            {
                "id": "RN_BETA_SF_E01",
                "subtopic": "Standard Form",
                "prompt": _base(
                    "Standard Form",
                    "Form 2",
                    [
                        "Write numbers in standard form",
                        "Convert from standard form to ordinary form",
                    ],
                    ["P1, P2: Convert to and from standard form"],
                    "Use positive powers of 10 and simple numbers.",
                    "Write 0.00056 in standard form. Write 3.2 x 10^5 in ordinary form.",
                    "Standard form conversion",
                    "easy",
                ),
                "learning_objective": "Convert numbers to and from standard form",
            },
        ],
        "medium": [
            {
                "id": "RN_BETA_SF_M01",
                "subtopic": "Standard Form",
                "prompt": _base(
                    "Standard Form",
                    "Form 3",
                    [
                        "Multiply and divide numbers in standard form",
                    ],
                    ["P2: Standard form operations"],
                    "Use multiplication and division. Keep answers in standard form.",
                    "Calculate (3.2 x 10^5) * (4 x 10^2). Calculate (6.4 x 10^6) / (2 x 10^3).",
                    "Standard form multiplication and division",
                    "medium",
                ),
                "learning_objective": "Operate with numbers in standard form",
            },
        ],
        "difficult": [
            {
                "id": "RN_BETA_SF_D01",
                "subtopic": "Standard Form",
                "prompt": _base(
                    "Standard Form",
                    "Form 3-4",
                    [
                        "Add and subtract numbers in standard form",
                        "Order numbers written in standard form",
                    ],
                    ["P2: Standard form addition/subtraction", "P2: Ordering"],
                    "Require alignment of powers of 10 for addition/subtraction.",
                    "Calculate (2.5 x 10^4) + (3.6 x 10^4). Order 4.2 x 10^3, 7.5 x 10^2, 1.1 x 10^4 from smallest to largest.",
                    "Standard form addition and comparison",
                    "difficult",
                ),
                "learning_objective": "Add, subtract, and compare standard form numbers",
            },
        ],
    },
}

RN_SURDS = {
    "subtopic": "Surds",
    "prompts": {
        "easy": [
            {
                "id": "RN_BETA_Surd_E01",
                "subtopic": "Surds",
                "prompt": _base(
                    "Surds",
                    "Form 3",
                    [
                        "Simplify square roots",
                        "Write surds in simplest form",
                    ],
                    ["P2: Simplify surds"],
                    "Use square roots of multiples of perfect squares.",
                    "Simplify sqrt(72). Simplify sqrt(50).",
                    "Surd simplification",
                    "easy",
                ),
                "learning_objective": "Simplify surds to simplest form",
            },
        ],
        "medium": [
            {
                "id": "RN_BETA_Surd_M01",
                "subtopic": "Surds",
                "prompt": _base(
                    "Surds",
                    "Form 3-4",
                    [
                        "Add and subtract surds",
                        "Rationalize a denominator",
                    ],
                    ["P2: Surd operations", "P2: Rationalize denominator"],
                    "Use like surds and simple denominators.",
                    "Simplify 3 sqrt(5) + 2 sqrt(5) - sqrt(5). Rationalize 3 / sqrt(5).",
                    "Surd operations and rationalization",
                    "medium",
                ),
                "learning_objective": "Operate with surds and rationalize denominators",
            },
        ],
        "difficult": [
            {
                "id": "RN_BETA_Surd_D01",
                "subtopic": "Surds",
                "prompt": _base(
                    "Surds",
                    "Form 4",
                    [
                        "Simplify expressions with surd fractions",
                        "Solve simple equations involving surds",
                    ],
                    ["P2: Surd simplification", "P2: Equation with surds"],
                    "Use a conjugate or a short equation.",
                    "Simplify (2 + sqrt(3)) / (2 - sqrt(3)). Solve x + sqrt(5) = 7.",
                    "Surd manipulation and simple equations",
                    "difficult",
                ),
                "learning_objective": "Simplify complex surd expressions",
            },
        ],
    },
}

for _b in (RN_NUMBERS, RN_FRACTIONS, RN_PERCENT, RN_ORDER, RN_APPROX, RN_BOUNDS, RN_STANDARD, RN_SURDS):
    for d in ("easy", "medium", "difficult"):
        _b["prompts"].setdefault(d, [])
REAL_NUMBERS_BETA = [RN_NUMBERS, RN_FRACTIONS, RN_PERCENT, RN_ORDER, RN_APPROX, RN_BOUNDS, RN_STANDARD, RN_SURDS]

# ---- SETS ----
SETS_NOTATION = {
    "subtopic": "Set Notation and Listing",
    "prompts": {
        "easy": [
            {
                "id": "ST_BETA_Not_E01",
                "subtopic": "Set Notation and Listing",
                "prompt": _base(
                    "Set Notation and Listing",
                    "Form 1",
                    [
                        "List elements of a set",
                        "Use symbols for membership and subset",
                    ],
                    ["P1, P2: List elements", "P1, P2: Membership"],
                    "Use small integer sets and simple conditions.",
                    "Let A = {1,2,3,4}. State whether 2 is in A and 5 is in A. List the elements of B where B is the set of even numbers less than 10.",
                    "Set listing and membership",
                    "easy",
                ),
                "learning_objective": "Use basic set notation and list elements",
            },
        ],
        "medium": [
            {
                "id": "ST_BETA_Not_M01",
                "subtopic": "Set Notation and Listing",
                "prompt": _base(
                    "Set Notation and Listing",
                    "Form 2",
                    [
                        "Write sets in set-builder form",
                        "Convert between listing and set-builder",
                    ],
                    ["P2: Set-builder notation"],
                    "Include a universal set with a small range.",
                    "Write the set {2,4,6,8,10} in set-builder form for U = {1,2,3,4,5,6,7,8,9,10}. List the set {x: x is a multiple of 3, 1 <= x <= 15}.",
                    "Set-builder notation",
                    "medium",
                ),
                "learning_objective": "Use set-builder notation correctly",
            },
        ],
        "difficult": [
            {
                "id": "ST_BETA_Not_D01",
                "subtopic": "Set Notation and Listing",
                "prompt": _base(
                    "Set Notation and Listing",
                    "Form 3",
                    [
                        "Use universal set, complement, and difference",
                        "Interpret set statements",
                    ],
                    ["P2: Complements and differences"],
                    "Use a universal set of integers from 1 to 20.",
                    "Let U = {1,2,...,20}, A = even numbers, B = multiples of 3. Find A' and A \\ B. State two numbers that belong to A' n B.",
                    "Complements and set differences",
                    "difficult",
                ),
                "learning_objective": "Apply complements and differences within a universal set",
            },
        ],
    },
}

SETS_OPERATIONS = {
    "subtopic": "Set Operations and Venn Diagrams (2 sets)",
    "prompts": {
        "easy": [
            {
                "id": "ST_BETA_Venn2_E01",
                "subtopic": "Set Operations and Venn Diagrams (2 sets)",
                "prompt": _base(
                    "Set Operations and Venn Diagrams (2 sets)",
                    "Form 2",
                    [
                        "Find union and intersection",
                        "Shade regions on a two-set Venn diagram",
                    ],
                    ["P2: Union and intersection", "P2: Shading Venn diagram"],
                    "Use two sets with small numbers and ask for A union B and A intersection B.",
                    "Given A = {1,2,3,4} and B = {3,4,5,6}, find A union B and A intersection B. Shade the region A intersection B on a Venn diagram.",
                    "Union, intersection, shading",
                    "easy",
                ),
                "learning_objective": "Use union and intersection with Venn diagrams",
            },
        ],
        "medium": [
            {
                "id": "ST_BETA_Venn2_M01",
                "subtopic": "Set Operations and Venn Diagrams (2 sets)",
                "prompt": _base(
                    "Set Operations and Venn Diagrams (2 sets)",
                    "Form 3",
                    [
                        "Use n(A union B) = n(A) + n(B) - n(A intersection B)",
                        "Solve two-set survey problems",
                    ],
                    ["P2: Two-set survey problems"],
                    "Provide totals and intersection; find missing values.",
                    "In a class of 40, 22 like football, 18 like netball, and 7 like both. Find how many like neither. Use a Venn diagram.",
                    "Two-set counting",
                    "medium",
                ),
                "learning_objective": "Solve two-set survey problems using Venn diagrams",
            },
        ],
        "difficult": [
            {
                "id": "ST_BETA_Venn2_D01",
                "subtopic": "Set Operations and Venn Diagrams (2 sets)",
                "prompt": _base(
                    "Set Operations and Venn Diagrams (2 sets)",
                    "Form 3-4",
                    [
                        "Solve two-set problems with an unknown region",
                        "Use complements with sets",
                    ],
                    ["P2: Two-set problems with unknowns"],
                    "Include an unknown intersection or complement.",
                    "In a group of 60, 35 study Biology, 28 study Chemistry, and 15 study both. If 8 study neither, verify the totals and find the number who study Biology only.",
                    "Venn diagrams with unknowns",
                    "difficult",
                ),
                "learning_objective": "Solve two-set Venn problems with unknown regions",
            },
        ],
    },
}

SETS_VENN3 = {
    "subtopic": "Three-Set Venn and Survey Problems",
    "prompts": {
        "easy": [
            {
                "id": "ST_BETA_Venn3_E01",
                "subtopic": "Three-Set Venn and Survey Problems",
                "prompt": _base(
                    "Three-Set Venn and Survey Problems",
                    "Form 3",
                    [
                        "Fill a three-set Venn diagram",
                        "Find totals from a Venn diagram",
                    ],
                    ["P2: Three-set Venn diagram"],
                    "Provide simple numbers and ask for a total in A union B union C.",
                    "In a survey, 10 like A only, 8 like B only, 6 like C only, 3 like A and B only, 2 like A and C only, 1 like B and C only, and 1 like all three. Find the total who like at least one.",
                    "Three-set Venn totals",
                    "easy",
                ),
                "learning_objective": "Use three-set Venn diagrams to find totals",
            },
        ],
        "medium": [
            {
                "id": "ST_BETA_Venn3_M01",
                "subtopic": "Three-Set Venn and Survey Problems",
                "prompt": _base(
                    "Three-Set Venn and Survey Problems",
                    "Form 3-4",
                    [
                        "Use inclusion-exclusion with three sets",
                        "Find missing regions",
                    ],
                    ["P2: Three-set inclusion-exclusion"],
                    "Provide totals for each set and intersections; solve for a missing region.",
                    "In a class of 50, 28 take Math, 22 take Science, 18 take History. 10 take Math and Science, 8 take Math and History, 7 take Science and History, and 4 take all three. Find how many take none.",
                    "Inclusion-exclusion reasoning",
                    "medium",
                ),
                "learning_objective": "Apply inclusion-exclusion for three sets",
            },
        ],
        "difficult": [
            {
                "id": "ST_BETA_Venn3_D01",
                "subtopic": "Three-Set Venn and Survey Problems",
                "prompt": _base(
                    "Three-Set Venn and Survey Problems",
                    "Form 4",
                    [
                        "Solve three-set problems with constraints",
                        "Interpret statements like at least and exactly",
                    ],
                    ["P2: Complex three-set surveys"],
                    "Include conditions like at least two or exactly one.",
                    "A group of 60 students take subjects A, B, C. 35 take A, 30 take B, 25 take C. 12 take A and B, 10 take A and C, 8 take B and C, and 5 take all three. Find the number who take exactly one subject and the number who take at least two.",
                    "Complex Venn reasoning",
                    "difficult",
                ),
                "learning_objective": "Solve complex three-set Venn problems",
            },
        ],
    },
}

for _b in (SETS_NOTATION, SETS_OPERATIONS, SETS_VENN3):
    for d in ("easy", "medium", "difficult"):
        _b["prompts"].setdefault(d, [])
SETS_BETA = [SETS_NOTATION, SETS_OPERATIONS, SETS_VENN3]

# ---- FINANCIAL MATHEMATICS ----
FM_PERCENT = {
    "subtopic": "Profit, Loss, Discount, Commission",
    "prompts": {
        "easy": [
            {
                "id": "FM_BETA_Pct_E01",
                "subtopic": "Profit, Loss, Discount, Commission",
                "prompt": _base(
                    "Profit, Loss, Discount, Commission",
                    "Form 1-2",
                    [
                        "Calculate profit or loss",
                        "Find percentage profit or loss",
                        "Apply simple discounts",
                    ],
                    ["P1, P2: Profit/loss", "P2: Percentage profit", "P2: Discount"],
                    "Use whole numbers and simple percentages.",
                    "A shirt costs $80 and is sold for $100. Find the profit and percentage profit. A $200 item is discounted by 10%. Find the new price.",
                    "Profit, loss, discount",
                    "easy",
                ),
                "learning_objective": "Calculate profit/loss and discounts",
            },
        ],
        "medium": [
            {
                "id": "FM_BETA_Pct_M01",
                "subtopic": "Profit, Loss, Discount, Commission",
                "prompt": _base(
                    "Profit, Loss, Discount, Commission",
                    "Form 2-3",
                    [
                        "Apply successive discounts",
                        "Calculate commission",
                    ],
                    ["P2: Successive discounts", "P2: Commission"],
                    "Use two-step percentage changes and commission.",
                    "A price of $300 is discounted by 20% and then by a further 10%. Find the final price. A salesperson earns 5% commission on sales of $12,000. Find the commission.",
                    "Successive discounts and commission",
                    "medium",
                ),
                "learning_objective": "Solve multi-step discount and commission problems",
            },
        ],
        "difficult": [
            {
                "id": "FM_BETA_Pct_D01",
                "subtopic": "Profit, Loss, Discount, Commission",
                "prompt": _base(
                    "Profit, Loss, Discount, Commission",
                    "Form 3-4",
                    [
                        "Find original price using reverse percentages",
                        "Solve multi-step profit/discount problems",
                    ],
                    ["P2: Reverse percentage", "P2: Multi-step pricing"],
                    "Require reverse percentage and more than one step.",
                    "An item was sold for $216 after a 10% discount. Find the marked price. A trader buys an item for $150, marks it up by 25%, then offers a 10% discount. Find the final selling price and percentage profit.",
                    "Reverse percentage and multi-step pricing",
                    "difficult",
                ),
                "learning_objective": "Solve reverse percentage and multi-step pricing",
            },
        ],
    },
}

FM_SIMPLE = {
    "subtopic": "Simple Interest and Hire Purchase",
    "prompts": {
        "easy": [
            {
                "id": "FM_BETA_SI_E01",
                "subtopic": "Simple Interest and Hire Purchase",
                "prompt": _base(
                    "Simple Interest and Hire Purchase",
                    "Form 2",
                    [
                        "Use I = PRT/100",
                        "Find total amount with simple interest",
                    ],
                    ["P2: Simple interest"],
                    "Use whole number values and years.",
                    "Find the simple interest on $500 at 6% per annum for 3 years. Find the total amount.",
                    "Simple interest calculation",
                    "easy",
                ),
                "learning_objective": "Calculate simple interest and total amount",
            },
        ],
        "medium": [
            {
                "id": "FM_BETA_SI_M01",
                "subtopic": "Simple Interest and Hire Purchase",
                "prompt": _base(
                    "Simple Interest and Hire Purchase",
                    "Form 2-3",
                    [
                        "Find P, R, or T given other values",
                        "Compute hire purchase total cost",
                    ],
                    ["P2: Simple interest with unknown", "P2: Hire purchase"],
                    "Include a hire purchase with deposit and installments.",
                    "A loan earns $240 simple interest in 2 years at 6% per annum. Find the principal. A TV costs $900 on hire purchase with a $200 deposit and 12 installments of $65. Find the hire purchase price.",
                    "Simple interest and hire purchase",
                    "medium",
                ),
                "learning_objective": "Solve simple interest and hire purchase problems",
            },
        ],
        "difficult": [
            {
                "id": "FM_BETA_SI_D01",
                "subtopic": "Simple Interest and Hire Purchase",
                "prompt": _base(
                    "Simple Interest and Hire Purchase",
                    "Form 3-4",
                    [
                        "Compare hire purchase with cash price",
                        "Calculate effective extra cost",
                    ],
                    ["P2: Comparison problems"],
                    "Use comparison between cash and hire purchase.",
                    "A fridge has a cash price of $1,200. On hire purchase, a deposit of $300 is paid and 15 monthly installments of $80 are made. Find the total hire purchase cost and the extra cost compared to cash price.",
                    "Cost comparison",
                    "difficult",
                ),
                "learning_objective": "Compare hire purchase and cash price",
            },
        ],
    },
}

FM_COMPOUND = {
    "subtopic": "Compound Interest and Depreciation",
    "prompts": {
        "easy": [
            {
                "id": "FM_BETA_CI_E01",
                "subtopic": "Compound Interest and Depreciation",
                "prompt": _base(
                    "Compound Interest and Depreciation",
                    "Form 3",
                    [
                        "Use A = P(1 + r/100)^n",
                    ],
                    ["P2: Compound interest"],
                    "Use 2 or 3 years and whole-number rates.",
                    "Find the amount after 2 years if $800 is invested at 5% compound interest per annum.",
                    "Compound interest basics",
                    "easy",
                ),
                "learning_objective": "Calculate compound interest for a given time",
            },
        ],
        "medium": [
            {
                "id": "FM_BETA_CI_M01",
                "subtopic": "Compound Interest and Depreciation",
                "prompt": _base(
                    "Compound Interest and Depreciation",
                    "Form 3-4",
                    [
                        "Apply depreciation using a percentage decrease",
                        "Use multipliers for growth or decay",
                    ],
                    ["P2: Depreciation"],
                    "Use annual depreciation over 2-4 years.",
                    "A car worth $10,000 depreciates by 12% each year. Find its value after 3 years.",
                    "Depreciation and multipliers",
                    "medium",
                ),
                "learning_objective": "Apply compound depreciation",
            },
        ],
        "difficult": [
            {
                "id": "FM_BETA_CI_D01",
                "subtopic": "Compound Interest and Depreciation",
                "prompt": _base(
                    "Compound Interest and Depreciation",
                    "Form 4",
                    [
                        "Find rate or time given initial and final amounts",
                        "Compare two investment options",
                    ],
                    ["P2: Solve for rate or time", "P2: Compare options"],
                    "Use a comparison or unknown rate. Allow logarithms to be avoided by choosing simple values.",
                    "An investment grows from $1,000 to $1,331 in 3 years. Find the annual compound rate. Compare two options: 6% simple interest vs 5% compound interest over 3 years on $2,000.",
                    "Compound growth comparison",
                    "difficult",
                ),
                "learning_objective": "Solve compound interest with unknown rate or compare options",
            },
        ],
    },
}

FM_TAX_FX = {
    "subtopic": "Taxation, Wages, and Exchange Rates",
    "prompts": {
        "easy": [
            {
                "id": "FM_BETA_Tax_E01",
                "subtopic": "Taxation, Wages, and Exchange Rates",
                "prompt": _base(
                    "Taxation, Wages, and Exchange Rates",
                    "Form 2",
                    [
                        "Calculate VAT or sales tax",
                        "Convert currency using an exchange rate",
                    ],
                    ["P2: VAT", "P2: Exchange rates"],
                    "Use a single exchange rate and simple VAT.",
                    "A TV costs $400 before VAT. VAT is 15%. Find the total cost. Convert $50 to ZWL at a rate of 1 USD = 800 ZWL.",
                    "Tax and exchange rate calculations",
                    "easy",
                ),
                "learning_objective": "Calculate VAT and perform currency conversion",
            },
        ],
        "medium": [
            {
                "id": "FM_BETA_Tax_M01",
                "subtopic": "Taxation, Wages, and Exchange Rates",
                "prompt": _base(
                    "Taxation, Wages, and Exchange Rates",
                    "Form 3",
                    [
                        "Compute wages with overtime",
                        "Apply deductions to find net pay",
                    ],
                    ["P2: Wages and deductions"],
                    "Use basic pay plus overtime and a fixed deduction.",
                    "A worker earns $4 per hour for 40 hours and $6 per hour for 10 hours overtime. Calculate gross pay. If a $25 deduction is made, find net pay.",
                    "Wages and deductions",
                    "medium",
                ),
                "learning_objective": "Calculate wages including overtime and deductions",
            },
        ],
        "difficult": [
            {
                "id": "FM_BETA_Tax_D01",
                "subtopic": "Taxation, Wages, and Exchange Rates",
                "prompt": _base(
                    "Taxation, Wages, and Exchange Rates",
                    "Form 4",
                    [
                        "Solve multi-step tax and exchange problems",
                        "Include commission or service fees",
                    ],
                    ["P2: Multi-step finance problems"],
                    "Include more than one step and a service charge.",
                    "A traveler exchanges $200 to ZWL at 1 USD = 800 ZWL. The bank charges a 2% fee on the USD amount. Find the ZWL received. A salesperson earns 4% commission on sales of $15,000 and pays 10% tax on commission. Find net commission.",
                    "Multi-step finance calculations",
                    "difficult",
                ),
                "learning_objective": "Solve multi-step tax and exchange problems",
            },
        ],
    },
}

for _b in (FM_PERCENT, FM_SIMPLE, FM_COMPOUND, FM_TAX_FX):
    for d in ("easy", "medium", "difficult"):
        _b["prompts"].setdefault(d, [])
FINANCIAL_MATH_BETA = [FM_PERCENT, FM_SIMPLE, FM_COMPOUND, FM_TAX_FX]

# ---- MEASURES AND MENSURATION ----
MM_UNITS = {
    "subtopic": "Units and Conversions",
    "prompts": {
        "easy": [
            {
                "id": "MM_BETA_Unit_E01",
                "subtopic": "Units and Conversions",
                "prompt": _base(
                    "Units and Conversions",
                    "Form 1-2",
                    [
                        "Convert between units of length, mass, and time",
                    ],
                    ["P1, P2: Unit conversion"],
                    "Use mm, cm, m, km; g, kg; minutes and hours.",
                    "Convert 2.5 km to m. Convert 4500 g to kg. Convert 90 minutes to hours.",
                    "Basic unit conversion",
                    "easy",
                ),
                "learning_objective": "Convert basic units of measurement",
            },
        ],
        "medium": [
            {
                "id": "MM_BETA_Unit_M01",
                "subtopic": "Units and Conversions",
                "prompt": _base(
                    "Units and Conversions",
                    "Form 2-3",
                    [
                        "Convert area and volume units",
                    ],
                    ["P2: Area and volume conversion"],
                    "Use cm^2 to m^2 and cm^3 to m^3.",
                    "Convert 2500 cm^2 to m^2. Convert 0.015 m^3 to cm^3.",
                    "Area and volume conversion",
                    "medium",
                ),
                "learning_objective": "Convert area and volume units",
            },
        ],
        "difficult": [
            {
                "id": "MM_BETA_Unit_D01",
                "subtopic": "Units and Conversions",
                "prompt": _base(
                    "Units and Conversions",
                    "Form 3-4",
                    [
                        "Convert compound units such as speed",
                        "Work with mixed units",
                    ],
                    ["P2: Compound units"],
                    "Include km/h to m/s or m/s to km/h.",
                    "Convert 72 km/h to m/s. Convert 12.5 m/s to km/h.",
                    "Compound unit conversion",
                    "difficult",
                ),
                "learning_objective": "Convert compound units like speed",
            },
        ],
    },
}

MM_PERIM_AREA = {
    "subtopic": "Perimeter and Area of Plane Shapes",
    "prompts": {
        "easy": [
            {
                "id": "MM_BETA_Area_E01",
                "subtopic": "Perimeter and Area of Plane Shapes",
                "prompt": _base(
                    "Perimeter and Area of Plane Shapes",
                    "Form 1-2",
                    [
                        "Find perimeter and area of rectangles and triangles",
                        "Use correct units",
                    ],
                    ["P1, P2: Perimeter", "P1, P2: Area"],
                    "Use simple integer dimensions.",
                    "Find the perimeter and area of a rectangle 8 cm by 5 cm. Find the area of a triangle with base 10 cm and height 6 cm.",
                    "Perimeter and area",
                    "easy",
                ),
                "learning_objective": "Calculate perimeter and area for basic shapes",
            },
        ],
        "medium": [
            {
                "id": "MM_BETA_Area_M01",
                "subtopic": "Perimeter and Area of Plane Shapes",
                "prompt": _base(
                    "Perimeter and Area of Plane Shapes",
                    "Form 2-3",
                    [
                        "Find area of parallelogram and trapezium",
                        "Solve compound shape area",
                    ],
                    ["P2: Parallelogram and trapezium", "P2: Compound shapes"],
                    "Use composite shapes made from rectangles and triangles.",
                    "Find the area of a trapezium with parallel sides 10 cm and 6 cm and height 5 cm. Find the area of an L-shaped region made from a 10 by 6 rectangle with a 4 by 2 rectangle removed.",
                    "Area of compound shapes",
                    "medium",
                ),
                "learning_objective": "Calculate area for trapezium and compound shapes",
            },
        ],
        "difficult": [
            {
                "id": "MM_BETA_Area_D01",
                "subtopic": "Perimeter and Area of Plane Shapes",
                "prompt": _base(
                    "Perimeter and Area of Plane Shapes",
                    "Form 3-4",
                    [
                        "Find missing dimensions from area or perimeter",
                        "Solve multi-step area problems",
                    ],
                    ["P2: Find missing dimension"],
                    "Use algebraic reasoning to find a missing side length.",
                    "The area of a rectangle is 84 cm^2 and its length is 12 cm. Find the width. A triangle has area 54 cm^2 and base 12 cm. Find its height.",
                    "Rearranging area formulas",
                    "difficult",
                ),
                "learning_objective": "Find missing dimensions from area or perimeter",
            },
        ],
    },
}

MM_CIRCLES = {
    "subtopic": "Circles and Sectors",
    "prompts": {
        "easy": [
            {
                "id": "MM_BETA_Cir_E01",
                "subtopic": "Circles and Sectors",
                "prompt": _base(
                    "Circles and Sectors",
                    "Form 2",
                    [
                        "Use circumference and area of a circle",
                    ],
                    ["P2: Circumference", "P2: Area of a circle"],
                    "Use pi = 3.14 or pi as required.",
                    "Find the circumference of a circle of radius 7 cm. Find the area of a circle of diameter 10 cm.",
                    "Circle circumference and area",
                    "easy",
                ),
                "learning_objective": "Calculate circumference and area of circles",
            },
        ],
        "medium": [
            {
                "id": "MM_BETA_Cir_M01",
                "subtopic": "Circles and Sectors",
                "prompt": _base(
                    "Circles and Sectors",
                    "Form 3",
                    [
                        "Find arc length and sector area",
                    ],
                    ["P2: Arc length", "P2: Sector area"],
                    "Use angles in degrees.",
                    "A sector has angle 72 degrees and radius 10 cm. Find the arc length and area of the sector.",
                    "Arc length and sector area",
                    "medium",
                ),
                "learning_objective": "Calculate arc length and sector area",
            },
        ],
        "difficult": [
            {
                "id": "MM_BETA_Cir_D01",
                "subtopic": "Circles and Sectors",
                "prompt": _base(
                    "Circles and Sectors",
                    "Form 3-4",
                    [
                        "Solve problems involving composite shapes with circles",
                    ],
                    ["P2: Composite shapes with circles"],
                    "Combine a semicircle with a rectangle or triangle.",
                    "A rectangle 10 cm by 6 cm has a semicircle of radius 3 cm attached on one side. Find the total area and perimeter of the shape.",
                    "Composite circle shapes",
                    "difficult",
                ),
                "learning_objective": "Solve composite area and perimeter with circles",
            },
        ],
    },
}

MM_VOLUME_SA = {
    "subtopic": "Volume and Surface Area",
    "prompts": {
        "easy": [
            {
                "id": "MM_BETA_Vol_E01",
                "subtopic": "Volume and Surface Area",
                "prompt": _base(
                    "Volume and Surface Area",
                    "Form 2",
                    [
                        "Find volume of cuboids and cylinders",
                    ],
                    ["P2: Volume"],
                    "Use simple integers.",
                    "Find the volume of a cuboid 8 cm by 5 cm by 4 cm. Find the volume of a cylinder of radius 3 cm and height 7 cm.",
                    "Volume calculations",
                    "easy",
                ),
                "learning_objective": "Calculate volume of common solids",
            },
        ],
        "medium": [
            {
                "id": "MM_BETA_Vol_M01",
                "subtopic": "Volume and Surface Area",
                "prompt": _base(
                    "Volume and Surface Area",
                    "Form 3",
                    [
                        "Find surface area of cylinders and prisms",
                        "Use volume formulas for cones or spheres",
                    ],
                    ["P2: Surface area", "P2: Volume of cone/sphere"],
                    "Choose one surface area and one volume problem.",
                    "Find the surface area of a cylinder of radius 4 cm and height 10 cm. Find the volume of a cone with radius 5 cm and height 12 cm.",
                    "Surface area and volume",
                    "medium",
                ),
                "learning_objective": "Calculate surface area and volume of solids",
            },
        ],
        "difficult": [
            {
                "id": "MM_BETA_Vol_D01",
                "subtopic": "Volume and Surface Area",
                "prompt": _base(
                    "Volume and Surface Area",
                    "Form 3-4",
                    [
                        "Solve composite solid problems",
                        "Use volume to find missing dimension",
                    ],
                    ["P2: Composite solids"],
                    "Include a composite or a missing dimension.",
                    "A solid is made by joining a hemisphere of radius 6 cm to a cylinder of radius 6 cm and height 10 cm. Find the total volume. A cylinder has volume 500 cm^3 and radius 5 cm. Find its height.",
                    "Composite solids and inverse volume",
                    "difficult",
                ),
                "learning_objective": "Solve composite volume and inverse volume problems",
            },
        ],
    },
}

MM_SCALE = {
    "subtopic": "Scale Drawings and Maps",
    "prompts": {
        "easy": [
            {
                "id": "MM_BETA_Scale_E01",
                "subtopic": "Scale Drawings and Maps",
                "prompt": _base(
                    "Scale Drawings and Maps",
                    "Form 2",
                    [
                        "Use a scale to find actual distance",
                    ],
                    ["P2: Map scale"],
                    "Use simple ratios such as 1:50000.",
                    "On a map with scale 1:50000, the distance between two towns is 4 cm. Find the actual distance in km.",
                    "Map scale",
                    "easy",
                ),
                "learning_objective": "Use map scales to find real distances",
            },
        ],
        "medium": [
            {
                "id": "MM_BETA_Scale_M01",
                "subtopic": "Scale Drawings and Maps",
                "prompt": _base(
                    "Scale Drawings and Maps",
                    "Form 3",
                    [
                        "Find scale from drawing",
                        "Use scale for area",
                    ],
                    ["P2: Scale drawings"],
                    "Use lengths and areas.",
                    "A drawing of a garden is 6 cm by 4 cm and represents an actual garden 15 m by 10 m. Find the scale. Use the scale to find the actual area.",
                    "Scale for length and area",
                    "medium",
                ),
                "learning_objective": "Find scale and use it for area",
            },
        ],
        "difficult": [
            {
                "id": "MM_BETA_Scale_D01",
                "subtopic": "Scale Drawings and Maps",
                "prompt": _base(
                    "Scale Drawings and Maps",
                    "Form 3-4",
                    [
                        "Apply scale factors to area and volume",
                    ],
                    ["P2: Scale factor and area/volume"],
                    "Use linear scale factor and apply to area or volume.",
                    "A model is built to a scale of 1:20. The volume of the model is 0.125 m^3. Find the volume of the actual object.",
                    "Scale factor and volume",
                    "difficult",
                ),
                "learning_objective": "Use scale factors for area and volume",
            },
        ],
    },
}

MM_DENSITY_RATE = {
    "subtopic": "Density, Speed, and Rate",
    "prompts": {
        "easy": [
            {
                "id": "MM_BETA_Den_E01",
                "subtopic": "Density, Speed, and Rate",
                "prompt": _base(
                    "Density, Speed, and Rate",
                    "Form 2",
                    [
                        "Use density = mass/volume",
                        "Use speed = distance/time",
                    ],
                    ["P2: Density", "P2: Speed"],
                    "Use simple values with whole numbers.",
                    "A metal block has mass 240 g and volume 80 cm^3. Find its density. A car travels 180 km in 3 hours. Find its speed.",
                    "Density and speed",
                    "easy",
                ),
                "learning_objective": "Calculate density and speed",
            },
        ],
        "medium": [
            {
                "id": "MM_BETA_Den_M01",
                "subtopic": "Density, Speed, and Rate",
                "prompt": _base(
                    "Density, Speed, and Rate",
                    "Form 3",
                    [
                        "Find mass or volume given density",
                        "Solve multi-step speed problems",
                    ],
                    ["P2: Density rearrangement", "P2: Speed with unit conversion"],
                    "Include a unit conversion in speed or density.",
                    "The density of a liquid is 0.8 g/cm^3. Find the mass of 250 cm^3 of the liquid. A cyclist travels 12 km at 15 km/h and 18 km at 12 km/h. Find total time taken.",
                    "Rearranging formulas and multi-step rates",
                    "medium",
                ),
                "learning_objective": "Solve density and multi-step rate problems",
            },
        ],
        "difficult": [
            {
                "id": "MM_BETA_Den_D01",
                "subtopic": "Density, Speed, and Rate",
                "prompt": _base(
                    "Density, Speed, and Rate",
                    "Form 3-4",
                    [
                        "Solve combined rate problems",
                        "Interpret average speed",
                    ],
                    ["P2: Average speed"],
                    "Use different speeds for different parts of a journey.",
                    "A car travels 40 km at 80 km/h and returns the same distance at 60 km/h. Find the average speed for the whole journey.",
                    "Average speed reasoning",
                    "difficult",
                ),
                "learning_objective": "Calculate average speed in multi-stage journeys",
            },
        ],
    },
}

for _b in (MM_UNITS, MM_PERIM_AREA, MM_CIRCLES, MM_VOLUME_SA, MM_SCALE, MM_DENSITY_RATE):
    for d in ("easy", "medium", "difficult"):
        _b["prompts"].setdefault(d, [])
MENSURATION_BETA = [MM_UNITS, MM_PERIM_AREA, MM_CIRCLES, MM_VOLUME_SA, MM_SCALE, MM_DENSITY_RATE]

# ---- GRAPHS ----
GR_COORD = {
    "subtopic": "Coordinates and Plotting",
    "prompts": {
        "easy": [
            {
                "id": "GR_BETA_Coord_E01",
                "subtopic": "Coordinates and Plotting",
                "prompt": _base(
                    "Coordinates and Plotting",
                    "Form 1",
                    [
                        "Read and plot coordinates",
                        "Identify points in quadrants",
                    ],
                    ["P1, P2: Plot points"],
                    "Use small integer coordinates.",
                    "Plot the points A(2,3), B(-1,4), C(-2,-3), D(4,-1) on a grid. State the quadrant for each point.",
                    "Coordinate plotting",
                    "easy",
                ),
                "learning_objective": "Plot and read coordinates on a Cartesian plane",
            },
        ],
        "medium": [
            {
                "id": "GR_BETA_Coord_M01",
                "subtopic": "Coordinates and Plotting",
                "prompt": _base(
                    "Coordinates and Plotting",
                    "Form 2",
                    [
                        "Find missing coordinates from symmetry or midpoint",
                        "Use distance on a grid",
                    ],
                    ["P2: Midpoint and symmetry"],
                    "Use midpoints or reflections.",
                    "The midpoint of AB is (2,1). If A is (5,4), find B. Reflect point P(3,-2) in the y-axis.",
                    "Coordinate reasoning",
                    "medium",
                ),
                "learning_objective": "Use midpoint and symmetry on coordinate plane",
            },
        ],
        "difficult": [
            {
                "id": "GR_BETA_Coord_D01",
                "subtopic": "Coordinates and Plotting",
                "prompt": _base(
                    "Coordinates and Plotting",
                    "Form 3",
                    [
                        "Use gradients between points",
                        "Find a point given a ratio",
                    ],
                    ["P2: Section formula"],
                    "Include a ratio division on a line segment.",
                    "Point A is (1,2) and B is (7,8). Find the coordinates of the point P that divides AB in the ratio 1:2 internally.",
                    "Coordinate geometry basics",
                    "difficult",
                ),
                "learning_objective": "Use ratio on a line segment in coordinates",
            },
        ],
    },
}

GR_LINEAR = {
    "subtopic": "Linear Graphs and Gradient",
    "prompts": {
        "easy": [
            {
                "id": "GR_BETA_Lin_E01",
                "subtopic": "Linear Graphs and Gradient",
                "prompt": _base(
                    "Linear Graphs and Gradient",
                    "Form 2",
                    [
                        "Draw a straight line from a table of values",
                        "Identify gradient and intercept",
                    ],
                    ["P2: Linear graphs"],
                    "Use y = mx + c with small integers.",
                    "Draw the graph of y = 2x - 3 for -2 <= x <= 3. State the gradient and y-intercept.",
                    "Linear graph plotting",
                    "easy",
                ),
                "learning_objective": "Plot linear graphs and identify gradient and intercept",
            },
        ],
        "medium": [
            {
                "id": "GR_BETA_Lin_M01",
                "subtopic": "Linear Graphs and Gradient",
                "prompt": _base(
                    "Linear Graphs and Gradient",
                    "Form 2-3",
                    [
                        "Find gradient between two points",
                        "Interpret gradient in a context",
                    ],
                    ["P2: Gradient from points"],
                    "Use integer points and require calculation of gradient.",
                    "Find the gradient of the line through A(1,2) and B(5,10). A graph shows distance against time. Explain what the gradient represents.",
                    "Gradient calculation and interpretation",
                    "medium",
                ),
                "learning_objective": "Calculate and interpret gradients",
            },
        ],
        "difficult": [
            {
                "id": "GR_BETA_Lin_D01",
                "subtopic": "Linear Graphs and Gradient",
                "prompt": _base(
                    "Linear Graphs and Gradient",
                    "Form 3",
                    [
                        "Find parallel and perpendicular gradients",
                        "Use gradient to write equations",
                    ],
                    ["P2: Parallel and perpendicular lines"],
                    "Include a line parallel or perpendicular to a given line.",
                    "A line has gradient 3. Find the gradient of a line perpendicular to it. Find the equation of the line through (2,-1) parallel to y = 3x + 4.",
                    "Gradient relationships",
                    "difficult",
                ),
                "learning_objective": "Use gradient properties for parallel and perpendicular lines",
            },
        ],
    },
}

GR_LINE_EQUATION = {
    "subtopic": "Equation of a Straight Line",
    "prompts": {
        "easy": [
            {
                "id": "GR_BETA_Line_E01",
                "subtopic": "Equation of a Straight Line",
                "prompt": _base(
                    "Equation of a Straight Line",
                    "Form 2",
                    [
                        "Find equation from gradient and intercept",
                    ],
                    ["P2: Equation from gradient and intercept"],
                    "Use y = mx + c form.",
                    "Find the equation of the line with gradient 2 and y-intercept -3.",
                    "Equation of a line",
                    "easy",
                ),
                "learning_objective": "Write equations from gradient and intercept",
            },
        ],
        "medium": [
            {
                "id": "GR_BETA_Line_M01",
                "subtopic": "Equation of a Straight Line",
                "prompt": _base(
                    "Equation of a Straight Line",
                    "Form 3",
                    [
                        "Find equation from two points",
                    ],
                    ["P2: Equation from two points"],
                    "Use two integer points.",
                    "Find the equation of the line through A(1,4) and B(5,12).",
                    "Equation from two points",
                    "medium",
                ),
                "learning_objective": "Find line equations using two points",
            },
        ],
        "difficult": [
            {
                "id": "GR_BETA_Line_D01",
                "subtopic": "Equation of a Straight Line",
                "prompt": _base(
                    "Equation of a Straight Line",
                    "Form 3-4",
                    [
                        "Find equation of line parallel or perpendicular to another line",
                    ],
                    ["P2: Parallel/perpendicular line equations"],
                    "Include a point and a given line.",
                    "Find the equation of the line perpendicular to y = -2x + 5 and passing through (3,1).",
                    "Parallel and perpendicular line equations",
                    "difficult",
                ),
                "learning_objective": "Write equations of parallel or perpendicular lines",
            },
        ],
    },
}

GR_QUADRATIC = {
    "subtopic": "Quadratic Graphs",
    "prompts": {
        "easy": [
            {
                "id": "GR_BETA_Quad_E01",
                "subtopic": "Quadratic Graphs",
                "prompt": _base(
                    "Quadratic Graphs",
                    "Form 3",
                    [
                        "Plot quadratic graphs from a table",
                        "Identify roots from a graph",
                    ],
                    ["P2: Quadratic graphs"],
                    "Use y = x^2 + bx + c with small integers.",
                    "Plot y = x^2 - 4x - 5 for -1 <= x <= 5. Use the graph to estimate the roots.",
                    "Quadratic plotting",
                    "easy",
                ),
                "learning_objective": "Plot and read quadratic graphs",
            },
        ],
        "medium": [
            {
                "id": "GR_BETA_Quad_M01",
                "subtopic": "Quadratic Graphs",
                "prompt": _base(
                    "Quadratic Graphs",
                    "Form 3-4",
                    [
                        "Find turning point and axis of symmetry",
                        "Interpret the graph",
                    ],
                    ["P2: Turning point"],
                    "Require the turning point and axis.",
                    "For y = x^2 - 6x + 5, find the coordinates of the turning point and the axis of symmetry. Use the graph to find the minimum value of y.",
                    "Turning point interpretation",
                    "medium",
                ),
                "learning_objective": "Find turning point and interpret quadratic graphs",
            },
        ],
        "difficult": [
            {
                "id": "GR_BETA_Quad_D01",
                "subtopic": "Quadratic Graphs",
                "prompt": _base(
                    "Quadratic Graphs",
                    "Form 4",
                    [
                        "Solve equations by intersection of graphs",
                    ],
                    ["P2: Graphical solutions"],
                    "Use a line and a quadratic; require approximate solutions.",
                    "Solve x^2 - 4x - 5 = 2x - 1 by drawing the graphs of y = x^2 - 4x - 5 and y = 2x - 1 and finding the points of intersection.",
                    "Graphical intersection",
                    "difficult",
                ),
                "learning_objective": "Solve equations using graphical intersections",
            },
        ],
    },
}

GR_SIMUL = {
    "subtopic": "Graphical Solutions and Intersections",
    "prompts": {
        "easy": [
            {
                "id": "GR_BETA_Int_E01",
                "subtopic": "Graphical Solutions and Intersections",
                "prompt": _base(
                    "Graphical Solutions and Intersections",
                    "Form 3",
                    [
                        "Solve two linear equations by graphing",
                    ],
                    ["P2: Linear intersections"],
                    "Use two linear equations with integer solution.",
                    "Solve the system y = x + 1 and y = -x + 5 by drawing their graphs and finding the intersection point.",
                    "Graphical solution of linear equations",
                    "easy",
                ),
                "learning_objective": "Solve linear systems by graphing",
            },
        ],
        "medium": [
            {
                "id": "GR_BETA_Int_M01",
                "subtopic": "Graphical Solutions and Intersections",
                "prompt": _base(
                    "Graphical Solutions and Intersections",
                    "Form 3-4",
                    [
                        "Solve linear and quadratic intersections by graphing",
                    ],
                    ["P2: Linear-quadratic intersections"],
                    "Require approximate solutions from a graph.",
                    "Draw y = x^2 - 3x and y = x + 1 on the same axes and find the x-values of their intersection points.",
                    "Graphical linear-quadratic solution",
                    "medium",
                ),
                "learning_objective": "Use graphs to solve linear-quadratic systems",
            },
        ],
        "difficult": [
            {
                "id": "GR_BETA_Int_D01",
                "subtopic": "Graphical Solutions and Intersections",
                "prompt": _base(
                    "Graphical Solutions and Intersections",
                    "Form 4",
                    [
                        "Interpret number of solutions from graphs",
                        "Use graphs to discuss roots",
                    ],
                    ["P2: Interpretation of solutions"],
                    "Ask for interpretation of the number of solutions and approximate values.",
                    "Sketch y = x^2 - 4x + 4 and y = 2 on the same axes. How many solutions does x^2 - 4x + 4 = 2 have? Estimate the solutions.",
                    "Interpreting intersections",
                    "difficult",
                ),
                "learning_objective": "Interpret solutions using graph intersections",
            },
        ],
    },
}

GR_TRAVEL = {
    "subtopic": "Distance-Time and Speed-Time Graphs",
    "prompts": {
        "easy": [
            {
                "id": "GR_BETA_Trav_E01",
                "subtopic": "Distance-Time and Speed-Time Graphs",
                "prompt": _base(
                    "Distance-Time and Speed-Time Graphs",
                    "Form 2",
                    [
                        "Interpret distance-time graphs",
                        "Read speed from gradient",
                    ],
                    ["P2: Distance-time graphs"],
                    "Use a simple piecewise distance-time graph.",
                    "A distance-time graph shows a car traveling at constant speed for 2 hours, stopping for 1 hour, then returning. State when the car is at rest and find the speed from the gradient.",
                    "Graph interpretation",
                    "easy",
                ),
                "learning_objective": "Interpret distance-time graphs",
            },
        ],
        "medium": [
            {
                "id": "GR_BETA_Trav_M01",
                "subtopic": "Distance-Time and Speed-Time Graphs",
                "prompt": _base(
                    "Distance-Time and Speed-Time Graphs",
                    "Form 3",
                    [
                        "Find distance from a speed-time graph",
                        "Use area under the graph",
                    ],
                    ["P2: Speed-time graphs"],
                    "Use a piecewise linear speed-time graph.",
                    "A speed-time graph shows a vehicle accelerating from 0 to 20 m/s in 5 s, then traveling at 20 m/s for 10 s. Find the total distance traveled.",
                    "Area under speed-time graph",
                    "medium",
                ),
                "learning_objective": "Use speed-time graphs to find distance",
            },
        ],
        "difficult": [
            {
                "id": "GR_BETA_Trav_D01",
                "subtopic": "Distance-Time and Speed-Time Graphs",
                "prompt": _base(
                    "Distance-Time and Speed-Time Graphs",
                    "Form 3-4",
                    [
                        "Interpret complex travel graphs",
                        "Combine multiple stages of motion",
                    ],
                    ["P2: Complex travel graphs"],
                    "Include at least three stages of motion.",
                    "A speed-time graph shows: 0-4 s accelerates to 12 m/s, 4-10 s constant at 12 m/s, 10-14 s decelerates to 0. Find total distance and average speed.",
                    "Complex travel graph interpretation",
                    "difficult",
                ),
                "learning_objective": "Solve multi-stage travel graph problems",
            },
        ],
    },
}

for _b in (GR_COORD, GR_LINEAR, GR_LINE_EQUATION, GR_QUADRATIC, GR_SIMUL, GR_TRAVEL):
    for d in ("easy", "medium", "difficult"):
        _b["prompts"].setdefault(d, [])
GRAPHS_BETA = [GR_COORD, GR_LINEAR, GR_LINE_EQUATION, GR_QUADRATIC, GR_SIMUL, GR_TRAVEL]

# ---- VARIATION ----
VAR_DIRECT = {
    "subtopic": "Direct Variation",
    "prompts": {
        "easy": [
            {
                "id": "VR_BETA_Dir_E01",
                "subtopic": "Direct Variation",
                "prompt": _base(
                    "Direct Variation",
                    "Form 2",
                    [
                        "Use y = kx",
                        "Find k and calculate values",
                    ],
                    ["P2: Direct variation"],
                    "Use one data pair to find k.",
                    "y varies directly as x. If y = 18 when x = 6, find k and find y when x = 10.",
                    "Direct variation calculation",
                    "easy",
                ),
                "learning_objective": "Use direct variation to solve problems",
            },
        ],
        "medium": [
            {
                "id": "VR_BETA_Dir_M01",
                "subtopic": "Direct Variation",
                "prompt": _base(
                    "Direct Variation",
                    "Form 3",
                    [
                        "Solve direct variation with powers",
                        "Use y = kx^n",
                    ],
                    ["P2: Direct variation with powers"],
                    "Use integer powers such as n = 2.",
                    "y varies directly as x^2. If y = 27 when x = 3, find y when x = 5.",
                    "Direct variation with powers",
                    "medium",
                ),
                "learning_objective": "Solve direct variation with powers",
            },
        ],
        "difficult": [
            {
                "id": "VR_BETA_Dir_D01",
                "subtopic": "Direct Variation",
                "prompt": _base(
                    "Direct Variation",
                    "Form 3-4",
                    [
                        "Form equations from a direct variation statement",
                        "Solve for unknowns",
                    ],
                    ["P2: Form and solve variation equations"],
                    "Use a worded statement with two unknowns.",
                    "The time t varies directly as the distance d. When d = 120 km, t = 3 hours. Write the equation and find t when d = 200 km.",
                    "Forming variation equations",
                    "difficult",
                ),
                "learning_objective": "Form and solve direct variation equations",
            },
        ],
    },
}

VAR_INVERSE = {
    "subtopic": "Inverse Variation",
    "prompts": {
        "easy": [
            {
                "id": "VR_BETA_Inv_E01",
                "subtopic": "Inverse Variation",
                "prompt": _base(
                    "Inverse Variation",
                    "Form 2",
                    [
                        "Use y = k/x",
                        "Find k and calculate values",
                    ],
                    ["P2: Inverse variation"],
                    "Use one data pair to find k.",
                    "y varies inversely as x. If y = 5 when x = 12, find y when x = 20.",
                    "Inverse variation calculation",
                    "easy",
                ),
                "learning_objective": "Use inverse variation to solve problems",
            },
        ],
        "medium": [
            {
                "id": "VR_BETA_Inv_M01",
                "subtopic": "Inverse Variation",
                "prompt": _base(
                    "Inverse Variation",
                    "Form 3",
                    [
                        "Solve inverse variation with powers",
                    ],
                    ["P2: Inverse variation with powers"],
                    "Use y = k/x^2 or y = k/(x^2).",
                    "y varies inversely as x^2. If y = 4 when x = 3, find y when x = 6.",
                    "Inverse variation with powers",
                    "medium",
                ),
                "learning_objective": "Solve inverse variation with powers",
            },
        ],
        "difficult": [
            {
                "id": "VR_BETA_Inv_D01",
                "subtopic": "Inverse Variation",
                "prompt": _base(
                    "Inverse Variation",
                    "Form 3-4",
                    [
                        "Solve inverse variation word problems",
                        "Form equations and find unknowns",
                    ],
                    ["P2: Form and solve inverse variation equations"],
                    "Use a context such as time and speed or pressure and volume.",
                    "The time taken to complete a job varies inversely as the number of workers. If 6 workers take 10 days, how many days will 15 workers take?",
                    "Inverse variation in context",
                    "difficult",
                ),
                "learning_objective": "Apply inverse variation in real contexts",
            },
        ],
    },
}

VAR_JOINT = {
    "subtopic": "Joint and Combined Variation",
    "prompts": {
        "easy": [
            {
                "id": "VR_BETA_Joi_E01",
                "subtopic": "Joint and Combined Variation",
                "prompt": _base(
                    "Joint and Combined Variation",
                    "Form 3",
                    [
                        "Use y = kxz or y = kx^2 z",
                    ],
                    ["P2: Joint variation"],
                    "Use small integers and one data pair.",
                    "y varies jointly as x and z. If y = 24 when x = 3 and z = 4, find y when x = 5 and z = 2.",
                    "Joint variation",
                    "easy",
                ),
                "learning_objective": "Solve joint variation problems",
            },
        ],
        "medium": [
            {
                "id": "VR_BETA_Joi_M01",
                "subtopic": "Joint and Combined Variation",
                "prompt": _base(
                    "Joint and Combined Variation",
                    "Form 3-4",
                    [
                        "Use combined variation such as y = kx^2 / z",
                    ],
                    ["P2: Combined variation"],
                    "Use a combined formula with division.",
                    "y varies directly as x^2 and inversely as z. If y = 12 when x = 3 and z = 2, find y when x = 5 and z = 4.",
                    "Combined variation",
                    "medium",
                ),
                "learning_objective": "Solve combined variation problems",
            },
        ],
        "difficult": [
            {
                "id": "VR_BETA_Joi_D01",
                "subtopic": "Joint and Combined Variation",
                "prompt": _base(
                    "Joint and Combined Variation",
                    "Form 4",
                    [
                        "Solve for unknowns in combined variation",
                        "Form equations from word statements",
                    ],
                    ["P2: Form and solve combined variation equations"],
                    "Include an unknown value to be found after forming the equation.",
                    "The volume V of a gas varies directly as the temperature T and inversely as the pressure p. When V = 240, T = 300 and p = 2, find V when T = 360 and p = 3.",
                    "Combined variation with unknowns",
                    "difficult",
                ),
                "learning_objective": "Form and solve combined variation equations",
            },
        ],
    },
}

for _b in (VAR_DIRECT, VAR_INVERSE, VAR_JOINT):
    for d in ("easy", "medium", "difficult"):
        _b["prompts"].setdefault(d, [])
VARIATION_BETA = [VAR_DIRECT, VAR_INVERSE, VAR_JOINT]

# ---- ALGEBRA ----
ALG_SIMPLIFY = {
    "subtopic": "Simplifying and Expanding",
    "prompts": {
        "easy": [
            {
                "id": "AL_BETA_Sim_E01",
                "subtopic": "Simplifying and Expanding",
                "prompt": _base(
                    "Simplifying and Expanding",
                    "Form 1-2",
                    [
                        "Collect like terms",
                        "Expand single brackets",
                    ],
                    ["P1, P2: Simplify expressions", "P2: Expand brackets"],
                    "Use one or two variables and small coefficients.",
                    "Simplify 3x + 2x + 5. Expand 2(x + 3).",
                    "Like terms and single bracket expansion",
                    "easy",
                ),
                "learning_objective": "Simplify expressions and expand single brackets",
            },
        ],
        "medium": [
            {
                "id": "AL_BETA_Sim_M01",
                "subtopic": "Simplifying and Expanding",
                "prompt": _base(
                    "Simplifying and Expanding",
                    "Form 2-3",
                    [
                        "Expand double brackets",
                        "Simplify expressions with negatives",
                        "Evaluate by substitution",
                    ],
                    ["P2: Double brackets", "P2: Substitution"],
                    "Include a double bracket and a substitution value.",
                    "Expand and simplify (x + 3)(x - 5). If x = -2, evaluate 3x^2 + 2x - 1.",
                    "Double bracket expansion and substitution",
                    "medium",
                ),
                "learning_objective": "Expand double brackets and substitute values",
            },
        ],
        "difficult": [
            {
                "id": "AL_BETA_Sim_D01",
                "subtopic": "Simplifying and Expanding",
                "prompt": _base(
                    "Simplifying and Expanding",
                    "Form 3-4",
                    [
                        "Simplify expressions with fractions",
                        "Combine like terms after expansion",
                    ],
                    ["P2: Complex simplification"],
                    "Include fractions or coefficients and require full simplification.",
                    "Simplify (1/2)(4x - 6) + (3/4)(8x + 4). Expand and simplify 2(x - 3) - 3(2x + 1).",
                    "Complex simplification",
                    "difficult",
                ),
                "learning_objective": "Simplify complex algebraic expressions",
            },
        ],
    },
}

ALG_INDICES = {
    "subtopic": "Indices",
    "prompts": {
        "easy": [
            {
                "id": "AL_BETA_Idx_E01",
                "subtopic": "Indices",
                "prompt": _base(
                    "Indices",
                    "Form 2",
                    [
                        "Use index laws for multiplication and division",
                        "Evaluate powers",
                    ],
                    ["P1, P2: Simplify indices"],
                    "Use positive integer indices only.",
                    "Simplify 2^3 * 2^5. Simplify 3^7 / 3^4. Evaluate 5^0.",
                    "Index laws with positive integers",
                    "easy",
                ),
                "learning_objective": "Use index laws for positive integers",
            },
        ],
        "medium": [
            {
                "id": "AL_BETA_Idx_M01",
                "subtopic": "Indices",
                "prompt": _base(
                    "Indices",
                    "Form 3",
                    [
                        "Use negative and fractional indices",
                        "Simplify expressions with mixed indices",
                    ],
                    ["P2: Negative indices", "P2: Fractional indices"],
                    "Include a negative and a fractional index.",
                    "Simplify 2^-3 * 2^5. Evaluate 27^(2/3). Express with positive indices.",
                    "Negative and fractional indices",
                    "medium",
                ),
                "learning_objective": "Use negative and fractional indices correctly",
            },
        ],
        "difficult": [
            {
                "id": "AL_BETA_Idx_D01",
                "subtopic": "Indices",
                "prompt": _base(
                    "Indices",
                    "Form 3-4",
                    [
                        "Simplify algebraic expressions with indices",
                        "Solve simple equations involving indices",
                    ],
                    ["P2: Indices in algebra"],
                    "Use variables with indices and possibly an equation.",
                    "Simplify (x^3 y^-2) * (x^-1 y^4). Solve 2^(x+1) = 16.",
                    "Indices with variables",
                    "difficult",
                ),
                "learning_objective": "Apply index laws to algebraic expressions",
            },
        ],
    },
}

ALG_FACTORISE = {
    "subtopic": "Factorisation",
    "prompts": {
        "easy": [
            {
                "id": "AL_BETA_Fac_E01",
                "subtopic": "Factorisation",
                "prompt": _base(
                    "Factorisation",
                    "Form 2",
                    [
                        "Factor out common factors",
                        "Use difference of two squares",
                        "Factor simple quadratics",
                    ],
                    ["P1, P2: Common factor", "P1, P2: Difference of squares", "P2: Quadratic factorisation"],
                    "Use small integer coefficients.",
                    "Factorise 6x + 12. Factorise x^2 - 9. Factorise x^2 + 5x + 6.",
                    "Basic factorisation",
                    "easy",
                ),
                "learning_objective": "Factorise expressions using basic methods",
            },
        ],
        "medium": [
            {
                "id": "AL_BETA_Fac_M01",
                "subtopic": "Factorisation",
                "prompt": _base(
                    "Factorisation",
                    "Form 3",
                    [
                        "Factorise by grouping",
                        "Factor quadratics with a > 1",
                    ],
                    ["P2: Grouping", "P2: Harder quadratics"],
                    "Use quadratics with a > 1 and grouping.",
                    "Factorise 2x^2 + 7x + 3. Factorise 6x^2 - 7x - 20. Factorise 2x^2 + 4x + 3x + 6.",
                    "Grouping and harder quadratics",
                    "medium",
                ),
                "learning_objective": "Factorise harder expressions",
            },
        ],
        "difficult": [
            {
                "id": "AL_BETA_Fac_D01",
                "subtopic": "Factorisation",
                "prompt": _base(
                    "Factorisation",
                    "Form 3-4",
                    [
                        "Factorise and solve equations",
                        "Factorise algebraic expressions in context",
                    ],
                    ["P2: Solve by factorisation"],
                    "Require solving after factorising.",
                    "Factorise and solve x^2 - 5x + 6 = 0. Factorise 3x^2 - 12x and solve 3x^2 - 12x = 0.",
                    "Factorisation leading to solutions",
                    "difficult",
                ),
                "learning_objective": "Factorise and solve quadratic equations",
            },
        ],
    },
}

ALG_FRACTIONS = {
    "subtopic": "Algebraic Fractions",
    "prompts": {
        "easy": [
            {
                "id": "AL_BETA_Frac_E01",
                "subtopic": "Algebraic Fractions",
                "prompt": _base(
                    "Algebraic Fractions",
                    "Form 3",
                    [
                        "Simplify algebraic fractions by cancelling factors",
                        "Multiply and divide simple algebraic fractions",
                    ],
                    ["P2: Simplify algebraic fractions"],
                    "Factor numerator and denominator before cancelling.",
                    "Simplify (x^2 - 4) / (x + 2). Simplify (2x + 6) / (4x + 12).",
                    "Algebraic fraction simplification",
                    "easy",
                ),
                "learning_objective": "Simplify algebraic fractions",
            },
        ],
        "medium": [
            {
                "id": "AL_BETA_Frac_M01",
                "subtopic": "Algebraic Fractions",
                "prompt": _base(
                    "Algebraic Fractions",
                    "Form 3-4",
                    [
                        "Add and subtract algebraic fractions",
                        "Express as a single fraction",
                    ],
                    ["P2: Add/subtract algebraic fractions"],
                    "Use different denominators with simple factors.",
                    "Simplify 1/(x+1) + 2/(x-1). Express 3/(x+2) - 1/x as a single fraction.",
                    "Algebraic fraction operations",
                    "medium",
                ),
                "learning_objective": "Add and subtract algebraic fractions",
            },
        ],
        "difficult": [
            {
                "id": "AL_BETA_Frac_D01",
                "subtopic": "Algebraic Fractions",
                "prompt": _base(
                    "Algebraic Fractions",
                    "Form 4",
                    [
                        "Simplify complex algebraic fractions",
                        "Solve equations involving algebraic fractions",
                    ],
                    ["P2: Complex algebraic fractions"],
                    "Include a complex fraction or an equation to solve.",
                    "Simplify (1 + 1/x) / (1 - 1/x). Solve 2/x + 1 = 5/3.",
                    "Complex algebraic fraction manipulation",
                    "difficult",
                ),
                "learning_objective": "Simplify complex algebraic fractions and solve equations",
            },
        ],
    },
}

ALG_LINEAR_EQ = {
    "subtopic": "Linear Equations and Word Problems",
    "prompts": {
        "easy": [
            {
                "id": "AL_BETA_Lin_E01",
                "subtopic": "Linear Equations and Word Problems",
                "prompt": _base(
                    "Linear Equations and Word Problems",
                    "Form 2",
                    [
                        "Solve one-step and two-step linear equations",
                    ],
                    ["P1, P2: Solve linear equations"],
                    "Use integers and simple fractions.",
                    "Solve 3x + 4 = 13. Solve 2(x - 3) = 10. Solve x/2 + x/3 = 5.",
                    "Linear equation solving",
                    "easy",
                ),
                "learning_objective": "Solve basic linear equations",
            },
        ],
        "medium": [
            {
                "id": "AL_BETA_Lin_M01",
                "subtopic": "Linear Equations and Word Problems",
                "prompt": _base(
                    "Linear Equations and Word Problems",
                    "Form 3",
                    [
                        "Solve equations with variables on both sides",
                        "Form equations from word problems",
                    ],
                    ["P2: Equations with both sides", "P2: Word problems"],
                    "Include a short word problem such as ages or prices.",
                    "Solve 5x - 3 = 2x + 9. John is 3 years older than Mary. The sum of their ages is 25. Find their ages.",
                    "Forming and solving equations",
                    "medium",
                ),
                "learning_objective": "Form and solve linear equations from contexts",
            },
        ],
        "difficult": [
            {
                "id": "AL_BETA_Lin_D01",
                "subtopic": "Linear Equations and Word Problems",
                "prompt": _base(
                    "Linear Equations and Word Problems",
                    "Form 3-4",
                    [
                        "Solve multi-step word problems",
                        "Use equations with fractions and brackets",
                    ],
                    ["P2: Multi-step word problems"],
                    "Require setting up an equation with a variable and solving.",
                    "A taxi charges a fixed fee of $3 plus $0.80 per km. If a trip costs $19, find the distance traveled. A number is such that three times the number minus 4 equals twice the number plus 9. Find the number.",
                    "Multi-step linear modeling",
                    "difficult",
                ),
                "learning_objective": "Solve multi-step linear word problems",
            },
        ],
    },
}

ALG_SIMULTANEOUS = {
    "subtopic": "Simultaneous Equations",
    "prompts": {
        "easy": [
            {
                "id": "AL_BETA_Sim_E01",
                "subtopic": "Simultaneous Equations",
                "prompt": _base(
                    "Simultaneous Equations",
                    "Form 3",
                    [
                        "Solve two linear equations by elimination or substitution",
                    ],
                    ["P2: Linear simultaneous equations"],
                    "Use integer solutions.",
                    "Solve 2x + y = 7 and x - y = 2. Solve 3x + 2y = 12 and 2x + 3y = 13.",
                    "Linear simultaneous equations",
                    "easy",
                ),
                "learning_objective": "Solve simultaneous linear equations",
            },
        ],
        "medium": [
            {
                "id": "AL_BETA_Sim_M01",
                "subtopic": "Simultaneous Equations",
                "prompt": _base(
                    "Simultaneous Equations",
                    "Form 3-4",
                    [
                        "Solve linear equations with fractions",
                        "Form equations from word problems",
                    ],
                    ["P2: Simultaneous equations with fractions"],
                    "Include fractions or a word problem.",
                    "Solve x/2 + y/3 = 5 and x - y = 4. Form and solve a system: Two numbers add to 12 and differ by 4.",
                    "Simultaneous equations with fractions",
                    "medium",
                ),
                "learning_objective": "Solve simultaneous equations with fractions",
            },
        ],
        "difficult": [
            {
                "id": "AL_BETA_Sim_D01",
                "subtopic": "Simultaneous Equations",
                "prompt": _base(
                    "Simultaneous Equations",
                    "Form 4",
                    [
                        "Solve a linear-quadratic system",
                    ],
                    ["P2: Linear-quadratic simultaneous equations"],
                    "Use one linear and one quadratic equation.",
                    "Solve y = 2x + 1 and x^2 + y^2 = 25.",
                    "Linear-quadratic simultaneous equations",
                    "difficult",
                ),
                "learning_objective": "Solve linear-quadratic systems",
            },
        ],
    },
}

ALG_QUADRATICS = {
    "subtopic": "Quadratic Equations",
    "prompts": {
        "easy": [
            {
                "id": "AL_BETA_Quad_E01",
                "subtopic": "Quadratic Equations",
                "prompt": _base(
                    "Quadratic Equations",
                    "Form 3",
                    [
                        "Solve quadratics by factorisation",
                    ],
                    ["P2: Factorise to solve"],
                    "Use simple factorable quadratics.",
                    "Solve x^2 - 5x + 6 = 0 by factorising.",
                    "Quadratic factorisation",
                    "easy",
                ),
                "learning_objective": "Solve quadratic equations by factorisation",
            },
        ],
        "medium": [
            {
                "id": "AL_BETA_Quad_M01",
                "subtopic": "Quadratic Equations",
                "prompt": _base(
                    "Quadratic Equations",
                    "Form 3-4",
                    [
                        "Use the quadratic formula",
                        "Complete the square",
                    ],
                    ["P2: Quadratic formula", "P2: Completing the square"],
                    "Use one equation for formula and one for completing square.",
                    "Solve 2x^2 + 3x - 2 = 0 using the quadratic formula. Write x^2 + 6x + 5 in the form (x + p)^2 + q.",
                    "Quadratic formula and completing the square",
                    "medium",
                ),
                "learning_objective": "Solve quadratics using formula and completing square",
            },
        ],
        "difficult": [
            {
                "id": "AL_BETA_Quad_D01",
                "subtopic": "Quadratic Equations",
                "prompt": _base(
                    "Quadratic Equations",
                    "Form 4",
                    [
                        "Use discriminant to discuss roots",
                        "Solve quadratic word problems",
                    ],
                    ["P2: Discriminant", "P2: Word problems"],
                    "Include discriminant condition or parameter.",
                    "Find the values of k for which x^2 + kx + 4 = 0 has equal roots. A rectangle has area 24 cm^2 and perimeter 20 cm. Find its dimensions.",
                    "Discriminant and quadratic modeling",
                    "difficult",
                ),
                "learning_objective": "Use discriminant and solve quadratic word problems",
            },
        ],
    },
}

ALG_INEQUALITIES = {
    "subtopic": "Inequalities",
    "prompts": {
        "easy": [
            {
                "id": "AL_BETA_Ineq_E01",
                "subtopic": "Inequalities",
                "prompt": _base(
                    "Inequalities",
                    "Form 2",
                    [
                        "Solve linear inequalities",
                        "Represent solutions on a number line",
                    ],
                    ["P1, P2: Linear inequalities"],
                    "Use simple one-step or two-step inequalities.",
                    "Solve 2x + 3 < 11. Represent the solution on a number line.",
                    "Linear inequalities",
                    "easy",
                ),
                "learning_objective": "Solve linear inequalities and represent solutions",
            },
        ],
        "medium": [
            {
                "id": "AL_BETA_Ineq_M01",
                "subtopic": "Inequalities",
                "prompt": _base(
                    "Inequalities",
                    "Form 3",
                    [
                        "Solve compound inequalities",
                        "List integer solutions in a range",
                    ],
                    ["P2: Compound inequalities"],
                    "Include a compound inequality or two inequalities combined.",
                    "Solve -3 < x <= 4 and list the integer solutions. Solve 2x + 1 > 3 and x - 1 < 7, then give the solution set.",
                    "Compound inequality solutions",
                    "medium",
                ),
                "learning_objective": "Solve and interpret compound inequalities",
            },
        ],
        "difficult": [
            {
                "id": "AL_BETA_Ineq_D01",
                "subtopic": "Inequalities",
                "prompt": _base(
                    "Inequalities",
                    "Form 4",
                    [
                        "Solve quadratic inequalities",
                    ],
                    ["P2: Quadratic inequalities"],
                    "Require factorisation and sign analysis.",
                    "Solve x^2 - 5x + 6 > 0 and represent the solution on a number line.",
                    "Quadratic inequality solving",
                    "difficult",
                ),
                "learning_objective": "Solve quadratic inequalities",
            },
        ],
    },
}

ALG_SEQUENCES = {
    "subtopic": "Sequences and Series",
    "prompts": {
        "easy": [
            {
                "id": "AL_BETA_Seq_E01",
                "subtopic": "Sequences and Series",
                "prompt": _base(
                    "Sequences and Series",
                    "Form 2",
                    [
                        "Find next terms of a sequence",
                        "Find the nth term of an arithmetic sequence",
                    ],
                    ["P1, P2: Sequences"],
                    "Use arithmetic sequences with integer difference.",
                    "Write the next two terms of 2, 5, 8, 11, ... Find the nth term of this sequence.",
                    "Arithmetic sequences",
                    "easy",
                ),
                "learning_objective": "Find nth term of arithmetic sequences",
            },
        ],
        "medium": [
            {
                "id": "AL_BETA_Seq_M01",
                "subtopic": "Sequences and Series",
                "prompt": _base(
                    "Sequences and Series",
                    "Form 3",
                    [
                        "Use arithmetic series sum formula",
                        "Work with geometric sequences",
                    ],
                    ["P2: Arithmetic series", "P2: Geometric sequences"],
                    "Include sum of first n terms or nth term of a GP.",
                    "Find the sum of the first 20 terms of the arithmetic sequence with first term 3 and common difference 2. For the GP 3, 6, 12, ... find the 8th term.",
                    "AP sums and GP nth term",
                    "medium",
                ),
                "learning_objective": "Use AP and GP formulas",
            },
        ],
        "difficult": [
            {
                "id": "AL_BETA_Seq_D01",
                "subtopic": "Sequences and Series",
                "prompt": _base(
                    "Sequences and Series",
                    "Form 4",
                    [
                        "Find n given a term in an AP or GP",
                        "Use sum to infinity for a GP with |r| < 1",
                    ],
                    ["P2: Solve for n", "P2: Sum to infinity"],
                    "Include solving for n or sum to infinity.",
                    "In the AP 4, 9, 14, ... the nth term is 84. Find n. Find the sum to infinity of the GP with first term 8 and ratio 1/2.",
                    "AP/GP problem solving",
                    "difficult",
                ),
                "learning_objective": "Solve AP/GP problems including n and sum to infinity",
            },
        ],
    },
}

ALG_CHANGE_SUBJECT = {
    "subtopic": "Change of Subject",
    "prompts": {
        "easy": [
            {
                "id": "AL_BETA_Sub_E01",
                "subtopic": "Change of Subject",
                "prompt": _base(
                    "Change of Subject",
                    "Form 2",
                    [
                        "Make a variable the subject in simple formulas",
                    ],
                    ["P1, P2: Change subject"],
                    "Use linear formulas.",
                    "Make x the subject of y = 2x + 5. Make r the subject of A = pi r^2.",
                    "Rearranging simple formulas",
                    "easy",
                ),
                "learning_objective": "Rearrange simple formulas",
            },
        ],
        "medium": [
            {
                "id": "AL_BETA_Sub_M01",
                "subtopic": "Change of Subject",
                "prompt": _base(
                    "Change of Subject",
                    "Form 3",
                    [
                        "Rearrange formulas with fractions",
                        "Subject appears in more than one term",
                    ],
                    ["P2: Change subject with fractions"],
                    "Use formulas such as v = u + at, or A = (1/2)(a + b)h.",
                    "Make t the subject of v = u + at. Make h the subject of A = (1/2)(a + b)h.",
                    "Rearranging formulas with fractions",
                    "medium",
                ),
                "learning_objective": "Rearrange formulas with fractions and multiple terms",
            },
        ],
        "difficult": [
            {
                "id": "AL_BETA_Sub_D01",
                "subtopic": "Change of Subject",
                "prompt": _base(
                    "Change of Subject",
                    "Form 4",
                    [
                        "Rearrange formulas with squares or variables in denominator",
                    ],
                    ["P2: Harder change of subject"],
                    "Use a formula with a squared term or a variable in a denominator.",
                    "Make x the subject of y = (2x + 1) / (x - 3). Make r the subject of V = (4/3) pi r^3.",
                    "Advanced rearrangement",
                    "difficult",
                ),
                "learning_objective": "Rearrange more complex formulas",
            },
        ],
    },
}

for _b in (
    ALG_SIMPLIFY,
    ALG_INDICES,
    ALG_FACTORISE,
    ALG_FRACTIONS,
    ALG_LINEAR_EQ,
    ALG_SIMULTANEOUS,
    ALG_QUADRATICS,
    ALG_INEQUALITIES,
    ALG_SEQUENCES,
    ALG_CHANGE_SUBJECT,
):
    for d in ("easy", "medium", "difficult"):
        _b["prompts"].setdefault(d, [])
ALGEBRA_BETA = [
    ALG_SIMPLIFY,
    ALG_INDICES,
    ALG_FACTORISE,
    ALG_FRACTIONS,
    ALG_LINEAR_EQ,
    ALG_SIMULTANEOUS,
    ALG_QUADRATICS,
    ALG_INEQUALITIES,
    ALG_SEQUENCES,
    ALG_CHANGE_SUBJECT,
]

# ---- GEOMETRY ----
GEO_ANGLE = {
    "subtopic": "Angle Facts and Parallel Lines",
    "prompts": {
        "easy": [
            {
                "id": "GEO_BETA_Ang_E01",
                "subtopic": "Angle Facts and Parallel Lines",
                "prompt": _base(
                    "Angle Facts and Parallel Lines",
                    "Form 1-2",
                    [
                        "Use angles on a line and around a point",
                        "Use angles in a triangle",
                    ],
                    ["P1, P2: Angle facts"],
                    "Use simple diagrams and integer angles.",
                    "Find x if angles on a straight line are (2x + 30) and (x + 50). Find the third angle of a triangle with angles 45 and 65 degrees.",
                    "Basic angle facts",
                    "easy",
                ),
                "learning_objective": "Apply basic angle facts",
            },
        ],
        "medium": [
            {
                "id": "GEO_BETA_Ang_M01",
                "subtopic": "Angle Facts and Parallel Lines",
                "prompt": _base(
                    "Angle Facts and Parallel Lines",
                    "Form 2-3",
                    [
                        "Use corresponding, alternate, and co-interior angles",
                    ],
                    ["P2: Parallel line angles"],
                    "Use parallel lines with a transversal.",
                    "Two parallel lines are cut by a transversal. If one corresponding angle is 70 degrees, find the related alternate and co-interior angles.",
                    "Parallel line angle relationships",
                    "medium",
                ),
                "learning_objective": "Use parallel line angle rules",
            },
        ],
        "difficult": [
            {
                "id": "GEO_BETA_Ang_D01",
                "subtopic": "Angle Facts and Parallel Lines",
                "prompt": _base(
                    "Angle Facts and Parallel Lines",
                    "Form 3-4",
                    [
                        "Solve multi-step angle problems with algebra",
                    ],
                    ["P2: Algebraic angle problems"],
                    "Use algebraic expressions for angles.",
                    "In a triangle, the angles are (2x + 10), (x + 20), and (3x - 30). Find x and the angles.",
                    "Algebraic angle reasoning",
                    "difficult",
                ),
                "learning_objective": "Solve angle problems using algebra",
            },
        ],
    },
}

GEO_POLYGON = {
    "subtopic": "Polygons and Bearings",
    "prompts": {
        "easy": [
            {
                "id": "GEO_BETA_Pol_E01",
                "subtopic": "Polygons and Bearings",
                "prompt": _base(
                    "Polygons and Bearings",
                    "Form 2",
                    [
                        "Find interior and exterior angles of regular polygons",
                        "Use three-figure bearings",
                    ],
                    ["P2: Polygon angles", "P2: Bearings"],
                    "Use regular polygons and simple bearings.",
                    "Find each interior angle of a regular hexagon. The bearing of B from A is 045 degrees. State the bearing of A from B.",
                    "Polygon angles and bearings",
                    "easy",
                ),
                "learning_objective": "Use polygon angle facts and bearings",
            },
        ],
        "medium": [
            {
                "id": "GEO_BETA_Pol_M01",
                "subtopic": "Polygons and Bearings",
                "prompt": _base(
                    "Polygons and Bearings",
                    "Form 3",
                    [
                        "Solve polygon angle problems with algebra",
                        "Use bearings with distance",
                    ],
                    ["P2: Polygon angle algebra", "P2: Bearings and distance"],
                    "Include distance and direction in a bearing problem.",
                    "The exterior angle of a regular polygon is 24 degrees. Find the number of sides. A ship sails 30 km on a bearing of 060 degrees. Find the east and north components of its displacement.",
                    "Polygon angle algebra and bearings",
                    "medium",
                ),
                "learning_objective": "Solve polygon and bearing problems",
            },
        ],
        "difficult": [
            {
                "id": "GEO_BETA_Pol_D01",
                "subtopic": "Polygons and Bearings",
                "prompt": _base(
                    "Polygons and Bearings",
                    "Form 3-4",
                    [
                        "Solve multi-step bearing problems",
                        "Use triangle or coordinate methods",
                    ],
                    ["P2: Multi-step bearings"],
                    "Use two legs of a journey and require a final bearing.",
                    "A hiker walks 5 km on a bearing of 040 degrees, then 7 km on a bearing of 120 degrees. Find the distance and bearing from the start to the final position.",
                    "Multi-step bearing calculations",
                    "difficult",
                ),
                "learning_objective": "Solve multi-step bearing problems",
            },
        ],
    },
}

GEO_SIMILAR = {
    "subtopic": "Congruence and Similarity",
    "prompts": {
        "easy": [
            {
                "id": "GEO_BETA_Sim_E01",
                "subtopic": "Congruence and Similarity",
                "prompt": _base(
                    "Congruence and Similarity",
                    "Form 2",
                    [
                        "Identify congruent triangles",
                        "Use SSS, SAS, ASA criteria",
                    ],
                    ["P2: Congruent triangles"],
                    "Use simple diagrams and side/angle information.",
                    "State whether triangles ABC and DEF are congruent given AB = DE, BC = EF, and angle B = angle E. Give a reason.",
                    "Congruence identification",
                    "easy",
                ),
                "learning_objective": "Identify congruent triangles",
            },
        ],
        "medium": [
            {
                "id": "GEO_BETA_Sim_M01",
                "subtopic": "Congruence and Similarity",
                "prompt": _base(
                    "Congruence and Similarity",
                    "Form 3",
                    [
                        "Use similarity to find missing lengths",
                        "Use scale factors",
                    ],
                    ["P2: Similar triangles"],
                    "Provide two similar triangles with a scale factor.",
                    "Triangles PQR and XYZ are similar. If PQ = 4, QR = 6, and XY = 10, find YZ.",
                    "Similarity and scale factor",
                    "medium",
                ),
                "learning_objective": "Use similarity to find lengths",
            },
        ],
        "difficult": [
            {
                "id": "GEO_BETA_Sim_D01",
                "subtopic": "Congruence and Similarity",
                "prompt": _base(
                    "Congruence and Similarity",
                    "Form 3-4",
                    [
                        "Use similarity to compare areas or volumes",
                        "Solve for a scale factor",
                    ],
                    ["P2: Similarity with area/volume"],
                    "Include area or volume scale factor.",
                    "Two similar triangles have areas in the ratio 9:16. The smaller triangle has a side of 6 cm corresponding to a side of x in the larger triangle. Find x.",
                    "Scale factor for area",
                    "difficult",
                ),
                "learning_objective": "Use scale factors for area or volume",
            },
        ],
    },
}

GEO_PYTH = {
    "subtopic": "Pythagoras and Right Triangles",
    "prompts": {
        "easy": [
            {
                "id": "GEO_BETA_Pyth_E01",
                "subtopic": "Pythagoras and Right Triangles",
                "prompt": _base(
                    "Pythagoras and Right Triangles",
                    "Form 2",
                    [
                        "Use a^2 + b^2 = c^2 to find a side",
                    ],
                    ["P2: Pythagoras"],
                    "Use integer triples.",
                    "A right triangle has legs 6 cm and 8 cm. Find the hypotenuse.",
                    "Pythagoras basics",
                    "easy",
                ),
                "learning_objective": "Use Pythagoras to find unknown sides",
            },
        ],
        "medium": [
            {
                "id": "GEO_BETA_Pyth_M01",
                "subtopic": "Pythagoras and Right Triangles",
                "prompt": _base(
                    "Pythagoras and Right Triangles",
                    "Form 3",
                    [
                        "Apply Pythagoras in real-world problems",
                    ],
                    ["P2: Pythagoras in context"],
                    "Use a ladder or rectangle diagonal.",
                    "A ladder 10 m long leans against a wall with its foot 6 m from the wall. Find the height reached.",
                    "Pythagoras in context",
                    "medium",
                ),
                "learning_objective": "Apply Pythagoras in context",
            },
        ],
        "difficult": [
            {
                "id": "GEO_BETA_Pyth_D01",
                "subtopic": "Pythagoras and Right Triangles",
                "prompt": _base(
                    "Pythagoras and Right Triangles",
                    "Form 3-4",
                    [
                        "Use Pythagoras in compound shapes",
                        "Find diagonal in 3D",
                    ],
                    ["P2: Pythagoras in 3D"],
                    "Use a cuboid or compound shape.",
                    "A cuboid has dimensions 3 cm, 4 cm, and 12 cm. Find the length of the space diagonal.",
                    "Pythagoras in 3D",
                    "difficult",
                ),
                "learning_objective": "Use Pythagoras in compound or 3D shapes",
            },
        ],
    },
}

GEO_CIRCLE = {
    "subtopic": "Circle Theorems",
    "prompts": {
        "easy": [
            {
                "id": "GEO_BETA_Cir_E01",
                "subtopic": "Circle Theorems",
                "prompt": _base(
                    "Circle Theorems",
                    "Form 3",
                    [
                        "Use angle in a semicircle",
                        "Use radius perpendicular to tangent",
                    ],
                    ["P2: Circle theorems"],
                    "Use simple diagrams and angles.",
                    "In a circle, AB is a diameter. Angle ACB is 90 degrees. Explain why. A tangent touches a circle at T. Show that the radius OT is perpendicular to the tangent.",
                    "Basic circle theorems",
                    "easy",
                ),
                "learning_objective": "Apply basic circle theorems",
            },
        ],
        "medium": [
            {
                "id": "GEO_BETA_Cir_M01",
                "subtopic": "Circle Theorems",
                "prompt": _base(
                    "Circle Theorems",
                    "Form 3-4",
                    [
                        "Use angle at center and circumference",
                        "Use angles in the same segment",
                    ],
                    ["P2: Circle theorems with angle calculations"],
                    "Require calculation of unknown angles.",
                    "In a circle, angle AOB at the center is 120 degrees. Find angle ACB at the circumference standing on arc AB. Use the same-segment theorem to find another angle.",
                    "Angle relationships in circles",
                    "medium",
                ),
                "learning_objective": "Use circle theorems to find angles",
            },
        ],
        "difficult": [
            {
                "id": "GEO_BETA_Cir_D01",
                "subtopic": "Circle Theorems",
                "prompt": _base(
                    "Circle Theorems",
                    "Form 4",
                    [
                        "Solve multi-step circle theorem problems",
                    ],
                    ["P2: Multi-step circle theorem"],
                    "Use multiple theorems in one diagram.",
                    "In a circle, chords AB and CD intersect at E. Given two angles or arcs, find the unknown angle at the circumference using at least two circle theorems.",
                    "Multi-step circle reasoning",
                    "difficult",
                ),
                "learning_objective": "Solve multi-step circle theorem questions",
            },
        ],
    },
}

GEO_LOCI = {
    "subtopic": "Constructions and Loci",
    "prompts": {
        "easy": [
            {
                "id": "GEO_BETA_Loci_E01",
                "subtopic": "Constructions and Loci",
                "prompt": _base(
                    "Constructions and Loci",
                    "Form 2",
                    [
                        "Construct perpendicular bisector and angle bisector",
                        "Describe basic loci",
                    ],
                    ["P2: Constructions", "P2: Loci"],
                    "Use compass and straightedge constructions.",
                    "Construct the perpendicular bisector of AB. Describe the locus of points equidistant from A and B.",
                    "Basic constructions and loci",
                    "easy",
                ),
                "learning_objective": "Use simple constructions and loci",
            },
        ],
        "medium": [
            {
                "id": "GEO_BETA_Loci_M01",
                "subtopic": "Constructions and Loci",
                "prompt": _base(
                    "Constructions and Loci",
                    "Form 3",
                    [
                        "Construct loci based on distance from point or line",
                    ],
                    ["P2: Loci in the plane"],
                    "Use distance from a point and a line.",
                    "On a diagram, draw the locus of points 3 cm from point A and the locus of points 2 cm from line l. Shade the region that satisfies both conditions.",
                    "Loci and region shading",
                    "medium",
                ),
                "learning_objective": "Draw and interpret loci in the plane",
            },
        ],
        "difficult": [
            {
                "id": "GEO_BETA_Loci_D01",
                "subtopic": "Constructions and Loci",
                "prompt": _base(
                    "Constructions and Loci",
                    "Form 3-4",
                    [
                        "Solve locus problems with combined constraints",
                        "Interpret feasible regions",
                    ],
                    ["P2: Combined loci"],
                    "Include two or more constraints and require the feasible region.",
                    "A point P is within 5 cm of A and at least 3 cm from B. Draw the locus and shade the feasible region.",
                    "Combined loci reasoning",
                    "difficult",
                ),
                "learning_objective": "Solve combined locus problems",
            },
        ],
    },
}

for _b in (GEO_ANGLE, GEO_POLYGON, GEO_SIMILAR, GEO_PYTH, GEO_CIRCLE, GEO_LOCI):
    for d in ("easy", "medium", "difficult"):
        _b["prompts"].setdefault(d, [])
GEOMETRY_BETA = [GEO_ANGLE, GEO_POLYGON, GEO_SIMILAR, GEO_PYTH, GEO_CIRCLE, GEO_LOCI]

# ---- STATISTICS ----
STAT_DATA = {
    "subtopic": "Data Collection and Frequency Tables",
    "prompts": {
        "easy": [
            {
                "id": "ST_BETA_Data_E01",
                "subtopic": "Data Collection and Frequency Tables",
                "prompt": _base(
                    "Data Collection and Frequency Tables",
                    "Form 1-2",
                    [
                        "Create a frequency table from raw data",
                        "Identify data types",
                    ],
                    ["P1, P2: Frequency tables"],
                    "Use small data sets and tally or frequency.",
                    "The marks are: 4, 6, 3, 5, 6, 2, 4, 5, 6. Create a frequency table. State whether the data is discrete or continuous.",
                    "Frequency table construction",
                    "easy",
                ),
                "learning_objective": "Create frequency tables from data",
            },
        ],
        "medium": [
            {
                "id": "ST_BETA_Data_M01",
                "subtopic": "Data Collection and Frequency Tables",
                "prompt": _base(
                    "Data Collection and Frequency Tables",
                    "Form 2-3",
                    [
                        "Complete a two-way table",
                        "Interpret data from a table",
                    ],
                    ["P2: Two-way tables"],
                    "Include a two-way table with missing values.",
                    "A class has 12 boys and 18 girls. 8 boys and 10 girls play football. Complete the two-way table and find how many do not play football.",
                    "Two-way table interpretation",
                    "medium",
                ),
                "learning_objective": "Complete and interpret two-way tables",
            },
        ],
        "difficult": [
            {
                "id": "ST_BETA_Data_D01",
                "subtopic": "Data Collection and Frequency Tables",
                "prompt": _base(
                    "Data Collection and Frequency Tables",
                    "Form 3-4",
                    [
                        "Use frequency tables for cumulative or grouped data",
                        "Interpret grouped intervals",
                    ],
                    ["P2: Grouped frequency tables"],
                    "Use class intervals and ask for midpoints or totals.",
                    "A frequency table has class intervals 0-10, 10-20, 20-30 with frequencies 5, 8, 7. Find the total number of values and the class midpoint for 10-20.",
                    "Grouped data interpretation",
                    "difficult",
                ),
                "learning_objective": "Interpret grouped frequency tables",
            },
        ],
    },
}

STAT_AVERAGES = {
    "subtopic": "Mean, Median, Mode, Range",
    "prompts": {
        "easy": [
            {
                "id": "ST_BETA_Avg_E01",
                "subtopic": "Mean, Median, Mode, Range",
                "prompt": _base(
                    "Mean, Median, Mode, Range",
                    "Form 1-2",
                    [
                        "Calculate mean, median, mode, and range",
                    ],
                    ["P1, P2: Averages"],
                    "Use a small list of numbers.",
                    "Find the mean, median, mode, and range of 5, 7, 3, 7, 9.",
                    "Basic averages",
                    "easy",
                ),
                "learning_objective": "Calculate mean, median, mode, and range",
            },
        ],
        "medium": [
            {
                "id": "ST_BETA_Avg_M01",
                "subtopic": "Mean, Median, Mode, Range",
                "prompt": _base(
                    "Mean, Median, Mode, Range",
                    "Form 2-3",
                    [
                        "Find missing data given a mean",
                        "Compare two data sets",
                    ],
                    ["P2: Mean with missing data"],
                    "Include one missing value and a given mean.",
                    "The mean of five numbers is 12. Four numbers are 8, 10, 14, 15. Find the fifth number. Compare the means of two sets of data.",
                    "Mean with missing data",
                    "medium",
                ),
                "learning_objective": "Solve for missing data using the mean",
            },
        ],
        "difficult": [
            {
                "id": "ST_BETA_Avg_D01",
                "subtopic": "Mean, Median, Mode, Range",
                "prompt": _base(
                    "Mean, Median, Mode, Range",
                    "Form 3-4",
                    [
                        "Use weighted mean",
                        "Interpret averages in context",
                    ],
                    ["P2: Weighted mean"],
                    "Use a simple weighted mean table.",
                    "A test has two papers: Paper 1 worth 40% and Paper 2 worth 60%. A student scores 65 on Paper 1 and 72 on Paper 2. Find the weighted average.",
                    "Weighted mean",
                    "difficult",
                ),
                "learning_objective": "Calculate weighted averages",
            },
        ],
    },
}

STAT_CHARTS = {
    "subtopic": "Charts and Graphs",
    "prompts": {
        "easy": [
            {
                "id": "ST_BETA_Chart_E01",
                "subtopic": "Charts and Graphs",
                "prompt": _base(
                    "Charts and Graphs",
                    "Form 2",
                    [
                        "Draw or interpret bar and pie charts",
                    ],
                    ["P2: Bar charts", "P2: Pie charts"],
                    "Use small data sets and simple angles.",
                    "A class votes for favorite fruit: apples 12, bananas 8, oranges 10. Draw a bar chart or calculate the pie chart angles.",
                    "Bar and pie charts",
                    "easy",
                ),
                "learning_objective": "Draw and interpret bar and pie charts",
            },
        ],
        "medium": [
            {
                "id": "ST_BETA_Chart_M01",
                "subtopic": "Charts and Graphs",
                "prompt": _base(
                    "Charts and Graphs",
                    "Form 3",
                    [
                        "Draw a histogram using frequency density",
                    ],
                    ["P2: Histograms"],
                    "Provide grouped data with unequal class widths.",
                    "Draw a histogram for the intervals 0-5 (freq 10), 5-15 (freq 20), 15-20 (freq 10). Calculate frequency density.",
                    "Histogram and frequency density",
                    "medium",
                ),
                "learning_objective": "Construct histograms from grouped data",
            },
        ],
        "difficult": [
            {
                "id": "ST_BETA_Chart_D01",
                "subtopic": "Charts and Graphs",
                "prompt": _base(
                    "Charts and Graphs",
                    "Form 3-4",
                    [
                        "Interpret charts to make conclusions",
                        "Compare data sets from graphs",
                    ],
                    ["P2: Interpretation of graphs"],
                    "Use a combination of chart types or a complex chart.",
                    "Two pie charts show household spending for 2024 and 2025. Compare the changes in the food and transport categories and state two conclusions.",
                    "Graph interpretation and comparison",
                    "difficult",
                ),
                "learning_objective": "Interpret charts and draw conclusions",
            },
        ],
    },
}

STAT_GROUPED = {
    "subtopic": "Grouped Data and Estimated Mean",
    "prompts": {
        "easy": [
            {
                "id": "ST_BETA_Group_E01",
                "subtopic": "Grouped Data and Estimated Mean",
                "prompt": _base(
                    "Grouped Data and Estimated Mean",
                    "Form 3",
                    [
                        "Find class midpoints",
                        "Estimate mean from grouped data",
                    ],
                    ["P2: Estimated mean"],
                    "Use 3-4 class intervals.",
                    "For class intervals 0-10, 10-20, 20-30 with frequencies 5, 9, 6, find the midpoints and estimate the mean.",
                    "Estimated mean calculation",
                    "easy",
                ),
                "learning_objective": "Estimate the mean from grouped data",
            },
        ],
        "medium": [
            {
                "id": "ST_BETA_Group_M01",
                "subtopic": "Grouped Data and Estimated Mean",
                "prompt": _base(
                    "Grouped Data and Estimated Mean",
                    "Form 3-4",
                    [
                        "Estimate mean for grouped data with larger intervals",
                        "Use a table with frequencies",
                    ],
                    ["P2: Estimated mean"],
                    "Use more intervals or larger values.",
                    "The masses (kg) of students are grouped: 40-50 (6), 50-60 (10), 60-70 (8), 70-80 (6). Estimate the mean mass.",
                    "Estimated mean with grouped data",
                    "medium",
                ),
                "learning_objective": "Calculate estimated mean from grouped data",
            },
        ],
        "difficult": [
            {
                "id": "ST_BETA_Group_D01",
                "subtopic": "Grouped Data and Estimated Mean",
                "prompt": _base(
                    "Grouped Data and Estimated Mean",
                    "Form 4",
                    [
                        "Solve for missing frequency using given mean",
                    ],
                    ["P2: Missing frequency in grouped data"],
                    "Include a missing frequency and a given mean.",
                    "A grouped table has intervals 0-10 (freq 6), 10-20 (freq x), 20-30 (freq 8). The estimated mean is 16. Find x.",
                    "Missing frequency using mean",
                    "difficult",
                ),
                "learning_objective": "Find missing frequency using estimated mean",
            },
        ],
    },
}

STAT_CUMULATIVE = {
    "subtopic": "Cumulative Frequency and Quartiles",
    "prompts": {
        "easy": [
            {
                "id": "ST_BETA_CF_E01",
                "subtopic": "Cumulative Frequency and Quartiles",
                "prompt": _base(
                    "Cumulative Frequency and Quartiles",
                    "Form 3",
                    [
                        "Construct a cumulative frequency table",
                        "Read median from a graph",
                    ],
                    ["P2: Cumulative frequency"],
                    "Use a small grouped data set.",
                    "Using the grouped data 0-10 (5), 10-20 (9), 20-30 (6), create a cumulative frequency table and find the median.",
                    "Cumulative frequency basics",
                    "easy",
                ),
                "learning_objective": "Use cumulative frequency to find median",
            },
        ],
        "medium": [
            {
                "id": "ST_BETA_CF_M01",
                "subtopic": "Cumulative Frequency and Quartiles",
                "prompt": _base(
                    "Cumulative Frequency and Quartiles",
                    "Form 3-4",
                    [
                        "Find quartiles and interquartile range",
                    ],
                    ["P2: Quartiles and IQR"],
                    "Provide a cumulative frequency curve or table.",
                    "A cumulative frequency curve shows 80 data values. Estimate Q1, median, and Q3, then find the interquartile range.",
                    "Quartiles and IQR",
                    "medium",
                ),
                "learning_objective": "Estimate quartiles and IQR",
            },
        ],
        "difficult": [
            {
                "id": "ST_BETA_CF_D01",
                "subtopic": "Cumulative Frequency and Quartiles",
                "prompt": _base(
                    "Cumulative Frequency and Quartiles",
                    "Form 4",
                    [
                        "Interpret outliers using IQR",
                        "Compare distributions",
                    ],
                    ["P2: Outliers and comparison"],
                    "Use IQR rule and compare two distributions.",
                    "Data set A has Q1 = 20, Q3 = 40. Data set B has Q1 = 25, Q3 = 55. Find the IQR for each and determine the outlier boundaries for set A.",
                    "IQR and outlier analysis",
                    "difficult",
                ),
                "learning_objective": "Use IQR to analyze spread and outliers",
            },
        ],
    },
}

STAT_SCATTER = {
    "subtopic": "Scatter Graphs and Correlation",
    "prompts": {
        "easy": [
            {
                "id": "ST_BETA_Scat_E01",
                "subtopic": "Scatter Graphs and Correlation",
                "prompt": _base(
                    "Scatter Graphs and Correlation",
                    "Form 3",
                    [
                        "Plot a scatter graph",
                        "Describe correlation",
                    ],
                    ["P2: Scatter graphs"],
                    "Use a small set of paired data.",
                    "Plot the points (1,2), (2,3), (3,5), (4,6), (5,7). Describe the correlation.",
                    "Scatter plot and correlation",
                    "easy",
                ),
                "learning_objective": "Plot scatter graphs and describe correlation",
            },
        ],
        "medium": [
            {
                "id": "ST_BETA_Scat_M01",
                "subtopic": "Scatter Graphs and Correlation",
                "prompt": _base(
                    "Scatter Graphs and Correlation",
                    "Form 3-4",
                    [
                        "Draw a line of best fit",
                        "Estimate values using the line",
                    ],
                    ["P2: Line of best fit"],
                    "Include a request for an estimated value.",
                    "Draw a line of best fit for a scatter plot and estimate y when x = 8. State whether interpolation or extrapolation was used.",
                    "Line of best fit and estimation",
                    "medium",
                ),
                "learning_objective": "Use line of best fit for estimation",
            },
        ],
        "difficult": [
            {
                "id": "ST_BETA_Scat_D01",
                "subtopic": "Scatter Graphs and Correlation",
                "prompt": _base(
                    "Scatter Graphs and Correlation",
                    "Form 4",
                    [
                        "Identify outliers",
                        "Explain limitations of correlation",
                    ],
                    ["P2: Correlation and outliers"],
                    "Require identifying an outlier and commenting on causation.",
                    "A scatter plot shows a strong positive correlation with one point far from the trend. Identify the outlier and explain why correlation does not always imply causation.",
                    "Outliers and correlation reasoning",
                    "difficult",
                ),
                "learning_objective": "Interpret scatter graphs with outliers",
            },
        ],
    },
}

for _b in (STAT_DATA, STAT_AVERAGES, STAT_CHARTS, STAT_GROUPED, STAT_CUMULATIVE, STAT_SCATTER):
    for d in ("easy", "medium", "difficult"):
        _b["prompts"].setdefault(d, [])
STATISTICS_BETA = [STAT_DATA, STAT_AVERAGES, STAT_CHARTS, STAT_GROUPED, STAT_CUMULATIVE, STAT_SCATTER]
