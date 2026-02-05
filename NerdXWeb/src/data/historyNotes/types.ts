export interface HistoryNotesSection {
  title: string;
  content: string;
}

export interface TopicNotes {
  topic: string;
  subject: string;
  summary: string;
  sections: HistoryNotesSection[];
  key_points: string[];
  exam_tips: string[];
}
