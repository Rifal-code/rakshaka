import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Search, 
  ChevronRight, 
  FileText, 
  Cpu,
  Loader,
  CheckCircle2,
  XCircle,
  Info,
  ExternalLink,
  Globe
} from 'lucide-react';
import { PublicReportCard } from './PublicReports';

export const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [urlInput, setUrlInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [latestReports, setLatestReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportsError, setReportsError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchLatestReports = async () => {
      setReportsLoading(true);
      setReportsError('');
      try {
        const response = await api.getPublicReports(1, 3);
        if (!isMounted) return;
        setLatestReports(response.data?.data || []);
      } catch {
        if (!isMounted) return;
        setLatestReports([]);
        setReportsError('Laporan publik belum tersedia.');
      } finally {
        if (isMounted) setReportsLoading(false);
      }
    };

    fetchLatestReports();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!urlInput.trim()) return;

    let processedUrl = urlInput.trim();
    if (!/^https?:\/\//i.test(processedUrl)) {
      processedUrl = 'https://' + processedUrl;
    }

    setIsScanning(true);
    setScanResult(null);
    setError(null);

    // Minimum scan time for the radar animation effect
    const scanPromise = new Promise(resolve => setTimeout(resolve, 2200));

    try {
      const apiPromise = api.checkLink(processedUrl);
      const [, response] = await Promise.all([scanPromise, apiPromise]);

      if (response.success && response.data) {
        const raw = response.data;
        const parsedScore = parseInt(raw.score, 10);
        const finalScore = !isNaN(parsedScore) ? parsedScore : 0;

        const result = {
          ...raw,
          score: finalScore,
          status: raw.status || 'unknown',
          reason: raw.reason || null,
        };
        setScanResult(result);
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

  const getStatusInfo = (status) => {
    switch (status) {
      case 'safe':
        return {
          label: 'AMAN / VERIFIED',
          color: 'text-cyber-green',
          bg: 'bg-cyber-green/10',
          border: 'border-cyber-green/30',
          glow: 'shadow-sm',
          icon: ShieldCheck,
          accent: 'var(--success-btn-color)'
        };
      case 'suspicious':
        return {
          label: 'MENCURIGAKAN / WARNING',
          color: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          glow: 'shadow-sm',
          icon: AlertTriangle,
          accent: 'rgb(var(--warning-rgb))'
        };
      case 'malicious':
        return {
          label: 'BERBAHAYA / THREAT',
          color: 'text-cyber-red',
          bg: 'bg-cyber-red/10',
          border: 'border-cyber-red/30',
          glow: 'shadow-sm',
          icon: ShieldAlert,
          accent: 'var(--danger-btn-color)'
        };
      case 'judol':
        return {
          label: 'JUDI ONLINE / JUDOL',
          color: 'text-cyber-red',
          bg: 'bg-cyber-red/10',
          border: 'border-cyber-red/30',
          glow: 'shadow-sm',
          icon: ShieldAlert,
          accent: 'var(--danger-btn-color)'
        };
      default:
        return {
          label: 'TIDAK DIKENAL / UNKNOWN',
          color: 'text-slate-400',
          bg: 'bg-slate-500/10',
          border: 'border-slate-500/30',
          glow: 'shadow-none',
          icon: Info,
          accent: 'var(--secondary-text-color)'
        };
    }
  };

  const renderGauge = (rawScore, accentColor) => {
    const score = (typeof rawScore === 'number') ? rawScore : 0;
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="relative w-28 h-28 flex items-center justify-center">
        <div 
          className="absolute inset-2 rounded-full blur-md opacity-30 transition-all duration-500"
          style={{ backgroundColor: accentColor }}
        ></div>
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="56"
            cy="56"
            r={radius}
            className="stroke-cyber-border fill-none"
            strokeWidth="6"
          />
          <circle
            cx="56"
            cy="56"
            r={radius}
            className="fill-none transition-all duration-1000 ease-out"
            stroke={accentColor}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-display font-black tracking-tight text-app-text leading-none">
            {score}
          </span>
          <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-1">SCORE</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-cyber-dark">
      {/* Background patterns */}
      <div className="absolute inset-0 dotted-grid pointer-events-none opacity-55"></div>

      <Navbar />

      {/* Main Hero & Scanner Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 z-10 flex flex-col items-center justify-center">
        
        {/* Anti-Fraud Banner Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono mb-8 animate-float shadow-sm">
          <Cpu className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
          <span>PROYEK PERLINDUNGAN SIBER NASIONAL</span>
        </div>

        {/* Hero Texts */}
        <div className="text-center max-w-3xl mb-12">
          <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-app-text mb-6 leading-tight">
            Lindungi Diri Anda dari <br className="hidden sm:inline" />
            <span className="text-cyber-cyan">
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
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-cyber-dark border border-cyber-border focus:border-cyber-cyan focus:ring-4 focus:ring-cyber-cyan/10 focus:outline-none text-app-text placeholder-slate-500 transition-all duration-300 font-sans"
                />
              </div>
              <button
                type="submit"
                disabled={isScanning || !urlInput.trim()}
                className="px-6 py-3.5 rounded-xl font-display font-bold text-sm bg-cyber-cyan text-cyber-dark hover:bg-cyber-cyan/90 disabled:opacity-50 transition-all duration-300 shadow-sm flex items-center justify-center gap-2"
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
                💡 Anda harus <Link to="/login" className="text-cyber-cyan hover:underline">Masuk</Link> terlebih dahulu untuk melakukan analisis tautan.
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
              <p className="text-sm font-mono text-cyber-cyan tracking-widest uppercase">
                Memindai Ancaman Siber...
              </p>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                Memeriksa DNS record, phish-tank, & metadata...
              </p>
            </div>
          )}

          {/* Scan Results Display */}
          {scanResult && !isScanning && (() => {
            const status = getStatusInfo(scanResult.status);
            const StatusIcon = status.icon;
            
            return (
              <div className={`mt-8 glass-panel p-6 border border-cyber-border relative overflow-hidden bg-gradient-to-r from-cyber-card via-cyber-lightDark/40 to-cyber-card shadow-cyber-card animate-fade-in ${status.glow}`}>
                {/* Cyber Brackets */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyber-border/60"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyber-border/60"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyber-border/60"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyber-border/60"></div>

                {/* Card Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-cyber-border/60">
                  <div className="overflow-hidden">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-0.5">SCAN TARGET</span>
                    <p className="text-sm font-semibold text-app-text truncate flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyber-cyan" />
                      {scanResult.url}
                    </p>
                  </div>
                  <div className="flex flex-col sm:items-end">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">SECURITY STATUS</span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-mono font-bold ${status.color} ${status.bg} border ${status.border}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.label}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center">
                  {/* Gauge Display */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-center p-3 border border-cyber-border rounded-xl bg-cyber-dark/60">
                    {renderGauge(scanResult.score, status.accent)}
                    <span className="text-[9px] font-mono text-slate-400 mt-2 uppercase tracking-wider">Integrity score</span>
                  </div>

                  {/* Verdict & Actions */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h4 className="text-base font-bold text-app-text flex items-center gap-1.5 mb-1.5">
                        {scanResult.status === 'safe' ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-cyber-green" />
                            Situs ini Tergolong Aman
                          </>
                        ) : scanResult.status === 'suspicious' ? (
                          <>
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                            Situs Kurang Terpercaya
                          </>
                        ) : scanResult.status === 'malicious' || scanResult.status === 'judol' ? (
                          <>
                            <XCircle className="w-4 h-4 text-cyber-red" />
                            {scanResult.status === 'judol' ? 'Situs Judi Online Terdeteksi!' : 'Ancaman Keamanan Siber Terdeteksi!'}
                          </>
                        ) : (
                          <>
                            <Info className="w-4 h-4 text-slate-400" />
                            Status Tidak Diketahui
                          </>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans text-left">
                        {scanResult.reason || (
                          scanResult.status === 'safe'
                            ? 'Tidak ada ancaman aktif atau riwayat berbahaya yang terdeteksi di database kami. Situs ini dapat digunakan secara normal.'
                            : scanResult.status === 'suspicious'
                            ? 'Situs memiliki indikator mencurigakan. Harap berhati-hati saat bertransaksi.'
                            : scanResult.status === 'malicious' || scanResult.status === 'judol'
                            ? 'Situs dikonfirmasi memuat aktivitas ilegal. Tutup tab Anda segera.'
                            : 'Tidak dapat menentukan status keamanan situs ini.'
                        )}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2.5 pt-2">
                      {scanResult.status !== 'safe' && (
                        <button
                          onClick={() => navigate('/reports/new', { 
                            state: { 
                              initialTitle: `Laporan Ancaman: ${scanResult.url.replace(/^https?:\/\//i, '')}`, 
                              initialDescription: `Menemukan tautan bermasalah di ${scanResult.url}. Berdasarkan pemindaian konsol Rakshaka, link ini memiliki skor keamanan ${scanResult.score}/100 dengan ancaman kategori ${scanResult.status}.`, 
                              initialCategory: scanResult.status === 'malicious' ? 'judol' : 'phishing' 
                            } 
                          })}
                          className="px-4 py-2 rounded-xl text-xs font-display font-black uppercase tracking-wider bg-cyber-red text-cyber-dark hover:bg-cyber-red/80 transition-all duration-300 shadow-sm flex items-center gap-1.5"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          Laporkan Link Ini
                        </button>
                      )}
                      <a
                        href={scanResult.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl text-xs font-display font-black uppercase tracking-wider bg-cyber-lightDark border border-cyber-border text-app-text hover:text-app-text hover:border-slate-500 transition-all duration-300 flex items-center gap-1.5"
                      >
                        Kunjungi Link
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

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
            <h3 className="text-lg font-semibold text-app-text">Laporkan Scam Online</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kirim kronologi dan bukti tangkapan layar penipuan online (seperti investasi palsu atau toko online fiktif) untuk diverifikasi oleh admin.
            </p>
          </div>

          <div className="glass-panel p-6 glass-panel-hover flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-app-text">Detektor Phishing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cek keabsahan domain perbankan atau media sosial palsu secara cepat menggunakan sistem pendeteksi link terintegrasi.
            </p>
          </div>

          <div className="glass-panel p-6 glass-panel-hover flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyber-red/10 border border-cyber-red/30 flex items-center justify-center text-cyber-red">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-app-text">Berantas Judi Online</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kirim laporan domain situs perjudian online ilegal yang menyasar masyarakat Indonesia agar segera masuk daftar cekal instansi.
            </p>
          </div>
        </section>

        {/* Latest Public Reports */}
        <section className="w-full max-w-6xl mt-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/20 text-cyber-cyan text-xs font-mono mb-3">
                <FileText className="w-4 h-4" />
                Laporan Komunitas
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-app-text">
                Laporan Terbaru
              </h2>
              <p className="text-sm text-slate-500 mt-1 max-w-xl">
                Data laporan terbaru dari masyarakat untuk membantu semua orang mengenali pola ancaman digital.
              </p>
            </div>
            <Link
              to="/reports"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyber-cyan text-cyber-dark text-sm font-display font-bold shadow-sm hover:bg-cyber-cyan/90 transition-all"
            >
              Lihat Semua Laporan
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {reportsLoading ? (
            <div className="glass-panel h-48 flex flex-col items-center justify-center">
              <Loader className="w-7 h-7 text-cyber-cyan animate-spin mb-3" />
              <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Memuat laporan terbaru...</p>
            </div>
          ) : latestReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestReports.map((report) => (
                <PublicReportCard key={report.id} report={report} />
              ))}
            </div>
          ) : (
            <div className="glass-panel border-dashed p-8 text-center">
              <h3 className="text-lg font-bold text-app-text">
                Belum Ada Laporan Publik
              </h3>
              <p className="text-sm text-slate-500 max-w-lg mx-auto mt-2">
                {reportsError || 'Laporan terbaru akan tampil di sini setelah API publik menyediakan data.'}
              </p>
            </div>
          )}
        </section>

      </main>

      <Footer />
    </div>
  );
};
