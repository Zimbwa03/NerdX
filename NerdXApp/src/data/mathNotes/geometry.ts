import { MathTopicNotes } from './types';

export const geometryNotes: Record<string, MathTopicNotes> = {
    'Angles and Polygons': {
        topic: 'Angles and Polygons',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'This topic covers the properties of angles formed by lines and within polygons. Understanding these relationships is essential for geometric reasoning and proofs.',
        sections: [
            {
                title: 'Types of Angles',
                content: `**Acute Angle**: $0° < \\theta < 90°$

**Right Angle**: $\\theta = 90°$

**Obtuse Angle**: $90° < \\theta < 180°$

**Straight Angle**: $\\theta = 180°$

**Reflex Angle**: $180° < \\theta < 360°$`,
                worked_examples: [
                    {
                        question: 'Classify the following angles: $47°$, $90°$, $135°$, $200°$',
                        steps: [
                            '$47°$: Between $0°$ and $90°$ → **Acute**.',
                            '$90°$: Exactly $90°$ → **Right angle**.',
                            '$135°$: Between $90°$ and $180°$ → **Obtuse**.',
                            '$200°$: Between $180°$ and $360°$ → **Reflex**.'
                        ],
                        final_answer: 'Acute, Right, Obtuse, Reflex'
                    }
                ]
            },
            {
                title: 'Angle Relationships',
                content: `**Complementary Angles**: Sum to $90°$.

**Supplementary Angles**: Sum to $180°$ (angles on a straight line).

**Vertically Opposite Angles**: Equal. When two lines intersect, opposite angles are equal.

**Angles at a Point**: Sum to $360°$.`,
                worked_examples: [
                    {
                        question: 'Two angles are supplementary. One is $35°$ more than the other. Find them.',
                        steps: [
                            'Let the smaller angle be $x$. The larger is $x + 35$.',
                            'Supplementary: $x + (x + 35) = 180$.',
                            '$2x + 35 = 180 \\Rightarrow 2x = 145 \\Rightarrow x = 72.5°$.',
                            'Larger angle: $72.5 + 35 = 107.5°$.'
                        ],
                        final_answer: '$72.5°$ and $107.5°$'
                    },
                    {
                        question: 'Find the value of $x$ if angles $2x°$, $3x°$, $x°$, and $4x°$ are angles at a point.',
                        steps: [
                            'Angles at a point sum to $360°$.',
                            '$2x + 3x + x + 4x = 360$.',
                            '$10x = 360 \\Rightarrow x = 36°$.'
                        ],
                        final_answer: '$x = 36°$'
                    },
                    {
                        question: 'Two lines intersect. One angle formed is $65°$. Find all four angles.',
                        steps: [
                            'Vertically opposite angles are equal.',
                            'Angles on a straight line sum to $180°$.',
                            'Angles: $65°$, $180° - 65° = 115°$, $65°$, $115°$.'
                        ],
                        final_answer: '$65°$, $115°$, $65°$, $115°$'
                    }
                ]
            },
            {
                title: 'Parallel Lines and Transversals',
                content: `When a **transversal** crosses two parallel lines:

**Corresponding Angles** (F-shape): Equal.

**Alternate Angles** (Z-shape): Equal.

**Co-interior (Allied) Angles** (C-shape): Sum to $180°$.`,
                worked_examples: [
                    {
                        question: 'In the diagram, lines $AB$ and $CD$ are parallel. Angle $APQ = 65°$. Find angle $PQC$.',
                        steps: [
                            'Angles $APQ$ and $PQC$ are co-interior (same-side interior) angles.',
                            'Co-interior angles sum to $180°$.',
                            '$65° + \\text{angle } PQC = 180°$.',
                            'Angle $PQC = 180° - 65° = 115°$.'
                        ],
                        final_answer: '$115°$'
                    },
                    {
                        question: 'Lines $PQ$ and $RS$ are parallel. A transversal makes an angle of $72°$ with $PQ$. Find the corresponding angle with $RS$.',
                        steps: [
                            'Corresponding angles are equal when lines are parallel.',
                            'The corresponding angle = $72°$.'
                        ],
                        final_answer: '$72°$ (corresponding angles)'
                    },
                    {
                        question: 'Find $x$ if alternate angles are $(3x + 10)°$ and $(5x - 30)°$.',
                        steps: [
                            'Alternate angles are equal.',
                            '$3x + 10 = 5x - 30$.',
                            '$10 + 30 = 5x - 3x$.',
                            '$40 = 2x \\Rightarrow x = 20°$.'
                        ],
                        final_answer: '$x = 20°$'
                    }
                ]
            },
            {
                title: 'Polygon Angle Properties',
                content: `For a polygon with $n$ sides:

**Sum of Interior Angles**:
$$\\text{Sum} = (n - 2) \\times 180°$$

**Each Interior Angle (Regular Polygon)**:
$$\\text{Each angle} = \\frac{(n-2) \\times 180°}{n}$$

**Sum of Exterior Angles**: Always $360°$ (for any convex polygon).

**Each Exterior Angle (Regular Polygon)**:
$$\\text{Each angle} = \\frac{360°}{n}$$`,
                worked_examples: [
                    {
                        question: 'Find the sum of interior angles and each interior angle of a regular hexagon.',
                        steps: [
                            'A hexagon has $n = 6$ sides.',
                            'Sum of interior angles = $(6-2) \\times 180° = 4 \\times 180° = 720°$.',
                            'Each interior angle = $\\frac{720°}{6} = 120°$.'
                        ],
                        final_answer: 'Sum = $720°$, Each = $120°$'
                    },
                    {
                        question: 'Each exterior angle of a regular polygon is $24°$. How many sides does it have?',
                        steps: [
                            'For a regular polygon, each exterior angle = $\\frac{360°}{n}$.',
                            '$24 = \\frac{360}{n}$.',
                            '$n = \\frac{360}{24} = 15$.'
                        ],
                        final_answer: '$15$ sides'
                    },
                    {
                        question: 'The interior angles of a pentagon are $x°$, $2x°$, $90°$, $100°$, and $130°$. Find $x$.',
                        steps: [
                            'Sum of interior angles of pentagon = $(5-2) \\times 180° = 540°$.',
                            '$x + 2x + 90 + 100 + 130 = 540$.',
                            '$3x + 320 = 540$.',
                            '$3x = 220 \\Rightarrow x = 73.3°$ (to 1 d.p.)'
                        ],
                        final_answer: '$x = 73.3°$'
                    }
                ]
            }
        ],
        key_points: [
            'Angles on a straight line sum to $180°$.',
            'Vertically opposite angles are equal.',
            'Alternate angles are equal (Z-angles).',
            'Sum of interior angles = $(n-2) \\times 180°$.',
            'Sum of exterior angles = $360°$.'
        ],
        exam_tips: [
            'Draw parallel lines and mark equal/supplementary angles clearly.',
            'For polygon problems, first identify the number of sides.',
            'State the angle property you are using in each step.'
        ],
        visual_descriptions: [
            'Diagram of parallel lines cut by a transversal showing corresponding, alternate, and co-interior angles.',
            'Regular hexagon with interior and exterior angles marked.'
        ]
    },
    'Pythagoras Theorem': {
        topic: 'Pythagoras Theorem',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'The Pythagorean Theorem relates the sides of a right-angled triangle: $a^2 + b^2 = c^2$ where $c$ is the hypotenuse.',
        sections: [
            {
                title: 'The Theorem',
                content: `In a **right-angled triangle**, the square of the hypotenuse equals the sum of the squares of the other two sides.

$$c^2 = a^2 + b^2$$

Or equivalently:
$$c = \\sqrt{a^2 + b^2}$$
$$a = \\sqrt{c^2 - b^2}$$

**Pythagorean Triples**: Integer solutions. Examples:
$(3, 4, 5)$, $(5, 12, 13)$, $(8, 15, 17)$, $(7, 24, 25)$`,
                worked_examples: [
                    {
                        question: 'Find the hypotenuse of a right triangle with legs $6$ cm and $8$ cm.',
                        steps: [
                            'Apply Pythagoras: $c^2 = 6^2 + 8^2 = 36 + 64 = 100$.',
                            '$c = \\sqrt{100} = 10$ cm.'
                        ],
                        final_answer: '$10$ cm'
                    },
                    {
                        question: 'A ladder $13$ m long leans against a wall. The foot is $5$ m from the wall. How high up the wall does it reach?',
                        steps: [
                            'Let height = $h$. Hypotenuse = $13$, base = $5$.',
                            '$13^2 = 5^2 + h^2 \\Rightarrow 169 = 25 + h^2$.',
                            '$h^2 = 144 \\Rightarrow h = 12$ m.'
                        ],
                        final_answer: '$12$ m'
                    },
                    {
                        question: 'Find the diagonal of a rectangle with length $12$ cm and width $5$ cm.',
                        steps: [
                            'The diagonal forms the hypotenuse of a right triangle.',
                            '$d^2 = 12^2 + 5^2 = 144 + 25 = 169$.',
                            '$d = \\sqrt{169} = 13$ cm.'
                        ],
                        final_answer: '$13$ cm'
                    },
                    {
                        question: 'Two ships leave port. One sails 8 km north, the other 15 km east. How far apart are they?',
                        steps: [
                            'The paths form a right angle at the port.',
                            'Distance = $\\sqrt{8^2 + 15^2} = \\sqrt{64 + 225} = \\sqrt{289} = 17$ km.'
                        ],
                        final_answer: '$17$ km'
                    }
                ]
            },
            {
                title: 'Converse of Pythagoras',
                content: `**To check if a triangle is right-angled**:

If $a^2 + b^2 = c^2$ (where $c$ is largest), the triangle is right-angled.
If $a^2 + b^2 < c^2$, the triangle is obtuse.
If $a^2 + b^2 > c^2$, the triangle is acute.`,
                worked_examples: [
                    {
                        question: 'Is a triangle with sides $7$, $10$, and $12$ right-angled?',
                        steps: [
                            'Identify longest side: $c = 12$.',
                            'Check: $7^2 + 10^2 = 49 + 100 = 149$.',
                            '$12^2 = 144$.',
                            'Since $149 \\neq 144$, it is NOT right-angled (the triangle is acute since $149 > 144$).'
                        ],
                        final_answer: 'No, it is NOT a right-angled triangle.'
                    }
                ]
            },
            {
                title: '3D Applications',
                content: `**Diagonal of a Cuboid**:
$$d = \\sqrt{l^2 + w^2 + h^2}$$

**Space Diagonal**: Apply Pythagoras twice.`,
                worked_examples: [
                    {
                        question: 'Find the length of the space diagonal of a box with dimensions $3$ cm, $4$ cm, and $12$ cm.',
                        steps: [
                            'First, find the diagonal of the base: $d_1 = \\sqrt{3^2 + 4^2} = \\sqrt{9+16} = 5$ cm.',
                            'Now, find space diagonal: $d = \\sqrt{d_1^2 + 12^2} = \\sqrt{25 + 144} = \\sqrt{169} = 13$ cm.',
                            'Or directly: $d = \\sqrt{3^2 + 4^2 + 12^2} = \\sqrt{9+16+144} = \\sqrt{169} = 13$ cm.'
                        ],
                        final_answer: '$13$ cm'
                    }
                ]
            }
        ],
        key_points: [
            '$c^2 = a^2 + b^2$ where $c$ is the hypotenuse.',
            'The hypotenuse is opposite the right angle.',
            'Pythagorean triples: $(3,4,5)$, $(5,12,13)$, etc.',
            'For 3D, apply Pythagoras twice or use $d = \\sqrt{l^2 + w^2 + h^2}$.'
        ],
        exam_tips: [
            'Always identify the hypotenuse (longest side, opposite 90°).',
            'Draw and label the triangle.',
            'Leave answers in surd form if exact answer is required.'
        ],
        visual_descriptions: [
            'Right-angled triangle with sides labeled $a$, $b$, $c$ and right angle marked.',
            'Cuboid showing space diagonal.'
        ]
    },
    'Trigonometry': {
        topic: 'Trigonometry',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'Trigonometry deals with the relationships between angles and sides of triangles. The primary ratios are sine, cosine, and tangent.',
        sections: [
            {
                title: 'Trigonometric Ratios',
                content: `In a right-angled triangle with angle $\\theta$:

$$\\sin\\theta = \\frac{\\text{Opposite}}{\\text{Hypotenuse}} = \\frac{O}{H}$$

$$\\cos\\theta = \\frac{\\text{Adjacent}}{\\text{Hypotenuse}} = \\frac{A}{H}$$

$$\\tan\\theta = \\frac{\\text{Opposite}}{\\text{Adjacent}} = \\frac{O}{A}$$

**Memory Aid**: **SOH CAH TOA**`,
                worked_examples: [
                    {
                        question: 'In a right triangle, $\\theta = 30°$ and the hypotenuse is $10$ cm. Find the opposite side.',
                        steps: [
                            'Use $\\sin\\theta = \\frac{O}{H}$.',
                            '$\\sin 30° = \\frac{O}{10}$.',
                            '$O = 10 \\times \\sin 30° = 10 \\times 0.5 = 5$ cm.'
                        ],
                        final_answer: '$5$ cm'
                    },
                    {
                        question: 'Find the adjacent side if $\\theta = 60°$ and hypotenuse = $20$ cm.',
                        steps: [
                            'Use $\\cos\\theta = \\frac{A}{H}$.',
                            '$\\cos 60° = \\frac{A}{20}$.',
                            '$A = 20 \\times \\cos 60° = 20 \\times 0.5 = 10$ cm.'
                        ],
                        final_answer: '$10$ cm'
                    },
                    {
                        question: 'In a triangle, opposite = $8$ cm and hypotenuse = $17$ cm. Find $\\sin\\theta$.',
                        steps: [
                            '$\\sin\\theta = \\frac{O}{H} = \\frac{8}{17}$.'
                        ],
                        final_answer: '$\\sin\\theta = \\frac{8}{17}$'
                    }
                ]
            },
            {
                title: 'Finding Angles and Sides',
                content: `**Finding a Side**: Use the appropriate ratio based on given information.

**Finding an Angle**: Use inverse functions.
$$\\theta = \\sin^{-1}\\left(\\frac{O}{H}\\right), \\quad \\theta = \\cos^{-1}\\left(\\frac{A}{H}\\right), \\quad \\theta = \\tan^{-1}\\left(\\frac{O}{A}\\right)$$`,
                worked_examples: [
                    {
                        question: 'Find angle $\\theta$ if the opposite side is $7$ and adjacent side is $10$.',
                        steps: [
                            'Use $\\tan\\theta = \\frac{O}{A} = \\frac{7}{10} = 0.7$.',
                            '$\\theta = \\tan^{-1}(0.7)$.',
                            '$\\theta \\approx 34.99° \\approx 35°$.'
                        ],
                        final_answer: '$\\theta \\approx 35°$'
                    },
                    {
                        question: 'Find angle $A$ in a right triangle where hypotenuse = $13$ and opposite = $5$.',
                        steps: [
                            'Use $\\sin A = \\frac{5}{13}$.',
                            '$A = \\sin^{-1}(\\frac{5}{13}) = \\sin^{-1}(0.3846)$.',
                            '$A \\approx 22.6°$.'
                        ],
                        final_answer: '$A \\approx 22.6°$'
                    }
                ]
            },
            {
                title: 'Angles of Elevation and Depression',
                content: `**Angle of Elevation**: Angle measured upward from the horizontal.

**Angle of Depression**: Angle measured downward from the horizontal.

These angles are often equal (alternate angles with a horizontal line).`,
                worked_examples: [
                    {
                        question: 'From the top of a $50$ m tower, the angle of depression to a car is $32°$. How far is the car from the base of the tower?',
                        steps: [
                            'Angle of depression = Angle of elevation from the car = $32°$.',
                            'Opposite (height) = $50$ m, Find Adjacent (distance).',
                            '$\\tan 32° = \\frac{50}{d}$.',
                            '$d = \\frac{50}{\\tan 32°} = \\frac{50}{0.6249} \\approx 80$ m.'
                        ],
                        final_answer: '$\\approx 80$ m'
                    }
                ]
            },
            {
                title: 'Non-Right Triangles: Sine and Cosine Rules',
                content: `**Sine Rule** (for any triangle):
$$\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}$$

Use when you have: Angle-Angle-Side (AAS) or Angle-Side-Angle (ASA).

**Cosine Rule**:
$$c^2 = a^2 + b^2 - 2ab\\cos C$$
or
$$\\cos C = \\frac{a^2 + b^2 - c^2}{2ab}$$

Use when you have: Side-Angle-Side (SAS) or Side-Side-Side (SSS).

**Area of a Triangle**:
$$\\text{Area} = \\frac{1}{2}ab\\sin C$$`,
                worked_examples: [
                    {
                        question: 'In triangle $ABC$, $a = 8$, $b = 6$, $C = 60°$. Find side $c$.',
                        steps: [
                            'Use Cosine Rule: $c^2 = a^2 + b^2 - 2ab\\cos C$.',
                            '$c^2 = 8^2 + 6^2 - 2(8)(6)\\cos 60°$.',
                            '$c^2 = 64 + 36 - 96(0.5) = 100 - 48 = 52$.',
                            '$c = \\sqrt{52} = 2\\sqrt{13} \\approx 7.21$.'
                        ],
                        final_answer: '$c = 2\\sqrt{13} \\approx 7.21$'
                    },
                    {
                        question: 'Find the area of a triangle with sides $a = 5$, $b = 7$, and included angle $C = 45°$.',
                        steps: [
                            'Use Area = $\\frac{1}{2}ab\\sin C$.',
                            'Area = $\\frac{1}{2}(5)(7)\\sin 45°$.',
                            'Area = $\\frac{35}{2} \\times \\frac{\\sqrt{2}}{2} = \\frac{35\\sqrt{2}}{4} \\approx 12.37$.'
                        ],
                        final_answer: 'Area $\\approx 12.37$ square units'
                    }
                ]
            }
        ],
        key_points: [
            'SOH CAH TOA for right triangles.',
            'Sine Rule: $\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}$.',
            'Cosine Rule: $c^2 = a^2 + b^2 - 2ab\\cos C$.',
            'Area = $\\frac{1}{2}ab\\sin C$.'
        ],
        exam_tips: [
            'Always draw and label the triangle.',
            'Choose Sine Rule for AAS/ASA, Cosine Rule for SAS/SSS.',
            'Use exact values for common angles: $\\sin 30° = 0.5$, $\\cos 60° = 0.5$, etc.'
        ],
        visual_descriptions: [
            'Right triangle labeled with Opposite, Adjacent, Hypotenuse relative to angle $\\theta$.',
            'General triangle with sides $a$, $b$, $c$ opposite angles $A$, $B$, $C$.'
        ]
    },
    'Circle Theorems': {
        topic: 'Circle Theorems',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'Circle theorems describe the relationships between angles, chords, tangents, and other elements of a circle. These are essential for geometric proofs.',
        sections: [
            {
                title: 'Key Circle Theorems',
                content: `**1. Angle at Centre**: The angle at the centre is **twice** the angle at the circumference (same arc).
$$\\text{Angle at centre} = 2 \\times \\text{Angle at circumference}$$

**2. Angles in the Same Segment**: Angles subtended by the same arc at the circumference are **equal**.

**3. Angle in a Semicircle**: An angle inscribed in a semicircle is a **right angle** ($90°$).

**4. Cyclic Quadrilateral**: Opposite angles sum to $180°$.

**5. Tangent-Radius**: A tangent to a circle is **perpendicular** to the radius at the point of contact.

**6. Two Tangents from External Point**: Equal in length.

**7. Alternate Segment Theorem**: The angle between a tangent and a chord equals the angle in the alternate segment.`,
                worked_examples: [
                    {
                        question: 'The angle at the centre subtended by arc $AB$ is $140°$. Find the angle at the circumference subtended by the same arc.',
                        steps: [
                            'Apply Theorem 1: Angle at circumference = $\\frac{1}{2} \\times$ Angle at centre.',
                            'Angle at circumference = $\\frac{1}{2} \\times 140° = 70°$.'
                        ],
                        final_answer: '$70°$'
                    },
                    {
                        question: 'In a cyclic quadrilateral $ABCD$, $\\angle A = 75°$. Find $\\angle C$.',
                        steps: [
                            'Opposite angles of a cyclic quadrilateral sum to $180°$.',
                            '$\\angle A + \\angle C = 180°$.',
                            '$75° + \\angle C = 180° \\Rightarrow \\angle C = 105°$.'
                        ],
                        final_answer: '$105°$'
                    },
                    {
                        question: '$AB$ is a diameter of a circle. Point $C$ is on the circumference. Find $\\angle ACB$.',
                        steps: [
                            'Angle in a semicircle is always $90°$.',
                            '$\\angle ACB = 90°$.'
                        ],
                        final_answer: '$90°$'
                    },
                    {
                        question: 'Points $P$ and $Q$ on a circle subtend an angle of $35°$ at point $A$ on the circumference. Find the angle at the centre.',
                        steps: [
                            'Angle at centre = $2 \\times$ Angle at circumference.',
                            'Angle at centre = $2 \\times 35° = 70°$.'
                        ],
                        final_answer: '$70°$'
                    }
                ]
            },
            {
                title: 'Chords and Tangents',
                content: `**Perpendicular from Centre to a Chord**: Bisects the chord.

**Tangent from External Point**: Two tangents from the same external point are equal.

**Intersecting Chords Theorem**:
If two chords intersect inside a circle at point $P$:
$$AP \\times PB = CP \\times PD$$`,
                worked_examples: [
                    {
                        question: 'A chord is $6$ cm from the centre of a circle with radius $10$ cm. Find the length of the chord.',
                        steps: [
                            'Draw the perpendicular from the centre to the chord. It bisects the chord.',
                            'Let half the chord = $x$. By Pythagoras: $10^2 = 6^2 + x^2$.',
                            '$100 = 36 + x^2 \\Rightarrow x^2 = 64 \\Rightarrow x = 8$ cm.',
                            'Full chord = $2 \\times 8 = 16$ cm.'
                        ],
                        final_answer: '$16$ cm'
                    },
                    {
                        question: 'Two tangents are drawn from point $P$ to a circle. If the angle between the tangents is $50°$, find the angle subtended by the chord joining the points of tangency at the centre.',
                        steps: [
                            'Tangent-radius are perpendicular: two $90°$ angles.',
                            'Sum of angles in quadrilateral = $360°$.',
                            'Angle at centre = $360° - 90° - 90° - 50° = 130°$.'
                        ],
                        final_answer: '$130°$'
                    },
                    {
                        question: 'Two chords $AB$ and $CD$ intersect at $P$ inside a circle. If $AP = 6$, $PB = 4$, and $CP = 3$, find $PD$.',
                        steps: [
                            'Use intersecting chords theorem: $AP \\times PB = CP \\times PD$.',
                            '$6 \\times 4 = 3 \\times PD$.',
                            '$24 = 3 \\times PD \\Rightarrow PD = 8$.'
                        ],
                        final_answer: '$PD = 8$ units'
                    }
                ]
            }
        ],
        key_points: [
            'Angle at centre = $2 \\times$ Angle at circumference.',
            'Angle in a semicircle = $90°$.',
            'Opposite angles of a cyclic quadrilateral = $180°$.',
            'Tangent ⊥ Radius at point of contact.',
            'Tangents from external point are equal.'
        ],
        exam_tips: [
            'Always state the theorem you are using.',
            'Draw clear diagrams and mark equal angles/lengths.',
            'Look for isosceles triangles formed by radii.'
        ],
        visual_descriptions: [
            'Circle with angle at centre and angle at circumference marked.',
            'Cyclic quadrilateral with opposite angles labeled.'
        ]
    }
};

export const geometryTopics = Object.keys(geometryNotes);
