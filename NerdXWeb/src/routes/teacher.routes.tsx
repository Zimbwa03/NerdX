import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { TeacherAuthProvider, TeacherProtectedRoute } from '../context/TeacherAuthContext';

// Teacher AI tutor
const TeacherSetupPage = lazy(() => import('../pages/teacher/TeacherSetupPage').then((m) => ({ default: m.TeacherSetupPage })));
const TeacherChatPage = lazy(() => import('../pages/teacher/TeacherChatPage').then((m) => ({ default: m.TeacherChatPage })));
const TeacherHistoryPage = lazy(() => import('../pages/teacher/TeacherHistoryPage').then((m) => ({ default: m.TeacherHistoryPage })));

// Teacher marketplace
const FindTeacherPage = lazy(() => import('../pages/teacher-marketplace/FindTeacherPage').then((m) => ({ default: m.FindTeacherPage })));
const TeacherProfilePage = lazy(() => import('../pages/teacher-marketplace/TeacherProfilePage').then((m) => ({ default: m.TeacherProfilePage })));
const BookLessonPage = lazy(() => import('../pages/teacher-marketplace/BookLessonPage').then((m) => ({ default: m.BookLessonPage })));
const TeacherFeedPage = lazy(() => import('../pages/teacher-marketplace/TeacherFeedPage').then((m) => ({ default: m.TeacherFeedPage })));
const TeacherOnboardingPage = lazy(() => import('../pages/teacher-marketplace/TeacherOnboardingPage').then((m) => ({ default: m.TeacherOnboardingPage })));
const TeacherDashboardPage = lazy(() => import('../pages/teacher-marketplace/TeacherDashboardPage').then((m) => ({ default: m.TeacherDashboardPage })));
const VirtualClassroomPage = lazy(() => import('../pages/teacher-marketplace/VirtualClassroomPage').then((m) => ({ default: m.VirtualClassroomPage })));
const StudentLessonsPage = lazy(() => import('../pages/teacher-marketplace/StudentLessonsPage').then((m) => ({ default: m.StudentLessonsPage })));

// Teacher portal (school-specific)
const TeacherLoginPage = lazy(() => import('../pages/teacher-portal/TeacherLoginPage').then((m) => ({ default: m.TeacherLoginPage })));
const TeacherPortalDashboard = lazy(() => import('../pages/teacher-portal/TeacherPortalDashboard').then((m) => ({ default: m.TeacherPortalDashboard })));
const TeacherClassroomView = lazy(() => import('../pages/teacher-portal/TeacherClassroomView').then((m) => ({ default: m.TeacherClassroomView })));

/** Routes rendered inside /app (inside AppLayout + ProtectedRoute) */
export function TeacherAppRoutes() {
  return (
    <>
      <Route path="teacher" element={<TeacherSetupPage />} />
      <Route path="teacher/chat" element={<TeacherChatPage />} />
      <Route path="teacher/history" element={<TeacherHistoryPage />} />
      <Route path="marketplace" element={<FindTeacherPage />} />
      <Route path="my-lessons" element={<StudentLessonsPage />} />
      <Route path="marketplace/feed" element={<TeacherFeedPage />} />
      <Route path="marketplace/teacher/:teacherId" element={<TeacherProfilePage />} />
      <Route path="marketplace/book/:teacherId" element={<BookLessonPage />} />
      <Route path="teacher-onboarding" element={<TeacherOnboardingPage />} />
      <Route path="teacher-dashboard" element={<TeacherDashboardPage />} />
    </>
  );
}

/** Virtual classroom — fullscreen, outside AppLayout */
export function VirtualClassroomRoute() {
  return (
    <Route
      path="/app/classroom/:bookingId"
      element={<ProtectedRoute><VirtualClassroomPage /></ProtectedRoute>}
    />
  );
}

/** Teacher portal routes — separate auth flow under /school/:schoolId */
export function TeacherPortalRoutes() {
  return (
    <>
      <Route
        path="/school/:schoolId/teacher-login"
        element={<TeacherAuthProvider><TeacherLoginPage /></TeacherAuthProvider>}
      />
      <Route
        path="/school/:schoolId/teacher/dashboard"
        element={<TeacherAuthProvider><TeacherProtectedRoute><TeacherPortalDashboard /></TeacherProtectedRoute></TeacherAuthProvider>}
      />
      <Route
        path="/school/:schoolId/teacher/classroom/:classroomId"
        element={<TeacherAuthProvider><TeacherProtectedRoute><TeacherClassroomView /></TeacherProtectedRoute></TeacherAuthProvider>}
      />
      <Route
        path="/school/:schoolId/teacher/classroom/:classroomId/student/:studentId"
        element={<TeacherAuthProvider><TeacherProtectedRoute><TeacherClassroomView /></TeacherProtectedRoute></TeacherAuthProvider>}
      />
    </>
  );
}
