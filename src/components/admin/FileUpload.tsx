'use client';

import {useRef, useState} from 'react';
import {Upload} from 'lucide-react';
import {Button} from '@/components/ui/Button';
import {UploadPreview} from '@/components/admin/UploadPreview';
import {validateFile} from '@/lib/file-upload';

type FileUploadProps = {
  label: string;
  onFileSelected: (file?: File, preview?: string) => void;
  accept?: string;
};

export function FileUpload({label, onFileSelected, accept = 'image/jpeg,image/png'}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | undefined>();
  const [file, setFile] = useState<File | undefined>();

  function onPick(selected?: File) {
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
    onFileSelected(selected, objectUrl);
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
        <Button type="button" variant="outline" className="mt-3" onClick={() => inputRef.current?.click()}>
          Choose File
        </Button>
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      <UploadPreview file={file} preview={preview} onRemove={removeFile} />
    </div>
  );
}
