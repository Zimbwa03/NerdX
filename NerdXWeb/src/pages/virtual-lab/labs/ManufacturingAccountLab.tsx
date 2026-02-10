import { useCallback } from 'react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { virtualLabApi } from '../../../services/api/virtualLabApi';
import { AccountingQuestionLab, type AccountingLabQuestion } from './AccountingQuestionLab';

const FALLBACK_QUESTION: AccountingLabQuestion = {
  question_id: 'fallback-manufacturing',
  question_type: 'manufacturing_account',
  difficulty_level: 'intermediate',
  marks: 20,
  time_estimate: '25 minutes',
  scenario: {
    business_name: 'Tariro Furniture Works',
    financial_year_end: '31 December 2025',
    context:
      'Manufacturing business. Prepare a Manufacturing Account to calculate the cost of production, then prepare a Trading Account to find gross profit.',
    additional_info: '',
  },
  question_data: {
    trial_balance: [
      { account: 'Opening raw materials', debit: 12000, credit: null },
      { account: 'Purchases of raw materials', debit: 54000, credit: null },
      { account: 'Carriage inwards', debit: 2600, credit: null },
      { account: 'Closing raw materials', debit: 9000, credit: null },
      { account: 'Direct wages', debit: 28000, credit: null },
      { account: 'Factory rent', debit: 7200, credit: null },
      { account: 'Factory electricity', debit: 1800, credit: null },
      { account: 'Opening work in progress', debit: 6500, credit: null },
      { account: 'Closing work in progress', debit: 4200, credit: null },
    ],
    adjustments: [
      { id: 'adj_1', type: 'factory_overheads', description: 'Include factory rent and electricity as factory overheads.' },
      { id: 'adj_2', type: 'wip', description: 'Adjust cost of production for opening and closing work in progress.' },
    ],
  },
  requirements: [
    'Prepare a Manufacturing Account for the year ended 31 December 2025',
    'Calculate cost of production',
    'Prepare Trading Account and calculate gross profit (assume sales provided separately if needed)',
  ],
  step_by_step_guidance: [
    { step: 1, instruction: 'Calculate raw materials consumed', hint: 'Opening materials + purchases + carriage in - closing materials.' },
    { step: 2, instruction: 'Add direct labor', hint: 'Add direct wages to get prime cost.' },
    { step: 3, instruction: 'Add factory overheads', hint: 'Factory rent, electricity, depreciation, etc.' },
    { step: 4, instruction: 'Adjust for WIP', hint: 'Add opening WIP, deduct closing WIP to get cost of production.' },
  ],
  model_answer_summary: {
    materials_consumed: 59600,
    prime_cost: 87600,
    cost_of_production: 92400,
  },
  source: 'fallback',
};

export function ManufacturingAccountLab({ simulation }: { simulation: SimulationMetadata }) {
  const fetchQuestion = useCallback(async () => {
    return await virtualLabApi.getManufacturingAccountQuestion({ difficulty_level: 'intermediate', format: 'vertical' });
  }, []);

  return <AccountingQuestionLab simulation={simulation} fallbackQuestion={FALLBACK_QUESTION} fetchQuestion={fetchQuestion} />;
}

