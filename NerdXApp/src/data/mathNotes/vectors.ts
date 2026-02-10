import { MathTopicNotes } from './types';

export const vectorsNotes: Record<string, MathTopicNotes> = {
    'Vectors': {
        topic: 'Vectors',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'Vectors represent quantities with both magnitude and direction. This chapter covers: scalars vs vectors and notation ($\\vec{AB}$, column form $\\begin{pmatrix} x \\\\ y \\end{pmatrix}$); adding and subtracting vectors (component-wise and triangle/parallelogram law); scalar multiplication; magnitude $|\\mathbf{a}| = \\sqrt{x^2 + y^2}$ and unit vectors; position vectors and $\\vec{AB} = \\mathbf{b} - \\mathbf{a}$; parallel and collinear vectors; midpoint and section formula; simple applications (distance between points, proving geometry). Vectors are used in mechanics and coordinate geometry.',
        sections: [
            {
                title: '1. Scalars and Vectors',
                content: `**Scalar**: A quantity with **magnitude only** (a number and unit). Examples: distance, speed, mass, time, temperature.

**Vector**: A quantity with **magnitude and direction**. Examples: displacement, velocity, force, acceleration. Two vectors are equal if they have the same magnitude and the same direction.

**Notation**: $\\vec{AB}$ = vector from $A$ to $B$ (tail at $A$, arrow at $B$). Bold or underlined: $\\mathbf{a}$, $\\underline{a}$. **Column vector** $\\begin{pmatrix} x \\\\ y \\end{pmatrix}$: in the plane, $x$ is the horizontal component (positive = right) and $y$ is the vertical component (positive = up). So $\\begin{pmatrix} 3 \\\\ 4 \\end{pmatrix}$ means 3 units right, 4 units up.

**Important**: $\\vec{AB} = -\\vec{BA}$ (same length, opposite direction).`,
                worked_examples: [
                    {
                        question: 'State whether each is a scalar or vector: (a) 50 km (b) 50 km North (c) 10 kg',
                        steps: [
                            '(a) 50 km is just distance → **Scalar**.',
                            '(b) 50 km North has direction → **Vector**.',
                            '(c) 10 kg is mass → **Scalar**.'
                        ],
                        final_answer: 'Scalar, Vector, Scalar'
                    },
                    {
                        question: 'Write the vector from $P(1, 4)$ to $Q(5, 2)$ in column form.',
                        steps: [
                            '$\\vec{PQ} = \\begin{pmatrix} 5-1 \\\\ 2-4 \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ -2 \\end{pmatrix}$.'
                        ],
                        final_answer: '$\\vec{PQ} = \\begin{pmatrix} 4 \\\\ -2 \\end{pmatrix}$'
                    }
                ]
            },
            {
                title: '2. Vector Addition, Subtraction and Scalar Multiplication',
                content: `**Addition**: Add **corresponding components**. $\\begin{pmatrix} x_1 \\\\ y_1 \\end{pmatrix} + \\begin{pmatrix} x_2 \\\\ y_2 \\end{pmatrix} = \\begin{pmatrix} x_1+x_2 \\\\ y_1+y_2 \\end{pmatrix}$. **Triangle law**: $\\vec{AB} + \\vec{BC} = \\vec{AC}$ (tail of second at head of first). **Parallelogram law**: For $\\vec{OA} + \\vec{OB}$, the sum is the diagonal of the parallelogram with sides $OA$ and $OB$.

**Subtraction**: $\\mathbf{a} - \\mathbf{b}$ = add $\\mathbf{a}$ and $-\\mathbf{b}$. Component-wise: subtract corresponding components. Geometrically: $\\vec{AB} - \\vec{AC} = \\vec{CB}$ (same as $\\vec{AB} + \\vec{CA}$).

**Scalar multiplication**: $k \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} kx \\\\ ky \\end{pmatrix}$. If $k > 0$, same direction, length scaled by $k$; if $k < 0$, opposite direction.`,
                worked_examples: [
                    {
                        question: 'If $\\mathbf{a} = \\begin{pmatrix} 3 \\\\ -2 \\end{pmatrix}$ and $\\mathbf{b} = \\begin{pmatrix} 1 \\\\ 5 \\end{pmatrix}$, find $2\\mathbf{a} - \\mathbf{b}$.',
                        steps: [
                            '$2\\mathbf{a} = \\begin{pmatrix} 2(3) \\\\ 2(-2) \\end{pmatrix} = \\begin{pmatrix} 6 \\\\ -4 \\end{pmatrix}$.',
                            '$2\\mathbf{a} - \\mathbf{b} = \\begin{pmatrix} 6 \\\\ -4 \\end{pmatrix} - \\begin{pmatrix} 1 \\\\ 5 \\end{pmatrix}$.',
                            '$= \\begin{pmatrix} 6 - 1 \\\\ -4 - 5 \\end{pmatrix} = \\begin{pmatrix} 5 \\\\ -9 \\end{pmatrix}$.'
                        ],
                        final_answer: '$\\begin{pmatrix} 5 \\\\ -9 \\end{pmatrix}$'
                    },
                    {
                        question: 'Given $\\vec{OA} = \\begin{pmatrix} 2 \\\\ 1 \\end{pmatrix}$ and $\\vec{OB} = \\begin{pmatrix} 5 \\\\ 4 \\end{pmatrix}$, find $\\vec{AB}$ and $\\vec{BA}$.',
                        steps: [
                            '$\\vec{AB} = \\vec{OB} - \\vec{OA} = \\begin{pmatrix} 5 \\\\ 4 \\end{pmatrix} - \\begin{pmatrix} 2 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ 3 \\end{pmatrix}$.',
                            '$\\vec{BA} = -\\vec{AB} = \\begin{pmatrix} -3 \\\\ -3 \\end{pmatrix}$.'
                        ],
                        final_answer: '$\\vec{AB} = \\begin{pmatrix} 3 \\\\ 3 \\end{pmatrix}$, $\\vec{BA} = \\begin{pmatrix} -3 \\\\ -3 \\end{pmatrix}$'
                    }
                ]
            },
            {
                title: '3. Magnitude and Unit Vectors',
                content: `**Magnitude** (length) of $\\mathbf{a} = \\begin{pmatrix} x \\\\ y \\end{pmatrix}$:
$$ |\\mathbf{a}| = \\sqrt{x^2 + y^2} $$
This follows from Pythagoras: the vector is the hypotenuse of a right-angled triangle with legs $|x|$ and $|y|$.

**Unit vector**: A vector of length 1. The unit vector in the direction of $\\mathbf{a}$ is $\\hat{\\mathbf{a}} = \\frac{\\mathbf{a}}{|\\mathbf{a}|}$ (divide the vector by its magnitude). So $\\left| \\frac{\\mathbf{a}}{|\\mathbf{a}|} \\right| = 1$.`,
                worked_examples: [
                    {
                        question: 'Find the magnitude of $\\mathbf{p} = \\begin{pmatrix} -5 \\\\ 12 \\end{pmatrix}$.',
                        steps: [
                            '$|\\mathbf{p}| = \\sqrt{(-5)^2 + 12^2}$.',
                            '$= \\sqrt{25 + 144} = \\sqrt{169}$.',
                            '$= 13$.'
                        ],
                        final_answer: '$13$'
                    },
                    {
                        question: 'Find the distance between $A(2, 3)$ and $B(5, 7)$.',
                        steps: [
                            'Vector $\\vec{AB} = \\begin{pmatrix} 5-2 \\\\ 7-3 \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ 4 \\end{pmatrix}$.',
                            'Magnitude $|\\vec{AB}| = \\sqrt{3^2 + 4^2} = \\sqrt{9+16} = \\sqrt{25} = 5$.'
                        ],
                        final_answer: '$5$ units'
                    },
                    {
                        question: 'Find a unit vector in the direction of $\\mathbf{v} = \\begin{pmatrix} 3 \\\\ 4 \\end{pmatrix}$.',
                        steps: [
                            '$|\\mathbf{v}| = \\sqrt{9 + 16} = 5$.',
                            'Unit vector = $\\frac{\\mathbf{v}}{|\\mathbf{v}|} = \\frac{1}{5}\\begin{pmatrix} 3 \\\\ 4 \\end{pmatrix} = \\begin{pmatrix} 3/5 \\\\ 4/5 \\end{pmatrix}$.'
                        ],
                        final_answer: '$\\begin{pmatrix} 3/5 \\\\ 4/5 \\end{pmatrix}$'
                    }
                ]
            },
            {
                title: '4. Position Vectors and Vector Geometry',
                content: `**Position vector**: The position vector of point $P$ is $\\vec{OP}$, the vector from the origin $O(0,0)$ to $P$. If $P$ has coordinates $(x, y)$, then $\\vec{OP} = \\begin{pmatrix} x \\\\ y \\end{pmatrix}$. We often denote $\\vec{OA} = \\mathbf{a}$, $\\vec{OB} = \\mathbf{b}$, etc.

**Vector from $A$ to $B$**: $\\vec{AB} = \\vec{OB} - \\vec{OA} = \\mathbf{b} - \\mathbf{a}$. (Go from $A$ to $O$, then $O$ to $B$: $\\vec{AO} + \\vec{OB} = -\\mathbf{a} + \\mathbf{b}$.)

**Midpoint**: If $M$ is the midpoint of $AB$, then $\\vec{OM} = \\frac{\\mathbf{a} + \\mathbf{b}}{2}$ (average of position vectors).

**Parallel vectors**: $\\mathbf{u}$ and $\\mathbf{v}$ are parallel if $\\mathbf{u} = k\\mathbf{v}$ for some scalar $k \\neq 0$. Same or opposite direction depending on sign of $k$.

**Collinear points**: $A$, $B$, $C$ are collinear if and only if $\\vec{AB}$ and $\\vec{BC}$ (or $\\vec{AC}$) are parallel and share a point — i.e. $\\vec{AB} = \\lambda \\vec{BC}$ for some $\\lambda$.`,
                worked_examples: [
                    {
                        question: 'If $\\vec{OA} = \\mathbf{a}$ and $\\vec{OB} = \\mathbf{b}$, express $\\vec{AB}$ in terms of $\\mathbf{a}$ and $\\mathbf{b}$.',
                        steps: [
                            'To go from A to B: Go $A \\to O$, then $O \\to B$.',
                            '$\\vec{AB} = \\vec{AO} + \\vec{OB} = -\\mathbf{a} + \\mathbf{b} = \\mathbf{b} - \\mathbf{a}$.'
                        ],
                        final_answer: '$\\mathbf{b} - \\mathbf{a}$'
                    },
                    {
                        question: 'Show that vectors $\\mathbf{u} = \\begin{pmatrix} 2 \\\\ 3 \\end{pmatrix}$ and $\\mathbf{v} = \\begin{pmatrix} 6 \\\\ 9 \\end{pmatrix}$ are parallel.',
                        steps: [
                            'Check if $\\mathbf{v}$ is a multiple of $\\mathbf{u}$.',
                            '$3\\mathbf{u} = 3\\begin{pmatrix} 2 \\\\ 3 \\end{pmatrix} = \\begin{pmatrix} 6 \\\\ 9 \\end{pmatrix} = \\mathbf{v}$.',
                            'Since $\\mathbf{v} = 3\\mathbf{u}$, they are parallel.'
                        ],
                        final_answer: 'Yes, $\\mathbf{v} = 3\\mathbf{u}$'
                    },
                    {
                        question: 'Points $A$, $B$, $C$ have position vectors $\\mathbf{a} = \\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix}$, $\\mathbf{b} = \\begin{pmatrix} 4 \\\\ 5 \\end{pmatrix}$, $\\mathbf{c} = \\begin{pmatrix} 10 \\\\ 11 \\end{pmatrix}$. Show that $A$, $B$, $C$ are collinear and find the ratio $AB : BC$.',
                        steps: [
                            '$\\vec{AB} = \\mathbf{b} - \\mathbf{a} = \\begin{pmatrix} 3 \\\\ 3 \\end{pmatrix}$. $\\vec{BC} = \\mathbf{c} - \\mathbf{b} = \\begin{pmatrix} 6 \\\\ 6 \\end{pmatrix}$.',
                            '$\\vec{BC} = 2\\vec{AB}$, so $\\vec{AB}$ and $\\vec{BC}$ are parallel and share $B$. Hence $A$, $B$, $C$ are collinear.',
                            'Ratio $AB : BC = |\\vec{AB}| : |\\vec{BC}| = 1 : 2$ (since $\\vec{BC} = 2\\vec{AB}$).'
                        ],
                        final_answer: 'Collinear; $AB : BC = 1 : 2$'
                    },
                    {
                        question: 'Find the position vector of the midpoint $M$ of the line joining $A(2, 3)$ and $B(6, 7)$.',
                        steps: [
                            '$\\vec{OA} = \\begin{pmatrix} 2 \\\\ 3 \\end{pmatrix}$, $\\vec{OB} = \\begin{pmatrix} 6 \\\\ 7 \\end{pmatrix}$.',
                            '$\\vec{OM} = \\frac{\\vec{OA} + \\vec{OB}}{2} = \\frac{1}{2}\\begin{pmatrix} 8 \\\\ 10 \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ 5 \\end{pmatrix}$.',
                            'So $M$ has coordinates $(4, 5)$.'
                        ],
                        final_answer: '$\\vec{OM} = \\begin{pmatrix} 4 \\\\ 5 \\end{pmatrix}$; $M(4, 5)$'
                    }
                ]
            }
        ],
        key_points: [
            'Scalar: magnitude only. Vector: magnitude and direction. $\\vec{AB} = -\\vec{BA}$.',
            '$\\vec{AB} = \\vec{OB} - \\vec{OA} = \\mathbf{b} - \\mathbf{a}$.',
            'Magnitude: $|\\begin{pmatrix} x \\\\ y \\end{pmatrix}| = \\sqrt{x^2 + y^2}$. Unit vector in direction of $\\mathbf{a}$: $\\frac{\\mathbf{a}}{|\\mathbf{a}|}$.',
            'Parallel: $\\mathbf{a} = k\\mathbf{b}$ for some $k \\neq 0$. Collinear: $\\vec{AB} = \\lambda \\vec{BC}$ (and share a point).',
            'Midpoint of $AB$: $\\vec{OM} = \\frac{\\mathbf{a} + \\mathbf{b}}{2}$.'
        ],
        exam_tips: [
            'Always note direction: $\\vec{AB} \\neq \\vec{BA}$. Draw a diagram for path questions ($A \\to B \\to C$).',
            'For $\\vec{AB}$, think "position of B minus position of A".',
            'To show collinearity: show one vector is a scalar multiple of another and they share a point.',
            'Unit vector must have magnitude 1: divide by $|\\mathbf{a}|$.',
            'Use the app\'s 1000+ practice questions on vectors.'
        ],
        visual_descriptions: [
            'Arrow from $A$ to $B$ labelled $\\vec{AB}$; arrow from $B$ to $A$ as $-\\vec{AB}$.',
            'Triangle law: $\\vec{AB} + \\vec{BC} = \\vec{AC}$ with three arrows forming a triangle.',
            'Parallelogram for $\\mathbf{a} + \\mathbf{b}$ with diagonal as the sum.',
            'Points $A$, $B$, $C$ on one line with $\\vec{AB}$ and $\\vec{BC}$ parallel.'
        ]
    }
};

export const vectorsTopics = Object.keys(vectorsNotes);
