import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Activity } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function BloodGlucoseLab({ simulation }: { simulation: SimulationMetadata }) {
    const [foodIntake, setFoodIntake] = useState(5);
    const [exerciseLevel, setExerciseLevel] = useState(3);
    const [insulinResponse, setInsulinResponse] = useState(7);
    const [quizOpen, setQuizOpen] = useState(false);

    const glucoseLevel = useMemo(() => {
        const base = 5.0;
        const foodEffect = foodIntake * 0.8;
        const exerciseEffect = exerciseLevel * 0.5;
        const insulinEffect = insulinResponse * 0.4;
        return Math.round((base + foodEffect - exerciseEffect - insulinEffect + 4) * 10) / 10;
    }, [foodIntake, exerciseLevel, insulinResponse]);

    const isHigh = glucoseLevel > 8;
    const isLow = glucoseLevel < 4;
    const isNormal = !isHigh && !isLow;

    const insulinActive = useMemo(() => glucoseLevel > 6, [glucoseLevel]);
    const glucagonActive = useMemo(() => glucoseLevel < 4.5, [glucoseLevel]);

    // Generate glucose history for graph
    const historyPoints = useMemo(() => {
        const pts: string[] = [];
        for (let t = 0; t <= 20; t++) {
            const food = foodIntake * Math.max(0, 1 - t * 0.05);
            const ex = exerciseLevel * Math.min(1, t * 0.1);
            const ins = insulinResponse * Math.min(1, t * 0.08);
            const g = Math.max(2, Math.min(14, 5 + food * 0.8 - ex * 0.5 - ins * 0.4 + 4));
            pts.push(`${40 + t * 11.5},${200 - (g / 14) * 160}`);
        }
        return pts.join(' ');
    }, [foodIntake, exerciseLevel, insulinResponse]);

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (isHigh) n.add('hyperglycemia');
        if (isLow) n.add('hypoglycemia');
        if (isNormal) n.add('normal');
        setCompleted(n);
    }, [isHigh, isLow, isNormal]);

    const progress = Math.round((completed.size / 3) * 100);
    const canTakeQuiz = completed.size >= 3;

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #E91E63, #880E4F)' }}><Activity size={28} /></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Blood Glucose Regulation</div>
                        <div className="vl-card-subtitle">
                            Current: <strong style={{ color: isHigh ? '#FF5252' : isLow ? '#42A5F5' : '#4CAF50' }}>{glucoseLevel} mmol/L</strong>
                            {' — '}
                            {isHigh ? '⚠️ Hyperglycemia → Insulin released by pancreas' : isLow ? '⚠️ Hypoglycemia → Glucagon released' : '✅ Normal range (4–8 mmol/L)'}
                        </div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 230" role="img" aria-label="Blood glucose graph">
                                {/* Axes */}
                                <line x1="40" y1="200" x2="280" y2="200" stroke="#546E7A" strokeWidth="1.5" />
                                <line x1="40" y1="200" x2="40" y2="30" stroke="#546E7A" strokeWidth="1.5" />
                                <text x="160" y="220" textAnchor="middle" fill="#90A4AE" fontSize="8">Time (hours after meal)</text>
                                <text x="12" y="120" textAnchor="middle" fill="#90A4AE" fontSize="8" transform="rotate(-90,12,120)">Glucose mmol/L</text>

                                {/* Normal range band */}
                                <rect x="40" y={200 - (8 / 14) * 160} width="240" height={(4 / 14) * 160} fill="#4CAF50" opacity="0.08" />
                                <line x1="40" y1={200 - (8 / 14) * 160} x2="280" y2={200 - (8 / 14) * 160} stroke="#4CAF50" strokeWidth="1" strokeDasharray="4,3" />
                                <line x1="40" y1={200 - (4 / 14) * 160} x2="280" y2={200 - (4 / 14) * 160} stroke="#4CAF50" strokeWidth="1" strokeDasharray="4,3" />
                                <text x="283" y={203 - (8 / 14) * 160} fill="#4CAF50" fontSize="7">8</text>
                                <text x="283" y={203 - (4 / 14) * 160} fill="#4CAF50" fontSize="7">4</text>

                                {/* Glucose curve */}
                                <polyline points={historyPoints} fill="none" stroke={isHigh ? '#FF5252' : isLow ? '#42A5F5' : '#FFD600'} strokeWidth="2.5" />

                                {/* Current dot */}
                                <circle cx="40" cy={200 - (glucoseLevel / 14) * 160} r="5" fill="#FFD600" stroke="#FFF" strokeWidth="1.5" />

                                {/* Hormone indicators */}
                                {insulinActive && (
                                    <g>
                                        <rect x="200" y="40" width="70" height="24" rx="6" fill="#E91E63" opacity="0.2" stroke="#E91E63" strokeWidth="1" />
                                        <text x="235" y="55" textAnchor="middle" fill="#E91E63" fontSize="9" fontWeight="bold">Insulin ↑</text>
                                    </g>
                                )}
                                {glucagonActive && (
                                    <g>
                                        <rect x="200" y="40" width="70" height="24" rx="6" fill="#FF9800" opacity="0.2" stroke="#FF9800" strokeWidth="1" />
                                        <text x="235" y="55" textAnchor="middle" fill="#FF9800" fontSize="9" fontWeight="bold">Glucagon ↑</text>
                                    </g>
                                )}

                                {/* Pancreas icon */}
                                <ellipse cx="60" cy="55" rx="20" ry="10" fill="#FFB74D" opacity="0.3" stroke="#FF9800" strokeWidth="1" />
                                <text x="60" y="58" textAnchor="middle" fill="#FF9800" fontSize="7" fontWeight="bold">Pancreas</text>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">Food intake: {foodIntake}
                            <input type="range" min={0} max={10} value={foodIntake} onChange={e => setFoodIntake(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Exercise level: {exerciseLevel}
                            <input type="range" min={0} max={10} value={exerciseLevel} onChange={e => setExerciseLevel(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Insulin response: {insulinResponse}
                            <input type="range" min={0} max={10} value={insulinResponse} onChange={e => setInsulinResponse(+e.target.value)} className="vl-range" />
                        </label>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'hyperglycemia', text: 'Trigger hyperglycemia (glucose > 8 mmol/L)' },
                                { id: 'hypoglycemia', text: 'Trigger hypoglycemia (glucose < 4 mmol/L)' },
                                { id: 'normal', text: 'Maintain normal range (4–8 mmol/L)' },
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
