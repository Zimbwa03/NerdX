import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

type Method = 'acid-base' | 'acid-metal' | 'precipitation';
interface MethodInfo { name: string; steps: string[]; equation: string; desc: string; }
const METHODS: Record<Method, MethodInfo> = {
    'acid-base': { name: 'Acid + Insoluble Base', steps: ['Add excess insoluble base to warm acid', 'Stir until no more dissolves', 'Filter to remove excess solid', 'Heat filtrate to evaporate water', 'Cool to crystallise', 'Dry crystals'], equation: 'CuO + H₂SO₄ → CuSO₄ + H₂O', desc: 'For soluble salts. E.g. copper sulfate from CuO + sulfuric acid.' },
    'acid-metal': { name: 'Acid + Metal', steps: ['Add metal pieces to acid', 'Observe fizzing (H₂ gas produced)', 'Wait until excess metal remains', 'Filter to remove excess metal', 'Evaporate to crystallise'], equation: 'Zn + H₂SO₄ → ZnSO₄ + H₂', desc: 'For soluble salts with metals above hydrogen. Gas test: squeaky pop.' },
    precipitation: { name: 'Precipitation', steps: ['Mix two soluble salt solutions', 'Insoluble salt forms as precipitate', 'Filter precipitate', 'Wash with distilled water', 'Dry the solid'], equation: 'Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃', desc: 'For insoluble salts. Mix two solutions containing required ions.' },
};

export function SaltPreparationLab({ simulation }: { simulation: SimulationMetadata }) {
    const [method, setMethod] = useState<Method>('acid-base');
    const [currentStep, setCurrentStep] = useState(0);
    const [quizOpen, setQuizOpen] = useState(false);
    const info = METHODS[method];

    const [visited, setVisited] = useState<Set<string>>(new Set());
    const selectMethod = (m: Method) => { setMethod(m); setCurrentStep(0); setVisited(prev => new Set(prev).add(m)); };

    const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
    const nextStep = () => {
        setCompletedSteps(prev => new Set(prev).add(`${method}-${currentStep}`));
        if (currentStep < info.steps.length - 1) setCurrentStep(currentStep + 1);
    };

    const allDone = useMemo(() => {
        return (['acid-base', 'acid-metal', 'precipitation'] as Method[]).every(m =>
            METHODS[m].steps.every((_, i) => completedSteps.has(`${m}-${i}`))
        );
    }, [completedSteps]);

    const progress = Math.round((visited.size / 3) * 100);
    const canTakeQuiz = allDone || visited.size >= 3;

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #FF9800, #E65100)' }}><span style={{ fontSize: 24 }}>🧂</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">{info.name}</div>
                        <div className="vl-card-subtitle">{info.desc}</div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 260" role="img" aria-label="Salt preparation steps">
                                {/* Equipment background */}
                                <rect x="20" y="20" width="260" height="200" rx="10" fill="#263238" opacity="0.06" />

                                {/* Step visualization */}
                                {info.steps.map((step, i) => {
                                    const y = 35 + i * 32;
                                    const active = i === currentStep;
                                    const done = completedSteps.has(`${method}-${i}`);
                                    return (
                                        <g key={i}>
                                            <circle cx="40" cy={y + 5} r="8" fill={done ? '#4CAF50' : active ? '#FFD600' : '#37474F'}
                                                stroke={active ? '#FFF' : 'transparent'} strokeWidth="1.5" />
                                            <text x="40" y={y + 9} textAnchor="middle" fill="#FFF" fontSize="8" fontWeight="bold">{i + 1}</text>
                                            <text x="56" y={y + 9} fill={active ? '#FFF' : done ? '#4CAF50' : '#78909C'} fontSize="9"
                                                fontWeight={active ? 'bold' : 'normal'}>{step}</text>
                                            {i < info.steps.length - 1 && (
                                                <line x1="40" y1={y + 13} x2="40" y2={y + 27} stroke={done ? '#4CAF50' : '#37474F'} strokeWidth="1.5" />
                                            )}
                                        </g>
                                    );
                                })}

                                {/* Equation at bottom */}
                                <text x="150" y="245" textAnchor="middle" fill="#FFD600" fontSize="10" fontWeight="bold">{info.equation}</text>
                            </svg>
                        </div>
                        <button type="button" className="vl-btn secondary" style={{ marginTop: 8 }}
                            disabled={currentStep >= info.steps.length - 1 && completedSteps.has(`${method}-${currentStep}`)}
                            onClick={nextStep}>
                            {completedSteps.has(`${method}-${currentStep}`) ? 'Done ✓' : `Complete Step ${currentStep + 1} →`}
                        </button>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">Choose Method</div>
                        <div className="vl-template-list">
                            {(Object.keys(METHODS) as Method[]).map(m => (
                                <button key={m} type="button" className={`vl-template-btn ${method === m ? 'active' : ''}`} onClick={() => selectMethod(m)}>
                                    <div className="vl-template-title">
                                        {METHODS[m].name}
                                        {visited.has(m) && <span className="vl-pill-mini" style={{ background: '#4CAF50' }}>✓</span>}
                                    </div>
                                    <div className="vl-template-desc">{METHODS[m].desc}</div>
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
