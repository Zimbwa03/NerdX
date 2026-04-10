import { mathTopics } from '../data/oLevelMath/topics';
import { aLevelPureMathTopics } from '../data/aLevelPureMath/topics';

const normalize = (value: string) =>
  (value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const aliases: Record<string, string> = {
  factorization: 'quadratic equations',
  factorisation: 'quadratic equations',
  discriminant: 'quadratic equations',
  tangent: 'differentiation',
  derivative: 'differentiation',
  integration: 'integration',
  matrices: 'matrices',
  vectors: 'vectors',
  sine: 'trigonometry',
  cosine: 'trigonometry',
  probability: 'probability',
  statistics: 'statistics',
};

export function resolveConceptPath(concept: string): string | null {
  const wanted = normalize(aliases[normalize(concept)] || concept);
  if (!wanted) return null;

  const oLevelMatch = mathTopics.find((topic) =>
    [topic.name, topic.notesKey || '', topic.description].some((candidate) =>
      normalize(candidate).includes(wanted) || wanted.includes(normalize(candidate))
    )
  );
  if (oLevelMatch) {
    return `/app/mathematics/topic/${encodeURIComponent(oLevelMatch.id)}`;
  }

  const aLevelMatch = aLevelPureMathTopics.find((topic) =>
    [topic.name, topic.id, topic.description].some((candidate) =>
      normalize(candidate).includes(wanted) || wanted.includes(normalize(candidate))
    )
  );
  if (aLevelMatch) {
    return `/app/pure-math/topic/${encodeURIComponent(aLevelMatch.id)}`;
  }

  return null;
}
