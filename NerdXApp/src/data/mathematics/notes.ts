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

const travelGraphsForm1Notes: MathTopicNotes = {
  topic: 'Travel Graphs',
  subject: 'Mathematics',
  grade_level: 'Form 1',
  summary:
    'Comprehensive Form 1 Mathematics notes on Travel Graphs (ZIMSEC Syllabus B, 2024–2030). Distance–Time graphs transform numerical motion data into visual narratives. Covers axes and scales, construction, interpreting motion, calculating speed, total distance, and ZIMSEC-style word problems. Aligns with Assessment Objective 9.1.1.',
  sections: [
    {
      title: '1. Introduction to Travel Graphs',
      content:
        'In the ZIMSEC Form 1 Mathematics syllabus (Syllabus B, 2024–2030), travel graphs serve as a strategic bridge between algebraic reasoning and visual data interpretation. These graphs, specifically referred to as **Distance–Time graphs**, transform raw numerical data regarding motion into visual narratives. By representing a journey on a Cartesian plane, students observe the relationship between the distance covered and the time elapsed, making abstract concepts of movement tangible. This mastery aligns with Assessment Objective 9.1.1, requiring learners to recognize and use mathematical terms and definitions correctly.\n\nA **Travel Graph** is a coordinate-based representation where time is the independent variable and distance is the dependent variable. In accordance with mathematical conventions:\n\n- **Horizontal axis (x-axis):** Independent variable — Time\n- **Vertical axis (y-axis):** Dependent variable — Distance\n\nStandardized units—kilometres (km), metres (m), hours (h), and minutes (min)—are essential. Selecting a correct, consistent scale is critical; improper scaling distorts the steepness of the graph, leading to a false interpretation of speed and rendering the graph mathematically invalid for examination purposes.\n\n**Analytical Task: The Logic of the Axes**\n\nWe place time on the horizontal axis because it progresses at a constant rate regardless of the distance travelled. If we were to use inconsistent increments on the axes, a car moving at a steady $60\\ \\text{km/h}$ might appear to be accelerating or slowing down visually. This would violate the principle of accurate data representation required in ZIMSEC Paper 2.',
    },
    {
      title: '2. Worked Examples: Identifying Axes and Scales',
      content:
        '| Example | Scenario | x-axis | y-axis | Scale (x) | Scale (y) |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| 1 | Student walks 1,2 km in 15 min | Time (min) | Distance (m) | 2 cm = 5 min | 2 cm = 400 m |\n| 2 | Bus Harare–Bulawayo 440 km in 6 h | Time (h) | Distance (km) | 2 cm = 1 h | 1 cm = 50 km |\n| 3 | Sprinter 100 m in 12 s | Time (s) | Distance (m) | 2 cm = 2 s | 2 cm = 10 m |\n| 4 | Delivery van 45 min in suburb | Time (min) | Distance (km) | 1 cm = 5 min | 1 cm = 1 km |\n| 5 | Airplane Harare–Johannesburg 1 h 45 min | Time (min) | Distance (km) | 1 cm = 15 min | 1 cm = 100 km |\n| 6 | Cyclist 60 km in 3 h | Time (h) | Distance (km) | 2 cm = 0,5 h | 1 cm = 5 km |\n| 7 | Snail 50 cm in 10 min | Time (min) | Distance (cm) | 1 cm = 1 min | 1 cm = 5 cm |\n| 8 | Hiker 15 km in 5 h with breaks | Time (h) | Distance (km) | 1 cm = 1 h | 1 cm = 2 km |\n\n**Formative Assessment 1**\n\n1. On which axis must the independent variable (time) always be placed?\n2. Why is a non-linear scale (e.g. jumping from 5 to 20 to 25) prohibited in ZIMSEC exams?\n3. If a journey covers 800 km, is a scale of 1 cm to 1 km practical for a standard A4 page? Explain.\n4. Name the standard SI unit for time used in high-speed racing graphs.\n5. Identify the coordinates $(t, d)$ of the origin on a travel graph and state what they represent.',
    },
    {
      title: '3. Constructing Distance–Time Graphs',
      content:
        'Construction begins with a **Table of Values**, a structured organisation of data points that serves as the blueprint for the Cartesian plane.\n\n**Plotting:** Locate coordinates (Time, Distance). Connect points by line segments.\n\n- **Straight sloped line:** Constant speed\n- **Horizontal line:** Stationary (time passes, distance unchanged)\n- **Line sloping back toward x-axis:** Return journey\n- **Curved line:** Changing speed (acceleration or deceleration)\n\n**Analytical Task: Contrasting Motion States**\n\n- **Moving away:** Line rises from left to right\n- **Returning:** Line falls toward the x-axis\n- **Horizontal:** Zero speed. Since $S = D \\div T$, if $\\Delta D = 0$ over a duration, speed $= 0$.\n\n**Worked Examples: Tables and Plotting**\n\n**Example 1 – Constant Speed:** Time (h): 0, 1, 2, 3 | Distance (km): 0, 50, 100, 150. Plot $(0,0)$, $(1,50)$, $(2,100)$, $(3,150)$; connect with one straight line. Straight slope confirms constant speed of $50\\ \\text{km/h}$.\n\n**Example 2 – Rest Stop:** Time (min): 0, 10, 20, 30 | Distance (m): 0, 400, 400, 800. Rise to $(10,400)$, horizontal to $(20,400)$, then slope up to $(30,800)$. Horizontal segment shows stationary for 10 minutes.\n\n**Example 3 – Two Legs:** Time (h): 0, 2, 3, 4 | Distance (km): 0, 40, 100, 120. Segment $(2,40)$ to $(3,100)$ is steeper than $(0,0)$ to $(2,40)$; faster in third hour.\n\n**Example 4 – Return Journey:** Time (h): 0, 1, 2 | Distance (km): 0, 60, 0. Rise to $(1,60)$, drop to $(2,0)$. Returned to start at 2 hours.\n\n**Example 5 – Multiple Stops:** Time (min): 0, 5, 10, 15, 20 | Distance (m): 0, 100, 100, 250, 250. Two horizontal segments at $y = 100$ and $y = 250$.\n\n**Example 6 – Walking to Shop:** Time (min): 0, 8, 15 | Distance (m): 0, 600, 600. Steady climb to $(8,600)$, horizontal to $(15,600)$; at shop for 7 minutes.\n\n**Example 7 – Acceleration:** Time (s): 0, 2, 4, 6 | Distance (m): 0, 4, 16, 36. Smooth curve getting steeper; object accelerating.\n\n**Example 8 – Long Haul with Break:** Time (h): 0, 4, 6, 10 | Distance (km): 0, 320, 320, 800. Slope to $(4,320)$, 2 h flat line, steeper slope to $(10,800)$.\n\n**Common Errors:** Axis swapping; inconsistent increments; using curved line for constant speed or jagged line for rest.',
    },
    {
      title: '4. Formative Assessment 2 and Common Errors',
      content:
        '**Formative Assessment 2**\n\n1. Draw a table of values for a vehicle travelling at $60\\ \\text{km/h}$ for 2,5 hours.\n2. If a graph shows a horizontal line from $(3, 10)$ to $(5, 10)$, how long was the object stationary?\n3. Describe the visual difference between a journey at $20\\ \\text{km/h}$ and one at $80\\ \\text{km/h}$.\n4. Why is a vertical line (straight up) impossible on a travel graph? (Hint: Think about time.)\n\n**Common Errors in Construction**\n\n- **Axis Swapping:** Plotting Time on the y-axis; violates independent variable logic.\n- **Inconsistent Increments:** Jumping from 10 to 20 and then to 50 on a single axis.\n- **Line Style Confusion:** Using a curved line for constant speed or a jagged line for a rest stop.',
    },
    {
      title: '5. Interpreting Motion and Reading Values',
      content:
        'A travel graph is a "snapshot" of a journey. By analysing gradients and coordinate pairs, we identify when an object was moving at high velocity or at rest (Assessment Objective 9.1.9).\n\n**Key cues:** The gradient (steepness). A steeper line indicates higher speed. To read a value: identify a point on the x-axis (time), move vertically to the line, then horizontally to the y-axis for distance.\n\n**Analytical Task:** When comparing two segments, the segment with the greater vertical rise over the same horizontal run represents higher velocity, because the gradient $\\dfrac{\\text{rise}}{\\text{run}}$ is the rate of travel.\n\n**Worked Examples: Reading the Graph**\n\n1. Line connects $(1, 40)$ and $(2, 80)$. At $t = 1{,}5\\ \\text{h}$, distance $= 60\\ \\text{km}$.\n2. Line reaches $y = 100$ at $x = 5$; time to travel 100 m is 5 s.\n3. Horizontal from $(12, 5)$ to $(15, 5)$; stop lasted $15 - 12 = 3$ minutes.\n4. Graph peaks at $(4, 200)$; furthest point was 200 km.\n5. Horizontal at $y = 500$ from $t = 2$ to $t = 6$; at $t = 4$ min, distance $= 500$ m.\n6. Segment A $(0,0)$ to $(2, 20)$ vs Segment B $(2, 20)$ to $(3, 60)$; B steeper, faster in final hour.\n7. Line intersects x-axis at $(8, 0)$; return completed at 8 hours.\n8. Line $(0,0)$ to $(40, 200)$; midpoint $t = 20$ gives distance $= 100$ m.',
    },
    {
      title: '6. Formative Assessment 3',
      content:
        '1. If a line is perfectly horizontal, what is the speed?\n2. A graph shows a person at 12 km at $t = 4$ and 12 km at $t = 5$. What occurred?\n3. How do we identify the "fastest" leg of a journey visually?\n4. Find the distance at $t = 2$ for a line connecting $(0,0)$ and $(4, 100)$.\n5. At what time does a traveller return home if the line hits the x-axis at $t = 10{,}5$?',
    },
    {
      title: '7. Calculating Speed from the Graph',
      content:
        'The mathematical transition from observation to calculation uses the speed formula. In ZIMSEC Mathematics, **speed is the gradient** of the distance–time graph.\n\n**Core formula:**\n$$S = \\frac{D}{T} \\quad \\text{or} \\quad S = D \\div T$$\n\nUse **Step-by-Step Substitution** for full marks in Paper 1 and 2.\n\n**Worked Examples**\n\n1. **Basic:** $S = 150 \\div 3 = 50\\ \\text{km/h}$\n2. **Walking:** $S = 400 \\div 8 = 50\\ \\text{m/min}$\n3. **Gradient:** Points $(2, 60)$ to $(4, 180)$. $\\Delta D = 120$, $\\Delta T = 2$. $S = 120 \\div 2 = 60\\ \\text{km/h}$\n4. **Unit conversion:** 20 km in 30 min. $30 \\div 60 = 0{,}5\\ \\text{h}$. $S = 20 \\div 0{,}5 = 40\\ \\text{km/h}$\n5. **Sprint:** $S = 100 \\div 10 = 10\\ \\text{m/s}$\n6. **Stationary:** $S = 0 \\div 15 = 0\\ \\text{km/h}$\n7. **High speed:** $(0,0)$ to $(0{,}5, 50)$: $S = 50 \\div 0{,}5 = 100\\ \\text{km/h}$\n8. **Complex conversion:** 6 km in 45 min. $45 \\div 60 = 0{,}75\\ \\text{h}$. $S = 6 \\div 0{,}75 = 8\\ \\text{km/h}$\n\n**Common Errors:** Formula inversion ($T \\div D$); mixing units (km ÷ min but labelling km/h).',
      worked_examples: [
        {
          question: 'Calculate speed from points $(2, 60)$ to $(4, 180)$.',
          steps: [
            'Change in D: $180 - 60 = 120$; Change in T: $4 - 2 = 2$',
            'Substitution: $S = 120 \\div 2$',
          ],
          final_answer: '$60\\ \\text{km/h}$',
        },
        {
          question: '20 km in 30 minutes. Find speed in km/h.',
          steps: [
            'Conversion: $30 \\div 60 = 0{,}5\\ \\text{h}$',
            'Substitution: $S = 20 \\div 0{,}5 = 40$',
          ],
          final_answer: '$40\\ \\text{km/h}$',
        },
      ],
    },
    {
      title: '8. Formative Assessment 4',
      content:
        'Calculate speed for:\n\n1. $D = 240\\ \\text{km}$, $T = 4\\ \\text{h}$\n2. $D = 1000\\ \\text{m}$, $T = 200\\ \\text{s}$\n3. Points $(0,0)$ to $(3, 15)$\n4. $D = 15\\ \\text{km}$, $T = 15\\ \\text{min}$ (Answer in km/h)\n5. $D = 45\\ \\text{km}$, $T = 1{,}5\\ \\text{h}$\n6. Points $(1, 20)$ to $(2, 20)$',
    },
    {
      title: '9. Total Distance Travelled',
      content:
        'Analysing a full journey involves summing all movements. **Total Distance** = entire path taken. **Displacement** = final gap between start and end (ZIMSEC Objective 9.1.13).\n\n**Distance vs Displacement:** In a return journey, total distance increases (adding return km). Displacement decreases (moving toward $y = 0$).\n\n**Worked Examples**\n\n1. 80 km out, 80 km back: $80 + 80 = 160\\ \\text{km}$\n2. 3 km, stop, 2 km more: $3 + 0 + 2 = 5\\ \\text{km}$\n3. Mutare–Rusape 90 km, then 80 km to Marondera: $90 + 80 = 170\\ \\text{km}$\n4. Graph rises to 30 km, flat 1 h, falls to 0: $30 + 0 + 30 = 60\\ \\text{km}$\n5. 5 laps of 400 m track: $5 \\times 400 = 2000\\ \\text{m}$\n6. 12 km out, 2 km stop, 5 km out, 17 km return: $12 + 5 + 17 = 34\\ \\text{km}$\n7. Points $(0,0)$, $(2, 40)$, $(3, 40)$, $(5, 90)$: segments 40 km, 0 km, 50 km $\\Rightarrow 40 + 50 = 90\\ \\text{km}$\n8. Van: 4 km to A, 3 km to B, 7 km back: $4 + 3 + 7 = 14\\ \\text{km}$',
    },
    {
      title: '10. Formative Assessment 5',
      content:
        '1. Graph points $(0,0)$, $(1, 50)$, $(2, 50)$, $(3, 0)$. Calculate total distance.\n2. In Question 1, what is the final displacement?\n3. If a traveller ends exactly where they started, is the distance always double the furthest point? Explain.\n4. Why does a stop (horizontal line) add zero to the total distance?\n5. A cyclist goes 20 km North and 15 km South. Total distance?',
    },
    {
      title: '11. ZIMSEC-Style Word Problems and Keyword Map',
      content:
        'Success in ZIMSEC Paper 2 requires **Inference and Manipulation** (Objectives 9.1.11 & 9.1.12). Deconstruct narratives into coordinates.\n\n**Keyword-to-Math Map**\n\n- "Stopped/Rested" $\\rightarrow$ Horizontal line ($y$-value stays same)\n- "Back to the start" $\\rightarrow$ $y$-coordinate returns to 0\n- "Constant speed" $\\rightarrow$ Straight sloped line\n- "At the same time" $\\rightarrow$ Intersection of two lines\n\n**Worked Examples**\n\n**Example 1 – The Commute:** Farai walks 2 km in 30 min, stays 4 h, walks home in 45 min. (a) $30\\ \\text{min} = 0{,}5\\ \\text{h}$. Speed to work $= 2 \\div 0{,}5 = 4\\ \\text{km/h}$. (b) Total distance $= 2 + 2 = 4\\ \\text{km}$.\n\n**Example 2 – Bus Journey:** Leaves 07:00, 120 km by 09:00, stops 1 h, 60 km in 1 h. (a) First leg speed $= 120 \\div 2 = 60\\ \\text{km/h}$. (b) Arrival: $09{:}00 + 1\\ \\text{h} + 1\\ \\text{h} = 11{:}00$.\n\n**Example 3 – "Hence determine":** Car at 80 km/h for 40 km. $T = D \\div S = 40 \\div 80 = 0{,}5\\ \\text{h}$ (30 min).\n\n**Example 4 – Coordinate Logic:** Points $(0,0)$, $(1, 60)$, $(2, 60)$, $(4, 0)$. Return speed $= 60 \\div (4-2) = 30\\ \\text{km/h}$.\n\n**Example 5 – Mixed Units:** 15 km in 20 min. $20 \\div 60 = 0{,}333\\ \\text{h}$. $15 \\div 0{,}333 \\approx 45\\ \\text{km/h}$.\n\n**Example 6 – Relative Speed:** Runner A: 10 km in 1 h. Runner B: 10 km in 50 min. B: $10 \\div \\frac{50}{60} = 12\\ \\text{km/h}$. B faster by 2 km/h.\n\n**Example 7 – Broken Path:** 20 km, rest, 15 km. Total time 3 h. Average speed $= 35 \\div 3 \\approx 11{,}67\\ \\text{km/h}$.\n\n**Example 8 – Arrival:** Departs 14:00, 150 km at 75 km/h. $T = 150 \\div 75 = 2\\ \\text{h}$. Arrival at 16:00.',
    },
    {
      title: '12. Comprehensive Revision (25 Questions)',
      content:
        '1. Define a distance–time graph.\n2. Which variable goes on the x-axis?\n3. What does a slope represent?\n4. How is "rest" shown?\n5. State the speed formula.\n6. Calculate speed: $D = 300\\ \\text{km}$, $T = 5\\ \\text{h}$.\n7. What does coordinate $(2, 100)$ mean?\n8. If line A is steeper than line B, which is faster?\n9. Convert 15 min to hours.\n10. Distance out $= 10$, return $= 10$. Total distance?\n11. If $D = 0$, what is the speed?\n12. Find $D$: $S = 80\\ \\text{km/h}$, $T = 2\\ \\text{h}$.\n13. Describe a "return" line.\n14. Why use a consistent scale?\n15. Draw a 30-min stop if 2 cm = 1 hour.\n16. Find $T$: $D = 60$, $x = 2$.\n17. Speed: $(0,0)$ to $(4, 160)$.\n18. Total distance: $(0,0)$ to $(2, 50)$ to $(3, 50)$ to $(4, 0)$.\n19. Units for speed if $D$ in metres and $T$ in seconds?\n20. Meaning of $(0,0)$?\n21. Estimate $D$ at $t = 0{,}5$ if $t = 1$ gives 100.\n22. True/False: Gradient $=$ Speed.\n23. Speed: $D = 20\\ \\text{km}$, $T = 15\\ \\text{min}$ in km/h.\n24. Distance: 10 km out, 0 stop, 4 km out.\n25. Average speed for 200 km in 4 hours?',
    },
    {
      title: '13. Exam-Style Structured Test',
      content:
        '**Question 1 (10 marks):** A cyclist travels 12 km to a friend\'s house in 45 minutes. They stay for 30 minutes and cycle back in 1 hour. (a) Draw a table of values for this journey. (4) (b) Calculate the outward speed in km/h. (3) (c) Calculate the total distance. (3)\n\n**Question 2 (10 marks):** Draw a travel graph: x-axis 2 cm = 1 h; y-axis 1 cm = 10 km. Data: $(0,0)$, $(2, 40)$, $(3, 40)$, $(5, 0)$. (a) Find the speed between $t = 0$ and $t = 2$. (3) (b) How long was the rest? (2) (c) Calculate the return speed. (5)\n\n**Question 3 (5 marks):** A train travels 450 km at 90 km/h. It starts at 05:30. Find the arrival time.\n\n**Question 4 (5 marks):** Contrast total distance and displacement for a car that moves 100 km and returns 100 km.\n\n**Question 5 (5 marks):** List three common errors in travel graph construction.',
    },
    {
      title: '14. Complete Marking Memo',
      content:
        '**Revision Exercise Solutions**\n\n1. A visual representation of distance against time.\n2. Time.\n3. Speed.\n4. Horizontal line.\n5. $S = D \\div T$ or $\\text{Speed} = \\dfrac{\\text{Distance}}{\\text{Time}}$.\n6. $300 \\div 5 = 60\\ \\text{km/h}$.\n7. At 2 hours, the distance is 100 km.\n8. Line A.\n9. $15 \\div 60 = 0{,}25\\ \\text{h}$.\n10. $10 + 10 = 20\\ \\text{km}$.\n11. 0.\n12. $80 \\times 2 = 160\\ \\text{km}$.\n13. Slopes down to the x-axis.\n14. To prevent data distortion.\n15. A 1 cm horizontal line.\n16. 2 hours.\n17. $160 \\div 4 = 40\\ \\text{km/h}$.\n18. $50 + 50 = 100\\ \\text{km}$.\n19. m/s.\n20. Start of journey.\n21. 50 km.\n22. True.\n23. $15 \\div 60 = 0{,}25\\ \\text{h}$; $20 \\div 0{,}25 = 80\\ \\text{km/h}$.\n24. $10 + 4 = 14\\ \\text{km}$.\n25. $200 \\div 4 = 50\\ \\text{km/h}$.\n\n**Exam-Style Test Solutions**\n\n- **Q1a:** Time (h): 0, 0,75, 1,25, 2,25 | Dist (km): 0, 12, 12, 0\n- **Q1b:** $S = 12 \\div 0{,}75 = 16\\ \\text{km/h}$\n- **Q1c:** $12 + 12 = 24\\ \\text{km}$\n- **Q2a:** $S = 40 \\div 2 = 20\\ \\text{km/h}$\n- **Q2b:** $3 - 2 = 1$ hour rest\n- **Q2c:** $S = 40 \\div (5 - 3) = 20\\ \\text{km/h}$\n- **Q3:** $T = 450 \\div 90 = 5\\ \\text{h}$. $05{:}30 + 5\\ \\text{h} = 10{:}30$\n- **Q4:** Distance $= 100 + 100 = 200\\ \\text{km}$. Displacement $= 0\\ \\text{km}$\n- **Q5:** Axis swapping, non-linear scales, missing units.',
    },
  ],
  key_points: [
    'Time on x-axis, distance on y-axis. Consistent, linear scale required.',
    'Straight slope $\\Rightarrow$ constant speed; horizontal $\\Rightarrow$ stationary; downward slope $\\Rightarrow$ return.',
    'Speed $S = \\dfrac{D}{T}$; gradient of distance–time graph $=$ speed.',
    'Total distance $=$ sum of all segments; displacement $=$ final position minus start.',
    'Stopped/rested $\\Rightarrow$ horizontal line; "back to start" $\\Rightarrow$ $y = 0$.',
  ],
  exam_tips: [
    'Use Step-by-Step Substitution for speed calculations to secure method marks.',
    'Convert units (e.g. min $\\rightarrow$ h) before calculating speed when answer must be in km/h.',
    'Avoid axis swapping, non-linear scales, and formula inversion ($T \\div D$).',
    'Show table of values before plotting; label axes with units.',
  ],
  visual_descriptions: [
    'Distance–Time graph: time horizontal, distance vertical; steeper $=$ faster.',
    'Horizontal segment = rest; downward slope = return to origin.',
    'Gradient = rise over run = speed (e.g. km/h or m/s).',
  ],
};

