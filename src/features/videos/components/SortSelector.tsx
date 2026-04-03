'use client';

import {Select} from '@/components/ui/Select';

type SortSelectorProps = {
  currentSort: string;
  onSortChange: (value: string) => void;
};

const options = [
  {label: 'Newest', value: 'NEWEST'},
  {label: 'Oldest', value: 'OLDEST'},
  {label: 'Alphabetical (A-Z)', value: 'ALPHABETICAL'},
  {label: 'Trending', value: 'TRENDING'}
];

export function SortSelector({currentSort, onSortChange}: SortSelectorProps) {
  return (
    <Select
      label="Sort"
      options={options}
      value={currentSort}
      onChange={onSortChange}
      placeholder="Sort videos"
    />
  );
}
