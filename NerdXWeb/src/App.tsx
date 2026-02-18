import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { AppLayout } from './components/AppLayout';
import { SchoolAuthProvider, SchoolProtectedRoute } from './context/SchoolAuthContext';

const LandingPage = lazy(() => import('./pages/LandingPage').then((m) => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })));
const EmailVerificationPage = lazy(() => import('./pages/EmailVerificationPage').then((m) => ({ default: m.EmailVerificationPage })));
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage').then((m) => ({ default: m.AuthCallbackPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const CreditsPage = lazy(() => import('./pages/CreditsPage').then((m) => ({ default: m.CreditsPage })));
const AccountPage = lazy(() => import('./pages/AccountPage').then((m) => ({ default: m.AccountPage })));
const ProgressPage = lazy(() => import('./pages/ProgressPage').then((m) => ({ default: m.ProgressPage })));
const MathematicsTopicsPage = lazy(() => import('./pages/mathematics/MathematicsTopicsPage').then((m) => ({ default: m.MathematicsTopicsPage })));
const QuizPage = lazy(() => import('./pages/mathematics/QuizPage').then((m) => ({ default: m.QuizPage })));
const MathNotesPage = lazy(() => import('./pages/mathematics/MathNotesPage').then((m) => ({ default: m.MathNotesPage })));
const GraphPracticePage = lazy(() => import('./pages/mathematics/GraphPracticePage').then((m) => ({ default: m.GraphPracticePage })));
const TeacherSetupPage = lazy(() => import('./pages/teacher/TeacherSetupPage').then((m) => ({ default: m.TeacherSetupPage })));
const TeacherChatPage = lazy(() => import('./pages/teacher/TeacherChatPage').then((m) => ({ default: m.TeacherChatPage })));
const TeacherHistoryPage = lazy(() => import('./pages/teacher/TeacherHistoryPage').then((m) => ({ default: m.TeacherHistoryPage })));
const ScanSolvePage = lazy(() => import('./pages/mathematics/ScanSolvePage').then((m) => ({ default: m.ScanSolvePage })));
const ExamSetupPage = lazy(() => import('./pages/mathematics/ExamSetupPage').then((m) => ({ default: m.ExamSetupPage })));
const ExamSessionPage = lazy(() => import('./pages/mathematics/ExamSessionPage').then((m) => ({ default: m.ExamSessionPage })));
const ExamReviewPage = lazy(() => import('./pages/mathematics/ExamReviewPage').then((m) => ({ default: m.ExamReviewPage })));
const ScienceQuizPage = lazy(() => import('./pages/sciences/ScienceQuizPage').then((m) => ({ default: m.ScienceQuizPage })));
const ScienceNotesPage = lazy(() => import('./pages/sciences/ScienceNotesPage').then((m) => ({ default: m.ScienceNotesPage })));
const ScienceTopicsPage = lazy(() => import('./pages/sciences/ScienceTopicsPage').then((m) => ({ default: m.ScienceTopicsPage })));
const BiologyTopicsPage = lazy(() => import('./pages/biology/BiologyTopicsPage').then((m) => ({ default: m.BiologyTopicsPage })));
const ChemistryTopicsPage = lazy(() => import('./pages/chemistry/ChemistryTopicsPage').then((m) => ({ default: m.ChemistryTopicsPage })));
const PhysicsTopicsPage = lazy(() => import('./pages/physics/PhysicsTopicsPage').then((m) => ({ default: m.PhysicsTopicsPage })));
const EnglishTopicsPage = lazy(() => import('./pages/english/EnglishTopicsPage').then((m) => ({ default: m.EnglishTopicsPage })));
const EnglishComprehensionPage = lazy(() => import('./pages/english/EnglishComprehensionPage').then((m) => ({ default: m.EnglishComprehensionPage })));
const EnglishEssayPage = lazy(() => import('./pages/english/EnglishEssayPage').then((m) => ({ default: m.EnglishEssayPage })));
const ComputerScienceTopicsPage = lazy(() => import('./pages/computer-science/ComputerScienceTopicsPage').then((m) => ({ default: m.ComputerScienceTopicsPage })));
const ComputerScienceNotesPage = lazy(() => import('./pages/computer-science/ComputerScienceNotesPage').then((m) => ({ default: m.ComputerScienceNotesPage })));
const ComputerScienceNoteDetailPage = lazy(() => import('./pages/computer-science/ComputerScienceNoteDetailPage').then((m) => ({ default: m.ComputerScienceNoteDetailPage })));
const CommerceTopicsPage = lazy(() => import('./pages/commerce/CommerceTopicsPage').then((m) => ({ default: m.CommerceTopicsPage })));
const CommerceNotesPage = lazy(() => import('./pages/commerce/CommerceNotesPage').then((m) => ({ default: m.CommerceNotesPage })));
const CommerceNoteDetailPage = lazy(() => import('./pages/commerce/CommerceNoteDetailPage').then((m) => ({ default: m.CommerceNoteDetailPage })));
const GeographyTopicsPage = lazy(() => import('./pages/geography/GeographyTopicsPage').then((m) => ({ default: m.GeographyTopicsPage })));
const GeographyNotesPage = lazy(() => import('./pages/geography/GeographyNotesPage').then((m) => ({ default: m.GeographyNotesPage })));
const GeographyNoteDetailPage = lazy(() => import('./pages/geography/GeographyNoteDetailPage').then((m) => ({ default: m.GeographyNoteDetailPage })));
const BESTopicsPage = lazy(() => import('./pages/business-enterprise-skills/BESTopicsPage').then((m) => ({ default: m.BESTopicsPage })));
const BESNotesPage = lazy(() => import('./pages/business-enterprise-skills/BESNotesPage').then((m) => ({ default: m.BESNotesPage })));
const BESNoteDetailPage = lazy(() => import('./pages/business-enterprise-skills/BESNoteDetailPage').then((m) => ({ default: m.BESNoteDetailPage })));
const HistoryTopicsPage = lazy(() => import('./pages/history/HistoryTopicsPage').then((m) => ({ default: m.HistoryTopicsPage })));
const HistoryNotesPage = lazy(() => import('./pages/history/HistoryNotesPage').then((m) => ({ default: m.HistoryNotesPage })));
const HistoryNoteDetailPage = lazy(() => import('./pages/history/HistoryNoteDetailPage').then((m) => ({ default: m.HistoryNoteDetailPage })));
const HistoryEssayPage = lazy(() => import('./pages/history/HistoryEssayPage').then((m) => ({ default: m.HistoryEssayPage })));
const AgentHubPage = lazy(() => import('./pages/agents/AgentHubPage').then((m) => ({ default: m.AgentHubPage })));
const AgentBuilderPage = lazy(() => import('./pages/agents/AgentBuilderPage').then((m) => ({ default: m.AgentBuilderPage })));
const VirtualLabHubPage = lazy(() => import('./pages/virtual-lab/VirtualLabHubPage').then((m) => ({ default: m.VirtualLabHubPage })));
const VirtualLabSimulationPage = lazy(() => import('./pages/virtual-lab/VirtualLabSimulationPage').then((m) => ({ default: m.VirtualLabSimulationPage })));
const ALevelPureMathPage = lazy(() => import('./pages/a-level/ALevelPureMathPage').then((m) => ({ default: m.ALevelPureMathPage })));
const ALevelPureMathNotesPage = lazy(() => import('./pages/a-level/ALevelPureMathNotesPage').then((m) => ({ default: m.ALevelPureMathNotesPage })));
const ALevelPureMathNoteDetailPage = lazy(() => import('./pages/a-level/ALevelPureMathNoteDetailPage').then((m) => ({ default: m.ALevelPureMathNoteDetailPage })));
const ALevelBiologyTopicsPage = lazy(() => import('./pages/a-level-biology/ALevelBiologyTopicsPage').then((m) => ({ default: m.ALevelBiologyTopicsPage })));
const ALevelBiologyNotesPage = lazy(() => import('./pages/a-level-biology/ALevelBiologyNotesPage').then((m) => ({ default: m.ALevelBiologyNotesPage })));
const ALevelBiologyNoteDetailPage = lazy(() => import('./pages/a-level-biology/ALevelBiologyNoteDetailPage').then((m) => ({ default: m.ALevelBiologyNoteDetailPage })));
const ALevelChemistryTopicsPage = lazy(() => import('./pages/a-level-chemistry/ALevelChemistryTopicsPage').then((m) => ({ default: m.ALevelChemistryTopicsPage })));
const ALevelChemistryNotesPage = lazy(() => import('./pages/a-level-chemistry/ALevelChemistryNotesPage').then((m) => ({ default: m.ALevelChemistryNotesPage })));
const ALevelChemistryNoteDetailPage = lazy(() => import('./pages/a-level-chemistry/ALevelChemistryNoteDetailPage').then((m) => ({ default: m.ALevelChemistryNoteDetailPage })));
const ALevelPhysicsTopicsPage = lazy(() => import('./pages/a-level-physics/ALevelPhysicsTopicsPage').then((m) => ({ default: m.ALevelPhysicsTopicsPage })));
const ALevelPhysicsNotesPage = lazy(() => import('./pages/a-level-physics/ALevelPhysicsNotesPage').then((m) => ({ default: m.ALevelPhysicsNotesPage })));
const ALevelPhysicsNoteDetailPage = lazy(() => import('./pages/a-level-physics/ALevelPhysicsNoteDetailPage').then((m) => ({ default: m.ALevelPhysicsNoteDetailPage })));
const ALevelComputerScienceTopicsPage = lazy(() => import('./pages/a-level-computer-science/ALevelComputerScienceTopicsPage').then((m) => ({ default: m.ALevelComputerScienceTopicsPage })));
const ALevelComputerScienceNotesPage = lazy(() => import('./pages/a-level-computer-science/ALevelComputerScienceNotesPage').then((m) => ({ default: m.ALevelComputerScienceNotesPage })));
const ALevelComputerScienceNoteDetailPage = lazy(() => import('./pages/a-level-computer-science/ALevelComputerScienceNoteDetailPage').then((m) => ({ default: m.ALevelComputerScienceNoteDetailPage })));
const ALevelGeographyTopicsPage = lazy(() => import('./pages/a-level-geography/ALevelGeographyTopicsPage').then((m) => ({ default: m.ALevelGeographyTopicsPage })));
const ALevelGeographyNotesPage = lazy(() => import('./pages/a-level-geography/ALevelGeographyNotesPage').then((m) => ({ default: m.ALevelGeographyNotesPage })));
const ALevelGeographyNoteDetailPage = lazy(() => import('./pages/a-level-geography/ALevelGeographyNoteDetailPage').then((m) => ({ default: m.ALevelGeographyNoteDetailPage })));
const FormulaSheetPage = lazy(() => import('./pages/tools/FormulaSheetPage').then((m) => ({ default: m.FormulaSheetPage })));
const PastPapersPage = lazy(() => import('./pages/tools/PastPapersPage').then((m) => ({ default: m.PastPapersPage })));
const AccountingPage = lazy(() => import('./pages/accounting/AccountingPage').then((m) => ({ default: m.AccountingPage })));
const AccountingNotesPage = lazy(() => import('./pages/accounting/AccountingNotesPage').then((m) => ({ default: m.AccountingNotesPage })));
const AccountingNoteDetailPage = lazy(() => import('./pages/accounting/AccountingNoteDetailPage').then((m) => ({ default: m.AccountingNoteDetailPage })));
const NotificationsPage = lazy(() => import('./pages/notifications/NotificationsPage').then((m) => ({ default: m.NotificationsPage })));
const NotificationDetailPage = lazy(() => import('./pages/notifications/NotificationDetailPage').then((m) => ({ default: m.NotificationDetailPage })));
const ReferralHubPage = lazy(() => import('./pages/account/ReferralHubPage').then((m) => ({ default: m.ReferralHubPage })));
const BillingHistoryPage = lazy(() => import('./pages/account/BillingHistoryPage').then((m) => ({ default: m.BillingHistoryPage })));
const SecurityCenterPage = lazy(() => import('./pages/account/SecurityCenterPage').then((m) => ({ default: m.SecurityCenterPage })));
const LearningPreferencesPage = lazy(() => import('./pages/account/LearningPreferencesPage').then((m) => ({ default: m.LearningPreferencesPage })));
const ProjectAssistantHubPage = lazy(() => import('./pages/project-assistant/ProjectAssistantHubPage').then((m) => ({ default: m.ProjectAssistantHubPage })));
const ProjectAssistantChatPage = lazy(() => import('./pages/project-assistant/ProjectAssistantChatPage').then((m) => ({ default: m.ProjectAssistantChatPage })));
const NerdXLivePage = lazy(() => import('./pages/nerdx-live/NerdXLivePage').then((m) => ({ default: m.NerdXLivePage })));
const OfflineChatPage = lazy(() => import('./pages/tools/OfflineChatPage').then((m) => ({ default: m.OfflineChatPage })));
const FindTeacherPage = lazy(() => import('./pages/teacher-marketplace/FindTeacherPage').then((m) => ({ default: m.FindTeacherPage })));
const TeacherProfilePage = lazy(() => import('./pages/teacher-marketplace/TeacherProfilePage').then((m) => ({ default: m.TeacherProfilePage })));
const BookLessonPage = lazy(() => import('./pages/teacher-marketplace/BookLessonPage').then((m) => ({ default: m.BookLessonPage })));
const TeacherFeedPage = lazy(() => import('./pages/teacher-marketplace/TeacherFeedPage').then((m) => ({ default: m.TeacherFeedPage })));
const TeacherOnboardingPage = lazy(() => import('./pages/teacher-marketplace/TeacherOnboardingPage').then((m) => ({ default: m.TeacherOnboardingPage })));
const TeacherDashboardPage = lazy(() => import('./pages/teacher-marketplace/TeacherDashboardPage').then((m) => ({ default: m.TeacherDashboardPage })));
const VirtualClassroomPage = lazy(() => import('./pages/teacher-marketplace/VirtualClassroomPage').then((m) => ({ default: m.VirtualClassroomPage })));
const StudentLessonsPage = lazy(() => import('./pages/teacher-marketplace/StudentLessonsPage').then((m) => ({ default: m.StudentLessonsPage })));
const SchoolLoginPage = lazy(() => import('./pages/school/SchoolLoginPage').then((m) => ({ default: m.SchoolLoginPage })));
const SchoolDashboardPage = lazy(() => import('./pages/school/SchoolDashboardPage').then((m) => ({ default: m.SchoolDashboardPage })));

