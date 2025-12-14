#!/usr/bin/env python3
"""
Mathematics Real Numbers Question Prompts
180 Unique Prompts for ZIMSEC O-Level Mathematics
Organized by Subtopic and Difficulty Level
"""

# ============================================================================
# TOPIC: REAL NUMBERS - SUBTOPIC 1: TYPES OF NUMBERS (15 Prompts)
# ============================================================================

TYPES_OF_NUMBERS = {
    "subtopic": "Types of Numbers",
    "description": "Natural, Whole, Integers, Rational, and Irrational numbers",
    "prompts": {
        "easy": [
            {"id": "RN_TN_E01", "subtopic": "Classifying Numbers",
             "prompt": """Generate a ZIMSEC O-Level question about classifying numbers.

Requirements: Given a set of numbers, classify as natural, whole, integer, rational, or irrational.

Example: "From the list: -3, 0, 2.5, √9, π, 7 - identify which are (a) natural numbers (b) integers"

Return JSON: question, solution, answer, points:10, explanation, teaching_explanation.""",
             "learning_objective": "Classify numbers into correct sets"},
            
            {"id": "RN_TN_E02", "subtopic": "Natural Numbers",
             "prompt": """Generate a question about natural numbers (counting numbers).

Requirements: Identify or work with natural numbers {1, 2, 3, ...}

Example: "List all natural numbers less than 8"

Return JSON format.""",
             "learning_objective": "Identify and use natural numbers"},
            
            {"id": "RN_TN_E03", "subtopic": "Integers",
             "prompt": """Generate a question about integers.

Requirements: Work with positive and negative whole numbers and zero.

Example: "List all integers between -4 and 3"

Return JSON format.""",
             "learning_objective": "Understand and work with integers"},
            
            {"id": "RN_TN_E04", "subtopic": "Rational Numbers - Simple",
             "prompt": """Generate a question identifying rational numbers.

Requirements: Numbers that can be expressed as fractions p/q.

Example: "Which of these are rational: 0.5, √2, 3/4, 0.333..."

Return JSON format.""",
             "learning_objective": "Identify rational numbers"},
            
            {"id": "RN_TN_E05", "subtopic": "Number Sets Symbols",
             "prompt": """Generate a question about set notation for number types.

Requirements: Use ℕ, ℤ, ℚ, ℝ notation.

Example: "Using set notation, describe the set of positive integers less than 5"

Return JSON format.""",
             "learning_objective": "Use standard symbols for number sets"}
        ],
        "medium": [
            {"id": "RN_TN_M01", "subtopic": "Irrational Numbers",
             "prompt": """Generate a question about identifying irrational numbers.

Requirements: Numbers that cannot be expressed as fractions (π, √2, etc.)

Example: "Explain why √5 is irrational"

Return JSON format.""",
             "learning_objective": "Identify and understand irrational numbers"},
            
            {"id": "RN_TN_M02", "subtopic": "Converting Decimals to Fractions",
             "prompt": """Generate a question converting decimals to fractions.

Requirements: Terminating or simple recurring decimals.

Example: "Express 0.625 as a fraction in lowest terms"

Return JSON format.""",
             "learning_objective": "Convert decimals to fractions"},
            
            {"id": "RN_TN_M03", "subtopic": "Recurring Decimals",
             "prompt": """Generate a question about recurring decimals.

Requirements: Identify and express recurring decimals.

Example: "Write 4/11 as a decimal and identify the recurring pattern"

Return JSON format.""",
             "learning_objective": "Work with recurring decimal representations"},
            
            {"id": "RN_TN_M04", "subtopic": "Ordering Numbers",
             "prompt": """Generate a question ordering different types of numbers.

Requirements: Mix of fractions, decimals, surds. Arrange in order.

Example: "Arrange in ascending order: 0.7, 3/4, √0.5, 0.72"

Return JSON format.""",
             "learning_objective": "Compare and order real numbers"},
            
            {"id": "RN_TN_M05", "subtopic": "Number Line Placement",
             "prompt": """Generate a question placing numbers on a number line.

Requirements: Place various number types on a number line.

Example: "Place -2.5, √4, 3/2, and -1 on a number line"

Return JSON format.""",
             "learning_objective": "Represent numbers on a number line"}
        ],
        "difficult": [
            {"id": "RN_TN_D01", "subtopic": "Proving Irrationality",
             "prompt": """Generate a question about proving a number is irrational.

Requirements: Use proof by contradiction method.

Example: "Prove that √3 is irrational"

Return JSON with proof structure.""",
             "learning_objective": "Construct proofs of irrationality"},
            
            {"id": "RN_TN_D02", "subtopic": "Recurring to Fraction - Complex",
             "prompt": """Generate a question converting recurring decimals to fractions algebraically.

Requirements: Two or more recurring digits.

Example: "Convert 0.454545... to a fraction"

Return JSON with algebraic method.""",
             "learning_objective": "Convert complex recurring decimals to fractions"},
            
            {"id": "RN_TN_D03", "subtopic": "Operations with Mixed Types",
             "prompt": """Generate a question involving operations with different number types.

Requirements: Combine fractions, decimals, surds in calculation.

Example: "Calculate 2/3 + 0.5 × √4 - 1.25"

Return JSON with step-by-step solution.""",
             "learning_objective": "Perform calculations with mixed number types"},
            
            {"id": "RN_TN_D04", "subtopic": "Set Operations on Number Sets",
             "prompt": """Generate a question using set operations with number types.

Requirements: Union, intersection of number sets.

Example: "If A = {x : x is a prime less than 10} and B = {x : x is odd less than 10}, find A ∩ B"

Return JSON format.""",
             "learning_objective": "Apply set operations to number sets"},
            
            {"id": "RN_TN_D05", "subtopic": "Properties of Real Numbers",
             "prompt": """Generate a question about properties of real numbers.

Requirements: Closure, commutative, associative, distributive properties.

Example: "Which property is illustrated by: 3(x + 2) = 3x + 6?"

Return JSON format.""",
             "learning_objective": "Identify and apply properties of real numbers"}
        ]
    }
}

# ============================================================================
# SUBTOPIC 2: APPROXIMATIONS AND ESTIMATIONS (15 Prompts)
# ============================================================================

