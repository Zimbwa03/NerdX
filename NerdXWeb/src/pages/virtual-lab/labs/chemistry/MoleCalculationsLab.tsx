import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function MoleCalculationsLab({ simulation }: { simulation: SimulationMetadata }) {
    const [mass, setMass] = useState(36);
    const [molarMass, setMolarMass] = useState(18);
    const [ratio, setRatio] = useState(1);
    const [quizOpen, setQuizOpen] = useState(false);

    const moles = useMemo(() => Math.round(((mass / molarMass) * ratio) * 1000) / 1000, [mass, molarMass, ratio]);
    const particles = useMemo(() => (moles * 6.022e23).toExponential(2), [moles]);

    const COMMON: { name: string; formula: string; mm: number }[] = [
        { name: 'Water', formula: 'H₂O', mm: 18 },
        { name: 'Carbon dioxide', formula: 'CO₂', mm: 44 },
        { name: 'Sodium chloride', formula: 'NaCl', mm: 58.5 },
        { name: 'Calcium carbonate', formula: 'CaCO₃', mm: 100 },
        { name: 'Sulfuric acid', formula: 'H₂SO₄', mm: 98 },
    ];

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (moles >= 2) n.add('two-moles');
        if (moles <= 0.5 && moles > 0) n.add('half-mole');
        if (molarMass >= 50) n.add('heavy');
        setCompleted(n);
    }, [moles, molarMass]);

    const progress = Math.round((completed.size / 3) * 100);
    const canTakeQuiz = completed.size >= 3;

    // Visual: particle count representation
    const visParticles = Math.min(30, Math.round(moles * 5));

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #FF9800, #E65100)' }}><span style={{ fontSize: 24 }}>⚖️</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Mole Calculator</div>
                        <div className="vl-card-subtitle">n = m / M{ratio !== 1 ? ` × ${ratio}` : ''}</div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 240" role="img" aria-label="Mole calculation visualizer">
                                {/* Balance scale */}
                                <line x1="150" y1="30" x2="150" y2="60" stroke="#78909C" strokeWidth="3" />
                                <polygon points="145,30 155,30 150,20" fill="#78909C" />

                                {/* Left arm — mass */}
                                <line x1="60" y1="70" x2="150" y2="60" stroke="#78909C" strokeWidth="2" />
                                <rect x="30" y="70" width="60" height="30" rx="6" fill="#42A5F5" opacity="0.3" stroke="#42A5F5" strokeWidth="1.5" />
                                <text x="60" y="89" textAnchor="middle" fill="#FFF" fontSize="10" fontWeight="bold">{mass} g</text>
                                <text x="60" y="110" textAnchor="middle" fill="#42A5F5" fontSize="9">Mass</text>

                                {/* Right arm — moles */}
                                <line x1="150" y1="60" x2="240" y2="70" stroke="#78909C" strokeWidth="2" />
                                <rect x="210" y="70" width="60" height="30" rx="6" fill="#FF9800" opacity="0.3" stroke="#FF9800" strokeWidth="1.5" />
                                <text x="240" y="89" textAnchor="middle" fill="#FFF" fontSize="10" fontWeight="bold">{moles} mol</text>
                                <text x="240" y="110" textAnchor="middle" fill="#FF9800" fontSize="9">Moles</text>

                                {/* Molar mass label */}
                                <text x="150" y="55" textAnchor="middle" fill="#78909C" fontSize="8">M = {molarMass} g/mol</text>

                                {/* Particle visualization */}
                                <rect x="30" y="130" width="240" height="80" rx="8" fill="#263238" opacity="0.1" />
                                <text x="150" y="148" textAnchor="middle" fill="#90A4AE" fontSize="8">Particles (proportional)</text>
                                {Array.from({ length: visParticles }).map((_, i) => (
                                    <circle key={i} cx={50 + (i % 10) * 22} cy={160 + Math.floor(i / 10) * 18}
                                        r="5" fill="#FFD600" opacity="0.5" />
                                ))}

                                {/* Result */}
                                <text x="150" y="230" textAnchor="middle" fill="#FFD600" fontSize="10" fontWeight="bold">
                                    {moles} mol = {particles} particles
                                </text>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Quick Presets</div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {COMMON.map(c => (
                                <button key={c.name} type="button" className="vl-btn secondary" style={{ fontSize: 11 }}
                                    onClick={() => { setMolarMass(c.mm); setMass(c.mm); }}>
                                    {c.formula} (M={c.mm})
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">Mass (m): {mass} g
                            <input type="range" min={1} max={200} value={mass} onChange={e => setMass(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Molar mass (M): {molarMass} g/mol
                            <input type="range" min={1} max={100} value={molarMass} onChange={e => setMolarMass(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Ratio factor: {ratio}×
                            <input type="range" min={1} max={5} value={ratio} onChange={e => setRatio(+e.target.value)} className="vl-range" />
                        </label>
                        <div className="vl-explanation" style={{ fontSize: 11, marginTop: 6 }}>
                            Formula: n = m/M. 1 mole = 6.022 × 10²³ particles (Avogadro).
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'two-moles', text: 'Calculate moles ≥ 2.000' },
                                { id: 'half-mole', text: 'Calculate moles ≤ 0.500' },
                                { id: 'heavy', text: 'Use molar mass ≥ 50 g/mol' },
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
