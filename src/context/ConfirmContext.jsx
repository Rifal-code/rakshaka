import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmContext = createContext(null);

export const ConfirmProvider = ({ children }) => {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
    isDestructive: false,
  });

  const confirm = useCallback(({ title, message, isDestructive = false }) => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        title,
        message,
        isDestructive,
        onConfirm: () => {
          setConfirmState(prev => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setConfirmState(prev => ({ ...prev, isOpen: false }));
          resolve(false);
        }
      });
    });
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      
      {/* Confirm Modal Backdrop */}
      {confirmState.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-cyber-dark/80 backdrop-blur-sm animate-page-entrance">
          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-cyber-card border border-cyber-border rounded-2xl shadow-cyber-card p-6 transform transition-all duration-300">
            <button 
              onClick={confirmState.onCancel}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-cyber-lightDark/50 hover:bg-cyber-lightDark rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mt-2">
              <div className={`p-4 rounded-full mb-4 bg-opacity-10 ${confirmState.isDestructive ? 'bg-cyber-red text-cyber-red/20' : 'bg-orange-500 text-orange-500/20'}`}>
                <AlertTriangle className={`w-10 h-10 ${confirmState.isDestructive ? 'text-cyber-red' : 'text-orange-500'}`} />
              </div>
              
              <h3 className="text-xl font-display font-bold text-app-text mb-2">
                {confirmState.title}
              </h3>
              
              <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                {confirmState.message}
              </p>

              <div className="flex w-full gap-3">
                <button
                  onClick={confirmState.onCancel}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm border border-cyber-border bg-cyber-lightDark hover:bg-cyber-border text-white transition-all duration-300"
                >
                  Batal
                </button>
                <button
                  onClick={confirmState.onConfirm}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 text-cyber-dark ${
                    confirmState.isDestructive 
                      ? 'bg-cyber-red hover:bg-cyber-red/90 shadow-[0_0_15px_rgba(255,42,85,0.4)]' 
                      : 'bg-cyber-cyan hover:bg-cyber-cyan/90 shadow-[0_0_15px_rgba(0,255,204,0.4)]'
                  }`}
                >
                  Ya, Lanjutkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error('useConfirm must be used within ConfirmProvider');
  return context;
};
