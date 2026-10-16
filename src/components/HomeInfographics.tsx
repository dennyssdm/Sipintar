'use client';

import React from 'react';
import Link from 'next/link';
import { CATEGORIES_DATA } from '@/data/mockData';

export const HomeInfographics: React.FC = () => {
  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'user-check':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <polyline points="17 11 19 13 23 9" />
          </svg>
        );
      case 'book-open':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        );
      case 'library':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <line x1="12" y1="6" x2="12" y2="12" />
          </svg>
        );
      case 'award':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="7" />
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
          </svg>
        );
      case 'file-text':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        );
      case 'compass':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
        );
      case 'help-circle':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
      case 'search':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="home-infographics-wrapper">
      {/* 1. INFOGRAFIS: ARSITEKTUR EKOSISTEM SIKLUS PEMBELAJARAN (4 FASE SIKLUS) */}
      <section className="infographic-section" aria-labelledby="infografis-ekosistem-title">
        <div className="section-header">
          <div>
            <div className="badge-kicker-blue">
              <span className="dot-pulse-blue" />
              <span>INFOGRAFIS ARSITEKTUR SISTEM</span>
            </div>
            <h2 id="infografis-ekosistem-title" className="section-title">
              Siklus Terpadu <span className="highlight-pill-blue">Ekosistem Sumber Belajar</span>
            </h2>
            <p className="section-subtitle">
              Alur terintegrasi tata kelola kurikulum, penyelenggaraan ajar, riset kepustakaan, dan penjaminan mutu Sespimma Lemdiklat Polri
            </p>
          </div>
        </div>

        <div className="cycle-flow-grid">
          {/* Fase 1: Perencanaan */}
          <div className="cycle-flow-card cycle-card-blue">
            <div className="cycle-card-step">FASE 01</div>
            <div className="cycle-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
              </svg>
            </div>
            <h3 className="cycle-card-title">Perencanaan Kurikulum</h3>
            <p className="cycle-card-desc">
              Penyusunan Standar Kompetensi Lulusan (SKL), silabus 720 Jam Pelajaran (JP), dan pedoman bobot kurikulum kepemimpinan Polri.
            </p>
            <div className="cycle-pill-group">
              <span className="cycle-tag">720 Jam Pelajaran</span>
              <span className="cycle-tag">Standar SKL</span>
            </div>
            <Link href="/kurikulum" className="cycle-card-link">
              <span>Buka Menu Kurikulum</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>

          {/* Fase 2: Penyelenggaraan Ajar */}
          <div className="cycle-flow-card cycle-card-amber">
            <div className="cycle-card-step">FASE 02</div>
            <div className="cycle-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <h3 className="cycle-card-title">Bahan Ajar & Pendidik</h3>
            <p className="cycle-card-desc">
              Penyampaian 78 Modul & Naskah Hanjar Resmi oleh 28 Tenaga Pendidik (Gadik) fungsional Polri dan praktisi ahli.
            </p>
            <div className="cycle-pill-group">
              <span className="cycle-tag">78 Modul/Hanjar</span>
              <span className="cycle-tag">28 Tenaga Pendidik</span>
            </div>
            <Link href="/modul" className="cycle-card-link">
              <span>Buka Modul & Hanjar</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>

          {/* Fase 3: Riset & Pengayaan */}
          <div className="cycle-flow-card cycle-card-purple">
            <div className="cycle-card-step">FASE 03</div>
            <div className="cycle-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                <line x1="12" y1="6" x2="12" y2="12" />
              </svg>
            </div>
            <h3 className="cycle-card-title">Pustaka & Karya Ilmiah</h3>
            <p className="cycle-card-desc">
              Eksplorasi 142 referensi pustaka: buku fisik, e-book, naskah karya tulis kepolisian (Taskap Serdik), dan jurnal ilmiah kepolisian.
            </p>
            <div className="cycle-pill-group">
              <span className="cycle-tag">142 Buku & Taskap</span>
              <span className="cycle-tag">Repositori Digital</span>
            </div>
            <Link href="/library" className="cycle-card-link">
              <span>Buka E-Library</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>

          {/* Fase 4: Penjaminan Mutu & Prosedur */}
          <div className="cycle-flow-card cycle-card-emerald">
            <div className="cycle-card-step">FASE 04</div>
            <div className="cycle-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <h3 className="cycle-card-title">Tata Kelola & Mutu</h3>
            <p className="cycle-card-desc">
              Penerapan 35 SOP kedinasan, pedoman penulisan ilmiah, manual book operasional, verifikasi naskah, dan audit kepatuhan.
            </p>
            <div className="cycle-pill-group">
              <span className="cycle-tag">35 SOP Layanan</span>
              <span className="cycle-tag">Verifikasi Terpadu</span>
            </div>
            <Link href="/sop" className="cycle-card-link">
              <span>Buka Menu SOP</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. INFOGRAFIS: STATISTIK & REKAPITULASI PENGETAHUAN INSTITUSI */}
      <section className="infographic-section" aria-labelledby="infografis-statistik-title">
        <div className="section-header">
          <div>
            <div className="badge-kicker-gold">
              <span className="dot-pulse-gold" />
              <span>REKAPITULASI DATA REAL-TIME</span>
            </div>
            <h2 id="infografis-statistik-title" className="section-title">
              Statistik Kapasitas <span className="highlight-pill-gold">Sumber Belajar Sespimma</span>
            </h2>
            <p className="section-subtitle">
              Distribusi naskah pembelajaran, kepustakaan, dan tenaga pendidik terverifikasi TA 2025/2026
            </p>
          </div>
        </div>

        <div className="stat-infographic-grid">
          {/* Stat Card 1: Modul & Hanjar */}
          <div className="stat-info-card">
            <div className="stat-info-header">
              <div className="stat-info-icon-box stat-icon-blue">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <span className="stat-info-badge">100% Digital</span>
            </div>
            <div className="stat-info-number">78</div>
            <div className="stat-info-label">Modul & Bahan Ajar</div>
            <p className="stat-info-subtext">
              14 naskah hanjar inti Sespimma TA 2025 + 64 materi pengayaan kepemimpinan, hukum, dan manajemen taktis.
            </p>
            <div className="stat-info-progress-wrap">
              <div className="stat-info-progress-bar" style={{ width: '100%', backgroundColor: '#3b82f6' }} />
            </div>
            <div className="stat-info-footer">
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Status: 100% Terverifikasi</span>
              <Link href="/modul" className="stat-info-action">
                Buka Modul &rarr;
              </Link>
            </div>
          </div>

          {/* Stat Card 2: Koleksi Pustaka */}
          <div className="stat-info-card">
            <div className="stat-info-header">
              <div className="stat-info-icon-box stat-icon-purple">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <span className="stat-info-badge">4 Kategori</span>
            </div>
            <div className="stat-info-number">142</div>
            <div className="stat-info-label">Koleksi Pustaka Digital & Fisik</div>
            <p className="stat-info-subtext">
              Buku cetak perpustakaan, e-book digital, karya tulis akhir perorangan (Taskap), dan jurnal ilmiah kepolisian.
            </p>
            <div className="stat-info-progress-wrap">
              <div className="stat-info-progress-bar" style={{ width: '85%', backgroundColor: '#a855f7' }} />
            </div>
            <div className="stat-info-footer">
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Sampel Pratinjau Tersedia</span>
              <Link href="/library" className="stat-info-action">
                Buka Pustaka &rarr;
              </Link>
            </div>
          </div>

          {/* Stat Card 3: Tenaga Pendidik */}
          <div className="stat-info-card">
            <div className="stat-info-header">
              <div className="stat-info-icon-box stat-icon-emerald">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <polyline points="17 11 19 13 23 9" />
                </svg>
              </div>
              <span className="stat-info-badge">Sprint Resmi</span>
            </div>
            <div className="stat-info-number">28</div>
            <div className="stat-info-label">Tenaga Pendidik (Gadik)</div>
            <p className="stat-info-subtext">
              16 Personel Polri Fungsional (Kombes Pol s.d Iptu) bertugas resmi per Oktober 2026 + 12 pakar eksternal.
            </p>
            <div className="stat-info-progress-wrap">
              <div className="stat-info-progress-bar" style={{ width: '92%', backgroundColor: '#10b981' }} />
            </div>
            <div className="stat-info-footer">
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Pengesahan Bag Renmin</span>
              <Link href="/gadik" className="stat-info-action">
                Buka Gadik &rarr;
              </Link>
            </div>
          </div>

          {/* Stat Card 4: Kurikulum 720 JP */}
          <div className="stat-info-card">
            <div className="stat-info-header">
              <div className="stat-info-icon-box stat-icon-amber">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <span className="stat-info-badge">Standar Lemdiklat</span>
            </div>
            <div className="stat-info-number">720 <span style={{ fontSize: '20px', fontWeight: 600 }}>JP</span></div>
            <div className="stat-info-label">Jam Pelajaran Kepemimpinan</div>
            <p className="stat-info-subtext">
              Bobot mata pelajaran komprehensif: teori, praktik lapangan, latihan manajemen, dan penyusunan Taskap.
            </p>
            <div className="stat-info-progress-wrap">
              <div className="stat-info-progress-bar" style={{ width: '100%', backgroundColor: '#f59e0b' }} />
            </div>
            <div className="stat-info-footer">
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>SK Kalemdiklat Polri</span>
              <Link href="/kurikulum" className="stat-info-action">
                Buka Kurikulum &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INFOGRAFIS: MATRIKS KLASIFIKASI AKSES & SIKLUS HIDUP DOKUMEN */}
      <section className="infographic-section" aria-labelledby="infografis-tata-kelola-title">
        <div className="section-header">
          <div>
            <div className="badge-kicker-blue">
              <span className="dot-pulse-blue" />
              <span>TATA KELOLA & KEAMANAN INFORMASI</span>
            </div>
            <h2 id="infografis-tata-kelola-title" className="section-title">
              Klasifikasi Akses & <span className="highlight-pill-blue">Siklus Hidup Naskah</span>
            </h2>
            <p className="section-subtitle">
              Ketentuan hak aksesibilitas dan penjaminan mutu dokumen sesuai Buku Panduan Tata Kelola SIPINTAR
            </p>
          </div>
        </div>

        <div className="governance-infographic-grid">
          {/* Kolom 1: Matriks 4 Klasifikasi Akses */}
          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-badge-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div>
                <h3 className="gov-title">4 Tingkat Klasifikasi Akses</h3>
                <p className="gov-subtitle">Kepatuhan kerahasiaan materi kepolisian</p>
              </div>
            </div>

            <div className="gov-access-list">
              <div className="gov-access-item">
                <div className="gov-access-badge badge-green">Terbuka</div>
                <div className="gov-access-info">
                  <div className="gov-access-name">Akses Umum & Publik</div>
                  <div className="gov-access-desc">Dapat dibaca dan diunduh oleh masyarakat umum dan peserta tanpa login pembatasan.</div>
                </div>
              </div>

              <div className="gov-access-item">
                <div className="gov-access-badge badge-blue">Internal</div>
                <div className="gov-access-info">
                  <div className="gov-access-name">Lingkungan Lemdiklat Polri</div>
                  <div className="gov-access-desc">Khusus Serdik aktif, Gadik terdaftar, dan staf kedinasan dengan akun tervalidasi.</div>
                </div>
              </div>

              <div className="gov-access-item">
                <div className="gov-access-badge badge-amber">Terbatas</div>
                <div className="gov-access-info">
                  <div className="gov-access-name">Mata Pelajaran & Ujian Khusus</div>
                  <div className="gov-access-desc">Hanya dapat diakses oleh peserta didik kelas pengampu, tim penguji, dan pejabat Lemdiklat.</div>
                </div>
              </div>

              <div className="gov-access-item">
                <div className="gov-access-badge badge-purple">Metadata Saja</div>
                <div className="gov-access-info">
                  <div className="gov-access-name">Koleksi Fisik Terkatalog</div>
                  <div className="gov-access-desc">Hanya menampilkan informasi bibliografi, sinopsis, dan nomor rak buku perpustakaan.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom 2: 5 Siklus Hidup Dokumen */}
          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-badge-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
              </div>
              <div>
                <h3 className="gov-title">5 Tahap Siklus Hidup Naskah</h3>
                <p className="gov-subtitle">Alur verifikasi penerbitan materi resmi</p>
              </div>
            </div>

            <div className="gov-lifecycle-stepper">
              <div className="lifecycle-step-item">
                <div className="lifecycle-step-number">1</div>
                <div className="lifecycle-step-content">
                  <div className="lifecycle-step-title">DRAFT (Penyusunan Awal)</div>
                  <div className="lifecycle-step-desc">Modul atau karya tulis diunggah oleh Gadik/Serdik untuk ditinjau secara internal.</div>
                </div>
              </div>

              <div className="lifecycle-step-item">
                <div className="lifecycle-step-number">2</div>
                <div className="lifecycle-step-content">
                  <div className="lifecycle-step-title">DIVERIFIKASI (Uji Mutu)</div>
                  <div className="lifecycle-step-desc">Pemeriksaan kesesuaian kurikulum, format baku, dan hak cipta oleh Tim Verifikator.</div>
                </div>
              </div>

              <div className="lifecycle-step-item">
                <div className="lifecycle-step-number">3</div>
                <div className="lifecycle-step-content">
                  <div className="lifecycle-step-title">DIPUBLIKASIKAN (Aktif Digunakan)</div>
                  <div className="lifecycle-step-desc">Dokumen disetujui dan tayang di katalog untuk dipelajari seluruh Serdik.</div>
                </div>
              </div>

              <div className="lifecycle-step-item">
                <div className="lifecycle-step-number">4</div>
                <div className="lifecycle-step-content">
                  <div className="lifecycle-step-title">TIDAK AKTIF (Revisi Kurikulum)</div>
                  <div className="lifecycle-step-desc">Dokumen digantikan oleh kurikulum/hanjar baru dan dinonaktifkan dari jadwal aktif.</div>
                </div>
              </div>

              <div className="lifecycle-step-item">
                <div className="lifecycle-step-number">5</div>
                <div className="lifecycle-step-content">
                  <div className="lifecycle-step-title">ARSIP (Penyimpanan Historis)</div>
                  <div className="lifecycle-step-desc">Disimpan permanen dalam repositori arsip digital untuk rujukan historis kepolisian.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. GERBANG LANGSUNG 8 MENU KATEGORI SUMBER BELAJAR */}
      <section id="kategori" className="infographic-section" aria-labelledby="kategori-title">
        <div className="section-header">
          <div>
            <div className="badge-kicker-blue">
              <span className="dot-pulse-blue" />
              <span>GERBANG UTAMA PLATFORM</span>
            </div>
            <h2 id="kategori-title" className="section-title">
              Pintu Masuk <span className="highlight-pill-blue">8 Menu Kategori Sumber Belajar</span>
            </h2>
            <p className="section-subtitle">
              Pilih menu di bawah ini untuk membuka dan membaca naskah, berkas asli, direktori pendidik, dan modul lengkap
            </p>
          </div>
        </div>

        <div className="categories-grid">
          {CATEGORIES_DATA.map((cat) => (
            <div key={cat.category} className="category-card category-card-portal">
              <div className="category-card-top">
                <div className="category-icon-box" aria-hidden="true">
                  {renderCategoryIcon(cat.icon)}
                </div>
                <span className="category-badge-count">{cat.count} Berkas</span>
              </div>
              <h3 className="category-title">{cat.title}</h3>
              <p className="category-desc">{cat.description}</p>
              
              <Link href={cat.href || '/'} className="category-portal-button" title={`Buka halaman ${cat.title}`}>
                <span>Buka {cat.category.split('/')[0]}</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </div>
          ))}
        </div>

        {/* Clear Guidance Banner */}
        <div className="portal-guidance-banner">
          <div className="guidance-banner-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <div className="guidance-banner-text">
            <strong>Petunjuk Navigasi Sumber Belajar:</strong> Beranda SiPINTAR menyajikan ringkasan ekosistem dan infografis terpadu. Untuk membaca naskah, memeriksa profil lengkap tenaga pendidik, menelaah hanjar PDF, atau membuka koleksi perpustakaan, silakan klik menu kategori terkait di atas atau navigasi menu di bilah samping (*sidebar*).
          </div>
          <Link href="/search" className="btn-guidance-search">
            <span>Pencarian Terpadu</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* 5. INFOGRAFIS: PANDUAN PENGGUNA BERDASARKAN PERAN */}
      <section className="infographic-section" aria-labelledby="infografis-peran-title" style={{ marginBottom: '40px' }}>
        <div className="section-header">
          <div>
            <div className="badge-kicker-gold">
              <span className="dot-pulse-gold" />
              <span>ALUR LAYANAN PENGGUNA</span>
            </div>
            <h2 id="infografis-peran-title" className="section-title">
              Panduan Akses Cepat <span className="highlight-pill-gold">Berdasarkan Peran</span>
            </h2>
            <p className="section-subtitle">
              Tata cara interaksi personel dalam memanfaatkan ekosistem digital SiPINTAR Sespimma
            </p>
          </div>
        </div>

        <div className="role-guide-grid">
          {/* Peran 1: Serdik */}
          <div className="role-guide-card">
            <div className="role-guide-badge" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}>
              Peserta Didik (Serdik)
            </div>
            <h3 className="role-guide-heading">Eksplorasi Pembelajaran</h3>
            <ul className="role-guide-list">
              <li>Membaca dan mengunduh Modul & Hanjar Resmi setiap mata pelajaran.</li>
              <li>Menelaah Kurikulum 720 JP dan Standar Kompetensi Lulusan (SKL).</li>
              <li>Riset kepustakaan & studi naskah Taskap alumni di E-Library.</li>
              <li>Mematuhi SOP ujian, sidang naskah, dan pedoman penulisan ilmiah.</li>
            </ul>
            <Link href="/modul" className="role-guide-action">
              Mulai Belajar di Modul &rarr;
            </Link>
          </div>

          {/* Peran 2: Gadik */}
          <div className="role-guide-card">
            <div className="role-guide-badge" style={{ backgroundColor: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' }}>
              Tenaga Pendidik (Gadik)
            </div>
            <h3 className="role-guide-heading">Pemberian Materi & Bimbingan</h3>
            <ul className="role-guide-list">
              <li>Memverifikasi data penugasan dinas pada direktori Gadik resmi.</li>
              <li>Mendistribusikan materi ajar pokok, modul, dan lembar penugasan Serdik.</li>
              <li>Memberikan panduan riset referensi ilmiah untuk penulisan Taskap.</li>
              <li>Memantau ketepatan capaian pembelajaran sesuai kurikulum Lemdiklat.</li>
            </ul>
            <Link href="/gadik" className="role-guide-action">
              Buka Direktori Gadik &rarr;
            </Link>
          </div>

          {/* Peran 3: Pengelola Pustaka */}
          <div className="role-guide-card">
            <div className="role-guide-badge" style={{ backgroundColor: '#fdf4ff', color: '#7e22ce', borderColor: '#f5d0fe' }}>
              Pengelola Perpustakaan
            </div>
            <h3 className="role-guide-heading">Kurasi & Repositori Ilmiah</h3>
            <ul className="role-guide-list">
              <li>Inventarisasi katalog buku fisik, e-book, dan jurnal terbitan kepolisian.</li>
              <li>Penyimpanan repositori naskah karya tulis akhir (Taskap) peserta didik.</li>
              <li>Pengaturan klasifikasi hak akses naskah dan pratinjau sampel buku.</li>
              <li>Pelayanan sirkulasi peminjaman koleksi fisik di ruang perpustakaan.</li>
            </ul>
            <Link href="/library" className="role-guide-action">
              Kelola di E-Library &rarr;
            </Link>
          </div>

          {/* Peran 4: Admin & Verifikator */}
          <div className="role-guide-card">
            <div className="role-guide-badge" style={{ backgroundColor: '#fffbeb', color: '#b45309', borderColor: '#fde68a' }}>
              Administrator & Mutu
            </div>
            <h3 className="role-guide-heading">Tata Kelola & Audit Mutu</h3>
            <ul className="role-guide-list">
              <li>Verifikasi naskah baru sebelum diterbitkan secara resmi di platform.</li>
              <li>Manajemen hak akses pengguna dan penetapan klasifikasi dokumen.</li>
              <li>Pemantauan statistik pemanfaatan materi dan laporan kepatuhan.</li>
              <li>Pemeliharaan data master kurikulum dan SOP kedinasan Sespimma.</li>
            </ul>
            <Link href="/admin/data" className="role-guide-action">
              Buka Panel Tata Kelola &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
