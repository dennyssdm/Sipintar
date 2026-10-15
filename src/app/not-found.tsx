import React from 'react';
import Link from 'next/link';

export default function NotFound() {
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
          backgroundColor: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
        }}
        aria-hidden="true"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '8px' }}>
        Halaman Tidak Ditemukan
      </h1>

      <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '24px' }}>
        Halaman atau berkas sumber belajar yang Anda tuju tidak tersedia atau tautan telah dipindahkan.
      </p>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <Link
          href="/"
          className="btn-primary"
          style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
        >
          Kembali ke Beranda
        </Link>
        <Link
          href="/search"
          className="btn-secondary"
          style={{ color: 'var(--color-text-main)' }}
        >
          Buka Pencarian Terpadu
        </Link>
      </div>
    </div>
  );
}
