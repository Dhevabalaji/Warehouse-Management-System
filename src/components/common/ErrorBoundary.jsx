import { Component } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      errorMessage: "",
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message || "Something went wrong",
    };
  }

  componentDidCatch(error, info) {
    console.error("App crashed:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
          <div className="max-w-lg w-full rounded-3xl bg-white/5 border border-white/10 p-8 text-center">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-red-500/10 text-red-300 flex items-center justify-center mb-5">
              <AlertTriangle size={32} />
            </div>

            <h1 className="text-3xl font-black">Something broke</h1>

            <p className="text-slate-400 mt-3">
              The app crashed because of a frontend error.
            </p>

            <div className="mt-5 rounded-xl bg-slate-900 border border-white/10 p-4 text-left text-sm text-red-300">
              {this.state.errorMessage}
            </div>

            <button
              onClick={this.handleReload}
              className="btn-primary mt-6"
            >
              <RefreshCcw size={18} />
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}