APPROXIMATIONS = {
    "subtopic": "Approximations and Estimations",
    "description": "Rounding, significant figures, and estimation",
    "prompts": {
        "easy": [
            {"id": "RN_AP_E01", "subtopic": "Rounding to Decimal Places",
             "prompt": """Generate a ZIMSEC question about rounding to decimal places.

Requirements: Round numbers to 1, 2, or 3 decimal places.

Example: "Round 3.4567 to 2 decimal places"

Return JSON format.""",
             "learning_objective": "Round numbers to specified decimal places"},
            
            {"id": "RN_AP_E02", "subtopic": "Rounding to Significant Figures",
             "prompt": """Generate a question about significant figures.

Requirements: Round to 1, 2, or 3 significant figures.

Example: "Write 0.004567 correct to 2 significant figures"

Return JSON format.""",
             "learning_objective": "Round to significant figures"},
            
            {"id": "RN_AP_E03", "subtopic": "Rounding Whole Numbers",
             "prompt": """Generate a question rounding to nearest 10, 100, 1000.

Requirements: Round large numbers appropriately.

Example: "Round 4567 to the nearest hundred"

Return JSON format.""",
             "learning_objective": "Round whole numbers to specified place value"},
            
            {"id": "RN_AP_E04", "subtopic": "Simple Estimation",
             "prompt": """Generate a question about estimating calculations.

Requirements: Round numbers first, then calculate.

Example: "Estimate 48.7 × 5.2 by rounding to 1 significant figure"

Return JSON format.""",
             "learning_objective": "Estimate calculations by rounding"},
            
            {"id": "RN_AP_E05", "subtopic": "Identifying Significant Figures",
             "prompt": """Generate a question about counting significant figures.

Requirements: Identify how many sig figs in a given number.

Example: "How many significant figures are in 0.00340?"

Return JSON format.""",
             "learning_objective": "Count significant figures correctly"}
        ],
        "medium": [
            {"id": "RN_AP_M01", "subtopic": "Estimation of Complex Calculations",
             "prompt": """Generate a question estimating complex expressions.

Requirements: Use estimation to approximate results.

Example: "Estimate √(98.7/5.1) to 1 decimal place"

Return JSON format.""",
             "learning_objective": "Estimate complex calculations"},
            
            {"id": "RN_AP_M02", "subtopic": "Error and Accuracy",
             "prompt": """Generate a question about absolute and relative error.

Requirements: Calculate error from rounding.

Example: "A measurement is 5.3 cm to 1 d.p. What is the maximum error?"

Return JSON format.""",
             "learning_objective": "Understand error in measurements"},
            
            {"id": "RN_AP_M03", "subtopic": "Truncation",
             "prompt": """Generate a question about truncation vs rounding.

Requirements: Truncate numbers and compare to rounding.

Example: "Truncate 4.789 to 2 decimal places. Compare to rounding."

Return JSON format.""",
             "learning_objective": "Distinguish truncation from rounding"},
            
            {"id": "RN_AP_M04", "subtopic": "Checking Reasonableness",
             "prompt": """Generate a question about checking if answers are reasonable.

Requirements: Use estimation to verify calculator answers.

Example: "Is 4.7 × 29.8 = 1400.6 reasonable? Explain using estimation."

Return JSON format.""",
             "learning_objective": "Use estimation to check answers"},
            
            {"id": "RN_AP_M05", "subtopic": "Appropriate Accuracy",
             "prompt": """Generate a question about giving answers to appropriate accuracy.

Requirements: Context determines appropriate rounding.

Example: "If materials cost $47.89 per metre and you need 3.2 metres, give the cost to appropriate accuracy."

Return JSON format.""",
             "learning_objective": "Give answers to appropriate precision"}
        ],
        "difficult": [
            {"id": "RN_AP_D01", "subtopic": "Upper and Lower Bounds",
             "prompt": """Generate a question about upper and lower bounds.

Requirements: Find bounds for rounded measurements.

Example: "A length is 5.7 cm to 1 d.p. Find the upper and lower bounds."

Return JSON format.""",
             "learning_objective": "Calculate upper and lower bounds"},
            
            {"id": "RN_AP_D02", "subtopic": "Bounds in Calculations",
             "prompt": """Generate a question using bounds in calculations.

Requirements: Use bounds to find max/min of expressions.

Example: "If x = 3.2 and y = 1.5 (both to 1 d.p.), find the maximum value of x/y"

Return JSON format.""",
             "learning_objective": "Apply bounds to calculations"},
            
            {"id": "RN_AP_D03", "subtopic": "Percentage Error",
             "prompt": """Generate a question about percentage error.

Requirements: Calculate percentage error from bounds.

Example: "A mass is given as 45 g to 2 s.f. Calculate the maximum percentage error."

Return JSON format.""",
             "learning_objective": "Calculate percentage error from bounds"},
            
            {"id": "RN_AP_D04", "subtopic": "Bounds with Area/Volume",
             "prompt": """Generate a question using bounds with mensuration.

Requirements: Apply bounds to area or volume calculations.

Example: "A square has side 6.4 cm to 1 d.p. Find bounds for its area."

Return JSON format.""",
             "learning_objective": "Apply bounds to geometric calculations"},
            
            {"id": "RN_AP_D05", "subtopic": "Propagation of Errors",
             "prompt": """Generate a question about how errors propagate.

Requirements: Understand how errors compound in calculations.

Example: "Two lengths are 10.5 cm and 8.3 cm (both ±0.05 cm). Find the bounds of their product."

Return JSON format.""",
             "learning_objective": "Understand error propagation in calculations"}
        ]
    }
}

# ============================================================================
# SUBTOPIC 3: STANDARD FORM / SCIENTIFIC NOTATION (15 Prompts)
# ============================================================================

STANDARD_FORM = {
    "subtopic": "Standard Form",
    "description": "Scientific notation for very large and very small numbers",
    "prompts": {
        "easy": [
            {"id": "RN_SF_E01", "subtopic": "Converting to Standard Form",
             "prompt": """Generate a question converting large numbers to standard form.

Requirements: Write as A × 10^n where 1 ≤ A < 10.

Example: "Write 450000 in standard form"

Return JSON format.""",
             "learning_objective": "Convert large numbers to standard form"},
            
            {"id": "RN_SF_E02", "subtopic": "Converting Small Numbers",
             "prompt": """Generate a question converting small decimals to standard form.

Requirements: Use negative powers of 10.

Example: "Write 0.00067 in standard form"

Return JSON format.""",
             "learning_objective": "Convert small decimals to standard form"},
            
            {"id": "RN_SF_E03", "subtopic": "Standard Form to Ordinary",
             "prompt": """Generate a question converting from standard form.

Requirements: Convert back to ordinary numbers.

Example: "Write 3.5 × 10^4 as an ordinary number"

Return JSON format.""",
             "learning_objective": "Convert standard form to ordinary numbers"},
            
            {"id": "RN_SF_E04", "subtopic": "Identifying Correct Standard Form",
             "prompt": """Generate a question identifying correct standard form.

Requirements: A must be between 1 and 10.

Example: "Which is correct: 45 × 10^3 or 4.5 × 10^4?"

Return JSON format.""",
             "learning_objective": "Recognize correct standard form notation"},
            
            {"id": "RN_SF_E05", "subtopic": "Ordering Standard Form Numbers",
             "prompt": """Generate a question ordering numbers in standard form.

Requirements: Compare numbers with different powers.

Example: "Arrange in order: 3.5 × 10^4, 8.2 × 10^3, 5.1 × 10^4"

Return JSON format.""",
             "learning_objective": "Compare and order numbers in standard form"}
        ],
        "medium": [
            {"id": "RN_SF_M01", "subtopic": "Multiplication in Standard Form",
             "prompt": """Generate a question multiplying numbers in standard form.

Requirements: Apply index laws and adjust.

Example: "Calculate (3 × 10^4) × (4 × 10^5), giving answer in standard form"

Return JSON format.""",
             "learning_objective": "Multiply numbers in standard form"},
            
            {"id": "RN_SF_M02", "subtopic": "Division in Standard Form",
             "prompt": """Generate a question dividing numbers in standard form.

Requirements: Divide coefficients, subtract indices.

Example: "Calculate (8 × 10^7) ÷ (2 × 10^3)"

Return JSON format.""",
             "learning_objective": "Divide numbers in standard form"},
            
            {"id": "RN_SF_M03", "subtopic": "Mixed Operations",
             "prompt": """Generate a question with mixed operations in standard form.

Requirements: Combine multiplication and division.

Example: "Calculate (6 × 10^5) × (2 × 10^-3) ÷ (4 × 10^2)"

Return JSON format.""",
             "learning_objective": "Perform mixed operations with standard form"},
            
            {"id": "RN_SF_M04", "subtopic": "Real World Standard Form",
             "prompt": """Generate a question using standard form in context.

Requirements: Scientific or real-world application.

Example: "The distance from Earth to Sun is 1.5 × 10^8 km. Light travels at 3 × 10^5 km/s. How long does light take?"

Return JSON format.""",
             "learning_objective": "Apply standard form to real-world problems"},
            
            {"id": "RN_SF_M05", "subtopic": "Addition/Subtraction in Standard Form",
             "prompt": """Generate a question adding/subtracting in standard form.

Requirements: Convert to same power first.

Example: "Calculate (5.3 × 10^4) + (2.7 × 10^3)"

Return JSON showing same-power conversion.""",
             "learning_objective": "Add and subtract numbers in standard form"}
        ],
        "difficult": [
            {"id": "RN_SF_D01", "subtopic": "Complex Standard Form Calculations",
             "prompt": """Generate a challenging standard form calculation.

Requirements: Multiple operations, need to adjust final form.

Example: "Express (4.8 × 10^6)² ÷ (1.2 × 10^4) in standard form"

Return JSON format.""",
             "learning_objective": "Perform complex calculations in standard form"},
            
            {"id": "RN_SF_D02", "subtopic": "Standard Form with Roots",
             "prompt": """Generate a question involving roots with standard form.

Requirements: Square roots of standard form numbers.

Example: "Find √(2.5 × 10^7), giving answer in standard form"

Return JSON format.""",
             "learning_objective": "Calculate roots of numbers in standard form"},
            
            {"id": "RN_SF_D03", "subtopic": "Scientific Applications",
             "prompt": """Generate a multi-step scientific application.

Requirements: Use standard form in physics/chemistry context.

Example: "If an atom has mass 2.7 × 10^-26 kg, find the mass of 6 × 10^23 atoms"

Return JSON format.""",
             "learning_objective": "Apply standard form to scientific calculations"},
            
            {"id": "RN_SF_D04", "subtopic": "Standard Form with Sig Figs",
             "prompt": """Generate a question combining standard form and significant figures.

Requirements: Give answer in standard form to specified sig figs.

Example: "Calculate (7.83 × 10^5) × (2.41 × 10^-2), giving answer to 2 s.f."

Return JSON format.""",
             "learning_objective": "Combine standard form with significant figures"},
            
            {"id": "RN_SF_D05", "subtopic": "Standard Form Problems",
             "prompt": """Generate a word problem requiring standard form.

Requirements: Multi-step problem with contextual answer.

Example: "A computer processes 4.5 × 10^9 operations per second. How many in a day?"

Return JSON format.""",
             "learning_objective": "Solve multi-step problems using standard form"}
        ]
    }
}

