import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, TrendingUp } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function PopulationGrowthLab({ simulation }: { simulation: SimulationMetadata }) {
    const [birthRate, setBirthRate] = useState(6);
    const [deathRate, setDeathRate] = useState(3);
    const [resources, setResources] = useState(7);
    const [quizOpen, setQuizOpen] = useState(false);

    const carryingCapacity = useMemo(() => resources * 12, [resources]);
    const growthRate = useMemo(() => (birthRate - deathRate) / 10, [birthRate, deathRate]);

    // Generate population curve points
    const points = useMemo(() => {
        const pts: { x: number; y: number }[] = [];
        let pop = 10;
        for (let t = 0; t <= 50; t++) {
            pts.push({ x: t, y: pop });
            const growth = growthRate * pop * (1 - pop / carryingCapacity);
            pop = Math.max(1, Math.min(carryingCapacity * 1.1, pop + growth));
        }
        return pts;
    }, [growthRate, carryingCapacity]);

    const maxPop = Math.max(...points.map(p => p.y), carryingCapacity);
    const toSvg = (p: { x: number; y: number }) => ({
        x: 40 + (p.x / 50) * 240,
        y: 240 - (p.y / maxPop) * 200,
    });

    const pathD = points.map((p, i) => {
        const s = toSvg(p);
        return `${i === 0 ? 'M' : 'L'}${s.x},${s.y}`;
    }).join(' ');

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const next = new Set(completed);
        const finalPop = points[points.length - 1].y;
        if (growthRate > 0 && finalPop >= carryingCapacity * 0.8) next.add('reach-k');
        if (growthRate <= 0) next.add('decline');
        if (resources >= 9) next.add('high-res');
        setCompleted(next);
    }, [birthRate, deathRate, resources]);

    const progress = Math.round((completed.size / 3) * 100);
    const canTakeQuiz = completed.size >= 3;

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #26A69A, #00695C)' }}><TrendingUp size={28} /></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Population Growth Curve</div>
                        <div className="vl-card-subtitle">Observe S-shaped (logistic) growth and carrying capacity (K = {carryingCapacity})</div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 260" role="img" aria-label="Population growth graph">
                                {/* Axes */}
                                <line x1="40" y1="240" x2="290" y2="240" stroke="#546E7A" strokeWidth="1.5" />
                                <line x1="40" y1="240" x2="40" y2="30" stroke="#546E7A" strokeWidth="1.5" />
                                <text x="165" y="256" textAnchor="middle" fill="#90A4AE" fontSize="9">Time (generations)</text>
                                <text x="12" y="140" textAnchor="middle" fill="#90A4AE" fontSize="9" transform="rotate(-90,12,140)">Population</text>

                                {/* Grid lines */}
                                {[0.25, 0.5, 0.75, 1].map(f => (
                                    <line key={f} x1="40" y1={240 - f * 200} x2="290" y2={240 - f * 200} stroke="#37474F" strokeWidth="0.5" strokeDasharray="3,3" />
                                ))}

                                {/* Carrying capacity line */}
                                <line x1="40" y1={240 - (carryingCapacity / maxPop) * 200} x2="290" y2={240 - (carryingCapacity / maxPop) * 200}
                                    stroke="#FF9800" strokeWidth="1.5" strokeDasharray="6,3" />
                                <text x="292" y={238 - (carryingCapacity / maxPop) * 200} fill="#FF9800" fontSize="9" fontWeight="bold">K</text>

                                {/* Population curve */}
                                <path d={pathD} fill="none" stroke="#4CAF50" strokeWidth="2.5" />

                                {/* Final population dot */}
                                {(() => { const last = toSvg(points[points.length - 1]); return <circle cx={last.x} cy={last.y} r="4" fill="#FFD600" />; })()}

                                {/* Axis labels */}
                                <text x="42" y="238" fill="#78909C" fontSize="7">0</text>
                                <text x="280" y="252" fill="#78909C" fontSize="7">50</text>
                                <text x="18" y={244 - (carryingCapacity / maxPop) * 200} fill="#FF9800" fontSize="7">{carryingCapacity}</text>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">Birth rate: {birthRate}
                            <input type="range" min={0} max={10} value={birthRate} onChange={e => setBirthRate(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Death rate: {deathRate}
                            <input type="range" min={0} max={10} value={deathRate} onChange={e => setDeathRate(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Resources: {resources}
                            <input type="range" min={1} max={10} value={resources} onChange={e => setResources(+e.target.value)} className="vl-range" />
                        </label>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Stats</div>
                        <div className="vl-meta">
                            <span className="vl-meta-item">Growth rate: {(growthRate * 100).toFixed(0)}%</span>
                            <span className="vl-meta-item">Carrying capacity: {carryingCapacity}</span>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'reach-k', text: 'Reach carrying capacity (population stabilizes at K)' },
                                { id: 'decline', text: 'Make population decline (death ≥ birth)' },
                                { id: 'high-res', text: 'Set resources ≥ 9 to increase K' },
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
                        <div className="vl-card-subtitle">{canTakeQuiz ? 'Ready!' : 'Complete all 3 tasks to unlock.'}</div>
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
