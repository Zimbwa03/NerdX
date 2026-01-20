// Mathematics Virtual Lab Simulations Data
// Interactive simulations for calculus, algebra, and advanced math concepts

import { SimulationMetadata, Badge } from './simulationTypes';

// ============================================
// MATHEMATICS SIMULATIONS (8 Total)
// ============================================

export const MATH_SIMULATIONS: SimulationMetadata[] = [
    // ============================================
    // CALCULUS SIMULATIONS
    // ============================================
    {
        id: 'differentiation-lab',
        title: 'Differentiation Lab',
        subject: 'mathematics',
        topic: 'Calculus - Derivatives',
        description: 'Explore derivatives by tracing tangent lines along curves. Watch the derivative graph paint in real-time as you move along f(x).',
        difficulty: 'medium',
        xpReward: 200,
        estimatedTime: '15-20 mins',
        icon: 'trending-up',
        color: '#2979FF',
        learningObjectives: [
            { id: 'dl-1', text: 'Understand the derivative as the slope of the tangent line' },
            { id: 'dl-2', text: 'Visualize how f\'(x) relates to the steepness of f(x)' },
            { id: 'dl-3', text: 'Identify where derivatives are zero (turning points)' },
            { id: 'dl-4', text: 'Compare derivatives of polynomial, trig, and exponential functions' },
        ],
        quizQuestions: [
            {
                id: 'dl-q1',
                question: 'At a maximum or minimum point on a curve, the derivative f\'(x) equals:',
                options: ['1', '0', 'Infinity', 'Undefined'],
                correctIndex: 1,
                explanation: 'At turning points (maxima/minima), the tangent line is horizontal, meaning the slope (derivative) is zero.',
            },
            {
                id: 'dl-q2',
                question: 'If f(x) = x², what is f\'(x)?',
                options: ['x', '2x', 'x²', '2'],
                correctIndex: 1,
                explanation: 'Using the power rule: d/dx(x²) = 2x¹ = 2x',
            },
            {
                id: 'dl-q3',
                question: 'When the derivative f\'(x) is positive, the original function f(x) is:',
                options: ['Decreasing', 'Increasing', 'Constant', 'At a maximum'],
                correctIndex: 1,
                explanation: 'A positive derivative means the tangent line slopes upward, so the function is increasing.',
            },
            {
                id: 'dl-q4',
                question: 'The derivative of sin(x) is:',
                options: ['-sin(x)', 'cos(x)', '-cos(x)', 'tan(x)'],
                correctIndex: 1,
                explanation: 'The derivative of sin(x) is cos(x). This can be seen by how the sine wave\'s slope matches the cosine wave.',
            },
        ],
    },
    {
        id: 'integration-lab',
        title: 'Integration Lab',
        subject: 'mathematics',
        topic: 'Calculus - Integrals',
        description: 'Visualize integration as the area under a curve. Use Riemann rectangles that "melt" into smooth areas as you increase their number.',
        difficulty: 'hard',
        xpReward: 250,
        estimatedTime: '20-25 mins',
        icon: 'layers',
        color: '#7C4DFF',
        learningObjectives: [
            { id: 'il-1', text: 'Understand integration as the accumulation of area' },
            { id: 'il-2', text: 'Compare left, right, and midpoint Riemann sums' },
            { id: 'il-3', text: 'See how increasing rectangles approaches the exact integral' },
            { id: 'il-4', text: 'Connect the Fundamental Theorem of Calculus visually' },
        ],
        quizQuestions: [
            {
                id: 'il-q1',
                question: 'As the number of Riemann rectangles approaches infinity, the sum approaches:',
                options: ['Zero', 'Infinity', 'The exact integral', 'The derivative'],
                correctIndex: 2,
                explanation: 'The limit of Riemann sums as n→∞ defines the definite integral.',
            },
            {
                id: 'il-q2',
                question: 'The integral ∫₀² x dx equals:',
                options: ['1', '2', '4', '0'],
                correctIndex: 1,
                explanation: 'The antiderivative of x is x²/2. Evaluating from 0 to 2: (2²/2) - (0²/2) = 2 - 0 = 2',
            },
            {
                id: 'il-q3',
                question: 'Which Riemann sum typically gives the best approximation for a given number of rectangles?',
                options: ['Left sum', 'Right sum', 'Midpoint sum', 'All are equally accurate'],
                correctIndex: 2,
                explanation: 'The midpoint rule generally provides a better approximation because errors on either side tend to cancel out.',
            },
            {
                id: 'il-q4',
                question: 'If f(x) is negative over an interval, the integral over that interval is:',
                options: ['Positive', 'Negative', 'Zero', 'Undefined'],
                correctIndex: 1,
                explanation: 'When f(x) < 0, the "area" is below the x-axis and contributes negatively to the integral.',
            },
        ],
    },

    // ============================================
    // ALGEBRA SIMULATIONS
    // ============================================
    {
        id: 'quadratic-explorer',
        title: 'Quadratic Explorer',
        subject: 'mathematics',
        topic: 'Algebra - Quadratic Functions',
        description: 'Drag the vertex and adjust coefficients to see how parabolas transform. Watch roots appear and disappear based on the discriminant.',
        difficulty: 'easy',
        xpReward: 150,
        estimatedTime: '10-15 mins',
        icon: 'git-branch',
        color: '#00E676',
        learningObjectives: [
            { id: 'qe-1', text: 'Understand vertex form y = a(x-h)² + k' },
            { id: 'qe-2', text: 'See how coefficient "a" affects parabola width and direction' },
            { id: 'qe-3', text: 'Visualize how the discriminant determines the number of roots' },
            { id: 'qe-4', text: 'Identify axis of symmetry from the vertex' },
        ],
        quizQuestions: [
            {
                id: 'qe-q1',
                question: 'In y = a(x-h)² + k, the vertex is at:',
                options: ['(a, k)', '(h, k)', '(k, h)', '(-h, k)'],
                correctIndex: 1,
                explanation: 'The vertex form directly shows the vertex coordinates as (h, k).',
            },
            {
                id: 'qe-q2',
                question: 'When a < 0 in y = ax² + bx + c, the parabola:',
                options: ['Opens upward', 'Opens downward', 'Is a straight line', 'Has no vertex'],
                correctIndex: 1,
                explanation: 'A negative "a" value flips the parabola to open downward.',
            },
            {
                id: 'qe-q3',
                question: 'If the discriminant b² - 4ac is negative, the quadratic has:',
                options: ['Two real roots', 'One real root', 'No real roots', 'Infinite roots'],
                correctIndex: 2,
                explanation: 'A negative discriminant means the parabola doesn\'t cross the x-axis, so there are no real roots.',
            },
            {
                id: 'qe-q4',
                question: 'The axis of symmetry of y = x² - 6x + 8 is:',
                options: ['x = 3', 'x = -3', 'x = 6', 'x = 8'],
                correctIndex: 0,
                explanation: 'The axis of symmetry is x = -b/(2a) = -(-6)/(2×1) = 3',
            },
        ],
    },
    {
        id: 'complex-numbers-lab',
        title: 'Complex Numbers Lab',
        subject: 'mathematics',
        topic: 'Algebra - Complex Numbers',
        description: 'Explore the Argand plane where multiplying by i rotates 90°. Visualize Euler\'s identity as a journey around the unit circle.',
        difficulty: 'hard',
        xpReward: 275,
        estimatedTime: '20-25 mins',
        icon: 'infinite',
        color: '#FF4081',
        learningObjectives: [
            { id: 'cn-1', text: 'Represent complex numbers on the Argand diagram' },
            { id: 'cn-2', text: 'Understand multiplication by i as a 90° rotation' },
            { id: 'cn-3', text: 'Convert between rectangular and polar forms' },
            { id: 'cn-4', text: 'Visualize Euler\'s formula e^(iθ) = cos(θ) + i·sin(θ)' },
        ],
        quizQuestions: [
            {
                id: 'cn-q1',
                question: 'What is i² equal to?',
                options: ['1', '-1', 'i', '-i'],
                correctIndex: 1,
                explanation: 'By definition, i = √(-1), so i² = -1.',
            },
            {
                id: 'cn-q2',
                question: 'On the Argand diagram, the imaginary part is plotted on the:',
                options: ['x-axis', 'y-axis', 'Both axes', 'Neither axis'],
                correctIndex: 1,
                explanation: 'The real part is on the x-axis and the imaginary part is on the y-axis.',
            },
            {
                id: 'cn-q3',
                question: 'The modulus of 3 + 4i is:',
                options: ['7', '5', '1', '12'],
                correctIndex: 1,
                explanation: 'Modulus |z| = √(3² + 4²) = √(9 + 16) = √25 = 5',
            },
            {
                id: 'cn-q4',
                question: 'According to Euler\'s identity, e^(iπ) equals:',
                options: ['1', '-1', 'i', '0'],
                correctIndex: 1,
                explanation: 'Euler\'s famous identity: e^(iπ) + 1 = 0, therefore e^(iπ) = -1',
            },
        ],
    },

    // ============================================
    // TRIGONOMETRY SIMULATIONS
    // ============================================
    {
        id: 'trig-functions-lab',
        title: 'Trigonometry Lab',
        subject: 'mathematics',
        topic: 'Trigonometry',
        description: 'Connect the unit circle to sine and cosine waves. Drag a point around the circle and watch the waves draw in real-time.',
        difficulty: 'medium',
        xpReward: 200,
        estimatedTime: '15-20 mins',
        icon: 'sync',
        color: '#00BCD4',
        learningObjectives: [
            { id: 'tf-1', text: 'Understand sine and cosine from the unit circle' },
            { id: 'tf-2', text: 'See how angle changes affect wave values' },
            { id: 'tf-3', text: 'Explore amplitude, period, and phase shift' },
            { id: 'tf-4', text: 'Visualize the relationship between sin and cos' },
        ],
        quizQuestions: [
            {
                id: 'tf-q1',
                question: 'On the unit circle, cos(θ) represents the:',
                options: ['y-coordinate', 'x-coordinate', 'Radius', 'Arc length'],
                correctIndex: 1,
                explanation: 'For a point on the unit circle at angle θ, the x-coordinate is cos(θ) and y-coordinate is sin(θ).',
            },
            {
                id: 'tf-q2',
                question: 'The period of y = sin(x) is:',
                options: ['π', '2π', '1', '360'],
                correctIndex: 1,
                explanation: 'The sine function completes one full cycle every 2π radians (or 360°).',
            },
            {
                id: 'tf-q3',
                question: 'sin(90°) or sin(π/2) equals:',
                options: ['0', '1', '-1', '0.5'],
                correctIndex: 1,
                explanation: 'At 90°, the point on the unit circle is at the top (0, 1), so sin(90°) = 1.',
            },
            {
                id: 'tf-q4',
                question: 'In y = A·sin(Bx), the amplitude is:',
                options: ['A', 'B', '2π/B', 'A·B'],
                correctIndex: 0,
                explanation: 'The amplitude A determines how high and low the wave goes from the center line.',
            },
        ],
    },

    // ============================================
    // LINEAR ALGEBRA SIMULATIONS
    // ============================================
    {
        id: 'vector-visualizer',
        title: 'Vector Visualizer',
        subject: 'mathematics',
        topic: 'Linear Algebra - Vectors',
        description: 'Drag vector tips to explore addition, subtraction, and dot products. See the parallelogram rule and projections come to life.',
        difficulty: 'medium',
        xpReward: 175,
        estimatedTime: '15-20 mins',
        icon: 'arrow-forward',
        color: '#FF9100',
        learningObjectives: [
            { id: 'vv-1', text: 'Add and subtract vectors geometrically' },
            { id: 'vv-2', text: 'Calculate magnitude and direction of vectors' },
            { id: 'vv-3', text: 'Understand dot product as projection' },
            { id: 'vv-4', text: 'Visualize the parallelogram rule for addition' },
        ],
        quizQuestions: [
            {
                id: 'vv-q1',
                question: 'The magnitude of vector (3, 4) is:',
                options: ['7', '5', '12', '1'],
                correctIndex: 1,
                explanation: '|v| = √(3² + 4²) = √(9 + 16) = √25 = 5',
            },
            {
                id: 'vv-q2',
                question: 'The dot product of (1, 2) and (3, 4) is:',
                options: ['14', '11', '10', '5'],
                correctIndex: 1,
                explanation: 'Dot product = 1×3 + 2×4 = 3 + 8 = 11',
            },
            {
                id: 'vv-q3',
                question: 'If two vectors are perpendicular, their dot product is:',
                options: ['1', '-1', '0', 'Undefined'],
                correctIndex: 2,
                explanation: 'Perpendicular vectors have a dot product of zero because there\'s no component of one in the direction of the other.',
            },
            {
                id: 'vv-q4',
                question: 'Vector a + vector b using the parallelogram rule gives a diagonal that represents:',
                options: ['a - b', 'a + b', 'a × b', 'a · b'],
                correctIndex: 1,
                explanation: 'The parallelogram rule shows that the diagonal from the common origin represents the sum a + b.',
            },
        ],
    },
    {
        id: 'matrix-sandbox',
        title: 'Matrix Sandbox',
        subject: 'mathematics',
        topic: 'Linear Algebra - Matrices',
        description: 'Apply 2×2 matrices to shapes and watch them transform. Explore rotation, reflection, shear, and scaling operations.',
        difficulty: 'hard',
        xpReward: 225,
        estimatedTime: '20-25 mins',
        icon: 'grid',
        color: '#E040FB',
        learningObjectives: [
            { id: 'ms-1', text: 'Apply matrix transformations to geometric shapes' },
            { id: 'ms-2', text: 'Understand determinant as area scale factor' },
            { id: 'ms-3', text: 'Identify rotation, reflection, shear matrices' },
            { id: 'ms-4', text: 'Compose multiple transformations via matrix multiplication' },
        ],
        quizQuestions: [
            {
                id: 'ms-q1',
                question: 'The determinant of a 2×2 matrix [[a,b],[c,d]] is:',
                options: ['a + d', 'ad - bc', 'ac - bd', 'ab + cd'],
                correctIndex: 1,
                explanation: 'The determinant of a 2×2 matrix is calculated as ad - bc.',
            },
            {
                id: 'ms-q2',
                question: 'If the determinant of a matrix is 2, the transformed shape\'s area is:',
                options: ['Halved', 'Doubled', 'Unchanged', 'Squared'],
                correctIndex: 1,
                explanation: 'The determinant represents the scale factor for areas. |det| = 2 means area doubles.',
            },
            {
                id: 'ms-q3',
                question: 'The identity matrix [[1,0],[0,1]] transforms a shape by:',
                options: ['Rotating 90°', 'Reflecting it', 'Doing nothing', 'Scaling by 2'],
                correctIndex: 2,
                explanation: 'The identity matrix leaves vectors unchanged: Iv = v for all vectors v.',
            },
            {
                id: 'ms-q4',
                question: 'A rotation matrix by 90° counterclockwise is:',
                options: ['[[0,-1],[1,0]]', '[[1,0],[0,-1]]', '[[0,1],[1,0]]', '[[-1,0],[0,-1]]'],
                correctIndex: 0,
                explanation: 'Rotation by 90° CCW: [[cos90°, -sin90°], [sin90°, cos90°]] = [[0, -1], [1, 0]]',
            },
        ],
    },

    // ============================================
    // OPTIMIZATION SIMULATIONS
    // ============================================
    {
        id: 'linear-programming-lab',
        title: 'Linear Programming Lab',
        subject: 'mathematics',
        topic: 'Optimization',
        description: 'Graph linear inequalities to find the feasible region. Drag the objective function line to find the optimal solution visually.',
        difficulty: 'hard',
        xpReward: 250,
        estimatedTime: '20-25 mins',
        icon: 'analytics',
        color: '#FFD740',
        learningObjectives: [
            { id: 'lp-1', text: 'Graph systems of linear inequalities' },
            { id: 'lp-2', text: 'Identify the feasible region' },
            { id: 'lp-3', text: 'Find corner points of the feasible region' },
            { id: 'lp-4', text: 'Determine optimal solutions for max/min problems' },
        ],
        quizQuestions: [
            {
                id: 'lp-q1',
                question: 'In linear programming, the optimal solution is always found at:',
                options: ['The origin', 'The center of the feasible region', 'A corner (vertex) of the feasible region', 'Outside the feasible region'],
                correctIndex: 2,
                explanation: 'The optimal solution for a linear objective function over a convex feasible region always occurs at a vertex.',
            },
            {
                id: 'lp-q2',
                question: 'The inequality 2x + 3y ≤ 12 represents:',
                options: ['A line only', 'A half-plane below/on the line', 'A half-plane above the line', 'A single point'],
                correctIndex: 1,
                explanation: 'A linear inequality in 2 variables represents a half-plane, including the boundary line when ≤ or ≥.',
            },
            {
                id: 'lp-q3',
                question: 'The feasible region is:',
                options: ['Always unbounded', 'The intersection of all constraint regions', 'A single line', 'Empty if constraints exist'],
                correctIndex: 1,
                explanation: 'The feasible region is the set of all points satisfying ALL constraints simultaneously.',
            },
            {
                id: 'lp-q4',
                question: 'If maximizing z = 3x + 2y, you move the objective line in which direction?',
                options: ['Toward the origin', 'Away from the origin', 'Parallel only', 'It depends on constraints'],
                correctIndex: 1,
                explanation: 'To maximize, you push the objective line as far as possible away from the origin while staying in the feasible region.',
            },
        ],
    },
];

