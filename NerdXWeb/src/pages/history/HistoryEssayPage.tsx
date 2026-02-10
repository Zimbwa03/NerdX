import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  historyApi,
  type HistoryEssayQuestion,
  type HistoryMarkingResult,
} from '../../services/api/historyApi';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';

const SUBJECT_COLOR = '#5D4037';

type LocationState = {
  topic?: { id: string; name: string };
  subject?: { id: string; name: string; color: string };
  backTo?: string;
  question?: HistoryEssayQuestion;
};

export function HistoryEssayPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;
  const { updateUser } = useAuth();

  const [question, setQuestion] = useState<HistoryEssayQuestion | null>(state.question ?? null);
  const [generating, setGenerating] = useState(false);
  const [partA, setPartA] = useState('');
  const [partB, setPartB] = useState('');
  const [partC, setPartC] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<HistoryMarkingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const topic = state.topic ?? null;
  const backTo = state.backTo ?? '/app/history';

  useEffect(() => {
    if (question || !topic) return;
    let cancelled = false;
    (async () => {
      setGenerating(true);
      setError(null);
      try {
        const res = await historyApi.generateQuestion(topic);
        if (cancelled) return;
        if (res.success && res.data) {
          setQuestion(res.data);
          if (res.credits_remaining !== undefined) updateUser({ credits: res.credits_remaining });
        } else {
          setError(res.message ?? 'Failed to generate question.');
        }
      } catch (e) {
        if (!cancelled) setError('Failed to generate question. Please try again.');
      } finally {
        if (!cancelled) setGenerating(false);
      }
    })();
    return () => { cancelled = true; };
  }, [topic, question, updateUser]);

  const handleSubmit = async () => {
    if (!question) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await historyApi.submitEssay(question, {
        part_a: partA.trim(),
        part_b: partB.trim(),
        part_c: partC.trim(),
      });
      if (res.success && res.data) {
        setResult(res.data);
        if (res.data.credits_remaining !== undefined) updateUser({ credits: res.data.credits_remaining });
      } else {
        setError(res.message ?? res.data?.error ?? 'Failed to submit.');
      }
    } catch (e) {
      setError('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewQuestion = () => {
    navigate(backTo);
  };

  if (!topic && !question) {
    return (
      <div className="commerce-topics-page history-essay-page">
        <header className="commerce-topics-header" style={{ borderLeftColor: SUBJECT_COLOR }}>
          <Link to={backTo} className="back-link">
            <ArrowLeft size={20} /> Back
          </Link>
          <h1 className="commerce-topics-title">History Essay</h1>
        </header>
        <p className="commerce-notes-detail-not-found">No topic selected. Choose a topic from the History page.</p>
      </div>
    );
  }

  if (generating && !question) {
    return (
      <div className="commerce-topics-page history-essay-page">
        <header className="commerce-topics-header" style={{ borderLeftColor: SUBJECT_COLOR }}>
          <Link to={backTo} className="back-link">
            <ArrowLeft size={20} /> Back
          </Link>
          <h1 className="commerce-topics-title">History Essay</h1>
        </header>
        <div className="commerce-loading" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Loader2 size={24} className="animate-spin" />
          Generating question…
        </div>
      </div>
    );
  }

  if (result) {
    const totalMarks = question?.total_marks ?? 32;
    const breakdown = result.breakdown ?? {};
    const hasDetailedExplanation =
      breakdown.part_a_analysis || breakdown.part_b_analysis || breakdown.part_c_analysis;
    return (
      <div className="commerce-topics-page history-essay-page history-essay-result">
        <header className="commerce-topics-header" style={{ borderLeftColor: SUBJECT_COLOR }}>
          <Link to={backTo} className="back-link">
            <ArrowLeft size={20} /> Back
          </Link>
          <h1 className="commerce-topics-title">History Essay – Results</h1>
        </header>

        <section className="commerce-notes-detail-content" style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div className="commerce-notes-detail-card commerce-notes-detail-summary">
            <h2 className="commerce-notes-detail-card-title">Scores</h2>
            <div className="commerce-notes-detail-body" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <span><strong>Part [a]:</strong> {result.part_a_score ?? 0}/5</span>
              <span><strong>Part [b]:</strong> {result.part_b_score ?? 0}/12</span>
              <span><strong>Part [c]:</strong> {result.part_c_score ?? 0}/15</span>
              <span><strong>Total:</strong> {result.total ?? 0}/{totalMarks}</span>
            </div>
            {result.part_a_feedback && (
              <p><strong>Part [a] feedback:</strong> {result.part_a_feedback}</p>
            )}
            {result.part_b_feedback && (
              <p><strong>Part [b] feedback:</strong> {result.part_b_feedback}</p>
            )}
            {result.part_c_feedback && (
              <p><strong>Part [c] feedback:</strong> {result.part_c_feedback}</p>
            )}
            {result.constructive_feedback && (
              <div style={{ marginTop: '1rem' }}>
                <h3>Constructive feedback</h3>
                <p>{result.constructive_feedback}</p>
              </div>
            )}
          </div>

          {hasDetailedExplanation && (
            <div className="commerce-notes-detail-card" style={{ marginTop: '1rem' }}>
              <h2 className="commerce-notes-detail-card-title">Detailed explanation</h2>
              <div className="commerce-notes-detail-body">
                {breakdown.part_a_analysis && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Part [a] – What was marked</h3>
                    <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{breakdown.part_a_analysis}</p>
                  </div>
                )}
                {breakdown.part_b_analysis && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Part [b] – What was marked</h3>
                    <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{breakdown.part_b_analysis}</p>
                  </div>
                )}
                {breakdown.part_c_analysis && (
                  <div style={{ marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Part [c] – What was marked</h3>
                    <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{breakdown.part_c_analysis}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="commerce-modal-actions" style={{ marginTop: '1rem' }}>
            <button type="button" className="commerce-modal-cancel" onClick={handleNewQuestion}>
              Choose another topic
            </button>
          </div>
        </section>
      </div>
    );
  }

  if (!question) return null;

  const partAInfo = question.parts[0] ?? { label: '[a]', question_text: '', marks: 5 };
  const partBInfo = question.parts[1] ?? { label: '[b]', question_text: '', marks: 12 };
  const partCInfo = question.parts[2] ?? { label: '[c]', question_text: '', marks: 15 };

  return (
    <div className="commerce-topics-page history-essay-page">
      <header className="commerce-topics-header" style={{ borderLeftColor: SUBJECT_COLOR }}>
        <Link to={backTo} className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <h1 className="commerce-topics-title">History Essay</h1>
        <p className="commerce-topics-subtitle">Topic: {question.topic}</p>
      </header>

      <main className="commerce-notes-detail-content" style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div className="commerce-notes-detail-card" style={{ marginBottom: '1.5rem' }}>
          <h2 className="commerce-notes-detail-card-title">Question</h2>
          <div className="commerce-notes-detail-body">
            <p>{question.question_text}</p>
          </div>
        </div>

        <div className="commerce-notes-detail-card" style={{ marginBottom: '1rem' }}>
          <h3 className="commerce-notes-detail-card-title">{partAInfo?.label ?? '[a]'} ({partAInfo?.marks ?? 5} marks)</h3>
          <p className="commerce-notes-detail-para" style={{ marginBottom: '0.5rem' }}>{partAInfo?.question_text ?? ''}</p>
          <textarea
            className="commerce-notes-detail-body"
            rows={4}
            placeholder="Your answer for Part [a]…"
            value={partA}
            onChange={(e) => setPartA(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', resize: 'vertical' }}
          />
        </div>

        <div className="commerce-notes-detail-card" style={{ marginBottom: '1rem' }}>
          <h3 className="commerce-notes-detail-card-title">{partBInfo?.label ?? '[b]'} ({partBInfo?.marks ?? 12} marks)</h3>
          <p className="commerce-notes-detail-para" style={{ marginBottom: '0.5rem' }}>{partBInfo?.question_text ?? ''}</p>
          <textarea
            className="commerce-notes-detail-body"
            rows={6}
            placeholder="Your answer for Part [b]…"
            value={partB}
            onChange={(e) => setPartB(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', resize: 'vertical' }}
          />
        </div>

        <div className="commerce-notes-detail-card" style={{ marginBottom: '1rem' }}>
          <h3 className="commerce-notes-detail-card-title">{partCInfo?.label ?? '[c]'} ({partCInfo?.marks ?? 15} marks)</h3>
          <p className="commerce-notes-detail-para" style={{ marginBottom: '0.5rem' }}>{partCInfo?.question_text ?? ''}</p>
          <textarea
            className="commerce-notes-detail-body"
            rows={6}
            placeholder="Your answer for Part [c]…"
            value={partC}
            onChange={(e) => setPartC(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', resize: 'vertical' }}
          />
        </div>

        {error && <p className="commerce-modal-error" style={{ marginBottom: '1rem' }}>{error}</p>}

        <div className="commerce-modal-actions">
          <button type="button" className="commerce-modal-cancel" onClick={() => navigate(backTo)} disabled={submitting}>
            Cancel
          </button>
          <button
            type="button"
            className="commerce-modal-start"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" style={{ marginRight: '0.25rem' }} />
                Submitting…
              </>
            ) : (
              <>
                <Send size={18} style={{ marginRight: '0.25rem' }} />
                Submit for marking
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
