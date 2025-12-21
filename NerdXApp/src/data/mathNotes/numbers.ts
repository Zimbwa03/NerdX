import { MathTopicNotes } from './types';

export const numberNotes: Record<string, MathTopicNotes> = {
    'Real Numbers': {
        topic: 'Real Numbers',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'Real numbers include all rational and irrational numbers. They form the complete number system used in O-Level Mathematics, represented on the number line and denoted by $\\\\mathbb{R}$. This topic covers classification, operations, factors, multiples, HCF, LCM, standard form, number bases, and surds.',
        sections: [
            {
                title: '1. Classification of Real Numbers',
                content: `The **Real Number System** consists of all numbers that can be represented on a number line.

**Natural Numbers** ($\\\\mathbb{N}$):
$$\\\\mathbb{N} = \\\\{1, 2, 3, 4, 5, ...\\\\}$$
These are counting numbers, starting from 1.

**Whole Numbers** ($\\\\mathbb{W}$):
$$\\\\mathbb{W} = \\\\{0, 1, 2, 3, 4, ...\\\\}$$
Natural numbers including zero.

**Integers** ($\\\\mathbb{Z}$):
$$\\\\mathbb{Z} = \\\\{..., -3, -2, -1, 0, 1, 2, 3, ...\\\\}$$
All positive and negative whole numbers, including zero.

**Rational Numbers** ($\\\\mathbb{Q}$):
Numbers that can be expressed as $\\\\frac{p}{q}$ where $p, q \\\\in \\\\mathbb{Z}$ and $q \\\\neq 0$.
- **Terminating decimals**: $0.25 = \\\\frac{1}{4}$
- **Recurring decimals**: $0.\\\\overline{3} = \\\\frac{1}{3}$

**Irrational Numbers** ($\\\\mathbb{Q}'$):
Numbers that **cannot** be expressed as a fraction. Their decimals are non-terminating and non-repeating.
- Examples: $\\\\pi = 3.14159...$, $\\\\sqrt{2} = 1.41421...$, $e = 2.71828...$

**Number Set Hierarchy**:
$$\\\\mathbb{N} \\\\subset \\\\mathbb{W} \\\\subset \\\\mathbb{Z} \\\\subset \\\\mathbb{Q} \\\\subset \\\\mathbb{R}$$`,
                worked_examples: [
                    {
                        question: 'Classify each number: $-5$, $\\\\frac{22}{7}$, $\\\\sqrt{16}$, $\\\\sqrt{7}$, $0.75$, $0.\\\\overline{142857}$',
                        steps: [
                            '$-5$ is an **integer** (also rational: $\\\\frac{-5}{1}$).',
                            '$\\\\frac{22}{7}$ is a **rational number** (expressible as a fraction).',
                            '$\\\\sqrt{16} = 4$ is a **natural number** (perfect square simplifies to whole number).',
                            '$\\\\sqrt{7} \\\\approx 2.6457...$ is **irrational** (non-terminating, non-repeating decimal).',
                            '$0.75 = \\\\frac{3}{4}$ is a **rational number** (terminating decimal).',
                            '$0.\\\\overline{142857} = \\\\frac{1}{7}$ is a **rational number** (recurring decimal).'
                        ],
                        final_answer: 'Integer, Rational, Natural, Irrational, Rational, Rational'
                    },
                    {
                        question: 'List all the integers from the set: $\\\\{-3.5, -2, 0, \\\\frac{7}{2}, 5, \\\\sqrt{9}, \\\\pi\\\\}$',
                        steps: [
                            '$-3.5$ is NOT an integer (has decimal part).',
                            '$-2$ is an integer ✓',
                            '$0$ is an integer ✓',
                            '$\\\\frac{7}{2} = 3.5$ is NOT an integer.',
                            '$5$ is an integer ✓',
                            '$\\\\sqrt{9} = 3$ is an integer ✓',
                            '$\\\\pi \\\\approx 3.14...$ is NOT an integer.'
                        ],
                        final_answer: '$\\\\{-2, 0, 5, \\\\sqrt{9}\\\\}$ or $\\\\{-2, 0, 3, 5\\\\}$'
                    },
                    {
                        question: 'State whether each statement is TRUE or FALSE: (a) All integers are rational (b) All rational numbers are integers (c) $\\\\sqrt{25}$ is irrational',
                        steps: [
                            '(a) TRUE - Any integer $n$ can be written as $\\\\frac{n}{1}$.',
                            '(b) FALSE - $\\\\frac{1}{2}$ is rational but not an integer.',
                            '(c) FALSE - $\\\\sqrt{25} = 5$ which is a natural number.'
                        ],
                        final_answer: '(a) TRUE, (b) FALSE, (c) FALSE'
                    }
                ]
            },
            {
                title: '2. Prime Numbers, Factors & Multiples',
                content: `**Prime Numbers**: Numbers greater than 1 that have exactly **two factors**: 1 and itself.
$$\\\\text{Primes} = \\\\{2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, ...\\\\}$$

**Note**: 1 is **NOT** a prime number. 2 is the **only even** prime.

**Composite Numbers**: Numbers with **more than two factors**.
$$\\\\text{Examples: } 4, 6, 8, 9, 10, 12, 14, 15, ...$$

**Factor**: A number that divides exactly into another number.
$$\\\\text{Factors of 12} = \\\\{1, 2, 3, 4, 6, 12\\\\}$$

**Multiple**: The result of multiplying a number by an integer.
$$\\\\text{Multiples of 5} = \\\\{5, 10, 15, 20, 25, ...\\\\}$$

**Prime Factorization**: Expressing a number as a product of prime factors.
$$60 = 2^2 \\\\times 3 \\\\times 5$$

**Factor Tree Method**:
Start by dividing by the smallest prime, continue until all factors are prime.`,
                worked_examples: [
                    {
                        question: 'Find all the factors of 36.',
                        steps: [
                            'Start from 1: $36 \\\\div 1 = 36$ ✓ → Factors: 1, 36',
                            '$36 \\\\div 2 = 18$ ✓ → Factors: 2, 18',
                            '$36 \\\\div 3 = 12$ ✓ → Factors: 3, 12',
                            '$36 \\\\div 4 = 9$ ✓ → Factors: 4, 9',
                            '$36 \\\\div 5 = 7.2$ ✗',
                            '$36 \\\\div 6 = 6$ ✓ → Factor: 6',
                            'Stop when factors start repeating.'
                        ],
                        final_answer: 'Factors of 36 = $\\\\{1, 2, 3, 4, 6, 9, 12, 18, 36\\\\}$'
                    },
                    {
                        question: 'Express 180 as a product of prime factors.',
                        steps: [
                            '$180 \\\\div 2 = 90$',
                            '$90 \\\\div 2 = 45$',
                            '$45 \\\\div 3 = 15$',
                            '$15 \\\\div 3 = 5$',
                            '$5 \\\\div 5 = 1$',
                            'Primes used: $2, 2, 3, 3, 5$'
                        ],
                        final_answer: '$180 = 2^2 \\\\times 3^2 \\\\times 5$'
                    },
                    {
                        question: 'List the first 5 common multiples of 4 and 6.',
                        steps: [
                            'Multiples of 4: 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48...',
                            'Multiples of 6: 6, 12, 18, 24, 30, 36, 42, 48...',
                            'Common multiples appear in both lists: 12, 24, 36, 48, 60...'
                        ],
                        final_answer: 'Common multiples: $12, 24, 36, 48, 60$'
                    },
                    {
                        question: 'Find the prime numbers between 40 and 60.',
                        steps: [
                            'Check each number for primality:',
                            '41: Only divisible by 1 and 41 → Prime ✓',
                            '43: Only divisible by 1 and 43 → Prime ✓',
                            '47: Only divisible by 1 and 47 → Prime ✓',
                            '49 = $7 \\\\times 7$ → Not prime',
                            '51 = $3 \\\\times 17$ → Not prime',
                            '53: Only divisible by 1 and 53 → Prime ✓',
                            '59: Only divisible by 1 and 59 → Prime ✓'
                        ],
                        final_answer: 'Primes between 40 and 60: $\\\\{41, 43, 47, 53, 59\\\\}$'
                    }
                ]
            },
            {
                title: '3. HCF (Highest Common Factor)',
                content: `The **Highest Common Factor (HCF)** is the largest number that divides exactly into two or more numbers.

Also called: **Greatest Common Divisor (GCD)**

**Method 1: Listing Factors**
1. List all factors of each number
2. Find common factors
3. Select the highest

**Method 2: Prime Factorization** (Recommended)
1. Express each number as a product of primes
2. Identify **common** prime factors
3. Take the **lowest power** of each common prime
4. Multiply together

**Formula**:
$$\\\\text{HCF} = \\\\prod (\\\\text{common primes to lowest power})$$

**Application**: HCF is used when **dividing** quantities into equal parts.`,
                worked_examples: [
                    {
                        question: 'Find the HCF of 48 and 72 using prime factorization.',
                        steps: [
                            'Prime factorization of 48: $48 = 2^4 \\\\times 3$',
                            'Prime factorization of 72: $72 = 2^3 \\\\times 3^2$',
                            'Common primes: 2 and 3',
                            'Lowest power of 2: $2^3$',
                            'Lowest power of 3: $3^1$',
                            'HCF = $2^3 \\\\times 3 = 8 \\\\times 3 = 24$'
                        ],
                        final_answer: '$\\\\text{HCF}(48, 72) = 24$'
                    },
                    {
                        question: 'Find the HCF of 84, 126, and 210.',
                        steps: [
                            '$84 = 2^2 \\\\times 3 \\\\times 7$',
                            '$126 = 2 \\\\times 3^2 \\\\times 7$',
                            '$210 = 2 \\\\times 3 \\\\times 5 \\\\times 7$',
                            'Common primes: 2, 3, and 7',
                            'Lowest powers: $2^1$, $3^1$, $7^1$',
                            'HCF = $2 \\\\times 3 \\\\times 7 = 42$'
                        ],
                        final_answer: '$\\\\text{HCF}(84, 126, 210) = 42$'
                    },
                    {
                        question: 'A farmer has 120 apples and 84 oranges. What is the greatest number of identical baskets he can make with no fruit left over?',
                        steps: [
                            'We need to find HCF(120, 84).',
                            '$120 = 2^3 \\\\times 3 \\\\times 5$',
                            '$84 = 2^2 \\\\times 3 \\\\times 7$',
                            'Common primes: 2 and 3',
                            'Lowest powers: $2^2$ and $3^1$',
                            'HCF = $4 \\\\times 3 = 12$',
                            'Each basket: $\\\\frac{120}{12} = 10$ apples and $\\\\frac{84}{12} = 7$ oranges.'
                        ],
                        final_answer: '12 baskets (10 apples and 7 oranges each)'
                    }
                ]
            },
            {
                title: '4. LCM (Lowest Common Multiple)',
                content: `The **Lowest Common Multiple (LCM)** is the smallest number that is a multiple of two or more numbers.

**Method 1: Listing Multiples**
1. List multiples of each number
2. Find smallest common multiple

**Method 2: Prime Factorization** (Recommended)
1. Express each number as a product of primes
2. Take the **highest power** of each prime that appears
3. Multiply together

**Formula**:
$$\\\\text{LCM} = \\\\prod (\\\\text{all primes to highest power})$$

**Important Relationship**:
$$\\\\text{HCF}(a, b) \\\\times \\\\text{LCM}(a, b) = a \\\\times b$$

**Application**: LCM is used when combining events that **repeat** at different intervals.`,
                worked_examples: [
                    {
                        question: 'Find the LCM of 12 and 18.',
                        steps: [
                            'Prime factorization of 12: $12 = 2^2 \\\\times 3$',
                            'Prime factorization of 18: $18 = 2 \\\\times 3^2$',
                            'All primes: 2 and 3',
                            'Highest power of 2: $2^2$',
                            'Highest power of 3: $3^2$',
                            'LCM = $2^2 \\\\times 3^2 = 4 \\\\times 9 = 36$'
                        ],
                        final_answer: '$\\\\text{LCM}(12, 18) = 36$'
                    },
                    {
                        question: 'Find the LCM of 8, 12, and 15.',
                        steps: [
                            '$8 = 2^3$',
                            '$12 = 2^2 \\\\times 3$',
                            '$15 = 3 \\\\times 5$',
                            'All primes: 2, 3, and 5',
                            'Highest powers: $2^3$, $3^1$, $5^1$',
                            'LCM = $8 \\\\times 3 \\\\times 5 = 120$'
                        ],
                        final_answer: '$\\\\text{LCM}(8, 12, 15) = 120$'
                    },
                    {
                        question: 'If HCF(a, b) = 6 and LCM(a, b) = 180, find $a \\\\times b$.',
                        steps: [
                            'Use the relationship: HCF × LCM = $a \\\\times b$',
                            '$a \\\\times b = 6 \\\\times 180$',
                            '$a \\\\times b = 1080$'
                        ],
                        final_answer: '$a \\\\times b = 1080$'
                    },
                    {
                        question: 'Two bells ring at intervals of 40 minutes and 60 minutes. If they ring together at 8:00 AM, when will they next ring together?',
                        steps: [
                            'Find LCM(40, 60) to determine when they sync again.',
                            '$40 = 2^3 \\\\times 5$',
                            '$60 = 2^2 \\\\times 3 \\\\times 5$',
                            'LCM = $2^3 \\\\times 3 \\\\times 5 = 8 \\\\times 3 \\\\times 5 = 120$ minutes',
                            '120 minutes = 2 hours',
                            '8:00 AM + 2 hours = 10:00 AM'
                        ],
                        final_answer: 'They will ring together at 10:00 AM'
                    }
                ]
            },
            {
                title: '5. Operations with Real Numbers',
                content: `**Rules for Addition and Subtraction**:
- **Same signs**: Add absolute values, keep the common sign.
  $$(-5) + (-3) = -(5 + 3) = -8$$
- **Different signs**: Subtract smaller from larger absolute value, take sign of larger.
  $$(-8) + 5 = -(8 - 5) = -3$$

**Rules for Multiplication and Division**:
| Sign 1 | Sign 2 | Result |
|--------|--------|--------|
| + | + | + |
| - | - | + |
| + | - | - |
| - | + | - |

**Order of Operations (BODMAS/BIDMAS)**:
$$\\\\text{B - Brackets} \\\\to \\\\text{O/I - Orders/Indices} \\\\to \\\\text{DM - Division/Multiplication} \\\\to \\\\text{AS - Addition/Subtraction}$$

**Note**: Division and Multiplication are done **left to right**, as are Addition and Subtraction.`,
                worked_examples: [
                    {
                        question: 'Evaluate: $-3 + 7 \\\\times 2 - (-4) \\\\div 2$',
                        steps: [
                            'Apply BODMAS - Multiplication first: $7 \\\\times 2 = 14$',
                            'Division: $(-4) \\\\div 2 = -2$',
                            'Rewrite: $-3 + 14 - (-2)$',
                            'Simplify double negative: $-3 + 14 + 2$',
                            'Add left to right: $-3 + 14 = 11$',
                            '$11 + 2 = 13$'
                        ],
                        final_answer: '$13$'
                    },
                    {
                        question: 'Simplify: $\\\\frac{(-2)^3 \\\\times 3}{-6}$',
                        steps: [
                            'Calculate the power: $(-2)^3 = (-2) \\\\times (-2) \\\\times (-2) = -8$',
                            'Multiply numerator: $-8 \\\\times 3 = -24$',
                            'Divide: $\\\\frac{-24}{-6} = 4$',
                            'Note: Negative ÷ Negative = Positive'
                        ],
                        final_answer: '$4$'
                    },
                    {
                        question: 'Evaluate: $\\\\frac{3^2 - 4 \\\\times 2}{5 - 3^2}$',
                        steps: [
                            'Numerator: $3^2 - 4 \\\\times 2 = 9 - 8 = 1$',
                            'Denominator: $5 - 3^2 = 5 - 9 = -4$',
                            'Divide: $\\\\frac{1}{-4} = -\\\\frac{1}{4}$'
                        ],
                        final_answer: '$-\\\\frac{1}{4}$ or $-0.25$'
                    },
                    {
                        question: 'Simplify: $(-5)^2 - (-3)^3 + 2 \\\\times (-4)$',
                        steps: [
                            '$(-5)^2 = 25$ (even power makes positive)',
                            '$(-3)^3 = -27$ (odd power keeps negative)',
                            '$2 \\\\times (-4) = -8$',
                            'Expression becomes: $25 - (-27) + (-8)$',
                            '$= 25 + 27 - 8 = 44$'
                        ],
                        final_answer: '$44$'
                    }
                ]
            },
            {
                title: '6. Absolute Value',
                content: `The **absolute value** (or modulus) of a number $a$, written $|a|$, represents its distance from zero on the number line.

**Definition**:
$$|a| = \\\\begin{cases} a & \\\\text{if } a \\\\geq 0 \\\\\\\\ -a & \\\\text{if } a < 0 \\\\end{cases}$$

**Key Properties**:
1. $|a| \\\\geq 0$ for all $a \\\\in \\\\mathbb{R}$
2. $|a| = 0$ only when $a = 0$
3. $|ab| = |a| \\\\cdot |b|$
4. $\\\\left|\\\\frac{a}{b}\\\\right| = \\\\frac{|a|}{|b|}$ where $b \\\\neq 0$
5. $|a + b| \\\\leq |a| + |b|$ (Triangle Inequality)
6. $|-a| = |a|$

**Solving Absolute Value Equations**:
For $|x| = k$ where $k > 0$:
$$x = k \\\\quad \\\\text{or} \\\\quad x = -k$$`,
                worked_examples: [
                    {
                        question: 'Evaluate: $|{-7}| + |3| - |{-2}|$',
                        steps: [
                            '$|-7| = 7$ (distance from 0 is 7 units)',
                            '$|3| = 3$ (already positive)',
                            '$|-2| = 2$',
                            'Calculate: $7 + 3 - 2 = 8$'
                        ],
                        final_answer: '$8$'
                    },
                    {
                        question: 'Solve: $|x - 3| = 5$',
                        steps: [
                            'The expression inside can be positive or negative.',
                            'Case 1: $x - 3 = 5 \\\\Rightarrow x = 8$',
                            'Case 2: $x - 3 = -5 \\\\Rightarrow x = -2$',
                            'Check: $|8 - 3| = |5| = 5$ ✓',
                            'Check: $|-2 - 3| = |-5| = 5$ ✓'
                        ],
                        final_answer: '$x = 8$ or $x = -2$'
                    },
                    {
                        question: 'Simplify: $\\\\frac{|{-12}| \\\\times |{-3}|}{|{-6}|}$',
                        steps: [
                            '$|-12| = 12$',
                            '$|-3| = 3$',
                            '$|-6| = 6$',
                            '$\\\\frac{12 \\\\times 3}{6} = \\\\frac{36}{6} = 6$'
                        ],
                        final_answer: '$6$'
                    }
                ]
            },
            {
                title: '7. Rounding, Estimation & Significant Figures',
                content: `**Rounding to Decimal Places (d.p.)**:
Look at the digit in the position after the required place:
- If ≥ 5, round UP
- If < 5, round DOWN

**Significant Figures (s.f.) Rules**:
1. All **non-zero** digits are significant: 456 has 3 s.f.
2. Zeros **between** non-zero digits are significant: 4005 has 4 s.f.
3. **Leading zeros** are NOT significant: 0.00456 has 3 s.f.
4. **Trailing zeros after decimal** ARE significant: 2.300 has 4 s.f.
5. **Trailing zeros in whole numbers** may or may not be significant.

**Estimation**: Round each number to 1 s.f. before calculating.

**Upper and Lower Bounds**:
If $x = 5.4$ rounded to 1 d.p.:
- Lower bound = $5.35$
- Upper bound = $5.45$
$$5.35 \\\\leq x < 5.45$$`,
                worked_examples: [
                    {
                        question: 'Round $0.004567$ to (a) 2 s.f. (b) 3 s.f. (c) 2 d.p.',
                        steps: [
                            'Significant digits start from first non-zero: 4, 5, 6, 7',
                            '(a) 2 s.f.: Keep 4, 5. Look at 6 → round up → $0.0046$',
                            '(b) 3 s.f.: Keep 4, 5, 6. Look at 7 → round up → $0.00457$',
                            '(c) 2 d.p.: Only 2 digits after decimal point → $0.00$'
                        ],
                        final_answer: '(a) $0.0046$ (b) $0.00457$ (c) $0.00$'
                    },
                    {
                        question: 'Estimate $\\\\frac{49.3 \\\\times 0.52}{0.098}$ by rounding to 1 s.f.',
                        steps: [
                            'Round each number to 1 s.f.:',
                            '$49.3 \\\\approx 50$',
                            '$0.52 \\\\approx 0.5$',
                            '$0.098 \\\\approx 0.1$',
                            'Calculate: $\\\\frac{50 \\\\times 0.5}{0.1} = \\\\frac{25}{0.1} = 250$'
                        ],
                        final_answer: 'Estimate ≈ $250$'
                    },
                    {
                        question: 'The length of a room is 8.5 m, measured to 1 decimal place. Find the upper and lower bounds.',
                        steps: [
                            'Measurement: 8.5 m (to 1 d.p.)',
                            'The error is $\\\\pm 0.05$ m',
                            'Lower bound = $8.5 - 0.05 = 8.45$ m',
                            'Upper bound = $8.5 + 0.05 = 8.55$ m',
                            'Interval: $8.45 \\\\leq \\\\text{length} < 8.55$'
                        ],
                        final_answer: 'Lower bound = $8.45$ m, Upper bound = $8.55$ m'
                    }
                ]
            },
            {
                title: '8. Standard Form (Scientific Notation)',
                content: `**Standard Form** expresses numbers as:
$$A \\\\times 10^n$$
where $1 \\\\leq A < 10$ and $n$ is an integer.

**Converting TO Standard Form**:
- **Large numbers**: Move decimal LEFT, $n$ is POSITIVE
  $$345000 = 3.45 \\\\times 10^5$$
- **Small numbers** (< 1): Move decimal RIGHT, $n$ is NEGATIVE
  $$0.00072 = 7.2 \\\\times 10^{-4}$$

**Operations in Standard Form**:

**Multiplication**:
$$(a \\\\times 10^m) \\\\times (b \\\\times 10^n) = (a \\\\times b) \\\\times 10^{m+n}$$

**Division**:
$$\\\\frac{a \\\\times 10^m}{b \\\\times 10^n} = \\\\frac{a}{b} \\\\times 10^{m-n}$$

**Addition/Subtraction**: Convert to same power of 10 first.`,
                worked_examples: [
                    {
                        question: 'Calculate $(3 \\\\times 10^4) \\\\times (2 \\\\times 10^{-2})$ in standard form.',
                        steps: [
                            'Multiply the coefficients: $3 \\\\times 2 = 6$',
                            'Add the powers: $10^{4} \\\\times 10^{-2} = 10^{4+(-2)} = 10^2$',
                            'Combine: $6 \\\\times 10^2$',
                            'Check: $1 \\\\leq 6 < 10$ ✓ (already in standard form)'
                        ],
                        final_answer: '$6 \\\\times 10^2$ (or $600$)'
                    },
                    {
                        question: 'Express $\\\\frac{8 \\\\times 10^5}{4 \\\\times 10^2}$ in standard form.',
                        steps: [
                            'Divide coefficients: $\\\\frac{8}{4} = 2$',
                            'Subtract powers: $10^{5-2} = 10^3$',
                            'Combine: $2 \\\\times 10^3$'
                        ],
                        final_answer: '$2 \\\\times 10^3$'
                    },
                    {
                        question: 'Calculate $(4.5 \\\\times 10^3) + (3 \\\\times 10^2)$ in standard form.',
                        steps: [
                            'Convert to same power of 10:',
                            '$4.5 \\\\times 10^3 = 45 \\\\times 10^2$',
                            'Add: $45 \\\\times 10^2 + 3 \\\\times 10^2 = 48 \\\\times 10^2$',
                            'Convert to standard form: $48 \\\\times 10^2 = 4.8 \\\\times 10^3$'
                        ],
                        final_answer: '$4.8 \\\\times 10^3$'
                    },
                    {
                        question: 'The distance from Earth to the Sun is approximately $1.5 \\\\times 10^8$ km. Light travels at $3 \\\\times 10^5$ km/s. How long does light take to reach Earth?',
                        steps: [
                            'Time = Distance ÷ Speed',
                            'Time = $\\\\frac{1.5 \\\\times 10^8}{3 \\\\times 10^5}$',
                            'Divide coefficients: $\\\\frac{1.5}{3} = 0.5$',
                            'Subtract powers: $10^{8-5} = 10^3$',
                            'Time = $0.5 \\\\times 10^3 = 5 \\\\times 10^2 = 500$ seconds',
                            'Convert: $500 \\\\div 60 \\\\approx 8.33$ minutes'
                        ],
                        final_answer: '$500$ seconds (about $8$ minutes $20$ seconds)'
                    }
                ]
            },
            {
                title: '9. Number Bases',
                content: `**Number Bases** use different place values. The most common are:

| Base | Name | Digits Used |
|------|------|-------------|
| 2 | Binary | 0, 1 |
| 8 | Octal | 0-7 |
| 10 | Decimal | 0-9 |
| 16 | Hexadecimal | 0-9, A-F |

**Place Values in Different Bases**:
- Base 10: ... $10^2$, $10^1$, $10^0$ (100, 10, 1)
- Base 2: ... $2^2$, $2^1$, $2^0$ (4, 2, 1)
- Base 8: ... $8^2$, $8^1$, $8^0$ (64, 8, 1)

**Converting FROM Base $n$ TO Base 10**:
Multiply each digit by its place value and add.
$$1011_2 = 1(2^3) + 0(2^2) + 1(2^1) + 1(2^0) = 8 + 0 + 2 + 1 = 11_{10}$$

**Converting FROM Base 10 TO Base $n$**:
Divide repeatedly by $n$, collect remainders (read bottom to top).`,
                worked_examples: [
                    {
                        question: 'Convert $1101_2$ (binary) to base 10.',
                        steps: [
                            'Write place values: $2^3, 2^2, 2^1, 2^0$',
                            'Multiply: $1 \\\\times 2^3 = 8$',
                            '$1 \\\\times 2^2 = 4$',
                            '$0 \\\\times 2^1 = 0$',
                            '$1 \\\\times 2^0 = 1$',
                            'Add: $8 + 4 + 0 + 1 = 13$'
                        ],
                        final_answer: '$1101_2 = 13_{10}$'
                    },
                    {
                        question: 'Convert $45_{10}$ to binary (base 2).',
                        steps: [
                            '$45 \\\\div 2 = 22$ remainder $1$',
                            '$22 \\\\div 2 = 11$ remainder $0$',
                            '$11 \\\\div 2 = 5$ remainder $1$',
                            '$5 \\\\div 2 = 2$ remainder $1$',
                            '$2 \\\\div 2 = 1$ remainder $0$',
                            '$1 \\\\div 2 = 0$ remainder $1$',
                            'Read remainders bottom to top: $101101$'
                        ],
                        final_answer: '$45_{10} = 101101_2$'
                    },
                    {
                        question: 'Convert $257_8$ (octal) to base 10.',
                        steps: [
                            'Place values: $8^2 = 64$, $8^1 = 8$, $8^0 = 1$',
                            '$2 \\\\times 64 = 128$',
                            '$5 \\\\times 8 = 40$',
                            '$7 \\\\times 1 = 7$',
                            'Add: $128 + 40 + 7 = 175$'
                        ],
                        final_answer: '$257_8 = 175_{10}$'
                    },
                    {
                        question: 'Add in binary: $1011_2 + 1101_2$',
                        steps: [
                            'Line up and add column by column (right to left):',
                            'Column 1: $1 + 1 = 10_2$ (write 0, carry 1)',
                            'Column 2: $1 + 0 + 1 = 10_2$ (write 0, carry 1)',
                            'Column 3: $0 + 1 + 1 = 10_2$ (write 0, carry 1)',
                            'Column 4: $1 + 1 + 1 = 11_2$ (write 11)',
                            'Result: $11000_2$',
                            'Check: $11 + 13 = 24$, and $11000_2 = 16 + 8 = 24$ ✓'
                        ],
                        final_answer: '$1011_2 + 1101_2 = 11000_2$'
                    }
                ]
            },
            {
                title: '10. Surds (Irrational Roots)',
                content: `A **surd** is an irrational root that cannot be simplified to a rational number.
Examples: $\\\\sqrt{2}$, $\\\\sqrt{3}$, $\\\\sqrt{5}$, $\\\\sqrt[3]{7}$

**NOT surds**: $\\\\sqrt{4} = 2$, $\\\\sqrt{9} = 3$ (these simplify to rationals)

**Laws of Surds**:
$$\\\\sqrt{a} \\\\times \\\\sqrt{b} = \\\\sqrt{ab}$$
$$\\\\frac{\\\\sqrt{a}}{\\\\sqrt{b}} = \\\\sqrt{\\\\frac{a}{b}}$$
$$(\\\\sqrt{a})^2 = a$$
$$\\\\sqrt{a^2} = |a|$$

**Simplifying Surds**:
Find the largest perfect square factor.
$$\\\\sqrt{50} = \\\\sqrt{25 \\\\times 2} = \\\\sqrt{25} \\\\times \\\\sqrt{2} = 5\\\\sqrt{2}$$

**Rationalizing the Denominator**:
Remove surds from the denominator by multiplying.
$$\\\\frac{1}{\\\\sqrt{a}} = \\\\frac{1}{\\\\sqrt{a}} \\\\times \\\\frac{\\\\sqrt{a}}{\\\\sqrt{a}} = \\\\frac{\\\\sqrt{a}}{a}$$

For $\\\\frac{1}{a + \\\\sqrt{b}}$, multiply by the conjugate $\\\\frac{a - \\\\sqrt{b}}{a - \\\\sqrt{b}}$.`,
                worked_examples: [
                    {
                        question: 'Simplify: $\\\\sqrt{72}$',
                        steps: [
                            'Find perfect square factors of 72:',
                            '$72 = 36 \\\\times 2$',
                            '$\\\\sqrt{72} = \\\\sqrt{36 \\\\times 2}$',
                            '$= \\\\sqrt{36} \\\\times \\\\sqrt{2}$',
                            '$= 6\\\\sqrt{2}$'
                        ],
                        final_answer: '$6\\\\sqrt{2}$'
                    },
                    {
                        question: 'Simplify: $3\\\\sqrt{12} + 2\\\\sqrt{27}$',
                        steps: [
                            'Simplify each surd first:',
                            '$\\\\sqrt{12} = \\\\sqrt{4 \\\\times 3} = 2\\\\sqrt{3}$',
                            '$\\\\sqrt{27} = \\\\sqrt{9 \\\\times 3} = 3\\\\sqrt{3}$',
                            'Substitute: $3(2\\\\sqrt{3}) + 2(3\\\\sqrt{3})$',
                            '$= 6\\\\sqrt{3} + 6\\\\sqrt{3}$',
                            '$= 12\\\\sqrt{3}$'
                        ],
                        final_answer: '$12\\\\sqrt{3}$'
                    },
                    {
                        question: 'Rationalize the denominator: $\\\\frac{5}{\\\\sqrt{3}}$',
                        steps: [
                            'Multiply top and bottom by $\\\\sqrt{3}$:',
                            '$\\\\frac{5}{\\\\sqrt{3}} \\\\times \\\\frac{\\\\sqrt{3}}{\\\\sqrt{3}}$',
                            '$= \\\\frac{5\\\\sqrt{3}}{3}$'
                        ],
                        final_answer: '$\\\\frac{5\\\\sqrt{3}}{3}$'
                    },
                    {
                        question: 'Rationalize: $\\\\frac{4}{2 + \\\\sqrt{3}}$',
                        steps: [
                            'Multiply by conjugate $\\\\frac{2 - \\\\sqrt{3}}{2 - \\\\sqrt{3}}$:',
                            '$= \\\\frac{4(2 - \\\\sqrt{3})}{(2 + \\\\sqrt{3})(2 - \\\\sqrt{3})}$',
                            'Denominator: $(2)^2 - (\\\\sqrt{3})^2 = 4 - 3 = 1$',
                            'Numerator: $8 - 4\\\\sqrt{3}$',
                            '$= \\\\frac{8 - 4\\\\sqrt{3}}{1} = 8 - 4\\\\sqrt{3}$'
                        ],
                        final_answer: '$8 - 4\\\\sqrt{3}$'
                    },
                    {
                        question: 'Expand and simplify: $(\\\\sqrt{5} + \\\\sqrt{2})(\\\\sqrt{5} - \\\\sqrt{2})$',
                        steps: [
                            'Use difference of squares: $(a + b)(a - b) = a^2 - b^2$',
                            'Here $a = \\\\sqrt{5}$ and $b = \\\\sqrt{2}$',
                            '$= (\\\\sqrt{5})^2 - (\\\\sqrt{2})^2$',
                            '$= 5 - 2$',
                            '$= 3$'
                        ],
                        final_answer: '$3$'
                    }
                ]
            }
        ],
        key_points: [
            'Real numbers = Rational ∪ Irrational. Rational can be written as fractions.',
            'Prime numbers have exactly two factors: 1 and itself. 2 is the only even prime.',
            'HCF: Use common primes with LOWEST powers. Used for dividing into equal parts.',
            'LCM: Use all primes with HIGHEST powers. Used for combining repeating events.',
            'HCF × LCM = Product of the two numbers.',
            'BODMAS/BIDMAS: Brackets → Orders → Division/Multiplication → Addition/Subtraction.',
            'Standard form: $A \\\\times 10^n$ where $1 \\\\leq A < 10$.',
            'To rationalize $\\\\frac{1}{\\\\sqrt{a}}$, multiply by $\\\\frac{\\\\sqrt{a}}{\\\\sqrt{a}}$.',
            'Binary (base 2) uses only 0 and 1. Convert by dividing repeatedly by 2.',
            'Simplify surds by finding the largest perfect square factor.'
        ],
        exam_tips: [
            'When classifying numbers, always simplify first (e.g., $\\\\sqrt{25} = 5$).',
            'Use prime factorization for HCF and LCM—it prevents missing factors.',
            'In standard form, always check that $1 \\\\leq A < 10$. Adjust if needed.',
            'For number base conversions, write out place values clearly.',
            'When adding surds, simplify each surd first to find like terms.',
            'Show all working for significant figures—state which digit you are rounding.',
            'For rationalizing, remember to use the conjugate for binomial denominators.',
            'In operations, remember: negative × negative = positive.',
            'Double-check LCM/HCF word problems—identify which concept applies.',
            'Estimate answers before calculating to catch major errors.'
        ],
        visual_descriptions: [
            'Number line showing positions of integers, fractions, and irrational numbers like $\\\\sqrt{2}$ and $\\\\pi$.',
            'Venn diagram showing nested number sets: $\\\\mathbb{N} \\\\subset \\\\mathbb{W} \\\\subset \\\\mathbb{Z} \\\\subset \\\\mathbb{Q} \\\\subset \\\\mathbb{R}$.',
            'Factor tree diagram showing prime factorization of 180.',
            'Comparison table of HCF vs LCM methods and applications.',
            'Binary place value chart: $2^7, 2^6, 2^5, 2^4, 2^3, 2^2, 2^1, 2^0$.'
        ]
    },
    'Fractions, Decimals & Percentages': {
        topic: 'Fractions, Decimals & Percentages',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'Fractions, decimals, and percentages are three ways of representing parts of a whole. Mastery of conversions between them is essential for O-Level success.',
        sections: [
            {
                title: 'Types of Fractions',
                content: `**Proper Fraction**: Numerator < Denominator. Example: $\\\\frac{3}{5}$

**Improper Fraction**: Numerator ≥ Denominator. Example: $\\\\frac{7}{4}$

**Mixed Number**: Whole number + proper fraction. Example: $1\\\\frac{3}{4} = \\\\frac{7}{4}$

**Equivalent Fractions**: Fractions with the same value. Example: $\\\\frac{1}{2} = \\\\frac{2}{4} = \\\\frac{3}{6}$`,
                worked_examples: [
                    {
                        question: 'Convert $2\\\\frac{3}{5}$ to an improper fraction.',
                        steps: [
                            'Multiply the whole number by the denominator: $2 \\\\times 5 = 10$.',
                            'Add the numerator: $10 + 3 = 13$.',
                            'Place over the original denominator: $\\\\frac{13}{5}$.'
                        ],
                        final_answer: '$\\\\frac{13}{5}$'
                    }
                ]
            },
            {
                title: 'Operations with Fractions',
                content: `**Addition/Subtraction**: Find a common denominator.
$$\\\\frac{a}{b} + \\\\frac{c}{d} = \\\\frac{ad + bc}{bd}$$

**Multiplication**: Multiply numerators and denominators.
$$\\\\frac{a}{b} \\\\times \\\\frac{c}{d} = \\\\frac{ac}{bd}$$

**Division**: Multiply by the reciprocal.
$$\\\\frac{a}{b} \\\\div \\\\frac{c}{d} = \\\\frac{a}{b} \\\\times \\\\frac{d}{c} = \\\\frac{ad}{bc}$$`,
                worked_examples: [
                    {
                        question: 'Calculate $\\\\frac{2}{3} + \\\\frac{3}{4}$',
                        steps: [
                            'Find LCM of 3 and 4: LCM = 12.',
                            'Convert: $\\\\frac{2}{3} = \\\\frac{8}{12}$ and $\\\\frac{3}{4} = \\\\frac{9}{12}$.',
                            'Add: $\\\\frac{8}{12} + \\\\frac{9}{12} = \\\\frac{17}{12}$.',
                            'Convert to mixed number: $1\\\\frac{5}{12}$.'
                        ],
                        final_answer: '$\\\\frac{17}{12}$ or $1\\\\frac{5}{12}$'
                    },
                    {
                        question: 'Calculate $\\\\frac{5}{6} \\\\div \\\\frac{2}{3}$',
                        steps: [
                            'Convert to multiplication by the reciprocal: $\\\\frac{5}{6} \\\\times \\\\frac{3}{2}$.',
                            'Multiply: $\\\\frac{5 \\\\times 3}{6 \\\\times 2} = \\\\frac{15}{12}$.',
                            'Simplify: $\\\\frac{15}{12} = \\\\frac{5}{4} = 1\\\\frac{1}{4}$.'
                        ],
                        final_answer: '$\\\\frac{5}{4}$ or $1\\\\frac{1}{4}$'
                    }
                ]
            },
            {
                title: 'Conversions',
                content: `**Fraction to Decimal**: Divide numerator by denominator.
$\\\\frac{3}{4} = 3 \\\\div 4 = 0.75$

**Decimal to Fraction**: 
$0.35 = \\\\frac{35}{100} = \\\\frac{7}{20}$

**Fraction to Percentage**: Multiply by 100%.
$\\\\frac{3}{5} = \\\\frac{3}{5} \\\\times 100\\\\% = 60\\\\%$

**Percentage to Fraction**: Divide by 100.
$45\\\\% = \\\\frac{45}{100} = \\\\frac{9}{20}$

**Recurring Decimals**:
$0.\\\\overline{3} = 0.333... = \\\\frac{1}{3}$
$0.\\\\overline{27} = \\\\frac{27}{99} = \\\\frac{3}{11}$`,
                worked_examples: [
                    {
                        question: 'Convert $0.\\\\overline{36}$ to a fraction.',
                        steps: [
                            'Let $x = 0.363636...$',
                            'Multiply by 100: $100x = 36.363636...$',
                            'Subtract: $100x - x = 36$, so $99x = 36$.',
                            'Solve: $x = \\\\frac{36}{99} = \\\\frac{4}{11}$.'
                        ],
                        final_answer: '$\\\\frac{4}{11}$'
                    }
                ]
            },
            {
                title: 'Percentage Calculations',
                content: `**Finding a Percentage of a Quantity**:
$$\\\\text{Percentage of } Q = \\\\frac{\\\\text{Percentage}}{100} \\\\times Q$$

**Finding the Percentage**:
$$\\\\text{Percentage} = \\\\frac{\\\\text{Part}}{\\\\text{Whole}} \\\\times 100\\\\%$$

**Percentage Increase/Decrease**:
$$\\\\text{Percentage Change} = \\\\frac{\\\\text{New} - \\\\text{Original}}{\\\\text{Original}} \\\\times 100\\\\%$$

**Reverse Percentages**: Find the original value after a percentage change.`,
                worked_examples: [
                    {
                        question: 'A shirt costs $60 after a 20% discount. What was the original price?',
                        steps: [
                            'After 20% discount, the price is 80% of the original.',
                            'Let original price = $P$. So $0.8P = 60$.',
                            'Solve: $P = \\\\frac{60}{0.8} = 75$.'
                        ],
                        final_answer: 'Original price = $\\\\$75$'
                    },
                    {
                        question: 'A population increases from 5000 to 5750. Find the percentage increase.',
                        steps: [
                            'Change = $5750 - 5000 = 750$.',
                            'Percentage increase = $\\\\frac{750}{5000} \\\\times 100\\\\% = 15\\\\%$.'
                        ],
                        final_answer: '$15\\\\%$ increase'
                    }
                ]
            }
        ],
        key_points: [
            'To add or subtract fractions, find the LCM of denominators.',
            'To divide fractions, multiply by the reciprocal.',
            'Percentage = $\\\\frac{\\\\text{Part}}{\\\\text{Whole}} \\\\times 100\\\\%$.',
            'For recurring decimals, use algebra: let $x$ = the decimal, then manipulate.'
        ],
        exam_tips: [
            'Always simplify fractions to their lowest terms.',
            'In percentage problems, identify what is "the whole" and "the part."',
            'For reverse percentage problems, work backwards from the final value.',
            'Show all conversion steps for full marks.'
        ],
        visual_descriptions: [
            'Pie chart showing a fraction as a portion of the whole.',
            'Number line comparing equivalent fractions, decimals, and percentages.'
        ]
    },
    'Ratio and Proportion': {
        topic: 'Ratio and Proportion',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'Ratios compare quantities of the same unit. Proportions state that two ratios are equal. These concepts are fundamental in solving real-world problems involving scaling and sharing.',
        sections: [
            {
                title: 'Simplifying Ratios',
                content: `A ratio compares two or more quantities of the **same unit**.

**Simplifying**: Divide all parts by their HCF (Highest Common Factor).

**Example**: $12 : 18 = \\\\frac{12}{6} : \\\\frac{18}{6} = 2 : 3$

**Converting Units**: Ensure quantities are in the same unit before forming a ratio.
$1\\\\text{ hour} : 45\\\\text{ minutes} = 60 : 45 = 4 : 3$`,
                worked_examples: [
                    {
                        question: 'Simplify the ratio $2.5 : 1.5$',
                        steps: [
                            'Multiply both by 10 to remove decimals: $25 : 15$.',
                            'Find HCF of 25 and 15: HCF = 5.',
                            'Divide both by 5: $\\\\frac{25}{5} : \\\\frac{15}{5} = 5 : 3$.'
                        ],
                        final_answer: '$5 : 3$'
                    }
                ]
            },
            {
                title: 'Dividing in a Given Ratio',
                content: `To divide a quantity $Q$ in the ratio $a : b$:
1. Total parts = $a + b$
2. Each part = $\\\\frac{Q}{a + b}$
3. First share = $a \\\\times \\\\frac{Q}{a+b}$, Second share = $b \\\\times \\\\frac{Q}{a+b}$`,
                worked_examples: [
                    {
                        question: 'Divide $\\\\$120$ in the ratio $3 : 5$.',
                        steps: [
                            'Total parts = $3 + 5 = 8$.',
                            'Value of one part = $\\\\frac{120}{8} = 15$.',
                            'First share = $3 \\\\times 15 = \\\\$45$.',
                            'Second share = $5 \\\\times 15 = \\\\$75$.'
                        ],
                        final_answer: '$\\\\$45$ and $\\\\$75$'
                    }
                ]
            },
            {
                title: 'Direct and Inverse Proportion',
                content: `**Direct Proportion**: $y \\\\propto x$ means $y = kx$ for some constant $k$.
- As $x$ increases, $y$ increases proportionally.
- $\\\\frac{y_1}{x_1} = \\\\frac{y_2}{x_2}$

**Inverse Proportion**: $y \\\\propto \\\\frac{1}{x}$ means $y = \\\\frac{k}{x}$.
- As $x$ increases, $y$ decreases.
- $x_1 y_1 = x_2 y_2$`,
                worked_examples: [
                    {
                        question: 'If $y$ is directly proportional to $x$, and $y = 12$ when $x = 4$, find $y$ when $x = 7$.',
                        steps: [
                            'Find constant $k$: $y = kx \\\\Rightarrow 12 = k(4) \\\\Rightarrow k = 3$.',
                            'Use the equation $y = 3x$.',
                            'When $x = 7$: $y = 3(7) = 21$.'
                        ],
                        final_answer: '$y = 21$'
                    },
                    {
                        question: 'If 8 workers can complete a job in 6 days, how long will 12 workers take?',
                        steps: [
                            'This is inverse proportion: more workers → less time.',
                            'Use $x_1 y_1 = x_2 y_2$: $8 \\\\times 6 = 12 \\\\times y_2$.',
                            'Solve: $48 = 12y_2 \\\\Rightarrow y_2 = 4$ days.'
                        ],
                        final_answer: '$4$ days'
                    }
                ]
            }
        ],
        key_points: [
            'Ratios compare quantities in the same unit.',
            'To divide in ratio $a:b$, total parts = $a + b$.',
            'Direct proportion: $\\\\frac{y_1}{x_1} = \\\\frac{y_2}{x_2}$.',
            'Inverse proportion: $x_1 y_1 = x_2 y_2$.'
        ],
        exam_tips: [
            'Always simplify ratios to lowest terms.',
            'Identify whether a problem is direct or inverse proportion before solving.',
            'Draw a table for proportion problems to organize your values.'
        ],
        visual_descriptions: [
            'Bar model showing a quantity divided in a given ratio.',
            'Graph of direct proportion (straight line through origin) vs inverse proportion (hyperbola).'
        ]
    }
};

export const numberTopics = Object.keys(numberNotes);
