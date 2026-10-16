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
  const [activeReaderTab, setActiveReaderTab] = useState<'silabus' | 'naskah' | 'tugas'>('silabus');
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

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
              {resource.fileUrl
                ? 'Naskah Hanjar resmi Sespimma Lemdiklat Polri TA 2025 telah diverifikasi dan siap dibaca atau diunduh secara penuh.'
                : resource.hasDigitalFile
                ? 'Dokumen telah diverifikasi dan dapat dibaca secara terpadu oleh personel dengan hak akses sesuai klasifikasi.'
                : resource.physicalLocation
                ? `Koleksi fisik tersimpan di: ${resource.physicalLocation}. Tidak ada salinan digital terbuka demi keamanan dokumen.`
                : 'Berdasarkan pedoman tata kelola, entri ini tersedia sebagai indeks penelusuran pustaka.'}
            </p>
          </div>

          {/* Embedded PDF Viewer for Authentic Hanjar Files */}
          {resource.fileUrl && (
            <div
              style={{
                marginTop: '16px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
              }}
            >
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'var(--color-surface-hover)',
                  borderBottom: '1px solid var(--color-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12.5px',
                  fontWeight: 600,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-navy)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" color="#dc2626">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span>Pratinjau Dokumen Hanjar Asli (PDF)</span>
                </div>
                <a
                  href={resource.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--color-primary)',
                    textDecoration: 'none',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Buka Layar Penuh</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>
              <iframe
                src={resource.fileUrl}
                title={resource.title}
                style={{
                  width: '100%',
                  height: '460px',
                  border: 'none',
                  display: 'block',
                  backgroundColor: '#525659',
                }}
              />
            </div>
          )}

          {/* Simulated Digital Reader for Hanjar without Direct PDF or for other Digital Moduls */}
          {!resource.fileUrl && (resource.category === 'Modul & Hanjar' || resource.hasDigitalFile) && (
            <div className="hanjar-reader-container">
              <div className="hanjar-reader-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" color="#60a5fa" aria-hidden="true">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.3px' }}>
                      Pratinjau Naskah Digital Hanjar (Digital Manuscript)
                    </div>
                    <div style={{ fontSize: '10.5px', color: 'rgba(255, 255, 255, 0.7)' }}>
                      KODIFIKASI: HNJ-SESPIMMA-2026/{resource.id.toUpperCase()} • POKJA KURIKULUM JARLAT
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')}
                    style={{
                      padding: '4px 9px',
                      fontSize: '11px',
                      fontWeight: 600,
                      borderRadius: '4px',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      backgroundColor: 'rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      cursor: 'pointer',
                    }}
                    title="Ubah ukuran teks bacaan"
                  >
                    Teks: {fontSize === 'normal' ? 'A (Standar)' : 'A+ (Besar)'}
                  </button>
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(37, 99, 235, 0.3)',
                      color: '#93c5fd',
                      border: '1px solid rgba(37, 99, 235, 0.5)',
                    }}
                  >
                    {resource.fileFormat || 'PDF'} • {resource.fileSize || 'Digital'}
                  </span>
                </div>
              </div>

              {/* Reader Tabs */}
              <div className="hanjar-reader-tabs">
                <button
                  type="button"
                  className={`hanjar-reader-tab-btn ${activeReaderTab === 'silabus' ? 'active' : ''}`}
                  onClick={() => setActiveReaderTab('silabus')}
                >
                  1. Struktur Bab & Silabus Ajar
                </button>
                <button
                  type="button"
                  className={`hanjar-reader-tab-btn ${activeReaderTab === 'naskah' ? 'active' : ''}`}
                  onClick={() => setActiveReaderTab('naskah')}
                >
                  2. Kutipan Naskah Ajar (Reading View)
                </button>
                <button
                  type="button"
                  className={`hanjar-reader-tab-btn ${activeReaderTab === 'tugas' ? 'active' : ''}`}
                  onClick={() => setActiveReaderTab('tugas')}
                >
                  3. Instrumen Evaluasi & Lembar Penugasan
                </button>
              </div>

              {/* Reader Body Content */}
              <div className="hanjar-reader-paper" style={{ fontSize: fontSize === 'large' ? '15px' : '13.5px' }}>
                {activeReaderTab === 'silabus' && (
                  <div>
                    <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                        Standar Kompetensi Lulusan (SKL) Sespimma
                      </span>
                      <h4 style={{ margin: '4px 0 8px', fontSize: '15px', color: 'var(--color-navy)' }}>
                        Capaian Pembelajaran Materi: {resource.title}
                      </h4>
                      <p style={{ margin: 0, color: 'var(--color-text-muted)', lineHeight: 1.55 }}>
                        Peserta didik ditargetkan mampu menganalisis doktrin operasional, memimpin satuan kewilayahan, dan merumuskan pengambilan keputusan taktis yang akuntabel dan berintegritas.
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                      <div className="hanjar-chapter-card">
                        <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '12.5px', marginBottom: '4px' }}>
                          BAB I — Ketentuan Umum & Urgensi Pembelajaran
                        </div>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-muted)' }}>
                          Latar belakang doktrin pemolisian Presisi, perkembangan dinamika kamtibmas terkini, dan sasaran kompetensi perwira pertama/menengah.
                        </p>
                      </div>

                      <div className="hanjar-chapter-card">
                        <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '12.5px', marginBottom: '4px' }}>
                          BAB II — Kerangka Konseptual & Landasan Yuridis
                        </div>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-muted)' }}>
                          Landasan hukum UU No. 2 Tahun 2002, Perkap, prinsip perlindungan HAM, dan metodologi kepemimpinan strategis organisasi Polri.
                        </p>
                      </div>

                      <div className="hanjar-chapter-card">
                        <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '12.5px', marginBottom: '4px' }}>
                          BAB III — Implementasi Taktis & Penanganan Kasus
                        </div>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-muted)' }}>
                          Standar prosedur penanganan gangguan, manajemen kontinjensi, pemecahan masalah (Problem-Oriented Policing), dan koordinasi satuan.
                        </p>
                      </div>

                      <div className="hanjar-chapter-card">
                        <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '12.5px', marginBottom: '4px' }}>
                          BAB IV — Evaluasi Pembelajaran & Penugasan
                        </div>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-muted)' }}>
                          Pedoman penyusunan telaah staf naskah ajar, simulasi gladi posko taktis sindikat, dan instrumen uji komprehensif peserta didik.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeReaderTab === 'naskah' && (
                  <div>
                    <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '14px', borderBottom: '2px solid var(--color-border)' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px', color: 'var(--color-text-muted)' }}>
                        LEMBAGA PENDIDIKAN DAN PELATIHAN POLRI
                      </div>
                      <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--color-primary)' }}>
                        SEKOLAH STAF DAN PIMPINAN PERTAMA (SESPIMMA)
                      </div>
                      <h3 style={{ margin: '8px 0 4px', fontSize: '16px', color: 'var(--color-navy)' }}>
                        {resource.title}
                      </h3>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        Pengampu: {resource.authorOrInstructor} • {resource.unitOrSource}
                      </div>
                    </div>

                    <h4 style={{ color: 'var(--color-navy)', fontSize: '14px', marginBottom: '8px' }}>
                      1.1. Latar Belakang dan Urgensi Pembelajaran
                    </h4>
                    <p style={{ marginBottom: '14px' }}>
                      Perkembangan peradaban dan era disrupsi informasi menuntut institusi Kepolisian Negara Republik Indonesia untuk senantiasa beradaptasi dalam mengawal keamanan dalam negeri. Penguasaan terhadap materi <strong>{resource.title}</strong> merupakan kompetensi fundamental yang wajib dimiliki oleh setiap perwira peserta didik Sespimma Lemdiklat Polri guna menjawab ekspektasi publik yang semakin tinggi terhadap profesionalisme dan akuntabilitas penegakan hukum.
                    </p>

                    <div className="hanjar-callout">
                      <strong>POIN KUNCI GADIK PENGAMPU:</strong>
                      <p style={{ margin: '4px 0 0' }}>
                        &ldquo;Kepemimpinan taktis di tingkat kesatuan operasional dasar tidak hanya berorientasi pada hasil penindakan, melainkan harus bertumpu pada transparansi, perlindungan hak asasi manusia, dan ketaatan pada prosedur hukum acara yang baku.&rdquo;
                      </p>
                    </div>

                    <h4 style={{ color: 'var(--color-navy)', fontSize: '14px', margin: '18px 0 8px' }}>
                      1.2. Kerangka Penerapan Taktis di Tingkat Kewilayahan
                    </h4>
                    <p style={{ margin: 0 }}>
                      Dalam konteks satuan operasional (Polres/Polsek), perwira pertama dan menengah memegang peranan kunci sebagai manajer lapangan. Modul ini membekali serdik dengan instrumen deteksi dini kerawanan kamtibmas, mekanisme pelibatan tiga pilar kemitraan kamtibmas, serta pengendalian operasi taktis berdaya cegah tinggi.
                    </p>
                  </div>
                )}

                {activeReaderTab === 'tugas' && (
                  <div>
                    <h4 style={{ fontSize: '14px', color: 'var(--color-navy)', marginTop: 0, marginBottom: '8px' }}>
                      Lembar Penugasan Mandiri & Sindikat Peserta Didik
                    </h4>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '12.5px', marginBottom: '16px' }}>
                      Instruksi pengerjaan studi kasus dan telaahan staf sebagai syarat evaluasi akademik kurikulum Dikbangum Sespimma.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ padding: '14px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-hover)' }}>
                        <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-navy)', marginBottom: '4px' }}>
                          Tugas 1: Telaahan Staf Masalah Faktual (Mandiri)
                        </div>
                        <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                          Susun naskah telaahan staf 3-5 halaman terkait implikasi materi <em>{resource.title}</em> terhadap penanganan kerawanan di kesatuan asal pengirim. Batas pengumpulan: Minggu ke-2 pembelajaran modul.
                        </div>
                      </div>

                      <div style={{ padding: '14px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-hover)' }}>
                        <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-navy)', marginBottom: '4px' }}>
                          Tugas 2: Simulasi Gladi Posko & Diskusi Sindikat (Kelompok)
                        </div>
                        <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                          Pecahkan skenario kontinjensi kamtibmas bersama sindikat masing-masing, buat matriks pembagian peran pimpinan staf, dan presentasikan rencana operasi taktis di hadapan dewan Gadik pengampu.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
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
            ID Entri: <code>{resource.id}</code> {resource.fileUrl ? '(Berkas Resmi Sespimma 2025)' : '(Data Simulasi)'}
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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

            {resource.fileUrl ? (
              <>
                <a
                  href={resource.fileUrl}
                  download
                  className="btn-secondary"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-main)',
                    borderColor: 'var(--color-border)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Unduh Dokumen PDF</span>
                </a>

                <a
                  href={resource.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span>Buka PDF di Tab Baru</span>
                </a>
              </>
            ) : resource.hasDigitalFile ? (
              <>
                <button
                  type="button"
                  onClick={() => handleMockAction('Salin Ringkasan Ajar ke Clipboard')}
                  className="btn-secondary"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-main)',
                    borderColor: 'var(--color-border)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Salin Ringkasan Ajar</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleMockAction('Cetak / Ekspor Pratinjau Dokumen Naskah Ajar')}
                  className="btn-primary"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                  <span>Cetak / Ekspor Pratinjau</span>
                </button>
              </>
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
