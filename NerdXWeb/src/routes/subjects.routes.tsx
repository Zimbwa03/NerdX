import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';

// O-Level subjects
const MathematicsTopicsPage = lazy(() => import('../pages/mathematics/MathematicsTopicsPage').then((m) => ({ default: m.MathematicsTopicsPage })));
const MathTopicHubPage = lazy(() => import('../pages/mathematics/MathTopicHubPage').then((m) => ({ default: m.MathTopicHubPage })));
const ScanSolvePage = lazy(() => import('../pages/mathematics/ScanSolvePage').then((m) => ({ default: m.ScanSolvePage })));
const QuizPage = lazy(() => import('../pages/mathematics/QuizPage').then((m) => ({ default: m.QuizPage })));
const MathNotesPage = lazy(() => import('../pages/mathematics/MathNotesPage').then((m) => ({ default: m.MathNotesPage })));
const GraphPracticePage = lazy(() => import('../pages/mathematics/GraphPracticePage').then((m) => ({ default: m.GraphPracticePage })));
const ExamSetupPage = lazy(() => import('../pages/mathematics/ExamSetupPage').then((m) => ({ default: m.ExamSetupPage })));
const ExamSessionPage = lazy(() => import('../pages/mathematics/ExamSessionPage').then((m) => ({ default: m.ExamSessionPage })));
const ExamReviewPage = lazy(() => import('../pages/mathematics/ExamReviewPage').then((m) => ({ default: m.ExamReviewPage })));

const ScienceQuizPage = lazy(() => import('../pages/sciences/ScienceQuizPage').then((m) => ({ default: m.ScienceQuizPage })));
const ScienceNotesPage = lazy(() => import('../pages/sciences/ScienceNotesPage').then((m) => ({ default: m.ScienceNotesPage })));
const ScienceTopicsPage = lazy(() => import('../pages/sciences/ScienceTopicsPage').then((m) => ({ default: m.ScienceTopicsPage })));
const BiologyTopicsPage = lazy(() => import('../pages/biology/BiologyTopicsPage').then((m) => ({ default: m.BiologyTopicsPage })));
const ChemistryTopicsPage = lazy(() => import('../pages/chemistry/ChemistryTopicsPage').then((m) => ({ default: m.ChemistryTopicsPage })));
const PhysicsTopicsPage = lazy(() => import('../pages/physics/PhysicsTopicsPage').then((m) => ({ default: m.PhysicsTopicsPage })));

const EnglishTopicsPage = lazy(() => import('../pages/english/EnglishTopicsPage').then((m) => ({ default: m.EnglishTopicsPage })));
const EnglishComprehensionPage = lazy(() => import('../pages/english/EnglishComprehensionPage').then((m) => ({ default: m.EnglishComprehensionPage })));
const EnglishEssayPage = lazy(() => import('../pages/english/EnglishEssayPage').then((m) => ({ default: m.EnglishEssayPage })));

const ComputerScienceTopicsPage = lazy(() => import('../pages/computer-science/ComputerScienceTopicsPage').then((m) => ({ default: m.ComputerScienceTopicsPage })));
const ComputerScienceNotesPage = lazy(() => import('../pages/computer-science/ComputerScienceNotesPage').then((m) => ({ default: m.ComputerScienceNotesPage })));
const ComputerScienceNoteDetailPage = lazy(() => import('../pages/computer-science/ComputerScienceNoteDetailPage').then((m) => ({ default: m.ComputerScienceNoteDetailPage })));

const CommerceTopicsPage = lazy(() => import('../pages/commerce/CommerceTopicsPage').then((m) => ({ default: m.CommerceTopicsPage })));
const CommerceNotesPage = lazy(() => import('../pages/commerce/CommerceNotesPage').then((m) => ({ default: m.CommerceNotesPage })));
const CommerceNoteDetailPage = lazy(() => import('../pages/commerce/CommerceNoteDetailPage').then((m) => ({ default: m.CommerceNoteDetailPage })));

const GeographyTopicsPage = lazy(() => import('../pages/geography/GeographyTopicsPage').then((m) => ({ default: m.GeographyTopicsPage })));
const GeographyNotesPage = lazy(() => import('../pages/geography/GeographyNotesPage').then((m) => ({ default: m.GeographyNotesPage })));
const GeographyNoteDetailPage = lazy(() => import('../pages/geography/GeographyNoteDetailPage').then((m) => ({ default: m.GeographyNoteDetailPage })));

