import { MathTopicNotes } from './types';

export const algebraNotes: Record<string, MathTopicNotes> = {
    'Algebraic Expressions': {
        topic: 'Algebraic Expressions',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'Algebraic expressions use letters (variables) to represent numbers. This chapter covers: basic terminology (variable, constant, coefficient, term, like terms); polynomials and degree; simplifying expressions by collecting like terms and using index laws; expanding single and double brackets, including FOIL and special products $(a \\pm b)^2$ and $a^2 - b^2$; factorization by common factor, difference of two squares, trinomials ($x^2 + bx + c$ and $ax^2 + bx + c$), and grouping; algebraic fractions (simplify, add, subtract, multiply, divide) and restrictions; substitution into formulae. Mastery of these skills is essential for solving equations and for later topics.',
        sections: [
            {
                title: '1. Basic Terminology and Polynomials',
                content: `**Variable**: A letter (or symbol) representing an unknown or varying quantity, e.g. $x$, $y$, $a$.

**Constant**: A fixed numerical value, e.g. $5$, $-3$, $\\pi$. In $4x + 7$, the constant term is $7$.

**Coefficient**: The numerical factor multiplying a variable part. In $7x^2$, the coefficient is $7$; in $-x$, the coefficient is $-1$.

**Term**: A single part of an expression separated by $+$ or $-$ (e.g. $3x$, $-5y^2$, $12$). A term can be a constant, a variable, or a product of both.

**Like terms**: Terms with the **same variable part** (same variables raised to the same powers). Only like terms can be combined by addition or subtraction.
- Like: $3x^2$ and $-5x^2$ (both in $x^2$).
- Unlike: $3x^2$ and $3x$ (different powers).

**Polynomial**: An expression that is a sum of terms of the form $a_n x^n + a_{n-1} x^{n-1} + \\cdots + a_1 x + a_0$ where $n$ is a non-negative integer. **Degree** = highest power of the variable. So $5x^3 - 2x^2 + 4x - 1$ is a cubic (degree 3).`,
                worked_examples: [
                    {
                        question: 'Identify the coefficient, variable, and constant in: $4x^2 - 3x + 7$',
                        steps: [
                            'First term $4x^2$: coefficient = $4$, variable = $x^2$.',
                            'Second term $-3x$: coefficient = $-3$, variable = $x$.',
                            'Third term $7$: constant (no variable).'
                        ],
                        final_answer: 'Coefficients: $4$, $-3$. Variables: $x^2$, $x$. Constant: $7$.'
                    },
                    {
                        question: 'State the degree of the polynomial: $5x^3 - 2x^2 + 4x - 1$',
                        steps: [
                            'The degree is the highest power of the variable.',
                            'Powers present: $3$, $2$, $1$, $0$.',
                            'Highest power = $3$.'
                        ],
                        final_answer: 'Degree = $3$ (cubic polynomial)'
                    },
                    {
                        question: 'In $ax^2 + bx + 7$, the coefficient of $x$ is $-4$ and the coefficient of $x^2$ is $3$. Find $a + b$.',
                        steps: [
                            'Coefficient of $x^2$ is $a = 3$.',
                            'Coefficient of $x$ is $b = -4$.',
                            'So $a + b = 3 + (-4) = -1$.'
                        ],
                        final_answer: '$a + b = -1$'
                    }
                ]
            },
            {
                title: '2. Simplifying Algebraic Expressions',
                content: `**Collecting like terms**: Add or subtract the **coefficients** of terms that have the same variable part. Keep the variable part unchanged.

$$3x + 5y - 2x + 3y = (3 - 2)x + (5 + 3)y = x + 8y$$

**Laws of indices** (used when multiplying or dividing powers of the same base):
$$a^m \\times a^n = a^{m+n} \\quad ; \\quad a^m \\div a^n = a^{m-n} \\quad ; \\quad (a^m)^n = a^{mn}$$
$$(ab)^n = a^n b^n \\quad ; \\quad a^0 = 1 \\, \\text{(for } a \\neq 0 \\text{)} \\quad ; \\quad a^{-n} = \\frac{1}{a^n}$$

When simplifying, work coefficient by coefficient and apply index laws to each letter.`,
                worked_examples: [
                    {
                        question: 'Simplify: $5a^2b \\times 3ab^3$',
                        steps: [
                            'Multiply coefficients: $5 \\times 3 = 15$.',
                            'Add indices for $a$: $a^2 \\times a^1 = a^{2+1} = a^3$.',
                            'Add indices for $b$: $b^1 \\times b^3 = b^{1+3} = b^4$.',
                            'Combine: $15a^3b^4$.'
                        ],
                        final_answer: '$15a^3b^4$'
                    },
                    {
                        question: 'Simplify: $4x^2y - 3xy + 2x^2y + 5xy - 7$',
                        steps: [
                            'Group like terms: $(4x^2y + 2x^2y) + (-3xy + 5xy) + (-7)$.',
                            'Simplify $x^2y$ terms: $4 + 2 = 6$, so $6x^2y$.',
                            'Simplify $xy$ terms: $-3 + 5 = 2$, so $2xy$.',
                            'Constant remains: $-7$.'
                        ],
                        final_answer: '$6x^2y + 2xy - 7$'
                    },
                    {
                        question: 'Simplify: $\\frac{12x^5y^3}{4x^2y}$',
                        steps: [
                            'Divide coefficients: $\\frac{12}{4} = 3$.',
                            'Subtract indices for $x$: $x^{5-2} = x^3$.',
                            'Subtract indices for $y$: $y^{3-1} = y^2$.',
                            'Combine: $3x^3y^2$.'
                        ],
                        final_answer: '$3x^3y^2$'
                    },
                    {
                        question: 'Simplify: $(3x^2)^2 \\times 2x^3$',
                        steps: [
                            '$(3x^2)^2 = 3^2 \\times (x^2)^2 = 9x^4$.',
                            'Multiply: $9x^4 \\times 2x^3 = 18 x^{4+3} = 18x^7$.'
                        ],
                        final_answer: '$18x^7$'
                    }
                ]
            },
            {
                title: '3. Expansion of Brackets',
                content: `**Single bracket**: Multiply **every** term inside the bracket by the term outside: $a(b + c) = ab + ac$. For subtraction: $a(b - c) = ab - ac$.

**Two binomials (FOIL)** — First, Outer, Inner, Last:
$$(a + b)(c + d) = ac + ad + bc + bd$$

**Special products** (memorise these):
$$(a + b)^2 = a^2 + 2ab + b^2 \\quad ; \\quad (a - b)^2 = a^2 - 2ab + b^2$$
$$(a + b)(a - b) = a^2 - b^2 \\quad \\text{(difference of two squares)}$$

**Three or more factors**: Expand two at a time, then multiply by the next. Look for difference of squares or common structure to save work.`,
                worked_examples: [
                    {
                        question: 'Expand and simplify: $(2x + 3)(x - 5)$',
                        steps: [
                            'Apply FOIL: First: $2x \\times x = 2x^2$.',
                            'Outer: $2x \\times (-5) = -10x$.',
                            'Inner: $3 \\times x = 3x$.',
                            'Last: $3 \\times (-5) = -15$.',
                            'Combine: $2x^2 - 10x + 3x - 15 = 2x^2 - 7x - 15$.'
                        ],
                        final_answer: '$2x^2 - 7x - 15$'
                    },
                    {
                        question: 'Expand: $(3x - 4)^2$',
                        steps: [
                            'Use $(a - b)^2 = a^2 - 2ab + b^2$.',
                            'Here $a = 3x$, $b = 4$.',
                            '$a^2 = (3x)^2 = 9x^2$.',
                            '$2ab = 2(3x)(4) = 24x$.',
                            '$b^2 = 16$.',
                            'Result: $9x^2 - 24x + 16$.'
                        ],
                        final_answer: '$9x^2 - 24x + 16$'
                    },
                    {
                        question: 'Expand: $(x + 2)(x - 2)(x + 3)$',
                        steps: [
                            'First expand $(x + 2)(x - 2)$ using difference of squares.',
                            '$(x + 2)(x - 2) = x^2 - 4$.',
                            'Now expand $(x^2 - 4)(x + 3)$.',
                            '$= x^2(x + 3) - 4(x + 3)$.',
                            '$= x^3 + 3x^2 - 4x - 12$.'
                        ],
                        final_answer: '$x^3 + 3x^2 - 4x - 12$'
                    },
                    {
                        question: 'Expand and simplify: $(2x - 1)(x + 4) - (x - 3)^2$',
                        steps: [
                            'First product: $(2x - 1)(x + 4) = 2x^2 + 8x - x - 4 = 2x^2 + 7x - 4$.',
                            'Second: $(x - 3)^2 = x^2 - 6x + 9$.',
                            'Subtract: $2x^2 + 7x - 4 - (x^2 - 6x + 9) = 2x^2 + 7x - 4 - x^2 + 6x - 9$.',
                            'Collect like terms: $x^2 + 13x - 13$.'
                        ],
                        final_answer: '$x^2 + 13x - 13$'
                    }
                ]
            },
            {
                title: '4. Factorization',
                content: `**Common factor**: Take out the **highest common factor** (HCF) of all terms. Always look for this first.
$$6x^2 + 9x = 3x(2x + 3)$$

**Difference of two squares**: $a^2 - b^2 = (a + b)(a - b)$. Recognise perfect squares (e.g. $9x^2 = (3x)^2$, $16 = 4^2$).

**Trinomial $x^2 + bx + c$**: Find two numbers that **multiply** to $c$ and **add** to $b$. Then $x^2 + bx + c = (x + \\alpha)(x + \\beta)$ where $\\alpha \\beta = c$ and $\\alpha + \\beta = b$.

**Trinomial $ax^2 + bx + c$** ($a \\neq 1$): Find two numbers that multiply to $a \\times c$ and add to $b$; split the middle term and **factor by grouping**.

**Grouping** (four terms): Pair terms so each pair has a common factor; then factor out the common binomial.`,
                worked_examples: [
                    {
                        question: 'Factorize completely: $25x^2 - 16$',
                        steps: [
                            'Recognize this as a difference of two squares: $a^2 - b^2$.',
                            '$25x^2 = (5x)^2$ and $16 = (4)^2$.',
                            'Apply formula: $(5x + 4)(5x - 4)$.'
                        ],
                        final_answer: '$(5x + 4)(5x - 4)$'
                    },
                    {
                        question: 'Factorize: $x^2 - 7x + 12$',
                        steps: [
                            'Find two numbers that multiply to $12$ and add to $-7$.',
                            'The numbers are $-3$ and $-4$.',
                            'Write as: $(x - 3)(x - 4)$.'
                        ],
                        final_answer: '$(x - 3)(x - 4)$'
                    },
                    {
                        question: 'Factorize completely: $2x^3 - 8x$',
                        steps: [
                            'Find common factor: HCF = $2x$.',
                            '$2x^3 - 8x = 2x(x^2 - 4)$.',
                            'Recognize $x^2 - 4$ as difference of squares.',
                            '$x^2 - 4 = (x + 2)(x - 2)$.',
                            'Final: $2x(x + 2)(x - 2)$.'
                        ],
                        final_answer: '$2x(x + 2)(x - 2)$'
                    },
                    {
                        question: 'Factorize: $2x^2 + 5x - 3$',
                        steps: [
                            'Multiply $a \\times c = 2 \\times (-3) = -6$.',
                            'Find two numbers that multiply to $-6$ and add to $5$: $6$ and $-1$.',
                            'Rewrite: $2x^2 + 6x - x - 3$.',
                            'Group: $(2x^2 + 6x) + (-x - 3)$.',
                            'Factor: $2x(x + 3) - 1(x + 3)$.',
                            'Final: $(2x - 1)(x + 3)$.'
                        ],
                        final_answer: '$(2x - 1)(x + 3)$'
                    },
                    {
                        question: 'Factorize completely: $x^2 - 9y^2 + 4x + 4$',
                        steps: [
                            'Group: $(x^2 + 4x + 4) - 9y^2$.',
                            'First bracket is perfect square: $(x + 2)^2 - 9y^2$.',
                            'Difference of two squares: $(x+2)^2 - (3y)^2 = (x+2+3y)(x+2-3y)$.'
                        ],
                        final_answer: '$(x + 2 + 3y)(x + 2 - 3y)$'
                    }
                ]
            },
            {
                title: '5. Algebraic Fractions',
                content: `**Simplifying**: Factorise numerator and denominator, then **cancel** any common factor. State **restrictions** (values that make the denominator zero): e.g. for $\\frac{x-2}{x+3}$, $x \\neq -3$.

**Addition/Subtraction**: Find a **common denominator** (usually the product or LCM of denominators), rewrite each fraction, then add or subtract the numerators.
$$\\frac{a}{b} + \\frac{c}{d} = \\frac{ad + bc}{bd}$$

**Multiplication**: Multiply numerators and multiply denominators; then simplify.
$$\\frac{a}{b} \\times \\frac{c}{d} = \\frac{ac}{bd}$$

**Division**: Multiply by the **reciprocal** of the divisor.
$$\\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\times \\frac{d}{c} = \\frac{ad}{bc}$$

Always factorise first where possible so that cancellation is clear.`,
                worked_examples: [
                    {
                        question: 'Simplify: $\\frac{x^2 - 9}{x^2 + 6x + 9}$',
                        steps: [
                            'Factorize numerator: $x^2 - 9 = (x + 3)(x - 3)$.',
                            'Factorize denominator: $x^2 + 6x + 9 = (x + 3)^2$.',
                            'Rewrite: $\\frac{(x+3)(x-3)}{(x+3)^2}$.',
                            'Cancel $(x + 3)$: $\\frac{x - 3}{x + 3}$.'
                        ],
                        final_answer: '$\\frac{x - 3}{x + 3}$'
                    },
                    {
                        question: 'Simplify: $\\frac{2}{x} + \\frac{3}{x+1}$',
                        steps: [
                            'Common denominator = $x(x + 1)$.',
                            'Rewrite: $\\frac{2(x+1)}{x(x+1)} + \\frac{3x}{x(x+1)}$.',
                            'Add numerators: $\\frac{2(x+1) + 3x}{x(x+1)}$.',
                            'Expand: $\\frac{2x + 2 + 3x}{x(x+1)} = \\frac{5x + 2}{x(x+1)}$.'
                        ],
                        final_answer: '$\\frac{5x + 2}{x(x+1)}$'
                    },
                    {
                        question: 'Simplify: $\\frac{x^2 - 4}{x + 3} \\div \\frac{x - 2}{x^2 - 9}$',
                        steps: [
                            'Convert to multiplication: $\\frac{x^2 - 4}{x + 3} \\times \\frac{x^2 - 9}{x - 2}$.',
                            'Factorize: $x^2 - 4 = (x+2)(x-2)$, $x^2 - 9 = (x+3)(x-3)$.',
                            'Rewrite: $\\frac{(x+2)(x-2)}{x + 3} \\times \\frac{(x+3)(x-3)}{x - 2}$.',
                            'Cancel $(x - 2)$ and $(x + 3)$.',
                            'Result: $(x + 2)(x - 3)$.'
                        ],
                        final_answer: '$(x + 2)(x - 3)$ or $x^2 - x - 6$'
                    },
                    {
                        question: 'Simplify: $\\frac{2}{x-1} - \\frac{3}{x+2}$. State the restriction.',
                        steps: [
                            'Common denominator: $(x-1)(x+2)$.',
                            '$\\frac{2}{x-1} = \\frac{2(x+2)}{(x-1)(x+2)}$, $\\frac{3}{x+2} = \\frac{3(x-1)}{(x-1)(x+2)}$.',
                            'Subtract: $\\frac{2(x+2) - 3(x-1)}{(x-1)(x+2)} = \\frac{2x+4-3x+3}{(x-1)(x+2)} = \\frac{-x+7}{(x-1)(x+2)}$.',
                            'Restriction: $x \\neq 1$ and $x \\neq -2$.'
                        ],
                        final_answer: '$\\frac{7-x}{(x-1)(x+2)}$, $x \\neq 1$, $x \\neq -2$'
                    }
                ]
            },
            {
                title: '6. Substitution and Formulae',
                content: `**Substitution**: Replace each variable in an expression or formula with the given number (or expression), then evaluate using the order of operations (BODMAS).

**Changing the subject of a formula**: Rearrange so that a chosen variable is on one side (the "subject"). Use inverse operations: add/subtract terms, multiply/divide by non-zero expressions, and take roots or powers as needed. Treat the other letters as constants.`,
                worked_examples: [
                    {
                        question: 'If $P = 2l + 2w$, find $P$ when $l = 5$ and $w = 3$.',
                        steps: [
                            'Substitute: $P = 2(5) + 2(3)$.',
                            'Calculate: $P = 10 + 6 = 16$.'
                        ],
                        final_answer: '$P = 16$'
                    },
                    {
                        question: 'Make $r$ the subject of $V = \\frac{4}{3}\\pi r^3$.',
                        steps: [
                            'Multiply both sides by $3$: $3V = 4\\pi r^3$.',
                            'Divide by $4\\pi$: $r^3 = \\frac{3V}{4\\pi}$.',
                            'Take cube root: $r = \\sqrt[3]{\\frac{3V}{4\\pi}}$.'
                        ],
                        final_answer: '$r = \\sqrt[3]{\\frac{3V}{4\\pi}}$'
                    },
                    {
                        question: 'Given $y = x^2 - 3x + 1$, find the value of $y$ when $x = -2$.',
                        steps: [
                            'Substitute $x = -2$: $y = (-2)^2 - 3(-2) + 1$.',
                            '$y = 4 + 6 + 1 = 11$.'
                        ],
                        final_answer: '$y = 11$'
                    }
                ]
            }
        ],
        key_points: [
            'Like terms have identical variable parts (same variables with same powers); only they can be combined.',
            'Use index laws: $a^m \\times a^n = a^{m+n}$, $a^m \\div a^n = a^{m-n}$.',
            'Special products: $(a+b)^2 = a^2 + 2ab + b^2$, $(a-b)(a+b) = a^2 - b^2$.',
            'Always factor completely: look for common factors first, then special patterns.',
            'For algebraic fractions: factorize first, then cancel common factors.',
            'To add/subtract algebraic fractions, use a common denominator; to divide, multiply by the reciprocal.',
            'When substituting, use brackets for negative numbers (e.g. $(-2)^2 = 4$). To change the subject, undo operations in reverse order.'
        ],
        exam_tips: [
            'Always look for a common factor before using other factorisation methods.',
            'For trinomials $ax^2 + bx + c$: find two numbers that multiply to $ac$ and add to $b$, then split the middle term.',
            'Check expansions by substituting a small value (e.g. $x = 1$) into both sides.',
            'When simplifying algebraic fractions, state restrictions (denominator $\\neq 0$).',
            '"Factorise completely" means keep going until no factor can be factorised further.',
            'In "change the subject" questions, perform the same operation on both sides and simplify step by step.',
            'Use the app\'s 1000+ practice questions to reinforce each topic and build exam speed.'
        ],
        visual_descriptions: [
            'Area model: rectangle with sides $(a+b)$ and $(c+d)$ split into four rectangles $ac$, $ad$, $bc$, $bd$.',
            'Factor tree for an expression like $2x^3 - 8x$ leading to $2x(x+2)(x-2)$.',
            'Number line marking excluded values (e.g. $x \\neq -2$, $x \\neq 1$) for algebraic fractions.'
        ]
    },
    'Quadratic Equations': {
        topic: 'Quadratic Equations',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'A quadratic equation has the form $ax^2 + bx + c = 0$ with $a \\neq 0$. This chapter covers: solving by factorisation (zero product property); the quadratic formula $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$ and the discriminant (nature of roots); completing the square and vertex form; sketching parabolas (vertex, axis of symmetry, intercepts); sum and product of roots; quadratic inequalities. These methods are used throughout O-Level and in real-world applications.',
        sections: [
            {
                title: '1. Solving by Factorisation',
                content: `Factoring involves writing the quadratic expression as a product of two linear factors.

**Zero Product Property**: If $(x - p)(x - q) = 0$, then $x = p$ or $x = q$.

**Steps**:
1. Rearrange to standard form $ax^2 + bx + c = 0$.
2. Factor the left side.
3. Set each factor equal to zero.
4. Solve for $x$.`,
                worked_examples: [
                    {
                        question: 'Solve $x^2 - 5x + 6 = 0$ by factoring.',
                        steps: [
                            'Find two numbers that multiply to $6$ and add to $-5$.',
                            'The numbers are $-2$ and $-3$.',
                            'Factor: $(x - 2)(x - 3) = 0$.',
                            'Set each factor to zero: $x - 2 = 0$ or $x - 3 = 0$.'
                        ],
                        final_answer: '$x = 2$ or $x = 3$'
                    },
                    {
                        question: 'Solve $2x^2 + 5x - 3 = 0$ by factoring.',
                        steps: [
                            'Multiply $a \\times c = 2 \\times (-3) = -6$.',
                            'Find numbers that multiply to $-6$ and add to $5$: $6$ and $-1$.',
                            'Rewrite middle term: $2x^2 + 6x - x - 3 = 0$.',
                            'Factor by grouping: $2x(x + 3) - 1(x + 3) = 0$.',
                            '$(2x - 1)(x + 3) = 0$.'
                        ],
                        final_answer: '$x = \\frac{1}{2}$ or $x = -3$'
                    },
                    {
                        question: 'Solve $x^2 = 7x - 10$.',
                        steps: [
                            'Rearrange to standard form: $x^2 - 7x + 10 = 0$.',
                            'Find two numbers that multiply to $10$ and add to $-7$.',
                            'The numbers are $-2$ and $-5$.',
                            'Factor: $(x - 2)(x - 5) = 0$.'
                        ],
                        final_answer: '$x = 2$ or $x = 5$'
                    },
                    {
                        question: 'Solve $3x^2 - 12x = 0$.',
                        steps: [
                            'Factor out common factor: $3x(x - 4) = 0$.',
                            'Apply zero product property.',
                            '$3x = 0$ gives $x = 0$.',
                            '$x - 4 = 0$ gives $x = 4$.'
                        ],
                        final_answer: '$x = 0$ or $x = 4$'
                    },
                    {
                        question: 'Solve $x^2 - 9 = 0$.',
                        steps: [
                            'Difference of two squares: $(x-3)(x+3) = 0$.',
                            'So $x - 3 = 0$ or $x + 3 = 0$.',
                            'Hence $x = 3$ or $x = -3$.'
                        ],
                        final_answer: '$x = 3$ or $x = -3$'
                    }
                ]
            },
            {
                title: '2. The Quadratic Formula',
                content: `For any quadratic equation $ax^2 + bx + c = 0$, the roots are given by:

$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

**The Discriminant** ($\\Delta = b^2 - 4ac$):
- $\\Delta > 0$: Two distinct real roots.
- $\\Delta = 0$: One repeated real root.
- $\\Delta < 0$: No real roots (complex roots).`,
                worked_examples: [
                    {
                        question: 'Use the quadratic formula to solve $x^2 - 4x + 1 = 0$.',
                        steps: [
                            'Identify $a = 1$, $b = -4$, $c = 1$.',
                            'Calculate discriminant: $\\Delta = (-4)^2 - 4(1)(1) = 16 - 4 = 12$.',
                            'Apply formula: $x = \\frac{4 \\pm \\sqrt{12}}{2}$.',
                            'Simplify: $\\sqrt{12} = 2\\sqrt{3}$.',
                            '$x = \\frac{4 \\pm 2\\sqrt{3}}{2} = 2 \\pm \\sqrt{3}$.'
                        ],
                        final_answer: '$x = 2 + \\sqrt{3}$ or $x = 2 - \\sqrt{3}$'
                    },
                    {
                        question: 'Solve $2x^2 - 7x + 3 = 0$ using the quadratic formula.',
                        steps: [
                            'Identify $a = 2$, $b = -7$, $c = 3$.',
                            'Discriminant: $\\Delta = (-7)^2 - 4(2)(3) = 49 - 24 = 25$.',
                            '$x = \\frac{7 \\pm \\sqrt{25}}{2(2)} = \\frac{7 \\pm 5}{4}$.',
                            '$x = \\frac{7 + 5}{4} = 3$ or $x = \\frac{7 - 5}{4} = \\frac{1}{2}$.'
                        ],
                        final_answer: '$x = 3$ or $x = \\frac{1}{2}$'
                    },
                    {
                        question: 'Determine the nature of roots of $x^2 + 4x + 5 = 0$ without solving.',
                        steps: [
                            'Calculate discriminant only: $\\Delta = b^2 - 4ac$.',
                            '$\\Delta = (4)^2 - 4(1)(5) = 16 - 20 = -4$.',
                            'Since $\\Delta < 0$, there are no real roots.'
                        ],
                        final_answer: 'No real roots ($\\Delta = -4 < 0$)'
                    },
                    {
                        question: 'For what value of $k$ does $x^2 + kx + 9 = 0$ have exactly one real root?',
                        steps: [
                            'One repeated root when discriminant $\\Delta = 0$.',
                            '$\\Delta = k^2 - 4(1)(9) = k^2 - 36 = 0$.',
                            'So $k^2 = 36$ $\\Rightarrow$ $k = 6$ or $k = -6$.'
                        ],
                        final_answer: '$k = 6$ or $k = -6$'
                    }
                ]
            },
            {
                title: '3. Completing the Square',
                content: `To convert $ax^2 + bx + c$ to the form $a(x + h)^2 + k$:

1. Factor out $a$ from the $x^2$ and $x$ terms.
2. Take half the coefficient of $x$, square it, and add/subtract inside.
3. Simplify to vertex form.

**Vertex Form**: $y = a(x - h)^2 + k$ where $(h, k)$ is the vertex.`,
                worked_examples: [
                    {
                        question: 'Solve $x^2 + 6x + 2 = 0$ by completing the square.',
                        steps: [
                            'Move constant: $x^2 + 6x = -2$.',
                            'Half of $6$ is $3$; square it: $9$.',
                            'Add $9$ to both sides: $x^2 + 6x + 9 = -2 + 9 = 7$.',
                            'Write as perfect square: $(x + 3)^2 = 7$.',
                            'Take square root: $x + 3 = \\pm\\sqrt{7}$.',
                            'Solve: $x = -3 \\pm \\sqrt{7}$.'
                        ],
                        final_answer: '$x = -3 + \\sqrt{7}$ or $x = -3 - \\sqrt{7}$'
                    },
                    {
                        question: 'Express $x^2 - 8x + 10$ in the form $(x - a)^2 + b$.',
                        steps: [
                            'Half of $-8$ is $-4$; square it: $16$.',
                            'Write: $x^2 - 8x + 16 - 16 + 10$.',
                            'Group: $(x^2 - 8x + 16) + (-16 + 10)$.',
                            'Simplify: $(x - 4)^2 - 6$.'
                        ],
                        final_answer: '$(x - 4)^2 - 6$, so $a = 4$, $b = -6$'
                    },
                    {
                        question: 'Find the minimum value of $y = x^2 + 4x + 7$.',
                        steps: [
                            'Complete the square: half of 4 is 2, squared is 4.',
                            '$y = (x^2 + 4x + 4) - 4 + 7 = (x + 2)^2 + 3$.',
                            'Since $(x + 2)^2 \\geq 0$, minimum occurs when $(x + 2)^2 = 0$.',
                            'Minimum value of $y = 0 + 3 = 3$ when $x = -2$.'
                        ],
                        final_answer: 'Minimum value is $3$ at $x = -2$'
                    },
                    {
                        question: 'Solve $2x^2 - 6x + 1 = 0$ by completing the square.',
                        steps: [
                            'Divide by 2: $x^2 - 3x + \\frac{1}{2} = 0$; so $x^2 - 3x = -\\frac{1}{2}$.',
                            'Half of $-3$ is $-\\frac{3}{2}$; square: $\\frac{9}{4}$. Add to both sides: $x^2 - 3x + \\frac{9}{4} = -\\frac{1}{2} + \\frac{9}{4} = \\frac{7}{4}$.',
                            '$(x - \\frac{3}{2})^2 = \\frac{7}{4}$.',
                            '$x - \\frac{3}{2} = \\pm \\sqrt{\\frac{7}{4}} = \\pm \\frac{\\sqrt{7}}{2}$. So $x = \\frac{3 \\pm \\sqrt{7}}{2}$.'
                        ],
                        final_answer: '$x = \\frac{3 + \\sqrt{7}}{2}$ or $x = \\frac{3 - \\sqrt{7}}{2}$'
                    }
                ]
            },
            {
                title: '4. Graphing Quadratic Functions',
                content: `The graph of $y = ax^2 + bx + c$ is a **parabola**.

**Key Features**:
- **Opens upward** if $a > 0$ (minimum point).
- **Opens downward** if $a < 0$ (maximum point).
- **Vertex** (turning point): $x = -\\frac{b}{2a}$.
- **Axis of symmetry**: $x = -\\frac{b}{2a}$.
- **y-intercept**: $(0, c)$.
- **x-intercepts**: Solutions of $ax^2 + bx + c = 0$.`,
                worked_examples: [
                    {
                        question: 'Find the vertex and axis of symmetry of $y = x^2 - 6x + 5$.',
                        steps: [
                            'Axis of symmetry: $x = -\\frac{b}{2a} = -\\frac{-6}{2(1)} = 3$.',
                            'Substitute $x = 3$ into the equation to find $y$:',
                            '$y = (3)^2 - 6(3) + 5 = 9 - 18 + 5 = -4$.',
                            'Vertex is at $(3, -4)$.'
                        ],
                        final_answer: 'Vertex: $(3, -4)$, Axis of symmetry: $x = 3$'
                    },
                    {
                        question: 'Find the x-intercepts and y-intercept of $y = x^2 - 4x - 5$.',
                        steps: [
                            'y-intercept: Set $x = 0$. $y = 0 - 0 - 5 = -5$. Point: $(0, -5)$.',
                            'x-intercepts: Set $y = 0$. Solve $x^2 - 4x - 5 = 0$.',
                            'Factor: $(x - 5)(x + 1) = 0$.',
                            '$x = 5$ or $x = -1$.'
                        ],
                        final_answer: 'x-intercepts: $(5, 0)$ and $(-1, 0)$. y-intercept: $(0, -5)$'
                    },
                    {
                        question: 'Sketch the graph of $y = -x^2 + 2x + 3$. Find the maximum point.',
                        steps: [
                            'Since $a = -1 < 0$, parabola opens downward (has maximum).',
                            'Axis of symmetry: $x = -\\frac{2}{2(-1)} = 1$.',
                            'Maximum $y$: $y = -(1)^2 + 2(1) + 3 = -1 + 2 + 3 = 4$.',
                            'Maximum point (vertex): $(1, 4)$.',
                            'y-intercept: $(0, 3)$. x-intercepts: solve $-x^2 + 2x + 3 = 0$.'
                        ],
                        final_answer: 'Maximum point: $(1, 4)$. Parabola opens downward.'
                    }
                ]
            },
            {
                title: '5. Sum and Product of Roots',
                content: `If $\\alpha$ and $\\beta$ are the roots of $ax^2 + bx + c = 0$ (with $a \\neq 0$), then:
$$\\alpha + \\beta = -\\frac{b}{a} \\quad \\text{and} \\quad \\alpha \\beta = \\frac{c}{a}$$

So the sum of roots = $-\\frac{b}{a}$ and the product of roots = $\\frac{c}{a}$. These follow from writing $ax^2 + bx + c = a(x - \\alpha)(x - \\beta)$ and expanding. Useful for finding a quadratic with given roots or for checking answers.`,
                worked_examples: [
                    {
                        question: 'If $\\alpha$ and $\\beta$ are the roots of $x^2 - 5x + 6 = 0$, find $\\alpha + \\beta$ and $\\alpha \\beta$ without solving.',
                        steps: [
                            'Compare with $ax^2 + bx + c = 0$: $a = 1$, $b = -5$, $c = 6$.',
                            'Sum: $\\alpha + \\beta = -\\frac{b}{a} = -\\frac{-5}{1} = 5$.',
                            'Product: $\\alpha \\beta = \\frac{c}{a} = \\frac{6}{1} = 6$.',
                            'Check: roots are $2$ and $3$; $2+3=5$, $2 \\times 3 = 6$ ✓'
                        ],
                        final_answer: 'Sum = $5$, Product = $6$'
                    }
                ]
            },
            {
                title: '6. Quadratic Inequalities',
                content: `To solve $ax^2 + bx + c > 0$ or $ax^2 + bx + c < 0$ (or $\\geq$, $\\leq$):

1. Solve the equation $ax^2 + bx + c = 0$ to find the roots (critical values).
2. Sketch the parabola (opens up if $a > 0$, down if $a < 0$) and mark the roots.
3. Identify where the quadratic is positive (above the $x$-axis) or negative (below).
4. Write the solution set. For $ax^2 + bx + c > 0$ with two roots $p < q$: if $a > 0$, then $x < p$ or $x > q$; if $a < 0$, then $p < x < q$.`,
                worked_examples: [
                    {
                        question: 'Solve $x^2 - 5x + 6 > 0$.',
                        steps: [
                            'Solve $x^2 - 5x + 6 = 0$: $(x-2)(x-3) = 0$ so $x = 2$ or $x = 3$.',
                            'Parabola opens upward ($a = 1 > 0$). So $y > 0$ when $x < 2$ or $x > 3$.'
                        ],
                        final_answer: '$x < 2$ or $x > 3$'
                    },
                    {
                        question: 'Solve $x^2 - 4 \\leq 0$.',
                        steps: [
                            '$(x-2)(x+2) = 0$ when $x = 2$ or $x = -2$.',
                            'Parabola opens upward. $y \\leq 0$ between the roots: $-2 \\leq x \\leq 2$.'
                        ],
                        final_answer: '$-2 \\leq x \\leq 2$'
                    }
                ]
            }
        ],
        key_points: [
            'Standard form: $ax^2 + bx + c = 0$, $a \\neq 0$. Always rearrange to this before using the formula.',
            'Quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$. Discriminant $\\Delta = b^2 - 4ac$: $\\Delta > 0$ (two roots), $\\Delta = 0$ (one root), $\\Delta < 0$ (no real roots).',
            'Vertex (turning point): $x = -\\frac{b}{2a}$; substitute to find $y$. Completing the square gives vertex form $y = a(x-h)^2 + k$.',
            'Sum of roots = $-\\frac{b}{a}$, product of roots = $\\frac{c}{a}$.',
            'Quadratic inequalities: find roots, sketch parabola, then identify region where expression is positive or negative.'
        ],
        exam_tips: [
            'Always write the equation in standard form $ax^2 + bx + c = 0$ before factorising or using the formula.',
            'Check factorisation by expanding. For "nature of roots", only the discriminant is needed.',
            'When completing the square, halve the coefficient of $x$ and square it; add and subtract that number.',
            'Show all steps in the quadratic formula (substitute $a$, $b$, $c$; find $\\Delta$; then $x$).',
            'For quadratic inequalities, draw a quick sketch to see where the parabola is above or below the axis.',
            'Use the app\'s 1000+ practice questions to master quadratics and build speed.'
        ],
        visual_descriptions: [
            'Parabola opening upwards with vertex below x-axis and two x-intercepts.',
            'Parabola touching the x-axis at one point (repeated root, $\\Delta = 0$).',
            'Number line showing solution of $x^2 - 5x + 6 > 0$ as $x < 2$ or $x > 3$.'
        ]
    },
    'Linear Equations & Inequalities': {
        topic: 'Linear Equations & Inequalities',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'Linear equations have the form $ax + b = 0$ (or equivalent). This chapter covers: solving linear equations in one unknown (expanding brackets, clearing fractions, collecting terms); forming equations from word problems; simultaneous linear equations in two unknowns (elimination and substitution) and geometric interpretation (intersecting lines); special cases (no solution, infinitely many solutions); linear inequalities and the rule for reversing the inequality when multiplying or dividing by a negative; double inequalities and representing solutions on a number line.',
        sections: [
            {
                title: '1. Solving Linear Equations',
                content: `**Strategy**: Isolate the variable by performing the **same operation on both sides** (inverse operations undo each other).

**Steps**:
1. Remove brackets by expanding (and clear fractions by multiplying by the LCM of denominators if needed).
2. Collect like terms on each side.
3. Move all variable terms to one side and all constants to the other (add or subtract terms).
4. Divide (or multiply) by the coefficient of the variable.

**Equations with fractions**: Multiply every term by the **LCM** of the denominators to clear fractions, then solve as above. **Cross-multiplication**: For $\\frac{A}{B} = \\frac{C}{D}$, we have $AD = BC$.`,
                worked_examples: [
                    {
                        question: 'Solve: $3(2x - 4) = 2(x + 5)$',
                        steps: [
                            'Expand brackets: $6x - 12 = 2x + 10$.',
                            'Move variable terms: $6x - 2x = 10 + 12$.',
                            'Simplify: $4x = 22$.',
                            'Divide: $x = \\frac{22}{4} = \\frac{11}{2} = 5.5$.'
                        ],
                        final_answer: '$x = 5.5$ or $x = \\frac{11}{2}$'
                    },
                    {
                        question: 'Solve: $\\frac{x}{3} + \\frac{x}{4} = 7$',
                        steps: [
                            'Find LCM of 3 and 4: LCM = 12.',
                            'Multiply throughout by 12: $4x + 3x = 84$.',
                            'Combine: $7x = 84$.',
                            'Divide: $x = 12$.'
                        ],
                        final_answer: '$x = 12$'
                    },
                    {
                        question: 'Solve: $\\frac{2x - 1}{3} = \\frac{x + 4}{2}$',
                        steps: [
                            'Cross-multiply: $2(2x - 1) = 3(x + 4)$.',
                            'Expand: $4x - 2 = 3x + 12$.',
                            'Rearrange: $4x - 3x = 12 + 2$.',
                            '$x = 14$.'
                        ],
                        final_answer: '$x = 14$'
                    },
                    {
                        question: 'The sum of three consecutive integers is 72. Find the integers.',
                        steps: [
                            'Let the integers be $n$, $n+1$, $n+2$.',
                            'Form equation: $n + (n+1) + (n+2) = 72$.',
                            'Simplify: $3n + 3 = 72$.',
                            '$3n = 69 \\Rightarrow n = 23$.'
                        ],
                        final_answer: 'The integers are $23, 24, 25$'
                    },
                    {
                        question: 'A rectangle has perimeter 34 cm. The length is 5 cm more than the width. Find the dimensions.',
                        steps: [
                            'Let width = $w$ cm, then length = $(w + 5)$ cm.',
                            'Perimeter: $2(w + w + 5) = 34$ $\\Rightarrow$ $2(2w + 5) = 34$ $\\Rightarrow$ $4w + 10 = 34$.',
                            'So $4w = 24$, $w = 6$. Length = $6 + 5 = 11$ cm.'
                        ],
                        final_answer: 'Width = $6$ cm, Length = $11$ cm'
                    }
                ]
            },
            {
                title: '2. Simultaneous Equations',
                content: `Two linear equations in two unknowns $x$ and $y$ can be solved to find the unique pair $(x, y)$ that satisfies **both** (the point of intersection of two lines).

**Elimination**: Add or subtract multiples of the equations so that one variable cancels. Then solve for the other and back-substitute.

**Substitution**: From one equation, write one variable in terms of the other (e.g. $y = 5 - 2x$); substitute into the other equation to get one equation in one unknown.

**Special cases**: If after elimination you get $0 = 0$ (or equivalent), there are **infinitely many** solutions (same line). If you get $0 = k$ with $k \\neq 0$, there is **no solution** (parallel lines).`,
                worked_examples: [
                    {
                        question: 'Solve by substitution: $2x + 3y = 12$ and $4x - y = 5$',
                        steps: [
                            'From equation 2: $y = 4x - 5$.',
                            'Substitute into equation 1: $2x + 3(4x - 5) = 12$.',
                            'Expand: $2x + 12x - 15 = 12$.',
                            '$14x = 27 \\Rightarrow x = \\frac{27}{14}$.',
                            'Find $y$: $y = 4(\\frac{27}{14}) - 5 = \\frac{38}{14} = \\frac{19}{7}$.'
                        ],
                        final_answer: '$x = \\frac{27}{14}$, $y = \\frac{19}{7}$'
                    },
                    {
                        question: 'Solve by elimination: $3x + 2y = 7$ and $5x - 2y = 9$',
                        steps: [
                            'Add the equations to eliminate $y$:',
                            '$(3x + 2y) + (5x - 2y) = 7 + 9$.',
                            '$8x = 16 \\Rightarrow x = 2$.',
                            'Substitute $x = 2$ into equation 1: $3(2) + 2y = 7$.',
                            '$6 + 2y = 7 \\Rightarrow y = \\frac{1}{2}$.'
                        ],
                        final_answer: '$x = 2$, $y = \\frac{1}{2}$'
                    },
                    {
                        question: 'A pen costs $\\$x$ and a book costs $\\$y$. If 3 pens and 2 books cost $\\$21$, and 2 pens and 5 books cost $\\$36$, find $x$ and $y$.',
                        steps: [
                            'Form equations: $3x + 2y = 21$ ... (1)',
                            '$2x + 5y = 36$ ... (2)',
                            'Multiply (1) by 5: $15x + 10y = 105$.',
                            'Multiply (2) by 2: $4x + 10y = 72$.',
                            'Subtract: $11x = 33 \\Rightarrow x = 3$.',
                            'Substitute: $3(3) + 2y = 21 \\Rightarrow y = 6$.'
                        ],
                        final_answer: 'Pen = $\\$3$, Book = $\\$6$'
                    },
                    {
                        question: 'Solve: $2x + y = 8$ and $4x + 2y = 10$. What can you conclude?',
                        steps: [
                            'Multiply first equation by 2: $4x + 2y = 16$.',
                            'Subtract second: $(4x + 2y) - (4x + 2y) = 16 - 10$ $\\Rightarrow$ $0 = 6$.',
                            'This is impossible. So there is **no solution** (the lines are parallel).'
                        ],
                        final_answer: 'No solution; the equations represent parallel lines'
                    }
                ]
            },
            {
                title: '3. Solving Inequalities',
                content: `**Rules**: You may add or subtract the same quantity from both sides; you may multiply or divide both sides by a **positive** number without changing the inequality. **Critical rule**: When you multiply or divide both sides by a **negative** number, you must **reverse** the inequality sign ($<$ becomes $>$, $\\leq$ becomes $\\geq$, etc.).

**Notation on a number line**: $x > a$ — open circle at $a$, arrow to the right. $x \\geq a$ — closed (filled) circle at $a$, arrow to the right. Similarly for $<$ and $\\leq$ to the left.

**Double inequalities**: $a < x < b$ means $x$ is strictly between $a$ and $b$. Solve by performing the same operation on all three parts (and reverse both signs if multiplying/dividing by a negative).`,
                worked_examples: [
                    {
                        question: 'Solve: $-3x + 5 > 14$',
                        steps: [
                            'Subtract 5: $-3x > 9$.',
                            'Divide by $-3$ (reverse the sign!): $x < -3$.'
                        ],
                        final_answer: '$x < -3$'
                    },
                    {
                        question: 'Solve: $-2 \\leq 3x + 1 < 10$',
                        steps: [
                            'Subtract 1 from all parts: $-3 \\leq 3x < 9$.',
                            'Divide all parts by 3: $-1 \\leq x < 3$.'
                        ],
                        final_answer: '$-1 \\leq x < 3$'
                    },
                    {
                        question: 'Solve $2x - 5 \\geq 7$ and list integer solutions for $x \\leq 10$.',
                        steps: [
                            'Add 5: $2x \\geq 12$.',
                            'Divide by 2: $x \\geq 6$.',
                            'For $x \\leq 10$: solutions are $6 \\leq x \\leq 10$.'
                        ],
                        final_answer: 'Integer solutions: $\\{6, 7, 8, 9, 10\\}$'
                    },
                    {
                        question: 'Solve: $\\frac{x - 1}{2} > \\frac{x + 3}{4}$',
                        steps: [
                            'Multiply by 4 (LCM): $2(x - 1) > x + 3$.',
                            'Expand: $2x - 2 > x + 3$.',
                            'Rearrange: $2x - x > 3 + 2$.',
                            '$x > 5$.'
                        ],
                        final_answer: '$x > 5$'
                    }
                ]
            }
        ],
        key_points: [
            'Linear equation: do the same operation on both sides until $x = \\ldots$',
            'Equations with fractions: multiply through by the LCM of denominators, or cross-multiply for a single fraction equals another.',
            'Simultaneous equations: elimination (add/subtract to cancel a variable) or substitution (express one variable, then substitute).',
            'Inequalities: reverse the sign when multiplying or dividing by a negative number.',
            'Represent inequality solutions on a number line (open circle for $<$, $>$; closed for $\\leq$, $\\geq$).'
        ],
        exam_tips: [
            'Always check your solution by substituting back into the original equation(s).',
            'For equations with fractions, multiply every term by the LCM so no fractions remain.',
            'In simultaneous equations, if one equation has $x$ or $y$ with coefficient $1$ or $-1$, substitution is often quick.',
            'When solving inequalities, watch for division by a negative and reverse the sign.',
            'For "integer solutions" or "solutions in a range", list them explicitly (e.g. $\\{6, 7, 8, 9, 10\\}$).',
            'Use the app\'s 1000+ practice questions for equations and inequalities.'
        ],
        visual_descriptions: [
            'Number line with open circle at 2 and arrow right for $x > 2$.',
            'Graph of two lines intersecting at the unique solution of a pair of simultaneous equations.',
            'Number line for double inequality $-1 \\leq x < 3$ (closed at $-1$, open at $3$).'
        ]
    },
    'Indices and Logarithms': {
        topic: 'Indices and Logarithms',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'Indices (powers) and logarithms are inverse operations: $a^x = b$ $\\Leftrightarrow$ $x = \\log_a b$. This chapter covers: laws of indices for integer and fractional exponents ($a^{m+n}$, $a^{m-n}$, $a^{mn}$, $a^0$, $a^{-n}$, $a^{m/n}$); simplifying expressions with indices and solving simple exponential equations; definition of logarithm and conversion between exponential and log form; laws of logarithms (product, quotient, power); solving logarithmic equations; change of base formula. These are used in growth/decay, science, and further algebra.',
        sections: [
            {
                title: '1. Laws of Indices',
                content: `For base $a \\neq 0$ and integers (or rationals) $m$, $n$:

$$a^m \\times a^n = a^{m+n} \\quad ; \\quad a^m \\div a^n = a^{m-n}$$
$$(a^m)^n = a^{mn} \\quad ; \\quad (ab)^n = a^n b^n \\quad ; \\quad \\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}$$
$$a^0 = 1 \\quad ; \\quad a^{-n} = \\frac{1}{a^n}$$
$$a^{\\frac{m}{n}} = \\sqrt[n]{a^m} = (\\sqrt[n]{a})^m$$

**Fractional index**: $a^{1/n} = \\sqrt[n]{a}$. So $27^{1/3} = \\sqrt[3]{27} = 3$. When solving exponential equations, try to express both sides with the **same base** so you can equate exponents.`,
                worked_examples: [
                    {
                        question: 'Simplify: $\\frac{x^5 \\times x^{-2}}{x^4}$',
                        steps: [
                            'Numerator: $x^5 \\times x^{-2} = x^{5+(-2)} = x^3$.',
                            'Divide: $\\frac{x^3}{x^4} = x^{3-4} = x^{-1} = \\frac{1}{x}$.'
                        ],
                        final_answer: '$\\frac{1}{x}$ or $x^{-1}$'
                    },
                    {
                        question: 'Evaluate: $27^{\\frac{2}{3}}$',
                        steps: [
                            'Rewrite as $(27^{\\frac{1}{3}})^2$.',
                            '$27^{\\frac{1}{3}} = \\sqrt[3]{27} = 3$.',
                            '$3^2 = 9$.'
                        ],
                        final_answer: '$9$'
                    },
                    {
                        question: 'Simplify: $(2a^3b^{-2})^4$',
                        steps: [
                            'Apply power to each factor: $2^4 \\times (a^3)^4 \\times (b^{-2})^4$.',
                            '$= 16 \\times a^{12} \\times b^{-8}$.',
                            '$= \\frac{16a^{12}}{b^8}$.'
                        ],
                        final_answer: '$\\frac{16a^{12}}{b^8}$'
                    },
                    {
                        question: 'Solve: $2^{3x-1} = 16$',
                        steps: [
                            'Express 16 as a power of 2: $16 = 2^4$.',
                            'So $2^{3x-1} = 2^4$.',
                            'Equate exponents: $3x - 1 = 4$.',
                            '$3x = 5 \\Rightarrow x = \\frac{5}{3}$.'
                        ],
                        final_answer: '$x = \\frac{5}{3}$'
                    },
                    {
                        question: 'Simplify without negative indices: $\\frac{3x^{-2}y^3}{6x^4y^{-1}}$',
                        steps: [
                            'Coefficients: $\\frac{3}{6} = \\frac{1}{2}$.',
                            '$x$: $x^{-2-4} = x^{-6}$.',
                            '$y$: $y^{3-(-1)} = y^4$.',
                            'Result: $\\frac{y^4}{2x^6}$.'
                        ],
                        final_answer: '$\\frac{y^4}{2x^6}$'
                    },
                    {
                        question: 'Solve: $9^{x+1} = 27$',
                        steps: [
                            'Write bases as powers of 3: $9 = 3^2$, $27 = 3^3$.',
                            'So $(3^2)^{x+1} = 3^3$ $\\Rightarrow$ $3^{2(x+1)} = 3^3$.',
                            'Equate exponents: $2(x+1) = 3$ $\\Rightarrow$ $2x + 2 = 3$ $\\Rightarrow$ $x = \\frac{1}{2}$.'
                        ],
                        final_answer: '$x = \\frac{1}{2}$'
                    }
                ]
            },
            {
                title: '2. Introduction to Logarithms',
                content: `**Definition**: $\\log_a b = x$ means $a^x = b$ (where $a > 0$, $a \\neq 1$, $b > 0$). So logarithm is the **exponent** to which we raise $a$ to get $b$.

**Common log**: $\\log_{10} x$ often written as $\\log x$. **Natural log**: $\\log_e x$ written as $\\ln x$ (base $e \\approx 2.718$).

**Special values**: $\\log_a 1 = 0$ (since $a^0 = 1$); $\\log_a a = 1$ (since $a^1 = a$). **Domain**: For $\\log_a M$ to be defined, we need $M > 0$. Always check that solutions of log equations satisfy this.`,
                worked_examples: [
                    {
                        question: 'Evaluate: $\\log_2 32$',
                        steps: [
                            'Ask: $2$ raised to what power gives $32$?',
                            '$2^5 = 32$.',
                            'So $\\log_2 32 = 5$.'
                        ],
                        final_answer: '$5$'
                    },
                    {
                        question: 'Find $x$ if $\\log_5 x = 3$.',
                        steps: [
                            'Convert to exponential form: $5^3 = x$.',
                            'Calculate: $5^3 = 125$.'
                        ],
                        final_answer: '$x = 125$'
                    },
                    {
                        question: 'Find $x$ if $\\log_x 81 = 4$.',
                        steps: [
                            'Convert: $x^4 = 81$.',
                            'Find fourth root: $x = \\sqrt[4]{81} = 3$.',
                            'Check: $3^4 = 81$ ✓'
                        ],
                        final_answer: '$x = 3$'
                    },
                    {
                        question: 'Evaluate: $\\log_{10} 0.001$',
                        steps: [
                            '$0.001 = \\frac{1}{1000} = 10^{-3}$.',
                            '$\\log_{10} 10^{-3} = -3$.'
                        ],
                        final_answer: '$-3$'
                    },
                    {
                        question: 'Solve: $\\log_3 (x + 1) = 2$',
                        steps: [
                            'Convert to exponential form: $x + 1 = 3^2 = 9$.',
                            'So $x = 8$. Check: $x+1 = 9 > 0$ ✓'
                        ],
                        final_answer: '$x = 8$'
                    }
                ]
            },
            {
                title: '3. Laws of Logarithms',
                content: `For base $a > 0$, $a \\neq 1$, and $M, N > 0$:

$$\\log_a (MN) = \\log_a M + \\log_a N \\quad \\text{(log of product = sum of logs)}$$
$$\\log_a \\left(\\frac{M}{N}\\right) = \\log_a M - \\log_a N \\quad \\text{(log of quotient = difference)}$$
$$\\log_a (M^k) = k \\log_a M \\quad \\text{(log of power)}$$

**Change of base** (useful when calculator only has $\\log$ or $\\ln$):
$$\\log_a b = \\frac{\\log_c b}{\\log_c a} = \\frac{\\log b}{\\log a} = \\frac{\\ln b}{\\ln a}$$

When solving log equations, combine logs into a single log where possible, then convert to exponential form.`,
                worked_examples: [
                    {
                        question: 'Simplify: $\\log_3 12 - \\log_3 4$',
                        steps: [
                            'Apply subtraction rule: $\\log_3 \\frac{12}{4}$.',
                            'Simplify: $\\log_3 3 = 1$.'
                        ],
                        final_answer: '$1$'
                    },
                    {
                        question: 'Solve: $\\log_2 x + \\log_2 (x-2) = 3$',
                        steps: [
                            'Combine using addition rule: $\\log_2 [x(x-2)] = 3$.',
                            'Convert to exponential: $x(x-2) = 2^3 = 8$.',
                            'Expand: $x^2 - 2x - 8 = 0$.',
                            'Factor: $(x-4)(x+2) = 0$.',
                            '$x = 4$ or $x = -2$. Since $x > 2$ (for log to be defined), $x = 4$.'
                        ],
                        final_answer: '$x = 4$'
                    },
                    {
                        question: 'Given $\\log_{10} 2 \\approx 0.301$ and $\\log_{10} 3 \\approx 0.477$, find $\\log_{10} 6$ and $\\log_{10} 12$.',
                        steps: [
                            '$\\log_{10} 6 = \\log_{10} (2 \\times 3) = \\log_{10} 2 + \\log_{10} 3 \\approx 0.301 + 0.477 = 0.778$.',
                            '$\\log_{10} 12 = \\log_{10} (4 \\times 3) = \\log_{10} 4 + \\log_{10} 3 = 2\\log_{10} 2 + \\log_{10} 3 \\approx 0.602 + 0.477 = 1.079$.'
                        ],
                        final_answer: '$\\log_{10} 6 \\approx 0.778$, $\\log_{10} 12 \\approx 1.079$'
                    },
                    {
                        question: 'Solve: $\\log_2 x + \\log_2 (x+2) = 3$.',
                        steps: [
                            'Combine: $\\log_2 [x(x+2)] = 3$ $\\Rightarrow$ $x(x+2) = 2^3 = 8$.',
                            'So $x^2 + 2x - 8 = 0$. Use formula or complete the square: $x = -1 + \\sqrt{9} = 2$ or $x = -1 - 3 = -4$.',
                            'Reject $x = -4$ (log of negative undefined). So $x = 2$.'
                        ],
                        final_answer: '$x = 2$'
                    }
                ]
            }
        ],
        key_points: [
            'Index laws: $a^m a^n = a^{m+n}$, $a^m / a^n = a^{m-n}$, $(a^m)^n = a^{mn}$, $a^0 = 1$, $a^{-n} = 1/a^n$, $a^{m/n} = \\sqrt[n]{a^m}$.',
            '$\\log_a b = x$ $\\Leftrightarrow$ $a^x = b$. Domain: $b > 0$, $a > 0$, $a \\neq 1$.',
            'Log laws: $\\log(MN) = \\log M + \\log N$, $\\log(M/N) = \\log M - \\log N$, $\\log M^k = k \\log M$.',
            'Change of base: $\\log_a b = \\frac{\\log b}{\\log a}$. When solving log equations, always check that arguments remain positive.'
        ],
        exam_tips: [
            'Memorise all index laws including fractional and negative indices.',
            'For exponential equations, express both sides with the same base so you can equate exponents.',
            'Convert between $\\log_a b = x$ and $a^x = b$ confidently.',
            'In log equations, combine logs (product/quotient/power rules) then convert to exponential form.',
            'After solving, verify that all arguments of logarithms in the original equation are positive.',
            'Use the app\'s 1000+ practice questions on indices and logarithms.'
        ],
        visual_descriptions: [
            'Graph of $y = 2^x$ (exponential growth) and $y = \\log_2 x$ (log curve) as reflections in the line $y = x$.',
            'Table linking exponential form $a^x = b$ and log form $\\log_a b = x$.'
        ]
    }
};

export const algebraTopics = Object.keys(algebraNotes);
