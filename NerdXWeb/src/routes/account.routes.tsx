import { lazy } from 'react';
import { Route } from 'react-router-dom';

const AccountPage = lazy(() => import('../pages/AccountPage').then((m) => ({ default: m.AccountPage })));
const CreditsPage = lazy(() => import('../pages/CreditsPage').then((m) => ({ default: m.CreditsPage })));
const ProgressPage = lazy(() => import('../pages/ProgressPage').then((m) => ({ default: m.ProgressPage })));
const ReferralHubPage = lazy(() => import('../pages/account/ReferralHubPage').then((m) => ({ default: m.ReferralHubPage })));
const BillingHistoryPage = lazy(() => import('../pages/account/BillingHistoryPage').then((m) => ({ default: m.BillingHistoryPage })));
const SecurityCenterPage = lazy(() => import('../pages/account/SecurityCenterPage').then((m) => ({ default: m.SecurityCenterPage })));
const LearningPreferencesPage = lazy(() => import('../pages/account/LearningPreferencesPage').then((m) => ({ default: m.LearningPreferencesPage })));
const NotificationsPage = lazy(() => import('../pages/notifications/NotificationsPage').then((m) => ({ default: m.NotificationsPage })));
const NotificationDetailPage = lazy(() => import('../pages/notifications/NotificationDetailPage').then((m) => ({ default: m.NotificationDetailPage })));

export function AccountRoutes() {
  return (
    <>
      <Route path="account" element={<AccountPage />} />
      <Route path="credits" element={<CreditsPage />} />
      <Route path="progress" element={<ProgressPage />} />
      <Route path="ai-insights" element={<ProgressPage />} />
      <Route path="referral" element={<ReferralHubPage />} />
      <Route path="billing" element={<BillingHistoryPage />} />
      <Route path="security" element={<SecurityCenterPage />} />
      <Route path="preferences" element={<LearningPreferencesPage />} />
      <Route path="notifications" element={<NotificationsPage />} />
      <Route path="notifications/:id" element={<NotificationDetailPage />} />
    </>
  );
}
