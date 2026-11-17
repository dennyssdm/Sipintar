'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { UserRole } from '@/types';
import { sipintarApi } from '@/lib/apiClient';

interface RoleRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessRole: (role: UserRole, user?: any) => void;
  initialRole?: UserRole;
  onOpenLogin?: () => void;
}

export const RoleRegistrationModal: React.FC<RoleRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccessRole,
  initialRole = 'Serdik',
  onOpenLogin,
}) => {
  type RegistrableRole = 'Serdik' | 'Gadik' | 'Pengelola Perpustakaan';

  const [role, setRole] = useState<RegistrableRole>(
    initialRole === 'Administrator' ? 'Serdik' : (initialRole as RegistrableRole)
  );

  // Common Fields
  const [nama, setNama] = useState('');
  const [pangkat, setPangkat] = useState('KOMPOL');
  const [nrp, setNrp] = useState('');
  const [satuan, setSatuan] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [persetujuan, setPersetujuan] = useState(false);

  // Serdik Specific
  const [nosis, setNosis] = useState('');
  const [angkatan, setAngkatan] = useState('Sespimma Angkatan 73 TA 2026');
  const [rencanaTaskap, setRencanaTaskap] = useState('');

  // Gadik Specific
  const [jabatanFungsional, setJabatanFungsional] = useState('Gadik Madya Sespimma');
  const [kepakaran, setKepakaran] = useState('Kepemimpinan & Manajemen Operasional Polri');
  const [noSprint, setNoSprint] = useState('');

  // Pengelola Pustaka Specific
  const [unitKerja, setUnitKerja] = useState('Subbag Renmin / Unit Perpustakaan Sespimma');
  const [lingkupAkses, setLingkupAkses] = useState<string[]>([
    'Katalogisasi Buku Fisik',
    'Unggah E-Book & Naskah Digital',
  ]);

  // Submission State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [regId, setRegId] = useState('');
  const [registeredUser, setRegisteredUser] = useState<any>(null);

  const handleClose = useCallback(() => {
    setIsSubmitted(false);
    setErrorMsg(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!nrp.trim() || !nama.trim() || !email.trim() || !password) {
      setErrorMsg('NRP/NIP, Nama Lengkap, Email Pribadi, dan Kata Sandi wajib diisi.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Kata sandi minimal harus 6 karakter.');
      return;
    }

    const roleCodeMap: Record<RegistrableRole, string> = {
      'Serdik': 'serdik',
      'Gadik': 'gadik',
      'Pengelola Perpustakaan': 'pengelola',
    };

    try {
      setIsLoading(true);
      const res = await sipintarApi.auth.register({
        nama_lengkap: nama.trim(),
        email: email.trim(),
        password: password,
        role_code: roleCodeMap[role],
        nrp_nip: nrp.trim(),
        pangkat: pangkat,
        satuan_asal: satuan.trim(),
        // Serdik fields
        nosis: nosis.trim() || `2026${nrp.trim().slice(-4)}`,
        angkatan: angkatan.trim() || 'Sespimma Angkatan 73 TA 2026',
        rencana_judul_taskap: rencanaTaskap.trim(),
        // Gadik fields
        jabatan: jabatanFungsional,
        kategori_jabatan: kepakaran,
        no_sprint: noSprint.trim(),
        // Pengelola fields
        unit_kerja: unitKerja.trim(),
        lingkup_akses: lingkupAkses,
      } as any);

      if (res?.user) {
        setRegisteredUser(res.user);
        const generatedId = `REG-SESPIMMA-2026-${res.user.id || Math.floor(1000 + Math.random() * 9000)}`;
        setRegId(generatedId);
        setIsSubmitted(true);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Pendaftaran gagal diajukan. Silakan periksa kembali data Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivateRole = () => {
    if (registeredUser) {
      localStorage.setItem('sipintar_auth_user', JSON.stringify(registeredUser));
    }
    onSuccessRole(role as UserRole, registeredUser);
    handleClose();
  };

  const handleToggleLingkup = (item: string) => {
    setLingkupAkses((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(7, 23, 49, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reg-modal-title"
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '720px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <header
          style={{
            background: 'linear-gradient(135deg, #091a38 0%, #153e75 50%, #1d4ed8 100%)',
            color: '#ffffff',
            padding: '20px 24px',
            borderTop: '4px solid #f59e0b',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
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
                  display: 'inline-block',
                  marginBottom: '6px',
                }}
              >
                Pusat Pendaftaran Anggota Baru
              </span>
              <h2 id="reg-modal-title" style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>
                Daftar Akun & Peran SIPINTAR Sespimma
              </h2>
              <p style={{ fontSize: '13px', color: '#cbd5e1', margin: '4px 0 0' }}>
                Formulir resmi registrasi Serdik, Tenaga Pendidik (Gadik), atau Pengelola Perpustakaan
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                borderRadius: 'var(--radius-sm)',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                cursor: 'pointer',
              }}
              aria-label="Tutup formulir pendaftaran"
            >
              ✕
            </button>
          </div>
        </header>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {isSubmitted ? (
            /* SUCCESS FEEDBACK STATE */
            <div style={{ textAlign: 'center', padding: '16px 8px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '2px solid #10b981',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: '#059669',
                  backgroundColor: '#ecfdf5',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid #a7f3d0',
                }}
              >
                Nomor Registrasi: {regId}
              </span>

              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-navy)', margin: '14px 0 8px' }}>
                Pendaftaran Sebagai {role} Berhasil!
              </h3>

              <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', lineHeight: 1.6, maxWidth: '520px', margin: '0 auto 20px' }}>
                Akun untuk <strong>{nama}</strong> ({pangkat} / NRP: {nrp}) dengan email pribadi <strong>{email}</strong> telah berhasil disimpan dalam database SIPINTAR Sespimma Lemdiklat Polri.
              </p>

              <div
                style={{
                  backgroundColor: 'var(--color-primary-light)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 18px',
                  textAlign: 'left',
                  fontSize: '12.5px',
                  lineHeight: 1.5,
                  marginBottom: '24px',
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '4px' }}>
                  ✅ Akun Siap Digunakan:
                </div>
                <div>
                  Anda dapat langsung masuk ke sistem sekarang menggunakan NRP <strong>{nrp}</strong> atau email <strong>{email}</strong> beserta kata sandi yang telah Anda tentukan.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleActivateRole}
                  className="btn btn-primary"
                  style={{
                    padding: '10px 24px',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <polyline points="17 11 19 13 23 9" />
                  </svg>
                  <span>Masuk ke Sesi {role} Sekarang</span>
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="btn btn-secondary"
                  style={{ padding: '10px 20px', fontSize: '13px' }}
                >
                  Kembali ke Beranda
                </button>
              </div>
            </div>
          ) : (
            /* FORM STATE */
            <form onSubmit={handleSubmit}>
              {/* Error Message Box */}
              {errorMsg && (
                <div
                  style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '13px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>⚠️</span>
                  <span>{errorMsg}</span>
                </div>
              )}
              {/* Step 1: Pilih Peran yang Ingin Didaftarkan */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-navy)', display: 'block', marginBottom: '8px' }}>
                  1. Pilih Peran Keanggotaan yang Ingin Didaftarkan:
                </label>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '10px',
                  }}
                >
                  {/* Option 1: Serdik */}
                  <div
                    onClick={() => setRole('Serdik')}
                    style={{
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${role === 'Serdik' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      backgroundColor: role === 'Serdik' ? 'var(--color-primary-light)' : 'var(--color-surface)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '18px' }}>🎓</span>
                      <strong style={{ fontSize: '13.5px', color: 'var(--color-navy)' }}>Serdik</strong>
                    </div>
                    <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>
                      Peserta Didik Sespimma untuk akses materi pembelajaran, hanjar, & pustaka.
                    </p>
                  </div>

                  {/* Option 2: Gadik */}
                  <div
                    onClick={() => setRole('Gadik')}
                    style={{
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${role === 'Gadik' ? '#d97706' : 'var(--color-border)'}`,
                      backgroundColor: role === 'Gadik' ? '#fef3c7' : 'var(--color-surface)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '18px' }}>👨‍🏫</span>
                      <strong style={{ fontSize: '13.5px', color: '#92400e' }}>Gadik / Pendidik</strong>
                    </div>
                    <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>
                      Tenaga Pendidik & Widyaiswara pengampu kurikulum & evaluasi akademik.
                    </p>
                  </div>

                  {/* Option 3: Pengelola Perpustakaan */}
                  <div
                    onClick={() => setRole('Pengelola Perpustakaan')}
                    style={{
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${role === 'Pengelola Perpustakaan' ? '#059669' : 'var(--color-border)'}`,
                      backgroundColor: role === 'Pengelola Perpustakaan' ? '#ecfdf5' : 'var(--color-surface)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '18px' }}>📚</span>
                      <strong style={{ fontSize: '13.5px', color: '#065f46' }}>Pengelola Pustaka</strong>
                    </div>
                    <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>
                      Staf sirkulasi, inventarisasi buku fisik, e-book, dan digitalisasi Taskap.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2: Data Identitas Kedinasan */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-navy)', display: 'block', marginBottom: '8px' }}>
                  2. Identitas Personel & Kedinasan Polri:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                      Nama Lengkap & Gelar Akademik <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Kompol Arya Wicaksana, S.I.K., M.Si."
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        fontSize: '13px',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                      Pangkat <span style={{ color: 'red' }}>*</span>
                    </label>
                    <select
                      value={pangkat}
                      onChange={(e) => setPangkat(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        fontSize: '13px',
                        backgroundColor: 'var(--color-surface)',
                      }}
                    >
                      <option value="KOMBES POL">Kombes Pol</option>
                      <option value="AKBP">AKBP</option>
                      <option value="KOMPOL">Kompol</option>
                      <option value="AKP">AKP</option>
                      <option value="IPTU">Iptu</option>
                      <option value="PNS POLRI">PNS Polri</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                      NRP / NIP <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="8 digit NRP (misal: 82050054)"
                      value={nrp}
                      onChange={(e) => setNrp(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        fontSize: '13px',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                      Satuan Asal / Polda / Unit Kerja <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="misal: Polda Jawa Barat / Sespimma"
                      value={satuan}
                      onChange={(e) => setSatuan(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        fontSize: '13px',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                      Email Pribadi / Kontak (Aktif) <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="contoh: nama.pribadi@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        fontSize: '13px',
                      }}
                    />
                    <span style={{ fontSize: '11px', color: '#059669', display: 'block', marginTop: '3px' }}>
                      ✓ Boleh menggunakan Gmail, Yahoo, dll. (tidak harus @polri.go.id)
                    </span>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                      Kata Sandi (Password Akun) <span style={{ color: 'red' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        placeholder="Minimal 6 karakter"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 48px 8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-border)',
                          fontSize: '13px',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-primary)',
                          cursor: 'pointer',
                          padding: '2px 4px',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                        tabIndex={-1}
                      >
                        {showPassword ? 'Sembunyi' : 'Lihat'}
                      </button>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block', marginTop: '3px' }}>
                      Gunakan sandi yang mudah Anda ingat (min 6 karakter)
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 3: Atribut Spesifik Berdasarkan Peran Terpilih */}
              <div
                style={{
                  marginBottom: '20px',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-surface-hover)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-navy)', display: 'block', marginBottom: '8px' }}>
                  3. Kelengkapan Berkas Khusus Peran {role}:
                </label>

                {role === 'Serdik' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                        Nomor Pokok Siswa (NOSIS) <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: 202602073"
                        value={nosis}
                        onChange={(e) => setNosis(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-border)',
                          fontSize: '13px',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                        Angkatan / Gelombang Dikreg Sespimma
                      </label>
                      <input
                        type="text"
                        value={angkatan}
                        onChange={(e) => setAngkatan(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-border)',
                          fontSize: '13px',
                        }}
                      />
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                        Fokus Kajian / Rencana Judul Taskap (Opsional)
                      </label>
                      <input
                        type="text"
                        placeholder="misal: Optimalisasi Kepemimpinan Transformasional Polri dalam Pelayanan Publik"
                        value={rencanaTaskap}
                        onChange={(e) => setRencanaTaskap(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-border)',
                          fontSize: '13px',
                        }}
                      />
                    </div>
                  </div>
                )}

                {role === 'Gadik' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                        Jabatan Fungsional Pendidik
                      </label>
                      <select
                        value={jabatanFungsional}
                        onChange={(e) => setJabatanFungsional(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-border)',
                          fontSize: '13px',
                          backgroundColor: 'var(--color-surface)',
                        }}
                      >
                        <option value="Widyaiswara Madya Tk. III">Widyaiswara Madya Tk. III</option>
                        <option value="Anjak Madya Bidang Jarlat">Anjak Madya Bidang Jarlat</option>
                        <option value="Gadik Madya Sespimma">Gadik Madya Sespimma</option>
                        <option value="Widyaiswara Muda Tk. I">Widyaiswara Muda Tk. I</option>
                        <option value="Widyaiswara Pratama Tk. I">Widyaiswara Pratama Tk. I</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                        Nomor Surat Perintah / Keputusan (Sprint)
                      </label>
                      <input
                        type="text"
                        placeholder="Sprin/xxx/X/DIK.2.1./2026"
                        value={noSprint}
                        onChange={(e) => setNoSprint(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-border)',
                          fontSize: '13px',
                        }}
                      />
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                        Bidang Kepakaran Utama Pengajaran
                      </label>
                      <input
                        type="text"
                        value={kepakaran}
                        onChange={(e) => setKepakaran(e.target.value)}
                        placeholder="misal: Manajemen Operasional Polri, Intelijen, Diskresi Kepolisian"
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-border)',
                          fontSize: '13px',
                        }}
                      />
                    </div>
                  </div>
                )}

                {role === 'Pengelola Perpustakaan' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                        Unit Penugasan di Lingkungan Sespimma
                      </label>
                      <input
                        type="text"
                        value={unitKerja}
                        onChange={(e) => setUnitKerja(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-border)',
                          fontSize: '13px',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
                        Wewenang Pengelolaan yang Diajukan:
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {[
                          'Katalogisasi Buku Fisik',
                          'Unggah E-Book & Naskah Digital',
                          'Arsip Digital Taskap Serdik',
                          'Sirkulasi & Peminjaman Anggota',
                        ].map((item) => (
                          <label
                            key={item}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={lingkupAkses.includes(item)}
                              onChange={() => handleToggleLingkup(item)}
                            />
                            <span>{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 4: Pernyataan Kebenaran */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    fontSize: '12px',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    required
                    checked={persetujuan}
                    onChange={(e) => setPersetujuan(e.target.checked)}
                    style={{ marginTop: '2px' }}
                  />
                  <span>
                    Saya menyatakan data yang diisikan adalah benar untuk keperluan registrasi keanggotaan sistem pembelajaran SIPINTAR Sespimma Lemdiklat Polri dan bersedia diverifikasi oleh Bag Jarlat / Subbag Renmin.
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  {onOpenLogin && (
                    <button
                      type="button"
                      onClick={() => {
                        handleClose();
                        onOpenLogin();
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-primary)',
                        fontSize: '12.5px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        textDecoration: 'underline',
                        padding: 0,
                      }}
                    >
                      Sudah punya akun? Masuk di sini
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="btn btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    disabled={!persetujuan || isLoading}
                    className="btn btn-primary"
                    style={{
                      padding: '8px 20px',
                      fontSize: '13px',
                      fontWeight: 700,
                      opacity: persetujuan && !isLoading ? 1 : 0.6,
                      cursor: persetujuan && !isLoading ? 'pointer' : 'not-allowed',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {isLoading ? (
                      <>
                        <span
                          style={{
                            width: '14px',
                            height: '14px',
                            border: '2px solid white',
                            borderTopColor: 'transparent',
                            borderRadius: '50%',
                            display: 'inline-block',
                            animation: 'spin 1s linear infinite',
                          }}
                        />
                        <span>Mendaftarkan...</span>
                      </>
                    ) : (
                      <span>Daftar Akun Sekarang</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
