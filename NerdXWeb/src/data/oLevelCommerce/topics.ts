// ZIMSEC O-Level Principles of Commerce – 11 topics
// Paper 1: 40 MCQs | Paper 2: Structured/Essay questions

export interface CommerceTopic {
  id: string;
  name: string;
  description: string;
  hasNotes?: boolean;
}

export const commerceTopics: CommerceTopic[] = [
  { id: 'production', name: 'Production', description: 'Goods and services; stages of production; factors of production.', hasNotes: true },
  { id: 'trade', name: 'Trade', description: 'Home trade; foreign trade; wholesale; retail; documents.', hasNotes: true },
  { id: 'consumer_protection', name: 'Consumer Protection', description: 'Consumer rights; CCZ; SAZ; protection from exploitation.', hasNotes: true },
  { id: 'business_organisations', name: 'Business Organisations', description: 'Sole trader; partnership; private/public limited companies.', hasNotes: true },
  { id: 'enterprise', name: 'Enterprise', description: 'Entrepreneurship; management functions; business ethics; business plan.', hasNotes: true },
  { id: 'finance_and_banking', name: 'Finance and Banking', description: 'Money; personal finance; RBZ; commercial banks; EcoCash.', hasNotes: true },
  { id: 'insurance_and_assurance', name: 'Insurance and Assurance', description: 'Insurance vs assurance; types of policies; principles.', hasNotes: true },
  { id: 'business_communication', name: 'Business Communication', description: 'Communication process; telecommunication; postal services.', hasNotes: true },
  { id: 'transport', name: 'Transport', description: 'Modes of transport; documents; port authorities.', hasNotes: true },
  { id: 'warehousing', name: 'Warehousing', description: 'Storage; types of warehouses; indigenous storage.', hasNotes: true },
  { id: 'marketing', name: 'Marketing', description: '4Ps; market segmentation; advertising; packaging and branding.', hasNotes: true },
];

export const getTopicById = (id: string): CommerceTopic | undefined =>
  commerceTopics.find((t) => t.id === id);

export const getTopicByName = (name: string): CommerceTopic | undefined =>
  commerceTopics.find((t) => t.name === name);

export const getTopicsWithNotes = (): CommerceTopic[] =>
  commerceTopics.filter((t) => t.hasNotes);

export const getAllTopicNames = (): string[] =>
  commerceTopics.map((t) => t.name);
