import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application error caught by boundary:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen flex items-center justify-center bg-primary px-6 py-20 text-primary">
          <div className="max-w-md rounded-3xl border border-color bg-secondary p-8 text-center shadow-xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-3xl text-red-500">
              ⚠️
            </div>
            <h1 className="text-3xl font-display font-bold">Something went wrong</h1>
            <p className="mt-4 text-secondary">
              We were unable to load this page. Please try again or return to the home page.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={this.handleRetry}
                className="rounded-xl bg-accent-blue px-5 py-3 font-medium text-white transition hover:bg-accent-blue/90"
              >
                Try Again
              </button>
              <a
                href="/"
                className="rounded-xl border border-color bg-primary px-5 py-3 font-medium text-primary transition hover:bg-tertiary"
              >
                Go Home
              </a>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
