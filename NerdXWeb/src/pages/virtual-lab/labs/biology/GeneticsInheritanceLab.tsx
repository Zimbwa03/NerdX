import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Dna } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

type Allele = 'B' | 'b';
interface Organism { alleles: [Allele, Allele]; }

const PHENOTYPE: Record<string, string> = { 'BB': 'Brown (homozygous dominant)', 'Bb': 'Brown (heterozygous)', 'bB': 'Brown (heterozygous)', 'bb': 'Blue (homozygous recessive)' };
const COLOR: Record<string, string> = { 'BB': '#8D6E63', 'Bb': '#8D6E63', 'bB': '#8D6E63', 'bb': '#42A5F5' };

export function GeneticsInheritanceLab({ simulation }: { simulation: SimulationMetadata }) {
    const [parent1, setParent1] = useState<Organism>({ alleles: ['B', 'b'] });
    const [parent2, setParent2] = useState<Organism>({ alleles: ['B', 'b'] });
    const [quizOpen, setQuizOpen] = useState(false);

    // Punnett square
    const punnett = useMemo(() => {
        const combos: [Allele, Allele][] = [];
        for (const a1 of parent1.alleles) {
            for (const a2 of parent2.alleles) {
                combos.push([a1, a2]);
            }
        }
        return combos;
    }, [parent1, parent2]);

    const ratios = useMemo(() => {
        const counts: Record<string, number> = {};
        punnett.forEach(([a, b]) => {
            const key = `${a}${b}`;
            const pheno = key === 'bb' ? 'Recessive' : 'Dominant';
            counts[pheno] = (counts[pheno] || 0) + 1;
        });
        return counts;
    }, [punnett]);

    const genotypeRatios = useMemo(() => {
        const counts: Record<string, number> = {};
        punnett.forEach(([a, b]) => {
            const key = a <= b ? `${a}${b}` : `${b}${a}`;
            counts[key] = (counts[key] || 0) + 1;
        });
        return counts;
    }, [punnett]);

    const [completed, setCompleted] = useState<Set<string>>(new Set());

    const toggleAllele = (parent: 1 | 2, idx: 0 | 1) => {
        const setter = parent === 1 ? setParent1 : setParent2;
        setter(prev => {
            const newAlleles: [Allele, Allele] = [...prev.alleles];
            newAlleles[idx] = newAlleles[idx] === 'B' ? 'b' : 'B';
            return { alleles: newAlleles };
        });
    };

    // Check tasks
    useMemo(() => {
        const n = new Set(completed);
        if (ratios['Recessive'] === 4) n.add('all-recessive');
        if (ratios['Dominant'] === 4) n.add('all-dominant');
        if (ratios['Dominant'] === 3 && ratios['Recessive'] === 1) n.add('3-to-1');
        setCompleted(n);
    }, [ratios]);

    const progress = Math.round((completed.size / 3) * 100);
    const canTakeQuiz = completed.size >= 3;

    const alleleLabel = (a: Allele) => a === 'B' ? 'B (dominant)' : 'b (recessive)';

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #7E57C2, #4527A0)' }}><Dna size={28} /></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Punnett Square — Monohybrid Cross</div>
                        <div className="vl-card-subtitle">Eye colour: B = brown (dominant), b = blue (recessive)</div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 280 260" role="img" aria-label="Punnett square">
                                {/* Grid lines */}
                                <line x1="100" y1="60" x2="100" y2="220" stroke="#546E7A" strokeWidth="1.5" />
                                <line x1="190" y1="60" x2="190" y2="220" stroke="#546E7A" strokeWidth="1" />
                                <line x1="100" y1="60" x2="280" y2="60" stroke="#546E7A" strokeWidth="1.5" />
                                <line x1="100" y1="140" x2="280" y2="140" stroke="#546E7A" strokeWidth="1" />

                                {/* Parent1 alleles (top) */}
                                <text x="145" y="50" textAnchor="middle" fill="#FFD600" fontSize="14" fontWeight="bold">{parent1.alleles[0]}</text>
                                <text x="235" y="50" textAnchor="middle" fill="#FFD600" fontSize="14" fontWeight="bold">{parent1.alleles[1]}</text>
                                <text x="145" y="38" textAnchor="middle" fill="#90A4AE" fontSize="8">♂ Parent 1</text>

                                {/* Parent2 alleles (left) */}
                                <text x="80" y="105" textAnchor="middle" fill="#FF80AB" fontSize="14" fontWeight="bold">{parent2.alleles[0]}</text>
                                <text x="80" y="185" textAnchor="middle" fill="#FF80AB" fontSize="14" fontWeight="bold">{parent2.alleles[1]}</text>
                                <text x="45" y="145" textAnchor="middle" fill="#90A4AE" fontSize="8" transform="rotate(-90,45,145)">♀ Parent 2</text>

                                {/* Offspring cells */}
                                {punnett.map((combo, i) => {
                                    const col = i % 2;
                                    const row = Math.floor(i / 2);
                                    const key = `${combo[0]}${combo[1]}`;
                                    return (
                                        <g key={i}>
                                            <rect x={102 + col * 90} y={62 + row * 80} width={88} height={78} rx="4"
                                                fill={COLOR[key]} opacity="0.2" />
                                            <text x={146 + col * 90} y={100 + row * 80} textAnchor="middle" fill={COLOR[key]} fontSize="18" fontWeight="bold">
                                                {combo[0]}{combo[1]}
                                            </text>
                                            <text x={146 + col * 90} y={120 + row * 80} textAnchor="middle" fill="#B0BEC5" fontSize="8">
                                                {PHENOTYPE[key]}
                                            </text>
                                        </g>
                                    );
                                })}

                                {/* Ratios summary */}
                                <text x="140" y="245" textAnchor="middle" fill="#FFD600" fontSize="10" fontWeight="bold">
                                    Ratio: {Object.entries(ratios).map(([k, v]) => `${v} ${k}`).join(' : ')}
                                </text>
                                <text x="140" y="258" textAnchor="middle" fill="#90A4AE" fontSize="8">
                                    Genotypes: {Object.entries(genotypeRatios).map(([k, v]) => `${v}×${k}`).join(', ')}
                                </text>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Parent Alleles</div>
                        <div className="vl-card-subtitle">Click to toggle each allele between B (dominant) and b (recessive).</div>
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 8 }}>
                            <div>
                                <strong style={{ color: '#FFD600' }}>♂ Parent 1:</strong>
                                {parent1.alleles.map((a, i) => (
                                    <button key={i} type="button" className="vl-btn secondary" style={{ margin: '2px 4px', minWidth: 60 }}
                                        onClick={() => toggleAllele(1, i as 0 | 1)}>{alleleLabel(a)}</button>
                                ))}
                            </div>
                            <div>
                                <strong style={{ color: '#FF80AB' }}>♀ Parent 2:</strong>
                                {parent2.alleles.map((a, i) => (
                                    <button key={i} type="button" className="vl-btn secondary" style={{ margin: '2px 4px', minWidth: 60 }}
                                        onClick={() => toggleAllele(2, i as 0 | 1)}>{alleleLabel(a)}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: '3-to-1', text: 'Produce a 3:1 phenotype ratio (Bb × Bb)' },
                                { id: 'all-dominant', text: 'Produce all dominant offspring (e.g. BB × BB)' },
                                { id: 'all-recessive', text: 'Produce all recessive offspring (bb × bb)' },
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
                        <div className="vl-card-subtitle">{canTakeQuiz ? 'Ready!' : 'Complete all 3 crosses.'}</div>
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
