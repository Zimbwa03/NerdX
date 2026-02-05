// Computer Science Notes - O-Level (ZIMSEC/Cambridge)
// Types for web – content only (no image refs)

export interface NotesSection {
  title: string;
  content: string;
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
