-- =====================================================================
-- COMBINED SCIENCE TOPICAL QUESTIONS FOR SUPABASE
-- Run this script in Supabase SQL Editor
-- =====================================================================

INSERT INTO questions (subject, topic, difficulty, question_type, question_text, options, correct_answer, solution, points, source) VALUES

-- BIOLOGY QUESTIONS
-- Cell Biology
('Biology', 'Cell Biology', 'easy', 'mcq', 
'Which organelle is responsible for controlling cell activities?',
'{"A": "Mitochondria", "B": "Nucleus", "C": "Ribosomes", "D": "Vacuole"}',
'B',
'The nucleus contains the cell''s DNA and controls all cellular activities including growth, metabolism, and reproduction.',
10, 'database'),

('Biology', 'Cell Biology', 'medium', 'mcq',
'What is the main difference between plant and animal cells?',
'{"A": "Plant cells have mitochondria", "B": "Animal cells have a nucleus", "C": "Plant cells have a cell wall and chloroplasts", "D": "Animal cells are larger"}',
'C',
'Plant cells have a rigid cell wall made of cellulose and contain chloroplasts for photosynthesis, which animal cells lack.',
15, 'database'),

-- Classification
('Biology', 'Classification', 'easy', 'mcq',
'Which kingdom do bacteria belong to?',
'{"A": "Plantae", "B": "Animalia", "C": "Fungi", "D": "Monera"}',
'D',
'Bacteria belong to the kingdom Monera (prokaryotes) as they lack a true nucleus and membrane-bound organelles.',
10, 'database'),

('Biology', 'Classification', 'medium', 'mcq',
'What is the correct order of taxonomic hierarchy from largest to smallest?',
'{"A": "Kingdom, Phylum, Class, Order, Family, Genus, Species", "B": "Species, Genus, Family, Order, Class, Phylum, Kingdom", "C": "Kingdom, Class, Phylum, Order, Family, Genus, Species", "D": "Kingdom, Order, Class, Phylum, Family, Genus, Species"}',
'A',
'The taxonomic hierarchy from largest to smallest is: Kingdom, Phylum, Class, Order, Family, Genus, Species (King Philip Came Over For Good Soup).',
15, 'database'),

-- Nutrition
('Biology', 'Nutrition', 'easy', 'mcq',
'Which nutrient provides the most energy per gram?',
'{"A": "Carbohydrates", "B": "Proteins", "C": "Fats", "D": "Vitamins"}',
'C',
'Fats provide 9 calories per gram, while carbohydrates and proteins provide only 4 calories per gram.',
10, 'database'),

('Biology', 'Nutrition', 'medium', 'mcq',
'What is the role of bile in digestion?',
'{"A": "Breaks down proteins", "B": "Emulsifies fats", "C": "Absorbs water", "D": "Produces enzymes"}',
'B',
'Bile emulsifies fats, breaking them into smaller droplets to increase surface area for lipase enzyme action.',
15, 'database'),

-- Respiration
('Biology', 'Respiration', 'easy', 'mcq',
'Where does aerobic respiration occur in cells?',
'{"A": "Nucleus", "B": "Ribosomes", "C": "Mitochondria", "D": "Cytoplasm"}',
'C',
'Aerobic respiration occurs in the mitochondria, where oxygen is used to break down glucose and produce ATP.',
10, 'database'),

('Biology', 'Respiration', 'medium', 'mcq',
'What is the word equation for aerobic respiration?',
'{"A": "Glucose + Carbon dioxide → Oxygen + Water + Energy", "B": "Glucose + Oxygen → Carbon dioxide + Water + Energy", "C": "Oxygen + Water → Glucose + Carbon dioxide + Energy", "D": "Carbon dioxide + Water → Glucose + Oxygen + Energy"}',
'B',
'The word equation for aerobic respiration is: Glucose + Oxygen → Carbon dioxide + Water + Energy (ATP).',
15, 'database'),

