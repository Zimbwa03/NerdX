import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatCreditBalance } from '../utils/creditCalculator';
import { FeatureCard } from '../components/FeatureCard';
import { LogOut } from 'lucide-react';

const O_LEVEL_CARDS = [
  { id: 'mathematics', title: 'O Level Mathematics', subtitle: 'Build Strong Math Foundations', image: '/images/olevel_mathematics_card.png', color: '#2979FF' },
  { id: 'combined_science', title: 'Sciences', subtitle: 'Explore the World Around You', image: '/images/olevel_sciences_card.png', color: '#00E676' },
  { id: 'business_enterprise_skills', title: 'Business Enterprise and Skills', subtitle: 'Enterprise, Leadership & Skills (4048)', image: '/images/olevel_sciences_card.png', color: '#2E7D32' },
  { id: 'history', title: 'History', subtitle: 'ZIMSEC O-Level History', image: '/images/olevel_sciences_card.png', color: '#5D4037' },
  { id: 'commerce', title: 'Commerce', subtitle: 'Business, Trade & Economics', image: '/images/olevel_sciences_card.png', color: '#B8860B' },
  { id: 'english', title: 'English', subtitle: 'Read, Write & Communicate', image: '/images/olevel_english_card.png', color: '#FF9100' },
  { id: 'computer_science', title: 'Computer Science', subtitle: 'ZimSec & Cambridge O Level', image: '/images/olevel_computer_science_card.png', color: '#0288D1' },
  { id: 'geography', title: 'Geography', subtitle: 'All Level ZIMSEC Geography', image: '/images/olevel_geography_card.png', color: '#2E7D32' },
  { id: 'project_assistant', title: 'Project Assistant', subtitle: 'Plan, Research & Succeed', image: '/images/project_assistant_card_new.png', color: '#7C4DFF' },
];

const A_LEVEL_CARDS = [
  { id: 'pure_mathematics', title: 'A Level Pure Mathematics', subtitle: 'Build Logical & Analytical Skills', image: '/images/alevel_pure_math_card.png', color: '#8B5CF6' },
  { id: 'chemistry', title: 'A Level Chemistry', subtitle: 'Explore Matter & Reactions', image: '/images/alevel_chemistry_card.png', color: '#10B981' },
  { id: 'physics', title: 'A Level Physics', subtitle: 'Understand the Laws of Nature', image: '/images/alevel_physics_card.png', color: '#3B82F6' },
  { id: 'biology', title: 'A Level Biology', subtitle: 'Cell biology & genetics', image: '/images/alevel_biology_card.png', color: '#14B8A6' },
  { id: 'computer_science', title: 'A Level Computer Science', subtitle: 'Master Code, Algorithms & Systems', image: '/images/alevel_computer_science_card.png', color: '#0D47A1' },
  { id: 'geography', title: 'A Level Geography', subtitle: 'Explore Advanced Concepts & Systems', image: '/images/alevel_geography_card.png', color: '#2E7D32' },
];

const FEATURE_CARDS_ROW = [
  { id: 'teacher', title: 'Teacher Mode', subtitle: 'Interactive AI Teaching', image: '/images/teacher_mode_card.png', color: '#00E676' },
  { id: 'virtual_labs', title: 'Virtual Labs', subtitle: 'Interactive Science Simulations', image: '/images/virtual_labs_card.png', color: '#00E676' },
];

const FEATURE_CARDS_FULL = [
  { id: 'offline', title: 'Offline Chat', subtitle: 'Free • Basic Questions • Works Offline', image: '/images/offline_chat_card.png', color: '#10B981' },
  { id: 'nerdx_live', title: 'NerdX Live', subtitle: 'Real-time Speech-to-Speech Conversations', image: '/images/nerdx_live_card.png', color: '#6C63FF' },
  { id: 'progress', title: 'My Progress', subtitle: 'Track Your Learning Journey', image: '/images/my_progress_card.png', color: '#a18cd1' },
  { id: 'credits', title: 'Credits & Store', subtitle: 'Redeem Rewards & Boost Learning', image: '/images/credits_card_new.png', color: '#fbc2eb' },
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

  const handleCardClick = (id: string) => {
    switch (id) {
      case 'credits':
        navigate('/app/credits');
        break;
      case 'progress':
        navigate('/app/progress');
        break;
      case 'mathematics':
        navigate('/app/mathematics');
        break;
      case 'combined_science':
        navigate('/app/sciences');
        break;
      case 'english':
        navigate('/app/english');
        break;
      case 'computer_science':
        navigate('/app/computer-science');
        break;
      case 'geography':
        navigate('/app/geography');
        break;
      case 'commerce':
        navigate('/app/commerce');
        break;
      case 'business_enterprise_skills':
        navigate('/app/business-enterprise-skills');
        break;
      case 'history':
        navigate('/app/history');
        break;
      default:
        showComingSoon();
    }
  };

  const subjectCards = selectedLevel === 'O Level' ? O_LEVEL_CARDS : A_LEVEL_CARDS;

  return (
    <div className="dashboard-page">
      {toast && (
        <div className="dashboard-toast" role="alert">
          {toast}
        </div>
      )}

      <section className="dashboard-hero">
        <div className="dashboard-hero-content">
          <p className="dashboard-greeting">Welcome back</p>
          <h1 className="dashboard-name">{user?.name ? `${user.name} ${user.surname || ''}`.trim() : 'Student'}</h1>
          <span className="dashboard-id-badge">ID: {user?.nerdx_id || 'N/A'}</span>
        </div>
        <Link to="/app/credits" className="dashboard-credits-badge">
          <span className="credits-value">{formatCreditBalance(user?.credits)}</span>
          <span className="credits-label">Credits</span>
          <span className="credits-topup">+</span>
        </Link>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Learning Hub</h2>
          <div className="level-tabs">
            <button
              type="button"
              className={`level-tab ${selectedLevel === 'O Level' ? 'level-tab-active' : ''}`}
              onClick={() => setSelectedLevel('O Level')}
            >
              O Level
            </button>
            <button
              type="button"
              className={`level-tab ${selectedLevel === 'A Level' ? 'level-tab-active' : ''}`}
              onClick={() => setSelectedLevel('A Level')}
            >
              A Level
            </button>
          </div>
        </div>

        <div className="card-grid card-grid-subjects">
          {subjectCards.map((card) => (
            <FeatureCard
              key={card.id}
              title={card.title}
              subtitle={card.subtitle}
              imageSrc={card.image}
              onClick={() => handleCardClick(card.id)}
              glowColor={card.color}
            />
          ))}
        </div>

        <div className="card-grid card-grid-features">
          {FEATURE_CARDS_ROW.map((card) => (
            <FeatureCard
              key={card.id}
              title={card.title}
              subtitle={card.subtitle}
              imageSrc={card.image}
              onClick={() => handleCardClick(card.id)}
              glowColor={card.color}
            />
          ))}
        </div>

        <h3 className="dashboard-subsection-title">More Tools</h3>
        <div className="card-grid card-grid-full">
          {FEATURE_CARDS_FULL.map((card) => (
            <FeatureCard
              key={card.id}
              title={card.title}
              subtitle={card.subtitle}
              imageSrc={card.image}
              onClick={() => handleCardClick(card.id)}
              fullWidth
              glowColor={card.color}
            />
          ))}
        </div>
      </section>

      <footer className="dashboard-footer">
        <button type="button" className="logout-btn" onClick={() => logout()}>
          <LogOut size={18} /> Sign Out
        </button>
      </footer>
    </div>
  );
}
