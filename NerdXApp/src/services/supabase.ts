
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Credentials provided by user
const SUPABASE_URL = 'https://lzteiewcvxoazqfxfjgg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6dGVpZXdjdnhvYXpxZnhmamdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NDE0MTIsImV4cCI6MjA3NzUxNzQxMn0.ZtCVuK3rx2rqpc5kJV-6iblqjUEZy52dkpUdkEbQlvI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true, // Enable to detect auth tokens from deep links
    },
});
