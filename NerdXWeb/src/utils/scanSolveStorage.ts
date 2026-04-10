import type { ScanSolveResult } from '../types/scanSolve';

const HISTORY_KEY = 'scan_solve_history_v1';
const MAX_ITEMS = 20;

export function loadScanSolveHistory(): ScanSolveResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ScanSolveResult[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveScanSolveHistory(items: ScanSolveResult[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
  } catch {
    // ignore storage errors
  }
}

export function upsertScanSolveHistory(items: ScanSolveResult[], next: ScanSolveResult): ScanSolveResult[] {
  const merged = [next, ...items.filter((item) => item.id !== next.id)];
  const sliced = merged.slice(0, MAX_ITEMS);
  saveScanSolveHistory(sliced);
  return sliced;
}
