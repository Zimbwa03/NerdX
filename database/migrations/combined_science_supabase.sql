-- =====================================================================
-- COMBINED SCIENCE TOPICAL QUESTIONS FOR SUPABASE
-- Run this script in Supabase SQL Editor
-- Schema: questions table with option_a, option_b, option_c, option_d columns
-- =====================================================================

INSERT INTO questions (question, option_a, option_b, option_c, option_d, answer, explanation, category, subject, topic, difficulty_level, question_type, has_image) VALUES

-- BIOLOGY QUESTIONS (20 questions across 10 topics)

-- Cell Biology
('Which organelle is responsible for controlling cell activities?', 'Mitochondria', 'Nucleus', 'Ribosomes', 'Vacuole', 'B', 'The nucleus contains the cell''s DNA and controls all cellular activities including growth, metabolism, and reproduction.', 'Combined Science', 'Biology', 'Cell Biology', 'easy', 'mcq', false),

('What is the main difference between plant and animal cells?', 'Plant cells have mitochondria', 'Animal cells have a nucleus', 'Plant cells have a cell wall and chloroplasts', 'Animal cells are larger', 'C', 'Plant cells have a rigid cell wall made of cellulose and contain chloroplasts for photosynthesis, which animal cells lack.', 'Combined Science', 'Biology', 'Cell Biology', 'medium', 'mcq', false),

-- Classification
('Which kingdom do bacteria belong to?', 'Plantae', 'Animalia', 'Fungi', 'Monera', 'D', 'Bacteria belong to the kingdom Monera (prokaryotes) as they lack a true nucleus and membrane-bound organelles.', 'Combined Science', 'Biology', 'Classification', 'easy', 'mcq', false),

('What is the correct order of taxonomic hierarchy from largest to smallest?', 'Kingdom, Phylum, Class, Order, Family, Genus, Species', 'Species, Genus, Family, Order, Class, Phylum, Kingdom', 'Kingdom, Class, Phylum, Order, Family, Genus, Species', 'Kingdom, Order, Class, Phylum, Family, Genus, Species', 'A', 'The taxonomic hierarchy from largest to smallest is: Kingdom, Phylum, Class, Order, Family, Genus, Species (King Philip Came Over For Good Soup).', 'Combined Science', 'Biology', 'Classification', 'medium', 'mcq', false),

-- Nutrition
('Which nutrient provides the most energy per gram?', 'Carbohydrates', 'Proteins', 'Fats', 'Vitamins', 'C', 'Fats provide 9 calories per gram, while carbohydrates and proteins provide only 4 calories per gram.', 'Combined Science', 'Biology', 'Nutrition', 'easy', 'mcq', false),

('What is the role of bile in digestion?', 'Breaks down proteins', 'Emulsifies fats', 'Absorbs water', 'Produces enzymes', 'B', 'Bile emulsifies fats, breaking them into smaller droplets to increase surface area for lipase enzyme action.', 'Combined Science', 'Biology', 'Nutrition', 'medium', 'mcq', false),

-- Respiration
('Where does aerobic respiration occur in cells?', 'Nucleus', 'Ribosomes', 'Mitochondria', 'Cytoplasm', 'C', 'Aerobic respiration occurs in the mitochondria, where oxygen is used to break down glucose and produce ATP.', 'Combined Science', 'Biology', 'Respiration', 'easy', 'mcq', false),

('What is the word equation for aerobic respiration?', 'Glucose + Carbon dioxide → Oxygen + Water + Energy', 'Glucose + Oxygen → Carbon dioxide + Water + Energy', 'Oxygen + Water → Glucose + Carbon dioxide + Energy', 'Carbon dioxide + Water → Glucose + Oxygen + Energy', 'B', 'The word equation for aerobic respiration is: Glucose + Oxygen → Carbon dioxide + Water + Energy (ATP).', 'Combined Science', 'Biology', 'Respiration', 'medium', 'mcq', false),

-- Transport
('Which blood vessels carry blood away from the heart?', 'Veins', 'Arteries', 'Capillaries', 'Venules', 'B', 'Arteries carry oxygenated blood away from the heart to body tissues (except pulmonary artery).', 'Combined Science', 'Biology', 'Transport', 'easy', 'mcq', false),

('What is the function of red blood cells?', 'Fight infections', 'Transport oxygen', 'Clot blood', 'Produce antibodies', 'B', 'Red blood cells contain haemoglobin which binds to oxygen in the lungs and transports it to body tissues.', 'Combined Science', 'Biology', 'Transport', 'medium', 'mcq', false),

