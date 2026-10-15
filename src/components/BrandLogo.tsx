import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  clickable?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  clickable = true,
}) => {
  const height = size === 'sm' ? 34 : size === 'lg' ? 56 : 44;
  const width = Math.round(height * 3.29);

  const content = (
    <div
      className="brand-logo-wrapper"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 8px',
        borderRadius: 'var(--radius-md)',
        transition: 'all var(--transition-fast)',
      }}
    >
      <Image
        src="/logo-sipintar.webp"
        alt="SiPINTAR - Sistem Informasi Pembelajaran INovatif Terpadu, Adaptif, dan Responsif"
        width={width}
        height={height}
        priority
        style={{
          width: 'auto',
          height: `${height}px`,
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  );

  if (clickable) {
    return (
      <Link href="/" aria-label="SiPINTAR Beranda" style={{ display: 'inline-block' }}>
        {content}
      </Link>
    );
  }

  return content;
};
