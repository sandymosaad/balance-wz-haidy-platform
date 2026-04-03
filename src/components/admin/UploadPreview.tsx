'use client';

import Image from 'next/image';
import {Button} from '@/components/ui/Button';
import {formatFileSize} from '@/lib/admin-utils';

type UploadPreviewProps = {
  file?: File;
  preview?: string;
  onRemove: () => void;
};

export function UploadPreview({file, preview, onRemove}: UploadPreviewProps) {
  if (!file && !preview) return null;

  return (
    <div className="rounded-2xl border border-art-sage bg-art-cream p-4">
      {preview ? (
        <div className="relative mb-3 h-36 w-full overflow-hidden rounded-xl">
          <Image src={preview} alt="Upload preview" fill className="object-cover" />
        </div>
      ) : null}
      {file ? <p className="text-sm text-art-taupe">{file.name} ({formatFileSize(file.size)})</p> : null}
      <Button type="button" variant="ghost" size="sm" className="mt-3" onClick={onRemove}>
        Remove
      </Button>
    </div>
  );
}
