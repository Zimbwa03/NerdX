/**
 * PhysicsTopicsPage - Premium Science Design
 * Features deep space physics theme, Question Generation, and separated Notes
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { quizApi, type Topic } from '../../services/api/quizApi';
import {
    formatCreditCost,
    getMinimumCreditsForQuiz,
} from '../../utils/creditCalculator';
import {
    ArrowLeft, BookOpen, Atom, Play, Zap, Info, X, FileText,
    Ruler, Activity, ArrowUp, Box, RotateCw, Thermometer,
    Radio, Plug, Magnet, Cpu,
    type LucideIcon,
} from 'lucide-react';
import { AILoadingOverlay } from '../../components/AILoadingOverlay';
import { physicsTopics } from '../../data/scienceNotes/physics';
import '../sciences/ScienceUniverse.css'; // Shared premium styles

const PHYS_TOPICS_FALLBACK: Topic[] = [
    { id: 'measurements', name: 'General Physics & Measurements', subject: 'physics' },
    { id: 'kinematics', name: 'Kinematics (Motion)', subject: 'physics' },
    { id: 'dynamics', name: 'Dynamics (Forces)', subject: 'physics' },
    { id: 'mass_weight', name: 'Mass, Weight and Density', subject: 'physics' },
    { id: 'turning_effects', name: 'Turning Effects of Forces', subject: 'physics' },
    { id: 'energy', name: 'Work, Energy and Power', subject: 'physics' },
    { id: 'pressure', name: 'Pressure', subject: 'physics' },
    { id: 'thermal', name: 'Thermal Physics', subject: 'physics' },
    { id: 'waves', name: 'Waves (Light & Sound)', subject: 'physics' },
    { id: 'electricity', name: 'Electricity', subject: 'physics' },
    { id: 'magnetism', name: 'Magnetism', subject: 'physics' },
    { id: 'electromagnetism', name: 'Electromagnetism', subject: 'physics' },
    { id: 'electronics', name: 'Introductory Electronics', subject: 'physics' },
    { id: 'nuclear', name: 'Nuclear Physics', subject: 'physics' },
];

const SUBJECT = {
    id: 'physics',
    name: 'O Level Physics',
    color: '#06B6D4',
};

/** Return a unique icon per physics topic. */
function getPhysTopicIcon(name: string): LucideIcon {
    const n = name.toLowerCase();
    if (n.includes('measurement') || n.includes('physical quantit')) return Ruler;
    if (n.includes('kinematics') || n.includes('motion')) return Activity;
    if (n.includes('turning effect')) return RotateCw;
    if (n.includes('force') || n.includes('dynamics') || n.includes('machine')) return ArrowUp;
    if (n.includes('mass') || n.includes('weight') || n.includes('density')) return Box;
    if (n.includes('energy') || n.includes('power') || n.includes('work')) return Zap;
    if (n.includes('pressure')) return ArrowUp;
    if (n.includes('thermal') || n.includes('heat')) return Thermometer;
    if (n.includes('wave') || n.includes('light') || n.includes('sound') || n.includes('optic')) return Radio;
    if (n.includes('electricity') || n.includes('circuit') || n.includes('current')) return Plug;
    if (n.includes('electromagnetism')) return Cpu;
    if (n.includes('magnetism')) return Magnet;
    if (n.includes('electronics') || n.includes('logic gate')) return Cpu;
    if (n.includes('nuclear') || n.includes('atomic') || n.includes('modern')) return Atom;
    return Atom;
}