// ============================================
// MATH LAB BADGES
// ============================================

export const MATH_LAB_BADGES: Badge[] = [
    {
        id: 'calculus-initiate',
        name: 'Calculus Initiate',
        description: 'Complete both Differentiation and Integration labs',
        icon: 'calculator',
        requirement: { type: 'simulations_completed', value: 2, subject: 'mathematics' },
    },
    {
        id: 'math-explorer',
        name: 'Math Explorer',
        description: 'Complete 4 mathematics simulations',
        icon: 'compass',
        requirement: { type: 'simulations_completed', value: 4, subject: 'mathematics' },
    },
    {
        id: 'math-master',
        name: 'Mathematics Master',
        description: 'Complete all 8 mathematics simulations',
        icon: 'trophy',
        requirement: { type: 'subject_mastery', value: 8, subject: 'mathematics' },
    },
    {
        id: 'complex-thinker',
        name: 'Complex Thinker',
        description: 'Score 100% on the Complex Numbers quiz',
        icon: 'infinite',
        requirement: { type: 'perfect_quiz', value: 1, subject: 'mathematics' },
    },
];

// Helper functions for math simulations

export const getMathSimulationById = (id: string): SimulationMetadata | undefined => {
    return MATH_SIMULATIONS.find(sim => sim.id === id);
};

