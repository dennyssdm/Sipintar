import React from 'react';
import { Metadata } from 'next';
import { CategoryView } from '@/components/CategoryView';

export const metadata: Metadata = {
  title: 'Pedoman — SIPINTAR Sespimma',
  description: 'Pedoman akademik, petunjuk teknis penulisan Taskap, dan regulasi internal Sespimma.',
};

export default function PedomanPage() {
  return <CategoryView category="Pedoman" />;
}
