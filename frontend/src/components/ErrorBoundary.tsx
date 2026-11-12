import { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.hash = "#/";
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-6 text-center bg-cool-mist">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-4 shadow-sm">
            <AlertCircle size={32} />
          </div>
          <h2 className="font-display font-bold text-lg text-ink mb-1">
            The Veil Frays
          </h2>
          <p className="text-xs text-ink-2 max-w-xs mb-6">
            An unforeseen disturbance occurred. Return to the Sanctuary.
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet text-white text-xs font-bold font-ui active:scale-95 shadow-md"
          >
            <RotateCcw size={16} />
            Return Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
