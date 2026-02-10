import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CircuitBoard, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

type CircuitType = 'series' | 'parallel';

export function CircuitBuilderLab({ simulation }: { simulation: SimulationMetadata }) {
  const [circuitType, setCircuitType] = useState<CircuitType>('series');
  const [cellVoltage, setCellVoltage] = useState(6);
  const [resistance1, setResistance1] = useState(3);
  const [resistance2, setResistance2] = useState(6);
  const [switchOn, setSwitchOn] = useState(true);
  const [experimentsComplete, setExperimentsComplete] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);

  const circuit = useMemo(() => {
    if (!switchOn) {
      return { totalResistance: 0, current: 0, voltage1: 0, voltage2: 0 };
    }
    let totalResistance: number;
    let current: number;
    let voltage1: number;
    let voltage2: number;

    if (circuitType === 'series') {
      totalResistance = resistance1 + resistance2;
      current = cellVoltage / totalResistance;
      voltage1 = current * resistance1;
      voltage2 = current * resistance2;
    } else {
      totalResistance = (resistance1 * resistance2) / (resistance1 + resistance2);
      current = cellVoltage / totalResistance;
      voltage1 = cellVoltage;
      voltage2 = cellVoltage;
    }

    return {
      totalResistance: Math.round(totalResistance * 100) / 100,
      current: Math.round(current * 100) / 100,
      voltage1: Math.round(voltage1 * 100) / 100,
      voltage2: Math.round(voltage2 * 100) / 100,
    };
  }, [cellVoltage, circuitType, resistance1, resistance2, switchOn]);

  const canTakeQuiz = experimentsComplete >= 2;

  const wireColor = switchOn ? '#FFD700' : 'rgba(255,255,255,0.25)';
  const bulbGlow = switchOn ? Math.min(1, circuit.current / 3) : 0;

  return (
    <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #FFD93D, #FF6B6B)' }}>
            <CircuitBoard size={28} />
          </div>
          <div>
            <h1>{simulation.title}</h1>
            <p>{simulation.topic}</p>
          </div>
        </div>
      </header>

      <div className="vl-editor-grid">
        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Circuit controls</div>
            <div className="vl-card-subtitle">Switch between series and parallel, then adjust values.</div>

            <div className="vl-row">
              <div className="vl-tab-row" role="tablist" aria-label="Circuit type">
                {(['series', 'parallel'] as CircuitType[]).map((t) => (
                  <button key={t} type="button" className={`vl-tab ${circuitType === t ? 'active' : ''}`} onClick={() => setCircuitType(t)}>
                    {t}
                  </button>
                ))}
              </div>
              <button type="button" className="vl-btn secondary" onClick={() => setSwitchOn((v) => !v)}>
                Switch: {switchOn ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="vl-editor-row">
              <div className="vl-editor-label">Cell voltage: {cellVoltage}V</div>
              <input className="vl-range" type="range" min={1} max={12} step={1} value={cellVoltage} onChange={(e) => setCellVoltage(Number(e.target.value))} />
            </div>

            <div className="vl-editor-row">
              <div className="vl-editor-label">Resistance R1: {resistance1}&Omega;</div>
              <input className="vl-range" type="range" min={1} max={12} step={1} value={resistance1} onChange={(e) => setResistance1(Number(e.target.value))} />
            </div>

            <div className="vl-editor-row">
              <div className="vl-editor-label">Resistance R2: {resistance2}&Omega;</div>
              <input className="vl-range" type="range" min={1} max={12} step={1} value={resistance2} onChange={(e) => setResistance2(Number(e.target.value))} />
            </div>

            <div className="vl-row">
              <button type="button" className="vl-btn secondary" onClick={() => setExperimentsComplete((v) => Math.min(4, v + 1))}>
                Record experiment ({experimentsComplete}/4)
              </button>
              <button type="button" className="vl-btn primary" disabled={!canTakeQuiz} onClick={() => setQuizOpen(true)}>
                <Sparkles size={16} /> {canTakeQuiz ? 'Knowledge check' : 'Record 2 experiments'}
              </button>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Calculated values</div>
            <div className="vl-stats-grid">
              <div className="vl-stat">
                <div className="vl-stat-label">Total R</div>
                <div className="vl-stat-value">{circuit.totalResistance || 0}&Omega;</div>
              </div>
              <div className="vl-stat">
                <div className="vl-stat-label">Current</div>
                <div className="vl-stat-value">{circuit.current || 0}A</div>
              </div>
              <div className="vl-stat">
                <div className="vl-stat-label">V across R1</div>
                <div className="vl-stat-value">{circuit.voltage1 || 0}V</div>
              </div>
              <div className="vl-stat">
                <div className="vl-stat-label">V across R2</div>
                <div className="vl-stat-value">{circuit.voltage2 || 0}V</div>
              </div>
            </div>
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Circuit diagram</div>
            <div className="vl-canvas-wrap">
              <svg className="vl-sim-svg" viewBox="0 0 320 260" role="img" aria-label="Circuit diagram">
                {circuitType === 'series' ? (
                  <>
                    <line x1="60" y1="70" x2="260" y2="70" stroke={wireColor} strokeWidth="4" />
                    <line x1="60" y1="70" x2="60" y2="190" stroke={wireColor} strokeWidth="4" />
                    <line x1="60" y1="190" x2="260" y2="190" stroke={wireColor} strokeWidth="4" />
                    <line x1="260" y1="70" x2="260" y2="190" stroke={wireColor} strokeWidth="4" />

                    {/* cell */}
                    <g>
                      <rect x="150" y="52" width="40" height="36" rx="6" fill="rgba(255,255,255,0.06)" />
                      <line x1="162" y1="60" x2="162" y2="80" stroke="#F44336" strokeWidth="4" />
                      <line x1="178" y1="56" x2="178" y2="84" stroke="#F44336" strokeWidth="2" />
                      <text x="170" y="44" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.7)">
                        {cellVoltage}V
                      </text>
                    </g>

                    {/* switch */}
                    <g className="vl-clickable" onClick={() => setSwitchOn((v) => !v)}>
                      <circle cx="80" cy="130" r="9" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                      {switchOn ? (
                        <line x1="80" y1="121" x2="80" y2="139" stroke="#00E676" strokeWidth="3" />
                      ) : (
                        <line x1="80" y1="121" x2="96" y2="130" stroke="#FF1744" strokeWidth="3" />
                      )}
                      <text x="80" y="156" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.65)">
                        {switchOn ? 'ON' : 'OFF'}
                      </text>
                    </g>

                    {/* resistors */}
                    <path d="M 110 190 l 10 -10 l 10 20 l 10 -20 l 10 20 l 10 -10" stroke="#FF9800" strokeWidth="3" fill="none" />
                    <text x="140" y="222" textAnchor="middle" fontSize="11" fill="#FF9800">
                      R1: {resistance1}&Omega;
                    </text>

                    <path d="M 190 190 l 10 -10 l 10 20 l 10 -20 l 10 20 l 10 -10" stroke="#FF9800" strokeWidth="3" fill="none" />
                    <text x="220" y="222" textAnchor="middle" fontSize="11" fill="#FF9800">
                      R2: {resistance2}&Omega;
                    </text>

                    {/* bulb */}
                    <circle cx="260" cy="130" r="16" fill={switchOn ? `rgba(255, 235, 59, ${bulbGlow})` : 'rgba(255,255,255,0.2)'} stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
                  </>
                ) : (
                  <>
                    <line x1="60" y1="70" x2="260" y2="70" stroke={wireColor} strokeWidth="4" />
                    <line x1="60" y1="210" x2="260" y2="210" stroke={wireColor} strokeWidth="4" />
                    <line x1="60" y1="70" x2="60" y2="210" stroke={wireColor} strokeWidth="4" />
                    <line x1="260" y1="70" x2="260" y2="210" stroke={wireColor} strokeWidth="4" />

                    {/* branches */}
                    <line x1="100" y1="70" x2="100" y2="210" stroke={wireColor} strokeWidth="4" />
                    <line x1="220" y1="70" x2="220" y2="210" stroke={wireColor} strokeWidth="4" />

                    {/* cell */}
                    <g>
                      <rect x="150" y="52" width="40" height="36" rx="6" fill="rgba(255,255,255,0.06)" />
                      <line x1="162" y1="60" x2="162" y2="80" stroke="#F44336" strokeWidth="4" />
                      <line x1="178" y1="56" x2="178" y2="84" stroke="#F44336" strokeWidth="2" />
                      <text x="170" y="44" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.7)">
                        {cellVoltage}V
                      </text>
                    </g>

                    {/* switch */}
                    <g className="vl-clickable" onClick={() => setSwitchOn((v) => !v)}>
                      <circle cx="80" cy="140" r="9" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                      {switchOn ? (
                        <line x1="80" y1="131" x2="80" y2="149" stroke="#00E676" strokeWidth="3" />
                      ) : (
                        <line x1="80" y1="131" x2="96" y2="140" stroke="#FF1744" strokeWidth="3" />
                      )}
                    </g>

                    {/* resistors */}
                    <path d="M 112 120 l 10 -10 l 10 20 l 10 -20 l 10 20 l 10 -10" stroke="#FF9800" strokeWidth="3" fill="none" />
                    <text x="142" y="154" textAnchor="middle" fontSize="11" fill="#FF9800">
                      R1: {resistance1}&Omega;
                    </text>

                    <path d="M 192 120 l 10 -10 l 10 20 l 10 -20 l 10 20 l 10 -10" stroke="#FF9800" strokeWidth="3" fill="none" />
                    <text x="222" y="154" textAnchor="middle" fontSize="11" fill="#FF9800">
                      R2: {resistance2}&Omega;
                    </text>

                    {/* bulb */}
                    <circle cx="260" cy="140" r="16" fill={switchOn ? `rgba(255, 235, 59, ${bulbGlow})` : 'rgba(255,255,255,0.2)'} stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
                  </>
                )}
              </svg>
            </div>
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

