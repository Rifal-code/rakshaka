import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Key, Mail, AlertTriangle, Eye, EyeOff } from 'lucide-react';

export const Login = () => {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  const from = location.state?.from?.pathname || '/dashboard';
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Harap lengkapi semua kolom.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      // AuthContext will trigger redirect via useEffect
    } catch (err) {
      console.error(err);
      setError(err.message || 'Login gagal. Periksa kembali email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden cyber-grid">
      {/* Background decoration */}
      <div className="absolute top-[20%] left-[-15%] w-[40%] h-[40%] rounded-full bg-cyber-cyan/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-15%] w-[40%] h-[40%] rounded-full bg-cyber-red/5 blur-[120px] pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        {/* Back to Home Link */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 group text-slate-500 hover:text-cyber-cyan transition-colors text-xs font-mono tracking-widest uppercase">
            <Shield className="w-4 h-4 text-slate-500 group-hover:text-cyber-cyan transition-colors" />
            Kembali ke Beranda
          </Link>
        </div>

        {/* Login Card Container */}
        <div className="glass-panel p-8 sm:p-10 border-cyber-cyan/10 shadow-cyber-card relative">
          {/* Top colored indicator bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyber-cyan to-cyber-cyan/50 rounded-t-2xl"></div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-wide">
              OTENTIKASI RAKSHAKA
            </h2>
            <p className="mt-2 text-xs font-mono text-slate-500 uppercase tracking-widest">
              Akses panel perlindungan siber
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                Email Pengguna
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-cyber-dark border border-cyber-border focus:border-cyber-cyan focus:shadow-neon-cyan focus:outline-none text-slate-200 placeholder-slate-600 transition-all duration-300 font-sans"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                  Password Enkripsi
                </label>
              </div>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-cyber-dark border border-cyber-border focus:border-cyber-cyan focus:shadow-neon-cyan focus:outline-none text-slate-200 placeholder-slate-600 transition-all duration-300 font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="border border-cyber-red/30 rounded-xl bg-cyber-red/5 p-4 flex items-start gap-3 text-cyber-red animate-fade-in">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-xs font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-display font-bold bg-cyber-cyan text-cyber-dark shadow-neon-cyan hover:bg-cyber-cyan/90 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-cyber-dark border-t-transparent rounded-full animate-spin"></span>
                    Membuka Enkripsi...
                  </>
                ) : (
                  'Masuk ke Panel'
                )}
              </button>
            </div>
          </form>

          {/* Card Footer Link */}
          <div className="mt-8 pt-6 border-t border-cyber-border text-center">
            <p className="text-sm text-slate-400">
              Belum punya akun?{' '}
              <Link to="/register" className="font-semibold text-cyber-cyan hover:underline hover:text-neon-cyan transition-colors">
                Registrasi di Sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
