import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, Grid3X3, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

const SUBDIV = 10;
const TARGET_E_TENTHS = 5;
const TARGET_N_TENTHS = 7;
const CORRECT_6_FIG = '255257';

export function SixFigureGridLab({ simulation }: { simulation: SimulationMetadata }) {
  const [selectedRef, setSelectedRef] = useState<string | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);

  const options = useMemo(
    () => [
      { value: '255257', label: '255 257' },
      { value: '254257', label: '254 257' },
      { value: '255256', label: '255 256' },
      { value: '256257', label: '256 257' },
    ],
    []
  );

  const canTakeQuiz = selectedRef !== null;

  return (
    <div className="subject-page-v2 virtual-lab-sim-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #2E7D32, #1B5E20)' }}>
            <Grid3X3 size={28} />
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
            <div className="vl-card-title">How 6-Figure References Work</div>
            <div className="vl-card-subtitle">
              Each grid square is divided into 10 parts along eastings and 10 along northings. The 3rd digit gives the tenths.
              Example: 253 372 means easting 25.3, northing 37.2.
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Practice</div>
            <div className="vl-card-subtitle">The building lies in grid square 25. What is its 6-figure grid reference?</div>

            <div className="vl-canvas-wrap">
              <div
                style={{
                  width: 260,
                  maxWidth: '100%',
                  borderRadius: 14,
                  border: '2px solid rgba(255,255,255,0.12)',
                  overflow: 'hidden',
                  background: 'rgba(10,14,33,0.22)',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SUBDIV}, 1fr)` }}>
                  {Array.from({ length: SUBDIV * SUBDIV }, (_, idx) => {
                    const ex = idx % SUBDIV;
                    const ny = Math.floor(idx / SUBDIV);
                    const isChurch = ex === TARGET_E_TENTHS && ny === TARGET_N_TENTHS;
                    return (
                      <div
                        key={`cell-${idx}`}
                        style={{
                          aspectRatio: '1 / 1',
                          borderRight: ex === SUBDIV - 1 ? 'none' : '1px solid rgba(255,255,255,0.10)',
                          borderBottom: ny === SUBDIV - 1 ? 'none' : '1px solid rgba(255,255,255,0.10)',
                          display: 'grid',
                          placeItems: 'center',
                          background: isChurch ? 'rgba(0,230,118,0.14)' : 'transparent',
                        }}
                      >
                        {isChurch ? <Building2 size={14} color="#00E676" /> : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="vl-row" style={{ justifyContent: 'flex-start' }}>
              {options.map((opt) => {
                const show = selectedRef !== null;
                const selected = selectedRef === opt.value;
                const correct = opt.value === CORRECT_6_FIG;
                const bg = !show ? 'rgba(255,255,255,0.06)' : selected ? (correct ? 'rgba(0,230,118,0.22)' : 'rgba(255,23,68,0.18)') : 'rgba(255,255,255,0.06)';
                const border = !show ? 'rgba(255,255,255,0.1)' : selected ? (correct ? 'rgba(0,230,118,0.35)' : 'rgba(255,23,68,0.35)') : 'rgba(255,255,255,0.1)';
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className="vl-btn"
                    style={{ background: bg, borderColor: border }}
                    onClick={() => setSelectedRef(opt.value)}
                    disabled={selectedRef !== null}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {selectedRef !== null && (
              <div className={`vl-check-result ${selectedRef === CORRECT_6_FIG ? 'pass' : 'fail'}`}>
                {selectedRef === CORRECT_6_FIG ? (
                  <span>Correct: 255 257 (easting tenths first, then northing tenths).</span>
                ) : (
                  <span>Not quite. The building is at 255 257. Remember: eastings first, then northings.</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Unlock Knowledge Check</div>
            <div className="vl-card-subtitle">Answer the practice question.</div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
              <Sparkles size={16} /> {canTakeQuiz ? 'Start knowledge check' : 'Select an answer'}
            </button>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Learning Objectives</div>
            <ul className="vl-bullets">
              {simulation.learningObjectives.map((o) => (
                <li key={o.id}>{o.text}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <KnowledgeCheckModal open={quizOpen} simulation={simulation} onClose={() => setQuizOpen(false)} />
    </div>
  );
}

