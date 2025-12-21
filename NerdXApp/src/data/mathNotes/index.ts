// Math Notes - Main Entry Point
import { numberNotes, numberTopics } from './numbers';
import { algebraNotes, algebraTopics } from './algebra';
import { geometryNotes, geometryTopics } from './geometry';
import { statisticsNotes, mensurationNotes, statisticsTopics, mensurationTopics } from './statistics';
import { MathTopicNotes } from './types';

export { MathTopicNotes, MathNotesSection, MathWorkedExample } from './types';

// Combine all notes into a single object
export const mathNotes: Record<string, Record<string, MathTopicNotes>> = {
    Mathematics: {
        ...numberNotes,
        ...algebraNotes,
        ...geometryNotes,
        ...statisticsNotes,
        ...mensurationNotes,
    },
};

// O-Level Topics in recommended study order
export const mathTopics: Record<string, string[]> = {
    Mathematics: [
        // Number topics (Foundation)
        ...numberTopics,
        // Algebra topics
        ...algebraTopics,
        // Geometry topics
        ...geometryTopics,
        // Statistics and Probability
        ...statisticsTopics,
        // Mensuration
        ...mensurationTopics,
    ],
};

// Helper function to get list of topics
export function getMathTopics(subject: string = 'Mathematics'): string[] {
    return mathTopics[subject] || [];
}

// Helper function to get notes for a specific topic
export function getMathTopicNotes(topic: string, subject: string = 'Mathematics'): MathTopicNotes | null {
    const subjectNotes = mathNotes[subject];
    if (!subjectNotes) return null;

    return subjectNotes[topic] || null;
}

// Export all available topics for quick reference
export const allMathTopics = [
    // Number
    'Real Numbers',
    'Fractions, Decimals & Percentages',
    'Ratio and Proportion',
    // Algebra
    'Algebraic Expressions',
    'Quadratic Equations',
    'Linear Equations & Inequalities',
    'Indices and Logarithms',
    // Geometry
    'Angles and Polygons',
    'Pythagoras Theorem',
    'Trigonometry',
    'Circle Theorems',
    // Statistics
    'Statistics',
    'Probability',
    // Mensuration
    'Mensuration',
];
