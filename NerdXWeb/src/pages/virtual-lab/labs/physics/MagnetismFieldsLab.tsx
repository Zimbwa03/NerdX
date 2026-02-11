import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function MagnetismFieldsLab({ simulation }: { simulation: SimulationMetadata }) {
    const [spacing, setSpacing] = useState(120);
    const [polarity, setPolarity] = useState<'attract' | 'repel'>('attract');
    const [quizOpen, setQuizOpen] = useState(false);
    const [tick, setTick] = useState(0);
    useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 50); return () => clearInterval(id); }, []);

    // Field line density increases as magnets get closer
    const fieldStrength = useMemo(() => Math.round(1000 / Math.max(spacing, 30)), [spacing]);
    const lineCount = useMemo(() => Math.min(8, Math.max(3, Math.floor(fieldStrength / 3))), [fieldStrength]);

    const mag1X = 150 - spacing / 2;
    const mag2X = 150 + spacing / 2;

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (polarity === 'attract') n.add('attract');
        if (polarity === 'repel') n.add('repel');
        if (fieldStrength >= 20) n.add('strong');
        if (fieldStrength <= 10) n.add('weak');
        setCompleted(n);
    }, [polarity, fieldStrength]);

    const progress = Math.round((completed.size / 4) * 100);
    const canTakeQuiz = completed.size >= 3;

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #2196F3, #0D47A1)' }}><span style={{ fontSize: 24 }}>🧲</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Magnetic Field Lines</div>
                        <div className="vl-card-subtitle">
                            {polarity === 'attract' ? 'Unlike poles (N–S) — Attract' : 'Like poles (N–N) — Repel'} | Strength: <strong style={{ color: '#FF9800' }}>{fieldStrength}</strong>
                        </div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 220" role="img" aria-label="Magnetic field lines">
                                {/* Magnet 1 */}
                                <rect x={mag1X - 25} y="85" width="25" height="50" rx="3" fill="#EF5350" opacity="0.7" stroke="#C62828" strokeWidth="1.5" />
                                <text x={mag1X - 12} y="115" textAnchor="middle" fill="#FFF" fontSize="12" fontWeight="bold">N</text>
                                <rect x={mag1X} y="85" width="25" height="50" rx="3" fill="#42A5F5" opacity="0.7" stroke="#1565C0" strokeWidth="1.5" />
                                <text x={mag1X + 12} y="115" textAnchor="middle" fill="#FFF" fontSize="12" fontWeight="bold">S</text>

                                {/* Magnet 2 */}
                                {polarity === 'attract' ? (
                                    <>
                                        <rect x={mag2X - 25} y="85" width="25" height="50" rx="3" fill="#42A5F5" opacity="0.7" stroke="#1565C0" strokeWidth="1.5" />
                                        <text x={mag2X - 12} y="115" textAnchor="middle" fill="#FFF" fontSize="12" fontWeight="bold">S</text>
                                        <rect x={mag2X} y="85" width="25" height="50" rx="3" fill="#EF5350" opacity="0.7" stroke="#C62828" strokeWidth="1.5" />
                                        <text x={mag2X + 12} y="115" textAnchor="middle" fill="#FFF" fontSize="12" fontWeight="bold">N</text>
                                    </>
                                ) : (
                                    <>
                                        <rect x={mag2X - 25} y="85" width="25" height="50" rx="3" fill="#EF5350" opacity="0.7" stroke="#C62828" strokeWidth="1.5" />
                                        <text x={mag2X - 12} y="115" textAnchor="middle" fill="#FFF" fontSize="12" fontWeight="bold">N</text>
                                        <rect x={mag2X} y="85" width="25" height="50" rx="3" fill="#42A5F5" opacity="0.7" stroke="#1565C0" strokeWidth="1.5" />
                                        <text x={mag2X + 12} y="115" textAnchor="middle" fill="#FFF" fontSize="12" fontWeight="bold">S</text>
                                    </>
                                )}

                                {/* Field lines */}
                                {Array.from({ length: lineCount }).map((_, i) => {
                                    const yOff = (i - (lineCount - 1) / 2) * (40 / lineCount);
                                    const midX = (mag1X + 25 + mag2X - 25) / 2;

                                    if (polarity === 'attract') {
                                        // Curved lines from N to S across gap
                                        const bend = 20 + Math.abs(yOff) * 2;
                                        const animOff = Math.sin(tick * 0.03 + i) * 3;
                                        return (
                                            <path key={i}
                                                d={`M ${mag1X + 25} ${110 + yOff} Q ${midX} ${110 + yOff - bend + animOff} ${mag2X - 25} ${110 + yOff}`}
                                                fill="none" stroke="#90CAF9" strokeWidth="1.5" opacity="0.6" />
                                        );
                                    } else {
                                        // Repelling: lines curve away
                                        const animOff = Math.sin(tick * 0.03 + i) * 3;
                                        const bend = 30 + Math.abs(yOff) * 2;
                                        return (
                                            <g key={i}>
                                                <path d={`M ${mag1X + 25} ${110 + yOff} Q ${mag1X + 40} ${110 + yOff - bend + animOff} ${midX - 10} ${60 + Math.abs(yOff) * 0.5}`}
                                                    fill="none" stroke="#90CAF9" strokeWidth="1.5" opacity="0.6" />
                                                <path d={`M ${mag2X - 25} ${110 + yOff} Q ${mag2X - 40} ${110 + yOff - bend + animOff} ${midX + 10} ${60 + Math.abs(yOff) * 0.5}`}
                                                    fill="none" stroke="#90CAF9" strokeWidth="1.5" opacity="0.6" />
                                            </g>
                                        );
                                    }
                                })}

                                {/* Bottom field lines (mirror) */}
                                {Array.from({ length: lineCount }).map((_, i) => {
                                    const yOff = (i - (lineCount - 1) / 2) * (40 / lineCount);
                                    const midX = (mag1X + 25 + mag2X - 25) / 2;
                                    if (polarity === 'attract') {
                                        const bend = 20 + Math.abs(yOff) * 2;
                                        const animOff = Math.sin(tick * 0.03 + i) * 3;
                                        return (
                                            <path key={`b-${i}`}
                                                d={`M ${mag1X + 25} ${110 + yOff} Q ${midX} ${110 + yOff + bend - animOff} ${mag2X - 25} ${110 + yOff}`}
                                                fill="none" stroke="#90CAF9" strokeWidth="1.5" opacity="0.4" />
                                        );
                                    } else {
                                        const animOff = Math.sin(tick * 0.03 + i) * 3;
                                        const bend = 30 + Math.abs(yOff) * 2;
                                        return (
                                            <g key={`b-${i}`}>
                                                <path d={`M ${mag1X + 25} ${110 + yOff} Q ${mag1X + 40} ${110 + yOff + bend - animOff} ${midX - 10} ${160 - Math.abs(yOff) * 0.5}`}
                                                    fill="none" stroke="#90CAF9" strokeWidth="1.5" opacity="0.4" />
                                                <path d={`M ${mag2X - 25} ${110 + yOff} Q ${mag2X - 40} ${110 + yOff + bend - animOff} ${midX + 10} ${160 - Math.abs(yOff) * 0.5}`}
                                                    fill="none" stroke="#90CAF9" strokeWidth="1.5" opacity="0.4" />
                                            </g>
                                        );
                                    }
                                })}

                                {/* Force label */}
                                <text x="150" y="205" textAnchor="middle" fill={polarity === 'attract' ? '#4CAF50' : '#EF5350'} fontSize="10" fontWeight="bold">
                                    {polarity === 'attract' ? '← Attract →' : '→ Repel ←'}
                                </text>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                            <button type="button" className={`vl-template-btn ${polarity === 'attract' ? 'active' : ''}`} onClick={() => setPolarity('attract')} style={{ flex: 1 }}>
                                <div className="vl-template-title">Unlike (N–S)</div>
                            </button>
                            <button type="button" className={`vl-template-btn ${polarity === 'repel' ? 'active' : ''}`} onClick={() => setPolarity('repel')} style={{ flex: 1 }}>
                                <div className="vl-template-title">Like (N–N)</div>
                            </button>
                        </div>
                        <label className="vl-slider-label">Spacing: {spacing} px (closer = stronger)
                            <input type="range" min={60} max={200} step={5} value={spacing} onChange={e => setSpacing(+e.target.value)} className="vl-range" />
                        </label>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'attract', text: 'Observe attraction (unlike poles)' },
                                { id: 'repel', text: 'Observe repulsion (like poles)' },
                                { id: 'strong', text: 'Create a strong field (close magnets)' },
                                { id: 'weak', text: 'Create a weak field (far magnets)' },
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
