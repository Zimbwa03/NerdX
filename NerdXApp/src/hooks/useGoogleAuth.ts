// Google Auth Hook using Supabase Auth
import { useCallback, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from '../services/supabase';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signIn = useCallback(async () => {
    setIsLoading(true);

    try {
      const redirectUrl = makeRedirectUri({
        scheme: 'nerdxapp',
        path: 'auth/callback',
      });

      console.log('🔑 Starting Supabase Google Auth with redirect:', redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.url) {
        // Open the OAuth URL in browser
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl
        );

        console.log('🔑 Browser result:', result.type);

        if (result.type === 'success' && result.url) {
          // Extract the access token from the URL
          const url = new URL(result.url);
          const params = new URLSearchParams(url.hash.substring(1));
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');

          if (accessToken) {
            // Set the session in Supabase
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });

            if (sessionError) {
              throw new Error(sessionError.message);
            }

            // Get user data
            const { data: userData } = await supabase.auth.getUser();

            if (userData?.user) {
              return {
                email: userData.user.email,
                name: userData.user.user_metadata?.full_name || userData.user.user_metadata?.name || '',
                given_name: userData.user.user_metadata?.given_name || '',
                family_name: userData.user.user_metadata?.family_name || '',
                picture: userData.user.user_metadata?.avatar_url || userData.user.user_metadata?.picture || '',
                sub: userData.user.id,
              };
            }
          }
        }

        if (result.type === 'dismiss' || result.type === 'cancel') {
          throw new Error('Google Sign-In cancelled');
        }
      }

      throw new Error('Google Sign-In did not complete');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isReady: true, // Always ready with Supabase
    isLoading,
    signIn,
  };
};
