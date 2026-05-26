import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Menu, X, LogOut, LayoutDashboard, Search, FileText } from 'lucide-react';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="border-b border-cyber-border bg-cyber-dark/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center group-hover:border-cyber-cyan group-hover:shadow-neon-cyan transition-all duration-300">
                <Shield className="w-5 h-5 text-cyber-cyan group-hover:scale-110 transition-transform" />
              </div>
              <span className="font-display font-extrabold text-xl tracking-wider text-slate-100 group-hover:text-cyber-cyan transition-colors">
                RAKSHAKA
              </span>
            </Link>
          </div>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-cyber-cyan ${isActive('/') ? 'text-cyber-cyan text-neon-cyan' : 'text-slate-400'}`}
            >
              Beranda
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-sm font-medium transition-colors hover:text-cyber-cyan ${isActive('/dashboard') ? 'text-cyber-cyan text-neon-cyan' : 'text-slate-400'}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/link-checker" 
                  className={`text-sm font-medium transition-colors hover:text-cyber-cyan ${isActive('/link-checker') ? 'text-cyber-cyan text-neon-cyan' : 'text-slate-400'}`}
                >
                  Cek Link
                </Link>
              </>
            )}
          </div>

          {/* Right Section Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col text-right">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{user?.role}</span>
                  <span className="text-sm font-medium text-slate-200">{user?.username}</span>
                </div>
                <div className="h-8 w-px bg-cyber-border"></div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="p-2 text-slate-400 hover:text-cyber-red hover:bg-cyber-red/10 rounded-xl transition-all duration-200"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-cyber-cyan text-cyber-dark hover:bg-cyber-cyan/90 shadow-neon-cyan transition-all duration-300 font-display"
                >
                  Daftar Sekarang
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-cyber-card transition-colors border border-transparent hover:border-cyber-border"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden border-b border-cyber-border bg-cyber-dark/95 backdrop-blur-lg animate-fade-in">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-xl text-base font-medium ${isActive('/') ? 'bg-cyber-card text-cyber-cyan border-l-2 border-cyber-cyan' : 'text-slate-400 hover:bg-cyber-card hover:text-white'}`}
            >
              Beranda
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-xl text-base font-medium ${isActive('/dashboard') ? 'bg-cyber-card text-cyber-cyan border-l-2 border-cyber-cyan' : 'text-slate-400 hover:bg-cyber-card'}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/link-checker"
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-xl text-base font-medium ${isActive('/link-checker') ? 'bg-cyber-card text-cyber-cyan border-l-2 border-cyber-cyan' : 'text-slate-400 hover:bg-cyber-card'}`}
                >
                  Cek Link
                </Link>
                <div className="pt-4 border-t border-cyber-border mt-4 px-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-200">{user?.username}</div>
                    <div className="text-xs text-slate-500 uppercase">{user?.role}</div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                      navigate('/');
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-cyber-red hover:bg-cyber-red/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Out
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-4 border-t border-cyber-border mt-4 px-3 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-cyber-card"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2 rounded-xl text-sm font-semibold bg-cyber-cyan text-cyber-dark shadow-neon-cyan"
                >
                  Daftar Sekarang
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
