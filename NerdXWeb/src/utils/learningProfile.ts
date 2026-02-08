import { GRADE_LEVELS } from '../data/teacherConstants';

export type LearningProfile = {
  gradeLevel: (typeof GRADE_LEVELS)[number];
  dailyMinutes: number;
};

export const PROFILE_STORAGE_KEY = 'nerdx_learning_profile_v1';

export function loadLearningProfile(): LearningProfile {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<LearningProfile>;
      const candidateLevel = typeof parsed.gradeLevel === 'string' ? parsed.gradeLevel : '';
      const gradeLevel = (GRADE_LEVELS as readonly string[]).includes(candidateLevel)
        ? (candidateLevel as LearningProfile['gradeLevel'])
        : 'Form 3-4 (O-Level)';
      const dailyMinutes = typeof parsed.dailyMinutes === 'number' ? parsed.dailyMinutes : 25;
      return {
        gradeLevel,
        dailyMinutes: Math.max(10, Math.min(180, dailyMinutes)),
      };
    }
  } catch {
    /* ignore */
  }

  return { gradeLevel: 'Form 3-4 (O-Level)', dailyMinutes: 25 };
}

export function saveLearningProfile(profile: LearningProfile) {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    /* ignore */
  }
}
