import type { MathTopicNotes } from '../mathNotes/types';

export const form1MathNotes2: Record<string, MathTopicNotes> = {
    // ============================================
    // TOPIC 14: SYMBOLIC EXPRESSION (Form 1)
    // ============================================
    'Symbolic Expression': {
        topic: 'Symbolic Expression',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "Symbolic Expression is the gateway to algebra. In this topic you learn how to use letters and symbols to represent unknown or variable quantities, translate word statements into algebraic expressions, and identify the parts of an expression such as terms, coefficients, constants, and variables. These skills are fundamental because nearly every other mathematics topic — from equations to functions — relies on writing and interpreting algebraic expressions correctly. The ZIMSEC syllabus expects you to move fluently between everyday language and algebraic notation.",
        sections: [
            {
                title: '1. Using Letters to Represent Unknowns',
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Symbolic_Expressions.mp4',
                content: "## Why Use Letters?\n\nIn arithmetic we work with known numbers. In algebra we use **letters** (also called **variables**) to stand for numbers we do not yet know or numbers that can change.\n\n## Conventions\n\n- Any letter may be used, but $x$, $y$, $n$, $a$, $b$ are the most common.\n- When a number is multiplied by a letter we write the number first: $3x$ not $x3$.\n- We write $x$ instead of $1x$, and $-x$ instead of $-1x$.\n- $x \\\\times x$ is written $x^2$ (read \"$x$ squared\").\n\n## Key Vocabulary\n\n| Word | Meaning | Example |\n|------|---------|--------|\n| Variable | A letter representing an unknown value | $x$ |\n| Constant | A fixed number that does not change | 5, $-3$ |\n| Term | A product of numbers and variables | $4x$, $-2y^2$, $7$ |\n| Coefficient | The numerical part of a term | In $4x$ the coefficient is 4 |\n| Expression | A collection of terms joined by $+$ or $-$ | $3x + 2y - 5$ |",
                worked_examples: [
                    {
                        question: "A pen costs $x$ dollars and a ruler costs $y$ dollars. Write an expression for the total cost of 3 pens and 2 rulers.",
                        steps: [
                            "Cost of 3 pens = $3 \\\\times x = 3x$",
                            "Cost of 2 rulers = $2 \\\\times y = 2y$",
                            "Total cost = $3x + 2y$"
                        ],
                        final_answer: "$3x + 2y$"
                    }
                ]
            },
            {
                title: '2. Writing Algebraic Expressions from Words',
                content: "## Translation Table\n\nLearn these key phrases:\n\n| English Phrase | Operation | Algebraic Form |\n|----------------|-----------|---------------|\n| sum of $a$ and $b$ | addition | $a + b$ |\n| difference of $a$ and $b$ | subtraction | $a - b$ |\n| product of $a$ and $b$ | multiplication | $ab$ |\n| quotient of $a$ and $b$ | division | $\\\\frac{a}{b}$ |\n| $a$ more than $b$ | addition | $b + a$ |\n| $a$ less than $b$ | subtraction | $b - a$ |\n| twice $x$ | multiplication | $2x$ |\n| half of $x$ | division | $\\\\frac{x}{2}$ |\n| square of $x$ | power | $x^2$ |\n| cube of $x$ | power | $x^3$ |\n\n## Tips for Translating\n\n1. Read the whole sentence first.\n2. Identify the unknown — assign it a letter.\n3. Decide which operation is described.\n4. Write the expression.\n\n**Common trap**: \"5 less than $x$\" is $x - 5$, **not** $5 - x$.",
                worked_examples: [
                    {
                        question: "Tapiwa is $x$ years old. His father is 4 times as old. Write an expression for (a) his father's age (b) the sum of their ages (c) the difference between their ages.",
                        steps: [
                            "(a) Father's age = $4 \\\\times x = 4x$",
                            "(b) Sum = $x + 4x = 5x$",
                            "(c) Difference = $4x - x = 3x$"
                        ],
                        final_answer: "(a) $4x$ (b) $5x$ (c) $3x$"
                    },
                    {
                        question: "Write an algebraic expression for: 'seven more than three times a number $n$'.",
                        steps: [
                            "Three times $n$ is $3n$",
                            "Seven more means add 7",
                            "Expression: $3n + 7$"
                        ],
                        final_answer: "$3n + 7$"
                    }
                ]
            },
            {
                title: '3. Understanding Terms, Coefficients, and Constants',
                content: "## Identifying Parts of an Expression\n\nConsider $5x^2 - 3x + 7$:\n\n| Part | Value |\n|------|-------|\n| Number of terms | 3 |\n| First term | $5x^2$ |\n| Coefficient of $x^2$ | 5 |\n| Second term | $-3x$ |\n| Coefficient of $x$ | $-3$ |\n| Constant term | 7 |\n\n## Important Points\n\n- The **sign** belongs to the term: in $4a - 2b + 6$, the terms are $+4a$, $-2b$, and $+6$.\n- A **constant** is a term with no variable.\n- Two terms are **like terms** if they have exactly the same variable part: $3x$ and $-7x$ are like terms; $3x$ and $3x^2$ are **not**.\n\n## Counting Terms\n\nTerms are separated by $+$ or $-$ signs that are **not** inside brackets.\n\n$$2a + 3b - c \\quad \\text{has 3 terms}$$\n$$4(x + 2) \\quad \\text{is a single term (one product)}$$",
                worked_examples: [
                    {
                        question: "For the expression $8m - 3n + 2mn - 5$, state (a) the number of terms, (b) the coefficient of $m$, (c) the coefficient of $mn$, (d) the constant term.",
                        steps: [
                            "List the terms: $8m$, $-3n$, $2mn$, $-5$",
                            "(a) There are 4 terms",
                            "(b) Coefficient of $m$ is 8",
                            "(c) Coefficient of $mn$ is 2",
                            "(d) Constant term is $-5$"
                        ],
                        final_answer: "(a) 4 (b) 8 (c) 2 (d) $-5$"
                    }
                ]
            },
            {
                title: '4. Forming Expressions from Real-Life Situations',
                content: "## Strategy\n\n1. **Define your variable** — say what the letter represents, including units.\n2. **Break the problem into parts** — write each part algebraically.\n3. **Combine** — join with appropriate operations.\n\n## ZIMSEC-Style Context Examples\n\n- Shopping: cost = price $\\\\times$ quantity\n- Age problems: relate ages using addition/subtraction\n- Geometry: perimeter = sum of sides; area = length $\\\\times$ width\n- Money: total = notes $\\\\times$ value + coins $\\\\times$ value\n\n## Perimeter Example\n\nA rectangle has length $l$ and width $w$.\n\n$$\\\\text{Perimeter} = 2l + 2w = 2(l + w)$$\n$$\\\\text{Area} = l \\\\times w = lw$$\n\nIf the length is 3 cm more than the width, let width $= w$, then length $= w + 3$.\n$$P = 2(w + 3) + 2w = 2w + 6 + 2w = 4w + 6$$",
                worked_examples: [
                    {
                        question: "A farmer has $x$ cows. He buys 12 more and then sells a quarter of the total. Write an expression for the number of cows remaining.",
                        steps: [
                            "After buying 12: total = $x + 12$",
                            "He sells $\\\\frac{1}{4}$ of that: sold = $\\\\frac{x + 12}{4}$",
                            "Remaining = $x + 12 - \\\\frac{x + 12}{4}$",
                            "Remaining = $\\\\frac{4(x + 12) - (x + 12)}{4} = \\\\frac{3(x + 12)}{4}$"
                        ],
                        final_answer: "$\\\\frac{3(x + 12)}{4}$"
                    }
                ]
            }
        ],
        key_points: [
            "Letters (variables) represent unknown or changing quantities",
            "Write the number before the letter: $3x$ not $x3$",
            "A term is a product of numbers and variables; terms are separated by + or −",
            "The coefficient is the numerical factor of a term",
            "A constant term has no variable part",
            "Like terms have identical variable parts (same letters, same powers)",
            "'$a$ less than $b$' means $b - a$, not $a - b$",
            "Always state what your letter represents before forming an expression"
        ],
        exam_tips: [
            "ZIMSEC often asks you to 'write an expression for …' — make sure you do NOT solve or simplify unless asked.",
            "Always define your variable with units in word-problem questions.",
            "Watch for tricky phrases: 'less than' reverses the order of subtraction.",
            "Check your expression by substituting a simple number to see if the answer makes sense.",
            "Show each translation step for full method marks."
        ],
        visual_descriptions: [
            "A labelled algebraic expression $5x^2 - 3x + 7$ with arrows pointing to the coefficient, variable part, and constant term",
            "A translation diagram showing English phrases on the left connected by arrows to their algebraic equivalents on the right",
            "A rectangle with sides labelled $l$ and $w$ showing perimeter = $2l + 2w$"
        ]
    },

    // ============================================
    // TOPIC 15: ALGEBRAIC MANIPULATION (Form 1)
    // ============================================
    'Algebraic Manipulation': {
        topic: 'Algebraic Manipulation',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "Algebraic Manipulation is about simplifying, rearranging, and transforming algebraic expressions. You will learn to collect like terms, expand brackets, substitute numerical values into expressions, find the H.C.F. of algebraic terms, and factorise linear expressions. These skills are the building blocks for solving equations, working with formulae, and tackling more advanced algebra later in the ZIMSEC syllabus.",
        sections: [
            {
                title: '1. Collecting Like Terms',
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Algebraic_Manipulation.mp4',
                content: "## What Are Like Terms?\n\nTerms with **exactly the same variable part** (same letters raised to the same powers).\n\n| Like Terms | Unlike Terms |\n|-----------|-------------|\n| $3x$ and $-5x$ | $3x$ and $3x^2$ |\n| $2ab$ and $-ab$ | $2ab$ and $2a$ |\n| $4y^2$ and $y^2$ | $4y^2$ and $4y$ |\n\n## Rule\n\nAdd or subtract the **coefficients** of like terms; the variable part stays the same.\n\n$$3x + 5x = 8x$$\n$$7a - 2a + a = 6a$$\n$$4x + 3y - x + 2y = 3x + 5y$$\n\n## Order of Writing\n\nWrite terms in **descending powers**, numbers last:\n$$x^2 + 3x - 5 \\quad \\text{(standard form)}$$",
                worked_examples: [
                    {
                        question: "Simplify $7a + 3b - 2a + 5b - 4$.",
                        steps: [
                            "Group like terms: $(7a - 2a) + (3b + 5b) + (-4)$",
                            "$= 5a + 8b - 4$"
                        ],
                        final_answer: "$5a + 8b - 4$"
                    },
                    {
                        question: "Simplify $3x^2 + 4x - x^2 + 2x - 7$.",
                        steps: [
                            "Group $x^2$ terms: $3x^2 - x^2 = 2x^2$",
                            "Group $x$ terms: $4x + 2x = 6x$",
                            "Constant: $-7$",
                            "Result: $2x^2 + 6x - 7$"
                        ],
                        final_answer: "$2x^2 + 6x - 7$"
                    }
                ]
            },
            {
                title: '2. Expanding Brackets (Distributive Law)',
                content: "## Single Bracket\n\nMultiply each term inside the bracket by the term outside:\n\n$$a(b + c) = ab + ac$$\n\n## Examples\n\n$$3(x + 4) = 3x + 12$$\n$$-2(3a - 5) = -6a + 10$$\n$$x(x + 3) = x^2 + 3x$$\n\n## Two Brackets Being Added/Subtracted\n\nExpand each bracket separately, then collect like terms:\n\n$$3(x + 2) + 2(x - 1)$$\n$$= 3x + 6 + 2x - 2$$\n$$= 5x + 4$$\n\n## Watch the Minus Sign!\n\nA minus before a bracket changes all signs inside:\n$$-(a - b) = -a + b$$\n$$5 - 2(x + 3) = 5 - 2x - 6 = -2x - 1$$",
                worked_examples: [
                    {
                        question: "Expand and simplify $4(2x - 3) - 3(x - 5)$.",
                        steps: [
                            "Expand first bracket: $4 \\\\times 2x + 4 \\\\times (-3) = 8x - 12$",
                            "Expand second bracket: $-3 \\\\times x + (-3) \\\\times (-5) = -3x + 15$",
                            "Combine: $8x - 12 - 3x + 15$",
                            "Collect like terms: $(8x - 3x) + (-12 + 15) = 5x + 3$"
                        ],
                        final_answer: "$5x + 3$"
                    }
                ]
            },
            {
                title: '3. Substitution',
                content: "## What Is Substitution?\n\nReplacing letters with given numerical values and then evaluating the expression.\n\n## Steps\n\n1. Write the expression.\n2. Replace each letter with its value **in brackets**.\n3. Follow BODMAS / order of operations.\n4. Calculate the result.\n\n## Why Brackets Matter\n\nIf $a = -3$:\n$$2a^2 = 2(-3)^2 = 2 \\\\times 9 = 18$$\n\nWithout brackets you might incorrectly compute $2 \\\\times -3^2 = -18$.\n\n## Common Substitution Patterns\n\n- $a^2$ means $(a) \\\\times (a)$\n- $-a^2$ means $-(a)^2$\n- $(-a)^2$ means $(-a) \\\\times (-a) = a^2$",
                worked_examples: [
                    {
                        question: "If $a = 3$, $b = -2$, find the value of $2a^2 - 3ab + b^2$.",
                        steps: [
                            "Substitute: $2(3)^2 - 3(3)(-2) + (-2)^2$",
                            "$= 2(9) - 3(-6) + 4$",
                            "$= 18 + 18 + 4$",
                            "$= 40$"
                        ],
                        final_answer: "$40$"
                    },
                    {
                        question: "Given $x = -1$ and $y = 4$, evaluate $\\\\frac{3x + y}{x - y}$.",
                        steps: [
                            "Numerator: $3(-1) + 4 = -3 + 4 = 1$",
                            "Denominator: $(-1) - 4 = -5$",
                            "Fraction: $\\\\frac{1}{-5} = -\\\\frac{1}{5}$"
                        ],
                        final_answer: "$-\\\\frac{1}{5}$"
                    }
                ]
            },
            {
                title: '4. Highest Common Factor (H.C.F.) of Algebraic Terms',
                content: "## Finding the Algebraic H.C.F.\n\n1. Find the H.C.F. of the **numerical coefficients**.\n2. For each **variable**, take the **lowest power** that appears in every term.\n3. Multiply results together.\n\n## Examples\n\n| Terms | Numerical HCF | Variable HCF | Algebraic HCF |\n|-------|--------------|--------------|---------------|\n| $6x$ and $9x^2$ | 3 | $x$ | $3x$ |\n| $12a^2b$ and $18ab^2$ | 6 | $ab$ | $6ab$ |\n| $4x$, $8x^2$, $12x^3$ | 4 | $x$ | $4x$ |",
                worked_examples: [
                    {
                        question: "Find the H.C.F. of $15a^2b^3$ and $20a^3b$.",
                        steps: [
                            "Numerical HCF: HCF(15, 20) = 5",
                            "Variable $a$: lowest power is $a^2$",
                            "Variable $b$: lowest power is $b^1 = b$",
                            "Algebraic HCF = $5a^2b$"
                        ],
                        final_answer: "$5a^2b$"
                    }
                ]
            },
            {
                title: '5. Factorising Linear Expressions',
                content: "## What Is Factorisation?\n\nThe reverse of expanding brackets. We write an expression as a **product of factors**.\n\n$$\\\\text{Expanding: } 3(x + 4) = 3x + 12$$\n$$\\\\text{Factorising: } 3x + 12 = 3(x + 4)$$\n\n## Steps to Factorise\n\n1. Find the **H.C.F.** of all terms.\n2. Write the H.C.F. outside the bracket.\n3. Divide each term by the H.C.F. to get the bracket contents.\n4. **Check** by expanding.\n\n## Examples\n\n$$6x + 9 = 3(2x + 3)$$\n$$10a - 15b = 5(2a - 3b)$$\n$$4x^2 + 8x = 4x(x + 2)$$\n$$-6m - 12 = -6(m + 2)$$\n\n## Factorising with a Negative Common Factor\n\nSometimes the leading term is negative. Factor out the negative:\n$$-3x - 9 = -3(x + 3)$$",
                worked_examples: [
                    {
                        question: "Factorise completely: $12x^2y - 18xy^2 + 6xy$.",
                        steps: [
                            "Numerical HCF: HCF(12, 18, 6) = 6",
                            "Variable HCF: $x$ (lowest power 1) and $y$ (lowest power 1) → $xy$",
                            "Overall HCF = $6xy$",
                            "Divide each term: $\\\\frac{12x^2y}{6xy} = 2x$, $\\\\frac{-18xy^2}{6xy} = -3y$, $\\\\frac{6xy}{6xy} = 1$",
                            "Result: $6xy(2x - 3y + 1)$",
                            "Check: $6xy \\\\times 2x = 12x^2y$ ✓, $6xy \\\\times (-3y) = -18xy^2$ ✓, $6xy \\\\times 1 = 6xy$ ✓"
                        ],
                        final_answer: "$6xy(2x - 3y + 1)$"
                    }
                ]
            }
        ],
        key_points: [
            "Like terms have identical variable parts — collect them by adding/subtracting coefficients",
            "Expanding: multiply every term inside the bracket by the term outside",
            "A minus sign before a bracket changes all signs inside",
            "Substitution: always place negative values in brackets before evaluating",
            "Follow BODMAS when evaluating substituted expressions",
            "To find the algebraic H.C.F., combine the numerical HCF with the lowest powers of common variables",
            "Factorising is the reverse of expanding — always check by expanding back",
            "Factorise completely: take out the largest possible common factor"
        ],
        exam_tips: [
            "When simplifying, underline or circle like terms in different colours to avoid errors.",
            "If asked to 'simplify', collect like terms. If asked to 'expand and simplify', expand brackets first then collect.",
            "Always show substitution working — write the expression, then replace letters, then calculate.",
            "To check factorisation, expand your answer and verify you get the original expression.",
            "ZIMSEC awards marks for showing the H.C.F. step separately before writing the factorised form.",
            "Remember: $-a^2 \\\\neq (-a)^2$ — the placement of the negative sign matters."
        ],
        visual_descriptions: [
            "A colour-coded expression showing like terms circled in matching colours being combined",
            "An arrow diagram showing expanding $3(x + 4)$ forwards and factorising $3x + 12$ backwards",
            "A factor tree applied to algebraic terms $12x^2y$ and $18xy^2$ showing the H.C.F. $6xy$"
        ]
    },

    // ============================================
    // TOPIC 16: EQUATIONS (Form 1)
    // ============================================
    'Equations': {
        topic: 'Equations',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "An equation is a mathematical statement that two expressions are equal. In Form 1 you learn to solve linear equations — equations where the unknown appears to the first power only. You will also learn how to form equations from word problems and verify (check) that your solutions are correct. Equation solving is one of the most frequently examined skills in the ZIMSEC O-Level Mathematics examination.",
        sections: [
            {
                title: '1. What Is an Equation?',
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Form_1__Mastering_Equations.mp4',
                content: "## Definition\n\nAn **equation** is a statement that two expressions have the same value, connected by an equals sign ($=$).\n\n$$3x + 2 = 14$$\n\nThis tells us that when we find the correct value of $x$, the left side equals the right side.\n\n## Equation vs Expression\n\n| | Expression | Equation |\n|---|-----------|----------|\n| Has $=$ sign? | No | Yes |\n| Example | $3x + 2$ | $3x + 2 = 14$ |\n| Can be solved? | No — only simplified | Yes — find the value of $x$ |\n\n## The Solution (Root)\n\nThe value of the variable that makes the equation true is called the **solution** or **root**.\n\nFor $3x + 2 = 14$, the solution is $x = 4$ because $3(4) + 2 = 14$.\n\n## Linear Equation\n\nA linear equation has the unknown to the **first power** only (no $x^2$, $x^3$, etc.).\n\nExamples: $2x + 5 = 11$, $\\\\frac{x}{3} = 7$, $4 - x = 1$.",
                worked_examples: [
                    {
                        question: "Identify which of the following are equations: (a) $3x + 5$ (b) $2x - 1 = 7$ (c) $x^2 + 1$ (d) $\\\\frac{x}{4} = 3$",
                        steps: [
                            "(a) $3x + 5$ — no equals sign → expression",
                            "(b) $2x - 1 = 7$ — has equals sign → equation",
                            "(c) $x^2 + 1$ — no equals sign → expression",
                            "(d) $\\\\frac{x}{4} = 3$ — has equals sign → equation"
                        ],
                        final_answer: "(b) and (d) are equations"
                    }
                ]
            },
            {
                title: '2. Solving One-Step and Two-Step Equations',
                content: "## The Balance Principle\n\nWhatever you do to one side, you must do to the other side to keep the equation balanced.\n\n## One-Step Equations\n\n| Equation | Inverse Operation | Solution |\n|----------|-------------------|----------|\n| $x + 5 = 12$ | Subtract 5 | $x = 7$ |\n| $x - 3 = 8$ | Add 3 | $x = 11$ |\n| $4x = 20$ | Divide by 4 | $x = 5$ |\n| $\\\\frac{x}{3} = 6$ | Multiply by 3 | $x = 18$ |\n\n## Two-Step Equations\n\n1. Deal with addition/subtraction first.\n2. Then deal with multiplication/division.\n\n$$2x + 3 = 11$$\n$$2x = 11 - 3 = 8$$\n$$x = \\\\frac{8}{2} = 4$$",
                worked_examples: [
                    {
                        question: "Solve $5x - 7 = 18$.",
                        steps: [
                            "Add 7 to both sides: $5x = 18 + 7 = 25$",
                            "Divide both sides by 5: $x = \\\\frac{25}{5} = 5$"
                        ],
                        final_answer: "$x = 5$"
                    },
                    {
                        question: "Solve $\\\\frac{x}{4} + 3 = 10$.",
                        steps: [
                            "Subtract 3 from both sides: $\\\\frac{x}{4} = 7$",
                            "Multiply both sides by 4: $x = 28$"
                        ],
                        final_answer: "$x = 28$"
                    }
                ]
            },
            {
                title: '3. Solving Equations with Brackets',
                content: "## Method\n\n1. **Expand** the brackets.\n2. **Collect** like terms.\n3. **Solve** the resulting equation.\n\n## Example Walk-Through\n\n$$3(x + 4) = 21$$\n\nStep 1: Expand → $3x + 12 = 21$\n\nStep 2: Subtract 12 → $3x = 9$\n\nStep 3: Divide by 3 → $x = 3$\n\n## Equations with Brackets on Both Sides\n\n$$2(x + 3) = 3(x - 1)$$\n$$2x + 6 = 3x - 3$$\n$$6 + 3 = 3x - 2x$$\n$$9 = x$$\n$$x = 9$$",
                worked_examples: [
                    {
                        question: "Solve $4(2x - 1) - 3(x + 2) = 5$.",
                        steps: [
                            "Expand: $8x - 4 - 3x - 6 = 5$",
                            "Collect like terms: $5x - 10 = 5$",
                            "Add 10: $5x = 15$",
                            "Divide by 5: $x = 3$"
                        ],
                        final_answer: "$x = 3$"
                    }
                ]
            },
            {
                title: '4. Forming Equations from Word Problems',
                content: "## Strategy\n\n1. **Read** the problem carefully — twice.\n2. **Define** the unknown: let the unknown quantity be $x$.\n3. **Translate** each piece of information into algebra.\n4. **Write** the equation.\n5. **Solve** the equation.\n6. **Answer** in context (with units).\n\n## Common ZIMSEC Contexts\n\n- **Age problems**: \"Baba is twice as old as Sisi. Their total age is 36.\"\n  - Let Sisi's age = $x$, Baba's age = $2x$.\n  - $x + 2x = 36$, so $3x = 36$, $x = 12$.\n\n- **Consecutive numbers**: Three consecutive numbers add up to 72.\n  - Let numbers be $n$, $n+1$, $n+2$.\n  - $n + n+1 + n+2 = 72$, $3n + 3 = 72$, $n = 23$.\n\n- **Perimeter/Geometry**: A rectangle's length is $3$ more than its width. Perimeter is $26$ cm.\n  - Width $= x$, length $= x + 3$.\n  - $2(x + x + 3) = 26$.",
                worked_examples: [
                    {
                        question: "Tendai has $x$ marbles. Chipo has 5 more than Tendai. Together they have 31 marbles. Find $x$.",
                        steps: [
                            "Tendai: $x$ marbles",
                            "Chipo: $x + 5$ marbles",
                            "Together: $x + (x + 5) = 31$",
                            "$2x + 5 = 31$",
                            "$2x = 26$",
                            "$x = 13$",
                            "Check: Tendai = 13, Chipo = 18, Total = 31 ✓"
                        ],
                        final_answer: "Tendai has 13 marbles"
                    }
                ]
            },
            {
                title: '5. Verifying Solutions',
                content: "## Why Verify?\n\nChecking proves your answer is correct and catches arithmetic errors. ZIMSEC sometimes awards a mark for the verification step.\n\n## How to Verify\n\n1. Take your solution value.\n2. Substitute it into the **original** equation (not a rearranged form).\n3. Evaluate the Left-Hand Side (LHS).\n4. Evaluate the Right-Hand Side (RHS).\n5. If LHS = RHS, the solution is correct.\n\n## Writing the Check\n\nFor $3x + 2 = 14$ with $x = 4$:\n\n$$\\\\text{LHS} = 3(4) + 2 = 12 + 2 = 14$$\n$$\\\\text{RHS} = 14$$\n$$\\\\text{LHS} = \\\\text{RHS} \\quad \\checkmark$$",
                worked_examples: [
                    {
                        question: "Verify that $x = 5$ is the solution of $7x - 11 = 3x + 9$.",
                        steps: [
                            "LHS = $7(5) - 11 = 35 - 11 = 24$",
                            "RHS = $3(5) + 9 = 15 + 9 = 24$",
                            "LHS = RHS = 24 ✓"
                        ],
                        final_answer: "Verified: $x = 5$ is correct"
                    }
                ]
            }
        ],
        key_points: [
            "An equation has an equals sign; an expression does not",
            "The solution is the value that makes both sides equal",
            "Whatever you do to one side, you must do to the other (balance principle)",
            "Solve by using inverse operations in reverse BODMAS order",
            "Expand brackets before collecting like terms",
            "Always define your variable when forming equations from words",
            "Verify by substituting back into the original equation"
        ],
        exam_tips: [
            "Show every step — ZIMSEC awards method marks for each correct operation.",
            "When forming equations, write 'Let $x$ = …' to earn the definition mark.",
            "Always verify your answer by substituting back — it catches silly mistakes and may earn an extra mark.",
            "If the unknown appears on both sides, move all $x$-terms to one side and numbers to the other.",
            "For bracket equations, expand first, then solve.",
            "Give your final answer in context if it is a word problem."
        ],
        visual_descriptions: [
            "A balance scale showing $3x + 2$ on the left pan and $14$ on the right pan, illustrating the equation concept",
            "A step-by-step flow chart: Read → Define unknown → Form equation → Solve → Verify → Answer",
            "Number line showing the solution point $x = 4$ marked on it"
        ]
    },

    // ============================================
    // TOPIC 17: INEQUALITIES (Form 1)
    // ============================================
    'Inequalities': {
        topic: 'Inequalities',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "Inequalities describe a range of values rather than a single value. Unlike an equation which says two things are equal, an inequality says one quantity is greater than, less than, or at most/at least another. In Form 1 you learn the language of inequalities, how to represent them on a number line, and how to solve simple linear inequalities. This topic lays the groundwork for more complex inequality problems in Forms 3 and 4.",
        sections: [
            {
                title: '1. Inequality Symbols and Language',
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Form_1__Inequalities.mp4',
                content: "## The Four Inequality Symbols\n\n| Symbol | Meaning | Example | Number Line |\n|--------|---------|---------|-------------|\n| $>$ | greater than | $x > 3$ | open circle at 3, arrow right |\n| $<$ | less than | $x < 5$ | open circle at 5, arrow left |\n| $\\\\geq$ | greater than or equal to (at least) | $x \\\\geq 2$ | filled circle at 2, arrow right |\n| $\\\\leq$ | less than or equal to (at most) | $x \\\\leq 7$ | filled circle at 7, arrow left |\n\n## Everyday Language\n\n| Phrase | Symbol |\n|--------|--------|\n| at least | $\\\\geq$ |\n| at most | $\\\\leq$ |\n| more than | $>$ |\n| fewer than / less than | $<$ |\n| no more than | $\\\\leq$ |\n| no less than | $\\\\geq$ |\n| between $a$ and $b$ (exclusive) | $a < x < b$ |\n| between $a$ and $b$ (inclusive) | $a \\\\leq x \\\\leq b$ |\n\n## Open vs Closed Circle\n\n- **Open circle** (○): the endpoint is **not** included ($<$ or $>$)\n- **Closed/filled circle** (●): the endpoint **is** included ($\\\\leq$ or $\\\\geq$)",
                worked_examples: [
                    {
                        question: "Write an inequality for: 'The temperature $T$ is at least 15°C but less than 30°C.'",
                        steps: [
                            "'At least 15' means $T \\\\geq 15$",
                            "'Less than 30' means $T < 30$",
                            "Combined: $15 \\\\leq T < 30$"
                        ],
                        final_answer: "$15 \\\\leq T < 30$"
                    }
                ]
            },
            {
                title: '2. Representing Inequalities on the Number Line',
                content: "## How to Draw\n\n1. Draw a horizontal number line with appropriate scale.\n2. Mark the boundary value(s).\n3. Use an **open circle** (○) for $<$ or $>$ and a **filled circle** (●) for $\\\\leq$ or $\\\\geq$.\n4. Shade or draw an arrow in the direction of the solution set.\n\n## Examples\n\n- $x > 2$: open circle at 2, arrow pointing right\n- $x \\\\leq -1$: filled circle at $-1$, arrow pointing left\n- $-3 < x \\\\leq 4$: open circle at $-3$, filled circle at 4, shaded between\n\n## Reading from a Number Line\n\nGiven a diagram, write the inequality:\n- Check if circles are open or filled.\n- Note the direction of the shading.\n- Write the inequality using the correct symbol.\n\n## Integer Solutions\n\nWhen asked to list integer solutions, list all whole numbers in the solution set.\n\nFor $-2 < x \\\\leq 3$: integers are $-1, 0, 1, 2, 3$.",
                worked_examples: [
                    {
                        question: "List all integer values of $x$ for which $-3 \\\\leq x < 2$.",
                        steps: [
                            "$x$ must be at least $-3$ (included) and less than $2$ (not included)",
                            "Integers: $-3, -2, -1, 0, 1$"
                        ],
                        final_answer: "$x \\\\in \\\\{-3, -2, -1, 0, 1\\\\}$"
                    },
                    {
                        question: "Describe the inequality shown on a number line with a filled circle at $-1$ and an open circle at $4$, shaded between them.",
                        steps: [
                            "Filled circle at $-1$ means $x \\\\geq -1$",
                            "Open circle at $4$ means $x < 4$",
                            "Combined: $-1 \\\\leq x < 4$"
                        ],
                        final_answer: "$-1 \\\\leq x < 4$"
                    }
                ]
            },
            {
                title: '3. Solving Linear Inequalities',
                content: "## Same Rules as Equations — With One Exception\n\nYou solve inequalities the same way as equations **except**:\n\n> **When you multiply or divide both sides by a negative number, you must REVERSE the inequality sign.**\n\n## Example 1: No sign reversal\n\n$$2x + 3 > 11$$\n$$2x > 8$$\n$$x > 4$$\n\n## Example 2: Sign reversal required\n\n$$-3x < 12$$\n$$x > \\\\frac{12}{-3}$$\n$$x > -4$$\n\n(Divided by $-3$, so $<$ became $>$.)\n\n## Double Inequalities\n\nSolve by performing the same operation on all three parts:\n\n$$-1 < 2x + 3 \\\\leq 9$$\n$$-4 < 2x \\\\leq 6 \\quad (\\\\text{subtract 3})$$\n$$-2 < x \\\\leq 3 \\quad (\\\\text{divide by 2})$$",
                worked_examples: [
                    {
                        question: "Solve $5 - 2x \\\\geq 11$ and represent the solution on a number line.",
                        steps: [
                            "Subtract 5: $-2x \\\\geq 6$",
                            "Divide by $-2$ (reverse sign): $x \\\\leq -3$",
                            "Number line: filled circle at $-3$, arrow pointing left"
                        ],
                        final_answer: "$x \\\\leq -3$"
                    }
                ]
            },
            {
                title: '4. Formulating Inequalities from Word Problems',
                content: "## Approach\n\n1. Identify the quantity and define a variable.\n2. Translate constraint words into inequality symbols.\n3. Write and solve the inequality.\n4. Interpret the solution in context.\n\n## ZIMSEC-Style Problems\n\n**Example context**: A student must score at least 50 marks to pass. She has scored 32 in Paper 1. What is the minimum she needs in Paper 2?\n\nLet Paper 2 score $= x$.\n$$32 + x \\\\geq 50$$\n$$x \\\\geq 18$$\n\nShe needs at least 18 marks.\n\n## Practical Constraints\n\nIn real problems, remember:\n- Marks cannot be negative: $x \\\\geq 0$\n- Number of people must be a whole number\n- Money cannot be fractional in some contexts",
                worked_examples: [
                    {
                        question: "A bus can carry at most 65 passengers. There are already 42 passengers on the bus. How many more passengers $n$ can board?",
                        steps: [
                            "Current passengers + new passengers $\\\\leq$ capacity",
                            "$42 + n \\\\leq 65$",
                            "$n \\\\leq 23$",
                            "Also $n \\\\geq 0$ (can't have negative passengers)",
                            "So $0 \\\\leq n \\\\leq 23$"
                        ],
                        final_answer: "At most 23 more passengers can board ($0 \\\\leq n \\\\leq 23$)"
                    }
                ]
            }
        ],
        key_points: [
            "$>$ means greater than; $<$ means less than; $\\\\geq$ means at least; $\\\\leq$ means at most",
            "Open circle (○) for strict inequalities ($<$, $>$); filled circle (●) for inclusive ($\\\\leq$, $\\\\geq$)",
            "Solve inequalities like equations but REVERSE the sign when multiplying/dividing by a negative",
            "A double inequality $a < x \\\\leq b$ means $x$ is between $a$ (not included) and $b$ (included)",
            "Always check if the question asks for integer solutions or all real values",
            "In word problems, consider practical constraints (non-negative, whole numbers)"
        ],
        exam_tips: [
            "Draw the number line clearly with an appropriate scale — ZIMSEC examiners expect a ruler-drawn line.",
            "Label the boundary values on the number line.",
            "When listing integer solutions, do not include endpoints marked with open circles.",
            "Underline or circle the step where you reverse the inequality sign so you don't forget.",
            "If unsure which direction the inequality faces, test a value from your solution set in the original inequality."
        ],
        visual_descriptions: [
            "Number line showing $x > 2$ with an open circle at 2 and an arrow pointing right",
            "Number line showing $-1 \\\\leq x < 4$ with a filled circle at $-1$, open circle at 4, and shading between",
            "A comparison table of inequality symbols with their number-line representations side by side"
        ]
    },

    // ============================================
    // TOPIC 18: ALGEBRAIC EXPRESSIONS IN INDEX FORM (Form 1)
    // ============================================
    'Algebraic Expressions in Index Form': {
        topic: 'Algebraic Expressions in Index Form',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "Index form (also called exponential form) is a shorthand way of writing repeated multiplication. In this topic you learn to express products using indices, apply the laws of indices to simplify expressions, and find the H.C.F. and L.C.M. of algebraic expressions in index form. These skills are essential for simplifying algebraic fractions, solving exponential equations, and scientific notation in later topics.",
        sections: [
            {
                title: '1. Writing Products in Index Form',
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Algebra__Cracking_the_Index_Code.mp4',
                content: "## Base and Index (Exponent)\n\nIn $a^n$:\n- $a$ is the **base**\n- $n$ is the **index** (or exponent or power)\n- $a^n$ means $a$ multiplied by itself $n$ times\n\n$$a^n = \\\\underbrace{a \\\\times a \\\\times a \\\\times \\\\cdots \\\\times a}_{n \\\\text{ times}}$$\n\n## Examples\n\n$$x \\\\times x \\\\times x = x^3$$\n$$2 \\\\times a \\\\times a \\\\times b \\\\times b \\\\times b = 2a^2b^3$$\n$$3 \\\\times 3 \\\\times 3 \\\\times 3 = 3^4 = 81$$\n\n## Special Values\n\n$$a^1 = a \\quad \\text{(any number to the power 1 is itself)}$$\n$$a^0 = 1 \\quad \\text{(any non-zero number to the power 0 is 1)}$$",
                worked_examples: [
                    {
                        question: "Write $5 \\\\times p \\\\times p \\\\times q \\\\times p \\\\times q \\\\times q$ in index form.",
                        steps: [
                            "Count the $p$s: $p$ appears 3 times → $p^3$",
                            "Count the $q$s: $q$ appears 3 times → $q^3$",
                            "Coefficient: 5",
                            "Result: $5p^3q^3$"
                        ],
                        final_answer: "$5p^3q^3$"
                    }
                ]
            },
            {
                title: '2. Laws of Indices — Multiplication',
                content: "## Law 1: Multiplying Same Bases\n\nWhen multiplying powers with the **same base**, **add** the indices:\n\n$$a^m \\\\times a^n = a^{m+n}$$\n\n## Why?\n\n$$a^3 \\\\times a^2 = (a \\\\times a \\\\times a) \\\\times (a \\\\times a) = a^5 = a^{3+2}$$\n\n## Examples\n\n$$x^4 \\\\times x^3 = x^{4+3} = x^7$$\n$$2a^2 \\\\times 3a^5 = 6a^{2+5} = 6a^7$$\n$$m^3 \\\\times m = m^{3+1} = m^4$$\n\n## Important Note\n\nThe bases must be the **same**. You cannot simplify $x^3 \\\\times y^2$ using this law.",
                worked_examples: [
                    {
                        question: "Simplify $4x^3y^2 \\\\times 3x^2y^5$.",
                        steps: [
                            "Multiply coefficients: $4 \\\\times 3 = 12$",
                            "Add $x$ indices: $x^{3+2} = x^5$",
                            "Add $y$ indices: $y^{2+5} = y^7$",
                            "Result: $12x^5y^7$"
                        ],
                        final_answer: "$12x^5y^7$"
                    }
                ]
            },
            {
                title: '3. Laws of Indices — Division',
                content: "## Law 2: Dividing Same Bases\n\nWhen dividing powers with the **same base**, **subtract** the indices:\n\n$$a^m \\\\div a^n = a^{m-n}$$\n\n## Why?\n\n$$\\\\frac{a^5}{a^2} = \\\\frac{a \\\\times a \\\\times a \\\\times a \\\\times a}{a \\\\times a} = a^3 = a^{5-2}$$\n\n## Examples\n\n$$x^8 \\\\div x^3 = x^{8-3} = x^5$$\n$$\\\\frac{12a^6}{4a^2} = 3a^{6-2} = 3a^4$$\n\n## Zero Index\n\nWhen $m = n$:\n$$a^n \\\\div a^n = a^{n-n} = a^0 = 1$$\n\nThis confirms $a^0 = 1$ for any $a \\\\neq 0$.",
                worked_examples: [
                    {
                        question: "Simplify $\\\\frac{18m^5n^3}{6m^2n}$.",
                        steps: [
                            "Divide coefficients: $\\\\frac{18}{6} = 3$",
                            "Subtract $m$ indices: $m^{5-2} = m^3$",
                            "Subtract $n$ indices: $n^{3-1} = n^2$",
                            "Result: $3m^3n^2$"
                        ],
                        final_answer: "$3m^3n^2$"
                    }
                ]
            },
            {
                title: '4. Laws of Indices — Power of a Power',
                content: "## Law 3: Raising a Power to a Power\n\n$$(a^m)^n = a^{m \\\\times n}$$\n\n## Why?\n\n$$(a^3)^2 = a^3 \\\\times a^3 = a^{3+3} = a^6 = a^{3 \\\\times 2}$$\n\n## Combined with Coefficients\n\n$$(2a^3)^4 = 2^4 \\\\times (a^3)^4 = 16a^{12}$$\n\n## Power of a Product\n\n$$(ab)^n = a^n b^n$$\n\n$$(3xy)^2 = 9x^2y^2$$\n\n## Power of a Fraction\n\n$$\\\\left(\\\\frac{a}{b}\\\\right)^n = \\\\frac{a^n}{b^n}$$\n\n$$\\\\left(\\\\frac{x}{3}\\\\right)^2 = \\\\frac{x^2}{9}$$",
                worked_examples: [
                    {
                        question: "Simplify $(3a^2b)^3$.",
                        steps: [
                            "Apply power to coefficient: $3^3 = 27$",
                            "Apply power to $a^2$: $(a^2)^3 = a^{2 \\\\times 3} = a^6$",
                            "Apply power to $b$: $b^3$",
                            "Result: $27a^6b^3$"
                        ],
                        final_answer: "$27a^6b^3$"
                    },
                    {
                        question: "Simplify $\\\\frac{(2x^3)^2 \\\\times x^4}{4x^5}$.",
                        steps: [
                            "Numerator: $(2x^3)^2 = 4x^6$, then $4x^6 \\\\times x^4 = 4x^{10}$",
                            "Fraction: $\\\\frac{4x^{10}}{4x^5}$",
                            "Simplify: $x^{10-5} = x^5$"
                        ],
                        final_answer: "$x^5$"
                    }
                ]
            },
            {
                title: '5. Algebraic H.C.F. and L.C.M. Using Index Form',
                content: "## Algebraic H.C.F.\n\nTo find the H.C.F. of algebraic expressions:\n1. Find the H.C.F. of the numerical coefficients.\n2. For each variable, take the **lowest** power present in **all** terms.\n\n## Algebraic L.C.M.\n\nTo find the L.C.M. of algebraic expressions:\n1. Find the L.C.M. of the numerical coefficients.\n2. For each variable, take the **highest** power present in **any** term.\n\n## Example\n\nFind the H.C.F. and L.C.M. of $12a^3b^2c$ and $18a^2b^4$.\n\n**H.C.F.**:\n- Numbers: HCF(12, 18) = 6\n- $a$: min(3, 2) = $a^2$\n- $b$: min(2, 4) = $b^2$\n- $c$: not in both → omit\n- H.C.F. = $6a^2b^2$\n\n**L.C.M.**:\n- Numbers: LCM(12, 18) = 36\n- $a$: max(3, 2) = $a^3$\n- $b$: max(2, 4) = $b^4$\n- $c$: appears → include $c$\n- L.C.M. = $36a^3b^4c$",
                worked_examples: [
                    {
                        question: "Find the H.C.F. and L.C.M. of $8x^4y^2$ and $12x^2y^5$.",
                        steps: [
                            "H.C.F. of 8, 12 = 4; L.C.M. of 8, 12 = 24",
                            "For $x$: min(4,2) = $x^2$; max(4,2) = $x^4$",
                            "For $y$: min(2,5) = $y^2$; max(2,5) = $y^5$",
                            "H.C.F. = $4x^2y^2$",
                            "L.C.M. = $24x^4y^5$"
                        ],
                        final_answer: "H.C.F. = $4x^2y^2$, L.C.M. = $24x^4y^5$"
                    }
                ]
            }
        ],
        key_points: [
            "$a^n$ means $a$ multiplied by itself $n$ times; $a$ is the base, $n$ is the index",
            "Multiplication law: $a^m \\\\times a^n = a^{m+n}$ (add indices)",
            "Division law: $a^m \\\\div a^n = a^{m-n}$ (subtract indices)",
            "Power of a power: $(a^m)^n = a^{mn}$ (multiply indices)",
            "$a^0 = 1$ for any non-zero $a$; $a^1 = a$",
            "H.C.F. uses lowest powers of common variables; L.C.M. uses highest powers of all variables",
            "When multiplying terms, multiply coefficients and add indices of same bases",
            "These laws only apply when the bases are the same"
        ],
        exam_tips: [
            "Write the law you are using — examiners look for correct application of index laws.",
            "Do not confuse $2x^3$ (only $x$ is cubed) with $(2x)^3$ (both 2 and $x$ are cubed).",
            "Remember: $a^0 = 1$, not 0. This is tested frequently.",
            "For H.C.F./L.C.M. questions, set up a table of each variable and its powers — it prevents mistakes.",
            "When simplifying complex expressions, work step by step: expand powers first, then multiply/divide."
        ],
        visual_descriptions: [
            "A diagram showing $a^3 \\\\times a^2 = a^5$ with groups of $a$s being combined",
            "A table comparing H.C.F. (lowest powers) vs L.C.M. (highest powers) for algebraic terms",
            "An index laws summary card with all three laws and their conditions"
        ]
    },

    // ============================================
    // TOPIC 19: LINES AND ANGLES (Form 1)
    // ============================================
    'Lines and Angles': {
        topic: 'Lines and Angles',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "Lines and Angles is a core geometry topic in the ZIMSEC O-Level syllabus. You learn to identify different types of lines (parallel, perpendicular, transversal) and angles (acute, right, obtuse, reflex, straight). You also learn angle relationships: angles on a straight line, angles at a point, vertically opposite angles, and the angle pairs formed when a transversal crosses parallel lines (alternate, corresponding, and co-interior angles). These relationships are used to calculate unknown angles, which is one of the most common ZIMSEC examination questions.",
        sections: [
            {
                title: '1. Types of Lines',
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Form_1__Lines_%26_Angles.mp4',
                content: "## Line, Ray, and Line Segment\n\n- **Line**: extends infinitely in both directions (← →)\n- **Ray**: starts at a point and extends infinitely in one direction (• →)\n- **Line segment**: has two endpoints (• — •)\n\n## Special Line Types\n\n| Type | Definition | Notation |\n|------|-----------|----------|\n| **Parallel lines** | Lines that never meet; always the same distance apart | $AB \\\\parallel CD$ |\n| **Perpendicular lines** | Lines that meet at 90° | $AB \\\\perp CD$ |\n| **Transversal** | A line that crosses two or more other lines | — |\n\n## Parallel Line Notation\n\nParallel lines are shown with matching arrows (→ →) on diagrams. If two pairs of parallel lines exist, use single arrows for one pair and double arrows for the other.",
                worked_examples: [
                    {
                        question: "From a diagram showing lines PQ, RS, and TU, identify which lines are parallel, perpendicular, or transversal.",
                        steps: [
                            "Check for equal distance / arrow marks → parallel lines",
                            "Check for right-angle marks (□) → perpendicular lines",
                            "Check for a line crossing others → transversal"
                        ],
                        final_answer: "Identification depends on the diagram markings: arrows indicate parallel lines, square corners indicate perpendicular lines"
                    }
                ]
            },
            {
                title: '2. Types of Angles',
                content: "## Angle Classification\n\n| Type | Size | Example |\n|------|------|---------|\n| **Acute** | Between 0° and 90° | 45° |\n| **Right** | Exactly 90° | 90° |\n| **Obtuse** | Between 90° and 180° | 120° |\n| **Straight** | Exactly 180° | 180° |\n| **Reflex** | Between 180° and 360° | 250° |\n| **Revolution** | Exactly 360° | 360° |\n\n## Measuring Angles\n\nAngles are measured in **degrees** (°) using a **protractor**.\n\n## Naming Angles\n\nUse three letters with the vertex (corner) in the middle:\n- $\\\\angle ABC$ means the angle at vertex B\n- The middle letter is always the vertex\n\n## Complementary and Supplementary\n\n- **Complementary angles** add up to 90°\n- **Supplementary angles** add up to 180°",
                worked_examples: [
                    {
                        question: "Classify each angle: (a) 73° (b) 156° (c) 90° (d) 310°",
                        steps: [
                            "(a) 73° is between 0° and 90° → acute",
                            "(b) 156° is between 90° and 180° → obtuse",
                            "(c) 90° is exactly 90° → right angle",
                            "(d) 310° is between 180° and 360° → reflex"
                        ],
                        final_answer: "(a) Acute (b) Obtuse (c) Right (d) Reflex"
                    }
                ]
            },
            {
                title: '3. Angles on a Straight Line and at a Point',
                content: "## Angles on a Straight Line\n\nAngles on a straight line add up to **180°**.\n\n$$a + b = 180°$$\n\n## Angles at a Point\n\nAngles around a point add up to **360°**.\n\n$$a + b + c + d = 360°$$\n\n## Application\n\nIf two of three angles on a straight line are known, the third can be found:\n$$\\\\text{Unknown} = 180° - \\\\text{sum of known angles}$$",
                worked_examples: [
                    {
                        question: "Angles on a straight line are $x$, $2x$, and $60°$. Find $x$.",
                        steps: [
                            "Sum of angles on a straight line = 180°",
                            "$x + 2x + 60° = 180°$",
                            "$3x = 120°$",
                            "$x = 40°$"
                        ],
                        final_answer: "$x = 40°$"
                    },
                    {
                        question: "Four angles meet at a point: $90°$, $x$, $2x$, and $150°$. Find $x$.",
                        steps: [
                            "Sum of angles at a point = 360°",
                            "$90° + x + 2x + 150° = 360°$",
                            "$240° + 3x = 360°$",
                            "$3x = 120°$",
                            "$x = 40°$"
                        ],
                        final_answer: "$x = 40°$"
                    }
                ]
            },
            {
                title: '4. Vertically Opposite Angles',
                content: "## Definition\n\nWhen two straight lines cross, they form two pairs of **vertically opposite angles**.\n\n## Property\n\n> Vertically opposite angles are **equal**.\n\nIf two lines cross forming angles $a$, $b$, $c$, $d$ (going around):\n- $a = c$ (vertically opposite)\n- $b = d$ (vertically opposite)\n- $a + b = 180°$ (on a straight line)\n\n## Why Are They Equal?\n\n$a + b = 180°$ and $b + c = 180°$\n\nTherefore $a = c$.",
                worked_examples: [
                    {
                        question: "Two straight lines intersect. One of the angles formed is $65°$. Find all four angles.",
                        steps: [
                            "Let the angles be $a$, $b$, $c$, $d$ going clockwise",
                            "$a = 65°$ (given)",
                            "$c = 65°$ (vertically opposite to $a$)",
                            "$b = 180° - 65° = 115°$ (on a straight line with $a$)",
                            "$d = 115°$ (vertically opposite to $b$)"
                        ],
                        final_answer: "The four angles are $65°$, $115°$, $65°$, $115°$"
                    }
                ]
            },
            {
                title: '5. Angles Formed by Parallel Lines and a Transversal',
                content: "## Three Important Angle Pairs\n\nWhen a transversal crosses two parallel lines, it creates 8 angles. Three special pairs are:\n\n### 1. Corresponding Angles (F-angles)\n- In the same position at each intersection\n- They are **equal**\n- Form an F-shape (or reversed F)\n\n### 2. Alternate Angles (Z-angles)\n- On opposite sides of the transversal, between the parallel lines\n- They are **equal**\n- Form a Z-shape (or reversed Z / S-shape)\n\n### 3. Co-interior Angles (C-angles / Allied angles)\n- On the same side of the transversal, between the parallel lines\n- They add up to **180°** (supplementary)\n- Form a C-shape or U-shape\n\n## Memory Aid\n\n| Pair | Shape | Relationship |\n|------|-------|--------------|\n| Corresponding | F | Equal |\n| Alternate | Z | Equal |\n| Co-interior | C/U | Sum = 180° |",
                worked_examples: [
                    {
                        question: "Lines $AB \\\\parallel CD$. A transversal crosses them making an angle of $72°$ at $AB$. Find the alternate angle and co-interior angle at $CD$.",
                        steps: [
                            "Alternate angle = $72°$ (alternate angles are equal)",
                            "Co-interior angle = $180° - 72° = 108°$ (co-interior angles are supplementary)"
                        ],
                        final_answer: "Alternate angle = $72°$, Co-interior angle = $108°$"
                    }
                ]
            },
            {
                title: '6. Solving Multi-Step Angle Problems',
                content: "## Strategy for Complex Diagrams\n\n1. **Identify** parallel lines (look for arrows).\n2. **Identify** the transversal(s).\n3. **Name** each angle relationship you use.\n4. **State the reason** for each step — ZIMSEC requires this.\n5. **Calculate** step by step.\n\n## Common Reasons to State\n\n- \"Angles on a straight line add up to 180°\"\n- \"Vertically opposite angles are equal\"\n- \"Alternate angles are equal (parallel lines)\"\n- \"Corresponding angles are equal (parallel lines)\"\n- \"Co-interior angles add up to 180° (parallel lines)\"\n- \"Angles at a point add up to 360°\"\n\n## ZIMSEC Marking\n\nYou typically earn:\n- 1 mark for the calculation\n- 1 mark for the reason\n\nAlways give both!",
                worked_examples: [
                    {
                        question: "In a diagram, $PQ \\\\parallel RS$. Angle $QPT = 55°$ and angle $PTS = x$. The line $PT$ is a transversal. Find $x$ if the angles are co-interior.",
                        steps: [
                            "Co-interior angles between parallel lines sum to 180°",
                            "$55° + x = 180°$",
                            "$x = 180° - 55° = 125°$"
                        ],
                        final_answer: "$x = 125°$ (co-interior angles, $PQ \\\\parallel RS$)"
                    }
                ]
            }
        ],
        key_points: [
            "Parallel lines never meet and are marked with arrows; perpendicular lines meet at 90°",
            "Acute < 90°; Right = 90°; Obtuse 90°–180°; Straight = 180°; Reflex 180°–360°",
            "Angles on a straight line sum to 180°; angles at a point sum to 360°",
            "Vertically opposite angles are equal",
            "Corresponding angles (F-shape) are equal when lines are parallel",
            "Alternate angles (Z-shape) are equal when lines are parallel",
            "Co-interior angles (C-shape) sum to 180° when lines are parallel",
            "Always state the angle relationship as a reason in your working"
        ],
        exam_tips: [
            "ZIMSEC always requires a REASON with each angle calculation — no reason = no mark.",
            "Use the F, Z, C memory aids to quickly identify angle pairs in diagrams.",
            "If a diagram doesn't state lines are parallel, do NOT assume they are.",
            "Mark angles you've calculated on the diagram as you go.",
            "Check your answer makes sense — an obtuse angle should look obtuse on the diagram.",
            "Read the question carefully: it may say 'Give reasons for your answer' — this is compulsory."
        ],
        visual_descriptions: [
            "Two parallel lines cut by a transversal, with all 8 angles labelled and F, Z, C shapes highlighted in different colours",
            "A diagram showing two intersecting straight lines with four angles labelled, demonstrating vertically opposite angles",
            "A reference card showing angle types with visual representations: acute (narrow), right (L-shape), obtuse (wide), reflex (greater than half turn)"
        ]
    },

    // ============================================
    // TOPIC 20: CIRCLES (Form 1)
    // ============================================
    'Circles': {
        topic: 'Circles',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "This topic introduces the circle and its key parts. You will learn to name and identify the radius, diameter, chord, arc, sector, segment, tangent, and circumference. You will also learn about lines and regions associated with circles. Understanding circle terminology is essential for later topics including circle theorems, area and circumference calculations, and construction problems in the ZIMSEC syllabus.",
        sections: [
            {
                title: '1. Definition and Parts of a Circle',
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Form_1_Maths__Circles.mp4',
                content: "## What Is a Circle?\n\nA circle is the set of all points in a plane that are a fixed distance from a fixed point.\n\n- The fixed point is the **centre** (usually labelled O).\n- The fixed distance is the **radius**.\n\n## Key Parts\n\n| Part | Definition |\n|------|------------|\n| **Centre (O)** | The fixed point in the middle |\n| **Radius (r)** | Distance from centre to any point on the circle |\n| **Diameter (d)** | A straight line through the centre connecting two points on the circle; $d = 2r$ |\n| **Circumference** | The perimeter (distance around) the circle |\n| **Chord** | A straight line connecting any two points on the circle |\n| **Arc** | A part (curve) of the circumference |\n| **Semicircle** | Half the circle; formed by a diameter |\n\n## Diameter and Radius Relationship\n\n$$d = 2r \\quad \\text{or} \\quad r = \\\\frac{d}{2}$$\n\nThe diameter is the **longest chord** of a circle.",
                worked_examples: [
                    {
                        question: "A circle has a radius of 7 cm. What is its diameter?",
                        steps: [
                            "$d = 2r$",
                            "$d = 2 \\\\times 7 = 14$ cm"
                        ],
                        final_answer: "Diameter = 14 cm"
                    },
                    {
                        question: "A circle has a diameter of 20 cm. A chord PQ is drawn 8 cm from the centre. Name the line from the centre to the chord.",
                        steps: [
                            "The line from the centre to the midpoint of a chord is the perpendicular distance",
                            "This is a perpendicular from the centre to the chord",
                            "Note: the radius = $\\\\frac{20}{2} = 10$ cm"
                        ],
                        final_answer: "The perpendicular distance from centre O to chord PQ is 8 cm"
                    }
                ]
            },
            {
                title: '2. Arcs, Sectors, and Segments',
                content: "## Arcs\n\nAn **arc** is a portion of the circumference.\n\n- **Minor arc**: the shorter arc (less than half the circumference)\n- **Major arc**: the longer arc (more than half the circumference)\n\n## Sectors\n\nA **sector** is the region bounded by two radii and an arc — shaped like a slice of pie.\n\n- **Minor sector**: bounded by the minor arc\n- **Major sector**: bounded by the major arc\n\n## Segments\n\nA **segment** is the region between a chord and the arc it cuts off.\n\n- **Minor segment**: the smaller region\n- **Major segment**: the larger region\n\n## Semicircle\n\nA diameter divides a circle into two **semicircles** — two equal halves.\n\n## Summary Relationships\n\n- 2 radii + arc = sector\n- chord + arc = segment\n- diameter divides into 2 semicircles",
                worked_examples: [
                    {
                        question: "A chord AB divides a circle into two parts. Name the two regions formed.",
                        steps: [
                            "The chord separates the circle's interior into two regions",
                            "The smaller region between the chord and the minor arc is the minor segment",
                            "The larger region between the chord and the major arc is the major segment"
                        ],
                        final_answer: "Minor segment and major segment"
                    }
                ]
            },
            {
                title: '3. Tangent and Secant Lines',
                content: "## Tangent\n\nA **tangent** is a straight line that touches the circle at exactly **one point**. This point is called the **point of tangency** (or point of contact).\n\n### Key Property\n\n> A tangent is **perpendicular** to the radius at the point of tangency.\n\nThis means the angle between the tangent and the radius is always $90°$.\n\n## Secant\n\nA **secant** is a straight line that cuts through the circle at **two points**.\n\nA chord is the part of a secant that lies inside the circle.\n\n## Lines and the Circle\n\n| Line Type | Intersection Points |\n|-----------|--------------------|\n| Tangent | 1 (touches) |\n| Secant | 2 (cuts through) |\n| External line | 0 (misses) |\n| Chord | 2 (both on circle) |\n| Diameter | 2 (through centre) |",
                worked_examples: [
                    {
                        question: "A tangent touches a circle of radius 5 cm at point T. What is the angle between the tangent and radius OT?",
                        steps: [
                            "By the tangent-radius property, a tangent is perpendicular to the radius at the point of contact",
                            "Therefore the angle = 90°"
                        ],
                        final_answer: "The angle is $90°$"
                    }
                ]
            },
            {
                title: '4. Lines and Regions in a Circle',
                content: "## Internal and External Points\n\n- A point **inside** the circle: its distance from the centre is less than the radius\n- A point **on** the circle: its distance from the centre equals the radius\n- A point **outside** the circle: its distance from the centre is greater than the radius\n\n## Regions\n\nThe circle divides the plane into:\n1. The **interior** (inside the circle)\n2. The **circle itself** (the circumference)\n3. The **exterior** (outside the circle)\n\n## Concentric Circles\n\nCircles with the **same centre** but different radii are called **concentric circles**. The region between two concentric circles is called an **annulus** (ring-shaped).\n\n## Intersecting Circles\n\nTwo circles can:\n- Not touch (external or one inside the other)\n- Touch at one point (externally or internally tangent)\n- Intersect at two points\n\nThe line joining the centres of two intersecting circles bisects the common chord perpendicularly.",
                worked_examples: [
                    {
                        question: "A circle has centre O and radius 6 cm. Point P is 4 cm from O, point Q is 6 cm from O, and point R is 9 cm from O. Classify each point.",
                        steps: [
                            "P: distance 4 cm < radius 6 cm → inside the circle",
                            "Q: distance 6 cm = radius 6 cm → on the circle",
                            "R: distance 9 cm > radius 6 cm → outside the circle"
                        ],
                        final_answer: "P is inside, Q is on, R is outside the circle"
                    }
                ]
            }
        ],
        key_points: [
            "The radius is the distance from the centre to the circumference; diameter = 2 × radius",
            "A chord connects two points on the circle; the diameter is the longest possible chord",
            "An arc is a part of the circumference; a minor arc is shorter than a semicircle",
            "A sector is the 'pie slice' region between two radii and an arc",
            "A segment is the region between a chord and an arc",
            "A tangent touches the circle at exactly one point and is perpendicular to the radius there",
            "Concentric circles share the same centre but have different radii"
        ],
        exam_tips: [
            "Know the difference between a sector (two radii + arc) and a segment (chord + arc).",
            "When labelling circle parts in an exam, use the correct vocabulary — marks are awarded for correct terminology.",
            "Remember: tangent ⊥ radius at the point of contact. This is frequently tested.",
            "Draw neat diagrams with labelled parts to support your answers.",
            "ZIMSEC may ask you to identify parts from a given diagram — practise naming each part."
        ],
        visual_descriptions: [
            "A labelled circle diagram showing centre O, radius, diameter, chord, arc (minor and major), sector, and segment with clear annotations",
            "A diagram showing a tangent line touching a circle at point T with the right angle marked between the tangent and radius OT",
            "Concentric circles with the annulus (ring region) shaded between them"
        ]
    },

    // ============================================
    // TOPIC 21: POLYGONS (Form 1)
    // ============================================
    'Polygons': {
        topic: 'Polygons',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "A polygon is a closed plane figure made up of straight line segments. In this topic you learn to name and classify polygons according to their number of sides (from triangles to decagons), distinguish between regular and irregular polygons, and calculate the angle sums of triangles and quadrilaterals. This knowledge is fundamental for geometry, construction, tessellation, and the more advanced polygon angle-sum formula you will meet in later forms.",
        sections: [
            {
                title: '1. What Is a Polygon?',
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Cracking_the_Polygon_Code.mp4',
                content: "## Definition\n\nA **polygon** is a closed 2D shape with **straight sides**.\n\n## Properties\n\n- All sides are straight line segments\n- The figure is closed (no gaps)\n- Sides do not cross each other\n\n## NOT Polygons\n\n- Circles (curved, not straight sides)\n- Open shapes\n- Figures with crossing sides (these are called **complex** or **self-intersecting** figures)\n\n## Convex vs Concave\n\n- **Convex polygon**: all interior angles are less than 180°\n- **Concave polygon**: at least one interior angle is greater than 180° (reflex angle)",
                worked_examples: []
            },
            {
                title: '2. Naming Polygons by Number of Sides',
                content: "## Polygon Names\n\n| Number of Sides | Name | Example |\n|----------------|------|---------|\n| 3 | Triangle | △ |\n| 4 | Quadrilateral | □ |\n| 5 | Pentagon | ⬠ |\n| 6 | Hexagon | ⬡ |\n| 7 | Heptagon | — |\n| 8 | Octagon | 🛑 |\n| 9 | Nonagon | — |\n| 10 | Decagon | — |\n\n## Memory Aid\n\nTri = 3, Quad = 4, Pent = 5, Hex = 6, Hept = 7, Oct = 8, Non = 9, Dec = 10\n\nThink: \"Tri-cycle (3 wheels), Quad-bike (4 wheels), Pentagon building (5 sides), Hexagonal cells in a beehive (6 sides), Octopus (8 legs), Decade (10 years).\"\n\n## Number of Properties\n\nAn $n$-sided polygon has:\n- $n$ sides\n- $n$ vertices (corners)\n- $n$ interior angles",
                worked_examples: [
                    {
                        question: "Name the polygon with 8 sides. How many vertices and interior angles does it have?",
                        steps: [
                            "8-sided polygon = octagon",
                            "Number of vertices = 8 (one at each corner)",
                            "Number of interior angles = 8"
                        ],
                        final_answer: "Octagon with 8 vertices and 8 interior angles"
                    }
                ]
            },
            {
                title: '3. Regular and Irregular Polygons',
                content: "## Regular Polygon\n\nA polygon is **regular** if:\n- All sides are **equal** in length, AND\n- All interior angles are **equal** in size\n\nBoth conditions must hold!\n\n## Examples\n\n| Polygon | Regular Version | Interior Angle |\n|---------|----------------|----------------|\n| Triangle | Equilateral triangle | 60° |\n| Quadrilateral | Square | 90° |\n| Pentagon | Regular pentagon | 108° |\n| Hexagon | Regular hexagon | 120° |\n\n## Irregular Polygon\n\nA polygon that does **not** have all sides equal **or** does not have all angles equal.\n\nExamples: rectangle (equal angles but not all sides equal — irregular!), scalene triangle, parallelogram.\n\n## Special Quadrilaterals\n\n- **Square**: regular quadrilateral (all sides and angles equal)\n- **Rectangle**: all angles equal (90°) but sides not all equal\n- **Rhombus**: all sides equal but angles not all equal\n- **Parallelogram**: opposite sides equal, opposite angles equal",
                worked_examples: [
                    {
                        question: "Is a rectangle a regular polygon? Explain.",
                        steps: [
                            "A regular polygon must have all sides equal AND all angles equal",
                            "A rectangle has all angles equal (90°) ✓",
                            "But a rectangle does not necessarily have all sides equal ✗ (length ≠ width unless it's a square)",
                            "Therefore a rectangle is NOT regular (unless it is a square)"
                        ],
                        final_answer: "No, a rectangle is irregular because not all sides are equal"
                    }
                ]
            },
            {
                title: '4. Angle Sum of Triangles and Quadrilaterals',
                content: "## Angle Sum of a Triangle\n\n> The interior angles of a triangle add up to **180°**.\n\n$$a + b + c = 180°$$\n\nThis is true for ALL triangles: equilateral, isosceles, scalene, right-angled.\n\n## Types of Triangles by Angles\n\n| Type | Properties |\n|------|------------|\n| Acute | All angles < 90° |\n| Right-angled | One angle = 90° |\n| Obtuse | One angle > 90° |\n\n## Angle Sum of a Quadrilateral\n\n> The interior angles of a quadrilateral add up to **360°**.\n\n$$a + b + c + d = 360°$$\n\n## Why 360°?\n\nA diagonal divides a quadrilateral into **two triangles**. Each triangle has angles summing to 180°, so $2 \\\\times 180° = 360°$.\n\n## General Formula (Preview)\n\nFor an $n$-sided polygon:\n$$\\\\text{Angle sum} = (n - 2) \\\\times 180°$$\n\n- Triangle ($n=3$): $(3-2) \\\\times 180° = 180°$ ✓\n- Quadrilateral ($n=4$): $(4-2) \\\\times 180° = 360°$ ✓\n- Pentagon ($n=5$): $(5-2) \\\\times 180° = 540°$",
                worked_examples: [
                    {
                        question: "In triangle ABC, angle A = $50°$ and angle B = $75°$. Find angle C.",
                        steps: [
                            "Angle sum of a triangle = 180°",
                            "$50° + 75° + C = 180°$",
                            "$C = 180° - 125° = 55°$"
                        ],
                        final_answer: "$\\\\angle C = 55°$"
                    },
                    {
                        question: "Three angles of a quadrilateral are $85°$, $110°$, and $95°$. Find the fourth angle.",
                        steps: [
                            "Angle sum of a quadrilateral = 360°",
                            "$85° + 110° + 95° + x = 360°$",
                            "$290° + x = 360°$",
                            "$x = 70°$"
                        ],
                        final_answer: "Fourth angle = $70°$"
                    }
                ]
            }
        ],
        key_points: [
            "A polygon is a closed shape with straight sides",
            "Polygons are named by the number of sides: triangle (3), quadrilateral (4), pentagon (5), hexagon (6), heptagon (7), octagon (8), nonagon (9), decagon (10)",
            "A regular polygon has all sides equal AND all angles equal",
            "Interior angles of a triangle sum to 180°",
            "Interior angles of a quadrilateral sum to 360°",
            "General angle sum formula: $(n-2) \\\\times 180°$ for an $n$-sided polygon"
        ],
        exam_tips: [
            "Memorise polygon names up to decagon — ZIMSEC can test naming.",
            "Remember: a rectangle is NOT a regular polygon (sides are not all equal).",
            "Use the angle sum to find missing angles — show the full sum equation.",
            "Draw a diagonal in a quadrilateral to show why the angle sum is 360°.",
            "State the angle sum property you used as a reason in your working."
        ],
        visual_descriptions: [
            "A chart showing polygons from triangle to decagon with their shapes drawn and names labelled",
            "A quadrilateral split into two triangles by a diagonal, showing why the angle sum is $2 \\\\times 180° = 360°$",
            "Regular polygons lined up side by side: equilateral triangle, square, regular pentagon, regular hexagon"
        ]
    },

    // ============================================
    // TOPIC 22: CONSTRUCTION (Form 1)
    // ============================================
    'Construction': {
        topic: 'Construction',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "Geometric construction involves drawing accurate figures using only a ruler (straight edge) and a pair of compasses — and sometimes a protractor. In Form 1 you learn to construct and bisect line segments, construct perpendicular lines, and construct standard angles (60°, 90°, 30°, 45°). Construction questions appear regularly in the ZIMSEC O-Level exam and require precise, neat work with all construction arcs clearly visible.",
        sections: [
            {
                title: '1. Geometric Instruments',
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Mastering_Geo_Constructions.mp4',
                content: "## Required Instruments\n\n| Instrument | Purpose |\n|------------|--------|\n| **Ruler** | Drawing straight lines and measuring lengths |\n| **Pair of compasses** | Drawing arcs and circles; transferring lengths |\n| **Protractor** | Measuring and drawing angles |\n| **Set square** | Drawing perpendicular and parallel lines |\n| **Sharp pencil** | Accuracy of construction |\n\n## ZIMSEC Rules for Construction\n\n1. Use a **sharp pencil** (HB or 2H).\n2. All **construction arcs** must be clearly visible — do NOT erase them.\n3. Lines should be drawn with a **ruler**.\n4. Accuracy is expected to within **1 mm** for lengths and **1°** for angles.\n5. Do NOT use a protractor to construct angles that should be built with compasses (e.g., 60°, 90°).",
                worked_examples: []
            },
            {
                title: '2. Bisecting a Line Segment',
                content: "## The Perpendicular Bisector\n\nThe **perpendicular bisector** of a line segment cuts it in half at right angles.\n\n## Construction Steps\n\nTo bisect line segment AB:\n\n1. Open your compasses to more than half the length of AB.\n2. With centre A, draw arcs above and below the line.\n3. With centre B, using the **same** compass width, draw arcs above and below.\n4. The arcs intersect at two points. Call them P and Q.\n5. Draw a straight line through P and Q.\n\nThis line is the **perpendicular bisector** of AB. It passes through the **midpoint** M of AB, and $PM \\\\perp AB$.\n\n## Properties\n\n- Every point on the perpendicular bisector is equidistant from A and B.\n- $AM = MB = \\\\frac{AB}{2}$",
                worked_examples: [
                    {
                        question: "Construct the perpendicular bisector of a line segment AB = 8 cm.",
                        steps: [
                            "Draw line AB = 8 cm using a ruler",
                            "Set compass to more than 4 cm (e.g., 5 cm)",
                            "With centre A, draw arcs above and below AB",
                            "With centre B (same radius), draw arcs above and below AB",
                            "Mark intersection points P (above) and Q (below)",
                            "Join P and Q with a straight line",
                            "This line crosses AB at midpoint M where AM = MB = 4 cm"
                        ],
                        final_answer: "The perpendicular bisector passes through M, the midpoint of AB, at 90°"
                    }
                ]
            },
            {
                title: '3. Constructing a Perpendicular from a Point to a Line',
                content: "## From a Point on the Line\n\n1. Let P be the point on line $l$.\n2. With centre P, draw arcs cutting the line at A and B (equal distances).\n3. With centres A and B, draw arcs (same radius, larger than AP) intersecting at Q.\n4. Draw PQ — this is perpendicular to $l$ at P.\n\n## From a Point Not on the Line\n\n1. Let P be the point above line $l$.\n2. With centre P, draw an arc that cuts the line at two points A and B.\n3. With centres A and B, draw arcs (same radius) intersecting at Q (on the opposite side from P).\n4. Draw PQ — this is perpendicular to $l$ and passes through P.\n\n## Applications\n\n- Finding the shortest distance from a point to a line\n- Constructing right angles in geometry problems\n- Creating altitude of a triangle",
                worked_examples: [
                    {
                        question: "Construct a perpendicular from point P to line $l$, where P is 3 cm above the line.",
                        steps: [
                            "Draw line $l$ and mark point P about 3 cm above it",
                            "With centre P, draw a large arc cutting $l$ at A and B",
                            "With centre A, draw an arc below $l$",
                            "With centre B (same radius), draw an arc below $l$ intersecting the first arc at Q",
                            "Draw line PQ — this meets $l$ at right angles"
                        ],
                        final_answer: "Line PQ is perpendicular to $l$ passing through P"
                    }
                ]
            },
            {
                title: '4. Constructing a 60° Angle',
                content: "## Why 60° Is Special\n\nA 60° angle appears in equilateral triangles. It can be constructed exactly with compasses because an equilateral triangle has all sides equal.\n\n## Construction Steps\n\n1. Draw a ray OA.\n2. With centre O, draw an arc crossing OA at point B.\n3. With centre B, using the **same** radius, draw an arc crossing the first arc at C.\n4. Draw ray OC.\n5. Angle $AOC = 60°$.\n\n## Why It Works\n\nTriangle OBC is equilateral (all three sides equal the compass radius), so each angle is 60°.\n\n## From 60° to Other Angles\n\n- **30°**: Bisect a 60° angle\n- **90°**: Construct 60° then add 30° (or use the perpendicular method)\n- **120°**: Construct two 60° angles\n- **45°**: Bisect a 90° angle",
                worked_examples: [
                    {
                        question: "Construct an angle of 60° at point O on line OA.",
                        steps: [
                            "Draw ray OA",
                            "Place compass point at O, draw arc cutting OA at B",
                            "Without changing compass width, place compass at B, draw arc cutting the first arc at C",
                            "Draw ray OC",
                            "Angle AOC = 60°"
                        ],
                        final_answer: "Angle $AOC = 60°$ constructed with compasses and ruler"
                    }
                ]
            },
            {
                title: '5. Constructing 90°, 30°, and 45° Angles',
                content: "## Constructing 90°\n\n**Method 1**: Use the perpendicular construction at a point on a line.\n\n**Method 2**: Construct 60°, then from the same base construct another 60° arc to get 120°, then bisect the angle between 60° and 120° to find 90°.\n\n## Constructing 30°\n\n1. Construct a 60° angle.\n2. **Bisect** the 60° angle.\n3. Each half = 30°.\n\n## Bisecting an Angle (General Method)\n\n1. From the vertex, draw an arc crossing both arms at P and Q.\n2. From P and Q, draw equal arcs intersecting at R.\n3. Draw a ray from the vertex through R — this bisects the angle.\n\n## Constructing 45°\n\n1. Construct a 90° angle.\n2. **Bisect** the 90° angle.\n3. Each half = 45°.\n\n## Summary of Constructible Angles\n\n| Angle | Method |\n|-------|--------|\n| 60° | Equilateral triangle construction |\n| 30° | Bisect 60° |\n| 90° | Perpendicular construction |\n| 45° | Bisect 90° |\n| 120° | Two consecutive 60° angles |\n| 150° | 180° − 30° |",
                worked_examples: [
                    {
                        question: "Construct an angle of 45° at point O.",
                        steps: [
                            "First construct a 90° angle at O using the perpendicular method",
                            "Let the 90° angle be $\\\\angle AOB$",
                            "Place compass at O, draw arc cutting OA at P and OB at Q",
                            "From P and Q, draw equal arcs intersecting at R",
                            "Draw OR — this bisects the 90° angle into two 45° angles",
                            "$\\\\angle AOR = 45°$"
                        ],
                        final_answer: "Angle of 45° constructed by bisecting a 90° angle"
                    },
                    {
                        question: "Construct an angle of 30° at point O.",
                        steps: [
                            "First construct a 60° angle at O (equilateral triangle method)",
                            "Let the 60° angle be $\\\\angle AOC$",
                            "Place compass at O, draw arc cutting OA at P and OC at Q",
                            "From P and Q, draw equal arcs intersecting at R",
                            "Draw OR — this bisects the 60° angle",
                            "$\\\\angle AOR = 30°$"
                        ],
                        final_answer: "Angle of 30° constructed by bisecting a 60° angle"
                    }
                ]
            }
        ],
        key_points: [
            "Constructions use only a ruler (straight edge) and compasses — no protractor for standard angles",
            "All construction arcs must be left visible — never erase them",
            "The perpendicular bisector of a line segment passes through its midpoint at 90°",
            "A 60° angle is constructed using the equilateral triangle principle",
            "30° = half of 60°; 45° = half of 90°; each obtained by angle bisection",
            "Bisect an angle by drawing equal arcs from each arm and joining the vertex to their intersection",
            "ZIMSEC expects accuracy within 1 mm and 1°"
        ],
        exam_tips: [
            "NEVER erase construction arcs — you will lose marks if they are not visible.",
            "Use a sharp pencil for accurate constructions.",
            "Label all points clearly (A, B, C, O, etc.).",
            "If the question says 'construct', you must use compasses. If it says 'draw', you may use a protractor.",
            "Check your angle with a protractor after construction to ensure accuracy."
        ],
        visual_descriptions: [
            "Step-by-step construction of a perpendicular bisector showing the arcs from A and B intersecting at two points",
            "Construction of a 60° angle showing the equilateral triangle formed by equal compass arcs",
            "Construction of a 45° angle showing first the 90° construction then the bisection arcs"
        ]
    },

    // ============================================
    // TOPIC 23: SYMMETRY (Form 1)
    // ============================================
    'Symmetry': {
        topic: 'Symmetry',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "Symmetry is about balanced, mirror-image patterns. A shape has symmetry if it can be divided into parts that are mirror images of each other. In Form 1 you focus on reflective (line) symmetry — identifying lines of symmetry in common shapes, letters, and everyday objects. Symmetry underpins many areas of mathematics including geometry, transformations, and pattern recognition. It also appears in nature, art, and design.",
        sections: [
            {
                title: '1. What Is Symmetry?',
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Symmetry__Balance_in_Shapes.mp4',
                content: "## Reflective Symmetry (Line Symmetry)\n\nA shape has **reflective symmetry** if it can be folded along a line so that one half exactly covers the other half.\n\nThe fold line is called the **line of symmetry** (also called the **mirror line** or **axis of symmetry**).\n\n## How to Test for Symmetry\n\n1. Imagine folding the shape along the proposed line.\n2. If both halves match perfectly, it is a line of symmetry.\n3. Alternatively, place a mirror along the line — the reflection should complete the shape.\n\n## Key Idea\n\nEach point on one side of the line has a matching point on the other side, at the **same perpendicular distance** from the line.\n\n## Number of Lines of Symmetry\n\nA shape can have 0, 1, 2, 3, or more lines of symmetry. A circle has **infinite** lines of symmetry.",
                worked_examples: [
                    {
                        question: "Does the letter 'B' have a line of symmetry?",
                        steps: [
                            "Check vertical fold: left and right halves are NOT mirror images (the bumps are on the right only) ✗",
                            "Check horizontal fold: top and bottom halves are mirror images ✓",
                            "B has one horizontal line of symmetry"
                        ],
                        final_answer: "Yes, B has 1 line of symmetry (horizontal)"
                    }
                ]
            },
            {
                title: '2. Lines of Symmetry in Common Shapes',
                content: "## Table of Symmetry\n\n| Shape | Lines of Symmetry |\n|-------|-------------------|\n| Scalene triangle | 0 |\n| Isosceles triangle | 1 |\n| Equilateral triangle | 3 |\n| Rectangle | 2 |\n| Square | 4 |\n| Rhombus | 2 |\n| Parallelogram | 0 |\n| Trapezium (general) | 0 |\n| Isosceles trapezium | 1 |\n| Kite | 1 |\n| Regular pentagon | 5 |\n| Regular hexagon | 6 |\n| Circle | Infinite (∞) |\n\n## Pattern for Regular Polygons\n\nA **regular $n$-gon** has exactly **$n$ lines of symmetry**.\n\n## Where Are the Lines?\n\n- **Square**: 2 through midpoints of opposite sides + 2 through opposite corners = 4\n- **Rectangle**: 2 through midpoints of opposite sides (the diagonals are NOT lines of symmetry!)\n- **Equilateral triangle**: each line passes through a vertex and the midpoint of the opposite side",
                worked_examples: [
                    {
                        question: "How many lines of symmetry does a regular hexagon have? Where are they?",
                        steps: [
                            "A regular hexagon has 6 sides, so it has 6 lines of symmetry",
                            "3 lines pass through opposite vertices",
                            "3 lines pass through midpoints of opposite sides"
                        ],
                        final_answer: "6 lines of symmetry"
                    }
                ]
            },
            {
                title: '3. Symmetry in Letters of the Alphabet',
                content: "## Capital Letters with Line Symmetry\n\n### Vertical line of symmetry:\nA, M, T, U, V, W, Y\n\n### Horizontal line of symmetry:\nB, C, D, E, K\n\n### Both vertical and horizontal:\nH, I, O, X\n\n### No line of symmetry:\nF, G, J, L, N, P, Q, R, S, Z\n\n## Notes\n\n- The exact symmetry depends on the font used. In standard block capital letters, the above classifications hold.\n- O has infinite lines of symmetry if drawn as a perfect circle, or 2 if drawn as an oval.\n- Some letters like S and Z have **rotational symmetry** but no reflective symmetry.\n\n## Practical Application\n\nSymmetry in letters is used in logo design, sign-making, and visual communication.",
                worked_examples: [
                    {
                        question: "List all capital letters that have exactly two lines of symmetry.",
                        steps: [
                            "Check each letter for both vertical and horizontal symmetry",
                            "H: vertical ✓, horizontal ✓ → 2 lines",
                            "I: vertical ✓, horizontal ✓ → 2 lines",
                            "O: vertical ✓, horizontal ✓ → 2 (or more) lines",
                            "X: vertical ✓, horizontal ✓ → 2 lines (plus diagonals in some fonts)"
                        ],
                        final_answer: "H, I, O, X have at least 2 lines of symmetry"
                    }
                ]
            },
            {
                title: '4. Completing Symmetric Figures',
                content: "## Given Half a Shape and a Mirror Line\n\nTo complete a symmetric figure:\n\n1. For each vertex/key point on the given half, measure its **perpendicular distance** from the mirror line.\n2. Plot the reflected point the **same distance** on the other side.\n3. Join the reflected points in the same order.\n\n## Steps in Detail\n\n- Use a ruler and set square to draw perpendiculars to the mirror line.\n- Count squares on grid paper for accuracy.\n- The mirror line can be vertical, horizontal, or diagonal.\n\n## On a Coordinate Grid\n\nIf the mirror line is the $y$-axis:\n- Point $(a, b)$ reflects to $(-a, b)$\n\nIf the mirror line is the $x$-axis:\n- Point $(a, b)$ reflects to $(a, -b)$\n\nIf the mirror line is $y = x$:\n- Point $(a, b)$ reflects to $(b, a)$",
                worked_examples: [
                    {
                        question: "A shape has vertices at A(1, 2), B(3, 2), C(3, 4). Complete the shape if the $y$-axis is the line of symmetry.",
                        steps: [
                            "Reflect A(1, 2): $x$ changes sign → A'(-1, 2)",
                            "Reflect B(3, 2): → B'(-3, 2)",
                            "Reflect C(3, 4): → C'(-3, 4)",
                            "The complete shape has vertices: A'(-3, 4), B'(-3, 2), A'(-1, 2), A(1, 2), B(3, 2), C(3, 4)"
                        ],
                        final_answer: "Reflected vertices: A'$(-1, 2)$, B'$(-3, 2)$, C'$(-3, 4)$"
                    }
                ]
            }
        ],
        key_points: [
            "A line of symmetry divides a shape into two identical mirror-image halves",
            "A regular $n$-gon has exactly $n$ lines of symmetry",
            "A circle has infinitely many lines of symmetry (every diameter is a line of symmetry)",
            "A parallelogram has NO lines of symmetry despite having equal opposite sides",
            "The diagonals of a rectangle are NOT lines of symmetry",
            "To reflect a point, measure perpendicular distance to the mirror line and plot equally on the other side"
        ],
        exam_tips: [
            "Draw lines of symmetry with a dashed line (- - -) and label them.",
            "Test symmetry by folding (mentally or physically) — both halves must match exactly.",
            "A common mistake: stating that a parallelogram has 2 lines of symmetry — it has none.",
            "On grid paper, count squares carefully when reflecting points.",
            "ZIMSEC may ask you to draw ALL lines of symmetry — make sure you find every one."
        ],
        visual_descriptions: [
            "Common shapes with their lines of symmetry drawn as dashed lines: square (4 lines), rectangle (2 lines), equilateral triangle (3 lines)",
            "Capital letters A, H, and X with their lines of symmetry marked",
            "A half-shape on a grid being completed by reflection across a vertical mirror line"
        ]
    },

    // ============================================
    // TOPIC 24: DATA COLLECTION AND CLASSIFICATION (Form 1)
    // ============================================
    'Data Collection and Classification': {
        topic: 'Data Collection and Classification',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "Statistics begins with collecting and organising data. In this topic you learn how to collect data, classify it as primary or secondary, qualitative or quantitative, and discrete or continuous. You also learn to organise raw data into frequency tables using tally marks. These foundational skills are essential for all later work in statistics, including data representation, measures of central tendency, and probability.",
        sections: [
            {
                title: '1. What Is Data?',
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/The_Explainer__Data_Detectives.mp4',
                content: "## Definition\n\n**Data** is a collection of facts, numbers, or measurements gathered for analysis.\n\n**Statistics** is the branch of mathematics that deals with collecting, organising, presenting, analysing, and interpreting data.\n\n## The Statistical Process\n\n1. **Collect** data (surveys, experiments, observations)\n2. **Organise** data (tables, lists)\n3. **Present** data (charts, graphs)\n4. **Analyse** data (averages, spread)\n5. **Interpret** data (draw conclusions)\n\n## Why Data Matters\n\nData helps us make informed decisions. Examples:\n- Schools use exam results to improve teaching\n- Hospitals track patient data for better healthcare\n- Businesses use sales data for planning",
                worked_examples: []
            },
            {
                title: '2. Primary and Secondary Data',
                content: "## Primary Data\n\nData that you collect **yourself**, first-hand, for your specific purpose.\n\n**Methods of collection:**\n- Questionnaires/surveys\n- Interviews\n- Experiments\n- Direct observation\n- Counting/measurement\n\n**Advantages**: Reliable, specific to your needs, up-to-date\n**Disadvantages**: Time-consuming, expensive, limited sample\n\n## Secondary Data\n\nData that has been collected by **someone else** and already exists.\n\n**Sources:**\n- Textbooks and reference books\n- Government reports (ZimStat)\n- Newspapers and magazines\n- Internet/websites\n- School records\n\n**Advantages**: Quick to obtain, covers large populations\n**Disadvantages**: May be outdated, may not fit your exact purpose, possible bias",
                worked_examples: [
                    {
                        question: "Classify each data source as primary or secondary: (a) You count the number of cars passing your school gate in an hour. (b) You use data from a newspaper about road accidents in Zimbabwe.",
                        steps: [
                            "(a) You are collecting the data yourself by observation → Primary",
                            "(b) The data was collected by someone else (the newspaper) → Secondary"
                        ],
                        final_answer: "(a) Primary (b) Secondary"
                    }
                ]
            },
            {
                title: '3. Qualitative and Quantitative Data',
                content: "## Qualitative Data (Categorical)\n\nData that describes **qualities or categories** — cannot be measured with numbers.\n\nExamples: colour of cars, favourite sport, type of transport, gender, grade (A/B/C)\n\n## Quantitative Data (Numerical)\n\nData that consists of **numbers** — can be measured or counted.\n\nExamples: height, mass, number of siblings, temperature, marks\n\n### Discrete Data\n\nQuantitative data that can only take **specific, separate values** (usually counted in whole numbers).\n\nExamples: number of children in a family (0, 1, 2, 3, …), number of goals scored, shoe size\n\n### Continuous Data\n\nQuantitative data that can take **any value within a range** (measured, not counted).\n\nExamples: height (1.65 m), mass (52.3 kg), time (12.7 s), temperature (36.5°C)\n\n## Classification Diagram\n\n$$\\\\text{Data} \\\\begin{cases} \\\\text{Qualitative (categories)} \\\\\\\\ \\\\text{Quantitative} \\\\begin{cases} \\\\text{Discrete (counted)} \\\\\\\\ \\\\text{Continuous (measured)} \\\\end{cases} \\\\end{cases}$$",
                worked_examples: [
                    {
                        question: "Classify each: (a) Number of pets owned (b) Favourite colour (c) Height of students (d) Type of phone",
                        steps: [
                            "(a) Number of pets — counted, numerical → Quantitative, Discrete",
                            "(b) Favourite colour — category, not numerical → Qualitative",
                            "(c) Height — measured, can take any value → Quantitative, Continuous",
                            "(d) Type of phone — category → Qualitative"
                        ],
                        final_answer: "(a) Quantitative discrete (b) Qualitative (c) Quantitative continuous (d) Qualitative"
                    }
                ]
            },
            {
                title: '4. Frequency Tables and Tally Marks',
                content: "## Raw Data\n\n**Raw data** is data that has not been organised. For example:\n\n$$2, 3, 1, 4, 2, 3, 3, 1, 2, 4, 3, 2, 1, 3, 2$$\n\n## Tally Marks\n\nUse tally marks to count occurrences:\n- Each occurrence gets one stroke: |, ||, |||, ||||,\n- The **fifth** tally crosses the group: $\\\\cancel{||||}$ = 5\n- This makes counting in groups of 5 easy.\n\n## Creating a Frequency Table\n\n1. List all possible values in order.\n2. Go through the raw data and make a tally mark for each value.\n3. Count the tallies to get the **frequency** (how many times each value appears).\n4. Check: the total frequency should equal the total number of data items.\n\n## Example Frequency Table\n\n| Value | Tally | Frequency |\n|-------|-------|-----------|\n| 1 | ||| | 3 |\n| 2 | $\\\\cancel{||||}$ | 5 |\n| 3 | $\\\\cancel{||||}$ | 5 |\n| 4 | || | 2 |\n| **Total** | | **15** |\n\n## Grouped Frequency Table\n\nFor continuous or widely spread data, group values into **class intervals**:\n\n| Height (cm) | Tally | Frequency |\n|------------|-------|-----------|\n| 140–149 | |||| | 4 |\n| 150–159 | $\\\\cancel{||||}$ || | 7 |\n| 160–169 | $\\\\cancel{||||}$ | 5 |\n| 170–179 | ||| | 3 |",
                worked_examples: [
                    {
                        question: "The shoe sizes of 20 students are: 6, 7, 8, 6, 7, 7, 8, 9, 6, 7, 8, 7, 6, 8, 9, 7, 8, 6, 7, 8. Draw a frequency table.",
                        steps: [
                            "List values: 6, 7, 8, 9",
                            "Tally size 6: ||||| → 5",
                            "Tally size 7: ||||||| → 7",
                            "Tally size 8: |||||| → 6",
                            "Tally size 9: || → 2",
                            "Check total: 5 + 7 + 6 + 2 = 20 ✓"
                        ],
                        final_answer: "Size 6: freq 5; Size 7: freq 7; Size 8: freq 6; Size 9: freq 2; Total: 20"
                    }
                ]
            }
        ],
        key_points: [
            "Data is information collected for analysis; statistics is the study of data",
            "Primary data is collected first-hand; secondary data comes from existing sources",
            "Qualitative data describes categories; quantitative data uses numbers",
            "Discrete data is counted (whole numbers); continuous data is measured (any value in a range)",
            "Tally marks use groups of 5 (four strokes + one cross) for easy counting",
            "The total frequency must equal the total number of data items — always check!"
        ],
        exam_tips: [
            "ZIMSEC frequently asks you to classify data as qualitative/quantitative and discrete/continuous — learn the definitions.",
            "When making a tally table, work through the raw data systematically from start to finish — don't skip around.",
            "Always include a 'Total' row in your frequency table and check it matches the data count.",
            "If you're unsure whether data is discrete or continuous, ask: 'Is it counted or measured?'",
            "Primary data questions often describe a student conducting a survey — secondary data involves using existing records."
        ],
        visual_descriptions: [
            "A classification tree diagram showing Data splitting into Qualitative and Quantitative, then Quantitative splitting into Discrete and Continuous",
            "A frequency table with columns for Value, Tally, and Frequency, showing tally marks in groups of five",
            "Examples of primary data collection methods (questionnaire, interview, observation) shown as icons"
        ]
    },

    // ============================================
    // TOPIC 25: DATA REPRESENTATION (Form 1)
    // ============================================
    'Data Representation': {
        topic: 'Data Representation',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "Once data has been collected and organised, it needs to be presented visually so that patterns and comparisons can be seen at a glance. In Form 1 you learn to represent data using bar charts, pie charts, and pictograms, and to read and interpret these displays. You also learn to choose the most appropriate type of chart for different data sets. Data representation questions are common in the ZIMSEC examination and require both drawing skills and interpretation ability.",
        sections: [
            {
                title: '1. Bar Charts',
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Data_Representation.mp4',
                content: "## What Is a Bar Chart?\n\nA bar chart uses **rectangular bars** to represent data. The height (or length) of each bar shows the frequency or value.\n\n## Rules for Drawing Bar Charts\n\n1. The **bars** must be of **equal width**.\n2. There must be **equal gaps** between bars.\n3. The **vertical axis** (y-axis) must have a **uniform scale** starting from 0.\n4. The **horizontal axis** (x-axis) shows the categories.\n5. Both axes must be **labelled**.\n6. The chart must have a **title**.\n\n## Types of Bar Charts\n\n- **Vertical bar chart**: bars stand upright (most common)\n- **Horizontal bar chart**: bars lie on their side\n- **Grouped bar chart**: bars for different groups side by side\n- **Stacked bar chart**: bars divided into sections\n\n## Reading a Bar Chart\n\n- Read the height of each bar against the scale\n- Compare heights to find the mode (tallest bar)\n- Add all heights to find the total frequency",
                worked_examples: [
                    {
                        question: "The favourite sports of 30 students are: Soccer (12), Netball (8), Cricket (5), Athletics (5). Draw a bar chart.",
                        steps: [
                            "Draw horizontal axis: label categories (Soccer, Netball, Cricket, Athletics)",
                            "Draw vertical axis: label 'Number of Students', scale from 0 to 12 (or 14) in steps of 2",
                            "Draw bars: Soccer = 12, Netball = 8, Cricket = 5, Athletics = 5",
                            "Ensure equal width and equal gaps between bars",
                            "Add title: 'Favourite Sports of Form 1 Students'"
                        ],
                        final_answer: "Bar chart with bars of heights 12, 8, 5, 5 for the four sports"
                    },
                    {
                        question: "From a bar chart, the bar for 'January' reaches 45 and 'February' reaches 30. How many more items were recorded in January?",
                        steps: [
                            "January = 45, February = 30",
                            "Difference = $45 - 30 = 15$"
                        ],
                        final_answer: "15 more items in January"
                    }
                ]
            },
            {
                title: '2. Pie Charts',
                content: "## What Is a Pie Chart?\n\nA **pie chart** is a circular chart divided into **sectors**. Each sector represents a category, and its size (angle) is proportional to the frequency.\n\n## The Key Formula\n\n$$\\\\text{Angle for a category} = \\\\frac{\\\\text{frequency}}{\\\\text{total frequency}} \\\\times 360°$$\n\n## Drawing a Pie Chart\n\n1. Calculate the angle for each category.\n2. Draw a circle using a compass.\n3. Draw a radius (starting line).\n4. Use a protractor to measure and draw each angle.\n5. Label each sector (or use a key).\n6. Add a title.\n\n## Interpreting a Pie Chart\n\nIf you know the total and the angle:\n$$\\\\text{Frequency} = \\\\frac{\\\\text{angle}}{360°} \\\\times \\\\text{total}$$\n\n## Check\n\nAll angles must add up to $360°$.",
                worked_examples: [
                    {
                        question: "40 students chose their favourite fruit: Banana (15), Apple (10), Orange (8), Mango (7). Calculate the angle for each fruit.",
                        steps: [
                            "Total = 40",
                            "Banana: $\\\\frac{15}{40} \\\\times 360° = 135°$",
                            "Apple: $\\\\frac{10}{40} \\\\times 360° = 90°$",
                            "Orange: $\\\\frac{8}{40} \\\\times 360° = 72°$",
                            "Mango: $\\\\frac{7}{40} \\\\times 360° = 63°$",
                            "Check: $135° + 90° + 72° + 63° = 360°$ ✓"
                        ],
                        final_answer: "Banana = 135°, Apple = 90°, Orange = 72°, Mango = 63°"
                    },
                    {
                        question: "A pie chart represents 120 students. The sector for 'Walking' has an angle of 90°. How many students walk?",
                        steps: [
                            "Frequency = $\\\\frac{90°}{360°} \\\\times 120$",
                            "$= \\\\frac{1}{4} \\\\times 120 = 30$"
                        ],
                        final_answer: "30 students walk"
                    }
                ]
            },
            {
                title: '3. Pictograms',
                content: "## What Is a Pictogram?\n\nA **pictogram** (or pictograph) uses **pictures or symbols** to represent data. Each picture stands for a certain number of items.\n\n## Key Feature\n\nA **key** tells you what each symbol represents.\n\nExample: 🍎 = 10 apples, then half an apple symbol = 5 apples.\n\n## Drawing a Pictogram\n\n1. Choose a symbol and a suitable **key** (e.g., one symbol = 5 items).\n2. Calculate how many symbols are needed for each category.\n3. Draw symbols in rows, aligned neatly.\n4. Use part-symbols for values that aren't exact multiples.\n5. Include a title and key.\n\n## Reading a Pictogram\n\n1. Count the symbols in each row.\n2. Multiply by the key value.\n3. Add part-symbols as fractions of the key value.\n\n## Advantages and Disadvantages\n\n- **Advantage**: visually attractive and easy to understand\n- **Disadvantage**: hard to represent exact values; part-symbols can be ambiguous",
                worked_examples: [
                    {
                        question: "A pictogram uses ★ = 4 books. Monday shows ★★★½. How many books were borrowed on Monday?",
                        steps: [
                            "Full stars: 3 × 4 = 12 books",
                            "Half star: $\\\\frac{1}{2} \\\\times 4 = 2$ books",
                            "Total: $12 + 2 = 14$ books"
                        ],
                        final_answer: "14 books were borrowed on Monday"
                    }
                ]
            },
            {
                title: '4. Interpreting Data Displays',
                content: "## Common Interpretation Questions\n\nZIMSEC may ask you to:\n\n1. **Read values** from a chart\n2. **Compare** categories (which is the most/least popular?)\n3. **Calculate totals** by adding all frequencies\n4. **Find differences** between categories\n5. **Calculate fractions or percentages** of the total\n\n## From Bar Charts\n\n- The tallest bar = the mode\n- Total = sum of all bar heights\n\n## From Pie Charts\n\n- Largest sector = most common category\n- Use the formula to convert between angles and frequencies\n\n## From Pictograms\n\n- Count symbols carefully, including part-symbols\n- Always refer to the key\n\n## Common Mistakes\n\n- Not reading the scale correctly on bar charts\n- Forgetting the key in pictograms\n- Assuming equal sectors in pie charts without checking angles",
                worked_examples: [
                    {
                        question: "A bar chart shows: Math (25), English (20), Science (18), History (12). (a) Which subject is most popular? (b) How many students in total? (c) What fraction chose Science?",
                        steps: [
                            "(a) Tallest bar = Math with 25 students",
                            "(b) Total = $25 + 20 + 18 + 12 = 75$",
                            "(c) Fraction for Science = $\\\\frac{18}{75} = \\\\frac{6}{25}$"
                        ],
                        final_answer: "(a) Mathematics (b) 75 students (c) $\\\\frac{6}{25}$"
                    }
                ]
            },
            {
                title: '5. Choosing the Right Chart',
                content: "## When to Use Each Chart\n\n| Chart Type | Best For | Data Type |\n|-----------|---------|----------|\n| **Bar chart** | Comparing categories | Qualitative or discrete |\n| **Pie chart** | Showing proportions of a whole | Qualitative (with totals) |\n| **Pictogram** | Simple visual comparison | Small data sets |\n| **Line graph** | Showing trends over time | Continuous |\n| **Histogram** | Continuous grouped data | Continuous |\n\n## Decision Guide\n\n- Want to compare sizes? → **Bar chart**\n- Want to show parts of a whole? → **Pie chart**\n- Want to show change over time? → **Line graph**\n- Want a visual, eye-catching display? → **Pictogram**\n\n## ZIMSEC Context\n\nZIMSEC may give you data and ask you to choose the most appropriate chart. Always justify your choice:\n\n*\"A bar chart is most appropriate because we are comparing the frequencies of different categories.\"*\n\n*\"A pie chart is most appropriate because we want to show the proportion each sport represents of the total.\"*",
                worked_examples: [
                    {
                        question: "A school wants to show how students travel to school (walk, bus, car, bicycle). What chart would you recommend?",
                        steps: [
                            "The data is categorical (qualitative) with distinct categories",
                            "We want to compare frequencies across categories",
                            "A bar chart allows easy comparison of heights",
                            "A pie chart could also work to show proportions of the whole"
                        ],
                        final_answer: "A bar chart (for comparison) or pie chart (for proportions) would be appropriate"
                    }
                ]
            }
        ],
        key_points: [
            "Bar charts use bars of equal width with gaps; the height represents frequency",
            "Pie chart angle formula: $\\\\frac{\\\\text{frequency}}{\\\\text{total}} \\\\times 360°$",
            "All pie chart angles must sum to 360°",
            "Pictograms use symbols with a key; part-symbols represent fractions of the key value",
            "Bar charts are best for comparing categories; pie charts for showing proportions",
            "Always label axes, include a title, and use a key where needed",
            "The mode is the category with the highest frequency (tallest bar / largest sector)"
        ],
        exam_tips: [
            "When drawing bar charts, always start the frequency axis at 0 and use a uniform scale.",
            "For pie charts, show your angle calculations — ZIMSEC awards method marks for the formula and working.",
            "Check that all your pie chart angles add up to 360° before drawing.",
            "In pictograms, always state the key clearly and use consistent symbol sizes.",
            "When interpreting charts, read values carefully from the scale — don't estimate when you can read exactly.",
            "If asked to 'suggest a suitable chart', give a reason for your choice."
        ],
        visual_descriptions: [
            "A vertical bar chart with labelled axes, title, and four bars of different heights representing different categories",
            "A pie chart divided into four sectors with angles labelled and a key showing what each sector represents",
            "A pictogram showing rows of symbols with a key stating that each symbol represents 5 items"
        ]
    },

    // ============================================
    // TOPIC 26: TRANSLATION (Form 1)
    // ============================================
    'Translation': {
        topic: 'Translation',
        subject: 'Mathematics',
        grade_level: 'O-Level Form 1',
        summary: "Translation is one of the four geometric transformations (the others being reflection, rotation, and enlargement). A translation slides every point of a shape the same distance in the same direction, without turning or flipping it. Translations are described using column vectors. In Form 1 you learn to translate points and shapes on a coordinate grid, describe translations using vectors, and find image points after translation. This topic prepares you for the full transformations unit in Forms 3 and 4.",
        sections: [
            {
                title: '1. What Is a Transformation?',
                videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%201/Form_1__Intro_to_Translation.mp4',
                content: "## Definition\n\nA **transformation** changes the position, size, or orientation of a shape.\n\n## The Four Main Transformations\n\n| Transformation | What It Does |\n|---------------|---------------|\n| **Translation** | Slides the shape (no turning, no flipping) |\n| **Reflection** | Flips the shape over a mirror line |\n| **Rotation** | Turns the shape about a fixed point |\n| **Enlargement** | Changes the size of the shape |\n\n## Key Vocabulary\n\n- **Object**: the original shape\n- **Image**: the new shape after transformation\n- **Congruent**: same shape and size (translation, reflection, rotation preserve congruence)\n\n## Translation Properties\n\n- Every point moves the **same distance** in the **same direction**\n- The shape does **not** rotate or flip\n- The object and image are **congruent** (same shape and size)\n- The image has the same **orientation** as the object",
                worked_examples: []
            },
            {
                title: '2. Column Vectors',
                content: "## What Is a Column Vector?\n\nA column vector describes a movement in terms of horizontal and vertical components:\n\n$$\\\\begin{pmatrix} x \\\\\\\\ y \\\\end{pmatrix}$$\n\nwhere:\n- $x$ = horizontal movement (positive = right, negative = left)\n- $y$ = vertical movement (positive = up, negative = down)\n\n## Examples\n\n$$\\\\begin{pmatrix} 3 \\\\\\\\ 2 \\\\end{pmatrix} \\\\text{ means move 3 right and 2 up}$$\n\n$$\\\\begin{pmatrix} -4 \\\\\\\\ 1 \\\\end{pmatrix} \\\\text{ means move 4 left and 1 up}$$\n\n$$\\\\begin{pmatrix} 0 \\\\\\\\ -5 \\\\end{pmatrix} \\\\text{ means move 0 horizontally and 5 down}$$\n\n## Finding the Translation Vector\n\nIf object point is $(x_1, y_1)$ and image point is $(x_2, y_2)$:\n\n$$\\\\text{Translation vector} = \\\\begin{pmatrix} x_2 - x_1 \\\\\\\\ y_2 - y_1 \\\\end{pmatrix}$$",
                worked_examples: [
                    {
                        question: "Point A(2, 3) is translated to A'(5, 1). Find the translation vector.",
                        steps: [
                            "Horizontal change: $5 - 2 = 3$ (moved right)",
                            "Vertical change: $1 - 3 = -2$ (moved down)",
                            "Translation vector: $\\\\begin{pmatrix} 3 \\\\\\\\ -2 \\\\end{pmatrix}$"
                        ],
                        final_answer: "$\\\\begin{pmatrix} 3 \\\\\\\\ -2 \\\\end{pmatrix}$"
                    },
                    {
                        question: "Describe the translation given by vector $\\\\begin{pmatrix} -2 \\\\\\\\ 4 \\\\end{pmatrix}$.",
                        steps: [
                            "Horizontal: $-2$ → move 2 units to the left",
                            "Vertical: $4$ → move 4 units up"
                        ],
                        final_answer: "A translation of 2 units left and 4 units up"
                    }
                ]
            },
            {
                title: '3. Translating Points and Shapes',
                content: "## Translating a Single Point\n\nTo translate point $(x, y)$ by vector $\\\\begin{pmatrix} a \\\\\\\\ b \\\\end{pmatrix}$:\n\n$$\\\\text{Image} = (x + a, \\; y + b)$$\n\n## Translating a Shape\n\nTo translate a shape:\n1. Identify the coordinates of each vertex.\n2. Apply the translation vector to **each vertex**.\n3. Plot the image vertices.\n4. Join them in the same order.\n\n## Labelling Convention\n\n- Object vertices: A, B, C, …\n- Image vertices: A', B', C', … (read as 'A prime', 'B prime', etc.)\n\n## Important Properties Preserved\n\n- Side lengths (congruent)\n- Angles (unchanged)\n- Orientation (same way round)\n- Shape and size (identical)",
                worked_examples: [
                    {
                        question: "Triangle PQR has vertices P(1, 2), Q(4, 2), R(4, 5). Translate by vector $\\\\begin{pmatrix} -3 \\\\\\\\ 1 \\\\end{pmatrix}$.",
                        steps: [
                            "P' = $(1 + (-3), 2 + 1) = (-2, 3)$",
                            "Q' = $(4 + (-3), 2 + 1) = (1, 3)$",
                            "R' = $(4 + (-3), 5 + 1) = (1, 6)$",
                            "Plot P'(-2, 3), Q'(1, 3), R'(1, 6) and join to form the image triangle"
                        ],
                        final_answer: "P'$(-2, 3)$, Q'$(1, 3)$, R'$(1, 6)$"
                    },
                    {
                        question: "A square ABCD has been translated so that A(1, 1) maps to A'(4, -2). What vector was used?",
                        steps: [
                            "Translation vector = $\\\\begin{pmatrix} 4 - 1 \\\\\\\\ -2 - 1 \\\\end{pmatrix} = \\\\begin{pmatrix} 3 \\\\\\\\ -3 \\\\end{pmatrix}$"
                        ],
                        final_answer: "$\\\\begin{pmatrix} 3 \\\\\\\\ -3 \\\\end{pmatrix}$"
                    }
                ]
            },
            {
                title: '4. Describing Translations and Combined Translations',
                content: "## Describing a Translation\n\nTo fully describe a translation you must state:\n1. **The type of transformation**: \"Translation\"\n2. **The column vector**: $\\\\begin{pmatrix} a \\\\\\\\ b \\\\end{pmatrix}$\n\nExample: *\"A translation by vector $\\\\begin{pmatrix} 4 \\\\\\\\ -2 \\\\end{pmatrix}$\"*\n\n## Combining Two Translations\n\nIf shape undergoes translation $\\\\begin{pmatrix} a_1 \\\\\\\\ b_1 \\\\end{pmatrix}$ followed by $\\\\begin{pmatrix} a_2 \\\\\\\\ b_2 \\\\end{pmatrix}$:\n\n$$\\\\text{Combined vector} = \\\\begin{pmatrix} a_1 + a_2 \\\\\\\\ b_1 + b_2 \\\\end{pmatrix}$$\n\nTwo successive translations are equivalent to a **single** translation.\n\n## Inverse Translation\n\nThe translation that returns the image to the object position:\n\n$$\\\\text{If } \\\\mathbf{t} = \\\\begin{pmatrix} a \\\\\\\\ b \\\\end{pmatrix}, \\\\text{ then } \\\\mathbf{t}^{-1} = \\\\begin{pmatrix} -a \\\\\\\\ -b \\\\end{pmatrix}$$\n\n## ZIMSEC Exam Language\n\nWhen ZIMSEC says \"describe fully the single transformation\", you must state:\n- The type (translation)\n- The vector\n\nFor example: \"The transformation is a translation by vector $\\\\begin{pmatrix} 5 \\\\\\\\ -3 \\\\end{pmatrix}$.\"",
                worked_examples: [
                    {
                        question: "Shape A is mapped to Shape B by translation $\\\\begin{pmatrix} 2 \\\\\\\\ 3 \\\\end{pmatrix}$, then Shape B is mapped to Shape C by translation $\\\\begin{pmatrix} -5 \\\\\\\\ 1 \\\\end{pmatrix}$. Describe the single translation that maps A directly to C.",
                        steps: [
                            "Combined vector = $\\\\begin{pmatrix} 2 + (-5) \\\\\\\\ 3 + 1 \\\\end{pmatrix} = \\\\begin{pmatrix} -3 \\\\\\\\ 4 \\\\end{pmatrix}$"
                        ],
                        final_answer: "Translation by vector $\\\\begin{pmatrix} -3 \\\\\\\\ 4 \\\\end{pmatrix}$"
                    }
                ]
            }
        ],
        key_points: [
            "A translation slides every point the same distance in the same direction",
            "Translations are described by column vectors: $\\\\begin{pmatrix} x \\\\\\\\ y \\\\end{pmatrix}$ where $x$ = horizontal, $y$ = vertical",
            "Positive $x$ = right, negative $x$ = left; positive $y$ = up, negative $y$ = down",
            "Image point: $(x + a, y + b)$ when translated by $\\\\begin{pmatrix} a \\\\\\\\ b \\\\end{pmatrix}$",
            "Translation preserves shape, size, angles, and orientation — object and image are congruent",
            "To describe a translation fully: state 'translation' and give the vector"
        ],
        exam_tips: [
            "Always state both the transformation type AND the vector when describing a translation.",
            "Label image points with primes: A → A', B → B', etc.",
            "When translating shapes, apply the vector to EVERY vertex — don't just move one point.",
            "Double-check your vector by verifying that the image shape has the same orientation as the object.",
            "The inverse translation has the opposite signs: $\\\\begin{pmatrix} a \\\\\\\\ b \\\\end{pmatrix}$ becomes $\\\\begin{pmatrix} -a \\\\\\\\ -b \\\\end{pmatrix}$."
        ],
        visual_descriptions: [
            "A coordinate grid showing a triangle and its translated image with the translation vector drawn as an arrow from one vertex to its image",
            "A column vector diagram showing the horizontal and vertical components with arrows labelled 'right/left' and 'up/down'",
            "Two successive translations shown on a grid with the combined single translation vector also drawn"
        ]
    }
};
