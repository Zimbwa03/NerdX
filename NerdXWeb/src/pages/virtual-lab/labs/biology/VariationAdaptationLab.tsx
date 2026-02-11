import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Shuffle } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

interface Trait { id: string; name: string; type: 'continuous' | 'discontinuous'; values: string[]; description: string; }

const TRAITS: Trait[] = [
    { id: 'height', name: 'Height', type: 'continuous', values: ['Short', 'Medium-Short', 'Medium', 'Medium-Tall', 'Tall'], description: 'Controlled by many genes + environment. Shows normal distribution (bell curve).' },
    { id: 'blood', name: 'Blood Type', type: 'discontinuous', values: ['A', 'B', 'AB', 'O'], description: 'Controlled by a single gene with codominant alleles. Falls into distinct categories.' },
    { id: 'tongue', name: 'Tongue Rolling', type: 'discontinuous', values: ['Roller', 'Non-roller'], description: 'You can either roll your tongue or you cannot. No intermediate phenotype.' },
    { id: 'weight', name: 'Body Mass', type: 'continuous', values: ['Low', 'Below-avg', 'Average', 'Above-avg', 'High'], description: 'Influenced by diet (environment) and genetics. Continuous variation.' },
];

export function VariationAdaptationLab({ simulation }: { simulation: SimulationMetadata }) {
    const [selectedTrait, setSelectedTrait] = useState<Trait>(TRAITS[0]);
    const [sampleSize, setSampleSize] = useState(50);
    const [quizOpen, setQuizOpen] = useState(false);

    // Generate sample distribution
    const distribution = useMemo(() => {
        const counts = new Array(selectedTrait.values.length).fill(0);
        for (let i = 0; i < sampleSize; i++) {
            if (selectedTrait.type === 'continuous') {
                // Normal-ish distribution (central values more likely)
                const mid = (selectedTrait.values.length - 1) / 2;
                let idx = Math.round(mid + (Math.random() + Math.random() + Math.random() - 1.5) * mid * 0.8);
                idx = Math.max(0, Math.min(selectedTrait.values.length - 1, idx));
                counts[idx]++;
            } else {
                // Uniform / categorical
                const idx = Math.floor(Math.random() * selectedTrait.values.length);
                counts[idx]++;
            }
        }
        return counts;
    }, [selectedTrait, sampleSize]);

    const maxCount = Math.max(...distribution, 1);

    const [visited, setVisited] = useState<Set<string>>(new Set());
    const selectTrait = (t: Trait) => { setSelectedTrait(t); setVisited(prev => new Set(prev).add(t.id)); };

    const progress = Math.round((visited.size / TRAITS.length) * 100);
    const canTakeQuiz = visited.size >= 3;

    const barColors = ['#42A5F5', '#66BB6A', '#FF9800', '#AB47BC', '#EF5350'];

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #AB47BC, #6A1B9A)' }}><Shuffle size={28} /></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Distribution: {selectedTrait.name}</div>
                        <div className="vl-card-subtitle">Type: <strong>{selectedTrait.type}</strong> — {selectedTrait.description}</div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 220" role="img" aria-label="Variation distribution chart">
                                <line x1="40" y1="180" x2="280" y2="180" stroke="#546E7A" strokeWidth="1.5" />
                                <line x1="40" y1="180" x2="40" y2="30" stroke="#546E7A" strokeWidth="1.5" />
                                <text x="160" y="210" textAnchor="middle" fill="#90A4AE" fontSize="9">Phenotype</text>
                                <text x="12" y="105" textAnchor="middle" fill="#90A4AE" fontSize="9" transform="rotate(-90,12,105)">Frequency</text>

                                {/* Bars */}
                                {distribution.map((count, i) => {
                                    const barW = 200 / selectedTrait.values.length - 4;
                                    const barH = (count / maxCount) * 140;
                                    const x = 50 + i * (200 / selectedTrait.values.length);
                                    return (
                                        <g key={i}>
                                            <rect x={x} y={180 - barH} width={barW} height={barH} fill={barColors[i % barColors.length]} rx="3" opacity="0.7" />
                                            <text x={x + barW / 2} y={175 - barH} textAnchor="middle" fill="#FFF" fontSize="8" fontWeight="bold">{count}</text>
                                            <text x={x + barW / 2} y="195" textAnchor="middle" fill="#B0BEC5" fontSize="7">{selectedTrait.values[i]}</text>
                                        </g>
                                    );
                                })}

                                {/* Bell curve overlay for continuous */}
                                {selectedTrait.type === 'continuous' && (
                                    <polyline fill="none" stroke="#FFD600" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7"
                                        points={selectedTrait.values.map((_, i) => {
                                            const barW = 200 / selectedTrait.values.length;
                                            const x = 50 + i * barW + barW / 2 - 2;
                                            const y = 180 - (distribution[i] / maxCount) * 140;
                                            return `${x},${y}`;
                                        }).join(' ')} />
                                )}
                            </svg>
                        </div>
                        <button type="button" className="vl-btn secondary" style={{ marginTop: 8 }} onClick={() => setSelectedTrait({ ...selectedTrait })}>
                            🔄 Re-sample
                        </button>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">Sample size: {sampleSize}
                            <input type="range" min={10} max={200} value={sampleSize} onChange={e => setSampleSize(+e.target.value)} className="vl-range" />
                        </label>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Select a Trait</div>
                        <div className="vl-template-list">
                            {TRAITS.map(t => (
                                <button key={t.id} type="button" className={`vl-template-btn ${selectedTrait.id === t.id ? 'active' : ''}`} onClick={() => selectTrait(t)}>
                                    <div className="vl-template-title">
                                        {t.name}
                                        <span className="vl-pill-mini">{t.type}</span>
                                        {visited.has(t.id) && <span className="vl-pill-mini" style={{ background: '#4CAF50' }}>✓</span>}
                                    </div>
                                    <div className="vl-template-desc">{t.description}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Progress</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                    </div>
                    <div className="vl-card">
                        <div className="vl-card-title">Learning Objectives</div>
                        <ul className="vl-bullets">{simulation.learningObjectives.map(o => <li key={o.id}>{o.text}</li>)}</ul>
                    </div>
                    <div className="vl-card">
                        <div className="vl-card-title">Knowledge Check</div>
                        <div className="vl-card-subtitle">{canTakeQuiz ? 'Ready!' : 'Explore at least 3 traits.'}</div>
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
