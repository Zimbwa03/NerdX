import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

interface Species { id: string; name: string; emoji: string; trophic: number; x: number; y: number; }

const SPECIES: Species[] = [
    { id: 'grass', name: 'Grass', emoji: '🌿', trophic: 0, x: 60, y: 240 },
    { id: 'tree', name: 'Tree', emoji: '🌳', trophic: 0, x: 180, y: 240 },
    { id: 'algae', name: 'Algae', emoji: '🟢', trophic: 0, x: 260, y: 240 },
    { id: 'grasshopper', name: 'Grasshopper', emoji: '🦗', trophic: 1, x: 50, y: 170 },
    { id: 'rabbit', name: 'Rabbit', emoji: '🐇', trophic: 1, x: 140, y: 170 },
    { id: 'caterpillar', name: 'Caterpillar', emoji: '🐛', trophic: 1, x: 230, y: 170 },
    { id: 'frog', name: 'Frog', emoji: '🐸', trophic: 2, x: 80, y: 100 },
    { id: 'bird', name: 'Bird', emoji: '🐦', trophic: 2, x: 200, y: 100 },
    { id: 'hawk', name: 'Hawk', emoji: '🦅', trophic: 3, x: 140, y: 35 },
];

const VALID_LINKS: [string, string][] = [
    ['grass', 'grasshopper'], ['grass', 'rabbit'], ['tree', 'caterpillar'],
    ['algae', 'caterpillar'], ['grasshopper', 'frog'], ['rabbit', 'hawk'],
    ['caterpillar', 'bird'], ['frog', 'hawk'], ['bird', 'hawk'],
];

export function EcologyFoodWebLab({ simulation }: { simulation: SimulationMetadata }) {
    const [links, setLinks] = useState<Set<string>>(new Set());
    const [selected, setSelected] = useState<string | null>(null);
    const [quizOpen, setQuizOpen] = useState(false);

    const handleClick = (id: string) => {
        if (!selected) { setSelected(id); return; }
        if (selected === id) { setSelected(null); return; }
        const key = `${selected}->${id}`;
        const reverseKey = `${id}->${selected}`;
        // Only allow correct direction (lower trophic → higher)
        const s1 = SPECIES.find(s => s.id === selected)!;
        const s2 = SPECIES.find(s => s.id === id)!;
        const from = s1.trophic < s2.trophic ? selected : id;
        const to = s1.trophic < s2.trophic ? id : selected;
        const linkKey = `${from}->${to}`;
        if (VALID_LINKS.some(([a, b]) => a === from && b === to)) {
            setLinks(prev => { const n = new Set(prev); n.add(linkKey); return n; });
        }
        setSelected(null);
    };

    const correctCount = useMemo(() => {
        let c = 0;
        VALID_LINKS.forEach(([a, b]) => { if (links.has(`${a}->${b}`)) c++; });
        return c;
    }, [links]);

    const progress = Math.round((correctCount / VALID_LINKS.length) * 100);
    const canTakeQuiz = correctCount >= 6;

    const trophicLabels = ['Producers', 'Primary Consumers', 'Secondary Consumers', 'Tertiary Consumer'];

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #66BB6A, #2E7D32)' }}><span style={{ fontSize: 24 }}>🕸️</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Food Web Builder</div>
                        <div className="vl-card-subtitle">Click two organisms to connect them (prey → predator). Build at least 6 links!</div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 320 280" role="img" aria-label="Food web">
                                {/* Trophic level bands */}
                                {[0, 1, 2, 3].map(i => (
                                    <g key={i}>
                                        <rect x="0" y={230 - i * 70} width="320" height="60" fill={['#E8F5E9', '#FFF3E0', '#FFEBEE', '#F3E5F5'][i]} opacity="0.15" rx="6" />
                                        <text x="308" y={260 - i * 70} fill="#9E9E9E" fontSize="7" textAnchor="end">{trophicLabels[i]}</text>
                                    </g>
                                ))}
                                {/* Links */}
                                {Array.from(links).map(key => {
                                    const [fromId, toId] = key.split('->');
                                    const from = SPECIES.find(s => s.id === fromId)!;
                                    const to = SPECIES.find(s => s.id === toId)!;
                                    return <line key={key} x1={from.x} y1={from.y - 10} x2={to.x} y2={to.y + 10} stroke="#4CAF50" strokeWidth="2" opacity="0.6" markerEnd="url(#fw-arrow)" />;
                                })}
                                {/* Species nodes */}
                                {SPECIES.map(sp => (
                                    <g key={sp.id} onClick={() => handleClick(sp.id)} className="vl-clickable">
                                        <circle cx={sp.x} cy={sp.y} r="18" fill={selected === sp.id ? '#FFD600' : '#263238'} opacity={selected === sp.id ? 0.5 : 0.2}
                                            stroke={selected === sp.id ? '#FFD600' : 'transparent'} strokeWidth="2" />
                                        <text x={sp.x} y={sp.y + 5} textAnchor="middle" fontSize="18">{sp.emoji}</text>
                                        <text x={sp.x} y={sp.y + 28} textAnchor="middle" fill="#B0BEC5" fontSize="8">{sp.name}</text>
                                    </g>
                                ))}
                                <defs>
                                    <marker id="fw-arrow" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
                                        <path d="M0,0 L6,2.5 L0,5" fill="#4CAF50" />
                                    </marker>
                                </defs>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Connections</div><div className="vl-section-meta">{correctCount}/{VALID_LINKS.length}</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-card-subtitle">Energy flows from producers → consumers. Click to connect organisms!</div>
                        <button type="button" className="vl-btn secondary" onClick={() => setLinks(new Set())} style={{ marginTop: 8 }}>Reset links</button>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Learning Objectives</div>
                        <ul className="vl-bullets">{simulation.learningObjectives.map(o => <li key={o.id}>{o.text}</li>)}</ul>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Knowledge Check</div>
                        <div className="vl-card-subtitle">{canTakeQuiz ? 'Ready!' : 'Build at least 6 correct links.'}</div>
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
