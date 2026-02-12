import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { FloatingParticles } from '../components/FloatingParticles';
import {
  Sparkles, BookOpen, Brain, Zap, ArrowRight, CheckCircle,
  FlaskConical, Target, BarChart3, FileText, Users, Award,
  MessageSquare, GraduationCap, Calculator, Atom,
  Microscope, Code, ShoppingCart, MapPin, Clock, Landmark,
  Briefcase, Star, ChevronRight, Menu, X, Twitter, Instagram, Youtube,
  UserPlus, MousePointerClick, Rocket, Camera
} from 'lucide-react';

const studentImages = [
  { src: '/images/students-learning.png', alt: 'Zimbabwean students studying together with NerdX', caption: 'Students collaborating with NerdX' },
  { src: '/images/student-phone.png', alt: 'Student using NerdX on smartphone', caption: 'Learning anytime, anywhere' },
  { src: '/images/students-celebrating.png', alt: 'Students celebrating exam success', caption: 'Celebrating exam victories' },
  { src: '/images/student-laptop.png', alt: 'Student studying with NerdX on laptop', caption: 'Focused study sessions' },
];

function useCountUp(end: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    let animationFrame: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };
    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start]);
  return count;
}

const features = [
  { icon: Brain, title: 'AI Personal Tutor', description: 'Get instant, personalized explanations for any topic. Our AI adapts to your learning style and ZIMSEC syllabus.', color: '#7C4DFF' },
  { icon: Target, title: 'Interactive Quizzes', description: 'Test your knowledge with thousands of ZIMSEC-aligned questions. Get instant feedback and detailed solutions.', color: '#00E676' },
  { icon: FlaskConical, title: 'Virtual Science Labs', description: 'Conduct realistic experiments in Physics, Chemistry, and Biology right from your device.', color: '#FF6D00' },
  { icon: FileText, title: 'Exam Practice', description: 'Practice with past papers and AI-generated exam questions. Simulate real exam conditions.', color: '#00B0FF' },
  { icon: BarChart3, title: 'Progress Tracking', description: 'Monitor your improvement with detailed analytics. Identify weak areas and track your growth.', color: '#FF4081' },
  { icon: BookOpen, title: 'Instant Notes', description: 'Access comprehensive, exam-ready notes for every subject. Always updated to the latest syllabus.', color: '#FFAB00' },
];

const subjects = [
  { name: 'Mathematics', icon: Calculator, color: '#7C4DFF' },
  { name: 'Physics', icon: Atom, color: '#00B0FF' },
  { name: 'Chemistry', icon: FlaskConical, color: '#FF6D00' },
  { name: 'Biology', icon: Microscope, color: '#00E676' },
  { name: 'English', icon: BookOpen, color: '#FF4081' },
  { name: 'Computer Science', icon: Code, color: '#651FFF' },
  { name: 'Commerce', icon: ShoppingCart, color: '#FFAB00' },
  { name: 'Geography', icon: MapPin, color: '#00BFA5' },
  { name: 'History', icon: Clock, color: '#FF6E40' },
  { name: 'Accounting', icon: Landmark, color: '#448AFF' },
  { name: 'Business Enterprise', icon: Briefcase, color: '#E040FB' },
];

const testimonials = [
  { quote: "NerdX helped me go from a C to an A in Mathematics. The AI tutor explains things better than any textbook I've ever used.", name: 'Tatenda M.', school: 'Prince Edward School', rating: 5 },
  { quote: "The virtual science labs are incredible! I can practice experiments anytime. My Chemistry grade improved dramatically.", name: 'Rudo C.', school: 'Dominican Convent', rating: 5 },
  { quote: "I love the exam practice feature. It feels like the real thing. NerdX gave me the confidence to ace my O-Levels.", name: 'Kudzai N.', school: 'St Georges College', rating: 5 },
];

const steps = [
  { icon: UserPlus, title: 'Sign Up Free', description: 'Create your account in seconds. No credit card required.' },
  { icon: MousePointerClick, title: 'Choose Your Subjects', description: 'Pick from 10+ ZIMSEC O-Level and A-Level subjects.' },
  { icon: Rocket, title: 'Start Learning', description: 'Get AI tutoring, practice exams, and watch your grades soar.' },
];

