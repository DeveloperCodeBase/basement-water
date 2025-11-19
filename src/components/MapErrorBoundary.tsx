import React from 'react';

interface State {
  hasError: boolean;
  message?: string;
}

class MapErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'خطای ناشناخته',
    };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    console.error('MapErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-red-400/60 bg-red-500/5 p-4 text-center text-sm">
          <p className="mb-2 font-semibold text-red-300">خطایی در نمایش نقشه رخ داده است.</p>
          <p className="text-xs text-red-200/80">{this.state.message}</p>
          <p className="mt-2 text-[11px] text-red-200/60">لطفاً صفحه را تازه‌سازی کنید یا با مدیر سیستم تماس بگیرید.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default MapErrorBoundary;
