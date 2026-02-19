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
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Form_1_Maths__Number_Concepts.mp4',
                content: "## Number Classifications\n\nIn mathematics, numbers are grouped into different sets based on their properties. Understanding these sets is essential for the entire ZIMSEC O-Level syllabus.\n\n**Natural Numbers (ℕ)**: The counting numbers starting from 1. These are the numbers you first learned to count with.\n$$\\\\mathbb{N} = \\\\{1, 2, 3, 4, 5, ...\\\\}$$\n\n**Whole Numbers (W)**: Natural numbers together with zero. The only difference from natural numbers is the inclusion of 0.\n$$W = \\\\{0, 1, 2, 3, 4, 5, ...\\\\}$$\n\n**Integers (ℤ)**: Whole numbers and their negatives. Integers extend the whole numbers in the negative direction.\n$$\\\\mathbb{Z} = \\\\{..., -3, -2, -1, 0, 1, 2, 3, ...\\\\}$$\n\n**Rational Numbers (ℚ)**: Numbers that can be expressed as a fraction $\\\\frac{a}{b}$ where $a$ and $b$ are integers and $b \\\\neq 0$. This includes:\n- All integers (e.g., $5 = \\\\frac{5}{1}$)\n- Terminating decimals (e.g., $0.75 = \\\\frac{3}{4}$)\n- Recurring decimals (e.g., $0.\\\\overline{3} = \\\\frac{1}{3}$)\n\n**Irrational Numbers**: Numbers that CANNOT be written as a simple fraction. Their decimal forms are non-terminating and non-recurring.\n\nExamples: $\\\\sqrt{2} \\\\approx 1.41421356...$, $\\\\pi \\\\approx 3.14159265...$, $\\\\sqrt{7} \\\\approx 2.6457...$\n\n> **Key Fact**: $\\\\sqrt{n}$ is rational ONLY when $n$ is a perfect square (1, 4, 9, 16, 25, ...). Otherwise it is irrational.\n\n**Real Numbers (ℝ)**: The set of ALL rational and irrational numbers together.\n\n## Relationship Between Number Sets\n\nThe number sets form a hierarchy where each set is contained within the next:\n$$\\\\mathbb{N} \\\\subset W \\\\subset \\\\mathbb{Z} \\\\subset \\\\mathbb{Q} \\\\subset \\\\mathbb{R}$$\n\nThis means:\n- Every natural number is also a whole number, an integer, a rational number, and a real number\n- Every whole number is an integer, rational, and real\n- Every integer is rational and real\n- Every rational number is real\n- Irrational numbers are real but NOT rational\n\n## Converting a Recurring Decimal to a Fraction\n\nTo show that a recurring decimal is rational, convert it to a fraction:\n\nFor $0.\\\\overline{3} = 0.333...$:\n- Let $x = 0.333...$\n- $10x = 3.333...$\n- $10x - x = 3.333... - 0.333...$\n- $9x = 3$\n- $x = \\\\frac{3}{9} = \\\\frac{1}{3}$",
                worked_examples: [
                    {
                        question: "Classify each of the following numbers: $-5$, $\\\\frac{2}{3}$, $\\\\sqrt{9}$, $\\\\pi$, $0$, $3.\\\\overline{7}$",
                        steps: [
                            "$-5$: This is a negative whole number → **Integer** (also rational since $-5 = \\\\frac{-5}{1}$)",
                            "$\\\\frac{2}{3}$: Written as a fraction of two integers → **Rational number**",
                            "$\\\\sqrt{9} = 3$: 9 is a perfect square, so its root is a whole number → **Natural number** (also whole, integer, rational)",
                            "$\\\\pi = 3.14159...$: Non-terminating, non-recurring decimal → **Irrational number**",
                            "$0$: Zero is a whole number but NOT a natural number → **Whole number** (also integer, rational)",
                            "$3.\\\\overline{7} = 3.777...$: Recurring decimal → **Rational number** (it equals $\\\\frac{34}{9}$)"
                        ],
                        final_answer: "$-5$ (integer), $\\\\frac{2}{3}$ (rational), $\\\\sqrt{9}$ (natural), $\\\\pi$ (irrational), $0$ (whole), $3.\\\\overline{7}$ (rational)"
                    },
                    {
                        question: "Convert the recurring decimal $0.\\\\overline{27}$ to a fraction in its simplest form.",
                        steps: [
                            "Let $x = 0.272727...$",
                            "Since the repeating block has 2 digits, multiply by $100$:",
                            "$100x = 27.272727...$",
                            "Subtract: $100x - x = 27.2727... - 0.2727...$",
                            "$99x = 27$",
                            "$x = \\\\frac{27}{99}$",
                            "Simplify by dividing both by H.C.F. (9): $x = \\\\frac{3}{11}$"
                        ],
                        final_answer: "$0.\\\\overline{27} = \\\\frac{3}{11}$"
                    }
                ]
            },
            {
                title: '2. Factors and Multiples',
                content: "## Factors\n\nA **factor** of a number divides into it exactly with no remainder. Every number has at least two factors: 1 and itself.\n\n### Finding Factors Systematically\n\nTo find ALL factors of a number, test divisibility starting from 1 and work upwards. Factors always come in **pairs** that multiply to give the number. Stop testing when you reach $\\\\sqrt{n}$ because after this point, the pairs start repeating.\n\nFor example, for 36:\n$$1 \\\\times 36, \\\\quad 2 \\\\times 18, \\\\quad 3 \\\\times 12, \\\\quad 4 \\\\times 9, \\\\quad 6 \\\\times 6$$\nFactors of $36 = \\\\{1, 2, 3, 4, 6, 9, 12, 18, 36\\\\}$\n\n## Multiples\n\nA **multiple** of a number is obtained by multiplying it by any natural number. Multiples go on forever.\n\nMultiples of 7: $7, 14, 21, 28, 35, 42, ...$\n\n> **Quick Test**: $a$ is a multiple of $b$ if $a \\\\div b$ gives a whole number.\n\n## Prime and Composite Numbers\n\nA **prime number** has exactly two factors: 1 and itself.\n\nPrimes up to 50: $2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47$\n\nA **composite number** has more than two factors.\n\n> **Important**: $1$ is NEITHER prime NOR composite (it has only one factor). $2$ is the only even prime number.\n\n## Prime Factorisation\n\nEvery composite number can be written as a unique product of prime factors. This is called the **Fundamental Theorem of Arithmetic**.\n\n### Method 1: Repeated Division\nDivide by the smallest prime that goes in, and repeat until you reach 1.\n\n### Method 2: Factor Tree\nBreak the number into any two factors, then continue breaking each factor until all branches end in primes.\n\n## Divisibility Rules\n\n| Divisible by | Rule |\n|-------------|------|\n| 2 | Last digit is even (0, 2, 4, 6, 8) |\n| 3 | Sum of digits is divisible by 3 |\n| 4 | Last two digits form a number divisible by 4 |\n| 5 | Last digit is 0 or 5 |\n| 6 | Divisible by both 2 and 3 |\n| 9 | Sum of digits is divisible by 9 |\n| 10 | Last digit is 0 |",
                worked_examples: [
                    {
                        question: "Find all the factors of 72.",
                        steps: [
                            "Test from 1 upwards, finding factor pairs:",
                            "$1 \\\\times 72 = 72$ ✓ → factors: 1, 72",
                            "$2 \\\\times 36 = 72$ ✓ → factors: 2, 36",
                            "$3 \\\\times 24 = 72$ ✓ → factors: 3, 24",
                            "$4 \\\\times 18 = 72$ ✓ → factors: 4, 18",
                            "$6 \\\\times 12 = 72$ ✓ → factors: 6, 12",
                            "$8 \\\\times 9 = 72$ ✓ → factors: 8, 9",
                            "Stop: $\\\\sqrt{72} \\\\approx 8.5$, so we've found all pairs"
                        ],
                        final_answer: "Factors of 72: $\\\\{1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72\\\\}$ — that is 12 factors"
                    },
                    {
                        question: "Express 360 as a product of prime factors in index form.",
                        steps: [
                            "$360 \\\\div 2 = 180$",
                            "$180 \\\\div 2 = 90$",
                            "$90 \\\\div 2 = 45$",
                            "$45 \\\\div 3 = 15$",
                            "$15 \\\\div 3 = 5$",
                            "$5 \\\\div 5 = 1$ ← stop",
                            "Collecting primes: $2 \\\\times 2 \\\\times 2 \\\\times 3 \\\\times 3 \\\\times 5$",
                            "Writing in index form: $2^3 \\\\times 3^2 \\\\times 5$"
                        ],
                        final_answer: "$360 = 2^3 \\\\times 3^2 \\\\times 5$"
                    },
                    {
                        question: "Is 91 a prime number? Explain.",
                        steps: [
                            "Test primes up to $\\\\sqrt{91} \\\\approx 9.5$, so test 2, 3, 5, 7",
                            "$91 \\\\div 2 = 45.5$ — not exact",
                            "$91 \\\\div 3 = 30.33...$ — not exact",
                            "$91 \\\\div 5 = 18.2$ — not exact",
                            "$91 \\\\div 7 = 13$ — exact! So $91 = 7 \\\\times 13$"
                        ],
                        final_answer: "$91$ is NOT prime. $91 = 7 \\\\times 13$"
                    }
                ]
            },
            {
                title: '3. H.C.F. and L.C.M.',
                content: "## Highest Common Factor (H.C.F.)\n\nThe **H.C.F.** (also called **G.C.D.** — Greatest Common Divisor) is the **largest** number that divides exactly into two or more numbers.\n\n### Method: Prime Factorisation\n1. Prime factorise each number\n2. Identify the **common** prime factors\n3. Take the **lowest power** of each common prime\n4. Multiply them together\n\n> **Memory Aid**: H.C.F. = **Common** factors, **Lowest** powers\n\n## Lowest Common Multiple (L.C.M.)\n\nThe **L.C.M.** is the **smallest** number that is a multiple of two or more given numbers.\n\n### Method: Prime Factorisation\n1. Prime factorise each number\n2. Take **all** prime factors that appear in either number\n3. Use the **highest power** of each\n4. Multiply them together\n\n> **Memory Aid**: L.C.M. = **All** factors, **Highest** powers\n\n## Useful Identity\n\nFor any two numbers $a$ and $b$:\n$$\\\\text{H.C.F.}(a, b) \\\\times \\\\text{L.C.M.}(a, b) = a \\\\times b$$\n\nThis identity is extremely useful for checking your answers or finding one value when you know the other.\n\n## When to Use Which\n\n| Use H.C.F. when... | Use L.C.M. when... |\n|---------------------|---------------------|\n| Dividing into equal groups | Finding common time intervals |\n| Finding the largest tile to fit | Finding common denominators |\n| Simplifying fractions | Synchronising events |\n| Cutting items into equal pieces | Finding the smallest shared quantity |\n\n## Step-by-Step Layout (Exam Format)\n\nAlways present your working in this clear format:\n\n$$\\\\text{Step 1: } 48 = 2^4 \\\\times 3$$\n$$\\\\text{Step 2: } 60 = 2^2 \\\\times 3 \\\\times 5$$\n$$\\\\text{H.C.F.} = 2^2 \\\\times 3 = 12$$\n$$\\\\text{L.C.M.} = 2^4 \\\\times 3 \\\\times 5 = 240$$",
                worked_examples: [
                    {
                        question: "Find the H.C.F. and L.C.M. of 48 and 60.",
                        steps: [
                            "**Step 1**: Prime factorise $48$: $48 = 2 \\\\times 24 = 2 \\\\times 2 \\\\times 12 = 2 \\\\times 2 \\\\times 2 \\\\times 6 = 2 \\\\times 2 \\\\times 2 \\\\times 2 \\\\times 3$",
                            "So $48 = 2^4 \\\\times 3$",
                            "**Step 2**: Prime factorise $60$: $60 = 2 \\\\times 30 = 2 \\\\times 2 \\\\times 15 = 2 \\\\times 2 \\\\times 3 \\\\times 5$",
                            "So $60 = 2^2 \\\\times 3 \\\\times 5$",
                            "**H.C.F.**: Common primes ($2$ and $3$) with lowest powers: $2^2 \\\\times 3 = 4 \\\\times 3 = 12$",
                            "**L.C.M.**: All primes ($2$, $3$, $5$) with highest powers: $2^4 \\\\times 3 \\\\times 5 = 16 \\\\times 3 \\\\times 5 = 240$",
                            "**Check**: $\\\\text{H.C.F.} \\\\times \\\\text{L.C.M.} = 12 \\\\times 240 = 2880 = 48 \\\\times 60$ ✓"
                        ],
                        final_answer: "H.C.F. = $12$, L.C.M. = $240$"
                    },
                    {
                        question: "Find the H.C.F. and L.C.M. of 84, 120, and 180.",
                        steps: [
                            "$84 = 2^2 \\\\times 3 \\\\times 7$",
                            "$120 = 2^3 \\\\times 3 \\\\times 5$",
                            "$180 = 2^2 \\\\times 3^2 \\\\times 5$",
                            "**H.C.F.**: Common primes are $2$ and $3$ only (7 and 5 are not in all three)",
                            "Lowest powers: $2^2 \\\\times 3 = 4 \\\\times 3 = 12$",
                            "**L.C.M.**: All primes: $2, 3, 5, 7$. Highest powers: $2^3 \\\\times 3^2 \\\\times 5 \\\\times 7$",
                            "$= 8 \\\\times 9 \\\\times 5 \\\\times 7 = 2520$"
                        ],
                        final_answer: "H.C.F. = $12$, L.C.M. = $2520$"
                    },
                    {
                        question: "Two bells ring at intervals of 12 minutes and 18 minutes. If they ring together at 8:00 AM, when will they next ring together?",
                        steps: [
                            "This is an L.C.M. problem — we need the smallest time that is a multiple of both 12 and 18",
                            "$12 = 2^2 \\\\times 3$",
                            "$18 = 2 \\\\times 3^2$",
                            "$\\\\text{L.C.M.} = 2^2 \\\\times 3^2 = 4 \\\\times 9 = 36$ minutes",
                            "36 minutes after 8:00 AM = 8:36 AM"
                        ],
                        final_answer: "They next ring together at **8:36 AM**"
                    }
                ]
            },
            {
                title: '4. Directed Numbers',
                content: "## What Are Directed Numbers?\n\nDirected numbers are numbers with a positive (+) or negative (−) sign, showing direction or value relative to zero on a number line.\n\n## Real-Life Examples\n- **Temperature**: $-5°C$ means 5 degrees below zero\n- **Bank balance**: $-\\$200$ means an overdraft of \\$200\n- **Altitude**: $-50$ m means 50 metres below sea level\n- **Profit/Loss**: $-\\$1500$ means a loss of \\$1500\n\n## The Number Line\n\nOn the number line, numbers increase as you move **right** and decrease as you move **left**. Zero is the reference point separating positive and negative numbers.\n\n$$...\\quad -4 \\quad -3 \\quad -2 \\quad -1 \\quad 0 \\quad 1 \\quad 2 \\quad 3 \\quad 4 \\quad ...$$\n\n> **Key Fact**: Any positive number is always greater than any negative number. For negative numbers, the one closer to zero is greater: $-2 > -5$.\n\n## Rules for Addition and Subtraction\n\n**Adding two positive numbers**: Add normally → positive result\n$$3 + 5 = 8$$\n\n**Adding two negative numbers**: Add the values → negative result\n$$(-3) + (-5) = -8$$\n\n**Adding numbers with different signs**: Subtract the smaller value from the larger → take the sign of the number with the larger value\n$$(-7) + 4 = -3 \\quad \\text{(7 is larger, so answer is negative)}$$\n$$8 + (-3) = 5 \\quad \\text{(8 is larger, so answer is positive)}$$\n\n**Subtracting a negative**: Change to addition (two negatives make a positive)\n$$5 - (-3) = 5 + 3 = 8$$\n\n## Rules for Multiplication and Division\n\n| Operation | Result | Example |\n|-----------|--------|--------|\n| $(+) \\\\times (+)$ | $+$ | $3 \\\\times 4 = 12$ |\n| $(-) \\\\times (-)$ | $+$ | $(-3) \\\\times (-4) = 12$ |\n| $(+) \\\\times (-)$ | $-$ | $3 \\\\times (-4) = -12$ |\n| $(-) \\\\times (+)$ | $-$ | $(-3) \\\\times 4 = -12$ |\n\nThe same rules apply for division.\n\n> **Simple Rule**: **Same signs → positive result. Different signs → negative result.**",
                worked_examples: [
                    {
                        question: "Calculate: $(-8) \\\\times 3 + (-12) \\\\div (-4)$",
                        steps: [
                            "Apply BODMAS: multiplication and division before addition",
                            "$(-8) \\\\times 3 = -24$ (different signs → negative)",
                            "$(-12) \\\\div (-4) = 3$ (same signs → positive)",
                            "Now add: $-24 + 3 = -21$"
                        ],
                        final_answer: "$-21$"
                    },
                    {
                        question: "The temperature in Nyanga was $-3°C$ at midnight. By noon it had risen by $11°C$. What was the noon temperature?",
                        steps: [
                            "Starting temperature: $-3°C$",
                            "Rise of $11°C$ means we add 11",
                            "$-3 + 11 = 8$"
                        ],
                        final_answer: "The noon temperature was $8°C$"
                    },
                    {
                        question: "Arrange in ascending order: $3, -7, 0, -2, 5, -5, 1$",
                        steps: [
                            "Place on a number line from left (smallest) to right (largest)",
                            "Most negative first: $-7$ is the smallest",
                            "Then $-5$, then $-2$, then $0$, then $1$, then $3$, then $5$"
                        ],
                        final_answer: "$-7, -5, -2, 0, 1, 3, 5$"
                    },
                    {
                        question: "Evaluate: $(-2)^3 \\\\times (-3) - (-4)^2$",
                        steps: [
                            "Calculate powers first (BODMAS — Orders):",
                            "$(-2)^3 = (-2) \\\\times (-2) \\\\times (-2) = 4 \\\\times (-2) = -8$",
                            "$(-4)^2 = (-4) \\\\times (-4) = 16$",
                            "Now: $(-8) \\\\times (-3) - 16$",
                            "Multiplication: $(-8) \\\\times (-3) = 24$ (same signs → positive)",
                            "Subtraction: $24 - 16 = 8$"
                        ],
                        final_answer: "$8$"
                    }
                ]
            },
            {
                title: '5. Operations with Fractions',
                content: "## Types of Fractions\n\n- **Proper fraction**: numerator < denominator, e.g., $\\\\frac{3}{7}$ (value is less than 1)\n- **Improper fraction**: numerator ≥ denominator, e.g., $\\\\frac{9}{4}$ (value is 1 or more)\n- **Mixed number**: whole number + fraction, e.g., $2\\\\frac{1}{3}$\n\n### Converting Between Mixed Numbers and Improper Fractions\n\n**Mixed → Improper**: Multiply whole number by denominator, add numerator:\n$$2\\\\frac{3}{5} = \\\\frac{(2 \\\\times 5) + 3}{5} = \\\\frac{13}{5}$$\n\n**Improper → Mixed**: Divide numerator by denominator:\n$$\\\\frac{17}{4} = 4 \\\\text{ remainder } 1 = 4\\\\frac{1}{4}$$\n\n## Addition and Subtraction\n\n1. Find the **Lowest Common Denominator (LCD)**\n2. Convert each fraction to an equivalent fraction with the LCD\n3. Add or subtract the numerators\n4. Simplify if needed\n\n$$\\\\frac{2}{3} + \\\\frac{3}{5} = \\\\frac{10}{15} + \\\\frac{9}{15} = \\\\frac{19}{15} = 1\\\\frac{4}{15}$$\n\n## Multiplication\n\nMultiply numerators together and denominators together. **Cancel common factors first** to simplify your working.\n$$\\\\frac{a}{b} \\\\times \\\\frac{c}{d} = \\\\frac{a \\\\times c}{b \\\\times d}$$\n\n## Division\n\n**KCF method** — Keep the first fraction, Change ÷ to ×, Flip the second fraction:\n$$\\\\frac{a}{b} \\\\div \\\\frac{c}{d} = \\\\frac{a}{b} \\\\times \\\\frac{d}{c}$$\n\n## Simplifying Fractions\n\nTo simplify (reduce) a fraction, divide numerator and denominator by their H.C.F.:\n$$\\\\frac{24}{36} = \\\\frac{24 \\\\div 12}{36 \\\\div 12} = \\\\frac{2}{3}$$",
                worked_examples: [
                    {
                        question: "Calculate $2\\\\frac{1}{4} + 1\\\\frac{2}{3}$.",
                        steps: [
                            "Convert to improper fractions: $2\\\\frac{1}{4} = \\\\frac{9}{4}$ and $1\\\\frac{2}{3} = \\\\frac{5}{3}$",
                            "Find the LCD of 4 and 3 → LCD = 12",
                            "$\\\\frac{9}{4} = \\\\frac{9 \\\\times 3}{4 \\\\times 3} = \\\\frac{27}{12}$",
                            "$\\\\frac{5}{3} = \\\\frac{5 \\\\times 4}{3 \\\\times 4} = \\\\frac{20}{12}$",
                            "$\\\\frac{27}{12} + \\\\frac{20}{12} = \\\\frac{47}{12}$",
                            "Convert back: $47 \\\\div 12 = 3$ remainder $11$, so $\\\\frac{47}{12} = 3\\\\frac{11}{12}$"
                        ],
                        final_answer: "$3\\\\frac{11}{12}$"
                    },
                    {
                        question: "Calculate $\\\\frac{3}{5} \\\\times \\\\frac{10}{9}$.",
                        steps: [
                            "Before multiplying, cancel common factors between numerators and denominators:",
                            "$3$ and $9$ share factor $3$: cancel to get $1$ and $3$",
                            "$10$ and $5$ share factor $5$: cancel to get $2$ and $1$",
                            "Multiply: $\\\\frac{1}{1} \\\\times \\\\frac{2}{3} = \\\\frac{2}{3}$"
                        ],
                        final_answer: "$\\\\frac{2}{3}$"
                    },
                    {
                        question: "A recipe needs $2\\\\frac{1}{2}$ cups of flour. If you want to make $\\\\frac{3}{4}$ of the recipe, how much flour do you need?",
                        steps: [
                            "We need $\\\\frac{3}{4}$ of $2\\\\frac{1}{2}$ cups",
                            "Convert: $2\\\\frac{1}{2} = \\\\frac{5}{2}$",
                            "Multiply: $\\\\frac{3}{4} \\\\times \\\\frac{5}{2} = \\\\frac{15}{8}$",
                            "Convert: $\\\\frac{15}{8} = 1\\\\frac{7}{8}$"
                        ],
                        final_answer: "You need $1\\\\frac{7}{8}$ cups of flour"
                    }
                ]
            },
            {
                title: '6. Decimals and Percentages',
                content: "## Decimal Operations\n\nDecimals follow the same rules as whole numbers but you must **align the decimal points** for addition and subtraction.\n\n### Multiplication of Decimals\nMultiply as whole numbers, then count the total number of decimal places in both numbers combined:\n$$0.3 \\\\times 0.4 = 0.12 \\\\text{ (1 d.p. + 1 d.p. = 2 d.p.)}$$\n$$2.5 \\\\times 0.03 = 0.075 \\\\text{ (1 d.p. + 2 d.p. = 3 d.p.)}$$\n\n### Division of Decimals\nMake the divisor a whole number by multiplying both numbers by the same power of 10:\n$$1.44 \\\\div 0.12 = \\\\frac{1.44 \\\\times 100}{0.12 \\\\times 100} = 144 \\\\div 12 = 12$$\n\n## Converting Between Forms\n\n| Fraction | Decimal | Percentage |\n|----------|---------|------------|\n| $\\\\frac{1}{2}$ | $0.5$ | $50\\\\%$ |\n| $\\\\frac{1}{4}$ | $0.25$ | $25\\\\%$ |\n| $\\\\frac{3}{4}$ | $0.75$ | $75\\\\%$ |\n| $\\\\frac{1}{5}$ | $0.2$ | $20\\\\%$ |\n| $\\\\frac{1}{8}$ | $0.125$ | $12.5\\\\%$ |\n| $\\\\frac{1}{3}$ | $0.\\\\overline{3}$ | $33\\\\frac{1}{3}\\\\%$ |\n| $\\\\frac{2}{3}$ | $0.\\\\overline{6}$ | $66\\\\frac{2}{3}\\\\%$ |\n\n### Conversion Methods\n- **Fraction → Decimal**: Divide numerator by denominator\n- **Decimal → Percentage**: Multiply by 100\n- **Percentage → Fraction**: Write over 100 and simplify\n\n## Percentage Calculations\n\n- **Finding a percentage of a quantity**: $\\\\frac{\\\\text{percentage}}{100} \\\\times \\\\text{quantity}$\n- **Expressing as a percentage**: $\\\\frac{\\\\text{part}}{\\\\text{whole}} \\\\times 100\\\\%$\n- **Percentage increase**: $\\\\text{new} = \\\\text{original} \\\\times \\\\left(1 + \\\\frac{\\\\%}{100}\\\\right)$\n- **Percentage decrease**: $\\\\text{new} = \\\\text{original} \\\\times \\\\left(1 - \\\\frac{\\\\%}{100}\\\\right)$\n- **Percentage change**: $\\\\frac{\\\\text{change}}{\\\\text{original}} \\\\times 100\\\\%$",
                worked_examples: [
                    {
                        question: "A school has 840 students. If 55% are girls, how many boys are there?",
                        steps: [
                            "Percentage of boys = $100\\\\% - 55\\\\% = 45\\\\%$",
                            "Number of boys = $\\\\frac{45}{100} \\\\times 840$",
                            "$= 0.45 \\\\times 840 = 378$"
                        ],
                        final_answer: "There are **378 boys**"
                    },
                    {
                        question: "A shirt originally costs \\$250. It is reduced by 15%. Find the sale price.",
                        steps: [
                            "Discount amount = $\\\\frac{15}{100} \\\\times 250 = \\\\$37.50$",
                            "Sale price = $\\\\$250 - \\\\$37.50 = \\\\$212.50$",
                            "Alternative: Sale price = $250 \\\\times 0.85 = \\\\$212.50$"
                        ],
                        final_answer: "The sale price is **\\$212.50**"
                    },
                    {
                        question: "A population grew from 2400 to 2760. What is the percentage increase?",
                        steps: [
                            "Change = $2760 - 2400 = 360$",
                            "Percentage increase = $\\\\frac{\\\\text{change}}{\\\\text{original}} \\\\times 100\\\\%$",
                            "$= \\\\frac{360}{2400} \\\\times 100\\\\% = 15\\\\%$"
                        ],
                        final_answer: "The percentage increase is **15%**"
                    }
                ]
            },
            {
                title: '7. Order of Operations (BODMAS)',
                content: "## BODMAS Rule\n\nWhen a calculation has more than one operation, you MUST follow this order:\n\n| Letter | Meaning | Example |\n|--------|---------|----------|\n| **B** | Brackets (all types) | $(3 + 2)$, $[4 - 1]$ |\n| **O** | Orders (powers, roots) | $2^3 = 8$, $\\\\sqrt{9} = 3$ |\n| **D** | Division | $12 \\\\div 3 = 4$ |\n| **M** | Multiplication | $4 \\\\times 5 = 20$ |\n| **A** | Addition | $3 + 7 = 10$ |\n| **S** | Subtraction | $10 - 4 = 6$ |\n\n> **Important**: Division and Multiplication have **equal priority** — work left to right. Addition and Subtraction also have **equal priority** — work left to right.\n\n## Nested Brackets\n\nWhen there are brackets inside brackets, work from the **innermost** brackets outward:\n$$2 \\\\times [3 + (4 \\\\times 2)] = 2 \\\\times [3 + 8] = 2 \\\\times 11 = 22$$\n\n## Common Mistakes to Avoid\n\n- **Wrong**: $2 + 3 \\\\times 4 = 20$ (adding before multiplying)\n- **Correct**: $2 + 3 \\\\times 4 = 2 + 12 = 14$ (multiply first)\n\n- **Wrong**: $24 \\\\div 6 \\\\times 2 = 24 \\\\div 12 = 2$ (doing multiplication before division)\n- **Correct**: $24 \\\\div 6 \\\\times 2 = 4 \\\\times 2 = 8$ (left to right, they have equal priority)",
                worked_examples: [
                    {
                        question: "Evaluate: $18 - 2 \\\\times (3 + 4) + 6 \\\\div 3$",
                        steps: [
                            "**Brackets** first: $3 + 4 = 7$",
                            "Expression becomes: $18 - 2 \\\\times 7 + 6 \\\\div 3$",
                            "**Multiplication**: $2 \\\\times 7 = 14$",
                            "**Division**: $6 \\\\div 3 = 2$",
                            "**Left to right**: $18 - 14 + 2 = 4 + 2 = 6$"
                        ],
                        final_answer: "$6$"
                    },
                    {
                        question: "Evaluate: $\\\\frac{8 + 4 \\\\times 3}{2^2 + 1}$",
                        steps: [
                            "Treat the fraction bar as a bracket — evaluate top and bottom separately",
                            "**Numerator**: $8 + 4 \\\\times 3 = 8 + 12 = 20$ (multiply before adding)",
                            "**Denominator**: $2^2 + 1 = 4 + 1 = 5$ (orders before adding)",
                            "**Divide**: $\\\\frac{20}{5} = 4$"
                        ],
                        final_answer: "$4$"
                    },
                    {
                        question: "Evaluate: $5 + 2 \\\\times [12 - (3 + 4)^2 \\\\div 7]$",
                        steps: [
                            "**Innermost brackets**: $3 + 4 = 7$",
                            "**Orders**: $7^2 = 49$",
                            "**Division inside square brackets**: $49 \\\\div 7 = 7$",
                            "**Subtraction inside square brackets**: $12 - 7 = 5$",
                            "**Multiplication**: $2 \\\\times 5 = 10$",
                            "**Addition**: $5 + 10 = 15$"
                        ],
                        final_answer: "$15$"
                    }
                ]
            }
        ],
        key_points: [
            "Natural numbers start from 1; whole numbers include 0; integers include negatives",
            "Rational numbers can be expressed as fractions $\\\\frac{a}{b}$; irrational numbers have non-terminating, non-recurring decimals",
            "$\\\\sqrt{n}$ is rational only when $n$ is a perfect square",
            "To convert a recurring decimal to a fraction, use the algebraic method (let $x = ...$, multiply, subtract)",
            "H.C.F. uses **common** primes with **lowest** powers; L.C.M. uses **all** primes with **highest** powers",
            "The identity $\\\\text{H.C.F.} \\\\times \\\\text{L.C.M.} = a \\\\times b$ is useful for checking answers",
            "Directed numbers: same signs multiply/divide to give positive; different signs give negative",
            "For fractions: LCD for adding/subtracting, KCF (Keep-Change-Flip) for dividing",
            "BODMAS gives the correct order of operations — D and M have equal priority; A and S have equal priority",
            "Percentage change = $\\\\frac{\\\\text{change}}{\\\\text{original}} \\\\times 100\\\\%$ — always divide by the ORIGINAL value",
            "Always simplify fractions to their lowest terms using the H.C.F. of numerator and denominator"
        ],
        exam_tips: [
            "Show all working for H.C.F. and L.C.M. using prime factorisation — examiners award method marks even if the final answer is wrong.",
            "When classifying numbers, remember: $\\\\sqrt{4} = 2$ is rational, but $\\\\sqrt{3}$ is irrational. Always simplify square roots before deciding.",
            "For directed numbers, write out the sign rules before calculating to avoid careless errors.",
            "In BODMAS, multiplication and division have equal priority — always work left to right, never assume multiplication comes first.",
            "Always check fraction answers are in their simplest form. Marks are deducted for unsimplified answers.",
            "Use the identity $\\\\text{H.C.F.} \\\\times \\\\text{L.C.M.} = a \\\\times b$ to verify your H.C.F. and L.C.M. answers.",
            "For percentage problems, read carefully: 'of' means multiply, 'is' means equals. Identify which value is the original.",
            "When converting mixed numbers to improper fractions, double-check: multiply whole × denominator + numerator.",
            "In exam questions, always state the final answer clearly and include units where applicable."
        ],
        visual_descriptions: [
            "Number line showing integers from -5 to 5 with arrows indicating positive and negative directions",
            "Venn diagram showing the relationship: Natural ⊂ Whole ⊂ Integers ⊂ Rational ⊂ Real numbers",
            "Factor tree diagram breaking 360 into its prime factors: $2^3 \\\\times 3^2 \\\\times 5$"
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
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Approximation_%26_Estimation.mp4',
                content: "## What is Rounding?\n\nRounding means replacing a number with a simpler value that is close to the original. This makes numbers easier to work with in your head.\n\n## The General Rule\n\n1. **Identify** the digit in the place you are rounding to.\n2. **Look** at the next digit to the right (the \"decider\").\n3. **Decide**:\n   - If the decider is **5 or more** (5, 6, 7, 8, 9), round **UP** (add 1 to the identified digit).\n   - If the decider is **less than 5** (0, 1, 2, 3, 4), round **DOWN** (keep the identified digit the same).\n4. **Replace** all digits to the right with zeros (for whole numbers).\n\n## Place Values Refresher\n\n| ... | Thousands | Hundreds | Tens | Units | . | Tenths | Hundredths |\n|-----|-----------|----------|------|-------|---|--------|-----------|\n| ... | 1000 | 100 | 10 | 1 | . | 0.1 | 0.01 |\n\n## Special Case: Rounding 9s\n\nIf you need to round up a 9, it becomes a 10. This carries over to the next column to the left.\n\nExample: Round **296** to the nearest 10.\n- Digit in tens column: **9**\n- Decider: **6** (round up)\n- Add 1 to 9 → 10. Write 0, carry 1 to the hundreds.\n- $2 + 1 = 3$.\n- Result: **300**.",
                worked_examples: [
                    {
                        question: "Round 6,749 to the nearest (a) thousand, (b) hundred, (c) ten.",
                        steps: [
                            "(a) **Nearest thousand**: The digit is 6. Next is 7 (round up).",
                            "$6,749 \\\\approx 7,000$",
                            "(b) **Nearest hundred**: The digit is 7. Next is 4 (round down).",
                            "$6,749 \\\\approx 6,700$",
                            "(c) **Nearest ten**: The digit is 4. Next is 9 (round up).",
                            "$6,749 \\\\approx 6,750$"
                        ],
                        final_answer: "(a) 7,000  (b) 6,700  (c) 6,750"
                    },
                    {
                        question: "Round 19,997 to the nearest ten.",
                        steps: [
                            "Digit in tens place: **9**",
                            "Next digit (units): **7** (5 or more, so round UP)",
                            "Add 1 to the 9 in the tens column → becomes 10 (write 0, carry 1)",
                            "Add 1 to the 9 in the hundreds column → becomes 10 (write 0, carry 1)",
                            "Add 1 to the 9 in the thousands column → becomes 10 (write 0, carry 1)",
                            "Add 1 to the 1 in the ten-thousands column → 2"
                        ],
                        final_answer: "20,000"
                    }
                ]
            },
            {
                title: '2. Rounding to Decimal Places',
                content: "## Decimal Places (d.p.)\n\nThe number of decimal places is simply the number of digits appearing **after** the decimal point.\n\n## Method\n\n1. Count digits after the decimal point up to the required number.\n2. Look at the **next** digit.\n3. Apply the rounding rule (5 or more UP, less than 5 DOWN).\n4. **Drop** all extra digits after your cut-off point.\n\n## Examples\n\n$3.14159$ rounded to:\n- **1 d.p.**: $3.1$ (next is 4, round down)\n- **2 d.p.**: $3.14$ (next is 1, round down)\n- **3 d.p.**: $3.142$ (next is 5, round up)\n\n## Important Note on Trailing Zeros\n\nIf you round to 2 d.p. and the answer is $4.50$, you **MUST** keep the zero. Writing just $4.5$ is wrong because it looks like 1 d.p.\n\n- Correct: $4.50$ (2 d.p.)\n- Incorrect: $4.5$ (1 d.p.)",
                worked_examples: [
                    {
                        question: "Round 12.8964 to (a) 1 decimal place (b) 2 decimal places.",
                        steps: [
                            "(a) **1 d.p.**: Cut off after the 8.",
                            "Next digit is 9 (round up).",
                            "Add 1 to 8 to get 9.",
                            "$12.8964 \\\\approx 12.9$",
                            "(b) **2 d.p.**: Cut off after the 9.",
                            "Next digit is 6 (round up).",
                            "Add 1 to 9 to get 10. Write 0, carry 1 to the 8.",
                            "$8 + 1 = 9$.",
                            "$12.8964 \\\\approx 12.90$"
                        ],
                        final_answer: "(a) 12.9  (b) 12.90"
                    },
                    {
                        question: "Calculate $5 \\\\div 7$ and give the answer correct to 3 decimal places.",
                        steps: [
                            "Calculator display: $0.714285714...$",
                            "Count 3 digits after decimal: $0.714$",
                            "Look at the 4th digit: **2**",
                            "Since 2 < 5, we round down (keep it as is).",
                            "Answer: $0.714$"
                        ],
                        final_answer: "$0.714$"
                    }
                ]
            },
            {
                title: '3. Significant Figures (s.f.)',
                content: "## What Are Significant Figures?\n\nSignificant figures indicate the precision of a number. They differ from decimal places because they count digits from the **start** of the number's value, not just after the decimal point.\n\n## The Rules for Counting s.f.\n\n1. **Non-zero digits are ALWAYS significant**.\n   - $457$ has 3 s.f.\n\n2. **Zeros BETWEEN non-zero digits are significant**.\n   - $405$ has 3 s.f.\n   - $3009$ has 4 s.f.\n\n3. **Leading zeros are NEVER significant**.\n   - $0.007$ has 1 s.f.\n   - $0.052$ has 2 s.f.\n   (They just show the magnitude of the number).\n\n4. **Trailing zeros AFTER a decimal point are significant**.\n   - $4.50$ has 3 s.f.\n   - $8.000$ has 4 s.f.\n\n5. **Trailing zeros in a whole number are usually NOT significant** (unless specified).\n   - $4000$ could be 1, 2, 3, or 4 s.f., but usually we assume 1 s.f.\n\n## Comparison: d.p. vs s.f.\n\n| Number | Round to 2 d.p. | Round to 2 s.f. |\n|--------|-----------------|-----------------|\n| $34.567$ | $34.57$ | $35$ |\n| $0.00459$ | $0.00$ | $0.0046$ |\n| $8.996$ | $9.00$ | $9.0$ |",
                worked_examples: [
                    {
                        question: "Round the following to 3 significant figures: (a) 45,678  (b) 0.0034567  (c) 0.9997",
                        steps: [
                            "(a) **45,678**: First 3 s.f. are 4, 5, 6. Next is 7 (round up).",
                            "$45,700$",
                            "(b) **0.0034567**: Leading zeros ignored. First 3 s.f. are 3, 4, 5. Next is 6 (round up).",
                            "$0.00346$",
                            "(c) **0.9997**: First 3 s.f. are 9, 9, 9. Next is 7 (round up).",
                            "Add 1 to 9 → 10, carry over... gives $1.000$.",
                            "$1.00$ (Must keep zeros to show 3 s.f.)"
                        ],
                        final_answer: "(a) 45,700  (b) 0.00346  (c) 1.00"
                    }
                ]
            },
            {
                title: '4. Estimation in Calculations',
                content: "## Why Estimate?\n\nEstimation is a critical skill for:\n- Checking if a calculator answer is \"ballpark correct\" (sensible).\n- Making quick decisions in real life.\n\n## The Golden Rule of Estimation\n\n**Round every number to 1 significant figure properly BEFORE calculating.**\n\nDo NOT round at the end. Rounding first simplifies the calculation to doing single-digit operations with powers of 10.\n\n## Example\n$$\\\\frac{48.7 \\\\times 11.2}{0.493} \\\\approx \\\\frac{50 \\\\times 10}{0.5} = \\\\frac{500}{0.5} = 1000$$\n\n- $48.7 \\\\to 50$ (1 s.f.)\n- $11.2 \\\\to 10$ (1 s.f.)\n- $0.493 \\\\to 0.5$ (1 s.f.)",
                worked_examples: [
                    {
                        question: "Estimate the value of $\\\\frac{204 \\\\times 3.96}{0.19}$.",
                        steps: [
                            "Round each number to 1 significant figure:",
                            "$204 \\\\approx 200$",
                            "$3.96 \\\\approx 4$",
                            "$0.19 \\\\approx 0.2$",
                            "Substitute rounded values:",
                            "$\\\\frac{200 \\\\times 4}{0.2} = \\\\frac{800}{0.2}$",
                            "Dividing by 0.2 is the same as dividing by 2 and multiplying by 10 (or multiplying by 5):",
                            "$800 \\\\div 0.2 = 8000 \\\\div 2 = 4000$"
                        ],
                        final_answer: "Estimated value is 4,000"
                    },
                    {
                        question: "A contractor needs to buy floor tiles for a room measuring 5.8 m by 4.2 m. The tiles cost \\$19.50 per square metre. Estimate the total cost.",
                        steps: [
                            "Round dimensions to 1 s.f.:",
                            "$5.8 \\\\text{ m} \\\\approx 6 \\\\text{ m}$",
                            "$4.2 \\\\text{ m} \\\\approx 4 \\\\text{ m}$",
                            "Estimated Area = $6 \\\\times 4 = 24 \\\\text{ m}^2$",
                            "Round cost to 1 s.f.:",
                            "$\\\\$19.50 \\\\approx \\\\$20$",
                            "Estimated Total Cost = $\\\\text{Area} \\\\times \\\\text{Cost} = 24 \\\\times 20 = 480$"
                        ],
                        final_answer: "Estimated cost is \\$480"
                    }
                ]
            }
        ],
        key_points: [
            "Rounding rule: 5 or more → round UP; less than 5 → round DOWN.",
            "Decimal Places (d.p.) count digits AFTER the decimal point.",
            "Significant Figures (s.f.) count digits from the FIRST non-zero digit.",
            "Leading zeros (0.005) are NOT significant; Trailing zeros after a decimal (2.50) ARE significant.",
            "For estimation: Round ALL numbers to 1 s.f. BEFORE calculating.",
            "Dividing by 0.5 is the same as multiplying by 2; dividing by 0.1 is the same as multiplying by 10.",
            "Always keep trailing zeros if they mark the precision (two decimal places means writing 4.50, not 4.5)."
        ],
        exam_tips: [
            "In Paper 1, estimation questions require you to show the rounded values (1 s.f.) to get method marks.",
            "Never confuse d.p. and s.f. — read the question carefully.",
            "If rounding to 3 s.f. gives 4.00, write 4.00, not 4. Marks are deducted for missing precision zeros.",
            "Use estimation to quickly sanity-check your Paper 2 calculator answers.",
            "When rounding numbers like 299 to the nearest 10, remember the 'domino effect': it becomes 300."
        ],
        visual_descriptions: [
            "Number line showing 4.35 being rounded to 4.4 (1 d.p.) with arrow pointing to nearest tenth",
            "Table comparing representations of numbers rounded to different significant figures",
            "Diagram showing leading zeros crossed out to indicate they are not significant"
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
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Mastering_Ratios__ZIMSEC.mp4',
                content: "## What Is a Ratio?\n\nA ratio is a way to compare two or more quantities of the same kind. It tells us how much of one thing there is compared to another.\n\n### Notation\n- We use the colon symbol ($:$).\n- $a : b$ is read as \"$a$ to $b$\".\n- Example: In a class with 2 boys and 3 girls, the ratio of **boys : girls** is $2 : 3$.\n\n## Important Rules\n\n1. **Order Matters**: $2:3$ is NOT the same as $3:2$. Always follow the order of the words in the question.\n2. **Same Units**: You must convert quantities to the same units before writing a ratio.\n   - Ratio of $2 \\\\text{ m}$ to $50 \\\\text{ cm}$ $\\\\to$ Change metres to cm first.\n   - $200 \\\\text{ cm} : 50 \\\\text{ cm} = 4 : 1$.\n3. **No Units**: The final answer for a ratio has no units description (it's a pure number comparison).\n\n## Ratios as Fractions\n\nA ratio $a : b$ can also be written as the fraction $\\\\frac{a}{b}$.\n- Ratio of shaded parts to total parts = $3 : 4$ or $\\\\frac{3}{4}$.",
                worked_examples: [
                    {
                        question: "Express 45 minutes to 2 hours as a ratio in its simplest form.",
                        steps: [
                            "Units are different (minutes vs hours). Convert hours to minutes.",
                            "$2 \\\\text{ hours} = 2 \\\\times 60 = 120 \\\\text{ minutes}$",
                            "Write as a ratio: $45 : 120$",
                            "Simplify by dividing both sides by their H.C.F. (15).",
                            "$45 \\\\div 15 = 3$",
                            "$120 \\\\div 15 = 8$",
                            "Final ratio: $3 : 8$"
                        ],
                        final_answer: "$3 : 8$"
                    },
                    {
                        question: "A mixture contains 500g of flour and 2kg of sugar. Write the ratio of flour to sugar.",
                        steps: [
                            "Convert to same units (grams): $2 \\\\text{ kg} = 2000 \\\\text{ g}$",
                            "Ratio Flour : Sugar = $500 : 2000$",
                            "Simplify: Divide by 500",
                            "$1 : 4$"
                        ],
                        final_answer: "$1 : 4$"
                    }
                ]
            },
            {
                title: '2. Simplifying Ratios',
                content: "## How to Simplify\n\nSimplifying a ratio means writing it using the smallest possible whole numbers.\n\n### Method 1: Integer Ratios\nDivide all parts of the ratio by their Highest Common Factor (H.C.F.).\n- $12 : 18 \\\\to$ Divide by 6 $\\\\to$ $2 : 3$\n\n### Method 2: Fractional Ratios\nMultiply all parts by the Lowest Common Denominator (LCD) to get rid of fractions.\n- $\\\\frac{1}{2} : \\\\frac{1}{3} \\\\to$ Multiply by 6 $\\\\to$ $3 : 2$\n\n### Method 3: Decimal Ratios\nMultiply by 10, 100, etc., to remove decimals, then simplify.\n- $1.5 : 3.5 \\\\to$ Multiply by 10 $\\\\to$ $15 : 35 \\\\to$ Divide by 5 $\\\\to$ $3 : 7$",
                worked_examples: [
                    {
                        question: "Simplify the ratio $\\\\frac{2}{5} : \\\\frac{3}{4} : \\\\frac{1}{2}$.",
                        steps: [
                            "Find LCD of denominators 5, 4, 2. LCD = 20.",
                            "Multiply each fraction by 20:",
                            "$\\\\frac{2}{5} \\\\times 20 = 8$",
                            "$\\\\frac{3}{4} \\\\times 20 = 15$",
                            "$\\\\frac{1}{2} \\\\times 20 = 10$",
                            "New integer ratio: $8 : 15 : 10$",
                            "Check for common factors: None exist for all three."
                        ],
                        final_answer: "$8 : 15 : 10$"
                    },
                    {
                        question: "Simplify $2.4 : 0.36$.",
                        steps: [
                            "Multiply by 100 to remove decimals (since 0.36 has 2 d.p.):",
                            "$240 : 36$",
                            "Divide by 12 (H.C.F.):",
                            "$20 : 3$"
                        ],
                        final_answer: "$20 : 3$"
                    }
                ]
            },
            {
                title: '3. Sharing in a Ratio',
                content: "## The Total Parts Method\n\nUse this method when you know the **total quantity** to simply split it.\n\n1. **Add** the ratio parts to find the \"Total Number of Parts\".\n2. **Divide** the total quantity by the total parts to find the \"Value of One Part\".\n3. **Multiply** the value of one share by each ratio number.\n\n## The Difference Method\n\nUse this when you know the **difference** between two shares.\n\n1. Find difference in ratio parts.\n2. Equate to the actual difference $\\\\to$ find value of 1 part.\n\n## The Unitary Method\n\nIf you know one person's share, find the value of 1 part first, then find the others.",
                worked_examples: [
                    {
                        question: "Divide $\\$4500$ between Tendai, Rumbi, and Tinashe in the ratio $2 : 3 : 5$.",
                        steps: [
                            "Total parts = $2 + 3 + 5 = 10$ parts",
                            "Value of 1 part = $\\\\frac{4500}{10} = \\$450$",
                            "Tendai: $2 \\\\times 450 = \\$900$",
                            "Rumbi: $3 \\\\times 450 = \\$1350$",
                            "Tinashe: $5 \\\\times 450 = \\$2250$",
                            "Check: $900 + 1350 + 2250 = 4500$. Correct."
                        ],
                        final_answer: "Tendai: \\$900, Rumbi: \\$1,350, Tinashe: \\$2,250"
                    },
                    {
                        question: "The ratio of boys to girls is $4 : 5$. If there are 8 more girls than boys, find the total number of students.",
                        steps: [
                            "Ratio Difference = $5 - 4 = 1$ part",
                            "Actual Difference = 8 students",
                            "So, 1 part = 8 students",
                            "Total parts = $4 + 5 = 9$ parts",
                            "Total students = $9 \\\\times 8 = 72$"
                        ],
                        final_answer: "72 students"
                    }
                ]
            },
            {
                title: '4. Ratio Problems in Context',
                content: "## Increasing and Decreasing Ratios\n\nTo change a quantity in a given ratio $a : b$:\n$$\\\\text{New Value} = \\\\text{Old Value} \\\\times \\\\frac{a}{b}$$\n\n- If $a > b$, it is an **increase**.\n- If $a < b$, it is a **decrease**.\n\n## Map Scales\n\nA scale of $1 : n$ means $1$ unit on the map represents $n$ units in real life.\n- **Actual Distance** = Map Distance $\\\\times$ Scale\n- **Map Distance** = Actual Distance $\\\\div$ Scale\n\n> **Tip**: Always convert to the same units (usually cm) before calculating.",
                worked_examples: [
                    {
                        question: "Increase $\\$60$ in the ratio $5 : 3$.",
                        steps: [
                            "Ratio is $5 : 3$ (Increase because $5 > 3$).",
                            "New Value = $60 \\\\times \\\\frac{5}{3}$",
                            "$60 \\\\div 3 = 20$",
                            "$20 \\\\times 5 = 100$"
                        ],
                        final_answer: "New value is \\$100"
                    },
                    {
                        question: "A photo of width 20 cm is reduced in the ratio $3 : 4$. Find the new width.",
                        steps: [
                            "Ratio is $3 : 4$ (Decrease because $3 < 4$).",
                            "New Width = $20 \\\\times \\\\frac{3}{4}$",
                            "$20 \\\\div 4 = 5$",
                            "$5 \\\\times 3 = 15$"
                        ],
                        final_answer: "New width is 15 cm"
                    }
                ]
            }
        ],
        key_points: [
            "Always simplify ratios to lowest terms (integers).",
            "To share in a ratio: Find the value of **1 part** first.",
            "Order is crucial: $2 : 3$ is different from $3 : 2$.",
            "Map scales are just ratios of distances (Map : Actual).",
            "To increase/decrease: Multiply by $\\\\frac{\\\\text{first number}}{\\\\text{second number}}$."
        ],
        exam_tips: [
            "Check total shares: After splitting money, add the shares back to see if they equal the original amount.",
            "Units! Never write a ratio like $20 \\\\text{cm} : 1 \\\\text{m}$. Change to $20 : 100$ first.",
            "When simplifying fractions in ratios, just multiply by the LCD.",
            "If the question says \"Divide 500 between A and B\", assume the ratio order matches the names (A : B)."
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
        summary: "This topic introduces methods to handle very large values (like populations) and very small values (like microscopic measurements). It transitions from basic place value to **Standard Form** (Scientific Notation), which is a key skill for all future science and maths subjects.",
        sections: [
            {
                title: '1. Place Value System',
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Form_1__Large_%26_Small_Numbers.mp4',
                content: "## The Power of 10\n\nOur number system is base-10. Each column is 10 times bigger than the one to its right.\n\n| Name | Power of 10 | Number |\n|------|------------|--------|\n| Million | $10^6$ | $1,000,000$ |\n| Billion | $10^9$ | $1,000,000,000$ |\n| Trillion | $10^{12}$ | $1,000,000,000,000$ |\n\n## Grouping Digits\nTo read large numbers easily, we group digits in **threes** starting from the right (units).\n- $34567890$ becomes $34 \\\\, 567 \\\\, 890$\n- Read: \"34 million, 567 thousand, 8 hundred and 90\"",
                worked_examples: [
                    {
                        question: "Write **Fifty-two million, three hundred and four thousand, and twenty** in digits.",
                        steps: [
                            "Millions: 52",
                            "Thousands: 304",
                            "Units: 020 (must have 3 digits)",
                            "Combine: $52,304,020$"
                        ],
                        final_answer: "52,304,020"
                    }
                ]
            },
            {
                title: '2. Standard Form (Large Numbers)',
                content: "## What is Standard Form?\n\nIt is a way of writing numbers as:\n$$A \\\\times 10^n$$\n\nWhere:\n- $1 \\\\leq A < 10$ (A is between 1 and 10, including 1 but less than 10)\n- $n$ is an integer (positive for large numbers)\n\n## Converting Large Numbers\n\n1. Place a decimal after the **first non-zero digit** to make $A$.\n2. Count how many places the decimal moved to the left. This is $n$.\n\nExample: $45,000$\n- $A = 4.5$\n- Moved 4 places.\n- $4.5 \\\\times 10^4$",
                worked_examples: [
                    {
                        question: "Write 150,000,000 (distance to sun in km) in standard form.",
                        steps: [
                            "First digit is 1. Put decimal after it: $1.5$",
                            "Original decimal was at the end. Count jumps to get to 1.5:",
                            "150,000,000 has 8 jumps.",
                            "Power is 8."
                        ],
                        final_answer: "$1.5 \\\\times 10^8$ km"
                    },
                    {
                        question: "Write $3.04 \\\\times 10^5$ as an ordinary number.",
                        steps: [
                            "Power is 5, so move decimal 5 places to the **right**.",
                            "3.04 (move 2 places) $\\\\to$ 304",
                            "Need 3 more places $\\\\to$ add 3 zeros.",
                            "304,000"
                        ],
                        final_answer: "304,000"
                    }
                ]
            },
            {
                title: '3. Expressing Small Numbers',
                content: "## Standard Form for Small Numbers\n\nFor numbers smaller than 1, the power of 10 is **negative**.\n$$A \\\\times 10^{-n}$$\n\n## Method\n\n1. Move the decimal point to the **right** until it is after the first non-zero digit (creating $A$).\n2. Count how many jumps you made. This is $-n$.\n\nExample: $0.00072$\n- Move decimal to get $7.2$ (between 1 and 10).\n- Jumps: 4 to the right.\n- Answer: $7.2 \\\\times 10^{-4}$.\n\n## Calculations with Standard Form\n\n- **Multiplication**: Multiply the numbers ($A$), add the powers ($n$).\n  - $(2 \\\\times 10^3) \\\\times (3 \\\\times 10^5) = 6 \\\\times 10^8$\n- **Division**: Divide the numbers ($A$), subtract the powers ($n$).\n  - $(8 \\\\times 10^6) \\\\div (2 \\\\times 10^2) = 4 \\\\times 10^4$\n\n## Comparing Numbers\n- Look at the **power** first. The higher power is the bigger number.\n  - $1.2 \\\\times 10^9 > 8.5 \\\\times 10^8$\n- If powers are the same, look at the number part ($A$).",
                worked_examples: [
                    {
                        question: "Write $0.000\\,005\\,6$ in standard form.",
                        steps: [
                            "First non-zero digit is 5. We need $5.6$.",
                            "Count jumps from original decimal to new position: 6 jumps right.",
                            "Right means negative.",
                            "Answer: $5.6 \\\\times 10^{-6}$"
                        ],
                        final_answer: "$5.6 \\\\times 10^{-6}$"
                    },
                    {
                        question: "Calculate $(4 \\\\times 10^3) \\\\times (5 \\\\times 10^4)$. Give your answer in standard form.",
                        steps: [
                            "Multiply numbers: $4 \\\\times 5 = 20$",
                            "Add powers: $3 + 4 = 7$",
                            "Result: $20 \\\\times 10^7$",
                            "This is NOT standard form because $20$ is not between 1 and 10.",
                            "Convert 20: $2.0 \\\\times 10^1$",
                            "Combine: $(2.0 \\\\times 10^1) \\\\times 10^7 = 2.0 \\\\times 10^8$"
                        ],
                        final_answer: "$2.0 \\\\times 10^8$"
                    }
                ]
            }
        ],
        key_points: [
            "Our system is base-10: adjacent columns differ by a factor of 10.",
            "Standard Form is always $A \\\\times 10^n$, where $1 \\\\leq A < 10$.",
            "Large numbers $\\\\to$ Positive power (decimal moves Left).",
            "Small numbers $\\\\to$ Negative power (decimal moves Right).",
            "When multiplying standard form: Multiply numbers, Add powers.",
            "When dividing standard form: Divide numbers, Subtract powers."
        ],
        exam_tips: [
            "Always check that your 'A' number is between 1 and 10. $12 \\\\times 10^5$ is WRONG.",
            "Count decimal jumps carefully. Drawing the loops/arches on the paper helps.",
            "Calculators often show standard form as $3.4 \\\\text{E} 5$. You must write it as $3.4 \\\\times 10^5$.",
            "In word problems, look for keywords like \"million\" ($10^6$) or \"billion\" ($10^9$)."
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
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Number_Bases__Crack_the_Code.mp4',
                content: "## What Is a Number Base?\n\nA **number base** defines the set of digits used to representing numbers. The base determines the value of each position in a number.\n\n### Common Bases\n\n- **Base 10 (Decimal)**: Uses digits $0, 1, 2, 3, 4, 5, 6, 7, 8, 9$. This is how we normally count.\n- **Base 2 (Binary)**: Uses digits $0, 1$. Used by computers.\n- **Base 5 (Quinary)**: Uses digits $0, 1, 2, 3, 4$.\n- **Base 8 (Octal)**: Uses digits $0, 1, 2, 3, 4, 5, 6, 7$.\n\n### Rule of Digits\nFor any base $n$, the digits used are always from $0$ to $n-1$.\n- Example: Base 5 uses digits up to 4 only. You will never see the digit '5' in a base 5 number.",
                worked_examples: [
                    {
                        question: "State the digits used in Base 6.",
                        steps: [
                            "Base $n$ uses digits $0$ to $n-1$.",
                            "For Base 6, digits are $0$ to $5$.",
                            "Digits: $0, 1, 2, 3, 4, 5$"
                        ],
                        final_answer: "0, 1, 2, 3, 4, 5"
                    }
                ]
            },
            {
                title: '2. Place Values in Different Bases',
                content: "## How Place Value Works\n\nIn any base system, the position of a digit determines its value. Moving from right to left, the value of each place is a **power of the base**.\n\n### Base 10 (Decimal)\n$$... 10^3, 10^2, 10^1, 10^0$$\n$$... 1000, 100, 10, 1$$\n\n### Base 2 (Binary)\n$$... 2^3, 2^2, 2^1, 2^0$$\n$$... 8, 4, 2, 1$$\n\n### Base 5\n$$... 5^3, 5^2, 5^1, 5^0$$\n$$... 125, 25, 5, 1$$",
                worked_examples: [
                    {
                        question: "What is the value of the underlined digit in $2\\underline{3}4_5$?",
                        steps: [
                            "Write place values from right to left: $1 (5^0), 5 (5^1), 25 (5^2)$.",
                            "The digit 4 is in the units ($1$) place.",
                            "The digit 3 is in the fives ($5$) place.",
                            "Value = $3 \\\\times 5$"
                        ],
                        final_answer: "15"
                    }
                ]
            },
            {
                title: '3. Converting Other Bases to Base 10',
                content: "## The Expansion Method\n\nTo change a number from Base $n$ to Base 10:\n\n1. Write the place value (powers of $n$) above each digit.\n2. **Multiply** each digit by its place value.\n3. **Add** the results together.\n\nExample: Convert $132_4$ to Base 10\n$$1 \\\\times 4^2 + 3 \\\\times 4^1 + 2 \\\\times 4^0$$\n$$= 1 \\\\times 16 + 3 \\\\times 4 + 2 \\\\times 1$$\n$$= 16 + 12 + 2 = 30_{10}$$",
                worked_examples: [
                    {
                        question: "Convert $1101_2$ to base 10.",
                        steps: [
                            "Place values (base 2): $8, 4, 2, 1$",
                            "Multiply digits: $(1 \\\\times 8) + (1 \\\\times 4) + (0 \\\\times 2) + (1 \\\\times 1)$",
                            "Calculate: $8 + 4 + 0 + 1$",
                            "Sum: $13$"
                        ],
                        final_answer: "$13_{10}$"
                    },
                    {
                        question: "Convert $24_5$ to a base 10 number.",
                        steps: [
                            "Place values (base 5): $5, 1$",
                            "Multiply: $(2 \\\\times 5) + (4 \\\\times 1)$",
                            "Calculate: $10 + 4$"
                        ],
                        final_answer: "$14_{10}$"
                    }
                ]
            },
            {
                title: '4. Converting from Base 10 to Other Bases',
                content: "## The Repeated Division Method\n\nTo change a number from Base 10 to Base $n$:\n\n1. **Divide** the number by the new base $n$.\n2. Write down the **remainder**.\n3. Divide the **quotient** by $n$ again.\n4. Repeat until the quotient is 0.\n5. Write the remainders from **bottom to top** (or last to first).\n\n## Why This Works\nThis process groups the number into powers of the base, starting from the smallest group (units) to larger groups.",
                worked_examples: [
                    {
                        question: "Convert $13_{10}$ to Base 2.",
                        steps: [
                            "$13 \\\\div 2 = 6$ remainder **1**",
                            "$6 \\\\div 2 = 3$ remainder **0**",
                            "$3 \\\\div 2 = 1$ remainder **1**",
                            "$1 \\\\div 2 = 0$ remainder **1**",
                            "Read remainders upwards: $1101$"
                        ],
                        final_answer: "$1101_2$"
                    },
                    {
                        question: "Convert $25_{10}$ to Base 8.",
                        steps: [
                            "$25 \\\\div 8 = 3$ remainder **1**",
                            "$3 \\\\div 8 = 0$ remainder **3**",
                            "Read upwards: $31$"
                        ],
                        final_answer: "$31_8$"
                    }
                ]
            }
            ,
            {
                title: '5. Binary Arithmetic',
                content: "## Binary Addition\n\nRules:\n- $0 + 0 = 0$\n- $0 + 1 = 1$\n- $1 + 0 = 1$\n- $1 + 1 = 10_2$ (0 carry 1)\n- $1 + 1 + 1 = 11_2$ (1 carry 1)\n\n## Binary Subtraction\n\nRules:\n- $1 - 1 = 0$\n- $1 - 0 = 1$\n- $10 - 1 = 1$ (Borrowing from next column)\n\n> **Tip**: You can also convert to Base 10, do the maths, and convert back to check your answer.",
                worked_examples: [
                    {
                        question: "Calculate $110_2 + 101_2$.",
                        steps: [
                            "   1 1 0",
                            "+ 1 0 1",
                            "-------",
                            "Units: $0 + 1 = 1$",
                            "Twos: $1 + 0 = 1$",
                            "Fours: $1 + 1 = 10_2$ (0, carry 1)",
                            "Eights: $1$ (carried)",
                            "Result: $1011_2$"
                        ],
                        final_answer: "$1011_2$"
                    },
                    {
                        question: "Calculate $110_2 - 11_2$.",
                        steps: [
                            "   1 1 0",
                            "-    1 1",
                            "-------",
                            "Units: $0 - 1$ (Cannot do. Borrow from Twos column. $1_2$ becomes $0$, unit becomes $10_2 = 2$).",
                            "$2 - 1 = 1$",
                            "Twos: $0 - 1$ (Cannot do. Borrow from Fours column).",
                            "$10_2 - 1 = 1$",
                            "Fours: $0$ (remaining)",
                            "Result: $11_2$"
                        ],
                        final_answer: "$11_2$"
                    }
                ]
            }
        ],
        key_points: [
            "A base tells you how many digits are used (Base 2 uses 0 and 1).",
            "Place values are powers of the base ($b^0, b^1, b^2...$).",
            "To convert TO Base 10: Sum of (digit $\\\\times$ place value).",
            "To convert FROM Base 10: Repeated division by new base, read remainders up.",
            "In Binary Addition: $1+1=10_2$ (0 carry 1).",
            "Computers use binary because switches only have two states (ON/OFF)."
        ],
        exam_tips: [
            "When Listing digits for Base $n$, remember it stops at $n-1$. Base 8 digits stop at 7.",
            "During repeated division, write remainders clearly next to each step so you don't miss one.",
            "Double-check binary addition 'carries'. It's easy to forget them.",
            "Read remainders from **bottom to top**. A common mistake is reading top to bottom."
        ],
        visual_descriptions: [
            "Chart showing numbers 1-10 in Base 10, Base 2, and Base 5 side-by-side",
            "Step-by-step diagram of repeated division converting 50 to Base 2",
            "Binary clock showing time using LEDs"
        ]
    },

    // ============================================
    // TOPIC 6: SCALES
    // ============================================
    'Scales': {
        topic: 'Scales',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "Scales are used to represent large objects (like land) on paper (maps) or small objects (like cells) in diagrams. This topic covers reading map scales, calculating actual distances from maps, and understanding the relationship between linear scale factors and area scale factors.",
        sections: [
            {
                title: '1. Map Scales',
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Understanding_Map_Scales.mp4',
                content: "## Types of Scales\n\n1. **Representative Fraction (R.F.)**: $1 : n$ (e.g., $1 : 50\\\\,000$)\n   - 1 unit on the map represents $50\\\\,000$ units on the ground.\n   - Always in the **same units** (usually cm).\n\n2. **Statement Scale**: \"1 cm represents 5 km\".\n\n3. **Linear Scale**: A bar line drawn on the map divided into segments (km or miles).\n\n## Calculations\n\n- **Actual Distance** = Map Distance $\\\\times$ Scale Factor\n- **Map Distance** = Actual Distance $\\\\div$ Scale Factor",
                worked_examples: [
                    {
                        question: "A map has a scale of $1 : 50\\\\,000$. The distance between two towns on the map is 8 cm. Find the actual distance in km.",
                        steps: [
                            "Map Distance = 8 cm",
                            "Actual Distance = $8 \\\\times 50\\\\,000$ cm",
                            "$= 400\\\\,000$ cm",
                            "Convert to km: Divide by $100\\\\,000$ (since $100\\\\,000$ cm = 1 km)",
                            "$400\\\\,000 \\\\div 100\\\\,000 = 4$ km"
                        ],
                        final_answer: "4 km"
                    },
                    {
                        question: "The distance between Harare and Bulawayo is 440 km. What is this distance on a map with scale $1 : 2\\\\,000\\\\,000$?",
                        steps: [
                            "Convert 440 km to cm: $440 \\\\times 100\\\\,000 = 44\\\\,000\\\\,000$ cm",
                            "Map Distance = Actual Distance $\\\\div$ Scale Factor",
                            "$= 44\\\\,000\\\\,000 \\\\div 2\\\\,000\\\\,000$",
                            "Cancel zeros: $44 \\\\div 2 = 22$"
                        ],
                        final_answer: "22 cm"
                    }
                ]
            },
            {
                title: '2. Area Scale Factor',
                content: "## Relationship between Linear and Area Scales\n\nIf the **Linear Scale Factor** is $k$ (or $1:k$):\n- **Area Scale Factor** is $k^2$ (or $1:k^2$)\n\nExample:\n- Scale $1 : 500$ (lengths are multiplied by 500)\n- Area Scale = $1^2 : 500^2 = 1 : 250\\\\,000$\n\n## Formula\n$$\\\\text{Actual Area} = \\\\text{Map Area} \\\\times (\\\\text{Scale Factor})^2$$\n\n> **Caution**: You cannot simply multiply the map area by the linear scale. You must square the scale first.",
                worked_examples: [
                    {
                        question: "A map has a scale of $1 : 200$. A field has an area of $5 \\\\text{ cm}^2$ on the map. Find its actual area in $m^2$.",
                        steps: [
                            "Linear Scale = 200",
                            "Area Scale = $200^2 = 40\\\\,000$",
                            "Actual Area in $cm^2$ = $5 \\\\times 40\\\\,000 = 200\\\\,000 \\\\text{ cm}^2$",
                            "Convert to $m^2$: Divide by $10\\\\,000$ (since $100 \\\\text{ cm} \\\\times 100 \\\\text{ cm} = 10\\\\,000 \\\\text{ cm}^2$ = $1 \\\\text{ m}^2$)",
                            "$200\\\\,000 \\\\div 10\\\\,000 = 20$"
                        ],
                        final_answer: "$20 \\\\text{ m}^2$"
                    }
                ]
            },
            {
                title: '3. Scale Drawings',
                content: "## Making a Scale Drawing\n\n1. **Choose a suitable scale**: It must fit on your paper. (e.g., if the room is 5 m long and paper is 30 cm, use 1 cm : 20 cm or 1 : 20).\n2. **Convert real measurements**: Use the scale to find drawing lengths.\n3. **Draw accurately**: Use a ruler and protractor for angles.\n\n## Bearings and Scale Drawings\n\nScale drawings are often used to solve problems involving directions (bearings) and distances when trigonometry is not used.\n- Measure the angle clockwise from North.\n- Draw the line to the correct scaled length.",
                worked_examples: [
                    {
                        question: "A rectangular garden is 12 m by 8 m. Make a scale drawing using a scale of 1 cm representing 2 m.",
                        steps: [
                            "Scale: 1 cm = 2 m",
                            "Length on drawing: $12 \\\\text{ m} \\\\div 2 = 6 \\\\text{ cm}$",
                            "Width on drawing: $8 \\\\text{ m} \\\\div 2 = 4 \\\\text{ cm}$",
                            "Draw a rectangle 6 cm long and 4 cm wide."
                        ],
                        final_answer: "Drawing of a 6cm x 4cm rectangle"
                    }
                ]
            }
        ],
        key_points: [
            "A scale is a ratio of Map Distance to Actual Distance.",
            "R.F. (Representative Fraction) has no units (e.g., $1:50\\\\,000$).",
            "Always convert to the same units before calculating ratio scales.",
            "Actual Distance = Map Distance $\\\\times$ Scale Factor.",
            "Area Scale Factor is the **square** of the Linear Scale Factor ($k \\\\to k^2$).",
            "Linear scales (bar scales) remain accurate even if measuring on a photocopied/resized map."
        ],
        exam_tips: [
            "Check units carefully: 1 km = 100,000 cm. Memorise this conversion.",
            "When finding Actual Distance, your answer should usually be in m or km, not cm.",
            "Don't forget to **square the scale** when dealing with Area problems.",
            "Use a ruler to measure map distances accurately to the nearest millimetre."
        ],
        visual_descriptions: [
            "Diagram showing a map with a linear bar scale and R.F. scale 1:50000",
            "Illustration of Area Scale Factor: A 1x1 square becoming a 3x3 square (Scale factor 3, Area factor 9)",
            "Triangle drawing showing bearings and scaled lengths"
        ]
    },

    // ============================================
    // TOPIC 7: SETS AND SET NOTATION
    // ============================================
    'Sets and Set Notation': {
        topic: 'Sets and Set Notation',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "A set is a collection of distinct objects, considered as an object in its own right. Sets are one of the most fundamental concepts in mathematics. In the ZIMSEC syllabus, you must learn to define sets well, use set notation correctly (like $\\\\in$, $\\\\subset$, $\\\\cup$, $\\\\cap$), and represent sets using Venn diagrams.",
        sections: [
            {
                title: '1. Introduction to Sets',
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Cracking_the_Code__Sets.mp4',
                content: "## What Is a Set?\n\nA **set** is a well-defined collection of distinct objects.\n- **Well-defined**: There is a clear rule to decide if an object belongs to the set.\n- **Distinct**: No object is listed more than once.\n- **Elements**: The objects in a set are called elements or members.\n\n## Examples\n- $A = \\\\{2, 4, 6, 8\\\\}$ (Set of even numbers less than 10)\n- $V = \\\\{a, e, i, o, u\\\\}$ (Set of vowels)\n- $P = \\\\{\\\\text{Harare, Bulawayo, Mutare}\\\\}$ (Set of major cities in Zimbabwe)\n\n## Not a Set\n- \"A collection of smart students\" is NOT a set because \"smart\" is an opinion (not well-defined).\n- \"A group of tall trees\" is NOT a set unless \"tall\" is defined (e.g., over 10m).",
                worked_examples: [
                    {
                        question: "State whether each collection is a well-defined set: (a) Days of the week starting with T (b) The best football players in the world.",
                        steps: [
                            "(a) Days of the week starting with T: Tuesday, Thursday.",
                            "This is clear and exact. -> **Well-defined set**.",
                            "(b) Best football players: This depends on opinion.",
                            "Not exact. -> **Not a well-defined set**."
                        ],
                        final_answer: "(a) Set (b) Not a set"
                    }
                ]
            },
            {
                title: '2. Describing Sets',
                content: "## 1. Listing Method (Roster Form)\n\nWe list all elements inside curly brackets $\\\\{\\\\}$, separated by commas.\n- Example: Set of prime numbers less than 10: $P = \\\\{2, 3, 5, 7\\\\}$\n\n## 2. Description Method (Verbal)\n\nWe describe the common property of the elements in words.\n- Example: $P$ is the set of prime numbers less than 10.\n\n## 3. Set-Builder Notation\n\nWe use a rule to describe the elements.\n- Format: $\\\\{x : \\\\text{condition}\\\\}$\n- Example: $A = \\\\{x : x \\\\text{ is an even number and } 0 < x < 10\\\\}$\n- Read as: \"A is the set of all $x$ such that $x$ is an even number between 0 and 10.\"",
                worked_examples: [
                    {
                        question: "Write the set $M = \\\\{x : x \\\\text{ is a multiple of 5 and } 5 \\\\leq x \\\\leq 20\\\\}$ in listing method.",
                        steps: [
                            "Identify multiples of 5: 5, 10, 15, 20, 25...",
                            "Check condition $5 \\\\leq x \\\\leq 20$: Includes 5, 10, 15, 20.",
                            "List them in brackets."
                        ],
                        final_answer: "$M = \\\\{5, 10, 15, 20\\\\}$"
                    }
                ]
            },
            {
                title: '3. Set Symbols and Notation',
                content: "## Membership\n- $\\\\in$ means \"is an element of\" or \"belongs to\".\n- $\\\\notin$ means \"is NOT an element of\".\n\nExample: If $A = \\\\{2, 4, 6\\\\}$:\n- $2 \\\\in A$ (True)\n- $3 \\\\notin A$ (True)\n\n## Cardinality ($n$)\n- $n(A)$ is the **number of elements** in set $A$.\n- Example: If $A = \\\\{a, b, c\\\\}$, then $n(A) = 3$.\n\n## The Empty Set (Null Set)\n- A set with **no elements**.\n- Symbols: $\\\\{\\\\}$ or $\\\\emptyset$.\n- Note: $\\\\{0\\\\}$ is NOT an empty set (it contains number 0). $n(\\\\emptyset) = 0$.",
                worked_examples: [
                    {
                        question: "Given $B = \\\\{m, a, t, h\\\\}$, find $n(B)$ and state if $s \\\\in B$.",
                        steps: [
                            "Count elements in $B$: m, a, t, h -> 4 elements. So $n(B) = 4$.",
                            "Check if 's' is in the list. It is not.",
                            "So $s \\\\notin B$."
                        ],
                        final_answer: "$n(B) = 4$, $s \\\\notin B$"
                    }
                ]
            },
            {
                title: '4. Subsets',
                content: "## Subset (\\\\subseteq)\n- Set $A$ is a subset of $B$ if **every** element of $A$ is also in $B$.\n- Symbol: $\\\\subseteq$\n- Example: $\\\\{1, 2\\\\} \\\\subseteq \\\\{1, 2, 3\\\\}$\n\n## Proper Subset (\\\\subset)\n- Set $A$ is a proper subset of $B$ if $A$ is in $B$, but $A$ is not equal to $B$ (B has extra elements).\n- Symbol: $\\\\subset$\n- Example: $\\\\{1, 2\\\\} \\\\subset \\\\{1, 2, 3\\\\}$\n\n## Number of Subsets\n- If a set has $n$ elements, it has $2^n$ possible subsets.\n- Identify subsets of $\\\\{a, b\\\\}$: $\\\\{\\\\}, \\\\{a\\\\}, \\\\{b\\\\}, \\\\{a, b\\\\}$ ($2^2 = 4$ subsets).",
                worked_examples: [
                    {
                        question: "List all the subsets of set $A = \\\\{1, 2, 3\\\\}$.",
                        steps: [
                            "Empty set: $\\\\{\\\\}$",
                            "1-element sets: $\\\\{1\\\\}, \\\\{2\\\\}, \\\\{3\\\\}$",
                            "2-element sets: $\\\\{1, 2\\\\}, \\\\{1, 3\\\\}, \\\\{2, 3\\\\}$",
                            "3-element set: $\\\\{1, 2, 3\\\\}$",
                            "Total count check: $2^3 = 8$ subsets."
                        ],
                        final_answer: "$\\\\{\\\\}, \\\\{1\\\\}, \\\\{2\\\\}, \\\\{3\\\\}, \\\\{1,2\\\\}, \\\\{1,3\\\\}, \\\\{2,3\\\\}, \\\\{1,2,3\\\\}$"
                    }
                ]
            }
        ],
        key_points: [
            "Sets must be well-defined (clear rule).",
            "Listing method uses curly brackets $\\\\{ \\\\}$.",
            "$n(A)$ is the number of elements.",
            "$\\\\emptyset$ or $\\\\{\\\\}$ represents the empty set.",
            "If $A \\\\subseteq B$, all elements of $A$ are in $B$.",
            "Formula for number of subsets: $2^n$."
        ],
        exam_tips: [
            "Don't confuse $\\\\in$ (element) with $\\\\subset$ (subset). $2 \\\\in \\\\{1, 2\\\\}$ but $\\\\{2\\\\} \\\\subset \\\\{1, 2\\\\}$.",
            "The empty set is a subset of every set.",
            "$\\\\{0\\\\}$ is not empty, it contains one element.",
            "Read set-builder notation $\\\\{x : ...\\\\}$ carefully for boundaries (e.g., $<$ vs $\\\\leq$)."
        ],
        visual_descriptions: [
            "Diagram showing listing vs description method",
            "Illustration of subset relationship (Set A inside Set B)",
            "Visual counting of subsets for a 3-element set"
        ]
    },

    // ============================================
    // TOPIC 8: TYPES OF SETS
    // ============================================
    'Types of Sets': {
        topic: 'Types of Sets',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "This topic explores the different classifications of sets and how they relate to one another. Understanding types of sets (Universal, Finite, Infinite, Empty) and operations (Union, Intersection, Complement) is critical for solving Venn diagram problems, which is a high-yield topic in ZIMSEC exams.",
        sections: [
            {
                title: '1. The Universal Set',
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Form_1_Maths__Types_of_Sets.mp4',
                content: "## Definition\n\nThe **Universal Set** ($\\\\xi$ or $\\\\mathcal{U}$) is the set that contains **all** the elements relevant to a particular discussion or problem. All other sets in that problem are subsets of the universal set.\n\n## Example\n- If we are sorting school grades, the universal set might be: $\\\\xi = \\\\{\\\\text{Form 1, Form 2, Form 3, Form 4, Lower 6, Upper 6}\\\\}$.\n- If we are dealing with digits: $\\\\xi = \\\\{0, 1, 2, 3, 4, 5, 6, 7, 8, 9\\\\}$.\n\n## The Complement of a Set ($A'$)\n\nThe **complement** of a set $A$ (written as $A'$ or $A^c$) is the set of all elements in the universal set $\\\\xi$ that are **NOT** in set $A$.\n\n$$A' = \\\\{x : x \\\\in \\\\xi \\\\text{ and } x \\\\notin A\\\\}$$",
                worked_examples: [
                    {
                        question: "Given $\\\\xi = \\\\{1, 2, 3, 4, 5, 6, 7, 8\\\\}$ and $A = \\\\{2, 4, 6, 8\\\\}$. List the elements of $A'$.",
                        steps: [
                            "Identify elements in $\\\\xi$.",
                            "Remove elements that are in $A$ ($2, 4, 6, 8$).",
                            "Remaining elements correspond to $A'$."
                        ],
                        final_answer: "$A' = \\\\{1, 3, 5, 7\\\\}$"
                    }
                ]
            },
            {
                title: '2. Finite, Infinite, and Empty Sets',
                content: "## Finite Set\n- A set where you can count the elements and the counting comes to an end.\n- Example: $F = \\\\{2, 4, 6, 8\\\\}$ ($n(F) = 4$).\n\n## Infinite Set\n- A set with an endless number of elements.\n- Example: $\\\\mathbb{N} = \\\\{1, 2, 3, 4, ...\\\\}$ (Natural numbers go on forever).\n\n## Empty (Null) Set\n- A set with **zero** elements.\n- Symbol: $\\\\{\\\\}$ or $\\\\emptyset$.\n- Note: $\\\\{0\\\\}$ is **not** empty; it contains the element 0.",
                worked_examples: [
                    {
                        question: "State whether the following sets are Finite, Infinite, or Empty: (a) $A = \\\\{x : x \\\\text{ is a month with 32 days}\\\\}$ (b) $B = \\\\{x : x \\\\text{ is a multiple of 5}\\\\}$.",
                        steps: [
                            "(a) Are there any months with 32 days? No. So $A$ has 0 elements.",
                            "It is an **Empty Set**.",
                            "(b) Multiples of 5: 5, 10, 15, 20... This list never ends.",
                            "It is an **Infinite Set**."
                        ],
                        final_answer: "(a) Empty Set (b) Infinite Set"
                    }
                ]
            },
            {
                title: '3. Set Operations: Union and Intersection',
                content: "## Union ($A \\\\cup B$)\n- The set of elements that are in $A$ **OR** in $B$ (or in both). \"Putting them together\".\n- Example: $\\\\{1, 2\\\\} \\\\cup \\\\{2, 3\\\\} = \\\\{1, 2, 3\\\\}$.\n\n## Intersection ($A \\\\cap B$)\n- The set of elements that are in **BOTH** $A$ **AND** $B$.\n- Example: $\\\\{1, 2\\\\} \\\\cap \\\\{2, 3\\\\} = \\\\{2\\\\}$.\n\n## Disjoint Sets\n- Two sets are disjoint if they have **no** elements in common.\n- i.e., $A \\\\cap B = \\\\emptyset$.",
                worked_examples: [
                    {
                        question: "If $P = \\\\{1, 2, 3, 4\\\\}$ and $Q = \\\\{3, 4, 5, 6\\\\}$, find (a) $P \\\\cup Q$ and (b) $P \\\\cap Q$.",
                        steps: [
                            "(a) Union: List all elements from both. Do not repeat.",
                            "$P \\\\cup Q = \\\\{1, 2, 3, 4, 5, 6\\\\}$.",
                            "(b) Intersection: List common elements only.",
                            "3 and 4 are in both.",
                            "$P \\\\cap Q = \\\\{3, 4\\\\}$."
                        ],
                        final_answer: "(a) $\\\\{1, 2, 3, 4, 5, 6\\\\}$ (b) $\\\\{3, 4\\\\}$"
                    }
                ]
            },
            {
                title: '4. Venn Diagrams Application',
                content: "## Using Venn Diagrams\n- **Rectangle**: Represents Universal Set $\\\\xi$.\n- **Circles**: Represent subsets (sets A, B, etc.).\n- **Overlap**: Represents intersection $A \\\\cap B$.\n\n## Formula for Two Sets\n$$n(A \\\\cup B) = n(A) + n(B) - n(A \\\\cap B)$$\n\nThis formula prevents double-counting the intersection.",
                worked_examples: [
                    {
                        question: "In a class of 30 students, 18 play Soccer ($S$), 15 play Netball ($N$), and 5 play both. How many play neither?",
                        steps: [
                            "Using the formula: $n(S \\\\cup N) = n(S) + n(N) - n(S \\\\cap N)$.",
                            "$n(S \\\\cup N) = 18 + 15 - 5 = 28$.",
                            "28 students play at least one sport.",
                            "Total students = 30.",
                            "Neither = Total - $n(S \\\\cup N) = 30 - 28 = 2$."
                        ],
                        final_answer: "2 students play neither."
                    }
                ]
            }
        ],
        key_points: [
            "The Universal Set $\\\\xi$ contains everything for the problem.",
            "Complement $A'$ is everything in $\\\\xi$ outside $A$.",
            "$A \\\\cup B$ combines sets (OR).",
            "$A \\\\cap B$ finds common elements (AND).",
            "Empty Set $\\\\emptyset$ has size 0.",
            "Remember: $n(A \\\\cup B) = n(A) + n(B) - n(A \\\\cap B)$."
        ],
        exam_tips: [
            "Always draw a Venn diagram for word problems involving groups of people.",
            "Don't forget to subtract the intersection when adding two sets together.",
            "Use $\\\\xi$ for Universal Set, not $U$ (unless U is specified).",
            "Read carefully: 'Play ONLY soccer' excludes those who play both."
        ],
        visual_descriptions: [
            "Venn diagram shading the Union of two sets",
            "Venn diagram shading the Intersection of two sets",
            "Venn diagram showing complement A' as the region outside circle A"
        ]
    },

    // ============================================
    // TOPIC 9: CONSUMER ARITHMETIC
    // ============================================

    'Consumer Arithmetic': {
        topic: 'Consumer Arithmetic',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "Consumer Arithmetic applies mathematical skills to direct real-life situations involving money and financial literacy. ZIMSEC exams test this area heavily, requiring students to calculate household bills (ZESA, water), understand profit and loss in trading, calculate discounts, and work with Value Added Tax (VAT).",
        sections: [
            {
                title: '1. Household Bills (Electricity & Water)',
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Consumer_Arithmetic.mp4',
                content: "## Electricity Bills (Prepaid/ZESA)\nElectricity is measured in **kilowatt-hours (kWh)**, also called \"units\".\n\n**Calculation Steps:**\n1.  **Units Consumed** = Current Reading - Previous Reading (for post-paid) OR Amount Bought / Price per Unit.\n2.  **Cost of Energy** = Units $\\\\times$ Rate per Unit.\n3.  **Fixed Charges**: Some bills have a fixed monthly charge (Rural Electrification Levy).\n\n## Water Bills\nWater is measured in cubic metres ($m^3$).\n\n**Calculation Steps:**\n1.  **Consumption** = Current Reading - Previous Reading.\n2.  **Cost** = Consumption $\\\\times$ Rate per $m^3$.\n3.  **Tiered Pricing**: Often the first 10 $m^3$ are cheaper, and usage above that is charged at a higher rate.",
                worked_examples: [
                    {
                        question: "Mr. Moyo's water meter read $450m^3$ last month and $485m^3$ this month. The charge is \\$0.80 per $m^3$ for the first 20 $m^3$ and \\$1.50 per $m^3$ for the rest. Calculate his bill.",
                        steps: [
                            "1. Calculate consumption: $485 - 450 = 35m^3$.",
                            "2. Split consumption into tiers:",
                            "   - First 20 $m^3$ at \\$0.80",
                            "   - Remaining $15m^3$ ($35 - 20$) at \\$1.50",
                            "3. Calculate cost:",
                            "   - Tier 1: $20 \\\\times 0.80 = \\$16.00$",
                            "   - Tier 2: $15 \\\\times 1.50 = \\$22.50$",
                            "4. Total = $16.00 + 22.50 = \\$38.50$"
                        ],
                        final_answer: "Total Bill: \\$38.50"
                    }
                ]
            },
            {
                title: '2. Profit and Loss',
                content: "## Definitions\n- **Cost Price (C.P.)**: Price bought.\n- **Selling Price (S.P.)**: Price sold.\n- **Profit**: Gain when S.P. > C.P. ($Profit = S.P. - C.P.$).\n- **Loss**: Loss when C.P. > S.P. ($Loss = C.P. - S.P.$).\n\n## Percentage Profit/Loss\nAlways calculated based on the **Cost Price**.\n\n$$ \\\\text{% Profit} = \\\\frac{\\\\text{Profit}}{\\\\text{Cost Price}} \\\\times 100\\\\% $$\n\n$$ \\\\text{% Loss} = \\\\frac{\\\\text{Loss}}{\\\\text{Cost Price}} \\\\times 100\\\\% $$",
                worked_examples: [
                    {
                        question: "A trader buys a shirt for \\$20 and sells it for \\$25. Find the percentage profit.",
                        steps: [
                            "1. Find Profit: $25 - 20 = \\$5$.",
                            "2. Calculate % Profit: $\\\\frac{5}{20} \\\\times 100\\\\%$.",
                            "3. Simplify: $0.25 \\\\times 100\\\\% = 25\\%$.",
                        ],
                        final_answer: "25% Profit"
                    },
                    {
                        question: "A phone bought for \\$200 is sold at a 10% loss. Find the selling price.",
                        steps: [
                            "1. Calculate loss amount: $10\\\\%$ of $200 = 0.1 \\\\times 200 = \\$20$.",
                            "2. Subtract loss from cost: $200 - 20 = \\$180$.",
                            "Alternatively: S.P. = $90\\\\%$ of C.P. = $0.9 \\\\times 200 = \\$180$."
                        ],
                        final_answer: "Selling Price: \\$180"
                    }
                ]
            },
            {
                title: '3. Discount and VAT',
                content: "## Discount\nA reduction in price to encourage buying.\n\n$$ \\\\text{Sale Price} = \\\\text{Marked Price} - \\\\text{Discount Amount} $$\n\n## Value Added Tax (VAT)\nA government tax added to goods. In Zimbabwe, standard VAT is usually 15%.\n\n$$ \\\\text{Price with VAT} = \\\\text{Price excluding VAT} \\\\times 1.15 $$\n\nTo remove VAT (find original price):\n$$ \\\\text{Original Price} = \\\\frac{\\\\text{Price with VAT}}{1.15} $$",
                worked_examples: [
                    {
                        question: "A basic food hamper costs \\$40. Calculate the price if 15% VAT is added.",
                        steps: [
                            "VAT Amount = $15\\\\%$ of $40 = 0.15 \\\\times 40 = \\$6$.",
                            "Total Price = $40 + 6 = \\$46$.",
                            "Or multiply by 1.15: $40 \\\\times 1.15 = \\$46$."
                        ],
                        final_answer: "\\$46.00"
                    },
                    {
                        question: "A radio is priced at \\$115 including 15% VAT. What was the price before VAT?",
                        steps: [
                            "Let original price be $x$.",
                            "$x \\\\times 1.15 = 115$.",
                            "$x = \\\\frac{115}{1.15} = 100$.",
                            "Be careful: Do not just subtract 15% of 115."
                        ],
                        final_answer: "\\$100.00"
                    }
                ]
            },
            {
                title: '4. Household Budgeting',
                content: "## Components of a Budget\n- **Income**: Money coming in (Salary, Sales).\n- **Expenditure**: Money going out (Rent, Food, Transport, School Fees).\n- **Balance**: Income - Expenditure.\n\n## Deficit vs Surplus\n- **Surplus**: Income > Expenditure (Good).\n- **Deficit**: Expenditure > Income (Bad - Debt).",
                worked_examples: [
                    {
                        question: "Mrs. Tau earns \\$500. She spends \\$150 on rent, \\$120 on food, \\$80 on transport, and saves the rest. What percentage of her income does she save?",
                        steps: [
                            "1. Total Expenditure: $150 + 120 + 80 = \\$350$.",
                            "2. Savings: $500 - 350 = \\$150$.",
                            "3. Percentage Saved: $\\\\frac{150}{500} \\\\times 100\\\\%$.",
                            "4. $0.3 \\\\times 100\\\\% = 30\\%$."
                        ],
                        final_answer: "30%"
                    }
                ]
            }
        ],
        key_points: [
            "Always calculate % Profit or Loss on the Cost Price.",
            "Water bills often use tiered usage steps.",
            "VAT adds to the price (multiply by 1.15).",
            "To remove VAT, divide by 1.15 (don't subtract 15%).",
            "Budget Surplus = Income - Expenses (Positive)."
        ],
        exam_tips: [
            "Read carefully if pricing is 'inclusive of VAT' or 'exclusive'.",
            "Show splitting of units/volume clearly for tiered billing.",
            "In discount questions, remember 'Sale Price' is what you pay.",
            "Double-check units (cents vs dollars) in bill calculations."
        ],
        visual_descriptions: [
            "A sample utility bill showing previous and current readings.",
            "Pie chart showing budget allocation (Rent, Food, Savings).",
            "Diagram showing cost price, profit margin, and selling price."
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
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Form_1_Maths__Measures.mp4',
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
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/ZIMSEC_Maths__Mensuration.mp4',
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
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Mastering_Functional_Graphs.mp4',
                content: "## What Is the Cartesian Plane?\n\nThe **Cartesian plane** (or coordinate plane) is a flat surface formed by two perpendicular number lines that intersect at right angles:\n\n- The **x-axis**: The horizontal number line (positive to the right, negative to the left).\n- The **y-axis**: The vertical number line (positive up, negative down).\n- The **Origin**: The point where the two axes cross, labelled $O$. Its coordinates are $(0, 0)$.\n\n## Setting Up the Plane\n\n1. Use graph paper and a sharp pencil.\n2. Draw the axes with a ruler.\n3. Mark equal intervals on both axes (e.g., every 1 cm or 2 cm).\n4. Label the axes ($x$ and $y$) and the origin ($O$).\n5. Choose a suitable **scale** so all points fit on the page.",
                worked_examples: [
                    {
                        question: "Draw a Cartesian plane with values from $-4$ to $4$ on both axes, using a scale of 2 cm to 1 unit.",
                        steps: [
                            "Draw a horizontal line (x-axis) and vertical line (y-axis) crossing in the middle.",
                            "Mark the origin $O$ at the intersection.",
                            "Every 2 cm to the right of O, mark 1, 2, 3, 4.",
                            "Every 2 cm to the left of O, mark -1, -2, -3, -4.",
                            "Every 2 cm up from O, mark 1, 2, 3, 4.",
                            "Every 2 cm down from O, mark -1, -2, -3, -4.",
                            "Label the axes '$x$' and '$y$'."
                        ],
                        final_answer: "Correctly drawn and labelled Cartesian plane with scale 2 cm : 1 unit."
                    }
                ]
            },
            {
                title: '2. Coordinates',
                content: "## Ordered Pairs\n\nAny position on the plane is described by a pair of numbers $(x, y)$, called **coordinates**.\n\n- The first number ($x$-coordinate) tells you how far to move **horizontally** (left/right) from the origin.\n- The second number ($y$-coordinate) tells you how far to move **vertically** (up/down).\n\n## How to Plot a Point $(x, y)$\n\n**\"Along the corridor, then up the stairs.\"**\n\n1. Start at the Origin $(0, 0)$.\n2. Move along the x-axis to the $x$ value.\n3. Move parallel to the y-axis to the $y$ value.\n4. Mark the position with a small cross ($x$) or dot.\n\n## Special Points\n\n- **Origin**: $(0, 0)$\n- **On the x-axis**: The y-coordinate is always 0. Example: $(5, 0)$.\n- **On the y-axis**: The x-coordinate is always 0. Example: $(0, -3)$.",
                worked_examples: [
                    {
                        question: "Plot the points $A(2, 3)$, $B(-3, 1)$, $C(-2, -4)$, and $D(0, -2)$.",
                        steps: [
                            "**Point A(2, 3)**: Start at O, go 2 units right, then 3 units up.",
                            "**Point B(-3, 1)**: Start at O, go 3 units left, then 1 unit up.",
                            "**Point C(-2, -4)**: Start at O, go 2 units left, then 4 units down.",
                            "**Point D(0, -2)**: Start at O, stay at 0 horizontally, go 2 units down (point lies on the y-axis)."
                        ],
                        final_answer: "Points A, B, C, and D plotted correctly."
                    }
                ]
            },
            {
                title: '3. The Four Quadrants',
                content: "## Quadrant Numbers\n\nThe axes divide the plane into four regions called **quadrants**. They are numbered anticlockwise starting from the top right.\n\n| Quadrant | Description | Signs (+, -) | Example |\n| :---: | :--- | :---: | :---: |\n| **1st** | Top Right | $(+, +)$ | $(2, 5)$ |\n| **2nd** | Top Left | $(-, +)$ | $(-2, 5)$ |\n| **3rd** | Bottom Left | $(-, -)$ | $(-2, -5)$ |\n| **4th** | Bottom Right | $(+, -)$ | $(2, -5)$ |\n\n> **Note:** Points that lie exactly on the x-axis or y-axis are **not** in any quadrant.",
                worked_examples: [
                    {
                        question: "In which quadrant do the following points lie? $P(-5, 2)$, $Q(3, -1)$, $R(-2, -8)$.",
                        steps: [
                            "$P(-5, 2)$: $(- , +)$ is Top Left $\\rightarrow$ **2nd Quadrant**",
                            "$Q(3, -1)$: $(+ , -)$ is Bottom Right $\\rightarrow$ **4th Quadrant**",
                            "$R(-2, -8)$: $(- , -)$ is Bottom Left $\\rightarrow$ **3rd Quadrant**"
                        ],
                        final_answer: "P: 2nd, Q: 4th, R: 3rd"
                    }
                ]
            },
            {
                title: '4. Simple Linear Graphs',
                content: "## Equation of a Straight Line\n\nA straight-line graph connects points that follow a specific rule or equation, usually written as $y = mx + c$.\n\n- **Table of Values**: To draw a graph, first make a table of values calculated from the equation.\n- **Gradient**: Looking at the graph from left to right, if it goes **uphill**, the gradient is positive. If it goes **downhill**, the gradient is negative.\n\n## Steps to Draw a Linear Graph\n\n1. Create a table with at least 3 values for $x$ (e.g. $-2, 0, 2$).\n2. Calculate the matching $y$ values using the equation.\n3. Plot the coordinate pairs.\n4. Join them with a long straight line using a ruler.\n5. Write the equation next to the line.",
                worked_examples: [
                    {
                        question: "Draw the graph of $y = 2x - 1$ for values of $x$ from $-2$ to $2$.",
                        steps: [
                            "**Step 1: Create a Table**\nChoose x: $-2, -1, 0, 1, 2$",
                            "**Step 2: Calculate y**\nWhen $x = -2$: $y = 2(-2) - 1 = -4 - 1 = -5$\nWhen $x = 0$: $y = 2(0) - 1 = -1$\nWhen $x = 2$: $y = 2(2) - 1 = 3$",
                            "Table points: $(-2, -5), (-1, -3), (0, -1), (1, 1), (2, 3)$",
                            "**Step 3: Plot and Join**\nPlot the 5 points on the Cartesian plane.",
                            "Use a ruler to draw a straight line through all points."
                        ],
                        final_answer: "Straight line graph passing through y-axis at -1 with a slope of 2."
                    },
                    {
                        question: "Draw the graph of $y = -x + 2$. Describe its slope.",
                        steps: [
                            "**Table of Values:**\n$x = 0 \\rightarrow y = 0 + 2 = 2$\n$x = 2 \\rightarrow y = -2 + 2 = 0$\n$x = 4 \\rightarrow y = -4 + 2 = -2$",
                            "Points: $(0, 2), (2, 0), (4, -2)$",
                            "Plot and join the points.",
                            "**Observation:** As we move right, the line goes **down**. It has a **negative** gradient."
                        ],
                        final_answer: "Downward sloping straight line passing through (0, 2) and (2, 0)."
                    }
                ]
            }
        ],
        key_points: [
            "The **Origin** $(0,0)$ is where the x and y axes intersect.",
            "In coordinates $(x, y)$, the x-value (horizontal) always comes first.",
            "Points on the x-axis have a y-coordinate of 0 (e.g., $(3, 0)$).",
            "Points on the y-axis have an x-coordinate of 0 (e.g., $(0, 5)$).",
            "The Cartesian plane has **4 quadrants** numbered 1 to 4 anticlockwise.",
            "Linear graphs ($y = mx + c$) always form straight lines."
        ],
        exam_tips: [
            "Use a sharp HB pencil for all drawing—you lose marks for thick or messy lines.",
            "Always label your axes ($x$ and $y$) and scale values.",
            "When plotting $(x, y)$, remember: 'Corridor first (x), then stairs (y)'.",
            "Check your scale carefully. Simply counting square boxes is not enough if 1 box ≠ 1 unit.",
            "If your 3 points for a linear graph don't form a straight line, check your calculations again."
        ],
        visual_descriptions: [
            "A diagram of a Cartesian plane showing the x-axis, y-axis, origin, and the four quadrants labelled 1st to 4th.",
            "An illustration of plotting point P(3, 4) showing arrows moving 3 units right then 4 units up.",
            "A straight line graph of y = 2x - 1 drawn on a grid, showing the y-intercept at -1."
        ]
    },

    // ============================================
    // TOPIC 13: TRAVEL GRAPHS
    // ============================================
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
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Mastering_Travel_Graphs.mp4',
                content: "## Structure of the Graph\n\n- **Vertical Axis (y-axis)**: Distance from the starting point (e.g. km or m).\n- **Horizontal Axis (x-axis)**: Time taken (e.g. hours or minutes).\n\n## Interpreting the Lines\n\n- **Steep Line**: Fast speed.\n- **Shallow Line**: Slow speed.\n- **Flat (Horizontal) Line**: Stationary (stopped/resting). Distance does not change as time passes.\n- **Downward Slope**: Returning to the start.\n\n> **Key Concept:** The gradient (steepness) of the line represents the **Speed**.",
                worked_examples: [
                    {
                        question: "A graph shows a line from (0,0) to (2, 80), then a flat line from (2, 80) to (3, 80), then a line from (3, 80) to (5, 0). Describe the journey.",
                        steps: [
                            "**Leg 1 (0-2 hrs)**: Travelled 80 km away from home in 2 hours.",
                            "**Leg 2 (2-3 hrs)**: Distance stayed at 80 km. The person stopped (rested) for 1 hour.",
                            "**Leg 3 (3-5 hrs)**: Distance went from 80 km back to 0 km. The person returned home in 2 hours."
                        ],
                        final_answer: "Outward journey of 80km, 1 hour rest, then return journey home."
                    }
                ]
            },
            {
                title: '2. Speed, Distance, and Time',
                content: "## The Formula Triangle\n\n- **Speed** = Distance ÷ Time ($S = \\frac{D}{T}$)\n- **Distance** = Speed × Time ($D = S \\times T$)\n- **Time** = Distance ÷ Speed ($T = \\frac{D}{S}$)\n\n## Calculation from Graphs\n\nTo find speed from a graph section, calculate the **gradient**:\n$$\\text{Speed} = \\frac{\\text{Vertical Change (Distance)}}{\\text{Horizontal Change (Time)}}$$\n\n## Unit Conversions\n\nSometimes you need to convert between km/h and m/s:\n- **km/h $\\rightarrow$ m/s**: Divide by 3.6\n- **m/s $\\rightarrow$ km/h**: Multiply by 3.6\n\nExample: $72 \\text{ km/h} = 72 \\div 3.6 = 20 \\text{ m/s}$.",
                worked_examples: [
                    {
                        question: "A bus travels 150 km in 2 hours 30 minutes. Calculate its average speed in km/h.",
                        steps: [
                            "Convert time to hours: 2 hours 30 mins = $2.5$ hours.",
                            "Use Formula: $S = \\frac{D}{T}$",
                            "$S = \\frac{150}{2.5} = 60$"
                        ],
                        final_answer: "Average speed = 60 km/h"
                    },
                    {
                        question: "Calculate the speed represented by a line segment starting at (1, 20) and ending at (3, 100) on a distance (km) vs time (h) graph.",
                        steps: [
                            "Change in Distance (Rise) = $100 - 20 = 80$ km",
                            "Change in Time (Run) = $3 - 1 = 2$ hours",
                            "Gradient = $\\frac{80}{2} = 40$"
                        ],
                        final_answer: "The speed is 40 km/h"
                    }
                ]
            },
            {
                title: '3. Interpreting Complex Journeys',
                content: "## Average Speed\n\nAverage Speed is **Total Distance Divided by Total Time**.\n\n> **Warning:** Do not just average the speeds of different legs. You must use total distance and total time (including stops).\n\n## Meeting Points\n\nIf two travellers are plotted on the same axes:\n- The point where their lines **cross** (intersect) is where they meet or pass each other.\n- The coordinates of this point give the **time** they meet and the **distance** from the start.",
                worked_examples: [
                    {
                        question: "A car travels 100 km at 50 km/h, stops for 1 hour, then travels another 100 km at 100 km/h. Calculate the average speed for the whole journey.",
                        steps: [
                            "**Leg 1 Time**: $T = \\frac{100}{50} = 2$ hours.",
                            "**Rest Time**: 1 hour.",
                            "**Leg 2 Time**: $T = \\frac{100}{100} = 1$ hour.",
                            "**Total Time** = $2 + 1 + 1 = 4$ hours.",
                            "**Total Distance** = $100 + 100 = 200$ km.",
                            "**Average Speed** = $\\frac{200}{4} = 50$ km/h."
                        ],
                        final_answer: "Average Speed = 50 km/h"
                    }
                ]
            },
            {
                title: '4. Drawing Travel Graphs',
                content: "## Steps to Draw\n\n1. **Setup Axes**: Time on x-axis (bottom), Distance on y-axis (side). Choose a good scale.\n2. **Plot Points**: meaningful points like start, stops, and end.\n3. **Connect**: Use specific lines:\n   - Straight diagonal for steady speed.\n   - Flat horizontal for stops.\n   - Steeper diagonal for faster speed.\n\n## Common Exam Task\n\nOften you are given a story (e.g., \"Walks to school, waits, runs home\") and asked to sketch it.\n- Remember that running is faster than walking, so the 'run' line should be steeper than the 'walk' line.",
                worked_examples: [
                    {
                        question: "Tendai cycles 20 km in 1 hour, rests for 30 mins, then cycles back home in 2 hours. Draw the graph.",
                        steps: [
                            "**Leg 1**: Start at (0,0). Go to (1, 20). Draw line.",
                            "**Rest**: From (1, 20) draw flat line to (1.5, 20) representing 30 mins.",
                            "**Return**: From (1.5, 20) draw line down to (3.5, 0). (Since return took 2 hrs, $1.5 + 2 = 3.5$).",
                            "Label axes: Time (h) and Distance (km)."
                        ],
                        final_answer: "Graph showing upward slope, flat section, then downward slope returning to x-axis at 3.5h."
                    }
                ]
            }
        ],
        key_points: [
            "Gradient of Distance-Time graph = **Speed**.",
            "Horizontal line = **Stationary** (Stopped).",
            "Average Speed = Total Distance ÷ Total Time.",
            "To convert km/h to m/s, divide by 3.6.",
            "Intersection of two graphs = Meeting point."
        ],
        exam_tips: [
            "Always include the rest time when calculating Total Time for average speed.",
            "Check units carefully! If speed is in km/h but time is in minutes, convert minutes to hours first (divide by 60).",
            "A returning journey line goes down, but speed is still positive (speed is a scalar).",
            "Use a ruler for all straight sections of the graph."
        ],
        visual_descriptions: [
            "Distance-Time graph showing three stages: outward journey, rest stop, and return journey.",
            "Formula triangle for Speed (S), Distance (D), and Time (T).",
            "Intersection of two lines showing where a fast car overtakes a slow truck."
        ]
    },

    // ============================================
    // TOPIC 14: SYMBOLIC EXPRESSION
    // ============================================
    'Symbolic Expression': {
        topic: 'Symbolic Expression',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "Symbolic Expression (Algebra) involves using letters to represent numbers and quantities. This is the foundation of algebra. The ZIMSEC syllabus requires students to understand the concept of a variable, substitute numerical values into algebraic expressions, and translate word problems into algebraic language using letters and symbols.",
        sections: [
            {
                title: '1. Introduction to Algebra',
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Intro_to_Algebra.mp4',
                content: "## What is Algebra?\n\nAlgebra is a branch of mathematics where we use letters (like $x, y, a, b$) to represent numbers whose values we don't know yet or can change.\n\n## Key Terms\n\n- **Variable (Pronumeral)**: A letter used to represent a number (e.g., $x$).\n- **Constant**: A fixed number on its own (e.g., in $2x + 5$, '5' is the constant).\n- **Coefficient**: A number multiplying a variable (e.g., in $3y$, '3' is the coefficient).\n- **Term**: A part of an expression separated by + or - signs (e.g., $2x + 5y$ has two terms).\n- **Expression**: A collection of terms with no equals sign (e.g., $3x - 2$).\n- **Equation**: A mathematical statement with an equals sign (e.g., $3x - 2 = 10$).\n\n## Writing Algebra\n\n- $a \\times b$ is written as $ab$.\n- $3 \\times x$ is written as $3x$ (we leave out the $\\times$ sign).\n- $x \\div 2$ is written as $\\frac{x}{2}$.\n- $1 \\times x$ is just written as $x$.",
                worked_examples: [
                    {
                        question: "Identify the coefficient, variable, and constant in the expression $4m - 7$.",
                        steps: [
                            "**Variable**: The letter used is $m$.",
                            "**Coefficient**: The number multiplying the letter is 4.",
                            "**Constant**: The number on its own is -7 (remember the sign!)."
                        ],
                        final_answer: "Variable: m, Coefficient: 4, Constant: -7"
                    }
                ]
            },
            {
                title: '2. Substitution',
                content: "## Evaluating Expressions\n\n**Substitution** means replacing the letters in an expression with given numbers to calculate a value.\n\n**Steps:**\n1. Replace every letter with its number value (use brackets if negative).\n2. Insert multiplication signs where needed (e.g., change $3x$ to $3 \\times x$).\n3. Calculate the result using BODMAS.",
                worked_examples: [
                    {
                        question: "If $a = 3$, $b = 5$, and $c = -2$, evaluate: (i) $2a + b$ (ii) $b - c$ (iii) $a^2 + 3c$",
                        steps: [
                            "(i) $2a + b = 2(3) + 5 = 6 + 5 = 11$",
                            "(ii) $b - c = 5 - (-2) = 5 + 2 = 7$",
                            "(iii) $a^2 + 3c = (3)^2 + 3(-2) = 9 - 6 = 3$"
                        ],
                        final_answer: "(i) 11, (ii) 7, (iii) 3"
                    }
                ]
            },
            {
                title: '3. Forming Expressions',
                content: "## From Words to Algebra\n\nWe translate English sentences into mathematical symbols.\n\n| Words | Operation | Algebra |\n|---|---|---|\n| Sum of $x$ and 5 | Add | $x + 5$ |\n| Difference between $y$ and 3 | Subtract | $y - 3$ |\n| Product of 4 and $p$ | Multiply | $4p$ |\n| Quotient of $k$ divided by 2 | Divide | $\\frac{k}{2}$ |\n| Double a number $n$ | Multiply by 2 | $2n$ |\n| Square of $x$ | Power | $x^2$ |",
                worked_examples: [
                    {
                        question: "Write an algebraic expression for: 'Think of a number $x$, multiply it by 3, then subtract 5.'",
                        steps: [
                            "Think of a number: $x$",
                            "Multiply by 3: $3x$",
                            "Subtract 5: $3x - 5$"
                        ],
                        final_answer: "$3x - 5$"
                    },
                    {
                        question: "If a pen costs $p$ dollars and a book costs $b$ dollars, write an expression for calculation of the cost of 2 pens and 3 books.",
                        steps: [
                            "Cost of 2 pens = $2 \\times p = 2p$",
                            "Cost of 3 books = $3 \\times b = 3b$",
                            "Total cost = Add them together"
                        ],
                        final_answer: "$(2p + 3b)$ dollars"
                    }
                ]
            }
        ],
        key_points: [
            "A **variable** is a letter representing an unknown number.",
            "In algebra, we usually hide the multiplication sign: $2 \\times x = 2x$.",
            "**Substitution** involves replacing variables with numbers to find a value.",
            "Always follow **BODMAS** when evaluating expressions.",
            "Minus signs belong to the number they are in front of."
        ],
        exam_tips: [
            "Use brackets when substituting negative numbers to avoid sign errors: $x = -3 \\rightarrow x^2 = (-3)^2 = 9$.",
            "Don't confuse $2x$ (multiply by 2) with $x^2$ (square).",
            "Read word problems carefully: 'subtract 5 from x' means $x - 5$, NOT $5 - x$."
        ],
        visual_descriptions: [
            "A diagram showing parts of an expression: 3x + 5 (Coefficient, Variable, Constant labelled)",
            "Step-by-step substitution process flow substituting x=2 into 3x+1",
            "Table matching English phrases (Sum, Difference, Product) to Math symbols (+, -, x)"
        ]
    },

    // ============================================
    // TOPIC 15: ALGEBRAIC MANIPULATION
    // ============================================
    'Algebraic Manipulation': {
        topic: 'Algebraic Manipulation',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "Algebraic Manipulation involves simplifying expressions by collecting like terms, multiplying and dividing algebraic terms, expanding brackets, and factorising simple expressions. Mastery of these skills is essential for solving equations and handling more complex algebraic problems in ZIMSEC mathematics.",
        sections: [
            {
                title: '1. Collecting Like Terms',
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Collecting_Like_Terms.mp4',
                content: "## What are Like Terms?\n\n**Like terms** are terms that contain exactly the same variable(s) raised to the same power. Only the coefficient (number in front) can be different.\n\n- **Like Terms**: $2x$ and $5x$; $3ab$ and $-ab$; $4x^2$ and $x^2$\n- **Unlike Terms**: $2x$ and $2y$; $x$ and $x^2$; $3ab$ and $3a$\n\n## Simplifying Expressions\n\nYou can only add or subtract **like terms**. Unlike terms stay separate.\n\n**Rule:** Add/subtract the coefficients and keep the variable the same.\n\nExample: $2a + 3a = 5a$ (Think: 2 apples + 3 apples = 5 apples)",
                worked_examples: [
                    {
                        question: "Simplify: $3x + 4y - x + 2y$",
                        steps: [
                            "Identify like terms: ($3x$ and $-x$) and ($4y$ and $+2y$).",
                            "Group them (take the sign in front!): $(3x - x) + (4y + 2y)$.",
                            "Simplify: $2x + 6y$."
                        ],
                        final_answer: "$2x + 6y$"
                    },
                    {
                        question: "Simplify: $5a + 2b - 3a + 4$",
                        steps: [
                            "Like terms: $5a$ and $-3a$.",
                            "$2b$ has no like term. $4$ is a constant, no like term.",
                            "Combine: $5a - 3a = 2a$.",
                            "Write final expression: $2a + 2b + 4$."
                        ],
                        final_answer: "$2a + 2b + 4$"
                    }
                ]
            },
            {
                title: '2. Multiplying and Dividing Terms',
                content: "## Multiplication Rules\n\n1. Multiply the numbers (coefficients) first.\n2. Multiply the variables (letters) next. $a \\times a = a^2$.\n\nExample: $2x \\times 3y = 6xy$\n\n## Division Rules\n\n1. Divide the numbers.\n2. Cancel out common variables (like simplifying fractions).\n\nExample: $\\frac{6xy}{2x} = 3y$ (6÷2=3, x cancels out).",
                worked_examples: [
                    {
                        question: "Simplify: (a) $4a \\times 3b$ (b) $2x \\times 5x$ (c) $\\frac{12ab}{4a}$",
                        steps: [
                            "(a) $4 \\times 3 = 12$, $a \\times b = ab$. Result: $12ab$.",
                            "(b) $2 \\times 5 = 10$, $x \\times x = x^2$. Result: $10x^2$.",
                            "(c) $12 \\div 4 = 3$. The 'a' cancels out. Result: $3b$."
                        ],
                        final_answer: "(a) $12ab$, (b) $10x^2$, (c) $3b$"
                    }
                ]
            },
            {
                title: '3. Expanding Brackets',
                content: "## The Distributive Law\n\n**Expanding brackets** means multiplying the term outside the bracket by **every** term inside the bracket.\n\n$$a(b + c) = ab + ac$$\n\nBe careful with negative signs!\n- A positive $\\times$ negative = negative\n- A negative $\\times$ negative = positive",
                worked_examples: [
                    {
                        question: "Expand: (a) $3(x + 4)$ (b) $2(3x - 5)$ (c) $-4(x - 2)$",
                        steps: [
                            "(a) $3 \\times x = 3x$, $3 \\times 4 = 12$. Result: $3x + 12$.",
                            "(b) $2 \\times 3x = 6x$, $2 \\times -5 = -10$. Result: $6x - 10$.",
                            "(c) $-4 \\times x = -4x$, $-4 \\times -2 = +8$. Result: $-4x + 8$."
                        ],
                        final_answer: "(a) $3x + 12$ (b) $6x - 10$ (c) $-4x + 8$"
                    }
                ]
            },
            {
                title: '4. Factorisation by HCF',
                content: "## What is Factorisation?\n\nFactorisation is the **reverse of expanding**. It puts brackets back into an expression.\n\n**Steps:**\n1. Find the Highest Common Factor (HCF) of numbers and letters.\n2. Put the HCF outside the bracket.\n3. Divide each term by the HCF to find what goes inside.",
                worked_examples: [
                    {
                        question: "Factorise completely: $6x + 9$",
                        steps: [
                            "HCF of 6 and 9 is 3.",
                            "Write 3 outside bracket: $3( ... )$",
                            "Divide terms: $6x \\div 3 = 2x$ and $9 \\div 3 = 3$.",
                            "Fill bracket: $3(2x + 3)$."
                        ],
                        final_answer: "$3(2x + 3)$"
                    },
                    {
                        question: "Factorise: $4x^2 - 10x$",
                        steps: [
                            "HCF of numbers 4 and 10 is 2.",
                            "HCF of letters $x^2$ and $x$ is $x$.",
                            "Total HCF is $2x$.",
                            "Divide: $\\frac{4x^2}{2x} = 2x$ and $\\frac{-10x}{2x} = -5$.",
                            "Result: $2x(2x - 5)$."
                        ],
                        final_answer: "$2x(2x - 5)$"
                    }
                ]
            }
        ],
        key_points: [
            "Only add or subtract terms that are exactly alike (same letters, same powers).",
            "When multiplying terms, multiply numbers and combine letters ($x \\times x = x^2$).",
            "When expanding $a(b+c)$, multiply $a$ by $b$ AND $a$ by $c$.",
            "Factorisation is the opposite of expansion — always look for the HCF first.",
            "Watch out for negative signs when expanding brackets."
        ],
        exam_tips: [
            "Always simplify your final answer by collecting like terms if possible.",
            "In factorisation, you can check your answer by expanding the brackets again.",
            "$x$ by itself has a coefficient of 1 (so $x + x = 2x$).",
            "Don't change powers when adding: $x + x = 2x$, but $x \\times x = x^2$."
        ],
        visual_descriptions: [
            "Diagram separating 'Like terms' vs 'Unlike terms' using fruit icons (2 apples + 3 apples vs 2 apples + 3 bananas).",
            "Arrows showing the distributive law for expansion: a(b+c) -> ab + ac.",
            "Flowchart for factorisation: Find HCF -> Place outside () -> Divide terms."
        ]
    },

    // ============================================
    // TOPIC 16: EQUATIONS
    // ============================================
    'Equations': {
        topic: 'Equations',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "An equation is a mathematical statement that two expressions are equal. Solving an equation means finding the value of the unknown variable that makes the statement true. This topic covers solving linear equations, equations with brackets, and translating word problems into equations.",
        sections: [
            {
                title: '1. Solving Simple Equations',
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Solving_Equations.mp4',
                content: "## The Balance Method\n\nAn equation is like a balanced scale. Whatever you do to one side, you must do to the other side to keep it equal.\n\n**Goal: Get the variable (e.g., $x$) alone on one side.**\n\n**Inverse Operations:**\n- Addition (+) $\\leftrightarrow$ Subtraction (-)\n- Multiplication ($\\times$) $\\leftrightarrow$ Division ($\\div$)",
                worked_examples: [
                    {
                        question: "Solve for $x$: $x + 5 = 12$",
                        steps: [
                            "Inverse of +5 is -5.",
                            "Subtract 5 from both sides: $x + 5 - 5 = 12 - 5$.",
                            "$x = 7$."
                        ],
                        final_answer: "$x = 7$"
                    },
                    {
                        question: "Solve for $y$: $3y = 15$",
                        steps: [
                            "Inverse of multiply by 3 is divide by 3.",
                            "Divide both sides by 3: $\\frac{3y}{3} = \\frac{15}{3}$.",
                            "$y = 5$."
                        ],
                        final_answer: "$y = 5$"
                    }
                ]
            },
            {
                title: '2. Two-Step Equations',
                content: "## Order of Operations\n\nWhen identifying 'what happened to $x$', reverse the order to solve it.\n\nExample: $2x + 3 = 11$\n- $x$ was multiplied by 2, then 3 was added.\n- To solve: Subtract 3 first, then divide by 2.",
                worked_examples: [
                    {
                        question: "Solve: $2x + 4 = 14$",
                        steps: [
                            "Step 1: Subtract 4 from both sides.\n   $2x = 14 - 4$\n   $2x = 10$",
                            "Step 2: Divide by 2.\n   $x = \\frac{10}{2}$",
                            "Answer: $x = 5$"
                        ],
                        final_answer: "$x = 5$"
                    },
                    {
                        question: "Solve: $\\frac{x}{3} - 2 = 4$",
                        steps: [
                            "Step 1: Add 2 to both sides (remove subtraction first).\n   $\\frac{x}{3} = 4 + 2$\n   $\\frac{x}{3} = 6$",
                            "Step 2: Multiply by 3.\n   $x = 6 \\times 3$",
                            "Answer: $x = 18$"
                        ],
                        final_answer: "$x = 18$"
                    }
                ]
            },
            {
                title: '3. Equations with Brackets',
                content: "## Steps to Solve\n\n1. **Expand** the brackets first.\n2. **Simplify** if necessary.\n3. **Solve** the resulting linear equation.",
                worked_examples: [
                    {
                        question: "Solve: $3(x + 2) = 21$",
                        steps: [
                            "Expand brackets: $3 \\times x + 3 \\times 2 = 21 \\rightarrow 3x + 6 = 21$.",
                            "Subtract 6: $3x = 21 - 6 \\rightarrow 3x = 15$.",
                            "Divide by 3: $x = 5$."
                        ],
                        final_answer: "$x = 5$"
                    }
                ]
            },
            {
                title: '4. Forming and Solving Equations',
                content: "## Word Problems\n\n1. Define a variable (let the unknown be $x$).\n2. Write an equation from the story.\n3. Solve the equation.",
                worked_examples: [
                    {
                        question: "I think of a number, multiply it by 4, and add 3. The result is 23. Find the number.",
                        steps: [
                            "Let the number be $x$.",
                            "Multiply by 4: $4x$. Add 3: $4x + 3$.",
                            "The result is 23, so equation is: $4x + 3 = 23$.",
                            "Subtract 3: $4x = 20$.",
                            "Divide by 4: $x = 5$."
                        ],
                        final_answer: "The number is 5."
                    }
                ]
            }
        ],
        key_points: [
            "An equation must have an equals sign ($=$).",
            "To solve, do the same operation to both sides (balance method).",
            "General order: Remove additions/subtractions first, then multiplications/divisions.",
            "Expand brackets before solving if the variable is inside.",
            "Always check your answer by substituting it back into the original equation."
        ],
        exam_tips: [
            "Show your working step-by-step (marks are given for method).",
            "If the answer is a fraction, leave it as a fraction unless asked for decimals.",
            "For word problems, clearly state 'Let x be...' at the start.",
            "Check signs carefully when moving terms across the equals sign."
        ],
        visual_descriptions: [
            "A balance scale showing '2x + 3' on one side and '11' on the other being kept level.",
            "Flowchart showing the 'onion peeling' method: identifying operations and reversing them.",
            "Steps for solving 3(x+2) = 15: Expand -> Subtract -> Divide."
        ]
    },

    // ============================================
    // TOPIC 17: ANGLES AND LINES
    // ============================================
    'Angles and Lines': {
        topic: 'Angles and Lines',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "Angles and Lines is a foundational geometry topic. It covers types of angles, angle relationships (at a point, on a straight line, vertically opposite), and angle properties formed by parallel lines cut by a transversal (corresponding, alternate, and co-interior angles). These are essential tools for all further geometric work in the ZIMSEC syllabus.",
        sections: [
            {
                title: '1. Types of Angles',
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Angles_and_Lines.mp4',
                content: "## Defining an Angle\n\nAn **angle** is formed when two straight lines (rays) meet at a point called the **vertex**. Angles are measured in **degrees** (°).\n\n## Types of Angles\n\n| Angle Type | Degree Range | Description |\n|---|---|---|\n| **Zero Angle** | $= 0°$ | No rotation |\n| **Acute Angle** | $0° < x < 90°$ | Sharp angle |\n| **Right Angle** | $= 90°$ | Perfect corner (shown with a square) |\n| **Obtuse Angle** | $90° < x < 180°$ | Blunt angle |\n| **Straight Angle** | $= 180°$ | A straight line |\n| **Reflex Angle** | $180° < x < 360°$ | More than a half-turn |\n| **Full Rotation** | $= 360°$ | Complete turn |\n\n## Complementary and Supplementary Angles\n\n- **Complementary**: Two angles that add up to exactly **90°**.\n   e.g., 35° and 55° are complementary.\n- **Supplementary**: Two angles that add up to exactly **180°**.\n   e.g., 110° and 70° are supplementary.",
                worked_examples: [
                    {
                        question: "Classify each angle: (a) $35°$ (b) $145°$ (c) $90°$ (d) $210°$",
                        steps: [
                            "(a) $35°$: Less than 90° → **Acute**",
                            "(b) $145°$: Between 90° and 180° → **Obtuse**",
                            "(c) $90°$: Exactly 90° → **Right Angle**",
                            "(d) $210°$: Between 180° and 360° → **Reflex**"
                        ],
                        final_answer: "(a) Acute (b) Obtuse (c) Right Angle (d) Reflex"
                    }
                ]
            },
            {
                title: '2. Angle Relationships',
                content: "## Angles on a Straight Line\n\nAll angles on one side of a straight line add up to **180°**.\n\n$$a + b + c = 180°$$\n\n## Angles at a Point\n\nAll angles around a single point add up to **360°**.\n\n$$a + b + c + d = 360°$$\n\n## Vertically Opposite Angles\n\nWhen two lines cross, they form **two pairs** of vertically opposite angles. Vertically opposite angles are **equal**.\n\n$$a = c \\quad \\text{and} \\quad b = d$$",
                worked_examples: [
                    {
                        question: "Two lines intersect forming angles. One angle is $72°$. Find the other three angles.",
                        steps: [
                            "The vertically opposite angle to $72°$ is also $72°$.",
                            "The adjacent angles are supplementary (on a straight line).",
                            "Adjacent angles = $180° - 72° = 108°$.",
                            "The fourth angle (opposite to 108°) is also $108°$."
                        ],
                        final_answer: "The four angles are $72°, 108°, 72°, 108°$."
                    },
                    {
                        question: "Angles at a point are $2x$, $3x$, and $x$. Find $x$.",
                        steps: [
                            "Angles at a point sum to $360°$.",
                            "$2x + 3x + x = 360°$",
                            "$6x = 360°$",
                            "$x = 60°$"
                        ],
                        final_answer: "$x = 60°$"
                    }
                ]
            },
            {
                title: '3. Parallel Lines and a Transversal',
                content: "## What is a Transversal?\n\nA **transversal** is a line that cuts across two or more parallel lines.\n\n## Key Angle Pairs (using the letter mnemonic)\n\n- **Corresponding Angles (F-angles)**: Located in the same position at each intersection. They are **equal**.\n$$\\angle a = \\angle e$$\n\n- **Alternate Angles (Z-angles)**: Located on opposite sides of the transversal, between the parallel lines. They are **equal**.\n$$\\angle c = \\angle f$$\n\n- **Co-interior (Allied) Angles (C-angles)**: Located on the same side of the transversal, between the parallel lines. They are **supplementary** (add up to 180°).\n$$\\angle c + \\angle e = 180°$$\n\n> **Memory Tip:** F = equal, Z = equal, C = supplementary (180°).",
                worked_examples: [
                    {
                        question: "Two parallel lines are cut by a transversal. One angle is $65°$. Find the corresponding, alternate, and co-interior angles.",
                        steps: [
                            "Given angle = $65°$",
                            "**Corresponding angle** = $65°$ (F-angles, equal)",
                            "**Alternate angle** = $65°$ (Z-angles, equal)",
                            "**Co-interior angle** = $180° - 65° = 115°$ (C-angles, supplementary)"
                        ],
                        final_answer: "Corresponding: $65°$, Alternate: $65°$, Co-interior: $115°$"
                    }
                ]
            }
        ],
        key_points: [
            "Acute < 90°, Right = 90°, Obtuse is between 90° and 180°, Reflex > 180°.",
            "Angles on a straight line sum to **180°**.",
            "Angles at a point sum to **360°**.",
            "Vertically opposite angles are **equal**.",
            "In parallel lines: Corresponding (F) = equal, Alternate (Z) = equal, Co-interior (C) = 180°."
        ],
        exam_tips: [
            "Always give a reason for every angle you calculate (e.g., 'vertically opposite angles', 'angles on a straight line').",
            "Use the F, Z, and C shapes to remember corresponding, alternate, and co-interior angles.",
            "If lines are NOT stated to be parallel, do not use the F, Z, C rules. You must be told they are parallel."
        ],
        visual_descriptions: [
            "Diagram showing all 7 types of angles from 0° to 360° with labels.",
            "Two parallel lines cut by a transversal, with F, Z, and C angle pairs highlighted.",
            "Two intersecting lines showing the four angles formed, labelling vertically opposite pairs."
        ]
    },

    // ============================================
    // TOPIC 18: POLYGONS
    // ============================================
    'Polygons': {
        topic: 'Polygons',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "Polygons are closed, flat shapes made of straight sides. This topic covers the properties of triangles (sides, angles, types), the properties of quadrilaterals (parallelogram, rectangle, rhombus, square, kite, trapezium), and the rules for calculating interior and exterior angles of any polygon.",
        sections: [
            {
                title: '1. Triangles',
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Polygons.mp4',
                content: "## The Angle Sum of a Triangle\n\nThe three interior angles of **any triangle** always add up to **180°**.\n\n$$\\angle A + \\angle B + \\angle C = 180°$$\n\n## Types of Triangles\n\n| Type | Description |\n|---|---|\n| **Equilateral** | All 3 sides equal, all 3 angles = $60°$ |\n| **Isosceles** | 2 sides equal, 2 base angles equal |\n| **Scalene** | All 3 sides different, all 3 angles different |\n| **Right-angled** | Has one angle of exactly $90°$ |\n\n## The Exterior Angle Theorem\n\nAn exterior angle of a triangle equals the **sum of the two non-adjacent interior angles**.\n\n$$\\text{Exterior angle} = \\angle A + \\angle B$$",
                worked_examples: [
                    {
                        question: "A triangle has angles $42°$ and $87°$. Find the third angle.",
                        steps: [
                            "Sum of angles in a triangle = $180°$.",
                            "Third angle = $180° - 42° - 87°$",
                            "Third angle = $51°$"
                        ],
                        final_answer: "Third angle = $51°$"
                    },
                    {
                        question: "An isosceles triangle has a base angle of $52°$. Find the apex angle.",
                        steps: [
                            "In an isosceles triangle, the two base angles are equal.",
                            "Both base angles = $52°$",
                            "Apex angle = $180° - 52° - 52° = 76°$"
                        ],
                        final_answer: "Apex angle = $76°$"
                    }
                ]
            },
            {
                title: '2. Quadrilaterals',
                content: "## The Angle Sum\n\nThe four interior angles of any quadrilateral always add up to **360°**.\n\n## Properties of Common Quadrilaterals\n\n| Shape | Sides | Angles | Diagonals |\n|---|---|---|---|\n| **Square** | All 4 sides equal | All 90° | Equal, bisect at right angles |\n| **Rectangle** | Opposite sides equal | All 90° | Equal, bisect each other |\n| **Parallelogram** | Opposite sides equal and parallel | Opposite angles equal | Bisect each other |\n| **Rhombus** | All 4 sides equal, opposite sides parallel | Opposite angles equal | Bisect at right angles |\n| **Trapezium** | One pair of parallel sides | - | - |\n| **Kite** | Two pairs of adjacent equal sides | One pair of opposite angles equal | One bisects the other at right angles |",
                worked_examples: [
                    {
                        question: "A parallelogram has angles $68°$, $112°$, $68°$ and one unknown. Find the unknown angle.",
                        steps: [
                            "Angles in a quadrilateral sum to $360°$.",
                            "Unknown = $360° - 68° - 112° - 68°$",
                            "Unknown = $112°$"
                        ],
                        final_answer: "The unknown angle is $112°$."
                    }
                ]
            },
            {
                title: '3. Interior and Exterior Angles of Any Polygon',
                content: "## Sum of Interior Angles\n\nFor a polygon with **$n$ sides**:\n\n$$\\text{Sum of interior angles} = (n - 2) \\times 180°$$\n\n**Examples:**\n- Triangle ($n=3$): $(3-2) \\times 180° = 180°$\n- Quadrilateral ($n=4$): $(4-2) \\times 180° = 360°$\n- Pentagon ($n=5$): $(5-2) \\times 180° = 540°$\n- Hexagon ($n=6$): $(6-2) \\times 180° = 720°$\n\n## Sum of Exterior Angles\n\nFor **any** polygon, the sum of exterior angles always equals **360°**, regardless of the number of sides.\n\n## Regular Polygons\n\nIn a **regular polygon**, all sides and all angles are equal.\n\n$$\\text{Each interior angle} = \\frac{(n-2) \\times 180°}{n}$$\n$$\\text{Each exterior angle} = \\frac{360°}{n}$$",
                worked_examples: [
                    {
                        question: "Find each interior angle of a regular hexagon.",
                        steps: [
                            "A hexagon has $n = 6$ sides.",
                            "Sum of interior angles = $(6-2) \\times 180° = 4 \\times 180° = 720°$",
                            "Each interior angle (regular) = $\\frac{720°}{6} = 120°$"
                        ],
                        final_answer: "Each interior angle = $120°$"
                    },
                    {
                        question: "The exterior angle of a regular polygon is $45°$. How many sides does it have?",
                        steps: [
                            "Sum of exterior angles = $360°$.",
                            "Number of sides = $\\frac{360°}{\\text{each exterior angle}}$",
                            "$n = \\frac{360°}{45°} = 8$"
                        ],
                        final_answer: "The polygon has **8 sides** (an octagon)."
                    }
                ]
            }
        ],
        key_points: [
            "Sum of angles in a triangle = $180°$.",
            "Sum of angles in any quadrilateral = $360°$.",
            "Sum of interior angles of an $n$-sided polygon = $(n-2) \\times 180°$.",
            "Sum of **exterior** angles of any polygon is always $360°$.",
            "Isosceles triangle: 2 equal sides, 2 equal base angles.",
            "Equilateral triangle: all sides equal, all angles $60°$."
        ],
        exam_tips: [
            "Always state which angle property you're using (e.g., 'angles in a triangle sum to $180°$').",
            "For the exterior angle theorem: the exterior angle = sum of the two **non-adjacent** interior angles.",
            "Test if a shape is a parallelogram: opposite sides parallel AND equal."
        ],
        visual_descriptions: [
            "Diagram showing all triangle types (Equilateral, Isosceles, Scalene, Right-angled) with labels.",
            "A summary table of quadrilateral properties with shape icons.",
            "A regular hexagon showing one interior angle of 120° and one exterior angle of 60°."
        ]
    },

    // ============================================
    // TOPIC 19: SYMMETRY
    // ============================================
    'Symmetry': {
        topic: 'Symmetry',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "Symmetry describes the balanced quality of a shape. This topic covers line symmetry (also called reflective symmetry), where a shape can be folded along a mirror line to produce two identical halves, and rotational symmetry, where a shape looks the same after being rotated by less than a full turn about its centre.",
        sections: [
            {
                title: '1. Line Symmetry',
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Symmetry.mp4',
                content: "## What is a Line of Symmetry?\n\nA **line of symmetry** (also called a **mirror line**) divides a shape into two congruent (identical) halves. If you fold the shape along the line, the two halves match exactly.\n\n## Lines of Symmetry in Common Shapes\n\n| Shape | Lines of Symmetry |\n|---|---|\n| Equilateral Triangle | 3 |\n| Isosceles Triangle | 1 |\n| Square | 4 |\n| Rectangle | 2 |\n| Rhombus | 2 |\n| Circle | Infinite |\n| Kite | 1 |\n| Scalene Triangle | 0 |\n| Parallelogram | 0 |\n\n> **Key Point:** A shape **can have lines of symmetry but no rotational symmetry**, and vice versa.",
                worked_examples: [
                    {
                        question: "How many lines of symmetry does a regular pentagon have?",
                        steps: [
                            "A regular pentagon has 5 equal sides and 5 equal angles.",
                            "Each line of symmetry goes from a vertex to the midpoint of the opposite side.",
                            "Number of lines = 5 (one for each vertex)."
                        ],
                        final_answer: "A regular pentagon has **5 lines of symmetry**."
                    }
                ]
            },
            {
                title: '2. Rotational Symmetry',
                content: "## What is Rotational Symmetry?\n\nA shape has **rotational symmetry** if it looks exactly the same after being rotated by some angle less than 360° about its **centre of rotation**.\n\n## Order of Rotational Symmetry\n\nThe **order** of rotational symmetry is the number of times a shape looks identical during a complete (360°) rotation.\n\n- A shape with **order 1** has NO rotational symmetry (it only looks the same at 360°).\n- All regular polygons have rotational symmetry equal to the number of sides.\n\n$$\\text{Angle of rotation} = \\frac{360°}{\\text{order}}$$\n\n| Shape | Order of Rotational Symmetry |\n|---|---|\n| Equilateral Triangle | 3 (rotates 120° each time) |\n| Square | 4 (rotates 90° each time) |\n| Rectangle | 2 (rotates 180° each time) |\n| Rhombus | 2 |\n| Parallelogram | 2 |\n| Regular Pentagon | 5 |\n| Circle | Infinite |",
                worked_examples: [
                    {
                        question: "A regular hexagon has order of rotational symmetry of 6. At what angles does it look the same?",
                        steps: [
                            "Angle of rotation = $\\frac{360°}{6} = 60°$",
                            "The hexagon looks the same at: $60°, 120°, 180°, 240°, 300°, 360°$"
                        ],
                        final_answer: "The hexagon looks the same after rotations of $60°, 120°, 180°, 240°, 300°$, and $360°$."
                    }
                ]
            }
        ],
        key_points: [
            "A **line of symmetry** divides a shape into two mirror-image halves.",
            "A **regular polygon** with $n$ sides has $n$ lines of symmetry and rotational symmetry of order $n$.",
            "A **parallelogram** has zero lines of symmetry but has rotational symmetry of order 2.",
            "A **scalene triangle** has NO symmetry at all.",
            "The order of rotational symmetry = number of times a shape looks the same in a full 360° rotation."
        ],
        exam_tips: [
            "Do not confuse a parallelogram with a rectangle: rectangles have 2 lines of symmetry, parallelograms have none.",
            "A shape always has at least rotational symmetry of order 1 (the full 360° turn), but we say it has 'no rotational symmetry' if order = 1."
        ],
        visual_descriptions: [
            "Diagram of a rectangle with its 2 lines of symmetry (horizontal and vertical) shown as dashed lines.",
            "Table showing shapes alongside their number of lines of symmetry and order of rotational symmetry.",
            "A regular hexagon showing the 60° rotation that maps it onto itself."
        ]
    },

    // ============================================
    // TOPIC 20: CONSTRUCTIONS
    // ============================================
    'Constructions': {
        topic: 'Constructions',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "Geometric constructions use only a ruler (straightedge) and a compass. In ZIMSEC Form 1, students are required to construct bisectors (of lines and angles), construct angles of 60° and 90°, and construct triangles given specific information (SSS, SAS). Accuracy and neatness of construction arcs are essential for full marks.",
        sections: [
            {
                title: '1. Bisecting a Line Segment',
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Constructions.mp4',
                content: "## What is a Perpendicular Bisector?\n\nA **perpendicular bisector** cuts a line segment into two equal halves at exactly 90°.\n\n## Steps to Bisect Line AB\n\n1. Open compass to **more than half** the length of AB.\n2. Place compass at point **A**, draw arcs above and below the line.\n3. Keeping the same compass width, place at point **B**, draw arcs to intersect the previous ones.\n4. Draw a straight line through the two intersection points.\n\n> This line is the **perpendicular bisector** of AB. Every point on this line is equidistant from A and B.",
                worked_examples: [
                    {
                        question: "Construct the perpendicular bisector of a line segment PQ of length 8 cm.",
                        steps: [
                            "Draw line PQ = 8 cm.",
                            "Open compass to about 5 cm (more than half of 8 cm).",
                            "With centre P, draw arcs above and below PQ.",
                            "With the same radius, centre Q, draw arcs crossing the first set.",
                            "Label intersections as X and Y. Draw line XY.",
                            "XY bisects PQ at right angles at the midpoint M."
                        ],
                        final_answer: "XY is the perpendicular bisector of PQ, crossing at M, the midpoint."
                    }
                ]
            },
            {
                title: '2. Bisecting an Angle',
                content: "## Angle Bisector\n\nAn **angle bisector** divides an angle into two equal halves.\n\n## Steps to Bisect Angle AOB\n\n1. Place compass point at the **vertex O**, draw an arc that crosses BOTH arms (OA and OB). Label the crossing points P and Q.\n2. Place compass at **P**, draw an arc inside the angle.\n3. With **same radius** at Q, draw an arc to intersect the previous one. Label the intersection R.\n4. Draw a line from O through R.\n\n> OR is the angle bisector of $\\angle AOB$. It divides the angle into two equal parts.",
                worked_examples: [
                    {
                        question: "Bisect an angle of 80°.",
                        steps: [
                            "Draw an angle ABC = 80° using a protractor.",
                            "Arc from B crosses BA at P and BC at Q.",
                            "Arcs from P and Q (equal radii) meet at R.",
                            "Draw BR.",
                            "Angle ABR = Angle RBC = 40°."
                        ],
                        final_answer: "BR bisects the 80° angle into two angles of 40° each."
                    }
                ]
            },
            {
                title: '3. Constructing Standard Angles',
                content: "## Constructing 60°\n\n1. Draw a base line. Mark point A.\n2. Open compass to any radius. Draw an arc from A cutting the line at B.\n3. Keeping same radius, place at B and draw an arc crossing the first arc at C.\n4. Draw line AC. Angle BAC = **60°**.\n\n## Constructing 90°\n\n- Construct the **perpendicular bisector** of a line. The angle formed is 90°.\n\n## Constructing Other Angles\n\n- **30°** = Bisect a 60° angle.\n- **45°** = Bisect a 90° angle.\n- **120°** = 2 × 60° angle construction.",
                worked_examples: [
                    {
                        question: "Construct an equilateral triangle with side 5 cm.",
                        steps: [
                            "Draw base AB = 5 cm.",
                            "Open compass to 5 cm. Arc from A.",
                            "Arc from B (same radius). They meet at C.",
                            "Draw AC and BC.",
                            "Triangle ABC is equilateral — all angles 60°, all sides 5 cm."
                        ],
                        final_answer: "Triangle ABC with AB = BC = CA = 5 cm and all angles = 60°."
                    }
                ]
            }
        ],
        key_points: [
            "Constructions use only a **ruler and compass** — no protractor unless instructed.",
            "Always leave your construction **arcs visible** (do not erase!) so the examiner can see your method.",
            "A **perpendicular bisector** divides a line into two equal parts at 90°.",
            "An **angle bisector** divides an angle into two equal smaller angles.",
            "A 60° angle is built by constructing an equilateral triangle arc."
        ],
        exam_tips: [
            "Marks are awarded for arcs being visible. Erasing them loses method marks.",
            "Use a sharp pencil for accuracy — thick lines lose marks.",
            "Label all points (A, B, C, etc.) clearly after each step."
        ],
        visual_descriptions: [
            "Step-by-step diagrams showing construction of a perpendicular bisector with arcs from both endpoints.",
            "Angle bisector construction showing arcs from both arms of the angle meeting inside.",
            "60° construction showing the equilateral triangle arc method."
        ]
    },

    // ============================================
    // TOPIC 21: STATISTICS
    // ============================================
    'Statistics': {
        topic: 'Statistics',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "Statistics is about collecting, organising, displaying, and interpreting data. The ZIMSEC Form 1 syllabus covers tally charts, frequency tables, bar charts, pictograms, and the averages (Mean, Median, Mode) and Range. These data-handling skills are used across many real-world contexts and other subjects.",
        sections: [
            {
                title: '1. Collecting and Organising Data',
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Statistics.mp4',
                content: "## Types of Data\n\n- **Discrete Data**: Counted data with specific values (e.g., number of students, shoe sizes).\n- **Continuous Data**: Measured data that can take any value in a range (e.g., height, mass).\n\n## Tally Charts\n\nA **tally chart** is used to collect raw data. Each item is recorded with a tally mark (/). Every fifth mark is drawn diagonally across four (making a group of 5) for easy counting.\n\n## Frequency Tables\n\nA **frequency table** lists data values alongside their **frequency** (how many times each value occurs). It can be built directly from a tally chart.",
                worked_examples: [
                    {
                        question: "The results of 20 students' scores (out of 5) are: 3, 4, 2, 5, 3, 3, 4, 5, 2, 3, 1, 4, 3, 5, 4, 2, 3, 4, 5, 1. Create a frequency table.",
                        steps: [
                            "List all possible scores: 1, 2, 3, 4, 5.",
                            "Count occurrences of each:\n  Score 1: 2 times\n  Score 2: 3 times\n  Score 3: 6 times\n  Score 4: 5 times\n  Score 5: 4 times",
                            "Total frequency = $2 + 3 + 6 + 5 + 4 = 20$ ✓"
                        ],
                        final_answer: "Frequency table with 5 rows showing scores 1–5 and their frequencies."
                    }
                ]
            },
            {
                title: '2. Statistical Diagrams',
                content: "## Bar Charts\n\nA **bar chart** represents data with rectangular bars. The **height** (for vertical) or **length** (for horizontal) of each bar represents the frequency.\n\n**Rules for drawing bar charts:**\n- Label both axes with titles and units.\n- All bars must have the **same width** with equal spaces between them.\n- The scale on the frequency axis must be uniform.\n\n## Pictograms\n\nA **pictogram** uses symbols or pictures to represent data. A **key** must always be given to show what each symbol represents.\n\nExample: If **1 star = 5 students**, then ★★★ = 15 students.",
                worked_examples: [
                    {
                        question: "A class recorded their favourite fruits: Mango 8, Orange 5, Apple 12, Banana 7. Draw a bar chart.",
                        steps: [
                            "x-axis: Fruit types (Mango, Orange, Apple, Banana).",
                            "y-axis: Number of students (scale: 0 to 14, every 2).",
                            "Draw bars: Mango → height 8, Orange → height 5, Apple → height 12, Banana → height 7.",
                            "Title: 'Favourite Fruits of the Class'."
                        ],
                        final_answer: "Bar chart drawn with 4 bars of appropriate heights."
                    }
                ]
            },
            {
                title: '3. Averages — Mean, Median, and Mode',
                content: "## The Three Averages\n\n### Mode\nThe **mode** is the value that appears **most often** in a data set.\n- If no value repeats, there is no mode.\n- If two values occur equally, both are modes (bimodal).\n\n### Median\nThe **median** is the **middle value** when data is arranged in order.\n- **Odd** number of values: middle one. Position = $\\frac{n+1}{2}$\n- **Even** number of values: average of the two middle values.\n\n### Mean\nThe **mean** (average) is the sum of all values divided by the number of values.\n\n$$\\text{Mean} = \\frac{\\text{Sum of all values}}{\\text{Number of values}}$$\n\n## Range\nThe **range** measures the spread of the data:\n$$\\text{Range} = \\text{Highest value} - \\text{Lowest value}$$",
                worked_examples: [
                    {
                        question: "Find the Mean, Median, Mode, and Range of: $3, 7, 5, 3, 8, 2, 9, 3, 6$",
                        steps: [
                            "**Sort the data**: $2, 3, 3, 3, 5, 6, 7, 8, 9$",
                            "**Mode**: 3 (appears 3 times — the most frequent).",
                            "**Median**: 9 values, middle is 5th. 5th value = **5**.",
                            "**Mean**: Sum = $2+3+3+3+5+6+7+8+9 = 46$. Mean = $\\frac{46}{9} = 5.1$ (to 1.d.p.)",
                            "**Range**: $9 - 2 = 7$"
                        ],
                        final_answer: "Mode = 3, Median = 5, Mean ≈ 5.1, Range = 7"
                    },
                    {
                        question: "Find the median of: $4, 9, 2, 7, 6, 1$ (an even set).",
                        steps: [
                            "Sort: $1, 2, 4, 6, 7, 9$",
                            "6 values (even). Middle two are 3rd and 4th: **4** and **6**.",
                            "Median = $\\frac{4 + 6}{2} = \\frac{10}{2} = 5$"
                        ],
                        final_answer: "Median = 5"
                    }
                ]
            }
        ],
        key_points: [
            "**Mean** = Sum of values ÷ number of values.",
            "**Median** = Middle value of an ordered data set.",
            "**Mode** = Most frequently occurring value.",
            "**Range** = Highest − Lowest.",
            "In a bar chart, all bars must be the same width with equal spacing.",
            "A pictogram must always have a **key**."
        ],
        exam_tips: [
            "Always sort (arrange in order) the data before finding the median.",
            "For the mean, include ALL values (even if repeated) in the sum.",
            "The mode is the value with the highest **frequency**, not the highest value.",
            "The range is NOT an average — it measures spread, not a central value."
        ],
        visual_descriptions: [
            "A bar chart showing favourite fruits with labelled axes and uniform bars.",
            "A pictogram using star symbols with a key showing 1 star = 2 students.",
            "A number line with 9 data values showing the median in the middle position."
        ]
    },
};

