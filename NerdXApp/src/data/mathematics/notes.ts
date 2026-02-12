import type { MathTopicNotes } from '../mathNotes/types';
import type { MathFormLevel } from './topics';

type FormNotesMap = Record<MathFormLevel, Record<string, MathTopicNotes>>;

function buildFormNote(topic: string, objectives: string[], gradeLevel: MathFormLevel): MathTopicNotes {
  return {
    topic,
    subject: 'Mathematics',
    grade_level: gradeLevel,
    summary: `${gradeLevel} Mathematics syllabus note for ${topic}. Question practice should remain within these objectives.`,
    sections: [
      {
        title: 'Learning Objectives',
        content: objectives.map((o, i) => `${i + 1}. ${o}`).join('\n'),
      },
      {
        title: 'Exam Focus',
        content:
          `Start with simple recall/application, then increase complexity step by step while staying strictly within ${gradeLevel} scope.`,
      },
    ],
    key_points: objectives,
    exam_tips: [
      'Use correct mathematical notation and clear steps.',
      'Answer what is asked before adding extra working.',
      `Keep solutions within ${gradeLevel} syllabus only.`,
    ],
    visual_descriptions: [`Syllabus objective checklist for this ${gradeLevel} topic.`],
  };
}

const form1Objectives: Record<string, string[]> = {
  'Number Concepts and Operations': [
    'Identify number types and classify numbers.',
    'List factors and multiples; find H.C.F. and L.C.M.',
    'Operate with directed numbers using number lines.',
    'Perform operations with fractions, decimals, and percentages.',
  ],
  'Approximation and Estimation': [
    'Round numbers to required place values.',
    'Round numbers to required decimal places.',
  ],
  'Ratios': ['Simplify ratios.', 'Solve ratio-based problems.'],
  'Large and Small Numbers': [
    'Express numbers in words and digits, including very large/small values.',
  ],
  'Number Bases': [
    'Identify everyday number bases (time, quantity, language).',
    'Determine place value and identify numbers in their bases.',
  ],
  'Scales': [
    'Identify representative fraction and ratio scales.',
    'Use scales on plans/maps to measure lengths and distances.',
    'Make scale drawings using given scales.',
  ],
  'Sets and Set Notation': [
    'Define sets by listing and by description.',
    'Use set symbols including $\\in$ and $\\notin$.',
    'State number of elements $n(A)$.',
  ],
  'Types of Sets': [
    'Identify universal, finite, infinite, null, and equal sets.',
    'Form subsets.',
    'Find union and intersection.',
  ],
  'Consumer Arithmetic': [
    'Interpret household bills and extract data.',
    'Calculate profit/loss and discount.',
    'Prepare household budgets.',
  ],
  Measures: [
    'Read 12-hour and 24-hour time.',
    'Identify SI units for mass, length, temperature, and capacity.',
    'Convert between larger and smaller units.',
  ],
  Mensuration: [
    'Calculate perimeter and area of plane shapes.',
    'Calculate volumes of cuboids and prisms.',
  ],
  'Functional Graphs': [
    'Draw Cartesian plane with a given scale.',
    'Name and plot coordinates accurately.',
  ],
  'Travel Graphs': ['Interpret distance-time graphs and solve related questions.'],
  'Symbolic Expression': ['Represent unknown quantities using letters/symbols.'],
  'Algebraic Manipulation': [
    'Collect like terms and simplify expressions.',
    'Substitute values into expressions.',
    'Find algebraic H.C.F. and factorise linear expressions.',
  ],
  Equations: [
    'Solve linear equations with unknown on one side.',
    'Form linear equations from statements.',
  ],
  Inequalities: [
    'Use inequality terms: at least, at most, less than, more than.',
    'Form and solve linear inequalities on number lines.',
  ],
  'Algebraic Expressions in Index Form': [
    'Write products in index form.',
    'Find common factors/multiples and algebraic H.C.F./L.C.M.',
  ],
  'Lines and Angles': [
    'Identify line and angle types.',
    'Calculate angles on straight lines, at points, vertically opposite, and on parallel lines.',
  ],
  Circles: ['Name parts, lines, and regions of circles.'],
  Polygons: ['Define polygons and name $n$-sided polygons up to $n = 10$.'],
  Construction: ['Construct lines and angles with geometric instruments.'],
  Symmetry: [
    'Identify lines of symmetry in plane shapes.',
    'Identify lines of symmetry in letters.',
  ],
  'Data Collection and Classification': [
    'Collect, classify, and tabulate statistical data.',
  ],
  'Data Representation': [
    'Represent data using bar charts, pie charts, and pictograms.',
    'Interpret pictograms and frequency tables.',
  ],
  Translation: [
    'Define transformation and translation.',
    'Translate plane figures.',
  ],
};

const numberConceptsForm1Notes: MathTopicNotes = {
  topic: 'Number Concepts and Operations',
  subject: 'Mathematics',
  grade_level: 'Form 1',
  summary:
    'Mastering the classification and properties of number systems is a strategic prerequisite for ZIMSEC Paper 1. This topic covers natural and whole numbers, place value, expanded notation, factors, multiples, prime factorisation, HCF and LCM, integer operations, BODMAS, fractions, decimals, and word problems. Use the decimal comma (e.g. 0,475) as per ZIMSEC standard.',
  sections: [
    {
      title: '1. Introduction to Natural and Whole Numbers',
      content:
        'These sets form the foundation of algebraic logic and numerical analysis required for Paper 1.\n\n**Natural Numbers** ($\\mathbb{N}$): Often referred to as "counting numbers," this set begins at 1 and continues infinitely: $\\{1;\\ 2;\\ 3;\\ 4;\\ 5;\\ \\ldots\\}$.\n\n**Whole Numbers** ($\\mathbb{W}$): This set includes all natural numbers but incorporates zero as the starting point: $\\{0;\\ 1;\\ 2;\\ 3;\\ 4;\\ 5;\\ \\ldots\\}$.\n\n**Summary of Properties:**\n\n- **Starting Point**: Natural begins at 1; Whole begins at 0\n- **Inclusion**: Natural excludes zero; Whole includes zero\n- **Smallest Element**: 1 for Natural; 0 for Whole\n\nUnderstanding these basic sets allows us to organize more complex values using the decimal system.',
    },
    {
      title: '2. Place Value and Expanded Notation',
      content:
        'Place value is the cornerstone of the decimal system. In Zimbabwe, the decimal comma (e.g. 0,475) is the standard notation used in ZIMSEC examinations.\n\n**Converting Decimals to Fractions**\n\nUsing the logic of place value, express decimals as fractions by identifying the position of the last digit (tenths, hundredths, thousandths).\n\n**Example:** Express 0,475 as a fraction. Since the "5" is in the thousandths place:\n$$0{,}475 = \\frac{475}{1000}$$\nDividing both by the HCF (25): $\\frac{19}{40}$\n\n**Expanded Notation**\n\nExpanded notation decomposes a number to show the "Standard Form" value of each digit using powers of 10. For 1 269:\n\n- 1 is in the thousands place ($10^3$)\n- 2 is in the hundreds place ($10^2$)\n- 6 is in the tens place ($10^1$)\n- 9 is in the units place ($10^0$)\n\n**Expansion:** $(1 \\times 10^3) + (2 \\times 10^2) + (6 \\times 10^1) + (9 \\times 10^0)$\n\n**Example:** Express 37 000 in expanded notation.\n$$\\begin{aligned} 3 \\times 10^4 &= 30{,}000 \\\\ 7 \\times 10^3 &= 7{,}000 \\\\ 0 \\times 10^2 &= 0 \\\\ 0 \\times 10^1 &= 0 \\\\ 0 \\times 10^0 &= 0 \\\\ \\hline \\text{Total:} &\\quad (3 \\times 10^4) + (7 \\times 10^3) \\end{aligned}$$\n\n**The "WHY" of Expanded Notation:** Expanded notation reveals the true value of each digit and prevents treating "3" in 37 000 as a simple unit.\n\n**Practice Exercise 1:**\n1. Express 1 270 in expanded notation using powers of 10.\n2. Express 6 500 in expanded notation using powers of 10.\n3. Express 3 300 in expanded notation using powers of 10.',
    },
    {
      title: '3. Factors, Multiples, and Prime Numbers',
      content:
        'Prime numbers are the strategic "building blocks" of all integers. Every whole number greater than 1 is either a prime or can be uniquely expressed as a product of primes.\n\n**Definitions:**\n\n- **Factors**: Integers that divide exactly into a number without leaving a remainder.\n- **Multiples**: Products of a number and any integer (e.g. multiples of 3 are $3;\\ 6;\\ 9;\\ \\ldots$).\n- **Prime Numbers**: Exactly two factors: 1 and themselves. First few primes: $\\{2;\\ 3;\\ 5;\\ 7;\\ 11;\\ 13\\}$.\n\n**Prime Factorization: The Ladder Method**\n\nContinuous division by prime numbers is the most efficient way to find prime factors.\n\n**Working for 70, 42, and 105:**\n\n70: $2 \\times 5 \\times 7$\n42: $2 \\times 3 \\times 7$\n105: $3 \\times 5 \\times 7$\n\n**Prime Factorization: The Factor Tree Method**\n\nFor 36: $36 \\to 6 \\times 6$, then $6 \\to 2 \\times 3$ and $6 \\to 2 \\times 3$. Result: $2 \\times 2 \\times 3 \\times 3$ (or $2^2 \\times 3^2$).\n\n**Example:** Find the prime factors of 216.\n\n$216 \\div 2 = 108$, $108 \\div 2 = 54$, $54 \\div 2 = 27$, $27 \\div 3 = 9$, $9 \\div 3 = 3$, $3 \\div 3 = 1$\n\nPrime Factors: $2 \\times 2 \\times 2 \\times 3 \\times 3 \\times 3$ (or $2^3 \\times 3^3$).',
    },
    {
      title: '4. Highest Common Factor (HCF) and Lowest Common Multiple (LCM)',
      content:
        'These concepts are vital for simplifying complex fractions and solving logistical word problems.\n\n**HCF**: The product of prime factors that are common to all numbers in the set.\n\n**LCM**: The smallest number that contains the highest power of every prime factor present in the set.\n\n**Example 3:** Find the HCF of 324, 432, and 540.\n$$324 = 2^2 \\times 3^4,\\quad 432 = 2^4 \\times 3^3,\\quad 540 = 2^2 \\times 3^3 \\times 5$$\nCommon: $2^2 \\times 3^3 = 108$. **HCF = 108**\n\n**Example 4:** Find the LCM of 12, 15, and 18.\n\n1. Factorize: $12 = 2^2 \\times 3$; $15 = 3 \\times 5$; $18 = 2 \\times 3^2$.\n2. Take highest powers: $2^2$, $3^2$, and $5$.\n3. Evaluate: $4 \\times 9 \\times 5 = 180$.\n\n**EXAM TIP:** The HCF is always equal to or smaller than the numbers given (it fits into them), while the LCM is always equal to or larger (they all fit into it).\n\n**Practice Exercise 2:**\n1. Calculate the HCF of 36, 54, and 60.\n2. Calculate the HCF of 216 and 168.\n3. Evaluate the LCM of 36, 45, and 60.\n4. Calculate the HCF of 70, 42, and 105.',
    },
    {
      title: '5. Operations with Integers',
      content:
        'Integers, or "directed numbers," represent values on both sides of zero. This logic is essential for algebra.\n\n**The "So What?" Layer: Why is $(- \\times - = +)$?**\n\nMathematically, a negative sign represents "the opposite." Therefore, the "opposite of an opposite" returns you to the original direction (positive).\n\n**Example 5:** Solve $(-5{,}2) + 62{,}7 + 0{,}34$\n\nReorder to add positive values first, then subtract the negative value:\n$$62{,}70 + 0{,}34 = 63{,}04;\\quad 63{,}04 - 5{,}20 = 57{,}84$$\n\n**Answer: 57,84**',
    },
    {
      title: '6. Order of Operations (BODMAS)',
      content:
        'BODMAS ensures mathematical consistency. Without this hierarchy, calculations would be ambiguous.\n\n**B**rackets, **O**f, **D**ivision, **M**ultiplication, **A**ddition, **S**ubtraction.\n\n**Example 6:** Evaluate $1\\frac{1}{2} - \\frac{3}{4} + \\frac{2}{5}$\n\n1. Convert to improper fractions: $\\frac{3}{2} - \\frac{3}{4} + \\frac{2}{5}$.\n2. Find common denominator (20): $\\frac{30}{20} - \\frac{15}{20} + \\frac{8}{20}$.\n3. Subtract/Add: $\\frac{15}{20} + \\frac{8}{20} = \\frac{23}{20} = 1\\frac{3}{20}$.\n\n**Example 7:** Simplify $3\\frac{2}{3} \\times \\frac{1}{4} \\div \\frac{8}{12}$\n\n1. Improper fractions: $\\frac{11}{3} \\times \\frac{1}{4} \\div \\frac{8}{12}$.\n2. Use the **reciprocal** for division: $\\frac{11}{3} \\times \\frac{1}{4} \\times \\frac{12}{8}$.\n3. Simplify: $\\frac{11}{3} \\times \\frac{3}{8} = \\frac{11}{8} = 1\\frac{3}{8}$.\n\n**WHY:** We use the reciprocal because division is the inverse operation of multiplication.\n\n**Practice Exercise 3:**\n1. Evaluate $0{,}22 + 3{,}21 \\times 5{,}2$.\n2. Simplify $(0{,}65 \\div 13) \\times 0{,}02$.\n3. Calculate $1\\frac{1}{2} + \\frac{2}{3} \\times \\frac{1}{5}$.',
      worked_examples: [
        {
          question: 'Evaluate $1\\frac{1}{2} - \\frac{3}{4} + \\frac{2}{5}$',
          steps: [
            'Convert to improper fractions: $\\frac{3}{2} - \\frac{3}{4} + \\frac{2}{5}$',
            'Common denominator 20: $\\frac{30}{20} - \\frac{15}{20} + \\frac{8}{20}$',
            'Subtract/Add: $\\frac{15}{20} + \\frac{8}{20} = \\frac{23}{20}$',
          ],
          final_answer: '$1\\frac{3}{20}$',
        },
        {
          question: 'Simplify $3\\frac{2}{3} \\times \\frac{1}{4} \\div \\frac{8}{12}$',
          steps: [
            'Improper fractions: $\\frac{11}{3} \\times \\frac{1}{4} \\div \\frac{8}{12}$',
            'Reciprocal for division: $\\frac{11}{3} \\times \\frac{1}{4} \\times \\frac{12}{8}$',
            'Simplify: $\\frac{11}{3} \\times \\frac{3}{8} = \\frac{11}{8}$',
          ],
          final_answer: '$1\\frac{3}{8}$',
        },
      ],
    },
    {
      title: '7. Fractions: Concepts and Operations',
      content:
        'Fractions represent exact parts of a whole. In ZIMSEC Paper 1, fractions are often preferred over decimals because they maintain perfect accuracy without rounding.\n\n**Example 8:** Express 0,475 as a fraction in its lowest terms\n$$0{,}475 = \\frac{475}{1000} \\xrightarrow{\\div 5} \\frac{95}{200} \\xrightarrow{\\div 5} \\frac{19}{40}$$\n\n**Example 9:** Express $\\frac{2}{3}$, $\\frac{4}{7}$, and $\\frac{5}{9}$ in order of size, smallest first\n\nConvert to decimals (approx. 2 d.p.): $\\frac{2}{3} \\approx 0{,}67$; $\\frac{4}{7} \\approx 0{,}57$; $\\frac{5}{9} \\approx 0{,}56$\n\n**Order:** $\\frac{5}{9}$; $\\frac{4}{7}$; $\\frac{2}{3}$',
      worked_examples: [
        {
          question: 'Express 0,475 as a fraction in its lowest terms',
          steps: [
            '0,475 has 5 in thousandths: $\\frac{475}{1000}$',
            'Divide by 5: $\\frac{95}{200}$',
            'Divide by 5 again: $\\frac{19}{40}$',
          ],
          final_answer: '$\\frac{19}{40}$',
        },
      ],
    },
    {
      title: '8. Decimals and Conversions',
      content:
        'Decimals are essential for Zimbabwean measurement and currency systems. You must be able to round values as specified in exam instructions.\n\n- **Significant Figures (s.f.)**: Start counting from the first non-zero digit.\n- **Decimal Places (d.p.)**: Count the number of digits after the decimal comma.\n\n**Example 10:** Calculate $8{,}5 \\div 5$\n$$\\frac{8{,}5}{5} = \\frac{85}{50} = \\frac{17}{10} = 1{,}7$$\n\n**Example 11:** Express 0,006287 to 3 s.f. and 2 d.p.\n\n- **3 s.f.**: 0,00629 (The 7 rounds the 8 up).\n- **2 d.p.**: 0,01 (The 6 in the third decimal place rounds the second place up).',
    },
    {
      title: '9. Word Problems involving Number Operations',
      content:
        'Word problems test your ability to model real-world scenarios mathematically.\n\n**Example 12: The Novel Problem**\n\nA novel was 504 pages. Linda read 308. What fraction was left?\n\n1. Pages remaining: $504 - 308 = 196$.\n2. Fraction: $\\frac{196}{504}$.\n3. Simplification: $\\frac{196 \\div 28}{504 \\div 28} = \\frac{7}{18}$.\n\n**Example 13: The Wood Piece Problem**\n\nHow many pieces $6\\frac{2}{3}$ m long can be cut from a log $46\\frac{2}{3}$ m long?\n\n1. Division: $\\frac{140}{3} \\div \\frac{20}{3}$.\n2. Reciprocal: $\\frac{140}{3} \\times \\frac{3}{20} = 7$ pieces.\n\n**Example 14: The Ice Cream Problem**\n\nJane has $40 and buys ice creams at $2,40 each. Find the change.\n\n1. Quantity: $40 \\div 2{,}4 = 16{,}66\\ldots$ (Max ice creams = 16).\n2. Total Cost: $16 \\times \\$2{,}40 = \\$38{,}40$.\n3. Change: $\\$40{,}00 - \\$38{,}40 = \\$1{,}60$.',
      worked_examples: [
        {
          question: 'A novel was 504 pages. Linda read 308. What fraction was left?',
          steps: [
            'Pages remaining: $504 - 308 = 196$',
            'Fraction: $\\frac{196}{504}$',
            'Simplify (HCF 28): $\\frac{7}{18}$',
          ],
          final_answer: '$\\frac{7}{18}$',
        },
        {
          question: 'How many pieces $6\\frac{2}{3}$ m long can be cut from a log $46\\frac{2}{3}$ m long?',
          steps: [
            '$46\\frac{2}{3} = \\frac{140}{3}$, $6\\frac{2}{3} = \\frac{20}{3}$',
            '$\\frac{140}{3} \\div \\frac{20}{3} = \\frac{140}{3} \\times \\frac{3}{20}$',
            'Simplify: 7',
          ],
          final_answer: '7 pieces',
        },
        {
          question: 'Jane has $40 and buys ice creams at $2,40 each. Find the change.',
          steps: [
            'Max ice creams: $40 \\div 2{,}4 = 16$ (whole number)',
            'Total cost: $16 \\times 2{,}40 = 38{,}40$',
            'Change: $40 - 38{,}40 = 1{,}60$',
          ],
          final_answer: '$1{,}60$',
        },
      ],
    },
    {
      title: '10. Mixed Revision Exercise',
      content:
        '1. Simplify $1\\frac{3}{4} - \\frac{2}{5} + \\frac{1}{2}$.\n2. Calculate 25% of 180.\n3. Express 0,00309 in standard form.\n4. Find the HCF of 216 and 168.\n5. Evaluate $34 \\div 0{,}04$.\n6. Express 1 269 to 3 s.f.\n7. Find $\\frac{1}{8}$ of 7,24 km in meters.\n8. Simplify $0{,}34 - 5{,}2 + 62{,}7$.\n9. Change $\\frac{11}{50}$ into a decimal.\n10. Express 42 cm as a percentage of 1,05 m.\n11. Find the LCM of 12, 15, and 18.\n12. Calculate the value of $\\frac{3}{8}$ of 6.\n13. Express 0,065037 to 2 s.f.\n14. Evaluate $(4{,}4 \\times 10^6) \\div (2 \\times 10^2)$.\n15. Calculate the number of pieces of wood 2,5 m long that can be cut from a 20 m log.',
    },
    {
      title: '11. Solutions and Exam-Style Test',
      content:
        '**Worked Solutions**\n\n**Question 10:** 42 cm as % of 105 cm:\n$$\\frac{42}{105} \\times 100 = \\frac{2}{5} \\times 100 = 40\\%$$\n\n**Question 14:**\n$$(4{,}4 \\div 2) \\times 10^{6-2} = 2{,}2 \\times 10^4$$\n\n**Exam-Style Test (Paper 1 Format - No Calculator)**\n\n1. Evaluate $3\\frac{2}{3} \\times \\frac{1}{4} \\div \\frac{8}{12}$.\n2. Express 0,475 as a fraction in lowest terms.\n3. Find the LCM of 36, 45, and 60.\n4. Express 0,006287 to 3 decimal places.\n5. Find the prime factors of 216.\n6. Calculate 6% of 5 450.\n7. A college has 648 students. $\\frac{7}{12}$ are female. How many are male?\n8. Evaluate $0{,}65 \\div 13 \\times 0{,}02$.\n9. Write 37 000 in standard form.\n10. Subtract 5,2 from the sum of 0,34 and 62,7.',
    },
  ],
  key_points: [
    'Natural numbers ($\\mathbb{N}$) begin at 1; whole numbers ($\\mathbb{W}$) include zero.',
    'Place value uses powers of 10; expanded notation shows each digit\'s value (e.g. $1 \\times 10^3 + 2 \\times 10^2 + \\ldots$).',
    'Prime factorisation: ladder method or factor tree; every integer $> 1$ has a unique prime factorization.',
    'HCF = product of common primes (lowest power); LCM = product of all primes (highest power).',
    'Integer rules: opposite of opposite is positive ($- \\times - = +$).',
    'BODMAS: Brackets, Of, Division, Multiplication, Addition, Subtraction.',
    'Decimal comma (0,475) is ZIMSEC standard; fractions often preferred for exactness in Paper 1.',
    's.f. counts from first non-zero digit; d.p. counts digits after the decimal comma.',
  ],
  exam_tips: [
    'Show method marks: Even if your final answer is wrong, ZIMSEC examiners award marks for correct steps.',
    'Decimal comma: Consistently use the comma to match the exam standard.',
    'Verify units: Always ensure your units (m, km, dollars, cents) match the question requirements.',
    'No calculators: Practice mental and vertical arithmetic to build Paper 1 speed.',
  ],
  visual_descriptions: [
    'Summary table comparing Natural and Whole number properties.',
    'Expanded notation decomposition of numbers using powers of 10.',
    'Ladder and factor tree methods for prime factorisation.',
    'Worked examples with BODMAS, fractions, and word problems.',
  ],
};

