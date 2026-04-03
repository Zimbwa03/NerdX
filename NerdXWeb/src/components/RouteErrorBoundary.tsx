import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  /** Display name shown in the error message (e.g. "Subjects", "School Portal") */
  section?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Per-route error boundary — wraps a section of the router so one broken
 * feature can't crash the whole app. Renders an inline fallback rather than
 * a full-screen crash.
 */
export class RouteErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[RouteErrorBoundary:${this.props.section ?? 'unknown'}]`, error, info);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-lg font-semibold text-red-400">
          {this.props.section ? `${this.props.section} failed to load` : 'Something went wrong'}
        </p>
        <p className="text-sm text-slate-400">Try refreshing, or go back to the dashboard.</p>
        <div className="flex gap-3">
          <button
            onClick={this.handleRetry}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-500"
          >
            Retry
          </button>
          <button
            onClick={() => window.location.assign('/app')}
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-600"
          >
            Dashboard
          </button>
        </div>
      </div>
    );
  }
}
