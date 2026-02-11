import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

interface Metal { id: string; name: string; symbol: string; reactivity: number; color: string; }
const METALS: Metal[] = [
    { id: 'K', name: 'Potassium', symbol: 'K', reactivity: 10, color: '#9C27B0' },
    { id: 'Na', name: 'Sodium', symbol: 'Na', reactivity: 9, color: '#7B1FA2' },
    { id: 'Ca', name: 'Calcium', symbol: 'Ca', reactivity: 8, color: '#5C6BC0' },
    { id: 'Mg', name: 'Magnesium', symbol: 'Mg', reactivity: 7, color: '#42A5F5' },
    { id: 'Al', name: 'Aluminium', symbol: 'Al', reactivity: 6, color: '#26C6DA' },
    { id: 'Zn', name: 'Zinc', symbol: 'Zn', reactivity: 5, color: '#66BB6A' },
    { id: 'Fe', name: 'Iron', symbol: 'Fe', reactivity: 4, color: '#8D6E63' },
    { id: 'Cu', name: 'Copper', symbol: 'Cu', reactivity: 2, color: '#FF7043' },
    { id: 'Au', name: 'Gold', symbol: 'Au', reactivity: 1, color: '#FFD600' },
];

export function ReactivitySeriesLab({ simulation }: { simulation: SimulationMetadata }) {
    const [metalA, setMetalA] = useState<Metal>(METALS[3]); // Mg
    const [metalB, setMetalB] = useState<Metal>(METALS[7]); // Cu
    const [quizOpen, setQuizOpen] = useState(false);
    const [tick, setTick] = useState(0);
    useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 90); return () => clearInterval(id); }, []);

    const willDisplace = metalA.reactivity > metalB.reactivity;
    const reactionIntensity = useMemo(() => Math.abs(metalA.reactivity - metalB.reactivity), [metalA, metalB]);

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (willDisplace && reactionIntensity >= 5) n.add('strong-displacement');
        if (!willDisplace) n.add('no-reaction');
        if (metalA.reactivity >= 8) n.add('very-reactive');
        setCompleted(n);
    }, [metalA, metalB, willDisplace, reactionIntensity]);

    const progress = Math.round((completed.size / 3) * 100);
    const canTakeQuiz = completed.size >= 3;

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #FF9800, #E65100)' }}><span style={{ fontSize: 24 }}>⚗️</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Displacement Reaction</div>
                        <div className="vl-card-subtitle">
                            {willDisplace
                                ? `✅ ${metalA.name} displaces ${metalB.name} (more reactive)`
                                : metalA.id === metalB.id ? '⚠️ Same metal — no reaction' : `❌ No reaction — ${metalA.name} is less reactive than ${metalB.name}`}
                        </div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 260" role="img" aria-label="Displacement reaction">
                                {/* Beaker */}
                                <rect x="80" y="70" width="140" height="150" rx="8" fill="#263238" opacity="0.15" stroke="#546E7A" strokeWidth="2" />
                                {/* Solution */}
                                <rect x="82" y="100" width="136" height="118" rx="6" fill={metalB.color} opacity="0.15" />
                                <text x="150" y="92" textAnchor="middle" fill={metalB.color} fontSize="9" fontWeight="bold">{metalB.symbol}SO₄ solution</text>

                                {/* Metal strip being dipped in */}
                                <rect x="140" y="40" width="20" height="120" rx="3" fill={metalA.color} opacity="0.6" stroke={metalA.color} strokeWidth="1.5" />
                                <text x="150" y="35" textAnchor="middle" fill={metalA.color} fontSize="10" fontWeight="bold">{metalA.symbol} strip</text>

                                {/* Reaction visualization */}
                                {willDisplace && (
                                    <g>
                                        {/* Bubbles / fizzing */}
                                        {Array.from({ length: Math.min(12, reactionIntensity * 2) }).map((_, i) => {
                                            const phase = (tick * 0.02 + i * 0.2) % 1;
                                            return (
                                                <circle key={i} cx={100 + (i % 5) * 25 + Math.sin(tick * 0.03 + i) * 5}
                                                    cy={200 - phase * 100} r={2 + Math.sin(i) * 1}
                                                    fill={metalB.color} opacity={0.6 - phase * 0.4} />
                                            );
                                        })}
                                        {/* Displaced metal deposit */}
                                        <rect x="135" y={155 - reactionIntensity * 3} width="30" height={reactionIntensity * 5 + 10}
                                            rx="3" fill={metalB.color} opacity="0.5" />
                                        <text x="150" y="240" textAnchor="middle" fill="#4CAF50" fontSize="9" fontWeight="bold">
                                            {metalA.symbol} + {metalB.symbol}²⁺ → {metalA.symbol}²⁺ + {metalB.symbol}
                                        </text>
                                    </g>
                                )}
                                {!willDisplace && metalA.id !== metalB.id && (
                                    <text x="150" y="170" textAnchor="middle" fill="#FF5252" fontSize="11" fontWeight="bold">No reaction</text>
                                )}
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Reactivity Series</div>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {METALS.map(m => (
                                <div key={m.id} style={{ textAlign: 'center', padding: '4px 6px', background: m.color + '22', borderRadius: 6, fontSize: 11 }}>
                                    <div style={{ fontWeight: 'bold', color: m.color }}>{m.symbol}</div>
                                    <div style={{ color: '#B0BEC5', fontSize: 9 }}>{m.reactivity}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ fontSize: 10, color: '#78909C', marginTop: 6 }}>← Most reactive ... Least reactive →</div>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Select Metals</div>
                        <div className="vl-card-subtitle">Metal A (strip) dipped into Metal B's salt solution:</div>
                        <label className="vl-slider-label" style={{ marginTop: 8 }}>Metal A (strip):
                            <select className="vl-select" value={metalA.id} onChange={e => setMetalA(METALS.find(m => m.id === e.target.value)!)}>
                                {METALS.map(m => <option key={m.id} value={m.id}>{m.name} ({m.symbol}) — reactivity {m.reactivity}</option>)}
                            </select>
                        </label>
                        <label className="vl-slider-label" style={{ marginTop: 8 }}>Metal B (in solution):
                            <select className="vl-select" value={metalB.id} onChange={e => setMetalB(METALS.find(m => m.id === e.target.value)!)}>
                                {METALS.map(m => <option key={m.id} value={m.id}>{m.name} ({m.symbol}) — reactivity {m.reactivity}</option>)}
                            </select>
                        </label>
                    </div>

                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'strong-displacement', text: 'Cause a strong displacement (reactivity difference ≥ 5)' },
                                { id: 'no-reaction', text: 'Set up a combination with no reaction' },
                                { id: 'very-reactive', text: 'Use a very reactive metal (reactivity ≥ 8)' },
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
