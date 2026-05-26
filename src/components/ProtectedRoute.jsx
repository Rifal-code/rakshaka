import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cyber-dark flex flex-col items-center justify-center relative overflow-hidden cyber-grid">
        {/* Glowing aura */}
        <div className="absolute w-[300px] h-[300px] rounded-full bg-cyber-cyan/10 blur-[80px]"></div>
        
        {/* Loading Card */}
        <div className="glass-panel p-8 flex flex-col items-center max-w-sm w-full mx-4 border-cyber-cyan/20 relative">
          {/* Scanline animation */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="w-full h-1/2 bg-gradient-to-b from-transparent via-cyber-cyan/10 to-transparent animate-scan"></div>
          </div>

          {/* Logo animation */}
          <div className="w-16 h-16 rounded-2xl border-2 border-cyber-cyan flex items-center justify-center mb-6 relative animate-pulse">
            <div className="absolute inset-0 rounded-2xl bg-cyber-cyan/20 blur-sm"></div>
            <span className="text-2xl font-display font-extrabold text-cyber-cyan text-neon-cyan">R</span>
          </div>

          <h3 className="text-xl font-display text-slate-200 mb-2">Mengamankan Sesi</h3>
          <p className="text-sm text-slate-400 text-center mb-4">Harap tunggu, memverifikasi kredensial enkripsi...</p>
          
          {/* Progress bar */}
          <div className="w-full bg-cyber-border h-1 rounded-full overflow-hidden">
            <div className="bg-cyber-cyan h-full w-2/3 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page but save the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    // User is authenticated but is not an admin, redirect to user dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
