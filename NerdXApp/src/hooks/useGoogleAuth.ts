// Google Auth Hook using Supabase Auth
import { useCallback, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import Constants from 'expo-constants';
import { supabase } from '../services/supabase';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signIn = useCallback(async () => {
    setIsLoading(true);

    try {
      // Always use production scheme for OAuth redirect
      // This ensures APK builds use nerdx://auth/callback
      // makeRedirectUri will use exp:// in Expo Go, but we want nerdx:// for production
      const isStandalone = Constants.executionEnvironment === 'standalone' || 
                          Constants.executionEnvironment === 'storeClient';
      
      // For production APK builds, always use hardcoded production scheme
      // For development, try makeRedirectUri but fallback to production scheme
      let redirectUrl: string;
      
      if (isStandalone) {
        // Production/standalone build - use hardcoded production scheme
        redirectUrl = 'nerdx://auth/callback';
        console.log('🔑 Production/standalone build - using: nerdx://auth/callback');
      } else {
        // Development - try makeRedirectUri first
        const devRedirect = makeRedirectUri({
          scheme: 'nerdx',
          path: 'auth/callback',
          preferLocalhost: false,
        });
        
        // Always use production scheme (nerdx://) even in development
        // This ensures consistency and works in both dev and production
        redirectUrl = 'nerdx://auth/callback';
        console.log('🔑 Using production redirect URL: nerdx://auth/callback');
        console.log('🔑 (Dev redirect would be:', devRedirect + ')');
      }

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
        console.log('🔑 Opening OAuth URL in browser...');
        console.log('🔑 Expected redirect URL:', redirectUrl);
        
        // Open the OAuth URL in browser with proper options
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl,
          {
            // Ensure the browser can handle the redirect properly
            showInRecents: true,
          }
        );

        console.log('🔑 Browser result type:', result.type);
        console.log('🔑 Callback URL received:', result.url);
        
        // Handle case where browser might return early
        if (!result.url && result.type === 'success') {
          console.log('🔑 No URL in result but type is success, checking for session...');
          // Wait a bit for the redirect to complete
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Try to get the session directly
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (session && !sessionError) {
            console.log('🔑 Found session after redirect');
            const { data: userData } = await supabase.auth.getUser();
            if (userData?.user) {
              const metadata = userData.user.user_metadata || {};
              const email = userData.user.email || '';
              let given_name = metadata.given_name || '';
              let family_name = metadata.family_name || '';
              
              if (!given_name && metadata.full_name) {
                const nameParts = metadata.full_name.split(' ');
                given_name = nameParts[0] || '';
                family_name = nameParts.slice(1).join(' ') || '';
              }
              
              return {
                id: userData.user.id,
                email: email,
                name: metadata.full_name || metadata.name || given_name || '',
                given_name: given_name || metadata.name || email?.split('@')[0] || '',
                family_name: family_name || '',
                picture: metadata.avatar_url || metadata.picture || '',
                sub: userData.user.id,
              };
            }
          }
        }

        if (result.type === 'success' && result.url) {
          try {
            // Extract the access token from the URL
            // Supabase can return tokens in either hash (#) or query parameters (?)
            const url = new URL(result.url);
            let accessToken: string | null = null;
            let refreshToken: string | null = null;

            // Try hash first (common for OAuth)
            if (url.hash) {
              const hashParams = new URLSearchParams(url.hash.substring(1));
              accessToken = hashParams.get('access_token');
              refreshToken = hashParams.get('refresh_token');
              console.log('🔑 Found tokens in hash:', { hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken });
            }

            // If not in hash, try query parameters
            if (!accessToken && url.search) {
              const queryParams = new URLSearchParams(url.search);
              accessToken = queryParams.get('access_token');
              refreshToken = queryParams.get('refresh_token');
              console.log('🔑 Found tokens in query:', { hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken });
            }

            // Alternative: Try using Supabase's built-in session recovery
            if (!accessToken) {
              console.log('🔑 No tokens in URL, trying Supabase session recovery...');
              // Supabase might have already set the session, try to get it
              const { data: { session }, error: sessionError } = await supabase.auth.getSession();
              
              if (session && !sessionError) {
                console.log('🔑 Found existing Supabase session');
                accessToken = session.access_token;
                refreshToken = session.refresh_token;
              } else {
                console.error('🔑 Session recovery error:', sessionError);
                throw new Error('Could not extract tokens from callback URL or recover session');
              }
            }

            if (accessToken) {
              console.log('🔑 Setting Supabase session...');
              // Set the session in Supabase
              const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || '',
              });

              if (sessionError) {
                console.error('🔑 Session error:', sessionError);
                throw new Error(`Failed to set session: ${sessionError.message}`);
              }

              console.log('🔑 Session set successfully, getting user data...');
              // Get user data
              const { data: userData, error: getUserError } = await supabase.auth.getUser();

              if (getUserError) {
                console.error('🔑 Get user error:', getUserError);
                throw new Error(`Failed to get user: ${getUserError.message}`);
              }

              if (userData?.user) {
                console.log('🔑 User data retrieved:', { email: userData.user.email, id: userData.user.id });
                const metadata = userData.user.user_metadata || {};
                const email = userData.user.email || '';
                
                // Parse full_name if it exists (format: "First Last")
                let given_name = metadata.given_name || '';
                let family_name = metadata.family_name || '';
                
                if (!given_name && metadata.full_name) {
                  const nameParts = metadata.full_name.split(' ');
                  given_name = nameParts[0] || '';
                  family_name = nameParts.slice(1).join(' ') || '';
                }
                
                const userInfo = {
                  id: userData.user.id, // Supabase user ID
                  email: email,
                  name: metadata.full_name || metadata.name || given_name || '',
                  given_name: given_name || metadata.name || email?.split('@')[0] || '',
                  family_name: family_name || '',
                  picture: metadata.avatar_url || metadata.picture || '',
                  sub: userData.user.id,
                };
                
                console.log('🔑 Returning user info:', { email: userInfo.email, name: userInfo.name });
                return userInfo;
              } else {
                throw new Error('User data not found in response');
              }
            } else {
              throw new Error('No access token found in callback URL');
            }
          } catch (urlError: any) {
            console.error('🔑 URL parsing error:', urlError);
            throw new Error(`Failed to process callback: ${urlError.message || 'Unknown error'}`);
          }
        }

        if (result.type === 'dismiss' || result.type === 'cancel') {
          console.log('🔑 User cancelled Google Sign-In');
          throw new Error('Google Sign-In cancelled');
        }

        if (result.type === 'locked') {
          console.log('🔑 Browser locked');
          throw new Error('Browser is locked. Please unlock and try again.');
        }

        console.error('🔑 Unexpected browser result type:', result.type);
        throw new Error(`Google Sign-In did not complete. Result type: ${result.type}`);
      } else {
        console.error('🔑 No URL or data returned from Supabase');
        throw new Error('Google Sign-In did not complete - no URL returned');
      }
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
