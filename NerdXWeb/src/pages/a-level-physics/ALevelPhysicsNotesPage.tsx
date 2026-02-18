import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, FlaskConical, Search } from 'lucide-react';
import { aLevelPhysicsTopics } from '../../data/aLevelPhysics';
import '../sciences/ScienceUniverse.css';

type PhysicsLevel = 'AS Level' | 'A2 Level';

export function ALevelPhysicsNotesPage() {
  const [selectedLevel, setSelectedLevel] = useState<PhysicsLevel>('AS Level');
  const [searchText, setSearchText] = useState('');

  const notesTopics = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return aLevelPhysicsTopics.filter((topic) => {
      if (topic.difficulty !== selectedLevel) return false;
      if (!q) return true;
      return (
        topic.name.toLowerCase().includes(q) ||
        topic.description.toLowerCase().includes(q) ||
        topic.learningObjectives.some((obj) => obj.toLowerCase().includes(q))
      );
    });
  }, [searchText, selectedLevel]);

  return (
    <div className="science-universe-page phys">
      <div className="science-universe-bg phys-bg" />
      <div className="science-grid-overlay" />

      <Link to="/app/a-level-physics" className="super-back-btn">
        <ArrowLeft size={18} />
        <span>Back</span>
      </Link>

      <div className="science-hero">
        <div
          className="science-hero-badge"
          style={{
            background: 'rgba(59, 130, 246, 0.16)',
            border: '1px solid rgba(59, 130, 246, 0.35)',
          }}
        >
          <FlaskConical size={14} />
          <span>A-LEVEL PHYSICS NOTES</span>
        </div>
        <h1
          className="science-hero-title"
          style={{
            background: 'linear-gradient(135deg, #06B6D4, #3B82F6, #67E8F9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Study Notes
        </h1>
        <p style={{ maxWidth: 650, margin: '0 auto', opacity: 0.8 }}>
          Full A-Level Physics notes with summaries, detailed sections, key points, and exam tips.
        </p>
      </div>

      <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 20px' }}>
        <div
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <BookOpen size={24} style={{ color: '#67E8F9' }} />
            <span style={{ fontSize: 22, fontWeight: 700 }}>{selectedLevel}</span>
            <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 12 }}>
              {notesTopics.length} Topics
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setSelectedLevel('AS Level')}
              style={{
                padding: '8px 12px',
                borderRadius: 10,
                border: selectedLevel === 'AS Level' ? '1px solid rgba(59, 130, 246, 0.45)' : '1px solid rgba(255,255,255,0.12)',
                background: selectedLevel === 'AS Level' ? 'rgba(59, 130, 246, 0.18)' : 'rgba(255,255,255,0.05)',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              AS Level
            </button>
            <button
              type="button"
              onClick={() => setSelectedLevel('A2 Level')}
              style={{
                padding: '8px 12px',
                borderRadius: 10,
                border: selectedLevel === 'A2 Level' ? '1px solid rgba(59, 130, 246, 0.45)' : '1px solid rgba(255,255,255,0.12)',
                background: selectedLevel === 'A2 Level' ? 'rgba(59, 130, 246, 0.18)' : 'rgba(255,255,255,0.05)',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              A2 Level
            </button>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', flex: '1 1 200px', minWidth: 0 }}>
              <Search size={14} />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search notes..."
                style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', minWidth: 0, width: '100%' }}
              />
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {notesTopics.map((topic, idx) => (
            <Link
              key={topic.id}
              to={`/app/a-level-physics/notes/${topic.id}`}
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
                (e.currentTarget as HTMLElement).style.background = 'rgba(59, 130, 246, 0.15)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(103, 232, 249, 0.4)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(59, 130, 246, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#67E8F9',
                  fontWeight: 700,
                  fontSize: 14,
                  flexShrink: 0,
                }}
              >
                {idx + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{topic.name}</div>
                <div style={{ fontSize: 13, opacity: 0.65, marginTop: 2 }}>{topic.description}</div>
              </div>
              <span
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  background: 'rgba(59, 130, 246, 0.15)',
                  color: '#67E8F9',
                  fontSize: 12,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                View Notes
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
