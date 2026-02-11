import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, TreePine } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function EcosystemsConservationLab({ simulation }: { simulation: SimulationMetadata }) {
    const [deforestation, setDeforestation] = useState(30);
    const [pollution, setPollution] = useState(40);
    const [conservation, setConservation] = useState(50);
    const [quizOpen, setQuizOpen] = useState(false);

    const biodiversity = useMemo(() => {
        const base = 100;
        const loss = deforestation * 0.4 + pollution * 0.3;
        const gain = conservation * 0.5;
        return Math.max(0, Math.min(100, Math.round(base - loss + gain)));
    }, [deforestation, pollution, conservation]);

    const treeCount = useMemo(() => Math.max(1, Math.round(15 * (100 - deforestation) / 100)), [deforestation]);
    const animalCount = useMemo(() => Math.max(0, Math.round(biodiversity / 10)), [biodiversity]);
    const waterQuality = useMemo(() => Math.max(0, Math.round(100 - pollution * 0.8 + conservation * 0.2)), [pollution, conservation]);

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (biodiversity >= 80) n.add('high-bio');
        if (deforestation >= 80) n.add('deforested');
        if (conservation >= 80 && pollution <= 20) n.add('conserved');
        setCompleted(n);
    }, [biodiversity, deforestation, conservation, pollution]);

    const progress = Math.round((completed.size / 3) * 100);
    const canTakeQuiz = completed.size >= 3;

    // Tree positions
    const trees = useMemo(() => {
        const arr: { x: number; y: number }[] = [];
        for (let i = 0; i < treeCount; i++) {
            arr.push({ x: 30 + (i % 5) * 50 + (i * 13 % 20), y: 100 + Math.floor(i / 5) * 40 + (i * 7 % 15) });
        }
        return arr;
    }, [treeCount]);

    const animals = ['🦌', '🐦', '🦋', '🐸', '🐰', '🦔', '🐍', '🐝', '🦎', '🐟'];

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #2E7D32, #1B5E20)' }}><TreePine size={28} /></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Ecosystem Simulation</div>
                        <div className="vl-card-subtitle">
                            Biodiversity: <strong style={{ color: biodiversity > 60 ? '#4CAF50' : biodiversity > 30 ? '#FF9800' : '#FF5252' }}>{biodiversity}%</strong>
                            {' — '}Water quality: <strong style={{ color: waterQuality > 60 ? '#42A5F5' : '#FF9800' }}>{waterQuality}%</strong>
                        </div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 240" role="img" aria-label="Ecosystem simulation">
                                {/* Sky */}
                                <rect x="0" y="0" width="300" height="80" fill={pollution > 60 ? '#78909C' : '#81D4FA'} opacity="0.2" rx="4" />
                                {pollution > 50 && <text x="150" y="25" textAnchor="middle" fill="#78909C" fontSize="9">☁️ Pollution haze</text>}

                                {/* Ground */}
                                <rect x="0" y="180" width="300" height="60" fill="#4E342E" opacity={0.15 + (deforestation * 0.002)} rx="4" />

                                {/* Water body */}
                                <ellipse cx="240" cy="170" rx="40" ry="15" fill={waterQuality > 60 ? '#29B6F6' : waterQuality > 30 ? '#FFA726' : '#8D6E63'} opacity="0.3" />
                                <text x="240" y="174" textAnchor="middle" fill={waterQuality > 60 ? '#29B6F6' : '#8D6E63'} fontSize="7">Water: {waterQuality}%</text>

                                {/* Trees */}
                                {trees.map((t, i) => (
                                    <g key={i}>
                                        <rect x={t.x - 2} y={t.y + 12} width="4" height="12" fill="#5D4037" />
                                        <polygon points={`${t.x},${t.y - 8} ${t.x - 12},${t.y + 14} ${t.x + 12},${t.y + 14}`} fill="#43A047" opacity="0.7" />
                                        <polygon points={`${t.x},${t.y - 16} ${t.x - 9},${t.y + 4} ${t.x + 9},${t.y + 4}`} fill="#66BB6A" opacity="0.7" />
                                    </g>
                                ))}

                                {/* Animals */}
                                {Array.from({ length: animalCount }).map((_, i) => (
                                    <text key={i} x={50 + (i * 37 % 220)} y={140 + (i * 17 % 50)} fontSize="14">{animals[i % animals.length]}</text>
                                ))}

                                {/* Deforestation indicator */}
                                {deforestation > 50 && (
                                    <g>
                                        {Array.from({ length: Math.floor((deforestation - 50) / 10) }).map((_, i) => (
                                            <g key={`stump-${i}`}>
                                                <rect x={200 + i * 20} y="165" width="6" height="10" fill="#795548" opacity="0.5" />
                                                <line x1={200 + i * 20} y1="165" x2={207 + i * 20} y2="165" stroke="#795548" strokeWidth="2" />
                                            </g>
                                        ))}
                                    </g>
                                )}

                                {/* Conservation icon */}
                                {conservation > 60 && <text x="15" y="200" fontSize="14">🏕️</text>}

                                {/* Biodiversity gauge */}
                                <rect x="10" y="60" width="8" height="100" rx="4" fill="#263238" opacity="0.2" />
                                <rect x="12" y={160 - biodiversity} width="4" height={biodiversity} rx="2" fill={biodiversity > 60 ? '#4CAF50' : biodiversity > 30 ? '#FF9800' : '#FF5252'} />
                                <text x="14" y="56" textAnchor="middle" fill="#B0BEC5" fontSize="6">Bio</text>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Environmental Controls</div>
                        <label className="vl-slider-label">Deforestation: {deforestation}%
                            <input type="range" min={0} max={100} value={deforestation} onChange={e => setDeforestation(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Pollution: {pollution}%
                            <input type="range" min={0} max={100} value={pollution} onChange={e => setPollution(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Conservation effort: {conservation}%
                            <input type="range" min={0} max={100} value={conservation} onChange={e => setConservation(+e.target.value)} className="vl-range" />
                        </label>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Ecosystem Health</div>
                        <div className="vl-meta">
                            <span className="vl-meta-item">🌳 Trees: {treeCount}</span>
                            <span className="vl-meta-item">🐾 Species: {animalCount}</span>
                        </div>
                        <div className="vl-meta">
                            <span className="vl-meta-item">💧 Water: {waterQuality}%</span>
                            <span className="vl-meta-item">🌿 Biodiversity: {biodiversity}%</span>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'high-bio', text: 'Achieve biodiversity ≥ 80%' },
                                { id: 'deforested', text: 'Set deforestation ≥ 80% — see ecosystem collapse' },
                                { id: 'conserved', text: 'Conservation ≥ 80% with pollution ≤ 20%' },
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
                        <div className="vl-card-title">Knowledge Check</div>
                        <div className="vl-card-subtitle">{canTakeQuiz ? 'Ready!' : 'Complete all 3 tasks.'}</div>
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
