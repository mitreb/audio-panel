import { Disc3, Upload, ListMusic } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

const features = [
  {
    icon: Upload,
    title: 'Upload Cover Art',
    description:
      'Easily upload and manage cover art for all your music products',
  },
  {
    icon: ListMusic,
    title: 'Organize Your Catalog',
    description:
      'Keep track of all your albums, singles, and releases in one place',
  },
  {
    icon: Disc3,
    title: 'Track Everything',
    description:
      'Manage artist names, product details, and metadata effortlessly',
  },
];

export function FeaturesSection() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid gap-8 md:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
}
