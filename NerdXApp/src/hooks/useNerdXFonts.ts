/**
 * NerdX Brand Kit — Font Loader
 * Loads all three brand fonts: Plus Jakarta Sans, DM Sans, JetBrains Mono
 *
 * Usage in App.tsx:
 *   const { fontsLoaded } = useNerdXFonts();
 *   if (!fontsLoaded) return <SplashScreen />;
 *
 * Requires: npx expo install @expo-google-fonts/plus-jakarta-sans
 *                             @expo-google-fonts/dm-sans
 *                             @expo-google-fonts/jetbrains-mono
 */
import { useFonts } from 'expo-font';

export function useNerdXFonts() {
  const [fontsLoaded, fontError] = useFonts({
    /* Plus Jakarta Sans — display / headings */
    'PlusJakartaSans-Regular':   require('../../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'PlusJakartaSans-Medium':    require('../../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'PlusJakartaSans-SemiBold':  require('../../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'PlusJakartaSans-Bold':      require('../../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'PlusJakartaSans-ExtraBold': require('../../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),

    /* DM Sans — body / UI */
    'DMSans-Regular':  require('../../assets/fonts/DMSans-Regular.ttf'),
    'DMSans-Medium':   require('../../assets/fonts/DMSans-Medium.ttf'),
    'DMSans-SemiBold': require('../../assets/fonts/DMSans-SemiBold.ttf'),

    /* JetBrains Mono — numbers, scores, IDs */
    'JetBrainsMono-Regular': require('../../assets/fonts/JetBrainsMono-Regular.ttf'),
    'JetBrainsMono-Bold':    require('../../assets/fonts/JetBrainsMono-Bold.ttf'),
  });

  return { fontsLoaded, fontError };
}
