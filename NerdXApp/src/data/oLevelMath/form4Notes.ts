import type { MathTopicNotes } from '../mathNotes/types';

type Form4TopicOutline = {
  topic: string;
  summary: string;
  coverage: string[];
};

const form4Outlines: Form4TopicOutline[] = [
  {
    topic: 'Real Numbers',
    summary: 'Form 4 real numbers focuses on surds, irrational numbers, and practical applications of real-number operations.',
    coverage: [
      'Irrational numbers (surds)',
      'Rational vs irrational numbers',
      'Operations involving surds',
      'Number patterns and sequences',
      'Order of operations review',
      'Applications of real numbers in problems',
    ],
  },
  {
    topic: 'Approximation and Accuracy',
    summary: 'Form 4 approximation and accuracy develops precision through rounding, bounds, and error intervals.',
    coverage: [
      'Significant figures',
      'Decimal places',
      'Upper and lower limits of accuracy',
      'Error intervals',
      'Estimation in real-life contexts',
    ],
  },
  {
    topic: 'Ratios, Rates and Proportions',
    summary: 'This topic strengthens proportional reasoning for direct, inverse, and rate-based applications.',
    coverage: [
      'Ratios and rates',
      'Direct proportion',
      'Inverse proportion',
      'Applications in speed, density, and work',
      'Word problems involving proportionality',
    ],
  },
  {
    topic: 'Financial Mathematics',
    summary: 'Financial mathematics in Form 4 covers core personal and commercial finance calculations used in exams and life.',
    coverage: [
      'Simple interest',
      'Compound interest',
      'Hire purchase',
      'Commission',
      'Banking and bank statements',
      'Foreign exchange',
      'PAYE (income tax)',
      'VAT, customs, and excise duty',
    ],
  },
  {
    topic: 'Measures and Mensuration',
    summary: 'This topic extends area, surface area, volume, and density into more advanced and practical contexts.',
    coverage: [
      'Area of similar shapes',
      'Surface area of solids',
      'Volume of prisms, cylinders, cones, and pyramids',
      'Density',
      'Practical applications of mensuration',
    ],
  },
  {
    topic: 'Graphs (Advanced Graphs)',
    summary: 'Advanced graph work includes interpreting and sketching linear, quadratic, cubic, and inverse relationships.',
    coverage: [
      'Linear graphs revision',
      'Quadratic graphs',
      'Cubic graphs',
      'Inverse graphs',
      'Interpretation of graphs',
    ],
  },
  {
    topic: 'Travel Graphs',
    summary: 'Travel graphs connect motion concepts with gradient and area interpretation on common kinematics graphs.',
    coverage: [
      'Speed-time graphs',
      'Velocity-time graphs',
      'Displacement-time graphs',
      'Area under graphs',
      'Gradient interpretation',
    ],
  },
  {
    topic: 'Variation',
    summary: 'Variation formalizes relationships between variables through algebraic equations and contextual problem solving.',
    coverage: [
      'Joint variation',
      'Partial variation',
      'Forming equations from variation statements',
      'Solving variation problems',
    ],
  },
  {
    topic: 'Algebraic Expressions',
    summary: 'Algebraic expressions in Form 4 emphasize manipulation of advanced expressions and preparation for quadratics.',
    coverage: [
      'Algebraic fractions',
      'Quadratic expressions',
      'Advanced factorisation',
      'Completing the square',
      'Expansion and simplification',
    ],
  },
  {
    topic: 'Quadratic Equations',
    summary: 'Quadratic equations are solved using multiple methods, with emphasis on roots and applications.',
    coverage: [
      'Solving by factorisation',
      'Completing the square',
      'Quadratic formula',
      'Nature of roots',
      'Applications of quadratic equations',
    ],
  },
  {
    topic: 'Simultaneous Equations',
    summary: 'Simultaneous equations include linear systems and mixed linear-quadratic systems in both algebraic and graphical forms.',
    coverage: [
      'Solving linear simultaneous equations',
      'Solving linear and quadratic simultaneous equations',
      'Graphical solutions',
      'Applications in word problems',
    ],
  },
  {
    topic: 'Change of Subject of Formulae',
    summary: 'This topic focuses on formula rearrangement skills needed across mathematics and science contexts.',
    coverage: [
      'Rearranging formulae',
      'Subject extraction',
      'Fractional and complex formulae',
      'Applications in science-based problems',
    ],
  },
  {
    topic: 'Inequalities',
    summary: 'Inequalities are developed from one-variable forms to graphing and linear programming applications.',
    coverage: [
      'Linear inequalities',
      'Simultaneous inequalities',
      'Graphs of inequalities',
      'Linear programming',
      'Real-life applications',
    ],
  },
  {
    topic: 'Indices',
    summary: 'Indices consolidates laws of powers and applies them in algebraic simplification and equation solving.',
    coverage: [
      'Laws of indices',
      'Indices involving algebraic terms',
      'Zero and negative indices',
      'Solving equations involving indices',
    ],
  },
  {
    topic: 'Logarithms',
    summary: 'Logarithms extends index work and supports equation solving and practical mathematical modeling.',
    coverage: [
      'Laws of logarithms',
      'Logarithmic equations',
      'Relationship between indices and logarithms',
      'Applications of logarithms',
    ],
  },
  {
    topic: 'Geometry: Angles and Bearings',
    summary: 'Angles and bearings combines geometrical direction work with trig-based interpretation in real contexts.',
    coverage: [
      'Angles of elevation and depression',
      'Three-figure bearings',
      'Compass bearings',
      'Problem solving using bearings',
    ],
  },
  {
    topic: 'Polygons and Circles',
    summary: 'This topic combines polygon angle properties and circle theorem reasoning, including proofs.',
    coverage: [
      'Angle properties of polygons',
      'Number of sides of polygons',
      'Circle theorems',
      'Proofs involving circle theorems',
    ],
  },
  {
    topic: 'Similarity and Congruency',
    summary: 'Similarity and congruency links geometric scaling and equality relationships with ratio applications.',
    coverage: [
      'Similar figures',
      'Congruent figures',
      'Area, volume, and mass ratios',
      'Scale factors',
    ],
  },
  {
    topic: 'Constructions and Loci',
    summary: 'Constructions and loci builds precision drawing skills and interpretation of geometric regions from conditions.',
    coverage: [
      'Construction of diagrams to scale',
      'Loci definitions',
      'Loci problems in real contexts',
      'Accurate geometrical constructions',
    ],
  },
  {
    topic: 'Trigonometry',
    summary: 'Form 4 trigonometry extends right-triangle work into sine and cosine rules for non-right triangles.',
    coverage: [
      'Trigonometric ratios',
      'Sine rule',
      'Cosine rule',
      'Trigonometric problems in triangles',
      'Applications in bearings and heights',
    ],
  },
  {
    topic: 'Matrices',
    summary: 'Matrices introduces matrix algebra, determinants, inverses, and applications to solving equation systems.',
    coverage: [
      'Matrix multiplication',
      'Determinants',
      'Singular and non-singular matrices',
      'Inverse matrices',
      'Solving simultaneous equations using matrices',
    ],
  },
  {
    topic: 'Vectors',
    summary: 'Vectors develops vector operations and their use in geometric relationships on the plane.',
    coverage: [
      'Vector magnitude',
      'Vector addition and subtraction',
      'Scalar multiplication',
      'Vector properties of plane shapes',
      'Applications in geometry',
    ],
  },
  {
    topic: 'Probability',
    summary: 'Probability in Form 4 covers single and combined events with trees and event relationships.',
    coverage: [
      'Theoretical probability',
      'Combined events',
      'Probability trees',
      'Mutually exclusive events',
      'Applications of probability in real life',
    ],
  },
];

function toMarkdownList(items: string[]): string {
  return items.map((item) => `- ${item}`).join('\n');
}

function buildForm4Note(outline: Form4TopicOutline): MathTopicNotes {
  return {
    topic: outline.topic,
    subject: 'Mathematics',
    grade_level: 'O-Level Form 4',
    summary: outline.summary,
    sections: [
      {
        title: 'Syllabus Coverage Outline',
        content: `## What this topic covers\n\n${toMarkdownList(outline.coverage)}\n\n## Next update\n\nDetailed textbook-style notes, worked examples, and exam drills for this topic can now be added under this structure.`,
      },
    ],
    key_points: outline.coverage.slice(0, 6),
    exam_tips: [
      `Master the full checklist for ${outline.topic} before timed practice.`,
      'Show full method and intermediate working for method marks.',
      'Practice mixed past-paper questions to improve topic transfer.',
      'After each question, identify the exact sub-skill tested.',
    ],
    visual_descriptions: [
      `Coverage checklist diagram for ${outline.topic}`,
      'Worked-solution flow from concept to final answer',
      'Exam-style prompt breakdown with command words and mark focus',
    ],
  };
}

const approximationAndAccuracyMasterNotes: MathTopicNotes = {
  topic: 'Approximation and Accuracy',
  subject: 'Mathematics',
  grade_level: 'O-Level Form 4',
  summary:
    'Master note on rounding, significant figures, estimation, bounds, error intervals, and real-world applications, fully formatted for LaTeX math rendering.',
  sections: [
    {
      title: '1) Foundations of Numerical Precision',
      videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%204/Approximation_%26_Estimation.mp4',
      content: String.raw`Approximation is a strategic tool for handling numerical complexity in real contexts.

Precision depends on context:
- Consumer arithmetic may require rounding to the nearest cent.
- Manufacturing and engineering require strict limits of measurement.

### Rounding Numbers
- Decimal Places (DP): precision based on digits after the decimal point.
- Significant Figures (SF): precision based on meaningful digits.
- Nearest Whole Number: rounding to nearest integer, ten, hundred, etc.

### Step-by-step method
1. Identify the target digit at the required degree of accuracy.
2. Inspect the digit immediately to its right.
3. Decide:
   - If right digit is $5$ or greater, round up.
   - If right digit is less than $5$, keep target digit unchanged.
4. Finalize:
   - For decimals: drop digits to the right.
   - For whole numbers: replace dropped places with zeros.

### Worked examples (1-8)
1. $4.9839$ to $2$ DP: target $8$, right digit $3<5$ so $4.9839 \approx 4.98$.
2. $0.8511$ to $2$ DP: target $5$, right digit $1<5$ so $0.8511 \approx 0.85$.
3. $12.676$ to $1$ DP: target $6$, right digit $7\geq 5$ so $12.676 \approx 12.7$.
4. $\$15.25$ nearest dollar: units digit $5$, tenths digit $2<5$ so nearest dollar is $\$15$.
5. $0.00456$ to $2$ DP: $0.00456 \approx 0.00$.
6. $0.00456$ to $2$ SF: second SF is $5$, next digit $6\geq 5$ so $0.00456 \approx 0.0046$.
7. $3248$ nearest $100$: $3248 \approx 3200$.
8. $6.7869$ to $3$ SF: $6.7869 \approx 6.79$.

Key distinction:
- DP is fixed from the decimal point.
- SF starts from the first non-zero digit.`,
    },
    {
      title: '2) Mechanics of Significant Figures',
      content: String.raw`Significant figures reflect the reliability of measured data.

### Identification rules
- Non-zero digits are always significant.
- Zeros between non-zero digits are significant.
- Leading zeros are not significant.
- Trailing zeros are significant only if a decimal point is shown.

Examples:
- $136$ has $3$ SF.
- $10.05$ has $4$ SF.
- $0.0045$ has $2$ SF.
- $15.00$ has $4$ SF, while $1500$ is typically treated as $2$ SF (unless otherwise specified).

### Worked examples (9-16)
1. $0.021877$ has $5$ SF.
2. $2910$ to $1$ SF gives $3000$.
3. $50.0$ has $3$ SF.
4. $0.8511$ to $1$ SF gives $0.9$.
5. $3058$ to $2$ SF gives $3100$.
6. $0.0006$ has $1$ SF.
7. $\$558.91$ to $3$ SF gives $\$559$.
8. $12676$ to $2$ SF gives $13000$.

Common error:
- Wrong: $0.0045$ to $1$ SF is $0.0$.
- Correct: $0.0045$ to $1$ SF is $0.005$.

### Practice exercise 1: SF identification
State the number of SF in:
1. $165$  2. $0.7660$  3. $41.71$  4. $0.05$  5. $3.00$
6. $0.002$  7. $100$  8. $10.50$  9. $0.021$  10. $6.0$`,
    },
    {
      title: '3) Strategic Estimation in Calculations',
      content: String.raw`Estimation is a fast reasonableness check before or after calculator work.

### Worked examples (17-24)
Round terms to about $1$ SF:
1. $43.2 \times 0.059 \approx 40 \times 0.06 = 2.4$.
2. $\frac{43.2 \times 0.059}{1.87} \approx \frac{40 \times 0.06}{2}=1.2$.
3. $165 \div 4.40 \approx 200 \div 4 = 50$.
4. $1360 \times 0.03 \approx 1000 \times 0.03=30$.
5. $\sqrt{0.8511}\approx \sqrt{0.9}\approx 0.95$.
6. $3037.50-2464.50\approx 3000-2000=1000$.
7. $4\pi \times 10^3 \div 52 \approx (4\times 3\times 1000)\div 50=240$.
8. $3.00\times 4.1 + 11.9 \approx 3\times 4 + 10=22$.

### Practice exercise 2
Estimate:
1. $\frac{15.25+35.00}{1.15}$
2. $2650\times 0.07$
3. $\frac{12.20\times 4}{0.8}$
4. $\sqrt{165}$
5. $3.10\times 12.05$`,
    },
    {
      title: '4) Theory of Upper and Lower Bounds',
      content: String.raw`Measured values represent an interval of possible true values.

For a measurement recorded to a unit of accuracy $u$:
- Lower bound (LB): measured value $-\frac{u}{2}$
- Upper bound (UB): measured value $+\frac{u}{2}$
- Interval notation: $\text{LB} \leq x < \text{UB}$

### Worked examples (25-32)
1. $h=15\text{ mm}$ nearest mm: $14.5 \leq h < 15.5$.
2. $m=10\text{ kg}$ nearest $10$: $5 \leq m < 15$.
3. $p=\$15.25$ nearest cent: $15.245 \leq p < 15.255$.
4. $l=12\text{ cm}$ nearest cm: $11.5 \leq l < 12.5$.
5. $w=8\text{ cm}$ nearest cm: $7.5 \leq w < 8.5$.
6. $v=0.8660$ to $4$ DP: $0.86595 \leq v < 0.86605$.
7. $x=4.9839$ to $4$ DP: $4.98385 \leq x < 4.98395$.
8. $f=50$ nearest $10$: $45 \leq f < 55$.

Common error:
- Wrong: $14.5 \leq h \leq 15.5$
- Correct: $14.5 \leq h < 15.5$`,
    },
    {
      title: '5) Arithmetic Operations with Bounds',
      content: String.raw`For non-negative quantities:

- Maximum addition: $\text{UB}_1 + \text{UB}_2$
- Minimum addition: $\text{LB}_1 + \text{LB}_2$
- Maximum subtraction: $\text{UB}_1 - \text{LB}_2$
- Minimum subtraction: $\text{LB}_1 - \text{UB}_2$
- Maximum multiplication: $\text{UB}_1 \times \text{UB}_2$
- Minimum multiplication: $\text{LB}_1 \times \text{LB}_2$
- Maximum division: $\text{UB}_1 \div \text{LB}_2$
- Minimum division: $\text{LB}_1 \div \text{UB}_2$

### Worked examples (33-40)
1. $x=5, y=10$ nearest unit. Max $(x+y)=5.5+10.5=16$.
2. $P_1=\$2650, P_2=\$2464.50$ nearest cent. Max difference $=2650.005-2464.495=185.51$.
3. $v=100\text{ m}, t=20\text{ s}$ nearest unit. Max speed $=100.5/19.5\approx 5.15\text{ m/s}$.
4. $x=50, y=5$ nearest unit. Min $(x/y)=49.5/5.5=9$.
5. Rectangle $12\text{ cm}$ by $8\text{ cm}$ nearest cm. Min area $=11.5\times 7.5=86.25\text{ cm}^2$.
6. $a=20,b=5$ nearest unit. Min $(a-b)=19.5-5.5=14$.
7. $3.1$ by $12.0$ to $1$ DP. Max product $=3.15\times 12.05=37.9575$.
8. $\frac{a}{b-c}$ with $a=10,b=5,c=2$ nearest unit.
   Max numerator $=10.5$; min denominator $=(4.5-2.5)=2.0$; max value $=10.5/2.0=5.25$.

### Practice exercise 3
1. Maximum perimeter of a square with side $5\text{ cm}$ nearest cm.
2. Minimum area of a rectangle with sides $10.5\text{ m}$ and $6.2\text{ m}$ (1 DP).
3. Wire $100\text{ cm}$ nearest $10$, cut into $4$ equal pieces: max piece length.
4. Minimum possible value of $x-y$ if $x=58,y=22$ nearest unit.
5. Field $50\text{ m}$ by $40\text{ m}$ nearest $5\text{ m}$: maximum area.
6. Tank $500$ L nearest $10$, removes $120$ L nearest $10$: minimum remaining.`,
    },
    {
      title: '6) Quantifying Uncertainty: Error Intervals',
      content: String.raw`Definitions:
- Absolute error $= \frac{1}{2}\times (\text{unit of accuracy})$
- Relative error $= \frac{\text{absolute error}}{\text{measured value}}$

### Worked examples (41-48)
1. $12.4\text{ cm}$ (1 DP): absolute error $=0.05\text{ cm}$.
2. Meter reading $021877$ nearest unit: absolute error $=0.5$.
3. $50\text{ kg}$ nearest kg: absolute error $=0.5\text{ kg}$.
4. $1360\text{ km}$ nearest $10$: absolute error $=5\text{ km}$.
5. Relative error for $50\text{ kg}$ nearest kg: $0.5/50=0.01=1\%$.
6. Instrument to $0.001$: absolute error $=0.0005$.
7. $20.0\text{ s}$ (1 DP): absolute error $=0.05\text{ s}$.
8. $500\text{ ml}$ nearest $50$: absolute error $=25\text{ ml}$.

Common error:
- Error is uncertainty from true value.
- Difference is arithmetic subtraction between values.`,
    },
    {
      title: '7) Practical Applications in Measurement',
      content: String.raw`1. Container: total $2000\text{ ml}$ nearest $100$, poured $500\text{ ml}$ nearest $10$.
   Min remaining $=1950-505=1445\text{ ml}$.
2. Bridge safety: limit $5000\text{ kg}$ nearest $100$, truck $4900\text{ kg}$ nearest $50$.
   $\text{UB}_{truck}=4925$, $\text{LB}_{limit}=4950$, so truck is safe.
3. Circular garden diameter $10\text{ m}$ nearest m.
   Max circumference with $\pi=3.142$: $3.142\times 10.5=32.991\text{ m}$.
4. Five planks each $2\text{ m}$ nearest $0.1$.
   Max total length $=5\times 2.05=10.25\text{ m}$.
5. Net income: gross $\$1360$ nearest $\$10$, deductions $\$185.50$ nearest cent.
   Min net $=1355-185.505=1169.495\approx \$1169.50$.
6. Tiling:
   Max floor area $=5.05\times 4.05=20.4525$,
   Min tile area $=0.495\times 0.495=0.245025$,
   Max tiles $=20.4525/0.245025\approx 83.47 \Rightarrow 84$ tiles.
7. Speeding check:
   Max speed $=100.5/1.15\approx 87.39\text{ km/h}$.
8. Gum-tree growth:
   Min height after $10$ years nearest year and growth $1.5\text{ m}$ (1 DP):
   $1.45\times 9.5=13.775\approx 13.78\text{ m}$.`,
    },
    {
      title: '8) Comprehensive Assessment Suite + Memo',
      content: String.raw`### Mixed revision (40 items)
1. Round $0.7660$ to $2$ SF.
2. Identify SF in $0.05$.
3. Round $4.9839$ to $3$ DP.
4. Estimate $15.25\times 3.9$.
5. Find LB of $\$165$ (nearest $\$5$).
6. A gum-tree height is $15.4\text{ m}$ (1 DP). State error interval.
7. Identify SF in $10.50$.
8. Round $3248$ to $2$ SF.
9. Estimate $\sqrt{165}$.
10. Find UB of $0.8511$ (4 DP).
11. Express $14.5 \leq x < 15.5$ in words.
12. Calculate absolute error for $6.8\text{ m}$.
13. Find max area of $6\text{ cm}$ by $4\text{ cm}$ rectangle (nearest cm).
14. Estimate $1360 \div 0.07$.
15. If $y=10$ nearest unit, find LB of $y^2$.
16. Find relative error of $10\text{ kg}$ nearest kg.
17. Identify SF in $0.002$.
18. Round $0.8511$ to $1$ SF.
19. Find min $a-b$ if $a=50,b=20$ nearest $10$.
20. Calculate max $x/y$ if $x=20,y=5$ nearest unit.
21. Round $\$2464.50$ to nearest $\$10$.
22. Round $0.021877$ to $3$ SF.
23. Find UB of $12\text{ cm}$ nearest cm.
24. Estimate $\frac{43.2}{1.87}$.
25. State accuracy of $15.25$.
26. If $x=4$ nearest unit, state interval.
27. Round $12676$ to $1$ SF.
28. Find min perimeter of $10\text{ m}$ square nearest m.
29. Estimate $4\pi \times 30^2$.
30. Find max volume of $2\text{ m}$ cube nearest $0.1\text{ m}$.
31. Identify SF in $100$.
32. Round $4.9839$ to $2$ SF.
33. Find absolute error of $0.1$ measurement.
34. Find max $a+b$ if $a=1.2,b=3.4$ (1 DP).
35. Estimate $165\times 44$.
36. Find min $x/y$ if $x=100,y=10$ nearest $10$.
37. Round $0.00456$ to $3$ DP.
38. Identify SF in $6.0$.
39. Find max difference between $\$2650$ and $\$2464$ nearest $\$1$.
40. Round $1360$ to nearest $1000$.

### Structured test (10 items)
1. Rectangle sides $12\text{ cm}$ and $8\text{ cm}$ nearest cm. Determine max perimeter.
2. Evaluate relative error of a $50\text{ kg}$ bag nearest kg.
3. Calculate max value of $\frac{x}{y}$ where $x=100$, $y=2$, nearest unit.
4. Car travels $200\text{ km}$ nearest $10\text{ km}$ in $4$ h nearest h. Find minimum average speed.
5. State error interval for $p=0.8511$ to $4$ DP.
6. Circle radius $5.0\text{ cm}$ (1 DP). Determine max area with $\pi=3.14$.
7. Find minimum possible value of $ab$ if $a=6,b=3$ nearest unit.
8. Analyze whether a $2.5\text{ m}$ car fits a $2.6\text{ m}$ gap, both nearest $0.1\text{ m}$.
9. Calculate absolute error for meter reading $021877$ nearest unit.
10. Determine max difference between $15.25$ and $12.20$ nearest $0.05$.

### Memo snapshot
- Ex 1 answers: $3,4,4,1,3,1,1,4,2,2$.
- Ex 2 sample: $\frac{20+40}{1}=60$, $3000\times 0.07=210$, $\frac{12\times 4}{0.8}=60$, $\sqrt{100}=10$, $3\times 12=36$.
- Ex 3 sample: $4\times 5.5=22$, $10.45\times 6.15=64.2675$, $105/4=26.25$, $57.5-22.5=35$, $52.5\times 42.5=2231.25$, $495-125=370$.
- Mixed revision selected answers:
  $0.77,1,4.984,60,162.5,15.35\leq h<15.45,4,3200,13,0.85115,0.05,29.25,10000,90.25,0.05,1,0.9,20,4.56,2460,0.0219,12.5,\pm 0.005,3.5\leq x<4.5,10000,38,10800,8.615,1,5.0,0.05,4.7,8000,6.33,0.005,2,187,1000$.
- Structured test key:
  1) $42\text{ cm}$
  2) $0.5/50=0.01$
  3) $100.5/1.5=67$
  4) $195/4.5=43.33\text{ km/h}$
  5) $0.85105\leq p<0.85115$
  6) $3.14\times 5.05^2=80.08\text{ cm}^2$
  7) $5.5\times 2.5=13.75$
  8) Critical fit
  9) $0.5$
  10) $15.275-12.175=3.10$`,
    },
  ],
  key_points: [
    'Use DP for place-based rounding and SF for reliability-based rounding.',
    'Bounds are written as LB <= value < UB.',
    'Absolute error is half the rounding unit.',
    'Relative error equals absolute error divided by measured value.',
    'For max and min in operations, pair bounds in the correct direction.',
    'Always estimate to sanity-check calculator results.',
  ],
  exam_tips: [
    'State the rounding target clearly before computing.',
    'In bounds questions, write interval notation explicitly.',
    'For subtraction and division bounds, use inverse pairing (UB-LB or UB/LB).',
    'Show all bound substitutions before final answer to secure method marks.',
  ],
  visual_descriptions: [
    'Rounding decision tree showing inspect-and-decide step',
    'Bounds matrix for max/min in +, -, x, and / operations',
    'Error interval number-line diagrams with open upper bound',
  ],
};

