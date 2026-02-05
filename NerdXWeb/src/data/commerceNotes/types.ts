// Commerce Notes - O-Level (ZIMSEC)
// Types for web – content only

export interface NotesSection {
  title: string;
  content: string;
  subsections?: NotesSection[];
}

export interface TopicNotes {
  topic: string;
  subject: 'Commerce';
  summary: string;
  sections: NotesSection[];
  key_points: string[];
  exam_tips: string[];
}
