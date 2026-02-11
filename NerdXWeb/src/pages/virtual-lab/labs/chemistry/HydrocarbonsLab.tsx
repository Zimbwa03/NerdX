import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

interface Hydrocarbon { id: string; name: string; formula: string; type: 'alkane' | 'alkene'; carbons: number; }
const HYDROCARBONS: Hydrocarbon[] = [
    { id: 'methane', name: 'Methane', formula: 'CH₄', type: 'alkane', carbons: 1 },
    { id: 'ethane', name: 'Ethane', formula: 'C₂H₆', type: 'alkane', carbons: 2 },
    { id: 'propane', name: 'Propane', formula: 'C₃H₈', type: 'alkane', carbons: 3 },
    { id: 'butane', name: 'Butane', formula: 'C₄H₁₀', type: 'alkane', carbons: 4 },
    { id: 'ethene', name: 'Ethene', formula: 'C₂H₄', type: 'alkene', carbons: 2 },
    { id: 'propene', name: 'Propene', formula: 'C₃H₆', type: 'alkene', carbons: 3 },
    { id: 'butene', name: 'But-1-ene', formula: 'C₄H₈', type: 'alkene', carbons: 4 },
];

export function HydrocarbonsLab({ simulation }: { simulation: SimulationMetadata }) {
    const [selected, setSelected] = useState<Hydrocarbon>(HYDROCARBONS[0]);
    const [bromineTest, setBromineTest] = useState(false);
    const [quizOpen, setQuizOpen] = useState(false);

    const isSaturated = selected.type === 'alkane';
    const generalFormula = isSaturated ? `CₙH₂ₙ₊₂` : `CₙH₂ₙ`;
    const bromineResult = isSaturated ? 'Stays orange (no reaction)' : 'Decolourises (C=C reacts)';

    const [visited, setVisited] = useState<Set<string>>(new Set());
    const selectHC = (h: Hydrocarbon) => { setSelected(h); setVisited(prev => new Set(prev).add(h.id)); };

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useMemo(() => {
        const n = new Set(completed);
        if (visited.size >= 3 && [...visited].some(v => HYDROCARBONS.find(h => h.id === v)?.type === 'alkane')) n.add('alkane');
        if (visited.size >= 3 && [...visited].some(v => HYDROCARBONS.find(h => h.id === v)?.type === 'alkene')) n.add('alkene');
        if (bromineTest) n.add('bromine');
        setCompleted(n);
    }, [visited, bromineTest]);

    const progress = Math.round((completed.size / 3) * 100);
    const canTakeQuiz = completed.size >= 3;

    // Draw molecular structure
    const bonds = useMemo(() => {
        const atoms: { x: number; y: number; label: string }[] = [];
        const lines: { x1: number; y1: number; x2: number; y2: number; double?: boolean }[] = [];
        const startX = 150 - (selected.carbons - 1) * 30;
        for (let i = 0; i < selected.carbons; i++) {
            const cx = startX + i * 60;
            atoms.push({ x: cx, y: 120, label: 'C' });
            if (i < selected.carbons - 1) {
                const isDouble = !isSaturated && i === 0;
                lines.push({ x1: cx + 12, y1: 120, x2: cx + 48, y2: 120, double: isDouble });
            }
            // H atoms
            const hCount = i === 0 || i === selected.carbons - 1
                ? (isSaturated ? 3 : (i === 0 && !isSaturated ? 2 : (i === selected.carbons - 1 ? (selected.carbons === 2 && !isSaturated ? 2 : 3) : 2)))
                : 2;
            if (hCount >= 1) { atoms.push({ x: cx, y: 80, label: 'H' }); lines.push({ x1: cx, y1: 110, x2: cx, y2: 90 }); }
            if (hCount >= 2) { atoms.push({ x: cx, y: 160, label: 'H' }); lines.push({ x1: cx, y1: 130, x2: cx, y2: 150 }); }
            if (hCount >= 3) { atoms.push({ x: cx + 20, y: 80, label: 'H' }); lines.push({ x1: cx + 8, y1: 112, x2: cx + 16, y2: 88 }); }
        }
        return { atoms, lines };
    }, [selected, isSaturated]);

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #FF9800, #E65100)' }}><span style={{ fontSize: 24 }}>⛽</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">{selected.name} ({selected.formula})</div>
                        <div className="vl-card-subtitle">
                            Type: <strong style={{ color: isSaturated ? '#42A5F5' : '#4CAF50' }}>{isSaturated ? 'Alkane (saturated)' : 'Alkene (unsaturated)'}</strong>
                            {' — '}General formula: {generalFormula}
                        </div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 220" role="img" aria-label={`${selected.name} structure`}>
                                {bonds.lines.map((l, i) => (
                                    <g key={`l-${i}`}>
                                        <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.double ? '#4CAF50' : '#B0BEC5'} strokeWidth={l.double ? 3 : 2} />
                                        {l.double && <line x1={l.x1} y1={l.y1 + 6} x2={l.x2} y2={l.y2 + 6} stroke="#4CAF50" strokeWidth="2" />}
                                    </g>
                                ))}
                                {bonds.atoms.map((a, i) => (
                                    <g key={`a-${i}`}>
                                        <circle cx={a.x} cy={a.y} r={a.label === 'C' ? 12 : 8}
                                            fill={a.label === 'C' ? '#37474F' : '#E0E0E0'} opacity="0.7" />
                                        <text x={a.x} y={a.y + 4} textAnchor="middle" fill={a.label === 'C' ? '#FFF' : '#37474F'}
                                            fontSize={a.label === 'C' ? 10 : 8} fontWeight="bold">{a.label}</text>
                                    </g>
                                ))}
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Bromine Water Test</div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#B0BEC5', fontSize: 13 }}>
                            <input type="checkbox" checked={bromineTest} onChange={e => setBromineTest(e.target.checked)} />
                            Add bromine water to {selected.name}
                        </label>
                        {bromineTest && (
                            <div className="vl-explanation" style={{ marginTop: 8, padding: 8, borderRadius: 6, background: isSaturated ? '#FF980020' : '#4CAF5020' }}>
                                <strong style={{ color: isSaturated ? '#FF9800' : '#4CAF50' }}>{bromineResult}</strong>
                            </div>
                        )}
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Select Hydrocarbon</div>
                        <div className="vl-template-list">
                            {HYDROCARBONS.map(h => (
                                <button key={h.id} type="button" className={`vl-template-btn ${selected.id === h.id ? 'active' : ''}`} onClick={() => selectHC(h)}>
                                    <div className="vl-template-title">
                                        {h.name} ({h.formula})
                                        <span className="vl-pill-mini" style={{ background: h.type === 'alkane' ? '#42A5F5' : '#4CAF50' }}>{h.type}</span>
                                        {visited.has(h.id) && <span className="vl-pill-mini" style={{ background: '#4CAF50' }}>✓</span>}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'alkane', text: 'Explore at least one alkane' },
                                { id: 'alkene', text: 'Explore at least one alkene' },
                                { id: 'bromine', text: 'Perform the bromine water test' },
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
