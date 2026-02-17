import type { MathTopicNotes } from '../mathNotes/types';
import { getOLevelMathNotes } from '../oLevelMath/notes';
import { getMathTopicsByForm, type MathFormLevel } from './topics';

const normalize = (value: string): string =>
  (value || '')
    .toLowerCase()
    .replace(/&amp;/g, '&')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

// Returns Form-scoped O-Level Mathematics notes using the same notesKey mapping as web topics.
export function getMathFormTopicNotes(topic: string, formLevel: MathFormLevel): MathTopicNotes | null {
  const wanted = normalize(topic);
  const scopedTopics = getMathTopicsByForm(formLevel);

  const matchedTopic = scopedTopics.find((item) => {
    const candidateNames = [item.name, item.id, item.notesKey].filter(Boolean) as string[];
    return candidateNames.some((name) => normalize(name) === wanted);
  });

  const candidateKeys = Array.from(
    new Set([topic, matchedTopic?.notesKey, matchedTopic?.name].filter(Boolean) as string[])
  );

  for (const key of candidateKeys) {
    const note = getOLevelMathNotes(key);
    if (note) {
      return note;
    }
  }

  return null;
}
