export function trackScanSolveEvent(event: string, payload: Record<string, unknown> = {}) {
  console.log(`[scan-solve:${event}]`, payload);
}
