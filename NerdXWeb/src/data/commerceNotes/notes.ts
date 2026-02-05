// O-Level Commerce Notes – ZIMSEC syllabus aligned
import type { TopicNotes } from './types';

// 11 topics from ZIMSEC O-Level Principles of Commerce syllabus
export const commerceTopicNames: string[] = [
  'Production',
  'Trade',
  'Consumer Protection',
  'Business Organisations',
  'Enterprise',
  'Finance and Banking',
  'Insurance and Assurance',
  'Business Communication',
  'Transport',
  'Warehousing',
  'Marketing',
];

/** Slug (id) to display name for URL param lookup */
export function topicSlugToName(slug: string): string | null {
  const normalized = slug.replace(/-/g, '_').toLowerCase();
  const found = commerceTopicNames.find(
    (name) => name.toLowerCase().replace(/ /g, '_').replace(/-/g, '_') === normalized
  );
  return found ?? null;
}

export const commerceNotes: Record<string, TopicNotes> = {
  'Business Organisations': {
    topic: 'Business Organisations',
    subject: 'Commerce',
    summary: 'Understanding the different forms of business ownership and their advantages and disadvantages.',
    sections: [
      {
        title: 'Types of Business Ownership',
        content: `**Sole Trader (Sole Proprietorship)**
A business owned and run by one person. The owner has unlimited liability – personal assets can be used to pay business debts.

**Partnership**
A business owned by two or more people (usually 2–20). Partners share profits, losses, and management. Liability is usually unlimited unless it is a limited liability partnership.

**Private Limited Company (Pvt Ltd)**
A company where shares are not sold to the public. Shareholders have limited liability. Must have at least one director and one shareholder.

**Public Limited Company (PLC)**
Shares can be sold to the public on the stock exchange. Must have minimum share capital and publish annual reports.`,
      },
      {
        title: 'Choosing a Business Structure',
        content: `Factors to consider when choosing business ownership:
- **Capital needed**: Sole traders and partnerships need less capital; companies can raise more through shares
- **Liability**: Limited liability protects personal assets (companies)
- **Control**: Sole traders have full control; partnerships and companies share decision-making
- **Legal requirements**: Companies have more legal formalities and reporting requirements`,
      },
    ],
    key_points: [
      'Sole trader: one owner, unlimited liability',
      'Partnership: 2+ owners, shared profits and liability',
      'Private limited: limited liability, shares not sold to public',
      'Public limited: shares sold on stock exchange',
    ],
    exam_tips: [
      'Know the advantages and disadvantages of each type',
      'Understand when unlimited vs limited liability applies',
      'Be able to recommend a suitable structure for a given scenario',
    ],
  },
  'Consumer Protection': {
    topic: 'Consumer Protection',
    subject: 'Commerce',
    summary: 'Protecting consumers from exploitation. CCZ and SAZ play key roles in Zimbabwe.',
    sections: [
      {
        title: 'Consumer Rights',
        content: `Rights include: safety, information, choice, be heard, redress, consumer education. Consumers can be exploited through overcharging, false advertising, substandard goods, short weights, adulteration.`,
      },
      {
        title: 'Consumer Protection Organisations',
        content: `**Consumer Council of Zimbabwe (CCZ)** – handles complaints, consumer education, price monitoring. **Standards Association of Zimbabwe (SAZ)** – sets quality standards, product certification.`,
      },
    ],
    key_points: ['Rights: safety, information, choice, redress', 'CCZ handles complaints; SAZ certifies products', 'Report exploitation to CCZ'],
    exam_tips: ['List consumer rights and responsibilities', 'Explain CCZ and SAZ roles'],
  },
  'Enterprise': {
    topic: 'Enterprise',
    subject: 'Commerce',
    summary: 'Entrepreneurs identify opportunities, take risks, and organise resources to create new businesses.',
    sections: [
      {
        title: 'Role of the Entrepreneur',
        content: `Entrepreneurs bring together land, labour, and capital. They innovate, take risks, and bear uncertainty. They create jobs and drive economic growth.`,
      },
      {
        title: 'Management Functions',
        content: `**Planning** – setting objectives; **Organising** – allocating resources; **Leading** – motivating staff; **Controlling** – monitoring and correcting. Business ethics, business plans, and intellectual property (patent, trademark, copyright) are also covered.`,
      },
    ],
    key_points: ['Organises factors of production', 'Takes risks and bears uncertainty', 'Planning, organising, leading, controlling'],
    exam_tips: ['Identify entrepreneurial qualities', 'Explain the four management functions'],
  },
  'Finance and Banking': {
    topic: 'Finance and Banking',
    subject: 'Commerce',
    summary: 'Personal finance, money, banking services, and the role of the Reserve Bank of Zimbabwe.',
    sections: [
      {
        title: 'Money and Personal Finance',
        content: `Money functions: medium of exchange, measure of value, store of value, standard of deferred payment. Personal budgeting, saving, borrowing (overdraft, loan, trade credit). PAYE is Pay As You Earn tax.`,
      },
      {
        title: 'Banking',
        content: `**Reserve Bank of Zimbabwe (RBZ)** – issues currency, banker to government, monetary policy. **Commercial banks** (CBZ, Stanbic, FBC) – deposits, loans, RTGS, ATMs, mobile banking. **Building societies** – mortgages. **Microfinance** – small loans. Trends: EcoCash, OneMoney, internet banking.`,
      },
    ],
    key_points: ['RBZ: central bank; commercial banks serve public', 'Money: exchange, store, measure', 'EcoCash and OneMoney for mobile payments'],
    exam_tips: ['Explain RBZ functions', 'Describe commercial bank services'],
  },
  'Insurance and Assurance': {
    topic: 'Insurance and Assurance',
    subject: 'Commerce',
    summary: 'Insurance protects against uncertain events (fire, theft); assurance covers certain events (death).',
    sections: [
      {
        title: 'Principles and Types',
        content: `Principles: utmost good faith, insurable interest, indemnity, proximate cause. **Insurance**: fire, motor, marine, burglary. **Assurance**: whole life, term, endowment. Communal systems: Zunde raMambo, burial societies, mukando.`,
      },
    ],
    key_points: ['Insurance: uncertain events; Assurance: certain (e.g. death)', 'Utmost good faith, insurable interest, indemnity', 'Types: fire, motor, marine, life assurance'],
    exam_tips: ['Distinguish insurance and assurance', 'Explain key principles'],
  },
  'Business Communication': {
    topic: 'Business Communication',
    subject: 'Commerce',
    summary: 'Communication process: sender, message, medium, receiver, feedback. Telecommunication and postal services.',
    sections: [
      {
        title: 'Communication',
        content: `Process: sender → message → medium → receiver → feedback. Barriers: language, noise, distance. **Telecommunication**: TelOne (landline), Econet, NetOne, Telecel (mobile). **Postal**: ZimPost, registered mail, EMS. Trends: email, video conferencing, WhatsApp Business.`,
      },
    ],
    key_points: ['Communication process and barriers', 'TelOne, Econet, NetOne, ZimPost', 'Formal vs informal; grapevine'],
    exam_tips: ['Explain communication process', 'Factors in choosing communication mode'],
  },
  'Warehousing': {
    topic: 'Warehousing',
    subject: 'Commerce',
    summary: 'Storage of goods. Functions: storage, breaking bulk, blending. Types: private, public, bonded, cold storage.',
    sections: [
      {
        title: 'Warehousing',
        content: `**Functions**: storage, breaking bulk, blending, warehouse receipts for finance. **Types**: private (owned by business), public (for any business), bonded (imported goods before duty), cold storage (perishables). Indigenous: dura/isiphala, underground pits.`,
      },
    ],
    key_points: ['Storage, breaking bulk, blending', 'Private, public, bonded, cold storage', 'Location factors: market, transport, security'],
    exam_tips: ['Classify warehouse types', 'Explain warehousing functions'],
  },
  'Marketing': {
    topic: 'Marketing',
    subject: 'Commerce',
    summary: 'Satisfying customer needs profitably. Marketing mix 4Ps: Product, Price, Place, Promotion.',
    sections: [
      {
        title: 'Marketing',
        content: `**Concepts**: production, product, selling, marketing, societal. **Markets**: physical (Mbare Musika), virtual (e-commerce). **Segmentation**: demographic, geographic, psychographic. **4Ps**: Product (features, branding), Price, Place (distribution), Promotion (advertising, sales promotion). Advertising: purposes, media, ethics.`,
      },
    ],
    key_points: ['4Ps: Product, Price, Place, Promotion', 'Market segmentation', 'Advertising: inform, persuade, remind'],
    exam_tips: ['Apply 4Ps to scenarios', 'Explain advertising purposes and ethics'],
  },
  'Production': {
    topic: 'Production',
    subject: 'Commerce',
    summary: 'The process of converting raw materials into finished goods and services that satisfy human wants.',
    sections: [
      {
        title: 'Types of Production',
        content: `**Primary Production**
Extracting raw materials from the earth – farming, mining, fishing, forestry.

**Secondary Production**
Converting raw materials into finished or semi-finished goods – manufacturing, construction.

**Tertiary Production**
Providing services – retail, banking, transport, education, healthcare.

**Quaternary Production**
Knowledge-based services – IT, research, consultancy.`,
      },
      {
        title: 'Factors of Production',
        content: `**Land** – natural resources (minerals, water, soil)
**Labour** – human effort (physical and mental)
**Capital** – man-made aids to production (machinery, tools, buildings)
**Entrepreneurship** – organising and risk-taking

These are also called the four factors of production.`,
      },
    ],
    key_points: [
      'Primary: extraction; Secondary: manufacturing; Tertiary: services',
      'Land, Labour, Capital, Entrepreneurship are the four factors',
      'Production adds value at each stage',
    ],
    exam_tips: [
      'Classify industries by type of production',
      'Link factors of production to real business examples',
      'Understand the chain from raw material to consumer',
    ],
  },
  'Trade': {
    topic: 'Trade',
    subject: 'Commerce',
    summary: 'The buying and selling of goods and services. Includes home trade (within a country) and foreign trade (between countries).',
    sections: [
      {
        title: 'Home Trade',
        content: `Trade within the borders of one country. Includes:
- **Wholesale trade**: Selling in large quantities to retailers or other businesses
- **Retail trade**: Selling in small quantities to final consumers

Channels: Producer → Wholesaler → Retailer → Consumer`,
      },
      {
        title: 'Foreign Trade (International Trade)',
        content: `**Import** – buying goods/services from other countries
**Export** – selling goods/services to other countries

**Visible trade** – physical goods (cars, machinery, food)
**Invisible trade** – services (banking, tourism, insurance)

**Balance of trade** = Exports – Imports (for visible goods)
**Balance of payments** = total inflows – outflows (goods + services + capital)`,
      },
    ],
    key_points: [
      'Home trade: within country; Foreign trade: between countries',
      'Wholesale: bulk; Retail: small quantities to consumers',
      'Imports and exports affect balance of trade',
    ],
    exam_tips: [
      'Distinguish between wholesale and retail',
      'Explain advantages of international trade',
      'Understand balance of trade vs balance of payments',
    ],
  },
  'Transport': {
    topic: 'Transport',
    subject: 'Commerce',
    summary: 'Transport moves goods and people from one place to another. Modes include road, rail, air, and water.',
    sections: [
      {
        title: 'Modes of Transport',
        content: `**Road** – flexible, door-to-door; **Rail** – bulk cargo, long distances; **Air** – fast, perishables; **Water** – heavy goods, low cost. Choice depends on speed, cost, nature of goods.`,
      },
    ],
    key_points: ['Road, rail, air, water are main modes', 'Choice depends on cost, speed, and type of goods'],
    exam_tips: ['Recommend transport for given scenarios', 'Discuss advantages and disadvantages'],
  },
};

/** Get notes by topic slug (URL param) */
export function getTopicNotesBySlug(slug: string): TopicNotes | null {
  const name = topicSlugToName(slug);
  if (!name) return null;
  return commerceNotes[name] ?? null;
}
