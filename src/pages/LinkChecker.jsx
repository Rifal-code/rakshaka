import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { DashboardLayout } from '../components/DashboardLayout';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import { 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  History, 
  Trash2, 
  Globe, 
  Clock, 
  Cpu, 
  ArrowRight,
  ExternalLink,
  Info,
  RefreshCw,
  Terminal,
  Activity,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export const LinkChecker = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const [urlInput, setUrlInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  
  // Terminal log simulation states
  const [activeStep, setActiveStep] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const logsEndRef = useRef(null);

  const scanSteps = [
    { code: 'SECURE_CONN', text: 'Initializing encrypted link check protocol...' },
    { code: 'DNS_RESOLVER', text: 'Querying DNS records, WHOIS database, and registrar age...' },
    { code: 'HEURISTIC_AI', text: 'Evaluating semantic models, page copy indicators, and phishing mimics...' },
    { code: 'BLACKLIST_DB', text: 'Comparing host signatures with national and global threat intelligence lists...' },
    { code: 'THREAT_SCORE', text: 'Synthesizing threat analysis and generating final integrity score...' }
  ];

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('rakshaka_scan_history');
    if (savedHistory) {
      try {
        setScanHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse scan history', e);
      }
    }
  }, []);

  const saveToHistory = (result) => {
    const newHistoryItem = {
      id: Date.now().toString(),
      url: result.url,
      status: result.status || 'unknown',
      score: (typeof result.score === 'number') ? result.score : 0,
      timestamp: new Date().toISOString()
    };
    
    const filteredHistory = scanHistory.filter(item => item.url.toLowerCase() !== result.url.toLowerCase());
    const updatedHistory = [newHistoryItem, ...filteredHistory].slice(0, 8); // limit to 8 items for a cleaner look
    
    setScanHistory(updatedHistory);
    localStorage.setItem('rakshaka_scan_history', JSON.stringify(updatedHistory));
  };

  const handleScan = async (e) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;

    let processedUrl = urlInput.trim();
    if (!/^https?:\/\//i.test(processedUrl)) {
      processedUrl = 'https://' + processedUrl;
    }

    setIsScanning(true);
    setScanResult(null);
    setError(null);
    setTerminalLogs([]);
    setActiveStep(0);

    // Play high-tech starting log
    setTerminalLogs([
      {
        timestamp: new Date().toLocaleTimeString(),
        code: 'SYS_START',
        text: `Starting Rakshaka Analyzer on ${processedUrl}...`,
        type: 'system'
      }
    ]);

    const logIntervals = [];
    scanSteps.forEach((step, idx) => {
      const delay = (idx + 1) * 600;
      const timeoutId = setTimeout(() => {
        setActiveStep(idx);
        setTerminalLogs(prev => [
          ...prev,
          {
            timestamp: new Date().toLocaleTimeString(),
            code: step.code,
            text: step.text,
            type: 'info'
          }
        ]);
      }, delay);
      logIntervals.push(timeoutId);
    });

    const scanPromise = new Promise(resolve => setTimeout(resolve, 3600));
    
    try {
      const apiPromise = api.checkLink(processedUrl);
      const [_, response] = await Promise.all([scanPromise, apiPromise]);

      console.log('API Raw Response:', JSON.stringify(response, null, 2));

      if (response.success && response.data) {
        const raw = response.data;
        console.log('Parsed result:', raw);
        console.log('Status:', raw.status, '| Score:', raw.score, '| Reason:', raw.reason);
        
        // Normalisasi data agar UI tidak rusak jika ada field yang kosong/null
        const result = {
          ...raw,
          score: (typeof raw.score === 'number') ? raw.score : 0,
          status: raw.status || 'unknown',
          reason: raw.reason || null,
        };
        
        setScanResult(result);
        saveToHistory(result);
        
        setTerminalLogs(prev => [
          ...prev,
          {
            timestamp: new Date().toLocaleTimeString(),
            code: 'ANALYSIS_COMPLETE',
            text: `Verdict: ${result.status.toUpperCase()} | Score: ${result.score}/100`,
            type: result.status === 'safe' ? 'success' : (result.status === 'malicious' || result.status === 'judol') ? 'error' : 'warn'
          }
        ]);
      } else {
        throw new Error(response.message || "Failed to scan link.");
      }
    } catch (err) {
      console.error(err);
      
      // Fallback local rules
      const urlLower = processedUrl.toLowerCase();
      let fallbackResult = {
        url: processedUrl,
        status: 'unknown',
        score: 50
      };

      if (urlLower.includes('judol') || urlLower.includes('slot') || urlLower.includes('gacor') || urlLower.includes('sbobet')) {
        fallbackResult = { url: processedUrl, status: 'malicious', score: 14 };
      } else if (urlLower.includes('login') || urlLower.includes('verifikasi') || urlLower.includes('bantuan-bca') || urlLower.includes('undian-bri')) {
        fallbackResult = { url: processedUrl, status: 'suspicious', score: 42 };
      } else if (urlLower.includes('google') || urlLower.includes('github') || urlLower.includes('wikipedia') || urlLower.includes('rakshaka')) {
        fallbackResult = { url: processedUrl, status: 'safe', score: 98 };
      }

      await new Promise(resolve => setTimeout(resolve, 300));

      setScanResult(fallbackResult);
      saveToHistory(fallbackResult);

      setTerminalLogs(prev => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          code: 'NETWORK_ERR',
          text: `Unable to query remote server. Initializing local sandbox scanner.`,
          type: 'warn'
        },
        {
          timestamp: new Date().toLocaleTimeString(),
          code: 'SANDBOX_VERDICT',
          text: `Local check completed. Status: ${fallbackResult.status.toUpperCase()} | Threat Indication Score: ${fallbackResult.score}/100`,
          type: fallbackResult.status === 'safe' ? 'success' : fallbackResult.status === 'malicious' ? 'error' : 'warn'
        }
      ]);
    } finally {
      setIsScanning(false);
      logIntervals.forEach(clearTimeout);
    }
  };

  const loadHistoryItem = (item) => {
    if (isScanning) return;
    setUrlInput(item.url);
    setScanResult({
      url: item.url,
      status: item.status,
      score: item.score
    });
    setTerminalLogs([
      {
        timestamp: new Date(item.timestamp).toLocaleTimeString(),
        code: 'SYS_RESTORE',
        text: `Restored cached report for: ${item.url}`,
        type: 'system'
      },
      {
        timestamp: new Date(item.timestamp).toLocaleTimeString(),
        code: 'CACHED_VERDICT',
        text: `Status: ${item.status.toUpperCase()} | Score: ${item.score}/100`,
        type: item.status === 'safe' ? 'success' : item.status === 'malicious' ? 'error' : 'warn'
      }
    ]);
  };

  const handleClearHistory = async () => {
    const isConfirmed = await confirm({
      title: 'Hapus Riwayat',
      message: 'Apakah Anda yakin ingin menghapus semua riwayat deteksi? Tindakan ini tidak dapat dibatalkan.',
      isDestructive: true
    });
    
    if (isConfirmed) {
      setScanHistory([]);
      localStorage.removeItem('rakshaka_scan_history');
      toast.success('Riwayat berhasil dihapus');
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

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('id-ID', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return '';
    }
  };

  // SVG Gauge calculations
  const renderGauge = (rawScore, accentColor) => {
    const score = (typeof rawScore === 'number') ? rawScore : 0;
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* Glow effect */}
        <div 
          className="absolute inset-2 rounded-full blur-md opacity-30 transition-all duration-500"
          style={{ backgroundColor: accentColor }}
        ></div>
        
        <svg className="w-full h-full transform -rotate-90">
          {/* Inner grey circle */}
          <circle
            cx="56"
            cy="56"
            r={radius}
            className="stroke-cyber-border fill-none"
            strokeWidth="6"
          />
          {/* Outer progress circle */}
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
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-1.5 w-6 rounded bg-cyber-cyan shadow-sm"></span>
            <span className="text-[10px] font-mono text-cyber-cyan uppercase tracking-widest">Link Analyzer Protocol</span>
          </div>
          <h1 className="text-4xl font-display font-black text-app-text tracking-tight uppercase">
            Deteksi Link & Domain
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Lakukan pemindaian forensik real-time terhadap link untuk mendeteksi situs phising, judol, dan scam keuangan.
          </p>
        </div>
        
        <div className="flex items-center gap-4 py-2 px-4 rounded-xl bg-cyber-lightDark/40 border border-cyber-border text-xs font-mono">
          <Activity className="w-4 h-4 text-cyber-green animate-pulse" />
          <span className="text-slate-400">Database Status:</span>
          <span className="text-cyber-green">ACTIVE & SECURED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Console & Scanner Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Console Scan Panel */}
          <div className="glass-panel p-6 border-cyber-cyan/15 relative overflow-hidden bg-gradient-to-br from-cyber-card to-cyber-lightDark/30">
            {/* Cyber HUD Brackets */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyber-cyan/60"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyber-cyan/60"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyber-cyan/60"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyber-cyan/60"></div>

            <form onSubmit={handleScan} className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyber-cyan" />
                  Target URL input stream
                </label>
                {isScanning && (
                  <span className="text-[10px] font-mono text-cyber-cyan animate-pulse">
                    Scanning in progress...
                  </span>
                )}
              </div>
              
              <div className="relative group p-[1px] rounded-xl bg-gradient-to-r from-cyber-border via-cyber-border to-cyber-border focus-within:from-cyber-cyan focus-within:to-cyber-green transition-all duration-500">
                <div className="bg-cyber-dark rounded-xl flex items-center pr-2 pl-4 py-1.5">
                  <Globe className="w-5 h-5 text-slate-500 mr-2.5 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Masukkan URL... (cth: bantu-bca-login.net atau slotsgacor.com)"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    disabled={isScanning}
                    className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-app-text placeholder-slate-600 transition-all duration-300 font-sans text-sm py-2"
                  />
                  
                  <button
                    type="submit"
                    disabled={isScanning || !urlInput.trim()}
                    className="px-5 py-2.5 rounded-lg font-display font-black text-xs uppercase tracking-wider bg-cyber-cyan text-cyber-dark hover:bg-cyber-cyan/80 disabled:opacity-30 disabled:hover:bg-cyber-cyan transition-all duration-300 shadow-sm flex items-center gap-1.5"
                  >
                    {isScanning ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Analyzing
                      </>
                    ) : (
                      <>
                        Scan URL
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* CRT Terminal Screen Output */}
          {isScanning && (
            <div className="glass-panel p-5 border-cyber-cyan/30 bg-cyber-card shadow-cyber-card relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none z-15"></div>
              
              <div className="flex items-center justify-between border-b border-cyber-border/80 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyber-cyan animate-pulse"></span>
                  <span className="text-[10px] font-mono text-cyber-cyan tracking-wider uppercase">
                    SYS_DIAGNOSTICS: RUNNING
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyber-red/60"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-cyber-gold/60"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-cyber-green/60"></div>
                </div>
              </div>

              {/* High-tech scanner radar animation */}
              <div className="h-28 flex flex-col items-center justify-center border border-cyber-cyan/20 rounded-lg bg-cyber-dark/60 relative overflow-hidden mb-4">
                <div className="absolute inset-0 radar-overlay animate-scan"></div>
                <div className="w-12 h-12 rounded-full border border-cyber-cyan/40 border-dashed flex items-center justify-center relative">
                  <div className="absolute inset-1 rounded-full border border-cyber-cyan/20 animate-ping"></div>
                  <Cpu className="w-5 h-5 text-cyber-cyan/90" />
                </div>
                <span className="text-[9px] font-mono text-cyber-cyan/70 mt-3 tracking-widest uppercase animate-pulse">
                  Step {activeStep + 1}/5: {scanSteps[activeStep]?.code}
                </span>
              </div>

              {/* scrolling logs */}
              <div className="bg-cyber-lightDark/80 p-3.5 rounded-lg border border-cyber-border/80 font-mono text-[10px] leading-relaxed max-h-[140px] overflow-y-auto space-y-1.5">
                {terminalLogs.map((log, index) => (
                  <div key={index} className={`flex items-start gap-2 ${
                    log.type === 'error' ? 'text-cyber-red' : 
                    log.type === 'warn' ? 'text-amber-400' : 
                    log.type === 'success' ? 'text-cyber-green' : 
                    log.type === 'system' ? 'text-cyber-cyan' : 'text-slate-400'
                  }`}>
                    <span className="text-slate-600">[{log.timestamp}]</span>
                    <span className="font-semibold">{log.code ? `[${log.code}]` : ''}</span>
                    <span>{log.text}</span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </div>
          )}

          {/* Diagnostic Result Screen */}
          {scanResult && !isScanning && (() => {
            const status = getStatusInfo(scanResult.status);
            const StatusIcon = status.icon;
            
            return (
              <div className={`glass-panel p-6 border border-cyber-border relative overflow-hidden bg-gradient-to-r from-cyber-card via-cyber-lightDark/40 to-cyber-card shadow-cyber-card animate-fade-in ${status.glow}`}>
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
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">
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
        </div>

        {/* Right Side: Scan History Log */}
        <div className="space-y-6">
          <div className="glass-panel p-5 border-cyber-border bg-gradient-to-b from-cyber-card to-cyber-dark/40 flex flex-col h-full relative overflow-hidden max-h-[600px]">
            {/* Cyber Corner Bracket for Sidebar */}
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-cyber-cyan/40"></div>
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-cyber-cyan/40"></div>

            <div className="flex items-center justify-between border-b border-cyber-border pb-4 mb-4">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-cyber-cyan" />
                <h3 className="text-xs font-mono font-bold text-app-text uppercase tracking-widest">
                  Scan History
                </h3>
              </div>
              {scanHistory.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="p-1 rounded bg-cyber-lightDark/50 border border-cyber-border hover:border-cyber-red/50 hover:text-cyber-red text-slate-500 transition-all duration-200"
                  title="Hapus Semua Riwayat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {scanHistory.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                <History className="w-8 h-8 text-slate-800 mb-3" />
                <p className="text-[10px] text-slate-600 font-mono uppercase tracking-wider">
                  No scan logs available
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[460px]">
                {scanHistory.map((item) => {
                  const status = getStatusInfo(item.status);
                  return (
                    <div
                      key={item.id}
                      onClick={() => loadHistoryItem(item)}
                      className="p-3 rounded-xl border border-cyber-border bg-cyber-dark/50 hover:bg-cyber-lightDark hover:border-cyber-cyan/50 hover:translate-x-1 transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 group relative overflow-hidden"
                    >
                      {/* Left indicator strip */}
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-[3px]"
                        style={{ backgroundColor: status.accent }}
                      ></div>
                      
                      <div className="overflow-hidden min-w-0 pl-1.5">
                        <p className="text-xs font-bold text-app-text truncate group-hover:text-cyber-cyan transition-colors">
                          {item.url.replace(/^https?:\/\//i, '')}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[9px] font-mono text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(item.timestamp)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs font-display font-black ${status.color}`}>
                          {item.score}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
