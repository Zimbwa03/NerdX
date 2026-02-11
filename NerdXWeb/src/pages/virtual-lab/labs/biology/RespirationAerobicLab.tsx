import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Zap } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function RespirationAerobicLab({ simulation }: { simulation: SimulationMetadata }) {
    const [oxygen, setOxygen] = useState(70);
    const [glucose, setGlucose] = useState(60);
    const [temperature, setTemperature] = useState(37);
    const [quizOpen, setQuizOpen] = useState(false);
    const [tick, setTick] = useState(0);

    useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 60); return () => clearInterval(id); }, []);

    const atpRate = useMemo(() => {
        const o = oxygen / 100;
        const g = glucose / 100;
        const tFactor = temperature <= 37 ? temperature / 37 : Math.max(0, 1 - (temperature - 37) / 30);
        return Math.round(o * g * tFactor * 38);
    }, [oxygen, glucose, temperature]);

    const co2Rate = useMemo(() => Math.round(atpRate * 0.16), [atpRate]);
    const waterRate = useMemo(() => Math.round(atpRate * 0.16), [atpRate]);
    const efficiency = useMemo(() => Math.min(100, Math.round((atpRate / 38) * 100)), [atpRate]);

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    const checkTask = useCallback(() => {
        const next = new Set(completed);
        if (atpRate >= 30) next.add('high-atp');
        if (oxygen <= 20) next.add('low-o2');
        if (temperature >= 50) next.add('denature');
        setCompleted(next);
    }, [atpRate, oxygen, temperature, completed]);

    useEffect(() => { checkTask(); }, [oxygen, glucose, temperature]);

    const progress = Math.round((completed.size / 3) * 100);
    const canTakeQuiz = completed.size >= 3;

    // Animated bubble positions
    const bubbles = useMemo(() => {
        const arr: { x: number; y: number; r: number; color: string; label: string }[] = [];
        const count = Math.max(1, Math.floor(atpRate / 6));
        for (let i = 0; i < count; i++) {
            const phase = (tick * 0.03 + i * 0.7) % 1;
            arr.push({
                x: 100 + Math.sin(i * 2.1) * 40 + Math.sin(tick * 0.05 + i) * 8,
                y: 260 - phase * 220,
                r: 4 + Math.sin(i * 1.3) * 2,
                color: i % 3 === 0 ? '#FFD600' : i % 3 === 1 ? '#FF5252' : '#40C4FF',
                label: i % 3 === 0 ? 'ATP' : i % 3 === 1 ? 'CO₂' : 'H₂O',
            });
        }
        return arr;
    }, [tick, atpRate]);

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}><Zap size={28} /></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Mitochondrion — Aerobic Respiration</div>
                        <div className="vl-card-subtitle">Glucose + O₂ → CO₂ + H₂O + ATP (energy)</div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 320 320" role="img" aria-label="Aerobic respiration diagram">
                                {/* Mitochondrion outer membrane */}
                                <ellipse cx="160" cy="160" rx="140" ry="100" fill="#1B5E20" opacity="0.25" stroke="#4CAF50" strokeWidth="3" />
                                {/* Inner membrane (cristae folds) */}
                                <ellipse cx="160" cy="160" rx="120" ry="80" fill="#2E7D32" opacity="0.2" stroke="#66BB6A" strokeWidth="2" />
                                {[0, 1, 2, 3, 4].map(i => (
                                    <path key={i} d={`M${60 + i * 50},${140 + Math.sin(i) * 20} Q${80 + i * 50},${180 + Math.cos(i) * 15} ${60 + i * 50},${200}`}
                                        fill="none" stroke="#81C784" strokeWidth="2" opacity="0.6" />
                                ))}
                                {/* Matrix label */}
                                <text x="160" y="120" textAnchor="middle" fill="#A5D6A7" fontSize="11" fontWeight="bold">Matrix</text>
                                {/* Animated product bubbles */}
                                {bubbles.map((b, i) => (
                                    <g key={i}>
                                        <circle cx={b.x} cy={b.y} r={b.r} fill={b.color} opacity={0.8}>
                                            <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite" begin={`${i * 0.2}s`} />
                                        </circle>
                                    </g>
                                ))}
                                {/* Glucose arrow in */}
                                <line x1="20" y1="160" x2="40" y2="160" stroke="#FFD600" strokeWidth="3" markerEnd="url(#arrow-gold)" />
                                <text x="10" y="150" fill="#FFD600" fontSize="9" fontWeight="bold">C₆H₁₂O₆</text>
                                {/* O2 arrow in */}
                                <line x1="20" y1="200" x2="40" y2="195" stroke="#40C4FF" strokeWidth="3" />
                                <text x="10" y="215" fill="#40C4FF" fontSize="9" fontWeight="bold">O₂</text>
                                {/* ATP out */}
                                <line x1="280" y1="140" x2="305" y2="130" stroke="#FFD600" strokeWidth="3" />
                                <text x="288" y="125" fill="#FFD600" fontSize="10" fontWeight="bold">ATP ×{atpRate}</text>
                                {/* CO2 out */}
                                <line x1="280" y1="170" x2="305" y2="175" stroke="#FF5252" strokeWidth="2" />
                                <text x="288" y="190" fill="#FF5252" fontSize="9">CO₂ ×{co2Rate}</text>
                                {/* H2O out */}
                                <line x1="280" y1="200" x2="305" y2="210" stroke="#40C4FF" strokeWidth="2" />
                                <text x="288" y="225" fill="#40C4FF" fontSize="9">H₂O ×{waterRate}</text>
                                <defs>
                                    <marker id="arrow-gold" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#FFD600" /></marker>
                                </defs>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">
                            Oxygen: {oxygen}%
                            <input type="range" min={0} max={100} value={oxygen} onChange={e => setOxygen(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">
                            Glucose: {glucose}%
                            <input type="range" min={0} max={100} value={glucose} onChange={e => setGlucose(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">
                            Temperature: {temperature}°C
                            <input type="range" min={10} max={70} value={temperature} onChange={e => setTemperature(+e.target.value)} className="vl-range" />
                        </label>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Energy Dashboard</div>
                        <div className="vl-meta">
                            <span className="vl-meta-item"><Zap size={14} /> ATP: {atpRate}/38</span>
                            <span className="vl-meta-item">Efficiency: {efficiency}%</span>
                        </div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${efficiency}%`, background: efficiency > 70 ? '#4CAF50' : efficiency > 40 ? '#FF9800' : '#F44336' }} /></div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-section-title-row">
                            <div className="vl-card-title">Tasks</div>
                            <div className="vl-section-meta">{progress}%</div>
                        </div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'high-atp', text: 'Produce 30+ ATP (maximize all inputs)' },
                                { id: 'low-o2', text: 'Reduce oxygen to ≤20% — watch ATP collapse' },
                                { id: 'denature', text: 'Raise temperature above 50°C (enzyme denaturation)' },
                            ].map(t => (
                                <button key={t.id} type="button" className={`vl-check ${completed.has(t.id) ? 'done' : ''}`} onClick={() => { }}>
                                    <span className="vl-check-dot" aria-hidden="true" />
                                    <span className="vl-check-text">{t.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Learning Objectives</div>
                        <ul className="vl-bullets">
                            {simulation.learningObjectives.map(o => <li key={o.id}>{o.text}</li>)}
                        </ul>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Knowledge Check</div>
                        <div className="vl-card-subtitle">{canTakeQuiz ? 'Ready when you are!' : 'Complete all 3 tasks to unlock.'}</div>
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
