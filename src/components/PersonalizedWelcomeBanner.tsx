'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAuthSession, AuthSessionUser } from '@/lib/session';
import { sipintarApi } from '@/lib/apiClient';

export default function PersonalizedWelcomeBanner() {
  const [user, setUser] = useState<AuthSessionUser | null>(null);
  const [greeting, setGreeting] = useState('Selamat Datang');

  useEffect(() => {
    // 1. Determine time of day greeting
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 4 && hour < 11) {
        setGreeting('Selamat Pagi');
      } else if (hour >= 11 && hour < 15) {
        setGreeting('Selamat Siang');
      } else if (hour >= 15 && hour < 18) {
        setGreeting('Selamat Sore');
      } else {
        setGreeting('Selamat Malam');
      }
    };
    updateGreeting();

    // 2. Load user session
    const loadSession = () => {
      const { user: sessionUser } = getAuthSession();
      if (sessionUser) {
        setUser(sessionUser);
      }
    };
    loadSession();

    // 3. Fetch fresh profile from API to ensure sync
    const fetchFresh = async () => {
      try {
        const fresh = await sipintarApi.auth.getMe();
        if (fresh) {
          setUser((prev) => (prev ? { ...prev, ...fresh } : fresh));
        }
      } catch {
        // Offline or fallback to cached session
      }
    };
    fetchFresh();

    // 4. Listen to custom auth events
    const handleAuthChange = () => {
      loadSession();
    };
    window.addEventListener('sipintar-auth-changed', handleAuthChange);
    return () => {
      window.removeEventListener('sipintar-auth-changed', handleAuthChange);
    };
  }, []);

  if (!user) return null;

  const isSuperadmin = user.nrp_nip === 'dennyboy' || (user.role === 'admin' && user.can_delete);
  const isAdminCru = user.nrp_nip === 'livi' || (user.role === 'admin' && !user.can_delete);
  const isGadik = user.role === 'gadik';
  const isSerdik = user.role === 'serdik';

  const roleTitle = isSuperadmin
    ? 'Superadmin CRUD'
    : isAdminCru
    ? 'Admin CRU'
    : isGadik
    ? 'Gadik Madya / Fungsional'
    : isSerdik
    ? 'Peserta Didik (Serdik)'
    : user.role_name || user.role.toUpperCase();

  const roleColor = isSuperadmin
    ? { bg: 'rgba(245, 158, 11, 0.18)', border: '#f59e0b', text: '#fbbf24', icon: '👑' }
    : isAdminCru
    ? { bg: 'rgba(56, 189, 248, 0.18)', border: '#38bdf8', text: '#38bdf8', icon: '🛡️' }
    : isGadik
    ? { bg: 'rgba(52, 211, 153, 0.18)', border: '#34d399', text: '#34d399', icon: '👨‍🏫' }
    : { bg: 'rgba(96, 165, 250, 0.18)', border: '#60a5fa', text: '#93c5fd', icon: '🎓' };

  const displayPangkat = user.pangkat || (user.pangkat_golongan?.split('/')[0]?.trim());
  const displayGolongan = user.golongan || (user.pangkat_golongan?.split('/')[1]?.trim());

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #06152d 0%, #0c2752 50%, #123d7a 100%)',
        borderRadius: '16px',
        border: '1px solid rgba(59, 130, 246, 0.35)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
        padding: '24px 28px',
        marginBottom: '26px',
        position: 'relative',
        overflow: 'hidden',
        color: '#ffffff',
      }}
    >
      {/* Decorative ambient background blur lights */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-30px',
          left: '20%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Left Column: Avatar + Personalized Details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
          {/* Avatar Ring */}
          <div
            style={{
              position: 'relative',
              width: '74px',
              height: '74px',
              borderRadius: '50%',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
              border: `3px solid ${roleColor.border}`,
              boxShadow: `0 0 16px ${roleColor.bg}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {user.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar_url}
                alt={user.nama_lengkap}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff' }}>
                {user.nama_lengkap ? user.nama_lengkap.slice(0, 2).toUpperCase() : 'PO'}
              </span>
            )}
          </div>

          {/* User Text Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                {greeting},
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: roleColor.bg,
                  border: `1px solid ${roleColor.border}`,
                  color: roleColor.text,
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  letterSpacing: '0.3px',
                }}
              >
                <span>{roleColor.icon}</span>
                <span>{roleTitle}</span>
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  color: '#34d399',
                  fontWeight: 700,
                  backgroundColor: 'rgba(52, 211, 153, 0.1)',
                  padding: '2px 7px',
                  borderRadius: '10px',
                  border: '1px solid rgba(52, 211, 153, 0.25)',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34d399', display: 'inline-block' }} />
                <span>Sesi Aktif</span>
              </span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(18px, 2.2vw, 22px)',
                fontWeight: 900,
                color: '#ffffff',
                margin: '0 0 4px',
                letterSpacing: '-0.3px',
                lineHeight: 1.3,
              }}
            >
              {displayPangkat ? `${displayPangkat} ` : ''}
              {displayGolongan ? (
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#fbbf24', marginRight: '6px' }}>
                  (Gol. {displayGolongan})
                </span>
              ) : null}
              {user.nama_lengkap || 'Personel Sespimma'}
            </h2>

            <div style={{ fontSize: '12.5px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 600 }}>{user.jabatan || 'Personel Sespimma Lemdiklat Polri'}</span>
              <span style={{ color: '#64748b' }}>•</span>
              <span style={{ fontFamily: 'monospace', color: '#93c5fd' }}>NRP/NIP: {user.nrp_nip}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Action Shortcuts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <Link
            href="/profil"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              fontSize: '12.5px',
              fontWeight: 700,
              padding: '9px 15px',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <span>👤 Detail Data Pengguna</span>
          </Link>

          {isSuperadmin && (
            <Link
              href="/admin/data"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                background: '#f59e0b',
                border: '1px solid #fbbf24',
                color: '#091a38',
                fontSize: '12.5px',
                fontWeight: 800,
                padding: '9px 15px',
                borderRadius: '8px',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
              }}
            >
              <span>⚙️ Pusat Kendali CMS</span>
            </Link>
          )}

          {isAdminCru && (
            <Link
              href="/admin/data"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#0284c7',
                border: '1px solid #38bdf8',
                color: '#ffffff',
                fontSize: '12.5px',
                fontWeight: 800,
                padding: '9px 15px',
                borderRadius: '8px',
                textDecoration: 'none',
              }}
            >
              <span>🛡️ Kelola Naskah (CRU)</span>
            </Link>
          )}

          <Link
            href="/search"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(37, 99, 235, 0.25)',
              border: '1px solid rgba(37, 99, 235, 0.5)',
              color: '#93c5fd',
              fontSize: '12.5px',
              fontWeight: 700,
              padding: '9px 15px',
              borderRadius: '8px',
              textDecoration: 'none',
            }}
          >
            <span>🔍 Pencarian Cepat</span>
          </Link>
        </div>
      </div>

      {/* Bottom Summary Bar: 4 Core Pillars Indicators */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginTop: '18px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              color: '#60a5fa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
            }}
          >
            📚
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>183 Modul & Hanjar</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Bahan Ajar Terverifikasi</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(168, 85, 247, 0.2)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              color: '#c084fc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
            }}
          >
            🏛️
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>2.863 Pustaka & Taskap</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Katalog Buku & Karya Siswa</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(52, 211, 153, 0.2)',
              border: '1px solid rgba(52, 211, 153, 0.4)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
            }}
          >
            👨‍🏫
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>16 Tenaga Pendidik</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Gadik Fungsional Polri</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(245, 158, 11, 0.2)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
            }}
          >
            ⏱️
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>720 JP Kurikulum</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Standar Kelulusan Sespimma</div>
          </div>
        </div>
      </div>
    </div>
  );
}

