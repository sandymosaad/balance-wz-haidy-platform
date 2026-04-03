import Link from 'next/link';
import {Pencil, PlusCircle, ArrowUpDown} from 'lucide-react';
import type {Playlist} from '@prisma/client';
import {db} from '@/lib/db';
import {Heading} from '@/components/ui/Heading';
import {Text} from '@/components/ui/Text';
import {Button} from '@/components/ui/Button';
import {DataTable} from '@/components/admin/DataTable';
import {StatusBadge} from '@/components/admin/StatusBadge';
import {formatDate, classifyContentType} from '@/lib/admin-utils';

type PlaylistRow = Playlist & {
  _count: {
    videos: number;
  };
};

export default async function AdminPlaylistsPage() {
  const playlists = await db.playlist.findMany({
    take: 20,
    orderBy: {createdAt: 'desc'},
    include: {
      _count: {select: {videos: true}}
    }
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Heading level={1}>Playlists</Heading>
          <Text variant="small">Create and organize learning collections.</Text>
        </div>
        <Button asChild>
          <Link href="/admin/playlists/add"><PlusCircle className="mr-2 h-4 w-4" />Add New Playlist</Link>
        </Button>
      </div>

      <DataTable
        columns={[
          {key: 'title', header: 'Title', sortable: true},
          {key: 'type', header: 'Type', render: (row) => classifyContentType(String(row.contentType))},
          {key: 'count', header: 'Videos', render: (row) => String(row._count?.videos ?? 0)},
          {
            key: 'status',
            header: 'Status',
            render: (row) => <StatusBadge status={row.isPublished ? 'published' : 'draft'} />
          },
          {key: 'createdAt', header: 'Created', render: (row) => formatDate(row.createdAt)},
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
              <div className="flex gap-2">
                <Button asChild size="sm" variant="ghost"><Link href={`/admin/playlists/${row.id}/edit`}><Pencil className="h-4 w-4" /></Link></Button>
                <Button asChild size="sm" variant="ghost"><Link href={`/admin/playlists/${row.id}/reorder`}><ArrowUpDown className="h-4 w-4" /></Link></Button>
              </div>
            )
          }
        ]}
        data={playlists as PlaylistRow[]}
      />
    </div>
  );
}