# ============================================================================
# SUBTOPIC 4: RATIO, RATE AND PROPORTION (15 Prompts)
# ============================================================================

RATIO_AND_PROPORTION = {
    "subtopic": "Ratio, Rate and Proportion",
    "description": "Working with ratios, rates, and proportional reasoning",
    "prompts": {
        "easy": [
            {"id": "RN_RP_E01", "subtopic": "Simplifying Ratios",
             "prompt": """Generate a question about simplifying ratios.

Requirements: Express ratio in simplest form.

Example: "Simplify the ratio 24:36"

Return JSON format.""",
             "learning_objective": "Simplify ratios to lowest terms"},
            
            {"id": "RN_RP_E02", "subtopic": "Equivalent Ratios",
             "prompt": """Generate a question finding equivalent ratios.

Requirements: Scale ratio up or down.

Example: "Find the missing value: 3:5 = __:20"

Return JSON format.""",
             "learning_objective": "Find equivalent ratios"},
            
            {"id": "RN_RP_E03", "subtopic": "Dividing in a Given Ratio",
             "prompt": """Generate a question dividing an amount in a ratio.

Requirements: Share quantity in given ratio.

Example: "Divide $60 in the ratio 2:3"

Return JSON format.""",
             "learning_objective": "Divide quantities in given ratios"},
            
            {"id": "RN_RP_E04", "subtopic": "Simple Rates",
             "prompt": """Generate a question about rates.

Requirements: Calculate simple rates (speed, price per unit, etc.)

Example: "If 5 kg costs $20, find the cost per kg"

Return JSON format.""",
             "learning_objective": "Calculate and use simple rates"},
            
            {"id": "RN_RP_E05", "subtopic": "Converting Ratios",
             "prompt": """Generate a question converting ratios to fractions/decimals.

Requirements: Express ratio as fraction or percentage.

Example: "Express the ratio 3:7 as a fraction of the total"

Return JSON format.""",
             "learning_objective": "Convert between ratios and fractions"}
        ],
        "medium": [
            {"id": "RN_RP_M01", "subtopic": "Three-Part Ratios",
             "prompt": """Generate a question with three-part ratios.

Requirements: Work with a:b:c format.

Example: "Share $180 in the ratio 2:3:4"

Return JSON format.""",
             "learning_objective": "Work with three-part ratios"},
            
            {"id": "RN_RP_M02", "subtopic": "Combining Ratios",
             "prompt": """Generate a question combining two ratios.

Requirements: Link ratios with common term.

Example: "If A:B = 2:3 and B:C = 4:5, find A:B:C"

Return JSON format.""",
             "learning_objective": "Combine ratios with common terms"},
            
            {"id": "RN_RP_M03", "subtopic": "Direct Proportion Problems",
             "prompt": """Generate a direct proportion word problem.

Requirements: Quantities increase together.

Example: "If 8 workers take 6 days, how long do 12 workers take?"... wait, that's inverse. "If 3 metres costs $15, how much for 7 metres?"

Return JSON format.""",
             "learning_objective": "Solve direct proportion problems"},
            
            {"id": "RN_RP_M04", "subtopic": "Rate Problems",
             "prompt": """Generate a problem involving rates.

Requirements: Speed, density, or other compound rates.

Example: "A car travels 240 km in 3 hours. Find its average speed."

Return JSON format.""",
             "learning_objective": "Solve problems involving rates"},
            
            {"id": "RN_RP_M05", "subtopic": "Ratio Changes",
             "prompt": """Generate a question about changing ratios.

Requirements: Track how ratio changes with additions.

Example: "The ratio of boys to girls is 3:4. If 5 boys join, the ratio becomes 4:4. How many girls are there?"

Return JSON format.""",
             "learning_objective": "Solve problems involving changing ratios"}
        ],
        "difficult": [
            {"id": "RN_RP_D01", "subtopic": "Inverse Proportion",
             "prompt": """Generate an inverse proportion problem.

Requirements: As one increases, other decreases.

Example: "8 workers complete a job in 12 days. How many workers needed for 6 days?"

Return JSON format.""",
             "learning_objective": "Solve inverse proportion problems"},
            
            {"id": "RN_RP_D02", "subtopic": "Complex Proportion Problems",
             "prompt": """Generate a multi-step proportion problem.

Requirements: Combine direct and inverse proportion.

Example: "If 10 machines working 8 hours make 400 items, how many items do 15 machines make in 6 hours?"

Return JSON format.""",
             "learning_objective": "Solve complex proportion problems"},
            
            {"id": "RN_RP_D03", "subtopic": "Ratio with Algebra",
             "prompt": """Generate a ratio problem requiring algebra.

Requirements: Set up and solve equations from ratios.

Example: "Two numbers are in ratio 5:3. If 8 is added to each, the ratio becomes 7:5. Find the numbers."

Return JSON format.""",
             "learning_objective": "Use algebra to solve ratio problems"},
            
            {"id": "RN_RP_D04", "subtopic": "Mixture Problems",
             "prompt": """Generate a mixture ratio problem.

Requirements: Combine quantities in different ratios.

Example: "Solution A is acid:water = 1:4. Solution B is 1:2. Mix 2L of A with 3L of B. What's the final ratio?"

Return JSON format.""",
             "learning_objective": "Solve mixture problems using ratios"},
            
            {"id": "RN_RP_D05", "subtopic": "Scale and Map Problems",
             "prompt": """Generate a scale/map problem.

Requirements: Use ratio for scale drawings or maps.

Example: "A map has scale 1:50000. Two towns are 4.5 cm apart on the map. Find the actual distance in km."

Return JSON format.""",
             "learning_objective": "Apply ratios to scale and map problems"}
        ]
    }
}

# ============================================================================
# SUBTOPIC 5: NUMBER BASES (15 Prompts)
# ============================================================================

