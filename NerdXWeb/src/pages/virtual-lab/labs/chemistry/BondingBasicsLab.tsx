import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Atom } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

type BondType = 'ionic' | 'covalent' | 'metallic' | 'giant-covalent';
interface BondInfo { label: string; meltingPt: string; conducts: string; desc: string; }
const INFO: Record<BondType, BondInfo> = {
    ionic: { label: 'Ionic', meltingPt: 'High', conducts: 'When molten/aqueous', desc: 'Electrons transferred from metal → non-metal. Lattice of ions held by electrostatic attraction.' },
    covalent: { label: 'Simple Covalent', meltingPt: 'Low', conducts: 'No', desc: 'Atoms share electron pairs. Weak intermolecular forces between molecules.' },
    metallic: { label: 'Metallic', meltingPt: 'High', conducts: 'Yes (solid & liquid)', desc: 'Sea of delocalised electrons around positive metal ions. Strong electrostatic bonding.' },
    'giant-covalent': { label: 'Giant Covalent', meltingPt: 'Very high', conducts: 'No (except graphite)', desc: 'Continuous network of covalent bonds. Very strong throughout structure.' },
};

export function BondingBasicsLab({ simulation }: { simulation: SimulationMetadata }) {
    const [bondType, setBondType] = useState<BondType>('ionic');
    const [quizOpen, setQuizOpen] = useState(false);
    const [tick, setTick] = useState(0);
    useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 80); return () => clearInterval(id); }, []);

    const [visited, setVisited] = useState<Set<string>>(new Set());
    const selectBond = (b: BondType) => { setBondType(b); setVisited(prev => new Set(prev).add(b)); };
    const progress = Math.round((visited.size / 4) * 100);
    const canTakeQuiz = visited.size >= 4;
    const info = INFO[bondType];

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #FF9800, #E65100)' }}><Atom size={28} /></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">{info.label} Bonding</div>
                        <div className="vl-card-subtitle">{info.desc}</div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 260" role="img" aria-label={`${info.label} bonding diagram`}>
                                {bondType === 'ionic' && (
                                    <g>
                                        {/* Na+ and Cl- lattice */}
                                        {[0, 1, 2, 3, 4].map(r => [0, 1, 2, 3, 4].map(c => {
                                            const isPos = (r + c) % 2 === 0;
                                            const x = 55 + c * 48; const y = 40 + r * 44;
                                            return (
                                                <g key={`${r}-${c}`}>
                                                    <circle cx={x} cy={y} r="16" fill={isPos ? '#42A5F5' : '#EF5350'} opacity="0.7" />
                                                    <text x={x} y={y + 4} textAnchor="middle" fill="#FFF" fontSize="9" fontWeight="bold">{isPos ? 'Na⁺' : 'Cl⁻'}</text>
                                                </g>
                                            );
                                        }))}
                                        {/* Electron transfer arrow */}
                                        <text x="150" y="255" textAnchor="middle" fill="#FFD600" fontSize="10" fontWeight="bold">e⁻ transferred: Na → Cl</text>
                                    </g>
                                )}
                                {bondType === 'covalent' && (
                                    <g>
                                        {/* Two atoms sharing electrons */}
                                        <circle cx="120" cy="130" r="45" fill="#2196F3" opacity="0.15" stroke="#2196F3" strokeWidth="2" />
                                        <circle cx="180" cy="130" r="45" fill="#4CAF50" opacity="0.15" stroke="#4CAF50" strokeWidth="2" />
                                        <text x="100" y="90" fill="#2196F3" fontSize="12" fontWeight="bold">H</text>
                                        <text x="190" y="90" fill="#4CAF50" fontSize="12" fontWeight="bold">Cl</text>
                                        {/* Shared pair in overlap */}
                                        <circle cx={145 + Math.sin(tick * 0.04) * 3} cy={130} r="4" fill="#FFD600" />
                                        <circle cx={155 + Math.sin(tick * 0.04 + 1) * 3} cy={130} r="4" fill="#FFD600" />
                                        <text x="150" y="195" textAnchor="middle" fill="#FFD600" fontSize="10" fontWeight="bold">Shared electron pair</text>
                                        {/* Weak intermolecular forces */}
                                        <line x1="80" y1="210" x2="220" y2="210" stroke="#90A4AE" strokeWidth="1" strokeDasharray="5,3" />
                                        <text x="150" y="230" textAnchor="middle" fill="#90A4AE" fontSize="8">Weak intermolecular forces → low MP</text>
                                    </g>
                                )}
                                {bondType === 'metallic' && (
                                    <g>
                                        {/* Metal cation lattice with electron sea */}
                                        <rect x="40" y="30" width="220" height="180" rx="10" fill="#FFD600" opacity="0.08" />
                                        <text x="150" y="25" textAnchor="middle" fill="#FFD600" fontSize="8">Sea of delocalised electrons</text>
                                        {[0, 1, 2, 3].map(r => [0, 1, 2, 3, 4].map(c => {
                                            const x = 65 + c * 44; const y = 55 + r * 45;
                                            return (
                                                <g key={`${r}-${c}`}>
                                                    <circle cx={x} cy={y} r="14" fill="#78909C" opacity="0.5" stroke="#B0BEC5" strokeWidth="1.5" />
                                                    <text x={x} y={y + 4} textAnchor="middle" fill="#FFF" fontSize="8" fontWeight="bold">M⁺</text>
                                                </g>
                                            );
                                        }))}
                                        {/* Floating electrons */}
                                        {Array.from({ length: 10 }).map((_, i) => (
                                            <circle key={i} cx={60 + (i * 23 % 200) + Math.sin(tick * 0.03 + i) * 8}
                                                cy={45 + (i * 37 % 170) + Math.cos(tick * 0.025 + i * 2) * 6}
                                                r="3" fill="#FFD600" opacity="0.6" />
                                        ))}
                                        <text x="150" y="235" textAnchor="middle" fill="#B0BEC5" fontSize="9" fontWeight="bold">Conducts electricity in solid state</text>
                                    </g>
                                )}
                                {bondType === 'giant-covalent' && (
                                    <g>
                                        {/* Diamond-like network */}
                                        {[0, 1, 2, 3, 4].map(r => [0, 1, 2, 3, 4].map(c => {
                                            const x = 55 + c * 48 + (r % 2 === 0 ? 0 : 24);
                                            const y = 40 + r * 44;
                                            return <circle key={`${r}-${c}`} cx={x} cy={y} r="10" fill="#9C27B0" opacity="0.4" stroke="#CE93D8" strokeWidth="1.5" />;
                                        }))}
                                        {/* Bond lines */}
                                        {[0, 1, 2, 3, 4].map(r => [0, 1, 2, 3, 4].map(c => {
                                            const x = 55 + c * 48 + (r % 2 === 0 ? 0 : 24);
                                            const y = 40 + r * 44;
                                            if (c < 4) {
                                                const nx = 55 + (c + 1) * 48 + (r % 2 === 0 ? 0 : 24);
                                                return <line key={`h-${r}-${c}`} x1={x + 10} y1={y} x2={nx - 10} y2={y} stroke="#CE93D8" strokeWidth="2" opacity="0.5" />;
                                            }
                                            return null;
                                        }))}
                                        <text x="150" y="255" textAnchor="middle" fill="#CE93D8" fontSize="9" fontWeight="bold">Very high melting point — all bonds covalent</text>
                                    </g>
                                )}
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Properties</div>
                        <div className="vl-meta">
                            <span className="vl-meta-item">🌡️ Melting point: <strong>{info.meltingPt}</strong></span>
                            <span className="vl-meta-item">⚡ Conducts: <strong>{info.conducts}</strong></span>
                        </div>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Select Bond Type</div>
                        <div className="vl-template-list">
                            {(Object.keys(INFO) as BondType[]).map(b => (
                                <button key={b} type="button" className={`vl-template-btn ${bondType === b ? 'active' : ''}`} onClick={() => selectBond(b)}>
                                    <div className="vl-template-title">
                                        {INFO[b].label}
                                        {visited.has(b) && <span className="vl-pill-mini" style={{ background: '#4CAF50' }}>✓</span>}
                                    </div>
                                    <div className="vl-template-desc">{INFO[b].desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Progress</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-card-subtitle">Explore all 4 bonding types to unlock the quiz.</div>
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
