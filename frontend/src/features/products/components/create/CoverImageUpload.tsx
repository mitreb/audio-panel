import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';

interface CoverImageUploadProps {
  selectedFile: File | null;
  previewUrl: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CoverImageUpload({
  selectedFile,
  previewUrl,
  onFileChange,
}: CoverImageUploadProps) {
  return (
    <div className="space-y-4">
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
            Selected: {selectedFile.name} (
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
    </div>
  );
}
