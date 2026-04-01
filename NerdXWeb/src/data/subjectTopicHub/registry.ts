import type { Subject } from '../virtualLab/simulationTypes';
import type { Topic } from '../../services/api/quizApi';
import { oLevelGeographyTopics } from '../oLevelGeography';
import { commerceTopics } from '../oLevelCommerce';
import { oLevelBESTopics } from '../oLevelBES/topics';
import { historyTopicsForQuiz } from '../historyNotes';
import { accountingTopics } from '../accounting/topics';
import {
  aLevelBiologyTopics,
  getTopicById as getALevelBiologyTopicById,
} from '../aLevelBiology';
import { aLevelChemistryTopics } from '../aLevelChemistry';
import { aLevelPhysicsTopics } from '../aLevelPhysics';
import { aLevelGeographyTopics } from '../aLevelGeography';
import { aLevelComputerScienceTopics } from '../aLevelComputerScience';
import { aLevelPureMathTopics } from '../aLevelPureMath/topics';
import { getTopicById as getHistoryTopicMeta } from '../historyNotes';
import {
  BIOLOGY_TOPICS_FALLBACK,
  CHEMISTRY_TOPICS_FALLBACK,
  PHYSICS_TOPICS_FALLBACK,
  ENGLISH_TOPICS_FALLBACK,
} from './quizTopicFallbacks';
import { CS_TOPICS_FALLBACK } from './computerScienceFallback';

export type HubQuizKind =
  | 'o_science'
  | 'o_quiz'
  | 'o_cs'
  | 'english'
  | 'history_essay'
  | 'a_biology'
  | 'a_stem'
  | 'a_geography'
  | 'a_cs'
  | 'a_pure_math';

export type PracticeFormat = 'mcq' | 'structured' | 'essay';

export interface SubjectHubConfig {
  segment: string;
  quizSubjectId: string;
  subjectInfo: { id: string; name: string; color: string };
  universeClass: string;
  listPath: string;
  examKey: string;
  examLabel: string;
  tutorSubject: string;
  tutorCardTitle: string;
  tutorGrade: string;
  maicGrade: string;
  labSubject: Subject | null;
  labBrowseKey: string;
  quizKind: HubQuizKind;
  parentForScienceQuiz?: string;
  aStemParent?: string;
  fetchTopicsFromApi: boolean;
  /** When true, getTopics includes board (O-Level / A-Level CS). */
  apiUsesBoard?: boolean;
  getStaticTopics: () => Topic[];
  notesPath: (topic: Topic) => string | null;
  topicDescription: (topic: Topic) => string;
  practiceFormats: PracticeFormat[];
  /** English only: topical vs exam in one modal */
  englishModes?: boolean;
}

function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const geoTopics = (): Topic[] =>
  oLevelGeographyTopics.map((t) => ({ id: t.id, name: t.name, subject: 'geography' }));

const commerceTopicsList = (): Topic[] =>
  commerceTopics.map((t) => ({ id: t.id, name: t.name, subject: 'commerce' }));

const besTopicsList = (): Topic[] =>
  oLevelBESTopics.map((t) => ({
    id: t.id,
    name: t.name,
    subject: 'business_enterprise_skills',
  }));

const accountingList = (): Topic[] =>
  accountingTopics.map((t) => ({ id: t.id, name: t.name, subject: 'accounting' }));

const aBioList = (): Topic[] =>
  aLevelBiologyTopics.map((t) => ({
    id: t.id,
    name: t.name,
    subject: 'a_level_biology',
  }));

const aChemList = (): Topic[] =>
  aLevelChemistryTopics.map((t) => ({
    id: t.id,
    name: t.name,
    subject: 'a_level_chemistry',
  }));

const aPhysList = (): Topic[] =>
  aLevelPhysicsTopics.map((t) => ({
    id: t.id,
    name: t.name,
    subject: 'a_level_physics',
  }));

const aGeoList = (): Topic[] =>
  aLevelGeographyTopics.map((t) => ({
    id: t.id,
    name: t.name,
    subject: 'a_level_geography',
  }));

const aCsList = (): Topic[] =>
  aLevelComputerScienceTopics.map((t) => ({
    id: t.id,
    name: t.name,
    subject: 'a_level_computer_science',
  }));

const pureMathList = (): Topic[] =>
  aLevelPureMathTopics.map((t) => ({
    id: t.id,
    name: t.name,
    subject: 'a_level_pure_math',
  }));

