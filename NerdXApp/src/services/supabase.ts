
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Credentials - Using same Supabase project as backend for notifications
// IMPORTANT: Always use the correct Supabase project: lzteiewcvxoazqfxfjgg
// Priority: app.json extra config > environment variable > hardcoded fallback
const CORRECT_SUPABASE_URL = 'https://lzteiewcvxoazqfxfjgg.supabase.co';
const CORRECT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6dGVpZXdjdnhvYXpxZnhmamdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NDE0MTIsImV4cCI6MjA3NzUxNzQxMn0.ZtCVuK3rx2rqpc5kJV-6iblqjUEZy52dkpUdkEbQlvI';

// Get URL from app.json extra config first (most reliable)
const SUPABASE_URL = 
    Constants.expoConfig?.extra?.supabaseUrl ||
    process.env.EXPO_PUBLIC_SUPABASE_URL ||
    CORRECT_SUPABASE_URL;

const SUPABASE_ANON_KEY = 
    Constants.expoConfig?.extra?.supabaseAnonKey ||
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
    CORRECT_SUPABASE_ANON_KEY;

// Validate that we're using the correct Supabase project
if (SUPABASE_URL !== CORRECT_SUPABASE_URL) {
    console.warn('⚠️ WARNING: Using incorrect Supabase URL:', SUPABASE_URL);
    console.warn('⚠️ Expected URL:', CORRECT_SUPABASE_URL);
    console.warn('⚠️ This may cause authentication failures!');
}

// Log the URL being used (for debugging)
console.log('🔧 Supabase Configuration:');
console.log('   URL:', SUPABASE_URL);
console.log('   Project:', SUPABASE_URL.includes('lzteiewcvxoazqfxfjgg') ? '✅ CORRECT' : '❌ WRONG PROJECT');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase configuration. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true, // Enable to detect auth tokens from deep links
    },
});

/**
 * Sign in to Supabase Auth for RLS-protected features (notifications, etc.)
 * This is used alongside the custom backend JWT login (dual-auth approach).
 * Returns true if successful, false otherwise (non-blocking).
 */
export async function signInToSupabaseAuth(email: string, password: string): Promise<boolean> {
    try {
        // Check if we already have a valid session
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user?.email === email) {
            console.log('[Supabase Auth] Already signed in as', email);
            return true;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            // Don't fail the main login - this is a secondary auth for notifications
            console.warn('[Supabase Auth] Sign-in failed (non-blocking):', error.message);
            return false;
        }

        console.log('[Supabase Auth] Signed in successfully for notifications:', data.user?.id);
        return true;
    } catch (err) {
        console.warn('[Supabase Auth] Sign-in error (non-blocking):', err);
        return false;
    }
}

/**
 * Sign out from Supabase Auth
 */
export async function signOutFromSupabaseAuth(): Promise<void> {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.warn('[Supabase Auth] Sign-out error:', error.message);
        } else {
            console.log('[Supabase Auth] Signed out successfully');
        }
    } catch (err) {
        console.warn('[Supabase Auth] Sign-out error:', err);
    }
}

/**
 * Check if currently signed in to Supabase Auth
 */
export async function isSupabaseAuthSignedIn(): Promise<boolean> {
    try {
        const { data } = await supabase.auth.getSession();
        return !!data?.session?.user;
    } catch {
        return false;
    }
}

/**
 * Get current Supabase Auth user ID (for debugging)
 */
export async function getSupabaseAuthUserId(): Promise<string | null> {
    try {
        const { data } = await supabase.auth.getUser();
        return data?.user?.id || null;
    } catch {
        return null;
    }
}