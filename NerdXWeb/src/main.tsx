import { StrictMode, Component, type ReactNode, type ErrorInfo } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

interface EBProps { children: ReactNode; }
interface EBState { hasError: boolean; error: Error | null; errorInfo: ErrorInfo | null; }

class ErrorBoundary extends Component<EBProps, EBState> {
  constructor(props: EBProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('React Error Boundary caught:', error, errorInfo);
    this.setState({ errorInfo });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ background: '#0f0a1a', color: '#e2e8f0', minHeight: '100vh', padding: '40px 24px', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <h1 style={{ color: '#f87171', fontSize: '1.5rem', marginBottom: 12 }}>Something went wrong</h1>
            <p style={{ color: '#94a3b8', marginBottom: 16 }}>The app encountered an error. Try refreshing the page.</p>
            <button
              onClick={() => window.location.reload()}
              style={{ background: '#7c4dff', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontSize: '0.9rem', marginBottom: 20 }}
            >
              Refresh Page
            </button>
            <details style={{ marginTop: 16 }}>
              <summary style={{ cursor: 'pointer', color: '#a78bfa', marginBottom: 8 }}>Error details</summary>
              <pre style={{ background: 'rgba(255,255,255,0.06)', padding: 14, borderRadius: 8, overflow: 'auto', fontSize: '0.8rem', color: '#fca5a5', whiteSpace: 'pre-wrap' }}>
                {this.state.error?.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

console.log('NerdX Web starting...');

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

try {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  rootElement.innerHTML = `
    <div style="background:#0f0a1a;color:white;padding:40px 24px;font-family:system-ui,sans-serif;min-height:100vh;">
      <h1 style="color:#f87171;">Error Loading NerdX</h1>
      <p>Failed to start the application. Check the console for details.</p>
      <pre style="background:rgba(255,255,255,0.06);padding:14px;border-radius:8px;overflow:auto;color:#fca5a5;">${error}</pre>
    </div>
  `;
}
