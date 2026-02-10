import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Microscope, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

type CellType = 'plant' | 'animal';
type Magnification = 100 | 400 | 1000;

type Organelle = {
  id: string;
  name: string;
  description: string;
  color: string;
};

type OrganelleData = { plant: Organelle[]; animal: Organelle[] };

function magScale(mag: Magnification): number {
  if (mag === 100) return 0.92;
  if (mag === 1000) return 1.16;
  return 1.0;
}

function seededPoints(seed: number, count: number): Array<{ x: number; y: number }> {
  let t = seed >>> 0;
  const next = () => {
    // xorshift32
    t ^= t << 13;
    t ^= t >>> 17;
    t ^= t << 5;
    return (t >>> 0) / 4294967296;
  };
  const pts: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < count; i += 1) {
    pts.push({ x: next(), y: next() });
  }
  return pts;
}

export function CellExplorerLab({ simulation }: { simulation: SimulationMetadata }) {
  const [data, setData] = useState<OrganelleData | null>(null);
  const [cellType, setCellType] = useState<CellType>('plant');
  const [magnification, setMagnification] = useState<Magnification>(400);
  const [selectedOrganelle, setSelectedOrganelle] = useState<Organelle | null>(null);
  const [labeled, setLabeled] = useState<string[]>([]);
  const [quizOpen, setQuizOpen] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const mod = await import('../../../data/virtualLab/simulationsData');
      if (!active) return;
      setData(mod.CELL_ORGANELLES as OrganelleData);
    })();
    return () => {
      active = false;
    };
  }, []);

  const organelles = useMemo(() => {
    if (!data) return [];
    return data[cellType] ?? [];
  }, [cellType, data]);

  useEffect(() => {
    setSelectedOrganelle(null);
    setLabeled([]);
  }, [cellType]);

  const progress = organelles.length ? Math.round((labeled.length / organelles.length) * 100) : 0;
  const canTakeQuiz = organelles.length > 0 && labeled.length === organelles.length;

  const orgMap = useMemo(() => new Map(organelles.map((o) => [o.id, o] as const)), [organelles]);
  const mark = (id: string) => {
    const o = orgMap.get(id);
    if (!o) return;
    setSelectedOrganelle(o);
    setLabeled((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const ribosomes = useMemo(() => seededPoints(cellType === 'plant' ? 42 : 99, 18), [cellType]);
  const scale = magScale(magnification);
  const isLabeled = (id: string) => labeled.includes(id);

  return (
    <div className="subject-page-v2 virtual-lab-sim-page vl-interactive-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)' }}>
            <Microscope size={28} />
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
            <div className="vl-card-title">Microscope</div>
            <div className="vl-card-subtitle">Tap organelles to label them. Switch cell type and zoom in/out.</div>

            <div className="vl-row">
              <div className="vl-tab-row" role="tablist" aria-label="Cell type">
                {(['plant', 'animal'] as CellType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`vl-tab ${cellType === t ? 'active' : ''}`}
                    onClick={() => setCellType(t)}
                  >
                    {t === 'plant' ? 'Plant cell' : 'Animal cell'}
                  </button>
                ))}
              </div>
            </div>

            <div className="vl-row">
              <div className="vl-tab-row" role="tablist" aria-label="Magnification">
                {([100, 400, 1000] as Magnification[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`vl-tab ${magnification === m ? 'active' : ''}`}
                    onClick={() => setMagnification(m)}
                  >
                    {m}x
                  </button>
                ))}
              </div>
            </div>

            <div className="vl-canvas-wrap">
              <svg
                className="vl-sim-svg"
                viewBox="0 0 320 320"
                style={{ transform: `scale(${scale})` }}
                role="img"
                aria-label="Cell diagram"
              >
                {cellType === 'plant' ? (
                  <>
                    <rect
                      x="18"
                      y="18"
                      width="284"
                      height="284"
                      rx="18"
                      fill="#8BC34A"
                      stroke={isLabeled('cell-wall') ? '#00E676' : '#558B2F'}
                      strokeWidth={isLabeled('cell-wall') ? 5 : 4}
                      onClick={() => mark('cell-wall')}
                      className="vl-clickable"
                    />
                    <rect
                      x="28"
                      y="28"
                      width="264"
                      height="264"
                      rx="14"
                      fill="#FFEB3B"
                      stroke={isLabeled('cell-membrane') ? '#00E676' : '#FBC02D'}
                      strokeWidth={isLabeled('cell-membrane') ? 4 : 2}
                      onClick={() => mark('cell-membrane')}
                      className="vl-clickable"
                    />
                    <rect
                      x="34"
                      y="34"
                      width="252"
                      height="252"
                      rx="12"
                      fill="#E1BEE7"
                      opacity="0.55"
                      stroke={isLabeled('cytoplasm') ? '#00E676' : 'transparent'}
                      strokeWidth={isLabeled('cytoplasm') ? 3 : 0}
                      onClick={() => mark('cytoplasm')}
                      className="vl-clickable"
                    />
                    <ellipse
                      cx="170"
                      cy="185"
                      rx="90"
                      ry="68"
                      fill="#03A9F4"
                      opacity="0.45"
                      stroke={isLabeled('vacuole') ? '#00E676' : 'transparent'}
                      strokeWidth={isLabeled('vacuole') ? 3 : 0}
                      onClick={() => mark('vacuole')}
                      className="vl-clickable"
                    />
                    <circle
                      cx="120"
                      cy="110"
                      r="44"
                      fill="#9C27B0"
                      stroke={isLabeled('nucleus') ? '#00E676' : '#7B1FA2'}
                      strokeWidth={isLabeled('nucleus') ? 4 : 2}
                      onClick={() => mark('nucleus')}
                      className="vl-clickable"
                    />
                    <circle cx="120" cy="110" r="16" fill="#7B1FA2" opacity="0.95" />

                    {[
                      { x: 235, y: 110 },
                      { x: 220, y: 225 },
                      { x: 90, y: 230 },
                      { x: 245, y: 165 },
                    ].map((pos, i) => (
                      <ellipse
                        key={`chl-${i}`}
                        cx={pos.x}
                        cy={pos.y}
                        rx="18"
                        ry="10"
                        fill="#4CAF50"
                        stroke={isLabeled('chloroplast') ? '#00E676' : '#388E3C'}
                        strokeWidth={isLabeled('chloroplast') ? 3 : 1}
                        onClick={() => mark('chloroplast')}
                        className="vl-clickable"
                      />
                    ))}

                    {[
                      { x: 90, y: 70 },
                      { x: 255, y: 150 },
                    ].map((pos, i) => (
                      <ellipse
                        key={`mito-${i}`}
                        cx={pos.x}
                        cy={pos.y}
                        rx="16"
                        ry="9"
                        fill="#FF5722"
                        stroke={isLabeled('mitochondria') ? '#00E676' : '#E64A19'}
                        strokeWidth={isLabeled('mitochondria') ? 3 : 1}
                        onClick={() => mark('mitochondria')}
                        className="vl-clickable"
                      />
                    ))}

                    {ribosomes.map((p, i) => (
                      <circle
                        key={`rib-${i}`}
                        cx={60 + p.x * 200}
                        cy={60 + p.y * 200}
                        r="3"
                        fill="#795548"
                        stroke={isLabeled('ribosome') ? '#00E676' : 'transparent'}
                        strokeWidth={isLabeled('ribosome') ? 2 : 0}
                        onClick={() => mark('ribosome')}
                        className="vl-clickable"
                      />
                    ))}
                  </>
                ) : (
                  <>
                    <ellipse
                      cx="160"
                      cy="160"
                      rx="130"
                      ry="112"
                      fill="#FFEB3B"
                      stroke={isLabeled('cell-membrane') ? '#00E676' : '#FBC02D'}
                      strokeWidth={isLabeled('cell-membrane') ? 4 : 3}
                      onClick={() => mark('cell-membrane')}
                      className="vl-clickable"
                    />
                    <ellipse
                      cx="160"
                      cy="160"
                      rx="124"
                      ry="106"
                      fill="#E1BEE7"
                      opacity="0.55"
                      stroke={isLabeled('cytoplasm') ? '#00E676' : 'transparent'}
                      strokeWidth={isLabeled('cytoplasm') ? 3 : 0}
                      onClick={() => mark('cytoplasm')}
                      className="vl-clickable"
                    />
                    <circle
                      cx="135"
                      cy="145"
                      r="52"
                      fill="#9C27B0"
                      stroke={isLabeled('nucleus') ? '#00E676' : '#7B1FA2'}
                      strokeWidth={isLabeled('nucleus') ? 4 : 2}
                      onClick={() => mark('nucleus')}
                      className="vl-clickable"
                    />
                    <circle cx="135" cy="145" r="18" fill="#7B1FA2" opacity="0.95" />

                    {[
                      { x: 225, y: 125 },
                      { x: 205, y: 210 },
                      { x: 95, y: 215 },
                      { x: 240, y: 170 },
                    ].map((pos, i) => (
                      <ellipse
                        key={`mito-${i}`}
                        cx={pos.x}
                        cy={pos.y}
                        rx="18"
                        ry="10"
                        fill="#FF5722"
                        stroke={isLabeled('mitochondria') ? '#00E676' : '#E64A19'}
                        strokeWidth={isLabeled('mitochondria') ? 3 : 1}
                        onClick={() => mark('mitochondria')}
                        className="vl-clickable"
                      />
                    ))}

                    {[
                      { x: 85, y: 110 },
                      { x: 240, y: 255 },
                    ].map((pos, i) => (
                      <ellipse
                        key={`sv-${i}`}
                        cx={pos.x}
                        cy={pos.y}
                        rx="16"
                        ry="12"
                        fill="#03A9F4"
                        opacity="0.45"
                        stroke={isLabeled('small-vacuole') ? '#00E676' : 'transparent'}
                        strokeWidth={isLabeled('small-vacuole') ? 3 : 0}
                        onClick={() => mark('small-vacuole')}
                        className="vl-clickable"
                      />
                    ))}

                    {ribosomes.map((p, i) => (
                      <circle
                        key={`rib-${i}`}
                        cx={70 + p.x * 190}
                        cy={70 + p.y * 190}
                        r="3"
                        fill="#795548"
                        stroke={isLabeled('ribosome') ? '#00E676' : 'transparent'}
                        strokeWidth={isLabeled('ribosome') ? 2 : 0}
                        onClick={() => mark('ribosome')}
                        className="vl-clickable"
                      />
                    ))}
                  </>
                )}
              </svg>
            </div>

            <div className="vl-section">
              <div className="vl-section-title-row">
                <div className="vl-card-title">Progress</div>
                <div className="vl-section-meta">{progress}%</div>
              </div>
              <div className="vl-progress-bar">
                <div className="vl-progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <button type="button" className="vl-btn primary" disabled={!canTakeQuiz} onClick={() => setQuizOpen(true)}>
                <Sparkles size={16} /> {canTakeQuiz ? 'Start knowledge check' : 'Label all organelles to unlock'}
              </button>
            </div>
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Organelles</div>
            <div className="vl-card-subtitle">Click an item or tap it in the diagram.</div>
            <div className="vl-template-list">
              {organelles.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className={`vl-template-btn ${selectedOrganelle?.id === o.id ? 'active' : ''}`}
                  onClick={() => mark(o.id)}
                >
                  <div className="vl-template-title">
                    <span className="vl-dot" style={{ background: o.color }} aria-hidden="true" />
                    {o.name}
                    {isLabeled(o.id) && <span className="vl-pill-mini">labeled</span>}
                  </div>
                  <div className="vl-template-desc">{o.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Selected</div>
            {selectedOrganelle ? (
              <>
                <div className="vl-card-subtitle">
                  <strong>{selectedOrganelle.name}</strong>
                </div>
                <div className="vl-explanation">{selectedOrganelle.description}</div>
              </>
            ) : (
              <div className="vl-card-subtitle">Select an organelle to view details.</div>
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

