import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (msg) => addToast('success', msg),
    error: (msg) => addToast('error', msg),
    info: (msg) => addToast('info', msg),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
              animate-page-entrance pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl min-w-[300px] max-w-sm backdrop-blur-xl border transition-all duration-300
              ${t.type === 'success' ? 'bg-cyber-green/10 border-cyber-green/30 text-cyber-green shadow-[0_0_15px_rgba(18,255,75,0.1)]' : ''}
              ${t.type === 'error' ? 'bg-cyber-red/10 border-cyber-red/30 text-cyber-red shadow-[0_0_15px_rgba(255,42,85,0.1)]' : ''}
              ${t.type === 'info' ? 'bg-cyber-cyan/10 border-cyber-cyan/30 text-cyber-cyan shadow-[0_0_15px_rgba(0,255,204,0.1)]' : ''}
            `}
          >
            <div className="mt-0.5 shrink-0">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5" />}
              {t.type === 'info' && <Info className="w-5 h-5" />}
            </div>
            
            <div className="flex-1 text-sm font-medium leading-relaxed">
              {t.message}
            </div>

            <button 
              onClick={() => removeToast(t.id)}
              className="opacity-50 hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-white/10 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
