import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

// A failed lazy() chunk is the common case here: after a deploy, a browser
// holding the previous index.html requests chunk files that no longer exist.
// Without this the user just gets a blank page.
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Unhandled error:', error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl border border-stone-100 shadow-sm text-center">
          <h1 className="text-xl font-bold text-stone-900 mb-2">Algo correu mal</h1>
          <p className="text-stone-500 text-sm mb-6">
            Não foi possível carregar esta página. Recarregar costuma resolver.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors active:scale-95"
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }
}
