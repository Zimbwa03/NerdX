/**
 * Credit Calculator Utility
 * Calculates credit costs for different features based on the new credit system
 * 1 credit = 10 units in backend storage, but displayed as credits to users
 */

export interface CreditCostParams {
  subject: string;
  questionType?: 'topical' | 'exam';
  questionFormat?: 'mcq' | 'structured' | 'essay';
  bioQuestionType?: 'mcq' | 'structured' | 'essay';
  isImageQuestion?: boolean;
}

/**
 * Calculate credit cost for quiz question generation
 * Returns credit amount (not units) - e.g., 0.5, 0.25, 1, 4
 */
export function calculateQuizCreditCost(params: CreditCostParams): number {
  const { subject, questionType = 'topical', questionFormat, bioQuestionType, isImageQuestion = false } = params;
  
  const subjectKey = (subject || '').toLowerCase();

  // Image questions cost 4 credits (40 units)
  if (isImageQuestion) {
    return 4;
  }

  // Mathematics
  if (subjectKey === 'mathematics' || subjectKey === 'math') {
    return 0.5; // 0.5 credit per question
  }

  // Combined Science (O-Level)
  if (subjectKey === 'combined_science') {
    if (questionType === 'exam') {
      return 0.5; // 0.5 credit per exam question
    }
    // Topical questions
    if (questionFormat === 'structured') {
      return 0.5; // 0.5 credit per structured question
    }
    return 0.25; // 0.25 credit per MCQ
  }

  // English
  if (subjectKey === 'english') {
    return 1; // 1 credit per question
  }

  // A-Level Pure Math
  if (subjectKey === 'a_level_pure_math' || subjectKey === 'a_level_pure_mathematics') {
    return 0.5; // 0.5 credit per question
  }

  // A-Level Chemistry
  if (subjectKey === 'a_level_chemistry') {
    return 0.5; // 0.5 credit per question
  }

  // A-Level Physics
  if (subjectKey === 'a_level_physics') {
    return 0.5; // 0.5 credit per question
  }

  // A-Level Biology
  if (subjectKey === 'a_level_biology') {
    const bioType = bioQuestionType || questionFormat || 'mcq';
    if (bioType === 'mcq') {
      return 0.25; // 0.25 credit per MCQ
    }
    return 0.5; // 0.5 credit per structured/essay
  }

  // Default fallback
  return 0.5; // Default to 0.5 credit
}

/**
 * Format credit cost for display (e.g., "0.5 credit" or "1 credit")
 */
export function formatCreditCost(credits: number): string {
  if (credits === 1) {
    return '1 credit';
  }
  if (credits === 0.5) {
    return '0.5 credit';
  }
  if (credits === 0.25) {
    return '0.25 credit';
  }
  return `${credits} credit${credits !== 1 ? 's' : ''}`;
}

/**
 * Get minimum required credits for a quiz based on subject/question type
 */
export function getMinimumCreditsForQuiz(params: CreditCostParams): number {
  const cost = calculateQuizCreditCost(params);
  // Require at least the cost of one question
  return cost;
}
