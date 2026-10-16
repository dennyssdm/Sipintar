'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { SearchBar } from './SearchBar';
import { BrandLogo } from './BrandLogo';
import { RoleRegistrationModal } from './RoleRegistrationModal';
import { UserRole } from '@/types';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('Serdik');
  const [notifOpen, setNotifOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { name: 'Beranda', href: '/', icon: 'home' },
    { name: 'Gadik & Kompetensi', href: '/gadik', icon: 'users' },
    { name: 'Modul & Hanjar', href: '/modul', icon: 'book' },
    { name: 'E-Library/Perpustakaan', href: '/library', icon: 'bookmark' },
    { name: 'Kurikulum & Standar Layanan', href: '/kurikulum', icon: 'award' },
    { name: 'SOP', href: '/sop', icon: 'file-text' },
    { name: 'Pedoman', href: '/pedoman', icon: 'compass' },
    { name: 'Manual Book', href: '/manual', icon: 'help-circle' },
    { name: 'Pencarian Terpadu', href: '/search', icon: 'search' },
  ];

  const adminNavItems = [
    { name: 'Manajemen Data', href: '/admin/data', icon: 'database', badge: 5 },
    { name: 'Verifikasi', href: '/admin/verifikasi', icon: 'shield-check', badge: 3 },
    { name: 'Hak Akses', href: '/admin/akses', icon: 'lock' },
    { name: 'Monitoring', href: '/admin/monitoring', icon: 'activity', badge: 2 },
  ];

  const renderIcon = (type: string) => {
    switch (type) {
      case 'home':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        );
      case 'users':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      case 'book':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        );
      case 'bookmark':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        );
      case 'award':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="7" />
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
          </svg>
        );
      case 'file-text':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        );
      case 'compass':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
        );
      case 'help-circle':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
      case 'search':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        );
      case 'database':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          </svg>
        );
      case 'shield-check':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        );
      case 'lock':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        );
      case 'activity':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Prototype Demo Banner */}
      <aside className="demo-banner" aria-label="Pemberitahuan Status Prototipe">
        <span className="demo-banner-badge">PROTOTIPE FRONTEND</span>
        <span>SIPINTAR Sespimma • Mode Demo Interaktif Lokal • Tidak terhubung ke database atau server langsung.</span>
      </aside>

      <div className="app-container">
        {/* Mobile Backdrop */}
        <div
          className={`drawer-overlay ${mobileOpen ? 'open' : ''}`}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />

        {/* Sidebar Navigation */}
        <aside
          className={`app-sidebar ${mobileOpen ? 'open' : ''}`}
          aria-label="Navigasi Utama"
        >
          <div className="sidebar-header" style={{ justifyContent: 'space-between' }}>
            <BrandLogo size="md" showSubtitle={true} />
            {mobileOpen && (
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Tutup menu navigasi"
                style={{ padding: '6px', color: 'var(--color-text-muted)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          <nav className="sidebar-nav">
            <div className="nav-section-title">Sumber Belajar</div>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="nav-icon">{renderIcon(item.icon)}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}

            <div className="nav-section-title" style={{ marginTop: '14px' }}>
              Fungsi Administrator
            </div>
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="nav-icon">{renderIcon(item.icon)}</span>
                  <span style={{ flex: 1 }}>{item.name}</span>
                  {item.badge && (
                    <span
                      style={{
                        fontSize: '11px',
                        backgroundColor: 'var(--color-primary-light)',
                        color: 'var(--color-primary)',
                        padding: '2px 7px',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: 700,
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <div className="user-profile-card">
              <div className="user-avatar" aria-hidden="true">
                {currentRole.substring(0, 2).toUpperCase()}
              </div>
              <div className="user-info">
                <div className="user-name">Pengguna Simulasi</div>
                <div className="user-role-badge">Peran: {currentRole}</div>
                <button
                  type="button"
                  onClick={() => setRegisterModalOpen(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary)',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '3px 0 0',
                    textAlign: 'left',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  title="Daftar peran baru sebagai Serdik, Gadik, atau Pengelola Pustaka"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>Daftar Peran Baru</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Viewport */}
        <div className="app-main">
          {/* Header */}
          <header className="app-header">
            <div className="header-left">
              <button
                type="button"
                className="mobile-nav-toggle"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Buka menu navigasi"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>

              <div className="mobile-brand" style={{ display: 'none' }}>
                <BrandLogo size="sm" showSubtitle={false} />
              </div>
            </div>

            <div className="header-search">
              <SearchBar />
            </div>

            <div className="header-right">
              {/* Notifications Indicator */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  className="theme-toggle-btn"
                  onClick={() => setNotifOpen(!notifOpen)}
                  aria-label="Pemberitahuan simulasi"
                  title="Pemberitahuan Sistem (Demo)"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  <span
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-action)',
                    }}
                  />
                </button>

                {notifOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '46px',
                      width: '280px',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-md)',
                      padding: '12px',
                      zIndex: 70,
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: 'var(--color-navy)' }}>
                      Pemberitahuan Sistem
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                      • 1 Modul baru diverifikasi oleh Bag Jarlat.<br />
                      • Buku Referensi Hukum Pidana diperbarui lokasinya.
                    </div>
                  </div>
                )}
              </div>

              {/* Demo Role Switcher & Registration Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <label htmlFor="role-select" style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  Peran:
                </label>
                <select
                  id="role-select"
                  value={currentRole}
                  onChange={(e) => {
                    if (e.target.value === 'DAFTAR_BARU') {
                      setRegisterModalOpen(true);
                    } else {
                      setCurrentRole(e.target.value as UserRole);
                    }
                  }}
                  style={{
                    fontSize: '12px',
                    padding: '5px 8px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-main)',
                  }}
                  title="Simulasi tampilan berdasarkan peran (hanya di frontend)"
                >
                  <option value="Serdik">Serdik (Peserta Didik)</option>
                  <option value="Gadik">Gadik (Tenaga Pendidik)</option>
                  <option value="Pengelola Perpustakaan">Pengelola Pustaka</option>
                  <option value="Administrator">Administrator</option>
                  <option value="DAFTAR_BARU">+ Ingin Bergabung? Daftar...</option>
                </select>

                <button
                  type="button"
                  onClick={() => setRegisterModalOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(29, 78, 216, 0.25)',
                    transition: 'all 0.15s ease',
                  }}
                  title="Daftar keanggotaan baru sebagai Serdik, Gadik, atau Pengelola Pustaka"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                  <span>Daftar</span>
                </button>
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
          </header>

          {/* Main Body Slot */}
          <main className="page-content">{children}</main>

          {/* Institutional Footer */}
          <footer
            className="app-footer"
            style={{
              marginTop: 'auto',
              borderTop: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              padding: '24px 20px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                maxWidth: 'var(--max-content-width)',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  fontSize: '13.5px',
                  fontWeight: 800,
                  color: 'var(--color-navy)',
                  letterSpacing: '0.4px',
                  lineHeight: 1.4,
                }}
              >
                DEWI SUSILO PANGESTUTI, S.Ak - PKN TINGKAT II ANGKATAN XXIX NAWASENA TA 2026
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                <span>SiPINTAR — Sespimma Lemdiklat Polri</span>
                <span>•</span>
                <span style={{ fontStyle: 'italic' }}>
                  &ldquo;Mengintegrasikan Pengetahuan, Mengakselerasikan Kepemimpinan&rdquo;
                </span>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Role Registration Modal for New Members (Serdik, Gadik, Pengelola Pustaka) */}
      <RoleRegistrationModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onSuccessRole={(newRole) => {
          setCurrentRole(newRole);
          setRegisterModalOpen(false);
        }}
        initialRole={currentRole}
      />
    </div>
  );
};
