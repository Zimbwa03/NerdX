import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api/authApi';
import { supabase } from '../services/supabase';

export function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.login({ identifier, password });

      if (response.success && response.token && response.user) {
        const isEmail = identifier.includes('@');
        const supabaseCredentials = isEmail
          ? { email: identifier.toLowerCase().trim(), password }
          : undefined;

        await login(response.user, response.token, response.notifications, supabaseCredentials);
        navigate('/app', { replace: true });
      } else {
        setError(response.message || 'Invalid credentials');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      });

      if (oauthError) throw oauthError;
      if (data?.url) window.location.href = data.url;
    } catch (err) {
      setError((err as Error).message || 'Google Sign-In failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="glass-card" style={{ position: 'relative' }}>
        <div className="logo-section">
          <img src="/logo.png" alt="NerdX" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <h1>NerdX</h1>
          <p>Master Your Future</p>
        </div>

        <h2 className="form-title">Welcome Back</h2>
        <p className="form-subtitle">Sign in to continue learning</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="auth-input-group">
            <span className="icon"><Mail size={22} /></span>
            <input
              type="text"
              placeholder="Email or Phone Number"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="email"
              disabled={isLoading}
            />
          </div>

          <div className="auth-input-group">
            <span className="icon"><Lock size={22} /></span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={isLoading}
            />
            <button type="button" className="toggle-pw" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password">
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          <div style={{ textAlign: 'right', marginBottom: 20 }}>
            <Link to="/forgot-password" className="auth-link" style={{ fontSize: 13 }}>Forgot Password?</Link>
          </div>

          <button type="submit" className="gradient-btn" disabled={isLoading}>
            {isLoading ? <span className="auth-loading-spinner" style={{ width: 24, height: 24, borderWidth: 2 }} /> : (
              <>Sign In <ArrowRight size={20} /></>
            )}
          </button>
        </form>

        <div className="auth-separator">
          <span>OR</span>
        </div>

        <button type="button" className="google-btn" onClick={handleGoogleSignIn} disabled={isLoading}>
          <img src="https://www.google.com/favicon.ico" alt="" />
          Continue with Google
        </button>
      </div>

      <p style={{ marginTop: 28, color: 'var(--text-secondary)', fontSize: 15 }}>
        Don't have an account? <Link to="/register" className="auth-link">Sign Up</Link>
      </p>
    </div>
  );
}
