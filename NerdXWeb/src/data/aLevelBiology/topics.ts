// ZIMSEC A Level Biology Topics Data (Code: 6030)
// Comprehensive coverage of the entire ZIMSEC A Level Biology syllabus
// Supports MCQ, Structured Questions, and Essay question types
// Using DeepSeek for AI-powered question generation

export interface ALevelBiologyTopic {
    id: string;
    name: string;
    description: string;
    learningObjectives: string[];
    keyTerms?: string[];
    difficulty: 'Lower Sixth' | 'Upper Sixth';
    paperRelevance: 'Paper 1' | 'Paper 2' | 'Paper 3' | 'All';
    practicalComponent?: boolean;
}

// Question types available for A Level Biology
export type BiologyQuestionType = 'mcq' | 'structured' | 'essay';

export interface BiologyQuestionTypeInfo {
    id: BiologyQuestionType;
    name: string;
    description: string;
    icon: string;
    color: string;
    marks: string;
    timeGuide: string;
}

export const biologyQuestionTypes: BiologyQuestionTypeInfo[] = [
    {
        id: 'mcq',
        name: 'Multiple Choice',
        description: 'Test your knowledge with 4-option questions',
        icon: 'checkbox-marked-circle-outline',
        color: '#10B981',
        marks: '1-2 marks each',
        timeGuide: '~1-2 min per question'
    },
    {
        id: 'structured',
        name: 'Structured Questions',
        description: 'Multi-part questions requiring detailed answers',
        icon: 'format-list-numbered',
        color: '#3B82F6',
        marks: '10-15 marks',
        timeGuide: '~15-20 min per question'
    },
    {
        id: 'essay',
        name: 'Essay Questions',
        description: 'In-depth essays demonstrating comprehensive understanding',
        icon: 'file-document-edit-outline',
        color: '#8B5CF6',
        marks: '20-25 marks',
        timeGuide: '~30-40 min per essay'
    }
];

