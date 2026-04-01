import { Link, useNavigate } from 'react-router-dom';
import type { Topic } from '../../services/api/quizApi';
import {
  ArrowLeft,
  BookOpen,
  MessageSquare,
  Play,
  FileText,
  Globe,
  Cloud,
  Mountain,
  Leaf,
  Gem,
  Zap,
  Map,
  Hammer,
  Recycle,
  Wheat,
  Factory,
  Building,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import { MaicClassroomFeatureCard } from '../../components/MaicClassroomFeatureCard';
import { MaicTopicClassroomLink } from '../../components/MaicTopicClassroomLink';
import { oLevelGeographyTopics } from '../../data/oLevelGeography';
import '../sciences/ScienceUniverse.css';

const GEO_TOPIC_ICONS: Record<string, LucideIcon> = {
  weather_and_climate: Cloud,
  landforms_and_landscape_processes: Mountain,
  ecosystems: Leaf,
  natural_resources: Gem,
  energy_and_power_development: Zap,
  map_work_and_gis: Map,
  minerals_and_mining: Hammer,
  environmental_management: Recycle,
  agriculture_and_land_reform: Wheat,
  industry: Factory,
  settlement_and_population: Building,
  transport_and_trade: Truck,
};

export function GeographyTopicsPage() {
  const navigate = useNavigate();

  const displayTopics = oLevelGeographyTopics.map(
    (topic) =>
      ({
        id: topic.id,
        name: topic.name,
        subject: 'geography',
      }) as Topic,
  );
  const notesTopics = oLevelGeographyTopics.filter((topic) => topic.hasNotes);

  return (
    <div className="science-universe-page geo">
      <div className="science-universe-bg geo-bg">
        <div className="science-grid-overlay"></div>
      </div>

      <Link to="/app" className="super-back-btn">
        <ArrowLeft size={18} />
        <span>Dashboard</span>
      </Link>

      <div className="science-hero">
        <div className="science-hero-badge" style={{ background: 'rgba(46, 125, 50, 0.18)', border: '1px solid rgba(46, 125, 50, 0.35)' }}>
          <Globe size={14} />
          <span>O-LEVEL GEOGRAPHY</span>
        </div>
        <h1 className="science-hero-title" style={{ background: 'linear-gradient(135deg, #2E7D32, #43A047, #81C784)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Discover the World<br />with Geography
        </h1>
        <p style={{ maxWidth: 700, margin: '0 auto', opacity: 0.8 }}>
          Full O-Level Geography coverage with topic practice, detailed notes, maps lab, and exam preparation.
        </p>
      </div>

      <div className="science-content-grid">
        <div className="science-features-col">
          <div
            className="science-feature-card"
            onClick={() => navigate('/app/teacher', { state: { subject: 'Geography', gradeLevel: 'Form 3-4 (O-Level)' } })}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
              <MessageSquare size={28} color="#34D399" />
            </div>
            <h3 className="feature-card-title">AI Geography Tutor</h3>
            <p className="feature-card-desc">Ask geography questions and get clear, syllabus-aligned guidance instantly.</p>
          </div>

          <MaicClassroomFeatureCard
            navigate={navigate}
            subject="Geography"
            gradeLevel="Form 3-4 (O-Level)"
            accent="rgba(46, 125, 50, 0.2)"
          />

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/geography/notes')}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(46, 125, 50, 0.18)' }}>
              <BookOpen size={28} color="#66BB6A" />
            </div>
            <h3 className="feature-card-title">Study Notes</h3>
            <p className="feature-card-desc">Read complete notes, key points, exam tips, and media resources for each topic.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/virtual-lab/geo-maps-lab')}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(0, 188, 212, 0.18)' }}>
              <Map size={28} color="#4DD0E1" />
            </div>
            <h3 className="feature-card-title">Maps Lab</h3>
            <p className="feature-card-desc">Interactive OpenStreetMap lab for mapwork, bearings, distance, and fieldwork skills.</p>
          </div>

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/exam/setup', { state: { subject: 'geography', backTo: '/app/geography', subjectLabel: 'Geography' } })}
          >
            <div className="feature-icon-box" style={{ background: 'rgba(46, 125, 50, 0.18)' }}>
              <FileText size={28} color="#81C784" />
            </div>
            <h3 className="feature-card-title">Simulated Exam</h3>
            <p className="feature-card-desc">Practice timed exam conditions with mixed Geography questions.</p>
          </div>
        </div>

        <div className="science-topics-col">
          <div className="topics-section-title" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <Play size={24} style={{ color: '#66BB6A' }} />
            <span style={{ fontSize: 24, fontWeight: 700 }}>Topics</span>
            <span className="topics-count-badge" style={{ fontSize: 12, background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 12 }}>
              {displayTopics.length} Topics
            </span>
          </div>

          <p style={{ marginBottom: 20, opacity: 0.72 }}>
            Open a topic for practice, exam setup, notes, tutor, AI Classroom, and matched labs.
          </p>

          <div className="science-topics-grid">
            {displayTopics.map((topic) => {
              const TopicIcon = GEO_TOPIC_ICONS[topic.id] ?? Globe;
              return (
                <div
                  key={topic.id}
                  className="science-topic-card"
                  onClick={() =>
                    navigate(`/app/geography/topic/${encodeURIComponent(topic.id)}`)
                  }
                >
                  <div className="science-topic-card__row">
                    <div className="topic-icon-small">
                      <TopicIcon size={20} />
                    </div>
                    <MaicTopicClassroomLink
                      navigate={navigate}
                      subject="Geography"
                      gradeLevel="Form 3-4 (O-Level)"
                      topicName={topic.name}
                    />
                  </div>
                  <span className="topic-card-name">{topic.name}</span>
                </div>
              );
            })}
          </div>

          <div className="topics-section-title" style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 60, marginBottom: 24 }}>
            <BookOpen size={24} style={{ color: '#81C784' }} />
            <span style={{ fontSize: 24, fontWeight: 700 }}>Study Notes</span>
          </div>

          <div className="topic-chips-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {notesTopics.map((topic) => (
              <Link
                key={topic.id}
                to={`/app/geography/topic/${encodeURIComponent(topic.id)}`}
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
                {topic.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
