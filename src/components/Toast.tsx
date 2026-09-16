import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export default function ToastContainer({ toasts, onClose }: ToastProps) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: ToastMessage; onClose: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const isError = toast.type === 'error';
  const isInfo = toast.type === 'info';

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-slide-up ${
        isError
          ? 'bg-red-900/90 text-white border-red-700'
          : isInfo
          ? 'bg-slate-900/90 text-white border-slate-700'
          : 'bg-emerald-900/90 text-white border-emerald-700'
      }`}
    >
      <div className="flex items-center gap-3">
        {isError ? (
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
        ) : isInfo ? (
          <Info className="w-5 h-5 text-blue-400 shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        )}
        <span className="text-xs font-bold leading-snug">{toast.message}</span>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="p-1 rounded-lg hover:bg-white/20 text-white/70 hover:text-white transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
