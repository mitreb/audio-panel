import { Link } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductImage } from '../ProductImage';
import type { Product } from '../../types/products.types';

interface ProductsGridProps {
  products: Product[];
  onDeleteClick: (product: Product) => void;
}

export function ProductsGrid({ products, onDeleteClick }: ProductsGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-card">
        <p className="text-muted-foreground">
          No products found.{' '}
          <Link to="/create" className="text-primary hover:underline">
            Create your first product
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {products.map((product) => (
        <div key={product.id} className="space-y-3 group relative">
          <div className="overflow-hidden rounded-md relative">
            <ProductImage
              src={product.coverImage}
              alt={product.name}
              wrapperClassName="w-full aspect-square"
              className="w-full h-full transition-transform group-hover:scale-105 cursor-pointer"
            />
            {/* Action buttons on the right side */}
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
              >
                <Link to={`/update/${product.id}`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeleteClick(product)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive bg-background/80 backdrop-blur-sm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <h3 className="font-medium leading-none truncate">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {product.artist}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(product.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
