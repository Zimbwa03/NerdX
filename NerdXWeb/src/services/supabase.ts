// Supabase client for NerdX Web App - same project as mobile
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://lzteiewcvxoazqfxfjgg.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Make Supabase optional - app can work without it
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('⚠️ Missing Supabase configuration. Features requiring Supabase will be disabled.');
  console.warn('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file to enable Supabase features.');
}

// Create a stub client if config is missing to prevent crashes
const stubClient: any = {
  auth: {
    getSession: async () => ({ data: null, error: new Error('Supabase not configured') }),
    signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
    signOut: async () => ({ error: new Error('Supabase not configured') }),
  }
};

export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
      storage: window.localStorage,
    },
  })
  : stubClient;

export async function signInToSupabaseAuth(email: string, password: string): Promise<boolean> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData?.session?.user?.email === email) {
      return true;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.warn('[Supabase Auth] Sign-in failed (non-blocking):', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase Auth] Sign-in error (non-blocking)', err);
    return false;
  }
}

export async function signOutFromSupabaseAuth(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn('[Supabase Auth] Sign-out error', err);
  }
}
