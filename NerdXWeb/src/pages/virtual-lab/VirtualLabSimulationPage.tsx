import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Lock, Sparkles, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useContentAccess } from '../../hooks/useContentAccess';
import type { SimulationMetadata } from '../../data/virtualLab';
import { HandsOnActivityRenderer, type HandsOnProgress } from '../../components/virtualLab/activities/HandsOnActivityRenderer';
import { KnowledgeCheckModal } from '../../components/virtualLab/KnowledgeCheckModal';
import { getCustomLabComponent } from './labRegistry';

function computeSubjectIndex(simulation: SimulationMetadata, all: SimulationMetadata[]): number {
  const subjectSims = all.filter((s) => s.subject === simulation.subject);
  const idx = subjectSims.findIndex((s) => s.id === simulation.id);
  return idx < 0 ? 999 : idx;
}

export function VirtualLabSimulationPage() {
  const { labId } = useParams<{ labId: string }>();
  const { user } = useAuth();
  const { isLabLocked, isSchoolStudentActive } = useContentAccess(user);

  const [loading, setLoading] = useState(true);
  const [simulation, setSimulation] = useState<SimulationMetadata | null>(null);
  const [allSimulations, setAllSimulations] = useState<SimulationMetadata[]>([]);
  const [checkedObjectives, setCheckedObjectives] = useState<Record<string, boolean>>({});
  const [quizOpen, setQuizOpen] = useState(false);
  const [handsOnProgress, setHandsOnProgress] = useState<HandsOnProgress | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const mod = await import('../../data/virtualLab/simulationsData');
        const all = mod.getAllSimulations();
        const sim = labId ? mod.getSimulationById(labId) : undefined;
        if (!active) return;
        setAllSimulations(all);
        setSimulation(sim ?? null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [labId]);

  const objectives = simulation?.learningObjectives ?? [];
  const completedObjectives = useMemo(
    () => objectives.filter((o) => checkedObjectives[o.id]).length,
    [objectives, checkedObjectives]
  );
  const objectivesProgress = objectives.length > 0 ? Math.round((completedObjectives / objectives.length) * 100) : 0;

  const canTakeQuiz = useMemo(() => {
    if (!simulation) return false;
    if (simulation.handsOnActivity) return !!handsOnProgress?.isComplete;
    if (simulation.subject === 'business_enterprise_skills') return completedObjectives >= Math.min(2, objectives.length);
    return true;
  }, [completedObjectives, handsOnProgress?.isComplete, objectives.length, simulation]);

  const isExpiredSchool = user?.user_type === 'school_student' && !isSchoolStudentActive;

  const lockState = useMemo(() => {
    if (!simulation) return { locked: false, reason: '', isExpiredSchool: false };
    if (!allSimulations.length) return { locked: false, reason: '', isExpiredSchool: false };
    const subjectIdx = computeSubjectIndex(simulation, allSimulations);
    const locked = isLabLocked(subjectIdx);
    const reason = locked
      ? isExpiredSchool
        ? 'Your school subscription has expired. Renew through your school or purchase credits to unlock all simulations.'
        : 'This simulation is locked. Purchase credits to unlock all simulations.'
      : '';
    return { locked, reason, isExpiredSchool: locked && isExpiredSchool };
  }, [allSimulations, isExpiredSchool, isLabLocked, simulation]);

  const toggleObjective = (id: string) => {
    setCheckedObjectives((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="subject-page-v2 virtual-lab-sim-page">
        <header className="subject-header-v2">
          <Link to="/app/virtual-lab" className="back-btn-v2">
            <ArrowLeft size={20} />
            <span>Back</span>
          </Link>
          <div className="subject-header-content">
            <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #1976D2, #1565C0)' }}>
              <Sparkles size={28} />
            </div>
            <div>
              <h1>Virtual Lab</h1>
              <p>Loading simulation...</p>
            </div>
          </div>
        </header>
        <div className="vl-card">Loading...</div>
      </div>
    );
  }

  if (!labId || !simulation) {
    return (
      <div className="virtual-lab-placeholder-page">
        <header className="virtual-lab-placeholder-header">
          <Link to="/app/virtual-lab" className="back-link">
            <span aria-hidden="true">&larr;</span> Back to Virtual Lab
          </Link>
          <h1>Virtual Lab</h1>
          <p className="virtual-lab-placeholder-subtitle">Simulation not found.</p>
        </header>

        <div className="virtual-lab-placeholder-card">
          <div className="virtual-lab-placeholder-icon">
            <Sparkles size={32} />
          </div>
          <h2>Simulation not found</h2>
          <p>This lab route exists, but we couldn&apos;t find a matching simulation ID.</p>
          <div className="virtual-lab-placeholder-actions">
            <Link to="/app/virtual-lab" className="virtual-lab-btn secondary">
              Browse labs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (lockState.locked) {
    return (
      <div className="subject-page-v2 virtual-lab-sim-page">
        <header className="subject-header-v2">
          <Link to="/app/virtual-lab" className="back-btn-v2">
            <ArrowLeft size={20} />
            <span>Back</span>
          </Link>
          <div className="subject-header-content">
            <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #FF1744, #FF6B6B)' }}>
              <Lock size={28} />
            </div>
            <div>
              <h1>{simulation.title}</h1>
              <p>{simulation.topic}</p>
            </div>
          </div>
        </header>

        <div className="vl-card">
          <div className="vl-card-title">
            {lockState.isExpiredSchool ? 'School subscription expired' : 'Locked simulation'}
          </div>
          <div className="vl-card-subtitle">{lockState.reason}</div>
          <div className="vl-row">
            <Link to="/app/credits" className="vl-btn primary link">
              {lockState.isExpiredSchool ? 'Purchase credits' : 'Unlock with credits'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const CustomLab = getCustomLabComponent(simulation.id);
  if (CustomLab) {
    return <CustomLab simulation={simulation} />;
  }

  return (
    <div className="subject-page-v2 virtual-lab-sim-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: `linear-gradient(135deg, ${simulation.color}, #7C4DFF)` }}>
            <Sparkles size={28} />
          </div>
          <div>
            <h1>{simulation.title}</h1>
            <p>{simulation.topic}</p>
          </div>
        </div>
      </header>

      <div className="vl-grid">
        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">{simulation.subject.toUpperCase().replaceAll('_', ' ')}</div>
            <div className="vl-card-subtitle">{simulation.description}</div>
            <div className="vl-meta">
              <span className="vl-meta-item">
                <Clock size={14} /> {simulation.estimatedTime}
              </span>
              <span className="vl-meta-item">
                <Star size={14} /> {simulation.xpReward} XP
              </span>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-section-title-row">
              <div className="vl-card-title">Activity checklist</div>
              <div className="vl-section-meta">{objectivesProgress}%</div>
            </div>
            <div className="vl-progress-bar">
              <div className="vl-progress-bar-fill" style={{ width: `${objectivesProgress}%` }} />
            </div>
            <div className="vl-checklist">
              {objectives.length === 0 ? (
                <div className="vl-card-subtitle">No checklist items configured.</div>
              ) : (
                objectives.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    className={`vl-check ${checkedObjectives[o.id] ? 'done' : ''}`}
                    onClick={() => toggleObjective(o.id)}
                  >
                    <span className="vl-check-dot" aria-hidden="true" />
                    <span className="vl-check-text">{o.text}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="vl-col">
          <HandsOnActivityRenderer
            activity={simulation.handsOnActivity}
            onProgress={(p) => setHandsOnProgress(p)}
          />

          <div className="vl-card">
            <div className="vl-card-title">Knowledge check</div>
            <div className="vl-card-subtitle">
              {canTakeQuiz
                ? 'Ready when you are.'
                : simulation.handsOnActivity
                  ? 'Complete the hands-on activity to unlock.'
                  : 'Tick at least 2 checklist items to unlock.'}
            </div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
              <Sparkles size={16} /> Start knowledge check
            </button>
          </div>
        </div>
      </div>

      <KnowledgeCheckModal open={quizOpen} simulation={simulation} onClose={() => setQuizOpen(false)} />
    </div>
  );
}
