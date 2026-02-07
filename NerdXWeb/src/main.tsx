import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

console.log('🚀 NerdX Web starting...');

const rootElement = document.getElementById('root');
console.log('📦 Root element:', rootElement);

if (!rootElement) {
  throw new Error('Root element not found');
}

try {
  console.log('⚛️ Creating React root...');
  const root = createRoot(rootElement);

  console.log('🎨 Rendering App...');
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log('✅ App rendered successfully');
} catch (error) {
  console.error('❌ Failed to render app:', error);
  rootElement.innerHTML = `
    <div style="color: white; padding: 20px; font-family: sans-serif;">
      <h1>Error Loading NerdX</h1>
      <p>Failed to start the application. Check the console for details.</p>
      <pre style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 4px; overflow: auto;">${error}</pre>
    </div>
  `;
}
