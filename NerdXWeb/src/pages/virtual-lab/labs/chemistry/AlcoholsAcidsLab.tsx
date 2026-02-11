import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

type FunctionalGroup = 'alcohol' | 'carboxylic-acid';
interface Compound { id: string; name: string; formula: string; group: FunctionalGroup; props: string; reaction: string; }
const COMPOUNDS: Compound[] = [
    { id: 'methanol', name: 'Methanol', formula: 'CH₃OH', group: 'alcohol', props: 'Colourless liquid, toxic, miscible with water', reaction: 'Burns: 2CH₃OH + 3O₂ → 2CO₂ + 4H₂O' },
    { id: 'ethanol', name: 'Ethanol', formula: 'C₂H₅OH', group: 'alcohol', props: 'Colourless liquid, soluble in water, used in drinks', reaction: 'Fermentation: C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂' },
    { id: 'methanoic', name: 'Methanoic acid', formula: 'HCOOH', group: 'carboxylic-acid', props: 'Simplest carboxylic acid, strong smell, weak acid', reaction: 'HCOOH + NaOH → HCOONa + H₂O' },
    { id: 'ethanoic', name: 'Ethanoic acid', formula: 'CH₃COOH', group: 'carboxylic-acid', props: 'Found in vinegar, weak acid, pH ~3', reaction: 'CH₃COOH + NaOH → CH₃COONa + H₂O' },
];

export function AlcoholsAcidsLab({ simulation }: { simulation: SimulationMetadata }) {
    const [selected, setSelected] = useState<Compound>(COMPOUNDS[0]);
    const [quizOpen, setQuizOpen] = useState(false);

    const [visited, setVisited] = useState<Set<string>>(new Set());
    const selectCompound = (c: Compound) => { setSelected(c); setVisited(prev => new Set(prev).add(c.id)); };

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        const visitedAlc = [...visited].some(v => COMPOUNDS.find(c => c.id === v)?.group === 'alcohol');
        const visitedAcid = [...visited].some(v => COMPOUNDS.find(c => c.id === v)?.group === 'carboxylic-acid');
        if (visitedAlc) n.add('alcohol');
        if (visitedAcid) n.add('acid');
        if (visited.size >= 4) n.add('all');
        setCompleted(n);
    }, [visited]);

    const progress = Math.round((completed.size / 3) * 100);
    const canTakeQuiz = completed.size >= 3;

    const isAlcohol = selected.group === 'alcohol';

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #FF9800, #E65100)' }}><span style={{ fontSize: 24 }}>🧪</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">{selected.name} ({selected.formula})</div>
                        <div className="vl-card-subtitle">Functional group: <strong style={{ color: isAlcohol ? '#42A5F5' : '#EF5350' }}>{isAlcohol ? '−OH (Hydroxyl)' : '−COOH (Carboxyl)'}</strong></div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 220" role="img" aria-label={`${selected.name} functional group`}>
                                {isAlcohol ? (
                                    <g>
                                        {/* C-OH group */}
                                        <circle cx="120" cy="110" r="18" fill="#37474F" opacity="0.6" />
                                        <text x="120" y="115" textAnchor="middle" fill="#FFF" fontSize="14" fontWeight="bold">C</text>
                                        <line x1="138" y1="110" x2="170" y2="110" stroke="#42A5F5" strokeWidth="3" />
                                        <circle cx="190" cy="110" r="18" fill="#42A5F5" opacity="0.4" stroke="#42A5F5" strokeWidth="2" />
                                        <text x="190" y="115" textAnchor="middle" fill="#FFF" fontSize="14" fontWeight="bold">O</text>
                                        <line x1="208" y1="110" x2="230" y2="110" stroke="#B0BEC5" strokeWidth="2" />
                                        <circle cx="240" cy="110" r="10" fill="#E0E0E0" opacity="0.5" />
                                        <text x="240" y="114" textAnchor="middle" fill="#37474F" fontSize="10" fontWeight="bold">H</text>
                                        <text x="155" y="80" textAnchor="middle" fill="#42A5F5" fontSize="11" fontWeight="bold">−OH</text>
                                        <text x="150" y="170" textAnchor="middle" fill="#90A4AE" fontSize="10">Hydroxyl group</text>
                                        <text x="150" y="190" textAnchor="middle" fill="#42A5F5" fontSize="9">Soluble in water, burns as fuel</text>
                                    </g>
                                ) : (
                                    <g>
                                        {/* C-COOH group */}
                                        <circle cx="100" cy="110" r="18" fill="#37474F" opacity="0.6" />
                                        <text x="100" y="115" textAnchor="middle" fill="#FFF" fontSize="14" fontWeight="bold">C</text>
                                        {/* C=O */}
                                        <line x1="118" y1="102" x2="150" y2="82" stroke="#EF5350" strokeWidth="3" />
                                        <line x1="118" y1="108" x2="150" y2="88" stroke="#EF5350" strokeWidth="2" />
                                        <circle cx="160" cy="78" r="14" fill="#EF5350" opacity="0.4" />
                                        <text x="160" y="82" textAnchor="middle" fill="#FFF" fontSize="12" fontWeight="bold">O</text>
                                        {/* C-O-H */}
                                        <line x1="118" y1="118" x2="150" y2="140" stroke="#42A5F5" strokeWidth="3" />
                                        <circle cx="160" cy="145" r="14" fill="#42A5F5" opacity="0.4" />
                                        <text x="160" y="149" textAnchor="middle" fill="#FFF" fontSize="12" fontWeight="bold">O</text>
                                        <line x1="174" y1="145" x2="196" y2="145" stroke="#B0BEC5" strokeWidth="2" />
                                        <circle cx="206" cy="145" r="10" fill="#E0E0E0" opacity="0.5" />
                                        <text x="206" y="149" textAnchor="middle" fill="#37474F" fontSize="10" fontWeight="bold">H</text>
                                        <text x="150" y="55" textAnchor="middle" fill="#EF5350" fontSize="11" fontWeight="bold">−COOH</text>
                                        <text x="150" y="185" textAnchor="middle" fill="#90A4AE" fontSize="10">Carboxyl group</text>
                                        <text x="150" y="205" textAnchor="middle" fill="#EF5350" fontSize="9">Weak acid, reacts with bases</text>
                                    </g>
                                )}
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Properties & Reaction</div>
                        <div className="vl-explanation" style={{ fontSize: 12 }}>{selected.props}</div>
                        <div className="vl-explanation" style={{ fontSize: 12, marginTop: 6, fontFamily: 'monospace', color: '#FFD600' }}>{selected.reaction}</div>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Select Compound</div>
                        <div className="vl-template-list">
                            {COMPOUNDS.map(c => (
                                <button key={c.id} type="button" className={`vl-template-btn ${selected.id === c.id ? 'active' : ''}`} onClick={() => selectCompound(c)}>
                                    <div className="vl-template-title">
                                        {c.name}
                                        <span className="vl-pill-mini" style={{ background: c.group === 'alcohol' ? '#42A5F5' : '#EF5350' }}>{c.group === 'alcohol' ? '−OH' : '−COOH'}</span>
                                        {visited.has(c.id) && <span className="vl-pill-mini" style={{ background: '#4CAF50' }}>✓</span>}
                                    </div>
                                    <div className="vl-template-desc">{c.formula}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'alcohol', text: 'Explore at least one alcohol (−OH)' },
                                { id: 'acid', text: 'Explore at least one carboxylic acid (−COOH)' },
                                { id: 'all', text: 'Explore all 4 compounds' },
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
