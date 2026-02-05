// ZIMSEC O-Level History – flat topic list (no Form 1/Form 2 division)
// Paper 1: Essays only (3-part ZIMSEC format)

export interface HistoryTopic {
  id: string;
  name: string;
  description: string;
  hasNotes?: boolean;
}

export const historyTopics: HistoryTopic[] = [
  { id: 'conceptualisation_of_history', name: 'Conceptualisation of History', description: 'Introduction, sources, types of history.', hasNotes: true },
  { id: 'origins_of_humankind', name: 'Origins of Humankind', description: 'Evolution theories, Darwin, Africa as cradle.', hasNotes: true },
  { id: 'ancient_civilisations_egypt', name: 'Ancient Civilisations Egypt', description: 'Civilization, science, agriculture, spread.', hasNotes: true },
  { id: 'development_of_zimbabwean_societies', name: 'Development of Zimbabwean Societies', description: 'Stone Age to Iron Age, state formation.', hasNotes: true },
  { id: 'slavery_and_the_slave_trade', name: 'Slavery and the Slave Trade', description: 'Forms, causes, Triangular Trade.', hasNotes: true },
  { id: 'early_european_contacts', name: 'Early European Contacts', description: 'Portuguese Prazo System, missionaries.', hasNotes: true },
  { id: 'colonisation', name: 'Colonisation', description: 'Scramble, Berlin Conference, colonisation process, wars.', hasNotes: true },
  { id: 'colonial_administration', name: 'Colonial Administration', description: 'Company Rule, Responsible Government, Federation, UDI.', hasNotes: true },
  { id: 'nationalism', name: 'Nationalism', description: 'Pan-Africanism, mass nationalism rise.', hasNotes: true },
  { id: 'armed_struggle', name: 'Armed Struggle', description: 'Mass nationalism phase, armed struggle phases.', hasNotes: true },
  { id: 'post_independence', name: 'Post-Independence', description: 'Social, political, economic policies 1980-1990.', hasNotes: true },
  { id: 'regional_cooperation', name: 'Regional Cooperation', description: 'Frontline States, SADC, OAU/AU, Commonwealth, NAM.', hasNotes: true },
  { id: 'sources_of_history', name: 'Sources of History', description: 'Advanced study of historical sources.', hasNotes: true },
  { id: 'zimbabwean_societies', name: 'Zimbabwean Societies', description: 'Great Zimbabwe, Mutapa, Rozvi, Nguni/Mfecane.', hasNotes: true },
  { id: 'european_contacts', name: 'European Contacts', description: 'Portuguese activities, missionaries, agents of colonisation.', hasNotes: true },
  { id: 'world_wars', name: 'World Wars', description: 'WWI, League of Nations, rise of dictators, WWII, Cold War.', hasNotes: true },
  { id: 'international_cooperation', name: 'International Cooperation', description: 'United Nations, Zimbabwe\'s foreign policy.', hasNotes: true },
  { id: 'socialism_and_communism', name: 'Socialism and Communism', description: 'Russian, Chinese, Cuban Revolutions.', hasNotes: true },
  { id: 'constitution_democracy_and_human_rights', name: 'Constitution Democracy and Human Rights', description: 'Democracy principles, human rights, land reform.', hasNotes: true },
];

export const getTopicById = (id: string): HistoryTopic | undefined =>
  historyTopics.find((t) => t.id === id);

export const getTopicByName = (name: string): HistoryTopic | undefined =>
  historyTopics.find((t) => t.name === name);

export const getTopicsWithNotes = (): HistoryTopic[] =>
  historyTopics.filter((t) => t.hasNotes);

export const getAllTopicNames = (): string[] =>
  historyTopics.map((t) => t.name);

// For TopicsScreen fallback when API returns empty (same shape as quizApi Topic)
export const historyTopicsForQuiz = historyTopics.map((t) => ({
  id: t.id,
  name: t.name,
  subject: 'history',
}));
