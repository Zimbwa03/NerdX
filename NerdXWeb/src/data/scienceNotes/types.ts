// Science Notes Type Definitions
// Shared types for all science notes

export interface NotesSection {
    title: string;
    content: string; // Markdown formatted
    diagrams: Array<string | number>;
    subsections?: NotesSection[];
}

export interface TopicNotes {
    topic: string;
    subject: string;
    summary: string;
    audioUrl?: string; // Optional streaming audio URL for topic podcast
    videoUrl?: string; // Optional streaming video URL for topic video lesson
    sections: NotesSection[];
    key_points: string[];
    exam_tips: string[];
    questions?: Array<{
        id: string;
        question: string;
        answer: string;
    }>;
}
