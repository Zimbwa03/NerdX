import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSchoolAuth } from '../../context/SchoolAuthContext';
import { schoolApi, type SchoolPublicInfo } from '../../services/api/schoolDashboardApi';
import { Loader2, Lock, School, AlertCircle } from 'lucide-react';

export function SchoolLoginPage() {
  const { schoolSlug } = useParams<{ schoolSlug: string }>();
  const navigate = useNavigate();
  const { login, isAuthenticated, school: authSchool } = useSchoolAuth();

  const [schoolInfo, setSchoolInfo] = useState<SchoolPublicInfo | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [schoolId, setSchoolId] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && authSchool?.slug === schoolSlug) {
      navigate(`/school/${schoolSlug}/dashboard`, { replace: true });
    }
  }, [isAuthenticated, authSchool, schoolSlug, navigate]);

  useEffect(() => {
    if (!schoolSlug) return;
    schoolApi.getSchoolBySlug(schoolSlug).then((info) => {
      if (info) {
        setSchoolInfo(info);
        setNotFound(false);
      } else {
        setNotFound(true);
      }
      setLoadingInfo(false);
    });
  }, [schoolSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolSlug || !schoolId.trim()) return;
    setError('');
    setSubmitting(true);
    const result = await login(schoolSlug, schoolId.trim());
    if (result.success) {
      navigate(`/school/${schoolSlug}/dashboard`, { replace: true });
    } else {
      setError(result.error || 'Invalid credentials');
    }
    setSubmitting(false);
  };

  if (loadingInfo) {
    return (
      <div className="sl-page">
        <div className="sl-loader"><Loader2 className="sl-spin" size={32} /></div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="sl-page">
        <div className="sl-card">
          <AlertCircle size={48} style={{ color: '#ef4444', marginBottom: 16 }} />
          <h1 className="sl-title">School Not Found</h1>
          <p className="sl-subtitle">The school portal you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sl-page">
      <div className="sl-card">
        {schoolInfo?.logo_url ? (
          <img src={schoolInfo.logo_url} alt={schoolInfo.name} className="sl-logo" />
        ) : (
          <div className="sl-logo-placeholder"><School size={48} /></div>
        )}

        <h1 className="sl-title">{schoolInfo?.name || 'School Portal'}</h1>
        <p className="sl-subtitle">Sign in to your school dashboard</p>

        <form onSubmit={handleSubmit} className="sl-form">
          <div className="sl-field">
            <label className="sl-label">School ID</label>
            <div className="sl-input-wrap">
              <Lock size={18} />
              <input
                type="password"
                className="sl-input"
                placeholder="Enter your 6-letter School ID"
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value.toUpperCase())}
                maxLength={6}
                required
                autoFocus
              />
            </div>
          </div>

          {error && <div className="sl-error"><AlertCircle size={16} /> {error}</div>}

          <button type="submit" className="sl-btn" disabled={submitting || schoolId.length < 6}>
            {submitting ? <><Loader2 size={18} className="sl-spin" /> Signing in...</> : 'Sign In'}
          </button>
        </form>

        <div className="sl-footer">
          <span className="sl-powered">Powered by <strong>NerdX</strong></span>
        </div>
      </div>
    </div>
  );
}
