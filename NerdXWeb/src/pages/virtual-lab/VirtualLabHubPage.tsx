import { type ElementType, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Atom, Beaker, BookOpen, Brain, Calculator, Code, Database, Globe, Leaf, Lock, Zap } from 'lucide-react';
import { FloatingParticles } from '../../components/FloatingParticles';
import { useAuth } from '../../context/AuthContext';
import { useContentAccess } from '../../hooks/useContentAccess';
import type { SimulationMetadata, Subject } from '../../data/virtualLab';

type FilterOption = 'all' | 'science' | Subject;

const FILTERS: Array<{ key: FilterOption; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'science', label: 'Science' },
  { key: 'biology', label: 'Biology' },
  { key: 'chemistry', label: 'Chemistry' },
  { key: 'physics', label: 'Physics' },
  { key: 'mathematics', label: 'Math' },
  { key: 'english', label: 'English' },
  { key: 'computer_science', label: 'Computer Science' },
  { key: 'geography', label: 'Geography' },
  { key: 'accounting', label: 'Accounting' },
  { key: 'business_enterprise_skills', label: 'BES/Life Skills' },
  { key: 'history', label: 'History' },
];

const SUBJECT_KEYS: Subject[] = [
  'biology',
  'chemistry',
  'physics',
  'mathematics',
  'english',
  'computer_science',
  'geography',
  'accounting',
  'business_enterprise_skills',
  'history',
];

function isSubjectKey(value: string): value is Subject {
  return (SUBJECT_KEYS as string[]).includes(value);
}

function subjectIcon(subject: Subject): ElementType {
  if (subject === 'biology') return Leaf;
  if (subject === 'chemistry') return Beaker;
  if (subject === 'physics') return Atom;
  if (subject === 'mathematics') return Calculator;
  if (subject === 'english') return BookOpen;
  if (subject === 'computer_science') return Code;
  if (subject === 'geography') return Globe;
  if (subject === 'accounting') return Database;
  if (subject === 'business_enterprise_skills') return Brain;
  return BookOpen;
}

