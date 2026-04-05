'use client';

import {PlusCircle, X} from 'lucide-react';
import type {VideoPlatform} from '@prisma/client';
import {Button} from '@/components/ui/Button';
import {Input} from '@/components/ui/Input';
import {Badge} from '@/components/ui/Badge';
import {detectPlatform, getPlatformLabel} from '@/lib/video-platform';
import {PlatformIcon} from '@/features/videos/components/PlatformIcon';

export type SourceDraft = {
  id: string;
  url: string;
  isPrimary: boolean;
};

export type SourceRowError = {
  url?: string;
  platform?: string;
  general?: string;
};

type MultiSourceInputProps = {
  sources: SourceDraft[];
  errors?: SourceRowError[];
  onChange: (sources: SourceDraft[]) => void;
};

function createSourceDraft(isPrimary = false): SourceDraft {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    url: '',
    isPrimary
  };
}

function getDetectedPlatform(url: string): VideoPlatform | null {
  if (!url.trim()) {
    return null;
  }

  try {
    return detectPlatform(url);
  } catch {
    return null;
  }
}

export function MultiSourceInput({sources, errors = [], onChange}: MultiSourceInputProps) {
  const updateSource = (sourceId: string, patch: Partial<SourceDraft>) => {
    onChange(sources.map((source) => (source.id === sourceId ? {...source, ...patch} : source)));
  };

  const addSource = () => {
    onChange([...sources, createSourceDraft(sources.length === 0)]);
  };

  const removeSource = (sourceId: string) => {
    const next = sources.filter((source) => source.id !== sourceId);
    if (next.length && !next.some((source) => source.isPrimary)) {
      next[0] = {
        id: next[0]!.id,
        url: next[0]!.url,
        isPrimary: true
      };
    }
    onChange(next.length ? next : [createSourceDraft(true)]);
  };

  const setPrimary = (sourceId: string) => {
    onChange(sources.map((source) => ({...source, isPrimary: source.id === sourceId})));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-art-charcoal">Platforms</p>
          <p className="text-sm text-art-taupe">Add one or more links for the same video.</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addSource}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add platform link
        </Button>
      </div>

      <div className="space-y-4">
        {sources.map((source, index) => {
          const detectedPlatform = getDetectedPlatform(source.url);
          const error = errors[index];

          return (
            <div key={source.id} className="rounded-2xl border border-art-sage bg-white p-4 shadow-sm">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm font-medium text-art-charcoal">
                  <input
                    type="radio"
                    name="primary-platform"
                    checked={source.isPrimary}
                    onChange={() => setPrimary(source.id)}
                    className="h-4 w-4 accent-art-terracotta"
                  />
                  Primary platform
                </label>

                <button
                  type="button"
                  onClick={() => removeSource(source.id)}
                  className="inline-flex items-center gap-1 text-sm text-art-terracotta hover:text-art-charcoal"
                  aria-label="Remove platform link"
                >
                  <X className="h-4 w-4" /> Remove
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-start">
                <div className="space-y-2">
                  <Input
                    label="Platform URL"
                    value={source.url}
                    onChange={(event) => updateSource(source.id, {url: event.target.value})}
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                  />
                  {error?.url ? <p className="text-sm text-red-600">{error.url}</p> : null}
                  {error?.platform ? <p className="text-sm text-red-600">{error.platform}</p> : null}
                  {error?.general ? <p className="text-sm text-red-600">{error.general}</p> : null}
                </div>

                <div className="flex flex-col gap-2 md:items-end">
                  {detectedPlatform ? (
                    <PlatformIcon platform={detectedPlatform} label={getPlatformLabel(detectedPlatform)} showLabel />
                  ) : source.url.trim() ? (
                    <Badge variant="warning">Unsupported platform</Badge>
                  ) : (
                    <Badge variant="secondary">Platform auto-detected</Badge>
                  )}
                  {source.isPrimary ? <Badge variant="primary">Primary</Badge> : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export {createSourceDraft};