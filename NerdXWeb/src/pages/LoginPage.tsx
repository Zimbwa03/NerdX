import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, BookOpen, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api/authApi';
import { supabase } from '../services/supabase';

export function LoginPage() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState<'student' | 'teacher'>(
    searchParams.get('role') === 'teacher' ? 'teacher' : 'student'
  );
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('role') === 'teacher') setRole('teacher');
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.login({ identifier, password, role });

      if (response.success && response.token && response.user) {
        const isEmail = identifier.includes('@');
        const supabaseCredentials = isEmail
          ? { email: identifier.toLowerCase().trim(), password }
          : undefined;

        await login(response.user, response.token, response.notifications, supabaseCredentials);

        // Role-based routing
        const userRole = response.user.role || role;
        if (userRole === 'teacher') {
          // Teacher: go to dashboard if they have a profile, otherwise onboarding
          if (response.user.teacher_profile_id) {
            navigate('/app/teacher-dashboard', { replace: true });
          } else {
            navigate('/app/teacher-onboarding', { replace: true });
          }
        } else {
          navigate('/app', { replace: true });
        }
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
    <div className="auth-layout">
      <div className="auth-layout__brand">
        <div className="auth-layout__brand-inner">
          <Link to="/" className="auth-logo">
            <img src="/logo.png" alt="NerdX" className="auth-logo__img" />
            <span className="auth-logo__text">NerdX</span>
          </Link>
          <h1 className="auth-brand__title">
            {role === 'teacher' ? 'Empower Students Across Zimbabwe' : 'Master Your Future with AI'}
          </h1>
          <p className="auth-brand__desc">
            {role === 'teacher'
              ? 'Sign in to manage your lessons, connect with students, and grow your teaching career on NerdX.'
              : 'Join thousands of ZIMSEC students who are learning smarter, not harder.'}
          </p>
          <div className="auth-brand__stats">
            {role === 'teacher' ? (
              <>
                <div className="auth-brand__stat">
                  <strong>5,000+</strong>
                  <span>Students</span>
                </div>
                <div className="auth-brand__stat">
                  <strong>50+</strong>
                  <span>Teachers</span>
                </div>
                <div className="auth-brand__stat">
                  <strong>500+</strong>
                  <span>Lessons</span>
                </div>
              </>
            ) : (
              <>
                <div className="auth-brand__stat">
                  <strong>5,000+</strong>
                  <span>Students</span>
                </div>
                <div className="auth-brand__stat">
                  <strong>10+</strong>
                  <span>Subjects</span>
                </div>
                <div className="auth-brand__stat">
                  <strong>95%</strong>
                  <span>Pass Rate</span>
                </div>
              </>
            )}
          </div>
          <img src="/images/students-learning.png" alt="Students using NerdX" className="auth-brand__image" />
        </div>
      </div>

      <div className="auth-layout__form">
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <h2 className="auth-form__title">Welcome Back</h2>
            <p className="auth-form__subtitle">
              {role === 'teacher'
                ? 'Sign in to your teaching dashboard'
                : 'Sign in to continue your learning journey'}
            </p>
          </div>

          {/* Role toggle */}
          <div className="auth-role-toggle">
            <button
              type="button"
              className={`auth-role-toggle__btn${role === 'student' ? ' auth-role-toggle__btn--active' : ''}`}
              onClick={() => { setRole('student'); setError(''); }}
            >
              <BookOpen size={16} />
              I'm a Student
            </button>
            <button
              type="button"
              className={`auth-role-toggle__btn${role === 'teacher' ? ' auth-role-toggle__btn--active' : ''}`}
              onClick={() => { setRole('teacher'); setError(''); }}
            >
              <GraduationCap size={16} />
              I'm a Teacher
            </button>
          </div>

          {error && <div className="auth-alert auth-alert--error">{error}</div>}

          <form onSubmit={handleLogin} className="auth-form">
            <div className="auth-field">
              <label className="auth-field__label">Email or Phone</label>
              <div className="auth-field__input-wrap">
                <Mail size={18} className="auth-field__icon" />
                <input
                  type="text"
                  placeholder="Enter your email or phone"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="email"
                  disabled={isLoading}
                  className="auth-field__input"
                />
              </div>
            </div>

            <div className="auth-field">
              <div className="auth-field__label-row">
                <label className="auth-field__label">Password</label>
                <Link to="/forgot-password" className="auth-field__forgot">Forgot?</Link>
              </div>
              <div className="auth-field__input-wrap">
                <Lock size={18} className="auth-field__icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={isLoading}
                  className="auth-field__input"
                />
                <button type="button" className="auth-field__toggle" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={isLoading}>
              {isLoading ? <span className="auth-spinner" /> : (
                <>{role === 'teacher' ? 'Sign In as Teacher' : 'Sign In'} <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <button type="button" className="auth-google" onClick={handleGoogleSignIn} disabled={isLoading}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 001 12c0 1.94.46 3.77 1.18 5.07l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google
          </button>

          <p className="auth-switch">
            Don't have an account? <Link to={`/register${role === 'teacher' ? '?role=teacher' : ''}`} className="auth-switch__link">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
