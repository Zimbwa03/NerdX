import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

interface Stage { id: string; name: string; day: number; description: string; emoji: string; }

const MENSTRUAL_CYCLE: Stage[] = [
    { id: 'menstruation', name: 'Menstruation', day: 1, description: 'Uterine lining sheds. Low estrogen & progesterone.', emoji: '🔴' },
    { id: 'follicular', name: 'Follicular Phase', day: 5, description: 'FSH stimulates follicle growth. Estrogen rises, thickening uterine lining.', emoji: '🟡' },
    { id: 'ovulation', name: 'Ovulation', day: 14, description: 'LH surge causes mature egg release from ovary. Peak fertility.', emoji: '🥚' },
    { id: 'luteal', name: 'Luteal Phase', day: 16, description: 'Corpus luteum produces progesterone. Uterine lining maintained.', emoji: '🟠' },
    { id: 'premenstrual', name: 'Pre-menstrual', day: 25, description: 'If no fertilisation, corpus luteum degrades. Progesterone drops. Cycle restarts.', emoji: '🔵' },
];

export function HumanReproductionLab({ simulation }: { simulation: SimulationMetadata }) {
    const [day, setDay] = useState(1);
    const [quizOpen, setQuizOpen] = useState(false);

    const currentStage = useMemo(() => {
        for (let i = MENSTRUAL_CYCLE.length - 1; i >= 0; i--) {
            if (day >= MENSTRUAL_CYCLE[i].day) return MENSTRUAL_CYCLE[i];
        }
        return MENSTRUAL_CYCLE[0];
    }, [day]);

    // Hormone levels
    const estrogen = useMemo(() => {
        if (day <= 5) return 10;
        if (day <= 14) return 10 + ((day - 5) / 9) * 80;
        if (day <= 20) return 90 - ((day - 14) / 6) * 40;
        return 50 - ((day - 20) / 8) * 30;
    }, [day]);

    const progesterone = useMemo(() => {
        if (day <= 14) return 5;
        if (day <= 21) return 5 + ((day - 14) / 7) * 85;
        return 90 - ((day - 21) / 7) * 70;
    }, [day]);

    const lh = useMemo(() => {
        if (day >= 12 && day <= 15) return 20 + Math.max(0, 80 - Math.abs(day - 13.5) * 40);
        return 10;
    }, [day]);

    const fsh = useMemo(() => {
        if (day <= 5) return 50;
        if (day <= 10) return 50 - ((day - 5) / 5) * 30;
        return 20;
    }, [day]);

    const liningThickness = useMemo(() => {
        if (day <= 5) return 20;
        if (day <= 14) return 20 + ((day - 5) / 9) * 60;
        if (day <= 25) return 80;
        return 80 - ((day - 25) / 3) * 60;
    }, [day]);

    const [visited, setVisited] = useState<Set<string>>(new Set());
    useEffect(() => {
        setVisited(prev => new Set(prev).add(currentStage.id));
    }, [currentStage]);

    const progress = Math.round((visited.size / MENSTRUAL_CYCLE.length) * 100);
    const canTakeQuiz = visited.size >= 4;

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #EC407A, #AD1457)' }}><span style={{ fontSize: 24 }}>🧬</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Menstrual Cycle — Day {day}</div>
                        <div className="vl-card-subtitle">{currentStage.emoji} {currentStage.name}: {currentStage.description}</div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 240" role="img" aria-label="Menstrual cycle hormone levels">
                                {/* Axes */}
                                <line x1="40" y1="200" x2="280" y2="200" stroke="#546E7A" strokeWidth="1.5" />
                                <line x1="40" y1="200" x2="40" y2="20" stroke="#546E7A" strokeWidth="1.5" />
                                <text x="160" y="218" textAnchor="middle" fill="#90A4AE" fontSize="8">Day of cycle</text>
                                <text x="12" y="110" textAnchor="middle" fill="#90A4AE" fontSize="8" transform="rotate(-90,12,110)">Hormone level</text>

                                {/* Day markers */}
                                {[1, 7, 14, 21, 28].map(d => (
                                    <g key={d}>
                                        <line x1={40 + ((d - 1) / 27) * 240} y1="200" x2={40 + ((d - 1) / 27) * 240} y2="203" stroke="#78909C" strokeWidth="1" />
                                        <text x={40 + ((d - 1) / 27) * 240} y="212" textAnchor="middle" fill="#78909C" fontSize="7">{d}</text>
                                    </g>
                                ))}

                                {/* Phase bands */}
                                <rect x="40" y="20" width={((4) / 27) * 240} height="180" fill="#EF5350" opacity="0.06" />
                                <rect x={40 + (4 / 27) * 240} y="20" width={((9) / 27) * 240} height="180" fill="#FFD600" opacity="0.06" />
                                <rect x={40 + (13 / 27) * 240} y="20" width={((1) / 27) * 240} height="180" fill="#4CAF50" opacity="0.08" />
                                <rect x={40 + (14 / 27) * 240} y="20" width={((13) / 27) * 240} height="180" fill="#FF9800" opacity="0.06" />

                                {/* Estrogen curve */}
                                <polyline fill="none" stroke="#E91E63" strokeWidth="2"
                                    points={Array.from({ length: 28 }, (_, i) => {
                                        const d = i + 1;
                                        let e = 10;
                                        if (d > 5 && d <= 14) e = 10 + ((d - 5) / 9) * 80;
                                        else if (d > 14 && d <= 20) e = 90 - ((d - 14) / 6) * 40;
                                        else if (d > 20) e = 50 - ((d - 20) / 8) * 30;
                                        return `${40 + (i / 27) * 240},${200 - (e / 100) * 170}`;
                                    }).join(' ')} />

                                {/* Progesterone curve */}
                                <polyline fill="none" stroke="#FF9800" strokeWidth="2"
                                    points={Array.from({ length: 28 }, (_, i) => {
                                        const d = i + 1;
                                        let p = 5;
                                        if (d > 14 && d <= 21) p = 5 + ((d - 14) / 7) * 85;
                                        else if (d > 21) p = 90 - ((d - 21) / 7) * 70;
                                        return `${40 + (i / 27) * 240},${200 - (p / 100) * 170}`;
                                    }).join(' ')} />

                                {/* LH spike */}
                                <polyline fill="none" stroke="#4CAF50" strokeWidth="1.5" strokeDasharray="4,2"
                                    points={Array.from({ length: 28 }, (_, i) => {
                                        const d = i + 1;
                                        let l = 10;
                                        if (d >= 12 && d <= 15) l = 20 + Math.max(0, 80 - Math.abs(d - 13.5) * 40);
                                        return `${40 + (i / 27) * 240},${200 - (l / 100) * 170}`;
                                    }).join(' ')} />

                                {/* Uterine lining */}
                                <rect x="40" y={200 - (liningThickness / 100) * 30} width="240" height={(liningThickness / 100) * 30} fill="#FFCDD2" opacity="0.4" />

                                {/* Current day indicator */}
                                <line x1={40 + ((day - 1) / 27) * 240} y1="20" x2={40 + ((day - 1) / 27) * 240} y2="200"
                                    stroke="#FFD600" strokeWidth="2" strokeDasharray="4,2" />
                                <circle cx={40 + ((day - 1) / 27) * 240} cy="16" r="4" fill="#FFD600" />

                                {/* Legend */}
                                <circle cx="60" cy="230" r="3" fill="#E91E63" /><text x="68" y="233" fill="#E91E63" fontSize="7">Estrogen</text>
                                <circle cx="120" cy="230" r="3" fill="#FF9800" /><text x="128" y="233" fill="#FF9800" fontSize="7">Progesterone</text>
                                <circle cx="195" cy="230" r="3" fill="#4CAF50" /><text x="203" y="233" fill="#4CAF50" fontSize="7">LH</text>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Day Selector</div>
                        <label className="vl-slider-label">Day {day} of 28
                            <input type="range" min={1} max={28} value={day} onChange={e => setDay(+e.target.value)} className="vl-range" />
                        </label>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Hormone Levels</div>
                        <div className="vl-meta">
                            <span className="vl-meta-item" style={{ color: '#E91E63' }}>Estrogen: {Math.round(estrogen)}%</span>
                            <span className="vl-meta-item" style={{ color: '#FF9800' }}>Progesterone: {Math.round(progesterone)}%</span>
                        </div>
                        <div className="vl-meta">
                            <span className="vl-meta-item" style={{ color: '#4CAF50' }}>LH: {Math.round(lh)}%</span>
                            <span className="vl-meta-item" style={{ color: '#2196F3' }}>FSH: {Math.round(fsh)}%</span>
                        </div>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Stages Explored</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {MENSTRUAL_CYCLE.map(s => (
                                <button key={s.id} type="button" className={`vl-check ${visited.has(s.id) ? 'done' : ''}`} onClick={() => setDay(s.day)}>
                                    <span className="vl-check-dot" /><span className="vl-check-text">{s.emoji} {s.name} (Day {s.day})</span>
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
                        <div className="vl-card-subtitle">{canTakeQuiz ? 'Ready!' : 'Explore at least 4 stages.'}</div>
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