const approximationEstimationForm1Notes: MathTopicNotes = {
  topic: 'Approximation and Estimation',
  subject: 'Mathematics',
  grade_level: 'Form 1',
  summary:
    'In everyday life and mathematical problem-solving, we rarely need infinite precision. Approximation involves rounding to a required level (e.g. 2 decimal places or 3 significant figures). Estimation uses these simplified values as a sanity check. Mastering these rules is the foundation for accuracy in ZIMSEC examinations. Use the decimal comma (e.g. 0,475) as per ZIMSEC standard.',
  sections: [
    {
      title: '1. Introduction to Approximation and Estimation',
      content:
        'Whether calculating distance between cities or the number of students in a college, working with simplified values—approximations—makes calculations manageable. In ZIMSEC examinations, you will often be asked to give your answer "correct to" a specific degree of accuracy.\n\n**Approximation** involves rounding a value to a required level of precision (e.g. 2 decimal places or 3 significant figures).\n\n**Estimation** is the strategic use of these values to find a "near" answer to a complex calculation, serving as a vital sanity check. These skills are strategically important; for instance, when dealing with quadratic graphs, we use approximate roots. Mastering these rules is the foundation for accuracy in all subsequent mathematical topics.',
    },
    {
      title: '2. Rounding Off',
      content:
        '**2.1 Rounding Whole Numbers**\n\nThe Rounding Rule: Identify the digit in the place value you are rounding to, then look at the digit immediately to its right.\n\n- If the digit to the right is 5 or more, add 1 to the target digit (round up).\n- If the digit to the right is less than 5, keep the target digit the same.\n\n**Worked Examples (Whole Numbers):**\n\n1. Round 1 269 to the nearest 10: Tens digit is 6; digit right is 9. Round up: **1 270**\n2. Round 1 269 to the nearest 100: Hundreds digit is 2; digit right is 6. Round up: **1 300**\n3. Round 3 269 to the nearest 1 000: Thousands digit is 3; digit right is 2. Keep: **3 000**\n4. Round 6 289 to the nearest 100: **6 300**\n5. Round 273 to the nearest 10: **270**\n6. Round 28 000 to the nearest 10 000: **30 000**\n\n**EXAM TIP:** Keep the magnitude consistent. Turning 1 269 into 13 ignores place value—answer must remain in the thousands.\n\n**2.2 Rounding Decimals to Decimal Places (d.p.)**\n\nDecimal places = count of digits following the decimal comma. Money usually 2 d.p.\n\n**Worked Examples (d.p.):**\n\n1. Round 13,6731 to 3 d.p.: 3rd d.p. is 3; next digit 1. Keep: **13,673**\n2. Round 0,2869 to 3 d.p.: **0,287**\n3. Round 0,0486 to 3 d.p.: **0,049**\n4. Round 0,006287 to 3 d.p.: **0,006**\n5. Round 0,006287 to 2 d.p.: **0,01**\n6. Round 0,6666... to 2 d.p.: **0,67**\n7. Round 0,571 to 2 d.p.: **0,57**\n8. Round 0,996 to 2 d.p.: 9 rounds to 10, carries: **1,00**\n\n**COMMON ERROR:** Do not include extra zeros. For 2 d.p., 0,5700 is incorrect; use 0,57.\n\n**2.3 Rounding to Significant Figures (s.f.)**\n\ns.f. reflect the accuracy of the entire value. Count from the first non-zero digit.\n\n**Worked Examples (s.f.):**\n\n1. Round 1 269 to 3 s.f.: 4th digit 9. Round up: **1 270**\n2. Round 3,017 to 3 s.f.: **3,02**\n3. Round 0,032016 to 3 s.f.: **0,0320**\n4. Round 3 269 to 2 s.f.: **3 300**\n5. Round 4,027 to 2 s.f.: **4,0**\n6. Round 0,065037 to 2 s.f.: **0,065**\n7. Round 6 289 to 1 s.f.: **6 000**\n8. Round 0,058 to 1 s.f.: **0,06**\n\n**COMMON ERROR:** When rounding 1 269 to 2 s.f., writing "13" is wrong—it changes thousands to thirteen. Use **1 300** to preserve place value.\n\n**Practice Exercise 1:**\n1. 4,027 to 3 s.f.\n2. 0,006287 to 2 s.f.\n3. 1 269 to 1 s.f.\n4. 0,032016 to 2 s.f.\n5. 273 to 2 s.f.',
    },
    {
      title: '3. Significant Figures: Rules and Identification',
      content:
        '**Digit Type Rules:**\n\n- **Non-zero digits**: Always significant (e.g. 29 has 2 s.f.)\n- **Zeros between non-zeros**: Always significant (e.g. 8,04 has 3 s.f.)\n- **Leading zeros (decimals)**: Never significant (e.g. 0,029 has 2 s.f.)\n- **Trailing zeros (whole numbers)**: Generally placeholders (e.g. 28 000 has 2 s.f.)\n\n**Note:** In ZIMSEC, trailing zeros in whole numbers without a decimal point are typically placeholders. Thus 28 000 km is 2 s.f.\n\n**Identifying s.f.:**\n\n1. 0,029 cm: 2 s.f.\n2. 8,04 g: 3 s.f. (zero is trapped)\n3. 28 000 km: 2 s.f. (placeholders)\n4. 3,017: 4 s.f. (zero between non-zeros)\n5. 0,00320: 3 s.f. (final zero shows precision)\n6. 100,0: 4 s.f. (decimal point makes trailing zeros significant)',
    },
    {
      title: '4. Decimal Places in Depth',
      content:
        'In ZIMSEC Arithmetic you are often required to convert fractions to decimals correct to 2 d.p. Perform long division to at least 3 decimal places before rounding.\n\n**Worked Examples:**\n\n1. Convert $\\frac{4}{7}$ to a decimal correct to 2 d.p.\n   - $4 \\div 7 = 0{,}5714\\ldots$; 3rd d.p. is 1. Keep 7. **Answer: 0,57**\n2. Convert $\\frac{2}{3}$ to 2 d.p.: $2 \\div 3 = 0{,}666\\ldots$. **Answer: 0,67**\n3. Convert $\\frac{5}{9}$ to 2 d.p.: $5 \\div 9 = 0{,}555\\ldots$. **Answer: 0,56**\n4. Convert $\\frac{1}{8}$ to 2 d.p.: $1 \\div 8 = 0{,}125$; round 2 up to 3. **Answer: 0,13**\n5. Convert 0,99 to 1 d.p.: 9 rounds to 10, carries. **Answer: 1,0**\n6. Convert $\\frac{13}{20}$: $13 \\div 20 = 0{,}65$. **Answer: 0,65**\n\n**Practice Exercise 2:** Convert to decimals correct to 2 d.p.:\n1. $\\frac{11}{50}$ 2. $\\frac{3}{40}$ 3. $\\frac{5}{6}$ 4. $\\frac{7}{11}$ 5. $\\frac{1}{12}$',
    },
    {
      title: '5. Estimation in Calculations',
      content:
        'Estimation provides a sanity check to ensure your arithmetic is reasonable.\n\n**Rules:** Round every number to 1 significant figure first; then perform the calculation.\n\n**Worked Examples:**\n\n1. Estimate $3{,}21 \\times 5{,}2$: Round to 3 and 5. $3 \\times 5 = 15$.\n2. Estimate 10,98 kg $\\div$ 54,9 g: Convert to g (10 980); round to 10 000 and 50. $10\\ 000 \\div 50 = 200$.\n3. Estimate 9% of 6,40: Round to 10% (0,1) and 6. $0{,}1 \\times 6 = 0{,}6$.\n4. Estimate $0{,}25 \\times 55$: Round to 0,3 and 60. $0{,}3 \\times 60 = 18$.\n5. Estimate 13% of 8,20: $0{,}1 \\times 8 = 0{,}8$.\n6. Estimate 483 km $\\div$ 12,2 hours: 500 $\\div$ 10 = **50 km/h**.\n7. Estimate $0{,}65 \\div 13$: 0,7 $\\div$ 10 = **0,07**.\n8. Estimate $0{,}34 + 5{,}2 + 62{,}7$: 0,3 + 5 + 60 = **65,3**.\n\n**Compare:** $3{,}21 \\times 5{,}2$ exact = 16,692; estimate = 15. Reasonable.\n\n**EXAM TIP:** When asked to "Estimate," round *before* calculating. Calculating exactly first and then rounding may lose marks.',
      worked_examples: [
        {
          question: 'Estimate $3{,}21 \\times 5{,}2$ by rounding each number to 1 s.f.',
          steps: ['Round 3,21 to 3 and 5,2 to 5', 'Calculate: $3 \\times 5 = 15$'],
          final_answer: '15',
        },
        {
          question: 'Estimate 9% of 6,40',
          steps: ['Round 9% to 10% (0,1) and 6,40 to 6', 'Calculate: $0{,}1 \\times 6 = 0{,}6$'],
          final_answer: '0,60',
        },
      ],
    },
    {
      title: '6. Upper and Lower Bounds (Basic Form 1 Level)',
      content:
        'Rounded numbers represent a range of possible values.\n\n- **Lower Bound**: The smallest value that rounds up to the number.\n- **Upper Bound**: The smallest value that would round to the next unit.\n\n**Worked Examples:**\n\n1. 54,9 g (correct to 1 d.p.): Half of 0,1 is 0,05. Lower $= 54{,}9 - 0{,}05 =$ **54,85 g**; Upper $= 54{,}9 + 0{,}05 =$ **54,95 g**.\n2. 483 km (nearest whole): Half of 1 is 0,5. Bounds: **482,5 km** and **483,5 km**.\n3. 1 300 (nearest 100): Half of 100 is 50. Bounds: **1 250** and **1 350**.\n4. 10 kg (nearest kg): Lower $= 10 - 0{,}5 =$ **9,5 kg**.\n5. Log 46 m (nearest metre): **45,5 m** to **46,5 m**.\n6. 55 g (nearest 5 g): Half of 5 is 2,5. Bounds: **52,5 g** and **57,5 g**.',
    },
    {
      title: '7. Error and Accuracy',
      content:
        '**Absolute Error** = difference between actual value and approximate value.\n\n**Worked Examples:**\n\n1. Error if 7,24 km rounded to 1 s.f.: $7{,}24 - 7 = 0{,}24$ km.\n2. Error if 0,576 rounded to nearest cent (0,58): $0{,}58 - 0{,}576 = 0{,}004$.\n3. Error in 13,6731 rounded to 3 d.p.: $13{,}6731 - 13{,}673 = 0{,}0001$.\n4. Which is more accurate: 3,017 to 2 s.f. or 3 s.f.? 2 s.f. error = 0,017; 3 s.f. error = 0,003. **3 s.f. is more accurate.**\n5. Error if 28 312 rounded to nearest 1 000: $28\\ 312 - 28\\ 000 = 312$.',
    },
    {
      title: '8. Revision and Assessment',
      content:
        '**Mixed Revision Exercise**\n\n1. Round 3 269 to the nearest 10.\n2. Round 3 269 to 2 s.f.\n3. Round 0,006287 to 3 d.p.\n4. Round 0,006287 to 3 s.f.\n5. Round 0,058 to 1 s.f.\n6. Express $\\frac{13}{20}$ as a decimal.\n7. Express 0,475 as a fraction in lowest terms.\n8. Round 1,066 to the nearest cent.\n9. Estimate the product of 0,25 and 55.\n10. Find the number of s.f. in 8,04.\n11. Find the number of s.f. in 28 000.\n12. Round 1 269 to 3 s.f.\n13. Express $\\frac{2}{3}$ as a decimal correct to 2 d.p.\n14. A novel has 504 pages; 308 are read. What fraction is left? (Lowest terms)\n15. How many $6\\frac{2}{3}$ m pieces are in a $46\\frac{2}{3}$ m log?\n16. Find $\\frac{1}{8}$ of 7,24 km in metres.\n17. Evaluate $0{,}65 \\div 13$.\n18. Change $\\frac{11}{50}$ to a decimal.\n19. Round 13,6731 correct to 3 d.p.\n20. Identify the lower bound of 10 kg (correct to nearest kg).\n21. Round 0,0032016 to 3 s.f.\n22. Round 6 289 to 1 s.f.\n23. Calculate 9% of 6,40 correct to the nearest cent.\n24. Round 4,027 to 2 s.f.\n25. Find the absolute error if 7,24 is rounded to 7.\n\n**Exam-Style Mini Test**\n\n1. Round 0,006287 correct to 2 decimal places. [2]\n2. Give 3 269 correct to two significant figures. [2]\n3. Calculate the exact value of $3{,}21 \\times 5{,}2$. [2]\n4. Estimate $3{,}21 \\times 5{,}2$ by rounding each to 1 s.f. [2]\n5. A pack weighs 10,98 kg. Each book 54,9 g. How many books? [2]\n6. Identify s.f. in 0,00320. [1]\n7. Convert $\\frac{4}{7}$ to a decimal correct to 2 d.p. [2]\n8. Distance 483 km correct to nearest km. Write the upper bound. [2]\n9. Absolute error when 273 rounded to 1 s.f. [2]\n10. Express 1,066 correct to the nearest cent. [1]\n\n**Practice Exercise 1 Answers:** 1. 4,03 2. 0,0063 3. 1 000 4. 0,032 5. 270\n\n**Practice Exercise 2 Answers:** 1. 0,22 2. 0,08 3. 0,83 4. 0,64 5. 0,08\n\n**Mixed Revision Sample Answers:** 1. 3 270 2. 3 300 3. 0,006 4. 0,00629 5. 0,06 6. 0,65 7. $\\frac{19}{40}$ 8. 1,07 9. 18 10. 3 11. 2 12. 1 270 13. 0,67 14. $\\frac{7}{18}$ 15. 7 pieces 16. 905 m 17. 0,05 18. 0,22 19. 13,673 20. 9,5 kg 21. 0,00320 22. 6 000 23. 0,58 24. 4,0 25. 0,24\n\n**Mini Test Memo:** 1. 0,01 2. 3 300 3. 16,692 4. 15 5. 200 books 6. 3 s.f. 7. 0,57 8. 483,5 km 9. 27 10. 1,07',
    },
  ],
  key_points: [
    'Rounding rule: digit to right $\\ge 5$ round up; $< 5$ keep same.',
    'Decimal places (d.p.): count digits after decimal comma. s.f.: count from first non-zero digit.',
    'Non-zero digits always significant; leading zeros never; trailing zeros in whole numbers are placeholders.',
    'For estimation: round to 1 s.f. first, then calculate.',
'Lower bound = value $-$ half of degree of accuracy; Upper bound = value $+$ half.',
'Absolute error = $|\\text{actual} - \\text{approximate}|$.',
  ],
  exam_tips: [
    'Keep magnitude consistent when rounding ($1\\ 269 \\to 1\\ 300$ not 13).',
    'When asked to "Estimate," round before calculating—never calculate exactly first.',
    'For 2 d.p., do not add extra zeros (0,57 not 0,5700).',
    'Practice Exercise and Memo answers are provided for self-assessment.',
  ],
  visual_descriptions: [
    'Rounding rule flowchart: digit $\\ge 5$ round up, $< 5$ keep.',
    's.f. identification table: non-zero, trapped zeros, leading, trailing.',
    'Bounds diagram: lower and upper limits for rounded values.',
  ],
};

