import React from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-600/10 rounded-full blur-[100px] -z-10"></div>
                    <div className="glass-card max-w-lg w-full p-8 text-center border-rose-500/20 shadow-[0_0_50px_rgba(244,63,94,0.1)]">
                        <div className="w-20 h-20 rounded-2xl bg-rose-500/10 flex items-center justify-center mx-auto mb-6 border border-rose-500/20">
                            <AlertTriangle className="w-10 h-10 text-rose-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-4">Something went wrong</h1>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            Curwise encountered an unexpected error. We've been notified and are looking into it.
                        </p>

                        <div className="bg-slate-900/50 rounded-xl p-4 mb-8 text-left border border-white/5 overflow-hidden">
                            <p className="text-xs font-mono text-rose-400 break-words line-clamp-3">
                                {this.state.error?.toString()}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="btn-premium flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 !shadow-none py-3"
                            >
                                <RefreshCcw className="w-4 h-4" /> Reload Page
                            </button>
                            <a
                                href="/"
                                className="btn-premium flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3"
                            >
                                <Home className="w-4 h-4" /> Go to Home
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
