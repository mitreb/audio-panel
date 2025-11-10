import { Link } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProductImage } from '../ProductImage';
import type { Product } from '../../types/products.types';

interface ProductsTableProps {
  products: Product[];
  onDeleteClick: (product: Product) => void;
}

export function ProductsTable({ products, onDeleteClick }: ProductsTableProps) {
  return (
    <div className="rounded-md border bg-card overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-32"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length ? (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <ProductImage
                    src={product.coverImage}
                    alt={product.name}
                    wrapperClassName="w-12 h-12"
                    className="w-full h-full"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.artist}</TableCell>
                <TableCell>
                  {new Date(product.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/update/${product.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteClick(product)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No products found.{' '}
                <Link to="/create" className="text-primary hover:underline">
                  Create your first product
                </Link>
                .
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
