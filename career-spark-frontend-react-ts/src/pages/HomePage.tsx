import React from 'react';
import { Header, Footer } from '@/components/shared';
import {
  HeroSection,
  StatsSection,
  FeaturesSection,
  CTASection,
  ProcessSection,
  TestimonialsSection,
} from '@/components/home';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
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
