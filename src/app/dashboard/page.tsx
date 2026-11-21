'use client';

import React from 'react';
import PersonalizedWelcomeBanner from '@/components/PersonalizedWelcomeBanner';
import HeroSection from '@/components/HeroSection';
import { EcosystemChartSection } from '@/components/EcosystemChartSection';
import { HomeInfographics } from '@/components/HomeInfographics';

export default function DashboardPage() {
  return (
    <div>
      {/* 1. Personalized Welcome & Institutional Identity HUD */}
      <PersonalizedWelcomeBanner />

      {/* 2. Hero Platform Identity & Clean Search System */}
      <HeroSection />

      {/* 3. Interactive Ecosystem Chart & Visual Analytics Dashboard */}
      <EcosystemChartSection />

      {/* 4. Comprehensive Executive Infographics & 8 Gateway Navigation */}
      <HomeInfographics />
    </div>
  );
}

