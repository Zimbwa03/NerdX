import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

interface ElementData { z: number; symbol: string; name: string; group: number; period: number; atomicRadius: number; firstIE: number; electronegativity: number; type: string; }
const ELEMENTS: ElementData[] = [
    { z: 1, symbol: 'H', name: 'Hydrogen', group: 1, period: 1, atomicRadius: 25, firstIE: 1312, electronegativity: 2.2, type: 'non-metal' },
    { z: 3, symbol: 'Li', name: 'Lithium', group: 1, period: 2, atomicRadius: 145, firstIE: 520, electronegativity: 1.0, type: 'metal' },
    { z: 4, symbol: 'Be', name: 'Beryllium', group: 2, period: 2, atomicRadius: 105, firstIE: 900, electronegativity: 1.6, type: 'metal' },
    { z: 5, symbol: 'B', name: 'Boron', group: 3, period: 2, atomicRadius: 85, firstIE: 801, electronegativity: 2.0, type: 'metalloid' },
    { z: 6, symbol: 'C', name: 'Carbon', group: 4, period: 2, atomicRadius: 70, firstIE: 1086, electronegativity: 2.6, type: 'non-metal' },
    { z: 7, symbol: 'N', name: 'Nitrogen', group: 5, period: 2, atomicRadius: 65, firstIE: 1400, electronegativity: 3.0, type: 'non-metal' },
    { z: 8, symbol: 'O', name: 'Oxygen', group: 6, period: 2, atomicRadius: 60, firstIE: 1314, electronegativity: 3.4, type: 'non-metal' },
    { z: 9, symbol: 'F', name: 'Fluorine', group: 7, period: 2, atomicRadius: 50, firstIE: 1681, electronegativity: 4.0, type: 'non-metal' },
    { z: 10, symbol: 'Ne', name: 'Neon', group: 8, period: 2, atomicRadius: 38, firstIE: 2081, electronegativity: 0.0, type: 'noble-gas' },
    { z: 11, symbol: 'Na', name: 'Sodium', group: 1, period: 3, atomicRadius: 180, firstIE: 496, electronegativity: 0.9, type: 'metal' },
    { z: 12, symbol: 'Mg', name: 'Magnesium', group: 2, period: 3, atomicRadius: 150, firstIE: 738, electronegativity: 1.3, type: 'metal' },
    { z: 13, symbol: 'Al', name: 'Aluminium', group: 3, period: 3, atomicRadius: 125, firstIE: 578, electronegativity: 1.6, type: 'metal' },
    { z: 14, symbol: 'Si', name: 'Silicon', group: 4, period: 3, atomicRadius: 110, firstIE: 786, electronegativity: 1.9, type: 'metalloid' },
    { z: 15, symbol: 'P', name: 'Phosphorus', group: 5, period: 3, atomicRadius: 100, firstIE: 1012, electronegativity: 2.2, type: 'non-metal' },
    { z: 16, symbol: 'S', name: 'Sulfur', group: 6, period: 3, atomicRadius: 100, firstIE: 1000, electronegativity: 2.6, type: 'non-metal' },
    { z: 17, symbol: 'Cl', name: 'Chlorine', group: 7, period: 3, atomicRadius: 79, firstIE: 1251, electronegativity: 3.2, type: 'non-metal' },
    { z: 18, symbol: 'Ar', name: 'Argon', group: 8, period: 3, atomicRadius: 71, firstIE: 1521, electronegativity: 0.0, type: 'noble-gas' },
    { z: 19, symbol: 'K', name: 'Potassium', group: 1, period: 4, atomicRadius: 220, firstIE: 419, electronegativity: 0.8, type: 'metal' },
    { z: 20, symbol: 'Ca', name: 'Calcium', group: 2, period: 4, atomicRadius: 180, firstIE: 590, electronegativity: 1.0, type: 'metal' },
];

type TrendProp = 'atomicRadius' | 'firstIE' | 'electronegativity';
const PROP_LABELS: Record<TrendProp, string> = { atomicRadius: 'Atomic Radius (pm)', firstIE: '1st Ionisation Energy (kJ/mol)', electronegativity: 'Electronegativity' };
const PROP_COLORS: Record<TrendProp, string> = { atomicRadius: '#42A5F5', firstIE: '#FF9800', electronegativity: '#4CAF50' };

