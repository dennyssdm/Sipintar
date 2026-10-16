'use client';

import React, { useState } from 'react';
import { ADMIN_SHORTCUTS } from '@/data/mockData';
import { AdminActionModal } from '@/components/AdminActionModal';
import HeroSection from '@/components/HeroSection';
import { HomeInfographics } from '@/components/HomeInfographics';
import { AdminShortcut } from '@/types';

export default function HomePage() {
  const [selectedShortcut, setSelectedShortcut] = useState<AdminShortcut | null>(null);

  return (
    <div>
      {/* Admin Action Modal for interactive prototype simulation */}
      <AdminActionModal
        shortcut={selectedShortcut}
        onClose={() => setSelectedShortcut(null)}
      />

      {/* 1. Hero Platform Identity & Clean Search System */}
      <HeroSection />

      {/* 2. Admin Shortcuts Strip (Pusat Kendali Tata Kelola) */}
      <section className="admin-section" aria-labelledby="admin-strip-title" style={{ marginBottom: '32px' }}>
        <div className="admin-header">
          <div>
            <h2 id="admin-strip-title" className="section-title">
              Pusat Kendali <span style={{ color: '#b45309', backgroundColor: 'rgba(245, 158, 11, 0.12)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>Administrator</span>
            </h2>
            <p className="section-subtitle">
              Pintasan cepat tata kelola data, verifikasi naskah, matriks hak akses, dan monitoring (Klik untuk simulasi alur)
            </p>
          </div>
          <span
            style={{
              fontSize: '11px',
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
            }}
          >
            Akses Tata Kelola
          </span>
        </div>

        <div className="admin-grid">
          {ADMIN_SHORTCUTS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="admin-card"
              onClick={() => setSelectedShortcut(item)}
              style={{ textAlign: 'left', cursor: 'pointer', border: '1px solid var(--color-border-subtle)' }}
              title={`Buka alur simulasi ${item.title}`}
            >
              <div className="admin-card-header">
                <span className="admin-card-title">{item.title}</span>
                {item.badgeCount ? (
                  <span
                    style={{
                      fontSize: '11px',
                      backgroundColor: 'var(--color-warning-bg)',
                      color: 'var(--color-warning)',
                      padding: '2px 7px',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 700,
                    }}
                  >
                    {item.badgeCount} Perlu Aksi
                  </span>
                ) : null}
              </div>
              <p className="admin-card-desc">{item.description}</p>
              <div style={{ marginTop: '8px', fontSize: '11.5px', color: 'var(--color-primary)', fontWeight: 600 }}>
                Lihat Alur &rarr;
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Comprehensive Executive Infographics & 8 Gateway Navigation */}
      <HomeInfographics />
    </div>
  );
}
