import type { LucideIcon } from 'lucide-react';
import { BookMarked, BookOpen, Calculator, Dna, FlaskConical, Globe2, Zap } from 'lucide-react';

export type LevelKind = 'O-Level' | 'A-Level';

export type SubjectOption = {
  id: string;
  apiName: string;
  color: string;
  Icon: LucideIcon;
};

export const CORE_SUBJECTS: SubjectOption[] = [
  { id: 'math', apiName: 'Mathematics', color: '#3B82F6', Icon: Calculator },
  { id: 'bio', apiName: 'Biology', color: '#10B981', Icon: Dna },
  { id: 'chem', apiName: 'Chemistry', color: '#8B5CF6', Icon: FlaskConical },
  { id: 'phys', apiName: 'Physics', color: '#F59E0B', Icon: Zap },
  { id: 'eng', apiName: 'English', color: '#EC4899', Icon: BookMarked },
  { id: 'geo', apiName: 'Geography', color: '#06B6D4', Icon: Globe2 },
];

export const EXTRA_SUBJECTS: SubjectOption[] = [
  { id: 'acc', apiName: 'Accounting', color: '#6366F1', Icon: BookOpen },
  { id: 'hist', apiName: 'History', color: '#F97316', Icon: BookOpen },
];

export function displayLabel(opt: SubjectOption, level: LevelKind): string {
  const p = level === 'O-Level' ? 'O Level' : 'A Level';
  return opt.id === 'math' ? `${p} Maths` : `${p} ${opt.apiName}`;
}

export function lineForSubject(opt: SubjectOption, level: LevelKind): string {
  const p = level === 'O-Level' ? 'O Level' : 'A Level';
  return `${p} ${opt.apiName}`;
}

export function subjectOptionFromLine(line: string): SubjectOption | null {
  const t = line.trim().toLowerCase();
  const all = [...CORE_SUBJECTS, ...EXTRA_SUBJECTS];
  for (const o of all) {
    if (o.id === 'math' && (t.includes('mathematics') || t.includes('maths'))) return o;
    if (t.includes(o.apiName.toLowerCase())) return o;
  }
  return null;
}

/** Alias for session rows / previews */
export function subjectMetaForValue(subject: string): SubjectOption | null {
  return subjectOptionFromLine(subject);
}