const measuresAndMensurationMasterNotes: MathTopicNotes = {
  topic: 'Measures and Mensuration',
  subject: 'Mathematics',
  grade_level: 'O-Level Form 4',
  summary:
    'Comprehensive Form 4 mensuration notes covering unit foundations, plane figures, composite areas, surface area, volume, practical applications, synthesis problems, and assessment.',
  sections: [
    {
      title: '1) Introduction to Mensuration and Unit Foundations',
      videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%204/Mastering_Mensuration.mp4',
      content: String.raw`Mensuration studies measurement of geometric quantities: length, area, and volume.

Core terms:
- Perimeter: total boundary length of a closed 2D figure.
- Area: enclosed 2D space.
- Volume: occupied 3D space.

### Unit foundations
- If $1\text{ m} = 100\text{ cm}$, then
  $1\text{ m}^2 = 100^2\text{ cm}^2 = 10{,}000\text{ cm}^2$.
- Also,
  $1\text{ m}^3 = 100^3\text{ cm}^3 = 1{,}000{,}000\text{ cm}^3$.

Common error:
- Do not use linear conversion for area/volume.
- Area uses squared factor, volume uses cubed factor.`,
    },
    {
      title: '2) Perimeter and Area of Plane Figures',
      content: String.raw`In scaling, area varies with the square of linear scale:
$A \propto l^2$.

### Core formulas
- Rectangle: $A=lw$, $P=2(l+w)$
- Square: $A=s^2$, $P=4s$
- Triangle: $A=\frac{1}{2}bh$
- Parallelogram: $A=bh$
- Trapezium: $A=\frac{1}{2}(a+b)h$
- Circle: $A=\pi r^2$, $C=2\pi r=\pi D$

Hint:
- Check whether diameter or radius is provided.
- Use $r=\frac{D}{2}$ when needed.

### Worked examples (selected)
1. Rectangle $15\text{ cm}\times 7\text{ cm}$:
   $A=15\times 7=105\text{ cm}^2$.
2. Square side $8.4\text{ cm}$:
   $P=4(8.4)=33.6\text{ cm}$.
3. Rectangle with $A=96\text{ cm}^2$, $l=12\text{ cm}$:
   $w=\frac{96}{12}=8\text{ cm}$.
4. Square with $A=144\text{ cm}^2$:
   $s=\sqrt{144}=12\text{ cm}$.
5. Rectangle with $P=40\text{ cm}$ and $w=8\text{ cm}$:
   $l=\frac{P}{2}-w=20-8=12\text{ cm}$.
6. Square with perimeter $20\text{ cm}$:
   $s=5\text{ cm}$ and $A=25\text{ cm}^2$.
7. Triangle $b=12\text{ cm}, h=9\text{ cm}$:
   $A=\frac{1}{2}(12)(9)=54\text{ cm}^2$.
8. Triangle $A=30\text{ cm}^2, b=10\text{ cm}$:
   $h=\frac{2A}{b}=6\text{ cm}$.
9. Parallelogram $b=14\text{ cm}, h=5\text{ cm}$:
   $A=70\text{ cm}^2$.
10. Parallelogram $A=120\text{ cm}^2, h=8\text{ cm}$:
   $b=\frac{120}{8}=15\text{ cm}$.
11. Right triangle $(3,4,5)$:
   $A=\frac{1}{2}(3)(4)=6\text{ cm}^2$.
12. If parallelogram area is $50\text{ cm}^2$ and base is $2h$:
   $50=2h^2 \Rightarrow h=5\text{ cm}$.
13. Trapezium $a=6,b=10,h=5$:
   $A=\frac{1}{2}(16)(5)=40\text{ cm}^2$.
14. Trapezium with $A=60, a=8,b=12$:
   $h=\frac{2A}{a+b}=\frac{120}{20}=6\text{ cm}$.
15. Circle radius $7\text{ cm}$, $\pi=\frac{22}{7}$:
   $A=\frac{22}{7}\times 7^2=154\text{ cm}^2$.
16. Circle diameter $14\text{ cm}$:
   $C=\pi D=\frac{22}{7}\times 14=44\text{ cm}$.
17. Circle circumference $88\text{ cm}$:
   $r=\frac{C}{2\pi}=14\text{ cm}$.
18. Semi-circle diameter $20\text{ cm}$:
   $A=\frac{1}{2}\pi r^2=157.1\text{ cm}^2$ (using $\pi=3.142$).`,
    },
    {
      title: '3) Analysis of Composite Areas',
      content: String.raw`Irregular regions are solved by decomposition.

Methods:
1. Additive: sum known sub-areas.
2. Subtractive: outer area minus cut-out area.

### Worked examples
1. Rectangle $10\times 6$ plus triangle $(b=6,h=4)$:
   $60+\frac{1}{2}(6)(4)=72\text{ cm}^2$.
2. Square side $10$ minus inner circle $r=3$:
   $100-\pi(3)^2 \approx 71.73\text{ cm}^2$.
3. Rectangle $20\times 15$ with inner path width $2$:
   Outer $=300$, inner $=16\times 11=176$, path $=124\text{ m}^2$.
4. Window: rectangle $2\times 1$ plus semi-circle diameter $1$:
   $2+\frac{1}{2}\pi(0.5)^2 \approx 2.39\text{ m}^2$.
5. Rectangle $8\times 5$ with one $5$ cm side replaced by semicircle:
   $8+5+8+\frac{1}{2}\pi(5)\approx 28.85\text{ cm}$.
6. L-shape from rectangles $4\times 3$ and $6\times 2$:
   $12+12=24\text{ m}^2$.

Common error:
- Do not count interior joining edges in composite perimeter.`,
    },
    {
      title: '4) Surface Area of Solids',
      content: String.raw`### Formulas
- Cube: $SA=6s^2$
- Cuboid: $SA=2(lw+lh+wh)$
- Cylinder (total): $SA=2\pi r^2+2\pi rh=2\pi r(r+h)$
- Sphere: $SA=4\pi r^2$
- Cone (total): $SA=\pi r^2+\pi rl$

Hint:
- Curved surface area of cylinder is $2\pi rh$.
- Add or remove circular bases based on context (open/closed solid).

### Worked examples
1. Cube side $5\text{ cm}$:
   $SA=6(5^2)=150\text{ cm}^2$.
2. Cuboid $l=10,w=4,h=3$:
   $SA=2(40+30+12)=164\text{ cm}^2$.
3. Cuboid square base $4$ and height $10$:
   $SA=2(4\times 4)+4(4\times 10)=192\text{ cm}^2$.
4. Cylinder $r=7,h=10$, $\pi=\frac{22}{7}$:
   $SA=2\pi r(r+h)=748\text{ cm}^2$.
5. Sphere $r=3$:
   $SA=4\pi r^2=113.11\text{ cm}^2$ (using $\pi=3.142$).
6. Cone $r=6,l=10$:
   $SA=\pi r^2+\pi rl=96\pi \approx 301.59\text{ cm}^2$.`,
    },
    {
      title: '5) Volume of Solids',
      content: String.raw`### Formulas
- Cube: $V=s^3$
- Cuboid: $V=lwh$
- Cylinder: $V=\pi r^2 h$
- Cone: $V=\frac{1}{3}\pi r^2 h$
- Sphere: $V=\frac{4}{3}\pi r^3$

Common error:
- In sphere volume, cube the radius ($r^3$), do not square it.

### Worked examples
1. Cylinder $r=10,h=15$:
   $V=\pi(10)^2(15)=1500\pi\approx 4712.39\text{ cm}^3$.
2. Sphere diameter $12$:
   $r=6$, so $V=\frac{4}{3}\pi(6)^3\approx 904.90\text{ cm}^3$.
3. Cone $r=3,h=7$:
   $V=\frac{1}{3}\pi(3)^2(7)=21\pi\approx 65.97\text{ cm}^3$.
4. Cuboid with $V=240$, $l=10$, $w=6$:
   $h=\frac{240}{10\times 6}=4\text{ cm}$.
5. Tank $2\text{ m}\times 1\text{ m}\times 1.5\text{ m}$:
   $V=3\text{ m}^3=3000\text{ L}$.
6. Cube with total surface area $600\text{ cm}^2$:
   $6s^2=600\Rightarrow s=10$, so $V=10^3=1000\text{ cm}^3$.

### Maths Meter practice
1. Volume of cube side $4\text{ cm}$.
2. Volume of sphere $r=2\text{ cm}$.
3. Cylinder with $V=154\text{ cm}^3$ and $r=7\text{ cm}$, find $h$.
4. Total surface area of cube side $2.5\text{ cm}$.
5. Convert $2$ liters to $\text{cm}^3$.`,
    },
    {
      title: '6) Practical Applications of Mensuration',
      content: String.raw`1. Water tank logistics:
   Cylindrical tank $r=1\text{ m}, h=2\text{ m}$.
   $V=\pi r^2h=6.283\text{ m}^3=6283.18\text{ L}$.
   At $20\text{ L/min}$, time $=\frac{6283.18}{20}=314.16\text{ min}$.

2. Industrial painting:
   Room $5\times 4\times 3$ with door $2\times 1$.
   Wall area $=2(5\times 3+4\times 3)=54\text{ m}^2$.
   Net area $=54-2=52\text{ m}^2$.
   If $1$ L covers $10\text{ m}^2$, paint needed $=5.2$ L.

3. Metal casting:
   Sphere $r=6\text{ cm}$ melted into cylinder $r=3\text{ cm}$.
   $\frac{4}{3}\pi(6)^3=\pi(3)^2h$ gives $h\approx 32\text{ cm}$.

These methods generalize to roofing, dam capacity, and density-linked applications.`,
    },
    {
      title: '7) Combined Mensuration Problems (Synthesis)',
      content: String.raw`1. Sphere volume from cube surface area:
   Cube side $12\text{ cm}$ gives $SA=6(12^2)=864\text{ cm}^2$.
   Set sphere area equal: $4\pi r^2=864$.
   Then $r^2=\frac{216}{\pi}$ and $r\approx 8.29\text{ cm}$.
   Volume $=\frac{4}{3}\pi r^3 \approx 2384.5\text{ cm}^3$.

2. Cone and cylinder with same radius and equal volume:
   $\frac{1}{3}\pi r^2 h_{cone}=\pi r^2 h_{cyl}$
   $\Rightarrow h_{cone}:h_{cyl}=3:1$.`,
    },
    {
      title: '8) Comprehensive Assessment and Memo',
      content: String.raw`### Mixed revision (35 items)
1. Convert $0.5\text{ m}^2$ to $\text{cm}^2$.
2. Area of rectangle $L=12, W=5$.
3. Perimeter of square $s=7.2$.
4. Circumference of circle $D=21$.
5. Area of circle $r=10$.
6. Volume of cube $s=6$.
7. Surface area of cube $s=3$.
8. Volume of cuboid $10\times 5\times 2$.
9. Surface area of cuboid $4\times 3\times 2$.
10. Volume of cylinder $r=7, h=10$.
11. Surface area of cylinder $r=7, h=10$.
12. Volume of sphere $r=3$.
13. Surface area of sphere $D=20$.
14. Volume of cone $r=5, h=12$.
15. Slant height of cone if $r=3, h=4$.
16. Area of triangle $b=15, h=6$.
17. Area of parallelogram $b=8, h=12$.
18. Area of trapezium $a=5, b=9, h=4$.
19. Radius of circle with area $154$.
20. Side of square with area $225$.
21. Perimeter of rectangle $L=15, W=10$.
22. Convert $2$ L to $\text{cm}^3$.
23. Area of semicircle $r=7$.
24. Perimeter of semicircle $r=7$.
25. Volume of cylinder $r=1, h=1$.
26. Area of a path $1\text{ m}$ wide around a $10\times 10$ square.
27. Cost of painting $100\text{ m}^2$ at $\$2/\text{m}^2$.
28. Radius of sphere with $SA=12.56$.
29. Height of triangle with area $20$, base $5$.
30. Parallel side $b$ of trapezium if $A=20, a=4, h=4$.
31. Circumference of circle with area $616$.
32. Volume of hemisphere $r=3$.
33. Total surface area of hemisphere $r=3$.
34. Ratio of area of squares with sides $2$ and $4$.
35. Diagonal of rectangle $3\times 4$.

### Structured test (5 items)
1. Cube $s=10\text{ cm}$ melted into $1000$ identical spheres; find sphere radius.
2. Cylindrical pipe $r=2\text{ cm}, L=50\text{ cm}$, open both ends; find plated area.
3. Cost to fill cone pit $r=3\text{ m}, h=4\text{ m}$ at $\$50/\text{m}^3$.
4. Open box from $20\times 20\text{ cm}$ sheet by cutting $2\text{ cm}$ squares at corners; find volume.
5. Water volume in hemispherical bowl $r=21\text{ cm}$ when half full.

### Memo (selected)
- Rev 1: $0.5\times 10{,}000 = 5{,}000\text{ cm}^2$.
- Rev 10: $\pi(7^2)(10)=1540\text{ cm}^3$ (using $\pi=\frac{22}{7}$).
- Test 1: cube volume $=1000\text{ cm}^3$ so each sphere has $1\text{ cm}^3$.
  $\frac{4}{3}\pi r^3=1 \Rightarrow r\approx 0.62\text{ cm}$.
- Test 2: plating area (inner+outer curved) $=400\pi \approx 1256.6\text{ cm}^2$.`,
    },
  ],
  key_points: [
    'Always keep units consistent before substitution.',
    'Area scales with square of length; volume scales with cube of length.',
    'Composite area problems need clear decomposition strategy.',
    'Differentiate curved and total surface area in cylinders and cones.',
    'Convert between m^3 and liters using 1 m^3 = 1000 L.',
    'For multi-stage applications, show each conversion step explicitly.',
  ],
  exam_tips: [
    'Write formula first, then substitute values with units.',
    'For circles and cylinders, confirm whether radius or diameter is given.',
    'In composite perimeter, include only the outer boundary.',
    'Round final answers appropriately, but keep intermediate values unrounded.',
  ],
  visual_descriptions: [
    'Formula map linking 2D and 3D mensuration quantities',
    'Composite-shape decomposition sketch with additive/subtractive labeling',
    'Cylinder and cone surface area net diagrams',
  ],
};

const functionalGraphsMasterNotes: MathTopicNotes = {
  topic: 'Graphs (Advanced Graphs)',
  subject: 'Mathematics',
  grade_level: 'O-Level Form 4',
  summary:
    'Comprehensive notes on functional graphs: function basics, linear and quadratic models, graphical solving, transformations, and real-world applications.',
  sections: [
    {
      title: '1) Fundamental Concept of a Function',
      videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%204/Functional_Graphs.mp4',
      content: String.raw`A function models how one quantity changes in response to another.

Definition:
- A function maps each input in the domain to exactly one output in the range.
- Notation: $f(x)$.

Variable roles:
- Independent variable: controlled/input quantity.
- Dependent variable: resulting/output quantity.

### Worked examples: substitution method
1. If $f(x)=2x-5$, then $f(3)=2(3)-5=1$.
2. If $f(x)=10+4x$, then $f(-2)=10+4(-2)=2$.
3. If $C(x)=50+5x$, then $C(0)=50$.
4. If $H(t)=1.5t$, then $H(5)=7.5$.
5. If $T(m)=12-0.5m$, then $T(10)=7$.
6. If $f(x)=x^2$, then $f(4)=16$.
7. If $f(x)=4x+3$, then $f\!\left(\frac{1}{2}\right)=5$.
8. If $f(x)=-2x+1$, then $f(-3)=7$.

### Maths Meter practice
1. Evaluate $f(5)$ for $f(x)=3x+10$.
2. If $f(x)=20-2x$, find $f(8)$.
3. If $H(a)=2a+0.5$, find $H(10)$.
4. Identify the independent variable in a graph of cost versus number of items.`,
    },
    {
      title: '2) Linear Functions and Geometry of y = mx + c',
      content: String.raw`Linear functions have constant rate of change.

General form:
$y=mx+c$

Where:
- $m$ is gradient, $m=\frac{\Delta y}{\Delta x}=\frac{y_2-y_1}{x_2-x_1}$.
- $c$ is y-intercept (value of $y$ when $x=0$).

### Worked examples
1. For $y=2x+1$, at $x=0,1,2$: points are $(0,1),(1,3),(2,5)$.
2. Through $(0,50)$ and $(10,100)$:
   $m=\frac{100-50}{10-0}=5$.
3. In $T=5x+50$, y-intercept is $50$.
4. Through $(-1,5)$ and $(2,-4)$:
   $m=\frac{-4-5}{2-(-1)}=-3$.
5. For $y=-x+4$, points include $(0,4),(2,2),(4,0)$.
6. If $T=5s+50$, then for $s=6$, $T=80$.
7. x-intercept of $y=2x-4$:
   set $y=0$, so $x=2$, point $(2,0)$.
8. Circumference against diameter:
   $C=\pi D \Rightarrow m=\pi, c=0$.

Common errors:
- Wrong sign for gradient on downward lines.
- Confusing x-intercept ($y=0$) with y-intercept ($x=0$).`,
    },
    {
      title: '3) Quadratic Functions and the Parabola',
      content: String.raw`Quadratic form:
$y=ax^2+bx+c$

Properties:
- Shape: parabola.
- Axis of symmetry: $x=\frac{-b}{2a}$.
- Turning point (vertex): where direction changes.

### Worked examples
1. For $y=x^2-4$:
   y-intercept $(0,-4)$;
   x-intercepts from $x^2-4=0 \Rightarrow x=\pm 2$.
2. For $A=6l^2$, if $l=1,2,3$, then $A=6,24,54$.
3. Axis for $y=x^2-4x+3$:
   $x=\frac{-(-4)}{2(1)}=2$.
4. For $y=x^2$, vertex is $(0,0)$.
5. For $y=-x^2+4$, parabola opens downward.
6. For $y=x^2-2x-3$, axis is $x=1$;
   $y(1)=1-2-3=-4$, so vertex $(1,-4)$.
7. $y=x^3$ is a cubic curve, not a parabola.
8. For $y=4x-x^2$, coefficient of $x^2$ is negative, so there is a maximum.

Tip:
- If $a>0$, parabola opens up (minimum).
- If $a<0$, parabola opens down (maximum).`,
    },
    {
      title: '4) Graphical Solutions of Equations',
      content: String.raw`Graphical method finds solutions from intersections.

Process:
1. Plot both relationships on same axes.
2. Read intersection points.
3. For $ax^2+bx+c=0$, roots are x-intercepts of $y=ax^2+bx+c$.

### Worked examples
1. Solve $y=x+1$ and $y=-x+3$:
   intersection $(1,2)$.
2. Solve $x^2-4=0$ graphically:
   roots are $x=\pm 2$.
3. Solve $2x+y=10$ and $x-y=2$:
   intersection $(4,2)$.
4. Solve $x^2-x-2=0$ from graph:
   $x=-1$ and $x=2$.
5. Intersect $y=2x$ and $y=4$:
   $2x=4 \Rightarrow (2,4)$.
6. If root lies halfway between $1$ and $2$ on $0.1$ scale:
   $x\approx 1.5$.
7. Solve $y=x$ and $y=x^2$ for $x>0$:
   $x=1$.
8. Solve $y=3$ and $y=x^2-1$:
   $x^2=4 \Rightarrow x=\pm 2$.

Common error:
- Poor scale selection causes inaccurate intersection readings.`,
    },
    {
      title: '5) Transformations of Functional Graphs',
      content: String.raw`Transformations shift or resize parent graphs.

Types:
- Translation by vector $\begin{pmatrix}a\\b\end{pmatrix}$.
- Enlargement by scale factor $k$.
- Shear with factor
  $\frac{\text{distance moved}}{\text{distance from invariant line}}$.
- Vertical shift in $y=mx+c$ by changing $c$.

### Worked examples
1. Translate $(2,3)$ by $\begin{pmatrix}1\\-2\end{pmatrix}$:
   image is $(3,1)$.
2. From $y=2x$ to $y=2x+5$:
   vertical translation by $\begin{pmatrix}0\\5\end{pmatrix}$.
3. Point $(0,2)$ to $(6,2)$, x-axis invariant:
   shear factor $=\frac{6}{2}=3$.
4. Enlargement $k=2$ of point $5$ units from center:
   new distance $10$ units.
5. $y=x^2-3$ compared to $y=x^2$:
   translated $3$ units downward.
6. If image side is $12$ cm from object side $4$ cm:
   $k=\frac{12}{4}=3$.`,
    },
    {
      title: '6) Practical Applications: Real-World Modeling',
      content: String.raw`### Worked examples
1. Exam fee model:
   Given $(s,T)=(6,80)$ and $(10,100)$,
   $m=\frac{100-80}{10-6}=5$ and $c=80-5(6)=50$.
   So $T=5s+50$.
2. Depreciation:
   Initial value $\$1360$, rate $3\%=0.03$.
   Year 1 value: $1360-1360(0.03)=1319.20$.
   Year 2 loss: $1319.20(0.03)=39.58$.
   Year 2 value: $1279.62$.
3. Circle relation:
   $C\propto D$ and $C=\pi D$, so $\frac{C}{D}\approx 3.14$.
4. Break-even:
   $R=12x,\; C=4x+800$.
   $12x=4x+800 \Rightarrow x=100$ units.
5. Constant speed:
   $d=80t$ gives $d=200$ km at $t=2.5$ h.
6. Profit model:
   $P=15n-500$.
   For $P=0$, $n=\frac{500}{15}=33.33$, so at least $34$ items.
7. Water billing:
   $33.6$c per $\text{m}^3$ for first $15\text{ m}^3$.
   At $10\text{ m}^3$: cost $=336$c $=\$3.36$.
8. Tire wear:
   $T=12-0.5m$.
   After $12$ months: $T=6$ mm.`,
    },
    {
      title: '7) Mixed Revision and Assessment Suite',
      content: String.raw`### Mixed revision (40 items)
1. Define a function using domain and range.
2. Evaluate $f(7)$ for $f(x)=2x+3$.
3. If $f(x)=x^2-x$, find $f(5)$.
4. Identify independent variable in $y=3x+4$.
5. If $H=0.8a+2$, find $H(10)$.
6. Evaluate $f(-1)$ for $f(x)=10-5x$.
7. Evaluate $f(0.5)$ for $f(x)=8x$.
8. If $f(x)=12$, find $f(100)$.
9. Find gradient of $y=3x-5$.
10. Gradient between $(1,2)$ and $(3,10)$.
11. y-intercept of $2y=4x+10$.
12. Gradient of line perpendicular to x-axis.
13. Gradient between $(0,4)$ and $(2,0)$.
14. Equation with $m=-2,\; c=1$.
15. x-intercept of $y=3x+9$.
16. Gradient of circumference vs diameter graph.
17. Name shape of $y=x^2+2$.
18. Axis of symmetry for $y=x^2-6x+8$.
19. In $y=5-2x^2$, maximum or minimum?
20. y-intercept of $y=(x-3)(x+2)$.
21. Vertex of $y=x^2$.
22. Find $y$ at $x=2$ for $y=3x^2-1$.
23. Axis of symmetry for $y=x^2+10x$.
24. Explain why $A=6l^2$ gives a curve.
25. Classify $y=x^3$.
26. Intersection of $y=x$ and $y=2$.
27. Solve $x^2-9=0$ graphically.
28. Intersection of $y=2x+1$ and $y=2x+5$.
29. Solve $x+y=5$ and $x-y=1$ graphically.
30. If root reads $1.4$, state root.
31. Translate $(5,5)$ by $\begin{pmatrix}-2\\3\end{pmatrix}$.
32. Vector moving $y=x^2$ to $y=x^2+7$.
33. Point $4$ units from $O$, enlarged by $k=0.5$.
34. Shear factor if $(1,1)\to(4,1)$ with x-axis invariant.
35. Describe image when $k=-2$.
36. Exam cost for $8$ subjects if $T=5s+50$.
37. Depreciation of $\$100$ at $3$c in the dollar for $1$ year.
38. Cost of $20\text{ m}^3$ at $33.6$c per $\text{m}^3$.
39. Tire thickness after $10$ months if $T=12-0.5m$.
40. Break-even for $R=20x,\; C=10x+100$.

### Structured test (10 marks)
Given exam center costs:
$6$ subjects cost $\$80$ and $10$ subjects cost $\$100$.
1. Find linear equation for total cost $T$ in terms of subjects $s$. [4]
2. Plot graph for $0\le s\le 12$. [4]
3. Read cost for $s=8$ from graph. [2]

### Solutions manual (condensed)
- Mixed revision answers:
  1) function maps each input to one output
  2) $17$
  3) $20$
  4) $x$
  5) $10$
  6) $15$
  7) $4$
  8) $12$
  9) $3$
  10) $4$
  11) $5$
  12) undefined/infinite
  13) $-2$
  14) $y=-2x+1$
  15) $-3$
  16) $\pi$
  17) parabola
  18) $x=3$
  19) maximum
  20) $-6$
  21) $(0,0)$
  22) $11$
  23) $x=-5$
  24) depends on $l^2$
  25) cubic curve
  26) $(2,2)$
  27) $x=\pm 3$
  28) no intersection (parallel)
  29) $(3,2)$
  30) $1.4$
  31) $(3,8)$
  32) $\begin{pmatrix}0\\7\end{pmatrix}$
  33) $2$ units
  34) $3$
  35) inverted and enlarged
  36) $\$90$
  37) $\$97$
  38) $\$6.72$
  39) $7$ mm
  40) $10$ units
- Structured test:
  $m=\frac{100-80}{10-6}=5$, $c=80-5(6)=50$, so $T=5s+50$.
  Plot points $(0,50),(6,80),(10,100)$.
  At $s=8$, $T=90$.`,
    },
  ],
  key_points: [
    'A function maps each input to exactly one output.',
    'In linear graphs, gradient is rate of change and intercept is initial value.',
    'Quadratic graphs are parabolas with symmetry line x = -b/(2a).',
    'Graphical intersections solve simultaneous conditions.',
    'Transformations shift, resize, or shear parent graphs predictably.',
    'Real-world models (cost, depreciation, wear) are interpreted through function parameters.',
  ],
  exam_tips: [
    'Label axes, units, and scales clearly before plotting.',
    'Use at least three accurate points for straight lines and five for curves.',
    'State intercepts and turning points explicitly from the graph.',
    'When solving graphically, report readings to the scale precision used.',
  ],
  visual_descriptions: [
    'Family of linear graphs with different gradients and intercepts',
    'Parabola anatomy diagram showing axis of symmetry and vertex',
    'Intersection-based graphical solving for line-line and line-curve systems',
  ],
};

const consumerArithmeticMasterNotes: MathTopicNotes = {
  topic: 'Financial Mathematics',
  subject: 'Mathematics',
  grade_level: 'O-Level Form 4',
  summary:
    'Comprehensive consumer arithmetic notes covering simple/compound interest, depreciation, hire purchase, profit/loss, discounts, taxation, utility billing, and full revision support.',
  sections: [
    {
      title: '1) Introduction to Consumer Arithmetic and Financial Literacy',
      videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%204/Consumer_Arithmetic.mp4',
      content: String.raw`Consumer Arithmetic supports personal and business financial decision-making.

Key income terms:
- Gross Income: total earnings before deductions.
- Net Income (take-home pay): earnings after deductions.

In budgeting, use Net Income because it reflects actual spending power.

Mandatory and common deductions include PAYE, AIDS levy, pension, and insurance.`,
    },
    {
      title: '2) Simple Interest: Linear Growth',
      content: String.raw`Simple interest grows at a constant rate.

Formulas:
- $I=\frac{PRT}{100}$
- $A=P+I$

Where:
$P$ principal, $R$ annual rate (\%), $T$ years, $I$ interest, $A$ amount.

### Worked examples (selected)
1. $P=1500,\; R=6,\; T=3$:
   $I=\frac{1500\times 6\times 3}{100}=270$.
2. $P=2000,\; R=5,\; T=4$:
   $A=2000+\frac{2000\times 5\times 4}{100}=2400$.
3. $P=1200,\; R=4,\; T=\frac{9}{12}$:
   $I=36$.
4. If $I=120,\; P=1000,\; T=2$:
   $R=\frac{100I}{PT}=6\%$.
5. If $I=150,\; R=5,\; T=3$:
   $P=\frac{100I}{RT}=1000$.
6. Overdue bill: $P=400,\; R=15,\; T=\frac{1}{12}$:
   $I=5$.
7. If $I=300,\; P=2500,\; R=4$:
   $T=\frac{100I}{PR}=3$ years.
8. If $A=1120,\; R=6,\; T=2$:
   $P=\frac{100A}{100+RT}=1000$.

Common error:
- Convert months to years.
- Do not divide by $100$ twice.`,
    },
    {
      title: '3) Compound Interest: Exponential Growth',
      content: String.raw`Compound interest adds interest to principal each period.

Formulas:
- $A=P\left(1+\frac{R}{100}\right)^n$
- $CI=A-P$

Where $n$ is number of compounding periods.

### Worked examples (selected)
1. $P=1000,\; R=10,\; n=2$:
   $A=1000(1.1)^2=1210$.
2. $P=500,\; R=5,\; n=2$:
   $CI=500(1.05)^2-500=51.25$.
3. $P=2000,\; R=8,\; n=3$:
   $A=2000(1.08)^3=2519.42$.
4. Semi-annual case, $P=1000,\; R=6\%$ yearly for 1 year:
   $A=1000(1.03)^2=1060.90$.
5. $P=4000,\; R=6,\; n=2$:
   $A=4494.40$.
6. Interest in year 2 only for $P=1000,\; R=10\%$:
   $I_2=1000(1.21-1.10)=110$.
7. $100$ at $20\%$ for 2 years:
   $A=100(1.2)^2=144$.
8. $P=3000,\; R=4,\; n=3$:
   $CI=3000(1.04)^3-3000=374.59$.

Common error:
- If asked for $CI$, subtract principal from total amount.`,
    },
    {
      title: '4) Depreciation: Reducing Balance',
      content: String.raw`Depreciation models value loss over time.

Formula:
- $V=P\left(1-\frac{R}{100}\right)^n$

Where $V$ is future value after $n$ years.

### Worked examples (selected)
1. Shed: $P=1360,\; R=3,\; n=2$:
   $V=1360(0.97)^2=1279.62$.
2. Vehicle: $P=8500,\; R=20,\; n=3$:
   $V=8500(0.8)^3=4352$.
3. Machinery: $P=5000,\; R=10,\; n=2$:
   $V=4050$.
4. Building: $P=10000,\; R=3,\; n=1$:
   $V=9700$.
5. Equipment: $P=2000,\; R=30,\; n=2$:
   $V=980$.
6. Cumulative loss:
   $Loss=P-V=3000-3000(0.85)^2=832.50$.
7. $P=4000,\; R=5,\; n=4$:
   $V\approx 3258.00$.
8. Two-step rates $10\%$ then $20\%$:
   $V=1000(0.90)(0.80)=720$.`,
    },
    {
      title: '5) Hire Purchase: Cost of Credit',
      content: String.raw`Hire Purchase (H.P.) usually costs more than cash purchase.

Procedure:
1. Find cash price (after cash discount if any).
2. Find deposit.
3. Find total instalments.
4. Compute total H.P. price.
5. Cost of hire $=$ H.P. price $-$ cash price.

### Worked examples (selected)
1. Marked $\$2650$, cash discount $7\%$, deposit $15\%$, $24$ instalments of $\$110$:
   $CP=2650-0.07(2650)=2464.50$,
   $HP=0.15(2650)+24(110)=3037.50$,
   Difference $=573.00$.
2. If $HP=100+12(50)=700$ and cash $=600$, cost of hire $=100$.
3. Instalment:
   $\frac{HP-Dep}{n}=\frac{1500-300}{12}=100$.
4. $10\%$ deposit on $\$800$ plus $10$ months at $\$85$:
   $HP=80+850=930$.
5. No interest on balance:
   $HP=Dep+(Cash-Dep)=Cash$.
6. Percentage increase:
   $\frac{HP-CP}{CP}\times 100=\frac{1200-1000}{1000}\times 100=20\%$.
7. Number of months:
   $n=\frac{HP-Dep}{Inst}=\frac{1000-200}{40}=20$.
8. Deposit from known total:
   $Dep=HP-n(Inst)=2500-24(100)=100$.

Common error:
- Forgetting to add deposit to instalment total.`,
    },
    {
      title: '6) Profit, Loss, and Retail Percentages',
      content: String.raw`Core formulas:
- Profit $=SP-CP$
- Loss $=CP-SP$
- $\%Profit=\frac{Profit}{CP}\times 100$
- $\%Loss=\frac{Loss}{CP}\times 100$

### Worked examples (selected)
1. If $SP=15.25$ at $25\%$ profit:
   $CP=\frac{15.25}{125}\times 100=12.20$.
2. $CP=100,\; SP=120$:
   $\%Profit=20\%$.
3. $CP=50,\; SP=40$:
   $\%Loss=20\%$.
4. $CP=80$ with $15\%$ profit:
   $SP=80(1.15)=92$.
5. $CP=200$ with $10\%$ loss:
   $SP=200(0.90)=180$.
6. Bulk profit:
   $(15\times 10)-(10\times 10)=50$.
7. If profit is $58.91$ on $500$:
   $\%Profit=\frac{58.91}{500}\times 100=11.78\%$.
8. Discounted selling:
   $(100\times 0.90)-70=20$.

Common error:
- Use cost price as denominator in profit/loss percentages.`,
    },
    {
      title: '7) Trade Discounts and Mark-Ups',
      content: String.raw`Mark-up increases price from cost; discount reduces selling price.

### Worked examples (selected)
1. Jacket at $\$35$ with $15\%$ discount:
   $35(0.85)=29.75$.
2. Two shirts at $\$15$ each, $10\%$ off, plus jacket at $\$35$, $15\%$ off:
   $2(15)(0.90)+35(0.85)=56.75$.
3. Marked price from $CP=80$ with $25\%$ mark-up:
   $80(1.25)=100$.
4. Mark-up percentage from $CP=12,\; MP=15$:
   $\frac{15-12}{12}\times 100=25\%$.
5. $20\%$ trade discount on $\$200$:
   $200(0.80)=160$.
6. Successive mark-up then discount:
   $(10\times 1.50)\times 0.90=13.50$.
7. Price excluding VAT context (shirt):
   $15(0.90)=13.50$.
8. Discount amount on $\$50$ at $15\%$:
   $50(0.15)=7.50$.`,
    },
    {
      title: '8) Tax, Commission, and Household Bills',
      content: String.raw`Reference rates:
- VAT: $15\%$
- AIDS levy: $3\%$ of PAYE
- Water W1: first $15\text{ m}^3$ at $33.6$c; next $30\text{ m}^3$ at $45.3$c
- Water W2 commercial: $43.7$c per $\text{m}^3$
- Electricity: sub-total plus $5\%$ levy
- Postage: letter up to $20$ g = $25$c, $20$ g-$100$ g = $50$c; parcel $1$ kg = $\$3$ then $\$1$ per extra kg

### Worked examples (selected)
1. VAT on $\$12$:
   $12(0.15)=1.80$.
2. Commission $4\%$ on $\$5000$:
   $200$.
3. Net before tax/levy from $\$165$ minus $\$4.40$ and $\$2.70$:
   $\$157.90$.
4. AIDS levy on PAYE $\$100$:
   $0.03(100)=3.00$.
5. W1 water for $45\text{ m}^3$:
   $15(0.336)+30(0.453)=18.63$.
6. W2 for $100\text{ m}^3$:
   $100(0.437)=43.70$.
7. Electricity sub-total $\$63$ with $5\%$ levy:
   $63(1.05)=66.15$.
8. Postage of $3$ kg parcel:
   $3.00+2(1.00)=5.00$.

Common error:
- Convert cents to dollars before combining totals.`,
    },
    {
      title: '9) Mixed Revision and Structured Test',
      content: String.raw`### Mixed revision (40 items)
1. Define net income.
2. Find SI on $\$1200$ at $5\%$ for $3$ years.
3. Amount for $\$500$ at $10\%$ CI for $2$ years.
4. Cash price: marked $\$2650$ with $7\%$ discount.
5. H.P. price: deposit $\$397.50$, $24$ instalments of $\$110$.
6. Cost of hire from 4 and 5.
7. Depreciate $\$1360$ at $3\%$ for $2$ years.
8. \% profit if $CP=12.20$, $SP=15.25$.
9. Find $CP$ if $SP=15.25$ at $25\%$ profit.
10. VAT at $15\%$ on $\$40$.
11. AIDS levy on PAYE $\$60$.
12. W1 water for $10\text{ m}^3$.
13. W2 water for $10\text{ m}^3$.
14. Sub-total $\$80$ plus $5\%$ levy.
15. Postage for $25$ g letter.
16. Postage for $1.5$ kg parcel.
17. SI on $\$800$ for $9$ months at $4\%$.
18. Find $P$ if $I=\$60,\; R=5\%,\; T=2$.
19. Find $R$ if $I=\$100,\; P=\$1000,\; T=2$.
20. CI on $\$2000$ at $5\%$ for $2$ years.
21. Value of $\$10{,}000$ car after $1$ year at $20\%$ depreciation.
22. \% loss if $CP=200,\; SP=180$.
23. Mark-up of $25\%$ on $\$12$.
24. Discount of $15\%$ on $\$35$.
25. Commission of $5\%$ on $\$10{,}000$.
26. Net salary from gross $\$200$ with pension $\$10$ and insurance $\$5$.
27. W1 water for $50\text{ m}^3$.
28. Total for two shirts at $\$15$ each with $10\%$ discount.
29. SI amount on $\$500$ at $6\%$ for $4$ years.
30. CI only on $\$1000$ at $8\%$ for $2$ years.
31. Machinery value: $\$5000$ depreciated $10\%$ for $3$ years.
32. H.P. deposit: $15\%$ of $\$2650$.
33. Total H.P. instalments: $36$ months at $\$250$.
34. Shirt $\$15$ excluding $15\%$ VAT; find total.
35. HIV levy on PAYE $\$120$.
36. Difference between H.P. $\$1000$ and cash $\$850$.
37. SI for $2$ years on $\$1500$ at $10\%$.
38. Building $\$2000$ after $2$ years at $3\%$ depreciation.
39. \% profit if $CP=10,\; SP=15$.
40. Electricity sub-total if total is $\$105$ with $5\%$ levy.

### Structured test (10 high-value problems)
1. Car deal: cash discount, H.P. plan, cost of hire, and depreciation value.
2. Employee budget: net salary, AIDS levy, rent portion.
3. Retail strategy: mark-up, revenue mix, overall \% profit.
4. Utility audit: W1 water and electricity with levy.
5. Investment comparison: SI vs CI outcomes.
6. Asset management: tractor and shed depreciation totals.
7. Credit purchase: fridge cash vs H.P. comparison.
8. Sales agent: basic + commission and net adjustment.
9. Postage + VAT total.
10. SI loan repayment and monthly instalment.`,
    },
    {
      title: '10) Complete Memo and Worked Solutions',
      content: String.raw`### Practice exercise key (selected)
- SI/CI/depreciation/H.P./profit/discount/tax practice results include:
  $\$180.00,\; \$3420.00,\; \$60.00,\; \$1000.00,\; 2\text{ years}$,
  $\$2809.00,\; \$1261.00,\; \$1323.00,\; \$0.80,\; \$11255.09$,
  $\$20250.00,\; \$3650.92,\; \$843.75,\; \$680.00,\; \$4320.00$,
  $\$720.00,\; \$320.00,\; \$1080.00,\; \$83.33,\; 30\%$,
  $25\%,\; \$108.00,\; \$40.00,\; 16\%,\; 25\%$,
  $\$54.00,\; \$17.00,\; \$70.00,\; \$40.50,\; \$48.50$,
  $\$180.00,\; \$13.50,\; \$7.31,\; \$0.50,\; \$126.00$.

### Mixed revision memo (summary)
1) Take-home pay after deductions
2) $\$225$
3) $\$605$
4) $\$2464.50$
5) $\$3037.50$
6) $\$573.00$
7) $\$1279.62$
8) $25\%$
9) $\$12.20$
10) $\$6.00$
11) $\$1.80$
12) $\$3.36$
13) $\$4.37$
14) $\$84.00$
15) $\$0.50$
16) $\$4.00$
17) $\$24.00$
18) $\$600$
19) $5\%$
20) $\$205$
21) $\$8000$
22) $10\%$
23) $\$15$
24) $\$29.75$
25) $\$500$
26) $\$185$
27) $\$18.63$
28) $\$27.00$
29) $\$620$
30) $\$166.40$
31) $\$3645.00$
32) $\$397.50$
33) $\$9000$
34) $\$17.25$
35) $\$3.60$
36) $\$150$
37) $\$300$
38) $\$1881.80$
39) $50\%$
40) $\$100.00$

### Structured test answers
1. a) $\$7905.00$ b) $\$10275.00$ c) $\$2370.00$ d) $\$4352.00$
2. a) $\$950.00$ b) $\$4.50$ c) $\$142.50$
3. a) $\$14.00$ b) $\$560.00$ c) $\$126.00$ (total $\$686$) d) $37.2\%$
4. a) $\$18.63$ b) $\$57.70$ c) $\$60.59$
5. a) $\$6200.00$ b) $\$6125.22$ c) SI better by $\$74.78$
6. a) $\$14450.00$ b) $\$1279.62$ c) $\$15729.62$
7. a) $\$1140.00$ b) $\$1380.00$ c) $\$240.00$
8. a) $\$900.00$ b) $\$885.00$
9. a) $\$6.25$ b) $\$7.19$
10. a) $\$2300.00$ b) $\$127.78$`,
    },
  ],
  key_points: [
    'Use SI for linear growth and CI/depreciation for exponential change.',
    'Keep rate-time units consistent, especially months to years.',
    'In H.P., total cost equals deposit plus all instalments.',
    'Profit and loss percentages are based on cost price.',
    'Convert cents to dollars in utility calculations.',
    'Budget and affordability decisions must be based on net income.',
  ],
  exam_tips: [
    'Write formula first, then substitute with units.',
    'Round final money values to 2 decimal places unless told otherwise.',
    'For CI and depreciation, check whether period is annual, monthly, or semi-annual.',
    'Always label whether your answer is interest, amount, value, or cost of hire.',
  ],
  visual_descriptions: [
    'Flowchart comparing SI, CI, and depreciation model selection',
    'Hire purchase breakdown panel: cash price, deposit, instalments, and cost of hire',
    'Tiered utility tariff diagram for water and electricity bill construction',
  ],
};

