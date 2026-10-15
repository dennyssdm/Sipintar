import React from 'react';
import { Metadata } from 'next';
import { CategoryView } from '@/components/CategoryView';

export const metadata: Metadata = {
  title: 'Gadik & Kompetensi — SIPINTAR Sespimma',
  description: 'Direktori profil tenaga pendidik (Gadik), rekam kepakaran, dan bidang ajar Sespimma.',
};

export default function GadikPage() {
  return <CategoryView category="Gadik & Kompetensi" />;
}
