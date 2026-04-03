// API configuration for NerdX Web App
import axios, { type AxiosError } from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const DEFAULT_PUBLIC_SITE = 'https://nerdx.co.zw';

/**
 * Canonical origin for shareable links (school portal, teacher login, referrals, OAuth redirects in production).
 * Set VITE_PUBLIC_SITE_URL=https://nerdx.co.zw on production builds. If unset, uses the current browser origin (local dev).
 */
export function getPublicSiteOrigin(): string {
  const fromEnv = (import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined)?.trim().replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  if (typeof window !== 'undefined') return window.location.origin;
  return DEFAULT_PUBLIC_SITE;
}

const AUTH_TOKEN_KEY = '@auth_token';

// Typed API error so callers can narrow on status codes without casting
export interface ApiError {
  status: number | undefined;
  message: string;
  data?: unknown;
}

export function isApiError(err: unknown): err is ApiError {
  return typeof err === 'object' && err !== null && 'status' in err && 'message' in err;
}

/** User-facing message for failed API calls (normalized ApiError or raw Error). */
export function getApiErrorMessage(err: unknown, fallback = 'Something went wrong.'): string {
  if (isApiError(err)) {
    const msg = (err.message || '').toLowerCase();
    if (err.status === 401) {
      return 'Please sign in again to continue.';
    }
    if (err.message === 'Network Error' || err.status === undefined) {
      return 'Cannot reach the server. Check your connection, or try again in a few minutes.';
    }
    if (msg.includes('timeout') || msg.includes('exceeded')) {
      return 'The request took too long. Try a smaller image or wait a moment and try again.';
    }
    return err.message || fallback;
  }
  if (err instanceof Error) {
    return err.message || fallback;
  }
  return fallback;
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  // 30 s default; individual calls override this when they need longer (e.g. AI generation)
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Multipart uploads need the boundary; strip default JSON Content-Type for FormData
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      const h = config.headers;
      if (h && typeof (h as { delete?: (k: string) => void }).delete === 'function') {
        (h as { delete: (k: string) => void }).delete('Content-Type');
      } else if (h && typeof h === 'object') {
        delete (h as Record<string, unknown>)['Content-Type'];
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — normalise errors into ApiError shape.
// NOTE: We intentionally do NOT clear auth tokens or trigger logout on 401.
// Individual API calls (creditsApi, etc.) handle 401 gracefully by returning null.
// This prevents auto-logout cascades when multiple concurrent requests fail.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      status: error.response?.status,
      message:
        (error.response?.data as { message?: string })?.message ??
        error.message ??
        'Unknown error',
      data: error.response?.data,
    };
    return Promise.reject(apiError);
  }
);

// Auth token management (using localStorage for web)
export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setAuthToken = (token: string): void => {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to store auth token:', error);
  }
};

export const clearAuthToken = (): void => {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to clear auth token:', error);
  }
};

export default api;
