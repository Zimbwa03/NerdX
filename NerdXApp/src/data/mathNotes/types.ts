/**
 * Mathematics Notes Types
 * O-Level notes follow this structure for consistent, book-standard display.
 * Use LaTeX inside $...$ for math (e.g. $\\frac{1}{2}$, $x^2$); section content
 * and key_points/exam_tips are rendered with MathRenderer so math displays correctly.
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
    videoUrl?: string;
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
