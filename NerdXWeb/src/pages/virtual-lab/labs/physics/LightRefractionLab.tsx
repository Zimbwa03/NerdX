import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function LightRefractionLab({ simulation }: { simulation: SimulationMetadata }) {
    const [angleI, setAngleI] = useState(30);
    const [n1, setN1] = useState(1.0);
    const [n2, setN2] = useState(1.5);
    const [quizOpen, setQuizOpen] = useState(false);
    const [tick, setTick] = useState(0);
    useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 50); return () => clearInterval(id); }, []);

    const toRad = (d: number) => (d * Math.PI) / 180;
    const toDeg = (r: number) => (r * 180) / Math.PI;

    // Snell's law
    const sinR = useMemo(() => (n1 / n2) * Math.sin(toRad(angleI)), [n1, n2, angleI]);
    const totalInternalReflection = Math.abs(sinR) > 1;
    const angleR = useMemo(() => totalInternalReflection ? 90 : Math.round(toDeg(Math.asin(sinR))), [sinR, totalInternalReflection]);

    const boundaryY = 120;
    const cx = 150;
    const rayLen = 90;

    // Incident ray end
    const incX = cx - Math.sin(toRad(angleI)) * rayLen;
    const incY = boundaryY - Math.cos(toRad(angleI)) * rayLen;

    // Refracted ray end
    const refX = cx + Math.sin(toRad(angleR)) * rayLen;
    const refY = boundaryY + Math.cos(toRad(angleR)) * (totalInternalReflection ? 0 : rayLen);

    // TIR reflected
    const tirX = cx + Math.sin(toRad(angleI)) * rayLen;
    const tirY = boundaryY - Math.cos(toRad(angleI)) * rayLen;

    // Animated particle
    const phase = (tick * 0.025) % 2;
    const onInc = phase < 1;
    const t = phase < 1 ? phase : phase - 1;
    const px = onInc ? incX + (cx - incX) * t : (totalInternalReflection ? cx + (tirX - cx) * t : cx + (refX - cx) * t);
    const py = onInc ? incY + (boundaryY - incY) * t : (totalInternalReflection ? boundaryY + (tirY - boundaryY) * t : boundaryY + (refY - boundaryY) * t);

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (n2 > n1 && angleR < angleI) n.add('towards');
        if (n1 > n2) n.add('away');
        if (totalInternalReflection) n.add('tir');
        if (Math.abs(n2 - n1) >= 0.5) n.add('big-diff');
        setCompleted(n);
    }, [angleI, angleR, n1, n2, totalInternalReflection]);

    const progress = Math.round((completed.size / 4) * 100);
    const canTakeQuiz = completed.size >= 3;

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #2196F3, #0D47A1)' }}><span style={{ fontSize: 24 }}>🌈</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Snell's Law: n₁ sin θᵢ = n₂ sin θᵣ</div>
                        <div className="vl-card-subtitle">
                            θᵢ = <strong style={{ color: '#FFD600' }}>{angleI}°</strong> | θᵣ = <strong style={{ color: '#4CAF50' }}>{totalInternalReflection ? 'TIR!' : `${angleR}°`}</strong>
                        </div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 240" role="img" aria-label="Refraction simulation">
                                {/* Medium 1 (top) */}
                                <rect x="20" y="20" width="260" height={boundaryY - 20} fill="#E3F2FD" opacity="0.15" />
                                <text x="30" y="40" fill="#90CAF9" fontSize="8">Medium 1 (n₁ = {n1.toFixed(1)})</text>

                                {/* Medium 2 (bottom) */}
                                <rect x="20" y={boundaryY} width="260" height="100" fill="#42A5F5" opacity="0.15" />
                                <text x="30" y={boundaryY + 15} fill="#42A5F5" fontSize="8">Medium 2 (n₂ = {n2.toFixed(1)})</text>

                                {/* Boundary line */}
                                <line x1="20" y1={boundaryY} x2="280" y2={boundaryY} stroke="#546E7A" strokeWidth="2" />

                                {/* Normal (dashed) */}
                                <line x1={cx} y1={boundaryY - 100} x2={cx} y2={boundaryY + 100}
                                    stroke="#90A4AE" strokeWidth="1.5" strokeDasharray="4,3" />
                                <text x={cx + 5} y={boundaryY - 90} fill="#90A4AE" fontSize="7">Normal</text>

                                {/* Incident ray */}
                                <line x1={incX} y1={incY} x2={cx} y2={boundaryY} stroke="#FFD600" strokeWidth="2.5" />

                                {/* Refracted or TIR ray */}
                                {totalInternalReflection ? (
                                    <line x1={cx} y1={boundaryY} x2={tirX} y2={tirY} stroke="#EF5350" strokeWidth="2.5" />
                                ) : (
                                    <line x1={cx} y1={boundaryY} x2={refX} y2={refY} stroke="#4CAF50" strokeWidth="2.5" />
                                )}

                                {/* Angle arcs */}
                                <path d={`M ${cx} ${boundaryY - 25} A 25 25 0 0 0 ${cx - Math.sin(toRad(angleI)) * 25} ${boundaryY - Math.cos(toRad(angleI)) * 25}`}
                                    fill="none" stroke="#FFD600" strokeWidth="1.5" />
                                <text x={cx - 30} y={boundaryY - 28} fill="#FFD600" fontSize="8" fontWeight="bold">θᵢ</text>

                                {!totalInternalReflection && (
                                    <>
                                        <path d={`M ${cx} ${boundaryY + 25} A 25 25 0 0 0 ${cx + Math.sin(toRad(angleR)) * 25} ${boundaryY + Math.cos(toRad(angleR)) * 25}`}
                                            fill="none" stroke="#4CAF50" strokeWidth="1.5" />
                                        <text x={cx + 15} y={boundaryY + 35} fill="#4CAF50" fontSize="8" fontWeight="bold">θᵣ</text>
                                    </>
                                )}

                                {/* Animated photon */}
                                <circle cx={px} cy={py} r="5" fill={onInc ? '#FFD600' : totalInternalReflection ? '#EF5350' : '#4CAF50'} opacity="0.9" />
                                <circle cx={px} cy={py} r="9" fill={onInc ? '#FFD600' : totalInternalReflection ? '#EF5350' : '#4CAF50'} opacity="0.25" />

                                {totalInternalReflection && (
                                    <text x={cx} y={boundaryY + 25} textAnchor="middle" fill="#EF5350" fontSize="10" fontWeight="bold">Total Internal Reflection!</text>
                                )}
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">Angle of incidence (θᵢ): {angleI}°
                            <input type="range" min={0} max={85} step={1} value={angleI} onChange={e => setAngleI(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Refractive index n₁: {n1.toFixed(1)}
                            <input type="range" min={1.0} max={2.5} step={0.1} value={n1} onChange={e => setN1(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Refractive index n₂: {n2.toFixed(1)}
                            <input type="range" min={1.0} max={2.5} step={0.1} value={n2} onChange={e => setN2(+e.target.value)} className="vl-range" />
                        </label>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'towards', text: 'Bend light towards normal (n₂ > n₁)' },
                                { id: 'away', text: 'Bend light away from normal (n₁ > n₂)' },
                                { id: 'tir', text: 'Achieve total internal reflection' },
                                { id: 'big-diff', text: 'Use large refractive-index difference' },
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
