import { MathTopicNotes } from './types';

export const statisticsNotes: Record<string, MathTopicNotes> = {
    'Statistics': {
        topic: 'Statistics',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'Statistics is the collection, organization, analysis, and interpretation of data. This topic covers measures of central tendency, dispersion, and data representation.',
        sections: [
            {
                title: 'Measures of Central Tendency',
                content: `**Mean (Average)**:
$$\\text{Mean} = \\bar{x} = \\frac{\\sum x}{n} = \\frac{\\text{Sum of all values}}{\\text{Number of values}}$$

**For Grouped Data**:
$$\\text{Mean} = \\frac{\\sum fx}{\\sum f}$$
where $f$ = frequency, $x$ = midpoint of class.

**Median**: The middle value when data is ordered.
- Odd $n$: Median = $\\left(\\frac{n+1}{2}\\right)^{\\text{th}}$ value.
- Even $n$: Median = Mean of $\\frac{n}{2}^{\\text{th}}$ and $\\left(\\frac{n}{2}+1\\right)^{\\text{th}}$ values.

**Mode**: The most frequently occurring value.`,
                worked_examples: [
                    {
                        question: 'Find the mean, median, and mode of: $3, 7, 5, 9, 5, 8, 5, 10$',
                        steps: [
                            'Arrange: $3, 5, 5, 5, 7, 8, 9, 10$.',
                            'Mean = $\\frac{3+5+5+5+7+8+9+10}{8} = \\frac{52}{8} = 6.5$.',
                            'Median (even $n=8$): Average of 4th and 5th values = $\\frac{5+7}{2} = 6$.',
                            'Mode = $5$ (appears 3 times).'
                        ],
                        final_answer: 'Mean = $6.5$, Median = $6$, Mode = $5$'
                    },
                    {
                        question: 'The mean of $5$ numbers is $12$. When a sixth number is added, the mean becomes $13$. Find the sixth number.',
                        steps: [
                            'Sum of 5 numbers = $5 \\times 12 = 60$.',
                            'Sum of 6 numbers = $6 \\times 13 = 78$.',
                            'Sixth number = New Sum - Old Sum = $78 - 60 = 18$.'
                        ],
                        final_answer: '$18$'
                    },
                    {
                        question: 'For the frequency distribution: $x$: 10, 20, 30; $f$: 5, 3, 2. Calculate the mean.',
                        steps: [
                            'Calculate $fx$: $10(5)=50$, $20(3)=60$, $30(2)=60$.',
                            'Sum of $fx = 50 + 60 + 60 = 170$.',
                            'Sum of $f = 5 + 3 + 2 = 10$.',
                            'Mean = $\\frac{170}{10} = 17$.'
                        ],
                        final_answer: '$17$'
                    }
                ]
            },
            {
                title: 'Measures of Dispersion',
                content: `**Range**: Largest value – Smallest value.

**Interquartile Range (IQR)**:
$$\\text{IQR} = Q_3 - Q_1$$
where $Q_1$ = Lower Quartile (25th percentile), $Q_3$ = Upper Quartile (75th percentile).

**Variance** ($\\sigma^2$):
$$\\sigma^2 = \\frac{\\sum (x - \\bar{x})^2}{n} = \\frac{\\sum x^2}{n} - \\bar{x}^2$$

**Standard Deviation** ($\\sigma$):
$$\\sigma = \\sqrt{\\text{Variance}} = \\sqrt{\\frac{\\sum (x - \\bar{x})^2}{n}}$$`,
                worked_examples: [
                    {
                        question: 'Find the standard deviation of: $2, 4, 4, 4, 5, 5, 7, 9$',
                        steps: [
                            'Mean $\\bar{x} = 5$.',
                            'Sum of $(x - \\bar{x})^2 = 32$.',
                            'Variance = $\\frac{32}{8} = 4$.',
                            'Standard Deviation = $\\sqrt{4} = 2$.'
                        ],
                        final_answer: '$\\sigma = 2$'
                    },
                    {
                        question: 'Given $n=10$, $\\sum x^2 = 2500$, mean $= 14$. Find the variance.',
                        steps: [
                            'Variance formula: $\\frac{\\sum x^2}{n} - (\\text{mean})^2$.',
                            'Variance = $\\frac{2500}{10} - (14)^2$.',
                            'Variance = $250 - 196 = 54$.'
                        ],
                        final_answer: '$54$'
                    }
                ]
            },
            {
                title: 'Cumulative Frequency and Quartiles',
                content: `**Cumulative Frequency**: Running total of frequencies up to each class.

**From a Cumulative Frequency Curve (Ogive)**:
- **Median**: Value at $\\frac{n}{2}$ on the frequency axis.
- **$Q_1$**: Value at $\\frac{n}{4}$.
- **$Q_3$**: Value at $\\frac{3n}{4}$.

**Box-and-Whisker Plot**: Shows minimum, $Q_1$, median, $Q_3$, maximum.`,
                worked_examples: [
                    {
                        question: 'From a cumulative frequency graph with $n = 80$ students, estimate the median and IQR.',
                        steps: [
                            'Median position: $\\frac{80}{2} = 40$. Read the x-value at $y = 40$.',
                            '$Q_1$ position: $\\frac{80}{4} = 20$. Read x-value at $y = 20$.',
                            '$Q_3$ position: $\\frac{3 \\times 80}{4} = 60$. Read x-value at $y = 60$.',
                            'IQR = $Q_3 - Q_1$.'
                        ],
                        final_answer: 'Read values from the graph at the specified y-coordinates.'
                    },
                    {
                        question: 'Analysis of a Box-and-Whisker Plot: Min=10, Q1=15, Med=22, Q3=30, Max=45. Find range and IQR.',
                        steps: [
                            'Range = Max - Min = $45 - 10 = 35$.',
                            'IQR = $Q_3 - Q_1 = 30 - 15 = 15$.',
                            'Median = $22$.'
                        ],
                        final_answer: 'Range = $35$, IQR = $15$'
                    }
                ]
            },
            {
                title: 'Data Representation',
                content: `**Bar Chart**: For categorical/discrete data. Bars do not touch.

**Histogram**: For continuous data. Bars touch. Area ∝ Frequency.

**Pie Chart**: Shows proportions. Each sector angle = $\\frac{\\text{value}}{\\text{total}} \\times 360°$.

**Stem-and-Leaf Diagram**: Shows distribution while preserving original data.

**Scatter Diagram**: Shows correlation between two variables.
- Positive correlation: Points trend upward.
- Negative correlation: Points trend downward.
- No correlation: Points scattered randomly.`,
                worked_examples: [
                    {
                        question: 'In a pie chart representing 60 students, 15 students chose "Blue". Calculate the sector angle.',
                        steps: [
                            'Fraction = $\\frac{15}{60} = \\frac{1}{4}$.',
                            'Angle = $\\frac{1}{4} \\times 360° = 90°$.'
                        ],
                        final_answer: '$90°$'
                    },
                    {
                        question: 'For a histogram, a class width is 5 and frequency is 20. Calculate the frequency density.',
                        steps: [
                            'Frequency Density = $\\frac{\\text{Frequency}}{\\text{Class Width}}$.',
                            'FD = $\\frac{20}{5} = 4$.',
                            'Height of bar = 4.'
                        ],
                        final_answer: '$4$'
                    },
                    {
                        question: 'A pie chart sector angle is $120°$. If the total frequency is $90$, find the frequency for this sector.',
                        steps: [
                            'Fraction of total = $\\frac{120}{360} = \\frac{1}{3}$.',
                            'Frequency = $\\frac{1}{3} \\times 90 = 30$.'
                        ],
                        final_answer: '$30$'
                    }
                ]
            }
        ],
        key_points: [
            'Mean = $\\frac{\\sum x}{n}$, affected by outliers.',
            'Median is the middle value, resistant to outliers.',
            'Mode is most frequent, can have multiple or none.',
            'Standard deviation measures spread around the mean.'
        ],
        exam_tips: [
            'Show your working in mean calculations.',
            'Always order data before finding the median.',
            'For grouped data, use class midpoints.',
            'In cumulative frequency, read values carefully from the curve.'
        ],
        visual_descriptions: [
            'Cumulative frequency curve (ogive) with quartiles marked.',
            'Box-and-whisker plot showing five-number summary.'
        ]
    },
    'Probability': {
        topic: 'Probability',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'Probability measures the likelihood of an event occurring. It ranges from $0$ (impossible) to $1$ (certain).',
        sections: [
            {
                title: 'Basic Probability',
                content: `**Probability Formula**:
$$P(\\text{Event}) = \\frac{\\text{Number of favorable outcomes}}{\\text{Total number of possible outcomes}}$$

**Properties**:
- $0 \\leq P(A) \\leq 1$
- $P(\\text{certain event}) = 1$
- $P(\\text{impossible event}) = 0$
- $P(A') = 1 - P(A)$ where $A'$ is the complement of $A$.`,
                worked_examples: [
                    {
                        question: 'A bag contains $5$ red, $3$ blue, and $2$ green balls. Find the probability of picking (a) a red ball (b) not a blue ball.',
                        steps: [
                            'Total balls = $5 + 3 + 2 = 10$.',
                            '(a) $P(\\text{red}) = \\frac{5}{10} = \\frac{1}{2}$.',
                            '(b) $P(\\text{not blue}) = 1 - P(\\text{blue}) = 1 - \\frac{3}{10} = \\frac{7}{10}$.'
                        ],
                        final_answer: '(a) $\\frac{1}{2}$ (b) $\\frac{7}{10}$'
                    },
                    {
                        question: 'A letter is chosen at random from the word PROBABILITY. Find the probability that it is (a) a B (b) a vowel.',
                        steps: [
                            'Total letters = 11.',
                            '(a) There are 2 Bs. $P(B) = \\frac{2}{11}$.',
                            '(b) Vowels are O, A, I, I (4 vowels). $P(\\text{Vowel}) = \\frac{4}{11}$.'
                        ],
                        final_answer: '(a) $\\frac{2}{11}$ (b) $\\frac{4}{11}$'
                    }
                ]
            },
            {
                title: 'Combined Events',
                content: `**Independent Events**: Outcome of one doesn't affect the other.
$$P(A \\text{ and } B) = P(A) \\times P(B)$$

**Mutually Exclusive Events**: Cannot happen together.
$$P(A \\text{ and } B) = 0$$
$$P(A \\text{ or } B) = P(A) + P(B)$$

**General Addition Rule**:
$$P(A \\text{ or } B) = P(A) + P(B) - P(A \\text{ and } B)$$`,
                worked_examples: [
                    {
                        question: 'A coin is tossed and a die is rolled. Find $P$(Head and 6).',
                        steps: [
                            '$P(\\text{Head}) = \\frac{1}{2}$.',
                            '$P(6) = \\frac{1}{6}$.',
                            'Events are independent: $P(\\text{Head and } 6) = \\frac{1}{2} \\times \\frac{1}{6} = \\frac{1}{12}$.'
                        ],
                        final_answer: '$\\frac{1}{12}$'
                    },
                    {
                        question: 'Two events A and B are mutually exclusive. $P(A) = 0.3$ and $P(B) = 0.4$. Find $P(A \\text{ or } B)$.',
                        steps: [
                            'Mutually exclusive $\\Rightarrow P(A \\text{ or } B) = P(A) + P(B)$.',
                            '$0.3 + 0.4 = 0.7$.'
                        ],
                        final_answer: '$0.7$'
                    }
                ]
            },
            {
                title: 'Tree Diagrams',
                content: `**Tree Diagrams**: Visualize sequences of events.
- Each branch shows an outcome and its probability.
- Multiply along branches for "AND".
- Add across branches for "OR".

**With and Without Replacement**:
- **With replacement**: Probabilities stay the same.
- **Without replacement**: Total decreases, probabilities change.`,
                worked_examples: [
                    {
                        question: 'A bag has $3$ red and $2$ blue balls. Two balls are drawn without replacement. Find $P$(both red).',
                        steps: [
                            '$P(\\text{1st red}) = \\frac{3}{5}$.',
                            'After removing one red, $P(\\text{2nd red}) = \\frac{2}{4} = \\frac{1}{2}$.',
                            '$P(\\text{both red}) = \\frac{3}{5} \\times \\frac{1}{2} = \\frac{3}{10}$.'
                        ],
                        final_answer: '$\\frac{3}{10}$'
                    },
                    {
                        question: 'A box contains 4 black and 6 white pens. Two pens are drawn at random. Find probability they are of different colors.',
                        steps: [
                            'Options: (Black then White) OR (White then Black).',
                            '$P(BW) = \\frac{4}{10} \\times \\frac{6}{9} = \\frac{24}{90} = \\frac{4}{15}$.',
                            '$P(WB) = \\frac{6}{10} \\times \\frac{4}{9} = \\frac{24}{90} = \\frac{4}{15}$.',
                            'Total = $\\frac{4}{15} + \\frac{4}{15} = \\frac{8}{15}$.'
                        ],
                        final_answer: '$\\frac{8}{15}$'
                    }
                ]
            },
            {
                title: 'Venn Diagrams in Probability',
                content: `**Venn Diagrams**: Show relationships between sets/events.

**Key Regions**:
- $A \\cap B$: Intersection (both A and B).
- $A \\cup B$: Union (either A or B or both).
- $A'$: Complement (not A).

**Formula**:
$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$`,
                worked_examples: [
                    {
                        question: 'In a class, $P(\\text{Maths}) = 0.6$, $P(\\text{Science}) = 0.5$, $P(\\text{Both}) = 0.3$. Find $P$(Maths or Science).',
                        steps: [
                            'Use: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$.',
                            '$P(\\text{Maths or Science}) = 0.6 + 0.5 - 0.3 = 0.8$.'
                        ],
                        final_answer: '$0.8$ or $\\frac{4}{5}$'
                    },
                    {
                        question: 'Given $P(A) = 0.7$, $P(B) = 0.4$ and $P(A \\cup B) = 0.9$. Find $P(A \\cap B)$.',
                        steps: [
                            '$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$.',
                            '$0.9 = 0.7 + 0.4 - P(A \\cap B)$.',
                            '$0.9 = 1.1 - P(A \\cap B)$.',
                            '$P(A \\cap B) = 1.1 - 0.9 = 0.2$.'
                        ],
                        final_answer: '$0.2$'
                    }
                ]
            }
        ],
        key_points: [
            '$P(A\') = 1 - P(A)$.',
            'Independent events: Multiply probabilities.',
            'Mutually exclusive events: Add probabilities.',
            'Without replacement: Adjust probabilities after each draw.'
        ],
        exam_tips: [
            'Always simplify fractions.',
            'Draw tree diagrams for multi-step problems.',
            'Check that all probabilities sum to 1.',
            'Label Venn diagrams clearly.'
        ],
        visual_descriptions: [
            'Tree diagram showing two-stage selection.',
            'Venn diagram with two overlapping sets.'
        ]
    }
};

