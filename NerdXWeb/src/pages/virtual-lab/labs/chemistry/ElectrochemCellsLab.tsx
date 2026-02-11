import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function ElectrochemCellsLab({ simulation }: { simulation: SimulationMetadata }) {
    const [metalA, setMetalA] = useState(8); // reactivity
    const [metalB, setMetalB] = useState(3);
    const [electrolyteStr, setElectrolyteStr] = useState(3);
    const [quizOpen, setQuizOpen] = useState(false);
    const [tick, setTick] = useState(0);
    useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 80); return () => clearInterval(id); }, []);

    const voltage = useMemo(() => Math.round(((metalA - metalB) / 5 + electrolyteStr / 2) * 100) / 100, [metalA, metalB, electrolyteStr]);
    const electronFlow = metalA > metalB;
    const METAL_NAMES: Record<number, string> = { 1: 'Cu', 2: 'Sn', 3: 'Fe', 4: 'Fe', 5: 'Zn', 6: 'Al', 7: 'Mg', 8: 'Mg', 9: 'Na', 10: 'K' };

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (voltage >= 2) n.add('high-v');
        if (voltage > 0 && voltage <= 1) n.add('low-v');
        if (electrolyteStr >= 4) n.add('strong-electrolyte');
        setCompleted(n);
    }, [voltage, electrolyteStr]);

    const progress = Math.round((completed.size / 3) * 100);
    const canTakeQuiz = completed.size >= 3;

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #FF9800, #E65100)' }}><span style={{ fontSize: 24 }}>🔋</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Electrochemical Cell</div>
                        <div className="vl-card-subtitle">
                            Cell voltage: <strong style={{ color: voltage > 0 ? '#4CAF50' : '#FF5252' }}>{voltage} V</strong>
                            {voltage <= 0 && ' — Wrong way / no potential difference'}
                        </div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 260" role="img" aria-label="Electrochemical cell">
                                {/* Two beakers */}
                                <rect x="30" y="100" width="100" height="100" rx="6" fill="#263238" opacity="0.12" stroke="#546E7A" strokeWidth="1.5" />
                                <rect x="170" y="100" width="100" height="100" rx="6" fill="#263238" opacity="0.12" stroke="#546E7A" strokeWidth="1.5" />

                                {/* Solutions */}
                                <rect x="32" y="130" width="96" height="68" rx="4" fill="#42A5F5" opacity="0.15" />
                                <rect x="172" y="130" width="96" height="68" rx="4" fill="#FF9800" opacity="0.15" />

                                {/* Metal electrodes */}
                                <rect x="65" y="80" width="16" height="90" rx="3" fill="#78909C" opacity="0.6" stroke="#B0BEC5" strokeWidth="1.5" />
                                <text x="73" y="75" textAnchor="middle" fill="#42A5F5" fontSize="10" fontWeight="bold">{METAL_NAMES[metalA] || 'A'}</text>
                                <text x="73" y="215" textAnchor="middle" fill="#90A4AE" fontSize="8">Anode (−)</text>

                                <rect x="210" y="80" width="16" height="90" rx="3" fill="#FF9800" opacity="0.6" stroke="#FFB74D" strokeWidth="1.5" />
                                <text x="218" y="75" textAnchor="middle" fill="#FF9800" fontSize="10" fontWeight="bold">{METAL_NAMES[metalB] || 'B'}</text>
                                <text x="218" y="215" textAnchor="middle" fill="#90A4AE" fontSize="8">Cathode (+)</text>

                                {/* Wire connecting them */}
                                <line x1="73" y1="80" x2="73" y2="50" stroke="#B0BEC5" strokeWidth="2" />
                                <line x1="73" y1="50" x2="218" y2="50" stroke="#B0BEC5" strokeWidth="2" />
                                <line x1="218" y1="50" x2="218" y2="80" stroke="#B0BEC5" strokeWidth="2" />

                                {/* Voltmeter */}
                                <circle cx="150" cy="45" r="15" fill="#263238" opacity="0.3" stroke="#FFD600" strokeWidth="1.5" />
                                <text x="150" y="49" textAnchor="middle" fill="#FFD600" fontSize="9" fontWeight="bold">{voltage}V</text>

                                {/* Electron flow arrows */}
                                {electronFlow && voltage > 0 && Array.from({ length: 4 }).map((_, i) => {
                                    const phase = (tick * 0.01 + i * 0.25) % 1;
                                    const x = 73 + phase * 145;
                                    return <circle key={i} cx={x} cy="50" r="3" fill="#FFD600" opacity={0.7} />;
                                })}
                                {electronFlow && voltage > 0 && <text x="150" y="38" textAnchor="middle" fill="#FFD600" fontSize="7">e⁻ flow →</text>}

                                {/* Salt bridge */}
                                <rect x="128" y="120" width="44" height="10" rx="5" fill="#78909C" opacity="0.4" />
                                <text x="150" y="117" textAnchor="middle" fill="#78909C" fontSize="7">Salt bridge</text>

                                {/* Labels */}
                                <text x="80" y="240" textAnchor="middle" fill="#42A5F5" fontSize="9">Oxidation (loses e⁻)</text>
                                <text x="220" y="240" textAnchor="middle" fill="#FF9800" fontSize="9">Reduction (gains e⁻)</text>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">Metal A reactivity: {metalA}
                            <input type="range" min={1} max={10} value={metalA} onChange={e => setMetalA(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Metal B reactivity: {metalB}
                            <input type="range" min={1} max={10} value={metalB} onChange={e => setMetalB(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Electrolyte strength: {electrolyteStr}×
                            <input type="range" min={1} max={5} value={electrolyteStr} onChange={e => setElectrolyteStr(+e.target.value)} className="vl-range" />
                        </label>
                        <div className="vl-explanation" style={{ fontSize: 11, marginTop: 8 }}>
                            The greater the difference in reactivity, the higher the voltage. The more reactive metal is the anode (oxidised).
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'high-v', text: 'Produce voltage ≥ 2.0 V' },
                                { id: 'low-v', text: 'Produce voltage between 0–1 V' },
                                { id: 'strong-electrolyte', text: 'Use strong electrolyte (≥ 4)' },
                            ].map(t => (
                                <button key={t.id} type="button" className={`vl-check ${completed.has(t.id) ? 'done' : ''}`} onClick={() => { }}>
                                    <span className="vl-check-dot" /><span className="vl-check-text">{t.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="vl-card">
                        <div className="vl-card-title">Learning Objectives</div>
                        <ul className="vl-bullets">{simulation.learningObjectives.map(o => <li key={o.id}>{o.text}</li>)}</ul>
                    </div>
                    <div className="vl-card">
                        <button type="button" className="vl-btn primary" disabled={!canTakeQuiz} onClick={() => setQuizOpen(true)}>
                            <Sparkles size={16} /> Start knowledge check
                        </button>
                    </div>
                </div>
            </div>
            <KnowledgeCheckModal open={quizOpen} simulation={simulation} onClose={() => setQuizOpen(false)} />
        </div>
    );
}
