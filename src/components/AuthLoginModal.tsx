'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { sipintarApi } from '@/lib/apiClient';

interface AuthLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  onOpenRegister?: () => void;
}

export const AuthLoginModal: React.FC<AuthLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onOpenRegister,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleClose = useCallback(() => {
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

    if (!identifier.trim() || !password) {
      setErrorMsg('Silakan masukkan NRP/NIP/Email dan kata sandi Anda.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await sipintarApi.auth.login(identifier.trim(), password);
      if (res?.user) {
        onSuccess({ ...res.user, token: res.token });
        handleClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal masuk. Periksa kembali NRP/Email dan kata sandi Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(7, 23, 49, 0.78)',
        backdropFilter: 'blur(8px)',
        zIndex: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface, #ffffff)',
          color: 'var(--color-text, #0f172a)',
          borderRadius: '16px',
          maxWidth: '480px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--color-border, #e2e8f0)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #071731 0%, #174f9c 100%)',
            color: 'white',
            padding: '24px 24px 20px',
            position: 'relative',
          }}
        >
          <button
            type="button"
            onClick={handleClose}
            aria-label="Tutup"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 10px', backgroundColor: 'rgba(255, 215, 0, 0.15)', borderRadius: '20px', border: '1px solid rgba(255, 215, 0, 0.4)', marginBottom: '10px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ffd700' }} />
            <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.05em', color: '#ffd700', textTransform: 'uppercase' }}>
              Autentikasi Pengguna Sespimma
            </span>
          </div>

          <h2 id="login-modal-title" style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em', color: 'white' }}>
            Masuk ke Akun SIPINTAR
          </h2>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#cbd5e1', lineHeight: 1.4 }}>
            Gunakan Email (pribadi/kedinasan) atau NRP/NIP untuk mengakses ekosistem sumber belajar.
          </p>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
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
                htmlFor="auth-identifier"
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
                id="auth-identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Contoh: 80010001 atau nama@gmail.com"
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label
                  htmlFor="auth-password"
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
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi akun Anda"
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="spin-icon">
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
          {onOpenRegister && (
            <div style={{ marginTop: '22px', textAlign: 'center', fontSize: '13px', color: 'var(--color-text-muted, #94a3b8)' }}>
              Belum memiliki akun terdaftar?{' '}
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  onOpenRegister();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary, #3b82f6)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                Daftar Akun Baru
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

