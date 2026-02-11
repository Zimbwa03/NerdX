import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function RatesOfReactionLab({ simulation }: { simulation: SimulationMetadata }) {
    const [temperature, setTemperature] = useState(30);
    const [concentration, setConcentration] = useState(2);
    const [surfaceArea, setSurfaceArea] = useState(2);
    const [catalyst, setCatalyst] = useState(false);
    const [quizOpen, setQuizOpen] = useState(false);
    const [tick, setTick] = useState(0);
    useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 60); return () => clearInterval(id); }, []);

    const rate = useMemo(() => {
        const base = (temperature / 20) + concentration + surfaceArea;
        return Math.round((base * (catalyst ? 2 : 1)) * 10) / 10;
    }, [temperature, concentration, surfaceArea, catalyst]);

    const activationEnergy = useMemo(() => catalyst ? 40 : 70, [catalyst]);
    const bubbleCount = useMemo(() => Math.min(20, Math.floor(rate * 1.5)), [rate]);

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (rate >= 12) n.add('high-rate');
        if (rate <= 4) n.add('low-rate');
        if (catalyst) n.add('catalyst');
        if (temperature >= 70) n.add('high-temp');
        setCompleted(n);
    }, [rate, catalyst, temperature]);

    const progress = Math.round((completed.size / 4) * 100);
    const canTakeQuiz = completed.size >= 3;

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #FF9800, #E65100)' }}><span style={{ fontSize: 24 }}>⚡</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Reaction Rate: {rate} units</div>
                        <div className="vl-card-subtitle">
                            {rate >= 10 ? '🔥 Very fast reaction' : rate >= 6 ? '⚡ Moderate reaction' : '🐢 Slow reaction'}
                        </div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 260" role="img" aria-label="Rate of reaction simulation">
                                {/* Conical flask */}
                                <polygon points="100,60 60,180 60,200 240,200 240,180 200,60"
                                    fill="#263238" opacity="0.1" stroke="#546E7A" strokeWidth="2" strokeLinejoin="round" />
                                {/* Flask neck */}
                                <rect x="120" y="30" width="60" height="35" rx="4" fill="none" stroke="#546E7A" strokeWidth="2" />

                                {/* Solution in flask */}
                                <polygon points={`85,${200 - concentration * 15} 60,200 240,200 215,${200 - concentration * 15}`}
                                    fill="#FF9800" opacity="0.2" rx="4" />

                                {/* Bubbles (gas produced) */}
                                {Array.from({ length: bubbleCount }).map((_, i) => {
                                    const phase = (tick * 0.015 + i * 0.15) % 1;
                                    return (
                                        <circle key={i}
                                            cx={110 + (i % 6) * 15 + Math.sin(tick * 0.02 + i) * 5}
                                            cy={180 - phase * 130}
                                            r={2.5 + Math.sin(i * 1.7) * 1}
                                            fill="#B0BEC5" opacity={0.6 - phase * 0.4} />
                                    );
                                })}

                                {/* Catalyst particles */}
                                {catalyst && Array.from({ length: 5 }).map((_, i) => (
                                    <circle key={i} cx={100 + i * 25} cy={185} r="5" fill="#FFD600" opacity="0.6" />
                                ))}
                                {catalyst && <text x="150" y="245" textAnchor="middle" fill="#FFD600" fontSize="9" fontWeight="bold">MnO₂ catalyst present</text>}

                                {/* Particle surface area visualization */}
                                {surfaceArea >= 4 && (
                                    <g>
                                        {Array.from({ length: 8 }).map((_, i) => (
                                            <rect key={i} x={90 + (i % 4) * 30} y={160 + Math.floor(i / 4) * 12} width="6" height="6" fill="#78909C" opacity="0.4" rx="1" />
                                        ))}
                                        <text x="150" y="220" textAnchor="middle" fill="#78909C" fontSize="7">Powdered (high surface area)</text>
                                    </g>
                                )}
                                {surfaceArea <= 2 && (
                                    <g>
                                        <rect x="125" y="160" width="50" height="25" fill="#78909C" opacity="0.4" rx="3" />
                                        <text x="150" y="220" textAnchor="middle" fill="#78909C" fontSize="7">Large pieces (low surface area)</text>
                                    </g>
                                )}

                                {/* Temperature indicator */}
                                <rect x="255" y="60" width="10" height="120" rx="5" fill="#263238" opacity="0.2" />
                                <rect x="257" y={180 - (temperature / 80) * 120} width="6" height={(temperature / 80) * 120} rx="3" fill="#EF5350" />
                                <text x="260" y="55" textAnchor="middle" fill="#EF5350" fontSize="8">{temperature}°C</text>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Energy Profile</div>
                        <div className="vl-canvas-wrap" style={{ height: 100 }}>
                            <svg viewBox="0 0 200 80" style={{ width: '100%', height: '100%' }}>
                                <polyline fill="none" stroke="#FF9800" strokeWidth="2"
                                    points={`10,60 40,60 100,${60 - activationEnergy * 0.6} 160,50 190,50`} />
                                {catalyst && <polyline fill="none" stroke="#4CAF50" strokeWidth="1.5" strokeDasharray="4,2"
                                    points="10,60 40,60 100,36 160,50 190,50" />}
                                <text x="100" y={55 - activationEnergy * 0.6} textAnchor="middle" fill="#FF9800" fontSize="7">Ea = {activationEnergy}</text>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">Temperature: {temperature}°C
                            <input type="range" min={10} max={80} step={5} value={temperature} onChange={e => setTemperature(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Concentration: {concentration}×
                            <input type="range" min={1} max={5} value={concentration} onChange={e => setConcentration(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Surface area: {surfaceArea}×
                            <input type="range" min={1} max={5} value={surfaceArea} onChange={e => setSurfaceArea(+e.target.value)} className="vl-range" />
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, color: '#B0BEC5', fontSize: 13 }}>
                            <input type="checkbox" checked={catalyst} onChange={e => setCatalyst(e.target.checked)} />
                            Add catalyst (MnO₂)
                        </label>
                    </div>

                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'high-rate', text: 'Achieve rate ≥ 12 units' },
                                { id: 'low-rate', text: 'Achieve rate ≤ 4 units' },
                                { id: 'catalyst', text: 'Use a catalyst' },
                                { id: 'high-temp', text: 'Raise temperature to ≥ 70°C' },
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
