import { MathTopicNotes } from './types';

export const functionsNotes: Record<string, MathTopicNotes> = {
    'Functions': {
        topic: 'Functions',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'A function maps an input to a specific output. This topic covers function notation, finding inverses, composite functions, and number sequences.',
        sections: [
            {
                title: 'Function Notation',
                content: `A function is a rule, often written as $f(x)$ or $f: x \\to ...$
Example: $f(x) = 2x + 3$.
- **Input**: The value you put in (e.g., $x=4$).
- **Output**: The result ($f(4) = 2(4) + 3 = 11$).

**Domain**: Set of possible x-values.
**Range**: Set of possible outcomes (y-values).`,
                worked_examples: [
                    {
                        question: 'Given $f(x) = 3x - 5$, find $f(2)$ and $f(-1)$.',
                        steps: [
                            'Substitute $x=2$: $f(2) = 3(2) - 5 = 6 - 5 = 1$.',
                            'Substitute $x=-1$: $f(-1) = 3(-1) - 5 = -3 - 5 = -8$.'
                        ],
                        final_answer: '$f(2) = 1, f(-1) = -8$'
                    }
                ]
            },
            {
                title: 'Inverse Functions',
                content: `The inverse function $f^{-1}(x)$ reverses the operation of $f(x)$.
If $f(a) = b$, then $f^{-1}(b) = a$.

**Steps to find Inverse**:
1. Write $y = f(x)$.
2. Swap $x$ and $y$.
3. Rearrange to make $y$ the subject.
4. Replace $y$ with $f^{-1}(x)$.`,
                worked_examples: [
                    {
                        question: 'Find the inverse of $f(x) = 2x + 4$.',
                        steps: [
                            'Let $y = 2x + 4$.',
                            'Swap variables: $x = 2y + 4$.',
                            'Solve for $y$: $x - 4 = 2y$.',
                            '$y = \\frac{x - 4}{2}$.',
                            'So $f^{-1}(x) = \\frac{x - 4}{2}$.'
                        ],
                        final_answer: '$f^{-1}(x) = \\frac{x - 4}{2}$'
                    },
                    {
                        question: 'Given $g(x) = \\frac{x+1}{3}$, find $g^{-1}(x)$.',
                        steps: [
                            '$y = \\frac{x+1}{3}$.',
                            'Swap: $x = \\frac{y+1}{3}$.',
                            'Multiply by 3: $3x = y + 1$.',
                            'Subtract 1: $y = 3x - 1$.'
                        ],
                        final_answer: '$g^{-1}(x) = 3x - 1$'
                    }
                ]
            },
            {
                title: 'Composite Functions',
                content: `**Composite Function**: Applying one function after another.
$fg(x)$ means find $g(x)$ first, then put that result into $f$.
$$ fg(x) = f(g(x)) $$
Note: Order matters! $fg(x) \\neq gf(x)$.`,
                worked_examples: [
                    {
                        question: 'If $f(x) = x^2$ and $g(x) = x + 3$, find $fg(x)$ and $gf(x)$.',
                        steps: [
                            '$fg(x) = f(g(x)) = f(x+3) = (x+3)^2 = x^2 + 6x + 9$.',
                            '$gf(x) = g(f(x)) = g(x^2) = x^2 + 3$.'
                        ],
                        final_answer: '$fg(x) = (x+3)^2, gf(x) = x^2+3$'
                    },
                    {
                        question: 'Find $ff(3)$ if $f(x) = 2x$.',
                        steps: [
                            'First find $f(3) = 2(3) = 6$.',
                            'Now find $f(6) = 2(6) = 12$.'
                        ],
                        final_answer: '$12$'
                    }
                ]
            },
            {
                title: 'Sequences',
                content: `A list of numbers following a pattern.
$u_n$ is the $n$-th term.

**Arithmetic Sequence**: Common difference $d$.
$$ u_n = a + (n-1)d $$
where $a$ is the first term.

**Geometric Sequence**: Common ratio $r$.
$$ u_n = a r^{n-1} $$`,
                worked_examples: [
                    {
                        question: 'Find the $n$-th term of the sequence $5, 8, 11, 14, ...$',
                        steps: [
                            'It is arithmetic with $a=5$ and difference $d=3$.',
                            '$u_n = 5 + (n-1)3$.',
                            '$u_n = 5 + 3n - 3 = 3n + 2$.'
                        ],
                        final_answer: '$u_n = 3n + 2$'
                    },
                    {
                        question: 'Find the 10th term of $2, 6, 18, 54, ...$',
                        steps: [
                            'Geometric with $a=2$ and ratio $r=3$.',
                            '$u_{10} = 2 \\times 3^{10-1} = 2 \\times 3^9$.',
                            '$3^9 = 19683$.',
                            '$2 \\times 19683 = 39366$.'
                        ],
                        final_answer: '$39366$'
                    }
                ]
            }
        ],
        key_points: [
            'Inverse function $f^{-1}(x)$ undoes $f(x)$.',
            'Composite $fg(x)$ means do $g$ first, then $f$.',
            'To find inverse, swap $x$ and $y$ and solve.'
        ],
        exam_tips: [
            'Read composite functions from right to left.',
            'When finding inverse, isolate the variable carefully.',
            'For sequences, check if difference is constant (arithmetic) or ratio is constant (geometric).'
        ],
        visual_descriptions: [
            'Function machine diagram showing Input $\\to$ Function $\\to$ Output.',
            'Graph showing reflection of $f(x)$ and $f^{-1}(x)$ across $y=x$.'
        ]
    }
};

export const functionsTopics = Object.keys(functionsNotes);
