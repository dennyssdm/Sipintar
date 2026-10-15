import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  customHeight?: number;
  showSubtitle?: boolean;
  clickable?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  customHeight,
  clickable = true,
  className = '',
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
      className={`brand-logo-wrapper brand-logo-wrapper-${size} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: size === '2xl' || size === 'xl' ? '6px 12px' : '4px 8px',
        borderRadius: 'var(--radius-md)',
        maxWidth: '100%',
        transition: 'all var(--transition-fast)',
      }}
    >
      <Image
        src="/Logo Sipintar OK.webp"
        alt="SiPINTAR - Sistem Informasi Pembelajaran INovatif Terpadu, Adaptif, dan Responsif"
        width={width}
        height={height}
        priority
        className={`brand-logo-img brand-logo-img-${size}`}
        sizes={
          size === '2xl'
            ? '(max-width: 480px) 180px, (max-width: 768px) 220px, 290px'
            : '(max-width: 768px) 140px, 180px'
        }
        style={{
          width: 'auto',
          maxWidth: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  );

  if (clickable) {
    return (
      <Link href="/" aria-label="SiPINTAR Beranda" style={{ display: 'inline-block', maxWidth: '100%' }}>
        {content}
      </Link>
    );
  }

  return content;
};