// Complete ZIMSEC A Level Biology Topics
export const aLevelBiologyTopics: ALevelBiologyTopic[] = [
    // ============================================
    // LOWER SIXTH (Form 5) - AS Level Topics 1-12
    // ============================================
    {
        id: 'cell_structure',
        name: 'Cell Structure',
        description: 'Ultrastructure of eukaryotic and prokaryotic cells, organelles and their functions',
        difficulty: 'Lower Sixth',
        paperRelevance: 'Paper 1',
        practicalComponent: true,
        learningObjectives: [
            'Describe the structure of eukaryotic cells as seen under electron microscope',
            'Identify and describe functions of cell organelles: nucleus, mitochondria, ribosomes, ER, Golgi, lysosomes',
            'Compare and contrast prokaryotic and eukaryotic cells',
            'Explain the relationship between structure and function of organelles',
            'Calculate magnification and actual size of specimens',
            'Understand resolution and magnification of light vs electron microscopes'
        ],
        keyTerms: ['ultrastructure', 'organelles', 'prokaryote', 'eukaryote', 'nucleus', 'mitochondria', 'ribosome', 'endoplasmic reticulum', 'Golgi apparatus', 'lysosome', 'chloroplast', 'cell wall', 'magnification', 'resolution']
    },
    {
        id: 'biological_molecules',
        name: 'Biological Molecules',
        description: 'Structure and function of carbohydrates, lipids, proteins, and water',
        difficulty: 'Lower Sixth',
        paperRelevance: 'Paper 1',
        practicalComponent: true,
        learningObjectives: [
            'Describe the structure and properties of water and its importance in living organisms',
            'Describe the structure of monosaccharides, disaccharides and polysaccharides',
            'Explain condensation and hydrolysis reactions in carbohydrate metabolism',
            'Describe the structure of triglycerides and phospholipids',
            'Explain the structure of amino acids and formation of peptide bonds',
            'Describe primary, secondary, tertiary and quaternary protein structure',
            'Perform and interpret food tests for reducing/non-reducing sugars, starch, lipids and proteins'
        ],
        keyTerms: ['monosaccharide', 'disaccharide', 'polysaccharide', 'glycosidic bond', 'peptide bond', 'triglyceride', 'phospholipid', 'amino acid', 'primary structure', 'secondary structure', 'alpha helix', 'beta pleated sheet', 'tertiary structure', 'quaternary structure', 'condensation', 'hydrolysis']
    },
    {
        id: 'enzymes',
        name: 'Enzymes',
        description: 'Enzyme structure, function, properties, and factors affecting enzyme activity',
        difficulty: 'Lower Sixth',
        paperRelevance: 'Paper 1',
        practicalComponent: true,
        learningObjectives: [
            'Explain the mode of action of enzymes using lock and key and induced fit models',
            'Describe the course of an enzyme-catalyzed reaction',
            'Explain how temperature, pH, substrate concentration and enzyme concentration affect enzyme activity',
            'Distinguish between competitive and non-competitive inhibition',
            'Explain the significance of enzymes in metabolism',
            'Describe immobilized enzymes and their applications'
        ],
        keyTerms: ['active site', 'substrate', 'enzyme-substrate complex', 'activation energy', 'specificity', 'lock and key', 'induced fit', 'Vmax', 'Km', 'competitive inhibition', 'non-competitive inhibition', 'denaturation', 'optimum temperature', 'optimum pH']
    },
    {
        id: 'cell_membranes',
        name: 'Cell Membranes and Transport',
        description: 'Membrane structure and transport mechanisms across membranes',
        difficulty: 'Lower Sixth',
        paperRelevance: 'Paper 1',
        practicalComponent: true,
        learningObjectives: [
            'Describe the fluid mosaic model of membrane structure',
            'Explain the roles of phospholipids, cholesterol, proteins and glycoproteins',
            'Describe and explain diffusion, facilitated diffusion, osmosis and active transport',
            'Explain the terms water potential, solute potential and pressure potential',
            'Describe endocytosis and exocytosis',
            'Investigate the effect of osmosis on plant and animal cells'
        ],
        keyTerms: ['fluid mosaic model', 'phospholipid bilayer', 'integral protein', 'peripheral protein', 'glycoprotein', 'cholesterol', 'diffusion', 'facilitated diffusion', 'osmosis', 'active transport', 'water potential', 'endocytosis', 'exocytosis', 'channel protein', 'carrier protein']
    },
    {
        id: 'cell_division',
        name: 'The Cell Cycle and Mitosis',
        description: 'Cell cycle stages, mitosis, and significance in growth and asexual reproduction',
        difficulty: 'Lower Sixth',
        paperRelevance: 'Paper 1',
        practicalComponent: true,
        learningObjectives: [
            'Describe the stages of the cell cycle: interphase (G1, S, G2) and mitotic phase',
            'Describe the behavior of chromosomes during mitosis',
            'Explain the significance of mitosis in growth, repair and asexual reproduction',
            'Describe the role of checkpoints in the cell cycle',
            'Explain the relationship between uncontrolled cell division and cancer',
            'Calculate mitotic index from prepared slides'
        ],
        keyTerms: ['interphase', 'prophase', 'metaphase', 'anaphase', 'telophase', 'cytokinesis', 'chromatin', 'chromosome', 'chromatid', 'centromere', 'spindle', 'centriole', 'mitotic index', 'cell cycle', 'checkpoint']
    },
    {
        id: 'nucleic_acids',
        name: 'Nucleic Acids and Protein Synthesis',
        description: 'DNA and RNA structure, replication, transcription and translation',
        difficulty: 'Lower Sixth',
        paperRelevance: 'Paper 1',
        learningObjectives: [
            'Describe the structure of nucleotides and polynucleotides',
            'Compare the structure of DNA and RNA',
            'Describe the semi-conservative replication of DNA',
            'Describe the process of transcription',
            'Describe the process of translation',
            'Explain the role of mRNA, tRNA and rRNA in protein synthesis',
            'Explain the significance of the genetic code'
        ],
        keyTerms: ['nucleotide', 'polynucleotide', 'DNA', 'RNA', 'mRNA', 'tRNA', 'rRNA', 'double helix', 'base pairing', 'complementary', 'antiparallel', 'replication', 'transcription', 'translation', 'codon', 'anticodon', 'genetic code', 'ribosome']
    },
    {
        id: 'transport_plants',
        name: 'Transport in Plants',
        description: 'Structure and function of xylem and phloem, transpiration and translocation',
        difficulty: 'Lower Sixth',
        paperRelevance: 'Paper 2',
        practicalComponent: true,
        learningObjectives: [
            'Describe the structure and function of xylem vessels and phloem sieve tubes',
            'Explain the movement of water from soil to leaves (transpiration stream)',
            'Describe the mechanism of stomatal opening and closing',
            'Explain factors affecting the rate of transpiration',
            'Describe the mechanism of translocation in phloem (mass flow hypothesis)',
            'Explain how xerophytes are adapted to reduce water loss'
        ],
        keyTerms: ['xylem', 'phloem', 'transpiration', 'translocation', 'cohesion', 'adhesion', 'tension', 'root pressure', 'stomata', 'guard cells', 'potometer', 'source', 'sink', 'mass flow', 'xerophyte', 'apoplast', 'symplast']
    },
    {
        id: 'transport_mammals',
        name: 'Transport in Mammals',
        description: 'Heart structure, cardiac cycle, blood vessels and circulation',
        difficulty: 'Lower Sixth',
        paperRelevance: 'Paper 2',
        learningObjectives: [
            'Describe the structure of the mammalian heart',
            'Explain the cardiac cycle including pressure and volume changes',
            'Describe the electrical coordination of the heartbeat',
            'Compare the structure and function of arteries, veins and capillaries',
            'Describe the composition and functions of blood',
            'Explain the formation of tissue fluid and its return to the circulation',
            'Describe the role of haemoglobin in oxygen transport'
        ],
        keyTerms: ['atrium', 'ventricle', 'septum', 'atrioventricular valve', 'semilunar valve', 'cardiac cycle', 'systole', 'diastole', 'sinoatrial node', 'atrioventricular node', 'Purkyne fibres', 'artery', 'vein', 'capillary', 'haemoglobin', 'oxygen dissociation curve', 'tissue fluid', 'lymph']
    },
    {
        id: 'gas_exchange',
        name: 'Gas Exchange',
        description: 'Gas exchange surfaces in mammals, fish and insects; breathing mechanisms',
        difficulty: 'Lower Sixth',
        paperRelevance: 'Paper 2',
        practicalComponent: true,
        learningObjectives: [
            'Describe the features of efficient gas exchange surfaces',
            'Describe the structure of the human gas exchange system',
            'Explain the mechanism of ventilation in mammals',
            'Describe gas exchange in fish gills using counter-current flow',
            'Describe the tracheal system in insects',
            'Explain the effects of smoking on the gas exchange system'
        ],
        keyTerms: ['alveolus', 'bronchus', 'bronchiole', 'trachea', 'diaphragm', 'intercostal muscles', 'ventilation', 'gas exchange surface', 'counter-current', 'spiracle', 'trachea (insect)', 'surfactant', 'emphysema', 'COPD']
    },
    {
        id: 'infectious_diseases',
        name: 'Infectious Diseases',
        description: 'Types of pathogens, transmission, prevention and treatment of diseases',
        difficulty: 'Lower Sixth',
        paperRelevance: 'Paper 2',
        learningObjectives: [
            'Describe the different types of pathogens: bacteria, viruses, fungi, protoctista',
            'Describe the causes, transmission and control of cholera, malaria, TB and HIV/AIDS',
            'Explain how pathogens cause disease',
            'Describe methods of disease transmission',
            'Explain the role of antibiotics and antivirals',
            'Discuss the problem of antibiotic resistance'
        ],
        keyTerms: ['pathogen', 'bacteria', 'virus', 'fungi', 'protoctista', 'vector', 'transmission', 'endemic', 'epidemic', 'pandemic', 'antibiotic', 'antibiotic resistance', 'cholera', 'malaria', 'tuberculosis', 'HIV', 'AIDS']
    },
    {
        id: 'immunity',
        name: 'Immunity',
        description: 'Immune response, antibodies, vaccination and types of immunity',
        difficulty: 'Lower Sixth',
        paperRelevance: 'Paper 2',
        learningObjectives: [
            'Distinguish between specific and non-specific immunity',
            'Describe the roles of phagocytes in non-specific immunity',
            'Describe the roles of B lymphocytes and T lymphocytes',
            'Explain the structure and functions of antibodies',
            'Distinguish between active and passive immunity',
            'Explain the principles of vaccination',
            'Discuss the benefits and risks of vaccination programs'
        ],
        keyTerms: ['antigen', 'antibody', 'B lymphocyte', 'T lymphocyte', 'plasma cell', 'memory cell', 'phagocyte', 'macrophage', 'neutrophil', 'active immunity', 'passive immunity', 'natural immunity', 'artificial immunity', 'vaccination', 'herd immunity', 'autoimmune disease']
    },
    {
        id: 'smoking_health',
        name: 'Smoking and Health',
        description: 'Effects of smoking on gas exchange and circulatory systems, cardiovascular disease',
        difficulty: 'Lower Sixth',
        paperRelevance: 'Paper 2',
        learningObjectives: [
            'Describe the effects of tar, nicotine and carbon monoxide',
            'Explain how smoking causes chronic bronchitis and emphysema',
            'Explain the link between smoking and lung cancer',
            'Describe the effects of smoking on the cardiovascular system',
            'Explain the formation of atherosclerosis',
            'Discuss factors contributing to cardiovascular disease'
        ],
        keyTerms: ['tar', 'nicotine', 'carbon monoxide', 'carcinogen', 'chronic bronchitis', 'emphysema', 'COPD', 'lung cancer', 'atherosclerosis', 'coronary heart disease', 'stroke', 'cardiovascular disease', 'risk factors']
    },

    // ============================================
    // UPPER SIXTH (Form 6) - A2 Level Topics 13-24
    // ============================================
    {
        id: 'energy_respiration',
        name: 'Energy and Respiration',
        description: 'ATP, glycolysis, Krebs cycle, oxidative phosphorylation and anaerobic respiration',
        difficulty: 'Upper Sixth',
        paperRelevance: 'Paper 1',
        learningObjectives: [
            'Explain the role of ATP as the universal energy currency',
            'Describe the structure of mitochondria and relate to function',
            'Describe glycolysis and the link reaction',
            'Describe the Krebs cycle and its products',
            'Explain oxidative phosphorylation and chemiosmosis',
            'Compare aerobic and anaerobic respiration',
            'Calculate respiratory quotient and interpret values'
        ],
        keyTerms: ['ATP', 'ADP', 'glycolysis', 'pyruvate', 'acetyl CoA', 'Krebs cycle', 'citric acid cycle', 'NAD', 'FAD', 'electron transport chain', 'oxidative phosphorylation', 'chemiosmosis', 'ATP synthase', 'anaerobic respiration', 'lactate', 'ethanol', 'respiratory quotient']
    },
    {
        id: 'photosynthesis',
        name: 'Photosynthesis',
        description: 'Light-dependent and light-independent reactions, limiting factors',
        difficulty: 'Upper Sixth',
        paperRelevance: 'Paper 1',
        practicalComponent: true,
        learningObjectives: [
            'Describe the structure of chloroplasts and relate to function',
            'Describe the light-dependent reactions of photosynthesis',
            'Explain photophosphorylation and the production of ATP and NADPH',
            'Describe the light-independent reactions (Calvin cycle)',
            'Explain the effect of limiting factors on photosynthesis rate',
            'Compare C3 and C4 plants'
        ],
        keyTerms: ['chloroplast', 'thylakoid', 'granum', 'stroma', 'photosystem', 'photophosphorylation', 'cyclic', 'non-cyclic', 'photolysis', 'Calvin cycle', 'RuBisCO', 'RuBP', 'GP', 'triose phosphate', 'limiting factor', 'C3 plant', 'C4 plant']
    },
    {
        id: 'homeostasis',
        name: 'Homeostasis',
        description: 'Principles of homeostasis, negative feedback and control systems',
        difficulty: 'Upper Sixth',
        paperRelevance: 'Paper 2',
        learningObjectives: [
            'Define homeostasis and explain its importance',
            'Explain the principles of negative feedback',
            'Describe the control of blood glucose concentration',
            'Describe the roles of insulin and glucagon',
            'Explain the causes and treatment of diabetes mellitus',
            'Describe thermoregulation in mammals'
        ],
        keyTerms: ['homeostasis', 'negative feedback', 'positive feedback', 'set point', 'receptor', 'effector', 'insulin', 'glucagon', 'glycogenesis', 'glycogenolysis', 'gluconeogenesis', 'diabetes mellitus', 'Type 1 diabetes', 'Type 2 diabetes', 'thermoregulation', 'hypothalamus']
    },
    {
        id: 'excretion',
        name: 'Excretion',
        description: 'Kidney structure and function, osmoregulation and urine formation',
        difficulty: 'Upper Sixth',
        paperRelevance: 'Paper 2',
        learningObjectives: [
            'Define excretion and describe excretory products',
            'Describe the gross structure of the kidney',
            'Describe the structure of the nephron',
            'Explain ultrafiltration in the glomerulus',
            'Explain selective reabsorption in the proximal convoluted tubule',
            'Describe the role of the loop of Henle in concentrating urine',
            'Explain the role of ADH in osmoregulation'
        ],
        keyTerms: ['excretion', 'urea', 'nephron', 'glomerulus', 'Bowmans capsule', 'proximal convoluted tubule', 'loop of Henle', 'distal convoluted tubule', 'collecting duct', 'ultrafiltration', 'selective reabsorption', 'counter-current multiplier', 'ADH', 'osmoregulation', 'dialysis']
    },
    {
        id: 'nervous_coordination',
        name: 'Coordination: Nervous System',
        description: 'Nerve impulse transmission, synapses, and receptors',
        difficulty: 'Upper Sixth',
        paperRelevance: 'Paper 2',
        learningObjectives: [
            'Describe the structure and function of a motor neurone',
            'Explain the resting potential and action potential',
            'Describe the transmission of nerve impulses along axons',
            'Explain the structure and function of synapses',
            'Describe the roles of neurotransmitters',
            'Describe the structure and function of the Pacinian corpuscle',
            'Explain the structure and function of a rod cell'
        ],
        keyTerms: ['neurone', 'axon', 'dendrite', 'myelin sheath', 'node of Ranvier', 'resting potential', 'action potential', 'depolarisation', 'repolarisation', 'threshold', 'saltatory conduction', 'synapse', 'neurotransmitter', 'acetylcholine', 'receptor', 'Pacinian corpuscle', 'rod cell', 'cone cell']
    },
    {
        id: 'hormonal_coordination',
        name: 'Coordination: Hormones',
        description: 'Endocrine system, hormone action and control of reproduction',
        difficulty: 'Upper Sixth',
        paperRelevance: 'Paper 2',
        learningObjectives: [
            'Compare nervous and hormonal coordination',
            'Describe the roles of the main endocrine glands',
            'Explain the mechanism of action of steroid and peptide hormones',
            'Describe the control of the menstrual cycle',
            'Describe hormonal control in plants (auxins)',
            'Explain phototropism and geotropism'
        ],
        keyTerms: ['endocrine gland', 'hormone', 'target cell', 'receptor', 'steroid hormone', 'peptide hormone', 'second messenger', 'cAMP', 'FSH', 'LH', 'oestrogen', 'progesterone', 'testosterone', 'auxin', 'phototropism', 'geotropism', 'apical dominance']
    },
    {
        id: 'meiosis_genetics',
        name: 'Inherited Change',
        description: 'Meiosis, inheritance patterns, genetic crosses and variation',
        difficulty: 'Upper Sixth',
        paperRelevance: 'Paper 1',
        learningObjectives: [
            'Describe the process of meiosis and its significance',
            'Explain how meiosis produces genetic variation',
            'Use genetic diagrams for monohybrid and dihybrid crosses',
            'Explain the inheritance of sex-linked characteristics',
            'Describe co-dominance and multiple alleles',
            'Explain the chi-squared test and its application',
            'Describe gene mutations and their effects'
        ],
        keyTerms: ['meiosis', 'homologous chromosomes', 'crossing over', 'independent assortment', 'allele', 'genotype', 'phenotype', 'dominant', 'recessive', 'co-dominant', 'sex linkage', 'autosomal', 'chi-squared test', 'mutation', 'gene mutation', 'chromosome mutation']
    },
    {
        id: 'selection_evolution',
        name: 'Selection and Evolution',
        description: 'Natural selection, speciation, evolution and evidence',
        difficulty: 'Upper Sixth',
        paperRelevance: 'Paper 1',
        learningObjectives: [
            'Explain the theory of evolution by natural selection',
            'Describe different types of natural selection',
            'Explain how selection can lead to speciation',
            'Distinguish between allopatric and sympatric speciation',
            'Describe evidence for evolution',
            'Explain artificial selection and its applications'
        ],
        keyTerms: ['evolution', 'natural selection', 'survival of the fittest', 'adaptation', 'speciation', 'allopatric', 'sympatric', 'reproductive isolation', 'stabilising selection', 'directional selection', 'disruptive selection', 'genetic drift', 'gene pool', 'fossil record', 'homologous structures', 'artificial selection']
    },
    {
        id: 'biodiversity_classification',
        name: 'Biodiversity and Classification',
        description: 'Classification systems, biodiversity and conservation',
        difficulty: 'Upper Sixth',
        paperRelevance: 'Paper 2',
        practicalComponent: true,
        learningObjectives: [
            'Explain the importance of classification',
            'Describe the three-domain classification system',
            'Explain the binomial system of nomenclature',
            'Define biodiversity at different levels',
            'Describe methods for measuring biodiversity',
            'Explain the importance of biodiversity',
            'Discuss threats to biodiversity and conservation strategies'
        ],
        keyTerms: ['taxonomy', 'kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species', 'binomial nomenclature', 'domain', 'Archaea', 'Bacteria', 'Eukarya', 'biodiversity', 'species richness', 'genetic diversity', 'ecosystem diversity', 'Simpsons index', 'conservation', 'endemic species']
    },
    {
        id: 'genetic_technology',
        name: 'Genetic Technology',
        description: 'DNA technology, genetic engineering, cloning and applications',
        difficulty: 'Upper Sixth',
        paperRelevance: 'Paper 1',
        learningObjectives: [
            'Describe techniques used in genetic engineering',
            'Explain the use of restriction enzymes and ligase',
            'Describe the polymerase chain reaction (PCR)',
            'Describe gel electrophoresis and its applications',
            'Explain the production of insulin using genetic engineering',
            'Discuss the applications and ethics of genetic technology',
            'Describe gene therapy and cloning'
        ],
        keyTerms: ['genetic engineering', 'recombinant DNA', 'restriction enzyme', 'ligase', 'plasmid', 'vector', 'transformation', 'PCR', 'gel electrophoresis', 'DNA profiling', 'gene therapy', 'transgenic', 'GMO', 'cloning', 'stem cell', 'therapeutic cloning']
    },
    {
        id: 'ecology',
        name: 'Ecology',
        description: 'Ecosystems, energy flow, nutrient cycles and population dynamics',
        difficulty: 'Upper Sixth',
        paperRelevance: 'Paper 2',
        practicalComponent: true,
        learningObjectives: [
            'Define ecosystem, population, community and habitat',
            'Describe energy flow through ecosystems',
            'Explain food chains, food webs and trophic levels',
            'Calculate and interpret ecological pyramids',
            'Describe the carbon and nitrogen cycles',
            'Explain factors affecting population growth',
            'Describe techniques for estimating population size'
        ],
        keyTerms: ['ecosystem', 'population', 'community', 'habitat', 'niche', 'producer', 'consumer', 'decomposer', 'trophic level', 'food chain', 'food web', 'pyramid of numbers', 'pyramid of biomass', 'pyramid of energy', 'carbon cycle', 'nitrogen cycle', 'nitrogen fixation', 'denitrification', 'carrying capacity', 'quadrat', 'transect', 'mark-release-recapture']
    },
    {
        id: 'human_environment',
        name: 'Human Impact on Environment',
        description: 'Pollution, climate change, deforestation and sustainability',
        difficulty: 'Upper Sixth',
        paperRelevance: 'Paper 2',
        learningObjectives: [
            'Describe the effects of deforestation',
            'Explain the causes and effects of global warming',
            'Describe the greenhouse effect and greenhouse gases',
            'Discuss the effects of pollution on ecosystems',
            'Describe eutrophication and its effects',
            'Explain sustainable development and conservation',
            'Discuss strategies for maintaining biodiversity'
        ],
        keyTerms: ['deforestation', 'global warming', 'climate change', 'greenhouse effect', 'greenhouse gas', 'carbon footprint', 'eutrophication', 'pollution', 'acid rain', 'ozone depletion', 'sustainability', 'renewable resources', 'conservation', 'protected areas', 'captive breeding']
    },
    {
        id: 'reproduction',
        name: 'Reproduction',
        description: 'Sexual and asexual reproduction in plants and animals',
        difficulty: 'Upper Sixth',
        paperRelevance: 'Paper 2',
        learningObjectives: [
            'Compare sexual and asexual reproduction',
            'Describe the structure of flowers and their role in reproduction',
            'Explain pollination and fertilisation in plants',
            'Describe seed and fruit formation',
            'Describe the structure and function of the human reproductive system',
            'Describe the menstrual cycle and fertilisation',
            'Explain the role of hormones in pregnancy'
        ],
        keyTerms: ['sexual reproduction', 'asexual reproduction', 'gamete', 'fertilisation', 'zygote', 'pollination', 'self-pollination', 'cross-pollination', 'double fertilisation', 'embryo', 'endosperm', 'seed dispersal', 'germination', 'ovulation', 'implantation', 'placenta', 'pregnancy', 'contraception']
    }
];