export function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const studentsCount = useCountUp(5000, 2000, statsVisible);
  const questionsCount = useCountUp(50000, 2500, statsVisible);
  const subjectsCount = useCountUp(10, 1500, statsVisible);
  const passRateCount = useCountUp(95, 2000, statsVisible);

  const scrollTo = useCallback((id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="lp">
      <FloatingParticles count={25} />

      <header className={`lp-header${headerScrolled ? ' lp-header--scrolled' : ''}`}>
        <div className="lp-header__inner">
          <div className="lp-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Sparkles size={24} />
            <span>NerdX</span>
          </div>
          <nav className="lp-nav">
            <button type="button" className="lp-nav__link" onClick={() => scrollTo('features')}>Features</button>
            <button type="button" className="lp-nav__link" onClick={() => scrollTo('subjects')}>Subjects</button>
            <button type="button" className="lp-nav__link" onClick={() => scrollTo('testimonials')}>Testimonials</button>
          </nav>
          <div className="lp-header__actions">
            <button type="button" className="lp-btn lp-btn--ghost" onClick={() => navigate('/login')}>Sign In</button>
            <button type="button" className="lp-btn lp-btn--primary" onClick={() => navigate('/register')}>Get Started</button>
          </div>
          <button type="button" className="lp-mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="lp-mobile-menu">
            <button type="button" onClick={() => scrollTo('features')}>Features</button>
            <button type="button" onClick={() => scrollTo('subjects')}>Subjects</button>
            <button type="button" onClick={() => scrollTo('testimonials')}>Testimonials</button>
            <button type="button" onClick={() => navigate('/login')}>Sign In</button>
            <button type="button" className="lp-btn lp-btn--primary lp-btn--full" onClick={() => navigate('/register')}>Get Started</button>
          </div>
        )}
      </header>

      <section className="lp-hero">
        <div className="lp-hero__content">
          <span className="lp-badge">
            <Zap size={14} />
            AI-Powered Learning Platform
          </span>
          <h1 className="lp-hero__title">
            Master Your Future<br />with <span className="gradient-text">NerdX</span>
          </h1>
          <p className="lp-hero__subtitle">
            Zimbabwe's #1 AI learning platform for ZIMSEC students. Practice exams, get instant AI tutoring, and boost your O-Level & A-Level grades.
          </p>
          <div className="lp-trust-badges">
            <div className="lp-trust-badge">
              <Users size={18} />
              <span><strong>5,000+</strong> Students</span>
            </div>
            <div className="lp-trust-badge">
              <Award size={18} />
              <span><strong>95%</strong> Pass Rate</span>
            </div>
            <div className="lp-trust-badge">
              <BookOpen size={18} />
              <span><strong>10+</strong> Subjects</span>
            </div>
          </div>
          <div className="lp-hero__actions">
            <button type="button" className="lp-btn lp-btn--primary lp-btn--lg" onClick={() => navigate('/register')}>
              Start Learning Free <ArrowRight size={18} />
            </button>
            <button type="button" className="lp-btn lp-btn--outline lp-btn--lg" onClick={() => scrollTo('features')}>
              See How It Works <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className="lp-hero__visual">
          <div className="lp-dashboard-mockup">
            <div className="lp-mockup__header">
              <div className="lp-mockup__dots">
                <span></span><span></span><span></span>
              </div>
              <span className="lp-mockup__title">NerdX Dashboard</span>
            </div>
            <div className="lp-mockup__body">
              <div className="lp-mockup__welcome">Welcome back, Student!</div>
              <div className="lp-mockup__grid">
                <div className="lp-mockup__card lp-mockup__card--purple">
                  <BarChart3 size={20} />
                  <span>Progress</span>
                  <strong>78%</strong>
                </div>
                <div className="lp-mockup__card lp-mockup__card--green">
                  <CheckCircle size={20} />
                  <span>Quizzes</span>
                  <strong>156</strong>
                </div>
                <div className="lp-mockup__card lp-mockup__card--blue">
                  <Brain size={20} />
                  <span>AI Sessions</span>
                  <strong>42</strong>
                </div>
                <div className="lp-mockup__card lp-mockup__card--orange">
                  <Star size={20} />
                  <span>Streak</span>
                  <strong>12 days</strong>
                </div>
              </div>
            </div>
          </div>
          <div className="lp-floating-card lp-floating-card--1">
            <CheckCircle size={16} />
            <span>Quiz Complete: 92%</span>
          </div>
          <div className="lp-floating-card lp-floating-card--2">
            <Sparkles size={16} />
            <span>AI Tutor Active</span>
          </div>
          <div className="lp-floating-card lp-floating-card--3">
            <Award size={16} />
            <span>New Badge Earned!</span>
          </div>
        </div>
      </section>

      <div className="lp-social-proof">
        <div className="lp-social-proof__inner">
          <GraduationCap size={20} />
          <span>Trusted by students from <strong>50+ schools</strong> across Zimbabwe</span>
          <span className="lp-social-proof__divider"></span>
          <span>Prince Edward &bull; Dominican Convent &bull; St Georges &bull; Peterhouse &bull; Arundel &bull; Chisipite &bull; Falcon &bull; Watershed &bull; Hellenic &bull; Gateway</span>
        </div>
      </div>

      <section className="lp-section lp-section--gallery">
        <div className="lp-section__inner">
          <div className="lp-section__header">
            <span className="lp-badge"><Camera size={14} /> Students in Action</span>
            <h2 className="lp-section__title">Real Students, <span className="gradient-text">Real Results</span></h2>
            <p className="lp-section__subtitle">See how students across Zimbabwe are using NerdX to transform their learning experience.</p>
          </div>
          <div className="lp-gallery">
            {studentImages.map((img, i) => (
              <div key={img.src} className={`lp-gallery__item${i === 0 ? ' lp-gallery__item--wide' : ''}`}>
                <img src={img.src} alt={img.alt} className="lp-gallery__img" loading="lazy" />
                <div className="lp-gallery__overlay">
                  <span className="lp-gallery__caption">{img.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="lp-section">
        <div className="lp-section__inner">
          <div className="lp-section__header">
            <span className="lp-badge"><Sparkles size={14} /> Powerful Features</span>
            <h2 className="lp-section__title">Everything You Need to <span className="gradient-text">Excel</span></h2>
            <p className="lp-section__subtitle">Our AI-powered platform gives you the tools to master every subject and ace your exams.</p>
          </div>
          <div className="lp-features-grid">
            {features.map((f) => (
              <div key={f.title} className="lp-feature-card">
                <div className="lp-feature-card__icon" style={{ '--feature-color': f.color } as React.CSSProperties}>
                  <f.icon size={28} />
                </div>
                <h3 className="lp-feature-card__title">{f.title}</h3>
                <p className="lp-feature-card__desc">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="subjects" className="lp-section lp-section--alt">
        <div className="lp-section__inner">
          <div className="lp-section__header">
            <span className="lp-badge"><BookOpen size={14} /> ZIMSEC Subjects</span>
            <h2 className="lp-section__title">Every Subject, <span className="gradient-text">Covered</span></h2>
            <p className="lp-section__subtitle">From Mathematics to Business Enterprise Skills — we've got your entire syllabus.</p>
          </div>
          <div className="lp-subjects-grid">
            {subjects.map((s) => (
              <div key={s.name} className="lp-subject-card" style={{ '--subject-color': s.color } as React.CSSProperties}>
                <div className="lp-subject-card__icon">
                  <s.icon size={28} />
                </div>
                <span className="lp-subject-card__name">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-section__inner">
          <div className="lp-section__header">
            <span className="lp-badge"><Zap size={14} /> Simple & Easy</span>
            <h2 className="lp-section__title">How It <span className="gradient-text">Works</span></h2>
            <p className="lp-section__subtitle">Get started in minutes and begin your journey to academic excellence.</p>
          </div>
          <div className="lp-steps">
            {steps.map((s, i) => (
              <div key={s.title} className="lp-step">
                <div className="lp-step__number">{i + 1}</div>
                <div className="lp-step__icon">
                  <s.icon size={32} />
                </div>
                <h3 className="lp-step__title">{s.title}</h3>
                <p className="lp-step__desc">{s.description}</p>
                {i < steps.length - 1 && <div className="lp-step__connector"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-stats" ref={statsRef}>
        <div className="lp-stats__inner">
          <div className="lp-stat">
            <span className="lp-stat__value">{studentsCount.toLocaleString()}+</span>
            <span className="lp-stat__label">Students</span>
          </div>
          <div className="lp-stat">
            <span className="lp-stat__value">{questionsCount.toLocaleString()}+</span>
            <span className="lp-stat__label">Questions Answered</span>
          </div>
          <div className="lp-stat">
            <span className="lp-stat__value">{subjectsCount}+</span>
            <span className="lp-stat__label">Subjects</span>
          </div>
          <div className="lp-stat">
            <span className="lp-stat__value">{passRateCount}%</span>
            <span className="lp-stat__label">Pass Rate</span>
          </div>
        </div>
      </section>

      <section id="testimonials" className="lp-section lp-section--alt">
        <div className="lp-section__inner">
          <div className="lp-section__header">
            <span className="lp-badge"><MessageSquare size={14} /> Student Stories</span>
            <h2 className="lp-section__title">Loved by <span className="gradient-text">Students</span></h2>
            <p className="lp-section__subtitle">Hear from students who transformed their grades with NerdX.</p>
          </div>
          <div className="lp-testimonials">
            {testimonials.map((t) => (
              <div key={t.name} className="lp-testimonial">
                <div className="lp-testimonial__stars">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} />
                  ))}
                </div>
                <p className="lp-testimonial__quote">"{t.quote}"</p>
                <div className="lp-testimonial__author">
                  <div className="lp-testimonial__avatar">{t.name[0]}</div>
                  <div>
                    <div className="lp-testimonial__name">{t.name}</div>
                    <div className="lp-testimonial__school">{t.school}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-final-cta">
        <div className="lp-final-cta__inner">
          <h2 className="lp-final-cta__title">Ready to Ace Your Exams?</h2>
          <p className="lp-final-cta__subtitle">Join thousands of ZIMSEC students already learning smarter with NerdX.</p>
          <button type="button" className="lp-btn lp-btn--white lp-btn--lg" onClick={() => navigate('/register')}>
            Get Started Free <ArrowRight size={18} />
          </button>
          <p className="lp-final-cta__note">No credit card required. Start learning in seconds.</p>
        </div>
      </section>

      <footer className="lp-footer">
        <div className="lp-footer__inner">
          <div className="lp-footer__brand">
            <div className="lp-logo">
              <Sparkles size={20} />
              <span>NerdX</span>
            </div>
            <p className="lp-footer__tagline">AI-powered learning for ZIMSEC students. Study smarter, not harder.</p>
            <div className="lp-footer__social">
              <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
              <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" aria-label="YouTube"><Youtube size={18} /></a>
            </div>
          </div>
          <div className="lp-footer__links">
            <div className="lp-footer__col">
              <h4>Product</h4>
              <button type="button" onClick={() => scrollTo('features')}>Features</button>
              <button type="button" onClick={() => scrollTo('subjects')}>Subjects</button>
              <button type="button" onClick={() => scrollTo('testimonials')}>Testimonials</button>
            </div>
            <div className="lp-footer__col">
              <h4>Company</h4>
              <button type="button" onClick={() => scrollTo('features')}>About</button>
              <button type="button" onClick={() => scrollTo('features')}>Contact</button>
              <button type="button" onClick={() => scrollTo('features')}>Careers</button>
            </div>
            <div className="lp-footer__col">
              <h4>Get Started</h4>
              <button type="button" onClick={() => navigate('/register')}>Sign Up</button>
              <button type="button" onClick={() => navigate('/login')}>Sign In</button>
            </div>
          </div>
        </div>
        <div className="lp-footer__bottom">
          <p>&copy; 2026 NerdX. Made with &#x1F49C; in Zimbabwe</p>
        </div>
      </footer>
    </div>
  );
}