const ratiosForm1Notes: MathTopicNotes = {
  topic: 'Ratios',
  subject: 'Mathematics',
  grade_level: 'Form 1',
  summary:
    'Ratio is a vital strategic tool used to compare quantities of the same kind in the ZIMSEC Mathematics syllabus. Beyond simple arithmetic, ratios form the conceptual foundation for proportional reasoning—essential for business profit sharing, resource allocation, and scale drawings. Mastering ratios enables precision in the "Turn-Up College" examination methodology. Use the decimal comma (e.g. 0,475) as per ZIMSEC standard.',
  sections: [
    {
      title: '1. Introduction to Ratio and Comparative Mathematical Logic',
      content:
        '**Fundamental Principles**\n\n**Definition:** A ratio is a mathematical comparison of two or more quantities of the same unit.\n\n**Notation:** Ratios are written using a colon ($a : b$) or as a fraction $\\frac{a}{b}$.\n\n**The Order of Terms:** The sequence is critical. A ratio of boys to girls of 2 : 3 is mathematically distinct from 3 : 2. Reversing terms in an exam is a frequent cause of lost marks.\n\n**Part-to-Part vs. Part-to-Whole:**\n\n- Part-to-Part: Compares one group to another (e.g. males to females)\n- Part-to-Whole: Compares one group to the total (e.g. males to total enrollment)\n\n**Worked Examples:**\n\n1. College: 645 students; 344 males, 301 females. Ratio males : females = **344 : 301**\n2. Novel 504 pages; 308 read. Remaining = 196. Ratio read : remaining = **308 : 196**\n3. Ice cream 2,40; bill 10,00. Ratio = **2,4 : 10**\n4. 42 cm and 1,05 m: Convert to cm. Ratio = **42 : 105**\n5. Portion 45 of total 180. Ratio = **45 : 180**\n\n**Connective Tissue:** Once established, ZIMSEC requires ratios to be refined into simplest form.',
      worked_examples: [
        {
          question: 'A college has 645 students. 344 are males and 301 are females. Find the ratio of males to females.',
          steps: ['Males = 344; Females = 301', 'Ratio = 344 : 301'],
          final_answer: '344 : 301',
        },
        {
          question: 'Express 42 cm and 1,05 m as a simplified ratio.',
          steps: ['Convert: 1,05 m = 105 cm', 'Ratio = 42 : 105', 'Divide by HCF 21: 2 : 5'],
          final_answer: '2 : 5',
        },
      ],
    },
    {
      title: '2. Simplifying Ratios: The Path to Mathematical Clarity',
      content:
        'In ZIMSEC examinations, simplification is the standard. Reducing a ratio to its lowest terms removes unnecessary complexity.\n\n**Methods of Simplification:**\n\n- **Whole Numbers:** Divide all terms by their HCF.\n- **Decimals:** Convert to whole numbers by multiplying by 10, 100, or 1 000.\n- **Fractions:** Use the reciprocal method: $a : b$ where $a$, $b$ are fractions $\\to$ treat as $a \\div b = a \\times \\text{(reciprocal of } b)$.\n\n**Worked Examples:**\n\n1. Simplify 36 : 54 : 60. HCF = 6. **Result: 6 : 9 : 10**\n2. Simplify 0,65 : 13. Multiply by 100: 65 : 1 300. Divide by 65. **Result: 1 : 20**\n3. Simplify $\\frac{1}{2} : \\frac{3}{4}$: $\\frac{1}{2} \\div \\frac{3}{4} = \\frac{1}{2} \\times \\frac{4}{3} = \\frac{2}{3}$. **Result: 2 : 3**\n4. Simplify 42 : 105. HCF 21. **Result: 2 : 5**\n5. Simplify 1 269 : 1 270. No common factors. **Already simplest**\n6. Simplify 0,125 : 0,025. Multiply by 1 000: 125 : 25. **Result: 5 : 1**\n7. Simplify 26 : 200. Divide by 2. **Result: 13 : 100**\n8. Express 26 : 200 as 1 : $n$. Divide by 26. **Result: 1 : 7,69** (2 d.p.)\n\n**Practice Exercise:**\n1. Simplify 216 : 168.\n2. Simplify 0,34 : 5,2.\n3. Simplify $\\frac{11}{50} : \\frac{13}{20}$.\n4. Express 7,24 km : 905 m as a simplified ratio of whole numbers.\n5. Simplify 12 : 15 : 18.',
      worked_examples: [
        {
          question: 'Simplify $\\frac{1}{2} : \\frac{3}{4}$ using the reciprocal method',
          steps: ['Express as $\\frac{1}{2} \\div \\frac{3}{4}$', 'Multiply by reciprocal: $\\frac{1}{2} \\times \\frac{4}{3} = \\frac{4}{6}$', 'Simplify: $\\frac{2}{3}$'],
          final_answer: '2 : 3',
        },
        {
          question: 'Simplify 0,65 : 13',
          steps: ['Multiply by 100: 65 : 1 300', 'Divide by HCF 65'],
          final_answer: '1 : 20',
        },
      ],
    },
    {
      title: '3. Equivalent Ratios and Proportional Consistency',
      content:
        'Equivalent ratios represent the same proportional relationship but use different values. If we double the ingredients in a recipe, the ratio remains equivalent.\n\n**Worked Examples:**\n\n1. Verify 2 : 3 and 10 : 15. Divide $10 : 15$ by 5 $\\to$ $2 : 3$. **Equivalent**\n2. Find $x$ if $4 : 7 = 20 : x$. Scale factor $20 \\div 4 = 5$. $7 \\times 5 = 35$. **$x = 35$**\n3. Scale $1 : 8$ to second term 7,24. Scale factor $7{,}24 \\div 8 = 0{,}905$. **Ratio: 0,905 : 7,24**\n4. $5 : 9$ and $50 : 90$: $50 \\div 10 = 5$, $90 \\div 10 = 9$. **Equivalent**\n5. Find $y$ if $y : 6 = 54 : 9$. Simplify $54 : 9 \\to 6 : 1$. $y : 6 = 6 : 1$. $y = 36$.\n6. Find $x$ if $x : 100 = 13 : 50$. Scale factor 2. $x = 26$.\n\n**Practice Exercise:** 1. 3 : 4 = 12 : $x$ 2. 5 : 2 = $x$ : 10 3. 1 : 20 = 5 : $x$ 4. $x$ : 7 = 8 : 14 5. 11 : 50 = $x$ : 100',
    },
    {
      title: '4. Dividing Quantities in a Given Ratio (The Sharing Principle)',
      content:
        'The most common application in ZIMSEC papers.\n\n**The Mandatory Sharing Method:**\n\n1. Add the ratio parts (Total Parts)\n2. Divide the total quantity by the total parts (Value of One Part)\n3. Multiply the value of one part by each ratio term\n\n**Worked Examples:**\n\n1. Divide 180 in the ratio 2 : 3 : 5. Total parts 10; one part 18. **Shares: 36, 54, 90**\n2. College 645 students, ratio females : males = 7 : 8. Total parts 15; one part 43. **Females: 301; Males: 344**\n3. Divide 3 h 36 min in ratio 5 : 7. Total 216 min; one part 18 min. **1 h 30 min and 2 h 6 min**\n4. Divide 10,98 kg in ratio 1 : 2. **Shares: 3,66 kg and 7,32 kg**\n5. Share 40 between Jane and Sekai in ratio 13 : 7. One part 2. **Jane: 26; Sekai: 14**\n6. Divide 14,95 in ratio 2 : 3. **Shares: 5,98 and 8,97**\n7. Log 3,93 m in ratio 2 : 1. **Lengths: 2,62 m and 1,31 m**\n8. 15% deposit on 3 200 TV. Deposit = 480; Balance = 2 720. **Deposit: 480**\n\n**EXAM TIP:** Check that the sum of your calculated shares equals the original total.',
      worked_examples: [
        {
          question: 'Divide 180 in the ratio 2 : 3 : 5',
          steps: ['Total parts: $2 + 3 + 5 = 10$', 'One part: $180 \\div 10 = 18$', 'Shares: $2\\times18=36$, $3\\times18=54$, $5\\times18=90$'],
          final_answer: '36, 54, 90',
        },
        {
          question: 'Share 40 between Jane and Sekai in the ratio 13 : 7',
          steps: ['Total parts: 20', 'One part: $40 \\div 20 = 2$', 'Jane: $13\\times2=26$; Sekai: $7\\times2=14$'],
          final_answer: 'Jane: 26; Sekai: 14',
        },
      ],
    },
    {
      title: '5. Finding Missing Terms in Ratios',
      content:
        'Given a ratio and the actual value of one part, find the other parts or the total.\n\n**Worked Examples:**\n\n1. Masses $3 : 8$; smaller 6 kg. $3$ parts $= 6 \\Rightarrow$ 1 part $= 2$. Larger $= 8 \\times 2 =$ **16 kg**\n2. Ratio profit : cost $= 3 : 13$; profit 0,15. $3$ parts $= 0{,}15 \\Rightarrow$ 1 part $= 0{,}05$. Cost $= 13 \\times 0{,}05 =$ **0,65**\n3. Find $a$ if $a : 4 = 34 : 100$. Cross-multiply: $100a = 136$. **$a = 1{,}36$**\n4. Find $x$ if $x : 2 = 1{,}2 : 6$. $6x = 2{,}4$. **$x = 0{,}4$**\n5. Ratio 1 : 20; second part 180. 20 parts = 180 → 1 part = 9. **First part: 9**',
    },
    {
      title: '6. Comparing Ratios: Quantitative Evaluation',
      content:
        'To compare ratios, convert them to decimals or fractions with a common denominator.\n\n**Worked Examples:**\n\n1. Which is larger: 2 : 3 or 4 : 7? $2 \\div 3 = 0{,}67$; $4 \\div 7 = 0{,}57$. **2 : 3 is larger**\n2. Compare 13 : 20 and 11 : 50. 0,65 vs 0,22. **13 : 20 is larger**\n3. Order 5 : 9, 4 : 7, 2 : 3 smallest to largest. 0,56; 0,57; 0,67. **5 : 9; 4 : 7; 2 : 3**\n4. Higher percentage: 1 : 8 or 3 : 40? $1 \\div 8 = 12{,}5\\%$; $3 \\div 40 = 7{,}5\\%$. **1 : 8 is higher**\n5. Map scale 1 : 100 000 vs 1 : 50 000. 1 : 50 000 represents a larger physical representation. **1 : 50 000 is more detailed**',
    },
    {
      title: '7. Word Problems on Ratio: Real-World Applications',
      content:
        '**Worked Examples:**\n\n1. **Scale Drawings:** Log $46\\frac{2}{3}$ m; pieces $6\\frac{2}{3}$ m. Remaining = 40 m. Ratio piece : remaining = $\\frac{20}{3} : 40 \\to 1 : 6$.\n2. **Profit Analysis:** Buy 0,65; sell 0,80. Profit 0,15. Ratio profit : selling = 0,15 : 0,80 → **3 : 16**\n3. **Exchange:** 34% of sum = 15,30; total 45. Remaining 29,70. Ratio 15,30 : 29,70 → **17 : 33**\n4. **Mixtures:** Blanket reduced 12% from 40. Reduction 4,80; new price 35,20. Ratio reduction : new = **3 : 22**\n5. **Enrollment:** 645 students, ratio 7 : 8. Original 301 F, 344 M. If 5 males join: **301 : 349**\n6. **Time:** 3 h 36 min split 5 : 7. Worker 1: 90 min; Worker 2: 126 min. **Second spends 36 min longer**\n7. **Scale:** Map 1 : 50 000; road 4 cm. Actual: 200 000 cm = **2 km**\n8. **Recipe:** Flour : sugar = 5 : 2; flour 500 g. 1 part = 100 g. Sugar 200 g. **Total: 700 g**',
      worked_examples: [
        {
          question: 'Sekai buys pencils at 0,65 and sells at 0,80. Find the ratio of profit to selling price.',
          steps: ['Profit $= 0{,}80 - 0{,}65 = 0{,}15$', 'Ratio $= 0{,}15 : 0{,}80 = 15 : 80$', 'Simplify: $3 : 16$'],
          final_answer: '3 : 16',
        },
        {
          question: 'Map scale 1 : 50 000. A road on the map is 4 cm. Find the actual length in km.',
          steps: ['1 part = 4 cm on map', '$50\\ 000$ parts $= 200\\ 000$ cm', '$200\\ 000 \\div 100\\ 000 = 2$ km'],
          final_answer: '2 km',
        },
      ],
    },
    {
      title: '8. Revision and Assessment Section',
      content:
        '**Mixed Revision Exercise**\n\n1. Simplify 216 : 168.\n2. Express 0,475 as a fraction in lowest terms.\n3. Divide 180 in the ratio 1 : 3.\n4. Find the HCF of 324 and 432 to simplify their ratio.\n5. If $\\frac{1}{8}$ of 7,24 km is found, express part to whole as a ratio.\n6. Novel 504 pages; 308 read. Express read : total as simplified ratio.\n7. Simplify 0,34 : 5,2.\n8. Divide 3 200 in the ratio 3 : 17.\n9. Find $x$ if $x : 10 = 3{,}5 : 1$.\n10. Which is smaller: 4 : 7 or 5 : 9?\n11. Express 15,30 : 45 as a ratio of whole numbers.\n12. TV 3 200. Find ratio of 15% deposit to total price.\n13. Simplify $\\frac{11}{50} : \\frac{13}{20}$ using reciprocal method.\n14. Log 3,93 m cut in ratio 2 : 1. Find shorter length.\n15. If 34% of a sum is 45, find ratio of portion to total.\n16. Order by size: 2 : 3, 4 : 7, 5 : 9.\n17. Simplify 12 : 15 : 18.\n18. Ice cream 2,40. Express cost of 16 ice creams as ratio to 40.\n19. Pencils: buy 0,65, sell 0,80. Find ratio cost : profit.\n20. Blanket 40 reduced to 35,20. Find ratio original : new.\n21. Find HCF of 36, 54, 60.\n22. Simplify 0,125 : 0,025.\n23. Express 42 cm : 1,05 m as simplified ratio.\n24. College 301 females, 344 males. Express as ratio in lowest terms.\n25. Find value of one part if 14,95 is shared in ratio 2 : 3.\n\n**Exam-Style Test**\n\n**Question 1** (a) Simplify 0,65 : 13. (b) Sum shared between A and B in ratio 7 : 8. Total 645. Calculate A\'s share. (c) Show that 2 : 3 is greater than 4 : 7.\n\n**Question 2** Sum shared between Jane and Sekai in ratio 13 : 7. (a) Total 40. Calculate Jane\'s share. (b) If Sekai receives 14 instead, calculate new total. (c) Express Sekai\'s 14 as ratio of a 50 bill.\n\n**Question 3** (a) Simplify $\\frac{1}{2} : \\frac{3}{4} : \\frac{5}{6}$. (b) Map scale 1 : 50 000; road 7,24 cm on map. Calculate actual distance in km. (c) Vendor reduces 40 by 12%. Find ratio new price : original.\n\n**Mixed Revision Answers:** 1. 9 : 7 2. $\\frac{19}{40}$ 3. 45, 135 4. HCF 108; ratio 3 : 4 5. 1 : 8 6. 11 : 18 7. 17 : 260 8. 480, 2 720 9. $x = 35$ 10. 5 : 9 smaller 11. 17 : 50 12. 3 : 20 13. 22 : 65 14. 1,31 m 15. 1 : 4 16. 5 : 9, 4 : 7, 2 : 3 17. 4 : 5 : 6 18. 24 : 25 19. 13 : 3 20. 25 : 22 21. HCF 6 22. 5 : 1 23. 2 : 5 24. 7 : 8 25. 2,99\n\n**Exam Test Solutions:** 1(a) 1 : 20 1(b) A = 301 1(c) 0,666 > 0,571 2(a) Jane = 26 2(b) Total = 40 2(c) 7 : 25 3(a) 6 : 9 : 10 3(b) 3,62 km 3(c) 22 : 25',
    },
  ],
  key_points: [
    'Ratio compares quantities of the same unit; notation $a : b$ or $\\frac{a}{b}$. Order of terms is critical.',
    'Part-to-part (e.g. males : females) vs part-to-whole (e.g. males : total).',
    'Simplifying: whole numbers $\\to$ divide by HCF; decimals $\\to$ multiply to whole numbers first; fractions $\\to$ reciprocal method.',
    'Sharing method: add ratio parts, divide total by parts, multiply one part by each term.',
    'Equivalent ratios: same proportional relationship; use scale factor to find missing terms.',
    'To compare ratios: convert to decimals or common denominator.',
  ],
  exam_tips: [
    'Order of terms matters: 2 : 3 is not the same as 3 : 2. Reversing loses marks.',
    'Always simplify ratios to lowest terms unless the question specifies otherwise.',
    'When sharing, verify that the sum of shares equals the original total.',
    'Convert to same units before forming a ratio (e.g. m to cm).',
  ],
  visual_descriptions: [
    'Part-to-part vs part-to-whole ratio diagrams.',
    'Sharing method: total parts, one part, multiply.',
    'Equivalent ratio scaling with scale factor.',
  ],
};

const largeAndSmallNumbersForm1Notes: MathTopicNotes = {
  topic: 'Large and Small Numbers',
  subject: 'Mathematics',
  grade_level: 'Form 1',
  summary:
    'Mastering the scale and representation of numbers is a strategic gateway to mathematical literacy in ZIMSEC. Large numbers extend to millions and billions; small numbers occupy decimal positions (tenths, hundredths, thousandths). This topic covers place value, standard form ($a \\times 10^n$ where $1 \\le a < 10$), operations with standard form, comparing and ordering, rounding, and real-life applications. Use the decimal comma (e.g. 0,475) as per ZIMSEC standard.',
  sections: [
    {
      title: '1. Introduction to Large and Small Numbers',
      content:
        'Understanding the shift between vast quantities (e.g. national populations) and microscopic measurements (e.g. mass of a chemical sample) is essential. Place value and standard form act as foundational skills for scientific and financial calculations.\n\n**Large Numbers**: Digits extending significantly to the left of the decimal comma, occupying positions like millions or billions.\n\n**Small Numbers**: Values deep to the right of the decimal comma (tenths, hundredths, thousandths), significantly less than one.',
    },
    {
      title: '2. Place Value and Reading Large Numbers',
      content:
        'Place value serves as the anchor for all arithmetic operations. For numbers in millions and billions, a firm grasp of positional value prevents zero-counting errors.\n\n**Place Value Table (examples):**\n\n- 708 000: 7 hundred thousands, 0 ten thousands, 8 thousands, 0 hundreds, 0 tens, 0 units\n- 37 000: 0 hundred thousands, 3 ten thousands, 7 thousands, 0 hundreds, 0 tens, 0 units\n\n**Worked Examples:**\n\n1. Write 708 000 in words: **Seven hundred and eight thousand**\n2. Write "Thirty-seven thousand" in figures: **37 000**\n3. Write 650 in words: **Six hundred and fifty**\n4. Write "Nineteen thousand, six hundred" in figures: **19 600**\n5. Write 5 000 in words: **Five thousand**\n6. Write "Two hundred and eighteen" in figures: **218**\n7. Write 1 269 in words: **One thousand, two hundred and sixty-nine**\n8. Write "Four million, two hundred thousand" in figures: **4 200 000**\n\n**Expanded Notation:**\n\n$37\\ 000 = (3 \\times 10\\ 000) + (7 \\times 1\\ 000)$\n\n**COMMON ERROR:** Writing 700 008 instead of 708 000 for "Seven hundred and eight thousand."\n\n**EXAM TIP:** Use small spaces to group digits in threes (e.g. 708 000); the comma is the decimal marker in the Zimbabwean syllabus.\n\n**Practice Exercise A:**\n1. Write 37 000 in words.\n2. Write "Five thousand" in figures.\n3. Write 708 000 in expanded notation.\n4. Write "Six hundred and fifty" in figures.\n5. Identify the place value of 7 in 37 000.',
    },
    {
      title: '3. Standard Form (Scientific Notation)',
      content:
        'Standard form provides an efficient way to represent extreme values: $a \\times 10^n$ where $1 \\le a < 10$.\n\n**Large Numbers to Standard Form:**\n\n1. 5 000: $5 \\times 10^3$\n2. 708 000: $7{,}08 \\times 10^5$\n3. 650: $6{,}5 \\times 10^2$\n4. 37 000: $3{,}7 \\times 10^4$\n\n**Small Numbers to Standard Form:**\n\nMoving the decimal comma to the right uses a negative index. $10^{-3}$ represents division by 1 000.\n\n5. 0,0062: $6{,}2 \\times 10^{-3}$\n6. 0,00309: $3{,}09 \\times 10^{-3}$\n7. 0,526: $5{,}26 \\times 10^{-1}$\n8. 0,000045: $4{,}5 \\times 10^{-5}$\n\n**COMMON ERROR:** Writing $12 \\times 10^3$ instead of $1{,}2 \\times 10^4$. The coefficient $a$ MUST be less than 10.\n\n**EXAM TIP:** "Express in standard form" is a specific command. Leaving an answer in ordinary form loses marks.\n\n**Practice Exercise B:**\n1. Express 0,0062 in standard form.\n2. Express 708 000 in standard form.\n3. Express 0,526 in standard form.\n4. Express 5 000 in standard form.\n5. Express 0,00309 in standard form.',
    },
    {
      title: '4. Operations with Standard Form',
      content:
        'Standard form simplifies multiplication and division by applying index laws to the powers of 10.\n\n**Multiplication Examples:**\n\n1. $(6 \\times 10^{-4}) \\times (2 \\times 10^{-2})$: $(6 \\times 2) \\times 10^{-6} = 12 \\times 10^{-6} = 1{,}2 \\times 10^{-5}$\n2. $(1{,}5 \\times 10^{-1}) \\times (3 \\times 10^{-4}) = 4{,}5 \\times 10^{-5}$\n3. $(2 \\times 10^3) \\times (4 \\times 10^5) = 8 \\times 10^8$\n4. $(5 \\times 10^{-2}) \\times (2{,}1 \\times 10^6) = 10{,}5 \\times 10^4 = 1{,}05 \\times 10^5$\n\n**Division Examples:**\n\n5. $(4{,}4 \\times 10^6) \\div (2 \\times 10^2) = 2{,}2 \\times 10^4$\n6. $(3{,}5 \\times 10^7) \\div (5 \\times 10^4) = 0{,}7 \\times 10^3 = 7 \\times 10^2$\n7. $(9{,}6 \\times 10^5) \\div (3 \\times 10^3) = 3{,}2 \\times 10^2$\n8. $(1{,}2 \\times 10^9) \\div (3 \\times 10^5) = 0{,}4 \\times 10^4 = 4 \\times 10^3$\n\n**Addition/Subtraction:** For Form 1, convert to ordinary form first. Example: $0{,}34 - 5{,}2 + 62{,}7 = 63{,}04 - 5{,}2 = 57{,}84$.\n\n**BODMAS Example:** $0{,}22 + 3{,}21 \\times 5{,}2$. Multiplication first: $3{,}21 \\times 5{,}2 = 16{,}692$. Then $0{,}22 + 16{,}692 = 16{,}912$.\n\n**Practice Exercise C:**\n1. $(9{,}6 \\times 10^5) \\div (3 \\times 10^3)$\n2. $(1{,}2 \\times 10^9) \\div (3 \\times 10^5)$\n3. $(5 \\times 10^{-1}) \\times (3 \\times 10^{-4})$\n4. Evaluate $0{,}22 + (3{,}21 \\times 5{,}2)$\n5. $(4{,}4 \\times 10^6) \\div (2 \\times 10^2)$',
      worked_examples: [
        {
          question: 'Evaluate $(4{,}4 \\times 10^6) \\div (2 \\times 10^2)$',
          steps: ['Numbers: $4{,}4 \\div 2 = 2{,}2$', 'Powers: $10^6 \\div 10^2 = 10^4$', 'Combine: $2{,}2 \\times 10^4$'],
          final_answer: '$2{,}2 \\times 10^4$',
        },
        {
          question: 'Evaluate $0{,}22 + 3{,}21 \\times 5{,}2$ (BODMAS)',
          steps: ['Multiplication first: $3{,}21 \\times 5{,}2 = 16{,}692$', 'Addition: $0{,}22 + 16{,}692 = 16{,}912$'],
          final_answer: '16,912',
        },
      ],
    },
    {
      title: '5. Comparing and Ordering Large and Small Numbers',
      content:
        'The power of 10 is the primary decider of magnitude.\n\n**Step-by-Step Guide:**\n1. Convert all numbers to standard form.\n2. Compare the powers of 10. Larger positive index = larger number. More negative index = smaller number.\n3. If indices are identical, compare the coefficients.\n\n**Worked Examples (Smallest First):**\n\n1. 0,67; 0,57; 0,56 → **0,56; 0,57; 0,67**\n2. $4 \\times 10^3$; $3{,}2 \\times 10^2$; $3{,}2 \\times 10^3$ → **$3{,}2 \\times 10^2$; $3{,}2 \\times 10^3$; $4 \\times 10^3$**\n3. $6{,}2 \\times 10^{-3}$; $3{,}09 \\times 10^{-3}$; $5{,}26 \\times 10^{-1}$ → **$3{,}09 \\times 10^{-3}$; $6{,}2 \\times 10^{-3}$; $5{,}26 \\times 10^{-1}$**\n4. $\\frac{2}{3}$, $\\frac{4}{7}$, $\\frac{5}{9}$: Convert to decimals 0,67; 0,57; 0,56 → **$\\frac{5}{9}$; $\\frac{4}{7}$; $\\frac{2}{3}$**\n5. 0,125; 0,65; 0,22 → **0,125; 0,22; 0,65**\n6. $1{,}5 \\times 10^{-4}$; $1{,}5 \\times 10^{-5}$; $1{,}2 \\times 10^{-4}$ → **$1{,}5 \\times 10^{-5}$; $1{,}2 \\times 10^{-4}$; $1{,}5 \\times 10^{-4}$**\n\n**Practice Exercise D:**\n1. List 0,125; 0,65; 0,22 in ascending order.\n2. List $6 \\times 10^{-4}$; $2 \\times 10^{-2}$; $1{,}5 \\times 10^{-1}$ smallest first.',
    },
    {
      title: '6. Rounding and Significant Figures',
      content:
        '**Definitions:**\n\n- **s.f.**: Digits that contribute to precision. Leading zeros in decimals are NOT significant.\n- **d.p.**: Number of digits after the decimal comma.\n\n**Worked Examples:**\n\n1. Round 1 269 to 3 s.f.: **1 270**\n2. Round 0,006287 to 2 s.f.: **0,0063**\n3. Round 0,006287 to 2 d.p.: **0,01**\n4. Round 3,017 to 3 s.f.: **3,02**\n5. Round 0,032016 to 3 s.f.: **0,0320**\n6. Round 3 269 to 2 s.f.: **3 300**\n7. Round 0,065037 to 2 s.f.: **0,065**\n8. Round 13,6731 to 3 d.p.: **13,673**\n\n**Significance of Zero:**\n- 8,04 g: Zero between non-zeros (3 s.f.)\n- 28 000 km: Trailing zeros placeholders (2 s.f.)\n- 0,029 cm: Leading zeros placeholders (2 s.f.)\n\n**Practice Exercise E:**\n1. Round 3 269 to 2 s.f.\n2. Express 0,0486 correct to 3 d.p.\n3. State significant figures in 8,04 g.\n4. Round 0,0062 to 1 s.f.\n5. Round 13,6731 to 3 d.p.',
    },
    {
      title: '7. Real-Life Applications',
      content:
        '**Example 1 (Finance):** TV at 3 200; 15% deposit. Deposit = $\\frac{15}{100} \\times 3\\ 200 = 480$.\n\n**Example 2 (Measurements):** Pack 10,98 kg; each book 54,9 g. $10\\ 980 \\div 54{,}9 = 200$ books.\n\n**Example 3 (Economics):** Blanket 40 reduced by 12%. Reduction = 4,80; New price = 35,20.\n\n**Example 4 (Trade):** Pencils at 0,65 each for 14,95. $14{,}95 \\div 0{,}65 = 23$ pencils.\n\n**Example 5 (Simple Interest):** 1 500 for 10 years at 6,5% p.a. $I = \\frac{PRT}{100} = \\frac{1500 \\times 6{,}5 \\times 10}{100} = 975$.\n\n**Example 6 (Materials):** Log $46\\frac{2}{3}$ m; pieces $6\\frac{2}{3}$ m. $\\frac{140}{3} \\div \\frac{20}{3} = 7$ pieces.\n\n**Practice Exercise F:**\n1. Calculate 6% of 5 450.\n2. Jane buys 16 ice creams at 2,40 each. Find the change from 40.\n3. Total profit if 23 pencils bought at 0,65 are sold at 0,80.',
    },
    {
      title: '8. Final Assessment and Memo',
      content:
        '**Mixed Revision Exercise:**\n1. Write 708 000 in words.\n2. Express 0,00309 in standard form.\n3. $(4{,}4 \\times 10^6) \\div (2 \\times 10^2)$\n4. 1 269 to 3 s.f.\n5. $0{,}22 + 3{,}21 \\times 5{,}2$\n6. 0,006287 to 3 s.f.\n7. $0{,}34 - 5{,}2 + 62{,}7$\n8. Write "Thirty-seven thousand" in figures.\n9. $(3{,}5 \\times 10^7) \\div (5 \\times 10^4)$ in standard form.\n10. Significant figures in 28 000 km.\n11. Express 650 in standard form.\n12. Order (smallest first): 0,67; 0,57; 0,56.\n13. $\\frac{2}{3}$ of 3,93 m.\n14. $\\frac{1}{8}$ of 7,24 km in metres.\n15. 13,6731 to 3 d.p.\n16. $(6 \\times 10^{-4}) \\times (2 \\times 10^{-2})$ in standard form.\n17. 0,065037 to 2 s.f.\n18. 0,0062 to 1 s.f.\n19. HCF of 216 and 168.\n20. Express 0,0062 in standard form.\n21. Express 0,526 in standard form.\n22. 0,006287 to 2 d.p.\n23. 3 269 to 2 s.f.\n24. $(1{,}2 \\times 10^9) \\div (3 \\times 10^5)$\n25. 15% of 3 200.\n\n**Exam-Style Structured Test:**\n1. Express 708 000 in standard form.\n2. Evaluate $(4{,}4 \\times 10^6) \\div (2 \\times 10^2)$.\n3. 0,006287 correct to 3 s.f.\n4. Product of 0,25 and 55.\n5. How much is Q4 more than 12?\n6. Novel 504 pages; 308 read. What fraction is left?\n7. Write 37 000 in standard form.\n8. Evaluate $0{,}65 \\div 13 \\times 0{,}02$.\n9. Round 1 269 to 1 s.f.\n10. Pack 10,98 kg; each book 54,9 g. Find number of books.\n11. List $\\frac{2}{3}$, $\\frac{4}{7}$, $\\frac{5}{9}$ in ascending order.\n12. Price increase from 320 to 335 as percentage.\n\n**Mixed Revision Memo (selected):** 1. Seven hundred and eight thousand. 2. $3{,}09 \\times 10^{-3}$. 3. $2{,}2 \\times 10^4$. 4. 1 270. 5. 16,912. 6. 0,00629. 7. 57,84. 8. 37 000. 9. $7 \\times 10^2$. 10. 2 s.f. 11. $6{,}5 \\times 10^2$. 12. 0,56; 0,57; 0,67. 13. 2,62 m. 14. 905 m. 15. 13,673. 16. $1{,}2 \\times 10^{-5}$. 17. 0,065. 18. 0,006. 19. HCF 24. 20. $6{,}2 \\times 10^{-3}$. 21. $5{,}26 \\times 10^{-1}$. 22. 0,01. 23. 3 300. 24. $4 \\times 10^3$. 25. 480.\n\n**Exam Test Memo:** 1. $7{,}08 \\times 10^5$. 2. $2{,}2 \\times 10^4$. 3. 0,00629. 4. 13,75. 5. 1,75. 6. $\\frac{7}{18}$. 7. $3{,}7 \\times 10^4$. 8. 0,001. 9. 1 000. 10. 200. 11. $\\frac{5}{9}$; $\\frac{4}{7}$; $\\frac{2}{3}$. 12. 4,70%',
    },
  ],
  key_points: [
    'Place value anchors all arithmetic; group digits in threes with spaces (comma = decimal marker in ZIMSEC).',
    'Standard form: $a \\times 10^n$ where $1 \\le a < 10$. Moving comma right $\\to$ negative index; left $\\to$ positive.',
    'Multiplication/division: group numbers and powers separately; adjust coefficient to standard form if needed.',
    'For addition/subtraction in standard form, convert to ordinary form first (Form 1).',
    'Comparing: compare powers of 10 first; if equal, compare coefficients.',
    's.f.: leading zeros not significant; trapped zeros significant; trailing zeros in integers are placeholders.',
  ],
  exam_tips: [
    'Do not write $12 \\times 10^3$; use $1{,}2 \\times 10^4$. Coefficient must be $1 \\le a < 10$.',
    '"Express in standard form" requires standard form—ordinary form loses marks.',
    'Apply BODMAS when mixed operations appear.',
    'Use small spaces (not commas) to group digits in large numbers.',
  ],
  visual_descriptions: [
    'Place value table for 708 000 and 37 000.',
    'Standard form: $a \\times 10^n$ with positive/negative index rules.',
    'Index laws for multiplication and division of powers of 10.',
  ],
};