const travelGraphsMasterNotes: MathTopicNotes = {
  topic: 'Travel Graphs',
  subject: 'Mathematics',
  grade_level: 'O-Level Form 4',
  summary:
    'Comprehensive Form 4 travel graphs notes covering distance-time and speed-time interpretation, acceleration, multi-stage journeys, comparative motion, and structured assessment.',
  sections: [
    {
      title: '1) Introduction to Kinematic Graphs',
      videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%204/The_Language_of_Motion.mp4',
      content: String.raw`Travel graphs model motion visually over time.

Two core graph types:
- Distance-Time: shows position change with time.
- Speed-Time: shows speed change with time.

Why graphs matter:
- They reveal speed, rest periods, acceleration/deceleration, and journey structure.
- They support prediction and comparison in real-world contexts.`,
    },
    {
      title: '2) Subtopic A: Distance-Time Graphs',
      content: String.raw`Axes convention:
- Time on x-axis (independent variable).
- Distance on y-axis (dependent variable).

Interpretation:
- Straight diagonal line: constant speed.
- Horizontal line: stationary ($v=0$).
- Negative gradient: return towards start.

Gradient meaning:
$\text{Gradient}=\frac{\Delta d}{\Delta t}=\frac{y_2-y_1}{x_2-x_1}=\text{speed}$.

### Worked examples
1. $150\text{ km}$ in $3\text{ h}$:
   speed $=\frac{150}{3}=50\text{ km/h}$.
2. $100\text{ m}$ in $12.5\text{ s}$:
   gradient $=\frac{100}{12.5}=8\text{ m/s}$.
3. From $4$ km at 10:00 to $10$ km at 11:30:
   speed $=\frac{10-4}{1.5}=4\text{ km/h}$.
4. Horizontal line at $25$ km for $45$ min:
   speed $=\frac{25-25}{0.75}=0\text{ km/h}$.
5. $30$ km in $1$ h $15$ min:
   speed $=\frac{30}{1.25}=24\text{ km/h}$.
6. $15$ m in $3$ s:
   speed $=5\text{ m/s}$.
7. Return of $80$ km in $2$ h:
   speed magnitude $=40\text{ km/h}$.
8. $225$ km in $2.5$ h:
   speed $=90\text{ km/h}$.

Common error:
- Excluding stationary time from total journey time when finding average speed.

### Practice Exercise A
1. Bus travels $90$ km in $1.5$ h. Find speed.
2. Athlete runs $200$ m in $25$ s. Find gradient.
3. How is a $20$ min stop shown?
4. Walk $5$ km in $45$ min. Convert to km/h.
5. Interpret negative gradient returning to x-axis.`,
    },
    {
      title: '3) Subtopic B: Speed-Time Graphs',
      content: String.raw`Interpretation:
- Positive gradient: acceleration.
- Negative gradient: deceleration.
- Horizontal line: constant speed.

Distance from graph:
- Area under speed-time graph gives distance:
  $\text{distance}=\text{speed}\times\text{time}$.

### Worked examples (area method)
1. Rectangle: $15\text{ m/s}$ for $20$ s:
   distance $=15\times 20=300$ m.
2. Triangle from rest to $10\text{ m/s}$ in $6$ s:
   distance $=\frac{1}{2}\times 6\times 10=30$ m.
3. Deceleration triangle $40\to 0$ in $15$ s:
   distance $=\frac{1}{2}\times 15\times 40=300$ m.
4. Trapezium from $10$ to $20\text{ m/s}$ over $8$ s:
   distance $=\frac{1}{2}(10+20)\times 8=120$ m.
5. $8\text{ m/s}$ for $120$ s:
   distance $=960$ m.
6. From $2$ to $12\text{ m/s}$ in $5$ s:
   distance $=\frac{1}{2}(2+12)\times 5=35$ m.
7. Rest to $100\text{ m/s}$ in $10$ s:
   distance $=\frac{1}{2}\times 10\times 100=500$ m.
8. $12\text{ m/s}$ for $30$ s:
   distance $=360$ m.

Common error:
- Using one formula for a multi-part graph; split into simple shapes first.

### Practice Exercise B
1. Horizontal line at $25\text{ m/s}$ for $12$ s.
2. Triangle base $8$ s, height $20\text{ m/s}$.
3. What does gradient represent on speed-time graph?
4. Trapezium with parallel sides $5$ and $15$, height $10$.
5. Explain why area represents distance.`,
    },
    {
      title: '4) Subtopic C: Acceleration',
      content: String.raw`Formula:
$a=\frac{v-u}{t}$

where $u$ is initial speed, $v$ final speed, $t$ time.

### Worked examples
1. $15\to 45\text{ m/s}$ in $10$ s:
   $a=\frac{45-15}{10}=3\text{ m/s}^2$.
2. $20\to 5\text{ m/s}$ in $3$ s:
   $a=\frac{5-20}{3}=-5\text{ m/s}^2$.
3. Rest to $200\text{ m/s}$ in $8$ s:
   $a=25\text{ m/s}^2$.
4. $18\to 0\text{ m/s}$ in $6$ s:
   $a=-3\text{ m/s}^2$ (deceleration magnitude $3$).
5. $40\to 100\text{ km/h}$ in $0.5$ h:
   $a=120\text{ km/h}^2$.
6. $30\to 0\text{ m/s}$ in $12$ s:
   $a=-2.5\text{ m/s}^2$.

Common error:
- Confusing speed value with acceleration (gradient).
- Omitting squared time unit.

### Practice Exercise C
1. Define acceleration.
2. $0\to 50\text{ m/s}$ in $10$ s.
3. Meaning of horizontal line on speed-time graph.
4. $60\to 20\text{ m/s}$ in $8$ s.
5. Acceleration if speed is constant at $15\text{ m/s}$.`,
    },
    {
      title: '5) Subtopic D: Multi-Stage Journeys',
      content: String.raw`Average speed:
$\text{average speed}=\frac{\text{total distance}}{\text{total time}}$.

### Worked examples
1. $80$ km in $1.5$ h, rest $0.5$ h, then $40$ km in $1$ h:
   total distance $=120$ km, total time $=3$ h,
   average speed $=40\text{ km/h}$.
2. $200$ m in $20$ s, rest $10$ s, then $300$ m in $20$ s:
   average speed $=\frac{500}{50}=10\text{ m/s}$.
3. Triangle area $60$ m and rectangle area $140$ m over $20$ s:
   average speed $=\frac{200}{20}=10\text{ m/s}$.
4. $15$ km at $30\text{ km/h}$ then $10$ km at $20\text{ km/h}$:
   times $0.5$ h and $0.5$ h, average $=25\text{ km/h}$.
5. Round trip $10$ km each way in $2$ h:
   average $=\frac{20}{2}=10\text{ km/h}$.
6. $50$ m in $5$ s then $150$ m in $10$ s:
   average $=\frac{200}{15}\approx 13.33\text{ m/s}$.
7. Triangle area $40$ m and rectangle area $120$ m over $10$ s:
   average $=16\text{ m/s}$.
8. $100$ km in $1$ h, rest $0.25$ h, then $150$ km in $1.75$ h:
   average $=\frac{250}{3}\approx 83.33\text{ km/h}$.

### Practice Exercise D
1. $300$ km in $5$ h.
2. Effect of $30$ min rest on average speed.
3. $1200$ m in $60$ s.
4. $40$ km in $1$ h then $60$ km in $1.5$ h.
5. $2$ km in $30$ min, rest $10$ min, then $1$ km in $20$ min.`,
    },
    {
      title: '6) Subtopic E: Comparing Two Travellers',
      content: String.raw`On the same graph:
- Intersection point = meeting point.
- Vertical gap at fixed time = lead distance.
- Horizontal gap for same distance = time difference.

### Worked examples
1. Runner A: $d=5t$, Runner B starts at $t=10$ with $d=10(t-10)$:
   meeting: $5t=10t-100 \Rightarrow t=20$ s.
2. Car X: $d=60t$, Car Y: $d=30+40t$:
   catch-up: $60t=30+40t \Rightarrow t=1.5$ h.
3. At $t=2$ h, A at $100$ km and B at $120$ km:
   lead $=20$ km.
4. Arrival times $4$ h and $4.5$ h:
   difference $=0.5$ h $=30$ min.
5. At points $(2,40)$ and $(2,60)$:
   separation $=20$ km.
6. Intersection at $t=0.5$ h and speed A is $6\text{ km/h}$:
   meeting distance $=6\times 0.5=3$ km.

Common error:
- Poor scale choices reduce intersection accuracy.

### Practice Exercise E
1. Meaning of intersection.
2. If A is steeper than B, what does it mean?
3. How to compute lead at a given time.
4. If cyclists meet at $15$ min and one travels at $20\text{ km/h}$, find distance.
5. If A reaches $5$ km at $20$ min and B at $25$ min, find time difference.`,
    },
    {
      title: '7) Subtopic F: Graphical Problem Solving',
      content: String.raw`### Worked examples
1. Triangle area with top speed $20$ and time $T$ gives distance $100$:
   $\frac{1}{2}T(20)=100 \Rightarrow T=10$ s.
2. Decelerating triangle from $V$ to $0$ in $5$ s with area $50$:
   $\frac{1}{2}(5)V=50 \Rightarrow V=20\text{ m/s}$.
3. Speed increase $15\text{ m/s}$ in $3$ s:
   acceleration $=5\text{ m/s}^2$.
4. Constant speed stage $10$ s at $V=20\text{ m/s}$:
   distance $=200$ m.
5. Constant speed $12\text{ m/s}$ for $2.5$ s:
   distance $=30$ m.
6. Total $500$ m, stage 1 is $200$ m, stage 2 time is $10$ s:
   stage 2 speed $=\frac{300}{10}=30\text{ m/s}$.`,
    },
    {
      title: '8) Mixed Revision Exercise',
      content: String.raw`### Basic interpretation (1-10)
1. Meaning of horizontal line on distance-time graph.
2. Meaning of horizontal line on speed-time graph.
3. Meaning of steeper gradient on distance-time graph.
4. How deceleration appears on speed-time graph.
5. Meaning of origin in travel context.
6. Unit of gradient of speed-time graph.
7. How to get distance from speed-time graph.
8. Meaning of negative gradient on distance-time graph.
9. Average speed vs instantaneous speed.
10. Motion when gradient is $0$ on distance-time graph.

### Calculations (11-25)
11. Speed: $150$ km in $2$ h $15$ min.
12. Acceleration: $0$ to $24\text{ m/s}$ in $4$ s.
13. Triangle distance: base $12$ s, height $30\text{ m/s}$.
14. Rectangle distance: $15\text{ m/s}$ for $1$ min.
15. Average speed: $50$ km at $100$ km/h then $50$ km at $50$ km/h.
16. Find $v$ if $a=4,\; u=0,\; t=5$.
17. Find $t$ if triangle distance is $100$ m and height $20\text{ m/s}$.
18. Convert $72\text{ km/h}$ to m/s.
19. Gradient between $(2,10)$ and $(5,40)$.
20. Trapezium area: $a=10,\; b=20,\; h=5$.
21. Deceleration from $30$ to $10\text{ m/s}$ in $5$ s.
22. Distance: trapezium $a=5,\; b=15,\; h=4$.
23. Speed from points $(0,0)$ and $(10,100)$.
24. Acceleration from rest to $15\text{ m/s}$ in $2.5$ s.
25. Total distance from triangle $20$ m and rectangle $80$ m.

### Complex multi-stage (26-35)
26. Accelerate to $20\text{ m/s}$ in $5$ s, constant $10$ s, decelerate to rest in $5$ s: total distance.
27. Average speed for Q26.
28. Runner A $6\text{ m/s}$, runner B starts $20$ m ahead at $4\text{ m/s}$: meeting time.
29. $100$ km at $50\text{ km/h}$ and $100$ km at $100\text{ km/h}$: average speed.
30. Speed-time triangle from $0$ to $V$ in $10$ s has area $100$: find $V$.
31. Higher acceleration: line 1 $(0,20)$ in $5$ s vs line 2 $(10,30)$ in $10$ s.
32. Total trip $5$ h, average $60\text{ km/h}$, first $3$ h at $70$: speed for last $2$ h.
33. Sum areas: triangle $(4,10)$, rectangle $(6,10)$, triangle $(2,10)$.
34. Time to be $50$ m from home at $5\text{ m/s}$.
35. Trapezium area $150$ with parallel sides $10$ and $20$: find height.`,
    },
    {
      title: '9) Structured Test Section',
      content: String.raw`1. Cyclist motion:
- Stage 1: rest to $12\text{ m/s}$ in $10$ s
- Stage 2: constant speed for $30$ s
- Stage 3: decelerate to rest in $20$ s
Tasks: draw graph, find stage-1 acceleration, total distance, average speed.

2. Car and bus from same town:
- Car $80\text{ km/h}$, bus $60\text{ km/h}$
Tasks: draw first $2$ h, separation after $90$ min, time advantage to $120$ km.

3. Trapezium speed-time graph:
- Speed from $10$ to $30\text{ m/s}$ in $T$ s, area $400$ m
Tasks: find $T$ and acceleration.

4. $200$ km journey in 4 stages:
- $50$ km at $100\text{ km/h}$
- Rest $30$ min
- $100$ km at $50\text{ km/h}$
- $50$ km at $100\text{ km/h}$
Tasks: total time and overall average speed.

5. Particle speed law:
$v=4t$ for $0\le t\le 5$
Tasks: speed at $t=3$, acceleration, distance in first $5$ s.`,
    },
    {
      title: '10) Memo and Complete Worked Solutions',
      content: String.raw`### Test Q1
- Acceleration: $\frac{12-0}{10}=1.2\text{ m/s}^2$.
- Distance:
  $\frac{1}{2}(10)(12)+(30)(12)+\frac{1}{2}(20)(12)=60+360+120=540$ m.
- Average speed: $\frac{540}{60}=9\text{ m/s}$.

### Test Q2
- After $1.5$ h:
  Car $=80(1.5)=120$ km, Bus $=60(1.5)=90$ km,
  separation $=30$ km.
- Time to $120$ km:
  Car $=1.5$ h, Bus $=2$ h, difference $=0.5$ h $=30$ min.

### Test Q3
- Area:
  $\frac{1}{2}(10+30)T=400 \Rightarrow 20T=400 \Rightarrow T=20$ s.
- Acceleration:
  $\frac{30-10}{20}=1\text{ m/s}^2$.

### Test Q4
- Times: $0.5+0.5+2+0.5=3.5$ h.
- Average speed:
  $\frac{200}{3.5}=57.14\text{ km/h}$.

### Test Q5
- $v(3)=4(3)=12\text{ m/s}$.
- Acceleration is gradient $=4\text{ m/s}^2$.
- Distance in first $5$ s:
  area triangle $=\frac{1}{2}(5)(20)=50$ m.`,
    },
  ],
  key_points: [
    'On distance-time graphs, gradient gives speed.',
    'On speed-time graphs, gradient gives acceleration and area gives distance.',
    'Stationary periods still count in total time for average speed.',
    'Multi-stage journeys require total distance and total time aggregation.',
    'Intersections of two travel graphs represent meeting conditions.',
    'Clear scale and axis labeling are essential for accurate readings.',
  ],
  exam_tips: [
    'Convert all times to consistent units before calculations.',
    'Break complex speed-time regions into triangles, rectangles, and trapezia.',
    'Always include rest intervals when finding average speed.',
    'Check sign of acceleration to distinguish acceleration vs deceleration.',
  ],
  visual_descriptions: [
    'Distance-time profile gallery: constant motion, rest, and return segments',
    'Speed-time area decomposition into rectangle, triangle, and trapezium parts',
    'Two-traveller intersection chart showing meeting, lead, and time gaps',
  ],
};

const variationMasterNotes: MathTopicNotes = {
  topic: 'Variation',
  subject: 'Mathematics',
  grade_level: 'O-Level Form 4',
  summary:
    'Comprehensive Form 4 variation notes covering direct, inverse, joint, and partial variation with graphical interpretation, applications, revision, and memo solutions.',
  sections: [
    {
      title: '1) Introduction to Variation and Proportionality',
      videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%204/Mastering_Variation.mp4',
      content: String.raw`Variation models how one quantity changes in response to another.

Core notation:
- Proportionality: $\propto$
- Constant of proportionality: $k$

Examples:
- $y\propto x \Rightarrow y=kx$
- $y\propto \frac{1}{x} \Rightarrow y=\frac{k}{x}$

$k$ is the controlling constant for a given system.`,
    },
    {
      title: '2) Subtopic A: Direct Variation',
      content: String.raw`Direct variation:
$y\propto x \Rightarrow y=kx$,
with constant ratio $k=\frac{y}{x}$.

### Worked examples
1. Rectangle area with fixed width:
   $A\propto l,\; A=kl$.
   If $A=24$ when $l=6$, then $k=4$.
   At $l=10$, $A=40\text{ cm}^2$.
2. Circle circumference and diameter:
   $C\propto D,\; C=kD$.
   If $C=22$ at $D=7$, $k=\frac{22}{7}$.
   At $D=14$, $C=44\text{ cm}$.
3. Wages and hours:
   $W=kh$.
   If $W=45$ at $h=3$, $k=15$.
   At $h=8$, $W=\$120$.
4. Mass and volume:
   $M=kV$.
   If $M=50$ at $V=10$, $k=5$.
   At $V=24$, $M=120\text{ g}$.
5. Hooke-type relation:
   $e=kL$.
   If $e=3$ at $L=15$, $k=0.2$.
   At $L=40$, $e=8\text{ mm}$.
6. Constant velocity:
   $d=kt$.
   If $d=120$ at $t=2$, $k=60$.
   At $t=5.5$, $d=330\text{ km}$.
7. Cost and mass:
   $C=km$.
   If $2\text{ kg}$ costs $\$3.40$, $k=1.70$.
   For $7\text{ kg}$, $C=\$11.90$.
8. Sales tax:
   $S=kP$.
   If tax is $\$1.20$ on $\$20$, $k=0.06$.
   For $\$150$, $S=\$9$.

Graph:
- Straight line through origin.
- Gradient equals $k$.

Common errors:
- Skipping the calculation of $k$.
- Mistaking $y=mx+c$ with $c\neq 0$ for direct variation.`,
    },
    {
      title: '3) Subtopic B: Inverse Variation',
      content: String.raw`Inverse variation:
$y\propto \frac{1}{x} \Rightarrow y=\frac{k}{x}$,
with constant product $k=xy$.

### Worked examples
1. Time vs workers:
   $t=\frac{k}{w}$.
   If $4$ workers take $6$ h, $k=24$.
   For $3$ workers, $t=8$ h.
2. Time vs speed:
   $T=\frac{k}{s}$.
   If $3$ h at $60$ km/h, $k=180$.
   At $90$ km/h, $T=2$ h.
3. Boyle form:
   $P=\frac{k}{V}$.
   If $P=100$ at $V=2.5$, $k=250$.
   At $V=5$, $P=50$.
4. Frequency vs string length:
   $f=\frac{k}{l}$.
   If $f=440$ at $l=60$, $k=26400$.
   At $l=80$, $f=330$.
5. Inverse square:
   $I=\frac{k}{d^2}$.
   If $I=20$ at $d=2$, $k=80$.
   At $d=4$, $I=5$.
6. Tank fill time vs pipes:
   $t=\frac{k}{p}$.
   If $5$ pipes take $40$ min, $k=200$.
   For $8$ pipes, $t=25$ min.
7. Gear speed vs teeth:
   $R=\frac{k}{n}$.
   If $R=120$ at $n=20$, $k=2400$.
   At $n=30$, $R=80$ rpm.
8. General:
   If $y=0.5$ when $x=40$, then $k=20$.
   At $x=5$, $y=4$.

Graph:
- Rectangular hyperbola.
- Does not touch axes (for non-zero $k$).`,
    },
    {
      title: '4) Subtopic C: Joint Variation',
      content: String.raw`Joint variation:
$y\propto xz \Rightarrow y=kxz$.

### Worked examples
1. Rectangle area:
   $A=klw$.
   If $A=30$ when $l=6,w=5$, then $k=1$.
   At $l=8,w=7$, $A=56$.
2. Prism volume:
   $V=kBh$.
   If $V=120$ when $B=30,h=4$, then $k=1$.
   At $B=40,h=5$, $V=200$.
3. Simple interest model:
   $I=kPRT$.
   If $I=100,\; P=1000,\;R=0.05,\;T=2$, then $k=1$.
   For $P=5000,\;R=0.04,\;T=3$, $I=600$.
4. Bricks laid:
   $N=kwt$.
   If $N=500$ with $w=2,t=5$, then $k=50$.
   For $w=4,t=6$, $N=1200$.
5. Force:
   $F=kma$.
   If $F=50$ at $m=10,a=5$, then $k=1$.
   For $m=12,a=3$, $F=36$.
6. Sheet mass:
   $M=kAt$.
   If $M=200$ at $A=50,t=0.5$, $k=8$.
   At $A=100,t=0.2$, $M=160$.
7. Kinetic-energy pattern:
   $E=kmv^2$.
   If $E=100$ at $m=2,v=10$, $k=0.5$.
   At $m=4,v=5$, $E=50$.
8. Fabric cost:
   $C=klw$.
   If $3\times 2$ costs $\$24$, $k=4$.
   For $5\times 1.5$, $C=\$30$.`,
    },
    {
      title: '5) Subtopic D: Partial Variation',
      content: String.raw`Partial variation:
$y=kx+c$,
where $c$ is fixed term and $kx$ is varying term.

### Worked examples
1. Exam fees:
   $T=kn+c$ with data $(n,T)=(6,80),(10,100)$.
   Equations: $80=6k+c,\;100=10k+c$.
   So $k=5,\;c=50$.
   For $n=15$, $T=125$.
2. Utility bill:
   $B=ku+c$.
   If $(u,B)=(100,31.50),(250,63.00)$:
   $k=0.21,\;c=10.50$.
   At $u=200$, $B=52.50$.
3. Tire thickness decay:
   $T=c-kt$.
   If $c=8$ and $T=6$ at $t=10000$:
   $k=0.0002$.
   At $t=25000$, $T=3$ mm.
4. Hire purchase:
   $P=kn+c$.
   Deposit $\$397.50$ and instalment $\$110$ for $24$ months:
   $P=110(24)+397.50=3037.50$.
5. Printing:
   $C=kp+c$ with $(p,C)=(100,40),(250,70)$.
   $k=0.20,\;c=20$.
   For $500$ pages: $C=120$.
6. Taxi:
   $F=kd+c$ with $k=2.50,\;c=5$.
   For $d=12$, $F=35$.
7. Commission pay:
   $P=kS+c$ with $k=0.10,\;c=165$.
   For $S=1500$, $P=315$.
8. General:
   From $(x,y)=(10,50)$ and $(25,80)$:
   $k=2,\;c=30$.
   At $x=40$, $y=110$.`,
    },
    {
      title: '6) Graphical Interpretation of Variation',
      content: String.raw`Key graphical diagnostics:
- Direct variation $y=kx$: straight line through origin.
- Quadratic direct form $A=kl^2$: straight line if plotting $A$ against $l^2$.
- Inverse variation $y=\frac{k}{x}$: hyperbola.

For a straight-line proportional graph through origin, gradient equals $k$.
Example:
$A=6l^2$ gives gradient $6$ on graph of $A$ against $l^2$.

Common confusion:
- Parabola ($y=kx^2$) is not hyperbola ($y=\frac{k}{x}$).`,
    },
    {
      title: '7) Applications and Problem-Solving Strategy',
      content: String.raw`Checklist:
1. Translate words to proportional form.
2. Introduce $k$.
3. Use known values to find $k$.
4. Substitute target values.

Sample application prompts:
1. $H\propto \sqrt{a}$ with known tree height/age.
2. Utility bill with fixed plus variable energy charge.
3. $I\propto \frac{1}{d^2}$ light intensity scaling.
4. Water billing in tiered rates.
5. Tire-life inverse-distance model.
6. Spring extension-load model.
7. Discount amount directly proportional to marked price.
8. TelOne-style bill with fixed rental plus unit charge.`,
    },
    {
      title: '8) Mixed Revision Exercise',
      content: String.raw`### Revision items (1-40)
1. $y\propto x$, $y=20$ when $x=4$. Find $k$.
2. $y\propto x^2$, $y=18$ when $x=3$. Find $y$ at $x=5$.
3. $y\propto \sqrt{x}$, $y=6$ when $x=9$. Find $y$ at $x=25$.
4. $y\propto x$, $y=10$ when $x=2$. Find $x$ when $y=35$.
5. $y\propto x^3$, $y=16$ when $x=2$. Find $k$.
6. $A\propto r^2$, $A=154$ when $r=7$. Find $A$ when $r=14$.
7. $V\propto r^3$, $V=32$ when $r=2$. Find $V$ when $r=3$.
8. $y\propto x$, $k=4.5$. Find $y$ when $x=10$.
9. $y\propto \sqrt{x}$, $y=12$ when $x=16$. Find $x$ when $y=9$.
10. In $y=kx$, graph passes through $(4,12)$. Find $k$.
11. $y\propto \frac{1}{x}$, $y=5$ when $x=4$. Find $k$.
12. $y\propto \frac{1}{x}$, $y=2$ when $x=10$. Find $y$ when $x=4$.
13. $y\propto \frac{1}{x^2}$, $y=9$ when $x=2$. Find $y$ when $x=3$.
14. $y\propto \frac{1}{\sqrt{x}}$, $y=4$ when $x=25$. Find $y$ when $x=100$.
15. $y\propto \frac{1}{x}$, $k=48$. Find $x$ when $y=6$.
16. $T\propto \frac{1}{s}$, $T=4$ when $s=60$. Find $T$ when $s=80$.
17. $P\propto \frac{1}{V}$, $P=15$ when $V=4$. Find $P$ when $V=10$.
18. $I\propto \frac{1}{d^2}$, $I=40$ when $d=1$. Find $I$ when $d=2$.
19. $y\propto \frac{1}{x}$, $y=0.1$ when $x=100$. Find $k$.
20. $y\propto \frac{1}{x^2}$, $y=1$ when $x=5$. Find $y$ when $x=1$.
21. $y\propto xz$, $y=20$ when $x=2,z=5$. Find $k$.
22. $y\propto xz$, $y=36$ when $x=3,z=3$. Find $y$ when $x=4,z=5$.
23. $V\propto r^2h$, $V=100$ when $r=5,h=4$. Find $V$ when $r=2,h=10$.
24. $I\propto PRT$, $I=60$ when $P=1000,R=0.03,T=2$. Find $k$.
25. $A\propto bh$, $A=20$ when $b=4,h=10$. Find $A$ when $b=6,h=5$.
26. $y\propto xz^2$, $y=50$ when $x=2,z=5$. Find $y$ when $x=3,z=2$.
27. $W\propto Fd$, $W=200$ when $F=20,d=10$. Find $k$.
28. $P\propto VI$, $P=2400$ when $V=240,I=10$. Find $P$ when $V=110,I=5$.
29. $y\propto \frac{xz}{w}$, $y=10$ when $x=2,z=5,w=1$. Find $k$.
30. $y\propto \frac{x^2}{z}$, $y=8$ when $x=4,z=2$. Find $y$ when $x=3,z=1$.
31. $y=kx+c$, $c=10$, $k=2$. Find $y$ for $x=5$.
32. $y=kx+c$, with $(2,15)$ and $(4,25)$. Find $k$.
33. $y=kx+c$, with $(0,50)$ and $(6,80)$. Find $y$ for $x=10$.
34. $T=kn+50$, $T=80$ when $n=6$. Find $k$.
35. $B=0.25u+c$, $B=40$ when $u=100$. Find $c$.
36. $C=5d+10$. Find $C$ when $d=8$.
37. Partly constant with points $(1,7)$ and $(3,13)$. Find $c$.
38. $y=kx+c$ with $(5,20)$ and $(9,32)$. Find $y$ when $x=0$.
39. $T=5n+50$. Find $n$ when $T=110$.
40. H.P. deposit $\$100$ and $12$ instalments of $\$20$. Find total.`,
    },
    {
      title: '9) Structured Test Section',
      content: String.raw`1. Show in $A=6l^2$ that $k=6$ using $l=2,\;A=24$.
2. With $(n,T)=(6,80),(10,100)$, find total cost for $15$ subjects.
3. If $H\propto a$ and $H=1.5$ at $a=3$, find $H$ at $a=10$.
4. Show in $y=\frac{k}{x}$ that $xy$ is constant.
5. Journey takes $3$ h at $60$ km/h. Find speed for $2$ h completion.
6. Bill model $T=0.21u+10.50$: compute for $u=250$.
7. $V\propto r^2h$, given $V=154$ at $r=7,h=1$, find $V$ at $r=14,h=0.5$.
8. Show graph of $y=3x$ passes through origin.
9. $T=8-0.0002t$: find thickness at $t=20000$.
10. $I\propto PRT$, with $k=1$: find $I$ for $P=2000,R=0.05,T=4$.`,
    },
    {
      title: '10) Comprehensive Memo and Solutions',
      content: String.raw`### Mixed revision answers (1-40)
1) $5$
2) $50$
3) $10$
4) $7$
5) $2$
6) $616$
7) $108$
8) $45$
9) $9$
10) $3$
11) $20$
12) $5$
13) $4$
14) $2$
15) $8$
16) $3$
17) $6$
18) $10$
19) $10$
20) $25$
21) $2$
22) $80$
23) $40$
24) $1$
25) $15$
26) $12$
27) $1$
28) $550$
29) $1$
30) $9$
31) $20$
32) $5$
33) $100$
34) $5$
35) $15$
36) $50$
37) $4$
38) $5$
39) $12$
40) $340$

### Structured test answers
1. $k=6$
2. $\$125$
3. $5\text{ m}$
4. $xy=k$ (constant)
5. $90\text{ km/h}$
6. $\$63.00$
7. $308$
8. passes through origin
9. $4\text{ mm}$
10. $\$400$`,
    },
  ],
  key_points: [
    'Always convert proportional statements into equations with k.',
    'Direct variation has constant ratio and passes through the origin.',
    'Inverse variation has constant product and hyperbolic graph.',
    'Joint variation combines multiple variables multiplicatively.',
    'Partial variation includes both fixed and variable terms.',
    'Graph shape helps identify the type of variation quickly.',
  ],
  exam_tips: [
    'Write the variation form first before substituting values.',
    'Solve for k early to avoid multi-step errors later.',
    'Check whether relationship uses x, x^2, sqrt(x), or 1/x patterns.',
    'For partial variation, use two data points to solve simultaneous equations for k and c.',
  ],
  visual_descriptions: [
    'Comparison chart of direct, inverse, joint, and partial variation forms',
    'Graph gallery: line through origin, hyperbola, and transformed linear models',
    'Step-by-step flow map for deriving and solving variation equations',
  ],
};

