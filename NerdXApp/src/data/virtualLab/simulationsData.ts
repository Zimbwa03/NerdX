// Virtual Lab Simulations Data
// Phase 1: 6 High-Impact Simulations

import { SimulationMetadata, ChemicalEquation, Badge } from './simulationTypes';
import { PHASE3_SIMULATIONS } from './phase3Simulations';

// ============================================
// PHASE 1 SIMULATIONS
// ============================================

export const PHASE1_SIMULATIONS: SimulationMetadata[] = [
    // ============================================
    // BIOLOGY SIMULATIONS
    // ============================================
    {
        id: 'cell-explorer',
        title: 'Cell Explorer',
        subject: 'biology',
        topic: 'Cell Structure and Organisation',
        description: 'Explore plant and animal cells under a virtual microscope. Identify and label cell organelles at different magnifications.',
        difficulty: 'easy',
        xpReward: 100,
        estimatedTime: '10-15 mins',
        icon: 'microscope',
        color: '#4CAF50',
        learningObjectives: [
            { id: 'ce-1', text: 'Identify the main organelles in plant and animal cells' },
            { id: 'ce-2', text: 'Compare and contrast plant and animal cell structures' },
            { id: 'ce-3', text: 'Understand the function of each cell organelle' },
            { id: 'ce-4', text: 'Use microscope magnification controls' },
        ],
        quizQuestions: [
            {
                id: 'ce-q1',
                question: 'Which organelle is only found in plant cells?',
                options: ['Mitochondria', 'Chloroplast', 'Nucleus', 'Cell membrane'],
                correctIndex: 1,
                explanation: 'Chloroplasts contain chlorophyll and are responsible for photosynthesis, which only occurs in plant cells.',
            },
            {
                id: 'ce-q2',
                question: 'What is the function of the mitochondria?',
                options: ['Protein synthesis', 'Energy production (ATP)', 'Storage of water', 'Photosynthesis'],
                correctIndex: 1,
                explanation: 'Mitochondria are the "powerhouse of the cell" - they produce ATP through cellular respiration.',
            },
            {
                id: 'ce-q3',
                question: 'Which structure provides rigid support to plant cells?',
                options: ['Cell membrane', 'Cytoplasm', 'Cell wall', 'Vacuole'],
                correctIndex: 2,
                explanation: 'The cell wall is made of cellulose and provides structural support to plant cells.',
            },
            {
                id: 'ce-q4',
                question: 'What is the main function of the nucleus?',
                options: ['Energy production', 'Storage of genetic material (DNA)', 'Protein synthesis', 'Cell movement'],
                correctIndex: 1,
                explanation: 'The nucleus contains DNA and controls all cell activities.',
            },
        ],
    },
    {
        id: 'osmosis-adventure',
        title: 'Osmosis Adventure',
        subject: 'biology',
        topic: 'Movement In and Out of Cells',
        description: 'Investigate how cells respond to different solution concentrations. Watch water move across cell membranes in real-time.',
        difficulty: 'medium',
        xpReward: 150,
        estimatedTime: '15-20 mins',
        icon: 'water',
        color: '#2196F3',
        learningObjectives: [
            { id: 'oa-1', text: 'Define osmosis as movement of water through a selectively permeable membrane' },
            { id: 'oa-2', text: 'Distinguish between hypotonic, isotonic, and hypertonic solutions' },
            { id: 'oa-3', text: 'Predict cell behavior in different solutions' },
            { id: 'oa-4', text: 'Explain turgid, flaccid, and plasmolyzed cell states' },
        ],
        quizQuestions: [
            {
                id: 'oa-q1',
                question: 'In a hypotonic solution, water moves:',
                options: ['Out of the cell', 'Into the cell', 'Does not move', 'Both directions equally'],
                correctIndex: 1,
                explanation: 'In a hypotonic solution, water concentration is higher outside the cell, so water moves into the cell by osmosis.',
            },
            {
                id: 'oa-q2',
                question: 'What happens to a red blood cell in a hypertonic solution?',
                options: ['It swells and bursts (lysis)', 'It shrinks (crenation)', 'It stays the same', 'It divides'],
                correctIndex: 1,
                explanation: 'In a hypertonic solution, water leaves the cell causing it to shrink - this is called crenation.',
            },
            {
                id: 'oa-q3',
                question: 'A plant cell in a hypotonic solution becomes:',
                options: ['Plasmolyzed', 'Turgid', 'Flaccid', 'Lysed'],
                correctIndex: 1,
                explanation: 'The cell absorbs water and becomes firm and swollen - this turgid state helps plants stay upright.',
            },
            {
                id: 'oa-q4',
                question: 'What is the term for water loss from a plant cell causing the cytoplasm to shrink away from the cell wall?',
                options: ['Lysis', 'Turgidity', 'Plasmolysis', 'Crenation'],
                correctIndex: 2,
                explanation: 'Plasmolysis occurs when a plant cell loses water and the cytoplasm pulls away from the cell wall.',
            },
        ],
    },

    // ============================================
    // CHEMISTRY SIMULATIONS
    // ============================================
    {
        id: 'atom-builder',
        title: 'Atom Builder',
        subject: 'chemistry',
        topic: 'Atomic Structure',
        description: 'Build atoms by adding protons, neutrons, and electrons. Learn about atomic and mass numbers, electron shells, and element identification.',
        difficulty: 'medium',
        xpReward: 150,
        estimatedTime: '15-20 mins',
        icon: 'atom',
        color: '#FF9800',
        learningObjectives: [
            { id: 'ab-1', text: 'Understand the structure of an atom (protons, neutrons, electrons)' },
            { id: 'ab-2', text: 'Calculate atomic number and mass number' },
            { id: 'ab-3', text: 'Arrange electrons in shells using the 2,8,8 rule' },
            { id: 'ab-4', text: 'Identify elements from their atomic structure' },
        ],
        quizQuestions: [
            {
                id: 'ab-q1',
                question: 'The atomic number of an element equals:',
                options: ['Number of neutrons', 'Number of protons', 'Number of electrons + protons', 'Mass number'],
                correctIndex: 1,
                explanation: 'The atomic number is the number of protons in the nucleus, which defines the element.',
            },
            {
                id: 'ab-q2',
                question: 'An atom has 11 protons, 12 neutrons, and 11 electrons. What is its mass number?',
                options: ['11', '12', '22', '23'],
                correctIndex: 3,
                explanation: 'Mass number = protons + neutrons = 11 + 12 = 23',
            },
            {
                id: 'ab-q3',
                question: 'Which particle has no electric charge?',
                options: ['Proton', 'Electron', 'Neutron', 'Ion'],
                correctIndex: 2,
                explanation: 'Neutrons are electrically neutral particles found in the nucleus.',
            },
            {
                id: 'ab-q4',
                question: 'An atom with 8 electrons has an electron configuration of:',
                options: ['2, 6', '8', '2, 8', '4, 4'],
                correctIndex: 0,
                explanation: 'The first shell holds 2 electrons, the second holds up to 8. So 8 electrons = 2, 6.',
            },
        ],
    },
    {
        id: 'equation-balancer',
        title: 'Equation Balancer',
        subject: 'chemistry',
        topic: 'Stoichiometry',
        description: 'Master the art of balancing chemical equations. Visualize atom conservation and progress through increasingly challenging equations.',
        difficulty: 'medium',
        xpReward: 200,
        estimatedTime: '15-20 mins',
        icon: 'scale',
        color: '#9C27B0',
        learningObjectives: [
            { id: 'eb-1', text: 'Understand the law of conservation of mass' },
            { id: 'eb-2', text: 'Balance chemical equations by adjusting coefficients' },
            { id: 'eb-3', text: 'Count atoms on both sides of an equation' },
            { id: 'eb-4', text: 'Apply systematic balancing strategies' },
        ],
        quizQuestions: [
            {
                id: 'eb-q1',
                question: 'What law states that atoms cannot be created or destroyed in a chemical reaction?',
                options: ['Law of Gravity', 'Law of Conservation of Mass', 'Law of Thermodynamics', 'Law of Motion'],
                correctIndex: 1,
                explanation: 'The Law of Conservation of Mass means the same atoms must appear on both sides of an equation.',
            },
            {
                id: 'eb-q2',
                question: 'In the equation H₂ + O₂ → H₂O, how many H₂O molecules are needed to balance it?',
                options: ['1', '2', '3', '4'],
                correctIndex: 1,
                explanation: 'The balanced equation is 2H₂ + O₂ → 2H₂O (4 H atoms and 2 O atoms on each side)',
            },
            {
                id: 'eb-q3',
                question: 'What is the coefficient of O₂ in the balanced equation: CH₄ + O₂ → CO₂ + H₂O?',
                options: ['1', '2', '3', '4'],
                correctIndex: 1,
                explanation: 'CH₄ + 2O₂ → CO₂ + 2H₂O (4 O atoms on each side)',
            },
            {
                id: 'eb-q4',
                question: 'When balancing equations, you should:',
                options: ['Change subscripts', 'Change coefficients', 'Add new elements', 'Remove products'],
                correctIndex: 1,
                explanation: 'Only coefficients (numbers in front) should be changed, never subscripts.',
            },
        ],
    },

    // ============================================
    // PHYSICS SIMULATIONS
    // ============================================
    {
        id: 'circuit-builder',
        title: 'Circuit Builder',
        subject: 'physics',
        topic: 'Electricity',
        description: 'Design and build electrical circuits using cells, bulbs, resistors, and switches. Measure current and voltage in series and parallel configurations.',
        difficulty: 'hard',
        xpReward: 250,
        estimatedTime: '20-25 mins',
        icon: 'flash',
        color: '#F44336',
        learningObjectives: [
            { id: 'cb-1', text: 'Understand the components of an electrical circuit' },
            { id: 'cb-2', text: 'Distinguish between series and parallel circuits' },
            { id: 'cb-3', text: 'Apply Ohm\'s Law (V = IR)' },
            { id: 'cb-4', text: 'Calculate total resistance in circuits' },
        ],
        quizQuestions: [
            {
                id: 'cb-q1',
                question: 'In a series circuit, if one bulb breaks:',
                options: ['Other bulbs stay on', 'All bulbs go off', 'Other bulbs get brighter', 'Nothing happens'],
                correctIndex: 1,
                explanation: 'In a series circuit, there is only one path for current. If it\'s broken, all components stop working.',
            },
            {
                id: 'cb-q2',
                question: 'According to Ohm\'s Law, if voltage doubles and resistance stays the same, current will:',
                options: ['Halve', 'Double', 'Stay the same', 'Quadruple'],
                correctIndex: 1,
                explanation: 'V = IR, so I = V/R. If V doubles and R is constant, I doubles.',
            },
            {
                id: 'cb-q3',
                question: 'In a parallel circuit, the total resistance is:',
                options: ['Equal to the sum of all resistances', 'Less than the smallest resistor', 'Greater than the largest resistor', 'Always zero'],
                correctIndex: 1,
                explanation: 'In parallel, 1/R_total = 1/R₁ + 1/R₂ + ..., which always gives a value less than the smallest individual resistor.',
            },
            {
                id: 'cb-q4',
                question: 'What is the unit of electrical resistance?',
                options: ['Volt', 'Ampere', 'Ohm', 'Watt'],
                correctIndex: 2,
                explanation: 'Resistance is measured in Ohms (Ω).',
            },
        ],
    },
    {
        id: 'projectile-motion',
        title: 'Projectile Motion',
        subject: 'physics',
        topic: 'Kinematics',
        description: 'Launch projectiles at different angles and velocities. Observe parabolic trajectories and discover the relationship between launch angle and range.',
        difficulty: 'medium',
        xpReward: 175,
        estimatedTime: '15-20 mins',
        icon: 'rocket',
        color: '#00BCD4',
        learningObjectives: [
            { id: 'pm-1', text: 'Understand that projectile motion is a combination of horizontal and vertical motion' },
            { id: 'pm-2', text: 'Identify the angle for maximum range (45°)' },
            { id: 'pm-3', text: 'Calculate range, maximum height, and time of flight' },
            { id: 'pm-4', text: 'Recognize the parabolic path of projectiles' },
        ],
        quizQuestions: [
            {
                id: 'pm-q1',
                question: 'At what angle should a projectile be launched for maximum range (ignoring air resistance)?',
                options: ['30°', '45°', '60°', '90°'],
                correctIndex: 1,
                explanation: '45° gives the optimal balance between horizontal distance and time in the air.',
            },
            {
                id: 'pm-q2',
                question: 'At the highest point of a projectile\'s path, the vertical velocity is:',
                options: ['Maximum', 'Zero', 'Negative', 'Equal to horizontal velocity'],
                correctIndex: 1,
                explanation: 'At maximum height, the projectile momentarily stops moving upward before falling down.',
            },
            {
                id: 'pm-q3',
                question: 'What force acts on a projectile during its flight (ignoring air resistance)?',
                options: ['Thrust', 'Gravity only', 'Air resistance only', 'Magnetic force'],
                correctIndex: 1,
                explanation: 'Once launched, only gravity acts on the projectile, pulling it downward.',
            },
            {
                id: 'pm-q4',
                question: 'The horizontal velocity of a projectile during flight:',
                options: ['Increases', 'Decreases', 'Stays constant', 'Becomes zero'],
                correctIndex: 2,
                explanation: 'With no horizontal forces (ignoring air resistance), horizontal velocity remains constant.',
            },
        ],
    },
];

