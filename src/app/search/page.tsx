'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MOCK_RESOURCES } from '@/data/mockData';
import { ResourceCard } from '@/components/ResourceCard';
import { ResourceDetailModal } from '@/components/ResourceDetailModal';
import { PageHeroHeader } from '@/components/PageHeroHeader';
import { ResourceItem } from '@/types';

function SearchContent({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedLifecycle, setSelectedLifecycle] = useState<string>('Semua');
  const [selectedAccess, setSelectedAccess] = useState<string>('Semua');
  const [digitalOnly, setDigitalOnly] = useState<string>('Semua');
  const [sortBy, setSortBy] = useState<'terbaru' | 'terlama' | 'judul'>('terbaru');
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);



  const categories = [
    'Semua',
    'Modul & Hanjar',
    'E-Library/Perpustakaan',
    'Gadik & Kompetensi',
    'Kurikulum & Standar Layanan',
    'SOP',
    'Pedoman',
    'Manual Book',
  ];

  const searchResults = useMemo(() => {
    let list = MOCK_RESOURCES.filter((res) => {
      // Category filter
      const matchCat =
        selectedCategory === 'Semua' || res.category === selectedCategory;

      // Lifecycle filter
      const matchLife =
        selectedLifecycle === 'Semua' || res.lifecycle === selectedLifecycle;

      // Access filter
      const matchAccess =
        selectedAccess === 'Semua' || res.access === selectedAccess;

      // Digital availability filter
      const matchDigital =
        digitalOnly === 'Semua' ||
        (digitalOnly === 'digital' ? res.hasDigitalFile : !res.hasDigitalFile);

      // Query filter
      const q = query.toLowerCase().trim();
      const matchQuery =
        !q ||
        res.title.toLowerCase().includes(q) ||
        res.description.toLowerCase().includes(q) ||
        res.authorOrInstructor.toLowerCase().includes(q) ||
        res.unitOrSource.toLowerCase().includes(q) ||
        res.competencies?.some((c) => c.toLowerCase().includes(q)) ||
        res.tags?.some((t) => t.toLowerCase().includes(q));

      return matchCat && matchLife && matchAccess && matchDigital && matchQuery;
    });

    if (sortBy === 'terbaru') {
      list = [...list].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    } else if (sortBy === 'terlama') {
      list = [...list].sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
    } else if (sortBy === 'judul') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [query, selectedCategory, selectedLifecycle, selectedAccess, digitalOnly, sortBy]);

  const resetAllFilters = () => {
    setQuery('');
    setSelectedCategory('Semua');
    setSelectedLifecycle('Semua');
    setSelectedAccess('Semua');
    setDigitalOnly('Semua');
    setSortBy('terbaru');
  };

  return (
    <div>
      <ResourceDetailModal
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
      />

      {/* Institutional Hero Banner with Sespimma Visual Switcher & Breadcrumbs */}
      <PageHeroHeader
        title="Pencarian Terpadu Sumber Belajar"
        description="Telusuri seluruh khazanah pengetahuan kepolisian Sespimma Lemdiklat Polri secara lintas-kategori: modul pokok, hanjar, buku fisik perpustakaan, karya tulis Taskap, hingga profil kompetensi gadik."
        badgeText="Pencarian Terpadu Multi-Kategori SiPINTAR"
        countValue={searchResults.length}
        countLabel="Hasil Ditemukan"
        defaultVisual="learning"
        breadcrumbs={[
          { label: 'Beranda', href: '/' },
          { label: 'Pencarian Terpadu' },
        ]}
      />

      {/* Main Search Panel */}
      <section
        aria-label="Formulir Pencarian dan Filter Terpadu"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          marginBottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* Main Search Input */}
        <div style={{ position: 'relative' }}>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik kata kunci judul materi, nama pengampu, topik bahasan, atau unit kerja..."
            className="search-input"
            style={{ fontSize: '15px', padding: '14px 44px 14px 44px' }}
            aria-label="Kata kunci pencarian"
          />
          <span
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
              display: 'flex',
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Bersihkan kata kunci"
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
                padding: '4px',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '8px' }}>
            Kategori Sumber Belajar:
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }} role="tablist" aria-label="Kategori pencarian">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12.5px',
                  fontWeight: selectedCategory === cat ? 700 : 500,
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? 'var(--color-primary)' : 'var(--color-border)',
                  backgroundColor: selectedCategory === cat ? 'var(--color-primary-light)' : 'var(--color-surface)',
                  color: selectedCategory === cat ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Filter Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            paddingTop: '12px',
            borderTop: '1px solid var(--color-border-subtle)',
          }}
        >
          {/* Status Siklus */}
          <div>
            <label htmlFor="filter-lifecycle" style={{ display: 'block', fontSize: '11.5px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
              Status Siklus:
            </label>
            <select
              id="filter-lifecycle"
              value={selectedLifecycle}
              onChange={(e) => setSelectedLifecycle(e.target.value)}
              style={{
                width: '100%',
                fontSize: '12.5px',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-main)',
              }}
            >
              <option value="Semua">Semua Status Siklus</option>
              <option value="Dipublikasikan">Dipublikasikan</option>
              <option value="Diverifikasi">Diverifikasi</option>
              <option value="Draft">Draft</option>
              <option value="Arsip">Arsip</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
          </div>

          {/* Klasifikasi Akses */}
          <div>
            <label htmlFor="filter-access" style={{ display: 'block', fontSize: '11.5px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
              Klasifikasi Akses:
            </label>
            <select
              id="filter-access"
              value={selectedAccess}
              onChange={(e) => setSelectedAccess(e.target.value)}
              style={{
                width: '100%',
                fontSize: '12.5px',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-main)',
              }}
            >
              <option value="Semua">Semua Klasifikasi</option>
              <option value="Terbuka">Terbuka</option>
              <option value="Internal">Internal</option>
              <option value="Terbatas">Terbatas</option>
              <option value="Metadata Saja">Metadata Saja</option>
            </select>
          </div>

          {/* Ketersediaan Berkas Digital */}
          <div>
            <label htmlFor="filter-digital" style={{ display: 'block', fontSize: '11.5px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
              Bentuk Fisik / Berkas:
            </label>
            <select
              id="filter-digital"
              value={digitalOnly}
              onChange={(e) => setDigitalOnly(e.target.value)}
              style={{
                width: '100%',
                fontSize: '12.5px',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-main)',
              }}
            >
              <option value="Semua">Semua Bentuk</option>
              <option value="digital">Hanya Berkas Digital</option>
              <option value="physical">Koleksi Fisik / Metadata Saja</option>
            </select>
          </div>

          {/* Urutan */}
          <div>
            <label htmlFor="filter-sort" style={{ display: 'block', fontSize: '11.5px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
              Urutkan Berdasarkan:
            </label>
            <select
              id="filter-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'terbaru' | 'terlama' | 'judul')}
              style={{
                width: '100%',
                fontSize: '12.5px',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-main)',
              }}
            >
              <option value="terbaru">Pembaruan Terbaru</option>
              <option value="terlama">Pembaruan Terlama</option>
              <option value="judul">Judul (A - Z)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Results Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <div style={{ fontSize: '13.5px', color: 'var(--color-text-muted)' }}>
          Menampilkan <strong style={{ color: 'var(--color-text-main)' }}>{searchResults.length}</strong> hasil pencarian
        </div>

        {(query || selectedCategory !== 'Semua' || selectedLifecycle !== 'Semua' || selectedAccess !== 'Semua' || digitalOnly !== 'Semua') && (
          <button
            type="button"
            onClick={resetAllFilters}
            style={{
              fontSize: '12px',
              color: 'var(--color-primary)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Hapus Semua Filter
          </button>
        )}
      </div>

      {/* Results Grid / Empty State */}
      {searchResults.length > 0 ? (
        <div className="resource-grid">
          {searchResults.map((res) => (
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
            padding: '56px 24px',
            textAlign: 'center',
            backgroundColor: 'var(--color-surface)',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div style={{ color: 'var(--color-text-muted)', marginBottom: '12px' }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '6px' }}>
            Tidak ada dokumen yang sesuai dengan kriteria pencarian
          </h3>
          <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', maxWidth: '480px', margin: '0 auto 20px' }}>
            Coba gunakan istilah yang lebih umum, periksa ejaan, atau hapus beberapa filter klasifikasi dan status siklus.
          </p>
          <button
            type="button"
            onClick={resetAllFilters}
            className="btn-primary"
            style={{
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              margin: '0 auto',
            }}
          >
            Bersihkan Filter & Ulangi Pencarian
          </button>
        </div>
      )}
    </div>
  );
}

function SearchParamWatcher() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  return <SearchContent key={q} initialQuery={q} />;
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Memuat antarmuka pencarian terpadu...
        </div>
      }
    >
      <SearchParamWatcher />
    </Suspense>
  );
}
