import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, Mail } from 'lucide-react';
import { supabase } from '../services/supabase';
import { authApi } from '../services/api/authApi';

type SessionStatus = 'loading' | 'ready' | 'error' | 'expired';

export function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const hasVerifiedToken = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeSession = async () => {
      if (hasVerifiedToken.current) return;

      setSessionStatus('loading');
      setErrorMessage(null);

      try {
        // Supabase auto-parses hash with detectSessionInUrl
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          hasVerifiedToken.current = true;
          setUserEmail(session.user.email || null);
          setSessionStatus('ready');
          return;
        }

        // Parse hash manually if not yet processed
        const hash = window.location.hash;
        if (hash) {
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          const type = params.get('type');

          if (accessToken && type === 'recovery') {
            const { data, error: setError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });

            if (setError) {
              if (setError.message.includes('expired') || setError.message.includes('invalid')) {
                setSessionStatus('expired');
                setErrorMessage('This reset link has expired. Please request a new one.');
              } else {
                setSessionStatus('error');
                setErrorMessage(setError.message);
              }
              hasVerifiedToken.current = true;
            } else if (data?.session?.user) {
              hasVerifiedToken.current = true;
              setUserEmail(data.session.user.email || null);
              setSessionStatus('ready');
              window.history.replaceState(null, '', window.location.pathname);
            }
            return;
          }
        }

        // No session after a short delay
        setTimeout(async () => {
          const { data } = await supabase.auth.getSession();
          if (data?.session?.user) {
            hasVerifiedToken.current = true;
            setUserEmail(data.session.user.email || null);
            setSessionStatus('ready');
          } else {
            setSessionStatus('error');
            setErrorMessage('No reset token found. Please use the link from your email or request a new reset link.');
          }
        }, 1000);
      } catch (err) {
        setSessionStatus('error');
        setErrorMessage((err as Error).message || 'Failed to verify reset link.');
      }
    };

    initializeSession();
  }, []);

  const validatePassword = (pwd: string): string | null => {
    if (!pwd) return 'Password is required';
    if (pwd.length < 8) return 'Password must be at least 8 characters long';
    if (!/(?=.*[a-z])/.test(pwd)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(pwd)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(pwd)) return 'Password must contain at least one number';
    return null;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (sessionStatus !== 'ready') {
      setErrorMessage('Session not ready. Please use a valid reset link from your email.');
      return;
    }

    if (!password || !confirmPassword) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    const pwdError = validatePassword(password);
    if (pwdError) {
      setErrorMessage(pwdError);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (error || !sessionData?.session) {
        throw new Error('Session expired. Please request a new reset link.');
      }

      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      const email = sessionData.session.user.email || userEmail;
      if (email) {
        try {
          await authApi.resetPassword({ email, new_password: password });
        } catch {
          // Backend sync is secondary
        }
      }

      await supabase.auth.signOut();
      navigate('/', { replace: true });
      alert('Password reset successful! Please login with your new password.');
    } catch (err) {
      setErrorMessage((err as Error).message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  if (sessionStatus === 'loading') {
    return (
      <div className="auth-page">
        <div className="auth-loading">
          <div className="auth-loading-spinner" />
          <p>Verifying your reset link...</p>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (sessionStatus === 'error' || sessionStatus === 'expired') {
    return (
      <div className="auth-page">
        <Link to="/" className="auth-back-btn" aria-label="Back">←</Link>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <div style={{ width: 100, height: 100, borderRadius: 50, background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Lock size={50} color="#ef4444" />
          </div>
          <h2 style={{ marginBottom: 12 }}>{sessionStatus === 'expired' ? 'Link Expired' : 'Invalid Link'}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>{errorMessage}</p>
          <Link to="/forgot-password" className="gradient-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Mail size={20} /> Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <Link to="/" className="auth-back-btn" aria-label="Back">←</Link>

      <div className="glass-card">
        <div className="logo-section">
          <div style={{ width: 80, height: 80, borderRadius: 24, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Lock size={40} color="white" />
          </div>
          <h1 style={{ fontSize: 28 }}>Reset Password</h1>
          <p>{userEmail ? `Enter a new password for ${userEmail}` : 'Enter your new password below'}</p>
        </div>

        <h2 className="form-title">New Password</h2>
        <p className="form-subtitle">Create a strong password for your account.</p>

        {errorMessage && <div className="auth-error">{errorMessage}</div>}

        <form onSubmit={handleResetPassword}>
          <div className="auth-input-group">
            <span className="icon"><Lock size={22} /></span>
            <input type={showPassword ? 'text' : 'password'} placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
            <button type="button" className="toggle-pw" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={22} /> : <Eye size={22} />}</button>
          </div>

          <div className="auth-input-group">
            <span className="icon"><Lock size={22} /></span>
            <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} />
            <button type="button" className="toggle-pw" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}</button>
          </div>

          <div style={{ marginBottom: 24, padding: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Password must contain:</p>
            <p style={{ fontSize: 12, color: password.length >= 8 ? '#4ade80' : 'var(--text-muted)' }}>• At least 8 characters</p>
            <p style={{ fontSize: 12, color: /(?=.*[a-z])/.test(password) ? '#4ade80' : 'var(--text-muted)' }}>• One lowercase letter</p>
            <p style={{ fontSize: 12, color: /(?=.*[A-Z])/.test(password) ? '#4ade80' : 'var(--text-muted)' }}>• One uppercase letter</p>
            <p style={{ fontSize: 12, color: /(?=.*\d)/.test(password) ? '#4ade80' : 'var(--text-muted)' }}>• One number</p>
          </div>

          <button
            type="submit"
            className="gradient-btn"
            disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
          >
            {isLoading ? <span className="auth-loading-spinner" style={{ width: 24, height: 24, borderWidth: 2 }} /> : (
              <>Reset Password <CheckCircle size={20} /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
