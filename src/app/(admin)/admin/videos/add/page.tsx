import {db} from '@/lib/db';
import {Heading} from '@/components/ui/Heading';
import {Text} from '@/components/ui/Text';
import {AddVideoForm} from '@/features/videos/components/AddVideoForm';
import {createVideoAction} from '@/server/actions/admin-video.actions';

export default async function AddVideoPage() {
  const playlists = await db.playlist.findMany({
    select: {id: true, title: true},
    orderBy: {title: 'asc'}
  });

  return (
    <section className="space-y-5">
      <div>
        <Heading level={1}>Add New Video</Heading>
        <Text>Paste a supported URL and assign it to a playlist.</Text>
      </div>
      <div className="rounded-2xl border border-art-sage bg-art-cream p-6">
        <AddVideoForm playlists={playlists} submitAction={createVideoAction} />
      </div>
    </section>
  );
}