// ============================================
// CHEMICAL EQUATIONS FOR BALANCER GAME
// ============================================

export const CHEMICAL_EQUATIONS: ChemicalEquation[] = [
    // Level 1: Easy (2 elements)
    {
        id: 'eq-1',
        reactants: ['H₂', 'O₂'],
        products: ['H₂O'],
        correctCoefficients: [2, 1, 2],
        difficulty: 'easy',
    },
    {
        id: 'eq-2',
        reactants: ['N₂', 'H₂'],
        products: ['NH₃'],
        correctCoefficients: [1, 3, 2],
        difficulty: 'easy',
    },
    {
        id: 'eq-3',
        reactants: ['Na', 'Cl₂'],
        products: ['NaCl'],
        correctCoefficients: [2, 1, 2],
        difficulty: 'easy',
    },
    // Level 2: Medium (3 elements)
    {
        id: 'eq-4',
        reactants: ['CH₄', 'O₂'],
        products: ['CO₂', 'H₂O'],
        correctCoefficients: [1, 2, 1, 2],
        difficulty: 'medium',
    },
    {
        id: 'eq-5',
        reactants: ['Fe', 'O₂'],
        products: ['Fe₂O₃'],
        correctCoefficients: [4, 3, 2],
        difficulty: 'medium',
    },
    {
        id: 'eq-6',
        reactants: ['C₃H₈', 'O₂'],
        products: ['CO₂', 'H₂O'],
        correctCoefficients: [1, 5, 3, 4],
        difficulty: 'medium',
    },
    // Level 3: Hard (complex)
    {
        id: 'eq-7',
        reactants: ['Al', 'HCl'],
        products: ['AlCl₃', 'H₂'],
        correctCoefficients: [2, 6, 2, 3],
        difficulty: 'hard',
    },
    {
        id: 'eq-8',
        reactants: ['KMnO₄', 'HCl'],
        products: ['KCl', 'MnCl₂', 'Cl₂', 'H₂O'],
        correctCoefficients: [2, 16, 2, 2, 5, 8],
        difficulty: 'hard',
    },
];