export const PhysicsTopicsPage = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    const [topics, setTopics] = useState<Topic[]>([]);

    // Quiz Generation State
    const [startQuizModalOpen, setStartQuizModalOpen] = useState(false);
    const [pendingTopic, setPendingTopic] = useState<Topic | null>(null);
    const [questionFormat, setQuestionFormat] = useState<'mcq' | 'structured'>('mcq');
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                // Fetch topics for Physics directly
                const data = await quizApi.getTopics('physics');
                if (!cancelled && data?.length) setTopics(data);
                else if (!cancelled) setTopics(PHYS_TOPICS_FALLBACK);
            } catch {
                if (!cancelled) setTopics(PHYS_TOPICS_FALLBACK);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const displayTopics = topics.length ? topics : PHYS_TOPICS_FALLBACK;

    const openStartQuiz = (topic: Topic) => {
        setPendingTopic(topic);
        setQuestionFormat('mcq'); // Default
        setError(null);
        setStartQuizModalOpen(true);
    };

    const minCredits = getMinimumCreditsForQuiz({
        subject: 'physics',
        questionType: 'topical',
        isImageQuestion: false,
        questionFormat: questionFormat
    });

    const userCredits = user?.credits ?? 0;
    const hasEnoughCredits = userCredits >= minCredits;

    const handleStartQuiz = async () => {
        if (!pendingTopic) return;
        if (!hasEnoughCredits) {
            setError(`You need at least ${formatCreditCost(minCredits)} credits to start. Please top up.`);
            return;
        }

        setGenerating(true);
        setError(null);

        try {
            const question = await quizApi.generateQuestion(
                'physics',
                pendingTopic.id,
                'medium',
                'topical',
                undefined, // parent_subject
                undefined, // questionType
                questionFormat,
                false // mixImages
            );

            if (question) {
                const creditsRemaining = (question as any).credits_remaining;
                if (creditsRemaining !== undefined) {
                    updateUser({ credits: creditsRemaining });
                }

                setStartQuizModalOpen(false);
                // Navigate to the Science Quiz Page
                navigate('/app/sciences/quiz', {
                    state: {
                        question,
                        subject: SUBJECT,
                        topic: pendingTopic,
                        parentSubject: 'Physics', // For backwards compatibility
                        questionFormat,
                        backTo: '/app/physics' // Custom back link
                    },
                });
            } else {
                throw new Error('Failed to generate question');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to generate question. Please try again.');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="science-universe-page phys">
            {/* Animated Background */}
            <div className="science-universe-bg phys-bg">
                <div className="science-grid-overlay"></div>
            </div>

            <Link to="/app" className="super-back-btn">
                <ArrowLeft size={18} />
                <span>Dashboard</span>
            </Link>

            {/* Hero Section */}
            <div className="science-hero">
                <div className="science-hero-badge phys-badge">
                    <Atom size={14} />
                    <span>O-LEVEL PHYSICS</span>
                </div>
                <h1 className="science-hero-title phys-title">
                    Unlock the<br />Universe
                </h1>
                <p style={{ maxWidth: 600, margin: '0 auto', opacity: 0.8 }}>
                    Master forces, energy, and electricity with AI-powered simulations and practice.
                </p>
            </div>

            <div className="science-content-grid">
                {/* Left Column: Features */}
                <div className="science-features-col">
                    {/* AI Tutor */}
                    <div
                        className="science-feature-card"
                        onClick={() => navigate('/app/teacher', { state: { subject: 'O Level Physics', gradeLevel: 'Form 3-4 (O-Level)' } })}
                    >
                        <div className="feature-icon-box">
                            <Zap size={28} />
                        </div>
                        <h3 className="feature-card-title">AI Physics Tutor</h3>
                        <p className="feature-card-desc">Resolve complex physics problems with step-by-step AI guidance.</p>
                    </div>

                    {/* Virtual Labs */}
                    <div
                        className="science-feature-card"
                        onClick={() => navigate('/app/virtual-lab?subject=physics')}
                    >
                        <div className="feature-icon-box">
                            <Atom size={28} />
                        </div>
                        <h3 className="feature-card-title">Virtual Labs</h3>
                        <p className="feature-card-desc">Experiment with circuits, forces, and waves in interactive simulations.</p>
                    </div>

                    {/* Exam Mode */}
                    <div
                        className="science-feature-card"
                        onClick={() => navigate('/app/exam/setup', { state: { subject: 'physics', backTo: '/app/physics', subjectLabel: 'Physics' } })}
                    >
                        <div className="feature-icon-box">
                            <FileText size={28} />
                        </div>
                        <h3 className="feature-card-title">Exam Mode</h3>
                        <p className="feature-card-desc">Prepare for exams with timed past paper questions.</p>
                    </div>
                </div>

                {/* Right Column: Topics */}
                <div className="science-topics-col">
                    <div className="topics-section-title" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                        <Play size={24} style={{ color: '#06B6D4' }} />
                        <span style={{ fontSize: 24, fontWeight: 700 }}>Practice Topics</span>
                        <span className="topics-count-badge" style={{ fontSize: 12, background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 12 }}>
                            {displayTopics.length} Topics
                        </span>
                    </div>

                    <p style={{ marginBottom: 20, opacity: 0.7 }}>
                        Select a topic to generate <strong>MCQ</strong> or <strong>Structured</strong> questions.
                    </p>

                    <div className="science-topics-grid">
                        {displayTopics.map((topic) => {
                            const TopicIcon = getPhysTopicIcon(topic.name);
                            return (
                                <div
                                    key={topic.id}
                                    className="science-topic-card"
                                    onClick={() => openStartQuiz(topic)}
                                >
                                    <div className="topic-icon-small">
                                        <TopicIcon size={20} />
                                    </div>
                                    <span className="topic-card-name">{topic.name}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Secondary Section: Study Notes */}
                    <div className="topics-section-title" style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 60, marginBottom: 24 }}>
                        <BookOpen size={24} style={{ color: '#67E8F9' }} />
                        <span style={{ fontSize: 24, fontWeight: 700 }}>Study Notes</span>
                    </div>

                    <div className="topic-chips-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {physicsTopics.map((topicName, i) => (
                            <Link
                                key={i}
                                to={`/app/physics/notes/${encodeURIComponent(topicName)}`}
                                style={{
                                    display: 'inline-block',
                                    padding: '10px 16px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '50px',
                                    color: '#fff',
                                    fontSize: '14px',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {topicName}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Start Quiz Modal */}
            {startQuizModalOpen && pendingTopic && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
                    zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="modal-content" style={{
                        background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)',
                        width: '90%', maxWidth: '450px', borderRadius: 24, padding: 32,
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => setStartQuizModalOpen(false)}
                            style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
                        >
                            <X size={24} />
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: 24 }}>
                            <div style={{
                                width: 60, height: 60, background: 'rgba(6, 182, 212, 0.2)',
                                borderRadius: 16, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#06B6D4'
                            }}>
                                <Atom size={32} />
                            </div>
                            <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{pendingTopic.name}</h2>
                            <p style={{ opacity: 0.7, marginTop: 8 }}>Select Question Formatting</p>
                        </div>

                        <div className="format-options" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                            <button
                                onClick={() => setQuestionFormat('mcq')}
                                style={{
                                    padding: 20, borderRadius: 16, border: `2px solid ${questionFormat === 'mcq' ? '#06B6D4' : 'rgba(255,255,255,0.1)'}`,
                                    background: questionFormat === 'mcq' ? 'rgba(6, 182, 212, 0.1)' : 'rgba(255,255,255,0.05)',
                                    color: '#fff', cursor: 'pointer', textAlign: 'center'
                                }}
                            >
                                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>MCQ</div>
                                <div style={{ fontSize: 12, opacity: 0.7 }}>Multiple Choice</div>
                            </button>

                            <button
                                onClick={() => setQuestionFormat('structured')}
                                style={{
                                    padding: 20, borderRadius: 16, border: `2px solid ${questionFormat === 'structured' ? '#06B6D4' : 'rgba(255,255,255,0.1)'}`,
                                    background: questionFormat === 'structured' ? 'rgba(6, 182, 212, 0.1)' : 'rgba(255,255,255,0.05)',
                                    color: '#fff', cursor: 'pointer', textAlign: 'center'
                                }}
                            >
                                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Structured</div>
                                <div style={{ fontSize: 12, opacity: 0.7 }}>Written Answer</div>
                            </button>
                        </div>

                        {error && (
                            <div style={{ padding: 12, background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: 12, marginBottom: 20, color: '#FCA5A5', fontSize: 14 }}>
                                {error}
                            </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 24, fontSize: 14, opacity: 0.8 }}>
                            <Info size={16} />
                            <span>Cost: <strong>{minCredits} credits</strong></span>
                        </div>

                        <button
                            onClick={handleStartQuiz}
                            disabled={generating}
                            style={{
                                width: '100%', padding: '16px', borderRadius: 16,
                                background: 'linear-gradient(135deg, #0891B2, #06B6D4)',
                                border: 'none', color: '#fff', fontSize: 16, fontWeight: 700,
                                cursor: generating ? 'wait' : 'pointer',
                                opacity: generating ? 0.7 : 1
                            }}
                        >
                            {generating ? 'Generating Question...' : 'Start Practice'}
                        </button>
                    </div>
                </div>
            )}
            <AILoadingOverlay
                isVisible={generating}
                title="Generating Question"
                subtitle="Creating your practice question"
                accentColor={SUBJECT.color}
                variant="fullscreen"
            />
        </div>
    );
};
