'use client';

import React, { useEffect, useState } from 'react';
import { ResourceItem } from '@/types';
import { StatusBadge } from './StatusBadge';

interface ResourceDetailModalProps {
  resource: ResourceItem | null;
  onClose: () => void;
}

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({
  resource,
  onClose,
}) => {
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (resource) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [resource, onClose]);

  if (!resource) return null;

  const handleMockAction = (actionText: string) => {
    setFeedbackNotice(`[Simulasi Prototipe] Aksi "${actionText}" berhasil dieksekusi secara lokal.`);
    setTimeout(() => {
      setFeedbackNotice(null);
    }, 4000);
  };

  return (
    <div
      className="modal-backdrop"
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
      aria-labelledby="modal-resource-title"
    >
      <div
        className="modal-panel"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-lg)',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--color-primary)',
                  letterSpacing: '0.5px',
                }}
              >
                {resource.category} {resource.subCategory ? `• ${resource.subCategory}` : ''}
              </span>
              <StatusBadge type="lifecycle" value={resource.lifecycle} />
              <StatusBadge type="access" value={resource.access} />
            </div>

            <h2
              id="modal-resource-title"
              style={{
                fontSize: '18px',
                fontWeight: 800,
                color: 'var(--color-navy)',
                lineHeight: 1.35,
              }}
            >
              {resource.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jendela rincian"
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {feedbackNotice && (
            <div
              style={{
                backgroundColor: 'var(--color-info-bg)',
                border: '1px solid var(--color-info-border)',
                color: 'var(--color-info)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              {feedbackNotice}
            </div>
          )}

          {/* Description */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
              Deskripsi / Ringkasan Materi
            </h4>
            <p style={{ fontSize: '14px', color: 'var(--color-text-main)', lineHeight: 1.6 }}>
              {resource.description}
            </p>
          </div>

          {/* Competencies if applicable */}
          {resource.competencies && resource.competencies.length > 0 && (
            <div>
              <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                Kompetensi & Spesialisasi Teruji
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {resource.competencies.map((comp, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: 'var(--color-primary-light)',
                      color: 'var(--color-primary)',
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '14px',
              backgroundColor: 'var(--color-surface-hover)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Penyusun / Pengampu</div>
              <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                {resource.authorOrInstructor}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Unit Pengelola / Sumber</div>
              <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                {resource.unitOrSource}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Tanggal Pembaruan</div>
              <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                {resource.updatedAt}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Klasifikasi Akses Dokumen</div>
              <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                {resource.access} (Sesuai Manual Tata Kelola)
              </div>
            </div>
          </div>

          {/* Digital vs Physical Availability Notice */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: resource.hasDigitalFile ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              {resource.hasDigitalFile ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" color="var(--color-success)">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <strong style={{ fontSize: '13.5px', color: 'var(--color-success)' }}>
                    Berkas Digital Siap Diakses ({resource.fileFormat} • {resource.fileSize})
                  </strong>
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" color="var(--color-warning)">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <strong style={{ fontSize: '13.5px', color: 'var(--color-warning)' }}>
                    {resource.physicalLocation ? 'Koleksi Fisik / Baca di Tempat' : 'Hanya Entri Metadata (Berkas Belum Diunggah)'}
                  </strong>
                </>
              )}
            </div>

            <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', margin: 0 }}>
              {resource.hasDigitalFile
                ? 'Dokumen telah diverifikasi dan dapat dibaca secara terpadu oleh personel dengan hak akses sesuai klasifikasi.'
                : resource.physicalLocation
                ? `Koleksi fisik tersimpan di: ${resource.physicalLocation}. Tidak ada salinan digital terbuka demi keamanan dokumen.`
                : 'Berdasarkan pedoman tata kelola, entri ini tersedia sebagai indeks penelusuran pustaka.'}
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--color-border-subtle)',
            backgroundColor: 'var(--color-surface-hover)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            ID Entri: <code>{resource.id}</code> (Data Fiktif Simulasi)
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-main)',
                borderColor: 'var(--color-border)',
              }}
            >
              Tutup
            </button>

            {resource.hasDigitalFile ? (
              <button
                type="button"
                onClick={() => handleMockAction('Buka Pratinjau Dokumen')}
                className="btn-primary"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>Buka Pratinjau (Demo)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleMockAction('Cek Lokasi Rak Perpustakaan')}
                className="btn-secondary"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                }}
              >
                <span>Cek Ketersediaan Fisik</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
