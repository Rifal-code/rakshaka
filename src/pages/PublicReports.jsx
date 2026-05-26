import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Calendar, ChevronLeft, ChevronRight, FileText, Loader, Search, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const categoryMeta = {
  scam: {
    label: 'Scam',
    className: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  },
  phishing: {
    label: 'Phishing',
    className: 'bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/20',
  },
  judol: {
    label: 'Judol',
    className: 'bg-cyber-red/10 text-cyber-red border-cyber-red/20',
  },
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    return new Date(dateString.replace(' ', 'T')).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

const getReportImage = (report) => {
  return report.images?.[0]?.image_url || null;
};

const PublicReportCard = ({ report }) => {
  const meta = categoryMeta[report.category] || {
    label: report.category || 'Unknown',
    className: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
  };
  const imageUrl = getReportImage(report);

  return (
    <article className="glass-panel overflow-hidden flex flex-col h-full hover:border-cyber-cyan/40 transition-all duration-300">
      <div className="relative h-44 bg-cyber-lightDark border-b border-cyber-border overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={report.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <ShieldAlert className="w-9 h-9" />
          </div>
        )}
        <span className={`absolute top-4 left-4 px-2.5 py-1 rounded-full text-xs font-semibold border ${meta.className}`}>
          {meta.label}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 mb-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(report.created_at)}</span>
        </div>
        <h3 className="text-base font-bold text-app-text leading-snug line-clamp-2 mb-2">
          {report.title}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-4">
          {report.description}
        </p>
      </div>
    </article>
  );
};

export const PublicReports = () => {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const perPage = 9;

  useEffect(() => {
    let isMounted = true;

    const fetchReports = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.getPublicReports(page, perPage);
        if (!isMounted) return;
        const payload = response.data || {};
        setReports(payload.data || []);
        setTotalPages(payload.total_pages || 1);
      } catch {
        if (!isMounted) return;
        setReports([]);
        setTotalPages(1);
        setError('Data laporan publik belum tersedia. Backend perlu membuka endpoint publik untuk daftar laporan.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReports();

    return () => {
      isMounted = false;
    };
  }, [page]);

  const stats = useMemo(() => {
    return reports.reduce(
      (acc, report) => {
        acc.total += 1;
        if (report.category && acc[report.category] !== undefined) acc[report.category] += 1;
        return acc;
      },
      { total: 0, scam: 0, phishing: 0, judol: 0 }
    );
  }, [reports]);

  return (
    <div className="min-h-screen flex flex-col bg-cyber-dark">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/20 text-cyber-cyan text-xs font-mono mb-4">
              <FileText className="w-4 h-4" />
              Basis Data Laporan Publik
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-app-text">
              Semua Laporan Terverifikasi
            </h1>
            <p className="text-sm text-slate-500 max-w-2xl mt-2">
              Pantau laporan scam, phishing, dan judi online terbaru yang dikirim komunitas Rakshaka.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2 w-full lg:w-auto">
            {[
              ['Total', stats.total],
              ['Scam', stats.scam],
              ['Phishing', stats.phishing],
              ['Judol', stats.judol],
            ].map(([label, value]) => (
              <div key={label} className="glass-panel px-4 py-3 text-center">
                <div className="text-lg font-display font-black text-app-text">{value}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="border border-cyber-red/30 rounded-xl bg-cyber-red/5 p-4 flex items-start gap-3 text-cyber-red mb-6">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-xs font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="glass-panel h-72 flex flex-col items-center justify-center">
            <Loader className="w-8 h-8 text-cyber-cyan animate-spin mb-3" />
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Memuat laporan publik...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="glass-panel border-dashed p-12 text-center flex flex-col items-center">
            <Search className="w-10 h-10 text-slate-400 mb-4" />
            <h2 className="text-lg font-bold text-app-text">Belum Ada Laporan Publik</h2>
            <p className="text-sm text-slate-500 max-w-md mt-2">
              Laporan akan muncul di sini setelah API publik tersedia dan data laporan dapat dibaca tanpa login.
            </p>
            <Link to="/" className="mt-6 px-4 py-2 rounded-xl bg-cyber-cyan text-cyber-dark text-sm font-bold">
              Kembali ke Beranda
            </Link>
          </div>
        ) : (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => (
                <PublicReportCard key={report.id} report={report} />
              ))}
            </section>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="p-2.5 rounded-xl border border-cyber-border bg-cyber-card text-slate-500 hover:text-app-text disabled:opacity-40"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-mono text-slate-500">
                  Halaman {page} dari {totalPages}
                </span>
                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="p-2.5 rounded-xl border border-cyber-border bg-cyber-card text-slate-500 hover:text-app-text disabled:opacity-40"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export { PublicReportCard };
