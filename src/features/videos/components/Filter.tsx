'use client';

import {Filter as FilterIcon} from 'lucide-react';
import {Button} from '@/components/ui/Button';
import {Select} from '@/components/ui/Select';
import type {FilterOptions} from '@/types/components';

type FilterValue = {
  platform?: string;
  tag?: string;
  playlist?: string;
};

type FilterProps = {
  filters: FilterValue;
  onFilterChange: (filters: FilterValue) => void;
  options: FilterOptions;
};

export function Filter({filters, onFilterChange, options}: FilterProps) {
  const count = Number(Boolean(filters.platform)) + Number(Boolean(filters.tag)) + Number(Boolean(filters.playlist));

  return (
    <div className="rounded-gentle border border-art-sage bg-art-beige/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-art-taupe">
          <FilterIcon className="h-4 w-4" />
          Filters ({count})
        </div>
        <Button variant="ghost" size="sm" onClick={() => onFilterChange({})}>Clear</Button>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <Select
          label="Platform"
          options={options.platforms}
          value={filters.platform}
          onChange={(value) => onFilterChange({...filters, platform: value || undefined})}
          placeholder="All platforms"
        />
        <Select
          label="Tag"
          options={options.tags}
          value={filters.tag}
          onChange={(value) => onFilterChange({...filters, tag: value || undefined})}
          placeholder="All tags"
        />
        <Select
          label="Playlist"
          options={options.playlists}
          value={filters.playlist}
          onChange={(value) => onFilterChange({...filters, playlist: value || undefined})}
          placeholder="All playlists"
        />
      </div>
    </div>
  );
}