// ============================================
// BADGES
// ============================================

export const LAB_BADGES: Badge[] = [
    {
        id: 'first-experiment',
        name: 'First Experiment',
        description: 'Complete your first virtual lab simulation',
        icon: 'beaker',
        requirement: { type: 'simulations_completed', value: 1 },
    },
    {
        id: 'biology-explorer',
        name: 'Biology Explorer',
        description: 'Complete all Biology simulations',
        icon: 'leaf',
        requirement: { type: 'subject_mastery', value: 2, subject: 'biology' },
    },
    {
        id: 'chemistry-wizard',
        name: 'Chemistry Wizard',
        description: 'Complete all Chemistry simulations',
        icon: 'flask',
        requirement: { type: 'subject_mastery', value: 2, subject: 'chemistry' },
    },
    {
        id: 'physics-master',
        name: 'Physics Master',
        description: 'Complete all Physics simulations',
        icon: 'flash',
        requirement: { type: 'subject_mastery', value: 2, subject: 'physics' },
    },
    {
        id: 'perfect-quiz',
        name: 'Perfect Score',
        description: 'Get 100% on a knowledge check quiz',
        icon: 'star',
        requirement: { type: 'perfect_quiz', value: 1 },
    },
    {
        id: 'xp-collector',
        name: 'XP Collector',
        description: 'Earn 500 XP from virtual labs',
        icon: 'trophy',
        requirement: { type: 'xp_earned', value: 500 },
    },
    {
        id: 'lab-master',
        name: 'Lab Master',
        description: 'Complete all 6 Phase 1 simulations',
        icon: 'medal',
        requirement: { type: 'simulations_completed', value: 6 },
    },
];

// ============================================
// ELEMENT DATA FOR ATOM BUILDER
// ============================================

export const ELEMENTS = [
    { atomicNumber: 1, symbol: 'H', name: 'Hydrogen', mass: 1 },
    { atomicNumber: 2, symbol: 'He', name: 'Helium', mass: 4 },
    { atomicNumber: 3, symbol: 'Li', name: 'Lithium', mass: 7 },
    { atomicNumber: 4, symbol: 'Be', name: 'Beryllium', mass: 9 },
    { atomicNumber: 5, symbol: 'B', name: 'Boron', mass: 11 },
    { atomicNumber: 6, symbol: 'C', name: 'Carbon', mass: 12 },
    { atomicNumber: 7, symbol: 'N', name: 'Nitrogen', mass: 14 },
    { atomicNumber: 8, symbol: 'O', name: 'Oxygen', mass: 16 },
    { atomicNumber: 9, symbol: 'F', name: 'Fluorine', mass: 19 },
    { atomicNumber: 10, symbol: 'Ne', name: 'Neon', mass: 20 },
    { atomicNumber: 11, symbol: 'Na', name: 'Sodium', mass: 23 },
    { atomicNumber: 12, symbol: 'Mg', name: 'Magnesium', mass: 24 },
    { atomicNumber: 13, symbol: 'Al', name: 'Aluminium', mass: 27 },
    { atomicNumber: 14, symbol: 'Si', name: 'Silicon', mass: 28 },
    { atomicNumber: 15, symbol: 'P', name: 'Phosphorus', mass: 31 },
    { atomicNumber: 16, symbol: 'S', name: 'Sulfur', mass: 32 },
    { atomicNumber: 17, symbol: 'Cl', name: 'Chlorine', mass: 35 },
    { atomicNumber: 18, symbol: 'Ar', name: 'Argon', mass: 40 },
    { atomicNumber: 19, symbol: 'K', name: 'Potassium', mass: 39 },
    { atomicNumber: 20, symbol: 'Ca', name: 'Calcium', mass: 40 },
];

