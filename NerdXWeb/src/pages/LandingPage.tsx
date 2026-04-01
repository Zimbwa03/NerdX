import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import {
  Brain, Zap, ArrowRight, CheckCircle,
  FlaskConical, Target, BarChart3, FileText,
  BookOpen, GraduationCap, Calculator, Atom,
  Microscope, Code, ShoppingCart, MapPin, Clock, Landmark,
  Briefcase, Star, Menu, X, MessageSquare,
  Smartphone, Download
} from 'lucide-react';

const features = [
  { icon: Brain, title: 'AI Personal Tutor', desc: 'Instant, personalized explanations adapted to your learning style and ZIMSEC syllabus.', color: '#10B981' },
  { icon: Target, title: 'Interactive Quizzes', desc: 'Thousands of ZIMSEC-aligned questions with instant feedback and detailed solutions.', color: '#00E676' },
  { icon: FlaskConical, title: 'Virtual Science Labs', desc: 'Realistic Physics, Chemistry, and Biology experiments right from your device.', color: '#FF6D00' },
  { icon: FileText, title: 'Exam Practice', desc: 'Past papers and AI-generated exam questions that simulate real exam conditions.', color: '#00B0FF' },
  { icon: BarChart3, title: 'Progress Tracking', desc: 'Detailed analytics to identify weak areas and track your growth over time.', color: '#FF4081' },
  { icon: BookOpen, title: 'Instant Notes', desc: 'Comprehensive, exam-ready notes for every subject, always up to date.', color: '#FFAB00' },
];

const subjects = [
  { name: 'Mathematics', icon: Calculator, color: '#10B981' },
  { name: 'Physics', icon: Atom, color: '#00B0FF' },
  { name: 'Chemistry', icon: FlaskConical, color: '#FF6D00' },
  { name: 'Biology', icon: Microscope, color: '#00E676' },
  { name: 'English', icon: BookOpen, color: '#FF4081' },
  { name: 'Computer Science', icon: Code, color: '#059669' },
  { name: 'Commerce', icon: ShoppingCart, color: '#FFAB00' },
  { name: 'Geography', icon: MapPin, color: '#00BFA5' },
  { name: 'History', icon: Clock, color: '#FF6E40' },
  { name: 'Accounting', icon: Landmark, color: '#448AFF' },
  { name: 'Business Enterprise', icon: Briefcase, color: '#E040FB' },
];

const testimonials = [
  { quote: "NerdX helped me go from a C to an A in Mathematics. The AI tutor explains things better than any textbook.", name: 'Tatenda M.', school: 'Prince Edward School', rating: 5 },
  { quote: "The virtual science labs are incredible! I can practice experiments anytime. My Chemistry grade improved dramatically.", name: 'Rudo C.', school: 'Dominican Convent', rating: 5 },
  { quote: "The exam practice feature feels like the real thing. NerdX gave me the confidence to ace my O-Levels.", name: 'Kudzai N.', school: 'St Georges College', rating: 5 },
];

const steps = [
  { num: '01', title: 'Create Account', desc: 'Sign up free in seconds — no credit card needed.' },
  { num: '02', title: 'Pick Subjects', desc: 'Choose from 10+ ZIMSEC O-Level and A-Level subjects.' },
  { num: '03', title: 'Start Learning', desc: 'Get AI tutoring, practice exams, and watch your grades soar.' },
];

const ANDROID_APP_URL = 'https://lzteiewcvxoazqfxfjgg.supabase.co/storage/v1/object/public/Audio_Notes/NerdX_App/NerdX(v3.00).apk';