const BESTopicsPage = lazy(() => import('../pages/business-enterprise-skills/BESTopicsPage').then((m) => ({ default: m.BESTopicsPage })));
const BESNotesPage = lazy(() => import('../pages/business-enterprise-skills/BESNotesPage').then((m) => ({ default: m.BESNotesPage })));
const BESNoteDetailPage = lazy(() => import('../pages/business-enterprise-skills/BESNoteDetailPage').then((m) => ({ default: m.BESNoteDetailPage })));

const HistoryTopicsPage = lazy(() => import('../pages/history/HistoryTopicsPage').then((m) => ({ default: m.HistoryTopicsPage })));
const HistoryNotesPage = lazy(() => import('../pages/history/HistoryNotesPage').then((m) => ({ default: m.HistoryNotesPage })));
const HistoryNoteDetailPage = lazy(() => import('../pages/history/HistoryNoteDetailPage').then((m) => ({ default: m.HistoryNoteDetailPage })));
const HistoryEssayPage = lazy(() => import('../pages/history/HistoryEssayPage').then((m) => ({ default: m.HistoryEssayPage })));

const AccountingPage = lazy(() => import('../pages/accounting/AccountingPage').then((m) => ({ default: m.AccountingPage })));
const AccountingNotesPage = lazy(() => import('../pages/accounting/AccountingNotesPage').then((m) => ({ default: m.AccountingNotesPage })));
const AccountingNoteDetailPage = lazy(() => import('../pages/accounting/AccountingNoteDetailPage').then((m) => ({ default: m.AccountingNoteDetailPage })));

// A-Level subjects
const ALevelPureMathPage = lazy(() => import('../pages/a-level/ALevelPureMathPage').then((m) => ({ default: m.ALevelPureMathPage })));
const ALevelPureMathNotesPage = lazy(() => import('../pages/a-level/ALevelPureMathNotesPage').then((m) => ({ default: m.ALevelPureMathNotesPage })));
const ALevelPureMathNoteDetailPage = lazy(() => import('../pages/a-level/ALevelPureMathNoteDetailPage').then((m) => ({ default: m.ALevelPureMathNoteDetailPage })));

const ALevelBiologyTopicsPage = lazy(() => import('../pages/a-level-biology/ALevelBiologyTopicsPage').then((m) => ({ default: m.ALevelBiologyTopicsPage })));
const ALevelBiologyNotesPage = lazy(() => import('../pages/a-level-biology/ALevelBiologyNotesPage').then((m) => ({ default: m.ALevelBiologyNotesPage })));
const ALevelBiologyNoteDetailPage = lazy(() => import('../pages/a-level-biology/ALevelBiologyNoteDetailPage').then((m) => ({ default: m.ALevelBiologyNoteDetailPage })));

const ALevelChemistryTopicsPage = lazy(() => import('../pages/a-level-chemistry/ALevelChemistryTopicsPage').then((m) => ({ default: m.ALevelChemistryTopicsPage })));
const ALevelChemistryNotesPage = lazy(() => import('../pages/a-level-chemistry/ALevelChemistryNotesPage').then((m) => ({ default: m.ALevelChemistryNotesPage })));
const ALevelChemistryNoteDetailPage = lazy(() => import('../pages/a-level-chemistry/ALevelChemistryNoteDetailPage').then((m) => ({ default: m.ALevelChemistryNoteDetailPage })));

const ALevelPhysicsTopicsPage = lazy(() => import('../pages/a-level-physics/ALevelPhysicsTopicsPage').then((m) => ({ default: m.ALevelPhysicsTopicsPage })));
const ALevelPhysicsNotesPage = lazy(() => import('../pages/a-level-physics/ALevelPhysicsNotesPage').then((m) => ({ default: m.ALevelPhysicsNotesPage })));
const ALevelPhysicsNoteDetailPage = lazy(() => import('../pages/a-level-physics/ALevelPhysicsNoteDetailPage').then((m) => ({ default: m.ALevelPhysicsNoteDetailPage })));

const ALevelComputerScienceTopicsPage = lazy(() => import('../pages/a-level-computer-science/ALevelComputerScienceTopicsPage').then((m) => ({ default: m.ALevelComputerScienceTopicsPage })));
const ALevelComputerScienceNotesPage = lazy(() => import('../pages/a-level-computer-science/ALevelComputerScienceNotesPage').then((m) => ({ default: m.ALevelComputerScienceNotesPage })));
const ALevelComputerScienceNoteDetailPage = lazy(() => import('../pages/a-level-computer-science/ALevelComputerScienceNoteDetailPage').then((m) => ({ default: m.ALevelComputerScienceNoteDetailPage })));