const symbolicExpressionsForm1Notes: MathTopicNotes = {
  topic: 'Mastering Symbolic Expressions',
  subject: 'Mathematics',
  grade_level: 'Form 1',
  summary:
    'Form 1 Mathematics: Mastering Symbolic Expressions (ZIMSEC Syllabus B). Algebra serves as the primary language of the Heritage-based Mathematics syllabus—a practical tool for modelling systems to produce goods and services. Covers variables, constants, terms, expressions, translating words to symbols, simplifying like terms, index laws, substitution, expanding brackets, factorisation, and forming expressions from word problems.',
  sections: [
    {
      title: '1. Foundations of Algebra: Introduction to Algebraic Symbols',
      content:
        'Algebra serves as the primary language of the Heritage-based Mathematics syllabus, acting as a critical engine for industrialisation and entrepreneurship. Within the ZIMSEC Rationale, algebra is positioned not as an abstract theory, but as a practical tool for modelling systems to produce goods and services. By moving from specific numbers to general symbols, learners develop the capacity for innovation—allowing engineers, farmers, and business owners to solve complex, multi-variable problems that drive national development.\n\n**Definitions and Concepts**\n\nTo communicate effectively in the language of algebra, we must define its building blocks:\n\n- **Variable:** A letter (e.g. $x$, $y$, $n$) representing an unknown quantity or a value that can vary.\n- **Constant:** A fixed numerical value that never changes, such as $7$, $-5$, or $0{,}25$.\n- **Term:** A single mathematical component, which can be a number, a variable, or a product of both (e.g. $4$, $x$, $5y$).\n- **Expression:** A collection of terms joined by operators ($+$, $-$, $\\times$, $\\div$). It does not contain an equals sign (e.g. $3x + 4$).\n\n**The "So What?" Layer: Expression vs. Equation**\n\nA Senior Specialist\'s most critical observation is the strategic difference between an expression and an equation. An **expression** is a mathematical "phrase" that represents a value. An **equation** is a mathematical "sentence" that states a relationship of equality between two expressions.\n\n**Strategic Difference:** You can simplify or evaluate an expression, but you cannot "solve" it because there is no balance established. Confusing these two leads to the **"Ghost Equals Sign" error**, where students incorrectly assume every algebraic statement must equal zero.\n\n**Translating Words to Symbols**\n\nIn professional fields like engineering and ICT, problems begin as verbal requirements. In digital spreadsheets, for example, variables are represented by cell references (like A1 or B2).\n\n| Word Statement | Symbolic Expression |\n|----------------|--------------------|\n| Five more than $x$ | $x + 5$ |\n| The product of 3 and $y$ | $3y$ |\n| A number $n$ decreased by 10 | $n - 10$ |\n| Half of $z$ | $\\frac{z}{2}$ |\n| $k$ shared equally among 4 people | $\\frac{k}{4}$ |',
      worked_examples: [
        {
          question: 'Write an expression for "the sum of $a$ and $b$".',
          steps: ['Sum means addition'],
          final_answer: '$a + b$',
        },
        {
          question: 'Translate "twice the value of $w$".',
          steps: ['Twice means multiply by 2'],
          final_answer: '$2w$',
        },
        {
          question: 'Express "7 less than $p$".',
          steps: ['7 less than $p$ means subtract 7 from $p$'],
          final_answer: '$p - 7$',
        },
        {
          question: 'A technician has $x$ metres of cable. If 12 metres are used, how many remain?',
          steps: ['Remaining $=$ total $-$ used'],
          final_answer: '$x - 12$',
        },
        {
          question: 'Represent "the quotient of $m$ and 8".',
          steps: ['Quotient means division'],
          final_answer: '$\\frac{m}{8}$',
        },
        {
          question: 'Write an expression for the total cost of $n$ items at $\\$15$ each.',
          steps: ['Total cost $=$ cost per item $\\times$ number of items'],
          final_answer: '$15n$',
        },
      ],
    },
    {
      title: 'Common Error: The Ghost Equals Sign',
      content:
        '**Never add "$= 0$" to an expression.** $4x + 7$ is a value. It is not "equal" to anything until a relationship is specified. Attempting to "solve" $4x + 7$ is a fundamental logical error.\n\n**Practice Exercise 1.1**\n\n1. Identify the variable and the constant in: $12y - 5$.\n2. Translate into symbols: "The product of 9 and $k$."\n3. Translate into symbols: "15 more than $t$."\n4. State the number of terms in: $3x + 2y - 7z + 1$.\n5. A farmer has $g$ goats. Write an expression for the number of goats if the herd doubles.',
    },
    {
      title: '2. Simplifying Algebraic Expressions: The Logic of Like Terms',
      content:
        'Simplification is the process of reducing complexity to ensure clear communication in technical fields. In engineering and business, streamlined expressions reduce the risk of calculation errors and improve computational efficiency.\n\n**The Logic of Like Terms (The "Why")**\n\nWe only combine terms that are "like"—meaning they share the same variables raised to the same powers.\n\n**Analogy:** 3 cows and 2 cows make 5 cows. However, 3 cows and 2 goats cannot be combined; they remain "3 cows and 2 goats." In algebra, $3x + 2x = 5x$, but $3x + 2y$ cannot be simplified further.\n\n**Sub-Section: Algebraic Expressions in Index Form (Syllabus 8.6)**\n\nWhen we multiply a variable by itself, we use indices (powers).\n\n- $x \\times x = x^2$\n- **Law 1:** $x^a \\times x^b = x^{a+b}$\n- **Law 2:** $x^a \\div x^b = x^{a-b}$\n- **Law 3:** $x^0 = 1$',
      worked_examples: [
        {
          question: 'Simplify $5a + 8a$',
          steps: ['$(5 + 8)a$'],
          final_answer: '$\\boxed{13a}$',
        },
        {
          question: 'Simplify $12x - 4x + x$',
          steps: ['$8x + x$'],
          final_answer: '$\\boxed{9x}$',
        },
        {
          question: 'Simplify $6p + 2q - p + 5q$',
          steps: ['$6p - p + 2q + 5q = 5p + 7q$'],
          final_answer: '$\\boxed{5p + 7q}$',
        },
        {
          question: 'Simplify $b^3 \\times b^2$',
          steps: ['$b^{3+2}$'],
          final_answer: '$\\boxed{b^5}$',
        },
        {
          question: 'Simplify $15m^6 \\div 3m^2$',
          steps: ['$(15 \\div 3)m^{6-2}$'],
          final_answer: '$\\boxed{5m^4}$',
        },
        {
          question: 'Simplify $3a \\times 4b$',
          steps: ['$(3 \\times 4) \\times a \\times b$'],
          final_answer: '$\\boxed{12ab}$',
        },
        {
          question: 'Simplify $4x + 7 - 2x + 3$',
          steps: ['$4x - 2x + 7 + 3$'],
          final_answer: '$\\boxed{2x + 10}$',
        },
        {
          question: 'Simplify $x^2 + 3x + 2x^2$',
          steps: ['$x^2 + 2x^2 + 3x$'],
          final_answer: '$\\boxed{3x^2 + 3x}$',
        },
      ],
    },
    {
      title: 'Common Error: Mixing Unlike Terms',
      content:
        'A frequent mistake is writing $4x + 3y = 7xy$. This is incorrect. $x$ and $y$ are different categories. The expression $4x + 3y$ is already in its simplest form.\n\n**Practice Exercise 2.1**\n\nSimplify the following:\n\n1. $9k + 2k$\n2. $15n - 6n$\n3. $y + y + y + y$\n4. $8a + 3b - 2a + b$\n5. $x^4 \\times x^3$\n6. $10m^5 \\div 2m^2$\n7. $4p \\times 5q$\n8. $12x + 5 - 3x - 8$',
    },
    {
      title: '3. Substitution and Evaluation',
      content:
        'Substitution transforms a general algebraic model into a specific numerical solution. This is essential for using ICT tools, where formulas calculate results based on variable inputs.\n\n**The Golden Rules of Substitution**\n\n1. Always use brackets when replacing a letter with a number (e.g. replace $x$ with $(-2)$).\n2. Follow **Precedence (BODMAS):** Brackets, Orders (Indices), Division/Multiplication, then Addition/Subtraction.',
      worked_examples: [
        {
          question: 'Evaluate $x + 12$ when $x = 5$.',
          steps: ['$= (5) + 12$'],
          final_answer: '\\boxed{17}',
        },
        {
          question: 'Evaluate $5y$ when $y = -3$.',
          steps: ['$= 5(-3)$'],
          final_answer: '\\boxed{-15}',
        },
        {
          question: 'Find $2a + 4b$ if $a = 3$, $b = 2$.',
          steps: ['$= 2(3) + 4(2) = 6 + 8$'],
          final_answer: '\\boxed{14}',
        },
        {
          question: 'Evaluate $n^2$ when $n = -4$.',
          steps: ['$= (-4)^2 = (-4) \\times (-4)$'],
          final_answer: '\\boxed{16}',
        },
        {
          question: 'Evaluate $2(x - 5)$ when $x = 12$.',
          steps: ['$= 2((12) - 5) = 2(7)$'],
          final_answer: '\\boxed{14}',
        },
        {
          question: 'Evaluate $\\frac{20}{m} + 3$ when $m = 5$.',
          steps: ['$= \\frac{20}{(5)} + 3 = 4 + 3$'],
          final_answer: '\\boxed{7}',
        },
        {
          question: 'Area of a square is $s^2$. If $s = 6\\ \\text{cm}$, find the area.',
          steps: ['$= (6)^2$'],
          final_answer: '\\boxed{36\\ \\text{cm}^2}',
        },
        {
          question: 'Evaluate $ab - c$ when $a=4$, $b=-2$, $c=5$.',
          steps: ['$= (4)(-2) - (5) = -8 - 5$'],
          final_answer: '\\boxed{-13}',
        },
      ],
    },
    {
      title: 'Common Error: Forgetting Brackets',
      content:
        'If $x = -2$, then $x^2$ is $(-2)^2 = 4$. Without brackets, many calculate $-2^2 = -4$. Always use brackets to protect the negative sign.\n\n**Practice Exercise 3.1**\n\nIf $x = 4$, $y = -3$, and $z = 2$, evaluate:\n\n1. $x + z$\n2. $3y$\n3. $x + y$\n4. $z^2$\n5. $2x - 3z$\n6. $5(x + y)$',
    },
    {
      title: '4. Expanding Brackets: The Distributive Law',
      content:
        'The Distributive Law is used to remove brackets, which act as "barriers" to simplification. In complex engineering formulas, expanding brackets is a necessary step before terms can be grouped and reduced.\n\n**The Logic of Distribution (The "Why")**\n\nWhen we see $4(x + 3)$, it means we have four identical groups of $(x + 3)$. This is $x+3 + x+3 + x+3 + x+3$, which equals $4x + 12$. The logic is that the multiplier outside must be distributed to every term inside.',
      worked_examples: [
        {
          question: 'Expand $5(x + 2)$',
          steps: ['The term 5 multiplies $x$ and then multiplies 2.', '$= 5(x) + 5(2)$'],
          final_answer: '\\boxed{5x + 10}',
        },
        {
          question: 'Expand $a(b - 4)$',
          steps: ['The term $a$ multiplies $b$ and then multiplies $-4$.', '$= a(b) + a(-4)$'],
          final_answer: '\\boxed{ab - 4a}',
        },
        {
          question: 'Expand $3(2m + 5)$',
          steps: ['$= 3(2m) + 3(5)$'],
          final_answer: '\\boxed{6m + 15}',
        },
        {
          question: 'Expand $-2(y + 6)$',
          steps: ['$= (-2)(y) + (-2)(6)$'],
          final_answer: '\\boxed{-2y - 12}',
        },
        {
          question: 'Expand $-3(k - 5)$',
          steps: ['$= (-3)(k) + (-3)(-5)$'],
          final_answer: '\\boxed{-3k + 15}',
        },
        {
          question: 'Expand $x(x + 3)$',
          steps: ['$= x(x) + x(3)$'],
          final_answer: '\\boxed{x^2 + 3x}',
        },
        {
          question: 'Expand $4(3a - 2b)$',
          steps: ['$= 4(3a) - 4(2b)$'],
          final_answer: '\\boxed{12a - 8b}',
        },
        {
          question: 'Expand $-(p - q)$',
          steps: ['$= -1(p) - 1(-q)$'],
          final_answer: '\\boxed{-p + q}',
        },
      ],
    },
    {
      title: 'Common Error: Dropping Negative Signs',
      content:
        'In $-4(x - 2)$, remember that $(-4) \\times (-2) = +8$. Many students incorrectly write $-4x - 8$.\n\n**Practice Exercise 4.1**\n\nExpand the following:\n\n1. $2(a + 5)$\n2. $6(3x - 1)$\n3. $k(k + 4)$\n4. $-5(m + 2)$\n5. $-2(n - 7)$\n6. $3(4x + 5y)$\n7. $x(2x - 5)$\n8. $-1(a + b)$',
    },
    {
      title: '5. Introductory Factorisation: Finding Common Ground',
      content:
        'Factorisation is the reverse of expansion. It involves breaking an expression into its constituent factors, identifying the "common ground" shared by terms. This is vital for simplifying algebraic fractions and analysing structural models.\n\n**The HCF Method**\n\n1. Identify the Highest Common Factor (HCF) of all terms.\n2. Write the HCF outside a set of brackets.\n3. Divide each original term by the HCF to find the terms inside the bracket.\n4. **Verification:** Always expand your answer. If it returns the original expression, your factorisation is correct.',
      worked_examples: [
        {
          question: 'Factorise $5x + 10$',
          steps: ['HCF of 5 and 10 is 5.', '$= 5(x + 2)$'],
          final_answer: '\\boxed{5(x + 2)}',
        },
        {
          question: 'Factorise $4y - 12$',
          steps: ['HCF of 4 and 12 is 4.', '$= 4(y - 3)$'],
          final_answer: '\\boxed{4(y - 3)}',
        },
        {
          question: 'Factorise $mx + my$',
          steps: ['HCF is $m$.'],
          final_answer: '\\boxed{m(x + y)}',
        },
        {
          question: 'Factorise $a^2 + 5a$',
          steps: ['HCF is $a$.'],
          final_answer: '\\boxed{a(a + 5)}',
        },
        {
          question: 'Factorise $12k - 18$',
          steps: ['HCF of 12 and 18 is 6.', '$= 6(2k - 3)$'],
          final_answer: '\\boxed{6(2k - 3)}',
        },
        {
          question: 'Factorise $8ab + 12ac$',
          steps: ['HCF is $4a$.'],
          final_answer: '\\boxed{4a(2b + 3c)}',
        },
        {
          question: 'Factorise $x^2 - x$',
          steps: ['HCF is $x$.'],
          final_answer: '\\boxed{x(x - 1)}',
        },
        {
          question: 'Factorise $15p + 20q$',
          steps: ['HCF of 15 and 20 is 5.', '$= 5(3p + 4q)$'],
          final_answer: '\\boxed{5(3p + 4q)}',
        },
      ],
    },
    {
      title: 'Practice Exercise 5.1',
      content:
        'Factorise the following:\n\n1. $3a + 9$\n2. $10x - 20$\n3. $xy + xz$\n4. $n^2 + 6n$\n5. $14m - 21$\n6. $18x + 24y$',
    },
    {
      title: '6. Forming Expressions from Word Problems',
      content:
        'Algebraic modelling allows us to solve everyday problems. In the spirit of Unhu/Ubuntu, mathematics is used to manage community resources, cooperative ventures, and family budgets.',
      worked_examples: [
        {
          question: 'A community cooperative has $k$ bags of maize. They receive 15 more bags.',
          steps: [],
          final_answer: '$k + 15$',
        },
        {
          question: 'Chipo is $x$ years old. Her sister is 5 years younger. (a) Express the sister\'s age. (b) Express their total age.',
          steps: ['(a) Sister: $x - 5$', '(b) Total: $x + (x - 5) = 2x - 5$'],
          final_answer: '(a) $x - 5$ (b) $2x - 5$',
        },
        {
          question: 'A local entrepreneur produces $n$ solar lamps. She sells them for $\\$20$ each.',
          steps: ['Total revenue $=$ price $\\times$ quantity'],
          final_answer: '$20n$',
        },
        {
          question: 'A rectangular community garden has width $w$ metres. The length is double the width. (a) Express length. (b) Express perimeter.',
          steps: ['(a) Length: $2w$', '(b) Perimeter: $2(w) + 2(2w) = 2w + 4w = 6w$'],
          final_answer: '(a) $2w$ (b) $6w$',
        },
        {
          question: 'Five friends share $\\$m$ equally.',
          steps: [],
          final_answer: '$\\frac{m}{5}$',
        },
        {
          question: 'A bus starts with $x$ passengers. At a stop, 4 get off and 7 get on.',
          steps: ['$x - 4 + 7 = x + 3$'],
          final_answer: '$x + 3$',
        },
      ],
    },
    {
      title: 'Practice Exercise 6.1',
      content:
        '1. Munyaradzi has $y$ cattle. His neighbour has 12 more. Write an expression for the neighbour\'s cattle.\n2. A school receives $b$ books and distributes them equally among 10 classes. Write an expression for books per class.\n3. The cost of a bread loaf is $\\$x$. The cost of a litre of milk is $\\$y$. Write an expression for the cost of 2 loaves and 3 milks.\n4. A boy is $n$ years old now. How old was he 4 years ago?\n5. A poultry project has $x$ chickens. If the number of chickens triples, write the new total.',
    },
    {
      title: '7. Comprehensive Assessment and Revision',
      content:
        '**Mixed Revision Exercise**\n\n1. Identify the constant in $5x - 8$.\n2. Simplify $4a + 5a - 2a$.\n3. Simplify $6x + 2y - 4x + y$.\n4. Simplify $m^2 \\times m^5$.\n5. Simplify $20p^8 \\div 4p^2$.\n6. Evaluate $x + 10$ if $x = -4$.\n7. Evaluate $3n - 5$ if $n = 4$.\n8. Evaluate $a^2 + 2$ if $a = -3$.\n9. Expand $3(x + 4)$.\n10. Expand $-2(y - 5)$.\n11. Expand $x(x + 6)$.\n12. Factorise $4x + 12$.\n13. Factorise $5y - 25$.\n14. Factorise $a^2 + 7a$.\n15. Factorise $12m + 18n$.\n16. If $a=2$, $b=3$, $c=4$, evaluate $abc$.\n17. Simplify $10k - 12k$.\n18. Expand $-(2x + 3)$.\n19. Factorise $8ab - 4a$.\n20. Express "10 less than $x$."\n21. Simplify $x \\times x \\times x$.\n22. Simplify $4a \\times 3b$.\n23. Evaluate $2(x + 5)$ if $x = -2$.\n24. A bag has $n$ marbles. If 5 are lost, how many remain?\n25. Simplify $5x^2 + 2x + x^2$.\n\n**Exam-Style Structured Test**\n\n**Question 1** (a) Simplify $8x + 5y - 3x + y$. [2] (b) Hence, evaluate your answer if $x = 2$ and $y = -1$. [2]\n\n**Question 2** (a) Expand and simplify: $4(a + 2) + 3(a - 1)$. [3] (b) Factorise the result of part (a). [1]\n\n**Question 3** A local youth group produces $x$ bricks per day. (a) Write an expression for the bricks produced in 5 days. [1] (b) If they sell each brick for $\\$0{,}50$, write an expression for their 5-day revenue. [2]\n\n**Question 4** (a) Simplify $\\frac{12x^5}{3x^2}$. [2] (b) Factorise $x^2 - 9x$. [1]',
    },
    {
      title: '8. Complete Memorandum (The Memo)',
      content:
        '**Practice Exercise 1.1**\n1. Variable: $y$; Constant: $-5$\n2. $9k$\n3. $t + 15$\n4. 4 terms\n5. $2g$\n\n**Practice Exercise 2.1**\n1. $9k + 2k = 11k$ \\quad \\boxed{11k}\n2. $15n - 6n = 9n$ \\quad \\boxed{9n}\n3. $y + y + y + y = 4y$ \\quad \\boxed{4y}\n4. $8a - 2a + 3b + b = 6a + 4b$ \\quad \\boxed{6a + 4b}\n5. $x^{4+3} = x^7$ \\quad \\boxed{x^7}\n6. $(10 \\div 2)m^{5-2} = 5m^3$ \\quad \\boxed{5m^3}\n7. $(4 \\times 5) \\times p \\times q = 20pq$ \\quad \\boxed{20pq}\n8. $12x - 3x + 5 - 8 = 9x - 3$ \\quad \\boxed{9x - 3}\n\n**Practice Exercise 3.1**\n1. $(4) + (2) = 6$ \\quad \\boxed{6}\n2. $3(-3) = -9$ \\quad \\boxed{-9}\n3. $(4) + (-3) = 1$ \\quad \\boxed{1}\n4. $(2)^2 = 4$ \\quad \\boxed{4}\n5. $2(4) - 3(2) = 8 - 6 = 2$ \\quad \\boxed{2}\n6. $5(4 + (-3)) = 5(1) = 5$ \\quad \\boxed{5}\n\n**Practice Exercise 4.1**\n1. $2(a) + 2(5) = 2a + 10$ \\quad \\boxed{2a + 10}\n2. $6(3x) - 6(1) = 18x - 6$ \\quad \\boxed{18x - 6}\n3. $k(k) + k(4) = k^2 + 4k$ \\quad \\boxed{k^2 + 4k}\n4. $-5(m) + (-5)(2) = -5m - 10$ \\quad \\boxed{-5m - 10}\n5. $-2(n) + (-2)(-7) = -2n + 14$ \\quad \\boxed{-2n + 14}\n6. $3(4x) + 3(5y) = 12x + 15y$ \\quad \\boxed{12x + 15y}\n7. $x(2x) + x(-5) = 2x^2 - 5x$ \\quad \\boxed{2x^2 - 5x}\n8. $-1(a) + (-1)(b) = -a - b$ \\quad \\boxed{-a - b}\n\n**Practice Exercise 5.1**\n1. HCF $= 3$ \\quad $3(a + 3)$ \\quad \\boxed{3(a + 3)}\n2. HCF $= 10$ \\quad $10(x - 2)$ \\quad \\boxed{10(x - 2)}\n3. HCF $= x$ \\quad $x(y + z)$ \\quad \\boxed{x(y + z)}\n4. HCF $= n$ \\quad $n(n + 6)$ \\quad \\boxed{n(n + 6)}\n5. HCF $= 7$ \\quad $7(2m - 3)$ \\quad \\boxed{7(2m - 3)}\n6. HCF $= 6$ \\quad $6(3x + 4y)$ \\quad \\boxed{6(3x + 4y)}\n\n**Practice Exercise 6.1**\n1. $y + 12$\n2. $\\frac{b}{10}$\n3. $2x + 3y$\n4. $n - 4$\n5. $3x$\n\n**Mixed Revision Exercise Solutions**\n1. $-8$ | 2. $7a$ | 3. $2x + 3y$ | 4. $m^7$ | 5. $5p^6$ | 6. $(-4) + 10 = 6$ | 7. $3(4) - 5 = 7$ | 8. $(-3)^2 + 2 = 11$ | 9. $3x + 12$ | 10. $-2y + 10$ | 11. $x^2 + 6x$ | 12. $4(x + 3)$ | 13. $5(y - 5)$ | 14. $a(a + 7)$ | 15. $6(2m + 3n)$ | 16. $(2)(3)(4) = 24$ | 17. $-2k$ | 18. $-2x - 3$ | 19. $4a(2b - 1)$ | 20. $x - 10$ | 21. $x^3$ | 22. $12ab$ | 23. $2((-2) + 5) = 2(3) = 6$ | 24. $n - 5$ | 25. $6x^2 + 2x$\n\n**Exam-Style Test Solutions**\n\n**Question 1** (a) $8x - 3x + 5y + y = 5x + 6y$ \\quad \\boxed{5x + 6y} (b) $5(2) + 6(-1) = 10 - 6 = 4$ \\quad \\boxed{4}\n\n**Question 2** (a) $(4a + 8) + (3a - 3) = 4a + 3a + 8 - 3 = 7a + 5$ \\quad \\boxed{7a + 5} (b) HCF of 7 and 5 is 1. \\quad \\boxed{7a + 5}\n\n**Question 3** (a) $5 \\times x = 5x$ \\quad \\boxed{5x} (b) $0{,}50 \\times 5x = 2{,}50x$ \\quad \\boxed{2{,}50x}\n\n**Question 4** (a) $(12 \\div 3)x^{5-2} = 4x^3$ \\quad \\boxed{4x^3} (b) HCF is $x$: $x(x - 9)$ \\quad \\boxed{x(x - 9)}',
    },
  ],
  key_points: [
    'Variable: letter representing unknown/varying quantity; Constant: fixed number; Term: single component; Expression: terms joined by operators, no equals sign.',
    'Expression vs Equation: expression is a phrase (simplify/evaluate); equation is a sentence (solve). Never add $=0$ to an expression.',
    'Like terms: same variables, same powers. Only combine like terms. $3x + 2y$ cannot become $5xy$.',
    'Index laws: $x^a \\times x^b = x^{a+b}$, $x^a \\div x^b = x^{a-b}$, $x^0 = 1$.',
    'Substitution: always use brackets for negatives; follow BODMAS.',
    'Expansion: distribute the outside term to every term inside the bracket. $-4 \\times (-2) = +8$.',
    'Factorisation: find HCF, write outside bracket, divide each term by HCF. Verify by expanding.',
  ],
  exam_tips: [
    'Never "solve" an expression; only equations can be solved.',
    'Use brackets when substituting negative values, e.g. $(-2)^2 = 4$, not $-2^2 = -4$.',
    'Do not write $4x + 3y = 7xy$; unlike terms stay separate.',
    'In $-4(x-2)$, $(-4)\\times(-2) = +8$; many students wrongly write $-8$.',
  ],
  visual_descriptions: [
    'Variable vs constant identification in $12y - 5$.',
    'Like terms analogy: 3 cows + 2 cows vs 3 cows + 2 goats.',
    'Index laws: $x^a \\times x^b = x^{a+b}$.',
  ],
};

