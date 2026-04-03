import type {Playlist} from '@prisma/client';
import {Grid} from '@/components/layout/Grid';
import {Alert} from '@/components/ui/Alert';
import {Skeleton} from '@/components/ui/Skeleton';
import {PlaylistCard} from '@/features/playlists/components/PlaylistCard';

type PlaylistWithCount = Playlist & {_count?: {videos: number}};

type PlaylistGridProps = {
  playlists: PlaylistWithCount[];
  loading?: boolean;
  error?: string | null;
};

export function PlaylistGrid({playlists, loading, error}: PlaylistGridProps) {
  if (loading) {
    return (
      <Grid cols={3}>
        {Array.from({length: 6}).map((_, index) => (
          <Skeleton key={index} height="260px" className="rounded-gentle" />
        ))}
      </Grid>
    );
  }

  if (error) {
    return <Alert type="error" title="Error" message={error} />;
  }

  if (!playlists.length) {
    return <Alert type="info" title="No playlists" message="No playlists published yet." />;
  }

  return (
    <Grid cols={3}>
      {playlists.map((playlist) => (
        <PlaylistCard
          key={playlist.id}
          playlist={playlist}
          videoCount={playlist._count?.videos ?? 0}
          href={`/videos/${playlist.slug}`}
        />
      ))}
    </Grid>
  );
}