-- Transport
('Biology', 'Transport', 'easy', 'mcq',
'Which blood vessels carry blood away from the heart?',
'{"A": "Veins", "B": "Arteries", "C": "Capillaries", "D": "Venules"}',
'B',
'Arteries carry oxygenated blood away from the heart to body tissues (except pulmonary artery).',
10, 'database'),

('Biology', 'Transport', 'medium', 'mcq',
'What is the function of red blood cells?',
'{"A": "Fight infections", "B": "Transport oxygen", "C": "Clot blood", "D": "Produce antibodies"}',
'B',
'Red blood cells contain haemoglobin which binds to oxygen in the lungs and transports it to body tissues.',
15, 'database'),

-- Excretion
('Biology', 'Excretion', 'easy', 'mcq',
'Which organ is the main site of excretion in humans?',
'{"A": "Liver", "B": "Lungs", "C": "Kidneys", "D": "Skin"}',
'C',
'The kidneys are the main excretory organs, filtering waste products from blood to form urine.',
10, 'database'),

('Biology', 'Excretion', 'medium', 'mcq',
'What waste product is produced by the breakdown of amino acids?',
'{"A": "Carbon dioxide", "B": "Urea", "C": "Lactic acid", "D": "Ammonia"}',
'B',
'Urea is produced in the liver from the breakdown of amino acids and is excreted by the kidneys.',
15, 'database'),

-- Reproduction
('Biology', 'Reproduction', 'easy', 'mcq',
'What type of reproduction involves only one parent?',
'{"A": "Sexual reproduction", "B": "Asexual reproduction", "C": "Binary fission", "D": "Fertilization"}',
'B',
'Asexual reproduction involves only one parent and produces genetically identical offspring.',
10, 'database'),

('Biology', 'Reproduction', 'medium', 'mcq',
'Where does fertilization occur in flowering plants?',
'{"A": "Anther", "B": "Stigma", "C": "Ovary", "D": "Petal"}',
'C',
'Fertilization occurs in the ovary where the male gamete fuses with the female gamete (ovule).',
15, 'database'),

-- Genetics
('Biology', 'Genetics', 'easy', 'mcq',
'What does DNA stand for?',
'{"A": "Deoxyribonucleic acid", "B": "Dinitrogen acid", "C": "Double nuclear acid", "D": "Dynamic nucleic acid"}',
'A',
'DNA stands for Deoxyribonucleic acid, which carries genetic information in all living organisms.',
10, 'database'),

('Biology', 'Genetics', 'medium', 'mcq',
'If both parents are heterozygous for a trait (Tt), what percentage of offspring will be homozygous recessive?',
'{"A": "0%", "B": "25%", "C": "50%", "D": "75%"}',
'B',
'In a Tt × Tt cross, the offspring ratio is 1 TT : 2 Tt : 1 tt, so 25% are homozygous recessive (tt).',
20, 'database'),

-- Evolution
('Biology', 'Evolution', 'easy', 'mcq',
'Who proposed the theory of evolution by natural selection?',
'{"A": "Gregor Mendel", "B": "Charles Darwin", "C": "Louis Pasteur", "D": "Alexander Fleming"}',
'B',
'Charles Darwin proposed the theory of evolution by natural selection in his book "On the Origin of Species".',
10, 'database'),

('Biology', 'Evolution', 'medium', 'mcq',
'What is natural selection?',
'{"A": "Random changes in genes", "B": "Survival of the fittest organisms", "C": "Artificial breeding", "D": "Genetic engineering"}',
'B',
'Natural selection is the process where organisms with advantageous traits are more likely to survive and reproduce.',
15, 'database'),

-- Coordination
('Biology', 'Coordination', 'easy', 'mcq',
'Which part of the nervous system includes the brain and spinal cord?',
'{"A": "Peripheral nervous system", "B": "Central nervous system", "C": "Autonomic nervous system", "D": "Sensory nervous system"}',
'B',
'The central nervous system (CNS) consists of the brain and spinal cord, which process and coordinate information.',
10, 'database'),

