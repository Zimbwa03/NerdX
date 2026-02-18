import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Scroll } from 'lucide-react';
import {
  historyFormLevels,
  getHistoryTopicsByForm,
  type HistoryFormLevel,
} from '../../data/historyNotes';
import '../sciences/ScienceUniverse.css';

export function HistoryNotesPage() {
  const [selectedForm, setSelectedForm] = useState<HistoryFormLevel>('Form 1');
  const filteredTopics = getHistoryTopicsByForm(selectedForm);

  return (
    <div className="science-universe-page hist">
      <div className="science-universe-bg hist-bg" />
      <div className="science-grid-overlay" />

      <Link to="/app/history" className="super-back-btn">
        <ArrowLeft size={18} />
        <span>Back</span>
      </Link>

      <div className="science-hero">
        <div className="science-hero-badge hist-badge">
          <Scroll size={14} />
          <span>HISTORY NOTES</span>
        </div>
        <h1 className="science-hero-title hist-title">
          Study Notes
        </h1>
        <p style={{ maxWidth: 600, margin: '0 auto', opacity: 0.8 }}>
          Comprehensive notes aligned with ZIMSEC O-Level History syllabus. Includes videos, audio, and flashcards.
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
          {historyFormLevels.map((form) => (
            <button
              key={form}
              onClick={() => setSelectedForm(form)}
              style={{
                padding: '10px 24px',
                borderRadius: 50,
                border: `2px solid ${selectedForm === form ? '#795548' : 'rgba(255,255,255,0.15)'}`,
                background: selectedForm === form ? 'rgba(121, 85, 72, 0.3)' : 'rgba(255,255,255,0.05)',
                color: selectedForm === form ? '#D7CCC8' : 'rgba(255,255,255,0.7)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {form}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <BookOpen size={24} style={{ color: '#8D6E63' }} />
          <span style={{ fontSize: 22, fontWeight: 700 }}>{selectedForm} Topics</span>
          <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 12 }}>
            {filteredTopics.length} Topics
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filteredTopics.map((topic, idx) => (
            <Link
              key={topic.id}
              to={`/app/history/notes/${topic.id}`}
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
                (e.currentTarget as HTMLElement).style.background = 'rgba(121, 85, 72, 0.15)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(121, 85, 72, 0.4)';
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
                background: 'rgba(121, 85, 72, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8D6E63',
                fontWeight: 700,
                fontSize: 14,
                flexShrink: 0,
              }}>
                {idx + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{topic.name}</div>
                <div style={{ fontSize: 13, opacity: 0.6, marginTop: 2 }}>{topic.description}</div>
              </div>
              <span style={{
                padding: '6px 14px',
                borderRadius: 20,
                background: 'rgba(121, 85, 72, 0.15)',
                color: '#8D6E63',
                fontSize: 12,
                fontWeight: 600,
                flexShrink: 0,
              }}>
                View Notes
              </span>
            </Link>
          ))}
        </div>

        {filteredTopics.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, opacity: 0.5 }}>
            No notes available for {selectedForm} yet.
          </div>
        )}
      </div>
    </div>
  );
}
