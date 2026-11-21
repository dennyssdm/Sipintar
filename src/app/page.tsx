'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { sipintarApi } from '@/lib/apiClient';
import { saveAuthSession, getAuthSession, AuthSessionUser } from '@/lib/session';
import { ThemeToggle } from '@/components/ThemeToggle';
import { RoleRegistrationModal } from '@/components/RoleRegistrationModal';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isExpiredParam = searchParams.get('expired') === '1';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [showInfographicModal, setShowInfographicModal] = useState(false);

  // Cek apakah user sudah login & sesi masih berlaku (di bawah 6 jam)
  useEffect(() => {
    const { user, isExpired } = getAuthSession();
    if (user && !isExpired) {
      router.replace('/dashboard');
    } else {
      setIsCheckingSession(false);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!identifier.trim() || !password) {
      setErrorMsg('Silakan masukkan NRP/NIP/Email dan kata sandi Anda.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await sipintarApi.auth.login(identifier.trim(), password);
      if (res?.user) {
        // Simpan sesi dengan batas 6 jam
        saveAuthSession(res.user as AuthSessionUser, res.token);
        if (res.token) {
          sipintarApi.setToken(res.token);
        }
        window.dispatchEvent(new CustomEvent('sipintar-auth-changed', { detail: res.user }));

        // Arahkan masuk ke dashboard
        router.replace('/dashboard');
      } else {
        throw new Error('Respons autentikasi tidak valid.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal masuk. Periksa kembali NRP/Email dan kata sandi Anda.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (quickId: string, quickPass: string) => {
    setIdentifier(quickId);
    setPassword(quickPass);
    setErrorMsg(null);
  };

  const handleRegisterSuccess = (role: string, user?: AuthSessionUser) => {
    setRegisterOpen(false);
    if (user) {
      saveAuthSession(user);
      window.dispatchEvent(new CustomEvent('sipintar-auth-changed', { detail: user }));
      router.replace('/dashboard');
    }
  };

  if (isCheckingSession) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#071731',
          color: '#cbd5e1',
          fontSize: '13.5px',
        }}
      >
        Memeriksa sesi pengguna...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'radial-gradient(ellipse at 50% 15%, #0d2952 0%, #071731 65%, #040d1a 100%)',
        color: '#f8fafc',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Bar Minimalis */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 28px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(7, 23, 49, 0.75)',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        {/* Identitas Institusional */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '0.05em',
            color: '#f8fafc',
            textTransform: 'uppercase',
          }}
        >
          <span
            style={{
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              boxShadow: '0 0 10px #3b82f6',
            }}
          />
          <span>Sespimma Lemdiklat Polri • Sistem Informasi Pembelajaran</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: 'rgba(251, 191, 36, 0.1)',
              border: '1px solid rgba(251, 191, 36, 0.25)',
              fontSize: '11px',
              fontWeight: 700,
              color: '#fbbf24',
            }}
            className="header-badge-desktop"
          >
            <span>PKN TINGKAT II NAWASENA TA 2026</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Container - Split Layout (Infografis & Branding di Kiri, Form Login di Kanan) */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 20px',
          maxWidth: '1380px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '36px',
            width: '100%',
            alignItems: 'center',
          }}
        >
          {/* ========================================================================= */}
          {/* SISI KIRI: BRANDING INSTITUSIONAL & GAMBAR INFOGRAFIS TEMA */}
          {/* ========================================================================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Pita Lencana Identitas */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  backgroundColor: 'rgba(251, 191, 36, 0.12)',
                  borderRadius: '20px',
                  border: '1px solid rgba(251, 191, 36, 0.35)',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  color: '#fbbf24',
                }}
              >
                <span>🎖️</span>
                <span>PKN TINGKAT II ANGKATAN XXIX NAWASENA</span>
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  backgroundColor: 'rgba(59, 130, 246, 0.12)',
                  borderRadius: '20px',
                  border: '1px solid rgba(59, 130, 246, 0.35)',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  color: '#93c5fd',
                }}
              >
                <span>🛡️</span>
                <span>SESPIMMA LEMDIKLAT POLRI</span>
              </div>
            </div>

            {/* Kicker & Judul Tipografi Utama */}
            <div>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: '#93c5fd',
                  letterSpacing: '1.2px',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                }}
              >
                <span style={{ width: '20px', height: '2px', backgroundColor: '#60a5fa', display: 'inline-block' }} />
                <span>PLATFORM TATA KELOLA SUMBER BELAJAR TERPADU</span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(32px, 3.8vw, 46px)',
                  fontWeight: 900,
                  color: '#ffffff',
                  lineHeight: 1.15,
                  margin: '0 0 10px',
                  letterSpacing: '-0.5px',
                  textShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                }}
              >
                SiPINTAR{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Sespimma
                </span>
              </h1>

              {/* Akronim & Penjelasan */}
              <p
                style={{
                  fontSize: 'clamp(14px, 1.25vw, 16px)',
                  fontWeight: 600,
                  color: '#e2e8f0',
                  lineHeight: 1.5,
                  margin: '0 0 8px',
                }}
              >
                Sistem Informasi Pembelajaran{' '}
                <span
                  style={{
                    color: '#fbbf24',
                    fontWeight: 800,
                    backgroundColor: 'rgba(251, 191, 36, 0.15)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(251, 191, 36, 0.35)',
                  }}
                >
                  INovatif
                </span>{' '}
                Terpadu,{' '}
                <span
                  style={{
                    color: '#38bdf8',
                    fontWeight: 800,
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                  }}
                >
                  Adaptif
                </span>
                , dan{' '}
                <span
                  style={{
                    color: '#34d399',
                    fontWeight: 800,
                    backgroundColor: 'rgba(52, 211, 153, 0.15)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(52, 211, 153, 0.35)',
                  }}
                >
                  Responsif
                </span>
              </p>

              {/* Slogan / Tagline */}
              <p
                style={{
                  fontSize: '13.5px',
                  fontStyle: 'italic',
                  fontWeight: 500,
                  color: '#cbd5e1',
                  margin: 0,
                  letterSpacing: '0.2px',
                }}
              >
                &ldquo;Mengintegrasikan Pengetahuan, Mengakselerasikan Kepemimpinan&rdquo;
              </p>
            </div>

            {/* Showcase Gambar Infografis Sesuai Tema */}
            <div
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 16px 36px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(251, 191, 36, 0.15)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {/* Infographic Header Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 16px',
                  backgroundColor: 'rgba(7, 23, 49, 0.85)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', fontWeight: 700, color: '#f8fafc' }}>
                  <span style={{ color: '#fbbf24' }}>📊</span>
                  <span>INFOGRAFIS ARSITEKTUR SUMBER BELAJAR TERPADU</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInfographicModal(true)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    color: '#93c5fd',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease',
                  }}
                  title="Klik untuk melihat infografis dalam ukuran penuh"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                  <span>Perbesar</span>
                </button>
              </div>

              {/* Infographic Image Preview */}
              <div
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'zoom-in',
                  backgroundColor: '#071731',
                }}
                onClick={() => setShowInfographicModal(true)}
                title="Klik untuk memperbesar infografis"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/infografis-sipintar.jpg"
                  alt="Infografis SiPINTAR Sespimma - Platform Tata Kelola Sumber Belajar Terpadu"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
              </div>

              {/* Infographic Caption & Highlights */}
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'rgba(7, 23, 49, 0.6)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  fontSize: '12px',
                  color: '#cbd5e1',
                  lineHeight: 1.45,
                }}
              >
                Arsitektur ekosistem pembelajaran terintegrasi: <strong>Gadik & Kompetensi</strong>, <strong>Modul & Hanjar</strong>, <strong>E-Library/Perpustakaan</strong>, <strong>Kurikulum 720 JP</strong>, <strong>SOP Sidang Taskap</strong>, dan <strong>Pusat Pengendali Administrator CMS</strong>.
              </div>
            </div>

            {/* 4 Pilar Ekosistem Mini Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '10px',
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  fontSize: '11.5px',
                }}
              >
                <div style={{ fontWeight: 800, color: '#38bdf8', marginBottom: '2px' }}>📖 183 Hanjar</div>
                <div style={{ color: '#94a3b8', fontSize: '10.5px' }}>Modul ajar digital terverifikasi</div>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  fontSize: '11.5px',
                }}
              >
                <div style={{ fontWeight: 800, color: '#fbbf24', marginBottom: '2px' }}>📚 2.863 Pustaka</div>
                <div style={{ color: '#94a3b8', fontSize: '10.5px' }}>Koleksi buku & naskah Taskap</div>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  fontSize: '11.5px',
                }}
              >
                <div style={{ fontWeight: 800, color: '#34d399', marginBottom: '2px' }}>👨‍🏫 16 Gadik</div>
                <div style={{ color: '#94a3b8', fontSize: '10.5px' }}>Personel fungsional terpetakan</div>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  fontSize: '11.5px',
                }}
              >
                <div style={{ fontWeight: 800, color: '#a78bfa', marginBottom: '2px' }}>⚖️ SOP & Layanan</div>
                <div style={{ color: '#94a3b8', fontSize: '10.5px' }}>Tata kelola pembelajaran presisi</div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SISI KANAN: CARD AUTENTIKASI PENGGUNA (LOGIN PANEL) */}
          {/* ========================================================================= */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                width: '100%',
                maxWidth: '460px',
                backgroundColor: 'var(--color-surface, #0f172a)',
                borderRadius: '18px',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.12)',
                border: '1px solid var(--color-border, rgba(255, 255, 255, 0.1))',
                overflow: 'hidden',
              }}
            >
              {/* Card Header Institusional Sespimma */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #071731 0%, #174f9c 100%)',
                  color: 'white',
                  padding: '26px 24px 20px',
                  textAlign: 'center',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {/* Lencana Mikro Emas */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    backgroundColor: 'rgba(255, 215, 0, 0.15)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 215, 0, 0.4)',
                    marginBottom: '12px',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#ffd700',
                      boxShadow: '0 0 6px #ffd700',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      color: '#ffd700',
                      textTransform: 'uppercase',
                    }}
                  >
                    Autentikasi Pengguna Sespimma
                  </span>
                </div>

                {/* Judul Tipografi */}
                <h2
                  style={{
                    fontSize: '22px',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    margin: '0 0 6px',
                    color: '#ffffff',
                  }}
                >
                  Masuk ke Akun SIPINTAR
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: '12.5px',
                    color: '#cbd5e1',
                    lineHeight: 1.45,
                    maxWidth: '360px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                >
                  Gunakan Email (pribadi/kedinasan) atau NRP/NIP untuk mengakses ekosistem sumber belajar.
                </p>
              </div>

              {/* Card Body */}
              <div style={{ padding: '24px' }}>
                {/* Peringatan Sesi Kedaluwarsa 6 Jam */}
                {isExpiredParam && (
                  <div
                    style={{
                      backgroundColor: 'rgba(245, 158, 11, 0.12)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      color: '#f59e0b',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                    role="alert"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <div>Sesi login Anda telah berakhir (batas 6 jam). Silakan masuk kembali.</div>
                  </div>
                )}

                {/* Error Message Alert */}
                {errorMsg && (
                  <div
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#f87171',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                    }}
                    role="alert"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <div>{errorMsg}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Input NRP / NIP / Email */}
                  <div style={{ marginBottom: '16px' }}>
                    <label
                      htmlFor="auth-identifier"
                      style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: 700,
                        marginBottom: '6px',
                        color: 'var(--color-text, #f8fafc)',
                      }}
                    >
                      NRP / NIP atau Alamat Email
                    </label>
                    <input
                      id="auth-identifier"
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Contoh: dennyboy, livi, atau 76030706"
                      required
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        fontSize: '13.5px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--color-border, #334155)',
                        backgroundColor: 'var(--color-background, #1e293b)',
                        color: 'inherit',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Input Password */}
                  <div style={{ marginBottom: '20px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '6px',
                      }}
                    >
                      <label
                        htmlFor="auth-password"
                        style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          color: 'var(--color-text, #f8fafc)',
                        }}
                      >
                        Kata Sandi
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '11.5px',
                          color: 'var(--color-primary, #3b82f6)',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                      </button>
                    </div>
                    <input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi akun Anda"
                      required
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        fontSize: '13.5px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--color-border, #334155)',
                        backgroundColor: 'var(--color-background, #1e293b)',
                        color: 'inherit',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Tombol Masuk Sekarang */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '14px',
                      fontWeight: 800,
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      opacity: isLoading ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 10px rgba(37, 99, 235, 0.35)',
                      transition: 'all 0.2s',
                    }}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          className="spin-icon"
                        >
                          <line x1="12" y1="2" x2="12" y2="6" />
                          <line x1="12" y1="18" x2="12" y2="22" />
                          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                          <line x1="2" y1="12" x2="6" y2="12" />
                          <line x1="18" y1="12" x2="22" y2="12" />
                        </svg>
                        <span>Memverifikasi Akun...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                          <polyline points="10 17 15 12 10 7" />
                          <line x1="15" y1="12" x2="3" y2="12" />
                        </svg>
                        <span>Masuk Sekarang</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Akses Cepat Pengujian (1-Klik untuk Evaluator) */}
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Akses Cepat Pengujian Akun (Kata Sandi: Password123!)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('dennyboy', 'Password123!')}
                      style={{
                        padding: '6px 8px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        color: '#4ade80',
                        border: '1px solid rgba(34, 197, 94, 0.25)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                      title="Superadmin CRUD: Full access Create, Read, Update, Delete"
                    >
                      👑 Superadmin (dennyboy)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('livi', 'Password123!')}
                      style={{
                        padding: '6px 8px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: 'rgba(56, 189, 248, 0.1)',
                        color: '#38bdf8',
                        border: '1px solid rgba(56, 189, 248, 0.25)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                      title="Admin CRU: Create, Read, Update (Tanpa Delete)"
                    >
                      🛡️ Admin CRU (livi)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('76030706', 'Password123!')}
                      style={{
                        padding: '6px 8px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: 'rgba(251, 191, 36, 0.1)',
                        color: '#fbbf24',
                        border: '1px solid rgba(251, 191, 36, 0.25)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                      title="Tenaga Pendidik / Gadik Madya (AKBP Dewi Susilo Pangestuti)"
                    >
                      👨‍🏫 Gadik (AKBP Dewi)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('80010001', 'Password123!')}
                      style={{
                        padding: '6px 8px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: 'rgba(168, 85, 247, 0.1)',
                        color: '#c084fc',
                        border: '1px solid rgba(168, 85, 247, 0.25)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                      title="Peserta Didik Sespimma (Serdik AKP Hendra)"
                    >
                      🎓 Serdik (AKP Hendra)
                    </button>
                  </div>
                </div>

                {/* Tautan Pendaftaran Anggota Baru */}
                <div
                  style={{
                    marginTop: '16px',
                    textAlign: 'center',
                    fontSize: '12px',
                    color: 'var(--color-text-muted, #94a3b8)',
                  }}
                >
                  Belum memiliki akun terdaftar?{' '}
                  <button
                    type="button"
                    onClick={() => setRegisterOpen(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#3b82f6',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline',
                    }}
                  >
                    Daftar Akun Baru
                  </button>
                </div>

                {/* Notifikasi Keamanan Sesi 6 Jam */}
                <div
                  style={{
                    marginTop: '14px',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--color-border, rgba(255, 255, 255, 0.08))',
                    fontSize: '11px',
                    color: 'var(--color-text-muted, #94a3b8)',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>Keamanan Sesi: Otomatis logout setelah 6 jam</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Institusional */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(7, 23, 49, 0.85)',
          padding: '18px 24px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#94a3b8',
        }}
      >
        <div style={{ fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
          DEWI SUSILO PANGESTUTI, S.Ak - PKN TINGKAT II ANGKATAN XXIX NAWASENA TA 2026
        </div>
        <div>
          SiPINTAR — Sespimma Sespim Lemdiklat Polri • &ldquo;Mengintegrasikan Pengetahuan, Mengakselerasikan Kepemimpinan&rdquo;
        </div>
      </footer>

      {/* Modal Perbesar Infografis (Lightbox) */}
      {showInfographicModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowInfographicModal(false)}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '1200px',
              width: '100%',
              backgroundColor: '#071731',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#fbbf24' }}>📊</span>
                <span>Infografis Arsitektur Platform SIPINTAR Sespimma Lemdiklat Polri</span>
              </div>
              <button
                type="button"
                onClick={() => setShowInfographicModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#cbd5e1',
                  fontSize: '18px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '6px',
                }}
                title="Tutup pratinjau"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Full Image */}
            <div style={{ padding: '12px', maxHeight: '82vh', overflow: 'auto', textAlign: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/infografis-sipintar.png"
                alt="Infografis Penuh SiPINTAR Sespimma"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  display: 'inline-block',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal Registrasi Peran */}
      <RoleRegistrationModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        initialRole="Serdik"
        onSuccessRole={handleRegisterSuccess}
        onOpenLogin={() => setRegisterOpen(false)}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#071731',
            color: '#cbd5e1',
            fontSize: '14px',
          }}
        >
          Memuat halaman masuk SIPINTAR...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
