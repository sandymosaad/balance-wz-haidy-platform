'use client';

import {useState, useTransition} from 'react';
import {z} from 'zod';
import {Input} from '@/components/ui/Input';
import {Textarea} from '@/components/ui/Textarea';
import {Select} from '@/components/ui/Select';
import {Button} from '@/components/ui/Button';
import {Alert} from '@/components/ui/Alert';
import {FileUpload} from '@/components/admin/FileUpload';

type PlaylistInitialData = {
  title?: string;
  description?: string | null;
  content_type?: 'SERIES' | 'COURSE' | 'PLAYLIST';
  cover_image?: string;
  order?: number;
  is_published?: boolean;
};

type AddPlaylistFormProps = {
  initialData?: PlaylistInitialData;
  submitAction: (payload: {
    title: string;
    description?: string;
    content_type: 'SERIES' | 'COURSE' | 'PLAYLIST';
    cover_image?: string;
    order?: number;
    is_published: boolean;
  }) => Promise<{success: boolean; error?: {message: string}} | void>;
};

const schema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(1000).optional(),
  content_type: z.enum(['SERIES', 'COURSE', 'PLAYLIST']),
  cover_image: z.string().optional(),
  order: z.coerce.number().int().min(0).optional(),
  is_published: z.boolean().default(false)
});

export function AddPlaylistForm({initialData, submitAction}: AddPlaylistFormProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [form, setForm] = useState({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    content_type: initialData?.content_type ?? 'PLAYLIST',
    cover_image: initialData?.cover_image ?? '',
    order: initialData?.order?.toString() ?? '',
    is_published: Boolean(initialData?.is_published)
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = schema.safeParse({...form, order: form.order || undefined});
    if (!parsed.success) {
      setIsError(true);
      setMessage('Please review required fields.');
      return;
    }

    startTransition(async () => {
      const result = await submitAction(parsed.data);
      if (result && 'success' in result && !result.success) {
        setIsError(true);
        setMessage(result.error?.message ?? 'Failed to save playlist.');
        return;
      }
      setIsError(false);
      setMessage('Playlist saved successfully.');
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {message ? <Alert type={isError ? 'error' : 'success'} title={isError ? 'Error' : 'Success'} message={message} /> : null}

      <Input
        label="Title"
        value={form.title}
        onChange={(event) => setForm((prev) => ({...prev, title: event.target.value}))}
        required
      />

      <Textarea
        label="Description"
        value={form.description}
        onChange={(event) => setForm((prev) => ({...prev, description: event.target.value}))}
      />

      <Select
        label="Content Type"
        value={form.content_type}
        onChange={(value) => setForm((prev) => ({...prev, content_type: value as 'SERIES' | 'COURSE' | 'PLAYLIST'}))}
        options={[
          {label: 'Series', value: 'SERIES'},
          {label: 'Course', value: 'COURSE'},
          {label: 'Playlist', value: 'PLAYLIST'}
        ]}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Display Order"
          type="number"
          value={form.order}
          onChange={(event) => setForm((prev) => ({...prev, order: event.target.value}))}
        />
        <label className="mt-8 flex items-center gap-2 text-sm text-art-taupe">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(event) => setForm((prev) => ({...prev, is_published: event.target.checked}))}
          />
          Publish immediately
        </label>
      </div>

      <FileUpload
        label="Cover Image"
        onFileSelected={(_, preview) => setForm((prev) => ({...prev, cover_image: preview ?? ''}))}
      />

      <div className="flex flex-wrap gap-3">
        <Button type="submit" loading={isPending}>Save Playlist</Button>
        <Button type="button" variant="ghost" onClick={() => window.history.back()}>Cancel</Button>
      </div>
    </form>
  );
}
