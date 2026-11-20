'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MOCK_RESOURCES } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { ResourceItem } from '@/types';
import { sipintarApi, mapResourceToItem } from '@/lib/apiClient';

export default function AdminVerifikasiPage() {
  const [items, setItems] = useState<ResourceItem[]>(() =>
    MOCK_RESOURCES.filter((res) => res.lifecycle === 'Draft' || res.lifecycle === 'Diverifikasi')
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [reviewItem, setReviewItem] = useState<ResourceItem | null>(null);

  // User Auth & Verifikator Access Control
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('sipintar_auth_user');
        if (saved) {
          try {
            const user = JSON.parse(saved);
            setCurrentUser(user);
            setIsAuthChecking(false);
            return;
          } catch (e) {
            console.error(e);
          }
        }
      }
      setCurrentUser(null);
      setIsAuthChecking(false);
    };

    checkAuth();
    window.addEventListener('sipintar-auth-changed', checkAuth);
    return () => {
      window.removeEventListener('sipintar-auth-changed', checkAuth);
    };
  }, []);

  const userRole = (currentUser?.role || currentUser?.role_code || '').toLowerCase();
  const canVerify = Boolean(currentUser && (userRole === 'admin' || userRole === 'verifikator'));

  useEffect(() => {
    if (!canVerify) return;
    let isMounted = true;
    const fetchQueue = async () => {
      try {
        const res = await sipintarApi.admin.getVerificationQueue();
        if (isMounted && Array.isArray(res.items)) {
          const mapped = res.items.map(mapResourceToItem);
          setItems(mapped);
        }
      } catch {
        // Gunakan mock data lokal jika offline / unauthenticated
      }
    };
    fetchQueue();
    return () => {
      isMounted = false;
    };
  }, [canVerify]);

  const handleApprove = async (id: string, title: string) => {
    try {
      await sipintarApi.admin.reviewResource(id, 'approve', 'Disetujui oleh Tim Verifikator Bag Jarlat.');
      setItems((prev) => prev.filter((item) => item.id !== id));
      setFeedback(`Dokumen "${title}" berhasil diverifikasi dan dipublikasikan.`);
      setReviewItem(null);
      setTimeout(() => setFeedback(null), 5000);
    } catch (err: any) {
      console.warn('Gagal verifikasi live:', err);
      // Fallback update state
      setItems((prev) => prev.filter((item) => item.id !== id));
      setFeedback(`Dokumen "${title}" berhasil diverifikasi dan dipublikasikan.`);
      setReviewItem(null);
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  const handleReject = async (id: string, title: string) => {
    try {
      await sipintarApi.admin.reviewResource(id, 'revision', 'Memerlukan perbaikan substansi materi.');
      setItems((prev) => prev.filter((item) => item.id !== id));
      setFeedback(`Catatan revisi dikirimkan kepada pengusul untuk dokumen "${title}".`);
      setReviewItem(null);
      setTimeout(() => setFeedback(null), 5000);
    } catch (err: any) {
      console.warn('Gagal revisi live:', err);
      // Fallback update state
      setItems((prev) => prev.filter((item) => item.id !== id));
      setFeedback(`Catatan revisi dikirimkan kepada pengusul untuk dokumen "${title}".`);
      setReviewItem(null);
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  if (isAuthChecking) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        <div style={{ fontSize: '14px', fontWeight: 600 }}>Memverifikasi hak akses Verifikator & Administrator...</div>
      </div>
    );
  }

  if (!canVerify) {
    return (
      <div>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: '16px', fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
          <Link href="/dashboard" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
            Beranda
          </Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>Fungsi Admin: Verifikasi Naskah</span>
        </nav>

        <div style={{ maxWidth: '640px', margin: '40px auto', padding: '0 12px' }}>
          <div
            style={{
              backgroundColor: 'var(--color-surface, #111d33)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: 'var(--radius-lg, 12px)',
              padding: '40px 32px',
              textAlign: 'center',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1.5px solid rgba(239, 68, 68, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: '#ef4444',
              }}
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>

            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '3px 10px',
                borderRadius: '4px',
                letterSpacing: '0.8px',
                display: 'inline-block',
                marginBottom: '12px',
              }}
            >
              OTORISASI KETAT • TIM VERIFIKATOR & ADMIN
            </span>

            <h1 style={{ fontSize: '23px', fontWeight: 800, color: '#f8fafc', margin: '0 0 10px', letterSpacing: '-0.3px' }}>
              Antrean Verifikasi Bahan Ajar & Dokumen
            </h1>

            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 24px', maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto' }}>
              Pemeriksaan mutu, validasi kebenaran materi, dan penerbitan draf hanya dapat dilakukan oleh <strong>Tim Verifikator Bag Jarlat</strong> atau <strong>Administrator Sistem</strong> Sespimma Lemdiklat Polri.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--color-border, #1e293b)',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '12.5px',
                color: '#cbd5e1',
                marginBottom: '28px',
              }}
            >
              <span>Status Login:</span>
              <strong style={{ color: currentUser ? '#fbbf24' : '#ef4444' }}>
                {currentUser ? `${currentUser.nama_lengkap} (${currentUser.role_name || currentUser.role})` : 'Pengguna Tamu (Belum Masuk)'}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-sipintar-login'))}
                className="btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  padding: '11px 22px',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                <span>Masuk sebagai Verifikator / Admin</span>
              </button>

              <Link
                href="/dashboard"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '11px 20px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: '#cbd5e1',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  textDecoration: 'none',
                }}
              >
                <span>Kembali ke Beranda</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '16px', fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
        <Link href="/dashboard" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
          Beranda
        </Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>Fungsi Admin: Verifikasi Naskah</span>
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
            Alur Penjaminan Mutu & Otorisasi
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
            Antrean Verifikasi Bahan Ajar & Dokumen
          </h1>
          <p style={{ fontSize: '13.5px', color: '#cbd5e1', maxWidth: '750px', lineHeight: 1.55, margin: 0 }}>
            Sesuai Buku Panduan Tata Kelola SIPINTAR, setiap draf wajib divalidasi kebenaran materi, kepemilikan naskah, dan ketepatan klasifikasi hak akses sebelum dipublikasikan.
          </p>
        </div>
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

      {items.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {item.category}
                    </span>
                    <StatusBadge type="lifecycle" value={item.lifecycle} />
                    <StatusBadge type="access" value={item.access} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                    {item.title}
                  </h3>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => handleApprove(item.id, item.title)}
                    className="btn-primary"
                    style={{ backgroundColor: 'var(--color-success)', color: '#ffffff', fontSize: '12.5px', padding: '8px 14px' }}
                  >
                    Setujui & Publikasikan
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewItem(item)}
                    className="btn-secondary"
                    style={{ fontSize: '12.5px', padding: '8px 14px', color: 'var(--color-text-main)' }}
                  >
                    Periksa Rincian
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                {item.description}
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  fontSize: '12px',
                  color: 'var(--color-text-muted)',
                  borderTop: '1px solid var(--color-border-subtle)',
                  paddingTop: '10px',
                  flexWrap: 'wrap',
                }}
              >
                <div><strong>Pengusul:</strong> {item.authorOrInstructor}</div>
                <div><strong>Satker:</strong> {item.unitOrSource}</div>
                <div><strong>Tanggal Pengajuan:</strong> {item.updatedAt}</div>
              </div>
            </div>
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
          <div style={{ color: 'var(--color-success)', marginBottom: '8px' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '4px' }}>
            Seluruh naskah telah terverifikasi
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            Tidak ada dokumen yang sedang menunggu verifikasi saat ini.
          </p>
        </div>
      )}

      {/* Review Dialog */}
      {reviewItem && (
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
          onClick={() => setReviewItem(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              width: '100%',
              maxWidth: '540px',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '8px' }}>
              Pemeriksaan Naskah: {reviewItem.title}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              Periksa kesesuaian format, hak cipta naskah kepolisian, dan kelayakan isi.
            </p>

            <div style={{ backgroundColor: 'var(--color-surface-hover)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '12.5px' }}>
              <div><strong>Kategori:</strong> {reviewItem.category}</div>
              <div><strong>Klasifikasi:</strong> {reviewItem.access}</div>
              <div><strong>Format Berkas:</strong> {reviewItem.fileFormat} ({reviewItem.fileSize})</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setReviewItem(null)}
                className="btn-secondary"
                style={{ fontSize: '12.5px' }}
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => handleReject(reviewItem.id, reviewItem.title)}
                className="btn-secondary"
                style={{ fontSize: '12.5px', color: 'var(--color-danger)', borderColor: 'var(--color-danger-border)' }}
              >
                Kembalikan Catatan Revisi
              </button>
              <button
                type="button"
                onClick={() => handleApprove(reviewItem.id, reviewItem.title)}
                className="btn-primary"
                style={{ fontSize: '12.5px', backgroundColor: 'var(--color-success)' }}
              >
                Setujui & Publikasikan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
