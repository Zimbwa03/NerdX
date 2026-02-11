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
  'Ancient Civilisations Egypt': {
    topic: 'Ancient Civilisations Egypt',
    subject: 'History',
    summary: 'Ancient Egypt was a major African civilisation along the River Nile in north-east Africa. It developed advanced knowledge in science, writing, architecture, agriculture, and time-keeping. Egyptian civilisation spread to other parts of the world; key technologies include the Shaduf, canals, and dam walls.',
    sections: [
      {
        title: 'Introduction: What is an Ancient Civilisation?',
        content: 'An **ancient civilisation** is a well-organised society that developed long ago and showed advanced ways of living. It includes **permanent settlements**, **leadership systems**, **culture**, and **knowledge or technology**. Ancient Egypt is one of the most famous African civilisations, with advanced **science**, **writing**, **architecture**, **agriculture**, and **time-keeping (calendar)**. Egypt\'s success was strongly linked to the **River Nile**, which provided water, fertile land, and transport.',
      },
      {
        title: 'Location of Ancient Egypt (Map Work)',
        content: 'Ancient Egypt was in **North-East Africa**, along the **River Nile** (flowing north into the **Mediterranean Sea**). On a map, look for the **north-eastern corner** of Africa, the **Nile River Valley** and **Nile Delta**, the **Sahara Desert** to the west, and the Middle East to the east. Egyptians became highly skilled in **farming, irrigation, and water management** because they depended on the Nile.',
      },
      {
        title: 'Science in Ancient Egypt',
        content: 'Egyptians developed **medicine** (herbs, wound care, preservation of bodies), **mathematics and measurement** (re-measuring land after floods, planning buildings), and **engineering and technology** (structures and water systems such as the **Shaduf**, canals, and dam walls).',
      },
      {
        title: 'Writing in Ancient Egypt',
        content: 'Writing allowed records and knowledge to be passed on. It helped **government** (taxes, laws), **trade** (goods and payments), **religion** (texts and beliefs), and **education** (training scribes). Egyptian **hieroglyphics** were used by **scribes**, who could read and write when most people could not. Writing strengthened government and communication.',
      },
      {
        title: 'Architecture in Ancient Egypt',
        content: 'Egyptians built **pyramids**, **temples**, **palaces**, **tombs and monuments** for religion, leadership, and culture. Pyramids were linked to life after death and the importance of pharaohs. Large buildings required **labour planning**, **tools and materials**, **skilled workers**, and **mathematics and design**.',
      },
      {
        title: 'Agriculture in Ancient Egypt',
        content: '**Agriculture** was the backbone of Egyptian civilisation. The Nile provided water and fertile soil after floods. Egyptians grew grain, vegetables, and fruits and kept animals. They developed **irrigation systems** (e.g. **Shaduf**, canals) to control water. When food was plenty, people could specialise in other jobs, trade increased, and the state became wealthier.',
      },
      {
        title: 'The Egyptian Calendar',
        content: 'A **calendar** measures and organises time (days, months, years). Egyptians created one because farming depended on **seasons and Nile floods**. They needed to know when floods would come, when to plant, and when to harvest. The calendar helped **farming planning**, **festivals and religious events**, and **government** (e.g. tax collection).',
      },
      {
        title: 'Spread of Egyptian Civilisation',
        content: 'Through **trade**, **movement of people**, and **cultural contact**, Egyptian ideas spread. Other regions adopted **writing and record keeping**, **architecture**, **science and mathematics**, **agriculture and irrigation**, and **time-keeping (calendar)**.',
      },
      {
        title: 'Effects of Egyptian Civilisation on the World',
        content: 'Egypt\'s influence led to: (1) **Improved farming methods** through irrigation; (2) **Better administration and record keeping** via writing; (3) **Growth of building skills**; (4) **Scientific thinking** (observation, measurement, calculation); (5) **Development of organised societies** through better governance and trade.',
      },
      {
        title: 'Egyptian Technologies: Shaduf, Canals, Dam Wall',
        content: '**Shaduf:** A lever-based irrigation tool—a pole with a bucket on one end and a weight on the other—used to lift water from river or canal to higher fields. **Canals:** Man-made channels to direct water to farms; they improved irrigation and food production. **Dam wall:** A barrier to hold back, control, or store water; Egyptians used them to manage flow and limit destructive flooding.',
      },
      {
        title: 'End-of-Topic Summary',
        content: 'Ancient Egypt was a major African civilisation along the River Nile in north-east Africa. It developed **science**, **writing**, **architecture**, **agriculture**, and a **calendar**. The Nile made farming possible and encouraged **irrigation and water-control** (Shaduf, canals, dam walls). Egyptian civilisation spread and influenced other parts of the world through writing, building skills, irrigation, and time-keeping.',
      },
      {
        title: 'Glossary (Topic 2 Terms)',
        content: '**Ancient civilisation:** Well-organised society long ago with settlements, leadership, culture, and technology. **Agriculture:** Farming; growing crops and rearing animals. **Architecture:** Design and construction of buildings (pyramids, temples). **Calendar:** System for measuring time (days, months, years). **Canals:** Man-made water channels to farms. **Dam wall:** Barrier to hold back or control water. **Hieroglyphics:** Egyptian writing using symbols. **Irrigation:** Bringing water to fields by channels and tools. **Nile Delta:** Where the Nile splits before the Mediterranean. **Pharaoh:** King of ancient Egypt. **Scribe:** Educated person who could read and write. **Shaduf:** Lever tool (bucket + weight) to lift water to fields. **Spread of civilisation:** Other regions adopting a society\'s ideas through trade and contact.',
      },
      {
        title: 'End-of-Topic Test (MCQ + Structured + Essay)',
        content: '**Part A – MCQ:** (1) Where was ancient Egypt? (b) North-East Africa. (2) Which river? (b) Nile. (3) What is a Shaduf? (b) Irrigation tool using a lever. (4) Egyptian writing? (b) Hieroglyphics. (5) Not a form of Egyptian civilisation? (c) Industrial factories. (6) Canals were used to? (b) Direct water to farms. (7) Dam wall? (b) Hold back or control water. (8) Scribes? (b) Educated people who could read and write.\n\n**Part B – Structured:** (1) Define ancient civilisation; give two reasons the Nile was important. (2) Name three forms of Egyptian civilisation; explain how one helped society. (3) Describe how a Shaduf works; state two ways canals helped farming. (4) List three ways Egyptian civilisation spread; give two effects on other parts. (5) Purpose of dam wall; why was the calendar important for farming?\n\n**Part C – Essay:** (1) Discuss: "The River Nile was the foundation of ancient Egyptian civilisation" (agriculture, irrigation, one other form). (2) Describe spread of Egyptian civilisation and two effects. (3) Importance of writing and architecture in ancient Egypt.',
      },
    ],
    key_points: [
      'An ancient civilisation is a well-organised society with advanced settlements, leadership, culture, and technology.',
      'Ancient Egypt was in north-east Africa along the River Nile (water, fertile soil, transport).',
      'Forms of Egyptian civilisation: science, writing, architecture, agriculture, calendar.',
      'Shaduf (lever water-lifter), canals (man-made channels), and dam walls (water barriers) were key technologies.',
      'Egyptian civilisation spread through trade and contact; effects included better farming, administration, building, and organised societies.',
    ],
    exam_tips: [
      'Define "ancient civilisation" and explain why the River Nile was important to Egypt.',
      'Describe three forms of Egyptian civilisation (e.g. science, writing, architecture, agriculture, calendar).',
      'Explain what a Shaduf is and how it works; give two effects of Egyptian civilisation on other parts of the world.',
      'For map work: locate Egypt in north-east Africa, Nile Valley and Delta.',
    ],
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
