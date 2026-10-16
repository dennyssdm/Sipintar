import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hak Akses & Matriks Peran — SIPINTAR Sespimma',
  description: 'Matriks kewenangan peran pengguna sesuai Buku Panduan Tata Kelola SIPINTAR.',
};

export default function AdminAksesPage() {
  const rolesMatrix = [
    {
      role: 'Serdik (Peserta Didik)',
      desc: 'Peserta pendidikan Sespimma Lemdiklat Polri.',
      terbuka: 'Akses Penuh',
      internal: 'Akses Pembelajaran',
      terbatas: 'Tidak Berwenang',
      metadata: 'Hanya Lihat Indeks',
      unggah: 'Kertas Karya (Taskap)',
      verifikasi: 'Tidak Ada',
    },
    {
      role: 'Gadik (Tenaga Pendidik)',
      desc: 'Dosen, instruktur, dan pemateri kepolisian.',
      terbuka: 'Akses Penuh',
      internal: 'Akses Pengajaran',
      terbatas: 'Sesuai Penugasan Pokja',
      metadata: 'Lihat Rincian',
      unggah: 'Bahan Ajar & Hanjar',
      verifikasi: 'Review Substansi',
    },
    {
      role: 'Pengelola Data & Pustaka',
      desc: 'Petugas perpustakaan & pengelola berkas digital.',
      terbuka: 'Kelola Katalog',
      internal: 'Kelola Sirkulasi',
      terbatas: 'Metadata & Registrasi',
      metadata: 'Entri Katalog Pustaka',
      unggah: 'Buku, Jurnal, SOP',
      verifikasi: 'Validasi Format',
    },
    {
      role: 'Administrator Sistem',
      desc: 'Pengelola teknis ekosistem SIPINTAR Sespimma.',
      terbuka: 'Kelola & Audit',
      internal: 'Kelola & Audit',
      terbatas: 'Kelola & Audit',
      metadata: 'Monitoring Arsip',
      unggah: 'Dokumen Regulasi',
      verifikasi: 'Otorisasi Penuh',
    },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '16px', fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
        <Link href="/" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
          Beranda
        </Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>Fungsi Admin: Hak Akses</span>
      </nav>

      <header
        style={{
          background: 'linear-gradient(135deg, #07162d 0%, #0d2549 50%, #16407c 100%)',
          color: '#ffffff',
          border: '1px solid rgba(251, 191, 36, 0.25)',
          borderRadius: 'var(--radius-lg)',
          padding: '26px 30px',
          marginBottom: '24px',
          boxShadow: '0 8px 24px rgba(7, 22, 45, 0.2)',
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

        <div style={{ position: 'relative', zIndex: 1 }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#fbbf24',
              backgroundColor: 'rgba(251, 191, 36, 0.15)',
              border: '1px solid rgba(251, 191, 36, 0.35)',
              padding: '3px 8px',
              borderRadius: 'var(--radius-sm)',
              letterSpacing: '0.6px',
              display: 'inline-block',
              marginBottom: '6px',
            }}
          >
            Kebijakan Keamanan & Otorisasi Institusi
          </span>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#ffffff',
              margin: '2px 0 6px',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
            }}
          >
            Matriks Hak Akses Peran Pengguna
          </h1>
          <p style={{ fontSize: '13.5px', color: '#cbd5e1', maxWidth: '750px', lineHeight: 1.55, margin: 0 }}>
            Prinsip dasar tata kelola SIPINTAR membagi hak akses secara berjenjang berdasarkan peran tugas fungsional untuk memastikan kerahasiaan materi strategis kepolisian.
          </p>
        </div>
      </header>

      {/* Access Classification Guide Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          marginBottom: '24px',
        }}
      >
        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-success)', marginBottom: '4px' }}>
            Klasifikasi Terbuka
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Dapat diakses secara publik dan tidak memuat informasi rahasia atau operasional internal terbatas.
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
            Klasifikasi Internal
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Hanya dapat diakses oleh personel yang terdaftar di lingkungan Sespimma Lemdiklat Polri.
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-warning)', marginBottom: '4px' }}>
            Klasifikasi Terbatas
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Memerlukan izin khusus pimpinan atau pokja tertentu karena menyangkut taktik dan strategi sensitif.
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px' }}>
            Metadata Saja
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Hanya judul, lokasi fisik rak, dan abstrak yang ditampilkan. Berkas digital tidak dapat diunduh.
          </div>
        </div>
      </div>

      {/* Role Matrix Table */}
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
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-hover)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Peran Pengguna</th>
                <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Akses Terbuka</th>
                <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Akses Internal</th>
                <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Akses Terbatas</th>
                <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Hak Unggah</th>
                <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Otoritas Verifikasi</th>
              </tr>
            </thead>
            <tbody>
              {rolesMatrix.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{item.role}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{item.desc}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>{item.terbuka}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{item.internal}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ color: item.terbatas === 'Tidak Berwenang' ? 'var(--color-danger)' : 'var(--color-warning)', fontWeight: 600 }}>
                      {item.terbatas}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text-main)' }}>
                    {item.unggah}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text-main)' }}>
                    {item.verifikasi}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
