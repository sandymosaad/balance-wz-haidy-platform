'use client';

import {useState, useTransition} from 'react';
import {z} from 'zod';
import {Input} from '@/components/ui/Input';
import {Textarea} from '@/components/ui/Textarea';
import {Select} from '@/components/ui/Select';
import {Button} from '@/components/ui/Button';
import {Alert} from '@/components/ui/Alert';
import {VideoCreateSchema, type VideoCreateInput} from '@/lib/validation';
import {createSourceDraft, MultiSourceInput, type SourceRowError, type SourceDraft} from '@/features/videos/components/MultiSourceInput';

type PlaylistOption = {
  id: string;
  title: string;
};

type VideoInitialData = {
  title?: string;
  description?: string | null;
  playlist_id?: string;
  tags?: string[];
  order_index?: number;
  is_published?: boolean;
  sources?: Array<{
    url: string;
    isPrimary?: boolean;
  }>;
};

type AddVideoFormProps = {
  playlists: PlaylistOption[];
  initialData?: VideoInitialData;
  submitAction: (payload: VideoCreateInput) => Promise<{success: boolean; error?: {message: string}} | void>;
};

type FormState = {
  title: string;
  playlist_id: string;
  description: string;
  tags: string;
  order_index: string;
  is_published: boolean;
};

function createInitialSources(initialData?: VideoInitialData): SourceDraft[] {
  if (!initialData?.sources?.length) {
    return [createSourceDraft(true)];
  }

  const sources = initialData.sources.map((source, index) => ({
    id: `${index}-${source.url}`,
    url: source.url,
    isPrimary: Boolean(source.isPrimary)
  }));

  if (!sources.some((source) => source.isPrimary)) {
    const firstSource = sources[0]!;
    sources[0] = {
      id: firstSource.id,
      url: firstSource.url,
      isPrimary: true
    };
  }

  return sources;
}

function mapSourceIssues(issues: z.ZodIssue[], sourceCount: number) {
  const rowErrors: SourceRowError[] = Array.from({length: sourceCount}, () => ({}));
  let message: string | null = null;

  for (const issue of issues) {
    const [root, index, field] = issue.path;

    if (root === 'sources' && typeof index === 'number') {
      const current = rowErrors[index] ?? {};
      if (field === 'url') {
        current.url = issue.message;
      } else if (field === 'platform') {
        current.platform = issue.message;
      } else {
        current.general = issue.message;
      }
      rowErrors[index] = current;
      continue;
    }

    message = issue.message;
  }

  return {rowErrors, message};
}

export function AddVideoForm({playlists, initialData, submitAction}: AddVideoFormProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [sourceErrors, setSourceErrors] = useState<SourceRowError[]>([]);
  const [form, setForm] = useState<FormState>({
    title: initialData?.title ?? '',
    playlist_id: initialData?.playlist_id ?? '',
    description: initialData?.description ?? '',
    tags: initialData?.tags?.join(', ') ?? '',
    order_index: initialData?.order_index?.toString() ?? '',
    is_published: Boolean(initialData?.is_published)
  });
  const [sources, setSources] = useState<SourceDraft[]>(createInitialSources(initialData));

  function handleFieldChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({...current, [key]: value}));
    setMessage(null);
  }

  function handleSourcesChange(nextSources: SourceDraft[]) {
    setSources(nextSources);
    setMessage(null);
  }

  function resetForm() {
    setForm({
      title: '',
      playlist_id: '',
      description: '',
      tags: '',
      order_index: '',
      is_published: false
    });
    setSources([createSourceDraft(true)]);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setSourceErrors([]);

    const payload = {
      title: form.title,
      description: form.description || undefined,
      playlist_id: form.playlist_id,
      tags: form.tags
        ? form.tags
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : [],
      order_index: form.order_index ? Number(form.order_index) : undefined,
      is_published: form.is_published,
      sources: sources.map((source) => ({
        url: source.url,
        isPrimary: source.isPrimary
      }))
    };

    const parsed = VideoCreateSchema.safeParse(payload);

    if (!parsed.success) {
      const mapped = mapSourceIssues(parsed.error.issues, sources.length);
      setSourceErrors(mapped.rowErrors);
      setIsError(true);
      setMessage(mapped.message ?? 'Please check the highlighted fields.');
      return;
    }

    startTransition(async () => {
      const result = await submitAction(parsed.data);

      if (result && 'success' in result && !result.success) {
        setIsError(true);
        setMessage(result.error?.message ?? 'Failed to save video.');
        return;
      }

      setIsError(false);
      setMessage('Video saved successfully.');

      if (!initialData) {
        resetForm();
      }
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {message ? <Alert type={isError ? 'error' : 'success'} title={isError ? 'Error' : 'Success'} message={message} /> : null}

      <Input
        label="Title"
        value={form.title}
        onChange={(event) => handleFieldChange('title', event.target.value)}
        maxLength={200}
        required
      />

      <Textarea
        label="Description"
        value={form.description}
        onChange={(event) => handleFieldChange('description', event.target.value)}
      />

      <Select
        label="Playlist"
        value={form.playlist_id}
        onChange={(value) => handleFieldChange('playlist_id', value)}
        options={playlists.map((item) => ({label: item.title, value: item.id}))}
        placeholder="Select playlist"
      />

      <MultiSourceInput sources={sources} errors={sourceErrors} onChange={handleSourcesChange} />

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Order"
          type="number"
          value={form.order_index}
          onChange={(event) => handleFieldChange('order_index', event.target.value)}
        />
        <Input
          label="Tags (comma-separated)"
          value={form.tags}
          onChange={(event) => handleFieldChange('tags', event.target.value)}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-art-taupe">
        <input
          type="checkbox"
          checked={form.is_published}
          onChange={(event) => handleFieldChange('is_published', event.target.checked)}
        />
        Publish immediately
      </label>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" loading={isPending}>Save Video</Button>
        <Button type="button" variant="ghost" onClick={() => window.history.back()}>Cancel</Button>
      </div>
    </form>
  );
}
