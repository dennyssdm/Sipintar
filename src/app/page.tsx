'use client';

import React from 'react';
import HeroSection from '@/components/HeroSection';
import { EcosystemChartSection } from '@/components/EcosystemChartSection';
import { HomeInfographics } from '@/components/HomeInfographics';

export default function HomePage() {
  return (
    <div>
      {/* 1. Hero Platform Identity & Clean Search System */}
      <HeroSection />

      {/* 2. Interactive Ecosystem Chart & Visual Analytics Dashboard */}
      <EcosystemChartSection />

      {/* 3. Comprehensive Executive Infographics & 8 Gateway Navigation */}
      <HomeInfographics />
    </div>
  );
}
