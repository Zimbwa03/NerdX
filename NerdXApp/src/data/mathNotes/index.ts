// Math Notes - Main Entry Point
import { numberNotes, numberTopics } from './numbers';
import { algebraNotes, algebraTopics } from './algebra';
import { geometryNotes, geometryTopics } from './geometry';
import { statisticsNotes, mensurationNotes, statisticsTopics, mensurationTopics } from './statistics';
import { matricesNotes, matricesTopics } from './matrices';
import { vectorsNotes, vectorsTopics } from './vectors';
import { transformationsNotes, transformationsTopics } from './transformations';
import { setsNotes, setsTopics } from './sets';
import { functionsNotes, functionsTopics } from './functions';
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
        ...matricesNotes,
        ...vectorsNotes,
        ...transformationsNotes,
        ...setsNotes,
        ...functionsNotes,
    },
};

// O-Level Topics in recommended study order
export const mathTopics: Record<string, string[]> = {
    Mathematics: [
        // Number topics (Foundation)
        ...numberTopics,
        // Sets
        ...setsTopics,
        // Algebra topics
        ...algebraTopics,
        // Functions
        ...functionsTopics,
        // Matrices & Vectors
        ...matricesTopics,
        ...vectorsTopics,
        // Geometry & Transformations
        ...geometryTopics,
        ...transformationsTopics,
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
    ...numberTopics,
    // Sets
    ...setsTopics,
    // Algebra
    ...algebraTopics,
    // Functions
    ...functionsTopics,
    // Geometry
    ...geometryTopics,
    // Matrices/Vectors
    ...matricesTopics,
    ...vectorsTopics,
    // Transformations
    ...transformationsTopics,
    // Statistics
    ...statisticsTopics,
    // Mensuration
    ...mensurationTopics,
];
