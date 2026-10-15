'use client';

import React, { useState, useMemo } from 'react';
import { CATEGORIES_DATA, ADMIN_SHORTCUTS, MOCK_RESOURCES } from '@/data/mockData';
import { ResourceCard } from '@/components/ResourceCard';
import { ResourceDetailModal } from '@/components/ResourceDetailModal';
import { AdminActionModal } from '@/components/AdminActionModal';
import HeroSection from '@/components/HeroSection';
import { ResourceItem, AdminShortcut } from '@/types';

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [selectedShortcut, setSelectedShortcut] = useState<AdminShortcut | null>(null);

  const filterTabs = [
    'Semua',
    'Modul & Hanjar',
    'E-Library/Perpustakaan',
    'Gadik & Kompetensi',
    'SOP',
    'Pedoman',
  ];

  const filteredResources = useMemo(() => {
    return MOCK_RESOURCES.filter((res) => {
      const matchCategory =
        activeFilter === 'Semua' || res.category === activeFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        res.title.toLowerCase().includes(q) ||
        res.description.toLowerCase().includes(q) ||
        res.authorOrInstructor.toLowerCase().includes(q) ||
        res.unitOrSource.toLowerCase().includes(q) ||
        res.tags?.some((t) => t.toLowerCase().includes(q));

      return matchCategory && matchSearch;
    });
  }, [activeFilter, searchQuery]);

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
    <div>
      {/* Detail Modals for interactive exploration */}
      <ResourceDetailModal
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
      />

      <AdminActionModal
        shortcut={selectedShortcut}
        onClose={() => setSelectedShortcut(null)}
      />

      {/* Hero / Welcome Panel System */}
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={(val) => setSearchQuery(val)}
        onSearchSubmit={() => {
          const el = document.getElementById('koleksi-terkini');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onQuickTagClick={(tag) => {
          setSearchQuery(tag);
          setActiveFilter('Semua');
        }}
      />

      {/* Admin Shortcuts Strip with interactive prototype trigger */}
      <section className="admin-section" aria-labelledby="admin-strip-title">
        <div className="admin-header">
          <div>
            <h2 id="admin-strip-title" className="section-title">
              Pusat Kendali Administrator
            </h2>
            <p className="section-subtitle">
              Pintasan cepat tata kelola data, verifikasi naskah, matriks hak akses, dan monitoring (Klik untuk pratinjau alur)
            </p>
          </div>
          <span
            style={{
              fontSize: '11px',
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
            }}
          >
            Akses Tata Kelola
          </span>
        </div>

        <div className="admin-grid">
          {ADMIN_SHORTCUTS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="admin-card"
              onClick={() => setSelectedShortcut(item)}
              style={{ textAlign: 'left', cursor: 'pointer', border: '1px solid var(--color-border-subtle)' }}
              title={`Buka alur simulasi ${item.title}`}
            >
              <div className="admin-card-header">
                <span className="admin-card-title">{item.title}</span>
                {item.badgeCount ? (
                  <span
                    style={{
                      fontSize: '11px',
                      backgroundColor: 'var(--color-warning-bg)',
                      color: 'var(--color-warning)',
                      padding: '2px 7px',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 700,
                    }}
                  >
                    {item.badgeCount} Perlu Aksi
                  </span>
                ) : null}
              </div>
              <p className="admin-card-desc">{item.description}</p>
              <div style={{ marginTop: '8px', fontSize: '11.5px', color: 'var(--color-primary)', fontWeight: 600 }}>
                Lihat Alur &rarr;
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Category Cards Section */}
      <section id="kategori" aria-labelledby="kategori-title" style={{ marginBottom: '32px' }}>
        <div className="section-header">
          <div>
            <h2 id="kategori-title" className="section-title">
              Kategori Sumber Belajar
            </h2>
            <p className="section-subtitle">
              Klasifikasi taksonomi resmi sesuai Buku Panduan Tata Kelola SIPINTAR
            </p>
          </div>
        </div>

        <div className="categories-grid">
          {CATEGORIES_DATA.map((cat) => (
            <div key={cat.category} className="category-card">
              <div className="category-card-top">
                <div className="category-icon-box" aria-hidden="true">
                  {renderCategoryIcon(cat.icon)}
                </div>
                <span className="category-badge-count">{cat.count} Berkas</span>
              </div>
              <h3 className="category-title">{cat.title}</h3>
              <p className="category-desc">{cat.description}</p>
              <button
                type="button"
                onClick={() => {
                  setActiveFilter(cat.category === 'Pencarian Terpadu' ? 'Semua' : cat.category);
                  const el = document.getElementById('koleksi-terkini');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="category-footer-link"
                style={{ textAlign: 'left', background: 'transparent' }}
              >
                <span>Filter Kategori Ini</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Unified Search & Recent Resources Section */}
      <section id="koleksi-terkini" aria-labelledby="recent-title" style={{ marginBottom: '32px' }}>
        <div className="section-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 id="recent-title" className="section-title">
              Pembaruan & Pratinjau Sumber Belajar
            </h2>
            <p className="section-subtitle">
              Eksplorasi materi terverifikasi dan koleksi pustaka terdaftar secara interaktif
            </p>
          </div>

          {/* Inline Quick Search Filter */}
          <div style={{ maxWidth: '300px', width: '100%' }}>
            <input
              type="text"
              placeholder="Saring koleksi di halaman ini..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              style={{ fontSize: '12.5px', padding: '8px 12px' }}
              aria-label="Saring koleksi"
            />
          </div>
        </div>

        {/* Filter Category Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '12px',
            marginBottom: '16px',
          }}
          role="tablist"
          aria-label="Pilihan Kategori"
        >
          {filterTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeFilter === tab}
              onClick={() => setActiveFilter(tab)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '12.5px',
                fontWeight: 600,
                border: '1px solid',
                borderColor: activeFilter === tab ? 'var(--color-primary)' : 'var(--color-border)',
                backgroundColor: activeFilter === tab ? 'var(--color-primary-light)' : 'var(--color-surface)',
                color: activeFilter === tab ? 'var(--color-primary)' : 'var(--color-text-muted)',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Resource Grid / Empty State */}
        {filteredResources.length > 0 ? (
          <div className="resource-grid">
            {filteredResources.map((res) => (
              <ResourceCard
                key={res.id}
                resource={res}
                onSelect={(item) => setSelectedResource(item)}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              backgroundColor: 'var(--color-surface)',
              border: '1px dashed var(--color-border)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '4px' }}>
              Tidak ada sumber belajar yang cocok
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              Tidak ditemukan hasil untuk kata kunci &quot;{searchQuery}&quot; pada kategori {activeFilter}.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('Semua');
              }}
              className="btn-primary"
              style={{
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                margin: '0 auto',
              }}
            >
              Reset Filter & Pencarian
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