export const mensurationNotes: Record<string, MathTopicNotes> = {
    'Mensuration': {
        topic: 'Mensuration',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'Mensuration deals with the measurement of geometric shapes—lengths, areas, and volumes. Mastery of formulas and their applications is crucial.',
        sections: [
            {
                title: '2D Shapes - Perimeter and Area',
                content: `**Rectangle**: 
Perimeter = $2(l + w)$, Area = $lw$

**Square**: 
Perimeter = $4s$, Area = $s^2$

**Triangle**: 
Perimeter = $a + b + c$
Area = $\\frac{1}{2} \\times \\text{base} \\times \\text{height}$
Area (using sides) = $\\sqrt{s(s-a)(s-b)(s-c)}$ where $s = \\frac{a+b+c}{2}$ (Heron's formula).

**Parallelogram**: 
Area = $\\text{base} \\times \\text{height}$

**Trapezium**: 
Area = $\\frac{1}{2}(a + b) \\times h$ where $a$ and $b$ are parallel sides.

**Circle**: 
Circumference = $2\\pi r = \\pi d$
Area = $\\pi r^2$`,
                worked_examples: [
                    {
                        question: 'Find the area of a trapezium with parallel sides $8$ cm and $12$ cm, and height $5$ cm.',
                        steps: [
                            'Area = $\\frac{1}{2}(a + b) \\times h$.',
                            'Area = $\\frac{1}{2}(8 + 12) \\times 5$.',
                            'Area = $\\frac{1}{2} \\times 20 \\times 5 = 50$ cm².'
                        ],
                        final_answer: '$50$ cm²'
                    },
                    {
                        question: 'The perimeter of a rectangle is $30$ cm. If the length is $9$ cm, find the width and area.',
                        steps: [
                            'Perimeter = $2(l+w) \\Rightarrow 30 = 2(9+w)$.',
                            '$15 = 9+w \\Rightarrow w = 6$ cm.',
                            'Area = $l \\times w = 9 \\times 6 = 54$ cm².'
                        ],
                        final_answer: 'Width = $6$ cm, Area = $54$ cm²'
                    },
                    {
                        question: 'Find the area of a triangle with sides $5$ cm, $5$ cm, and $6$ cm.',
                        steps: [
                            'Use Heron\'s formula. $s = \\frac{5+5+6}{2} = 8$.',
                            'Area = $\\sqrt{8(8-5)(8-5)(8-6)} = \\sqrt{8(3)(3)(2)} = \\sqrt{144} = 12$ cm².',
                            'Alternatively, drop a perpendicular to base $6$. height = $\\sqrt{5^2-3^2}=4$. Area = $\\frac{1}{2}(6)(4)=12$.'
                        ],
                        final_answer: '$12$ cm²'
                    }
                ]
            },
            {
                title: 'Sectors and Arcs',
                content: `For a sector with angle $\\theta$ (in degrees) and radius $r$:

**Arc Length**:
$$\\text{Arc} = \\frac{\\theta}{360} \\times 2\\pi r$$

**Sector Area**:
$$\\text{Area} = \\frac{\\theta}{360} \\times \\pi r^2$$

**Segment Area** (region between chord and arc):
$$\\text{Segment Area} = \\text{Sector Area} - \\text{Triangle Area}$$`,
                worked_examples: [
                    {
                        question: 'Find the area of a sector with radius $7$ cm and angle $60°$. (Use $\\pi = \\frac{22}{7}$)',
                        steps: [
                            'Area = $\\frac{\\theta}{360} \\times \\pi r^2$.',
                            'Area = $\\frac{60}{360} \\times \\frac{22}{7} \\times 7^2$.',
                            'Area = $\\frac{1}{6} \\times \\frac{22}{7} \\times 49$.',
                            'Area = $\\frac{1}{6} \\times 22 \\times 7 = \\frac{154}{6} = 25\\frac{2}{3}$ cm².'
                        ],
                        final_answer: '$25\\frac{2}{3}$ cm² or $\\approx 25.67$ cm²'
                    },
                    {
                        question: 'Calculate the arc length of a semicircle with diameter $14$ cm.',
                        steps: [
                            'Radius $r = 7$ cm. Angle = $180°$.',
                            'Arc = $\\frac{180}{360} \\times 2\\pi r = \\frac{1}{2} \\times 2\\pi(7) = 7\\pi$.',
                            '$7 \\times \\frac{22}{7} = 22$ cm.'
                        ],
                        final_answer: '$22$ cm'
                    },
                    {
                        question: 'A segment is cut from a circle of radius $10$ cm by a chord subtending $90°$ at the center. Find the segment area.',
                        steps: [
                            'Sector Area = $\\frac{90}{360} \\pi (10)^2 = \\frac{1}{4} (100\\pi) = 25\\pi$.',
                            'Triangle Area = $\\frac{1}{2} r^2 \\sin 90° = \\frac{1}{2} (100)(1) = 50$.',
                            'Segment Area = $25\\pi - 50 = 25(\\pi - 2) \\approx 28.5$ cm².'
                        ],
                        final_answer: '$\\approx 28.5$ cm²'
                    }
                ]
            },
            {
                title: '3D Shapes - Surface Area and Volume',
                content: `**Cuboid**:
Surface Area = $2(lw + wh + lh)$
Volume = $lwh$

**Cube**:
Surface Area = $6s^2$
Volume = $s^3$

**Cylinder**:
Curved Surface Area = $2\\pi rh$
Total Surface Area = $2\\pi r(r + h)$
Volume = $\\pi r^2 h$

**Cone**:
Curved Surface Area = $\\pi rl$ where $l$ = slant height
Total Surface Area = $\\pi r(r + l)$
Volume = $\\frac{1}{3}\\pi r^2 h$

**Sphere**:
Surface Area = $4\\pi r^2$
Volume = $\\frac{4}{3}\\pi r^3$

**Pyramid**:
Volume = $\\frac{1}{3} \\times \\text{Base Area} \\times h$`,
                worked_examples: [
                    {
                        question: 'Find the volume and surface area of a cylinder with radius $3$ cm and height $10$ cm.',
                        steps: [
                            'Volume = $\\pi r^2 h = \\pi \\times 3^2 \\times 10 = 90\\pi$ cm³.',
                            'Total Surface Area = $2\\pi r(r + h) = 2\\pi \\times 3 \\times (3 + 10) = 6\\pi \\times 13 = 78\\pi$ cm².'
                        ],
                        final_answer: 'Volume = $90\\pi \\approx 283$ cm³, Surface Area = $78\\pi \\approx 245$ cm²'
                    },
                    {
                        question: 'Find the volume of a cone with radius $4$ cm and height $9$ cm.',
                        steps: [
                            'Volume = $\\frac{1}{3}\\pi r^2 h$.',
                            'Volume = $\\frac{1}{3} \\times \\pi \\times 4^2 \\times 9 = \\frac{1}{3} \\times \\pi \\times 144 = 48\\pi$ cm³.'
                        ],
                        final_answer: 'Volume = $48\\pi \\approx 150.8$ cm³'
                    },
                    {
                        question: 'A sphere has a volume of $36\\pi$ cm³. Find its radius.',
                        steps: [
                            'Volume = $\\frac{4}{3}\\pi r^3 = 36\\pi$.',
                            'Divide by $\\pi$: $\\frac{4}{3}r^3 = 36$.',
                            '$r^3 = 36 \\times \\frac{3}{4} = 27$.',
                            '$r = \\sqrt[3]{27} = 3$ cm.'
                        ],
                        final_answer: '$3$ cm'
                    }
                ]
            },
            {
                title: 'Similar Shapes',
                content: `For two similar shapes with scale factor $k$:

**Length ratio**: $k$
**Area ratio**: $k^2$
**Volume ratio**: $k^3$

If corresponding lengths are in ratio $a : b$, then:
- Areas are in ratio $a^2 : b^2$
- Volumes are in ratio $a^3 : b^3$`,
                worked_examples: [
                    {
                        question: 'Two similar cones have heights in the ratio $2:5$. If the volume of the smaller cone is $40$ cm³, find the volume of the larger cone.',
                        steps: [
                            'Scale factor $k = \\frac{5}{2}$.',
                            'Volume ratio = $k^3 = \\left(\\frac{5}{2}\\right)^3 = \\frac{125}{8}$.',
                            'Volume of larger = $40 \\times \\frac{125}{8} = \\frac{5000}{8} = 625$ cm³.'
                        ],
                        final_answer: '$625$ cm³'
                    },
                    {
                        question: 'Two similar jugs have capacities $500$ ml and $4000$ ml. The height of the smaller jug is $10$ cm. Find the height of the larger jug.',
                        steps: [
                            'Volume ratio = $\\frac{4000}{500} = 8$.',
                            '$k^3 = 8 \\Rightarrow k = \\sqrt[3]{8} = 2$.',
                            'Height ratio = $2$.',
                            'Height of larger = $10 \\times 2 = 20$ cm.'
                        ],
                        final_answer: '$20$ cm'
                    }
                ]
            }
        ],
        key_points: [
            'Area of circle = $\\pi r^2$, Circumference = $2\\pi r$.',
            'Volume of cylinder = $\\pi r^2 h$, Volume of cone = $\\frac{1}{3}\\pi r^2 h$.',
            'Volume of sphere = $\\frac{4}{3}\\pi r^3$.',
            'Similar shapes: Areas scale by $k^2$, Volumes by $k^3$.'
        ],
        exam_tips: [
            'Learn all formulas by heart.',
            'State units clearly (cm, cm², cm³).',
            'For composite shapes, break into simpler parts.',
            'Leave answers in terms of $\\pi$ unless told otherwise.'
        ],
        visual_descriptions: [
            '3D diagrams of cylinder, cone, sphere with dimensions labeled.',
            'Sector of a circle with arc and angle marked.'
        ]
    }
};

export const statisticsTopics = Object.keys(statisticsNotes);
export const mensurationTopics = Object.keys(mensurationNotes);