const numberBasesForm1Notes: MathTopicNotes = {
  topic: 'Number Bases',
  subject: 'Mathematics',
  grade_level: 'Form 1',
  summary:
    'A base is the number of unique digits used in a counting system. The Denary System (Base 10) uses digits 0–9. Alternative systems—Binary (2), Quinary (5), etc.—are vital to logic and computation. This topic covers base notation, converting to and from Base 10 using expanded form and repeated division, addition, subtraction, and multiplication in different bases.',
  sections: [
    {
      title: '1. Introduction to Number Bases and the Denary System',
      content:
        'A **base** is the number of unique digits available in a system of counting. We use a subscript to distinguish bases (e.g. $101_2$). A fundamental rule: any digit must be strictly less than the base.\n\n**Allowed Digits by Base:**\n\n- Base 2 (Binary): 0, 1\n- Base 3 (Ternary): 0, 1, 2\n- Base 4 (Quaternary): 0, 1, 2, 3\n- Base 5 (Quinary): 0, 1, 2, 3, 4\n- Base 8 (Octal): 0, 1, 2, 3, 4, 5, 6, 7\n- Base 10 (Denary): 0, 1, 2, 3, 4, 5, 6, 7, 8, 9\n\n**Place value** is the engine of every numerical system. The position of a digit dictates its weight; moving right to left, each position increases by a factor of the base.\n\n**Base Notation Examples:** $101_2$, $110_2$, $23_5$, $41_5$, $212_5$, $100111_2$, $143_5$, $10110_2$',
    },
    {
      title: '2. Converting from Other Bases to Base Ten (Expanded Form)',
      content:
        '**Method:** Each digit is multiplied by the base raised to the power of its position (starting 0 on the right).\n\n**Model 1:** Convert $2103_5$ to Base 10\n$$(2 \\times 5^3) + (1 \\times 5^2) + (0 \\times 5^1) + (3 \\times 5^0) = 250 + 25 + 0 + 3 = 278$$\n$\\therefore 2103_5 = 278_{10}$\n\n**Model 2:** Convert $10110_2$ to Base 10\n$$(1 \\times 2^4) + (0 \\times 2^3) + (1 \\times 2^2) + (1 \\times 2^1) + (0 \\times 2^0) = 16 + 4 + 2 + 0 = 22$$\n$\\therefore 10110_2 = 22_{10}$\n\n**Worked Examples:**\n- $143_5 = 25 + 20 + 3 = 48_{10}$\n- $101_2 = 4 + 0 + 1 = 5_{10}$\n- $11_2 = 3_{10}$; $212_5 = 57_{10}$; $111_2 = 7_{10}$; $1011_2 = 11_{10}$; $41_5 = 21_{10}$; $110_2 = 6_{10}$\n\n**COMMON ERROR:** $5^0 = 1$ (and $2^0 = 1$). Any non-zero base to power 0 is 1.\n\n**Practice Exercise 1:** Convert to denary: 1. $100_2$ 2. $32_5$ 3. $1111_2$ 4. $44_5$ 5. $1010_2$',
      worked_examples: [
        {
          question: 'Convert $2103_5$ to Base 10',
          steps: ['Place values: $5^3, 5^2, 5^1, 5^0$', 'Expand: $(2 \\times 125) + (1 \\times 25) + (0 \\times 5) + (3 \\times 1)$', 'Sum: 250 + 25 + 0 + 3 = 278'],
          final_answer: '$278_{10}$',
        },
        {
          question: 'Convert $10110_2$ to Base 10',
          steps: ['Place values: $2^4, 2^3, 2^2, 2^1, 2^0$', 'Expand: $(1 \\times 16) + (0 \\times 8) + (1 \\times 4) + (1 \\times 2) + (0 \\times 1)$', 'Sum: 16 + 4 + 2 + 0 = 22'],
          final_answer: '$22_{10}$',
        },
      ],
    },
    {
      title: '3. Converting from Base Ten to Another Base (Repeated Division)',
      content:
        '**Method:** Divide the denary number by the target base. The remainders (read from bottom to top) give the digits of the new base.\n\n**Model:** Convert $57_{10}$ to Base 5\n\nDivide 57 by 5: quotient 11, remainder 2; $11 \\div 5$: quotient 2, remainder 1; $2 \\div 5$: quotient 0, remainder 2. Read remainders bottom-up: **212**. So $57_{10} = 212_5$.\n\n**Worked Examples:**\n- $39_{10} \\to 100111_2$\n- $22_{10} \\to 10110_2$\n- $48_{10} \\to 143_5$\n- $11_{10} \\to 1011_2$\n- $7_{10} \\to 111_2$; $5_{10} \\to 101_2$; $21_{10} \\to 41_5$; $6_{10} \\to 110_2$\n\n**COMMON ERROR:** Reading remainders top to bottom reverses the place values. Always read from the final zero upward.\n\n**Practice Exercise 2:** Convert to stated base: 1. $57_{10}$ to base 5 2. $11_{10}$ to binary',
    },
    {
      title: '4. Addition in Different Bases',
      content:
        '**Rule:** When the sum of a column reaches or exceeds the base, divide by the base: write the remainder, carry the quotient.\n\n**Base 2 logic:** $1 + 1 = 2$; $2 \\div 2 = 1$ r $0$. Write 0, carry 1.\n\n**Worked Examples:**\n- $1011_2 + 111_2 = 10010_2$\n- $101_2 + 11_2 = 1000_2$\n- $111_2 + 111_2 = 1110_2$\n- $1101_2 + 101_2 = 10010_2$\n- $212_5 + 143_5 = 410_5$\n- $41_5 + 32_5 = 123_5$\n- $101_2 + 101_2 = 1010_2$\n- $44_5 + 11_5 = 110_5$',
    },
    {
      title: '5. Subtraction in Different Bases',
      content:
        '**Borrowing:** When you borrow 1 from the next column, it becomes the base value. In Base 5, a borrowed 1 = 5 units. In Base 2, it = 2 units.\n\n**Worked Examples:**\n- $110_2 - 11_2 = 11_2$\n- $41_5 - 23_5 = 13_5$ (borrow: 4 becomes 3, 1 becomes 6; $6 - 3 = 3$, $3 - 2 = 1$)\n- $100_2 - 1_2 = 11_2$\n- $212_5 - 43_5 = 114_5$\n- $1011_2 - 111_2 = 100_2$\n- $143_5 - 14_5 = 124_5$',
    },
    {
      title: '6. Multiplication in Base 2 (Introductory)',
      content:
        'Binary multiplication is simplest: $1 \\times 1 = 1$ and $1 \\times 0 = 0$.\n\n**Worked Examples:**\n- $101_2 \\times 11_2$: $101 + 1010 = 1111_2$\n- $11_2 \\times 11_2 = 1001_2$\n- $110_2 \\times 10_2 = 1100_2$\n- $101_2 \\times 10_2 = 1010_2$\n- $111_2 \\times 11_2 = 10101_2$\n- $1001_2 \\times 10_2 = 10010_2$',
      worked_examples: [
        {
          question: 'Multiply $101_2$ by $11_2$',
          steps: ['$101_2 \\times 1 = 101_2$', '$101_2 \\times 10_2 = 1010_2$ (shift left)', 'Add: $101 + 1010 = 1111_2$'],
          final_answer: '$1111_2$',
        },
      ],
    },
    {
      title: '7. Word Problems Involving Number Bases',
      content:
        '**4-Step Breakdown:** 1. Identify operation. 2. Perform base operation. 3. Convert to denary if required. 4. State answer in context.\n\n**Problem 1:** Farmer has $43_5$ oranges; buys $12_5$ more. Total in denary?\n- Addition: $43_5 + 12_5 = 110_5$\n- Convert: $110_5 = 25 + 5 + 0 = 30_{10}$\n- **Answer: 30 oranges**\n\n**Problem 2:** Student has $1011_2$ sweets; gives away $111_2$. Remain in denary?\n- Subtraction: $1011_2 - 111_2 = 100_2$\n- Convert: $100_2 = 4_{10}$\n- **Answer: 4 sweets**',
    },
    {
      title: '8. Mixed Revision Exercise',
      content:
        '1. Define "base" in a number system.\n2. List digits allowed in Base 4.\n3. Convert $10110_2$ to denary.\n4. Convert $39_{10}$ to binary.\n5. Calculate $1011_2 + 111_2$.\n6. Calculate $212_5 + 143_5$.\n7. Convert $2103_5$ to denary.\n8. Express $57_{10}$ in Base 5.\n9. Calculate $110_2 - 11_2$.\n10. Calculate $41_5 - 23_5$.\n11. Multiply $101_2$ by $11_2$.\n12. State $5^0$.\n13. Evaluate $1 \\times 5^2 + 4 \\times 5^1 + 3 \\times 5^0$ in denary.\n14. Convert $11_{10}$ to binary.\n15. Calculate $101_2 + 11_2$.\n16. Calculate $44_5 + 11_5$.\n17. Express $143_5$ beads in denary.\n18. Convert $111_2$ to Base 10.\n19. Convert $22_{10}$ to Base 2.\n20. Calculate $1011_2 - 111_2$.\n21. Find $41_5 + 32_5$ in quinary.\n22. Product of $11_2$ and $11_2$.\n23. Convert $100111_2$ to denary.\n24. Express $48_{10}$ in quinary.\n25. Calculate $1000_2 - 1_2$.\n26. Subscript for binary?\n27. Hence $1111_2$ in denary.\n28. Calculate $23_5 + 12_5$.\n29. Convert $7_{10}$ to binary.\n30. Convert $21_{10}$ to quinary.',
    },
    {
      title: '9. Exam-Style Structured Test',
      content:
        '1. Write down the digits used in the binary system. [1]\n2. Convert $10110_2$ to denary. [2]\n3. Express $57_{10}$ in Base 5. [2]\n4. Calculate $1011_2 + 111_2$ in base 2. [2]\n5. Subtract $23_5$ from $41_5$. [2]\n6. Board $11_2$ m by $111_2$ m. Calculate area in denary. [3]\n7. $x = 2103_5$. Express $x$ in Base 10. [2]\n8. Express $39_{10}$ in binary. [2]\n9. Find $111_2 + 101_2$ in base 2. [2]\n10. Solve $212_5 + 143_5$ in base 5. [2]\n11. Convert $143_5$ to Base 10. [2]\n12. Calculate $101_2 \\times 11_2$ in binary. [2]\n13. Girl has $60_{10}$ marbles; gives away $143_5$. Remaining in denary? [3]\n14. Hence $1111_2$ in denary. [2]\n15. Is $51_5$ valid? Explain. [2]',
    },
    {
      title: '10. Full Memo and Worked Solutions',
      content:
        '**Revision Memo (selected):** 1. Base = number of unique digits. 2. Base 4: {0, 1, 2, 3}. 3. $10110_2 = 22_{10}$. 4. $39_{10} = 100111_2$. 5. $1011_2 + 111_2 = 10010_2$. 6. $212_5 + 143_5 = 410_5$. 7. $2103_5 = 278_{10}$. 8. $57_{10} = 212_5$. 9. $110_2 - 11_2 = 11_2$. 10. $41_5 - 23_5 = 13_5$. 11. $101_2 \\times 11_2 = 1111_2$. 12. $5^0 = 1$. 13. $1 \\times 25 + 4 \\times 5 + 3 \\times 1 = 48_{10}$. 14. $11_{10} = 1011_2$. 15. $101_2 + 11_2 = 1000_2$. 16. $44_5 + 11_5 = 110_5$. 17. $143_5 = 48$ beads. 18. $111_2 = 7$. 19. $22_{10} = 10110_2$. 20. $1011_2 - 111_2 = 100_2$. 21. $41_5 + 32_5 = 123_5$. 22. $11_2 \\times 11_2 = 1001_2$. 23. $100111_2 = 39$. 24. $48_{10} = 143_5$. 25. $1000_2 - 1_2 = 111_2$. 26. Subscript 2. 27. $1111_2 = 15_{10}$. 28. $23_5 + 12_5 = 40_5$. 29. $7_{10} = 111_2$. 30. $21_{10} = 41_5$.\n\n**Exam Memo (selected):** 1. {0, 1}. 2. $22_{10}$. 3. $212_5$. 4. $10010_2$. 5. $13_5$. 6. $11_2 = 3_{10}$, $111_2 = 7_{10}$; area $3 \\times 7 = 21$ m². 7. $278_{10}$. 8. $100111_2$. 9. $1100_2$. 10. $410_5$. 11. $48_{10}$. 12. $1111_2$. 13. $143_5 = 48$; $60 - 48 = 12$ marbles. 14. $15_{10}$. 15. **Invalid.** Digit 5 cannot be used in Base 5; allowed digits must be $< 5$.',
    },
  ],
  key_points: [
    'Base = number of unique digits; subscript indicates base (e.g. $101_2$).',
    'Any digit must be $<$ the base.',
    'To Base 10: expanded form—multiply each digit by base^position, sum.',
    'From Base 10: repeated division by target base; read remainders bottom to top.',
    'Addition: when sum $\\ge$ base, write remainder, carry quotient.',
    'Subtraction: borrowed 1 = base value in that column.',
    'Binary multiplication: $1 \\times 1 = 1$, $1 \\times 0 = 0$.',
  ],
  exam_tips: [
    '$5^0 = 1$ and $2^0 = 1$. Base to power 0 is always 1.',
    'Read remainders from bottom to top—top to bottom reverses place values.',
    'Digit 5 is invalid in Base 5; allowed digits are 0, 1, 2, 3, 4.',
    'For word problems: identify operation, perform in base, convert if needed.',
  ],
  visual_descriptions: [
    'Allowed digits table for bases 2, 3, 4, 5, 8, 10.',
    'Expanded form: digit $\\times$ base$^{\\text{position}}$.',
    'Repeated division with remainders read upward.',
  ],
};

