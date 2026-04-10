import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '32px 20px',
        background:
          'radial-gradient(circle at top, rgba(16,185,129,0.16), transparent 28%), linear-gradient(180deg, #050816 0%, #0f172a 100%)',
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: 720,
          borderRadius: 28,
          padding: '40px 32px',
          border: '1px solid rgba(148,163,184,0.16)',
          background: 'rgba(15, 23, 42, 0.8)',
          boxShadow: '0 24px 80px rgba(2, 6, 23, 0.45)',
          color: '#e5eefc',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: '#34d399',
          }}
        >
          Error 404
        </p>
        <h1 style={{ margin: '16px 0 12px', fontSize: 'clamp(2.3rem, 6vw, 4rem)', lineHeight: 1.05 }}>
          This page does not exist.
        </h1>
        <p style={{ margin: '0 auto 28px', maxWidth: 520, fontSize: 17, lineHeight: 1.7, color: '#a8b6cc' }}>
          The link may be outdated, the page may have moved, or the address may be incorrect.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          <Link
            to="/"
            style={{
              padding: '12px 18px',
              borderRadius: 999,
              background: '#10b981',
              color: '#04110d',
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            Go to homepage
          </Link>
          <Link
            to="/app"
            style={{
              padding: '12px 18px',
              borderRadius: 999,
              border: '1px solid rgba(148,163,184,0.24)',
              color: '#e5eefc',
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            Open app
          </Link>
        </div>
      </section>
    </main>
  );
}
