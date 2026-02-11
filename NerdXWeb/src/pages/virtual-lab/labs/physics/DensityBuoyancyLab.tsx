import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function DensityBuoyancyLab({ simulation }: { simulation: SimulationMetadata }) {
    const [mass, setMass] = useState(2);
    const [volume, setVolume] = useState(4);
    const [waterDensity] = useState(1.0);
    const [quizOpen, setQuizOpen] = useState(false);
    const [tick, setTick] = useState(0);
    useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 50); return () => clearInterval(id); }, []);

    const density = useMemo(() => Math.round((mass / volume) * 100) / 100, [mass, volume]);
    const floats = density < waterDensity;
    const neutral = Math.abs(density - waterDensity) < 0.1;

    // Object position in water (animated settling)
    const waterSurface = 80;
    const waterBottom = 190;
    const targetY = useMemo(() => {
        if (floats) return waterSurface - 5 + (density / waterDensity) * 30;
        if (neutral) return (waterSurface + waterBottom) / 2;
        return waterBottom - 20;
    }, [floats, neutral, density, waterDensity]);

    // Smooth animated position
    const bobble = Math.sin(tick * 0.04) * (floats ? 3 : 0.5);
    const objY = targetY + bobble;

    const objSize = Math.min(35, 15 + volume * 2);

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (floats) n.add('float');
        if (!floats && !neutral) n.add('sink');
        if (neutral) n.add('neutral');
        if (density >= 3) n.add('dense');
        setCompleted(n);
    }, [floats, neutral, density]);

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
                        <div className="vl-card-title">ρ = m / V</div>
                        <div className="vl-card-subtitle">
                            Density = <strong style={{ color: '#FFD600' }}>{density} kg/L</strong> |
                            Object <strong style={{ color: floats ? '#4CAF50' : neutral ? '#FF9800' : '#EF5350' }}>
                                {floats ? 'FLOATS' : neutral ? 'NEUTRAL' : 'SINKS'}
                            </strong>
                        </div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 220" role="img" aria-label="Density buoyancy simulation">
                                {/* Container */}
                                <rect x="70" y="40" width="160" height="170" rx="6" fill="none" stroke="#546E7A" strokeWidth="2" />

                                {/* Water */}
                                <rect x="72" y={waterSurface} width="156" height={waterBottom - waterSurface + 20} fill="#42A5F5" opacity="0.15" />

                                {/* Surface ripples */}
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <line key={i}
                                        x1={80 + i * 28 + Math.sin(tick * 0.02 + i) * 4} y1={waterSurface}
                                        x2={100 + i * 28 + Math.sin(tick * 0.02 + i + 1) * 4} y2={waterSurface}
                                        stroke="#64B5F6" strokeWidth="1.5" opacity="0.4" />
                                ))}

                                {/* Water surface label */}
                                <text x="60" y={waterSurface - 5} fill="#42A5F5" fontSize="7">Surface</text>
                                <text x="60" y={waterSurface + 10} fill="#90A4AE" fontSize="7">ρ = 1.0 kg/L</text>

                                {/* Object */}
                                <rect x={150 - objSize / 2} y={objY - objSize / 2} width={objSize} height={objSize} rx="4"
                                    fill={floats ? '#4CAF50' : neutral ? '#FF9800' : '#EF5350'} opacity="0.6"
                                    stroke={floats ? '#2E7D32' : neutral ? '#E65100' : '#C62828'} strokeWidth="2" />
                                <text x="150" y={objY + 4} textAnchor="middle" fill="#FFF" fontSize="8" fontWeight="bold">
                                    {density}
                                </text>

                                {/* Weight arrow (down) */}
                                <line x1="150" y1={objY + objSize / 2 + 2} x2="150" y2={objY + objSize / 2 + 15 + mass * 2}
                                    stroke="#EF5350" strokeWidth="2" markerEnd="url(#arrDB)" />
                                <text x="162" y={objY + objSize / 2 + 12 + mass} fill="#EF5350" fontSize="7">W = mg</text>

                                {/* Buoyancy arrow (up) */}
                                {objY > waterSurface && (
                                    <>
                                        <line x1="150" y1={objY - objSize / 2 - 2} x2="150" y2={objY - objSize / 2 - 15 - volume * 1.5}
                                            stroke="#4CAF50" strokeWidth="2" markerEnd="url(#arrDB2)" />
                                        <text x="162" y={objY - objSize / 2 - 10 - volume} fill="#4CAF50" fontSize="7">Fb = upthrust</text>
                                    </>
                                )}

                                <defs>
                                    <marker id="arrDB" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#EF5350" /></marker>
                                    <marker id="arrDB2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#4CAF50" /></marker>
                                </defs>

                                {/* Bubbles when sinking */}
                                {!floats && !neutral && Array.from({ length: 4 }).map((_, i) => {
                                    const bx = 140 + Math.sin(tick * 0.05 + i * 2) * 15;
                                    const by = objY - objSize / 2 - ((tick * 0.3 + i * 15) % 40);
                                    return by > waterSurface ? (
                                        <circle key={i} cx={bx} cy={by} r="2.5" fill="#90CAF9" opacity="0.4" />
                                    ) : null;
                                })}

                                <text x="150" y="215" textAnchor="middle" fill="#90A4AE" fontSize="8">
                                    {floats ? 'Object density < water → floats!' : neutral ? 'Densities equal → neutral buoyancy' : 'Object density > water → sinks!'}
                                </text>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">Mass: {mass} kg
                            <input type="range" min={1} max={20} step={1} value={mass} onChange={e => setMass(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Volume: {volume} L
                            <input type="range" min={1} max={20} step={1} value={volume} onChange={e => setVolume(+e.target.value)} className="vl-range" />
                        </label>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Formula</div>
                        <div className="vl-explanation" style={{ fontSize: 12, fontFamily: 'monospace' }}>
                            ρ = m / V = {mass} / {volume} = <strong>{density} kg/L</strong><br />
                            Water density = {waterDensity} kg/L<br />
                            {density} {floats ? '<' : neutral ? '≈' : '>'} {waterDensity} → <strong>{floats ? 'Floats' : neutral ? 'Neutral' : 'Sinks'}</strong>
                        </div>
                    </div>
                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'float', text: 'Make object float (ρ < 1)' },
                                { id: 'sink', text: 'Make object sink (ρ > 1)' },
                                { id: 'neutral', text: 'Achieve neutral buoyancy (ρ ≈ 1)' },
                                { id: 'dense', text: 'Make a very dense object (ρ ≥ 3)' },
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
