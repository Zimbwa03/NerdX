import { Link } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';

export function EmailVerificationPage() {
  return (
    <div className="auth-page">
      <div className="glass-card">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 100, height: 100, borderRadius: 50, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
            <Mail size={50} color="white" />
          </div>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 800, textAlign: 'center', marginBottom: 16 }}>Verify Your Email</h1>

        <p style={{ fontSize: 16, color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 12, lineHeight: 1.5 }}>
          We've sent a verification link to your email address. Please check your inbox (and spam folder) and click the link to activate your account.
        </p>

        <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 32, lineHeight: 1.4 }}>
          Once verified, you can log in to access your dashboard.
        </p>

        <Link to="/" className="gradient-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          Back to Login <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}