-- Excretion
('Which organ is the main site of excretion in humans?', 'Liver', 'Lungs', 'Kidneys', 'Skin', 'C', 'The kidneys are the main excretory organs, filtering waste products from blood to form urine.', 'Combined Science', 'Biology', 'Excretion', 'easy', 'mcq', false),

('What waste product is produced by the breakdown of amino acids?', 'Carbon dioxide', 'Urea', 'Lactic acid', 'Ammonia', 'B', 'Urea is produced in the liver from the breakdown of amino acids and is excreted by the kidneys.', 'Combined Science', 'Biology', 'Excretion', 'medium', 'mcq', false),

-- Reproduction
('What type of reproduction involves only one parent?', 'Sexual reproduction', 'Asexual reproduction', 'Binary fission', 'Fertilization', 'B', 'Asexual reproduction involves only one parent and produces genetically identical offspring.', 'Combined Science', 'Biology', 'Reproduction', 'easy', 'mcq', false),

('Where does fertilization occur in flowering plants?', 'Anther', 'Stigma', 'Ovary', 'Petal', 'C', 'Fertilization occurs in the ovary where the male gamete fuses with the female gamete (ovule).', 'Combined Science', 'Biology', 'Reproduction', 'medium', 'mcq', false),

-- Genetics
('What does DNA stand for?', 'Deoxyribonucleic acid', 'Dinitrogen acid', 'Double nuclear acid', 'Dynamic nucleic acid', 'A', 'DNA stands for Deoxyribonucleic acid, which carries genetic information in all living organisms.', 'Combined Science', 'Biology', 'Genetics', 'easy', 'mcq', false),

('If both parents are heterozygous for a trait (Tt), what percentage of offspring will be homozygous recessive?', '0%', '25%', '50%', '75%', 'B', 'In a Tt × Tt cross, the offspring ratio is 1 TT : 2 Tt : 1 tt, so 25% are homozygous recessive (tt).', 'Combined Science', 'Biology', 'Genetics', 'medium', 'mcq', false),

-- Evolution
('Who proposed the theory of evolution by natural selection?', 'Gregor Mendel', 'Charles Darwin', 'Louis Pasteur', 'Alexander Fleming', 'B', 'Charles Darwin proposed the theory of evolution by natural selection in his book "On the Origin of Species".', 'Combined Science', 'Biology', 'Evolution', 'easy', 'mcq', false),

('What is natural selection?', 'Random changes in genes', 'Survival of the fittest organisms', 'Artificial breeding', 'Genetic engineering', 'B', 'Natural selection is the process where organisms with advantageous traits are more likely to survive and reproduce.', 'Combined Science', 'Biology', 'Evolution', 'medium', 'mcq', false),

-- Coordination
('Which part of the nervous system includes the brain and spinal cord?', 'Peripheral nervous system', 'Central nervous system', 'Autonomic nervous system', 'Sensory nervous system', 'B', 'The central nervous system (CNS) consists of the brain and spinal cord, which process and coordinate information.', 'Combined Science', 'Biology', 'Coordination', 'easy', 'mcq', false),

('What is a hormone?', 'A type of enzyme', 'A chemical messenger', 'A type of cell', 'A waste product', 'B', 'Hormones are chemical messengers produced by endocrine glands that regulate body functions.', 'Combined Science', 'Biology', 'Coordination', 'medium', 'mcq', false),

-- CHEMISTRY QUESTIONS (18 questions across 9 topics)

-- Atomic Structure
('What is the smallest particle of an element that retains its properties?', 'Molecule', 'Atom', 'Ion', 'Compound', 'B', 'An atom is the smallest particle of an element that still retains the chemical properties of that element.', 'Combined Science', 'Chemistry', 'Atomic Structure', 'easy', 'mcq', false),

('How many electrons does a neutral atom of carbon have? (Carbon has atomic number 6)', '4', '6', '8', '12', 'B', 'A neutral atom has equal numbers of protons and electrons. Carbon has atomic number 6, so it has 6 electrons.', 'Combined Science', 'Chemistry', 'Atomic Structure', 'medium', 'mcq', false),

-- Chemical Bonding
('What type of bond forms between a metal and a non-metal?', 'Covalent bond', 'Ionic bond', 'Metallic bond', 'Hydrogen bond', 'B', 'Ionic bonds form between metals (which lose electrons) and non-metals (which gain electrons).', 'Combined Science', 'Chemistry', 'Chemical Bonding', 'easy', 'mcq', false),

('How many electrons are shared in a double covalent bond?', '2', '4', '6', '8', 'B', 'A double covalent bond involves the sharing of 4 electrons (2 pairs) between two atoms.', 'Combined Science', 'Chemistry', 'Chemical Bonding', 'medium', 'mcq', false),

