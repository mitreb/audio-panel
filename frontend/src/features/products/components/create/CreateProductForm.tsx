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
import { CoverImageUpload } from './CoverImageUpload';
import type { UseFormReturn } from 'react-hook-form';
import type { CreateProductFormData } from '../../hooks/useCreateProductPage';

interface CreateProductFormProps {
  form: UseFormReturn<CreateProductFormData>;
  onSubmit: (data: CreateProductFormData) => void;
  selectedFile: File | null;
  previewUrl: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  createProductMutation: {
    error: Error | null;
    isPending: boolean;
  };
}

export function CreateProductForm({
  form,
  onSubmit,
  selectedFile,
  previewUrl,
  onFileChange,
  createProductMutation,
}: CreateProductFormProps) {
  return (
    <>
      {createProductMutation.error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            {createProductMutation.error.message}
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

          <FormField
            control={form.control}
            name="coverImage"
            render={() => (
              <FormItem>
                <FormLabel>Cover Image</FormLabel>
                <FormControl>
                  <CoverImageUpload
                    selectedFile={selectedFile}
                    previewUrl={previewUrl}
                    onFileChange={onFileChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="ghost" asChild className="flex-1">
              <Link to="/dashboard">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={createProductMutation.isPending}
              className="flex-1"
            >
              {createProductMutation.isPending
                ? 'Creating...'
                : 'Create Product'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
