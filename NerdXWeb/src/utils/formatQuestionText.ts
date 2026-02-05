/**
 * Format question text for exam-style display.
 * Inserts line breaks before parts (a), (b), (c)... and sub-parts (i), (ii), (iii)...
 */
export function formatQuestionParts(text: string | null | undefined): string {
  if (!text || typeof text !== 'string') return '';
  let s = text.trim();
  if (!s) return '';

  const mainParts = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'] as const;
  const subParts = ['ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'i'] as const;

  for (const p of mainParts) {
    const re = new RegExp(`\\s+\\(${p}\\)\\s+`, 'gi');
    s = s.replace(re, `\n\n(${p}) `);
  }
  for (const p of subParts) {
    const re = new RegExp(`\\s+\\(${p}\\)\\s+`, 'gi');
    s = s.replace(re, `\n(${p}) `);
  }

  s = s.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  return s;
}
