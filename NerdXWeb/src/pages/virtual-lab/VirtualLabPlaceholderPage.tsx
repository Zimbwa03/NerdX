import { Link, useParams } from 'react-router-dom';
import { Atom, Lock, Sparkles } from 'lucide-react';
import { labAccentIconStyle, VIRTUAL_LAB_HUB_HEADER_ICON } from './virtualLabTheme';

export function VirtualLabPlaceholderPage() {
  const { labId } = useParams<{ labId: string }>();

  return (
    <div className="subject-page-v2 virtual-lab-page virtual-lab-placeholder-page">
      <header className="subject-header-v2 virtual-lab-header">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <span aria-hidden="true">&larr;</span>
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={VIRTUAL_LAB_HUB_HEADER_ICON}>
            <Atom size={28} strokeWidth={1.75} />
          </div>
          <div>
            <h1>Virtual Lab</h1>
            <p>{labId ? `Lab: ${labId}` : 'Simulation'}</p>
          </div>
        </div>
      </header>

      <div className="virtual-lab-placeholder-card">
        <div className="virtual-lab-placeholder-icon" style={labAccentIconStyle('#22d3ee')}>
          <Atom size={32} strokeWidth={1.75} />
        </div>
        <h2>This lab is being ported to the web</h2>
        <p>
          The route exists so your flows stay stable, but the interactive simulation UI is still under construction.
          Batch 2 will implement every Virtual Lab screen from the mobile app.
        </p>

        <div className="virtual-lab-placeholder-actions">
          <Link to="/app/virtual-lab" className="virtual-lab-btn secondary">
            <Lock size={16} strokeWidth={1.75} /> Browse labs
          </Link>
          <Link to="/app/agents" className="virtual-lab-btn primary">
            <Sparkles size={16} strokeWidth={1.75} /> Practice with agents
          </Link>
        </div>
      </div>
    </div>
  );
}

