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
  const [prevResourceId, setPrevResourceId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<'reader' | 'info'>('reader');
  const [activeSection, setActiveSection] = useState<'kop' | 'skl' | 'bab1' | 'bab2' | 'bab3' | 'bab4' | 'tugas'>('bab1');
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  if (resource && resource.id !== prevResourceId) {
    setPrevResourceId(resource.id);
    const hasDigitalFile = Boolean(resource.fileUrl) || resource.hasDigitalFile || resource.category === 'Modul & Hanjar';
    setModalMode(hasDigitalFile ? 'reader' : 'info');
    setActiveSection('bab1');
  }

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

  const hasDigital = Boolean(resource.fileUrl) || resource.hasDigitalFile || resource.category === 'Modul & Hanjar';

  return (
    <div
      className="modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(11, 18, 32, 0.75)',
        backdropFilter: 'blur(5px)',
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
          maxWidth: modalMode === 'reader' && hasDigital ? '1140px' : '720px',
          maxHeight: '94vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'max-width 0.25s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '18px 24px',
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
              {resource.fileUrl && (
                <span className="badge-sespimma-pdf">
                  PDF Sespimma 2025
                </span>
              )}
            </div>

            <h2
              id="modal-resource-title"
              style={{
                fontSize: '18px',
                fontWeight: 800,
                color: 'var(--color-navy)',
                lineHeight: 1.35,
                margin: 0,
              }}
            >
              {resource.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jendela"
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* View Switcher: Baca Dokumen vs Rincian Metadata */}
        {hasDigital && (
          <div className="modal-view-switcher">
            <button
              type="button"
              className={`modal-view-tab-btn ${modalMode === 'reader' ? 'active' : ''}`}
              onClick={() => setModalMode('reader')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <span>Pratinjau Membaca Dokumen</span>
            </button>

            <button
              type="button"
              className={`modal-view-tab-btn ${modalMode === 'info' ? 'active' : ''}`}
              onClick={() => setModalMode('info')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>Rincian Metadata & Status</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

          {/* MODE 1: PRATINJAU MEMBACA DOKUMEN (FULL DOCUMENT READER) */}
          {modalMode === 'reader' && hasDigital ? (
            <div>
              {/* If authentic PDF exists, render PDF iframe */}
              {resource.fileUrl ? (
                <div
                  style={{
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-surface)',
                  }}
                >
                  <div
                    style={{
                      padding: '10px 16px',
                      backgroundColor: 'var(--color-surface-hover)',
                      borderBottom: '1px solid var(--color-border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-navy)' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" color="#dc2626">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <span>Pratinjau Pembaca Dokumen PDF Resmi Sespimma Lemdiklat Polri</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: 'var(--color-primary)',
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontWeight: 700,
                          display: 'inline-flex',
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
                  </div>

                  <iframe
                    src={resource.fileUrl}
                    title={resource.title}
                    style={{
                      width: '100%',
                      height: '68vh',
                      minHeight: '480px',
                      border: 'none',
                      display: 'block',
                      backgroundColor: '#525659',
                    }}
                  />
                </div>
              ) : (
                /* Split Layout Simulated Digital Reader for other Hanjar / digital documents */
                <div className="hanjar-reader-container">
                  <div className="hanjar-reader-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" color="#60a5fa" aria-hidden="true">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      </svg>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 800, letterSpacing: '0.3px' }}>
                          Pratinjau Naskah Digital Sespimma (Digital Manuscript Reader)
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.75)' }}>
                          KODIFIKASI: HNJ-SESPIMMA-2026/{resource.id.toUpperCase()} • POKJA KURIKULUM JARLAT
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')}
                        style={{
                          padding: '4px 10px',
                          fontSize: '11px',
                          fontWeight: 600,
                          borderRadius: '4px',
                          border: '1px solid rgba(255, 255, 255, 0.25)',
                          backgroundColor: 'rgba(255, 255, 255, 0.12)',
                          color: '#ffffff',
                          cursor: 'pointer',
                        }}
                        title="Perbesar / perkecil ukuran teks bacaan"
                      >
                        Ukuran Teks: {fontSize === 'normal' ? 'A (Standar)' : 'A+ (Besar)'}
                      </button>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(37, 99, 235, 0.35)',
                          color: '#93c5fd',
                          border: '1px solid rgba(37, 99, 235, 0.5)',
                        }}
                      >
                        {resource.fileFormat || 'PDF'} • {resource.fileSize || 'Digital'}
                      </span>
                    </div>
                  </div>

                  {/* 2-Column Split Reader: Left TOC, Right Reading Pane */}
                  <div className="reader-split-layout">
                    {/* Left Sidebar: Table of Contents */}
                    <div className="reader-sidebar">
                      <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px', letterSpacing: '0.5px' }}>
                        Daftar Isi & Struktur
                      </div>

                      <button
                        type="button"
                        className={`reader-toc-btn ${activeSection === 'kop' ? 'active' : ''}`}
                        onClick={() => setActiveSection('kop')}
                      >
                        <span>🏛️</span>
                        <span>Lembar Kop & Pengesahan</span>
                      </button>

                      <button
                        type="button"
                        className={`reader-toc-btn ${activeSection === 'skl' ? 'active' : ''}`}
                        onClick={() => setActiveSection('skl')}
                      >
                        <span>🎯</span>
                        <span>Standar Capaian (SKL)</span>
                      </button>

                      <button
                        type="button"
                        className={`reader-toc-btn ${activeSection === 'bab1' ? 'active' : ''}`}
                        onClick={() => setActiveSection('bab1')}
                      >
                        <span>📖</span>
                        <span>Bab I: Urgensi & Ketentuan Umum</span>
                      </button>

                      <button
                        type="button"
                        className={`reader-toc-btn ${activeSection === 'bab2' ? 'active' : ''}`}
                        onClick={() => setActiveSection('bab2')}
                      >
                        <span>⚖️</span>
                        <span>Bab II: Doktrin & Kerangka Yuridis</span>
                      </button>

                      <button
                        type="button"
                        className={`reader-toc-btn ${activeSection === 'bab3' ? 'active' : ''}`}
                        onClick={() => setActiveSection('bab3')}
                      >
                        <span>🛡️</span>
                        <span>Bab III: Taktis & Studi Kasus</span>
                      </button>

                      <button
                        type="button"
                        className={`reader-toc-btn ${activeSection === 'bab4' ? 'active' : ''}`}
                        onClick={() => setActiveSection('bab4')}
                      >
                        <span>📊</span>
                        <span>Bab IV: Evaluasi Pembelajaran</span>
                      </button>

                      <button
                        type="button"
                        className={`reader-toc-btn ${activeSection === 'tugas' ? 'active' : ''}`}
                        onClick={() => setActiveSection('tugas')}
                      >
                        <span>📝</span>
                        <span>Lembar Penugasan Serdik</span>
                      </button>
                    </div>

                    {/* Right Reading Body */}
                    <div className="reader-content-body" style={{ fontSize: fontSize === 'large' ? '15px' : '13.5px' }}>
                      {/* Kop Surat Header */}
                      {activeSection === 'kop' && (
                        <div>
                          <div style={{ textAlign: 'center', paddingBottom: '18px', borderBottom: '2px solid var(--color-border)', marginBottom: '18px' }}>
                            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px', color: 'var(--color-text-muted)' }}>
                              KEPOLISIAN NEGARA REPUBLIK INDONESIA
                            </div>
                            <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--color-navy)' }}>
                              LEMBAGA PENDIDIKAN DAN PELATIHAN
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-primary)' }}>
                              SEKOLAH STAF DAN PIMPINAN PERTAMA
                            </div>
                            <div style={{ margin: '8px auto', height: '2px', width: '80px', backgroundColor: 'var(--color-primary)' }} />
                            <h3 style={{ margin: '10px 0 6px', fontSize: '17px', color: 'var(--color-navy)' }}>
                              NASKAH BAHAN AJAR (HANJAR): {resource.title}
                            </h3>
                            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                              Tahun Anggaran 2025/2026 • Sindikat Pembelajaran Dikbangum Sespimma
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '18px' }}>
                            <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border-subtle)' }}>
                              <strong style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>Penyusun / Pengampu:</strong>
                              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-navy)' }}>{resource.authorOrInstructor}</span>
                            </div>
                            <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border-subtle)' }}>
                              <strong style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>Unit Penanggung Jawab:</strong>
                              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-navy)' }}>{resource.unitOrSource}</span>
                            </div>
                          </div>

                          <p>
                            Naskah ajar ini telah melalui proses verifikasi dan validasi oleh Kelompok Kerja Pengajaran dan Latihan (Pokja Jarlat) Sespimma Lemdiklat Polri serta memenuhi kriteria Kerangka Kualifikasi Nasional Indonesia (KKNI) untuk Pendidikan Pengembangan Umum Perwira Pertama dan Menengah.
                          </p>
                        </div>
                      )}

                      {/* SKL & Capaian Pembelajaran */}
                      {activeSection === 'skl' && (
                        <div>
                          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.5px' }}>
                            STANDAR MUTU PENDIDIKAN SESPIMMA
                          </span>
                          <h3 style={{ fontSize: '16px', color: 'var(--color-navy)', margin: '4px 0 12px' }}>
                            Capaian Pembelajaran Lulusan (CPL) & Kompetensi Materi
                          </h3>

                          <div className="hanjar-callout">
                            <strong>TUJUAN INSTRUKSIONAL UMUM (TIU):</strong>
                            <p style={{ margin: '4px 0 0' }}>
                              Peserta didik mampu memahami doktrin, merumuskan strategi manajerial, dan memimpin tindakan kepolisian secara taktis berlandaskan prinsip Presisi pada materi <em>{resource.title}</em>.
                            </p>
                          </div>

                          <h4 style={{ fontSize: '13.5px', color: 'var(--color-navy)', marginTop: '16px', marginBottom: '8px' }}>
                            Tujuan Instruksional Khusus (TIK):
                          </h4>
                          <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <li>Menjelaskan kerangka regulasi dan diskresi kepolisian sesuai norma hukum berlaku.</li>
                            <li>Mengidentifikasi indikator potensi kerawanan kamtibmas pada tingkat kesatuan kewilayahan.</li>
                            <li>Mengaplikasikan teknik pemecahan masalah (Problem-Solving) dan koordinasi lintas pemangku kepentingan.</li>
                            <li>Menyusun naskah telaah staf komprehensif sebagai produk intelijen dan manajerial.</li>
                          </ul>
                        </div>
                      )}

                      {/* Bab I */}
                      {activeSection === 'bab1' && (
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                            BAGIAN PERTAMA
                          </div>
                          <h3 style={{ fontSize: '16px', color: 'var(--color-navy)', margin: '4px 0 14px' }}>
                            BAB I — Ketentuan Umum & Urgensi Pembelajaran
                          </h3>

                          <h4 style={{ fontSize: '13.5px', color: 'var(--color-navy)', marginBottom: '8px' }}>
                            1.1. Latar Belakang Doktriner
                          </h4>
                          <p style={{ marginBottom: '14px' }}>
                            Perkembangan lingkungan strategis baik pada tingkat nasional, regional, maupun global menuntut kesiapsiagaan penuh dari seluruh jajaran kepolisian. Penguasaan terhadap materi <strong>{resource.title}</strong> merupakan bekal esensial bagi para perwira pertama dalam menjalankan peran ganda sebagai komandan operasional lapangan sekaligus manajer staf kesatuan.
                          </p>

                          <div className="hanjar-callout">
                            <strong>CATATAN POKJA JARLAT SESPIMMA:</strong>
                            <p style={{ margin: '4px 0 0' }}>
                              &ldquo;Kepemimpinan operasional harus berorientasi pada pencegahan preventif, kepatuhan prosedur hukum acara, dan pemeliharaan legitimasi publik terhadap institusi Polri.&rdquo;
                            </p>
                          </div>

                          <h4 style={{ fontSize: '13.5px', color: 'var(--color-navy)', margin: '16px 0 8px' }}>
                            1.2. Ruang Lingkup dan Batasan Pembahasan
                          </h4>
                          <p style={{ margin: 0 }}>
                            Materi hanjar ini mencakup aspek filosofis, regulasi yuridis formal, prosedur taktis penanganan gangguan di tingkat Polres/Polsek, serta evaluasi berbasis studi kasus nyata yang dihimpun dari pengalaman operasional satuan kewilayahan.
                          </p>
                        </div>
                      )}

                      {/* Bab II */}
                      {activeSection === 'bab2' && (
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                            BAGIAN KEDUA
                          </div>
                          <h3 style={{ fontSize: '16px', color: 'var(--color-navy)', margin: '4px 0 14px' }}>
                            BAB II — Kerangka Konseptual & Landasan Yuridis
                          </h3>

                          <h4 style={{ fontSize: '13.5px', color: 'var(--color-navy)', marginBottom: '8px' }}>
                            2.1. Landasan Hukum Normatif
                          </h4>
                          <ul style={{ paddingLeft: '20px', margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <li>Undang-Undang Nomor 2 Tahun 2002 tentang Kepolisian Negara Republik Indonesia.</li>
                            <li>Peraturan Kepala Kepolisian Negara Republik Indonesia (Perkap) terkait tata kelola fungsi operasional.</li>
                            <li>Standar Instrumen Hak Asasi Manusia Internasional (ICCPR, CAT, dan UN Basic Principles on the Use of Force).</li>
                          </ul>

                          <h4 style={{ fontSize: '13.5px', color: 'var(--color-navy)', marginBottom: '8px' }}>
                            2.2. Diskresi Kepolisian dan Akuntabilitas
                          </h4>
                          <p style={{ margin: 0 }}>
                            Penggunaan diskresi kepolisian oleh perwira diatur secara ketat berdasarkan asas legalitas, nesesitas, dan proporsionalitas. Setiap keputusan yang diambil harus dapat dipertanggungjawabkan secara hukum, etika profesi, serta moralitas Tribrata.
                          </p>
                        </div>
                      )}

                      {/* Bab III */}
                      {activeSection === 'bab3' && (
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                            BAGIAN KETIGA
                          </div>
                          <h3 style={{ fontSize: '16px', color: 'var(--color-navy)', margin: '4px 0 14px' }}>
                            BAB III — Taktik Operasional & Studi Kasus Lapangan
                          </h3>

                          <h4 style={{ fontSize: '13.5px', color: 'var(--color-navy)', marginBottom: '8px' }}>
                            3.1. Standard Operating Procedure (SOP) Penanganan Lapangan
                          </h4>
                          <p style={{ marginBottom: '14px' }}>
                            Pelaksanaan tindakan taktis diawali dengan pengumpulan bahan keterangan (Pulbaket), analisis ancaman situasi, penentuan tingkatan eskalasi (hijau, kuning, merah), dan komando kendali terpusat (Kodal).
                          </p>

                          <div className="hanjar-chapter-card">
                            <strong style={{ color: 'var(--color-navy)', fontSize: '13px' }}>Simulasi Kasus Kontinjensi Kewilayahan:</strong>
                            <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
                              Dalam skenario eskalasi massa di area objek vital, perwira staf bertugas memetakan rute penyekatan, menyiapkan jalur evakuasi VIP, menginstruksikan pleton pengendalian massa tanpa senjata api, dan mengaktifkan tim negosiator krisis.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Bab IV */}
                      {activeSection === 'bab4' && (
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                            BAGIAN KEEMPAT
                          </div>
                          <h3 style={{ fontSize: '16px', color: 'var(--color-navy)', margin: '4px 0 14px' }}>
                            BAB IV — Evaluasi Pembelajaran & Standar Kelulusan
                          </h3>

                          <h4 style={{ fontSize: '13.5px', color: 'var(--color-navy)', marginBottom: '8px' }}>
                            4.1. Bobot Penilaian Akademik Peserta Didik
                          </h4>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '16px' }}>
                            <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border-subtle)', textAlign: 'center' }}>
                              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary)' }}>40%</div>
                              <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>Ujian Naskah & Telaah Staf</div>
                            </div>
                            <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border-subtle)', textAlign: 'center' }}>
                              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary)' }}>30%</div>
                              <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>Simulasi Gladi Posko Sindikat</div>
                            </div>
                            <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border-subtle)', textAlign: 'center' }}>
                              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary)' }}>30%</div>
                              <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>Etika & Kepemimpinan Lapangan</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Lembar Tugas */}
                      {activeSection === 'tugas' && (
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                            INSTRUMEN EVALUASI SERDIK
                          </div>
                          <h3 style={{ fontSize: '16px', color: 'var(--color-navy)', margin: '4px 0 14px' }}>
                            Lembar Penugasan Mandiri & Sindikat Sespimma
                          </h3>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ padding: '14px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-hover)' }}>
                              <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-navy)', marginBottom: '4px' }}>
                                Tugas 1: Telaahan Staf Masalah Faktual (Mandiri)
                              </div>
                              <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                                Susun naskah telaahan staf 3-5 halaman terkait implementasi doktrin <em>{resource.title}</em> dalam menangani kerawanan kamtibmas di wilayah kesatuan asal serdik. Format penulisan mengacu pada Juknis Naskah Dinas Polri.
                              </div>
                            </div>

                            <div style={{ padding: '14px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-hover)' }}>
                              <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-navy)', marginBottom: '4px' }}>
                                Tugas 2: Latihan Gladi Posko Taktis (Sindikat)
                              </div>
                              <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                                Bersama kelompok sindikat, simulasikan peran Kapolres, Kabag Ops, dan para Kasat dalam mengatasi dinamika krisis. Rencana operasi taktis dipresentasikan di hadapan tim penguji Gadik.
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* MODE 2: INFORMASI & METADATA OVERVIEW */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Description */}
              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                  Deskripsi / Ringkasan Materi
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--color-text-main)', lineHeight: 1.6, margin: 0 }}>
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
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Penyusun / Pengampu
                  </span>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-text-main)', marginTop: '2px' }}>
                    {resource.authorOrInstructor}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Unit Pengelola / Sumber
                  </span>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-text-main)', marginTop: '2px' }}>
                    {resource.unitOrSource}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Tanggal Pembaruan
                  </span>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-text-main)', marginTop: '2px' }}>
                    {resource.updatedAt}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Klasifikasi Akses Dokumen
                  </span>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-text-main)', marginTop: '2px' }}>
                    {resource.access} (Sesuai Manual Tata Kelola)
                  </div>
                </div>
              </div>

              {/* Digital File or Physical Location */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: resource.hasDigitalFile || resource.fileUrl ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  {resource.hasDigitalFile || resource.fileUrl ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" color="var(--color-success)">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      <strong style={{ fontSize: '13.5px', color: 'var(--color-success)' }}>
                        Berkas Digital Siap Diakses ({resource.fileFormat || 'PDF'} • {resource.fileSize || 'Digital'})
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

              {/* Tags */}
              {resource.tags && resource.tags.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                    Kata Kunci / Tag Penelusuran
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {resource.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        style={{
                          backgroundColor: 'var(--color-surface-hover)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-muted)',
                          fontSize: '11.5px',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
            ID Entri: <code>{resource.id}</code> {resource.fileUrl ? '(Berkas Resmi Sespimma 2025)' : '(Data Simulasi Jarlat)'}
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
            ) : hasDigital ? (
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