export function VirtualLabHubPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { hasFullAccess, isLabLocked, isSchoolStudentActive } = useContentAccess(user);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [allSimulations, setAllSimulations] = useState<SimulationMetadata[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const setFilter = (filter: FilterOption) => {
    setActiveFilter(filter);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (filter === 'all') next.delete('subject');
        else next.set('subject', filter);
        return next;
      },
      { replace: true }
    );
  };

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const mod = await import('../../data/virtualLab/simulationsData');
        if (!active) return;
        setAllSimulations(mod.getAllSimulations());
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const availableSubjects = useMemo(() => new Set(allSimulations.map((s) => s.subject)), [allSimulations]);

  const visibleFilters = useMemo(
    () =>
      FILTERS.filter((f) => {
        if (f.key === 'all' || f.key === 'science') return true;
        return availableSubjects.has(f.key);
      }),
    [availableSubjects]
  );

  useEffect(() => {
    const rawSubject = searchParams.get('subject');
    if (!rawSubject) return;
    const normalized = rawSubject.trim().toLowerCase();

    if (normalized === 'all') {
      setActiveFilter('all');
      return;
    }

    if (normalized === 'science') {
      setActiveFilter('science');
      return;
    }

    if (isSubjectKey(normalized)) {
      if (availableSubjects.size > 0 && !availableSubjects.has(normalized)) {
        setActiveFilter('all');
        return;
      }
      setActiveFilter(normalized);
    }
  }, [availableSubjects, searchParams]);

  const filteredSimulations = useMemo(() => {
    if (activeFilter === 'all') return allSimulations;
    if (activeFilter === 'science') {
      return allSimulations.filter((s) => s.subject === 'biology' || s.subject === 'chemistry' || s.subject === 'physics');
    }
    return allSimulations.filter((s) => s.subject === activeFilter);
  }, [activeFilter, allSimulations]);

  const isSimulationLocked = (sim: SimulationMetadata): boolean => {
    const subjectSims = allSimulations.filter((s) => s.subject === sim.subject);
    const subjectIndex = subjectSims.findIndex((s) => s.id === sim.id);
    return isLabLocked(subjectIndex < 0 ? 999 : subjectIndex);
  };

  const openSimulation = (sim: SimulationMetadata) => {
    if (isSimulationLocked(sim)) {
      const isExpiredSchool = user?.user_type === 'school_student' && !isSchoolStudentActive;
      const message = isExpiredSchool
        ? 'Your school subscription has expired. Purchase credits or contact your school to regain access.'
        : 'This simulation is locked. Purchase credits to unlock all simulations?';
      if (window.confirm(message)) {
        navigate('/app/credits');
      } else {
        showToast('Locked simulation');
      }
      return;
    }
    navigate(`/app/virtual-lab/${sim.id}`);
  };

  return (
    <div className="subject-page-v2 virtual-lab-page">
      <FloatingParticles count={14} />

      {toast && (
        <div className="notifications-toast" role="status">
          {toast}
        </div>
      )}

      <header className="subject-header-v2">
        <Link to="/app" className="back-btn-v2">
          <span aria-hidden="true">&larr;</span>
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #1976D2, #1565C0)' }}>
            <Atom size={28} />
          </div>
          <div>
            <h1>Virtual Lab</h1>
            <p>Interactive simulations and skill labs (web parity in progress)</p>
          </div>
        </div>
      </header>

      <div className="subject-content-grid">
        <div className="subject-features-col">
          <section className="subject-section-v2">
            <h2>How It Works</h2>
            <div className="feature-cards-v2">
              <button
                type="button"
                className="feature-card-v2 feature-card-highlight"
                onClick={() => navigate('/app/teacher/chat', { state: { subject: 'Combined Science', gradeLevel: 'Form 3-4 (O-Level)', prefillMessage: 'I want to learn using Virtual Labs. Recommend the best lab for my weak topic and give me a short plan.' } })}
              >
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #7C4DFF, #00E676)' }}>
                  <Brain size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>Ask AI Which Lab</h3>
                  <p>Get a recommended lab based on your weak areas</p>
                </div>
                <span className="feature-arrow">&rarr;</span>
              </button>

              <button
                type="button"
                className="feature-card-v2"
                onClick={() => navigate('/app/credits')}
              >
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #FFD93D, #F59E0B)' }}>
                  <Zap size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>{isSchoolStudentActive ? 'School Access' : 'Unlock Labs'}</h3>
                  <p>
                    {isSchoolStudentActive
                      ? `All labs unlocked via your school subscription${user?.school_name ? ` (${user.school_name})` : ''}`
                      : hasFullAccess
                        ? 'All labs unlocked'
                        : user?.user_type === 'school_student'
                          ? 'Your school subscription has expired — renew or purchase credits to unlock all labs'
                          : 'Some labs may be locked — purchase credits to unlock all'}
                  </p>
                </div>
                <span className="feature-arrow">&rarr;</span>
              </button>

              <button
                type="button"
                className="feature-card-v2"
                onClick={() => navigate('/app/agents')}
              >
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #00BCD4, #0097A7)' }}>
                  <BookOpen size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>Agent Hub</h3>
                  <p>Use specialist agents to practice after a lab</p>
                </div>
                <span className="feature-arrow">&rarr;</span>
              </button>
            </div>
          </section>

          <section className="subject-section-v2">
            <h2>Categories</h2>
            <div className="feature-cards-v2">
              <button type="button" className="feature-card-v2" onClick={() => navigate('/app/virtual-lab?subject=science')}>
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #10B981, #06B6D4)' }}>
                  <Beaker size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>Science</h3>
                  <p>Biology, Chemistry, Physics simulations</p>
                </div>
                <span className="feature-arrow">&rarr;</span>
              </button>
              <button type="button" className="feature-card-v2" onClick={() => navigate('/app/virtual-lab?subject=mathematics')}>
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #2979FF, #7C4DFF)' }}>
                  <Calculator size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>Mathematics</h3>
                  <p>Graphs, calculus, probability, vectors</p>
                </div>
                <span className="feature-arrow">&rarr;</span>
              </button>
              <button type="button" className="feature-card-v2" onClick={() => navigate('/app/virtual-lab?subject=geography')}>
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #2E7D32, #1B5E20)' }}>
                  <Globe size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>Geography</h3>
                  <p>Map work, bearings, scale and distance</p>
                </div>
                <span className="feature-arrow">&rarr;</span>
              </button>
              <button type="button" className="feature-card-v2" onClick={() => navigate('/app/virtual-lab?subject=computer_science')}>
                <div className="feature-card-icon" style={{ background: 'linear-gradient(135deg, #111827, #374151)' }}>
                  <Code size={24} />
                </div>
                <div className="feature-card-text">
                  <h3>Programming and IT</h3>
                  <p>Code, web design, databases</p>
                </div>
                <span className="feature-arrow">&rarr;</span>
              </button>
            </div>
          </section>
        </div>

        <div className="subject-topics-col">
          <section className="subject-section-v2">
            <h2>Browse Simulations</h2>
            <p className="section-subtitle">Filter by subject, then open a simulation to start.</p>

            <div className="vl-filter-row">
              {visibleFilters.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className={`vl-filter-chip ${activeFilter === f.key ? 'active' : ''}`}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="vl-card">Loading simulations...</div>
            ) : (
              <div className="feature-cards-v2">
                {filteredSimulations.map((sim) => {
                  const locked = isSimulationLocked(sim);
                  const Icon = subjectIcon(sim.subject);
                  return (
                    <button
                      key={sim.id}
                      type="button"
                      className={`feature-card-v2 vl-sim-card ${locked ? 'vl-sim-locked' : ''}`}
                      onClick={() => openSimulation(sim)}
                    >
                      <div className="feature-card-icon" style={{ background: `linear-gradient(135deg, ${sim.color}, #7C4DFF)` }}>
                        <Icon size={24} />
                      </div>
                      <div className="feature-card-text">
                        <div className="feature-badge-row">
                          <h3>{sim.title}</h3>
                          {locked && (
                            <span className="vl-lock-pill">
                              <Lock size={14} /> Locked
                            </span>
                          )}
                        </div>
                        <p>
                          {sim.topic} &bull; {sim.estimatedTime} &bull; {sim.xpReward} XP
                        </p>
                      </div>
                      <span className="feature-arrow">&rarr;</span>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
