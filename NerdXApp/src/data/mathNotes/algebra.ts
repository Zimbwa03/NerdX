import { MathTopicNotes } from './types';

export const algebraNotes: Record<string, MathTopicNotes> = {
    'Algebraic Expressions': {
        topic: 'Algebraic Expressions',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'Algebraic expressions use letters (variables) to represent unknown or varying quantities. Mastering simplification, expansion, and factorization of expressions is fundamental to algebra.',
        sections: [
            {
                title: 'Basic Terminology',
                content: `**Variable**: A letter representing an unknown quantity, e.g., $x$, $y$, $a$.

**Constant**: A fixed numerical value, e.g., $5$, $-3$, $\\pi$.

**Coefficient**: The numerical factor of a term. In $7x^2$, the coefficient is $7$.

**Term**: A single algebraic expression (constant, variable, or product of both). E.g., $3x$, $-5y^2$, $12$.

**Like Terms**: Terms with the same variable(s) raised to the same power(s).
- Like terms: $3x^2$ and $-5x^2$
- Unlike terms: $3x^2$ and $3x$`,
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
                    }
                ]
            },
            {
                title: 'Simplifying Algebraic Expressions',
                content: `**Collecting Like Terms**: Add or subtract terms with the same variables.

$$3x + 5y - 2x + 3y = (3x - 2x) + (5y + 3y) = x + 8y$$

**Multiplying with Indices**:
$$a^m \\times a^n = a^{m+n}$$
$$a^m \\div a^n = a^{m-n}$$
$$(a^m)^n = a^{mn}$$`,
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
                    }
                ]
            },
            {
                title: 'Expansion of Brackets',
                content: `**Single Bracket**: Multiply each term inside by the term outside.
$$a(b + c) = ab + ac$$

**Two Binomials (FOIL)**: 
$$(a + b)(c + d) = ac + ad + bc + bd$$

**Special Products**:
$$(a + b)^2 = a^2 + 2ab + b^2$$
$$(a - b)^2 = a^2 - 2ab + b^2$$
$$(a + b)(a - b) = a^2 - b^2$$`,
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
                    }
                ]
            },
            {
                title: 'Factorization',
                content: `**Common Factor**: Find the HCF of all terms.
$$6x^2 + 9x = 3x(2x + 3)$$

**Difference of Two Squares**:
$$a^2 - b^2 = (a + b)(a - b)$$

**Trinomial Factorization** (for $x^2 + bx + c$):
Find two numbers that multiply to $c$ and add to $b$.
$$x^2 + 5x + 6 = (x + 2)(x + 3)$$

**Grouping**: For expressions with 4 terms.
$$ax + ay + bx + by = a(x + y) + b(x + y) = (a + b)(x + y)$$`,
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
                    }
                ]
            },
            {
                title: 'Algebraic Fractions',
                content: `**Simplifying Algebraic Fractions**: Factor numerator and denominator, then cancel common factors.

$$\\frac{x^2 - 4}{x + 2} = \\frac{(x+2)(x-2)}{x+2} = x - 2$$

**Addition/Subtraction**: Find common denominator.
$$\\frac{a}{b} + \\frac{c}{d} = \\frac{ad + bc}{bd}$$

**Multiplication**: Multiply numerators and denominators.
$$\\frac{a}{b} \\times \\frac{c}{d} = \\frac{ac}{bd}$$

**Division**: Multiply by reciprocal.
$$\\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\times \\frac{d}{c} = \\frac{ad}{bc}$$`,
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
                    }
                ]
            }
        ],
        key_points: [
            'Like terms have identical variable parts (same variables with same powers).',
            'Use index laws: $a^m \\\\times a^n = a^{m+n}$, $a^m \\\\div a^n = a^{m-n}$.',
            'Special products: $(a+b)^2 = a^2 + 2ab + b^2$, $(a-b)(a+b) = a^2 - b^2$.',
            'Always factor completely: look for common factors first, then special patterns.',
            'For algebraic fractions: factorize first, then cancel common factors.',
            'To add/subtract fractions, find common denominator; to divide, multiply by reciprocal.'
        ],
        exam_tips: [
            'Always look for common factors before applying other factorization methods.',
            'For trinomials $ax^2 + bx + c$: find numbers that multiply to $ac$ and add to $b$.',
            'Check expansions by substituting $x = 1$ or $x = 2$.',
            'When simplifying algebraic fractions, state any restrictions (values that make denominator zero).',
            'In factorization questions, \"completely\" means continue until no more factors possible.'
        ],
        visual_descriptions: [
            'Area model showing $(a+b)(c+d)$ as a rectangle divided into four parts.',
            'Factor tree diagram for algebraic expressions.',
            'Number line showing restrictions for algebraic fractions.'
        ]
    },
    'Quadratic Equations': {
        topic: 'Quadratic Equations',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'A quadratic equation is any equation that can be rearranged in standard form as $ax^{2} + bx + c = 0$ where $a \\neq 0$. There are three main methods for solving them.',
        sections: [
            {
                title: 'Solving by Factoring',
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
                    }
                ]
            },
            {
                title: 'The Quadratic Formula',
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
                    }
                ]
            },
            {
                title: 'Completing the Square',
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
                    }
                ]
            },
            {
                title: 'Graphing Quadratic Functions',
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
            }
        ],
        key_points: [
            'Standard form: $ax^2 + bx + c = 0$, $a \\neq 0$.',
            'Quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$.',
            'Discriminant determines the nature of roots.',
            'Vertex: $x = -\\frac{b}{2a}$.'
        ],
        exam_tips: [
            'Always rearrange to standard form before solving.',
            'Check factoring by expanding the brackets.',
            'For completing the square, halve the coefficient of $x$.',
            'Show all steps when using the quadratic formula.'
        ],
        visual_descriptions: [
            'Parabola opening upwards with vertex below x-axis showing two x-intercepts.',
            'Parabola touching x-axis at one point (discriminant = 0).'
        ]
    },
    'Linear Equations & Inequalities': {
        topic: 'Linear Equations & Inequalities',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'Linear equations involve variables raised to the first power. Inequalities compare expressions using symbols like $<$, $>$, $\\leq$, $\\geq$.',
        sections: [
            {
                title: 'Solving Linear Equations',
                content: `**Strategy**: Isolate the variable by performing inverse operations on both sides.

**Steps**:
1. Remove brackets by expanding.
2. Collect like terms.
3. Move all variable terms to one side.
4. Move all constants to the other side.
5. Divide by the coefficient of the variable.`,
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
                    }
                ]
            },
            {
                title: 'Simultaneous Equations',
                content: `**Elimination Method**: Add or subtract equations to eliminate one variable.

**Substitution Method**: Express one variable in terms of the other, then substitute.

**Formula for two equations**:
$$ax + by = c$$
$$dx + ey = f$$`,
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
                    }
                ]
            },
            {
                title: 'Solving Inequalities',
                content: `**Rules** (same as equations, except):
- When multiplying/dividing by a **negative** number, **reverse the inequality sign**.

**Notation**:
- $x > 3$: Open circle at 3, arrow pointing right.
- $x \\leq 3$: Closed circle at 3, arrow pointing left.

**Double Inequalities**: $a < x < b$ means $x$ is between $a$ and $b$.`,
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
            'Perform the same operation on both sides of an equation.',
            'Reverse the inequality when multiplying/dividing by a negative.',
            'Use elimination or substitution for simultaneous equations.',
            'Represent solutions on a number line.'
        ],
        exam_tips: [
            'Always check your solution by substituting back.',
            'For fractions, multiply by the LCM to clear denominators.',
            'Write the solution set clearly for inequalities.'
        ],
        visual_descriptions: [
            'Number line showing $x > 2$ with open circle at 2.',
            'Graph of two intersecting lines representing simultaneous equations.'
        ]
    },
    'Indices and Logarithms': {
        topic: 'Indices and Logarithms',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'Indices (powers/exponents) and logarithms are inverse operations. Understanding their laws is essential for simplifying expressions and solving equations.',
        sections: [
            {
                title: 'Laws of Indices',
                content: `For any non-zero base $a$ and integers $m$, $n$:

$$a^m \\times a^n = a^{m+n}$$
$$a^m \\div a^n = a^{m-n}$$
$$(a^m)^n = a^{mn}$$
$$(ab)^n = a^n b^n$$
$$a^0 = 1$$
$$a^{-n} = \\frac{1}{a^n}$$
$$a^{\\frac{m}{n}} = \\sqrt[n]{a^m} = (\\sqrt[n]{a})^m$$`,
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
                    }
                ]
            },
            {
                title: 'Introduction to Logarithms',
                content: `**Definition**: If $a^x = b$, then $\\log_a b = x$.

$\\log_a b = x$ means "$a$ raised to the power $x$ gives $b$."

**Common Logarithms**: $\\log_{10} x$ (written as $\\log x$).
**Natural Logarithms**: $\\log_e x$ (written as $\\ln x$).

**Special Values**:
$$\\log_a 1 = 0 \\quad (\\text{since } a^0 = 1)$$
$$\\log_a a = 1 \\quad (\\text{since } a^1 = a)$$`,
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
                    }
                ]
            },
            {
                title: 'Laws of Logarithms',
                content: `For $a > 0$, $a \\neq 1$, and $M, N > 0$:

$$\\log_a (MN) = \\log_a M + \\log_a N$$
$$\\log_a \\left(\\frac{M}{N}\\right) = \\log_a M - \\log_a N$$
$$\\log_a (M^k) = k \\log_a M$$

**Change of Base Formula**:
$$\\log_a b = \\frac{\\log_c b}{\\log_c a}$$`,
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
                    }
                ]
            }
        ],
        key_points: [
            '$a^m \\times a^n = a^{m+n}$, $a^m \\div a^n = a^{m-n}$.',
            '$\\log_a b = x$ means $a^x = b$.',
            '$\\log_a (MN) = \\log_a M + \\log_a N$.',
            'Always check domain restrictions for logarithms.'
        ],
        exam_tips: [
            'Memorize all index laws.',
            'Convert between logarithmic and exponential forms.',
            'For log equations, combine logs before converting.'
        ],
        visual_descriptions: [
            'Exponential curve $y = 2^x$ and its inverse $y = \\log_2 x$ as reflections about $y = x$.'
        ]
    }
};

export const algebraTopics = Object.keys(algebraNotes);
