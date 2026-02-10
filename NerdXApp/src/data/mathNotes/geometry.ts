import { MathTopicNotes } from './types';

export const geometryNotes: Record<string, MathTopicNotes> = {
    'Angles and Polygons': {
        topic: 'Angles and Polygons',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'Angles and polygons form the foundation of plane geometry. This chapter covers: types of angles (acute, right, obtuse, straight, reflex); angle relationships — complementary and supplementary angles, vertically opposite angles (equal), angles at a point (sum $360°$); parallel lines and transversals — corresponding, alternate, and co-interior angles; interior and exterior angles of polygons — sum of interior angles $(n-2)\\times 180°$, sum of exterior angles $360°$, and formulae for regular polygons. These facts are used in proofs and in solving for unknown angles.',
        sections: [
            {
                title: '1. Types of Angles',
                content: `Angles are measured in **degrees** ($°$) from $0°$ to $360°$ (or from a reference direction). **Right angle** = $90°$ (quarter turn).

**Acute**: $0° < \\theta < 90°$ (less than a right angle).
**Right**: $\\theta = 90°$.
**Obtuse**: $90° < \\theta < 180°$ (between right and straight).
**Straight**: $\\theta = 180°$ (half turn; a straight line).
**Reflex**: $180° < \\theta < 360°$ (more than a straight angle).

Two angles that add to $90°$ are **complementary**; two that add to $180°$ are **supplementary** (e.g. angles on a straight line).`,
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
                title: '2. Angle Relationships',
                content: `**Complementary angles**: Two angles that add to $90°$. If one is $\\theta$, the other is $90° - \\theta$.

**Supplementary angles**: Two angles that add to $180°$. **Angles on a straight line** are supplementary. If one is $\\theta$, the other is $180° - \\theta$.

**Vertically opposite angles**: When two straight lines intersect, the two pairs of opposite angles are **equal**. (Each is the supplement of the adjacent angle.)

**Angles at a point**: The sum of all angles around a point is **$360°$**.`,
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
                title: '3. Parallel Lines and Transversals',
                content: `A **transversal** is a line that crosses two or more other lines. When it crosses **two parallel lines**, special angle pairs are formed:

**Corresponding angles** (in the same relative position at each intersection): **equal**. They form an "F" shape.

**Alternate angles** (on opposite sides of the transversal, between the parallel lines): **equal**. They form a "Z" shape. (Alternate interior.)

**Co-interior (allied) angles** (on the same side of the transversal, between the parallel lines): **sum to $180°$**. They form a "C" shape.

If corresponding or alternate angles are equal (or co-interior sum to $180°$), the lines are **parallel**.`,
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
                title: '4. Polygon Angle Properties',
                content: `A **polygon** is a closed shape with straight sides. For a polygon with **$n$ sides**:

**Sum of interior angles** = $(n-2) \\times 180°$. (Divide the polygon into $(n-2)$ triangles by drawing diagonals from one vertex.)

**Regular polygon**: All sides and all angles equal. **Each interior angle** = $\\frac{(n-2) \\times 180°}{n}$.

**Exterior angle** at a vertex = angle between one side and the extension of the adjacent side. **Sum of exterior angles** (one at each vertex, taken in the same sense) = **$360°$** for any convex polygon.

**Each exterior angle** of a regular polygon = $\\frac{360°}{n}$. So interior + exterior (at same vertex) = $180°$.`,
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
            'Draw diagrams and mark equal or supplementary angles with the same symbols.',
            'For polygon problems, write $n$ (number of sides) and use the correct formula.',
            'State the theorem or property (e.g. "alternate angles", "angles on a straight line") in your working.',
            'Use the app\'s 1000+ practice questions on angles and polygons.'
        ],
        visual_descriptions: [
            'Diagram of parallel lines cut by a transversal with corresponding, alternate, and co-interior angles labelled.',
            'Regular hexagon with one interior and one exterior angle marked.'
        ]
    },
    'Pythagoras Theorem': {
        topic: 'Pythagoras Theorem',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'In a right-angled triangle, the square of the hypotenuse equals the sum of the squares of the other two sides: $a^2 + b^2 = c^2$ (where $c$ is the hypotenuse). This chapter covers: the theorem and its use to find a missing side; the converse (to test if a triangle is right-angled, obtuse, or acute); Pythagorean triples; applications (diagonals, distances, 3D cuboids); and solving word problems by identifying the right angle and labelling sides.',
        sections: [
            {
                title: '1. The Theorem',
                content: `In a **right-angled triangle**, the side opposite the right angle is the **hypotenuse** (longest side). **Pythagoras' Theorem** states:

$$c^2 = a^2 + b^2 \\quad \\text{(where } c \\text{ is the hypotenuse)}$$

Rearranged: $c = \\sqrt{a^2 + b^2}$, or $a = \\sqrt{c^2 - b^2}$, $b = \\sqrt{c^2 - a^2}$.

**Pythagorean triples**: Positive integers $(a, b, c)$ with $a^2 + b^2 = c^2$. Common triples: $(3, 4, 5)$, $(5, 12, 13)$, $(8, 15, 17)$, $(7, 24, 25)$. Multiples of these (e.g. $6, 8, 10$) also work.`,
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
                title: '2. Converse of Pythagoras',
                content: `**Converse**: If the sides of a triangle satisfy $a^2 + b^2 = c^2$ (with $c$ the longest side), then the triangle is **right-angled** (right angle opposite $c$).

**Obtuse**: If $a^2 + b^2 < c^2$, the angle opposite $c$ is **greater than $90°$**.
**Acute**: If $a^2 + b^2 > c^2$, all angles are **less than $90°$**.

Always use the **longest** side as $c$ when testing.`,
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
                title: '3. 3D Applications',
                content: `In a **cuboid** with dimensions $l$, $w$, $h$, the **space diagonal** (from one vertex to the opposite vertex through the inside) has length:

$$d = \\sqrt{l^2 + w^2 + h^2}$$

This follows by applying Pythagoras twice: first to a face diagonal (e.g. $\\sqrt{l^2 + w^2}$), then to the right triangle formed by that diagonal and the height $h$.`,
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
            'Pythagoras: $c^2 = a^2 + b^2$ with $c$ the hypotenuse.',
            'Hypotenuse = side opposite the right angle (longest side).',
            'Pythagorean triples: $(3,4,5)$, $(5,12,13)$; multiples work too.',
            'Converse: $a^2+b^2=c^2$ ⇒ right-angled; $< c^2$ ⇒ obtuse; $> c^2$ ⇒ acute.',
            'Cuboid space diagonal: $d = \\sqrt{l^2 + w^2 + h^2}$.'
        ],
        exam_tips: [
            'Label the triangle and identify the hypotenuse before substituting.',
            'Draw a sketch for word problems (ladder, distance, diagonal).',
            'Give exact answers in surd form when asked (e.g. $\\sqrt{52}$).',
            'Use the app\'s 1000+ practice questions on Pythagoras.'
        ],
        visual_descriptions: [
            'Right-angled triangle with sides $a$, $b$, $c$ and right angle marked.',
            'Cuboid with space diagonal from one vertex to the opposite vertex.'
        ]
    },
    'Trigonometry': {
        topic: 'Trigonometry',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'Trigonometry links angles of right-angled triangles to ratios of sides. The three main ratios are sine, cosine, and tangent (SOH CAH TOA). This chapter covers: finding sides and angles in right-angled triangles; angles of elevation and depression; the Sine Rule and Cosine Rule for non-right triangles; area of a triangle as $\\frac{1}{2}ab\\sin C$; and when to use each rule (AAS/ASA vs SAS/SSS).',
        sections: [
            {
                title: '1. Trigonometric Ratios (SOH CAH TOA)',
                content: `In a **right-angled triangle**, for angle $\\theta$ (not the right angle): **Opposite** = side opposite $\\theta$; **Adjacent** = side next to $\\theta$; **Hypotenuse** = side opposite the right angle.

$$\\sin\\theta = \\frac{\\text{Opposite}}{\\text{Hypotenuse}} \\quad \\cos\\theta = \\frac{\\text{Adjacent}}{\\text{Hypotenuse}} \\quad \\tan\\theta = \\frac{\\text{Opposite}}{\\text{Adjacent}}$$

**SOH CAH TOA** helps remember which ratio uses which sides. **Exact values**: $\\sin 30° = \\cos 60° = \\frac{1}{2}$; $\\cos 30° = \\sin 60° = \\frac{\\sqrt{3}}{2}$; $\\tan 45° = 1$.`,
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
                title: '2. Finding Angles and Sides',
                content: `**Finding a side**: Choose the ratio that involves the unknown side and one known side (e.g. if you have hypotenuse and want opposite, use $\\sin$).

**Finding an angle**: Use the **inverse** trig functions (on calculator: $\\sin^{-1}$, $\\cos^{-1}$, $\\tan^{-1}$):
$$\\theta = \\sin^{-1}\\left(\\frac{O}{H}\\right), \\quad \\theta = \\cos^{-1}\\left(\\frac{A}{H}\\right), \\quad \\theta = \\tan^{-1}\\left(\\frac{O}{A}\\right)$$

Ensure your calculator is in **degree** mode for angles in degrees.`,
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
                title: '3. Angles of Elevation and Depression',
                content: `**Angle of elevation**: The angle from the horizontal **up** to a line of sight (e.g. from ground to top of a tower).

**Angle of depression**: The angle from the horizontal **down** to a line of sight (e.g. from top of tower to ground).

For a horizontal line through the observer, the angle of depression from the observer to a point equals the **angle of elevation** from that point to the observer (alternate angles). So we often use the same angle in a right-angled triangle.`,
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
                title: '4. Non-Right Triangles: Sine and Cosine Rules',
                content: `For any triangle with sides $a$, $b$, $c$ opposite angles $A$, $B$, $C$:

**Sine Rule**: $\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}$. Use when you know **two angles and a side** (AAS/ASA) or **two sides and a non-included angle** (ambiguous case: may give one or two triangles).

**Cosine Rule**: $c^2 = a^2 + b^2 - 2ab\\cos C$, or $\\cos C = \\frac{a^2 + b^2 - c^2}{2ab}$. Use when you know **two sides and the included angle** (SAS) or **three sides** (SSS) to find an angle.

**Area**: $\\text{Area} = \\frac{1}{2}ab\\sin C$ (two sides and included angle).`,
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
            'SOH CAH TOA: $\\sin=\\frac{O}{H}$, $\\cos=\\frac{A}{H}$, $\\tan=\\frac{O}{A}$.',
            'Sine Rule: $\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}$.',
            'Cosine Rule: $c^2 = a^2 + b^2 - 2ab\\cos C$; $\\cos C = \\frac{a^2+b^2-c^2}{2ab}$.',
            'Area of triangle: $\\frac{1}{2}ab\\sin C$.'
        ],
        exam_tips: [
            'Draw the triangle and label sides and angles consistently.',
            'Use Sine Rule for AAS/ASA (and sometimes SSA); Cosine Rule for SAS/SSS.',
            'Check calculator is in degree mode; use exact values ($\\sin 30°$, etc.) when possible.',
            'Use the app\'s 1000+ practice questions on trigonometry.'
        ],
        visual_descriptions: [
            'Right triangle with Opposite, Adjacent, Hypotenuse marked for angle $\\theta$.',
            'General triangle with sides $a$, $b$, $c$ opposite angles $A$, $B$, $C$.'
        ]
    },
    'Circle Theorems': {
        topic: 'Circle Theorems',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'Circle theorems link angles and lengths in circles. Key results: angle at centre = 2 × angle at circumference (same arc); angles in the same segment are equal; angle in a semicircle = 90°; opposite angles of a cyclic quadrilateral sum to 180°; tangent perpendicular to radius; tangents from an external point are equal; alternate segment theorem. Chords: perpendicular from centre bisects a chord; intersecting chords satisfy $AP\\times PB = CP\\times PD$. These are used for proofs and finding unknown angles and lengths.',
        sections: [
            {
                title: '1. Key Circle Theorems',
                content: `**Angle at centre**: The angle subtended by an arc at the **centre** is **twice** the angle subtended at the **circumference** (by the same arc). So angle at centre = $2 \\times$ angle at circumference.

**Angles in the same segment**: Angles subtended by the **same arc** at the circumference are **equal**.

**Angle in a semicircle**: If $AB$ is a **diameter**, then any angle $\\angle ACB$ at the circumference is a **right angle** ($90°$).

**Cyclic quadrilateral**: A quadrilateral whose vertices lie on a circle. **Opposite angles sum to $180°$**.

**Tangent and radius**: The **tangent** at a point is **perpendicular** to the **radius** at that point.

**Two tangents from an external point**: The two tangents from a point outside the circle are **equal in length**.

**Alternate segment theorem**: The angle between a **tangent** and a **chord** (at the point of contact) equals the angle in the **alternate** (opposite) segment.`,
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
                title: '2. Chords and Tangents',
                content: `**Perpendicular from centre to a chord**: The line from the centre of a circle **perpendicular** to a chord **bisects** the chord (and conversely, the perpendicular bisector of a chord passes through the centre). Use this with Pythagoras to find chord length or radius.

**Tangents from an external point**: The two tangent segments from a point outside the circle are **equal**. The line from the centre to the external point bisects the angle between the tangents.

**Intersecting chords**: If two chords $AB$ and $CD$ intersect at $P$ **inside** the circle, then $AP \\times PB = CP \\times PD$. (For secants from an external point, a similar product rule holds.)`,
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
            'Angle at centre = $2 \\times$ angle at circumference (same arc).',
            'Angle in a semicircle = $90°$.',
            'Cyclic quadrilateral: opposite angles sum to $180°$.',
            'Tangent $\\perp$ radius at point of contact; two tangents from external point are equal.',
            'Perpendicular from centre to chord bisects chord; intersecting chords: $AP\\cdot PB = CP\\cdot PD$.'
        ],
        exam_tips: [
            'Name the theorem at each step (e.g. "angle at centre", "cyclic quad").',
            'Mark equal angles and equal lengths on the diagram.',
            'Spot isosceles triangles (two radii) and right angles (tangent-radius, semicircle).',
            'Use the app\'s 1000+ practice questions on circle theorems.'
        ],
        visual_descriptions: [
            'Circle with angle at centre and angle at circumference subtended by same arc.',
            'Cyclic quadrilateral with opposite angles marked; diagram for alternate segment theorem.'
        ]
    }
};

export const geometryTopics = Object.keys(geometryNotes);
