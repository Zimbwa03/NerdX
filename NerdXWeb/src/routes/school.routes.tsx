import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { SchoolAuthProvider, SchoolProtectedRoute } from '../context/SchoolAuthContext';

const SchoolLoginPage = lazy(() => import('../pages/school/SchoolLoginPage').then((m) => ({ default: m.SchoolLoginPage })));
const SchoolDashboardPage = lazy(() => import('../pages/school/SchoolDashboardPage').then((m) => ({ default: m.SchoolDashboardPage })));

export function SchoolRoutes() {
  return (
    <>
      <Route
        path="/school/:schoolSlug"
        element={<SchoolAuthProvider><SchoolLoginPage /></SchoolAuthProvider>}
      />
      <Route
        path="/school/:schoolSlug/dashboard/*"
        element={<SchoolAuthProvider><SchoolProtectedRoute><SchoolDashboardPage /></SchoolProtectedRoute></SchoolAuthProvider>}
      />
    </>
  );
}
