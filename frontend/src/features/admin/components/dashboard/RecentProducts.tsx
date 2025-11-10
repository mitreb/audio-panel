import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductImage } from '@/features/products';

interface Product {
  id: string;
  name: string;
  artist: string;
  coverImage: string | null;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

interface RecentProductsProps {
  products: Product[] | undefined;
}

export function RecentProducts({ products }: RecentProductsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Products</CardTitle>
      </CardHeader>
      <CardContent>
        {products && products.length > 0 ? (
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  <ProductImage
                    src={product.coverImage}
                    alt={product.name}
                    wrapperClassName="w-12 h-12"
                    className="w-full h-full"
                  />
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.artist}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{product.user.name}</p>
                  <p className="text-xs text-gray-500">{product.user.email}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No products yet</p>
        )}
      </CardContent>
    </Card>
  );
}
