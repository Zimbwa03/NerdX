import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

type ReactionType = 'exothermic' | 'endothermic';

export function EnergyChangesLab({ simulation }: { simulation: SimulationMetadata }) {
    const [reactionType, setReactionType] = useState<ReactionType>('exothermic');
    const [energyChange, setEnergyChange] = useState(30);
    const [waterMass, setWaterMass] = useState(100);
    const [quizOpen, setQuizOpen] = useState(false);

    const tempChange = useMemo(() => {
        const sign = reactionType === 'exothermic' ? 1 : -1;
        return Math.round((sign * energyChange * 1000) / (waterMass * 4.2) * 10) / 10;
    }, [reactionType, energyChange, waterMass]);

    const activationEnergy = 60;
    const reactantEnergy = 80;
    const productEnergy = reactionType === 'exothermic' ? reactantEnergy - energyChange : reactantEnergy + energyChange;

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (reactionType === 'exothermic' && tempChange > 0) n.add('exo');
        if (reactionType === 'endothermic' && tempChange < 0) n.add('endo');
        if (Math.abs(tempChange) >= 50) n.add('large-change');
        setCompleted(n);
    }, [reactionType, tempChange]);

    const progress = Math.round((completed.size / 3) * 100);
    const canTakeQuiz = completed.size >= 3;

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #FF9800, #E65100)' }}><span style={{ fontSize: 24 }}>🔥</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Energy Profile Diagram</div>
                        <div className="vl-card-subtitle">
                            {reactionType === 'exothermic' ? '🔥 Exothermic — energy released to surroundings' : '❄️ Endothermic — energy absorbed from surroundings'}
                        </div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 240" role="img" aria-label="Energy profile diagram">
                                {/* Axes */}
                                <line x1="40" y1="200" x2="280" y2="200" stroke="#546E7A" strokeWidth="1.5" />
                                <line x1="40" y1="200" x2="40" y2="20" stroke="#546E7A" strokeWidth="1.5" />
                                <text x="160" y="220" textAnchor="middle" fill="#90A4AE" fontSize="9">Reaction progress →</text>
                                <text x="12" y="110" textAnchor="middle" fill="#90A4AE" fontSize="9" transform="rotate(-90,12,110)">Energy</text>

                                {/* Reactant level */}
                                <line x1="50" y1={200 - reactantEnergy * 1.8} x2="100" y2={200 - reactantEnergy * 1.8}
                                    stroke="#42A5F5" strokeWidth="2.5" />
                                <text x="75" y={200 - reactantEnergy * 1.8 - 8} textAnchor="middle" fill="#42A5F5" fontSize="9" fontWeight="bold">Reactants</text>

                                {/* Activation energy peak */}
                                <path d={`M 100 ${200 - reactantEnergy * 1.8} Q 145 ${200 - (reactantEnergy + activationEnergy) * 1.5} 190 ${200 - productEnergy * 1.8}`}
                                    fill="none" stroke="#FF9800" strokeWidth="2" />

                                {/* Product level */}
                                <line x1="190" y1={200 - productEnergy * 1.8} x2="260" y2={200 - productEnergy * 1.8}
                                    stroke={reactionType === 'exothermic' ? '#EF5350' : '#42A5F5'} strokeWidth="2.5" />
                                <text x="225" y={200 - productEnergy * 1.8 - 8} textAnchor="middle"
                                    fill={reactionType === 'exothermic' ? '#EF5350' : '#42A5F5'} fontSize="9" fontWeight="bold">Products</text>

                                {/* ΔH arrow */}
                                <line x1="135" y1={200 - reactantEnergy * 1.8} x2="135" y2={200 - productEnergy * 1.8}
                                    stroke="#FFD600" strokeWidth="2" markerEnd="url(#arrow)" />
                                <defs><marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#FFD600" /></marker></defs>
                                <text x="158" y={(200 - reactantEnergy * 1.8 + 200 - productEnergy * 1.8) / 2 + 4}
                                    fill="#FFD600" fontSize="9" fontWeight="bold">
                                    ΔH = {reactionType === 'exothermic' ? '-' : '+'}{energyChange} kJ
                                </text>

                                {/* Ea label */}
                                <text x="145" y={200 - (reactantEnergy + activationEnergy) * 1.5 + 15}
                                    textAnchor="middle" fill="#FF9800" fontSize="8">Ea</text>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Temperature Change</div>
                        <div className="vl-meta">
                            <span className="vl-meta-item" style={{ color: tempChange >= 0 ? '#EF5350' : '#42A5F5', fontSize: 18, fontWeight: 'bold' }}>
                                ΔT = {tempChange > 0 ? '+' : ''}{tempChange}°C
                            </span>
                        </div>
                        <div className="vl-explanation" style={{ fontSize: 12, marginTop: 4 }}>
                            Q = mcΔT → ΔT = Q / (m × c) = {energyChange * 1000} J / ({waterMass} g × 4.2 J/g°C)
                        </div>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <div className="vl-tab-row" role="tablist" style={{ marginBottom: 8 }}>
                            <button type="button" className={`vl-tab ${reactionType === 'exothermic' ? 'active' : ''}`} onClick={() => setReactionType('exothermic')}>🔥 Exothermic</button>
                            <button type="button" className={`vl-tab ${reactionType === 'endothermic' ? 'active' : ''}`} onClick={() => setReactionType('endothermic')}>❄️ Endothermic</button>
                        </div>
                        <label className="vl-slider-label">Energy change (|ΔH|): {energyChange} kJ
                            <input type="range" min={5} max={80} step={5} value={energyChange} onChange={e => setEnergyChange(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Water mass: {waterMass} g
                            <input type="range" min={50} max={500} step={10} value={waterMass} onChange={e => setWaterMass(+e.target.value)} className="vl-range" />
                        </label>
                    </div>

                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'exo', text: 'Observe an exothermic reaction (ΔT positive)' },
                                { id: 'endo', text: 'Observe an endothermic reaction (ΔT negative)' },
                                { id: 'large-change', text: 'Achieve |ΔT| ≥ 50°C' },
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