const setsAndSetNotationForm1Notes: MathTopicNotes = {
  topic: 'Sets and Set Notation',
  subject: 'Mathematics',
  grade_level: 'Form 1',
  summary:
    'Sets are the fundamental building blocks of mathematical organization in the ZIMSEC curriculum. A set is a well-defined collection of objects (elements). This topic covers membership ($\\in$, $\\notin$), finite/infinite/empty sets, listing and set-builder notation, types of sets (equal, equivalent, subset, disjoint, overlapping), operations (union $\\cup$, intersection $\\cap$, complement $A\'$), Venn diagrams, cardinality, and the addition formula.',
  sections: [
    {
      title: '1. Introduction to the Concept of Sets',
      content:
        'A **set** is a well-defined collection of objects. Objects are called **elements** or **members**.\n\n**Notation:**\n- $\\in$ (is a member of)\n- $\\notin$ (is not a member of)\n- Sets enclosed in curly brackets $\\{\\}$\n\n**Worked Examples:**\n\n1. Primes between 1 and 15: $A = \\{2, 3, 5, 7, 11, 13\\}$\n2. Factors of 36: $B = \\{1, 2, 3, 4, 6, 9, 12, 18, 36\\}$\n3. Perfect squares between 2 and 20: $C = \\{4, 9, 16\\}$\n4. If $S = \\{2, 4, 6, 8\\}$, then $4 \\in S$ (Yes)\n5. If $P = \\{3, 5, 7\\}$, then $2 \\notin P$\n6. Even numbers $2 < x < 10$: $D = \\{4, 6, 8\\}$\n7. Vowels in "Mathematics": $E = \\{a, e, i\\}$\n8. Integers between $-2$ and $2$: $F = \\{-1, 0, 1\\}$\n\n**Well-defined:** "Tall students" is subjective; "students over 1,5 m" is a mathematical set.',
      worked_examples: [
        {
          question: 'List elements of the set of factors of 36',
          steps: ['Find all integers that divide 36 exactly', '1, 2, 3, 4, 6, 9, 12, 18, 36'],
          final_answer: '$B = \\{1, 2, 3, 4, 6, 9, 12, 18, 36\\}$',
        },
        {
          question: 'If $P = \\{3, 5, 7\\}$, is $2 \\in P$?',
          steps: ['Check if 2 appears in the set', 'P contains 3, 5, 7 only'],
          final_answer: '$2 \\notin P$',
        },
      ],
    },
    {
      title: '2. Finite, Infinite, and Special Sets',
      content:
        '**Finite Set:** Counting ends (e.g. factors of 36).\n\n**Infinite Set:** Elements continue without end (e.g. all even numbers).\n\n**Empty (Null) Set:** No elements; denoted $\\emptyset$ or $\\{\\}$.\n\n**Universal Set ($\\xi$):** All elements under consideration (e.g. $\\xi = \\{2, 3, \\ldots, 16\\}$).\n\n**Worked Examples:**\n- Factors of 36: **Finite**\n- Multiples of 5: **Infinite** ($\\{5, 10, 15, \\ldots\\}$)\n- Months with 32 days: $P = \\emptyset$\n- $\\xi = \\{2, 3, \\ldots, 16\\}$ for primes and perfect squares in that range\n- $\\{0\\}$: **Not empty**—has one element\n- All prime numbers: **Infinite**\n\n**Practice Exercise 1:** Classify as finite, infinite, or empty: 1. Whole numbers $< 0$ 2. Even numbers between 10 and 20 inclusive 3. Points on a line segment 4. Prime factors of 70 5. Triangles with four sides',
    },
    {
      title: '3. Ways of Describing Sets',
      content:
        '**Listing Method (Roster):** Elements listed inside $\\{\\}$.\n\n**Set-builder Notation:** $\\{x : x \\ldots\\}$—colon means "such that."\n\n**Worked Examples:**\n\n1. $A = \\{4, 9, 16\\}$ → $A = \\{x : x \\text{ is a perfect square, } 2 < x < 20\\}$\n2. $B = \\{x : x \\text{ is a factor of 36}\\}$ → $\\{1, 2, 3, 4, 6, 9, 12, 18, 36\\}$\n3. $\\{x : x \\text{ prime, } x < 10\\}$ → $\\{2, 3, 5, 7\\}$\n4. Even integers between 1 and 7: $\\{x : x \\text{ even integer, } 1 < x < 7\\}$\n5. $P = \\{x : 2x + 5 \\geq 4,\\ x \\in \\mathbb{Z},\\ x < 5\\}$: $2x \\geq -1 \\Rightarrow x \\geq -0{,}5$; integers: $P = \\{0, 1, 2, 3, 4\\}$\n6. $\\{1, 2, 3, 6, 7, 14, 21, 42\\}$ → $\\{x : x \\text{ is a factor of 42}\\}$\n7. Vowels in "College": $\\{o, e\\}$\n8. $\\{x : 9 < x < 22,\\ x \\text{ prime}\\}$ → $\\{11, 13, 17, 19\\}$\n\n**COMMON ERROR:** Use $\\{x : \\ldots\\}$ not square or round brackets. Only $\\{\\}$ for sets.',
    },
    {
      title: '4. Types of Sets and Relationships',
      content:
        '**Equal Sets ($=$):** Exact same elements.\n\n**Equivalent Sets ($\\leftrightarrow$):** Same number of elements, $n(A) = n(B)$.\n\n**Subset ($A \\subseteq B$):** Every element of $A$ is in $B$.\n\n**Proper Subset ($A \\subset B$):** $A \\subseteq B$ but $A \\neq B$.\n\n**Disjoint:** No common elements ($A \\cap B = \\emptyset$).\n\n**Overlapping:** At least one common element.\n\n**Worked Examples:**\n- $A = \\{4, 9, 16\\}$, $B = \\{1, 4, 9, 16\\}$: $A \\neq B$\n- $P = \\{2, 3, 5\\}$, $Q = \\{2, 3, 5, 7, 11\\}$: $P \\subseteq Q$\n- Primes and perfect squares: **Disjoint**\n- $C = \\{2, 4, 6\\}$, $D = \\{a, b, c\\}$: **Equivalent** ($n = 3$)\n- Proper subset of $\\{2, 3, 5\\}$: $\\{2, 3\\}$\n- $\\emptyset \\subseteq \\{1, 2, 3\\}$ (empty set is subset of every set)\n- Squares $S \\subset$ Rectangles $R$\n- $\\{2, 3, 4\\}$ and $\\{4, 5, 6\\}$: **Overlapping** (share 4)\n\n**Note:** Equal $\\Rightarrow$ equivalent; equivalent $\\nRightarrow$ equal.',
    },
    {
      title: '5. Operations on Sets: Union, Intersection, and Complement',
      content:
        '**Union ($A \\cup B$):** All members in $A$ OR $B$ (combine all).\n\n**Intersection ($A \\cap B$):** Members in $A$ AND $B$ (common elements).\n\n**Complement ($A\'$):** Members in $\\xi$ NOT in $A$.\n\n**Context:** $\\xi = \\{2, 3, \\ldots, 16\\}$, $A = \\{4, 9, 16\\}$ (perfect squares), $B = \\{2, 3, 4, 6, 9, 12\\}$ (factors of 36), $C = \\{2, 3, 5, 7, 11, 13\\}$ (primes)\n\n**Worked Examples:**\n- $A \\cap B = \\{4, 9\\}$\n- $A \\cup B = \\{2, 3, 4, 6, 9, 12, 16\\}$\n- $C\' = \\{4, 6, 8, 9, 10, 12, 14, 15, 16\\}$; $n(C\') = 9$\n- $B \\cap C = \\{2, 3\\}$\n- $(A \\cup B)\' = \\{5, 7, 8, 10, 11, 13, 14, 15\\}$\n- $A \\cap C = \\emptyset$ (disjoint)\n- $B \\cup C = \\{2, 3, 4, 5, 6, 7, 9, 11, 12, 13\\}$',
      worked_examples: [
        {
          question: 'Given $A = \\{4, 9, 16\\}$ and $B = \\{2, 3, 4, 6, 9, 12\\}$, find $A \\cap B$',
          steps: ['List elements in both A and B', '4 and 9 are in both'],
          final_answer: '$A \\cap B = \\{4, 9\\}$',
        },
        {
          question: 'Find $A \\cup B$ for the same sets',
          steps: ['Combine all elements without repetition', '$A \\cup B = \\{2, 3, 4, 6, 9, 12, 16\\}$'],
          final_answer: '$A \\cup B = \\{2, 3, 4, 6, 9, 12, 16\\}$',
        },
      ],
    },
    {
      title: '6. Venn Diagrams',
      content:
        '**Conventions:** Rectangle = $\\xi$; circles = sets; overlap = intersection.\n\n**Drawing Rules:**\n1. Box first (rectangle for $\\xi$)\n2. Fill intersection ($A \\cap B$) first—critical to avoid double-counting\n3. Fill remaining regions of each circle\n4. Place elements of $\\xi$ outside circles but inside box\n\n**Example:** $A = \\{4, 9, 16\\}$, $B = \\{2, 3, 4, 6, 9, 12\\}$\n- $A \\cap B$: $\\{4, 9\\}$\n- A only ($A \\cap B\'$): $\\{16\\}$\n- B only ($B \\cap A\'$): $\\{2, 3, 6, 12\\}$\n- Element 13: outside both circles, inside $\\xi$\n\n**Disjoint sets:** Two separate circles with no overlap.\n\n**Why intersection first?** Filling A and B separately and ignoring overlap double-counts shared elements.',
    },
    {
      title: '7. Cardinality and the Addition Formula',
      content:
        '**Cardinality** $n(A)$ = number of elements in set $A$.\n\n**Addition Formula:**\n$$n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$$\n\nWe subtract $n(A \\cap B)$ because those elements are counted in both $n(A)$ and $n(B)$.\n\n**Worked Examples:**\n- $n(A) = 3$, $n(B) = 6$, $n(A \\cap B) = 2$: $n(A \\cup B) = 3 + 6 - 2 = 7$\n- 10 like Shona, 8 like Ndebele, 4 like both: $n(S \\cup N) = 10 + 8 - 4 = 14$\n- $n(A) = 3$ for $A = \\{4, 9, 16\\}$\n- $n(\\xi) = 15$, $n(A) = 3$: $n(A\') = 15 - 3 = 12$\n- Disjoint, $n(A) = 5$, $n(B) = 4$: $n(A \\cup B) = 9$\n- $n(A \\cup B) = 15$, $n(A) = 10$, $n(A \\cap B) = 3$: $15 = 10 + n(B) - 3 \\Rightarrow n(B) = 8$',
    },
    {
      title: '8. Word Problems and Practical Applications',
      content:
        '**Example 1:** Class of 40; 25 like Maths (M), 20 like Science (S), 10 like both. How many like neither?\n- $n(M \\cup S) = 25 + 20 - 10 = 35$\n- $n(M \\cup S)\' = 40 - 35 = 5$ → **5 students**\n\n**Example 2:** Club of 30; 15 play Soccer, 12 play Netball, 5 play neither. Find both.\n- Players = $30 - 5 = 25$\n- $25 = 15 + 12 - x \\Rightarrow x = 2$ → **2 play both**\n\n**Example 3:** How many like only Maths? $n(M) - n(M \\cap S) = 25 - 10 = 15$\n\n**Example 4:** 20 people; all like at least one fruit; 12 like apples, 10 like bananas. $n(A \\cap B) = 12 + 10 - 20 = 2$\n\n**Practice Exercise 2:** 1. Survey: 50 people; 30 radio, 25 TV, 10 both. How many neither? 2. 25 students; 15 Shona, 10 Ndebele, 3 both. How many only Shona? 3. 100 people; 60 Fanta, 50 Coke, 20 both. How many neither? 4. $n(A) = 40$, $n(B) = 30$, $n(A \\cap B) = 15$. Find $n(A \\cup B)$. 5. 15 people; 7 guitar, 9 piano; all play at least one. How many both?',
      worked_examples: [
        {
          question: 'In a class of 40, 25 like Maths and 20 like Science. If 10 like both, how many like neither?',
          steps: ['$n(M \\cup S) = 25 + 20 - 10 = 35$', '$n(M \\cup S)\' = 40 - 35 = 5$'],
          final_answer: '5 students',
        },
      ],
    },
    {
      title: '9. Mixed Revision and Exam-Style Test',
      content:
        '**Mixed Revision:**\n1. Define a mathematical set.\n2. Symbol for "is not a member of."\n3. List $\\{x : x \\text{ is a factor of 12}\\}$.\n4. Classify stars in the galaxy.\n5. Write $\\{2, 4, 6, 8, 10\\}$ in set-builder notation.\n6. $A = \\{1, 2, 3\\}$, $B = \\{1, 2, 3, 4, 5\\}$. Is $A \\subseteq B$?\n7. $\\xi = \\{1, 2, 3, 4, 5\\}$, $A = \\{1, 3, 5\\}$. List $A\'$.\n8. $A = \\{a, b, c\\}$, $B = \\{c, d, e\\}$. Find $A \\cap B$ and $A \\cup B$.\n9. $n(P)$ for $P = \\{10, 20, 30, 40\\}$.\n10. $n(A) = 12$, $n(B) = 15$, $n(A \\cap B) = 5$. Find $n(A \\cup B)$.\n11. Solve $2x + 5 \\geq 4$; list integer members for $x < 3$.\n12. Symbol for universal set.\n13. True or false: $\\emptyset = \\{0\\}$.\n14. $A = \\{2, 4, 6\\}$, $B = \\{1, 3, 5\\}$. What is $A \\cap B$?\n15. List $\\{x : x \\text{ prime, } 10 < x < 20\\}$.\n16. Vowels in "ZIMBABWE"—how many?\n17. $n(\\xi) = 50$, $n(C) = 18$. Find $n(C\')$.\n18. Define disjoint sets.\n19. Class of 30; 20 like Music. How many do not?\n\n**Exam-Style Test:**\n\n**Q1:** $\\xi = \\{x : x \\in \\mathbb{Z},\\ 2 \\leq x \\leq 16\\}$, $A$ = perfect squares, $B$ = factors of 36, $C$ = primes. (a) List B. (b) List C. (c) Find $A \\cap B$. (d) Find $n(C\')$. (e) Venn diagram for A and B. (f) Find $A \\cup B \\cup C$.\n\n**Q2:** Form 1 class of 45; 28 Football (F), 22 Volleyball (V); all play at least one. (a) How many both? (b) Football only? (c) Venn diagram.',
    },
    {
      title: '10. Master Memo (Solutions)',
      content:
        '**Practice 1:** 1. Empty. 2. Finite $\\{10, 12, 14, 16, 18, 20\\}$. 3. Infinite. 4. Finite $\\{2, 5, 7\\}$. 5. Empty.\n\n**Practice 2:** 1. $n(R \\cup T) = 45$; neither = 5. 2. Shona only = 12. 3. Neither = 10. 4. $n(A \\cup B) = 55$. 5. Both = 1.\n\n**Mixed Revision:** 1. Well-defined collection. 2. $\\notin$. 3. $\\{1, 2, 3, 4, 6, 12\\}$. 4. Infinite. 5. $\\{x : x \\text{ even, } 2 \\leq x \\leq 10\\}$. 6. Yes. 7. $\\{2, 4\\}$. 8. $A \\cap B = \\{c\\}$; $A \\cup B = \\{a, b, c, d, e\\}$. 9. 4. 10. 22. 11. $x \\geq -0{,}5$; $\\{0, 1, 2\\}$. 12. $\\xi$. 13. False. 14. $\\emptyset$. 15. $\\{11, 13, 17, 19\\}$. 16. 3. 17. 32. 18. No common elements ($A \\cap B = \\emptyset$). 19. 10.\n\n**Exam Q1:** (a) $B = \\{2, 3, 4, 6, 9, 12\\}$ (1, 18, 36 outside $\\xi$). (b) $C = \\{2, 3, 5, 7, 11, 13\\}$. (c) $A \\cap B = \\{4, 9\\}$. (d) $n(C\') = 9$. (e) Overlap = $\\{4, 9\\}$; A-only = $\\{16\\}$; B-only = $\\{2, 3, 6, 12\\}$. (f) $A \\cup B \\cup C = \\{2, 3, 4, 5, 6, 7, 9, 11, 12, 13, 16\\}$.\n\n**Exam Q2:** (a) Both = $28 + 22 - 45 = 5$. (b) Football only = $28 - 5 = 23$. (c) Venn: overlap 5; F-only 23; V-only 17; outside 0.',
    },
  ],
  key_points: [
    'Set = well-defined collection; $\\in$ (member), $\\notin$ (not member).',
    'Finite (counting ends), infinite (no end), empty $\\emptyset$.',
    'Listing: $\\{a, b, c\\}$. Set-builder: $\\{x : x \\ldots\\}$. Use curly brackets only.',
    '$A \\cup B$ = union (all); $A \\cap B$ = intersection (common); $A\'$ = complement.',
    'Addition formula: $n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$.',
    'Venn: fill intersection first to avoid double-counting.',
  ],
  exam_tips: [
    'Only curly brackets $\\{\\}$ for sets—square or round brackets lose marks.',
    'Always use $\\{x : \\ldots\\}$ in set-builder; do not omit the colon.',
    '$\\emptyset \\neq \\{0\\}$; the empty set has no elements.',
    'Equal sets are equivalent, but equivalent sets may not be equal.',
  ],
  visual_descriptions: [
    'Venn diagram: rectangle for $\\xi$, circles for sets, overlap for intersection.',
    'Fill intersection first when constructing Venn diagrams.',
    'Addition formula diagram: union = A + B minus overlap.',
  ],
};

const typesOfSetsForm1Notes: MathTopicNotes = {
  topic: 'Types of Sets',
  subject: 'Mathematics',
  grade_level: 'Form 1',
  summary:
    'Set theory provides the logical framework for organizing mathematical objects. This topic deepens classification: finite vs infinite sets, the empty set ($\\emptyset$), equal vs equivalent sets, subsets ($\\subseteq$) and proper subsets ($\\subset$), the universal set ($\\xi$), complement ($A\'$), disjoint vs overlapping sets, the $2^n$ rule for subsets, and Venn diagram representation.',
  sections: [
    {
      title: '1. Introduction to Set Theory and Classification',
      content:
        'A **set** is a well-defined collection of distinct objects. The **Universal Set** ($\\xi$) contains all elements under consideration (e.g. $\\xi = \\{2, 3, \\ldots, 16\\}$). Within it we identify specific sets like $A$ (perfect squares) or $C$ (primes).\n\n**Why classification matters:** Identifying set type determines how you list or describe the truth set for inequalities, integral values, or rational numbers. Precision prevents errors when finding HCF or defining domain boundaries.',
    },
    {
      title: '2. Finite and Infinite Sets',
      content:
        '**Finite Set:** Number of elements can be counted; has a clear end.\n\n**Examples (Finite):**\n- Factors of 36 in $\\xi$: $B = \\{2, 3, 4, 6, 9, 12\\}$\n- Perfect squares in $\\xi$: $A = \\{4, 9, 16\\}$\n- Primes between 2 and 16: $C = \\{2, 3, 5, 7, 11, 13\\}$\n- Integers $1 < x < 9$: $\\{2, 3, 4, 5, 6, 7, 8\\}$\n- Prime factors of 168: $\\{2, 3, 7\\}$; of 70: $\\{2, 5, 7\\}$; of 216: $\\{2, 3\\}$\n- Integral $x$ for $-2 \\leq x < 3$: $\\{-2, -1, 0, 1, 2\\}$\n\n**Infinite Set:** Continues without end.\n\n**Examples (Infinite):** All primes $\\{2, 3, 5, 7, \\ldots\\}$; all multiples of 5; all rationals; $x > 4$; all perfect squares.\n\n**COMMON ERROR:** "All integers up to 1 000 000" is finite (has a stopping point). Infinite = no stopping point.\n\n**Practice Exercise 2.1:** Classify as finite or infinite: 1. Prime factors of 324 2. Real numbers satisfying $2x + 5 > 4$ 3. Members of $\\xi = \\{2, 3, \\ldots, 16\\}$ 4. Multiples of 2 5. Integral $x$ where $1 < x < 5$',
    },
    {
      title: '3. The Empty (Null) Set',
      content:
        '**Definition:** A set with no elements. Denoted $\\emptyset$ or $\\{\\}$.\n\n**Worked Examples:**\n- Primes between 8 and 10: Only 9 exists; 9 is not prime → $\\emptyset$\n- Integers $4 < x < 5$: None → $\\emptyset$\n- Perfect squares in $\\xi$ that are also prime: $\\{4, 9, 16\\}$; none are prime → $\\emptyset$\n- $2y - 1 > 2y + 5$: simplifies to $-1 > 5$ (contradiction) → $\\emptyset$\n- Even primes $> 2$: 2 is the only even prime → $\\emptyset$\n- Factors of 36 $> 40$: impossible → $\\emptyset$\n\n**$\\{0\\}$ vs $\\emptyset$:** $\\{0\\}$ has one element (zero). $\\emptyset$ has no elements. Do not write $\\{\\emptyset\\}$—that is a set containing the empty set.\n\n**Practice Exercise 3.1:** 1. Primes between 14 and 16 2. Integers $2 < x < 3$ 3. Truth set for $5 < 2$ 4. Even factors of 11 5. Factors of 10 that are also primes between 6 and 9',
    },
    {
      title: '4. Equal and Equivalent Sets',
      content:
        '**Equal Sets ($A = B$):** Exactly the same elements. Order does not matter.\n\n**Examples:** $\\{2, 5, 7\\} = \\{7, 2, 5\\}$; $\\{4, 9, 16\\} = \\{16, 4, 9\\}$; prime factors of 324 and 12 are both $\\{2, 3\\}$.\n\n**Equivalent Sets ($A \\leftrightarrow B$):** Same number of elements, $n(A) = n(B)$, even if elements differ.\n\n**Examples:** $A = \\{4, 9, 16\\}$ (n=3) and $P = \\{2, 5, 7\\}$ (n=3); $\\{2, 3\\}$ and $\\{2, 3\\}$ (equal and equivalent); prime factors of 70 and 105 both have n=3.\n\n**Comparison:** Equal → same members. Equivalent → same cardinality. Equal implies equivalent; equivalent does not imply equal.\n\n**Practice Exercise 4.1:** 1. $P = \\{\\text{Prime factors of 42}\\}$; $Q = \\{2, 3, 7\\}$. 2. $X = \\{4, 9\\}$; $Y = \\{\\text{Prime factors of 35}\\}$. 3. $A = \\{2, 3, 4\\}$; $B = \\{4, 3, 2\\}$. 4. Perfect squares vs primes in $\\xi$. 5. $E = \\{x : 1 < x < 4,\\ x \\in \\mathbb{Z}\\}$; $F = \\{3\\}$.',
    },
    {
      title: '5. Subsets and Proper Subsets',
      content:
        '**Subset ($A \\subseteq B$):** Every element of $A$ is in $B$.\n\n**Proper Subset ($A \\subset B$):** $A \\subseteq B$ but $A \\neq B$.\n\n**Listing Subsets:** For $\\{2, 3\\}$: $\\emptyset$, $\\{2\\}$, $\\{3\\}$, $\\{2, 3\\}$. Total = 4.\n\n**The $2^n$ Rule:** Number of subsets = $2^n$ where $n$ = number of elements. For $A = \\{4, 9, 16\\}$ (n=3): $2^3 = 8$ subsets.\n\n**Worked Examples:** $\\{4, 9\\} \\subset \\{4, 9, 16\\}$; $\\{2, 3\\} \\subset \\{2, 3, 5, 7, 11, 13\\}$; $\\emptyset \\subset \\{4, 9, 16\\}$; prime factors of 42 $\\subset$ prime factors of 210.\n\n**Practice Exercise 5.1:** 1. List all subsets of $\\{2, 5\\}$. 2. Is $\\{2, 3, 4\\}$ a proper subset of $B = \\{2, 3, 4, 6, 9, 12\\}$? 3. How many subsets in a set with 4 elements?',
    },
    {
      title: '6. Universal Set and Venn Diagrams',
      content:
        '**Universal Set ($\\xi$):** The boundary of discourse; contains all elements under consideration.\n\n**Complement ($A\'$):** Elements in $\\xi$ not in $A$.\n\n**Example:** $\\xi = \\{2, 3, \\ldots, 16\\}$, $C = \\{2, 3, 5, 7, 11, 13\\}$ (primes). $C\' = \\{4, 6, 8, 9, 10, 12, 14, 15, 16\\}$. $n(C\') = 9$.\n\n**Venn Diagram:** Rectangle = $\\xi$; circles = sets. $A \\subset \\xi$: circle inside rectangle. $A \\cap B$: two overlapping circles. Shared elements go in the overlap.\n\n**Set Notation:** "Perfect squares in $\\xi$" → $A = \\{x : x \\in \\xi,\\ x \\text{ is a perfect square}\\}$. "Members in both A and B" → $A \\cap B$. "Members in A or B" → $A \\cup B$. "Not in C" → $C\'$.',
    },
    {
      title: '7. Disjoint and Overlapping Sets',
      content:
        '**Disjoint:** No common elements. $A \\cap B = \\emptyset$.\n\n**Overlapping:** At least one common element. $A \\cap B \\neq \\emptyset$.\n\n**Worked Examples:**\n- Prime factors of 70 and 105: share $\\{5, 7\\}$ → **Overlapping**\n- Factors of 36 and 54: share $\\{2, 3, 6, 9, 18\\}$ → **Overlapping**\n- Perfect squares $\\{4, 9, 16\\}$ and primes $\\{2, 3, 5, 7, 11, 13\\}$ in $\\xi$: no overlap → **Disjoint**\n- Multiples of 5 and multiples of 2: share $\\{10, 20, \\ldots\\}$ → **Overlapping**\n- Factors of 7 and 8: share $\\{1\\}$ → **Overlapping**\n- $\\{x : x < 0\\}$ and $\\{x : x > 0\\}$: no overlap → **Disjoint**\n- Perfect squares and primes: **Disjoint**',
    },
    {
      title: '8. Mixed Revision Exercise',
      content:
        '1. List $A = \\{x : x \\text{ perfect square between 2 and 16}\\}$.\n2. Type of $\\{x : x \\in \\mathbb{R},\\ x \\geq -1/2\\}$.\n3. $\\xi = \\{2, \\ldots, 16\\}$, $C$ = primes. Find $n(C\')$.\n4. Are $\\{2, 3, 7\\}$ and prime factors of 42 equal?\n5. Prime factors of 540.\n6. Even primes $> 2$: finite, infinite, or empty?\n7. Subsets of prime factors of 70.\n8. Factors of 7 and 8: disjoint?\n9. Digits in $19/40$ (0,475).\n10. Multiples of 3: finite or infinite?\n11. $n(A) = n(B) = 3$. Equal or equivalent?\n12. $\\{x : x \\in \\mathbb{Z},\\ 1 < x \\leq 4\\}$.\n13. Cardinal number of prime factors of 324.\n14. Relationship $\\{4, 9, 16\\}$ to $\\xi$.\n15. Prime factors of 168.\n16. Factors of 36 and perfect squares in $\\xi$: overlapping?\n17. Truth set for $0 > 6$.\n18. All subsets of $\\{5, 7\\}$.\n19. $y = 6x$, $x \\in \\{2, 12\\}$. Find set of $y$ values.\n20. $n(P)$ for primes between 10 and 20.\n21. $\\{x : x^2 = 25\\}$ and $\\{5, -5\\}$: equal?\n22. Complement of universal set.\n23. $\\{x : -1 < 2x - 3 < 5,\\ x \\in \\mathbb{Z}\\}$.\n24. $A = \\{2, 3, 4, 6, 9, 12\\}$, $B = \\{4, 9, 16\\}$. Find $A \\cap B$.\n25. Subsets for $n = 1$.',
    },
    {
      title: '9. Exam-Style Structured Test',
      content:
        '**Section A:** 1. Prime factors of 105. 2. If $n(A) = 8$, number of subsets. 3. $\\{x : x \\text{ rational}\\}$: finite or infinite? 4. $\\xi = \\{2, \\ldots, 16\\}$. List factors of 36. 5. Symbol for proper subset.\n\n**Section B:** 6. $\\xi = \\{2, 3, \\ldots, 10\\}$. $P$ = factors of 12, $Q$ = primes. (a) List P and Q. (b) Find $P \\cap Q$. (c) Find $n(P \\cup Q)$. (d) List $P\'$. 7. Solve $2x + 5 \\geq 4$; state smallest prime in truth set. 8. (a) List all subsets of prime factors of 6. (b) Explain $\\{0\\}$ vs $\\emptyset$.',
    },
    {
      title: '10. Full Memo and Worked Solutions',
      content:
        '**Practice 2.1:** 1. Finite. 2. Infinite. 3. Finite. 4. Infinite. 5. Finite.\n\n**Practice 3.1:** 1. $\\emptyset$ (15 not prime). 2. $\\{\\}$. 3. $\\emptyset$. 4. $\\{\\}$ (11 is odd). 5. Factors of 10 = $\\{1, 2, 5, 10\\}$; primes 6–9 = $\\{7\\}$; intersection = $\\emptyset$.\n\n**Mixed Revision:** 1. $\\{4, 9, 16\\}$. 2. Infinite. 3. $n(C\') = 15 - 6 = 9$. 4. Equal. 5. $540 = 2^2 \\cdot 3^3 \\cdot 5$ → $\\{2, 3, 5\\}$. 6. Empty. 7. $2^3 = 8$. 8. Overlapping (share 1). 9. 0,475 → $\\{0, 4, 7, 5\\}$. 10. Infinite. 11. Equivalent. 12. $\\{2, 3, 4\\}$. 13. 2. 14. $A \\subset \\xi$. 15. $\\{2, 3, 7\\}$. 16. Overlapping ($\\{4, 9\\}$). 17. $\\emptyset$. 18. $\\emptyset$, $\\{5\\}$, $\\{7\\}$, $\\{5, 7\\}$. 19. $y = 6(2)$, $6(12)$ → $\\{12, 72\\}$. 20. 4. 21. Equal. 22. Complement of $\\xi$ = $\\emptyset$. 23. $\\{2, 3, 4\\}$. 24. $\\{4, 9\\}$. 25. $2^1 = 2$.\n\n**Exam Test:** 1. $\\{3, 5, 7\\}$. 2. $2^8 = 256$. 3. Infinite. 4. $\\{2, 3, 4, 6, 9, 12\\}$. 5. $\\subset$. 6. (a) $P = \\{2, 3, 4, 6\\}$, $Q = \\{2, 3, 5, 7\\}$. (b) $P \\cap Q = \\{2, 3\\}$. (c) $P \\cup Q = \\{2, 3, 4, 5, 6, 7\\}$; $n = 6$. (d) $P\' = \\{5, 7, 8, 9, 10\\}$. 7. $x \\geq -0{,}5$; smallest prime = 2. 8. (a) $\\emptyset$, $\\{2\\}$, $\\{3\\}$, $\\{2, 3\\}$. (b) $\\{0\\}$ contains zero; $\\emptyset$ has no members.',
    },
  ],
  key_points: [
    'Finite: countable end. Infinite: no end. Empty: $\\emptyset$ or $\\{\\}$. $\\{0\\} \\neq \\emptyset$.',
    'Equal: same elements. Equivalent: same cardinality. Equal $\\Rightarrow$ equivalent; equivalent $\\nRightarrow$ equal.',
    'Subset $A \\subseteq B$: every element of A in B. Proper subset $A \\subset B$: $A \\neq B$.',
    'Number of subsets = $2^n$.',
    'Disjoint: $A \\cap B = \\emptyset$. Overlapping: at least one common element.',
    'Complement $A\'$: elements in $\\xi$ not in $A$.',
  ],
  exam_tips: [
    'Do not confuse $\\{0\\}$ and $\\emptyset$. Never write $\\{\\emptyset\\}$ for the empty set.',
    'Equal sets have same members; equivalent sets have same count—they may differ.',
    'For subsets: include $\\emptyset$ and the set itself. Use $2^n$ to verify count.',
  ],
  visual_descriptions: [
    'Finite vs infinite: countable vs endless.',
    'Venn: $\\xi$ as rectangle, circles for sets, overlap for intersection.',
    '$2^n$ subsets for n elements.',
  ],
};

