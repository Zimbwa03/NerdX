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

  { id: 'causes_of_second_chimurenga', name: 'Causes of the Second Chimurenga / Armed Struggle in Zimbabwe', description: 'Causes of the armed struggle in Zimbabwe (1966-1979).', formLevel: 'Form 3', hasNotes: true },
  { id: 'early_phase_armed_struggle', name: 'Early Phase of the Armed Struggle', description: 'Early phase developments in the armed struggle.', formLevel: 'Form 3', hasNotes: true },
  { id: 'second_phase_armed_struggle_mobilisation', name: 'Second Phase of the Armed Struggle (Mobilisation Phase)', description: 'Mobilisation phase of the armed struggle.', formLevel: 'Form 3', hasNotes: true },
  { id: 'decisive_phase_armed_struggle_1972_1979', name: 'Decisive Phase of the Armed Struggle (1972-1979)', description: 'Decisive phase of the armed struggle, 1972-1979.', formLevel: 'Form 3', hasNotes: true },
  { id: 'peace_settlements_armed_struggle', name: 'Peace Settlements during the Armed Struggle', description: 'Negotiations and settlements during the armed struggle.', formLevel: 'Form 3', hasNotes: true },
  { id: 'social_policies_since_1990', name: 'Social Policies in Zimbabwe since 1990', description: 'Social policy developments in Zimbabwe since 1990.', formLevel: 'Form 3', hasNotes: true },
  { id: 'political_policies_since_1990', name: 'Political Policies in Zimbabwe since 1990', description: 'Political policy developments in Zimbabwe since 1990.', formLevel: 'Form 3', hasNotes: true },
  { id: 'economic_policies_since_1990', name: 'Economic Policies in Zimbabwe since 1990', description: 'Economic policy developments in Zimbabwe since 1990.', formLevel: 'Form 3', hasNotes: true },
  { id: 'zimbabwe_and_sadc', name: 'Zimbabwe and the Southern African Development Community (SADC)', description: 'Zimbabwe and SADC membership, roles, and cooperation.', formLevel: 'Form 3', hasNotes: true },
  { id: 'zimbabwe_and_au', name: 'Zimbabwe and the African Union (AU)', description: 'Zimbabwe and AU membership, roles, and cooperation.', formLevel: 'Form 3', hasNotes: true },
  { id: 'zimbabwe_and_un', name: 'Zimbabwe and the United Nations (UN)', description: 'Zimbabwe and UN membership, roles, and cooperation.', formLevel: 'Form 3', hasNotes: true },
  { id: 'provisions_of_constitution_of_zimbabwe', name: 'Provisions of the Constitution of Zimbabwe', description: 'Key constitutional provisions in Zimbabwe.', formLevel: 'Form 3', hasNotes: true },
  { id: 'child_rights_and_responsibilities', name: 'Child Rights and Responsibilities', description: 'Child rights and responsibilities under constitutional and civic frameworks.', formLevel: 'Form 3', hasNotes: true },
  { id: 'principles_of_good_governance', name: 'Principles of Good Governance', description: 'Core principles and practice of good governance.', formLevel: 'Form 3', hasNotes: true },
  { id: 'causes_of_struggle_for_independence_southern_africa', name: 'Causes of the Struggle for Independence in Southern Africa', description: 'Causes of Southern African liberation struggles.', formLevel: 'Form 4', hasNotes: true },
  { id: 'struggle_for_independence_mozambique', name: 'The Struggle for Independence in Mozambique', description: 'Liberation struggle in Mozambique.', formLevel: 'Form 4', hasNotes: true },
  { id: 'struggle_for_independence_angola', name: 'The Struggle for Independence in Angola', description: 'Liberation struggle in Angola.', formLevel: 'Form 4', hasNotes: true },
  { id: 'struggle_for_independence_namibia', name: 'The Struggle for Independence in Namibia', description: 'Liberation struggle in Namibia.', formLevel: 'Form 4', hasNotes: true },
  { id: 'struggle_for_independence_south_africa', name: 'The Struggle for Independence in South Africa', description: 'Liberation struggle in South Africa.', formLevel: 'Form 4', hasNotes: true },
  { id: 'role_of_liberation_movements_southern_africa', name: 'Role of Liberation Movements in Southern Africa', description: 'Contribution of liberation movements in the region.', formLevel: 'Form 4', hasNotes: true },
  { id: 'role_of_international_community_southern_african_liberation', name: 'Role of the International Community in Southern African Liberation', description: 'External support and pressure in Southern African liberation.', formLevel: 'Form 4', hasNotes: true },
  { id: 'effects_of_struggles_for_independence_southern_africa', name: 'Effects of the Struggles for Independence in Southern Africa', description: 'Outcomes and impacts of liberation struggles in Southern Africa.', formLevel: 'Form 4', hasNotes: true },
  { id: 'causes_of_first_world_war', name: 'Causes of the First World War', description: 'Short- and long-term causes of WWI.', formLevel: 'Form 4', hasNotes: true },
  { id: 'course_of_first_world_war', name: 'Course of the First World War', description: 'Main phases and events of WWI.', formLevel: 'Form 4', hasNotes: true },
  { id: 'effects_of_first_world_war', name: 'Effects of the First World War', description: 'Political, social, and economic effects of WWI.', formLevel: 'Form 4', hasNotes: true },
  { id: 'treaty_of_versailles', name: 'The Treaty of Versailles', description: 'Terms and effects of the Treaty of Versailles.', formLevel: 'Form 4', hasNotes: true },
  { id: 'other_post_war_treaties', name: 'Other Post-War Treaties', description: 'Additional post-WWI treaties and their significance.', formLevel: 'Form 4', hasNotes: true },
  { id: 'political_developments_inter_war_period', name: 'Political Developments during the Inter-War Period', description: 'Political changes in the inter-war period (1919-1939).', formLevel: 'Form 4', hasNotes: true },
  { id: 'economic_developments_inter_war_period', name: 'Economic Developments during the Inter-War Period', description: 'Economic changes in the inter-war period (1919-1939).', formLevel: 'Form 4', hasNotes: true },
  { id: 'social_developments_inter_war_period', name: 'Social Developments during the Inter-War Period', description: 'Social changes in the inter-war period (1919-1939).', formLevel: 'Form 4', hasNotes: true },
  { id: 'rise_of_dictatorships_in_europe', name: 'Rise of Dictatorships in Europe', description: 'Rise of authoritarian regimes in inter-war Europe.', formLevel: 'Form 4', hasNotes: true },
  { id: 'causes_of_second_world_war_inter_war', name: 'Causes of the Second World War', description: 'Inter-war conditions that caused WWII.', formLevel: 'Form 4', hasNotes: true },
  { id: 'causes_of_second_world_war', name: 'Causes of the Second World War', description: 'Immediate and underlying causes of WWII.', formLevel: 'Form 4', hasNotes: true },
  { id: 'course_of_second_world_war', name: 'Course of the Second World War', description: 'Main phases and events of WWII.', formLevel: 'Form 4', hasNotes: true },
  { id: 'effects_of_second_world_war', name: 'Effects of the Second World War', description: 'Political, social, and economic effects of WWII.', formLevel: 'Form 4', hasNotes: true },
  { id: 'formation_of_united_nations', name: 'Formation of the United Nations', description: 'Origins, aims, and structure of the United Nations.', formLevel: 'Form 4', hasNotes: true },
  { id: 'cold_war_causes', name: 'The Cold War - Causes', description: 'Origins and drivers of the Cold War.', formLevel: 'Form 4', hasNotes: true },
  { id: 'cold_war_effects', name: 'The Cold War - Effects', description: 'Global and regional effects of the Cold War.', formLevel: 'Form 4', hasNotes: true },
  { id: 'decolonisation_after_second_world_war', name: 'Decolonisation after the Second World War', description: 'Post-WWII decolonisation processes and outcomes.', formLevel: 'Form 4', hasNotes: true },
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