export const getMathSimulationsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): SimulationMetadata[] => {
    return MATH_SIMULATIONS.filter(sim => sim.difficulty === difficulty);
};

// Sample functions for simulations
export const SAMPLE_FUNCTIONS = {
    polynomial: [
        { expression: 'x^2', derivative: '2x', label: 'y = x²' },
        { expression: 'x^3', derivative: '3x^2', label: 'y = x³' },
        { expression: 'x^2 - 4x + 3', derivative: '2x - 4', label: 'y = x² - 4x + 3' },
        { expression: '0.5*x^2 + 2*x - 1', derivative: 'x + 2', label: 'y = 0.5x² + 2x - 1' },
    ],
    trigonometric: [
        { expression: 'sin(x)', derivative: 'cos(x)', label: 'y = sin(x)' },
        { expression: 'cos(x)', derivative: '-sin(x)', label: 'y = cos(x)' },
        { expression: '2*sin(x)', derivative: '2*cos(x)', label: 'y = 2sin(x)' },
    ],
    exponential: [
        { expression: 'exp(x)', derivative: 'exp(x)', label: 'y = eˣ' },
        { expression: '2^x', derivative: '2^x * ln(2)', label: 'y = 2ˣ' },
    ],
};

// Preset matrices for transformations
export const PRESET_MATRICES = {
    identity: { matrix: [[1, 0], [0, 1]] as [[number, number], [number, number]], name: 'Identity', description: 'No change' },
    rotate90: { matrix: [[0, -1], [1, 0]] as [[number, number], [number, number]], name: 'Rotate 90°', description: 'Counterclockwise' },
    rotate180: { matrix: [[-1, 0], [0, -1]] as [[number, number], [number, number]], name: 'Rotate 180°', description: 'Half turn' },
    reflectX: { matrix: [[1, 0], [0, -1]] as [[number, number], [number, number]], name: 'Reflect X', description: 'Over x-axis' },
    reflectY: { matrix: [[-1, 0], [0, 1]] as [[number, number], [number, number]], name: 'Reflect Y', description: 'Over y-axis' },
    scale2x: { matrix: [[2, 0], [0, 2]] as [[number, number], [number, number]], name: 'Scale 2×', description: 'Double size' },
    shearRight: { matrix: [[1, 1], [0, 1]] as [[number, number], [number, number]], name: 'Shear Right', description: 'Horizontal shear' },
};
