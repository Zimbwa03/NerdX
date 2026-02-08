import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ClipboardList, FileText, Info } from 'lucide-react';

const YEARS = ['2023', '2022', '2021', '2020', '2019'];
const PAPERS = [
  { id: 'paper1', label: 'Paper 1 (Multiple Choice)' },
  { id: 'paper2', label: 'Paper 2 (Structured)' },
] as const;

export function PastPapersPage() {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedPaper, setSelectedPaper] = useState<(typeof PAPERS)[number]['id'] | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const selectedPaperLabel = useMemo(() => PAPERS.find((p) => p.id === selectedPaper)?.label ?? '', [selectedPaper]);

  const start = () => {
    if (!selectedYear || !selectedPaper) {
      setToast('Please select both a year and a paper.');
      window.setTimeout(() => setToast(null), 2200);
      return;
    }
    setToast('Past paper question packs are still being ported to web. Use Exam Mode for now.');
    window.setTimeout(() => setToast(null), 2600);
  };

  return (
    <div className="past-papers-page">
      {toast && (
        <div className="past-papers-toast" role="status">
          {toast}
        </div>
      )}

      <header className="subject-header-v2">
        <Link to="/app" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #FF9100, #FF6D00)' }}>
            <FileText size={28} />
          </div>
          <div>
            <h1>Past Papers</h1>
            <p>Practice with real exam questions (web parity in progress)</p>
          </div>
        </div>
      </header>

      <div className="past-papers-content">
        <section className="past-papers-card">
          <h2>Select year</h2>
          <div className="past-papers-grid">
            {YEARS.map((y) => (
              <button
                key={y}
                type="button"
                className={`past-papers-chip ${selectedYear === y ? 'active' : ''}`}
                onClick={() => setSelectedYear(y)}
              >
                {y}
              </button>
            ))}
          </div>
        </section>

        <section className="past-papers-card">
          <h2>Select paper</h2>
          <div className="past-papers-paper-list">
            {PAPERS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`past-papers-paper ${selectedPaper === p.id ? 'active' : ''}`}
                onClick={() => setSelectedPaper(p.id)}
              >
                <span className="past-papers-paper-icon">
                  <ClipboardList size={18} />
                </span>
                <span className="past-papers-paper-label">{p.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="past-papers-info">
          <div className="past-papers-info-head">
            <Info size={18} />
            <strong>Exam mode info</strong>
          </div>
          <ul className="past-papers-info-list">
            <li>Timed practice session</li>
            <li>Detailed results analysis</li>
            <li>AI explanations for corrections</li>
          </ul>
          <button
            type="button"
            className="past-papers-exam-link"
            onClick={() => navigate('/app/exam/setup', { state: { subject: 'mathematics', backTo: '/app/past-papers', subjectLabel: 'Mathematics' } })}
          >
            Open Exam Mode
          </button>
        </section>

        <div className="past-papers-footer">
          <button
            type="button"
            className="past-papers-start"
            onClick={start}
            disabled={!selectedYear || !selectedPaper}
            title={selectedYear && selectedPaper ? `Start ${selectedYear} - ${selectedPaperLabel}` : 'Select year and paper first'}
          >
            Start Exam
          </button>
        </div>
      </div>
    </div>
  );
}

