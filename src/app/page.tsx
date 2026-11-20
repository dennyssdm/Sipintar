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
        background: 'radial-gradient(ellipse at 50% 20%, #0d2952 0%, #071731 70%, #040d1a 100%)',
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
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(7, 23, 49, 0.65)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Identitas Institusional Murni Tipografi Tanpa Logo Gambar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '0.05em',
            color: '#f8fafc',
            textTransform: 'uppercase',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              boxShadow: '0 0 8px #3b82f6',
            }}
          />
          <span>Sespimma Lemdiklat Polri • Sistem Informasi Pembelajaran</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Container - Card Login */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '36px 16px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '450px',
            backgroundColor: 'var(--color-surface, #0f172a)',
            borderRadius: '16px',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            border: '1px solid var(--color-border, rgba(255, 255, 255, 0.1))',
            overflow: 'hidden',
          }}
        >
          {/* Card Header Institusional Sespimma */}
          <div
            style={{
              background: 'linear-gradient(135deg, #071731 0%, #174f9c 100%)',
              color: 'white',
              padding: '28px 24px 22px',
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
            <h1
              style={{
                fontSize: '22px',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                margin: '0 0 6px',
                color: '#ffffff',
              }}
            >
              Masuk ke Akun SIPINTAR
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: '12px',
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
                  placeholder="Contoh: 80010001 atau nama@gmail.com"
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

            {/* Tautan Pendaftaran Anggota Baru (Satu-satunya di bawah form) */}
            <div
              style={{
                marginTop: '22px',
                textAlign: 'center',
                fontSize: '12.5px',
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
                marginTop: '18px',
                paddingTop: '14px',
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
      </main>

      {/* Footer Institusional */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(7, 23, 49, 0.8)',
          padding: '20px 24px',
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