const rotationTransformationMasterNotes: MathTopicNotes = {
  topic: 'Rotation (Transformation)',
  subject: 'Mathematics',
  grade_level: 'O-Level Form 4',
  summary:
    'Comprehensive Form 4 rotation notes covering coordinate rules, non-origin centers, polygon rotations, full-description methods, combined transformations, and revision/test memo.',
  sections: [
    {
      title: '1) Fundamental Definition and Properties of Rotation',
      videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%204/Mastering_Rotation.mp4',
      content: String.raw`Rotation is a rigid transformation (isometry) that turns a shape about a fixed point.

Full specification requires:
1. Centre of rotation
2. Angle of rotation
3. Direction (clockwise or anticlockwise)

Properties preserved:
- lengths
- angles
- shape and area

Unlike enlargement or shear, rotation preserves congruence fully.`,
    },
    {
      title: '2) Rotation About the Origin (0,0)',
      content: String.raw`Core rules:
- $90^\circ$ CW (Transformation V): $(x,y)\to (y,-x)$
- $90^\circ$ ACW: $(x,y)\to (-y,x)$
- $180^\circ$ (Transformation N): $(x,y)\to (-x,-y)$

### Worked examples: Transformation V
1. $(4,7)\to (7,-4)$
2. $(-2,5)\to (5,2)$
3. $(6,-3)\to (-3,-6)$
4. $(-8,-1)\to (-1,8)$
5. $(0,4)\to (4,0)$
6. $(10,0)\to (0,-10)$
7. $(-5,-5)\to (-5,5)$
8. $(12,5)\to (5,-12)$

### Worked examples: $90^\circ$ ACW
1. $(3,2)\to (-2,3)$
2. $(-4,6)\to (-6,-4)$
3. $(-1,-7)\to (7,-1)$
4. $(5,-2)\to (2,5)$
5. $(0,-9)\to (9,0)$
6. $(8,0)\to (0,8)$
7. $(-3,-3)\to (3,-3)$
8. $(1,10)\to (-10,1)$

### Worked examples: Transformation N
1. $(5,6)\to (-5,-6)$
2. $(-3,4)\to (3,-4)$
3. $(2,-8)\to (-2,8)$
4. $(-7,-2)\to (7,2)$
5. $(0,5)\to (0,-5)$
6. $(-6,0)\to (6,0)$
7. $(1,1)\to (-1,-1)$
8. $(9,-9)\to (-9,9)$

Common errors:
- sign mistakes such as forgetting $-(-x)=+x$
- mixing up V and ACW rules.`,
    },
    {
      title: '3) Rotation About a Point Other Than the Origin',
      content: String.raw`Three-step method:
1. Translate point relative to center.
2. Apply origin rotation rule.
3. Translate back.

### Worked examples
1. Rotate $(6,4)$ by $90^\circ$ CW about $(2,2)$:
   $(6,4)-(2,2)=(4,2)\to (2,-4)\to (4,-2)$.
2. Rotate $(1,5)$ by $180^\circ$ about $(3,1)$:
   $(1,5)-(3,1)=(-2,4)\to (2,-4)\to (5,-3)$.
3. Rotate $(0,0)$ by $90^\circ$ ACW about $(-2,1)$:
   $(2,-1)\to (1,2)\to (-1,3)$.
4. Rotate $(4,-1)$ by $90^\circ$ CW about $(5,5)$:
   $(-1,-6)\to (-6,1)\to (-1,6)$.
5. Rotate $(7,2)$ by $180^\circ$ about $(4,2)$:
   $(3,0)\to (-3,0)\to (1,2)$.
6. Rotate $(-3,-3)$ by $90^\circ$ ACW about $(0,-2)$:
   $(-3,-1)\to (1,-3)\to (1,-5)$.`,
    },
    {
      title: '4) Rotating Geometric Shapes and Polygons',
      content: String.raw`Rotate each vertex independently, then reconnect image points.

### Worked examples
1. Triangle $A(1,2),B(4,2),C(1,5)$ by V:
   $A'(2,-1),B'(2,-4),C'(5,-1)$.
2. Quadrilateral $J(-2,1),K(-1,1),L(-1,3),M(-2,3)$ by N:
   $J'(2,-1),K'(1,-1),L'(1,-3),M'(2,-3)$.
3. Triangle $P(2,2),Q(5,2),R(2,4)$ by $90^\circ$ ACW:
   $P'(-2,2),Q'(-2,5),R'(-4,2)$.
4. Square $A(2,2),B(4,2),C(4,4),D(2,4)$ by V:
   $A'(2,-2),B'(2,-4),C'(4,-4),D'(4,-2)$.
5. Triangle $X(-3,-1),Y(-1,-1),Z(-3,-4)$ by N:
   $X'(3,1),Y'(1,1),Z'(3,4)$.
6. Triangle $D(0,3),E(3,3),F(0,6)$ by $90^\circ$ ACW:
   $D'(-3,0),E'(-3,3),F'(-6,0)$.

Label image vertices with prime notation (e.g., $A'$).`,
    },
    {
      title: '5) Describing a Rotation Fully',
      content: String.raw`A full description must include:
- transformation type (rotation)
- center
- angle and direction

### Worked examples
1. $(1,4)\to (4,-1)$ and $(1,1)\to (1,-1)$:
   rule $(x,y)\to(y,-x)$, so rotation $90^\circ$ CW about $(0,0)$.
2. $(2,3)\to(-2,-3)$ and $(5,3)\to(-5,-3)$:
   rule N, so rotation $180^\circ$ about $(0,0)$.
3. If $B(4,4)$ remains fixed while $A(0,4)\to A'(4,0)$:
   center is invariant point $(4,4)$ and rotation is $90^\circ$ ACW.
4. $(3,3)\to(-3,3)$:
   $90^\circ$ ACW about origin.
5. $(2,0)\to(0,2)$ and $(4,0)\to(0,4)$:
   center resolves to origin; rotation $90^\circ$ ACW.
6. $(1,1)\to(-1,-1)$:
   rotation $180^\circ$ about origin.`,
    },
    {
      title: '6) Combining Rotation with Other Transformations',
      content: String.raw`Order matters: rotate first, then apply next transformation.

### Worked examples
1. $(3,1)$ by V then translate by $\begin{pmatrix}2\\4\end{pmatrix}$:
   $(3,1)\to(1,-3)\to(3,1)$.
2. $(2,5)$ by N then translate by $\begin{pmatrix}-2\\-5\end{pmatrix}$:
   $(2,5)\to(-2,-5)\to(-4,-10)$.
3. $(0,4)$ by ACW then translate by $\begin{pmatrix}4\\0\end{pmatrix}$:
   $(0,4)\to(-4,0)\to(0,0)$.
4. $(1,-2)$ by V then $\begin{pmatrix}1\\1\end{pmatrix}$:
   $(1,-2)\to(-2,-1)\to(-1,0)$.
5. $(3,3)$ by N then $\begin{pmatrix}3\\3\end{pmatrix}$:
   $(3,3)\to(-3,-3)\to(0,0)$.
6. $(-2,4)$ by ACW then $\begin{pmatrix}6\\2\end{pmatrix}$:
   $(-2,4)\to(-4,-2)\to(2,0)$.`,
    },
    {
      title: '7) Mixed Revision, Structured Test, and Memo',
      content: String.raw`### Mixed revision (35 prompts)
Includes single-point rotations, polygon rotations, full-description tasks, non-origin centers, and combined transformation chains.

### Structured test (10 prompts)
Includes:
1. Full-description components
2. Applying V to point coordinates
3. Rotating polygons under N
4. Non-origin ACW rotation
5. Describing mapping rules
6. Identifying N from coordinate behavior
7. Verifying equivalence ($90^\circ$ CW = $270^\circ$ ACW)
8. Rotation then translation
9. Invariant-point center identification

### Memo highlights
- Rule V: $(x,y)\to(y,-x)$
- Rule ACW: $(x,y)\to(-y,x)$
- Rule N: $(x,y)\to(-x,-y)$
- Rotation is an isometry: area, lengths, and angles remain unchanged.
- Centre of rotation is invariant if a point does not move.`,
    },
  ],
  key_points: [
    'Rotation is fully defined by center, angle, and direction.',
    'Transformation V is 90 degrees clockwise: (x, y) -> (y, -x).',
    'Transformation N is 180 degrees: (x, y) -> (-x, -y).',
    'For non-origin centers: translate, rotate, then translate back.',
    'Rotate polygons vertex-by-vertex and label image points with primes.',
    'Rotation is an isometry and preserves shape, size, angles, and area.',
  ],
  exam_tips: [
    'Memorize V, ACW, and N coordinate rules and check signs carefully.',
    'Always state center and direction when describing a rotation.',
    'When center is not origin, write all three steps to avoid coordinate drift.',
    'In chained transformations, use the intermediate image before the next step.',
  ],
  visual_descriptions: [
    'Origin-rotation rule wheel showing V, ACW, and N mappings by quadrant',
    'Three-step non-origin rotation diagram (translate, rotate, reverse)',
    'Polygon before-after rotation grid with prime-labeled image vertices',
  ],
};

const enlargementTransformationMasterNotes: MathTopicNotes = {
  topic: 'Enlargement (Transformation)',
  subject: 'Mathematics',
  grade_level: 'O-Level Form 4',
  summary:
    'Comprehensive Form 4 notes on enlargement, including scale factor logic, origin and non-origin centers, finding k and center, area/volume effects, and assessment practice.',
  sections: [
    {
      title: '1) Fundamental Principles of Enlargement',
      videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%204/Understanding_Enlargement.mp4',
      content: String.raw`Enlargement is a similarity transformation, not an isometry.

Definitions:
- Enlargement: proportional change in size about a fixed center.
- Centre of enlargement: invariant point.
- Scale factor:
  $k=\frac{\text{distance of image from center}}{\text{distance of object from center}}$.

Effect of $k$:
- $k>1$: larger image
- $0<k<1$: reduction
- $k<0$: image on opposite side of center (inverted)
- $k<-1$: inverted enlargement
- $-1<k<0$: inverted reduction

Preserved: shape, angle.
Not preserved: lengths (unless $|k|=1$).`,
    },
    {
      title: '2) Enlargement About the Origin (0,0)',
      content: String.raw`Rule about origin:
$(x,y)\to(kx,ky)$.

### Worked examples
For triangle $A(2,2),B(4,2),C(2,4)$:
1. $k=2$:
   $A'(4,4),B'(8,4),C'(4,8)$.
2. $k=3$:
   $A'(6,6),B'(12,6),C'(6,12)$.
3. $k=0.5$:
   $A'(1,1),B'(2,1),C'(1,2)$.
4. $k=-1$:
   $A'(-2,-2),B'(-4,-2),C'(-2,-4)$.
5. $k=-2$:
   $A'(-4,-4),B'(-8,-4),C'(-4,-8)$.
6. Point examples:
   $P(1,2)\xrightarrow{k=1.5}P'(1.5,3)$,
   $Q(3,2)\xrightarrow{k=1.5}Q'(4.5,3)$.
7. $M(6,8)\xrightarrow{k=-0.5}M'(-3,-4)$.
8. $N(0.2,0.5)\xrightarrow{k=10}N'(2,5)$.

### Practice Exercise 2.1
1. Image of $(4,7)$ for $k=3$ about origin.
2. Image of $(-10,5)$ for $k=0.2$.
3. Square $(1,1),(2,1),(2,2),(1,2)$ for $k=-2$.
4. Image of $(0,-6)$ for $k=0.5$.
5. Image of $(-3,-4)$ for $k=-1$.`,
    },
    {
      title: '3) Enlargement About a Given Centre (a,b)',
      content: String.raw`Vector method:
\[
\begin{pmatrix}x'\\y'\end{pmatrix}
=
k\begin{pmatrix}x-a\\y-b\end{pmatrix}
\;+\;
\begin{pmatrix}a\\b\end{pmatrix}
\]

Coordinate form:
- $x'=k(x-a)+a$
- $y'=k(y-b)+b$

### Worked examples
1. Centre $(1,1)$, $k=2$, $A(3,4)$:
   $A'(5,7)$.
2. Centre $(2,0)$, $k=3$, $B(4,1)$:
   $B'(8,3)$.
3. Centre $(0,2)$, $k=0.5$, $C(2,6)$:
   $C'(1,4)$.
4. Centre $(-1,-1)$, $k=2$, $D(1,1)$:
   $D'(3,3)$.
5. Centre $(5,5)$, $k=-1$, $E(7,8)$:
   $E'(3,2)$.
6. Centre $(2,2)$, $k=-2$, $F(3,3)$:
   $F'(0,0)$.
7. Centre $(10,10)$, $k=0.1$, $G(20,30)$:
   $G'(11,12)$.
8. Centre $(4,-2)$, $k=1.5$, $H(6,2)$:
   $H'(7,4)$.

### Practice Exercise 3.1
1. Image of $(5,5)$ with centre $(2,2)$, $k=4$.
2. Image of $(0,0)$ with centre $(3,3)$, $k=2$.
3. Image of $(8,4)$ with centre $(0,4)$, $k=0.5$.
4. Apply $k=-3$ to $(1,1)$ about origin.
5. Enlarge $(2,3)$ about $(1,1)$ with $k=-2$.`,
    },
    {
      title: '4) Determining Scale Factor and Centre',
      content: String.raw`Scale factor:
\[
k=\frac{\text{image length}}{\text{object length}}
\]
or using distances from center.

To find center:
- Join corresponding points $A\to A'$ and $B\to B'$.
- Intersection of these lines is center of enlargement.

### Worked examples
1. $AB=4$, $A'B'=12$:
   $k=12/4=3$.
2. $A(2,2)\to A'(4,4)$ about origin:
   $k=2$.
3. Inverted case with distances $5$ and $10$:
   $k=-10/5=-2$.
4. If $P(1,1)\to P'(1,1)$:
   $(1,1)$ is invariant (center).
5. Area changes from $10$ to $90$:
   $k^2=9\Rightarrow k=3$ (or $-3$ if orientation indicates inversion).
6. $A(3,3)\to A'(-3,-3)$ about origin:
   $k=-1$.`,
    },
    {
      title: '5) Area and Volume Relationships',
      content: String.raw`If linear scale factor is $k$:
- $\text{new area}=k^2\times \text{original area}$
- $\text{new volume}=k^3\times \text{original volume}$

### Worked examples
1. Area $15\text{ mm}^2$, $k=4$:
   new area $=16\times 15=240\text{ mm}^2$.
2. Similar shed with $k=2$:
   floor-area factor $=k^2=4$.
3. Cube volume $8\text{ cm}^3$, $k=3$:
   new volume $=27\times 8=216\text{ cm}^3$.
4. Area $100\text{ m}^2$, $k=0.5$:
   new area $=25\text{ m}^2$.
5. Volume increases by factor $64$:
   $k^3=64\Rightarrow k=4$.
6. Cylinder with doubled dimensions ($k=2$):
   volume multiplies by $8$.`,
    },
    {
      title: '6) Applications and Multi-Step Problems',
      content: String.raw`Example:
Enlarge $(2,2)$ by $k=2$ about origin, then translate by
$\begin{pmatrix}3\\1\end{pmatrix}$.

1. Enlargement: $(2,2)\to(4,4)$
2. Translation:
   $\begin{pmatrix}4\\4\end{pmatrix}+\begin{pmatrix}3\\1\end{pmatrix}
   =
   \begin{pmatrix}7\\5\end{pmatrix}$
3. Final image: $(7,5)$.

General reminder:
- In combined transformations, apply operations in the stated order.`,
    },
    {
      title: '7) Common Errors and Remediation',
      content: String.raw`1. Partial scaling:
   scaling only $x$ or only $y$.
   Fix: apply $k$ to both coordinates.
2. Sign/inversion errors for $k<0$:
   image must be on opposite side of center.
3. Wrong center assumption:
   do not default to origin if center is given as $(a,b)$.
4. Area/volume confusion:
   use $k^2$ for area and $k^3$ for volume.`,
    },
    {
      title: '8) Comprehensive Revision and Assessment',
      content: String.raw`### Mixed revision (40 prompts)
1-10. Images about origin for assorted $k$ values:
$2,5,-1,0.5,-3,10,1,-2,0.1,-0.1$.
11-20. Images about centre $(2,2)$ for $k$ values:
$2,3,-1,0.5$.
21-30. Determine $k$ from object-image pairs (e.g., $A(1,1)\to A'(3,3)$ about origin).
31-40. Area/volume scaling tasks (e.g., if $k=5$, area factor? if area factor is $49$, find $k$).

### Structured test (10 prompts)
Includes "Describe fully" questions, coordinate mapping, center/scale deduction, and multi-step coordinate geometry.

### Memorandum guidance
- Use $k=\frac{\text{image length}}{\text{object length}}$.
- Confirm centre from intersection of corresponding-point lines.
- For origin center, apply $(x,y)\to(kx,ky)$ directly.
- For non-origin center, use
  $x'=k(x-a)+a,\; y'=k(y-b)+b$.`,
    },
  ],
  key_points: [
    'Enlargement preserves shape and angles but changes size.',
    'Scale factor k controls size, side, and inversion behavior.',
    'Origin rule is (x, y) -> (kx, ky).',
    'Non-origin enlargement uses translate-scale-translate logic.',
    'Area and volume scale by k^2 and k^3 respectively.',
    'The centre of enlargement is the unique invariant point.',
  ],
  exam_tips: [
    'State both centre and scale factor when describing enlargement.',
    'For k < 0, verify the image lies opposite the centre.',
    'Use ratios of corresponding lengths to compute k quickly.',
    'In area/volume questions, never use k directly without squaring/cubing.',
  ],
  visual_descriptions: [
    'Scale-factor behavior chart for positive, fractional, and negative k values',
    'Origin vs non-origin enlargement workflow diagram',
    'Object-image-center collinearity sketch for centre determination',
  ],
};

const reflectionTransformationMasterNotes: MathTopicNotes = {
  topic: 'Reflection (Transformation)',
  subject: 'Mathematics',
  grade_level: 'O-Level Form 4',
  summary:
    'Comprehensive reflection notes covering axis rules, reflection in y=x, lines x=a and y=b, polygon mapping, full descriptions, combined transformations, and exam-style revision.',
  sections: [
    {
      title: '1) Introduction and Definition of Reflection',
      videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%204/Mastering_Reflection_in_Math.mp4',
      content: String.raw`Reflection is a rigid transformation (isometry) that maps a shape across a mirror line.

Key ideas:
- Mirror line (line of reflection) is the axis of symmetry.
- Object and image are equal in size and shape.
- Orientation is reversed (lateral inversion).
- Corresponding points are at equal perpendicular distances from the mirror line.

Reflection preserves:
- lengths
- angles
- area`,
    },
    {
      title: '2) Reflection in Coordinate Axes',
      content: String.raw`Rules:
- In x-axis: $(x,y)\to(x,-y)$
- In y-axis: $(x,y)\to(-x,y)$

### Worked examples (x-axis)
1. $(4,7)\to(4,-7)$
2. $(-3,5)\to(-3,-5)$
3. $(8,-2)\to(8,2)$
4. $(0,6)\to(0,-6)$
5. $(-5,-9)\to(-5,9)$
6. $(2,0)\to(2,0)$
7. $(12,-1)\to(12,1)$
8. $(-10,4)\to(-10,-4)$

### Worked examples (y-axis)
9. $(5,2)\to(-5,2)$
10. $(-7,8)\to(7,8)$
11. $(1,-4)\to(-1,-4)$
12. $(-6,-6)\to(6,-6)$
13. $(0,3)\to(0,3)$
14. $(9,0)\to(-9,0)$
15. $(-11,15)\to(11,15)$
16. $(4,-10)\to(-4,-10)$

### Practice Exercise 2.1
1. Reflect $(5,8)$ in x-axis.
2. Reflect $(-4,-7)$ in y-axis.
3. Reflect $(0,-2)$ in x-axis.
4. Reflect $(10,0)$ in y-axis.
5. Reflect $(-3,9)$ in x-axis.`,
    },
    {
      title: '3) Reflection in the Line y = x',
      content: String.raw`Rule:
$(x,y)\to(y,x)$.

### Worked examples
17. $(3,-1)\to(-1,3)$
18. $(6,6)\to(6,6)$
19. $(0,5)\to(5,0)$
20. $(-2,-8)\to(-8,-2)$
21. $(7,2)\to(2,7)$
22. $(-4,10)\to(10,-4)$
23. $(1,0)\to(0,1)$
24. $(-9,-9)\to(-9,-9)$

### Practice Exercise 3.1
1. Reflect $(4,11)$ in $y=x$.
2. Reflect $(-6,2)$ in $y=x$.
3. Reflect $(0,-5)$ in $y=x$.
4. Reflect $(7,7)$ in $y=x$.
5. Reflect $(-12,-3)$ in $y=x$.`,
    },
    {
      title: '4) Reflection in Lines x = a and y = b',
      content: String.raw`Distance method:
- For line $x=a$, only x-coordinate changes:
  $x' = 2a - x$, $y'=y$.
- For line $y=b$, only y-coordinate changes:
  $y' = 2b - y$, $x'=x$.

### Worked examples (x=a)
25. $(2,5)$ in $x=4$: $(6,5)$
26. $(6,1)$ in $x=3$: $(0,1)$
27. $(-1,4)$ in $x=1$: $(3,4)$
28. $(5,-2)$ in $x=2$: $(-1,-2)$
29. $(0,3)$ in $x=-2$: $(-4,3)$
30. $(4,4)$ in $x=4$: $(4,4)$

### Worked examples (y=b)
31. $(3,1)$ in $y=4$: $(3,7)$
32. $(2,6)$ in $y=3$: $(2,0)$
33. $(-4,-1)$ in $y=1$: $(-4,3)$
34. $(5,0)$ in $y=-3$: $(5,-6)$
35. $(1,2)$ in $y=2$: $(1,2)$
36. $(0,5)$ in $y=0$: $(0,-5)$`,
    },
    {
      title: '5) Reflecting Geometric Shapes',
      content: String.raw`Use vertex-by-vertex mapping and prime labels.

### Worked examples
37. Triangle $A(2,1),B(5,1),C(2,4)$ in x-axis:
    $A'(2,-1),B'(5,-1),C'(2,-4)$.
38. Triangle $D(-1,2),E(-1,5),F(-3,2)$ in y-axis:
    $D'(1,2),E'(1,5),F'(3,2)$.
39. Square $J(1,1),K(2,1),L(2,2),M(1,2)$ in $y=x$:
    $J'(1,1),K'(1,2),L'(2,2),M'(2,1)$.
40. Triangle $P(4,3),Q(6,3),R(4,6)$ in $y=2$:
    $P'(4,1),Q'(6,1),R'(4,-2)$.
41. Triangle $A(0,0),B(2,0),C(0,3)$ in $x=3$:
    $A'(6,0),B'(4,0),C'(6,3)$.
42. Quadrilateral $S(-2,-2),T(-1,-2),U(-1,-4),V(-2,-4)$ in y-axis:
    $S'(2,-2),T'(1,-2),U'(1,-4),V'(2,-4)$.
43. Triangle $X(1,2),Y(3,2),Z(1,5)$ in x-axis:
    $X'(1,-2),Y'(3,-2),Z'(1,-5)$.
44. Triangle $G(2,2),H(4,2),I(2,5)$ in $y=x$:
    $G'(2,2),H'(2,4),I'(5,2)$.`,
    },
    {
      title: '6) Describing a Reflection Fully',
      content: String.raw`A full description includes:
1. Transformation type: Reflection
2. Mirror line equation

### Worked examples
45. $(3,5)\to(3,-5)$: reflection in x-axis.
46. $(2,4)\to(-2,4)$: reflection in y-axis.
47. $(1,4)\to(4,1)$: reflection in $y=x$.
48. $(2,3)\to(6,3)$:
    midpoint is $(4,3)$ so mirror line is $x=4$.
49. $(5,1)\to(5,5)$:
    midpoint is $(5,3)$ so mirror line is $y=3$.
50. $(1,1),(3,1),(1,2)\to(-1,1),(-3,1),(-1,2)$:
    reflection in y-axis.`,
    },
    {
      title: '7) Combined Transformations and Applications',
      content: String.raw`Order is important.

### Worked examples
51. Reflect $(2,4)$ in y-axis then translate by $\begin{pmatrix}3\\2\end{pmatrix}$:
    $(-2,4)\to(1,6)$.
52. Reflect $(1,1)$ in $y=x$ then in x-axis:
    $(1,1)\to(1,1)\to(1,-1)$.
53. Reflect $(3,2)$ in $x=1$ then translate by $\begin{pmatrix}0\\-4\end{pmatrix}$:
    $(-1,2)\to(-1,-2)$.
54. Reflect $(0,5)$ in x-axis then y-axis:
    $(0,-5)\to(0,-5)$.
55. Reflect $(2,2)$ in $y=4$ then in $x=3$:
    $(2,6)\to(4,6)$.
56. Reflect $(5,3)$ in $y=x$ then translate by $\begin{pmatrix}-2\\-2\end{pmatrix}$:
    $(3,5)\to(1,3)$.`,
    },
    {
      title: '8) Common Errors and Pitfalls',
      content: String.raw`1. Mixing rules:
   x-axis uses $(x,-y)$; y-axis uses $(-x,y)$.
2. Confusing reflection with rotation.
3. Measuring to origin instead of mirror line for $x=a$ or $y=b$.
4. Missing prime notation on image points.
5. Forgetting points on mirror line are invariant.`,
    },
    {
      title: '9) Mixed Revision and Structured Test',
      content: String.raw`### Mixed revision
Includes 35 questions on:
- reflections in axes, $y=x$, $x=a$, $y=b$
- full-description identification
- chained reflection + translation operations
- midpoint/mirror-line deduction

### Structured test
10 standard prompts covering:
1. polygon reflection
2. point reflection in $y=x$
3. full description from mapped coordinates
4. reflection in vertical line
5. reflection then translation
6. inverse coordinate reconstruction
7. symbolic point recovery
8. invariant cases
9. mirror-line deduction
10. double reflection sequence`,
    },
    {
      title: '10) Complete Memo and Worked Solutions',
      content: String.raw`Key answer snapshots:
- Section 2 checks:
  $(5,8)\to(5,-8)$,
  $(-4,-7)\to(4,-7)$,
  $(0,-2)\to(0,2)$,
  $(10,0)\to(-10,0)$,
  $(-3,9)\to(-3,-9)$.
- Section 3 checks:
  $(4,11)\to(11,4)$,
  $(-6,2)\to(2,-6)$,
  $(0,-5)\to(-5,0)$,
  $(7,7)\to(7,7)$,
  $(-12,-3)\to(-3,-12)$.
- Section 4 checks:
  $(2,3)$ in $x=5\to(8,3)$,
  $(7,6)$ in $x=2\to(-3,6)$,
  $(-3,4)$ in $x=0\to(3,4)$,
  $(1,1)$ in $x=-2\to(-5,1)$,
  $(4,2)$ in $y=5\to(4,8)$.
- Structured test highlights:
  $A'(-1,1),B'(-3,1),C'(-1,4)$ for first polygon question;
  $(5,2)$ in $y=x\to(2,5)$;
  $(2,3)\to(2,7)$ gives mirror line $y=5$.`,
    },
  ],
  key_points: [
    'Reflection is an isometry that flips orientation across a mirror line.',
    'x-axis reflection keeps x and changes sign of y.',
    'y-axis reflection keeps y and changes sign of x.',
    'Reflection in y = x swaps coordinates.',
    'For x = a and y = b use distance-to-line or x=2a-x, y=2b-y.',
    'Corresponding points and mirror line satisfy perpendicular bisector property.',
  ],
  exam_tips: [
    'Identify which coordinate remains invariant from the mirror line orientation.',
    'Use midpoint method to deduce unknown mirror lines quickly.',
    'Apply transformations in the exact order given in combined questions.',
    'Always label image points with prime notation to avoid mark loss.',
  ],
  visual_descriptions: [
    'Mirror-line rule map for x-axis, y-axis, y=x, x=a, and y=b',
    'Perpendicular bisector diagram linking object-image point pairs',
    'Sequential transformation storyboard for reflection-translation chains',
  ],
};

