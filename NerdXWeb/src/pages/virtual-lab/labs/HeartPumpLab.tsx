import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowLeft, HeartPulse, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

type HeartPartId =
  | 'right-atrium'
  | 'right-ventricle'
  | 'left-atrium'
  | 'left-ventricle'
  | 'aorta'
  | 'pulmonary-artery';

type HeartPart = {
  id: HeartPartId;
  name: string;
  description: string;
  color: string;
};

const HEART_PARTS: HeartPart[] = [
  {
    id: 'right-atrium',
    name: 'Right Atrium',
    description: 'Receives deoxygenated blood from the body via the vena cava.',
    color: '#1565C0',
  },
  {
    id: 'right-ventricle',
    name: 'Right Ventricle',
    description: 'Pumps deoxygenated blood to the lungs via the pulmonary artery.',
    color: '#1976D2',
  },
  {
    id: 'left-atrium',
    name: 'Left Atrium',
    description: 'Receives oxygenated blood from the lungs via the pulmonary vein.',
    color: '#C62828',
  },
  {
    id: 'left-ventricle',
    name: 'Left Ventricle',
    description: 'Pumps oxygenated blood to the body via the aorta. Has the thickest wall.',
    color: '#D32F2F',
  },
  {
    id: 'aorta',
    name: 'Aorta',
    description: 'Carries oxygenated blood from the left ventricle to the body.',
    color: '#F44336',
  },
  {
    id: 'pulmonary-artery',
    name: 'Pulmonary Artery',
    description: 'Carries deoxygenated blood from the right ventricle to the lungs.',
    color: '#2196F3',
  },
];

