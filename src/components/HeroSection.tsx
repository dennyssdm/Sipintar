'use client';

import React from 'react';
import Link from 'next/link';
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

          {/* Large Prominent Official Logo - Maximum Available Space */}
          <div className="hero-brand-clean hero-brand-max">
            <div className="hero-logo-box hero-logo-box-max">
              <BrandLogo size="max" fluid={true} clickable={false} />
            </div>
          </div>

          {/* Subtitle & Tagline Group */}
          <div className="hero-clean-tagline-group">
            <h1 id="hero-title" className="hero-clean-expansion">
              Sistem Informasi Pembelajaran <span className="highlight-gold">INovatif</span> Terpadu, <span className="highlight-gold">Adaptif</span>, dan <span className="highlight-gold">Responsif</span>
            </h1>
            <p className="hero-clean-slogan">
              &ldquo;Mengintegrasikan Pengetahuan, Mengakselerasikan Kepemimpinan&rdquo;
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

        {/* Right Column: Live Stats HUD, 4 Pillars & Leadership Plaque */}
        <div className="hero-right-column">
          <div className="hero-command-card hero-command-card-clean">
            {/* Header Ringkasan */}
            <div className="hero-command-header">
              <div>
                <span className="hero-command-kicker">PUSAT INFORMASI SISTEM</span>
                <div className="hero-command-title">Ringkasan Ekosistem Sumber Belajar</div>
              </div>
              <div className="hero-live-pill">
                <span className="hero-live-dot" />
                <span>AKTIF</span>
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

            {/* 4 Pillars of Excellence (IN-T-A-R) */}
            <div className="hero-pillars-box">
              <div className="hero-pillars-header">
                <span className="hero-pillars-title">4 PILAR KEUNGGULAN (IN-T-A-R)</span>
              </div>
              <div className="hero-pillars-grid">
                <div className="hero-pillar-item" title="Digitalisasi materi kepemimpinan modern">
                  <span className="hero-pillar-code">IN</span>
                  <div>
                    <div className="hero-pillar-name">INovatif</div>
                    <div className="hero-pillar-desc">Digitalisasi materi kepemimpinan</div>
                  </div>
                </div>
                <div className="hero-pillar-item" title="Integrasi 8 taksonomi sumber belajar">
                  <span className="hero-pillar-code">T</span>
                  <div>
                    <div className="hero-pillar-name">Terpadu</div>
                    <div className="hero-pillar-desc">Integrasi 8 taksonomi sumber</div>
                  </div>
                </div>
                <div className="hero-pillar-item" title="Relevan menjawab tantangan pemolisian">
                  <span className="hero-pillar-code">A</span>
                  <div>
                    <div className="hero-pillar-name">Adaptif</div>
                    <div className="hero-pillar-desc">Relevan menjawab tantangan</div>
                  </div>
                </div>
                <div className="hero-pillar-item" title="Akses cepat, transparan, dan akuntabel">
                  <span className="hero-pillar-code">R</span>
                  <div>
                    <div className="hero-pillar-name">Responsif</div>
                    <div className="hero-pillar-desc">Akses cepat & akuntabel</div>
                  </div>
                </div>
              </div>
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
    </section>
  );
};

export default HeroSection;
