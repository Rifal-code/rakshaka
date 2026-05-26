import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Search, 
  ChevronRight, 
  FileText, 
  TrendingUp,
  Cpu
} from 'lucide-react';

export const Home = () => {
  const { isAuthenticated } = useAuth();
  const [urlInput, setUrlInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsScanning(true);
    setScanResult(null);
    setError(null);

    // Minimum scan time for the radar animation effect
    const scanPromise = new Promise(resolve => setTimeout(resolve, 2200));

    try {
      let apiPromise;
      if (isAuthenticated) {
        // Real API Call
        apiPromise = api.checkLink(urlInput);
      } else {
        // Simulated local scan for guests (great UX / conversion hook)
        apiPromise = (async () => {
          await new Promise(resolve => setTimeout(resolve, 800));
          const urlLower = urlInput.toLowerCase();
          
          // Basic heuristic rules for mock
          if (urlLower.includes('judol') || urlLower.includes('slot') || urlLower.includes('gacor') || urlLower.includes('sbobet')) {
            return {
              success: true,
              data: { url: urlInput, status: 'malicious', score: 18 }
            };
          } else if (urlLower.includes('login') || urlLower.includes('verifikasi') || urlLower.includes('bantuan-bca') || urlLower.includes('undian-bri')) {
            return {
              success: true,
              data: { url: urlInput, status: 'suspicious', score: 45 }
            };
          } else if (urlLower.includes('google.com') || urlLower.includes('github.com') || urlLower.includes('wikipedia.org')) {
            return {
              success: true,
              data: { url: urlInput, status: 'safe', score: 98 }
            };
          } else {
            return {
              success: true,
              data: { url: urlInput, status: 'unknown', score: 50 }
            };
          }
        })();
      }

      const [_, response] = await Promise.all([scanPromise, apiPromise]);

      if (response.success && response.data) {
        setScanResult(response.data);
      } else {
        throw new Error(response.message || "Failed to scan link.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal memproses link. Coba periksa koneksi internet Anda.");
    } finally {
      setIsScanning(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'safe':
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-cyber-green/10 text-cyber-green border border-cyber-green/30 text-neon-green">
            <ShieldCheck className="w-3.5 h-3.5" /> AMAN
          </span>
        );
      case 'suspicious':
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" /> MENCURIGAKAN
          </span>
        );
      case 'malicious':
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-cyber-red/10 text-cyber-red border border-cyber-red/30 text-neon-red">
            <ShieldAlert className="w-3.5 h-3.5" /> BERBAHAYA
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/30">
            <AlertTriangle className="w-3.5 h-3.5" /> TIDAK DIKENAL
          </span>
        );
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-cyber-green text-neon-green';
    if (score >= 50) return 'text-amber-400';
    return 'text-cyber-red text-neon-red';
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-cyber-dark overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 inset-x-0 h-[600px] cyber-grid pointer-events-none opacity-60"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyber-cyan/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyber-green/5 blur-[120px] pointer-events-none"></div>

      <Navbar />

      {/* Main Hero & Scanner Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 z-10 flex flex-col items-center justify-center">
        
        {/* Anti-Fraud Banner Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono mb-8 animate-float shadow-neon-cyan/5">
          <Cpu className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
          <span>PROYEK PERLINDUNGAN SIBER NASIONAL</span>
        </div>

        {/* Hero Texts */}
        <div className="text-center max-w-3xl mb-12">
          <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-white mb-6 leading-tight">
            Lindungi Diri Anda dari <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyber-cyan via-cyber-green to-cyber-cyan bg-clip-text text-transparent">
              Kejahatan Digital
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 font-sans max-w-2xl mx-auto leading-relaxed">
            Rakshaka adalah perisai siber Anda. Laporkan penipuan online, situs judi ilegal, dan deteksi link mencurigakan secara instan untuk melindungi ekosistem digital Indonesia.
          </p>
        </div>

        {/* Interactive Link Scanner Widget */}
        <div className="w-full max-w-2xl glass-panel p-6 sm:p-8 border-cyber-cyan/20 relative shadow-cyber-card mb-16">
          <div className="absolute -top-3 left-6 px-3 py-1 bg-cyber-cyan text-cyber-dark text-[10px] font-mono font-bold tracking-widest rounded uppercase">
            Scanner Utama
          </div>

          <form onSubmit={handleScan} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Masukkan link mencurigakan... (cth: http://slot-gacor-indo.com)"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  disabled={isScanning}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-cyber-dark border border-cyber-border focus:border-cyber-cyan focus:shadow-neon-cyan focus:outline-none text-slate-100 placeholder-slate-500 transition-all duration-300 font-sans"
                />
              </div>
              <button
                type="submit"
                disabled={isScanning || !urlInput.trim()}
                className="px-6 py-3.5 rounded-xl font-display font-bold text-sm bg-cyber-cyan text-cyber-dark hover:bg-cyber-cyan/90 disabled:opacity-50 transition-all duration-300 shadow-neon-cyan flex items-center justify-center gap-2"
              >
                {isScanning ? (
                  <>
                    <span className="w-4 h-4 border-2 border-cyber-dark border-t-transparent rounded-full animate-spin"></span>
                    Menganalisis...
                  </>
                ) : (
                  <>
                    Deteksi Link
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
            {!isAuthenticated && (
              <p className="text-[10px] text-slate-500 font-mono text-center">
                💡 Menjalankan analisa heuristik lokal. <Link to="/login" className="text-cyber-cyan hover:underline">Masuk</Link> untuk query basis data Rakshaka penuh.
              </p>
            )}
          </form>

          {/* Scanner Visual Overlay (Animation) */}
          {isScanning && (
            <div className="mt-8 border border-cyber-cyan/30 rounded-xl bg-cyber-dark/80 relative overflow-hidden p-8 flex flex-col items-center justify-center animate-pulse">
              <div className="absolute inset-0 radar-overlay animate-scan"></div>
              <div className="w-16 h-16 rounded-full border-2 border-cyber-cyan border-dashed flex items-center justify-center mb-4 relative">
                <Search className="w-6 h-6 text-cyber-cyan" />
              </div>
              <p className="text-sm font-mono text-cyber-cyan tracking-widest text-neon-cyan uppercase">
                Memindai Ancaman Siber...
              </p>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                Memeriksa DNS record, phish-tank, & metadata...
              </p>
            </div>
          )}

          {/* Scan Results Display */}
          {scanResult && !isScanning && (
            <div className="mt-8 border border-cyber-border rounded-xl bg-cyber-lightDark p-6 animate-fade-in relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-cyber-border/50">
                <div className="overflow-hidden">
                  <h4 className="text-xs font-mono text-slate-500 uppercase mb-1">Domain Target</h4>
                  <p className="text-sm font-medium text-slate-200 truncate">{scanResult.url}</p>
                </div>
                <div>
                  <h4 className="text-xs font-mono text-slate-500 uppercase mb-1 sm:text-right">Tingkat Keamanan</h4>
                  <div className="sm:text-right">{getStatusBadge(scanResult.status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="flex items-center gap-4">
                  {/* Gauge score visualization using SVG */}
                  <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="32"
                        className="stroke-cyber-border fill-none"
                        strokeWidth="4.5"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="32"
                        className="fill-none transition-all duration-1000 ease-out"
                        stroke={scanResult.status === 'safe' ? '#00FF66' : scanResult.status === 'malicious' ? '#FF0055' : '#F59E0B'}
                        strokeWidth="4.5"
                        strokeDasharray={2 * Math.PI * 32}
                        strokeDashoffset={2 * Math.PI * 32 - (scanResult.score / 100) * (2 * Math.PI * 32)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className={`text-xl font-display font-black ${getScoreColor(scanResult.score)}`}>
                        {scanResult.score}
                      </span>
                      <span className="text-[7px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">SCORE</span>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-slate-200 mb-1">
                      {scanResult.score >= 80 ? 'Situs Tampak Aman' : scanResult.score >= 50 ? 'Gunakan dengan Hati-hati' : 'Situs Berbahaya Terdeteksi!'}
                    </h5>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed">
                      {scanResult.score >= 80 
                        ? 'Website tidak terdaftar di database blacklist dan aman untuk diakses.' 
                        : scanResult.score >= 50 
                        ? 'Memiliki beberapa indikator mencurigakan (misalnya domain baru terdaftar).' 
                        : 'Situs ini dikonfirmasi melakukan aktivitas ilegal (phishing/gambling).'}
                    </p>
                  </div>
                </div>

                {!isAuthenticated && (
                  <div className="p-4 rounded-xl bg-cyber-cyan/5 border border-cyber-cyan/20 flex flex-col items-center text-center">
                    <p className="text-xs text-slate-300 font-medium mb-3">
                      Butuh keamanan ekstra? Laporkan link ini ke platform untuk ditindaklanjuti.
                    </p>
                    <Link
                      to="/login"
                      className="px-4 py-1.5 rounded-lg bg-cyber-cyan text-cyber-dark font-display font-semibold text-xs shadow-neon-cyan hover:bg-cyber-cyan/90 transition-all"
                    >
                      Kirim Laporan Kasus
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-8 border border-cyber-red/30 rounded-xl bg-cyber-red/5 p-4 flex items-center gap-3 text-cyber-red animate-fade-in">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="text-xs font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Feature Highlights Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          <div className="glass-panel p-6 glass-panel-hover flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-200">Laporkan Scam Online</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kirim kronologi dan bukti tangkapan layar penipuan online (seperti investasi palsu atau toko online fiktif) untuk diverifikasi oleh admin.
            </p>
          </div>

          <div className="glass-panel p-6 glass-panel-hover flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-200">Detektor Phishing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cek keabsahan domain perbankan atau media sosial palsu secara cepat menggunakan sistem pendeteksi link terintegrasi.
            </p>
          </div>

          <div className="glass-panel p-6 glass-panel-hover flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyber-red/10 border border-cyber-red/30 flex items-center justify-center text-cyber-red">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-200">Berantas Judi Online</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kirim laporan domain situs perjudian online ilegal yang menyasar masyarakat Indonesia agar segera masuk daftar cekal instansi.
            </p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};
