// ZIMSEC O Level Geography Topics (Syllabus 2248) — All Level (Forms 1–4)
// Paper 1: MCQ | Paper 2: Structured/Data-Response

export interface OLevelGeographyTopic {
    id: string;
    name: string;
    description: string;
    hasNotes?: boolean;
}

export const oLevelGeographyTopics: OLevelGeographyTopic[] = [
    { id: 'weather_and_climate', name: 'Weather and Climate', description: 'Elements of weather, instruments, rainfall types, air masses and fronts, climatic regions, cyclones, climate change.', hasNotes: true },
    { id: 'landforms_and_landscape_processes', name: 'Landforms and Landscape Processes', description: 'Rocks, weathering, tectonic and fluvial landforms.', hasNotes: true },
    { id: 'ecosystems', name: 'Ecosystems', description: 'Ecosystem components, food chains, biomes, nutrient cycles, soils.', hasNotes: true },
    { id: 'natural_resources', name: 'Natural Resources', description: 'Resource classification, distribution, sustainable use.', hasNotes: true },
    { id: 'energy_and_power_development', name: 'Energy and Power Development', description: 'Energy sources and development.', hasNotes: true },
    { id: 'map_work_and_gis', name: 'Map Work and Geographical Information Systems (GIS)', description: 'Map skills and GIS.', hasNotes: true },
    { id: 'minerals_and_mining', name: 'Minerals and Mining', description: 'Minerals, mining, and impacts.', hasNotes: true },
    { id: 'environmental_management', name: 'Environmental Management', description: 'Conservation and sustainability.', hasNotes: true },
    { id: 'agriculture_and_land_reform', name: 'Agriculture and Land Reform', description: 'Farming types and land reform.', hasNotes: true },
    { id: 'industry', name: 'Industry', description: 'Industrial location and types.', hasNotes: true },
    { id: 'settlement_and_population', name: 'Settlement and Population', description: 'Settlement patterns and population.', hasNotes: true },
    { id: 'transport_and_trade', name: 'Transport and Trade', description: 'Transport and trade patterns.', hasNotes: true },
];

export const getTopicById = (id: string): OLevelGeographyTopic | undefined =>
    oLevelGeographyTopics.find(t => t.id === id);

export const getTopicByName = (name: string): OLevelGeographyTopic | undefined =>
    oLevelGeographyTopics.find(t => t.name === name);

export const getTopicsWithNotes = (): OLevelGeographyTopic[] =>
    oLevelGeographyTopics.filter(t => t.hasNotes);
