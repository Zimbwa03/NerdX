import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ChevronRight, FlaskConical, Minus, Plus, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

type Difficulty = 'easy' | 'medium' | 'hard';

type ChemicalEquation = {
  id: string;
  reactants: string[];
  products: string[];
  correctCoefficients: number[];
  difficulty: Difficulty;
};

const SUBSCRIPT: Record<string, string> = {
  '₀': '0',
  '₁': '1',
  '₂': '2',
  '₃': '3',
  '₄': '4',
  '₅': '5',
  '₆': '6',
  '₇': '7',
  '₈': '8',
  '₉': '9',
};

function normalizeFormula(formula: string): string {
  return formula.replace(/[₀-₉]/g, (m) => SUBSCRIPT[m] ?? m);
}

function parseAtoms(formula: string): Record<string, number> {
  const atoms: Record<string, number> = {};
  const regex = /([A-Z][a-z]?)(\d*)/g;
  let match: RegExpExecArray | null;

  const normalized = normalizeFormula(formula);
  // basic parser (no parentheses nesting) - matches mobile behavior for the lab set
  while ((match = regex.exec(normalized)) !== null) {
    const element = match[1];
    const count = match[2] ? Number.parseInt(match[2], 10) : 1;
    atoms[element] = (atoms[element] || 0) + count;
  }
  return atoms;
}

function calculateSideAtoms(formulas: string[], coeffs: number[]): Record<string, number> {
  const totals: Record<string, number> = {};
  formulas.forEach((formula, index) => {
    const atoms = parseAtoms(formula);
    const coeff = coeffs[index] || 1;
    Object.entries(atoms).forEach(([element, count]) => {
      totals[element] = (totals[element] || 0) + count * coeff;
    });
  });
  return totals;
}

function CoefficientControl({ value, onChange }: { value: number; onChange: (delta: number) => void }) {
  return (
    <div className="vl-coeff">
      <button type="button" className="vl-btn secondary" onClick={() => onChange(-1)} aria-label="Decrease coefficient">
        <Minus size={16} />
      </button>
      <div className="vl-coeff-value">{value}</div>
      <button type="button" className="vl-btn secondary" onClick={() => onChange(1)} aria-label="Increase coefficient">
        <Plus size={16} />
      </button>
    </div>
  );
}

