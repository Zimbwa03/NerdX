import { Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';

export function ProgressPage() {
  return (
    <div className="progress-page">
      <Link to="/app" className="back-link">
        <span>←</span> Back to Dashboard
      </Link>
      <div className="progress-card glass-card">
        <div className="progress-header">
          <BarChart3 size={48} className="progress-icon" />
          <h1>My Progress</h1>
        </div>
        <p className="progress-message">
          Track your learning journey on the NerdX mobile app. Science mastery, streaks, and badges are available there.
        </p>
        <Link to="/app" className="gradient-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
