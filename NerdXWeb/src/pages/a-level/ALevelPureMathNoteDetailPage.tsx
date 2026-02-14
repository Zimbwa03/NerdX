import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Info,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Lightbulb,
  PenLine,
  Sigma,
  Eye,
} from 'lucide-react';
import { MathRenderer } from '../../components/MathRenderer';
import { aLevelPureMathTopics } from '../../data/aLevelPureMath/topics';
import { getALevelPureMathNotes } from '../../data/aLevelPureMath/notes';
import type { MathTopicNotes } from '../../data/mathNotes/types';
import './ALevelPureMathNotesPage.css';

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function resolveTopicName(slug: string): string {
  const normalized = slug.toLowerCase();
  const fromName = aLevelPureMathTopics.find((topic) => toSlug(topic.name) === normalized);
  if (fromName) return fromName.name;

  const fromId = aLevelPureMathTopics.find((topic) => toSlug(topic.id) === normalized || topic.id === normalized);
  if (fromId) return fromId.name;

  return slug.replace(/-/g, ' ');
}

function PolynomialDiagramSet() {
  return (
    <div className="alevel-diagram-grid">
      <div className="alevel-diagram-card">
        <h4>End Behaviour Map</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Polynomial end behaviour diagram">
          <line x1="20" y1="90" x2="320" y2="90" />
          <line x1="170" y1="20" x2="170" y2="160" />
          <path d="M 20 140 C 90 30, 250 30, 320 140" className="curve one" />
          <path d="M 20 40 C 100 150, 240 150, 320 40" className="curve two" />
        </svg>
        <p>Even degree: both tails same direction. Positive leading term up-up, negative down-down.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Multiplicity Behaviour</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Root multiplicity behaviour">
          <line x1="20" y1="100" x2="320" y2="100" />
          <line x1="170" y1="20" x2="170" y2="160" />
          <path d="M 20 130 C 70 130, 90 80, 120 80 C 150 80, 170 120, 200 120 C 230 120, 250 70, 320 70" className="curve three" />
          <circle cx="120" cy="80" r="4" className="root-mark" />
          <circle cx="240" cy="100" r="4" className="root-mark" />
        </svg>
        <p>Simple roots cross the axis. Even multiplicity roots touch and turn.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Synthetic Division Flow</h4>
        <table className="alevel-division-table">
          <tbody>
            <tr><td>2</td><td>|</td><td>2</td><td>-3</td><td>5</td><td>-7</td><td>6</td></tr>
            <tr><td></td><td>|</td><td></td><td>4</td><td>2</td><td>14</td><td>14</td></tr>
            <tr><td></td><td>|</td><td>2</td><td>1</td><td>7</td><td>7</td><td>20</td></tr>
          </tbody>
        </table>
        <p>Read bottom row as quotient coefficients, last value as remainder.</p>
      </div>
    </div>
  );
}

function RationalFunctionsDiagramSet() {
  return (
    <div className="alevel-diagram-grid">
      <div className="alevel-diagram-card">
        <h4>Asymptote Map</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Rational function asymptotes and branches">
          <line x1="20" y1="90" x2="320" y2="90" />
          <line x1="170" y1="20" x2="170" y2="160" />
          <line x1="220" y1="20" x2="220" y2="160" className="asymptote" />
          <line x1="20" y1="55" x2="320" y2="55" className="asymptote" />
          <path d="M 24 132 C 90 126, 170 96, 208 64" className="curve four" />
          <path d="M 232 150 C 246 96, 286 74, 320 64" className="curve four" />
        </svg>
        <p>Dashed lines show vertical and horizontal asymptotes. Branches approach but do not cross them.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Partial Fractions Templates</h4>
        <table className="alevel-division-table">
          <tbody>
            <tr><td>Distinct</td><td>\\(A/(x-a)+B/(x-b)\\)</td></tr>
            <tr><td>Repeated</td><td>\\(A/(x-a)+B/(x-a)^2\\)</td></tr>
            <tr><td>Quadratic</td><td>\\((Ax+B)/(x^2+px+q)\\)</td></tr>
            <tr><td>Mixed</td><td>Combine all required forms</td></tr>
          </tbody>
        </table>
        <p>Select structure first, then solve coefficients by substitution and comparison.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Rational Inequality Sign Chart</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Sign chart across critical points">
          <line x1="28" y1="92" x2="312" y2="92" />
          <circle cx="110" cy="92" r="4" className="root-mark" />
          <circle cx="220" cy="92" r="4" className="root-mark hollow" />
          <text x="78" y="120" className="diagram-text">+</text>
          <text x="162" y="120" className="diagram-text">-</text>
          <text x="262" y="120" className="diagram-text">+</text>
          <text x="97" y="82" className="diagram-label">x = 1</text>
          <text x="202" y="82" className="diagram-label">x = -2</text>
        </svg>
        <p>Include zeros and undefined points, then test intervals to solve inequalities safely.</p>
      </div>
    </div>
  );
}

function topicMeta(topicName: string) {
  return aLevelPureMathTopics.find((topic) => topic.name === topicName) ?? null;
}

