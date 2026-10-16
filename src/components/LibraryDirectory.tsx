'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { BookItem } from '@/types';
import { MOCK_BOOKS, LIBRARY_CATEGORIES } from '@/data/libraryData';

export const LibraryDirectory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'digital' | 'physical'>('all');
  const [sortBy, setSortBy] = useState<'year-desc' | 'title-asc' | 'pages-desc'>('year-desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'preview' | 'metadata'>('preview');
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    let result = MOCK_BOOKS.filter((book) => {
      const matchCat = selectedCategory === 'all' || book.categoryId === selectedCategory;

      const matchAvail =
        availabilityFilter === 'all' ||
        (availabilityFilter === 'digital' && Boolean(book.digitalFile.previewFilePath)) ||
        (availabilityFilter === 'physical' && book.stockAvailable > 0);

      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.isbn.toLowerCase().includes(q) ||
        book.publisher.toLowerCase().includes(q) ||
        book.synopsis.toLowerCase().includes(q) ||
        book.callNumber.toLowerCase().includes(q) ||
        book.tags.some((t) => t.toLowerCase().includes(q));

      return matchCat && matchAvail && matchQuery;
    });

    if (sortBy === 'year-desc') {
      result = [...result].sort((a, b) => b.publishedYear - a.publishedYear);
    } else if (sortBy === 'title-asc') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'pages-desc') {
      result = [...result].sort((a, b) => b.digitalFile.totalPages - a.digitalFile.totalPages);
    }

    return result;
  }, [searchQuery, selectedCategory, availabilityFilter, sortBy]);

  const handleOpenBook = (book: BookItem, initialTab: 'preview' | 'metadata' = 'preview') => {
    setSelectedBook(book);
    setActiveModalTab(initialTab);
  };

  const handleMockBorrow = (bookTitle: string) => {
    setFeedbackNotice(`[Simulasi Perpustakaan] Permintaan reservasi fisik untuk buku "${bookTitle}" berhasil dicatat. Silakan hubungi Meja Sirkulasi Lantai 1 Perpustakaan Sespimma.`);
    setTimeout(() => {
      setFeedbackNotice(null);
    }, 4500);
  };

  return (
    <div>
      {/* Toast Feedback Notice */}
      {feedbackNotice && (
        <div
          role="alert"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: 'var(--color-navy)',
            color: 'white',
            padding: '14px 20px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1100,
            maxWidth: '460px',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" color="#10b981">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <div style={{ flex: 1, lineHeight: 1.45 }}>{feedbackNotice}</div>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '16px', fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
        <Link href="/" style={{ color: 'var(--color-primary)', fontWeight: 500, textDecoration: 'none' }}>
          Beranda
        </Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>E-Library / Perpustakaan</span>
      </nav>

      {/* Page Header Institusional Toned */}
      <header
        style={{
          background: 'linear-gradient(135deg, #061933 0%, #0a2952 50%, #0f4882 100%)',
          color: '#ffffff',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: 'var(--radius-lg)',
          padding: '26px 30px',
          marginBottom: '24px',
          boxShadow: '0 8px 24px rgba(6, 25, 51, 0.2)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle decorative glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(56, 189, 248, 0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          <div style={{ flex: '1 1 540px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#38bdf8',
                  letterSpacing: '0.8px',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                UNIT PERPUSTAKAAN SESPIMMA
              </span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>•</span>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.4px' }}>
                KATALOG SUMBER PUSTAKA RESMI
              </span>
            </div>

            <h1
              style={{
                fontSize: '26px',
                fontWeight: 800,
                color: '#ffffff',
                margin: '4px 0 10px',
                lineHeight: 1.25,
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
              }}
            >
              E-Library / Perpustakaan
            </h1>

            <p style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: 1.6, margin: 0, maxWidth: '780px' }}>
              Katalog terpadu koleksi <strong style={{ color: '#ffffff' }}>buku teks kepolisian</strong>, <strong style={{ color: '#ffffff' }}>karya tulis perorangan (Taskap)</strong>,{' '}
              serta naskah referensi hukum dan kepemimpinan Sespimma Lemdiklat Polri. Dilengkapi{' '}
              <strong style={{ color: '#38bdf8' }}>fitur pratinjau sampel digital (*Sample Preview*)</strong> dan <strong style={{ color: '#fbbf24' }}>sinopsis komprehensif</strong> pada setiap naskah.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '11.5px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(6px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  color: '#f1f5f9',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" color="#38bdf8">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                  <path d="M6 6h10" />
                  <path d="M6 10h10" />
                </svg>
                <span>Standar Skema: <strong style={{ color: '#ffffff' }}>Tabel books (Metadata Deskriptif & Sinopsis) + book_files (Pratinjau Teknis)</strong></span>
              </span>

              <span
                style={{
                  fontSize: '11.5px',
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#6ee7b7',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                }}
              >
                ✓ Akses Pratinjau Terbuka (Public Sample Ready)
              </span>
            </div>
          </div>

          {/* Quick Counter Badges */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              alignSelf: 'center',
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 20px',
                textAlign: 'center',
                minWidth: '130px',
              }}
            >
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#38bdf8' }}>
                {MOCK_BOOKS.length}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase' }}>
                Judul Terkurasi
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 20px',
                textAlign: 'center',
                minWidth: '130px',
              }}
            >
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#10b981' }}>
                100%
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase' }}>
                Ada Pratinjau PDF
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 4 PILAR KATEGORI UTAMA PERPUSTAKAAN SESUAI PERMINTAAN */}
      <section
        aria-label="4 Kategori Pustaka Utama Sespimma"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '14px',
          marginBottom: '24px',
        }}
      >
        {/* Pilar 1: Koleksi Buku Fisik */}
        <div
          onClick={() => setSelectedCategory(selectedCategory === 'buku-fisik' ? 'all' : 'buku-fisik')}
          style={{
            backgroundColor: 'var(--color-surface)',
            border: `2px solid ${selectedCategory === 'buku-fisik' ? 'var(--color-primary)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
            boxShadow: selectedCategory === 'buku-fisik' ? 'var(--shadow-md)' : 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  backgroundColor: '#e0f2fe',
                  color: '#0369a1',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #38bdf8',
                }}
              >
                Koleksi Fisik
              </span>
              <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-navy)', marginTop: '6px' }}>
                {MOCK_BOOKS.filter((b) => b.categoryId === 'buku-fisik').length}{' '}
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Judul</span>
              </div>
            </div>
            <div style={{ fontSize: '22px' }}>📚</div>
          </div>
          <div style={{ marginTop: '8px', fontSize: '11.5px', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
            Buku teks cetak dan monograf referensi di rak Gedung Perpustakaan Sespimma Lembang.
          </div>
        </div>

        {/* Pilar 2: E-Book */}
        <div
          onClick={() => setSelectedCategory(selectedCategory === 'ebook' ? 'all' : 'ebook')}
          style={{
            backgroundColor: 'var(--color-surface)',
            border: `2px solid ${selectedCategory === 'ebook' ? '#b45309' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
            boxShadow: selectedCategory === 'ebook' ? 'var(--shadow-md)' : 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #f59e0b',
                }}
              >
                E-Book Digital
              </span>
              <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-navy)', marginTop: '6px' }}>
                {MOCK_BOOKS.filter((b) => b.categoryId === 'ebook').length}{' '}
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Judul</span>
              </div>
            </div>
            <div style={{ fontSize: '22px' }}>📱</div>
          </div>
          <div style={{ marginTop: '8px', fontSize: '11.5px', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
            Buku digital PDF/EPUB lengkap dengan sampel bab pembuka yang siap dibaca langsung.
          </div>
        </div>

        {/* Pilar 3: Karya Tulis Kepolisian (Taskap) */}
        <div
          onClick={() => setSelectedCategory(selectedCategory === 'taskap' ? 'all' : 'taskap')}
          style={{
            backgroundColor: 'var(--color-surface)',
            border: `2px solid ${selectedCategory === 'taskap' ? '#4338ca' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
            boxShadow: selectedCategory === 'taskap' ? 'var(--shadow-md)' : 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  backgroundColor: '#ede9fe',
                  color: '#6d28d9',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #a78bfa',
                }}
              >
                Karya Tulis (Taskap)
              </span>
              <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-navy)', marginTop: '6px' }}>
                {MOCK_BOOKS.filter((b) => b.categoryId === 'taskap').length}{' '}
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Naskah</span>
              </div>
            </div>
            <div style={{ fontSize: '22px' }}>📑</div>
          </div>
          <div style={{ marginTop: '8px', fontSize: '11.5px', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
            Kertas Karya Perorangan (Taskap) peserta didik Sespimma dan pedoman riset ilmiah terapan.
          </div>
        </div>

        {/* Pilar 4: Jurnal Ilmiah Terbitan */}
        <div
          onClick={() => setSelectedCategory(selectedCategory === 'jurnal' ? 'all' : 'jurnal')}
          style={{
            backgroundColor: 'var(--color-surface)',
            border: `2px solid ${selectedCategory === 'jurnal' ? '#047857' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
            boxShadow: selectedCategory === 'jurnal' ? 'var(--shadow-md)' : 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  backgroundColor: '#ecfdf5',
                  color: '#065f46',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #34d399',
                }}
              >
                Jurnal Ilmiah
              </span>
              <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-navy)', marginTop: '6px' }}>
                {MOCK_BOOKS.filter((b) => b.categoryId === 'jurnal').length}{' '}
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Edisi</span>
              </div>
            </div>
            <div style={{ fontSize: '22px' }}>🏛️</div>
          </div>
          <div style={{ marginTop: '8px', fontSize: '11.5px', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
            Terbitan berkala ilmiah terakreditasi ISSN memuat hasil riset empiris dan kepakaran kepolisian.
          </div>
        </div>
      </section>

      {/* FILTER, SEARCH & VIEW MODE CONTROLS */}
      <section
        aria-label="Pencarian dan Filter E-Library"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {/* Top Search and Sorter Row */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Box */}
          <div style={{ flex: '1 1 340px' }}>
            <input
              type="search"
              placeholder="Cari judul buku, pengarang, ISBN, penerbit, nomor panggil, atau sinopsis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              style={{ width: '100%', paddingLeft: '14px' }}
              aria-label="Cari buku dalam E-Library"
            />
          </div>

          {/* Sorter & View Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label htmlFor="library-sort" style={{ fontSize: '12px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                Urutkan:
              </label>
              <select
                id="library-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'year-desc' | 'title-asc' | 'pages-desc')}
                style={{
                  fontSize: '12px',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-main)',
                }}
              >
                <option value="year-desc">Tahun Terbit (Terbaru)</option>
                <option value="title-asc">Judul Buku (A - Z)</option>
                <option value="pages-desc">Halaman Terbanyak</option>
              </select>
            </div>

            {/* View Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                title="Tampilan Rak Buku (Grid Card)"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid',
                  borderColor: viewMode === 'grid' ? 'var(--color-primary)' : 'var(--color-border)',
                  backgroundColor: viewMode === 'grid' ? 'var(--color-primary-light)' : 'transparent',
                  color: viewMode === 'grid' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  fontWeight: viewMode === 'grid' ? 700 : 500,
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                <span>Rak Buku</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('table')}
                title="Tampilan Tabel Bibliografi"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid',
                  borderColor: viewMode === 'table' ? 'var(--color-primary)' : 'var(--color-border)',
                  backgroundColor: viewMode === 'table' ? 'var(--color-primary-light)' : 'transparent',
                  color: viewMode === 'table' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  fontWeight: viewMode === 'table' ? 700 : 500,
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
                <span>Tabel Bibliografi</span>
              </button>
            </div>
          </div>
        </div>

        {/* Categories Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', marginRight: '4px' }}>
            Kategori:
          </span>
          {LIBRARY_CATEGORIES.map((cat) => {
            const count =
              cat.id === 'all'
                ? MOCK_BOOKS.length
                : MOCK_BOOKS.filter((b) => b.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  fontSize: '11.5px',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: selectedCategory === cat.id ? 'var(--color-primary)' : 'var(--color-border)',
                  backgroundColor: selectedCategory === cat.id ? 'var(--color-primary)' : 'transparent',
                  color: selectedCategory === cat.id ? 'white' : 'var(--color-text-main)',
                  fontWeight: selectedCategory === cat.id ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{cat.name}</span>
                <span
                  style={{
                    fontSize: '10px',
                    padding: '1px 5px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: selectedCategory === cat.id ? 'rgba(255,255,255,0.25)' : 'var(--color-surface-hover)',
                    color: selectedCategory === cat.id ? 'white' : 'var(--color-text-muted)',
                    fontWeight: 700,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* RESULTS COUNT & FILTER SUMMARY */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
        <div>
          Menampilkan <strong>{filteredBooks.length}</strong> judul buku & naskah perpustakaan
        </div>
        {(selectedCategory !== 'all' || availabilityFilter !== 'all' || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setAvailabilityFilter('all');
              setSearchQuery('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-primary)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '12px',
            }}
          >
            Reset Semua Filter
          </button>
        )}
      </div>

      {/* VIEW MODE 1: GRID RAK BUKU DIGITAL (CARD SHOWCASE) */}
      {viewMode === 'grid' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
            gap: '20px',
          }}
        >
          {filteredBooks.map((book) => {
            return (
              <article
                key={book.id}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                {/* Book Header / Spine Visual Mockup */}
                <div
                  style={{
                    background: book.coverGradient || 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
                    color: 'white',
                    padding: '20px',
                    position: 'relative',
                    minHeight: '140px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  {/* Top Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: 800,
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(4px)',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-sm)',
                        letterSpacing: '0.4px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {book.categoryName}
                    </span>

                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        backgroundColor: '#10b981',
                        color: 'white',
                        padding: '2px 7px',
                        borderRadius: 'var(--radius-full)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span>✓ Sampel Pratinjau</span>
                    </span>
                  </div>

                  {/* Title Preview on Spine */}
                  <div style={{ marginTop: '12px' }}>
                    <h3
                      style={{
                        fontSize: '16px',
                        fontWeight: 800,
                        color: '#ffffff',
                        margin: 0,
                        lineHeight: 1.35,
                        textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                      }}
                    >
                      {book.title}
                    </h3>
                    <div style={{ fontSize: '11.5px', color: '#cbd5e1', marginTop: '4px' }}>
                      {book.author}
                    </div>
                  </div>

                  {/* Call number ribbon */}
                  <div
                    style={{
                      marginTop: '8px',
                      fontSize: '10px',
                      fontFamily: 'monospace',
                      color: '#93c5fd',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>No. Panggil: {book.callNumber}</span>
                  </div>
                </div>

                {/* Book Details Body */}
                <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    {/* Metadata Specs Grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px',
                        fontSize: '11.5px',
                        backgroundColor: 'var(--color-surface-hover)',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border-subtle)',
                        marginBottom: '12px',
                      }}
                    >
                      <div>
                        <span style={{ color: 'var(--color-text-muted)' }}>ISBN:</span>
                        <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontFamily: 'monospace' }}>
                          {book.isbn}
                        </div>
                      </div>

                      <div>
                        <span style={{ color: 'var(--color-text-muted)' }}>Penerbit & Tahun:</span>
                        <div style={{ fontWeight: 600, color: 'var(--color-navy)' }}>
                          {book.publisher} ({book.publishedYear})
                        </div>
                      </div>

                      <div>
                        <span style={{ color: 'var(--color-text-muted)' }}>Halaman / File:</span>
                        <div style={{ fontWeight: 600, color: 'var(--color-navy)' }}>
                          {book.digitalFile.totalPages} Hlm • {book.digitalFile.fileSize}
                        </div>
                      </div>

                      <div>
                        <span style={{ color: 'var(--color-text-muted)' }}>Koleksi Fisik:</span>
                        <div style={{ fontWeight: 700, color: book.stockAvailable > 0 ? 'var(--color-success)' : 'var(--color-warning)' }}>
                          {book.stockAvailable > 0 ? `Tersedia (${book.stockAvailable} eks)` : 'Dipinjam'}
                        </div>
                      </div>
                    </div>

                    {/* Synopsis (Column synopsis from struktur buku.docx) */}
                    <div>
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          color: 'var(--color-primary)',
                          letterSpacing: '0.4px',
                          marginBottom: '4px',
                        }}
                      >
                        Sinopsis / Abstrak Buku:
                      </div>
                      <p
                        style={{
                          fontSize: '12.5px',
                          color: 'var(--color-text-main)',
                          lineHeight: 1.5,
                          margin: 0,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {book.synopsis}
                      </p>
                    </div>

                    {/* Physical Location info */}
                    <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      📍 <em>{book.physicalLocation}</em>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '8px',
                      marginTop: '16px',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--color-border-subtle)',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleOpenBook(book, 'preview')}
                      className="btn btn-primary"
                      style={{
                        fontSize: '11.5px',
                        fontWeight: 700,
                        padding: '8px 10px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      </svg>
                      <span>Baca Sampel</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenBook(book, 'metadata')}
                      className="btn btn-secondary"
                      style={{
                        fontSize: '11.5px',
                        fontWeight: 600,
                        padding: '8px 10px',
                      }}
                    >
                      Rincian Buku
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: TABEL BIBLIOGRAFI BERSTANDAR PERPUSTAKAAN */}
      {viewMode === 'table' && (
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            overflowX: 'auto',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '12.5px',
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: 'var(--color-surface-hover)',
                  borderBottom: '2px solid var(--color-border)',
                  color: 'var(--color-navy)',
                  fontWeight: 800,
                  fontSize: '11.5px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px',
                }}
              >
                <th style={{ padding: '12px 14px', width: '40px', textAlign: 'center' }}>No</th>
                <th style={{ padding: '12px 16px', minWidth: '220px' }}>Judul & Penulis (books.title, author)</th>
                <th style={{ padding: '12px 14px', minWidth: '150px' }}>ISBN & No. Panggil</th>
                <th style={{ padding: '12px 14px', minWidth: '170px' }}>Penerbit & Tahun</th>
                <th style={{ padding: '12px 14px', minWidth: '140px' }}>Kategori</th>
                <th style={{ padding: '12px 14px', minWidth: '130px' }}>Berkas Teknis (book_files)</th>
                <th style={{ padding: '12px 14px', minWidth: '160px' }}>Koleksi Fisik di Rak</th>
                <th style={{ padding: '12px 14px', width: '130px', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book, idx) => (
                <tr
                  key={book.id}
                  onClick={() => handleOpenBook(book, 'preview')}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: idx % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-hover)',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                    {idx + 1}
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 800, color: 'var(--color-navy)', fontSize: '13px' }}>
                      {book.title}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      {book.author}
                    </div>
                  </td>

                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-primary)' }}>
                      {book.isbn}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      {book.callNumber}
                    </div>
                  </td>

                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>
                      {book.publisher}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      Tahun {book.publishedYear} • {book.language}
                    </div>
                  </td>

                  <td style={{ padding: '12px 14px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        backgroundColor: 'var(--color-primary-light)',
                        color: 'var(--color-primary)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 600,
                      }}
                    >
                      {book.categoryName}
                    </span>
                  </td>

                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>
                      {book.digitalFile.fileFormat} • {book.digitalFile.fileSize}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>
                      Sampel: {book.digitalFile.previewPages} dari {book.digitalFile.totalPages} Hlm
                    </div>
                  </td>

                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 600, color: book.stockAvailable > 0 ? 'var(--color-success)' : 'var(--color-warning)' }}>
                      {book.stockAvailable > 0 ? `Tersedia ${book.stockAvailable} Eks` : 'Sedang Dipinjam'}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      {book.physicalLocation}
                    </div>
                  </td>

                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenBook(book, 'preview');
                      }}
                      className="btn btn-primary"
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      Baca Sampel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredBooks.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            backgroundColor: 'var(--color-surface)',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            marginTop: '20px',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>📚</div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)', margin: '0 0 6px' }}>
            Koleksi Buku Tidak Ditemukan
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', maxWidth: '420px', margin: '0 auto 16px' }}>
            Tidak ada buku atau referensi yang cocok dengan filter atau kata kunci pencarian Anda. Silakan atur ulang filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setAvailabilityFilter('all');
              setSearchQuery('');
            }}
            className="btn btn-secondary"
            style={{ fontSize: '12.5px' }}
          >
            Tampilkan Seluruh Koleksi Perpustakaan
          </button>
        </div>
      )}

      {/* MODAL DETAIL BUKU & PEMBACA PRATINJAU SAMPEL (SESUAI STRUKTUR BUKU.DOCX) */}
      {selectedBook && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-book-title"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(5px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={() => setSelectedBook(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              width: '100%',
              maxWidth: activeModalTab === 'preview' ? '1140px' : '780px',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
              transition: 'max-width 0.2s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Title & Tab Switcher */}
            <div
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ flex: '1 1 300px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: 'var(--color-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px',
                  }}
                >
                  {selectedBook.categoryName} • ISBN: {selectedBook.isbn}
                </span>
                <h2
                  id="modal-book-title"
                  style={{
                    fontSize: '18px',
                    fontWeight: 800,
                    color: 'var(--color-navy)',
                    margin: '2px 0 0',
                    lineHeight: 1.3,
                  }}
                >
                  {selectedBook.title}
                </h2>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  {selectedBook.author} • {selectedBook.publisher} ({selectedBook.publishedYear})
                </div>
              </div>

              {/* Tab Switcher & Close button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    display: 'flex',
                    backgroundColor: 'var(--color-surface-hover)',
                    borderRadius: 'var(--radius-md)',
                    padding: '3px',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveModalTab('preview')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: activeModalTab === 'preview' ? 'var(--color-primary)' : 'transparent',
                      color: activeModalTab === 'preview' ? 'white' : 'var(--color-text-main)',
                      fontWeight: activeModalTab === 'preview' ? 700 : 500,
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    📖 Baca Pratinjau Sampel
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveModalTab('metadata')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: activeModalTab === 'metadata' ? 'var(--color-primary)' : 'transparent',
                      color: activeModalTab === 'metadata' ? 'white' : 'var(--color-text-main)',
                      fontWeight: activeModalTab === 'metadata' ? 700 : 500,
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    📋 Metadata & Sinopsis
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedBook(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)',
                  }}
                  aria-label="Tutup modal"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Scrollable Content */}
            <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
              {/* TAB 1: PRATINJAU MEMBACA SAMPEL DOKUMEN (PREVIEW_FILE_PATH) */}
              {activeModalTab === 'preview' && (
                <div>
                  <div
                    style={{
                      padding: '10px 16px',
                      backgroundColor: 'var(--color-surface-hover)',
                      border: '1px solid var(--color-border)',
                      borderBottom: 'none',
                      borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-navy)', fontWeight: 600 }}>
                      <span style={{ color: '#dc2626' }}>📄</span>
                      <span>
                        Pratinjau Sampel Publik ({selectedBook.digitalFile.previewPages} Halaman Awal untuk Evaluasi Baca)
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <a
                        href={selectedBook.digitalFile.previewFilePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: 'var(--color-primary)',
                          textDecoration: 'none',
                          fontWeight: 700,
                          fontSize: '12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span>Buka Layar Penuh</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    </div>
                  </div>

                  <iframe
                    src={selectedBook.digitalFile.previewFilePath}
                    title={`Pratinjau ${selectedBook.title}`}
                    style={{
                      width: '100%',
                      height: '66vh',
                      minHeight: '460px',
                      border: '1px solid var(--color-border)',
                      borderRadius: '0 0 var(--radius-md) var(--radius-md)',
                      backgroundColor: '#525659',
                      display: 'block',
                    }}
                  />

                  {/* Copyright notice */}
                  <div
                    style={{
                      marginTop: '12px',
                      fontSize: '11.5px',
                      color: 'var(--color-text-muted)',
                      backgroundColor: 'var(--color-surface-hover)',
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    <span>
                      🔒 <em>Sesuai ketentuan hak cipta: File pratinjau sampel dapat diakses publik. File utuh ({selectedBook.digitalFile.totalPages} halaman) dapat diakses melalui peminjaman fisik atau akun resmi Serdik.</em>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleMockBorrow(selectedBook.title)}
                      className="btn btn-secondary"
                      style={{ fontSize: '11px', padding: '4px 10px' }}
                    >
                      Ajukan Peminjaman Buku Fisik
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: METADATA DESKRIPTIF & TEKNIS (STRUKTUR BUKU.DOCX) */}
              {activeModalTab === 'metadata' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* SINOPSIS KOMPREHENSIF (KOLOM synopsis) */}
                  <div
                    style={{
                      backgroundColor: 'var(--color-primary-light)',
                      border: '1px solid var(--color-primary)',
                      borderRadius: 'var(--radius-md)',
                      padding: '18px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '11.5px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: 'var(--color-primary)',
                        letterSpacing: '0.5px',
                        marginBottom: '8px',
                      }}
                    >
                      Sinopsis Komprehensif / Abstrak Buku (books.synopsis):
                    </div>
                    <p
                      style={{
                        fontSize: '14px',
                        color: 'var(--color-navy)',
                        lineHeight: 1.65,
                        margin: 0,
                      }}
                    >
                      {selectedBook.synopsis}
                    </p>
                  </div>

                  {/* 1. TABEL UTAMA: books (Metadata Deskriptif) */}
                  <div>
                    <h4
                      style={{
                        fontSize: '12.5px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: 'var(--color-navy)',
                        marginBottom: '10px',
                        letterSpacing: '0.4px',
                      }}
                    >
                      1. Metadata Deskriptif (Skema books)
                    </h4>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '12px',
                        backgroundColor: 'var(--color-surface-hover)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px',
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                          ID Buku
                        </span>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-navy)', fontFamily: 'monospace' }}>
                          {selectedBook.id}
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                          ISBN (Unique)
                        </span>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'monospace' }}>
                          {selectedBook.isbn}
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                          Penulis (Author)
                        </span>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                          {selectedBook.author}
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                          Penerbit (Publisher)
                        </span>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                          {selectedBook.publisher}
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                          Tahun Terbit (Published Year)
                        </span>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                          {selectedBook.publishedYear}
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                          Bahasa (Language)
                        </span>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                          {selectedBook.language}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. TABEL FILE DIGITAL: book_files (Metadata Teknis) */}
                  <div>
                    <h4
                      style={{
                        fontSize: '12.5px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: 'var(--color-navy)',
                        marginBottom: '10px',
                        letterSpacing: '0.4px',
                      }}
                    >
                      2. Metadata Teknis File Digital (Skema book_files)
                    </h4>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '12px',
                        backgroundColor: 'var(--color-surface-hover)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px',
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                          Format & Ukuran File
                        </span>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-navy)' }}>
                          {selectedBook.digitalFile.fileFormat} ({selectedBook.digitalFile.fileSize})
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                          Total Halaman Buku
                        </span>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-navy)' }}>
                          {selectedBook.digitalFile.totalPages} Halaman
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                          Halaman Pratinjau Terbuka (Sample)
                        </span>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-success)' }}>
                          {selectedBook.digitalFile.previewPages} Halaman Sampel
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                          preview_file_path (Akses Terbuka)
                        </span>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-primary)', wordBreak: 'break-all' }}>
                          {selectedBook.digitalFile.previewFilePath}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. LOKASI FISIK & SIRKULASI PERPUSTAKAAN */}
                  <div
                    style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface-hover)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                          Lokasi Koleksi Fisik Perpustakaan Sespimma:
                        </div>
                        <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-navy)', marginTop: '2px' }}>
                          📍 {selectedBook.physicalLocation}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                          Nomor Panggil Rak: <strong>{selectedBook.callNumber}</strong> • Ketersediaan:{' '}
                          <strong style={{ color: selectedBook.stockAvailable > 0 ? 'var(--color-success)' : 'var(--color-warning)' }}>
                            {selectedBook.stockAvailable} dari {selectedBook.stockTotal} Eksemplar
                          </strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleMockBorrow(selectedBook.title)}
                        className="btn btn-primary"
                        style={{ fontSize: '12px', padding: '8px 16px', fontWeight: 700 }}
                      >
                        Pinjam / Reservasi Buku
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '14px 24px',
                borderTop: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface-hover)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Nomor Panggil: <strong>{selectedBook.callNumber}</strong>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href={selectedBook.digitalFile.previewFilePath}
                  download
                  className="btn btn-secondary"
                  style={{
                    fontSize: '12px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Unduh Sampel PDF</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedBook(null)}
                  className="btn btn-secondary"
                  style={{ fontSize: '12px' }}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
