import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Filter } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function KidneyFiltrationLab({ simulation }: { simulation: SimulationMetadata }) {
    const [bloodPressure, setBloodPressure] = useState(60);
    const [waterIntake, setWaterIntake] = useState(50);
    const [adh, setAdh] = useState(5);
    const [quizOpen, setQuizOpen] = useState(false);
    const [tick, setTick] = useState(0);

    useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 90); return () => clearInterval(id); }, []);

    const filtrationRate = useMemo(() => Math.round((bloodPressure / 100) * 125), [bloodPressure]);
    const reabsorption = useMemo(() => Math.round(filtrationRate * (0.85 + adh * 0.015)), [filtrationRate, adh]);
    const urineVolume = useMemo(() => Math.max(0, Math.round((filtrationRate - reabsorption + waterIntake * 0.3) * 10) / 10), [filtrationRate, reabsorption, waterIntake]);
    const urineConcentration = useMemo(() => adh > 5 ? 'concentrated' : adh < 3 ? 'dilute' : 'normal', [adh]);

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (urineVolume >= 30) n.add('high-vol');
        if (adh >= 8) n.add('high-adh');
        if (waterIntake <= 15) n.add('dehydrated');
        setCompleted(n);
    }, [urineVolume, adh, waterIntake]);

    const progress = Math.round((completed.size / 3) * 100);
    const canTakeQuiz = completed.size >= 3;

    // Animated particles in nephron
    const nephronParticles = useMemo(() => {
        const arr: { x: number; y: number; color: string; filtered: boolean }[] = [];
        const count = Math.max(4, Math.floor(filtrationRate / 10));
        for (let i = 0; i < count; i++) {
            const phase = (tick * 0.015 + i * 0.1) % 1;
            // Blood particles entering → getting filtered
            const inGlom = phase < 0.3;
            const inTubule = phase >= 0.3 && phase < 0.7;
            const inCollecting = phase >= 0.7;
            let x: number, y: number;
            if (inGlom) {
                x = 70 + phase * 100; y = 60 + Math.sin(i * 2) * 10;
            } else if (inTubule) {
                const tp = (phase - 0.3) / 0.4;
                x = 100 + tp * 120; y = 110 + Math.sin(tp * Math.PI) * 30;
            } else {
                const cp = (phase - 0.7) / 0.3;
                x = 220; y = 140 + cp * 80;
            }
            arr.push({
                x, y,
                color: inGlom ? '#EF5350' : inTubule ? '#FFD600' : '#FF9800',
                filtered: !inGlom,
            });
        }
        return arr;
    }, [tick, filtrationRate]);

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #8D6E63, #4E342E)' }}><Filter size={28} /></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Nephron — Kidney Filtration</div>
                        <div className="vl-card-subtitle">Filtration → Reabsorption → Urine formation</div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 280 250" role="img" aria-label="Nephron filtration diagram">
                                {/* Glomerulus (Bowman's capsule) */}
                                <circle cx="80" cy="60" r="30" fill="#FFCDD2" opacity="0.3" stroke="#EF5350" strokeWidth="2" />
                                <text x="80" y="55" textAnchor="middle" fill="#EF5350" fontSize="8" fontWeight="bold">Bowman's</text>
                                <text x="80" y="65" textAnchor="middle" fill="#EF5350" fontSize="8">capsule</text>
                                {/* Glomerulus capillaries */}
                                <circle cx="80" cy="60" r="15" fill="#EF5350" opacity="0.2" stroke="#E53935" strokeWidth="1.5" />

                                {/* Proximal tubule */}
                                <path d="M110,60 Q160,50 180,80 Q200,110 180,130" fill="none" stroke="#FF9800" strokeWidth="3" opacity="0.5" />
                                <text x="170" y="72" fill="#FF9800" fontSize="7" fontWeight="bold">PCT</text>

                                {/* Loop of Henle */}
                                <path d="M180,130 Q180,180 140,190 Q100,200 100,170" fill="none" stroke="#FFD600" strokeWidth="3" opacity="0.5" />
                                <text x="130" y="205" textAnchor="middle" fill="#FFD600" fontSize="7" fontWeight="bold">Loop of Henle</text>

                                {/* Distal tubule */}
                                <path d="M100,170 Q80,140 120,120 Q160,100 200,120" fill="none" stroke="#4CAF50" strokeWidth="3" opacity="0.5" />
                                <text x="140" y="112" fill="#4CAF50" fontSize="7" fontWeight="bold">DCT</text>

                                {/* Collecting duct */}
                                <rect x="210" y="120" width="16" height="100" rx="4" fill="#795548" opacity="0.2" stroke="#795548" strokeWidth="1.5" />
                                <text x="218" y="180" textAnchor="middle" fill="#A1887F" fontSize="6" fontWeight="bold" transform="rotate(-90,218,180)">Collecting duct</text>

                                {/* Urine output */}
                                <text x="218" y="235" textAnchor="middle" fill="#FF9800" fontSize="9" fontWeight="bold">↓ Urine</text>

                                {/* Animated particles */}
                                {nephronParticles.map((p, i) => (
                                    <circle key={i} cx={p.x} cy={p.y} r={p.filtered ? 2.5 : 3.5} fill={p.color} opacity={0.7} />
                                ))}

                                {/* Blood vessel in */}
                                <line x1="30" y1="60" x2="50" y2="60" stroke="#EF5350" strokeWidth="3" />
                                <text x="15" y="57" fill="#EF5350" fontSize="7">Blood →</text>

                                {/* Reabsorption arrows */}
                                {[0, 1, 2].map(i => (
                                    <line key={i} x1={130 + i * 25} y1={95 + i * 10} x2={130 + i * 25} y2={80 + i * 10}
                                        stroke="#4CAF50" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
                                ))}
                                <text x="155" y="78" fill="#4CAF50" fontSize="6">↑ reabsorbed</text>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">Blood pressure: {bloodPressure}%
                            <input type="range" min={20} max={100} value={bloodPressure} onChange={e => setBloodPressure(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Water intake: {waterIntake}%
                            <input type="range" min={5} max={100} value={waterIntake} onChange={e => setWaterIntake(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">ADH level: {adh}
                            <input type="range" min={0} max={10} value={adh} onChange={e => setAdh(+e.target.value)} className="vl-range" />
                        </label>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Readouts</div>
                        <div className="vl-meta">
                            <span className="vl-meta-item">Filtration: {filtrationRate} mL/min</span>
                            <span className="vl-meta-item">Reabsorbed: {reabsorption} mL/min</span>
                        </div>
                        <div className="vl-meta">
                            <span className="vl-meta-item">Urine vol: {urineVolume} mL/min</span>
                            <span className="vl-meta-item">Urine: {urineConcentration}</span>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'high-vol', text: 'Produce high urine volume (≥30 mL/min)' },
                                { id: 'high-adh', text: 'Set ADH ≥ 8 (concentrated urine)' },
                                { id: 'dehydrated', text: 'Reduce water intake to ≤15% (dehydration)' },
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
