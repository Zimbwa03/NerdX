import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { type Topic } from '../../services/api/quizApi';
import {
  ArrowLeft, BookOpen, MessageSquare, Play, Scroll, FileText,
  Archive, Layers, Landmark, Globe, Mountain, Building, Anchor,
  Flag, Shield, Users, Target, Crown, Flame, Heart, Scale,
  Swords, AlertTriangle, ShieldCheck, Link2, Map, Bookmark,
  MapPin, GitMerge, Ban, Crosshair, UserPlus, Handshake,
  TrendingUp, BadgeCheck, Network, Megaphone, Bomb, Building2,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { MaicClassroomFeatureCard } from '../../components/MaicClassroomFeatureCard';
import { MaicTopicClassroomLink } from '../../components/MaicTopicClassroomLink';
import {
  historyFormLevels,
  getHistoryTopicsByForm,
  type HistoryFormLevel,
} from '../../data/historyNotes';
import '../sciences/ScienceUniverse.css';

/** Every history topic gets its own unique icon, keyed by topic ID. */
const HISTORY_TOPIC_ICONS: Record<string, LucideIcon> = {
  // ── Form 1 (11 topics) ──
  introduction_to_history:                       BookOpen,
  sources_of_history_form1:                      Archive,
  types_of_history:                              Layers,
  ancient_civilisation_in_egypt:                  Landmark,
  spread_of_egyptian_civilisation:                Globe,
  late_stone_age_and_transition_to_early_iron_age: Mountain,
  states_formation_in_zimbabwe:                   Building,
  causes_of_slave_trade:                          Link2,
  triangular_slave_trade:                         Anchor,
  impact_of_slave_trade:                          AlertTriangle,
  abolition_of_slave_trade:                       ShieldCheck,

  // ── Form 2 (10 topics) ──
  portuguese_prazo_system_zambezi_valley:          Map,
  early_missionary_activities_1850_1900:           Bookmark,
  background_to_colonisation_of_zimbabwe:          MapPin,
  process_of_colonisation_of_zimbabwe:             Flag,
  anglo_ndebele_war_1893_1894:                     Swords,
  first_chimurenga_umvukela_1896_1897:             Flame,
  colonial_policies_1923_1979:                     FileText,
  federation_rhodesia_nyasaland_1953_1963:          GitMerge,
  udi_unilateral_declaration_of_independence:       Ban,
  rise_of_nationalism:                             Users,

  // ── Form 3 (10 topics) ──
  causes_of_second_chimurenga_umvukela:            Shield,
  early_phase_armed_struggle:                      Crosshair,
  second_phase_armed_struggle_mobilisation:         UserPlus,
  decisive_phase_1972_1979:                        Target,
  peace_settlements_armed_struggle:                Handshake,
  social_political_economic_policies_since_1990:    TrendingUp,
  provisions_of_constitution:                      Scale,
  child_rights_and_responsibilities:               Heart,
  principles_of_good_governance:                   BadgeCheck,
  zimbabwe_regional_international_organisations:    Network,

  // ── Form 4 (6 topics) ──
  resistance_colonial_rule_mozambique_namibia:      Megaphone,
  causes_course_results_first_world_war:            Bomb,
  paris_peace_conference_post_war_treaties:          Scroll,
  league_of_nations:                               Building2,
  rise_of_european_dictators:                      Crown,
  causes_of_second_world_war:                      Sparkles,
};

export function HistoryTopicsPage() {
  const navigate = useNavigate();
  const [selectedForm, setSelectedForm] = useState<HistoryFormLevel>('Form 1');

  const formTopics = getHistoryTopicsByForm(selectedForm);
  const displayTopics = formTopics.map((t) => ({ id: t.id, name: t.name, subject: 'history' } as Topic));

  const notesTopics = getHistoryTopicsByForm(selectedForm).filter((t) => t.hasNotes);

  return (
    <div className="science-universe-page hist">
      <div className="science-universe-bg hist-bg">
        <div className="science-grid-overlay"></div>
      </div>

      <Link to="/app" className="super-back-btn">
        <ArrowLeft size={18} />
        <span>Dashboard</span>
      </Link>

      <div className="science-hero">
        <div className="science-hero-badge hist-badge">
          <Scroll size={14} />
          <span>O-LEVEL HISTORY</span>
        </div>
        <h1 className="science-hero-title hist-title">
          Explore the<br />Past
        </h1>
        <p style={{ maxWidth: 600, margin: '0 auto', opacity: 0.8 }}>
          Master ZIMSEC History with AI-powered essay practice, study notes, and exam preparation.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 28, flexWrap: 'wrap' }}>
          {historyFormLevels.map((form) => (
            <button
              key={form}
              type="button"
              onClick={() => setSelectedForm(form)}
              style={{
                padding: '10px 22px',
                borderRadius: 50,
                border: `2px solid ${selectedForm === form ? '#8D6E63' : 'rgba(255,255,255,0.15)'}`,
                background: selectedForm === form ? 'rgba(141, 110, 99, 0.25)' : 'rgba(255,255,255,0.05)',
                color: selectedForm === form ? '#D7CCC8' : 'rgba(255,255,255,0.7)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                backdropFilter: 'blur(8px)',
              }}
            >
              {form}
            </button>
          ))}
        </div>
      </div>

      <div className="science-content-grid">
        <div className="science-features-col">
          <div
            className="science-feature-card"
            onClick={() => navigate('/app/teacher', { state: { subject: 'History', gradeLevel: 'Form 3-4 (O-Level)' } })}
          >
            <div className="feature-icon-box">
              <MessageSquare size={28} />
            </div>
            <h3 className="feature-card-title">AI History Tutor</h3>
            <p className="feature-card-desc">Ask any history question. Get instant, detailed explanations.</p>
          </div>

          <MaicClassroomFeatureCard
            navigate={navigate}
            subject="History"
            gradeLevel={selectedForm}
            accent="rgba(141, 110, 99, 0.25)"
          />

          <div
            className="science-feature-card"
            onClick={() => navigate('/app/exam/setup', { state: { subject: 'history', backTo: '/app/history', subjectLabel: 'History' } })}
          >
            <div className="feature-icon-box">
              <FileText size={28} />
            </div>
            <h3 className="feature-card-title">Exam Mode</h3>
            <p className="feature-card-desc">Practice with timed essay questions under exam conditions.</p>
          </div>
        </div>

        <div className="science-topics-col">
          <div className="topics-section-title" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <Play size={24} style={{ color: '#8D6E63' }} />
            <span style={{ fontSize: 24, fontWeight: 700 }}>Topics – {selectedForm}</span>
            <span className="topics-count-badge" style={{ fontSize: 12, background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 12 }}>
              {displayTopics.length} Topics
            </span>
          </div>

          <p style={{ marginBottom: 20, opacity: 0.7 }}>
            Open a topic for essay practice, notes, tutor, AI Classroom, exam setup, and labs in one place.
          </p>

          <div className="science-topics-grid">
            {displayTopics.map((topic) => {
              const TopicIcon = HISTORY_TOPIC_ICONS[topic.id] ?? Scroll;
              return (
                <div
                  key={topic.id}
                  className="science-topic-card"
                  onClick={() =>
                    navigate(`/app/history/topic/${encodeURIComponent(topic.id)}`)
                  }
                >
                  <div className="science-topic-card__row">
                    <div className="topic-icon-small">
                      <TopicIcon size={20} />
                    </div>
                    <MaicTopicClassroomLink
                      navigate={navigate}
                      subject="History"
                      gradeLevel={selectedForm}
                      topicName={topic.name}
                    />
                  </div>
                  <span className="topic-card-name">{topic.name}</span>
                </div>
              );
            })}
          </div>

          <div className="topics-section-title" style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 60, marginBottom: 24 }}>
            <BookOpen size={24} style={{ color: '#A1887F' }} />
            <span style={{ fontSize: 24, fontWeight: 700 }}>Study Notes – {selectedForm}</span>
          </div>

          <div className="topic-chips-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {notesTopics.map((topic) => (
              <Link
                key={topic.id}
                to={`/app/history/topic/${encodeURIComponent(topic.id)}`}
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