-- States of Matter
('What happens to particles when a solid melts?', 'They stop moving', 'They move faster', 'They disappear', 'They change color', 'B', 'When a solid melts, the particles gain energy and move faster, allowing them to flow as a liquid.', 'Combined Science', 'Chemistry', 'States of Matter', 'easy', 'mcq', false),

('Which process involves a gas changing directly to a solid without becoming a liquid?', 'Condensation', 'Evaporation', 'Sublimation', 'Deposition', 'D', 'Deposition is the process where a gas changes directly to a solid without passing through the liquid state.', 'Combined Science', 'Chemistry', 'States of Matter', 'medium', 'mcq', false),

-- Acids and Bases
('What is the pH of a neutral solution?', '0', '7', '14', '1', 'B', 'A neutral solution has a pH of 7, which means it is neither acidic nor basic.', 'Combined Science', 'Chemistry', 'Acids and Bases', 'easy', 'mcq', false),

('What is produced when an acid reacts with a base?', 'Salt and water', 'Gas and water', 'Salt and gas', 'Water only', 'A', 'When an acid reacts with a base, neutralization occurs producing salt and water (acid + base → salt + water).', 'Combined Science', 'Chemistry', 'Acids and Bases', 'medium', 'mcq', false),

-- Chemical Reactions
('What type of reaction is represented by: A + B → AB?', 'Decomposition', 'Synthesis', 'Displacement', 'Combustion', 'B', 'A synthesis reaction involves two or more reactants combining to form a single product (A + B → AB).', 'Combined Science', 'Chemistry', 'Chemical Reactions', 'easy', 'mcq', false),

('What is a catalyst?', 'A substance that slows down reactions', 'A substance that speeds up reactions without being consumed', 'A reactant in a chemical reaction', 'A product of a chemical reaction', 'B', 'A catalyst speeds up chemical reactions by lowering activation energy but is not consumed in the reaction.', 'Combined Science', 'Chemistry', 'Chemical Reactions', 'medium', 'mcq', false),

-- The Periodic Table
('Elements in the same group of the periodic table have the same number of:', 'Protons', 'Neutrons', 'Valence electrons', 'Energy levels', 'C', 'Elements in the same group have the same number of valence electrons, giving them similar chemical properties.', 'Combined Science', 'Chemistry', 'The Periodic Table', 'easy', 'mcq', false),

('Which group contains the noble gases?', 'Group 1', 'Group 7', 'Group 0', 'Group 2', 'C', 'Group 0 (or Group 18) contains the noble gases, which have complete outer electron shells.', 'Combined Science', 'Chemistry', 'The Periodic Table', 'medium', 'mcq', false),

-- Metals and Non-metals
('Which property is typical of metals?', 'Brittle', 'Good electrical conductor', 'Dull appearance', 'Low density', 'B', 'Metals are good electrical conductors due to their mobile electrons.', 'Combined Science', 'Chemistry', 'Metals and Non-metals', 'easy', 'mcq', false),

('What is produced when a metal reacts with oxygen?', 'Metal hydroxide', 'Metal oxide', 'Metal carbonate', 'Metal sulphate', 'B', 'When metals react with oxygen, they form metal oxides (e.g., 2Mg + O₂ → 2MgO).', 'Combined Science', 'Chemistry', 'Metals and Non-metals', 'medium', 'mcq', false),

-- Organic Chemistry
('What is the main element in all organic compounds?', 'Oxygen', 'Hydrogen', 'Carbon', 'Nitrogen', 'C', 'Carbon is the main element in all organic compounds, forming the backbone of organic molecules.', 'Combined Science', 'Chemistry', 'Organic Chemistry', 'easy', 'mcq', false),

('What is the general formula for alkanes?', 'CnH2n', 'CnH2n+2', 'CnH2n-2', 'CnHn', 'B', 'The general formula for alkanes (saturated hydrocarbons) is CnH2n+2.', 'Combined Science', 'Chemistry', 'Organic Chemistry', 'medium', 'mcq', false),

-- Water
('What is the chemical formula for water?', 'H2O', 'H2O2', 'HO', 'H3O', 'A', 'Water has the chemical formula H₂O, consisting of two hydrogen atoms and one oxygen atom.', 'Combined Science', 'Chemistry', 'Water', 'easy', 'mcq', false),

('What causes water to have a high boiling point?', 'Ionic bonding', 'Covalent bonding', 'Hydrogen bonding', 'Metallic bonding', 'C', 'Water has a high boiling point due to hydrogen bonding between water molecules.', 'Combined Science', 'Chemistry', 'Water', 'medium', 'mcq', false),

