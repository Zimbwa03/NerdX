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
        scheme: 'nerdx', // Use consistent scheme with app.json
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
            const { data: userData, error: getUserError } = await supabase.auth.getUser();

            if (getUserError) {
              throw new Error(getUserError.message);
            }

            if (userData?.user) {
              const metadata = userData.user.user_metadata || {};
              
              // Parse full_name if it exists (format: "First Last")
              let given_name = metadata.given_name || '';
              let family_name = metadata.family_name || '';
              
              if (!given_name && metadata.full_name) {
                const nameParts = metadata.full_name.split(' ');
                given_name = nameParts[0] || '';
                family_name = nameParts.slice(1).join(' ') || '';
              }
              
              return {
                id: userData.user.id, // Supabase user ID
                email: userData.user.email || '',
                name: metadata.full_name || metadata.name || given_name || '',
                given_name: given_name || metadata.name || email?.split('@')[0] || '',
                family_name: family_name || '',
                picture: metadata.avatar_url || metadata.picture || '',
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
