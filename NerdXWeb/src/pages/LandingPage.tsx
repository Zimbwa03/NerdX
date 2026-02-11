/**
 * LandingPage - Premium Welcome Page
 * Features NerdX branding, hero section, and Sign In/Sign Up buttons
 */
import { useNavigate } from 'react-router-dom';
import { FloatingParticles } from '../components/FloatingParticles';
import { Sparkles, BookOpen, Brain, Zap, ArrowRight } from 'lucide-react';

export function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <FloatingParticles count={25} />

            {/* Header */}
            <header className="landing-header">
                <div className="landing-logo">
                    <Sparkles size={28} className="logo-icon" />
                    <span className="logo-text">NerdX</span>
                </div>
                <nav className="landing-nav">
                    <button
                        type="button"
                        className="nav-btn nav-btn-ghost"
                        onClick={() => navigate('/login')}
                    >
                        Sign In
                    </button>
                    <button
                        type="button"
                        className="nav-btn nav-btn-primary"
                        onClick={() => navigate('/register')}
                    >
                        Get Started
                    </button>
                </nav>
            </header>

            {/* Hero Section */}
            <main className="landing-hero">
                <div className="hero-left">
                    <span className="hero-badge">
                        <Zap size={14} />
                        AI-Powered Learning
                    </span>
                    <h1 className="hero-headline">
                        Master Your Future with <span className="gradient-text">NerdX</span>
                    </h1>
                    <p className="hero-subtitle">
                        Zimbabwe's #1 AI learning platform for O-Level and A-Level students.
                        Practice exams, get instant AI tutoring, and boost your grades.
                    </p>
                    <div className="hero-features">
                        <div className="hero-feature">
                            <BookOpen size={20} />
                            <span>10+ Subjects</span>
                        </div>
                        <div className="hero-feature">
                            <Brain size={20} />
                            <span>AI Tutoring</span>
                        </div>
                        <div className="hero-feature">
                            <Sparkles size={20} />
                            <span>Exam Practice</span>
                        </div>
                    </div>
                    <div className="hero-actions">
                        <button
                            type="button"
                            className="cta-btn cta-primary"
                            onClick={() => navigate('/register')}
                        >
                            Start Learning Free
                            <ArrowRight size={18} />
                        </button>
                        <a
                            href="#"
                            className="cta-btn cta-secondary"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Download App
                        </a>
                    </div>
                    <p className="hero-trust">
                        Trusted by 5,000+ students across Zimbabwe
                    </p>
                </div>

                <div className="hero-right">
                    <div className="hero-image-card">
                        <div className="image-glow" />
                        {/* 
                            Using a CSS-based placeholder card or existing asset if available.
                            Since generated images failed, we rely on CSS styling here or fallbacks.
                        */}
                        <div className="mockup-placeholder" style={{
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
                                <Sparkles size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                <h3>Interactive Learning</h3>
                            </div>
                        </div>
                        <div className="image-overlay">
                            <div className="stat-card">
                                <span className="stat-value">95%</span>
                                <span className="stat-label">Pass Rate</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* App Showcase Section */}
            <section className="app-showcase-section" style={{
                padding: '4rem 2rem',
                background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)',
                textAlign: 'center'
            }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                        Take <span className="gradient-text">NerdX</span> Anywhere
                    </h2>
                    <p className="section-subtitle" style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 3rem' }}>
                        Study on the go with our top-rated mobile app. Access all your notes, quizzes, and AI tutor directly from your pocket.
                    </p>

                    <div className="app-mockup-wrapper" style={{
                        position: 'relative',
                        maxWidth: '300px',
                        margin: '0 auto',
                        perspective: '1000px'
                    }}>
                        {/* CSS Phone Frame */}
                        <div className="phone-frame" style={{
                            width: '100%',
                            aspectRatio: '9/19',
                            background: '#000',
                            borderRadius: '36px',
                            padding: '12px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 0 2px #333',
                            position: 'relative',
                            transform: 'rotateY(-5deg) rotateX(5deg)',
                            transition: 'transform 0.3s ease'
                        }}>
                            <div className="phone-screen" style={{
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                {/* UI Mockup Content */}
                                <div style={{ padding: '1.5rem 1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <div style={{ width: '24px', height: '24px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}></div>
                                        <div style={{ width: '24px', height: '24px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}></div>
                                    </div>
                                    <div style={{ height: '80px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', marginBottom: '1rem' }}></div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                        <div style={{ height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}></div>
                                        <div style={{ height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}></div>
                                        <div style={{ height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}></div>
                                        <div style={{ height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}></div>
                                    </div>
                                </div>
                            </div>
                            {/* Notch */}
                            <div style={{
                                position: 'absolute',
                                top: '0',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '120px',
                                height: '24px',
                                background: '#000',
                                borderBottomLeftRadius: '16px',
                                borderBottomRightRadius: '16px',
                                zIndex: 10
                            }}></div>
                        </div>
                    </div>

                    <div className="app-download-cta" style={{ marginTop: '3rem' }}>
                        <a
                            href="#"
                            className="cta-btn cta-primary"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            Download for Android
                            <ArrowRight size={18} />
                        </a>
                    </div>
                </div>
            </section>

            {/* Features Grid Section */}
            <section className="features-section" style={{ padding: '4rem 2rem' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="features-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem'
                    }}>
                        <div className="feature-card" style={{
                            background: 'rgba(255,255,255,0.03)',
                            padding: '2rem',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <div className="feature-icon" style={{
                                width: '60px',
                                height: '60px',
                                background: 'rgba(139, 92, 246, 0.1)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem',
                                color: '#8b5cf6'
                            }}>
                                <Brain size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>AI Personal Tutor</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                Get instant answers to your questions. Our AI tutor explains complex topics simply, tailored to your syllabus.
                            </p>
                        </div>

                        <div className="feature-card" style={{
                            background: 'rgba(255,255,255,0.03)',
                            padding: '2rem',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <div className="feature-icon" style={{
                                width: '60px',
                                height: '60px',
                                background: 'rgba(59, 130, 246, 0.1)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem',
                                color: '#3b82f6'
                            }}>
                                <Zap size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Interactive Virtual Labs</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                Conduct science experiments safely on your device. Visualize concepts in Physics, Chemistry, and Biology.
                            </p>
                        </div>

                        <div className="feature-card" style={{
                            background: 'rgba(255,255,255,0.03)',
                            padding: '2rem',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <div className="feature-icon" style={{
                                width: '60px',
                                height: '60px',
                                background: 'rgba(16, 185, 129, 0.1)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem',
                                color: '#10b981'
                            }}>
                                <BookOpen size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Exam-Quality Notes</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                Access comprehensive notes for O-Level and A-Level subjects, aligned with the latest Zimsec syllabus.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <p>© 2026 NerdX. Made with 💜 in Zimbabwe</p>
            </footer>
        </div>
    );
}
