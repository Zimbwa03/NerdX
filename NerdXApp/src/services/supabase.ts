
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Credentials - Using same Supabase project as backend for notifications
const SUPABASE_URL = 'https://hvlvwvzliqrlmqjbfgoa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bHZ3dnpsaXFybG1xamJmZ29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzODIxMjksImV4cCI6MjA2Nzk1ODEyOX0.jHxdXm5ilonxeBBrjYEMEmL3-bd3XOvGKj7XVuLBaWU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true, // Enable to detect auth tokens from deep links
    },
});
