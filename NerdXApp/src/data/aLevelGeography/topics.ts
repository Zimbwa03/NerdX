// ZIMSEC A Level Geography Topics (Syllabus 9156)
// Paper 1: Physical Geography | Paper 2: Human Geography

export interface ALevelGeographyTopic {
    id: string;
    name: string;
    description: string;
    paper: 'Paper 1' | 'Paper 2';
    hasNotes?: boolean;
}

export const aLevelGeographyTopics: ALevelGeographyTopic[] = [
    // Paper 1: Physical Geography
    {
        id: 'climatology',
        name: 'Climatology',
        description: 'Atmospheric system, vertical structure, climate elements, global heat balance, pressure belts, air masses, rainfall mechanisms, climate types, and climate change.',
        paper: 'Paper 1',
        hasNotes: true,
    },
    {
        id: 'hydrology_and_fluvial_geomorphology',
        name: 'Hydrology & Fluvial Geomorphology',
        description: 'Drainage basins as open systems, hydrological cycle, hydrographs and regimes, fluvial erosion/transport/deposition, Hjulström curve, evolution of landforms, human impact (e.g. Aswan Dam), flood management.',
        paper: 'Paper 1',
        hasNotes: true,
    },
    {
        id: 'geomorphology',
        name: 'Geomorphology',
        description: 'Earth structure and rock cycle, lithology, plate tectonics, weathering, mass movement, denudation agents, fluvial/coastal/aeolian/glacial landforms, slope development, and human impact (e.g. Aswan Dam).',
        paper: 'Paper 1',
        hasNotes: true,
    },
    {
        id: 'biogeography',
        name: 'Biogeography',
        description: 'Spatial distribution of life, ecosystem dynamics, energy flow and nutrient cycling, global biomes, pedology, succession, biodiversity, human impact, and sustainable management.',
        paper: 'Paper 1',
        hasNotes: true,
    },
    // Paper 2: Human Geography
    {
        id: 'population_geography',
        name: 'Population Geography',
        description: 'Spatial analysis of distribution, structure, growth (DTM), migration, policies (e.g. China), population-resource debate (Malthus vs Boserup), and regional issues (Africa).',
        paper: 'Paper 2',
        hasNotes: true,
    },
    {
        id: 'settlement_geography',
        name: 'Settlement Geography',
        description: 'Spatial distribution and evolution of habitation, site and situation, rural/urban morphologies, functional diversity, urbanisation dynamics, land-use models, urban challenges, management and planning, rural decline, and Green Revolution.',
        paper: 'Paper 2',
        hasNotes: true,
    },
    {
        id: 'agriculture_and_food_production',
        name: 'Agriculture & Food Production',
        description: 'Global food systems, taxonomy of farming types, determinants of success, systems analysis, food security, challenges and responses, sustainability framework, and regional synthesis (e.g. Zimbabwe).',
        paper: 'Paper 2',
        hasNotes: true,
    },
    {
        id: 'industry_mining_and_energy',
        name: 'Industry, Mining & Energy',
        description: 'Taxonomy of industry (primary to quaternary), location determinants, mining methodologies and impacts, energy systems (renewable vs non-renewable), power generation, Aswan Dam case study, and synthesis.',
        paper: 'Paper 2',
        hasNotes: true,
    },
    {
        id: 'environmental_management',
        name: 'Environmental Management',
        description: 'Strategic regulation of human–environment interaction, resource classification, global environmental problems, conservation frameworks, sustainable development (Brundtland), policy and waste management, and regional case study (Zimbabwe CAMPFIRE).',
        paper: 'Paper 2',
        hasNotes: true,
    },
];

export const getTopicById = (id: string): ALevelGeographyTopic | undefined =>
    aLevelGeographyTopics.find(t => t.id === id);

export const getTopicsByPaper = (paper: 'Paper 1' | 'Paper 2'): ALevelGeographyTopic[] =>
    aLevelGeographyTopics.filter(t => t.paper === paper);

export const getAllTopicNames = (): string[] =>
    aLevelGeographyTopics.map(t => t.name);

export const topicCounts = {
    paper1: aLevelGeographyTopics.filter(t => t.paper === 'Paper 1').length,
    paper2: aLevelGeographyTopics.filter(t => t.paper === 'Paper 2').length,
};
