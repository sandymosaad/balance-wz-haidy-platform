'use client';

import {useRef, useState} from 'react';
import {Upload} from 'lucide-react';
import {Button} from '@/components/ui/Button';
import {UploadPreview} from '@/components/admin/UploadPreview';
import {uploadFileToServer, validateFile} from '@/lib/file-upload';

type FileUploadProps = {
  label: string;
  onFileSelected: (file?: File, preview?: string) => void;
  onUploadStateChange?: (uploading: boolean) => void;
  accept?: string;
};

export function FileUpload({label, onFileSelected, onUploadStateChange, accept = 'image/jpeg,image/png,image/webp'}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | undefined>();
  const [file, setFile] = useState<File | undefined>();
  const [uploading, setUploading] = useState(false);

  async function onPick(selected?: File) {
    if (!selected) return;
    const validation = validateFile(selected);
    if (!validation.ok) {
      setError(validation.error ?? 'Invalid file.');
      return;
    }

    const objectUrl = URL.createObjectURL(selected);
    setError(null);
    setFile(selected);
    setPreview(objectUrl);

    try {
      setUploading(true);
      onUploadStateChange?.(true);
      const persistedUrl = await uploadFileToServer(selected);
      onFileSelected(selected, persistedUrl);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Image upload failed.');
      onFileSelected(selected, undefined);
    } finally {
      setUploading(false);
      onUploadStateChange?.(false);
    }
  }

  function removeFile() {
    setFile(undefined);
    setPreview(undefined);
    setError(null);
    onFileSelected(undefined, undefined);
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-art-charcoal">{label}</label>
      <div className="rounded-2xl border border-dashed border-art-sage bg-art-beige/40 p-5 text-center">
        <Upload className="mx-auto mb-2 h-5 w-5 text-art-clay" />
        <p className="text-sm text-art-taupe">Drag and drop or choose an image</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => onPick(event.target.files?.[0])}
        />
        <Button
          type="button"
          variant="outline"
          className="mt-3"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Choose File'}
        </Button>
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      <UploadPreview file={file} preview={preview} onRemove={removeFile} />
    </div>
  );
}
