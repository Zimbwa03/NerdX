import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ServerCrash, Terminal, ExternalLink, Loader2 } from 'lucide-react';

/**
 * Client-side navigation to /admin/* hits the React SPA first.
 * Flask admin is served through the Vite dev proxy; we force a full document
 * load so the browser request is proxied to the backend (session cookies work).
 */
export function AdminGatewayPage() {
  const location = useLocation();
  const [status, setStatus] = useState<'checking' | 'redirecting' | 'offline'>('checking');

  useEffect(() => {
    const target = `${location.pathname}${location.search}${location.hash}`;

    fetch('/health', { method: 'GET', cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('unhealthy');
        setStatus('redirecting');
        window.location.replace(target);
      })
      .catch(() => setStatus('offline'));
  }, [location.pathname, location.search, location.hash]);

  if (status === 'checking' || status === 'redirecting') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: 'linear-gradient(165deg, #0c0a14 0%, #0f172a 50%, #0c0a14 100%)',
          color: 'rgba(248,250,252,0.85)',
          padding: 24,
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 360 }}>
          <Loader2 size={40} className="sd-spin" style={{ color: '#a78bfa', marginBottom: 16 }} />
          <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Connecting to admin…</p>
          <p style={{ margin: '10px 0 0', fontSize: 13, color: 'rgba(248,250,252,0.45)' }}>
            Checking that the API is running on port 5000
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'linear-gradient(165deg, #0c0a14 0%, #0f172a 50%, #0c0a14 100%)',
        color: 'rgba(248,250,252,0.9)',
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: '100%',
          borderRadius: 18,
          border: '1px solid rgba(139, 92, 246, 0.35)',
          background: 'linear-gradient(145deg, rgba(30,27,75,0.5), rgba(15,23,42,0.95))',
          padding: '28px 26px',
          boxShadow: '0 0 48px rgba(139, 92, 246, 0.12)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <ServerCrash size={28} color="#fb7185" />
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Admin needs the API</h1>
        </div>
        <p style={{ margin: '0 0 18px', fontSize: 14, lineHeight: 1.55, color: 'rgba(226,232,240,0.65)' }}>
          The student app (Vite) proxies <code style={{ color: '#a5b4fc' }}>/admin</code> and{' '}
          <code style={{ color: '#a5b4fc' }}>/api</code> to{' '}
          <strong style={{ color: '#e2e8f0' }}>http://localhost:5000</strong>. If Flask is not running, the admin
          dashboard cannot load.
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            padding: '14px 16px',
            borderRadius: 12,
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.08)',
            marginBottom: 18,
          }}
        >
          <Terminal size={18} style={{ flexShrink: 0, marginTop: 2, color: '#34d399' }} />
          <div>
            <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: 'rgba(226,232,240,0.5)' }}>
              From the NerdX repo root:
            </p>
            <code
              style={{
                display: 'block',
                fontSize: 13,
                color: '#86efac',
                fontFamily: 'ui-monospace, monospace',
                wordBreak: 'break-all',
              }}
            >
              python main.py
            </code>
            <p style={{ margin: '10px 0 0', fontSize: 12, color: 'rgba(226,232,240,0.45)' }}>
              Or use one command for web + API (from the <code>NerdXWeb</code> folder):
            </p>
            <code
              style={{
                display: 'block',
                marginTop: 6,
                fontSize: 13,
                color: '#86efac',
                fontFamily: 'ui-monospace, monospace',
              }}
            >
              npm run dev:full
            </code>
          </div>
        </div>
        <p style={{ margin: '0 0 14px', fontSize: 13, color: 'rgba(226,232,240,0.5)' }}>
          Then open{' '}
          <a href="/admin/dashboard" style={{ color: '#a78bfa', fontWeight: 600 }}>
            /admin/dashboard
            <ExternalLink size={12} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} />
          </a>{' '}
          again (full page load goes through the proxy).
        </p>
        <a
          href="/"
          style={{
            display: 'inline-block',
            marginTop: 8,
            fontSize: 13,
            fontWeight: 600,
            color: 'rgba(226,232,240,0.55)',
          }}
        >
          ← Back to NerdX home
        </a>
      </div>
    </div>
  );
}
