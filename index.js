/**
 * Root entry for Expo when running from repo root (NerdX).
 * Delegates to the actual app in NerdXApp.
 */
import { registerRootComponent } from 'expo';
import App from './NerdXApp/App';

registerRootComponent(App);
