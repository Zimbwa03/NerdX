import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function ElectricPowerLab({ simulation }: { simulation: SimulationMetadata }) {
    const [voltage, setVoltage] = useState(120);
    const [current, setCurrent] = useState(2);
    const [time, setTime] = useState(1);
    const [quizOpen, setQuizOpen] = useState(false);
    const [tick, setTick] = useState(0);
    useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 50); return () => clearInterval(id); }, []);

    const power = useMemo(() => voltage * current, [voltage, current]);
    const energy = useMemo(() => Math.round(power * time), [power, time]);
    const energyKWh = useMemo(() => Math.round((energy / 1000) * 100) / 100, [energy]);

    // Animated electrons in wire
    const electronSpeed = current * 0.02;

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (power >= 500) n.add('high-p');
        if (energy <= 200) n.add('low-e');
        if (time >= 2) n.add('long');
        if (power <= 100) n.add('low-p');
        setCompleted(n);
    }, [power, energy, time]);

    const progress = Math.round((completed.size / 4) * 100);
    const canTakeQuiz = completed.size >= 3;

    // Bulb glow based on power
    const glowIntensity = Math.min(1, power / 500);

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #2196F3, #0D47A1)' }}><span style={{ fontSize: 24 }}>💡</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">P = V × I</div>
                        <div className="vl-card-subtitle">
                            Power = <strong style={{ color: '#FFD600' }}>{power} W</strong> | Energy = <strong style={{ color: '#4CAF50' }}>{energy} Wh</strong> ({energyKWh} kWh)
                        </div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 220" role="img" aria-label="Electric circuit">
                                {/* Battery */}
                                <rect x="30" y="85" width="35" height="50" rx="4" fill="#263238" stroke="#FFD600" strokeWidth="1.5" />
                                <line x1="40" y1="95" x2="40" y2="125" stroke="#FFD600" strokeWidth="3" />
                                <line x1="55" y1="100" x2="55" y2="120" stroke="#FFD600" strokeWidth="1.5" />
                                <text x="47" y="145" textAnchor="middle" fill="#FFD600" fontSize="7">{voltage}V</text>

                                {/* Top wire */}
                                <line x1="65" y1="90" x2="200" y2="90" stroke="#FF9800" strokeWidth="2" />
                                {/* Bottom wire */}
                                <line x1="65" y1="130" x2="200" y2="130" stroke="#FF9800" strokeWidth="2" />
                                {/* Vertical connections */}
                                <line x1="65" y1="85" x2="65" y2="90" stroke="#FF9800" strokeWidth="2" />
                                <line x1="65" y1="130" x2="65" y2="135" stroke="#FF9800" strokeWidth="2" />

                                {/* Animated electrons */}
                                {current > 0 && Array.from({ length: 8 }).map((_, i) => {
                                    const phase = ((tick * electronSpeed + i * 0.12) % 1);
                                    return (
                                        <g key={i}>
                                            <circle cx={65 + phase * 135} cy="90" r="2" fill="#42A5F5" opacity="0.8" />
                                            <circle cx={200 - phase * 135} cy="130" r="2" fill="#42A5F5" opacity="0.8" />
                                        </g>
                                    );
                                })}

                                {/* Light bulb */}
                                <circle cx="220" cy="110" r="20" fill="#FFD600" opacity={glowIntensity * 0.4} />
                                <circle cx="220" cy="110" r="15" fill="#FFD600" opacity={glowIntensity * 0.6} />
                                <circle cx="220" cy="110" r="8" fill="#FFF" opacity={glowIntensity * 0.8} />
                                <line x1="200" y1="90" x2="220" y2="95" stroke="#FF9800" strokeWidth="1.5" />
                                <line x1="200" y1="130" x2="220" y2="125" stroke="#FF9800" strokeWidth="1.5" />
                                <text x="220" y="145" textAnchor="middle" fill="#90A4AE" fontSize="7">Appliance</text>

                                {/* Glow rays */}
                                {power > 100 && Array.from({ length: 6 }).map((_, i) => {
                                    const angle = (i * 60 + tick * 2) * Math.PI / 180;
                                    const len = 25 + glowIntensity * 10;
                                    return (
                                        <line key={i}
                                            x1={220 + Math.cos(angle) * 12} y1={110 + Math.sin(angle) * 12}
                                            x2={220 + Math.cos(angle) * len} y2={110 + Math.sin(angle) * len}
                                            stroke="#FFD600" strokeWidth="1" opacity={0.3 * glowIntensity} />
                                    );
                                })}

                                {/* Ammeter */}
                                <circle cx="130" cy="90" r="10" fill="#263238" opacity="0.5" stroke="#42A5F5" strokeWidth="1" />
                                <text x="130" y="93" textAnchor="middle" fill="#42A5F5" fontSize="7" fontWeight="bold">{current}A</text>

                                {/* Power bar */}
                                <rect x="30" y="170" width={Math.min(240, power / 3)} height="14" rx="3" fill="#FFD600" opacity="0.4" />
                                <text x="35" y="181" fill="#FFF" fontSize="8" fontWeight="bold">Power: {power} W</text>

                                {/* Energy bar */}
                                <rect x="30" y="190" width={Math.min(240, energy / 5)} height="14" rx="3" fill="#4CAF50" opacity="0.4" />
                                <text x="35" y="201" fill="#FFF" fontSize="8" fontWeight="bold">Energy: {energy} Wh</text>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">Voltage (V): {voltage} V
                            <input type="range" min={0} max={240} step={10} value={voltage} onChange={e => setVoltage(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Current (I): {current} A
                            <input type="range" min={0} max={10} step={0.5} value={current} onChange={e => setCurrent(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Time: {time} h
                            <input type="range" min={0.5} max={5} step={0.5} value={time} onChange={e => setTime(+e.target.value)} className="vl-range" />
                        </label>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Formulae</div>
                        <div className="vl-explanation" style={{ fontSize: 12, fontFamily: 'monospace' }}>
                            P = V × I = {voltage} × {current} = <strong>{power} W</strong><br />
                            E = P × t = {power} × {time} = <strong>{energy} Wh</strong> = {energyKWh} kWh
                        </div>
                    </div>
                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'high-p', text: 'Make power ≥ 500 W' },
                                { id: 'low-e', text: 'Make energy ≤ 200 Wh' },
                                { id: 'long', text: 'Set time to 2 hours or more' },
                                { id: 'low-p', text: 'Make power ≤ 100 W' },
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
