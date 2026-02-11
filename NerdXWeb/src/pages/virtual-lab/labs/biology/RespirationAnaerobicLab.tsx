import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Zap } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

type Organism = 'muscle' | 'yeast';

export function RespirationAnaerobicLab({ simulation }: { simulation: SimulationMetadata }) {
    const [organism, setOrganism] = useState<Organism>('muscle');
    const [intensity, setIntensity] = useState(50);
    const [duration, setDuration] = useState(30);
    const [quizOpen, setQuizOpen] = useState(false);
    const [tick, setTick] = useState(0);

    useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 80); return () => clearInterval(id); }, []);

    const lacticAcid = useMemo(() => organism === 'muscle' ? Math.round((intensity / 100) * (duration / 60) * 10 * 10) / 10 : 0, [organism, intensity, duration]);
    const ethanol = useMemo(() => organism === 'yeast' ? Math.round((intensity / 100) * (duration / 60) * 8 * 10) / 10 : 0, [organism, intensity, duration]);
    const co2 = useMemo(() => organism === 'yeast' ? Math.round(ethanol * 0.8 * 10) / 10 : Math.round(lacticAcid * 0.3 * 10) / 10, [organism, ethanol, lacticAcid]);
    const atpYield = 2; // Anaerobic always 2

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    const checkTask = useCallback(() => {
        const next = new Set(completed);
        if (organism === 'muscle' && lacticAcid >= 5) next.add('lactic');
        if (organism === 'yeast' && ethanol >= 4) next.add('ethanol');
        if (intensity >= 90) next.add('high-effort');
        setCompleted(next);
    }, [organism, lacticAcid, ethanol, intensity, completed]);
    useEffect(() => { checkTask(); }, [organism, intensity, duration]);

    const progress = Math.round((completed.size / 3) * 100);
    const canTakeQuiz = completed.size >= 3;

    const bubbleCount = Math.max(2, Math.floor(co2 * 2));

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #7B1FA2, #4A148C)' }}><Zap size={28} /></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Anaerobic Respiration — {organism === 'muscle' ? 'Human Muscle' : 'Yeast (Fermentation)'}</div>
                        <div className="vl-card-subtitle">
                            {organism === 'muscle' ? 'Glucose → Lactic acid (+ 2 ATP)' : 'Glucose → Ethanol + CO₂ (+ 2 ATP)'}
                        </div>

                        <div className="vl-row">
                            <div className="vl-tab-row" role="tablist" aria-label="Organism">
                                {(['muscle', 'yeast'] as Organism[]).map(o => (
                                    <button key={o} type="button" className={`vl-tab ${organism === o ? 'active' : ''}`} onClick={() => setOrganism(o)}>
                                        {o === 'muscle' ? '💪 Muscle' : '🍞 Yeast'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 320 280" role="img" aria-label="Anaerobic respiration diagram">
                                {organism === 'muscle' ? (
                                    <>
                                        {/* Muscle fiber */}
                                        <rect x="40" y="60" width="240" height="160" rx="30" fill="#E91E63" opacity="0.18" stroke="#E91E63" strokeWidth="2" />
                                        <text x="160" y="55" textAnchor="middle" fill="#F48FB1" fontSize="11" fontWeight="bold">Muscle Cell</text>
                                        {/* Striations */}
                                        {[0, 1, 2, 3, 4, 5, 6].map(i => (
                                            <line key={i} x1={70 + i * 30} y1="80" x2={70 + i * 30} y2="200" stroke="#F48FB1" strokeWidth="1" opacity="0.3" />
                                        ))}
                                        {/* Lactic acid accumulation */}
                                        {Array.from({ length: Math.min(15, Math.floor(lacticAcid * 1.5)) }).map((_, i) => {
                                            const phase = (tick * 0.02 + i * 0.5) % 1;
                                            return (
                                                <circle key={i} cx={80 + (i % 5) * 40 + Math.sin(tick * 0.04 + i) * 6}
                                                    cy={100 + Math.floor(i / 5) * 35 + phase * 10}
                                                    r={5} fill="#FF5252" opacity={0.7}>
                                                    <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite" begin={`${i * 0.15}s`} />
                                                </circle>
                                            );
                                        })}
                                        <text x="160" y="240" textAnchor="middle" fill="#FF5252" fontSize="12" fontWeight="bold">Lactic acid: {lacticAcid}</text>
                                    </>
                                ) : (
                                    <>
                                        {/* Yeast cell / flask */}
                                        <ellipse cx="160" cy="150" rx="80" ry="90" fill="#FF8F00" opacity="0.15" stroke="#FF8F00" strokeWidth="2" />
                                        <text x="160" y="55" textAnchor="middle" fill="#FFB74D" fontSize="11" fontWeight="bold">Yeast Cell</text>
                                        {/* Ethanol bubbles */}
                                        {Array.from({ length: bubbleCount }).map((_, i) => {
                                            const phase = (tick * 0.025 + i * 0.4) % 1;
                                            return (
                                                <circle key={i} cx={130 + (i % 4) * 20 + Math.sin(tick * 0.03 + i) * 5}
                                                    cy={220 - phase * 160}
                                                    r={3 + Math.sin(i) * 1.5} fill="#40C4FF" opacity={0.6 + phase * 0.3}>
                                                </circle>
                                            );
                                        })}
                                        <text x="160" y="240" textAnchor="middle" fill="#FFB74D" fontSize="11" fontWeight="bold">Ethanol: {ethanol} | CO₂: {co2}</text>
                                    </>
                                )}
                                <text x="160" y="268" textAnchor="middle" fill="#FFD600" fontSize="13" fontWeight="bold">ATP yield: {atpYield} (vs 38 aerobic)</text>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">Exercise intensity: {intensity}%
                            <input type="range" min={10} max={100} value={intensity} onChange={e => setIntensity(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Duration: {duration}s
                            <input type="range" min={10} max={120} value={duration} onChange={e => setDuration(+e.target.value)} className="vl-range" />
                        </label>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-section-title-row">
                            <div className="vl-card-title">Tasks</div>
                            <div className="vl-section-meta">{progress}%</div>
                        </div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'lactic', text: 'Build up ≥5 lactic acid in muscle mode' },
                                { id: 'ethanol', text: 'Produce ≥4 ethanol in yeast mode' },
                                { id: 'high-effort', text: 'Push intensity to ≥90%' },
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
