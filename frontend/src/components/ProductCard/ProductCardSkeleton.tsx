import { Skeleton } from '@/components/ui/skeleton';

export const ProductCardSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="aspect-square rounded-md" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  </div>
);
