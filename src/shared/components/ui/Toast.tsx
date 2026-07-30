import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextValue {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  const showToast = useCallback((type: ToastType, message: string) => {
    setToast({ type, message });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border p-4 shadow-xl transition-opacity duration-300"
          style={{
            backgroundColor: toast.type === 'success' ? '#ecfdf5' : toast.type === 'error' ? '#fef2f2' : '#eff6ff',
            borderColor: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#3b82f6',
            color: toast.type === 'success' ? '#065f46' : toast.type === 'error' ? '#991b1b' : '#1d4ed8'
          }}
        >
          <div className="font-semibold text-sm capitalize">{toast.type}</div>
          <div className="mt-1 text-sm">{toast.message}</div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
