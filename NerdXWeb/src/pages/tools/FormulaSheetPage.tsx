import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, Sigma } from 'lucide-react';
import { MathRenderer } from '../../components/MathRenderer';

type FormulaItem = { name: string; latex: string; description?: string };
type FormulaCategory = { id: string; title: string; items: FormulaItem[] };

const FORMULAS: FormulaCategory[] = [
  {
    id: 'algebra',
    title: 'Algebra',
    items: [
      { name: 'Quadratic formula', latex: String.raw`x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}`, description: String.raw`For $ax^2 + bx + c = 0$` },
      { name: 'Difference of squares', latex: String.raw`a^2 - b^2 = (a - b)(a + b)` },
      { name: 'Perfect square', latex: String.raw`(a + b)^2 = a^2 + 2ab + b^2` },
    ],
  },
  {
    id: 'geometry',
    title: 'Geometry',
    items: [
      { name: 'Area of a circle', latex: String.raw`A = \pi r^2` },
      { name: 'Circumference', latex: String.raw`C = 2\pi r` },
      { name: 'Area of a triangle', latex: String.raw`A = \frac{1}{2}bh` },
      { name: 'Pythagoras theorem', latex: String.raw`a^2 + b^2 = c^2`, description: 'Right-angled triangle' },
    ],
  },
  {
    id: 'trigonometry',
    title: 'Trigonometry',
    items: [
      { name: 'Sine rule', latex: String.raw`\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C}` },
      { name: 'Cosine rule', latex: String.raw`c^2 = a^2 + b^2 - 2ab\cos C` },
      { name: 'Area (two sides and included angle)', latex: String.raw`A = \frac{1}{2}ab\sin C` },
    ],
  },
  {
    id: 'indices',
    title: 'Indices',
    items: [
      { name: 'Multiplication', latex: String.raw`a^m \cdot a^n = a^{m+n}` },
      { name: 'Division', latex: String.raw`\frac{a^m}{a^n} = a^{m-n}` },
      { name: 'Power of a power', latex: String.raw`(a^m)^n = a^{mn}` },
      { name: 'Negative index', latex: String.raw`a^{-n} = \frac{1}{a^n}` },
    ],
  },
];

function Equation({ latex }: { latex: string }) {
  const content = useMemo(() => `$$${latex}$$`, [latex]);
  return <MathRenderer content={content} fontSize={16} className="formula-equation" />;
}

export function FormulaSheetPage() {
  const [expandedId, setExpandedId] = useState<string | null>('algebra');

  return (
    <div className="formula-sheet-page">
      <header className="subject-header-v2">
        <Link to="/app" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #2979FF, #7C4DFF)' }}>
            <Sigma size={28} />
          </div>
          <div>
            <h1>Formula Sheet</h1>
            <p>Essential formulas for quick revision</p>
          </div>
        </div>
      </header>

      <div className="formula-sheet-content">
        {FORMULAS.map((cat) => {
          const expanded = expandedId === cat.id;
          return (
            <div key={cat.id} className={`formula-card ${expanded ? 'expanded' : ''}`}>
              <button
                type="button"
                className="formula-card-head"
                onClick={() => setExpandedId((prev) => (prev === cat.id ? null : cat.id))}
              >
                <div className="formula-card-title">
                  <h2>{cat.title}</h2>
                  <span className="formula-card-count">{cat.items.length} items</span>
                </div>
                {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {expanded && (
                <div className="formula-card-body">
                  {cat.items.map((f) => (
                    <div key={f.name} className="formula-item">
                      <div className="formula-name">{f.name}</div>
                      <div className="formula-eq-wrap">
                        <Equation latex={f.latex} />
                      </div>
                      {f.description && <div className="formula-desc">{f.description}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