export function ALevelPureMathNoteDetailPage() {
  const { topic: topicParam } = useParams<{ topic: string }>();
  const slug = decodeURIComponent(topicParam ?? '').trim();
  const resolvedTopicName = resolveTopicName(slug);

  const notes: MathTopicNotes | null = useMemo(() => getALevelPureMathNotes(resolvedTopicName), [resolvedTopicName]);
  const meta = useMemo(() => topicMeta(notes?.topic ?? resolvedTopicName), [notes?.topic, resolvedTopicName]);

  const [expanded, setExpanded] = useState<Set<number>>(new Set([0]));

  const toggle = (index: number) => {
    setExpanded((previous) => {
      const next = new Set(previous);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  if (!notes) {
    return (
      <div className="math-notes-page alevel-pure-notes-detail">
        <header className="math-notes-header-bar">
          <Link to="/app/pure-math/notes" className="back-link">
            <ArrowLeft size={20} /> Back to notes
          </Link>
          <h1 className="math-notes-header-title">A-Level Pure Math Notes</h1>
        </header>
        <div className="math-notes-card">
          <div className="math-notes-card-body">
            Notes for this topic are not available yet.
          </div>
        </div>
      </div>
    );
  }

  const showPolynomialDiagrams = notes.topic === 'Polynomials';
  const showRationalFunctionDiagrams = notes.topic === 'Rational Functions';

  return (
    <div className="math-notes-page alevel-pure-notes-detail">
      <header className="math-notes-header-bar alevel-notes-detail-header">
        <Link to="/app/pure-math/notes" className="back-link">
          <ArrowLeft size={20} /> Back to A-Level notes
        </Link>
        <span className="math-notes-header-subtitle">A-Level Pure Mathematics - Book Notes</span>
        <h1 className="math-notes-header-title">{notes.topic}</h1>
        {meta ? (
          <div className="alevel-topic-meta-strip">
            <span>{meta.difficulty}</span>
            <span>{meta.paperRelevance}</span>
            <span>{meta.learningObjectives.length} objectives</span>
          </div>
        ) : null}
      </header>

      <div className="math-notes-content">
        <div className="math-notes-card math-notes-summary-card">
          <div className="math-notes-card-header">
            <Info size={24} className="math-notes-card-icon math-notes-icon-info" />
            <h2 className="math-notes-card-title">Chapter Summary</h2>
          </div>
          <div className="math-notes-card-body">
            <MathRenderer content={notes.summary} fontSize={16} />
          </div>
        </div>

        {notes.sections.map((section, index) => (
          <div key={`${section.title}-${index}`} className="math-notes-card math-notes-section-card">
            <button type="button" className="math-notes-section-head" onClick={() => toggle(index)}>
              <h2 className="math-notes-card-title">
                <span className="alevel-section-index">{index + 1}.</span> {section.title}
              </h2>
              {expanded.has(index) ? <ChevronUp size={24} className="math-notes-chevron" /> : <ChevronDown size={24} className="math-notes-chevron" />}
            </button>

            {expanded.has(index) ? (
              <div className="math-notes-card-body">
                <MathRenderer content={section.content} fontSize={16} />
                {section.worked_examples?.map((example, exampleIndex) => (
                  <div key={`${section.title}-example-${exampleIndex}`} className="math-notes-example-box">
                    <div className="math-notes-example-header">
                      <PenLine size={20} className="math-notes-example-icon" />
                      <span className="math-notes-example-title">Worked Example {exampleIndex + 1}</span>
                    </div>
                    <MathRenderer content={example.question} fontSize={16} />
                    <div className="math-notes-steps">
                      {example.steps.map((step, stepIndex) => (
                        <div key={`${section.title}-step-${stepIndex}`} className="math-notes-step-row">
                          <span className="math-notes-step-num">{stepIndex + 1}</span>
                          <div className="math-notes-step-content">
                            <MathRenderer content={step} fontSize={15} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="math-notes-example-answer">
                      <span className="math-notes-answer-label">Final Answer:</span>
                      <MathRenderer content={example.final_answer} fontSize={16} />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}

        <div className="math-notes-card alevel-visual-card">
          <div className="math-notes-card-header">
            <Eye size={24} className="math-notes-card-icon math-notes-icon-info" />
            <h2 className="math-notes-card-title">Visual Diagrams</h2>
          </div>
          <div className="math-notes-card-body">
            {showPolynomialDiagrams ? <PolynomialDiagramSet /> : null}
            {showRationalFunctionDiagrams ? <RationalFunctionsDiagramSet /> : null}
            {notes.visual_descriptions?.length ? (
              <ul className="math-notes-points-list alevel-visual-list">
                {notes.visual_descriptions.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>No visual description has been added for this topic yet.</p>
            )}
          </div>
        </div>

        {notes.key_points?.length > 0 ? (
          <div className="math-notes-card math-notes-keypoints-card">
            <div className="math-notes-card-header">
              <CheckCircle size={24} className="math-notes-card-icon math-notes-icon-success" />
              <h2 className="math-notes-card-title">Key Points</h2>
            </div>
            <div className="math-notes-card-body">
              <ul className="math-notes-points-list">
                {notes.key_points.map((point, index) => (
                  <li key={`${point}-${index}`}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        {notes.exam_tips?.length > 0 ? (
          <div className="math-notes-card math-notes-examtips-card">
            <div className="math-notes-card-header">
              <Lightbulb size={24} className="math-notes-card-icon math-notes-icon-warning" />
              <h2 className="math-notes-card-title">Exam Tips</h2>
            </div>
            <div className="math-notes-card-body">
              <ul className="math-notes-tips-list">
                {notes.exam_tips.map((tip, index) => (
                  <li key={`${tip}-${index}`}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        <div className="math-notes-card alevel-next-topic-card">
          <div className="math-notes-card-header">
            <Sigma size={22} className="math-notes-card-icon" />
            <h2 className="math-notes-card-title">Continue Building</h2>
          </div>
          <div className="math-notes-card-body">
            <p>Move chapter by chapter from Topic 1 through Topic 24. Each topic supports topical generation and structured exam practice.</p>
            <Link to="/app/pure-math/notes" className="alevel-back-to-index-link">Return to chapter index</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