('Biology', 'Coordination', 'medium', 'mcq',
'What is a hormone?',
'{"A": "A type of enzyme", "B": "A chemical messenger", "C": "A type of cell", "D": "A waste product"}',
'B',
'Hormones are chemical messengers produced by endocrine glands that regulate body functions.',
15, 'database'),

-- CHEMISTRY QUESTIONS
-- Atomic Structure
('Chemistry', 'Atomic Structure', 'easy', 'mcq',
'What is the smallest particle of an element that retains its properties?',
'{"A": "Molecule", "B": "Atom", "C": "Ion", "D": "Compound"}',
'B',
'An atom is the smallest particle of an element that still retains the chemical properties of that element.',
10, 'database'),

('Chemistry', 'Atomic Structure', 'medium', 'mcq',
'How many electrons does a neutral atom of carbon have? (Carbon has atomic number 6)',
'{"A": "4", "B": "6", "C": "8", "D": "12"}',
'B',
'A neutral atom has equal numbers of protons and electrons. Carbon has atomic number 6, so it has 6 electrons.',
15, 'database'),

-- Chemical Bonding
('Chemistry', 'Chemical Bonding', 'easy', 'mcq',
'What type of bond forms between a metal and a non-metal?',
'{"A": "Covalent bond", "B": "Ionic bond", "C": "Metallic bond", "D": "Hydrogen bond"}',
'B',
'Ionic bonds form between metals (which lose electrons) and non-metals (which gain electrons).',
10, 'database'),

('Chemistry', 'Chemical Bonding', 'medium', 'mcq',
'How many electrons are shared in a double covalent bond?',
'{"A": "2", "B": "4", "C": "6", "D": "8"}',
'B',
'A double covalent bond involves the sharing of 4 electrons (2 pairs) between two atoms.',
15, 'database'),

-- States of Matter
('Chemistry', 'States of Matter', 'easy', 'mcq',
'What happens to particles when a solid melts?',
'{"A": "They stop moving", "B": "They move faster", "C": "They disappear", "D": "They change color"}',
'B',
'When a solid melts, the particles gain energy and move faster, allowing them to flow as a liquid.',
10, 'database'),

('Chemistry', 'States of Matter', 'medium', 'mcq',
'Which process involves a gas changing directly to a solid without becoming a liquid?',
'{"A": "Condensation", "B": "Evaporation", "C": "Sublimation", "D": "Deposition"}',
'D',
'Deposition is the process where a gas changes directly to a solid without passing through the liquid state.',
15, 'database'),

-- Acids and Bases
('Chemistry', 'Acids and Bases', 'easy', 'mcq',
'What is the pH of a neutral solution?',
'{"A": "0", "B": "7", "C": "14", "D": "1"}',
'B',
'A neutral solution has a pH of 7, which means it is neither acidic nor basic.',
10, 'database'),

('Chemistry', 'Acids and Bases', 'medium', 'mcq',
'What is produced when an acid reacts with a base?',
'{"A": "Salt and water", "B": "Gas and water", "C": "Salt and gas", "D": "Water only"}',
'A',
'When an acid reacts with a base, neutralization occurs producing salt and water (acid + base → salt + water).',
15, 'database'),

-- Chemical Reactions
('Chemistry', 'Chemical Reactions', 'easy', 'mcq',
'What type of reaction is represented by: A + B → AB?',
'{"A": "Decomposition", "B": "Synthesis", "C": "Displacement", "D": "Combustion"}',
'B',
'A synthesis reaction involves two or more reactants combining to form a single product (A + B → AB).',
10, 'database'),

('Chemistry', 'Chemical Reactions', 'medium', 'mcq',
'What is a catalyst?',
'{"A": "A substance that slows down reactions", "B": "A substance that speeds up reactions without being consumed", "C": "A reactant in a chemical reaction", "D": "A product of a chemical reaction"}',
'B',
'A catalyst speeds up chemical reactions by lowering activation energy but is not consumed in the reaction.',
15, 'database'),

