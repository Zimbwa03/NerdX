import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, GitBranch, Lock, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

type GateType = 'AND' | 'OR' | 'XOR' | 'NAND' | 'NOR' | 'NOT';

interface GateDefinition {
  id: string;
  title: string;
  description: string;
  effort: number;
  tasks: string[];
}

const GATES: GateDefinition[] = [
  {
    id: 'gate-discovery',
    title: 'Gate 1: Discovery',
    description: 'Define the problem, users, and success criteria.',
    effort: 10,
    tasks: ['Identify user pain points', 'List constraints', 'Define success metrics'],
  },
  {
    id: 'gate-design',
    title: 'Gate 2: Design',
    description: 'Create solution options, choose a direction, and plan tasks.',
    effort: 14,
    tasks: ['Sketch solution options', 'Pick the best trade-offs', 'Draft a task plan'],
  },
  {
    id: 'gate-build',
    title: 'Gate 3: Build',
    description: 'Implement the core system and validate the output.',
    effort: 20,
    tasks: ['Build the core features', 'Write tests or checks', 'Fix the first round of defects'],
  },
  {
    id: 'gate-launch',
    title: 'Gate 4: Launch',
    description: 'Review results and prepare for release.',
    effort: 12,
    tasks: ['Review quality checklist', 'Prepare release notes', 'Plan support and monitoring'],
  },
];

function computeGateOutput(gate: GateType, a: boolean, b: boolean): boolean {
  switch (gate) {
    case 'AND':
      return a && b;
    case 'OR':
      return a || b;
    case 'XOR':
      return Boolean(a) !== Boolean(b);
    case 'NAND':
      return !(a && b);
    case 'NOR':
      return !(a || b);
    case 'NOT':
      return !a;
    default:
      return false;
  }
}

