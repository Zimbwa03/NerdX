import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/AppLayout';
import { Seo } from './components/Seo';
import { PageLoadingView } from './components/PageLoadingView';
import { RouteErrorBoundary } from './components/RouteErrorBoundary';

import { AdminGatewayPage } from './pages/AdminGatewayPage';

// Route modules — each owns its own lazy imports
import { AuthRoutes } from './routes/auth.routes';
import { SubjectRoutes } from './routes/subjects.routes';
import { AccountRoutes } from './routes/account.routes';
import { TeacherAppRoutes, VirtualClassroomRoute, TeacherPortalRoutes } from './routes/teacher.routes';
import { ToolRoutes } from './routes/tools.routes';
import { SchoolRoutes } from './routes/school.routes';

const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

const routeLoadingFallback = (
  <div className="min-h-screen bg-[#0a0c0f]">
    <PageLoadingView title="Loading NerdX" subtitle="Preparing your workspace…" className="min-h-screen" />
  </div>
);

// AppLayout wrapped in an error boundary so a crash in one subject/tool
// renders an inline recovery UI instead of a white screen.
function SafeAppLayout() {
  return (
    <RouteErrorBoundary section="App">
      <AppLayout />
    </RouteErrorBoundary>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Seo />
          <Suspense fallback={routeLoadingFallback}>
            <Routes>
              {/* Public auth routes */}
              {AuthRoutes()}

              {/* Admin — full URL hits Vite proxy; in-SPA links hit AdminGateway → full reload */}
              <Route path="/admin/*" element={<AdminGatewayPage />} />

              {/* Main authenticated app — SafeAppLayout adds per-section error recovery */}
              <Route path="/app" element={<ProtectedRoute><SafeAppLayout /></ProtectedRoute>}>
                <Route index element={<DashboardPage />} />
                {AccountRoutes()}
                {SubjectRoutes()}
                {ToolRoutes()}
                {TeacherAppRoutes()}
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Virtual classroom — fullscreen, outside AppLayout */}
              {VirtualClassroomRoute()}

              {/* School portal — separate auth flow */}
              {SchoolRoutes()}

              {/* Teacher portal — separate auth flow */}
              {TeacherPortalRoutes()}

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