const translationTransformationMasterNotes: MathTopicNotes = {
  topic: 'Translation (Transformation)',
  subject: 'Mathematics',
  grade_level: 'O-Level Form 4',
  summary:
    'Comprehensive Form 4 translation notes covering vector notation, point and polygon mapping, reverse-vector deduction, combined transformations, and full revision with memo.',
  sections: [
    {
      title: '1) Fundamental Principles of Translation',
      videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%204/Getting_Straight__Translation.mp4',
      content: String.raw`Translation is a rigid transformation (isometry) that moves a shape in a straight-line direction by a fixed vector.

Invariants under translation:
- length
- angle
- shape
- orientation

Translation is uniquely described by a vector, unlike transformations that require a mirror line or center.`,
    },
    {
      title: '2) Column Vector Representation',
      content: String.raw`Standard translation vector:
$\begin{pmatrix}a\\b\end{pmatrix}$.

Interpretation:
- $a$: horizontal shift (right if positive, left if negative)
- $b$: vertical shift (up if positive, down if negative)

Examples:
1. $\begin{pmatrix}3\\-2\end{pmatrix}$: right 3, down 2
2. $\begin{pmatrix}-5\\4\end{pmatrix}$: left 5, up 4
3. $\begin{pmatrix}7\\0\end{pmatrix}$: right 7
4. $\begin{pmatrix}0\\-6\end{pmatrix}$: down 6
5. $\begin{pmatrix}-1\\-1\end{pmatrix}$: left 1, down 1
6. $\begin{pmatrix}10\\12\end{pmatrix}$: right 10, up 12
7. $\begin{pmatrix}-8\\0\end{pmatrix}$: left 8
8. $\begin{pmatrix}4\\-4\end{pmatrix}$: right 4, down 4

Common errors:
- swapping x and y components
- sign-direction confusion.`,
    },
    {
      title: '3) Translating Points on the Coordinate Plane',
      content: String.raw`Formula:
\[
\begin{pmatrix}x'\\y'\end{pmatrix}
=
\begin{pmatrix}x\\y\end{pmatrix}
+
\begin{pmatrix}a\\b\end{pmatrix}
=
\begin{pmatrix}x+a\\y+b\end{pmatrix}
\]

### Worked examples
1. $A(3,5)+\begin{pmatrix}2\\4\end{pmatrix}=A'(5,9)$
2. $B(-4,2)+\begin{pmatrix}5\\-3\end{pmatrix}=B'(1,-1)$
3. $C(0,-7)+\begin{pmatrix}-3\\6\end{pmatrix}=C'(-3,-1)$
4. $D(8,12)+\begin{pmatrix}-8\\-12\end{pmatrix}=D'(0,0)$
5. $E(-5,-5)+\begin{pmatrix}10\\2\end{pmatrix}=E'(5,-3)$
6. $F(2,-1)+\begin{pmatrix}0\\-4\end{pmatrix}=F'(2,-5)$
7. $G(-2,8)+\begin{pmatrix}-3\\-10\end{pmatrix}=G'(-5,-2)$
8. $H(6,0)+\begin{pmatrix}-4\\5\end{pmatrix}=H'(2,5)$

### Maths Meter practice
1. $(2,2)+\begin{pmatrix}-3\\-3\end{pmatrix}$
2. $(0,4)+\begin{pmatrix}5\\-6\end{pmatrix}$
3. $(-1,-1)+\begin{pmatrix}1\\1\end{pmatrix}$
4. $(10,5)+\begin{pmatrix}-12\\-2\end{pmatrix}$
5. $(-8,3)+\begin{pmatrix}3\\-3\end{pmatrix}$
6. $(4,-4)+\begin{pmatrix}-4\\4\end{pmatrix}$
7. $(7,1)+\begin{pmatrix}-2\\0\end{pmatrix}$
8. $(-5,-2)+\begin{pmatrix}5\\2\end{pmatrix}$
9. $(3,3)+\begin{pmatrix}-6\\0\end{pmatrix}$
10. $(0,0)+\begin{pmatrix}-5\\-5\end{pmatrix}$`,
    },
    {
      title: '4) Translation of Geometric Shapes',
      content: String.raw`Procedure:
1. List all vertices
2. Add the same vector to each vertex
3. Label image vertices with prime notation

### Worked examples
1. Triangle $A(2,2),B(5,2),C(2,6)$ by $\begin{pmatrix}3\\1\end{pmatrix}$:
   $A'(5,3),B'(8,3),C'(5,7)$.
2. Square $P(1,1),Q(3,1),R(3,3),S(1,3)$ by $\begin{pmatrix}-2\\-2\end{pmatrix}$:
   $P'(-1,-1),Q'(1,-1),R'(1,1),S'(-1,1)$.
3. Triangle $L(2,4),M(4,4),N(2,7)$ by $\begin{pmatrix}0\\-4\end{pmatrix}$:
   $L'(2,0),M'(4,0),N'(2,3)$.
4. Rectangle $W(0,0),X(4,0),Y(4,2),Z(0,2)$ by $\begin{pmatrix}5\\5\end{pmatrix}$:
   $W'(5,5),X'(9,5),Y'(9,7),Z'(5,7)$.
5. Triangle $D(-3,0),E(-1,0),F(-2,3)$ by $\begin{pmatrix}4\\-2\end{pmatrix}$:
   $D'(1,-2),E'(3,-2),F'(2,1)$.
6. Segment $J(2,2),K(2,5)$ by $\begin{pmatrix}-5\\0\end{pmatrix}$:
   $J'(-3,2),K'(-3,5)$.`,
    },
    {
      title: '5) Determining the Vector of Translation',
      content: String.raw`Given object and image:
\[
\text{Vector}=
\begin{pmatrix}
x_{\text{image}}-x_{\text{object}}\\
y_{\text{image}}-y_{\text{object}}
\end{pmatrix}
\]

### Worked examples
1. $(2,3)\to(5,8)$ gives $\begin{pmatrix}3\\5\end{pmatrix}$.
2. $(-1,4)\to(2,0)$ gives $\begin{pmatrix}3\\-4\end{pmatrix}$.
3. $(0,0)\to(-4,-6)$ gives $\begin{pmatrix}-4\\-6\end{pmatrix}$.
4. $(10,10)\to(5,15)$ gives $\begin{pmatrix}-5\\5\end{pmatrix}$.
5. $(-2,-2)\to(0,0)$ gives $\begin{pmatrix}2\\2\end{pmatrix}$.
6. $(7,-3)\to(7,4)$ gives $\begin{pmatrix}0\\7\end{pmatrix}$.

Quick checks:
1. $(5,5)\to(10,12)$
2. $(-3,2)\to(0,0)$
3. $(1,1)\to(1,-5)$
4. $(0,8)\to(-4,8)$
5. $(-10,-10)\to(-5,-5)$`,
    },
    {
      title: '6) Combined Transformations',
      content: String.raw`Order matters in multi-step transformations.

### Worked examples
1. $(2,2)$ translated by $\begin{pmatrix}1\\3\end{pmatrix}$ then reflected in x-axis:
   $(2,2)\to(3,5)\to(3,-5)$.
2. $(1,0)$ translated by $\begin{pmatrix}-1\\4\end{pmatrix}$ then rotated $180^\circ$:
   $(1,0)\to(0,4)\to(0,-4)$.
3. $(3,1)$ reflected in y-axis then translated by $\begin{pmatrix}2\\2\end{pmatrix}$:
   $(3,1)\to(-3,1)\to(-1,3)$.
4. $(0,0)$ translated by $\begin{pmatrix}5\\0\end{pmatrix}$ then by $\begin{pmatrix}0\\5\end{pmatrix}$:
   $(0,0)\to(5,0)\to(5,5)$.
5. $(2,0)$ rotated $90^\circ$ CW then translated by $\begin{pmatrix}-2\\-2\end{pmatrix}$:
   $(2,0)\to(0,-2)\to(-2,-4)$.
6. $(5,5)$ translated by $\begin{pmatrix}-5\\-5\end{pmatrix}$ then reflected in $y=x$:
   $(5,5)\to(0,0)\to(0,0)$.`,
    },
    {
      title: '7) Advanced Applications and Coordinate Reasoning',
      content: String.raw`1. Parallelogram completion:
   $A(1,1),B(4,2),D(2,5)$.
   $\vec{AB}=\begin{pmatrix}3\\1\end{pmatrix}$,
   so $C=D+\vec{AB}=(5,6)$.
2. Find vector moving $P(4,4)$ to quadrant II:
   need $4+a<0$ and $4+b>0$.
   Example vector $\begin{pmatrix}-10\\2\end{pmatrix}$.
3. Reverse translation:
   if $K'=(2,-3)$ after $\begin{pmatrix}5\\-1\end{pmatrix}$,
   then $K=(2,-3)-\begin{pmatrix}5\\-1\end{pmatrix}=(-3,-2)$.
4. Combined vectors:
   $\vec{u}=\begin{pmatrix}2\\3\end{pmatrix}$ then
   $\vec{v}=\begin{pmatrix}-5\\4\end{pmatrix}$ gives
   $\vec{u}+\vec{v}=\begin{pmatrix}-3\\7\end{pmatrix}$.
5. Length invariance:
   $A(0,0),B(3,0)$ translate by $\begin{pmatrix}1\\1\end{pmatrix}$ gives
   $A'(1,1),B'(4,1)$ and both lengths are $3$.
6. Midpoint translation:
   midpoint $(4,4)$ translated by $\begin{pmatrix}-2\\6\end{pmatrix}$ gives $(2,10)$.`,
    },
    {
      title: '8) Mastery Assessment and Solutions Memo',
      content: String.raw`### Mixed revision
1-5. Describe movement of vectors
$\begin{pmatrix}2\\4\end{pmatrix},
\begin{pmatrix}-3\\1\end{pmatrix},
\begin{pmatrix}0\\-5\end{pmatrix},
\begin{pmatrix}-6\\-6\end{pmatrix},
\begin{pmatrix}8\\0\end{pmatrix}$.
6-10. Apply those vectors to $P(5,5)$.
11-15. Find vectors from mapped point pairs.
16-20. Translate $A(-2,-3)$ by given vectors.
21-25. Multi-step transformation items.
26-30. Solve unknowns from vector equations.
31-35. Shape translation and full-description items.

### Structured test highlights
1. Define translation and list 4 invariants.
2. Translate triangle by $\begin{pmatrix}-3\\-4\end{pmatrix}$.
3. Deduce vector from $K(12,-4)\to K'(0,0)$.
4. Solve $(x,y)$ from translated image.
5. Translate then reflect in y-axis.
6. Write vector for 6 left, 3 up.
7. Solve component equation system.
8. Three consecutive identical translations from origin.
9. Explain why translation is the odd one out.
10. Rotate then translate final-image problem.

### Memo snapshots
- $(5,5)+\begin{pmatrix}2\\4\end{pmatrix}=(7,9)$
- $(5,5)+\begin{pmatrix}-6\\-6\end{pmatrix}=(-1,-1)$
- $(1,1)\to(4,4)$ gives vector $\begin{pmatrix}3\\3\end{pmatrix}$
- $(1,1)\xrightarrow{+\begin{pmatrix}2\\2\end{pmatrix}}(3,3)\xrightarrow{\text{x-axis}}(3,-3)$
- $(5,0)\xrightarrow{180^\circ}(-5,0)\xrightarrow{+\begin{pmatrix}5\\5\end{pmatrix}}(0,5)$`,
    },
  ],
  key_points: [
    'Translation moves points by adding a fixed vector.',
    'It preserves length, angle, shape, and orientation.',
    'Vector components are ordered as (horizontal, vertical).',
    'Image coordinates are (x+a, y+b).',
    'Reverse mapping uses vector subtraction.',
    'Order must be respected in combined transformations.',
  ],
  exam_tips: [
    'Write points as column vectors before adding translation vectors.',
    'Check signs carefully when adding negative components.',
    'Use prime notation to separate object and image points.',
    'In two-step transformations, use the first image as input for stage two.',
  ],
  visual_descriptions: [
    'Vector direction map with right/left/up/down sign convention',
    'Before-after polygon translation grid with corresponding labeled vertices',
    'Two-stage transformation flow diagram (translation then secondary transform)',
  ],
};

const combinedEventsProbabilityMasterNotes: MathTopicNotes = {
  topic: 'Probability',
  subject: 'Mathematics',
  grade_level: 'O-Level Form 4',
  summary:
    'Comprehensive Form 4 combined-events probability notes covering addition and multiplication laws, tree diagrams, dependent events, Venn/set methods, multi-step word problems, and revision memo.',
  sections: [
    {
      title: '1) Nature and Logic of Combined Events',
      videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%204/Combined_Events_in_Probability.mp4',
      content: String.raw`Combined events involve multiple conditions or stages.

Core ideas:
- "And" narrows success space (usually less likely).
- "Or" widens success space (usually more likely).

Pillars:
1. And events: use multiplication.
2. Or events: use addition.
3. Mutually exclusive: no overlap.
4. Independent: one event does not change the other.

Starter examples:
1. Coin + die: $P(H \cap 4)=\frac{1}{2}\cdot\frac{1}{6}=\frac{1}{12}$.
2. From $\{1,2,3,4,5\}$, even or $5$ gives $\frac{3}{5}$.
3. Bag $3R,2B$ with replacement:
   $P(R\text{ then }B)=\frac{3}{5}\cdot\frac{2}{5}=\frac{6}{25}$.
4. Two coins sample size: $4$.
5. Card is King or Queen:
   $\frac{4}{52}+\frac{4}{52}=\frac{2}{13}$.
6. One die shows both $1$ and $6$: probability $0$.`,
    },
    {
      title: '2) Addition Rule ("Or" Events)',
      content: String.raw`Rules:
- Mutually exclusive:
  $P(A\cup B)=P(A)+P(B)$.
- Non-mutually exclusive:
  $P(A\cup B)=P(A)+P(B)-P(A\cap B)$.

Reason:
Subtract intersection to avoid double counting.

Worked examples:
1. Die: $P(2\text{ or }5)=\frac{1}{6}+\frac{1}{6}=\frac{1}{3}$.
2. Students: $30$ total, $10$ soccer, $15$ rugby, $5$ both:
   $P(S\cup R)=\frac{10}{30}+\frac{15}{30}-\frac{5}{30}=\frac{2}{3}$.
3. Sets $A=\{2,4,6,8\}$, $B=\{6,8,10,12\}$ in $12$-item universe:
   $P(A\cup B)=\frac{1}{2}$.
4. Deck: Heart or Ace:
   $\frac{13}{52}+\frac{4}{52}-\frac{1}{52}=\frac{4}{13}$.
5. Tea/Coffee with overlap gives
   $P(T\cup C)=\frac{27}{40}$.
6. Two dice sum $2$ or $12$:
   $\frac{1}{36}+\frac{1}{36}=\frac{1}{18}$.
7. $50$ students, $10$ neither:
   $P(H\cup G)=\frac{4}{5}$.
8. Number $1$-$10$, prime or even:
   $\frac{4}{10}+\frac{5}{10}-\frac{1}{10}=\frac{4}{5}$.

Common error:
For overlapping events, forgetting to subtract $P(A\cap B)$.`,
    },
    {
      title: '3) Multiplication Rule ("And" Events)',
      content: String.raw`Rules:
- Independent:
  $P(A\cap B)=P(A)\cdot P(B)$.
- Dependent:
  $P(A\cap B)=P(A)\cdot P(B\mid A)$.

Worked examples:
1. Two Heads:
   $\frac{1}{2}\cdot\frac{1}{2}=\frac{1}{4}$.
2. Two sixes:
   $\frac{1}{6}\cdot\frac{1}{6}=\frac{1}{36}$.
3. If $P(A)=0.5, P(B)=0.2$ independent:
   $P(A\cap B)=0.1$.
4. Bag $4R,6B$, with replacement:
   $P(R,R)=\frac{4}{10}\cdot\frac{4}{10}=\frac{4}{25}$.
5. Tail and prime on die:
   $\frac{1}{2}\cdot\frac{3}{6}=\frac{1}{4}$.
6. Two aces with replacement:
   $\frac{1}{13}\cdot\frac{1}{13}=\frac{1}{169}$.
7. Spinner 4 colors, GGG:
   $\left(\frac{1}{4}\right)^3=\frac{1}{64}$.
8. Rain and late independent:
   $0.3\cdot 0.1=0.03$.`,
    },
    {
      title: '4) Tree Diagrams',
      content: String.raw`Tree rules:
1. Branch probabilities from one node sum to $1$.
2. Multiply along a path.
3. Add across alternative successful paths.

Worked examples:
1. Two coin tosses:
   $P(HH)=0.5\cdot 0.5=0.25$.
2. Bag $3G,2Y$ with replacement:
   $P(GY)=\frac{3}{5}\cdot\frac{2}{5}=\frac{6}{25}$.
3. Hit/Miss with $P(H)=0.7$:
   $P(HM)=0.7\cdot 0.3=0.21$.
4. Rain-late model:
   $P(L)=0.4\cdot 0.5 + 0.6\cdot 0.1 = 0.26$.
5. Girl then Grade 12:
   $0.4\cdot 0.7=0.28$.
6. Pass both subjects:
   $0.8\cdot 0.7=0.56$.`,
    },
    {
      title: '5) Without Replacement (Dependent Events)',
      content: String.raw`Without replacement means denominators shrink after each pick.

Worked examples:
1. Bag $5R,5B$, two picks:
   $P(R,R)=\frac{5}{10}\cdot\frac{4}{9}=\frac{2}{9}$.
2. Three kings from deck:
   $\frac{4}{52}\cdot\frac{3}{51}\cdot\frac{2}{50}$.
3. Bag $6G,4W$, two picks, different colors:
   $P(GW)+P(WG)=\frac{8}{15}$.
4. Socks $8B,2Br$, both brown:
   $\frac{2}{10}\cdot\frac{1}{9}=\frac{1}{45}$.
5. Bulbs $10$ with $3$ defective, neither defective:
   $\frac{7}{10}\cdot\frac{6}{9}=\frac{7}{15}$.
6. Team from $5$ boys, $5$ girls, both girls:
   $\frac{5}{10}\cdot\frac{4}{9}=\frac{2}{9}$.
7. "PROBABILITY", both B without replacement:
   $\frac{2}{11}\cdot\frac{1}{10}=\frac{1}{55}$.
8. At least one working from $12$ bulbs with $4$ defective:
   $1-\left(\frac{4}{12}\cdot\frac{3}{11}\right)=\frac{10}{11}$.`,
    },
    {
      title: '6) Venn Diagrams and Set Notation',
      content: String.raw`Use:
- Union: $A\cup B$
- Intersection: $A\cap B$
- Complements: $A', B'$

Method:
1. Fill intersection first.
2. Fill "only" regions next.
3. Fill outside (neither) last.

Worked examples:
1. $n(S)=30, n(A)=15, n(B)=12, n(A\cap B)=5$:
   $P(A\text{ only})=\frac{10}{30}=\frac{1}{3}$.
2. $50$ people, $30$ coffee, $25$ tea, $5$ neither:
   intersection $=10$, coffee only probability $=\frac{2}{5}$.
3. If $P(A)=0.7, P(B)=0.4, P(A\cup B)=0.9$:
   $P(A\cap B)=0.2$.
4. Dog/cat with overlap gives
   $P(\text{neither})=\frac{3}{8}$.
5. If $P(A')=0.6$, $P(B)=0.5$ independent:
   $P(A\cap B)=0.2$.
6. Class of $20$ where all take Art or Music:
   both $=2$, so probability $=\frac{1}{10}$.`,
    },
    {
      title: '7) Multi-Step Word Problem Strategy',
      content: String.raw`Translation guide:
- "At least one": $1-P(\text{none})$
- "Exactly one": $P(A\cap B') + P(A'\cap B)$
- "Given that": conditional probability
- "Neither": complement of union

Worked examples:
1. Three students success probs $\frac{1}{2},\frac{1}{4},\frac{1}{5}$:
   $P(\text{solved})=1-\left(\frac{1}{2}\cdot\frac{3}{4}\cdot\frac{4}{5}\right)=\frac{7}{10}$.
2. Bag $4R,2B$, two picks no replacement:
   $P(\text{at least one B})=1-\frac{4}{6}\cdot\frac{3}{5}=\frac{3}{5}$.
3. If $P(A)=0.4, P(B)=0.5$ independent:
   $P(\text{only A})=0.4\cdot 0.5=0.2$.
4. Two dice, sum $11$ or $12$:
   $\frac{3}{36}=\frac{1}{12}$.
5. Letters BOX in order B-O-X:
   $\frac{1}{3}\cdot\frac{1}{2}\cdot 1=\frac{1}{6}$.
6. If $P(A)=0.9, P(B)=0.8$ independent:
   $P(\text{neither})=0.1\cdot 0.2=0.02$.
7. Boy pass $\frac{3}{5}$, girl pass $\frac{4}{5}$:
   exactly one passes $=\frac{11}{25}$.
8. $P(A)=0.3$ for 3 independent trials:
   $P(\text{at least once})=1-(0.7)^3=0.657$.`,
    },
    {
      title: '8) Misconception Audit',
      content: String.raw`Common pitfalls:
1. Mixing "and" with "or" operations.
2. Getting probability greater than $1$ from double counting.
3. Keeping denominator unchanged in no-replacement tasks.
4. Adding along a tree path instead of multiplying.`,
    },
    {
      title: '9) Revision, Testing, and Memo',
      content: String.raw`### Mixed revision (40 questions)
Covers:
- sample spaces
- addition and multiplication rules
- card/dice/coin events
- independent and dependent events
- without-replacement tasks
- exactly one / at least one patterns.

### Structured test (10 questions)
Includes:
1. Tree diagram (without replacement)
2. Venn-diagram probability
3. Two-dice sum model
4. Union from independent events
5. At least one target number in repeated trials
6. Matching pair probability
7. Exactly one winner
8. Two-card dependent draw
9. Recover intersection from union data
10. Binomial-style exactly-two-hits scenario.

### Memo snapshots
- $P(A\cup B)=P(A)+P(B)-P(A\cap B)$
- Independent:
  $P(A\cap B)=P(A)P(B)$
- No replacement:
  update numerators and denominators each stage
- Useful complements:
  $P(\text{at least one})=1-P(\text{none})$.`,
    },
  ],
  key_points: [
    'Use addition for "or" and multiplication for "and".',
    'Subtract overlap in non-mutually exclusive addition.',
    'Check independence before multiplying unconditional probabilities.',
    'Without replacement changes later probabilities.',
    'Tree diagrams require multiply along paths, add across successful paths.',
    'Keep all final probabilities within 0 and 1.',
  ],
  exam_tips: [
    'Write event notation (A, B, A∩B, A∪B) before computing.',
    'For at least one, start with the complement method first.',
    'In card and bag problems, track denominator changes carefully.',
    'Use Venn diagrams when overlaps are given or asked.',
  ],
  visual_descriptions: [
    'Decision map for choosing addition, multiplication, or complement method',
    'Two-stage tree templates for with-replacement and without-replacement cases',
    'Venn diagram layout showing union, intersection, and complement regions',
  ],
};

const planeVectorsMasterNotes: MathTopicNotes = {
  topic: 'Vectors',
  subject: 'Mathematics',
  grade_level: 'O-Level Form 4',
  summary:
    'Comprehensive Form 4 vectors notes on plane-shape operations: position vectors, vector arithmetic, collinearity, midpoint/division, quadrilateral proofs, area links, base-vector forms, and assessment.',
  sections: [
    {
      title: '1) Introduction to Vectors in Plane Geometry',
      videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%204/Proving_Shapes_with_Vectors.mp4',
      content: String.raw`A coordinate gives position; a vector gives directed movement.

Column vector form:
\[
\begin{pmatrix}x\\y\end{pmatrix}
\]

In translation, shapes remain congruent (isometry), so vector movement can be applied to every vertex without changing shape, angle, or size.`,
    },
    {
      title: '2) Position Vectors and Representation',
      content: String.raw`For points $A$ and $B$ with position vectors $\mathbf{a}$ and $\mathbf{b}$:
\[
\vec{AB}=\mathbf{b}-\mathbf{a}
\]

Worked examples:
1. $A(2,3),B(5,7)$:
   $\vec{AB}=\begin{pmatrix}3\\4\end{pmatrix}$.
2. $P(0,1),Q(-2,4)$:
   $\vec{PQ}=\begin{pmatrix}-2\\3\end{pmatrix}$.
3. $C(4,-2),D(1,5)$:
   $\vec{CD}=\begin{pmatrix}-3\\7\end{pmatrix}$.
4. $M(3,3),N(8,3)$:
   $\vec{MN}=\begin{pmatrix}5\\0\end{pmatrix}$.
5. $R(10,20),S(15,25)$:
   $\vec{RS}=\begin{pmatrix}5\\5\end{pmatrix}$.
6. $X(-5,-5),Y(2,2)$:
   $\vec{XY}=\begin{pmatrix}7\\7\end{pmatrix}$.
7. $E(1,6),F(1,10)$:
   $\vec{EF}=\begin{pmatrix}0\\4\end{pmatrix}$.
8. $G(0,0),H(x,y)$:
   $\vec{GH}=\begin{pmatrix}x\\y\end{pmatrix}$.

Direction warning:
$\vec{AB}=-(\vec{BA})$.`,
    },
    {
      title: '3) Vector Addition, Subtraction, and Geometry Laws',
      content: String.raw`Triangle law:
\[
\vec{AC}=\vec{AB}+\vec{BC}
\]

Worked examples:
1. If $\vec{AB}=\mathbf{a}$ and $\vec{BC}=\mathbf{b}$:
   $\vec{AC}=\mathbf{a}+\mathbf{b}$.
2. If $\vec{OP}=\mathbf{p}$ and $\vec{OQ}=\mathbf{q}$:
   $\vec{PQ}=\mathbf{q}-\mathbf{p}$.
3. $\vec{XY}=\begin{pmatrix}2\\3\end{pmatrix}$ and $\vec{YZ}=\begin{pmatrix}4\\1\end{pmatrix}$:
   $\vec{XZ}=\begin{pmatrix}6\\4\end{pmatrix}$.
4. In parallelogram with $\vec{AB}=\mathbf{a}$, $\vec{AD}=\mathbf{b}$:
   $\vec{BD}=\mathbf{b}-\mathbf{a}$.
5. $\mathbf{u}=\begin{pmatrix}5\\-2\end{pmatrix}$, $\mathbf{v}=\begin{pmatrix}-3\\6\end{pmatrix}$:
   $\mathbf{u}+\mathbf{v}=\begin{pmatrix}2\\4\end{pmatrix}$.
6. Consecutive translations
   $\begin{pmatrix}1\\4\end{pmatrix}$ then $\begin{pmatrix}2\\-1\end{pmatrix}$:
   total $\begin{pmatrix}3\\3\end{pmatrix}$.`,
    },
    {
      title: '4) Collinearity and Scalar Multiples',
      content: String.raw`Collinearity condition:
If $\vec{AB}=k\vec{BC}$ (or equivalent scalar-multiple relation), with shared point, points are collinear.

Worked examples:
1. $\vec{AB}=\begin{pmatrix}2\\4\end{pmatrix}$, $\vec{BC}=\begin{pmatrix}4\\8\end{pmatrix}$:
   $\vec{BC}=2\vec{AB}$, so collinear.
2. $\vec{PQ}=\mathbf{a}$, $\vec{QR}=3\mathbf{a}$:
   collinear.
3. $\vec{XY}=\begin{pmatrix}1\\3\end{pmatrix}$, $\vec{YZ}=\begin{pmatrix}-2\\-6\end{pmatrix}$:
   $\vec{YZ}=-2\vec{XY}$, collinear.
4. $\vec{AB}=2\mathbf{u}$, $\vec{AC}=5\mathbf{u}$:
   collinear from common point $A$.
5. If $\vec{AB}=\begin{pmatrix}3\\1\end{pmatrix}$ and $\vec{BC}=\begin{pmatrix}9\\3\end{pmatrix}$:
   ratio $AB:BC=1:3$.
6. $\vec{LM}=\mathbf{b}$, $\vec{LN}=4\mathbf{b}$:
   collinear.`,
    },
    {
      title: '5) Midpoint and Division of Segments',
      content: String.raw`Midpoint of $\mathbf{a}$ and $\mathbf{b}$:
\[
\mathbf{M}=\frac{\mathbf{a}+\mathbf{b}}{2}
\]

Worked examples:
1. Midpoint of $(2,4)$ and $(6,8)$:
   $\begin{pmatrix}4\\6\end{pmatrix}$.
2. Midpoint of $(-2,10)$ and $(4,2)$:
   $\begin{pmatrix}1\\6\end{pmatrix}$.
3. Point dividing $AB$ in ratio $1:2$, with
   $\mathbf{a}=\begin{pmatrix}0\\0\end{pmatrix},\mathbf{b}=\begin{pmatrix}6\\9\end{pmatrix}$:
   $\begin{pmatrix}2\\3\end{pmatrix}$.
4. If $P(4,8),Q(12,16)$ and $R$ divides $PQ$ in $1:3$:
   $\vec{OR}=\begin{pmatrix}6\\10\end{pmatrix}$.
5. General midpoint:
   $\begin{pmatrix}\frac{x_1+x_2}{2}\\\frac{y_1+y_2}{2}\end{pmatrix}$.
6. Midpoint of $(3,8)$ and $(3,2)$:
   $\begin{pmatrix}3\\5\end{pmatrix}$.
7. Midpoint of $(a,b)$ and $(c,d)$:
   $\frac{1}{2}\begin{pmatrix}a+c\\b+d\end{pmatrix}$.`,
    },
    {
      title: '6) Proving Quadrilateral Properties with Vectors',
      content: String.raw`Vector equality proves both parallelism and equal length.

Worked examples:
1. If $\vec{AB}=\vec{DC}$ in $ABCD$:
   opposite sides parallel and equal, so parallelogram.
2. If diagonals share midpoint:
   they bisect each other.
3. Parallelogram with equal adjacent side lengths:
   rhombus.
4. If $\vec{AD}=\vec{BC}$:
   parallelogram condition satisfied.
5. If adjacent sides are equal and perpendicular:
   square condition.
6. Midpoint quadrilateral theorem:
   midpoint-joined quadrilateral is a parallelogram.`,
    },
    {
      title: '7) Area of Triangles and Plane Shapes (Intro)',
      content: String.raw`Scaling laws:
- If $A\propto l^2$, doubling length multiplies area by $4$.
- Shear preserves area.

Worked examples:
1. From $A=6l^2$, if $l\to 2l$ then $A\to 4A$.
2. If $l=3$, $A=6(3)^2=54$.
3. Triangle area $15$ under shear remains $15$.
4. Rectangle with side vectors
   $\begin{pmatrix}7\\0\end{pmatrix}$ and $\begin{pmatrix}0\\4\end{pmatrix}$:
   area $28$.
5. Circle radius doubled: area quadruples.
6. Square side vector $\begin{pmatrix}5\\0\end{pmatrix}$:
   area $25$.`,
    },
    {
      title: '8) Expressing Points in Base Vectors',
      content: String.raw`Worked examples:
1. If $\vec{AB}=\mathbf{a}$ and $\vec{BC}=4\mathbf{a}$:
   $\vec{AC}=5\mathbf{a}$.
2. If $M$ midpoint of $PQ$ and $\vec{PQ}=\mathbf{p}$:
   $\vec{PM}=\frac{1}{2}\mathbf{p}$.
3. If $\vec{OP}=\mathbf{a}$ and $\vec{PR}=\mathbf{b}-\mathbf{a}$:
   $\vec{OR}=\mathbf{b}$.
4. Point one-third along $\vec{AB}=\mathbf{b}$:
   $\frac{1}{3}\mathbf{b}$.
5. If $\vec{OA}=\mathbf{a},\vec{OB}=\mathbf{b}$:
   $\vec{AB}=\mathbf{b}-\mathbf{a}$.
6. Simplify $3\mathbf{a}+2\mathbf{b}-2\mathbf{a}+\mathbf{b}$:
   $\mathbf{a}+3\mathbf{b}$.`,
    },
    {
      title: '9) Comprehensive Revision and Assessment',
      content: String.raw`### Mixed revision (40 prompts)
Includes:
- column-vector conversion
- vector between two points
- vector sums/differences
- collinearity checks
- midpoint/division tasks
- translation image/object recovery
- shape proofs and area scaling
- base-vector simplification.

### Structured test (10 prompts)
Includes:
1. point translation
2. parallelogram proof via opposite vectors
3. midpoint position vector
4. area from $A=6l^2$
5. collinearity proof
6. internal division (1:2)
7. resultant in base vectors
8. area under shear
9. scalar matching
10. simultaneous vector-component equations.

### Memo highlights
- Image formula:
  $\text{Image}=\text{Original}+\text{Translation vector}$.
- Midpoint:
  $\frac{\mathbf{a}+\mathbf{b}}{2}$.
- Collinearity:
  scalar multiples with shared point.
- Area under shear is invariant.
- Example outcomes:
  $(5,12)+\begin{pmatrix}-3\\4\end{pmatrix}=(2,16)$,
  midpoint of $\begin{pmatrix}14\\-2\end{pmatrix}$ and $\begin{pmatrix}6\\10\end{pmatrix}$ is $\begin{pmatrix}10\\4\end{pmatrix}$.`,
    },
  ],
  key_points: [
    'Vector from A to B is Image minus Original: b - a.',
    'Vector addition follows triangle/parallelogram laws.',
    'Collinearity requires scalar-multiple direction with shared point.',
    'Midpoint vector is half the sum of endpoint vectors.',
    'Equal opposite side vectors imply a parallelogram.',
    'Area scales with square of length; shear preserves area.',
  ],
  exam_tips: [
    'Keep subtraction order correct to avoid direction reversal.',
    'Use column-vector notation consistently when calculating.',
    'In collinearity proofs, show the scalar and shared point explicitly.',
    'For division ratios, move along AB using fractional parts carefully.',
  ],
  visual_descriptions: [
    'Point-to-point vector arrows with image-minus-object labeling',
    'Triangle and parallelogram law diagrams for resultant vectors',
    'Midpoint and internal division segment map with ratio markers',
  ],
};