const algebraicManipulationForm1Notes: MathTopicNotes = {
  topic: 'Algebraic Manipulation',
  subject: 'Mathematics',
  grade_level: 'Form 1',
  summary:
    'Comprehensive Form 1 Mathematics notes on Algebraic Manipulation (ZIMSEC Heritage-Based Syllabus B). Algebra is the "mathematical language" for solving everyday problems. Covers simplifying expressions, like/unlike terms, expanding brackets, factorisation, solving linear equations, changing the subject of a formula, and ZIMSEC-style word problems.',
  sections: [
    {
      title: '1. Foundational Concepts: Revising Algebraic Expressions',
      content:
        'As specified in the ZIMSEC Heritage-Based Mathematics Syllabus B Preamble (1.1), Algebra is the strategic "mathematical language" that empowers us to solve everyday life problems. It allows us to translate complex real-world situations into symbols, facilitating critical thinking and industrial innovation. In our classrooms, we often use concrete aids like bottle tops or counters to represent these symbols, helping to bridge the gap between physical objects and abstract thought.\n\n**Key Terms and the "So What?" Layer**\n\n- **Variables:** Letters (e.g. $x$, $a$, $y$) used to represent unknown quantities. Their value is not fixed; they represent the "missing piece" in our industrial or commercial models.\n- **Coefficients:** The number multiplying a variable (e.g. in $7x$, the $7$ is the coefficient). Think of this as the "scale" or the quantity of "bottle tops" we are grouping together.\n- **Terms:** The building blocks of expressions, separated by $+$ or $-$ signs. Understanding terms allows us to break down complex problems into manageable units.\n\n**Like Terms vs. Unlike Terms**\n\nIn Algebra, we can only combine items that are identical in nature.\n\n- **Like Terms:** Terms containing the exact same variable raised to the exact same power. Example: $5x$ and $12x$ are like terms. Why combine? They represent the same category of object (e.g. 5 bags of maize and 12 bags of maize).\n- **Unlike Terms:** Terms with different variables or different powers. Example: $5x$ and $5y$, or $x$ and $x^2$, are unlike terms. Why not combine? You cannot add "3 cattle and 2 goats" to get "5 cattle-goats"; they must remain separate.\n\n**Common Errors:** A frequent mistake is failing to recognise that the sign ($+$ or $-$) belongs to the term immediately following it. If you have $10 - 2x$, the negative sign is "glued" to the $2x$. When rearranging terms, you must carry the sign with its term.',
    },
    {
      title: '2. Worked Examples: Simplifying Expressions',
      content:
        '**Example 1:** $4a + 9a = (4 + 9)a = 13a$. Therefore $13a$.\n\n**Example 2:** $15x - 6x = (15 - 6)x = 9x$. Therefore $9x$.\n\n**Example 3:** $2y + 8y + y = (2 + 8 + 1)y = 11y$. Therefore $11y$.\n\n**Example 4:** $12b - 5b + 2b = (12 - 5 + 2)b = 9b$. Therefore $9b$.\n\n**Example 5:** $5x + 4y + 3x + 2y$. Group like terms: $(5x + 3x) + (4y + 2y) = 8x + 6y$. Therefore $8x + 6y$.\n\n**Example 6:** $10m - 3n - 4m + 8n$. Group like terms: $(10m - 4m) + (-3n + 8n) = 6m + 5n$. Therefore $6m + 5n$.\n\n**Example 7:** $15ab + 7 - 4ab + 3$. Group like terms: $(15ab - 4ab) + (7 + 3) = 11ab + 10$. Therefore $11ab + 10$.\n\n**Example 8:** $x + 3x + y - x$. Group like terms: $(1x + 3x - 1x) + y = 3x + y$. (Note: We write $3x + y$ instead of $3x + 1y$ because the coefficient $1$ is implied.) Therefore $3x + y$.',
      worked_examples: [
        { question: 'Simplify $5x + 4y + 3x + 2y$', steps: ['Group like terms: $(5x + 3x) + (4y + 2y)$', 'Add: $8x + 6y$'], final_answer: '$8x + 6y$' },
        { question: 'Simplify $10m - 3n - 4m + 8n$', steps: ['Group: $(10m - 4m) + (-3n + 8n)$', 'Simplify: $6m + 5n$'], final_answer: '$6m + 5n$' },
      ],
    },
    {
      title: '3. The Logic of Distribution: Expanding Brackets',
      content:
        'Expanding brackets is a strategic operation used to remove mathematical barriers. By distributing a multiplier across the terms inside a bracket, we simplify the expression to a form where terms can finally be combined or solved.\n\n**The "Why": The Law of Equality**\n\nDistribution ensures that every component inside the bracket is treated equally by the external factor. If a local entrepreneur triples a "package" containing 2 bags of mealie-meal and 1 bottle of oil, they must triple both: $3(2m + 1o) = 6m + 3o$.\n\n**Common Errors: The Negative Trap**\n\nThe most dangerous pitfall in expansion is failing to change the sign of the second term when multiplying by a negative number. Remember: a negative multiplied by a negative results in a positive ($- \\times - = +$).',
    },
    {
      title: '4. Worked Examples: Expand and Simplify',
      content:
        '**Example 1:** $3(x + 6) = 3 \\times x + 3 \\times 6 = 3x + 18$. Therefore $3x + 18$.\n\n**Example 2:** $4(2a - 5) = 4 \\times 2a + 4 \\times (-5) = 8a - 20$. Therefore $8a - 20$.\n\n**Example 3:** $6(3y + 2z) = 18y + 12z$. Therefore $18y + 12z$.\n\n**Example 4:** $m(n + 5) = m \\times n + m \\times 5 = mn + 5m$. Therefore $mn + 5m$.\n\n**Example 5:** $-2(x + 4) = -2 \\times x + (-2) \\times 4 = -2x - 8$. Therefore $-2x - 8$.\n\n**Example 6:** $-5(2y - 3) = -5 \\times 2y + (-5) \\times (-3) = -10y + 15$. Therefore $-10y + 15$.\n\n**Example 7:** $-3(4a + b) = -12a - 3b$. Therefore $-12a - 3b$.\n\n**Example 8:** $-(2x - 9) = -1 \\times 2x + (-1) \\times (-9) = -2x + 9$. Therefore $-2x + 9$.',
      worked_examples: [
        { question: 'Expand $-5(2y - 3)$', steps: ['$-5 \\times 2y = -10y$', '$(-5) \\times (-3) = +15$'], final_answer: '$-10y + 15$' },
        { question: 'Expand $-(2x - 9)$', steps: ['$-1 \\times 2x = -2x$', '$(-1) \\times (-9) = +9$'], final_answer: '$-2x + 9$' },
      ],
    },
    {
      title: '5. Reverse Engineering: Introductory Factorisation',
      content:
        'Factorisation is the process of "unpacking" an expression into its original factors. This skill is critical for industrial efficiency and simplifying complex algebraic structures in higher-level technical vocational training.\n\n**The HCF Method**\n\nTo factorise, identify the **Highest Common Factor (HCF)**:\n\n1. The largest number that divides into all coefficients.\n2. The highest power of a letter present in all terms. For example, in $x^3 + x^2$, the highest power common to both is $x^2$.\n\n**Common Errors:** Taking out any common factor is not enough; you must take out the **Highest** Common Factor. If you factorise $12x + 24$ as $2(6x + 12)$, you have failed—$6$ is still a common factor inside. Always double-check your brackets.',
    },
    {
      title: '6. Worked Examples: Factorise',
      content:
        '**Example 1:** $4x + 12$. HCF is 4. $= 4(x + 3)$. Check: $4(x) + 4(3) = 4x + 12$ ✓.\n\n**Example 2:** $15y - 20$. HCF is 5. $= 5(3y - 4)$. Check: $5(3y) + 5(-4) = 15y - 20$ ✓.\n\n**Example 3:** $x^2 + 7x$. HCF is $x$. $= x(x + 7)$. Check: $x(x) + x(7) = x^2 + 7x$ ✓.\n\n**Example 4:** $6a^2 - 9a$. HCF is $3a$. $= 3a(2a - 3)$. Check: $3a(2a) - 3a(3) = 6a^2 - 9a$ ✓.\n\n**Example 5:** $10ab + 15ac$. HCF is $5a$. $= 5a(2b + 3c)$.\n\n**Example 6:** $x^3 + x^2$. HCF is $x^2$. $= x^2(x + 1)$.\n\n**Example 7:** $8m^2n - 12mn$. HCF is $4mn$. $= 4mn(2m - 3)$.\n\n**Example 8:** $7pqr + 14pq$. HCF is $7pq$. $= 7pq(r + 2)$.',
      worked_examples: [
        { question: 'Factorise $6a^2 - 9a$', steps: ['HCF of coefficients: 3; HCF of letters: $a$', '$3a(2a - 3)$'], final_answer: '$3a(2a - 3)$' },
        { question: 'Factorise $x^3 + x^2$', steps: ['Highest power common to both: $x^2$', '$x^2(x + 1)$'], final_answer: '$x^2(x + 1)$' },
      ],
    },
    {
      title: '7. Multi-Step Complexity: Expand and Simplify',
      content:
        'In accordance with Syllabus Topic 1.1, the Order of Operations governs compound algebraic structures. When dealing with multiple brackets, expand each set individually before grouping like terms.\n\n**Common Errors: Sign Dropping**\n\nWhen expanding the second bracket, many learners drop the sign. In $3(x + 2) - 2(x - 5)$, the $-2$ must be multiplied by both $x$ and $-5$. Forgetting that $-2 \\times (-5) = +10$ is a fatal error in ZIMSEC examinations.',
    },
    {
      title: '8. Worked Examples: Expand and Simplify (Multi-Step)',
      content:
        '**Example 1:** $2(x + 5) + 3(x + 2) = 2x + 10 + 3x + 6 = 5x + 16$.\n\n**Example 2:** $5(a + 4) - 2(a + 3) = 5a + 20 - 2a - 6 = 3a + 14$.\n\n**Example 3:** $4(y - 1) + 2(3y + 5) = 4y - 4 + 6y + 10 = 10y + 6$.\n\n**Example 4:** $3(x + 2) - 2(x - 5) = 3x + 6 - 2x + 10 = x + 16$.\n\n**Example 5:** $x(x + 3) + 4(x - 2) = x^2 + 3x + 4x - 8 = x^2 + 7x - 8$.\n\n**Example 6:** $5(2m - 1) - 3(m - 4) = 10m - 5 - 3m + 12 = 7m + 7$.\n\n**Example 7:** $2a(b + 4) - b(a - 2) = 2ab + 8a - ab + 2b = ab + 8a + 2b$.\n\n**Example 8:** $-(x + 3) + 5(x - 2) = -x - 3 + 5x - 10 = 4x - 13$.',
    },
    {
      title: '9. The Balancing Act: Solving Simple Linear Equations',
      content:
        'An equation represents a state of perfect equality. To solve it, we use the **Balancing Method**: whatever we do to the left side, we must do to the right side to keep the "scales" even.\n\n**The Three-Stage Process**\n\n1. **Collect Like Terms:** Move all variables to one side and constants to the other.\n2. **Isolate the Variable:** Use inverse operations.\n3. **Solve:** Identify the specific value of the variable.\n\n**Common Errors:** A common mistake is dividing only the variable term and not the constant. If you divide one side of the equation by a number, you must divide the **entire** other side by that same number.',
    },
    {
      title: '10. Worked Examples: Solve for $x$',
      content:
        '**Example 1:** $x + 7 = 15 \\Rightarrow x = 15 - 7 = 8$. Check: $8 + 7 = 15$ ✓.\n\n**Example 2:** $x - 9 = 4 \\Rightarrow x = 4 + 9 = 13$.\n\n**Example 3:** $5x = 35 \\Rightarrow x = 35 \\div 5 = 7$.\n\n**Example 4:** $\\frac{x}{4} = 6 \\Rightarrow x = 6 \\times 4 = 24$.\n\n**Example 5:** $3x + 4 = 19 \\Rightarrow 3x = 15 \\Rightarrow x = 5$.\n\n**Example 6:** $2x - 8 = 10 \\Rightarrow 2x = 18 \\Rightarrow x = 9$.\n\n**Example 7:** $4x + 5 = x + 17 \\Rightarrow 4x - x = 17 - 5 \\Rightarrow 3x = 12 \\Rightarrow x = 4$.\n\n**Example 8:** $6x - 2 = 2x + 18 \\Rightarrow 6x - 2x = 18 + 2 \\Rightarrow 4x = 20 \\Rightarrow x = 5$.',
      worked_examples: [
        { question: 'Solve $3x + 4 = 19$', steps: ['Subtract 4: $3x = 15$', 'Divide by 3: $x = 5$'], final_answer: '$x = 5$' },
        { question: 'Solve $6x - 2 = 2x + 18$', steps: ['Collect terms: $6x - 2x = 18 + 2$', '$4x = 20 \\Rightarrow x = 5$'], final_answer: '$x = 5$' },
      ],
    },
    {
      title: '11. Changing the Subject of a Formula',
      content:
        'In technical and vocational categories such as engineering and construction (Syllabus Rationale 1.2), we often need to rearrange a formula. If a builder knows the Volume $(V)$ and the area of the base $(LB)$, they must rearrange $V = LBH$ to find the Height $(H)$.\n\n**The Logic of the Inverse**\n\nTo "move" a term to the other side of the equal sign, perform its inverse operation:\n\n- $+$ moves as $-$\n- $-$ moves as $+$\n- $\\times$ moves as $\\div$\n- $\\div$ moves as $\\times$',
    },
    {
      title: '12. Worked Examples: Make [variable] the Subject',
      content:
        '**Example 1:** $P = 4s$. Make $s$ the subject: $s = \\frac{P}{4}$.\n\n**Example 2:** $V = LBH$. Make $H$ the subject: $H = \\frac{V}{LB}$.\n\n**Example 3:** $y = mx + c$. Make $x$ the subject: $y - c = mx \\Rightarrow x = \\frac{y - c}{m}$.\n\n**Example 4:** $A = L + W$. Make $L$ the subject: $L = A - W$.\n\n**Example 5:** $C = 2\\pi r$. Make $r$ the subject: $r = \\frac{C}{2\\pi}$.\n\n**Example 6:** $v = u + at$. Make $u$ the subject: $u = v - at$.\n\n**Example 7:** $A = \\frac{1}{2}bh$. Make $h$ the subject: $2A = bh \\Rightarrow h = \\frac{2A}{b}$.\n\n**Example 8:** $z = 3x - 4$. Make $x$ the subject: $z + 4 = 3x \\Rightarrow x = \\frac{z + 4}{3}$.',
    },
    {
      title: '13. Real-World Translation: Word Problems',
      content:
        'The "Heritage-based" goal of our syllabus is to empower you to translate the language of the Zimbabwean marketplace and industry into solvable mathematical models.\n\n**Translation Key**\n\n| Everyday Language | Algebraic Symbol |\n| :--- | :--- |\n| "sum of" / "total" / "combined" | $+$ |\n| "difference" / "less than" | $-$ |\n| "product of" / "times" | $\\times$ |\n| "is" / "results in" / "costs" | $=$ |',
    },
    {
      title: '14. Worked Examples: ZIMSEC-Style Word Problems',
      content:
        '**Example 1:** The sum of a certain number and 8 is 20. Let $x$ be the number. Equation: $x + 8 = 20$. Solution: $x = 12$.\n\n**Example 2:** At a Gweru market stall, a bag of "Mhunga" (millet) costs $x$ ZiG. Buy 4 bags, pay 100 ZiG, change is 20 ZiG. Equation: $4x + 20 = 100 \\Rightarrow 4x = 80 \\Rightarrow x = 20$ ZiG.\n\n**Example 3:** Tariro is $a$ years old; brother is 5 years older. Total age 31. Equation: $a + (a + 5) = 31 \\Rightarrow 2a + 5 = 31 \\Rightarrow a = 13$.\n\n**Example 4:** Rectangular garden perimeter 60 m, width 10 m, length $L$. Equation: $2L + 2(10) = 60 \\Rightarrow 2L = 40 \\Rightarrow L = 20$ m.\n\n**Example 5:** Triple a number $n$ and subtract 7 to get 14. Equation: $3n - 7 = 14 \\Rightarrow n = 7$.\n\n**Example 6:** Farmer harvests $y$ bags; sells 15, has 45 left. Equation: $y - 15 = 45 \\Rightarrow y = 60$.\n\n**Example 7:** Product of 5 and a number is 45. Equation: $5x = 45 \\Rightarrow x = 9$.\n\n**Example 8:** Two more than four times a number is 26. Equation: $4x + 2 = 26 \\Rightarrow x = 6$.',
    },
    {
      title: '15. Practice Exercises',
      content:
        '**Topic 1 – Simplifying:** 1. Simplify $6b + 3b - b$. 2. Simplify $4x + 5y + 2x + y$. 3. Simplify $12m - 8m + 3n$. 4. Simplify $9ab - 4ab + 10$. 5. Simplify $y + y + x - y$.\n\n**Topic 2 – Expanding:** 1. Expand $4(x + 5)$. 2. Expand $3(2a - 4)$. 3. Expand $-2(y + 6)$. 4. Expand $-5(3x - 2)$. 5. Expand $x(y + z)$.\n\n**Topic 3 – Factorisation:** 1. Factorise $6x + 18$. 2. Factorise $10a - 25$. 3. Factorise $y^2 + 4y$. 4. Factorise $8mn + 12mp$. 5. Factorise $a^3 + a^2$.\n\n**Topic 4 – Multi-Step:** 1. Expand and simplify $3(x + 2) + 2(x + 5)$. 2. Expand and simplify $5(a + 3) - 3(a + 1)$. 3. Expand and simplify $4(y - 2) + 2(y + 4)$. 4. Expand and simplify $2(x + 6) - (x - 3)$. 5. Expand and simplify $3(2m + 4) - 2(m - 1)$.\n\n**Topic 5 – Equations:** 1. Solve $x + 9 = 21$. 2. Solve $4x = 32$. 3. Solve $3x - 7 = 14$. 4. Solve $5x + 3 = 23$. 5. Solve $6x - 4 = 2x + 12$.\n\n**Topic 6 – Changing Subject:** 1. Make $m$ the subject: $F = ma$. 2. Make $x$ the subject: $y = 5x$. 3. Make $w$ the subject: $V = Lwh$. 4. Make $a$ the subject: $v = u + at$. 5. Make $x$ the subject: $y = 4x - 7$.\n\n**Topic 7 – Word Problems:** 1. The sum of $x$ and 15 is 40. Find $x$. 2. Five times a number $n$ is 50. Find $n$. 3. A soda costs $x$ ZiG and a pie costs $x+10$ ZiG. Total cost 30 ZiG. Find $x$. 4. Subtract 8 from $y$ to get 12. Find $y$. 5. A mother is 4 times as old as her daughter $(d)$. Total age 50. Find $d$.',
    },
    {
      title: '16. Full Worked Solutions',
      content:
        '**Topic 1:** 1. $8b$. 2. $6x + 6y$. 3. $4m + 3n$. 4. $5ab + 10$. 5. $y + x$.\n\n**Topic 2:** 1. $4x + 20$. 2. $6a - 12$. 3. $-2y - 12$. 4. $-15x + 10$. 5. $xy + xz$.\n\n**Topic 3:** 1. $6(x + 3)$. 2. $5(2a - 5)$. 3. $y(y + 4)$. 4. $4m(2n + 3p)$. 5. $a^2(a + 1)$.\n\n**Topic 4:** 1. $5x + 16$. 2. $2a + 12$. 3. $6y$. 4. $x + 15$. 5. $4m + 14$.\n\n**Topic 5:** 1. $x = 12$. 2. $x = 8$. 3. $x = 7$. 4. $x = 4$. 5. $x = 4$.\n\n**Topic 6:** 1. $m = \\frac{F}{a}$. 2. $x = \\frac{y}{5}$. 3. $w = \\frac{V}{Lh}$. 4. $a = v - u$ (for $v = u + a$). 5. $x = \\frac{y + 7}{4}$.\n\n**Topic 7:** 1. $x = 25$. 2. $n = 10$. 3. $x = 10$ ZiG. 4. $y = 20$. 5. $d = 10$.',
    },
  ],
  key_points: [
    'Like terms: same variable, same power—combine; unlike terms—keep separate.',
    'Coefficient is the number multiplying the variable; the sign belongs to the term following it.',
    'Expand: multiply each term inside the bracket by the factor outside.',
    'Negative outside bracket: $-a(b - c) = -ab + ac$ (negative $\\times$ negative $= +$).',
    'Factorise: take out the HCF (number and highest power of common letter).',
    'Solve equations: balance both sides; use inverse operations.',
    'Change subject: move terms using inverse operations (+ $\\leftrightarrow$ $-$; $\\times$ $\\leftrightarrow$ $\\div$).',
  ],
  exam_tips: [
    'Carry the sign with its term when rearranging; $-2x$ means the whole term is negative.',
    'When expanding $-2(x - 5)$, both $x$ and $-5$ get multiplied by $-2$: $-2x + 10$.',
    'Always take out the HCF when factorising—check that nothing common remains inside.',
    'In word problems, define the variable clearly and translate key phrases into symbols.',
  ],
  visual_descriptions: [
    'Like terms: 5x + 12x = 17x (same "bottle tops"); unlike: 5x + 5y stays as is.',
    'Brackets: 3(2m + o) = 6m + 3o—triple each item inside.',
    'Balance: equation as scales; add/subtract same amount on both sides.',
  ],
};

