import React from 'react';
import {
  HeroSection,
  StatsSection,
  FeaturesSection,
  CTASection,
  ProcessSection,
  TestimonialsSection,
} from '@/features/user/home/components';

const HomePage: React.FC = () => {
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
