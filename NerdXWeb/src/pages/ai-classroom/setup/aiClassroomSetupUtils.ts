export function parseFormLevel(s: string): { form: number; level: 'O-Level' | 'A-Level' } {
  const level: 'O-Level' | 'A-Level' =
    /\bA[\s-]*Level\b/i.test(s) || s.includes('A-Level') ? 'A-Level' : 'O-Level';
  const m = s.match(/Form\s*(\d+)/i);
  const form = m ? Math.min(6, Math.max(1, parseInt(m[1], 10))) : 3;
  return { form, level };
}

export function buildFormLevel(form: number, level: 'O-Level' | 'A-Level'): string {
  return `Form ${form} (${level})`;
}

export function formatSessionRelative(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return 'today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  return d.toLocaleDateString(undefined, { dateStyle: 'medium' });
}