const translationForm1Notes: MathTopicNotes = {
  topic: 'Translation',
  subject: 'Mathematics',
  grade_level: 'Form 1',
  summary:
    'Comprehensive Form 1 Mathematics notes on Translation (Transformations) for ZIMSEC Heritage-Based Syllabus B (2024–2030). Translation is the simplest transformation—a slide that preserves size, shape, and orientation. Covers coordinate movement, translation vectors, object-to-image mapping, plotting conventions, and exam-style problems.',
  sections: [
    {
      title: '1. Introduction to the Geometry of Translation',
      content:
        'In the ZIMSEC Heritage-based Mathematics Syllabus B (2024–2030), Transformations serve as a critical bridge between algebraic operations and spatial reasoning. As outlined in the Syllabus Rationale (1.2), Mathematics is the engine of innovation and industrialisation. Translation, the simplest form of transformation, is foundational to Zimbabwean heritage and industry—from the repeating chevron patterns on the walls of Great Zimbabwe to the precision-shifted components in modern civil engineering and textile manufacturing.\n\nA **Transformation** is a mathematical process that maps an original figure (the **Object**) onto a new figure (the **Image**). Specifically, a **Translation** is a transformation that "slides" every point of a shape the same distance in a specific direction. Unlike reflection or rotation, a translation moves the object without flipping it, turning it, or changing its size.\n\n**Property Analysis: Isometry and Invariance**\n\nTranslation is an **isometry**, meaning the "sliding" process preserves the geometric integrity of the shape.\n\n- **Size and Shape Invariance:** The lengths of sides, internal angles, and total area remain constant. The Object and Image are therefore congruent.\n- **Orientation Invariance:** The Image remains "upright" relative to the Object; it does not rotate.\n- **Directional Precision:** Every vertex of the shape moves along parallel paths.',
    },
    {
      title: '2. Navigation on the Coordinate Plane',
      content:
        'To calculate the new position of a shape, we use the Cartesian plane to measure displacement along the horizontal ($x$) and vertical ($y$) axes.\n\n**The Mechanics of Movement**\n\n- **Horizontal Movement ($x$):** Moving Right is a positive change ($+$); moving Left is a negative change ($-$).\n- **Vertical Movement ($y$):** Moving Up is a positive change ($+$); moving Down is a negative change ($-$).\n\nTo find the Image, add the movement directive to the original coordinates $(x, y)$.\n\n**Worked Examples: Moving Points**\n\n1. Original $(2, 3)$: Move 3 units right, 2 units up. $(2+3, 3+2) = (5, 5)$.\n2. Original $(5, 1)$: Move 4 units left, 1 unit down. $(5-4, 1-1) = (1, 0)$.\n3. Original $(-2, 4)$: Move 5 units right, 3 units down. $(-2+5, 4-3) = (3, 1)$.\n4. Original $(0, 0)$: Move 6 units left, 2 units up. $(0-6, 0+2) = (-6, 2)$.\n5. Original $(1, -3)$: Move 2 units right, 4 units up. $(1+2, -3+4) = (3, 1)$.\n6. Original $(-4, -2)$: Move 3 units left, 5 units down. $(-4-3, -2-5) = (-7, -7)$.\n7. Original $(6, -1)$: Move 1 unit left, 6 units up. $(6-1, -1+6) = (5, 5)$.\n8. Original $(-3, 0)$: Move 4 units right, 4 units down. $(-3+4, 0-4) = (1, -4)$.\n\n**Common Errors: The "Walk Before You Climb" Strategy**\n\nA frequent mistake is mixing up $x$ and $y$. Always handle the horizontal change (the walk) before the vertical change (the climb). Use a coordinate table to separate the calculations.\n\n**Quick Check Practice**\n\n1. Move point $(4, 2)$ 2 units left and 3 units up.\n2. Move point $(-1, 5)$ 4 units right and 6 units down.\n3. Move point $(0, -2)$ 3 units left and 2 units up.\n4. Move point $(7, 7)$ 7 units left and 7 units down.\n5. Move point $(-3, -3)$ 5 units right and 1 unit down.',
    },
    {
      title: '3. The Mechanics of Translation Vectors',
      content:
        'As per ZIMSEC Assessment Objective 9.1.1, we must use formal mathematical symbols. We represent a translation using a **Column Vector** $\\begin{pmatrix} a \\\\ b \\end{pmatrix}$.\n\n**Vector Components**\n\n- **$a$ (Top):** Horizontal displacement (Positive $=$ Right; Negative $=$ Left).\n- **$b$ (Bottom):** Vertical displacement (Positive $=$ Up; Negative $=$ Down).\n\n**Worked Examples: State the Vector or Image Point**\n\n1. Vector for "5 units left, 2 units up": Left is $-5$, Up is $+2$. Therefore $\\begin{pmatrix} -5 \\\\ 2 \\end{pmatrix}$.\n2. Vector for "3 units right, 4 units down": Right is $+3$, Down is $-4$. Therefore $\\begin{pmatrix} 3 \\\\ -4 \\end{pmatrix}$.\n3. Vector for "6 units right only": Right is $+6$, No vertical movement is $0$. Therefore $\\begin{pmatrix} 6 \\\\ 0 \\end{pmatrix}$.\n4. Vector for "2 units down only": No horizontal is $0$, Down is $-2$. Therefore $\\begin{pmatrix} 0 \\\\ -2 \\end{pmatrix}$.\n5. Apply $\\begin{pmatrix} -2 \\\\ 5 \\end{pmatrix}$ to $(3, 1)$: $(3-2, 1+5) = (1, 6)$.\n6. Apply $\\begin{pmatrix} 4 \\\\ -3 \\end{pmatrix}$ to $(-1, 0)$: $(-1+4, 0-3) = (3, -3)$.\n7. Apply $\\begin{pmatrix} -5 \\\\ -5 \\end{pmatrix}$ to $(2, 2)$: $(2-5, 2-5) = (-3, -3)$.\n8. Apply $\\begin{pmatrix} 0 \\\\ 7 \\end{pmatrix}$ to $(4, -2)$: $(4+0, -2+7) = (4, 5)$.\n\n**Vector vs. Coordinate:** A coordinate $(x, y)$ is a location on a map. A vector $\\begin{pmatrix} a \\\\ b \\end{pmatrix}$ is an instruction to move. Writing a vector as $(a, b)$ is a common error that loses marks in ZIMSEC Paper 1.\n\n**Practice Exercise: Vector Conversion**\n\nState the following as column vectors: 1. 8 units right, 3 units up. 2. 4 units left, 9 units down. 3. 10 units left, 1 unit up. 4. 7 units down. 5. 12 units right. 6. 2 units left, 2 units up. 7. 1 unit right, 5 units down. 8. No movement.',
    },
    {
      title: '4. Describing a Translation: From Diagram to Vector',
      content:
        'In ZIMSEC Paper 2, you are often asked to "Describe fully the single transformation." For a translation, you must provide the name (Translation) and the vector.\n\n**Formula:** Image $-$ Object $=$ Vector. For Object at $(x_1, y_1)$ and Image at $(x_2, y_2)$: $\\begin{pmatrix} x_2 - x_1 \\\\ y_2 - y_1 \\end{pmatrix}$\n\n**Worked Examples: Describe the Transformation**\n\n1. Object $A$ at $(1, 1)$ to Image $A\'$ at $(5, 6)$: $x$: $5-1 = 4$ (Right); $y$: $6-1 = 5$ (Up). Translation with vector $\\begin{pmatrix} 4 \\\\ 5 \\end{pmatrix}$.\n2. Object $B$ at $(0, 4)$ to Image $B\'$ at $(-2, 1)$: $x$: $-2-0 = -2$ (Left); $y$: $1-4 = -3$ (Down). Translation with vector $\\begin{pmatrix} -2 \\\\ -3 \\end{pmatrix}$.\n3. Object $C$ at $(-3, -2)$ to Image $C\'$ at $(1, -2)$: $x$: $1-(-3) = 4$ (Right); $y$: $-2-(-2) = 0$. Translation with vector $\\begin{pmatrix} 4 \\\\ 0 \\end{pmatrix}$.\n4. Object $D$ at $(5, 0)$ to Image $D\'$ at $(2, 4)$: $x$: $2-5 = -3$ (Left); $y$: $4-0 = 4$ (Up). Translation with vector $\\begin{pmatrix} -3 \\\\ 4 \\end{pmatrix}$.\n5. Object $E$ at $(-1, 2)$ to Image $E\'$ at $(-1, 6)$: $x$: $0$; $y$: $6-2 = 4$ (Up). Translation with vector $\\begin{pmatrix} 0 \\\\ 4 \\end{pmatrix}$.\n6. Object $F$ at $(7, -3)$ to Image $F\'$ at $(0, 0)$: $x$: $0-7 = -7$ (Left); $y$: $0-(-3) = 3$ (Up). Translation with vector $\\begin{pmatrix} -7 \\\\ 3 \\end{pmatrix}$.\n\n**Practice Exercise:** Describe the translation for: $(2, 2) \\rightarrow (5, 5)$; $(0, 0) \\rightarrow (-3, 4)$; $(-1, -1) \\rightarrow (1, -1)$; $(4, 10) \\rightarrow (4, 2)$; $(-5, 2) \\rightarrow (0, -3)$.',
    },
    {
      title: '5. Object and Image: Plotting and Labeling Conventions',
      content:
        'To ensure full marks in geometric construction, use **Prime Notation**. If the Object is triangle $ABC$, the Image must be labeled $A\'B\'C\'$.\n\n**Worked Examples: Polygon Translation**\n\n1. **Triangle PQR:** $P(1,1)$, $Q(3,1)$, $R(1,3)$ by vector $\\begin{pmatrix} 2 \\\\ 2 \\end{pmatrix}$. $P\'(3,3)$, $Q\'(5,3)$, $R\'(3,5)$.\n2. **Rectangle DEFG:** $D(0,0)$, $E(2,0)$, $F(2,1)$, $G(0,1)$ by $\\begin{pmatrix} -1 \\\\ 4 \\end{pmatrix}$. $D\'(-1,4)$, $E\'(1,4)$, $F\'(1,5)$, $G\'(-1,5)$.\n3. **Triangle XYZ:** $X(-2,-2)$, $Y(0,-2)$, $Z(-1,0)$ by $\\begin{pmatrix} 4 \\\\ -1 \\end{pmatrix}$. $X\'(2,-3)$, $Y\'(4,-3)$, $Z\'(3,-1)$.\n4. **L-Shape ABCD:** $A(1,1)$, $B(4,1)$, $C(4,2)$, $D(1,2)$ by $\\begin{pmatrix} -3 \\\\ -2 \\end{pmatrix}$. $A\'(-2,-1)$, $B\'(1,-1)$, $C\'(1,0)$, $D\'(-2,0)$.\n5. **Trapezium JKLM:** $J(0,0)$, $K(4,0)$, $L(3,2)$, $M(1,2)$ by $\\begin{pmatrix} 2 \\\\ 3 \\end{pmatrix}$. $J\'(2,3)$, $K\'(6,3)$, $L\'(5,5)$, $M\'(3,5)$.\n6. **Triangle STU:** $S(-4,1)$, $T(-1,1)$, $U(-4,4)$ by $\\begin{pmatrix} 5 \\\\ -4 \\end{pmatrix}$. $S\'(1,-3)$, $T\'(4,-3)$, $U\'(1,0)$.',
    },
    {
      title: '6. ZIMSEC Exam-Style Structured Problems',
      content:
        '1. **Paper 1:** Point $M(4, -7)$ translated by $\\begin{pmatrix} -2 \\\\ 10 \\end{pmatrix}$. Image: $(4-2, -7+10) = (2, 3)$.\n2. **Paper 1:** Translation maps $(3, 3)$ onto $(0, 5)$. Vector: $\\begin{pmatrix} 0-3 \\\\ 5-3 \\end{pmatrix} = \\begin{pmatrix} -3 \\\\ 2 \\end{pmatrix}$.\n3. **Paper 2:** Triangle $ABC$ with $A(1,2)$, $B(1,5)$, $C(3,2)$ translated so $A\'$ is $(5, 0)$. (a) Vector: $\\begin{pmatrix} 4 \\\\ -2 \\end{pmatrix}$. (b) $B\'(5, 3)$, $C\'(7, 0)$.\n4. **Paper 2:** Describe transformation mapping $P(-2, -2)$ to $P\'(0, 0)$. Translation with vector $\\begin{pmatrix} 2 \\\\ 2 \\end{pmatrix}$.\n5. **Paper 1:** Find $k$ if $\\begin{pmatrix} k \\\\ -4 \\end{pmatrix}$ moves $(2, 5)$ to $(10, 1)$. $2+k=10 \\Rightarrow k=8$.\n6. **Paper 2:** Square side 2, bottom-left at $(0,0)$, translated by $\\begin{pmatrix} 3 \\\\ 3 \\end{pmatrix}$. Image vertices: $(3,3)$, $(5,3)$, $(5,5)$, $(3,5)$.\n7. **Paper 1:** Translate $(-5, -5)$ by $\\begin{pmatrix} 5 \\\\ 5 \\end{pmatrix}$. Image: $(0, 0)$.\n8. **Paper 2:** Two consecutive translations $\\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix}$ and $\\begin{pmatrix} 2 \\\\ 1 \\end{pmatrix}$ are equivalent to single translation $\\begin{pmatrix} 3 \\\\ 3 \\end{pmatrix}$. (Add vectors: $x+1+2 = x+3$, $y+2+1 = y+3$.)',
    },
    {
      title: '7. Mixed Revision Exercise',
      content:
        '**Identification & Logic:** 1. Does translation change the area of a shape? (No.) 2. What is the top number in a column vector? (Horizontal movement.) 3. If vector is $\\begin{pmatrix} 0 \\\\ -4 \\end{pmatrix}$, which direction? (Down.) 4. If shape moves 5 units left, what is $a$? ($-5$.) 5. Are Object and Image congruent? (Yes.) 6. What notation distinguishes Image point from Object point $A$? ($A\'$.)\n\n**Vector Notation (7–12):** 7. 10 units up. 8. 3 units left. 9. 4 units right, 4 units down. 10. 1 unit left, 6 units up. 11. 2 units right, 8 units down. 12. 5 units left, 5 units up.\n\n**Coordinate Calculation (13–18):** 13. $(0, 5)$ by $\\begin{pmatrix} 2 \\\\ -2 \\end{pmatrix}$. 14. $(-3, -1)$ by $\\begin{pmatrix} 3 \\\\ 1 \\end{pmatrix}$. 15. $(10, 10)$ by $\\begin{pmatrix} -10 \\\\ -10 \\end{pmatrix}$. 16. $(4, -2)$ by $\\begin{pmatrix} -4 \\\\ 2 \\end{pmatrix}$. 17. $(-1, 6)$ by $\\begin{pmatrix} 5 \\\\ 0 \\end{pmatrix}$. 18. $(7, 0)$ by $\\begin{pmatrix} 0 \\\\ -7 \\end{pmatrix}$.\n\n**Describing Translations (19–25):** 19. $(1, 1) \\rightarrow (2, 2)$. 20. $(5, 0) \\rightarrow (0, 5)$. 21. $(-2, -3) \\rightarrow (1, 1)$. 22. $(4, 4) \\rightarrow (8, 0)$. 23. $(0, -6) \\rightarrow (0, 0)$. 24. $(-1, -1) \\rightarrow (-5, -5)$. 25. $(3, 2) \\rightarrow (1, 5)$.',
    },
    {
      title: '8. Exam-Style Structured Test',
      content:
        '1. Define "Translation" using the term "Isometry". 2. State the vector for a shift 5 units left and 3 units down. 3. Point $A(2, 3)$ moved to $A\'(5, 1)$. State the vector. 4. If $B\'(0, 0)$ is the image of $B(4, -2)$, find the translation vector. 5. Translate $(-2, 4)$ using vector $\\begin{pmatrix} 6 \\\\ -6 \\end{pmatrix}$. 6. Triangle $ABC$ has vertices $(0,0)$, $(2,0)$, $(0,3)$. Find $A\'B\'C\'$ under $\\begin{pmatrix} -2 \\\\ 1 \\end{pmatrix}$. 7. True or False: Translation $\\begin{pmatrix} 3 \\\\ 2 \\end{pmatrix}$ followed by $\\begin{pmatrix} -3 \\\\ -2 \\end{pmatrix}$ returns to original position. 8. Describe the transformation mapping $P(x, y)$ to $P\'(x-4, y+2)$. 9. Square vertices $(1,1)$, $(3,1)$, $(3,3)$, $(1,3)$ translated by $\\begin{pmatrix} -2 \\\\ -2 \\end{pmatrix}$. State new vertices. 10. If vector $\\begin{pmatrix} k \\\\ 2k \\end{pmatrix}$ moves $(1, 1)$ to $(3, 5)$, find $k$. 11. Point $Z(5, 5)$ is the Image; vector was $\\begin{pmatrix} 2 \\\\ 3 \\end{pmatrix}$. Find the Object point. 12. Describe fully the transformation mapping the origin to $(-5, 10)$. 13. Explain why the orientation of a shape remains invariant during translation. 14. A triangle is translated by $\\begin{pmatrix} 4 \\\\ 0 \\end{pmatrix}$ then by $\\begin{pmatrix} 0 \\\\ 4 \\end{pmatrix}$. What is the single equivalent vector? 15. Draw triangle $LMN$ with $L(1,1)$, $M(2,1)$, $N(1,2)$. Translate by $\\begin{pmatrix} 2 \\\\ 1 \\end{pmatrix}$ and label $L\'M\'N\'$.',
    },
    {
      title: '9. Marking Memo (Full Solutions)',
      content:
        '**Quick Check:** 1. $(2, 5)$. 2. $(3, -1)$. 3. $(-3, 0)$. 4. $(0, 0)$. 5. $(2, -4)$.\n\n**Vector Practice:** 1. $\\begin{pmatrix} 8 \\\\ 3 \\end{pmatrix}$. 2. $\\begin{pmatrix} -4 \\\\ -9 \\end{pmatrix}$. 3. $\\begin{pmatrix} -10 \\\\ 1 \\end{pmatrix}$. 4. $\\begin{pmatrix} 0 \\\\ -7 \\end{pmatrix}$. 5. $\\begin{pmatrix} 12 \\\\ 0 \\end{pmatrix}$. 6. $\\begin{pmatrix} -2 \\\\ 2 \\end{pmatrix}$. 7. $\\begin{pmatrix} 1 \\\\ -5 \\end{pmatrix}$. 8. $\\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}$.\n\n**Formal Test Solutions:** 1. Translation is an isometry because it preserves size and shape. 2. $\\begin{pmatrix} -5 \\\\ -3 \\end{pmatrix}$. 3. Vector $\\begin{pmatrix} 3 \\\\ -2 \\end{pmatrix}$. 4. Vector $\\begin{pmatrix} -4 \\\\ 2 \\end{pmatrix}$. 5. Image $(4, -2)$. 6. $A\'(-2, 1)$, $B\'(0, 1)$, $C\'(-2, 4)$. 7. True. 8. Translation with vector $\\begin{pmatrix} -4 \\\\ 2 \\end{pmatrix}$. 9. $(-1,-1)$, $(1,-1)$, $(1,1)$, $(-1,1)$. 10. $k = 2$. 11. Object $(3, 2)$. 12. Translation with vector $\\begin{pmatrix} -5 \\\\ 10 \\end{pmatrix}$. 13. Every point moves the same distance in the same direction; no rotation occurs. 14. $\\begin{pmatrix} 4 \\\\ 4 \\end{pmatrix}$. 15. $L\'(3,2)$, $M\'(4,2)$, $N\'(3,3)$.\n\n**Exam Tip:** Always write out the full addition for each vertex to avoid arithmetic slips.',
    },
  ],
  key_points: [
    'Translation is an isometry: preserves size, shape, and orientation; Object and Image are congruent.',
    'Column vector $\\begin{pmatrix} a \\\\ b \\end{pmatrix}$: $a$ = horizontal (right $+$, left $-$); $b$ = vertical (up $+$, down $-$).',
    'New position: add vector to original coordinates. Vector from diagram: Image $-$ Object.',
    'Use prime notation: Object $ABC \\rightarrow$ Image $A\'B\'C\'$.',
    'Vector is instruction to move; coordinate is a location. Do not write vector as $(a, b)$.',
  ],
  exam_tips: [
    'Handle horizontal ($x$) before vertical ($y$)—"walk before you climb."',
    'Use column vector form; writing $(a, b)$ instead of $\\begin{pmatrix} a \\\\ b \\end{pmatrix}$ loses marks.',
    'For "describe fully": state "Translation" and give the vector.',
    'Write out full addition for each vertex to secure method marks.',
  ],
  visual_descriptions: [
    'Translation slides a shape; all points move parallel and equal distance.',
    'Column vector: top = horizontal, bottom = vertical.',
    'Object $ABC$ and Image $A\'B\'C\'$ are congruent and same orientation.',
  ],
};

