// Science Notes API service - local bundled data for NerdX Web
import { getTopics, getTopicNotes, type TopicNotes, type NotesSection } from '../../data/scienceNotes';

export type { TopicNotes, NotesSection };

export const scienceNotesApi = {
  getTopics: async (subject: 'Biology' | 'Chemistry' | 'Physics'): Promise<string[]> => {
    return getTopics(subject);
  },

  getTopicNotes: async (
    subject: 'Biology' | 'Chemistry' | 'Physics',
    topic: string
  ): Promise<TopicNotes | null> => {
    return getTopicNotes(subject, topic);
  },
};
