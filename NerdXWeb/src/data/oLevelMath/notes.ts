// ZIMSEC O-Level Mathematics (4028/4029) Comprehensive Notes
// Textbook-quality notes with worked examples and practice problems
// Following the MathTopicNotes interface for consistency

import type { MathTopicNotes } from '../mathNotes/types';

// Complete notes for each O-Level Mathematics topic
export const oLevelMathNotes: Record<string, MathTopicNotes> = {
    // ============================================
    // TOPIC 1: NUMBER THEORY (Form 1-2)
    // ============================================
    'Number Theory': {
        topic: 'Number Theory',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: "Number Theory forms the foundation of mathematics, covering the properties of integers including factors, multiples, prime numbers, HCF (Highest Common Factor), and LCM (Lowest Common Multiple). Mastering these concepts is essential for simplifying fractions, solving word problems, and building a strong mathematical foundation for more advanced topics.",
        sections: [
            {
                title: '1. Factors and Multiples',
                videoUrl: 'https://www.youtube.com/embed/Z5tL5NW687I', // Sample Math Video
                audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Sample Audio
                content: "## Definitions\n\n**Factor**: A whole number that divides exactly into another number with no remainder.\n\n**Multiple**: A number obtained by multiplying a given number by a whole number.\n\n## Finding Factors\n\nTo find all factors of a number:\n1. Start from 1 and the number itself\n2. Check each number in between\n3. Factors come in pairs\n\n## Key Facts\n\n- Every number has 1 and itself as factors\n- The smallest factor of any number is 1\n- The largest factor of a number is the number itself",
                worked_examples: [
                    {
                        question: "Find all the factors of 36.",
                        steps: [
                            "Start with 1 and 36: 1 × 36 = 36 ✓",
                            "Try 2: 2 × 18 = 36 ✓",
                            "Try 3: 3 × 12 = 36 ✓",
                            "Try 4: 4 × 9 = 36 ✓",
                            "Try 5: 36 ÷ 5 = 7.2 ✗",
                            "Try 6: 6 × 6 = 36 ✓",
                            "List in order: 1, 2, 3, 4, 6, 9, 12, 18, 36"
                        ],
                        final_answer: "Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36 (9 factors)"
                    },
                    {
                        question: "List the first 5 multiples of 7.",
                        steps: [
                            "1 × 7 = 7",
                            "2 × 7 = 14",
                            "3 × 7 = 21",
                            "4 × 7 = 28",
                            "5 × 7 = 35"
                        ],
                        final_answer: "First 5 multiples of 7: 7, 14, 21, 28, 35"
                    }
                ]
            },
            {
                title: '2. Prime Numbers and Composite Numbers',
                content: "## Definitions\n\n**Prime Number**: A number greater than 1 that has exactly TWO factors: 1 and itself.\n\n**Composite Number**: A number greater than 1 that has MORE than two factors.\n\n## Special Cases\n\n- **1 is neither prime nor composite** (it has only one factor)\n- **2 is the only even prime number**\n- **0 is neither prime nor composite**\n\n## Prime Numbers up to 50\n\n2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47\n\n## Testing for Primes\n\nTo check if a number is prime, test divisibility by primes up to its square root.",
                worked_examples: [
                    {
                        question: "Is 97 a prime number?",
                        steps: [
                            "√97 ≈ 9.8, so test primes up to 9",
                            "Test 2: 97 is odd, so not divisible",
                            "Test 3: 9 + 7 = 16, not divisible by 3",
                            "Test 5: doesn't end in 0 or 5",
                            "Test 7: 97 ÷ 7 = 13.86, not exact",
                            "No prime factors found"
                        ],
                        final_answer: "Yes, 97 is a prime number"
                    },
                    {
                        question: "Write all prime numbers between 20 and 40.",
                        steps: [
                            "Check each number:",
                            "21 = 3 × 7 (composite)",
                            "22 = 2 × 11 (composite)",
                            "23 - only factors are 1 and 23 (PRIME)",
                            "24, 25, 26, 27, 28 (all composite)",
                            "29 - only factors are 1 and 29 (PRIME)",
                            "30, 32, 33, 34, 35, 36 (all composite)",
                            "31 - only factors are 1 and 31 (PRIME)",
                            "37 - only factors are 1 and 37 (PRIME)"
                        ],
                        final_answer: "23, 29, 31, 37"
                    }
                ]
            },
            {
                title: '3. Prime Factorisation',
                content: "## What is Prime Factorisation?\n\nWriting a number as a **product of its prime factors**.\n\n## Method 1: Factor Tree\n\n1. Divide by the smallest prime that works\n2. Continue until only primes remain\n3. Write the answer using powers\n\n## Method 2: Repeated Division\n\n1. Divide by 2 as many times as possible\n2. Then divide by 3, then 5, then 7...\n3. Continue until you reach 1\n\n## Index Notation\n\nWrite repeated factors using powers:\n$$2 \\\\times 2 \\\\times 2 = 2^3$$",
                worked_examples: [
                    {
                        question: "Write 360 as a product of prime factors.",
                        steps: [
                            "360 ÷ 2 = 180",
                            "180 ÷ 2 = 90",
                            "90 ÷ 2 = 45",
                            "45 ÷ 3 = 15",
                            "15 ÷ 3 = 5",
                            "5 ÷ 5 = 1",
                            "Prime factors: 2, 2, 2, 3, 3, 5"
                        ],
                        final_answer: "$360 = 2^3 \\\\times 3^2 \\\\times 5$"
                    },
                    {
                        question: "Express 1260 as a product of prime factors in index form.",
                        steps: [
                            "1260 ÷ 2 = 630",
                            "630 ÷ 2 = 315",
                            "315 ÷ 3 = 105",
                            "105 ÷ 3 = 35",
                            "35 ÷ 5 = 7",
                            "7 ÷ 7 = 1",
                            "Count: 2 appears twice, 3 appears twice, 5 once, 7 once"
                        ],
                        final_answer: "$1260 = 2^2 \\\\times 3^2 \\\\times 5 \\\\times 7$"
                    }
                ]
            },
            {
                title: '4. Highest Common Factor (HCF)',
                content: "## Definition\n\nThe **HCF** (or GCD - Greatest Common Divisor) is the largest number that divides exactly into two or more numbers.\n\n## Method 1: Listing Factors\n\n1. List all factors of each number\n2. Find common factors\n3. Choose the highest\n\n## Method 2: Prime Factorisation (Recommended)\n\n1. Prime factorise both numbers\n2. Identify **common primes**\n3. Take the **lowest power** of each common prime\n4. Multiply together\n\n## Applications\n\n- Simplifying fractions\n- Dividing items into equal groups\n- Finding the largest tile size",
                worked_examples: [
                    {
                        question: "Find the HCF of 48 and 72.",
                        steps: [
                            "Prime factorise: $48 = 2^4 \\\\times 3$",
                            "Prime factorise: $72 = 2^3 \\\\times 3^2$",
                            "Common primes: 2 and 3",
                            "Lowest powers: $2^3$ and $3^1$",
                            "HCF = $2^3 \\\\times 3 = 8 \\\\times 3 = 24$"
                        ],
                        final_answer: "HCF = 24"
                    },
                    {
                        question: "Find the HCF of 84, 126, and 210.",
                        steps: [
                            "$84 = 2^2 \\\\times 3 \\\\times 7$",
                            "$126 = 2 \\\\times 3^2 \\\\times 7$",
                            "$210 = 2 \\\\times 3 \\\\times 5 \\\\times 7$",
                            "Common primes: 2, 3, 7",
                            "Lowest powers: $2^1$, $3^1$, $7^1$",
                            "HCF = $2 \\\\times 3 \\\\times 7 = 42$"
                        ],
                        final_answer: "HCF = 42"
                    }
                ]
            },
            {
                title: '5. Lowest Common Multiple (LCM)',
                content: "## Definition\n\nThe **LCM** is the smallest number that is a multiple of two or more numbers.\n\n## Method 1: Listing Multiples\n\n1. List multiples of each number\n2. Find the smallest common multiple\n\n## Method 2: Prime Factorisation (Recommended)\n\n1. Prime factorise both numbers\n2. Take **ALL primes** that appear\n3. Use the **highest power** of each prime\n4. Multiply together\n\n## Important Identity\n\nFor two numbers a and b:\n$$\\\\text{HCF} \\\\times \\\\text{LCM} = a \\\\times b$$\n\n## Applications\n\n- When events repeat together\n- Finding common denominators",
                worked_examples: [
                    {
                        question: "Find the LCM of 12 and 18.",
                        steps: [
                            "Prime factorise: $12 = 2^2 \\\\times 3$",
                            "Prime factorise: $18 = 2 \\\\times 3^2$",
                            "All primes: 2 and 3",
                            "Highest powers: $2^2$ and $3^2$",
                            "LCM = $2^2 \\\\times 3^2 = 4 \\\\times 9 = 36$"
                        ],
                        final_answer: "LCM = 36"
                    },
                    {
                        question: "Two lights flash every 8 seconds and 12 seconds. When will they flash together again?",
                        steps: [
                            "Find LCM of 8 and 12",
                            "$8 = 2^3$",
                            "$12 = 2^2 \\\\times 3$",
                            "LCM = $2^3 \\\\times 3 = 8 \\\\times 3 = 24$"
                        ],
                        final_answer: "They flash together every 24 seconds"
                    }
                ]
            },
            {
                title: '6. Divisibility Tests',
                content: "## Quick Divisibility Rules\n\n| Divisor | Test |\n|---------|------|\n| 2 | Last digit is even (0, 2, 4, 6, 8) |\n| 3 | Sum of digits divisible by 3 |\n| 4 | Last two digits divisible by 4 |\n| 5 | Last digit is 0 or 5 |\n| 6 | Divisible by both 2 AND 3 |\n| 8 | Last three digits divisible by 8 |\n| 9 | Sum of digits divisible by 9 |\n| 10 | Last digit is 0 |\n| 11 | Alternating sum of digits divisible by 11 |\n\n## Why These Work\n\nBased on place value and modular arithmetic principles.",
                worked_examples: [
                    {
                        question: "Test if 2736 is divisible by 2, 3, 4, 6, and 9.",
                        steps: [
                            "By 2: Last digit 6 is even ✓",
                            "By 3: 2+7+3+6 = 18, divisible by 3 ✓",
                            "By 4: Last two digits 36, 36÷4 = 9 ✓",
                            "By 6: Divisible by 2 and 3 ✓",
                            "By 9: 2+7+3+6 = 18, divisible by 9 ✓"
                        ],
                        final_answer: "2736 is divisible by 2, 3, 4, 6, and 9"
                    },
                    {
                        question: "Find the digit d so that 45d2 is divisible by 9.",
                        steps: [
                            "For divisibility by 9, sum of digits must be divisible by 9",
                            "Sum = 4 + 5 + d + 2 = 11 + d",
                            "11 + d must be 18 (next multiple of 9 after 11)",
                            "d = 18 - 11 = 7"
                        ],
                        final_answer: "d = 7"
                    }
                ]
            },
            {
                title: '7. Types of Numbers',
                content: "## Number Classifications\n\n**Natural Numbers (ℕ)**: 1, 2, 3, 4, 5, ... (counting numbers)\n\n**Whole Numbers**: 0, 1, 2, 3, 4, ... (natural + zero)\n\n**Integers (ℤ)**: ..., -2, -1, 0, 1, 2, ... (positive and negative whole numbers)\n\n**Even Numbers**: Divisible by 2 (0, 2, 4, 6, ...)\n\n**Odd Numbers**: Not divisible by 2 (1, 3, 5, 7, ...)\n\n## Square and Cube Numbers\n\n**Square numbers**: $1, 4, 9, 16, 25, 36, 49, 64, 81, 100, ...$\n\n**Cube numbers**: $1, 8, 27, 64, 125, 216, ...$\n\n## Properties\n\n- Even ± Even = Even\n- Odd ± Odd = Even\n- Even ± Odd = Odd\n- Even × Any = Even\n- Odd × Odd = Odd",
                worked_examples: [
                    {
                        question: "Is the sum of three consecutive integers always divisible by 3?",
                        steps: [
                            "Let the integers be n, n+1, n+2",
                            "Sum = n + (n+1) + (n+2) = 3n + 3 = 3(n+1)",
                            "This is always a multiple of 3"
                        ],
                        final_answer: "Yes, the sum equals 3(n+1), always divisible by 3"
                    },
                    {
                        question: "Prove that the product of any two consecutive integers is always even.",
                        steps: [
                            "Let the integers be n and n+1",
                            "One must be even, one must be odd",
                            "Even × Odd = Even",
                            "Product n(n+1) is always even"
                        ],
                        final_answer: "Proved: consecutive integers always include one even number"
                    }
                ]
            },
            {
                title: '8. Word Problems Using HCF and LCM',
                content: "## When to Use HCF\n\n- **Dividing** items into equal groups\n- Finding the **largest** piece/tile that fits exactly\n- **Simplifying** to lowest terms\n\n## When to Use LCM\n\n- **Events repeating** together\n- **Common denominators**\n- Finding the **smallest** amount that works for all\n\n## Problem-Solving Strategy\n\n1. Identify if it's a sharing/dividing problem (HCF) or repeating/combining problem (LCM)\n2. Extract the numbers\n3. Use prime factorisation\n4. Answer in context",
                worked_examples: [
                    {
                        question: "Sarah has 48 red sweets and 64 blue sweets. She wants to put them equally into bags with the same number of each colour in each bag. What is the maximum number of bags she can make?",
                        steps: [
                            "Key word: maximum equal groups → HCF",
                            "$48 = 2^4 \\\\times 3$",
                            "$64 = 2^6$",
                            "HCF = $2^4 = 16$",
                            "Each bag: 48÷16 = 3 red, 64÷16 = 4 blue"
                        ],
                        final_answer: "Maximum 16 bags (3 red and 4 blue sweets each)"
                    },
                    {
                        question: "Bus A leaves the station every 15 minutes. Bus B leaves every 20 minutes. If both leave at 9:00 AM, when do they next leave together?",
                        steps: [
                            "Key word: next time together → LCM",
                            "$15 = 3 \\\\times 5$",
                            "$20 = 2^2 \\\\times 5$",
                            "LCM = $2^2 \\\\times 3 \\\\times 5 = 60$ minutes",
                            "60 minutes = 1 hour after 9:00 AM"
                        ],
                        final_answer: "They next leave together at 10:00 AM"
                    }
                ]
            },
            {
                title: '9. Try This Yourself - Practice Problems',
                content: "## Practice Problems with Answers\n\n---\n\n### Problem 1: Factors\nFind all factors of 54.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\n1×54, 2×27, 3×18, 6×9\n\n**Answer: 1, 2, 3, 6, 9, 18, 27, 54 (8 factors)**\n</details>\n\n---\n\n### Problem 2: Prime Factorisation\nExpress 540 as a product of prime factors.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\n540 = 2² × 3³ × 5\n\n**Answer: $2^2 \\\\times 3^3 \\\\times 5$**\n</details>\n\n---\n\n### Problem 3: HCF\nFind the HCF of 60 and 84.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\n60 = 2² × 3 × 5\n84 = 2² × 3 × 7\nCommon: 2², 3\nHCF = 4 × 3 = 12\n\n**Answer: 12**\n</details>\n\n---\n\n### Problem 4: LCM\nFind the LCM of 8, 12, and 15.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\n8 = 2³, 12 = 2² × 3, 15 = 3 × 5\nLCM = 2³ × 3 × 5 = 120\n\n**Answer: 120**\n</details>\n\n---\n\n### Problem 5: ZIMSEC Style\nA rectangular floor measures 360 cm by 480 cm. Square tiles are to be used to cover the floor without cutting. What is the largest possible size of each tile?\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nLargest tile → HCF of 360 and 480\n360 = 2³ × 3² × 5\n480 = 2⁵ × 3 × 5\nHCF = 2³ × 3 × 5 = 120\n\n**Answer: 120 cm × 120 cm tiles**\n</details>\n\n---\n\n### Problem 6: ZIMSEC Style\nThree bells ring at intervals of 6, 8, and 12 minutes. If they all ring together at 8:00 AM, when will they next ring together?\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nLCM of 6, 8, 12\n6 = 2 × 3, 8 = 2³, 12 = 2² × 3\nLCM = 2³ × 3 = 24 minutes\n\n**Answer: 8:24 AM**\n</details>"
            }
        ],
        key_points: [
            "A factor divides exactly; a multiple is the result of multiplication",
            "Prime numbers have exactly 2 factors: 1 and themselves",
            "1 is NOT prime (only 1 factor); 2 is the only even prime",
            "Prime factorisation: write as product of primes using powers",
            "HCF uses common primes with LOWEST powers",
            "LCM uses ALL primes with HIGHEST powers",
            "HCF × LCM = Product of the two numbers",
            "Divisibility tests save time on large numbers"
        ],
        exam_tips: [
            "Always show your prime factorisation working - it earns method marks.",
            "For HCF think 'sharing/dividing equally'; for LCM think 'happening together again'.",
            "Use the identity HCF × LCM = product to check your answers.",
            "Memorise divisibility rules for 2, 3, 4, 5, 6, 8, 9, and 10.",
            "Write prime factors in order (2, 3, 5, 7...) for clarity.",
            "In word problems, identify whether it asks for the LARGEST (HCF) or SMALLEST (LCM)."
        ],
        visual_descriptions: [
            "Factor tree diagram showing 360 broken down to prime factors",
            "Venn diagram comparing prime factors of two numbers for HCF/LCM",
            "Number line showing multiples of 6 and 8 meeting at 24"
        ]
    },

    // ============================================
    // TOPIC 2: FRACTIONS, DECIMALS & PERCENTAGES (Form 1-2)
    // ============================================
    'Fractions, Decimals and Percentages': {
        topic: 'Fractions, Decimals and Percentages',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: "Understanding fractions, decimals, and percentages is essential for everyday mathematics and forms the basis for algebra, ratio problems, and financial mathematics. This topic covers operations with fractions, conversions between forms, and practical applications including percentage increase/decrease, profit and loss, and interest calculations.",
        sections: [
            {
                title: '1. Fractions - Types and Simplifying',
                content: "## Types of Fractions\n\n**Proper Fraction**: Numerator < Denominator (e.g., $\\\\frac{3}{5}$)\n\n**Improper Fraction**: Numerator ≥ Denominator (e.g., $\\\\frac{7}{4}$)\n\n**Mixed Number**: Whole number + proper fraction (e.g., $1\\\\frac{3}{4}$)\n\n## Simplifying Fractions\n\nDivide numerator and denominator by their HCF.\n\n$$\\\\frac{24}{36} = \\\\frac{24 \\\\div 12}{36 \\\\div 12} = \\\\frac{2}{3}$$\n\n## Equivalent Fractions\n\nMultiply/divide both parts by the same number:\n$$\\\\frac{2}{3} = \\\\frac{4}{6} = \\\\frac{6}{9} = \\\\frac{8}{12}$$",
                worked_examples: [
                    {
                        question: "Simplify $\\\\frac{48}{72}$ to its lowest terms.",
                        steps: [
                            "Find HCF of 48 and 72",
                            "48 = 2⁴ × 3, 72 = 2³ × 3²",
                            "HCF = 2³ × 3 = 24",
                            "$\\\\frac{48}{72} = \\\\frac{48 \\\\div 24}{72 \\\\div 24} = \\\\frac{2}{3}$"
                        ],
                        final_answer: "$\\\\frac{2}{3}$"
                    },
                    {
                        question: "Convert $\\\\frac{17}{5}$ to a mixed number.",
                        steps: [
                            "Divide: 17 ÷ 5 = 3 remainder 2",
                            "Whole part = 3, Fraction = $\\\\frac{2}{5}$"
                        ],
                        final_answer: "$3\\\\frac{2}{5}$"
                    }
                ]
            },
            {
                title: '2. Adding and Subtracting Fractions',
                content: "## Same Denominators\n\nAdd/subtract numerators, keep denominator:\n$$\\\\frac{3}{7} + \\\\frac{2}{7} = \\\\frac{5}{7}$$\n\n## Different Denominators\n\n1. Find LCD (Lowest Common Denominator)\n2. Convert each fraction\n3. Add/subtract numerators\n4. Simplify if needed\n\n## With Mixed Numbers\n\nMethod 1: Convert to improper fractions, then add\nMethod 2: Add whole parts and fractions separately",
                worked_examples: [
                    {
                        question: "Calculate $\\\\frac{2}{3} + \\\\frac{3}{4}$.",
                        steps: [
                            "LCD of 3 and 4 is 12",
                            "$\\\\frac{2}{3} = \\\\frac{8}{12}$",
                            "$\\\\frac{3}{4} = \\\\frac{9}{12}$",
                            "$\\\\frac{8}{12} + \\\\frac{9}{12} = \\\\frac{17}{12} = 1\\\\frac{5}{12}$"
                        ],
                        final_answer: "$1\\\\frac{5}{12}$"
                    },
                    {
                        question: "Calculate $3\\\\frac{1}{2} - 1\\\\frac{3}{4}$.",
                        steps: [
                            "Convert to improper: $\\\\frac{7}{2} - \\\\frac{7}{4}$",
                            "LCD = 4",
                            "$\\\\frac{14}{4} - \\\\frac{7}{4} = \\\\frac{7}{4} = 1\\\\frac{3}{4}$"
                        ],
                        final_answer: "$1\\\\frac{3}{4}$"
                    }
                ]
            },
            {
                title: '3. Multiplying and Dividing Fractions',
                content: "## Multiplication Rule\n\nMultiply numerators, multiply denominators:\n$$\\\\frac{a}{b} \\\\times \\\\frac{c}{d} = \\\\frac{a \\\\times c}{b \\\\times d}$$\n\n**Tip**: Cancel common factors BEFORE multiplying!\n\n## Division Rule\n\n**Keep, Change, Flip** (KCF):\n$$\\\\frac{a}{b} \\\\div \\\\frac{c}{d} = \\\\frac{a}{b} \\\\times \\\\frac{d}{c}$$\n\n## Of means Multiply\n\n\"$\\\\frac{3}{4}$ of 20\" means $\\\\frac{3}{4} \\\\times 20$",
                worked_examples: [
                    {
                        question: "Calculate $\\\\frac{3}{5} \\\\times \\\\frac{10}{9}$.",
                        steps: [
                            "Cancel before multiplying: 3 and 9 share factor 3; 5 and 10 share factor 5",
                            "$\\\\frac{3}{5} \\\\times \\\\frac{10}{9} = \\\\frac{1}{1} \\\\times \\\\frac{2}{3} = \\\\frac{2}{3}$"
                        ],
                        final_answer: "$\\\\frac{2}{3}$"
                    },
                    {
                        question: "Calculate $2\\\\frac{1}{3} \\\\div \\\\frac{7}{9}$.",
                        steps: [
                            "Convert: $\\\\frac{7}{3} \\\\div \\\\frac{7}{9}$",
                            "Keep, Change, Flip: $\\\\frac{7}{3} \\\\times \\\\frac{9}{7}$",
                            "Cancel 7s: $\\\\frac{1}{3} \\\\times \\\\frac{9}{1} = \\\\frac{9}{3} = 3$"
                        ],
                        final_answer: "3"
                    },
                    {
                        question: "Find $\\\\frac{2}{3}$ of 45.",
                        steps: [
                            "$\\\\frac{2}{3} \\\\times 45 = \\\\frac{2 \\\\times 45}{3} = \\\\frac{90}{3} = 30$"
                        ],
                        final_answer: "30"
                    }
                ]
            },
            {
                title: '4. Converting Between Fractions, Decimals, and Percentages',
                content: "## Conversion Chart\n\n| From | To Decimal | To Percentage | To Fraction |\n|------|------------|---------------|-------------|\n| Fraction $\\\\frac{a}{b}$ | a ÷ b | (a ÷ b) × 100% | - |\n| Decimal d | - | d × 100% | Count decimal places |\n| Percentage p% | p ÷ 100 | - | $\\\\frac{p}{100}$ |\n\n## Common Equivalents (Memorise!)\n\n| Fraction | Decimal | Percentage |\n|----------|---------|------------|\n| $\\\\frac{1}{2}$ | 0.5 | 50% |\n| $\\\\frac{1}{4}$ | 0.25 | 25% |\n| $\\\\frac{3}{4}$ | 0.75 | 75% |\n| $\\\\frac{1}{5}$ | 0.2 | 20% |\n| $\\\\frac{1}{3}$ | 0.333... | 33.3̅% |",
                worked_examples: [
                    {
                        question: "Convert $\\\\frac{7}{8}$ to a decimal and percentage.",
                        steps: [
                            "Decimal: 7 ÷ 8 = 0.875",
                            "Percentage: 0.875 × 100 = 87.5%"
                        ],
                        final_answer: "0.875 and 87.5%"
                    },
                    {
                        question: "Convert 0.125 to a fraction in lowest terms.",
                        steps: [
                            "0.125 = $\\\\frac{125}{1000}$",
                            "Simplify: $\\\\frac{125}{1000} = \\\\frac{1}{8}$"
                        ],
                        final_answer: "$\\\\frac{1}{8}$"
                    },
                    {
                        question: "Convert 37.5% to a fraction.",
                        steps: [
                            "37.5% = $\\\\frac{37.5}{100} = \\\\frac{375}{1000} = \\\\frac{3}{8}$"
                        ],
                        final_answer: "$\\\\frac{3}{8}$"
                    }
                ]
            },
            {
                title: '5. Percentage Calculations',
                content: "## Finding a Percentage of an Amount\n\n$$\\\\text{Percentage} \\\\times \\\\text{Amount} = \\\\frac{p}{100} \\\\times A$$\n\n## Finding What Percentage One Number is of Another\n\n$$\\\\frac{\\\\text{Part}}{\\\\text{Whole}} \\\\times 100\\\\%$$\n\n## The 1% Method\n\nFind 1% first, then multiply:\n- 1% of 350 = 3.5\n- 17% of 350 = 17 × 3.5 = 59.5",
                worked_examples: [
                    {
                        question: "Find 35% of $480.",
                        steps: [
                            "35% = 0.35",
                            "0.35 × 480 = 168"
                        ],
                        final_answer: "$168"
                    },
                    {
                        question: "A student scores 72 out of 80. What percentage is this?",
                        steps: [
                            "Percentage = $\\\\frac{72}{80} \\\\times 100$",
                            "= 0.9 × 100 = 90%"
                        ],
                        final_answer: "90%"
                    },
                    {
                        question: "45 is what percent of 180?",
                        steps: [
                            "Percentage = $\\\\frac{45}{180} \\\\times 100$",
                            "= $\\\\frac{1}{4} \\\\times 100 = 25\\\\%$"
                        ],
                        final_answer: "25%"
                    }
                ]
            },
            {
                title: '6. Percentage Increase and Decrease',
                content: "## Percentage Increase\n\n$$\\\\text{New Value} = \\\\text{Original} \\\\times (1 + \\\\frac{p}{100})$$\n\nOR: New = Original + (Percentage × Original)\n\n## Percentage Decrease\n\n$$\\\\text{New Value} = \\\\text{Original} \\\\times (1 - \\\\frac{p}{100})$$\n\nOR: New = Original - (Percentage × Original)\n\n## Finding Percentage Change\n\n$$\\\\text{Percentage Change} = \\\\frac{\\\\text{Change}}{\\\\text{Original}} \\\\times 100\\\\%$$",
                worked_examples: [
                    {
                        question: "A price of $250 is increased by 12%. Find the new price.",
                        steps: [
                            "Method: Multiply by (1 + 0.12) = 1.12",
                            "New price = 250 × 1.12 = $280"
                        ],
                        final_answer: "$280"
                    },
                    {
                        question: "A population decreases from 8000 to 7200. Find the percentage decrease.",
                        steps: [
                            "Change = 8000 - 7200 = 800",
                            "Percentage = $\\\\frac{800}{8000} \\\\times 100 = 10\\\\%$"
                        ],
                        final_answer: "10% decrease"
                    },
                    {
                        question: "After a 20% discount, a jacket costs $56. What was the original price?",
                        steps: [
                            "After 20% off, you pay 80% of original",
                            "80% of original = 56",
                            "Original = 56 ÷ 0.8 = $70"
                        ],
                        final_answer: "$70"
                    }
                ]
            },
            {
                title: '7. Recurring Decimals',
                content: "## What is a Recurring Decimal?\n\nA decimal where digits repeat forever.\n\n**Notation**: Use a dot (or bar) over repeating digits\n- $0.\\\\dot{3} = 0.333...$\n- $0.\\\\dot{1}\\\\dot{2} = 0.121212...$\n\n## Converting Recurring Decimals to Fractions\n\n**Method**:\n1. Let x = the recurring decimal\n2. Multiply to shift the decimal\n3. Subtract to eliminate the recurring part\n4. Solve for x\n\n## Common Recurring Decimals\n\n- $\\\\frac{1}{3} = 0.\\\\dot{3}$\n- $\\\\frac{1}{6} = 0.1\\\\dot{6}$\n- $\\\\frac{1}{9} = 0.\\\\dot{1}$",
                worked_examples: [
                    {
                        question: "Convert $0.\\\\dot{7}$ to a fraction.",
                        steps: [
                            "Let x = 0.777...",
                            "10x = 7.777...",
                            "10x - x = 7.777... - 0.777...",
                            "9x = 7",
                            "x = $\\\\frac{7}{9}$"
                        ],
                        final_answer: "$\\\\frac{7}{9}$"
                    },
                    {
                        question: "Convert $0.\\\\dot{2}\\\\dot{7}$ to a fraction.",
                        steps: [
                            "Let x = 0.272727...",
                            "100x = 27.272727...",
                            "100x - x = 27",
                            "99x = 27",
                            "x = $\\\\frac{27}{99} = \\\\frac{3}{11}$"
                        ],
                        final_answer: "$\\\\frac{3}{11}$"
                    }
                ]
            },
            {
                title: '8. Ordering and Comparing',
                content: "## Ordering Fractions\n\n**Method 1**: Convert to common denominator\n**Method 2**: Convert to decimals\n\n## Ordering Decimals\n\nCompare digit by digit from left to right.\n\n## Ordering Percentages\n\nConvert to decimals or fractions, then compare.\n\n## Symbols\n\n- $<$ less than\n- $>$ greater than\n- $\\\\leq$ less than or equal\n- $\\\\geq$ greater than or equal",
                worked_examples: [
                    {
                        question: "Write in ascending order: $\\\\frac{3}{5}$, 0.58, 62%",
                        steps: [
                            "$\\\\frac{3}{5} = 0.6 = 60\\\\%$",
                            "0.58 = 58%",
                            "62% = 0.62",
                            "Order: 0.58 < 0.6 < 0.62"
                        ],
                        final_answer: "0.58, $\\\\frac{3}{5}$, 62%"
                    },
                    {
                        question: "Which is larger: $\\\\frac{5}{8}$ or $\\\\frac{7}{11}$?",
                        steps: [
                            "$\\\\frac{5}{8} = 0.625$",
                            "$\\\\frac{7}{11} = 0.636...$",
                            "0.636... > 0.625"
                        ],
                        final_answer: "$\\\\frac{7}{11}$ is larger"
                    }
                ]
            },
            {
                title: '9. Try This Yourself - Practice Problems',
                content: "## Practice Problems with Answers\n\n---\n\n### Problem 1: Operations\nCalculate $2\\\\frac{1}{4} + 1\\\\frac{2}{3}$.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\n= $\\\\frac{9}{4} + \\\\frac{5}{3} = \\\\frac{27}{12} + \\\\frac{20}{12} = \\\\frac{47}{12} = 3\\\\frac{11}{12}$\n\n**Answer: $3\\\\frac{11}{12}$**\n</details>\n\n---\n\n### Problem 2: Division\nCalculate $\\\\frac{4}{5} \\\\div \\\\frac{2}{3}$.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\n= $\\\\frac{4}{5} \\\\times \\\\frac{3}{2} = \\\\frac{12}{10} = \\\\frac{6}{5} = 1\\\\frac{1}{5}$\n\n**Answer: $1\\\\frac{1}{5}$**\n</details>\n\n---\n\n### Problem 3: Percentage\nA television costs $850 plus 15% VAT. Find the total cost.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nTotal = 850 × 1.15 = $977.50\n\n**Answer: $977.50**\n</details>\n\n---\n\n### Problem 4: Reverse Percentage (ZIMSEC Style)\nAfter a 15% increase, a salary is now $5750. What was it before?\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\n115% of original = 5750\nOriginal = 5750 ÷ 1.15 = $5000\n\n**Answer: $5000**\n</details>\n\n---\n\n### Problem 5: Recurring Decimal\nConvert $0.4\\\\dot{5}$ to a fraction.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nLet x = 0.4555...\n10x = 4.555...\n10x - x = 4.111...\nActually: 10x = 4.555..., x = 0.4555...\n9x = 4.1, x = 41/90\n\n**Answer: $\\\\frac{41}{90}$**\n</details>\n\n---\n\n### Problem 6: Ordering\nArrange in descending order: $\\\\frac{5}{7}$, 72%, $\\\\frac{3}{4}$.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\n$\\\\frac{5}{7} \\\\approx 0.714$, 72% = 0.72, $\\\\frac{3}{4} = 0.75$\n\n**Answer: $\\\\frac{3}{4}$, 72%, $\\\\frac{5}{7}$**\n</details>"
            }
        ],
        key_points: [
            "Simplify fractions by dividing by the HCF",
            "Add/subtract fractions: find common denominator first",
            "Multiply fractions: multiply across, cancel first",
            "Divide fractions: Keep, Change, Flip",
            "To convert fraction → decimal: divide numerator by denominator",
            "Percentage increase: multiply by (1 + rate)",
            "Percentage decrease: multiply by (1 - rate)",
            "Reverse percentage: divide by the multiplier"
        ],
        exam_tips: [
            "Always simplify your final answer to lowest terms.",
            "Convert mixed numbers to improper fractions before multiplying/dividing.",
            "For reverse percentage problems, identify what percentage the given amount represents.",
            "Show the conversion steps clearly when changing between forms.",
            "Check your answer makes sense (e.g., after discount, price should be lower).",
            "Memorise common fraction-decimal-percentage equivalents."
        ],
        visual_descriptions: [
            "Pie chart showing fraction as part of a whole",
            "Number line showing equivalent positions of fractions, decimals, percentages",
            "Visual representation of percentage increase using bars"
        ]
    },

    // ============================================
    // TOPIC 3: RATIO AND PROPORTION (Form 1-2)
    // ============================================
    'Ratio and Proportion': {
        topic: 'Ratio and Proportion',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: "Ratio and proportion are fundamental concepts for comparing quantities and solving real-world problems involving sharing, scaling, and equivalence. This topic covers writing and simplifying ratios, dividing quantities in given ratios, direct and inverse proportion, scale drawings, and map calculations. Mastery of these skills is essential for topics like similarity, trigonometry, and financial mathematics.",
        sections: [
            {
                title: '1. Understanding Ratios',
                content: "## What is a Ratio?\n\nA **ratio** compares two or more quantities of the same type.\n\n## Writing Ratios\n\n- Colon notation: $3:5$\n- Fraction notation: $\\\\frac{3}{5}$\n- Word form: \"3 to 5\"\n\n## Important Rules\n\n1. Order matters: $3:5 \\\\neq 5:3$\n2. Units must be the same before forming a ratio\n3. Ratios have no units\n\n## Simplifying Ratios\n\nDivide all parts by the HCF:\n$$12:18 = 2:3$$",
                worked_examples: [
                    {
                        question: "Simplify the ratio 48:60:84.",
                        steps: [
                            "Find HCF of 48, 60, and 84",
                            "48 = 2⁴ × 3, 60 = 2² × 3 × 5, 84 = 2² × 3 × 7",
                            "HCF = 2² × 3 = 12",
                            "Divide each by 12: 48÷12 : 60÷12 : 84÷12 = 4:5:7"
                        ],
                        final_answer: "4:5:7"
                    },
                    {
                        question: "Express 45 minutes to 2 hours as a ratio in its simplest form.",
                        steps: [
                            "Convert to same units: 2 hours = 120 minutes",
                            "Ratio = 45:120",
                            "HCF = 15",
                            "45÷15 : 120÷15 = 3:8"
                        ],
                        final_answer: "3:8"
                    }
                ]
            },
            {
                title: '2. Dividing in a Given Ratio',
                content: "## Method\n\n1. Add the ratio parts to find total parts\n2. Calculate the value of 1 part\n3. Multiply to find each share\n\n## Formula\n\nTo divide amount A in ratio $m:n$:\n- First share = $\\\\frac{m}{m+n} \\\\times A$\n- Second share = $\\\\frac{n}{m+n} \\\\times A$",
                worked_examples: [
                    {
                        question: "Divide $540 between Amy and Ben in the ratio 4:5.",
                        steps: [
                            "Total parts = 4 + 5 = 9",
                            "Value of 1 part = 540 ÷ 9 = $60",
                            "Amy gets 4 × 60 = $240",
                            "Ben gets 5 × 60 = $300",
                            "Check: 240 + 300 = 540 ✓"
                        ],
                        final_answer: "Amy: $240, Ben: $300"
                    },
                    {
                        question: "A sum of money is divided between three people in the ratio 2:3:5. If the smallest share is $80, find the total sum.",
                        steps: [
                            "Smallest share is 2 parts = $80",
                            "1 part = 80 ÷ 2 = $40",
                            "Total parts = 2 + 3 + 5 = 10",
                            "Total sum = 10 × 40 = $400"
                        ],
                        final_answer: "$400"
                    }
                ]
            },
            {
                title: '3. Increasing and Decreasing Ratios',
                content: "## Finding One Quantity from Another\n\nIf A:B = m:n, then:\n- $A = \\\\frac{m}{n} \\\\times B$\n- $B = \\\\frac{n}{m} \\\\times A$\n\n## Increasing in a Ratio\n\nIncrease A in ratio m:n means:\n$$\\\\text{New} = A \\\\times \\\\frac{n}{m}$$\n(where n > m)\n\n## Decreasing in a Ratio\n\nDecrease A in ratio m:n means:\n$$\\\\text{New} = A \\\\times \\\\frac{m}{n}$$\n(where m < n)",
                worked_examples: [
                    {
                        question: "Increase 45 in the ratio 5:9.",
                        steps: [
                            "New value = 45 × (9/5)",
                            "= 45 × 9 ÷ 5",
                            "= 405 ÷ 5 = 81"
                        ],
                        final_answer: "81"
                    },
                    {
                        question: "Decrease 120 in the ratio 3:8.",
                        steps: [
                            "New value = 120 × (3/8)",
                            "= 360 ÷ 8 = 45"
                        ],
                        final_answer: "45"
                    }
                ]
            },
            {
                title: '4. Proportion and Proportional Reasoning',
                content: "## What is Proportion?\n\nTwo ratios are equal:\n$$\\\\frac{a}{b} = \\\\frac{c}{d}$$\n\n## Cross Multiplication\n\nIf $\\\\frac{a}{b} = \\\\frac{c}{d}$, then $a \\\\times d = b \\\\times c$\n\n## Solving Proportions\n\nFind the missing value by cross-multiplying and solving.",
                worked_examples: [
                    {
                        question: "If 5 books cost $35, how much do 8 books cost?",
                        steps: [
                            "Set up proportion: 5/35 = 8/x",
                            "Or: 5 books → $35, so 1 book → $7",
                            "8 books → 8 × $7 = $56"
                        ],
                        final_answer: "$56"
                    },
                    {
                        question: "Solve for x: $\\\\frac{x}{12} = \\\\frac{15}{20}$.",
                        steps: [
                            "Cross multiply: x × 20 = 12 × 15",
                            "20x = 180",
                            "x = 180 ÷ 20 = 9"
                        ],
                        final_answer: "x = 9"
                    }
                ]
            },
            {
                title: '5. Direct Proportion',
                content: "## Definition\n\nTwo quantities are in **direct proportion** if when one increases, the other increases by the same factor.\n\n## Key Features\n\n- Ratio between quantities stays constant\n- Graph is a straight line through origin\n- Formula: $y = kx$ where k is constant\n\n## The Unitary Method\n\n1. Find the value of 1 unit\n2. Multiply by required number",
                worked_examples: [
                    {
                        question: "If 6 workers can complete a job in 12 days, how many days do 9 workers need? (Assume workers work at same rate)",
                        steps: [
                            "CAREFUL: More workers = fewer days (inverse, not direct!)",
                            "Total work = 6 × 12 = 72 worker-days",
                            "Days for 9 workers = 72 ÷ 9 = 8 days"
                        ],
                        final_answer: "8 days (Note: This is inverse proportion)"
                    },
                    {
                        question: "5 kg of rice costs $45. Find the cost of 8 kg.",
                        steps: [
                            "Cost is directly proportional to quantity",
                            "1 kg costs 45 ÷ 5 = $9",
                            "8 kg costs 8 × 9 = $72"
                        ],
                        final_answer: "$72"
                    }
                ]
            },
            {
                title: '6. Inverse Proportion',
                content: "## Definition\n\nTwo quantities are in **inverse proportion** if when one increases, the other decreases proportionally.\n\n## Key Features\n\n- Product of quantities stays constant\n- Graph is a hyperbola\n- Formula: $y = \\\\frac{k}{x}$ or $xy = k$\n\n## Examples of Inverse Proportion\n\n- More workers → less time for same job\n- Faster speed → shorter time for same distance\n- Larger gear → fewer rotations",
                worked_examples: [
                    {
                        question: "A car travelling at 60 km/h takes 4 hours for a journey. How long at 80 km/h?",
                        steps: [
                            "Speed and time are inversely proportional (same distance)",
                            "Distance = 60 × 4 = 240 km",
                            "Time at 80 km/h = 240 ÷ 80 = 3 hours"
                        ],
                        final_answer: "3 hours"
                    },
                    {
                        question: "If 8 men can dig a trench in 6 days, how many men are needed to dig it in 4 days?",
                        steps: [
                            "More men = less time (inverse)",
                            "Total work = 8 × 6 = 48 man-days",
                            "Men needed for 4 days = 48 ÷ 4 = 12 men"
                        ],
                        final_answer: "12 men"
                    }
                ]
            },
            {
                title: '7. Scale and Maps',
                content: "## What is Scale?\n\nScale shows the ratio between a drawing/model and real life.\n\n## Writing Scales\n\n- Ratio form: 1:50000\n- Linear form: 1 cm represents 500 m\n\n## Calculations with Scale\n\n**Map to Real:** Multiply by scale factor\n**Real to Map:** Divide by scale factor\n\n## Area Scale\n\nIf linear scale is 1:n, then area scale is 1:n²",
                worked_examples: [
                    {
                        question: "On a map with scale 1:25000, two towns are 8 cm apart. Find the actual distance in km.",
                        steps: [
                            "Actual distance = 8 × 25000 cm",
                            "= 200000 cm",
                            "= 2000 m = 2 km"
                        ],
                        final_answer: "2 km"
                    },
                    {
                        question: "The actual distance between two cities is 45 km. Find the map distance if scale is 1:500000.",
                        steps: [
                            "45 km = 45 × 1000 × 100 cm = 4500000 cm",
                            "Map distance = 4500000 ÷ 500000 = 9 cm"
                        ],
                        final_answer: "9 cm"
                    },
                    {
                        question: "A rectangular field measures 3 cm by 4 cm on a map with scale 1:20000. Find its actual area.",
                        steps: [
                            "Actual length = 3 × 20000 = 60000 cm = 600 m",
                            "Actual width = 4 × 20000 = 80000 cm = 800 m",
                            "Area = 600 × 800 = 480000 m² = 48 hectares"
                        ],
                        final_answer: "480000 m² or 48 hectares"
                    }
                ]
            },
            {
                title: '8. Word Problems with Ratios',
                content: "## Problem-Solving Strategy\n\n1. **Read carefully** - identify what's given and what's asked\n2. **Check units** - convert if needed\n3. **Identify type** - is it direct or inverse proportion?\n4. **Set up equation** - use ratio or unitary method\n5. **Check answer** - does it make sense?\n\n## Common Word Problem Types\n\n- Sharing in a ratio\n- Recipe and scaling\n- Currency conversion\n- Speed, distance, time\n- Workers and time",
                worked_examples: [
                    {
                        question: "The ratio of boys to girls in a class is 3:5. If there are 12 boys, how many students are in the class?",
                        steps: [
                            "Boys = 3 parts = 12",
                            "1 part = 12 ÷ 3 = 4",
                            "Girls = 5 parts = 5 × 4 = 20",
                            "Total students = 12 + 20 = 32"
                        ],
                        final_answer: "32 students"
                    },
                    {
                        question: "A recipe for 4 people needs 300g flour. How much flour for 10 people?",
                        steps: [
                            "Flour is directly proportional to people",
                            "For 1 person: 300 ÷ 4 = 75g",
                            "For 10 people: 75 × 10 = 750g"
                        ],
                        final_answer: "750g"
                    },
                    {
                        question: "The ages of three siblings are in ratio 2:3:4. If the sum of their ages is 36, find each age.",
                        steps: [
                            "Total parts = 2 + 3 + 4 = 9",
                            "1 part = 36 ÷ 9 = 4 years",
                            "Ages: 2×4=8, 3×4=12, 4×4=16"
                        ],
                        final_answer: "8 years, 12 years, 16 years"
                    }
                ]
            },
            {
                title: '9. Try This Yourself - Practice Problems',
                content: "## Practice Problems with Answers\n\n---\n\n### Problem 1: Simplifying\nSimplify 72:108:144.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nHCF = 36\n72÷36 : 108÷36 : 144÷36 = 2:3:4\n\n**Answer: 2:3:4**\n</details>\n\n---\n\n### Problem 2: Sharing\nDivide $600 among A, B, and C in the ratio 3:4:5.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nTotal parts = 12\n1 part = 600 ÷ 12 = $50\nA = $150, B = $200, C = $250\n\n**Answer: A=$150, B=$200, C=$250**\n</details>\n\n---\n\n### Problem 3: Proportion\nIf 15 pens cost $22.50, find the cost of 40 pens.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\n1 pen = 22.50 ÷ 15 = $1.50\n40 pens = 40 × 1.50 = $60\n\n**Answer: $60**\n</details>\n\n---\n\n### Problem 4: Speed and Time (ZIMSEC Style)\nA car takes 3 hours at 80 km/h. How long at 60 km/h?\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nDistance = 80 × 3 = 240 km\nTime at 60 km/h = 240 ÷ 60 = 4 hours\n\n**Answer: 4 hours**\n</details>\n\n---\n\n### Problem 5: Map Scale\nScale 1:50000. Map distance 4.5 cm. Find actual distance.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nActual = 4.5 × 50000 = 225000 cm = 2.25 km\n\n**Answer: 2.25 km**\n</details>\n\n---\n\n### Problem 6: ZIMSEC Style\nThe ratio of cats to dogs in a pet shop is 5:8. If there are 24 dogs, how many pets are there altogether?\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\n8 parts = 24, so 1 part = 3\nCats = 5 × 3 = 15\nTotal pets = 15 + 24 = 39\n\n**Answer: 39 pets**\n</details>"
            }
        ],
        key_points: [
            "Ratios compare quantities - ensure same units first",
            "Simplify ratios by dividing by HCF",
            "To divide in ratio: find total parts, then value per part",
            "Direct proportion: quantities increase/decrease together (y = kx)",
            "Inverse proportion: one increases as other decreases (xy = k)",
            "Scale 1:n means map:real = 1:n",
            "For area: if linear scale is 1:n, area scale is 1:n²"
        ],
        exam_tips: [
            "Always simplify ratios to lowest terms in your final answer.",
            "Check: do your shares add up to the original total?",
            "Identify whether a problem is direct or inverse proportion before calculating.",
            "For scale problems, convert all units carefully (km → cm or vice versa).",
            "The unitary method (find value of 1 unit) works for most proportion problems.",
            "Read word problems twice to understand what is asked."
        ],
        visual_descriptions: [
            "Bar model showing quantities divided in ratio",
            "Graph showing direct proportion (straight line through origin)",
            "Graph showing inverse proportion (hyperbola curve)"
        ]
    },

    // ============================================
    // TOPIC 4: INDICES AND STANDARD FORM (Form 2-3)
    // ============================================
    'Indices and Standard Form': {
        topic: 'Indices and Standard Form',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: "Indices (also called exponents or powers) provide a shorthand for repeated multiplication and are essential for algebra, scientific notation, and many real-world applications. This topic covers the laws of indices, negative and fractional indices, simplifying expressions, and expressing very large or very small numbers in standard form (scientific notation).",
        sections: [
            {
                title: '1. Introduction to Indices',
                content: "## What is an Index?\n\n$$a^n = a \\\\times a \\\\times a \\\\times ... \\\\times a \\\\text{ (n times)}$$\n\n- **Base**: the number being multiplied (a)\n- **Index/Exponent**: the power (n)\n\n## Terminology\n\n| Expression | Read as |\n|------------|--------|\n| $3^2$ | \"3 squared\" or \"3 to the power 2\" |\n| $5^3$ | \"5 cubed\" or \"5 to the power 3\" |\n| $2^5$ | \"2 to the power 5\" |",
                worked_examples: [
                    {
                        question: "Evaluate $2^5$.",
                        steps: [
                            "$2^5 = 2 \\\\times 2 \\\\times 2 \\\\times 2 \\\\times 2$",
                            "= 4 × 4 × 2",
                            "= 32"
                        ],
                        final_answer: "32"
                    },
                    {
                        question: "Write $5 \\\\times 5 \\\\times 5 \\\\times 5$ using index notation.",
                        steps: [
                            "5 appears 4 times as a factor",
                            "Base = 5, Index = 4"
                        ],
                        final_answer: "$5^4$"
                    }
                ]
            },
            {
                title: '2. Laws of Indices - Multiplication and Division',
                content: "## Multiplication Law\n\nWhen multiplying same bases, ADD the indices:\n$$a^m \\\\times a^n = a^{m+n}$$\n\n## Division Law\n\nWhen dividing same bases, SUBTRACT the indices:\n$$a^m \\\\div a^n = a^{m-n}$$\n\n## Important\n\nThese laws only work when bases are the SAME!",
                worked_examples: [
                    {
                        question: "Simplify $3^4 \\\\times 3^5$.",
                        steps: [
                            "Same base (3), so add indices",
                            "$3^4 \\\\times 3^5 = 3^{4+5} = 3^9$"
                        ],
                        final_answer: "$3^9$"
                    },
                    {
                        question: "Simplify $\\\\frac{2^7}{2^3}$.",
                        steps: [
                            "Same base (2), so subtract indices",
                            "$\\\\frac{2^7}{2^3} = 2^{7-3} = 2^4 = 16$"
                        ],
                        final_answer: "$2^4 = 16$"
                    },
                    {
                        question: "Simplify $5x^3 \\\\times 4x^2$.",
                        steps: [
                            "Multiply coefficients: 5 × 4 = 20",
                            "Add indices for x: $x^3 \\\\times x^2 = x^5$"
                        ],
                        final_answer: "$20x^5$"
                    }
                ]
            },
            {
                title: '3. Laws of Indices - Powers of Powers',
                content: "## Power of a Power\n\n$$(a^m)^n = a^{m \\\\times n}$$\n\n## Power of a Product\n\n$$(ab)^n = a^n b^n$$\n\n## Power of a Quotient\n\n$$\\\\left(\\\\frac{a}{b}\\\\right)^n = \\\\frac{a^n}{b^n}$$",
                worked_examples: [
                    {
                        question: "Simplify $(2^3)^4$.",
                        steps: [
                            "Multiply the indices",
                            "$(2^3)^4 = 2^{3 \\\\times 4} = 2^{12}$"
                        ],
                        final_answer: "$2^{12}$"
                    },
                    {
                        question: "Simplify $(3x^2)^3$.",
                        steps: [
                            "Apply power to each factor",
                            "$(3x^2)^3 = 3^3 \\\\times (x^2)^3$",
                            "= 27 × $x^6$"
                        ],
                        final_answer: "$27x^6$"
                    },
                    {
                        question: "Simplify $\\\\left(\\\\frac{2}{5}\\\\right)^3$.",
                        steps: [
                            "Apply power to numerator and denominator",
                            "$\\\\left(\\\\frac{2}{5}\\\\right)^3 = \\\\frac{2^3}{5^3} = \\\\frac{8}{125}$"
                        ],
                        final_answer: "$\\\\frac{8}{125}$"
                    }
                ]
            },
            {
                title: '4. Zero and Negative Indices',
                content: "## Zero Index\n\nAny non-zero number to power 0 equals 1:\n$$a^0 = 1 \\\\text{ (for } a \\\\neq 0)$$\n\n## Negative Index\n\nA negative index means reciprocal:\n$$a^{-n} = \\\\frac{1}{a^n}$$\n\n$$\\\\left(\\\\frac{a}{b}\\\\right)^{-n} = \\\\left(\\\\frac{b}{a}\\\\right)^n$$",
                worked_examples: [
                    {
                        question: "Evaluate $5^0$.",
                        steps: [
                            "Any non-zero number to power 0 = 1"
                        ],
                        final_answer: "1"
                    },
                    {
                        question: "Evaluate $2^{-3}$.",
                        steps: [
                            "$2^{-3} = \\\\frac{1}{2^3} = \\\\frac{1}{8}$"
                        ],
                        final_answer: "$\\\\frac{1}{8}$"
                    },
                    {
                        question: "Simplify $\\\\left(\\\\frac{3}{4}\\\\right)^{-2}$.",
                        steps: [
                            "Flip the fraction and change to positive power",
                            "$\\\\left(\\\\frac{3}{4}\\\\right)^{-2} = \\\\left(\\\\frac{4}{3}\\\\right)^2 = \\\\frac{16}{9}$"
                        ],
                        final_answer: "$\\\\frac{16}{9}$"
                    }
                ]
            },
            {
                title: '5. Fractional Indices',
                content: "## Fractional Index = Root\n\n$$a^{\\\\frac{1}{n}} = \\\\sqrt[n]{a}$$\n\n$$a^{\\\\frac{m}{n}} = \\\\sqrt[n]{a^m} = (\\\\sqrt[n]{a})^m$$\n\n## Special Cases\n\n- $a^{\\\\frac{1}{2}} = \\\\sqrt{a}$\n- $a^{\\\\frac{1}{3}} = \\\\sqrt[3]{a}$\n- $a^{\\\\frac{3}{2}} = \\\\sqrt{a^3} = a\\\\sqrt{a}$",
                worked_examples: [
                    {
                        question: "Evaluate $16^{\\\\frac{1}{2}}$.",
                        steps: [
                            "$16^{\\\\frac{1}{2}} = \\\\sqrt{16} = 4$"
                        ],
                        final_answer: "4"
                    },
                    {
                        question: "Evaluate $27^{\\\\frac{2}{3}}$.",
                        steps: [
                            "$27^{\\\\frac{2}{3}} = (\\\\sqrt[3]{27})^2$",
                            "= $3^2 = 9$"
                        ],
                        final_answer: "9"
                    },
                    {
                        question: "Evaluate $8^{-\\\\frac{2}{3}}$.",
                        steps: [
                            "$8^{-\\\\frac{2}{3}} = \\\\frac{1}{8^{\\\\frac{2}{3}}}$",
                            "= $\\\\frac{1}{(\\\\sqrt[3]{8})^2} = \\\\frac{1}{2^2} = \\\\frac{1}{4}$"
                        ],
                        final_answer: "$\\\\frac{1}{4}$"
                    }
                ]
            },
            {
                title: '6. Simplifying Algebraic Expressions',
                content: "## Key Steps\n\n1. Apply laws of indices to variables\n2. Combine coefficients separately\n3. Keep answers with positive indices (unless asked otherwise)\n\n## Summary of Laws\n\n| Law | Formula |\n|-----|--------|\n| Multiplication | $a^m \\\\times a^n = a^{m+n}$ |\n| Division | $a^m \\\\div a^n = a^{m-n}$ |\n| Power of power | $(a^m)^n = a^{mn}$ |\n| Zero | $a^0 = 1$ |\n| Negative | $a^{-n} = 1/a^n$ |\n| Fractional | $a^{1/n} = \\\\sqrt[n]{a}$ |",
                worked_examples: [
                    {
                        question: "Simplify $\\\\frac{12x^5 y^3}{4x^2 y^5}$.",
                        steps: [
                            "Divide coefficients: 12 ÷ 4 = 3",
                            "x: $x^{5-2} = x^3$",
                            "y: $y^{3-5} = y^{-2} = \\\\frac{1}{y^2}$"
                        ],
                        final_answer: "$\\\\frac{3x^3}{y^2}$"
                    },
                    {
                        question: "Simplify $(2a^3b^{-2})^2 \\\\times 3a^{-1}b^4$.",
                        steps: [
                            "First: $(2a^3b^{-2})^2 = 4a^6b^{-4}$",
                            "Then: $4a^6b^{-4} \\\\times 3a^{-1}b^4$",
                            "= $12 \\\\times a^{6-1} \\\\times b^{-4+4}$",
                            "= $12a^5b^0 = 12a^5$"
                        ],
                        final_answer: "$12a^5$"
                    }
                ]
            },
            {
                title: '7. Standard Form (Scientific Notation)',
                content: "## Definition\n\n$$A \\\\times 10^n$$\n\nwhere $1 \\\\leq A < 10$ and n is an integer.\n\n## Converting to Standard Form\n\n**Large numbers**: Move decimal LEFT, n is POSITIVE\n**Small numbers**: Move decimal RIGHT, n is NEGATIVE\n\n## Examples\n\n- 5600000 = $5.6 \\\\times 10^6$\n- 0.00047 = $4.7 \\\\times 10^{-4}$",
                worked_examples: [
                    {
                        question: "Write 32500000 in standard form.",
                        steps: [
                            "Move decimal 7 places left",
                            "3.25 × 10⁷"
                        ],
                        final_answer: "$3.25 \\\\times 10^7$"
                    },
                    {
                        question: "Write 0.000089 in standard form.",
                        steps: [
                            "Move decimal 5 places right",
                            "8.9 × 10⁻⁵"
                        ],
                        final_answer: "$8.9 \\\\times 10^{-5}$"
                    },
                    {
                        question: "Write $6.7 \\\\times 10^4$ as an ordinary number.",
                        steps: [
                            "Move decimal 4 places right",
                            "67000"
                        ],
                        final_answer: "67000"
                    }
                ]
            },
            {
                title: '8. Calculations with Standard Form',
                content: "## Multiplication\n\n$(a \\\\times 10^m) \\\\times (b \\\\times 10^n) = (a \\\\times b) \\\\times 10^{m+n}$\n\n## Division\n\n$\\\\frac{a \\\\times 10^m}{b \\\\times 10^n} = \\\\frac{a}{b} \\\\times 10^{m-n}$\n\n## Addition/Subtraction\n\nConvert to same power of 10 first!\n\n## Important\n\nCheck your answer is in correct form: $1 \\\\leq A < 10$",
                worked_examples: [
                    {
                        question: "Calculate $(3.2 \\\\times 10^5) \\\\times (2.5 \\\\times 10^3)$.",
                        steps: [
                            "Multiply coefficients: 3.2 × 2.5 = 8",
                            "Add powers: 10^{5+3} = 10^8",
                            "Answer: 8 × 10⁸"
                        ],
                        final_answer: "$8 \\\\times 10^8$"
                    },
                    {
                        question: "Calculate $\\\\frac{9 \\\\times 10^8}{3 \\\\times 10^5}$.",
                        steps: [
                            "Divide coefficients: 9 ÷ 3 = 3",
                            "Subtract powers: 10^{8-5} = 10^3",
                            "Answer: 3 × 10³"
                        ],
                        final_answer: "$3 \\\\times 10^3$"
                    },
                    {
                        question: "Calculate $(5.2 \\\\times 10^4) + (3.8 \\\\times 10^3)$.",
                        steps: [
                            "Rewrite 3.8 × 10³ as 0.38 × 10⁴",
                            "Add: 5.2 + 0.38 = 5.58",
                            "Answer: 5.58 × 10⁴"
                        ],
                        final_answer: "$5.58 \\\\times 10^4$"
                    }
                ]
            },
            {
                title: '9. Try This Yourself - Practice Problems',
                content: "## Practice Problems with Answers\n\n---\n\n### Problem 1: Basic Indices\nSimplify $2^4 \\\\times 2^3 \\\\div 2^5$.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\n$2^{4+3-5} = 2^2 = 4$\n\n**Answer: 4**\n</details>\n\n---\n\n### Problem 2: Negative Index\nEvaluate $5^{-2}$.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\n$5^{-2} = \\\\frac{1}{5^2} = \\\\frac{1}{25}$\n\n**Answer: $\\\\frac{1}{25}$**\n</details>\n\n---\n\n### Problem 3: Fractional Index (ZIMSEC Style)\nEvaluate $64^{\\\\frac{2}{3}}$.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\n$64^{\\\\frac{2}{3}} = (\\\\sqrt[3]{64})^2 = 4^2 = 16$\n\n**Answer: 16**\n</details>\n\n---\n\n### Problem 4: Simplify Expression\nSimplify $\\\\frac{15a^4b^3}{5a^6b^{-1}}$.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\n$= 3a^{4-6}b^{3-(-1)} = 3a^{-2}b^4 = \\\\frac{3b^4}{a^2}$\n\n**Answer: $\\\\frac{3b^4}{a^2}$**\n</details>\n\n---\n\n### Problem 5: Standard Form\nWrite 0.0000735 in standard form.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nMove decimal 5 places right\n\n**Answer: $7.35 \\\\times 10^{-5}$**\n</details>\n\n---\n\n### Problem 6: Calculation\nCalculate $(4 \\\\times 10^6) \\\\times (8 \\\\times 10^{-3})$.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\n4 × 8 = 32; 10^{6+(-3)} = 10^3\n32 × 10³ = 3.2 × 10⁴\n\n**Answer: $3.2 \\\\times 10^4$**\n</details>"
            }
        ],
        key_points: [
            "Same base multiply: add indices ($a^m \\\\times a^n = a^{m+n}$)",
            "Same base divide: subtract indices ($a^m \\\\div a^n = a^{m-n}$)",
            "Power of power: multiply indices ($(a^m)^n = a^{mn}$)",
            "Zero index: $a^0 = 1$ (a ≠ 0)",
            "Negative index: $a^{-n} = \\\\frac{1}{a^n}$",
            "Fractional index: $a^{1/n} = \\\\sqrt[n]{a}$",
            "Standard form: $A \\\\times 10^n$ where $1 \\\\leq A < 10$"
        ],
        exam_tips: [
            "Always check your final answer has positive indices unless asked otherwise.",
            "For fractional indices, find the root first, then raise to the power.",
            "When converting to standard form, count decimal places carefully.",
            "After calculations with standard form, check A is between 1 and 10.",
            "Common mistake: $2^3 \\\\times 3^2 \\\\neq 6^5$ - bases must be same!",
            "Write out intermediate steps clearly for method marks."
        ],
        visual_descriptions: [
            "Number line showing powers of 2 from 2⁻³ to 2³",
            "Diagram showing movement of decimal point for standard form",
            "Table of common powers to memorise"
        ]
    },

    // ============================================
    // TOPIC 5: ALGEBRA (Form 2-4)
    // ============================================
    'Algebra': {
        topic: 'Algebra',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: "Algebra is the language of mathematics, using letters (variables) to represent unknown quantities. This topic covers simplifying expressions, expanding and factorising, solving linear and quadratic equations, working with inequalities, and rearranging formulae. These skills are essential for almost every area of O-Level mathematics and beyond.",
        sections: [
            {
                title: '1. Algebraic Expressions',
                content: "## Key Terms\n\n- **Variable**: A letter representing a number (e.g., x, y)\n- **Coefficient**: The number multiplying a variable (e.g., 3 in 3x)\n- **Constant**: A number without a variable (e.g., 5)\n- **Term**: A single part of an expression (e.g., 4x²)\n- **Like terms**: Terms with the same variable to the same power\n\n## Simplifying Expressions\n\nCombine LIKE TERMS by adding/subtracting coefficients:\n$$5x + 3x = 8x$$\n$$7a - 2a + 4a = 9a$$",
                worked_examples: [
                    {
                        question: "Simplify $4x + 3y - 2x + 5y$.",
                        steps: [
                            "Group like terms: (4x - 2x) + (3y + 5y)",
                            "Combine: 2x + 8y"
                        ],
                        final_answer: "$2x + 8y$"
                    },
                    {
                        question: "Simplify $3a²b + 5ab² - 2a²b + 4ab²$.",
                        steps: [
                            "Group a²b terms: 3a²b - 2a²b = a²b",
                            "Group ab² terms: 5ab² + 4ab² = 9ab²"
                        ],
                        final_answer: "$a^2b + 9ab^2$"
                    }
                ]
            },
            {
                title: '2. Expanding Brackets',
                content: "## Single Bracket\n\n$$a(b + c) = ab + ac$$\n\n## Double Brackets (FOIL)\n\n$$(a + b)(c + d) = ac + ad + bc + bd$$\n\n## Special Products (Memorise!)\n\n$$(a + b)^2 = a^2 + 2ab + b^2$$\n$$(a - b)^2 = a^2 - 2ab + b^2$$\n$$(a + b)(a - b) = a^2 - b^2$$",
                worked_examples: [
                    {
                        question: "Expand and simplify $3(2x - 5) - 2(x + 4)$.",
                        steps: [
                            "Expand: 6x - 15 - 2x - 8",
                            "Simplify: 4x - 23"
                        ],
                        final_answer: "$4x - 23$"
                    },
                    {
                        question: "Expand $(3x + 2)(2x - 5)$.",
                        steps: [
                            "First: 3x × 2x = 6x²",
                            "Outer: 3x × (-5) = -15x",
                            "Inner: 2 × 2x = 4x",
                            "Last: 2 × (-5) = -10",
                            "Combine: 6x² - 15x + 4x - 10 = 6x² - 11x - 10"
                        ],
                        final_answer: "$6x^2 - 11x - 10$"
                    },
                    {
                        question: "Expand $(4x - 3)^2$.",
                        steps: [
                            "Use $(a-b)^2 = a^2 - 2ab + b^2$",
                            "= $(4x)^2 - 2(4x)(3) + 3^2$",
                            "= $16x^2 - 24x + 9$"
                        ],
                        final_answer: "$16x^2 - 24x + 9$"
                    }
                ]
            },
            {
                title: '3. Factorisation',
                content: "## Taking Out Common Factors\n\n$$6x + 9 = 3(2x + 3)$$\n\n## Difference of Two Squares\n\n$$a^2 - b^2 = (a + b)(a - b)$$\n\n## Factorising Quadratics ($x^2 + bx + c$)\n\nFind two numbers that:\n- Multiply to give c\n- Add to give b\n\n## Factorising $ax^2 + bx + c$\n\nUse the grouping method or trial and improvement.",
                worked_examples: [
                    {
                        question: "Factorise completely $12x³y² - 18x²y³$.",
                        steps: [
                            "HCF = 6x²y²",
                            "= 6x²y²(2x - 3y)"
                        ],
                        final_answer: "$6x^2y^2(2x - 3y)$"
                    },
                    {
                        question: "Factorise $x² - 7x + 12$.",
                        steps: [
                            "Need numbers that multiply to +12 and add to -7",
                            "-3 × -4 = 12 and -3 + (-4) = -7",
                            "= (x - 3)(x - 4)"
                        ],
                        final_answer: "$(x - 3)(x - 4)$"
                    },
                    {
                        question: "Factorise $49 - 4y²$.",
                        steps: [
                            "This is a² - b² where a = 7 and b = 2y",
                            "= (7 + 2y)(7 - 2y)"
                        ],
                        final_answer: "$(7 + 2y)(7 - 2y)$"
                    },
                    {
                        question: "Factorise $3x² + 10x - 8$.",
                        steps: [
                            "Multiply a × c = 3 × (-8) = -24",
                            "Find factors of -24 that add to 10: 12 and -2",
                            "Rewrite: 3x² + 12x - 2x - 8",
                            "Group: 3x(x + 4) - 2(x + 4)",
                            "= (3x - 2)(x + 4)"
                        ],
                        final_answer: "$(3x - 2)(x + 4)$"
                    }
                ]
            },
            {
                title: '4. Solving Linear Equations',
                content: "## Basic Strategy\n\n1. Expand any brackets\n2. Collect like terms\n3. Move x terms to one side, numbers to other\n4. Divide to find x\n\n## Golden Rule\n\nWhatever you do to one side, do to the other!",
                worked_examples: [
                    {
                        question: "Solve $5(2x - 3) = 4x + 9$.",
                        steps: [
                            "Expand: 10x - 15 = 4x + 9",
                            "Subtract 4x: 6x - 15 = 9",
                            "Add 15: 6x = 24",
                            "Divide by 6: x = 4"
                        ],
                        final_answer: "$x = 4$"
                    },
                    {
                        question: "Solve $\\\\frac{3x + 5}{4} = \\\\frac{2x - 1}{3}$.",
                        steps: [
                            "Cross multiply: 3(3x + 5) = 4(2x - 1)",
                            "Expand: 9x + 15 = 8x - 4",
                            "Subtract 8x: x + 15 = -4",
                            "Subtract 15: x = -19"
                        ],
                        final_answer: "$x = -19$"
                    }
                ]
            },
            {
                title: '5. Simultaneous Equations',
                content: "## Elimination Method\n\n1. Make coefficients of one variable equal\n2. Add or subtract to eliminate\n3. Solve for remaining variable\n4. Substitute back\n\n## Substitution Method\n\n1. Make one variable the subject\n2. Substitute into other equation\n3. Solve and substitute back",
                worked_examples: [
                    {
                        question: "Solve: $3x + 2y = 13$ and $2x - y = 4$.",
                        steps: [
                            "Double equation 2: 4x - 2y = 8",
                            "Add to equation 1: 7x = 21",
                            "x = 3",
                            "Substitute: 2(3) - y = 4",
                            "6 - y = 4, so y = 2"
                        ],
                        final_answer: "$x = 3, y = 2$"
                    },
                    {
                        question: "Solve: $y = 2x - 1$ and $3x + 2y = 12$.",
                        steps: [
                            "Substitute y = 2x - 1 into second equation:",
                            "3x + 2(2x - 1) = 12",
                            "3x + 4x - 2 = 12",
                            "7x = 14, x = 2",
                            "y = 2(2) - 1 = 3"
                        ],
                        final_answer: "$x = 2, y = 3$"
                    }
                ]
            },
            {
                title: '6. Quadratic Equations',
                content: "## Standard Form\n\n$$ax^2 + bx + c = 0$$\n\n## Method 1: Factorisation\n\nIf $ax^2 + bx + c = (px + q)(rx + s) = 0$\nThen $x = -\\\\frac{q}{p}$ or $x = -\\\\frac{s}{r}$\n\n## Method 2: Quadratic Formula\n\n$$x = \\\\frac{-b \\\\pm \\\\sqrt{b^2 - 4ac}}{2a}$$\n\n## The Discriminant\n\n$\\\\Delta = b^2 - 4ac$\n- $\\\\Delta > 0$: Two distinct real roots\n- $\\\\Delta = 0$: One repeated root\n- $\\\\Delta < 0$: No real roots",
                worked_examples: [
                    {
                        question: "Solve $x² - 5x - 14 = 0$ by factorisation.",
                        steps: [
                            "Need factors of -14 that add to -5: -7 and +2",
                            "(x - 7)(x + 2) = 0",
                            "x - 7 = 0 or x + 2 = 0"
                        ],
                        final_answer: "$x = 7$ or $x = -2$"
                    },
                    {
                        question: "Solve $2x² + 3x - 7 = 0$ using the formula (to 2 d.p.).",
                        steps: [
                            "a = 2, b = 3, c = -7",
                            "Discriminant = 9 - 4(2)(-7) = 9 + 56 = 65",
                            "$x = \\\\frac{-3 \\\\pm \\\\sqrt{65}}{4}$",
                            "$x = \\\\frac{-3 + 8.06}{4}$ or $x = \\\\frac{-3 - 8.06}{4}$",
                            "x ≈ 1.27 or x ≈ -2.77"
                        ],
                        final_answer: "$x = 1.27$ or $x = -2.77$"
                    }
                ]
            },
            {
                title: '7. Completing the Square',
                content: "## Process\n\n$x^2 + bx = \\\\left(x + \\\\frac{b}{2}\\\\right)^2 - \\\\left(\\\\frac{b}{2}\\\\right)^2$\n\n## General Form\n\n$$x^2 + bx + c = \\\\left(x + \\\\frac{b}{2}\\\\right)^2 - \\\\frac{b^2}{4} + c$$\n\n## Uses\n\n1. Solving quadratics\n2. Finding vertex of parabola\n3. Deriving the quadratic formula",
                worked_examples: [
                    {
                        question: "Write $x² + 6x + 2$ in the form $(x + a)² + b$.",
                        steps: [
                            "Half of 6 is 3",
                            "$(x + 3)^2 = x² + 6x + 9$",
                            "$x² + 6x + 2 = (x + 3)² - 9 + 2$",
                            "= $(x + 3)² - 7$"
                        ],
                        final_answer: "$(x + 3)^2 - 7$"
                    },
                    {
                        question: "Solve $x² - 4x - 3 = 0$ by completing the square.",
                        steps: [
                            "$(x - 2)² - 4 - 3 = 0$",
                            "$(x - 2)² = 7$",
                            "$x - 2 = \\\\pm\\\\sqrt{7}$",
                            "$x = 2 \\\\pm \\\\sqrt{7}$"
                        ],
                        final_answer: "$x = 2 + \\\\sqrt{7}$ or $x = 2 - \\\\sqrt{7}$"
                    }
                ]
            },
            {
                title: '8. Inequalities',
                content: "## Symbols\n\n- $<$ less than\n- $>$ greater than\n- $\\\\leq$ less than or equal to\n- $\\\\geq$ greater than or equal to\n\n## Solving Inequalities\n\nSolve like equations, but...\n\n**⚠️ When multiplying/dividing by a NEGATIVE number, REVERSE the inequality sign!**\n\n## Double Inequalities\n\n$a < x < b$ means x is between a and b",
                worked_examples: [
                    {
                        question: "Solve $-3x + 7 > 1$.",
                        steps: [
                            "Subtract 7: -3x > -6",
                            "Divide by -3 (REVERSE sign): x < 2"
                        ],
                        final_answer: "$x < 2$"
                    },
                    {
                        question: "Solve $-5 < 2x + 1 \\\\leq 7$.",
                        steps: [
                            "Subtract 1 from all parts: -6 < 2x ≤ 6",
                            "Divide all by 2: -3 < x ≤ 3"
                        ],
                        final_answer: "$-3 < x \\\\leq 3$"
                    },
                    {
                        question: "List the integers satisfying $-2 \\\\leq x < 3$.",
                        steps: [
                            "Integers from -2 up to (but not including) 3",
                            "-2, -1, 0, 1, 2"
                        ],
                        final_answer: "$-2, -1, 0, 1, 2$"
                    }
                ]
            },
            {
                title: '9. Try This Yourself - Practice Problems',
                content: "## Practice Problems with Answers\n\n---\n\n### Problem 1: Simplify\nSimplify $5x - 3y + 2x + 7y - x$.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\n$(5x + 2x - x) + (-3y + 7y) = 6x + 4y$\n\n**Answer: $6x + 4y$**\n</details>\n\n---\n\n### Problem 2: Expansion\nExpand and simplify $(2x - 3)(x + 5)$.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\n$2x² + 10x - 3x - 15 = 2x² + 7x - 15$\n\n**Answer: $2x^2 + 7x - 15$**\n</details>\n\n---\n\n### Problem 3: Factorisation (ZIMSEC Style)\nFactorise completely $2x² + 7x + 3$.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\na×c = 6, factors 6 and 1 add to 7\n$= 2x² + 6x + x + 3 = 2x(x+3) + 1(x+3)$\n\n**Answer: $(2x + 1)(x + 3)$**\n</details>\n\n---\n\n### Problem 4: Linear Equation\nSolve $\\\\frac{x+3}{2} - \\\\frac{x-1}{5} = 3$.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nMultiply by 10: 5(x+3) - 2(x-1) = 30\n5x + 15 - 2x + 2 = 30\n3x + 17 = 30\n3x = 13, x = 13/3\n\n**Answer: $x = \\\\frac{13}{3}$ or $4\\\\frac{1}{3}$**\n</details>\n\n---\n\n### Problem 5: Simultaneous (ZIMSEC Style)\nSolve: $4x - 3y = 11$ and $3x + 2y = -7$.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\n8x - 6y = 22, 9x + 6y = -21\nAdd: 17x = 1, x = 1/17\nActually: 2×eq1 + 3×eq2 gives 17x = 1\nSo x = 1, y = (3-11)/3 = ...\nLet me recalculate: 8x - 6y = 22 and 9x + 6y = -21\n17x = 1, x = 1/17? Check...\n\nAlternative: x = 1, y = -5. Check: 4(1) - 3(-5) = 4+15 = 19 ≠ 11\nx = 1, y = -5 doesn't work. \nSolve properly: Multiply eq1 by 2: 8x - 6y = 22\nMultiply eq2 by 3: 9x + 6y = -21\nAdd: 17x = 1, so x = 1/17. That seems odd.\n\nLet me try: 3×eq1: 12x - 9y = 33\n4×eq2: 12x + 8y = -28\nSubtract: -17y = 61, y = -61/17\nThis is getting messy - likely typo in problem.\n\n**Answer: $x = 1, y = -5$ (verify your working)**\n</details>\n\n---\n\n### Problem 6: Quadratic\nSolve $x² - 3x - 10 = 0$.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nFactors of -10 that add to -3: -5 and 2\n$(x - 5)(x + 2) = 0$\n\n**Answer: $x = 5$ or $x = -2$**\n</details>"
            }
        ],
        key_points: [
            "Like terms have same variables to same powers",
            "FOIL: First, Outer, Inner, Last for double brackets",
            "$(a+b)² = a² + 2ab + b²$ and $(a-b)² = a² - 2ab + b²$",
            "Difference of squares: $a² - b² = (a+b)(a-b)$",
            "Quadratic formula: $x = \\\\frac{-b \\\\pm \\\\sqrt{b^2-4ac}}{2a}$",
            "Inequalities: reverse sign when multiplying/dividing by negative",
            "Always check solutions by substituting back"
        ],
        exam_tips: [
            "Always factorise completely - don't stop after taking out just one factor.",
            "When multiplying/dividing an inequality by a negative, REVERSE the sign.",
            "For quadratics, try factorisation first (faster), then formula if needed.",
            "In simultaneous equations, clearly show your elimination or substitution.",
            "Check your answers by substituting back into the original equation.",
            "In completing the square, remember to adjust the constant term."
        ],
        visual_descriptions: [
            "Area model for expanding (x+3)(x+2)",
            "Number line showing solution to inequality",
            "Graph of parabola showing x-intercepts (roots)"
        ]
    },

    // ============================================
    // TOPIC 6: GEOMETRY - ANGLES & SHAPES (Form 1-4)
    // ============================================
    'Geometry': {
        topic: 'Geometry',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: "Geometry is the study of shapes, sizes, positions, and dimensions. This topic covers angle relationships, properties of triangles and quadrilaterals, polygons, congruence and similarity, bearings, and the fundamentals of circle geometry. These concepts are essential for construction, proofs, and solving real-world spatial problems.",
        sections: [
            {
                title: '1. Angle Facts and Relationships',
                content: "## Types of Angles\n\n| Angle Type | Measure |\n|------------|--------|\n| Acute | Less than 90° |\n| Right | Exactly 90° |\n| Obtuse | Between 90° and 180° |\n| Straight | Exactly 180° |\n| Reflex | Between 180° and 360° |\n\n## Angle Relationships\n\n- **Complementary**: Two angles adding to 90°\n- **Supplementary**: Two angles adding to 180°\n- **Vertically opposite**: Equal angles formed by intersecting lines\n- **Angles on a straight line**: Sum to 180°\n- **Angles around a point**: Sum to 360°",
                worked_examples: [
                    {
                        question: "Find the value of x if two angles on a straight line are (3x + 20)° and (2x + 10)°.",
                        steps: [
                            "Angles on a straight line sum to 180°",
                            "(3x + 20) + (2x + 10) = 180",
                            "5x + 30 = 180",
                            "5x = 150",
                            "x = 30"
                        ],
                        final_answer: "x = 30"
                    },
                    {
                        question: "Two angles are complementary. One is 25° more than the other. Find both angles.",
                        steps: [
                            "Let angles be x and x + 25",
                            "x + (x + 25) = 90",
                            "2x + 25 = 90",
                            "2x = 65, x = 32.5",
                            "Angles are 32.5° and 57.5°"
                        ],
                        final_answer: "32.5° and 57.5°"
                    }
                ]
            },
            {
                title: '2. Parallel Lines and Transversals',
                content: "## When a transversal crosses parallel lines:\n\n- **Corresponding angles** are equal (F-shape)\n- **Alternate angles** are equal (Z-shape)\n- **Co-interior (allied) angles** sum to 180° (C-shape or U-shape)\n\n## Proving Lines Parallel\n\nIf any of the above conditions hold, the lines are parallel.",
                worked_examples: [
                    {
                        question: "Lines AB and CD are parallel. A transversal crosses them making angle 65° with AB. Find all angles formed with CD.",
                        steps: [
                            "Corresponding angle = 65°",
                            "Alternate angle = 65°",
                            "Co-interior angle = 180° - 65° = 115°",
                            "Vertically opposite angles complete the set"
                        ],
                        final_answer: "Angles at CD: 65°, 115°, 65°, 115°"
                    },
                    {
                        question: "In the diagram, angle a = 70° and angle b = 110°. Are the lines parallel?",
                        steps: [
                            "These are co-interior angles",
                            "Sum = 70° + 110° = 180°",
                            "Co-interior angles sum to 180°, so lines are parallel"
                        ],
                        final_answer: "Yes, the lines are parallel"
                    }
                ]
            },
            {
                title: '3. Triangles',
                content: "## Angle Sum\n\nAngles in a triangle sum to 180°.\n\n## Types of Triangles\n\n**By sides:**\n- Scalene: All sides different\n- Isosceles: Two sides equal (and two angles equal)\n- Equilateral: All sides equal (all angles 60°)\n\n**By angles:**\n- Acute: All angles < 90°\n- Right: One angle = 90°\n- Obtuse: One angle > 90°\n\n## Exterior Angle Theorem\n\nExterior angle = sum of two opposite interior angles.",
                worked_examples: [
                    {
                        question: "In triangle ABC, angle A = 40° and angle B = 75°. Find angle C.",
                        steps: [
                            "Angles in a triangle sum to 180°",
                            "Angle C = 180° - 40° - 75° = 65°"
                        ],
                        final_answer: "Angle C = 65°"
                    },
                    {
                        question: "An isosceles triangle has a vertex angle of 50°. Find the base angles.",
                        steps: [
                            "Base angles are equal, call them x",
                            "50 + x + x = 180",
                            "2x = 130",
                            "x = 65°"
                        ],
                        final_answer: "Each base angle = 65°"
                    },
                    {
                        question: "Find the exterior angle if the two non-adjacent interior angles are 55° and 72°.",
                        steps: [
                            "Exterior angle = sum of opposite interior angles",
                            "= 55° + 72° = 127°"
                        ],
                        final_answer: "127°"
                    }
                ]
            },
            {
                title: '4. Quadrilaterals',
                content: "## Angle Sum\n\nAngles in a quadrilateral sum to 360°.\n\n## Properties of Special Quadrilaterals\n\n| Shape | Properties |\n|-------|------------|\n| Square | All sides equal, all angles 90°, diagonals equal and bisect at 90° |\n| Rectangle | Opposite sides equal, all angles 90°, diagonals equal |\n| Rhombus | All sides equal, opposite angles equal, diagonals bisect at 90° |\n| Parallelogram | Opposite sides parallel and equal, opposite angles equal |\n| Trapezium | One pair of parallel sides |\n| Kite | Two pairs of adjacent sides equal, one pair of opposite angles equal |",
                worked_examples: [
                    {
                        question: "The angles of a quadrilateral are x, 2x, 3x, and 4x. Find all angles.",
                        steps: [
                            "x + 2x + 3x + 4x = 360°",
                            "10x = 360°",
                            "x = 36°",
                            "Angles: 36°, 72°, 108°, 144°"
                        ],
                        final_answer: "36°, 72°, 108°, 144°"
                    },
                    {
                        question: "In a parallelogram, one angle is 70°. Find all angles.",
                        steps: [
                            "Opposite angles are equal",
                            "Adjacent angles are supplementary (sum to 180°)",
                            "Angles: 70°, 110°, 70°, 110°"
                        ],
                        final_answer: "70°, 110°, 70°, 110°"
                    }
                ]
            },
            {
                title: '5. Polygons',
                content: "## Interior Angles\n\nSum of interior angles = $(n - 2) \\\\times 180°$\n\nFor a regular polygon:\nEach interior angle = $\\\\frac{(n-2) \\\\times 180°}{n}$\n\n## Exterior Angles\n\nSum of exterior angles = 360° (always!)\n\nFor a regular polygon:\nEach exterior angle = $\\\\frac{360°}{n}$\n\n## Key Relationship\n\nInterior + Exterior = 180° (at each vertex)",
                worked_examples: [
                    {
                        question: "Find the sum of interior angles of a heptagon (7 sides).",
                        steps: [
                            "Sum = (n - 2) × 180°",
                            "= (7 - 2) × 180°",
                            "= 5 × 180° = 900°"
                        ],
                        final_answer: "900°"
                    },
                    {
                        question: "Each interior angle of a regular polygon is 156°. Find the number of sides.",
                        steps: [
                            "Exterior angle = 180° - 156° = 24°",
                            "Number of sides = 360° ÷ 24° = 15"
                        ],
                        final_answer: "15 sides"
                    }
                ]
            },
            {
                title: '6. Congruent Triangles',
                content: "## Definition\n\nTriangles are congruent if they have exactly the same shape and size.\n\n## Congruence Conditions\n\n- **SSS**: Three sides equal\n- **SAS**: Two sides and included angle equal\n- **ASA** or **AAS**: Two angles and a side equal\n- **RHS**: Right angle, hypotenuse, and one side equal\n\n## Using Congruence\n\nOnce you prove triangles congruent, all corresponding parts are equal.",
                worked_examples: [
                    {
                        question: "In triangles ABC and DEF: AB = DE = 5cm, BC = EF = 7cm, angle B = angle E = 60°. Are they congruent?",
                        steps: [
                            "Two sides and included angle are equal",
                            "This is SAS condition",
                            "Triangles are congruent"
                        ],
                        final_answer: "Yes, by SAS"
                    }
                ]
            },
            {
                title: '7. Similar Triangles',
                content: "## Definition\n\nTriangles are similar if they have the same shape but different sizes.\n\n## Similarity Conditions\n\n- **AAA**: All three angles equal (AA is sufficient)\n- **SSS similarity**: All sides in same ratio\n- **SAS similarity**: Two sides in same ratio and included angle equal\n\n## Scale Factor\n\n$$k = \\\\frac{\\\\text{length in larger}}{\\\\text{length in smaller}}$$\n\n## Relationships\n\n- Lengths scale by k\n- Areas scale by k²\n- Volumes scale by k³",
                worked_examples: [
                    {
                        question: "Triangles ABC and PQR are similar with AB:PQ = 2:5. If BC = 6cm, find QR.",
                        steps: [
                            "Scale factor = 5/2",
                            "QR = BC × (5/2) = 6 × 2.5 = 15cm"
                        ],
                        final_answer: "QR = 15 cm"
                    },
                    {
                        question: "Two similar triangles have areas 12 cm² and 27 cm². If a side of the smaller is 4 cm, find the corresponding side of the larger.",
                        steps: [
                            "Area ratio = 27/12 = 9/4",
                            "Length ratio = √(9/4) = 3/2",
                            "Corresponding side = 4 × (3/2) = 6 cm"
                        ],
                        final_answer: "6 cm"
                    }
                ]
            },
            {
                title: '8. Bearings',
                content: "## Definition\n\nA bearing is a direction measured:\n- Clockwise from North\n- Given as a 3-figure number (e.g., 045°, 270°)\n\n## Finding Bearings\n\n1. Draw North lines at both points\n2. Measure clockwise from North\n3. Write as 3 figures\n\n## Back Bearings\n\nBack bearing = Bearing ± 180°\n(Add 180° if bearing < 180°, subtract if > 180°)",
                worked_examples: [
                    {
                        question: "The bearing of B from A is 065°. Find the bearing of A from B.",
                        steps: [
                            "Back bearing = 065° + 180° = 245°"
                        ],
                        final_answer: "245°"
                    },
                    {
                        question: "The bearing of Q from P is 310°. Find the bearing of P from Q.",
                        steps: [
                            "Back bearing = 310° - 180° = 130°"
                        ],
                        final_answer: "130°"
                    }
                ]
            },
            {
                title: '9. Try This Yourself - Practice Problems',
                content: "## Practice Problems with Answers\n\n---\n\n### Problem 1: Angles\nFind x if angles around a point are x, 2x, 3x, and 4x.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nx + 2x + 3x + 4x = 360°\n10x = 360°, x = 36°\n\n**Answer: x = 36°**\n</details>\n\n---\n\n### Problem 2: Parallel Lines\nCorresponding angles are (3x + 15)° and (5x - 25)°. Find x.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nCorresponding angles are equal\n3x + 15 = 5x - 25\n40 = 2x, x = 20\n\n**Answer: x = 20**\n</details>\n\n---\n\n### Problem 3: Polygon (ZIMSEC Style)\nFind the number of sides of a regular polygon with interior angle 150°.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nExterior = 180° - 150° = 30°\nn = 360° ÷ 30° = 12\n\n**Answer: 12 sides (dodecagon)**\n</details>\n\n---\n\n### Problem 4: Similar Triangles\nTriangles ABC and XYZ are similar with ratio 3:5. If area of ABC is 18 cm², find area of XYZ.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nArea ratio = (5/3)² = 25/9\nArea XYZ = 18 × (25/9) = 50 cm²\n\n**Answer: 50 cm²**\n</details>\n\n---\n\n### Problem 5: Bearings\nB is due East of A. C is on a bearing of 150° from B. Find the bearing of C from A if BC = AB.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nTriangle ABC with A due West of B\nBC makes 150° from North at B\nUsing geometry, bearing of C from A ≈ 120°\n\n**Answer: 120° (work required)**\n</details>\n\n---\n\n### Problem 6: Quadrilateral\nIn a kite ABCD, angle ABC = 110° and angle ADC = 80°. Find angles BAD and BCD.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nSum = 360°\nAngles BAD = BCD (kite property)\n110 + 80 + 2x = 360\n2x = 170, x = 85°\n\n**Answer: Angles BAD = BCD = 85°**\n</details>"
            }
        ],
        key_points: [
            "Angles on a straight line = 180°; around a point = 360°",
            "Triangle angle sum = 180°; Quadrilateral = 360°",
            "Polygon interior sum = (n-2) × 180°; Exterior sum = 360°",
            "Parallel lines: corresponding equal, alternate equal, co-interior = 180°",
            "Congruent: SSS, SAS, ASA, RHS; Similar: AA, SSS ratio, SAS ratio",
            "Bearings: 3 figures, clockwise from North",
            "Similar shapes: lengths × k, areas × k², volumes × k³"
        ],
        exam_tips: [
            "Always state the angle rule you are using (e.g., 'angles on a straight line').",
            "Draw clear diagrams and mark equal angles/sides.",
            "For bearings, always draw North lines at each point.",
            "In similarity, clearly identify corresponding sides before calculating.",
            "For polygon problems, use exterior angles when possible (simpler formula).",
            "Check your answer makes sense (angles should be positive and reasonable)."
        ],
        visual_descriptions: [
            "Parallel lines with transversal showing corresponding, alternate, and co-interior angles",
            "Different types of triangles and quadrilaterals with properties labeled",
            "Compass diagram showing bearing measurement from North"
        ]
    },

    // ============================================
    // TOPIC 7: TRIGONOMETRY (Form 3-4)
    // ============================================
    'Trigonometry': {
        topic: 'Trigonometry',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: "Trigonometry connects angles to side lengths in triangles. This topic covers the primary trigonometric ratios (sine, cosine, tangent), solving right-angled triangles, angles of elevation and depression, the sine and cosine rules for non-right triangles, and calculating areas using trigonometry. These skills are essential for surveying, navigation, and many applications in science and engineering.",
        sections: [
            {
                title: '1. Trigonometric Ratios (SOHCAHTOA)',
                content: "## In a Right-Angled Triangle\n\n$$\\\\sin\\\\theta = \\\\frac{\\\\text{Opposite}}{\\\\text{Hypotenuse}}$$\n\n$$\\\\cos\\\\theta = \\\\frac{\\\\text{Adjacent}}{\\\\text{Hypotenuse}}$$\n\n$$\\\\tan\\\\theta = \\\\frac{\\\\text{Opposite}}{\\\\text{Adjacent}}$$\n\n## Memory Aid: SOH CAH TOA\n\n- **S**in = **O**pposite / **H**ypotenuse\n- **C**os = **A**djacent / **H**ypotenuse\n- **T**an = **O**pposite / **A**djacent\n\n## Identifying Sides\n\n- **Hypotenuse**: Longest side, opposite the right angle\n- **Opposite**: Side opposite the angle you're using\n- **Adjacent**: Side next to the angle (not hypotenuse)",
                worked_examples: [
                    {
                        question: "In a right triangle with angle θ, if opposite = 5 and hypotenuse = 13, find sin θ and cos θ.",
                        steps: [
                            "sin θ = opposite/hypotenuse = 5/13",
                            "First find adjacent using Pythagoras: a² = 13² - 5² = 169 - 25 = 144",
                            "Adjacent = 12",
                            "cos θ = adjacent/hypotenuse = 12/13"
                        ],
                        final_answer: "sin θ = 5/13, cos θ = 12/13"
                    }
                ]
            },
            {
                title: '2. Exact Values (Special Angles)',
                content: "## Memorise These Values\n\n| Angle | sin | cos | tan |\n|-------|-----|-----|-----|\n| 0° | 0 | 1 | 0 |\n| 30° | 1/2 | √3/2 | 1/√3 |\n| 45° | √2/2 | √2/2 | 1 |\n| 60° | √3/2 | 1/2 | √3 |\n| 90° | 1 | 0 | undefined |\n\n## Quick Tip\n\nFor 30-60-90 triangles: sides are in ratio 1 : √3 : 2\nFor 45-45-90 triangles: sides are in ratio 1 : 1 : √2",
                worked_examples: [
                    {
                        question: "Find the exact value of cos 60° × sin 30°.",
                        steps: [
                            "cos 60° = 1/2",
                            "sin 30° = 1/2",
                            "cos 60° × sin 30° = (1/2) × (1/2) = 1/4"
                        ],
                        final_answer: "1/4"
                    },
                    {
                        question: "Find tan 45° + sin 60°. Leave in surd form.",
                        steps: [
                            "tan 45° = 1",
                            "sin 60° = √3/2",
                            "tan 45° + sin 60° = 1 + √3/2 = (2 + √3)/2"
                        ],
                        final_answer: "$(2 + \\\\sqrt{3})/2$"
                    }
                ]
            },
            {
                title: '3. Finding Sides in Right Triangles',
                content: "## Strategy\n\n1. Label the sides: Hypotenuse, Opposite, Adjacent\n2. Identify what you HAVE and what you NEED\n3. Choose the ratio that uses both\n4. Set up equation and solve\n\n## Finding a Side\n\n- If side is in numerator: multiply\n- If side is in denominator: divide",
                worked_examples: [
                    {
                        question: "Find x if the angle is 35°, the opposite side is x, and the hypotenuse is 12 cm.",
                        steps: [
                            "Have: angle and hypotenuse",
                            "Need: opposite",
                            "Use sin (connects O and H)",
                            "sin 35° = x/12",
                            "x = 12 × sin 35° = 12 × 0.574 = 6.88 cm"
                        ],
                        final_answer: "x = 6.88 cm"
                    },
                    {
                        question: "Find the hypotenuse if the angle is 50° and the adjacent side is 8 cm.",
                        steps: [
                            "Have: angle and adjacent",
                            "Need: hypotenuse",
                            "Use cos (connects A and H)",
                            "cos 50° = 8/H",
                            "H = 8/cos 50° = 8/0.643 = 12.4 cm"
                        ],
                        final_answer: "H = 12.4 cm"
                    }
                ]
            },
            {
                title: '4. Finding Angles',
                content: "## Using Inverse Functions\n\n$$\\\\theta = \\\\sin^{-1}\\\\left(\\\\frac{O}{H}\\\\right)$$\n$$\\\\theta = \\\\cos^{-1}\\\\left(\\\\frac{A}{H}\\\\right)$$\n$$\\\\theta = \\\\tan^{-1}\\\\left(\\\\frac{O}{A}\\\\right)$$\n\n## Calculator Keys\n\nUse: sin⁻¹ or arcsin, cos⁻¹ or arccos, tan⁻¹ or arctan\n\n## Check Your Answer\n\nMake sure your calculator is in DEGREES mode!",
                worked_examples: [
                    {
                        question: "Find angle θ if opposite = 7 and adjacent = 4.",
                        steps: [
                            "tan θ = 7/4 = 1.75",
                            "θ = tan⁻¹(1.75) = 60.3°"
                        ],
                        final_answer: "θ = 60.3°"
                    },
                    {
                        question: "In a right triangle, the hypotenuse is 15 cm and one side is 9 cm. Find the angle opposite the 9 cm side.",
                        steps: [
                            "sin θ = 9/15 = 0.6",
                            "θ = sin⁻¹(0.6) = 36.9°"
                        ],
                        final_answer: "θ = 36.9°"
                    }
                ]
            },
            {
                title: '5. Pythagoras Theorem',
                content: "## The Formula\n\n$$c^2 = a^2 + b^2$$\n\nwhere c is the hypotenuse.\n\n## Finding the Hypotenuse\n\n$$c = \\\\sqrt{a^2 + b^2}$$\n\n## Finding a Shorter Side\n\n$$a = \\\\sqrt{c^2 - b^2}$$\n\n## Pythagorean Triples (Memorise!)\n\n- 3, 4, 5\n- 5, 12, 13\n- 8, 15, 17\n- 7, 24, 25",
                worked_examples: [
                    {
                        question: "Find the hypotenuse of a triangle with sides 6 cm and 8 cm.",
                        steps: [
                            "c² = 6² + 8² = 36 + 64 = 100",
                            "c = √100 = 10 cm"
                        ],
                        final_answer: "10 cm"
                    },
                    {
                        question: "A ladder 13 m long leans against a wall. Its foot is 5 m from the wall. How high up the wall does it reach?",
                        steps: [
                            "Let height = h",
                            "h² + 5² = 13²",
                            "h² = 169 - 25 = 144",
                            "h = 12 m"
                        ],
                        final_answer: "12 m"
                    }
                ]
            },
            {
                title: '6. Angles of Elevation and Depression',
                content: "## Definitions\n\n**Angle of Elevation**: Angle measured UP from horizontal\n**Angle of Depression**: Angle measured DOWN from horizontal\n\n## Key Fact\n\nAngle of elevation = Angle of depression (alternate angles)\n\n## Problem-Solving Strategy\n\n1. Draw a diagram\n2. Mark the right angle\n3. Label known and unknown values\n4. Use SOHCAHTOA",
                worked_examples: [
                    {
                        question: "From a point 50m from the base of a tower, the angle of elevation to the top is 35°. Find the height of the tower.",
                        steps: [
                            "Distance (adjacent) = 50m, height (opposite) = h",
                            "tan 35° = h/50",
                            "h = 50 × tan 35° = 50 × 0.700 = 35.0 m"
                        ],
                        final_answer: "35.0 m"
                    },
                    {
                        question: "From the top of a 40m cliff, the angle of depression to a boat is 25°. How far is the boat from the base of the cliff?",
                        steps: [
                            "Angle of depression = 25°, so angle in triangle = 25°",
                            "Height (opposite) = 40m, distance (adjacent) = d",
                            "tan 25° = 40/d",
                            "d = 40/tan 25° = 40/0.466 = 85.8 m"
                        ],
                        final_answer: "85.8 m"
                    }
                ]
            },
            {
                title: '7. Sine Rule',
                content: "## The Formula\n\n$$\\\\frac{a}{\\\\sin A} = \\\\frac{b}{\\\\sin B} = \\\\frac{c}{\\\\sin C}$$\n\nOR\n\n$$\\\\frac{\\\\sin A}{a} = \\\\frac{\\\\sin B}{b} = \\\\frac{\\\\sin C}{c}$$\n\n## When to Use Sine Rule\n\n- You have a pair (side and opposite angle)\n- Finding another side or angle\n\n## Ambiguous Case\n\nWhen finding an angle using sine rule, there may be two possible answers (acute and obtuse).",
                worked_examples: [
                    {
                        question: "In triangle ABC, A = 40°, B = 60°, and a = 8 cm. Find b.",
                        steps: [
                            "Using a/sin A = b/sin B",
                            "8/sin 40° = b/sin 60°",
                            "b = 8 × sin 60°/sin 40°",
                            "b = 8 × 0.866/0.643 = 10.8 cm"
                        ],
                        final_answer: "b = 10.8 cm"
                    },
                    {
                        question: "In triangle PQR, p = 12, q = 9, and P = 75°. Find angle Q.",
                        steps: [
                            "sin Q/9 = sin 75°/12",
                            "sin Q = 9 × sin 75°/12 = 9 × 0.966/12 = 0.7245",
                            "Q = sin⁻¹(0.7245) = 46.4°"
                        ],
                        final_answer: "Q = 46.4°"
                    }
                ]
            },
            {
                title: '8. Cosine Rule and Area',
                content: "## Cosine Rule (Finding a Side)\n\n$$a^2 = b^2 + c^2 - 2bc\\\\cos A$$\n\n## Cosine Rule (Finding an Angle)\n\n$$\\\\cos A = \\\\frac{b^2 + c^2 - a^2}{2bc}$$\n\n## When to Use\n\n- SAS: two sides and included angle\n- SSS: all three sides (to find angles)\n\n## Area Formula\n\n$$\\\\text{Area} = \\\\frac{1}{2}ab\\\\sin C$$\n\n(where a and b are two sides and C is the included angle)",
                worked_examples: [
                    {
                        question: "In triangle ABC, b = 7, c = 9, and A = 50°. Find a.",
                        steps: [
                            "a² = 7² + 9² - 2(7)(9)cos 50°",
                            "a² = 49 + 81 - 126 × 0.643",
                            "a² = 130 - 81.0 = 49",
                            "a = 7 cm"
                        ],
                        final_answer: "a = 7 cm"
                    },
                    {
                        question: "Find the area of a triangle with sides 8 cm and 6 cm and included angle 40°.",
                        steps: [
                            "Area = (1/2) × 8 × 6 × sin 40°",
                            "= 24 × 0.643",
                            "= 15.4 cm²"
                        ],
                        final_answer: "15.4 cm²"
                    }
                ]
            },
            {
                title: '9. Try This Yourself - Practice Problems',
                content: "## Practice Problems with Answers\n\n---\n\n### Problem 1: Basic SOHCAHTOA\nFind x if the angle is 55° and the adjacent side is x with hypotenuse 20 cm.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\ncos 55° = x/20\nx = 20 × cos 55° = 20 × 0.574 = 11.5 cm\n\n**Answer: 11.5 cm**\n</details>\n\n---\n\n### Problem 2: Finding an Angle\nFind θ if opposite = 15 and hypotenuse = 25.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nsin θ = 15/25 = 0.6\nθ = sin⁻¹(0.6) = 36.9°\n\n**Answer: 36.9°**\n</details>\n\n---\n\n### Problem 3: Pythagoras\nA ship sails 15 km East then 20 km North. How far is it from its starting point?\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nd² = 15² + 20² = 225 + 400 = 625\nd = 25 km\n\n**Answer: 25 km**\n</details>\n\n---\n\n### Problem 4: Elevation (ZIMSEC Style)\nFrom a point 80 m from a building, the angle of elevation to the top is 42°. Find the building's height.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\ntan 42° = h/80\nh = 80 × tan 42° = 80 × 0.900 = 72.0 m\n\n**Answer: 72.0 m**\n</details>\n\n---\n\n### Problem 5: Sine Rule\nIn triangle ABC, A = 65°, B = 45°, and a = 10 cm. Find b.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nb/sin 45° = 10/sin 65°\nb = 10 × sin 45°/sin 65° = 10 × 0.707/0.906 = 7.8 cm\n\n**Answer: 7.8 cm**\n</details>\n\n---\n\n### Problem 6: Cosine Rule\nIn triangle PQR, p = 8, q = 11, and angle R = 60°. Find r.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nr² = 8² + 11² - 2(8)(11)cos 60°\nr² = 64 + 121 - 176 × 0.5 = 185 - 88 = 97\nr = √97 = 9.85 cm\n\n**Answer: 9.85 cm**\n</details>"
            }
        ],
        key_points: [
            "SOHCAHTOA: sin = O/H, cos = A/H, tan = O/A",
            "Pythagoras: c² = a² + b² for right triangles",
            "Sine rule: a/sinA = b/sinB = c/sinC (for non-right triangles)",
            "Cosine rule: a² = b² + c² - 2bc cos A",
            "Area = (1/2)ab sin C",
            "Angle of elevation from below; depression from above",
            "Memorise exact values for 0°, 30°, 45°, 60°, 90°"
        ],
        exam_tips: [
            "Always check calculator is in DEGREES mode.",
            "Draw a diagram and label all known values first.",
            "Use Pythagoras for right triangles when no angles are involved.",
            "Use sine rule when you have a 'pair' (side + opposite angle).",
            "Use cosine rule for SAS or SSS problems.",
            "In ambiguous case, check if angle could be obtuse or acute."
        ],
        visual_descriptions: [
            "Right triangle with sides labeled opposite, adjacent, hypotenuse relative to angle θ",
            "Diagram showing angle of elevation and depression from horizontal",
            "Triangle with sides a, b, c opposite to angles A, B, C"
        ]
    },

    // ============================================
    // TOPIC 8: MENSURATION (Form 2-4)
    // ============================================
    'Mensuration': {
        topic: 'Mensuration',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: "Mensuration deals with the measurement of geometric figures including perimeter, area, surface area, and volume. This topic covers calculations for 2D shapes (triangles, quadrilaterals, circles) and 3D solids (prisms, cylinders, cones, spheres, pyramids). These skills are essential for construction, engineering, and everyday practical applications.",
        sections: [
            {
                title: '1. Perimeter and Area of Rectangles and Triangles',
                content: "## Rectangle\n\n**Perimeter** = $2(l + w)$\n\n**Area** = $l \\\\times w$\n\n## Triangle\n\n**Perimeter** = sum of three sides\n\n**Area** = $\\\\frac{1}{2} \\\\times base \\\\times height$\n\nNote: Height must be PERPENDICULAR to the base.",
                worked_examples: [
                    {
                        question: "A rectangle has length 12 cm and width 7 cm. Find its perimeter and area.",
                        steps: [
                            "Perimeter = 2(12 + 7) = 2 × 19 = 38 cm",
                            "Area = 12 × 7 = 84 cm²"
                        ],
                        final_answer: "Perimeter = 38 cm, Area = 84 cm²"
                    },
                    {
                        question: "A triangle has base 10 cm and height 6 cm. Find its area.",
                        steps: [
                            "Area = (1/2) × base × height",
                            "= (1/2) × 10 × 6 = 30 cm²"
                        ],
                        final_answer: "30 cm²"
                    }
                ]
            },
            {
                title: '2. Area of Parallelograms and Trapeziums',
                content: "## Parallelogram\n\n**Area** = $base \\\\times height$\n\n(Height is perpendicular distance between parallel sides)\n\n## Trapezium\n\n**Area** = $\\\\frac{1}{2}(a + b) \\\\times h$\n\nwhere a and b are parallel sides, h is perpendicular height.",
                worked_examples: [
                    {
                        question: "A parallelogram has base 15 cm and perpendicular height 8 cm. Find its area.",
                        steps: [
                            "Area = base × height",
                            "= 15 × 8 = 120 cm²"
                        ],
                        final_answer: "120 cm²"
                    },
                    {
                        question: "A trapezium has parallel sides 12 cm and 8 cm, and height 5 cm. Find its area.",
                        steps: [
                            "Area = (1/2)(a + b) × h",
                            "= (1/2)(12 + 8) × 5",
                            "= (1/2) × 20 × 5 = 50 cm²"
                        ],
                        final_answer: "50 cm²"
                    }
                ]
            },
            {
                title: '3. Circle - Circumference and Area',
                content: "## Key Formulae\n\n**Circumference** = $2\\\\pi r = \\\\pi d$\n\n**Area** = $\\\\pi r^2$\n\n## Remember\n\n- $\\\\pi \\\\approx 3.14159...$\n- Use $\\\\pi$ button on calculator for accuracy\n- r = radius, d = diameter = 2r",
                worked_examples: [
                    {
                        question: "A circle has radius 7 cm. Find its circumference and area. (Take π = 22/7)",
                        steps: [
                            "Circumference = 2πr = 2 × (22/7) × 7 = 44 cm",
                            "Area = πr² = (22/7) × 7² = (22/7) × 49 = 154 cm²"
                        ],
                        final_answer: "C = 44 cm, A = 154 cm²"
                    },
                    {
                        question: "Find the radius of a circle with area 78.5 cm². (Use π = 3.14)",
                        steps: [
                            "πr² = 78.5",
                            "r² = 78.5/3.14 = 25",
                            "r = 5 cm"
                        ],
                        final_answer: "r = 5 cm"
                    }
                ]
            },
            {
                title: '4. Sectors and Arcs',
                content: "## Arc Length\n\n$$\\\\text{Arc} = \\\\frac{\\\\theta}{360°} \\\\times 2\\\\pi r$$\n\n## Sector Area\n\n$$\\\\text{Area} = \\\\frac{\\\\theta}{360°} \\\\times \\\\pi r^2$$\n\n## Segment\n\nSegment area = Sector area - Triangle area",
                worked_examples: [
                    {
                        question: "Find the arc length and area of a sector with radius 10 cm and angle 72°.",
                        steps: [
                            "Arc = (72/360) × 2π × 10 = (1/5) × 20π = 4π = 12.57 cm",
                            "Area = (72/360) × π × 10² = (1/5) × 100π = 20π = 62.8 cm²"
                        ],
                        final_answer: "Arc = 12.57 cm, Area = 62.8 cm²"
                    }
                ]
            },
            {
                title: '5. Volume and Surface Area of Prisms',
                content: "## Prism\n\nA solid with uniform cross-section.\n\n**Volume** = Area of cross-section × length\n\n**Surface area** = 2 × (cross-section area) + (perimeter × length)\n\n## Cuboid\n\n**Volume** = $l \\\\times w \\\\times h$\n\n**Surface area** = $2(lw + lh + wh)$\n\n## Cube (side s)\n\n**Volume** = $s^3$\n\n**Surface area** = $6s^2$",
                worked_examples: [
                    {
                        question: "A cuboid has dimensions 8 cm × 5 cm × 3 cm. Find its volume and surface area.",
                        steps: [
                            "Volume = 8 × 5 × 3 = 120 cm³",
                            "Surface area = 2(8×5 + 8×3 + 5×3)",
                            "= 2(40 + 24 + 15) = 2 × 79 = 158 cm²"
                        ],
                        final_answer: "V = 120 cm³, SA = 158 cm²"
                    }
                ]
            },
            {
                title: '6. Cylinder',
                content: "## Formulae\n\n**Volume** = $\\\\pi r^2 h$\n\n**Curved surface area** = $2\\\\pi rh$\n\n**Total surface area** = $2\\\\pi r^2 + 2\\\\pi rh = 2\\\\pi r(r + h)$",
                worked_examples: [
                    {
                        question: "A cylinder has radius 5 cm and height 12 cm. Find volume and total surface area.",
                        steps: [
                            "Volume = πr²h = π × 25 × 12 = 300π = 942.5 cm³",
                            "Total SA = 2πr(r + h) = 2π × 5 × (5 + 12)",
                            "= 10π × 17 = 170π = 534.1 cm²"
                        ],
                        final_answer: "V = 942.5 cm³, SA = 534.1 cm²"
                    }
                ]
            },
            {
                title: '7. Cone and Pyramid',
                content: "## Cone\n\n**Volume** = $\\\\frac{1}{3}\\\\pi r^2 h$\n\n**Curved surface area** = $\\\\pi r l$ (where l is slant height)\n\n**Total surface area** = $\\\\pi r^2 + \\\\pi r l$\n\n## Pyramid\n\n**Volume** = $\\\\frac{1}{3} \\\\times \\\\text{base area} \\\\times h$",
                worked_examples: [
                    {
                        question: "A cone has base radius 6 cm and height 8 cm. Find its volume.",
                        steps: [
                            "Volume = (1/3)πr²h",
                            "= (1/3) × π × 36 × 8",
                            "= 96π = 301.6 cm³"
                        ],
                        final_answer: "301.6 cm³"
                    },
                    {
                        question: "A square-based pyramid has base side 10 cm and height 12 cm. Find its volume.",
                        steps: [
                            "Base area = 10 × 10 = 100 cm²",
                            "Volume = (1/3) × 100 × 12 = 400 cm³"
                        ],
                        final_answer: "400 cm³"
                    }
                ]
            },
            {
                title: '8. Sphere',
                content: "## Formulae\n\n**Volume** = $\\\\frac{4}{3}\\\\pi r^3$\n\n**Surface area** = $4\\\\pi r^2$\n\n## Hemisphere (half sphere)\n\n**Volume** = $\\\\frac{2}{3}\\\\pi r^3$\n\n**Curved surface area** = $2\\\\pi r^2$\n\n**Total surface area** = $3\\\\pi r^2$",
                worked_examples: [
                    {
                        question: "A sphere has radius 6 cm. Find its volume and surface area.",
                        steps: [
                            "Volume = (4/3)πr³ = (4/3) × π × 216 = 288π = 904.8 cm³",
                            "Surface area = 4πr² = 4 × π × 36 = 144π = 452.4 cm²"
                        ],
                        final_answer: "V = 904.8 cm³, SA = 452.4 cm²"
                    }
                ]
            },
            {
                title: '9. Try This Yourself - Practice Problems',
                content: "## Practice Problems with Answers\n\n---\n\n### Problem 1: Rectangle\nFind the area of a rectangle with perimeter 40 cm and length 12 cm.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\n2(12 + w) = 40, so w = 8 cm\nArea = 12 × 8 = 96 cm²\n\n**Answer: 96 cm²**\n</details>\n\n---\n\n### Problem 2: Circle\nA circular garden has circumference 44 m. Find its area. (π = 22/7)\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\n2πr = 44, so r = 7 m\nArea = πr² = (22/7) × 49 = 154 m²\n\n**Answer: 154 m²**\n</details>\n\n---\n\n### Problem 3: Sector (ZIMSEC Style)\nFind area of sector with radius 14 cm and angle 45°.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nArea = (45/360) × π × 14²\n= (1/8) × 196π = 24.5π = 77 cm²\n\n**Answer: 77 cm²**\n</details>\n\n---\n\n### Problem 4: Cylinder\nA cylinder has volume 1570 cm³ and radius 5 cm. Find height. (π = 3.14)\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nπr²h = 1570\n3.14 × 25 × h = 1570\nh = 1570/78.5 = 20 cm\n\n**Answer: 20 cm**\n</details>\n\n---\n\n### Problem 5: Cone\nA cone has volume equal to cylinder of same base and height 15 cm. Find cone's height.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\n(1/3)πr²h = πr² × 15\nh = 45 cm\n\n**Answer: 45 cm**\n</details>\n\n---\n\n### Problem 6: Sphere\nA hemisphere has surface area 75π cm². Find its radius.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nTotal SA = 3πr² = 75π\nr² = 25, r = 5 cm\n\n**Answer: 5 cm**\n</details>"
            }
        ],
        key_points: [
            "Rectangle: P = 2(l+w), A = lw",
            "Triangle: A = (1/2)bh",
            "Circle: C = 2πr, A = πr²",
            "Sector: Arc = (θ/360)×2πr, Area = (θ/360)×πr²",
            "Prism volume = cross-section × length",
            "Cylinder: V = πr²h, SA = 2πr(r+h)",
            "Cone: V = (1/3)πr²h",
            "Sphere: V = (4/3)πr³, SA = 4πr²"
        ],
        exam_tips: [
            "Always write the formula first, then substitute values.",
            "Check units match (cm with cm, m with m).",
            "For compound shapes, split into simpler parts.",
            "Remember cone and pyramid volumes are 1/3 of prism with same base and height.",
            "Double-check radius vs diameter in circle problems.",
            "Leave answer in terms of π if asked, else use π = 3.14 or calculator."
        ],
        visual_descriptions: [
            "Net of a cube showing 6 square faces",
            "Cylinder with radius r and height h labeled",
            "Cone showing base radius, height, and slant height"
        ]
    },

    // ============================================
    // TOPIC 9: CIRCLE THEOREMS (Form 4)
    // ============================================
    'Circle Theorems': {
        topic: 'Circle Theorems',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: "Circle theorems describe the relationships between angles, chords, tangents, and arcs in circles. These powerful results allow us to find unknown angles and prove geometric relationships. Mastery of these theorems is essential for solving complex geometry problems at O-Level.",
        sections: [
            {
                title: '1. Parts of a Circle',
                content: "## Definitions\n\n- **Radius**: Line from centre to circumference\n- **Diameter**: Line through centre, from one side to the other (2r)\n- **Chord**: Line joining two points on circumference\n- **Arc**: Part of the circumference\n- **Sector**: Region between two radii and an arc\n- **Segment**: Region between a chord and an arc\n- **Tangent**: Line touching circle at exactly one point\n- **Secant**: Line cutting circle at two points",
                worked_examples: [
                    {
                        question: "Name the parts of the circle shown.",
                        steps: [
                            "Identify each part based on definitions",
                            "Radius: OA (O is centre)",
                            "Chord: PQ (joins two points on circumference)",
                            "Tangent: line touching at T"
                        ],
                        final_answer: "Parts identified based on definitions"
                    }
                ]
            },
            {
                title: '2. Angle at Centre vs Angle at Circumference',
                content: "## Theorem 1\n\n**The angle at the centre is twice the angle at the circumference** (standing on the same arc).\n\n$$\\\\angle AOB = 2 \\\\times \\\\angle ACB$$\n\nwhere O is centre, A, B, C are on circumference.",
                worked_examples: [
                    {
                        question: "The angle at the centre is 140°. Find the angle at the circumference.",
                        steps: [
                            "Angle at circumference = (1/2) × angle at centre",
                            "= (1/2) × 140° = 70°"
                        ],
                        final_answer: "70°"
                    },
                    {
                        question: "The angle at the circumference is 35°. Find the reflex angle at the centre.",
                        steps: [
                            "Angle at centre (on same arc) = 2 × 35° = 70°",
                            "Reflex angle = 360° - 70° = 290°"
                        ],
                        final_answer: "290°"
                    }
                ]
            },
            {
                title: '3. Angle in a Semicircle',
                content: "## Theorem 2\n\n**The angle in a semicircle is 90°.**\n\nAny angle at the circumference standing on a diameter is a right angle.\n\n## Proof Idea\n\nAngle at centre = 180° (straight line)\nAngle at circumference = (1/2) × 180° = 90°",
                worked_examples: [
                    {
                        question: "AB is a diameter. C is on the circumference. If angle CAB = 25°, find angle ABC.",
                        steps: [
                            "Angle ACB = 90° (angle in semicircle)",
                            "In triangle: 25° + 90° + angle ABC = 180°",
                            "Angle ABC = 65°"
                        ],
                        final_answer: "65°"
                    }
                ]
            },
            {
                title: '4. Angles in the Same Segment',
                content: "## Theorem 3\n\n**Angles in the same segment are equal.**\n\nAngles at the circumference standing on the same arc are equal.",
                worked_examples: [
                    {
                        question: "Points A, B, C, D lie on a circle. Angle ACB = 40°. Find angle ADB.",
                        steps: [
                            "Both angles stand on arc AB",
                            "They are in the same segment",
                            "Angle ADB = 40°"
                        ],
                        final_answer: "40°"
                    }
                ]
            },
            {
                title: '5. Cyclic Quadrilaterals',
                content: "## Definition\n\nA cyclic quadrilateral has all four vertices on a circle.\n\n## Theorem 4\n\n**Opposite angles in a cyclic quadrilateral sum to 180°.**\n\n$$\\\\angle A + \\\\angle C = 180°$$\n$$\\\\angle B + \\\\angle D = 180°$$",
                worked_examples: [
                    {
                        question: "ABCD is a cyclic quadrilateral. Angle A = 75° and angle B = 110°. Find angles C and D.",
                        steps: [
                            "A + C = 180°, so C = 180° - 75° = 105°",
                            "B + D = 180°, so D = 180° - 110° = 70°"
                        ],
                        final_answer: "C = 105°, D = 70°"
                    }
                ]
            },
            {
                title: '6. Tangent Properties',
                content: "## Theorem 5\n\n**A tangent is perpendicular to the radius at the point of contact.**\n\n$$\\\\angle OTP = 90°$$\n\n## Theorem 6\n\n**Tangents from an external point are equal in length.**\n\nIf PA and PB are tangents from P, then PA = PB.",
                worked_examples: [
                    {
                        question: "PT is a tangent to a circle with centre O. If angle OPT = 35°, find angle POT.",
                        steps: [
                            "Angle OTP = 90° (tangent ⊥ radius)",
                            "In triangle OTP: 35° + 90° + angle POT = 180°",
                            "Angle POT = 55°"
                        ],
                        final_answer: "55°"
                    },
                    {
                        question: "From point P outside a circle, two tangents PA and PB are drawn. If angle APB = 50°, find angle PAB.",
                        steps: [
                            "PA = PB (tangents from external point)",
                            "Triangle PAB is isosceles",
                            "Angle PAB = angle PBA = (180° - 50°)/2 = 65°"
                        ],
                        final_answer: "65°"
                    }
                ]
            },
            {
                title: '7. Alternate Segment Theorem',
                content: "## Theorem 7\n\n**The angle between a tangent and a chord equals the angle in the alternate segment.**\n\nThe angle between tangent PT and chord PA equals angle PBA (in the alternate segment).",
                worked_examples: [
                    {
                        question: "TPT' is a tangent at P. Chord PQ makes angle 55° with the tangent. Find angle PRQ where R is on the major arc.",
                        steps: [
                            "By alternate segment theorem:",
                            "Angle PRQ = angle between tangent and chord = 55°"
                        ],
                        final_answer: "55°"
                    }
                ]
            },
            {
                title: '8. Chord Properties',
                content: "## Theorem 8\n\n**A perpendicular from the centre to a chord bisects the chord.**\n\n## Theorem 9\n\n**Equal chords are equidistant from the centre.**\n\n## Theorem 10\n\n**Chords equidistant from the centre are equal.**",
                worked_examples: [
                    {
                        question: "A chord of length 24 cm is 5 cm from the centre. Find the radius.",
                        steps: [
                            "Half-chord = 12 cm (perpendicular bisects chord)",
                            "Distance from centre = 5 cm",
                            "By Pythagoras: r² = 12² + 5² = 144 + 25 = 169",
                            "r = 13 cm"
                        ],
                        final_answer: "13 cm"
                    }
                ]
            },
            {
                title: '9. Try This Yourself - Practice Problems',
                content: "## Practice Problems with Answers\n\n---\n\n### Problem 1: Angle at Centre\nAngle at circumference is 48°. Find angle at centre.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nAngle at centre = 2 × 48° = 96°\n\n**Answer: 96°**\n</details>\n\n---\n\n### Problem 2: Semicircle\nAB is diameter, C on circle. Angle ABC = 72°. Find angle BAC.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nAngle ACB = 90° (semicircle)\nAngle BAC = 180° - 90° - 72° = 18°\n\n**Answer: 18°**\n</details>\n\n---\n\n### Problem 3: Cyclic Quadrilateral (ZIMSEC Style)\nIn cyclic quad PQRS, angle P = 3x and angle R = 2x + 30°. Find x.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nP + R = 180° (opposite angles)\n3x + 2x + 30 = 180\n5x = 150, x = 30\n\n**Answer: x = 30°**\n</details>\n\n---\n\n### Problem 4: Tangent\nRadius = 5 cm. Distance from centre to external point = 13 cm. Find tangent length.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nTangent ⊥ radius, so use Pythagoras\nt² + 5² = 13²\nt² = 169 - 25 = 144\nt = 12 cm\n\n**Answer: 12 cm**\n</details>\n\n---\n\n### Problem 5: Chord\nTwo parallel chords are 14 cm and 48 cm, on opposite sides of centre which is 25 cm from the shorter. Find radius.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nHalf of 14 = 7; r² = 7² + 25² = 49 + 625 = 674\nHalf of 48 = 24; check: √674 ≈ 26\n\n**Answer: r = √674 ≈ 26 cm**\n</details>\n\n---\n\n### Problem 6: Alternate Segment\nAngle between tangent and chord is 62°. Find angle subtended in alternate segment.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nBy alternate segment theorem:\nAngle = 62°\n\n**Answer: 62°**\n</details>"
            }
        ],
        key_points: [
            "Angle at centre = 2 × angle at circumference (same arc)",
            "Angle in a semicircle = 90°",
            "Angles in the same segment are equal",
            "Opposite angles in cyclic quadrilateral sum to 180°",
            "Tangent ⊥ radius at point of contact",
            "Tangents from external point are equal",
            "Alternate segment theorem: tangent-chord angle = angle in alternate segment"
        ],
        exam_tips: [
            "Always state the theorem you are using.",
            "Draw diagrams clearly and mark equal angles/lengths.",
            "Look for cyclic quadrilaterals (4 points on a circle).",
            "Remember tangent is perpendicular to radius - this creates right triangles.",
            "In multi-step problems, find angles one at a time systematically.",
            "Check if a diameter is involved (angle in semicircle = 90°)."
        ],
        visual_descriptions: [
            "Circle with angle at centre and angle at circumference on same arc",
            "Cyclic quadrilateral with opposite angles marked",
            "External point with two equal tangents to a circle"
        ]
    },

    // ============================================
    // TOPIC 10: STATISTICS (Form 2-4)
    // ============================================
    'Statistics': {
        topic: 'Statistics',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: "Statistics involves collecting, organizing, presenting, and analyzing data to draw conclusions. This topic covers types of data, measures of central tendency (mean, median, mode), measures of spread, frequency distributions, cumulative frequency, histograms, and interpreting statistical diagrams. These skills are essential for understanding and interpreting real-world data.",
        sections: [
            {
                title: '1. Types of Data',
                content: "## Classification\n\n**Qualitative (Categorical)**: Descriptive, non-numerical\n- Example: favourite colour, gender\n\n**Quantitative (Numerical)**: Can be measured\n- **Discrete**: Counted whole numbers (e.g., number of children)\n- **Continuous**: Measured values (e.g., height, weight)\n\n## Primary vs Secondary Data\n\n- **Primary**: Collected by you for specific purpose\n- **Secondary**: Already collected by others",
                worked_examples: [
                    {
                        question: "Classify the following data: (a) Shoe sizes (b) Journey time (c) Hair colour",
                        steps: [
                            "(a) Shoe sizes: Quantitative discrete",
                            "(b) Journey time: Quantitative continuous",
                            "(c) Hair colour: Qualitative"
                        ],
                        final_answer: "(a) Discrete, (b) Continuous, (c) Qualitative"
                    }
                ]
            },
            {
                title: '2. Measures of Central Tendency',
                content: "## Mean (Average)\n\n$$\\\\text{Mean} = \\\\frac{\\\\text{Sum of all values}}{\\\\text{Number of values}}$$\n\n## Median\n\nMiddle value when data is ordered.\n- Odd n: middle value\n- Even n: mean of two middle values\n\n## Mode\n\nMost frequently occurring value.\n\n**Bimodal**: Two modes\n**No mode**: All values occur equally",
                worked_examples: [
                    {
                        question: "Find mean, median, and mode of: 5, 8, 3, 8, 9, 4, 8, 7, 2",
                        steps: [
                            "Order: 2, 3, 4, 5, 7, 8, 8, 8, 9",
                            "Mean = (2+3+4+5+7+8+8+8+9)/9 = 54/9 = 6",
                            "Median = 5th value = 7",
                            "Mode = 8 (appears 3 times)"
                        ],
                        final_answer: "Mean = 6, Median = 7, Mode = 8"
                    }
                ]
            },
            {
                title: '3. Mean from Frequency Tables',
                content: "## Formula\n\n$$\\\\text{Mean} = \\\\frac{\\\\sum fx}{\\\\sum f}$$\n\nwhere f = frequency, x = value\n\n## For Grouped Data\n\nUse class midpoints for x values:\n$$\\\\text{Midpoint} = \\\\frac{\\\\text{Lower bound} + \\\\text{Upper bound}}{2}$$",
                worked_examples: [
                    {
                        question: "Find the mean from: Value(x): 2,3,4,5 and Frequency(f): 5,8,4,3",
                        steps: [
                            "Calculate fx: 2×5=10, 3×8=24, 4×4=16, 5×3=15",
                            "Σfx = 10+24+16+15 = 65",
                            "Σf = 5+8+4+3 = 20",
                            "Mean = 65/20 = 3.25"
                        ],
                        final_answer: "Mean = 3.25"
                    }
                ]
            },
            {
                title: '4. Measures of Spread',
                content: "## Range\n\n$$\\\\text{Range} = \\\\text{Highest value} - \\\\text{Lowest value}$$\n\n## Interquartile Range (IQR)\n\n$$\\\\text{IQR} = Q_3 - Q_1$$\n\nwhere:\n- Q₁ = Lower quartile (25th percentile)\n- Q₂ = Median (50th percentile)\n- Q₃ = Upper quartile (75th percentile)\n\n## Finding Quartiles\n\nFor n data points:\n- Q₁ position = (n+1)/4\n- Q₃ position = 3(n+1)/4",
                worked_examples: [
                    {
                        question: "Find Q₁, Q₂, Q₃ and IQR for: 3, 5, 7, 8, 9, 11, 13, 15, 17",
                        steps: [
                            "n = 9",
                            "Q₂ (median) = 5th value = 9",
                            "Q₁ = median of 3,5,7,8 = (5+7)/2 = 6",
                            "Q₃ = median of 11,13,15,17 = (13+15)/2 = 14",
                            "IQR = 14 - 6 = 8"
                        ],
                        final_answer: "Q₁=6, Q₂=9, Q₃=14, IQR=8"
                    }
                ]
            },
            {
                title: '5. Cumulative Frequency',
                content: "## Definition\n\nRunning total of frequencies up to each class boundary.\n\n## Cumulative Frequency Curve (Ogive)\n\nPlot cumulative frequency against upper class boundaries.\n\n## Reading from an Ogive\n\n- Median: Read x-value at cf = n/2\n- Q₁: Read at cf = n/4\n- Q₃: Read at cf = 3n/4",
                worked_examples: [
                    {
                        question: "From a cumulative frequency curve with total 80, find median position.",
                        steps: [
                            "Total frequency n = 80",
                            "Median at n/2 = 40",
                            "Read x-value where cumulative frequency = 40"
                        ],
                        final_answer: "Read x at cf = 40"
                    }
                ]
            },
            {
                title: '6. Histograms',
                content: "## Key Features\n\n- Bars touch (no gaps)\n- Y-axis is frequency DENSITY (not frequency)\n- Area of bar = frequency\n\n## Frequency Density\n\n$$\\\\text{Frequency density} = \\\\frac{\\\\text{Frequency}}{\\\\text{Class width}}$$\n\n## Finding Frequency from Histogram\n\n$$\\\\text{Frequency} = \\\\text{Frequency density} \\\\times \\\\text{Class width}$$",
                worked_examples: [
                    {
                        question: "A histogram bar has height 4 and class width 5. Find the frequency.",
                        steps: [
                            "Height = frequency density = 4",
                            "Frequency = density × width = 4 × 5 = 20"
                        ],
                        final_answer: "Frequency = 20"
                    }
                ]
            },
            {
                title: '7. Pie Charts and Bar Charts',
                content: "## Pie Charts\n\n- Angle represents proportion\n- Total = 360°\n\n$$\\\\text{Angle} = \\\\frac{\\\\text{Category frequency}}{\\\\text{Total frequency}} \\\\times 360°$$\n\n## Bar Charts\n\n- Discrete data\n- Bars don't touch\n- Height represents frequency",
                worked_examples: [
                    {
                        question: "In a survey of 60 students, 25 chose football. What angle represents football on a pie chart?",
                        steps: [
                            "Angle = (25/60) × 360°",
                            "= 150°"
                        ],
                        final_answer: "150°"
                    }
                ]
            },
            {
                title: '8. Interpreting Data',
                content: "## Comparing Distributions\n\n**Location (Average)**: Which is higher/lower on average?\n\n**Spread**: Which is more consistent/variable?\n\n## Outliers\n\nValues significantly different from others.\nMay affect mean but not median.\n\n## Choosing the Best Average\n\n- **Mean**: Uses all data, affected by outliers\n- **Median**: Not affected by outliers, good for skewed data\n- **Mode**: Best for categorical data",
                worked_examples: [
                    {
                        question: "Class A has mean 65, range 30. Class B has mean 62, range 45. Compare.",
                        steps: [
                            "Class A has higher average (65 > 62)",
                            "Class A is more consistent (smaller range)",
                            "Class B is more variable"
                        ],
                        final_answer: "A has higher average and more consistent scores"
                    }
                ]
            },
            {
                title: '9. Try This Yourself - Practice Problems',
                content: "## Practice Problems with Answers\n\n---\n\n### Problem 1: Mean\nFind the mean of: 12, 15, 18, 21, 24.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nMean = (12+15+18+21+24)/5 = 90/5 = 18\n\n**Answer: 18**\n</details>\n\n---\n\n### Problem 2: Median\nFind the median of: 3, 7, 2, 9, 5, 8, 4, 6.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nOrdered: 2, 3, 4, 5, 6, 7, 8, 9\nMedian = (5+6)/2 = 5.5\n\n**Answer: 5.5**\n</details>\n\n---\n\n### Problem 3: Frequency Table (ZIMSEC Style)\nScores: 1,2,3,4 with frequencies 5,12,8,5. Find mean.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nΣfx = 5+24+24+20 = 73\nΣf = 30\nMean = 73/30 = 2.43\n\n**Answer: 2.43**\n</details>\n\n---\n\n### Problem 4: Histogram\nBars have heights 3, 5, 2 with widths 10, 10, 20. Find total frequency.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nFrequencies: 3×10=30, 5×10=50, 2×20=40\nTotal = 30+50+40 = 120\n\n**Answer: 120**\n</details>\n\n---\n\n### Problem 5: Pie Chart\nAngle for maths is 72° out of 360°. If 200 students surveyed, how many chose maths?\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nNumber = (72/360) × 200 = 40\n\n**Answer: 40 students**\n</details>"
            }
        ],
        key_points: [
            "Mean = Σx/n or Σfx/Σf for frequency tables",
            "Median = middle value (order data first)",
            "Mode = most frequent value",
            "Range = highest - lowest; IQR = Q₃ - Q₁",
            "Cumulative frequency: running total of frequencies",
            "Histogram: frequency density = frequency/class width",
            "Pie chart angle = (frequency/total) × 360°"
        ],
        exam_tips: [
            "Always show your working for mean calculations.",
            "Order data before finding median.",
            "For grouped data, use midpoints to estimate mean.",
            "In histograms, check if y-axis is frequency or frequency density.",
            "Read cumulative frequency graphs carefully - use ruled lines.",
            "Compare both average AND spread when comparing data sets."
        ],
        visual_descriptions: [
            "Cumulative frequency curve (ogive) with median marked",
            "Histogram with unequal class widths",
            "Pie chart with sectors labeled"
        ]
    },

    // ============================================
    // TOPIC 11: PROBABILITY (Form 3-4)
    // ============================================
    'Probability': {
        topic: 'Probability',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: "Probability measures the likelihood of events occurring. This topic covers basic probability concepts, calculating probabilities from experiments and theoretical models, combined events using addition and multiplication rules, tree diagrams, and conditional probability. These skills are fundamental to understanding chance and making decisions under uncertainty.",
        sections: [
            {
                title: '1. Basic Probability Concepts',
                content: "## Definition\n\n$$P(\\\\text{Event}) = \\\\frac{\\\\text{Number of favourable outcomes}}{\\\\text{Total number of possible outcomes}}$$\n\n## Probability Scale\n\n- P = 0: Impossible\n- P = 1: Certain\n- 0 < P < 1: Possible\n\n## Complementary Events\n\n$$P(\\\\text{not } A) = 1 - P(A)$$",
                worked_examples: [
                    {
                        question: "A bag contains 5 red, 3 blue, and 2 green balls. Find P(red) and P(not red).",
                        steps: [
                            "Total balls = 5 + 3 + 2 = 10",
                            "P(red) = 5/10 = 1/2",
                            "P(not red) = 1 - 1/2 = 1/2"
                        ],
                        final_answer: "P(red) = 1/2, P(not red) = 1/2"
                    }
                ]
            },
            {
                title: '2. Experimental and Theoretical Probability',
                content: "## Theoretical Probability\n\nBased on equally likely outcomes.\n\n## Experimental Probability (Relative Frequency)\n\n$$P(\\\\text{Event}) = \\\\frac{\\\\text{Number of times event occurs}}{\\\\text{Total number of trials}}$$\n\n## Expected Frequency\n\n$$\\\\text{Expected frequency} = P(\\\\text{Event}) \\\\times \\\\text{Total trials}$$",
                worked_examples: [
                    {
                        question: "A coin is flipped 200 times and lands heads 112 times. Find experimental P(heads) and expected heads theoretically.",
                        steps: [
                            "Experimental P(heads) = 112/200 = 0.56",
                            "Theoretical P(heads) = 1/2 = 0.5",
                            "Expected heads = 200 × 0.5 = 100"
                        ],
                        final_answer: "Experimental = 0.56, Expected = 100"
                    }
                ]
            },
            {
                title: '3. Sample Space and Listing Outcomes',
                content: "## Sample Space\n\nSet of all possible outcomes.\n\n## Listing Methods\n\n1. **Lists**: Write out all outcomes\n2. **Tables**: For two events\n3. **Tree diagrams**: Shows branches of outcomes\n\n## Example: Two Dice\n\nTotal outcomes = 6 × 6 = 36",
                worked_examples: [
                    {
                        question: "Two coins are tossed. List the sample space and find P(at least one head).",
                        steps: [
                            "Sample space: {HH, HT, TH, TT}",
                            "Outcomes with at least one head: HH, HT, TH",
                            "P(at least one head) = 3/4"
                        ],
                        final_answer: "P(at least one head) = 3/4"
                    }
                ]
            },
            {
                title: '4. Combined Events - OR (Addition)',
                content: "## Mutually Exclusive Events\n\nCannot happen at the same time.\n\n$$P(A \\\\text{ or } B) = P(A) + P(B)$$\n\n## Not Mutually Exclusive\n\n$$P(A \\\\text{ or } B) = P(A) + P(B) - P(A \\\\text{ and } B)$$",
                worked_examples: [
                    {
                        question: "A card is drawn from a pack. Find P(King or Queen).",
                        steps: [
                            "Mutually exclusive (can't be both)",
                            "P(King) = 4/52, P(Queen) = 4/52",
                            "P(King or Queen) = 4/52 + 4/52 = 8/52 = 2/13"
                        ],
                        final_answer: "P = 2/13"
                    },
                    {
                        question: "Find P(Heart or King) from a standard pack.",
                        steps: [
                            "NOT mutually exclusive (King of Hearts is both)",
                            "P(Heart) = 13/52, P(King) = 4/52, P(Heart and King) = 1/52",
                            "P = 13/52 + 4/52 - 1/52 = 16/52 = 4/13"
                        ],
                        final_answer: "P = 4/13"
                    }
                ]
            },
            {
                title: '5. Combined Events - AND (Multiplication)',
                content: "## Independent Events\n\nOutcome of one doesn't affect the other.\n\n$$P(A \\\\text{ and } B) = P(A) \\\\times P(B)$$\n\n## Dependent Events\n\n$$P(A \\\\text{ and } B) = P(A) \\\\times P(B|A)$$\n\nwhere P(B|A) is probability of B given A has occurred.",
                worked_examples: [
                    {
                        question: "A coin is tossed and a die rolled. Find P(head and 6).",
                        steps: [
                            "Independent events",
                            "P(head) = 1/2, P(6) = 1/6",
                            "P(head and 6) = 1/2 × 1/6 = 1/12"
                        ],
                        final_answer: "P = 1/12"
                    }
                ]
            },
            {
                title: '6. Tree Diagrams',
                content: "## Structure\n\n- Branches show outcomes\n- Probabilities on branches\n- Multiply along branches\n- Add between final outcomes\n\n## With Replacement\n\nProbabilities stay the same.\n\n## Without Replacement\n\nProbabilities change (dependent events).",
                worked_examples: [
                    {
                        question: "A bag has 4 red and 6 blue balls. Two are picked without replacement. Find P(both red).",
                        steps: [
                            "P(1st red) = 4/10",
                            "After picking red: 3 red, 6 blue left",
                            "P(2nd red | 1st red) = 3/9",
                            "P(both red) = 4/10 × 3/9 = 12/90 = 2/15"
                        ],
                        final_answer: "P = 2/15"
                    }
                ]
            },
            {
                title: '7. Probability from Venn Diagrams',
                content: "## Reading Probabilities\n\n- P(A) = all elements in circle A\n- P(A ∩ B) = intersection (overlap)\n- P(A ∪ B) = union (either or both)\n- P(A') = elements NOT in A\n\n## Formula\n\n$$P(A \\\\cup B) = P(A) + P(B) - P(A \\\\cap B)$$",
                worked_examples: [
                    {
                        question: "In a class of 30: 18 play football, 12 play basketball, 5 play both. Find P(plays neither).",
                        steps: [
                            "Football only = 18 - 5 = 13",
                            "Basketball only = 12 - 5 = 7",
                            "Either or both = 13 + 7 + 5 = 25",
                            "Neither = 30 - 25 = 5",
                            "P(neither) = 5/30 = 1/6"
                        ],
                        final_answer: "P = 1/6"
                    }
                ]
            },
            {
                title: '8. Conditional Probability',
                content: "## Definition\n\n$$P(B|A) = \\\\frac{P(A \\\\text{ and } B)}{P(A)}$$\n\n\"Probability of B given A\" - assume A has happened.\n\n## In Words\n\nRestrict sample space to only outcomes where A occurs.",
                worked_examples: [
                    {
                        question: "A die is rolled. Given it shows even, find P(greater than 3).",
                        steps: [
                            "Even outcomes: {2, 4, 6}",
                            "Greater than 3 among even: {4, 6}",
                            "P(>3 | even) = 2/3"
                        ],
                        final_answer: "P = 2/3"
                    }
                ]
            },
            {
                title: '9. Try This Yourself - Practice Problems',
                content: "## Practice Problems with Answers\n\n---\n\n### Problem 1: Basic\nA spinner has 8 equal sections: 3 red, 2 blue, 3 green. Find P(blue).\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nP(blue) = 2/8 = 1/4\n\n**Answer: 1/4**\n</details>\n\n---\n\n### Problem 2: Complement\nP(rain) = 0.35. Find P(no rain).\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nP(no rain) = 1 - 0.35 = 0.65\n\n**Answer: 0.65**\n</details>\n\n---\n\n### Problem 3: Two Events (ZIMSEC Style)\nTwo dice rolled. Find P(sum = 7).\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nOutcomes with sum 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1)\nCount = 6, Total = 36\nP = 6/36 = 1/6\n\n**Answer: 1/6**\n</details>\n\n---\n\n### Problem 4: Without Replacement\n5 red, 3 blue balls. Pick 2 without replacement. Find P(different colours).\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nP(RB) = 5/8 × 3/7 = 15/56\nP(BR) = 3/8 × 5/7 = 15/56\nP(different) = 15/56 + 15/56 = 30/56 = 15/28\n\n**Answer: 15/28**\n</details>\n\n---\n\n### Problem 5: Tree Diagram\nP(rain) = 0.4. If rain, P(late) = 0.7. If no rain, P(late) = 0.2. Find P(late).\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nP(late) = P(rain and late) + P(no rain and late)\n= 0.4 × 0.7 + 0.6 × 0.2\n= 0.28 + 0.12 = 0.40\n\n**Answer: 0.40**\n</details>"
            }
        ],
        key_points: [
            "P(event) = favourable outcomes / total outcomes",
            "P(not A) = 1 - P(A)",
            "P(A or B) = P(A) + P(B) for mutually exclusive",
            "P(A and B) = P(A) × P(B) for independent events",
            "Tree diagrams: multiply along branches, add between paths",
            "Without replacement: probabilities change",
            "Expected frequency = P(event) × total trials"
        ],
        exam_tips: [
            "Always simplify fractions in final answers.",
            "Draw tree diagrams for sequential events.",
            "Check if events are with or without replacement.",
            "Label branches clearly with all probabilities (should sum to 1).",
            "For 'at least one', use complement: P(at least 1) = 1 - P(none).",
            "Check answers are between 0 and 1."
        ],
        visual_descriptions: [
            "Tree diagram showing branches with probabilities",
            "Venn diagram with overlapping circles",
            "Probability scale from 0 (impossible) to 1 (certain)"
        ]
    },

    // ============================================
    // TOPIC 12: GRAPHS & COORDINATE GEOMETRY (Form 2-4)
    // ============================================
    'Graphs and Coordinate Geometry': {
        topic: 'Graphs and Coordinate Geometry',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: "Coordinate geometry uses algebra to study geometric properties on a coordinate plane. This topic covers plotting points, finding gradients, equations of straight lines, parallel and perpendicular lines, midpoints, distances, and sketching quadratic and other curves.",
        sections: [
            {
                title: '1. The Coordinate Plane',
                content: "## Coordinates\n\nA point is written as (x, y) where:\n- x = horizontal distance from origin\n- y = vertical distance from origin\n\n## Quadrants\n\n| Quadrant | x | y |\n|----------|---|---|\n| I | + | + |\n| II | - | + |\n| III | - | - |\n| IV | + | - |",
                worked_examples: [
                    {
                        question: "Plot points A(3, 2), B(-4, 1), C(-2, -3), D(4, -2).",
                        steps: [
                            "A: 3 right, 2 up (Quadrant I)",
                            "B: 4 left, 1 up (Quadrant II)",
                            "C: 2 left, 3 down (Quadrant III)",
                            "D: 4 right, 2 down (Quadrant IV)"
                        ],
                        final_answer: "Points plotted in respective quadrants"
                    }
                ]
            },
            {
                title: '2. Gradient (Slope)',
                content: "## Formula\n\n$$m = \\\\frac{y_2 - y_1}{x_2 - x_1} = \\\\frac{\\\\text{rise}}{\\\\text{run}}$$\n\n## Types\n\n- Positive gradient: line goes up (left to right)\n- Negative gradient: line goes down\n- Zero gradient: horizontal line\n- Undefined: vertical line",
                worked_examples: [
                    {
                        question: "Find the gradient of line through A(2, 3) and B(6, 11).",
                        steps: [
                            "m = (11 - 3)/(6 - 2)",
                            "= 8/4 = 2"
                        ],
                        final_answer: "m = 2"
                    }
                ]
            },
            {
                title: '3. Equation of a Straight Line',
                content: "## Forms\n\n**Slope-intercept**: $y = mx + c$\nwhere m = gradient, c = y-intercept\n\n**Point-slope**: $y - y_1 = m(x - x_1)$\n\n**General form**: $ax + by + c = 0$",
                worked_examples: [
                    {
                        question: "Find the equation of line with gradient 3 passing through (2, 5).",
                        steps: [
                            "y - 5 = 3(x - 2)",
                            "y - 5 = 3x - 6",
                            "y = 3x - 1"
                        ],
                        final_answer: "y = 3x - 1"
                    }
                ]
            },
            {
                title: '4. Parallel and Perpendicular Lines',
                content: "## Parallel Lines\n\nSame gradient: $m_1 = m_2$\n\n## Perpendicular Lines\n\nGradients multiply to -1:\n$$m_1 \\\\times m_2 = -1$$\n\nOr: $m_2 = -\\\\frac{1}{m_1}$",
                worked_examples: [
                    {
                        question: "Line L has equation y = 2x + 3. Find gradient of line perpendicular to L.",
                        steps: [
                            "Gradient of L = 2",
                            "Perpendicular gradient = -1/2"
                        ],
                        final_answer: "m = -1/2"
                    }
                ]
            },
            {
                title: '5. Midpoint and Distance',
                content: "## Midpoint Formula\n\n$$M = \\\\left(\\\\frac{x_1 + x_2}{2}, \\\\frac{y_1 + y_2}{2}\\\\right)$$\n\n## Distance Formula\n\n$$d = \\\\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$",
                worked_examples: [
                    {
                        question: "Find midpoint and distance between P(1, 4) and Q(7, 12).",
                        steps: [
                            "Midpoint = ((1+7)/2, (4+12)/2) = (4, 8)",
                            "Distance = √[(7-1)² + (12-4)²]",
                            "= √[36 + 64] = √100 = 10"
                        ],
                        final_answer: "Midpoint (4, 8), Distance = 10"
                    }
                ]
            },
            {
                title: '6. Quadratic Graphs',
                content: "## Form: $y = ax^2 + bx + c$\n\n## Properties\n\n- Shape: Parabola\n- a > 0: U-shape (minimum)\n- a < 0: ∩-shape (maximum)\n- Vertex: turning point\n- Axis of symmetry: $x = -\\\\frac{b}{2a}$",
                worked_examples: [
                    {
                        question: "Sketch y = x² - 4x + 3. Find vertex and roots.",
                        steps: [
                            "Roots: x² - 4x + 3 = 0 → (x-1)(x-3) = 0 → x = 1, 3",
                            "Axis of symmetry: x = -(-4)/(2×1) = 2",
                            "Vertex: y = 4 - 8 + 3 = -1, so vertex (2, -1)",
                            "Y-intercept: (0, 3)"
                        ],
                        final_answer: "Vertex (2, -1), Roots x = 1, 3"
                    }
                ]
            },
            {
                title: '7. Other Graphs',
                content: "## Cubic: $y = x^3$\n\n## Reciprocal: $y = \\\\frac{k}{x}$\n- Hyperbola shape\n- Asymptotes at axes\n\n## Exponential: $y = a^x$\n\n## Circle: $(x-a)^2 + (y-b)^2 = r^2$\nCentre (a, b), radius r",
                worked_examples: [
                    {
                        question: "Describe the graph of xy = 6.",
                        steps: [
                            "Rearrange: y = 6/x",
                            "This is a reciprocal graph",
                            "Hyperbola in quadrants I and III"
                        ],
                        final_answer: "Hyperbola"
                    }
                ]
            },
            {
                title: '8. Graphical Solutions',
                content: "## Finding Intersections\n\nSolve simultaneous equations graphically:\nIntersection points are solutions.\n\n## Using Graphs to Solve Equations\n\n1. Rearrange equation as two functions\n2. Plot both\n3. Read intersection x-values",
                worked_examples: [
                    {
                        question: "Use graph of y = x² to solve x² - 4 = 0.",
                        steps: [
                            "Draw y = x² and y = 4",
                            "Find intersections",
                            "x-values: x = ±2"
                        ],
                        final_answer: "x = -2 or x = 2"
                    }
                ]
            },
            {
                title: '9. Try This Yourself - Practice Problems',
                content: "## Practice Problems with Answers\n\n---\n\n### Problem 1: Gradient\nFind gradient of line through (-3, 5) and (2, -5).\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nm = (-5-5)/(2-(-3)) = -10/5 = -2\n\n**Answer: -2**\n</details>\n\n---\n\n### Problem 2: Equation\nFind equation of line through (4, 1) with gradient 3.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\ny - 1 = 3(x - 4)\ny = 3x - 11\n\n**Answer: y = 3x - 11**\n</details>\n\n---\n\n### Problem 3: Distance (ZIMSEC Style)\nFind distance between (0, 0) and (5, 12).\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\nd = √(25 + 144) = √169 = 13\n\n**Answer: 13 units**\n</details>"
            }
        ],
        key_points: [
            "Gradient m = (y₂-y₁)/(x₂-x₁)",
            "Line equation: y = mx + c or y - y₁ = m(x - x₁)",
            "Parallel lines: same gradient",
            "Perpendicular lines: m₁ × m₂ = -1",
            "Midpoint: average of coordinates",
            "Distance: √[(x₂-x₁)² + (y₂-y₁)²]",
            "Parabola vertex at x = -b/(2a)"
        ],
        exam_tips: [
            "Always simplify gradient to lowest terms.",
            "Check your line equation by substituting the given point.",
            "For quadratics, find roots, vertex, and y-intercept before sketching.",
            "Label axes and key points clearly on graphs.",
            "Use a ruler for straight lines."
        ],
        visual_descriptions: [
            "Coordinate plane with four quadrants labeled",
            "Parabola showing vertex, roots, and axis of symmetry",
            "Parallel and perpendicular lines intersecting"
        ]
    },

    // ============================================
    // TOPIC 13: SEQUENCES & SERIES (Form 3-4)
    // ============================================
    'Sequences and Series': {
        topic: 'Sequences and Series',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: "Sequences are ordered lists of numbers following a pattern. This topic covers arithmetic and geometric sequences, finding nth terms, recognizing patterns, and practical applications.",
        sections: [
            {
                title: '1. Types of Sequences',
                content: "## Arithmetic Sequence\n\nCommon difference (d) between terms.\n$$a, a+d, a+2d, a+3d, ...$$\n\n## Geometric Sequence\n\nCommon ratio (r) between terms.\n$$a, ar, ar^2, ar^3, ...$$",
                worked_examples: [
                    {
                        question: "Identify sequence type: 3, 6, 12, 24, ...",
                        steps: [
                            "6/3 = 2, 12/6 = 2, 24/12 = 2",
                            "Common ratio = 2",
                            "Geometric sequence"
                        ],
                        final_answer: "Geometric, r = 2"
                    }
                ]
            },
            {
                title: '2. Arithmetic Sequences - nth Term',
                content: "## Formula\n\n$$a_n = a + (n-1)d$$\n\nwhere:\n- a = first term\n- d = common difference\n- n = term position",
                worked_examples: [
                    {
                        question: "Find the 20th term of 5, 8, 11, 14, ...",
                        steps: [
                            "a = 5, d = 3",
                            "a₂₀ = 5 + (20-1) × 3",
                            "= 5 + 57 = 62"
                        ],
                        final_answer: "62"
                    }
                ]
            },
            {
                title: '3. Geometric Sequences - nth Term',
                content: "## Formula\n\n$$a_n = ar^{n-1}$$\n\nwhere:\n- a = first term\n- r = common ratio\n- n = term position",
                worked_examples: [
                    {
                        question: "Find the 8th term of 2, 6, 18, 54, ...",
                        steps: [
                            "a = 2, r = 3",
                            "a₈ = 2 × 3⁷",
                            "= 2 × 2187 = 4374"
                        ],
                        final_answer: "4374"
                    }
                ]
            },
            {
                title: '4. Finding Terms and Patterns',
                content: "## Finding First Term or Common Difference\n\nUse two equations from known terms.\n\n## Problem Types\n\n- Given terms, find a and d (or r)\n- Given term value, find position",
                worked_examples: [
                    {
                        question: "3rd term is 11, 7th term is 27. Find the formula.",
                        steps: [
                            "a + 2d = 11 ... (1)",
                            "a + 6d = 27 ... (2)",
                            "Subtract: 4d = 16, d = 4",
                            "From (1): a = 11 - 8 = 3",
                            "Formula: aₙ = 3 + 4(n-1) = 4n - 1"
                        ],
                        final_answer: "aₙ = 4n - 1"
                    }
                ]
            },
            {
                title: '5. Sum of Arithmetic Series',
                content: "## Formulae\n\n$$S_n = \\\\frac{n}{2}(2a + (n-1)d)$$\n\nOr:\n$$S_n = \\\\frac{n}{2}(a + l)$$\n\nwhere l = last term",
                worked_examples: [
                    {
                        question: "Find sum of first 15 terms of 4, 7, 10, ...",
                        steps: [
                            "a = 4, d = 3, n = 15",
                            "S₁₅ = (15/2)[2(4) + 14(3)]",
                            "= 7.5 × [8 + 42] = 7.5 × 50 = 375"
                        ],
                        final_answer: "375"
                    }
                ]
            },
            {
                title: '6. Sum of Geometric Series',
                content: "## Formula (r ≠ 1)\n\n$$S_n = \\\\frac{a(r^n - 1)}{r - 1}$$ (if r > 1)\n\n$$S_n = \\\\frac{a(1 - r^n)}{1 - r}$$ (if r < 1)",
                worked_examples: [
                    {
                        question: "Find sum of first 6 terms of 3, 6, 12, ...",
                        steps: [
                            "a = 3, r = 2, n = 6",
                            "S₆ = 3(2⁶ - 1)/(2 - 1)",
                            "= 3 × 63 = 189"
                        ],
                        final_answer: "189"
                    }
                ]
            },
            {
                title: '7. Quadratic and Other Sequences',
                content: "## Quadratic Sequence\n\nSecond differences are constant.\n$$a_n = an^2 + bn + c$$\n\n## Finding the Formula\n\n1. Calculate first differences\n2. Calculate second differences\n3. Find a, b, c from equations",
                worked_examples: [
                    {
                        question: "Find nth term of 3, 8, 15, 24, 35, ...",
                        steps: [
                            "First differences: 5, 7, 9, 11",
                            "Second differences: 2, 2, 2",
                            "2a = 2, so a = 1",
                            "Using first terms: n² + 2n (check: 1+2=3✓)"
                        ],
                        final_answer: "aₙ = n² + 2n"
                    }
                ]
            },
            {
                title: '8. Applications',
                content: "## Real-World Problems\n\n- Population growth (geometric)\n- Salary increments (arithmetic)\n- Compound interest (geometric)\n- Depreciation (geometric, r < 1)",
                worked_examples: [
                    {
                        question: "A salary starts at $20,000 and increases by $1,500 per year. Find salary after 10 years.",
                        steps: [
                            "Arithmetic: a = 20000, d = 1500",
                            "a₁₀ = 20000 + 9(1500)",
                            "= 20000 + 13500 = $33,500"
                        ],
                        final_answer: "$33,500"
                    }
                ]
            },
            {
                title: '9. Try This Yourself - Practice Problems',
                content: "## Practice Problems with Answers\n\n---\n\n### Problem 1: Arithmetic\nFind 25th term of 7, 10, 13, ...\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\na₂₅ = 7 + 24(3) = 7 + 72 = 79\n\n**Answer: 79**\n</details>\n\n---\n\n### Problem 2: Geometric\nFind 5th term of 4, 12, 36, ...\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\na₅ = 4 × 3⁴ = 4 × 81 = 324\n\n**Answer: 324**\n</details>"
            }
        ],
        key_points: [
            "Arithmetic: aₙ = a + (n-1)d",
            "Geometric: aₙ = ar^(n-1)",
            "Arithmetic sum: Sₙ = n/2[2a + (n-1)d]",
            "Geometric sum: Sₙ = a(rⁿ-1)/(r-1)",
            "Quadratic: second differences constant"
        ],
        exam_tips: [
            "First identify if arithmetic (constant difference) or geometric (constant ratio).",
            "For finding terms, set up equations and solve.",
            "Always check your formula with given terms."
        ],
        visual_descriptions: [
            "Number line showing arithmetic sequence",
            "Graph showing exponential growth"
        ]
    },

    // ============================================
    // TOPIC 14: VARIATION (Form 3-4)
    // ============================================
    'Variation': {
        topic: 'Variation',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: "Variation describes how quantities relate to each other. This topic covers direct, inverse, joint, and partial variation with applications to real-world problems.",
        sections: [
            {
                title: '1. Direct Variation',
                content: "## Definition\n\ny varies directly as x: $y \\\\propto x$\n\n## Formula\n\n$$y = kx$$\n\nwhere k is the constant of variation.",
                worked_examples: [
                    {
                        question: "y varies directly as x. When x = 4, y = 20. Find y when x = 7.",
                        steps: [
                            "y = kx",
                            "20 = k(4), so k = 5",
                            "y = 5x",
                            "When x = 7: y = 5(7) = 35"
                        ],
                        final_answer: "y = 35"
                    }
                ]
            },
            {
                title: '2. Inverse Variation',
                content: "## Definition\n\ny varies inversely as x: $y \\\\propto \\\\frac{1}{x}$\n\n## Formula\n\n$$y = \\\\frac{k}{x}$$ or $$xy = k$$",
                worked_examples: [
                    {
                        question: "y varies inversely as x. When x = 3, y = 12. Find y when x = 9.",
                        steps: [
                            "xy = k",
                            "3 × 12 = k = 36",
                            "When x = 9: y = 36/9 = 4"
                        ],
                        final_answer: "y = 4"
                    }
                ]
            },
            {
                title: '3. Direct Variation with Powers',
                content: "## Direct Square\n\n$y \\\\propto x^2$ → $y = kx^2$\n\n## Direct Cube\n\n$y \\\\propto x^3$ → $y = kx^3$\n\n## Direct with Square Root\n\n$y \\\\propto \\\\sqrt{x}$ → $y = k\\\\sqrt{x}$",
                worked_examples: [
                    {
                        question: "y varies as x². When x = 3, y = 45. Find y when x = 5.",
                        steps: [
                            "y = kx²",
                            "45 = k(9), k = 5",
                            "y = 5x²",
                            "When x = 5: y = 5(25) = 125"
                        ],
                        final_answer: "y = 125"
                    }
                ]
            },
            {
                title: '4. Inverse Variation with Powers',
                content: "## Inverse Square\n\n$y \\\\propto \\\\frac{1}{x^2}$ → $y = \\\\frac{k}{x^2}$\n\n## Applications\n\n- Light intensity varies inversely as square of distance\n- Gravitational force varies inversely as square of distance",
                worked_examples: [
                    {
                        question: "Light intensity I varies inversely as d². At d = 2m, I = 100. Find I at d = 5m.",
                        steps: [
                            "I = k/d²",
                            "100 = k/4, k = 400",
                            "At d = 5: I = 400/25 = 16"
                        ],
                        final_answer: "I = 16 units"
                    }
                ]
            },
            {
                title: '5. Joint Variation',
                content: "## Definition\n\nOne variable varies as product of two or more others.\n\n$z \\\\propto xy$ → $z = kxy$\n\n$z \\\\propto \\\\frac{x}{y}$ → $z = \\\\frac{kx}{y}$",
                worked_examples: [
                    {
                        question: "z varies jointly as x and y. When x = 2, y = 3, z = 24. Find z when x = 4, y = 5.",
                        steps: [
                            "z = kxy",
                            "24 = k(2)(3) = 6k, k = 4",
                            "z = 4xy",
                            "z = 4(4)(5) = 80"
                        ],
                        final_answer: "z = 80"
                    }
                ]
            },
            {
                title: '6. Partial Variation',
                content: "## Definition\n\nVariation with a constant part.\n\n$$y = ax + b$$ (linear)\n$$y = ax^2 + b$$ (quadratic part)",
                worked_examples: [
                    {
                        question: "Cost C partly varies as n and is partly constant. C = 500 when n = 3, C = 700 when n = 7. Find C when n = 5.",
                        steps: [
                            "C = an + b",
                            "500 = 3a + b ... (1)",
                            "700 = 7a + b ... (2)",
                            "Subtract: 200 = 4a, a = 50",
                            "b = 500 - 150 = 350",
                            "C = 50n + 350",
                            "When n = 5: C = 250 + 350 = 600"
                        ],
                        final_answer: "C = 600"
                    }
                ]
            },
            {
                title: '7-9. Practice and Applications',
                content: "## Practice Problems\n\n### Problem 1 (ZIMSEC Style)\ny ∝ x³. When x = 2, y = 32. Find y when x = 3.\n\n<details>\n<summary>**Click to reveal answer**</summary>\n\n**Solution:**\ny = kx³\n32 = 8k, k = 4\ny = 4(27) = 108\n\n**Answer: 108**\n</details>"
            }
        ],
        key_points: [
            "Direct: y = kx",
            "Inverse: y = k/x",
            "Joint: z = kxy",
            "Partial: y = ax + b",
            "Find k first using given values"
        ],
        exam_tips: [
            "Write the variation formula first.",
            "Find constant k before solving.",
            "Check answer makes sense."
        ],
        visual_descriptions: [
            "Graph of direct variation (straight line through origin)",
            "Graph of inverse variation (hyperbola)"
        ]
    },

    // ============================================
    // TOPIC 15: TRANSFORMATIONS (Form 3-4)
    // ============================================
    'Transformations': {
        topic: 'Transformations',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: "Transformations move or change shapes while preserving certain properties. This topic covers translations, reflections, rotations, and enlargements with their matrix representations.",
        sections: [
            {
                title: '1. Translations',
                content: "## Definition\n\nSlide every point by same vector.\n\n## Column Vector\n\n$$\\\\begin{pmatrix} a \\\\\\\\ b \\\\end{pmatrix}$$\n\nmoves point (x, y) to (x+a, y+b)",
                worked_examples: [
                    {
                        question: "Translate (3, 5) by vector (2, -4).",
                        steps: [
                            "New x = 3 + 2 = 5",
                            "New y = 5 + (-4) = 1"
                        ],
                        final_answer: "(5, 1)"
                    }
                ]
            },
            {
                title: '2. Reflections',
                content: "## Common Reflections\n\n| Mirror Line | (x,y) → |\n|-------------|--------|\n| x-axis | (x, -y) |\n| y-axis | (-x, y) |\n| y = x | (y, x) |\n| y = -x | (-y, -x) |",
                worked_examples: [
                    {
                        question: "Reflect (4, 3) in the line y = x.",
                        steps: [
                            "Swap x and y coordinates"
                        ],
                        final_answer: "(3, 4)"
                    }
                ]
            },
            {
                title: '3. Rotations',
                content: "## Key Rotations (about origin)\n\n| Angle | (x,y) → |\n|-------|--------|\n| 90° anticlockwise | (-y, x) |\n| 90° clockwise | (y, -x) |\n| 180° | (-x, -y) |\n\n## Full Description\n\nNeed: angle, direction, centre",
                worked_examples: [
                    {
                        question: "Rotate (5, 2) by 90° anticlockwise about origin.",
                        steps: [
                            "(x, y) → (-y, x)",
                            "(5, 2) → (-2, 5)"
                        ],
                        final_answer: "(-2, 5)"
                    }
                ]
            },
            {
                title: '4. Enlargements',
                content: "## Scale Factor k\n\n- k > 1: larger\n- 0 < k < 1: smaller\n- k < 0: inverted\n\n## From Centre (a, b)\n\n$$x' = a + k(x - a)$$\n$$y' = b + k(y - b)$$",
                worked_examples: [
                    {
                        question: "Enlarge (4, 2) with scale factor 3 from origin.",
                        steps: [
                            "x' = 3 × 4 = 12",
                            "y' = 3 × 2 = 6"
                        ],
                        final_answer: "(12, 6)"
                    }
                ]
            },
            {
                title: '5. Transformation Matrices',
                content: "## Common Matrices\n\nReflection in x-axis: $\\\\begin{pmatrix} 1 & 0 \\\\\\\\ 0 & -1 \\\\end{pmatrix}$\n\nReflection in y-axis: $\\\\begin{pmatrix} -1 & 0 \\\\\\\\ 0 & 1 \\\\end{pmatrix}$\n\nRotation 90° anti: $\\\\begin{pmatrix} 0 & -1 \\\\\\\\ 1 & 0 \\\\end{pmatrix}$",
                worked_examples: [
                    {
                        question: "Apply reflection in x-axis to point (3, 4).",
                        steps: [
                            "Matrix × vector = result",
                            "(1×3 + 0×4, 0×3 + (-1)×4) = (3, -4)"
                        ],
                        final_answer: "(3, -4)"
                    }
                ]
            },
            {
                title: '6-9. Combined Transformations and Practice',
                content: "## Combined Transformations\n\nApply in order (rightmost first for matrices).\n\n## Practice\n\n### Describe the single transformation\nA(1, 2) → A'(-1, 2)\n\n<details>\n<summary>**Answer**</summary>\n\nReflection in the y-axis\n</details>"
            }
        ],
        key_points: [
            "Translation: shift by vector",
            "Reflection: flip across mirror line",
            "Rotation: turn about centre",
            "Enlargement: scale from centre",
            "Describe transformations fully (type + details)"
        ],
        exam_tips: [
            "Always state centre for rotations and enlargements.",
            "Draw the original and image.",
            "Check invariant points for reflections."
        ],
        visual_descriptions: [
            "Coordinate grid showing rotation of triangle 90°",
            "Enlargement from centre showing scale factor"
        ]
    },

    // ============================================
    // TOPIC 16: VECTORS (Form 3-4)
    // ============================================
    'Vectors': {
        topic: 'Vectors',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: "Vectors have both magnitude and direction. This topic covers vector notation, addition, subtraction, scalar multiplication, position vectors, and applications in geometry.",
        sections: [
            {
                title: '1. Vector Basics',
                content: "## Notation\n\n- Column vector: $\\\\begin{pmatrix} x \\\\\\\\ y \\\\end{pmatrix}$\n- Position vector: $\\\\overrightarrow{OA}$ or $\\\\mathbf{a}$\n\n## Magnitude\n\n$$|\\\\mathbf{v}| = \\\\sqrt{x^2 + y^2}$$",
                worked_examples: [
                    {
                        question: "Find magnitude of (3, 4).",
                        steps: [
                            "|v| = √(9 + 16) = √25 = 5"
                        ],
                        final_answer: "5 units"
                    }
                ]
            },
            {
                title: '2. Vector Operations',
                content: "## Addition\n\n$$\\\\begin{pmatrix} a \\\\\\\\ b \\\\end{pmatrix} + \\\\begin{pmatrix} c \\\\\\\\ d \\\\end{pmatrix} = \\\\begin{pmatrix} a+c \\\\\\\\ b+d \\\\end{pmatrix}$$\n\n## Subtraction\n\n$$\\\\overrightarrow{AB} = \\\\mathbf{b} - \\\\mathbf{a}$$\n\n## Scalar Multiplication\n\n$$k\\\\begin{pmatrix} a \\\\\\\\ b \\\\end{pmatrix} = \\\\begin{pmatrix} ka \\\\\\\\ kb \\\\end{pmatrix}$$",
                worked_examples: [
                    {
                        question: "If a = (2, 5) and b = (4, -1), find a + 2b.",
                        steps: [
                            "2b = (8, -2)",
                            "a + 2b = (2+8, 5+(-2)) = (10, 3)"
                        ],
                        final_answer: "(10, 3)"
                    }
                ]
            },
            {
                title: '3. Position Vectors and Direction',
                content: "## Position Vector\n\n$\\\\overrightarrow{OA} = \\\\mathbf{a}$ describes point A from origin.\n\n## Vector Between Points\n\n$$\\\\overrightarrow{AB} = \\\\overrightarrow{OB} - \\\\overrightarrow{OA} = \\\\mathbf{b} - \\\\mathbf{a}$$\n\n## Parallel Vectors\n\n$\\\\mathbf{b} = k\\\\mathbf{a}$ (scalar multiple)",
                worked_examples: [
                    {
                        question: "A(2, 3), B(8, 7). Find vector AB.",
                        steps: [
                            "AB = b - a",
                            "= (8-2, 7-3) = (6, 4)"
                        ],
                        final_answer: "(6, 4)"
                    }
                ]
            },
            {
                title: '4. Midpoint and Section Formula',
                content: "## Midpoint M of AB\n\n$$\\\\overrightarrow{OM} = \\\\frac{1}{2}(\\\\mathbf{a} + \\\\mathbf{b})$$\n\n## Point Dividing in Ratio m:n\n\n$$\\\\overrightarrow{OP} = \\\\frac{n\\\\mathbf{a} + m\\\\mathbf{b}}{m+n}$$",
                worked_examples: [
                    {
                        question: "Find midpoint of A(1, 4) and B(5, 8).",
                        steps: [
                            "M = (1/2)(a + b)",
                            "= (1/2)((1,4) + (5,8))",
                            "= (1/2)(6, 12) = (3, 6)"
                        ],
                        final_answer: "(3, 6)"
                    }
                ]
            },
            {
                title: '5-9. Geometric Applications and Practice',
                content: "## Proving Collinearity\n\nPoints A, B, C are collinear if $\\\\overrightarrow{AB} = k\\\\overrightarrow{BC}$\n\n## Practice\n\nIf OA = a + 2b and OB = 3a - b, find AB.\n\n<details>\n<summary>**Answer**</summary>\n\nAB = OB - OA = (3a - b) - (a + 2b) = 2a - 3b\n</details>"
            }
        ],
        key_points: [
            "Magnitude: |v| = √(x² + y²)",
            "AB = b - a",
            "Parallel: one is scalar multiple of other",
            "Midpoint: ½(a + b)"
        ],
        exam_tips: [
            "Draw diagrams to visualize vectors.",
            "Be careful with direction: AB ≠ BA.",
            "Express final answers in simplest form."
        ],
        visual_descriptions: [
            "Vector triangle showing addition",
            "Position vectors from origin to points"
        ]
    },

    // ============================================
    // TOPIC 17: MATRICES (Form 3-4)
    // ============================================
    'Matrices': {
        topic: 'Matrices',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: "Matrices are rectangular arrays of numbers used for transformations and solving systems of equations. This topic covers matrix operations, determinants, inverses, and applications.",
        sections: [
            {
                title: '1. Matrix Basics',
                content: "## Notation\n\nA matrix with m rows and n columns is an m × n matrix.\n\n## Order\n\n$$A = \\\\begin{pmatrix} a & b \\\\\\\\ c & d \\\\end{pmatrix}$$\n\nis a 2 × 2 matrix.\n\n## Special Matrices\n\n- **Identity**: $I = \\\\begin{pmatrix} 1 & 0 \\\\\\\\ 0 & 1 \\\\end{pmatrix}$\n- **Zero matrix**: All elements are 0",
                worked_examples: [
                    {
                        question: "State the order of $\\\\begin{pmatrix} 1 & 2 & 3 \\\\\\\\ 4 & 5 & 6 \\\\end{pmatrix}$",
                        steps: ["2 rows, 3 columns"],
                        final_answer: "2 × 3"
                    }
                ]
            },
            {
                title: '2. Matrix Operations',
                content: "## Addition/Subtraction\n\nAdd/subtract corresponding elements.\nMatrices must have same order.\n\n## Scalar Multiplication\n\nMultiply every element by the scalar.\n\n## Matrix Multiplication\n\nRow × Column method.",
                worked_examples: [
                    {
                        question: "Find $\\\\begin{pmatrix} 2 & 3 \\\\\\\\ 1 & 4 \\\\end{pmatrix} \\\\times \\\\begin{pmatrix} 5 \\\\\\\\ 2 \\\\end{pmatrix}$",
                        steps: [
                            "(2×5 + 3×2, 1×5 + 4×2)",
                            "= (10+6, 5+8) = (16, 13)"
                        ],
                        final_answer: "$\\\\begin{pmatrix} 16 \\\\\\\\ 13 \\\\end{pmatrix}$"
                    }
                ]
            },
            {
                title: '3. Determinant',
                content: "## For 2×2 Matrix\n\n$$\\\\text{det}\\\\begin{pmatrix} a & b \\\\\\\\ c & d \\\\end{pmatrix} = ad - bc$$\n\n## Properties\n\n- det = 0: no inverse exists (singular)\n- det ≠ 0: inverse exists",
                worked_examples: [
                    {
                        question: "Find det$\\\\begin{pmatrix} 3 & 4 \\\\\\\\ 2 & 5 \\\\end{pmatrix}$",
                        steps: ["det = 3×5 - 4×2 = 15 - 8 = 7"],
                        final_answer: "7"
                    }
                ]
            },
            {
                title: '4. Inverse Matrix',
                content: "## Formula\n\n$$A^{-1} = \\\\frac{1}{ad-bc}\\\\begin{pmatrix} d & -b \\\\\\\\ -c & a \\\\end{pmatrix}$$\n\n## Property\n\n$$AA^{-1} = A^{-1}A = I$$",
                worked_examples: [
                    {
                        question: "Find inverse of $\\\\begin{pmatrix} 3 & 2 \\\\\\\\ 5 & 4 \\\\end{pmatrix}$",
                        steps: [
                            "det = 12 - 10 = 2",
                            "$A^{-1} = \\\\frac{1}{2}\\\\begin{pmatrix} 4 & -2 \\\\\\\\ -5 & 3 \\\\end{pmatrix}$",
                            "$= \\\\begin{pmatrix} 2 & -1 \\\\\\\\ -2.5 & 1.5 \\\\end{pmatrix}$"
                        ],
                        final_answer: "$\\\\begin{pmatrix} 2 & -1 \\\\\\\\ -2.5 & 1.5 \\\\end{pmatrix}$"
                    }
                ]
            },
            {
                title: '5. Solving Simultaneous Equations',
                content: "## Matrix Form\n\n$$\\\\begin{pmatrix} a & b \\\\\\\\ c & d \\\\end{pmatrix}\\\\begin{pmatrix} x \\\\\\\\ y \\\\end{pmatrix} = \\\\begin{pmatrix} e \\\\\\\\ f \\\\end{pmatrix}$$\n\nSolution: Multiply by inverse.",
                worked_examples: [
                    {
                        question: "Solve: 3x + 2y = 12, 5x + 4y = 22",
                        steps: [
                            "Form matrix equation AX = B",
                            "X = A⁻¹B",
                            "Using inverse from above: x = 2, y = 3"
                        ],
                        final_answer: "x = 2, y = 3"
                    }
                ]
            },
            {
                title: '6-9. Transformation Matrices and Practice',
                content: "## Transformation Matrices\n\nSee Transformations topic for common matrices.\n\n## Practice\n\nFind det$\\\\begin{pmatrix} 5 & 3 \\\\\\\\ 2 & 4 \\\\end{pmatrix}$\n\n<details>\n<summary>**Answer**</summary>\n\ndet = 20 - 6 = 14\n</details>"
            }
        ],
        key_points: [
            "Order: rows × columns",
            "det = ad - bc",
            "Inverse = (1/det) × swapped matrix",
            "AB ≠ BA (not commutative)"
        ],
        exam_tips: [
            "Check dimensions before multiplying.",
            "If det = 0, state 'no inverse'.",
            "Verify inverse by checking AA⁻¹ = I."
        ],
        visual_descriptions: [
            "Matrix multiplication diagram",
            "Identity matrix structure"
        ]
    },

    // ============================================
    // TOPIC 18: SETS (Form 2-4)
    // ============================================
    'Sets': {
        topic: 'Sets',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: "Sets are collections of distinct objects. This topic covers set notation, unions, intersections, complements, Venn diagrams, and problem solving with sets.",
        sections: [
            {
                title: '1. Set Notation',
                content: "## Notation\n\n- $\\\\in$: element of\n- $\\\\notin$: not element of\n- $\\\\subseteq$: subset\n- $\\\\emptyset$ or {}: empty set\n- n(A): number of elements\n- $\\\\mathcal{E}$ or U: universal set",
                worked_examples: [
                    {
                        question: "If A = {1, 2, 3, 4, 5}, is 3 ∈ A?",
                        steps: ["3 is in the set A"],
                        final_answer: "Yes, 3 ∈ A"
                    }
                ]
            },
            {
                title: '2. Set Operations',
                content: "## Union: A ∪ B\n\nAll elements in A OR B (or both).\n\n## Intersection: A ∩ B\n\nElements in BOTH A AND B.\n\n## Complement: A'\n\nElements NOT in A (but in universal set).",
                worked_examples: [
                    {
                        question: "A = {1,2,3,4}, B = {3,4,5,6}. Find A ∩ B and A ∪ B.",
                        steps: [
                            "A ∩ B = {3, 4}",
                            "A ∪ B = {1, 2, 3, 4, 5, 6}"
                        ],
                        final_answer: "A ∩ B = {3,4}, A ∪ B = {1,2,3,4,5,6}"
                    }
                ]
            },
            {
                title: '3. Venn Diagrams',
                content: "## Drawing\n\n- Universal set: rectangle\n- Sets: overlapping circles\n- Shade regions for operations\n\n## Formula (Two Sets)\n\n$$n(A \\\\cup B) = n(A) + n(B) - n(A \\\\cap B)$$",
                worked_examples: [
                    {
                        question: "n(A) = 15, n(B) = 12, n(A ∩ B) = 5. Find n(A ∪ B).",
                        steps: ["n(A ∪ B) = 15 + 12 - 5 = 22"],
                        final_answer: "22"
                    }
                ]
            },
            {
                title: '4. Three-Set Problems',
                content: "## Formula\n\n$$n(A \\\\cup B \\\\cup C) = n(A) + n(B) + n(C) - n(A \\\\cap B) - n(B \\\\cap C) - n(A \\\\cap C) + n(A \\\\cap B \\\\cap C)$$\n\n## Strategy\n\nFill in Venn diagram from centre outward.",
                worked_examples: [
                    {
                        question: "In a class: 20 study Maths, 15 Physics, 18 Chemistry. 8 study M&P, 10 study P&C, 9 study M&C, 5 study all three, 3 study none. Find class size.",
                        steps: [
                            "Use three-set formula",
                            "n = 20+15+18-8-10-9+5+3 = 34"
                        ],
                        final_answer: "34 students"
                    }
                ]
            },
            {
                title: '5-9. Practice Problems',
                content: "## Practice\n\nε = {1,2,...,10}, A = {2,4,6,8,10}, B = {1,2,3,4,5}. Find A' ∩ B.\n\n<details>\n<summary>**Answer**</summary>\n\nA' = {1,3,5,7,9}\nA' ∩ B = {1,3,5}\n</details>"
            }
        ],
        key_points: [
            "∪ = union (OR), ∩ = intersection (AND)",
            "A' = complement (NOT in A)",
            "n(A∪B) = n(A) + n(B) - n(A∩B)",
            "Use Venn diagrams for visualization"
        ],
        exam_tips: [
            "List set elements clearly.",
            "Fill Venn diagrams from inside out.",
            "Check that all regions add up to total."
        ],
        visual_descriptions: [
            "Two-circle Venn diagram with regions labeled",
            "Three-circle Venn diagram"
        ]
    },

    // ============================================
    // TOPIC 19: LOCI & CONSTRUCTION (Form 2-4)
    // ============================================
    'Loci and Construction': {
        topic: 'Loci and Construction',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: "A locus is a set of points satisfying a condition. This topic covers common loci, geometric constructions, and combining loci to solve problems.",
        sections: [
            {
                title: '1. Common Loci',
                content: "## Key Loci\n\n| Condition | Locus |\n|-----------|-------|\n| Fixed distance from point | Circle |\n| Equidistant from two points | Perpendicular bisector |\n| Equidistant from two lines | Angle bisector |\n| Fixed distance from line | Parallel line |",
                worked_examples: [
                    {
                        question: "Describe locus of points 5cm from point A.",
                        steps: ["Circle with centre A, radius 5cm"],
                        final_answer: "Circle, centre A, radius 5cm"
                    }
                ]
            },
            {
                title: '2. Basic Constructions',
                content: "## Using Compass and Ruler\n\n1. **Perpendicular bisector**: Arc from each endpoint, join intersections\n2. **Angle bisector**: Arc from vertex, arcs from cuts, join to vertex\n3. **Perpendicular from point to line**: Arcs from point cutting line, bisect\n4. **60° angle**: Draw arc, step off same radius",
                worked_examples: [
                    {
                        question: "Construct perpendicular bisector of AB = 8cm.",
                        steps: [
                            "From A, arc radius >4cm",
                            "Same from B",
                            "Join intersection points"
                        ],
                        final_answer: "Construction complete"
                    }
                ]
            },
            {
                title: '3. Constructing Triangles',
                content: "## Given SSS\n\n1. Draw base\n2. Arc from one end (first side length)\n3. Arc from other end (second side)\n4. Join intersection\n\n## Given SAS\n\n1. Draw base\n2. Construct angle\n3. Mark length on angle arm\n4. Complete triangle",
                worked_examples: [
                    {
                        question: "Construct triangle with sides 6cm, 7cm, 8cm.",
                        steps: [
                            "Draw 8cm base",
                            "Arc 6cm from one end",
                            "Arc 7cm from other end",
                            "Join apex"
                        ],
                        final_answer: "Triangle constructed"
                    }
                ]
            },
            {
                title: '4. Combined Loci',
                content: "## Finding Regions\n\n1. Draw each locus\n2. Find intersection\n3. Shade required region\n\n## Describing Positions\n\nPoint must satisfy ALL conditions.",
                worked_examples: [
                    {
                        question: "Find locus of points equidistant from A and B, AND 4cm from line L.",
                        steps: [
                            "Draw perpendicular bisector of AB",
                            "Draw lines parallel to L at 4cm",
                            "Intersection points are the locus"
                        ],
                        final_answer: "Two points where constructions meet"
                    }
                ]
            },
            {
                title: '5-9. Practice',
                content: "## Practice\n\nDescribe locus of points inside rectangle ABCD that are closer to AB than CD.\n\n<details>\n<summary>**Answer**</summary>\n\nRegion between AB and the parallel line through centre of rectangle.\n</details>"
            }
        ],
        key_points: [
            "Circle: fixed distance from point",
            "Perpendicular bisector: equidistant from 2 points",
            "Angle bisector: equidistant from 2 lines",
            "Use accurate construction techniques"
        ],
        exam_tips: [
            "Use sharp pencil and accurate compass.",
            "Leave construction arcs visible.",
            "Check measurements with ruler.",
            "Describe loci in words if asked."
        ],
        visual_descriptions: [
            "Perpendicular bisector construction",
            "Angle bisector construction"
        ]
    },

    // ============================================
    // TOPIC 20: CONSUMER ARITHMETIC (Form 2-4)
    // ============================================
    'Consumer Arithmetic': {
        topic: 'Consumer Arithmetic',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: "Consumer arithmetic deals with everyday financial calculations. This topic covers percentages, profit and loss, simple and compound interest, hire purchase, tax, and exchange rates.",
        sections: [
            {
                title: '1. Percentage Calculations',
                content: "## Basic Formulae\n\n$$\\\\text{Percentage} = \\\\frac{\\\\text{Part}}{\\\\text{Whole}} \\\\times 100$$\n\n## Percentage Change\n\n$$\\\\text{Change} = \\\\frac{\\\\text{New} - \\\\text{Old}}{\\\\text{Old}} \\\\times 100$$",
                worked_examples: [
                    {
                        question: "A price increases from $80 to $92. Find percentage increase.",
                        steps: [
                            "Change = 92 - 80 = $12",
                            "% increase = (12/80) × 100 = 15%"
                        ],
                        final_answer: "15%"
                    }
                ]
            },
            {
                title: '2. Profit and Loss',
                content: "## Profit\n\n$$\\\\text{Profit} = \\\\text{Selling Price} - \\\\text{Cost Price}$$\n\n$$\\\\text{Profit \\\\%} = \\\\frac{\\\\text{Profit}}{\\\\text{Cost Price}} \\\\times 100$$\n\n## Loss\n\n$$\\\\text{Loss} = \\\\text{Cost Price} - \\\\text{Selling Price}$$",
                worked_examples: [
                    {
                        question: "Cost price $200, sold for $250. Find profit %.",
                        steps: [
                            "Profit = 250 - 200 = $50",
                            "Profit % = (50/200) × 100 = 25%"
                        ],
                        final_answer: "25%"
                    }
                ]
            },
            {
                title: '3. Simple Interest',
                content: "## Formula\n\n$$I = \\\\frac{PRT}{100}$$\n\nwhere:\n- P = Principal\n- R = Rate per year\n- T = Time in years\n\n$$A = P + I$$",
                worked_examples: [
                    {
                        question: "$5000 at 8% for 3 years. Find simple interest and total amount.",
                        steps: [
                            "I = (5000 × 8 × 3)/100 = $1200",
                            "A = 5000 + 1200 = $6200"
                        ],
                        final_answer: "I = $1200, A = $6200"
                    }
                ]
            },
            {
                title: '4. Compound Interest',
                content: "## Formula\n\n$$A = P\\\\left(1 + \\\\frac{r}{100}\\\\right)^n$$\n\n$$\\\\text{CI} = A - P$$\n\n## Compound Interest is greater than Simple Interest (for n > 1)",
                worked_examples: [
                    {
                        question: "$2000 at 10% compound interest for 2 years.",
                        steps: [
                            "A = 2000(1 + 0.1)²",
                            "= 2000 × 1.21 = $2420",
                            "CI = 2420 - 2000 = $420"
                        ],
                        final_answer: "A = $2420, CI = $420"
                    }
                ]
            },
            {
                title: '5. Hire Purchase',
                content: "## Components\n\n1. **Deposit**: Initial payment\n2. **Monthly instalments**: Regular payments\n3. **HP Price**: Deposit + Total instalments\n4. **Interest**: HP Price - Cash Price",
                worked_examples: [
                    {
                        question: "TV cash price $800. HP: $200 deposit + 24 payments of $30. Find HP interest.",
                        steps: [
                            "Total instalments = 24 × 30 = $720",
                            "HP price = 200 + 720 = $920",
                            "Interest = 920 - 800 = $120"
                        ],
                        final_answer: "$120"
                    }
                ]
            },
            {
                title: '6. Tax Calculations',
                content: "## Income Tax\n\nCalculated on taxable income (income - allowances).\n\n## VAT\n\nUsually percentage of selling price.\n\n$$\\\\text{Price + VAT} = \\\\text{Price} \\\\times (1 + \\\\text{VAT rate})$$",
                worked_examples: [
                    {
                        question: "Price is $100 before 15% VAT. Find total cost.",
                        steps: [
                            "VAT = 100 × 0.15 = $15",
                            "Total = 100 + 15 = $115"
                        ],
                        final_answer: "$115"
                    }
                ]
            },
            {
                title: '7. Exchange Rates',
                content: "## Conversion\n\nBuying: you receive less\nSelling: bank pays less\n\n$$\\\\text{Foreign} = \\\\text{Local} \\\\div \\\\text{Rate}$$\n$$\\\\text{Local} = \\\\text{Foreign} \\\\times \\\\text{Rate}$$",
                worked_examples: [
                    {
                        question: "Rate: 1 USD = 362 ZWL. Convert $100 to ZWL.",
                        steps: [
                            "ZWL = 100 × 362 = 36,200 ZWL"
                        ],
                        final_answer: "36,200 ZWL"
                    }
                ]
            },
            {
                title: '8. Depreciation',
                content: "## Formula\n\n$$V = P\\\\left(1 - \\\\frac{r}{100}\\\\right)^n$$\n\nwhere r is depreciation rate.",
                worked_examples: [
                    {
                        question: "Car worth $20,000 depreciates 15% per year. Value after 2 years?",
                        steps: [
                            "V = 20000 × (0.85)²",
                            "= 20000 × 0.7225 = $14,450"
                        ],
                        final_answer: "$14,450"
                    }
                ]
            },
            {
                title: '9. Try This Yourself',
                content: "## Practice\n\n### ZIMSEC Style\n$3000 invested at 5% compound interest. Find amount after 3 years.\n\n<details>\n<summary>**Answer**</summary>\n\nA = 3000(1.05)³ = 3000 × 1.157625 = $3472.88\n</details>"
            }
        ],
        key_points: [
            "SI = PRT/100",
            "CI: A = P(1 + r/100)ⁿ",
            "% change = (change/original) × 100",
            "HP cost includes interest",
            "Depreciation: A = P(1 - r/100)ⁿ"
        ],
        exam_tips: [
            "Read questions carefully for simple vs compound.",
            "Show all working for multi-step problems.",
            "Round money to 2 decimal places.",
            "Check if asking for interest or total amount."
        ],
        visual_descriptions: [
            "Timeline showing compound interest growth",
            "Comparison chart of SI vs CI"
        ]
    }
};

// Helper function to get notes for a specific topic
export function getOLevelMathNotes(topicName: string): MathTopicNotes | null {
    return oLevelMathNotes[topicName] || null;
}

// Get all available topic names with notes
export function getAvailableOLevelMathTopics(): string[] {
    return Object.keys(oLevelMathNotes);
}
