import { Link } from 'react-router-dom';
import { useCreateProductPage } from '../hooks';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CreateProductForm } from '../components';
import { ArrowLeft } from 'lucide-react';

export const CreateProductPage = () => {
  const {
    form,
    selectedFile,
    previewUrl,
    createProductMutation,
    handleFileChange,
    onSubmit,
  } = useCreateProductPage();

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
          <CardTitle className="text-2xl">Create New Product</CardTitle>
          <CardDescription>
            Add a new music product to your collection. Fill in the details
            below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateProductForm
            form={form}
            onSubmit={onSubmit}
            selectedFile={selectedFile}
            previewUrl={previewUrl}
            onFileChange={handleFileChange}
            createProductMutation={createProductMutation}
          />
        </CardContent>
      </Card>
    </div>
  );
};