export function PeriodicTrendsLab({ simulation }: { simulation: SimulationMetadata }) {
    const [prop, setProp] = useState<TrendProp>('atomicRadius');
    const [selectedElement, setSelectedElement] = useState<ElementData>(ELEMENTS[9]);
    const [quizOpen, setQuizOpen] = useState(false);

    const [visited, setVisited] = useState<Set<string>>(new Set());
    useEffect(() => { setVisited(prev => new Set(prev).add(prop)); }, [prop]);

    const progress = Math.round((visited.size / 3) * 100);
    const canTakeQuiz = visited.size >= 3;

    // Group elements by period for mini periodic table
    const periods = useMemo(() => {
        const p: Record<number, ElementData[]> = {};
        for (const el of ELEMENTS) {
            if (!p[el.period]) p[el.period] = [];
            p[el.period].push(el);
        }
        return p;
    }, []);

    // Normalize value for color intensity
    const maxVal = useMemo(() => Math.max(...ELEMENTS.map(e => e[prop])), [prop]);

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #FF9800, #E65100)' }}><span style={{ fontSize: 24 }}>📊</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">{PROP_LABELS[prop]}</div>
                        <div className="vl-card-subtitle">Click an element to inspect. Colour intensity shows relative {PROP_LABELS[prop].toLowerCase()}.</div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 340 220" role="img" aria-label="Mini periodic table">
                                {Object.entries(periods).map(([p, els]) => {
                                    const pNum = Number(p);
                                    return els.map(el => {
                                        const intensity = maxVal > 0 ? el[prop] / maxVal : 0;
                                        const cx = (el.group - 1) * 38 + 30;
                                        const cy = (pNum - 1) * 44 + 30;
                                        const isSel = selectedElement.z === el.z;
                                        return (
                                            <g key={el.z} className="vl-clickable" onClick={() => setSelectedElement(el)}>
                                                <rect x={cx - 15} y={cy - 13} width="30" height="26" rx="4"
                                                    fill={PROP_COLORS[prop]} opacity={0.15 + intensity * 0.55}
                                                    stroke={isSel ? '#FFF' : 'transparent'} strokeWidth={isSel ? 2 : 0} />
                                                <text x={cx} y={cy + 1} textAnchor="middle" fill="#FFF" fontSize="9" fontWeight="bold">{el.symbol}</text>
                                                <text x={cx} y={cy + 10} textAnchor="middle" fill="#90A4AE" fontSize="5">{el.z}</text>
                                            </g>
                                        );
                                    });
                                })}
                                {/* Period labels */}
                                {[1, 2, 3, 4].map(p => (
                                    <text key={p} x="5" y={(p - 1) * 44 + 33} fill="#78909C" fontSize="8">P{p}</text>
                                ))}
                                {/* Group labels */}
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <text key={i} x={(i * 38) + 30} y="12" textAnchor="middle" fill="#78909C" fontSize="7">G{i + 1}</text>
                                ))}
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">{selectedElement.name} ({selectedElement.symbol})</div>
                        <div className="vl-meta">
                            <span className="vl-meta-item">Z = {selectedElement.z}</span>
                            <span className="vl-meta-item">Group {selectedElement.group} Period {selectedElement.period}</span>
                            <span className="vl-meta-item" style={{ textTransform: 'capitalize' }}>{selectedElement.type}</span>
                        </div>
                        <div className="vl-meta" style={{ marginTop: 6 }}>
                            <span className="vl-meta-item">Radius: {selectedElement.atomicRadius} pm</span>
                            <span className="vl-meta-item">IE₁: {selectedElement.firstIE} kJ/mol</span>
                            <span className="vl-meta-item">EN: {selectedElement.electronegativity}</span>
                        </div>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Select Property</div>
                        <div className="vl-template-list">
                            {(Object.keys(PROP_LABELS) as TrendProp[]).map(t => (
                                <button key={t} type="button" className={`vl-template-btn ${prop === t ? 'active' : ''}`} onClick={() => setProp(t)}>
                                    <div className="vl-template-title">
                                        {PROP_LABELS[t]}
                                        {visited.has(t) && <span className="vl-pill-mini" style={{ background: '#4CAF50' }}>✓</span>}
                                    </div>
                                    <div className="vl-template-desc" style={{ fontSize: 11 }}>
                                        {t === 'atomicRadius' && '↓ Down group: increases. → Across period: decreases.'}
                                        {t === 'firstIE' && '↓ Down group: decreases. → Across period: increases.'}
                                        {t === 'electronegativity' && '↓ Down group: decreases. → Across period: increases.'}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Progress</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-card-subtitle">Explore all 3 properties to unlock the quiz.</div>
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
