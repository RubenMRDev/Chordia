import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Catches render errors so a single broken component does not leave the
 * visitor with a blank page.
 *
 * The copy is intentionally not translated: this boundary has to survive the
 * locale provider itself failing, so it cannot depend on it. It says the same
 * thing in both languages instead.
 */
class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // Nothing is wired to a reporter yet; keeping the stack out of the console
    // in production would make this genuinely undebuggable.
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('Chordia render error', error, info.componentStack);
    }
  }

  render(): React.ReactNode {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-ground-1">
        <div className="chassis max-w-md w-full p-8 text-center">
          <div
            aria-hidden
            className="mx-auto mb-6 h-8 w-28 rule-keys opacity-60"
          />
          <h1 className="font-display text-2xl mb-3">
            Algo se ha roto · Something broke
          </h1>
          <p className="text-ink-mid text-sm leading-relaxed mb-6">
            Recargar la página suele arreglarlo, y no se pierde nada guardado.
            <br />
            Reloading usually fixes it, and nothing saved is lost.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="press bloom-right inline-flex items-center justify-center h-11 px-5 rounded-md bg-hand-right text-hand-right-ink font-semibold"
          >
            Recargar · Reload
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
