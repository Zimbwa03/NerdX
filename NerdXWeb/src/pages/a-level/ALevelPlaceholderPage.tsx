import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';

type Props = {
  title: string;
  fallbackPath?: string;
};

export function ALevelPlaceholderPage({ title, fallbackPath }: Props) {
  return (
    <div className="subject-page-v2">
      <header className="subject-header-v2">
        <Link to="/app" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #8B5CF6, #2563EB)' }}>
            <Sparkles size={28} />
          </div>
          <div>
            <h1>{title}</h1>
            <p>A-Level web flow is still being ported</p>
          </div>
        </div>
      </header>

      <div className="subject-content-grid">
        <div className="subject-features-col">
          <section className="subject-section-v2">
            <h2>Status</h2>
            <div className="vl-card">
              This A-Level subject is not fully available on NerdXWeb yet. Use the NerdX mobile app for the complete A-Level experience.
            </div>
          </section>

          <section className="subject-section-v2">
            <h2>What you can do</h2>
            <div className="feature-cards-v2">
              <Link to="/app/agents" className="feature-card-v2" style={{ textDecoration: 'none' }}>
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #7C4DFF, #00E676)' }}>
                  <Sparkles size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>Use Agent Hub</h3>
                  <p>Practice and get help with step-by-step guidance</p>
                </div>
                <span className="feature-arrow">&rarr;</span>
              </Link>

              {fallbackPath ? (
                <Link to={fallbackPath} className="feature-card-v2" style={{ textDecoration: 'none' }}>
                  <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #14B8A6, #0D9488)' }}>
                    <Sparkles size={24} />
                  </div>
                  <div className="feature-card-text">
                    <h3>Open O-Level Content</h3>
                    <p>Use the closest available subject content on web</p>
                  </div>
                  <span className="feature-arrow">&rarr;</span>
                </Link>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

