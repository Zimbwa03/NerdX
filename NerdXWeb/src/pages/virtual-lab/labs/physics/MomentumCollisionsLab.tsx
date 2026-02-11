import { useEffect, useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function MomentumCollisionsLab({ simulation }: { simulation: SimulationMetadata }) {
    const [m1, setM1] = useState(2);
    const [v1, setV1] = useState(5);
    const [m2, setM2] = useState(3);
    const [v2, setV2] = useState(-2);
    const [quizOpen, setQuizOpen] = useState(false);
    const [tick, setTick] = useState(0);
    const [collided, setCollided] = useState(false);
    const [running, setRunning] = useState(false);
    const [phase, setPhase] = useState(0); // 0-100

    useEffect(() => {
        if (running && phase < 100) {
            const id = setInterval(() => setPhase(p => Math.min(p + 1.5, 100)), 40);
            return () => clearInterval(id);
        }
    }, [running, phase]);

    useEffect(() => {
        if (running) {
            const id = setInterval(() => setTick(t => t + 1), 50);
            return () => clearInterval(id);
        }
    }, [running]);

    const p1 = useMemo(() => m1 * v1, [m1, v1]);
    const p2 = useMemo(() => m2 * v2, [m2, v2]);
    const totalP = useMemo(() => p1 + p2, [p1, p2]);

    // After collision (perfectly inelastic)
    const vFinal = useMemo(() => Math.round((totalP / (m1 + m2)) * 100) / 100, [totalP, m1, m2]);

    const collisionPoint = 150;
    const cart1X = useMemo(() => {
        if (!running) return 50;
        if (phase < 50) return 50 + (phase / 50) * (collisionPoint - 50 - 20);
        return collisionPoint - 20 + (phase - 50) / 50 * vFinal * 30;
    }, [phase, running, vFinal]);

    const cart2X = useMemo(() => {
        if (!running) return 220;
        if (phase < 50) return 220 + (phase / 50) * (collisionPoint - 220 + 20);
        return collisionPoint + 20 + (phase - 50) / 50 * vFinal * 30;
    }, [phase, running, vFinal]);

    useEffect(() => { if (phase >= 50 && !collided) setCollided(true); }, [phase, collided]);

    const startSim = useCallback(() => {
        setPhase(0); setCollided(false); setRunning(true);
    }, []);

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (p1 > 0) n.add('pos-p');
        if (p1 < 0) n.add('neg-p');
        if (Math.abs(p1) >= 20) n.add('big-p');
        if (collided) n.add('collide');
        setCompleted(n);
    }, [p1, collided]);

    const progress = Math.round((completed.size / 4) * 100);
    const canTakeQuiz = completed.size >= 3;

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #2196F3, #0D47A1)' }}><span style={{ fontSize: 24 }}>💥</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Collision Simulator</div>
                        <div className="vl-card-subtitle">
                            Total momentum (before) = <strong style={{ color: '#FFD600' }}>{totalP} kg⋅m/s</strong>
                            {collided && <> | After: v = <strong style={{ color: '#4CAF50' }}>{vFinal} m/s</strong></>}
                        </div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 180" role="img" aria-label="Momentum collision">
                                {/* Track */}
                                <rect x="20" y="120" width="260" height="6" rx="3" fill="#37474F" />

                                {/* Cart 1 */}
                                <rect x={cart1X} y={100 - m1 * 3} width="35" height={20 + m1 * 3} rx="4"
                                    fill="#42A5F5" opacity="0.7" stroke="#1E88E5" strokeWidth="2" />
                                <text x={cart1X + 17} y="115" textAnchor="middle" fill="#FFF" fontSize="8" fontWeight="bold">{m1}kg</text>
                                {/* Wheels */}
                                <circle cx={cart1X + 8} cy="122" r="4" fill="#263238" stroke="#546E7A" strokeWidth="1" />
                                <circle cx={cart1X + 27} cy="122" r="4" fill="#263238" stroke="#546E7A" strokeWidth="1" />
                                {/* Velocity arrow */}
                                {!running && v1 !== 0 && (
                                    <g>
                                        <line x1={cart1X + 35} y1={95 - m1 * 3} x2={cart1X + 35 + v1 * 5} y2={95 - m1 * 3}
                                            stroke="#EF5350" strokeWidth="2" markerEnd="url(#arrM)" />
                                        <text x={cart1X + 40 + v1 * 2.5} y={90 - m1 * 3} fill="#EF5350" fontSize="7">{v1} m/s</text>
                                    </g>
                                )}

                                {/* Cart 2 */}
                                <rect x={cart2X} y={100 - m2 * 3} width="35" height={20 + m2 * 3} rx="4"
                                    fill="#FF9800" opacity="0.7" stroke="#E65100" strokeWidth="2" />
                                <text x={cart2X + 17} y="115" textAnchor="middle" fill="#FFF" fontSize="8" fontWeight="bold">{m2}kg</text>
                                <circle cx={cart2X + 8} cy="122" r="4" fill="#263238" stroke="#546E7A" strokeWidth="1" />
                                <circle cx={cart2X + 27} cy="122" r="4" fill="#263238" stroke="#546E7A" strokeWidth="1" />
                                {!running && v2 !== 0 && (
                                    <g>
                                        <line x1={cart2X} y1={95 - m2 * 3} x2={cart2X + v2 * 5} y2={95 - m2 * 3}
                                            stroke="#EF5350" strokeWidth="2" markerEnd="url(#arrM)" />
                                        <text x={cart2X + v2 * 2.5 - 5} y={90 - m2 * 3} fill="#EF5350" fontSize="7">{v2} m/s</text>
                                    </g>
                                )}

                                {/* Collision flash */}
                                {phase >= 48 && phase <= 55 && (
                                    <circle cx={collisionPoint} cy="108" r={15 + (phase - 48) * 2} fill="#FFD600" opacity={0.5 - (phase - 48) * 0.06} />
                                )}

                                <defs><marker id="arrM" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#EF5350" /></marker></defs>

                                {/* Momentum bars */}
                                <text x="20" y="20" fill="#42A5F5" fontSize="8">p₁ = {p1} kg⋅m/s</text>
                                <rect x="20" y="24" width={Math.abs(p1) * 3} height="8" rx="2" fill="#42A5F5" opacity="0.5" />
                                <text x="20" y="42" fill="#FF9800" fontSize="8">p₂ = {p2} kg⋅m/s</text>
                                <rect x="20" y="46" width={Math.abs(p2) * 3} height="8" rx="2" fill="#FF9800" opacity="0.5" />
                                <text x="20" y="64" fill="#FFD600" fontSize="8" fontWeight="bold">Total = {totalP} (conserved)</text>

                                <text x="150" y="160" textAnchor="middle" fill="#90A4AE" fontSize="8">
                                    {collided ? '✅ Momentum conserved!' : running ? 'Approaching...' : 'Set up and press Run'}
                                </text>
                            </svg>
                        </div>
                        <button type="button" className="vl-btn primary" style={{ marginTop: 8 }} onClick={startSim}>
                            {running && phase < 100 ? '⏳ Running...' : '▶ Run Collision'}
                        </button>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">Cart 1 mass: {m1} kg
                            <input type="range" min={1} max={10} value={m1} onChange={e => { setM1(+e.target.value); setRunning(false); setPhase(0); setCollided(false); }} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Cart 1 velocity: {v1} m/s
                            <input type="range" min={-10} max={10} value={v1} onChange={e => { setV1(+e.target.value); setRunning(false); setPhase(0); setCollided(false); }} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Cart 2 mass: {m2} kg
                            <input type="range" min={1} max={10} value={m2} onChange={e => { setM2(+e.target.value); setRunning(false); setPhase(0); setCollided(false); }} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Cart 2 velocity: {v2} m/s
                            <input type="range" min={-10} max={10} value={v2} onChange={e => { setV2(+e.target.value); setRunning(false); setPhase(0); setCollided(false); }} className="vl-range" />
                        </label>
                    </div>

                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'pos-p', text: 'Make p₁ positive' },
                                { id: 'neg-p', text: 'Make p₁ negative' },
                                { id: 'big-p', text: 'Make |p₁| ≥ 20 kg⋅m/s' },
                                { id: 'collide', text: 'Run a collision' },
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
