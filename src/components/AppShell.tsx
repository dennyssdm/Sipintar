'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { SearchBar } from './SearchBar';
import { BrandLogo } from './BrandLogo';
import { sipintarApi } from '@/lib/apiClient';
import { getAuthSession, clearAuthSession, AuthSessionUser } from '@/lib/session';
import { UserRole } from '@/types';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname === '/' || pathname === '/login';

  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('Serdik');
  const [notifOpen, setNotifOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthSessionUser | null>(null);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);

  useEffect(() => {
    const syncUser = () => {
      const { user, isExpired } = getAuthSession();
      if (!isAuthPage) {
        if (!user || isExpired) {
          clearAuthSession();
          setCurrentUser(null);
          setIsVerifyingAuth(false);
          router.replace(isExpired ? '/?expired=1' : '/');
          return;
        }
      }

      if (user) {
        setCurrentUser(user);
        if (user.token) {
          sipintarApi.setToken(user.token);
        }
        if (user.role) {
          if (['admin', 'verifikator', 'pimpinan'].includes(user.role)) {
            setCurrentRole('Administrator');
          } else if (user.role === 'gadik') {
            setCurrentRole('Gadik');
          } else if (user.role === 'pengelola') {
            setCurrentRole('Pengelola Perpustakaan');
          } else {
            setCurrentRole('Serdik');
          }
        }
      } else {
        setCurrentUser(null);
        setCurrentRole('Serdik');
      }
      setIsVerifyingAuth(false);
    };

    syncUser();

    // Sesi kedaluwarsa 6 jam dicek otomatis secara periodik
    const interval = setInterval(() => {
      if (!isAuthPage) {
        const { user, isExpired } = getAuthSession();
        if (!user || isExpired) {
          clearAuthSession();
          setCurrentUser(null);
          router.replace('/?expired=1');
        }
      }
    }, 15000);

    const handleAuthChange = (e: CustomEvent<AuthSessionUser | null>) => {
      const user = e.detail;
      setCurrentUser(user);
      if (user && user.role) {
        if (['admin', 'verifikator', 'pimpinan'].includes(user.role)) {
          setCurrentRole('Administrator');
        } else if (user.role === 'gadik') {
          setCurrentRole('Gadik');
        } else if (user.role === 'pengelola') {
          setCurrentRole('Pengelola Perpustakaan');
        } else {
          setCurrentRole('Serdik');
        }
      } else {
        setCurrentRole('Serdik');
      }
    };

    window.addEventListener('sipintar-auth-changed', handleAuthChange as EventListener);
    return () => {
      clearInterval(interval);
      window.removeEventListener('sipintar-auth-changed', handleAuthChange as EventListener);
    };
  }, [pathname, isAuthPage, router]);

  const handleLogout = () => {
    sipintarApi.auth.logout();
    clearAuthSession();
    setCurrentUser(null);
    window.dispatchEvent(new CustomEvent('sipintar-auth-changed', { detail: null }));
    router.replace('/');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setNotifOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Jika di halaman login (root / atau /login), render murni konten halaman tanpa layout dashboard
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Jika sedang memverifikasi sesi kedinasan pada halaman internal
  if (isVerifyingAuth || !currentUser) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#071731',
          color: '#cbd5e1',
          fontFamily: 'var(--font-sans, sans-serif)',
          gap: '14px',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            border: '3px solid rgba(255, 255, 255, 0.15)',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <div style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.02em' }}>
          Memverifikasi Sesi Kedinasan Sespimma...
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const navItems = [
    { name: 'Beranda', href: '/dashboard', icon: 'home' },
    { name: 'Gadik & Kompetensi', href: '/gadik', icon: 'users' },
    { name: 'Modul & Hanjar', href: '/modul', icon: 'book' },
    { name: 'E-Library/Perpustakaan', href: '/library', icon: 'bookmark' },
    { name: 'Kurikulum & Standar Layanan', href: '/kurikulum', icon: 'award' },
    { name: 'SOP', href: '/sop', icon: 'file-text' },
    { name: 'Pedoman', href: '/pedoman', icon: 'compass' },
    { name: 'Manual Book', href: '/manual', icon: 'help-circle' },
    { name: 'Pencarian Terpadu', href: '/search', icon: 'search' },
  ];

  const userRole = (currentUser?.role || '').toLowerCase();

  const adminNavItems = [
    { name: 'Manajemen Data', href: '/admin/data', icon: 'database', badge: 5, roles: ['admin'] },
    { name: 'Verifikasi', href: '/admin/verifikasi', icon: 'shield-check', badge: 3, roles: ['admin', 'verifikator'] },
    { name: 'Hak Akses', href: '/admin/akses', icon: 'lock', roles: ['admin'] },
    { name: 'Monitoring', href: '/admin/monitoring', icon: 'activity', badge: 2, roles: ['admin', 'pimpinan', 'verifikator'] },
  ];

  const visibleAdminNavItems = currentUser && userRole
    ? adminNavItems.filter((item) => item.roles.includes(userRole))
    : [];

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
              style={{ padding: '6px', color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title-sumber">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span>SUMBER BELAJAR</span>
          </div>
          {navItems.map((item) => {
            const isActive = item.href === '/dashboard' ? (pathname === '/dashboard') : pathname === item.href;
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

          {visibleAdminNavItems.length > 0 && (
            <>
              <div className="nav-section-title-admin">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>FUNGSI ADMINISTRATOR</span>
              </div>
              {visibleAdminNavItems.map((item) => {
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
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-card">
            <div
              className="user-avatar"
              aria-hidden="true"
              style={{
                backgroundColor: '#1d4ed8',
                color: '#ffffff',
                fontWeight: 800,
              }}
            >
              {currentUser.nama_lengkap?.slice(0, 2).toUpperCase() || 'US'}
            </div>
            <div className="user-info" style={{ flex: 1, minWidth: 0 }}>
              <div
                className="user-name"
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontWeight: 700,
                }}
                title={currentUser.nama_lengkap}
              >
                {currentUser.nama_lengkap}
              </div>
              <div className="user-role-badge">
                {currentUser.role_name || currentRole}
              </div>
              {currentUser.nrp_nip && (
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  NRP/NIP: {currentUser.nrp_nip}
                </div>
              )}
            </div>
          </div>

          {/* Tombol Logout Penuh di Sidebar */}
          <button
            type="button"
            onClick={handleLogout}
            style={{
              marginTop: '10px',
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
            title="Keluar dari akun Anda (Logout)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Keluar dari Akun (Logout)</span>
          </button>
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
            <div className="header-notif-wrap" style={{ position: 'relative' }}>
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

            {/* User Profile Pill & Prominent Red Logout Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 10px',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#1d4ed8',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {currentUser.nama_lengkap?.slice(0, 2).toUpperCase() || 'US'}
                </div>
                <div style={{ fontSize: '12px', lineHeight: 1.2 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      color: 'var(--color-navy)',
                      maxWidth: '120px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={currentUser.nama_lengkap}
                  >
                    {currentUser.nama_lengkap}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                    {currentUser.role_name || currentRole}
                  </div>
                </div>
              </div>

              {/* Tombol Logout Menonjol di Header */}
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  border: '1px solid #b91c1c',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(220, 38, 38, 0.25)',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
                title="Keluar dari akun SIPINTAR (Logout)"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Keluar / Logout</span>
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
  );
};
