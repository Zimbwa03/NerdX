import { MathTopicNotes } from './types';

export const matricesNotes: Record<string, MathTopicNotes> = {
    'Matrices': {
        topic: 'Matrices',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'A matrix is a rectangular array of numbers arranged in rows and columns. This chapter covers: notation and order ($m \\times n$); types (row, column, square, zero, identity); equality and element notation $a_{ij}$; addition, subtraction and scalar multiplication (same order required); matrix multiplication (row-by-column rule, when $AB$ is defined); the determinant of a $2 \\times 2$ matrix and singular matrices; the inverse of a $2 \\times 2$ matrix and the formula using the determinant; using matrices to solve simultaneous linear equations ($AX = B$ $\\Rightarrow$ $X = A^{-1}B$). Matrices are used in transformations and in solving systems of equations.',
        sections: [
            {
                title: '1. Introduction to Matrices',
                content: `**Matrix**: A rectangular array of numbers (or expressions) arranged in **rows** (horizontal) and **columns** (vertical). We write them in brackets (round or square).

**Order (size)**: An $m \\times n$ matrix has $m$ rows and $n$ columns. Always state order as (rows) $\\times$ (columns).

**Types**: **Row matrix** $1 \\times n$ (one row); **column matrix** $m \\times 1$ (one column); **square matrix** $n \\times n$ (same number of rows and columns). **Zero matrix** $O$ has every element 0.

**Element notation**: $a_{ij}$ or $(A)_{ij}$ is the entry in **row $i$**, **column $j$** (row first, then column).

**Equality**: Two matrices are equal **only if** they have the **same order** and **every corresponding element** is equal. So $A = B$ means $a_{ij} = b_{ij}$ for all $i$, $j$.`,
                worked_examples: [
                    {
                        question: 'State the order of the matrix $A = \\begin{pmatrix} 2 & -1 & 5 \\\\ 0 & 3 & 8 \\end{pmatrix}$.',
                        steps: [
                            'Count the rows: There are 2 rows.',
                            'Count the columns: There are 3 columns.',
                            'Order is row $\\times$ column.'
                        ],
                        final_answer: '$2 \\times 3$'
                    },
                    {
                        question: 'If $\\begin{pmatrix} x & 3 \\\\ -2 & y \\end{pmatrix} = \\begin{pmatrix} 4 & 3 \\\\ -2 & 7 \\end{pmatrix}$, find $x$ and $y$.',
                        steps: [
                            'Matrices are equal, so corresponding elements match.',
                            'Top-left: $x = 4$.',
                            'Bottom-right: $y = 7$.'
                        ],
                        final_answer: '$x = 4, y = 7$'
                    },
                    {
                        question: 'Write down the $2 \\times 2$ identity matrix $I$ and the $2 \\times 2$ zero matrix $O$.',
                        steps: [
                            'Identity: 1 on the main diagonal (top-left to bottom-right), 0 elsewhere: $I = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$.',
                            'Zero matrix: every element 0: $O = \\begin{pmatrix} 0 & 0 \\\\ 0 & 0 \\end{pmatrix}$.'
                        ],
                        final_answer: '$I = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$, $O = \\begin{pmatrix} 0 & 0 \\\\ 0 & 0 \\end{pmatrix}$'
                    }
                ]
            },
            {
                title: '2. Addition, Subtraction and Scalar Multiplication',
                content: `**Addition and subtraction**: Defined **only when** the two matrices have the **same order**. Add (or subtract) **corresponding elements**.
$$ \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} + \\begin{pmatrix} e & f \\\\ g & h \\end{pmatrix} = \\begin{pmatrix} a+e & b+f \\\\ c+g & d+h \\end{pmatrix} $$

**Scalar multiplication**: Multiply **every** element by the scalar $k$. The order of the matrix does not change.
$$ k \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = \\begin{pmatrix} ka & kb \\\\ kc & kd \\end{pmatrix} $$

**Properties**: $A + B = B + A$ (commutative); $(A+B)+C = A+(B+C)$; $k(A+B) = kA + kB$.`,
                worked_examples: [
                    {
                        question: 'Given $A = \\begin{pmatrix} 2 & 5 \\\\ -1 & 3 \\end{pmatrix}$ and $B = \\begin{pmatrix} 4 & -2 \\\\ 0 & 1 \\end{pmatrix}$, find $2A - B$.',
                        steps: [
                            'Calculate $2A$: $2\\begin{pmatrix} 2 & 5 \\\\ -1 & 3 \\end{pmatrix} = \\begin{pmatrix} 4 & 10 \\\\ -2 & 6 \\end{pmatrix}$.',
                            'Subtract $B$: $\\begin{pmatrix} 4 & 10 \\\\ -2 & 6 \\end{pmatrix} - \\begin{pmatrix} 4 & -2 \\\\ 0 & 1 \\end{pmatrix}$.',
                            'Top-left: $4 - 4 = 0$. Top-right: $10 - (-2) = 12$.',
                            'Bottom-left: $-2 - 0 = -2$. Bottom-right: $6 - 1 = 5$.'
                        ],
                        final_answer: '$\\begin{pmatrix} 0 & 12 \\\\ -2 & 5 \\end{pmatrix}$'
                    },
                    {
                        question: 'If $A = \\begin{pmatrix} 1 & 0 \\\\ -2 & 3 \\end{pmatrix}$ and $B = \\begin{pmatrix} 2 & 1 \\\\ 0 & 4 \\end{pmatrix}$, find $A + B$ and $3A$.',
                        steps: [
                            '$A + B = \\begin{pmatrix} 1+2 & 0+1 \\\\ -2+0 & 3+4 \\end{pmatrix} = \\begin{pmatrix} 3 & 1 \\\\ -2 & 7 \\end{pmatrix}$.',
                            '$3A = \\begin{pmatrix} 3(1) & 3(0) \\\\ 3(-2) & 3(3) \\end{pmatrix} = \\begin{pmatrix} 3 & 0 \\\\ -6 & 9 \\end{pmatrix}$.'
                        ],
                        final_answer: '$A+B = \\begin{pmatrix} 3 & 1 \\\\ -2 & 7 \\end{pmatrix}$, $3A = \\begin{pmatrix} 3 & 0 \\\\ -6 & 9 \\end{pmatrix}$'
                    }
                ]
            },
            {
                title: '3. Matrix Multiplication',
                content: `**When is $AB$ defined?** For $A$ of order $m \\times n$ and $B$ of order $n \\times p$: the **number of columns of $A$** must equal the **number of rows of $B$**. The product $AB$ then has order **$m \\times p$**.

**Row-by-column rule**: The $(i,j)$ entry of $AB$ = (row $i$ of $A$) $\\cdot$ (column $j$ of $B$) = sum of products of corresponding elements.

**Important**: Matrix multiplication is **not commutative** in general: $AB \\neq BA$. Also $AB = 0$ does not imply $A = 0$ or $B = 0$.

**Identity matrix** $I$: Square matrix with 1 on the main diagonal and 0 elsewhere. For $2 \\times 2$: $I = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$. For any compatible $A$, $AI = IA = A$.`,
                worked_examples: [
                    {
                        question: 'Calculate $\\begin{pmatrix} 2 & 3 \\\\ 1 & 4 \\end{pmatrix} \\begin{pmatrix} 5 \\\\ -2 \\end{pmatrix}$.',
                        steps: [
                            'Row 1 $\\times$ Column 1: $(2)(5) + (3)(-2) = 10 - 6 = 4$.',
                            'Row 2 $\\times$ Column 1: $(1)(5) + (4)(-2) = 5 - 8 = -3$.'
                        ],
                        final_answer: '$\\begin{pmatrix} 4 \\\\ -3 \\end{pmatrix}$'
                    },
                    {
                        question: 'Evaluate $AB$ where $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ and $B = \\begin{pmatrix} 2 & 0 \\\\ 1 & 5 \\end{pmatrix}$.',
                        steps: [
                            'Top-left: $(1)(2) + (2)(1) = 2 + 2 = 4$.',
                            'Top-right: $(1)(0) + (2)(5) = 0 + 10 = 10$.',
                            'Bottom-left: $(3)(2) + (4)(1) = 6 + 4 = 10$.',
                            'Bottom-right: $(3)(0) + (4)(5) = 0 + 20 = 20$.'
                        ],
                        final_answer: '$\\begin{pmatrix} 4 & 10 \\\\ 10 & 20 \\end{pmatrix}$'
                    },
                    {
                        question: 'Verify that $AB \\neq BA$ for $A = \\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}$ and $B = \\begin{pmatrix} 2 & 1 \\\\ 1 & 0 \\end{pmatrix}$.',
                        steps: [
                            '$AB = \\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix} \\begin{pmatrix} 2 & 1 \\\\ 1 & 0 \\end{pmatrix} = \\begin{pmatrix} 4 & 1 \\\\ 1 & 0 \\end{pmatrix}$.',
                            '$BA = \\begin{pmatrix} 2 & 1 \\\\ 1 & 0 \\end{pmatrix} \\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix} = \\begin{pmatrix} 2 & 5 \\\\ 1 & 2 \\end{pmatrix}$.',
                            'So $AB \\neq BA$.'
                        ],
                        final_answer: '$AB = \\begin{pmatrix} 4 & 1 \\\\ 1 & 0 \\end{pmatrix}$, $BA = \\begin{pmatrix} 2 & 5 \\\\ 1 & 2 \\end{pmatrix}$; they differ'
                    }
                ]
            },
            {
                title: '4. Determinant and Inverse of a $2 \\times 2$ Matrix',
                content: `For $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$:

**Determinant** (a scalar): $|A| = ad - bc$. Think: (top-left $\\times$ bottom-right) $-$ (top-right $\\times$ bottom-left).

**Singular matrix**: If $|A| = 0$, $A$ has **no inverse**. Non-singular (invertible) when $|A| \\neq 0$.

**Inverse** $A^{-1}$ (only when $|A| \\neq 0$):
$$ A^{-1} = \\frac{1}{ad-bc} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix} $$
So: swap $a$ and $d$, change the sign of $b$ and $c$, then divide every element by $|A|$.

**Check**: $A A^{-1} = A^{-1} A = I$.`,
                worked_examples: [
                    {
                        question: 'Find the inverse of $A = \\begin{pmatrix} 4 & 2 \\\\ 3 & 2 \\end{pmatrix}$.',
                        steps: [
                            'Calculate determinant: $|A| = (4)(2) - (2)(3) = 8 - 6 = 2$.',
                            'Swap $a$ and $d$: $\\begin{pmatrix} 2 & ... \\\\ ... & 4 \\end{pmatrix}$.',
                            'Change signs of $b$ and $c$: $\\begin{pmatrix} ... & -2 \\\\ -3 & ... \\end{pmatrix}$.',
                            'Multiply by $\\frac{1}{|A|}$: $\\frac{1}{2} \\begin{pmatrix} 2 & -2 \\\\ -3 & 4 \\end{pmatrix}$.',
                            'Simplify: $\\begin{pmatrix} 1 & -1 \\\\ -1.5 & 2 \\end{pmatrix}$.'
                        ],
                        final_answer: '$\\begin{pmatrix} 1 & -1 \\\\ -1.5 & 2 \\end{pmatrix}$'
                    },
                    {
                        question: 'Find the value of $k$ for which $\\begin{pmatrix} k & 4 \\\\ 3 & 2 \\end{pmatrix}$ is a singular matrix.',
                        steps: [
                            'Singular means determinant is zero.',
                            '$ad - bc = 0$.',
                            '$(k)(2) - (4)(3) = 0$.',
                            '$2k - 12 = 0 \\Rightarrow 2k = 12 \\Rightarrow k = 6$.'
                        ],
                        final_answer: '$k = 6$'
                    },
                    {
                        question: 'Show that $A = \\begin{pmatrix} 2 & 4 \\\\ 1 & 2 \\end{pmatrix}$ has no inverse.',
                        steps: [
                            '$|A| = (2)(2) - (4)(1) = 4 - 4 = 0$.',
                            'Since the determinant is zero, $A$ is singular and does not have an inverse.'
                        ],
                        final_answer: '$|A| = 0$, so $A$ has no inverse'
                    }
                ]
            },
            {
                title: '5. Solving Simultaneous Equations Using Matrices',
                content: `A pair of linear equations $ax + by = e$, $cx + dy = f$ can be written as a **matrix equation**:
$$ \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} e \\\\ f \\end{pmatrix} $$
i.e. $AX = B$, where $A$ is the coefficient matrix, $X = \\begin{pmatrix} x \\\\ y \\end{pmatrix}$ is the unknown column, and $B$ is the constants column.

**If $A$ is invertible** ($|A| \\neq 0$): multiply both sides (on the left) by $A^{-1}$:
$$ A^{-1}(AX) = A^{-1}B \\Rightarrow IX = A^{-1}B \\Rightarrow X = A^{-1}B $$
So find $A^{-1}$, then compute $A^{-1}B$; the first entry of the result is $x$, the second is $y$.

**Order matters**: It must be $X = A^{-1}B$, not $BA^{-1}$ (and $B$ is a column, so $A^{-1}B$ is defined).`,
                worked_examples: [
                    {
                        question: 'Solve using matrices: $3x + 2y = 11$, $4x - y = 7$.',
                        steps: [
                            'Write in matrix form: $A\\,X = B$ where $A = \\begin{pmatrix} 3 & 2 \\\\ 4 & -1 \\end{pmatrix}$, $X = \\begin{pmatrix} x \\\\ y \\end{pmatrix}$, $B = \\begin{pmatrix} 11 \\\\ 7 \\end{pmatrix}$.',
                            'Find determinant: $|A| = (3)(-1) - (2)(4) = -3 - 8 = -11 \\neq 0$, so $A^{-1}$ exists.',
                            'Compute inverse: $A^{-1} = \\frac{1}{|A|}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix} = \\frac{1}{-11}\\begin{pmatrix} -1 & -2 \\\\ -4 & 3 \\end{pmatrix} = \\frac{1}{11}\\begin{pmatrix} 1 & 2 \\\\ 4 & -3 \\end{pmatrix}$.',
                            'Now $X = A^{-1}B = \\frac{1}{11}\\begin{pmatrix} 1 & 2 \\\\ 4 & -3 \\end{pmatrix}\\begin{pmatrix} 11 \\\\ 7 \\end{pmatrix}$.',
                            'Multiply: $\\begin{pmatrix} 1(11) + 2(7) \\\\ 4(11) + (-3)(7) \\end{pmatrix} = \\begin{pmatrix} 25 \\\\ 23 \\end{pmatrix}$.',
                            'Therefore $X = \\frac{1}{11}\\begin{pmatrix} 25 \\\\ 23 \\end{pmatrix} = \\begin{pmatrix} \\frac{25}{11} \\\\ \\frac{23}{11} \\end{pmatrix}$.'
                        ],
                        final_answer: '$x = \\frac{25}{11}$, $y = \\frac{23}{11}$'
                    },
                    {
                        question: 'Use matrices to solve: $2x + y = 7$ and $x - y = 2$.',
                        steps: [
                            'Matrices: $A = \\begin{pmatrix} 2 & 1 \\\\ 1 & -1 \\end{pmatrix}$, $B = \\begin{pmatrix} 7 \\\\ 2 \\end{pmatrix}$.',
                            'Determinant $|A| = (2)(-1) - (1)(1) = -2 - 1 = -3$.',
                            'Inverse $A^{-1} = \\frac{1}{-3} \\begin{pmatrix} -1 & -1 \\\\ -1 & 2 \\end{pmatrix} = \\frac{1}{3} \\begin{pmatrix} 1 & 1 \\\\ 1 & -2 \\end{pmatrix}$.',
                            '$X = \\frac{1}{3} \\begin{pmatrix} 1 & 1 \\\\ 1 & -2 \\end{pmatrix} \\begin{pmatrix} 7 \\\\ 2 \\end{pmatrix}$.',
                            'Top: $1(7) + 1(2) = 9$. Bottom: $1(7) - 2(2) = 3$.',
                            '$X = \\frac{1}{3} \\begin{pmatrix} 9 \\\\ 3 \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ 1 \\end{pmatrix}$.',
                            'So $x = 3, y = 1$.'
                        ],
                        final_answer: '$x = 3, y = 1$'
                    }
                ]
            }
        ],
        key_points: [
            'Order $m \\times n$ = $m$ rows, $n$ columns. Addition/subtraction only for same order.',
            'Multiplication: $A_{m \\times n} B_{n \\times p} = (AB)_{m \\times p}$. Row of first $\\times$ column of second.',
            'Matrix multiplication is **not** commutative: $AB \\neq BA$ in general.',
            'Determinant $|A| = ad - bc$ for $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$. Singular if $|A| = 0$.',
            'Inverse: $A^{-1} = \\frac{1}{|A|}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$ when $|A| \\neq 0$.',
            'Simultaneous equations $AX = B$ $\\Rightarrow$ $X = A^{-1}B$ (when $A$ is invertible).'
        ],
        exam_tips: [
            'Always state the order of a matrix when asked. Check that $AB$ is defined (columns of $A$ = rows of $B$) before multiplying.',
            'For the inverse, write the matrix $\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$ first, then multiply by $1/|A|$ — don\'t forget the $1/|A|$.',
            'When solving $AX = B$, use $X = A^{-1}B$ (multiply $A^{-1}$ on the left of $B$).',
            'If the determinant is 0, state that the matrix is singular and has no inverse; the system may have no unique solution.',
            'Use the app\'s 1000+ practice questions on matrices.'
        ],
        visual_descriptions: [
            'Grid showing row $i$ and column $j$ and the $(i,j)$ entry in a matrix.',
            'Diagram: row of first matrix dotted with column of second to get one entry of the product.',
            'Flowchart: form $A$, $X$, $B$ $\\to$ find $|A|$ $\\to$ if $|A| \\neq 0$, find $A^{-1}$ $\\to$ $X = A^{-1}B$.'
        ]
    }
};

export const matricesTopics = Object.keys(matricesNotes);
