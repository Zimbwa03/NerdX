import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Beaker, Sparkles, ThermometerSun } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

type TestResult = 'none' | 'positive' | 'negative';

type FoodTest = {
  id: string;
  name: string;
  reagent: string;
  procedure: string;
  positiveResult: string;
  negativeResult: string;
  detects: string;
  color: string;
};

type FoodSample = {
  id: string;
  name: string;
  nutrients: string[];
};

type FoodTestResultRow = {
  foodId: string;
  testId: string;
  result: TestResult;
  colorResult: string;
};

function positiveColor(testId: string): string {
  if (testId === 'benedicts') return '#E65100';
  if (testId === 'iodine') return '#1A237E';
  if (testId === 'biuret') return '#7B1FA2';
  if (testId === 'ethanol') return '#ECEFF1';
  return '#9E9E9E';
}

function negativeColor(testId: string): string {
  if (testId === 'benedicts') return '#2196F3';
  if (testId === 'iodine') return '#795548';
  if (testId === 'biuret') return '#2196F3';
  if (testId === 'ethanol') return 'transparent';
  return '#9E9E9E';
}

function isPositive(food: FoodSample, test: FoodTest): boolean {
  if (test.id === 'benedicts') return food.nutrients.includes('sugar');
  if (test.id === 'iodine') return food.nutrients.includes('starch');
  if (test.id === 'biuret') return food.nutrients.includes('protein');
  if (test.id === 'ethanol') return food.nutrients.includes('fat');
  return false;
}

