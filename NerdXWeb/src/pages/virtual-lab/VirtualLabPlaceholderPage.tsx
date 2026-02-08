import { Link, useParams } from 'react-router-dom';
import { Atom, Lock, Sparkles } from 'lucide-react';

export function VirtualLabPlaceholderPage() {
  const { labId } = useParams<{ labId: string }>();

  return (
    <div className="virtual-lab-placeholder-page">
      <header className="virtual-lab-placeholder-header">
        <Link to="/app/virtual-lab" className="back-link">
          <span aria-hidden="true">&larr;</span> Back to Virtual Lab
        </Link>
        <h1>Virtual Lab</h1>
        <p className="virtual-lab-placeholder-subtitle">{labId ? `Lab: ${labId}` : 'Lab'}</p>
      </header>

      <div className="virtual-lab-placeholder-card">
        <div className="virtual-lab-placeholder-icon">
          <Atom size={32} />
        </div>
        <h2>This lab is being ported to web</h2>
        <p>
          The route exists so your flows are stable, but the interactive simulation UI is still under construction.
          Batch 2 will implement every Virtual Lab screen from the mobile app.
        </p>

        <div className="virtual-lab-placeholder-actions">
          <Link to="/app/virtual-lab" className="virtual-lab-btn secondary">
            <Lock size={16} /> Browse labs
          </Link>
          <Link to="/app/agents" className="virtual-lab-btn primary">
            <Sparkles size={16} /> Practice with agents
          </Link>
        </div>
      </div>
    </div>
  );
}

