import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Search, 
  LogOut, 
  User, 
  Menu, 
  X,
  ShieldCheck 
} from 'lucide-react';

export const DashboardLayout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { 
      path: '/dashboard', 
      label: 'Daftar Laporan', 
      icon: LayoutDashboard,
      roles: ['user', 'admin']
    },
    { 
      path: '/reports/new', 
      label: 'Laporkan Kasus', 
      icon: PlusCircle,
      roles: ['user', 'admin']
    },
    { 
      path: '/link-checker', 
      label: 'Deteksi Link', 
      icon: Search,
      roles: ['user', 'admin']
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-cyber-dark flex flex-col md:flex-row relative dotted-grid">
      {/* Mobile Top Navbar */}
      <header className="md:hidden flex items-center justify-between px-6 h-16 bg-cyber-card border-b border-cyber-border sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-cyber-cyan" />
          <span className="font-display font-extrabold text-lg tracking-wider text-app-text">RAKSHAKA</span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-xl text-slate-400 hover:text-app-text bg-cyber-dark border border-cyber-border"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-cyber-card border-r border-cyber-border p-6 flex flex-col justify-between
        transform md:translate-x-0 md:static md:z-auto transition-transform duration-300 ease-in-out md:h-full
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center group-hover:border-cyber-cyan transition-colors">
                <Shield className="w-5 h-5 text-cyber-cyan" />
              </div>
              <span className="font-display font-extrabold text-lg tracking-wider text-app-text">RAKSHAKA</span>
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-app-text"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="p-4 rounded-2xl bg-cyber-lightDark border border-cyber-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyber-cyan/20 flex items-center justify-center text-cyber-cyan border border-cyber-cyan/40">
              <User className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-semibold text-app-text truncate">{user?.username}</h4>
              <p className="text-xs text-slate-500 font-mono flex items-center gap-1 uppercase tracking-wider">
                {isAdmin ? (
                  <span className="text-cyber-green flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" /> ADMIN
                  </span>
                ) : (
                  <span>USER</span>
                )}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                    ${isActive(item.path) 
                      ? 'bg-cyber-cyan/10 text-cyber-cyan border-r-2 border-cyber-cyan shadow-sm' 
                      : 'text-slate-400 hover:text-app-text hover:bg-cyber-lightDark border-r-2 border-transparent'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive(item.path) ? 'text-cyber-cyan' : 'text-slate-400 group-hover:text-app-text'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer / Logout */}
        <div className="pt-6 border-t border-cyber-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-cyber-red hover:bg-cyber-red/10 border-r-2 border-transparent hover:border-cyber-red transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Keluar Sistem
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:h-full md:overflow-y-auto">
        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto relative z-10">
          {children}
        </main>
      </div>

      {/* Overlay backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        ></div>
      )}
    </div>
  );
};
