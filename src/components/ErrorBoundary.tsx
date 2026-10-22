import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 text-red-900 font-mono text-sm max-w-4xl mx-auto my-10 rounded-xl border border-red-200 z-50 relative">
          <h1 className="text-xl font-bold mb-4 text-red-600">React Application Error Captured</h1>
          <div className="p-4 bg-white rounded border border-red-300 font-semibold mb-4 text-red-800">
            {this.state.error?.toString()}
          </div>
          <pre className="bg-red-100 p-4 rounded text-xs overflow-auto max-h-96 whitespace-pre-wrap">
            {this.state.errorInfo?.componentStack || this.state.error?.stack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