const ALevelGeographyTopicsPage = lazy(() => import('../pages/a-level-geography/ALevelGeographyTopicsPage').then((m) => ({ default: m.ALevelGeographyTopicsPage })));
const ALevelGeographyNotesPage = lazy(() => import('../pages/a-level-geography/ALevelGeographyNotesPage').then((m) => ({ default: m.ALevelGeographyNotesPage })));
const ALevelGeographyNoteDetailPage = lazy(() => import('../pages/a-level-geography/ALevelGeographyNoteDetailPage').then((m) => ({ default: m.ALevelGeographyNoteDetailPage })));

const SubjectTopicHubPage = lazy(() => import('../pages/topic-hub/SubjectTopicHubPage').then((m) => ({ default: m.SubjectTopicHubPage })));

export function SubjectRoutes() {
  return (
    <>
      {/* Mathematics */}
      <Route path="mathematics" element={<MathematicsTopicsPage />} />
      <Route path="mathematics/scan-solve" element={<ScanSolvePage />} />
      <Route path="mathematics/topic/:topicId" element={<MathTopicHubPage />} />
      <Route path="mathematics/quiz" element={<QuizPage />} />
      <Route path="quiz" element={<QuizPage />} />
      <Route path="mathematics/notes/:topic" element={<MathNotesPage />} />
      <Route path="mathematics/graph-practice" element={<GraphPracticePage />} />
      <Route path="mathematics/tutor" element={<Navigate to="/app/teacher" state={{ subject: 'O Level Mathematics', gradeLevel: 'Form 3-4 (O-Level)' }} replace />} />
<Route path="mathematics/exam/setup" element={<ExamSetupPage />} />
      <Route path="mathematics/exam/session" element={<ExamSessionPage />} />
      <Route path="mathematics/exam/review" element={<ExamReviewPage />} />
      <Route path="exam/setup" element={<ExamSetupPage />} />
      <Route path="exam/session" element={<ExamSessionPage />} />
      <Route path="exam/review" element={<ExamReviewPage />} />

      {/* Sciences */}
      <Route path="sciences" element={<ScienceTopicsPage />} />
      <Route path="sciences/quiz" element={<ScienceQuizPage />} />
      <Route path="sciences/notes/:subject/:topic" element={<ScienceNotesPage />} />
      <Route path="sciences/notes" element={<ScienceNotesPage />} />
      <Route path="sciences/tutor" element={<Navigate to="/app/teacher" state={{ subject: 'Biology' }} replace />} />
      <Route path="biology" element={<BiologyTopicsPage />} />
      <Route path="biology/topic/:topicId" element={<SubjectTopicHubPage />} />
      <Route path="biology/notes/:topic" element={<ScienceNotesPage />} />
      <Route path="chemistry" element={<ChemistryTopicsPage />} />
      <Route path="chemistry/topic/:topicId" element={<SubjectTopicHubPage />} />
      <Route path="chemistry/notes/:topic" element={<ScienceNotesPage />} />
      <Route path="physics" element={<PhysicsTopicsPage />} />
      <Route path="physics/topic/:topicId" element={<SubjectTopicHubPage />} />
      <Route path="physics/notes/:topic" element={<ScienceNotesPage />} />

      {/* English */}
      <Route path="english" element={<EnglishTopicsPage />} />
      <Route path="english/topic/:topicId" element={<SubjectTopicHubPage />} />
      <Route path="english/comprehension" element={<EnglishComprehensionPage />} />
      <Route path="english/essay" element={<EnglishEssayPage />} />

      {/* Computer Science */}
      <Route path="computer-science" element={<ComputerScienceTopicsPage />} />
      <Route path="computer-science/topic/:topicId" element={<SubjectTopicHubPage />} />
      <Route path="computer-science/notes" element={<ComputerScienceNotesPage />} />
      <Route path="computer-science/notes/:topicSlug" element={<ComputerScienceNoteDetailPage />} />

      {/* Commerce */}
      <Route path="commerce" element={<CommerceTopicsPage />} />
      <Route path="commerce/topic/:topicId" element={<SubjectTopicHubPage />} />
      <Route path="commerce/notes" element={<CommerceNotesPage />} />
      <Route path="commerce/notes/:topicSlug" element={<CommerceNoteDetailPage />} />

      {/* Geography */}
      <Route path="geography" element={<GeographyTopicsPage />} />
      <Route path="geography/topic/:topicId" element={<SubjectTopicHubPage />} />
      <Route path="geography/notes" element={<GeographyNotesPage />} />
      <Route path="geography/notes/:topicId" element={<GeographyNoteDetailPage />} />

      {/* Business Enterprise Skills */}
      <Route path="business-enterprise-skills" element={<BESTopicsPage />} />
      <Route path="business-enterprise-skills/topic/:topicId" element={<SubjectTopicHubPage />} />
      <Route path="business-enterprise-skills/notes" element={<BESNotesPage />} />
      <Route path="business-enterprise-skills/notes/:topicSlug" element={<BESNoteDetailPage />} />

      {/* History */}
      <Route path="history" element={<HistoryTopicsPage />} />
      <Route path="history/topic/:topicId" element={<SubjectTopicHubPage />} />
      <Route path="history/notes" element={<HistoryNotesPage />} />
      <Route path="history/notes/:topicId" element={<HistoryNoteDetailPage />} />
      <Route path="history/essay" element={<HistoryEssayPage />} />

      {/* Accounting */}
      <Route path="accounting" element={<AccountingPage />} />
      <Route path="accounting/topic/:topicId" element={<SubjectTopicHubPage />} />
      <Route path="accounting/topics" element={<Navigate to="/app/accounting" replace />} />
      <Route path="accounting/notes" element={<AccountingNotesPage />} />
      <Route path="accounting/notes/:topicId" element={<AccountingNoteDetailPage />} />

      {/* A-Level Pure Mathematics */}
      <Route path="pure-math" element={<ALevelPureMathPage />} />
      <Route path="pure-math/topic/:topicId" element={<SubjectTopicHubPage />} />
      <Route path="pure-math/notes" element={<ALevelPureMathNotesPage />} />
      <Route path="pure-math/notes/:topic" element={<ALevelPureMathNoteDetailPage />} />

      {/* A-Level Biology */}
      <Route path="a-level-biology" element={<ALevelBiologyTopicsPage />} />
      <Route path="a-level-biology/topic/:topicId" element={<SubjectTopicHubPage />} />
      <Route path="a-level-biology/notes" element={<ALevelBiologyNotesPage />} />
      <Route path="a-level-biology/notes/:topicId" element={<ALevelBiologyNoteDetailPage />} />

      {/* A-Level Chemistry */}
      <Route path="a-level-chemistry" element={<ALevelChemistryTopicsPage />} />
      <Route path="a-level-chemistry/topic/:topicId" element={<SubjectTopicHubPage />} />
      <Route path="a-level-chemistry/notes" element={<ALevelChemistryNotesPage />} />
      <Route path="a-level-chemistry/notes/:topicId" element={<ALevelChemistryNoteDetailPage />} />

      {/* A-Level Physics */}
      <Route path="a-level-physics" element={<ALevelPhysicsTopicsPage />} />
      <Route path="a-level-physics/topic/:topicId" element={<SubjectTopicHubPage />} />
      <Route path="a-level-physics/notes" element={<ALevelPhysicsNotesPage />} />
      <Route path="a-level-physics/notes/:topicId" element={<ALevelPhysicsNoteDetailPage />} />

      {/* A-Level Computer Science */}
      <Route path="a-level-computer-science" element={<ALevelComputerScienceTopicsPage />} />
      <Route path="a-level-computer-science/topic/:topicId" element={<SubjectTopicHubPage />} />
      <Route path="a-level-computer-science/notes" element={<ALevelComputerScienceNotesPage />} />
      <Route path="a-level-computer-science/notes/:topicSlug" element={<ALevelComputerScienceNoteDetailPage />} />

      {/* A-Level Geography */}
      <Route path="a-level-geography" element={<ALevelGeographyTopicsPage />} />
      <Route path="a-level-geography/topic/:topicId" element={<SubjectTopicHubPage />} />
      <Route path="a-level-geography/notes" element={<ALevelGeographyNotesPage />} />
      <Route path="a-level-geography/notes/:topicId" element={<ALevelGeographyNoteDetailPage />} />
    </>
  );
}