export function HeartPumpLab({ simulation }: { simulation: SimulationMetadata }) {
  const [heartRate, setHeartRate] = useState(72);
  const [selectedPart, setSelectedPart] = useState<HeartPartId | null>(null);
  const [identified, setIdentified] = useState<Set<HeartPartId>>(() => new Set());
  const [quizOpen, setQuizOpen] = useState(false);

  const selected = useMemo(() => (selectedPart ? HEART_PARTS.find((p) => p.id === selectedPart) ?? null : null), [selectedPart]);
  const canTakeQuiz = identified.size >= 4;

  const clickPart = (id: HeartPartId) => {
    setSelectedPart(id);
    setIdentified((prev) => new Set([...prev, id]));
  };

  return (
    <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #F44336, #C62828)' }}>
            <HeartPulse size={28} />
          </div>
          <div>
            <h1>{simulation.title}</h1>
            <p>{simulation.topic}</p>
          </div>
        </div>
      </header>

      <div className="vl-editor-grid wide">
        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Heart Rate</div>
            <div className="vl-card-subtitle">Adjust BPM and identify parts by clicking the diagram.</div>

            <div className="vl-controls" style={{ marginTop: 12 }}>
              <div>
                <div className="vl-control-head">
                  <span className="vl-control-label">Heart rate</span>
                  <span className="vl-control-value">{heartRate} BPM</span>
                </div>
                <input
                  className="vl-range"
                  type="range"
                  min={40}
                  max={180}
                  step={1}
                  value={heartRate}
                  onChange={(e) => setHeartRate(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="vl-canvas-wrap">
              <svg className="vl-sim-svg" viewBox="0 0 520 360" role="img" aria-label="Heart diagram">
                {/* Vessels */}
                <path d="M 280 40 C 300 20 340 20 360 40" stroke="#F44336" strokeWidth="10" fill="none" />
                <path d="M 240 40 C 220 20 180 20 160 40" stroke="#2196F3" strokeWidth="10" fill="none" />

                {/* Aorta */}
                <path
                  d="M 310 40 C 330 60 330 90 310 120"
                  stroke={selectedPart === 'aorta' ? '#00E676' : '#F44336'}
                  strokeWidth={selectedPart === 'aorta' ? 14 : 10}
                  fill="none"
                  onClick={() => clickPart('aorta')}
                  className="vl-clickable"
                />
                <text x="340" y="110" fill="rgba(255,255,255,0.82)" fontSize="12" fontWeight="800">
                  Aorta
                </text>

                {/* Pulmonary artery */}
                <path
                  d="M 210 40 C 190 60 190 90 210 120"
                  stroke={selectedPart === 'pulmonary-artery' ? '#00E676' : '#2196F3'}
                  strokeWidth={selectedPart === 'pulmonary-artery' ? 14 : 10}
                  fill="none"
                  onClick={() => clickPart('pulmonary-artery')}
                  className="vl-clickable"
                />
                <text x="92" y="110" fill="rgba(255,255,255,0.82)" fontSize="12" fontWeight="800">
                  Pulm. art.
                </text>

                {/* Chambers */}
                <g>
                  <rect
                    x="140"
                    y="120"
                    width="150"
                    height="90"
                    rx="22"
                    fill="#1565C0"
                    opacity="0.85"
                    stroke={selectedPart === 'right-atrium' ? '#00E676' : 'rgba(255,255,255,0.25)'}
                    strokeWidth={selectedPart === 'right-atrium' ? 5 : 2}
                    onClick={() => clickPart('right-atrium')}
                    className="vl-clickable"
                  />
                  <text x="215" y="170" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="900">
                    Right Atrium
                  </text>

                  <rect
                    x="140"
                    y="220"
                    width="150"
                    height="110"
                    rx="26"
                    fill="#1976D2"
                    opacity="0.85"
                    stroke={selectedPart === 'right-ventricle' ? '#00E676' : 'rgba(255,255,255,0.25)'}
                    strokeWidth={selectedPart === 'right-ventricle' ? 5 : 2}
                    onClick={() => clickPart('right-ventricle')}
                    className="vl-clickable"
                  />
                  <text x="215" y="285" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="900">
                    Right Ventricle
                  </text>

                  <rect
                    x="230"
                    y="120"
                    width="150"
                    height="90"
                    rx="22"
                    fill="#C62828"
                    opacity="0.85"
                    stroke={selectedPart === 'left-atrium' ? '#00E676' : 'rgba(255,255,255,0.25)'}
                    strokeWidth={selectedPart === 'left-atrium' ? 5 : 2}
                    onClick={() => clickPart('left-atrium')}
                    className="vl-clickable"
                  />
                  <text x="305" y="170" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="900">
                    Left Atrium
                  </text>

                  <rect
                    x="230"
                    y="220"
                    width="150"
                    height="110"
                    rx="26"
                    fill="#D32F2F"
                    opacity="0.85"
                    stroke={selectedPart === 'left-ventricle' ? '#00E676' : 'rgba(255,255,255,0.25)'}
                    strokeWidth={selectedPart === 'left-ventricle' ? 5 : 2}
                    onClick={() => clickPart('left-ventricle')}
                    className="vl-clickable"
                  />
                  <text x="305" y="285" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="900">
                    Left Ventricle
                  </text>
                </g>
              </svg>
            </div>

            <div className="vl-explanation" style={{ marginTop: 12 }}>
              Parts identified: <strong>{identified.size}</strong> / {HEART_PARTS.length}
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Selected Part</div>
            {selected ? (
              <div className="vl-explanation ok" style={{ marginTop: 10 }}>
                <strong>{selected.name}:</strong> {selected.description}
              </div>
            ) : (
              <div className="vl-card-subtitle">Click a chamber or vessel in the diagram to view details.</div>
            )}
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Parts List</div>
            <div className="vl-card-subtitle">You can also click items below.</div>
            <div className="vl-template-list">
              {HEART_PARTS.map((p) => (
                <button key={p.id} type="button" className={`vl-template-btn ${selectedPart === p.id ? 'active' : ''}`} onClick={() => clickPart(p.id)}>
                  <div className="vl-template-title">
                    <span className="vl-dot" style={{ background: p.color }} aria-hidden="true" />
                    {p.name}
                    {identified.has(p.id) && <span className="vl-pill-mini">identified</span>}
                  </div>
                  <div className="vl-template-desc">{p.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Unlock Knowledge Check</div>
            <div className="vl-card-subtitle">Identify at least 4 parts. Progress: {Math.min(identified.size, 4)} / 4.</div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
              <Sparkles size={16} /> {canTakeQuiz ? 'Start knowledge check' : 'Keep exploring'}
            </button>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Tip</div>
            <div className="vl-card-subtitle">
              <div className="vl-row" style={{ gap: 10 }}>
                <Activity size={18} /> Right side: deoxygenated blood to lungs. Left side: oxygenated blood to body.
              </div>
            </div>
          </div>
        </div>
      </div>

      <KnowledgeCheckModal open={quizOpen} simulation={simulation} onClose={() => setQuizOpen(false)} />
    </div>
  );
}