// ============================================
// ORGANELLE DATA FOR CELL EXPLORER
// ============================================

export const CELL_ORGANELLES = {
    plant: [
        { id: 'cell-wall', name: 'Cell Wall', description: 'Rigid outer layer made of cellulose. Provides structural support and protection.', color: '#8BC34A' },
        { id: 'cell-membrane', name: 'Cell Membrane', description: 'Controls what enters and leaves the cell. Selectively permeable.', color: '#FFEB3B' },
        { id: 'nucleus', name: 'Nucleus', description: 'Contains DNA and controls cell activities. The "brain" of the cell.', color: '#9C27B0' },
        { id: 'cytoplasm', name: 'Cytoplasm', description: 'Jelly-like substance where chemical reactions occur.', color: '#E1BEE7' },
        { id: 'chloroplast', name: 'Chloroplast', description: 'Contains chlorophyll for photosynthesis. Makes food using sunlight.', color: '#4CAF50' },
        { id: 'vacuole', name: 'Large Vacuole', description: 'Stores water, nutrients, and waste. Keeps the cell turgid.', color: '#03A9F4' },
        { id: 'mitochondria', name: 'Mitochondria', description: 'Produces energy (ATP) through respiration. "Powerhouse of the cell".', color: '#FF5722' },
        { id: 'ribosome', name: 'Ribosomes', description: 'Make proteins. Found free in cytoplasm or on rough ER.', color: '#795548' },
    ],
    animal: [
        { id: 'cell-membrane', name: 'Cell Membrane', description: 'Controls what enters and leaves the cell. Selectively permeable.', color: '#FFEB3B' },
        { id: 'nucleus', name: 'Nucleus', description: 'Contains DNA and controls cell activities. The "brain" of the cell.', color: '#9C27B0' },
        { id: 'cytoplasm', name: 'Cytoplasm', description: 'Jelly-like substance where chemical reactions occur.', color: '#E1BEE7' },
        { id: 'mitochondria', name: 'Mitochondria', description: 'Produces energy (ATP) through respiration. "Powerhouse of the cell".', color: '#FF5722' },
        { id: 'ribosome', name: 'Ribosomes', description: 'Make proteins. Found free in cytoplasm or on rough ER.', color: '#795548' },
        { id: 'small-vacuole', name: 'Small Vacuoles', description: 'Temporary storage of water and nutrients. Much smaller than plant vacuoles.', color: '#03A9F4' },
    ],
};

// Helper function to get simulation by ID
export const getSimulationById = (id: string): SimulationMetadata | undefined => {
    return [...PHASE1_SIMULATIONS, ...PHASE2_SIMULATIONS, ...PHASE3_SIMULATIONS].find(sim => sim.id === id);
};

// Helper function to get simulations by subject
export const getSimulationsBySubject = (subject: 'biology' | 'chemistry' | 'physics'): SimulationMetadata[] => {
    return [...PHASE1_SIMULATIONS, ...PHASE2_SIMULATIONS, ...PHASE3_SIMULATIONS].filter(sim => sim.subject === subject);
};

// Get all simulations
export const getAllSimulations = (): SimulationMetadata[] => {
    return [...PHASE1_SIMULATIONS, ...PHASE2_SIMULATIONS, ...PHASE3_SIMULATIONS];
};

// ============================================
// PHASE 2 SIMULATIONS (12 Total)
// ============================================

