import type { MathTopicNotes } from '../mathNotes/types';

export const form1MathNotes: Record<string, MathTopicNotes> = {
    // ============================================
    // TOPIC 1: NUMBER CONCEPTS AND OPERATIONS
    // ============================================
    'Number Concepts and Operations': {
        topic: 'Number Concepts and Operations',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "Number Concepts and Operations is the foundational topic of the ZIMSEC O-Level Mathematics syllabus. It covers the classification of numbers into types (natural, whole, integers, rational, and irrational), finding factors and multiples, calculating H.C.F. and L.C.M., operating with directed numbers on the number line, and performing arithmetic with fractions, decimals, and percentages. Mastery of this topic is essential as it underpins every other area of mathematics you will study.",
        sections: [
            {
                title: '1. Types of Numbers',
                content: "## Number Classifications\n\nIn mathematics, numbers are grouped into different sets based on their properties.\n\n**Natural Numbers (ℕ)**: The counting numbers starting from 1.\n$$\\\\mathbb{N} = \\\\{1, 2, 3, 4, 5, ...\\\\}$$\n\n**Whole Numbers (W)**: Natural numbers together with zero.\n$$W = \\\\{0, 1, 2, 3, 4, 5, ...\\\\}$$\n\n**Integers (ℤ)**: Whole numbers and their negatives.\n$$\\\\mathbb{Z} = \\\\{..., -3, -2, -1, 0, 1, 2, 3, ...\\\\}$$\n\n**Rational Numbers (ℚ)**: Numbers that can be expressed as a fraction $\\\\frac{a}{b}$ where $a$ and $b$ are integers and $b \\\\neq 0$. This includes terminating and recurring decimals.\n\nExamples: $\\\\frac{3}{4}$, $-2$, $0.75$, $0.\\\\overline{3}$\n\n**Irrational Numbers**: Numbers that CANNOT be written as a simple fraction. Their decimal forms are non-terminating and non-recurring.\n\nExamples: $\\\\sqrt{2} \\\\approx 1.41421356...$, $\\\\pi \\\\approx 3.14159265...$\n\n## Relationship Between Number Sets\n\n$$\\\\mathbb{N} \\\\subset W \\\\subset \\\\mathbb{Z} \\\\subset \\\\mathbb{Q} \\\\subset \\\\mathbb{R}$$\n\nEvery natural number is a whole number, every whole number is an integer, and every integer is a rational number. The real numbers ($\\\\mathbb{R}$) include both rational and irrational numbers.",
                worked_examples: [
                    {
                        question: "Classify each of the following numbers: $-5$, $\\\\frac{2}{3}$, $\\\\sqrt{9}$, $\\\\pi$, $0$, $3.\\\\overline{7}$",
                        steps: [
                            "$-5$: This is a negative whole number → Integer",
                            "$\\\\frac{2}{3}$: A fraction of two integers → Rational number",
                            "$\\\\sqrt{9} = 3$: A perfect square root giving a whole number → Natural number, Whole number, Integer, Rational",
                            "$\\\\pi = 3.14159...$: Non-terminating, non-recurring decimal → Irrational number",
                            "$0$: Zero is a whole number → Whole number, Integer, Rational",
                            "$3.\\\\overline{7} = 3.777...$: Recurring decimal → Rational number (equals $\\\\frac{34}{9}$)"
                        ],
                        final_answer: "$-5$ (integer), $\\\\frac{2}{3}$ (rational), $\\\\sqrt{9}$ (natural), $\\\\pi$ (irrational), $0$ (whole), $3.\\\\overline{7}$ (rational)"
                    }
                ]
            },
            {
                title: '2. Factors and Multiples',
                content: "## Factors\n\nA **factor** of a number divides into it exactly with no remainder.\n\nTo find all factors of a number, systematically test from 1 upwards. Factors come in pairs.\n\n## Multiples\n\nA **multiple** of a number is obtained by multiplying it by any natural number.\n\nThe multiples of 6 are: 6, 12, 18, 24, 30, ...\n\n## Prime Numbers\n\nA **prime number** has exactly two factors: 1 and itself.\n\nPrimes up to 30: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29\n\nNote: **1 is NOT a prime number** (it has only one factor). **2 is the only even prime**.\n\n## Prime Factorisation\n\nEvery composite number can be written as a product of its prime factors. Use a factor tree or repeated division.\n\n$$360 = 2^3 \\\\times 3^2 \\\\times 5$$",
                worked_examples: [
                    {
                        question: "Find all the factors of 72.",
                        steps: [
                            "Test systematically: $1 \\\\times 72 = 72$ ✓",
                            "$2 \\\\times 36 = 72$ ✓",
                            "$3 \\\\times 24 = 72$ ✓",
                            "$4 \\\\times 18 = 72$ ✓",
                            "$6 \\\\times 12 = 72$ ✓",
                            "$8 \\\\times 9 = 72$ ✓",
                            "Stop when pairs start repeating (after $\\\\sqrt{72} \\\\approx 8.5$)"
                        ],
                        final_answer: "Factors of 72: 1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72"
                    },
                    {
                        question: "Express 180 as a product of prime factors in index form.",
                        steps: [
                            "$180 \\\\div 2 = 90$",
                            "$90 \\\\div 2 = 45$",
                            "$45 \\\\div 3 = 15$",
                            "$15 \\\\div 3 = 5$",
                            "$5 \\\\div 5 = 1$",
                            "Collecting primes: $2 \\\\times 2 \\\\times 3 \\\\times 3 \\\\times 5$"
                        ],
                        final_answer: "$180 = 2^2 \\\\times 3^2 \\\\times 5$"
                    }
                ]
            },
            {
                title: '3. H.C.F. and L.C.M.',
                content: "## Highest Common Factor (H.C.F.)\n\nThe **H.C.F.** is the largest number that divides exactly into two or more numbers.\n\n### Method: Prime Factorisation\n1. Prime factorise each number\n2. Identify the **common** prime factors\n3. Take the **lowest power** of each common prime\n4. Multiply them together\n\n## Lowest Common Multiple (L.C.M.)\n\nThe **L.C.M.** is the smallest number that is a multiple of two or more given numbers.\n\n### Method: Prime Factorisation\n1. Prime factorise each number\n2. Take **all** prime factors that appear\n3. Use the **highest power** of each\n4. Multiply them together\n\n## Useful Identity\n\nFor two numbers $a$ and $b$:\n$$\\\\text{H.C.F.} \\\\times \\\\text{L.C.M.} = a \\\\times b$$\n\n## When to Use Which\n- **H.C.F.**: Sharing/dividing into equal groups, largest tile to fit, simplifying fractions\n- **L.C.M.**: Events repeating together, common denominators, smallest quantity that works",
                worked_examples: [
                    {
                        question: "Find the H.C.F. and L.C.M. of 48 and 60.",
                        steps: [
                            "Prime factorise: $48 = 2^4 \\\\times 3$",
                            "Prime factorise: $60 = 2^2 \\\\times 3 \\\\times 5$",
                            "H.C.F.: Common primes with lowest powers: $2^2 \\\\times 3 = 12$",
                            "L.C.M.: All primes with highest powers: $2^4 \\\\times 3 \\\\times 5 = 240$",
                            "Check: $12 \\\\times 240 = 2880 = 48 \\\\times 60$ ✓"
                        ],
                        final_answer: "H.C.F. = 12, L.C.M. = 240"
                    }
                ]
            },
            {
                title: '4. Directed Numbers',
                content: "## What Are Directed Numbers?\n\nDirected numbers are numbers with a positive (+) or negative (−) sign, showing direction on a number line.\n\n## Real-Life Examples\n- Temperature: $-5°C$ means 5 degrees below zero\n- Bank balance: $-\\$200$ means an overdraft of \\$200\n- Altitude: $-50$ m means 50 metres below sea level\n\n## Rules for Addition and Subtraction\n\n**Adding two positive numbers**: Add normally → positive result\n$$3 + 5 = 8$$\n\n**Adding two negative numbers**: Add the values → negative result\n$$(-3) + (-5) = -8$$\n\n**Adding numbers with different signs**: Subtract the smaller from the larger → take the sign of the larger\n$$(-7) + 4 = -3$$\n$$8 + (-3) = 5$$\n\n**Subtracting a negative**: Change to addition\n$$5 - (-3) = 5 + 3 = 8$$\n\n## Rules for Multiplication and Division\n\n| Operation | Result |\n|-----------|--------|\n| $(+) \\\\times (+)$ | $+$ |\n| $(-) \\\\times (-)$ | $+$ |\n| $(+) \\\\times (-)$ | $-$ |\n| $(-) \\\\times (+)$ | $-$ |\n\nThe same rules apply for division. **Same signs → positive. Different signs → negative.**",
                worked_examples: [
                    {
                        question: "Calculate: $(-8) \\\\times 3 + (-12) \\\\div (-4)$",
                        steps: [
                            "Apply BODMAS: multiplication and division first",
                            "$(-8) \\\\times 3 = -24$ (different signs → negative)",
                            "$(-12) \\\\div (-4) = 3$ (same signs → positive)",
                            "$-24 + 3 = -21$"
                        ],
                        final_answer: "$-21$"
                    },
                    {
                        question: "The temperature in Nyanga was $-3°C$ at midnight. By noon it had risen by $11°C$. What was the noon temperature?",
                        steps: [
                            "Starting temperature: $-3°C$",
                            "Rise of $11°C$ means add 11",
                            "$-3 + 11 = 8$"
                        ],
                        final_answer: "The noon temperature was $8°C$"
                    }
                ]
            },
            {
                title: '5. Operations with Fractions',
                content: "## Types of Fractions\n\n- **Proper fraction**: numerator < denominator, e.g., $\\\\frac{3}{7}$\n- **Improper fraction**: numerator ≥ denominator, e.g., $\\\\frac{9}{4}$\n- **Mixed number**: whole number + fraction, e.g., $2\\\\frac{1}{3}$\n\n## Addition and Subtraction\n\n1. Find the **Lowest Common Denominator (LCD)**\n2. Convert each fraction to an equivalent fraction with the LCD\n3. Add or subtract the numerators\n4. Simplify if needed\n\n$$\\\\frac{2}{3} + \\\\frac{3}{5} = \\\\frac{10}{15} + \\\\frac{9}{15} = \\\\frac{19}{15} = 1\\\\frac{4}{15}$$\n\n## Multiplication\n\nMultiply numerators together and denominators together. Cancel common factors first.\n$$\\\\frac{a}{b} \\\\times \\\\frac{c}{d} = \\\\frac{a \\\\times c}{b \\\\times d}$$\n\n## Division\n\nKeep the first fraction, change ÷ to ×, flip the second fraction.\n$$\\\\frac{a}{b} \\\\div \\\\frac{c}{d} = \\\\frac{a}{b} \\\\times \\\\frac{d}{c}$$",
                worked_examples: [
                    {
                        question: "Calculate $2\\\\frac{1}{4} + 1\\\\frac{2}{3}$.",
                        steps: [
                            "Convert to improper fractions: $\\\\frac{9}{4} + \\\\frac{5}{3}$",
                            "LCD of 4 and 3 is 12",
                            "$\\\\frac{9}{4} = \\\\frac{27}{12}$, $\\\\frac{5}{3} = \\\\frac{20}{12}$",
                            "$\\\\frac{27}{12} + \\\\frac{20}{12} = \\\\frac{47}{12} = 3\\\\frac{11}{12}$"
                        ],
                        final_answer: "$3\\\\frac{11}{12}$"
                    }
                ]
            },
            {
                title: '6. Decimals and Percentages',
                content: "## Decimal Operations\n\nDecimals follow the same rules as whole numbers but you must align the decimal points for addition and subtraction.\n\nFor multiplication, multiply as whole numbers then count total decimal places.\n$$0.3 \\\\times 0.4 = 0.12 \\\\text{ (1 d.p. + 1 d.p. = 2 d.p.)}$$\n\nFor division, make the divisor a whole number by multiplying both numbers by powers of 10.\n$$1.44 \\\\div 0.12 = 144 \\\\div 12 = 12$$\n\n## Converting Between Forms\n\n| Fraction | Decimal | Percentage |\n|----------|---------|------------|\n| $\\\\frac{1}{2}$ | 0.5 | 50% |\n| $\\\\frac{1}{4}$ | 0.25 | 25% |\n| $\\\\frac{3}{4}$ | 0.75 | 75% |\n| $\\\\frac{1}{5}$ | 0.2 | 20% |\n| $\\\\frac{1}{3}$ | $0.\\\\overline{3}$ | $33\\\\frac{1}{3}$% |\n\n## Percentage Calculations\n\n- **Finding a percentage of a quantity**: $\\\\frac{\\\\text{percentage}}{100} \\\\times \\\\text{quantity}$\n- **Expressing as a percentage**: $\\\\frac{\\\\text{part}}{\\\\text{whole}} \\\\times 100\\\\%$\n- **Percentage increase/decrease**: $\\\\frac{\\\\text{change}}{\\\\text{original}} \\\\times 100\\\\%$",
                worked_examples: [
                    {
                        question: "A school has 840 students. If 55% are girls, how many boys are there?",
                        steps: [
                            "Percentage of boys = $100\\\\% - 55\\\\% = 45\\\\%$",
                            "Number of boys = $\\\\frac{45}{100} \\\\times 840$",
                            "$= 0.45 \\\\times 840 = 378$"
                        ],
                        final_answer: "There are 378 boys"
                    }
                ]
            },
            {
                title: '7. Order of Operations (BODMAS)',
                content: "## BODMAS Rule\n\nWhen a calculation has more than one operation, follow this order:\n\n| Letter | Meaning | Example |\n|--------|---------|----------|\n| **B** | Brackets | $(3 + 2)$ first |\n| **O** | Orders (powers, roots) | $2^3$, $\\\\sqrt{9}$ |\n| **D** | Division | $12 \\\\div 3$ |\n| **M** | Multiplication | $4 \\\\times 5$ |\n| **A** | Addition | $3 + 7$ |\n| **S** | Subtraction | $10 - 4$ |\n\nNote: Division and Multiplication have **equal priority** (work left to right). Addition and Subtraction also have **equal priority**.\n\n## Nested Brackets\n\nWork from the innermost brackets outward:\n$$2 \\\\times [3 + (4 \\\\times 2)] = 2 \\\\times [3 + 8] = 2 \\\\times 11 = 22$$",
                worked_examples: [
                    {
                        question: "Evaluate: $18 - 2 \\\\times (3 + 4) + 6 \\\\div 3$",
                        steps: [
                            "Brackets first: $3 + 4 = 7$",
                            "Expression becomes: $18 - 2 \\\\times 7 + 6 \\\\div 3$",
                            "Multiplication: $2 \\\\times 7 = 14$",
                            "Division: $6 \\\\div 3 = 2$",
                            "Left to right: $18 - 14 + 2 = 6$"
                        ],
                        final_answer: "$6$"
                    }
                ]
            }
        ],
        key_points: [
            "Natural numbers start from 1; whole numbers include 0; integers include negatives",
            "Rational numbers can be expressed as fractions; irrational numbers cannot",
            "H.C.F. uses common primes with LOWEST powers; L.C.M. uses ALL primes with HIGHEST powers",
            "Directed numbers: same signs multiply/divide to give positive; different signs give negative",
            "BODMAS gives the correct order of operations in calculations",
            "To convert a percentage to a decimal, divide by 100; to a fraction, write over 100 and simplify",
            "Always simplify fractions to their lowest terms using the H.C.F."
        ],
        exam_tips: [
            "Show all working for H.C.F. and L.C.M. using prime factorisation — examiners award method marks.",
            "When classifying numbers, remember $\\\\sqrt{4} = 2$ is rational, but $\\\\sqrt{3}$ is irrational.",
            "For directed numbers, write out the sign rules before calculating to avoid errors.",
            "In BODMAS, multiplication and division have equal priority — work left to right.",
            "Always check fraction answers are in their simplest form.",
            "Use the identity H.C.F. × L.C.M. = product of the two numbers to verify your answers."
        ],
        visual_descriptions: [
            "Number line showing integers from -5 to 5 with arrows indicating positive and negative directions",
            "Venn diagram showing the relationship: Natural ⊂ Whole ⊂ Integers ⊂ Rational ⊂ Real numbers",
            "Factor tree diagram breaking 180 into its prime factors"
        ]
    },

    // ============================================
    // TOPIC 2: APPROXIMATION AND ESTIMATION
    // ============================================
    'Approximation and Estimation': {
        topic: 'Approximation and Estimation',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "Approximation and Estimation teaches students to round numbers to a given place value, decimal places, or significant figures, and to use these skills to estimate answers to calculations. These techniques are vital in everyday life and in checking whether calculated answers are reasonable. The ZIMSEC syllabus requires students to be proficient in all rounding methods and to apply estimation to verify results.",
        sections: [
            {
                title: '1. Rounding to Place Value',
                content: "## What is Rounding?\n\nRounding means replacing a number with a simpler number that is close to the original value.\n\n## Rules for Rounding\n\n1. Identify the digit in the required place value\n2. Look at the digit immediately to the **right**\n3. If it is **5 or more**, round **up** (add 1 to the rounding digit)\n4. If it is **less than 5**, round **down** (keep the rounding digit the same)\n5. Replace all digits to the right with zeros (for whole numbers)\n\n## Place Values\n\n| Place | Example: 47,385 |\n|-------|------------------|\n| Ten thousands | 4 |\n| Thousands | 7 |\n| Hundreds | 3 |\n| Tens | 8 |\n| Units | 5 |\n\n## Examples\n\n- $47,385$ rounded to the nearest thousand = $47,000$\n- $47,385$ rounded to the nearest hundred = $47,400$\n- $47,385$ rounded to the nearest ten = $47,390$",
                worked_examples: [
                    {
                        question: "Round 6,749 to the nearest (a) thousand, (b) hundred.",
                        steps: [
                            "(a) Nearest thousand: digit in thousands place is 6",
                            "Next digit is 7 (≥ 5), so round up",
                            "6,749 → 7,000",
                            "(b) Nearest hundred: digit in hundreds place is 7",
                            "Next digit is 4 (< 5), so round down",
                            "6,749 → 6,700"
                        ],
                        final_answer: "(a) 7,000  (b) 6,700"
                    }
                ]
            },
            {
                title: '2. Rounding to Decimal Places',
                content: "## Decimal Places (d.p.)\n\nThe number of decimal places is the number of digits after the decimal point.\n\n## Method\n\n1. Count the required number of digits after the decimal point\n2. Look at the next digit\n3. If it is 5 or more, round up; if less than 5, round down\n4. Drop all remaining digits\n\n## Examples\n\n$3.14159$ to:\n- 1 d.p. = $3.1$ (next digit 4 < 5, round down)\n- 2 d.p. = $3.14$ (next digit 1 < 5, round down)\n- 3 d.p. = $3.142$ (next digit 5 ≥ 5, round up)\n- 4 d.p. = $3.1416$ (next digit 9 ≥ 5, round up)\n\n## Important Note\n\nKeep trailing zeros if they are within the required decimal places:\n$4.703$ to 2 d.p. = $4.70$ (the zero matters — it shows precision to 2 d.p.)",
                worked_examples: [
                    {
                        question: "Round 7.2963 to (a) 1 decimal place (b) 2 decimal places (c) 3 decimal places.",
                        steps: [
                            "(a) 1 d.p.: Look at 7.2|963. Digit after 2 is 9 (≥5), round up → 7.3",
                            "(b) 2 d.p.: Look at 7.29|63. Digit after 9 is 6 (≥5), round up → 7.30",
                            "(c) 3 d.p.: Look at 7.296|3. Digit after 6 is 3 (<5), round down → 7.296"
                        ],
                        final_answer: "(a) 7.3  (b) 7.30  (c) 7.296"
                    }
                ]
            },
            {
                title: '3. Significant Figures',
                content: "## What Are Significant Figures?\n\nSignificant figures (s.f.) are the digits in a number that carry meaning and contribute to its precision.\n\n## Rules for Counting Significant Figures\n\n1. All non-zero digits are significant: $456$ has 3 s.f.\n2. Zeros **between** non-zero digits are significant: $4006$ has 4 s.f.\n3. Leading zeros (before the first non-zero digit) are NOT significant: $0.0045$ has 2 s.f.\n4. Trailing zeros after a decimal point ARE significant: $3.40$ has 3 s.f.\n5. Trailing zeros in a whole number may or may not be significant (ambiguous without context): $4500$ could be 2, 3, or 4 s.f.\n\n## Rounding to Significant Figures\n\nSame process as rounding to decimal places, but count from the first non-zero digit.\n\n## Examples\n\n- $0.004572$ to 2 s.f. = $0.0046$\n- $34,567$ to 3 s.f. = $34,600$\n- $0.05081$ to 2 s.f. = $0.051$",
                worked_examples: [
                    {
                        question: "Round the following to 3 significant figures: (a) 45,678  (b) 0.0034567  (c) 100.49",
                        steps: [
                            "(a) 45,678: First 3 s.f. are 4, 5, 6. Next digit is 7 (≥5) → 45,700",
                            "(b) 0.0034567: Leading zeros don't count. First 3 s.f. are 3, 4, 5. Next digit is 6 (≥5) → 0.00346",
                            "(c) 100.49: First 3 s.f. are 1, 0, 0. Next digit is 4 (<5) → 100"
                        ],
                        final_answer: "(a) 45,700  (b) 0.00346  (c) 100"
                    }
                ]
            },
            {
                title: '4. Estimation in Calculations',
                content: "## Why Estimate?\n\nEstimation helps you:\n- Check if your calculated answer is reasonable\n- Make quick mental calculations\n- Spot errors in calculations\n\n## Method\n\n1. Round each number to 1 significant figure (or a convenient value)\n2. Perform the calculation with the rounded numbers\n3. The result is an approximate answer\n\n## Estimation with the Four Operations\n\n$$\\\\frac{48.7 \\\\times 11.2}{0.493} \\\\approx \\\\frac{50 \\\\times 10}{0.5} = \\\\frac{500}{0.5} = 1000$$\n\n## Accuracy of Estimation\n\nThe more significant figures you round to, the more accurate your estimate. For ZIMSEC, rounding to 1 s.f. is usually sufficient for estimation questions.\n\n## When to Use Estimation\n\n- Checking calculator answers\n- Problems that say 'estimate' or 'approximate'\n- Real-life situations where exact answers are not needed (e.g., budgeting, measuring)",
                worked_examples: [
                    {
                        question: "Estimate the value of $\\\\frac{197 \\\\times 0.48}{9.7}$.",
                        steps: [
                            "Round to 1 s.f.: $197 \\\\approx 200$, $0.48 \\\\approx 0.5$, $9.7 \\\\approx 10$",
                            "Estimate = $\\\\frac{200 \\\\times 0.5}{10}$",
                            "$= \\\\frac{100}{10} = 10$"
                        ],
                        final_answer: "Estimated value ≈ 10 (actual value ≈ 9.754)"
                    },
                    {
                        question: "A farmer harvested 4,872 kg of maize. He stores it in bags holding approximately 49 kg each. Estimate the number of bags needed.",
                        steps: [
                            "Round: $4872 \\\\approx 5000$, $49 \\\\approx 50$",
                            "Number of bags $\\\\approx 5000 \\\\div 50 = 100$"
                        ],
                        final_answer: "Approximately 100 bags are needed"
                    }
                ]
            }
        ],
        key_points: [
            "When rounding, if the deciding digit is 5 or more, round up; if less than 5, round down",
            "Decimal places count digits AFTER the decimal point",
            "Significant figures count from the FIRST non-zero digit",
            "Leading zeros are never significant; trapped zeros always are",
            "Estimation involves rounding to 1 significant figure then calculating",
            "Trailing zeros after a decimal point ARE significant (e.g., 3.40 has 3 s.f.)"
        ],
        exam_tips: [
            "Always state what you rounded to — e.g., 'correct to 2 d.p.' or 'correct to 3 s.f.'",
            "For estimation questions, show what you rounded each number to before calculating.",
            "Keep trailing zeros: $4.50$ to 2 d.p. is NOT the same as writing $4.5$ (which is 1 d.p.).",
            "Common mistake: students forget that 0.0045 has only 2 significant figures, not 4.",
            "Use estimation to check your final answers in Paper 1 and Paper 2."
        ],
        visual_descriptions: [
            "Number line showing 4.35 being rounded to 4.4 (1 d.p.) with arrow pointing to nearest tenth",
            "Table showing a number with each digit labelled by its place value from thousands to thousandths",
            "Flowchart: Is the next digit ≥ 5? → Yes: Round up / No: Round down"
        ]
    },

    // ============================================
    // TOPIC 3: RATIOS
    // ============================================
    'Ratios': {
        topic: 'Ratios',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "Ratios compare two or more quantities of the same kind. The ZIMSEC Form 1 syllabus covers simplifying ratios, dividing quantities in a given ratio, and applying ratios to practical problems including map scales. Understanding ratios is fundamental to proportional reasoning, which appears in many other topics including scale drawings, similar figures, and trigonometry.",
        sections: [
            {
                title: '1. Understanding Ratios',
                content: "## What Is a Ratio?\n\nA **ratio** compares two or more quantities of the same kind. It shows how much of one thing there is compared to another.\n\nThe ratio of $a$ to $b$ is written as $a : b$ and is read as \"$a$ to $b$\".\n\n## Key Properties\n\n- Ratios have **no units** (the quantities must be in the same units before forming the ratio)\n- The **order matters**: $3 : 5$ is not the same as $5 : 3$\n- Ratios can be scaled: $2 : 3 = 4 : 6 = 6 : 9$\n\n## Expressing Ratios\n\nBefore writing a ratio, ensure both quantities are in the **same unit**.\n\nExample: Ratio of 2 m to 50 cm\n$$2 \\\\text{ m} = 200 \\\\text{ cm}$$\n$$\\\\text{Ratio} = 200 : 50 = 4 : 1$$",
                worked_examples: [
                    {
                        question: "Express 45 minutes to 2 hours as a ratio in its simplest form.",
                        steps: [
                            "Convert to the same unit: 2 hours = 120 minutes",
                            "Ratio = 45 : 120",
                            "Divide both by HCF (15): $45 \\\\div 15 : 120 \\\\div 15$",
                            "= 3 : 8"
                        ],
                        final_answer: "$3 : 8$"
                    }
                ]
            },
            {
                title: '2. Simplifying Ratios',
                content: "## Method\n\nTo simplify a ratio, divide all parts by their **H.C.F.**\n\n$$24 : 36 = \\\\frac{24}{12} : \\\\frac{36}{12} = 2 : 3$$\n\n## Ratios with Fractions\n\nMultiply all parts by the L.C.M. of the denominators to eliminate fractions.\n\n$$\\\\frac{1}{3} : \\\\frac{1}{4} = \\\\frac{1}{3} \\\\times 12 : \\\\frac{1}{4} \\\\times 12 = 4 : 3$$\n\n## Ratios with Decimals\n\nMultiply all parts by a power of 10 to remove decimals, then simplify.\n\n$$0.6 : 1.5 = 6 : 15 = 2 : 5$$\n\n## Three-Part Ratios\n\nSimplify in the same way:\n$$12 : 18 : 30 = 2 : 3 : 5$$ (dividing by H.C.F. = 6)",
                worked_examples: [
                    {
                        question: "Simplify the ratio $\\\\frac{2}{5} : \\\\frac{3}{4}$.",
                        steps: [
                            "L.C.M. of denominators 5 and 4 is 20",
                            "Multiply both parts by 20:",
                            "$\\\\frac{2}{5} \\\\times 20 : \\\\frac{3}{4} \\\\times 20$",
                            "$= 8 : 15$"
                        ],
                        final_answer: "$8 : 15$"
                    }
                ]
            },
            {
                title: '3. Dividing Quantities in a Given Ratio',
                content: "## Method\n\nTo divide a quantity in the ratio $a : b$:\n\n1. Find the **total number of parts**: $a + b$\n2. Find the **value of one part**: $\\\\frac{\\\\text{total quantity}}{a + b}$\n3. Multiply by each ratio part\n\n## Formula\n\nIf a total $T$ is divided in the ratio $a : b$:\n- First share = $\\\\frac{a}{a + b} \\\\times T$\n- Second share = $\\\\frac{b}{a + b} \\\\times T$\n\n## Three-Way Sharing\n\nThe same method extends to three or more parts:\nRatio $a : b : c$ with total $T$:\n- First share = $\\\\frac{a}{a+b+c} \\\\times T$",
                worked_examples: [
                    {
                        question: "Divide $\\$4500$ between Tendai and Rumbi in the ratio $2 : 3$.",
                        steps: [
                            "Total parts = $2 + 3 = 5$",
                            "Value of 1 part = $\\\\frac{4500}{5} = 900$",
                            "Tendai's share = $2 \\\\times 900 = \\$1800$",
                            "Rumbi's share = $3 \\\\times 900 = \\$2700$",
                            "Check: $1800 + 2700 = 4500$ ✓"
                        ],
                        final_answer: "Tendai gets \\$1,800 and Rumbi gets \\$2,700"
                    },
                    {
                        question: "Three siblings share an inheritance of \\$36,000 in the ratio $2 : 3 : 4$. How much does each receive?",
                        steps: [
                            "Total parts = $2 + 3 + 4 = 9$",
                            "Value of 1 part = $\\\\frac{36000}{9} = 4000$",
                            "First sibling: $2 \\\\times 4000 = \\$8000$",
                            "Second sibling: $3 \\\\times 4000 = \\$12000$",
                            "Third sibling: $4 \\\\times 4000 = \\$16000$",
                            "Check: $8000 + 12000 + 16000 = 36000$ ✓"
                        ],
                        final_answer: "They receive \\$8,000, \\$12,000, and \\$16,000 respectively"
                    }
                ]
            },
            {
                title: '4. Ratio Problems in Context',
                content: "## Practical Applications\n\nRatios appear in many real-life contexts:\n- **Recipes**: Mixing ingredients in the correct proportions\n- **Maps**: Scale ratios (covered in detail in the Scales topic)\n- **Mixing**: Paint colours, cement mixtures, fertiliser solutions\n\n## Increasing/Decreasing in a Ratio\n\nTo increase a quantity in the ratio $m : n$ (where $m > n$):\n$$\\\\text{New value} = \\\\frac{m}{n} \\\\times \\\\text{original value}$$\n\nTo decrease in the ratio $m : n$ (where $m < n$):\n$$\\\\text{New value} = \\\\frac{m}{n} \\\\times \\\\text{original value}$$\n\n## Finding the Original Quantity\n\nIf you know the difference and the ratio, work backwards:\n- If $a : b$ and the difference = $d$, then total = $\\\\frac{d \\\\times (a + b)}{|a - b|}$",
                worked_examples: [
                    {
                        question: "A concrete mixture uses cement, sand, and gravel in the ratio $1 : 2 : 4$. If 35 kg of sand is used, how much of each other ingredient is needed?",
                        steps: [
                            "Sand corresponds to 2 parts = 35 kg",
                            "1 part = $\\\\frac{35}{2} = 17.5$ kg",
                            "Cement (1 part) = 17.5 kg",
                            "Gravel (4 parts) = $4 \\\\times 17.5 = 70$ kg"
                        ],
                        final_answer: "Cement: 17.5 kg, Sand: 35 kg, Gravel: 70 kg"
                    }
                ]
            }
        ],
        key_points: [
            "Ratios compare quantities of the same kind — always convert to the same units first",
            "Simplify ratios by dividing all parts by their H.C.F.",
            "To eliminate fractions in a ratio, multiply all parts by the L.C.M. of the denominators",
            "When sharing in a ratio, find total parts first, then the value of one part",
            "The order of a ratio matters: $3:5$ is different from $5:3$",
            "Always check your answer by adding shares back to verify the total"
        ],
        exam_tips: [
            "Convert all quantities to the same unit before forming a ratio.",
            "Show your division by H.C.F. clearly when simplifying.",
            "In sharing problems, always verify that the shares add up to the total.",
            "For three-part ratios, the method is the same — just find total parts = sum of all ratio parts.",
            "If given one share and asked for others, find the value of one part first."
        ],
        visual_descriptions: [
            "Bar model diagram showing a quantity divided into ratio parts with different colours",
            "Pie chart divided in the ratio 2:3:5 with each sector labelled",
            "Number line showing proportional relationship between ratio quantities"
        ]
    },

    // ============================================
    // TOPIC 4: LARGE AND SMALL NUMBERS
    // ============================================
    'Large and Small Numbers': {
        topic: 'Large and Small Numbers',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "This topic covers how to read, write, and understand very large and very small numbers. Students learn to express numbers in words and digits, understand place value up to billions and down to millionths, and begin to appreciate the usefulness of standard form (scientific notation) for handling extremely large or small quantities. This is a key ZIMSEC Form 1 competency that prepares students for later work with standard form and indices.",
        sections: [
            {
                title: '1. Place Value System',
                content: "## Understanding Place Value\n\nOur number system is a **base-10 (decimal) system** where each digit's value depends on its position.\n\n## Place Value Table\n\n| Billions | Hundred Millions | Ten Millions | Millions | Hundred Thousands | Ten Thousands | Thousands | Hundreds | Tens | Units |\n|----------|-----------------|-------------|----------|------------------|--------------|-----------|----------|------|-------|\n| $10^9$ | $10^8$ | $10^7$ | $10^6$ | $10^5$ | $10^4$ | $10^3$ | $10^2$ | $10^1$ | $10^0$ |\n\nEach place is **10 times** the value of the place to its right.\n\n## Reading Large Numbers\n\nGroup digits in threes from the right, separated by spaces or commas:\n- $45\\,300\\,000$ is read as \"forty-five million, three hundred thousand\"\n- $7\\,000\\,000\\,000$ is read as \"seven billion\"\n\n## Decimal Place Values\n\n| Tenths | Hundredths | Thousandths | Ten-thousandths |\n|--------|-----------|------------|----------------|\n| $10^{-1}$ | $10^{-2}$ | $10^{-3}$ | $10^{-4}$ |",
                worked_examples: [
                    {
                        question: "Write 3,045,700 in words.",
                        steps: [
                            "Group: 3 | 045 | 700",
                            "3 million, forty-five thousand, seven hundred"
                        ],
                        final_answer: "Three million, forty-five thousand, seven hundred"
                    },
                    {
                        question: "Write 'six billion, two hundred and four million, fifty thousand' in digits.",
                        steps: [
                            "Six billion = 6,000,000,000",
                            "Two hundred and four million = 204,000,000",
                            "Fifty thousand = 50,000",
                            "Add: 6,000,000,000 + 204,000,000 + 50,000"
                        ],
                        final_answer: "6,204,050,000"
                    }
                ]
            },
            {
                title: '2. Expressing Large Numbers',
                content: "## Powers of 10\n\nLarge numbers can be expressed using powers of 10:\n\n| Number | In words | Power of 10 |\n|--------|----------|-------------|\n| 10 | Ten | $10^1$ |\n| 100 | Hundred | $10^2$ |\n| 1,000 | Thousand | $10^3$ |\n| 1,000,000 | Million | $10^6$ |\n| 1,000,000,000 | Billion | $10^9$ |\n| 1,000,000,000,000 | Trillion | $10^{12}$ |\n\n## Standard Form (Introduction)\n\nVery large numbers are written as $a \\\\times 10^n$ where $1 \\\\leq a < 10$ and $n$ is a positive integer.\n\n$$47\\,000\\,000 = 4.7 \\\\times 10^7$$\n\nCount how many places you move the decimal point to the left — that gives the power.\n\n## Real-World Large Numbers\n\n- Population of Zimbabwe (approx.): 16,000,000\n- Distance from Earth to Sun: 150,000,000 km\n- National budget figures in ZWL: trillions",
                worked_examples: [
                    {
                        question: "Express 93,000,000 km (distance from Earth to Sun) in standard form.",
                        steps: [
                            "Place decimal after the first non-zero digit: 9.3",
                            "Count places moved: 93,000,000 → 9.3 (7 places to the left)",
                            "Standard form: $9.3 \\\\times 10^7$"
                        ],
                        final_answer: "$9.3 \\\\times 10^7$ km"
                    }
                ]
            },
            {
                title: '3. Expressing Small Numbers',
                content: "## Small Numbers and Decimals\n\nVery small numbers have many zeros after the decimal point:\n- $0.001$ = one thousandth = $\\\\frac{1}{1000} = 10^{-3}$\n- $0.000\\,045$ = forty-five millionths\n\n## Standard Form for Small Numbers\n\nSmall numbers are written as $a \\\\times 10^{-n}$ where $1 \\\\leq a < 10$ and $n$ is a positive integer.\n\n$$0.000\\,034 = 3.4 \\\\times 10^{-5}$$\n\nCount how many places you move the decimal point to the **right** — that gives the negative power.\n\n## Real-World Small Numbers\n\n- Diameter of a human hair: $0.000\\,08$ m ($8 \\\\times 10^{-5}$ m)\n- Mass of a dust particle: $0.000\\,000\\,001$ kg\n- Thickness of paper: approximately $0.000\\,1$ m\n\n## Comparing Large and Small Numbers\n\nStandard form makes comparison easy:\n- $3.2 \\\\times 10^8$ is larger than $9.1 \\\\times 10^5$ (compare powers first)\n- $4.5 \\\\times 10^{-3}$ is larger than $2.1 \\\\times 10^{-6}$",
                worked_examples: [
                    {
                        question: "Write $0.000\\,072$ in standard form.",
                        steps: [
                            "Move decimal right until you get a number between 1 and 10: 7.2",
                            "Count places moved right: 5 places",
                            "Use negative power: $7.2 \\\\times 10^{-5}$"
                        ],
                        final_answer: "$7.2 \\\\times 10^{-5}$"
                    }
                ]
            }
        ],
        key_points: [
            "Our number system is base-10: each place is worth 10 times the one to its right",
            "Group digits in threes from the right to read large numbers easily",
            "Standard form: $a \\\\times 10^n$ where $1 \\\\leq a < 10$",
            "Large numbers have positive powers of 10; small numbers have negative powers",
            "Place value extends to billions (and beyond) and to millionths (and beyond)",
            "Standard form makes it easier to compare very large or very small numbers"
        ],
        exam_tips: [
            "When writing numbers in words, use commas to separate groups of three digits.",
            "For standard form, always check that $a$ is between 1 and 10 (not 10 itself).",
            "Count decimal shifts carefully — one off and the answer is wrong by a factor of 10.",
            "In comparison questions, compare the powers of 10 first, then the values of $a$."
        ],
        visual_descriptions: [
            "Place value chart showing a large number with each digit in its correct column",
            "Number line showing powers of 10 from $10^{-3}$ to $10^{9}$",
            "Arrow diagram showing decimal point movement when converting to standard form"
        ]
    },

    // ============================================
    // TOPIC 5: NUMBER BASES
    // ============================================
    'Number Bases': {
        topic: 'Number Bases',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "Number bases (or numeration systems) are ways of representing numbers using different base values. While we normally use base 10 (denary/decimal), computers use base 2 (binary) and base 8 (octal). The ZIMSEC syllabus requires students to understand place values in different bases, convert between bases, and recognise everyday applications of different number bases.",
        sections: [
            {
                title: '1. Understanding Number Bases',
                content: "## What Is a Number Base?\n\nA number base (or radix) tells us how many different digits are used and the place values of positions.\n\n**Base 10 (Denary/Decimal)**: Uses digits 0–9. This is our everyday system.\n\n**Base 2 (Binary)**: Uses digits 0 and 1 only. Used by computers.\n\n**Base 5 (Quinary)**: Uses digits 0–4.\n\n**Base 8 (Octal)**: Uses digits 0–7. Used in computing.\n\n## Notation\n\nWe write the base as a subscript: $1011_2$ means 1011 in base 2.\n\n## Everyday Examples of Number Bases\n\n- **Binary (base 2)**: Computers, digital electronics (ON/OFF switches)\n- **Base 12 (duodecimal)**: 12 months in a year, 12 hours on a clock\n- **Base 60 (sexagesimal)**: 60 seconds in a minute, 60 minutes in an hour\n- **Base 7**: Days of the week",
                worked_examples: [
                    {
                        question: "What digits are available in base 8?",
                        steps: [
                            "In any base $b$, the available digits are $0, 1, 2, ..., (b-1)$",
                            "For base 8: digits are $0, 1, 2, 3, 4, 5, 6, 7$",
                            "The digit 8 does NOT exist in base 8"
                        ],
                        final_answer: "The digits available in base 8 are: 0, 1, 2, 3, 4, 5, 6, 7"
                    }
                ]
            },
            {
                title: '2. Place Value in Different Bases',
                content: "## Place Value Pattern\n\nIn base $b$, the place values from right to left are:\n$$b^0, b^1, b^2, b^3, ...$$\n\nThis equals $1, b, b^2, b^3, ...$\n\n## Base 10 Place Values\n$$... \\\\quad 10^3 \\\\quad 10^2 \\\\quad 10^1 \\\\quad 10^0$$\n$$... \\\\quad 1000 \\\\quad 100 \\\\quad 10 \\\\quad 1$$\n\n## Base 2 (Binary) Place Values\n$$... \\\\quad 2^3 \\\\quad 2^2 \\\\quad 2^1 \\\\quad 2^0$$\n$$... \\\\quad 8 \\\\quad 4 \\\\quad 2 \\\\quad 1$$\n\n## Base 5 Place Values\n$$... \\\\quad 5^3 \\\\quad 5^2 \\\\quad 5^1 \\\\quad 5^0$$\n$$... \\\\quad 125 \\\\quad 25 \\\\quad 5 \\\\quad 1$$\n\n## Base 8 (Octal) Place Values\n$$... \\\\quad 8^3 \\\\quad 8^2 \\\\quad 8^1 \\\\quad 8^0$$\n$$... \\\\quad 512 \\\\quad 64 \\\\quad 8 \\\\quad 1$$",
                worked_examples: [
                    {
                        question: "What is the place value of each digit in $3214_5$?",
                        steps: [
                            "From right to left, place values in base 5: $5^0 = 1$, $5^1 = 5$, $5^2 = 25$, $5^3 = 125$",
                            "Digit 4 is in the $5^0$ (units) place: $4 \\\\times 1 = 4$",
                            "Digit 1 is in the $5^1$ (fives) place: $1 \\\\times 5 = 5$",
                            "Digit 2 is in the $5^2$ (twenty-fives) place: $2 \\\\times 25 = 50$",
                            "Digit 3 is in the $5^3$ (one hundred and twenty-fives) place: $3 \\\\times 125 = 375$"
                        ],
                        final_answer: "3 is worth 375, 2 is worth 50, 1 is worth 5, and 4 is worth 4"
                    }
                ]
            },
            {
                title: '3. Converting from Other Bases to Base 10',
                content: "## Method\n\nTo convert a number from base $b$ to base 10:\n1. Write out the place values (powers of $b$)\n2. Multiply each digit by its place value\n3. Add all the results\n\n## Formula\n\nFor a number $d_n d_{n-1} ... d_1 d_0$ in base $b$:\n$$\\\\text{Value in base 10} = d_n \\\\times b^n + d_{n-1} \\\\times b^{n-1} + ... + d_1 \\\\times b^1 + d_0 \\\\times b^0$$",
                worked_examples: [
                    {
                        question: "Convert $11011_2$ to base 10.",
                        steps: [
                            "Place values: $2^4, 2^3, 2^2, 2^1, 2^0 = 16, 8, 4, 2, 1$",
                            "Multiply: $1 \\\\times 16 + 1 \\\\times 8 + 0 \\\\times 4 + 1 \\\\times 2 + 1 \\\\times 1$",
                            "$= 16 + 8 + 0 + 2 + 1$",
                            "$= 27$"
                        ],
                        final_answer: "$11011_2 = 27_{10}$"
                    },
                    {
                        question: "Convert $352_8$ to base 10.",
                        steps: [
                            "Place values: $8^2, 8^1, 8^0 = 64, 8, 1$",
                            "Multiply: $3 \\\\times 64 + 5 \\\\times 8 + 2 \\\\times 1$",
                            "$= 192 + 40 + 2$",
                            "$= 234$"
                        ],
                        final_answer: "$352_8 = 234_{10}$"
                    }
                ]
            },
            {
                title: '4. Converting from Base 10 to Other Bases',
                content: "## Method: Repeated Division\n\nTo convert a base 10 number to base $b$:\n1. Divide the number by $b$\n2. Record the **remainder**\n3. Divide the quotient by $b$ again\n4. Repeat until the quotient is 0\n5. Read the remainders from **bottom to top**\n\n## Why This Works\n\nEach division determines how many of each place value fit into the number, with the remainder being the digit for that position.",
                worked_examples: [
                    {
                        question: "Convert $45_{10}$ to binary (base 2).",
                        steps: [
                            "$45 \\\\div 2 = 22$ remainder $1$",
                            "$22 \\\\div 2 = 11$ remainder $0$",
                            "$11 \\\\div 2 = 5$ remainder $1$",
                            "$5 \\\\div 2 = 2$ remainder $1$",
                            "$2 \\\\div 2 = 1$ remainder $0$",
                            "$1 \\\\div 2 = 0$ remainder $1$",
                            "Read remainders bottom to top: $101101$"
                        ],
                        final_answer: "$45_{10} = 101101_2$"
                    }
                ]
            }
        ],
        key_points: [
            "A number base tells us how many distinct digits are used (base $b$ uses digits 0 to $b-1$)",
            "Place values in base $b$ are $b^0, b^1, b^2, b^3, ...$ from right to left",
            "To convert to base 10: multiply each digit by its place value and add",
            "To convert from base 10: repeatedly divide by the base and read remainders upward",
            "Binary (base 2) uses only 0 and 1; octal (base 8) uses 0 to 7",
            "The digit equal to or greater than the base never appears in that base system"
        ],
        exam_tips: [
            "Always write the base as a subscript to avoid confusion: $101_2$ not just $101$.",
            "When converting to base 10, set up a clear table of place values.",
            "For repeated division, be careful to read remainders from BOTTOM to TOP.",
            "Double-check by converting your answer back to base 10.",
            "Binary is the most commonly examined base — practise it thoroughly."
        ],
        visual_descriptions: [
            "Table showing place values for bases 2, 5, 8, and 10 side by side",
            "Step-by-step repeated division layout converting 45 to binary with arrows showing remainder reading direction",
            "Diagram showing how a binary number like 1011 maps to ON/OFF switches"
        ]
    },

    // ============================================
    // TOPIC 6: SCALES
    // ============================================
    'Scales': {
        topic: 'Scales',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "Scales are used to represent real-life objects and distances on maps, plans, and drawings. The ZIMSEC syllabus requires students to understand representative fractions (R.F.) and ratio scales, use scales to calculate actual distances from maps, and create scale drawings. This topic is closely linked to ratios and is essential for geography, technical drawing, and practical problem-solving.",
        sections: [
            {
                title: '1. Understanding Scales',
                content: "## What Is a Scale?\n\nA **scale** is a ratio that compares a length on a drawing or map to the actual length in real life.\n\n## Types of Scales\n\n### Ratio Scale (Statement Scale)\nWritten as a ratio: $1 : n$ or as a statement.\n- $1 : 50\\,000$ means 1 cm on the map represents 50,000 cm (or 500 m) in real life\n- \"1 cm represents 5 km\"\n\n### Representative Fraction (R.F.)\nA fraction with no units: $\\\\frac{1}{50000}$\n\nThis means every unit on the map equals 50,000 of the same units in real life.\n\n### Linear (Bar) Scale\nA line drawn on the map marked with actual distances. Useful because it stays correct even if the map is enlarged or reduced.\n\n## Converting Between Scale Types\n\nStatement → Ratio: \"1 cm represents 2 km\" → $1 : 200\\,000$ (since 2 km = 200,000 cm)\n\nR.F. → Statement: $\\\\frac{1}{25000}$ means 1 cm = 25,000 cm = 250 m",
                worked_examples: [
                    {
                        question: "A map has a scale of 1 : 50,000. Express this as a statement in the form '1 cm represents ___ km'.",
                        steps: [
                            "1 cm on map = 50,000 cm in real life",
                            "Convert cm to km: $50,000 \\\\div 100 = 500$ m",
                            "$500 \\\\div 1000 = 0.5$ km"
                        ],
                        final_answer: "1 cm represents 0.5 km (or 500 m)"
                    }
                ]
            },
            {
                title: '2. Calculating Distances Using Scales',
                content: "## From Map to Actual\n\n$$\\\\text{Actual distance} = \\\\text{Map distance} \\\\times \\\\text{Scale factor}$$\n\n## From Actual to Map\n\n$$\\\\text{Map distance} = \\\\frac{\\\\text{Actual distance}}{\\\\text{Scale factor}}$$\n\n## Steps\n1. Write down the scale\n2. Measure the map distance (or use the given value)\n3. Multiply by the scale factor for actual distance\n4. Convert units as needed (cm → m → km)\n\n## Unit Conversions for Scale Problems\n\n- 1 km = 1,000 m = 100,000 cm\n- 1 m = 100 cm",
                worked_examples: [
                    {
                        question: "On a map with scale 1 : 25,000, two towns are 8 cm apart. Find the actual distance in km.",
                        steps: [
                            "Map distance = 8 cm",
                            "Scale: 1 : 25,000 so actual = $8 \\\\times 25,000 = 200,000$ cm",
                            "Convert to metres: $200,000 \\\\div 100 = 2,000$ m",
                            "Convert to km: $2,000 \\\\div 1,000 = 2$ km"
                        ],
                        final_answer: "The actual distance is 2 km"
                    },
                    {
                        question: "The actual distance between Harare and Masvingo is approximately 290 km. If a map has a scale of 1 : 5,000,000, what is the distance on the map?",
                        steps: [
                            "Convert 290 km to cm: $290 \\\\times 100,000 = 29,000,000$ cm",
                            "Map distance = $\\\\frac{29,000,000}{5,000,000} = 5.8$ cm"
                        ],
                        final_answer: "The map distance is 5.8 cm"
                    }
                ]
            },
            {
                title: '3. Scale Drawings',
                content: "## Making Scale Drawings\n\nA scale drawing is a diagram that accurately represents an object using a fixed scale.\n\n## Steps to Make a Scale Drawing\n\n1. **Choose an appropriate scale** that fits the paper\n2. **Convert** all actual measurements using the scale\n3. **Draw** using a ruler, protractor, and set square\n4. **Label** the drawing with the scale used\n\n## Choosing a Scale\n\n- The drawing must fit on the paper\n- Measurements should be easy to work with\n- Common scales: $1 : 100$, $1 : 50$, $1 : 200$, $1 : 500$\n\n## Reading Scale Drawings\n\n- Measure lengths on the drawing carefully\n- Multiply by the scale factor to get actual dimensions\n- Include units in your answer",
                worked_examples: [
                    {
                        question: "A rectangular classroom is 12 m by 8 m. Draw it using a scale of 1 : 200. What are the drawing dimensions?",
                        steps: [
                            "Convert 12 m to cm: $12 \\\\times 100 = 1200$ cm",
                            "Drawing length = $\\\\frac{1200}{200} = 6$ cm",
                            "Convert 8 m to cm: $8 \\\\times 100 = 800$ cm",
                            "Drawing width = $\\\\frac{800}{200} = 4$ cm"
                        ],
                        final_answer: "Draw a rectangle 6 cm × 4 cm and label the scale as 1 : 200"
                    }
                ]
            },
            {
                title: '4. Scale Problems in Context',
                content: "## Area and Scale\n\nIf the linear scale is $1 : n$, then:\n$$\\\\text{Area scale} = 1 : n^2$$\n\nFor example, scale $1 : 50,000$:\n- Length scale: $1 : 50,000$\n- Area scale: $1 : 2,500,000,000$ (i.e., $1 : 50,000^2$)\n\n## Practical Applications in Zimbabwe\n\n- **Topographic maps** of Zimbabwe typically use scales $1 : 50,000$ or $1 : 250,000$\n- **House plans** typically use $1 : 50$ or $1 : 100$\n- **Site plans** use $1 : 200$ or $1 : 500$\n\n## Common ZIMSEC Questions\n\n- Converting between scale types\n- Calculating actual distances from map measurements\n- Drawing plans of rooms, buildings, or plots",
                worked_examples: [
                    {
                        question: "A farm on a 1 : 50,000 map measures 4 cm × 3 cm. Find the actual area of the farm in km².",
                        steps: [
                            "Actual length = $4 \\\\times 50,000 = 200,000$ cm = 2 km",
                            "Actual width = $3 \\\\times 50,000 = 150,000$ cm = 1.5 km",
                            "Actual area = $2 \\\\times 1.5 = 3$ km²"
                        ],
                        final_answer: "The farm has an area of 3 km²"
                    }
                ]
            }
        ],
        key_points: [
            "A scale compares map/drawing distance to actual distance",
            "Representative Fraction (R.F.) is a scale written as a fraction with no units",
            "To find actual distance: multiply map distance by scale factor",
            "To find map distance: divide actual distance by scale factor",
            "Always ensure both measurements are in the same units before applying the scale",
            "Area scale is the square of the linear scale: if linear is $1:n$, area is $1:n^2$"
        ],
        exam_tips: [
            "Always show unit conversions clearly: cm → m → km.",
            "When converting a statement scale to a ratio, make sure both sides are in the same unit (usually cm).",
            "Remember: 1 km = 100,000 cm — this is the key conversion for scale problems.",
            "For area problems, square the linear scale factor.",
            "Label all scale drawings with the scale used."
        ],
        visual_descriptions: [
            "Map of a region with a bar scale and ratio scale labelled",
            "Scale drawing of a rectangular plot with dimensions shown on both the drawing and in real life",
            "Comparison diagram showing how the same distance looks on maps of different scales"
        ]
    },

    // ============================================
    // TOPIC 7: SETS AND SET NOTATION
    // ============================================
    'Sets and Set Notation': {
        topic: 'Sets and Set Notation',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "A set is a well-defined collection of distinct objects called elements or members. Sets are foundational in mathematics and are used extensively in the ZIMSEC syllabus for solving problems involving grouping, classification, and logical reasoning. This topic introduces set notation, methods of describing sets, and counting elements — preparing students for Venn diagrams and set operations in later topics.",
        sections: [
            {
                title: '1. What Is a Set?',
                content: "## Definition\n\nA **set** is a well-defined collection of distinct objects. \"Well-defined\" means there is a clear rule for deciding whether an object belongs to the set or not.\n\n## Examples of Sets\n\n- The set of vowels in the English alphabet: $\\\\{a, e, i, o, u\\\\}$\n- The set of even numbers between 1 and 10: $\\\\{2, 4, 6, 8, 10\\\\}$\n- The set of provinces in Zimbabwe\n\n## NOT a Set\n\n- \"The set of beautiful flowers\" — not well-defined (beauty is subjective)\n- \"The set of tall students\" — not well-defined (what height is 'tall'?)\n\n## Naming Sets\n\nSets are usually named with **capital letters**: $A$, $B$, $C$, $P$, $Q$, etc.\n\n$$A = \\\\{2, 4, 6, 8, 10\\\\}$$",
                worked_examples: [
                    {
                        question: "Which of the following are well-defined sets? (a) The set of planets in the solar system (b) The set of interesting books (c) The set of prime numbers less than 20",
                        steps: [
                            "(a) Planets in the solar system: well-defined ✓ (we can list them definitively)",
                            "(b) Interesting books: NOT well-defined ✗ ('interesting' is subjective)",
                            "(c) Prime numbers less than 20: well-defined ✓ (we can test each number)"
                        ],
                        final_answer: "(a) and (c) are well-defined sets; (b) is not"
                    }
                ]
            },
            {
                title: '2. Describing Sets',
                content: "## Method 1: Listing (Roster/Tabular Form)\n\nList all the elements inside curly braces, separated by commas:\n$$B = \\\\{1, 3, 5, 7, 9\\\\}$$\n\nFor large or infinite sets, use dots (ellipsis) to show the pattern:\n$$C = \\\\{2, 4, 6, 8, ...\\\\}$$\n\n## Method 2: Set-Builder Notation (Description)\n\nDescribe the property that all elements share:\n$$B = \\\\{x : x \\\\text{ is an odd number and } 1 \\\\leq x \\\\leq 9\\\\}$$\n\nRead as: \"B is the set of all $x$ such that $x$ is an odd number and $x$ is between 1 and 9 inclusive.\"\n\nThe colon \":\" (or vertical bar \"|\") means \"such that\".\n\n## Method 3: Verbal Description\n\nDescribe the set in words:\n\"$B$ is the set of odd numbers from 1 to 9\"",
                worked_examples: [
                    {
                        question: "Write the set $P = \\\\{x : x \\\\text{ is a factor of 12}\\\\}$ by listing its elements.",
                        steps: [
                            "Find all factors of 12:",
                            "$1 \\\\times 12 = 12$, $2 \\\\times 6 = 12$, $3 \\\\times 4 = 12$",
                            "List all factors in ascending order"
                        ],
                        final_answer: "$P = \\\\{1, 2, 3, 4, 6, 12\\\\}$"
                    }
                ]
            },
            {
                title: '3. Elements and Set Notation',
                content: "## Elements (Members)\n\nThe objects in a set are called **elements** or **members**.\n\n## Key Symbols\n\n| Symbol | Meaning | Example |\n|--------|---------|----------|\n| $\\\\in$ | \"is an element of\" / \"belongs to\" | $3 \\\\in \\\\{1, 2, 3, 4\\\\}$ |\n| $\\\\notin$ | \"is not an element of\" | $5 \\\\notin \\\\{1, 2, 3, 4\\\\}$ |\n| $\\\\subset$ | \"is a proper subset of\" | $\\\\{1, 2\\\\} \\\\subset \\\\{1, 2, 3\\\\}$ |\n| $\\\\subseteq$ | \"is a subset of\" (may be equal) | $\\\\{1, 2\\\\} \\\\subseteq \\\\{1, 2\\\\}$ |\n| $\\\\not\\\\subset$ | \"is not a subset of\" | $\\\\{1, 5\\\\} \\\\not\\\\subset \\\\{1, 2, 3\\\\}$ |\n| $=$ | \"is equal to\" (same elements) | $\\\\{1, 2, 3\\\\} = \\\\{3, 1, 2\\\\}$ |\n\n## Important Notes\n\n- The **order** of elements does not matter: $\\\\{a, b, c\\\\} = \\\\{c, a, b\\\\}$\n- **Repeated elements** are listed only once: $\\\\{1, 2, 2, 3\\\\} = \\\\{1, 2, 3\\\\}$\n- Sets are enclosed in **curly braces** $\\\\{\\\\}$",
                worked_examples: [
                    {
                        question: "If $A = \\\\{2, 5, 7, 9, 11\\\\}$, state whether the following are true or false: (a) $5 \\\\in A$ (b) $6 \\\\in A$ (c) $\\\\{2, 7\\\\} \\\\subset A$",
                        steps: [
                            "(a) $5 \\\\in A$: 5 is in the set → TRUE",
                            "(b) $6 \\\\in A$: 6 is not in the set → FALSE (we write $6 \\\\notin A$)",
                            "(c) $\\\\{2, 7\\\\} \\\\subset A$: Both 2 and 7 are in A, and $\\\\{2, 7\\\\} \\\\neq A$ → TRUE"
                        ],
                        final_answer: "(a) True  (b) False  (c) True"
                    }
                ]
            },
            {
                title: '4. Number of Elements — n(A)',
                content: "## Cardinal Number\n\nThe number of elements in a set $A$ is written as $n(A)$ and is called the **cardinal number** or **cardinality** of the set.\n\n## Examples\n\nIf $A = \\\\{a, e, i, o, u\\\\}$, then $n(A) = 5$\n\nIf $B = \\\\{\\\\}$ (empty set), then $n(B) = 0$\n\n## Counting Elements\n\n- List all elements without repetition\n- Count them\n\n## Applications\n\n- $n(A)$ is used in probability: $P(\\\\text{event}) = \\\\frac{n(\\\\text{favourable})}{n(\\\\text{total})}$\n- Used in Venn diagram calculations",
                worked_examples: [
                    {
                        question: "Let $M = \\\\{x : x \\\\text{ is a multiple of 3 and } 10 < x < 30\\\\}$. Find $n(M)$.",
                        steps: [
                            "List multiples of 3 between 10 and 30 (not including 10 and 30):",
                            "$12, 15, 18, 21, 24, 27$",
                            "So $M = \\\\{12, 15, 18, 21, 24, 27\\\\}$",
                            "Count: 6 elements"
                        ],
                        final_answer: "$n(M) = 6$"
                    }
                ]
            }
        ],
        key_points: [
            "A set must be well-defined — there must be a clear rule for membership",
            "Sets are named with capital letters and elements listed in curly braces",
            "$\\\\in$ means 'belongs to'; $\\\\notin$ means 'does not belong to'",
            "$\\\\subset$ means proper subset (not equal); $\\\\subseteq$ means subset (may be equal)",
            "The order of elements does not matter; repeated elements are written only once",
            "$n(A)$ denotes the number of elements in set $A$",
            "Sets can be described by listing, set-builder notation, or verbal description"
        ],
        exam_tips: [
            "Use correct notation: curly braces for sets, $\\\\in$ for membership — marks depend on it.",
            "When listing elements, make sure you include ALL elements and no duplicates.",
            "Read set-builder notation carefully: $\\\\{x : ...\\\\}$ means 'the set of all $x$ such that...'",
            "Remember: $\\\\{1, 2, 3\\\\} = \\\\{3, 1, 2\\\\}$ — order does not matter in sets.",
            "Always check boundary conditions: 'less than 10' does NOT include 10."
        ],
        visual_descriptions: [
            "Venn diagram showing a set A with its elements listed inside an oval",
            "Classification diagram showing set-builder notation and listing notation side by side",
            "Number line with elements of a set highlighted as points"
        ]
    },

    // ============================================
    // TOPIC 8: TYPES OF SETS
    // ============================================
    'Types of Sets': {
        topic: 'Types of Sets',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "Building on the introduction to sets and set notation, this topic covers the classification of sets into different types (universal, finite, infinite, null/empty, and equal sets), the concept of subsets, and the fundamental operations of union and intersection. These concepts are essential for solving Venn diagram problems, which are a major component of the ZIMSEC O-Level examination.",
        sections: [
            {
                title: '1. Universal Set (ξ or U)',
                content: "## Definition\n\nThe **universal set** (denoted $\\\\xi$ or $\\\\mathcal{U}$) is the set that contains **all** elements under consideration in a particular problem.\n\nEvery other set in the problem is a **subset** of the universal set.\n\n## Examples\n\n- If discussing students in a class: $\\\\xi$ = the set of all students in the class\n- If discussing numbers: $\\\\xi = \\\\{1, 2, 3, 4, 5, 6, 7, 8, 9, 10\\\\}$\n\n## In Venn Diagrams\n\nThe universal set is represented by a **rectangle** that encloses all other sets (shown as circles or ovals).\n\n## Complement of a Set\n\nThe **complement** of set $A$, written $A'$ or $A^c$, is the set of all elements in $\\\\xi$ that are NOT in $A$.\n\n$$A' = \\\\{x : x \\\\in \\\\xi \\\\text{ and } x \\\\notin A\\\\}$$\n\nExample: If $\\\\xi = \\\\{1,2,3,4,5,6,7,8,9,10\\\\}$ and $A = \\\\{2,4,6,8,10\\\\}$, then $A' = \\\\{1,3,5,7,9\\\\}$",
                worked_examples: [
                    {
                        question: "Given $\\\\xi = \\\\{1,2,3,4,5,6,7,8,9,10,11,12\\\\}$ and $P = \\\\{\\\\text{prime numbers in } \\\\xi\\\\}$, find $P'$.",
                        steps: [
                            "List prime numbers in $\\\\xi$: $P = \\\\{2, 3, 5, 7, 11\\\\}$",
                            "$P'$ contains all elements of $\\\\xi$ NOT in $P$",
                            "$P' = \\\\{1, 4, 6, 8, 9, 10, 12\\\\}$"
                        ],
                        final_answer: "$P' = \\\\{1, 4, 6, 8, 9, 10, 12\\\\}$"
                    }
                ]
            },
            {
                title: '2. Finite and Infinite Sets',
                content: "## Finite Sets\n\nA **finite set** has a countable number of elements. You can list all its members.\n\n$$A = \\\\{2, 4, 6, 8, 10\\\\} \\\\quad n(A) = 5$$\n\n## Infinite Sets\n\nAn **infinite set** has an unlimited number of elements. You cannot list them all.\n\n$$\\\\mathbb{N} = \\\\{1, 2, 3, 4, 5, ...\\\\} \\\\quad \\\\text{(infinite)}$$\n$$\\\\{x : x \\\\text{ is an even number}\\\\} = \\\\{2, 4, 6, 8, ...\\\\} \\\\quad \\\\text{(infinite)}$$\n\nThe \"...\" (ellipsis) at the end indicates the set continues without end.\n\n## How to Tell\n\n- If you can state $n(A)$ as a specific number → **finite**\n- If the elements go on forever → **infinite**",
                worked_examples: [
                    {
                        question: "Classify each set as finite or infinite: (a) $\\\\{x : x \\\\text{ is a day of the week}\\\\}$ (b) $\\\\{x : x \\\\text{ is a whole number}\\\\}$ (c) $\\\\{x : x \\\\text{ is a factor of 100}\\\\}$",
                        steps: [
                            "(a) Days of the week: Monday, Tuesday, ..., Sunday — 7 elements → Finite",
                            "(b) Whole numbers: 0, 1, 2, 3, ... — goes on forever → Infinite",
                            "(c) Factors of 100: 1, 2, 4, 5, 10, 20, 25, 50, 100 — 9 elements → Finite"
                        ],
                        final_answer: "(a) Finite  (b) Infinite  (c) Finite"
                    }
                ]
            },
            {
                title: '3. Empty (Null) Set and Equal Sets',
                content: "## Empty Set (Null Set)\n\nThe **empty set** (or null set) is a set with **no elements**. It is written as $\\\\{\\\\}$ or $\\\\emptyset$.\n\n$$n(\\\\emptyset) = 0$$\n\n## Examples of Empty Sets\n\n- The set of months with 32 days: $\\\\emptyset$\n- $\\\\{x : x^2 = -1, x \\\\in \\\\mathbb{R}\\\\} = \\\\emptyset$ (no real number squared gives $-1$)\n\n## Important Note\n\n$\\\\{0\\\\}$ is NOT empty — it contains one element (the number 0).\n$\\\\{\\\\emptyset\\\\}$ is NOT empty — it contains one element (the empty set).\n\n## Equal Sets\n\nTwo sets are **equal** if they contain exactly the same elements.\n\n$$A = B \\\\text{ if and only if every element of } A \\\\text{ is in } B \\\\text{ and every element of } B \\\\text{ is in } A$$\n\nExample: $\\\\{1, 2, 3\\\\} = \\\\{3, 1, 2\\\\}$ (same elements, order doesn't matter)",
                worked_examples: [
                    {
                        question: "State whether each is an empty set: (a) $\\\\{x : x \\\\text{ is even and } x \\\\text{ is odd}\\\\}$ (b) $\\\\{0\\\\}$ (c) $\\\\{x : x + 3 = 3\\\\}$",
                        steps: [
                            "(a) No number can be both even AND odd → Empty set ✓",
                            "(b) Contains the element 0 → NOT empty ✗",
                            "(c) Solving: $x = 0$, so the set is $\\\\{0\\\\}$ → NOT empty ✗"
                        ],
                        final_answer: "Only (a) is an empty set"
                    }
                ]
            },
            {
                title: '4. Subsets',
                content: "## Definition\n\nSet $A$ is a **subset** of set $B$ if **every** element of $A$ is also in $B$.\n\n$$A \\\\subseteq B \\\\text{ means every element of } A \\\\text{ is in } B$$\n\n## Proper Subset\n\nSet $A$ is a **proper subset** of $B$ if $A \\\\subseteq B$ and $A \\\\neq B$ (i.e., $B$ has at least one extra element).\n\n$$A \\\\subset B$$\n\n## Key Facts About Subsets\n\n1. Every set is a subset of itself: $A \\\\subseteq A$\n2. The empty set is a subset of every set: $\\\\emptyset \\\\subseteq A$\n3. If $A \\\\subseteq B$ and $B \\\\subseteq A$, then $A = B$\n\n## Number of Subsets\n\nA set with $n$ elements has $2^n$ subsets.\n\nExample: $\\\\{a, b\\\\}$ has $2^2 = 4$ subsets: $\\\\{\\\\}$, $\\\\{a\\\\}$, $\\\\{b\\\\}$, $\\\\{a, b\\\\}$",
                worked_examples: [
                    {
                        question: "List all subsets of $\\\\{1, 2, 3\\\\}$.",
                        steps: [
                            "Number of subsets = $2^3 = 8$",
                            "0 elements: $\\\\{\\\\}$ (empty set)",
                            "1 element: $\\\\{1\\\\}$, $\\\\{2\\\\}$, $\\\\{3\\\\}$",
                            "2 elements: $\\\\{1,2\\\\}$, $\\\\{1,3\\\\}$, $\\\\{2,3\\\\}$",
                            "3 elements: $\\\\{1,2,3\\\\}$"
                        ],
                        final_answer: "The 8 subsets are: $\\\\{\\\\}$, $\\\\{1\\\\}$, $\\\\{2\\\\}$, $\\\\{3\\\\}$, $\\\\{1,2\\\\}$, $\\\\{1,3\\\\}$, $\\\\{2,3\\\\}$, $\\\\{1,2,3\\\\}$"
                    }
                ]
            },
            {
                title: '5. Union and Intersection',
                content: "## Union ($\\\\cup$)\n\nThe **union** of sets $A$ and $B$ is the set of elements that are in $A$ **OR** $B$ **OR both**.\n\n$$A \\\\cup B = \\\\{x : x \\\\in A \\\\text{ or } x \\\\in B\\\\}$$\n\nExample: If $A = \\\\{1,2,3,4\\\\}$ and $B = \\\\{3,4,5,6\\\\}$:\n$$A \\\\cup B = \\\\{1,2,3,4,5,6\\\\}$$\n\n## Intersection ($\\\\cap$)\n\nThe **intersection** of sets $A$ and $B$ is the set of elements that are in **BOTH** $A$ **AND** $B$.\n\n$$A \\\\cap B = \\\\{x : x \\\\in A \\\\text{ and } x \\\\in B\\\\}$$\n\nExample: $A \\\\cap B = \\\\{3, 4\\\\}$\n\n## Disjoint Sets\n\nIf $A \\\\cap B = \\\\emptyset$, the sets are called **disjoint** — they have no common elements.\n\n## Key Properties\n\n- $A \\\\cup B = B \\\\cup A$ (commutative)\n- $A \\\\cap B = B \\\\cap A$ (commutative)\n- $n(A \\\\cup B) = n(A) + n(B) - n(A \\\\cap B)$",
                worked_examples: [
                    {
                        question: "Given $\\\\xi = \\\\{1,2,...,10\\\\}$, $A = \\\\{1,2,3,4,5\\\\}$, $B = \\\\{3,5,7,9\\\\}$. Find: (a) $A \\\\cup B$ (b) $A \\\\cap B$ (c) $(A \\\\cup B)'$",
                        steps: [
                            "(a) $A \\\\cup B$ = elements in A or B or both: $\\\\{1,2,3,4,5,7,9\\\\}$",
                            "(b) $A \\\\cap B$ = elements in both A and B: $\\\\{3, 5\\\\}$",
                            "(c) $(A \\\\cup B)' = \\\\xi - (A \\\\cup B) = \\\\{6, 8, 10\\\\}$"
                        ],
                        final_answer: "(a) $\\\\{1,2,3,4,5,7,9\\\\}$ (b) $\\\\{3,5\\\\}$ (c) $\\\\{6,8,10\\\\}$"
                    },
                    {
                        question: "In a class of 40 students, 25 play soccer and 18 play netball. If 8 play both, how many play neither?",
                        steps: [
                            "Use: $n(A \\\\cup B) = n(A) + n(B) - n(A \\\\cap B)$",
                            "$n(S \\\\cup N) = 25 + 18 - 8 = 35$",
                            "Students playing neither = $40 - 35 = 5$"
                        ],
                        final_answer: "5 students play neither sport"
                    }
                ]
            }
        ],
        key_points: [
            "The universal set $\\\\xi$ contains all elements being considered; it is drawn as a rectangle in Venn diagrams",
            "Finite sets have a countable number of elements; infinite sets continue without end",
            "The empty set $\\\\emptyset$ has no elements; $n(\\\\emptyset) = 0$",
            "$A \\\\cup B$ (union) includes elements in A OR B; $A \\\\cap B$ (intersection) includes only elements in BOTH",
            "The complement $A'$ contains elements in $\\\\xi$ but NOT in $A$",
            "A set with $n$ elements has $2^n$ subsets",
            "$n(A \\\\cup B) = n(A) + n(B) - n(A \\\\cap B)$ — crucial formula for Venn diagram problems"
        ],
        exam_tips: [
            "Draw Venn diagrams to visualise union, intersection, and complement problems.",
            "Remember: $\\\\{0\\\\} \\\\neq \\\\emptyset$ — the set containing zero is NOT empty.",
            "When listing subsets, be systematic: start with 0 elements, then 1, then 2, etc.",
            "Use the formula $n(A \\\\cup B) = n(A) + n(B) - n(A \\\\cap B)$ to avoid double-counting.",
            "In ZIMSEC exams, always define the universal set if it is not given.",
            "The empty set is a subset of every set — this is commonly tested."
        ],
        visual_descriptions: [
            "Venn diagram with two overlapping circles inside a rectangle, showing union and intersection regions shaded differently",
            "Diagram showing all 8 subsets of a 3-element set arranged in a lattice",
            "Two non-overlapping circles (disjoint sets) inside a universal set rectangle"
        ]
    },

    // ============================================
    // TOPIC 9: CONSUMER ARITHMETIC
    // ============================================
    'Consumer Arithmetic': {
        topic: 'Consumer Arithmetic',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "Consumer Arithmetic deals with the mathematics of everyday financial transactions. The ZIMSEC syllabus requires Form 1 students to interpret household bills, calculate profit and loss, understand discounts and sale prices, and prepare simple household budgets. This topic connects mathematics directly to real-life situations in Zimbabwe, making it one of the most practical topics in the syllabus.",
        sections: [
            {
                title: '1. Understanding Household Bills',
                content: "## Types of Household Bills\n\nCommon bills in Zimbabwe include:\n- **Electricity bills** (ZESA/ZETDC): measured in kilowatt-hours (kWh)\n- **Water bills**: measured in kilolitres (kL) or cubic metres (m³)\n- **Rates/Council charges**: property-based municipal charges\n- **School fees**: termly or annual education costs\n\n## Reading a Bill\n\nA typical bill shows:\n- **Previous reading** and **current reading** (for metered services)\n- **Units consumed** = Current reading − Previous reading\n- **Rate per unit** (cost per kWh, per m³, etc.)\n- **Total charge** = Units × Rate per unit\n- **VAT** (Value Added Tax) where applicable\n- **Outstanding balance** from previous periods\n\n## Calculating Consumption\n\n$$\\\\text{Units used} = \\\\text{Current reading} - \\\\text{Previous reading}$$\n$$\\\\text{Cost} = \\\\text{Units used} \\\\times \\\\text{Rate per unit}$$",
                worked_examples: [
                    {
                        question: "A family's electricity meter read 45,230 kWh in January and 45,780 kWh in February. If the tariff is \\$0.12 per kWh with a fixed monthly charge of \\$5.00, calculate the February bill.",
                        steps: [
                            "Units consumed = 45,780 − 45,230 = 550 kWh",
                            "Energy charge = 550 × \\$0.12 = \\$66.00",
                            "Fixed charge = \\$5.00",
                            "Total bill = \\$66.00 + \\$5.00 = \\$71.00"
                        ],
                        final_answer: "The February electricity bill is \\$71.00"
                    }
                ]
            },
            {
                title: '2. Profit and Loss',
                content: "## Key Terms\n\n- **Cost Price (C.P.)**: The price at which an item is bought\n- **Selling Price (S.P.)**: The price at which an item is sold\n- **Profit**: When S.P. > C.P. → $\\\\text{Profit} = \\\\text{S.P.} - \\\\text{C.P.}$\n- **Loss**: When C.P. > S.P. → $\\\\text{Loss} = \\\\text{C.P.} - \\\\text{S.P.}$\n\n## Percentage Profit or Loss\n\n$$\\\\text{Percentage Profit} = \\\\frac{\\\\text{Profit}}{\\\\text{Cost Price}} \\\\times 100\\\\%$$\n\n$$\\\\text{Percentage Loss} = \\\\frac{\\\\text{Loss}}{\\\\text{Cost Price}} \\\\times 100\\\\%$$\n\n**Important**: Percentage profit/loss is always calculated on the **cost price**, not the selling price.\n\n## Finding Selling Price from Percentage Profit\n\n$$\\\\text{S.P.} = \\\\text{C.P.} \\\\times \\\\left(1 + \\\\frac{\\\\text{\\% profit}}{100}\\\\right)$$",
                worked_examples: [
                    {
                        question: "A trader at Mbare Musika buys tomatoes for \\$45 and sells them for \\$63. Calculate the percentage profit.",
                        steps: [
                            "Cost Price (C.P.) = \\$45",
                            "Selling Price (S.P.) = \\$63",
                            "Profit = S.P. − C.P. = \\$63 − \\$45 = \\$18",
                            "Percentage Profit = $\\\\frac{18}{45} \\\\times 100\\\\% = 40\\\\%$"
                        ],
                        final_answer: "The percentage profit is 40%"
                    },
                    {
                        question: "Chipo bought a phone for \\$250 and sold it at a 12% loss. What was the selling price?",
                        steps: [
                            "Loss = 12% of \\$250 = $\\\\frac{12}{100} \\\\times 250 = \\$30$",
                            "S.P. = C.P. − Loss = \\$250 − \\$30 = \\$220",
                            "Or: S.P. = $250 \\\\times (1 - 0.12) = 250 \\\\times 0.88 = \\$220$"
                        ],
                        final_answer: "The selling price was \\$220"
                    }
                ]
            },
            {
                title: '3. Discount',
                content: "## What Is a Discount?\n\nA **discount** is a reduction in the price of an item, usually expressed as a percentage.\n\n## Calculating Discount\n\n$$\\\\text{Discount Amount} = \\\\frac{\\\\text{Discount \\%}}{100} \\\\times \\\\text{Marked Price}$$\n\n$$\\\\text{Sale Price} = \\\\text{Marked Price} - \\\\text{Discount Amount}$$\n\nOr directly:\n$$\\\\text{Sale Price} = \\\\text{Marked Price} \\\\times \\\\left(1 - \\\\frac{\\\\text{Discount \\%}}{100}\\\\right)$$\n\n## Example Situations\n\n- End of season sales in clothing shops\n- Wholesale vs retail pricing\n- Loyalty card discounts at supermarkets like OK, Pick n Pay, or TM",
                worked_examples: [
                    {
                        question: "A school uniform marked at \\$85 is offered at a 15% discount. Find the amount paid.",
                        steps: [
                            "Discount = 15% of \\$85",
                            "$= \\\\frac{15}{100} \\\\times 85 = \\$12.75$",
                            "Amount paid = \\$85 − \\$12.75 = \\$72.25",
                            "Or: $85 \\\\times 0.85 = \\$72.25$"
                        ],
                        final_answer: "The amount paid is \\$72.25"
                    }
                ]
            },
            {
                title: '4. Value Added Tax (VAT)',
                content: "## What Is VAT?\n\nVAT is a tax added to the price of goods and services. In Zimbabwe, the standard VAT rate is **15%**.\n\n## Calculating Price Including VAT\n\n$$\\\\text{VAT Amount} = \\\\frac{15}{100} \\\\times \\\\text{Price before VAT}$$\n$$\\\\text{Price including VAT} = \\\\text{Price before VAT} + \\\\text{VAT Amount}$$\n$$= \\\\text{Price before VAT} \\\\times 1.15$$\n\n## Finding Price Before VAT\n\nIf the price including VAT is given:\n$$\\\\text{Price before VAT} = \\\\frac{\\\\text{Price including VAT}}{1.15}$$",
                worked_examples: [
                    {
                        question: "A textbook costs \\$24 before VAT. If VAT is 15%, find the total price.",
                        steps: [
                            "VAT = 15% of \\$24 = $\\\\frac{15}{100} \\\\times 24 = \\$3.60$",
                            "Total price = \\$24 + \\$3.60 = \\$27.60",
                            "Or: $24 \\\\times 1.15 = \\$27.60$"
                        ],
                        final_answer: "The total price including VAT is \\$27.60"
                    }
                ]
            },
            {
                title: '5. Household Budgets',
                content: "## What Is a Budget?\n\nA **budget** is a plan showing expected income and expenditure over a period (usually monthly).\n\n## Components of a Household Budget\n\n**Income**:\n- Salary/wages\n- Business profits\n- Other income (rent, interest)\n\n**Expenditure** (grouped by category):\n- Housing (rent, rates, mortgage)\n- Food and groceries\n- Transport (fuel, bus fares)\n- Utilities (electricity, water)\n- Education (school fees, books)\n- Health (medical aid, medication)\n- Savings\n\n## Budget Balance\n\n$$\\\\text{Balance} = \\\\text{Total Income} - \\\\text{Total Expenditure}$$\n\n- **Surplus**: Income > Expenditure (positive balance)\n- **Deficit**: Expenditure > Income (negative balance)\n\n## Tips for Budgeting\n\n- Always aim to save at least 10% of income\n- Fixed expenses (rent, school fees) should be budgeted first\n- Variable expenses (food, transport) need careful tracking",
                worked_examples: [
                    {
                        question: "A family has a monthly income of \\$1,200. Their expenses are: rent \\$350, food \\$280, transport \\$120, electricity \\$65, water \\$25, school fees \\$180, medical \\$40. (a) Find the total expenditure. (b) Find the balance. (c) What percentage of income is spent on food?",
                        steps: [
                            "(a) Total expenditure = 350 + 280 + 120 + 65 + 25 + 180 + 40 = \\$1,060",
                            "(b) Balance = \\$1,200 − \\$1,060 = \\$140 (surplus)",
                            "(c) Food percentage = $\\\\frac{280}{1200} \\\\times 100\\\\% = 23.3\\\\%$"
                        ],
                        final_answer: "(a) \\$1,060  (b) \\$140 surplus  (c) 23.3% spent on food"
                    }
                ]
            }
        ],
        key_points: [
            "Profit = Selling Price − Cost Price; Loss = Cost Price − Selling Price",
            "Percentage profit/loss is always calculated on the COST PRICE",
            "Discount reduces the marked price; Sale Price = Marked Price × (1 − discount %/100)",
            "VAT in Zimbabwe is 15%; Price with VAT = Price × 1.15",
            "A budget balances income against expenditure; surplus means income > expenses",
            "Units consumed = Current meter reading − Previous meter reading"
        ],
        exam_tips: [
            "Always identify whether the question asks for profit or percentage profit — they are different.",
            "For percentage profit/loss, the denominator is always the COST PRICE.",
            "When VAT is included in a price, divide by 1.15 to find the price before VAT.",
            "In budget questions, check that all items are accounted for before calculating the balance.",
            "Show all working clearly in money calculations — include the currency symbol.",
            "Real-world context matters: ZIMSEC often uses Zimbabwean settings (Mbare, ZESA, OK Supermarket)."
        ],
        visual_descriptions: [
            "Sample electricity bill layout showing meter readings, units consumed, tariff rate, and total amount",
            "Bar chart comparing household expenditure categories in a monthly budget",
            "Diagram showing the relationship between Cost Price, Selling Price, Profit, and Loss"
        ]
    },

    // ============================================
    // TOPIC 10: MEASURES
    // ============================================
    'Measures': {
        topic: 'Measures',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "The Measures topic covers reading time in both 12-hour and 24-hour formats, understanding the International System of Units (SI), and converting between different units of length, mass, and capacity. Accurate measurement and unit conversion are essential life skills and appear frequently in ZIMSEC examinations, often combined with other topics such as mensuration and consumer arithmetic.",
        sections: [
            {
                title: '1. Time — 12-Hour and 24-Hour Clock',
                content: "## 12-Hour Clock\n\nUses **a.m.** (ante meridiem — before noon) and **p.m.** (post meridiem — after noon).\n\n- 12:00 a.m. = midnight\n- 12:00 p.m. = noon\n- Hours run from 12:00 to 12:59, then 1:00 to 11:59 (twice daily)\n\n## 24-Hour Clock\n\nUses hours from **00:00** (midnight) to **23:59**.\n\n- No a.m. or p.m. needed\n- Hours are always written as 4 digits: 08:30, 14:45, 00:15\n\n## Conversion Table\n\n| 12-Hour | 24-Hour |\n|---------|----------|\n| 12:00 midnight | 00:00 |\n| 6:30 a.m. | 06:30 |\n| 12:00 noon | 12:00 |\n| 3:45 p.m. | 15:45 |\n| 9:15 p.m. | 21:15 |\n| 11:59 p.m. | 23:59 |\n\n## Converting p.m. to 24-Hour\n\nAdd 12 to the hour: $3\\text{:}45 \\\\text{ p.m.} = (3+12)\\text{:}45 = 15\\text{:}45$\n\n## Calculating Time Intervals\n\nSubtract the earlier time from the later time. If borrowing is needed, remember: 1 hour = 60 minutes.",
                worked_examples: [
                    {
                        question: "A bus departs at 08:45 and arrives at 14:20. How long is the journey?",
                        steps: [
                            "Arrival: 14:20",
                            "Departure: 08:45",
                            "Hours: 14 − 8 = 6, but need to borrow for minutes",
                            "13:80 − 08:45 (borrow 1 hour = 60 min: 14:20 → 13:80)",
                            "Hours: 13 − 8 = 5 hours",
                            "Minutes: 80 − 45 = 35 minutes"
                        ],
                        final_answer: "The journey takes 5 hours 35 minutes"
                    }
                ]
            },
            {
                title: '2. SI Units',
                content: "## The International System of Units (SI)\n\nThe SI system is the standard system of measurement used worldwide, including in Zimbabwe.\n\n## Base SI Units\n\n| Quantity | SI Unit | Symbol |\n|----------|---------|--------|\n| Length | metre | m |\n| Mass | kilogram | kg |\n| Time | second | s |\n| Temperature | kelvin (Celsius in everyday use) | K (°C) |\n| Electric current | ampere | A |\n\n## SI Prefixes\n\n| Prefix | Symbol | Factor | Example |\n|--------|--------|--------|---------|\n| kilo- | k | $\\\\times 1000$ | 1 km = 1000 m |\n| hecto- | h | $\\\\times 100$ | 1 hm = 100 m |\n| deca- | da | $\\\\times 10$ | 1 dam = 10 m |\n| — | — | $\\\\times 1$ | 1 m |\n| deci- | d | $\\\\div 10$ | 1 dm = 0.1 m |\n| centi- | c | $\\\\div 100$ | 1 cm = 0.01 m |\n| milli- | m | $\\\\div 1000$ | 1 mm = 0.001 m |",
                worked_examples: [
                    {
                        question: "Convert 3.5 km to (a) metres (b) centimetres.",
                        steps: [
                            "(a) 1 km = 1,000 m",
                            "3.5 km = $3.5 \\\\times 1000 = 3,500$ m",
                            "(b) 1 m = 100 cm",
                            "3,500 m = $3,500 \\\\times 100 = 350,000$ cm"
                        ],
                        final_answer: "(a) 3,500 m  (b) 350,000 cm"
                    }
                ]
            },
            {
                title: '3. Length Conversions',
                content: "## Length Units and Conversions\n\n$$1 \\\\text{ km} = 1000 \\\\text{ m}$$\n$$1 \\\\text{ m} = 100 \\\\text{ cm}$$\n$$1 \\\\text{ cm} = 10 \\\\text{ mm}$$\n$$1 \\\\text{ m} = 1000 \\\\text{ mm}$$\n\n## Conversion Strategy\n\n- **Larger to smaller unit**: MULTIPLY\n- **Smaller to larger unit**: DIVIDE\n\n## Memory Aid\n\n$$\\\\text{km} \\\\xrightarrow{\\\\times 1000} \\\\text{m} \\\\xrightarrow{\\\\times 100} \\\\text{cm} \\\\xrightarrow{\\\\times 10} \\\\text{mm}$$\n$$\\\\text{mm} \\\\xrightarrow{\\\\div 10} \\\\text{cm} \\\\xrightarrow{\\\\div 100} \\\\text{m} \\\\xrightarrow{\\\\div 1000} \\\\text{km}$$",
                worked_examples: [
                    {
                        question: "A piece of wire is 2.4 m long. How many pieces of 8 cm can be cut from it?",
                        steps: [
                            "Convert 2.4 m to cm: $2.4 \\\\times 100 = 240$ cm",
                            "Number of pieces = $240 \\\\div 8 = 30$"
                        ],
                        final_answer: "30 pieces can be cut"
                    }
                ]
            },
            {
                title: '4. Mass Conversions',
                content: "## Mass Units\n\n$$1 \\\\text{ tonne (t)} = 1000 \\\\text{ kg}$$\n$$1 \\\\text{ kg} = 1000 \\\\text{ g}$$\n$$1 \\\\text{ g} = 1000 \\\\text{ mg}$$\n\n## Common Masses (for reference)\n\n- A bag of mealie meal: 10 kg\n- A standard loaf of bread: approximately 700 g\n- A sugar packet: 2 kg\n- An aspirin tablet: 500 mg\n\n## Conversion Strategy\n\nSame as length: multiply when going to smaller units, divide when going to larger units.",
                worked_examples: [
                    {
                        question: "A farmer harvests 4.2 tonnes of maize. Express this in (a) kilograms (b) grams.",
                        steps: [
                            "(a) 1 tonne = 1,000 kg",
                            "4.2 tonnes = $4.2 \\\\times 1000 = 4,200$ kg",
                            "(b) 1 kg = 1,000 g",
                            "4,200 kg = $4,200 \\\\times 1000 = 4,200,000$ g"
                        ],
                        final_answer: "(a) 4,200 kg  (b) 4,200,000 g"
                    }
                ]
            },
            {
                title: '5. Capacity Conversions',
                content: "## Capacity Units\n\n$$1 \\\\text{ litre (l)} = 1000 \\\\text{ ml (millilitres)}$$\n$$1 \\\\text{ kl (kilolitre)} = 1000 \\\\text{ l}$$\n$$1 \\\\text{ litre} = 1000 \\\\text{ cm}^3$$\n$$1 \\\\text{ ml} = 1 \\\\text{ cm}^3$$\n$$1 \\\\text{ m}^3 = 1000 \\\\text{ litres}$$\n\n## Common Capacities\n\n- A standard bottle of water: 500 ml or 750 ml\n- A 2-litre bottle of Mazoe: 2,000 ml\n- A standard bathtub: approximately 150 litres\n- A jojo tank: 2,500 litres or 5,000 litres\n\n## Linking Capacity and Volume\n\n$1 \\\\text{ cm}^3 = 1 \\\\text{ ml}$ and $1,000 \\\\text{ cm}^3 = 1 \\\\text{ litre}$\n\nThis connection between volume and capacity is used frequently in mensuration problems.",
                worked_examples: [
                    {
                        question: "A water tank holds 5,000 litres. (a) Express in ml. (b) If 1.2 kl is used, how much remains?",
                        steps: [
                            "(a) $5000 \\\\times 1000 = 5,000,000$ ml",
                            "(b) Convert 1.2 kl to litres: $1.2 \\\\times 1000 = 1,200$ litres",
                            "Remaining = $5,000 - 1,200 = 3,800$ litres"
                        ],
                        final_answer: "(a) 5,000,000 ml  (b) 3,800 litres remain"
                    }
                ]
            }
        ],
        key_points: [
            "The 24-hour clock runs from 00:00 to 23:59; to convert p.m. times, add 12 to the hour",
            "SI base units: metre (length), kilogram (mass), second (time)",
            "Prefixes: kilo = ×1000, centi = ÷100, milli = ÷1000",
            "Larger to smaller unit = multiply; smaller to larger unit = divide",
            "1 litre = 1000 ml = 1000 cm³; 1 m³ = 1000 litres",
            "1 km = 1000 m = 100,000 cm",
            "Always include units in your final answer"
        ],
        exam_tips: [
            "When calculating time intervals, remember 1 hour = 60 minutes (not 100!).",
            "For unit conversions, write the conversion factor clearly before calculating.",
            "Convert all quantities to the same unit before comparing or calculating.",
            "Learn the SI prefix ladder: km → m → cm → mm (×1000, ×100, ×10).",
            "In capacity questions, remember: 1 ml = 1 cm³ — this links capacity to volume."
        ],
        visual_descriptions: [
            "Clock face showing both 12-hour and 24-hour times simultaneously",
            "SI prefix ladder/staircase diagram showing conversions between units",
            "Comparison diagram showing common objects and their approximate masses"
        ]
    },

    // ============================================
    // TOPIC 11: MENSURATION
    // ============================================
    'Mensuration': {
        topic: 'Mensuration',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "Mensuration is the branch of mathematics dealing with the measurement of lengths, areas, and volumes of geometric shapes. The ZIMSEC Form 1 syllabus covers perimeters and areas of rectangles, triangles, parallelograms, trapeziums, and circles, as well as volumes of cuboids and prisms. These formulae are used extensively in real-life applications such as construction, agriculture, and packaging.",
        sections: [
            {
                title: '1. Perimeter of Plane Shapes',
                content: "## What Is Perimeter?\n\nThe **perimeter** is the total distance around the outside of a shape.\n\n## Formulae\n\n**Rectangle**: $P = 2(l + w)$ or $P = 2l + 2w$\n\n**Square**: $P = 4s$\n\n**Triangle**: $P = a + b + c$ (sum of all three sides)\n\n**Circle (Circumference)**: $C = 2\\\\pi r$ or $C = \\\\pi d$\n\nwhere $r$ = radius, $d$ = diameter, $\\\\pi \\\\approx 3.14159$ or $\\\\frac{22}{7}$\n\n## Semicircle Perimeter\n\n$$P = \\\\pi r + 2r = r(\\\\pi + 2)$$\n(curved part + diameter)",
                worked_examples: [
                    {
                        question: "Find the perimeter of a rectangle with length 12 cm and width 7 cm.",
                        steps: [
                            "P = 2(l + w)",
                            "P = 2(12 + 7)",
                            "P = 2 × 19 = 38 cm"
                        ],
                        final_answer: "Perimeter = 38 cm"
                    },
                    {
                        question: "Find the circumference of a circle with radius 14 cm. (Use $\\\\pi = \\\\frac{22}{7}$)",
                        steps: [
                            "$C = 2\\\\pi r$",
                            "$C = 2 \\\\times \\\\frac{22}{7} \\\\times 14$",
                            "$C = 2 \\\\times 22 \\\\times 2 = 88$ cm"
                        ],
                        final_answer: "Circumference = 88 cm"
                    }
                ]
            },
            {
                title: '2. Area of Rectangles and Squares',
                content: "## Area\n\n**Area** is the amount of surface a shape covers, measured in **square units** (cm², m², km²).\n\n## Formulae\n\n**Rectangle**: $A = l \\\\times w$ (length × width)\n\n**Square**: $A = s^2$ (side × side)\n\n## Finding Unknown Dimensions\n\nIf the area and one dimension are known:\n$$w = \\\\frac{A}{l} \\\\quad \\\\text{or} \\\\quad l = \\\\frac{A}{w}$$\n\n## Unit Conversions for Area\n\n$$1 \\\\text{ m}^2 = 10,000 \\\\text{ cm}^2$$\n$$1 \\\\text{ km}^2 = 1,000,000 \\\\text{ m}^2$$\n$$1 \\\\text{ hectare (ha)} = 10,000 \\\\text{ m}^2$$",
                worked_examples: [
                    {
                        question: "A rectangular garden is 25 m long and 18 m wide. Find its area in (a) m² (b) hectares.",
                        steps: [
                            "(a) $A = l \\\\times w = 25 \\\\times 18 = 450$ m²",
                            "(b) 1 hectare = 10,000 m²",
                            "$450 \\\\div 10,000 = 0.045$ hectares"
                        ],
                        final_answer: "(a) 450 m²  (b) 0.045 hectares"
                    }
                ]
            },
            {
                title: '3. Area of Triangles and Parallelograms',
                content: "## Triangle\n\n$$A = \\\\frac{1}{2} \\\\times b \\\\times h$$\n\nwhere $b$ = base and $h$ = perpendicular height (the vertical distance from base to opposite vertex).\n\n## Parallelogram\n\n$$A = b \\\\times h$$\n\nwhere $b$ = base and $h$ = perpendicular height (NOT the slant side).\n\n## Important Note\n\nThe height must be **perpendicular** (at right angles) to the base. The slant height is not used in the area formula.\n\nA parallelogram can be thought of as two identical triangles, which is why its area formula is double the triangle formula.",
                worked_examples: [
                    {
                        question: "A triangular plot of land has a base of 40 m and a perpendicular height of 25 m. Find its area.",
                        steps: [
                            "$A = \\\\frac{1}{2} \\\\times b \\\\times h$",
                            "$A = \\\\frac{1}{2} \\\\times 40 \\\\times 25$",
                            "$A = 500$ m²"
                        ],
                        final_answer: "Area = 500 m²"
                    }
                ]
            },
            {
                title: '4. Area of Trapezium',
                content: "## Trapezium (Trapezoid)\n\nA trapezium has **one pair of parallel sides** called the parallel sides (or \"parallel lengths\").\n\n$$A = \\\\frac{1}{2}(a + b) \\\\times h$$\n\nwhere $a$ and $b$ are the two parallel sides and $h$ is the perpendicular distance between them.\n\n## Memory Aid\n\nThe formula finds the **average of the parallel sides** multiplied by the height:\n$$A = \\\\text{average of parallel sides} \\\\times \\\\text{height}$$",
                worked_examples: [
                    {
                        question: "A trapezium has parallel sides of 8 cm and 14 cm, and a height of 6 cm. Find its area.",
                        steps: [
                            "$A = \\\\frac{1}{2}(a + b) \\\\times h$",
                            "$A = \\\\frac{1}{2}(8 + 14) \\\\times 6$",
                            "$A = \\\\frac{1}{2} \\\\times 22 \\\\times 6$",
                            "$A = 66$ cm²"
                        ],
                        final_answer: "Area = 66 cm²"
                    }
                ]
            },
            {
                title: '5. Area of Circles',
                content: "## Circle Area Formula\n\n$$A = \\\\pi r^2$$\n\nwhere $r$ = radius.\n\nIf given the diameter: $r = \\\\frac{d}{2}$\n\n## Semicircle Area\n\n$$A = \\\\frac{1}{2}\\\\pi r^2$$\n\n## Quarter Circle Area\n\n$$A = \\\\frac{1}{4}\\\\pi r^2$$\n\n## Common Values of $\\\\pi$\n\n- Use $\\\\pi = 3.142$ or $\\\\frac{22}{7}$ (as specified in the question)\n- Use $\\\\frac{22}{7}$ when the radius is a multiple of 7 (makes calculation easier)",
                worked_examples: [
                    {
                        question: "Find the area of a circle with diameter 21 cm. (Use $\\\\pi = \\\\frac{22}{7}$)",
                        steps: [
                            "Radius $r = \\\\frac{21}{2} = 10.5$ cm",
                            "$A = \\\\pi r^2 = \\\\frac{22}{7} \\\\times 10.5^2$",
                            "$= \\\\frac{22}{7} \\\\times 110.25$",
                            "$= \\\\frac{22 \\\\times 110.25}{7} = \\\\frac{2425.5}{7} = 346.5$ cm²"
                        ],
                        final_answer: "Area = 346.5 cm²"
                    }
                ]
            },
            {
                title: '6. Volume of Cuboids and Prisms',
                content: "## Volume\n\n**Volume** is the amount of 3D space an object occupies, measured in **cubic units** (cm³, m³).\n\n## Cuboid\n\n$$V = l \\\\times w \\\\times h$$\n\nwhere $l$ = length, $w$ = width, $h$ = height.\n\n## Cube\n\n$$V = s^3$$\n\n## Prism\n\nA prism has the same cross-section throughout its length.\n\n$$V = \\\\text{Area of cross-section} \\\\times \\\\text{length}$$\n\nExamples of prisms:\n- Triangular prism: cross-section is a triangle\n- Cylinder: cross-section is a circle ($V = \\\\pi r^2 h$)\n- L-shaped prism: cross-section is an L-shape\n\n## Unit Conversions\n\n$$1 \\\\text{ m}^3 = 1,000,000 \\\\text{ cm}^3$$\n$$1 \\\\text{ litre} = 1,000 \\\\text{ cm}^3$$",
                worked_examples: [
                    {
                        question: "A water tank is in the shape of a cuboid measuring 2 m × 1.5 m × 0.8 m. Find its capacity in litres.",
                        steps: [
                            "$V = l \\\\times w \\\\times h = 2 \\\\times 1.5 \\\\times 0.8 = 2.4$ m³",
                            "Convert to cm³: $2.4 \\\\times 1,000,000 = 2,400,000$ cm³",
                            "Convert to litres: $2,400,000 \\\\div 1000 = 2,400$ litres",
                            "Or directly: $1 \\\\text{ m}^3 = 1000 \\\\text{ litres}$, so $2.4 \\\\times 1000 = 2,400$ litres"
                        ],
                        final_answer: "The tank holds 2,400 litres"
                    },
                    {
                        question: "A triangular prism has a cross-section that is a right-angled triangle with base 6 cm and height 8 cm. The prism is 15 cm long. Find its volume.",
                        steps: [
                            "Area of triangular cross-section = $\\\\frac{1}{2} \\\\times 6 \\\\times 8 = 24$ cm²",
                            "Volume = Area × length = $24 \\\\times 15 = 360$ cm³"
                        ],
                        final_answer: "Volume = 360 cm³"
                    }
                ]
            }
        ],
        key_points: [
            "Perimeter is the distance around a shape; area is the surface covered; volume is 3D space occupied",
            "Rectangle: $P = 2(l+w)$, $A = lw$; Circle: $C = 2\\\\pi r$, $A = \\\\pi r^2$",
            "Triangle: $A = \\\\frac{1}{2}bh$; Parallelogram: $A = bh$; Trapezium: $A = \\\\frac{1}{2}(a+b)h$",
            "Volume of a prism = Area of cross-section × length",
            "Cuboid volume = $l \\\\times w \\\\times h$; Cube volume = $s^3$",
            "Always use perpendicular height in area calculations, not slant height",
            "1 litre = 1,000 cm³; 1 m³ = 1,000,000 cm³ = 1,000 litres"
        ],
        exam_tips: [
            "Always state the formula before substituting values — this earns method marks.",
            "Include correct units in your answer: cm² for area, cm³ for volume.",
            "Use $\\\\pi = \\\\frac{22}{7}$ when the radius/diameter is a multiple of 7; otherwise use 3.142.",
            "Draw a sketch if the question doesn't provide a diagram — it helps you identify the correct measurements.",
            "For composite shapes, break them into simpler shapes and add/subtract areas.",
            "Double-check that you used the perpendicular height, not a slant side."
        ],
        visual_descriptions: [
            "Labelled diagrams of a rectangle, triangle, parallelogram, trapezium, and circle showing base and height",
            "3D diagram of a cuboid with length, width, and height labelled",
            "Cross-section of a triangular prism showing how volume = area × length"
        ]
    },

    // ============================================
    // TOPIC 12: FUNCTIONAL GRAPHS
    // ============================================
    'Functional Graphs': {
        topic: 'Functional Graphs',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "Functional Graphs introduces the Cartesian coordinate system, which is used to plot points, draw graphs, and represent mathematical relationships visually. The ZIMSEC Form 1 syllabus requires students to draw and label a Cartesian plane with appropriate scales, plot given coordinates, name the four quadrants, and understand the roles of the x-axis, y-axis, and origin. This foundation is crucial for all graphical work in later forms.",
        sections: [
            {
                title: '1. The Cartesian Plane',
                content: "## What Is the Cartesian Plane?\n\nThe **Cartesian plane** (or coordinate plane) is a flat surface formed by two perpendicular number lines:\n\n- The **x-axis** (horizontal line)\n- The **y-axis** (vertical line)\n\nThey intersect at the **origin**, labelled $O$, which has coordinates $(0, 0)$.\n\n## Setting Up the Plane\n\n1. Draw two perpendicular lines crossing at the origin\n2. Mark equal intervals on both axes\n3. Label the x-axis and y-axis\n4. Add arrows to show the axes continue\n5. Choose an appropriate **scale** (e.g., 1 cm = 1 unit, or 1 cm = 2 units)\n\n## Choosing a Scale\n\n- The scale should allow all points to fit on the grid\n- Both axes can have different scales if needed\n- Common scales: 1 cm : 1 unit, 1 cm : 2 units, 2 cm : 1 unit",
                worked_examples: [
                    {
                        question: "On a Cartesian plane, draw the x-axis from $-5$ to $5$ and the y-axis from $-4$ to $4$ using a scale of 1 cm = 1 unit.",
                        steps: [
                            "Draw a horizontal line and mark: $-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5$",
                            "Draw a vertical line through 0 and mark: $-4, -3, -2, -1, 0, 1, 2, 3, 4$",
                            "Label the horizontal line as 'x' and the vertical line as 'y'",
                            "Mark the intersection point as O (origin)",
                            "Add arrows at the ends of both axes"
                        ],
                        final_answer: "Cartesian plane drawn with x-axis from −5 to 5, y-axis from −4 to 4, scale 1 cm : 1 unit"
                    }
                ]
            },
            {
                title: '2. Coordinates',
                content: "## What Are Coordinates?\n\nCoordinates are an **ordered pair** $(x, y)$ that describes the exact position of a point on the Cartesian plane.\n\n- $x$ is the **horizontal distance** from the origin (positive = right, negative = left)\n- $y$ is the **vertical distance** from the origin (positive = up, negative = down)\n\n## Reading Coordinates\n\nAlways read the $x$-value first, then the $y$-value: $(x, y)$\n\n## Plotting Points\n\n1. Start at the origin\n2. Move along the x-axis by the $x$-value\n3. Then move parallel to the y-axis by the $y$-value\n4. Mark the point with a cross (×) or dot (•)\n5. Label the point\n\n## Special Points\n\n- Points on the x-axis have $y = 0$: e.g., $(3, 0)$, $(-2, 0)$\n- Points on the y-axis have $x = 0$: e.g., $(0, 4)$, $(0, -1)$\n- The origin is $(0, 0)$",
                worked_examples: [
                    {
                        question: "Plot and label the following points: $A(3, 2)$, $B(-4, 1)$, $C(-2, -3)$, $D(5, -2)$, $E(0, 4)$.",
                        steps: [
                            "$A(3, 2)$: Go 3 right, 2 up",
                            "$B(-4, 1)$: Go 4 left, 1 up",
                            "$C(-2, -3)$: Go 2 left, 3 down",
                            "$D(5, -2)$: Go 5 right, 2 down",
                            "$E(0, 4)$: Stay on y-axis, go 4 up"
                        ],
                        final_answer: "All five points plotted and labelled on the Cartesian plane"
                    }
                ]
            },
            {
                title: '3. The Four Quadrants',
                content: "## Quadrant Layout\n\nThe x-axis and y-axis divide the plane into **four quadrants**, numbered anticlockwise:\n\n| Quadrant | Position | Signs of $(x, y)$ | Example |\n|----------|----------|--------------------|---------|\n| **1st** | Top-right | $(+, +)$ | $(3, 2)$ |\n| **2nd** | Top-left | $(-, +)$ | $(-4, 1)$ |\n| **3rd** | Bottom-left | $(-, -)$ | $(-2, -3)$ |\n| **4th** | Bottom-right | $(+, -)$ | $(5, -2)$ |\n\n## Points on the Axes\n\nPoints that lie **on an axis** are not in any quadrant:\n- $(5, 0)$ is on the x-axis\n- $(0, -3)$ is on the y-axis\n- $(0, 0)$ is the origin\n\n## Quick Rule\n\n- Both positive → 1st quadrant\n- $x$ negative, $y$ positive → 2nd quadrant\n- Both negative → 3rd quadrant\n- $x$ positive, $y$ negative → 4th quadrant",
                worked_examples: [
                    {
                        question: "State which quadrant each point lies in: (a) $(7, -3)$ (b) $(-1, -5)$ (c) $(-6, 2)$ (d) $(4, 9)$",
                        steps: [
                            "(a) $(7, -3)$: $x$ positive, $y$ negative → 4th quadrant",
                            "(b) $(-1, -5)$: both negative → 3rd quadrant",
                            "(c) $(-6, 2)$: $x$ negative, $y$ positive → 2nd quadrant",
                            "(d) $(4, 9)$: both positive → 1st quadrant"
                        ],
                        final_answer: "(a) 4th  (b) 3rd  (c) 2nd  (d) 1st quadrant"
                    }
                ]
            },
            {
                title: '4. Simple Linear Graphs',
                content: "## Plotting a Simple Graph\n\nTo draw a graph of a simple equation like $y = 2x + 1$:\n\n1. Create a table of values by choosing $x$-values\n2. Calculate the corresponding $y$-values\n3. Plot the points on the Cartesian plane\n4. Join the points with a straight line (for linear equations)\n5. Label the line with its equation\n\n## Table of Values\n\nFor $y = 2x + 1$:\n\n| $x$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $3$ |\n|-----|------|------|-----|-----|-----|-----|\n| $y$ | $-3$ | $-1$ | $1$ | $3$ | $5$ | $7$ |\n\n## Features of a Straight-Line Graph\n\n- **Gradient (slope)**: How steep the line is\n- **y-intercept**: Where the line crosses the y-axis\n- In $y = mx + c$: $m$ is the gradient and $c$ is the y-intercept",
                worked_examples: [
                    {
                        question: "Complete a table of values for $y = x + 3$ where $x$ goes from $-3$ to $3$, and plot the graph.",
                        steps: [
                            "When $x = -3$: $y = -3 + 3 = 0$",
                            "When $x = -2$: $y = -2 + 3 = 1$",
                            "When $x = -1$: $y = -1 + 3 = 2$",
                            "When $x = 0$: $y = 0 + 3 = 3$",
                            "When $x = 1$: $y = 1 + 3 = 4$",
                            "When $x = 2$: $y = 2 + 3 = 5$",
                            "When $x = 3$: $y = 3 + 3 = 6$",
                            "Plot points: $(-3,0), (-2,1), (-1,2), (0,3), (1,4), (2,5), (3,6)$",
                            "Join with a straight line"
                        ],
                        final_answer: "A straight line passing through $(0, 3)$ with gradient 1"
                    }
                ]
            }
        ],
        key_points: [
            "The Cartesian plane is formed by the x-axis (horizontal) and y-axis (vertical) meeting at the origin $(0,0)$",
            "Coordinates are written as ordered pairs $(x, y)$ — the x-value always comes first",
            "The plane has four quadrants: 1st $(+,+)$, 2nd $(-,+)$, 3rd $(-,-)$, 4th $(+,-)$",
            "Points on an axis are not in any quadrant",
            "Choose an appropriate scale that allows all points to be plotted clearly",
            "Linear equations ($y = mx + c$) produce straight-line graphs"
        ],
        exam_tips: [
            "Always label both axes and mark the scale clearly on graph paper.",
            "Use a sharp pencil and ruler for plotting points and drawing lines.",
            "Read coordinates carefully: $(3, 2)$ is NOT the same as $(2, 3)$.",
            "When plotting, go along the x-axis first (corridor), then up/down the y-axis (stairs).",
            "Choose at least 3 points for a straight line to ensure accuracy.",
            "Points on the axes are commonly tested — remember: on x-axis means $y = 0$, on y-axis means $x = 0$."
        ],
        visual_descriptions: [
            "Labelled Cartesian plane showing all four quadrants with example points in each",
            "Step-by-step diagram showing how to plot the point (3, -2) from the origin",
            "Graph of $y = 2x + 1$ with table of values and plotted points clearly marked"
        ]
    },

    // ============================================
    // TOPIC 13: TRAVEL GRAPHS
    // ============================================
    'Travel Graphs': {
        topic: 'Travel Graphs',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "Travel graphs (distance-time graphs) represent journeys graphically, showing how distance from a starting point changes over time. The ZIMSEC syllabus requires students to interpret travel graphs, calculate speed from the gradient of the graph, identify periods of rest (stationary periods), and solve problems involving multiple travellers. This topic combines graphical skills with understanding of speed, distance, and time.",
        sections: [
            {
                title: '1. Understanding Distance-Time Graphs',
                content: "## What Is a Distance-Time Graph?\n\nA **distance-time graph** shows the distance travelled on the vertical axis (y-axis) and the time taken on the horizontal axis (x-axis).\n\n## Key Features\n\n- **Horizontal line (flat)**: The object is **stationary** (not moving) — distance stays the same\n- **Straight line going up**: The object is moving at a **constant speed** — distance increases steadily\n- **Steeper line**: **Faster** speed\n- **Line going down**: The object is **returning** towards the starting point\n\n## Axes\n\n- x-axis: Time (hours, minutes, or seconds)\n- y-axis: Distance from starting point (km, m, etc.)\n\n## Important Note\n\nA distance-time graph does NOT show the path of the journey — it only shows how far from the start the object is at each moment.",
                worked_examples: [
                    {
                        question: "Describe the journey shown by a distance-time graph with: a line from (0,0) to (2,30), a horizontal line from (2,30) to (3,30), then a line from (3,30) to (5,0).",
                        steps: [
                            "From (0,0) to (2,30): Travels 30 km in 2 hours (moving away from start)",
                            "From (2,30) to (3,30): Distance stays at 30 km for 1 hour (stationary/resting)",
                            "From (3,30) to (5,0): Returns to starting point in 2 hours"
                        ],
                        final_answer: "The person travels 30 km in 2 hours, rests for 1 hour, then returns home in 2 hours"
                    }
                ]
            },
            {
                title: '2. Calculating Speed from Graphs',
                content: "## Speed Formula\n\n$$\\\\text{Speed} = \\\\frac{\\\\text{Distance}}{\\\\text{Time}}$$\n\n## Speed from a Graph\n\nThe **gradient (slope)** of a distance-time graph gives the **speed**.\n\n$$\\\\text{Speed} = \\\\frac{\\\\text{Change in distance}}{\\\\text{Change in time}} = \\\\frac{\\\\Delta d}{\\\\Delta t}$$\n\n## Types of Speed\n\n- **Constant speed**: Straight line on the graph (uniform gradient)\n- **Average speed**: Total distance ÷ Total time\n- **Stationary**: Gradient = 0 (horizontal line), speed = 0\n\n## Units of Speed\n\n- km/h (kilometres per hour) — most common for travel\n- m/s (metres per second) — used in science\n- Conversion: $1 \\\\text{ m/s} = 3.6 \\\\text{ km/h}$",
                worked_examples: [
                    {
                        question: "From a distance-time graph, a cyclist travels from the point (0, 0) to (3, 45). Calculate the speed.",
                        steps: [
                            "Distance = 45 km, Time = 3 hours",
                            "Speed = $\\\\frac{\\\\text{Distance}}{\\\\text{Time}} = \\\\frac{45}{3}$",
                            "Speed = 15 km/h"
                        ],
                        final_answer: "Speed = 15 km/h"
                    },
                    {
                        question: "A car travels 120 km in 1.5 hours, stops for 30 minutes, then travels another 80 km in 1 hour. Find the average speed for the whole journey.",
                        steps: [
                            "Total distance = 120 + 80 = 200 km",
                            "Total time = 1.5 + 0.5 + 1 = 3 hours",
                            "Average speed = $\\\\frac{200}{3} = 66.\\\\overline{6}$ km/h"
                        ],
                        final_answer: "Average speed ≈ 66.7 km/h"
                    }
                ]
            },
            {
                title: '3. Interpreting Travel Graphs',
                content: "## Reading Information from Graphs\n\nFrom a distance-time graph, you can determine:\n\n1. **Distance at any time**: Read across from the time axis to the graph line, then down to the distance axis\n2. **Time at any distance**: Read across from the distance axis to the graph line, then down to the time axis\n3. **Speed during any section**: Calculate the gradient of that section\n4. **Rest periods**: Identify horizontal sections\n5. **Return journey**: Sections where distance decreases\n\n## Comparing Journeys\n\nWhen two journeys are shown on the same graph:\n- **Intersection point**: The two travellers are at the same place at the same time\n- **Steeper gradient**: Faster traveller\n- The horizontal distance between arrival times shows who arrived first",
                worked_examples: [
                    {
                        question: "Two friends start from the same point. Tapfuma walks at 5 km/h. Farai starts 1 hour later and cycles at 15 km/h. After how long does Farai catch up with Tapfuma?",
                        steps: [
                            "In 1 hour, Tapfuma walks $5 \\\\times 1 = 5$ km before Farai starts",
                            "Relative speed of Farai to Tapfuma = $15 - 5 = 10$ km/h",
                            "Time to close 5 km gap = $\\\\frac{5}{10} = 0.5$ hours = 30 minutes",
                            "Farai catches up after cycling for 30 minutes",
                            "Distance from start = $15 \\\\times 0.5 = 7.5$ km"
                        ],
                        final_answer: "Farai catches Tapfuma after 30 minutes (at 7.5 km from the start)"
                    }
                ]
            },
            {
                title: '4. Drawing Travel Graphs',
                content: "## Steps to Draw a Distance-Time Graph\n\n1. Read the problem carefully and identify key events (departure, stops, speed changes)\n2. Set up axes: Time on x-axis, Distance on y-axis\n3. Choose appropriate scales for both axes\n4. Plot key points (start, end of each stage, rest periods)\n5. Connect the points:\n   - Straight lines for constant speed sections\n   - Horizontal lines for rest periods\n6. Label the graph with a title\n\n## Common ZIMSEC Questions\n\n- Draw a distance-time graph from a description\n- Calculate speed for different stages\n- Find average speed for the whole journey\n- Determine when/where two travellers meet\n\n## Speed, Distance, Time Triangle\n\n$$D = S \\\\times T$$\n$$S = \\\\frac{D}{T}$$\n$$T = \\\\frac{D}{S}$$\n\nCover the one you want to find:\n- Cover D: $S \\\\times T$ remains\n- Cover S: $\\\\frac{D}{T}$ remains\n- Cover T: $\\\\frac{D}{S}$ remains",
                worked_examples: [
                    {
                        question: "Munyaradzi leaves home at 08:00 and walks to school 6 km away at 4 km/h. He stays at school until 13:00, then walks home at 6 km/h. Draw a distance-time graph and find the time he arrives home.",
                        steps: [
                            "Time to school = $\\\\frac{6}{4} = 1.5$ hours. Arrives at 09:30",
                            "At school from 09:30 to 13:00 (rest period: horizontal line at 6 km)",
                            "Time to walk home = $\\\\frac{6}{6} = 1$ hour",
                            "Arrives home at 14:00 (distance returns to 0)",
                            "Plot: (08:00, 0) → (09:30, 6) → (13:00, 6) → (14:00, 0)"
                        ],
                        final_answer: "Munyaradzi arrives home at 14:00 (2:00 p.m.)"
                    }
                ]
            }
        ],
        key_points: [
            "Distance-time graphs show distance on the y-axis and time on the x-axis",
            "The gradient (slope) of a distance-time graph gives the speed",
            "A horizontal line means the object is stationary (speed = 0)",
            "Steeper lines indicate faster speeds",
            "A line going downward means the object is returning towards the starting point",
            "Average speed = Total distance ÷ Total time (including rest periods)",
            "Where two graph lines cross, the travellers are at the same place at the same time"
        ],
        exam_tips: [
            "Always use a ruler and sharp pencil when drawing travel graphs.",
            "Label both axes clearly with quantities and units (e.g., 'Time (hours)', 'Distance (km)').",
            "Calculate speed as gradient: rise ÷ run = change in distance ÷ change in time.",
            "For average speed, remember to include rest time in the total time.",
            "When two people meet, find the intersection point of their graph lines.",
            "Read graph values carefully — misreading the scale is a common error in exams."
        ],
        visual_descriptions: [
            "Distance-time graph showing a complete journey: travel, rest, and return with sections labelled",
            "Two distance-time graph lines on the same axes showing where two travellers meet",
            "Speed-Distance-Time triangle diagram showing the three formulas"
        ]
    }
};