const consumerArithmeticForm1Notes: MathTopicNotes = {
  topic: 'Consumer Arithmetic',
  subject: 'Mathematics',
  grade_level: 'Form 1',
  summary:
    'Consumer Arithmetic applies decimals, percentages, and ratios to everyday commercial transactions. This module covers money and decimal calculations, profit and loss, discount, simple interest, bills and invoices, commission, and hire purchase—essential life skills for the Zimbabwean economy.',
  sections: [
    {
      title: '1. Introduction and Learning Objectives',
      content:
        'Consumer Arithmetic is a cornerstone of the ZIMSEC Mathematics syllabus, bridging classroom theory and financial realities. Learners must write money values to 2 decimal places, calculate profit/loss and their percentages, apply discounts, use the simple interest formula $I = \\frac{PRT}{100}$, interpret bills and invoices, and evaluate hire purchase options compared to cash prices.\n\n**Common Error:** Write 4,50 not 4,5 for money. The second decimal place is mandatory.',
    },
    {
      title: '2. Section A: Money and Decimal Calculations',
      content:
        'Money is always expressed to two decimal places (e.g. 1,70 not 1,7). Decimal precision ensures accounts balance.\n\n**Key operations:** Addition, subtraction, multiplication, and division of decimals. When buying items in quantity: $\\text{number of items} = \\frac{\\text{amount available}}{\\text{price per item}}$ (always round down for whole items). Change = amount given $-$ amount spent.',
      worked_examples: [
        {
          question: 'Simplify: $0{,}34 - 5{,}2 + 62{,}7$',
          steps: [
            '0,34 + 62,70 = 63,04',
            '$63{,}04 - 5{,}20 = 57{,}84$',
          ],
          final_answer: '57,84',
        },
        {
          question: 'A loaf of bread costs 1,15. A vendor has 20. How many loaves can he buy?',
          steps: [
            '$20 \\div 1{,}15 = 17{,}391\\ldots$',
            'Round down: 17 loaves',
          ],
          final_answer: '17 loaves',
        },
        {
          question: 'Find the change from 20 after buying 17 loaves at 1,15 each.',
          steps: [
            '$17 \\times 1{,}15 = 19{,}55$',
            '$20{,}00 - 19{,}55 = 0{,}45$',
          ],
          final_answer: '0,45',
        },
      ],
    },
    {
      title: '3. Section B: Profit and Loss',
      content:
        '**Cost Price (C.P.):** What the trader pays. **Selling Price (S.P.):** What the consumer pays.\n\n**Formulas:**\n- $\\text{Profit} = \\text{S.P.} - \\text{C.P.}$ (when S.P. > C.P.)\n- $\\text{Loss} = \\text{C.P.} - \\text{S.P.}$ (when C.P. > S.P.)\n- $\\text{\\% Profit/Loss} = \\frac{\\text{Profit or Loss}}{\\text{C.P.}} \\times 100$\n\n**Why C.P. as denominator?** Profit is measured as a return on your original investment.',
      worked_examples: [
        {
          question: 'Sekai buys 23 pencils for 14,95 and sells at 0,80 each. Find her profit.',
          steps: [
            'S.P. $= 23 \\times 0{,}80 = 18{,}40$',
            'Profit $= 18{,}40 - 14{,}95 = 3{,}45$',
          ],
          final_answer: '3,45',
        },
        {
          question: 'A vendor buys 10 melons for 20,00 and sells at 2,50 each. Find % profit.',
          steps: [
            'S.P. $= 10 \\times 2{,}50 = 25{,}00$',
            'Profit $= 25{,}00 - 20{,}00 = 5{,}00$',
            '$\\% = \\frac{5}{20} \\times 100 = 25\\%$',
          ],
          final_answer: '25%',
        },
        {
          question: 'An item is bought for 40 and sold at 15% profit. Find S.P.',
          steps: [
            'Profit = $\\frac{15}{100} \\times 40 = 6{,}00$',
            'S.P. = 40,00 + 6,00 = 46,00',
          ],
          final_answer: '46,00',
        },
      ],
    },
    {
      title: '4. Section C: Discount',
      content:
        '**Two-step process:** 1) Discount Amount $= \\text{Rate} \\times \\text{Original Price}$. 2) Final Price $= \\text{Original Price} - \\text{Discount Amount}$.',
      worked_examples: [
        {
          question: 'A store reduces prices by 12%. Find the new price of a blanket originally 40.',
          steps: [
            'Discount = $\\frac{12}{100} \\times 40{,}00 = 4{,}80$',
            'New Price $= 40{,}00 - 4{,}80 = 35{,}20$',
          ],
          final_answer: '35,20',
        },
        {
          question: 'A laptop marked at 850 is sold for 765. Find the % discount.',
          steps: [
            'Discount Amount $= 850 - 765 = 85{,}00$',
            '$\\% = \\frac{85}{850} \\times 100 = 10\\%$',
          ],
          final_answer: '10%',
        },
      ],
    },
    {
      title: '5. Section D: Simple Interest',
      content:
        '**Principal (P):** Original sum. **Rate (R):** % per year. **Time (T):** Duration in years.\n\n**Formulas:**\n- $I = \\frac{P \\times R \\times T}{100}$\n- $A = P + I$ (Total Amount)\n\n**Time units:** If time is in months, divide by 12 first: e.g. 6 months = 0,5 years.',
      worked_examples: [
        {
          question: 'Calculate interest on 1 500 at 6,5% for 10 years.',
          steps: [
            '$I = \\frac{1500 \\times 6{,}5 \\times 10}{100}$',
            'I $= 15 \\times 65 = 975{,}00$',
          ],
          final_answer: '975,00',
        },
        {
          question: 'Find total amount after the investment above.',
          steps: ['A = P + I = 1500 + 975 = 2475,00'],
          final_answer: '2 475,00',
        },
        {
          question: 'Interest on 800 at 12% for 6 months.',
          steps: [
            'T = 6/12 = 0,5 years',
            '$I = \\frac{800 \\times 12 \\times 0{,}5}{100} = 48{,}00$',
          ],
          final_answer: '48,00',
        },
      ],
    },
    {
      title: '6. Section E: Bills, Invoices, and Commission',
      content:
        '**Bills/Invoices:** Itemise quantities, unit prices, and totals. Grand Total = sum of line totals.\n\n**Commission:** Fee paid as a percentage of sales. Commission = $\\frac{\\text{rate}}{100} \\times \\text{sales value}$.\n\n**Example bill:** $5 \\times 15{,}00 = 75{,}00$; $10 \\times 3{,}50 = 35{,}00$; Total $= 110{,}00$.',
      worked_examples: [
        {
          question: 'A salesman earns 5% commission on sales of 1 000. Find commission.',
          steps: ['$\\frac{5}{100} \\times 1000 = 50{,}00$'],
          final_answer: '50,00',
        },
        {
          question: 'Basic pay 200 plus 10% commission on 500 sales. Find total pay.',
          steps: [
            'Commission $= 0{,}10 \\times 500 = 50{,}00$',
            'Total = 200 + 50 = 250,00',
          ],
          final_answer: '250,00',
        },
      ],
    },
    {
      title: '7. Section F: Hire Purchase',
      content:
        '**HP** allows immediate use: pay Deposit, then balance in Monthly Instalments. HP is more expensive than cash due to interest.\n\n**Formula:** $\\text{Total HP Price} = \\text{Deposit} + (\\text{Monthly Instalment} \\times \\text{No. of Months})$',
      worked_examples: [
        {
          question: 'TV costs 3 200. Deposit 15%. Find deposit.',
          steps: ['$\\frac{15}{100} \\times 3200 = 480{,}00$'],
          final_answer: '480,00',
        },
        {
          question: 'TV: 480 deposit $+ 12 \\times 250$ instalments. Find total HP price.',
          steps: [
            'Instalments $= 12 \\times 250 = 3\\ 000{,}00$',
            'Total HP = 480 + 3000 = 3480,00',
          ],
          final_answer: '3 480,00',
        },
      ],
    },
    {
      title: '8. Mixed Revision and Exam-Style Test',
      content:
        '**Practice A:** 1. 24,55 + 13,05 + 0,90. 2. Kombi $0{,}75 \\times 16$. 3. $45{,}60 \\div 0{,}12$. 4. $50{,}00 - 19{,}85$. 5. $1{,}25 \\times 1000$.\n\n**Practice B:** 1. C.P.=120, S.P.=150 → % profit. 2. C.P.=200, S.P.=160 → % loss. 3. C.P.=550, S.P.=625 → profit. 4. Goat 40→55 → % increase. 5. C.P.=80, 12,5% profit → S.P.\n\n**Practice C:** 1. Marked 150, 10% off. 2. Shirt 25, 20% discount → amount. 3. Phone 450, 12% off. 4. Book 60 sold for 54 → % discount. 5. Hat 12, 25% off.\n\n**Practice D:** 1. P=600, R=4%, T=3 → I. 2. P=2000, R=5%, T=4 → A. 3. P=1200, R=10%, T=3 months → I. 4. I=60, P=500, T=2 → R. 5. P=1500, R=8%, T=1 → A.\n\n**Practice E:** 1. Bill: 3 kg meat (8/kg), 1 kg rice (2,50). 2. 4% on 1200. 3. 10% tip on 65. 4. 2 tyres (60 each), 1 battery (85). 5. Basic 150 + 5% on 1000.\n\n**Practice F:** 1. 25% deposit on 800 stove. 2. 18 × 40 instalments. 3. Deposit 250 + 12 × 100. 4. Cash 1200, HP 1450 → extra cost. 5. Balance 1200 over 24 months → monthly instalment.\n\n**Exam-style:** See full memo for 25 mixed questions and 12 structured test items with solutions.',
    },
    {
      title: '9. Marking Scheme (Selected Answers)',
      content:
        '**Practice A:** 1. 38,50. 2. 12,00. 3. 380,00. 4. 30,15. 5. 1 250,00.\n\n**Practice B:** 1. 25%. 2. 20%. 3. 75. 4. 37,5%. 5. 90.\n\n**Practice D:** 1. 72. 2. 2 400. 3. 30. 4. R = 6%. 5. 1 620.\n\n**Exam-style (sample):** 1(a) $\\frac{475}{1000} = \\frac{19}{40}$. 1(b)(i) $50 \\times 0{,}25 = 12{,}50$. (ii) Profit 2,50; % = 25%. 2(i) $\\frac{20}{100} \\times 1200 = 240$. (ii) 240 + 1260 = 1500. (iii) 300. 3. I = 975. 4. 102. 5. 147,50. 6. 450. 12. $40 - 4{,}80 = 35{,}20$.',
    },
  ],
  key_points: [
    'Money to 2 decimal places: 4,50 not 4,5.',
    '$\\text{Profit} = \\text{S.P.} - \\text{C.P.}$; $\\text{Loss} = \\text{C.P.} - \\text{S.P.}$',
    '$\\% \\text{Profit/Loss} = \\frac{\\text{Profit or Loss}}{\\text{C.P.}} \\times 100$ (always use C.P. as denominator).',
    '$I = \\frac{PRT}{100}$; $A = P + I$. Time in years: months $\\div 12$.',
    '$\\text{Total HP} = \\text{Deposit} + (\\text{Instalment} \\times \\text{Months})$.',
  ],
  exam_tips: [
    'Never use S.P. as denominator for % profit/loss—always C.P.',
    'Time in months must be converted to years ($\\div 12$) for simple interest.',
    'Discount: two steps—find amount, then subtract from original.',
  ],
  visual_descriptions: [
    'Bill format: columns for Qty, Item, Unit Price, Total.',
    'HP comparison: deposit + instalments vs cash price to find extra cost.',
  ],
};

const measuresForm1Notes: MathTopicNotes = {
  topic: 'Measures',
  subject: 'Mathematics',
  grade_level: 'Form 1',
  summary:
    'Measures is the strategic foundation for Zimbabwean commerce, construction, and engineering. This module covers units of length, mass, capacity, time; perimeter and area of plane shapes; and volume of cuboids. Mastery of conversions and formulas is essential for Paper 1 and Paper 2.',
  sections: [
    {
      title: '1. Introduction and Units Overview',
      content:
        'A **measure** is the determination of size, quantity, or capacity using standardized units. The seven core subtopics are: Units of Length, Mass, Capacity, Time; Perimeter; Area; and Volume. Use the ZIMSEC decimal comma (e.g. 0,905).',
    },
    {
      title: '2. Units of Length',
      content:
        '**Conversion factors:** 1 km = 1 000 m; 1 m = 100 cm; 1 cm = 10 mm.\n\n**Rules:** Large → Small: multiply. Small → Large: divide.\n\n**Common error:** Never add or subtract until all measurements are in the same unit.',
      worked_examples: [
        {
          question: 'Convert 7,24 km to metres.',
          steps: ['7,24 × 1 000 = 7 240'],
          final_answer: '7 240 m',
        },
        {
          question: 'Find $\\frac{1}{8}$ of 7,24 km in metres.',
          steps: [
            '$\\frac{1}{8} \\times 7{,}24 = 0{,}905$ km',
            '0,905 × 1 000 = 905 m',
          ],
          final_answer: '905 m',
        },
        {
          question: 'Express 42 cm as a percentage of 1,05 m.',
          steps: [
            '1,05 m = 105 cm',
            '$\\frac{42}{105} \\times 100\\% = 40\\%$',
          ],
          final_answer: '40%',
        },
        {
          question: '3,6 m + 2,2 m. Give answer in mm.',
          steps: ['5,8 m × 1 000 = 5 800 mm'],
          final_answer: '5 800 mm',
        },
      ],
    },
    {
      title: '3. Units of Mass',
      content:
        '**Standard units:** mg, g, kg (1 000 g), tonne (1 000 kg).\n\n**Tonne to gram:** Two steps: × 1 000 → kg, × 1 000 → g. Total factor: 1 000 000.',
      worked_examples: [
        {
          question: 'Convert 10,98 kg to grams.',
          steps: ['10,98 × 1 000 = 10 980'],
          final_answer: '10 980 g',
        },
        {
          question: 'Pack 10 980 g, each book 54,9 g. How many books?',
          steps: ['10 980 ÷ 54,9 = 200'],
          final_answer: '200 books',
        },
        {
          question: 'Convert 5 000 kg to tonnes.',
          steps: ['5 000 ÷ 1 000 = 5'],
          final_answer: '5 tonnes',
        },
      ],
    },
    {
      title: '4. Units of Capacity',
      content:
        '**Capacity** = amount a container can hold. **Volume** = space occupied by a solid. 1 000 mL = 1 L. Link: 1 mL = 1 cm³.\n\n**Common error:** When dividing by 1 000, move decimal three places: $65 \\div 1\\ 000 = 0{,}065$ (not 0,65).',
      worked_examples: [
        {
          question: 'Express 1,2 L as a percentage of 6 L.',
          steps: ['$\\frac{1{,}2}{6} \\times 100\\% = 20\\%$'],
          final_answer: '20%',
        },
        {
          question: 'Convert 3,93 L to mL.',
          steps: ['$3{,}93 \\times 1\\ 000 = 3\\ 930$'],
          final_answer: '3 930 mL',
        },
        {
          question: 'How many 250 mL cups from a 5 L container?',
          steps: ['$5\\ 000 \\div 250 = 20$'],
          final_answer: '20 cups',
        },
      ],
    },
    {
      title: '5. Units of Time',
      content:
        '60 seconds = 1 minute; 60 minutes = 1 hour; 24 hours = 1 day.\n\n**12-hour ↔ 24-hour:** After 12:00, add 12 for p.m. (e.g. 2:45 p.m. = 14:45). Subtract 12 for 24→12.\n\n**Time subtraction:** Borrow 60 minutes from hours, not 100.',
      worked_examples: [
        {
          question: 'Convert 3 h 36 min into minutes.',
          steps: ['$(3 \\times 60) + 36 = 216$'],
          final_answer: '216 min',
        },
        {
          question: 'Bus leaves 08:30, arrives 11:15. Duration?',
          steps: ['$11{:}15 - 08{:}30$: borrow 60 min $\\to$ 2 h 45 min'],
          final_answer: '2 h 45 min',
        },
        {
          question: 'Convert 14:45 to 12-hour clock.',
          steps: ['$14{:}45 - 12{:}00 = 2{:}45$ p.m.'],
          final_answer: '2:45 p.m.',
        },
        {
          question: 'Flight 22:45 to 03:15 next day. Duration?',
          steps: [
            'To midnight: $24{:}00 - 22{:}45 = 1$ h 15 min',
            'After midnight: 3 h 15 min',
            'Total: 4 h 30 min',
          ],
          final_answer: '4 h 30 min',
        },
      ],
    },
    {
      title: '6. Perimeter',
      content:
        '**Perimeter** = total distance around a 2D shape (linear measure: m, cm, km).\n\n**Formulas:** Rectangle: $P = 2(L + W)$. Square: $P = 4L$. Triangle: sum of three sides.\n\n**L-shaped room:** Perimeter = same as bounding rectangle: $P = 2(\\text{outer length} + \\text{outer width})$.',
      worked_examples: [
        {
          question: 'Rectangle 3,6 m by 2,2 m. Find perimeter.',
          steps: [
            '$P = 2(3{,}6 + 2{,}2) = 2(5{,}8)$',
            'P = 11,6 m',
          ],
          final_answer: '11,6 m',
        },
        {
          question: 'Square garden side 219,1 m. Find perimeter.',
          steps: ['P = 4 × 219,1 = 876,4'],
          final_answer: '876,4 m',
        },
        {
          question: 'Rectangle perimeter 100 cm, width 20 cm. Find length.',
          steps: ['$100 = 2(L + 20) \\Rightarrow 50 = L + 20 \\Rightarrow L = 30$'],
          final_answer: '30 cm',
        },
      ],
    },
    {
      title: '7. Area',
      content:
        '**Area** = surface covered. Units: cm², m², km², hectares (1 ha = 10 000 m²).\n\n**Formulas:** Square: $A = L^2$. Rectangle: $A = L \\times W$. Triangle: $A = \\frac{1}{2} \\times b \\times h$.',
      worked_examples: [
        {
          question: 'Square side 219,1 m. Find area.',
          steps: ['$A = (219{,}1)^2 = 48\\ 004{,}81$'],
          final_answer: '48 004,81 m²',
        },
        {
          question: 'Rectangle 3,6 m by 2,2 m. Find area.',
          steps: ['A = 3,6 × 2,2 = 7,92'],
          final_answer: '7,92 m²',
        },
        {
          question: '4,8 hectares to m².',
          steps: ['4,8 × 10 000 = 48 000'],
          final_answer: '48 000 m²',
        },
        {
          question: 'Square perimeter 20 cm. Find area.',
          steps: ['Side $= 20 \\div 4 = 5$ cm; $A = 5^2 = 25$'],
          final_answer: '25 cm²',
        },
      ],
    },
    {
      title: '8. Volume',
      content:
        '**Volume** = space occupied by a solid. Cuboid: $V = L \\times W \\times H$. Cube: $V = \\text{side}^3$.\n\n**Link:** 1 000 cm³ = 1 L. 1 m³ = 1 000 000 cm³.',
      worked_examples: [
        {
          question: 'Cuboid L=10 cm, W=5 cm, H=2 cm. Find volume.',
          steps: ['$V = 10 \\times 5 \\times 2 = 100$'],
          final_answer: '100 cm³',
        },
        {
          question: 'Cube side 3 m. Find volume.',
          steps: ['$V = 3^3 = 27$'],
          final_answer: '27 m³',
        },
        {
          question: 'Cuboid 2 m × 3 m × 0,5 m. Volume and capacity in L?',
          steps: [
            '$V = 2 \\times 3 \\times 0{,}5 = 3$ m³',
            '3 m³ = 3 000 L (1 m³ = 1 000 L)',
          ],
          final_answer: '3 m³ = 3 000 L',
        },
      ],
    },
    {
      title: '9. Mixed Revision',
      content:
        '1. 0,34 m − 5,2 cm + 62,7 mm (answer in cm). 2. 25% of 180 kg. 3. 0,475 as fraction. 4. Duration 10:15 to 14:45. 5. Rectangle 3,6 m × 2,2 m → perimeter. 6. 1 269 to 3 s.f. 7. How many 2,62 m lengths from 39,3 m? 8. Blanket 40, 12% off. 9. Square side 5 m → area. 10. Cube side 2 cm → volume. 11. 3,5 t to kg. 12. 1 kg = 2,40, cost of 16 kg. 13. 3 h 36 min in decimal hours. 14. Rectangle area 48 000 m², length 300 m → width. 15. $\\frac{2}{3}$ of 3,93 m. 16–25: see full memo.',
    },
    {
      title: '10. Exam-Style Structured Test',
      content:
        '**Q1:** (a) 7,24 km → m. (b) $\\frac{1}{8}$ of 7,24 km in m. (c) Rectangle 3,6 m × 2,2 m → perimeter.\n\n**Q2:** (a) Pack 10,98 kg, each 54,9 g → books. (b) Bought 14,95, sold 0,10 each → profit.\n\n**Q3:** (a) Flight 22:45 to 03:15 next day. (b) Duration in min.\n\n**Q4:** (a) Square 4,8 ha, side length (1 d.p). (b) Perimeter.\n\n**Q5:** (a) 1,2 L as % of 6 L. (b) 9% of 6,40 to nearest cent.\n\n**Q6–Q12:** Triangle perimeter; 3,6 m + 2,2 m in mm; cuboid volume/capacity; standard form; HCF; deposit/balance; time conversions; L-shaped perimeter and wall area.',
    },
    {
      title: '11. Memo and Solutions',
      content:
        '**Revision:** 1. 34 − 5,2 + 6,27 = 35,07 cm. 2. 45 kg. 3. $\\frac{19}{40}$. 4. 4 h 30 min. 5. 11,6 m. 6. 1 270. 7. 15. 8. 35,20. 9. 25 m². 10. 8 cm³. 11. 3 500 kg. 12. 38,40. 13. 3,6 h. 14. 160 m. 15. 2,62 m. 16. 54,9 g. 17. 4,69%. 18. 56 km. 19. $\\frac{1}{5}$. 20. 0,58. 21. 11:36. 22. 24 m³. 23. $6{,}2 \\times 10^{-3}$. 24. HCF = 6. 25. LCM = 180.\n\n**Exam:** Q1(a) 7 240 m, (b) 905 m, (c) 11,6 m. Q2(a) 200, (b) 5,05. Q3(a) 4 h 30 min, (b) 270 min. Q4(a) 219,1 m, (b) 876,4 m. Q5(a) 20%, (b) 0,58. Q6(a) 1 158 m, (b) 1,158 km. Q7(a) 5 800 mm, (b) 0,29 mm. Q8(a) 3 m³, (b) 3 000 L. Q9(a) 1 300, (b) $6{,}2 \\times 10^{-3}$, (c) 18. Q10(a) 480, (b) 2 720. Q11(a) 216 min, (b) 90 min. Q12(a) 36 m, (b) 108 m².',
    },
  ],
  key_points: [
    'Length: km $\\to$ m $\\times1000$; m $\\to$ cm $\\times100$; cm $\\to$ mm $\\times10$. Large $\\to$ small: multiply; small $\\to$ large: divide.',
    'Mass: $1\\ \\text{t} = 1000\\ \\text{kg}$; $1\\ \\text{kg} = 1000\\ \\text{g}$. Tonne $\\to$ g: $\\times 1\\ 000\\ 000$.',
    'Capacity: 1 L = 1000 mL. 1 mL = 1 cm³.',
    'Time: 60 s = 1 min; 60 min = 1 h. Borrow 60 (not 100) when subtracting time.',
    '$P_{\\text{rect}} = 2(L+W)$; $P_{\\text{sq}} = 4L$. $A_{\\text{rect}} = LW$; $A_{\\text{tri}} = \\frac{1}{2}bh$. $V = L \\times W \\times H$.',
  ],
  exam_tips: [
    'Convert all measurements to the same unit before adding or subtracting.',
    'Tonne to gram: multiply by 1 000 000 (two steps).',
    'L-shaped perimeter = perimeter of bounding rectangle.',
  ],
  visual_descriptions: [
    'Length scale: km for roads, m for rooms, cm for pencils.',
    'Cuboid: three dimensions L, W, H; volume fills the space.',
    '1 ha = 10 000 m²; square hectare has side ≈ 100 m.',
  ],
};

