import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Calculator, ClipboardList, MessageSquare } from 'lucide-react';

export function AccountingPage() {
  const navigate = useNavigate();

  return (
    <div className="subject-page-v2 accounting-page">
      <header className="subject-header-v2">
        <Link to="/app" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #B8860B, #8B6914)' }}>
            <Calculator size={28} />
          </div>
          <div>
            <h1>Accounting</h1>
            <p>ZIMSEC O Level - Principles of Accounting (7112)</p>
          </div>
        </div>
      </header>

      <div className="subject-content-grid">
        <div className="subject-features-col">
          <section className="subject-section-v2">
            <h2>Accounting Tools</h2>
            <div className="feature-cards-v2">
              <button type="button" className="feature-card-v2" onClick={() => navigate('/app/accounting/topics')}>
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)' }}>
                  <ClipboardList size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>Topical Questions</h3>
                  <p>Paper 1 (MCQ) &amp; Paper 2 (Structured)</p>
                </div>
                <span className="feature-arrow">&rarr;</span>
              </button>

              <button type="button" className="feature-card-v2" onClick={() => navigate('/app/accounting/notes')}>
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)' }}>
                  <BookOpen size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>Accounting Notes</h3>
                  <p>Full notes for all 15 syllabus topics</p>
                </div>
                <span className="feature-arrow">&rarr;</span>
              </button>

              <button
                type="button"
                className="feature-card-v2"
                onClick={() => navigate('/app/teacher', { state: { subject: 'Principles of Accounting', gradeLevel: 'Form 3-4 (O-Level)' } })}
              >
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #7C4DFF, #651FFF)' }}>
                  <MessageSquare size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>AI Tutor</h3>
                  <p>Ask questions, get marking and feedback</p>
                </div>
                <span className="feature-arrow">&rarr;</span>
              </button>

              <button type="button" className="feature-card-v2" onClick={() => navigate('/app/virtual-lab?subject=accounting')}>
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #14B8A6, #0D9488)' }}>
                  <ClipboardList size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>Accounting Labs</h3>
                  <p>Balance sheet, income statement, cash flow (porting)</p>
                </div>
                <span className="feature-arrow">&rarr;</span>
              </button>
            </div>
          </section>
        </div>

        <div className="subject-topics-col">
          <section className="subject-section-v2">
            <h2>Exam Practice</h2>
            <button
              type="button"
              className="exam-card-v2"
              onClick={() =>
                navigate('/app/exam/setup', {
                  state: { subject: 'accounting', backTo: '/app/accounting', subjectLabel: 'Accounting' },
                })
              }
            >
              <div className="exam-card-icon" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)' }}>
                <ClipboardList size={28} />
              </div>
              <div className="exam-card-text">
                <h3>Start Exam</h3>
                <p>Timed exam practice (topic packs may be limited on web)</p>
              </div>
              <span className="feature-arrow">&rarr;</span>
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
