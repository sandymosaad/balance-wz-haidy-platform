import Link from 'next/link';
import {BarChart3, Clapperboard, Eye, LibraryBig, PlusCircle} from 'lucide-react';
import {Card} from '@/components/ui/Card';
import {Button} from '@/components/ui/Button';
import {Heading} from '@/components/ui/Heading';
import {Text} from '@/components/ui/Text';
import {StatsCard} from '@/components/admin/StatsCard';
import {getDashboardStatsAction, getRecentActivityAction} from '@/server/actions/admin-dashboard.actions';
import {formatDate} from '@/lib/admin-utils';

export default async function AdminDashboardPage() {
  const [statsRes, recentRes] = await Promise.all([
    getDashboardStatsAction(),
    getRecentActivityAction(10)
  ]);

  const stats: {totalPlaylists: number; totalVideos: number; totalViews: number; publishedVideos: number} = statsRes.success && statsRes.data
    ? statsRes.data
    : {totalPlaylists: 0, totalVideos: 0, totalViews: 0, publishedVideos: 0};

  const recent = recentRes.success ? recentRes.data ?? [] : [];

  return (
    <div className="space-y-8">
      <section>
        <Heading level={1}>Dashboard</Heading>
        <Text>Welcome back, Admin</Text>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Total Playlists" value={stats.totalPlaylists} icon={<LibraryBig className="h-5 w-5" />} />
        <StatsCard title="Total Videos" value={stats.totalVideos} icon={<Clapperboard className="h-5 w-5" />} />
        <StatsCard title="Total Views" value={stats.totalViews} icon={<Eye className="h-5 w-5" />} />
        <StatsCard title="Published Videos" value={stats.publishedVideos} icon={<BarChart3 className="h-5 w-5" />} />
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <Button asChild><Link href="/admin/videos/add"><PlusCircle className="mr-2 h-4 w-4" />Add New Video</Link></Button>
        <Button asChild variant="secondary"><Link href="/admin/playlists/add"><PlusCircle className="mr-2 h-4 w-4" />Add New Playlist</Link></Button>
        <Button asChild variant="outline"><Link href="/admin/videos">View Analytics</Link></Button>
      </section>

      <section className="space-y-3">
        <Heading level={3}>Recent Activity</Heading>
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-art-clay">
                  <th className="px-2 py-2">Title</th>
                  <th className="px-2 py-2">Type</th>
                  <th className="px-2 py-2">Date</th>
                  <th className="px-2 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((item) => (
                  <tr key={`${item.type}-${item.id}`} className="border-t border-art-sage/40">
                    <td className="px-2 py-2">{item.title}</td>
                    <td className="px-2 py-2">{item.type}</td>
                    <td className="px-2 py-2">{formatDate(item.createdAt)}</td>
                    <td className="px-2 py-2">{item.isPublished ? 'Published' : 'Draft'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}
