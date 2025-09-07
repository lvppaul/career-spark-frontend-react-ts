import React from 'react';
import { Header, Footer } from '@/components';
import {
  HeroSection,
  StatsSection,
  FeaturesSection,
  CTASection,
  ProcessSection,
  TestimonialsSection,
} from '@/features/home/components';

interface HomePageProps {
  onNavigate?: (
    page: 'home' | 'login' | 'forum' | 'news' | 'ai' | 'signup' | 'admin'
  ) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen">
      <Header currentPage="home" onNavigate={onNavigate} />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <ProcessSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default HomePage;