-- PHYSICS QUESTIONS (14 questions across 7 topics)

-- Motion
('What is the SI unit for velocity?', 'm/s', 'm/s²', 'm', 's', 'A', 'The SI unit for velocity is metres per second (m/s).', 'Combined Science', 'Physics', 'Motion', 'easy', 'mcq', false),

('A car travels 100m in 5 seconds. What is its average speed?', '20 m/s', '500 m/s', '0.05 m/s', '105 m/s', 'A', 'Average speed = distance ÷ time = 100m ÷ 5s = 20 m/s.', 'Combined Science', 'Physics', 'Motion', 'medium', 'mcq', false),

-- Forces
('What is the SI unit for force?', 'Joule', 'Newton', 'Watt', 'Pascal', 'B', 'The SI unit for force is the Newton (N), named after Sir Isaac Newton.', 'Combined Science', 'Physics', 'Forces', 'easy', 'mcq', false),

('According to Newton''s first law, an object at rest will:', 'Start moving', 'Remain at rest unless acted upon by an unbalanced force', 'Accelerate', 'Decelerate', 'B', 'Newton''s first law states that objects at rest remain at rest unless acted upon by an unbalanced force.', 'Combined Science', 'Physics', 'Forces', 'medium', 'mcq', false),

-- Energy
('What is the SI unit for energy?', 'Newton', 'Watt', 'Joule', 'Pascal', 'C', 'The SI unit for energy is the Joule (J).', 'Combined Science', 'Physics', 'Energy', 'easy', 'mcq', false),

('What type of energy does a moving object possess?', 'Potential energy', 'Kinetic energy', 'Chemical energy', 'Nuclear energy', 'B', 'A moving object possesses kinetic energy, which depends on its mass and velocity.', 'Combined Science', 'Physics', 'Energy', 'medium', 'mcq', false),

-- Heat
('Heat flows from:', 'Cold to hot objects', 'Hot to cold objects', 'Objects of equal temperature', 'Small to large objects', 'B', 'Heat always flows from hot objects to cold objects until thermal equilibrium is reached.', 'Combined Science', 'Physics', 'Heat', 'easy', 'mcq', false),

('What is the main method of heat transfer in liquids?', 'Conduction', 'Convection', 'Radiation', 'Evaporation', 'B', 'Convection is the main method of heat transfer in liquids and gases, involving the movement of heated particles.', 'Combined Science', 'Physics', 'Heat', 'medium', 'mcq', false),

-- Light
('Light travels in:', 'Curved lines', 'Straight lines', 'Circular paths', 'Random directions', 'B', 'Light travels in straight lines, which is why we see sharp shadows.', 'Combined Science', 'Physics', 'Light', 'easy', 'mcq', false),

('What happens when light passes from air into water?', 'It speeds up', 'It slows down', 'Its speed remains constant', 'It stops', 'B', 'Light slows down when it passes from air into water because water is denser than air.', 'Combined Science', 'Physics', 'Light', 'medium', 'mcq', false),

-- Sound
('Sound waves are:', 'Transverse waves', 'Longitudinal waves', 'Electromagnetic waves', 'Light waves', 'B', 'Sound waves are longitudinal waves where particles vibrate parallel to the direction of wave propagation.', 'Combined Science', 'Physics', 'Sound', 'easy', 'mcq', false),

('What determines the pitch of a sound?', 'Amplitude', 'Frequency', 'Wavelength', 'Speed', 'B', 'The pitch of a sound is determined by its frequency - higher frequency produces higher pitch.', 'Combined Science', 'Physics', 'Sound', 'medium', 'mcq', false),

-- Electricity
('What is the SI unit for electric current?', 'Volt', 'Ampere', 'Ohm', 'Watt', 'B', 'The SI unit for electric current is the Ampere (A).', 'Combined Science', 'Physics', 'Electricity', 'easy', 'mcq', false),

('According to Ohm''s law, what is the relationship between voltage, current, and resistance?', 'V = I × R', 'V = I ÷ R', 'V = I + R', 'V = I - R', 'A', 'Ohm''s law states that voltage equals current multiplied by resistance (V = I × R).', 'Combined Science', 'Physics', 'Electricity', 'medium', 'mcq', false);

-- =====================================================================
-- SUMMARY: 52 Combined Science Questions Added
-- Biology: 20 questions (10 topics, 2 questions each)
-- Chemistry: 18 questions (9 topics, 2 questions each)  
-- Physics: 14 questions (7 topics, 2 questions each)
-- All questions formatted for schema with option_a, option_b, option_c, option_d
-- =====================================================================