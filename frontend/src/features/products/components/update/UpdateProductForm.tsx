import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UpdateCoverImageUpload } from './UpdateCoverImageUpload';
import type { UseFormReturn } from 'react-hook-form';
import type { UpdateProductFormData } from '../../hooks/useUpdateProductPage';
import type { Product } from '../../types/products.types';

interface UpdateProductFormProps {
  form: UseFormReturn<UpdateProductFormData>;
  onSubmit: (data: UpdateProductFormData) => void;
  product: Product;
  selectedFile: File | null;
  previewUrl: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateProductMutation: {
    error: Error | null;
    isPending: boolean;
  };
}

export function UpdateProductForm({
  form,
  onSubmit,
  product,
  selectedFile,
  previewUrl,
  onFileChange,
  updateProductMutation,
}: UpdateProductFormProps) {
  return (
    <>
      {updateProductMutation.error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            {updateProductMutation.error.message}
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Dark Side of the Moon" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="artist"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Artist Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Pink Floyd" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <UpdateCoverImageUpload
            product={product}
            selectedFile={selectedFile}
            previewUrl={previewUrl}
            onFileChange={onFileChange}
          />

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="ghost" asChild className="flex-1">
              <Link to="/dashboard">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={updateProductMutation.isPending}
              className="flex-1"
            >
              {updateProductMutation.isPending
                ? 'Updating...'
                : 'Update Product'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
