import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, Navigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useProduct, useUpdateProduct } from '../hooks';
import type { UpdateProductData } from '../types/products.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Upload, ArrowLeft, Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .max(100, 'Product name must be less than 100 characters'),
  artist: z
    .string()
    .min(1, 'Artist name is required')
    .max(100, 'Artist name must be less than 100 characters'),
  coverImage: z.instanceof(File).optional(),
});

type FormData = z.infer<typeof formSchema>;

export const UpdateProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: product, isLoading, error: queryError } = useProduct(id);
  const updateProductMutation = useUpdateProduct();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      artist: '',
    },
  });

  // Load product data into form when it's available
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        artist: product.artist,
      });
    }
  }, [product, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);

    // Clean up previous preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (file) {
      // Create preview URL for the selected image
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      form.setValue('coverImage', file);
    } else {
      setPreviewUrl(null);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!id) {
      return;
    }

    // Validate that cover image is selected
    if (!selectedFile) {
      return;
    }

    const updateData: UpdateProductData = {
      name: data.name,
      artist: data.artist,
      coverImage: selectedFile,
    };

    try {
      await updateProductMutation.mutateAsync({ id, data: updateData });
      navigate('/'); // Navigate back to product list
    } catch (err) {
      // Error is handled by React Query
      console.error('Failed to update product:', err);
    }
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading product...</span>
        </div>
      </div>
    );
  }

  if (queryError || !product) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Update Product</CardTitle>
          <CardDescription>
            Update the details of "{product.name}" by {product.artist}.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                      <Input
                        placeholder="e.g., Dark Side of the Moon"
                        {...field}
                      />
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

              <div className="space-y-4">
                <Label htmlFor="coverImage">Cover Image</Label>

                {/* Show current image if it exists */}
                {product.coverImage && !selectedFile && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Current image:
                    </p>
                    <div className="relative">
                      <img
                        src={product.coverImage}
                        alt={`${product.name} cover`}
                        className="w-32 h-32 object-cover rounded-md border border-border"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <Input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>

                {selectedFile && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      New image: {selectedFile.name} (
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                    {previewUrl && (
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-md border border-border"
                        />
                      </div>
                    )}
                  </div>
                )}

                {!product.coverImage && !selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    No image currently set. Upload one to add a cover image.
                  </p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  asChild
                  className="flex-1"
                >
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
        </CardContent>
      </Card>
    </div>
  );
};
