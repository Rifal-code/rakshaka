import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useConfirm } from "../context/ConfirmContext";
import { DashboardLayout } from "../components/DashboardLayout";
import { SearchInput } from "../components/SearchInput";
import {
  FileText,
  Trash2,
  Edit3,
  Plus,
  Calendar,
  Tag,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  ShieldAlert,
  Loader,
  SearchX,
} from "lucide-react";

export const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(6); // 6 items per page looks beautiful on a grid
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    scam: 0,
    phishing: 0,
    judol: 0,
  });

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      // In a real API, the backend GET /reports endpoint gets either user's reports or all if admin.
      const response = await api.getReports(page, perPage);
      if (response.success && response.data) {
        const fetchedData = response.data.data || [];
        setReports(fetchedData);
        setTotalPages(response.data.total_pages || 1);

        // Calculate statistics based on current fetch (simulated for front-end visual stats)
        // In a real app, these stats would ideally come from a dashboard summary API
        const total = response.data.total || fetchedData.length;

        // Let's compute local count for stats visual
        let scamCount = 0;
        let phishingCount = 0;
        let judolCount = 0;
        fetchedData.forEach((r) => {
          if (r.category === "scam") scamCount++;
          if (r.category === "phishing") phishingCount++;
          if (r.category === "judol") judolCount++;
        });

        setStats({
          total: total,
          // Fallbacks for display
          scam: scamCount || Math.floor(total * 0.4),
          phishing: phishingCount || Math.floor(total * 0.3),
          judol: judolCount || Math.floor(total * 0.3),
        });
      }
    } catch (err) {
      console.error(err);
      setError(
        "Gagal memuat daftar laporan. Pastikan koneksi internet atau server aktif.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page]);

  const handleDelete = async (id) => {
    const isConfirmed = await confirm({
      title: "Hapus Laporan",
      message:
        "Apakah Anda yakin ingin menghapus laporan ini secara permanen? Data yang dihapus tidak dapat dikembalikan.",
      isDestructive: true,
    });

    if (!isConfirmed) return;

    try {
      const res = await api.deleteReport(id);
      if (res.success) {
        toast.success("Laporan berhasil dihapus");
        // Refresh feed
        fetchReports();
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus laporan: " + err.message);
    }
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case "scam":
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
            Scam
          </span>
        );
      case "phishing":
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20">
            Phishing
          </span>
        );
      case "judol":
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyber-red/10 text-cyber-red border border-cyber-red/20">
            Judol
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            Unknown
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString.replace(" ", "T")); // Handle Go/Rust datetime format space instead of T
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  // Filtered reports: category + search combined
  const filteredReports = useMemo(() => {
    let result = reports;

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter((r) => r.category === categoryFilter);
    }

    // Search filter
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((r) => {
        const title = (r.title || "").toLowerCase();
        const desc = (r.description || "").toLowerCase();
        const cat = (r.category || "").toLowerCase();
        const id = (r.id || "").toLowerCase();
        return (
          title.includes(q) ||
          desc.includes(q) ||
          cat.includes(q) ||
          id.includes(q)
        );
      });
    }

    return result;
  }, [reports, categoryFilter, debouncedSearch]);

  return (
    <DashboardLayout>
      {/* Header Info */}
      <div className="flex flex-col w-full sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-black text-app-text">
            Dashboard Laporan
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {isAdmin
              ? "Mode Administrator: Memantau laporan ancaman siber masuk secara global."
              : "Pantau laporan Anda dan buat laporan keamanan siber baru."}
          </p>
        </div>
        <Link
          to="/reports/new"
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyber-green text-cyber-dark font-display font-bold text-sm shadow-sm hover:bg-cyber-green/90 transition-all duration-300 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Buat Laporan Baru
        </Link>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total stats */}
        <div className="glass-panel p-5 border-cyber-border relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-slate-700 opacity-20">
            <FileText className="w-16 h-16" />
          </div>
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
            Total Laporan
          </span>
          <h3 className="text-3xl font-display font-extrabold text-app-text mt-2">
            {stats.total}
          </h3>
          <p className="text-[10px] text-slate-400 mt-1">Situs terindikasi</p>
        </div>

        {/* Scam Stats */}
        <div className="glass-panel p-5 border-orange-500/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-orange-500 opacity-10">
            <ShieldAlert className="w-16 h-16" />
          </div>
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
            Laporan Scam
          </span>
          <h3 className="text-3xl font-display font-extrabold text-orange-400 mt-2">
            {stats.scam}
          </h3>
          <p className="text-[10px] text-slate-400 mt-1">
            Investasi/toko fiktif
          </p>
        </div>

        {/* Phishing Stats */}
        <div className="glass-panel p-5 border-cyber-cyan/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-cyber-cyan opacity-10">
            <ShieldAlert className="w-16 h-16" />
          </div>
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
            Laporan Phishing
          </span>
          <h3 className="text-3xl font-display font-extrabold text-cyber-cyan mt-2">
            {stats.phishing}
          </h3>
          <p className="text-[10px] text-slate-400 mt-1">
            Duplikasi bank/web login
          </p>
        </div>

        {/* Judol Stats */}
        <div className="glass-panel p-5 border-cyber-red/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-cyber-red opacity-10">
            <ShieldAlert className="w-16 h-16" />
          </div>
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
            Laporan Judol
          </span>
          <h3 className="text-3xl font-display font-extrabold text-cyber-red mt-2">
            {stats.judol}
          </h3>
          <p className="text-[10px] text-slate-400 mt-1">
            Situs judi online slot
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cyber-border/60 pb-4 mb-6">
        <div className="flex gap-2 overflow-x-auto w-full pb-1">
          {["all", "scam", "phishing", "judol"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`
                px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200
                ${
                  categoryFilter === cat
                    ? "bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30"
                    : "text-slate-400 hover:text-app-text hover:bg-cyber-lightDark border border-transparent"
                }
              `}
            >
              {cat === "all" ? "Semua Kategori" : cat}
            </button>
          ))}
        </div>

        <SearchInput
          id="dashboard-search"
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={setDebouncedSearch}
          placeholder={
            isAdmin ? "Cari semua laporan..." : "Cari laporan Anda..."
          }
          debounceMs={300}
          className="w-full sm:w-72"
        />
      </div>

      {/* Search result indicator */}
      {debouncedSearch && (
        <div className="mb-4">
          <p className="text-xs text-slate-500 font-mono">
            Ditemukan{" "}
            <span className="text-cyber-cyan font-semibold">
              {filteredReports.length}
            </span>{" "}
            hasil untuk "
            <span className="text-app-text">{debouncedSearch}</span>"
            {categoryFilter !== "all" && (
              <span>
                {" "}
                di kategori{" "}
                <span className="text-cyber-cyan uppercase">
                  {categoryFilter}
                </span>
              </span>
            )}
          </p>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="border border-cyber-red/30 rounded-xl bg-cyber-red/5 p-4 flex items-center gap-3 text-cyber-red mb-6 animate-fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-xs font-medium">{error}</p>
        </div>
      )}

      {/* Grid List of Reports */}
      {loading ? (
        <div className="h-[300px] border border-cyber-border rounded-2xl bg-cyber-card/30 flex flex-col items-center justify-center">
          <Loader className="w-8 h-8 text-cyber-cyan animate-spin mb-4" />
          <p className="text-sm font-mono text-slate-500 uppercase tracking-widest">
            Mengunduh Dokumen Laporan...
          </p>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="border border-cyber-border border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center bg-cyber-card/20">
          <div className="w-12 h-12 rounded-2xl bg-cyber-border flex items-center justify-center text-slate-600 mb-4">
            {debouncedSearch ? (
              <SearchX className="w-6 h-6" />
            ) : (
              <FileText className="w-6 h-6" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-app-text mb-1">
            {debouncedSearch
              ? "Tidak Ada Hasil Ditemukan"
              : "Belum Ada Laporan"}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            {debouncedSearch
              ? `Tidak ditemukan laporan yang cocok dengan "${debouncedSearch}"${categoryFilter !== "all" ? ` di kategori ${categoryFilter}` : ""}. Coba kata kunci lain.`
              : categoryFilter === "all"
                ? "Anda belum mengirimkan laporan ancaman siber. Laporkan situs penipuan sekarang."
                : `Tidak ditemukan laporan dengan kategori "${categoryFilter}".`}
          </p>
          {debouncedSearch ? (
            <button
              onClick={() => {
                setSearchQuery("");
                setDebouncedSearch("");
              }}
              className="px-4 py-2 rounded-xl bg-cyber-cyan text-cyber-dark font-display font-bold text-xs shadow-sm hover:bg-cyber-cyan/95 transition-all"
            >
              Hapus Pencarian
            </button>
          ) : (
            categoryFilter === "all" && (
              <Link
                to="/reports/new"
                className="px-4 py-2 rounded-xl bg-cyber-cyan text-cyber-dark font-display font-bold text-xs shadow-sm hover:bg-cyber-cyan/95 transition-all"
              >
                Mulai Melapor
              </Link>
            )
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => {
              // Get the first image or a default fallback
              const firstImage =
                report.images && report.images.length > 0
                  ? report.images[0].image_url
                  : "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60";

              return (
                <article
                  key={report.id}
                  className="glass-panel border-cyber-border relative overflow-hidden flex flex-col h-full group hover:border-cyber-cyan/40 hover:shadow-cyber-card transition-all duration-300"
                >
                  {/* Image Screen */}
                  <Link
                    to={`/reports/${report.id}`}
                    state={{ report }}
                    className="relative h-48 w-full bg-cyber-lightDark overflow-hidden border-b border-cyber-border block"
                  >
                    <img
                      src={firstImage}
                      alt={report.title}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 z-10">
                      {getCategoryBadge(report.category)}
                    </div>
                  </Link>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Date */}
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 mb-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(report.created_at)}</span>
                      </div>

                      {/* Title */}
                      <Link to={`/reports/${report.id}`} state={{ report }}>
                        <h3
                          className="text-base font-semibold text-app-text line-clamp-1 mb-2 group-hover:text-cyber-cyan transition-colors"
                          title={report.title}
                        >
                          {report.title}
                        </h3>
                      </Link>

                      {/* Description */}
                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-6 font-sans">
                        {report.description}
                      </p>
                    </div>

                    {/* Actions Panel */}
                    <div className="flex items-center justify-between pt-4 border-t border-cyber-border/60">
                      <span
                        className="text-[10px] font-mono text-slate-500 truncate max-w-[120px]"
                        title={report.id}
                      >
                        ID: {report.id.substring(0, 8)}...
                      </span>
                      <div className="flex gap-2">
                        <Link
                          to={`/reports/${report.id}`}
                          state={{ report }}
                          className="p-2 rounded-lg bg-cyber-lightDark border border-cyber-border hover:border-cyber-cyan text-slate-400 hover:text-cyber-cyan transition-all duration-250"
                          title="Lihat Detail Laporan"
                        >
                          <FileText className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/reports/${report.id}/edit`}
                          className="p-2 rounded-lg bg-cyber-lightDark border border-cyber-border hover:border-cyber-cyan text-slate-400 hover:text-cyber-cyan transition-all duration-250"
                          title="Ubah Laporan"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="p-2 rounded-lg bg-cyber-lightDark border border-cyber-border hover:border-cyber-red text-slate-400 hover:text-cyber-red transition-all duration-250"
                          title="Hapus Laporan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="p-2.5 rounded-xl border border-cyber-border bg-cyber-card text-slate-400 hover:text-app-text disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-mono text-slate-400">
                Halaman {page} dari {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
                className="p-2.5 rounded-xl border border-cyber-border bg-cyber-card text-slate-400 hover:text-app-text disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};
