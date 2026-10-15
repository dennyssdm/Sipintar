'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_RESOURCES } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { ResourceItem, LifecycleStatus, AccessClassification, ResourceCategory } from '@/types';

export default function AdminDataPage() {
  const [resources, setResources] = useState<ResourceItem[]>(MOCK_RESOURCES);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('Semua');
  const [feedback, setFeedback] = useState<string | null>(null);

  // New Draft Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ResourceCategory>('Modul & Hanjar');
  const [newAuthor, setNewAuthor] = useState('');
  const [newUnit, setNewUnit] = useState('Bag Jarlat Sespimma');
  const [newAccess, setNewAccess] = useState<AccessClassification>('Internal');
  const [newDescription, setNewDescription] = useState('');

  const filtered = resources.filter((res) => {
    const matchCat = filterCategory === 'Semua' || res.category === filterCategory;
    const matchSearch =
      !search ||
      res.title.toLowerCase().includes(search.toLowerCase()) ||
      res.authorOrInstructor.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCreateDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: ResourceItem = {
      id: `res-${Date.now().toString().slice(-4)}`,
      title: newTitle.trim(),
      category: newCategory,
      subCategory: 'Entri Baru',
      description: newDescription.trim() || 'Deskripsi naskah usulan baru.',
      authorOrInstructor: newAuthor.trim() || 'Pengusul Terdaftar',
      unitOrSource: newUnit,
      updatedAt: new Date().toISOString().split('T')[0],
      lifecycle: 'Draft',
      access: newAccess,
      hasDigitalFile: true,
      fileFormat: 'PDF',
      fileSize: '1.5 MB',
    };

    setResources([newItem, ...resources]);
    setShowAddModal(false);
    setNewTitle('');
    setNewDescription('');
    setFeedback(`[Simulasi Prototipe] Dokumen draf baru "${newItem.title}" berhasil ditambahkan ke daftar lokal.`);
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleArchiveItem = (id: string, title: string) => {
    setResources((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, lifecycle: 'Arsip' as LifecycleStatus } : item
      )
    );
    setFeedback(`[Simulasi Prototipe] Dokumen "${title}" diubah statusnya menjadi Arsip.`);
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '16px', fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
        <Link href="/" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
          Beranda
        </Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>Fungsi Admin: Manajemen Data</span>
      </nav>

      {/* Header Banner */}
      <header
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
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
            Tata Kelola Dokumen & Bahan Ajar
          </span>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: 'var(--color-navy)',
              margin: '4px 0 6px',
            }}
          >
            Manajemen Data Sumber Belajar
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', maxWidth: '720px' }}>
            Kelola katalog berkas materi, hak akses klasifikasi, dan siklus naskah pembelajaran Sespimma. Setiap aksi pada prototipe ini berjalan pada state lokal.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
          style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>+ Tambah Data Draf (Mock)</span>
        </button>
      </header>

      {feedback && (
        <div
          style={{
            backgroundColor: 'var(--color-success-bg)',
            border: '1px solid var(--color-success-border)',
            color: 'var(--color-success)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          {feedback}
        </div>
      )}

      {/* Filter and Search Row */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '20px',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ flex: 1, minWidth: '260px' }}>
          <input
            type="search"
            placeholder="Cari berdasarkan judul naskah atau pengusul..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
            aria-label="Cari dokumen"
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label htmlFor="admin-cat-filter" style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Kategori:
          </label>
          <select
            id="admin-cat-filter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              fontSize: '12.5px',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-main)',
            }}
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Modul & Hanjar">Modul & Hanjar</option>
            <option value="E-Library/Perpustakaan">E-Library/Perpustakaan</option>
            <option value="Gadik & Kompetensi">Gadik & Kompetensi</option>
            <option value="Kurikulum & Standar Layanan">Kurikulum</option>
            <option value="SOP">SOP</option>
            <option value="Pedoman">Pedoman</option>
            <option value="Manual Book">Manual Book</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '13px',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-hover)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Judul & Kategori</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Penyusun / Unit</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Status Siklus</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Klasifikasi</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)', textAlign: 'right' }}>Aksi Prototipe</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: '1px solid var(--color-border-subtle)',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '3px' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                      {item.category} • {item.subCategory || 'Umum'}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ color: 'var(--color-text-main)' }}>{item.authorOrInstructor}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{item.unitOrSource}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <StatusBadge type="lifecycle" value={item.lifecycle} />
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <StatusBadge type="access" value={item.access} />
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    {item.lifecycle !== 'Arsip' ? (
                      <button
                        type="button"
                        onClick={() => handleArchiveItem(item.id, item.title)}
                        style={{
                          fontSize: '11.5px',
                          color: 'var(--color-text-muted)',
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-border)',
                          cursor: 'pointer',
                        }}
                      >
                        Arsipkan
                      </button>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                        Tersimpan di Arsip
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Draft Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(11, 18, 32, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              width: '100%',
              maxWidth: '560px',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '8px' }}>
              Tambah Draf Sumber Belajar Baru
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              Dokumen baru otomatis dimasukkan berstatus <strong>Draft</strong> sebelum melalui alur verifikasi.
            </p>

            <form onSubmit={handleCreateDraft} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  Judul Materi / Naskah:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Hanjar Manajemen Taktis Krisis Kamtibmas..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="search-input"
                  style={{ paddingLeft: '12px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                    Kategori:
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ResourceCategory)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                    }}
                  >
                    <option value="Modul & Hanjar">Modul & Hanjar</option>
                    <option value="E-Library/Perpustakaan">E-Library/Perpustakaan</option>
                    <option value="Gadik & Kompetensi">Gadik & Kompetensi</option>
                    <option value="Kurikulum & Standar Layanan">Kurikulum</option>
                    <option value="SOP">SOP</option>
                    <option value="Pedoman">Pedoman</option>
                    <option value="Manual Book">Manual Book</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                    Klasifikasi Akses:
                  </label>
                  <select
                    value={newAccess}
                    onChange={(e) => setNewAccess(e.target.value as AccessClassification)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                    }}
                  >
                    <option value="Internal">Internal (Personel Sespimma)</option>
                    <option value="Terbuka">Terbuka (Publik/Umum)</option>
                    <option value="Terbatas">Terbatas (Khusus Pimpinan/Pokja)</option>
                    <option value="Metadata Saja">Metadata Saja</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                    Nama Pengampu / Penulis:
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: AKBP Wahyu Pratama..."
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="search-input"
                    style={{ paddingLeft: '12px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                    Unit Pengusul:
                  </label>
                  <input
                    type="text"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="search-input"
                    style={{ paddingLeft: '12px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  Ringkasan / Abstrak:
                </label>
                <textarea
                  rows={3}
                  placeholder="Ringkasan singkat materi bahan ajar..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-main)',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                  style={{ color: 'var(--color-text-main)' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
                >
                  Simpan Draf (Lokal)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
