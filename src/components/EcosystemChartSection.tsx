'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export const EcosystemChartSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'kategori' | 'pustaka' | 'gadik' | 'kurikulum'>('kategori');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Data 1: 8 Kategori Sumber Belajar (316 Berkas)
  const categoryData = [
    { name: 'E-Library / Perpustakaan', count: 142, pct: 44.9, color: '#8b5cf6', href: '/library', shortName: 'E-Library' },
    { name: 'Modul & Hanjar', count: 78, pct: 24.7, color: '#3b82f6', href: '/modul', shortName: 'Modul/Hanjar' },
    { name: 'SOP Kedinasan', count: 35, pct: 11.1, color: '#f59e0b', href: '/sop', shortName: 'SOP' },
    { name: 'Pedoman & Juknis', count: 22, pct: 7.0, color: '#06b6d4', href: '/pedoman', shortName: 'Pedoman' },
    { name: 'Kurikulum & Layanan', count: 19, pct: 6.0, color: '#10b981', href: '/kurikulum', shortName: 'Kurikulum' },
    { name: 'Gadik & Kompetensi', count: 16, pct: 5.1, color: '#6366f1', href: '/gadik', shortName: 'Gadik' },
    { name: 'Manual Book Sistem', count: 6, pct: 1.9, color: '#ec4899', href: '/manual', shortName: 'Manual Book' },
  ];

  // Data 2: Koleksi Perpustakaan (142 Judul)
  const libraryData = [
    { type: 'Koleksi Buku Fisik', count: 52, pct: 36.6, color: '#10b981', href: '/library', desc: 'Buku teks cetak tersedia di ruang perpustakaan dengan kode rak & barcode.' },
    { type: 'E-Book Digital', count: 48, pct: 33.8, color: '#3b82f6', href: '/library', desc: 'Naskah buku elektronik lengkap dapat dibaca langsung pada digital viewer.' },
    { type: 'Karya Tulis (Taskap)', count: 28, pct: 19.7, color: '#8b5cf6', href: '/library', desc: 'Karya ilmiah akhir perorangan Serdik Sespimma dari berbagai angkatan.' },
    { type: 'Jurnal Ilmiah Terbitan', count: 14, pct: 9.9, color: '#f59e0b', href: '/library', desc: 'Publikasi riset kepolisian terakreditasi dan artikel telaah taktis.' },
  ];

  // Data 3: Kepangkatan Gadik Polri Fungsional (16 Personel)
  const rankData = [
    { rank: 'Kombes Pol', count: 6, pct: 37.5, color: '#1d4ed8', badge: '3 Melati', href: '/gadik', role: 'Gadik Utama & Pengampu Doktrin' },
    { rank: 'AKBP', count: 6, pct: 37.5, color: '#2563eb', badge: '2 Melati', href: '/gadik', role: 'Gadik Madya & Bimbingan Taskap' },
    { rank: 'Kompol', count: 3, pct: 18.8, color: '#0284c7', badge: '1 Melati', href: '/gadik', role: 'Gadik Muda & Manajemen Taktis' },
    { rank: 'Iptu', count: 1, pct: 6.3, color: '#059669', badge: '2 Balok Emas', href: '/gadik', role: 'Gadik Pertama & Administrasi Diklat' },
  ];

  // Data 4: Alokasi Jam Pelajaran Kurikulum (720 JP)
  const curriculumData = [
    { subject: 'Kepemimpinan Strategis & Etika', shortTitle: 'Kepemimpinan', jp: 240, pct: 33.3, color: '#1d4ed8', href: '/kurikulum', desc: 'Wawasan integratif, etika profesi Polri, dan pengambilan keputusan.' },
    { subject: 'Manajemen Operasional & Penegakan Hukum', shortTitle: 'Manajemen Ops', jp: 200, pct: 27.8, color: '#0284c7', href: '/kurikulum', desc: 'Taktik kepolisian modern, intelijen strategis, dan mitigasi krisis.' },
    { subject: 'Tata Kelola Kelembagaan & Hukum Terapan', shortTitle: 'Tata Kelola & Hukum', jp: 160, pct: 22.2, color: '#059669', href: '/kurikulum', desc: 'Reformasi birokrasi, hukum acara kepolisian, dan akuntabilitas publik.' },
    { subject: 'Latihan Taktis & Sidang Naskah Taskap', shortTitle: 'Latihan & Taskap', jp: 120, pct: 16.7, color: '#f59e0b', href: '/kurikulum', desc: 'Simulasi posko, penyusunan naskah perorangan, dan uji panel naskah.' },
  ];

  return (
    <section className="ecosystem-chart-section" aria-labelledby="chart-section-title">
      {/* Top Header & Context Badges */}
      <div className="section-header" style={{ marginBottom: '18px' }}>
        <div>
          <div className="badge-kicker-blue">
            <span className="dot-pulse-blue" />
            <span>DIAGRAM BATANG VERTIKAL EKOSISTEM</span>
          </div>
          <h2 id="chart-section-title" className="section-title">
            Distribusi & Analitik <span className="highlight-pill-blue">Ekosistem Sumber Belajar</span>
          </h2>
          <p className="section-subtitle">
            Visualisasi diagram batang tegak ke atas untuk perbandingan volume materi, koleksi pustaka, jenjang pendidik, dan kurikulum
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
          onClick={() => { setActiveTab('kategori'); setHoveredItem(null); }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <span>Komposisi 8 Kategori Berkas</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'pustaka'}
          className={`chart-tab-btn ${activeTab === 'pustaka' ? 'active' : ''}`}
          onClick={() => { setActiveTab('pustaka'); setHoveredItem(null); }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <span>Klasifikasi Pustaka & Taskap</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'gadik'}
          className={`chart-tab-btn ${activeTab === 'gadik' ? 'active' : ''}`}
          onClick={() => { setActiveTab('gadik'); setHoveredItem(null); }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <span>Kepangkatan Tenaga Pendidik</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'kurikulum'}
          className={`chart-tab-btn ${activeTab === 'kurikulum' ? 'active' : ''}`}
          onClick={() => { setActiveTab('kurikulum'); setHoveredItem(null); }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <span>Distribusi 720 JP Kurikulum</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: VERTICAL BAR CHART - 8 KATEGORI SUMBER BELAJAR                    */}
      {/* ========================================================================= */}
      {activeTab === 'kategori' && (
        <div className="chart-view-panel">
          <div className="vbar-chart-card">
            {/* Header with Active Info Pill */}
            <div className="vbar-chart-header">
              <div>
                <span className="vbar-chart-title">Diagram Batang Vertikal Repositori (316 Berkas)</span>
                <span className="vbar-chart-sub">Perbandingan volume materi 7 taksonomi dengan visualisasi batang tegak ke atas</span>
              </div>
              <div className="vbar-active-pill">
                {hoveredItem ? (
                  <>
                    <span className="dot-pulse-blue" style={{ backgroundColor: categoryData.find((c) => c.name === hoveredItem)?.color }} />
                    <strong>{hoveredItem}</strong>: {categoryData.find((c) => c.name === hoveredItem)?.count} Berkas ({categoryData.find((c) => c.name === hoveredItem)?.pct}%)
                  </>
                ) : (
                  <>
                    <span className="dot-pulse-blue" />
                    <span>Arahkan kursor pada batang untuk melihat rincian</span>
                  </>
                )}
              </div>
            </div>

            {/* Vertical Bar Canvas Container with Y-Axis and Gridlines */}
            <div className="vbar-canvas-scroll">
              <div className="vbar-canvas-wrap">
                {/* Y-Axis Scale Marks & Gridlines Layer */}
                <div className="vbar-grid-layer" aria-hidden="true">
                  <div className="vbar-grid-line"><span className="vbar-y-label">150</span></div>
                  <div className="vbar-grid-line"><span className="vbar-y-label">100</span></div>
                  <div className="vbar-grid-line"><span className="vbar-y-label">50</span></div>
                  <div className="vbar-grid-line baseline"><span className="vbar-y-label">0</span></div>
                </div>

                {/* 7 Vertical Bars Standing Upwards */}
                <div className="vbar-columns-row" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
                  {categoryData.map((cat, idx) => {
                    const isHovered = hoveredItem === cat.name;
                    // Scale maximum is 150 for 100% height headroom
                    const barHeightPct = Math.min(100, Math.max(8, (cat.count / 150) * 100));

                    return (
                      <div
                        key={cat.name}
                        className={`vbar-col-item ${isHovered ? 'hovered' : ''}`}
                        onMouseEnter={() => setHoveredItem(cat.name)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        {/* The Rising Bar Column */}
                        <div className="vbar-track-wrap">
                          {/* Floating Value on top of the bar */}
                          <div className="vbar-val-bubble" style={{ color: cat.color }}>
                            <strong>{cat.count}</strong>
                            <span className="vbar-pct-text">{cat.pct}%</span>
                          </div>

                          <div
                            className="vbar-fill-bar"
                            style={{
                              height: `${barHeightPct}%`,
                              background: `linear-gradient(180deg, ${cat.color} 0%, ${cat.color}dd 100%)`,
                              boxShadow: isHovered ? `0 8px 24px ${cat.color}70` : `0 3px 10px ${cat.color}30`,
                            }}
                          >
                            <span className="vbar-rank-tag">#{idx + 1}</span>
                          </div>
                        </div>

                        {/* X-Axis Column Label Below */}
                        <div className="vbar-col-footer">
                          <div className="vbar-dot-icon" style={{ backgroundColor: `${cat.color}15`, color: cat.color, borderColor: `${cat.color}35` }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cat.color }} />
                          </div>
                          <span className="vbar-name-label" title={cat.name}>
                            {cat.shortName}
                          </span>
                          <Link href={cat.href} className="vbar-link-btn" title={`Buka ${cat.name}`}>
                            <span>Buka &rarr;</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4 Summary Highlight Tiles Below Chart */}
            <div className="vbar-summary-tiles">
              <div className="vbar-tile">
                <span className="vbar-tile-badge badge-purple">Paling Dominan</span>
                <div className="vbar-tile-val">142 Berkas</div>
                <div className="vbar-tile-name">E-Library & Taskap (44.9%)</div>
              </div>

              <div className="vbar-tile">
                <span className="vbar-tile-badge badge-blue">Bahan Ajar Inti</span>
                <div className="vbar-tile-val">78 Berkas</div>
                <div className="vbar-tile-name">Modul & Hanjar (24.7%)</div>
              </div>

              <div className="vbar-tile">
                <span className="vbar-tile-badge badge-amber">Tata Kelola & Mutu</span>
                <div className="vbar-tile-val">57 Berkas</div>
                <div className="vbar-tile-name">SOP & Pedoman (18.1%)</div>
              </div>

              <div className="vbar-tile">
                <span className="vbar-tile-badge badge-green">Pendidik & Sistem</span>
                <div className="vbar-tile-val">41 Berkas</div>
                <div className="vbar-tile-name">Kurikulum, Gadik, Manual (13.0%)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: VERTICAL BAR CHART - KLASIFIKASI PUSTAKA & TASKAP (142 JUDUL)      */}
      {/* ========================================================================= */}
      {activeTab === 'pustaka' && (
        <div className="chart-view-panel">
          <div className="vbar-chart-card">
            <div className="vbar-chart-header">
              <div>
                <span className="vbar-chart-title">Diagram Batang Vertikal Koleksi Perpustakaan (142 Judul)</span>
                <span className="vbar-chart-sub">Perbandingan volume buku fisik, e-book, karya tulis ilmiah (Taskap), dan jurnal ilmiah kepolisian</span>
              </div>
              <div className="vbar-active-pill">
                {hoveredItem ? (
                  <>
                    <span className="dot-pulse-blue" style={{ backgroundColor: libraryData.find((l) => l.type === hoveredItem)?.color }} />
                    <strong>{hoveredItem}</strong>: {libraryData.find((l) => l.type === hoveredItem)?.count} Judul ({libraryData.find((l) => l.type === hoveredItem)?.pct}%)
                  </>
                ) : (
                  <>
                    <span className="dot-pulse-blue" />
                    <span>Arahkan kursor pada batang untuk melihat rincian</span>
                  </>
                )}
              </div>
            </div>

            {/* Vertical Bar Canvas Container with Y-Axis and Gridlines */}
            <div className="vbar-canvas-scroll">
              <div className="vbar-canvas-wrap">
                {/* Y-Axis Scale Marks & Gridlines Layer (Max 60 Judul) */}
                <div className="vbar-grid-layer" aria-hidden="true">
                  <div className="vbar-grid-line"><span className="vbar-y-label">60</span></div>
                  <div className="vbar-grid-line"><span className="vbar-y-label">40</span></div>
                  <div className="vbar-grid-line"><span className="vbar-y-label">20</span></div>
                  <div className="vbar-grid-line baseline"><span className="vbar-y-label">0</span></div>
                </div>

                {/* 4 Vertical Bars Standing Upwards */}
                <div className="vbar-columns-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)', maxWidth: '880px', margin: '0 auto' }}>
                  {libraryData.map((item, idx) => {
                    const isHovered = hoveredItem === item.type;
                    // Max scale is 60 for 100% height headroom
                    const barHeightPct = Math.min(100, Math.max(12, (item.count / 60) * 100));

                    return (
                      <div
                        key={item.type}
                        className={`vbar-col-item ${isHovered ? 'hovered' : ''}`}
                        onMouseEnter={() => setHoveredItem(item.type)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <div className="vbar-track-wrap">
                          <div className="vbar-val-bubble" style={{ color: item.color }}>
                            <strong>{item.count}</strong>
                            <span className="vbar-pct-text">{item.pct}%</span>
                          </div>

                          <div
                            className="vbar-fill-bar"
                            style={{
                              width: '56px',
                              height: `${barHeightPct}%`,
                              background: `linear-gradient(180deg, ${item.color} 0%, ${item.color}dd 100%)`,
                              boxShadow: isHovered ? `0 8px 24px ${item.color}70` : `0 3px 10px ${item.color}30`,
                            }}
                          >
                            <span className="vbar-rank-tag">#{idx + 1}</span>
                          </div>
                        </div>

                        <div className="vbar-col-footer">
                          <div className="vbar-dot-icon" style={{ backgroundColor: `${item.color}15`, color: item.color, borderColor: `${item.color}35` }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                          </div>
                          <span className="vbar-name-label" title={item.type}>
                            {item.type}
                          </span>
                          <Link href={item.href} className="vbar-link-btn" title={`Buka ${item.type}`}>
                            <span>Buka &rarr;</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Additional Library Highlight */}
            <div className="chart-highlight-box" style={{ marginTop: '16px' }}>
              <div className="highlight-icon" style={{ color: '#8b5cf6' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div className="highlight-content">
                <strong>Ketersediaan Digital & Pratinjau Sampel Naskah:</strong> Seluruh 142 koleksi perpustakaan telah terdata dengan nomor klasifikasi bibliografi resmi (Dewey/ISBN). Naskah digital (e-book & naskah Taskap) dilengkapi sampel pratinjau 10–25 halaman yang dapat dibaca langsung oleh Serdik secara interaktif.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: VERTICAL BAR CHART - KEPANGKATAN TENAGA PENDIDIK (16 PERSONEL)    */}
      {/* ========================================================================= */}
      {activeTab === 'gadik' && (
        <div className="chart-view-panel">
          <div className="vbar-chart-card">
            <div className="vbar-chart-header">
              <div>
                <span className="vbar-chart-title">Diagram Batang Vertikal Kepangkatan Gadik Polri (16 Personel)</span>
                <span className="vbar-chart-sub">Rekapitulasi kepangkatan tenaga pendidik fungsional Polri Sespimma per Oktober 2026</span>
              </div>
              <div className="vbar-active-pill">
                {hoveredItem ? (
                  <>
                    <span className="dot-pulse-blue" style={{ backgroundColor: rankData.find((r) => r.rank === hoveredItem)?.color }} />
                    <strong>{hoveredItem}</strong>: {rankData.find((r) => r.rank === hoveredItem)?.count} Personel ({rankData.find((r) => r.rank === hoveredItem)?.pct}%)
                  </>
                ) : (
                  <>
                    <span className="dot-pulse-blue" />
                    <span>Arahkan kursor pada batang untuk melihat rincian</span>
                  </>
                )}
              </div>
            </div>

            {/* Vertical Bar Canvas Container with Y-Axis and Gridlines */}
            <div className="vbar-canvas-scroll">
              <div className="vbar-canvas-wrap">
                {/* Y-Axis Scale Marks & Gridlines Layer (Max 8 Personel) */}
                <div className="vbar-grid-layer" aria-hidden="true">
                  <div className="vbar-grid-line"><span className="vbar-y-label">8 Org</span></div>
                  <div className="vbar-grid-line"><span className="vbar-y-label">6 Org</span></div>
                  <div className="vbar-grid-line"><span className="vbar-y-label">4 Org</span></div>
                  <div className="vbar-grid-line"><span className="vbar-y-label">2 Org</span></div>
                  <div className="vbar-grid-line baseline"><span className="vbar-y-label">0</span></div>
                </div>

                {/* 4 Vertical Bars Standing Upwards */}
                <div className="vbar-columns-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)', maxWidth: '880px', margin: '0 auto' }}>
                  {rankData.map((rk, idx) => {
                    const isHovered = hoveredItem === rk.rank;
                    // Max scale is 8 for 100% height headroom
                    const barHeightPct = Math.min(100, Math.max(12, (rk.count / 8) * 100));

                    return (
                      <div
                        key={rk.rank}
                        className={`vbar-col-item ${isHovered ? 'hovered' : ''}`}
                        onMouseEnter={() => setHoveredItem(rk.rank)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <div className="vbar-track-wrap">
                          <div className="vbar-val-bubble" style={{ color: rk.color }}>
                            <strong>{rk.count} Org</strong>
                            <span className="vbar-pct-text">{rk.pct}%</span>
                          </div>

                          <div
                            className="vbar-fill-bar"
                            style={{
                              width: '56px',
                              height: `${barHeightPct}%`,
                              background: `linear-gradient(180deg, ${rk.color} 0%, ${rk.color}dd 100%)`,
                              boxShadow: isHovered ? `0 8px 24px ${rk.color}70` : `0 3px 10px ${rk.color}30`,
                            }}
                          >
                            <span className="vbar-rank-tag">#{idx + 1}</span>
                          </div>
                        </div>

                        <div className="vbar-col-footer">
                          <div className="vbar-dot-icon" style={{ backgroundColor: `${rk.color}15`, color: rk.color, borderColor: `${rk.color}35` }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: rk.color }} />
                          </div>
                          <span className="vbar-name-label" title={rk.rank}>
                            {rk.rank} ({rk.badge})
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{rk.role.split('&')[0].trim()}</span>
                          <Link href={rk.href} className="vbar-link-btn" title={`Buka ${rk.rank}`}>
                            <span>Lihat Profil &rarr;</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Additional Rank Highlight */}
            <div className="chart-highlight-box" style={{ marginTop: '16px' }}>
              <div className="highlight-icon" style={{ color: '#1d4ed8' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <polyline points="17 11 19 13 23 9" />
                </svg>
              </div>
              <div className="highlight-content">
                <strong>Kekuatan Tenaga Pendidik Sespimma:</strong> Sebanyak 16 personel Polri fungsional (Kombes Pol s.d Iptu) didukung oleh 12 praktisi ahli eksternal (total 28 tenaga pendidik resmi) bertugas mengampu doktrin kepemimpinan, manajemen taktis, dan bimbingan Taskap.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: VERTICAL BAR CHART - DISTRIBUSI 720 JP KURIKULUM                    */}
      {/* ========================================================================= */}
      {activeTab === 'kurikulum' && (
        <div className="chart-view-panel">
          <div className="vbar-chart-card">
            <div className="vbar-chart-header">
              <div>
                <span className="vbar-chart-title">Diagram Batang Vertikal Beban Kurikulum (720 JP)</span>
                <span className="vbar-chart-sub">Alokasi jam pelajaran (JP) pembelajaran kepemimpinan Polri ke atas</span>
              </div>
              <div className="vbar-active-pill">
                {hoveredItem ? (
                  <>
                    <span className="dot-pulse-blue" style={{ backgroundColor: curriculumData.find((c) => c.subject === hoveredItem)?.color }} />
                    <strong>{hoveredItem}</strong>: {curriculumData.find((c) => c.subject === hoveredItem)?.jp} JP ({curriculumData.find((c) => c.subject === hoveredItem)?.pct}%)
                  </>
                ) : (
                  <>
                    <span className="dot-pulse-blue" />
                    <span>Arahkan kursor pada batang untuk melihat rincian</span>
                  </>
                )}
              </div>
            </div>

            {/* Vertical Bar Canvas Container with Y-Axis and Gridlines */}
            <div className="vbar-canvas-scroll">
              <div className="vbar-canvas-wrap">
                {/* Y-Axis Scale Marks & Gridlines Layer (Max 260 JP) */}
                <div className="vbar-grid-layer" aria-hidden="true">
                  <div className="vbar-grid-line"><span className="vbar-y-label">250 JP</span></div>
                  <div className="vbar-grid-line"><span className="vbar-y-label">200 JP</span></div>
                  <div className="vbar-grid-line"><span className="vbar-y-label">150 JP</span></div>
                  <div className="vbar-grid-line"><span className="vbar-y-label">100 JP</span></div>
                  <div className="vbar-grid-line"><span className="vbar-y-label">50 JP</span></div>
                  <div className="vbar-grid-line baseline"><span className="vbar-y-label">0</span></div>
                </div>

                {/* 4 Vertical Bars Standing Upwards */}
                <div className="vbar-columns-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)', maxWidth: '880px', margin: '0 auto' }}>
                  {curriculumData.map((c, idx) => {
                    const isHovered = hoveredItem === c.subject;
                    // Max scale is 260 for 100% height headroom
                    const barHeightPct = Math.min(100, Math.max(12, (c.jp / 260) * 100));

                    return (
                      <div
                        key={c.subject}
                        className={`vbar-col-item ${isHovered ? 'hovered' : ''}`}
                        onMouseEnter={() => setHoveredItem(c.subject)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <div className="vbar-track-wrap">
                          <div className="vbar-val-bubble" style={{ color: c.color }}>
                            <strong>{c.jp} JP</strong>
                            <span className="vbar-pct-text">{c.pct}%</span>
                          </div>

                          <div
                            className="vbar-fill-bar"
                            style={{
                              width: '56px',
                              height: `${barHeightPct}%`,
                              background: `linear-gradient(180deg, ${c.color} 0%, ${c.color}dd 100%)`,
                              boxShadow: isHovered ? `0 8px 24px ${c.color}70` : `0 3px 10px ${c.color}30`,
                            }}
                          >
                            <span className="vbar-rank-tag">#{idx + 1}</span>
                          </div>
                        </div>

                        <div className="vbar-col-footer">
                          <div className="vbar-dot-icon" style={{ backgroundColor: `${c.color}15`, color: c.color, borderColor: `${c.color}35` }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: c.color }} />
                          </div>
                          <span className="vbar-name-label" title={c.subject}>
                            {c.shortTitle}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{c.desc.split(',')[0].trim()}</span>
                          <Link href={c.href} className="vbar-link-btn" title={`Buka ${c.subject}`}>
                            <span>Lihat Silabus &rarr;</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Additional Curriculum Highlight */}
            <div className="chart-highlight-box" style={{ marginTop: '16px' }}>
              <div className="highlight-icon" style={{ color: '#059669' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="highlight-content">
                <strong>Standar Kelulusan Lemdiklat Polri:</strong> Setiap peserta didik diwajibkan menyelesaikan total 720 JP pembelajaran tatap muka, diskusi kelompok, simulasi taktis, dan penyusunan naskah kepemimpinan Taskap.
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