export const PHASE2_SIMULATIONS: SimulationMetadata[] = [
    // ============================================
    // BIOLOGY SIMULATIONS (5)
    // ============================================
    {
        id: 'food-test-lab',
        title: 'Food Test Laboratory',
        subject: 'biology',
        topic: 'Nutrition',
        description: 'Perform classic food tests to identify nutrients. Use Benedict\'s, Iodine, Biuret, and Ethanol tests on various food samples.',
        difficulty: 'medium',
        xpReward: 175,
        estimatedTime: '15-20 mins',
        icon: 'nutrition',
        color: '#FF5722',
        learningObjectives: [
            { id: 'ft-1', text: 'Identify reducing sugars using Benedict\'s test' },
            { id: 'ft-2', text: 'Detect starch using Iodine solution' },
            { id: 'ft-3', text: 'Test for proteins using Biuret reagent' },
            { id: 'ft-4', text: 'Identify fats/lipids using Ethanol emulsion test' },
        ],
        quizQuestions: [
            {
                id: 'ft-q1',
                question: 'A positive Benedict\'s test shows what color change?',
                options: ['Blue to purple', 'Brown to blue-black', 'Blue to brick red/orange', 'Clear to cloudy white'],
                correctIndex: 2,
                explanation: 'Benedict\'s solution changes from blue to brick red/orange when heated with reducing sugars like glucose.',
            },
            {
                id: 'ft-q2',
                question: 'Which reagent is used to test for starch?',
                options: ['Benedict\'s solution', 'Iodine solution', 'Biuret reagent', 'Ethanol'],
                correctIndex: 1,
                explanation: 'Iodine solution turns from brown to blue-black in the presence of starch.',
            },
            {
                id: 'ft-q3',
                question: 'The Biuret test detects:',
                options: ['Sugars', 'Starch', 'Proteins', 'Fats'],
                correctIndex: 2,
                explanation: 'Biuret reagent (CuSO₄ + NaOH) turns purple in the presence of proteins.',
            },
            {
                id: 'ft-q4',
                question: 'A cloudy white emulsion indicates the presence of:',
                options: ['Glucose', 'Protein', 'Starch', 'Lipids/fats'],
                correctIndex: 3,
                explanation: 'The ethanol emulsion test produces a cloudy white emulsion when fats are present.',
            },
        ],
    },
    {
        id: 'photosynthesis-reactor',
        title: 'Photosynthesis Reactor',
        subject: 'biology',
        topic: 'Photosynthesis',
        description: 'Investigate all factors affecting photosynthesis rate. Control light, CO₂, and temperature while counting oxygen bubbles.',
        difficulty: 'medium',
        xpReward: 200,
        estimatedTime: '20-25 mins',
        icon: 'leaf',
        color: '#4CAF50',
        learningObjectives: [
            { id: 'pr-1', text: 'Understand how light intensity affects photosynthesis rate' },
            { id: 'pr-2', text: 'Explain the effect of CO₂ concentration on photosynthesis' },
            { id: 'pr-3', text: 'Identify limiting factors in photosynthesis' },
            { id: 'pr-4', text: 'Write the word equation for photosynthesis' },
        ],
        quizQuestions: [
            {
                id: 'pr-q1',
                question: 'What gas is released during photosynthesis?',
                options: ['Carbon dioxide', 'Nitrogen', 'Oxygen', 'Hydrogen'],
                correctIndex: 2,
                explanation: 'Oxygen is released as a byproduct of photosynthesis when water molecules are split.',
            },
            {
                id: 'pr-q2',
                question: 'What is a limiting factor?',
                options: ['A factor that speeds up photosynthesis', 'A factor that is in shortest supply and limits the rate', 'The maximum rate possible', 'The minimum light intensity'],
                correctIndex: 1,
                explanation: 'A limiting factor is the factor in shortest supply that prevents the rate from increasing further.',
            },
            {
                id: 'pr-q3',
                question: 'Which of these is NOT required for photosynthesis?',
                options: ['Light', 'Carbon dioxide', 'Oxygen', 'Chlorophyll'],
                correctIndex: 2,
                explanation: 'Oxygen is a product, not a requirement. Photosynthesis needs light, CO₂, water, and chlorophyll.',
            },
            {
                id: 'pr-q4',
                question: 'Where does photosynthesis occur in a plant cell?',
                options: ['Mitochondria', 'Nucleus', 'Chloroplast', 'Vacuole'],
                correctIndex: 2,
                explanation: 'Chloroplasts contain chlorophyll and are the site of photosynthesis.',
            },
        ],
    },
    {
        id: 'enzyme-action-lab',
        title: 'Enzyme Action Lab',
        subject: 'biology',
        topic: 'Nutrition (Digestion)',
        description: 'Investigate how pH and temperature affect enzyme activity using amylase and starch.',
        difficulty: 'hard',
        xpReward: 225,
        estimatedTime: '20-25 mins',
        icon: 'flask',
        color: '#9C27B0',
        learningObjectives: [
            { id: 'ea-1', text: 'Understand that enzymes have an optimum pH and temperature' },
            { id: 'ea-2', text: 'Explain enzyme denaturation' },
            { id: 'ea-3', text: 'Describe the lock and key model of enzyme action' },
            { id: 'ea-4', text: 'Interpret rate of reaction graphs' },
        ],
        quizQuestions: [
            {
                id: 'ea-q1',
                question: 'What is the optimum temperature for most human enzymes?',
                options: ['25°C', '37°C', '50°C', '100°C'],
                correctIndex: 1,
                explanation: '37°C is body temperature and the optimum for most human enzymes.',
            },
            {
                id: 'ea-q2',
                question: 'What happens to an enzyme at very high temperatures?',
                options: ['It speeds up', 'It denatures', 'It multiplies', 'Nothing'],
                correctIndex: 1,
                explanation: 'High temperatures break the bonds that hold the enzyme shape, causing denaturation.',
            },
            {
                id: 'ea-q3',
                question: 'Amylase breaks down starch into:',
                options: ['Proteins', 'Fats', 'Maltose (sugar)', 'Amino acids'],
                correctIndex: 2,
                explanation: 'Amylase is a carbohydrase that breaks down starch into maltose.',
            },
            {
                id: 'ea-q4',
                question: 'The optimum pH for stomach pepsin is:',
                options: ['pH 2 (acidic)', 'pH 7 (neutral)', 'pH 9 (alkaline)', 'pH 14 (very alkaline)'],
                correctIndex: 0,
                explanation: 'Pepsin works best in acidic conditions found in the stomach.',
            },
        ],
    },
    {
        id: 'transpiration-tracker',
        title: 'Transpiration Tracker',
        subject: 'biology',
        topic: 'Transport in Plants',
        description: 'Use a virtual potometer to measure transpiration rate under different environmental conditions.',
        difficulty: 'medium',
        xpReward: 175,
        estimatedTime: '15-20 mins',
        icon: 'water',
        color: '#00BCD4',
        learningObjectives: [
            { id: 'tt-1', text: 'Define transpiration and its importance' },
            { id: 'tt-2', text: 'Identify factors affecting transpiration rate' },
            { id: 'tt-3', text: 'Use a potometer to measure water uptake' },
            { id: 'tt-4', text: 'Explain how stomata control water loss' },
        ],
        quizQuestions: [
            {
                id: 'tt-q1',
                question: 'Transpiration is the loss of water from:',
                options: ['Roots', 'Stem', 'Leaves (stomata)', 'Flowers'],
                correctIndex: 2,
                explanation: 'Transpiration occurs mainly through stomata on the leaf surface.',
            },
            {
                id: 'tt-q2',
                question: 'Which condition increases transpiration rate?',
                options: ['High humidity', 'Low wind speed', 'High temperature', 'Darkness'],
                correctIndex: 2,
                explanation: 'High temperature increases evaporation and transpiration rate.',
            },
            {
                id: 'tt-q3',
                question: 'What structure controls the opening of stomata?',
                options: ['Palisade cells', 'Guard cells', 'Root hair cells', 'Xylem vessels'],
                correctIndex: 1,
                explanation: 'Guard cells change shape to open or close stomata.',
            },
            {
                id: 'tt-q4',
                question: 'A potometer measures:',
                options: ['Photosynthesis rate', 'Water uptake rate', 'Growth rate', 'Respiration rate'],
                correctIndex: 1,
                explanation: 'A potometer measures water uptake, which is closely related to transpiration.',
            },
        ],
    },
    {
        id: 'heart-pump',
        title: 'Heart Pump Simulator',
        subject: 'biology',
        topic: 'Transport in Humans',
        description: 'Explore the structure and function of the heart. Watch blood flow through chambers and vessels.',
        difficulty: 'medium',
        xpReward: 200,
        estimatedTime: '15-20 mins',
        icon: 'heart',
        color: '#F44336',
        learningObjectives: [
            { id: 'hp-1', text: 'Identify the four chambers of the heart' },
            { id: 'hp-2', text: 'Trace the path of blood through the heart' },
            { id: 'hp-3', text: 'Distinguish between oxygenated and deoxygenated blood' },
            { id: 'hp-4', text: 'Explain the function of heart valves' },
        ],
        quizQuestions: [
            {
                id: 'hp-q1',
                question: 'Which chamber pumps blood to the lungs?',
                options: ['Left atrium', 'Left ventricle', 'Right atrium', 'Right ventricle'],
                correctIndex: 3,
                explanation: 'The right ventricle pumps deoxygenated blood to the lungs via the pulmonary artery.',
            },
            {
                id: 'hp-q2',
                question: 'Oxygenated blood returns to the heart via the:',
                options: ['Vena cava', 'Pulmonary artery', 'Pulmonary vein', 'Aorta'],
                correctIndex: 2,
                explanation: 'The pulmonary vein carries oxygenated blood from the lungs to the left atrium.',
            },
            {
                id: 'hp-q3',
                question: 'Heart valves prevent:',
                options: ['Blood clotting', 'Backflow of blood', 'Heart attacks', 'Fast heartbeat'],
                correctIndex: 1,
                explanation: 'Valves ensure blood flows in one direction only.',
            },
            {
                id: 'hp-q4',
                question: 'Which side of the heart has thicker walls?',
                options: ['Left side', 'Right side', 'Both are equal', 'Top chambers'],
                correctIndex: 0,
                explanation: 'The left ventricle has thicker walls because it pumps blood to the whole body.',
            },
        ],
    },

    // ============================================
    // CHEMISTRY SIMULATIONS (3)
    // ============================================
    {
        id: 'titration-master',
        title: 'Titration Master',
        subject: 'chemistry',
        topic: 'Acids, Bases and Salts',
        description: 'Perform precise acid-base titrations using burette and pipette. Calculate unknown concentrations.',
        difficulty: 'hard',
        xpReward: 250,
        estimatedTime: '20-25 mins',
        icon: 'beaker',
        color: '#E91E63',
        learningObjectives: [
            { id: 'tm-1', text: 'Perform accurate titrations using proper technique' },
            { id: 'tm-2', text: 'Identify the end point using indicators' },
            { id: 'tm-3', text: 'Calculate concentration from titre values' },
            { id: 'tm-4', text: 'Understand neutralization reactions' },
        ],
        quizQuestions: [
            {
                id: 'tm-q1',
                question: 'What color does phenolphthalein turn in a basic solution?',
                options: ['Colorless', 'Pink/Purple', 'Blue', 'Yellow'],
                correctIndex: 1,
                explanation: 'Phenolphthalein is colorless in acid and turns pink/purple in base.',
            },
            {
                id: 'tm-q2',
                question: 'The end point of a titration is when:',
                options: ['All acid is used', 'The indicator changes color', 'The solution boils', 'pH reaches 14'],
                correctIndex: 1,
                explanation: 'The end point is identified by a permanent color change of the indicator.',
            },
            {
                id: 'tm-q3',
                question: 'Which apparatus is used to add acid dropwise?',
                options: ['Pipette', 'Measuring cylinder', 'Burette', 'Beaker'],
                correctIndex: 2,
                explanation: 'A burette allows controlled, dropwise addition of liquid.',
            },
            {
                id: 'tm-q4',
                question: 'A titre value is:',
                options: ['The pH of the solution', 'The volume of acid/base used', 'The concentration', 'The temperature'],
                correctIndex: 1,
                explanation: 'Titre is the volume of solution needed to reach the end point.',
            },
        ],
    },
    {
        id: 'ph-scale-explorer',
        title: 'pH Scale Explorer',
        subject: 'chemistry',
        topic: 'Acids, Bases and Salts',
        description: 'Test the pH of various substances using universal indicator. Classify solutions as acidic, neutral, or alkaline.',
        difficulty: 'easy',
        xpReward: 125,
        estimatedTime: '10-15 mins',
        icon: 'color-filter',
        color: '#673AB7',
        learningObjectives: [
            { id: 'ph-1', text: 'Understand the pH scale (0-14)' },
            { id: 'ph-2', text: 'Classify substances as acidic, neutral, or alkaline' },
            { id: 'ph-3', text: 'Use universal indicator to determine pH' },
            { id: 'ph-4', text: 'Relate pH to hydrogen ion concentration' },
        ],
        quizQuestions: [
            {
                id: 'ph-q1',
                question: 'What pH value indicates a neutral solution?',
                options: ['0', '7', '14', '1'],
                correctIndex: 1,
                explanation: 'pH 7 is neutral - neither acidic nor alkaline.',
            },
            {
                id: 'ph-q2',
                question: 'A solution with pH 2 is:',
                options: ['Strongly acidic', 'Weakly acidic', 'Neutral', 'Alkaline'],
                correctIndex: 0,
                explanation: 'pH below 7 is acidic; the lower the pH, the stronger the acid.',
            },
            {
                id: 'ph-q3',
                question: 'Universal indicator is red in:',
                options: ['Neutral solutions', 'Alkaline solutions', 'Strong acids', 'Water'],
                correctIndex: 2,
                explanation: 'Universal indicator is red in strong acids (pH 1-3).',
            },
            {
                id: 'ph-q4',
                question: 'Which substance would have a pH above 7?',
                options: ['Lemon juice', 'Vinegar', 'Soap solution', 'Stomach acid'],
                correctIndex: 2,
                explanation: 'Soap is alkaline with a pH above 7.',
            },
        ],
    },
    {
        id: 'electrolysis-simulator',
        title: 'Electrolysis Simulator',
        subject: 'chemistry',
        topic: 'Electricity and Chemistry',
        description: 'Perform electrolysis on different solutions. Observe products at electrodes and write half-equations.',
        difficulty: 'hard',
        xpReward: 250,
        estimatedTime: '20-25 mins',
        icon: 'flash',
        color: '#FF9800',
        learningObjectives: [
            { id: 'el-1', text: 'Explain what happens during electrolysis' },
            { id: 'el-2', text: 'Identify products at anode and cathode' },
            { id: 'el-3', text: 'Write half-equations for electrode reactions' },
            { id: 'el-4', text: 'Understand the role of ions in electrolysis' },
        ],
        quizQuestions: [
            {
                id: 'el-q1',
                question: 'During electrolysis, positive ions move to the:',
                options: ['Anode', 'Cathode', 'Both electrodes', 'Neither'],
                correctIndex: 1,
                explanation: 'Positive ions (cations) are attracted to the negative cathode.',
            },
            {
                id: 'el-q2',
                question: 'What is produced at the cathode during electrolysis of dilute H₂SO₄?',
                options: ['Oxygen', 'Sulfur dioxide', 'Hydrogen', 'Sulfuric acid'],
                correctIndex: 2,
                explanation: 'Hydrogen ions gain electrons at the cathode: 2H⁺ + 2e⁻ → H₂',
            },
            {
                id: 'el-q3',
                question: 'Electrolysis requires:',
                options: ['A solid ionic compound', 'An ionic compound that is molten or dissolved', 'Any metal', 'Distilled water only'],
                correctIndex: 1,
                explanation: 'Ions must be free to move, which requires melting or dissolving.',
            },
            {
                id: 'el-q4',
                question: 'At the anode, oxidation occurs because:',
                options: ['Electrons are gained', 'Electrons are lost', 'Protons are gained', 'Temperature increases'],
                correctIndex: 1,
                explanation: 'Oxidation Is Loss of electrons (OIL RIG).',
            },
        ],
    },

    // ============================================
    // PHYSICS SIMULATIONS (4)
    // ============================================
    {
        id: 'motion-grapher',
        title: 'Motion Grapher',
        subject: 'physics',
        topic: 'Kinematics',
        description: 'Create distance-time and velocity-time graphs by controlling object motion. Learn to interpret motion graphs.',
        difficulty: 'medium',
        xpReward: 175,
        estimatedTime: '15-20 mins',
        icon: 'analytics',
        color: '#3F51B5',
        learningObjectives: [
            { id: 'mg-1', text: 'Interpret distance-time graphs' },
            { id: 'mg-2', text: 'Interpret velocity-time graphs' },
            { id: 'mg-3', text: 'Calculate speed from graph gradient' },
            { id: 'mg-4', text: 'Calculate distance from area under v-t graph' },
        ],
        quizQuestions: [
            {
                id: 'mg-q1',
                question: 'A horizontal line on a distance-time graph indicates:',
                options: ['Constant speed', 'Acceleration', 'Stationary object', 'Deceleration'],
                correctIndex: 2,
                explanation: 'A horizontal line means distance isn\'t changing - the object is stationary.',
            },
            {
                id: 'mg-q2',
                question: 'The gradient of a distance-time graph gives:',
                options: ['Distance', 'Time', 'Speed', 'Acceleration'],
                correctIndex: 2,
                explanation: 'Gradient = change in y / change in x = distance / time = speed.',
            },
            {
                id: 'mg-q3',
                question: 'On a velocity-time graph, the area under the line represents:',
                options: ['Speed', 'Acceleration', 'Distance traveled', 'Time taken'],
                correctIndex: 2,
                explanation: 'Area = velocity × time = distance.',
            },
            {
                id: 'mg-q4',
                question: 'A straight diagonal line on a v-t graph indicates:',
                options: ['Constant velocity', 'Constant acceleration', 'Decreasing speed', 'Stationary object'],
                correctIndex: 1,
                explanation: 'A straight diagonal line means velocity is changing at a constant rate - uniform acceleration.',
            },
        ],
    },
    {
        id: 'newtons-laws-lab',
        title: 'Newton\'s Laws Lab',
        subject: 'physics',
        topic: 'Forces and Motion',
        description: 'Investigate all three of Newton\'s Laws through interactive experiments.',
        difficulty: 'medium',
        xpReward: 200,
        estimatedTime: '20-25 mins',
        icon: 'fitness',
        color: '#009688',
        learningObjectives: [
            { id: 'nl-1', text: 'State and apply Newton\'s First Law (Inertia)' },
            { id: 'nl-2', text: 'Apply Newton\'s Second Law (F = ma)' },
            { id: 'nl-3', text: 'Understand Newton\'s Third Law (action-reaction pairs)' },
            { id: 'nl-4', text: 'Calculate force, mass, and acceleration' },
        ],
        quizQuestions: [
            {
                id: 'nl-q1',
                question: 'Newton\'s First Law states that an object at rest will:',
                options: ['Always accelerate', 'Stay at rest unless acted upon by a force', 'Move in circles', 'Slow down naturally'],
                correctIndex: 1,
                explanation: 'Objects maintain their state of motion unless an unbalanced force acts on them.',
            },
            {
                id: 'nl-q2',
                question: 'According to F = ma, if force doubles and mass stays the same, acceleration will:',
                options: ['Halve', 'Stay the same', 'Double', 'Quadruple'],
                correctIndex: 2,
                explanation: 'F = ma, so if F doubles and m is constant, a must also double.',
            },
            {
                id: 'nl-q3',
                question: 'When you push a wall, the wall pushes back with:',
                options: ['No force', 'Less force', 'Equal and opposite force', 'Greater force'],
                correctIndex: 2,
                explanation: 'Newton\'s Third Law: action and reaction forces are equal and opposite.',
            },
            {
                id: 'nl-q4',
                question: 'A 2 kg object accelerates at 5 m/s². The net force is:',
                options: ['2.5 N', '7 N', '10 N', '0.4 N'],
                correctIndex: 2,
                explanation: 'F = ma = 2 kg × 5 m/s² = 10 N',
            },
        ],
    },
    {
        id: 'thermal-expansion',
        title: 'Thermal Expansion Demo',
        subject: 'physics',
        topic: 'Thermal Physics',
        description: 'Observe how solids, liquids, and gases expand when heated. Explore real-world applications.',
        difficulty: 'easy',
        xpReward: 150,
        estimatedTime: '10-15 mins',
        icon: 'thermometer',
        color: '#FF5722',
        learningObjectives: [
            { id: 'te-1', text: 'Explain thermal expansion in terms of particle motion' },
            { id: 'te-2', text: 'Compare expansion of solids, liquids, and gases' },
            { id: 'te-3', text: 'Identify applications and problems of expansion' },
            { id: 'te-4', text: 'Describe the ball and ring experiment' },
        ],
        quizQuestions: [
            {
                id: 'te-q1',
                question: 'Which state of matter expands the most when heated?',
                options: ['Solid', 'Liquid', 'Gas', 'All expand equally'],
                correctIndex: 2,
                explanation: 'Gases expand the most because particles are free to move apart.',
            },
            {
                id: 'te-q2',
                question: 'Expansion gaps are left in railway tracks to:',
                options: ['Save money', 'Allow for expansion in hot weather', 'Make them easier to repair', 'Reduce noise'],
                correctIndex: 1,
                explanation: 'Without gaps, tracks would buckle when they expand in summer.',
            },
            {
                id: 'te-q3',
                question: 'When heated, particles in a solid:',
                options: ['Move faster and take up more space', 'Move slower', 'Stay the same', 'Disappear'],
                correctIndex: 0,
                explanation: 'Heated particles gain energy, vibrate more, and move further apart.',
            },
            {
                id: 'te-q4',
                question: 'A bimetallic strip bends when heated because:',
                options: ['It melts', 'Both metals expand equally', 'The metals expand by different amounts', 'It contracts'],
                correctIndex: 2,
                explanation: 'Different metals have different expansion rates, causing the strip to curve.',
            },
        ],
    },
    {
        id: 'wave-properties',
        title: 'Wave Properties',
        subject: 'physics',
        topic: 'Waves',
        description: 'Explore transverse and longitudinal waves. Adjust wavelength, frequency, and amplitude.',
        difficulty: 'medium',
        xpReward: 175,
        estimatedTime: '15-20 mins',
        icon: 'pulse',
        color: '#2196F3',
        learningObjectives: [
            { id: 'wp-1', text: 'Distinguish between transverse and longitudinal waves' },
            { id: 'wp-2', text: 'Define wavelength, frequency, amplitude, and period' },
            { id: 'wp-3', text: 'Apply the wave equation v = fλ' },
            { id: 'wp-4', text: 'Give examples of different types of waves' },
        ],
        quizQuestions: [
            {
                id: 'wp-q1',
                question: 'In a transverse wave, particles move:',
                options: ['In the same direction as the wave', 'Perpendicular to the wave direction', 'In circles', 'Not at all'],
                correctIndex: 1,
                explanation: 'Transverse waves have oscillations perpendicular to energy transfer (e.g., light, water waves).',
            },
            {
                id: 'wp-q2',
                question: 'Sound waves are:',
                options: ['Transverse', 'Longitudinal', 'Electromagnetic', 'Static'],
                correctIndex: 1,
                explanation: 'Sound is a longitudinal wave with compressions and rarefactions.',
            },
            {
                id: 'wp-q3',
                question: 'If frequency doubles and speed stays constant, wavelength will:',
                options: ['Double', 'Halve', 'Stay the same', 'Quadruple'],
                correctIndex: 1,
                explanation: 'v = fλ, so if f doubles and v is constant, λ must halve.',
            },
            {
                id: 'wp-q4',
                question: 'The amplitude of a wave measures its:',
                options: ['Speed', 'Frequency', 'Energy/loudness/brightness', 'Wavelength'],
                correctIndex: 2,
                explanation: 'Amplitude relates to energy - larger amplitude means louder sound or brighter light.',
            },
        ],
    },
];

