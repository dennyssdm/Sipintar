import React from 'react';
import { Metadata } from 'next';
import { CategoryView } from '@/components/CategoryView';

export const metadata: Metadata = {
  title: 'E-Library / Perpustakaan — SIPINTAR Sespimma',
  description: 'Koleksi buku fisik, e-book, karya tulis kepolisian (Taskap), dan referensi ilmiah perpustakaan Sespimma.',
};

export default function LibraryPage() {
  return <CategoryView category="E-Library/Perpustakaan" />;
}
