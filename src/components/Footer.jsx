import React from 'react';
import { Shield } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-cyber-border bg-cyber-dark/40 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyber-cyan" />
            <span className="font-display font-bold text-sm tracking-wider text-slate-400">
              RAKSHAKA &copy; 2026. Melindungi Ruang Digital Indonesia.
            </span>
          </div>
          <div className="flex gap-6 text-xs text-slate-500">
            <span className="hover:text-cyber-green transition-colors cursor-default">Anti-Scam</span>
            <span className="hover:text-cyber-cyan transition-colors cursor-default">Anti-Phishing</span>
            <span className="hover:text-cyber-red transition-colors cursor-default">Anti-Judol</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
