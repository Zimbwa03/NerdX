import { MathTopicNotes } from './types';

export const transformationsNotes: Record<string, MathTopicNotes> = {
    'Transformations': {
        topic: 'Transformations',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'Geometric transformations map shapes to images in the plane. The four types are: **translation** (slide by a vector); **reflection** (flip in a mirror line); **rotation** (turn about a centre through an angle); **enlargement** (scale from a centre by a scale factor, possibly negative). You need to apply transformations to points and shapes, find images, and **describe** a transformation fully (centre, angle/direction, mirror line, or scale factor). Combined transformations are done in order: first then second.',
        sections: [
            {
                title: '1. Translation',
                content: `**Translation** moves every point of a shape by the same amount — no rotation, no change in size. It is defined by a **column vector** $\\begin{pmatrix} a \\\\ b \\end{pmatrix}$: $a$ = horizontal movement (positive = right, negative = left); $b$ = vertical movement (positive = up, negative = down).

**Mapping**: $P(x, y) \\to P'(x+a, y+b)$ under translation $\\begin{pmatrix} a \\\\ b \\end{pmatrix}$.

The object and image are **congruent** and have the same orientation. To find the vector that maps shape $A$ onto shape $B$, subtract coordinates of a vertex: $\\overrightarrow{AA'} = (x'-x, y'-y)$.`,
                worked_examples: [
                    {
                        question: 'Translate point $A(2, 3)$ by vector $\\begin{pmatrix} 4 \\\\ -1 \\end{pmatrix}$.',
                        steps: [
                            'Add vector to coordinates: $x' = 2+4 = 6$, $y' = 3+(-1) = 2$.',
                            'Image: $A'(6, 2)$.'
                        ],
                        final_answer: "$A'(6, 2)$"
                    },
                    {
                        question: 'Triangle $ABC$ has vertices $A(1,2)$, $B(4,2)$, $C(2,5)$. Under translation by $\\begin{pmatrix} -3 \\\\ 2 \\end{pmatrix}$, find the image $A'B'C'$.',
                        steps: [
                            '$A'(1-3, 2+2) = (-2, 4)$.',
                            '$B'(4-3, 2+2) = (1, 4)$.',
                            '$C'(2-3, 5+2) = (-1, 7)$.'
                        ],
                        final_answer: "$A'(-2,4)$, $B'(1,4)$, $C'(-1,7)$"
                    },
                    {
                        question: 'A point $P(2,5)$ is mapped to $P'(7,1)$. Find the translation vector.',
                        steps: [
                            'Vector = $(7-2, 1-5) = (5, -4)$.',
                            'Column vector: $\\begin{pmatrix} 5 \\\\ -4 \\end{pmatrix}$.'
                        ],
                        final_answer: '$\\begin{pmatrix} 5 \\\\ -4 \\end{pmatrix}$'
                    }
                ]
            },
            {
                title: '2. Reflection',
                content: `**Reflection** flips a shape in a **mirror line**. The image is **congruent** to the object; perpendicular distances to the mirror line are preserved; orientation is **reversed** (laterally inverted).

Defined by the **equation of the mirror line**. Common rules (for reflection of point $(x,y)$):
- **x-axis** ($y=0$): $(x,y) \\to (x, -y)$
- **y-axis** ($x=0$): $(x,y) \\to (-x, y)$
- **line $y=x$**: $(x,y) \\to (y, x)$ (swap $x$ and $y$)
- **line $y=-x$**: $(x,y) \\to (-y, -x)$

For other mirror lines (e.g. $x=2$, $y=3$), use perpendicular distance or construction.`,
                worked_examples: [
                    {
                        question: 'Reflect $P(3, 1)$ in the line $y = x$.',
                        steps: [
                            'Swap coordinates: $(3,1) \\to (1,3)$.'
                        ],
                        final_answer: "$P'(1, 3)$"
                    },
                    {
                        question: 'Reflect the point $A(-2, 4)$ in the x-axis, then in the y-axis.',
                        steps: [
                            'Reflect in x-axis: $(-2,4) \\to (-2, -4)$.',
                            'Reflect that in y-axis: $(-2,-4) \\to (2, -4)$.'
                        ],
                        final_answer: '$(2, -4)$ (same as rotation $180°$ about origin)'
                    }
                ]
            },
            {
                title: '3. Rotation',
                content: `**Rotation** turns a shape about a fixed point (the **centre of rotation**) through an **angle** in a given **direction** (clockwise or anticlockwise). The image is congruent to the object.

To describe a rotation you must state: (1) **centre**, (2) **angle**, (3) **direction** (clockwise or anticlockwise).

**Rotations about the origin** $(0,0)$:
- $90°$ clockwise: $(x,y) \\to (y, -x)$
- $90°$ anticlockwise: $(x,y) \\to (-y, x)$
- $180°$ (either direction): $(x,y) \\to (-x, -y)$

For a centre other than the origin, subtract the centre, rotate, then add the centre back. Or use tracing paper.`,
                worked_examples: [
                    {
                        question: 'Rotate $A(2, 5)$ $90°$ clockwise about the origin.',
                        steps: [
                            'Rule: $(x,y) \\to (y, -x)$. So $(2,5) \\to (5, -2)$.'
                        ],
                        final_answer: "$A'(5, -2)$"
                    },
                    {
                        question: 'Rotate $B(-1, 3)$ $180°$ about the origin.',
                        steps: [
                            '$180°$: $(x,y) \\to (-x,-y)$. So $(-1,3) \\to (1, -3)$.'
                        ],
                        final_answer: "$B'(1, -3)$"
                    },
                    {
                        question: 'Describe the transformation that maps $P(4,2)$ to $P'(2,-4)$.',
                        steps: [
                            'Check: $90°$ anticlockwise about origin gives $(-y,x) = (-2,4)$ — not that.',
                            '$90°$ clockwise gives $(y,-x) = (2,-4)$. So **rotation $90°$ clockwise, centre $(0,0)$**.'
                        ],
                        final_answer: 'Rotation $90°$ clockwise, centre $(0,0)$'
                    }
                ]
            },
            {
                title: '4. Enlargement',
                content: `**Enlargement** changes the size of a shape from a **centre of enlargement** by a **scale factor** $k$. Same shape (similar); angles unchanged; lengths multiplied by $|k|$.

**Scale factor**: Distance from centre to image = $k \\times$ distance from centre to object.
- $k > 1$: enlargement (bigger).
- $0 < k < 1$: reduction (smaller).
- $k < 0$: **negative enlargement** — image is on the **opposite side** of the centre, inverted (upside down); distance from centre to image = $|k| \\times$ distance to object.

**Centre at origin**: $P(x,y) \\to P'(kx, ky)$. For centre $(a,b)$, translate so centre is at origin, multiply by $k$, then translate back: $P'(a + k(x-a), b + k(y-b))$.`,
                worked_examples: [
                    {
                        question: 'Enlarge triangle with vertex $A(1,1)$ by scale factor $2$, centre $(0,0)$.',
                        steps: [
                            'Multiply coordinates by $2$: $A'(2,2)$. (Do same for all vertices.)'
                        ],
                        final_answer: "e.g. $A'(2,2)$"
                    },
                    {
                        question: 'Enlarge $P(4, 6)$ with scale factor $\\frac{1}{2}$, centre $(0,0)$.',
                        steps: [
                            '$P'(4 \\times \\frac{1}{2}, 6 \\times \\frac{1}{2}) = (2, 3)$.'
                        ],
                        final_answer: "$P'(2, 3)$"
                    },
                    {
                        question: 'Enlarge $A(2,4)$ with scale factor $-2$, centre $(0,0)$.',
                        steps: [
                            'Negative: image on opposite side of centre. $A'(2\\times(-2), 4\\times(-2)) = (-4, -8)$.'
                        ],
                        final_answer: "$A'(-4, -8)$"
                    }
                ]
            },
            {
                title: '5. Describing and Combining Transformations',
                content: `**Describing a transformation**: Give **all** defining details. Translation: column vector. Reflection: equation of mirror line. Rotation: centre, angle, direction. Enlargement: centre, scale factor.

**Combined transformations**: Apply in order (e.g. "reflect in x-axis then translate by $\\begin{pmatrix} 2 \\\\ 0 \\end{pmatrix}$" means do reflection first, then translation). Order usually matters: reflection then rotation $\\neq$ rotation then reflection.

**Invariant points**: Points that do not move. Reflection: points on the mirror line. Rotation: only the centre (unless $360°$). Enlargement: only the centre (unless $k=1$).`,
                worked_examples: [
                    {
                        question: 'Triangle $T$ is reflected in the y-axis to give $T'$, then $T'$ is translated by $\\begin{pmatrix} -4 \\\\ 0 \\end{pmatrix}$ to give $T''$. Point $A(3,2)$ is on $T$. Find the coordinates of its image $A''$.',
                        steps: [
                            'Reflect in y-axis: $A(3,2) \\to A'(-3, 2)$.',
                            'Translate by $\\begin{pmatrix} -4 \\\\ 0 \\end{pmatrix}$: $A'(-3,2) \\to A''(-3-4, 2) = (-7, 2)$.'
                        ],
                        final_answer: "$A''(-7, 2)$"
                    }
                ]
            }
        ],
        key_points: [
            'Translation: $\\begin{pmatrix} a \\\\ b \\end{pmatrix}$ maps $(x,y) \\to (x+a, y+b)$.',
            'Reflection: state mirror line; x-axis $\\to (x,-y)$, y-axis $\\to (-x,y)$, $y=x$ $\\to (y,x)$.',
            'Rotation: state centre, angle, direction; $180°$ about origin $\\to (-x,-y)$.',
            'Enlargement: centre and scale factor $k$; centre origin $\\to (kx,ky)$; $k<0$ gives opposite side.'
        ],
        exam_tips: [
            'Use tracing paper for rotations and reflections if allowed.',
            'When **describing** a transformation, give every detail (e.g. "Rotation, $90°$ clockwise, centre $(0,0)$").',
            'For combined transformations, apply in the order stated.',
            'Check coordinates after applying rules; negative scale factor moves image to the other side of the centre.',
            'Use the app\'s 1000+ practice questions on transformations.'
        ],
        visual_descriptions: [
            'Triangle and its image under a translation vector.',
            'Shape and image reflected in the y-axis.',
            'Shape rotated $90°$ about the origin with centre marked.',
            'Enlargement with rays from centre through vertices; negative enlargement on opposite side of centre.'
        ]
    }
};

export const transformationsTopics = Object.keys(transformationsNotes);
