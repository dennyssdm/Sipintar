'use client';

import React, { useEffect, useState } from 'react';
import { AdminShortcut } from '@/types';

interface AdminActionModalProps {
  shortcut: AdminShortcut | null;
  onClose: () => void;
}

export const AdminActionModal: React.FC<AdminActionModalProps> = ({
  shortcut,
  onClose,
}) => {
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (shortcut) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [shortcut, onClose]);

  if (!shortcut) return null;

  const triggerAction = (label: string) => {
    setFeedback(`[Simulasi Prototipe] Aksi "${label}" berhasil dijalankan pada state lokal prototipe.`);
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  return (
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
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-lg)',
          width: '100%',
          maxWidth: '650px',
          maxHeight: '85vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--color-primary)',
                letterSpacing: '0.5px',
              }}
            >
              Fungsi Administrator • Prototipe
            </span>
            <h3
              id="admin-modal-title"
              style={{
                fontSize: '18px',
                fontWeight: 800,
                color: 'var(--color-navy)',
                margin: '2px 0 0',
              }}
            >
              {shortcut.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jendela administrator"
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-muted)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {feedback && (
            <div
              style={{
                backgroundColor: 'var(--color-success-bg)',
                border: '1px solid var(--color-success-border)',
                color: 'var(--color-success)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              {feedback}
            </div>
          )}

          <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
            {shortcut.description}
          </p>

          {shortcut.title === 'Verifikasi' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                Antrean Dokumen Menunggu Verifikasi ({shortcut.badgeCount || 3} Dokumen)
              </div>
              <div
                style={{
                  backgroundColor: 'var(--color-surface-hover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                    Rancangan Modul Intelijen Taktis
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                    Pengusul: Subdit Analisis • Kategori: Modul & Hanjar
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => triggerAction('Setujui & Publikasikan Modul')}
                    className="btn-primary"
                    style={{ fontSize: '12px', padding: '6px 10px', backgroundColor: 'var(--color-success)' }}
                  >
                    Verifikasi
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerAction('Minta Revisi Pengusul')}
                    className="btn-secondary"
                    style={{ fontSize: '12px', padding: '6px 10px', color: 'var(--color-text-main)' }}
                  >
                    Revisi
                  </button>
                </div>
              </div>
            </div>
          )}

          {shortcut.title === 'Manajemen Data' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                Entri Cepat Sumber Belajar Baru
              </div>
              <div
                style={{
                  backgroundColor: 'var(--color-surface-hover)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  Alur tata kelola mewajibkan setiap naskah baru dimasukkan sebagai status <strong>Draft</strong> sebelum diverifikasi oleh pejabat yang berwenang.
                </div>
                <button
                  type="button"
                  onClick={() => triggerAction('Buka Formulir Tambah Data Mock')}
                  className="btn-primary"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    alignSelf: 'flex-start',
                    fontSize: '12.5px',
                  }}
                >
                  + Tambah Entri Dokumen (Simulasi)
                </button>
              </div>
            </div>
          )}

          {shortcut.title === 'Hak Akses' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                Matriks Peran Pengguna Sesuai Buku Panduan Tata Kelola
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '8px',
                  fontSize: '12px',
                }}
              >
                <div style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                  <strong>Serdik:</strong> Akses materi ajar umum & pustaka sesuai hak.
                </div>
                <div style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                  <strong>Gadik:</strong> Pengampu materi, update kepakaran, dan hanjar ajar.
                </div>
                <div style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                  <strong>Pengelola:</strong> Manajemen metadata, katalog pustaka, dan draf.
                </div>
                <div style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                  <strong>Administrator:</strong> Monitoring sistem dan audit akses data.
                </div>
              </div>
            </div>
          )}

          {shortcut.title === 'Monitoring' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                Indikator Utilisasi & Siklus Dokumen
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '10px',
                  textAlign: 'center',
                }}
              >
                <div style={{ padding: '12px', background: 'var(--color-surface-hover)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-primary)' }}>316</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Total Koleksi Aktif</div>
                </div>
                <div style={{ padding: '12px', background: 'var(--color-surface-hover)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-success)' }}>98.2%</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Telah Terverifikasi</div>
                </div>
                <div style={{ padding: '12px', background: 'var(--color-surface-hover)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-warning)' }}>5</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Masa Berlaku Dekat</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--color-border-subtle)',
            backgroundColor: 'var(--color-surface-hover)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn-primary"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-main)',
              borderColor: 'var(--color-border)',
            }}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
