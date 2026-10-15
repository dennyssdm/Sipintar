import React from 'react';
import { Metadata } from 'next';
import { CategoryView } from '@/components/CategoryView';

export const metadata: Metadata = {
  title: 'Modul & Hanjar — SIPINTAR Sespimma',
  description: 'Koleksi bahan ajar pokok, modul pelatihan, bahan tayang, dan materi peserta didik Sespimma.',
};

export default function ModulPage() {
  return <CategoryView category="Modul & Hanjar" />;
}
