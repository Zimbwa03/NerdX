/**
 * Mathematics Notes Types
 */

export interface MathWorkedExample {
    question: string;
    steps: string[];
    final_answer: string;
}

export interface MathNotesSection {
    title: string;
    content: string; // Markdown with KaTeX support
    worked_examples?: MathWorkedExample[];
}

export interface MathTopicNotes {
    topic: string;
    subject: 'Mathematics';
    grade_level: string;
    summary: string;
    sections: MathNotesSection[];
    key_points: string[];
    exam_tips: string[];
    visual_descriptions: string[];
}
