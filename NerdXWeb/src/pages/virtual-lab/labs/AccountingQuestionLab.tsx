import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calculator, ChevronDown, ChevronUp, RefreshCw, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

export interface AccountingLabQuestion {
  question_id: string;
  question_type: string;
  difficulty_level: string;
  marks?: number;
  time_estimate?: string;
  scenario: {
    business_name: string;
    financial_year_end: string;
    context: string;
    additional_info?: string;
  };
  question_data: {
    trial_balance: Array<{ account: string; debit: number | null; credit: number | null }>;
    adjustments: Array<{ id: string; type: string; description: string }>;
    errors?: Array<{ id: string; type: string; description: string }>;
  };
  requirements?: string[];
  step_by_step_guidance?: Array<{ step: number; instruction: string; hint: string }>;
  model_answer_summary?: Record<string, unknown>;
  source?: string;
}

export type AccountingQuestionFetcher = () => Promise<unknown>;

function formatAmount(v: number | null | undefined): string {
  if (typeof v !== 'number' || !Number.isFinite(v)) return '-';
  return v.toLocaleString();
}

function titleCaseFromKey(key: string): string {
  return String(key)
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeQuestion(raw: unknown, fallback: AccountingLabQuestion): AccountingLabQuestion {
  const q: any = raw && typeof raw === 'object' ? raw : {};
  const scenarioRaw: any = q.scenario && typeof q.scenario === 'object' ? q.scenario : {};
  const qdRaw: any = q.question_data && typeof q.question_data === 'object' ? q.question_data : {};

  const trial_balance = Array.isArray(qdRaw.trial_balance) ? qdRaw.trial_balance : fallback.question_data.trial_balance;
  const adjustments = Array.isArray(qdRaw.adjustments) ? qdRaw.adjustments : fallback.question_data.adjustments;
  const errors = Array.isArray(qdRaw.errors) ? qdRaw.errors : fallback.question_data.errors;

  const steps =
    Array.isArray(q.step_by_step_guidance) && q.step_by_step_guidance.length > 0
      ? q.step_by_step_guidance
      : fallback.step_by_step_guidance;

  return {
    question_id: String(q.question_id || fallback.question_id),
    question_type: String(q.question_type || fallback.question_type),
    difficulty_level: String(q.difficulty_level || fallback.difficulty_level),
    marks: typeof q.marks === 'number' ? q.marks : fallback.marks,
    time_estimate: typeof q.time_estimate === 'string' ? q.time_estimate : fallback.time_estimate,
    scenario: {
      business_name: String(scenarioRaw.business_name || fallback.scenario.business_name),
      financial_year_end: String(scenarioRaw.financial_year_end || fallback.scenario.financial_year_end),
      context: String(scenarioRaw.context || fallback.scenario.context),
      additional_info: typeof scenarioRaw.additional_info === 'string' ? scenarioRaw.additional_info : fallback.scenario.additional_info,
    },
    question_data: {
      trial_balance,
      adjustments,
      ...(errors ? { errors } : {}),
    },
    requirements: Array.isArray(q.requirements) ? q.requirements : fallback.requirements,
    step_by_step_guidance: steps,
    model_answer_summary: q.model_answer_summary && typeof q.model_answer_summary === 'object' ? q.model_answer_summary : fallback.model_answer_summary,
    source: typeof q.source === 'string' ? q.source : fallback.source,
  };
}

interface Props {
  simulation: SimulationMetadata;
  fallbackQuestion: AccountingLabQuestion;
  fetchQuestion: AccountingQuestionFetcher;
}

export function AccountingQuestionLab({ simulation, fallbackQuestion, fetchQuestion }: Props) {
  const [question, setQuestion] = useState<AccountingLabQuestion>(fallbackQuestion);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showTrialBalance, setShowTrialBalance] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const raw = await fetchQuestion();
      setQuestion(normalizeQuestion(raw, fallbackQuestion));
    } catch (e: any) {
      setLoadError(e?.message ? String(e.message) : 'Failed to load question');
      setQuestion(fallbackQuestion);
    } finally {
      setLoading(false);
    }
  }, [fetchQuestion, fallbackQuestion]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const q = question || fallbackQuestion;
  const trialBalance = q.question_data.trial_balance || [];
  const adjustments = q.question_data.adjustments || [];
  const errors = q.question_data.errors || [];
  const steps = q.step_by_step_guidance || [];

  const summaryEntries = useMemo(() => {
    const summary = q.model_answer_summary;
    if (!summary || typeof summary !== 'object') return [];
    return Object.entries(summary as Record<string, unknown>).filter(([, v]) => typeof v === 'number' && Number.isFinite(v as number));
  }, [q.model_answer_summary]);

  return (
    <div className="subject-page-v2 virtual-lab-sim-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: `linear-gradient(135deg, ${simulation.color}, #7C4DFF)` }}>
            <Calculator size={28} />
          </div>
          <div>
            <h1>{simulation.title}</h1>
            <p>{simulation.topic}</p>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="vl-card" style={{ marginTop: 14 }}>
          <div className="vl-loading">
            <Sparkles size={18} className="vl-spin" /> Generating your question...
          </div>
          <div className="vl-card-subtitle">Using Vertex AI for a new scenario each time.</div>
        </div>
      ) : (
        <div className="vl-editor-grid wide">
          <div className="vl-col">
            {loadError ? (
              <div className="vl-card">
                <div className="vl-card-title">Could not load a new question</div>
                <div className="vl-card-subtitle">
                  Showing a practice example. Error: {loadError}
                </div>
              </div>
            ) : null}

            <div className="vl-card">
              <div className="vl-card-title">Scenario</div>
              <div className="vl-card-subtitle">
                <strong>{q.scenario.business_name}</strong> • Year end: {q.scenario.financial_year_end}
              </div>
              <div className="vl-card-subtitle" style={{ marginTop: 10 }}>
                {q.scenario.context}
              </div>
              {q.scenario.additional_info ? (
                <div className="vl-card-subtitle" style={{ marginTop: 10 }}>
                  <strong>Additional info:</strong> {q.scenario.additional_info}
                </div>
              ) : null}
            </div>

            {Array.isArray(q.requirements) && q.requirements.length ? (
              <div className="vl-card">
                <div className="vl-card-title">Requirements</div>
                <ul className="vl-bullets">
                  {q.requirements.map((r, idx) => (
                    <li key={`${q.question_id}-req-${idx}`}>{String(r)}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="vl-card">
              <button
                type="button"
                className="vl-template-btn"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                onClick={() => setShowTrialBalance((v) => !v)}
              >
                <div>
                  <div className="vl-template-title">Trial Balance (extract)</div>
                  <div className="vl-template-desc">Accounts, debit and credit totals</div>
                </div>
                {showTrialBalance ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {showTrialBalance ? (
                <div className="vl-table-wrap">
                  <table className="vl-table">
                    <thead>
                      <tr>
                        <th>Account</th>
                        <th style={{ textAlign: 'right' }}>Debit</th>
                        <th style={{ textAlign: 'right' }}>Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trialBalance.slice(0, 30).map((row, idx) => (
                        <tr key={`${q.question_id}-tb-${idx}`}>
                          <td>{row.account}</td>
                          <td style={{ textAlign: 'right' }}>{formatAmount(row.debit)}</td>
                          <td style={{ textAlign: 'right' }}>{formatAmount(row.credit)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {trialBalance.length > 30 ? (
                    <div className="vl-card-subtitle">Showing first 30 rows...</div>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="vl-card">
              <div className="vl-card-title">Adjustments</div>
              {adjustments.length ? (
                <ul className="vl-bullets">
                  {adjustments.map((adj) => (
                    <li key={adj.id}>
                      <strong>{adj.type}:</strong> {adj.description}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="vl-card-subtitle">No adjustments provided.</div>
              )}
            </div>

            {errors.length ? (
              <div className="vl-card">
                <div className="vl-card-title">Errors</div>
                <ul className="vl-bullets">
                  {errors.map((err) => (
                    <li key={err.id}>
                      <strong>{err.type}:</strong> {err.description}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="vl-card">
              <div className="vl-card-title">Step-by-Step Guidance</div>
              {steps.length ? (
                <div style={{ marginTop: 10, display: 'grid', gap: 10 }}>
                  {steps.map((s) => (
                    <div
                      key={`${q.question_id}-step-${s.step}`}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '40px 1fr',
                        gap: 10,
                        padding: 12,
                        borderRadius: 16,
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(10,14,33,0.28)',
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 14,
                          display: 'grid',
                          placeItems: 'center',
                          background: `linear-gradient(135deg, ${simulation.color}, rgba(124,77,255,0.7))`,
                          color: '#fff',
                          fontWeight: 900,
                        }}
                      >
                        {s.step}
                      </div>
                      <div>
                        <div style={{ fontWeight: 900, color: 'rgba(255,255,255,0.92)' }}>{s.instruction}</div>
                        <div style={{ marginTop: 4, color: 'rgba(255,255,255,0.68)', fontSize: 12, lineHeight: '17px' }}>
                          {s.hint}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="vl-card-subtitle">No guidance steps available.</div>
              )}
            </div>

            <div className="vl-card">
              <button
                type="button"
                className="vl-template-btn"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                onClick={() => setShowModelAnswer((v) => !v)}
              >
                <div>
                  <div className="vl-template-title">Model Answer Summary</div>
                  <div className="vl-template-desc">Check your calculations (collapsed by default)</div>
                </div>
                {showModelAnswer ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {showModelAnswer ? (
                summaryEntries.length ? (
                  <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
                    {summaryEntries.map(([k, v]) => (
                      <div
                        key={`${q.question_id}-sum-${k}`}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: 10,
                          padding: '10px 12px',
                          borderRadius: 14,
                          border: '1px solid rgba(255,255,255,0.08)',
                          background: 'rgba(10,14,33,0.28)',
                        }}
                      >
                        <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 900, fontSize: 12 }}>{titleCaseFromKey(k)}</span>
                        <span style={{ color: '#fff', fontWeight: 900, fontSize: 12 }}>{formatAmount(v as number)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="vl-card-subtitle" style={{ marginTop: 12 }}>
                    No summary provided.
                  </div>
                )
              ) : null}
            </div>
          </div>

          <div className="vl-col">
            <div className="vl-card">
              <div className="vl-card-title">Actions</div>
              <div className="vl-card-subtitle">
                {q.marks ? `${q.marks} marks` : 'Practice'} {q.time_estimate ? `• ${q.time_estimate}` : ''} • Level: {q.difficulty_level}
              </div>

              <div className="vl-row" style={{ justifyContent: 'flex-start', marginTop: 12 }}>
                <button type="button" className="vl-btn secondary" onClick={() => void refresh()} disabled={loading}>
                  <RefreshCw size={16} /> New question
                </button>
                <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)}>
                  <Sparkles size={16} /> Knowledge check
                </button>
              </div>
            </div>

            <div className="vl-card">
              <div className="vl-card-title">Learning Objectives</div>
              <ul className="vl-bullets">
                {simulation.learningObjectives.map((o) => (
                  <li key={o.id}>{o.text}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <KnowledgeCheckModal open={quizOpen} simulation={simulation} onClose={() => setQuizOpen(false)} />
    </div>
  );
}

