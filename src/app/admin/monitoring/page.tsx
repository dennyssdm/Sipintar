import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { MOCK_RESOURCES } from '@/data/mockData';

export const metadata: Metadata = {
  title: 'Monitoring Tata Kelola — SIPINTAR Sespimma',
  description: 'Pemantauan masa berlaku dokumen, log akses, dan utilisasi materi ajar Sespimma.',
};

export default function AdminMonitoringPage() {
  const total = MOCK_RESOURCES.length;
  const published = MOCK_RESOURCES.filter((r) => r.lifecycle === 'Dipublikasikan').length;
  const verified = MOCK_RESOURCES.filter((r) => r.lifecycle === 'Diverifikasi').length;
  const draft = MOCK_RESOURCES.filter((r) => r.lifecycle === 'Draft').length;
  const archived = MOCK_RESOURCES.filter((r) => r.lifecycle === 'Arsip').length;
  const inactive = MOCK_RESOURCES.filter((r) => r.lifecycle === 'Tidak Aktif').length;

  const mockLogs = [
    { time: '14 Okt 2026, 20:45', user: 'Serdik Arya Ramadhan', action: 'Membaca Hanjar Kepemimpinan Strategis (res-001)', satker: 'Sindikat 3' },
    { time: '14 Okt 2026, 20:12', user: 'Gadik Kombes Hendra Pratama', action: 'Memperbarui Silabus Bahan Ajar (res-007)', satker: 'Bag Jarlat' },
    { time: '14 Okt 2026, 19:30', user: 'Pengelola Pustaka', action: 'Pembaruan Lokasi Rak Buku Hukum Pidana (res-002)', satker: 'Perpustakaan' },
    { time: '14 Okt 2026, 17:05', user: 'Admin Tata Kelola', action: 'Persetujuan Verifikasi Modul Intelijen Taktis (res-008)', satker: 'Subbag Renlat' },
    { time: '14 Okt 2026, 15:40', user: 'Serdik Budi Santoso', action: 'Penelusuran Kertas Karya Taskap Pelayanan Publik', satker: 'Sindikat 1' },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '16px', fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
        <Link href="/" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
          Beranda
        </Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>Fungsi Admin: Monitoring</span>
      </nav>

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
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--color-primary)',
            letterSpacing: '0.6px',
          }}
        >
          Audit Transparansi & Siklus Materi
        </span>
        <h1
          style={{
            fontSize: '22px',
            fontWeight: 800,
            color: 'var(--color-navy)',
            margin: '4px 0 6px',
          }}
        >
          Monitoring Tata Kelola & Log Akses
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', maxWidth: '750px' }}>
          Pemantauan kesehatan platform, distribusi siklus naskah pembelajaran, serta catatan aktivitas penelusuran materi oleh pengguna Sespimma.
        </p>
      </header>

      {/* Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '14px',
          marginBottom: '24px',
        }}
      >
        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary)' }}>{total}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Total Koleksi Terdata</div>
        </div>

        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-success)' }}>{published}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Dipublikasikan</div>
        </div>

        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-info)' }}>{verified}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Menunggu Rilis</div>
        </div>

        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-warning)' }}>{draft}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Draf Dalam Penyusunan</div>
        </div>

        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#6b7280' }}>{archived + inactive}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Arsip / Tidak Aktif</div>
        </div>
      </div>

      {/* Activity Log Simulation Table */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-navy)' }}>
            Log Aktivitas Pengguna Terkini (Simulasi Audit Trail)
          </h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-hover)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Waktu Akses</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Identitas Personel</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Aktivitas / Objek Dokumen</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Satker / Sindikat</th>
              </tr>
            </thead>
            <tbody>
              {mockLogs.map((log, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                    {log.time}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                    {log.user}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-text-main)' }}>
                    {log.action}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                    {log.satker}
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
