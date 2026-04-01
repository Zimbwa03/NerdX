/**
 * BiologyTopicsPage - Premium Science Design
 * Topic cards open the unified topic hub (practice, notes, tutor, labs).
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { quizApi, type Topic } from '../../services/api/quizApi';
import {
  ArrowLeft, BookOpen, Microscope, FlaskConical, Play, Dna, FileText,
  ArrowLeftRight, Leaf, Heart, Wind, Droplets, Brain, Thermometer,
  TreePine, Flower2, HeartPulse, Bug, Globe, Tags,
  type LucideIcon,
} from 'lucide-react';
import { MaicClassroomFeatureCard } from '../../components/MaicClassroomFeatureCard';
import { MaicTopicClassroomLink } from '../../components/MaicTopicClassroomLink';
import { biologyTopics } from '../../data/scienceNotes/biology';
import '../sciences/ScienceUniverse.css';

const BIO_TOPICS_FALLBACK: Topic[] = [
  { id: 'cells', name: 'Cell Structure and Organisation', subject: 'biology' },
  { id: 'transport', name: 'Movement In and Out of Cells', subject: 'biology' },
  { id: 'enzymes', name: 'Enzymes', subject: 'biology' },
  { id: 'plant_nutrition', name: 'Plant Nutrition', subject: 'biology' },
  { id: 'animal_nutrition', name: 'Animal Nutrition', subject: 'biology' },
  { id: 'transport_plants', name: 'Transport in Plants', subject: 'biology' },
  { id: 'transport_animals', name: 'Transport in Animals', subject: 'biology' },
  { id: 'respiration', name: 'Respiration', subject: 'biology' },
  { id: 'excretion', name: 'Excretion in Humans', subject: 'biology' },
  { id: 'coordination', name: 'Coordination and Response', subject: 'biology' },
  { id: 'homeostasis', name: 'Homeostasis', subject: 'biology' },
  { id: 'drugs', name: 'Drugs', subject: 'biology' },
  { id: 'reproduction_plants', name: 'Reproduction in Plants', subject: 'biology' },
  { id: 'reproduction_humans', name: 'Reproduction in Humans', subject: 'biology' },
  { id: 'inheritance', name: 'Inheritance', subject: 'biology' },
  { id: 'ecosystems', name: 'Relationships of Organisms', subject: 'biology' },
  { id: 'environment', name: 'Humans and the Environment', subject: 'biology' },
];

function getBioTopicIcon(name: string): LucideIcon {
  const n = name.toLowerCase();
  if (n.includes('cell structure') || n.includes('cell organ')) return Microscope;
  if (n.includes('movement in and out') || n.includes('osmosis') || n.includes('diffusion')) return ArrowLeftRight;
  if (n.includes('enzyme')) return FlaskConical;
  if (n.includes('plant nutrition') || n.includes('photosynthesis')) return Leaf;
  if (n.includes('animal nutrition') || n.includes('digestion')) return Heart;
  if (n.includes('transport in plant')) return TreePine;
  if (n.includes('transport in human') || n.includes('transport in animal')) return HeartPulse;
  if (n.includes('respiration')) return Wind;
  if (n.includes('excretion')) return Droplets;
  if (n.includes('coordination') || n.includes('response') || n.includes('nervous')) return Brain;
  if (n.includes('homeostasis')) return Thermometer;
  if (n.includes('drug')) return FlaskConical;
  if (n.includes('reproduction in plant') || n.includes('plant reproduction')) return Flower2;
  if (n.includes('reproduction')) return HeartPulse;
  if (n.includes('inheritance') || n.includes('genetics')) return Dna;
  if (n.includes('organism') || n.includes('ecosystem') || n.includes('relationship')) return Bug;
  if (n.includes('environment') || n.includes('human influence')) return Globe;
  if (n.includes('classification')) return Tags;
  return Dna;
}

export const BiologyTopicsPage = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await quizApi.getTopics('biology');
        if (!cancelled && data?.length) setTopics(data);
        else if (!cancelled) setTopics(BIO_TOPICS_FALLBACK);
      } catch {
        if (!cancelled) setTopics(BIO_TOPICS_FALLBACK);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayTopics = topics.length ? topics : BIO_TOPICS_FALLBACK;

  return (
    <div className="science-universe-page bio">
      <div className="science-universe-bg bio-bg">
        <div className="science-grid-overlay"></div>
      </div>

      <Link to="/app" className="super-back-btn">
        <ArrowLeft size={18} />
        <span>Dashboard</span>
      </Link>

      <div className="science-hero">
        <div className="science-hero-badge bio-badge">
          <Dna size={14} />
          <span>O-LEVEL BIOLOGY</span>
        </div>
        <h1 className="science-hero-title bio-title">
          Master the<br />Living World
        </h1>
        <p style={{ maxWidth: 600, margin: '0 auto', opacity: 0.8 }}>
          Explore cell structure, genetics, and ecosystems with AI-powered interactive learning.
        </p>
      </div>

      <div className="science-content-grid">
        <div className="science-features-col">
          <div
            className="science-feature-card"
            onClick={() =>
              navigate('/app/teacher', {
                state: { subject: 'O Level Biology', gradeLevel: 'Form 3-4 (O-Level)' },
              })
            }
          >
            <div className="feature-icon-box">
              <Microscope size={28} />
            </div>
            <h3 className="feature-card-title">AI Bio Tutor</h3>
            <p className="feature-card-desc">Ask any biology question. Get instant, diagram-rich explanations.</p>
          </div>

          <MaicClassroomFeatureCard
            navigate={navigate}
            subject="O Level Biology"
            gradeLevel="Form 3-4 (O-Level)"
            accent="rgba(16, 185, 129, 0.15)"
          />

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/virtual-lab?subject=biology')}
          >
            <div className="feature-icon-box">
              <FlaskConical size={28} />
            </div>
            <h3 className="feature-card-title">Virtual Labs</h3>
            <p className="feature-card-desc">Simulate experiments and visualize biological processes interactively.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() =>
              navigate('/app/exam/setup', {
                state: { subject: 'biology', backTo: '/app/biology', subjectLabel: 'Biology' },
              })
            }
          >
            <div className="feature-icon-box">
              <FileText size={28} />
            </div>
            <h3 className="feature-card-title">Exam Mode</h3>
            <p className="feature-card-desc">Practice with full past paper simulations under timed conditions.</p>
          </div>
        </div>

        <div className="science-topics-col">
          <div
            className="topics-section-title"
            style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}
          >
            <Play size={24} className="text-bio" style={{ color: '#10B981' }} />
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
            Open a topic for one workspace: practice, simulated exam, notes, tutor, AI Classroom, and matched labs.
          </p>

          <div className="science-topics-grid">
            {displayTopics.map((topic) => {
              const TopicIcon = getBioTopicIcon(topic.name);
              return (
                <div
                  key={topic.id}
                  className="science-topic-card"
                  onClick={() =>
                    navigate(`/app/biology/topic/${encodeURIComponent(topic.id)}`)
                  }
                >
                  <div className="science-topic-card__row">
                    <div className="topic-icon-small">
                      <TopicIcon size={20} />
                    </div>
                    <MaicTopicClassroomLink
                      navigate={navigate}
                      subject="O Level Biology"
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
            <BookOpen size={24} style={{ color: '#34D399' }} />
            <span style={{ fontSize: 24, fontWeight: 700 }}>Study Notes</span>
          </div>

          <div className="topic-chips-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {biologyTopics.map((topicName, i) => {
              const match = displayTopics.find((t) => t.name === topicName);
              const to = match
                ? `/app/biology/topic/${encodeURIComponent(match.id)}`
                : `/app/biology/notes/${encodeURIComponent(topicName)}`;
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