NUMBER_BASES = {
    "subtopic": "Number Bases",
    "description": "Binary, octal, and other number base conversions",
    "prompts": {
        "easy": [
            {"id": "RN_NB_E01", "subtopic": "Binary to Decimal",
             "prompt": """Generate a question converting binary to decimal.

Requirements: Convert base 2 to base 10.

Example: "Convert 1101₂ to decimal"

Return JSON with place value method.""",
             "learning_objective": "Convert binary to decimal"},
            
            {"id": "RN_NB_E02", "subtopic": "Decimal to Binary",
             "prompt": """Generate a question converting decimal to binary.

Requirements: Convert base 10 to base 2.

Example: "Convert 25 to binary"

Return JSON with division method.""",
             "learning_objective": "Convert decimal to binary"},
            
            {"id": "RN_NB_E03", "subtopic": "Place Values in Binary",
             "prompt": """Generate a question about binary place values.

Requirements: Identify place values (1, 2, 4, 8, 16, ...).

Example: "What is the place value of the leftmost 1 in 10110₂?"

Return JSON format.""",
             "learning_objective": "Understand binary place values"},
            
            {"id": "RN_NB_E04", "subtopic": "Octal to Decimal",
             "prompt": """Generate a question converting octal to decimal.

Requirements: Convert base 8 to base 10.

Example: "Convert 54₈ to decimal"

Return JSON format.""",
             "learning_objective": "Convert octal to decimal"},
            
            {"id": "RN_NB_E05", "subtopic": "Decimal to Octal",
             "prompt": """Generate a question converting decimal to octal.

Requirements: Convert base 10 to base 8.

Example: "Convert 100 to octal"

Return JSON with division method.""",
             "learning_objective": "Convert decimal to octal"}
        ],
        "medium": [
            {"id": "RN_NB_M01", "subtopic": "Binary Addition",
             "prompt": """Generate a question adding binary numbers.

Requirements: Add two binary numbers with carrying.

Example: "Calculate 1011₂ + 1101₂"

Return JSON showing column addition.""",
             "learning_objective": "Add binary numbers"},
            
            {"id": "RN_NB_M02", "subtopic": "Binary Subtraction",
             "prompt": """Generate a question subtracting binary numbers.

Requirements: Subtract binary numbers with borrowing.

Example: "Calculate 10110₂ - 1011₂"

Return JSON format.""",
             "learning_objective": "Subtract binary numbers"},
            
            {"id": "RN_NB_M03", "subtopic": "Binary to Octal",
             "prompt": """Generate a question converting binary to octal.

Requirements: Group bits in threes.

Example: "Convert 110101₂ to octal"

Return JSON showing grouping method.""",
             "learning_objective": "Convert binary to octal directly"},
            
            {"id": "RN_NB_M04", "subtopic": "Octal to Binary",
             "prompt": """Generate a question converting octal to binary.

Requirements: Expand each octal digit to 3 bits.

Example: "Convert 75₈ to binary"

Return JSON format.""",
             "learning_objective": "Convert octal to binary directly"},
            
            {"id": "RN_NB_M05", "subtopic": "Base 5 or Other Bases",
             "prompt": """Generate a question with base 5 or another base.

Requirements: Work with non-standard bases.

Example: "Convert 34₅ to decimal"

Return JSON format.""",
             "learning_objective": "Work with various number bases"}
        ],
        "difficult": [
            {"id": "RN_NB_D01", "subtopic": "Binary Multiplication",
             "prompt": """Generate a question multiplying binary numbers.

Requirements: Multiply two binary numbers.

Example: "Calculate 101₂ × 11₂"

Return JSON with step-by-step working.""",
             "learning_objective": "Multiply binary numbers"},
            
            {"id": "RN_NB_D02", "subtopic": "Converting Between Any Bases",
             "prompt": """Generate a question converting between two non-decimal bases.

Requirements: Convert via decimal or directly.

Example: "Convert 45₈ to binary and then to base 5"

Return JSON format.""",
             "learning_objective": "Convert between arbitrary bases"},
            
            {"id": "RN_NB_D03", "subtopic": "Base n Arithmetic",
             "prompt": """Generate arithmetic in a given base.

Requirements: Add or subtract in bases other than 10.

Example: "Calculate 234₅ + 142₅, giving answer in base 5"

Return JSON format.""",
             "learning_objective": "Perform arithmetic in non-decimal bases"},
            
            {"id": "RN_NB_D04", "subtopic": "Finding the Base",
             "prompt": """Generate a question finding an unknown base.

Requirements: Deduce the base from equation.

Example: "If 23ₙ = 17₁₀, find the value of n"

Return JSON format.""",
             "learning_objective": "Determine unknown number bases"},
            
            {"id": "RN_NB_D05", "subtopic": "Hexadecimal",
             "prompt": """Generate a question involving hexadecimal.

Requirements: Base 16 with A-F digits.

Example: "Convert 2F₁₆ to decimal"

Return JSON format.""",
             "learning_objective": "Work with hexadecimal numbers"}
        ]
    }
}

# ============================================================================
# SUBTOPIC 6: PERCENTAGES AND APPLICATIONS (15 Prompts)
# ============================================================================

PERCENTAGES = {
    "subtopic": "Percentages and Applications",
    "description": "Percentage calculations and real-world applications",
    "prompts": {
        "easy": [
            {"id": "RN_PC_E01", "subtopic": "Converting to Percentage",
             "prompt": """Generate a question converting fractions/decimals to percentages.

Example: "Express 3/8 as a percentage"

Return JSON format.""",
             "learning_objective": "Convert fractions and decimals to percentages"},
            
            {"id": "RN_PC_E02", "subtopic": "Converting from Percentage",
             "prompt": """Generate a question converting percentages to fractions/decimals.

Example: "Express 45% as a fraction in lowest terms"

Return JSON format.""",
             "learning_objective": "Convert percentages to fractions and decimals"},
            
            {"id": "RN_PC_E03", "subtopic": "Finding Percentage of Amount",
             "prompt": """Generate a question finding percentage of a quantity.

Example: "Find 25% of $80"

Return JSON format.""",
             "learning_objective": "Calculate percentage of a given amount"},
            
            {"id": "RN_PC_E04", "subtopic": "Finding the Whole",
             "prompt": """Generate a question finding the whole from a percentage.

Example: "If 20% of a number is 15, find the number"

Return JSON format.""",
             "learning_objective": "Find the whole given a percentage"},
            
            {"id": "RN_PC_E05", "subtopic": "Expressing as Percentage",
             "prompt": """Generate a question expressing one quantity as a percentage of another.

Example: "Express 15 as a percentage of 60"

Return JSON format.""",
             "learning_objective": "Express one quantity as a percentage of another"}
        ],
        "medium": [
            {"id": "RN_PC_M01", "subtopic": "Percentage Increase",
             "prompt": """Generate a percentage increase problem.

Example: "A price increases from $80 to $92. Find the percentage increase."

Return JSON format.""",
             "learning_objective": "Calculate percentage increase"},
            
            {"id": "RN_PC_M02", "subtopic": "Percentage Decrease",
             "prompt": """Generate a percentage decrease problem.

Example: "A population decreases from 500 to 450. Find the percentage decrease."

Return JSON format.""",
             "learning_objective": "Calculate percentage decrease"},
            
            {"id": "RN_PC_M03", "subtopic": "Finding New Amount After Change",
             "prompt": """Generate a problem finding amount after percentage change.

Example: "A shirt costs $40. After 15% discount, what is the new price?"

Return JSON format.""",
             "learning_objective": "Calculate new amounts after percentage changes"},
            
            {"id": "RN_PC_M04", "subtopic": "Finding Original Amount",
             "prompt": """Generate a reverse percentage problem.

Example: "After a 20% increase, the price is $60. What was the original price?"

Return JSON format.""",
             "learning_objective": "Find original amounts from percentage changes"},
            
            {"id": "RN_PC_M05", "subtopic": "Comparing Percentages",
             "prompt": """Generate a problem comparing percentage changes.

Example: "Shop A increases prices by 10% then gives 10% discount. Shop B keeps original. Which is cheaper?"

Return JSON format.""",
             "learning_objective": "Compare and analyze percentage changes"}
        ],
        "difficult": [
            {"id": "RN_PC_D01", "subtopic": "Successive Percentage Changes",
             "prompt": """Generate a successive percentage change problem.

Example: "A population increases by 20% then decreases by 10%. What is the overall percentage change?"

Return JSON format.""",
             "learning_objective": "Calculate cumulative percentage changes"},
            
            {"id": "RN_PC_D02", "subtopic": "Percentage Error",
             "prompt": """Generate a percentage error calculation.

Example: "Measured value is 5.2 cm, actual is 5.0 cm. Find the percentage error."

Return JSON format.""",
             "learning_objective": "Calculate percentage error in measurements"},
            
            {"id": "RN_PC_D03", "subtopic": "Combined Percentage Problems",
             "prompt": """Generate a multi-step percentage problem.

Example: "A shop makes 30% profit on items. After 20% discount sale, what is the effective profit percentage?"

Return JSON format.""",
             "learning_objective": "Solve complex combined percentage problems"},
            
            {"id": "RN_PC_D04", "subtopic": "Percentage Points",
             "prompt": """Generate a question distinguishing percentage from percentage points.

Example: "Interest rate rises from 5% to 8%. Calculate the increase in percentage points and as a percentage."

Return JSON format.""",
             "learning_objective": "Distinguish percentage points from percentage change"},
            
            {"id": "RN_PC_D05", "subtopic": "Percentage Word Problems",
             "prompt": """Generate a complex percentage word problem.

Example: "In an election with 3 candidates, A got 40%, B got 35%. If C got 5000 votes, find total votes."

Return JSON format.""",
             "learning_objective": "Solve complex percentage word problems"}
        ]
    }
}

