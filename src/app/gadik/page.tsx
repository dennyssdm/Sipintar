import React from 'react';
import { Metadata } from 'next';
import { GadikDirectory } from '@/components/GadikDirectory';

export const metadata: Metadata = {
  title: 'Gadik & Kompetensi — SIPINTAR Sespimma',
  description:
    'Direktori resmi nominatif anggota Polri (Fungsional) dan Tenaga Pendidik Sespimma Sespim Lemdiklat Polri Bulan Oktober 2026.',
};

export default function GadikPage() {
  return <GadikDirectory />;
}

