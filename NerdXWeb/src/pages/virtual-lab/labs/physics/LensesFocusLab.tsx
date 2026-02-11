import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function LensesFocusLab({ simulation }: { simulation: SimulationMetadata }) {
    const [f, setF] = useState(10);
    const [u, setU] = useState(30);
    const [lensType, setLensType] = useState<'converging' | 'diverging'>('converging');
    const [quizOpen, setQuizOpen] = useState(false);
    const [tick, setTick] = useState(0);
    useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 60); return () => clearInterval(id); }, []);

    const fEff = lensType === 'converging' ? f : -f;
    const v = useMemo(() => {
        const denom = 1 / fEff - 1 / (-u); // u is negative (real object)
        return denom !== 0 ? Math.round((1 / denom) * 100) / 100 : Infinity;
    }, [fEff, u]);
    const magnification = useMemo(() => isFinite(v) ? Math.round(Math.abs(v / u) * 100) / 100 : 0, [v, u]);
    const realImage = v > 0 && lensType === 'converging';

    // SVG x positions: lens center at 150
    const lensCx = 150;
    const scale = 2; // pixels per cm
    const focalPx = f * scale;
    const objPx = u * scale;
    const imgPx = isFinite(v) ? Math.abs(v) * scale : 0;
    const objHeight = 30;
    const imgHeight = objHeight * magnification;

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (isFinite(v) && v >= 40) n.add('far');
        if (isFinite(v) && Math.abs(v) <= 20 && Math.abs(v) > 0) n.add('near');
        if (u >= 50) n.add('distant');
        if (lensType === 'diverging') n.add('diverge');
        setCompleted(n);
    }, [v, u, lensType]);

    const progress = Math.round((completed.size / 4) * 100);
    const canTakeQuiz = completed.size >= 3;

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #2196F3, #0D47A1)' }}><span style={{ fontSize: 24 }}>🔍</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">{lensType === 'converging' ? 'Converging' : 'Diverging'} Lens</div>
                        <div className="vl-card-subtitle">
                            f = {f} cm | u = {u} cm | v = <strong style={{ color: '#4CAF50' }}>{isFinite(v) ? `${v} cm` : '∞'}</strong> | M = {magnification}×
                        </div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 200" role="img" aria-label="Lens ray diagram">
                                {/* Principal axis */}
                                <line x1="10" y1="100" x2="290" y2="100" stroke="#546E7A" strokeWidth="1.5" />

                                {/* Lens */}
                                {lensType === 'converging' ? (
                                    <ellipse cx={lensCx} cy="100" rx="5" ry="55" fill="#42A5F5" opacity="0.25" stroke="#42A5F5" strokeWidth="2" />
                                ) : (
                                    <g>
                                        <line x1={lensCx - 3} y1="45" x2={lensCx + 3} y2="55" stroke="#FF9800" strokeWidth="2" />
                                        <line x1={lensCx + 3} y1="55" x2={lensCx - 3} y2="100" stroke="#FF9800" strokeWidth="2" />
                                        <line x1={lensCx - 3} y1="100" x2={lensCx + 3} y2="145" stroke="#FF9800" strokeWidth="2" />
                                        <line x1={lensCx + 3} y1="145" x2={lensCx - 3} y2="155" stroke="#FF9800" strokeWidth="2" />
                                    </g>
                                )}

                                {/* Focal points */}
                                <circle cx={lensCx - focalPx} cy="100" r="3" fill="#FFD600" />
                                <text x={lensCx - focalPx} y="115" textAnchor="middle" fill="#FFD600" fontSize="7">F</text>
                                <circle cx={lensCx + focalPx} cy="100" r="3" fill="#FFD600" />
                                <text x={lensCx + focalPx} y="115" textAnchor="middle" fill="#FFD600" fontSize="7">F'</text>

                                {/* Object arrow */}
                                <line x1={lensCx - objPx} y1="100" x2={lensCx - objPx} y2={100 - objHeight} stroke="#EF5350" strokeWidth="2.5" />
                                <polygon points={`${lensCx - objPx - 4},${100 - objHeight + 5} ${lensCx - objPx + 4},${100 - objHeight + 5} ${lensCx - objPx},${100 - objHeight}`} fill="#EF5350" />
                                <text x={lensCx - objPx} y={100 - objHeight - 6} textAnchor="middle" fill="#EF5350" fontSize="7">Object</text>

                                {/* Ray 1: parallel then through F' */}
                                <line x1={lensCx - objPx} y1={100 - objHeight} x2={lensCx} y2={100 - objHeight}
                                    stroke="#FFD600" strokeWidth="1.5" opacity="0.7" />
                                {lensType === 'converging' ? (
                                    <line x1={lensCx} y1={100 - objHeight} x2={lensCx + focalPx + 40} y2="100"
                                        stroke="#FFD600" strokeWidth="1.5" opacity="0.7" />
                                ) : (
                                    <line x1={lensCx} y1={100 - objHeight} x2={lensCx + 60} y2={100 - objHeight + 20}
                                        stroke="#FFD600" strokeWidth="1.5" opacity="0.7" />
                                )}

                                {/* Ray 2: through center */}
                                <line x1={lensCx - objPx} y1={100 - objHeight} x2={lensCx + objPx} y2={100 + objHeight}
                                    stroke="#90CAF9" strokeWidth="1.5" opacity="0.7" />

                                {/* Image arrow (if real image) */}
                                {realImage && isFinite(v) && imgPx > 0 && imgPx < 130 && (
                                    <g>
                                        <line x1={lensCx + imgPx} y1="100" x2={lensCx + imgPx} y2={100 + Math.min(imgHeight, 50)} stroke="#4CAF50" strokeWidth="2.5" strokeDasharray="4,2" />
                                        <polygon points={`${lensCx + imgPx - 4},${100 + Math.min(imgHeight, 50) - 5} ${lensCx + imgPx + 4},${100 + Math.min(imgHeight, 50) - 5} ${lensCx + imgPx},${100 + Math.min(imgHeight, 50)}`} fill="#4CAF50" />
                                        <text x={lensCx + imgPx} y={100 + Math.min(imgHeight, 50) + 12} textAnchor="middle" fill="#4CAF50" fontSize="7">Image</text>
                                    </g>
                                )}

                                {/* Animated photon */}
                                {(() => {
                                    const ph = (tick * 0.015) % 1;
                                    const sx = lensCx - objPx;
                                    const sy = 100 - objHeight;
                                    const ex = lensCx;
                                    const ey = 100 - objHeight;
                                    const apx = sx + (ex - sx) * ph;
                                    const apy = sy + (ey - sy) * ph;
                                    return <circle cx={apx} cy={apy} r="3" fill="#FFD600" opacity="0.9" />;
                                })()}

                                {/* Labels */}
                                <text x={lensCx} y="15" textAnchor="middle" fill="#90A4AE" fontSize="8">
                                    {realImage ? 'Real, inverted image' : 'Virtual image (same side)'}
                                </text>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                            <button type="button" className={`vl-template-btn ${lensType === 'converging' ? 'active' : ''}`}
                                onClick={() => setLensType('converging')} style={{ flex: 1 }}>
                                <div className="vl-template-title">Converging</div>
                            </button>
                            <button type="button" className={`vl-template-btn ${lensType === 'diverging' ? 'active' : ''}`}
                                onClick={() => setLensType('diverging')} style={{ flex: 1 }}>
                                <div className="vl-template-title">Diverging</div>
                            </button>
                        </div>
                        <label className="vl-slider-label">Focal length (f): {f} cm
                            <input type="range" min={5} max={30} step={1} value={f} onChange={e => setF(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Object distance (u): {u} cm
                            <input type="range" min={6} max={100} step={1} value={u} onChange={e => setU(+e.target.value)} className="vl-range" />
                        </label>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Formula</div>
                        <div className="vl-explanation" style={{ fontSize: 12, fontFamily: 'monospace' }}>
                            1/v = 1/f − 1/u<br />
                            v = {isFinite(v) ? v : '∞'} cm | M = v/u = {magnification}×
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'far', text: 'Make image distance ≥ 40 cm' },
                                { id: 'near', text: 'Make image distance ≤ 20 cm' },
                                { id: 'distant', text: 'Set object distance ≥ 50 cm' },
                                { id: 'diverge', text: 'Try a diverging lens' },
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