// ============================================
// FOOD TEST DATA
// ============================================

export interface FoodTest {
    id: string;
    name: string;
    reagent: string;
    procedure: string;
    positiveResult: string;
    negativeResult: string;
    detects: string;
    color: string;
}

export const FOOD_TESTS: FoodTest[] = [
    {
        id: 'benedicts',
        name: "Benedict's Test",
        reagent: "Benedict's solution",
        procedure: 'Add sample to Benedict\'s solution and heat in water bath',
        positiveResult: 'Blue → Green → Yellow → Orange → Brick red',
        negativeResult: 'Stays blue',
        detects: 'Reducing sugars (glucose, maltose)',
        color: '#2196F3',
    },
    {
        id: 'iodine',
        name: 'Iodine Test',
        reagent: 'Iodine solution',
        procedure: 'Add a few drops of iodine solution to sample',
        positiveResult: 'Brown → Blue-black',
        negativeResult: 'Stays brown/yellow',
        detects: 'Starch',
        color: '#795548',
    },
    {
        id: 'biuret',
        name: 'Biuret Test',
        reagent: 'Sodium hydroxide + Copper sulfate',
        procedure: 'Add NaOH then CuSO₄ drops',
        positiveResult: 'Blue → Purple/Lilac',
        negativeResult: 'Stays blue',
        detects: 'Proteins',
        color: '#9C27B0',
    },
    {
        id: 'ethanol',
        name: 'Ethanol Emulsion Test',
        reagent: 'Ethanol + Water',
        procedure: 'Dissolve sample in ethanol, add to water',
        positiveResult: 'Cloudy white emulsion',
        negativeResult: 'Solution stays clear',
        detects: 'Fats/Lipids',
        color: '#FFFFFF',
    },
];

