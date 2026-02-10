import { useCallback } from 'react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { virtualLabApi } from '../../../services/api/virtualLabApi';
import { AccountingQuestionLab, type AccountingLabQuestion } from './AccountingQuestionLab';

const FALLBACK_QUESTION: AccountingLabQuestion = {
  question_id: 'fallback-correction-errors',
  question_type: 'correction_of_errors',
  difficulty_level: 'intermediate',
  marks: 20,
  time_estimate: '25 minutes',
  scenario: {
    business_name: 'Rudo Stores',
    financial_year_end: '31 December 2025',
    context:
      'Books contain errors. Identify the type of each error and prepare journal entries to correct them. Update the Suspense Account where necessary.',
    additional_info: '',
  },
  question_data: {
    trial_balance: [
      { account: 'Suspense Account', debit: null, credit: 850 },
      { account: 'Sales', debit: null, credit: 120000 },
      { account: 'Purchases', debit: 68000, credit: null },
      { account: 'Trade receivables', debit: 14000, credit: null },
      { account: 'Trade payables', debit: null, credit: 9000 },
    ],
    adjustments: [],
    errors: [
      { id: 'err_1', type: 'error_of_omission', description: 'A credit sale of $1,200 was completely omitted from the books.' },
      { id: 'err_2', type: 'error_of_commission', description: 'Payment from debtor Tafadzwa $600 was posted to Tawanda’s account.' },
      { id: 'err_3', type: 'error_of_principle', description: 'Purchase of a motor vehicle $8,000 was debited to Purchases account.' },
      { id: 'err_4', type: 'error_affecting_suspense', description: 'Rent expense $850 was posted only to the debit side.' },
    ],
  },
  requirements: [
    'State the type of each error',
    'Prepare journal entries to correct the errors',
    'Show entries affecting the Suspense Account',
  ],
  step_by_step_guidance: [
    { step: 1, instruction: 'Classify each error', hint: 'Omission, commission, principle, original entry, reversal.' },
    { step: 2, instruction: 'Decide affected accounts', hint: 'Which account(s) are wrong/missing?' },
    { step: 3, instruction: 'Prepare journal entries', hint: 'Debit the account to increase, credit to decrease.' },
    { step: 4, instruction: 'Update suspense if needed', hint: 'Only one-sided errors affect suspense.' },
  ],
  model_answer_summary: {
    suspense_balance: 850,
    errors_count: 4,
  },
  source: 'fallback',
};

export function CorrectionOfErrorsLab({ simulation }: { simulation: SimulationMetadata }) {
  const fetchQuestion = useCallback(async () => {
    return await virtualLabApi.getCorrectionOfErrorsQuestion({ difficulty_level: 'intermediate', format: 'vertical' });
  }, []);

  return <AccountingQuestionLab simulation={simulation} fallbackQuestion={FALLBACK_QUESTION} fetchQuestion={fetchQuestion} />;
}

