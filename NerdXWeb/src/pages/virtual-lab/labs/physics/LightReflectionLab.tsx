import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function LightReflectionLab({ simulation }: { simulation: SimulationMetadata }) {
    const [angle, setAngle] = useState(30);
    const [quizOpen, setQuizOpen] = useState(false);
    const [tick, setTick] = useState(0);
    useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 60); return () => clearInterval(id); }, []);

    const mirrorY = 180;
    const mirrorX = 150;
    const toRad = (deg: number) => (deg * Math.PI) / 180;

    // Incident ray: comes from upper-left to mirror center
    const incidentLen = 100;
    const incX = mirrorX - Math.sin(toRad(angle)) * incidentLen;
    const incY = mirrorY - Math.cos(toRad(angle)) * incidentLen;

    // Reflected ray: goes to upper-right
    const refX = mirrorX + Math.sin(toRad(angle)) * incidentLen;
    const refY = mirrorY - Math.cos(toRad(angle)) * incidentLen;

    // Animated light particle along incident ray
    const phase = (tick * 0.03) % 2;
    const particleOnIncident = phase < 1;
    const t = phase < 1 ? phase : phase - 1;
    const particleX = particleOnIncident
        ? incX + (mirrorX - incX) * t
        : mirrorX + (refX - mirrorX) * t;
    const particleY = particleOnIncident
        ? incY + (mirrorY - incY) * t
        : mirrorY + (refY - mirrorY) * t;

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (angle >= 50) n.add('high-angle');
        if (angle <= 20) n.add('low-angle');
        n.add('equal'); // angles are always equal
        setCompleted(n);
    }, [angle]);

    const progress = Math.round((completed.size / 3) * 100);
    const canTakeQuiz = completed.size >= 3;

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #2196F3, #0D47A1)' }}><span style={{ fontSize: 24 }}>🔦</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Law of Reflection: θᵢ = θᵣ</div>
                        <div className="vl-card-subtitle">
                            Angle of incidence = <strong style={{ color: '#FFD600' }}>{angle}°</strong> | Angle of reflection = <strong style={{ color: '#4CAF50' }}>{angle}°</strong>
                        </div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 240" role="img" aria-label="Reflection ray diagram">
                                {/* Mirror */}
                                <rect x="70" y={mirrorY} width="160" height="8" rx="2" fill="#78909C" opacity="0.7" />
                                <rect x="70" y={mirrorY} width="160" height="3" fill="#B0BEC5" opacity="0.5" />

                                {/* Normal line (dashed) */}
                                <line x1={mirrorX} y1={mirrorY - 120} x2={mirrorX} y2={mirrorY}
                                    stroke="#90A4AE" strokeWidth="1.5" strokeDasharray="5,3" />
                                <text x={mirrorX + 5} y={mirrorY - 110} fill="#90A4AE" fontSize="8">Normal</text>

                                {/* Incident ray */}
                                <line x1={incX} y1={incY} x2={mirrorX} y2={mirrorY}
                                    stroke="#FFD600" strokeWidth="2.5" />
                                <text x={incX - 5} y={incY + 5} fill="#FFD600" fontSize="8" fontWeight="bold">Incident</text>

                                {/* Reflected ray */}
                                <line x1={mirrorX} y1={mirrorY} x2={refX} y2={refY}
                                    stroke="#4CAF50" strokeWidth="2.5" />
                                <text x={refX + 5} y={refY + 5} fill="#4CAF50" fontSize="8" fontWeight="bold">Reflected</text>

                                {/* Angle arcs */}
                                <path d={`M ${mirrorX} ${mirrorY - 30} A 30 30 0 0 0 ${mirrorX - Math.sin(toRad(angle)) * 30} ${mirrorY - Math.cos(toRad(angle)) * 30}`}
                                    fill="none" stroke="#FFD600" strokeWidth="1.5" />
                                <text x={mirrorX - 20} y={mirrorY - 35} fill="#FFD600" fontSize="9" fontWeight="bold">θᵢ={angle}°</text>

                                <path d={`M ${mirrorX} ${mirrorY - 30} A 30 30 0 0 1 ${mirrorX + Math.sin(toRad(angle)) * 30} ${mirrorY - Math.cos(toRad(angle)) * 30}`}
                                    fill="none" stroke="#4CAF50" strokeWidth="1.5" />
                                <text x={mirrorX + 10} y={mirrorY - 35} fill="#4CAF50" fontSize="9" fontWeight="bold">θᵣ={angle}°</text>

                                {/* Animated light particle */}
                                <circle cx={particleX} cy={particleY} r="5"
                                    fill={particleOnIncident ? '#FFD600' : '#4CAF50'} opacity="0.9" />
                                <circle cx={particleX} cy={particleY} r="8"
                                    fill={particleOnIncident ? '#FFD600' : '#4CAF50'} opacity="0.3" />

                                {/* Mirror label */}
                                <text x={mirrorX} y={mirrorY + 20} textAnchor="middle" fill="#78909C" fontSize="9">Plane Mirror</text>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">Angle of incidence (θᵢ): {angle}°
                            <input type="range" min={0} max={80} step={5} value={angle} onChange={e => setAngle(+e.target.value)} className="vl-range" />
                        </label>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Key Concepts</div>
                        <div className="vl-explanation" style={{ fontSize: 12 }}>
                            • The <strong>normal</strong> is perpendicular to the mirror surface<br />
                            • Angle of incidence (θᵢ) = Angle of reflection (θᵣ) <strong>always</strong><br />
                            • The image in a plane mirror is virtual, upright, laterally inverted, and same size
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'high-angle', text: 'Set incidence ≥ 50°' },
                                { id: 'low-angle', text: 'Set incidence ≤ 20°' },
                                { id: 'equal', text: 'Confirm θᵢ = θᵣ (always true!)' },
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
