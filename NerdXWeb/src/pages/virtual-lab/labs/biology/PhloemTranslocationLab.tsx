import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function PhloemTranslocationLab({ simulation }: { simulation: SimulationMetadata }) {
    const [sugarProduction, setSugarProduction] = useState(60);
    const [sinkDemand, setSinkDemand] = useState(50);
    const [quizOpen, setQuizOpen] = useState(false);
    const [tick, setTick] = useState(0);

    useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 90); return () => clearInterval(id); }, []);

    const flowRate = useMemo(() => Math.round(Math.min(sugarProduction, sinkDemand) * 0.9), [sugarProduction, sinkDemand]);

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (flowRate >= 50) n.add('good-flow');
        if (sugarProduction >= 80 && sinkDemand <= 20) n.add('source-excess');
        if (sinkDemand >= 80) n.add('high-demand');
        setCompleted(n);
    }, [flowRate, sugarProduction, sinkDemand]);

    const progress = Math.round((completed.size / 3) * 100);
    const canTakeQuiz = completed.size >= 3;

    const sucroseParticles = useMemo(() => {
        const arr: { x: number; y: number }[] = [];
        const count = Math.max(2, Math.floor(flowRate / 6));
        for (let i = 0; i < count; i++) {
            const phase = (tick * 0.018 + i * 0.12) % 1;
            arr.push({ x: 180 + Math.sin(i * 2.3) * 6, y: 50 + phase * 170 });
        }
        return arr;
    }, [tick, flowRate]);

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #AB47BC, #6A1B9A)' }}><span style={{ fontSize: 24 }}>🍯</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Phloem vs Xylem — Side by Side</div>
                        <div className="vl-card-subtitle">Sucrose flows from source (leaf) → sink (root/fruit) via phloem</div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 260" role="img" aria-label="Phloem translocation">
                                {/* Source (Leaf) at top */}
                                <ellipse cx="150" cy="30" rx="80" ry="22" fill="#66BB6A" opacity="0.25" stroke="#4CAF50" strokeWidth="1.5" />
                                <text x="150" y="35" textAnchor="middle" fill="#81C784" fontSize="10" fontWeight="bold">Source (leaf)</text>

                                {/* Sink (Root/Fruit) at bottom */}
                                <ellipse cx="150" cy="240" rx="70" ry="18" fill="#8D6E63" opacity="0.25" stroke="#795548" strokeWidth="1.5" />
                                <text x="150" y="244" textAnchor="middle" fill="#A1887F" fontSize="10" fontWeight="bold">Sink (root/fruit)</text>

                                {/* Xylem vessel (left) — water going UP */}
                                <rect x="90" y="55" width="18" height="175" rx="4" fill="#1B5E20" opacity="0.12" stroke="#4CAF50" strokeWidth="1.5" />
                                <text x="99" y="148" textAnchor="middle" fill="#66BB6A" fontSize="7" fontWeight="bold" transform="rotate(-90,99,148)">XYLEM (H₂O ↑)</text>
                                {/* Water particles going up */}
                                {[0, 1, 2, 3].map(i => {
                                    const phase = (tick * 0.02 + i * 0.25) % 1;
                                    return <circle key={i} cx={99} cy={225 - phase * 165} r="2.5" fill="#29B6F6" opacity="0.6" />;
                                })}

                                {/* Phloem vessel (right) — sucrose going DOWN */}
                                <rect x="172" y="55" width="18" height="175" rx="4" fill="#6A1B9A" opacity="0.12" stroke="#AB47BC" strokeWidth="1.5" />
                                <text x="181" y="148" textAnchor="middle" fill="#CE93D8" fontSize="7" fontWeight="bold" transform="rotate(-90,181,148)">PHLOEM (sucrose ↓)</text>
                                {/* Sucrose particles going down */}
                                {sucroseParticles.map((p, i) => (
                                    <circle key={i} cx={p.x} cy={p.y} r="3" fill="#FFD600" opacity="0.7">
                                        <animate attributeName="opacity" values="0.8;0.5;0.8" dur="1.2s" repeatCount="indefinite" begin={`${i * 0.1}s`} />
                                    </circle>
                                ))}

                                {/* Companion cells */}
                                {[80, 140, 200].map(y => (
                                    <circle key={y} cx="195" cy={y} r="4" fill="#CE93D8" opacity="0.4" />
                                ))}

                                {/* Flow rate */}
                                <text x="150" y="258" textAnchor="middle" fill="#FFD600" fontSize="11" fontWeight="bold">Translocation rate: {flowRate}%</text>

                                {/* Comparison table labels */}
                                <text x="50" y="75" fill="#4FC3F7" fontSize="8">Water ↑</text>
                                <text x="210" y="75" fill="#FFD600" fontSize="8">Sucrose ↓</text>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">Sugar production (source): {sugarProduction}%
                            <input type="range" min={5} max={100} value={sugarProduction} onChange={e => setSugarProduction(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Sink demand: {sinkDemand}%
                            <input type="range" min={5} max={100} value={sinkDemand} onChange={e => setSinkDemand(+e.target.value)} className="vl-range" />
                        </label>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'good-flow', text: 'Achieve translocation rate ≥ 50%' },
                                { id: 'source-excess', text: 'Set production ≥ 80% with demand ≤ 20% (excess at source)' },
                                { id: 'high-demand', text: 'Set sink demand ≥ 80%' },
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
