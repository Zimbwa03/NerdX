// ZIMSEC O-Level History – Notes (flat list, no Form grouping)
// Content aligned with ZIMSEC-History-Syllabus-Complete.md
import { TopicNotes } from '../scienceNotes/types';

export const historyNotes: Record<string, TopicNotes> = {
  'Conceptualisation of History': {
    topic: 'Conceptualisation of History',
    subject: 'History',
    summary: 'History is the study of the past. It uses sources (primary and secondary) to understand what happened, why it happened, and what it means for us today. Historians use evidence to build a picture of past events and societies.',
    sections: [
      {
        title: 'What is History?',
        content: `**History** is the study of past events, particularly human affairs. It helps us understand how societies developed, how decisions were made, and how the past shapes the present.

**Why study history?**
- Understand the present by knowing how we got here
- Learn from past mistakes and successes
- Develop critical thinking and analysis
- Appreciate different cultures and perspectives
- Build a sense of identity and heritage (e.g. Zimbabwean, African)`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Sources of History',
        content: `**Primary sources** are original evidence from the time period (e.g. letters, diaries, photographs, artefacts, official documents). They were created by people who lived through the events.

**Secondary sources** are created later by historians or others who analyse primary sources (e.g. textbooks, documentaries, articles).

**Types of sources:**
- Written: documents, letters, newspapers, books
- Oral: interviews, traditions, songs, stories
- Visual: photographs, paintings, maps
- Physical: artefacts, buildings, monuments`,
        diagrams: [],
        subsections: [],
      },
      {
        title: 'Types of History',
        content: `**Political history** – governments, leaders, wars, laws
**Social history** – everyday life, families, communities, customs
**Economic history** – trade, industry, agriculture, money
**Cultural history** – art, religion, language, beliefs

ZIMSEC History covers Zimbabwean, African, and world history across these themes.`,
        diagrams: [],
        subsections: [],
      },
    ],
    key_points: [
      'History is the study of the past using evidence.',
      'Primary sources are from the time; secondary sources are later analyses.',
      'Written, oral, visual, and physical sources all provide evidence.',
    ],
    exam_tips: [
      'For "list" questions, give 5 clear points; 1 mark each.',
      'For "describe" questions, write 2 paragraphs; no conclusion.',
      'For "how far do you agree" questions, argue both sides and give a conclusion (8–10 lines).',
    ],
  },
  'Origins of Humankind': {
    topic: 'Origins of Humankind',
    subject: 'History',
    summary: 'Scientists and historians study how humans evolved. Evidence from Africa, including fossils and tools, supports the theory that humankind originated in Africa.',
    sections: [
      {
        title: 'Theories on Origins',
        content: `**Evolution** – Charles Darwin and others proposed that species change over time. Humans are thought to have evolved from earlier hominids (human-like species).

**Africa as cradle** – Fossil evidence (e.g. from Olduvai Gorge, Sterkfontein) suggests that early humans (Australopithecus, Homo habilis, Homo erectus, Homo sapiens) first appeared in Africa and later spread to other continents.`,
        diagrams: [],
        subsections: [],
      },
    ],
    key_points: [
      'Evolution suggests species change over time.',
      'Africa has important fossil sites for early humans.',
      'Hominids include Australopithecus, Homo habilis, Homo erectus, Homo sapiens.',
    ],
    exam_tips: [
      'Name specific sites (e.g. Olduvai Gorge) and species for marks.',
    ],
  },
  'Zimbabwean Societies': {
    topic: 'Zimbabwean Societies',
    subject: 'History',
    summary: 'Great Zimbabwe, the Mutapa State, the Rozvi State, and the impact of the Nguni/Mfecane are key topics in Zimbabwean history. They show state formation, trade, and social organisation.',
    sections: [
      {
        title: 'Great Zimbabwe',
        content: `**Great Zimbabwe** (c. 11th–15th century) was a stone-built city and centre of a state. Features include the Hill Complex (Acropolis), Great Enclosure, Valley Ruins, dry-stone walls, and the Zimbabwe birds.

**Social organisation:** The Mambo (king) was at the top; below were nobles, craftsmen, traders, and commoners. Trade (gold, ivory) with the coast was important. Religion (Mwari cult, ancestor veneration) helped unite society.`,
        diagrams: [],
        subsections: [],
      },
    ],
    key_points: [
      'Great Zimbabwe had a hierarchical society with the Mambo at the top.',
      'Trade (gold, ivory) linked the interior to the Indian Ocean.',
      'Stone architecture and Zimbabwe birds are key features.',
    ],
    exam_tips: [
      'For Part [a] list five features (e.g. Great Enclosure, Hill Complex, Valley Ruins, stone walls, Zimbabwe birds).',
      'For Part [b] describe two aspects (e.g. social hierarchy and trade) in two paragraphs; no conclusion.',
    ],
  },
};

// Add notes for other topics with minimal content so every topic has a key
const HISTORY_TOPIC_NAMES = [
  'Conceptualisation of History',
  'Origins of Humankind',
  'Ancient Civilisations Egypt',
  'Development of Zimbabwean Societies',
  'Slavery and the Slave Trade',
  'Early European Contacts',
  'Colonisation',
  'Colonial Administration',
  'Nationalism',
  'Armed Struggle',
  'Post-Independence',
  'Regional Cooperation',
  'Sources of History',
  'Zimbabwean Societies',
  'European Contacts',
  'World Wars',
  'International Cooperation',
  'Socialism and Communism',
  'Constitution Democracy and Human Rights',
];

HISTORY_TOPIC_NAMES.forEach((name) => {
  if (!historyNotes[name]) {
    historyNotes[name] = {
      topic: name,
      subject: 'History',
      summary: `Study notes for ${name}. Content aligned with ZIMSEC O-Level History syllabus.`,
      sections: [
        {
          title: 'Overview',
          content: `This topic is part of the ZIMSEC O-Level History syllabus. Use your textbook and class notes for full coverage. Key themes: causes, events, consequences, and significance.`,
          diagrams: [],
          subsections: [],
        },
      ],
      key_points: ['Check your notes and textbook for key points.'],
      exam_tips: ['Part [a]: list 5 items. Part [b]: describe in 2 paragraphs. Part [c]: argue both sides and conclude.'],
    };
  }
});

export const getTopicNotes = (topicName: string): TopicNotes | undefined =>
  historyNotes[topicName];

export const getAllHistoryNoteTopicNames = (): string[] =>
  Object.keys(historyNotes);
