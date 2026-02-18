import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { authApi } from '../services/api/authApi';
import { useAuth } from '../context/AuthContext';

const REFERRAL_STORAGE_KEY = 'nerdx_referral_code';

function consumeStoredReferral(): string | undefined {
  try {
    const code = (localStorage.getItem(REFERRAL_STORAGE_KEY) || '').trim().toUpperCase();
    if (code) {
      localStorage.removeItem(REFERRAL_STORAGE_KEY);
      return code;
    }
  } catch { /* noop */ }
  return undefined;
}

async function waitForSupabaseSession(maxAttempts = 10, delayMs = 300) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || session?.user) {
      return { session, error };
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  return { session: null, error: null };
}

export function AuthCallbackPage() {
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const url = new URL(window.location.href);
        const oauthError = url.searchParams.get('error_description') || url.searchParams.get('error');
        if (oauthError) {
          setError(decodeURIComponent(oauthError.replace(/\+/g, ' ')));
          return;
        }

        let { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (!session?.user) {
          const code = url.searchParams.get('code');
          if (code && typeof supabase.auth.exchangeCodeForSession === 'function') {
            const { data: exchanged, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            if (!exchangeError && exchanged?.session) {
              session = exchanged.session;
              window.history.replaceState({}, document.title, `${window.location.origin}/auth/callback`);
            } else if (exchangeError) {
              console.warn('OAuth code exchange warning:', exchangeError.message);
            }
          }
        }

        if (!session?.user && !sessionError) {
          const waited = await waitForSupabaseSession();
          session = waited.session;
          sessionError = waited.error;
        }

        if (sessionError) {
          setError(sessionError.message);
          return;
        }

        if (!session?.user) {
          setError('No session found. Please try signing in again.');
          return;
        }

        const user = session.user;
        const metadata = user.user_metadata || {};
        let given_name = metadata.given_name || '';
        let family_name = metadata.family_name || '';

        if (!given_name && metadata.full_name) {
          const parts = (metadata.full_name as string).split(' ');
          given_name = parts[0] || '';
          family_name = parts.slice(1).join(' ') || '';
        }

        const googleUser = {
          id: user.id,
          email: user.email || '',
          name: (metadata.full_name as string) || (metadata.name as string) || given_name || '',
          given_name: given_name || (metadata.name as string) || user.email?.split('@')[0] || '',
          family_name: family_name || '',
          picture: (metadata.avatar_url as string) || (metadata.picture as string) || '',
          sub: user.id,
        };

        const referralCode = consumeStoredReferral();
        const response = await authApi.socialLogin('google', googleUser, referralCode);

        if (response.success && response.token && response.user) {
          await login(response.user, response.token);
          navigate('/app', { replace: true });
        } else {
          setError(response.message || 'Could not sign in with Google.');
        }
      } catch (err) {
        setError((err as Error).message || 'Authentication failed.');
      }
    };

    handleCallback();
  }, [login, navigate]);

  if (error) {
    return (
      <div className="auth-page">
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: 16 }}>Sign-In Error</h2>
          <p className="auth-error" style={{ marginBottom: 24 }}>{error}</p>
          <a href="/" className="gradient-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-loading">
        <div className="auth-loading-spinner" />
        <p>Completing sign-in...</p>
      </div>
    </div>
  );
}
