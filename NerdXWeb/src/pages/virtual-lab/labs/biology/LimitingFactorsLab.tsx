import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Sun } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function LimitingFactorsLab({ simulation }: { simulation: SimulationMetadata }) {
    const [light, setLight] = useState(50);
    const [co2, setCo2] = useState(50);
    const [temperature, setTemperature] = useState(25);
    const [quizOpen, setQuizOpen] = useState(false);

    const rate = useMemo(() => {
        const lFactor = Math.min(1, light / 80);
        const cFactor = Math.min(1, co2 / 80);
        const tFactor = temperature <= 35 ? Math.min(1, temperature / 35) : Math.max(0, 1 - (temperature - 35) / 20);
        return Math.round(Math.min(lFactor, cFactor, tFactor) * 100);
    }, [light, co2, temperature]);

    const limitingFactor = useMemo(() => {
        const lF = Math.min(1, light / 80);
        const cF = Math.min(1, co2 / 80);
        const tF = temperature <= 35 ? Math.min(1, temperature / 35) : Math.max(0, 1 - (temperature - 35) / 20);
        const min = Math.min(lF, cF, tF);
        if (min === lF) return 'Light intensity';
        if (min === cF) return 'CO₂ concentration';
        return 'Temperature';
    }, [light, co2, temperature]);

    // Generate rate-vs-light curve points
    const curvePoints = useMemo(() => {
        const pts: string[] = [];
        for (let x = 0; x <= 100; x += 2) {
            const lF = Math.min(1, x / 80);
            const cF = Math.min(1, co2 / 80);
            const tF = temperature <= 35 ? Math.min(1, temperature / 35) : Math.max(0, 1 - (temperature - 35) / 20);
            const r = Math.min(lF, cF, tF) * 100;
            pts.push(`${40 + x * 2.3},${230 - r * 1.8}`);
        }
        return pts.join(' ');
    }, [co2, temperature]);

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (rate >= 90) n.add('max-rate');
        if (rate <= 20) n.add('low-rate');
        if (light >= 80 && co2 <= 30) n.add('co2-limit');
        setCompleted(n);
    }, [light, co2, temperature, rate]);

    const progress = Math.round((completed.size / 3) * 100);
    const canTakeQuiz = completed.size >= 3;

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #66BB6A, #2E7D32)' }}><Sun size={28} /></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Rate vs Light Intensity</div>
                        <div className="vl-card-subtitle">Limiting factor: <strong>{limitingFactor}</strong> — Rate: {rate}%</div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 250" role="img" aria-label="Limiting factors graph">
                                <line x1="40" y1="230" x2="280" y2="230" stroke="#546E7A" strokeWidth="1.5" />
                                <line x1="40" y1="230" x2="40" y2="40" stroke="#546E7A" strokeWidth="1.5" />
                                <text x="160" y="248" textAnchor="middle" fill="#90A4AE" fontSize="9">Light intensity</text>
                                <text x="12" y="140" textAnchor="middle" fill="#90A4AE" fontSize="9" transform="rotate(-90,12,140)">Rate</text>
                                {/* Grid */}
                                {[0.25, 0.5, 0.75, 1].map(f => (
                                    <line key={f} x1="40" y1={230 - f * 180} x2="280" y2={230 - f * 180} stroke="#37474F" strokeWidth="0.5" strokeDasharray="3,3" />
                                ))}
                                {/* Curve */}
                                <polyline points={curvePoints} fill="none" stroke="#4CAF50" strokeWidth="2.5" />
                                {/* Plateau annotation */}
                                <text x="220" y={230 - Math.min(1, co2 / 80, temperature <= 35 ? temperature / 35 : Math.max(0, 1 - (temperature - 35) / 20)) * 180 - 8}
                                    fill="#FF9800" fontSize="9" fontWeight="bold">← plateau</text>
                                {/* Current position dot */}
                                <circle cx={40 + light * 2.3} cy={230 - rate * 1.8} r="5" fill="#FFD600" stroke="#FFF" strokeWidth="1.5" />
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">Light intensity: {light}%
                            <input type="range" min={0} max={100} value={light} onChange={e => setLight(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">CO₂ concentration: {co2}%
                            <input type="range" min={0} max={100} value={co2} onChange={e => setCo2(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Temperature: {temperature}°C
                            <input type="range" min={5} max={55} value={temperature} onChange={e => setTemperature(+e.target.value)} className="vl-range" />
                        </label>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'max-rate', text: 'Achieve rate ≥ 90% (maximize all factors)' },
                                { id: 'low-rate', text: 'Reduce rate to ≤ 20%' },
                                { id: 'co2-limit', text: 'Set light ≥ 80% but CO₂ ≤ 30% — observe CO₂ as limited factor' },
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
