'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export const EcosystemChartSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'kategori' | 'pustaka' | 'gadik' | 'kurikulum'>('kategori');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Data 8 Kategori Sumber Belajar
  const categoryData = [
    { name: 'E-Library / Perpustakaan', count: 142, pct: 44.9, color: '#8b5cf6', href: '/library', icon: 'library' },
    { name: 'Modul & Hanjar', count: 78, pct: 24.7, color: '#3b82f6', href: '/modul', icon: 'book' },
    { name: 'SOP Kedinasan', count: 35, pct: 11.1, color: '#f59e0b', href: '/sop', icon: 'file-text' },
    { name: 'Pedoman & Juknis', count: 22, pct: 7.0, color: '#06b6d4', href: '/pedoman', icon: 'compass' },
    { name: 'Kurikulum & Layanan', count: 19, pct: 6.0, color: '#10b981', href: '/kurikulum', icon: 'award' },
    { name: 'Gadik & Kompetensi', count: 16, pct: 5.1, color: '#6366f1', href: '/gadik', icon: 'user' },
    { name: 'Manual Book Sistem', count: 6, pct: 1.9, color: '#ec4899', href: '/manual', icon: 'help' },
  ];

  // Data Koleksi Perpustakaan (142 Koleksi)
  const libraryData = [
    { type: 'Koleksi Buku Fisik', count: 52, pct: 36.6, color: '#10b981', desc: 'Buku teks cetak tersedia di ruang perpustakaan dengan kode rak & barcode.' },
    { type: 'E-Book Digital', count: 48, pct: 33.8, color: '#3b82f6', desc: 'Naskah buku elektronik lengkap dapat dibaca langsung pada digital viewer.' },
    { type: 'Karya Tulis (Taskap)', count: 28, pct: 19.7, color: '#8b5cf6', desc: 'Karya ilmiah akhir perorangan Serdik Sespimma dari berbagai angkatan.' },
    { type: 'Jurnal Ilmiah Terbitan', count: 14, pct: 9.9, color: '#f59e0b', desc: 'Publikasi riset kepolisian terakreditasi dan artikel telaah taktis.' },
  ];

  // Data Kepangkatan Gadik Polri (16 Fungsional Resmi)
  const rankData = [
    { rank: 'Kombes Pol', count: 6, pct: 37.5, color: '#1d4ed8', badge: '3 Melati', role: 'Gadik Utama & Pengampu Doktrin' },
    { rank: 'AKBP', count: 6, pct: 37.5, color: '#2563eb', badge: '2 Melati', role: 'Gadik Madya & Bimbingan Taskap' },
    { rank: 'Kompol', count: 3, pct: 18.8, color: '#0284c7', badge: '1 Melati', role: 'Gadik Muda & Manajemen Taktis' },
    { rank: 'Iptu', count: 1, pct: 6.3, color: '#059669', badge: '2 Balok Emas', role: 'Gadik Pertama & Administrasi Diklat' },
  ];

  // Data Alokasi Kurikulum (720 JP)
  const curriculumData = [
    { subject: 'Kepemimpinan Strategis & Etika', jp: 240, pct: 33.3, color: '#1d4ed8', desc: 'Wawasan kepemimpinan integratif, etika profesi Polri, dan pengambilan keputusan.' },
    { subject: 'Manajemen Operasional & Penegakan Hukum', jp: 200, pct: 27.8, color: '#0284c7', desc: 'Taktik kepolisian modern, intelijen strategis, dan manajemen mitigasi krisis.' },
    { subject: 'Tata Kelola Kelembagaan & Hukum Terapan', jp: 160, pct: 22.2, color: '#059669', desc: 'Reformasi birokrasi, hukum acara kepolisian, dan akuntabilitas anggaran publik.' },
    { subject: 'Latihan Taktis & Sidang Naskah Taskap', jp: 120, pct: 16.7, color: '#f59e0b', desc: 'Simulasi manajerial posko, penyusunan karya tulis perorangan, dan uji panel naskah.' },
  ];

  return (
    <section className="ecosystem-chart-section" aria-labelledby="chart-section-title">
      {/* Top Header & Context Badges */}
      <div className="section-header" style={{ marginBottom: '18px' }}>
        <div>
          <div className="badge-kicker-blue">
            <span className="dot-pulse-blue" />
            <span>ANALITIK VISUAL EKOSISTEM</span>
          </div>
          <h2 id="chart-section-title" className="section-title">
            Distribusi & Analitik <span className="highlight-pill-blue">Ekosistem Sumber Belajar</span>
          </h2>
          <p className="section-subtitle">
            Visualisasi real-time komposisi repositori materi, klasifikasi pustaka, struktur pendidik, dan beban kurikulum Sespimma
          </p>
        </div>

        {/* Global Metric Indicators */}
        <div className="chart-kpi-ribbon">
          <div className="chart-kpi-item">
            <span className="chart-kpi-val">316</span>
            <span className="chart-kpi-lbl">Total Berkas</span>
          </div>
          <div className="chart-kpi-item">
            <span className="chart-kpi-val">720 JP</span>
            <span className="chart-kpi-lbl">Kurikulum</span>
          </div>
          <div className="chart-kpi-item">
            <span className="chart-kpi-val">100%</span>
            <span className="chart-kpi-lbl">Tervalidasi</span>
          </div>
        </div>
      </div>

      {/* Interactive Tabs Switcher */}
      <div className="chart-tabs-nav" role="tablist" aria-label="Pilihan Analitik Ekosistem">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'kategori'}
          className={`chart-tab-btn ${activeTab === 'kategori' ? 'active' : ''}`}
          onClick={() => setActiveTab('kategori')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
            <path d="M22 12A10 10 0 0 0 12 2v10z" />
          </svg>
          <span>Komposisi 8 Kategori</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'pustaka'}
          className={`chart-tab-btn ${activeTab === 'pustaka' ? 'active' : ''}`}
          onClick={() => setActiveTab('pustaka')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span>Klasifikasi Pustaka & Taskap</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'gadik'}
          className={`chart-tab-btn ${activeTab === 'gadik' ? 'active' : ''}`}
          onClick={() => setActiveTab('gadik')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <polyline points="17 11 19 13 23 9" />
          </svg>
          <span>Kepangkatan Tenaga Pendidik</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'kurikulum'}
          className={`chart-tab-btn ${activeTab === 'kurikulum' ? 'active' : ''}`}
          onClick={() => setActiveTab('kurikulum')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>Distribusi 720 JP Kurikulum</span>
        </button>
      </div>

      {/* TAB 1: KOMPOSISI 8 KATEGORI SUMBER BELAJAR - COMPACT SLEEK HORIZONTAL BAR & MATRIX */}
      {activeTab === 'kategori' && (
        <div className="chart-view-panel">
          {/* Top: 100% Full-Width Segmented Ribbon Gauge */}
          <div className="segmented-gauge-card">
            <div className="segmented-gauge-header">
              <div>
                <span className="segmented-gauge-title">Pita Distribusi Komposisi Repositori (316 Berkas)</span>
                <span className="segmented-gauge-sub">Proporsi volume naskah berdasarkan 7 taksonomi sumber belajar aktif</span>
              </div>
              <div className="segmented-active-pill">
                {hoveredCategory ? (
                  <>
                    <span className="dot-pulse-blue" style={{ backgroundColor: categoryData.find((c) => c.name === hoveredCategory)?.color }} />
                    <strong>{hoveredCategory}</strong>: {categoryData.find((c) => c.name === hoveredCategory)?.count} Berkas ({categoryData.find((c) => c.name === hoveredCategory)?.pct}%)
                  </>
                ) : (
                  <>
                    <span className="dot-pulse-blue" />
                    <span>Arahkan kursor pada segmen untuk melihat rincian</span>
                  </>
                )}
              </div>
            </div>

            {/* The Horizontal Segmented Bar Meter */}
            <div className="segmented-gauge-bar">
              {categoryData.map((item) => {
                const isHovered = hoveredCategory === item.name;
                return (
                  <div
                    key={item.name}
                    className="segmented-gauge-slice"
                    style={{
                      width: `${item.pct}%`,
                      backgroundColor: item.color,
                      opacity: hoveredCategory && !isHovered ? 0.35 : 1,
                      transform: isHovered ? 'scaleY(1.15)' : 'none',
                    }}
                    onMouseEnter={() => setHoveredCategory(item.name)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    title={`${item.name}: ${item.count} Berkas (${item.pct}%)`}
                  >
                    {item.pct >= 6 && <span className="gauge-slice-label">{item.pct}%</span>}
                  </div>
                );
              })}
            </div>

            {/* Interactive Legend Chips */}
            <div className="segmented-legend-wrap">
              {categoryData.map((item) => {
                const isHovered = hoveredCategory === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    className={`segmented-legend-chip ${isHovered ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredCategory(item.name)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <span className="legend-chip-dot" style={{ backgroundColor: item.color }} />
                    <span className="legend-chip-name">{item.name}</span>
                    <strong className="legend-chip-count">{item.count}</strong>
                    <span className="legend-chip-pct">({item.pct}%)</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom: Modern 2-Column Ranked Comparative Bar Grid */}
          <div className="ranked-bars-grid">
            {categoryData.map((cat, idx) => {
              const isHovered = hoveredCategory === cat.name;
              return (
                <div
                  key={cat.name}
                  className={`ranked-bar-card ${isHovered ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoveredCategory(cat.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="ranked-card-top">
                    <div className="ranked-badge-title">
                      <span className="rank-num-badge">#{idx + 1}</span>
                      <span className="ranked-cat-dot" style={{ backgroundColor: cat.color }} />
                      <strong className="ranked-cat-title">{cat.name}</strong>
                    </div>
                    <div className="ranked-stat-val">
                      <span className="ranked-count-num" style={{ color: cat.color }}>{cat.count}</span>
                      <span className="ranked-count-unit">Berkas</span>
                      <span className="ranked-pct-badge" style={{ backgroundColor: `${cat.color}15`, color: cat.color, borderColor: `${cat.color}35` }}>
                        {cat.pct}%
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="chart-progress-bg" style={{ height: '7px', margin: '8px 0 10px 0' }}>
                    <div
                      className="chart-progress-fill"
                      style={{
                        width: `${cat.pct * 2.1}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>

                  <div className="ranked-card-footer">
                    <span className="ranked-desc-hint">
                      {cat.count >= 70 ? 'Pilar Utama Pembelajaran' : cat.count >= 20 ? 'Pedoman & Tata Kelola' : 'Regulasi & Panduan Teknis'}
                    </span>
                    <Link href={cat.href} className="ranked-link-action">
                      <span>Buka Menu &rarr;</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Insight Banner */}
          <div className="chart-highlight-box" style={{ marginTop: '16px' }}>
            <div className="highlight-icon" style={{ color: '#2563eb' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <div className="highlight-content">
              <strong>Konsentrasi Sumber Belajar:</strong> <strong>Koleksi E-Library & Perpustakaan (142 berkas)</strong> serta <strong>Modul & Hanjar Resmi (78 berkas)</strong> mencakup <strong>69.6%</strong> dari total ekosistem 316 berkas materi Sespimma. Seluruh materi didukung oleh 35 SOP kedinasan dan 22 pedoman penjaminan mutu.
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KLASIFIKASI KOLEKSI PERPUSTAKAAN */}
      {activeTab === 'pustaka' && (
        <div className="chart-view-panel">
          <div className="chart-pustaka-grid">
            {libraryData.map((item) => (
              <div key={item.type} className="pustaka-chart-card">
                <div className="pustaka-card-top">
                  <span className="pustaka-type-badge" style={{ backgroundColor: `${item.color}15`, color: item.color, borderColor: `${item.color}35` }}>
                    {item.pct}% dari 142 Judul
                  </span>
                  <div className="pustaka-count-box">
                    <span className="pustaka-count-num" style={{ color: item.color }}>{item.count}</span>
                    <span className="pustaka-count-lbl">Judul</span>
                  </div>
                </div>

                <h3 className="pustaka-card-title">{item.type}</h3>
                <p className="pustaka-card-desc">{item.desc}</p>

                <div className="chart-progress-bg" style={{ marginTop: 'auto', marginBottom: '12px' }}>
                  <div
                    className="chart-progress-fill"
                    style={{ width: `${item.pct * 2.5}%`, backgroundColor: item.color }}
                  />
                </div>

                <Link href="/library" className="pustaka-action-btn">
                  <span>Telusuri Koleksi Ini</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>

          {/* Additional Library Highlight */}
          <div className="chart-highlight-box">
            <div className="highlight-icon" style={{ color: '#8b5cf6' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div className="highlight-content">
              <strong>Ketersediaan Digital & Pratinjau Sampel Naskah:</strong> Seluruh koleksi perpustakaan telah terdata dengan metadata bibliografi standar (penulis, penerbit, nomor ISBN/lokasi rak). Koleksi e-book dan naskah Taskap dilengkapi sampel pratinjau (10-25 halaman pertama) yang dapat dibaca langsung oleh Serdik secara interaktif.
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: KEPANGKATAN TENAGA PENDIDIK */}
      {activeTab === 'gadik' && (
        <div className="chart-view-panel">
          <div className="gadik-chart-layout">
            <div className="gadik-summary-card">
              <div className="gadik-summary-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="gadik-summary-number">16 + 12</div>
              <div className="gadik-summary-title">Personel Gadik & Pendidik</div>
              <p className="gadik-summary-desc">
                16 Personel Polri Fungsional resmi per Oktober 2026 (pengesahan Bag Renmin Kompol Sunu Prihandoyo, S.T.) ditambah 12 praktisi ahli eksternal.
              </p>
              <Link href="/gadik" className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px', marginTop: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span>Buka Direktori Gadik</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </div>

            <div className="gadik-rank-bars">
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '14px' }}>
                REKAPITULASI KEPANGKATAN POLRI FUNGSIONAL (16 PERSONEL)
              </div>

              {rankData.map((rk) => (
                <div key={rk.rank} className="rank-bar-card">
                  <div className="rank-bar-top">
                    <div className="rank-badge-wrap">
                      <span className="rank-insignia" style={{ backgroundColor: rk.color }}>{rk.badge}</span>
                      <strong className="rank-name">{rk.rank}</strong>
                    </div>
                    <div className="rank-stat">
                      <span className="rank-count">{rk.count} Personel</span>
                      <span className="rank-pct">({rk.pct}%)</span>
                    </div>
                  </div>

                  <div className="chart-progress-bg">
                    <div
                      className="chart-progress-fill"
                      style={{ width: `${rk.pct}%`, backgroundColor: rk.color }}
                    />
                  </div>

                  <div className="rank-role-desc">{rk.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DISTRIBUSI 720 JP KURIKULUM */}
      {activeTab === 'kurikulum' && (
        <div className="chart-view-panel">
          <div className="curriculum-chart-container">
            {/* Horizontal Timeline Bar */}
            <div className="curriculum-stacked-bar">
              {curriculumData.map((c) => (
                <div
                  key={c.subject}
                  className="curriculum-segment"
                  style={{
                    width: `${c.pct}%`,
                    backgroundColor: c.color,
                  }}
                  title={`${c.subject}: ${c.jp} JP (${c.pct}%)`}
                >
                  <span className="segment-label">{c.jp} JP</span>
                </div>
              ))}
            </div>

            {/* Curriculum Breakdown Cards */}
            <div className="curriculum-detail-grid">
              {curriculumData.map((c) => (
                <div key={c.subject} className="curriculum-item-card">
                  <div className="curriculum-item-header">
                    <div className="curriculum-badge" style={{ backgroundColor: `${c.color}15`, color: c.color }}>
                      {c.jp} Jam Pelajaran
                    </div>
                    <span className="curriculum-pct">{c.pct}%</span>
                  </div>
                  <h4 className="curriculum-item-title">{c.subject}</h4>
                  <p className="curriculum-item-desc">{c.desc}</p>
                </div>
              ))}
            </div>

            <div className="curriculum-footer-card">
              <div>
                <strong>Standar Kelulusan Lemdiklat Polri:</strong> Setiap peserta didik diwajibkan menyelesaikan 720 JP pembelajaran tatap muka, diskusi kelompok, simulasi taktis, dan penyusunan naskah kepemimpinan Taskap.
              </div>
              <Link href="/kurikulum" className="btn-secondary" style={{ padding: '8px 14px', fontSize: '12.5px', whiteSpace: 'nowrap' }}>
                Lihat Silabus Lengkap &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
