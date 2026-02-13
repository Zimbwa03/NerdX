export type MathFormLevel = 'Form 1' | 'Form 2' | 'Form 3' | 'Form 4';

export interface MathTopic {
  id: string;
  name: string;
  description: string;
  formLevel: MathFormLevel;
  hasNotes?: boolean;
}

export const mathFormLevels: MathFormLevel[] = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];

export const mathTopics: MathTopic[] = [
  { id: 'num', name: 'Number Theory', description: 'Factors, multiples, HCF, LCM, prime numbers, and prime factorisation.', formLevel: 'Form 1', hasNotes: true },
  { id: 'integers', name: 'Integers', description: 'Operations with positive and negative integers, number lines, and order of operations.', formLevel: 'Form 1', hasNotes: false },
  { id: 'fractions', name: 'Fractions & Decimals', description: 'Operations with fractions and decimals, conversions, and recurring decimals.', formLevel: 'Form 1', hasNotes: false },
  { id: 'percentages', name: 'Percentages', description: 'Percentage calculations, percentage increase/decrease, and simple interest.', formLevel: 'Form 1', hasNotes: false },
  { id: 'ratio_intro', name: 'Ratio & Proportion', description: 'Simplifying ratios, dividing quantities in given ratios, and direct proportion.', formLevel: 'Form 1', hasNotes: false },
  { id: 'basic_algebra', name: 'Basic Algebra', description: 'Algebraic expressions, substitution, simplification, and collecting like terms.', formLevel: 'Form 1', hasNotes: true },
  { id: 'linear_eq', name: 'Linear Equations', description: 'Solving linear equations in one unknown with whole number and fractional coefficients.', formLevel: 'Form 1', hasNotes: false },
  { id: 'basic_geo', name: 'Basic Geometry', description: 'Angles, triangles, polygons, angle properties of parallel lines, and angle sums.', formLevel: 'Form 1', hasNotes: true },
  { id: 'perimeter_area', name: 'Perimeter & Area', description: 'Perimeter and area of rectangles, triangles, parallelograms, and composite shapes.', formLevel: 'Form 1', hasNotes: false },
  { id: 'basic_stats', name: 'Basic Statistics', description: 'Data collection, tally charts, bar graphs, pictograms, mean, mode, and median.', formLevel: 'Form 1', hasNotes: false },
  { id: 'coordinates', name: 'Coordinates & Simple Graphs', description: 'Cartesian plane, plotting points, and drawing straight-line graphs from tables.', formLevel: 'Form 1', hasNotes: false },

  { id: 'sets', name: 'Sets', description: 'Set notation, Venn diagrams, union, intersection, complement, and subsets.', formLevel: 'Form 2', hasNotes: true },
  { id: 'ind', name: 'Indices & Standard Form', description: 'Laws of indices, zero/negative indices, and standard form (scientific notation).', formLevel: 'Form 2', hasNotes: true },
  { id: 'alg', name: 'Algebraic Manipulation', description: 'Factorisation, expanding brackets, algebraic fractions, and changing subject of formula.', formLevel: 'Form 2', hasNotes: true },
  { id: 'ineq', name: 'Inequalities', description: 'Solving linear inequalities, number line representation, and compound inequalities.', formLevel: 'Form 2', hasNotes: true },
  { id: 'simult', name: 'Simultaneous Equations', description: 'Solving pairs of linear equations by elimination and substitution methods.', formLevel: 'Form 2', hasNotes: false },
  { id: 'mens', name: 'Mensuration', description: 'Surface area and volume of prisms, cylinders, cones, spheres, and composite solids.', formLevel: 'Form 2', hasNotes: true },
  { id: 'trans', name: 'Transformations', description: 'Translation, reflection, rotation, and enlargement with scale factors.', formLevel: 'Form 2', hasNotes: true },
  { id: 'loci', name: 'Loci & Construction', description: 'Constructing perpendicular bisectors, angle bisectors, and describing loci.', formLevel: 'Form 2', hasNotes: true },
  { id: 'prob_intro', name: 'Probability (Intro)', description: 'Experimental and theoretical probability, sample spaces, and simple combined events.', formLevel: 'Form 2', hasNotes: false },
  { id: 'stats2', name: 'Statistics (Grouped Data)', description: 'Frequency tables, grouped data, mean of grouped data, and frequency polygons.', formLevel: 'Form 2', hasNotes: false },
  { id: 'var_intro', name: 'Variation (Direct & Inverse)', description: 'Direct proportion, inverse proportion, and setting up variation equations.', formLevel: 'Form 2', hasNotes: false },

  { id: 'quad', name: 'Quadratic Equations', description: 'Solving quadratics by factorisation, completing the square, and the quadratic formula.', formLevel: 'Form 3', hasNotes: false },
  { id: 'func_graph', name: 'Functions & Graphs', description: 'Quadratic, cubic, and reciprocal functions, sketching curves, and interpreting graphs.', formLevel: 'Form 3', hasNotes: false },
  { id: 'trig', name: 'Trigonometry', description: 'Sine, cosine, and tangent ratios in right-angled triangles, angles of elevation/depression.', formLevel: 'Form 3', hasNotes: true },
  { id: 'pythag', name: 'Pythagoras\' Theorem', description: 'Applications of Pythagoras\' theorem in 2D and 3D problems.', formLevel: 'Form 3', hasNotes: false },
  { id: 'coord_geo', name: 'Coordinate Geometry', description: 'Gradient, midpoint, distance formula, equation of a line, and parallel/perpendicular lines.', formLevel: 'Form 3', hasNotes: false },
  { id: 'mat', name: 'Matrices', description: 'Matrix operations, determinants, inverse matrices, and matrix transformations.', formLevel: 'Form 3', hasNotes: true },
  { id: 'seq', name: 'Sequences & Series', description: 'Arithmetic and geometric sequences, nth term, sum of terms, and pattern recognition.', formLevel: 'Form 3', hasNotes: true },
  { id: 'vec', name: 'Vectors', description: 'Column vectors, addition/subtraction, scalar multiplication, and position vectors.', formLevel: 'Form 3', hasNotes: true },
  { id: 'circle_thm', name: 'Circle Theorems', description: 'Angle at centre, angle in semicircle, cyclic quadrilateral, tangent properties.', formLevel: 'Form 3', hasNotes: false },
  { id: 'scale_draw', name: 'Scale Drawings', description: 'Map scales, representative fractions, and reading/making scale drawings.', formLevel: 'Form 3', hasNotes: false },

  { id: 'adv_trig', name: 'Advanced Trigonometry', description: 'Sine and cosine rules, area of triangle using sine, 3D trigonometry problems.', formLevel: 'Form 4', hasNotes: false },
  { id: 'graph', name: 'Graphs of Functions', description: 'Drawing and interpreting graphs, graphical solutions of equations, and travel graphs.', formLevel: 'Form 4', hasNotes: true },
  { id: 'stat', name: 'Statistics', description: 'Histograms, cumulative frequency, box-and-whisker plots, and standard deviation.', formLevel: 'Form 4', hasNotes: true },
  { id: 'prob', name: 'Probability', description: 'Tree diagrams, conditional probability, compound events, and probability rules.', formLevel: 'Form 4', hasNotes: true },
  { id: 'var', name: 'Variation', description: 'Joint variation, partial variation, and application to real-world problems.', formLevel: 'Form 4', hasNotes: true },
  { id: 'consumer', name: 'Consumer Arithmetic', description: 'Compound interest, hire purchase, income tax, exchange rates, and profit/loss.', formLevel: 'Form 4', hasNotes: true },
  { id: 'bearing', name: 'Bearings', description: 'Three-figure bearings, navigation problems, and combined bearing/trigonometry.', formLevel: 'Form 4', hasNotes: false },
  { id: 'geo', name: 'Geometry (Advanced)', description: 'Symmetry, similarity, congruence, and geometric proofs.', formLevel: 'Form 4', hasNotes: true },
  { id: 'linear_prog', name: 'Linear Programming', description: 'Formulating and solving linear programming problems graphically.', formLevel: 'Form 4', hasNotes: false },
  { id: 'number_bases', name: 'Number Bases', description: 'Binary, octal, and other base conversions and arithmetic.', formLevel: 'Form 4', hasNotes: false },
];

export function getMathTopicsByForm(form: MathFormLevel): MathTopic[] {
  return mathTopics.filter((t) => t.formLevel === form);
}

export function getMathTopicById(id: string): MathTopic | undefined {
  return mathTopics.find((t) => t.id === id);
}
