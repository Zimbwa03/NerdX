import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

interface Organ {
    id: string; name: string; y: number; h: number; color: string; enzyme: string; action: string;
}

const ORGANS: Organ[] = [
    { id: 'mouth', name: 'Mouth', y: 10, h: 30, color: '#F48FB1', enzyme: 'Amylase', action: 'Mechanical & chemical digestion of starch → maltose' },
    { id: 'oesophagus', name: 'Oesophagus', y: 45, h: 20, color: '#CE93D8', enzyme: 'None', action: 'Peristalsis moves food bolus to stomach' },
    { id: 'stomach', name: 'Stomach', y: 70, h: 40, color: '#EF5350', enzyme: 'Pepsin (protease)', action: 'Protein digestion in acidic pH ~2. Churning action.' },
    { id: 'liver', name: 'Liver / Gall Bladder', y: 80, h: 20, color: '#8D6E63', enzyme: 'Bile (not enzyme)', action: 'Emulsifies fats → increases surface area for lipase' },
    { id: 'small-intestine', name: 'Small Intestine', y: 115, h: 50, color: '#FF9800', enzyme: 'Lipase, amylase, proteases', action: 'Final digestion & absorption via villi' },
    { id: 'large-intestine', name: 'Large Intestine', y: 170, h: 35, color: '#795548', enzyme: 'None', action: 'Water absorption; formation of faeces' },
    { id: 'rectum', name: 'Rectum / Anus', y: 210, h: 20, color: '#607D8B', enzyme: 'None', action: 'Storage & egestion of faeces' },
];

export function DigestiveJourneyLab({ simulation }: { simulation: SimulationMetadata }) {
    const [selected, setSelected] = useState<Organ | null>(null);
    const [visited, setVisited] = useState<Set<string>>(new Set());
    const [quizOpen, setQuizOpen] = useState(false);

    const select = (org: Organ) => {
        setSelected(org);
        setVisited(prev => new Set(prev).add(org.id));
    };

    const progress = useMemo(() => Math.round((visited.size / ORGANS.length) * 100), [visited]);
    const canTakeQuiz = visited.size === ORGANS.length;

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #FF9800, #E65100)' }}><span style={{ fontSize: 24 }}>🍽️</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Alimentary Canal</div>
                        <div className="vl-card-subtitle">Click each organ to explore its role in digestion.</div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 260 240" role="img" aria-label="Digestive system">
                                {/* Central tube */}
                                <rect x="100" y="10" width="60" height="220" rx="20" fill="#4E342E" opacity="0.12" />
                                {ORGANS.map(org => (
                                    <g key={org.id} onClick={() => select(org)} className="vl-clickable">
                                        <rect x="70" y={org.y} width="120" height={org.h} rx="10"
                                            fill={org.color} opacity={selected?.id === org.id ? 0.7 : 0.3}
                                            stroke={visited.has(org.id) ? '#00E676' : org.color}
                                            strokeWidth={visited.has(org.id) ? 3 : 1} />
                                        <text x="130" y={org.y + org.h / 2 + 4} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">{org.name}</text>
                                    </g>
                                ))}
                                {/* Arrow flow */}
                                {ORGANS.slice(0, -1).map((org, i) => (
                                    <line key={i} x1="130" y1={org.y + org.h} x2="130" y2={ORGANS[i + 1].y}
                                        stroke="#A1887F" strokeWidth="2" markerEnd="url(#dj-arrow)" />
                                ))}
                                <defs>
                                    <marker id="dj-arrow" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
                                        <path d="M0,0 L6,2.5 L0,5" fill="#A1887F" />
                                    </marker>
                                </defs>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">{selected ? selected.name : 'Select an organ'}</div>
                        {selected ? (
                            <>
                                <div className="vl-card-subtitle"><strong>Enzyme:</strong> {selected.enzyme}</div>
                                <div className="vl-explanation">{selected.action}</div>
                            </>
                        ) : (
                            <div className="vl-card-subtitle">Click an organ in the diagram to see its enzyme and action.</div>
                        )}
                    </div>

                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Progress</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-card-subtitle">{visited.size}/{ORGANS.length} organs explored</div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Learning Objectives</div>
                        <ul className="vl-bullets">{simulation.learningObjectives.map(o => <li key={o.id}>{o.text}</li>)}</ul>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Knowledge Check</div>
                        <div className="vl-card-subtitle">{canTakeQuiz ? 'Ready!' : 'Explore all organs to unlock.'}</div>
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
