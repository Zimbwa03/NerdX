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
                        <button
                            type="button"
                            className="cta-btn cta-secondary"
                            onClick={() => navigate('/login')}
                        >
                            Sign In
                        </button>
                    </div>
                    <p className="hero-trust">
                        Trusted by 5,000+ students across Zimbabwe
                    </p>
                </div>

                <div className="hero-right">
                    <div className="hero-image-card">
                        <div className="image-glow" />
                        <img
                            src="/images/landing_hero.webp"
                            alt="Students learning with AI"
                            className="hero-image"
                            onError={(e) => {
                                // Hide broken image
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                        <div className="image-overlay">
                            <div className="stat-card">
                                <span className="stat-value">95%</span>
                                <span className="stat-label">Pass Rate</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="landing-footer">
                <p>© 2026 NerdX. Made with 💜 in Zimbabwe</p>
            </footer>
        </div>
    );
}
