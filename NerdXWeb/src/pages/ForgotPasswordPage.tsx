import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send } from 'lucide-react';
import { supabase } from '../services/supabase';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: redirectUrl,
      });

      if (resetError) {
        setError(resetError.message || 'Failed to send reset email. Please try again.');
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError((err as Error).message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Link to="/" className="auth-back-btn" aria-label="Back">←</Link>

      <div className="glass-card">
        <div className="logo-section">
          <div style={{ width: 80, height: 80, borderRadius: 24, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Mail size={40} color="white" />
          </div>
          <h1 style={{ fontSize: 28 }}>Forgot Password?</h1>
          <p>Don't worry, it happens to the best of us.</p>
        </div>

        <h2 className="form-title">Reset Password</h2>
        <p className="form-subtitle">Enter your email address to receive a recovery link.</p>

        {error && <div className="auth-error">{error}</div>}
        {success && (
          <div className="auth-success">
            We've sent a password reset link to {email}. Please check your email and click the link to reset your password.
          </div>
        )}

        {!success ? (
          <form onSubmit={handleResetPassword}>
            <div className="auth-input-group">
              <span className="icon"><Mail size={22} /></span>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={isLoading}
              />
            </div>

            <button type="submit" className="gradient-btn" disabled={isLoading}>
              {isLoading ? <span className="auth-loading-spinner" style={{ width: 24, height: 24, borderWidth: 2 }} /> : (
                <>Send Reset Link <Send size={20} /></>
              )}
            </button>
          </form>
        ) : (
          <Link to="/" className="gradient-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Back to Login
          </Link>
        )}
      </div>
    </div>
  );
}
