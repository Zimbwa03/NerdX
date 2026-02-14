// ZIMSEC O-Level History topics with Form-level grouping.
// Paper 1: Essays only (3-part ZIMSEC format).

export type HistoryFormLevel = 'Form 1' | 'Form 2' | 'Form 3' | 'Form 4';

export interface HistoryTopic {
  id: string;
  name: string;
  description: string;
  formLevel?: HistoryFormLevel;
  hasNotes?: boolean;
}

export const historyFormLevels: HistoryFormLevel[] = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];

export const historyTopics: HistoryTopic[] = [
  { id: 'introduction_to_history', name: 'Introduction to History', description: 'Meaning and importance of studying History.', formLevel: 'Form 1', hasNotes: true },
  { id: 'sources_of_history_form1', name: 'Sources of History', description: 'Archaeology, oral tradition, written records, and rock art.', formLevel: 'Form 1', hasNotes: true },
  { id: 'types_of_history', name: 'Types of History', description: 'Social, political, and economic history.', formLevel: 'Form 1', hasNotes: true },
  { id: 'ancient_civilisation_in_egypt', name: 'Ancient Civilisation in Egypt', description: 'Meaning, location, and key features of Egyptian civilisation.', formLevel: 'Form 1', hasNotes: true },
  { id: 'spread_of_egyptian_civilisation', name: 'Spread of Egyptian Civilisation', description: 'Spread, influence, effects, and models such as shaduf/canals/dam walls.', formLevel: 'Form 1', hasNotes: true },
  { id: 'late_stone_age_and_transition_to_early_iron_age', name: 'Late Stone Age Societies and transition to Early Iron Age', description: 'Late Stone Age life and causes/effects of transition to the Early Iron Age.', formLevel: 'Form 1', hasNotes: true },
  { id: 'states_formation_in_zimbabwe', name: 'States Formation in Zimbabwe', description: 'State formation and development in Zimbabwean societies.', formLevel: 'Form 1', hasNotes: true },
  { id: 'causes_of_slave_trade', name: 'Causes of Slave trade', description: 'Economic, social, and political causes of slave trade.', formLevel: 'Form 1', hasNotes: true },
  { id: 'triangular_slave_trade', name: 'Triangular Slave trade', description: 'Routes, regions involved, and commodities exchanged in triangular slave trade.', formLevel: 'Form 1', hasNotes: true },
  { id: 'impact_of_slave_trade', name: 'Impact of slave trade', description: 'Social, economic, and political impacts of slave trade.', formLevel: 'Form 1', hasNotes: true },
  { id: 'abolition_of_slave_trade', name: 'Abolition of slave trade', description: 'Causes, actors, and process of abolition of slave trade.', formLevel: 'Form 1', hasNotes: true },

  { id: 'portuguese_prazo_system_zambezi_valley', name: 'The Portuguese Prazo System in the Zambezi Valley', description: 'Meaning, origin, organisation, effects, and decline of the prazo system.', formLevel: 'Form 2', hasNotes: true },
  { id: 'early_missionary_activities_1850_1900', name: 'Early Missionary Activities (1850-1900)', description: 'Missionary groups, activities, challenges, and effects between 1850 and 1900.', formLevel: 'Form 2', hasNotes: true },
  { id: 'background_to_colonisation_of_zimbabwe', name: 'Background to the Colonisation of Zimbabwe', description: 'Meaning of colonisation and causes/background factors of colonial penetration.', formLevel: 'Form 2', hasNotes: true },
  { id: 'process_of_colonisation_of_zimbabwe', name: 'Process of Colonisation of Zimbabwe', description: 'Key steps, methods, actors, and outcomes in the colonisation process.', formLevel: 'Form 2', hasNotes: true },
  { id: 'anglo_ndebele_war_1893_1894', name: 'The Anglo-Ndebele War (1893-1894)', description: 'Causes, course, and effects of the Anglo-Ndebele War.', formLevel: 'Form 2', hasNotes: true },
  { id: 'first_chimurenga_umvukela_1896_1897', name: 'The First Chimurenga/Umvukela (1896-1897)', description: 'Causes, course, leadership, and effects of the First Chimurenga/Umvukela.', formLevel: 'Form 2', hasNotes: true },
  { id: 'colonial_policies_1923_1979', name: 'Colonial policies (1923-1979)', description: 'Major colonial laws and governance policies from 1923 to 1979.', formLevel: 'Form 2', hasNotes: true },
  { id: 'federation_rhodesia_nyasaland_1953_1963', name: 'Federation of Rhodesia and Nyasaland (1953-1963)', description: 'Formation, operation, effects, and collapse of the Federation.', formLevel: 'Form 2', hasNotes: true },
  { id: 'udi_unilateral_declaration_of_independence', name: 'Unilateral Declaration of Independence (U.D.I.)', description: 'Background, declaration, and effects of UDI.', formLevel: 'Form 2', hasNotes: true },
  { id: 'rise_of_nationalism', name: 'Rise of Nationalism', description: 'Causes, leaders, organisations, and impact of African nationalism.', formLevel: 'Form 2', hasNotes: true },

  { id: 'causes_of_second_chimurenga_umvukela', name: 'Causes of the Second Chimurenga/Umvukela in Zimbabwe (1966-1979)', description: 'Listing, explaining, and evaluating the political, economic, and social causes of the Second Chimurenga/Umvukela.', formLevel: 'Form 3', hasNotes: true },
  { id: 'early_phase_armed_struggle', name: 'Early Phase of the Armed Struggle', description: 'Identifying and describing the battles of the early phase (Chinhoyi/Sinoia 1966, Wankie 1967, Sipolilo 1968) and explaining why this phase was considered a failure.', formLevel: 'Form 3', hasNotes: true },
  { id: 'second_phase_armed_struggle_mobilisation', name: 'Second Phase of the Armed Struggle (Mobilisation)', description: 'The role of masses (chiefs, spirit mediums, chimbwidos, mujibhas, workers), external support (Frontline States, international countries), and internal mobilisation efforts.', formLevel: 'Form 3', hasNotes: true },
  { id: 'decisive_phase_1972_1979', name: 'Decisive Phase 1972-1979', description: 'Key decisive events (Altena farm attack, independence of Mozambique, bombing of fuel tanks in Salisbury), their details, and challenges faced during this phase.', formLevel: 'Form 3', hasNotes: true },
  { id: 'peace_settlements_armed_struggle', name: 'Peace Settlements in the Armed Struggle', description: 'Major peace conferences (Geneva 1976, Lusaka 1978, Lancaster 1979), their terms, and evaluating their successes and failures.', formLevel: 'Form 3', hasNotes: true },
  { id: 'social_political_economic_policies_since_1990', name: 'Social, Political and Economic Policies since 1990', description: 'Key economic, political, and social developments since 1990 including the land issue, gender equity, equality, human rights, foreign policy (Look East Policy, peace missions, engagement/re-engagement), and challenges such as climate change and sanctions.', formLevel: 'Form 3', hasNotes: true },
  { id: 'provisions_of_constitution', name: 'Provisions of the Constitution', description: 'Definition and importance of a constitution; major provisions of the Zimbabwe constitution regarding Citizenship and the Bill of Rights.', formLevel: 'Form 3', hasNotes: true },
  { id: 'child_rights_and_responsibilities', name: 'Child Rights and Responsibilities', description: 'Rights of children as enshrined in the Constitution of Zimbabwe and the limitations associated with children\'s rights.', formLevel: 'Form 3', hasNotes: true },
  { id: 'principles_of_good_governance', name: 'Principles of Good Governance', description: 'Characteristics of good governance including regular elections, separation of powers, respect for constitutionally enshrined human rights, and the rule of law.', formLevel: 'Form 3', hasNotes: true },
  { id: 'zimbabwe_regional_international_organisations', name: 'Zimbabwe as a Member of Regional and International Organisations', description: 'Member states, aims, and objectives of SADC, AU, and UN, and the role of these organisations in socio-economic development regionally and globally.', formLevel: 'Form 3', hasNotes: true },
  { id: 'resistance_colonial_rule_mozambique_namibia', name: 'Resistance to Colonial Rule in Mozambique and Namibia', description: 'Background history, causes of armed struggle, forms of resistance, role of liberation movements (FRELIMO, SWAPO), challenges faced, and contemporary lessons.', formLevel: 'Form 4', hasNotes: true },
  { id: 'causes_course_results_first_world_war', name: 'Causes, Course and Results of the First World War', description: 'Causes (Militarism, Alliances, Imperialism, Nationalism), major events and timeline of WWI, political/social/economic outcomes, and design of WWI weapons.', formLevel: 'Form 4', hasNotes: true },
  { id: 'paris_peace_conference_post_war_treaties', name: 'Paris Peace Conference and Post-War Peace Treaties', description: 'Views of the Big Three (Britain, France, USA), terms of the five treaties (Versailles, St Germain, Trianon, Sevres/Lausanne, Neuilly), and analysis of fairness and impact.', formLevel: 'Form 4', hasNotes: true },
  { id: 'league_of_nations', name: 'The League of Nations', description: 'Aims, organs and functions (Assembly, Council, Secretariat), evaluation of work up to 1939, and reasons for collapse.', formLevel: 'Form 4', hasNotes: true },
  { id: 'rise_of_european_dictators', name: 'Rise of European Dictators', description: 'Concepts of Fascism and Nazism, post-WWI problems, rise of Mussolini and Hitler, and their domestic and foreign policies.', formLevel: 'Form 4', hasNotes: true },
  { id: 'causes_of_second_world_war', name: 'Causes of the Second World War', description: 'Key triggering factors, detailed outline of causes (dictator aggression, League failure, appeasement), and evaluation of their significance in starting the war.', formLevel: 'Form 4', hasNotes: true },
];

export const getTopicById = (id: string): HistoryTopic | undefined =>
  historyTopics.find((t) => t.id === id);

export const getTopicByName = (name: string): HistoryTopic | undefined =>
  historyTopics.find((t) => t.name === name);

export const getTopicsWithNotes = (): HistoryTopic[] =>
  historyTopics.filter((t) => t.hasNotes);

export const getAllTopicNames = (): string[] =>
  historyTopics.map((t) => t.name);

export const getHistoryTopicsByForm = (formLevel: HistoryFormLevel): HistoryTopic[] =>
  historyTopics.filter((t) => t.formLevel === formLevel);

// For TopicsScreen fallback when API returns empty (same shape as quizApi Topic)
export const historyTopicsForQuiz = historyTopics.map((t) => ({
  id: t.id,
  name: t.name,
  subject: 'history',
}));

export const getHistoryTopicsForQuizByForm = (
  formLevel: HistoryFormLevel
): Array<{ id: string; name: string; subject: string }> =>
  getHistoryTopicsByForm(formLevel).map((t) => ({
    id: t.id,
    name: t.name,
    subject: 'history',
  }));