export const FOOD_SAMPLES = [
    { id: 'glucose', name: 'Glucose solution', nutrients: ['sugar'] },
    { id: 'starch', name: 'Starch solution', nutrients: ['starch'] },
    { id: 'egg-white', name: 'Egg white', nutrients: ['protein'] },
    { id: 'cooking-oil', name: 'Cooking oil', nutrients: ['fat'] },
    { id: 'milk', name: 'Milk', nutrients: ['protein', 'fat', 'sugar'] },
    { id: 'bread', name: 'Bread', nutrients: ['starch'] },
    { id: 'banana', name: 'Banana', nutrients: ['sugar', 'starch'] },
    { id: 'water', name: 'Distilled water', nutrients: [] },
];

// ============================================
// PH SCALE DATA
// ============================================

export interface Substance {
    id: string;
    name: string;
    ph: number;
    category: 'acid' | 'neutral' | 'alkali';
    color: string;
}

export const PH_SUBSTANCES: Substance[] = [
    { id: 'battery-acid', name: 'Battery acid', ph: 1, category: 'acid', color: '#FF0000' },
    { id: 'lemon-juice', name: 'Lemon juice', ph: 2, category: 'acid', color: '#FF4400' },
    { id: 'vinegar', name: 'Vinegar', ph: 3, category: 'acid', color: '#FF6600' },
    { id: 'tomato', name: 'Tomato juice', ph: 4, category: 'acid', color: '#FF9900' },
    { id: 'black-coffee', name: 'Black coffee', ph: 5, category: 'acid', color: '#FFCC00' },
    { id: 'milk', name: 'Milk', ph: 6, category: 'acid', color: '#DDDD00' },
    { id: 'water', name: 'Pure water', ph: 7, category: 'neutral', color: '#00CC00' },
    { id: 'blood', name: 'Human blood', ph: 7.4, category: 'alkali', color: '#00DDAA' },
    { id: 'baking-soda', name: 'Baking soda', ph: 9, category: 'alkali', color: '#00AAFF' },
    { id: 'milk-of-magnesia', name: 'Milk of magnesia', ph: 10, category: 'alkali', color: '#0066FF' },
    { id: 'ammonia', name: 'Ammonia solution', ph: 11, category: 'alkali', color: '#0033FF' },
    { id: 'bleach', name: 'Household bleach', ph: 13, category: 'alkali', color: '#6600FF' },
];