-- The Periodic Table
('Chemistry', 'The Periodic Table', 'easy', 'mcq',
'Elements in the same group of the periodic table have the same number of:',
'{"A": "Protons", "B": "Neutrons", "C": "Valence electrons", "D": "Energy levels"}',
'C',
'Elements in the same group have the same number of valence electrons, giving them similar chemical properties.',
10, 'database'),

('Chemistry', 'The Periodic Table', 'medium', 'mcq',
'Which group contains the noble gases?',
'{"A": "Group 1", "B": "Group 7", "C": "Group 0", "D": "Group 2"}',
'C',
'Group 0 (or Group 18) contains the noble gases, which have complete outer electron shells.',
15, 'database'),

-- Metals and Non-metals
('Chemistry', 'Metals and Non-metals', 'easy', 'mcq',
'Which property is typical of metals?',
'{"A": "Brittle", "B": "Good electrical conductor", "C": "Dull appearance", "D": "Low density"}',
'B',
'Metals are good electrical conductors due to their mobile electrons.',
10, 'database'),

('Chemistry', 'Metals and Non-metals', 'medium', 'mcq',
'What is produced when a metal reacts with oxygen?',
'{"A": "Metal hydroxide", "B": "Metal oxide", "C": "Metal carbonate", "D": "Metal sulphate"}',
'B',
'When metals react with oxygen, they form metal oxides (e.g., 2Mg + O₂ → 2MgO).',
15, 'database'),

-- Organic Chemistry
('Chemistry', 'Organic Chemistry', 'easy', 'mcq',
'What is the main element in all organic compounds?',
'{"A": "Oxygen", "B": "Hydrogen", "C": "Carbon", "D": "Nitrogen"}',
'C',
'Carbon is the main element in all organic compounds, forming the backbone of organic molecules.',
10, 'database'),

('Chemistry', 'Organic Chemistry', 'medium', 'mcq',
'What is the general formula for alkanes?',
'{"A": "CnH2n", "B": "CnH2n+2", "C": "CnH2n-2", "D": "CnHn"}',
'B',
'The general formula for alkanes (saturated hydrocarbons) is CnH2n+2.',
15, 'database'),

-- Water
('Chemistry', 'Water', 'easy', 'mcq',
'What is the chemical formula for water?',
'{"A": "H2O", "B": "H2O2", "C": "HO", "D": "H3O"}',
'A',
'Water has the chemical formula H₂O, consisting of two hydrogen atoms and one oxygen atom.',
10, 'database'),

('Chemistry', 'Water', 'medium', 'mcq',
'What causes water to have a high boiling point?',
'{"A": "Ionic bonding", "B": "Covalent bonding", "C": "Hydrogen bonding", "D": "Metallic bonding"}',
'C',
'Water has a high boiling point due to hydrogen bonding between water molecules.',
15, 'database'),

-- PHYSICS QUESTIONS
-- Motion
('Physics', 'Motion', 'easy', 'mcq',
'What is the SI unit for velocity?',
'{"A": "m/s", "B": "m/s²", "C": "m", "D": "s"}',
'A',
'The SI unit for velocity is metres per second (m/s).',
10, 'database'),

('Physics', 'Motion', 'medium', 'mcq',
'A car travels 100m in 5 seconds. What is its average speed?',
'{"A": "20 m/s", "B": "500 m/s", "C": "0.05 m/s", "D": "105 m/s"}',
'A',
'Average speed = distance ÷ time = 100m ÷ 5s = 20 m/s.',
15, 'database'),

-- Forces
('Physics', 'Forces', 'easy', 'mcq',
'What is the SI unit for force?',
'{"A": "Joule", "B": "Newton", "C": "Watt", "D": "Pascal"}',
'B',
'The SI unit for force is the Newton (N), named after Sir Isaac Newton.',
10, 'database'),