const scalesForm1Notes: MathTopicNotes = {
  topic: 'Scales',
  subject: 'Mathematics',
  grade_level: 'Form 1',
  summary:
    'Comprehensive Form 1 notes on scales: meaning of scale, RF/statement/bar scales, conversions, map-to-ground calculations, ground-to-map calculations, deriving scale, enlargement and reduction, and exam-style revision.',
  sections: [
    {
      title: '1. Introduction to Scale',
      content:
        'Scale is the fixed ratio between a drawing and the real object.\n\nCore relationship:\n$$\\text{Drawing Length} : \\text{Actual Length}$$\n\nStandard form:\n$$1:n$$\n\nConnection to direct variation:\n$$x = ky$$\n\nAlways convert measurements to the same unit before simplifying.\n\n**Examples:**\n1. "1 cm represents 5 km": $5\\ \\text{km} = 500{,}000\\ \\text{cm}$, so $1:500{,}000$.\n2. "2 cm represents 1 m": $2:100 = 1:50$.\n3. "5 cm represents 2 km": $5:200{,}000 = 1:40{,}000$.\n4. $1:25{,}000$ means 1 cm represents $25{,}000\\ \\text{cm} = 250\\ \\text{m}$.\n\n**Common Error:** Never write "1 cm to 2 km" as $1:2$.\n\n**Practice 1:**\n1. Convert "1 cm to 10 km" to $1:n$.\n2. Convert "5 cm to 1 m" to $1:n$.\n3. Convert "2 cm to 500 m" to $1:n$.',
    },
    {
      title: '2. Types of Scales: Statement, RF, and Linear',
      content:
        '**Statement Scale:** e.g. "1 cm represents 2 km".\n\n**Representative Fraction (RF):** e.g. $\\frac{1}{50{,}000}$ or $1:50{,}000$.\n\n**Linear Scale:** Bar scale marked in equal units.\n\n**Examples:**\n1. "1 cm to 4 km" $\\Rightarrow$ RF $1:400{,}000$.\n2. RF $1:20{,}000$ $\\Rightarrow$ statement: "1 cm represents 200 m".\n3. "2 cm to 5 km" $\\Rightarrow 2:500{,}000 = 1:250{,}000$.\n4. "5 cm to 1 km" $\\Rightarrow 1:20{,}000$.\n5. RF $1:1{,}000{,}000$ $\\Rightarrow$ "1 cm represents 10 km".\n\n**Exam Tip:** Final RF must be in the form $1:n$.',
    },
    {
      title: '3. Finding Actual Distance from Map Distance',
      content:
        'For scale $1:n$:\n$$\\text{Actual} = \\text{Map} \\times n$$\n\n**Examples:**\n1. $1:50{,}000$, map $6\\ \\text{cm}$:\n   $$6 \\times 50{,}000 = 300{,}000\\ \\text{cm} = 3\\ \\text{km}$$\n2. $1:500$, map $12\\ \\text{cm}$:\n   $$12 \\times 500 = 6{,}000\\ \\text{cm} = 60\\ \\text{m}$$\n3. $1:250{,}000$, map $4.2\\ \\text{cm}$:\n   $$4.2 \\times 250{,}000 = 1{,}050{,}000\\ \\text{cm} = 10.5\\ \\text{km}$$\n\n**Practice 2:**\n1. Scale $1:100{,}000$, map $5\\ \\text{cm}$.\n2. Scale $1:25{,}000$, map $8.2\\ \\text{cm}$.',
    },
    {
      title: '4. Finding Map Distance from Actual Distance',
      content:
        'Rearrange:\n$$\\text{Map} = \\frac{\\text{Actual}}{n}$$\n\nConvert actual distance to cm first.\n\n**Examples:**\n1. Actual $15\\ \\text{km}$, scale $1:50{,}000$:\n   $$15\\ \\text{km} = 1{,}500{,}000\\ \\text{cm},\\quad \\text{Map} = \\frac{1{,}500{,}000}{50{,}000} = 30\\ \\text{cm}$$\n2. Actual $400\\ \\text{m}$, scale $1:2{,}000$:\n   $$40\\ 000\\ \\text{cm} \\div 2\\ 000 = 20\\ \\text{cm}$$\n3. Actual $1.2\\ \\text{km}$, scale $1:10{,}000$:\n   $$120\\ 000\\ \\text{cm} \\div 10\\ 000 = 12\\ \\text{cm}$$',
    },
    {
      title: '5. Deriving the Scale from Given Distances',
      content:
        'Use map : actual and simplify to $1:n$.\n\n**Examples:**\n1. $5\\ \\text{cm}$ represents $2\\ \\text{km}$:\n   $$5:200{,}000 = 1:40{,}000$$\n2. $10\\ \\text{cm}$ model, $5\\ \\text{m}$ actual:\n   $$10:500 = 1:50$$\n3. $8\\ \\text{cm}$ represents $400\\ \\text{m}$:\n   $$8:40{,}000 = 1:5{,}000$$',
    },
    {
      title: '6. Enlargement and Reduction',
      content:
        '- Reduction: scale factor $< 1$.\n- Enlargement: scale factor $> 1$.\n\n**Examples:**\n1. Rectangle $4\\times2\\ \\text{cm}$ enlarged by 3 $\\Rightarrow 12\\times6\\ \\text{cm}$.\n2. Square side $10\\ \\text{cm}$ reduced by $\\frac{1}{5}$ $\\Rightarrow 2\\ \\text{cm}$.\n3. Base from $6\\ \\text{cm}$ to $15\\ \\text{cm}$ gives scale factor:\n   $$\\frac{15}{6} = 2.5$$\n4. If linear scale is $1:n$, then area scale is $1:n^2$.',
    },
    {
      title: '7. ZIMSEC-Style Integrated Problems',
      content:
        '1. Plan $1:200$, hall $5\\ \\text{cm}$ by $3\\ \\text{cm}$.\n   - Actual: $10\\ \\text{m}$ by $6\\ \\text{m}$.\n   - Perimeter: $2(10+6)=32\\ \\text{m}$.\n2. Map $1:250{,}000$, villages $14.4\\ \\text{cm}$ apart, speed $60\\ \\text{km/h}$.\n   - Distance: $14.4\\times250{,}000=3{,}600{,}000\\ \\text{cm}=36\\ \\text{km}$.\n   - Time: $\\frac{36}{60}=0.6\\ \\text{h}=36\\ \\text{minutes}$.\n3. Model wingspan $25\\ \\text{cm}$, actual wingspan $10\\ \\text{m}$.\n   - Scale: $25:1000 = 1:40$.\n   - Actual length $12\\ \\text{m}$ gives model length $\\frac{1200}{40}=30\\ \\text{cm}$.',
    },
    {
      title: '8. Revision, Test, and Marking Memorandum',
      content:
        '**Selected Revision Questions:**\n1. Express "1 cm to 8 km" as RF.\n2. Convert $1:25{,}000$ to statement form in cm to m.\n3. Map $5.5\\ \\text{cm}$ at $1:50{,}000$, find actual km.\n4. Find scale if $4\\ \\text{cm}$ represents $100\\ \\text{m}$.\n5. Convert RF $1:12{,}500$ to cm-to-m statement.\n\n**Answers:**\n1. $1:800{,}000$\n2. 1 cm to 250 m\n3. $2.75\\ \\text{km}$\n4. $1:2{,}500$\n5. 1 cm to 125 m\n\n**Structured Test Memo (sample):**\n1. (a) $3.6\\ \\text{km}$ (b) $30\\ \\text{cm}$\n2. (a) $12\\ \\text{cm}$ by $8\\ \\text{cm}$ (b) $9\\ \\text{m}$\n3. (a) $30\\ \\text{cm}$ (b) $100\\ \\text{m}^2$\n4. (a) $15.5\\ \\text{km}$ (b) $3\\ \\text{minutes}$\n5. (a) $1:500$ (b) $10\\ \\text{cm}$ (c) $50\\ \\text{m}$.',
    },
  ],
  key_points: [
    'Scale is a ratio between drawing distance and actual distance.',
    'Always convert units before simplifying to $1:n$.',
    '$\\text{Actual} = \\text{Map} \\times n$ and $\\text{Map} = \\frac{\\text{Actual}}{n}$.',
    'RF has no units because both quantities are expressed in the same unit.',
    'For scale factor $k$: lengths scale by $k$, areas by $k^2$, volumes by $k^3$.',
  ],
  exam_tips: [
    'Show all conversion steps clearly to secure method marks.',
    'Write final answers in required units (cm, m, or km).',
    'Ensure final scale is in standard form $1:n$.',
    'Do not skip conversion from km or m to cm when deriving scale.',
  ],
  visual_descriptions: [
    'Scale conversion ladder: km to m to cm before ratio simplification.',
    'Formula box for map-to-actual and actual-to-map operations.',
    'Comparison panel of statement scale, RF, and bar scale.',
  ],
};

const mensurationForm1Notes: MathTopicNotes = {
  topic: 'Mensuration',
  subject: 'Mathematics',
  grade_level: 'Form 1',
  summary:
    'Mensuration covers measurement of geometric figures: length, area, and volume. Essential for land surveying (hectares), construction, and ZIMSEC Paper 1/2. Topics include perimeter, area of plane shapes, circles, volume and surface area of cuboids and cubes.',
  sections: [
    {
      title: '1. Introduction and Unit Conversions',
      content:
        '**Mensuration** is the measurement of geometric figures—length, area, and volume. In Zimbabwe, used for land valuation (A1/A2 farms in hectares) and construction.\n\n**Conversion factors:** 10 mm = 1 cm; 100 cm = 1 m; 1 000 m = 1 km; 1 ha = 10 000 m²; 1 000 g = 1 kg.\n\n**Exam rule:** Always give answers with correct units. Convert all measurements to the same unit before calculating.',
    },
    {
      title: '2. Perimeter of Plane Shapes',
      content:
        '**Perimeter** = total distance around a closed figure. Units: m, cm, km.\n\n**Formulas:** Square: $P = 4s$. Rectangle: $P = 2(l + w)$ or $2l + 2w$. Triangle: $P = a + b + c$.\n\n**Common error:** Rectangle has four sides—use $2(l+w)$, not just $l+w$.',
      worked_examples: [
        {
          question: 'Square garden side 219,1 m. Find perimeter.',
          steps: ['$P = 4 \\times 219{,}1 = 876{,}4$'],
          final_answer: '876,4 m',
        },
        {
          question: 'Rectangle 3,6 m by 2,2 m. Find perimeter.',
          steps: ['P = 2(3,6 + 2,2) = 2(5,8) = 11,6'],
          final_answer: '11,6 m',
        },
        {
          question: 'Triangle sides 13 km, 18 km, 22,2 km. Find perimeter.',
          steps: ['P = 13 + 18 + 22,2 = 53,2'],
          final_answer: '53,2 km',
        },
      ],
    },
    {
      title: '3. Area of Plane Figures',
      content:
        '**Area** = surface covered. Units: m², cm², ha (1 ha = 10 000 m²).\n\n**Formulas:** Square: $A = s^2$. Rectangle: $A = l \\times w$. Triangle: $A = \\frac{1}{2}bh$.\n\n**Key:** If side doubles, area quadruples ($2^2 = 4$).',
      worked_examples: [
        {
          question: '4,8 ha to m².',
          steps: ['$4{,}8 \\times 10\\ 000 = 48\\ 000$'],
          final_answer: '48 000 m²',
        },
        {
          question: 'Square area 48 000 m². Find side (1 d.p.).',
          steps: ['$s = \\sqrt{48\\ 000} \\approx 219{,}1$'],
          final_answer: '219,1 m',
        },
        {
          question: 'Rectangle 3,6 m by 2,2 m. Find area.',
          steps: ['A = 3,6 × 2,2 = 7,92'],
          final_answer: '7,92 m²',
        },
        {
          question: 'Triangle base 8 m, height 15 m. Find area.',
          steps: ['$A = \\frac{1}{2} \\times 8 \\times 15 = 60$'],
          final_answer: '60 m²',
        },
      ],
    },
    {
      title: '4. Circumference and Area of a Circle',
      content:
        'Use $\\pi = \\frac{22}{7}$ or 3,142. **Circumference:** $C = 2\\pi r$ or $C = \\pi d$. **Area:** $A = \\pi r^2$.\n\n**Exam tip:** Show substitution into formula for method marks. Round to 3 s.f. unless stated.',
      worked_examples: [
        {
          question: 'Circle r = 45 cm. Find circumference (π = 3,142).',
          steps: ['$C = 2 \\times 3{,}142 \\times 45 = 282{,}78$'],
          final_answer: '282,78 cm',
        },
        {
          question: 'Circle d = 14 m. Find area (π = 22/7).',
          steps: [
            '$r = 14 \\div 2 = 7$ m',
            '$A = \\frac{22}{7} \\times 7^2 = 154$',
          ],
          final_answer: '154 m²',
        },
        {
          question: 'Circumference 44 cm. Find radius, hence area (π = 22/7).',
          steps: [
            '$44 = 2 \\times \\frac{22}{7} \\times r \\Rightarrow r = 7$',
            '$A = \\frac{22}{7} \\times 49 = 154$',
          ],
          final_answer: 'r = 7 cm; A = 154 cm²',
        },
      ],
    },
    {
      title: '5. Volume of Solids',
      content:
        '**Volume** = 3D space. Units: cm³, m³. **Formulas:** Cuboid: $V = l \\times w \\times h$. Cube: $V = s^3$.\n\n**Common error:** Convert mixed units first (e.g. 1 m, 50 cm, 20 cm → 100 cm, 50 cm, 20 cm).',
      worked_examples: [
        {
          question: 'Cube side 6 cm. Find volume.',
          steps: ['$V = 6^3 = 216$'],
          final_answer: '216 cm³',
        },
        {
          question: 'Cuboid 10 × 8 × 5 cm. Find volume.',
          steps: ['$V = 10 \\times 8 \\times 5 = 400$'],
          final_answer: '400 cm³',
        },
        {
          question: 'How many 2 cm cubes fit in cuboid 10 × 8 × 6 cm?',
          steps: [
            'V_cuboid = 480 cm³; V_cube = 8 cm³',
            '$480 \\div 8 = 60$',
          ],
          final_answer: '60 cubes',
        },
      ],
    },
    {
      title: '6. Surface Area of Solids',
      content:
        '**Surface area** = total area of all faces. **Cube:** $SA = 6s^2$. **Cuboid:** $SA = 2(lw + lh + wh)$.\n\n**Four walls:** $2(\\text{length} \\times \\text{height}) + 2(\\text{width} \\times \\text{height})$.',
      worked_examples: [
        {
          question: 'Cube side 5 cm. Find surface area.',
          steps: ['SA = 6 × 25 = 150'],
          final_answer: '150 cm²',
        },
        {
          question: 'Cuboid l=10, w=8, h=5 cm. Find SA.',
          steps: [
            'SA = 2[(10×8) + (10×5) + (8×5)]',
            'SA = 2[80 + 50 + 40] = 340',
          ],
          final_answer: '340 cm²',
        },
        {
          question: 'Room 4 m × 3 m × 2,5 m. Area of four walls?',
          steps: ['2(4×2,5) + 2(3×2,5) = 20 + 15 = 35'],
          final_answer: '35 m²',
        },
      ],
    },
    {
      title: '7. Mixed Revision',
      content:
        '1. 7,24 km → m. 2. Square side 15 cm → perimeter. 3. Rectangle 3,6 × 2,2 m → area. 4. Circle r=7 cm → circumference. 5. Cube side 2 cm → volume. 6. Triangle b=8, h=15 → area. 7. 4,8 ha → m². 8. Cube side 4 cm → SA. 9. Circle d=10 cm → area. 10. Rectangle 20×15 m → perimeter. 11–25: kg→g; cuboid volume; side from area; circumference; area; triangle perimeter; SA; cm→m; square area; mass from volume; radius from C; perimeter; volume; triangle area; cube SA.',
    },
    {
      title: '8. Exam-Style Structured Test',
      content:
        '**Q1:** Rectangular field 390 × 285 km → perimeter; fencing cost at 0,65 per km.\n\n**Q2:** Circle C=88 cm → radius; hence area.\n\n**Q3:** Square 4,8 ha → m²; side length.\n\n**Q4:** Cube 6 cm → volume; mass if density 11 g/cm³.\n\n**Q5:** Room 5×4×3 m → volume; four walls area.\n\n**Q6:** Cylinder r=7, h=10 cm → base area; volume.\n\n**Q7–Q12:** Melting cuboid to cubes; triangle area; circumference→square side; SA; diagonal; chalkboard area.',
    },
    {
      title: '9. Memo and Solutions',
      content:
        '**Revision:** 1. 7 240 m. 2. 60 cm. 3. 7,92 m². 4. 44 cm. 5. 8 cm³. 6. 60 m². 7. 48 000 m². 8. 96 cm². 9. 78,6 cm². 10. 70 m. 11. 10 980 g. 12. 100 cm³. 13. 10 m. 14. 44 m. 15. 3,14 m². 16. 56. 17. 52 cm². 18. 0,42 m. 19. 48 005 m². 20. 420 g. 21. r=7 cm. 22. 26,7 m. 23. 6 000 cm³. 24. 55 600 m². 25. 1,5 m².\n\n**Exam:** Q1(a) 1 350 km, (b) 877,50. Q2(a) r=14 cm, (b) 616 cm². Q3(a) 48 000 m², (b) 219,1 m. Q4(a) 216 cm³, (b) 2 376 g. Q5(a) 60 m³, (b) 54 m². Q6(a) 154 cm², (b) 1 540 cm³. Q7: 50 cubes. Q8: 60 m². Q9(a) 283 cm, (b) 70,7 cm. Q10: 4,7 m². Q11: 310 m. Q12: 7,92 m².',
    },
  ],
  key_points: [
    '$P_{\\text{sq}} = 4s$; $P_{\\text{rect}} = 2(l+w)$; $P_{\\text{tri}} = a+b+c$.',
    '$A_{\\text{sq}} = s^2$; $A_{\\text{rect}} = lw$; $A_{\\text{tri}} = \\frac{1}{2}bh$.',
    'Circle: $C = 2\\pi r = \\pi d$; $A = \\pi r^2$. Use $\\pi = 22/7$ or 3,142.',
    'Cuboid $V = lwh$; Cube $V = s^3$. SA cube $= 6s^2$; SA cuboid $= 2(lw+lh+wh)$.',
    '1 ha = 10 000 m². Convert units before calculating.',
  ],
  exam_tips: [
    'Always include units in final answer—missing units loses marks.',
    'Rectangle perimeter uses 2(l+w), not l+w.',
    'Show formula substitution for method marks even if arithmetic fails.',
  ],
  visual_descriptions: [
    'Cuboid net: 6 rectangles; pair faces equal.',
    'Volume = capacity (holding); SA = material cost (painting).',
    '1 ha square ≈ 100 m side.',
  ],
};

