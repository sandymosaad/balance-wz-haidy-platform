'use client';

import {useMemo, useState} from 'react';
import type {Playlist, Video} from '@prisma/client';
import {Filter} from '@/features/videos/components/Filter';
import {SearchBar} from '@/features/videos/components/SearchBar';
import {SortSelector} from '@/features/videos/components/SortSelector';
import {VideoGrid} from '@/features/videos/components/VideoGrid';

type VideoWithPlaylist = Video & {playlist?: Pick<Playlist, 'slug' | 'title' | 'id'>};

type VideosLibraryProps = {
  videos: VideoWithPlaylist[];
  playlists: Pick<Playlist, 'id' | 'title' | 'slug'>[];
  dictionary: {
    searchPlaceholder: string;
  };
};

function sortVideos(videos: VideoWithPlaylist[], sort: string) {
  const copy = [...videos];
  if (sort === 'OLDEST') return copy.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
  if (sort === 'ALPHABETICAL') return copy.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === 'TRENDING') return copy.sort((a, b) => b.viewCount - a.viewCount);
  return copy.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function VideosLibrary({videos, playlists, dictionary}: VideosLibraryProps) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('NEWEST');
  const [filters, setFilters] = useState<{platform?: string; tag?: string; playlist?: string}>({});

  const allTags = useMemo(() => {
    const set = new Set<string>();
    videos.forEach((video) => video.tags.forEach((tag) => set.add(tag)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [videos]);

  const filtered = useMemo(() => {
    const queried = videos.filter((video) => {
      const bySearch =
        !query ||
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        (video.description ?? '').toLowerCase().includes(query.toLowerCase());
      const byPlatform = !filters.platform || video.platform === filters.platform;
      const byTag = !filters.tag || video.tags.includes(filters.tag);
      const byPlaylist = !filters.playlist || video.playlistId === filters.playlist;
      return bySearch && byPlatform && byTag && byPlaylist;
    });

    return sortVideos(queried, sort);
  }, [videos, query, filters, sort]);

  return (
    <div className="space-y-6">
      <SearchBar onSearch={setQuery} placeholder={dictionary.searchPlaceholder} value={query} />
      <Filter
        filters={filters}
        onFilterChange={setFilters}
        options={{
          platforms: [
            {label: 'YouTube', value: 'YOUTUBE'},
            {label: 'Instagram', value: 'INSTAGRAM'},
            {label: 'TikTok', value: 'TIKTOK'}
          ],
          tags: allTags.map((tag) => ({label: tag, value: tag})),
          playlists: playlists.map((playlist) => ({label: playlist.title, value: playlist.id}))
        }}
      />
      <div className="max-w-xs">
        <SortSelector currentSort={sort} onSortChange={setSort} />
      </div>
      <VideoGrid videos={filtered} />
    </div>
  );
}
