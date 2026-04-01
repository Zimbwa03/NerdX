import { useEffect, useState } from 'react';

/** Eases displayed percent from 0 to target for progress visuals (no width inline styles — use as SVG width or similar). */
export function useAnimatedPercent(target: number, durationMs = 800, enabled = true) {
  const [v, setV] = useState(0);

  useEffect(() => {
    const t = Math.min(100, Math.max(0, target));
    if (!enabled) {
      setV(t);
      return;
    }
    setV(0);
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const u = Math.min(1, elapsed / durationMs);
      const eased = 1 - (1 - u) ** 3;
      setV(Math.round(eased * t));
      if (u < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs, enabled]);

  return v;
}
