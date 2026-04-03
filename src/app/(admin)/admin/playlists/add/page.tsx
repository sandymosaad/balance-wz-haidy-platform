import {Heading} from '@/components/ui/Heading';
import {Text} from '@/components/ui/Text';
import {AddPlaylistForm} from '@/features/playlists/components/AddPlaylistForm';
import {createPlaylistAction} from '@/server/actions/admin-playlist.actions';

export default function AddPlaylistPage() {
  return (
    <section className="space-y-5">
      <div>
        <Heading level={1}>Add New Playlist</Heading>
        <Text>Create a new collection for curated video content.</Text>
      </div>
      <div className="rounded-2xl border border-art-sage bg-art-cream p-6">
        <AddPlaylistForm submitAction={createPlaylistAction} />
      </div>
    </section>
  );
}
