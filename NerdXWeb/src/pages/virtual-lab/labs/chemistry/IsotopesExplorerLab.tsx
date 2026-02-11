import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Atom } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function IsotopesExplorerLab({ simulation }: { simulation: SimulationMetadata }) {
    const [protons, setProtons] = useState(6);
    const [neutrons, setNeutrons] = useState(6);
    const [electrons, setElectrons] = useState(6);
    const [quizOpen, setQuizOpen] = useState(false);

    const atomicNumber = protons;
    const massNumber = protons + neutrons;
    const charge = protons - electrons;
    const isIsotope = protons === 6 && neutrons !== 6; // Carbon isotope check
    const ELEMENTS: Record<number, string> = { 1: 'H', 2: 'He', 3: 'Li', 4: 'Be', 5: 'B', 6: 'C', 7: 'N', 8: 'O', 9: 'F', 10: 'Ne', 11: 'Na', 12: 'Mg', 13: 'Al', 14: 'Si', 15: 'P', 16: 'S', 17: 'Cl', 18: 'Ar', 19: 'K', 20: 'Ca' };
    const element = ELEMENTS[protons] || '?';

    const shells = useMemo(() => {
        let remaining = electrons;
        const s: number[] = [];
        const caps = [2, 8, 8, 2];
        for (const cap of caps) {
            if (remaining <= 0) break;
            const inShell = Math.min(remaining, cap);
            s.push(inShell);
            remaining -= inShell;
        }
        return s;
    }, [electrons]);

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (isIsotope) n.add('isotope');
        if (massNumber >= 14) n.add('heavy');
        if (charge !== 0) n.add('ion');
        setCompleted(n);
    }, [isIsotope, massNumber, charge]);

    const progress = Math.round((completed.size / 3) * 100);
    const canTakeQuiz = completed.size >= 3;

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #FF9800, #E65100)' }}><Atom size={28} /></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">{element}-{massNumber} {isIsotope && '(Isotope of Carbon!)'}</div>
                        <div className="vl-card-subtitle">
                            Z = {atomicNumber}, A = {massNumber}, Charge = {charge === 0 ? '0 (neutral)' : `${charge > 0 ? '+' : ''}${charge}`}
                        </div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 260" role="img" aria-label="Atom diagram">
                                {/* Nucleus */}
                                <circle cx="150" cy="130" r="30" fill="#FF9800" opacity="0.15" stroke="#FF9800" strokeWidth="2" />
                                {/* Protons */}
                                {Array.from({ length: Math.min(protons, 10) }).map((_, i) => {
                                    const angle = (i / Math.min(protons, 10)) * Math.PI * 2;
                                    const r = protons > 5 ? 15 : 10;
                                    return (
                                        <circle key={`p-${i}`} cx={150 + Math.cos(angle) * r} cy={130 + Math.sin(angle) * r}
                                            r="5" fill="#EF5350" opacity="0.8" />
                                    );
                                })}
                                {/* Neutrons */}
                                {Array.from({ length: Math.min(neutrons, 10) }).map((_, i) => {
                                    const angle = (i / Math.min(neutrons, 10)) * Math.PI * 2 + 0.3;
                                    const r = neutrons > 5 ? 20 : 12;
                                    return (
                                        <circle key={`n-${i}`} cx={150 + Math.cos(angle) * r} cy={130 + Math.sin(angle) * r}
                                            r="5" fill="#78909C" opacity="0.7" />
                                    );
                                })}

                                {/* Electron shells */}
                                {shells.map((count, si) => {
                                    const shellR = 50 + si * 28;
                                    return (
                                        <g key={`s-${si}`}>
                                            <circle cx="150" cy="130" r={shellR} fill="none" stroke="#42A5F5" strokeWidth="1" opacity="0.3" strokeDasharray="4,3" />
                                            {Array.from({ length: count }).map((_, ei) => {
                                                const angle = (ei / count) * Math.PI * 2;
                                                return (
                                                    <circle key={`e-${si}-${ei}`} cx={150 + Math.cos(angle) * shellR} cy={130 + Math.sin(angle) * shellR}
                                                        r="4" fill="#42A5F5" opacity="0.7" />
                                                );
                                            })}
                                        </g>
                                    );
                                })}

                                {/* Element symbol */}
                                <text x="150" y="137" textAnchor="middle" fill="#FFF" fontSize="14" fontWeight="bold">{element}</text>

                                {/* Notation */}
                                <text x="150" y="250" textAnchor="middle" fill="#FFD600" fontSize="12" fontWeight="bold">
                                    ⁿ{massNumber}₍{atomicNumber}₎{element}{charge !== 0 ? (charge > 0 ? `⁺${charge}` : `⁻${Math.abs(charge)}`) : ''}
                                </text>

                                {/* Legend */}
                                <circle cx="20" cy="240" r="4" fill="#EF5350" /><text x="30" y="243" fill="#EF5350" fontSize="8">Proton (+)</text>
                                <circle cx="100" cy="240" r="4" fill="#78909C" /><text x="110" y="243" fill="#78909C" fontSize="8">Neutron (0)</text>
                                <circle cx="190" cy="240" r="4" fill="#42A5F5" /><text x="200" y="243" fill="#42A5F5" fontSize="8">Electron (−)</text>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">Protons (Z): {protons}
                            <input type="range" min={1} max={20} value={protons} onChange={e => setProtons(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Neutrons: {neutrons}
                            <input type="range" min={0} max={25} value={neutrons} onChange={e => setNeutrons(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Electrons: {electrons}
                            <input type="range" min={0} max={20} value={electrons} onChange={e => setElectrons(+e.target.value)} className="vl-range" />
                        </label>
                        <div className="vl-explanation" style={{ fontSize: 11, marginTop: 6 }}>
                            Isotopes have same protons but different neutrons → same chemical properties, different mass.
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'isotope', text: 'Make an isotope of Carbon (keep Z=6, change neutrons)' },
                                { id: 'heavy', text: 'Create an atom with mass number ≥ 14' },
                                { id: 'ion', text: 'Create an ion (electrons ≠ protons)' },
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
