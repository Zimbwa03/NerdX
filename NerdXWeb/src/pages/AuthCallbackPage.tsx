import { useEffect, useState, useRef } from 'react';
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

/**
 * Wait for the Supabase client to establish a session.
 * With PKCE flow, `detectSessionInUrl: true` automatically exchanges the
 * authorization code in the background. Rather than racing it with a manual
 * `exchangeCodeForSession` call (which fails because the code is single-use),
 * we listen for the auth state change event and also poll `getSession` as a
 * fallback.
 */
function waitForSession(timeoutMs = 15000): Promise<{ session: any; error: any }> {
  return new Promise((resolve) => {
    let settled = false;
    const settle = (session: any, error: any) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve({ session, error });
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: any) => {
        if (session?.user) {
          settle(session, null);
        }
      },
    );

    const cleanup = () => {
      try { subscription.unsubscribe(); } catch { /* noop */ }
      clearInterval(pollId);
      clearTimeout(timerId);
    };

    const pollId = setInterval(async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) { settle(null, error); return; }
        if (session?.user) { settle(session, null); }
      } catch { /* ignore */ }
    }, 500);

    const timerId = setTimeout(() => settle(null, null), timeoutMs);

    supabase.auth.getSession().then(({ data: { session }, error }: any) => {
      if (error) { settle(null, error); return; }
      if (session?.user) { settle(session, null); }
    }).catch(() => { /* ignore */ });
  });
}

export function AuthCallbackPage() {
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const handleCallback = async () => {
      try {
        const url = new URL(window.location.href);
        const oauthError = url.searchParams.get('error_description') || url.searchParams.get('error');
        if (oauthError) {
          setError(decodeURIComponent(oauthError.replace(/\+/g, ' ')));
          return;
        }

        console.log('[AuthCallback] Waiting for Supabase session...');
        const { session, error: sessionError } = await waitForSession(15000);

        if (sessionError) {
          console.error('[AuthCallback] Session error:', sessionError.message);
          setError(sessionError.message);
          return;
        }

        if (!session?.user) {
          console.error('[AuthCallback] No session after waiting. URL:', window.location.href);
          setError('No session found. Please try signing in again.');
          return;
        }

        console.log('[AuthCallback] Session obtained for:', session.user.email);
        window.history.replaceState({}, document.title, `${window.location.origin}/auth/callback`);

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

        console.log('[AuthCallback] Calling backend socialLogin...');
        const referralCode = consumeStoredReferral();
        const response = await authApi.socialLogin('google', googleUser, referralCode);

        if (response.success && response.token && response.user) {
          console.log('[AuthCallback] Backend login success, navigating to /app');
          await login(response.user, response.token);
          navigate('/app', { replace: true });
        } else {
          console.error('[AuthCallback] Backend socialLogin failed:', response.message);
          setError(response.message || 'Could not sign in with Google.');
        }
      } catch (err) {
        console.error('[AuthCallback] Unexpected error:', err);
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
