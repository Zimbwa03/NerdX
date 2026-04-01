import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTeacherAuth } from '../../context/TeacherAuthContext';
import { School, LogIn, Loader2, KeyRound, User } from 'lucide-react';

export function TeacherLoginPage() {
  const { schoolId } = useParams<{ schoolId: string }>();
  const { login } = useTeacherAuth();
  const navigate = useNavigate();

  const [loginCode, setLoginCode] = useState('');
  const [schoolIdInput, setSchoolIdInput] = useState(schoolId?.toUpperCase() || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolIdInput.trim() || !loginCode.trim()) {
      setError('Please enter both School ID and Teacher Code');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(schoolIdInput.trim().toUpperCase(), loginCode.trim().toUpperCase());
    setLoading(false);

    if (result.success) {
      navigate(`/school/${schoolId || schoolIdInput}/teacher/dashboard`);
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 440, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 40, backdropFilter: 'blur(20px)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg, #22c55e, #16a34a)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <School size={32} color="#fff" />
          </div>
          <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: '0 0 8px' }}>Teacher Portal</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: 0 }}>
            NerdX AI — Powered by Neuronet AI Solutions
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              <KeyRound size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
              School ID
            </label>
            <input
              type="text"
              value={schoolIdInput}
              onChange={(e) => setSchoolIdInput(e.target.value.toUpperCase())}
              placeholder="e.g. FNOXXN"
              style={{
                width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 15, outline: 'none',
                letterSpacing: 2, fontWeight: 600, boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              <User size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
              Teacher Login Code
            </label>
            <input
              type="text"
              value={loginCode}
              onChange={(e) => setLoginCode(e.target.value.toUpperCase())}
              placeholder="e.g. TCH-00123"
              style={{
                width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 15, outline: 'none',
                letterSpacing: 1, fontWeight: 600, boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: '#fca5a5', fontSize: 13 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px 0', borderRadius: 12, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? 'rgba(34,197,94,0.5)' : 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: '#fff', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 24 }}>
          Contact your school administrator for your Teacher Login Code
        </p>
      </div>
    </div>
  );
}
