import {PrismaClient, ContentType, Platform} from '@prisma/client';
import {extractVideoMetadata} from '../src/lib/video-platform';

const prisma = new PrismaClient();

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

type SeedVideo = {
  title: string;
  description: string;
  url: string;
  platform: Platform;
  tags: string[];
};

async function createPlaylistWithVideos(options: {
  title: string;
  description: string;
  contentType: ContentType;
  order: number;
  videos: SeedVideo[];
}) {
  const playlist = await prisma.playlist.create({
    data: {
      title: options.title,
      slug: slugify(options.title),
      description: options.description,
      contentType: options.contentType,
      order: options.order,
      isPublished: true
    }
  });

  for (const [index, video] of options.videos.entries()) {
    const metadata = await extractVideoMetadata(video.url);

    await prisma.video.create({
      data: {
        title: video.title,
        slug: slugify(`${options.title}-${video.title}`),
        description: video.description,
        videoUrl: video.url,
        platform: video.platform,
        videoId: metadata.videoId,
        thumbnailUrl: metadata.thumbnailUrl,
        playlistId: playlist.id,
        orderIndex: index,
        tags: video.tags,
        isPublished: true,
        viewCount: Math.floor(Math.random() * 2000)
      }
    });
  }

  return playlist;
}

async function main() {
  console.log('Seeding development data...');

  await prisma.comment.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.viewingHistory.deleteMany();
  await prisma.video.deleteMany();
  await prisma.playlist.deleteMany();
  await prisma.user.deleteMany();

  await createPlaylistWithVideos({
    title: 'Foundations of Art Therapy',
    description: 'Core principles and introductory sessions for therapeutic art exploration.',
    contentType: 'COURSE',
    order: 1,
    videos: [
      {
        title: 'Welcome to Art Therapy',
        description: 'A calm introduction to reflective art therapy practices.',
        url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
        platform: 'YOUTUBE',
        tags: ['art-therapy', 'intro', 'wellness']
      },
      {
        title: 'Instagram Reflection Reel',
        description: 'A quick visual grounding practice for emotional awareness.',
        url: 'https://www.instagram.com/reel/CwL8fQmN2R1/',
        platform: 'INSTAGRAM',
        tags: ['reflection', 'reel', 'breathing']
      }
    ]
  });

  await createPlaylistWithVideos({
    title: 'Creative Expression Exercises',
    description: 'Hands-on guided exercises to unlock creative emotional expression.',
    contentType: 'SERIES',
    order: 2,
    videos: [
      {
        title: 'Color and Emotion Mapping',
        description: 'Use color to externalize emotion and process inner states.',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        platform: 'YOUTUBE',
        tags: ['color', 'expression', 'exercise']
      },
      {
        title: 'TikTok Creative Prompt',
        description: 'Short prompt to spark daily expressive practice.',
        url: 'https://www.tiktok.com/@creativecoach/video/7319756214738296069',
        platform: 'TIKTOK',
        tags: ['prompt', 'tiktok', 'daily-practice']
      }
    ]
  });

  await createPlaylistWithVideos({
    title: 'Mindfulness & Wellness',
    description: 'Gentle routines for nervous-system regulation and mindful growth.',
    contentType: 'PLAYLIST',
    order: 3,
    videos: [
      {
        title: 'Grounding Breath Session',
        description: 'A short nervous-system reset with guided breath pacing.',
        url: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
        platform: 'YOUTUBE',
        tags: ['mindfulness', 'breath', 'grounding']
      },
      {
        title: 'Instagram Mindful Pause',
        description: 'One-minute pause practice for busy days.',
        url: 'https://www.instagram.com/reel/C0k5fXsoR5a/',
        platform: 'INSTAGRAM',
        tags: ['mindfulness', 'pause', 'wellness']
      },
      {
        title: 'TikTok Evening Reset',
        description: 'Simple evening reset to unwind with intention.',
        url: 'https://www.tiktok.com/@wellnesspath/video/7319756214738296070',
        platform: 'TIKTOK',
        tags: ['reset', 'evening', 'calm']
      }
    ]
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