('Physics', 'Forces', 'medium', 'mcq',
'According to Newton''s first law, an object at rest will:',
'{"A": "Start moving", "B": "Remain at rest unless acted upon by an unbalanced force", "C": "Accelerate", "D": "Decelerate"}',
'B',
'Newton''s first law states that objects at rest remain at rest unless acted upon by an unbalanced force.',
15, 'database'),

-- Energy
('Physics', 'Energy', 'easy', 'mcq',
'What is the SI unit for energy?',
'{"A": "Newton", "B": "Watt", "C": "Joule", "D": "Pascal"}',
'C',
'The SI unit for energy is the Joule (J).',
10, 'database'),

('Physics', 'Energy', 'medium', 'mcq',
'What type of energy does a moving object possess?',
'{"A": "Potential energy", "B": "Kinetic energy", "C": "Chemical energy", "D": "Nuclear energy"}',
'B',
'A moving object possesses kinetic energy, which depends on its mass and velocity.',
15, 'database'),

-- Heat
('Physics', 'Heat', 'easy', 'mcq',
'Heat flows from:',
'{"A": "Cold to hot objects", "B": "Hot to cold objects", "C": "Objects of equal temperature", "D": "Small to large objects"}',
'B',
'Heat always flows from hot objects to cold objects until thermal equilibrium is reached.',
10, 'database'),

('Physics', 'Heat', 'medium', 'mcq',
'What is the main method of heat transfer in liquids?',
'{"A": "Conduction", "B": "Convection", "C": "Radiation", "D": "Evaporation"}',
'B',
'Convection is the main method of heat transfer in liquids and gases, involving the movement of heated particles.',
15, 'database'),

-- Light
('Physics', 'Light', 'easy', 'mcq',
'Light travels in:',
'{"A": "Curved lines", "B": "Straight lines", "C": "Circular paths", "D": "Random directions"}',
'B',
'Light travels in straight lines, which is why we see sharp shadows.',
10, 'database'),

('Physics', 'Light', 'medium', 'mcq',
'What happens when light passes from air into water?',
'{"A": "It speeds up", "B": "It slows down", "C": "Its speed remains constant", "D": "It stops"}',
'B',
'Light slows down when it passes from air into water because water is denser than air.',
15, 'database'),

-- Sound
('Physics', 'Sound', 'easy', 'mcq',
'Sound waves are:',
'{"A": "Transverse waves", "B": "Longitudinal waves", "C": "Electromagnetic waves", "D": "Light waves"}',
'B',
'Sound waves are longitudinal waves where particles vibrate parallel to the direction of wave propagation.',
10, 'database'),

('Physics', 'Sound', 'medium', 'mcq',
'What determines the pitch of a sound?',
'{"A": "Amplitude", "B": "Frequency", "C": "Wavelength", "D": "Speed"}',
'B',
'The pitch of a sound is determined by its frequency - higher frequency produces higher pitch.',
15, 'database'),

-- Electricity
('Physics', 'Electricity', 'easy', 'mcq',
'What is the SI unit for electric current?',
'{"A": "Volt", "B": "Ampere", "C": "Ohm", "D": "Watt"}',
'B',
'The SI unit for electric current is the Ampere (A).',
10, 'database'),

('Physics', 'Electricity', 'medium', 'mcq',
'According to Ohm''s law, what is the relationship between voltage, current, and resistance?',
'{"A": "V = I × R", "B": "V = I ÷ R", "C": "V = I + R", "D": "V = I - R"}',
'A',
'Ohm''s law states that voltage equals current multiplied by resistance (V = I × R).',
15, 'database');

-- =====================================================================
-- SUMMARY: 52 Combined Science Questions Added
-- Biology: 20 questions (10 topics, 2 questions each)
-- Chemistry: 18 questions (9 topics, 2 questions each)  
-- Physics: 14 questions (7 topics, 2 questions each)
-- =====================================================================