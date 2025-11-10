import { Link, Navigate } from 'react-router-dom';
import { useUpdateProductPage } from '../hooks';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UpdateProductForm } from '../components';
import { ArrowLeft, Loader2 } from 'lucide-react';

export const UpdateProductPage = () => {
  const {
    form,
    product,
    isLoading,
    queryError,
    selectedFile,
    previewUrl,
    updateProductMutation,
    handleFileChange,
    onSubmit,
  } = useUpdateProductPage();

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
          <UpdateProductForm
            form={form}
            onSubmit={onSubmit}
            product={product}
            selectedFile={selectedFile}
            previewUrl={previewUrl}
            onFileChange={handleFileChange}
            updateProductMutation={updateProductMutation}
          />
        </CardContent>
      </Card>
    </div>
  );
};
