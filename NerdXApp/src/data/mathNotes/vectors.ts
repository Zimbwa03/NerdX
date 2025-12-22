import { MathTopicNotes } from './types';

export const vectorsNotes: Record<string, MathTopicNotes> = {
    'Vectors': {
        topic: 'Vectors',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'Vectors are quantities with both magnitude and direction. They are fundamental in physics and geometry for describing displacement and force.',
        sections: [
            {
                title: 'Scalars and Vectors',
                content: `**Scalar**: Quantity with magnitude (size) only.
- Examples: Distance, Speed, Mass, Time.

**Vector**: Quantity with both magnitude and direction.
- Examples: Displacement, Velocity, Force, Acceleration.

**Notation**:
- $\\vec{AB}$ or $\\mathbf{a}$ or $\\underline{a}$.
- Column vector: $\\begin{pmatrix} x \\\\ y \\end{pmatrix}$ means $x$ units right, $y$ units up.`,
                worked_examples: [
                    {
                        question: 'State whether each is a scalar or vector: (a) 50 km (b) 50 km North (c) 10 kg',
                        steps: [
                            '(a) 50 km is just distance → **Scalar**.',
                            '(b) 50 km North has direction → **Vector**.',
                            '(c) 10 kg is mass → **Scalar**.'
                        ],
                        final_answer: 'Scalar, Vector, Scalar'
                    }
                ]
            },
            {
                title: 'Vector Operations',
                content: `**Addition**: Add corresponding components. $\\begin{pmatrix} x_1 \\\\ y_1 \\end{pmatrix} + \\begin{pmatrix} x_2 \\\\ y_2 \\end{pmatrix} = \\begin{pmatrix} x_1+x_2 \\\\ y_1+y_2 \\end{pmatrix}$.
Geometrically: Triangle Law or Parallelogram Law.

**Subtraction**: Subtract components. $\\vec{AB} - \\vec{CD} = \\vec{AB} + (-\\vec{CD})$.

**Scalar Multiplication**: Multiply each component by scalar $k$.
$k \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} kx \\\\ ky \\end{pmatrix}$.`,
                worked_examples: [
                    {
                        question: 'If $\\mathbf{a} = \\begin{pmatrix} 3 \\\\ -2 \\end{pmatrix}$ and $\\mathbf{b} = \\begin{pmatrix} 1 \\\\ 5 \\end{pmatrix}$, find $2\\mathbf{a} - \\mathbf{b}$.',
                        steps: [
                            '$2\\mathbf{a} = \\begin{pmatrix} 2(3) \\\\ 2(-2) \\end{pmatrix} = \\begin{pmatrix} 6 \\\\ -4 \\end{pmatrix}$.',
                            '$2\\mathbf{a} - \\mathbf{b} = \\begin{pmatrix} 6 \\\\ -4 \\end{pmatrix} - \\begin{pmatrix} 1 \\\\ 5 \\end{pmatrix}$.',
                            '$= \\begin{pmatrix} 6 - 1 \\\\ -4 - 5 \\end{pmatrix} = \\begin{pmatrix} 5 \\\\ -9 \\end{pmatrix}$.'
                        ],
                        final_answer: '$\\begin{pmatrix} 5 \\\\ -9 \\end{pmatrix}$'
                    }
                ]
            },
            {
                title: 'Magnitude of a Vector',
                content: `The **magnitude** (or modulus) is the length of the vector.
For $\\mathbf{a} = \\begin{pmatrix} x \\\\ y \\end{pmatrix}$:
$$ |\\mathbf{a}| = \\sqrt{x^2 + y^2} $$`,
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
                    }
                ]
            },
            {
                title: 'Vector Geometry',
                content: `**Position Vector**: Vector from origin $O(0,0)$ to point $P(x,y)$. $\\vec{OP} = \\begin{pmatrix} x \\\\ y \\end{pmatrix}$.

**Vector between two points**:
$\\vec{AB} = \\vec{OB} - \\vec{OA} = \\mathbf{b} - \\mathbf{a}$.

**Parallel Vectors**:
Two vectors are parallel if one is a scalar multiple of the other. $\\mathbf{a} = k\\mathbf{b}$.

**Collinear Points**:
Points $A, B, C$ are collinear if $\\vec{AB}$ is parallel to $\\vec{BC}$ and they share a common point $B$.`,
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
                    }
                ]
            }
        ],
        key_points: [
            '$\\vec{AB} = \\mathbf{b} - \\mathbf{a}$.',
            '$|\\begin{pmatrix} x \\\\ y \\end{pmatrix}| = \\sqrt{x^2 + y^2}$.',
            'Parallel vectors are scalar multiples: $\\mathbf{a} = k\\mathbf{b}$.',
            'Collinear points lie on the same straight line.'
        ],
        exam_tips: [
            'Direction matters: $\\vec{AB} = -\\vec{BA}$.',
            'Use diagrams to trace paths (e.g., $A \\to B \\to C$).',
            'When proving collinearity, show vectors are parallel AND share a point.'
        ],
        visual_descriptions: [
            'Vector arrow showing direction from A to B.',
            'Triangle law of addition diagram.'
        ]
    }
};

export const vectorsTopics = Object.keys(vectorsNotes);
