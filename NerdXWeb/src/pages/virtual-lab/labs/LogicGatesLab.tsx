import { useState, useRef, useEffect, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Play, RotateCcw, Zap, Info } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR';
type ElementType = 'GATE' | 'INPUT' | 'OUTPUT';

interface CircuitElement {
    id: string;
    type: ElementType;
    gateType?: GateType;
    x: number;
    y: number;
    inputs: boolean[];
    output: boolean;
    label?: string;
}

interface Connection {
    id: string;
    fromId: string;
    toId: string;
    toInputIndex: number;
}

const GATE_DEFINITIONS: Record<GateType, { inputs: number, color: string, symbol: string }> = {
    AND: { inputs: 2, color: '#2962FF', symbol: '&' },
    OR: { inputs: 2, color: '#00C853', symbol: '≥1' },
    NOT: { inputs: 1, color: '#D500F9', symbol: '1' },
    NAND: { inputs: 2, color: '#FF3D00', symbol: '&' },
    NOR: { inputs: 2, color: '#FFAB00', symbol: '≥1' },
    XOR: { inputs: 2, color: '#00E5FF', symbol: '=1' },
};

export function LogicGatesLab({ simulation }: { simulation: SimulationMetadata }) {
    const [elements, setElements] = useState<CircuitElement[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [wiringStart, setWiringStart] = useState<string | null>(null);
    const [quizOpen, setQuizOpen] = useState(false);
    const canvasRef = useRef<HTMLDivElement>(null);

    // Simulation logic
    useEffect(() => {
        const simulate = () => {
            let changed = true;
            let iterations = 0;
            const MAX_ITERATIONS = 50; // Prevent infinite loops

            const newElements = [...elements];

            while (changed && iterations < MAX_ITERATIONS) {
                changed = false;
                iterations++;

                newElements.forEach(el => {
                    if (el.type === 'INPUT') return; // Inputs don't change by simulation

                    // Gather inputs from connections
                    const currentInputs = Array(el.type === 'GATE' ? GATE_DEFINITIONS[el.gateType!].inputs : 1).fill(false);

                    connections.forEach(conn => {
                        if (conn.toId === el.id) {
                            const source = newElements.find(e => e.id === conn.fromId);
                            if (source) {
                                currentInputs[conn.toInputIndex] = source.output;
                            }
                        }
                    });

                    // Calculate output
                    let newOutput = false;
                    if (el.type === 'OUTPUT') {
                        newOutput = currentInputs[0];
                    } else if (el.type === 'GATE') {
                        const [a, b] = currentInputs;
                        switch (el.gateType) {
                            case 'AND': newOutput = a && b; break;
                            case 'OR': newOutput = a || b; break;
                            case 'NOT': newOutput = !a; break;
                            case 'NAND': newOutput = !(a && b); break;
                            case 'NOR': newOutput = !(a || b); break;
                            case 'XOR': newOutput = !!(a ? !b : b); break;
                        }
                    }

                    if (el.output !== newOutput) {
                        el.output = newOutput;
                        changed = true;
                    }
                });
            }

            if (iterations > 0) {
                // Force update only if needed, but react state update will handle re-render
                // We need to update state if values changed
                // Optimization: comparing deep equality or just setting state
            }
        };

        // Run simulation loop periodically or on change
        const interval = setInterval(() => {
            setElements(prev => {
                let changed = false;
                const next = prev.map(el => ({ ...el }));

                // Simple 1-pass simulation for this tick (React effect structure ideal for this is complex, simplifying)
                // Better approach: calculate signal propagation

                next.forEach(el => {
                    if (el.type === 'INPUT') return;

                    const inputs = Array(el.type === 'GATE' ? GATE_DEFINITIONS[el.gateType!].inputs : 1).fill(false);
                    connections.forEach(conn => {
                        if (conn.toId === el.id) {
                            const source = prev.find(e => e.id === conn.fromId); // Read from prev state for stability
                            if (source) inputs[conn.toInputIndex] = source.output;
                        }
                    });

                    let out = false;
                    if (el.type === 'OUTPUT') {
                        out = inputs[0];
                    } else if (el.type === 'GATE') {
                        const [a, b] = inputs;
                        switch (el.gateType) {
                            case 'AND': out = a && b; break;
                            case 'OR': out = a || b; break;
                            case 'NOT': out = !a; break;
                            case 'NAND': out = !(a && b); break;
                            case 'NOR': out = !(a || b); break;
                            case 'XOR': out = !!(a ? !b : b); break;
                        }
                    }

                    if (el.output !== out) {
                        el.output = out;
                        changed = true;
                    }
                });

                return changed ? next : prev;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [connections, elements.length]); // Dependency on topology changes

    const addElement = (type: ElementType, gateType?: GateType) => {
        const id = Math.random().toString(36).substr(2, 9);
        setElements(prev => [...prev, {
            id,
            type,
            gateType,
            x: 100 + Math.random() * 50,
            y: 100 + Math.random() * 50,
            inputs: [],
            output: false,
            label: type === 'INPUT' ? 'IN' : type === 'OUTPUT' ? 'OUT' : gateType
        }]);
    };

    const deleteSelected = () => {
        if (!selectedId) return;
        setElements(prev => prev.filter(e => e.id !== selectedId));
        setConnections(prev => prev.filter(c => c.fromId !== selectedId && c.toId !== selectedId));
        setSelectedId(null);
    };

    const handleMouseDown = (e: MouseEvent, id: string) => {
        if (wiringStart) return; // Don't drag while wiring
        e.stopPropagation();
        const el = elements.find(e => e.id === id);
        if (!el) return;

        // Check if clicked on input/output node (simple hit detection logic handled in render)
        // For simplicity, we'll assume drag unless specific handle clicked

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
        setDraggingId(id);
        setSelectedId(id);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (draggingId && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left - dragOffset.x;
            const y = e.clientY - rect.top - dragOffset.y;

            setElements(prev => prev.map(el =>
                el.id === draggingId ? { ...el, x, y } : el
            ));
        }
    };

    const handleMouseUp = () => {
        setDraggingId(null);
    };

    const toggleInput = (id: string) => {
        setElements(prev => prev.map(el =>
            el.id === id && el.type === 'INPUT' ? { ...el, output: !el.output } : el
        ));
    };

    const startWiring = (id: string, e: MouseEvent) => {
        e.stopPropagation();
        setWiringStart(id);
    };

    const endWiring = (toId: string, inputIndex: number, e: MouseEvent) => {
        e.stopPropagation();
        if (wiringStart && wiringStart !== toId) {
            // Check for existing connection to this input
            const exists = connections.some(c => c.toId === toId && c.toInputIndex === inputIndex);
            if (!exists) {
                setConnections(prev => [...prev, {
                    id: Math.random().toString(36).substr(2, 9),
                    fromId: wiringStart,
                    toId,
                    toInputIndex: inputIndex
                }]);
            }
        }
        setWiringStart(null);
    };

    const clearCanvas = () => {
        if (window.confirm('Clear all Logic Gates?')) {
            setElements([]);
            setConnections([]);
        }
    };

    return (
        <div className="subject-page-v2 virtual-lab-sim-page" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <header className="subject-header-v2">
                <Link to="/app/virtual-lab" className="back-btn-v2">
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </Link>
                <div className="subject-header-content">
                    <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #00B0FF, #2979FF)' }}>
                        <Zap size={28} />
                    </div>
                    <div>
                        <h1>{simulation.title}</h1>
                        <p>{simulation.topic}</p>
                    </div>
                </div>
            </header>

            <div className="vl-editor-grid wide">
                <div className="vl-col" style={{ flex: '0 0 250px' }}>
                    <div className="vl-card">
                        <div className="vl-card-title">Components</div>
                        <div className="vl-card-subtitle">Drag or click to add</div>

                        <div className="vl-component-list">
                            <button className="vl-tool-btn" onClick={() => addElement('INPUT')}>
                                <div className="gate-icon input-icon">0/1</div> Input Switch
                            </button>
                            <button className="vl-tool-btn" onClick={() => addElement('OUTPUT')}>
                                <div className="gate-icon output-icon">💡</div> Output Lamp
                            </button>

                            <div className="vl-separator" />

                            {(Object.keys(GATE_DEFINITIONS) as GateType[]).map(type => (
                                <button key={type} className="vl-tool-btn" onClick={() => addElement('GATE', type)}>
                                    <div className="gate-icon" style={{ borderColor: GATE_DEFINITIONS[type].color }}>
                                        {GATE_DEFINITIONS[type].symbol}
                                    </div>
                                    {type} Gate
                                </button>
                            ))}
                        </div>

                        <div className="vl-row" style={{ marginTop: 20 }}>
                            <button className="vl-btn secondary" onClick={clearCanvas}>
                                <Trash2 size={16} /> Clear
                            </button>
                            <button className="vl-btn primary" onClick={() => setQuizOpen(true)}>
                                <Info size={16} /> Quiz
                            </button>
                        </div>
                    </div>

                    <div className="vl-card">
                        <div className="vl-card-title">Instructions</div>
                        <ul className="vl-bullets small">
                            <li><strong>Add:</strong> Click buttons above</li>
                            <li><strong>Move:</strong> Drag components</li>
                            <li><strong>Wire:</strong> Click right dot (output) then left dot (input)</li>
                            <li><strong>Toggle:</strong> Click inputs to flip 0/1</li>
                            <li><strong>Delete:</strong> Select & press Del</li>
                        </ul>
                    </div>
                </div>

                <div className="vl-col" style={{ position: 'relative' }}>
                    <div
                        className="vl-canvas"
                        ref={canvasRef}
                        style={{
                            height: '100%',
                            minHeight: 500,
                            background: '#13151D',
                            borderRadius: 16,
                            position: 'relative',
                            overflow: 'hidden',
                            cursor: wiringStart ? 'crosshair' : 'default'
                        }}
                        onClick={() => { setSelectedId(null); setWiringStart(null); }}
                    >
                        {/* Grid Dots */}
                        <div className="vl-grid-dots" />

                        {/* Connections */}
                        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                            {wiringStart && elements.find(e => e.id === wiringStart) && (
                                // Draw line to mouse cursor (simplified)
                                <line x1={0} y1={0} x2={0} y2={0} stroke="rgba(255,255,255,0.2)" />
                            )}
                            {connections.map(conn => {
                                const from = elements.find(e => e.id === conn.fromId);
                                const to = elements.find(e => e.id === conn.toId);
                                if (!from || !to) return null;

                                // Simple Bezier
                                const startX = from.x + 60; // Approx width
                                const startY = from.y + 20;
                                const inputCount = to.type === 'GATE' ? GATE_DEFINITIONS[to.gateType!].inputs : 1;
                                const yOffset = (40 / (inputCount + 1)) * (conn.toInputIndex + 1);
                                const endX = to.x;
                                const endY = to.y + yOffset;

                                const midX = (startX + endX) / 2;

                                return (
                                    <path
                                        key={conn.id}
                                        d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                                        stroke={from.output ? "#00E676" : "#455A64"}
                                        strokeWidth="3"
                                        fill="none"
                                    />
                                );
                            })}
                        </svg>

                        {/* Elements */}
                        {elements.map(el => {
                            const isSelected = selectedId === el.id;
                            const gateDef = el.type === 'GATE' ? GATE_DEFINITIONS[el.gateType!] : null;
                            const numInputs = gateDef ? gateDef.inputs : (el.type === 'OUTPUT' ? 1 : 0);

                            return (
                                <div
                                    key={el.id}
                                    className={`vl-circuit-el ${el.type} ${isSelected ? 'selected' : ''}`}
                                    style={{
                                        transform: `translate(${el.x}px, ${el.y}px)`,
                                        borderColor: gateDef?.color || (el.output ? '#00E676' : '#555')
                                    }}
                                    onMouseDown={(e) => handleMouseDown(e, el.id)}
                                >
                                    {/* Inputs */}
                                    <div className="vl-ports-in">
                                        {Array.from({ length: numInputs }).map((_, idx) => (
                                            <div
                                                key={idx}
                                                className="vl-port input"
                                                onClick={(e) => endWiring(el.id, idx, e)}
                                                title="Input"
                                            />
                                        ))}
                                    </div>

                                    {/* Body */}
                                    <div className="vl-el-body" onClick={(e) => { if (el.type === 'INPUT') toggleInput(el.id); }}>
                                        {el.type === 'INPUT' ? (
                                            <span style={{ color: el.output ? '#00E676' : '#666', fontWeight: 'bold' }}>{el.output ? '1' : '0'}</span>
                                        ) : el.type === 'OUTPUT' ? (
                                            <div className={`bulb ${el.output ? 'on' : 'off'}`} />
                                        ) : (
                                            <span>{gateDef?.symbol}</span>
                                        )}
                                    </div>

                                    {/* Output */}
                                    {el.type !== 'OUTPUT' && (
                                        <div className="vl-ports-out">
                                            <div
                                                className="vl-port output"
                                                onClick={(e) => startWiring(el.id, e)}
                                                title="Output"
                                            />
                                        </div>
                                    )}

                                    {isSelected && (
                                        <button className="vl-delete-btn" onClick={deleteSelected}>×</button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <KnowledgeCheckModal open={quizOpen} simulation={simulation} onClose={() => setQuizOpen(false)} />

            <style>{`
        .vl-component-list { display: flex; flex-direction: column; gap: 8px; }
        .vl-tool-btn { 
            display: flex; align-items: center; gap: 12px; 
            background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
            padding: 10px; border-radius: 8px; color: #fff; cursor: pointer;
            transition: all 0.2s;
        }
        .vl-tool-btn:hover { background: rgba(255,255,255,0.1); transform: translateX(2px); }
        .gate-icon {
            width: 32px; height: 32px; border: 2px solid #666; border-radius: 4px;
            display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px;
        }
        .input-icon { border-color: #00E676; color: #00E676; }
        .output-icon { border-color: #FFEA00; }
        
        .vl-grid-dots {
            position: absolute; width: 100%; height: 100%;
            background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 20px 20px; opacity: 0.5; pointer-events: none;
        }
        
        .vl-circuit-el {
            position: absolute; width: 60px; height: 40px;
            background: #1E2330; border: 2px solid #555; borderRadius: 8px;
            display: flex; align-items: center; justify-content: space-between;
            color: #fff; user-select: none;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        .vl-circuit-el.selected { border-color: #fff !important; z-index: 10; transform: scale(1.05); }
        .vl-circuit-el.INPUT { width: 40px; height: 40px; border-radius: 50%; border-color: #00B0FF; }
        .vl-circuit-el.OUTPUT { width: 40px; height: 40px; border-radius: 50%; border-color: #FFAB00; }
        
        .vl-el-body { flex: 1; display: flex; align-items: center; justify-content: center; height: 100%; font-weight: bold; }
        
        .vl-ports-in, .vl-ports-out { display: flex; flex-direction: column; justify-content: space-around; height: 100%; }
        .vl-port {
            width: 10px; height: 10px; background: #666; border-radius: 50%; margin: 2px;
            cursor: pointer; transition: background 0.2s;
        }
        .vl-port:hover { background: #fff; }
        .vl-port.input { margin-left: -5px; }
        .vl-port.output { margin-right: -5px; }
        
        .bulb { width: 20px; height: 20px; border-radius: 50%; background: #333; border: 2px solid #555; }
        .bulb.on { background: #FFEA00; box-shadow: 0 0 15px #FFEA00; border-color: #FFEA00; }
        
        .vl-delete-btn {
            position: absolute; top: -8px; right: -8px;
            width: 18px; height: 18px; border-radius: 50%; background: #FF3D00; color: #fff;
            border: none; display: flex; align-items: center; justify-content: center;
            font-size: 12px; cursor: pointer;
        }
      `}</style>
        </div>
    );
}
