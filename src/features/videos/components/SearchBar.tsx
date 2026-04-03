'use client';

import {Search, X} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useDebounce} from '@/hooks/use-debounce';

type SearchBarProps = {
  onSearch: (query: string) => void;
  placeholder: string;
  value?: string;
};

export function SearchBar({onSearch, placeholder, value = ''}: SearchBarProps) {
  const [query, setQuery] = useState(value);
  const debounced = useDebounce(query, 300);

  useEffect(() => {
    onSearch(debounced);
  }, [debounced, onSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-art-clay" />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-art-sage bg-art-cream px-11 py-3 text-art-taupe outline-none focus:border-art-terracotta focus:ring-2 focus:ring-art-gold/40"
        aria-label={placeholder}
      />
      {query ? (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-art-clay"
          onClick={() => setQuery('')}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
