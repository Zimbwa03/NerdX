/**
 * DashboardPage - Premium Desktop Dashboard
 * Advanced design with gradient cards, floating particles, and glassmorphism
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatCreditBalance } from '../utils/creditCalculator';
import { FloatingParticles } from '../components/FloatingParticles';
import { SubjectCard } from '../components/SubjectCard';
import { LogOut, Calculator, FlaskConical, BookOpen, Monitor, Globe, Receipt, Briefcase, Clock, GraduationCap, MessageCircle, Beaker, TrendingUp, Coins, Wifi, Mic, Atom, Brain, Map } from 'lucide-react';

// O Level subjects with gradient colors and icons
const O_LEVEL_SUBJECTS = [
  { id: 'mathematics', title: 'Mathematics', subtitle: 'Build Strong Math Foundations', icon: Calculator, from: '#2979FF', to: '#1565C0' },
  { id: 'biology', title: 'Biology', subtitle: 'Life Sciences & Organisms', icon: Brain, from: '#00E676', to: '#00C853' },
  { id: 'chemistry', title: 'Chemistry', subtitle: 'Matter & Reactions', icon: Beaker, from: '#00BCD4', to: '#0097A7' },
  { id: 'physics', title: 'Physics', subtitle: 'Forces & Energy', icon: Atom, from: '#5C6BC0', to: '#3949AB' },
  { id: 'english', title: 'English', subtitle: 'Read, Write & Communicate', icon: BookOpen, from: '#FF9100', to: '#FF6D00' },
  { id: 'computer_science', title: 'Computer Science', subtitle: 'ZimSec & Cambridge O Level', icon: Monitor, from: '#0288D1', to: '#01579B' },
  { id: 'geography', title: 'Geography', subtitle: 'Explore Our World', icon: Globe, from: '#2E7D32', to: '#1B5E20' },
  { id: 'commerce', title: 'Commerce', subtitle: 'Business, Trade & Finance', icon: Receipt, from: '#FF9800', to: '#EF6C00' },
  { id: 'business_enterprise_skills', title: 'Business Enterprise', subtitle: 'Leadership & Skills', icon: Briefcase, from: '#14B8A6', to: '#0D9488' },
  { id: 'history', title: 'History', subtitle: 'Explore Past Events', icon: Clock, from: '#5D4037', to: '#4E342E' },
  { id: 'project_assistant', title: 'Project Assistant', subtitle: 'Plan, Research & Succeed', icon: GraduationCap, from: '#7C4DFF', to: '#651FFF' },
];

// A Level subjects
const A_LEVEL_SUBJECTS = [
  { id: 'pure_mathematics', title: 'Pure Mathematics', subtitle: 'Logical & Analytical Skills', icon: Calculator, from: '#8B5CF6', to: '#6D28D9' },
  { id: 'chemistry', title: 'Chemistry', subtitle: 'Matter & Reactions', icon: Beaker, from: '#10B981', to: '#059669' },
  { id: 'physics', title: 'Physics', subtitle: 'Laws of Nature', icon: Atom, from: '#3B82F6', to: '#2563EB' },
  { id: 'biology', title: 'Biology', subtitle: 'Cell Biology & Genetics', icon: Brain, from: '#14B8A6', to: '#0D9488' },
  { id: 'computer_science', title: 'Computer Science', subtitle: 'Code, Algorithms & Systems', icon: Monitor, from: '#0D47A1', to: '#0A3A8A' },
  { id: 'geography', title: 'Geography', subtitle: 'Advanced Concepts', icon: Map, from: '#2E7D32', to: '#1B5E20' },
];

// Feature cards (no images, just gradients and icons)
const FEATURE_CARDS = [
  { id: 'teacher', title: 'Teacher Mode', subtitle: 'Interactive AI Teaching', icon: MessageCircle, from: '#00E676', to: '#00C853' },
  { id: 'virtual_labs', title: 'Virtual Labs', subtitle: 'Interactive Simulations', icon: FlaskConical, from: '#FF6D00', to: '#E65100' },
];

const MORE_TOOLS = [
  { id: 'offline', title: 'Offline Chat', subtitle: 'Free • Works Offline', icon: Wifi, from: '#10B981', to: '#059669' },
  { id: 'nerdx_live', title: 'NerdX Live', subtitle: 'Real-time Speech Conversations', icon: Mic, from: '#6C63FF', to: '#5A52E0' },
  { id: 'progress', title: 'My Progress', subtitle: 'Track Your Learning', icon: TrendingUp, from: '#a18cd1', to: '#8B7FD1' },
  { id: 'credits', title: 'Credits & Store', subtitle: 'Boost Your Learning', icon: Coins, from: '#fbc2eb', to: '#e8b4d9' },
];

export function DashboardPage() {
  const [selectedLevel, setSelectedLevel] = useState<'O Level' | 'A Level'>('O Level');
  const [toast, setToast] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const showComingSoon = () => {
    setToast('Coming soon - available on the NerdX mobile app');
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubjectClick = (id: string) => {
    const routeMap: Record<string, string> = {
      credits: '/app/credits',
      progress: '/app/progress',
      mathematics: '/app/mathematics',
      biology: '/app/biology',
      chemistry: '/app/chemistry',
      physics: '/app/physics',
      english: '/app/english',
      computer_science: '/app/computer-science',
      geography: '/app/geography',
      commerce: '/app/commerce',
      business_enterprise_skills: '/app/business-enterprise-skills',
      history: '/app/history',
      teacher: '/app/teacher',
    };

    if (routeMap[id]) {
      navigate(routeMap[id]);
    } else {
      showComingSoon();
    }
  };

  const handleALevelClick = (id: string) => {
    const routeMap: Record<string, string> = {
      pure_mathematics: '/app/pure-math',
      chemistry: '/app/a-level-chemistry',
      physics: '/app/a-level-physics',
      biology: '/app/a-level-biology',
      computer_science: '/app/a-level-computer-science',
      geography: '/app/a-level-geography',
    };

    if (routeMap[id]) {
      navigate(routeMap[id]);
    } else {
      showComingSoon();
    }
  };

  const subjects = selectedLevel === 'O Level' ? O_LEVEL_SUBJECTS : A_LEVEL_SUBJECTS;

  return (
    <div className="dashboard-page-v2">
      <FloatingParticles count={20} />

      {toast && (
        <div className="dashboard-toast" role="alert">
          {toast}
        </div>
      )}

      {/* Hero Section */}
      <section className="dashboard-hero-v2">
        <div className="hero-content">
          <span className="hero-greeting">Welcome back 👋</span>
          <h1 className="hero-name">{user?.name ? `${user.name} ${user.surname || ''}`.trim() : 'Student'}</h1>
          <div className="hero-id">
            <span>NerdX ID:</span>
            <code>{user?.nerdx_id || 'N/A'}</code>
          </div>
        </div>

        <Link to="/app/credits" className="credits-card-v2">
          <div className="credits-glow" />
          <span className="credits-amount">{formatCreditBalance(user?.credits)}</span>
          <span className="credits-label">Credits</span>
          <span className="credits-add">+</span>
        </Link>
      </section>

      {/* Learning Hub */}
      <section className="learning-hub-v2">
        <div className="section-header-v2">
          <h2>Learning Hub</h2>
          <div className="level-toggle-v2">
            <button
              type="button"
              className={`level-btn ${selectedLevel === 'O Level' ? 'active' : ''}`}
              onClick={() => setSelectedLevel('O Level')}
            >
              O Level
            </button>
            <button
              type="button"
              className={`level-btn ${selectedLevel === 'A Level' ? 'active' : ''}`}
              onClick={() => setSelectedLevel('A Level')}
            >
              A Level
            </button>
          </div>
        </div>

        <div className="subjects-grid-v2">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              title={subject.title}
              subtitle={subject.subtitle}
              icon={subject.icon}
              gradientFrom={subject.from}
              gradientTo={subject.to}
              onClick={() => selectedLevel === 'O Level' ? handleSubjectClick(subject.id) : handleALevelClick(subject.id)}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section-v2">
        <h3>AI Features</h3>
        <div className="features-grid-v2">
          {FEATURE_CARDS.map((card) => (
            <SubjectCard
              key={card.id}
              title={card.title}
              subtitle={card.subtitle}
              icon={card.icon}
              gradientFrom={card.from}
              gradientTo={card.to}
              onClick={() => handleSubjectClick(card.id)}
            />
          ))}
        </div>
      </section>

      {/* More Tools Section */}
      <section className="more-tools-v2">
        <h3>More Tools</h3>
        <div className="tools-grid-v2">
          {MORE_TOOLS.map((tool) => (
            <SubjectCard
              key={tool.id}
              title={tool.title}
              subtitle={tool.subtitle}
              icon={tool.icon}
              gradientFrom={tool.from}
              gradientTo={tool.to}
              onClick={() => handleSubjectClick(tool.id)}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="dashboard-footer-v2">
        <button type="button" className="logout-btn-v2" onClick={() => logout()}>
          <LogOut size={18} /> Sign Out
        </button>
      </footer>
    </div>
  );
}
