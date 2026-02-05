import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api/authApi';
import { supabase } from '../services/supabase';

const formatDateOfBirth = (text: string) => {
  const cleaned = text.replace(/\D/g, '');
  let formatted = cleaned.substring(0, 2);
  if (cleaned.length > 2) formatted += '/' + cleaned.substring(2, 4);
  if (cleaned.length > 4) formatted += '/' + cleaned.substring(4, 8);
  return formatted;
};

export function RegisterPage() {
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
      };

      const response = await authApi.register(registerData);

      if (response.success && response.token && response.user) {
        if (!response.message) {
          const supabaseCredentials = email.trim()
            ? { email: email.trim().toLowerCase(), password }
            : undefined;
          await login(response.user, response.token, undefined, supabaseCredentials);
          navigate('/app', { replace: true });
        } else {
          navigate('/verify-email', { replace: true });
        }
      } else if (response.success && response.message) {
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
    <div className="auth-page">
      <Link to="/" className="auth-back-btn" aria-label="Back">←</Link>

      <div className="glass-card" style={{ maxWidth: 480, marginTop: 40 }}>
        <div className="logo-section">
          <img src="/logo.png" alt="NerdX" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <h1 style={{ fontSize: 28 }}>Create Account</h1>
          <p>Join NerdX Learning Platform</p>
        </div>

        <h2 className="form-title">Sign Up</h2>
        <p className="form-subtitle">Fill in your details to get started</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleRegister}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
            <div className="auth-input-group" style={{ flex: 1 }}>
              <span className="icon"><User size={20} /></span>
              <input type="text" placeholder="First Name" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
            </div>
            <div className="auth-input-group" style={{ flex: 1 }}>
              <span className="icon"><User size={20} /></span>
              <input type="text" placeholder="Surname" value={surname} onChange={(e) => setSurname(e.target.value)} disabled={isLoading} />
            </div>
          </div>

          <div className="auth-input-group">
            <span className="icon"><Mail size={20} /></span>
            <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
          </div>

          <div className="auth-input-group">
            <span className="icon"><Phone size={20} /></span>
            <input type="tel" placeholder="Phone Number (optional)" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} disabled={isLoading} />
          </div>

          <div className="auth-input-group">
            <span className="icon"><Calendar size={20} /></span>
            <input type="text" placeholder="Date of Birth (DD/MM/YYYY)" value={dateOfBirth} onChange={(e) => setDateOfBirth(formatDateOfBirth(e.target.value))} maxLength={10} disabled={isLoading} />
          </div>

          <div className="auth-input-group">
            <span className="icon"><Lock size={20} /></span>
            <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
            <button type="button" className="toggle-pw" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
          </div>

          <div className="auth-input-group">
            <span className="icon"><Lock size={20} /></span>
            <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} />
            <button type="button" className="toggle-pw" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
          </div>

          <button type="submit" className="gradient-btn" disabled={isLoading} style={{ marginTop: 6 }}>
            {isLoading ? <span className="auth-loading-spinner" style={{ width: 24, height: 24, borderWidth: 2 }} /> : (<>Create Account <ArrowRight size={20} /></>)}
          </button>
        </form>

        <div className="auth-separator"><span>OR</span></div>

        <button type="button" className="google-btn" onClick={handleGoogleSignIn} disabled={isLoading}>
          <img src="https://www.google.com/favicon.ico" alt="" /> Continue with Google
        </button>
      </div>

      <p style={{ marginTop: 24, marginBottom: 20, color: 'var(--text-secondary)', fontSize: 15 }}>
        Already have an account? <Link to="/" className="auth-link">Sign In</Link>
      </p>
    </div>
  );
}
