import type { Topic } from '../../services/api/quizApi';

export const BIOLOGY_TOPICS_FALLBACK: Topic[] = [
  { id: 'cells', name: 'Cell Structure and Organisation', subject: 'biology' },
  { id: 'transport', name: 'Movement In and Out of Cells', subject: 'biology' },
  { id: 'enzymes', name: 'Enzymes', subject: 'biology' },
  { id: 'plant_nutrition', name: 'Plant Nutrition', subject: 'biology' },
  { id: 'animal_nutrition', name: 'Animal Nutrition', subject: 'biology' },
  { id: 'transport_plants', name: 'Transport in Plants', subject: 'biology' },
  { id: 'transport_animals', name: 'Transport in Animals', subject: 'biology' },
  { id: 'respiration', name: 'Respiration', subject: 'biology' },
  { id: 'excretion', name: 'Excretion in Humans', subject: 'biology' },
  { id: 'coordination', name: 'Coordination and Response', subject: 'biology' },
  { id: 'homeostasis', name: 'Homeostasis', subject: 'biology' },
  { id: 'drugs', name: 'Drugs', subject: 'biology' },
  { id: 'reproduction_plants', name: 'Reproduction in Plants', subject: 'biology' },
  { id: 'reproduction_humans', name: 'Reproduction in Humans', subject: 'biology' },
  { id: 'inheritance', name: 'Inheritance', subject: 'biology' },
  { id: 'ecosystems', name: 'Relationships of Organisms', subject: 'biology' },
  { id: 'environment', name: 'Humans and the Environment', subject: 'biology' },
];

export const CHEMISTRY_TOPICS_FALLBACK: Topic[] = [
  { id: 'matter', name: 'States of Matter', subject: 'chemistry' },
  { id: 'atomic', name: 'Atomic Structure', subject: 'chemistry' },
  { id: 'bonding', name: 'Chemical Bonding', subject: 'chemistry' },
  { id: 'stoichiometry', name: 'Stoichiometry and Mole Concept', subject: 'chemistry' },
  { id: 'electrochemistry', name: 'Electrochemistry', subject: 'chemistry' },
  { id: 'energetics', name: 'Chemical Energetics', subject: 'chemistry' },
  { id: 'kinetics', name: 'Chemical Kinetics', subject: 'chemistry' },
  { id: 'equilibria', name: 'Chemical Equilibria', subject: 'chemistry' },
  { id: 'acids', name: 'Acids, Bases and Salts', subject: 'chemistry' },
  { id: 'periodicity', name: 'The Periodic Table', subject: 'chemistry' },
  { id: 'metals', name: 'Metals', subject: 'chemistry' },
  { id: 'organic', name: 'Organic Chemistry', subject: 'chemistry' },
  { id: 'polymerisation', name: 'Polymers', subject: 'chemistry' },
  { id: 'analysis', name: 'Chemical Analysis', subject: 'chemistry' },
  { id: 'atmosphere', name: 'The Atmosphere and Environment', subject: 'chemistry' },
];

export const PHYSICS_TOPICS_FALLBACK: Topic[] = [
  { id: 'measurements', name: 'General Physics & Measurements', subject: 'physics' },
  { id: 'kinematics', name: 'Kinematics (Motion)', subject: 'physics' },
  { id: 'dynamics', name: 'Dynamics (Forces)', subject: 'physics' },
  { id: 'mass_weight', name: 'Mass, Weight and Density', subject: 'physics' },
  { id: 'turning_effects', name: 'Turning Effects of Forces', subject: 'physics' },
  { id: 'energy', name: 'Work, Energy and Power', subject: 'physics' },
  { id: 'pressure', name: 'Pressure', subject: 'physics' },
  { id: 'thermal', name: 'Thermal Physics', subject: 'physics' },
  { id: 'waves', name: 'Waves (Light & Sound)', subject: 'physics' },
  { id: 'electricity', name: 'Electricity', subject: 'physics' },
  { id: 'magnetism', name: 'Magnetism', subject: 'physics' },
  { id: 'electromagnetism', name: 'Electromagnetism', subject: 'physics' },
  { id: 'electronics', name: 'Introductory Electronics', subject: 'physics' },
  { id: 'nuclear', name: 'Nuclear Physics', subject: 'physics' },
];

export const ENGLISH_TOPICS_FALLBACK: Topic[] = [
  { id: 'grammar', name: 'Grammar Usage and Vocabulary', subject: 'english' },
  { id: 'vocabulary', name: 'Vocabulary', subject: 'english' },
  { id: 'comprehension_skills', name: 'Comprehension Skills', subject: 'english' },
];
