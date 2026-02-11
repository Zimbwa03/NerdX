import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function ElectromagnetsLab({ simulation }: { simulation: SimulationMetadata }) {
    const [turns, setTurns] = useState(50);
    const [current, setCurrent] = useState(3);
    const [coreFactor, setCoreFactor] = useState(2);
    const [quizOpen, setQuizOpen] = useState(false);
    const [tick, setTick] = useState(0);
    useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 50); return () => clearInterval(id); }, []);

    const strength = useMemo(() => Math.round((turns / 10) * current * coreFactor), [turns, current, coreFactor]);
    const coreNames = ['Air', 'Plastic', 'Iron', 'Steel', 'Neodymium'];

    // Animated current flow dots
    const dotSpeed = current * 0.02;

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (strength >= 300) n.add('strong');
        if (strength <= 120) n.add('weak');
        if (coreFactor >= 4) n.add('core');
        if (turns >= 150) n.add('many-turns');
        setCompleted(n);
    }, [strength, coreFactor, turns]);

    const progress = Math.round((completed.size / 4) * 100);
    const canTakeQuiz = completed.size >= 3;

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #2196F3, #0D47A1)' }}><span style={{ fontSize: 24 }}>⚡</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Electromagnet</div>
                        <div className="vl-card-subtitle">
                            Strength = <strong style={{ color: '#FFD600' }}>{strength}</strong> units | Core: {coreNames[coreFactor - 1]}
                        </div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 220" role="img" aria-label="Electromagnet builder">
                                {/* Iron core */}
                                <rect x="100" y="80" width="100" height="40" rx="4"
                                    fill={coreFactor >= 3 ? '#78909C' : '#455A64'} opacity={0.3 + coreFactor * 0.12}
                                    stroke="#90A4AE" strokeWidth="1.5" />
                                <text x="150" y="102" textAnchor="middle" fill="#B0BEC5" fontSize="8">
                                    {coreNames[coreFactor - 1]} core
                                </text>

                                {/* Coil turns */}
                                {Array.from({ length: Math.min(15, Math.floor(turns / 15)) }).map((_, i) => {
                                    const x = 104 + i * (92 / Math.min(15, Math.floor(turns / 15)));
                                    return (
                                        <g key={i}>
                                            <ellipse cx={x} cy="75" rx="4" ry="8" fill="none" stroke="#FF9800" strokeWidth="2" opacity="0.7" />
                                            <ellipse cx={x} cy="125" rx="4" ry="8" fill="none" stroke="#FF9800" strokeWidth="2" opacity="0.7" />
                                        </g>
                                    );
                                })}

                                {/* Animated current dots */}
                                {current > 0 && Array.from({ length: 6 }).map((_, i) => {
                                    const phase = ((tick * dotSpeed + i * 0.15) % 1);
                                    const dotX = 100 + phase * 100;
                                    return (
                                        <g key={`d-${i}`}>
                                            <circle cx={dotX} cy="68" r="2.5" fill="#FFD600" opacity="0.8" />
                                            <circle cx={200 - (dotX - 100)} cy="132" r="2.5" fill="#FFD600" opacity="0.8" />
                                        </g>
                                    );
                                })}

                                {/* Battery */}
                                <rect x="40" y="85" width="30" height="30" rx="4" fill="#263238" stroke="#FFD600" strokeWidth="1.5" />
                                <text x="55" y="104" textAnchor="middle" fill="#FFD600" fontSize="10" fontWeight="bold">+−</text>
                                {/* Wires */}
                                <line x1="70" y1="93" x2="100" y2="80" stroke="#FF9800" strokeWidth="1.5" />
                                <line x1="70" y1="107" x2="100" y2="120" stroke="#FF9800" strokeWidth="1.5" />

                                {/* Field lines emanating from ends */}
                                {Array.from({ length: Math.min(5, Math.floor(strength / 60) + 1) }).map((_, i) => {
                                    const yOff = (i - 2) * 12;
                                    const ext = Math.min(40, strength / 8);
                                    const animOff = Math.sin(tick * 0.03 + i * 0.8) * 3;
                                    return (
                                        <g key={`fl-${i}`}>
                                            {/* Left (N) */}
                                            <line x1={100 - ext} y1={100 + yOff + animOff} x2={100} y2={100 + yOff}
                                                stroke="#42A5F5" strokeWidth="1.2" opacity="0.5" />
                                            {/* Right (S) */}
                                            <line x1={200} y1={100 + yOff} x2={200 + ext} y2={100 + yOff + animOff}
                                                stroke="#42A5F5" strokeWidth="1.2" opacity="0.5" />
                                        </g>
                                    );
                                })}

                                {/* Poles label */}
                                {strength > 0 && (
                                    <>
                                        <text x="90" y="105" textAnchor="middle" fill="#EF5350" fontSize="11" fontWeight="bold">N</text>
                                        <text x="210" y="105" textAnchor="middle" fill="#42A5F5" fontSize="11" fontWeight="bold">S</text>
                                    </>
                                )}

                                {/* Paperclips attracted */}
                                {strength >= 100 && Array.from({ length: Math.min(4, Math.floor(strength / 100)) }).map((_, i) => {
                                    const yp = 145 + i * 12;
                                    const jiggle = Math.sin(tick * 0.05 + i) * 2;
                                    return (
                                        <g key={`pc-${i}`}>
                                            <rect x={87 + jiggle} y={yp} width="8" height="3" rx="1" fill="#B0BEC5" />
                                            <rect x={208 - jiggle} y={yp} width="8" height="3" rx="1" fill="#B0BEC5" />
                                        </g>
                                    );
                                })}

                                {/* Strength bar */}
                                <rect x="40" y="190" width={Math.min(220, strength / 2)} height="12" rx="3" fill="#FFD600" opacity="0.4" />
                                <text x="45" y="200" fill="#FFF" fontSize="8" fontWeight="bold">Strength: {strength}</text>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">Turns of coil: {turns}
                            <input type="range" min={10} max={200} step={10} value={turns} onChange={e => setTurns(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Current: {current} A
                            <input type="range" min={0} max={10} step={1} value={current} onChange={e => setCurrent(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Core: {coreNames[coreFactor - 1]} (factor ×{coreFactor})
                            <input type="range" min={1} max={5} step={1} value={coreFactor} onChange={e => setCoreFactor(+e.target.value)} className="vl-range" />
                        </label>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'strong', text: 'Make strength ≥ 300' },
                                { id: 'weak', text: 'Make strength ≤ 120' },
                                { id: 'core', text: 'Use core factor 4 or 5' },
                                { id: 'many-turns', text: 'Use 150+ turns' },
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