const trigonometricRatiosMasterNotes: MathTopicNotes = {
  topic: 'Trigonometry',
  subject: 'Mathematics',
  grade_level: 'O-Level Form 4',
  summary:
    'Comprehensive Form 4 trigonometry notes covering right-angle ratios, inverse trig, sine/cosine rules, area formula, bearings/elevation applications, identities, and full assessment support.',
  sections: [
    {
      title: '1) Trigonometric Foundations',
      videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%204/Trigonometry_Toolkit.mp4',
      content: String.raw`Trigonometry links angles and lengths in triangles.

For similar right-angled triangles, side ratios at a fixed angle are constant.

This supports practical tasks such as:
- measuring inaccessible heights
- navigation and bearings
- distance estimation in surveying.`,
    },
    {
      title: '2) Basic Ratios in Right-Angled Triangles',
      content: String.raw`Definitions (SOHCAHTOA):
- $\sin\theta=\frac{\text{Opposite}}{\text{Hypotenuse}}$
- $\cos\theta=\frac{\text{Adjacent}}{\text{Hypotenuse}}$
- $\tan\theta=\frac{\text{Opposite}}{\text{Adjacent}}$

Labeling rule:
- Hypotenuse is opposite $90^\circ$.
- Opposite/Adjacent depend on reference angle.

Worked examples:
1. Opp $=3$, Hyp $=5$:
   $\sin\alpha=\frac{3}{5}=0.6000$.
2. Adj $=12$, Hyp $=13$:
   $\cos\beta=\frac{12}{13}=0.9231$.
3. Opp $=8$, Adj $=15$:
   $\tan\theta=\frac{8}{15}=0.5333$.
4. Hyp $=20$, Opp $=10$:
   $\sin x=\frac{10}{20}=0.5000$.
5. Adj $=k$, Hyp $=10$, angle $40^\circ$:
   $k=10\cos40^\circ$.
6. Opp $=y$, Adj $=14$, angle $25^\circ$:
   $y=14\tan25^\circ$.`,
    },
    {
      title: '3) Finding Missing Sides',
      content: String.raw`Procedure:
1. Label sides relative to given angle.
2. Choose ratio connecting known and unknown.
3. Substitute and solve.

Worked examples:
1. $\sin30^\circ=\frac{x}{12}\Rightarrow x=6.0000$.
2. $\cos60^\circ=\frac{x}{25}\Rightarrow x=12.5000$.
3. $\tan45^\circ=\frac{y}{10}\Rightarrow y=10.0000$.
4. $\sin50^\circ=\frac{b}{6.5}\Rightarrow b=4.9790$.
5. $\cos30^\circ=\frac{15}{x}\Rightarrow x=17.3210$.
6. $\sin25^\circ=\frac{8}{h}\Rightarrow h=18.9304$.
7. $\tan70^\circ=\frac{14}{a}\Rightarrow a=5.0955$.
8. $\cos15^\circ=\frac{22}{x}\Rightarrow x=22.7767$.

Critical check:
Calculator must be in Degree mode.`,
    },
    {
      title: '4) Finding Angles with Inverse Functions',
      content: String.raw`Use:
- $\theta=\sin^{-1}(r)$
- $\theta=\cos^{-1}(r)$
- $\theta=\tan^{-1}(r)$

Worked examples:
1. $\sin\theta=0.8511\Rightarrow \theta=58.30^\circ$.
2. Supplementary sine case:
   $\theta=121.70^\circ$ also possible.
3. $\sin\theta=\frac{5}{12}\Rightarrow \theta=24.63^\circ$.
4. $\cos\theta=0.7000\Rightarrow \theta=45.57^\circ$.
5. $\tan\theta=1.8750\Rightarrow \theta=61.93^\circ$.
6. $\cos\theta=0.5000\Rightarrow \theta=60.00^\circ$.
7. $\sin\theta=0.7071\Rightarrow \theta=45.00^\circ$.
8. $\tan\theta=1\Rightarrow \theta=45.00^\circ$.`,
    },
    {
      title: '5) Non-Right Triangles: Sine and Cosine Rules',
      content: String.raw`Sine rule:
\[
\frac{a}{\sin A}=\frac{b}{\sin B}=\frac{c}{\sin C}
\]
Use when a side-angle pair is known.

Cosine rule:
\[
a^2=b^2+c^2-2bc\cos A
\]
Use for SAS or SSS cases.

Worked examples:
1. $A=40^\circ,B=60^\circ,a=10$:
   $b=13.4723$.
2. $m=10,n=9,\angle N=50^\circ$:
   $\angle M=58.30^\circ$ or $121.70^\circ$.
3. $X=100^\circ,Z=30^\circ,z=5$:
   $x=9.8480$.
4. $p=12,q=15,P=40^\circ$:
   $Q=53.46^\circ$.
5. $b=8,c=10,A=60^\circ$:
   $a=9.1652$.
6. $d=5,e=7,F=110^\circ$:
   $f=9.8965$.
7. $a=5,b=6,c=7$:
   $A=44.41^\circ$.
8. $p=10,q=12,r=18$:
   $R=109.47^\circ$.`,
    },
    {
      title: '6) Area of a Triangle Using Trigonometry',
      content: String.raw`Formula:
\[
\text{Area}=\frac{1}{2}ab\sin C
\]

Worked examples:
1. $a=8,b=12,C=30^\circ$:
   area $=24.0000$.
2. $b=10,c=15,A=45^\circ$:
   area $=53.0325$.
3. $a=5,b=7,C=120^\circ$:
   area $=15.1550$.
4. Area $=20$, $a=8$, $C=40^\circ$:
   $b=7.7785$.
5. Area $=15$, $a=6$, $b=10$:
   $C=30.00^\circ$.
6. Equilateral side $10$:
   area $=43.3000$.`,
    },
    {
      title: '7) Practical Applications: Bearings and Elevation',
      content: String.raw`Key concepts:
- Angle of elevation: measured up from horizontal.
- Angle of depression: measured down from horizontal.
- Bearings: clockwise from North, written in 3 digits.

Worked examples:
1. Ladder $10$m at $70^\circ$:
   height $=9.3970$m.
2. Elevation $35^\circ$, base distance $20$m:
   height $=14.0040$m.
3. $50$ km on bearing $040^\circ$:
   north component $=38.3000$ km.
4. Cliff $100$m, depression $15^\circ$:
   horizontal distance $=373.2736$m.
5. $10$ km North then $15$ km East:
   bearing $=056.31^\circ$.
6. Two bearings $030^\circ$ and $330^\circ$ from points 100 m apart:
   distance to tower $=100.0000$m.
7. Depression from $40$m bridge at $20^\circ$ and $30^\circ$:
   boat gap $=40.6100$m.
8. $200$ km on $090^\circ$, then $150$ km on $180^\circ$:
   direct distance $=250.0000$ km.`,
    },
    {
      title: '8) Introductory Trigonometric Identities',
      content: String.raw`Fundamental identity:
\[
\sin^2\theta+\cos^2\theta=1
\]

Worked examples:
1. $5\sin^2\theta+5\cos^2\theta=5$.
2. $\cos\theta=\sqrt{1-\sin^2\theta}$.
3. $\frac{1-\sin^2\theta}{\cos\theta}=\cos\theta$.
4. $(\sin\theta+\cos\theta)^2=1+2\sin\theta\cos\theta$.
5. If $\sin\theta=0.6$, then $\cos\theta=0.8$.
6. $\tan\theta\cos\theta=\sin\theta$.`,
    },
    {
      title: '9) Comprehensive Assessment and Revision',
      content: String.raw`### Mixed revision (40 questions)
Covers:
- right-triangle ratio selection
- inverse trig angle finding
- sine/cosine rule application
- area formula usage
- bearings/elevation interpretation
- identity simplification.

### Structured test (10 questions)
Includes:
1. bearing-based triangle distance
2. ambiguous sine-case angles
3. identity proof
4. elevation from shadow data
5. regular hexagon area via 6 triangles
6. two-leg bearing journey resultant
7. solving trig equation in first quadrant
8. included-angle recovery from area
9. perimeter via cosine rule
10. altitude from climb angle.

### Memo highlights
- Keep calculator in Degree mode.
- Use full calculator values in working.
- Round final lengths to 4 d.p. and angles to 2 d.p.
- For sine rule, remember possible supplementary angle.`,
    },
    {
      title: '10) Critical Pitfalls',
      content: String.raw`1. Wrong DRG mode.
2. Premature rounding.
3. Mislabeling opposite/adjacent for a chosen angle.
4. Using wrong rule (sine vs cosine).
5. Ignoring ambiguous sine-case second angle.`,
    },
  ],
  key_points: [
    'SOHCAHTOA depends on correct side labeling around the reference angle.',
    'Inverse trig functions recover angles from ratios.',
    'Use sine rule for side-angle pair cases.',
    'Use cosine rule for SAS/SSS non-right triangles.',
    'Triangle area can be found with 1/2ab sin C.',
    'Bearings and elevation problems require clear sketching and axis references.',
  ],
  exam_tips: [
    'Switch calculator to Degree mode before any trig computation.',
    'Choose the ratio that directly links known and unknown values.',
    'Check for supplementary-angle possibility in sine-rule angle problems.',
    'Round only the final answer, not intermediate values.',
  ],
  visual_descriptions: [
    'Right-triangle labeling map for opposite, adjacent, and hypotenuse',
    'Decision chart for selecting SOHCAHTOA vs sine/cosine rules',
    'Bearing-and-elevation sketch templates with north line and horizontal reference',
  ],
};

const measuresOfDispersionMasterNotes: MathTopicNotes = {
  topic: 'Measures of Dispersion',
  subject: 'Mathematics',
  grade_level: 'O-Level Form 4',
  summary:
    'Comprehensive notes on statistical dispersion: range, quartiles and IQR, variance and standard deviation for ungrouped and grouped data, interpretation, applications, and revision practice.',
  sections: [
    {
      title: '1) Introduction to Dispersion',
      videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%204/Measures_of_Dispersion.mp4',
      content: String.raw`Measures of central tendency (mean, median, mode) show center, but not spread.

Dispersion describes how far values scatter from the center.

Interpretation:
- Low dispersion: high consistency.
- High dispersion: low consistency.

Dispersion is essential for judging reliability of averages in real contexts.`,
    },
    {
      title: '2) Range: Basic Spread',
      content: String.raw`Formula:
\[
\text{Range}=\text{Highest value}-\text{Lowest value}
\]

Worked examples:
1. $\{15,22,10,31,18\}$: range $=31-10=21$.
2. $\{4.2,1.8,5.9,3.3,0.7\}$: range $=5.2$.
3. $\{-5,12,0,25,18,-2\}$: range $=25-(-5)=30$.
4. Ages $\{14,16,15,14,17,18,15\}$: range $=4$.
5. Scores $\{88,42,95,71,60,55\}$: range $=53$.
6. Lengths $\{10.25,10.80,10.11,10.99,10.50\}$: range $=0.88$.
7. Money $\{120,500,340,90,210\}$: range $=410$.
8. Weights $\{60.5,72.1,58.4,80.0,66.3\}$: range $=21.6$.

Caution:
In frequency tables, range uses variable values, not frequencies.

Limitation:
Range is highly sensitive to outliers.`,
    },
    {
      title: '3) Quartiles and Interquartile Range (IQR)',
      content: String.raw`For ordered discrete data:
- Position of $Q_1$: $\frac{1}{4}(n+1)$
- Position of $Q_3$: $\frac{3}{4}(n+1)$
- $\text{IQR}=Q_3-Q_1$

For grouped/continuous data (ogive context), use fractional positions based on $n$ and interpolate.

Worked examples:
1. $\{3,5,7,9,11,13,15\}$:
   $Q_1=5,\;Q_3=13,\;\text{IQR}=8$.
2. $\{2,4,6,8,10,12,14,16\}$:
   $Q_1=4.5,\;Q_3=13.5,\;\text{IQR}=9$.
3. $\{10,12,14,15,17,19,21,22,24,25,28\}$:
   $Q_1=14,\;Q_3=24,\;\text{IQR}=10$.
4. $\{1,3,3,4,5,6,7,8,8,10\}$:
   $Q_1=3,\;Q_3=8.5,\;\text{IQR}=5.5$.
5. Ogive-style data with $n=50$:
   $Q_1\approx 25.77,\;Q_3\approx 38.86,\;\text{IQR}\approx 13.09$.
6. If cumulative-frequency interpolation gives
   $Q_1=34,\;Q_3=52$, then IQR $=18$.
7. If $Q_1=9.8,\;Q_3=10.5$, then IQR $=0.7$.
8. If $Q_1=42,\;Q_3=88$, then IQR $=46$.

Interpretation:
Smaller IQR means middle 50% is more tightly clustered.`,
    },
    {
      title: '4) Variance and Standard Deviation (Ungrouped)',
      content: String.raw`Formulas:
\[
\bar{x}=\frac{\sum x}{n},\quad
\sigma^2=\frac{\sum (x-\bar{x})^2}{n},\quad
\sigma=\sqrt{\sigma^2}
\]

Assumed-mean method (working mean $A$):
$d=x-A$ and
\[
\sigma^2=\frac{\sum d^2}{n}-\left(\frac{\sum d}{n}\right)^2
\]

Worked examples:
1. Data $\{3,1,3,0,5\}$:
   $\bar{x}=2.4,\;\sigma^2=3.04,\;\sigma\approx 1.74$.
2. Data $\{3,1,3,0,5,3,4,3\}$ with $A=2$:
   $\bar{x}=2.75,\;\sigma^2=2.1875,\;\sigma\approx 1.48$.
3. $\{10,10,10\}$:
   $\sigma=0$.
4. $\{2,4,6\}$:
   $\sigma\approx 1.63$.
5. $\{100,200,300\}$:
   $\sigma\approx 81.65$.
6. $\{1,2,3,4,5\}$:
   $\sigma\approx 1.41$.

Common errors:
- not squaring negative deviations
- stopping at variance and forgetting square root for standard deviation.`,
    },
    {
      title: '5) Variance and Standard Deviation (Grouped)',
      content: String.raw`Use class midpoints $x$ and frequencies $f$.

Shortcut formula:
\[
\sigma^2=\frac{\sum fx^2}{\sum f}-\left(\frac{\sum fx}{\sum f}\right)^2
\]

Worked example table summary:
Intervals: $1\text{-}5,6\text{-}10,11\text{-}15,16\text{-}20,21\text{-}25$
with frequencies $2,4,7,5,2$ gives:
$\sum f=20,\;\sum fx=265,\;\sum fx^2=4135$.

Then:
\[
\bar{x}=13.25,\;
\sigma^2=31.1875,\;
\sigma\approx 5.58
\]`,
    },
    {
      title: '6) Comparative Analysis',
      content: String.raw`If two groups share the same mean, compare standard deviations:
- smaller $\sigma$ means more consistent performance.

Example:
Class A: mean $65$, $\sigma=4$.
Class B: mean $65$, $\sigma=12$.
Class A is more consistent.`,
    },
    {
      title: '7) Real-Life Applications',
      content: String.raw`1. Manufacturing:
   lower $\sigma$ means tighter tolerances and better quality control.
2. Meteorology:
   low range/SD indicates stable climate behavior.
3. Finance:
   higher SD often indicates higher volatility (risk).`,
    },
    {
      title: '8) Mixed Revision Exercise',
      content: String.raw`### Practice blocks
1. Compute range and SD for ungrouped sets.
2. Interpret consistency from given SD values.
3. Explain why range is less robust than SD.
4. Study effect of adding a constant to all data values.
5. Compute IQR from quartiles.
6. Compare spread between two candidate data sets.
7. Define dispersion and interpret $\sigma=0$.
8. Identify outlier-sensitive measures.
9. Solve grouped-variance from class intervals and frequencies.
10. Read quartiles/IQR from cumulative-frequency positions.`,
    },
    {
      title: '9) Structured Test',
      content: String.raw`Section A:
1. Find range for a given set.
2. Compute IQR from provided $Q_1,Q_3$.
3. Define working mean.

Section B:
Given grouped classes and frequencies:
1. Build midpoint/frequency table.
2. Compute mean.
3. Compute variance and standard deviation.`,
    },
    {
      title: '10) Memo Highlights',
      content: String.raw`Key results:
1. Constant data set has range $0$ and SD $0$.
2. For $\{1,2,3,4,5\}$, SD $\approx 1.41$.
3. IQR uses middle 50% and is robust to outliers.
4. In grouped-data example:
   $\bar{x}=27.6,\;\sigma^2=95.24,\;\sigma\approx 9.76$.

Final check:
Always report units for range, IQR, and SD in context.`,
    },
  ],
  key_points: [
    'Dispersion measures spread, not center.',
    'Range uses only extreme values and is outlier-sensitive.',
    'IQR focuses on the middle 50 percent and is robust.',
    'Standard deviation uses all observations and is the main consistency measure.',
    'Grouped SD uses midpoints and frequency-weighted sums.',
    'Lower SD implies greater consistency when means are comparable.',
  ],
  exam_tips: [
    'Sort raw data before locating quartiles.',
    'Use variable values, not frequencies, for range.',
    'Square deviations carefully and keep signs correct before squaring.',
    'In grouped tables, compute midpoint, fx, and fx^2 systematically.',
  ],
  visual_descriptions: [
    'Box-and-whisker style view showing quartiles and IQR span',
    'Frequency-table workflow from class midpoint to SD computation',
    'Comparison chart: same mean, different standard deviations',
  ],
};

const measuresOfCentralTendencyMasterNotes: MathTopicNotes = {
  topic: 'Measures of Central Tendency',
  subject: 'Mathematics',
  grade_level: 'O-Level Form 4',
  summary:
    'Comprehensive Form 4 notes on mean, median, and mode for ungrouped and grouped data, including assumed mean method, skewness interpretation, applications, revision, and memo guidance.',
  sections: [
    {
      title: '1) Introduction to Central Tendency',
      videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%204/Measures_of_Central_Tendency.mp4',
      content: String.raw`Central tendency gives the typical or central value of data.

Core measures:
- Mean (arithmetic average)
- Median (positional center)
- Mode (most frequent value)

These summarize data for interpretation in practical settings like quality control, health records, and planning.`,
    },
    {
      title: '2) Arithmetic Mean (Ungrouped Data)',
      content: String.raw`Formula:
\[
\bar{x}=\frac{\sum x}{n}
\]

Worked examples:
1. $3,1,3,0,5,3,4,3$:
   $\sum x=22,\; n=8,\; \bar{x}=2.75$.
2. $10,15,20,25,30$:
   $\bar{x}=20$.
3. $2,8,4,6$:
   $\bar{x}=5$.
4. $105,110,115$:
   $\bar{x}=110$.
5. $0,0,4,8,13$:
   $\bar{x}=5$.
6. $1.5,2.5,5.0$:
   $\bar{x}=3$.
7. $12,12,12,12,12$:
   $\bar{x}=12$.
8. $7,9,11,13,15,17$:
   $\bar{x}=12$.

Common errors:
- forgetting $0$ still counts in $n$
- dividing by wrong count.`,
    },
    {
      title: '3) Mean for Grouped Data (Midpoint Method)',
      content: String.raw`Class midpoint:
\[
x=\frac{\text{lower limit}+\text{upper limit}}{2}
\]

Grouped mean:
\[
\bar{x}=\frac{\sum fx}{\sum f}
\]

Worked examples:
1. Source-style table with
   $\sum f=20,\;\sum fx=265$:
   $\bar{x}=13.25$.
2. Classes $0\text{-}10,10\text{-}20,20\text{-}30$ with $f=5,15,10$:
   $\bar{x}=\frac{500}{30}=16.67$.
3. Classes $1\text{-}3,4\text{-}6,7\text{-}9$ with $f=10,20,10$:
   $\bar{x}=5$.
4. Classes $20\text{-}24,25\text{-}29$ with $f=2,8$:
   $\bar{x}=26$.
5. Classes $100\text{-}110,110\text{-}120$ with $f=5,5$:
   $\bar{x}=110$.
6. Classes $5\text{-}9,10\text{-}14,15\text{-}19$ with $f=1,2,1$:
   $\bar{x}=12$.
7. Classes $1\text{-}10,11\text{-}20$ with $f=12,8$:
   $\bar{x}=9.5$.

Caution:
Use midpoints, not class limits, in $fx$.`,
    },
    {
      title: '4) Assumed Mean (Working Mean) Method',
      content: String.raw`Formula:
\[
\bar{x}=A+\frac{\sum fd}{\sum f},\quad d=x-A
\]

Worked examples:
1. Data $3,1,3,0,5,3,4,3$, choose $A=2$:
   $\sum d=6,\; n=8,\;\bar{x}=2+\frac{6}{8}=2.75$.
2. Midpoints $10,20,30$, frequencies $5,10,5$, choose $A=20$:
   $\sum fd=0,\;\bar{x}=20$.
3. Midpoints $100,110,120$, frequencies $2,6,2$, choose $A=110$:
   $\sum fd=0,\;\bar{x}=110$.
4. Midpoints $50,60,70,80$, frequencies $1,4,4,1$, choose $A=60$:
   $\sum fd=50,\;\sum f=10,\;\bar{x}=65$.
5. Data $45,48,52,55$, choose $A=50$:
   deviations sum to $0$, so mean $=50$.
6. Midpoints $12,14,16$, frequencies $10,20,10$, choose $A=14$:
   $\sum fd=0,\;\bar{x}=14$.

Tip:
Choose $A$ near center to reduce arithmetic load.`,
    },
    {
      title: '5) Median (Positional Average)',
      content: String.raw`Ungrouped:
- Sort data first.
- Odd $n$: position $\frac{n+1}{2}$.
- Even $n$: average of two middle values.

Worked examples (ungrouped):
1. $3,1,5,2,4\to 1,2,3,4,5$: median $=3$.
2. $10,20,15\to 10,15,20$: median $=15$.
3. $1,8,3,6\to 1,3,6,8$: median $=\frac{3+6}{2}=4.5$.
4. $10,12,14,16,18,20$: median $=15$.

Grouped median formula:
\[
\text{Median}=L+\left(\frac{\frac{N}{2}-cf}{f}\right)h
\]

Worked examples (grouped):
1. $L=30.5,\;N=50,\;cf=18,\;f=22,\;h=10$:
   median $\approx 33.68$.
2. $L=10.5,\;N=100,\;cf=40,\;f=20,\;h=5$:
   median $=13$.
3. $L=20.5,\;N=40,\;cf=10,\;f=20,\;h=10$:
   median $=25.5$.
4. $L=5.5,\;N=60,\;cf=25,\;f=10,\;h=5$:
   median $=8$.
5. $L=15.5,\;N=20,\;cf=8,\;f=4,\;h=5$:
   median $=18$.
6. $L=40.5,\;N=80,\;cf=35,\;f=10,\;h=10$:
   median $=45.5$.`,
    },
    {
      title: '6) Mode (Frequency Peak)',
      content: String.raw`Ungrouped mode:
most frequent value(s).

Examples:
1. $2,3,3,4$: mode $=3$.
2. $1,1,2,3,3$: modes $=1,3$ (bimodal).
3. $10,12,12,15$: mode $=12$.
4. $5,5,5,8,9$: mode $=5$.

Grouped mode:
\[
\text{Mode}=L+\left(\frac{f_1-f_0}{2f_1-f_0-f_2}\right)h
\]

Worked examples:
1. $L=10.5,\;f_1=8,\;f_0=2,\;f_2=4,\;h=5$:
   mode $=13.5$.
2. $L=19.5,\;f_1=10,\;f_0=5,\;f_2=5,\;h=10$:
   mode $=24.5$.
3. $L=4.5,\;f_1=12,\;f_0=0,\;f_2=8,\;h=5$:
   mode $=8.25$.
4. $L=99.5,\;f_1=20,\;f_0=10,\;f_2=10,\;h=10$:
   mode $=104.5$.
5. $L=0.5,\;f_1=15,\;f_0=0,\;f_2=10,\;h=5$:
   mode $=4.25$.
6. $L=49.5,\;f_1=30,\;f_0=20,\;f_2=10,\;h=10$:
   mode $\approx 52.83$.`,
    },
    {
      title: '7) Distribution Comparison and Skewness',
      content: String.raw`Patterns:
1. Symmetrical:
   Mean = Median = Mode.
2. Positively skewed:
   Mode < Median < Mean.
3. Negatively skewed:
   Mean < Median < Mode.

Reminder:
Skewness direction is named by the tail direction.`,
    },
    {
      title: '8) Applications and Interpretation',
      content: String.raw`Interpretive example:
If Class A and Class B means differ from modes strongly, investigate outliers and clustering.

A low mode with high mean can indicate a few very large values pulling the mean upward.`,
    },
    {
      title: '9) Mixed Revision Exercise',
      content: String.raw`Section A:
Ungrouped sets: compute mean, median, mode.

Section B:
Grouped data: compute grouped mean, grouped median, grouped mode, and assumed-mean mean.

Interpretive tasks:
identify skewness type and discuss outlier influence.`,
    },
    {
      title: '10) Structured Test',
      content: String.raw`1. Mean using assumed mean ($A$ given).
2. Grouped median from $L,N,cf,f,h$.
3. Skewness interpretation from mean/median/mode ordering.
4. Grouped mode from $(f_0,f_1,f_2)$.
5. Class comparison by outlier pattern.`,
    },
    {
      title: '11) Memo Highlights',
      content: String.raw`Key memo snapshots:
1. For data $5,5,8,12,20$:
   mean $=10$, median $=8$, mode $=5$.
2. For data $0,2,4,4,10$:
   mean $=4$, median $=4$, mode $=4$.
3. If 100 is added to $[1,2,3]$:
   new mean $=26.5$.
4. Grouped sample with $\sum fx=60,\sum f=10$:
   mean $=6$.
5. Using grouped median formula with
   $L=5.5,cf=4,f=6,h=5$:
   median $\approx 6.33$.
6. Mode and assumed-mean outputs align with
   mode $=13.5$ and mean $=13.25$ in referenced grouped setup.`,
    },
  ],
  key_points: [
    'Mean uses all values and is sensitive to extremes.',
    'Median is positional and robust to outliers.',
    'Mode captures most frequent value or class.',
    'Grouped data needs midpoint representation for mean.',
    'Assumed mean simplifies arithmetic with deviations.',
    'Skewness can be inferred from mean-median-mode ordering.',
  ],
  exam_tips: [
    'Sort data before median and mode checks.',
    'Use exact midpoint values for grouped mean calculations.',
    'For grouped median and mode, identify the correct class first.',
    'Keep formula symbols consistent: L, N, cf, f, h.',
  ],
  visual_descriptions: [
    'Mean-median-mode placement on symmetric and skewed distributions',
    'Grouped table workflow: class to midpoint to fx to mean',
    'Median and modal class locator on cumulative-frequency layout',
  ],
};

