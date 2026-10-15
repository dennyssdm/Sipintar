import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'max';
  customHeight?: number;
  showSubtitle?: boolean;
  clickable?: boolean;
  className?: string;
  fluid?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  customHeight,
  clickable = true,
  className = '',
  fluid = false,
}) => {
  const isMax = size === 'max' || fluid;

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
      case 'max':
        return 164;
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
        display: isMax ? 'flex' : 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: isMax ? '100%' : 'auto',
        maxWidth: '100%',
        padding: isMax ? '8px 12px' : size === '2xl' || size === 'xl' ? '6px 12px' : '4px 8px',
        borderRadius: 'var(--radius-md)',
        transition: 'all var(--transition-fast)',
      }}
    >
      <Image
        src="/Logo Sipintar OK.webp"
        alt="SiPINTAR - Sistem Informasi Pembelajaran INovatif Terpadu, Adaptif, dan Responsif"
        width={isMax ? 2422 : width}
        height={isMax ? 736 : height}
        priority
        className={`brand-logo-img brand-logo-img-${size}`}
        sizes={
          isMax
            ? '(max-width: 640px) 100vw, (max-width: 1024px) 500px, 560px'
            : size === '2xl'
            ? '(max-width: 480px) 180px, (max-width: 768px) 220px, 290px'
            : '(max-width: 768px) 140px, 180px'
        }
        style={{
          width: isMax ? '100%' : 'auto',
          maxWidth: isMax ? '540px' : '100%',
          height: isMax ? 'auto' : `${height}px`,
          aspectRatio: isMax ? '2422 / 736' : undefined,
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  );

  if (clickable) {
    return (
      <Link href="/" aria-label="SiPINTAR Beranda" style={{ display: isMax ? 'block' : 'inline-block', width: isMax ? '100%' : 'auto', maxWidth: '100%' }}>
        {content}
      </Link>
    );
  }

  return content;
};
