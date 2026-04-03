import type {MetadataRoute} from 'next';
import {siteConfig} from '@/lib/seo.config';
import {db} from '@/lib/db';

async function getVideoSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const videos = await db.video.findMany({
      where: {isPublished: true},
      select: {slug: true, playlist: {select: {slug: true}}, updatedAt: true},
      orderBy: {updatedAt: 'desc'}
    });

    return videos.map((video) => ({
      url: `${siteConfig.url}/videos/${video.playlist?.slug}/${video.slug}`,
      lastModified: video.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6
    }));
  } catch {
    return [];
  }
}

async function getPlaylistSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const playlists = await db.playlist.findMany({
      where: {isPublished: true},
      select: {slug: true, updatedAt: true},
      orderBy: {updatedAt: 'desc'}
    });

    return playlists.map((playlist) => ({
      url: `${siteConfig.url}/videos/${playlist.slug}`,
      lastModified: playlist.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0
    },
    {
      url: `${siteConfig.url}/about`,
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${siteConfig.url}/services`,
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${siteConfig.url}/contact`,
      changeFrequency: 'monthly',
      priority: 0.7
    },
    {
      url: `${siteConfig.url}/videos`,
      changeFrequency: 'weekly',
      priority: 0.9
    }
  ];

  const playlistEntries = await getPlaylistSitemapEntries();
  const videoEntries = await getVideoSitemapEntries();

  return [...staticRoutes, ...playlistEntries, ...videoEntries];
}