# ============================================================================
# SUBTOPIC 7: HCF AND LCM (15 Prompts)
# ============================================================================

HCF_LCM = {
    "subtopic": "HCF and LCM",
    "description": "Highest Common Factor and Lowest Common Multiple",
    "prompts": {
        "easy": [
            {"id": "RN_HL_E01", "subtopic": "Finding HCF by Listing",
             "prompt": """Generate a question finding HCF by listing factors.

Example: "Find the HCF of 24 and 36 by listing factors"

Return JSON with factor listing method.""",
             "learning_objective": "Find HCF by listing factors"},
            
            {"id": "RN_HL_E02", "subtopic": "Finding LCM by Listing",
             "prompt": """Generate a question finding LCM by listing multiples.

Example: "Find the LCM of 6 and 8 by listing multiples"

Return JSON format.""",
             "learning_objective": "Find LCM by listing multiples"},
            
            {"id": "RN_HL_E03", "subtopic": "Prime Factorization",
             "prompt": """Generate a question expressing numbers as products of primes.

Example: "Express 60 as a product of prime factors"

Return JSON with factor tree or division method.""",
             "learning_objective": "Write numbers as products of prime factors"},
            
            {"id": "RN_HL_E04", "subtopic": "HCF from Prime Factors",
             "prompt": """Generate a question finding HCF using prime factorization.

Example: "Using prime factors, find the HCF of 48 and 72"

Return JSON showing common factors.""",
             "learning_objective": "Find HCF using prime factorization"},
            
            {"id": "RN_HL_E05", "subtopic": "LCM from Prime Factors",
             "prompt": """Generate a question finding LCM using prime factorization.

Example: "Using prime factors, find the LCM of 12 and 18"

Return JSON format.""",
             "learning_objective": "Find LCM using prime factorization"}
        ],
        "medium": [
            {"id": "RN_HL_M01", "subtopic": "HCF of Three Numbers",
             "prompt": """Generate a question finding HCF of three numbers.

Example: "Find the HCF of 36, 48, and 84"

Return JSON format.""",
             "learning_objective": "Find HCF of three or more numbers"},
            
            {"id": "RN_HL_M02", "subtopic": "LCM of Three Numbers",
             "prompt": """Generate a question finding LCM of three numbers.

Example: "Find the LCM of 4, 6, and 9"

Return JSON format.""",
             "learning_objective": "Find LCM of three or more numbers"},
            
            {"id": "RN_HL_M03", "subtopic": "HCF Word Problems",
             "prompt": """Generate a word problem requiring HCF.

Example: "Two ropes are 24m and 36m. Cut into equal longest possible pieces. How long is each piece?"

Return JSON format.""",
             "learning_objective": "Apply HCF to solve word problems"},
            
            {"id": "RN_HL_M04", "subtopic": "LCM Word Problems",
             "prompt": """Generate a word problem requiring LCM.

Example: "Two bells ring every 15 and 20 minutes. If both ring at 9 AM, when do they next ring together?"

Return JSON format.""",
             "learning_objective": "Apply LCM to solve word problems"},
            
            {"id": "RN_HL_M05", "subtopic": "HCF × LCM = Product",
             "prompt": """Generate a question using HCF × LCM = a × b.

Example: "If HCF of two numbers is 6 and LCM is 90, and one number is 18, find the other."

Return JSON format.""",
             "learning_objective": "Use relationship between HCF, LCM and product"}
        ],
        "difficult": [
            {"id": "RN_HL_D01", "subtopic": "Finding Numbers from HCF/LCM",
             "prompt": """Generate a problem finding numbers given HCF and LCM.

Example: "Two numbers have HCF 4 and LCM 48. If difference is 8, find the numbers."

Return JSON format.""",
             "learning_objective": "Find numbers given their HCF and LCM"},
            
            {"id": "RN_HL_D02", "subtopic": "Algebraic HCF/LCM",
             "prompt": """Generate a question finding HCF/LCM of algebraic expressions.

Example: "Find the HCF of 12x²y and 18xy³"

Return JSON format.""",
             "learning_objective": "Find HCF and LCM of algebraic expressions"},
            
            {"id": "RN_HL_D03", "subtopic": "Complex Word Problems",
             "prompt": """Generate a complex HCF/LCM word problem.

Example: "Three lights flash every 6, 8, and 12 seconds. They flash together at noon. When do they next flash together?"

Return JSON format.""",
             "learning_objective": "Solve complex problems using HCF/LCM"},
            
            {"id": "RN_HL_D04", "subtopic": "Euclidean Algorithm",
             "prompt": """Generate a question using Euclidean algorithm.

Example: "Use the Euclidean algorithm to find HCF of 252 and 180"

Return JSON with algorithm steps.""",
             "learning_objective": "Apply Euclidean algorithm for finding HCF"},
            
            {"id": "RN_HL_D05", "subtopic": "HCF/LCM in Fractions",
             "prompt": """Generate a question using HCF/LCM with fractions.

Example: "Find the smallest number that when divided by 4, 6, and 8 leaves remainder 3"

Return JSON format.""",
             "learning_objective": "Apply HCF/LCM to fraction and remainder problems"}
        ]
    }
}

# ============================================================================
# SUBTOPIC 8: OPERATIONS WITH SURDS (15 Prompts)
# ============================================================================

