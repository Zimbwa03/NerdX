import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

interface FlowerPart {
    id: string; name: string; color: string; description: string; role: string;
}

const PARTS: FlowerPart[] = [
    { id: 'petal', name: 'Petals', color: '#E91E63', description: 'Brightly colored to attract pollinators', role: 'Attraction' },
    { id: 'sepal', name: 'Sepals', color: '#4CAF50', description: 'Green leaf-like structures protecting the bud', role: 'Protection' },
    { id: 'stamen', name: 'Stamen (♂)', color: '#FFD600', description: 'Male part: anther produces pollen; filament supports it', role: 'Produces pollen' },
    { id: 'anther', name: 'Anther', color: '#FF9800', description: 'Tip of stamen that holds pollen grains', role: 'Pollen production' },
    { id: 'carpel', name: 'Carpel / Pistil (♀)', color: '#AB47BC', description: 'Female part: stigma, style, and ovary', role: 'Receives pollen → fertilisation' },
    { id: 'stigma', name: 'Stigma', color: '#CE93D8', description: 'Sticky top that captures pollen grains', role: 'Pollen capture' },
    { id: 'ovary', name: 'Ovary', color: '#7B1FA2', description: 'Contains ovules; develops into fruit after fertilisation', role: 'Houses ovules → fruit' },
    { id: 'ovule', name: 'Ovule', color: '#9C27B0', description: 'Becomes the seed after fertilisation', role: 'Becomes seed' },
];

type PollinationType = 'insect' | 'wind';

