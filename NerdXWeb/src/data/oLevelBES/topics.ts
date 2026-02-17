export interface BESTopic {
  id: string;
  name: string;
  description: string;
  hasNotes?: boolean;
}

export const oLevelBESTopics: BESTopic[] = [
  { id: 'the_business_enterprise', name: 'The Business Enterprise', description: 'Nature of business enterprise; types; objectives.', hasNotes: true },
  { id: 'the_enterprising_environment', name: 'The Enterprising Environment', description: 'External and internal environment; stakeholders.', hasNotes: true },
  { id: 'setting_up_a_new_enterprise', name: 'Setting Up a New Enterprise', description: 'Ideas; feasibility; legal and regulatory requirements.', hasNotes: true },
  { id: 'business_planning', name: 'Business Planning', description: 'Business plans; objectives; strategies.', hasNotes: true },
  { id: 'enterprise_finance_and_securing_investors', name: 'Enterprise Finance and Securing Investors', description: 'Sources of finance; securing investment.', hasNotes: true },
  { id: 'people_in_business_enterprises', name: 'People in Business Enterprises', description: 'Recruitment; motivation; leadership; teamwork.', hasNotes: true },
  { id: 'markets_and_marketing', name: 'Markets and Marketing', description: 'Markets; marketing mix; market research.', hasNotes: true },
  { id: 'operations_management', name: 'Operations Management', description: 'Production; quality; supply chain.', hasNotes: true },
];

export const getBESTopicById = (id: string): BESTopic | undefined =>
  oLevelBESTopics.find((topic) => topic.id === id);

