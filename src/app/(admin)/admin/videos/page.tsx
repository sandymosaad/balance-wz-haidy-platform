import Link from 'next/link';
import {Pencil, PlusCircle, Trash2, Eye} from 'lucide-react';
import type {Video} from '@prisma/client';
import {db} from '@/lib/db';
import {Heading} from '@/components/ui/Heading';
import {Text} from '@/components/ui/Text';
import {Button} from '@/components/ui/Button';
import {DataTable} from '@/components/admin/DataTable';
import {StatusBadge} from '@/components/admin/StatusBadge';
import {formatDate} from '@/lib/admin-utils';

type VideoRow = Video & {
  playlist: {
    title: string;
    slug: string;
  } | null;
};

export default async function AdminVideosPage() {
  const videos = await db.video.findMany({
    take: 20,
    orderBy: {createdAt: 'desc'},
    include: {
      playlist: {
        select: {title: true, slug: true}
      }
    }
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Heading level={1}>Videos</Heading>
          <Text variant="small">Manage all videos and publishing state.</Text>
        </div>
        <Button asChild>
          <Link href="/admin/videos/add"><PlusCircle className="mr-2 h-4 w-4" />Add New Video</Link>
        </Button>
      </div>

      <DataTable
        columns={[
          {key: 'title', header: 'Title', sortable: true},
          {key: 'playlist', header: 'Playlist', render: (row) => String(row.playlist?.title ?? '-')},
          {key: 'platform', header: 'Platform'},
          {
            key: 'status',
            header: 'Status',
            render: (row) => <StatusBadge status={row.isPublished ? 'published' : 'draft'} />
          },
          {
            key: 'createdAt',
            header: 'Created',
            render: (row) => formatDate(row.createdAt)
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
              <div className="flex gap-2">
                <Button asChild size="sm" variant="ghost"><Link href={`/admin/videos/${row.id}/edit`}><Pencil className="h-4 w-4" /></Link></Button>
                <Button asChild size="sm" variant="ghost"><a href={`/videos/${row.playlist?.slug ?? ''}/${row.slug}`}><Eye className="h-4 w-4" /></a></Button>
                <Button size="sm" variant="ghost" className="text-art-terracotta"><Trash2 className="h-4 w-4" /></Button>
              </div>
            )
          }
        ]}
        data={videos as VideoRow[]}
      />
    </div>
  );
}
