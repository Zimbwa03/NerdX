export type Point = { x: number; y: number };

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function sampleFunction(fn: (x: number) => number, xMin: number, xMax: number, steps = 220): Point[] {
  const safeSteps = Math.max(20, Math.min(1000, Math.floor(steps)));
  const pts: Point[] = [];
  for (let i = 0; i <= safeSteps; i += 1) {
    const t = i / safeSteps;
    const x = lerp(xMin, xMax, t);
    const y = fn(x);
    if (Number.isFinite(y)) pts.push({ x, y });
  }
  return pts;
}

export function roundTo(n: number, dp = 2): number {
  const f = Math.pow(10, dp);
  return Math.round(n * f) / f;
}

