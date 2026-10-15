import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppShell } from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'SiPINTAR — Sistem Informasi Pembelajaran INovatif Terpadu, Adaptif, dan Responsif',
  description: 'SiPINTAR: Sistem Informasi Pembelajaran INovatif Terpadu, Adaptif, dan Responsif. Mengintegrasikan Pengetahuan, Mengaselerasikan Kepemimpinan — Sespimma Lemdiklat Polri.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
