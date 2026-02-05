// ZIMSEC O-Level Principles of Commerce – Notes
// 11 topics aligned with ZIMSEC syllabus
import { TopicNotes } from '../scienceNotes/types';

export const commerceNotes: Record<string, TopicNotes> = {
  'Production': {
    topic: 'Production',
    subject: 'Commerce',
    summary: 'The process of converting raw materials into finished goods and services that satisfy human wants.',
    sections: [
      {
        title: 'Types of Production',
        content: `**Primary Production** – Extracting raw materials (farming, mining, fishing, forestry). **Secondary Production** – Manufacturing/processing (factories, construction). **Tertiary Production** – Services (retail, banking, transport).`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Factors of Production',
        content: `**Land** (rent), **Labour** (wages), **Capital** (interest), **Entrepreneur** (profit). Value addition and beneficiation. Division of labour and specialisation.`,
        diagrams: [],
        subsections: [],
      },
    ],
    key_points: ['Primary: extraction; Secondary: manufacturing; Tertiary: services', 'Land, Labour, Capital, Entrepreneurship – four factors', 'Production adds value at each stage'],
    exam_tips: ['Classify industries by type of production', 'Link factors of production to Zimbabwe examples'],
  },
  'Trade': {
    topic: 'Trade',
    subject: 'Commerce',
    summary: 'The buying and selling of goods and services. Home trade and foreign trade.',
    sections: [
      {
        title: 'Home Trade',
        content: `**Wholesale** – bulk to retailers. **Retail** – small quantities to consumers. Documents: enquiry, quotation, order, invoice, delivery note, receipt, credit note.`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Foreign Trade',
        content: `Import/export. Visible and invisible trade. Documents: bill of lading, certificate of origin. Trading blocs: SADC, COMESA.`,
        diagrams: [],
        subsections: [],
      },
    ],
    key_points: ['Home trade: within country; Foreign trade: between countries', 'Wholesale: bulk; Retail: small quantities', 'Balance of trade and balance of payments'],
    exam_tips: ['Distinguish wholesale and retail', 'Explain international trade documents'],
  },
  'Consumer Protection': {
    topic: 'Consumer Protection',
    subject: 'Commerce',
    summary: 'Protecting consumers from exploitation. CCZ and SAZ in Zimbabwe.',
    sections: [
      {
        title: 'Consumer Rights and Responsibilities',
        content: `Rights: safety, information, choice, be heard, redress, education. Exploitation: overcharging, false advertising, substandard goods. **CCZ** – complaints, education. **SAZ** – quality standards.`,
        diagrams: [],
        subsections: [],
      },
    ],
    key_points: ['Rights: safety, information, choice, redress', 'CCZ handles complaints; SAZ certifies products', 'Report exploitation to CCZ'],
    exam_tips: ['List consumer rights and responsibilities', 'Explain CCZ and SAZ roles'],
  },
  'Business Organisations': {
    topic: 'Business Organisations',
    subject: 'Commerce',
    summary: 'Forms of business ownership and their characteristics.',
    sections: [
      {
        title: 'Types of Business Ownership',
        content: `**Sole Trader** – one owner, unlimited liability. **Partnership** – 2–20, unlimited liability, Deed of Partnership. **Private Limited** – limited liability, shares not public. **Public Limited** – shares on ZSE. Cooperatives, SMEs, multinationals.`,
        diagrams: [],
        subsections: [],
      },
    ],
    key_points: ['Sole trader: unlimited liability', 'Partnership: 2–20, shared liability', 'Companies: limited liability, separate legal entity'],
    exam_tips: ['Compare sole trader and partnership', 'Explain advantages of incorporation'],
  },
  'Enterprise': {
    topic: 'Enterprise',
    subject: 'Commerce',
    summary: 'Entrepreneurship, management functions, and business planning.',
    sections: [
      {
        title: 'Entrepreneurship and Management',
        content: `**Entrepreneur** – risk-taker, innovator. **Management functions**: Planning, Organising, Leading, Controlling. Business ethics. Business plan components. Intellectual property: patent, trademark, copyright.`,
        diagrams: [],
        subsections: [],
      },
    ],
    key_points: ['Entrepreneur organises factors, takes risks', 'Planning, Organising, Leading, Controlling', 'Business plan: executive summary, market analysis, financial projections'],
    exam_tips: ['Identify entrepreneurial qualities', 'Explain the four management functions'],
  },
  'Finance and Banking': {
    topic: 'Finance and Banking',
    subject: 'Commerce',
    summary: 'Money, personal finance, and the banking system.',
    sections: [
      {
        title: 'Money and Banking',
        content: `**Money functions**: medium of exchange, measure of value, store of value. **RBZ** – issues currency, banker to government, monetary policy. **Commercial banks** (CBZ, Stanbic, FBC) – deposits, loans, RTGS, ATMs. Mobile money: EcoCash, OneMoney.`,
        diagrams: [],
        subsections: [],
      },
    ],
    key_points: ['RBZ: central bank; commercial banks serve public', 'Money: exchange, store, measure', 'EcoCash and OneMoney for mobile payments'],
    exam_tips: ['Explain RBZ functions', 'Describe commercial bank services'],
  },
  'Insurance and Assurance': {
    topic: 'Insurance and Assurance',
    subject: 'Commerce',
    summary: 'Insurance protects against uncertain events; assurance covers certain events.',
    sections: [
      {
        title: 'Insurance and Assurance',
        content: `**Insurance** – fire, motor, marine, burglary. **Assurance** – whole life, term, endowment. Principles: utmost good faith, insurable interest, indemnity. Communal: Zunde raMambo, burial societies, mukando.`,
        diagrams: [],
        subsections: [],
      },
    ],
    key_points: ['Insurance: uncertain events; Assurance: certain (death)', 'Utmost good faith, insurable interest, indemnity', 'Types: fire, motor, marine, life assurance'],
    exam_tips: ['Distinguish insurance and assurance', 'Explain key principles'],
  },
  'Business Communication': {
    topic: 'Business Communication',
    subject: 'Commerce',
    summary: 'Communication process and channels.',
    sections: [
      {
        title: 'Communication',
        content: `Process: sender → message → medium → receiver → feedback. **Telecommunication**: TelOne, Econet, NetOne, Telecel. **Postal**: ZimPost, registered mail, EMS. Trends: email, video conferencing, WhatsApp Business.`,
        diagrams: [],
        subsections: [],
      },
    ],
    key_points: ['Communication process and barriers', 'TelOne, Econet, NetOne, ZimPost', 'Formal vs informal; grapevine'],
    exam_tips: ['Explain communication process', 'Factors in choosing communication mode'],
  },
  'Transport': {
    topic: 'Transport',
    subject: 'Commerce',
    summary: 'Modes of transport and their roles in commerce.',
    sections: [
      {
        title: 'Modes of Transport',
        content: `**Road** – flexible, door-to-door. **Rail** – bulk cargo (NRZ). **Air** – fast, perishables. **Water** – heavy goods. **Pipeline** – oil, gas. Documents: waybill, bill of lading. Port authorities; Beira Corridor.`,
        diagrams: [],
        subsections: [],
      },
    ],
    key_points: ['Road, rail, air, water, pipeline', 'Choice depends on cost, speed, type of goods', 'NRZ for rail; Air Zimbabwe for air'],
    exam_tips: ['Compare modes of transport', 'Identify transport documents'],
  },
  'Warehousing': {
    topic: 'Warehousing',
    subject: 'Commerce',
    summary: 'Storage of goods. Functions and types.',
    sections: [
      {
        title: 'Warehousing',
        content: `**Functions**: storage, breaking bulk, blending, warehouse receipts. **Types**: private, public, bonded, cold storage. Indigenous: dura/isiphala, underground pits. Location factors.`,
        diagrams: [],
        subsections: [],
      },
    ],
    key_points: ['Storage, breaking bulk, blending', 'Private, public, bonded, cold storage', 'Location: market, transport, security'],
    exam_tips: ['Classify warehouse types', 'Explain warehousing functions'],
  },
  'Marketing': {
    topic: 'Marketing',
    subject: 'Commerce',
    summary: 'Satisfying customer needs. Marketing mix 4Ps.',
    sections: [
      {
        title: 'Marketing',
        content: `**4Ps**: Product, Price, Place, Promotion. Market segmentation. Physical markets (Mbare Musika); virtual (e-commerce). Advertising: purposes, media, ethics. Packaging and branding.`,
        diagrams: [],
        subsections: [],
      },
    ],
    key_points: ['4Ps: Product, Price, Place, Promotion', 'Market segmentation', 'Advertising: inform, persuade, remind'],
    exam_tips: ['Apply 4Ps to scenarios', 'Explain advertising purposes and ethics'],
  },
};

export function getTopicNotes(topicName: string): TopicNotes | null {
  return commerceNotes[topicName] ?? null;
}

export function getAllTopicNames(): string[] {
  return Object.keys(commerceNotes);
}
