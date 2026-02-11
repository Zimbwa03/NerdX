import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

interface RadiationType { id: string; name: string; symbol: string; charge: string; mass: string; penetration: string; stoppedBy: string; ionising: string; color: string; range: number; }
const RADIATION: RadiationType[] = [
    { id: 'alpha', name: 'Alpha', symbol: 'α', charge: '+2', mass: '4 u', penetration: 'Very low', stoppedBy: 'Paper / skin', ionising: 'Very high', color: '#EF5350', range: 40 },
    { id: 'beta', name: 'Beta', symbol: 'β', charge: '-1', mass: '~0', penetration: 'Medium', stoppedBy: 'Thin aluminium', ionising: 'Medium', color: '#42A5F5', range: 100 },
    { id: 'gamma', name: 'Gamma', symbol: 'γ', charge: '0', mass: '0', penetration: 'Very high', stoppedBy: 'Thick lead / concrete', ionising: 'Low', color: '#4CAF50', range: 220 },
];

export function RadioactivityLab({ simulation }: { simulation: SimulationMetadata }) {
    const [selected, setSelected] = useState<RadiationType>(RADIATION[0]);
    const [halfLife, setHalfLife] = useState(10);
    const [quizOpen, setQuizOpen] = useState(false);
    const [tick, setTick] = useState(0);
    useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 50); return () => clearInterval(id); }, []);

    const [visited, setVisited] = useState<Set<string>>(new Set());
    useEffect(() => { setVisited(prev => new Set(prev).add(selected.id)); }, [selected.id]);

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (visited.has('alpha')) n.add('alpha');
        if (visited.has('beta')) n.add('beta');
        if (visited.has('gamma')) n.add('gamma');
        if (halfLife <= 5) n.add('fast');
        setCompleted(n);
    }, [visited, halfLife]);

    const progress = Math.round((completed.size / 4) * 100);
    const canTakeQuiz = completed.size >= 3;

    // Animated particles emitted from source
    const particles = useMemo(() => {
        return Array.from({ length: 6 }).map((_, i) => {
            const phase = ((tick * 0.015 + i * 0.15) % 1);
            const x = 60 + phase * selected.range;
            const ySpread = Math.sin(i * 2.1 + tick * 0.02) * (selected.id === 'gamma' ? 3 : selected.id === 'beta' ? 8 : 15);
            return { x, y: 110 + ySpread, opacity: 1 - phase * 0.7 };
        });
    }, [tick, selected]);

    // Half-life decay curve
    const decayCurve = useMemo(() => {
        const pts: string[] = [];
        for (let t = 0; t <= 50; t++) {
            const x = 30 + t * 4.4;
            const y = 195 - (Math.pow(0.5, t / halfLife) * 60);
            pts.push(`${x},${y}`);
        }
        return pts.join(' ');
    }, [halfLife]);

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #2196F3, #0D47A1)' }}><span style={{ fontSize: 24 }}>☢️</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">{selected.name} ({selected.symbol}) Radiation</div>
                        <div className="vl-card-subtitle">
                            Charge: {selected.charge} | Stopped by: <strong style={{ color: selected.color }}>{selected.stoppedBy}</strong>
                        </div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 220" role="img" aria-label="Radioactivity simulation">
                                {/* Source */}
                                <circle cx="50" cy="110" r="18" fill={selected.color} opacity="0.3" />
                                <circle cx="50" cy="110" r="10" fill={selected.color} opacity="0.5" />
                                <text x="50" y="114" textAnchor="middle" fill="#FFF" fontSize="10" fontWeight="bold">☢</text>

                                {/* Shielding barriers */}
                                {/* Paper */}
                                <rect x="100" y="85" width="4" height="50" rx="1" fill="#BCAAA4" opacity="0.7" />
                                <text x="102" y="80" textAnchor="middle" fill="#BCAAA4" fontSize="6">Paper</text>
                                {/* Aluminium */}
                                <rect x="160" y="85" width="8" height="50" rx="1" fill="#90A4AE" opacity="0.7" />
                                <text x="164" y="80" textAnchor="middle" fill="#90A4AE" fontSize="6">Al</text>
                                {/* Lead */}
                                <rect x="220" y="80" width="16" height="60" rx="2" fill="#546E7A" opacity="0.7" />
                                <text x="228" y="75" textAnchor="middle" fill="#78909C" fontSize="6">Lead</text>

                                {/* Animated radiation particles */}
                                {particles.map((p, i) => (
                                    <g key={i}>
                                        <circle cx={p.x} cy={p.y} r={selected.id === 'alpha' ? 4 : selected.id === 'beta' ? 2.5 : 1.5}
                                            fill={selected.color} opacity={p.opacity} />
                                        {selected.id === 'gamma' && (
                                            <line x1={p.x - 4} y1={p.y} x2={p.x + 4} y2={p.y} stroke={selected.color} strokeWidth="1" opacity={p.opacity * 0.6} />
                                        )}
                                    </g>
                                ))}

                                {/* "Stopped" indicators */}
                                {selected.id === 'alpha' && <text x="110" y="145" fill="#EF5350" fontSize="8" fontWeight="bold">✗ Stopped</text>}
                                {selected.id === 'beta' && <text x="170" y="145" fill="#42A5F5" fontSize="8" fontWeight="bold">✗ Stopped</text>}
                                {selected.id === 'gamma' && <text x="240" y="145" fill="#4CAF50" fontSize="8" fontWeight="bold">✗ Reduced</text>}

                                {/* Half-life decay curve */}
                                <text x="130" y="148" fill="#90A4AE" fontSize="7">Half-life decay (t½ = {halfLife}s)</text>
                                <polyline points={decayCurve} fill="none" stroke="#FFD600" strokeWidth="1.5" />
                                {/* Axes */}
                                <line x1="30" y1="195" x2="250" y2="195" stroke="#546E7A" strokeWidth="1" />
                                <line x1="30" y1="135" x2="30" y2="195" stroke="#546E7A" strokeWidth="1" />
                                <text x="140" y="210" textAnchor="middle" fill="#90A4AE" fontSize="6">Time →</text>
                                <text x="18" y="165" fill="#90A4AE" fontSize="6" transform="rotate(-90, 18, 165)">Activity</text>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <div className="vl-template-list">
                            {RADIATION.map(r => (
                                <button key={r.id} type="button" className={`vl-template-btn ${selected.id === r.id ? 'active' : ''}`} onClick={() => setSelected(r)}>
                                    <div className="vl-template-title">
                                        {r.symbol} {r.name}
                                        {visited.has(r.id) && <span className="vl-pill-mini" style={{ background: '#4CAF50' }}>✓</span>}
                                    </div>
                                    <div className="vl-template-desc">{r.penetration} penetration | {r.ionising} ionising</div>
                                </button>
                            ))}
                        </div>
                        <label className="vl-slider-label" style={{ marginTop: 8 }}>Half-life: {halfLife} s
                            <input type="range" min={2} max={30} step={1} value={halfLife} onChange={e => setHalfLife(+e.target.value)} className="vl-range" />
                        </label>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">{selected.name} Properties</div>
                        <div className="vl-meta">
                            <span className="vl-meta-item">Charge: {selected.charge}</span>
                            <span className="vl-meta-item">Mass: {selected.mass}</span>
                            <span className="vl-meta-item">Ionising: {selected.ionising}</span>
                            <span className="vl-meta-item">Stopped by: {selected.stoppedBy}</span>
                        </div>
                    </div>
                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'alpha', text: 'Explore alpha radiation' },
                                { id: 'beta', text: 'Explore beta radiation' },
                                { id: 'gamma', text: 'Explore gamma radiation' },
                                { id: 'fast', text: 'Set half-life ≤ 5 s (fast decay)' },
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
