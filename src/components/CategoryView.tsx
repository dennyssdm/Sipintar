'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ResourceCategory, ResourceItem } from '@/types';
import { MOCK_RESOURCES, CATEGORIES_DATA } from '@/data/mockData';
import { ResourceCard } from './ResourceCard';
import { ResourceDetailModal } from './ResourceDetailModal';

interface CategoryViewProps {
  category: ResourceCategory;
}

export const CategoryView: React.FC<CategoryViewProps> = ({ category }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('Semua');
  const [lifecycleFilter, setLifecycleFilter] = useState<string>('Semua');
  const [accessFilter, setAccessFilter] = useState<string>('Semua');
  const [sortBy, setSortBy] = useState<'terbaru' | 'terlama' | 'judul'>('terbaru');
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);

  const categoryMeta = useMemo(() => {
    return CATEGORIES_DATA.find((c) => c.category === category) || {
      category,
      title: category,
      description: 'Direktori sumber belajar terpadu Sespimma Lemdiklat Polri.',
      count: 0,
      icon: 'book',
      href: '#',
    };
  }, [category]);

  const baseResources = useMemo(() => {
    return MOCK_RESOURCES.filter((res) => res.category === category);
  }, [category]);

  const subCategories = useMemo(() => {
    const subs = new Set<string>();
    baseResources.forEach((res) => {
      if (res.subCategory) subs.add(res.subCategory);
    });
    return ['Semua', ...Array.from(subs)];
  }, [baseResources]);

  const filteredResources = useMemo(() => {
    let result = baseResources.filter((res) => {
      const matchSub =
        selectedSubCategory === 'Semua' || res.subCategory === selectedSubCategory;

      const matchLifecycle =
        lifecycleFilter === 'Semua' || res.lifecycle === lifecycleFilter;

      const matchAccess =
        accessFilter === 'Semua' || res.access === accessFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        res.title.toLowerCase().includes(q) ||
        res.description.toLowerCase().includes(q) ||
        res.authorOrInstructor.toLowerCase().includes(q) ||
        res.unitOrSource.toLowerCase().includes(q) ||
        res.competencies?.some((c) => c.toLowerCase().includes(q)) ||
        res.tags?.some((t) => t.toLowerCase().includes(q));

      return matchSub && matchLifecycle && matchAccess && matchQuery;
    });

    if (sortBy === 'terbaru') {
      result = [...result].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    } else if (sortBy === 'terlama') {
      result = [...result].sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
    } else if (sortBy === 'judul') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [baseResources, selectedSubCategory, lifecycleFilter, accessFilter, searchQuery, sortBy]);

  return (
    <div>
      <ResourceDetailModal
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '16px', fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
        <Link href="/" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
          Beranda
        </Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>{categoryMeta.title}</span>
      </nav>

      {/* Category Banner */}
      <header
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--color-primary)',
                letterSpacing: '0.6px',
              }}
            >
              Kategori Resmi Sespimma
            </span>
            <h1
              style={{
                fontSize: '22px',
                fontWeight: 800,
                color: 'var(--color-navy)',
                margin: '4px 0 8px',
              }}
            >
              {categoryMeta.title}
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', maxWidth: '780px', lineHeight: 1.5 }}>
              {categoryMeta.description}
            </p>
          </div>

          <div
            style={{
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              textAlign: 'center',
              fontWeight: 800,
              fontSize: '18px',
            }}
          >
            <div>{filteredResources.length}</div>
            <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Berkas Ditemukan</div>
          </div>
        </div>
      </header>

      {/* Filter and Search Bar Controls */}
      <section
        aria-label="Filter Konten Kategori"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {/* Search Row */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <input
              type="search"
              placeholder={`Cari dalam kategori ${category}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              style={{ paddingLeft: '14px' }}
              aria-label={`Cari dalam ${category}`}
            />
          </div>

          {/* Sorter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label htmlFor="sort-select" style={{ fontSize: '12px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
              Urutkan:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'terbaru' | 'terlama' | 'judul')}
              style={{
                fontSize: '12.5px',
                padding: '8px 12px',
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

        {/* Secondary Filter Row: Subcategory, Lifecycle, Access */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Subcategories */}
          {subCategories.length > 2 && (
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Tipe:</span>
              {subCategories.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubCategory(sub)}
                  style={{
                    fontSize: '12px',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid',
                    borderColor: selectedSubCategory === sub ? 'var(--color-primary)' : 'var(--color-border)',
                    backgroundColor: selectedSubCategory === sub ? 'var(--color-primary-light)' : 'transparent',
                    color: selectedSubCategory === sub ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    fontWeight: selectedSubCategory === sub ? 700 : 500,
                  }}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          {/* Lifecycle Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label htmlFor="cat-lifecycle" style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              Siklus:
            </label>
            <select
              id="cat-lifecycle"
              value={lifecycleFilter}
              onChange={(e) => setLifecycleFilter(e.target.value)}
              style={{
                fontSize: '12px',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-main)',
              }}
            >
              <option value="Semua">Semua Status</option>
              <option value="Dipublikasikan">Dipublikasikan</option>
              <option value="Diverifikasi">Diverifikasi</option>
              <option value="Draft">Draft</option>
              <option value="Arsip">Arsip</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
          </div>

          {/* Access Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label htmlFor="cat-access" style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              Akses:
            </label>
            <select
              id="cat-access"
              value={accessFilter}
              onChange={(e) => setAccessFilter(e.target.value)}
              style={{
                fontSize: '12px',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-main)',
              }}
            >
              <option value="Semua">Semua Akses</option>
              <option value="Terbuka">Terbuka</option>
              <option value="Internal">Internal</option>
              <option value="Terbatas">Terbatas</option>
              <option value="Metadata Saja">Metadata Saja</option>
            </select>
          </div>
        </div>
      </section>

      {/* Resource List / Grid */}
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
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '4px' }}>
            Tidak ada dokumen yang sesuai dengan filter
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
            Coba sesuaikan kata kunci pencarian atau bersihkan filter siklus dan klasifikasi akses.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedSubCategory('Semua');
              setLifecycleFilter('Semua');
              setAccessFilter('Semua');
            }}
            className="btn-primary"
            style={{
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              margin: '0 auto',
            }}
          >
            Reset Semua Filter
          </button>
        </div>
      )}
    </div>
  );
};