const dataRepresentationForm1Notes: MathTopicNotes = {
  topic: 'Data Representation',
  subject: 'Mathematics',
  grade_level: 'Form 1',
  summary:
    'Comprehensive Form 1 Mathematics notes on Data Representation for ZIMSEC Syllabus B (2024–2030). Data representation is the process of organising and displaying collected information in visual formats. Covers frequency tables (tally method), pictograms, bar graphs, line graphs, pie charts, and interpreting represented data. Essential for agriculture, mining, and small-scale business decision-making.',
  sections: [
    {
      title: '1. Introduction to Data Representation',
      content:
        'Within the framework of the ZIMSEC Mathematics Syllabus B (2024–2030), data representation is a strategic competency that transitions learners from basic numeracy to advanced statistical analysis. This Heritage-based curriculum is designed to empower learners with critical thinking and problem-solving skills necessary to solve everyday life problems in Zimbabwe. By mastering how to visualise information, students learn to communicate mathematical ideas successfully and develop the ability to think clearly and work carefully.\n\n**Data Representation** is the process of organising and displaying collected information (data) in a visual format. Presenting data clearly is vital because it allows for the rapid identification of patterns, relationships, and anomalies that raw numbers might hide. According to the syllabus rationale, these skills are fundamental for driving innovation, entrepreneurship, and industrialisation. Choosing the appropriate method of representation ensures that information is accessible to diverse audiences, facilitating effective decision-making in vital sectors such as agriculture, mining, and small-scale business enterprises.\n\n**Form 1 syllabus covers:** Frequency Tables; Pictograms; Bar Graphs; Line Graphs; Pie Charts.',
    },
    {
      title: '2. Frequency Tables: The Foundation of Organisation',
      content:
        'Frequency tables are the primary tool for transforming raw statistical data into meaningful information. In the context of Zimbabwean industrialisation, being able to organise raw data—such as daily production outputs or regional rainfall figures—is the first step toward professional analysis.\n\n**The Tally Method**\n\n1. **List Categories:** Identify the distinct values or categories in the data set.\n2. **Tally:** For every data point, place a vertical mark (|) in the corresponding category row.\n3. **Group by Fives:** The fifth tally mark is drawn diagonally across the previous four (||||).\n4. **Calculate Frequency:** Count the total tally marks for each category and record the number.\n\n**Worked Examples**\n\n**Example 1:** Maize bags per hectare by 20 farmers in Bindura: 5, 6, 5, 7, 8, 5, 6, 5, 9, 5, 6, 7, 5, 8, 5, 6, 5, 7, 5, 6. Most common yield (5 bags) has frequency 9.\n\n**Example 2:** Bucket sales at Mbare market over 15 days: 10, 12, 10, 15, 12, 10, 10, 12, 15, 10, 12, 10, 10, 12, 15. Frequency of selling 10 buckets is 7.\n\n**Example 3:** Cattle owned by 18 households in Gutu. Frequency of households with 4 cattle is 9.\n\n**Example 4:** Transport methods of 20 workers in Bulawayo (Bus, Kombi, Walk). Frequency for Bus is 11.\n\n**Example 5:** Form 1 class attendance in Mutare over 10 days (38, 39, 40). Frequency of 38 attending is 5.\n\n**Example 6:** Crops preferred by 15 farmers in Chinhoyi (Maize, Tobacco, Cotton). Frequency for Maize is 8.\n\n**Example 7:** Shoe sizes of 12 students. Frequency for size 5 is 5.\n\n**Example 8:** ZESA units bought by 10 neighbours (100, 150, 200). Frequency for 100 units is 5.\n\n**Common Errors:** Missing tally marks; miscounting totals; lack of clear table headers.\n\n**Practice Exercise:** Tabulate: (1) Ages 12–14; (2) Bread crates; (3) Grades A, B, C; (4) Siblings 0–4; (5) Rainfall in Chipinge.',
    },
    {
      title: '3. Pictograms: Visualising Data with Symbols',
      content:
        'Pictograms provide high visual impact, making them ideal for reports in agricultural or industrial settings where quick interpretation is necessary.\n\n**Drawing Method**\n\n1. **Select a Symbol:** Choose an icon relevant to the context (e.g. maize cob).\n2. **Determine a Suitable Key:** Choose a ratio where one symbol represents a specific number (e.g. 1 symbol $= 10$ bags).\n3. **Represent Partial Values:** Use half-symbols for values that are half the key\'s value.\n\n**Worked Examples**\n\n1. GMB maize: Farmer A (40), Farmer B (20). Key: 1 symbol $= 10$ bags. A $= 4$ symbols; B $= 2$ symbols.\n2. Cattle: Village X (15), Village Y (30). Key: 1 symbol $= 10$ cattle. X $= 1{,}5$ symbols; Y $= 3$ symbols.\n3. Desks repaired: Mon (12), Tue (6). Key: 1 symbol $= 3$ desks. Mon $= 4$ symbols; Tue $= 2$.\n4. Bicycles: Red (25), Blue (50). Key: 1 symbol $= 25$. Red $= 1$; Blue $= 2$.\n5. Eggs: Pen 1 (50), Pen 2 (75). Key: 1 symbol $= 25$ eggs.\n6. Tree seedlings: Site A (100), Site B (150). Key: 1 symbol $= 50$ trees.\n7. Bus trips: Operator A (8), Operator B (12). Key: 1 symbol $= 4$ trips.\n\n**Common Errors:** Inconsistent symbol sizes; missing keys; incorrect symbol-to-value ratios.\n\n**Practice:** Cotton bales Sanyati (60), Kadoma (90). Key: 1 symbol $= 30$ bales. ZUM passengers Morning (200), Evening (300). Honey Jan (15), Feb (10).',
    },
    {
      title: '4. Bar Graphs: Comparative Analysis',
      content:
        'Bar graphs are strategically used for comparing distinct categories. Accuracy in scale and labelling is critical for success in ZIMSEC national assessments.\n\n**Plotting Process**\n\n1. **Choose a Suitable Scale:** The scale must ensure the graph occupies at least 75% of the grid (typically 10 cm–15 cm on the axis).\n2. **Label Axes:** Category name on the $x$-axis; frequency with units on the $y$-axis.\n3. **Draw Bars:** Use a ruler. Bars must have equal width and equal gaps between them.\n\n**Worked Examples**\n\n1. Agricultural yields (Maize: 45 t, Wheat: 30 t). Scale 2 cm $= 10$ units. Axis labels: Horizontal: Crop Type; Vertical: Yield (tonnes).\n2. ZESA units (House A: 200, House B: 350). Scale 2 cm $= 50$ units.\n3. Rainfall Mutare (Jan: 120 mm, Feb: 150 mm). Scale 1 cm $= 10$ mm.\n4. Market sales (Mon: $60, Tue: $40). Scale 2 cm $= \\$10$.\n5. Club members (Drama: 40, Debate: 25). Scale 2 cm $= 5$ units.\n6. Village population (A: 550, B: 700). Scale 2 cm $= 100$.\n7. Cattle per kraal (Kraal 1: 18, Kraal 2: 12).\n8. Bread crates (Shop A: 15, Shop B: 25). Scale 2 cm $= 5$ crates.\n\n**Common Errors:** Joining of bars (bars MUST NOT touch—touching indicates continuous data/histogram); missing units on vertical axis.',
    },
    {
      title: '5. Line Graphs: Tracking Trends',
      content:
        'Line graphs are used for continuous data, identifying patterns and trends over time, such as daily temperature changes or crop growth.\n\n**Correct Labelling and Technique**\n\n1. **Scale:** Must be consistent and allow for precise point placement.\n2. **Plotting:** Mark points with a neat "x" or small dot.\n3. **Joining:** Use a ruler to join points sequentially to show the trend.\n\n**Worked Examples**\n\n1. Temperature Gweru: 8 am (18°C), 10 am (24°C), 12 pm (30°C). Trend: increasing.\n2. Maize height: Week 1 (10 cm), Week 2 (25 cm). Trend: increasing.\n3. Dam water level: June (10 m), July (8 m). Trend: decreasing.\n4. Business asset: Year 1 ($500), Year 2 ($450). Trend: decreasing.\n5. Milk production: Day 1 (40 L), Day 2 (40 L). Trend: constant.\n6. Bus speed: 1 min (40 km/h), 2 min (60 km/h). Trend: increasing.\n\n**Common Errors:** Incorrect point placement; using line graph for categorical data (e.g. "Favorite Subject").',
    },
    {
      title: '6. Pie Charts: Proportional Representation',
      content:
        'Pie charts visualise the relationship between a part and a whole. In ZIMSEC exams, the calculation of angles is the most critical step.\n\n**Formula**\n$$\\text{Angle} = \\frac{\\text{Category Frequency}}{\\text{Total Frequency}} \\times 360°$$\n\n**Construction Steps**\n\n1. Calculate angles using a 3-column table (Category, Frequency, Angle).\n2. Draw circle with compass.\n3. Use protractor to measure angles from a starting radius.\n4. Label sectors with names and percentages if possible.\n\n**Worked Examples**\n\n1. Livestock (Cattle: 15, Goats: 5). Total 20. Cattle: $\\frac{15}{20} \\times 360 = 270°$; Goats: $\\frac{5}{20} \\times 360 = 90°$.\n2. School budget (Stationery: $3, Sports: $1). Total 4. Stationery: 270°; Sports: 90°.\n3. Village vote (A: 120, B: 60). Total 180. A: $\\frac{120}{180} \\times 360 = 240°$; B: 120°.\n4. Land use (Crops: 60 ha, Grazing: 40 ha). Total 100. Crops: 216°; Grazing: 144°.\n5. Daily time (Work: 8 h, Sleep: 8 h, Other: 8 h). Each: 120°.\n6. Fruit (Mangoes: 25, Oranges: 25). Each: 180°.\n7. Poultry (Broilers: 200, Layers: 100). Total 300. Broilers: 240°; Layers: 120°.\n8. Transport (Bus: 4, Kombi: 1). Total 5. Bus: 288°; Kombi: 72°.',
    },
    {
      title: '7. Interpreting Represented Data: Drawing Inferences',
      content:
        'The goal is to "deduce and draw inferences through manipulation of statistical data" (ZIMSEC Objective 9.1.12).\n\n**Worked Examples**\n\n1. Bar graph: Maize 80 t, Cotton 20 t. Total $= 80 + 20 = 100$ tonnes.\n2. Pie chart: Rent sector $90°$. Fraction $= \\frac{90}{360} = \\frac{1}{4}$.\n3. Line graph: ZESA units drop 400 to 100 over 4 days. Trend: consumption decreasing.\n4. Pictogram: 5 symbols for cattle, key 1 symbol $= 20$. Total $= 5 \\times 20 = 100$ cattle.\n5. Frequency table: Grade A (12), Grade U (2). Least common: Grade U.\n6. Bar graph: Shop X (10 units), Shop Y (5 units). Shop X sold 5 more units.\n7. Pie chart: Agriculture 180°, Mining 180°. Both sectors contribute equally.\n8. Line graph: horizontal at 25°C for 5 h. Temperature remained constant.',
    },
    {
      title: '8. Mixed Revision Exercise',
      content:
        '1. Frequency table: 10, 15, 10, 20, 15, 10, 10, 20. 2. Pictogram for 50 trees (Key: 1 symbol $= 10$). 3. Angle for $f = 30$, total $= 120$. 4. Bar graph: Harare 40 mm, Bulawayo 20 mm. 5. Line graph (1, 5) and (2, 10): describe trend. 6. Coin toss 20 times: tabulate H and T. 7. 1 symbol $= 50$ bags; 175 bags $=?$ symbols. 8. Other $= \\$125$, Total $= \\$500$: angle for Other. 9. Bar scale 2 cm $= 10$ units; bar for 35 units $=?$ cm. 10. Line falls 100 to 20: describe trend. 11. "MATHS IS VITAL FOR NATION BUILDING": frequency table of letters per word. 12. Pictogram cars: White (15), Silver (10). Key: 1 symbol $= 5$. 13. Pie angle 120°: percentage? 14. Bar graph Grade A (15), Grade B (25): total frequency. 15. Points (1, 2) and (2, 8): trend. 16–25: shoe sizes; 70 people at 1 symbol $= 20$; angle $f = 10$, total 60; scale for max 80, axis 16 cm; line up then down; crop types; 5 cows at 1 cow $= 10$; pie total 200, category 50; bar 1 cm $= 5$ units, height for 30; define Data Representation.',
    },
    {
      title: '9. Exam-Style Structured Test',
      content:
        '**Section A:** 1. Define "Frequency Table". 2. State the formula for pie chart sector angle. 3. Pictogram key 1 symbol $= 50$ cattle; 125 cattle $=?$ symbols. 4. Why must bars have equal gaps? 5. Line graph 10, 10, 10: trend?\n\n**Section B:** 6. Rainfall 40, 50, 40, 60, 50, 40, 40, 50. (a) Frequency table. (b) Angle for "40 mm" in pie chart. 7. Sales Fruit (20), Vegetables (60). (a) Bar graph, scale 2 cm $= \\$10$. (b) Angle for Vegetables. 8. Crop growth Week 1 (5 cm), Week 2 (15 cm), Week 3 (20 cm). (a) Line graph, scale 2 cm $= 5$ cm. (b) Describe trend. 9. Pictogram 1 symbol $= 200$ units: Jan (500), Feb (300). 10. Budget 120: Food (60), Rent (30), Transport (30). (a) 3-column table for angles. (b) Which two categories have equal angles? 11–15: Define Objective 9.1.12; half-symbols purpose; total frequency from Grade A (10), B (15), C (5); sum of pie angles; bar 12 cm at 2 cm $= 10$ units.',
    },
    {
      title: '10. Full Memo and Worked Solutions',
      content:
        '**Frequency Tables Practice:** 1. 12: 5; 13: 4; 14: 3. 2. 5: 5; 6: 3; 7: 1; 8: 1. 3. A: 5; B: 6; C: 3. 4. 0: 2; 1: 6; 2: 4; 3: 2; 4: 1. 5. 10: 4; 12: 2; 15: 2.\n\n**Pictograms:** Sanyati 2 symbols; Kadoma 3. Morning 2; Evening 3. Jan 3; Feb 2.\n\n**Pie Charts:** Sport $\\frac{40}{60} \\times 360 = 240°$; Clubs $120°$.\n\n**Mixed Revision:** 1. 10: 4; 15: 2; 20: 2. 2. 5 symbols. 3. $\\frac{30}{120} \\times 360 = 90°$. 4. Harare 8 cm; Bulawayo 4 cm. 5. Increasing. 6. H: 10; T: 10. 7. 2{,}5 symbols. 8. $\\frac{125}{500} \\times 360 = 90°$. 9. 7 cm. 10. Decreasing. 11. $33{,}3\\%$. 12. $\\frac{10}{60} \\times 360 = 60°$. 13. 2 cm $= 10$ units. 14. 6 cm.\n\n**Exam Test:** 1. Organised display using tallies and counts. 2. Angle $= \\frac{f}{\\text{Total}} \\times 360°$. 3. 2{,}5 symbols. 4. To visually separate distinct categories. 5. Constant. 6a) 40: 4; 50: 3; 60: 1. 6b) $\\frac{4}{8} \\times 360 = 180°$. 7a) Fruit 4 cm; Veg 12 cm. 7b) $270°$. 8a) Points (1, 5), (2, 15), (3, 20). 8b) Increasing. 9a) Food 180°; Rent 90°; Transport 90°. 9b) Rent and Transport. 10. 360°. 11. 60 units.',
    },
  ],
  key_points: [
    'Frequency table: list categories, tally, group by fives, count frequency.',
    'Pictogram: choose symbol, fix key (1 symbol $= n$ units), use half-symbols for half values.',
    'Bar graph: equal gaps, bars do not touch; label axes with units.',
    'Line graph: for continuous data over time; join points to show trend.',
    'Pie chart: Angle $= \\frac{f}{\\text{Total}} \\times 360°$; angles sum to 360°.',
  ],
  exam_tips: [
    'Always include a key for pictograms—without it the graph is meaningless.',
    'Bars in a bar graph must NOT touch; touching bars suggest a histogram (continuous data).',
    'For pie charts, use a 3-column table: Category, Frequency, Angle.',
    'Check total frequency matches original data count in frequency tables.',
  ],
  visual_descriptions: [
    'Frequency table: categories | tally | frequency columns.',
    'Pictogram: rows of identical symbols; key at top or bottom.',
    'Bar graph: separate bars, equal width and gaps; line graph: points joined by ruler.',
    'Pie chart: circle divided into sectors; protractor for angles.',
  ],
};

