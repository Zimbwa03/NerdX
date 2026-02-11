import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Thermometer } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function ThermoregulationLab({ simulation }: { simulation: SimulationMetadata }) {
    const [envTemp, setEnvTemp] = useState(20);
    const [exercise, setExercise] = useState(0);
    const [quizOpen, setQuizOpen] = useState(false);
    const [tick, setTick] = useState(0);

    useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 100); return () => clearInterval(id); }, []);

    const bodyTemp = useMemo(() => {
        const base = 37;
        const envEffect = (envTemp - 20) * 0.05;
        const exEffect = exercise * 0.08;
        return Math.round((base + envEffect + exEffect) * 10) / 10;
    }, [envTemp, exercise]);

    const isHot = bodyTemp > 37.5;
    const isCold = bodyTemp < 36.5;
    const vesselWidth = useMemo(() => isHot ? 8 : isCold ? 2 : 4, [isHot, isCold]);
    const sweating = isHot;
    const shivering = isCold;

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (isHot) n.add('vasodilation');
        if (isCold) n.add('vasoconstriction');
        if (bodyTemp >= 36.5 && bodyTemp <= 37.5) n.add('homeostasis');
        setCompleted(n);
    }, [bodyTemp, isHot, isCold]);

    const progress = Math.round((completed.size / 3) * 100);
    const canTakeQuiz = completed.size >= 3;

    const skinColor = useMemo(() => {
        if (isHot) return '#EF9A9A';
        if (isCold) return '#90CAF9';
        return '#FFCCBC';
    }, [isHot, isCold]);

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #EF5350, #B71C1C)' }}><Thermometer size={28} /></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Body Temperature Regulation</div>
                        <div className="vl-card-subtitle">
                            Core temp: <strong style={{ color: isHot ? '#FF5252' : isCold ? '#42A5F5' : '#4CAF50' }}>{bodyTemp}°C</strong>
                            {' — '}
                            {isHot ? '🔥 Too hot → vasodilation + sweating' : isCold ? '🥶 Too cold → vasoconstriction + shivering' : '✅ Normal homeostasis'}
                        </div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 280 280" role="img" aria-label="Thermoregulation diagram">
                                {/* Body outline */}
                                <ellipse cx="140" cy="60" rx="30" ry="35" fill={skinColor} opacity="0.4" stroke="#795548" strokeWidth="1.5" />
                                <rect x="110" y="90" width="60" height="100" rx="12" fill={skinColor} opacity="0.3" stroke="#795548" strokeWidth="1.5" />
                                {/* Arms */}
                                <rect x="70" y="95" width="40" height="14" rx="7" fill={skinColor} opacity="0.3" stroke="#795548" strokeWidth="1" />
                                <rect x="170" y="95" width="40" height="14" rx="7" fill={skinColor} opacity="0.3" stroke="#795548" strokeWidth="1" />
                                {/* Legs */}
                                <rect x="115" y="188" width="22" height="50" rx="8" fill={skinColor} opacity="0.3" stroke="#795548" strokeWidth="1" />
                                <rect x="143" y="188" width="22" height="50" rx="8" fill={skinColor} opacity="0.3" stroke="#795548" strokeWidth="1" />

                                {/* Skin blood vessels */}
                                <text x="220" y="130" fill="#B0BEC5" fontSize="8">Skin vessels:</text>
                                {[0, 1, 2].map(i => (
                                    <line key={i} x1="225" y1={138 + i * 12} x2="265" y2={138 + i * 12}
                                        stroke={isHot ? '#EF5350' : '#42A5F5'} strokeWidth={vesselWidth} strokeLinecap="round" opacity="0.6" />
                                ))}
                                <text x="220" y={180} fill={isHot ? '#EF5350' : '#42A5F5'} fontSize="8" fontWeight="bold">
                                    {isHot ? 'Vasodilation' : isCold ? 'Vasoconstriction' : 'Normal'}
                                </text>

                                {/* Sweat droplets */}
                                {sweating && [0, 1, 2, 3, 4].map(i => {
                                    const phase = (tick * 0.03 + i * 0.2) % 1;
                                    return (
                                        <circle key={`sweat-${i}`} cx={115 + i * 15} cy={60 - 35 - phase * 20} r="2.5" fill="#29B6F6" opacity={1 - phase}>
                                        </circle>
                                    );
                                })}
                                {sweating && <text x="140" y="16" textAnchor="middle" fill="#29B6F6" fontSize="9" fontWeight="bold">💧 Sweating</text>}

                                {/* Shivering indicator */}
                                {shivering && (
                                    <g>
                                        <text x="140" y="260" textAnchor="middle" fill="#42A5F5" fontSize="9" fontWeight="bold">
                                            ❄️ Shivering (muscle contractions)
                                        </text>
                                        {/* Shiver lines */}
                                        {[0, 1, 2].map(i => (
                                            <line key={`sh-${i}`} x1={120 + Math.sin(tick * 0.15 + i) * 5} y1={100 + i * 30}
                                                x2={160 + Math.sin(tick * 0.15 + i + 1) * 5} y2={100 + i * 30}
                                                stroke="#42A5F5" strokeWidth="1" opacity="0.5" />
                                        ))}
                                    </g>
                                )}

                                {/* Hypothalamus label */}
                                <circle cx="140" cy="50" r="8" fill="#FFD600" opacity="0.6" />
                                <text x="140" y="53" textAnchor="middle" fill="#333" fontSize="6" fontWeight="bold">H</text>
                                <text x="50" y="55" fill="#FFD600" fontSize="7">Hypothalamus →</text>

                                {/* Temperature gauge */}
                                <rect x="20" y="100" width="12" height="120" rx="6" fill="#263238" opacity="0.3" />
                                <rect x="22" y={220 - Math.min(116, Math.max(4, (bodyTemp - 34) * 116 / 6))} width="8"
                                    rx="4" height={Math.min(116, Math.max(4, (bodyTemp - 34) * 116 / 6))}
                                    fill={isHot ? '#FF5252' : isCold ? '#42A5F5' : '#4CAF50'} />
                                <text x="26" y="96" textAnchor="middle" fill="#B0BEC5" fontSize="7">°C</text>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">Environment temperature: {envTemp}°C
                            <input type="range" min={-5} max={45} value={envTemp} onChange={e => setEnvTemp(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Exercise level: {exercise}
                            <input type="range" min={0} max={10} value={exercise} onChange={e => setExercise(+e.target.value)} className="vl-range" />
                        </label>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'vasodilation', text: 'Trigger vasodilation (body temp > 37.5°C)' },
                                { id: 'vasoconstriction', text: 'Trigger vasoconstriction (body temp < 36.5°C)' },
                                { id: 'homeostasis', text: 'Maintain homeostasis (36.5–37.5°C)' },
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
                        <div className="vl-card-title">Knowledge Check</div>
                        <div className="vl-card-subtitle">{canTakeQuiz ? 'Ready!' : 'Complete all 3 tasks.'}</div>
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
