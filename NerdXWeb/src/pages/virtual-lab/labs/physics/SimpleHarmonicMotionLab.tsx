import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function SimpleHarmonicMotionLab({ simulation }: { simulation: SimulationMetadata }) {
    const [length, setLength] = useState(1.0);
    const [amplitude, setAmplitude] = useState(30);
    const [gravity, setGravity] = useState(10);
    const [quizOpen, setQuizOpen] = useState(false);
    const [tick, setTick] = useState(0);
    useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 30); return () => clearInterval(id); }, []);

    const period = useMemo(() => Math.round(2 * Math.PI * Math.sqrt(length / gravity) * 100) / 100, [length, gravity]);
    const freq = useMemo(() => period > 0 ? Math.round((1 / period) * 100) / 100 : 0, [period]);

    // Pendulum angle animation
    const omega = (2 * Math.PI) / (period * 30); // radians per tick
    const currentAngle = amplitude * Math.sin(tick * omega);
    const toRad = (d: number) => (d * Math.PI) / 180;

    // Pendulum geometry
    const pivotX = 150;
    const pivotY = 30;
    const stringLen = 60 + length * 50;
    const bobX = pivotX + Math.sin(toRad(currentAngle)) * stringLen;
    const bobY = pivotY + Math.cos(toRad(currentAngle)) * stringLen;

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (period >= 2) n.add('slow');
        if (period <= 1) n.add('fast');
        if (length >= 2) n.add('long');
        if (amplitude >= 40) n.add('wide');
        setCompleted(n);
    }, [period, length, amplitude]);

    const progress = Math.round((completed.size / 4) * 100);
    const canTakeQuiz = completed.size >= 3;

    // Trail positions
    const trailCount = 8;
    const trail = useMemo(() => {
        return Array.from({ length: trailCount }).map((_, i) => {
            const pastTick = tick - (i + 1) * 3;
            const pastAngle = amplitude * Math.sin(pastTick * omega);
            return {
                x: pivotX + Math.sin(toRad(pastAngle)) * stringLen,
                y: pivotY + Math.cos(toRad(pastAngle)) * stringLen,
            };
        });
    }, [tick, amplitude, omega, stringLen]);

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #2196F3, #0D47A1)' }}><span style={{ fontSize: 24 }}>🕐</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Simple Pendulum</div>
                        <div className="vl-card-subtitle">
                            T = 2π√(L/g) = <strong style={{ color: '#FFD600' }}>{period} s</strong> | f = <strong style={{ color: '#4CAF50' }}>{freq} Hz</strong>
                        </div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 220" role="img" aria-label="Pendulum SHM">
                                {/* Pivot */}
                                <rect x="130" y="20" width="40" height="10" rx="3" fill="#546E7A" />
                                <circle cx={pivotX} cy={pivotY} r="4" fill="#78909C" />

                                {/* Trail */}
                                {trail.map((pos, i) => (
                                    <circle key={i} cx={pos.x} cy={pos.y} r={8 - i * 0.8} fill="#42A5F5" opacity={0.15 - i * 0.015} />
                                ))}

                                {/* String */}
                                <line x1={pivotX} y1={pivotY} x2={bobX} y2={bobY}
                                    stroke="#90A4AE" strokeWidth="2" />

                                {/* Bob */}
                                <circle cx={bobX} cy={bobY} r="12" fill="#42A5F5" opacity="0.7" stroke="#1E88E5" strokeWidth="2" />
                                <circle cx={bobX} cy={bobY} r="6" fill="#1E88E5" opacity="0.5" />

                                {/* Equilibrium line (dashed) */}
                                <line x1={pivotX} y1={pivotY} x2={pivotX} y2={pivotY + stringLen + 15}
                                    stroke="#37474F" strokeWidth="1" strokeDasharray="3,3" />

                                {/* Angle arc */}
                                {Math.abs(currentAngle) > 2 && (
                                    <path
                                        d={`M ${pivotX} ${pivotY + 20} A 20 20 0 0 ${currentAngle > 0 ? 1 : 0} ${pivotX + Math.sin(toRad(currentAngle)) * 20} ${pivotY + Math.cos(toRad(currentAngle)) * 20}`}
                                        fill="none" stroke="#FFD600" strokeWidth="1.5" />
                                )}
                                <text x={pivotX + (currentAngle > 0 ? 10 : -25)} y={pivotY + 35} fill="#FFD600" fontSize="8">
                                    θ = {Math.abs(Math.round(currentAngle))}°
                                </text>

                                {/* Restoring force arrow */}
                                {Math.abs(currentAngle) > 5 && (
                                    <g>
                                        <line x1={bobX} y1={bobY - 15} x2={bobX - Math.sin(toRad(currentAngle)) * 15} y2={bobY - 15}
                                            stroke="#EF5350" strokeWidth="2" markerEnd="url(#arrSHM)" />
                                        <text x={bobX - Math.sin(toRad(currentAngle)) * 8} y={bobY - 20} fill="#EF5350" fontSize="7">F</text>
                                    </g>
                                )}
                                <defs><marker id="arrSHM" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#EF5350" /></marker></defs>

                                {/* Info */}
                                <text x="150" y="210" textAnchor="middle" fill="#90A4AE" fontSize="8">
                                    Period depends ONLY on length and gravity (not amplitude or mass)
                                </text>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">Length (L): {length.toFixed(1)} m
                            <input type="range" min={0.2} max={3.0} step={0.1} value={length} onChange={e => setLength(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Amplitude: {amplitude}°
                            <input type="range" min={5} max={50} step={5} value={amplitude} onChange={e => setAmplitude(+e.target.value)} className="vl-range" />
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
                            T = 2π√(L/g) = 2π√({length}/{gravity})<br />
                            T = <strong>{period} s</strong> | f = 1/T = <strong>{freq} Hz</strong>
                        </div>
                    </div>
                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'slow', text: 'Make period ≥ 2 s (slow swing)' },
                                { id: 'fast', text: 'Make period ≤ 1 s (fast swing)' },
                                { id: 'long', text: 'Use length ≥ 2.0 m' },
                                { id: 'wide', text: 'Set amplitude ≥ 40°' },
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
