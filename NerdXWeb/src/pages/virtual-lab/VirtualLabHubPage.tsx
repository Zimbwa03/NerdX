import { type ElementType } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Atom, Beaker, BookOpen, Brain, Calculator, Code, Database, Globe, Leaf, Zap } from 'lucide-react';
import { FloatingParticles } from '../../components/FloatingParticles';
import { useAuth } from '../../context/AuthContext';

type FeaturedLab = {
  id: string;
  title: string;
  subtitle: string;
  icon: ElementType;
  from: string;
  to: string;
};

const FEATURED_LABS: FeaturedLab[] = [
  { id: 'cell-explorer', title: 'Cell Explorer', subtitle: 'Biology simulation', icon: Leaf, from: '#10B981', to: '#059669' },
  { id: 'osmosis-adventure', title: 'Osmosis Adventure', subtitle: 'Biology interactive lab', icon: Brain, from: '#22C55E', to: '#16A34A' },
  { id: 'atom-builder', title: 'Atom Builder', subtitle: 'Build atoms and isotopes', icon: Atom, from: '#00BCD4', to: '#0097A7' },
  { id: 'equation-balancer', title: 'Equation Balancer', subtitle: 'Balance reactions', icon: Beaker, from: '#F59E0B', to: '#D97706' },
  { id: 'circuit-builder', title: 'Circuit Builder', subtitle: 'Series and parallel circuits', icon: Zap, from: '#3B82F6', to: '#2563EB' },
  { id: 'projectile-motion', title: 'Projectile Motion', subtitle: 'Physics graphs and motion', icon: BookOpen, from: '#6366F1', to: '#4F46E5' },
  { id: 'quadratic-explorer', title: 'Quadratic Explorer', subtitle: 'Functions and graphs', icon: Calculator, from: '#7C4DFF', to: '#651FFF' },
  { id: 'geo-maps', title: 'Geo Maps', subtitle: 'Map layers and exploration', icon: Globe, from: '#2E7D32', to: '#1B5E20' },
  { id: 'programming-editor', title: 'Programming Lab', subtitle: 'Code editor and tasks', icon: Code, from: '#111827', to: '#374151' },
  { id: 'database-editor', title: 'Database Lab', subtitle: 'SQL practice editor', icon: Database, from: '#0F766E', to: '#14B8A6' },
];

export function VirtualLabHubPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const hasPaidCredits = (user?.credit_breakdown?.purchased_credits ?? 0) > 0;

  return (
    <div className="subject-page-v2 virtual-lab-page">
      <FloatingParticles count={14} />

      <header className="subject-header-v2">
        <Link to="/app" className="back-btn-v2">
          <span aria-hidden="true">&larr;</span>
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #1976D2, #1565C0)' }}>
            <Atom size={28} />
          </div>
          <div>
            <h1>Virtual Lab</h1>
            <p>Interactive simulations and skill labs (web parity in progress)</p>
          </div>
        </div>
      </header>

      <div className="subject-content-grid">
        <div className="subject-features-col">
          <section className="subject-section-v2">
            <h2>How It Works</h2>
            <div className="feature-cards-v2">
              <button
                type="button"
                className="feature-card-v2 feature-card-highlight"
                onClick={() => navigate('/app/teacher/chat', { state: { subject: 'Combined Science', gradeLevel: 'Form 3-4 (O-Level)', prefillMessage: 'I want to learn using Virtual Labs. Recommend the best lab for my weak topic and give me a short plan.' } })}
              >
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #7C4DFF, #00E676)' }}>
                  <Brain size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>Ask AI Which Lab</h3>
                  <p>Get a recommended lab based on your weak areas</p>
                </div>
                <span className="feature-arrow">â†’</span>
              </button>

              <button
                type="button"
                className="feature-card-v2"
                onClick={() => navigate('/app/credits')}
              >
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #FFD93D, #F59E0B)' }}>
                  <Zap size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>Unlock Labs</h3>
                  <p>{hasPaidCredits ? 'All labs unlocked (paid credits detected)' : 'Some labs may be locked - purchase credits to unlock all'}</p>
                </div>
                <span className="feature-arrow">â†’</span>
              </button>

              <button
                type="button"
                className="feature-card-v2"
                onClick={() => navigate('/app/agents')}
              >
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #00BCD4, #0097A7)' }}>
                  <BookOpen size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>Agent Hub</h3>
                  <p>Use specialist agents to practice after a lab</p>
                </div>
                <span className="feature-arrow">â†’</span>
              </button>
            </div>
          </section>

          <section className="subject-section-v2">
            <h2>Categories</h2>
            <div className="feature-cards-v2">
              <button type="button" className="feature-card-v2" onClick={() => navigate('/app/virtual-lab?subject=science')}>
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #10B981, #06B6D4)' }}>
                  <Beaker size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>Science</h3>
                  <p>Biology, Chemistry, Physics simulations</p>
                </div>
                <span className="feature-arrow">â†’</span>
              </button>
              <button type="button" className="feature-card-v2" onClick={() => navigate('/app/virtual-lab?subject=mathematics')}>
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #2979FF, #7C4DFF)' }}>
                  <Calculator size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>Mathematics</h3>
                  <p>Graphs, calculus, probability, vectors</p>
                </div>
                <span className="feature-arrow">â†’</span>
              </button>
              <button type="button" className="feature-card-v2" onClick={() => navigate('/app/virtual-lab?subject=geography')}>
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #2E7D32, #1B5E20)' }}>
                  <Globe size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>Geography</h3>
                  <p>Map work, bearings, scale and distance</p>
                </div>
                <span className="feature-arrow">â†’</span>
              </button>
              <button type="button" className="feature-card-v2" onClick={() => navigate('/app/virtual-lab?subject=programming')}>
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #111827, #374151)' }}>
                  <Code size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>Programming and IT</h3>
                  <p>Code, web design, databases</p>
                </div>
                <span className="feature-arrow">â†’</span>
              </button>
            </div>
          </section>
        </div>

        <div className="subject-topics-col">
          <section className="subject-section-v2">
            <h2>Featured Labs</h2>
            <p className="section-subtitle">Batch 2 will port every lab screen; these routes are ready now</p>
            <div className="topics-grid-v2">
              {FEATURED_LABS.map((lab) => (
                <button
                  key={lab.id}
                  type="button"
                  className="topic-card-v2"
                  onClick={() => navigate(`/app/virtual-lab/${lab.id}`)}
                >
                  <div className="topic-card-icon" style={{ background: `linear-gradient(135deg, ${lab.from}, ${lab.to})` }}>
                    <lab.icon size={18} />
                  </div>
                  <span className="topic-card-name">{lab.title}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
