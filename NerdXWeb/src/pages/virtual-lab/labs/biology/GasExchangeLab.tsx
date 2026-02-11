import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Wind } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function GasExchangeLab({ simulation }: { simulation: SimulationMetadata }) {
    const [surfaceArea, setSurfaceArea] = useState(70);
    const [gradient, setGradient] = useState(60);
    const [ventilation, setVentilation] = useState(50);
    const [quizOpen, setQuizOpen] = useState(false);
    const [tick, setTick] = useState(0);

    useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 70); return () => clearInterval(id); }, []);

    const diffusionRate = useMemo(() => Math.round((surfaceArea / 100) * (gradient / 100) * (ventilation / 100) * 100), [surfaceArea, gradient, ventilation]);
    const o2Particles = useMemo(() => Math.max(2, Math.floor(diffusionRate / 8)), [diffusionRate]);
    const co2Particles = useMemo(() => Math.max(1, Math.floor(diffusionRate / 12)), [diffusionRate]);

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const next = new Set(completed);
        if (diffusionRate >= 80) next.add('fast');
        if (surfaceArea <= 20) next.add('low-sa');
        if (gradient >= 90 && ventilation >= 90) next.add('optimal');
        setCompleted(next);
    }, [surfaceArea, gradient, ventilation, diffusionRate]);

    const progress = Math.round((completed.size / 3) * 100);
    const canTakeQuiz = completed.size >= 3;

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #0288D1, #01579B)' }}><Wind size={28} /></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Alveolus — Gas Exchange</div>
                        <div className="vl-card-subtitle">O₂ diffuses into blood; CO₂ diffuses into alveolus</div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 320 300" role="img" aria-label="Gas exchange in alveoli">
                                {/* Alveolus wall */}
                                <ellipse cx="160" cy="120" rx={50 + surfaceArea * 0.5} ry={40 + surfaceArea * 0.3} fill="#E3F2FD" opacity="0.3" stroke="#90CAF9" strokeWidth="2" />
                                <text x="160" y="80" textAnchor="middle" fill="#90CAF9" fontSize="10" fontWeight="bold">Alveolus (air)</text>

                                {/* Capillary wall */}
                                <rect x="60" y="200" width="200" height="40" rx="20" fill="#FFCDD2" opacity="0.3" stroke="#EF5350" strokeWidth="2" />
                                <text x="160" y="230" textAnchor="middle" fill="#EF5350" fontSize="10" fontWeight="bold">Blood capillary</text>

                                {/* Thin membrane */}
                                <line x1="80" y1="185" x2="240" y2="185" stroke="#B0BEC5" strokeWidth="1" strokeDasharray="4,3" />
                                <text x="260" y="188" fill="#B0BEC5" fontSize="8">membrane</text>

                                {/* O2 particles moving down */}
                                {Array.from({ length: o2Particles }).map((_, i) => {
                                    const phase = (tick * 0.025 + i * 0.3) % 1;
                                    return (
                                        <circle key={`o2-${i}`}
                                            cx={100 + (i % 5) * 30 + Math.sin(tick * 0.03 + i) * 5}
                                            cy={100 + phase * 100}
                                            r={4} fill="#2196F3" opacity={0.8}>
                                            <animate attributeName="opacity" values="0.9;0.5;0.9" dur="1.8s" repeatCount="indefinite" begin={`${i * 0.1}s`} />
                                        </circle>
                                    );
                                })}
                                {/* CO2 particles moving up */}
                                {Array.from({ length: co2Particles }).map((_, i) => {
                                    const phase = (tick * 0.02 + i * 0.4) % 1;
                                    return (
                                        <circle key={`co2-${i}`}
                                            cx={120 + (i % 4) * 25 + Math.sin(tick * 0.04 + i * 2) * 4}
                                            cy={230 - phase * 120}
                                            r={3.5} fill="#FF5252" opacity={0.7}>
                                        </circle>
                                    );
                                })}

                                {/* Labels */}
                                <text x="55" y="140" fill="#2196F3" fontSize="10" fontWeight="bold">O₂ ↓</text>
                                <text x="255" y="170" fill="#FF5252" fontSize="10" fontWeight="bold">CO₂ ↑</text>

                                {/* Rate display */}
                                <text x="160" y="275" textAnchor="middle" fill="#4CAF50" fontSize="13" fontWeight="bold">Diffusion rate: {diffusionRate}%</text>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">Surface area: {surfaceArea}%
                            <input type="range" min={5} max={100} value={surfaceArea} onChange={e => setSurfaceArea(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Concentration gradient: {gradient}%
                            <input type="range" min={5} max={100} value={gradient} onChange={e => setGradient(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Ventilation rate: {ventilation}%
                            <input type="range" min={5} max={100} value={ventilation} onChange={e => setVentilation(+e.target.value)} className="vl-range" />
                        </label>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'fast', text: 'Achieve diffusion rate ≥ 80%' },
                                { id: 'low-sa', text: 'Reduce surface area to ≤ 20% — see rate drop' },
                                { id: 'optimal', text: 'Set both gradient and ventilation ≥ 90%' },
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
