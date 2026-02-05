/**
 * Format credit balance for display - ensures whole numbers only (no decimals)
 * Backend returns credits in units (1 credit = 10 units), converted to whole credits
 */
export function formatCreditBalance(credits: number | undefined | null): number {
  if (credits === undefined || credits === null || isNaN(credits)) {
    return 0;
  }
  return Math.round(credits);
}

export interface CreditCostParams {
  subject: string;
  questionType?: 'topical' | 'exam';
  questionFormat?: 'mcq' | 'structured' | 'essay';
  bioQuestionType?: 'mcq' | 'structured' | 'essay';
  isImageQuestion?: boolean;
}

export function calculateQuizCreditCost(params: CreditCostParams): number {
  const { subject, questionFormat, bioQuestionType, isImageQuestion = false } = params;
  const subjectKey = (subject || '').toLowerCase();

  if (isImageQuestion) return 4;
  if (subjectKey === 'mathematics' || subjectKey === 'math') return 1;
  if (subjectKey === 'combined_science') return 1;
  if (subjectKey === 'english') return 1;
  if (subjectKey === 'a_level_pure_math' || subjectKey === 'a_level_pure_mathematics') return 1;
  if (subjectKey === 'a_level_chemistry') return 1;
  if (subjectKey === 'a_level_physics') return 1;
  if (subjectKey === 'a_level_biology') return 1;

  const fmt = (questionFormat || bioQuestionType || 'mcq').toLowerCase();
  if (subjectKey === 'computer_science' || subjectKey === 'a_level_computer_science' || subjectKey === 'a_level_geography' || subjectKey === 'geography' || subjectKey === 'commerce' || subjectKey === 'business_enterprise_skills') {
    if (fmt === 'structured') return 0.5;
    if (fmt === 'essay') return 1;
    return 0.3;
  }

  return 1;
}

export function formatCreditCost(credits: number): string {
  if (credits < 1 && credits > 0) {
    return `${credits} credit${credits === 1 ? '' : 's'}`;
  }
  const whole = Math.round(credits);
  return `${whole} credit${whole === 1 ? '' : 's'}`;
}

export function getMinimumCreditsForQuiz(params: CreditCostParams): number {
  return calculateQuizCreditCost(params);
}
