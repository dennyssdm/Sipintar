import React from 'react';
import { Metadata } from 'next';
import { CategoryView } from '@/components/CategoryView';

export const metadata: Metadata = {
  title: 'SOP — SIPINTAR Sespimma',
  description: 'Standar Operasional Prosedur penyelenggaraan pembelajaran, evaluasi, dan sarana prasarana Sespimma.',
};

export default function SopPage() {
  return <CategoryView category="SOP" />;
}
