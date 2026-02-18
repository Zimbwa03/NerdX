import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, Monitor,
  HardDrive, Globe, Binary, Network, ShieldCheck, Settings,
  GitBranch, Code, Database, Layout, Zap,
  type LucideIcon,
} from 'lucide-react';
import { computerScienceTopicNames } from '../../data/computerScienceNotes/notes';
import '../sciences/ScienceUniverse.css';

type Board = 'zimsec' | 'cambridge';

const CS_TOPIC_ICONS: Record<string, LucideIcon> = {
  'Hardware and Software': HardDrive,
  'Application of Computer Science': Globe,
  'Data Representation': Binary,
  'Communication Networks and Internet Technologies': Network,
  'Security and Ethics': ShieldCheck,
  'Systems Analysis and Design': Settings,
  'Algorithm Design and Problem-Solving': GitBranch,
  'Programming': Code,
  'Databases': Database,
  'Web Design and Internet Uses': Layout,
  'Automated and Emerging Technologies': Zap,
};

export function ComputerScienceNotesPage() {
  const [board, setBoard] = useState<Board>('zimsec');

  return (
    <div className="science-universe-page cs">
      <div className="science-universe-bg cs-bg">
        <div className="science-grid-overlay"></div>
      </div>

      <Link to="/app/computer-science" className="super-back-btn">
        <ArrowLeft size={18} />
        <span>Back</span>
      </Link>

      <div className="science-hero" style={{ paddingBottom: 20 }}>
        <div className="science-hero-badge" style={{ background: 'rgba(2, 136, 209, 0.15)', border: '1px solid rgba(2, 136, 209, 0.3)' }}>
          <BookOpen size={14} />
          <span>STUDY NOTES</span>
        </div>
        <h1 className="science-hero-title" style={{ background: 'linear-gradient(135deg, #0288D1, #03A9F4, #4FC3F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Computer Science<br />Notes
        </h1>
        <p style={{ maxWidth: 600, margin: '0 auto', opacity: 0.8 }}>
          Comprehensive notes for each topic aligned with the {board === 'cambridge' ? 'Cambridge' : 'ZIMSEC'} O-Level Computer Science syllabus.
        </p>

        {/* Board toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setBoard('zimsec')}
            style={{
              padding: '10px 22px',
              borderRadius: 50,
              border: `2px solid ${board === 'zimsec' ? '#0288D1' : 'rgba(255,255,255,0.15)'}`,
              background: board === 'zimsec' ? 'rgba(2, 136, 209, 0.25)' : 'rgba(255,255,255,0.05)',
              color: board === 'zimsec' ? '#4FC3F7' : 'rgba(255,255,255,0.7)',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              backdropFilter: 'blur(8px)',
            }}
          >
            ZimSec
          </button>
          <button
            type="button"
            onClick={() => setBoard('cambridge')}
            style={{
              padding: '10px 22px',
              borderRadius: 50,
              border: `2px solid ${board === 'cambridge' ? '#0288D1' : 'rgba(255,255,255,0.15)'}`,
              background: board === 'cambridge' ? 'rgba(2, 136, 209, 0.25)' : 'rgba(255,255,255,0.05)',
              color: board === 'cambridge' ? '#4FC3F7' : 'rgba(255,255,255,0.7)',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              backdropFilter: 'blur(8px)',
            }}
          >
            Cambridge
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Monitor size={24} style={{ color: '#4FC3F7' }} />
          <span style={{ fontSize: 22, fontWeight: 700 }}>All Topics</span>
          <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 12 }}>
            {computerScienceTopicNames.length} Topics
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {computerScienceTopicNames.map((name, index) => {
            const TopicIcon = CS_TOPIC_ICONS[name] ?? Monitor;
            const slug = name.toLowerCase().replace(/ /g, '-');
            return (
              <Link
                key={name}
                to={`/app/computer-science/notes/${slug}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '18px 20px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  textDecoration: 'none',
                  color: '#fff',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: 44, height: 44,
                  borderRadius: 12,
                  background: 'rgba(2, 136, 209, 0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <TopicIcon size={22} color="#4FC3F7" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{name}</div>
                  <div style={{ fontSize: 13, opacity: 0.5, marginTop: 2 }}>Topic {index + 1}</div>
                </div>
                <span style={{
                  padding: '6px 14px',
                  borderRadius: 50,
                  background: 'rgba(2, 136, 209, 0.15)',
                  color: '#4FC3F7',
                  fontSize: 13,
                  fontWeight: 600,
                  flexShrink: 0,
                }}>
                  View notes
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
