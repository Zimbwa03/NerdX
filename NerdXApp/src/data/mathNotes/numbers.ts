import { MathTopicNotes } from './types';

export const numberNotes: Record<string, MathTopicNotes> = {
    'Real Numbers': {
        topic: 'Real Numbers',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'Real numbers include all rational and irrational numbers and form the complete number system used in O-Level Mathematics. Every point on the number line corresponds to a real number, denoted by $\\\\mathbb{R}$. This topic covers: classification and hierarchy of number sets ($\\\\mathbb{N}, \\\\mathbb{W}, \\\\mathbb{Z}, \\\\mathbb{Q}, \\\\mathbb{R}$); prime numbers, factors, multiples, and prime factorization; HCF and LCM with applications; operations with integers and order of operations (BODMAS); absolute value and inequalities; rounding, significant figures, estimation, and bounds; standard form (scientific notation) and calculations; number bases (binary, octal, hexadecimal) and conversions; and surds—simplification and rationalization. Mastery of real numbers is essential for algebra, geometry, and all later O-Level topics.',
        sections: [
            {
                title: '1. Classification of Real Numbers',
                content: `The **Real Number System** consists of all numbers that can be represented on a number line. Every real number is either **rational** or **irrational**; there is no overlap.

**Natural Numbers** ($\\\\mathbb{N}$):
$$\\\\mathbb{N} = \\\\{1, 2, 3, 4, 5, ...\\\\}$$
Counting numbers, starting from 1. Used for counting discrete objects. Some definitions include 0 in $\\\\mathbb{N}$; at O-Level we take $\\\\mathbb{N}$ as positive integers only unless stated.

**Whole Numbers** ($\\\\mathbb{W}$):
$$\\\\mathbb{W} = \\\\{0, 1, 2, 3, 4, ...\\\\}$$
Natural numbers together with zero. Used when zero is meaningful (e.g. no items).

**Integers** ($\\\\mathbb{Z}$):
$$\\\\mathbb{Z} = \\\\{..., -3, -2, -1, 0, 1, 2, 3, ...\\\\}$$
All positive and negative whole numbers and zero. Used for quantities that can be negative (temperature, profit/loss, position relative to origin).

**Rational Numbers** ($\\\\mathbb{Q}$):
Numbers that can be expressed as $\\\\frac{p}{q}$ where $p, q \\\\in \\\\mathbb{Z}$ and $q \\\\neq 0$. The decimal form either **terminates** or **repeats**.
- **Terminating decimals**: $0.25 = \\\\frac{1}{4}$, $0.375 = \\\\frac{3}{8}$
- **Recurring (repeating) decimals**: $0.\\\\overline{3} = \\\\frac{1}{3}$, $0.\\\\overline{142857} = \\\\frac{1}{7}$
- Every integer is rational (e.g. $-5 = \\\\frac{-5}{1}$).

**Irrational Numbers** ($\\\\mathbb{Q}'$ or $\\\\mathbb{R} \\\\setminus \\\\mathbb{Q}$):
Numbers that **cannot** be written as a fraction of two integers. Their decimal expansion is **non-terminating and non-repeating**.
- **Examples**: $\\\\pi \\\\approx 3.14159...$, $e \\\\approx 2.71828...$
- **Surds**: $\\\\sqrt{2}$, $\\\\sqrt{3}$, $\\\\sqrt{5}$ (when not a perfect square). Note: $\\\\sqrt{4} = 2$ is rational.
- Sum or product of a rational and an irrational is irrational (e.g. $1 + \\\\sqrt{2}$).

**Number Set Hierarchy** (each set is contained in the next):
$$\\\\mathbb{N} \\\\subset \\\\mathbb{W} \\\\subset \\\\mathbb{Z} \\\\subset \\\\mathbb{Q} \\\\subset \\\\mathbb{R}$$

**Real Numbers** ($\\\\mathbb{R}$) = Rational $\\\\cup$ Irrational. There are no "gaps" on the number line; between any two real numbers there are infinitely many more real numbers.`,
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
                    },
                    {
                        question: 'Convert the recurring decimal $0.\\\\overline{6}$ to a fraction. Show full working.',
                        steps: [
                            'Let $x = 0.\\\\overline{6} = 0.666666...$',
                            'Multiply both sides by 10: $10x = 6.666666...$',
                            'Subtract: $10x - x = 6.666... - 0.666...$ so $9x = 6$',
                            'Solve: $x = \\\\frac{6}{9} = \\\\frac{2}{3}$',
                            'Check: $2 \\\\div 3 = 0.666...$ ✓'
                        ],
                        final_answer: '$0.\\\\overline{6} = \\\\frac{2}{3}$'
                    },
                    {
                        question: 'Which of these are rational: $\\\\sqrt{100}$, $\\\\sqrt{10}$, $2\\\\pi$, $\\\\frac{-8}{4}$? Give a reason for each.',
                        steps: [
                            '$\\\\sqrt{100} = 10$ — rational (integer).',
                            '$\\\\sqrt{10} \\\\approx 3.162...$ — irrational (no fraction equals it; decimal does not repeat).',
                            '$2\\\\pi$ — irrational (\\\\pi is irrational; rational × irrational = irrational).',
                            '$\\\\frac{-8}{4} = -2$ — rational (all integers are rational).'
                        ],
                        final_answer: 'Rational: $\\\\sqrt{100}$, $\\\\frac{-8}{4}$. Irrational: $\\\\sqrt{10}$, $2\\\\pi$.'
                    }
                ]
            },
            {
                title: '2. Prime Numbers, Factors & Multiples',
                content: `**Prime Numbers**: Whole numbers greater than 1 that have exactly **two factors**: 1 and itself. No other divisor is possible.
$$\\\\text{Primes} = \\\\{2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, ...\\\\}$$

**Important facts**:
- **1 is NOT prime** (it has only one factor). It is also not composite.
- **2 is the only even prime**; every other even number has 2 as a factor.
- To test if a number $n$ is prime, check divisibility by primes up to $\\\\sqrt{n}$ only.

**Composite Numbers**: Whole numbers greater than 1 with **more than two factors** (e.g. 4, 6, 8, 9, 10). Every composite number can be written uniquely as a product of primes (Fundamental Theorem of Arithmetic).

**Factor**: A whole number that divides exactly into another number with **no remainder**. Factors always come in pairs (e.g. for 12: 1×12, 2×6, 3×4). The number of factors of $n$ can be found from its prime factorization: if $n = p_1^{a_1} p_2^{a_2} ...$ then number of factors = $(a_1+1)(a_2+1)...$

**Multiple**: The result of multiplying a number by a positive integer. Zero is a multiple of every number. The multiples of $m$ are $m, 2m, 3m, ...$

**Prime Factorization (Product of Prime Factors)**: Expressing a number as a product of primes, usually in index form. This representation is **unique** (apart from order).
$$60 = 2^2 \\\\times 3 \\\\times 5 \\\\quad \\\\text{or} \\\\quad 60 = 2 \\\\times 2 \\\\times 3 \\\\times 5$$

**Factor Tree Method**: Split the number into two factors; repeat for each composite factor until only primes remain. Then write using powers.

**Repeated Division Method**: Divide repeatedly by the smallest prime that goes in exactly (2, then 3, 5, 7, ...) until the quotient is 1. The primes you used are the prime factors.`,
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
                    },
                    {
                        question: 'How many factors does 72 have? Show working using prime factorization.',
                        steps: [
                            'Prime factorization: $72 = 2^3 \\\\times 3^2$',
                            'Formula: number of factors = $(3+1)(2+1) = 4 \\\\times 3 = 12$',
                            'List to verify: 1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72'
                        ],
                        final_answer: '72 has **12 factors**.'
                    },
                    {
                        question: 'Express 252 as a product of prime factors using repeated division.',
                        steps: [
                            '$252 \\\\div 2 = 126$ (remainder 0)',
                            '$126 \\\\div 2 = 63$',
                            '$63 \\\\div 3 = 21$',
                            '$21 \\\\div 3 = 7$',
                            '$7 \\\\div 7 = 1$',
                            'Primes used: 2, 2, 3, 3, 7 $\\\\Rightarrow 252 = 2^2 \\\\times 3^2 \\\\times 7$'
                        ],
                        final_answer: '$252 = 2^2 \\\\times 3^2 \\\\times 7$'
                    }
                ]
            },
            {
                title: '3. HCF (Highest Common Factor)',
                content: `The **Highest Common Factor (HCF)** of two or more numbers is the **largest** positive integer that divides exactly into all of them. Also called **Greatest Common Divisor (GCD)**.

**Why "lowest power" for HCF?** A factor of both numbers must divide each number. So it can only include a prime to a power that appears in **both** factorizations—i.e. the **minimum** (lowest) power of that prime.

**Method 1: Listing Factors**
1. List all factors of each number.
2. Identify factors that appear in every list.
3. The HCF is the largest of these common factors.
Best for small numbers; becomes tedious for large ones.

**Method 2: Prime Factorization** (Recommended for O-Level)
1. Express each number as a product of primes (index form).
2. Identify primes that appear in **all** factorizations.
3. For each such prime, take the **lowest power** that appears.
4. Multiply these together.

**Example**: HCF of $48 = 2^4 \\\\times 3$ and $72 = 2^3 \\\\times 3^2$. Common primes: 2 and 3. Lowest powers: $2^3$, $3^1$. So HCF = $2^3 \\\\times 3 = 24$.

**Euclidean algorithm** (optional): For two numbers, HCF(a, b) = HCF(b, a mod b); repeat until one number is 0; the other is the HCF. Useful for very large numbers.

**Applications**: HCF is used when we need to **split** or **share** quantities into equal parts with nothing left over—e.g. largest square tiles to cover a floor, maximum number of equal groups, simplifying fractions $\\\\frac{a}{b} = \\\\frac{a \\\\div \\\\text{HCF}}{b \\\\div \\\\text{HCF}}$.`,
                worked_examples: [
                    {
                        question: 'Find the HCF of 48 and 72 using prime factorization.',
                        steps: [
                            'Step 1 — Prime factorize 48: $48 \\\\div 2 = 24$, $24 \\\\div 2 = 12$, $12 \\\\div 2 = 6$, $6 \\\\div 2 = 3$, $3 \\\\div 3 = 1$. So $48 = 2^4 \\\\times 3$.',
                            'Step 2 — Prime factorize 72: $72 \\\\div 2 = 36$, $36 \\\\div 2 = 18$, $18 \\\\div 2 = 9$, $9 \\\\div 3 = 3$, $3 \\\\div 3 = 1$. So $72 = 2^3 \\\\times 3^2$.',
                            'Step 3 — Common primes in both: 2 and 3.',
                            'Step 4 — For HCF take lowest power: $2^3$ (not $2^4$) and $3^1$ (not $3^2$).',
                            'Step 5 — Multiply: HCF $= 2^3 \\\\times 3 = 8 \\\\times 3 = 24$.'
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
                    },
                    {
                        question: 'Simplify $\\\\frac{84}{126}$ to lowest terms using the HCF.',
                        steps: [
                            'Find HCF(84, 126): $84 = 2^2 \\\\times 3 \\\\times 7$, $126 = 2 \\\\times 3^2 \\\\times 7$',
                            'Common primes: 2, 3, 7. Lowest powers: $2^1$, $3^1$, $7^1$',
                            'HCF $= 2 \\\\times 3 \\\\times 7 = 42$',
                            'Divide numerator and denominator by 42: $\\\\frac{84 \\\\div 42}{126 \\\\div 42} = \\\\frac{2}{3}$'
                        ],
                        final_answer: '$\\\\frac{84}{126} = \\\\frac{2}{3}$'
                    }
                ]
            },
            {
                title: '4. LCM (Lowest Common Multiple)',
                content: `The **Lowest Common Multiple (LCM)** of two or more numbers is the **smallest** positive integer that is a multiple of all of them.

**Why "highest power" for LCM?** A common multiple must be divisible by each number. So it must contain every prime that appears in any factorization, and to a power at least as great as in that number—i.e. the **maximum** (highest) power of each prime.

**Method 1: Listing Multiples**
1. List multiples of each number until you find one that appears in every list.
2. That number is the LCM. Can be slow for large numbers or many numbers.

**Method 2: Prime Factorization** (Recommended)
1. Express each number as a product of primes.
2. Take **every** prime that appears in any factorization.
3. For each prime, take the **highest power** that appears.
4. Multiply these together.

**Example**: LCM of $12 = 2^2 \\\\times 3$ and $18 = 2 \\\\times 3^2$. Primes: 2, 3. Highest powers: $2^2$, $3^2$. So LCM = $4 \\\\times 9 = 36$.

**Important relationship** (for two numbers only):
$$\\\\text{HCF}(a, b) \\\\times \\\\text{LCM}(a, b) = a \\\\times b$$
So if you know HCF and the product $ab$, you can find LCM = $\\\\frac{a \\\\times b}{\\\\text{HCF}(a,b)}$, and vice versa.

**Applications**: LCM is used when things **repeat** or **synchronize**—e.g. when do two bells ring together again? When do two buses leave the station together? Smallest common denominator for adding fractions.`,
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
                    },
                    {
                        question: 'Two numbers have HCF = 6 and LCM = 72. One number is 18. Find the other.',
                        steps: [
                            'Use $\\\\text{HCF} \\\\times \\\\text{LCM} = a \\\\times b$',
                            'So $6 \\\\times 72 = 18 \\\\times b$ $\\\\Rightarrow 432 = 18b$',
                            'Therefore $b = \\\\frac{432}{18} = 24$',
                            'Check: HCF(18, 24) = 6, LCM(18, 24) = 72 ✓'
                        ],
                        final_answer: 'The other number is $24$.'
                    },
                    {
                        question: 'Find the LCM of 9, 12 and 15. Show prime factorizations.',
                        steps: [
                            '$9 = 3^2$, $12 = 2^2 \\\\times 3$, $15 = 3 \\\\times 5$',
                            'All primes: 2, 3, 5. Highest powers: $2^2$, $3^2$, $5^1$',
                            'LCM $= 4 \\\\times 9 \\\\times 5 = 180$'
                        ],
                        final_answer: '$\\\\text{LCM}(9, 12, 15) = 180$'
                    }
                ]
            },
            {
                title: '5. Operations with Real Numbers',
                content: `**Addition and Subtraction of Integers**:
- **Same signs**: Add the absolute values and keep the common sign.
  $$(-5) + (-3) = -(5 + 3) = -8 \\\\quad \\\\text{; } \\\\quad 4 + 7 = 11$$
- **Different signs**: Subtract the smaller absolute value from the larger; the answer takes the sign of the number with the larger absolute value.
  $$(-8) + 5 = -(8 - 5) = -3 \\\\quad \\\\text{; } \\\\quad (-3) + 9 = +(9-3) = 6$$
- **Subtraction** is the same as adding the opposite: $a - b = a + (-b)$. So $5 - (-2) = 5 + 2 = 7$.

**Multiplication and Division (Sign Rules)**:
| Signs        | Result |
|-------------|--------|
| (+)(+) or (+)÷(+) | + |
| (-)(-) or (-)÷(-) | + |
| (+)(-) or (-)(+) or (+)÷(-) or (-)÷(+) | - |

**Order of Operations (BODMAS / BIDMAS)**:
1. **B**rackets (innermost first)
2. **O**rders / **I**ndices (powers, roots)
3. **D**ivision and **M**ultiplication (left to right)
4. **A**ddition and **S**ubtraction (left to right)

So: $6 + 4 \\\\div 2 = 6 + 2 = 8$ (division before addition). And $12 \\\\div 3 \\\\times 2 = 4 \\\\times 2 = 8$ (left to right).

**Powers with negative bases**: $(-2)^2 = 4$ (even power → positive); $(-2)^3 = -8$ (odd power → negative). So $(-a)^n$ is positive when $n$ is even and negative when $n$ is odd (for $a > 0$).`,
                worked_examples: [
                    {
                        question: 'Evaluate: $-3 + 7 \\\\times 2 - (-4) \\\\div 2$',
                        steps: [
                            'BODMAS: no Brackets; Orders next — none here. Then Division and Multiplication (left to right).',
                            'Multiplication: $7 \\\\times 2 = 14$. Division: $(-4) \\\\div 2 = -2$.',
                            'Replace in expression: $-3 + 14 - (-2)$.',
                            'Interpret $ - (-2)$ as $+2$. So we have $-3 + 14 + 2$.',
                            'Addition left to right: $-3 + 14 = 11$, then $11 + 2 = 13$.'
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
                    },
                    {
                        question: 'Evaluate $\\\\frac{6 - 2 \\\\times 3}{4 - 1} + 5^2$. Show BODMAS step by step.',
                        steps: [
                            'Numerator: $6 - 2 \\\\times 3$. Do multiplication first: $2 \\\\times 3 = 6$',
                            'So numerator $= 6 - 6 = 0$',
                            'Denominator: $4 - 1 = 3$',
                            'First part: $\\\\frac{0}{3} = 0$',
                            'Orders: $5^2 = 25$',
                            'Add: $0 + 25 = 25$'
                        ],
                        final_answer: '$25$'
                    },
                    {
                        question: 'Work out: $(-12) \\\\div (-4) - 3 \\\\times (-2)$',
                        steps: [
                            'Division first: $(-12) \\\\div (-4) = +3$ (same signs $\\\\Rightarrow$ positive)',
                            'Multiplication: $3 \\\\times (-2) = -6$',
                            'Subtraction: $3 - (-6) = 3 + 6 = 9$'
                        ],
                        final_answer: '$9$'
                    }
                ]
            },
            {
                title: '6. Absolute Value',
                content: `The **absolute value** (or **modulus**) of a number $a$, written $|a|$, is its **distance from zero** on the number line. It is never negative.

**Definition**:
$$|a| = \\\\begin{cases} a & \\\\text{if } a \\\\geq 0 \\\\\\\\ -a & \\\\text{if } a < 0 \\\\end{cases}$$
So $|5| = 5$ and $|-5| = 5$; both are 5 units from 0.

**Key Properties**:
- $|a| \\\\geq 0$; $|a| = 0$ only when $a = 0$
- $|ab| = |a| \\\\cdot |b|$ and $\\\\left|\\\\frac{a}{b}\\\\right| = \\\\frac{|a|}{|b|}$ ($b \\\\neq 0$)
- $|-a| = |a|$
- **Triangle inequality**: $|a + b| \\\\leq |a| + |b|$ (equality when $a$ and $b$ have the same sign or one is 0)
- $|a - b|$ is the **distance between $a$ and $b$** on the number line

**Solving $|x| = k$** ($k > 0$): $x = k$ or $x = -k$.

**Solving $|\\\\text{expression}| = k$**: Set the expression equal to $k$ and to $-k$, then solve each equation. Always substitute back to check.

**Inequalities**: $|x| < k$ means $-k < x < k$; $|x| > k$ means $x < -k$ or $x > k$ (for $k > 0$).`,
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
                    },
                    {
                        question: 'Solve $|2x + 1| = 7$. Show both cases.',
                        steps: [
                            'Case 1: $2x + 1 = 7$ $\\\\Rightarrow 2x = 6$ $\\\\Rightarrow x = 3$',
                            'Case 2: $2x + 1 = -7$ $\\\\Rightarrow 2x = -8$ $\\\\Rightarrow x = -4$',
                            'Check: $|2(3)+1| = |7| = 7$ ✓ and $|2(-4)+1| = |-7| = 7$ ✓'
                        ],
                        final_answer: '$x = 3$ or $x = -4$'
                    },
                    {
                        question: 'Find all values of $x$ such that $|x - 2| \\\\leq 5$.',
                        steps: [
                            'Inequality $|x - 2| \\\\leq 5$ means $-5 \\\\leq x - 2 \\\\leq 5$',
                            'Add 2 to all parts: $-5 + 2 \\\\leq x \\\\leq 5 + 2$',
                            'So $-3 \\\\leq x \\\\leq 7$'
                        ],
                        final_answer: '$-3 \\\\leq x \\\\leq 7$'
                    }
                ]
            },
            {
                title: '7. Rounding, Estimation & Significant Figures',
                content: `**Rounding to Decimal Places (d.p.)**:
Look at the digit **immediately after** the last required decimal place:
- If that digit is **5 or more**, round the last required digit **up**.
- If it is **less than 5**, leave the last required digit unchanged (round down).
Examples: $2.346 \\\\to 2.35$ (2 d.p.); $2.344 \\\\to 2.34$ (2 d.p.). For 2.345 to 2 d.p., use the rule (5 or more → up): $2.35$.

**Significant Figures (s.f.)** — digits that carry meaning for precision:
1. **Non-zero** digits are always significant: 456 has 3 s.f.
2. **Zeros between** non-zero digits are significant: 4005 has 4 s.f.
3. **Leading zeros** (before first non-zero) are NOT significant: 0.00456 has 3 s.f.
4. **Trailing zeros after** a decimal point ARE significant: 2.300 has 4 s.f.
5. **Trailing zeros** in a whole number without a decimal are ambiguous (e.g. 1200 could be 2, 3, or 4 s.f.); use standard form or state explicitly.

**Estimation**: Round each number to **one significant figure** (or a convenient number), then do the calculation. Used to check reasonableness of answers and for quick approximations.

**Upper and Lower Bounds (Limits of Accuracy)**:
If a value is given as $5.4$ (to **1 d.p.**), the true value lies in the range where it would round to 5.4. The **lower bound** is $5.35$ and the **upper bound** is $5.45$ (we usually take $5.35 \\\\leq x < 5.45$ so that 5.45 rounds to 5.5, not 5.4). Use half the unit of the last place: for 1 d.p., half unit = 0.05. For **bounds in calculations** (e.g. area, speed), use the combination that gives the minimum or maximum result (e.g. lower bound of area = lower × lower; upper = upper × upper for multiplication of two lengths).`,
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
                    },
                    {
                        question: 'Write 3.0506 correct to (a) 3 s.f. (b) 2 d.p. Show which digit you use to round.',
                        steps: [
                            '(a) 3 s.f.: First three significant digits are 3, 0, 5. Next digit is 0 (less than 5), so do not round up. Answer: $3.05$.',
                            '(b) 2 d.p.: Third decimal place is 0. 0 < 5 so leave 5 unchanged. Answer: $3.05$.'
                        ],
                        final_answer: '(a) $3.05$ (b) $3.05$'
                    },
                    {
                        question: 'A rectangle has length 5.2 m and width 3.8 m (both to 1 d.p.). Find the lower and upper bounds for the area.',
                        steps: [
                            'Lower bound of length = $5.15$ m, upper = $5.25$ m',
                            'Lower bound of width = $3.75$ m, upper = $3.85$ m',
                            'Lower bound of area = $5.15 \\\\times 3.75 = 19.3125$ m$^2$',
                            'Upper bound of area = $5.25 \\\\times 3.85 = 20.2125$ m$^2$'
                        ],
                        final_answer: 'Area between $19.3125$ m$^2$ and $20.2125$ m$^2$'
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
                    },
                    {
                        question: 'Write 0.00038 in standard form. Then calculate $\\\\frac{0.00038 \\\\times 5000}{19}$ in standard form.',
                        steps: [
                            '$0.00038 = 3.8 \\\\times 10^{-4}$ (decimal moved 4 places right)',
                            'Numerator: $3.8 \\\\times 10^{-4} \\\\times 5 \\\\times 10^3 = 19 \\\\times 10^{-1} = 1.9 \\\\times 10^0$',
                            'Divide: $\\\\frac{1.9 \\\\times 10^0}{19} = 0.1 = 1 \\\\times 10^{-1}$'
                        ],
                        final_answer: '$1 \\\\times 10^{-1}$ or $0.1$'
                    },
                    {
                        question: 'Evaluate $(2 \\\\times 10^3) - (5 \\\\times 10^2)$. Give your answer in standard form.',
                        steps: [
                            'Same power of 10: $2 \\\\times 10^3 = 20 \\\\times 10^2$',
                            'Subtract: $20 \\\\times 10^2 - 5 \\\\times 10^2 = 15 \\\\times 10^2$',
                            'Standard form: $15 \\\\times 10^2 = 1.5 \\\\times 10^3$'
                        ],
                        final_answer: '$1.5 \\\\times 10^3$'
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
                    },
                    {
                        question: 'Convert $A3_{16}$ (hexadecimal) to base 10. (A = 10 in base 16.)',
                        steps: [
                            'Place values in base 16: $16^1 = 16$, $16^0 = 1$',
                            '$A \\\\times 16 = 10 \\\\times 16 = 160$',
                            '$3 \\\\times 1 = 3$',
                            'Total: $160 + 3 = 163$'
                        ],
                        final_answer: '$A3_{16} = 163_{10}$'
                    },
                    {
                        question: 'Convert $100_{10}$ to binary. Show repeated division.',
                        steps: [
                            '$100 \\\\div 2 = 50$ remainder $0$',
                            '$50 \\\\div 2 = 25$ remainder $0$',
                            '$25 \\\\div 2 = 12$ remainder $1$',
                            '$12 \\\\div 2 = 6$ remainder $0$',
                            '$6 \\\\div 2 = 3$ remainder $0$',
                            '$3 \\\\div 2 = 1$ remainder $1$',
                            '$1 \\\\div 2 = 0$ remainder $1$',
                            'Read remainders bottom to top: $1100100_2$'
                        ],
                        final_answer: '$100_{10} = 1100100_2$'
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
                            'Multiply top and bottom by the conjugate $2 - \\\\sqrt{3}$ (same terms, opposite sign in the middle).',
                            'Numerator: $4(2 - \\\\sqrt{3}) = 8 - 4\\\\sqrt{3}$.',
                            'Denominator: $(2 + \\\\sqrt{3})(2 - \\\\sqrt{3}) = 2^2 - (\\\\sqrt{3})^2 = 4 - 3 = 1$.',
                            'So $\\\\frac{8 - 4\\\\sqrt{3}}{1} = 8 - 4\\\\sqrt{3}$.'
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
                    },
                    {
                        question: 'Simplify $\\\\sqrt{200}$ fully.',
                        steps: [
                            'Find largest perfect square factor: $200 = 100 \\\\times 2$',
                            '$\\\\sqrt{200} = \\\\sqrt{100 \\\\times 2} = \\\\sqrt{100} \\\\times \\\\sqrt{2}$',
                            '$= 10 \\\\sqrt{2}$'
                        ],
                        final_answer: '$10\\\\sqrt{2}$'
                    },
                    {
                        question: 'Rationalize and simplify: $\\\\frac{6}{\\\\sqrt{2}}$',
                        steps: [
                            'Multiply numerator and denominator by $\\\\sqrt{2}$:',
                            '$\\\\frac{6}{\\\\sqrt{2}} \\\\times \\\\frac{\\\\sqrt{2}}{\\\\sqrt{2}} = \\\\frac{6\\\\sqrt{2}}{2}$',
                            'Simplify: $\\\\frac{6\\\\sqrt{2}}{2} = 3\\\\sqrt{2}$'
                        ],
                        final_answer: '$3\\\\sqrt{2}$'
                    },
                    {
                        question: 'Simplify $\\\\sqrt{20} + \\\\sqrt{45} - \\\\sqrt{5}$. Show each surd simplified.',
                        steps: [
                            '$\\\\sqrt{20} = \\\\sqrt{4 \\\\times 5} = 2\\\\sqrt{5}$',
                            '$\\\\sqrt{45} = \\\\sqrt{9 \\\\times 5} = 3\\\\sqrt{5}$',
                            'So $2\\\\sqrt{5} + 3\\\\sqrt{5} - \\\\sqrt{5} = (2+3-1)\\\\sqrt{5} = 4\\\\sqrt{5}$'
                        ],
                        final_answer: '$4\\\\sqrt{5}$'
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
            'Estimate answers before calculating to catch major errors.',
            'Use the app\'s 1000+ practice questions on real numbers to build speed and accuracy.'
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
        summary: 'Fractions, decimals, and percentages are three ways of representing parts of a whole. This topic covers: types of fractions (proper, improper, mixed) and converting between them; equivalent fractions and simplifying to lowest terms; adding, subtracting, multiplying, and dividing fractions using a common denominator or reciprocal; converting between fractions, decimals, and percentages; recurring decimals and converting them to fractions using algebra; percentage of a quantity, percentage change, and reverse percentages. These skills are used throughout O-Level Mathematics and in real-life contexts.',
        sections: [
            {
                title: '1. Types of Fractions',
                content: `A **fraction** is part of a whole, written as $\\\\frac{\\\\text{numerator}}{\\\\text{denominator}}$. The denominator shows how many equal parts the whole is split into; the numerator shows how many of those parts we have.

**Proper Fraction**: Numerator **less than** denominator. Value is less than 1.
Example: $\\\\frac{3}{5}$, $\\\\frac{7}{8}$.

**Improper (Top-heavy) Fraction**: Numerator **greater than or equal to** denominator. Value is $\\\\geq 1$.
Example: $\\\\frac{7}{4}$, $\\\\frac{5}{5} = 1$.

**Mixed Number**: A whole number plus a proper fraction. Example: $2\\\\frac{3}{5}$ means $2 + \\\\frac{3}{5}$.

**Converting mixed $\\\\to$ improper**: $a\\\\frac{b}{c} = \\\\frac{a \\\\times c + b}{c}$ (multiply whole by denominator, add numerator, keep denominator).

**Converting improper $\\\\to$ mixed**: Divide numerator by denominator; quotient = whole part, remainder = new numerator over same denominator. Example: $\\\\frac{17}{5} = 17 \\\\div 5 = 3$ remainder $2$ $\\\\Rightarrow 3\\\\frac{2}{5}$.

**Equivalent Fractions**: Fractions that represent the same value. Multiply or divide **both** numerator and denominator by the same non-zero number: $\\\\frac{a}{b} = \\\\frac{a \\\\times k}{b \\\\times k}$. To **simplify** to lowest terms, divide both by their HCF.`,
                worked_examples: [
                    {
                        question: 'Convert $2\\\\frac{3}{5}$ to an improper fraction.',
                        steps: [
                            'Formula: whole $\\\\times$ denominator $+$ numerator, over denominator.',
                            'Whole = 2, numerator = 3, denominator = 5.',
                            'New numerator = $2 \\\\times 5 + 3 = 10 + 3 = 13$.',
                            'Improper fraction = $\\\\frac{13}{5}$.'
                        ],
                        final_answer: '$\\\\frac{13}{5}$'
                    },
                    {
                        question: 'Convert $\\\\frac{19}{4}$ to a mixed number.',
                        steps: [
                            'Divide: $19 \\\\div 4 = 4$ remainder $3$.',
                            'Whole part = 4, fractional part = $\\\\frac{3}{4}$.',
                            'So $\\\\frac{19}{4} = 4\\\\frac{3}{4}$.'
                        ],
                        final_answer: '$4\\\\frac{3}{4}$'
                    },
                    {
                        question: 'Simplify $\\\\frac{24}{36}$ to its lowest terms.',
                        steps: [
                            'Find HCF of 24 and 36: $24 = 2^3 \\\\times 3$, $36 = 2^2 \\\\times 3^2$. HCF = $2^2 \\\\times 3 = 12$.',
                            'Divide numerator and denominator by 12: $\\\\frac{24 \\\\div 12}{36 \\\\div 12} = \\\\frac{2}{3}$.'
                        ],
                        final_answer: '$\\\\frac{2}{3}$'
                    },
                    {
                        question: 'Write three fractions equivalent to $\\\\frac{2}{5}$.',
                        steps: [
                            'Multiply top and bottom by 2: $\\\\frac{2 \\\\times 2}{5 \\\\times 2} = \\\\frac{4}{10}$.',
                            'Multiply by 3: $\\\\frac{6}{15}$. Multiply by 4: $\\\\frac{8}{20}$.'
                        ],
                        final_answer: '$\\\\frac{4}{10}$, $\\\\frac{6}{15}$, $\\\\frac{8}{20}$ (or any $\\\\frac{2k}{5k}$, $k \\\\neq 0$)'
                    }
                ]
            },
            {
                title: '2. Operations with Fractions',
                content: `**Addition and Subtraction**: Fractions must have the **same denominator**. Find the LCM of the denominators (common denominator), convert each fraction to an equivalent one with that denominator, then add or subtract the numerators and keep the denominator. Simplify the result.
$$\\\\frac{a}{b} + \\\\frac{c}{d} = \\\\frac{ad + bc}{bd} \\\\quad \\\\text{(or use LCM for simpler numbers)}$$

**Multiplication**: Multiply **numerators together** and **denominators together**. Cancel common factors before or after multiplying to keep numbers small.
$$\\\\frac{a}{b} \\\\times \\\\frac{c}{d} = \\\\frac{ac}{bd}$$

**Division**: To divide by a fraction, **multiply by its reciprocal** (swap numerator and denominator). So $\\\\frac{a}{b} \\\\div \\\\frac{c}{d} = \\\\frac{a}{b} \\\\times \\\\frac{d}{c} = \\\\frac{ad}{bc}$.

**Mixed numbers**: Convert to improper fractions first, do the operation, then convert back to mixed if needed.`,
                worked_examples: [
                    {
                        question: 'Calculate $\\\\frac{2}{3} + \\\\frac{3}{4}$. Show common denominator.',
                        steps: [
                            'LCM of 3 and 4 = 12 (common denominator).',
                            'Convert: $\\\\frac{2}{3} = \\\\frac{2 \\\\times 4}{3 \\\\times 4} = \\\\frac{8}{12}$, $\\\\frac{3}{4} = \\\\frac{3 \\\\times 3}{4 \\\\times 3} = \\\\frac{9}{12}$.',
                            'Add: $\\\\frac{8}{12} + \\\\frac{9}{12} = \\\\frac{17}{12}$.',
                            'As mixed number: $17 \\\\div 12 = 1$ remainder $5$ $\\\\Rightarrow 1\\\\frac{5}{12}$.'
                        ],
                        final_answer: '$\\\\frac{17}{12}$ or $1\\\\frac{5}{12}$'
                    },
                    {
                        question: 'Calculate $\\\\frac{5}{6} - \\\\frac{1}{4}$.',
                        steps: [
                            'LCM of 6 and 4 = 12.',
                            '$\\\\frac{5}{6} = \\\\frac{10}{12}$, $\\\\frac{1}{4} = \\\\frac{3}{12}$.',
                            'Subtract: $\\\\frac{10}{12} - \\\\frac{3}{12} = \\\\frac{7}{12}$.',
                            'Already in lowest terms (HCF(7, 12) = 1).'
                        ],
                        final_answer: '$\\\\frac{7}{12}$'
                    },
                    {
                        question: 'Calculate $\\\\frac{5}{6} \\\\div \\\\frac{2}{3}$.',
                        steps: [
                            'Division $\\\\Rightarrow$ multiply by reciprocal: $\\\\frac{5}{6} \\\\times \\\\frac{3}{2}$.',
                            'Multiply: $\\\\frac{5 \\\\times 3}{6 \\\\times 2} = \\\\frac{15}{12}$.',
                            'Simplify: HCF(15, 12) = 3, so $\\\\frac{15}{12} = \\\\frac{5}{4}$.',
                            'As mixed: $\\\\frac{5}{4} = 1\\\\frac{1}{4}$.'
                        ],
                        final_answer: '$\\\\frac{5}{4}$ or $1\\\\frac{1}{4}$'
                    },
                    {
                        question: 'Work out $1\\\\frac{2}{3} \\\\times \\\\frac{4}{5}$.',
                        steps: [
                            'Convert mixed to improper: $1\\\\frac{2}{3} = \\\\frac{5}{3}$.',
                            'Multiply: $\\\\frac{5}{3} \\\\times \\\\frac{4}{5} = \\\\frac{5 \\\\times 4}{3 \\\\times 5} = \\\\frac{20}{15}$.',
                            'Cancel or simplify: $\\\\frac{20}{15} = \\\\frac{4}{3} = 1\\\\frac{1}{3}$.'
                        ],
                        final_answer: '$\\\\frac{4}{3}$ or $1\\\\frac{1}{3}$'
                    },
                    {
                        question: 'Calculate $\\\\frac{3}{8} + \\\\frac{1}{6} - \\\\frac{1}{4}$.',
                        steps: [
                            'LCM of 8, 6, 4 = 24.',
                            '$\\\\frac{3}{8} = \\\\frac{9}{24}$, $\\\\frac{1}{6} = \\\\frac{4}{24}$, $\\\\frac{1}{4} = \\\\frac{6}{24}$.',
                            'Add and subtract: $\\\\frac{9}{24} + \\\\frac{4}{24} - \\\\frac{6}{24} = \\\\frac{7}{24}$.'
                        ],
                        final_answer: '$\\\\frac{7}{24}$'
                    }
                ]
            },
            {
                title: '3. Conversions (Fraction $\\\\leftrightarrow$ Decimal $\\\\leftrightarrow$ Percentage)',
                content: `**Fraction to Decimal**: Divide the numerator by the denominator (possibly using long division). Terminating decimals come from fractions whose denominator (in lowest terms) has only factors 2 and 5.

**Decimal to Fraction**: Write the decimal as the number (ignoring the decimal point) over a power of 10 (one 0 per digit after the decimal), then simplify. Example: $0.35 = \\\\frac{35}{100} = \\\\frac{7}{20}$.

**Fraction to Percentage**: Multiply the fraction by $100\\\\%$, or do (numerator $\\\\div$ denominator) $\\\\times 100$. So $\\\\frac{3}{5} = 0.6 = 60\\\\%$.

**Percentage to Fraction**: Write the percentage over 100 and simplify. Example: $45\\\\% = \\\\frac{45}{100} = \\\\frac{9}{20}$.

**Recurring Decimals to Fraction**: Use algebra. For $0.\\\\overline{ab...}$ (one repeating block), let $x$ = the decimal; multiply by $10^n$ where $n$ = number of digits in the block; subtract $x$ from $10^n x$ to remove the repeating part; solve for $x$. Rule of thumb: one repeating digit $\\\\Rightarrow$ over 9; two digits $\\\\Rightarrow$ over 99; etc. Example: $0.\\\\overline{3} = \\\\frac{3}{9} = \\\\frac{1}{3}$.`,
                worked_examples: [
                    {
                        question: 'Convert $0.\\\\overline{36}$ to a fraction. Show full algebra.',
                        steps: [
                            'Let $x = 0.363636...$ (two digits repeat, so multiply by 100).',
                            '$100x = 36.363636...$',
                            'Subtract: $100x - x = 36.363636... - 0.363636... = 36$, so $99x = 36$.',
                            'Solve: $x = \\\\frac{36}{99}$. Simplify: HCF(36, 99) = 9, so $x = \\\\frac{4}{11}$.'
                        ],
                        final_answer: '$0.\\\\overline{36} = \\\\frac{4}{11}$'
                    },
                    {
                        question: 'Convert $\\\\frac{5}{8}$ to a decimal and to a percentage.',
                        steps: [
                            'Decimal: $5 \\\\div 8 = 0.625$.',
                            'Percentage: $0.625 \\\\times 100\\\\% = 62.5\\\\%$ or $\\\\frac{5}{8} \\\\times 100\\\\% = \\\\frac{500}{8}\\\\% = 62.5\\\\%$.'
                        ],
                        final_answer: 'Decimal: $0.625$; Percentage: $62.5\\\\%$'
                    },
                    {
                        question: 'Write $0.\\\\overline{7}$ as a fraction.',
                        steps: [
                            'Let $x = 0.777...$ One digit repeats $\\\\Rightarrow$ multiply by 10: $10x = 7.777...$',
                            'Subtract: $10x - x = 7$, so $9x = 7$, hence $x = \\\\frac{7}{9}$.'
                        ],
                        final_answer: '$0.\\\\overline{7} = \\\\frac{7}{9}$'
                    },
                    {
                        question: 'Convert $12.5\\\\%$ to a fraction in lowest terms and to a decimal.',
                        steps: [
                            'Fraction: $12.5\\\\% = \\\\frac{12.5}{100}$. Multiply top and bottom by 2: $\\\\frac{25}{200} = \\\\frac{1}{8}$.',
                            'Decimal: $12.5 \\\\div 100 = 0.125$.'
                        ],
                        final_answer: 'Fraction: $\\\\frac{1}{8}$; Decimal: $0.125$'
                    }
                ]
            },
            {
                title: '4. Percentage Calculations',
                content: `**Finding a Percentage of a Quantity**: Replace "of" with $\\\\times$. So $p\\\\%$ of $Q$ = $\\\\frac{p}{100} \\\\times Q$. Example: 20% of 80 = $\\\\frac{20}{100} \\\\times 80 = 16$.

**Finding What Percentage One Number Is of Another**: $\\\\text{Percentage} = \\\\frac{\\\\text{Part}}{\\\\text{Whole}} \\\\times 100\\\\%$. The "whole" is the quantity you are comparing against.

**Percentage Increase**: $\\\\text{Increase} = \\\\frac{\\\\text{New} - \\\\text{Original}}{\\\\text{Original}} \\\\times 100\\\\%$. Same formula for **percentage decrease** (the result will be negative if the value went down).

**Reverse Percentages**: After a change, you know the **new** value and the **percentage change**; you want the **original** value. Method: express the new value as a fraction of the original (e.g. after 20% discount, new = 80% of original = $0.8 \\\\times$ original), then divide the new value by that decimal to get the original. So Original = $\\\\frac{\\\\text{New}}{\\\\text{multiplier}}$ (e.g. $\\\\frac{60}{0.8} = 75$).`,
                worked_examples: [
                    {
                        question: 'A shirt costs $60 after a 20% discount. What was the original price?',
                        steps: [
                            'A 20% discount means you pay 100% - 20% = 80% of the original.',
                            'So $60 = 80\\\\%$ of original $= 0.8 \\\\times \\\\text{original}$.',
                            'Original $= \\\\frac{60}{0.8} = \\\\frac{600}{8} = 75$.'
                        ],
                        final_answer: 'Original price = $\\\\$75$'
                    },
                    {
                        question: 'A population increases from 5000 to 5750. Find the percentage increase.',
                        steps: [
                            'Increase = $5750 - 5000 = 750$.',
                            'Percentage increase = $\\\\frac{\\\\text{increase}}{\\\\text{original}} \\\\times 100\\\\% = \\\\frac{750}{5000} \\\\times 100 = 15\\\\%$.'
                        ],
                        final_answer: '$15\\\\%$ increase'
                    },
                    {
                        question: 'What is 35% of 240?',
                        steps: [
                            '35% of 240 = $\\\\frac{35}{100} \\\\times 240 = \\\\frac{35 \\\\times 240}{100} = \\\\frac{8400}{100} = 84$.'
                        ],
                        final_answer: '$84$'
                    },
                    {
                        question: 'A price is increased by 15% to $92. Find the original price.',
                        steps: [
                            'After 15% increase, new = 115% of original = $1.15 \\\\times$ original.',
                            'So $92 = 1.15 \\\\times \\\\text{original}$ $\\\\Rightarrow$ original $= \\\\frac{92}{1.15} = 80$.'
                        ],
                        final_answer: 'Original price = $\\\\$80$'
                    },
                    {
                        question: 'In a class of 30, 18 are girls. What percentage are girls?',
                        steps: [
                            'Percentage = $\\\\frac{18}{30} \\\\times 100\\\\% = \\\\frac{1800}{30} = 60\\\\%$.'
                        ],
                        final_answer: '$60\\\\%$ are girls'
                    },
                    {
                        question: 'A phone was $400. It is reduced by 12%. Find the new price.',
                        steps: [
                            '12% of 400 = $\\\\frac{12}{100} \\\\times 400 = 48$.',
                            'New price = original - decrease = $400 - 48 = 352$.',
                            'Alternatively: 88% of 400 = $0.88 \\\\times 400 = 352$.'
                        ],
                        final_answer: 'New price = $\\\\$352$'
                    }
                ]
            }
        ],
        key_points: [
            'Proper fraction: numerator < denominator; improper $\\\\geq 1$; mixed = whole + proper.',
            'Mixed $\\\\to$ improper: $a\\\\frac{b}{c} = \\\\frac{a \\\\times c + b}{c}$. Simplify using HCF.',
            'To add/subtract fractions, use a common denominator (LCM); then add/subtract numerators.',
            'To multiply fractions: multiply numerators, multiply denominators; cancel when possible.',
            'To divide fractions: multiply by the reciprocal (flip the second fraction).',
            'Fraction $\\\\to$ decimal: divide numerator by denominator. Decimal $\\\\to$ fraction: over 10, 100, etc., then simplify.',
            'Recurring decimal $\\\\to$ fraction: let $x$ = decimal, multiply by $10^n$ (n = repeating digits), subtract and solve.',
            'Percentage of quantity: $\\\\frac{p}{100} \\\\times Q$. Percentage = $\\\\frac{\\\\text{part}}{\\\\text{whole}} \\\\times 100\\\\%$.',
            'Reverse percentage: new = multiplier $\\\\times$ original, so original = new $\\\\div$ multiplier.'
        ],
        exam_tips: [
            'Always simplify fractions to lowest terms at the end unless asked otherwise.',
            'For mixed numbers in operations, convert to improper first, then convert back if needed.',
            'In percentage problems, identify clearly: original, new, and whether you are finding part, whole, or %.',
            'Reverse %: work out what multiplier the change represents (e.g. 20% off $\\\\Rightarrow$ pay 80% $\\\\Rightarrow$ multiply by 0.8).',
            'For recurring decimals, state "Let $x = ...$" and show the subtraction step for full marks.',
            'When adding three or more fractions, use the LCM of all denominators.',
            'Check answers: e.g. 20% of 75 should be 15; $\\\\frac{4}{11} \\\\approx 0.3636...$.',
            'Use the app\'s 1000+ practice questions on fractions, decimals and percentages.'
        ],
        visual_descriptions: [
            'Pie chart or bar showing a fraction (e.g. $\\\\frac{3}{5}$) as 3 parts out of 5 equal parts.',
            'Number line from 0 to 1 with equivalent fractions ($\\\\frac{1}{2}$, $\\\\frac{2}{4}$, $\\\\frac{3}{6}$) at the same point.',
            'Diagram: mixed number $2\\\\frac{1}{4}$ as 2 whole circles plus one quarter of a circle.',
            'Table linking common fractions, decimals, and percentages (e.g. $\\\\frac{1}{2} = 0.5 = 50\\\\%$).',
            'Bar model for percentage: 100% bar split into parts for part/whole questions.'
        ]
    },
    'Ratio and Proportion': {
        topic: 'Ratio and Proportion',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'Ratios compare two or more quantities of the same kind in the form $a : b$ or $\\\\frac{a}{b}$. This topic covers: simplifying ratios (using HCF) and ratios with decimals or different units; dividing a quantity in a given ratio (total parts, value of one part, then multiply); direct proportion ($y \\\\propto x$, $y = kx$) and inverse proportion ($y \\\\propto \\\\frac{1}{x}$, $xy = k$); finding the constant $k$ and using it to find unknown values. Scale and map ratios (e.g. $1 : 25000$) link real distances to diagram distances.',
        sections: [
            {
                title: '1. Simplifying Ratios',
                content: `A **ratio** compares two or more quantities **in the same unit**. It can be written as $a : b$ or $a : b : c$, or as a fraction $\\\\frac{a}{b}$ (which simplifies to the same as the ratio in lowest terms).

**Simplifying a ratio**: Divide **all** parts by their **HCF** so that the ratio is in its simplest form (no common factor greater than 1). Example: $12 : 18$ has HCF $6$, so $12 : 18 = 2 : 3$.

**Ratios with decimals**: Multiply all parts by a power of 10 to make whole numbers, then simplify. Example: $2.5 : 1.5$ $\\\\Rightarrow$ $25 : 15 = 5 : 3$.

**Ratios with fractions**: Multiply all parts by the LCM of the denominators to clear fractions, then simplify. Or convert each part to a decimal first.

**Converting units**: Always express both quantities in the **same unit** before forming or simplifying the ratio. Example: $1\\\\text{ h} : 45\\\\text{ min} = 60\\\\text{ min} : 45\\\\text{ min} = 60 : 45 = 4 : 3$.`,
                worked_examples: [
                    {
                        question: 'Simplify the ratio $2.5 : 1.5$.',
                        steps: [
                            'Multiply both by 10 to get whole numbers: $2.5 \\\\times 10 : 1.5 \\\\times 10 = 25 : 15$.',
                            'HCF of 25 and 15 is 5.',
                            'Divide both parts by 5: $\\\\frac{25}{5} : \\\\frac{15}{5} = 5 : 3$.'
                        ],
                        final_answer: '$5 : 3$'
                    },
                    {
                        question: 'Simplify $\\\\frac{2}{3} : \\\\frac{4}{5}$ to a ratio of whole numbers.',
                        steps: [
                            'LCM of 3 and 5 is 15. Multiply both parts by 15.',
                            'First part: $\\\\frac{2}{3} \\\\times 15 = 10$. Second part: $\\\\frac{4}{5} \\\\times 15 = 12$.',
                            'Ratio $= 10 : 12$. HCF(10, 12) = 2, so $10 : 12 = 5 : 6$.'
                        ],
                        final_answer: '$5 : 6$'
                    },
                    {
                        question: 'Express 2 hours to 30 minutes as a ratio in its simplest form.',
                        steps: [
                            'Convert to same unit: 2 hours $= 120$ minutes, so ratio is $120 : 30$.',
                            'HCF(120, 30) = 30. $\\\\frac{120}{30} : \\\\frac{30}{30} = 4 : 1$.'
                        ],
                        final_answer: '$4 : 1$'
                    },
                    {
                        question: 'Simplify the ratio $24 : 36 : 60$.',
                        steps: [
                            'HCF of 24, 36, and 60: $24 = 2^3 \\\\times 3$, $36 = 2^2 \\\\times 3^2$, $60 = 2^2 \\\\times 3 \\\\times 5$. HCF $= 2^2 \\\\times 3 = 12$.',
                            'Divide each part by 12: $\\\\frac{24}{12} : \\\\frac{36}{12} : \\\\frac{60}{12} = 2 : 3 : 5$.'
                        ],
                        final_answer: '$2 : 3 : 5$'
                    }
                ]
            },
            {
                title: '2. Dividing in a Given Ratio',
                content: `To **share** or **divide** a quantity $Q$ in the ratio $a : b$ (or $a : b : c$):

1. **Total parts** $= a + b$ (or $a + b + c$).
2. **Value of one part** $= \\\\frac{Q}{\\\\text{total parts}}$.
3. **First share** $= a \\\\times \\\\frac{Q}{a+b}$, **second share** $= b \\\\times \\\\frac{Q}{a+b}$, and so on.

Check: the sum of all shares must equal $Q$. The ratio of the shares will equal $a : b$.`,
                worked_examples: [
                    {
                        question: 'Divide 120 in the ratio $3 : 5$.',
                        steps: [
                            'Total parts $= 3 + 5 = 8$.',
                            'Value of one part $= \\\\frac{120}{8} = 15$.',
                            'First share $= 3 \\\\times 15 = 45$.',
                            'Second share $= 5 \\\\times 15 = 75$.',
                            'Check: $45 + 75 = 120$ and $45 : 75 = 3 : 5$ ✓.'
                        ],
                        final_answer: '$45$ and $75$'
                    },
                    {
                        question: 'Share $\\\\$360$ among three people in the ratio $2 : 3 : 4$.',
                        steps: [
                            'Total parts $= 2 + 3 + 4 = 9$.',
                            'One part $= \\\\frac{360}{9} = 40$.',
                            'First: $2 \\\\times 40 = 80$, second: $3 \\\\times 40 = 120$, third: $4 \\\\times 40 = 160$.',
                            'Check: $80 + 120 + 160 = 360$ ✓.'
                        ],
                        final_answer: '$\\\\$80$, $\\\\$120$, $\\\\$160$'
                    },
                    {
                        question: 'In a school the ratio of boys to girls is $5 : 4$. There are 360 girls. How many boys are there?',
                        steps: [
                            'Girls correspond to 4 parts. So 4 parts $= 360$, hence 1 part $= \\\\frac{360}{4} = 90$.',
                            'Boys = 5 parts $= 5 \\\\times 90 = 450$.'
                        ],
                        final_answer: '$450$ boys'
                    }
                ]
            },
            {
                title: '3. Direct and Inverse Proportion',
                content: `**Direct proportion**: Two quantities are in direct proportion if doubling one doubles the other. We write $y \\\\propto x$ and then $y = kx$ for a constant $k$. So $\\\\frac{y}{x} = k$ (constant). For two pairs $(x_1, y_1)$ and $(x_2, y_2)$ we have
$$\\\\frac{y_1}{x_1} = \\\\frac{y_2}{x_2}$$

**Inverse proportion**: Two quantities are in inverse proportion if one increases when the other decreases so that their **product** is constant. We write $y \\\\propto \\\\frac{1}{x}$ and then $y = \\\\frac{k}{x}$, so $xy = k$. For two pairs:
$$x_1 y_1 = x_2 y_2$$

**Method**: Identify whether the problem is direct (more of A $\\\\Rightarrow$ more of B) or inverse (more of A $\\\\Rightarrow$ less of B). Find $k$ from given values, then use it to find the unknown.`,
                worked_examples: [
                    {
                        question: 'If $y$ is directly proportional to $x$ and $y = 12$ when $x = 4$, find $y$ when $x = 7$.',
                        steps: [
                            'Direct proportion: $y = kx$. Substitute $y = 12$, $x = 4$: $12 = k \\\\times 4$, so $k = 3$.',
                            'Equation: $y = 3x$.',
                            'When $x = 7$: $y = 3 \\\\times 7 = 21$.'
                        ],
                        final_answer: '$y = 21$'
                    },
                    {
                        question: 'If 8 workers complete a job in 6 days, how long will 12 workers take? (Assume inverse proportion.)',
                        steps: [
                            'More workers $\\\\Rightarrow$ fewer days: inverse proportion. So (workers) $\\\\times$ (days) $= k$.',
                            'From given: $8 \\\\times 6 = 48 = k$. So (workers) $\\\\times$ (days) $= 48$.',
                            'With 12 workers: $12 \\\\times \\\\text{days} = 48$, so days $= \\\\frac{48}{12} = 4$.'
                        ],
                        final_answer: '$4$ days'
                    },
                    {
                        question: '$P$ is inversely proportional to $Q$. When $P = 6$, $Q = 4$. Find $P$ when $Q = 3$.',
                        steps: [
                            'Inverse: $PQ = k$. So $6 \\\\times 4 = 24 = k$.',
                            'When $Q = 3$: $P \\\\times 3 = 24$, so $P = \\\\frac{24}{3} = 8$.'
                        ],
                        final_answer: '$P = 8$'
                    },
                    {
                        question: 'The cost of fuel is directly proportional to the number of litres. 15 litres cost $\\\\$45$. Find the cost of 23 litres.',
                        steps: [
                            'Cost $= k \\\\times$ litres. $45 = k \\\\times 15$ $\\\\Rightarrow$ $k = 3$.',
                            'Cost of 23 litres $= 3 \\\\times 23 = 69$.'
                        ],
                        final_answer: '$\\\\$69$'
                    }
                ]
            },
            {
                title: '4. Scale and Map Ratios',
                content: `A **scale** or **map ratio** tells you how real dimensions relate to diagram dimensions. It is usually given as $1 : n$ (e.g. $1 : 25000$), meaning 1 unit on the map represents $n$ units in reality.

**Map distance $\\\\to$ Real distance**: Multiply map distance by $n$. So if scale is $1 : 25000$, then 3 cm on the map $= 3 \\\\times 25000 = 75000\\\\text{ cm} = 750\\\\text{ m}$ (or $0.75\\\\text{ km}$).

**Real distance $\\\\to$ Map distance**: Divide real distance by $n$. So 5 km $= 500000\\\\text{ cm}$ $\\\\Rightarrow$ on map $\\\\frac{500000}{25000} = 20\\\\text{ cm}$.`,
                worked_examples: [
                    {
                        question: 'A map has scale $1 : 50000$. Two towns are 8 cm apart on the map. Find the actual distance in km.',
                        steps: [
                            'Actual distance $= 8 \\\\times 50000 = 400000\\\\text{ cm}$.',
                            'Convert: $400000\\\\text{ cm} = 4000\\\\text{ m} = 4\\\\text{ km}$.'
                        ],
                        final_answer: '$4\\\\text{ km}$'
                    },
                    {
                        question: 'Scale is $1 : 2000$. A real length of 360 m is represented by how many cm on the map?',
                        steps: [
                            '360 m $= 36000\\\\text{ cm}$ (real).',
                            'Map length $= \\\\frac{36000}{2000} = 18\\\\text{ cm}$.'
                        ],
                        final_answer: '$18\\\\text{ cm}$'
                    }
                ]
            }
        ],
        key_points: [
            'Ratio compares quantities in the **same unit**. Simplify by dividing all parts by their HCF.',
            'For decimals in ratio, multiply by a power of 10 first; for fractions, use LCM of denominators.',
            'Dividing $Q$ in ratio $a : b$: total parts $= a + b$, one part $= \\\\frac{Q}{a+b}$, shares $= a \\\\cdot \\\\frac{Q}{a+b}$ and $b \\\\cdot \\\\frac{Q}{a+b}$.',
            'Direct proportion: $y = kx$; $\\\\frac{y_1}{x_1} = \\\\frac{y_2}{x_2}$.',
            'Inverse proportion: $xy = k$; $x_1 y_1 = x_2 y_2$.',
            'Scale $1 : n$ means 1 unit on map $= n$ units in real life; real $= \\\\text{map} \\\\times n$, map $= \\\\frac{\\\\text{real}}{n}$.'
        ],
        exam_tips: [
            'Always simplify ratios to lowest terms and convert units before forming a ratio.',
            'For "divide in ratio", state total parts and value of one part clearly for full marks.',
            'Decide direct vs inverse: if "more A gives more B" use direct; if "more A gives less B" use inverse.',
            'In proportion, write the equation (e.g. $y = kx$ or $xy = k$) and find $k$ before substituting.',
            'Scale: keep units consistent (e.g. convert cm to m or km when needed).',
            'Use the app\'s 1000+ practice questions on ratio and proportion.'
        ],
        visual_descriptions: [
            'Bar model: a bar split into segments in ratio $2 : 3 : 4$ with labels for each share.',
            'Graph of direct proportion: straight line through the origin ($y = kx$).',
            'Graph of inverse proportion: curve (rectangular hyperbola) $xy = k$.',
            'Map with scale bar showing $1\\\\text{ cm} = 500\\\\text{ m}$.'
        ]
    }
};

export const numberTopics = Object.keys(numberNotes);
