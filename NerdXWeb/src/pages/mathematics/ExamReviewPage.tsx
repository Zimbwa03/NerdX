import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface ExamResults {
  session_id: string;
  score: {
    marks_awarded: number;
    marks_total: number;
    correct_count: number;
    total_questions: number;
    percentage: number;
    grade: string;
  };
  time?: { used_formatted: string };
}

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
        </p>
      </div>

      <Link to={backTo} className="exam-review-back">
        Back to {subjectLabel}
      </Link>
    </div>
  );
}
