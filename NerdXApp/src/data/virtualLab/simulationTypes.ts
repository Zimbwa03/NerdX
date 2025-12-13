// Virtual Lab Simulation Types
// Type definitions for interactive science simulations

export type Subject = 'biology' | 'chemistry' | 'physics';
export type Difficulty = 'easy' | 'medium' | 'hard';

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
} as const;

// Difficulty colors
export const DIFFICULTY_COLORS = {
    easy: '#4CAF50',
    medium: '#FF9800',
    hard: '#F44336',
} as const;