export function LandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const scrollTo = useCallback((id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="lp2">
      {/* ── Header ── */}
      <header className={`lp2-header${scrolled ? ' lp2-header--scrolled' : ''}`}>
        <div className="lp2-header__inner">
          <div className="lp2-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/logo.png" alt="NerdX" className="lp2-logo__img" />
            <span>NerdX</span>
          </div>

          <nav className="lp2-nav">
            <button type="button" onClick={() => scrollTo('features')}>Features</button>
            <button type="button" onClick={() => scrollTo('subjects')}>Subjects</button>
            <button type="button" onClick={() => scrollTo('how-it-works')}>How It Works</button>
            <button type="button" onClick={() => scrollTo('testimonials')}>Testimonials</button>
          </nav>

          <div className="lp2-header__actions">
            <button type="button" className="lp2-btn lp2-btn--ghost" onClick={() => navigate('/login')}>Log In</button>
            <button type="button" className="lp2-btn lp2-btn--primary" onClick={() => navigate('/register')}>Get Started</button>
          </div>

          <button type="button" className="lp2-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="lp2-mobile-menu">
            <nav className="lp2-mobile-menu__nav">
              <button type="button" onClick={() => scrollTo('features')}>Features</button>
              <button type="button" onClick={() => scrollTo('subjects')}>Subjects</button>
              <button type="button" onClick={() => scrollTo('how-it-works')}>How It Works</button>
              <button type="button" onClick={() => scrollTo('testimonials')}>Testimonials</button>
            </nav>
            <div className="lp2-mobile-menu__actions">
              <button type="button" className="lp2-btn lp2-btn--ghost lp2-btn--full" onClick={() => navigate('/login')}>Log In</button>
              <button type="button" className="lp2-btn lp2-btn--primary lp2-btn--full" onClick={() => navigate('/register')}>
                Get Started <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      <section className="lp2-hero">
        <div className="lp2-hero__inner">
          <div className="lp2-hero__content">
            <h1 className="lp2-hero__title">
              Learn Smarter.<br />
              <span className="lp2-green">Ace Your Exams.</span>
            </h1>
            <p className="lp2-hero__sub">
              Zimbabwe's AI-powered learning platform for ZIMSEC &amp; Cambridge students. Practice exams, get AI tutoring, and connect with verified teachers.
            </p>
            <div className="lp2-hero__ctas">
              <button type="button" className="lp2-btn lp2-btn--primary lp2-btn--lg" onClick={() => navigate('/register')}>
                Start Learning Free <ArrowRight size={18} />
              </button>
              <button type="button" className="lp2-btn lp2-btn--outline lp2-btn--lg" onClick={() => navigate('/register?role=teacher')}>
                I'm a Teacher <GraduationCap size={18} />
              </button>
            </div>
            <div className="lp2-hero__proof">
              <div className="lp2-proof-item"><CheckCircle size={16} /> <span><strong>5,000+</strong> Students</span></div>
              <div className="lp2-proof-item"><CheckCircle size={16} /> <span><strong>10+</strong> Subjects</span></div>
              <div className="lp2-proof-item"><CheckCircle size={16} /> <span><strong>95%</strong> Pass Rate</span></div>
            </div>
          </div>

          <div className="lp2-hero__visual">
            <div className="lp2-mockup">
              <div className="lp2-mockup__bar">
                <span></span><span></span><span></span>
              </div>
              <div className="lp2-mockup__body">
                <div className="lp2-mockup__greeting">Welcome back, Student!</div>
                <div className="lp2-mockup__grid">
                  <div className="lp2-mockup__card" style={{ '--mc': '#10B981' } as React.CSSProperties}>
                    <BarChart3 size={18} /><span>Progress</span><strong>78%</strong>
                  </div>
                  <div className="lp2-mockup__card" style={{ '--mc': '#00B0FF' } as React.CSSProperties}>
                    <Brain size={18} /><span>AI Sessions</span><strong>42</strong>
                  </div>
                  <div className="lp2-mockup__card" style={{ '--mc': '#FF6D00' } as React.CSSProperties}>
                    <Star size={18} /><span>Streak</span><strong>12 days</strong>
                  </div>
                  <div className="lp2-mockup__card" style={{ '--mc': '#FFAB00' } as React.CSSProperties}>
                    <CheckCircle size={18} /><span>Quizzes</span><strong>156</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="lp2-section">
        <div className="lp2-section__inner">
          <div className="lp2-section__header">
            <p className="lp2-label"><Zap size={14} /> Powerful Features</p>
            <h2>Everything You Need to <span className="lp2-green">Excel</span></h2>
          </div>
          <div className="lp2-features">
            {features.map((f) => (
              <div key={f.title} className="lp2-feature" style={{ '--fc': f.color } as React.CSSProperties}>
                <div className="lp2-feature__icon"><f.icon size={24} /></div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Subjects ── */}
      <section id="subjects" className="lp2-section lp2-section--alt">
        <div className="lp2-section__inner">
          <div className="lp2-section__header">
            <p className="lp2-label"><BookOpen size={14} /> ZIMSEC &amp; Cambridge</p>
            <h2>Every Subject, <span className="lp2-green">Covered</span></h2>
          </div>
          <div className="lp2-subjects">
            {subjects.map((s) => (
              <div key={s.name} className="lp2-subject" style={{ '--sc': s.color } as React.CSSProperties}>
                <s.icon size={22} />
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="lp2-section">
        <div className="lp2-section__inner">
          <div className="lp2-section__header">
            <p className="lp2-label"><Zap size={14} /> Simple Process</p>
            <h2>Get Started in <span className="lp2-green">3 Steps</span></h2>
          </div>
          <div className="lp2-steps">
            {steps.map((s, i) => (
              <div key={s.num} className="lp2-step">
                <div className="lp2-step__num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                {i < steps.length - 1 && <div className="lp2-step__line" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="lp2-section lp2-section--alt">
        <div className="lp2-section__inner">
          <div className="lp2-section__header">
            <p className="lp2-label"><MessageSquare size={14} /> Student Stories</p>
            <h2>Loved by <span className="lp2-green">Students</span></h2>
          </div>
          <div className="lp2-testimonials">
            {testimonials.map((t) => (
              <div key={t.name} className="lp2-testimonial">
                <div className="lp2-testimonial__stars">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} />
                  ))}
                </div>
                <p className="lp2-testimonial__quote">"{t.quote}"</p>
                <div className="lp2-testimonial__author">
                  <div className="lp2-testimonial__avatar">{t.name[0]}</div>
                  <div>
                    <div className="lp2-testimonial__name">{t.name}</div>
                    <div className="lp2-testimonial__school">{t.school}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="lp2-cta">
        <div className="lp2-cta__inner">
          <h2>Ready to Start Learning?</h2>
          <p>Join thousands of Zimbabwean students already using NerdX to ace their exams.</p>
          <div className="lp2-cta__buttons">
            <button type="button" className="lp2-btn lp2-btn--white lp2-btn--lg" onClick={() => navigate('/register')}>
              Get Started Free <ArrowRight size={18} />
            </button>
            <a href={ANDROID_APP_URL} target="_blank" rel="noopener noreferrer" className="lp2-btn lp2-btn--outline-w lp2-btn--lg">
              <Smartphone size={18} /> Download App
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="lp2-footer">
        <div className="lp2-footer__inner">
          <div className="lp2-footer__brand">
            <div className="lp2-logo">
              <img src="/logo.png" alt="NerdX" className="lp2-logo__img" />
              <span>NerdX</span>
            </div>
            <p>AI-powered learning for ZIMSEC &amp; Cambridge students.</p>
          </div>
          <div className="lp2-footer__links">
            <div className="lp2-footer__col">
              <h4>Product</h4>
              <button type="button" onClick={() => scrollTo('features')}>Features</button>
              <button type="button" onClick={() => scrollTo('subjects')}>Subjects</button>
              <button type="button" onClick={() => scrollTo('testimonials')}>Testimonials</button>
            </div>
            <div className="lp2-footer__col">
              <h4>Get Started</h4>
              <button type="button" onClick={() => navigate('/register')}>Student Sign Up</button>
              <button type="button" onClick={() => navigate('/register?role=teacher')}>Teacher Sign Up</button>
              <button type="button" onClick={() => navigate('/login')}>Log In</button>
            </div>
            <div className="lp2-footer__col">
              <h4>Download</h4>
              <a href={ANDROID_APP_URL} target="_blank" rel="noopener noreferrer" className="lp2-footer__app">
                <Download size={14} /> Android App
              </a>
            </div>
          </div>
        </div>
        <div className="lp2-footer__bottom">
          <p>&copy; 2026 NerdX. Made in Zimbabwe.</p>
        </div>
      </footer>
    </div>
  );
}