// Helper function to get topic by ID
export function getTopicById(id: string): ALevelBiologyTopic | undefined {
    return aLevelBiologyTopics.find(topic => topic.id === id);
}

// Get topics by difficulty level
export function getTopicsByLevel(level: 'Lower Sixth' | 'Upper Sixth'): ALevelBiologyTopic[] {
    return aLevelBiologyTopics.filter(topic => topic.difficulty === level);
}

// Get all topic names
export function getAllTopicNames(): string[] {
    return aLevelBiologyTopics.map(topic => topic.name);
}

// Get topics with practical component
export function getPracticalTopics(): ALevelBiologyTopic[] {
    return aLevelBiologyTopics.filter(topic => topic.practicalComponent);
}

// Get topics by paper relevance
export function getTopicsByPaper(paper: 'Paper 1' | 'Paper 2' | 'Paper 3' | 'All'): ALevelBiologyTopic[] {
    return aLevelBiologyTopics.filter(
        topic => topic.paperRelevance === paper || topic.paperRelevance === 'All'
    );
}

// Export topic count for display
export const topicCounts = {
    lowerSixth: aLevelBiologyTopics.filter(t => t.difficulty === 'Lower Sixth').length,
    upperSixth: aLevelBiologyTopics.filter(t => t.difficulty === 'Upper Sixth').length,
    total: aLevelBiologyTopics.length,
    practical: aLevelBiologyTopics.filter(t => t.practicalComponent).length
};

