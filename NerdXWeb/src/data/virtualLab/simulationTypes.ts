// Virtual Lab Simulation Types
// Type definitions for interactive science simulations

export type Subject = 'biology' | 'chemistry' | 'physics' | 'mathematics' | 'english' | 'computer_science' | 'geography' | 'accounting' | 'business_enterprise_skills' | 'history';
export type Difficulty = 'easy' | 'medium' | 'hard';

// ============================
// Hands-on Activity Types
// ============================

export type HandsOnActivityType = 'experiment_runner' | 'matching' | 'sequencing';

export interface ExperimentControl {
    id: string;
    label: string;
    unit?: string;
    min: number;
    max: number;
    step: number;
    defaultValue: number;
}

export interface ExperimentReadout {
    id: string;
    label: string;
    unit?: string;
    /**
     * A simple formula string using control IDs, e.g.:
     *  - "a*b"
     *  - "a/(b+c)"
     *  - "a + 2*b"
     * Supported operators: + - * / ( )
     */
    formula: string;
    decimals?: number;
}

export interface ExperimentTask {
    id: string;
    instruction: string;
    /**
     * Condition string using control/readout IDs.
     * Examples:
     *  - "rate >= 8"
     *  - "temp >= 35 && temp <= 40"
     */
    condition: string;
}

export interface ExperimentRunnerConfig {
    type: 'experiment_runner';
    intro?: string;
    controls: ExperimentControl[];
    readouts: ExperimentReadout[];
    tasks: ExperimentTask[];
    requiredTasksToUnlock?: number; // default = all
}

export interface MatchingPair {
    left: string;
    right: string;
}

export interface MatchingActivityConfig {
    type: 'matching';
    prompt?: string;
    pairs: MatchingPair[];
    requiredCorrectToUnlock?: number; // default = all
}

export interface SequencingActivityConfig {
    type: 'sequencing';
    prompt?: string;
    steps: string[]; // correct order
    requiredCorrectToUnlock?: number; // default = all
}

export type HandsOnActivityConfig =
    | ExperimentRunnerConfig
    | MatchingActivityConfig
    | SequencingActivityConfig;

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

export interface LearningObjective {
    id: string;
    text: string;
    icon?: string;
}

export interface SimulationMetadata {
    id: string;
    title: string;
    subject: Subject;
    topic: string;
    description: string;
    difficulty: Difficulty;
    xpReward: number;
    estimatedTime: string; // e.g., "10-15 mins"
    icon: string;
    color: string;
    learningObjectives: LearningObjective[];
    quizQuestions: QuizQuestion[];
    handsOnActivity?: HandsOnActivityConfig;
}

export interface SimulationProgress {
    simulationId: string;
    completed: boolean;
    completedAt?: Date;
    xpEarned: number;
    quizScore: number;
    attempts: number;
    bestScore: number;
}

export interface UserLabProgress {
    totalXp: number;
    simulationsCompleted: number;
    badges: Badge[];
    progressBySimulation: Record<string, SimulationProgress>;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt?: Date;
    requirement: {
        type: 'simulations_completed' | 'xp_earned' | 'perfect_quiz' | 'subject_mastery';
        value: number;
        subject?: Subject;
    };
}

// Simulation-specific state types

export interface CellExplorerState {
    cellType: 'plant' | 'animal';
    magnification: 100 | 400 | 1000;
    labeledOrganelles: string[];
    focusLevel: number;
}

export interface OsmosisState {
    solutionConcentration: number; // 0-100
    solutionType: 'hypotonic' | 'isotonic' | 'hypertonic';
    cellVolume: number;
    waterMovementDirection: 'in' | 'out' | 'balanced';
    observations: {
        concentration: number;
        cellState: string;
        timestamp: number;
    }[];
}

export interface AtomBuilderState {
    protons: number;
    neutrons: number;
    electrons: number;
    atomicNumber: number;
    massNumber: number;
    elementName: string;
    elementSymbol: string;
    electronConfiguration: number[];
    isStable: boolean;
}

export interface EquationBalancerState {
    currentLevel: number;
    equation: ChemicalEquation;
    coefficients: number[];
    isBalanced: boolean;
    atomCounts: { reactants: Record<string, number>; products: Record<string, number> };
}

export interface ChemicalEquation {
    id: string;
    reactants: string[];
    products: string[];
    correctCoefficients: number[];
    difficulty: Difficulty;
}

export interface CircuitComponent {
    id: string;
    type: 'cell' | 'bulb' | 'resistor' | 'switch' | 'wire' | 'ammeter' | 'voltmeter';
    x: number;
    y: number;
    rotation: number;
    value?: number; // Resistance, voltage, etc.
    isOn?: boolean; // For switches
}

export interface CircuitBuilderState {
    components: CircuitComponent[];
    connections: { from: string; to: string }[];
    circuitType: 'series' | 'parallel' | 'mixed';
    totalCurrent: number;
    totalVoltage: number;
    totalResistance: number;
    isComplete: boolean;
}

