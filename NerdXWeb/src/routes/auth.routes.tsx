import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { PublicRoute } from '../components/PublicRoute';

const LandingPage = lazy(() => import('../pages/LandingPage').then((m) => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('../pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../pages/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })));
const EmailVerificationPage = lazy(() => import('../pages/EmailVerificationPage').then((m) => ({ default: m.EmailVerificationPage })));
const AuthCallbackPage = lazy(() => import('../pages/AuthCallbackPage').then((m) => ({ default: m.AuthCallbackPage })));

export function AuthRoutes() {
  return (
    <>
      <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
      <Route path="/verify-email" element={<PublicRoute><EmailVerificationPage /></PublicRoute>} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
    </>
  );
}
