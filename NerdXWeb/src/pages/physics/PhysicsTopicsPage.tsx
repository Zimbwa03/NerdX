/**
 * PhysicsTopicsPage — topic cards open the unified topic hub.
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { quizApi, type Topic } from '../../services/api/quizApi';
import {
  ArrowLeft, BookOpen, Atom, Play, Zap, FileText,
  Ruler, Activity, ArrowUp, Box, RotateCw, Thermometer,
  Radio, Plug, Magnet, Cpu,
  type LucideIcon,
} from 'lucide-react';
import { MaicClassroomFeatureCard } from '../../components/MaicClassroomFeatureCard';
import { MaicTopicClassroomLink } from '../../components/MaicTopicClassroomLink';
import { physicsTopics } from '../../data/scienceNotes/physics';
import '../sciences/ScienceUniverse.css';

const PHYS_TOPICS_FALLBACK: Topic[] = [
  { id: 'measurements', name: 'General Physics & Measurements', subject: 'physics' },
  { id: 'kinematics', name: 'Kinematics (Motion)', subject: 'physics' },
  { id: 'dynamics', name: 'Dynamics (Forces)', subject: 'physics' },
  { id: 'mass_weight', name: 'Mass, Weight and Density', subject: 'physics' },
  { id: 'turning_effects', name: 'Turning Effects of Forces', subject: 'physics' },
  { id: 'energy', name: 'Work, Energy and Power', subject: 'physics' },
  { id: 'pressure', name: 'Pressure', subject: 'physics' },
  { id: 'thermal', name: 'Thermal Physics', subject: 'physics' },
  { id: 'waves', name: 'Waves (Light & Sound)', subject: 'physics' },
  { id: 'electricity', name: 'Electricity', subject: 'physics' },
  { id: 'magnetism', name: 'Magnetism', subject: 'physics' },
  { id: 'electromagnetism', name: 'Electromagnetism', subject: 'physics' },
  { id: 'electronics', name: 'Introductory Electronics', subject: 'physics' },
  { id: 'nuclear', name: 'Nuclear Physics', subject: 'physics' },
];

function getPhysTopicIcon(name: string): LucideIcon {
  const n = name.toLowerCase();
  if (n.includes('measurement') || n.includes('physical quantit')) return Ruler;
  if (n.includes('kinematics') || n.includes('motion')) return Activity;
  if (n.includes('turning effect')) return RotateCw;
  if (n.includes('force') || n.includes('dynamics') || n.includes('machine')) return ArrowUp;
  if (n.includes('mass') || n.includes('weight') || n.includes('density')) return Box;
  if (n.includes('energy') || n.includes('power') || n.includes('work')) return Zap;
  if (n.includes('pressure')) return ArrowUp;
  if (n.includes('thermal') || n.includes('heat')) return Thermometer;
  if (n.includes('wave') || n.includes('light') || n.includes('sound') || n.includes('optic')) return Radio;
  if (n.includes('electricity') || n.includes('circuit') || n.includes('current')) return Plug;
  if (n.includes('electromagnetism')) return Cpu;
  if (n.includes('magnetism')) return Magnet;
  if (n.includes('electronics') || n.includes('logic gate')) return Cpu;
  if (n.includes('nuclear') || n.includes('atomic') || n.includes('modern')) return Atom;
  return Atom;
}

export const PhysicsTopicsPage = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await quizApi.getTopics('physics');
        if (!cancelled && data?.length) setTopics(data);
        else if (!cancelled) setTopics(PHYS_TOPICS_FALLBACK);
      } catch {
        if (!cancelled) setTopics(PHYS_TOPICS_FALLBACK);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayTopics = topics.length ? topics : PHYS_TOPICS_FALLBACK;

  return (
    <div className="science-universe-page phys">
      <div className="science-universe-bg phys-bg">
        <div className="science-grid-overlay"></div>
      </div>

      <Link to="/app" className="super-back-btn">
        <ArrowLeft size={18} />
        <span>Dashboard</span>
      </Link>

      <div className="science-hero">
        <div className="science-hero-badge phys-badge">
          <Atom size={14} />
          <span>O-LEVEL PHYSICS</span>
        </div>
        <h1 className="science-hero-title phys-title">
          Unlock the<br />Universe
        </h1>
        <p style={{ maxWidth: 600, margin: '0 auto', opacity: 0.8 }}>
          Master forces, energy, and electricity with AI-powered simulations and practice.
        </p>
      </div>

      <div className="science-content-grid">
        <div className="science-features-col">
          <div
            className="science-feature-card"
            onClick={() =>
              navigate('/app/teacher', {
                state: { subject: 'O Level Physics', gradeLevel: 'Form 3-4 (O-Level)' },
              })
            }
          >
            <div className="feature-icon-box">
              <Zap size={28} />
            </div>
            <h3 className="feature-card-title">AI Physics Tutor</h3>
            <p className="feature-card-desc">Resolve complex physics problems with step-by-step AI guidance.</p>
          </div>

          <MaicClassroomFeatureCard
            navigate={navigate}
            subject="O Level Physics"
            gradeLevel="Form 3-4 (O-Level)"
            accent="rgba(6, 182, 212, 0.15)"
          />

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/virtual-lab?subject=physics')}
          >
            <div className="feature-icon-box">
              <Atom size={28} />
            </div>
            <h3 className="feature-card-title">Virtual Labs</h3>
            <p className="feature-card-desc">Experiment with circuits, forces, and waves in interactive simulations.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() =>
              navigate('/app/exam/setup', {
                state: { subject: 'physics', backTo: '/app/physics', subjectLabel: 'Physics' },
              })
            }
          >
            <div className="feature-icon-box">
              <FileText size={28} />
            </div>
            <h3 className="feature-card-title">Exam Mode</h3>
            <p className="feature-card-desc">Prepare for exams with timed past paper questions.</p>
          </div>
        </div>

        <div className="science-topics-col">
          <div
            className="topics-section-title"
            style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}
          >
            <Play size={24} style={{ color: '#06B6D4' }} />
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
              const TopicIcon = getPhysTopicIcon(topic.name);
              return (
                <div
                  key={topic.id}
                  className="science-topic-card"
                  onClick={() =>
                    navigate(`/app/physics/topic/${encodeURIComponent(topic.id)}`)
                  }
                >
                  <div className="science-topic-card__row">
                    <div className="topic-icon-small">
                      <TopicIcon size={20} />
                    </div>
                    <MaicTopicClassroomLink
                      navigate={navigate}
                      subject="O Level Physics"
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
            <BookOpen size={24} style={{ color: '#67E8F9' }} />
            <span style={{ fontSize: 24, fontWeight: 700 }}>Study Notes</span>
          </div>

          <div className="topic-chips-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {physicsTopics.map((topicName, i) => {
              const match = displayTopics.find((t) => t.name === topicName);
              const to = match
                ? `/app/physics/topic/${encodeURIComponent(match.id)}`
                : `/app/physics/notes/${encodeURIComponent(topicName)}`;
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
