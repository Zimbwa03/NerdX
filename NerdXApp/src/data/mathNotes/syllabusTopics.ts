import { MathTopicNotes } from './types';

/**
 * ZIMSEC O-Level Mathematics: Broad syllabus topics
 * These topics align with the Mathematics topic list used around the app (e.g. TopicsScreen).
 *
 * Notes are written in Markdown and KaTeX-friendly (escape KaTeX backslashes as \\).
 */
export const syllabusTopicNotes: Record<string, MathTopicNotes> = {
  'Number Theory': {
    topic: 'Number Theory',
    subject: 'Mathematics',
    grade_level: 'O-Level',
    summary:
      'Number Theory at ZIMSEC O-Level focuses on properties of integers: factors and multiples, prime factorisation, HCF/LCM, divisibility tests, number properties (even/odd), and solving practical problems using these ideas.',
    sections: [
      {
        title: '1) Factors, Multiples, Primes and Prime Factorisation',
        content: `**Factor**: a whole number that divides another whole number exactly (no remainder).

**Multiple**: a number obtained by multiplying a given number by an integer.

**Prime number**: an integer greater than 1 that has exactly two factors: 1 and itself.  
**Composite number**: an integer greater than 1 that has more than two factors.

**Prime factorisation**: writing a number as a product of primes. Use a factor tree or repeated division by primes.

Example:
$$360 = 2^3 \\times 3^2 \\times 5$$

Why prime factorisation matters:
- It makes **HCF** and **LCM** fast and reliable
- It helps simplify **fractions**
- It helps solve “smallest/largest number” problems`,
        worked_examples: [
          {
            question: 'Write $420$ as a product of prime factors.',
            steps: [
              'Divide by small primes: $420 \\div 2 = 210$, $210 \\div 2 = 105$.',
              '$105 \\div 3 = 35$.',
              '$35 \\div 5 = 7$.',
              '$7$ is prime.',
              'So $420 = 2^2 \\times 3 \\times 5 \\times 7$.',
            ],
            final_answer: '$420 = 2^2 \\times 3 \\times 5 \\times 7$',
          },
          {
            question: 'How many factors does $72$ have?',
            steps: [
              'Prime factorise: $72 = 2^3 \\times 3^2$.',
              'If $n = p^a q^b$, number of factors is $(a+1)(b+1)$.',
              'So number of factors = $(3+1)(2+1) = 4 \\times 3 = 12$.',
            ],
            final_answer: '72 has $12$ factors.',
          },
          {
            question: 'Find the smallest number that is divisible by 8, 12 and 15.',
            steps: [
              'This is an LCM problem.',
              'Prime factors: $8 = 2^3$, $12 = 2^2 \\times 3$, $15 = 3 \\times 5$.',
              'LCM uses the **highest powers** of each prime: $2^3, 3^1, 5^1$.',
              'LCM $= 2^3 \\times 3 \\times 5 = 8 \\times 3 \\times 5 = 120$.',
            ],
            final_answer: '$120$',
          },
        ],
      },
      {
        title: '2) HCF and LCM (using prime factorisation)',
        content: `**HCF** (Highest Common Factor): largest number that divides each number exactly.  
Using prime factors, HCF uses **common primes with the lowest powers**.

**LCM** (Lowest Common Multiple): smallest number divisible by each number.  
Using prime factors, LCM uses **all primes with the highest powers**.

Key identity (for two positive integers $a,b$):
$$\\mathrm{HCF}(a,b) \\times \\mathrm{LCM}(a,b) = a \\times b$$

Use cases:
- **HCF**: sharing/dividing into equal groups, simplifying ratios/fractions
- **LCM**: events repeating together, common denominators`,
        worked_examples: [
          {
            question: 'Find the HCF and LCM of 84 and 120.',
            steps: [
              'Prime factors: $84 = 2^2 \\times 3 \\times 7$, $120 = 2^3 \\times 3 \\times 5$.',
              'HCF: common primes are $2$ and $3$ with lowest powers: $2^2 \\times 3 = 12$.',
              'LCM: take highest powers: $2^3 \\times 3 \\times 5 \\times 7 = 840$.',
            ],
            final_answer: 'HCF $= 12$, LCM $= 840$',
          },
        ],
      },
      {
        title: '3) Divisibility Tests and Number Properties',
        content: `Common divisibility tests used in exams:

- **2**: last digit even (0,2,4,6,8)
- **3**: sum of digits divisible by 3
- **4**: last two digits divisible by 4
- **5**: last digit 0 or 5
- **6**: divisible by 2 and 3
- **8**: last three digits divisible by 8
- **9**: sum of digits divisible by 9
- **10**: last digit 0
- **11**: (sum of alternating digits) difference divisible by 11

Odd/even rules:
- even ± even = even, odd ± odd = even, even ± odd = odd
- even × anything = even; odd × odd = odd

These help in:
- quick checks
- finding unknown digits
- proving statements about numbers`,
        worked_examples: [
          {
            question: 'Show that $2376$ is divisible by 3, 4 and 8.',
            steps: [
              'Divisible by 3: sum of digits $2+3+7+6 = 18$ which is divisible by 3.',
              'Divisible by 4: last two digits are 76; $76 \\div 4 = 19$ (exact).',
              'Divisible by 8: last three digits are 376; $376 \\div 8 = 47$ (exact).',
            ],
            final_answer: '$2376$ is divisible by 3, 4 and 8.',
          },
          {
            question: 'Find the value of digit $k$ so that $43k2$ is divisible by 9.',
            steps: [
              'Divisible by 9 means digit sum is divisible by 9.',
              'Sum is $4+3+k+2 = 9 + k$.',
              '$9+k$ divisible by 9 implies $k$ is 0 or 9. But $k$ is a digit, so $k=0$ or $k=9$.',
            ],
            final_answer: '$k = 0$ or $k = 9$',
          },
        ],
      },
      {
        title: '4) Typical Exam Problem Types',
        content: `Common ZIMSEC question patterns include:
- “Find the smallest/largest number …”
- “A number leaves remainders …”
- “Simplify a fraction using HCF”
- “How many … can be made with no remainder?”

Strategy:
1. Identify whether it is a **factor/HCF** idea or a **multiple/LCM** idea.
2. Prime-factorise early.
3. State the method and show working clearly.`,
        worked_examples: [
          {
            question: 'A number is divisible by 6 and 8. The number is between 50 and 80. List all possible numbers.',
            steps: [
              'Numbers divisible by both are multiples of LCM(6,8).',
              '$6 = 2 \\times 3$, $8 = 2^3$, so LCM $= 2^3 \\times 3 = 24$.',
              'Multiples of 24 between 50 and 80: 48 (too small), 72 (fits), 96 (too large).',
            ],
            final_answer: 'The number is $72$.',
          },
        ],
      },
    ],
    key_points: [
      'Prime factorisation is the foundation for HCF, LCM and simplifying fractions.',
      'HCF uses common primes with lowest powers; LCM uses all primes with highest powers.',
      'Use divisibility tests to quickly check or determine unknown digits.',
      'For “together again”/repeating events, think LCM; for equal grouping/sharing, think HCF.',
    ],
    exam_tips: [
      'Always show prime factorisation when asked for HCF/LCM—this earns method marks.',
      'In “smallest number” questions, confirm your final answer is divisible by all given numbers.',
      'Use digit-sum tests for 3 and 9, and last-two/three-digit tests for 4 and 8.',
    ],
    visual_descriptions: [
      'A factor tree for 420 ending in primes 2, 2, 3, 5, 7.',
      'Venn-style prime factor diagram comparing 84 and 120 to show HCF/LCM.',
    ],
  },

  'Indices & Standard Form': {
    topic: 'Indices & Standard Form',
    subject: 'Mathematics',
    grade_level: 'O-Level',
    summary:
      'This topic combines the laws of indices (exponents) with scientific notation (standard form). You must simplify expressions, solve index equations, and perform calculations in standard form accurately.',
    sections: [
      {
        title: '1) Laws of Indices (Exponents)',
        content: `For non-zero base $a$ and integers $m,n$:

$$a^m \\times a^n = a^{m+n}$$
$$\\frac{a^m}{a^n} = a^{m-n}$$
$$(a^m)^n = a^{mn}$$
$$(ab)^n = a^n b^n$$
$$\\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}$$
$$a^0 = 1$$
$$a^{-n} = \\frac{1}{a^n}$$
$$a^{\\frac{m}{n}} = \\sqrt[n]{a^m}$$

Important:
- Indices rules only apply neatly when the **base is the same**
- Keep answers with **positive indices** unless told otherwise`,
        worked_examples: [
          {
            question: 'Simplify: $\\frac{2x^5y^{-2}}{4x^{-1}y^3}$.',
            steps: [
              'Coefficients: $\\frac{2}{4} = \\frac{1}{2}$.',
              '$x$ exponents: $x^{5 - (-1)} = x^6$.',
              '$y$ exponents: $y^{-2-3} = y^{-5} = \\frac{1}{y^5}$.',
              'Combine: $\\frac{1}{2}x^6 \\times \\frac{1}{y^5} = \\frac{x^6}{2y^5}$.',
            ],
            final_answer: '$\\frac{x^6}{2y^5}$',
          },
          {
            question: 'Evaluate: $81^{\\frac{3}{4}}$.',
            steps: [
              'Write $81^{\\frac{3}{4}} = \\left(81^{\\frac{1}{4}}\\right)^3$.',
              'Fourth root of 81 is 3 because $3^4 = 81$.',
              'So the value is $3^3 = 27$.',
            ],
            final_answer: '$27$',
          },
          {
            question: 'Solve: $3^{2x-1} = 27$.',
            steps: [
              'Write 27 as a power of 3: $27 = 3^3$.',
              'So $3^{2x-1} = 3^3$.',
              'Equate exponents: $2x - 1 = 3$.',
              '$2x = 4 \\Rightarrow x = 2$.',
            ],
            final_answer: '$x = 2$',
          },
        ],
      },
      {
        title: '2) Standard Form (Scientific Notation)',
        content: `A number in standard form is:
$$A \\times 10^n$$
where $1 \\le A < 10$ and $n$ is an integer.

Examples:
$$560000 = 5.6 \\times 10^5$$
$$0.00092 = 9.2 \\times 10^{-4}$$

Operations:
- Multiplication: $(a\\times 10^m)(b\\times 10^n) = (ab)\\times 10^{m+n}$
- Division: $\\frac{a\\times 10^m}{b\\times 10^n} = \\left(\\frac{a}{b}\\right)\\times 10^{m-n}$
- Addition/subtraction: convert to the **same** power of 10 first`,
        worked_examples: [
          {
            question: 'Compute: $(3.2 \\times 10^6)(5 \\times 10^{-3})$ in standard form.',
            steps: [
              'Multiply coefficients: $3.2 \\times 5 = 16$.',
              'Add powers: $10^{6+(-3)} = 10^3$.',
              'So result is $16 \\times 10^3$. Convert to standard form: $16 \\times 10^3 = 1.6 \\times 10^4$.',
            ],
            final_answer: '$1.6 \\times 10^4$',
          },
          {
            question: 'Compute: $\\frac{9 \\times 10^7}{3 \\times 10^4}$ in standard form.',
            steps: [
              'Divide coefficients: $\\frac{9}{3} = 3$.',
              'Subtract powers: $10^{7-4} = 10^3$.',
              'Already in standard form.',
            ],
            final_answer: '$3 \\times 10^3$',
          },
          {
            question: 'Compute: $(4.5 \\times 10^5) + (7.2 \\times 10^4)$ in standard form.',
            steps: [
              'Rewrite $7.2 \\times 10^4$ as $0.72 \\times 10^5$.',
              'Add coefficients: $4.5 + 0.72 = 5.22$.',
              'Keep the common power $10^5$.',
            ],
            final_answer: '$5.22 \\times 10^5$',
          },
        ],
      },
      {
        title: '3) Common Exam Skills',
        content: `You should be able to:
- simplify expressions with indices and surds
- remove negative indices
- solve index equations by expressing both sides with the same base
- work with very large/small numbers using standard form

Always check:
- domain restrictions (e.g., dividing by $x$ means $x \\neq 0$)
- final answer is in standard form ($1 \\le A < 10$).`,
        worked_examples: [
          {
            question: 'Simplify: $\\frac{10^{-2}}{2 \\times 10^{-5}}$ and write in standard form.',
            steps: [
              '$\\frac{10^{-2}}{2 \\times 10^{-5}} = \\frac{1}{2} \\times 10^{-2-(-5)} = \\frac{1}{2} \\times 10^3$.',
              '$\\frac{1}{2} \\times 10^3 = 0.5 \\times 10^3 = 5 \\times 10^2$.',
            ],
            final_answer: '$5 \\times 10^2$',
          },
        ],
      },
    ],
    key_points: [
      'Indices laws require the same base; combine exponents by add/subtract.',
      'Negative index means reciprocal: $a^{-n} = \\frac{1}{a^n}$.',
      'Standard form: $A\\times 10^n$ with $1 \\le A < 10$.',
      'For adding standard form numbers, match the powers of 10 first.',
    ],
    exam_tips: [
      'Convert numbers like 16 or 27 to powers (e.g., $16=2^4$, $27=3^3$) to solve index equations.',
      'After multiplication/division in standard form, always “renormalise” to keep $1 \\le A < 10$.',
      'Show the law of indices you used—method marks are common.',
    ],
    visual_descriptions: [
      'A place-value diagram showing decimal shifts for converting to and from standard form.',
      'A flowchart: simplify coefficients → combine powers → convert to standard form.',
    ],
  },

  'Graphs': {
    topic: 'Graphs',
    subject: 'Mathematics',
    grade_level: 'O-Level',
    summary:
      'Graphs connect algebra to geometry: you plot points, interpret gradients and intercepts, and sketch common functions. ZIMSEC focuses on straight-line graphs, quadratic graphs, reading/interpreting graphs, and coordinate geometry of lines.',
    sections: [
      {
        title: '1) Coordinate Geometry of Straight Lines',
        content: `Key ideas:

**Gradient (slope)** between two points $A(x_1,y_1)$ and $B(x_2,y_2)$:
$$m = \\frac{y_2-y_1}{x_2-x_1}$$

**Equation of a straight line**:
- slope-intercept form: $$y = mx + c$$ where $c$ is the y-intercept
- point-slope form: $$y - y_1 = m(x - x_1)$$

Parallel and perpendicular:
- parallel lines have equal gradients
- perpendicular lines satisfy $$m_1 m_2 = -1$$ (non-vertical, non-horizontal)

Intercepts:
- y-intercept: set $x=0$
- x-intercept: set $y=0$`,
        worked_examples: [
          {
            question: 'Find the gradient of the line joining $A(-2, 5)$ and $B(4, -1)$.',
            steps: [
              '$m = \\frac{-1-5}{4-(-2)} = \\frac{-6}{6} = -1$.',
            ],
            final_answer: '$m = -1$',
          },
          {
            question: 'Find the equation of the line with gradient 3 passing through $(2,-1)$.',
            steps: [
              'Use point-slope: $y - (-1) = 3(x - 2)$.',
              '$y + 1 = 3x - 6$.',
              '$y = 3x - 7$.',
            ],
            final_answer: '$y = 3x - 7$',
          },
          {
            question: 'A line has equation $2y - 4x = 10$. Find its gradient and intercepts.',
            steps: [
              'Rearrange to $y=mx+c$: $2y = 4x + 10 \\Rightarrow y = 2x + 5$.',
              'Gradient $m=2$, y-intercept is 5.',
              'x-intercept: set $y=0$: $0 = 2x + 5 \\Rightarrow x = -\\frac{5}{2}$.',
            ],
            final_answer: 'Gradient $2$, y-intercept $(0,5)$, x-intercept $\\left(-\\frac{5}{2},0\\right)$.',
          },
        ],
      },
      {
        title: '2) Plotting and Interpreting Straight-Line Graphs',
        content: `To draw $y = mx + c$:
1. Choose a sensible table of x-values (e.g. -2, -1, 0, 1, 2)
2. Compute y-values
3. Plot points accurately and draw a straight line

Interpretation:
- gradient tells rate of change
- intercepts tell starting values

Common errors:
- misreading scales
- using too few points
- joining points with a curve instead of a straight line`,
        worked_examples: [
          {
            question: 'Draw the graph of $y = -2x + 3$ for $-1 \\le x \\le 3$ and read off the x-intercept.',
            steps: [
              'Find x-intercept by setting $y=0$: $0 = -2x + 3 \\Rightarrow x = \\frac{3}{2} = 1.5$.',
              'On the graph, the line crosses the x-axis at $x=1.5$.',
            ],
            final_answer: 'x-intercept is $x = 1.5$ (point $(1.5,0)$).',
          },
        ],
      },
      {
        title: '3) Quadratic Graphs and Features',
        content: `Quadratic function:
$$y = ax^2 + bx + c$$

Key features:
- opens upward if $a>0$, downward if $a<0$
- y-intercept is $(0,c)$
- x-intercepts are solutions to $ax^2 + bx + c = 0$
- axis of symmetry:
$$x = -\\frac{b}{2a}$$

Turning point (vertex) can be found by substitution or completing the square.`,
        worked_examples: [
          {
            question: 'For $y = x^2 - 4x - 5$, find the x-intercepts and the turning point.',
            steps: [
              'x-intercepts: solve $x^2 - 4x - 5 = 0$. Factor: $(x-5)(x+1)=0$.',
              'So $x=5$ and $x=-1$ → intercepts $(5,0)$ and $(-1,0)$.',
              'Axis of symmetry: $x = -\\frac{b}{2a} = -\\frac{-4}{2(1)} = 2$.',
              'Turning point y-value: $y(2)=2^2 - 4(2) - 5 = 4 - 8 - 5 = -9$.',
            ],
            final_answer: 'x-intercepts $(-1,0)$ and $(5,0)$; turning point $(2,-9)$.',
          },
        ],
      },
      {
        title: '4) Real-life/Practical Graph Reading',
        content: `In exam questions, graphs often represent relationships like distance–time or cost–quantity.

Typical skills:
- read values accurately
- find gradients (rate)
- interpret intercepts
- compare two graphs

Distance–time:
- gradient = speed
- horizontal = stationary

Speed–time:
- area under graph = distance traveled`,
        worked_examples: [
          {
            question: 'A distance–time graph is a straight line from (0,0) to (5, 20). Find the speed.',
            steps: [
              'Speed = gradient = $\\frac{20-0}{5-0} = 4$ units per time.',
            ],
            final_answer: 'Speed = $4$ units/time.',
          },
        ],
      },
    ],
    key_points: [
      'Gradient $m = \\frac{\\Delta y}{\\Delta x}$ and line equation $y = mx + c$.',
      'Parallel lines: same gradient; perpendicular: gradients multiply to -1.',
      'Quadratic axis: $x = -\\frac{b}{2a}$; intercepts found by setting $x=0$ or $y=0$.',
      'Graph interpretation depends on context (rate, intercept, area).',
    ],
    exam_tips: [
      'Always use a ruler and plot at least 3 points for straight lines and 5 for curves.',
      'Write the scale clearly and check you are reading the correct axis.',
      'When asked for gradient, show the two points used and the calculation.',
    ],
    visual_descriptions: [
      'A straight-line graph showing gradient triangle and intercept c.',
      'A parabola with axis of symmetry and turning point labeled.',
    ],
  },

  'Variation': {
    topic: 'Variation',
    subject: 'Mathematics',
    grade_level: 'O-Level',
    summary:
      'Variation describes relationships between variables using proportionality. You must model direct, inverse, joint and power variation, find constants of proportionality, and solve for unknowns.',
    sections: [
      {
        title: '1) Direct Variation',
        content: `If $y$ varies directly as $x$:
$$y \\propto x \\quad\\Rightarrow\\quad y = kx$$
where $k$ is the constant of proportionality.

Graph: a straight line through the origin (if no constant term).

To solve:
1. Use one pair of values to find $k$
2. Substitute to find the unknown`,
        worked_examples: [
          {
            question: '$y$ varies directly as $x$. If $y=18$ when $x=6$, find (a) $k$ (b) $y$ when $x=10$.',
            steps: [
              '$y = kx$ so $18 = k(6)$.',
              '$k = 3$.',
              'When $x=10$: $y = 3(10) = 30$.',
            ],
            final_answer: '$k=3$, $y=30$',
          },
        ],
      },
      {
        title: '2) Inverse Variation',
        content: `If $y$ varies inversely as $x$:
$$y \\propto \\frac{1}{x} \\quad\\Rightarrow\\quad y = \\frac{k}{x}$$
or equivalently $$xy = k.$$

Graph: a decreasing curve (hyperbola) in the first quadrant if variables are positive.`,
        worked_examples: [
          {
            question: '$y$ varies inversely as $x$. If $y=5$ when $x=12$, find $y$ when $x=20$.',
            steps: [
              'Use $xy=k$: $12 \\times 5 = 60$ so $k=60$.',
              'When $x=20$: $y = \\frac{60}{20} = 3$.',
            ],
            final_answer: '$y = 3$',
          },
        ],
      },
      {
        title: '3) Joint and Power Variation',
        content: `**Joint variation**: $y$ varies directly as the product of two or more variables.
Example: $y \\propto xz \\Rightarrow y = kxz$.

**Power variation**: $y$ varies as a power of $x$.
Example: $y \\propto x^n \\Rightarrow y = kx^n$.

Often combined:
$$y \\propto \\frac{x^2}{z} \\Rightarrow y = k\\frac{x^2}{z}$$`,
        worked_examples: [
          {
            question: '$y$ varies directly as the square of $x$ and inversely as $z$. If $y=12$ when $x=3$ and $z=2$, find $y$ when $x=5$ and $z=4$.',
            steps: [
              'Model: $y = k\\frac{x^2}{z}$.',
              'Substitute: $12 = k\\frac{3^2}{2} = k\\frac{9}{2}$.',
              '$k = 12 \\times \\frac{2}{9} = \\frac{8}{3}$.',
              'Now $y = \\frac{8}{3}\\frac{5^2}{4} = \\frac{8}{3}\\frac{25}{4} = \\frac{200}{12} = \\frac{50}{3}$.',
            ],
            final_answer: '$y = \\frac{50}{3}$',
          },
          {
            question: '$y$ varies as $x^3$. If $y=54$ when $x=3$, find $x$ when $y=250$.',
            steps: [
              '$y = kx^3$. So $54 = k(27)$, hence $k=2$.',
              'Now $250 = 2x^3 \\Rightarrow x^3 = 125 \\Rightarrow x = 5$.',
            ],
            final_answer: '$x = 5$',
          },
        ],
      },
      {
        title: '4) Recognising Variation from Data',
        content: `Given a table, you can check:
- direct: $\\frac{y}{x}$ is constant
- inverse: $xy$ is constant
- square: $\\frac{y}{x^2}$ constant
- cube: $\\frac{y}{x^3}$ constant

This is a common ZIMSEC style: “Determine the relationship between x and y”.`,
        worked_examples: [
          {
            question: 'A table gives $(x,y)$: (2, 12), (3, 27), (4, 48). Determine how $y$ varies with $x$.',
            steps: [
              'Check $\\frac{y}{x^2}$: $\\frac{12}{4}=3$, $\\frac{27}{9}=3$, $\\frac{48}{16}=3$.',
              'Constant ratio means $y \\propto x^2$.',
              'So $y = 3x^2$.',
            ],
            final_answer: '$y$ varies as $x^2$; $y=3x^2$.',
          },
        ],
      },
    ],
    key_points: [
      'Direct: $y=kx$; inverse: $y=\\frac{k}{x}$ (or $xy=k$).',
      'Joint: $y=kxz$; power: $y=kx^n$; combinations are common.',
      'Use data checks like $y/x$, $xy$, $y/x^2$ to identify the type.',
    ],
    exam_tips: [
      'Always write the proportionality statement first (e.g., $y \\propto x^2$) before introducing k.',
      'Keep algebra exact (fractions) until the final step if possible.',
      'When solving for k, substitute the given values carefully and simplify.',
    ],
    visual_descriptions: [
      'Direct variation graph: straight line through origin.',
      'Inverse variation graph: smooth decreasing curve approaching axes.',
    ],
  },

  'Sequences & Series': {
    topic: 'Sequences & Series',
    subject: 'Mathematics',
    grade_level: 'O-Level',
    summary:
      'A sequence is an ordered list of numbers. A series is the sum of terms of a sequence. ZIMSEC commonly tests arithmetic sequences/series and geometric sequences/series, including nth term and sums.',
    sections: [
      {
        title: '1) Arithmetic Sequences (AP)',
        content: `Arithmetic sequence: constant difference $d$ between consecutive terms.

First term: $a$  
$n$th term:
$$u_n = a + (n-1)d$$

Arithmetic series (sum of first $n$ terms):
$$S_n = \\frac{n}{2}\\left(2a + (n-1)d\\right)$$
or
$$S_n = \\frac{n}{2}(a + l)$$
where $l$ is the last term.`,
        worked_examples: [
          {
            question: 'Find the 20th term of the sequence $7, 11, 15, 19, \\dots$',
            steps: [
              'This is an AP with $a=7$ and $d=4$.',
              '$u_{20} = 7 + (20-1)4 = 7 + 76 = 83$.',
            ],
            final_answer: '$83$',
          },
          {
            question: 'Find the sum of the first 30 terms of $5, 9, 13, \\dots$',
            steps: [
              '$a=5$, $d=4$, $n=30$.',
              '$S_{30} = \\frac{30}{2}\\left(2(5) + (30-1)4\\right)$.',
              '$= 15\\left(10 + 116\\right) = 15 \\times 126 = 1890$.',
            ],
            final_answer: '$1890$',
          },
        ],
      },
      {
        title: '2) Geometric Sequences (GP)',
        content: `Geometric sequence: constant ratio $r$ between consecutive terms.

$n$th term:
$$u_n = ar^{n-1}$$

Sum of first $n$ terms (for $r \\neq 1$):
$$S_n = a\\frac{1-r^n}{1-r}$$

Sum to infinity (when $|r|<1$):
$$S_{\\infty} = \\frac{a}{1-r}$$`,
        worked_examples: [
          {
            question: 'For the sequence $3, 6, 12, 24, \\dots$, find (a) $r$ (b) the 8th term.',
            steps: [
              'Ratio $r = \\frac{6}{3} = 2$.',
              '$u_8 = 3 \\times 2^{7} = 3 \\times 128 = 384$.',
            ],
            final_answer: '$r=2$, $u_8=384$',
          },
          {
            question: 'Find the sum of the first 6 terms of $2, 6, 18, \\dots$',
            steps: [
              'This is a GP with $a=2$, $r=3$, $n=6$.',
              '$S_6 = 2\\frac{1-3^6}{1-3} = 2\\frac{1-729}{-2} = 2\\times 364 = 728$.',
            ],
            final_answer: '$728$',
          },
          {
            question: 'A GP has first term 10 and common ratio 0.8. Find the sum to infinity.',
            steps: [
              'Since $|r|<1$, sum to infinity exists.',
              '$S_{\\infty} = \\frac{a}{1-r} = \\frac{10}{1-0.8} = \\frac{10}{0.2} = 50$.',
            ],
            final_answer: '$50$',
          },
        ],
      },
      {
        title: '3) Solving Sequence Problems',
        content: `Typical skills:
- determine whether AP or GP
- find $a$, $d$ or $r$
- find $u_n$ or $S_n$
- form equations from conditions

Always define your variables clearly and state the formula used.`,
        worked_examples: [
          {
            question: 'In an AP, the 5th term is 18 and the 12th term is 46. Find the first term and common difference.',
            steps: [
              'Use $u_n = a + (n-1)d$.',
              '5th term: $a+4d=18$.',
              '12th term: $a+11d=46$.',
              'Subtract: $(a+11d) - (a+4d) = 46-18 \\Rightarrow 7d=28 \\Rightarrow d=4$.',
              'Then $a+4(4)=18 \\Rightarrow a=2$.',
            ],
            final_answer: '$a=2$, $d=4$',
          },
        ],
      },
    ],
    key_points: [
      'AP: constant difference $d$; $u_n=a+(n-1)d$; $S_n=\\frac{n}{2}(2a+(n-1)d)$.',
      'GP: constant ratio $r$; $u_n=ar^{n-1}$; $S_n=a\\frac{1-r^n}{1-r}$.',
      'Sum to infinity exists only if $|r|<1$.',
    ],
    exam_tips: [
      'Always state whether the sequence is AP or GP and show how you know (difference/ratio).',
      'Be careful with signs in the GP sum formula; use the exact formula rather than memorising shortcuts.',
      'For “find n” questions, you may need index laws or logarithms if the unknown is in an exponent.',
    ],
    visual_descriptions: [
      'A table showing terms of an AP and constant differences underneath.',
      'A table showing terms of a GP and constant ratios between terms.',
    ],
  },

  'Loci & Construction': {
    topic: 'Loci & Construction',
    subject: 'Mathematics',
    grade_level: 'O-Level',
    summary:
      'Loci and constructions involve geometric drawing with ruler and compass. You must construct accurate bisectors and triangles, and describe loci such as points equidistant from given points or lines.',
    sections: [
      {
        title: '1) Core Constructions (ruler and compass)',
        content: `Common ZIMSEC constructions:
- perpendicular bisector of a line segment
- angle bisector
- perpendicular from a point to a line
- constructing triangles from given measurements (SSS, SAS, ASA)
- constructing parallel lines

Accuracy matters:
- use sharp pencil
- arcs should be visible (do not rub out construction lines unless instructed)
- measure carefully with a ruler/protractor when allowed`,
        worked_examples: [
          {
            question: 'Describe how to construct the perpendicular bisector of segment $AB$.',
            steps: [
              'Open compass to a radius more than half of $AB$.',
              'With centre at $A$, draw arcs above and below the segment.',
              'With the same radius and centre at $B$, draw arcs to intersect the first pair of arcs.',
              'Join the two intersection points with a straight line. This line is the perpendicular bisector and meets $AB$ at its midpoint.',
            ],
            final_answer: 'A line through the arc intersections gives the perpendicular bisector of $AB$.',
          },
        ],
      },
      {
        title: '2) Loci (plural of locus)',
        content: `A **locus** is the set of points that satisfy a condition.

Key loci:
- Points at a fixed distance $r$ from a point $O$ → a circle, centre $O$, radius $r$.
- Points equidistant from two points $A$ and $B$ → perpendicular bisector of $AB$.
- Points equidistant from two intersecting lines → the angle bisectors.
- Points at a fixed distance from a straight line → two lines parallel to the line, one on each side.

In problems, you may need the **intersection of loci** (points satisfying two conditions).`,
        worked_examples: [
          {
            question: 'Describe the locus of points equidistant from points $A$ and $B$.',
            steps: [
              'A point is equidistant from $A$ and $B$ if it lies on the perpendicular bisector of $AB$.',
              'So the locus is the perpendicular bisector of segment $AB$.',
            ],
            final_answer: 'The perpendicular bisector of $AB$.',
          },
          {
            question: 'A point P is 4 cm from point O and 3 cm from point A. Describe how to locate possible positions of P.',
            steps: [
              'Draw a circle centre O radius 4 cm (locus of points 4 cm from O).',
              'Draw a circle centre A radius 3 cm (locus of points 3 cm from A).',
              'The intersection point(s) of the two circles are possible positions of P.',
            ],
            final_answer: 'P is at the intersection(s) of the two circles.',
          },
        ],
      },
      {
        title: '3) Typical Exam Applications',
        content: `You may be asked to:
- draw a scale diagram and find distances/angles
- construct a triangle and then construct bisectors to find a point (e.g. circumcentre, incentre)
- shade a region satisfying constraints (e.g. within 4 cm of O and nearer to A than B)

“Nearer to A than B” means the region on the A-side of the perpendicular bisector of AB.`,
        worked_examples: [
          {
            question: 'Explain what the statement “nearer to A than B” means on a diagram.',
            steps: [
              'Draw the perpendicular bisector of AB.',
              'Points on the A-side are closer to A; points on the B-side are closer to B.',
              'Points on the bisector are equidistant.',
            ],
            final_answer: 'The region nearer A is the side of the perpendicular bisector containing A.',
          },
        ],
      },
    ],
    key_points: [
      'Perpendicular bisector gives points equidistant from A and B.',
      'Angle bisectors give points equidistant from two lines (sides of an angle).',
      'Circle is the locus of points a fixed distance from a point.',
      'Intersection of loci gives points satisfying multiple conditions.',
    ],
    exam_tips: [
      'Do not erase construction arcs unless instructed; they often earn marks.',
      'Label clearly: points, radii, and key lines (bisectors).',
      'When shading regions, use neat, consistent shading and show boundary lines accurately.',
    ],
    visual_descriptions: [
      'Construction arcs from A and B intersecting above and below AB; line through intersections is the perpendicular bisector.',
      'Two circles intersecting at two points showing two possible solutions for a locus intersection.',
    ],
  },

  'Transformation Geometry': {
    topic: 'Transformation Geometry',
    subject: 'Mathematics',
    grade_level: 'O-Level',
    summary:
      'Transformation geometry describes translation, reflection, rotation and enlargement, including identifying transformations from diagrams and finding image coordinates under given transformations.',
    sections: [
      {
        title: '1) Translation (using vectors)',
        content: `Translation moves every point the same amount.

Translation vector:
$$\\begin{pmatrix} a \\\\ b \\end{pmatrix}$$
Mapping:
$$(x,y) \\to (x+a,\\; y+b)$$`,
        worked_examples: [
          {
            question: 'Translate $P(-3, 4)$ by $\\begin{pmatrix} 5 \\\\ -2 \\end{pmatrix}$.',
            steps: ['Add components: $x\\to -3+5=2$, $y\\to 4-2=2$.'],
            final_answer: '$P\'(2,2)$',
          },
        ],
      },
      {
        title: '2) Reflection',
        content: `Reflection flips a shape in a mirror line.

Common reflections:
- in x-axis ($y=0$): $(x,y) \\to (x,-y)$
- in y-axis ($x=0$): $(x,y) \\to (-x,y)$
- in $y=x$: $(x,y) \\to (y,x)$
- in $y=-x$: $(x,y) \\to (-y,-x)$

Key property: the mirror line is the **perpendicular bisector** of each point and its image.`,
        worked_examples: [
          {
            question: 'Reflect $A(6, -1)$ in the y-axis.',
            steps: ['In y-axis: $x$ changes sign, $y$ stays the same.'],
            final_answer: '$A\'(-6, -1)$',
          },
        ],
      },
      {
        title: '3) Rotation (about the origin)',
        content: `Rotation is a turn about a fixed centre.

About the origin:
- $90^{\\circ}$ anticlockwise: $(x,y) \\to (-y, x)$
- $90^{\\circ}$ clockwise: $(x,y) \\to (y, -x)$
- $180^{\\circ}$: $(x,y) \\to (-x, -y)$

Always state:
**rotation**, angle, direction, centre.`,
        worked_examples: [
          {
            question: 'Rotate $B(2, 7)$ by $90^{\\circ}$ anticlockwise about the origin.',
            steps: ['Use rule $(x,y)\\to(-y,x)$: $(2,7)\\to(-7,2)$.'],
            final_answer: '$B\'(-7,2)$',
          },
        ],
      },
      {
        title: '4) Enlargement (scale factor and centre)',
        content: `Enlargement changes size.

About centre $(0,0)$:
$$(x,y) \\to (kx, ky)$$

About a centre $(a,b)$:
$$\\begin{pmatrix} x \\\\ y \\end{pmatrix} \\to \\begin{pmatrix} a \\\\ b \\end{pmatrix} + k\\left(\\begin{pmatrix} x \\\\ y \\end{pmatrix} - \\begin{pmatrix} a \\\\ b \\end{pmatrix}\\right)$$

Interpretation:
- $k>1$ enlarge
- $0<k<1$ reduce
- $k<0$ enlargement with inversion through centre`,
        worked_examples: [
          {
            question: 'Enlarge $P(4, -2)$ by scale factor $\\frac{1}{2}$ about the origin.',
            steps: ['Multiply coordinates by $\\frac{1}{2}$: $(4,-2)\\to(2,-1)$.'],
            final_answer: '$P\'(2,-1)$',
          },
          {
            question: 'Enlarge $Q(5, 1)$ by scale factor 2 about centre $C(1,1)$.',
            steps: [
              'Vector from centre to Q: $\\vec{CQ} = (5-1, 1-1) = (4,0)$.',
              'Scale it by 2: $(8,0)$.',
              'Add to centre: $(1,1) + (8,0) = (9,1)$.',
            ],
            final_answer: '$Q\'(9,1)$',
          },
        ],
      },
      {
        title: '5) Describing a Transformation from a Diagram',
        content: `When describing a transformation, include all defining information:

- Translation: the vector
- Reflection: the mirror line equation
- Rotation: centre, angle, direction
- Enlargement: centre and scale factor

How to identify quickly:
- Translation: shape congruent, orientation same, arrows “shift”
- Reflection: left-right flipped; corresponding points are symmetric about a line
- Rotation: turned around a point; distances from centre preserved
- Enlargement: same shape, different size; lines joining corresponding points pass through centre`,
        worked_examples: [
          {
            question: 'A point $A(2,3)$ maps to $A\'(6,1)$ by a translation. Find the translation vector.',
            steps: [
              'Translation vector is $\\begin{pmatrix} 6-2 \\\\ 1-3 \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ -2 \\end{pmatrix}$.',
            ],
            final_answer: '$\\begin{pmatrix} 4 \\\\ -2 \\end{pmatrix}$',
          },
        ],
      },
    ],
    key_points: [
      'Translations add a vector to coordinates.',
      'Reflections use a mirror line; distances to the line are equal.',
      'Rotations are defined by centre, angle, direction.',
      'Enlargements are defined by centre and scale factor.',
    ],
    exam_tips: [
      'Always state ALL defining features when describing a transformation.',
      'For enlargement about a non-origin centre, use centre-to-point vectors.',
      'Check coordinates carefully; sign errors are very common.',
    ],
    visual_descriptions: [
      'A triangle shifted right and down showing a translation vector arrow.',
      'A shape and its mirror image across the line $y=x$.',
      'Enlargement showing rays from the centre through corresponding points.',
    ],
  },

  'Algebra': {
    topic: 'Algebra',
    subject: 'Mathematics',
    grade_level: 'O-Level',
    summary:
      'Algebra is the language of mathematics. At O-Level it includes simplifying expressions, factorisation, solving linear/quadratic equations and inequalities, rearranging formulas, and using algebra in real-life problems.',
    sections: [
      {
        title: '1) Expressions: Simplify, Expand, Factorise',
        content: `Key skills:
- collect like terms
- expand brackets (including double brackets)
- factorise: common factor, difference of squares, trinomials, grouping

Useful identities:
$$(a+b)^2 = a^2 + 2ab + b^2$$
$$(a-b)^2 = a^2 - 2ab + b^2$$
$$(a+b)(a-b) = a^2 - b^2$$`,
        worked_examples: [
          {
            question: 'Simplify: $4x^2 - 3x + 7 + 2x^2 + 5x - 9$.',
            steps: [
              'Collect like terms: $(4x^2+2x^2) + (-3x+5x) + (7-9)$.',
              '$= 6x^2 + 2x - 2$.',
            ],
            final_answer: '$6x^2 + 2x - 2$',
          },
          {
            question: 'Expand and simplify: $(2x-3)(x+5)$.',
            steps: [
              '$= 2x(x+5) - 3(x+5) = 2x^2 + 10x - 3x - 15$.',
              '$= 2x^2 + 7x - 15$.',
            ],
            final_answer: '$2x^2 + 7x - 15$',
          },
          {
            question: 'Factorise completely: $3x^2 - 12x$.',
            steps: ['Take common factor $3x$: $3x(x-4)$.'],
            final_answer: '$3x(x-4)$',
          },
        ],
      },
      {
        title: '2) Solving Linear Equations and Simultaneous Equations',
        content: `Linear equation: highest power of the variable is 1.

Method:
1. remove brackets
2. collect like terms
3. isolate the variable

Simultaneous equations (two unknowns):
- substitution
- elimination`,
        worked_examples: [
          {
            question: 'Solve: $3(2x-1) = 5x + 7$.',
            steps: [
              'Expand: $6x - 3 = 5x + 7$.',
              '$6x - 5x = 7 + 3$.',
              '$x = 10$.',
            ],
            final_answer: '$x = 10$',
          },
          {
            question: 'Solve simultaneously: $2x + y = 11$ and $x - y = 1$.',
            steps: [
              'Add equations: $(2x+y) + (x-y) = 11 + 1 \\Rightarrow 3x = 12$.',
              '$x = 4$.',
              'Substitute into $x-y=1$: $4 - y = 1 \\Rightarrow y = 3$.',
            ],
            final_answer: '$x = 4$, $y = 3$',
          },
        ],
      },
      {
        title: '3) Inequalities',
        content: `Solve inequalities like equations, but remember:

**If you multiply or divide by a negative number, reverse the inequality sign.**

Example:
$$-2x > 6 \\Rightarrow x < -3$$

Represent solutions on a number line and in set notation when required.`,
        worked_examples: [
          {
            question: 'Solve: $-3x + 4 \\le 16$.',
            steps: [
              'Subtract 4: $-3x \\le 12$.',
              'Divide by -3 and reverse sign: $x \\ge -4$.',
            ],
            final_answer: '$x \\ge -4$',
          },
        ],
      },
      {
        title: '4) Quadratic Equations (core ideas)',
        content: `Quadratic equation:
$$ax^2 + bx + c = 0,\\; a\\ne 0$$

Methods:
- factorisation (when possible)
- completing the square
- quadratic formula:
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

Discriminant $\\Delta=b^2-4ac$ tells the nature of roots:
- $\\Delta>0$ two real roots
- $\\Delta=0$ one repeated real root
- $\\Delta<0$ no real roots`,
        worked_examples: [
          {
            question: 'Solve: $x^2 - 7x + 10 = 0$.',
            steps: [
              'Factorise: find numbers multiply to 10 and add to -7 → -5 and -2.',
              '$(x-5)(x-2)=0$.',
            ],
            final_answer: '$x=5$ or $x=2$',
          },
          {
            question: 'Solve: $2x^2 + x - 3 = 0$.',
            steps: [
              'Factorise: $(2x+3)(x-1)=0$.',
              'So $x=-\\frac{3}{2}$ or $x=1$.',
            ],
            final_answer: '$x=1$ or $x=-\\frac{3}{2}$',
          },
        ],
      },
      {
        title: '5) Rearranging Formulas (changing the subject)',
        content: `You must be able to make a variable the subject:
1. identify where the required variable appears
2. apply inverse operations
3. avoid mistakes with fractions and brackets

Example:
If $V = \\frac{IR}{t}$, then $I = \\frac{Vt}{R}$ (provided $R \\ne 0$).`,
        worked_examples: [
          {
            question: 'Make $x$ the subject: $y = 3x - 5$.',
            steps: [
              'Add 5: $y+5 = 3x$.',
              'Divide by 3: $x = \\frac{y+5}{3}$.',
            ],
            final_answer: '$x = \\frac{y+5}{3}$',
          },
        ],
      },
    ],
    key_points: [
      'Always collect like terms and work systematically.',
      'Factorisation patterns: common factor; difference of squares; trinomials.',
      'Reverse the inequality sign when dividing/multiplying by a negative.',
      'Quadratic formula works for every quadratic.',
    ],
    exam_tips: [
      'For factorisation, look for common factors first before other methods.',
      'In quadratic problems, check solutions by substitution when possible.',
      'Show each algebra step clearly—ZIMSEC marking rewards method.',
    ],
    visual_descriptions: [
      'Area model for expanding $(x+a)(x+b)$.',
      'A number line showing the solution set for an inequality.',
    ],
  },

  'Geometry': {
    topic: 'Geometry',
    subject: 'Mathematics',
    grade_level: 'O-Level',
    summary:
      'Geometry covers properties of angles, triangles, polygons, circles, similarity and congruency, bearings, and coordinate geometry. Success depends on knowing core theorems and applying them in proofs and calculations.',
    sections: [
      {
        title: '1) Angle Facts and Parallel Lines',
        content: `Essential facts:
- angles on a straight line sum to $180^{\\circ}$
- angles around a point sum to $360^{\\circ}$
- vertically opposite angles are equal
- in parallel lines: corresponding angles equal; alternate angles equal; co-interior sum to $180^{\\circ}$`,
        worked_examples: [
          {
            question: 'Two angles on a straight line are $(3x+10)^{\\circ}$ and $(5x-30)^{\\circ}$. Find $x$.',
            steps: [
              'Angles on a straight line sum to 180°.',
              '$(3x+10) + (5x-30) = 180$.',
              '$8x - 20 = 180 \\Rightarrow 8x = 200 \\Rightarrow x=25$.',
            ],
            final_answer: '$x = 25$',
          },
        ],
      },
      {
        title: '2) Triangles: Congruency, Similarity, Pythagoras',
        content: `Congruent triangles have equal corresponding sides and angles.
Common congruency tests:
- SSS, SAS, ASA, RHS (right-angle, hypotenuse, side)

Similar triangles have equal angles and proportional sides.
If triangles are similar with scale factor $k$:
- side lengths scale by $k$
- areas scale by $k^2$

Pythagoras (right triangle):
$$c^2 = a^2 + b^2$$`,
        worked_examples: [
          {
            question: 'A right triangle has legs 9 cm and 12 cm. Find the hypotenuse.',
            steps: [
              '$c^2 = 9^2 + 12^2 = 81 + 144 = 225$.',
              '$c = \\sqrt{225} = 15$.',
            ],
            final_answer: '$15$ cm',
          },
          {
            question: 'Two similar triangles have corresponding sides 6 cm and 9 cm. If the smaller triangle area is 20 cm$^2$, find the larger area.',
            steps: [
              'Scale factor $k = \\frac{9}{6} = \\frac{3}{2}$.',
              'Area scales by $k^2 = \\left(\\frac{3}{2}\\right)^2 = \\frac{9}{4}$.',
              'Larger area = $20 \\times \\frac{9}{4} = 45$ cm$^2$.',
            ],
            final_answer: '$45$ cm$^2$',
          },
        ],
      },
      {
        title: '3) Polygons and Circles (core theorems)',
        content: `Polygons:
- Sum of interior angles of an $n$-gon:
$$S=(n-2)\\times 180^{\\circ}$$
- Exterior angles of any convex polygon sum to $360^{\\circ}$

Circle facts (very common in ZIMSEC):
- angle at centre is twice angle at circumference (same arc)
- angle in a semicircle is $90^{\\circ}$
- angles in the same segment are equal
- opposite angles in a cyclic quadrilateral sum to $180^{\\circ}$
- tangent is perpendicular to radius at the point of contact`,
        worked_examples: [
          {
            question: 'Find each interior angle of a regular 12-sided polygon.',
            steps: [
              'Sum of interior angles: $(12-2)\\times 180 = 10\\times 180 = 1800^{\\circ}$.',
              'Each angle = $\\frac{1800}{12} = 150^{\\circ}$.',
            ],
            final_answer: '$150^{\\circ}$',
          },
          {
            question: 'In a cyclic quadrilateral, one angle is $78^{\\circ}$. Find the opposite angle.',
            steps: ['Opposite angles sum to 180°: $180 - 78 = 102^{\\circ}$.'],
            final_answer: '$102^{\\circ}$',
          },
        ],
      },
      {
        title: '4) Bearings and Scale Drawings',
        content: `Bearings are measured:
- clockwise from North
- as a three-digit angle (e.g. $045^{\\circ}$)

In problems:
- draw a North line at each location
- use protractor for the bearing angle
- use scale and Pythagoras/trigonometry to find distances`,
        worked_examples: [
          {
            question: 'A ship travels 12 km on a bearing of $060^{\\circ}$. Resolve into east and north components.',
            steps: [
              'Bearing 060° is 60° east of North.',
              'North component = $12\\cos 60^{\\circ} = 12\\times 0.5 = 6$ km.',
              'East component = $12\\sin 60^{\\circ} = 12\\times \\frac{\\sqrt{3}}{2} = 6\\sqrt{3}$ km.',
            ],
            final_answer: 'North = 6 km, East = $6\\sqrt{3}$ km',
          },
        ],
      },
    ],
    key_points: [
      'Parallel-line angle rules and triangle properties appear throughout geometry questions.',
      'Congruency proves triangles equal; similarity gives proportional sides and area scaling.',
      'Polygon interior sum: $(n-2)\\times 180^{\\circ}$; exterior sum: $360^{\\circ}$.',
      'Circle theorems are frequently tested in proof-style questions.',
    ],
    exam_tips: [
      'State the theorem you are using (e.g. “angles in the same segment are equal”).',
      'Draw neat diagrams and mark equal angles/lengths clearly.',
      'Keep angles in degrees and round only at the final step unless instructed.',
    ],
    visual_descriptions: [
      'Parallel lines cut by a transversal showing corresponding/alternate/co-interior angles.',
      'A cyclic quadrilateral in a circle with opposite angles labeled.',
    ],
  },
};

export const syllabusTopics = Object.keys(syllabusTopicNotes);

