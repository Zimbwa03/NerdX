import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function RedoxBasicsLab({ simulation }: { simulation: SimulationMetadata }) {
    const [electronTransfer, setElectronTransfer] = useState(2);
    const [reactionIdx, setReactionIdx] = useState(0);
    const [quizOpen, setQuizOpen] = useState(false);
    const [tick, setTick] = useState(0);
    useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 80); return () => clearInterval(id); }, []);

    const reactions = [
        { name: 'Magnesium + Oxygen', eq: '2Mg + O₂ → 2MgO', oxidised: 'Mg → Mg²⁺ + 2e⁻', reduced: 'O + 2e⁻ → O²⁻', oxAgent: 'O₂', redAgent: 'Mg' },
        { name: 'Zinc + CuSO₄', eq: 'Zn + CuSO₄ → ZnSO₄ + Cu', oxidised: 'Zn → Zn²⁺ + 2e⁻', reduced: 'Cu²⁺ + 2e⁻ → Cu', oxAgent: 'Cu²⁺', redAgent: 'Zn' },
        { name: 'Iron + Chlorine', eq: '2Fe + 3Cl₂ → 2FeCl₃', oxidised: 'Fe → Fe³⁺ + 3e⁻', reduced: 'Cl₂ + 2e⁻ → 2Cl⁻', oxAgent: 'Cl₂', redAgent: 'Fe' },
    ];
    const r = reactions[reactionIdx];

    const [visited, setVisited] = useState<Set<number>>(new Set());
    useEffect(() => {
        setVisited(prev => new Set(prev).add(reactionIdx));
    }, [reactionIdx]);

    const progress = Math.round((visited.size / reactions.length) * 100);
    const canTakeQuiz = visited.size >= 3;

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #FF9800, #E65100)' }}><span style={{ fontSize: 24 }}>⚡</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">{r.name}</div>
                        <div className="vl-card-subtitle" style={{ fontFamily: 'monospace', color: '#FFD600' }}>{r.eq}</div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 260" role="img" aria-label="Redox electron transfer">
                                {/* Reactant atoms */}
                                <circle cx="80" cy="100" r="30" fill="#42A5F5" opacity="0.3" stroke="#42A5F5" strokeWidth="2" />
                                <text x="80" y="105" textAnchor="middle" fill="#FFF" fontSize="14" fontWeight="bold">{r.redAgent}</text>
                                <text x="80" y="75" textAnchor="middle" fill="#42A5F5" fontSize="9">Reducing agent</text>
                                <text x="80" y="145" textAnchor="middle" fill="#42A5F5" fontSize="8">OXIDISED</text>
                                <text x="80" y="157" textAnchor="middle" fill="#42A5F5" fontSize="7">(loses electrons)</text>

                                <circle cx="220" cy="100" r="30" fill="#EF5350" opacity="0.3" stroke="#EF5350" strokeWidth="2" />
                                <text x="220" y="105" textAnchor="middle" fill="#FFF" fontSize="14" fontWeight="bold">{r.oxAgent}</text>
                                <text x="220" y="75" textAnchor="middle" fill="#EF5350" fontSize="9">Oxidising agent</text>
                                <text x="220" y="145" textAnchor="middle" fill="#EF5350" fontSize="8">REDUCED</text>
                                <text x="220" y="157" textAnchor="middle" fill="#EF5350" fontSize="7">(gains electrons)</text>

                                {/* Electron transfer arrows */}
                                {Array.from({ length: electronTransfer }).map((_, i) => {
                                    const phase = (tick * 0.012 + i * 0.3) % 1;
                                    const x = 110 + phase * 80;
                                    const y = 100 - 15 + i * 12;
                                    return (
                                        <g key={i}>
                                            <circle cx={x} cy={y} r="5" fill="#FFD600" opacity={0.8} />
                                            <text x={x} y={y + 3} textAnchor="middle" fill="#000" fontSize="6" fontWeight="bold">e⁻</text>
                                        </g>
                                    );
                                })}
                                <text x="150" y="85" textAnchor="middle" fill="#FFD600" fontSize="9" fontWeight="bold">→ {electronTransfer}e⁻ →</text>

                                {/* OIL RIG mnemonic */}
                                <rect x="30" y="180" width="240" height="60" rx="8" fill="#37474F" opacity="0.3" />
                                <text x="150" y="200" textAnchor="middle" fill="#FFD600" fontSize="12" fontWeight="bold">OIL RIG</text>
                                <text x="150" y="218" textAnchor="middle" fill="#42A5F5" fontSize="9">Oxidation Is Loss (of electrons)</text>
                                <text x="150" y="232" textAnchor="middle" fill="#EF5350" fontSize="9">Reduction Is Gain (of electrons)</text>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Half-equations</div>
                        <div className="vl-explanation" style={{ fontSize: 12, color: '#42A5F5' }}>Oxidation: {r.oxidised}</div>
                        <div className="vl-explanation" style={{ fontSize: 12, color: '#EF5350', marginTop: 4 }}>Reduction: {r.reduced}</div>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Select Reaction</div>
                        <div className="vl-template-list">
                            {reactions.map((rx, i) => (
                                <button key={i} type="button" className={`vl-template-btn ${reactionIdx === i ? 'active' : ''}`} onClick={() => setReactionIdx(i)}>
                                    <div className="vl-template-title">
                                        {rx.name}
                                        {visited.has(i) && <span className="vl-pill-mini" style={{ background: '#4CAF50' }}>✓</span>}
                                    </div>
                                    <div className="vl-template-desc">{rx.eq}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">Electrons transferred: {electronTransfer}
                            <input type="range" min={1} max={4} value={electronTransfer} onChange={e => setElectronTransfer(+e.target.value)} className="vl-range" />
                        </label>
                    </div>

                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Progress</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-card-subtitle">View all 3 reactions to unlock the quiz.</div>
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
