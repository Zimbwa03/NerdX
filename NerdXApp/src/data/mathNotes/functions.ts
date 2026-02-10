import { MathTopicNotes } from './types';

export const functionsNotes: Record<string, MathTopicNotes> = {
    'Functions': {
        topic: 'Functions',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'A function assigns to each input exactly one output. This chapter covers: function notation $f(x)$ and $f: x \\mapsto \\ldots$; domain (allowed inputs) and range (resulting outputs); evaluating functions and finding inputs from outputs; inverse functions $f^{-1}$ (when they exist, and how to find them by swapping $x$ and $y$); composite functions $fg(x) = f(g(x))$ and $gf(x)$; arithmetic and geometric sequences (nth term, sum of n terms, sum to infinity for GP with $|r|<1$); identifying sequence type and finding missing terms. Functions and sequences appear throughout O-Level and in real-world modelling.',
        sections: [
            {
                title: '1. Function Notation, Domain and Range',
                content: `**Function**: A rule that assigns to each element of a set (the **domain**) exactly one element of another set (the **codomain**). We write $f(x)$ for the output when the input is $x$, or $f: x \\mapsto 2x+3$.

**Evaluating**: Replace $x$ with the given number (use brackets for negatives: $f(-2) = 2(-2)+3 = -1$).

**Domain**: The set of all allowed **inputs** (often all real numbers $\\mathbb{R}$, or restricted to avoid division by zero or square roots of negatives). For $f(x) = \\frac{1}{x-2}$, domain is $x \\neq 2$.

**Range**: The set of all **outputs** when the domain is used. For $f(x) = x^2$ with domain $\\mathbb{R}$, the range is $y \\geq 0$. Finding the range often requires thinking about the graph or the maximum/minimum of the expression.`,
                worked_examples: [
                    {
                        question: 'Given $f(x) = 3x - 5$, find $f(2)$, $f(-1)$ and the value of $x$ for which $f(x) = 10$.',
                        steps: [
                            '$f(2) = 3(2) - 5 = 6 - 5 = 1$.',
                            '$f(-1) = 3(-1) - 5 = -3 - 5 = -8$.',
                            'Solve $3x - 5 = 10$: $3x = 15$, so $x = 5$.'
                        ],
                        final_answer: '$f(2) = 1$, $f(-1) = -8$, and $f(x)=10$ when $x=5$'
                    },
                    {
                        question: 'State the domain of $g(x) = \\frac{1}{x+4}$. Find $g(-3)$.',
                        steps: [
                            'Domain: denominator must not be zero, so $x + 4 \\neq 0$, i.e. $x \\neq -4$.',
                            '$g(-3) = \\frac{1}{-3+4} = \\frac{1}{1} = 1$.'
                        ],
                        final_answer: 'Domain: $x \\neq -4$. $g(-3) = 1$.'
                    },
                    {
                        question: 'If $h(x) = x^2 - 4x + 1$, find $h(a+1)$ in expanded form.',
                        steps: [
                            'Substitute $x = a+1$: $h(a+1) = (a+1)^2 - 4(a+1) + 1$.',
                            'Expand: $(a^2 + 2a + 1) - 4a - 4 + 1 = a^2 - 2a - 2$.'
                        ],
                        final_answer: '$h(a+1) = a^2 - 2a - 2$'
                    }
                ]
            },
            {
                title: '2. Inverse Functions',
                content: `The **inverse function** $f^{-1}$ undoes $f$: if $f(a) = b$, then $f^{-1}(b) = a$. So $f^{-1}(f(x)) = x$ and $f(f^{-1}(x)) = x$ (when both are defined).

**When does $f^{-1}$ exist?** Only when $f$ is **one-to-one** (each output comes from exactly one input). On a graph, the inverse is the reflection of $f$ in the line $y = x$. Domain of $f$ becomes range of $f^{-1}$, and range of $f$ becomes domain of $f^{-1}$.

**Method to find $f^{-1}(x)$**:
1. Write $y = f(x)$.
2. **Swap** $x$ and $y$ (so $x = f(y)$).
3. Rearrange to make $y$ the subject.
4. The result is $y = f^{-1}(x)$.`,
                worked_examples: [
                    {
                        question: 'Find the inverse of $f(x) = 2x + 4$. State the domain of $f^{-1}$.',
                        steps: [
                            'Let $y = 2x + 4$. Swap: $x = 2y + 4$.',
                            'Solve for $y$: $x - 4 = 2y$, so $y = \\frac{x-4}{2}$.',
                            'Hence $f^{-1}(x) = \\frac{x-4}{2}$.',
                            'Domain of $f^{-1}$ = range of $f$. Since $f(x)=2x+4$ can take any real value, domain of $f^{-1}$ is all $\\mathbb{R}$.'
                        ],
                        final_answer: '$f^{-1}(x) = \\frac{x-4}{2}$, domain $\\mathbb{R}$'
                    },
                    {
                        question: 'Given $g(x) = \\frac{x+1}{3}$, find $g^{-1}(x)$ and verify $g(g^{-1}(x)) = x$.',
                        steps: [
                            '$y = \\frac{x+1}{3}$. Swap: $x = \\frac{y+1}{3}$ $\\Rightarrow$ $3x = y+1$ $\\Rightarrow$ $y = 3x - 1$. So $g^{-1}(x) = 3x - 1$.',
                            'Verify: $g(g^{-1}(x)) = g(3x-1) = \\frac{(3x-1)+1}{3} = \\frac{3x}{3} = x$ $\\checkmark$.'
                        ],
                        final_answer: '$g^{-1}(x) = 3x - 1$; verification shown'
                    },
                    {
                        question: 'Find the inverse of $h(x) = \\frac{5}{x-2}$, $x \\neq 2$.',
                        steps: [
                            'Let $y = \\frac{5}{x-2}$. Swap: $x = \\frac{5}{y-2}$.',
                            'Multiply: $x(y-2) = 5$ $\\Rightarrow$ $xy - 2x = 5$ $\\Rightarrow$ $xy = 5 + 2x$.',
                            'So $y = \\frac{5+2x}{x}$ (for $x \\neq 0$). Hence $h^{-1}(x) = \\frac{5+2x}{x}$, $x \\neq 0$.'
                        ],
                        final_answer: '$h^{-1}(x) = \\frac{5+2x}{x}$, $x \\neq 0$'
                    }
                ]
            },
            {
                title: '3. Composite Functions',
                content: `**Composite function** $fg$ (or $f \\circ g$) means: apply $g$ first, then apply $f$ to the result. So
$$ fg(x) = f(g(x)) $$
**Order matters**: In general $fg(x) \\neq gf(x)$. Read "$fg$" as "$f$ of $g$" — do $g$ first.

**Domain**: For $fg(x)$ to be defined, we need $x$ in the domain of $g$, and $g(x)$ in the domain of $f$. So the domain of $fg$ may be restricted.

**Repeated composition**: $ff(x) = f(f(x))$; sometimes written $f^2(x)$ (not to be confused with $(f(x))^2$).`,
                worked_examples: [
                    {
                        question: 'If $f(x) = x^2$ and $g(x) = x + 3$, find $fg(x)$, $gf(x)$ and $fg(2)$.',
                        steps: [
                            '$fg(x) = f(g(x)) = f(x+3) = (x+3)^2 = x^2 + 6x + 9$.',
                            '$gf(x) = g(f(x)) = g(x^2) = x^2 + 3$.',
                            '$fg(2) = f(g(2)) = f(5) = 25$, or from $fg(x)$: $(2+3)^2 = 25$.'
                        ],
                        final_answer: '$fg(x) = (x+3)^2$, $gf(x) = x^2+3$, $fg(2) = 25$'
                    },
                    {
                        question: 'Find $ff(3)$ if $f(x) = 2x - 1$.',
                        steps: [
                            '$f(3) = 2(3) - 1 = 5$.',
                            '$ff(3) = f(f(3)) = f(5) = 2(5) - 1 = 9$.'
                        ],
                        final_answer: '$9$'
                    },
                    {
                        question: 'If $f(x) = 2x+1$ and $g(x) = x^2$, find $x$ such that $gf(x) = 25$.',
                        steps: [
                            '$gf(x) = g(f(x)) = g(2x+1) = (2x+1)^2$.',
                            'Set $(2x+1)^2 = 25$ $\\Rightarrow$ $2x+1 = \\pm 5$.',
                            'So $2x+1 = 5$ $\\Rightarrow$ $x = 2$; or $2x+1 = -5$ $\\Rightarrow$ $x = -3$.'
                        ],
                        final_answer: '$x = 2$ or $x = -3$'
                    }
                ]
            },
            {
                title: '4. Arithmetic and Geometric Sequences',
                content: `**Sequence**: An ordered list of numbers; $u_n$ (or $T_n$) denotes the $n$th term.

**Arithmetic sequence (AP)**: Each term is the previous term **plus a constant** $d$ (common difference). First term $a$.
$$ u_n = a + (n-1)d $$
**Sum of first $n$ terms**: $S_n = \\frac{n}{2}[2a + (n-1)d] = \\frac{n}{2}(\\text{first} + \\text{last})$.

**Geometric sequence (GP)**: Each term is the previous term **multiplied by** $r$ (common ratio). First term $a$.
$$ u_n = a r^{n-1} $$
**Sum of first $n$ terms** (for $r \\neq 1$): $S_n = \\frac{a(1-r^n)}{1-r}$ or $S_n = \\frac{a(r^n - 1)}{r-1}$.
**Sum to infinity** (only when $|r| < 1$): $S_\\infty = \\frac{a}{1-r}$.

**Identifying type**: Check if differences are constant (AP) or ratios are constant (GP).`,
                worked_examples: [
                    {
                        question: 'Find the $n$th term of $5, 8, 11, 14, \\ldots$ and the sum of the first 20 terms.',
                        steps: [
                            'AP with $a=5$, $d=3$. So $u_n = 5 + (n-1)(3) = 3n + 2$.',
                            '20th term: $u_{20} = 3(20)+2 = 62$.',
                            'Sum: $S_{20} = \\frac{20}{2}(5 + 62) = 10 \\times 67 = 670$.'
                        ],
                        final_answer: '$u_n = 3n+2$, $S_{20} = 670$'
                    },
                    {
                        question: 'Find the 10th term of $2, 6, 18, 54, \\ldots$ and the sum of the first 10 terms.',
                        steps: [
                            'GP with $a=2$, $r=3$. So $u_{10} = 2 \\times 3^{9} = 2 \\times 19683 = 39366$.',
                            'Sum: $S_{10} = \\frac{a(r^{10}-1)}{r-1} = \\frac{2(3^{10}-1)}{2} = 3^{10} - 1 = 59049 - 1 = 59048$.'
                        ],
                        final_answer: '$u_{10} = 39366$, $S_{10} = 59048$'
                    },
                    {
                        question: 'The first term of a GP is 12 and the common ratio is $\\frac{1}{2}$. Find the sum to infinity.',
                        steps: [
                            'Since $|r| = \\frac{1}{2} < 1$, sum to infinity exists.',
                            '$S_\\infty = \\frac{a}{1-r} = \\frac{12}{1 - \\frac{1}{2}} = \\frac{12}{\\frac{1}{2}} = 24$.'
                        ],
                        final_answer: '$S_\\infty = 24$'
                    },
                    {
                        question: 'In an AP, the 5th term is 17 and the 9th term is 29. Find the first term and common difference.',
                        steps: [
                            '$u_5 = a + 4d = 17$ and $u_9 = a + 8d = 29$.',
                            'Subtract: $4d = 12$ $\\Rightarrow$ $d = 3$.',
                            'Then $a + 4(3) = 17$ $\\Rightarrow$ $a = 5$.'
                        ],
                        final_answer: '$a = 5$, $d = 3$'
                    }
                ]
            }
        ],
        key_points: [
            'Domain = allowed inputs; range = possible outputs. For $1/(x-k)$, domain is $x \\neq k$.',
            'Inverse $f^{-1}$: swap $x$ and $y$ in $y=f(x)$, then solve for $y$. Only one-to-one functions have an inverse.',
            'Composite: $fg(x) = f(g(x))$ — do $g$ first, then $f$. Order matters.',
            'AP: $u_n = a + (n-1)d$; $S_n = \\frac{n}{2}(2a + (n-1)d)$. GP: $u_n = ar^{n-1}$; $S_n = \\frac{a(1-r^n)}{1-r}$; $S_\\infty = \\frac{a}{1-r}$ when $|r|<1$.'
        ],
        exam_tips: [
            'Read composite notation carefully: $fg$ means apply $g$ then $f$.',
            'When finding $f^{-1}$, swap $x$ and $y$ then rearrange; state domain of $f^{-1}$ if asked.',
            'For sequences: check first differences (AP) or ratios (GP). Use $u_n$ for nth term, $S_n$ for sum.',
            'Sum to infinity only exists for GP when $|r| < 1$.',
            'Verify inverse by checking $f(f^{-1}(x)) = x$ or $f^{-1}(f(x)) = x$.',
            'Use the app\'s 1000+ practice questions on functions and sequences.'
        ],
        visual_descriptions: [
            'Function machine: input $x$ $\\to$ rule $f$ $\\to$ output $f(x)$.',
            'Graph of $y=f(x)$ and $y=f^{-1}(x)$ as reflections in the line $y=x$.',
            'Number line or diagram for domain/range restrictions.',
            'Arithmetic sequence as evenly spaced points; geometric as a growing/shrinking pattern.'
        ]
    }
};

export const functionsTopics = Object.keys(functionsNotes);
