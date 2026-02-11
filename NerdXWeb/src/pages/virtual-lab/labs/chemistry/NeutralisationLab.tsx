import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function NeutralisationLab({ simulation }: { simulation: SimulationMetadata }) {
    const [acidVol, setAcidVol] = useState(50);
    const [baseVol, setBaseVol] = useState(30);
    const [acidStrength, setAcidStrength] = useState(5);
    const [quizOpen, setQuizOpen] = useState(false);

    const pH = useMemo(() => {
        const acidMoles = acidVol * acidStrength / 100;
        const baseMoles = baseVol * acidStrength / 100;
        const excess = acidMoles - baseMoles;
        if (Math.abs(excess) < 0.5) return 7;
        if (excess > 0) return Math.max(1, Math.round(7 - excess * 0.8));
        return Math.min(14, Math.round(7 - excess * 0.8));
    }, [acidVol, baseVol, acidStrength]);

    const solutionColor = useMemo(() => {
        if (pH <= 3) return '#EF5350';
        if (pH <= 6) return '#FF9800';
        if (pH === 7) return '#4CAF50';
        if (pH <= 10) return '#42A5F5';
        return '#7B1FA2';
    }, [pH]);

    const indicator = useMemo(() => {
        if (pH <= 3) return 'Red (strong acid)';
        if (pH <= 6) return 'Orange/Yellow (weak acid)';
        if (pH === 7) return 'Green (neutral)';
        if (pH <= 10) return 'Blue (weak base)';
        return 'Purple (strong base)';
    }, [pH]);

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (pH === 7) n.add('neutral');
        if (pH <= 2) n.add('strong-acid');
        if (pH >= 12) n.add('strong-base');
        setCompleted(n);
    }, [pH]);

    const progress = Math.round((completed.size / 3) * 100);
    const canTakeQuiz = completed.size >= 3;

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
                        <div className="vl-card-title">Neutralisation: Acid + Base → Salt + Water</div>
                        <div className="vl-card-subtitle">pH = <strong style={{ color: solutionColor }}>{pH}</strong> — {indicator}</div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 260" role="img" aria-label="Neutralisation simulation">
                                {/* pH Scale */}
                                {Array.from({ length: 15 }).map((_, i) => {
                                    const colors = ['#FF1744', '#FF5252', '#FF6E40', '#FF9100', '#FFD600', '#FFEB3B', '#C6FF00', '#76FF03', '#00E676', '#1DE9B6', '#00BCD4', '#29B6F6', '#448AFF', '#7C4DFF', '#AA00FF'];
                                    return (
                                        <g key={i}>
                                            <rect x={20 + i * 18} y="10" width="16" height="24" rx="3" fill={colors[i]} opacity={i === pH ? 1 : 0.4}
                                                stroke={i === pH ? '#FFF' : 'transparent'} strokeWidth="2" />
                                            <text x={28 + i * 18} y="27" textAnchor="middle" fill={i === pH ? '#FFF' : '#B0BEC5'} fontSize="8" fontWeight={i === pH ? 'bold' : 'normal'}>{i}</text>
                                        </g>
                                    );
                                })}
                                <text x="20" y="50" fill="#EF5350" fontSize="8">Acidic</text>
                                <text x="140" y="50" fill="#4CAF50" fontSize="8">Neutral</text>
                                <text x="245" y="50" fill="#7B1FA2" fontSize="8">Alkaline</text>

                                {/* Beaker */}
                                <rect x="90" y="70" width="120" height="140" rx="8" fill="#263238" opacity="0.15" stroke="#546E7A" strokeWidth="2" />
                                {/* Solution */}
                                <rect x="92" y={210 - Math.min(130, (acidVol + baseVol) * 0.8)} width="116"
                                    height={Math.min(130, (acidVol + baseVol) * 0.8)} rx="5" fill={solutionColor} opacity="0.35" />

                                {/* Acid being added */}
                                <rect x="70" y="60" width="30" height="50" rx="4" fill="#EF5350" opacity="0.3" stroke="#EF5350" strokeWidth="1" />
                                <text x="85" y="80" textAnchor="middle" fill="#EF5350" fontSize="7" fontWeight="bold">HCl</text>
                                {acidVol > 0 && <line x1="85" y1="110" x2="120" y2="130" stroke="#EF5350" strokeWidth="1.5" strokeDasharray="3,2" />}

                                {/* Base being added */}
                                <rect x="200" y="60" width="30" height="50" rx="4" fill="#42A5F5" opacity="0.3" stroke="#42A5F5" strokeWidth="1" />
                                <text x="215" y="80" textAnchor="middle" fill="#42A5F5" fontSize="7" fontWeight="bold">NaOH</text>
                                {baseVol > 0 && <line x1="215" y1="110" x2="180" y2="130" stroke="#42A5F5" strokeWidth="1.5" strokeDasharray="3,2" />}

                                {/* Products */}
                                <text x="150" y="230" textAnchor="middle" fill={solutionColor} fontSize="10" fontWeight="bold">
                                    {pH === 7 ? 'NaCl + H₂O (neutralised!)' : pH < 7 ? 'Excess acid' : 'Excess base'}
                                </text>

                                {/* H+ and OH- ions */}
                                {pH < 7 && Array.from({ length: Math.min(6, 7 - pH) }).map((_, i) => (
                                    <text key={`h-${i}`} x={110 + (i % 3) * 25} y={150 + Math.floor(i / 3) * 20} fill="#EF5350" fontSize="10">H⁺</text>
                                ))}
                                {pH > 7 && Array.from({ length: Math.min(6, pH - 7) }).map((_, i) => (
                                    <text key={`oh-${i}`} x={110 + (i % 3) * 25} y={150 + Math.floor(i / 3) * 20} fill="#42A5F5" fontSize="9">OH⁻</text>
                                ))}
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">Acid volume: {acidVol} mL
                            <input type="range" min={0} max={100} value={acidVol} onChange={e => setAcidVol(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Base volume: {baseVol} mL
                            <input type="range" min={0} max={100} value={baseVol} onChange={e => setBaseVol(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Acid strength: {acidStrength}
                            <input type="range" min={1} max={10} value={acidStrength} onChange={e => setAcidStrength(+e.target.value)} className="vl-range" />
                        </label>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'neutral', text: 'Achieve pH 7 (neutral — exact neutralisation)' },
                                { id: 'strong-acid', text: 'Make a strong acid solution (pH ≤ 2)' },
                                { id: 'strong-base', text: 'Make a strong base solution (pH ≥ 12)' },
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
