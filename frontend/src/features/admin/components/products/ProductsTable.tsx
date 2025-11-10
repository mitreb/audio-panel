import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { ProductImage } from '@/features/products';
import type { AdminProduct } from '../../types/admin.types';

interface ProductsTableProps {
  products: AdminProduct[];
  onDeleteClick: (productId: string, productName: string) => void;
}

export function ProductsTable({ products, onDeleteClick }: ProductsTableProps) {
  return (
    <div className="border rounded-lg bg-card overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cover</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Created</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
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
                <div>
                  <p className="font-medium">{product.user.name}</p>
                  <p className="text-xs text-gray-500">{product.user.email}</p>
                </div>
              </TableCell>
              <TableCell>
                {new Date(product.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDeleteClick(product.id, product.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