const groupedDataRepresentationMasterNotes: MathTopicNotes = {
  topic: 'Data Representation (Grouped Data)',
  subject: 'Mathematics',
  grade_level: 'O-Level Form 4',
  summary:
    'Comprehensive Form 4 notes on grouped-data representation: table construction, histograms, frequency polygons, cumulative frequency and ogives, quartile estimation, interpretation, and assessment practice.',
  sections: [
    {
      title: '1) Foundations of Grouped Data',
      videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%204/The_Story_in_Grouped_Data.mp4',
      content: String.raw`Large datasets are organized into class intervals for clarity and analysis.

Key terms:
- Class interval
- Class width
- Class boundaries
- Midpoint (class centre)

Midpoint:
\[
x=\frac{\text{lower limit}+\text{upper limit}}{2}
\]

Boundary logic:
- Discrete classes often need $0.5$ adjustments.
- Continuous classes are usually written with inequalities (no gaps).

Worked examples:
1. Scores grouped as $0\text{-}1,\;2\text{-}3,\;4\text{-}5$:
   midpoints $0.5,2.5,4.5$.
2. For $10\le h<15$:
   midpoint $=12.5$.
3. Midpoint of $20\text{-}29$:
   $24.5$.
4. Boundaries of $16\text{-}25$:
   $15.5$ to $25.5$.
5. Midpoint of $61\le x<100$:
   $80.5$.
6. Width of $25\le v<40$:
   $15$.
7. Width from discrete class boundaries $0.5$ to $5.5$:
   $5$.
8. If midpoint is $13$ and width is $5$, class is around $11\text{-}15$.`,
    },
    {
      title: '2) Histograms and Frequency Density',
      content: String.raw`In histograms, bar area represents frequency.

Frequency density:
\[
\text{FD}=\frac{\text{Frequency}}{\text{Class width}}
\]

Construction steps:
1. Compute widths.
2. Compute FD.
3. Plot class boundaries on x-axis.
4. Plot FD on y-axis.
5. Draw touching bars.

Worked examples:
1. Equal widths ($5$): frequencies $2,4,7,5$ give FD
   $0.4,0.8,1.4,1.0$.
2. Unequal widths:
   $(10\text{-}15,f=10)\Rightarrow 2.0$,
   $(16\text{-}25,f=27)\Rightarrow 2.7$,
   $(26\text{-}30,f=35)\Rightarrow 7.0$,
   $(31\text{-}60,f=10)\Rightarrow 0.33$.

Common errors:
- using frequency instead of density with unequal widths
- leaving gaps between histogram bars
- plotting limits instead of boundaries.`,
    },
    {
      title: '3) Frequency Polygons',
      content: String.raw`Frequency polygons join plotted points at class midpoints.

Procedure:
1. Find midpoint of each class.
2. Plot midpoint against frequency (or FD if required).
3. Join points with straight segments.

Worked examples:
1. Class $1\text{-}5$, frequency $2$, width $5$:
   midpoint $=3$, FD $=0.4$, point $(3,0.4)$.
2. Given points $(3,0.4),(8,0.8),(13,1.4),(18,1),(23,0.4)$:
   peak at $x=13$.
3. For class $10\text{-}20$:
   midpoint $15$.
4. Polygon can be overlaid by joining tops of histogram bars at bar centers.
5. Start/end closure can use adjacent hypothetical classes.
6. A long right tail indicates positive skew.`,
    },
    {
      title: '4) Cumulative Frequency and Ogive',
      content: String.raw`Cumulative frequency (CF) is a running total.

Ogive:
- Plot upper class boundaries against cumulative frequencies.
- Draw a smooth increasing curve.

Example dataset (seedlings, $N=50$):
\[
(10,0),(15,2),(20,5),(30,18),(40,40),(50,48),(60,50)
\]

Worked examples:
1. Total observations: $50$.
2. At $h=30$, CF $=18$.
3. Ogive point at upper boundary $40$ is $(40,40)$.
4. Curve starts at first lower boundary with CF $=0$.
5. Use smooth curve, not rigid ruler joins.
6. CF values answer "how many at or below x".`,
    },
    {
      title: '5) Median and Quartiles from Ogive',
      content: String.raw`Read-off positions:
- Median at $N/2$
- $Q_1$ at $N/4$
- $Q_3$ at $3N/4$
- $\text{IQR}=Q_3-Q_1$

Worked example ($N=200$):
1. Median position $=100$.
2. If read-off at $y=100$ gives $x=36$:
   median $\approx 36$.
3. $Q_1$ position $=50$.
4. If read-off gives $Q_1\approx 22$.
5. $Q_3$ position $=150$.
6. If read-off gives $Q_3\approx 48$.
7. IQR $=48-22=26$.
8. Smaller IQR implies greater consistency.`,
    },
    {
      title: '6) Interpreting and Comparing Grouped Data',
      content: String.raw`Comparison framework:
- Compare medians for central performance.
- Compare IQRs for consistency.

Examples:
1. If median A $> $ median B, A performs higher typically.
2. If IQR A $< $ IQR B, A is more consistent.
3. Steeper ogive usually indicates tighter spread in that region.
4. Count above threshold using total minus cumulative count below threshold.
5. Top 10% threshold read at 90th percentile level.
6. Higher modal class suggests generally higher concentration of values.`,
    },
    {
      title: '7) Comprehensive Assessment and Revision',
      content: String.raw`### Mixed revision focus
1. Midpoints, widths, boundaries.
2. Frequency density calculations.
3. Histogram axis choices and bar interpretation.
4. Frequency polygon coordinates and skew indications.
5. Cumulative frequencies and ogive plotting.
6. Quartile/median/IQR extraction from curves.
7. Comparative interpretation using median and IQR.

### Structured test focus
1. Build grouped table from raw data.
2. Compute FD for unequal classes.
3. Build cumulative table and ogive coordinates.
4. Estimate median from grouped/CF data.
5. Compare consistency using IQR.`,
    },
    {
      title: '8) Memo Highlights',
      content: String.raw`Selected memo anchors:
1. Midpoint of $20\text{-}24$ is $22$.
2. Width of $15.5<x\le 25.5$ is $10$.
3. If frequency $=15$ and width $=5$, FD $=3.0$.
4. If $Q_1=15$ and $Q_3=45$, IQR $=30$.
5. Cumulative table ending at $250$ implies total frequency $=250$.
6. In sample test:
   FD values $0.5,\;0.4,\;1.0$ for classes
   $10\text{-}20,\;20\text{-}40,\;40\text{-}50$.
7. Example grouped median estimate from CF interpolation:
   approximately $23.3$.
8. Smaller IQR indicates more consistent group.`,
    },
  ],
  key_points: [
    'Grouped tables are the foundation of valid grouped-data graphs.',
    'Histogram height is frequency density when class widths differ.',
    'Histogram bars must touch because grouped classes are continuous intervals.',
    'Ogive uses cumulative frequency against upper class boundary.',
    'Median and quartiles can be estimated from ogive read-offs.',
    'IQR is central for consistency comparison between groups.',
  ],
  exam_tips: [
    'Compute class boundaries before histogram plotting.',
    'Always label histogram y-axis as frequency density for unequal widths.',
    'Use smooth curves for ogives and straight segments for polygons.',
    'Read quartiles from the correct y-positions: N/4, N/2, 3N/4.',
  ],
  visual_descriptions: [
    'Grouped-table-to-histogram pipeline diagram (limits -> boundaries -> FD)',
    'Frequency polygon overlay on histogram with midpoint markers',
    'Ogive read-off guide for median and quartiles',
  ],
};

const geometryOfPolygonsMasterNotes: MathTopicNotes = {
  topic: 'Polygons and Circles',
  subject: 'Mathematics',
  grade_level: 'O-Level Form 4',
  summary:
    'Comprehensive Form 4 polygon geometry notes covering polygon classification, interior/exterior angles, diagonals, algebraic angle solving, symmetry, proof structure, and exam-style revision.',
  sections: [
    {
      title: '1) Foundations of Polygons',
      videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%204/Form_4_Polygons__Mastered.mp4',
      content: String.raw`A polygon is a closed 2D figure made only of straight line segments.

Classification:
- Regular: equilateral and equiangular
- Irregular: not all sides/angles equal
- Convex: all interior angles less than $180^\circ$
- Concave: at least one interior angle greater than $180^\circ$

Names by sides:
$3$ triangle, $4$ quadrilateral, $5$ pentagon, $6$ hexagon, $7$ heptagon, $8$ octagon, $9$ nonagon, $10$ decagon, $11$ hendecagon, $12$ dodecagon.

Worked examples:
1. $5$ equal sides and angles: regular pentagon.
2. Any curved side: not a polygon.
3. $9$ sides: nonagon.
4. Interior angle $200^\circ$: concave polygon.
5. Dodecagon has $12$ sides.
6. Rectangle is not always regular (unless square).
7. $n=7$: heptagon.
8. Equilateral/equiangular quadrilateral: square.`,
    },
    {
      title: '2) Interior Angle Sum Theorem',
      content: String.raw`Formula:
\[
\text{Sum of interior angles}=(n-2)\times 180^\circ
\]

Triangle decomposition explains why:
an $n$-gon can be split into $(n-2)$ triangles.

Worked examples:
1. Heptagon ($n=7$): $900^\circ$.
2. Octagon ($n=8$): $1080^\circ$.
3. Sum $1440^\circ$:
   $(n-2)=8\Rightarrow n=10$.
4. $n=15$: sum $2340^\circ$.
5. Sum $1800^\circ$: $n=12$ (dodecagon).
6. Nonagon ($n=9$): $1260^\circ$.
7. Sum $3600^\circ$: $n=22$.
8. Triangle ($n=3$): $180^\circ$.`,
    },
    {
      title: '3) Interior and Exterior Angles of Regular Polygons',
      content: String.raw`For regular $n$-gon:
\[
\text{single exterior angle}=\frac{360^\circ}{n}
\]
\[
\text{single interior angle}=180^\circ-\frac{360^\circ}{n}
=\frac{(n-2)180^\circ}{n}
\]

Also:
\[
\text{Interior}+\text{Exterior}=180^\circ
\]
and sum of all exterior angles of any convex polygon is $360^\circ$.

Worked examples:
1. Regular decagon exterior:
   $\frac{360}{10}=36^\circ$.
2. Regular decagon interior:
   $180-36=144^\circ$.
3. Exterior $40^\circ$:
   $n=\frac{360}{40}=9$.
4. Interior $150^\circ$:
   exterior $30^\circ$, so $n=12$.
5. Regular hexagon interior:
   $120^\circ$.
6. If $n=20$, exterior:
   $18^\circ$.
7. Interior $140^\circ$:
   exterior $40^\circ$, so $n=9$.
8. Equilateral triangle exterior:
   $120^\circ$.`,
    },
    {
      title: '4) Number of Diagonals',
      content: String.raw`Formula:
\[
D=\frac{n(n-3)}{2}
\]

Reason:
each vertex connects diagonally to $(n-3)$ others, then divide by $2$ for double counting.

Worked examples:
1. Hexagon:
   $D=\frac{6(3)}{2}=9$.
2. Dodecagon:
   $D=\frac{12(9)}{2}=54$.
3. If $D=2$:
   $\frac{n(n-3)}{2}=2\Rightarrow n=4$.
4. If $D=20$:
   $\frac{n(n-3)}{2}=20\Rightarrow n=8$.
5. Triangle:
   $D=0$.
6. If $D=35$:
   $\frac{n(n-3)}{2}=35\Rightarrow n=10$.`,
    },
    {
      title: '5) Algebraic Angle Applications',
      content: String.raw`Set up equations by equating angle expressions to the correct polygon total.

Worked examples:
1. Quadrilateral angles $x,2x,3x,4x$:
   $10x=360\Rightarrow x=36^\circ$.
2. Pentagon angles $x,x+20,x+40,x+60,x+80$:
   $5x+200=540\Rightarrow x=68^\circ$.
3. Regular hexagon angle $2x+20$:
   $2x+20=120\Rightarrow x=50$.
4. Triangle exterior angles $2x,3x,4x$:
   $9x=360\Rightarrow x=40$, smallest $=80^\circ$.
5. Quadrilateral with $80^\circ,100^\circ,70^\circ,y$:
   $y=110^\circ$.
6. Pentagon with three angles $110^\circ$ and two equal $x$:
   $330+2x=540\Rightarrow x=105^\circ$.
7. Heptagon angles $x,x+5,\dots,x+30$:
   $7x+105=900\Rightarrow x=113.57^\circ$.
8. Regular polygon with interior $2x$ and exterior $\frac{x}{2}$:
   $2x+\frac{x}{2}=180\Rightarrow x=72$.`,
    },
    {
      title: '6) Symmetry and Advanced Regular-Polygon Properties',
      content: String.raw`For regular $n$-gons:
- lines of symmetry $=n$
- rotational symmetry order $=n$

Key parts:
- Centre: equidistant from all vertices
- Radius: centre to vertex
- Apothem: perpendicular from centre to side midpoint

Area relation (regular polygon):
\[
A=\frac{1}{2}\times \text{Perimeter}\times \text{Apothem}
\]

Worked examples:
1. Regular hexagon has $6$ symmetry lines.
2. Regular dodecagon rotational order is $12$.
3. Square has $4$ symmetry lines.
4. $8$ symmetry lines implies regular octagon.
5. Irregular hexagon does not necessarily have $6$ symmetry lines.
6. Apothem is the center-to-side perpendicular distance.`,
    },
    {
      title: '7) Synthesis and Formal Proof Structures',
      content: String.raw`Use statement-reason format.

Proof examples:
1. Interior angle of regular hexagon is twice that of equilateral triangle:
   $120^\circ=2\times 60^\circ$.
2. Triangle has zero diagonals:
   $\frac{3(3-3)}{2}=0$.
3. Sum of exterior angles of square:
   $4\times 90^\circ=360^\circ$.
4. As $n$ increases, regular exterior angle $\frac{360}{n}$ decreases.
5. Regular pentagon interior angle is $108^\circ$, not a factor of $360^\circ$, so no tessellation by regular pentagons alone.
6. If interior sum is $1260^\circ$, then $(n-2)180=1260\Rightarrow n=9$.`,
    },
    {
      title: '8) Mixed Revision (40 Questions)',
      content: String.raw`Covers:
1. interior/exterior angle sums and single-angle calculations
2. diagonal counts and solving for $n$
3. algebraic angle equations in polygons
4. symmetry and regularity reasoning
5. proof writing and statement-reason format
6. naming polygons by number of sides.`,
    },
    {
      title: '9) Structured Topic Test',
      content: String.raw`Exam-style tasks include:
1. proving pentagon interior sum is $540^\circ$
2. diagonal count for $n=12$
3. finding $n$ from interior angle $160^\circ$
4. proving octagon exterior angle $45^\circ$
5. ratio-based quadrilateral angle solving
6. symmetry count for regular nonagon
7. verifying $n=6$ when diagonals are $9$
8. naming polygon from interior sum $1620^\circ$
9. solving algebraic hexagon-angle expressions
10. deriving regular-hexagon interior angle $120^\circ$
11. finding $n$ from exterior angle $24^\circ$
12. role of apothem in area calculations
13. interior sum for $n=20$
14. proving triangle exterior-angle sum $360^\circ$
15. finding interior angle when diagonal count is $14$.`,
    },
    {
      title: '10) Marking Memo Highlights',
      content: String.raw`Selected result anchors:
1. For $n=11$, interior sum $=1620^\circ$.
2. Regular dodecagon exterior angle $=30^\circ$.
3. Regular octagon interior angle $=135^\circ$.
4. Interior sum $2160^\circ\Rightarrow n=14$.
5. Decagon diagonals $=35$.
6. Regular pentagon interior angle $=108^\circ$.
7. Exterior angle $15^\circ\Rightarrow n=24$.
8. If diagonals $=14$, then $n=7$.
9. For ratio $1:2:3:4$ in quadrilateral, largest angle $=144^\circ$.
10. If interior angle is $144^\circ$, regular polygon has $n=10$.`,
    },
  ],
  key_points: [
    'Interior angle sum uses (n-2) x 180 degrees.',
    'Regular polygon exterior angle is 360/n.',
    'Interior and exterior at a vertex are supplementary.',
    'Diagonal count formula is n(n-3)/2.',
    'Symmetry count equals n only for regular polygons.',
    'Algebraic angle problems require correct total-angle equation first.',
  ],
  exam_tips: [
    'Compute the correct polygon total before solving for variables.',
    'Do not mix diagonal and angle formulas.',
    'For regular polygons, find exterior first, then interior if needed.',
    'In proofs, justify every step with a theorem, definition, or formula.',
  ],
  visual_descriptions: [
    'Polygon naming ladder from 3 to 12 sides',
    'Interior-exterior angle wheel for regular polygons',
    'Diagonal-count growth chart by number of sides',
  ],
};

const geometricalConstructionsLociMasterNotes: MathTopicNotes = {
  topic: 'Constructions and Loci',
  subject: 'Mathematics',
  grade_level: 'O-Level Form 4',
  summary:
    'Comprehensive Form 4 constructions and loci notes covering ruler-compass constructions, triangles and quadrilaterals, loci regions, circle constructions, division in ratio, scale drawings, precision checks, and assessment tasks.',
  sections: [
    {
      title: '1) Foundational Construction Principles',
      videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%204/Geometrical_Constructions.mp4',
      content: String.raw`Geometrical construction is proof-by-logic using ruler and compasses.

Core rule:
- Keep construction arcs visible; they are part of method evidence.

Key basics:
1. Constructing a line segment of fixed length.
2. Perpendicular bisector of a segment.
3. Angle bisector of a given angle.
4. Standard angles via construction: $60^\circ, 30^\circ, 90^\circ, 45^\circ, 120^\circ$.

Worked examples:
1. Construct $PQ=5.8\text{ cm}$.
2. Bisect a $10\text{ cm}$ segment.
3. Bisect an $80^\circ$ angle into two $40^\circ$ angles.
4. Construct $60^\circ$ at a point on a line.
5. Construct $30^\circ$ by bisecting $60^\circ$.
6. Construct $90^\circ$ at a point on a line.
7. Construct $45^\circ$ by bisecting $90^\circ$.
8. Construct $120^\circ$ using successive equal-radius arc steps.`,
    },
    {
      title: '2) Triangle Constructions',
      content: String.raw`Standard triangle cases:
- SSS (side-side-side)
- SAS (side-angle-side)
- ASA (angle-side-angle)

Method highlights:
1. Draw base first.
2. Use arc intersections for unknown vertex.
3. Join to complete triangle.

Worked examples:
1. SSS: $AB=6,\;BC=5,\;AC=4$.
2. SAS: $PQ=7,\;\angle P=60^\circ,\;PR=5$.
3. ASA: $XY=8,\;\angle X=45^\circ,\;\angle Y=60^\circ$.
4. Equilateral triangle side $5\text{ cm}$.
5. Isosceles triangle base $4$, equal sides $6$.
6. Right triangle base $5$, height $12$.
7. Isosceles right triangle from two equal legs.
8. Equilateral triangle side $3\text{ cm}$.`,
    },
    {
      title: '3) Quadrilateral Constructions',
      content: String.raw`Construct by preserving defining properties:
- Parallelogram: opposite sides equal and parallel.
- Rhombus: all sides equal.
- Rectangle: right angles with opposite sides equal.
- Kite: two pairs of adjacent equal sides.
- Square: equal sides and right angles.

Worked examples:
1. Parallelogram $ABCD$: $AB=7,\;AD=5,\;\angle A=60^\circ$.
2. Rhombus $PQRS$: side $6$, $\angle P=120^\circ$.
3. Rectangle $WXYZ$: $WX=8,\;WZ=4$.
4. Kite with $AB=AD=4$ and $CB=CD=7$.
5. Square side $5\text{ cm}$.
6. Parallelogram from triangle + diagonal data.`,
    },
    {
      title: '4) Loci and Region Shading',
      content: String.raw`Fundamental loci:
1. Fixed distance from a point -> circle.
2. Equidistant from two points -> perpendicular bisector.
3. Fixed distance from a line -> two parallel lines.
4. Equidistant from two intersecting lines -> angle bisector.

Worked examples:
1. Locus $OP=4\text{ cm}$.
2. Locus equidistant from points $A$ and $B$.
3. Locus $2\text{ cm}$ from line $L$.
4. Locus equidistant from rays $AB$ and $AC$.
5. Region closer to $A$ than $B$.
6. Region within $3\text{ cm}$ of $O$ and closer to $A$ than $B$.
7. Point equidistant from triangle vertices (circumcenter).
8. Point equidistant from triangle sides (incenter).`,
    },
    {
      title: '5) Circle Constructions',
      content: String.raw`Core constructions:
- Circumcircle: intersection of perpendicular bisectors.
- Incircle: intersection of angle bisectors, then drop perpendicular to side for radius.
- Tangent at point on circle: perpendicular to radius at contact point.
- Tangents from external point: midpoint-circle method on segment from center to external point.

Worked examples:
1. Circumcircle of triangle with sides $6,8,10$.
2. Incircle of equilateral triangle.
3. Tangent at point $P$ on given circle.
4. Two tangents from external point $T$.
5. Circumcenter of right triangle is midpoint of hypotenuse.
6. Incenter from two angle bisectors.
7. Construct both tangents $TX, TY$.
8. Tangent to an arc at point $A$ after finding arc center.`,
    },
    {
      title: '6) Dividing a Line Segment',
      content: String.raw`Auxiliary-line method:
1. Draw segment $AB$.
2. Draw an acute auxiliary ray from $A$.
3. Mark equal steps on auxiliary ray.
4. Join last mark to $B$.
5. Draw parallels through intermediate marks.

Applications:
- Divide into $n$ equal parts.
- Internal ratio division (e.g., $2:3$, $1:2$, $3:4$).

Worked examples:
1. Divide $10\text{ cm}$ into $3$ equal parts.
2. Divide $8\text{ cm}$ in ratio $2:3$.
3. Divide $7\text{ cm}$ into $4$ equal parts.
4. Divide $9\text{ cm}$ in ratio $1:2$.
5. Mark $1/5$ of a segment.
6. Divide in ratio $3:4$.`,
    },
    {
      title: '7) Scale Drawings and Bearings',
      content: String.raw`Scale conversion:
- Drawing length = real length / scale factor.

Bearing workflow:
1. Draw North reference.
2. Measure clockwise bearing angle.
3. Plot scaled distance along that direction.

Worked examples:
1. Scale $1:100$, real $5\text{ m}$ -> drawing $5\text{ cm}$.
2. If $1\text{ cm}:2\text{ m}$ and map distance is $4.5\text{ cm}$, real distance $9\text{ m}$.
3. Bearing $060^\circ$, distance $500\text{ m}$ at $1:10{,}000$ -> draw $5\text{ cm}$.
4. Additional scale drills: $1:50,\;1:250,\;1:1000$ conversions.`,
    },
    {
      title: '8) Precision and Common Errors',
      content: String.raw`High-frequency errors:
1. Erasing arcs (method evidence lost).
2. Blunt pencil / loose compass (inaccurate intersections).
3. Tangential arc touch instead of clear intersection.
4. Changing compass width unintentionally.
5. Shading wrong locus side.
6. Drawing lines that stop exactly at points (reduced clarity).

Quality control checklist:
- Verify key lengths and angles after construction.
- Keep all guide arcs visible and readable.`,
    },
    {
      title: '9) Mixed Construction Assessment',
      content: String.raw`Typical integrated tasks:
1. Construct triangle with given sides.
2. Construct two loci and mark their intersection.
3. Build an incircle and tangent.
4. Divide a side in ratio.
5. Construct standard angles ($90^\circ,\;45^\circ,\;120^\circ$).
6. Shade compound loci regions with inequalities.
7. Construct circumcircle.
8. Build associated quadrilateral with condition on locus.`,
    },
    {
      title: '10) Practical Test and Memo Highlights',
      content: String.raw`Practical test themes:
1. Triangle + incircle.
2. External tangents from point to circle.
3. Rhombus from side and diagonal.
4. Scale-bearings route and resultant distance.
5. Region shading inside polygon by distance constraints.

Memo highlights:
- Locus equidistant from two points is perpendicular bisector.
- Locus equidistant from two lines is angle bisector.
- Tangent at a circle point is perpendicular to radius there.
- Construction validity depends on visible arcs and measured checks.`,
    },
  ],
  key_points: [
    'Constructions must be justified with visible arc evidence.',
    'Triangle cases SSS, SAS, and ASA each have fixed procedures.',
    'Loci are distance/equidistance conditions expressed geometrically.',
    'Circle tools rely on bisectors, radii, and perpendicularity.',
    'Auxiliary-line parallels solve equal and ratio partitioning.',
    'Scale drawings require strict unit conversion and bearing discipline.',
  ],
  exam_tips: [
    'Keep compass width fixed when a method requires equal arcs.',
    'Use sharp pencils and extend guide lines for readability.',
    'Label key points and final regions clearly after shading.',
    'Always perform a post-construction measurement check.',
  ],
  visual_descriptions: [
    'Ruler-compass workflow cards for core constructions',
    'Loci atlas showing circle, bisector, parallels, and angle-bisector regions',
    'Scale-and-bearing plotting board with north reference and arc marks',
  ],
};

const inequalitiesMasterNotes: MathTopicNotes = {
  topic: 'Inequalities',
  subject: 'Mathematics',
  grade_level: 'O-Level Form 4',
  summary:
    'Comprehensive Form 4 inequalities notes covering linear and compound inequalities, negative-multiplier inversion, quadratic sign analysis, fractional inequalities, simultaneous constraints, and exam-style applications.',
  sections: [
    {
      title: '1) Foundations of Inequality Logic',
      videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%204/Inequalities__The_One_Rule.mp4',
      content: String.raw`Inequalities model ranges rather than single fixed values.

Core symbols:
1. $<$ : strictly less than
2. $>$ : strictly greater than
3. $\leq$ : less than or equal to
4. $\geq$ : greater than or equal to

Key principle:
- Maintain balance by applying the same operation to both sides.

Worked examples:
1. Translate "at most" -> $\leq$.
2. Translate "at least" -> $\geq$.
3. Distinguish equation vs inequality solution (single value vs set).
4. Relate inequality ranges to constrained quantities.
5. Interpret boundary inclusion/exclusion in context.
6. Verify whether a test value satisfies an inequality.
7. Compare two values using strict and inclusive notation.
8. Express domain restrictions as inequalities.`,
    },
    {
      title: '2) Linear Inequalities in One Variable',
      content: String.raw`Solve by inverse operations (same balancing method as linear equations).

Worked examples:
1. $x+9<15\Rightarrow x<6$.
2. $x-7\geq 4\Rightarrow x\geq 11$.
3. $5x>35\Rightarrow x>7$.
4. $\frac{x}{4}\leq 2\Rightarrow x\leq 8$.
5. $3x+8<23\Rightarrow x<5$.
6. $6x-4\geq 2x+12\Rightarrow x\geq 4$.
7. $2(x-3)\leq 10\Rightarrow x\leq 8$.
8. $9x+5>3x+23\Rightarrow x>3$.`,
    },
    {
      title: '3) Negative Multiplier Inversion Rule',
      content: String.raw`If you multiply or divide by a negative number, reverse the inequality sign.

Worked examples:
1. $-4x<20\Rightarrow x>-5$.
2. $-2x\geq 14\Rightarrow x\leq -7$.
3. $8-3x>23\Rightarrow x<-5$.
4. $\frac{x}{-5}\leq 3\Rightarrow x\geq -15$.
5. $12-x<18\Rightarrow x>-6$.
6. $-6x+2\leq -10\Rightarrow x\geq 2$.

Common error:
- Forgetting to flip the sign after dividing by a negative.`,
    },
    {
      title: '4) Compound Inequalities and Interval Notation',
      content: String.raw`Represent solution ranges on number lines and in interval notation.

Boundary logic:
1. Open endpoint for strict inequality ($<$ or $>$).
2. Closed endpoint for inclusive inequality ($\leq$ or $\geq$).

Conversions:
1. $2<x<8\Rightarrow (2,8)$
2. $-5\leq x\leq 5\Rightarrow [-5,5]$
3. $0<x\leq 10\Rightarrow (0,10]$
4. $x\geq 4\Rightarrow [4,\infty)$
5. $x<-2\Rightarrow (-\infty,-2)$
6. $-3\leq x<0\Rightarrow [-3,0)$`,
    },
    {
      title: '5) Quadratic Inequalities: Factor and Sign Analysis',
      content: String.raw`Method:
1. Factorize expression.
2. Find critical values (roots).
3. Test signs in intervals.
4. Select intervals matching inequality sign.

Worked examples:
1. $x^2-5x+6>0\Rightarrow x<2\text{ or }x>3$.
2. $x^2-9\leq 0\Rightarrow -3\leq x\leq 3$.
3. $x^2+4x+3<0\Rightarrow -3<x<-1$.
4. $x^2-2x-8\geq 0\Rightarrow x\leq -2\text{ or }x\geq 4$.
5. $x^2-1\leq 0\Rightarrow -1\leq x\leq 1$.
6. $x^2-7x+10<0\Rightarrow 2<x<5$.
7. $x^2+6x+8>0\Rightarrow x<-4\text{ or }x>-2$.
8. $(x-5)^2\leq 0\Rightarrow x=5$.

Common error:
- Assuming middle interval always works; always verify via test points.`,
    },
    {
      title: '6) Inequalities with Fractions',
      content: String.raw`Use LCM to clear denominators, then solve normally.
Track denominator restrictions (undefined points excluded).

Worked examples:
1. $\frac{x}{2}+\frac{1}{3}\leq \frac{5}{6}\Rightarrow x\leq 1$.
2. $\frac{2x}{5}-\frac{x}{2}>1\Rightarrow x<-10$.
3. $\frac{x+2}{3}\geq 4\Rightarrow x\geq 10$.
4. $\frac{3}{x}<1,\;x>0\Rightarrow x>3$.
5. $\frac{x}{4}-\frac{x}{8}\leq 2\Rightarrow x\leq 16$.
6. $\frac{5}{x-2}>0\Rightarrow x>2,\;x\neq 2$.`,
    },
    {
      title: '7) Simultaneous Inequalities: Intersection of Sets',
      content: String.raw`Solve each inequality separately, then take the overlap.

Worked examples:
1. $x+3>5$ and $2x<10\Rightarrow 2<x<5$.
2. $3x\geq 9$ and $x-2\leq 4\Rightarrow 3\leq x\leq 6$.
3. $2x+1>-3$ and $x+5<8\Rightarrow -2<x<3$.
4. $5x\leq 20$ and $x+1>1\Rightarrow 0<x\leq 4$.
5. $x-4\geq -2$ and $3x<15\Rightarrow 2\leq x<5$.
6. $4x+2\geq 10$ and $x-5\leq -2\Rightarrow 2\leq x\leq 3$.`,
    },
    {
      title: '8) Word Problems and Constraint Translation',
      content: String.raw`Translate wording into inequalities:
1. "At most" -> $\leq$
2. "At least" -> $\geq$
3. "No more than" -> $\leq$
4. "More than" -> $>$

Worked examples:
1. Consecutive even negatives with product at most $80$:
   $x(x+2)\leq 80\Rightarrow -10\leq x\leq 8$ and negative even solutions $\{-10,-8,-6,-4,-2\}$.
2. Water budget: $0.336m\leq 4.00\Rightarrow m\leq 11$ whole units.
3. Shopping with VAT: $12+1.15(3.50n)\leq 50\Rightarrow n\leq 9$.
4. Registration fee: $40+10n\leq 100\Rightarrow n\leq 6$.
5. Postage: $0.25n\leq 10\Rightarrow n\leq 40$.
6. Insurance premium budget inequality setup with fixed + variable asset values.
7. Electricity: $16.50+0.0202u<40$ (solve for max whole $u$).
8. Consecutive integers at least $15$: $x+(x+1)\geq 15\Rightarrow x\geq 7$.`,
    },
    {
      title: '9) Mixed Revision Set (1-40)',
      content: String.raw`Covers:
1. one-step and multi-step linear inequalities
2. inequalities with negative coefficients
3. interval and number-line conversion
4. quadratic inequalities by sign analysis
5. simultaneous inequality intersections
6. fractional inequalities
7. integer constraints and extremal values
8. contextual word-problem translation.`,
    },
    {
      title: '10) Structured Test and Memo Anchors',
      content: String.raw`Core exam-style anchors:
1. Simultaneous inequality example:
   $2x-3\geq 5$ and $x+4<12\Rightarrow [4,8)$ with integers $\{4,5,6,7\}$.
2. Budget inequality:
   $10+0.453m\leq 50\Rightarrow m\leq 88$ (whole units).
3. Quadratic sign-analysis:
   $x^2-x-12\leq 0\Rightarrow (x-4)(x+3)\leq 0\Rightarrow [-3,4]$.
4. Fraction inequality:
   $\frac{x}{2}-\frac{x+1}{3}>1\Rightarrow x>8$.
5. Product negative region:
   $(x-2)(x-5)<0\Rightarrow 2<x<5$.

Fundamental rules:
1. Maintain algebraic balance on both sides.
2. Reverse inequality when multiplying/dividing by negative.
3. Use open/closed endpoints correctly.
4. Validate quadratic intervals with sign checks.`,
    },
  ],
  key_points: [
    'Inequalities describe ranges, not single-point solutions.',
    'Balancing operations mirror equation-solving logic.',
    'Reverse inequality sign when multiplying/dividing by a negative.',
    'Compound solutions are intersections of valid sets.',
    'Quadratic inequalities require roots and interval sign testing.',
    'Fraction inequalities need denominator restrictions and LCM strategy.',
  ],
  exam_tips: [
    'Flip the sign every time you divide or multiply by a negative value.',
    'Use a number line to avoid interval-endpoint mistakes.',
    'For quadratics, test one value in each interval before choosing solutions.',
    'In word problems, translate phrases like "at most" and "at least" first.',
  ],
  visual_descriptions: [
    'Number-line endpoint key (open vs closed circles)',
    'Quadratic sign chart across critical values',
    'Set-overlap diagram for simultaneous inequalities',
  ],
};

