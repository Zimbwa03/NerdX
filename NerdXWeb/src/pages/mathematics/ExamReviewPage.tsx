import { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { ExamResults } from '../../services/api/examApi';

type BreakdownRow = { topic: string; correct: number; total: number; pct: number };

export function ExamReviewPage() {
  const { state } = useLocation() as {
    state?: {
      sessionId?: string;
      results?: ExamResults;
      backTo?: string;
      subjectLabel?: string;
    };
  };
  const results = state?.results;
  const backTo = state?.backTo ?? '/app/mathematics';
  const subjectLabel = state?.subjectLabel ?? 'Mathematics';

  if (!results) {
    return (
      <div className="exam-review-page">
        <Link to={backTo} className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <p>No results to display.</p>
      </div>
    );
  }

  const { score } = results;

  const breakdownRows = useMemo<BreakdownRow[]>(() => {
    const breakdown = results.topic_breakdown ?? {};
    const rows = Object.entries(breakdown).map(([topic, stats]) => {
      const total = Math.max(0, Number(stats?.total ?? 0));
      const correct = Math.max(0, Number(stats?.correct ?? 0));
      const pct = total > 0 ? correct / total : 0;
      return { topic, correct, total, pct };
    });
    // Weakest topics first (lowest accuracy), stable by total desc
    rows.sort((a, b) => (a.pct - b.pct) || (b.total - a.total));
    return rows;
  }, [results.topic_breakdown]);

  return (
    <div className="exam-review-page">
      <header className="exam-review-header">
        <Link to={backTo} className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <h1>Exam Complete</h1>
      </header>

      <div className="exam-review-score">
        <div className="exam-review-grade">{score.grade}</div>
        <p className="exam-review-percent">{score.percentage.toFixed(0)}%</p>
        <p className="exam-review-marks">
          {score.marks_awarded} / {score.marks_total} marks
        </p>
        <p className="exam-review-correct">
          {score.correct_count} of {score.total_questions} correct
          {score.answered_count !== undefined ? ` â€¢ answered: ${score.answered_count}` : ''}
          {score.unanswered_count !== undefined ? ` â€¢ unanswered: ${score.unanswered_count}` : ''}
        </p>
        {results.time?.used_formatted ? (
          <p className="exam-review-correct">Time used: {results.time.used_formatted}</p>
        ) : null}
      </div>

      {results.encouragement ? (
        <section className="exam-review-section glass-card">
          <h2>Coach Feedback</h2>
          <p className="exam-review-text">{results.encouragement}</p>
        </section>
      ) : null}

      {(results.revision_suggestions?.length || results.weak_areas?.length) ? (
        <section className="exam-review-section glass-card">
          <h2>Revision Suggestions</h2>
          {results.revision_suggestions?.length ? (
            <ul className="exam-review-list">
              {results.revision_suggestions.map((s, i) => (
                <li key={`${s}-${i}`}>{s}</li>
              ))}
            </ul>
          ) : null}
          {results.weak_areas?.length ? (
            <div className="exam-review-weak">
              <span className="exam-review-muted">Weak areas:</span>{' '}
              {results.weak_areas.slice(0, 8).join(', ')}
            </div>
          ) : null}
        </section>
      ) : null}

      {breakdownRows.length > 0 ? (
        <section className="exam-review-section glass-card">
          <h2>Topic Breakdown</h2>
          <div className="exam-breakdown-list">
            {breakdownRows.slice(0, 18).map((row) => (
              <div key={row.topic} className="exam-breakdown-row">
                <div className="exam-breakdown-top">
                  <span className="exam-breakdown-topic">{row.topic}</span>
                  <span className="exam-breakdown-score">
                    {row.correct}/{row.total} ({Math.round(row.pct * 100)}%)
                  </span>
                </div>
                <div className="exam-breakdown-bar">
                  <div className="exam-breakdown-bar-fill" style={{ width: `${Math.round(row.pct * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <Link to={backTo} className="exam-review-back">
        Back to {subjectLabel}
      </Link>
    </div>
  );
}
