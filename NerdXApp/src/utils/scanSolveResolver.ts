import { Alert } from 'react-native';
import { mathTopics } from '../data/oLevelMath/topics';
import { aLevelPureMathTopics } from '../data/aLevelPureMath/topics';

const NORMALIZE = (value: string) =>
  (value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const CONCEPT_ALIASES: Record<string, string> = {
  factorization: 'quadratic equations',
  factorisation: 'quadratic equations',
  discriminant: 'quadratic equations',
  parabola: 'advanced graphs',
  tangent: 'differentiation',
  derivative: 'differentiation',
  integration: 'integration',
  sine: 'trigonometry',
  cosine: 'trigonometry',
  'tangent ratio': 'trigonometry',
  matrices: 'matrices',
  vectors: 'vectors',
  probability: 'probability',
  'normal distribution': 'statistics',
  statistics: 'statistics',
};

export interface ResolvedConceptTarget {
  label: string;
  topic: string;
  isALevel?: boolean;
}

export function resolveConceptToNote(concept: string): ResolvedConceptTarget | null {
  const wanted = NORMALIZE(CONCEPT_ALIASES[NORMALIZE(concept)] || concept);
  if (!wanted) return null;

  const oLevelMatch = mathTopics.find((topic) =>
    [topic.name, topic.notesKey || '', topic.description].some((candidate) =>
      NORMALIZE(candidate).includes(wanted) || wanted.includes(NORMALIZE(candidate))
    )
  );
  if (oLevelMatch?.hasNotes) {
    return {
      label: oLevelMatch.name,
      topic: oLevelMatch.notesKey || oLevelMatch.name,
    };
  }

  const aLevelMatch = aLevelPureMathTopics.find((topic) =>
    [topic.name, topic.id, topic.description].some((candidate) =>
      NORMALIZE(candidate).includes(wanted) || wanted.includes(NORMALIZE(candidate))
    )
  );
  if (aLevelMatch) {
    return {
      label: aLevelMatch.name,
      topic: aLevelMatch.name,
      isALevel: true,
    };
  }

  return null;
}

export function showMissingConceptAlert(concept: string) {
  Alert.alert('Notes unavailable', `NerdX could not find a confident notes match for "${concept}" yet.`);
}
