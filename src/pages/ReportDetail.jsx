import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { 
  ArrowLeft, 
  Calendar, 
  ShieldAlert, 
  AlertCircle, 
  Image as ImageIcon,
  Loader
} from 'lucide-react';

export const ReportDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [report, setReport] = useState(location.state?.report || null);
  const [loading, setLoading] = useState(!report);
  const [error, setError] = useState('');

  useEffect(() => {
    // If report is already available via state, we don't need to fetch it
    if (report) {
      setLoading(false);
      return;
    }

    // Otherwise, try to fetch it if authenticated
    const fetchReport = async () => {
      if (!isAuthenticated) {
        setError('Detail laporan hanya dapat diambil langsung jika Anda sudah login. Silakan kembali ke daftar laporan.');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const res = await api.getReport(id);
        if (res.success && res.data) {
          setReport(res.data);
        } else {
          setError('Laporan tidak ditemukan.');
        }
      } catch (err) {
        console.error(err);
        setError('Gagal memuat detail laporan.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id, report, isAuthenticated]);

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'scam':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <ShieldAlert className="w-3.5 h-3.5" /> Scam
          </span>
        );
      case 'phishing':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20">
            <ShieldAlert className="w-3.5 h-3.5" /> Phishing
          </span>
        );
      case 'judol':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyber-red/10 text-cyber-red border border-cyber-red/20">
            <ShieldAlert className="w-3.5 h-3.5" /> Judol
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            <ShieldAlert className="w-3.5 h-3.5" /> Unknown
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString.replace(' ', 'T'));
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-[80px]">
      {/* If this is accessed by a guest, Navbar should be shown */}
      {!isAuthenticated && <Navbar />}

      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl animate-page-entrance">
        {/* Header / Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-cyber-cyan transition-colors mb-8 group"
        >
          <div className="p-2 rounded-xl bg-cyber-card border border-cyber-border group-hover:border-cyber-cyan/50 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="font-mono text-sm uppercase tracking-wider font-semibold">Kembali</span>
        </button>

        {loading ? (
          <div className="h-[400px] border border-cyber-border rounded-2xl bg-cyber-card/30 flex flex-col items-center justify-center">
            <Loader className="w-8 h-8 text-cyber-cyan animate-spin mb-4" />
            <p className="text-sm font-mono text-slate-500 uppercase tracking-widest">Mengunduh Data Laporan...</p>
          </div>
        ) : error ? (
          <div className="glass-panel p-8 border-cyber-red/30 text-center flex flex-col items-center">
            <AlertCircle className="w-12 h-12 text-cyber-red mb-4" />
            <h2 className="text-xl font-display font-bold text-app-text mb-2">Terjadi Kesalahan</h2>
            <p className="text-slate-400 mb-6">{error}</p>
            <button 
              onClick={() => navigate('/reports')}
              className="px-6 py-3 rounded-xl bg-cyber-lightDark border border-cyber-border text-app-text hover:text-cyber-cyan hover:border-cyber-cyan transition-colors font-mono text-sm uppercase tracking-wider font-bold"
            >
              Lihat Laporan Publik
            </button>
          </div>
        ) : report ? (
          <div className="space-y-8">
            {/* Title & Meta Header */}
            <div className="glass-panel p-8 border-cyber-border relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-slate-800 opacity-20 pointer-events-none">
                <ShieldAlert className="w-32 h-32" />
              </div>
              
              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  {getCategoryBadge(report.category)}
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(report.created_at)}
                  </div>
                  <div className="text-xs font-mono text-slate-500 border-l border-cyber-border pl-4">
                    ID: {report.id}
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-display font-black text-app-text mb-6">
                  {report.title}
                </h1>
                
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-sm font-mono text-slate-400 uppercase tracking-widest mb-3 border-b border-cyber-border/50 pb-2">Deskripsi Kasus</h3>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap font-sans text-base">
                    {report.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Evidence Images */}
            <div className="glass-panel p-8 border-cyber-border">
              <h3 className="text-sm font-mono text-slate-400 uppercase tracking-widest mb-6 border-b border-cyber-border/50 pb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Bukti Lampiran ({report.images?.length || 0})
              </h3>
              
              {report.images && report.images.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {report.images.map((img) => (
                    <div 
                      key={img.id} 
                      className="aspect-video rounded-xl overflow-hidden border border-cyber-border bg-cyber-lightDark group cursor-pointer relative"
                      onClick={() => window.open(img.image_url, '_blank')}
                    >
                      <img 
                        src={img.image_url} 
                        alt="Bukti Laporan" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-cyber-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <span className="text-xs font-mono font-bold uppercase tracking-widest text-app-text bg-cyber-card/80 px-3 py-1.5 rounded-lg border border-cyber-border">
                          Lihat Penuh
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 border border-dashed border-cyber-border/50 rounded-xl bg-cyber-card/20">
                  <ImageIcon className="w-8 h-8 text-slate-600 mb-3" />
                  <p className="text-sm text-slate-500 font-mono">Tidak ada bukti gambar dilampirkan.</p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </main>
      
      {/* If this is accessed by a guest, Footer should be shown */}
      {!isAuthenticated && <Footer />}
    </div>
  );
};
