/**
 * ChemistryTopicsPage — topic cards open the unified topic hub.
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { quizApi, type Topic } from '../../services/api/quizApi';
import {
  ArrowLeft, BookOpen, Atom, FlaskConical, Play, FileText,
  Droplets, Link2, Zap, Flame, Battery, RefreshCw, Beaker,
  Hammer, Wind, Cloud, Hexagon, LayoutGrid, Calculator, Gauge,
  type LucideIcon,
} from 'lucide-react';
import { MaicClassroomFeatureCard } from '../../components/MaicClassroomFeatureCard';
import { MaicTopicClassroomLink } from '../../components/MaicTopicClassroomLink';
import { chemistryTopics } from '../../data/scienceNotes/chemistry';
import '../sciences/ScienceUniverse.css';

const CHEM_TOPICS_FALLBACK: Topic[] = [
  { id: 'matter', name: 'States of Matter', subject: 'chemistry' },
  { id: 'atomic', name: 'Atomic Structure', subject: 'chemistry' },
  { id: 'bonding', name: 'Chemical Bonding', subject: 'chemistry' },
  { id: 'stoichiometry', name: 'Stoichiometry and Mole Concept', subject: 'chemistry' },
  { id: 'electrochemistry', name: 'Electrochemistry', subject: 'chemistry' },
  { id: 'energetics', name: 'Chemical Energetics', subject: 'chemistry' },
  { id: 'kinetics', name: 'Chemical Kinetics', subject: 'chemistry' },
  { id: 'equilibria', name: 'Chemical Equilibria', subject: 'chemistry' },
  { id: 'acids', name: 'Acids, Bases and Salts', subject: 'chemistry' },
  { id: 'periodicity', name: 'The Periodic Table', subject: 'chemistry' },
  { id: 'metals', name: 'Metals', subject: 'chemistry' },
  { id: 'organic', name: 'Organic Chemistry', subject: 'chemistry' },
  { id: 'polymerisation', name: 'Polymers', subject: 'chemistry' },
  { id: 'analysis', name: 'Chemical Analysis', subject: 'chemistry' },
  { id: 'atmosphere', name: 'The Atmosphere and Environment', subject: 'chemistry' },
];

function getChemTopicIcon(name: string): LucideIcon {
  const n = name.toLowerCase();
  if (n.includes('states of matter') || n.includes('particulate')) return Droplets;
  if (n.includes('atom') || n.includes('element') || n.includes('compound')) return Atom;
  if (n.includes('bonding')) return Link2;
  if (n.includes('stoichiometry') || n.includes('formulae') || n.includes('mole')) return Calculator;
  if (n.includes('periodic table') || n.includes('periodicity')) return LayoutGrid;
  if (n.includes('reaction') || n.includes('kinetics')) return Zap;
  if (n.includes('energetics') || n.includes('energy from')) return Flame;
  if (n.includes('electrochemistry') || n.includes('electrolysis')) return Battery;
  if (n.includes('redox')) return RefreshCw;
  if (n.includes('acid') || n.includes('base') || n.includes('salt')) return Beaker;
  if (n.includes('non-metal')) return Wind;
  if (n.includes('metal')) return Hammer;
  if (n.includes('environment') || n.includes('atmosphere')) return Cloud;
  if (n.includes('organic') || n.includes('polymer')) return Hexagon;
  if (n.includes('experimental') || n.includes('analysis') || n.includes('technique')) return FlaskConical;
  if (n.includes('equilibri')) return Gauge;
  return FlaskConical;
}

export const ChemistryTopicsPage = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await quizApi.getTopics('chemistry');
        if (!cancelled && data?.length) setTopics(data);
        else if (!cancelled) setTopics(CHEM_TOPICS_FALLBACK);
      } catch {
        if (!cancelled) setTopics(CHEM_TOPICS_FALLBACK);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayTopics = topics.length ? topics : CHEM_TOPICS_FALLBACK;

  return (
    <div className="science-universe-page chem">
      <div className="science-universe-bg chem-bg">
        <div className="science-grid-overlay"></div>
      </div>

      <Link to="/app" className="super-back-btn">
        <ArrowLeft size={18} />
        <span>Dashboard</span>
      </Link>

      <div className="science-hero">
        <div className="science-hero-badge chem-badge">
          <FlaskConical size={14} />
          <span>O-LEVEL CHEMISTRY</span>
        </div>
        <h1 className="science-hero-title chem-title">
          Master the<br />Elements
        </h1>
        <p style={{ maxWidth: 600, margin: '0 auto', opacity: 0.8 }}>
          Explore chemical reactions, atomic structure, and the periodic table with interactive labs.
        </p>
      </div>

      <div className="science-content-grid">
        <div className="science-features-col">
          <div
            className="science-feature-card"
            onClick={() =>
              navigate('/app/teacher', {
                state: { subject: 'O Level Chemistry', gradeLevel: 'Form 3-4 (O-Level)' },
              })
            }
          >
            <div className="feature-icon-box">
              <FlaskConical size={28} />
            </div>
            <h3 className="feature-card-title">AI Chem Tutor</h3>
            <p className="feature-card-desc">Get instant help with balancing equations, mole calculations, and more.</p>
          </div>

          <MaicClassroomFeatureCard
            navigate={navigate}
            subject="O Level Chemistry"
            gradeLevel="Form 3-4 (O-Level)"
            accent="rgba(245, 158, 11, 0.15)"
          />

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/virtual-lab?subject=chemistry')}
          >
            <div className="feature-icon-box">
              <Atom size={28} />
            </div>
            <h3 className="feature-card-title">Virtual Labs</h3>
            <p className="feature-card-desc">Mix chemicals and explore reactions safely in interactive simulations.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() =>
              navigate('/app/exam/setup', {
                state: { subject: 'chemistry', backTo: '/app/chemistry', subjectLabel: 'Chemistry' },
              })
            }
          >
            <div className="feature-icon-box">
              <FileText size={28} />
            </div>
            <h3 className="feature-card-title">Exam Mode</h3>
            <p className="feature-card-desc">Simulate full Chemistry papers with timed conditions.</p>
          </div>
        </div>

        <div className="science-topics-col">
          <div
            className="topics-section-title"
            style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}
          >
            <Play size={24} style={{ color: '#F59E0B' }} />
            <span style={{ fontSize: 24, fontWeight: 700 }}>Topics</span>
            <span
              className="topics-count-badge"
              style={{
                fontSize: 12,
                background: 'rgba(255,255,255,0.1)',
                padding: '4px 10px',
                borderRadius: 12,
              }}
            >
              {displayTopics.length} Topics
            </span>
          </div>

          <p style={{ marginBottom: 20, opacity: 0.7 }}>
            Open a topic for one workspace: practice, exam setup, notes, tutor, AI Classroom, and labs.
          </p>

          <div className="science-topics-grid">
            {displayTopics.map((topic) => {
              const TopicIcon = getChemTopicIcon(topic.name);
              return (
                <div
                  key={topic.id}
                  className="science-topic-card"
                  onClick={() =>
                    navigate(`/app/chemistry/topic/${encodeURIComponent(topic.id)}`)
                  }
                >
                  <div className="science-topic-card__row">
                    <div className="topic-icon-small">
                      <TopicIcon size={20} />
                    </div>
                    <MaicTopicClassroomLink
                      navigate={navigate}
                      subject="O Level Chemistry"
                      gradeLevel="Form 3-4 (O-Level)"
                      topicName={topic.name}
                    />
                  </div>
                  <span className="topic-card-name">{topic.name}</span>
                </div>
              );
            })}
          </div>

          <div
            className="topics-section-title"
            style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 60, marginBottom: 24 }}
          >
            <BookOpen size={24} style={{ color: '#FCD34D' }} />
            <span style={{ fontSize: 24, fontWeight: 700 }}>Study Notes</span>
          </div>

          <div className="topic-chips-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {chemistryTopics.map((topicName, i) => {
              const match = displayTopics.find((t) => t.name === topicName);
              const to = match
                ? `/app/chemistry/topic/${encodeURIComponent(match.id)}`
                : `/app/chemistry/notes/${encodeURIComponent(topicName)}`;
              return (
                <Link
                  key={i}
                  to={to}
                  style={{
                    display: 'inline-block',
                    padding: '10px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '50px',
                    color: '#fff',
                    fontSize: '14px',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  {topicName}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
