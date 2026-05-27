import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Globe, Heart, ExternalLink } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-cyber-border bg-cyber-dark/80 backdrop-blur-sm mt-auto relative overflow-hidden">
      {/* Subtle top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-cyan/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center">
                <Shield className="w-4 h-4 text-cyber-cyan" />
              </div>
              <span className="font-display font-extrabold text-lg tracking-wider text-app-text">
                RAKSHAKA
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Platform pelaporan kejahatan siber untuk melindungi ekosistem digital Indonesia dari ancaman penipuan online, phishing, dan judi ilegal.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
              Navigasi
            </h4>
            <nav className="flex flex-col gap-2.5">
              <Link 
                to="/" 
                className="text-sm text-slate-500 hover:text-cyber-cyan transition-colors duration-200 inline-flex items-center gap-1.5 group w-fit"
              >
                <Globe className="w-3.5 h-3.5" />
                Beranda
              </Link>
              <Link 
                to="/reports" 
                className="text-sm text-slate-500 hover:text-cyber-cyan transition-colors duration-200 inline-flex items-center gap-1.5 group w-fit"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Laporan Publik
              </Link>
              <Link 
                to="/login" 
                className="text-sm text-slate-500 hover:text-cyber-cyan transition-colors duration-200 inline-flex items-center gap-1.5 group w-fit"
              >
                <Shield className="w-3.5 h-3.5" />
                Masuk / Daftar
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
              Perlindungan
            </h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 transition-colors cursor-default">
                Anti-Scam
              </span>
              <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20 hover:bg-cyber-cyan/20 transition-colors cursor-default">
                Anti-Phishing
              </span>
              <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyber-red/10 text-cyber-red border border-cyber-red/20 hover:bg-cyber-red/20 transition-colors cursor-default">
                Anti-Judol
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Membantu masyarakat Indonesia mengenali dan melaporkan ancaman digital secara kolektif.
            </p>
          </div>
        </div>

        {/* Bottom Bar / Copyright */}
        <div className="border-t border-cyber-border/60 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
            &copy; {currentYear} Rakshaka. Seluruh hak cipta dilindungi undang-undang.
          </p>
          <p className="text-[11px] text-slate-600 font-mono flex items-center gap-1">
            Dibuat dengan 
            <Heart className="w-3 h-3 text-cyber-red inline mx-0.5 animate-pulse" style={{ animationDuration: '2s' }} />
            untuk keamanan digital Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
};