const routeLoadingFallback = (
  <div
    style={{
      minHeight: '40vh',
      display: 'grid',
      placeItems: 'center',
      color: 'rgba(255, 255, 255, 0.78)',
      fontSize: 14,
      fontWeight: 600,
    }}
  >
    Loading...
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={routeLoadingFallback}>
          <Routes>
            {/* Public auth routes */}
            <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
            <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
            <Route path="/verify-email" element={<PublicRoute><EmailVerificationPage /></PublicRoute>} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />

            {/* Admin dashboard is served by Flask backend via /admin proxy */}

            {/* Authenticated app routes */}
            <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<DashboardPage />} />
              <Route path="credits" element={<CreditsPage />} />
              <Route path="account" element={<AccountPage />} />
              <Route path="referral" element={<ReferralHubPage />} />
              <Route path="billing" element={<BillingHistoryPage />} />
              <Route path="security" element={<SecurityCenterPage />} />
              <Route path="preferences" element={<LearningPreferencesPage />} />
              <Route path="progress" element={<ProgressPage />} />
              <Route path="ai-insights" element={<ProgressPage />} />
              <Route path="agents" element={<AgentHubPage />} />
              <Route path="agents/builder" element={<AgentBuilderPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="notifications/:id" element={<NotificationDetailPage />} />
              <Route path="virtual-lab" element={<VirtualLabHubPage />} />
              <Route path="virtual-lab/:labId" element={<VirtualLabSimulationPage />} />
              <Route path="pure-math" element={<ALevelPureMathPage />} />
              <Route path="pure-math/notes" element={<ALevelPureMathNotesPage />} />
              <Route path="pure-math/notes/:topic" element={<ALevelPureMathNoteDetailPage />} />
              <Route path="a-level-chemistry" element={<ALevelChemistryTopicsPage />} />
              <Route path="a-level-chemistry/notes" element={<ALevelChemistryNotesPage />} />
              <Route path="a-level-chemistry/notes/:topicId" element={<ALevelChemistryNoteDetailPage />} />
              <Route path="a-level-physics" element={<ALevelPhysicsTopicsPage />} />
              <Route path="a-level-physics/notes" element={<ALevelPhysicsNotesPage />} />
              <Route path="a-level-physics/notes/:topicId" element={<ALevelPhysicsNoteDetailPage />} />
              <Route path="a-level-biology" element={<ALevelBiologyTopicsPage />} />
              <Route path="a-level-biology/notes" element={<ALevelBiologyNotesPage />} />
              <Route path="a-level-biology/notes/:topicId" element={<ALevelBiologyNoteDetailPage />} />
              <Route path="a-level-computer-science" element={<ALevelComputerScienceTopicsPage />} />
              <Route path="a-level-computer-science/notes" element={<ALevelComputerScienceNotesPage />} />
              <Route path="a-level-computer-science/notes/:topicSlug" element={<ALevelComputerScienceNoteDetailPage />} />
              <Route path="a-level-geography" element={<ALevelGeographyTopicsPage />} />
              <Route path="a-level-geography/notes" element={<ALevelGeographyNotesPage />} />
              <Route path="a-level-geography/notes/:topicId" element={<ALevelGeographyNoteDetailPage />} />
              <Route path="project-assistant" element={<ProjectAssistantHubPage />} />
              <Route path="project-assistant/:projectId" element={<ProjectAssistantChatPage />} />
              <Route path="nerdx-live" element={<NerdXLivePage />} />
              <Route path="offline" element={<OfflineChatPage />} />
              <Route path="formula-sheet" element={<FormulaSheetPage />} />
              <Route path="past-papers" element={<PastPapersPage />} />
              <Route path="accounting" element={<AccountingPage />} />
              <Route path="accounting/topics" element={<Navigate to="/app/accounting" replace />} />
              <Route path="accounting/notes" element={<AccountingNotesPage />} />
              <Route path="accounting/notes/:topicId" element={<AccountingNoteDetailPage />} />
              <Route path="mathematics" element={<MathematicsTopicsPage />} />
              <Route path="mathematics/quiz" element={<QuizPage />} />
              <Route path="quiz" element={<QuizPage />} />
              <Route path="english" element={<EnglishTopicsPage />} />
              <Route path="english/comprehension" element={<EnglishComprehensionPage />} />
              <Route path="english/essay" element={<EnglishEssayPage />} />
              <Route path="computer-science" element={<ComputerScienceTopicsPage />} />
              <Route path="computer-science/notes" element={<ComputerScienceNotesPage />} />
              <Route path="computer-science/notes/:topicSlug" element={<ComputerScienceNoteDetailPage />} />
              <Route path="geography" element={<GeographyTopicsPage />} />
              <Route path="geography/notes" element={<GeographyNotesPage />} />
              <Route path="geography/notes/:topicId" element={<GeographyNoteDetailPage />} />
              <Route path="commerce" element={<CommerceTopicsPage />} />
              <Route path="commerce/notes" element={<CommerceNotesPage />} />
              <Route path="commerce/notes/:topicSlug" element={<CommerceNoteDetailPage />} />
              <Route path="business-enterprise-skills" element={<BESTopicsPage />} />
              <Route path="business-enterprise-skills/notes" element={<BESNotesPage />} />
              <Route path="business-enterprise-skills/notes/:topicSlug" element={<BESNoteDetailPage />} />
              <Route path="history" element={<HistoryTopicsPage />} />
              <Route path="history/notes" element={<HistoryNotesPage />} />
              <Route path="history/notes/:topicId" element={<HistoryNoteDetailPage />} />
              <Route path="history/essay" element={<HistoryEssayPage />} />
              <Route path="mathematics/notes/:topic" element={<MathNotesPage />} />
              <Route path="mathematics/graph-practice" element={<GraphPracticePage />} />
              <Route path="mathematics/tutor" element={<Navigate to="/app/teacher" state={{ subject: 'O Level Mathematics', gradeLevel: 'Form 3-4 (O-Level)' }} replace />} />
              <Route path="mathematics/scan-solve" element={<ScanSolvePage />} />
              <Route path="mathematics/exam/setup" element={<ExamSetupPage />} />
              <Route path="mathematics/exam/session" element={<ExamSessionPage />} />
              <Route path="mathematics/exam/review" element={<ExamReviewPage />} />
              <Route path="exam/setup" element={<ExamSetupPage />} />
              <Route path="exam/session" element={<ExamSessionPage />} />
              <Route path="exam/review" element={<ExamReviewPage />} />
              {/* Individual Science Subjects */}
              <Route path="biology" element={<BiologyTopicsPage />} />
              <Route path="biology/notes/:topic" element={<ScienceNotesPage />} />
              <Route path="chemistry" element={<ChemistryTopicsPage />} />
              <Route path="chemistry/notes/:topic" element={<ScienceNotesPage />} />
              <Route path="physics" element={<PhysicsTopicsPage />} />
              <Route path="physics/notes/:topic" element={<ScienceNotesPage />} />
              <Route path="sciences" element={<ScienceTopicsPage />} />
              <Route path="sciences/quiz" element={<ScienceQuizPage />} />
              <Route path="sciences/notes/:subject/:topic" element={<ScienceNotesPage />} />
              <Route path="sciences/notes" element={<ScienceNotesPage />} />
              <Route path="sciences/tutor" element={<Navigate to="/app/teacher" state={{ subject: 'Biology' }} replace />} />
              <Route path="marketplace" element={<FindTeacherPage />} />
              <Route path="my-lessons" element={<StudentLessonsPage />} />
              <Route path="marketplace/feed" element={<TeacherFeedPage />} />
              <Route path="marketplace/teacher/:teacherId" element={<TeacherProfilePage />} />
              <Route path="marketplace/book/:teacherId" element={<BookLessonPage />} />
              <Route path="teacher-onboarding" element={<TeacherOnboardingPage />} />
              <Route path="teacher-dashboard" element={<TeacherDashboardPage />} />
              <Route path="teacher" element={<TeacherSetupPage />} />
              <Route path="teacher/chat" element={<TeacherChatPage />} />
              <Route path="teacher/history" element={<TeacherHistoryPage />} />
            </Route>
            {/* Virtual Classroom - fullscreen, outside AppLayout */}
            <Route path="/app/classroom/:bookingId" element={<ProtectedRoute><VirtualClassroomPage /></ProtectedRoute>} />

            {/* School Portal - separate auth flow */}
            <Route path="/school/:schoolSlug" element={<SchoolAuthProvider><SchoolLoginPage /></SchoolAuthProvider>} />
            <Route path="/school/:schoolSlug/dashboard" element={<SchoolAuthProvider><SchoolProtectedRoute><SchoolDashboardPage /></SchoolProtectedRoute></SchoolAuthProvider>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
