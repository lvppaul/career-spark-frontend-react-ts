import React from 'react';
import {
  HeroSection,
  FeaturesSection,
  CTASection,
  ProcessSection,
} from '@/features/user/home/components';

const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />

      <FeaturesSection />
      <ProcessSection />

      <CTASection />
    </div>
  );
};

export default HomePage;
