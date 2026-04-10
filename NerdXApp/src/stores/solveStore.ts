import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { scanSolveApi } from '../services/api/scanSolveApi';
import type { ScanSolveLoadingState, ScanSolveResult } from '../types/scanSolve';

const MAX_HISTORY_ITEMS = 20;

export const LOADING_STATES: ScanSolveLoadingState[] = [
  { duration: 500, message: 'Reading problem...', icon: 'eye' },
  { duration: 800, message: 'Solving with Vertex AI...', icon: 'brain' },
  { duration: 600, message: 'Vertex AI: building visualization...', icon: 'palette' },
  { duration: 700, message: 'Preparing lesson audio...', icon: 'mic' },
  { duration: 400, message: 'Assembling your lesson...', icon: 'book' },
];

const createSolveId = () =>
  `solve-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const normalizeResult = (payload: any): ScanSolveResult => ({
  id: payload.meta?.id || createSolveId(),
  timestamp: new Date().toISOString(),
  problem: payload.problem,
  solution: payload.solution,
  media: payload.media,
  meta: payload.meta,
});

interface SolveState {
  currentProblem: string | null;
  currentImage: string | null;
  result: ScanSolveResult | null;
  isLoading: boolean;
  loadingStage: number;
  error: string | null;
  history: ScanSolveResult[];
  saved: ScanSolveResult[];
  setCurrentProblem: (text: string | null) => void;
  setCurrentImage: (imageUri: string | null) => void;
  setResult: (result: ScanSolveResult | null) => void;
  clearResult: () => void;
  clearError: () => void;
  solveFromText: (text: string, level: 'O-Level' | 'A-Level', subject?: string) => Promise<ScanSolveResult>;
  solveFromImage: (imageUri: string, level: 'O-Level' | 'A-Level', subject?: string, text?: string) => Promise<ScanSolveResult>;
  hydrateFromHistory: (result: ScanSolveResult) => void;
  saveToNotes: (result: ScanSolveResult) => void;
}

async function ensureOnline(): Promise<void> {
  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    throw new Error('Internet is required for a new Scan & Solve lesson. You can still open a previous solve from history.');
  }
}

function withHistory(history: ScanSolveResult[], result: ScanSolveResult): ScanSolveResult[] {
  const next = [result, ...history.filter((item) => item.id !== result.id)];
  return next.slice(0, MAX_HISTORY_ITEMS);
}

export const useSolveStore = create<SolveState>()(
  persist(
    (set, get) => ({
      currentProblem: null,
      currentImage: null,
      result: null,
      isLoading: false,
      loadingStage: 0,
      error: null,
      history: [],
      saved: [],

      setCurrentProblem: (text) => set({ currentProblem: text }),
      setCurrentImage: (imageUri) => set({ currentImage: imageUri }),
      setResult: (result) => set({ result }),
      clearResult: () => set({ result: null }),
      clearError: () => set({ error: null }),

      solveFromText: async (text, level, subject) => {
        await ensureOnline();
        set({
          currentProblem: text,
          currentImage: null,
          result: null,
          error: null,
          isLoading: true,
          loadingStage: 0,
        });

        const stageTimer = setInterval(() => {
          set((state) => ({
            loadingStage: Math.min(state.loadingStage + 1, LOADING_STATES.length - 1),
          }));
        }, 700);

        try {
          const payload = await scanSolveApi.solve({
            text,
            subjectHint: subject,
            level,
          });
          const result = normalizeResult(payload);
          set((state) => ({
            result,
            history: withHistory(state.history, result),
            isLoading: false,
            loadingStage: LOADING_STATES.length - 1,
          }));
          return result;
        } catch (error: any) {
          const message = error?.response?.data?.message || error?.message || 'Scan & Solve failed.';
          set({ error: message, isLoading: false });
          throw new Error(message);
        } finally {
          clearInterval(stageTimer);
        }
      },

      solveFromImage: async (imageUri, level, subject, text) => {
        await ensureOnline();
        set({
          currentProblem: text || null,
          currentImage: imageUri,
          result: null,
          error: null,
          isLoading: true,
          loadingStage: 0,
        });

        const stageTimer = setInterval(() => {
          set((state) => ({
            loadingStage: Math.min(state.loadingStage + 1, LOADING_STATES.length - 1),
          }));
        }, 700);

        try {
          const payload = await scanSolveApi.solve({
            text,
            imageUri,
            subjectHint: subject,
            level,
          });
          const result = normalizeResult(payload);
          set((state) => ({
            result,
            history: withHistory(state.history, result),
            isLoading: false,
            loadingStage: LOADING_STATES.length - 1,
          }));
          return result;
        } catch (error: any) {
          const message = error?.response?.data?.message || error?.message || 'Scan & Solve failed.';
          set({ error: message, isLoading: false });
          throw new Error(message);
        } finally {
          clearInterval(stageTimer);
        }
      },

      hydrateFromHistory: (result) =>
        set({
          result,
          currentProblem: result.problem.plain,
          currentImage: null,
          error: null,
        }),

      saveToNotes: (result) =>
        set((state) => ({
          saved: withHistory(state.saved, result),
        })),
    }),
    {
      name: 'scan-solve-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        history: state.history,
        saved: state.saved,
      }),
    }
  )
);