export function EquationBalancerLab({ simulation }: { simulation: SimulationMetadata }) {
  const [equations, setEquations] = useState<ChemicalEquation[]>([]);
  const [level, setLevel] = useState(0);
  const [coefficients, setCoefficients] = useState<number[]>([]);
  const [completed, setCompleted] = useState<number[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const mod = await import('../../../data/virtualLab/simulationsData');
      if (!active) return;
      const list = (mod.CHEMICAL_EQUATIONS as ChemicalEquation[])
        .filter((eq) => eq.difficulty !== 'hard')
        .slice(0, 6);
      setEquations(list);
    })();
    return () => {
      active = false;
    };
  }, []);

  const current = equations[level];

  useEffect(() => {
    if (!current) return;
    setCoefficients(new Array(current.correctCoefficients.length).fill(1));
    setShowSuccess(false);
  }, [current?.id]);

  const reactantCount = current?.reactants.length ?? 0;
  const reactantCoeffs = coefficients.slice(0, reactantCount);
  const productCoeffs = coefficients.slice(reactantCount);

  const reactantAtoms = useMemo(
    () => (current ? calculateSideAtoms(current.reactants, reactantCoeffs) : {}),
    [current, reactantCoeffs]
  );
  const productAtoms = useMemo(
    () => (current ? calculateSideAtoms(current.products, productCoeffs) : {}),
    [current, productCoeffs]
  );

  const allElements = useMemo(() => {
    return [...new Set([...Object.keys(reactantAtoms), ...Object.keys(productAtoms)])];
  }, [productAtoms, reactantAtoms]);

  const balanced = useMemo(() => {
    if (!current || current.reactants.length === 0) return false;
    for (const el of allElements) {
      if ((reactantAtoms[el] || 0) !== (productAtoms[el] || 0)) return false;
    }
    return true;
  }, [allElements, current, productAtoms, reactantAtoms]);

  const changeCoeff = (index: number, delta: number) => {
    setCoefficients((prev) => {
      const next = [...prev];
      next[index] = Math.max(1, Math.min(10, (next[index] || 1) + delta));
      return next;
    });
  };

  const checkBalance = () => {
    if (!balanced) return;
    setShowSuccess(true);
    setCompleted((prev) => (prev.includes(level) ? prev : [...prev, level]));
  };

  const canTakeQuiz = completed.length >= 3;

  return (
    <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #9C27B0, #651FFF)' }}>
            <FlaskConical size={28} />
          </div>
          <div>
            <h1>{simulation.title}</h1>
            <p>{simulation.topic}</p>
          </div>
        </div>
      </header>

      <div className="vl-editor-grid">
        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Equation</div>
            <div className="vl-card-subtitle">Adjust coefficients until atom counts match on both sides.</div>

            {!current ? (
              <div className="vl-card-subtitle">Loading equations...</div>
            ) : (
              <>
                <div className="vl-eq">
                  <div className="vl-eq-side">
                    {current.reactants.map((f, i) => (
                      <div key={`r-${i}`} className="vl-eq-item">
                        <CoefficientControl value={coefficients[i] || 1} onChange={(d) => changeCoeff(i, d)} />
                        <div className="vl-eq-formula">{f}</div>
                        {i < current.reactants.length - 1 && <div className="vl-eq-op">+</div>}
                      </div>
                    ))}
                  </div>

                  <div className="vl-eq-arrow">
                    <ChevronRight size={22} />
                  </div>

                  <div className="vl-eq-side">
                    {current.products.map((f, i) => {
                      const idx = current.reactants.length + i;
                      return (
                        <div key={`p-${i}`} className="vl-eq-item">
                          <CoefficientControl value={coefficients[idx] || 1} onChange={(d) => changeCoeff(idx, d)} />
                          <div className="vl-eq-formula">{f}</div>
                          {i < current.products.length - 1 && <div className="vl-eq-op">+</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="vl-row">
                  <button type="button" className="vl-btn primary" onClick={checkBalance} disabled={!balanced}>
                    <CheckCircle size={16} /> {balanced ? 'Balanced! Confirm' : 'Not balanced yet'}
                  </button>

                  <button
                    type="button"
                    className="vl-btn secondary"
                    disabled={!showSuccess || level >= equations.length - 1}
                    onClick={() => setLevel((v) => Math.min(equations.length - 1, v + 1))}
                  >
                    Next equation
                  </button>

                  <button type="button" className="vl-btn primary" disabled={!canTakeQuiz} onClick={() => setQuizOpen(true)}>
                    <Sparkles size={16} /> {canTakeQuiz ? 'Knowledge check' : 'Balance 3 equations'}
                  </button>
                </div>

                {showSuccess && (
                  <div className="vl-check-result pass">
                    <CheckCircle size={16} />
                    <span>Great! This equation is balanced.</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Atom count</div>
            {allElements.length === 0 ? (
              <div className="vl-card-subtitle">Adjust coefficients to see counts.</div>
            ) : (
              <div className="vl-table-wrap">
                <table className="vl-table">
                  <thead>
                    <tr>
                      <th>Element</th>
                      <th>Reactants</th>
                      <th>Products</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allElements.map((el) => {
                      const r = reactantAtoms[el] || 0;
                      const p = productAtoms[el] || 0;
                      const ok = r === p && r > 0;
                      return (
                        <tr key={el}>
                          <td>{el}</td>
                          <td>{r}</td>
                          <td>{p}</td>
                          <td>{ok ? 'OK' : 'Fix'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
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

      <KnowledgeCheckModal open={quizOpen} simulation={simulation} onClose={() => setQuizOpen(false)} />
    </div>
  );
}

