import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCardStub } from './ProductCardStub';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-md relative">
        {imageError || !product.coverImage ? (
          <ProductCardStub />
        ) : (
          <>
            {imageLoading && (
              <Skeleton className="aspect-square absolute inset-0 z-10" />
            )}
            <img
              src={product.coverImage}
              alt={`${product.name} cover`}
              className={`aspect-square object-cover transition-all hover:scale-105 cursor-pointer ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          </>
        )}
      </div>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{product.name}</h3>
        <p className="text-xs text-muted-foreground">{product.artist}</p>
      </div>
    </div>
  );
};
