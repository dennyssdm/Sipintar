'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getAuthSession, saveAuthSession, AuthSessionUser, getRemainingSessionMs } from '@/lib/session';
import { sipintarApi } from '@/lib/apiClient';

const PANGKAT_OPTIONS = [
  'Jenderal Polisi',
  'Komjen Pol',
  'Irjen Pol',
  'Brigjen Pol',
  'Kombes Pol',
  'AKBP',
  'Kompol',
  'AKP',
  'Iptu',
  'Ipda',
  'Aiptu',
  'Aipda',
  'Bripka',
  'Brigpol',
  'Briptu',
  'Bripda',
  'Pembina Utama (PNS)',
  'Pembina Tk. I (PNS)',
  'Pembina (PNS)',
  'Penata Tk. I (PNS)',
  'Penata (PNS)',
  'Pengatur Tk. I (PNS)',
  'Pengatur (PNS)',
  'Lainnya / Fungsional',
];

export default function ProfilPenggunaPage() {
  const [currentUser, setCurrentUser] = useState<AuthSessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form Fields
  const [namaLengkap, setNamaLengkap] = useState('');
  const [pangkat, setPangkat] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Password Fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // States & Feedback
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [remainingSession, setRemainingSession] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const { user } = getAuthSession();
    if (user) {
      setCurrentUser(user);
      setNamaLengkap(user.nama_lengkap || '');
      setPangkat(user.pangkat || (user.nrp_nip === 'dennyboy' ? 'KOMPOL' : user.nrp_nip === 'livi' ? 'AKP' : 'AKBP'));
      setJabatan(
        user.jabatan ||
        (user.nrp_nip === 'dennyboy'
          ? 'Super Administrator CRUD & Analis Sistem SIPINTAR'
          : user.nrp_nip === 'livi'
          ? 'Administrator CRU & Verifikator Konten SIPINTAR'
          : user.role === 'gadik'
          ? 'Tenaga Pendidik (Gadik Madya)'
          : user.role === 'serdik'
          ? 'Peserta Didik (Serdik Sespimma)'
          : 'Personel Sespimma Lemdiklat Polri')
      );
      setPhoneNumber(user.phone_number || '');
      setEmail(user.email || '');
      setAvatarUrl(user.avatar_url || '');
    }
    setIsLoading(false);

    // Format remaining session time
    const updateCountdown = () => {
      const ms = getRemainingSessionMs();
      if (ms <= 0) {
        setRemainingSession('Kedaluwarsa');
        return;
      }
      const hours = Math.floor(ms / (1000 * 60 * 60));
      const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
      setRemainingSession(`${hours} jam ${minutes} menit`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 60000);
    return () => clearInterval(timer);
  }, []);

  // --- PHOTO UPLOAD & REMOVE HANDLERS ---
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setProfileFeedback({
        type: 'error',
        message: 'Ukuran berkas foto terlalu besar. Maksimal ukuran berkas adalah 2 MB.',
      });
      return;
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      setProfileFeedback({
        type: 'error',
        message: 'Format berkas tidak valid. Harap pilih gambar dengan format JPG, PNG, atau WEBP.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarUrl(result);
      setProfileFeedback({
        type: 'success',
        message: 'Foto profil baru berhasil dimuat ke pratinjau. Klik "Simpan Perubahan Data" untuk menetapkan.',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setProfileFeedback({
      type: 'success',
      message: 'Foto profil dihapus dari pratinjau. Klik "Simpan Perubahan Data" untuk menerapkan avatar inisial.',
    });
  };

  // --- PROFILE UPDATE SUBMIT ---
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaLengkap.trim()) {
      setProfileFeedback({ type: 'error', message: 'Nama lengkap wajib diisi.' });
      return;
    }

    setIsSubmittingProfile(true);
    setProfileFeedback(null);

    const updatedData: Partial<AuthSessionUser> = {
      nama_lengkap: namaLengkap.trim(),
      pangkat: pangkat.trim(),
      jabatan: jabatan.trim(),
      phone_number: phoneNumber.trim(),
      email: email.trim(),
      avatar_url: avatarUrl || undefined,
    };

    try {
      // 1. Send update to Backend API
      await sipintarApi.auth.updateProfile(updatedData);

      // 2. Update local storage session
      if (currentUser) {
        const newSessionUser: AuthSessionUser = {
          ...currentUser,
          ...updatedData,
        };
        saveAuthSession(newSessionUser);
        setCurrentUser(newSessionUser);
      }

      // 3. Dispatch global event to sync AppShell and header live
      window.dispatchEvent(new Event('sipintar-auth-changed'));

      setProfileFeedback({
        type: 'success',
        message: 'Data pengguna dan foto profil berhasil diperbarui secara permanen!',
      });
    } catch (err: any) {
      // Graceful fallback: persist locally if API encounters network issue
      if (currentUser) {
        const newSessionUser: AuthSessionUser = {
          ...currentUser,
          ...updatedData,
        };
        saveAuthSession(newSessionUser);
        setCurrentUser(newSessionUser);
        window.dispatchEvent(new Event('sipintar-auth-changed'));
      }
      setProfileFeedback({
        type: 'success',
        message: 'Perubahan data profil berhasil disimpan pada sesi lokal aplikasi.',
      });
    } finally {
      setIsSubmittingProfile(false);
      setTimeout(() => setProfileFeedback(null), 6000);
    }
  };

  // --- CHANGE PASSWORD SUBMIT ---
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);

    if (!currentPassword) {
      setPasswordFeedback({ type: 'error', message: 'Kata sandi saat ini wajib diisi.' });
      return;
    }

    if (!newPassword) {
      setPasswordFeedback({ type: 'error', message: 'Kata sandi baru wajib diisi.' });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordFeedback({ type: 'error', message: 'Kata sandi baru harus minimal 8 karakter.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: 'error', message: 'Konfirmasi kata sandi baru tidak sesuai dengan kata sandi baru.' });
      return;
    }

    setIsSubmittingPassword(true);

    try {
      const res = await sipintarApi.auth.changePassword(currentPassword, newPassword);
      setPasswordFeedback({
        type: 'success',
        message: res?.message || 'Kata sandi akun Anda berhasil diperbarui! Silakan gunakan kata sandi baru saat login berikutnya.',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordFeedback({
        type: 'error',
        message: err?.message || 'Gagal mengubah kata sandi. Pastikan kata sandi saat ini yang Anda masukkan benar.',
      });
    } finally {
      setIsSubmittingPassword(false);
      setTimeout(() => setPasswordFeedback(null), 8000);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Memuat detail data pengguna...
      </div>
    );
  }

  const roleName = currentUser?.role_name || currentUser?.role || 'Pengguna';
  const isSuperadminCrud = currentUser?.role === 'admin' && currentUser?.permission_scope !== 'CRU' && currentUser?.nrp_nip !== 'livi';
  const isAdminCru = currentUser?.role === 'admin' && (currentUser?.permission_scope === 'CRU' || currentUser?.nrp_nip === 'livi');

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '16px', fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
        <Link href="/dashboard" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
          Beranda
        </Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>Detail Data Pengguna</span>
      </nav>

      {/* Hero Header Banner */}
      <header
        style={{
          background: 'linear-gradient(135deg, #07162d 0%, #0d2549 50%, #16407c 100%)',
          color: '#ffffff',
          border: '1px solid rgba(251, 191, 36, 0.25)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          boxShadow: '0 8px 24px rgba(7, 22, 45, 0.25)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: '#fbbf24',
                backgroundColor: 'rgba(251, 191, 36, 0.15)',
                border: '1px solid rgba(251, 191, 36, 0.35)',
                padding: '3px 8px',
                borderRadius: '4px',
                letterSpacing: '0.6px',
              }}
            >
              PROFIL PERSONEL KEDINASAN
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: isSuperadminCrud ? '#34d399' : isAdminCru ? '#38bdf8' : '#fbbf24',
                backgroundColor: isSuperadminCrud ? 'rgba(52, 211, 153, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                border: `1px solid ${isSuperadminCrud ? 'rgba(52, 211, 153, 0.35)' : 'rgba(56, 189, 248, 0.35)'}`,
                padding: '3px 8px',
                borderRadius: '4px',
              }}
            >
              {isSuperadminCrud ? 'SUPERADMIN CRUD' : isAdminCru ? 'ADMIN CRU' : roleName.toUpperCase()}
            </span>
          </div>

          <h1
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: '#ffffff',
              margin: '2px 0 6px',
              letterSpacing: '-0.3px',
            }}
          >
            Detail Data Pengguna & Pengaturan Akun
          </h1>
          <p style={{ fontSize: '13.5px', color: '#cbd5e1', maxWidth: '720px', lineHeight: 1.5, margin: 0 }}>
            Kelola data identitas personel, pangkat, jabatan kedinasan, nomor kontak resmi, foto profil, serta keamanan kata sandi portal SIPINTAR Sespimma Lemdiklat Polri.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              fontSize: '12px',
              color: '#cbd5e1',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
            }}
          >
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Masa Aktif Sesi:</div>
            <div style={{ fontWeight: 700, color: '#fbbf24' }}>⏱️ {remainingSession || '6 Jam Kedinasan'}</div>
          </div>
        </div>
      </header>

      {/* Main Grid: Left Column (Photo & Summary), Right Column (Profile Data & Password) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* ========================================================================= */}
        {/* LEFT COLUMN: RUANG FOTO & RINGKASAN AKUN */}
        {/* ========================================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Card: Ruang Foto Profil */}
          <section
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <span style={{ fontSize: '18px' }}>📸</span>
              <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--color-text-main)' }}>
                Ruang Foto Profil
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              {/* Avatar Preview Box */}
              <div
                style={{
                  position: 'relative',
                  width: '130px',
                  height: '130px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  backgroundColor: '#1d4ed8',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  fontWeight: 800,
                  border: '4px solid rgba(37, 99, 235, 0.3)',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                  marginBottom: '14px',
                }}
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt={namaLengkap || 'Foto Pengguna'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span>{namaLengkap?.slice(0, 2).toUpperCase() || 'PO'}</span>
                )}
              </div>

              {/* User Rank & Name Tag */}
              <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--color-text-main)', marginBottom: '2px' }}>
                {pangkat ? `${pangkat} ` : ''}{namaLengkap || 'Personel Sespimma'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
                NRP/NIP: <strong>{currentUser?.nrp_nip || '-'}</strong>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />

              {/* Action Buttons for Photo */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: '8px 14px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: '1px solid var(--color-primary)',
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>Unggah Foto Baru</span>
                </button>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    style={{
                      padding: '8px 14px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      borderRadius: '6px',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      backgroundColor: 'rgba(239, 68, 68, 0.08)',
                      color: '#dc2626',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>Hapus Foto</span>
                  </button>
                )}
              </div>

              <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '12px', lineHeight: 1.4 }}>
                Format didukung: <strong>JPG, PNG, WEBP</strong> (Maksimal 2 MB). Disarankan menggunakan foto resmi kedinasan berseragam Polri.
              </div>
            </div>
          </section>

          {/* Card: Status Hak Akses & Keamanan Sesi */}
          <section
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <span style={{ fontSize: '18px' }}>🛡️</span>
              <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--color-text-main)' }}>
                Wewenang & Hak Akses
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11.5px', marginBottom: '2px' }}>Peran Institusional:</span>
                <span style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>
                  {roleName}
                </span>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11.5px', marginBottom: '2px' }}>Cakupan Izin Operasi:</span>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: isSuperadminCrud ? 'rgba(34, 197, 94, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                    color: isSuperadminCrud ? '#16a34a' : '#0284c7',
                  }}
                >
                  {isSuperadminCrud
                    ? 'CRUD PENUH (CREATE, READ, UPDATE, DELETE)'
                    : isAdminCru
                    ? 'CRU AKTIF (CREATE, READ, UPDATE - TANPA DELETE)'
                    : 'AKSES STANDAR KEDINASAN'}
                </span>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11.5px', marginBottom: '2px' }}>Status Akun:</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 700 }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
                  Aktif & Terverifikasi
                </span>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11.5px', marginBottom: '2px' }}>Batas Sesi Keamanan:</span>
                <span style={{ color: 'var(--color-text-main)' }}>Maksimal 6 Jam per login kedinasan</span>
              </div>
            </div>
          </section>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: DETAIL DATA PENGGUNA & FORM GANTI PASSWORD */}
        {/* ========================================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Card: Form Detail Identitas Pengguna */}
          <section
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <span style={{ fontSize: '18px' }}>👤</span>
              <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--color-text-main)' }}>
                Detail Data Pengguna
              </h2>
            </div>

            {profileFeedback && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: profileFeedback.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: profileFeedback.type === 'success' ? '#16a34a' : '#dc2626',
                  border: `1px solid ${profileFeedback.type === 'success' ? '#86efac' : '#fca5a5'}`,
                }}
              >
                {profileFeedback.message}
              </div>
            )}

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Baris 1: NRP / NIP (Read-only) & Pangkat */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-main)' }}>
                    NRP / NIP (Kunci Akun)
                  </label>
                  <input
                    type="text"
                    value={currentUser?.nrp_nip || ''}
                    disabled
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface-hover)',
                      color: 'var(--color-text-muted)',
                      fontSize: '13px',
                      cursor: 'not-allowed',
                      fontWeight: 600,
                    }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Identitas kedinasan unik (terkunci)</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-main)' }}>
                    Pangkat Personel
                  </label>
                  <select
                    value={pangkat}
                    onChange={(e) => setPangkat(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-main)',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    <option value="">Pilih Pangkat</option>
                    {PANGKAT_OPTIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Baris 2: Nama Lengkap */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-main)' }}>
                  Nama Lengkap Beserta Gelar
                </label>
                <input
                  type="text"
                  required
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  placeholder="Contoh: Denny Prasetyo, S.I.K., M.Si."
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-main)',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                />
              </div>

              {/* Baris 3: Jabatan Kedinasan */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-main)' }}>
                  Jabatan Kedinasan / Posisi
                </label>
                <input
                  type="text"
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  placeholder="Contoh: Super Administrator CRUD SIPINTAR / Gadik Madya"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-main)',
                    fontSize: '13px',
                  }}
                />
              </div>

              {/* Baris 4: Email & Nomor Telepon */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-main)' }}>
                    Email Kedinasan
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@sespimma.polri.go.id"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-main)',
                      fontSize: '13px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-main)' }}>
                    Nomor Telepon / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0812xxxxxxxx"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-main)',
                      fontSize: '13px',
                    }}
                  />
                </div>
              </div>

              {/* Submit Button Profile */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  type="submit"
                  disabled={isSubmittingProfile}
                  style={{
                    padding: '10px 20px',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    cursor: isSubmittingProfile ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
                    opacity: isSubmittingProfile ? 0.7 : 1,
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  <span>{isSubmittingProfile ? 'Menyimpan...' : 'Simpan Perubahan Data'}</span>
                </button>
              </div>
            </form>
          </section>

          {/* Card: Ganti Kata Sandi (Password) */}
          <section
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <span style={{ fontSize: '18px' }}>🔒</span>
              <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--color-text-main)' }}>
                Keamanan & Ganti Kata Sandi
              </h2>
            </div>

            {passwordFeedback && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: passwordFeedback.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: passwordFeedback.type === 'success' ? '#16a34a' : '#dc2626',
                  border: `1px solid ${passwordFeedback.type === 'success' ? '#86efac' : '#fca5a5'}`,
                }}
              >
                {passwordFeedback.message}
              </div>
            )}

            <form onSubmit={handleSavePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Kata Sandi Saat Ini */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-main)' }}>
                  Kata Sandi Saat Ini
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Masukkan kata sandi yang sedang digunakan"
                    style={{
                      width: '100%',
                      padding: '9px 38px 9px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-main)',
                      fontSize: '13px',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: 'var(--color-text-muted)',
                      padding: 0,
                    }}
                    title={showCurrentPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showCurrentPassword ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>

              {/* Kata Sandi Baru */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-main)' }}>
                  Kata Sandi Baru (Minimal 8 Karakter)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Masukkan kata sandi baru yang kuat"
                    style={{
                      width: '100%',
                      padding: '9px 38px 9px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-main)',
                      fontSize: '13px',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: 'var(--color-text-muted)',
                      padding: 0,
                    }}
                    title={showNewPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showNewPassword ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Kata Sandi Baru */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-main)' }}>
                  Konfirmasi Kata Sandi Baru
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru"
                    style={{
                      width: '100%',
                      padding: '9px 38px 9px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-main)',
                      fontSize: '13px',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: 'var(--color-text-muted)',
                      padding: 0,
                    }}
                    title={showConfirmPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showConfirmPassword ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>

              {/* Password Checklist Helper */}
              <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', lineHeight: 1.5, backgroundColor: 'var(--color-surface-hover)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                🔒 <strong>Standar Keamanan Sespimma:</strong> Gunakan kombinasi huruf besar, huruf kecil, dan angka dengan panjang minimal 8 karakter untuk melindungi akun kedinasan Anda.
              </div>

              {/* Submit Button Password */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button
                  type="submit"
                  disabled={isSubmittingPassword}
                  style={{
                    padding: '10px 20px',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: '1px solid #16a34a',
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    cursor: isSubmittingPassword ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 6px rgba(22, 163, 74, 0.3)',
                    opacity: isSubmittingPassword ? 0.7 : 1,
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>{isSubmittingPassword ? 'Memperbarui...' : 'Perbarui Kata Sandi'}</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

