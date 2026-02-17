import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Lock, Eye, EyeOff, ArrowRight, GraduationCap, BookOpen, Gift } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api/authApi';
import { supabase } from '../services/supabase';

const REFERRAL_STORAGE_KEY = 'nerdx_referral_code';

const formatDateOfBirth = (text: string) => {
  const cleaned = text.replace(/\D/g, '');
  let formatted = cleaned.substring(0, 2);
  if (cleaned.length > 2) formatted += '/' + cleaned.substring(2, 4);
  if (cleaned.length > 4) formatted += '/' + cleaned.substring(4, 8);
  return formatted;
};

function getReferralCode(searchParams: URLSearchParams): string {
  const fromUrl = (searchParams.get('ref') || '').trim().toUpperCase();
  if (fromUrl) {
    try { localStorage.setItem(REFERRAL_STORAGE_KEY, fromUrl); } catch { /* noop */ }
    return fromUrl;
  }
  try { return (localStorage.getItem(REFERRAL_STORAGE_KEY) || '').trim().toUpperCase(); } catch { return ''; }
}

function clearStoredReferral() {
  try { localStorage.removeItem(REFERRAL_STORAGE_KEY); } catch { /* noop */ }
}

export function RegisterPage() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState<'student' | 'teacher'>(
    searchParams.get('role') === 'teacher' ? 'teacher' : 'student'
  );
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const referralCode = getReferralCode(searchParams);

  useEffect(() => {
    if (searchParams.get('role') === 'teacher') setRole('teacher');
  }, [searchParams]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !surname || !password) {
      setError('Name, surname, and password are required');
      return;
    }
    if (!email && !phoneNumber) {
      setError('Email or phone number is required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const registerData = {
        name: name.trim(),
        surname: surname.trim(),
        email: email.trim().toLowerCase() || undefined,
        phone_number: phoneNumber.trim() || undefined,
        password,
        date_of_birth: dateOfBirth || undefined,
        role,
        referred_by: referralCode || undefined,
      };

      const response = await authApi.register(registerData);

      if (response.success && response.token && response.user) {
        clearStoredReferral();
        if (!response.message) {
          const supabaseCredentials = email.trim()
            ? { email: email.trim().toLowerCase(), password }
            : undefined;
          await login(response.user, response.token, undefined, supabaseCredentials);
          if (role === 'teacher') {
            navigate('/app/teacher-onboarding', { replace: true });
          } else {
            navigate('/app', { replace: true });
          }
        } else {
          navigate('/verify-email', { replace: true });
        }
      } else if (response.success && response.message) {
        clearStoredReferral();
        navigate('/verify-email', { replace: true });
      } else {
        setError(response.message || 'Failed to create account');
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
    if (referralCode) {
      try { localStorage.setItem(REFERRAL_STORAGE_KEY, referralCode); } catch { /* noop */ }
    }
    try {
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      });
      if (oauthError) throw oauthError;
      if (data?.url) window.location.href = data.url;
    } catch (err) {
      setError((err as Error).message || 'Google Sign-Up failed');
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
          <h1 className="auth-brand__title">{role === 'teacher' ? 'Start Teaching on NerdX' : 'Start Your Learning Journey'}</h1>
          <p className="auth-brand__desc">{role === 'teacher' ? 'Join our marketplace of verified teachers. Share your knowledge with 5,000+ students across Zimbabwe.' : 'Join thousands of students acing their ZIMSEC exams with AI-powered learning.'}</p>
          <div className="auth-brand__stats">
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
          </div>
          <img src="/images/students-celebrating.png" alt="Students celebrating" className="auth-brand__image" />
        </div>
      </div>

      <div className="auth-layout__form">
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <h2 className="auth-form__title">Create Account</h2>
            <p className="auth-form__subtitle">Fill in your details to get started</p>
          </div>

          {referralCode && (
            <div className="auth-referral-banner" style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
              background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 12, marginBottom: 16, color: '#6EE7B7', fontSize: 14,
            }}>
              <Gift size={18} style={{ flexShrink: 0 }} />
              <span>You were invited by a friend! Referral code <strong>{referralCode}</strong> applied.</span>
            </div>
          )}

          <div className="auth-role-toggle">
            <button
              type="button"
              className={`auth-role-toggle__btn${role === 'student' ? ' auth-role-toggle__btn--active' : ''}`}
              onClick={() => setRole('student')}
            >
              <BookOpen size={16} />
              I'm a Student
            </button>
            <button
              type="button"
              className={`auth-role-toggle__btn${role === 'teacher' ? ' auth-role-toggle__btn--active' : ''}`}
              onClick={() => setRole('teacher')}
            >
              <GraduationCap size={16} />
              I'm a Teacher
            </button>
          </div>

          {error && <div className="auth-alert auth-alert--error">{error}</div>}

          <form onSubmit={handleRegister} className="auth-form">
            <div className="auth-field-row">
              <div className="auth-field">
                <label className="auth-field__label">First Name</label>
                <div className="auth-field__input-wrap">
                  <User size={18} className="auth-field__icon" />
                  <input type="text" placeholder="First name" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} className="auth-field__input" />
                </div>
              </div>
              <div className="auth-field">
                <label className="auth-field__label">Surname</label>
                <div className="auth-field__input-wrap">
                  <User size={18} className="auth-field__icon" />
                  <input type="text" placeholder="Surname" value={surname} onChange={(e) => setSurname(e.target.value)} disabled={isLoading} className="auth-field__input" />
                </div>
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-field__label">Email Address</label>
              <div className="auth-field__input-wrap">
                <Mail size={18} className="auth-field__icon" />
                <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} className="auth-field__input" />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-field__label">Phone Number (optional)</label>
              <div className="auth-field__input-wrap">
                <Phone size={18} className="auth-field__icon" />
                <input type="tel" placeholder="+263 7X XXX XXXX" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} disabled={isLoading} className="auth-field__input" />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-field__label">Date of Birth</label>
              <div className="auth-field__input-wrap">
                <Calendar size={18} className="auth-field__icon" />
                <input type="text" placeholder="DD/MM/YYYY" value={dateOfBirth} onChange={(e) => setDateOfBirth(formatDateOfBirth(e.target.value))} maxLength={10} disabled={isLoading} className="auth-field__input" />
              </div>
            </div>

            <div className="auth-field-row">
              <div className="auth-field">
                <label className="auth-field__label">Password</label>
                <div className="auth-field__input-wrap">
                  <Lock size={18} className="auth-field__icon" />
                  <input type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} className="auth-field__input" />
                  <button type="button" className="auth-field__toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
              </div>
              <div className="auth-field">
                <label className="auth-field__label">Confirm Password</label>
                <div className="auth-field__input-wrap">
                  <Lock size={18} className="auth-field__icon" />
                  <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} className="auth-field__input" />
                  <button type="button" className="auth-field__toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={isLoading}>
              {isLoading ? <span className="auth-spinner" /> : (<>{role === 'teacher' ? 'Create Teacher Account' : 'Create Account'} <ArrowRight size={18} /></>)}
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
            Already have an account? <Link to={`/login${role === 'teacher' ? '?role=teacher' : ''}`} className="auth-switch__link">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
