// Mobile math topics now mirror the web app source-of-truth (Form 1-4).
import { getMathTopicsByForm as getFormTopics } from '../oLevelMath/topics';
import type { MathFormLevel } from '../oLevelMath/topics';

export type { MathFormLevel, MathTopic } from '../oLevelMath/topics';
export { mathFormLevels, mathTopics, getMathTopicsByForm, getMathTopicById } from '../oLevelMath/topics';

// TopicsScreen fallback shape (aligned with quizApi Topic shape)
export const getMathTopicsForQuizByForm = (
  formLevel: MathFormLevel
): Array<{ id: string; name: string; subject: string }> =>
  getFormTopics(formLevel).map((t) => ({
    id: t.id,
    name: t.name,
    subject: 'mathematics',
  }));