const symmetryForm1Notes: MathTopicNotes = {
  topic: 'Symmetry',
  subject: 'Mathematics',
  grade_level: 'Form 1',
  summary:
    'Comprehensive Form 1 Mathematics notes on Symmetry for ZIMSEC Heritage-based Syllabus B (2024–2030). Symmetry is the property where a shape remains invariant under specific transformations. Covers line symmetry (reflection), rotational symmetry, polygon properties, reflection on the coordinate plane, and heritage/industrial applications (Great Zimbabwe, basketry, car wheels).',
  sections: [
    {
      title: '1. Introduction to Geometric Symmetry',
      content:
        'Within the framework of the Heritage-based Mathematics Syllabus B (2024–2030), symmetry occupies a position of strategic importance. As outlined in the syllabus Rationale (Section 1.2), the study of mathematics is fundamental to driving innovation, entrepreneurship, and industrialisation. Mastery of spatial relationships through symmetry is a critical prerequisite for professional success in fields such as engineering, construction, and architectural design.\n\nIn mathematical terms, **Symmetry** is defined as the property where a geometric shape remains **invariant**—meaning it appears unchanged—under specific transformations. This conceptual understanding begins with the most visible and tactile form of geometric balance: **Line Symmetry**.',
    },
    {
      title: '2. Line Symmetry (Reflection Symmetry)',
      content:
        'Identifying lines of symmetry is a foundational competency for Geometric Research Projects (Objective 4.8) and advanced spatial visualisation. In technical trades, the ability to recognise a "mirror image" ensures structural integrity and aesthetic precision.\n\n**Formal Definition**\n\nA **Line of Symmetry** (Mirror Line) is an imaginary line that passes through a shape and divides it into two identical halves. These halves are reflections of one another; if the shape were folded along this line, the two parts would coincide exactly.\n\n**Orientations of Symmetry**\n\n| Orientation | Description |\n| :--- | :--- |\n| Vertical | Runs perpendicular to the horizon (up and down), dividing into left and right |\n| Horizontal | Runs parallel to the horizon (left to right), dividing into top and bottom |\n| Diagonal | Runs at an angle (oblique), often connecting opposite vertices or side midpoints |\n\n**Common Error:** A frequent mistake in ZIMSEC examinations is assuming that the **diagonals of a rectangle** are lines of symmetry. While a diagonal divides a rectangle into two equal areas, folding along it results in the corners not meeting. Thus a rectangle has only **2** lines of symmetry, not 4.',
    },
    {
      title: '3. Worked Examples: Line Symmetry',
      content:
        '**Example 1 – Isosceles Triangle:** One line from apex to midpoint of base. Therefore **1** line of symmetry.\n\n**Example 2 – Rectangle:** Two lines through perpendicular bisectors of opposite sides (one vertical, one horizontal). Therefore **2** lines of symmetry.\n\n**Example 3 – Kite:** Single diagonal between the two pairs of equal sides. Therefore **1** line of symmetry.\n\n**Example 4 – Parallelogram (General):** Folding along any axis fails to produce coinciding edges. Therefore **0** lines of symmetry.\n\n**Example 5 – Circle:** Any diameter divides into two identical semicircles. Therefore **infinite** lines of symmetry.\n\n**Example 6 – Letter "M":** Vertical line through centre. Therefore **1** line of symmetry.\n\n**Example 7 – Letter "X":** One vertical and one horizontal. Therefore **2** lines of symmetry.\n\n**Example 8 – Letter "G":** Asymmetrical "tail" prevents identical halves. Therefore **0** lines of symmetry.\n\n**Practice Exercise 2.1:** State the number of line(s) of symmetry for: (1) Equilateral Triangle, (2) Rhombus, (3) Regular Pentagon, (4) Letter "E", (5) Scalene Triangle.',
    },
    {
      title: '4. Rotational Symmetry and Order of Rotation',
      content:
        'Rotational symmetry is vital in mechanical systems and is linked to Measures of Time (Section 8.4). In engineering, components like turbines rely on rotational invariance to function efficiently.\n\n**Definitions**\n\n- **Rotational Symmetry:** A shape has this property if it looks exactly the same more than once during a $360°$ turn.\n- **Order of Rotational Symmetry:** The number of times the shape fits onto itself during a full $360°$ rotation.\n\n**Formula**\n$$\\text{Angle of Rotation} = 360° \\div \\text{Order}$$\n\n**Worked Examples**\n\n1. **Square:** Order 4. Angle $= 360° \\div 4 = 90°$.\n2. **Equilateral Triangle:** Order 3. Angle $= 360° \\div 3 = 120°$.\n3. **Letter "S":** Order 2. Angle $= 180°$.\n4. **Regular Hexagon:** Order 6. Angle $= 60°$.\n5. **Letter "H":** Order 2. Angle $= 180°$.\n6. **Rhombus:** Order 2. Angle $= 180°$.\n7. **Regular Octagon:** Order 8. Angle $= 45°$.\n8. **Letter "N":** Order 2. Angle $= 180°$.\n\n**Common Errors:** Order of 1 implies no rotational symmetry (only fits after full $360°$). Avoid dividing order by 360; the order is always the **divisor**.\n\n**Practice 3.1:** (1) Order of regular decagon. (2) Angle for decagon. (3) Order for letter "Z". (4) Angle for order 5. (5) Order if angle is $120°$.',
    },
    {
      title: '5. Symmetry Properties in Polygons',
      content:
        'The relationship between a polygon\'s regularity and its symmetry is absolute. A polygon\'s regularity—defined by equal side lengths and equal interior angles—maximises its symmetry count.\n\n**Regular Polygon Rule:** A regular $n$-gon has $n$ lines of symmetry and order of rotational symmetry $n$.\n\n**Symmetry Profile**\n\n| Regular Polygon | Sides $(n)$ | Lines | Order |\n| :--- | :--- | :--- | :--- |\n| Equilateral Triangle | 3 | 3 | 3 |\n| Square | 4 | 4 | 4 |\n| Regular Pentagon | 5 | 5 | 5 |\n| Regular Hexagon | 6 | 6 | 6 |\n\n**Non-Regular Examples:** Scalene triangle: 0 lines, order 1. Isosceles trapezium: 1 line, order 1. Rhombus: 2 lines (diagonals), order 2.\n\n**Practice 4.1:** (1) Justify why regular heptagon has 7 lines. (2) Lines in non-isosceles trapezium. (3) Compare rectangle vs square. (4) Regular nonagon. (5) Angle for regular pentagon.',
    },
    {
      title: '6. Reflection on the Coordinate Plane',
      content:
        'Per Syllabus Section 9.1.13, Form 1 learners focus on point mapping logic as prerequisite for full figure transformations in Form 2.\n\n**Rules for Reflection**\n\n1. Across $x$-axis: $(x, y) \\rightarrow (x, -y)$\n2. Across $y$-axis: $(x, y) \\rightarrow (-x, y)$\n3. Across line $y = x$: $(x, y) \\rightarrow (y, x)$\n\n**Worked Examples (Mapping)**\n\n| Pre-image | Rule | Image |\n| :--- | :--- | :--- |\n| $A(2, 5)$ | $x$-axis | $A\'(2, -5)$ |\n| $B(-3, 4)$ | $y$-axis | $B\'(3, 4)$ |\n| $C(1, -6)$ | $y=x$ | $C\'(-6, 1)$ |\n| $D(0, 3)$ | $x$-axis | $D\'(0, -3)$ |\n| $E(-2, -2)$ | $y$-axis | $E\'(2, -2)$ |\n| $F(4, 4)$ | $y=x$ | $F\'(4, 4)$ |\n| $G(7, -1)$ | $x$-axis | $G\'(7, 1)$ |\n| $H(-5, 0)$ | $y=x$ | $H\'(0, -5)$ |\n\n**Common Error:** When reflecting in the $y$-axis, only the $x$-coordinate changes sign. Beginners often change both. The axis of reflection remains "constant."\n\n**Practice 5.1:** (1) Reflect $P(8, 2)$ in $x$-axis. (2) Reflect $Q(-5, -3)$ in $y$-axis. (3) Describe $(3, 9) \\rightarrow (9, 3)$. (4) Reflect $S(0, -4)$ in $y=x$. (5) $T\' = (4, -7)$ after $x$-axis reflection; find $T$.',
    },
    {
      title: '7. Symmetry in Real-Life Objects',
      content:
        'In the spirit of Unhu/Ubuntu/Vumunhu (Section 3.6), observing symmetry fosters appreciation for national order.\n\n**Heritage and Industrial Applications**\n\n- **Great Zimbabwe Conical Tower:** Displays infinite rotational symmetry about its vertical axis, symbolising stability and architectural mastery.\n- **Traditional Basketry (Sengere/Rusero):** Patterns use rotational and line symmetry for balanced, durable weaves.\n- **Car Wheel:** High rotational symmetry ensures uniform mass distribution, preventing mechanical vibrations.\n\n**Worked Examples**\n\n1. **Why is rotational symmetry critical for a car wheel?** Uneven weight distribution would cause centrifugal imbalance, leading to safety hazards and mechanical failure.\n2. **Symmetry of a standard brick:** 3 lines (Vertical, Horizontal, Longitudinal) allowing multiple orientations while maintaining structural alignment.\n\n**Practice 6.1:** (1) Letter with only rotational symmetry in a shop sign. (2) Symmetry of a traditional Zimbabwe shield.',
    },
    {
      title: '8. Mixed Revision Exercise',
      content:
        '1. Define "Line of Symmetry". 2. Lines in equilateral triangle? 3. Order for square? 4. Angle for regular pentagon? 5. Reflect $(5, -2)$ in $y$-axis. 6. Which letter has both horizontal and vertical: A, B, or H? 7. Quadrilateral with exactly 2 lines? 8. Order 12: angle? 9. Reflect $(-3, -7)$ in $y=x$. 10. Lines in regular octagon? 11. Order for regular hexagon? 12. Image of $(0, 5)$ in $x$-axis? 13. Symmetry of a circle? 14. Regular $n$-gon has 20 lines: find $n$. 15. Angle for order 2? 16. Does scalene triangle have rotational symmetry? 17. Reflect $(-2, 4)$ in $x$-axis, then in $y$-axis. 18. Mirror line mapping $(2, 3)$ to $(3, 2)$? 19. Lines in a kite? 20. Order of rectangle? 21. Angle for regular nonagon? 22. Reflect $(4, 4)$ in $y=x$. 23. Lines in letter "S"? 24. $P(x, y)$ reflected to $P\'(2, 5)$ in $y$-axis: find $x$, $y$. 25. Why does a parallelogram have order 2 but 0 lines?',
    },
    {
      title: '9. Exam-Style Structured Test',
      content:
        '**Section A:** 1. Order of regular hexagon. 2. Image of $(6, -3)$ in $x$-axis. 3. Lines in rhombus. 4. Angle for regular octagon. 5. Reflect $A(-2, 5)$ in $y=x$. 6. Polygon with angle $60°$. 7. Lines in semicircle? 8. Order for letter "N". 9. Reflect $(4, 0)$ in $y$-axis. 10. Rhombus vs rectangle: more lines? 11. Lines in regular decagon. 12. Image of $(-3, -3)$ in $y=x$.\n\n**Section B:** 13. (a) Why is square more symmetrical than rectangle? (b) Angle for both. 14. (a) Plot $A(1,1)$, $B(4,1)$, $C(4,3)$. (b) Reflect in $x$-axis; state $A\'B\'C\'$. 15. (a) Wheel with 5 spokes: order? (b) Angle? (c) Industrial importance?',
    },
    {
      title: '10. Full Memo and Worked Solutions',
      content:
        '**Practice 2.1:** 1. Equilateral triangle: 3. 2. Rhombus: 2. 3. Regular pentagon: 5. 4. Letter E: 1. 5. Scalene triangle: 0.\n\n**Practice 3.1:** 1. Order 10. 2. Angle $360° \\div 10 = 36°$. 3. Letter Z: 2. 4. $360° \\div 5 = 72°$. 5. $360° \\div 120 = 3$ (Order 3).\n\n**Practice 5.1:** 1. $P\'(8, -2)$. 2. $Q\'(5, -3)$. 3. Reflection in $y = x$. 4. $S\'(-4, 0)$. 5. $T(4, 7)$.\n\n**Mixed Revision (selected):** 1. Line dividing shape into two identical halves. 2. Reflect $(5, -2)$ in $y$-axis: $(-5, -2)$. 3. $360° \\div 12 = 30°$. 4. $360° \\div 2 = 180°$. 5. Parallelogram: fits onto itself twice when spun, but folding leaves edges unmatched.\n\n**Exam Test:** 1. Hexagon order: 6. 2. $(6, 3)$. 3. Rhombus: 2 lines. 4. $45°$. 5. $A\'(5, -2)$. 6. Regular hexagon. 7. Semicircle: 1 line. 14b) $A\'(1, -1)$, $B\'(4, -1)$, $C\'(4, -3)$. 15a) 5. 15b) $72°$. 15c) Ensures balanced weight distribution and smooth motion in machines.',
    },
  ],
  key_points: [
    'Line of symmetry: divides shape into two identical halves (mirror image).',
    'Rectangle has 2 lines (through midpoints), NOT 4—diagonals are not symmetry lines.',
    'Regular $n$-gon: $n$ lines and order $n$; angle $= 360° \\div n$.',
    'Reflection rules: $x$-axis $(x,y)\\rightarrow(x,-y)$; $y$-axis $(-x,y)$; $y=x$ $(y,x)$.',
    'Order of 1 $=$ no rotational symmetry; order is always the divisor in the formula.',
  ],
  exam_tips: [
    'Rectangle diagonals: equal area but corners do not meet when folded—not lines of symmetry.',
    'For $y$-axis reflection, only the $x$-coordinate changes sign.',
    'Regular polygon: lines $=$ order $=$ number of sides.',
  ],
  visual_descriptions: [
    'Line symmetry: fold test—halves coincide. Vertical, horizontal, diagonal orientations.',
    'Rotational symmetry: spin $360°$, count how many times shape fits onto itself.',
    'Reflection: $x$-axis flips $y$; $y$-axis flips $x$; $y=x$ swaps coordinates.',
  ],
};

