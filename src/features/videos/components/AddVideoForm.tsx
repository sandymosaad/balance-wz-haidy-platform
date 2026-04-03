'use client';

import {useMemo, useState, useTransition} from 'react';
import {z} from 'zod';
import {Input} from '@/components/ui/Input';
import {Textarea} from '@/components/ui/Textarea';
import {Select} from '@/components/ui/Select';
import {Button} from '@/components/ui/Button';
import {Alert} from '@/components/ui/Alert';
import {extractVideoId, detectPlatform, getThumbnailUrl} from '@/lib/video-platform';

type PlaylistOption = {
  id: string;
  title: string;
};

type VideoInitialData = {
  title?: string;
  description?: string | null;
  video_url?: string;
  playlist_id?: string;
  tags?: string[];
  order_index?: number;
  is_published?: boolean;
};

type AddVideoFormProps = {
  playlists: PlaylistOption[];
  initialData?: VideoInitialData;
  submitAction: (payload: {
    title: string;
    description?: string;
    video_url: string;
    playlist_id: string;
    tags: string[];
    order_index?: number;
    is_published: boolean;
  }) => Promise<{success: boolean; error?: {message: string}} | void>;
};

const schema = z.object({
  title: z.string().min(3).max(200),
  video_url: z.string().url(),
  playlist_id: z.string().min(1),
  description: z.string().max(2000).optional(),
  tags: z.string().optional(),
  order_index: z.coerce.number().int().min(0).optional(),
  is_published: z.boolean().default(false)
});

export function AddVideoForm({playlists, initialData, submitAction}: AddVideoFormProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [form, setForm] = useState({
    title: initialData?.title ?? '',
    video_url: initialData?.video_url ?? '',
    playlist_id: initialData?.playlist_id ?? '',
    description: initialData?.description ?? '',
    tags: initialData?.tags?.join(', ') ?? '',
    order_index: initialData?.order_index?.toString() ?? '',
    is_published: Boolean(initialData?.is_published)
  });

  const preview = useMemo(() => {
    if (!form.video_url) return null;
    try {
      const platform = detectPlatform(form.video_url);
      const videoId = extractVideoId(form.video_url, platform);
      return {
        platform,
        videoId,
        thumbnail: getThumbnailUrl(platform, videoId)
      };
    } catch {
      return null;
    }
  }, [form.video_url]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const parsed = schema.safeParse({
      ...form,
      order_index: form.order_index || undefined
    });

    if (!parsed.success) {
      setIsError(true);
      setMessage('Please check the highlighted fields.');
      return;
    }

    startTransition(async () => {
      const result = await submitAction({
        ...parsed.data,
        tags: parsed.data.tags ? parsed.data.tags.split(',').map((item) => item.trim()).filter(Boolean) : []
      });

      if (result && 'success' in result && !result.success) {
        setIsError(true);
        setMessage(result.error?.message ?? 'Failed to save video.');
        return;
      }

      setIsError(false);
      setMessage('Video saved successfully.');
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {message ? <Alert type={isError ? 'error' : 'success'} title={isError ? 'Error' : 'Success'} message={message} /> : null}

      <Input
        label="Video URL"
        value={form.video_url}
        onChange={(event) => setForm((prev) => ({...prev, video_url: event.target.value}))}
        placeholder="https://www.youtube.com/watch?v=..."
        required
      />
      <Input
        label="Title"
        value={form.title}
        onChange={(event) => setForm((prev) => ({...prev, title: event.target.value}))}
        maxLength={200}
        required
      />
      <Textarea
        label="Description"
        value={form.description}
        onChange={(event) => setForm((prev) => ({...prev, description: event.target.value}))}
      />
      <Select
        label="Playlist"
        value={form.playlist_id}
        onChange={(value) => setForm((prev) => ({...prev, playlist_id: value}))}
        options={playlists.map((item) => ({label: item.title, value: item.id}))}
        placeholder="Select playlist"
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Order"
          type="number"
          value={form.order_index}
          onChange={(event) => setForm((prev) => ({...prev, order_index: event.target.value}))}
        />
        <Input
          label="Tags (comma-separated)"
          value={form.tags}
          onChange={(event) => setForm((prev) => ({...prev, tags: event.target.value}))}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-art-taupe">
        <input
          type="checkbox"
          checked={form.is_published}
          onChange={(event) => setForm((prev) => ({...prev, is_published: event.target.checked}))}
        />
        Publish immediately
      </label>

      {preview ? (
        <div className="rounded-2xl border border-art-sage bg-art-beige/50 p-4 text-sm text-art-taupe">
          <p><strong>Platform:</strong> {preview.platform}</p>
          <p><strong>Video ID:</strong> {preview.videoId}</p>
          <p className="truncate"><strong>Thumbnail:</strong> {preview.thumbnail}</p>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" loading={isPending}>Save Video</Button>
        <Button type="button" variant="ghost" onClick={() => window.history.back()}>Cancel</Button>
      </div>
    </form>
  );
}
