import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { AppLayout } from './components/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { EmailVerificationPage } from './pages/EmailVerificationPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreditsPage } from './pages/CreditsPage';
import { AccountPage } from './pages/AccountPage';
import { ProgressPage } from './pages/ProgressPage';
import { MathematicsTopicsPage } from './pages/mathematics/MathematicsTopicsPage';
import { QuizPage } from './pages/mathematics/QuizPage';
import { MathNotesPage } from './pages/mathematics/MathNotesPage';
import { GraphPracticePage } from './pages/mathematics/GraphPracticePage';
import { TeacherSetupPage } from './pages/teacher/TeacherSetupPage';
import { TeacherChatPage } from './pages/teacher/TeacherChatPage';
import { TeacherHistoryPage } from './pages/teacher/TeacherHistoryPage';
import { ScanSolvePage } from './pages/mathematics/ScanSolvePage';
import { ExamSetupPage } from './pages/mathematics/ExamSetupPage';
import { ExamSessionPage } from './pages/mathematics/ExamSessionPage';
import { ExamReviewPage } from './pages/mathematics/ExamReviewPage';
import { ScienceQuizPage } from './pages/sciences/ScienceQuizPage';
import { ScienceNotesPage } from './pages/sciences/ScienceNotesPage';
import { ScienceTopicsPage } from './pages/sciences/ScienceTopicsPage';
import { BiologyTopicsPage } from './pages/biology/BiologyTopicsPage';
import { ChemistryTopicsPage } from './pages/chemistry/ChemistryTopicsPage';
import { PhysicsTopicsPage } from './pages/physics/PhysicsTopicsPage';
import { EnglishTopicsPage } from './pages/english/EnglishTopicsPage';
import { EnglishComprehensionPage } from './pages/english/EnglishComprehensionPage';
import { EnglishEssayPage } from './pages/english/EnglishEssayPage';
import { ComputerScienceTopicsPage } from './pages/computer-science/ComputerScienceTopicsPage';
import { ComputerScienceNotesPage } from './pages/computer-science/ComputerScienceNotesPage';
import { ComputerScienceNoteDetailPage } from './pages/computer-science/ComputerScienceNoteDetailPage';
import { CommerceTopicsPage } from './pages/commerce/CommerceTopicsPage';
import { CommerceNotesPage } from './pages/commerce/CommerceNotesPage';
import { CommerceNoteDetailPage } from './pages/commerce/CommerceNoteDetailPage';
import { GeographyTopicsPage } from './pages/geography/GeographyTopicsPage';
import { GeographyNotesPage } from './pages/geography/GeographyNotesPage';
import { GeographyNoteDetailPage } from './pages/geography/GeographyNoteDetailPage';
import { BESTopicsPage } from './pages/business-enterprise-skills/BESTopicsPage';
import { BESNotesPage } from './pages/business-enterprise-skills/BESNotesPage';
import { BESNoteDetailPage } from './pages/business-enterprise-skills/BESNoteDetailPage';
import { HistoryTopicsPage } from './pages/history/HistoryTopicsPage';
import { HistoryNotesPage } from './pages/history/HistoryNotesPage';
import { HistoryNoteDetailPage } from './pages/history/HistoryNoteDetailPage';
import { HistoryEssayPage } from './pages/history/HistoryEssayPage';
import { AgentHubPage } from './pages/agents/AgentHubPage';
import { AgentBuilderPage } from './pages/agents/AgentBuilderPage';
import { VirtualLabHubPage } from './pages/virtual-lab/VirtualLabHubPage';
import { VirtualLabSimulationPage } from './pages/virtual-lab/VirtualLabSimulationPage';
import { ALevelPlaceholderPage } from './pages/a-level/ALevelPlaceholderPage';
import { ALevelPureMathPage } from './pages/a-level/ALevelPureMathPage';
import { ALevelPureMathNotesPage } from './pages/a-level/ALevelPureMathNotesPage';
import { ALevelPureMathNoteDetailPage } from './pages/a-level/ALevelPureMathNoteDetailPage';
import { ALevelBiologyTopicsPage } from './pages/a-level-biology/ALevelBiologyTopicsPage';
import { ALevelBiologyNotesPage } from './pages/a-level-biology/ALevelBiologyNotesPage';
import { ALevelBiologyNoteDetailPage } from './pages/a-level-biology/ALevelBiologyNoteDetailPage';
import { ALevelChemistryTopicsPage } from './pages/a-level-chemistry/ALevelChemistryTopicsPage';
import { ALevelChemistryNotesPage } from './pages/a-level-chemistry/ALevelChemistryNotesPage';
import { ALevelChemistryNoteDetailPage } from './pages/a-level-chemistry/ALevelChemistryNoteDetailPage';
import { ALevelPhysicsTopicsPage } from './pages/a-level-physics/ALevelPhysicsTopicsPage';
import { ALevelPhysicsNotesPage } from './pages/a-level-physics/ALevelPhysicsNotesPage';
import { ALevelPhysicsNoteDetailPage } from './pages/a-level-physics/ALevelPhysicsNoteDetailPage';
import { ALevelComputerScienceTopicsPage } from './pages/a-level-computer-science/ALevelComputerScienceTopicsPage';
import { ALevelComputerScienceNotesPage } from './pages/a-level-computer-science/ALevelComputerScienceNotesPage';
import { ALevelComputerScienceNoteDetailPage } from './pages/a-level-computer-science/ALevelComputerScienceNoteDetailPage';
import { ALevelGeographyTopicsPage } from './pages/a-level-geography/ALevelGeographyTopicsPage';
import { ALevelGeographyNotesPage } from './pages/a-level-geography/ALevelGeographyNotesPage';
import { ALevelGeographyNoteDetailPage } from './pages/a-level-geography/ALevelGeographyNoteDetailPage';
import { FormulaSheetPage } from './pages/tools/FormulaSheetPage';
import { PastPapersPage } from './pages/tools/PastPapersPage';
import { AccountingPage } from './pages/accounting/AccountingPage';
import { AccountingNotesPage } from './pages/accounting/AccountingNotesPage';
import { AccountingNoteDetailPage } from './pages/accounting/AccountingNoteDetailPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { NotificationDetailPage } from './pages/notifications/NotificationDetailPage';
import { ReferralHubPage } from './pages/account/ReferralHubPage';
import { BillingHistoryPage } from './pages/account/BillingHistoryPage';
import { SecurityCenterPage } from './pages/account/SecurityCenterPage';
import { LearningPreferencesPage } from './pages/account/LearningPreferencesPage';
import { ProjectAssistantHubPage } from './pages/project-assistant/ProjectAssistantHubPage';
import { ProjectAssistantChatPage } from './pages/project-assistant/ProjectAssistantChatPage';
import { NerdXLivePage } from './pages/nerdx-live/NerdXLivePage';
import { OfflineChatPage } from './pages/tools/OfflineChatPage';
import { FindTeacherPage } from './pages/teacher-marketplace/FindTeacherPage';
import { TeacherProfilePage } from './pages/teacher-marketplace/TeacherProfilePage';
import { BookLessonPage } from './pages/teacher-marketplace/BookLessonPage';
import { TeacherFeedPage } from './pages/teacher-marketplace/TeacherFeedPage';
import { TeacherOnboardingPage } from './pages/teacher-marketplace/TeacherOnboardingPage';
import { TeacherDashboardPage } from './pages/teacher-marketplace/TeacherDashboardPage';
import { VirtualClassroomPage } from './pages/teacher-marketplace/VirtualClassroomPage';
import { StudentLessonsPage } from './pages/teacher-marketplace/StudentLessonsPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
