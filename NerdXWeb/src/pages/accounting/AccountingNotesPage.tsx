import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Calculator } from 'lucide-react';
import { accountingTopics } from '../../data/accounting/topics';
import '../sciences/ScienceUniverse.css';

export function AccountingNotesPage() {
  const notesTopics = accountingTopics.filter((topic) => topic.hasNotes);

  return (
    <div className="science-universe-page acc">
      <div className="science-universe-bg acc-bg" />
      <div className="science-grid-overlay" />

      <Link to="/app/accounting" className="super-back-btn">
        <ArrowLeft size={24} />
      </Link>

      <div className="science-hero">
        <div className="science-hero-badge" style={{ background: 'rgba(184, 134, 11, 0.18)', border: '1px solid rgba(184, 134, 11, 0.35)' }}>
          <Calculator size={14} />
          <span>ACCOUNTING NOTES</span>
        </div>
        <h1 className="science-hero-title" style={{ background: 'linear-gradient(135deg, #B8860B, #DAA520, #F6C453)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Study Notes
        </h1>
        <p style={{ maxWidth: 650, margin: '0 auto', opacity: 0.8 }}>
          Comprehensive ZIMSEC O-Level Accounting notes with summaries, detailed sections, key points, and exam tips.
        </p>
      </div>

      <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <BookOpen size={24} style={{ color: '#EEC66B' }} />
          <span style={{ fontSize: 22, fontWeight: 700 }}>All Topics</span>
          <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 12 }}>
            {notesTopics.length} Topics
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {notesTopics.map((topic, idx) => (
            <Link
              key={topic.id}
              to={`/app/accounting/notes/${topic.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '16px 20px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                color: '#fff',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(184, 134, 11, 0.15)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(238, 198, 107, 0.4)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            >
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(184, 134, 11, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EEC66B',
                fontWeight: 700,
                fontSize: 14,
                flexShrink: 0,
              }}>
                {idx + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{topic.name}</div>
                <div style={{ fontSize: 13, opacity: 0.65, marginTop: 2 }}>{topic.description}</div>
              </div>
              <span style={{
                padding: '6px 14px',
                borderRadius: 20,
                background: 'rgba(184, 134, 11, 0.15)',
                color: '#EEC66B',
                fontSize: 12,
                fontWeight: 600,
                flexShrink: 0,
              }}>
                View Notes
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
