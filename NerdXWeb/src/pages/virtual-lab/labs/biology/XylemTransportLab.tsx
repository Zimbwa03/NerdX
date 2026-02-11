import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Droplets, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function XylemTransportLab({ simulation }: { simulation: SimulationMetadata }) {
    const [temperature, setTemperature] = useState(25);
    const [humidity, setHumidity] = useState(50);
    const [wind, setWind] = useState(30);
    const [quizOpen, setQuizOpen] = useState(false);
    const [tick, setTick] = useState(0);

    useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 80); return () => clearInterval(id); }, []);

    const transpRate = useMemo(() => {
        const tF = Math.min(1, temperature / 40);
        const hF = 1 - humidity / 100;
        const wF = Math.min(1, wind / 60);
        return Math.round(tF * hF * wF * 100);
    }, [temperature, humidity, wind]);

    const waterSpeed = useMemo(() => Math.max(0.5, transpRate / 30), [transpRate]);

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (transpRate >= 70) n.add('fast-flow');
        if (humidity >= 90) n.add('high-humid');
        if (wind >= 50 && temperature >= 35) n.add('windy-hot');
        setCompleted(n);
    }, [transpRate, humidity, wind, temperature]);

    const progress = Math.round((completed.size / 3) * 100);
    const canTakeQuiz = completed.size >= 3;

    // Water particle positions (moving up)
    const particles = useMemo(() => {
        const arr: { x: number; y: number }[] = [];
        const count = Math.max(3, Math.floor(transpRate / 8));
        for (let i = 0; i < count; i++) {
            const phase = (tick * 0.02 * waterSpeed + i * 0.15) % 1;
            arr.push({ x: 130 + Math.sin(i * 1.7) * 8, y: 240 - phase * 200 });
        }
        return arr;
    }, [tick, transpRate, waterSpeed]);

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #0097A7, #006064)' }}><Droplets size={28} /></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Xylem Water Transport</div>
                        <div className="vl-card-subtitle">Transpiration pull drives water upward through xylem vessels</div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 260 260" role="img" aria-label="Xylem transport diagram">
                                {/* Root zone */}
                                <rect x="90" y="220" width="80" height="40" rx="10" fill="#795548" opacity="0.3" stroke="#795548" strokeWidth="1.5" />
                                <text x="130" y="248" textAnchor="middle" fill="#A1887F" fontSize="9" fontWeight="bold">Roots</text>
                                {/* Root hairs */}
                                {[0, 1, 2, 3].map(i => (
                                    <line key={i} x1={95 + i * 20} y1="235" x2={85 + i * 20} y2="255" stroke="#A1887F" strokeWidth="1" />
                                ))}

                                {/* Stem / xylem vessel */}
                                <rect x="118" y="50" width="24" height="175" rx="4" fill="#1B5E20" opacity="0.15" stroke="#4CAF50" strokeWidth="2" />
                                <text x="160" y="140" fill="#66BB6A" fontSize="8" fontWeight="bold">Xylem</text>

                                {/* Leaf canopy */}
                                <ellipse cx="130" cy="35" rx="60" ry="28" fill="#66BB6A" opacity="0.2" stroke="#4CAF50" strokeWidth="1.5" />
                                <text x="130" y="38" textAnchor="middle" fill="#81C784" fontSize="9" fontWeight="bold">Leaf (stomata)</text>

                                {/* Evaporation arrows from leaf */}
                                {transpRate > 20 && [0, 1, 2].map(i => (
                                    <line key={i} x1={100 + i * 30} y1="15" x2={100 + i * 30} y2={5 - transpRate * 0.05}
                                        stroke="#90CAF9" strokeWidth="1.5" strokeDasharray="3,2" markerEnd="url(#xt-arrow)" />
                                ))}

                                {/* Water particles moving up xylem */}
                                {particles.map((p, i) => (
                                    <circle key={i} cx={p.x} cy={p.y} r="3" fill="#29B6F6" opacity={0.7}>
                                        <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1.5s" repeatCount="indefinite" begin={`${i * 0.1}s`} />
                                    </circle>
                                ))}

                                {/* Transpiration rate */}
                                <text x="130" y="258" textAnchor="middle" fill="#4FC3F7" fontSize="11" fontWeight="bold">Transpiration rate: {transpRate}%</text>

                                <defs>
                                    <marker id="xt-arrow" markerWidth="5" markerHeight="4" refX="5" refY="2" orient="auto">
                                        <path d="M0,0 L5,2 L0,4" fill="#90CAF9" />
                                    </marker>
                                </defs>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">Temperature: {temperature}°C
                            <input type="range" min={5} max={45} value={temperature} onChange={e => setTemperature(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Humidity: {humidity}%
                            <input type="range" min={5} max={100} value={humidity} onChange={e => setHumidity(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Wind speed: {wind}%
                            <input type="range" min={0} max={100} value={wind} onChange={e => setWind(+e.target.value)} className="vl-range" />
                        </label>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'fast-flow', text: 'Achieve transpiration rate ≥ 70%' },
                                { id: 'high-humid', text: 'Set humidity ≥ 90% — watch rate drop' },
                                { id: 'windy-hot', text: 'Set wind ≥ 50% AND temperature ≥ 35°C' },
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