SURDS = {
    "subtopic": "Operations with Surds",
    "description": "Simplifying and manipulating irrational numbers",
    "prompts": {
        "easy": [
            {"id": "RN_SU_E01", "subtopic": "Simplifying Surds",
             "prompt": """Generate a question simplifying surds.

Example: "Simplify √48"

Return JSON showing extraction of perfect square.""",
             "learning_objective": "Simplify surds by extracting perfect squares"},
            
            {"id": "RN_SU_E02", "subtopic": "Evaluating Surds",
             "prompt": """Generate a question finding values of surd expressions.

Example: "Find the value of √81 - √16"

Return JSON format.""",
             "learning_objective": "Evaluate simple surd expressions"},
            
            {"id": "RN_SU_E03", "subtopic": "Identifying Perfect Squares",
             "prompt": """Generate a question identifying perfect square factors.

Example: "What perfect square is a factor of 72?"

Return JSON format.""",
             "learning_objective": "Identify perfect square factors"},
            
            {"id": "RN_SU_E04", "subtopic": "Expressing in Surd Form",
             "prompt": """Generate a question expressing numbers in surd form.

Example: "Express √12 in the form a√b where b is as small as possible"

Return JSON format.""",
             "learning_objective": "Express surds in simplest form a√b"},
            
            {"id": "RN_SU_E05", "subtopic": "Multiplying Surds",
             "prompt": """Generate a simple surd multiplication.

Example: "Calculate √3 × √12"

Return JSON format.""",
             "learning_objective": "Multiply surds"}
        ],
        "medium": [
            {"id": "RN_SU_M01", "subtopic": "Adding Like Surds",
             "prompt": """Generate a question adding surds with same radicand.

Example: "Simplify 3√5 + 2√5"

Return JSON format.""",
             "learning_objective": "Add surds with the same radicand"},
            
            {"id": "RN_SU_M02", "subtopic": "Subtracting Surds",
             "prompt": """Generate a question subtracting surds.

Example: "Simplify √50 - √18"

Return JSON showing simplification first.""",
             "learning_objective": "Subtract surds after simplifying"},
            
            {"id": "RN_SU_M03", "subtopic": "Multiplying Surd Expressions",
             "prompt": """Generate a question multiplying surd brackets.

Example: "Expand (2 + √3)(1 + √3)"

Return JSON format.""",
             "learning_objective": "Expand brackets involving surds"},
            
            {"id": "RN_SU_M04", "subtopic": "Dividing Surds",
             "prompt": """Generate a question dividing surds.

Example: "Simplify √72 ÷ √2"

Return JSON format.""",
             "learning_objective": "Divide surds"},
            
            {"id": "RN_SU_M05", "subtopic": "Surd Equations",
             "prompt": """Generate a simple equation with surds.

Example: "Solve: √x = 5"

Return JSON format.""",
             "learning_objective": "Solve simple equations involving surds"}
        ],
        "difficult": [
            {"id": "RN_SU_D01", "subtopic": "Rationalizing Denominator - Simple",
             "prompt": """Generate a question rationalizing a simple denominator.

Example: "Rationalize the denominator: 5/√3"

Return JSON with rationalization method.""",
             "learning_objective": "Rationalize simple surd denominators"},
            
            {"id": "RN_SU_D02", "subtopic": "Rationalizing - Conjugate",
             "prompt": """Generate a question using conjugate to rationalize.

Example: "Rationalize: 1/(2 + √3)"

Return JSON showing conjugate method.""",
             "learning_objective": "Rationalize using conjugate pairs"},
            
            {"id": "RN_SU_D03", "subtopic": "Complex Surd Expressions",
             "prompt": """Generate a complex surd simplification.

Example: "Simplify: (√8 + √2)² - (√8 - √2)²"

Return JSON format.""",
             "learning_objective": "Simplify complex surd expressions"},
            
            {"id": "RN_SU_D04", "subtopic": "Surd in Quadratic Form",
             "prompt": """Generate a question solving quadratic with surds.

Example: "Solve: x² - 2√2x + 2 = 0"

Return JSON format.""",
             "learning_objective": "Solve quadratic equations with surd coefficients"},
            
            {"id": "RN_SU_D05", "subtopic": "Nested Surds",
             "prompt": """Generate a question with nested surds.

Example: "Simplify: √(5 + 2√6)"

Return JSON format.""",
             "learning_objective": "Simplify nested surd expressions"}
        ]
    }
}

# ============================================================================
# SUBTOPIC 9: SCALE READING AND MAPS (15 Prompts)
# ============================================================================

SCALE_AND_MAPS = {
    "subtopic": "Scale Reading and Maps",
    "description": "Working with scales, maps, and scale drawings",
    "prompts": {
        "easy": [
            {"id": "RN_SM_E01", "subtopic": "Reading Scale Ratios",
             "prompt": """Generate a question interpreting scale ratios.

Example: "A map has scale 1:25000. What does this mean?"

Return JSON format.""",
             "learning_objective": "Interpret scale ratios"},
            
            {"id": "RN_SM_E02", "subtopic": "Converting Map to Actual",
             "prompt": """Generate a question finding actual distance from map.

Example: "Scale is 1 cm : 5 km. Two points are 3 cm apart on map. Find actual distance."

Return JSON format.""",
             "learning_objective": "Convert map distances to actual distances"},
            
            {"id": "RN_SM_E03", "subtopic": "Converting Actual to Map",
             "prompt": """Generate a question finding map distance from actual.

Example: "Scale is 1:50000. Actual distance is 10 km. Find map distance in cm."

Return JSON format.""",
             "learning_objective": "Convert actual distances to map distances"},
            
            {"id": "RN_SM_E04", "subtopic": "Scale Drawings",
             "prompt": """Generate a question about scale drawings.

Example: "A room is 6m × 4m. Draw it using scale 1 cm : 1 m. What are the dimensions?"

Return JSON format.""",
             "learning_objective": "Create and interpret scale drawings"},
            
            {"id": "RN_SM_E05", "subtopic": "Simple Scale Calculations",
             "prompt": """Generate a direct scale calculation.

Example: "Scale 1:200. A wall is 8m. How long on the drawing?"

Return JSON format.""",
             "learning_objective": "Perform simple scale calculations"}
        ],
        "medium": [
            {"id": "RN_SM_M01", "subtopic": "Scale Conversion",
             "prompt": """Generate a question converting between scale formats.

Example: "Express scale 1:25000 in form 1 cm represents __ m"

Return JSON format.""",
             "learning_objective": "Convert between scale formats"},
            
            {"id": "RN_SM_M02", "subtopic": "Finding Scale",
             "prompt": """Generate a question finding the scale used.

Example: "A 50m field appears as 5cm on drawing. What is the scale?"

Return JSON format.""",
             "learning_objective": "Determine scale from given measurements"},
            
            {"id": "RN_SM_M03", "subtopic": "Area on Maps",
             "prompt": """Generate a question about area with scales.

Example: "Scale 1:1000. A square on map is 4cm × 4cm. Find actual area in m²."

Return JSON with area scale calculation.""",
             "learning_objective": "Calculate actual area from scaled drawings"},
            
            {"id": "RN_SM_M04", "subtopic": "Route Planning",
             "prompt": """Generate a question about route distances.

Example: "On a 1:50000 map, a route is 12cm. How long is the actual journey?"

Return JSON format.""",
             "learning_objective": "Calculate journey distances from maps"},
            
            {"id": "RN_SM_M05", "subtopic": "Scale Model Problems",
             "prompt": """Generate a question about scale models.

Example: "A 1:100 model car is 4.5cm long. How long is the actual car?"

Return JSON format.""",
             "learning_objective": "Work with scale models"}
        ],
        "difficult": [
            {"id": "RN_SM_D01", "subtopic": "Area Scale Factor",
             "prompt": """Generate a question about area scale factor.

Example: "Scale of map is 1:10000. If a park is 4cm² on map, find actual area in hectares."

Return JSON showing area scale squared.""",
             "learning_objective": "Apply squared scale factor for areas"},
            
            {"id": "RN_SM_D02", "subtopic": "Volume Scale Factor",
             "prompt": """Generate a question about volume scale factor.

Example: "A model building has scale 1:50. If model volume is 500cm³, find actual volume."

Return JSON format.""",
             "learning_objective": "Apply cubed scale factor for volumes"},
            
            {"id": "RN_SM_D03", "subtopic": "Comparing Scales",
             "prompt": """Generate a question comparing different scales.

Example: "Map A has scale 1:25000, Map B has scale 1:50000. On which does 1km appear longer?"

Return JSON format.""",
             "learning_objective": "Compare and contrast different scales"},
            
            {"id": "RN_SM_D04", "subtopic": "Complex Map Problems",
             "prompt": """Generate a multi-step map problem.

Example: "A rectangular plot is 8cm × 5cm on 1:2500 map. Find perimeter and area in actual measurements."

Return JSON format.""",
             "learning_objective": "Solve complex scale problems"},
            
            {"id": "RN_SM_D05", "subtopic": "Gradient and Contours",
             "prompt": """Generate a question about elevation and gradient.

Example: "Contours 10m apart. Distance on map is 2cm, scale 1:25000. Find the gradient."

Return JSON format.""",
             "learning_objective": "Calculate gradients from contour maps"}
        ]
    }
}

