import React from 'react';
import { Metadata } from 'next';
import { CategoryView } from '@/components/CategoryView';

export const metadata: Metadata = {
  title: 'Kurikulum & Standar Layanan — SIPINTAR Sespimma',
  description: 'Silabus pendidikan, standar kompetensi lulusan, dan pedoman mutu layanan Sespimma.',
};

export default function KurikulumPage() {
  return <CategoryView category="Kurikulum & Standar Layanan" />;
}
