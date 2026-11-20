'use client';

import React, { useState, useSyncExternalStore, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { sipintarApi } from '@/lib/apiClient';
import { ThemeToggle } from '@/components/ThemeToggle';
import { RoleRegistrationModal } from '@/components/RoleRegistrationModal';

interface AuthUser {
  id?: number | string;
  nama_lengkap?: string;
  nrp_nip?: string;
  email?: string;
  role?: string;
  role_name?: string;
  token?: string;
}

function getSavedUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem('sipintar_auth_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function subscribeToAuth(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener('sipintar-auth-changed', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('sipintar-auth-changed', callback);
  };
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '';

  const existingUser = useSyncExternalStore(subscribeToAuth, getSavedUser, () => null);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [registerOpen, setRegisterOpen] = useState(false);

  const handleLoginSuccess = (user: AuthUser) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sipintar_auth_user', JSON.stringify(user));
      if (user.token) {
        localStorage.setItem('sipintar_auth_token', user.token);
        sipintarApi.setToken(user.token);
      }
      window.dispatchEvent(new CustomEvent('sipintar-auth-changed', { detail: user }));
    }

    if (redirectTarget && redirectTarget.startsWith('/')) {
      router.push(redirectTarget);
    } else if (user.role && ['admin', 'verifikator', 'pimpinan'].includes(user.role)) {
      router.push('/admin/data');
    } else {
      router.push('/');
    }
  };

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
        handleLoginSuccess({ ...res.user, token: res.token });
      } else {
        throw new Error('Format data autentikasi tidak valid.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal masuk. Periksa kembali NRP/Email dan kata sandi Anda.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutExisting = () => {
    sipintarApi.auth.logout();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sipintar_auth_user');
      localStorage.removeItem('sipintar_auth_token');
      window.dispatchEvent(new CustomEvent('sipintar-auth-changed', { detail: null }));
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-background, #f8fafc)',
        color: 'var(--color-text, #0f172a)',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Header Bar */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid var(--color-border, #e2e8f0)',
          backgroundColor: 'var(--color-surface, #ffffff)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: 'var(--color-primary, #1d4ed8)',
            fontWeight: 700,
            fontSize: '13.5px',
            transition: 'opacity 0.15s ease',
          }}
          title="Kembali ke Halaman Beranda"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Institutional Text Badge (Murni Tipografi, Tanpa Gambar Logo) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '0.04em',
            color: 'var(--color-navy, #0f172a)',
            textTransform: 'uppercase',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#1d4ed8',
            }}
          />
          <span>Sespimma Lemdiklat Polri</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Container */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 16px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '460px',
            backgroundColor: 'var(--color-surface, #ffffff)',
            borderRadius: '16px',
            boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid var(--color-border, #e2e8f0)',
            overflow: 'hidden',
          }}
        >
          {/* Card Header (Identitas Tipografi Institusional Sespimma Tanpa Logo) */}
          <div
            style={{
              background: 'linear-gradient(135deg, #071731 0%, #174f9c 100%)',
              color: 'white',
              padding: '28px 24px 22px',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            {/* Accreditation Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                backgroundColor: 'rgba(255, 215, 0, 0.15)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 215, 0, 0.35)',
                marginBottom: '12px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#ffd700',
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
                Portal Masuk Pengguna
              </span>
            </div>

            {/* Title Lockup (Typographic) */}
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                margin: '0 0 6px',
                color: '#ffffff',
              }}
            >
              SiPINTAR
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: '12px',
                color: '#cbd5e1',
                lineHeight: 1.45,
                maxWidth: '380px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              Sistem Informasi Pembelajaran INovatif Terpadu, Adaptif, dan Responsif
            </p>
          </div>

          {/* Card Body */}
          <div style={{ padding: '24px' }}>
            {/* If user already logged in */}
            {existingUser && existingUser.nama_lengkap ? (
              <div
                style={{
                  backgroundColor: 'var(--color-background, #f8fafc)',
                  border: '1px solid var(--color-border, #e2e8f0)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: '#dbeafe',
                    color: '#1d4ed8',
                    marginBottom: '12px',
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-muted, #64748b)' }}>
                  Sesi aktif terdeteksi sebagai:
                </div>
                <div
                  style={{
                    fontSize: '15px',
                    fontWeight: 800,
                    color: 'var(--color-navy, #0f172a)',
                    marginTop: '4px',
                  }}
                >
                  {existingUser.nama_lengkap}
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    marginTop: '6px',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#1e40af',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  Peran: {existingUser.role_name || existingUser.role}
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    marginTop: '20px',
                    justifyContent: 'center',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (existingUser.role && ['admin', 'verifikator', 'pimpinan'].includes(existingUser.role)) {
                        router.push('/admin/data');
                      } else {
                        router.push('/');
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--color-primary, #1d4ed8)',
                      color: 'white',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    Lanjut Masuk &rarr;
                  </button>
                  <button
                    type="button"
                    onClick={handleLogoutExisting}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      backgroundColor: 'transparent',
                      color: '#ef4444',
                      border: '1px solid #fecaca',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    Ganti Akun
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Error Banner */}
                {errorMsg && (
                  <div
                    style={{
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#991b1b',
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
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{ flexShrink: 0, marginTop: '2px' }}
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <div>{errorMsg}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Identifier Input */}
                  <div style={{ marginBottom: '16px' }}>
                    <label
                      htmlFor="login-page-identifier"
                      style={{
                        display: 'block',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        marginBottom: '6px',
                        color: 'var(--color-navy, #0f172a)',
                      }}
                    >
                      NRP / NIP atau Alamat Email
                    </label>
                    <input
                      id="login-page-identifier"
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Contoh: 80010001 atau dewi@polri.go.id"
                      required
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        fontSize: '13.5px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--color-border, #cbd5e1)',
                        backgroundColor: 'var(--color-background, #f8fafc)',
                        color: 'inherit',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Password Input */}
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
                        htmlFor="login-page-password"
                        style={{
                          fontSize: '12.5px',
                          fontWeight: 700,
                          color: 'var(--color-navy, #0f172a)',
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
                          color: 'var(--color-primary, #1d4ed8)',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                      </button>
                    </div>
                    <input
                      id="login-page-password"
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
                        border: '1.5px solid var(--color-border, #cbd5e1)',
                        backgroundColor: 'var(--color-background, #f8fafc)',
                        color: 'inherit',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Submit Button */}
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
                      backgroundColor: 'var(--color-primary, #1d4ed8)',
                      color: 'white',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      opacity: isLoading ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 6px -1px rgba(29, 78, 216, 0.25)',
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

                {/* Register Link */}
                <div
                  style={{
                    marginTop: '24px',
                    paddingTop: '20px',
                    borderTop: '1px solid var(--color-border, #e2e8f0)',
                    textAlign: 'center',
                    fontSize: '13px',
                    color: 'var(--color-text-muted, #64748b)',
                  }}
                >
                  Belum memiliki akun terdaftar?{' '}
                  <button
                    type="button"
                    onClick={() => setRegisterOpen(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-primary, #1d4ed8)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline',
                    }}
                  >
                    Daftar Akun Baru
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--color-border, #e2e8f0)',
          backgroundColor: 'var(--color-surface, #ffffff)',
          padding: '20px 24px',
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--color-text-muted, #64748b)',
        }}
      >
        <div style={{ fontWeight: 800, color: 'var(--color-navy, #0f172a)', marginBottom: '4px' }}>
          DEWI SUSILO PANGESTUTI, S.Ak - PKN TINGKAT II ANGKATAN XXIX NAWASENA TA 2026
        </div>
        <div>
          SiPINTAR — Sespimma Sespim Lemdiklat Polri • &ldquo;Mengintegrasikan Pengetahuan, Mengakselerasikan Kepemimpinan&rdquo;
        </div>
      </footer>

      {/* Role Registration Modal */}
      <RoleRegistrationModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        initialRole="Serdik"
        onSuccessRole={(_role, user) => {
          setRegisterOpen(false);
          if (user) {
            handleLoginSuccess(user);
          }
        }}
        onOpenLogin={() => setRegisterOpen(false)}
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-background, #f8fafc)',
            color: 'var(--color-text-muted, #64748b)',
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