export const SUBJECT_TOPIC_HUB_REGISTRY: Record<string, SubjectHubConfig> = {
  biology: {
    segment: 'biology',
    quizSubjectId: 'biology',
    subjectInfo: { id: 'biology', name: 'O Level Biology', color: '#10B981' },
    universeClass: 'bio',
    listPath: '/app/biology',
    examKey: 'biology',
    examLabel: 'Biology',
    tutorSubject: 'O Level Biology',
    tutorCardTitle: 'AI Biology Tutor',
    tutorGrade: 'Form 3-4 (O-Level)',
    maicGrade: 'Form 3-4 (O-Level)',
    labSubject: 'biology',
    labBrowseKey: 'biology',
    quizKind: 'o_science',
    parentForScienceQuiz: 'Biology',
    fetchTopicsFromApi: true,
    getStaticTopics: () => BIOLOGY_TOPICS_FALLBACK,
    notesPath: (t) => `/app/biology/notes/${encodeURIComponent(t.name)}`,
    topicDescription: () => '',
    practiceFormats: ['mcq', 'structured'],
  },
  chemistry: {
    segment: 'chemistry',
    quizSubjectId: 'chemistry',
    subjectInfo: { id: 'chemistry', name: 'O Level Chemistry', color: '#F59E0B' },
    universeClass: 'chem',
    listPath: '/app/chemistry',
    examKey: 'chemistry',
    examLabel: 'Chemistry',
    tutorSubject: 'O Level Chemistry',
    tutorCardTitle: 'AI Chemistry Tutor',
    tutorGrade: 'Form 3-4 (O-Level)',
    maicGrade: 'Form 3-4 (O-Level)',
    labSubject: 'chemistry',
    labBrowseKey: 'chemistry',
    quizKind: 'o_science',
    parentForScienceQuiz: 'Chemistry',
    fetchTopicsFromApi: true,
    getStaticTopics: () => CHEMISTRY_TOPICS_FALLBACK,
    notesPath: (t) => `/app/chemistry/notes/${encodeURIComponent(t.name)}`,
    topicDescription: () => '',
    practiceFormats: ['mcq', 'structured'],
  },
  physics: {
    segment: 'physics',
    quizSubjectId: 'physics',
    subjectInfo: { id: 'physics', name: 'O Level Physics', color: '#06B6D4' },
    universeClass: 'phys',
    listPath: '/app/physics',
    examKey: 'physics',
    examLabel: 'Physics',
    tutorSubject: 'O Level Physics',
    tutorCardTitle: 'AI Physics Tutor',
    tutorGrade: 'Form 3-4 (O-Level)',
    maicGrade: 'Form 3-4 (O-Level)',
    labSubject: 'physics',
    labBrowseKey: 'physics',
    quizKind: 'o_science',
    parentForScienceQuiz: 'Physics',
    fetchTopicsFromApi: true,
    getStaticTopics: () => PHYSICS_TOPICS_FALLBACK,
    notesPath: (t) => `/app/physics/notes/${encodeURIComponent(t.name)}`,
    topicDescription: () => '',
    practiceFormats: ['mcq', 'structured'],
  },
  'computer-science': {
    segment: 'computer-science',
    quizSubjectId: 'computer_science',
    subjectInfo: { id: 'computer_science', name: 'O Level Computer Science', color: '#0288D1' },
    universeClass: 'cs',
    listPath: '/app/computer-science',
    examKey: 'computer_science',
    examLabel: 'Computer Science',
    tutorSubject: 'Computer Science',
    tutorCardTitle: 'AI Computer Science Tutor',
    tutorGrade: 'Form 3-4 (O-Level)',
    maicGrade: 'Form 3-4 (O-Level)',
    labSubject: 'computer_science',
    labBrowseKey: 'computer_science',
    quizKind: 'o_cs',
    fetchTopicsFromApi: true,
    apiUsesBoard: true,
    getStaticTopics: () => CS_TOPICS_FALLBACK,
    notesPath: (t) => `/app/computer-science/notes/${encodeURIComponent(t.id)}`,
    topicDescription: () => '',
    practiceFormats: ['mcq', 'structured', 'essay'],
  },
  geography: {
    segment: 'geography',
    quizSubjectId: 'geography',
    subjectInfo: { id: 'geography', name: 'O Level Geography', color: '#2E7D32' },
    universeClass: 'geo',
    listPath: '/app/geography',
    examKey: 'geography',
    examLabel: 'Geography',
    tutorSubject: 'Geography',
    tutorCardTitle: 'AI Geography Tutor',
    tutorGrade: 'Form 3-4 (O-Level)',
    maicGrade: 'Form 3-4 (O-Level)',
    labSubject: 'geography',
    labBrowseKey: 'geography',
    quizKind: 'o_quiz',
    fetchTopicsFromApi: false,
    getStaticTopics: geoTopics,
    notesPath: (t) => `/app/geography/notes/${encodeURIComponent(t.id)}`,
    topicDescription: (topic) =>
      oLevelGeographyTopics.find((x) => x.id === topic.id)?.description ?? '',
    practiceFormats: ['mcq', 'structured', 'essay'],
  },
  commerce: {
    segment: 'commerce',
    quizSubjectId: 'commerce',
    subjectInfo: { id: 'commerce', name: 'O Level Commerce', color: '#B8860B' },
    universeClass: 'com',
    listPath: '/app/commerce',
    examKey: 'commerce',
    examLabel: 'Commerce',
    tutorSubject: 'Commerce',
    tutorCardTitle: 'AI Commerce Tutor',
    tutorGrade: 'Form 3-4 (O-Level)',
    maicGrade: 'Form 3-4 (O-Level)',
    labSubject: null,
    labBrowseKey: 'commerce',
    quizKind: 'o_quiz',
    fetchTopicsFromApi: false,
    getStaticTopics: commerceTopicsList,
    notesPath: (t) => `/app/commerce/notes/${encodeURIComponent(t.id)}`,
    topicDescription: (topic) =>
      commerceTopics.find((x) => x.id === topic.id)?.description ?? '',
    practiceFormats: ['mcq', 'essay'],
  },
  'business-enterprise-skills': {
    segment: 'business-enterprise-skills',
    quizSubjectId: 'business_enterprise_skills',
    subjectInfo: {
      id: 'business_enterprise_skills',
      name: 'Business Enterprise and Skills',
      color: '#2E7D32',
    },
    universeClass: 'bes',
    listPath: '/app/business-enterprise-skills',
    examKey: 'business_enterprise_skills',
    examLabel: 'Business Enterprise and Skills',
    tutorSubject: 'Business Enterprise and Skills',
    tutorCardTitle: 'AI Enterprise Tutor',
    tutorGrade: 'Form 3-4 (O-Level)',
    maicGrade: 'Form 3-4 (O-Level)',
    labSubject: 'business_enterprise_skills',
    labBrowseKey: 'business_enterprise_skills',
    quizKind: 'o_quiz',
    fetchTopicsFromApi: false,
    getStaticTopics: besTopicsList,
    notesPath: (t) => `/app/business-enterprise-skills/notes/${encodeURIComponent(t.id)}`,
    topicDescription: (topic) =>
      oLevelBESTopics.find((x) => x.id === topic.id)?.description ?? '',
    practiceFormats: ['mcq', 'essay'],
  },
  history: {
    segment: 'history',
    quizSubjectId: 'history',
    subjectInfo: { id: 'history', name: 'O Level History', color: '#5D4037' },
    universeClass: 'hist',
    listPath: '/app/history',
    examKey: 'history',
    examLabel: 'History',
    tutorSubject: 'History',
    tutorCardTitle: 'AI History Tutor',
    tutorGrade: 'Form 3-4 (O-Level)',
    maicGrade: 'Form 3-4 (O-Level)',
    labSubject: 'history',
    labBrowseKey: 'history',
    quizKind: 'history_essay',
    fetchTopicsFromApi: false,
    getStaticTopics: () => historyTopicsForQuiz as Topic[],
    notesPath: (t) => `/app/history/notes/${encodeURIComponent(t.id)}`,
    topicDescription: (topic) => getHistoryTopicMeta(topic.id)?.description ?? '',
    practiceFormats: ['essay'],
  },
  accounting: {
    segment: 'accounting',
    quizSubjectId: 'accounting',
    subjectInfo: { id: 'accounting', name: 'O Level Accounting', color: '#B8860B' },
    universeClass: 'acc',
    listPath: '/app/accounting',
    examKey: 'accounting',
    examLabel: 'Accounting',
    tutorSubject: 'Principles of Accounting',
    tutorCardTitle: 'AI Accounting Tutor',
    tutorGrade: 'Form 3-4 (O-Level)',
    maicGrade: 'Form 3-4 (O-Level)',
    labSubject: 'accounting',
    labBrowseKey: 'accounting',
    quizKind: 'o_quiz',
    fetchTopicsFromApi: false,
    getStaticTopics: accountingList,
    notesPath: (t) => `/app/accounting/notes/${encodeURIComponent(t.id)}`,
    topicDescription: (topic) =>
      accountingTopics.find((x) => x.id === topic.id)?.description ?? '',
    practiceFormats: ['mcq', 'essay'],
  },
  english: {
    segment: 'english',
    quizSubjectId: 'english',
    subjectInfo: { id: 'english', name: 'English', color: '#FF9100' },
    universeClass: 'eng',
    listPath: '/app/english',
    examKey: 'english',
    examLabel: 'English',
    tutorSubject: 'English',
    tutorCardTitle: 'AI English Tutor',
    tutorGrade: 'Form 3-4 (O-Level)',
    maicGrade: 'Form 3-4 (O-Level)',
    labSubject: 'english',
    labBrowseKey: 'english',
    quizKind: 'english',
    fetchTopicsFromApi: true,
    getStaticTopics: () => ENGLISH_TOPICS_FALLBACK,
    notesPath: () => null,
    topicDescription: () => '',
    practiceFormats: ['mcq'],
    englishModes: true,
  },
  'a-level-biology': {
    segment: 'a-level-biology',
    quizSubjectId: 'a_level_biology',
    subjectInfo: { id: 'a_level_biology', name: 'A Level Biology', color: '#10B981' },
    universeClass: 'bio',
    listPath: '/app/a-level-biology',
    examKey: 'a_level_biology',
    examLabel: 'A Level Biology',
    tutorSubject: 'A Level Biology',
    tutorCardTitle: 'AI A-Level Biology Tutor',
    tutorGrade: 'Lower Sixth / Upper Sixth',
    maicGrade: 'Lower Sixth',
    labSubject: 'biology',
    labBrowseKey: 'biology',
    quizKind: 'a_biology',
    fetchTopicsFromApi: false,
    getStaticTopics: aBioList,
    notesPath: (t) => `/app/a-level-biology/notes/${encodeURIComponent(t.id)}`,
    topicDescription: (topic) => getALevelBiologyTopicById(topic.id)?.description ?? '',
    practiceFormats: ['mcq', 'structured', 'essay'],
  },
  'a-level-chemistry': {
    segment: 'a-level-chemistry',
    quizSubjectId: 'a_level_chemistry',
    subjectInfo: { id: 'a_level_chemistry', name: 'A Level Chemistry', color: '#14B8A6' },
    universeClass: 'chem',
    listPath: '/app/a-level-chemistry',
    examKey: 'a_level_chemistry',
    examLabel: 'A Level Chemistry',
    tutorSubject: 'A Level Chemistry',
    tutorCardTitle: 'AI A-Level Chemistry Tutor',
    tutorGrade: 'Lower Sixth / Upper Sixth',
    maicGrade: 'Lower Sixth',
    labSubject: 'chemistry',
    labBrowseKey: 'chemistry',
    quizKind: 'a_stem',
    aStemParent: 'Chemistry',
    fetchTopicsFromApi: false,
    getStaticTopics: aChemList,
    notesPath: (t) => `/app/a-level-chemistry/notes/${encodeURIComponent(t.id)}`,
    topicDescription: (topic) =>
      aLevelChemistryTopics.find((x) => x.id === topic.id)?.description ?? '',
    practiceFormats: ['mcq', 'structured'],
  },
  'a-level-physics': {
    segment: 'a-level-physics',
    quizSubjectId: 'a_level_physics',
    subjectInfo: { id: 'a_level_physics', name: 'A Level Physics', color: '#06B6D4' },
    universeClass: 'phys',
    listPath: '/app/a-level-physics',
    examKey: 'a_level_physics',
    examLabel: 'A Level Physics',
    tutorSubject: 'A Level Physics',
    tutorCardTitle: 'AI A-Level Physics Tutor',
    tutorGrade: 'Lower Sixth / Upper Sixth',
    maicGrade: 'Lower Sixth',
    labSubject: 'physics',
    labBrowseKey: 'physics',
    quizKind: 'a_stem',
    aStemParent: 'Physics',
    fetchTopicsFromApi: false,
    getStaticTopics: aPhysList,
    notesPath: (t) => `/app/a-level-physics/notes/${encodeURIComponent(t.id)}`,
    topicDescription: (topic) =>
      aLevelPhysicsTopics.find((x) => x.id === topic.id)?.description ?? '',
    practiceFormats: ['mcq', 'structured'],
  },
  'a-level-geography': {
    segment: 'a-level-geography',
    quizSubjectId: 'a_level_geography',
    subjectInfo: { id: 'a_level_geography', name: 'A Level Geography', color: '#2E7D32' },
    universeClass: 'geo',
    listPath: '/app/a-level-geography',
    examKey: 'a_level_geography',
    examLabel: 'A Level Geography',
    tutorSubject: 'A Level Geography',
    tutorCardTitle: 'AI A-Level Geography Tutor',
    tutorGrade: 'Lower Sixth / Upper Sixth',
    maicGrade: 'Lower Sixth',
    labSubject: 'geography',
    labBrowseKey: 'geography',
    quizKind: 'a_geography',
    fetchTopicsFromApi: false,
    getStaticTopics: aGeoList,
    notesPath: (t) => `/app/a-level-geography/notes/${encodeURIComponent(t.id)}`,
    topicDescription: (topic) =>
      aLevelGeographyTopics.find((x) => x.id === topic.id)?.description ?? '',
    practiceFormats: ['mcq', 'structured', 'essay'],
  },
  'a-level-computer-science': {
    segment: 'a-level-computer-science',
    quizSubjectId: 'a_level_computer_science',
    subjectInfo: {
      id: 'a_level_computer_science',
      name: 'A Level Computer Science',
      color: '#0D47A1',
    },
    universeClass: 'cs',
    listPath: '/app/a-level-computer-science',
    examKey: 'a_level_computer_science',
    examLabel: 'A Level Computer Science',
    tutorSubject: 'A Level Computer Science',
    tutorCardTitle: 'AI A-Level CS Tutor',
    tutorGrade: 'Form 5-6 (A-Level)',
    maicGrade: 'Form 5-6 (A-Level)',
    labSubject: 'computer_science',
    labBrowseKey: 'computer_science',
    quizKind: 'a_cs',
    fetchTopicsFromApi: false,
    apiUsesBoard: true,
    getStaticTopics: aCsList,
    notesPath: (t) => {
      const slug = t.name.toLowerCase().replace(/ /g, '-');
      return `/app/a-level-computer-science/notes/${encodeURIComponent(slug)}`;
    },
    topicDescription: (topic) =>
      aLevelComputerScienceTopics.find((x) => x.id === topic.id)?.description ?? '',
    practiceFormats: ['mcq', 'structured', 'essay'],
  },
  'pure-math': {
    segment: 'pure-math',
    quizSubjectId: 'a_level_pure_math',
    subjectInfo: {
      id: 'a_level_pure_math',
      name: 'A Level Pure Mathematics',
      color: '#10B981',
    },
    universeClass: 'math',
    listPath: '/app/pure-math',
    examKey: 'a_level_pure_math',
    examLabel: 'A Level Pure Mathematics',
    tutorSubject: 'A Level Pure Mathematics',
    tutorCardTitle: 'AI Pure Math Tutor',
    tutorGrade: 'Lower Sixth / Upper Sixth',
    maicGrade: 'Lower Sixth',
    labSubject: 'mathematics',
    labBrowseKey: 'mathematics',
    quizKind: 'a_pure_math',
    fetchTopicsFromApi: false,
    getStaticTopics: pureMathList,
    notesPath: (t) => `/app/pure-math/notes/${encodeURIComponent(slugifyName(t.name))}`,
    topicDescription: (topic) =>
      aLevelPureMathTopics.find((x) => x.id === topic.id)?.description ?? '',
    practiceFormats: ['mcq', 'structured'],
  },
};

export function parseTopicHubPath(pathname: string): { segment: string; topicId: string } | null {
  const m = pathname.match(/^\/app\/([^/]+)\/topic\/(.+)$/);
  if (!m) return null;
  return { segment: m[1], topicId: decodeURIComponent(m[2]) };
}

export function getSubjectHubConfig(segment: string): SubjectHubConfig | undefined {
  return SUBJECT_TOPIC_HUB_REGISTRY[segment];
}
