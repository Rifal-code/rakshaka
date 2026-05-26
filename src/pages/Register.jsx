import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Shield,
  User,
  Mail,
  Key,
  AlertTriangle,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

export const Register = () => {
  const { register, login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError("Harap lengkapi semua kolom.");
      return;
    }

    if (username.length < 3 || username.length > 50) {
      setError("Username harus di antara 3 hingga 50 karakter.");
      return;
    }

    if (password.length < 8) {
      setError("Password minimal harus 8 karakter.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // 1. Call Register API
      const registerRes = await register(username, email, password);

      if (registerRes.success) {
        setSuccess(true);
        // 2. UX shortcut: Auto login after successful registration!
        await login(email, password);
        navigate("/dashboard");
      } else {
        throw new Error(registerRes.message || "Registrasi gagal");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          "Gagal melakukan pendaftaran. Silakan coba kembali atau gunakan email/username lain.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden cyber-grid">
      {/* Background patterns */}
      <div className="absolute inset-0 dotted-grid pointer-events-none opacity-55"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        {/* Back to Home Link */}
        <div className="text-center mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 group text-slate-500 hover:text-cyber-cyan transition-colors text-xs font-mono tracking-widest uppercase"
          >
            <Shield className="w-4 h-4 text-slate-500 group-hover:text-cyber-cyan transition-colors" />
            Kembali ke Beranda
          </Link>
        </div>

        {/* Register Card Container */}
        <div className="glass-panel p-8 sm:p-10 border-cyber-border relative">
          {/* Top colored indicator bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-cyber-cyan rounded-t-2xl"></div>

          {/* Heading */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/20 flex items-center justify-center text-cyber-cyan">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-app-text tracking-wide">
              Buat Akun Rakshaka
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Daftarkan diri Anda untuk melapor
            </p>
          </div>

          {/* Success Banner */}
          {success && (
            <div className="border border-cyber-green/30 rounded-xl bg-cyber-green/5 p-4 flex items-center gap-3 text-cyber-green mb-6">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              <p className="text-xs font-medium">
                Registrasi Berhasil! Mengalihkan ke Dashboard...
              </p>
            </div>
          )}

          {/* Form */}
          {!success && (
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Username Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="username"
                  className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-500"
                >
                  Username Akun
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    id="username"
                    type="text"
                    required
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-cyber-card border border-cyber-border focus:border-cyber-cyan focus:ring-4 focus:ring-cyber-cyan/10 focus:outline-none text-app-text placeholder-slate-400 transition-all duration-300 font-sans"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-500"
                >
                  Email Akun
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-cyber-card border border-cyber-border focus:border-cyber-cyan focus:ring-4 focus:ring-cyber-cyan/10 focus:outline-none text-app-text placeholder-slate-400 transition-all duration-300 font-sans"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-500"
                >
                  Password Baru (Min. 8 Karakter)
                </label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Minimal 8 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full pl-12 pr-12 py-3 rounded-xl bg-cyber-card border border-cyber-border focus:border-cyber-cyan focus:ring-4 focus:ring-cyber-cyan/10 focus:outline-none text-app-text placeholder-slate-400 transition-all duration-300 font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyber-cyan"
                    tabIndex="-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
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
                  className="w-full py-3.5 px-4 rounded-xl text-sm font-display font-bold bg-cyber-cyan text-cyber-dark shadow-sm hover:bg-cyber-cyan/90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-cyber-dark border-t-transparent rounded-full animate-spin"></span>
                      Mendaftarkan Akun...
                    </>
                  ) : (
                    "Daftar Akun Baru"
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Card Footer Link */}
          <div className="mt-8 pt-6 border-t border-cyber-border text-center">
            <p className="text-sm text-slate-400">
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="font-semibold text-cyber-cyan hover:underline transition-colors"
              >
                Masuk Sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
