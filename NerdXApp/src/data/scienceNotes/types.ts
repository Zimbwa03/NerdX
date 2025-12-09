// Science Notes Type Definitions
// Shared types for all science notes

export interface NotesSection {
    title: string;
    content: string; // Markdown formatted
    diagrams: string[];
    subsections?: NotesSection[];
}

export interface TopicNotes {
    topic: string;
    subject: string;
    summary: string;
    audioUrl?: string; // Optional streaming audio URL for topic podcast
    sections: NotesSection[];
    key_points: string[];
    exam_tips: string[];
}
