import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function CircularMotionLab({ simulation }: { simulation: SimulationMetadata }) {
    const [radius, setRadius] = useState(50);
    const [speed, setSpeed] = useState(5);
    const [mass, setMass] = useState(2);
    const [quizOpen, setQuizOpen] = useState(false);
    const [tick, setTick] = useState(0);
    useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 30); return () => clearInterval(id); }, []);

    const centripetalForce = useMemo(() => Math.round((mass * speed * speed / (radius / 10)) * 100) / 100, [mass, speed, radius]);
    const period = useMemo(() => {
        const rMeters = radius / 10;
        return speed > 0 ? Math.round((2 * Math.PI * rMeters / speed) * 100) / 100 : Infinity;
    }, [radius, speed]);

    // Animated orbit
    const svgCx = 150;
    const svgCy = 110;
    const svgR = radius;
    const omega = speed / (radius / 10);
    const angle = tick * omega * 0.03;
    const objX = svgCx + Math.cos(angle) * svgR;
    const objY = svgCy + Math.sin(angle) * svgR;

    // Trail
    const trail = useMemo(() => {
        return Array.from({ length: 12 }).map((_, i) => {
            const pastAngle = angle - (i + 1) * omega * 0.03 * 2;
            return {
                x: svgCx + Math.cos(pastAngle) * svgR,
                y: svgCy + Math.sin(pastAngle) * svgR,
            };
        });
    }, [angle, svgR, omega]);

    // Velocity tangent (perpendicular to radius)
    const tangentDx = -Math.sin(angle) * speed * 6;
    const tangentDy = Math.cos(angle) * speed * 6;

    // Centripetal force (toward center)
    const forceScale = Math.min(40, centripetalForce / 2);
    const forceDx = (svgCx - objX) / Math.max(0.01, Math.sqrt((svgCx - objX) ** 2 + (svgCy - objY) ** 2)) * forceScale;
    const forceDy = (svgCy - objY) / Math.max(0.01, Math.sqrt((svgCx - objX) ** 2 + (svgCy - objY) ** 2)) * forceScale;

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (centripetalForce >= 50) n.add('big-f');
        if (speed >= 8) n.add('fast');
        if (radius >= 70) n.add('wide');
        if (period <= 3 && isFinite(period)) n.add('short-t');
        setCompleted(n);
    }, [centripetalForce, speed, radius, period]);

    const progress = Math.round((completed.size / 4) * 100);
    const canTakeQuiz = completed.size >= 3;

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #2196F3, #0D47A1)' }}><span style={{ fontSize: 24 }}>🌀</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Circular Motion</div>
                        <div className="vl-card-subtitle">
                            Fc = mv²/r = <strong style={{ color: '#FFD600' }}>{centripetalForce} N</strong> | T = <strong style={{ color: '#4CAF50' }}>{isFinite(period) ? `${period} s` : '∞'}</strong>
                        </div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 220" role="img" aria-label="Circular motion">
                                {/* Orbit circle */}
                                <circle cx={svgCx} cy={svgCy} r={svgR} fill="none" stroke="#37474F" strokeWidth="1.5" strokeDasharray="4,3" />

                                {/* Center */}
                                <circle cx={svgCx} cy={svgCy} r="4" fill="#78909C" opacity="0.6" />

                                {/* Trail */}
                                {trail.map((pos, i) => (
                                    <circle key={i} cx={pos.x} cy={pos.y} r={6 - i * 0.4} fill="#42A5F5" opacity={0.2 - i * 0.015} />
                                ))}

                                {/* Radius line */}
                                <line x1={svgCx} y1={svgCy} x2={objX} y2={objY} stroke="#546E7A" strokeWidth="1" strokeDasharray="3,2" />

                                {/* Object */}
                                <circle cx={objX} cy={objY} r={8 + mass} fill="#42A5F5" opacity="0.7" stroke="#1E88E5" strokeWidth="2" />
                                <text x={objX} y={objY + 3} textAnchor="middle" fill="#FFF" fontSize="7" fontWeight="bold">{mass}kg</text>

                                {/* Velocity tangent arrow */}
                                <line x1={objX} y1={objY} x2={objX + tangentDx} y2={objY + tangentDy}
                                    stroke="#4CAF50" strokeWidth="2" markerEnd="url(#arrCM1)" />
                                <text x={objX + tangentDx * 0.5 + 5} y={objY + tangentDy * 0.5 - 5} fill="#4CAF50" fontSize="7" fontWeight="bold">v</text>

                                {/* Centripetal force arrow (toward center) */}
                                <line x1={objX} y1={objY} x2={objX + forceDx} y2={objY + forceDy}
                                    stroke="#EF5350" strokeWidth="2.5" markerEnd="url(#arrCM2)" />
                                <text x={objX + forceDx * 0.5 - 5} y={objY + forceDy * 0.5 + 10} fill="#EF5350" fontSize="7" fontWeight="bold">Fc</text>

                                <defs>
                                    <marker id="arrCM1" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#4CAF50" /></marker>
                                    <marker id="arrCM2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#EF5350" /></marker>
                                </defs>

                                {/* Label */}
                                <text x="150" y="210" textAnchor="middle" fill="#90A4AE" fontSize="8">
                                    Centripetal force always points toward the centre
                                </text>

                                {/* Radius label */}
                                <text x={(svgCx + objX) / 2 + 5} y={(svgCy + objY) / 2 - 5} fill="#78909C" fontSize="7">r = {(radius / 10).toFixed(1)} m</text>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">Radius: {(radius / 10).toFixed(1)} m
                            <input type="range" min={20} max={90} step={5} value={radius} onChange={e => setRadius(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Speed: {speed} m/s
                            <input type="range" min={1} max={10} step={1} value={speed} onChange={e => setSpeed(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Mass: {mass} kg
                            <input type="range" min={1} max={10} step={1} value={mass} onChange={e => setMass(+e.target.value)} className="vl-range" />
                        </label>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Formula</div>
                        <div className="vl-explanation" style={{ fontSize: 12, fontFamily: 'monospace' }}>
                            Fc = mv²/r = {mass} × {speed}² / {(radius / 10).toFixed(1)}<br />
                            Fc = <strong>{centripetalForce} N</strong><br />
                            T = 2πr/v = <strong>{isFinite(period) ? `${period} s` : '∞'}</strong>
                        </div>
                    </div>
                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'big-f', text: 'Make centripetal force ≥ 50 N' },
                                { id: 'fast', text: 'Set speed ≥ 8 m/s' },
                                { id: 'wide', text: 'Use large radius (≥ 7 m)' },
                                { id: 'short-t', text: 'Make period ≤ 3 s' },
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
