// Computer Science Notes Type Definitions
// Types for O-Level Computer Science notes

export interface NotesSection {
    title: string;
    content: string; // Markdown formatted
    diagrams: string[];
    subsections?: NotesSection[];
}

export interface TopicNotes {
    topic: string;
    subject: 'Computer Science';
    summary: string;
    sections: NotesSection[];
    key_points: string[];
    exam_tips: string[];
}
