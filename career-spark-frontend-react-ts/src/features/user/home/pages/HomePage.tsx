import React from 'react';
import {
  HeroSection,
  StatsSection,
  FeaturesSection,
  CTASection,
  ProcessSection,
  TestimonialsSection,
} from '@/features/user/home/components';

interface HomePageProps {
  onNavigate?: (
    page: 'home' | 'login' | 'forum' | 'news' | 'ai' | 'signup' | 'admin'
  ) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate: _ }) => {
  return (
    <div>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <ProcessSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default HomePage;
