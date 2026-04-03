import {notFound} from 'next/navigation';
import {db} from '@/lib/db';
import {Heading} from '@/components/ui/Heading';
import {Text} from '@/components/ui/Text';
import {AddPlaylistForm} from '@/features/playlists/components/AddPlaylistForm';
import {updatePlaylistAction} from '@/server/actions/admin-playlist.actions';

export default async function EditPlaylistPage({params}: {params: {playlistId: string}}) {
  const playlist = await db.playlist.findUnique({where: {id: params.playlistId}});
  const submitAction = updatePlaylistAction.bind(null, params.playlistId);

  if (!playlist) {
    notFound();
  }

  return (
    <section className="space-y-5">
      <div>
        <Heading level={1}>Edit Playlist</Heading>
        <Text>Update details, cover image and publish status.</Text>
      </div>
      <div className="rounded-2xl border border-art-sage bg-art-cream p-6">
        <AddPlaylistForm
          initialData={{
            title: playlist.title,
            description: playlist.description,
            content_type: playlist.contentType,
            cover_image: playlist.coverImage ?? undefined,
            order: playlist.order,
            is_published: playlist.isPublished
          }}
          submitAction={submitAction}
        />
      </div>
    </section>
  );
}
