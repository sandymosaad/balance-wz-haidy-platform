import {notFound} from 'next/navigation';
import {db} from '@/lib/db';
import {Heading} from '@/components/ui/Heading';
import {Text} from '@/components/ui/Text';
import {AddVideoForm} from '@/features/videos/components/AddVideoForm';
import {updateVideoAction} from '@/server/actions/admin-video.actions';
import type {Video} from '@/types';

export default async function EditVideoPage({params}: {params: {videoId: string}}) {
  const [video, playlists] = await Promise.all([
    (db.video.findUnique({
      where: {id: params.videoId},
      include: {
        sources: {
          orderBy: [{isPrimary: 'desc'}, {createdAt: 'asc'}]
        }
      }
    } as never) as Promise<Video | null>),
    db.playlist.findMany({select: {id: true, title: true}, orderBy: {title: 'asc'}})
  ]);
  const submitAction = updateVideoAction.bind(null, params.videoId);

  if (!video) {
    notFound();
  }

  return (
    <section className="space-y-5">
      <div>
        <Heading level={1}>Edit Video</Heading>
        <Text>Update metadata, playlist and publish state.</Text>
      </div>
      <div className="rounded-2xl border border-art-sage bg-art-cream p-6">
        <AddVideoForm
          playlists={playlists}
          initialData={{
            title: video.title,
            description: video.description,
            playlist_id: video.playlistId ?? '',
            tags: video.tags,
            order_index: video.orderIndex,
            is_published: video.isPublished,
            sources: video.sources.map((source) => ({
              url: source.url,
              isPrimary: source.isPrimary
            }))
          }}
          submitAction={submitAction}
        />
      </div>
    </section>
  );
}
