import { HeroSection, FeaturesSection, LandingFooter } from '../components';

export const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <LandingFooter />
    </div>
  );
};
