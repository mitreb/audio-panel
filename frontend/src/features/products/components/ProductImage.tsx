import { useState } from 'react';
import { Music } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ImgProps {
  src?: string | null;
  alt: string;
  className?: string;
  wrapperClassName?: string;
}

/**
 * Product image component with graceful fallback and loading state.
 * - Shows a skeleton while loading.
 * - Falls back to a placeholder if the image fails to load or if the src is not provided.
 */
export function ProductImage({
  src,
  alt,
  className,
  wrapperClassName,
}: ImgProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(!!src);

  if (!src || imageError) {
    return (
      <div className={cn('overflow-hidden rounded-md', wrapperClassName)}>
        <div className="aspect-square bg-linear-to-br from-purple-400 via-pink-400 to-red-400 flex items-center justify-center cursor-pointer">
          <Music className="h-12 w-12 text-white/80" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn('overflow-hidden rounded-md relative', wrapperClassName)}
    >
      {imageLoading && (
        <Skeleton className="absolute inset-0 z-10 h-full w-full" />
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          'object-cover',
          imageLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        onError={() => setImageError(true)}
        onLoad={() => setImageLoading(false)}
      />
    </div>
  );
}
