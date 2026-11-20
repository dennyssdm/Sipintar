'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MOCK_RESOURCES } from '@/data/mockData';
import { sipintarApi } from '@/lib/apiClient';

interface LogItem {
  time: string;
  user: string;
  action: string;
  satker: string;
}

export default function AdminMonitoringPage() {
  const [counts, setCounts] = useState(() => ({
    total: MOCK_RESOURCES.length,
    published: MOCK_RESOURCES.filter((r) => r.lifecycle === 'Dipublikasikan').length,
    verified: MOCK_RESOURCES.filter((r) => r.lifecycle === 'Diverifikasi').length,
    draft: MOCK_RESOURCES.filter((r) => r.lifecycle === 'Draft').length,
    archived: MOCK_RESOURCES.filter((r) => r.lifecycle === 'Arsip').length,
    inactive: MOCK_RESOURCES.filter((r) => r.lifecycle === 'Tidak Aktif').length,
  }));

  const [logs, setLogs] = useState<LogItem[]>([
    { time: '14 Okt 2026, 20:45', user: 'Serdik Arya Ramadhan', action: 'Membaca Hanjar Kepemimpinan Strategis (res-001)', satker: 'Sindikat 3' },
    { time: '14 Okt 2026, 20:12', user: 'Gadik Kombes Hendra Pratama', action: 'Memperbarui Silabus Bahan Ajar (res-007)', satker: 'Bag Jarlat' },
    { time: '14 Okt 2026, 19:30', user: 'Pengelola Pustaka', action: 'Pembaruan Lokasi Rak Buku Hukum Pidana (res-002)', satker: 'Perpustakaan' },
    { time: '14 Okt 2026, 17:05', user: 'Admin Tata Kelola', action: 'Persetujuan Verifikasi Modul Intelijen Taktis (res-008)', satker: 'Subbag Renlat' },
    { time: '14 Okt 2026, 15:40', user: 'Serdik Budi Santoso', action: 'Penelusuran Kertas Karya Taskap Pelayanan Publik', satker: 'Sindikat 1' },
  ]);

  const [isLiveApi, setIsLiveApi] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchMonitoringData = async () => {
      try {
        const stats = await sipintarApi.admin.getStats();
        if (isMounted && stats && stats.overview?.lifecycle) {
          interface LifecycleCount {
            lifecycle_status: string;
            count: number;
          }
          const lc: LifecycleCount[] = stats.overview.lifecycle;
          const draft = lc.find((l) => l.lifecycle_status === 'Draft')?.count || 0;
          const verified = lc.find((l) => l.lifecycle_status === 'Diverifikasi')?.count || 0;
          const published = lc.find((l) => l.lifecycle_status === 'Dipublikasikan')?.count || 0;
          const inactive = lc.find((l) => l.lifecycle_status === 'Tidak Aktif')?.count || 0;
          const archived = lc.find((l) => l.lifecycle_status === 'Arsip')?.count || 0;
          const total = draft + verified + published + inactive + archived;

          setCounts({ total, published, verified, draft, archived, inactive });
          setIsLiveApi(true);
        }

        const logRes = await sipintarApi.admin.getLogs({ type: 'activity', limit: 10 });
        if (isMounted && logRes && Array.isArray(logRes.items) && logRes.items.length > 0) {
          interface ApiLog {
            created_at: string;
            user_name_snapshot?: string;
            description: string;
            satker_sindikat?: string;
            role_snapshot?: string;
          }
          const mappedLogs: LogItem[] = logRes.items.map((item: ApiLog) => ({
            time: new Date(item.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
            user: item.user_name_snapshot || 'Pengguna Terdaftar',
            action: item.description,
            satker: item.satker_sindikat || item.role_snapshot?.toUpperCase() || 'Sespimma Lemdiklat'
          }));
          setLogs(mappedLogs);
          setIsLiveApi(true);
        }
      } catch {
        // Fallback aman ke mock data lokal
      }
    };

    fetchMonitoringData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '16px', fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
        <Link href="/dashboard" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
          Beranda
        </Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>Fungsi Admin: Monitoring</span>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
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
              }}
            >
              Audit Transparansi & Siklus Materi
            </span>

            {isLiveApi && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '16px',
                  padding: '3px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                Database REST API & Audit Log Aktif
              </span>
            )}
          </div>

          <h1
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#ffffff',
              margin: '2px 0 6px',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
            }}
          >
            Monitoring Tata Kelola & Log Akses
          </h1>
          <p style={{ fontSize: '13.5px', color: '#cbd5e1', maxWidth: '750px', lineHeight: 1.55, margin: 0 }}>
            Pemantauan kesehatan platform, distribusi siklus naskah pembelajaran, serta catatan aktivitas penelusuran materi oleh pengguna Sespimma.
          </p>
        </div>
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
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary)' }}>{counts.total}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Total Koleksi Terdata</div>
        </div>

        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-success)' }}>{counts.published}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Dipublikasikan</div>
        </div>

        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-info)' }}>{counts.verified}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Menunggu Rilis</div>
        </div>

        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-warning)' }}>{counts.draft}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Draf Dalam Penyusunan</div>
        </div>

        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#6b7280' }}>{counts.archived + counts.inactive}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Arsip / Tidak Aktif</div>
        </div>
      </div>

      {/* Activity Log Table */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>
            {isLiveApi ? 'Jejak Audit Aktivitas Resmi (activity_logs MySQL)' : 'Log Aktivitas Pengguna Terkini (Simulasi Audit Trail)'}
          </h2>
          {isLiveApi && (
            <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
              Menampilkan {logs.length} entri audit terbaru
            </span>
          )}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-hover)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Waktu Akses</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Identitas Personel</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Aktivitas / Objek Dokumen</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Satker / Peran</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, idx) => (
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