const algebraicManipulationMasterNotes: MathTopicNotes = {
  topic: 'Algebraic Manipulation',
  subject: 'Mathematics',
  grade_level: 'O-Level Form 4',
  summary:
    'Comprehensive Form 4 algebraic manipulation notes covering expansion, factorisation, algebraic fractions, changing subject of formula, indices, rationalisation, and integrated multi-step problem solving.',
  sections: [
    {
      title: '1) Algebraic Logic Foundations',
      videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%204/Algebraic_Manipulation.mp4',
      content: String.raw`Algebraic manipulation is the structural language of advanced mathematics.

Core idea:
1. Like terms must have identical variable structure and powers.
2. Addition/subtraction is valid only for like terms.
3. Multiplication/division can combine unlike factors.
4. Algebra models variable relationships in real contexts.

Worked examples:
1. Distinguish $x$ and $x^2$ as unlike terms.
2. Combine $3x+5x=8x$.
3. Reject $x+2x^2$ as non-combinable.
4. Multiply unlike factors: $x\cdot x^2=x^3$.
5. Simplify mixed-variable like terms: $2ab-5ab=-3ab$.
6. Compare equation-solving vs expression simplification.
7. Translate contextual quantity relationships into algebra symbols.
8. Check dimensional consistency before combining terms.`,
    },
    {
      title: '2) Subtopic A: Expanding Expressions',
      content: String.raw`Expansion removes brackets using distributive law.

Rules:
1. $a(b+c)=ab+ac$
2. $(a+b)^2=a^2+2ab+b^2$
3. $(a-b)^2=a^2-2ab+b^2$
4. $(a+b)(a-b)=a^2-b^2$

Worked examples:
1. $6(l+2)=6l+12$.
2. $x(x+2)=x^2+2x$.
3. $(x-4)(x+4)=x^2-16$.
4. $(2x-y)(3x-2y)=6x^2-7xy+2y^2$.
5. $(x+6y)^2=x^2+12xy+36y^2$.
6. $-3(x-4)=-3x+12$.
7. $2a(3a^2-5b)=6a^3-10ab$.
8. $(x-5)^2=x^2-10x+25$.

Common error:
- Negative outside a bracket must be distributed to all terms.`,
    },
    {
      title: '3) Subtopic B: Factorisation Techniques',
      content: String.raw`Factorisation is the inverse of expansion.

Main methods:
1. HCF extraction
2. Difference of two squares
3. Quadratic trinomial factorisation
4. Grouping

Worked examples:
1. $6l^2+12l=6l(l+2)$.
2. $x^2-16=(x-4)(x+4)$.
3. $x^2+2x-48=(x+8)(x-6)$.
4. $2x^2-8=2(x-2)(x+2)$.
5. $3x-2y$ has no non-trivial factorisation.
6. $ax+ay+bx+by=(a+b)(x+y)$.
7. $3x^2+15x+18=3(x+2)(x+3)$.
8. $100-x^2=(10-x)(10+x)$.

Common error:
- Stopping too early before full factorisation.`,
    },
    {
      title: '4) Subtopic C: Algebraic Fractions',
      content: String.raw`Simplify by cancelling common factors after full factorisation.
Do not cancel terms linked by $+$ or $-$.

Restriction rule:
- Any variable value that makes denominator $0$ is excluded.

Worked examples:
1. $\frac{6x^2}{3x}=2x,\;x\neq 0$.
2. $\frac{x^2-16}{x-4}=x+4,\;x\neq 4$.
3. $\frac{2x+4}{2}=x+2$.
4. $\frac{x^2+2x}{x}=x+2,\;x\neq 0$.
5. $\frac{x+2}{y+2}$ unchanged.
6. $\frac{x^2-25}{x+5}=x-5,\;x\neq -5$.

Common error:
- Cancelling across addition/subtraction instead of factors.`,
    },
    {
      title: '5) Subtopic D: Changing the Subject of a Formula',
      content: String.raw`Goal: isolate required variable with coefficient $+1$.

Procedure:
1. Clear fractions where useful.
2. Collect subject terms on one side.
3. Factor subject if repeated.
4. Divide by coefficient/factor.

Worked examples:
1. $A=6l^2\Rightarrow l=\sqrt{\frac{A}{6}}$.
2. $T=c+kn\Rightarrow n=\frac{T-c}{k}$.
3. $C=\pi D\Rightarrow D=\frac{C}{\pi}$.
4. $y=\frac{x+2}{3}\Rightarrow x=3y-2$.
5. $v^2=u^2+2as\Rightarrow a=\frac{v^2-u^2}{2s}$.
6. $P=2l+2w\Rightarrow w=\frac{P-2l}{2}$.

Common error:
- Subject still appearing on both sides after rearrangement.`,
    },
    {
      title: '6) Subtopic E: Expressions with Indices',
      content: String.raw`Index laws:
1. $a^m\cdot a^n=a^{m+n}$
2. $\frac{a^m}{a^n}=a^{m-n}$
3. $(a^m)^n=a^{mn}$
4. $a^{-n}=\frac{1}{a^n}$
5. $a^0=1,\;a\neq 0$
6. $a^{m/n}=\sqrt[n]{a^m}$

Worked examples:
1. $2^2\cdot 2^3=2^5=32$.
2. $\frac{x^5}{x^2}=x^3$.
3. $10^{-2}=0.01$.
4. $(x^3)^2=x^6$.
5. $16^{1/2}=4$.
6. $4\pi\times 10^3=4000\pi$.
7. $a^0=1$.
8. $x^{-3}\cdot x^5=x^2$.

Common error:
- Changing base when multiplying powers with same base.`,
    },
    {
      title: '7) Subtopic F: Rationalising the Denominator',
      content: String.raw`Remove surds from denominator by multiplying by suitable form of $1$.

Methods:
1. Monomial surd denominator: multiply by same surd.
2. Binomial surd denominator: multiply by conjugate.

Worked examples:
1. $\frac{1}{\sqrt{2}}=\frac{\sqrt{2}}{2}$.
2. $\frac{6}{\sqrt{3}}=2\sqrt{3}$.
3. $\frac{1}{2+\sqrt{3}}=2-\sqrt{3}$.
4. $\frac{\sqrt{2}}{\sqrt{3}}=\frac{\sqrt{6}}{3}$.
5. $\frac{2}{3-\sqrt{5}}=\frac{3+\sqrt{5}}{2}$.
6. $\frac{5}{\sqrt{10}}=\frac{\sqrt{10}}{2}$.`,
    },
    {
      title: '8) Multi-Step Algebraic Synthesis',
      content: String.raw`Integrated workflows combine expansion, factorisation, simplification, and indices.

Worked examples:
1. $\frac{(x+2)(x-2)}{x^2+2x}=\frac{x-2}{x},\;x\neq 0,-2$.
2. If $A=6l^2$ and $l$ doubles, new area factor is $4$.
3. $\frac{x+2}{y+2}=\frac{2}{3},\;y=7\Rightarrow x=4$.
4. $\frac{(x^2)^3\cdot x^{-2}}{x^2}=x^2$.`,
    },
    {
      title: '9) Mixed Revision (1-40)',
      content: String.raw`Covers:
1. expansion and special products
2. complete factorisation
3. algebraic-fraction simplification and restrictions
4. changing subject of formula
5. index-law simplification and evaluation
6. denominator rationalisation
7. mixed multi-skill expressions.`,
    },
    {
      title: '10) Structured Test and Memo Anchors',
      content: String.raw`Key anchors:
1. Rectangle area: $A=6(x+2)=6x+12$.
2. $x(x+2)=48\Rightarrow (x+8)(x-6)=0\Rightarrow x=6$ (consecutive even pair $6,8$).
3. $T=c+kn\Rightarrow n=\frac{T-c}{k}$.
4. With $T=80,\;c=20,\;k=10$, $n=6$.
5. $\frac{x^2+7x+10}{x+2}=x+5,\;x\neq -2$.
6. If $A=6l^2$ and $l$ tripled, area factor $9$ (900% of original).
7. $\frac{2^5\cdot 2^{-2}}{2^3}=1$.
8. $\frac{4}{2+\sqrt{2}}=4-2\sqrt{2}$.
9. $5x^2-20=5(x-2)(x+2)$.
10. $\frac{(x-3)^2}{x^2-9}=\frac{x-3}{x+3},\;x\neq 3,-3$.`,
    },
  ],
  key_points: [
    'Algebraic manipulation depends on like-term discipline and operation order.',
    'Expansion and factorisation are inverse processes.',
    'Algebraic fractions simplify by cancelling factors, not terms.',
    'Formula rearrangement requires full variable isolation.',
    'Index laws must preserve base identity.',
    'Rationalisation removes surds from denominators using conjugates when needed.',
  ],
  exam_tips: [
    'Always check for further factorisation after taking out HCF.',
    'State denominator restrictions after simplifying algebraic fractions.',
    'When changing subject, verify subject appears once and only once.',
    'In surd rationalisation, use conjugates for binomial denominators.',
  ],
  visual_descriptions: [
    'Expansion map: distributive, FOIL, and special products',
    'Factorisation decision tree (HCF, DOTS, trinomial, grouping)',
    'Formula-rearrangement flowchart and index-law ladder',
  ],
};

const equationsMasterNotes: MathTopicNotes = {
  topic: 'Equations',
  subject: 'Mathematics',
  grade_level: 'O-Level Form 4',
  summary:
    'Comprehensive Form 4 equations notes covering linear, fractional, simultaneous, quadratic, surd/index equations, word-problem formation, and graphical solving.',
  sections: [
    {
      title: '1) Algebraic Balance Principle',
      videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%204/Equation-Solving_Toolkit.mp4',
      content: String.raw`An equation states two expressions are equal.

Balance rule:
1. Any operation on one side must be applied to the other side.
2. Goal is to isolate the variable while preserving equality.
3. Verification by substitution confirms correctness.

Core idea:
- Solve by undoing operations in reverse order.`,
    },
    {
      title: '2) Linear Equations in One Variable',
      content: String.raw`Method:
1. Collect variable terms on one side.
2. Move constants to the other side.
3. Divide by coefficient of variable.
4. Verify solution in original equation.

Worked examples:
1. $x+2x+2x-60+960=3600\Rightarrow x=540$.
2. $10x+5=8x+15\Rightarrow x=5$.
3. $3(x-4)=15\Rightarrow x=9$.
4. $20+10n=80\Rightarrow n=6$.
5. $15x-45=0\Rightarrow x=3$.
6. $4x+10=2x+30\Rightarrow x=10$.
7. $5(2x+1)=25\Rightarrow x=2$.
8. $\frac{x}{4}=12\Rightarrow x=48$.

Common error:
- Sign changes when moving terms across equality are often missed.`,
    },
    {
      title: '3) Equations Involving Fractions',
      content: String.raw`Clear denominators with LCM.

Procedure:
1. Find LCM of denominators.
2. Multiply every term by LCM.
3. Expand any bracketed numerators.
4. Solve resulting linear equation.

Worked examples:
1. $\frac{x+2}{y+2}=\frac{2}{7}\Rightarrow x=\frac{2y-10}{7}$.
2. $\frac{x}{3}+4=10\Rightarrow x=18$.
3. $\frac{2x-3}{5}=3\Rightarrow x=9$.
4. $\frac{x}{2}+\frac{x}{3}=10\Rightarrow x=12$.
5. $\frac{x+5}{y+5}=\frac{4}{7}\Rightarrow x=\frac{4y-15}{7}$.
6. $\frac{1}{2}x+\frac{1}{4}=5\Rightarrow x=9.5$.

Common error:
- Forgetting to multiply constants by the LCM.`,
    },
    {
      title: '4) Simultaneous Linear Equations',
      content: String.raw`Solve systems by substitution or elimination.

Worked examples:
1. Partial-variation fees:
   $a+6b=80,\;a+10b=100\Rightarrow b=5,\;a=50$.
2. Digits problem:
   $x+y=12,\;x=2y+3\Rightarrow (x,y)=(9,3)$.
3. Fraction-relationship system:
   $\frac{x+2}{y+2}=\frac12,\;\frac{x+5}{y+5}=\frac47\Rightarrow (x,y)=(7,16)$.
4. $3x-2y=4,\;x+6y=28\Rightarrow (x,y)=(4,4)$.
5. $x+y=10,\;x-y=4\Rightarrow (x,y)=(7,3)$.
6. $2x+y=13,\;x+y=8\Rightarrow (x,y)=(5,3)$.

Common error:
- Sign mistakes when subtracting equations, especially subtracting negatives.`,
    },
    {
      title: '5) Quadratic Equations',
      content: String.raw`Standard form:
$ax^2+bx+c=0$

Methods:
1. Factorisation
2. Quadratic formula
3. Discriminant analysis $\Delta=b^2-4ac$

Worked examples:
1. Consecutive even product:
   $x(x+2)=48\Rightarrow x^2+2x-48=0\Rightarrow x=-8\text{ or }6$ (context selects valid root).
2. $x^2-5x+6=0\Rightarrow x=2,3$.
3. $2x^2+4x-1=0\Rightarrow x=\frac{-4\pm\sqrt{24}}{4}$.
4. $x^2+4x+4=0\Rightarrow \Delta=0$ (equal real roots).
5. $x^2+x-12=0\Rightarrow x=-4,3$.
6. $x^2=36\Rightarrow x=\pm 6$.
7. $(x-5)(x+3)=0\Rightarrow x=5,-3$.
8. $2x^2+5x+3=0\Rightarrow \Delta=1$.

Common error:
- Failing to first rearrange to zero before identifying $a,b,c$.`,
    },
    {
      title: '6) Equations with Surds and Indices',
      content: String.raw`Surds:
1. Isolate root expression.
2. Square both sides.
3. Check final value in original equation.

Indices:
1. Match common bases when possible.
2. Apply index laws correctly.

Worked examples:
1. $\sqrt{x}=5\Rightarrow x=25$.
2. $\sqrt{x+2}=4\Rightarrow x=14$.
3. $2^x=8\Rightarrow x=3$.
4. $\sqrt{0.7193398}\approx 0.848$.
5. $4\pi\times 10^3\approx 12568$ (using $\pi\approx3.142$).
6. $\sqrt{2x}=6\Rightarrow x=18$.`,
    },
    {
      title: '7) Forming Equations from Word Problems',
      content: String.raw`Translate statements into algebra first.

Useful translations:
1. "Varies with" -> $y=kx$
2. Two-digit number with tens $x$, units $y$ -> $10x+y$
3. Net income -> gross minus deductions
4. Discount $d\%$ on original $x$ -> sale price $x(1-\frac{d}{100})$

Worked examples:
1. $7\%$ discount gives $2464.50$:
   $0.93x=2464.50\Rightarrow x=2650$.
2. Net salary:
   $165-(4.40+2.70)=157.90$.
3. Depreciation $3\%$ on $1360$:
   $1360(0.97)=1319.20$.
4. Circumference relation:
   $C=\pi D$.
5. Jacket $35$ with $15\%$ discount:
   $35(0.85)=29.75$.
6. If $y=10$ when $x=2$ in $y=kx$, then $k=5$.`,
    },
    {
      title: '8) Solving Equations Graphically',
      content: String.raw`Graphical solution is read at intersections.

Rules:
1. For $f(x)=0$, find x-intercepts of $y=f(x)$.
2. For $f(x)=g(x)$, find intersection points of two graphs.

Worked examples:
1. $y=x^2-5x+6$ crosses x-axis at $x=2,3$.
2. $2x+1=5$ solved by intersection of $y=2x+1$ and $y=5$, giving $x=2$.`,
    },
    {
      title: '9) Mixed Revision Set (1-40)',
      content: String.raw`Covers:
1. linear equations
2. fractional equations
3. simultaneous systems
4. quadratic equations
5. surd/index equations
6. equation formation from context
7. graphical interpretation.`,
    },
    {
      title: '10) Structured Test and Memo Anchors',
      content: String.raw`Anchors:
1. $4x-12=28\Rightarrow x=10$.
2. For $x^2-2x+1=0$, discriminant $\Delta=0$.
3. Fee system:
   $a+6b=80,\;a+10b=100\Rightarrow (a,b)=(50,5)$.
4. $\frac{x+5}{y+5}=\frac47\Rightarrow x=\frac{4y-15}{7}$.

Practice memo highlights:
1. $5x-20=80\Rightarrow x=20$.
2. $x+4x+900=1200\Rightarrow x=60$.
3. $\frac{x}{2}+\frac{x}{4}=6\Rightarrow x=8$.
4. $x^2-7x+10=0\Rightarrow x=2,5$.
5. $\sqrt{x-5}=2\Rightarrow x=9$.
6. $3^x=81\Rightarrow x=4$.`,
    },
  ],
  key_points: [
    'Equations are solved by preserving equality through balanced operations.',
    'Fractional equations are easiest after clearing denominators by LCM.',
    'Simultaneous equations use substitution or elimination to find one intersection pair.',
    'Quadratics require standard form before factorisation or formula use.',
    'Discriminant determines the nature of quadratic roots.',
    'Word problems must be translated into algebra before solving.',
  ],
  exam_tips: [
    'Always verify solutions by substitution in the original equation.',
    'Watch sign changes when moving terms across the equals sign.',
    'In elimination, align equations carefully before adding/subtracting.',
    'For surd equations, check for extraneous roots after squaring.',
  ],
  visual_descriptions: [
    'Equation-balance scale showing mirrored operations',
    'System-of-lines intersection map for simultaneous equations',
    'Parabola with discriminant-based root cases',
  ],
};

const shearTransformationMasterNotes: MathTopicNotes = {
  topic: 'Shear (Transformation)',
  subject: 'Mathematics',
  grade_level: 'O-Level Form 4',
  summary:
    'Comprehensive Form 4 shear transformation notes covering shear definition, invariant lines, shear factor, coordinate mapping, area preservation, combined transformations, and exam-style practice.',
  sections: [
    {
      title: '1) Fundamental Principles of Shear',
      videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%204/Mastering_Shear_Transformations.mp4',
      content: String.raw`A shear is a transformation that shifts points parallel to a fixed line (the invariant line).

Key properties:
- The invariant line remains fixed; all other points slide parallel to it.
- Distance moved is proportional to distance from the invariant line.
- Shear preserves area but changes shape.
- Shear is NOT an isometry (angles and lengths change).

## Shear Factor

The shear factor $k$ is defined as:
$$k = \frac{\text{displacement of a point}}{\text{perpendicular distance from invariant line}}$$

## Shear with x-axis as Invariant Line

For a shear with the x-axis invariant and shear factor $k$:
$$\begin{pmatrix}x'\\y'\end{pmatrix} = \begin{pmatrix}1 & k\\0 & 1\end{pmatrix}\begin{pmatrix}x\\y\end{pmatrix}$$

So: $x' = x + ky$, $y' = y$.

## Shear with y-axis as Invariant Line

For a shear with the y-axis invariant and shear factor $k$:
$$\begin{pmatrix}x'\\y'\end{pmatrix} = \begin{pmatrix}1 & 0\\k & 1\end{pmatrix}\begin{pmatrix}x\\y\end{pmatrix}$$

So: $x' = x$, $y' = kx + y$.

## Worked Examples

1. A shear with x-axis invariant and $k = 2$ maps $A(1,3)$:
$$x' = 1 + 2(3) = 7,\quad y' = 3$$
Image: $A'(7, 3)$.

2. A shear with y-axis invariant and $k = -1$ maps $B(4, 2)$:
$$x' = 4,\quad y' = -1(4) + 2 = -2$$
Image: $B'(4, -2)$.

3. Triangle with vertices $P(0,0)$, $Q(3,0)$, $R(1,2)$ under shear (x-axis invariant, $k=1$):
- $P'(0,0)$, $Q'(3,0)$, $R'(1+2, 2) = R'(3,2)$.
- Area of $PQR$ = Area of $P'Q'R'$ (shear preserves area).`,
    },
    {
      title: '2) Describing a Shear and Exam Strategies',
      content: String.raw`## Full Description of a Shear

A complete description requires:
1. Name the transformation (shear).
2. State the invariant line.
3. State the shear factor $k$.

## Finding the Shear Factor

Given object point $A$ and image $A'$:
$$k = \frac{AA'}{d}$$
where $d$ is the perpendicular distance of $A$ from the invariant line.

## Finding the Invariant Line

- Points on the invariant line map to themselves.
- If $A \to A'$, the invariant line is perpendicular to $AA'$ passing through the fixed points.

## Exam Tips

- Always state "shear" as the transformation name.
- Identify the invariant line before calculating $k$.
- Remember: area is preserved under shear.
- Show the matrix multiplication method for coordinate mapping.
- Check your answer by verifying points on the invariant line remain fixed.`,
    },
  ],
  key_points: [
    'Shear slides points parallel to an invariant line.',
    'Shear factor k = displacement / perpendicular distance from invariant line.',
    'Area is preserved under shear.',
    'Shear is not an isometry: angles and lengths change.',
    'Points on the invariant line are fixed.',
    'Full description needs: transformation name, invariant line, and shear factor.',
  ],
  exam_tips: [
    'Always identify the invariant line first before any calculations.',
    'Use matrix multiplication for systematic coordinate mapping.',
    'Remember shear preserves area — use this as a check.',
    'Show full working when finding shear factor from object-image pairs.',
  ],
  visual_descriptions: [
    'Rectangle transformed into parallelogram by horizontal shear',
    'Invariant line with proportional displacement arrows',
    'Before-and-after polygon comparison showing area preservation',
  ],
};

const stretchTransformationMasterNotes: MathTopicNotes = {
  topic: 'Stretch (Transformation)',
  subject: 'Mathematics',
  grade_level: 'O-Level Form 4',
  summary:
    'Comprehensive Form 4 stretch transformation notes covering one-way stretch definition, invariant lines, stretch factor, coordinate mapping, area effects, combined transformations, and exam-style practice.',
  sections: [
    {
      title: '1) Fundamental Principles of Stretch',
      videoUrl: 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Video/Maths/Form%204/Maths__The_Stretch_Transformation.mp4',
      content: String.raw`A one-way stretch is a transformation that scales distances from an invariant line by a constant factor.

Key properties:
- The invariant line remains fixed.
- Points move perpendicularly away from (or toward) the invariant line.
- Distances from the invariant line are multiplied by the stretch factor.
- A stretch changes both shape and area.
- Stretch is NOT an isometry.

## Stretch Factor

The stretch factor $k$ is defined as:
$$k = \frac{\text{image distance from invariant line}}{\text{object distance from invariant line}}$$

## Stretch with x-axis as Invariant Line (Factor $k$)

$$\begin{pmatrix}x'\\y'\end{pmatrix} = \begin{pmatrix}1 & 0\\0 & k\end{pmatrix}\begin{pmatrix}x\\y\end{pmatrix}$$

So: $x' = x$, $y' = ky$.

## Stretch with y-axis as Invariant Line (Factor $k$)

$$\begin{pmatrix}x'\\y'\end{pmatrix} = \begin{pmatrix}k & 0\\0 & 1\end{pmatrix}\begin{pmatrix}x\\y\end{pmatrix}$$

So: $x' = kx$, $y' = y$.

## Worked Examples

1. A stretch with x-axis invariant and $k = 3$ maps $A(2, 4)$:
$$x' = 2,\quad y' = 3 \times 4 = 12$$
Image: $A'(2, 12)$.

2. A stretch with y-axis invariant and $k = \frac{1}{2}$ maps $B(6, 3)$:
$$x' = \frac{1}{2} \times 6 = 3,\quad y' = 3$$
Image: $B'(3, 3)$.

3. Triangle with vertices $P(0,0)$, $Q(4,0)$, $R(2,3)$ under stretch (x-axis invariant, $k=2$):
- $P'(0,0)$, $Q'(4,0)$, $R'(2, 6)$.
- Area of image = $k \times$ area of object (stretch scales area by factor $k$).`,
    },
    {
      title: '2) Describing a Stretch and Exam Strategies',
      content: String.raw`## Full Description of a Stretch

A complete description requires:
1. Name the transformation (one-way stretch).
2. State the invariant line.
3. State the stretch factor $k$.

## Finding the Stretch Factor

Given object point $A$ and image $A'$:
$$k = \frac{\text{distance of } A' \text{ from invariant line}}{\text{distance of } A \text{ from invariant line}}$$

## Area Under Stretch

$$\text{Area of image} = k \times \text{Area of object}$$

This is a key distinction from shear, which preserves area.

## Stretch vs Enlargement

| Property | One-Way Stretch | Enlargement |
|----------|----------------|-------------|
| Directions affected | One direction only | All directions |
| Invariant line | Yes | No (has centre) |
| Shape preserved | No | Yes (similar) |
| Area factor | $k$ | $k^2$ |

## Exam Tips

- Always name it "one-way stretch" (not just "stretch").
- State both the invariant line and the stretch factor.
- Remember area scales by $k$ (not $k^2$ like enlargement).
- Use matrix method for coordinate mapping.
- Verify by checking that points on the invariant line remain fixed.`,
    },
  ],
  key_points: [
    'A one-way stretch scales distances from an invariant line by factor k.',
    'Points on the invariant line are fixed.',
    'Stretch changes both shape and area.',
    'Area of image = k times area of object.',
    'Stretch is different from enlargement (one direction vs all directions).',
    'Full description needs: transformation name, invariant line, and stretch factor.',
  ],
  exam_tips: [
    'Always call it "one-way stretch" in full descriptions.',
    'Identify the invariant line before calculating the stretch factor.',
    'Remember area scales by k, not k-squared.',
    'Show matrix multiplication for coordinate mapping.',
  ],
  visual_descriptions: [
    'Square stretched into rectangle by vertical stretch',
    'Invariant line with perpendicular scaling arrows',
    'Before-and-after comparison showing area change under stretch',
  ],
};

const generatedForm4Notes: Record<string, MathTopicNotes> = Object.fromEntries(
  form4Outlines.map((outline) => [outline.topic, buildForm4Note(outline)])
);

export const form4MathNotes: Record<string, MathTopicNotes> = {
  ...generatedForm4Notes,
  'Approximation and Accuracy': approximationAndAccuracyMasterNotes,
  'Measures and Mensuration': measuresAndMensurationMasterNotes,
  'Graphs (Advanced Graphs)': functionalGraphsMasterNotes,
  'Financial Mathematics': consumerArithmeticMasterNotes,
  'Travel Graphs': travelGraphsMasterNotes,
  Variation: variationMasterNotes,
  'Rotation (Transformation)': rotationTransformationMasterNotes,
  'Enlargement (Transformation)': enlargementTransformationMasterNotes,
  'Reflection (Transformation)': reflectionTransformationMasterNotes,
  'Translation (Transformation)': translationTransformationMasterNotes,
  'Shear (Transformation)': shearTransformationMasterNotes,
  'Stretch (Transformation)': stretchTransformationMasterNotes,
  Probability: combinedEventsProbabilityMasterNotes,
  'Combined Events in Probability': combinedEventsProbabilityMasterNotes,
  Vectors: planeVectorsMasterNotes,
  'Operations on Plane Shapes Using Vectors': planeVectorsMasterNotes,
  Trigonometry: trigonometricRatiosMasterNotes,
  'Trigonometric Ratios': trigonometricRatiosMasterNotes,
  'Measures of Dispersion': measuresOfDispersionMasterNotes,
  Statistics: measuresOfDispersionMasterNotes,
  'Measures of Central Tendency': measuresOfCentralTendencyMasterNotes,
  'Central Tendency': measuresOfCentralTendencyMasterNotes,
  'Data Representation (Grouped Data)': groupedDataRepresentationMasterNotes,
  'Grouped Data Representation': groupedDataRepresentationMasterNotes,
  'Polygons and Circles': geometryOfPolygonsMasterNotes,
  'Geometry of Polygons': geometryOfPolygonsMasterNotes,
  'Constructions and Loci': geometricalConstructionsLociMasterNotes,
  'Geometrical Constructions and Loci': geometricalConstructionsLociMasterNotes,
  Inequalities: inequalitiesMasterNotes,
  'Study Notes on Inequalities': inequalitiesMasterNotes,
  // Map Form 4 syllabus topic keys to the newly added comprehensive notes
  'Algebraic Expressions': algebraicManipulationMasterNotes,
  'Quadratic Equations': equationsMasterNotes,
  'Simultaneous Equations': equationsMasterNotes,
  'Change of Subject of Formulae': equationsMasterNotes,
  Indices: algebraicManipulationMasterNotes,
  'Geometry: Angles and Bearings': trigonometricRatiosMasterNotes,
  'Algebraic Manipulation': algebraicManipulationMasterNotes,
  'Comprehensive Form 4 Mathematics: Algebraic Manipulation':
    algebraicManipulationMasterNotes,
  Equations: equationsMasterNotes,
  'Comprehensive Study Notes on Equations': equationsMasterNotes,
};
