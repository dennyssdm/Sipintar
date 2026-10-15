'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeroHeaderProps {
  title: string;
  description: string;
  badgeText?: string;
  countLabel?: string;
  countValue?: number | string;
  defaultVisual?: 'campus' | 'learning';
  breadcrumbs?: BreadcrumbItem[];
}

export const PageHeroHeader: React.FC<PageHeroHeaderProps> = ({
  title,
  description,
  badgeText = 'Kategori Resmi Sespimma Lemdiklat Polri',
  countLabel = 'Berkas Terdaftar',
  countValue,
  defaultVisual = 'learning',
  breadcrumbs,
}) => {
  const [activeVisual, setActiveVisual] = useState<'campus' | 'learning'>(defaultVisual);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  return (
    <header className="page-hero-banner" aria-label={`Header Halaman ${title}`}>
      {/* Decorative ambient lighting & grid patterns */}
      <div className="hero-ambient-glow-1" aria-hidden="true" />
      <div className="hero-ambient-glow-2" aria-hidden="true" />
      <div className="hero-pattern-overlay" aria-hidden="true" />

      <div className="page-hero-inner">
        {/* Left Side: Context, Breadcrumbs, Title, Description, and Stats */}
        <div className="page-hero-content">
          {/* Top Ribbons: Breadcrumbs + Institutional Badges */}
          <div className="page-hero-ribbon">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav aria-label="Breadcrumb" className="page-hero-breadcrumbs">
                {breadcrumbs.map((bc, idx) => {
                  const isLast = idx === breadcrumbs.length - 1;
                  return (
                    <span key={idx} className="page-hero-bc-item">
                      {idx > 0 && <span className="page-hero-bc-separator">/</span>}
                      {bc.href && !isLast ? (
                        <Link href={bc.href} className="page-hero-bc-link">
                          {bc.label}
                        </Link>
                      ) : (
                        <span className="page-hero-bc-current">{bc.label}</span>
                      )}
                    </span>
                  );
                })}
              </nav>
            )}

            <div className="page-hero-tags">
              <span className="page-hero-tag-gold">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="8" r="6" />
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                </svg>
                PKN II ANGKATAN XXIX NAWASENA
              </span>
              <span className="page-hero-tag-blue">
                SESPIMMA LEMDIKLAT POLRI
              </span>
            </div>
          </div>

          {/* Subtitle / Category Kicker */}
          <div className="page-hero-kicker">
            <span className="page-hero-kicker-dot" />
            <span>{badgeText}</span>
          </div>

          {/* Main Title */}
          <h1 className="page-hero-title">{title}</h1>

          {/* Descriptive text */}
          <p className="page-hero-desc">{description}</p>

          {/* Bottom stats & quick reassurance */}
          <div className="page-hero-meta-row">
            {countValue !== undefined && (
              <div className="page-hero-stat-badge">
                <span className="page-hero-stat-number">{countValue}</span>
                <span className="page-hero-stat-label">{countLabel}</span>
              </div>
            )}

            <div className="page-hero-meta-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Dokumen Resmi Terverifikasi</span>
            </div>

            <div className="page-hero-meta-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Akses Cepat Serdik & Gadik</span>
            </div>
          </div>
        </div>

        {/* Right Side: Sespimma Visual Illustration Showcase (Gedung & Suasana Belajar) */}
        <div className="page-hero-visual-card">
          <div className="page-hero-visual-tabs">
            <button
              type="button"
              className={`page-hero-tab-btn ${activeVisual === 'learning' ? 'active' : ''}`}
              onClick={() => setActiveVisual('learning')}
              aria-label="Tampilkan Suasana Belajar Serdik"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <span>Suasana Belajar Siswa</span>
            </button>

            <button
              type="button"
              className={`page-hero-tab-btn ${activeVisual === 'campus' ? 'active' : ''}`}
              onClick={() => setActiveVisual('campus')}
              aria-label="Tampilkan Gedung Sespimma"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 21h18" />
                <path d="M5 21V7l7-4 7 4v14" />
                <path d="M9 10h1" />
                <path d="M9 14h1" />
                <path d="M14 10h1" />
                <path d="M14 14h1" />
              </svg>
              <span>Gedung Sespimma</span>
            </button>
          </div>

          {/* Visual Showcase Media */}
          <div
            className="page-hero-visual-frame"
            onClick={() => setIsZoomed(true)}
            title="Klik untuk memperbesar gambar ilustrasi"
          >
            <Image
              src={
                activeVisual === 'campus'
                  ? '/hero-sespimma-campus.webp'
                  : '/hero-sespimma-learning.webp'
              }
              alt={
                activeVisual === 'campus'
                  ? 'Gedung Sespimma Lemdiklat Polri dan Peserta Didik'
                  : 'Suasana Belajar Digital Siswa/Peserta Didik Sespimma'
              }
              fill
              sizes="(max-width: 768px) 100vw, 360px"
              style={{ objectFit: 'cover' }}
              className="page-hero-visual-img"
              priority
            />
            <div className="page-hero-visual-overlay" />
            <div className="page-hero-visual-caption">
              <span className="page-hero-visual-badge">
                {activeVisual === 'campus' ? 'KAMPUS SESPIMMA POLRI' : 'SUASANA BELAJAR SERDIK'}
              </span>
              <p className="page-hero-visual-text">
                {activeVisual === 'campus'
                  ? 'Gedung Sespimma Lemdiklat Polri'
                  : 'Siswa / Peserta Didik Aktif Belajar'}
              </p>
            </div>
            <div className="page-hero-zoom-icon" aria-hidden="true">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Dialog */}
      {isZoomed && (
        <div
          className="hero-lightbox-overlay"
          onClick={() => setIsZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Pratinjau Gambar Ilustrasi Sespimma"
        >
          <div className="hero-lightbox-card" onClick={(e) => e.stopPropagation()}>
            <div className="hero-lightbox-header">
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
                  {activeVisual === 'campus'
                    ? 'Gedung Sespimma Lemdiklat Polri & Peserta Didik'
                    : 'Suasana Belajar Digital Siswa / Peserta Didik Sespimma'}
                </h3>
                <p style={{ fontSize: '12px', color: '#cbd5e1' }}>
                  Ilustrasi Resmi Ekosistem Pembelajaran SiPINTAR Sespimma Lemdiklat Polri
                </p>
              </div>
              <button
                type="button"
                className="hero-lightbox-close"
                onClick={() => setIsZoomed(false)}
                aria-label="Tutup pratinjau gambar"
              >
                ✕
              </button>
            </div>
            <div className="hero-lightbox-media">
              <Image
                src={
                  activeVisual === 'campus'
                    ? '/hero-sespimma-campus.webp'
                    : '/hero-sespimma-learning.webp'
                }
                alt="Ilustrasi Visual Sespimma"
                width={1100}
                height={620}
                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default PageHeroHeader;
