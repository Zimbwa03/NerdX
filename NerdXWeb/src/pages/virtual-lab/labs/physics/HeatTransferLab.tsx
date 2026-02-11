import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

type HeatMode = 'conduction' | 'convection' | 'radiation';

export function HeatTransferLab({ simulation }: { simulation: SimulationMetadata }) {
    const [mode, setMode] = useState<HeatMode>('conduction');
    const [temp, setTemp] = useState(80);
    const [quizOpen, setQuizOpen] = useState(false);
    const [tick, setTick] = useState(0);
    useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 50); return () => clearInterval(id); }, []);

    const [visited, setVisited] = useState<Set<string>>(new Set());
    useEffect(() => { setVisited(prev => new Set(prev).add(mode)); }, [mode]);

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (visited.has('conduction')) n.add('cond');
        if (visited.has('convection')) n.add('conv');
        if (visited.has('radiation')) n.add('rad');
        if (temp >= 150) n.add('hot');
        setCompleted(n);
    }, [visited, temp]);

    const progress = Math.round((completed.size / 4) * 100);
    const canTakeQuiz = completed.size >= 3;

    const tempNorm = temp / 200; // 0-1

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #2196F3, #0D47A1)' }}><span style={{ fontSize: 24 }}>🔥</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title" style={{ textTransform: 'capitalize' }}>{mode}</div>
                        <div className="vl-card-subtitle">Temperature: <strong style={{ color: '#FF9800' }}>{temp} °C</strong></div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 220" role="img" aria-label={`${mode} heat transfer`}>

                                {mode === 'conduction' && (
                                    <>
                                        {/* Metal bar */}
                                        <rect x="40" y="90" width="220" height="30" rx="4" fill="#546E7A" opacity="0.5" />
                                        {/* Heat source (left) */}
                                        <rect x="20" y="80" width="30" height="50" rx="3" fill="#EF5350" opacity={0.3 + tempNorm * 0.5} />
                                        <text x="35" y="110" textAnchor="middle" fill="#FFF" fontSize="8">Heat</text>
                                        {/* Particle vibrations along bar */}
                                        {Array.from({ length: 10 }).map((_, i) => {
                                            const x = 50 + i * 22;
                                            const intensity = Math.max(0, 1 - i * 0.1) * tempNorm;
                                            const jiggle = Math.sin(tick * 0.1 + i * 0.5) * 3 * intensity;
                                            return (
                                                <g key={i}>
                                                    <circle cx={x + jiggle} cy={105 + Math.cos(tick * 0.08 + i) * 2 * intensity} r="5"
                                                        fill={`hsl(${30 - intensity * 30}, 80%, ${50 + intensity * 20}%)`} opacity={0.4 + intensity * 0.4} />
                                                </g>
                                            );
                                        })}
                                        {/* Gradient color indication */}
                                        <defs>
                                            <linearGradient id="condGrad" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#EF5350" stopOpacity={tempNorm} />
                                                <stop offset="100%" stopColor="#42A5F5" stopOpacity="0.3" />
                                            </linearGradient>
                                        </defs>
                                        <rect x="40" y="130" width="220" height="8" rx="3" fill="url(#condGrad)" />
                                        <text x="45" y="155" fill="#EF5350" fontSize="8">Hot</text>
                                        <text x="245" y="155" fill="#42A5F5" fontSize="8">Cold</text>
                                        <text x="150" y="180" textAnchor="middle" fill="#90A4AE" fontSize="9">
                                            Particles vibrate → pass energy to neighbours
                                        </text>
                                    </>
                                )}

                                {mode === 'convection' && (
                                    <>
                                        {/* Container */}
                                        <rect x="80" y="40" width="140" height="150" rx="6" fill="none" stroke="#546E7A" strokeWidth="2" />
                                        {/* Heat source at bottom */}
                                        <rect x="110" y="185" width="80" height="15" rx="3" fill="#EF5350" opacity={0.4 + tempNorm * 0.4} />
                                        <text x="150" y="196" textAnchor="middle" fill="#FFF" fontSize="7">Heater</text>
                                        {/* Convection current arrows (circular) */}
                                        {Array.from({ length: 8 }).map((_, i) => {
                                            const angle = (i * 45 + tick * 2 * tempNorm) % 360;
                                            const rad = angle * Math.PI / 180;
                                            const rx_e = 45;
                                            const ry_e = 55;
                                            const cx_e = 150;
                                            const cy_e = 115;
                                            const px = cx_e + Math.cos(rad) * rx_e;
                                            const py = cy_e + Math.sin(rad) * ry_e;
                                            const hot = py > 115;
                                            return (
                                                <circle key={i} cx={px} cy={py} r={3} fill={hot ? '#EF5350' : '#42A5F5'} opacity={0.5 + tempNorm * 0.3} />
                                            );
                                        })}
                                        {/* Arrows showing flow direction */}
                                        <path d="M 120 170 Q 100 115 120 60" fill="none" stroke="#EF5350" strokeWidth="1.5" opacity="0.5" markerEnd="url(#arrHT)" />
                                        <path d="M 180 60 Q 200 115 180 170" fill="none" stroke="#42A5F5" strokeWidth="1.5" opacity="0.5" markerEnd="url(#arrHT2)" />
                                        <defs>
                                            <marker id="arrHT" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#EF5350" /></marker>
                                            <marker id="arrHT2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#42A5F5" /></marker>
                                        </defs>
                                        <text x="95" y="120" fill="#EF5350" fontSize="7">Hot ↑</text>
                                        <text x="200" y="120" fill="#42A5F5" fontSize="7">Cool ↓</text>
                                        <text x="150" y="215" textAnchor="middle" fill="#90A4AE" fontSize="9">
                                            Hot fluid rises → cool fluid sinks → current forms
                                        </text>
                                    </>
                                )}

                                {mode === 'radiation' && (
                                    <>
                                        {/* Sun / heat source */}
                                        <circle cx="80" cy="110" r="30" fill="#FFD600" opacity={0.3 + tempNorm * 0.5} />
                                        <circle cx="80" cy="110" r="20" fill="#FF9800" opacity={0.4 + tempNorm * 0.4} />
                                        <text x="80" y="113" textAnchor="middle" fill="#FFF" fontSize="8" fontWeight="bold">Source</text>
                                        {/* Radiation waves */}
                                        {Array.from({ length: 5 }).map((_, i) => {
                                            const r = 45 + i * 18 + Math.sin(tick * 0.05 + i) * 5;
                                            return (
                                                <circle key={i} cx="80" cy="110" r={r} fill="none"
                                                    stroke="#FF9800" strokeWidth="1.5" opacity={0.5 - i * 0.08}
                                                    strokeDasharray="6,4" />
                                            );
                                        })}
                                        {/* Object absorbing */}
                                        <rect x="210" y="90" width="40" height="40" rx="4" fill="#263238" opacity="0.6" stroke="#90A4AE" strokeWidth="1" />
                                        <text x="230" y="115" textAnchor="middle" fill="#FFF" fontSize="7">Object</text>
                                        {/* Absorption glow */}
                                        <circle cx="230" cy="110" r={20 + tempNorm * 10} fill="#FF9800" opacity={tempNorm * 0.2} />
                                        <text x="150" y="190" textAnchor="middle" fill="#90A4AE" fontSize="9">
                                            EM waves travel through vacuum — no medium needed
                                        </text>
                                    </>
                                )}
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                            {(['conduction', 'convection', 'radiation'] as HeatMode[]).map(m => (
                                <button key={m} type="button" className={`vl-template-btn ${mode === m ? 'active' : ''}`} onClick={() => setMode(m)} style={{ flex: 1 }}>
                                    <div className="vl-template-title" style={{ textTransform: 'capitalize' }}>{m}</div>
                                </button>
                            ))}
                        </div>
                        <label className="vl-slider-label">Temperature: {temp} °C
                            <input type="range" min={20} max={200} step={5} value={temp} onChange={e => setTemp(+e.target.value)} className="vl-range" />
                        </label>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Key Concepts</div>
                        <div className="vl-explanation" style={{ fontSize: 12 }}>
                            {mode === 'conduction' && '• Conduction: heat passes through a material via vibrating particles. Metals are good conductors.'}
                            {mode === 'convection' && '• Convection: hot fluid rises, cool fluid sinks, forming convection currents. Only in fluids.'}
                            {mode === 'radiation' && '• Radiation: energy travels as EM waves. It does NOT need a medium (works in vacuum).'}
                        </div>
                    </div>
                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'cond', text: 'Explore conduction' },
                                { id: 'conv', text: 'Explore convection' },
                                { id: 'rad', text: 'Explore radiation' },
                                { id: 'hot', text: 'Set temperature ≥ 150 °C' },
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
