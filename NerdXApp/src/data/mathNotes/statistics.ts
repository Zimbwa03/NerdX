import { MathTopicNotes } from './types';

export const statisticsNotes: Record<string, MathTopicNotes> = {
    'Statistics': {
        topic: 'Statistics',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'Statistics covers collecting, organising, and interpreting data. **Central tendency**: mean (average), median (middle value), mode (most frequent). **Dispersion**: range, interquartile range (IQR), variance, and standard deviation. **Grouped data**: use class midpoints for mean; cumulative frequency and ogives for median and quartiles; box plots for the five-number summary. **Representation**: bar charts, histograms (frequency density), pie charts, stem-and-leaf, scatter diagrams and correlation. You need to calculate and interpret these measures and read from graphs.',
        sections: [
            {
                title: '1. Measures of Central Tendency',
                content: `**Mean (average)**: $\\bar{x} = \\frac{\\sum x}{n} = \\frac{\\text{Sum of values}}{\\text{Number of values}}$. The mean is affected by every value and by **outliers**.

**Grouped data**: Use the **midpoint** of each class as $x$ and frequency as $f$:
$$\\text{Mean} = \\frac{\\sum fx}{\\sum f}$$

**Median**: The **middle** value when data is arranged in order. Resistant to outliers.
- Odd $n$: median = $\\left(\\frac{n+1}{2}\\right)^{\\text{th}}$ value.
- Even $n$: median = average of $\\frac{n}{2}^{\\text{th}}$ and $\\left(\\frac{n}{2}+1\\right)^{\\text{th}}$ values.

**Mode**: The value that appears **most often**. There can be no mode, one mode, or several. For grouped data, the **modal class** is the class with highest frequency.`,
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
                title: '2. Measures of Dispersion',
                content: `**Range** = Maximum $-$ Minimum. Simple but affected by outliers.

**Quartiles**: $Q_1$ (lower quartile) = 25th percentile; $Q_2$ = median (50th); $Q_3$ (upper quartile) = 75th. **Interquartile range** $\\text{IQR} = Q_3 - Q_1$ measures spread of the middle 50% and is resistant to outliers.

**Variance** (mean squared deviation from the mean):
$$\\sigma^2 = \\frac{\\sum (x - \\bar{x})^2}{n} = \\frac{\\sum x^2}{n} - \\bar{x}^2$$

**Standard deviation** $\\sigma = \\sqrt{\\text{Variance}}$ has the same units as the data and measures typical deviation from the mean.`,
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
                title: '3. Cumulative Frequency and Quartiles',
                content: `**Cumulative frequency** at a value = sum of all frequencies up to and including that class. Plot upper class boundary vs cumulative frequency to get an **ogive** (S-shaped curve).

**From the ogive**: Read off the variable (x-axis) at cumulative frequency $\\frac{n}{2}$ for **median**, at $\\frac{n}{4}$ for **$Q_1$**, at $\\frac{3n}{4}$ for **$Q_3$**. Then IQR = $Q_3 - Q_1$.

**Box-and-whisker plot** (box plot): Five-number summary — minimum, $Q_1$, median, $Q_3$, maximum. The box shows IQR; whiskers extend to min and max (or to adjacent values if outliers are excluded).`,
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
                title: '4. Data Representation',
                content: `**Bar chart**: For **categorical** or discrete data. Bars are separate; height = frequency (or value).

**Histogram**: For **continuous** data. Bars touch; **area** of each bar ∝ frequency. If class widths differ, use **frequency density** = $\\frac{\\text{frequency}}{\\text{class width}}$ so that bar height = frequency density.

**Pie chart**: Shows parts of a whole. Sector angle = $\\frac{\\text{value}}{\\text{total}} \\times 360°$.

**Stem-and-leaf**: Keeps raw data visible; stem = leading digit(s), leaf = trailing digit(s). Good for small data sets.

**Scatter diagram**: Two variables; each point = one pair. **Positive correlation**: upward trend; **negative correlation**: downward trend; **no correlation**: no clear trend. Line of best fit can be drawn by eye.`,
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
            'Mean $\\bar{x} = \\frac{\\sum x}{n}$; grouped mean = $\\frac{\\sum fx}{\\sum f}$ (use midpoints).',
            'Median = middle value (order first); resistant to outliers.',
            'Mode = most frequent; IQR = $Q_3 - Q_1$; $\\sigma = \\sqrt{\\text{variance}}$.',
            'Ogive: median at $\\frac{n}{2}$, $Q_1$ at $\\frac{n}{4}$, $Q_3$ at $\\frac{3n}{4}$.',
            'Histogram: area ∝ frequency; use frequency density if class widths differ.'
        ],
        exam_tips: [
            'Order data before finding median and quartiles.',
            'For grouped data, always use class midpoints for the mean.',
            'When reading from an ogive, use the correct axis (cumulative frequency vs value).',
            'Use the app\'s 1000+ practice questions on statistics.'
        ],
        visual_descriptions: [
            'Cumulative frequency curve (ogive) with median and quartiles marked.',
            'Box-and-whisker plot with five-number summary; histogram with equal/unequal class widths.'
        ]
    },
    'Probability': {
        topic: 'Probability',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'Probability measures how likely an event is, from $0$ (impossible) to $1$ (certain). **Basic rule**: $P(A) = \\frac{\\text{favorable outcomes}}{\\text{total outcomes}}$ when outcomes are equally likely. **Complement**: $P(A\') = 1 - P(A)$. **Combined events**: independent (multiply probabilities); mutually exclusive (add probabilities). **Tree diagrams** and **Venn diagrams** help with two-stage and overlapping events. Always consider **with** vs **without replacement** when drawing more than one item.',
        sections: [
            {
                title: '1. Basic Probability',
                content: `**Definition** (equally likely outcomes): $P(A) = \\frac{\\text{Number of outcomes in } A}{\\text{Total number of possible outcomes}}$.

**Rules**: $0 \\leq P(A) \\leq 1$; $P(\\text{certain}) = 1$; $P(\\text{impossible}) = 0$.

**Complement**: $A'$ = "not A". $P(A') = 1 - P(A)$. So $P(A) + P(A') = 1$.

When listing outcomes, use a systematic list or a sample space diagram (e.g. two dice) to avoid missing or double-counting.`,
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
                title: '2. Combined Events',
                content: `**Independent events**: One occurring does not change the probability of the other (e.g. two dice, coin and die). **Multiply** for "and":
$$P(A \\text{ and } B) = P(A) \\times P(B)$$

**Mutually exclusive events**: They cannot both happen (e.g. "even" and "odd" on one die). **Add** for "or":
$$P(A \\text{ or } B) = P(A) + P(B) \\quad (\\text{when } P(A \\cap B) = 0)$$

**General addition rule** (for any two events):
$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$
Use this when events can both happen (e.g. "Maths" and "Science" in a survey).`,
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
                title: '3. Tree Diagrams',
                content: `**Tree diagrams** show a sequence of events (e.g. first draw, then second draw). Each **branch** is labelled with the outcome and its **probability**. **Multiply** along branches for "A then B" (and). **Add** the probabilities of the branches that satisfy "OR" (e.g. both red OR both blue).

**With replacement**: The object is put back; probabilities on the second stage stay the same as the first.

**Without replacement**: The object is not put back; the total and the number of "success" items change, so **update probabilities** on the second set of branches (e.g. after one red is drawn, fewer reds remain).`,
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
                title: '4. Venn Diagrams in Probability',
                content: `**Venn diagrams** show how two (or more) events overlap. **Intersection** $A \\cap B$ = "both A and B". **Union** $A \\cup B$ = "A or B or both". **Complement** $A'$ = "not A".

Fill in the overlap first if known, then work out the rest so that each set sums to its given probability and the total is $1$.

**Addition rule**: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$. So $P(A \\cap B) = P(A) + P(B) - P(A \\cup B)$ if you know the union.`,
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
            '$P(A) \\in [0,1]$; $P(A\') = 1 - P(A)$.',
            'Independent: $P(A \\cap B) = P(A) \\times P(B)$. Mutually exclusive: $P(A \\cup B) = P(A) + P(B)$.',
            'General: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$.',
            'Tree: multiply along branches (and); add branches for (or). Without replacement: change probabilities on second stage.'
        ],
        exam_tips: [
            'Simplify probabilities to lowest terms unless asked for decimals.',
            'Draw tree diagrams for two (or more) stage experiments; label all branches.',
            'Without replacement: reduce the total and the "success" count on the next branch.',
            'Use the app\'s 1000+ practice questions on probability.'
        ],
        visual_descriptions: [
            'Tree diagram for two draws (with/without replacement) with probabilities on branches.',
            'Venn diagram with two overlapping circles and regions $A \\cap B$, $A$ only, $B$ only.'
        ]
    }
};

export const mensurationNotes: Record<string, MathTopicNotes> = {
    'Mensuration': {
        topic: 'Mensuration',
        subject: 'Mathematics',
        grade_level: 'O-Level',
        summary: 'Mensuration is the measurement of lengths, areas, and volumes. **2D**: perimeter and area of rectangles, squares, triangles (including Heron\'s formula), parallelograms, trapezia, circles; arcs and sectors. **3D**: surface area and volume of cuboids, cubes, cylinders, cones, spheres, and pyramids. **Similar shapes**: length scale $k$, area scale $k^2$, volume scale $k^3$. You need to apply the correct formula, work with composite shapes, and give units (cm, cm², cm³).',
        sections: [
            {
                title: '1. 2D Shapes — Perimeter and Area',
                content: `**Rectangle**: Perimeter = $2(l+w)$, Area = $lw$. **Square**: Perimeter = $4s$, Area = $s^2$.

**Triangle**: Perimeter = $a+b+c$. Area = $\\frac{1}{2} \\times \\text{base} \\times \\text{height}$ (height perpendicular to base). **Heron's formula** (when only sides are known): $s = \\frac{a+b+c}{2}$, then Area = $\\sqrt{s(s-a)(s-b)(s-c)}$.

**Parallelogram**: Area = base $\\times$ perpendicular height (not the slant side).

**Trapezium**: Area = $\\frac{1}{2}(a+b) \\times h$, where $a$ and $b$ are the **parallel** sides and $h$ is the perpendicular distance between them.

**Circle**: Circumference = $2\\pi r = \\pi d$; Area = $\\pi r^2$.`,
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
                title: '2. Sectors and Arcs',
                content: `A **sector** is a "slice" of a circle with angle $\\theta$ (in degrees) at the centre and radius $r$.

**Arc length** (curved part of boundary): $\\frac{\\theta}{360} \\times 2\\pi r = \\frac{\\theta}{360} \\times \\pi d$.

**Sector area**: $\\frac{\\theta}{360} \\times \\pi r^2$ (same fraction of the circle's area).

**Segment**: The region between a **chord** and the arc. Segment area = Sector area $-$ Area of triangle formed by the two radii and the chord. If $\\theta$ is in radians, arc = $r\\theta$ and sector area = $\\frac{1}{2}r^2\\theta$.`,
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
                title: '3. 3D Shapes — Surface Area and Volume',
                content: `**Cuboid**: Volume = $lwh$. Total surface area = $2(lw + wh + lh)$ (six faces).

**Cube**: Volume = $s^3$, surface area = $6s^2$.

**Cylinder** (radius $r$, height $h$): Volume = $\\pi r^2 h$. Curved surface = $2\\pi rh$; total (including both circular ends) = $2\\pi r^2 + 2\\pi rh = 2\\pi r(r+h)$.

**Cone** (radius $r$, height $h$, slant height $l$): $l^2 = r^2 + h^2$. Volume = $\\frac{1}{3}\\pi r^2 h$. Curved surface = $\\pi rl$; total (with base) = $\\pi r(r+l)$.

**Sphere** (radius $r$): Surface area = $4\\pi r^2$, Volume = $\\frac{4}{3}\\pi r^3$.

**Pyramid**: Volume = $\\frac{1}{3} \\times \\text{base area} \\times$ perpendicular height. (Cone is a "circular pyramid".)`,
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
                title: '4. Similar Shapes',
                content: `Two shapes are **similar** if one is an enlargement of the other (same shape, possibly different size). Corresponding angles are equal; corresponding lengths are in the same ratio, called the **scale factor** $k$.

**Lengths** (sides, perimeters, circumferences): ratio = $k$.
**Areas**: ratio = $k^2$ (e.g. if length doubles, area is 4 times).
**Volumes**: ratio = $k^3$ (e.g. if length doubles, volume is 8 times).

So if two similar solids have volumes $V_1$ and $V_2$, then $\\frac{V_2}{V_1} = k^3$, so $k = \\sqrt[3]{\\frac{V_2}{V_1}}$. Use this to find an unknown length from a known volume ratio.`,
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
            'Circle: circumference $2\\pi r$, area $\\pi r^2$. Sector: arc = $\\frac{\\theta}{360}\\times 2\\pi r$, area = $\\frac{\\theta}{360}\\times \\pi r^2$.',
            'Cylinder: $V=\\pi r^2 h$, cone: $V=\\frac{1}{3}\\pi r^2 h$, sphere: $V=\\frac{4}{3}\\pi r^3$.',
            'Trapezium: area = $\\frac{1}{2}(a+b)h$; triangle: $\\frac{1}{2}$ base $\\times$ height or Heron.',
            'Similar: length $k$, area $k^2$, volume $k^3$.'
        ],
        exam_tips: [
            'Identify the shape and use the correct formula; for cone, distinguish height $h$ and slant height $l$.',
            'Give units (cm, m, cm², cm³) and leave in terms of $\\pi$ unless asked for a decimal.',
            'Composite shapes: split into rectangles, triangles, sectors, etc., and add or subtract areas/volumes.',
            'Use the app\'s 1000+ practice questions on mensuration.'
        ],
        visual_descriptions: [
            'Cylinder, cone, and sphere with radius, height, and slant height labelled.',
            'Sector of a circle with radius $r$ and angle $\\theta$; arc and sector area marked.'
        ]
    }
};

export const statisticsTopics = Object.keys(statisticsNotes);
export const mensurationTopics = Object.keys(mensurationNotes);
