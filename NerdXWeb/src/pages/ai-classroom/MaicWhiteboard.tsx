import type { MaicBoardElement, MaicBoardSpec } from '../../types/maicBoard';

type Props = {
  spec: MaicBoardSpec;
  focused?: boolean;
  focusHint?: string | null;
};

const DEFAULT_W = 420;
const DEFAULT_H = 260;

function renderEl(el: MaicBoardElement, i: number) {
  const sw = el.strokeWidth ?? 2;
  switch (el.kind) {
    case 'line':
      return (
        <line
          key={i}
          x1={el.x1}
          y1={el.y1}
          x2={el.x2}
          y2={el.y2}
          stroke={el.stroke || '#94a3b8'}
          strokeWidth={sw}
          strokeLinecap="round"
        />
      );
    case 'rect':
      return (
        <rect
          key={i}
          x={el.x}
          y={el.y}
          width={el.w}
          height={el.h}
          fill={el.fill || 'none'}
          stroke={el.stroke || '#34d399'}
          strokeWidth={sw}
          rx={4}
        />
      );
    case 'ellipse':
      return (
        <ellipse
          key={i}
          cx={el.cx}
          cy={el.cy}
          rx={el.rx}
          ry={el.ry}
          fill={el.fill || 'none'}
          stroke={el.stroke || '#fbbf24'}
          strokeWidth={sw}
        />
      );
    case 'text':
      return (
        <text
          key={i}
          x={el.x}
          y={el.y}
          fill={el.fill || '#e2e8f0'}
          fontSize={el.size ?? 14}
          fontFamily="system-ui, Segoe UI, sans-serif"
        >
          {el.text}
        </text>
      );
    case 'polyline': {
      const pts = Array.isArray(el.points) ? el.points : [];
      if (pts.length < 4) return null;
      let d = '';
      for (let j = 0; j < pts.length - 1; j += 2) {
        const x = pts[j]!;
        const y = pts[j + 1]!;
        d += j === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
      }
      return (
        <path
          key={i}
          d={d}
          fill={el.fill && el.fill !== 'none' ? el.fill : 'none'}
          stroke={el.stroke || '#a78bfa'}
          strokeWidth={el.strokeWidth ?? 2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    }
    default:
      return null;
  }
}

export function MaicWhiteboard({ spec, focused = false, focusHint = null }: Props) {
  const w = Math.max(120, Number(spec.width) || DEFAULT_W);
  const h = Math.max(80, Number(spec.height) || DEFAULT_H);
  const elements = Array.isArray(spec.elements) ? spec.elements : [];

  return (
    <div className={`maic-whiteboard-wrap${focused ? ' is-focused' : ''}`}>
      <div className="maic-whiteboard-label">Board</div>
      {focusHint ? <div className="maic-whiteboard-focus">Focus: {focusHint}</div> : null}
      <svg
        className="maic-whiteboard-svg"
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Teacher whiteboard diagram"
      >
        <rect x={0} y={0} width={w} height={h} fill="rgba(15,23,42,0.92)" rx={10} />
        <rect
          x={1}
          y={1}
          width={w - 2}
          height={h - 2}
          fill="none"
          stroke="rgba(148,163,184,0.35)"
          strokeWidth={1}
          rx={9}
        />
        {elements.map((el, i) => renderEl(el, i))}
      </svg>
    </div>
  );
}
