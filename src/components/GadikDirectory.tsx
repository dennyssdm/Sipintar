'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { GadikMember, ResourceItem } from '@/types';
import {
  GADIK_NOMINATIF_MEMBERS,
  REKAPITULASI_NOMINATIF_GADIK,
} from '@/data/gadikData';
import { ResourceDetailModal } from './ResourceDetailModal';

export const GadikDirectory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRank, setSelectedRank] = useState<string>('Semua');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedGadik, setSelectedGadik] = useState<GadikMember | null>(null);
  const [selectedResourceForModal, setSelectedResourceForModal] = useState<ResourceItem | null>(null);
  const [showDocPreview, setShowDocPreview] = useState(false);

  // Filtered members
  const filteredMembers = useMemo(() => {
    return GADIK_NOMINATIF_MEMBERS.filter((member) => {
      const matchRank =
        selectedRank === 'Semua' || member.pangkat === selectedRank;

      const matchCategory =
        selectedCategory === 'Semua' || member.kategoriJabatan === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        member.nama.toLowerCase().includes(q) ||
        member.nrp.includes(q) ||
        member.jabatan.toLowerCase().includes(q) ||
        member.eselon.toLowerCase().includes(q) ||
        member.golongan.toLowerCase().includes(q) ||
        member.bidangKepakaran.some((k) => k.toLowerCase().includes(q)) ||
        member.mataAjarHanjar.some((h) => h.toLowerCase().includes(q));

      return matchRank && matchCategory && matchQuery;
    });
  }, [searchQuery, selectedRank, selectedCategory]);

  const handleOpenGadikModal = (member: GadikMember) => {
    setSelectedGadik(member);
    // Convert to ResourceItem so user can also open standard modal if desired
    const resItem: ResourceItem = {
      id: `gadik-${member.nrp}`,
      title: `Profil Tenaga Pendidik: ${member.nama}`,
      category: 'Gadik & Kompetensi',
      subCategory: member.kategoriJabatan,
      description: `${member.jabatan} (NRP ${member.nrp}). Pakar bidang: ${member.bidangKepakaran.slice(0, 2).join(', ')}.`,
      authorOrInstructor: member.nama,
      unitOrSource: 'Sespimma Sespim Lemdiklat Polri',
      updatedAt: '2026-10-15',
      lifecycle: 'Dipublikasikan',
      access: 'Terbuka',
      hasDigitalFile: true,
      fileFormat: 'PDF',
      fileSize: '139.7 KB',
      fileUrl: REKAPITULASI_NOMINATIF_GADIK.pdfUrl,
      competencies: member.bidangKepakaran,
      tags: [
        member.pangkat,
        member.kategoriJabatan,
        `Eselon ${member.eselon}`,
        `Golongan ${member.golongan}`,
        `NRP ${member.nrp}`,
      ],
      nrp: member.nrp,
      jabatan: member.jabatan,
      eselon: member.eselon,
      golongan: member.golongan,
      pangkat: member.pangkat,
      agama: member.agama,
      noUrutNominatif: member.noUrut,
    };
    setSelectedResourceForModal(resItem);
  };

  const getRankBadgeColor = (pangkat: string) => {
    switch (pangkat) {
      case 'KOMBES POL':
        return { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' };
      case 'AKBP':
        return { bg: '#e0f2fe', text: '#0369a1', border: '#38bdf8' };
      case 'KOMPOL':
        return { bg: '#ede9fe', text: '#6d28d9', border: '#a78bfa' };
      case 'IPTU':
        return { bg: '#ecfdf5', text: '#065f46', border: '#34d399' };
      default:
        return { bg: '#f1f5f9', text: '#334155', border: '#cbd5e1' };
    }
  };

  return (
    <div>
      {/* Standard Detail Modal */}
      {selectedResourceForModal && (
        <ResourceDetailModal
          resource={selectedResourceForModal}
          onClose={() => {
            setSelectedResourceForModal(null);
            setSelectedGadik(null);
          }}
        />
      )}

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '16px', fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
        <Link href="/" style={{ color: 'var(--color-primary)', fontWeight: 500, textDecoration: 'none' }}>
          Beranda
        </Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>Gadik & Kompetensi</span>
      </nav>

      {/* Page Header Institusional Toned */}
      <header
        style={{
          background: 'linear-gradient(135deg, #091a38 0%, #153e75 50%, #1d4ed8 100%)',
          color: '#ffffff',
          borderTop: '4px solid #f59e0b',
          borderLeft: '1px solid rgba(251, 191, 36, 0.35)',
          borderRight: '1px solid rgba(251, 191, 36, 0.35)',
          borderBottom: '1px solid rgba(251, 191, 36, 0.35)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px 32px',
          marginBottom: '24px',
          boxShadow: '0 10px 30px rgba(7, 23, 49, 0.25)',
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
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0) 70%)',
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
                  color: '#fbbf24',
                  letterSpacing: '0.8px',
                  backgroundColor: 'rgba(251, 191, 36, 0.15)',
                  border: '1px solid rgba(251, 191, 36, 0.35)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                SESPIM LEMDIKLAT POLRI
              </span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>•</span>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.4px' }}>
                SEKOLAH STAF DAN PIMPINAN PERTAMA
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
              Gadik & Kompetensi
            </h1>

            <p style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: 1.6, margin: 0, maxWidth: '780px' }}>
              Daftar resmi <strong style={{ color: '#ffffff' }}>Nominatif Anggota Polri (Fungsional) & Tenaga Pendidik</strong> Sespimma Sespim Lemdiklat Polri{' '}
              <strong style={{ color: '#fbbf24' }}>Bulan Oktober 2026</strong>. Menampilkan struktur kepangkatan, NRP, jabatan fungsional, eselon, golongan ruang, dan kepakaran pengajaran.
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
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" color="#fbbf24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Pengesahan: <strong style={{ color: '#ffffff' }}>PS Kasubbag Renmin KOMPOL Sunu Prihandoyo, S.T. (NRP. 82050054)</strong></span>
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
                ✓ Status: Resmi & Terverifikasi
              </span>
            </div>
          </div>

          {/* Quick PDF Action Buttons & Stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div
              style={{
                padding: '12px 20px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(251, 191, 36, 0.4)',
                color: '#ffffff',
                textAlign: 'center',
                fontWeight: 800,
                fontSize: '22px',
                minWidth: '140px',
              }}
            >
              <div style={{ color: '#fbbf24' }}>{filteredMembers.length} Personel</div>
              <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#e2e8f0', letterSpacing: '0.4px' }}>
                Fungsional Polri
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '200px' }}>
              <a
                href={REKAPITULASI_NOMINATIF_GADIK.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '9px 16px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span>Buka Naskah Asli PDF</span>
              </a>

              <button
                type="button"
                onClick={() => setShowDocPreview(!showDocPreview)}
                className="btn btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>{showDocPreview ? 'Tutup Naskah' : 'Pratinjau di Halaman'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Embedded PDF Viewer on Demand */}
        {showDocPreview && (
          <div
            style={{
              marginTop: '20px',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              backgroundColor: '#525659',
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--color-navy)',
                color: 'white',
                padding: '8px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <span>Pratinjau Dokumen: NOMINATIF POLRI (FUNGSIONAL) BLN OKTOBER 2026 .pdf</span>
              <button
                type="button"
                onClick={() => setShowDocPreview(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                ✕ Tutup
              </button>
            </div>
            <iframe
              src={REKAPITULASI_NOMINATIF_GADIK.pdfUrl}
              title="Nominatif Polri Fungsional Sespimma 2026"
              style={{ width: '100%', height: '550px', border: 'none', display: 'block' }}
            />
          </div>
        )}
      </header>

      {/* DASHBOARD REKAPITULASI KEDINASAN (Sesuai Halaman 1 Dokumen PDF) */}
      <section
        aria-label="Rekapitulasi Anggota Polri Fungsional"
        style={{
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '15px',
                fontWeight: 800,
                color: 'var(--color-navy)',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
              }}
            >
              Rekapitulasi Anggota Polri (Fungsional) — Sespimma TA 2026
            </h2>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Data resmi berdasarkan naskah ketetapan Subbag Renmin Sespimma Lemdiklat Polri
            </div>
          </div>

          <div
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-navy)',
              color: 'white',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.3px',
            }}
          >
            TOTAL FUNGSIONAL: {REKAPITULASI_NOMINATIF_GADIK.totalPersonel} ORANG
          </div>
        </div>

        {/* 4 Cards Breakdown */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px',
          }}
        >
          {/* Card 1: Kombes Pol */}
          <div
            onClick={() => setSelectedRank(selectedRank === 'KOMBES POL' ? 'Semua' : 'KOMBES POL')}
            style={{
              backgroundColor: 'var(--color-surface)',
              border: `2px solid ${selectedRank === 'KOMBES POL' ? '#f59e0b' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
              boxShadow: selectedRank === 'KOMBES POL' ? 'var(--shadow-md)' : 'var(--shadow-sm)',
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
                  KOMBES POL
                </span>
                <div style={{ fontSize: '26px', fontWeight: 900, color: 'var(--color-navy)', marginTop: '6px' }}>
                  {REKAPITULASI_NOMINATIF_GADIK.kombesPol.total}{' '}
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Orang</span>
                </div>
              </div>
              <div style={{ fontSize: '20px' }}>⭐</div>
            </div>
            <div style={{ marginTop: '10px', fontSize: '11.5px', color: 'var(--color-text-muted)', borderTop: '1px dashed var(--color-border)', paddingTop: '8px' }}>
              <div>• Anjak Madya: <strong>{REKAPITULASI_NOMINATIF_GADIK.kombesPol.anjakMadya} Orang</strong></div>
              <div>• Widyaiswara Madya: <strong>{REKAPITULASI_NOMINATIF_GADIK.kombesPol.fungsional} Orang</strong></div>
            </div>
          </div>

          {/* Card 2: AKBP */}
          <div
            onClick={() => setSelectedRank(selectedRank === 'AKBP' ? 'Semua' : 'AKBP')}
            style={{
              backgroundColor: 'var(--color-surface)',
              border: `2px solid ${selectedRank === 'AKBP' ? '#38bdf8' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
              boxShadow: selectedRank === 'AKBP' ? 'var(--shadow-md)' : 'var(--shadow-sm)',
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
                  AKBP
                </span>
                <div style={{ fontSize: '26px', fontWeight: 900, color: 'var(--color-navy)', marginTop: '6px' }}>
                  {REKAPITULASI_NOMINATIF_GADIK.akbp}{' '}
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Orang</span>
                </div>
              </div>
              <div style={{ fontSize: '20px' }}>💠</div>
            </div>
            <div style={{ marginTop: '10px', fontSize: '11.5px', color: 'var(--color-text-muted)', borderTop: '1px dashed var(--color-border)', paddingTop: '8px' }}>
              <div>• Gadik Madya: <strong>3 Orang</strong> (Termasuk AKBP Dewi S.)</div>
              <div>• Widyaiswara Muda Tk. I: <strong>3 Orang</strong></div>
            </div>
          </div>

          {/* Card 3: KOMPOL */}
          <div
            onClick={() => setSelectedRank(selectedRank === 'KOMPOL' ? 'Semua' : 'KOMPOL')}
            style={{
              backgroundColor: 'var(--color-surface)',
              border: `2px solid ${selectedRank === 'KOMPOL' ? '#a78bfa' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
              boxShadow: selectedRank === 'KOMPOL' ? 'var(--shadow-md)' : 'var(--shadow-sm)',
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
                  KOMPOL
                </span>
                <div style={{ fontSize: '26px', fontWeight: 900, color: 'var(--color-navy)', marginTop: '6px' }}>
                  {REKAPITULASI_NOMINATIF_GADIK.kompol}{' '}
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Orang</span>
                </div>
              </div>
              <div style={{ fontSize: '20px' }}>🔷</div>
            </div>
            <div style={{ marginTop: '10px', fontSize: '11.5px', color: 'var(--color-text-muted)', borderTop: '1px dashed var(--color-border)', paddingTop: '8px' }}>
              <div>• Widyaiswara Muda Tk. I: <strong>3 Orang</strong></div>
              <div>• Eselon III A2 & III B</div>
            </div>
          </div>

          {/* Card 4: IPTU */}
          <div
            onClick={() => setSelectedRank(selectedRank === 'IPTU' ? 'Semua' : 'IPTU')}
            style={{
              backgroundColor: 'var(--color-surface)',
              border: `2px solid ${selectedRank === 'IPTU' ? '#34d399' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
              boxShadow: selectedRank === 'IPTU' ? 'var(--shadow-md)' : 'var(--shadow-sm)',
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
                  IPTU
                </span>
                <div style={{ fontSize: '26px', fontWeight: 900, color: 'var(--color-navy)', marginTop: '6px' }}>
                  {REKAPITULASI_NOMINATIF_GADIK.iptu}{' '}
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Orang</span>
                </div>
              </div>
              <div style={{ fontSize: '20px' }}>🔹</div>
            </div>
            <div style={{ marginTop: '10px', fontSize: '11.5px', color: 'var(--color-text-muted)', borderTop: '1px dashed var(--color-border)', paddingTop: '8px' }}>
              <div>• Widyaiswara Pratama Tk. I: <strong>1 Orang</strong></div>
              <div>• Eselon IV B (Gol. III-B)</div>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER & VIEW MODE CONTROLS */}
      <section
        aria-label="Pencarian dan Filter Gadik"
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
        {/* Top Control Row */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Box */}
          <div style={{ flex: '1 1 320px' }}>
            <input
              type="search"
              placeholder="Cari nama Gadik, NRP, pangkat, eselon, atau kepakaran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              style={{ width: '100%', paddingLeft: '14px' }}
              aria-label="Cari Gadik"
            />
          </div>

          {/* View Mode Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid',
                borderColor: viewMode === 'table' ? 'var(--color-primary)' : 'var(--color-border)',
                backgroundColor: viewMode === 'table' ? 'var(--color-primary-light)' : 'transparent',
                color: viewMode === 'table' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontWeight: viewMode === 'table' ? 700 : 500,
                fontSize: '12.5px',
                cursor: 'pointer',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              <span>Format Tabel Kedinasan</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('cards')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid',
                borderColor: viewMode === 'cards' ? 'var(--color-primary)' : 'var(--color-border)',
                backgroundColor: viewMode === 'cards' ? 'var(--color-primary-light)' : 'transparent',
                color: viewMode === 'cards' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontWeight: viewMode === 'cards' ? 700 : 500,
                fontSize: '12.5px',
                cursor: 'pointer',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span>Format Kartu Profil</span>
            </button>
          </div>
        </div>

        {/* Filter Badges Row */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Pangkat:</span>
          {['Semua', 'KOMBES POL', 'AKBP', 'KOMPOL', 'IPTU'].map((rank) => (
            <button
              key={rank}
              type="button"
              onClick={() => setSelectedRank(rank)}
              style={{
                fontSize: '12px',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: selectedRank === rank ? 'var(--color-primary)' : 'var(--color-border)',
                backgroundColor: selectedRank === rank ? 'var(--color-primary)' : 'transparent',
                color: selectedRank === rank ? 'white' : 'var(--color-text-main)',
                fontWeight: selectedRank === rank ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              {rank}
            </button>
          ))}

          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', marginLeft: '12px' }}>
            Jabatan:
          </span>
          {[
            'Semua',
            'Anjak Madya',
            'Widyaiswara Madya Tk. III',
            'Gadik Madya',
            'Widyaiswara Muda Tk. I',
            'Widyaiswara Pratama Tk. I',
          ].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                fontSize: '12px',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: selectedCategory === cat ? 'var(--color-navy)' : 'var(--color-border)',
                backgroundColor: selectedCategory === cat ? 'var(--color-navy)' : 'transparent',
                color: selectedCategory === cat ? 'white' : 'var(--color-text-muted)',
                fontWeight: selectedCategory === cat ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* RESULTS COUNT & STATUS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
        <div>
          Menampilkan <strong>{filteredMembers.length}</strong> dari <strong>{GADIK_NOMINATIF_MEMBERS.length}</strong> anggota fungsional Polri
        </div>
        {(selectedRank !== 'Semua' || selectedCategory !== 'Semua' || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSelectedRank('Semua');
              setSelectedCategory('Semua');
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
            Reset Filter
          </button>
        )}
      </div>

      {/* VIEW MODE 1: TABEL STRUKTUR NOMINATIF KEDINASAN */}
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
              fontSize: '13px',
            }}
          >
            <thead>
              <tr
                style={{
                  background: 'linear-gradient(135deg, #091a38 0%, #103a74 50%, #1d4ed8 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '11.5px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  borderBottom: '3px solid #f59e0b',
                }}
              >
                <th style={{ padding: '14px 14px', width: '45px', textAlign: 'center', color: '#fbbf24' }}>No</th>
                <th style={{ padding: '14px 16px', minWidth: '220px', color: '#ffffff' }}>Nama Lengkap & Gelar</th>
                <th style={{ padding: '14px 14px', minWidth: '150px', color: '#38bdf8' }}>Pangkat / NRP</th>
                <th style={{ padding: '14px 16px', minWidth: '220px', color: '#ffffff' }}>Jabatan Fungsional</th>
                <th style={{ padding: '14px 12px', width: '80px', textAlign: 'center', color: '#e2e8f0' }}>Agama</th>
                <th style={{ padding: '14px 12px', width: '90px', textAlign: 'center', color: '#e2e8f0' }}>Eselon</th>
                <th style={{ padding: '14px 12px', width: '80px', textAlign: 'center', color: '#e2e8f0' }}>Golongan</th>
                <th style={{ padding: '14px 16px', minWidth: '240px', color: '#ffffff' }}>Bidang Kepakaran Pengajaran</th>
                <th style={{ padding: '14px 14px', width: '110px', textAlign: 'center', color: '#fbbf24' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member, idx) => {
                const rankColor = getRankBadgeColor(member.pangkat);
                const isSelected = selectedGadik?.id === member.id;
                return (
                  <tr
                    key={member.id}
                    onClick={() => handleOpenGadikModal(member)}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      backgroundColor: isSelected ? 'var(--color-primary-light)' : idx % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-hover)',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                      {member.noUrut}
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 800, color: 'var(--color-navy)', fontSize: '13.5px' }}>
                        {member.nama}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        {member.kategoriJabatan}
                      </div>
                    </td>

                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          backgroundColor: rankColor.bg,
                          color: rankColor.text,
                          padding: '2px 7px',
                          borderRadius: 'var(--radius-sm)',
                          border: `1px solid ${rankColor.border}`,
                          display: 'inline-block',
                          marginBottom: '4px',
                        }}
                      >
                        {member.pangkat}
                      </span>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-main)', fontFamily: 'monospace' }}>
                        NRP. {member.nrp}
                      </div>
                    </td>

                    <td style={{ padding: '12px 16px', fontSize: '12.5px', color: 'var(--color-text-main)', lineHeight: 1.4 }}>
                      {member.jabatan}
                    </td>

                    <td style={{ padding: '12px 12px', textAlign: 'center', fontSize: '11.5px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                      {member.agama}
                    </td>

                    <td style={{ padding: '12px 12px', textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: 'var(--color-surface-hover)',
                          border: '1px solid var(--color-border)',
                          padding: '2px 6px',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        {member.eselon}
                      </span>
                    </td>

                    <td style={{ padding: '12px 12px', textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 700,
                          color: 'var(--color-primary)',
                        }}
                      >
                        {member.golongan}
                      </span>
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {member.bidangKepakaran.slice(0, 2).map((kep, kIdx) => (
                          <span
                            key={kIdx}
                            style={{
                              fontSize: '11px',
                              backgroundColor: 'var(--color-surface-hover)',
                              border: '1px solid var(--color-border-subtle)',
                              padding: '2px 6px',
                              borderRadius: 'var(--radius-sm)',
                              color: 'var(--color-text-main)',
                            }}
                          >
                            {kep}
                          </span>
                        ))}
                        {member.bidangKepakaran.length > 2 && (
                          <span style={{ fontSize: '10.5px', color: 'var(--color-primary)', fontWeight: 600, alignSelf: 'center' }}>
                            +{member.bidangKepakaran.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenGadikModal(member);
                        }}
                        className="btn btn-primary"
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        Lihat Profil
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW MODE 2: KATALOG KARTU PROFIL PENDIDIK */}
      {viewMode === 'cards' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '18px',
          }}
        >
          {filteredMembers.map((member) => {
            const rankColor = getRankBadgeColor(member.pangkat);
            return (
              <div
                key={member.id}
                onClick={() => handleOpenGadikModal(member)}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  {/* Top Badge Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        backgroundColor: rankColor.bg,
                        color: rankColor.text,
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${rankColor.border}`,
                      }}
                    >
                      {member.pangkat}
                    </span>

                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                      NRP {member.nrp}
                    </span>
                  </div>

                  {/* Name and Jabatan */}
                  <h3
                    style={{
                      fontSize: '15px',
                      fontWeight: 800,
                      color: 'var(--color-navy)',
                      margin: '0 0 6px',
                      lineHeight: 1.35,
                    }}
                  >
                    {member.nama}
                  </h3>

                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '8px' }}>
                    {member.jabatan}
                  </div>

                  {/* Eselon, Golongan, Agama chips */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    <span style={{ fontSize: '10.5px', padding: '2px 6px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border)' }}>
                      Eselon {member.eselon}
                    </span>
                    <span style={{ fontSize: '10.5px', padding: '2px 6px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border)' }}>
                      Gol. {member.golongan}
                    </span>
                    <span style={{ fontSize: '10.5px', padding: '2px 6px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border)' }}>
                      {member.agama}
                    </span>
                  </div>

                  {/* Bio brief */}
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.45, margin: '0 0 12px' }}>
                    {member.bio}
                  </p>

                  {/* Expertise list */}
                  <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '10px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Kepakaran & Bahan Ajar:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {member.bidangKepakaran.map((kep, kIdx) => (
                        <span
                          key={kIdx}
                          style={{
                            fontSize: '10.5px',
                            backgroundColor: 'var(--color-primary-light)',
                            color: 'var(--color-primary)',
                            padding: '2px 6px',
                            borderRadius: 'var(--radius-sm)',
                          }}
                        >
                          {kep}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenGadikModal(member);
                    }}
                    className="btn btn-primary"
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 700,
                      padding: '6px 12px',
                      width: '100%',
                    }}
                  >
                    Buka Profil & Naskah Terkait
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {filteredMembers.length === 0 && (
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
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔍</div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-navy)', margin: '0 0 6px' }}>
            Data Anggota Fungsional Tidak Ditemukan
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', maxWidth: '420px', margin: '0 auto 16px' }}>
            Tidak ada personel Polri yang cocok dengan kata kunci atau filter yang Anda pilih. Silakan sesuaikan pencarian.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedRank('Semua');
              setSelectedCategory('Semua');
              setSearchQuery('');
            }}
            className="btn btn-secondary"
            style={{ fontSize: '12.5px' }}
          >
            Tampilkan Seluruh 16 Anggota Fungsional
          </button>
        </div>
      )}
    </div>
  );
};
