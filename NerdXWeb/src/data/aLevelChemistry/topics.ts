// A Level Chemistry Topics Data
// Contains all A Level Chemistry topics with learning objectives

export interface ALevelChemistryTopic {
    id: string;
    name: string;
    description: string;
    category: 'Physical Chemistry' | 'Inorganic Chemistry' | 'Organic Chemistry' | 'Analysis';
    learningObjectives: string[];
    keyFormulas?: string[];
    difficulty: 'AS Level' | 'A2 Level';
}

// Complete list of A Level Chemistry topics
export const aLevelChemistryTopics: ALevelChemistryTopic[] = [
    // AS Level Topics - Physical Chemistry
    {
        id: 'atomic_structure',
        name: 'Atomic Structure',
        description: 'Protons, neutrons, electrons, isotopes, and electronic configurations',
        category: 'Physical Chemistry',
        difficulty: 'AS Level',
        learningObjectives: [
            'Describe the structure of an atom with protons, neutrons, and electrons',
            'Define atomic number, mass number, and isotopes',
            'Describe s and p orbital shapes and electronic configurations',
            'Explain ionization energy trends',
            'Calculate relative atomic mass from isotopic abundances'
        ],
        keyFormulas: ['Ar = Σ(isotope mass × abundance) / 100']
    },
    {
        id: 'atoms_molecules_stoichiometry',
        name: 'Atoms, Molecules and Stoichiometry',
        description: 'Mole concept, Avogadro constant, empirical and molecular formulas',
        category: 'Physical Chemistry',
        difficulty: 'AS Level',
        learningObjectives: [
            'Define and use the mole concept and Avogadro constant',
            'Calculate empirical and molecular formulas',
            'Perform reacting mass and mole calculations',
            'Calculate concentrations and volumes in solution chemistry',
            'Determine percentage yield and atom economy'
        ],
        keyFormulas: ['n = m/M', 'n = CV', 'n = V/24 (at RTP)', '% yield = (actual/theoretical) × 100']
    },
    {
        id: 'chemical_bonding',
        name: 'Chemical Bonding',
        description: 'Ionic, covalent, metallic bonding; shapes of molecules; intermolecular forces',
        category: 'Physical Chemistry',
        difficulty: 'AS Level',
        learningObjectives: [
            'Describe ionic, covalent, and metallic bonding',
            'Use dot-and-cross diagrams for molecules and ions',
            'Apply VSEPR theory to predict molecular shapes',
            'Explain sigma and pi bonding and hybridization',
            'Describe intermolecular forces: van der Waals, hydrogen bonding, dipole-dipole'
        ],
        keyFormulas: ['Bond order = (bonding - antibonding electrons) / 2']
    },
    {
        id: 'states_of_matter',
        name: 'States of Matter',
        description: 'Gases, liquids, and solids; ideal gas behavior',
        category: 'Physical Chemistry',
        difficulty: 'AS Level',
        learningObjectives: [
            'Describe kinetic theory and states of matter',
            'Apply the ideal gas equation pV = nRT',
            'Calculate partial pressures in gas mixtures',
            'Explain deviations from ideal gas behavior',
            'Describe lattice structures of ionic and metallic solids'
        ],
        keyFormulas: ['pV = nRT', 'p₁V₁/T₁ = p₂V₂/T₂', 'pₐ = xₐ × pₜₒₜₐₗ']
    },
    {
        id: 'chemical_energetics_as',
        name: 'Chemical Energetics',
        description: 'Enthalpy changes, Hess\'s law, and bond energies',
        category: 'Physical Chemistry',
        difficulty: 'AS Level',
        learningObjectives: [
            'Define and calculate standard enthalpy changes',
            'Apply Hess\'s Law to calculate enthalpy changes',
            'Use bond energies to estimate enthalpy changes',
            'Draw and interpret enthalpy level diagrams',
            'Describe calorimetry experiments'
        ],
        keyFormulas: ['ΔH = Σ(bonds broken) - Σ(bonds formed)', 'q = mcΔT', 'ΔH° = Σ(ΔHf° products) - Σ(ΔHf° reactants)']
    },
    {
        id: 'electrochemistry_as',
        name: 'Electrochemistry',
        description: 'Redox reactions, oxidation numbers, and electrolysis',
        category: 'Physical Chemistry',
        difficulty: 'AS Level',
        learningObjectives: [
            'Calculate oxidation numbers in compounds and ions',
            'Write and balance half-equations and ionic equations',
            'Define oxidation, reduction, and redox in terms of electron transfer',
            'Describe electrolysis and products at electrodes',
            'Explain disproportionation reactions'
        ],
        keyFormulas: ['Oxidation = loss of electrons', 'Reduction = gain of electrons']
    },
    {
        id: 'equilibria_as',
        name: 'Equilibria',
        description: 'Dynamic equilibrium, Le Chatelier\'s principle, Kc',
        category: 'Physical Chemistry',
        difficulty: 'AS Level',
        learningObjectives: [
            'Explain the concept of dynamic equilibrium',
            'State and apply Le Chatelier\'s principle',
            'Write expressions for equilibrium constants Kc',
            'Calculate Kc from concentration data',
            'Explain factors affecting equilibrium position'
        ],
        keyFormulas: ['Kc = [products]ⁿ/[reactants]ᵐ']
    },
    {
        id: 'reaction_kinetics_as',
        name: 'Reaction Kinetics',
        description: 'Rate of reaction, factors affecting rate, collision theory',
        category: 'Physical Chemistry',
        difficulty: 'AS Level',
        learningObjectives: [
            'Define reaction rate and measure it experimentally',
            'Explain collision theory and activation energy',
            'Describe factors affecting reaction rate',
            'Interpret rate-concentration and rate-time graphs',
            'Explain the effect of catalysts on reaction rate'
        ],
        keyFormulas: ['Rate = Δ[concentration]/Δt', 'Arrhenius: k = Ae^(-Ea/RT)']
    },
    // AS Level - Inorganic Chemistry
    {
        id: 'periodic_table_periodicity',
        name: 'The Periodic Table: Chemical Periodicity',
        description: 'Trends across periods and down groups',
        category: 'Inorganic Chemistry',
        difficulty: 'AS Level',
        learningObjectives: [
            'Describe trends in atomic radius, ionic radius, and ionization energy',
            'Explain periodicity in terms of electronic structure',
            'Describe reactions of Period 3 elements with oxygen and water',
            'Explain acid-base character of Period 3 oxides',
            'Compare properties of Period 3 chlorides'
        ]
    },
    {
        id: 'group_2',
        name: 'Group 2 Elements',
        description: 'Alkaline earth metals: reactions and trends',
        category: 'Inorganic Chemistry',
        difficulty: 'AS Level',
        learningObjectives: [
            'Describe reactions of Group 2 metals with oxygen, water, and acids',
            'Explain trends in reactivity down Group 2',
            'Describe thermal decomposition of Group 2 carbonates and nitrates',
            'Explain trends in solubility of Group 2 hydroxides and sulfates',
            'Describe uses of Group 2 compounds'
        ]
    },
    {
        id: 'group_17',
        name: 'Group 17 Elements',
        description: 'Halogens: properties, reactions, and halide ions',
        category: 'Inorganic Chemistry',
        difficulty: 'AS Level',
        learningObjectives: [
            'Describe physical properties and trends of halogens',
            'Explain displacement reactions of halogens',
            'Describe reactions of halide ions with silver nitrate and ammonia',
            'Explain disproportionation of chlorine in water and alkali',
            'Describe uses of halogens and halogen compounds'
        ]
    },
    {
        id: 'nitrogen_sulfur',
        name: 'Nitrogen and Sulfur',
        description: 'Chemistry of nitrogen and sulfur compounds',
        category: 'Inorganic Chemistry',
        difficulty: 'AS Level',
        learningObjectives: [
            'Describe the nitrogen cycle and fixation of nitrogen',
            'Explain the environmental impact of nitrogen oxides',
            'Describe properties of sulfur and its oxides',
            'Explain the environmental impact of sulfur dioxide',
            'Describe industrial production of sulfuric acid'
        ]
    },
    // AS Level - Organic Chemistry
    {
        id: 'intro_organic_as',
        name: 'Introduction to Organic Chemistry',
        description: 'Nomenclature, isomerism, and functional groups',
        category: 'Organic Chemistry',
        difficulty: 'AS Level',
        learningObjectives: [
            'Apply IUPAC nomenclature to organic compounds',
            'Identify functional groups in organic molecules',
            'Describe structural and geometric (E/Z) isomerism',
            'Explain sigma and pi bonding in organic molecules',
            'Classify reactions as substitution, addition, elimination, or oxidation/reduction'
        ]
    },
    {
        id: 'hydrocarbons_as',
        name: 'Hydrocarbons',
        description: 'Alkanes, alkenes, and their reactions',
        category: 'Organic Chemistry',
        difficulty: 'AS Level',
        learningObjectives: [
            'Describe structure and properties of alkanes',
            'Explain free radical substitution mechanism',
            'Describe structure and properties of alkenes',
            'Explain electrophilic addition reactions of alkenes',
            'Distinguish alkanes from alkenes using bromine water'
        ],
        keyFormulas: ['CₙH₂ₙ₊₂ (alkanes)', 'CₙH₂ₙ (alkenes)']
    },
    {
        id: 'halogen_compounds_as',
        name: 'Halogen Compounds',
        description: 'Halogenoalkanes: reactions and mechanisms',
        category: 'Organic Chemistry',
        difficulty: 'AS Level',
        learningObjectives: [
            'Describe nucleophilic substitution reactions of halogenoalkanes',
            'Explain SN1 and SN2 mechanisms',
            'Describe elimination reactions forming alkenes',
            'Compare reactivity of primary, secondary, and tertiary halogenoalkanes',
            'Explain environmental impact of CFCs'
        ]
    },
    {
        id: 'hydroxy_compounds_as',
        name: 'Hydroxy Compounds',
        description: 'Alcohols: preparation, reactions, and classification',
        category: 'Organic Chemistry',
        difficulty: 'AS Level',
        learningObjectives: [
            'Classify alcohols as primary, secondary, or tertiary',
            'Describe oxidation reactions of alcohols',
            'Explain esterification and dehydration reactions',
            'Describe preparation of alcohols from halogenoalkanes and alkenes',
            'Distinguish primary, secondary, and tertiary alcohols experimentally'
        ]
    },
    {
        id: 'carbonyl_compounds',
        name: 'Carbonyl Compounds',
        description: 'Aldehydes and ketones: reactions and tests',
        category: 'Organic Chemistry',
        difficulty: 'AS Level',
        learningObjectives: [
            'Describe structure and naming of aldehydes and ketones',
            'Explain nucleophilic addition reactions',
            'Describe reduction of carbonyl compounds',
            'Distinguish aldehydes from ketones using Tollens\' and Fehling\'s tests',
            'Explain the mechanism of nucleophilic addition'
        ]
    },
    {
        id: 'carboxylic_acids_as',
        name: 'Carboxylic Acids and Derivatives',
        description: 'Carboxylic acids, esters, and acyl chlorides',
        category: 'Organic Chemistry',
        difficulty: 'AS Level',
        learningObjectives: [
            'Describe properties and reactions of carboxylic acids',
            'Explain formation and hydrolysis of esters',
            'Describe reactions of acyl chlorides',
            'Compare acidity of carboxylic acids with other organic compounds',
            'Explain uses of esters as flavourings and in biodiesel'
        ]
    },
    {
        id: 'nitrogen_compounds_as',
        name: 'Nitrogen Compounds',
        description: 'Amines, amides, and amino acids',
        category: 'Organic Chemistry',
        difficulty: 'AS Level',
        learningObjectives: [
            'Describe structure and basicity of amines',
            'Explain preparation of amines from halogenoalkanes and nitriles',
            'Describe reactions of amines as nucleophiles and bases',
            'Explain structure and properties of amino acids',
            'Describe formation of peptide bonds'
        ]
    },
    {
        id: 'polymerisation_as',
        name: 'Polymerisation',
        description: 'Addition and condensation polymerisation',
        category: 'Organic Chemistry',
        difficulty: 'AS Level',
        learningObjectives: [
            'Describe addition polymerisation of alkenes',
            'Explain condensation polymerisation to form polyesters and polyamides',
            'Identify repeating units and monomers in polymers',
            'Describe environmental issues with polymer disposal',
            'Explain biodegradability and recycling of polymers'
        ]
    },
    {
        id: 'organic_synthesis_as',
        name: 'Organic Synthesis',
        description: 'Multi-step synthesis and retrosynthetic analysis',
        category: 'Organic Chemistry',
        difficulty: 'AS Level',
        learningObjectives: [
            'Design multi-step synthetic routes',
            'Apply knowledge of functional group interconversions',
            'Identify suitable reagents and conditions for each step',
            'Apply retrosynthetic analysis to plan syntheses',
            'Explain the importance of yield and purity'
        ]
    },
    {
        id: 'analytical_techniques_as',
        name: 'Analytical Techniques',
        description: 'Mass spectrometry and infrared spectroscopy',
        category: 'Analysis',
        difficulty: 'AS Level',
        learningObjectives: [
            'Interpret mass spectra to determine molecular mass and fragmentation',
            'Identify functional groups using infrared spectroscopy',
            'Use data from analytical techniques to determine structure',
            'Describe how a mass spectrometer works',
            'Interpret IR absorption data for common functional groups'
        ]
    },
    // A2 Level Topics
    {
        id: 'chemical_energetics_a2',
        name: 'Chemical Energetics (Advanced)',
        description: 'Lattice energy, Born-Haber cycles, entropy, and free energy',
        category: 'Physical Chemistry',
        difficulty: 'A2 Level',
        learningObjectives: [
            'Define and use lattice energy and enthalpy of atomisation',
            'Construct and use Born-Haber cycles',
            'Define entropy and calculate entropy changes',
            'Apply Gibbs free energy equation ΔG = ΔH - TΔS',
            'Predict spontaneity of reactions using ΔG'
        ],
        keyFormulas: ['ΔG = ΔH - TΔS', 'ΔS_total = ΔS_system + ΔS_surroundings']
    },
    {
        id: 'electrochemistry_a2',
        name: 'Electrochemistry (Advanced)',
        description: 'Electrode potentials, electrochemical cells, and batteries',
        category: 'Physical Chemistry',
        difficulty: 'A2 Level',
        learningObjectives: [
            'Define standard electrode potential E°',
            'Use standard electrode potentials to predict cell EMF',
            'Construct electrochemical cells and cell diagrams',
            'Apply the Nernst equation',
            'Describe applications in batteries and fuel cells'
        ],
        keyFormulas: ['E°cell = E°cathode - E°anode', 'Nernst: E = E° - (RT/nF)lnQ']
    },
    {
        id: 'equilibria_a2',
        name: 'Equilibria (Advanced)',
        description: 'Kp, Kw, pH, buffers, and solubility product',
        category: 'Physical Chemistry',
        difficulty: 'A2 Level',
        learningObjectives: [
            'Calculate and use Kp for gaseous equilibria',
            'Define and use Kw, Ka, Kb, and pKa',
            'Calculate pH of strong and weak acids and bases',
            'Explain buffer solutions and calculate buffer pH',
            'Define and use solubility product Ksp'
        ],
        keyFormulas: ['pH = -log[H⁺]', 'Kw = [H⁺][OH⁻] = 10⁻¹⁴', 'Henderson-Hasselbalch: pH = pKa + log([A⁻]/[HA])']
    },
    {
        id: 'reaction_kinetics_a2',
        name: 'Reaction Kinetics (Advanced)',
        description: 'Rate equations, orders of reaction, and mechanisms',
        category: 'Physical Chemistry',
        difficulty: 'A2 Level',
        learningObjectives: [
            'Determine rate equations from experimental data',
            'Calculate rate constants and half-lives',
            'Deduce reaction mechanisms from rate equations',
            'Interpret concentration-time graphs for different orders',
            'Apply the Arrhenius equation quantitatively'
        ],
        keyFormulas: ['Rate = k[A]ᵐ[B]ⁿ', 't½ = ln2/k (first order)', 'ln k = ln A - Ea/RT']
    },
    {
        id: 'transition_elements',
        name: 'Chemistry of Transition Elements',
        description: 'Properties, complexes, and reactions of d-block elements',
        category: 'Inorganic Chemistry',
        difficulty: 'A2 Level',
        learningObjectives: [
            'Define transition elements and their characteristic properties',
            'Explain variable oxidation states and colored complexes',
            'Describe complex ion formation and ligand exchange',
            'Explain catalytic activity of transition metals',
            'Describe reactions of aqueous transition metal ions'
        ]
    },
    {
        id: 'benzene_aromatics',
        name: 'Benzene and Aromatic Compounds',
        description: 'Structure of benzene, electrophilic substitution',
        category: 'Organic Chemistry',
        difficulty: 'A2 Level',
        learningObjectives: [
            'Describe the structure and bonding of benzene',
            'Explain stability of benzene using delocalization',
            'Describe electrophilic substitution reactions',
            'Explain nitration, halogenation, and Friedel-Crafts reactions',
            'Compare reactivity of benzene and alkenes'
        ]
    },
    {
        id: 'phenols',
        name: 'Phenols',
        description: 'Properties and reactions of phenol',
        category: 'Organic Chemistry',
        difficulty: 'A2 Level',
        learningObjectives: [
            'Describe the acidic nature of phenol',
            'Compare acidity of phenol with alcohols and carboxylic acids',
            'Explain the effect of the benzene ring on OH group',
            'Describe electrophilic substitution reactions of phenol',
            'Explain uses of phenol and its derivatives'
        ]
    },
    {
        id: 'carbonyl_compounds_a2',
        name: 'Carbonyl Compounds (Advanced)',
        description: 'Further reactions of aldehydes and ketones',
        category: 'Organic Chemistry',
        difficulty: 'A2 Level',
        learningObjectives: [
            'Describe reactions with HCN and mechanism',
            'Explain condensation reactions with 2,4-DNP and hydroxylamine',
            'Describe the aldol reaction and its mechanism',
            'Explain keto-enol tautomerism',
            'Apply carbonyl chemistry in synthesis'
        ]
    },
    {
        id: 'carboxylic_acids_a2',
        name: 'Carboxylic Acids and Derivatives (Advanced)',
        description: 'Acid derivatives and their interconversions',
        category: 'Organic Chemistry',
        difficulty: 'A2 Level',
        learningObjectives: [
            'Compare reactivity of acid derivatives',
            'Describe nucleophilic acyl substitution mechanism',
            'Explain interconversions between acid derivatives',
            'Describe reactions of acid anhydrides',
            'Apply knowledge to synthesis problems'
        ]
    },
    {
        id: 'nitrogen_compounds_a2',
        name: 'Nitrogen Compounds (Advanced)',
        description: 'Amines, nitriles, and diazonium compounds',
        category: 'Organic Chemistry',
        difficulty: 'A2 Level',
        learningObjectives: [
            'Describe preparation and reactions of nitriles',
            'Explain formation and reactions of diazonium salts',
            'Describe azo dye formation and coupling reactions',
            'Explain the chemistry of aromatic amines',
            'Apply nitrogen compound chemistry in synthesis'
        ]
    },
    {
        id: 'polymerisation_a2',
        name: 'Polymerisation (Advanced)',
        description: 'Advanced polymer chemistry and properties',
        category: 'Organic Chemistry',
        difficulty: 'A2 Level',
        learningObjectives: [
            'Describe different types of copolymers',
            'Explain factors affecting polymer properties',
            'Describe cross-linking and thermosetting polymers',
            'Compare properties of addition and condensation polymers',
            'Discuss sustainable polymer chemistry'
        ]
    },
    {
        id: 'organic_synthesis_a2',
        name: 'Organic Synthesis (Advanced)',
        description: 'Complex multi-step synthesis',
        category: 'Organic Chemistry',
        difficulty: 'A2 Level',
        learningObjectives: [
            'Design complex multi-step synthetic routes',
            'Apply all functional group chemistry knowledge',
            'Consider stereochemistry in synthesis',
            'Optimize yields and select protecting groups',
            'Analyze and evaluate synthetic strategies'
        ]
    },
    {
        id: 'analytical_techniques_a2',
        name: 'Analytical Techniques (Advanced)',
        description: 'NMR spectroscopy and chromatography',
        category: 'Analysis',
        difficulty: 'A2 Level',
        learningObjectives: [
            'Interpret ¹H and ¹³C NMR spectra',
            'Explain chemical shift, splitting patterns, and integration',
            'Combine data from MS, IR, and NMR to determine structure',
            'Describe high-performance liquid chromatography (HPLC)',
            'Apply chromatographic techniques to analysis'
        ]
    }
];

// Helper functions
export function getTopicById(id: string): ALevelChemistryTopic | undefined {
    return aLevelChemistryTopics.find(topic => topic.id === id);
}

export function getTopicsByLevel(level: 'AS Level' | 'A2 Level'): ALevelChemistryTopic[] {
    return aLevelChemistryTopics.filter(topic => topic.difficulty === level);
}

export function getTopicsByCategory(category: string): ALevelChemistryTopic[] {
    return aLevelChemistryTopics.filter(topic => topic.category === category);
}

export function getAllTopicNames(): string[] {
    return aLevelChemistryTopics.map(topic => topic.name);
}
