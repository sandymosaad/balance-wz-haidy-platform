import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {NextResponse} from 'next/server';

export const runtime = 'nodejs';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

function getExtension(file: File): string {
  if (file.type === 'image/png') return 'png';
  if (file.type === 'image/webp') return 'webp';
  return 'jpg';
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({error: 'File is required.'}, {status: 400});
    }

    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json({error: 'Unsupported file type.'}, {status: 400});
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({error: 'Image exceeds 5MB limit.'}, {status: 400});
    }

    const extension = getExtension(file);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
    const relativeDir = path.join('uploads', 'playlists');
    const absoluteDir = path.join(process.cwd(), 'public', relativeDir);

    await mkdir(absoluteDir, {recursive: true});

    const targetPath = path.join(absoluteDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(targetPath, buffer);

    const publicUrl = `/${relativeDir.replaceAll('\\', '/')}/${filename}`;
    return NextResponse.json({url: publicUrl}, {status: 200});
  } catch {
    return NextResponse.json({error: 'Failed to upload image.'}, {status: 500});
  }
}
