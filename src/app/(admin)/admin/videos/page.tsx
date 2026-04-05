import Link from 'next/link';
import {Pencil, PlusCircle, Trash2, Eye} from 'lucide-react';
import {db} from '@/lib/db';
import {Heading} from '@/components/ui/Heading';
import {Text} from '@/components/ui/Text';
import {Button} from '@/components/ui/Button';
import {DataTable} from '@/components/admin/DataTable';
import {StatusBadge} from '@/components/admin/StatusBadge';
import {formatDate} from '@/lib/admin-utils';
import {PlatformIcon} from '@/features/videos/components/PlatformIcon';
import type {Video} from '@/types';
import type {VideoPlatform} from '@prisma/client';

interface VideoRow extends Record<string, unknown> {
  id: string;
  title: string;
  slug: string;
  createdAt: Date;
  isPublished: boolean;
  playlist: {
    title: string;
    slug: string;
  } | null;
  sources: Array<{
    id: string;
    platform: VideoPlatform;
  }>;
}

export default async function AdminVideosPage() {
  const videos = (await db.video.findMany({
    take: 20,
    orderBy: {createdAt: 'desc'},
    include: {
      playlist: {
        select: {title: true, slug: true}
      },
      sources: {
        orderBy: [{isPrimary: 'desc'}, {createdAt: 'asc'}]
      }
    }
  } as never)) as unknown as VideoRow[];

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

      <DataTable<VideoRow>
        columns={[
          {key: 'title', header: 'Title', sortable: true},
          {key: 'playlist', header: 'Playlist', render: (row) => String(row.playlist?.title ?? '-')},
          {
            key: 'platforms',
            header: 'Platforms',
            render: (row) => (
              <div className="flex flex-wrap gap-2">
                {row.sources.map((source) => (
                  <PlatformIcon key={source.id} platform={source.platform} label={source.platform} compact />
                ))}
              </div>
            )
          },
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
        data={videos}
      />
    </div>
  );
}
