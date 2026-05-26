import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { uploadImage } from '../services/uploader';
import { DashboardLayout } from '../components/DashboardLayout';
import { 
  ShieldAlert, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Upload, 
  X, 
  AlertCircle,
  Clock,
  Tag,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

export const ReportForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form States
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('scam');
  const [description, setDescription] = useState('');
  
  // Array of image URLs already uploaded
  const [images, setImages] = useState([]);
  
  // Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  
  // Submit & Loading States
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Fetch report details if in edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchReportDetails = async () => {
      setLoading(true);
      try {
        const response = await api.getReport(id);
        if (response.success && response.data) {
          const report = response.data;
          setTitle(report.title);
          setCategory(report.category);
          setDescription(report.description);
          // Convert array of image objects [{id, image_url}] to array of strings [image_url]
          const imageUrls = report.images ? report.images.map(img => img.image_url) : [];
          setImages(imageUrls);
        }
      } catch (err) {
        console.error(err);
        setFormError('Gagal memuat detail laporan untuk diedit.');
      } finally {
        setLoading(false);
      }
    };

    fetchReportDetails();
  }, [id, isEditMode]);

  // Client Validation for current step
  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!title.trim() || title.length < 3 || title.length > 200) {
          return 'Judul laporan harus memiliki panjang 3 hingga 200 karakter.';
        }
        if (!['scam', 'phishing', 'judol'].includes(category)) {
          return 'Kategori laporan tidak valid.';
        }
        return '';
      case 2:
        if (!description.trim() || description.length < 10) {
          return 'Kronologi/Deskripsi laporan minimal harus memiliki panjang 10 karakter.';
        }
        return '';
      case 3:
        if (images.length > 3) {
          return 'Maksimal bukti gambar yang diperbolehkan adalah 3 gambar.';
        }
        return '';
      default:
        return '';
    }
  };

  const handleNext = () => {
    const errorMsg = validateStep();
    if (errorMsg) {
      setFormError(errorMsg);
      return;
    }
    setFormError('');
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setFormError('');
    setCurrentStep(prev => prev - 1);
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length >= 3) {
      setUploadError('Batas maksimum 3 bukti gambar telah tercapai.');
      return;
    }

    const file = files[0];
    // Basic file type validation
    if (!file.type.startsWith('image/')) {
      setUploadError('Tipe file harus berupa gambar.');
      return;
    }
    // Limit file size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ukuran gambar maksimal adalah 5MB.');
      return;
    }

    setUploadError('');
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const imageUrl = await uploadImage(file, (progress) => {
        setUploadProgress(progress);
      });
      
      setImages(prev => [...prev, imageUrl]);
    } catch (err) {
      console.error(err);
      setUploadError('Gagal mengunggah gambar. Silakan coba kembali.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError('');

    const reportData = {
      title,
      category,
      description,
      images,
    };

    try {
      let response;
      if (isEditMode) {
        response = await api.updateReport(id, reportData);
      } else {
        response = await api.createReport(reportData);
      }

      if (response.success) {
        navigate('/dashboard');
      } else {
        throw new Error(response.message || "Gagal menyimpan laporan.");
      }
    } catch (err) {
      console.error(err);
      setFormError(err.message || 'Gagal mengirimkan laporan. Periksa kelengkapan kolom Anda.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: 'Kategori & Judul' },
    { num: 2, label: 'Kronologi Detail' },
    { num: 3, label: 'Lampiran Bukti' },
    { num: 4, label: 'Review & Submit' }
  ];

  return (
    <DashboardLayout>
      {/* Header Back Button */}
      <div className="mb-8">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-cyber-cyan transition-colors text-xs font-mono tracking-widest uppercase"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>
        <h1 className="text-3xl font-display font-black text-white mt-4">
          {isEditMode ? 'Edit Laporan Kasus' : 'Laporkan Kasus Baru'}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {isEditMode 
            ? 'Perbarui rincian atau tambah lampiran bukti pada laporan Anda.' 
            : 'Laporkan tindak kejahatan siber yang Anda temukan untuk diverifikasi.'}
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="glass-panel p-6 border-cyber-border mb-8 max-w-3xl">
        <div className="flex justify-between items-center relative">
          {/* Connector Line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-cyber-border z-0">
            <div 
              className="stepper-line h-full transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>

          {/* Step Indicators */}
          {steps.map((s) => (
            <div key={s.num} className="flex flex-col items-center z-10">
              <div 
                className={`
                  w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm transition-all duration-300 border
                  ${currentStep > s.num 
                    ? 'bg-cyber-green border-cyber-green text-cyber-dark shadow-neon-green' 
                    : currentStep === s.num
                    ? 'bg-cyber-cyan border-cyber-cyan text-cyber-dark shadow-neon-cyan'
                    : 'bg-cyber-card border-cyber-border text-slate-500'
                  }
                `}
              >
                {currentStep > s.num ? <Check className="w-5 h-5" /> : s.num}
              </div>
              <span className={`text-[10px] font-mono mt-2 tracking-wide uppercase ${currentStep === s.num ? 'text-cyber-cyan font-bold' : 'text-slate-500'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Wizard Card */}
      <div className="glass-panel border-cyber-border max-w-3xl p-6 sm:p-8 relative shadow-cyber-card">
        {formError && (
          <div className="border border-cyber-red/30 rounded-xl bg-cyber-red/5 p-4 flex items-center gap-3 text-cyber-red mb-6 animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-xs font-medium">{formError}</p>
          </div>
        )}

        {/* STEP 1: Basic info */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                Pilih Kategori Kejahatan Siber
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'scam', label: 'Online Scam', desc: 'Investasi bodong, penipuan e-commerce, arisan fiktif' },
                  { id: 'phishing', label: 'Web Phishing', desc: 'Duplikasi web bank, web undian palsu, pencurian kredensial' },
                  { id: 'judol', label: 'Judi Online (Judol)', desc: 'Situs judi slot, sbobet, taruhan online ilegal' }
                ].map((catOption) => (
                  <button
                    key={catOption.id}
                    type="button"
                    onClick={() => setCategory(catOption.id)}
                    className={`
                      p-4 rounded-xl border text-left flex flex-col justify-between h-32 transition-all duration-300
                      ${category === catOption.id 
                        ? 'bg-cyber-cyan/10 border-cyber-cyan shadow-neon-cyan/5' 
                        : 'bg-cyber-dark/50 border-cyber-border hover:border-slate-700'
                      }
                    `}
                  >
                    <span className={`text-sm font-bold ${category === catOption.id ? 'text-cyber-cyan' : 'text-slate-300'}`}>
                      {catOption.label}
                    </span>
                    <span className="text-[10px] text-slate-500 leading-normal font-sans">
                      {catOption.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="title" className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                Judul Laporan / Kasus
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="cth: Penipuan Investasi Kripto Berkedok Telegram Group"
                className="w-full px-4 py-3 rounded-xl bg-cyber-dark border border-cyber-border focus:border-cyber-cyan focus:shadow-neon-cyan focus:outline-none text-slate-200 placeholder-slate-600 transition-all duration-350"
              />
              <span className="text-[10px] text-slate-500 block">
                Tuliskan ringkasan singkat dari modus penipuan (minimal 3 karakter, maksimal 200 karakter).
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: Detail description */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-2">
              <label htmlFor="description" className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                Kronologi Kejadian / Deskripsi Situs
              </label>
              <textarea
                id="description"
                rows="8"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tuliskan sedetail mungkin kronologi kejadian. Cth: Pelaku mengirimkan link chat berisi penawaran tugas harian berbayar. Ketika korban mengklik link tersebut..."
                className="w-full px-4 py-3 rounded-xl bg-cyber-dark border border-cyber-border focus:border-cyber-cyan focus:shadow-neon-cyan focus:outline-none text-slate-200 placeholder-slate-600 transition-all duration-350 font-sans resize-none"
              />
              <span className="text-[10px] text-slate-500 block">
                Bantu proses investigasi dengan menceritakan modus operandi, kerugian, nomor telepon/rekening pelaku (jika ada). Minimal 10 karakter.
              </span>
            </div>
          </div>
        )}

        {/* STEP 3: Images upload */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                Unggah Bukti Gambar / Screenshot (Maks. 3)
              </label>
              <p className="text-xs text-slate-400">
                Sertakan tangkapan layar domain situs, bukti transaksi transfer, atau isi chat percakapan dengan pelaku.
              </p>
            </div>

            {/* Upload Area */}
            {images.length < 3 ? (
              <div className="relative border-2 border-dashed border-cyber-border hover:border-cyber-cyan/50 rounded-2xl p-8 flex flex-col items-center justify-center bg-cyber-dark/40 transition-all duration-300 group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {isUploading ? (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-10 h-10 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs font-mono text-cyber-cyan uppercase">Mengunggah ({uploadProgress}%)</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-slate-500 group-hover:text-cyber-cyan group-hover:scale-110 transition-all duration-300 mb-3" />
                    <span className="text-xs font-bold text-slate-350">Klik atau seret file gambar ke sini</span>
                    <span className="text-[10px] text-slate-500 mt-1">PNG, JPG atau JPEG up to 5MB</span>
                  </>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-cyber-cyan/20 bg-cyber-cyan/5 text-center text-xs text-cyber-cyan font-medium">
                ✅ Kuota unggahan screenshot penuh (Maks. 3 gambar). Hapus salah satu gambar untuk mengunggah yang baru.
              </div>
            )}

            {uploadError && (
              <div className="border border-cyber-red/30 rounded-xl bg-cyber-red/5 p-3 flex items-center gap-2 text-cyber-red animate-fade-in text-xs font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">Bukti Terunggah</h4>
                <div className="grid grid-cols-3 gap-4">
                  {images.map((imgUrl, index) => (
                    <div key={index} className="relative aspect-video rounded-xl bg-slate-950 overflow-hidden border border-cyber-border group/preview">
                      <img 
                        src={imgUrl} 
                        alt={`Bukti ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-slate-400 hover:text-cyber-red transition-all border border-transparent hover:border-cyber-red/30"
                        title="Hapus Gambar"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Review and Submit */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in font-sans">
            <div className="p-4 rounded-xl border border-cyber-border bg-cyber-dark/50 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-slate-500 uppercase">Verifikasi Kasus</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/35 capitalize">
                  {category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">{title}</h3>
              
              <div className="border-t border-cyber-border/50 pt-3">
                <h4 className="text-xs font-mono text-slate-500 uppercase mb-1">Kronologi</h4>
                <p className="text-xs text-slate-350 leading-relaxed font-sans whitespace-pre-wrap">
                  {description}
                </p>
              </div>

              {images.length > 0 && (
                <div className="border-t border-cyber-border/50 pt-3">
                  <h4 className="text-xs font-mono text-slate-500 uppercase mb-2">Lampiran Bukti</h4>
                  <div className="grid grid-cols-4 gap-3">
                    {images.map((imgUrl, index) => (
                      <div key={index} className="aspect-square rounded-lg bg-slate-900 overflow-hidden border border-cyber-border">
                        <img src={imgUrl} alt="review" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-500 text-center font-mono">
              ⚠️ Dengan mengklik tombol kirim, Anda menyatakan bahwa informasi di atas diisi dengan sejujur-jujurnya demi keselamatan ruang siber bersama.
            </p>
          </div>
        )}

        {/* Navigation Actions Panel */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-cyber-border/60">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl text-sm font-display font-semibold text-slate-400 hover:text-white hover:bg-cyber-lightDark border border-cyber-border transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali
              </button>
            )}
          </div>

          <div>
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl text-sm font-display font-semibold bg-cyber-cyan text-cyber-dark shadow-neon-cyan hover:bg-cyber-cyan/95 transition-all flex items-center gap-2"
              >
                Lanjutkan
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl text-sm font-display font-bold bg-cyber-green text-cyber-dark shadow-neon-green hover:bg-cyber-green/95 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-cyber-dark border-t-transparent rounded-full animate-spin"></span>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Kirim Laporan Kasus
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
