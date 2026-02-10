import type { CSSProperties, ReactNode } from 'react';
import type { Point } from './graphing';

export interface GraphBounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export interface GraphCurve {
  id: string;
  color: string;
  points: Point[];
  width?: number;
  dashed?: boolean;
}

export interface GraphLine {
  id: string;
  p1: Point;
  p2: Point;
  color: string;
  width?: number;
  dashed?: boolean;
}

export interface GraphMarker {
  id: string;
  p: Point;
  color: string;
  r?: number;
  label?: string;
}

const VIEW_W = 560;
const VIEW_H = 260;
const PAD = { l: 52, r: 18, t: 18, b: 42 };

function niceStep(range: number): number {
  const abs = Math.abs(range);
  if (abs <= 6) return 1;
  if (abs <= 12) return 2;
  if (abs <= 25) return 5;
  if (abs <= 60) return 10;
  return 20;
}

function buildPath(points: Array<{ x: number; y: number }>): string {
  if (!points.length) return '';
  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 1; i < points.length; i += 1) {
    d += ` L ${points[i].x.toFixed(2)} ${points[i].y.toFixed(2)}`;
  }
  return d;
}

export function GraphSvg({
  bounds,
  curves = [],
  lines = [],
  markers = [],
  renderOverlay,
  style,
  showGrid = true,
}: {
  bounds: GraphBounds;
  curves?: GraphCurve[];
  lines?: GraphLine[];
  markers?: GraphMarker[];
  renderOverlay?: (ctx: { mapX: (x: number) => number; mapY: (y: number) => number; plot: { x: number; y: number; w: number; h: number } }) => ReactNode;
  style?: CSSProperties;
  showGrid?: boolean;
}) {
  const plotW = VIEW_W - PAD.l - PAD.r;
  const plotH = VIEW_H - PAD.t - PAD.b;
  const xRange = bounds.xMax - bounds.xMin;
  const yRange = bounds.yMax - bounds.yMin;

  const mapX = (x: number) => PAD.l + ((x - bounds.xMin) / xRange) * plotW;
  const mapY = (y: number) => PAD.t + (1 - (y - bounds.yMin) / yRange) * plotH;

  const xStep = niceStep(xRange);
  const yStep = niceStep(yRange);

  const xGrid: number[] = [];
  for (let x = Math.ceil(bounds.xMin / xStep) * xStep; x <= bounds.xMax + 1e-9; x += xStep) xGrid.push(x);

  const yGrid: number[] = [];
  for (let y = Math.ceil(bounds.yMin / yStep) * yStep; y <= bounds.yMax + 1e-9; y += yStep) yGrid.push(y);

  const axisX = bounds.yMin <= 0 && bounds.yMax >= 0 ? mapY(0) : null;
  const axisY = bounds.xMin <= 0 && bounds.xMax >= 0 ? mapX(0) : null;

  return (
    <svg className="vl-sim-svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} role="img" aria-label="Graph" style={style}>
      <rect
        x={PAD.l}
        y={PAD.t}
        width={plotW}
        height={plotH}
        rx={16}
        fill="rgba(255,255,255,0.04)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth={2}
      />

      {showGrid
        ? xGrid.map((x) => {
            const sx = mapX(x);
            return <line key={`x-${x}`} x1={sx} y1={PAD.t} x2={sx} y2={PAD.t + plotH} stroke="rgba(255,255,255,0.06)" />;
          })
        : null}
      {showGrid
        ? yGrid.map((y) => {
            const sy = mapY(y);
            return <line key={`y-${y}`} x1={PAD.l} y1={sy} x2={PAD.l + plotW} y2={sy} stroke="rgba(255,255,255,0.06)" />;
          })
        : null}

      {axisX !== null ? (
        <line x1={PAD.l} y1={axisX} x2={PAD.l + plotW} y2={axisX} stroke="rgba(255,255,255,0.18)" strokeWidth={2} />
      ) : null}
      {axisY !== null ? (
        <line x1={axisY} y1={PAD.t} x2={axisY} y2={PAD.t + plotH} stroke="rgba(255,255,255,0.18)" strokeWidth={2} />
      ) : null}

      {curves.map((c) => {
        const pts = c.points
          .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y))
          .map((p) => ({ x: mapX(p.x), y: mapY(p.y) }));
        const d = buildPath(pts);
        if (!d) return null;
        return (
          <path
            key={c.id}
            d={d}
            fill="none"
            stroke={c.color}
            strokeWidth={c.width ?? 3}
            strokeDasharray={c.dashed ? '8 8' : undefined}
          />
        );
      })}

      {renderOverlay
        ? renderOverlay({
            mapX,
            mapY,
            plot: { x: PAD.l, y: PAD.t, w: plotW, h: plotH },
          })
        : null}

      {lines.map((l) => (
        <line
          key={l.id}
          x1={mapX(l.p1.x)}
          y1={mapY(l.p1.y)}
          x2={mapX(l.p2.x)}
          y2={mapY(l.p2.y)}
          stroke={l.color}
          strokeWidth={l.width ?? 3}
          strokeDasharray={l.dashed ? '8 8' : undefined}
        />
      ))}

      {markers.map((m) => {
        const sx = mapX(m.p.x);
        const sy = mapY(m.p.y);
        return (
          <g key={m.id}>
            <circle cx={sx} cy={sy} r={m.r ?? 5} fill={m.color} />
            {m.label ? (
              <text x={sx + 8} y={sy - 8} fontSize={12} fill="rgba(255,255,255,0.78)" fontWeight={900}>
                {m.label}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
