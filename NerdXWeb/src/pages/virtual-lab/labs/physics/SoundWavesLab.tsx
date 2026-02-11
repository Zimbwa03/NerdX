import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../../components/virtualLab/KnowledgeCheckModal';

export function SoundWavesLab({ simulation }: { simulation: SimulationMetadata }) {
    const [frequency, setFrequency] = useState(200);
    const [waveSpeed, setWaveSpeed] = useState(340);
    const [amplitude, setAmplitude] = useState(5);
    const [quizOpen, setQuizOpen] = useState(false);
    const [tick, setTick] = useState(0);
    useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 40); return () => clearInterval(id); }, []);

    const wavelength = useMemo(() => Math.round((waveSpeed / frequency) * 100) / 100, [waveSpeed, frequency]);

    const [completed, setCompleted] = useState<Set<string>>(new Set());
    useEffect(() => {
        const n = new Set(completed);
        if (wavelength >= 2) n.add('long');
        if (wavelength <= 1) n.add('short');
        if (frequency >= 300) n.add('high-f');
        if (amplitude >= 8) n.add('loud');
        setCompleted(n);
    }, [wavelength, frequency, amplitude]);

    const progress = Math.round((completed.size / 4) * 100);
    const canTakeQuiz = completed.size >= 3;

    // Draw animated transverse wave representation
    const wavePoints = useMemo(() => {
        const pts: string[] = [];
        const timeOffset = tick * 0.08;
        for (let x = 0; x <= 280; x += 2) {
            const normalizedX = x / 280;
            const y = 100 + Math.sin((normalizedX * frequency / 50) * Math.PI * 2 - timeOffset) * amplitude * 5;
            pts.push(`${x + 10},${y}`);
        }
        return pts.join(' ');
    }, [tick, frequency, amplitude]);

    // Draw compressions/rarefactions for longitudinal view
    const compressions = useMemo(() => {
        const dots: { x: number; y: number; compressed: boolean }[] = [];
        const timeOffset = tick * 0.08;
        for (let i = 0; i < 30; i++) {
            const baseX = 10 + i * 9.3;
            const displacement = Math.sin((i / 30 * frequency / 50) * Math.PI * 2 - timeOffset) * amplitude * 0.8;
            dots.push({ x: baseX + displacement, y: 170, compressed: displacement < -amplitude * 0.3 });
        }
        return dots;
    }, [tick, frequency, amplitude]);

    return (
        <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2"><ArrowLeft size={20} /><span>Back</span></Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #2196F3, #0D47A1)' }}><span style={{ fontSize: 24 }}>🔊</span></div>
                    <div><h1>{simulation.title}</h1><p>{simulation.topic}</p></div>
                </div>
            </header>

            <div className="vl-editor-grid">
                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-card-title">λ = v / f</div>
                        <div className="vl-card-subtitle">
                            λ = <strong style={{ color: '#4CAF50' }}>{wavelength} m</strong> | f = {frequency} Hz | v = {waveSpeed} m/s
                        </div>
                        <div className="vl-canvas-wrap">
                            <svg className="vl-sim-svg" viewBox="0 0 300 220" role="img" aria-label="Sound waves">
                                {/* Transverse representation */}
                                <text x="10" y="25" fill="#90A4AE" fontSize="8">Transverse representation</text>
                                {/* Equilibrium line */}
                                <line x1="10" y1="100" x2="290" y2="100" stroke="#37474F" strokeWidth="1" strokeDasharray="3,3" />
                                {/* Wave */}
                                <polyline points={wavePoints} fill="none" stroke="#42A5F5" strokeWidth="2.5" />

                                {/* Amplitude markers */}
                                <line x1="15" y1={100 - amplitude * 5} x2="25" y2={100 - amplitude * 5} stroke="#FF9800" strokeWidth="1.5" />
                                <line x1="15" y1={100 + amplitude * 5} x2="25" y2={100 + amplitude * 5} stroke="#FF9800" strokeWidth="1.5" />
                                <line x1="20" y1={100 - amplitude * 5} x2="20" y2={100 + amplitude * 5} stroke="#FF9800" strokeWidth="1" />
                                <text x="28" y={100 - amplitude * 5 + 4} fill="#FF9800" fontSize="7">A</text>

                                {/* Longitudinal representation */}
                                <text x="10" y="152" fill="#90A4AE" fontSize="8">Longitudinal (actual sound)</text>
                                {compressions.map((dot, i) => (
                                    <circle key={i} cx={dot.x} cy={dot.y} r={dot.compressed ? 3.5 : 2.5}
                                        fill={dot.compressed ? '#EF5350' : '#42A5F5'} opacity={dot.compressed ? 0.8 : 0.5} />
                                ))}

                                {/* Labels for C and R */}
                                <text x="60" y="195" textAnchor="middle" fill="#EF5350" fontSize="7">C = Compression</text>
                                <text x="200" y="195" textAnchor="middle" fill="#42A5F5" fontSize="7">R = Rarefaction</text>

                                {/* Speaker icon */}
                                <rect x="3" y="91" width="6" height="18" rx="1" fill="#FFD600" opacity="0.6" />
                                <polygon points="9,88 18,80 18,120 9,112" fill="#FFD600" opacity="0.4" />

                                <text x="150" y="213" textAnchor="middle" fill="#90A4AE" fontSize="8">
                                    Higher frequency → shorter wavelength → higher pitch
                                </text>
                            </svg>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Controls</div>
                        <label className="vl-slider-label">Frequency (f): {frequency} Hz — {frequency < 150 ? 'Low pitch' : frequency > 300 ? 'High pitch' : 'Medium pitch'}
                            <input type="range" min={50} max={400} step={10} value={frequency} onChange={e => setFrequency(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Wave speed (v): {waveSpeed} m/s
                            <input type="range" min={100} max={400} step={10} value={waveSpeed} onChange={e => setWaveSpeed(+e.target.value)} className="vl-range" />
                        </label>
                        <label className="vl-slider-label">Amplitude (A): {amplitude} — {amplitude < 4 ? 'Quiet' : amplitude > 7 ? 'Loud' : 'Medium'}
                            <input type="range" min={1} max={10} step={1} value={amplitude} onChange={e => setAmplitude(+e.target.value)} className="vl-range" />
                        </label>
                    </div>
                </div>

                <div className="vl-col">
                    <div className="vl-card">
                        <div className="vl-section-title-row"><div className="vl-card-title">Tasks</div><div className="vl-section-meta">{progress}%</div></div>
                        <div className="vl-progress-bar"><div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="vl-checklist">
                            {[
                                { id: 'long', text: 'Make wavelength ≥ 2.0 m' },
                                { id: 'short', text: 'Make wavelength ≤ 1.0 m' },
                                { id: 'high-f', text: 'Set frequency ≥ 300 Hz' },
                                { id: 'loud', text: 'Make it loud (amplitude ≥ 8)' },
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
