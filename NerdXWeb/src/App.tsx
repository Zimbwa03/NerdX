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
import { BESTopicsPage } from './pages/business-enterprise-skills/BESTopicsPage';
import { BESNotesPage } from './pages/business-enterprise-skills/BESNotesPage';
import { BESNoteDetailPage } from './pages/business-enterprise-skills/BESNoteDetailPage';
import { HistoryTopicsPage } from './pages/history/HistoryTopicsPage';
import { HistoryNotesPage } from './pages/history/HistoryNotesPage';
import { HistoryNoteDetailPage } from './pages/history/HistoryNoteDetailPage';
import { HistoryEssayPage } from './pages/history/HistoryEssayPage';
import { AgentHubPage } from './pages/agents/AgentHubPage';
import { AgentBuilderPage } from './pages/agents/AgentBuilderPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
            <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
            <Route path="/verify-email" element={<PublicRoute><EmailVerificationPage /></PublicRoute>} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<DashboardPage />} />
              <Route path="credits" element={<CreditsPage />} />
              <Route path="account" element={<AccountPage />} />
              <Route path="progress" element={<ProgressPage />} />
              <Route path="agents" element={<AgentHubPage />} />
              <Route path="agents/builder" element={<AgentBuilderPage />} />
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
              <Route path="commerce" element={<CommerceTopicsPage />} />
              <Route path="commerce/notes" element={<CommerceNotesPage />} />
              <Route path="commerce/notes/:topicSlug" element={<CommerceNoteDetailPage />} />
              <Route path="business-enterprise-skills" element={<BESTopicsPage />} />
              <Route path="business-enterprise-skills/notes" element={<BESNotesPage />} />
              <Route path="business-enterprise-skills/notes/:topicSlug" element={<BESNoteDetailPage />} />
              <Route path="history" element={<HistoryTopicsPage />} />
              <Route path="history/notes" element={<HistoryNotesPage />} />
              <Route path="history/notes/:topicSlug" element={<HistoryNoteDetailPage />} />
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
              {/* Redirect old combined sciences route to biology for backwards compatibility */}
              <Route path="sciences" element={<Navigate to="/app/biology" replace />} />
              <Route path="sciences/quiz" element={<ScienceQuizPage />} />
              <Route path="sciences/notes/:subject/:topic" element={<ScienceNotesPage />} />
              <Route path="sciences/notes" element={<ScienceNotesPage />} />
              <Route path="sciences/tutor" element={<Navigate to="/app/teacher" state={{ subject: 'Biology' }} replace />} />
              <Route path="teacher" element={<TeacherSetupPage />} />
              <Route path="teacher/chat" element={<TeacherChatPage />} />
              <Route path="teacher/history" element={<TeacherHistoryPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
