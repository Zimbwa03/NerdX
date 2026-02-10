import { useCallback } from 'react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { virtualLabApi } from '../../../services/api/virtualLabApi';
import { AccountingQuestionLab, type AccountingLabQuestion } from './AccountingQuestionLab';

const FALLBACK_QUESTION: AccountingLabQuestion = {
  question_id: 'fallback-cash-flow',
  question_type: 'cash_flow',
  difficulty_level: 'intermediate',
  marks: 20,
  time_estimate: '25 minutes',
  scenario: {
    business_name: 'Nyasha Engineering',
    financial_year_end: '31 December 2025',
    context:
      'Prepare a Cash Flow Statement (operating, investing, financing activities) for the year ended 31 December 2025 using the information provided.',
    additional_info: 'Use the indirect method for cash from operations.',
  },
  question_data: {
    trial_balance: [
      { account: 'Net profit for the year', debit: null, credit: 48000 },
      { account: 'Depreciation', debit: 12000, credit: null },
      { account: 'Trade receivables (opening)', debit: 16000, credit: null },
      { account: 'Trade receivables (closing)', debit: 21000, credit: null },
      { account: 'Trade payables (opening)', debit: null, credit: 14000 },
      { account: 'Trade payables (closing)', debit: null, credit: 10000 },
    ],
    adjustments: [
      { id: 'adj_1', type: 'non_cash', description: 'Depreciation for the year: $12,000 (add back).' },
      { id: 'adj_2', type: 'working_capital', description: 'Trade receivables increased by $5,000; trade payables decreased by $4,000.' },
      { id: 'adj_3', type: 'investing', description: 'Purchased equipment for $25,000 (cash).' },
      { id: 'adj_4', type: 'financing', description: 'Issued new shares for $20,000; paid dividends $8,000.' },
    ],
  },
  requirements: [
    'Prepare a Cash Flow Statement for the year ended 31 December 2025',
    'Show cash flows from operating, investing, and financing activities',
    'Calculate net increase/decrease in cash',
  ],
  step_by_step_guidance: [
    { step: 1, instruction: 'Cash from operations (indirect)', hint: 'Start with net profit then adjust for non-cash items and working capital changes.' },
    { step: 2, instruction: 'Investing activities', hint: 'Include purchase/sale of non-current assets.' },
    { step: 3, instruction: 'Financing activities', hint: 'Include loans, shares, dividends.' },
    { step: 4, instruction: 'Net change in cash', hint: 'Sum operating + investing + financing.' },
  ],
  model_answer_summary: {
    cash_from_operations: 51000,
    net_cash_investing: -25000,
    net_cash_financing: 12000,
    net_change_in_cash: 38000,
  },
  source: 'fallback',
};

export function CashFlowStatementLab({ simulation }: { simulation: SimulationMetadata }) {
  const fetchQuestion = useCallback(async () => {
    return await virtualLabApi.getCashFlowQuestion({ difficulty_level: 'intermediate', format: 'vertical' });
  }, []);

  return <AccountingQuestionLab simulation={simulation} fallbackQuestion={FALLBACK_QUESTION} fetchQuestion={fetchQuestion} />;
}