export function ProjectGatesLab({ simulation }: { simulation: SimulationMetadata }) {
  const [gateTasks, setGateTasks] = useState<Record<string, boolean[]>>(() => Object.fromEntries(GATES.map((g) => [g.id, g.tasks.map(() => false)])));
  const [enabledGates, setEnabledGates] = useState<Record<string, boolean>>(() => Object.fromEntries(GATES.map((g) => [g.id, false])));
  const [selectedGate, setSelectedGate] = useState<GateType>('AND');
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);
  const [teamSize, setTeamSize] = useState('3');
  const [declarationChecks, setDeclarationChecks] = useState({ gates: false, logic: false, calculations: false });
  const [declared, setDeclared] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  const totalEffort = useMemo(() => GATES.reduce((sum, g) => sum + g.effort, 0), []);
  const enabledEffort = useMemo(() => GATES.reduce((sum, g) => (enabledGates[g.id] ? sum + g.effort : sum), 0), [enabledGates]);
  const readinessScore = Math.round((enabledEffort / totalEffort) * 100);

  const teamSizeValue = Math.max(1, parseInt(teamSize || '1', 10));
  const effortRemaining = Math.max(0, totalEffort - enabledEffort);
  const deliveryDays = Math.max(1, Math.ceil(effortRemaining / (teamSizeValue * 4)));

  const outputValue = useMemo(() => computeGateOutput(selectedGate, inputA, inputB), [inputA, inputB, selectedGate]);

  const truthTable = useMemo(() => {
    if (selectedGate === 'NOT') {
      return [
        { a: false, b: null as boolean | null, out: true },
        { a: true, b: null as boolean | null, out: false },
      ];
    }
    return [
      { a: false, b: false, out: computeGateOutput(selectedGate, false, false) },
      { a: false, b: true, out: computeGateOutput(selectedGate, false, true) },
      { a: true, b: false, out: computeGateOutput(selectedGate, true, false) },
      { a: true, b: true, out: computeGateOutput(selectedGate, true, true) },
    ];
  }, [selectedGate]);

  const gateProgress = useMemo(() => {
    const enabledCount = GATES.filter((g) => enabledGates[g.id]).length;
    return { enabledCount, total: GATES.length };
  }, [enabledGates]);

  const canDeclare = declarationChecks.gates && declarationChecks.logic && declarationChecks.calculations;

  return (
    <div className="subject-page-v2 virtual-lab-sim-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #546E7A, #7C4DFF)' }}>
            <GitBranch size={28} />
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
            <div className="vl-card-title">What you are building</div>
            <div className="vl-card-subtitle">{simulation.description}</div>
            <div className="vl-row" style={{ justifyContent: 'flex-start' }}>
              <span className="vl-badge ok">Readiness: {readinessScore}%</span>
              <span className="vl-badge">
                Gates enabled: {gateProgress.enabledCount}/{gateProgress.total}
              </span>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Project gates board</div>
            <div className="vl-card-subtitle">Complete tasks for each gate, then enable it (like a real project review).</div>

            {GATES.map((gate) => {
              const tasks = gateTasks[gate.id] ?? [];
              const isReady = tasks.length > 0 && tasks.every(Boolean);
              const isEnabled = enabledGates[gate.id];
              return (
                <div
                  key={gate.id}
                  style={{
                    marginTop: 12,
                    padding: 12,
                    borderRadius: 16,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(10, 14, 33, 0.22)',
                  }}
                >
                  <div className="vl-row" style={{ marginTop: 0 }}>
                    <div>
                      <div style={{ fontWeight: 900, color: '#fff' }}>{gate.title}</div>
                      <div className="vl-card-subtitle" style={{ marginTop: 4 }}>
                        {gate.description}
                      </div>
                    </div>
                    <span className="vl-badge ok" style={{ background: 'rgba(124,77,255,0.14)', borderColor: 'rgba(124,77,255,0.22)', color: '#B9A7FF' }}>
                      {gate.effort} pts
                    </span>
                  </div>

                  <div className="vl-checklist" style={{ marginTop: 12 }}>
                    {gate.tasks.map((task, idx) => {
                      const checked = tasks[idx] ?? false;
                      return (
                        <button
                          key={`${gate.id}-${idx}`}
                          type="button"
                          className={`vl-check ${checked ? 'done' : ''}`}
                          onClick={() => {
                            setGateTasks((prev) => {
                              const next = { ...prev };
                              const arr = [...(next[gate.id] ?? [])];
                              arr[idx] = !arr[idx];
                              next[gate.id] = arr;
                              return next;
                            });
                          }}
                        >
                          <span className="vl-check-dot" aria-hidden="true" />
                          <span className="vl-check-text">{task}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="vl-row">
                    <button
                      type="button"
                      className="vl-btn primary"
                      disabled={!isReady || isEnabled}
                      onClick={() => {
                        if (!isReady) {
                          window.alert('Gate not ready. Finish the tasks before enabling this gate.');
                          return;
                        }
                        setEnabledGates((prev) => ({ ...prev, [gate.id]: true }));
                      }}
                      style={isEnabled ? { background: 'rgba(0,230,118,0.18)', borderColor: 'rgba(0,230,118,0.22)' } : undefined}
                    >
                      {isEnabled ? 'Gate enabled' : 'Enable gate'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Logic diagram builder</div>
            <div className="vl-card-subtitle">Toggle inputs, choose a gate, and observe the output.</div>

            <div className="vl-tab-row" style={{ marginTop: 12 }}>
              {(['AND', 'OR', 'XOR', 'NAND', 'NOR', 'NOT'] as GateType[]).map((g) => (
                <button key={g} type="button" className={`vl-tab ${selectedGate === g ? 'active' : ''}`} onClick={() => setSelectedGate(g)}>
                  {g}
                </button>
              ))}
            </div>

            <div className="vl-row" style={{ justifyContent: 'flex-start' }}>
              <button type="button" className="vl-btn secondary" onClick={() => setInputA((p) => !p)}>
                Input A: <strong>{inputA ? '1' : '0'}</strong>
              </button>
              {selectedGate !== 'NOT' ? (
                <button type="button" className="vl-btn secondary" onClick={() => setInputB((p) => !p)}>
                  Input B: <strong>{inputB ? '1' : '0'}</strong>
                </button>
              ) : null}
              <span className={`vl-badge ${outputValue ? 'ok' : ''}`} style={{ background: outputValue ? 'rgba(0,230,118,0.14)' : 'rgba(255,23,68,0.14)', borderColor: outputValue ? 'rgba(0,230,118,0.22)' : 'rgba(255,23,68,0.22)', color: outputValue ? '#00E676' : '#FF6B6B' }}>
                Output: {outputValue ? '1' : '0'}
              </span>
            </div>

            <div className="vl-table-wrap" style={{ marginTop: 12 }}>
              <table className="vl-table">
                <thead>
                  <tr>
                    <th>A</th>
                    <th>B</th>
                    <th>Out</th>
                  </tr>
                </thead>
                <tbody>
                  {truthTable.map((row, idx) => {
                    const isActive = row.a === inputA && (row.b === null || row.b === inputB);
                    return (
                      <tr key={`r-${idx}`} style={isActive ? { background: 'rgba(124,77,255,0.12)' } : undefined}>
                        <td>{row.a ? '1' : '0'}</td>
                        <td>{row.b === null ? '-' : row.b ? '1' : '0'}</td>
                        <td style={{ fontWeight: 900, color: row.out ? '#00E676' : '#FF6B6B' }}>{row.out ? '1' : '0'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Calculations</div>
            <div className="vl-card-subtitle">Readiness and delivery are based on enabled gate effort.</div>
            <div className="vl-readouts" style={{ marginTop: 12 }}>
              <div className="vl-readout">
                <div className="vl-readout-label">Enabled effort</div>
                <div className="vl-readout-value">{enabledEffort} pts</div>
              </div>
              <div className="vl-readout">
                <div className="vl-readout-label">Remaining effort</div>
                <div className="vl-readout-value">{effortRemaining} pts</div>
              </div>
              <div className="vl-readout">
                <div className="vl-readout-label">Team size</div>
                <div className="vl-readout-value">
                  <input
                    className="vl-select"
                    type="number"
                    min={1}
                    max={20}
                    step={1}
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    style={{ maxWidth: 120 }}
                  />
                </div>
              </div>
              <div className="vl-readout">
                <div className="vl-readout-label">Delivery (days)</div>
                <div className="vl-readout-value">{deliveryDays}</div>
              </div>
            </div>
            <div className="vl-card-subtitle" style={{ marginTop: 10 }}>
              Formula: days = ceil(remainingEffort / (teamSize * 4))
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Declare understanding</div>
            <div className="vl-card-subtitle">Tick all statements before unlocking the quiz.</div>
            <div className="vl-checklist">
              {([
                { id: 'gates', label: 'I enabled gates only after completing tasks.' },
                { id: 'logic', label: 'I can predict logic gate outputs (AND/OR/NOT/etc).' },
                { id: 'calculations', label: 'I understand how readiness and delivery are calculated.' },
              ] as Array<{ id: keyof typeof declarationChecks; label: string }>).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`vl-check ${declarationChecks[item.id] ? 'done' : ''}`}
                  onClick={() => setDeclarationChecks((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                >
                  <span className="vl-check-dot" aria-hidden="true" />
                  <span className="vl-check-text">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="vl-row">
              <button
                type="button"
                className="vl-btn primary"
                disabled={!canDeclare || declared}
                onClick={() => {
                  if (!canDeclare) {
                    window.alert('Almost there. Tick all statements before declaring understanding.');
                    return;
                  }
                  setDeclared(true);
                }}
              >
                {declared ? 'Understanding declared' : 'Declare understanding'}
              </button>
            </div>

            {declared ? (
              <div className="vl-check-result pass" style={{ marginTop: 12 }}>
                Great work. You can now take the knowledge check.
              </div>
            ) : null}
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Knowledge check</div>
            <div className="vl-card-subtitle">{declared ? 'Ready when you are.' : 'Declare understanding to unlock.'}</div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!declared}>
              {declared ? <Sparkles size={16} /> : <Lock size={16} />} {declared ? 'Start knowledge check' : 'Locked'}
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

