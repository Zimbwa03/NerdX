import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Shield } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

type PathogenType = 'bacteria' | 'virus' | 'fungi';
interface Pathogen { id: PathogenType; name: string; emoji: string; reproduction: string; treatment: string; example: string; spread: string; }

const PATHOGENS: Pathogen[] = [
    { id: 'bacteria', name: 'Bacteria', emoji: '🦠', reproduction: 'Binary fission (every 20 min)', treatment: 'Antibiotics', example: 'Cholera, TB, Salmonella', spread: 'Contaminated water / food / airborne' },
    { id: 'virus', name: 'Virus', emoji: '🧬', reproduction: 'Hijacks host cell to replicate', treatment: 'Antivirals / Vaccines (no antibiotics!)', example: 'HIV, Influenza, COVID-19', spread: 'Droplets / body fluids / vectors' },
    { id: 'fungi', name: 'Fungi', emoji: '🍄', reproduction: 'Spores', treatment: 'Antifungals', example: 'Athlete\'s foot, Ringworm', spread: 'Contact / warm moist conditions' },
];

export function MicrobesDiseaseLab({ simulation }: { simulation: SimulationMetadata }) {
    const [selected, setSelected] = useState<Pathogen>(PATHOGENS[0]);
    const [hygiene, setHygiene] = useState(50);
    const [immunity, setImmunity] = useState(50);
    const [quizOpen, setQuizOpen] = useState(false);
    const [tick, setTick] = useState(0);

    useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 120); return () => clearInterval(id); }, []);

    const infectionRisk = useMemo(() => {
        const base = selected.id === 'bacteria' ? 60 : selected.id === 'virus' ? 80 : 40;
        const hygieneReduction = hygiene * 0.5;
        const immunityReduction = immunity * 0.4;
        return Math.max(0, Math.round(base - hygieneReduction - immunityReduction + 20));
    }, [selected, hygiene, immunity]);

    const pathogenCount = useMemo(() => Math.max(1, Math.floor(infectionRisk / 5)), [infectionRisk]);

    const defenseStrength = useMemo(() => Math.min(100, Math.round((hygiene * 0.5 + immunity * 0.5))), [hygiene, immunity]);

    const [visited, setVisited] = useState<Set<string>>(new Set());
    const selectPathogen = (p: Pathogen) => { setSelected(p); setVisited(prev => new Set(prev).add(p.id)); };

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (visited.size >= 3) n.add('all-pathogens');
        if (infectionRisk <= 10) n.add('low-risk');
        if (defenseStrength >= 80) n.add('strong-defense');
        setCompleted(n);
    }, [visited, infectionRisk, defenseStrength]);

    const progress = Math.round((completed.size / 3) * 100);
    const canTakeQuiz = completed.size >= 3;

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #EF5350, #B71C1C)' }}><Shield size={28} /></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Pathogen vs Immune System</div>
                        <div className="vl-card-subtitle">Infection risk: <strong style={{ color: infectionRisk > 50 ? '#FF5252' : infectionRisk > 25 ? '#FF9800' : '#4CAF50' }}>{infectionRisk}%</strong></div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 250" role="img" aria-label="Pathogen and immune system simulation">
                                {/* Body / cell area */}
                                <rect x="40" y="30" width="220" height="180" rx="20" fill="#FFEBEE" opacity="0.15" stroke="#EF5350" strokeWidth="1.5" />
                                <text x="150" y="25" textAnchor="middle" fill="#B0BEC5" fontSize="9">Human Body</text>

                                {/* Immune cells (white blood cells) */}
                                {Array.from({ length: Math.max(2, Math.floor(defenseStrength / 12)) }).map((_, i) => {
                                    const cx = 180 + Math.cos(tick * 0.02 + i * 1.5) * (30 + i * 5);
                                    const cy = 120 + Math.sin(tick * 0.02 + i * 2) * (25 + i * 3);
                                    return (
                                        <g key={`wbc-${i}`}>
                                            <circle cx={cx} cy={cy} r="10" fill="#E8F5E9" opacity="0.4" stroke="#4CAF50" strokeWidth="1.5" />
                                            <text x={cx} y={cy + 4} textAnchor="middle" fontSize="8">🛡️</text>
                                        </g>
                                    );
                                })}

                                {/* Pathogens */}
                                {Array.from({ length: pathogenCount }).map((_, i) => {
                                    const phase = (tick * 0.015 + i * 0.3) % 1;
                                    const cx = 60 + (i % 5) * 30 + Math.sin(tick * 0.03 + i * 2) * 10;
                                    const cy = 50 + Math.floor(i / 5) * 30 + Math.cos(tick * 0.025 + i) * 8;
                                    return (
                                        <g key={`path-${i}`}>
                                            <circle cx={cx} cy={cy} r={selected.id === 'virus' ? 5 : selected.id === 'bacteria' ? 7 : 8}
                                                fill={selected.id === 'bacteria' ? '#FF5252' : selected.id === 'virus' ? '#7B1FA2' : '#FF9800'}
                                                opacity={0.5 + phase * 0.3} />
                                            <text x={cx} y={cy + 3} textAnchor="middle" fontSize="6">{selected.emoji}</text>
                                        </g>
                                    );
                                })}

                                {/* Defense barrier */}
                                <rect x="38" y="210" width={224 * defenseStrength / 100} height="8" rx="4" fill="#4CAF50" opacity="0.5" />
                                <text x="150" y="232" textAnchor="middle" fill="#66BB6A" fontSize="9" fontWeight="bold">Defense: {defenseStrength}%</text>
                                <text x="150" y="248" textAnchor="middle" fill="#B0BEC5" fontSize="8">Antibodies + Phagocytes + Physical barriers</text>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">Hygiene level: {hygiene}%
                            <input type="range" min={0} max={100} value={hygiene} onChange={e => setHygiene(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Immunity (vaccination/antibodies): {immunity}%
                            <input type="range" min={0} max={100} value={immunity} onChange={e => setImmunity(+e.target.value)} className="vl-range" />
                        </label>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Pathogen Type</div>
                        <div className="vl-template-list">
                            {PATHOGENS.map(p => (
                                <button key={p.id} type="button" className={`vl-template-btn ${selected.id === p.id ? 'active' : ''}`} onClick={() => selectPathogen(p)}>
                                    <div className="vl-template-title">{p.emoji} {p.name} {visited.has(p.id) && <span className="vl-pill-mini" style={{ background: '#4CAF50' }}>✓</span>}</div>
                                    <div className="vl-template-desc"><strong>Reproduces:</strong> {p.reproduction}</div>
                                    <div className="vl-template-desc"><strong>Treatment:</strong> {p.treatment}</div>
                                    <div className="vl-template-desc"><strong>Examples:</strong> {p.example}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'all-pathogens', text: 'Explore all 3 pathogen types' },
                                { id: 'low-risk', text: 'Reduce infection risk to ≤ 10%' },
                                { id: 'strong-defense', text: 'Build defense strength ≥ 80%' },
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