# ============================================================================
# SUBTOPIC 10: ESTIMATION AND BOUNDS (15 Prompts)
# ============================================================================

BOUNDS_ADV = {
    "subtopic": "Estimation and Bounds - Advanced",
    "description": "Upper and lower bounds in complex calculations",
    "prompts": {
        "easy": [
            {"id": "RN_EB_E01", "subtopic": "Writing Bounds",
             "prompt": """Generate a question stating upper and lower bounds.

Example: "A measurement is 7.3 to 1 d.p. State the bounds."

Return JSON format.""",
             "learning_objective": "State upper and lower bounds from rounded values"},
            
            {"id": "RN_EB_E02", "subtopic": "Continuous Data Bounds",
             "prompt": """Generate a question about bounds for continuous measurements.

Example: "Mass is 45 kg to nearest kg. What are the bounds?"

Return JSON format.""",
             "learning_objective": "Find bounds for continuous measurements"},
            
            {"id": "RN_EB_E03", "subtopic": "Discrete Data",
             "prompt": """Generate a question about discrete vs continuous bounds.

Example: "A crowd is 500 to nearest 100. State bounds."

Return JSON format.""",
             "learning_objective": "Find bounds for discrete quantities"},
            
            {"id": "RN_EB_E04", "subtopic": "Bounds Notation",
             "prompt": """Generate a question using inequality notation for bounds.

Example: "Express 5.4 (1 d.p.) using inequalities"

Return JSON format.""",
             "learning_objective": "Express bounds using inequality notation"},
            
            {"id": "RN_EB_E05", "subtopic": "Error Interval",
             "prompt": """Generate a question about error intervals.

Example: "A length is 3.45 m to nearest cm. Write the error interval."

Return JSON format.""",
             "learning_objective": "Write error intervals for measurements"}
        ],
        "medium": [
            {"id": "RN_EB_M01", "subtopic": "Maximum Sum",
             "prompt": """Generate a question finding maximum of a sum.

Example: "a = 5.3 and b = 2.7 (both 1 d.p.). Find maximum of a + b."

Return JSON format.""",
             "learning_objective": "Find maximum value of sums"},
            
            {"id": "RN_EB_M02", "subtopic": "Minimum Difference",
             "prompt": """Generate a question finding minimum difference.

Example: "Find minimum of a - b where a = 8.2 and b = 3.5 (both 1 d.p.)"

Return JSON format.""",
             "learning_objective": "Find minimum value of differences"},
            
            {"id": "RN_EB_M03", "subtopic": "Maximum Product",
             "prompt": """Generate a question finding bounds of a product.

Example: "Find maximum value of xy if x = 4.0 and y = 3.0 (both 1 d.p.)"

Return JSON format.""",
             "learning_objective": "Find bounds of products"},
            
            {"id": "RN_EB_M04", "subtopic": "Maximum Quotient",
             "prompt": """Generate a question finding bounds of a quotient.

Example: "Find maximum of a/b where a = 10 and b = 4 (nearest whole)"

Return JSON format.""",
             "learning_objective": "Find bounds of quotients"},
            
            {"id": "RN_EB_M05", "subtopic": "Speed and Distance",
             "prompt": """Generate a bounds problem with speed/time/distance.

Example: "Distance 50km (2 s.f.), time 2 hours (nearest hour). Find bounds for speed."

Return JSON format.""",
             "learning_objective": "Apply bounds to speed calculations"}
        ],
        "difficult": [
            {"id": "RN_EB_D01", "subtopic": "Complex Bounds Expressions",
             "prompt": """Generate a complex bounds calculation.

Example: "Find bounds of (a + b)/c where a=10, b=5, c=3 (all nearest whole)"

Return JSON format.""",
             "learning_objective": "Calculate bounds for complex expressions"},
            
            {"id": "RN_EB_D02", "subtopic": "Bounds with Powers",
             "prompt": """Generate a question with bounds involving powers.

Example: "Find bounds of r² where r = 5.0 cm (1 d.p.)"

Return JSON format.""",
             "learning_objective": "Calculate bounds involving powers"},
            
            {"id": "RN_EB_D03", "subtopic": "Bounds with Roots",
             "prompt": """Generate a question with bounds involving roots.

Example: "Find bounds of √A where A = 50 (2 s.f.)"

Return JSON format.""",
             "learning_objective": "Calculate bounds involving roots"},
            
            {"id": "RN_EB_D04", "subtopic": "Trapezium Rule Bounds",
             "prompt": """Generate a question about bounds in area calculations.

Example: "Trapezium has parallel sides 6cm and 8cm, height 4cm (all 1 s.f.). Find bounds of area."

Return JSON format.""",
             "learning_objective": "Apply bounds to geometric calculations"},
            
            {"id": "RN_EB_D05", "subtopic": "Significant Figure Bounds",
             "prompt": """Generate a question finding bounds from significant figures.

Example: "A value is 4300 to 2 s.f. Find bounds."

Return JSON format.""",
             "learning_objective": "Find bounds from significant figures"}
        ]
    }
}

# ============================================================================
# SUBTOPIC 11: NUMBER PATTERNS (15 Prompts)
# ============================================================================

