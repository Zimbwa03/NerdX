
import { useCallback, useMemo } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

// Fallbacks so dev doesn't break if env vars are missing. Replace the string
// below with your real Android client ID if you want a hard default.
const FALLBACK_ANDROID_CLIENT_ID = '654185642077-3m6ce82pdl383mdv5ku8k9u8melep6vc.apps.googleusercontent.com';

const googleClientConfig = {
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || FALLBACK_ANDROID_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  // Used when running inside Expo Go; optional but keeps dev flow smoother.
  expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
};

const hasClientConfig = Object.values(googleClientConfig).some(Boolean);

// Explicit redirect URIs. For native builds, use the package-based scheme.
const redirectUri =
  Platform.OS === 'web'
    ? 'https://nerdx.onrender.com'
    : 'com.Ngoni03.nerdxapp:/oauthredirect';

const fetchGoogleProfile = async (accessToken: string) => {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error('Unable to fetch Google profile');
  }

  return response.json();
};

export const useGoogleAuth = () => {
  const [request, , promptAsync] = Google.useAuthRequest({
    ...googleClientConfig,
    scopes: ['openid', 'profile', 'email'],
    // Cast to any to satisfy typing; Google supports 'select_account' prompt.
    prompt: 'select_account' as any,
    redirectUri,
  });

  const signIn = useCallback(async () => {
    if (!request) {
      throw new Error('Google Sign-In is not ready. Check client IDs.');
    }

    const result = await promptAsync({
      showInRecents: true,
    } as any); // cast to allow useProxy:false; default behavior avoids proxy when redirectUri uses custom scheme

    if (result.type !== 'success' || !result.authentication?.accessToken) {
      throw new Error(result.type === 'dismiss' ? 'Google Sign-In cancelled' : 'Google Sign-In did not complete');
    }

    return fetchGoogleProfile(result.authentication.accessToken);
  }, [promptAsync, request]);

  const isReady = useMemo(() => hasClientConfig && Boolean(request), [request]);

  return {
    isReady,
    signIn,
  };
};

