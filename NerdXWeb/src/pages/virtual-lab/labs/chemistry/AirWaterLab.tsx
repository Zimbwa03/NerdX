import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

interface GasInfo { name: string; pct: number; color: string; }
const AIR_COMP: GasInfo[] = [
    { name: 'Nitrogen (N₂)', pct: 78, color: '#42A5F5' },
    { name: 'Oxygen (O₂)', pct: 21, color: '#EF5350' },
    { name: 'Argon (Ar)', pct: 0.93, color: '#AB47BC' },
    { name: 'CO₂', pct: 0.04, color: '#78909C' },
    { name: 'Water vapour + others', pct: 0.03, color: '#26C6DA' },
];

interface PurificationStep { id: string; name: string; desc: string; }
const PURIFICATION: PurificationStep[] = [
    { id: 'screen', name: 'Screening', desc: 'Remove large debris and sediment from raw water.' },
    { id: 'coag', name: 'Coagulation / Settling', desc: 'Chemicals added to clump small particles → settle as sediment.' },
    { id: 'filter', name: 'Filtration', desc: 'Water passes through sand/gravel beds to remove fine particles.' },
    { id: 'chlor', name: 'Chlorination', desc: 'Chlorine added to kill bacteria and make water safe to drink.' },
    { id: 'store', name: 'Storage', desc: 'Purified water stored in reservoirs and distributed.' },
];

export function AirWaterLab({ simulation }: { simulation: SimulationMetadata }) {
    const [tab, setTab] = useState<'air' | 'water'>('air');
    const [purStep, setPurStep] = useState(0);
    const [quizOpen, setQuizOpen] = useState(false);

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (tab === 'air') n.add('air');
        if (tab === 'water') n.add('water');
        if (purStep >= 4) n.add('purification');
        setCompleted(n);
    }, [tab, purStep]);

    const progress = Math.round((completed.size / 3) * 100);
    const canTakeQuiz = completed.size >= 3;

    // Pie chart angles
    const pieSlices = useMemo(() => {
        let cumAngle = 0;
        return AIR_COMP.map(g => {
            const startAngle = cumAngle;
            cumAngle += (g.pct / 100) * 360;
            return { ...g, startAngle, endAngle: cumAngle };
        });
    }, []);

    const polarToCart = (cx: number, cy: number, r: number, angleDeg: number) => {
        const rad = ((angleDeg - 90) * Math.PI) / 180;
        return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    };

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #29B6F6, #0277BD)' }}><span style={{ fontSize: 24 }}>💧</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-tab-row" role="tablist">
                            <button type="button" className={`vl-tab ${tab === 'air' ? 'active' : ''}`} onClick={() => setTab('air')}>🌬️ Air Composition</button>
                            <button type="button" className={`vl-tab ${tab === 'water' ? 'active' : ''}`} onClick={() => setTab('water')}>💧 Water Purification</button>
                        </div>
                    </div>

                    {tab === 'air' && (
                        <div className="vl-card">
                            <div className="vl-card-title">Composition of Air</div>
                            <div className="vl-canvas-wrap">
                                <svg className="vl-sim-svg" viewBox="0 0 300 240" role="img" aria-label="Air composition pie chart">
                                    {pieSlices.map((s, i) => {
                                        const largeArc = s.endAngle - s.startAngle > 180 ? 1 : 0;
                                        const start = polarToCart(130, 110, 80, s.startAngle);
                                        const end = polarToCart(130, 110, 80, s.endAngle);
                                        const mid = polarToCart(130, 110, 55, (s.startAngle + s.endAngle) / 2);
                                        const labelPos = polarToCart(130, 110, 100, (s.startAngle + s.endAngle) / 2);
                                        return (
                                            <g key={i}>
                                                <path d={`M 130 110 L ${start.x} ${start.y} A 80 80 0 ${largeArc} 1 ${end.x} ${end.y} Z`}
                                                    fill={s.color} opacity="0.6" stroke="#1a1a2e" strokeWidth="1" />
                                                {s.pct > 1 && (
                                                    <text x={mid.x} y={mid.y + 4} textAnchor="middle" fill="#FFF" fontSize="9" fontWeight="bold">{s.pct}%</text>
                                                )}
                                            </g>
                                        );
                                    })}

                                    {/* Legend */}
                                    {AIR_COMP.map((g, i) => (
                                        <g key={`l-${i}`}>
                                            <rect x="230" y={30 + i * 22} width="10" height="10" rx="2" fill={g.color} opacity="0.7" />
                                            <text x="245" y={39 + i * 22} fill="#B0BEC5" fontSize="8">{g.name} ({g.pct}%)</text>
                                        </g>
                                    ))}

                                    <text x="130" y="210" textAnchor="middle" fill="#90A4AE" fontSize="9">Clean, dry air — approximate %</text>
                                </svg>
                            </div>
                        </div>
                    )}

                    {tab === 'water' && (
                        <div className="vl-card">
                            <div className="vl-card-title">Water Purification Process</div>
                            <div className="vl-canvas-wrap">
                                <svg className="vl-sim-svg" viewBox="0 0 300 240" role="img" aria-label="Water purification steps">
                                    {PURIFICATION.map((step, i) => {
                                        const y = 25 + i * 42;
                                        const active = i === purStep;
                                        const done = i < purStep;
                                        return (
                                            <g key={step.id} className="vl-clickable" onClick={() => setPurStep(i)}>
                                                <rect x="20" y={y} width="260" height="36" rx="6"
                                                    fill={active ? '#29B6F630' : done ? '#4CAF5015' : '#26323815'}
                                                    stroke={active ? '#29B6F6' : done ? '#4CAF50' : '#37474F'} strokeWidth={active ? 2 : 1} />
                                                <circle cx="40" cy={y + 18} r="10" fill={done ? '#4CAF50' : active ? '#29B6F6' : '#37474F'} opacity="0.7" />
                                                <text x="40" y={y + 22} textAnchor="middle" fill="#FFF" fontSize="9" fontWeight="bold">{i + 1}</text>
                                                <text x="58" y={y + 15} fill={active ? '#FFF' : '#B0BEC5'} fontSize="10" fontWeight={active ? 'bold' : 'normal'}>{step.name}</text>
                                                <text x="58" y={y + 28} fill="#78909C" fontSize="7">{step.desc}</text>
                                            </g>
                                        );
                                    })}
                                </svg>
                            </div>
                            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                <button type="button" className="vl-btn secondary" disabled={purStep <= 0} onClick={() => setPurStep(purStep - 1)}>← Previous</button>
                                <button type="button" className="vl-btn primary" disabled={purStep >= PURIFICATION.length - 1} onClick={() => setPurStep(purStep + 1)}>Next →</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'air', text: 'Study air composition chart' },
                                { id: 'water', text: 'Study water purification process' },
                                { id: 'purification', text: 'Complete all purification steps' },
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
