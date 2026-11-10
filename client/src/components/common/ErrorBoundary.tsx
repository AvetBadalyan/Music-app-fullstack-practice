import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Catches errors thrown while rendering the page below it (including a lazy
 * page chunk that fails to download after a new deploy) and shows a message
 * with a Reload button instead of a blank screen.
 *
 * It has to be a class: React only supports error boundaries as classes.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="page" role="alert">
        <h1>Something went wrong</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
          This page could not be loaded. Reloading usually fixes it.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            minHeight: 'max(4rem, var(--touch-target))',
            padding: '0 var(--space-5)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-accent-strong)',
            color: '#fff',
            fontSize: 'var(--font-md)',
            fontWeight: 'var(--weight-bold)',
            cursor: 'pointer',
          }}
        >
          Reload page
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
