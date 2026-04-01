export interface TeacherChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  graph_url?: string;
  video_url?: string;
  image_urls?: string[];
}

export interface TeacherChatSelectedImage {
  id: string;
  file: File;
  previewUrl: string;
}

export interface TeacherChatLocationState {
  subject?: string;
  gradeLevel?: string;
  topic?: string;
  initialMessage?: string;
  prefillMessage?: string;
}
