'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log client error locally
    console.error('SIPINTAR Prototype Error:', error);
  }, [error]);

  return (
    <div
      style={{
        padding: '64px 24px',
        textAlign: 'center',
        maxWidth: '560px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--color-danger-bg)',
          color: 'var(--color-danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
        }}
        aria-hidden="true"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '8px' }}>
        Terjadi Kendala Memuat Data
      </h1>

      <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '24px' }}>
        Terjadi kendala pada tampilan antarmuka saat memproses data simulasi. Silakan coba muat ulang komponen ini.
      </p>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => reset()}
          className="btn-primary"
          style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
        >
          Muat Ulang Komponen
        </button>
        <Link
          href="/"
          className="btn-secondary"
          style={{ color: 'var(--color-text-main)' }}
        >
          Ke Beranda
        </Link>
      </div>
    </div>
  );
}
