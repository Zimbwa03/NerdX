import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

interface Mixture { id: string; name: string; method: string; desc: string; color1: string; color2: string; }
const MIXTURES: Mixture[] = [
    { id: 'sand-water', name: 'Sand + Water', method: 'Filtration', desc: 'Sand is insoluble — it stays in the filter paper, water passes through.', color1: '#FFD54F', color2: '#42A5F5' },
    { id: 'salt-water', name: 'Salt + Water', method: 'Evaporation / Crystallisation', desc: 'Salt dissolves — evaporate water to get salt crystals.', color1: '#E0E0E0', color2: '#42A5F5' },
    { id: 'ethanol-water', name: 'Ethanol + Water', method: 'Fractional Distillation', desc: 'Both are liquids with different boiling points. Ethanol (78°C) boils first.', color1: '#FFAB91', color2: '#42A5F5' },
    { id: 'ink', name: 'Ink Pigments', method: 'Chromatography', desc: 'Different pigments travel at different rates through the paper.', color1: '#BA68C8', color2: '#4CAF50' },
    { id: 'oil-water', name: 'Oil + Water', method: 'Separating Funnel', desc: 'Immiscible liquids — oil floats on water. Drain water from tap.', color1: '#FFD600', color2: '#42A5F5' },
];

export function SeparationMixturesLab({ simulation }: { simulation: SimulationMetadata }) {
    const [selected, setSelected] = useState<Mixture>(MIXTURES[0]);
    const [running, setRunning] = useState(false);
    const [phase, setPhase] = useState(0);
    const [quizOpen, setQuizOpen] = useState(false);

    useEffect(() => {
        if (running && phase < 100) {
            const id = setInterval(() => setPhase(p => Math.min(p + 2, 100)), 50);
            return () => clearInterval(id);
        }
    }, [running, phase]);

    const [visited, setVisited] = useState<Set<string>>(new Set());
    const selectMix = (m: Mixture) => { setSelected(m); setVisited(prev => new Set(prev).add(m.id)); setRunning(false); setPhase(0); };
    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (phase >= 100) n.add(selected.id);
        if (visited.size >= 4) n.add('explored');
        if ([...completed].filter(c => MIXTURES.some(m => m.id === c)).length >= 3) n.add('three-done');
        setCompleted(n);
    }, [phase, visited, selected]);

    const progress = Math.round((Math.min(3, [...completed].filter(c => MIXTURES.some(m => m.id === c)).length) / 3) * 100);
    const canTakeQuiz = [...completed].filter(c => MIXTURES.some(m => m.id === c)).length >= 3;

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #FF9800, #E65100)' }}><span style={{ fontSize: 24 }}>🔬</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">{selected.name}</div>
                        <div className="vl-card-subtitle">Method: <strong style={{ color: '#FFD600' }}>{selected.method}</strong></div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 260" role="img" aria-label={`${selected.method} diagram`}>
                                {selected.id === 'sand-water' && (
                                    <g>
                                        {/* Funnel with filter paper */}
                                        <polygon points="100,60 200,60 180,160 120,160" fill="#E8E8E8" opacity="0.2" stroke="#B0BEC5" strokeWidth="1.5" />
                                        <line x1="100" y1="60" x2="200" y2="60" stroke="#B0BEC5" strokeWidth="2" />
                                        {/* Filter paper */}
                                        <polygon points="110,70 190,70 170,140 130,140" fill="#FFFDE7" opacity="0.4" stroke="#FFD54F" strokeWidth="1" />
                                        {/* Sand trapped */}
                                        <rect x="130" y={70 + (100 - phase) * 0.3} width="40" height={Math.min(30, phase * 0.3)} fill="#FFD54F" opacity="0.6" rx="3" />
                                        {/* Water dripping */}
                                        {phase > 20 && <line x1="150" y1="160" x2="150" y2={160 + Math.min(40, (phase - 20) * 0.5)} stroke="#42A5F5" strokeWidth="2" />}
                                        {/* Collecting beaker */}
                                        <rect x="120" y="200" width="60" height="40" rx="4" fill="#42A5F5" opacity={Math.min(0.3, phase * 0.003)} stroke="#546E7A" strokeWidth="1.5" />
                                        <text x="150" y="250" textAnchor="middle" fill="#42A5F5" fontSize="9">Filtrate (water)</text>
                                    </g>
                                )}
                                {selected.id === 'salt-water' && (
                                    <g>
                                        {/* Evaporating dish */}
                                        <ellipse cx="150" cy="150" rx="70" ry="20" fill="#263238" opacity="0.2" stroke="#546E7A" strokeWidth="1.5" />
                                        {/* Solution level */}
                                        <ellipse cx="150" cy="148" rx={70 - phase * 0.5} ry={18 - phase * 0.1} fill="#42A5F5" opacity={Math.max(0.05, 0.3 - phase * 0.003)} />
                                        {/* Heat source */}
                                        <rect x="110" y="175" width="80" height="10" rx="3" fill="#EF5350" opacity="0.4" />
                                        <text x="150" y="200" textAnchor="middle" fill="#EF5350" fontSize="8">🔥 Heat</text>
                                        {/* Crystals appearing */}
                                        {phase > 60 && Array.from({ length: Math.floor((phase - 60) / 8) }).map((_, i) => (
                                            <rect key={i} x={120 + (i % 5) * 12} y={142 + Math.floor(i / 5) * 6} width="5" height="5" fill="#E0E0E0" opacity="0.8" rx="1" />
                                        ))}
                                        {/* Steam */}
                                        {phase > 10 && Array.from({ length: 3 }).map((_, i) => (
                                            <text key={i} x={130 + i * 20} y={120 - (phase * 0.3)} fill="#B0BEC5" fontSize="12" opacity={0.3}>~</text>
                                        ))}
                                        <text x="150" y="240" textAnchor="middle" fill="#E0E0E0" fontSize="9">{phase >= 80 ? 'Salt crystals formed!' : 'Evaporating...'}</text>
                                    </g>
                                )}
                                {selected.id === 'ethanol-water' && (
                                    <g>
                                        {/* Round-bottom flask */}
                                        <circle cx="80" cy="160" r="35" fill="#FFAB91" opacity="0.15" stroke="#FFAB91" strokeWidth="1.5" />
                                        <rect x="72" y="120" width="16" height="40" fill="none" stroke="#FFAB91" strokeWidth="1.5" />
                                        {/* Condenser tube */}
                                        <line x1="88" y1="125" x2="220" y2="80" stroke="#B0BEC5" strokeWidth="3" />
                                        <rect x="120" y="75" width="60" height="15" rx="4" fill="#90CAF9" opacity="0.2" stroke="#90CAF9" strokeWidth="1" />
                                        <text x="150" y="73" fill="#90CAF9" fontSize="7">Cold water jacket</text>
                                        {/* Collection flask */}
                                        <rect x="220" y="80" width="40" height="50" rx="4" fill="#FFAB91" opacity={Math.min(0.3, phase * 0.003)} stroke="#546E7A" strokeWidth="1.5" />
                                        {/* Heat */}
                                        <text x="80" y="210" textAnchor="middle" fill="#EF5350" fontSize="8">🔥 Heat to 78°C</text>
                                        {/* Drip */}
                                        {phase > 30 && <circle cx="220" cy={80 + (phase % 20)} r="2" fill="#FFAB91" opacity="0.6" />}
                                        <text x="240" y="145" textAnchor="middle" fill="#FFAB91" fontSize="8">Ethanol collected</text>
                                    </g>
                                )}
                                {selected.id === 'ink' && (
                                    <g>
                                        {/* Chromatography paper */}
                                        <rect x="100" y="30" width="100" height="180" fill="#FFFDE7" opacity="0.3" stroke="#FFD600" strokeWidth="1.5" />
                                        {/* Baseline */}
                                        <line x1="105" y1="180" x2="195" y2="180" stroke="#78909C" strokeWidth="1" strokeDasharray="4,2" />
                                        <circle cx="150" cy="180" r="4" fill="#37474F" />
                                        <text x="210" y="183" fill="#78909C" fontSize="7">Ink spot</text>
                                        {/* Solvent front */}
                                        {phase > 0 && <line x1="105" y1={200 - phase * 1.5} x2="195" y2={200 - phase * 1.5} stroke="#42A5F5" strokeWidth="1" />}
                                        {/* Separated pigments */}
                                        {phase > 20 && <circle cx="140" cy={180 - Math.min(50, (phase - 20) * 0.8)} r="6" fill="#E91E63" opacity="0.6" />}
                                        {phase > 40 && <circle cx="155" cy={180 - Math.min(80, (phase - 40) * 1.0)} r="6" fill="#42A5F5" opacity="0.6" />}
                                        {phase > 60 && <circle cx="148" cy={180 - Math.min(110, (phase - 60) * 1.2)} r="6" fill="#FFD600" opacity="0.6" />}
                                        <text x="150" y="225" textAnchor="middle" fill="#78909C" fontSize="9">{phase >= 80 ? 'Pigments separated!' : 'Solvent rising...'}</text>
                                    </g>
                                )}
                                {selected.id === 'oil-water' && (
                                    <g>
                                        {/* Separating funnel */}
                                        <polygon points="120,50 180,50 165,180 135,180" fill="#263238" opacity="0.1" stroke="#546E7A" strokeWidth="1.5" />
                                        {/* Oil layer (top) */}
                                        <rect x="125" y={60} width="50" height="45" fill="#FFD600" opacity="0.3" rx="3" />
                                        <text x="150" y="85" textAnchor="middle" fill="#FFD600" fontSize="8">Oil</text>
                                        {/* Water layer (bottom) */}
                                        <rect x="130" y={110} width="40" height="55" fill="#42A5F5" opacity="0.25" rx="3" />
                                        <text x="150" y="140" textAnchor="middle" fill="#42A5F5" fontSize="8">Water</text>
                                        {/* Tap */}
                                        <rect x="143" y="175" width="14" height="10" fill="#78909C" opacity="0.5" rx="2" />
                                        {/* Drain */}
                                        {phase > 30 && <line x1="150" y1="185" x2="150" y2={185 + Math.min(40, (phase - 30) * 0.6)} stroke="#42A5F5" strokeWidth="2" />}
                                        <text x="150" y="240" textAnchor="middle" fill="#78909C" fontSize="9">{phase >= 80 ? 'Layers separated!' : 'Open tap to drain water...'}</text>
                                    </g>
                                )}
                            </svg>
                        </div>
                        <button type="button" className="vl-btn primary" style={{ marginTop: 8 }}
                            onClick={() => { if (phase >= 100) { setPhase(0); setRunning(false); } else { setRunning(true); } }}>
                            {phase >= 100 ? '🔄 Reset' : running ? '⏳ Separating...' : '▶ Start Separation'}
                        </button>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">How it works</div>
                        <div className="vl-explanation" style={{ fontSize: 12 }}>{selected.desc}</div>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Choose Mixture</div>
                        <div className="vl-template-list">
                            {MIXTURES.map(m => (
                                <button key={m.id} type="button" className={`vl-template-btn ${selected.id === m.id ? 'active' : ''}`} onClick={() => selectMix(m)}>
                                    <div className="vl-template-title">
                                        {m.name}
                                        <span className="vl-pill-mini" style={{ background: '#FF9800' }}>{m.method}</span>
                                        {completed.has(m.id) && <span className="vl-pill-mini" style={{ background: '#4CAF50' }}>✓</span>}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Progress</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-card-subtitle">Separate at least 3 mixtures</div>
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
