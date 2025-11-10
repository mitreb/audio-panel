import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import type { Product } from '../../types/products.types';

interface UpdateCoverImageUploadProps {
  product: Product;
  selectedFile: File | null;
  previewUrl: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function UpdateCoverImageUpload({
  product,
  selectedFile,
  previewUrl,
  onFileChange,
}: UpdateCoverImageUploadProps) {
  return (
    <div className="space-y-4">
      <Label htmlFor="coverImage">Cover Image</Label>

      {/* Show current image if it exists */}
      {product.coverImage && !selectedFile && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Current image:</p>
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
          onChange={onFileChange}
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
  );
}