export function FoodTestLab({ simulation }: { simulation: SimulationMetadata }) {
  const [foodSamples, setFoodSamples] = useState<FoodSample[]>([]);
  const [foodTests, setFoodTests] = useState<FoodTest[]>([]);
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<FoodTestResultRow | null>(null);
  const [testResults, setTestResults] = useState<FoodTestResultRow[]>([]);
  const [heating, setHeating] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const mod = await import('../../../data/virtualLab/simulationsData');
      if (!active) return;
      setFoodSamples(mod.FOOD_SAMPLES as FoodSample[]);
      setFoodTests(mod.FOOD_TESTS as FoodTest[]);
    })();
    return () => {
      active = false;
    };
  }, []);

  const selectedFoodObj = useMemo(
    () => (selectedFood ? foodSamples.find((f) => f.id === selectedFood) ?? null : null),
    [foodSamples, selectedFood]
  );
  const selectedTestObj = useMemo(
    () => (selectedTest ? foodTests.find((t) => t.id === selectedTest) ?? null : null),
    [foodTests, selectedTest]
  );

  const uniqueTestsCompleted = useMemo(() => new Set(testResults.map((r) => r.testId)).size, [testResults]);
  const canTakeQuiz = uniqueTestsCompleted >= 3;

  const liquidColor = useMemo(() => {
    if (currentResult) return currentResult.colorResult;
    if (selectedTestObj) return negativeColor(selectedTestObj.id);
    return '#E3F2FD';
  }, [currentResult, selectedTestObj]);

  const completeTest = (food: FoodSample, test: FoodTest, positive: boolean) => {
    const row: FoodTestResultRow = {
      foodId: food.id,
      testId: test.id,
      result: positive ? 'positive' : 'negative',
      colorResult: positive ? positiveColor(test.id) : negativeColor(test.id),
    };
    setCurrentResult(row);
    setTestResults((prev) => {
      const exists = prev.some((r) => r.foodId === row.foodId && r.testId === row.testId);
      return exists ? prev : [...prev, row];
    });
  };

  const performTest = () => {
    if (!selectedFoodObj || !selectedTestObj) return;
    const positive = isPositive(selectedFoodObj, selectedTestObj);

    if (selectedTestObj.id === 'benedicts') {
      setHeating(true);
      window.setTimeout(() => {
        setHeating(false);
        completeTest(selectedFoodObj, selectedTestObj, positive);
      }, 1600);
      return;
    }

    completeTest(selectedFoodObj, selectedTestObj, positive);
  };

  const reset = () => {
    setSelectedFood(null);
    setSelectedTest(null);
    setCurrentResult(null);
    setHeating(false);
  };

  return (
    <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #FF5722, #E65100)' }}>
            <Beaker size={28} />
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
            <div className="vl-card-title">Virtual Bench</div>
            <div className="vl-card-subtitle">Pick a food sample, choose a test, then run it to observe results.</div>

            <div className="vl-canvas-wrap">
              <svg className="vl-sim-svg" viewBox="0 0 280 240" role="img" aria-label="Beaker">
                <defs>
                  <linearGradient id="glass" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.75)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
                  </linearGradient>
                </defs>
                <rect x="70" y="30" width="140" height="180" rx="14" fill="url(#glass)" stroke="rgba(255,255,255,0.35)" />
                <rect x="80" y="40" width="120" height="160" rx="12" fill="rgba(10, 14, 33, 0.18)" />
                <rect x="80" y="120" width="120" height="80" rx="12" fill={liquidColor} opacity={selectedTestObj?.id === 'ethanol' ? 0.55 : 0.75} />
                <path
                  d="M 70 30 C 82 18, 198 18, 210 30"
                  fill="none"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="3"
                />

                {heating && (
                  <>
                    {Array.from({ length: 7 }).map((_, i) => (
                      <path
                        key={`heat-${i}`}
                        d={`M ${95 + i * 14} 210 C ${90 + i * 14} 195, ${102 + i * 14} 190, ${95 + i * 14} 175`}
                        fill="none"
                        stroke="rgba(255, 152, 0, 0.75)"
                        strokeWidth="2"
                      />
                    ))}
                  </>
                )}
              </svg>
            </div>

            <div className="vl-row" style={{ marginTop: 12 }}>
              <button type="button" className="vl-btn primary" onClick={performTest} disabled={!selectedFoodObj || !selectedTestObj || heating}>
                {heating ? (
                  <>
                    <ThermometerSun size={16} /> Heating...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Run test
                  </>
                )}
              </button>
              <button type="button" className="vl-btn secondary" onClick={reset} disabled={heating}>
                Reset
              </button>
            </div>

            {currentResult && selectedFoodObj && selectedTestObj && (
              <div className="vl-explanation ok" style={{ marginTop: 12 }}>
                <strong>
                  {currentResult.result === 'positive' ? 'Positive test' : 'Negative test'}:
                </strong>{' '}
                {selectedTestObj.name} on {selectedFoodObj.name}. {currentResult.result === 'positive' ? selectedTestObj.positiveResult : selectedTestObj.negativeResult}.
              </div>
            )}
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Food Samples</div>
            <div className="vl-card-subtitle">Select one sample to test.</div>
            <div className="vl-tab-row" role="list">
              {foodSamples.length === 0 ? (
                <div className="vl-card-subtitle">Loading samples...</div>
              ) : (
                foodSamples.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={`vl-tab ${selectedFood === f.id ? 'active' : ''}`}
                    onClick={() => setSelectedFood(f.id)}
                  >
                    {f.name}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Tests</div>
            <div className="vl-card-subtitle">Choose a reagent and read the procedure.</div>
            {foodTests.length === 0 ? (
              <div className="vl-card-subtitle">Loading tests...</div>
            ) : (
              <div className="vl-template-list">
                {foodTests.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`vl-template-btn ${selectedTest === t.id ? 'active' : ''}`}
                    onClick={() => setSelectedTest(t.id)}
                  >
                    <div className="vl-template-title">
                      <span className="vl-dot" style={{ background: t.color }} aria-hidden="true" />
                      {t.name}
                      <span className="vl-pill-mini">{t.detects}</span>
                    </div>
                    <div className="vl-template-desc">
                      <strong>Reagent:</strong> {t.reagent}
                      <br />
                      <strong>Procedure:</strong> {t.procedure}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Results Table</div>
            <div className="vl-card-subtitle">Track what you have tested.</div>
            {testResults.length === 0 ? (
              <div className="vl-card-subtitle">No results yet. Run a few tests.</div>
            ) : (
              <div className="vl-table-wrap">
                <table className="vl-table">
                  <thead>
                    <tr>
                      <th>Food</th>
                      <th>Test</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testResults.map((r) => (
                      <tr key={`${r.foodId}-${r.testId}`}>
                        <td>{foodSamples.find((f) => f.id === r.foodId)?.name ?? r.foodId}</td>
                        <td>{foodTests.find((t) => t.id === r.testId)?.name ?? r.testId}</td>
                        <td style={{ fontWeight: 900, color: r.result === 'positive' ? '#00E676' : 'rgba(255,255,255,0.72)' }}>
                          {r.result.toUpperCase()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Unlock Knowledge Check</div>
            <div className="vl-card-subtitle">
              Complete at least 3 different test types. Progress: {Math.min(uniqueTestsCompleted, 3)} / 3.
            </div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
              <Sparkles size={16} /> {canTakeQuiz ? 'Start knowledge check' : 'Keep testing'}
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

