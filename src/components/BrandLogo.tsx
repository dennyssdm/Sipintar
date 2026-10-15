import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  customHeight?: number;
  showSubtitle?: boolean;
  clickable?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  customHeight,
  clickable = true,
}) => {
  const getHeight = () => {
    if (customHeight) return customHeight;
    switch (size) {
      case 'sm':
        return 34;
      case 'lg':
        return 56;
      case 'xl':
        return 72;
      case '2xl':
        return 88;
      case 'md':
      default:
        return 44;
    }
  };

  const height = getHeight();
  const width = Math.round(height * 3.29);

  const content = (
    <div
      className="brand-logo-wrapper"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: size === '2xl' || size === 'xl' ? '6px 14px' : '4px 8px',
        borderRadius: 'var(--radius-md)',
        transition: 'all var(--transition-fast)',
      }}
    >
      <Image
        src="/Logo Sipintar OK.png"
        alt="SiPINTAR - Sistem Informasi Pembelajaran INovatif Terpadu, Adaptif, dan Responsif"
        width={width}
        height={height}
        priority
        style={{
          width: 'auto',
          maxWidth: '100%',
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
