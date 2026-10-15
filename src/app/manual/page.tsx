import React from 'react';
import { Metadata } from 'next';
import { CategoryView } from '@/components/CategoryView';

export const metadata: Metadata = {
  title: 'Manual Book — SIPINTAR Sespimma',
  description: 'Manual operasional dan panduan tata kelola platform SIPINTAR untuk Serdik, Gadik, Pengelola, dan Administrator.',
};

export default function ManualPage() {
  return <CategoryView category="Manual Book" />;
}
