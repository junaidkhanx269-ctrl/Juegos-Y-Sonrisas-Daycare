import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleResetAll = () => {
    try {
      localStorage.removeItem('CUSTOM_SUPABASE_URL');
      localStorage.removeItem('CUSTOM_SUPABASE_ANON_KEY');
      localStorage.removeItem('site_hero_image');
      localStorage.removeItem('site_about_image');
      localStorage.removeItem('site_gallery_images');
    } catch (e) {}
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border-2 border-[#8B4513]/20 text-center space-y-6">
            <div className="w-16 h-16 bg-amber-100 text-[#8B4513] rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-display font-bold text-2xl text-[#1A237E]">
                Something went wrong
              </h2>
              <p className="text-xs text-[#8B4513] leading-relaxed">
                The application encountered an error while loading or connecting. You can reload the page or reset the local configuration to restore default settings.
              </p>
              {this.state.error?.message && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-left text-[11px] font-mono text-red-800 break-all max-h-32 overflow-y-auto">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full py-3 bg-[#1A237E] hover:bg-[#283593] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleResetAll}
                className="w-full py-3 bg-amber-100 hover:bg-amber-200 text-[#8B4513] font-bold text-xs rounded-xl border border-[#8B4513]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reset Supabase Keys & Recover</span>
              </button>

              <a
                href="/"
                className="text-xs font-bold text-[#1A237E] hover:underline inline-flex items-center justify-center gap-1 pt-1"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Back to Homepage</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
