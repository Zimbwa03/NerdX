import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

interface PolymerInfo { id: string; name: string; monomer: string; type: 'addition' | 'condensation'; uses: string; recyclable: boolean; color: string; }
const POLYMERS: PolymerInfo[] = [
    { id: 'polyethene', name: 'Poly(ethene)', monomer: 'Ethene (C₂H₄)', type: 'addition', uses: 'Bags, bottles, packaging', recyclable: true, color: '#42A5F5' },
    { id: 'polypropene', name: 'Poly(propene)', monomer: 'Propene (C₃H₆)', type: 'addition', uses: 'Ropes, carpets, containers', recyclable: true, color: '#4CAF50' },
    { id: 'pvc', name: 'PVC', monomer: 'Chloroethene (CH₂=CHCl)', type: 'addition', uses: 'Pipes, window frames, flooring', recyclable: false, color: '#FF9800' },
    { id: 'nylon', name: 'Nylon', monomer: 'Diamine + Dicarboxylic acid', type: 'condensation', uses: 'Clothes, ropes, gears', recyclable: false, color: '#E91E63' },
    { id: 'polyester', name: 'Polyester (PET)', monomer: 'Diol + Dicarboxylic acid', type: 'condensation', uses: 'Clothing, drink bottles', recyclable: true, color: '#9C27B0' },
];

export function PolymersMaterialsLab({ simulation }: { simulation: SimulationMetadata }) {
    const [selected, setSelected] = useState<PolymerInfo>(POLYMERS[0]);
    const [chainLength, setChainLength] = useState(5);
    const [quizOpen, setQuizOpen] = useState(false);

    const [visited, setVisited] = useState<Set<string>>(new Set());
    const selectPoly = (p: PolymerInfo) => { setSelected(p); setVisited(prev => new Set(prev).add(p.id)); };

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if ([...visited].some(v => POLYMERS.find(p => p.id === v)?.type === 'addition')) n.add('addition');
        if ([...visited].some(v => POLYMERS.find(p => p.id === v)?.type === 'condensation')) n.add('condensation');
        if (chainLength >= 8) n.add('long-chain');
        if (visited.size >= 4) n.add('many');
        setCompleted(n);
    }, [visited, chainLength]);

    const progress = Math.round((completed.size / 4) * 100);
    const canTakeQuiz = completed.size >= 3;

    // Draw polymer chain
    const chain = useMemo(() => {
        const nodes: { x: number; y: number }[] = [];
        for (let i = 0; i < chainLength; i++) {
            const x = 30 + i * ((280 - 30) / Math.max(chainLength - 1, 1));
            const y = 100 + (i % 2 === 0 ? -20 : 20);
            nodes.push({ x, y });
        }
        return nodes;
    }, [chainLength]);

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #FF9800, #E65100)' }}><span style={{ fontSize: 24 }}>🔗</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">{selected.name}</div>
                        <div className="vl-card-subtitle">
                            Type: <strong style={{ color: selected.type === 'addition' ? '#42A5F5' : '#E91E63' }}>
                                {selected.type === 'addition' ? 'Addition polymerisation' : 'Condensation polymerisation'}
                            </strong>
                        </div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 220" role="img" aria-label={`${selected.name} polymer chain`}>
                                {/* Polymer chain */}
                                {chain.map((node, i) => {
                                    if (i < chain.length - 1) {
                                        const next = chain[i + 1];
                                        return <line key={`l-${i}`} x1={node.x} y1={node.y} x2={next.x} y2={next.y}
                                            stroke={selected.color} strokeWidth="3" opacity="0.6" />;
                                    }
                                    return null;
                                })}
                                {chain.map((node, i) => (
                                    <g key={`n-${i}`}>
                                        <circle cx={node.x} cy={node.y} r="12" fill={selected.color} opacity="0.6" />
                                        <text x={node.x} y={node.y + 4} textAnchor="middle" fill="#FFF" fontSize="7" fontWeight="bold">
                                            {i === 0 || i === chain.length - 1 ? '…' : (i + 1).toString()}
                                        </text>
                                    </g>
                                ))}

                                {/* Brackets for repeating unit */}
                                {chainLength >= 3 && (
                                    <g>
                                        <text x={chain[1].x - 8} y={chain[1].y + 30} fill="#FFD600" fontSize="18">(</text>
                                        <text x={chain[2].x + 2} y={chain[2].y + 30} fill="#FFD600" fontSize="18">)</text>
                                        <text x={chain[2].x + 15} y={chain[2].y + 35} fill="#FFD600" fontSize="8">n</text>
                                    </g>
                                )}

                                {/* Monomer label */}
                                <text x="150" y="160" textAnchor="middle" fill="#90A4AE" fontSize="9">Monomer: {selected.monomer}</text>

                                {/* Type badge */}
                                <rect x="70" y="175" width="160" height="25" rx="6" fill={selected.type === 'addition' ? '#42A5F530' : '#E91E6330'} stroke={selected.type === 'addition' ? '#42A5F5' : '#E91E63'} strokeWidth="1" />
                                <text x="150" y="192" textAnchor="middle" fill={selected.type === 'addition' ? '#42A5F5' : '#E91E63'} fontSize="9" fontWeight="bold">
                                    {selected.type === 'addition' ? 'No by-product — C=C opens up' : 'Water (H₂O) released as by-product'}
                                </text>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Properties</div>
                        <div className="vl-meta">
                            <span className="vl-meta-item">🔧 Uses: {selected.uses}</span>
                            <span className="vl-meta-item">♻️ Recyclable: {selected.recyclable ? 'Yes' : 'No / Difficult'}</span>
                        </div>
                        <label className="vl-slider-label" style={{ marginTop: 8 }}>Chain length: {chainLength} monomers
                            <input type="range" min={3} max={10} value={chainLength} onChange={e => setChainLength(+e.target.value)} className="vl-range" />
                        </label>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Select Polymer</div>
                        <div className="vl-template-list">
                            {POLYMERS.map(p => (
                                <button key={p.id} type="button" className={`vl-template-btn ${selected.id === p.id ? 'active' : ''}`} onClick={() => selectPoly(p)}>
                                    <div className="vl-template-title">
                                        {p.name}
                                        <span className="vl-pill-mini" style={{ background: p.type === 'addition' ? '#42A5F5' : '#E91E63' }}>{p.type}</span>
                                        {visited.has(p.id) && <span className="vl-pill-mini" style={{ background: '#4CAF50' }}>✓</span>}
                                    </div>
                                    <div className="vl-template-desc">{p.monomer}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'addition', text: 'Explore an addition polymer' },
                                { id: 'condensation', text: 'Explore a condensation polymer' },
                                { id: 'long-chain', text: 'Build chain length ≥ 8' },
                                { id: 'many', text: 'Explore at least 4 polymers' },
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