NUMBER_PATTERNS = {
    "subtopic": "Number Patterns",
    "description": "Recognizing and extending number patterns",
    "prompts": {
        "easy": [
            {"id": "RN_NP_E01", "subtopic": "Continuing Patterns",
             "prompt": """Generate a question extending a number pattern.

Example: "Find the next two numbers: 3, 7, 11, 15, ..."

Return JSON format.""",
             "learning_objective": "Extend simple number patterns"},
            
            {"id": "RN_NP_E02", "subtopic": "Describing Rules",
             "prompt": """Generate a question describing a pattern rule.

Example: "Describe the rule for: 2, 6, 18, 54, ..."

Return JSON format.""",
             "learning_objective": "Describe rules for number patterns"},
            
            {"id": "RN_NP_E03", "subtopic": "Square Numbers",
             "prompt": """Generate a question about square numbers.

Example: "List the first 5 square numbers"

Return JSON format.""",
             "learning_objective": "Identify and generate square numbers"},
            
            {"id": "RN_NP_E04", "subtopic": "Triangular Numbers",
             "prompt": """Generate a question about triangular numbers.

Example: "Find the 6th triangular number"

Return JSON format.""",
             "learning_objective": "Work with triangular numbers"},
            
            {"id": "RN_NP_E05", "subtopic": "Cube Numbers",
             "prompt": """Generate a question about cube numbers.

Example: "List all cube numbers less than 100"

Return JSON format.""",
             "learning_objective": "Identify and generate cube numbers"}
        ],
        "medium": [
            {"id": "RN_NP_M01", "subtopic": "Nth Term Linear",
             "prompt": """Generate a question finding nth term of linear sequence.

Example: "Find the nth term of 5, 8, 11, 14, ..."

Return JSON format.""",
             "learning_objective": "Find nth term formula for linear sequences"},
            
            {"id": "RN_NP_M02", "subtopic": "Using Nth Term",
             "prompt": """Generate a question using nth term formula.

Example: "If Un = 3n + 2, find the 20th term"

Return JSON format.""",
             "learning_objective": "Use nth term formulae"},
            
            {"id": "RN_NP_M03", "subtopic": "Finding Position",
             "prompt": """Generate a question finding which term.

Example: "In sequence 4, 9, 14, 19..., is 89 a term? If so, which one?"

Return JSON format.""",
             "learning_objective": "Find position of a given term"},
            
            {"id": "RN_NP_M04", "subtopic": "Fibonacci-type Patterns",
             "prompt": """Generate a question about Fibonacci-type sequences.

Example: "Each term is sum of previous two: 1, 1, 2, 3, 5... Find the 10th term."

Return JSON format.""",
             "learning_objective": "Work with Fibonacci-type patterns"},
            
            {"id": "RN_NP_M05", "subtopic": "Two-Level Differences",
             "prompt": """Generate a question requiring second differences.

Example: "Find the next term: 1, 4, 9, 16, 25, ..."

Return JSON format.""",
             "learning_objective": "Use second differences to find patterns"}
        ],
        "difficult": [
            {"id": "RN_NP_D01", "subtopic": "Nth Term Quadratic",
             "prompt": """Generate a question finding nth term of quadratic sequence.

Example: "Find nth term of 2, 6, 12, 20, 30..."

Return JSON with second difference method.""",
             "learning_objective": "Find nth term of quadratic sequences"},
            
            {"id": "RN_NP_D02", "subtopic": "Number Pattern Proofs",
             "prompt": """Generate a question proving a pattern property.

Example: "Prove sum of first n odd numbers equals n²"

Return JSON format.""",
             "learning_objective": "Prove properties of number patterns"},
            
            {"id": "RN_NP_D03", "subtopic": "Complex Number Patterns",
             "prompt": """Generate a complex pattern question.

Example: "Find nth term of 1, 3, 6, 10, 15..."

Return JSON format.""",
             "learning_objective": "Analyze complex number patterns"},
            
            {"id": "RN_NP_D04", "subtopic": "Pattern Word Problems",
             "prompt": """Generate a pattern word problem.

Example: "A pattern of tiles: 1st row has 3, 2nd has 5, 3rd has 7. Tiles in 20th row?"

Return JSON format.""",
             "learning_objective": "Apply patterns to word problems"},
            
            {"id": "RN_NP_D05", "subtopic": "Sum of Pattern Terms",
             "prompt": """Generate a question summing pattern terms.

Example: "Find sum of first 10 terms of 2, 5, 8, 11..."

Return JSON format.""",
             "learning_objective": "Find sums of terms in patterns"}
        ]
    }
}

# ============================================================================
# SUBTOPIC 12: PROPERTIES OF OPERATIONS (15 Prompts)
# ============================================================================

PROPERTIES = {
    "subtopic": "Properties of Operations",
    "description": "Commutative, associative, distributive properties",
    "prompts": {
        "easy": [
            {"id": "RN_PO_E01", "subtopic": "Commutative Property",
             "prompt": """Generate a question about commutative property.

Example: "Which property is shown by 5 + 3 = 3 + 5?"

Return JSON format.""",
             "learning_objective": "Identify commutative property"},
            
            {"id": "RN_PO_E02", "subtopic": "Associative Property",
             "prompt": """Generate a question about associative property.

Example: "Which property is shown by (2 × 3) × 4 = 2 × (3 × 4)?"

Return JSON format.""",
             "learning_objective": "Identify associative property"},
            
            {"id": "RN_PO_E03", "subtopic": "Distributive Property",
             "prompt": """Generate a question about distributive property.

Example: "Which property is used in: 3(4 + 5) = 3×4 + 3×5?"

Return JSON format.""",
             "learning_objective": "Identify distributive property"},
            
            {"id": "RN_PO_E04", "subtopic": "Identity Elements",
             "prompt": """Generate a question about identity elements.

Example: "What number when added to any number gives the same number?"

Return JSON format.""",
             "learning_objective": "Identify identity elements"},
            
            {"id": "RN_PO_E05", "subtopic": "Inverse Elements",
             "prompt": """Generate a question about inverse elements.

Example: "What is the additive inverse of 7?"

Return JSON format.""",
             "learning_objective": "Find inverse elements"}
        ],
        "medium": [
            {"id": "RN_PO_M01", "subtopic": "Applying Commutative",
             "prompt": """Generate a question applying commutative property.

Example: "Use commutative property to simplify: 7 + 3 + 13"

Return JSON format.""",
             "learning_objective": "Apply commutative property for calculation"},
            
            {"id": "RN_PO_M02", "subtopic": "Applying Associative",
             "prompt": """Generate a question applying associative property.

Example: "Use associative property: 25 × 7 × 4"

Return JSON format.""",
             "learning_objective": "Apply associative property for calculation"},
            
            {"id": "RN_PO_M03", "subtopic": "Applying Distributive",
             "prompt": """Generate a question applying distributive property.

Example: "Use distributive property to calculate: 18 × 99"

Return JSON format.""",
             "learning_objective": "Apply distributive property for calculation"},
            
            {"id": "RN_PO_M04", "subtopic": "Non-Commutative Operations",
             "prompt": """Generate a question about operations that are not commutative.

Example: "Show that subtraction is not commutative with an example."

Return JSON format.""",
             "learning_objective": "Identify non-commutative operations"},
            
            {"id": "RN_PO_M05", "subtopic": "Closure Property",
             "prompt": """Generate a question about closure.

Example: "Are natural numbers closed under subtraction? Explain."

Return JSON format.""",
             "learning_objective": "Understand closure property"}
        ],
        "difficult": [
            {"id": "RN_PO_D01", "subtopic": "Complex Applications",
             "prompt": """Generate a complex calculation using properties.

Example: "Simplify 48 × 25 using properties"

Return JSON format.""",
             "learning_objective": "Apply properties for complex mental math"},
            
            {"id": "RN_PO_D02", "subtopic": "Property Proofs",
             "prompt": """Generate a question proving a property holds.

Example: "Prove distributive property: a(b + c) = ab + ac using examples"

Return JSON format.""",
             "learning_objective": "Demonstrate properties algebraically"},
            
            {"id": "RN_PO_D03", "subtopic": "Identifying All Properties",
             "prompt": """Generate a question identifying multiple properties.

Example: "Name all properties used: 3 × (5 + 7) = 3 × (7 + 5) = 21 + 15 = 36"

Return JSON format.""",
             "learning_objective": "Identify multiple properties in expressions"},
            
            {"id": "RN_PO_D04", "subtopic": "Counter-examples",
             "prompt": """Generate a question using counter-examples.

Example: "Give a counter-example to show: division is not associative"

Return JSON format.""",
             "learning_objective": "Use counter-examples to disprove properties"},
            
            {"id": "RN_PO_D05", "subtopic": "Creating Equations Using Properties",
             "prompt": """Generate a question creating equivalent expressions.

Example: "Use properties to write 3 equivalent forms of: 2(x + 5) + 3x"

Return JSON format.""",
             "learning_objective": "Create equivalent expressions using properties"}
        ]
    }
}

# ============================================================================
# EXPORT ALL SUBTOPICS
# ============================================================================

REAL_NUMBERS_PROMPTS = [
    TYPES_OF_NUMBERS,
    APPROXIMATIONS,
    STANDARD_FORM,
    RATIO_AND_PROPORTION,
    NUMBER_BASES,
    PERCENTAGES,
    HCF_LCM,
    SURDS,
    SCALE_AND_MAPS,
    BOUNDS_ADV,
    NUMBER_PATTERNS,
    PROPERTIES,
]

def get_prompt_count():
    """Count total prompts in this module."""
    total = 0
    for subtopic in REAL_NUMBERS_PROMPTS:
        for difficulty in ["easy", "medium", "difficult"]:
            total += len(subtopic["prompts"].get(difficulty, []))
    return total

def get_all_prompts():
    """Get all prompts organized by subtopic and difficulty."""
    return REAL_NUMBERS_PROMPTS