export interface ProjectileMotionState {
    launchAngle: number; // 0-90 degrees
    initialVelocity: number; // m/s
    gravity: number; // m/s²
    trajectory: { x: number; y: number; t: number }[];
    maxHeight: number;
    range: number;
    timeOfFlight: number;
    isLaunched: boolean;
    showAirResistance: boolean;
}

// ============================
// Mathematics Simulation States
// ============================

export interface DifferentiationLabState {
    functionType: 'polynomial' | 'trigonometric' | 'exponential';
    xPosition: number; // Current x position on the curve
    showTangent: boolean;
    showDerivativeGraph: boolean;
    derivativeValue: number; // f'(x) at current position
    functionExpression: string;
}

export interface IntegrationLabState {
    functionType: 'polynomial' | 'trigonometric';
    numRectangles: number; // 1-100
    sumType: 'left' | 'right' | 'midpoint';
    lowerBound: number;
    upperBound: number;
    calculatedArea: number;
    exactArea: number;
    isAnimating: boolean;
}

export interface ComplexNumbersLabState {
    realPart: number;
    imaginaryPart: number;
    modulus: number;
    argument: number; // in radians
    showPolarForm: boolean;
    rotationHistory: { real: number; imag: number }[];
    animationMode: 'none' | 'multiply_i' | 'euler_spiral';
}

export interface QuadraticExplorerState {
    a: number; // coefficient of x^2
    h: number; // vertex x-coordinate
    k: number; // vertex y-coordinate
    showRoots: boolean;
    showAxisOfSymmetry: boolean;
    discriminant: number;
    roots: number[];
}

export interface TrigFunctionsLabState {
    angle: number; // in radians
    showSineWave: boolean;
    showCosineWave: boolean;
    amplitude: number;
    period: number;
    phaseShift: number;
    showUnitCircle: boolean;
    showTriangle: boolean;
}

export interface VectorVisualizerState {
    vector1: { x: number; y: number };
    vector2: { x: number; y: number };
    operation: 'add' | 'subtract' | 'dot_product' | 'none';
    showMagnitude: boolean;
    showAngle: boolean;
    resultVector: { x: number; y: number } | null;
    dotProductValue: number | null;
}

export interface MatrixSandboxState {
    matrix: [[number, number], [number, number]]; // 2x2 matrix
    transformType: 'rotation' | 'reflection' | 'shear' | 'scale' | 'custom';
    showOriginalShape: boolean;
    showTransformedShape: boolean;
    determinant: number;
    shapeType: 'square' | 'triangle';
}

export interface LinearProgrammingLabState {
    constraints: {
        a: number;
        b: number;
        c: number;
        inequality: '<=' | '>=' | '=';
    }[];
    objectiveFunction: { a: number; b: number };
    optimizationType: 'maximize' | 'minimize';
    feasibleRegion: { x: number; y: number }[];
    optimalPoint: { x: number; y: number } | null;
    optimalValue: number | null;
}

// Color palette for subjects
export const SUBJECT_COLORS = {
    biology: {
        primary: '#4CAF50',
        secondary: '#81C784',
        gradient: ['#4CAF50', '#2E7D32'] as [string, string],
    },
    chemistry: {
        primary: '#FF9800',
        secondary: '#FFB74D',
        gradient: ['#FF9800', '#EF6C00'] as [string, string],
    },
    physics: {
        primary: '#2196F3',
        secondary: '#64B5F6',
        gradient: ['#2196F3', '#1565C0'] as [string, string],
    },
    mathematics: {
        primary: '#2979FF',
        secondary: '#82B1FF',
        gradient: ['#2979FF', '#1565C0'] as [string, string],
    },
    english: {
        primary: '#9C27B0',
        secondary: '#CE93D8',
        gradient: ['#9C27B0', '#7B1FA2'] as [string, string],
    },
    computer_science: {
        primary: '#0066CC',
        secondary: '#4D94E6',
        gradient: ['#0066CC', '#004C99'] as [string, string],
    },
    geography: {
        primary: '#2E7D32',
        secondary: '#66BB6A',
        gradient: ['#2E7D32', '#1B5E20'] as [string, string],
    },
    accounting: {
        primary: '#B8860B',
        secondary: '#DAA520',
        gradient: ['#B8860B', '#8B6914'] as [string, string],
    },
    business_enterprise_skills: {
        primary: '#2E7D32',
        secondary: '#66BB6A',
        gradient: ['#2E7D32', '#1B5E20'] as [string, string],
    },
    history: {
        primary: '#5D4037',
        secondary: '#8D6E63',
        gradient: ['#5D4037', '#3E2723'] as [string, string],
    },
} as const;

// Difficulty colors
export const DIFFICULTY_COLORS = {
    easy: '#4CAF50',
    medium: '#FF9800',
    hard: '#F44336',
} as const;
