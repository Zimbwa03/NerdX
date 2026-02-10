import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

const GRID_SIZE = 5;
const TARGET_GRID_REF = { e: 2, n: 3 };

export function MapWorkLab({ simulation }: { simulation: SimulationMetadata }) {
  const [selectedCell, setSelectedCell] = useState<{ e: number; n: number } | null>(null);
  const [task1Correct, setTask1Correct] = useState<boolean | null>(null);
  const [task2Answer, setTask2Answer] = useState<number | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);

  const distanceOptions = useMemo(
    () => [
      { value: 2, label: '2 km' },
      { value: 3, label: '3 km' },
      { value: 4, label: '4 km' },
      { value: 5, label: '5 km' },
    ],
    []
  );
  const correctDistance = 4;

  const onCell = (e: number, n: number) => {
    setSelectedCell({ e, n });
    setTask1Correct(e === TARGET_GRID_REF.e && n === TARGET_GRID_REF.n);
  };

  const canTakeQuiz = task1Correct !== null && task2Answer !== null;

  const gridCells = useMemo(() => {
    const rows: Array<Array<{ e: number; n: number }>> = [];
    for (let r = GRID_SIZE; r >= 1; r -= 1) {
      const row: Array<{ e: number; n: number }> = [];
      for (let c = 1; c <= GRID_SIZE; c += 1) row.push({ e: c, n: r });
      rows.push(row);
    }
    return rows;
  }, []);

  return (
    <div className="subject-page-v2 virtual-lab-sim-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #2E7D32, #1B5E20)' }}>
            <Compass size={28} />
          </div>
          <div>
            <h1>{simulation.title}</h1>
            <p>{simulation.topic}</p>
          </div>
        </div>
      </header>

      <div className="vl-editor-grid wide">
        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Compass Directions</div>
            <div className="vl-card-subtitle">North (N), South (S), East (E), West (W).</div>
            <div style={{ display: 'grid', placeItems: 'center', padding: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '48px 48px 48px', gap: 10, alignItems: 'center' }}>
                <div />
                <div className="vl-pill-mini" style={{ textAlign: 'center' }}>
                  N
                </div>
                <div />
                <div className="vl-pill-mini" style={{ textAlign: 'center' }}>
                  W
                </div>
                <div className="vl-pill-mini" style={{ textAlign: 'center', background: 'rgba(124,77,255,0.2)' }}>
                  +
                </div>
                <div className="vl-pill-mini" style={{ textAlign: 'center' }}>
                  E
                </div>
                <div />
                <div className="vl-pill-mini" style={{ textAlign: 'center' }}>
                  S
                </div>
                <div />
              </div>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Task 1: 4-Figure Grid Reference</div>
            <div className="vl-card-subtitle">Tap the grid square with reference 23 (easting 2, northing 3).</div>

            <div style={{ display: 'grid', gap: 8 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr', gap: 8, alignItems: 'start' }}>
                <div style={{ display: 'grid', gap: 8 }}>
                  {Array.from({ length: GRID_SIZE }, (_, i) => GRID_SIZE - i).map((n) => (
                    <div key={`n-${n}`} className="vl-pill-mini" style={{ width: 36, textAlign: 'center' }}>
                      {n}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gap: 8 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gap: 8 }}>
                    {Array.from({ length: GRID_SIZE }, (_, i) => i + 1).map((e) => (
                      <div key={`e-${e}`} className="vl-pill-mini" style={{ textAlign: 'center' }}>
                        {e}
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gap: 8 }}>
                    {gridCells.map((row) => (
                      <div key={`row-${row[0].n}`} style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gap: 8 }}>
                        {row.map((cell) => {
                          const selected = selectedCell?.e === cell.e && selectedCell?.n === cell.n;
                          const correct = cell.e === TARGET_GRID_REF.e && cell.n === TARGET_GRID_REF.n;
                          const bg = selected ? (correct ? 'rgba(0,230,118,0.22)' : 'rgba(255,23,68,0.18)') : 'rgba(255,255,255,0.06)';
                          const border = selected ? (correct ? 'rgba(0,230,118,0.35)' : 'rgba(255,23,68,0.35)') : 'rgba(255,255,255,0.1)';
                          return (
                            <button
                              key={`c-${cell.e}-${cell.n}`}
                              type="button"
                              className="vl-template-btn"
                              style={{
                                padding: 12,
                                borderRadius: 14,
                                background: bg,
                                borderColor: border,
                                textAlign: 'center',
                                fontWeight: 900,
                              }}
                              onClick={() => onCell(cell.e, cell.n)}
                            >
                              {cell.e}
                              {cell.n}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {task1Correct !== null && (
                <div className={`vl-check-result ${task1Correct ? 'pass' : 'fail'}`}>
                  {task1Correct ? (
                    <span>
                      Correct: {TARGET_GRID_REF.e}
                      {TARGET_GRID_REF.n}.
                    </span>
                  ) : (
                    <span>
                      Not quite. Eastings first, then northings. Try square {TARGET_GRID_REF.e}
                      {TARGET_GRID_REF.n}.
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Task 2: Scale and Distance</div>
            <div className="vl-card-subtitle">
              Distance from A(1,1) to B(3,4). Scale: 1 square = 1 km. Which is closest?
            </div>

            <div className="vl-row" style={{ justifyContent: 'flex-start' }}>
              {distanceOptions.map((opt) => {
                const selected = task2Answer === opt.value;
                const show = task2Answer !== null;
                const correct = opt.value === correctDistance;
                const bg = !show ? 'rgba(255,255,255,0.06)' : selected ? (correct ? 'rgba(0,230,118,0.22)' : 'rgba(255,23,68,0.18)') : 'rgba(255,255,255,0.06)';
                const border = !show ? 'rgba(255,255,255,0.1)' : selected ? (correct ? 'rgba(0,230,118,0.35)' : 'rgba(255,23,68,0.35)') : 'rgba(255,255,255,0.1)';
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className="vl-btn"
                    style={{ background: bg, borderColor: border }}
                    onClick={() => setTask2Answer(opt.value)}
                    disabled={task2Answer !== null}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {task2Answer !== null && (
              <div className={`vl-check-result ${task2Answer === correctDistance ? 'pass' : 'fail'}`}>
                {task2Answer === correctDistance ? (
                  <span>Correct: about 4 km (sqrt(13) ≈ 3.6 km, closest option is 4 km).</span>
                ) : (
                  <span>
                    Distance is straight-line using Pythagoras: sqrt((3-1)^2 + (4-1)^2) = sqrt(13) ≈ 3.6 km, so pick 4 km.
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Unlock Knowledge Check</div>
            <div className="vl-card-subtitle">Complete both tasks. Progress: {(task1Correct !== null ? 1 : 0) + (task2Answer !== null ? 1 : 0)} / 2.</div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
              <Sparkles size={16} /> {canTakeQuiz ? 'Start knowledge check' : 'Finish tasks'}
            </button>
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
