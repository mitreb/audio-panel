import { HeroSection, FeaturesSection, LandingFooter } from '../components';

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <LandingFooter />
    </div>
  );
}
