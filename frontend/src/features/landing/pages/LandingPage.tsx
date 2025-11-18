import { Seo } from '@/components';
import { HeroSection, FeaturesSection, LandingFooter } from '../components';

export function LandingPage() {
  return (
    <>
      <Seo noIndex={false} />
      <div className="flex flex-col min-h-screen">
        <HeroSection />
        <FeaturesSection />
        <LandingFooter />
      </div>
    </>
  );
}