export function FloweringPlantReproductionLab({ simulation }: { simulation: SimulationMetadata }) {
    const [selected, setSelected] = useState<FlowerPart | null>(null);
    const [visited, setVisited] = useState<Set<string>>(new Set());
    const [pollinationType, setPollinationType] = useState<PollinationType>('insect');
    const [quizOpen, setQuizOpen] = useState(false);

    const select = (p: FlowerPart) => { setSelected(p); setVisited(prev => new Set(prev).add(p.id)); };
    const progress = useMemo(() => Math.round((visited.size / PARTS.length) * 100), [visited]);
    const canTakeQuiz = visited.size >= 6;

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #E91E63, #880E4F)' }}><span style={{ fontSize: 24 }}>🌸</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Flower Anatomy & Pollination</div>
                        <div className="vl-card-subtitle">Click each part to explore. Toggle pollination type below.</div>

                        <div className="vl-row" style={{ marginBottom: 8 }}>
                            <div className="vl-tab-row" role="tablist">
                                {(['insect', 'wind'] as PollinationType[]).map(p => (
                                    <button key={p} type="button" className={`vl-tab ${pollinationType === p ? 'active' : ''}`} onClick={() => setPollinationType(p)}>
                                        {p === 'insect' ? '🐝 Insect-pollinated' : '💨 Wind-pollinated'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 280 260" role="img" aria-label="Flower diagram">
                                {/* Stem */}
                                <rect x="133" y="180" width="14" height="80" rx="3" fill="#4CAF50" opacity="0.4" />
                                {/* Receptacle */}
                                <ellipse cx="140" cy="180" rx="30" ry="10" fill="#66BB6A" opacity="0.3" />

                                {/* Sepals */}
                                <g onClick={() => select(PARTS[1])} className="vl-clickable">
                                    {[-30, 0, 30].map(a => (
                                        <ellipse key={a} cx={140 + Math.sin((a * Math.PI) / 180) * 35} cy={185 + Math.cos((a * Math.PI) / 180) * 10}
                                            rx="15" ry="8" fill="#4CAF50" opacity={selected?.id === 'sepal' ? 0.7 : 0.35}
                                            stroke={visited.has('sepal') ? '#00E676' : 'transparent'} strokeWidth="2" transform={`rotate(${a},${140 + Math.sin((a * Math.PI) / 180) * 35},${185})`} />
                                    ))}
                                </g>

                                {/* Petals */}
                                <g onClick={() => select(PARTS[0])} className="vl-clickable">
                                    {pollinationType === 'insect' ? (
                                        [0, 72, 144, 216, 288].map(a => (
                                            <ellipse key={a} cx={140 + Math.sin((a * Math.PI) / 180) * 45} cy={140 - Math.cos((a * Math.PI) / 180) * 35}
                                                rx={pollinationType === 'insect' ? 22 : 12} ry={pollinationType === 'insect' ? 30 : 20} fill="#E91E63"
                                                opacity={selected?.id === 'petal' ? 0.7 : 0.4}
                                                stroke={visited.has('petal') ? '#00E676' : 'transparent'} strokeWidth="2"
                                                transform={`rotate(${a},${140 + Math.sin((a * Math.PI) / 180) * 45},${140 - Math.cos((a * Math.PI) / 180) * 35})`} />
                                        ))
                                    ) : (
                                        [0, 120, 240].map(a => (
                                            <ellipse key={a} cx={140 + Math.sin((a * Math.PI) / 180) * 30} cy={140 - Math.cos((a * Math.PI) / 180) * 25}
                                                rx="8" ry="14" fill="#A5D6A7" opacity={selected?.id === 'petal' ? 0.6 : 0.3}
                                                stroke={visited.has('petal') ? '#00E676' : 'transparent'} strokeWidth="2"
                                                transform={`rotate(${a},${140 + Math.sin((a * Math.PI) / 180) * 30},${140 - Math.cos((a * Math.PI) / 180) * 25})`} />
                                        ))
                                    )}
                                </g>

                                {/* Stamen / Anther (filament + anther) */}
                                <g onClick={() => select(PARTS[2])} className="vl-clickable">
                                    {[- 20, 0, 20].map(dx => (
                                        <g key={dx}>
                                            <line x1={140 + dx} y1="170" x2={140 + dx * 1.5} y2="110" stroke="#FFD600" strokeWidth="1.5" />
                                        </g>
                                    ))}
                                </g>
                                <g onClick={() => select(PARTS[3])} className="vl-clickable">
                                    {[-20, 0, 20].map(dx => (
                                        <ellipse key={dx} cx={140 + dx * 1.5} cy="108" rx="6" ry="4" fill="#FF9800" opacity={selected?.id === 'anther' ? 0.9 : 0.6}
                                            stroke={visited.has('anther') ? '#00E676' : 'transparent'} strokeWidth="2" />
                                    ))}
                                </g>

                                {/* Carpel (stigma, style, ovary) */}
                                <g onClick={() => select(PARTS[4])} className="vl-clickable">
                                    <line x1="140" y1="170" x2="140" y2="90" stroke="#AB47BC" strokeWidth="2.5" />
                                </g>
                                <g onClick={() => select(PARTS[5])} className="vl-clickable">
                                    <circle cx="140" cy="88" r="6" fill="#CE93D8" opacity={selected?.id === 'stigma' ? 0.9 : 0.6}
                                        stroke={visited.has('stigma') ? '#00E676' : 'transparent'} strokeWidth="2" />
                                    <text x="140" y="78" textAnchor="middle" fill="#CE93D8" fontSize="7">Stigma</text>
                                </g>

                                {/* Ovary */}
                                <g onClick={() => select(PARTS[6])} className="vl-clickable">
                                    <ellipse cx="140" cy="178" rx="18" ry="12" fill="#7B1FA2" opacity={selected?.id === 'ovary' ? 0.6 : 0.3}
                                        stroke={visited.has('ovary') ? '#00E676' : 'transparent'} strokeWidth="2" />
                                    <text x="170" y="182" fill="#AB47BC" fontSize="7">Ovary</text>
                                </g>

                                {/* Ovule dots inside ovary */}
                                <g onClick={() => select(PARTS[7])} className="vl-clickable">
                                    {[0, 1, 2].map(i => (
                                        <circle key={i} cx={133 + i * 7} cy="178" r="3" fill="#E1BEE7" opacity={0.7}
                                            stroke={visited.has('ovule') ? '#00E676' : 'transparent'} strokeWidth="1" />
                                    ))}
                                </g>

                                {/* Pollinator */}
                                {pollinationType === 'insect' && <text x="230" y="95" fontSize="20">🐝</text>}
                                {pollinationType === 'wind' && <text x="20" y="100" fontSize="10" fill="#90CAF9">💨 wind</text>}
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">{selected ? selected.name : 'Select a flower part'}</div>
                        {selected ? (
                            <>
                                <div className="vl-card-subtitle"><strong>Role:</strong> {selected.role}</div>
                                <div className="vl-explanation">{selected.description}</div>
                            </>
                        ) : <div className="vl-card-subtitle">Click any part of the flower to learn its function.</div>}
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Insect vs Wind Pollination</div>
                        <div className="vl-explanation" style={{ fontSize: 13 }}>
                            {pollinationType === 'insect'
                                ? '🐝 Large, brightly colored petals with nectar & scent. Sticky pollen attaches to insects.'
                                : '💨 Small, dull petals (or none). Lightweight pollen released in large quantities. Feathery stigma catches airborne pollen.'}
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Progress</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-card-subtitle">{visited.size}/{PARTS.length} parts explored</div>
                    </div>
                    <div className="vl-card">
                        <div className="vl-card-title">Learning Objectives</div>
                        <ul className="vl-bullets">{simulation.learningObjectives.map(o => <li key={o.id}>{o.text}</li>)}</ul>
                    </div>
                    <div className="vl-card">
                        <div className="vl-card-title">Knowledge Check</div>
                        <div className="vl-card-subtitle">{canTakeQuiz ? 'Ready!' : 'Explore at least 6 parts to unlock.'}</div>
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
