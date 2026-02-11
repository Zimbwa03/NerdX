import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function PressureFluidsLab({ simulation }: { simulation: SimulationMetadata }) {
    const [depth, setDepth] = useState(5);
    const [density, setDensity] = useState(1000);
    const [gravity, setGravity] = useState(10);
    const [quizOpen, setQuizOpen] = useState(false);
    const [tick, setTick] = useState(0);
    useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 60); return () => clearInterval(id); }, []);

    const pressure = useMemo(() => Math.round(density * gravity * depth), [density, gravity, depth]);
    const pressureKPa = useMemo(() => Math.round(pressure / 100) / 10, [pressure]);

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (pressure >= 150000) n.add('high');
        if (pressure <= 20000) n.add('low');
        if (depth >= 10) n.add('deep');
        if (density >= 1200) n.add('dense');
        setCompleted(n);
    }, [pressure, depth, density]);

    const progress = Math.round((completed.size / 4) * 100);
    const canTakeQuiz = completed.size >= 3;

    // Water column height for SVG
    const waterHeight = Math.min(160, depth * 8);
    const depthMarkerY = 40 + waterHeight;

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #2196F3, #0D47A1)' }}><span style={{ fontSize: 24 }}>💧</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">P = ρgh</div>
                        <div className="vl-card-subtitle">
                            Pressure = <strong style={{ color: '#42A5F5' }}>{pressureKPa} kPa</strong> ({pressure.toLocaleString()} Pa)
                        </div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 240" role="img" aria-label="Fluid pressure simulation">
                                {/* Tank walls */}
                                <rect x="80" y="30" width="140" height="180" rx="6" fill="none" stroke="#546E7A" strokeWidth="2" />

                                {/* Water */}
                                <rect x="82" y={210 - waterHeight} width="136" height={waterHeight} fill="#42A5F5" opacity="0.2" />

                                {/* Surface ripples */}
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <line key={i}
                                        x1={90 + i * 30 + Math.sin(tick * 0.03 + i) * 5} y1={210 - waterHeight}
                                        x2={110 + i * 30 + Math.sin(tick * 0.03 + i + 1) * 5} y2={210 - waterHeight}
                                        stroke="#64B5F6" strokeWidth="1.5" opacity="0.5" />
                                ))}

                                {/* Pressure arrows at depth (pointing inward) */}
                                {Array.from({ length: Math.min(6, Math.floor(pressure / 30000) + 1) }).map((_, i) => {
                                    const arrowY = 215 - (i + 1) * (waterHeight / 7);
                                    const arrowLen = 12 + (i * 3 * pressure / 200000);
                                    return arrowY > 210 - waterHeight ? (
                                        <g key={i}>
                                            <line x1={80 - arrowLen} y1={arrowY} x2={80} y2={arrowY} stroke="#FF9800" strokeWidth="2" />
                                            <polygon points={`80,${arrowY - 3} 80,${arrowY + 3} 86,${arrowY}`} fill="#FF9800" />
                                            <line x1={220 + arrowLen} y1={arrowY} x2={220} y2={arrowY} stroke="#FF9800" strokeWidth="2" />
                                            <polygon points={`220,${arrowY - 3} 220,${arrowY + 3} 214,${arrowY}`} fill="#FF9800" />
                                        </g>
                                    ) : null;
                                })}

                                {/* Depth arrow */}
                                <line x1="240" y1={210 - waterHeight} x2="240" y2="210" stroke="#FFD600" strokeWidth="2" />
                                <polygon points="237,210 243,210 240,215" fill="#FFD600" />
                                <text x="258" y={(420 - waterHeight) / 2 + 5} fill="#FFD600" fontSize="9" fontWeight="bold">{depth} m</text>

                                {/* Particle dots (denser near bottom) */}
                                {Array.from({ length: 15 }).map((_, i) => {
                                    const py = 215 - Math.random() * waterHeight;
                                    const px = 90 + Math.random() * 120;
                                    const drift = Math.sin(tick * 0.02 + i * 2) * 3;
                                    return py > 210 - waterHeight ? (
                                        <circle key={i} cx={px + drift} cy={py} r="2" fill="#90CAF9" opacity={0.3 + ((py - (210 - waterHeight)) / waterHeight) * 0.4} />
                                    ) : null;
                                })}

                                {/* Pressure gauge */}
                                <circle cx="55" cy="210" r="18" fill="#263238" opacity="0.4" stroke="#FF9800" strokeWidth="1.5" />
                                <text x="55" y="213" textAnchor="middle" fill="#FF9800" fontSize="7" fontWeight="bold">{pressureKPa}</text>
                                <text x="55" y="222" textAnchor="middle" fill="#90A4AE" fontSize="5">kPa</text>

                                {/* Labels */}
                                <text x="150" y={207 - waterHeight} textAnchor="middle" fill="#90A4AE" fontSize="8">Surface</text>
                                <text x="150" y="235" textAnchor="middle" fill="#FF9800" fontSize="9" fontWeight="bold">Pressure increases with depth →</text>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">Depth (h): {depth} m
                            <input type="range" min={0} max={20} step={1} value={depth} onChange={e => setDepth(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Density (ρ): {density} kg/m³
                            <input type="range" min={500} max={1500} step={50} value={density} onChange={e => setDensity(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Gravity (g): {gravity} m/s²
                            <input type="range" min={1} max={20} step={1} value={gravity} onChange={e => setGravity(+e.target.value)} className="vl-range" />
                        </label>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Formula</div>
                        <div className="vl-explanation" style={{ fontSize: 12, fontFamily: 'monospace' }}>
                            P = ρ × g × h<br />
                            P = {density} × {gravity} × {depth}<br />
                            P = <strong>{pressure.toLocaleString()} Pa</strong> = <strong>{pressureKPa} kPa</strong>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'high', text: 'Make pressure ≥ 150 kPa' },
                                { id: 'low', text: 'Make pressure ≤ 20 kPa' },
                                { id: 'deep', text: 'Set depth to 10 m or more' },
                                { id: 'dense', text: 'Use a dense fluid (ρ ≥ 1200)' },
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
