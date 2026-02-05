// BES Notes - O-Level 4048 (ZIMSEC)
export interface NotesSection {
  title: string;
  content: string;
  subsections?: NotesSection[];
}

export interface TopicNotes {
  topic: string;
  subject: string;
  summary: string;
  sections: NotesSection[];
  key_points: string[];
  exam_tips: string[];
}
