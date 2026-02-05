/**
 * Math Notes API - uses local bundled data (no server calls)
 */
import { getOLevelMathNotes, getAvailableOLevelMathTopics } from '../../data/oLevelMath/notes';
import type { MathTopicNotes } from '../../data/mathNotes/types';

const TOPIC_ALIASES: Record<string, string> = {
  'Indices & Standard Form': 'Indices and Standard Form',
  'Transformation Geometry': 'Transformations',
  'Loci & Construction': 'Loci and Construction',
  // Backend API topic names -> notes keys
  'Real Numbers': 'Number Theory',
  'Financial Mathematics': 'Consumer Arithmetic',
  'Measures and Mensuration': 'Mensuration',
  'Graphs': 'Graphs and Coordinate Geometry',
  'Transformation': 'Transformations',
};

export const mathNotesApi = {
  getTopics: async (): Promise<string[]> => {
    return getAvailableOLevelMathTopics();
  },

  getTopicNotes: async (topic: string, _gradeLevel: string = 'O-Level'): Promise<MathTopicNotes | null> => {
    const normalized = topic.replace(/-/g, ' ');
    const key = TOPIC_ALIASES[normalized] ?? normalized;
    return getOLevelMathNotes(key);
  },
};
