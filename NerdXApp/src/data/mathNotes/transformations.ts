import { MathTopicNotes } from './types';

export const transformationsNotes: Record<string, MathTopicNotes> = {
    'Transformations': {
        topic: 'Transformations',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: ' Geometric transformations change the position, orientation, or size of a shape. The four main types are translation, reflection, rotation, and enlargement.',
        sections: [
            {
                title: 'Translation',
                content: `**Translation**: Moving a shape without rotating or resizing.
Defined by a **column vector** $T = \\begin{pmatrix} x \\\\ y \\end{pmatrix}$.
- $x$: Movement right (positive) or left (negative).
- $y$: Movement up (positive) or down (negative).

**Mapping**:
$P(x, y) \\to P'(x+a, y+b)$ under translation $\\begin{pmatrix} a \\\\ b \\end{pmatrix}$.`,
                worked_examples: [
                    {
                        question: 'Translate point $A(2, 3)$ by vector $\\begin{pmatrix} 4 \\\\ -1 \\end{pmatrix}$.',
                        steps: [
                            'Add vector components to coordinates.',
                            '$x\' = 2 + 4 = 6$.',
                            '$y\' = 3 + (-1) = 2$.',
                            'New point $A\'(6, 2)$.'
                        ],
                        final_answer: '$A\'(6, 2)$'
                    }
                ]
            },
            {
                title: 'Reflection',
                content: `**Reflection**: Flipping a shape over a mirror line.
Defined by the **equation of the mirror line** (e.g., $x=0$, $y=x$).

**Properties**:
- Image is congruent to object.
- Perpendicular distance from object to line = distance from image to line.
- Orientation is reversed (laterally inverted).

**Common Reflections**:
- x-axis ($y=0$): $(x, y) \\to (x, -y)$
- y-axis ($x=0$): $(x, y) \\to (-x, y)$
- line $y=x$: $(x, y) \\to (y, x)$
- line $y=-x$: $(x, y) \\to (-y, -x)$`,
                worked_examples: [
                    {
                        question: 'Reflect the point $P(3, 1)$ in the line $y = x$.',
                        steps: [
                            'For reflection in $y=x$, swap $x$ and $y$ coordinates.',
                            '$(3, 1) \\to (1, 3)$.'
                        ],
                        final_answer: '$P\'(1, 3)$'
                    }
                ]
            },
            {
                title: 'Rotation',
                content: `**Rotation**: Turning a shape around a fixed point.
Defined by:
1. **Centre** of rotation (e.g., origin).
2. **Angle** of rotation (e.g., $90°$).
3. **Direction** (clockwise or anticlockwise).

**Common Rotations about Origin**:
- $90°$ clockwise: $(x, y) \\to (y, -x)$
- $90°$ anticlockwise: $(x, y) \\to (-y, x)$
- $180°$: $(x, y) \\to (-x, -y)$`,
                worked_examples: [
                    {
                        question: 'Rotate point $A(2, 5)$ $90°$ clockwise about the origin.',
                        steps: [
                            'Rule for $90°$ clockwise: $(x, y) \\to (y, -x)$.',
                            '$x=2, y=5$. Swap and change sign of second.',
                            '$(5, -2)$.'
                        ],
                        final_answer: '$A\'(5, -2)$'
                    }
                ]
            },
            {
                title: 'Enlargement',
                content: `**Enlargement**: Resizing a shape.
Defined by:
1. **Centre** of enlargement.
2. **Scale Factor** ($k$).

**Properties**:
- $k > 1$: Object gets larger.
- $0 < k < 1$: Object gets smaller.
- $k < 0$: Object is inverted (upside down) and on the opposite side of centre.

**Finding Image**:
Distance from Centre to Image = $k \\times$ Distance from Centre to Object.`,
                worked_examples: [
                    {
                        question: 'Enlarge triangle with vertices $A(1,1)$ by scale factor 2, centre $(0,0)$.',
                        steps: [
                            'Multiply coordinates by $k=2$.',
                            '$A(1,1) \\to A\'(2,2)$.'
                        ],
                        final_answer: '$A\'(2,2)$'
                    },
                    {
                        question: 'Enlarge point $P(4, 6)$ with scale factor $\\frac{1}{2}$ and centre $(0,0)$.',
                        steps: [
                            'Multiply by $0.5$.',
                            '$(4 \\times 0.5, 6 \\times 0.5) = (2, 3)$.'
                        ],
                        final_answer: '$P\'(2, 3)$'
                    }
                ]
            }
        ],
        key_points: [
            'Translation adds a vector.',
            'Reflection uses a mirror line; orientation flips.',
            'Rotation uses centre, angle, direction.',
            'Enlargement uses centre, scale factor; changes size.'
        ],
        exam_tips: [
            'Use tracing paper for rotations if allowed.',
            'For description questions, mention **all** defining features (e.g., "Rotation, 90 deg clockwise, centre (0,0)").',
            'Check coordinates carefully after applying rules.'
        ],
        visual_descriptions: [
            'Triangle translated by a vector.',
            'Shape reflected across y-axis.',
            'Figures showing $90°$ rotation.',
            'Enlargement showing projection lines from centre.'
        ]
    }
};

export const transformationsTopics = Object.keys(transformationsNotes);
