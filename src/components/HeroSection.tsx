'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BrandLogo } from './BrandLogo';

interface HeroSectionProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  onSearchSubmit?: (e?: React.FormEvent) => void;
  onQuickTagClick?: (tag: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery = '',
  onSearchChange,
  onSearchSubmit,
  onQuickTagClick,
}) => {
  const [activeVisual, setActiveVisual] = useState<'campus' | 'learning'>('campus');
  const [isImageZoomed, setIsImageZoomed] = useState<boolean>(false);

  const quickTags = [
    { label: 'Hanjar Kepemimpinan', query: 'Hanjar' },
    { label: 'Kurikulum 720 JP', query: 'Kurikulum' },
    { label: 'SOP Sidang Taskap', query: 'SOP' },
    { label: 'E-Library & Pustaka', query: 'Buku' },
  ];

  const handleTagClick = (query: string) => {
    if (onQuickTagClick) {
      onQuickTagClick(query);
    } else if (onSearchChange) {
      onSearchChange(query);
    }
    const el = document.getElementById('koleksi-terkini');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(e);
    }
    const el = document.getElementById('koleksi-terkini');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-card hero-card-clean" aria-labelledby="hero-title">
      {/* Decorative ambient lighting & subtle pattern */}
      <div className="hero-ambient-glow-1" aria-hidden="true" />
      <div className="hero-ambient-glow-2" aria-hidden="true" />
      <div className="hero-pattern-overlay" aria-hidden="true" />

      <div className="hero-layout">
        {/* Left Column: Clean & Focused Identity, Search & CTAs */}
        <div className="hero-left-column">
          {/* Institutional Ribbon */}
          <div className="hero-badge-ribbon">
            <div className="hero-badge-gold">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
              </svg>
              <span>PKN TINGKAT II ANGKATAN XXIX NAWASENA</span>
            </div>
            <div className="hero-badge-blue">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>SESPIMMA LEMDIKLAT POLRI</span>
            </div>
          </div>

          {/* Large Prominent Official Logo */}
          <div className="hero-brand-clean">
            <div className="hero-logo-box">
              <BrandLogo size="2xl" clickable={false} />
            </div>
          </div>

          {/* Subtitle & Tagline Group */}
          <div className="hero-clean-tagline-group">
            <h1 id="hero-title" className="hero-clean-expansion">
              Sistem Informasi Pembelajaran <span className="highlight-gold">INovatif</span> Terpadu, <span className="highlight-gold">Adaptif</span>, dan <span className="highlight-gold">Responsif</span>
            </h1>
            <p className="hero-clean-slogan">
              &ldquo;Mengintegrasikan Pengetahuan, Mengaselerasikan Kepemimpinan&rdquo;
            </p>
          </div>

          {/* Clean Integrated Search Box */}
          <form className="hero-search-wrapper" onSubmit={handleSubmit} role="search" aria-label="Pencarian Sumber Belajar">
            <div className="hero-search-input-group">
              <svg className="hero-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="hero-search-input"
                placeholder="Cari materi hanjar, kurikulum, SOP, buku pustaka, atau gadik..."
                value={searchQuery}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                aria-label="Cari sumber belajar"
              />
              <button type="submit" className="hero-search-button">
                <span>Cari</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            {/* Clean Quick Suggestion Pills */}
            <div className="hero-quick-tags" aria-label="Kata kunci pencarian populer">
              <span className="hero-quick-label">Pilihan Cepat:</span>
              {quickTags.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  className="hero-quick-pill"
                  onClick={() => handleTagClick(t.query)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </form>

          {/* Clean Action CTAs */}
          <div className="hero-actions">
            <a href="#kategori" className="btn-hero-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span>Jelajahi 8 Kategori</span>
            </a>

            <Link href="/search" className="btn-hero-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>Pencarian Terpadu</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Visual Cinema Frame & Live Stats HUD */}
        <div className="hero-right-column">
          <div className="hero-command-card hero-command-card-clean">
            {/* Visual Showcase Deck with Switcher */}
            <div className="hero-visual-deck">
              <div className="hero-visual-tabs">
                <button
                  type="button"
                  className={`hero-visual-tab ${activeVisual === 'campus' ? 'active' : ''}`}
                  onClick={() => setActiveVisual('campus')}
                  aria-label="Lihat Gedung Sespimma"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18" />
                    <path d="M5 21V7l7-4 7 4v14" />
                    <path d="M9 10h1" />
                    <path d="M9 14h1" />
                    <path d="M14 10h1" />
                    <path d="M14 14h1" />
                  </svg>
                  <span>Gedung Sespimma</span>
                </button>
                <button
                  type="button"
                  className={`hero-visual-tab ${activeVisual === 'learning' ? 'active' : ''}`}
                  onClick={() => setActiveVisual('learning')}
                  aria-label="Lihat Suasana Belajar Serdik"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                  <span>Suasana Belajar</span>
                </button>
              </div>

              {/* Visual Display Frame */}
              <div
                className="hero-image-frame hero-image-frame-clean"
                onClick={() => setIsImageZoomed(true)}
                title="Klik untuk memperbesar gambar"
              >
                <Image
                  src={
                    activeVisual === 'campus'
                      ? '/hero-sespimma-campus.jpg'
                      : '/hero-sespimma-learning.webp'
                  }
                  alt={
                    activeVisual === 'campus'
                      ? 'Gedung Sespimma Lemdiklat Polri dan Peserta Didik'
                      : 'Suasana Belajar Digital Serdik Sespimma Lemdiklat Polri'
                  }
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 520px"
                  style={{ objectFit: 'cover' }}
                  className="hero-image-media"
                />
                <div className="hero-image-gradient" />
                <div className="hero-image-caption">
                  <span className="hero-image-badge hero-image-badge-gold">
                    {activeVisual === 'campus' ? 'KAMPUS SESPIMMA POLRI' : 'SUASANA BELAJAR SERDIK'}
                  </span>
                  <p className="hero-image-text">
                    {activeVisual === 'campus'
                      ? 'Gedung Sespimma Lemdiklat Polri & Perwira Peserta Didik'
                      : 'Ruang Kolaborasi Belajar Digital Siswa & Serdik Sespimma'}
                  </p>
                </div>
                <div className="hero-image-zoom-pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                  <span>Perbesar</span>
                </div>
              </div>
            </div>

            {/* 4 Key Metrics Grid HUD */}
            <div className="hero-stat-grid">
              <a href="#koleksi-terkini" className="hero-stat-tile hero-stat-tile-blue" title="Lihat semua sumber belajar">
                <div className="hero-stat-icon-wrap" style={{ color: '#60a5fa' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
                <div>
                  <div className="hero-stat-number">316</div>
                  <div className="hero-stat-label">Sumber Belajar</div>
                </div>
              </a>

              <Link href="/gadik" className="hero-stat-tile hero-stat-tile-green" title="Lihat direktori tenaga pendidik">
                <div className="hero-stat-icon-wrap" style={{ color: '#34d399' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <div className="hero-stat-number">28</div>
                  <div className="hero-stat-label">Tenaga Pendidik</div>
                </div>
              </Link>

              <Link href="/modul" className="hero-stat-tile hero-stat-tile-amber" title="Lihat modul dan bahan ajar">
                <div className="hero-stat-icon-wrap" style={{ color: '#fbbf24' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <div>
                  <div className="hero-stat-number">64</div>
                  <div className="hero-stat-label">Modul & Hanjar</div>
                </div>
              </Link>

              <Link href="/library" className="hero-stat-tile hero-stat-tile-purple" title="Lihat koleksi perpustakaan & Taskap">
                <div className="hero-stat-icon-wrap" style={{ color: '#c084fc' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l9 4.9V17L12 22 3 17V6.9z" />
                    <path d="M12 22V12" />
                  </svg>
                </div>
                <div>
                  <div className="hero-stat-number">142</div>
                  <div className="hero-stat-label">Koleksi Pustaka</div>
                </div>
              </Link>
            </div>

            {/* Project Leader Honor Ribbon */}
            <div className="hero-leader-card">
              <div className="hero-leader-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>PROYEK PERUBAHAN</span>
              </div>
              <div className="hero-leader-info">
                <div className="hero-leader-name">DEWI SUSILO PANGESTUTI, S.Ak</div>
                <div className="hero-leader-class">Peserta PKN Tingkat II Angkatan XXIX Nawasena TA 2026</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isImageZoomed && (
        <div
          className="hero-lightbox-overlay"
          onClick={() => setIsImageZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Tampilan Penuh Ilustrasi Sespimma"
        >
          <div className="hero-lightbox-card" onClick={(e) => e.stopPropagation()}>
            <div className="hero-lightbox-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>{activeVisual === 'campus' ? '🏛️' : '🎓'}</span>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    {activeVisual === 'campus'
                      ? 'Gedung Sespimma Lemdiklat Polri & Peserta Didik'
                      : 'Suasana Belajar Digital Siswa / Serdik Sespimma'}
                  </h3>
                  <p style={{ fontSize: '11.5px', color: '#cbd5e1', margin: '2px 0 0' }}>
                    Dokumentasi Resmi SiPINTAR Sespimma Lemdiklat Polri
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="hero-lightbox-close"
                onClick={() => setIsImageZoomed(false)}
                aria-label="Tutup pratinjau"
              >
                ✕
              </button>
            </div>
            <div className="hero-lightbox-media">
              <Image
                src={
                  activeVisual === 'campus'
                    ? '/hero-sespimma-campus.jpg'
                    : '/hero-sespimma-learning.webp'
                }
                alt="Ilustrasi Visual Sespimma"
                width={1280}
                height={720}
                style={{ width: '100%', height: 'auto', borderRadius: '8px', display: 'block' }}
                priority
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
