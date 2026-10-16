import React from 'react';
import { Metadata } from 'next';
import { LibraryDirectory } from '@/components/LibraryDirectory';

export const metadata: Metadata = {
  title: 'E-Library / Perpustakaan — SIPINTAR Sespimma',
  description:
    'Koleksi buku fisik, e-book, naskah Taskap, dan referensi kepolisian Sespimma Lemdiklat Polri dengan fitur pratinjau sampel digital dan sinopsis komprehensif.',
};

export default function LibraryPage() {
  return <LibraryDirectory />;
}

