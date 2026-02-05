// ZIMSEC O-Level History Notes – flat topic list
import type { TopicNotes } from './types';

export const historyTopicNames: string[] = [
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

function slugToName(slug: string): string | null {
  const normalized = slug.replace(/-/g, '_').toLowerCase();
  const found = historyTopicNames.find(
    (name) => name.toLowerCase().replace(/ /g, '_').replace(/-/g, '_') === normalized
  );
  return found ?? null;
}

const historyNotesRecord: Record<string, TopicNotes> = {
  'Conceptualisation of History': {
    topic: 'Conceptualisation of History',
    subject: 'History',
    summary: 'History is the study of the past. It uses sources (primary and secondary) to understand what happened and why.',
    sections: [
      { title: 'What is History?', content: '**History** is the study of past events, particularly human affairs. It helps us understand how societies developed and how the past shapes the present.' },
      { title: 'Sources of History', content: '**Primary sources** are original evidence from the time (e.g. letters, diaries, artefacts). **Secondary sources** are created later (e.g. textbooks, articles).' },
      { title: 'Types of History', content: 'Political, social, economic, and cultural history. ZIMSEC History covers Zimbabwean, African, and world history.' },
    ],
    key_points: ['History is the study of the past using evidence.', 'Primary sources are from the time; secondary sources are later analyses.'],
    exam_tips: ['Part [a]: list 5 items. Part [b]: 2 paragraphs, no conclusion. Part [c]: argue both sides, conclusion 8–10 lines.'],
  },
  'Zimbabwean Societies': {
    topic: 'Zimbabwean Societies',
    subject: 'History',
    summary: 'Great Zimbabwe, Mutapa, Rozvi, and the Nguni/Mfecane are key in Zimbabwean history.',
    sections: [
      { title: 'Great Zimbabwe', content: '**Great Zimbabwe** (c. 11th–15th century) was a stone-built city. Features: Hill Complex, Great Enclosure, Valley Ruins, dry-stone walls, Zimbabwe birds. The Mambo (king) led a hierarchical society; trade (gold, ivory) linked to the coast.' },
    ],
    key_points: ['Great Zimbabwe had a hierarchical society with the Mambo at the top.', 'Trade linked the interior to the Indian Ocean.'],
    exam_tips: ['Part [a]: list five features. Part [b]: describe two aspects in two paragraphs.'],
  },
};

// Fill missing topics with a generic note
historyTopicNames.forEach((name) => {
  if (!historyNotesRecord[name]) {
    historyNotesRecord[name] = {
      topic: name,
      subject: 'History',
      summary: `Study notes for ${name}. Content aligned with ZIMSEC O-Level History syllabus.`,
      sections: [{ title: 'Overview', content: `This topic is part of the ZIMSEC O-Level History syllabus. Use your textbook and class notes for full coverage.` }],
      key_points: ['Check your notes and textbook for key points.'],
      exam_tips: ['Part [a]: list 5 items. Part [b]: 2 paragraphs. Part [c]: balanced argument and conclusion.'],
    };
  }
});

export function getTopicNotesBySlug(slug: string): TopicNotes | null {
  const name = slugToName(slug);
  return name ? historyNotesRecord[name] ?? null : null;
}

export const historyNotes = historyNotesRecord;
