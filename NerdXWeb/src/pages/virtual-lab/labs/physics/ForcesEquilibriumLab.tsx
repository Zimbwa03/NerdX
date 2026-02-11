import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function ForcesEquilibriumLab({ simulation }: { simulation: SimulationMetadata }) {
    const [f1, setF1] = useState(50);
    const [f2, setF2] = useState(30);
    const [mass, setMass] = useState(10);
    const [quizOpen, setQuizOpen] = useState(false);
    const [tick, setTick] = useState(0);
    useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 50); return () => clearInterval(id); }, []);

    const netForce = useMemo(() => f1 - f2, [f1, f2]);
    const acceleration = useMemo(() => Math.round((netForce / mass) * 100) / 100, [netForce, mass]);
    const balanced = netForce === 0;

    // Animated box position (drifts if unbalanced)
    const drift = useMemo(() => {
        if (balanced) return 0;
        return Math.sin(tick * 0.02) * acceleration * 3;
    }, [tick, balanced, acceleration]);

    const boxCx = 150 + drift;

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (balanced) n.add('balanced');
        if (netForce > 0) n.add('pos');
        if (acceleration >= 2) n.add('accel');
        if (mass >= 15) n.add('heavy');
        setCompleted(n);
    }, [balanced, netForce, acceleration, mass]);

    const progress = Math.round((completed.size / 4) * 100);
    const canTakeQuiz = completed.size >= 3;

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #2196F3, #0D47A1)' }}><span style={{ fontSize: 24 }}>⚖️</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Free Body Diagram</div>
                        <div className="vl-card-subtitle">
                            Net force = <strong style={{ color: balanced ? '#4CAF50' : '#FFD600' }}>{netForce} N</strong> |
                            a = <strong style={{ color: '#42A5F5' }}>{acceleration} m/s²</strong>
                            {balanced && <span style={{ color: '#4CAF50' }}> — EQUILIBRIUM ✓</span>}
                        </div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 220" role="img" aria-label="Forces equilibrium">
                                {/* Ground */}
                                <line x1="30" y1="160" x2="270" y2="160" stroke="#546E7A" strokeWidth="2" />
                                {Array.from({ length: 17 }).map((_, i) => (
                                    <line key={i} x1={30 + i * 15} y1="160" x2={36 + i * 15} y2="168" stroke="#546E7A" strokeWidth="1" />
                                ))}

                                {/* Box */}
                                <rect x={boxCx - 25} y="120" width="50" height="40" rx="4"
                                    fill={balanced ? '#4CAF50' : '#42A5F5'} opacity="0.5"
                                    stroke={balanced ? '#2E7D32' : '#1E88E5'} strokeWidth="2" />
                                <text x={boxCx} y="145" textAnchor="middle" fill="#FFF" fontSize="10" fontWeight="bold">{mass}kg</text>

                                {/* Force 1 arrow (right) */}
                                <line x1={boxCx + 25} y1="140" x2={boxCx + 25 + f1 * 0.8} y2="140"
                                    stroke="#42A5F5" strokeWidth="3" markerEnd="url(#arrFE1)" />
                                <text x={boxCx + 30 + f1 * 0.4} y="133" fill="#42A5F5" fontSize="9" fontWeight="bold">F₁ = {f1} N</text>

                                {/* Force 2 arrow (left) */}
                                <line x1={boxCx - 25} y1="140" x2={boxCx - 25 - f2 * 0.8} y2="140"
                                    stroke="#FF9800" strokeWidth="3" markerEnd="url(#arrFE2)" />
                                <text x={boxCx - 30 - f2 * 0.4} y="133" fill="#FF9800" fontSize="9" fontWeight="bold" textAnchor="end">F₂ = {f2} N</text>

                                {/* Weight (down) */}
                                <line x1={boxCx} y1="160" x2={boxCx} y2={160 + mass * 1.5}
                                    stroke="#EF5350" strokeWidth="2" markerEnd="url(#arrFE3)" />
                                <text x={boxCx + 8} y={165 + mass * 0.8} fill="#EF5350" fontSize="7">W = {mass * 10} N</text>

                                {/* Normal force (up) */}
                                <line x1={boxCx} y1="120" x2={boxCx} y2={120 - mass * 1.5}
                                    stroke="#4CAF50" strokeWidth="2" markerEnd="url(#arrFE4)" />
                                <text x={boxCx + 8} y={115 - mass * 0.8} fill="#4CAF50" fontSize="7">N = {mass * 10} N</text>

                                {/* Net force */}
                                {netForce !== 0 && (
                                    <g>
                                        <line x1={boxCx} y1="105" x2={boxCx + netForce * 1.2} y2="105"
                                            stroke="#FFD600" strokeWidth="3" markerEnd="url(#arrFE5)" />
                                        <text x={boxCx + netForce * 0.6} y="100" textAnchor="middle" fill="#FFD600" fontSize="8" fontWeight="bold">
                                            Fnet = {netForce} N
                                        </text>
                                    </g>
                                )}

                                {/* Equilibrium badge */}
                                {balanced && (
                                    <g>
                                        <rect x="100" y="35" width="100" height="24" rx="6" fill="#4CAF5030" stroke="#4CAF50" strokeWidth="1" />
                                        <text x="150" y="51" textAnchor="middle" fill="#4CAF50" fontSize="10" fontWeight="bold">EQUILIBRIUM</text>
                                    </g>
                                )}

                                {/* Acceleration indicator */}
                                {!balanced && (
                                    <text x="150" y="45" textAnchor="middle" fill="#42A5F5" fontSize="9">
                                        a = Fnet / m = {netForce} / {mass} = {acceleration} m/s²
                                    </text>
                                )}

                                <defs>
                                    <marker id="arrFE1" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#42A5F5" /></marker>
                                    <marker id="arrFE2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#FF9800" /></marker>
                                    <marker id="arrFE3" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#EF5350" /></marker>
                                    <marker id="arrFE4" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#4CAF50" /></marker>
                                    <marker id="arrFE5" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#FFD600" /></marker>
                                </defs>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">Force 1 (→): {f1} N
                            <input type="range" min={0} max={100} step={5} value={f1} onChange={e => setF1(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Force 2 (←): {f2} N
                            <input type="range" min={0} max={100} step={5} value={f2} onChange={e => setF2(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Mass: {mass} kg
                            <input type="range" min={1} max={20} step={1} value={mass} onChange={e => setMass(+e.target.value)} className="vl-range" />
                        </label>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'balanced', text: 'Achieve equilibrium (Fnet = 0)' },
                                { id: 'pos', text: 'Make net force positive' },
                                { id: 'accel', text: 'Achieve acceleration ≥ 2 m/s²' },
                                { id: 'heavy', text: 'Use mass ≥ 15 kg' },
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