const circlesForm1Notes: MathTopicNotes = {
  topic: 'Circles',
  subject: 'Mathematics',
  grade_level: 'Form 1',
  summary:
    'Comprehensive Form 1 Mathematics notes on Circles for ZIMSEC Syllabus B (2024–2030). Covers parts of a circle (centre, radius, diameter, circumference, chord, arc, sector, tangent), circumference formula $C = 2\\pi r = \\pi d$, area $A = \\pi r^2$, rearrangement, arcs and sectors, and real-life contexts (Great Zimbabwe, center-pivot irrigation, scotch cart, kraals).',
  sections: [
    {
      title: '1. Introduction to the Geometry of Circles',
      content:
        'In the ZIMSEC Syllabus B (2024–2030) framework, the study of circles is a strategic cornerstone of both the Geometry and Measures and Mensuration strands. Understanding circular properties is the essential foundation for engineering, architecture, and innovation within Zimbabwe\'s "Heritage-based" education system. From the precision required in building the conical tower at Great Zimbabwe to the design of modern center-pivot irrigation systems in Chiredzi, circular geometry drives our national industrialisation. Mastering these concepts fosters the spirit of Unhu/Ubuntu.\n\n**Parts of a Circle**\n\n- **Centre:** The fixed central point (usually $O$) from which all points on the circle\'s edge are the same distance.\n- **Radius ($r$):** A straight line segment from the centre to any point on the boundary (like a bicycle spoke).\n- **Diameter ($d$):** A straight line passing through the centre, joining two points on the boundary—cuts the circle into two equal halves.\n- **Circumference ($C$):** The total linear distance around the outer boundary (the "fence line" or perimeter).\n- **Chord:** A straight line connecting two points on the boundary that does not necessarily pass through the centre.\n- **Arc:** A section or portion of the curved circumference (a curved "slice" of the boundary).\n- **Sector:** The region enclosed by two radii and an arc (like a slice of pizza or a round-hut floor plan).\n- **Tangent:** A straight line that touches the circle at exactly one point; always perpendicular ($90°$) to the radius at the point of contact.\n\n**Radius–Diameter Relationship**\n\n$$d = 2r \\quad \\text{or} \\quad r = \\frac{d}{2}$$\n\nIdentifying which dimension is provided is the critical first step in selecting the correct formula.',
    },
    {
      title: '2. Calculating Circumference',
      content:
        'Circumference is the linear distance of the boundary. In practical Zimbabwean life, this measurement is vital for determining the length of fencing needed for a circular livestock pen or calculating the distance a scotch cart wheel travels in one rotation.\n\n**The Constant $\\pi$ (Pi)**\n\nPer ZIMSEC standards:\n- $\\pi = \\frac{22}{7}$ (Preferred when radius/diameter is a multiple of 7)\n- $\\pi = 3{,}14$ (Preferred for decimal-based dimensions)\n\n**Formulas**\n\n- $C = 2\\pi r$ (when radius is given)\n- $C = \\pi d$ (when diameter is given)\n\nBoth are equivalent because $2r = d$.\n\n**Worked Examples**\n\n1. $r = 7\\ \\text{cm}$, $\\pi = \\frac{22}{7}$: $C = 2 \\times \\frac{22}{7} \\times 7 = 44\\ \\text{cm}$.\n2. $d = 14\\ \\text{m}$, $\\pi = \\frac{22}{7}$: $C = \\frac{22}{7} \\times 14 = 44\\ \\text{m}$.\n3. $r = 10\\ \\text{cm}$, $\\pi = 3{,}14$: $C = 2 \\times 3{,}14 \\times 10 = 62{,}8\\ \\text{cm}$.\n4. $d = 20\\ \\text{mm}$, $\\pi = 3{,}14$: $C = 62{,}8\\ \\text{mm}$.\n5. $r = 21\\ \\text{m}$, $\\pi = \\frac{22}{7}$: $C = 132\\ \\text{m}$.\n6. $d = 3{,}5\\ \\text{cm}$, $\\pi = \\frac{22}{7}$: $C = 11\\ \\text{cm}$.\n7. $r = 1{,}4\\ \\text{m}$, $\\pi = \\frac{22}{7}$: $C = 8{,}8\\ \\text{m}$.\n8. $d = 100\\ \\text{cm}$, $\\pi = 3{,}14$: $C = 314\\ \\text{cm}$.\n\n**Common Error:** Using the diameter in $2\\pi r$ (e.g. $2 \\times \\pi \\times 14$ when 14 is the diameter) doubles your result incorrectly. If you use "2", you must use the radius.\n\n**Practice 2.1:** (1) $r = 14\\ \\text{m}$. (2) $d = 21\\ \\text{cm}$. (3) $r = 5\\ \\text{m}$, $\\pi = 3{,}14$. (4) $d = 70\\ \\text{cm}$. (5) $r = 3{,}5\\ \\text{m}$.',
    },
    {
      title: '3. Area of a Circle',
      content:
        'Area measures the amount of flat surface contained within the boundary. This is vital for calculating material costs, such as the amount of cement needed for a hut floor or the land area covered by a center-pivot irrigator.\n\n**Formula**\n$$A = \\pi r^2$$\n\n**Conceptual Layer:** Why squared units (e.g. cm²)? Because area involves two dimensions. When we square the radius ($r \\times r$), we multiply two lengths, creating a square unit.\n\n**Worked Examples**\n\n1. $r = 7\\ \\text{cm}$, $\\pi = \\frac{22}{7}$: $A = \\frac{22}{7} \\times 7^2 = 154\\ \\text{cm}^2$.\n2. $d = 28\\ \\text{m}$: $r = 14$. $A = \\frac{22}{7} \\times 14^2 = 616\\ \\text{m}^2$.\n3. $r = 10\\ \\text{cm}$, $\\pi = 3{,}14$: $A = 314\\ \\text{cm}^2$.\n4. $d = 42\\ \\text{cm}$: $r = 21$. $A = 1386\\ \\text{cm}^2$.\n5. $r = 3{,}5\\ \\text{m}$: $A = 38{,}5\\ \\text{m}^2$.\n6. $d = 20\\ \\text{cm}$: $r = 10$. $A = 314\\ \\text{cm}^2$.\n7. $r = 14\\ \\text{mm}$: $A = 616\\ \\text{mm}^2$.\n8. $r = 0{,}7\\ \\text{m}$: $A = 1{,}54\\ \\text{m}^2$.\n\n**Common Error:** Do not multiply the radius by 2 instead of squaring it. $7^2 = 49$, while $7 \\times 2 = 14$.\n\n**Practice 3.1:** (1) $r = 21\\ \\text{m}$. (2) $d = 14\\ \\text{cm}$. (3) $r = 4\\ \\text{cm}$, $\\pi = 3{,}14$. (4) $d = 70\\ \\text{m}$. (5) $r = 1{,}4\\ \\text{m}$.',
    },
    {
      title: '4. Determining Radius and Diameter through Rearrangement',
      content:
        'Often we know $C$ or $A$ and must find the radius. This involves "working backward" using algebraic rearrangement.\n\n**Formulas**\n\n- From $C$: $r = \\frac{C}{2\\pi}$\n- From $A$: $r^2 = \\frac{A}{\\pi}$, so $r = \\sqrt{\\frac{A}{\\pi}}$\n\n**Square Roots:** $\\sqrt{x}$ is the inverse of squaring. If $r^2 = 49$, then $r = 7$. Common: $\\sqrt{64}=8$, $\\sqrt{81}=9$, $\\sqrt{100}=10$, $\\sqrt{121}=11$, $\\sqrt{144}=12$.\n\n**Worked Examples**\n\n1. $C = 44\\ \\text{cm}$: $r = 7\\ \\text{cm}$.\n2. $A = 154\\ \\text{cm}^2$: $r^2 = 49$, $r = 7\\ \\text{cm}$.\n3. $C = 62{,}8\\ \\text{m}$, $\\pi = 3{,}14$: $d = 20\\ \\text{m}$.\n4. "Hence" style: $C = 88\\ \\text{cm}$ $\\Rightarrow$ $r = 14\\ \\text{cm}$, $A = 616\\ \\text{cm}^2$.\n5. $A = 314\\ \\text{m}^2$: $r^2 = 100$, $r = 10\\ \\text{m}$.\n6. $C = 132\\ \\text{mm}$: $d = 42\\ \\text{mm}$.\n\n**Practice 4.1:** (1) $C = 22\\ \\text{cm}$. (2) $A = 38{,}5\\ \\text{m}^2$. (3) Wire 110 cm bent into circle: diameter. (4) $A = 1256\\ \\text{m}^2$, $\\pi = 3{,}14$. (5) $C = 176\\ \\text{mm}$.',
    },
    {
      title: '5. Arcs and Sectors: Proportional Reasoning',
      content:
        'Arcs and sectors are "slices" of a whole circle. We use proportional reasoning based on common fractions.\n\n**Conceptual Guide**\n\n- **Arc Length:** A fraction of the whole circumference.\n- **Sector Area:** A fraction of the whole area.\n- **Common Fractions:** Semi-circle $= \\frac{1}{2}$; Quadrant ($90°$) $= \\frac{1}{4}$; Three-quarters $= \\frac{3}{4}$.\n\n**Worked Examples**\n\n1. Semi-circle $r = 7\\ \\text{cm}$: Arc $= \\frac{1}{2} \\times 44 = 22\\ \\text{cm}$.\n2. Quadrant $r = 14\\ \\text{m}$: Sector area $= \\frac{1}{4} \\times 616 = 154\\ \\text{m}^2$.\n3. Semi-circle $d = 21\\ \\text{cm}$: Arc $= 33\\ \\text{cm}$.\n4. Quadrant $r = 10\\ \\text{cm}$, $\\pi = 3{,}14$: Area $= 78{,}5\\ \\text{cm}^2$.\n5. $\\frac{3}{4}$ circle $r = 7\\ \\text{m}$: Arc $= 33\\ \\text{m}$.\n6. $\\frac{3}{4}$ circle $r = 14\\ \\text{cm}$: Sector area $= 462\\ \\text{cm}^2$.\n\n**Common Error:** Do not confuse arc length (cm, m) with sector area (cm², m²).\n\n**Practice 5.1:** (1) Semi-circle $r = 21\\ \\text{cm}$. (2) Quadrant $r = 7\\ \\text{m}$. (3) $90°$ arc, $d = 28\\ \\text{cm}$. (4) Semi-circular rug $d = 20\\ \\text{m}$. (5) $\\frac{3}{4}$ sector $r = 7\\ \\text{cm}$.',
    },
    {
      title: '6. Structured Word Problems and Real-Life Contexts',
      content:
        '**Multi-Step Word Problems**\n\n1. **Transport:** Scotch cart wheel $d = 0{,}7\\ \\text{m}$ (Gokwe cotton farm). Distance after 200 rotations? $C = \\frac{22}{7} \\times 0{,}7 = 2{,}2\\ \\text{m}$ per rotation. $200 \\times 2{,}2 = 440\\ \\text{m}$.\n2. **Livestock:** Circular kraal $r = 14\\ \\text{m}$ (Matabeleland North). Wire length $= 2 \\times \\frac{22}{7} \\times 14 = 88\\ \\text{m}$.\n3. **Heritage Architecture:** Round-hut floor $d = 6\\ \\text{m}$ (Masvingo). Area $= \\pi \\times 3^2$ (floor is flat surface being covered).\n4. **Agriculture:** Center-pivot irrigation 70 m long (Chiredzi). Area $= \\frac{22}{7} \\times 70^2$ in one full rotation.\n5. **Comparison:** Plate A $r = 7\\ \\text{cm}$, Plate B $r = 14\\ \\text{cm}$. Plate B is $2^2 = 4$ times larger (area $\\propto r^2$).\n6. **Engineering:** Pipe internal $d = 10\\ \\text{cm}$. Water opening area $= 3{,}14 \\times 25 = 78{,}5\\ \\text{cm}^2$.\n7. **Garden Design:** Flower bed $r = 3{,}5\\ \\text{m}$ (Glen View). Edge length $= 2 \\times \\frac{22}{7} \\times 3{,}5 = 22\\ \\text{m}$.\n8. **Traditional Storage:** Granary floor $d = 2{,}8\\ \\text{m}$ (Matobo). Floor area $= \\frac{22}{7} \\times 1{,}4^2$.',
    },
    {
      title: '7. Mixed Revision Exercise',
      content:
        '**Part A: Multiple Choice** 1. Distance from centre to edge: (a) Chord (b) Diameter (c) Radius (d) Arc. 2. If $r = 3{,}5\\ \\text{cm}$, then $d$: (a) 7 cm (b) 1,75 cm (c) 14 cm (d) 10 cm. 3. Best $\\pi$ for $d = 21\\ \\text{m}$: (a) 3,14 (b) 22/7 (c) 3,0 (d) 1/7. 4. Area formula: (a) $\\pi d$ (b) $2\\pi r$ (c) $\\pi r^2$ (d) $2\\pi d$. 5. Line touching at one point: (a) Radius (b) Tangent (c) Chord (d) Sector. 6. $d = 14\\ \\text{cm}$: (a) 88 cm (b) 44 cm (c) 154 cm (d) 22 cm. 7. Semi-circle fraction: (a) 1/4 (b) 1/3 (c) 1/2 (d) 1/8. 8. $r = 10\\ \\text{cm}$, $\\pi = 3{,}14$: (a) 314 cm² (b) 62,8 cm (c) 31,4 (d) 100. 9. Slice bounded by two radii: (a) Arc (b) Segment (c) Sector (d) Chord. 10. $d = 7\\ \\text{m}$: radius (a) 14 m (b) 3,5 m (c) 49 m (d) 1 m.\n\n**Part B: Structured (11–30)** Define chord; $C$ for $r = 21\\ \\text{cm}$; $A$ for $r = 7\\ \\text{m}$; $d$ if $C = 88\\ \\text{m}$; quadrant area $r = 14\\ \\text{cm}$; $r$ if $A = 314\\ \\text{cm}^2$; $d = 3{,}5\\ \\text{m}$ to $r$; $C$ for $d = 100\\ \\text{m}$; $A$ for $r = 1\\ \\text{m}$; wheel $d = 0{,}7\\ \\text{m}$ distance; semi-circle arc $r = 14\\ \\text{cm}$; $A$ for $d = 42\\ \\text{cm}$; $r$ if $C = 132\\ \\text{m}$; $\\frac{3}{4}$ sector $r = 7\\ \\text{cm}$; $C$ for $r = 10{,}5\\ \\text{m}$; $d$ if $r = 0{,}25\\ \\text{m}$; quadrant $r = 21\\ \\text{cm}$; $r$ if $A = 12{,}56\\ \\text{cm}^2$; $90°$ arc $d = 14\\ \\text{cm}$; longest chord?',
    },
    {
      title: '8. ZIMSEC-Style Exam Test',
      content:
        '1. (a) State $d$ and $r$ relationship. (b) $C$ for $r = 21\\ \\text{cm}$. 2. Hut floor $d = 14\\ \\text{m}$: (a) Radius. (b) Area. 3. Rearrange $C = \\pi d$ to make $d$ the subject. 4. Bicycle wheel $r = 35\\ \\text{cm}$: (a) Circumference. (b) Rotations to cover 110 m? 5. Quadrant $r = 7\\ \\text{cm}$: (a) Arc length. (b) Area. 6. Pond area $13{,}86\\ \\text{m}^2$: (a) Radius. (b) Hence circumference. 7. Wire 44 cm bent to circle: area? 8. Sector angle $120°$: fraction? 9. Area $d = 20\\ \\text{cm}$, $\\pi = 3{,}14$. 10. Why does a builder need circumference for fencing? 11. Semi-circle $r = 10\\ \\text{cm}$: area. 12. If radius doubled, what happens to circumference? Reason?',
    },
    {
      title: '9. Marking Memorandum (Full Solutions)',
      content:
        '**Practice 2.1:** 1. 88 m. 2. 66 cm. 3. 31,4 m. 4. 220 cm. 5. 22 m.\n\n**Practice 3.1:** 1. 1386 m². 2. 154 cm². 3. 50,24 cm². 4. 3850 m². 5. 6,16 m².\n\n**Practice 4.1:** 1. 3,5 cm. 2. 3,5 m. 3. 35 cm. 4. 20 m. 5. 28 mm.\n\n**Practice 5.1:** 1. 66 cm. 2. 38,5 m². 3. 22 cm. 4. 157 m². 5. 115,5 cm².\n\n**Mixed Revision:** 1–10: (c), (a), (b), (c), (b), (b), (c), (a), (c), (b). 11. Chord: straight line joining two points on boundary. 12. 132 cm. 13. 154 m². 14. 28 m. 15. 154 cm². 16. 10 cm. 17. 1,75 m. 18. 314 m. 19. 3,14 m². 20. 2,2 m. 21. 44 cm. 22. 1386 cm². 23. 21 m. 24. 115,5 cm². 25. 66 m. 26. 0,5 m. 27. 346,5 cm². 28. 2 cm. 29. 11 cm. 30. Diameter.\n\n**Exam Test:** 1a) $d = 2r$. 1b) 132 cm. 2a) 7 m. 2b) 154 m². 3) $d = \\frac{C}{\\pi}$. 4a) 220 cm. 4b) 50 rotations. 5a) 11 cm. 5b) 38,5 cm². 6a) $r = 2{,}1\\ \\text{m}$. 6b) 13,2 m. 7) 154 cm². 8) $\\frac{1}{3}$. 9) 314 cm². 10) To buy correct amount of material. 11) 157 cm². 12) It doubles; $C = 2\\pi r$ so $C \\propto r$.',
    },
  ],
  key_points: [
    'Radius $r$: centre to edge; Diameter $d = 2r$; Circumference $C = 2\\pi r = \\pi d$; Area $A = \\pi r^2$.',
    'Use $\\pi = \\frac{22}{7}$ when $r$ or $d$ is multiple of 7; $\\pi = 3{,}14$ for decimals.',
    'Arc = fraction of $C$; Sector = fraction of $A$. Semi-circle $= \\frac{1}{2}$; Quadrant $= \\frac{1}{4}$.',
    'From $C$: $r = \\frac{C}{2\\pi}$. From $A$: $r = \\sqrt{\\frac{A}{\\pi}}$.',
    'Tangent touches at one point; perpendicular to radius. Chord joins two boundary points; diameter is longest chord.',
  ],
  exam_tips: [
    'If given diameter, use $C = \\pi d$ or find $r = d/2$ first for area—do not use $d$ in $2\\pi r$.',
    'Do not confuse $r^2$ with $2r$—$7^2 = 49$, not 14.',
    'Arc length has units of length (cm, m); sector area has square units (cm², m²).',
  ],
  visual_descriptions: [
    'Radius: spoke from centre O to edge; diameter: line through O cutting circle in half.',
    'Sector: pizza slice bounded by two radii and arc; tangent: line grazing edge at one point.',
    'Circumference: perimeter "fence line"; chord: straight line across (not through centre).',
  ],
};

const form1Notes: Record<string, MathTopicNotes> = {
  ...Object.fromEntries(
    Object.entries(form1Objectives)
      .filter(([k]) => k !== 'Number Concepts and Operations' && k !== 'Approximation and Estimation' && k !== 'Ratios' && k !== 'Large and Small Numbers' && k !== 'Number Bases' && k !== 'Sets and Set Notation' && k !== 'Types of Sets' && k !== 'Scales' && k !== 'Consumer Arithmetic' && k !== 'Measures' && k !== 'Mensuration' && k !== 'Travel Graphs' && k !== 'Symbolic Expression' && k !== 'Algebraic Manipulation' && k !== 'Translation' && k !== 'Data Representation' && k !== 'Symmetry' && k !== 'Circles')
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
  'Travel Graphs': travelGraphsForm1Notes,
  'Symbolic Expression': symbolicExpressionsForm1Notes,
  'Algebraic Manipulation': algebraicManipulationForm1Notes,
  Translation: translationForm1Notes,
  'Data Representation': dataRepresentationForm1Notes,
  Symmetry: symmetryForm1Notes,
  Circles: circlesForm1Notes,
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