const form1Notes: Record<string, MathTopicNotes> = {
  ...Object.fromEntries(
    Object.entries(form1Objectives)
      .filter(([k]) => k !== 'Number Concepts and Operations' && k !== 'Approximation and Estimation' && k !== 'Ratios' && k !== 'Large and Small Numbers' && k !== 'Number Bases' && k !== 'Sets and Set Notation' && k !== 'Types of Sets' && k !== 'Scales' && k !== 'Consumer Arithmetic' && k !== 'Measures' && k !== 'Mensuration')
      .map(([topic, objectives]) => [topic, buildFormNote(topic, objectives, 'Form 1')])
  ),
  'Number Concepts and Operations': numberConceptsForm1Notes,
  'Approximation and Estimation': approximationEstimationForm1Notes,
  'Ratios': ratiosForm1Notes,
  'Large and Small Numbers': largeAndSmallNumbersForm1Notes,
  'Number Bases': numberBasesForm1Notes,
  'Sets and Set Notation': setsAndSetNotationForm1Notes,
  'Types of Sets': typesOfSetsForm1Notes,
  'Consumer Arithmetic': consumerArithmeticForm1Notes,
  Measures: measuresForm1Notes,
  Mensuration: mensurationForm1Notes,
  Scales: scalesForm1Notes,
};

const form2Objectives: Record<string, string[]> = {
  'Number Concepts and Operations': [
    'Find factors and multiples of numbers.',
    'Find Highest Common Factor $\\left(\\mathrm{H.C.F.}\\right)$ and Lowest Common Multiple $\\left(\\mathrm{L.C.M.}\\right)$ of numbers.',
    'Find squares and square roots, for example $\\sqrt{144}=12$.',
    'Find cubes and cube roots, for example $\\sqrt[3]{125}=5$.',
  ],
  'Approximation and Estimation': [
    'Round off numbers to given significant figures.',
    'Estimate values to a stated degree of accuracy.',
  ],
  'Ratios and Proportions': [
    'Simplify ratios and solve ratio problems.',
    'Use direct and inverse proportion to solve problems.',
  ],
  'Standard Form': [
    'Express numbers in standard form $a \\times 10^n$ where $1 \\le a < 10$.',
    'Convert small and large numbers to and from standard form.',
  ],
  'Number Bases': [
    'Convert numbers from any base to base ten.',
    'Convert numbers from base ten to other bases.',
    'Expand numbers in bases using place value.',
  ],
  Scales: [
    'Identify common scale types used on maps and plans.',
    'Find scale from given information and calculate distances.',
    'Measure lengths using a given scale.',
  ],
  Sets: [
    'Find union and intersection of sets.',
    'Identify universal set, union, and intersection in context.',
  ],
  'Venn Diagrams': [
    'Represent sets on Venn diagrams with up to two subsets.',
    'Solve practical problems using Venn diagrams.',
    'Convert word statements into set notation.',
  ],
  Bills: [
    'Interpret household and corporate bills.',
    'Extract relevant bill data for calculations.',
  ],
  'Consumer Arithmetic': [
    'Calculate profit and loss.',
    'Calculate discount values and discounted prices.',
    'Find simple interest using $I=\\frac{PRT}{100}$.',
    'Solve hire purchase problems.',
    'Prepare a simple enterprise budget for a small business.',
  ],
  Mensuration: [
    'Calculate perimeter and area of plane shapes.',
    'Calculate volume of cylinders and cuboids.',
  ],
  'Functional Graphs': [
    'Draw the Cartesian plane using a given scale and plot points.',
    'Construct a table of values for a given linear function.',
    'Draw straight-line graphs.',
  ],
  'Travel Graphs': [
    'Draw and interpret distance-time graphs.',
    'Use distance-time graphs to answer questions.',
  ],
  'Direct Variation': [
    'Express direct variation in algebraic form, for example $y \\propto x$ and $y=kx$.',
    'Solve direct variation problems by finding $k$.',
    'Read and interpret a ready reckoner.',
  ],
  'Variation Graphs': [
    'Draw direct variation graphs accurately.',
    'Interpret data and relationships shown on variation graphs.',
  ],
  'Algebraic Manipulation': [
    'Substitute values into expressions with two or more variables.',
    'Factorise linear and simple quadratic expressions.',
    'Simplify algebraic fractions.',
    'Find H.C.F. and L.C.M. of algebraic expressions.',
    'Expand expressions with brackets.',
  ],
  Equations: [
    'Solve linear equations where the unknown appears on both sides.',
    'Construct linear equations from statements.',
    'Solve equations involving brackets and algebraic fractions.',
    'Solve simultaneous linear equations.',
    'Solve quadratic equations where coefficient of $x^2$ is $1$.',
  ],
  Inequalities: [
    'Represent linear inequalities on a number line.',
    'Formulate linear inequalities from statements.',
    'Solve linear inequalities.',
    'Represent linear inequalities on the Cartesian plane.',
  ],
  Indices: [
    'Apply laws of indices such as $a^m \\times a^n=a^{m+n}$ and $\\frac{a^m}{a^n}=a^{m-n}$.',
    'Calculate squares, square roots, cubes, and cube roots of algebraic expressions.',
  ],
  Bearings: [
    'Name cardinal points and give directions.',
    'Find compass bearings and calculate three-figure bearings.',
  ],
  Polygons: [
    'Name $n$-sided polygons up to $n=10$.',
    'State properties of triangles and quadrilaterals.',
  ],
  'Similarity and Congruency': [
    'Identify similar and congruent figures.',
    'Solve problems involving similarity and congruency.',
  ],
  Construction: [
    'Construct lines and angles accurately.',
    'Bisect lines and angles using geometric instruments.',
  ],
  Symmetry: [
    'Identify lines of symmetry for regular polygons.',
    'Identify symmetry in isosceles triangles, equilateral triangles, and parallelograms.',
  ],
  'Data Representation': [
    'Group statistical data correctly.',
    'Represent data on bar charts and pie charts.',
  ],
  'Measures of Central Tendency': [
    'Define measures of central tendency.',
    'State mode and calculate median and mean.',
  ],
  'Measures of Dispersion': [
    'Define the range of a data set.',
    'Calculate the range from given data.',
  ],
  'Matrices (Dimension and Order)': [
    'Define a matrix and state its order/dimension.',
    'Identify row, column, and square matrices.',
  ],
  'Matrix Operations': [
    'Add and subtract matrices of the same order.',
    'Multiply a matrix by a scalar.',
  ],
  'Vectors (Definition and Types)': [
    'Define a vector and use vector notation.',
    'Identify translation, negative, equal, and parallel vectors.',
  ],
  'Vector Operations': [
    'Add and subtract two or more vectors.',
  ],
  Translation: [
    'Define transformation and translation.',
    'Translate points and plane figures.',
  ],
  Reflection: [
    'Define reflection.',
    'Reflect plane figures in a given mirror line.',
  ],
  Probability: [
    'Define basic probability terms.',
    'Describe experimental probability.',
    'Calculate probability of single events.',
  ],
};

const form2Notes: Record<string, MathTopicNotes> = Object.fromEntries(
  Object.entries(form2Objectives).map(([topic, objectives]) => [topic, buildFormNote(topic, objectives, 'Form 2')])
);

const form3Objectives: Record<string, string[]> = {
  'Number Concepts and Operations': [
    'Apply order of operations in real numbers with precedence: brackets, multiplication/division, then addition/subtraction.',
    'Distinguish rational and irrational numbers, and simplify expressions involving surds such as $\\sqrt{50}=5\\sqrt{2}$.',
    'Work confidently with directed numbers, fractions/decimals, and numerical or shape patterns.',
  ],
  'Approximation and Estimation': [
    'Find lower and upper limits of accuracy for rounded values.',
    'Use limits to solve estimation and bounds problems.',
  ],
  'Ratios, Rates, and Proportions': [
    'Reduce ratios to simplest form and share quantities in a given ratio.',
    'Calculate rates and solve direct/inverse proportion problems from life contexts.',
  ],
  'Ordinary and Standard Form': [
    'Add and subtract numbers in standard form $a\\times10^n$.',
    'Multiply and divide numbers in standard form and convert between ordinary and standard form.',
  ],
  'Number Bases': [
    'Perform addition and subtraction in bases $2$ to $10$.',
    'Solve equations involving number bases and interpret place value correctly.',
  ],
  'Scales and Simple Map Problems': [
    'Calculate distances and areas using map scales.',
    'Link scale factor to area factor and solve practical scale problems.',
  ],
  'Set Builder Notation': [
    'Define sets using set-builder notation.',
    'Use set symbols and listing notation to describe sets consistently.',
  ],
  'Venn Diagrams': [
    'Represent and interpret three-set Venn diagrams.',
    'Solve set problems using intersections, unions, and complements.',
  ],
  'Consumer Arithmetic': [
    'Interpret bank statements and extract data for calculations.',
    'Compute compound interest, commission, and hire purchase values.',
  ],
  'Mensuration: Combined Shapes': [
    'Calculate perimeter of combined plane shapes.',
    'Calculate area of combined plane shapes using decomposition.',
  ],
  'Mensuration: Solids': [
    'Calculate volume of cones using $V=\\frac{1}{3}\\pi r^2h$.',
    'Calculate volume of pyramids using $V=\\frac{1}{3}\\times\\text{base area}\\times h$.',
  ],
  Density: [
    'Use the relation $\\rho=\\frac{m}{V}$ and rearrange for mass or volume.',
    'Solve applied problems involving mass, volume, and density.',
  ],
  'Functional Graphs': [
    'Use function notation and construct linear/quadratic graphs from tables and intercepts.',
    'Sketch linear and quadratic graphs and read unknown values from graphs.',
  ],
  'Travel Graphs': [
    'Use relationships among distance, speed, and time in problem solving.',
    'Draw and interpret distance-time and speed-time graphs, including acceleration contexts.',
  ],
  Variation: [
    'Model direct variation with equations such as $y=kx$.',
    'Model inverse variation with equations such as $y=\\frac{k}{x}$ and sketch inverse graphs.',
  ],
  'Algebraic Manipulation': [
    'Find H.C.F. and L.C.M. of algebraic expressions.',
    'Simplify algebraic fractions and factorise quadratic expressions where $a=1$.',
  ],
  'Simultaneous Equations': [
    'Solve simultaneous linear equations by substitution.',
    'Solve simultaneous linear equations by elimination and by graphing.',
  ],
  'Quadratic Equations': [
    'Solve quadratic equations by factorisation.',
    'Solve quadratic equations graphically and interpret roots.',
  ],
  'Change of Subject': [
    'Rearrange formulas to make a required variable the subject.',
    'Substitute numerical values after changing subject correctly.',
  ],
  'Simultaneous Inequalities (One Variable)': [
    'Solve simultaneous linear inequalities in one variable.',
    'Represent the solution set on a number line.',
  ],
  'Linear Inequalities (Two Variables)': [
    'Represent linear inequalities on the Cartesian plane by shading unwanted regions.',
    'Identify solution regions for simultaneous linear inequalities in two variables.',
  ],
  Indices: [
    'Simplify algebraic expressions using index laws.',
    'Use index rules to solve equations involving powers.',
  ],
  Logarithms: [
    'Evaluate logarithms and apply laws of logarithms.',
    'Simplify expressions and solve equations involving indices and logarithms.',
  ],
  'Angles of Elevation and Depression': [
    'Construct diagrams for angles of elevation and depression.',
    'Solve elevation/depression problems using scale drawing and trigonometric reasoning.',
  ],
  Bearings: [
    'Use compass and three-figure bearings in direction problems.',
    'Locate objects and solve positional problems using bearings.',
  ],
  Polygons: [
    'State properties of $n$-sided polygons including interior/exterior angle facts.',
    'Solve polygon angle problems using angle sum relationships.',
  ],
  'Similarity and Congruency': [
    'Relate scale factor, area factor, and volume factor for similar figures/solids.',
    'Compute areas, volumes, and masses of similar shapes and solids.',
  ],
  Constructions: [
    'Construct triangles and quadrilaterals accurately using geometric instruments.',
    'Use construction results to solve geometric problems.',
  ],
  'Symmetry (Rotational)': [
    'Identify rotational symmetry and order of rotational symmetry.',
    'Construct and solve problems involving rotational symmetry in two dimensions.',
  ],
  'Data Collection and Classification (Grouped Data)': [
    'Collect and classify grouped data and determine class width.',
    'Construct frequency tables for grouped data.',
  ],
  'Data Representation (Grouped Data)': [
    'Represent grouped data using bar charts, pie charts, histograms, and frequency polygons.',
    'Interpret grouped-data graphs accurately.',
  ],
  'Measures of Central Tendency (Grouped Data)': [
    'Calculate mean, median, and mode for grouped data.',
    'Compute mean using the assumed mean method and interpret results.',
  ],
  'Trigonometry: Pythagoras Theorem': [
    'Use Pythagoras theorem $a^2+b^2=c^2$ to find missing sides.',
    'Apply Pythagoras theorem to real-life right-triangle problems.',
  ],
  'Trigonometrical Ratios': [
    'Calculate $\\sin\\theta$, $\\cos\\theta$, and $\\tan\\theta$ for acute and obtuse angles.',
    'Solve two-dimensional right-triangle problems using trigonometrical ratios.',
  ],
  'Vectors: Types': [
    'Identify translational, equal, negative, parallel, and position vectors.',
    'Represent and interpret vectors on the Cartesian plane using proper notation.',
  ],
  'Vector Operations': [
    'Add, subtract, and multiply vectors by scalars.',
    'Compute vector magnitude and solve combined vector-operation problems.',
  ],
  'Matrix Operations': [
    'Perform matrix addition and subtraction where orders are compatible.',
    'Carry out scalar multiplication and matrix multiplication where defined.',
  ],
  Determinants: [
    'Calculate determinants of $2\\times2$ matrices.',
    'Distinguish between singular and non-singular matrices using determinant values.',
  ],
  'Inverse Matrix': [
    'Find the inverse of a non-singular $2\\times2$ matrix.',
    'Solve simultaneous linear equations in two variables using inverse matrices.',
  ],
  'Experimental and Theoretical Probability': [
    'Differentiate experimental probability from theoretical probability.',
    'Use probability space and experiments to compute event probabilities.',
  ],
  'Probability of Single Events': [
    'Apply probability rules to single events.',
    'Compute probabilities of single-event outcomes from experiments and models.',
  ],
  'Translation (Cartesian Plane)': [
    'Represent translations using vectors on the Cartesian plane.',
    'Find image coordinates of translated plane figures.',
  ],
  'Reflection (Cartesian Plane)': [
    'Reflect figures in given mirror lines such as axes or lines $y=x$ and $y=-x$.',
    'Determine image coordinates and identify axis/line of reflection.',
  ],
  'Rotation (Cartesian Plane)': [
    'Describe rotations fully by center, angle, and direction (clockwise/anticlockwise).',
    'Draw rotated images of plane figures on the Cartesian plane.',
  ],
  Enlargement: [
    'Perform enlargements of plane figures from a center of enlargement.',
    'Determine and apply enlargement scale factor.',
  ],
};

const form3Notes: Record<string, MathTopicNotes> = Object.fromEntries(
  Object.entries(form3Objectives).map(([topic, objectives]) => [topic, buildFormNote(topic, objectives, 'Form 3')])
);

const form4Objectives: Record<string, string[]> = {
  'Limits of Accuracy': [
    'Determine lower and upper bounds from rounded values.',
    'Compute minimum and maximum perimeters and areas using bounds.',
    'Solve practical limits-of-accuracy problems.',
  ],
  'Consumer Arithmetic (Exchange and Taxes)': [
    'Convert currencies using foreign exchange rates.',
    'Calculate PAYE, VAT, customs duty, and excise duty in applied contexts.',
    'Interpret tax-related quantities accurately in problem statements.',
  ],
  'Mensuration: Similar Shapes': [
    'Identify similar shapes and related scale factor relationships.',
    'Compute area and volume of similar shapes using factors.',
  ],
  'Mensuration: Prisms and Frustums': [
    'Calculate surface area and volume of prisms.',
    'Calculate volume of frustums using valid mensuration methods.',
  ],
  'Functional Graphs (Cubic and Inverse)': [
    'Draw and interpret cubic function graphs.',
    'Draw and interpret inverse-function graphs.',
    'Solve equations/unknown values using cubic and inverse graphs.',
  ],
  'Travel Graphs (Kinematics)': [
    'Relate displacement, velocity, acceleration, and time.',
    'Draw and interpret displacement-time and velocity-time graphs.',
    'Solve kinematics questions using graph features.',
  ],
  'Joint and Partial Variation': [
    'Form connecting formulas for joint and partial variation.',
    'Find unknown variables from variation equations and graphs.',
  ],
  'Algebraic Manipulation (Fractions)': [
    'Simplify algebraic fractions using L.C.M. of denominators.',
    'Simplify algebraic fractions by factorisation methods.',
  ],
  'Quadratic Equations (Advanced Methods)': [
    'Solve quadratic equations by completing the square.',
    'Use and apply the quadratic formula $x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}$.',
    'Model and solve life-situation problems involving quadratics.',
  ],
  'Linear Programming': [
    'Translate life situations into algebraic inequalities.',
    'Represent feasible regions on the Cartesian plane.',
    'Optimize objective functions in constrained regions.',
  ],
  'Circle Theorems (Angles)': [
    'Apply angle theorems for centre and circumference.',
    'Use semicircle, same segment, and alternate segment theorems in calculations.',
  ],
  'Circle Theorems (Tangents and Cyclic Quads)': [
    'Apply tangent-radius perpendicularity and related tangent properties.',
    'Use cyclic quadrilateral angle properties to solve problems.',
  ],
  'Locus Definitions': [
    'Define locus and construct standard loci: equidistant from point, line, two points, and two intersecting lines.',
    'Construct loci accurately using geometric tools.',
  ],
  'Locus Applications': [
    'Solve locus problems involving bearings, scale, angles of elevation/depression, and area.',
    'Use perpendicular constructions in applied locus contexts.',
  ],
  'Data Representation (Cumulative Frequency)': [
    'Construct grouped frequency and cumulative frequency tables.',
    'Draw and interpret cumulative frequency curves (ogives).',
  ],
  'Measures of Central Tendency (Graph Based)': [
    'Estimate median from cumulative frequency curves.',
    'Estimate quartiles from cumulative frequency curves.',
  ],
  'Measures of Dispersion (Grouped)': [
    'Calculate range, interquartile range, and semi-interquartile range.',
    'Interpret dispersion values for grouped data.',
  ],
  'Trigonometrical Ratios (Advanced Rules)': [
    'Apply sine rule and cosine rule to solve non-right triangles.',
    'Convert between degrees and minutes where needed.',
  ],
  'Trigonometry (3D Problems)': [
    'Solve three-dimensional trigonometric problems using sine and cosine rules.',
  ],
  'Vectors (Plane Shapes)': [
    'Express edges and diagonals as linear combinations of vectors.',
    'Find scalar values in vector equalities and ratio relationships.',
  ],
  'Probability: Combined Events': [
    'Define and analyze combined events.',
    'Compute probabilities for combined-event situations.',
  ],
  'Probability Tools': [
    'Construct and use outcome tables and tree diagrams.',
    'Apply probability rules for combined events and complements.',
  ],
  'Translation (Calculation)': [
    'Determine translation vectors from object-image pairs on Cartesian plane.',
    'Use translation vectors to find image coordinates of other points.',
  ],
  'Reflection (General Lines)': [
    'Reflect plane figures in general lines of the form $y=mx+c$.',
    'Determine axes/lines of reflection from object-image information.',
  ],
  'Reflection (Matrices)': [
    'Use reflection matrices for axes and key lines such as $y=x$ and $y=-x$.',
    'Find image coordinates using matrix multiplication.',
  ],
  'Rotation (Matrices)': [
    'Find rotation matrices about the origin for standard angles.',
    'Transform plane figures with rotation matrices and describe rotations fully.',
  ],
  'Enlargement (Matrices)': [
    'Use enlargement matrices about the origin to find image coordinates.',
  ],
  'Enlargement (General Point)': [
    'Perform enlargements about any centre with rational scale factors.',
    'Describe enlargement fully from matrix/object/image data.',
  ],
  'Stretch (Definition)': [
    'Define one-way and two-way stretch transformations.',
    'Compute image coordinates under stretch matrices.',
  ],
  'Stretch (Description)': [
    'Describe stretch transformations using stretch factors and invariant line/point.',
  ],
  'Shear (Definition)': [
    'Define shear transformations and compute image coordinates from shear matrices.',
    'Draw sheared images of plane figures.',
  ],
  'Shear (Description)': [
    'Describe shears fully using shear factor and invariant line.',
  ],
};

const form4Notes: Record<string, MathTopicNotes> = Object.fromEntries(
  Object.entries(form4Objectives).map(([topic, objectives]) => [topic, buildFormNote(topic, objectives, 'Form 4')])
);

const formNotes: FormNotesMap = {
  'Form 1': form1Notes,
  'Form 2': form2Notes,
  'Form 3': form3Notes,
  'Form 4': form4Notes,
};

export function getMathFormTopicNotes(topic: string, formLevel: MathFormLevel): MathTopicNotes | null {
  const byForm = formNotes[formLevel] || {};
  return byForm[topic] || null;
}
