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
 * Returns whole-number credits only (per product decision).
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
    return 1; // 1 credit per question
  }

  // Combined Science (O-Level)
  if (subjectKey === 'combined_science') {
    // Whole-credit pricing: every question costs at least 1 credit
    return 1;
  }

  // English
  if (subjectKey === 'english') {
    return 1; // 1 credit per question
  }

  // A-Level Pure Math
  if (subjectKey === 'a_level_pure_math' || subjectKey === 'a_level_pure_mathematics') {
    return 1;
  }

  // A-Level Chemistry
  if (subjectKey === 'a_level_chemistry') {
    return 1;
  }

  // A-Level Physics
  if (subjectKey === 'a_level_physics') {
    return 1;
  }

  // A-Level Biology
  if (subjectKey === 'a_level_biology') {
    return 1;
  }

  // Computer Science (O-Level) – MCQ 0.3, Structured 0.5, Essay 1 (1 credit = 3 MCQs)
  if (subjectKey === 'computer_science') {
    const fmt = (questionFormat || bioQuestionType || 'mcq').toLowerCase();
    if (fmt === 'structured') return 0.5;
    if (fmt === 'essay') return 1;
    return 0.3; // MCQ
  }

  // Default fallback
  return 1;
}

/**
 * Format credit cost for display (e.g., "0.3 credits", "0.5 credit", "1 credit")
 */
export function formatCreditCost(credits: number): string {
  if (credits < 1 && credits > 0) {
    return `${credits} credit${credits === 1 ? '' : 's'}`;
  }
  const whole = Math.round(credits);
  return `${whole} credit${whole === 1 ? '' : 's'}`;
}

/**
 * Format credit balance for display - ensures whole numbers only (no decimals)
 * Backend returns credits in units (1 credit = 10 units), converted to whole credits
 */
export function formatCreditBalance(credits: number | undefined | null): number {
  if (credits === undefined || credits === null || isNaN(credits)) {
    return 0;
  }
  // Round to nearest whole number to ensure no decimals are displayed
  return Math.round(credits);
}

/**
 * Get minimum required credits for a quiz based on subject/question type
 */
export function getMinimumCreditsForQuiz(params: CreditCostParams): number {
  const cost = calculateQuizCreditCost(params);
  // Require at least the cost of one question
  return cost;
}
