import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function EnergyWorkPowerLab({ simulation }: { simulation: SimulationMetadata }) {
    const [force, setForce] = useState(50);
    const [distance, setDistance] = useState(10);
    const [time, setTime] = useState(5);
    const [quizOpen, setQuizOpen] = useState(false);
    const [tick, setTick] = useState(0);
    useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 50); return () => clearInterval(id); }, []);

    const work = useMemo(() => force * distance, [force, distance]);
    const power = useMemo(() => Math.round((work / time) * 10) / 10, [work, time]);

    // Animated box position
    const speed = power / 50;
    const boxX = useMemo(() => 60 + ((tick * speed * 0.5) % (distance * 5)), [tick, speed, distance]);

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (power >= 200) n.add('high-power');
        if (work <= 300) n.add('low-work');
        if (time >= 4 && time <= 8) n.add('time-range');
        if (work >= 1000) n.add('big-work');
        setCompleted(n);
    }, [power, work, time]);

    const progress = Math.round((completed.size / 4) * 100);
    const canTakeQuiz = completed.size >= 3;

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #2196F3, #0D47A1)' }}><span style={{ fontSize: 24 }}>🚀</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Work = Force × Distance</div>
                        <div className="vl-card-subtitle">
                            W = {force} N × {distance} m = <strong style={{ color: '#FFD600' }}>{work} J</strong> | P = {work} J / {time} s = <strong style={{ color: '#4CAF50' }}>{power} W</strong>
                        </div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 200" role="img" aria-label="Work energy simulation">
                                {/* Ground */}
                                <line x1="20" y1="150" x2="280" y2="150" stroke="#546E7A" strokeWidth="2" />
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <line key={i} x1={20 + i * 14} y1="150" x2={26 + i * 14} y2="158" stroke="#546E7A" strokeWidth="1" />
                                ))}

                                {/* Distance markers */}
                                <line x1="60" y1="155" x2={60 + distance * 5} y2="155" stroke="#FFD600" strokeWidth="2" />
                                <text x={60 + distance * 2.5} y="170" textAnchor="middle" fill="#FFD600" fontSize="9" fontWeight="bold">{distance} m</text>

                                {/* Box being pushed */}
                                <rect x={boxX} y="115" width="35" height="35" rx="4" fill="#42A5F5" opacity="0.7" stroke="#1E88E5" strokeWidth="2" />
                                <text x={boxX + 17} y="137" textAnchor="middle" fill="#FFF" fontSize="9" fontWeight="bold">Box</text>

                                {/* Force arrow */}
                                <line x1={boxX - 5} y1="132" x2={boxX - 5 - Math.min(force / 3, 40)} y2="132" stroke="#EF5350" strokeWidth="3" markerEnd="url(#arrowF)" />
                                <defs><marker id="arrowF" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,1 L7,4 L0,7" fill="#EF5350" /></marker></defs>
                                <text x={boxX - 10 - Math.min(force / 3, 40)} y="128" fill="#EF5350" fontSize="8" fontWeight="bold">{force} N</text>

                                {/* Energy bar */}
                                <rect x="20" y="25" width={Math.min(250, work / 8)} height="16" rx="4" fill="#FFD600" opacity="0.5" />
                                <text x="25" y="37" fill="#FFF" fontSize="9" fontWeight="bold">Energy: {work} J</text>

                                {/* Power indicator */}
                                <rect x="20" y="50" width={Math.min(250, power / 2)} height="16" rx="4" fill="#4CAF50" opacity="0.5" />
                                <text x="25" y="62" fill="#FFF" fontSize="9" fontWeight="bold">Power: {power} W</text>

                                {/* Speed trail */}
                                {speed > 1 && Array.from({ length: Math.min(5, Math.floor(speed)) }).map((_, i) => (
                                    <line key={i} x1={boxX - 8 - i * 8} y1={125 + i * 3} x2={boxX - 3 - i * 8} y2={125 + i * 3}
                                        stroke="#90CAF9" strokeWidth="1.5" opacity={0.6 - i * 0.1} />
                                ))}
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">Force (F): {force} N
                            <input type="range" min={1} max={200} step={1} value={force} onChange={e => setForce(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Distance (d): {distance} m
                            <input type="range" min={1} max={50} step={1} value={distance} onChange={e => setDistance(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Time (t): {time} s
                            <input type="range" min={1} max={30} step={1} value={time} onChange={e => setTime(+e.target.value)} className="vl-range" />
                        </label>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Formulae</div>
                        <div className="vl-explanation" style={{ fontSize: 12, fontFamily: 'monospace' }}>
                            W = F × d = {force} × {distance} = <strong>{work} J</strong><br />
                            P = W / t = {work} / {time} = <strong>{power} W</strong>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'high-power', text: 'Make power ≥ 200 W' },
                                { id: 'low-work', text: 'Make work ≤ 300 J' },
                                { id: 'time-range', text: 'Set time between 4 and 8 s' },
                                { id: 'big-work', text: 'Make work ≥ 1000 J' },
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
