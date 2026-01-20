import { supabase } from './supabase';

type MediaUrlInfo = {
  bucket: string;
  path: string;
  token?: string;
  tokenExp?: number;
};

type SignedUrlCacheEntry = {
  url: string;
  expiresAt: number;
};

const cache = new Map<string, SignedUrlCacheEntry>();
const DEFAULT_EXPIRES_IN = 60 * 60 * 24; // 24 hours
const MIN_TTL_SECONDS = 60 * 5; // 5 minutes

const parseMediaUrl = (url: string): MediaUrlInfo | null => {
  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    // Expected: /storage/v1/object/sign/{bucket}/{path...}
    const signIndex = pathParts.findIndex((part) => part === 'sign');
    if (signIndex === -1 || pathParts.length < signIndex + 3) return null;
    const bucket = pathParts[signIndex + 1];
    const path = pathParts.slice(signIndex + 2).join('/');
    const token = parsed.searchParams.get('token') ?? undefined;
    const tokenExp = token ? decodeJwtExp(token) : undefined;
    return { bucket, path, token, tokenExp };
  } catch {
    return null;
  }
};

const decodeJwtExp = (token: string): number | undefined => {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return undefined;
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);
    const decoded = JSON.parse(atob(padded));
    const exp = decoded?.exp;
    return typeof exp === 'number' ? exp : undefined;
  } catch {
    return undefined;
  }
};

const isExpired = (exp?: number, minTtlSeconds: number = MIN_TTL_SECONDS): boolean => {
  if (!exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return exp - now <= minTtlSeconds;
};

export const checkUrlAccessible = async (url: string): Promise<boolean> => {
  try {
    const head = await fetch(url, { method: 'HEAD' });
    if (head.ok) return true;
  } catch {
    // ignore
  }
  try {
    const get = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-0' } });
    return get.ok;
  } catch {
    return false;
  }
};

export const refreshMediaUrl = async (
  url: string,
  expiresIn: number = DEFAULT_EXPIRES_IN
): Promise<string> => {
  const info = parseMediaUrl(url);
  if (!info) return url;

  const { data, error } = await supabase.storage
    .from(info.bucket)
    .createSignedUrl(info.path, expiresIn);

  if (error || !data?.signedUrl) {
    return url;
  }

  const now = Math.floor(Date.now() / 1000);
  const expAt = now + expiresIn;
  cache.set(`${info.bucket}/${info.path}`, { url: data.signedUrl, expiresAt: expAt });
  return data.signedUrl;
};

export const ensureFreshMediaUrl = async (
  url: string,
  options?: { expiresIn?: number; minTtlSeconds?: number }
): Promise<string> => {
  const expiresIn = options?.expiresIn ?? DEFAULT_EXPIRES_IN;
  const minTtlSeconds = options?.minTtlSeconds ?? MIN_TTL_SECONDS;

  const info = parseMediaUrl(url);
  if (!info) return url;

  const cacheKey = `${info.bucket}/${info.path}`;
  const cached = cache.get(cacheKey);
  const now = Math.floor(Date.now() / 1000);
  if (cached && cached.expiresAt - now > minTtlSeconds) {
    return cached.url;
  }

  if (info.tokenExp && !isExpired(info.tokenExp, minTtlSeconds)) {
    return url;
  }

  return refreshMediaUrl(url, expiresIn);
};
