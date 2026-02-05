// Science Notes - Main Entry Point
// Re-exports types and provides helper functions

// Export types
export type { TopicNotes, NotesSection } from './types';

// Import all subject notes
import { biologyNotes, biologyTopics } from './biology';
import { chemistryNotes, chemistryTopics } from './chemistry';
import { physicsNotes, physicsTopics } from './physics';
import type { TopicNotes } from './types';

// Combined export for easy access
export const scienceNotes = {
    Biology: biologyNotes,
    Chemistry: chemistryNotes,
    Physics: physicsNotes,
};

export const scienceTopics = {
    Biology: biologyTopics,
    Chemistry: chemistryTopics,
    Physics: physicsTopics,
};

// Helper function to get topics for a subject
export function getTopics(subject: 'Biology' | 'Chemistry' | 'Physics'): string[] {
    return scienceTopics[subject] || [];
}

// Helper function to get notes for a topic
export function getTopicNotes(subject: 'Biology' | 'Chemistry' | 'Physics', topic: string): TopicNotes | null {
    const subjectNotes = scienceNotes[subject];
    if (!subjectNotes) return null;

    return subjectNotes[topic] || null;
}
