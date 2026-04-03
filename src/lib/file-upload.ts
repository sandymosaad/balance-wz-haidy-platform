import {ALLOWED_FILE_TYPES, FILE_SIZE_LIMITS} from '@/lib/admin-constants';

export function validateFile(file: File): {ok: boolean; error?: string} {
  if (!ALLOWED_FILE_TYPES.includes(file.type as (typeof ALLOWED_FILE_TYPES)[number])) {
    return {ok: false, error: 'Only JPG and PNG files are allowed.'};
  }

  if (file.size > FILE_SIZE_LIMITS.image) {
    return {ok: false, error: 'File is too large. Maximum size is 5MB.'};
  }

  return {ok: true};
}

export async function uploadFileToServer(file: File): Promise<string> {
  // MVP: store as object URL for preview-like behavior.
  return Promise.resolve(URL.createObjectURL(file));
}

export async function generateThumbnail(imageFile: File): Promise<Blob> {
  const bitmap = await createImageBitmap(imageFile);
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 300;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context unavailable.');
  }

  ctx.drawImage(bitmap, 0, 0, 300, 300);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Thumbnail generation failed.'));
        return;
      }
      resolve(blob);
    }, 'image/jpeg', 0.85);
  });
}
