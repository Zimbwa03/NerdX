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
  content: string;
  worked_examples?: MathWorkedExample[];
  videoUrl?: string; // URL for embedded video (e.g., YouTube)
  audioUrl?: string; // URL for audio file
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
