import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {siteConfig, generateBreadcrumbSchema} from '@/lib/seo.config';
import {JsonLd} from '@/components/seo/JsonLd';
import {Container} from '@/components/ui/Container';
import {Section} from '@/components/layout/Section';
import {HeroSection} from '@/components/layout/HeroSection';
import {Heading} from '@/components/ui/Heading';
import {Text} from '@/components/ui/Text';
import {Grid} from '@/components/layout/Grid';
import {Card} from '@/components/ui/Card';
import {Button} from '@/components/ui/Button';
import {Link} from '@/i18n/navigation';
import {getPublishedVideos} from '@/server/actions/video.actions';
import {getPublishedPlaylists} from '@/server/actions/playlist.actions';
import {VideoGrid} from '@/features/videos/components/VideoGrid';

export const dynamic = 'force-dynamic';

export async function generateMetadata({params}: {params: {locale: string}}): Promise<Metadata> {
  const t = await getTranslations({locale: params.locale, namespace: 'phase3.home'});
  return {
    title: `${t('hero.title')} | ${siteConfig.name}`,
    description: t('hero.subtitle'),
    openGraph: {
      title: t('hero.title'),
      description: t('hero.subtitle'),
      url: `${siteConfig.url}/${params.locale}`,
      type: 'website'
    },
    alternates: {
      canonical: `${siteConfig.url}/${params.locale}`,
      languages: {
        en: `${siteConfig.url}/en`,
        ar: `${siteConfig.url}/ar`,
        'x-default': siteConfig.url
      }
    }
  };
}

export default async function HomePage({params}: {params: {locale: string}}) {
  const t = await getTranslations({locale: params.locale, namespace: 'phase3.home'});
  const [videosResponse, playlistsResponse] = await Promise.all([
    getPublishedVideos({limit: 6, page: 1, sort: 'NEWEST'}),
    getPublishedPlaylists({limit: 60, page: 1, sort: 'ALPHABETICAL'})
  ]);
  const videos = videosResponse.success ? videosResponse.data?.items ?? [] : [];
  const playlists = playlistsResponse.success ? playlistsResponse.data?.items ?? [] : [];
  const coverByPlaylistId = new Map(playlists.map((playlist) => [playlist.id, playlist.coverImage]));
  const videosWithCovers = videos.map((video) => ({
    ...video,
    playlist: video.playlist
      ? {
          ...video.playlist,
          coverImage: video.playlist.coverImage ?? coverByPlaylistId.get(video.playlistId) ?? null
        }
      : video.playlist
  }));
  const breadcrumbSchema = generateBreadcrumbSchema([
    {name: 'Home', url: `/${params.locale}`}
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <HeroSection
        title={t('hero.title')}
        subtitle={t('hero.tagline')}
        description={t('hero.subtitle')}
        cta={[
          {label: t('hero.exploreVideos'), href: '/videos', variant: 'primary'},
          {label: t('hero.bookSession'), href: '/contact', variant: 'secondary'}
        ]}
      />

      <Section background="cream">
        <Container>
          <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
            <div className="rounded-gentle bg-art-beige/70 p-10" />
            <div className="mt-8 max-w-[680px]">
              <Heading level={2} alignment="center">
                {t('aboutPreview.title')}
              </Heading>
              <Text className="mx-auto max-w-[640px] text-center">{t('aboutPreview.description')}</Text>
              <Button asChild variant="outline" className="mt-6">
                <Link href="/about">{t('aboutPreview.cta')}</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section background="beige">
        <Container>
          <Heading level={2} alignment="center">{t('services.title')}</Heading>
          <Grid cols={3}>
            {['coaching', 'artTherapy', 'wellness'].map((key) => (
              <Card key={key} hover>
                <Heading level={3}>{t(`services.${key}.title`)}</Heading>
                <Text>{t(`services.${key}.description`)}</Text>
                <Button asChild variant="ghost" className="mt-4 px-0">
                  <Link href="/services">{t('services.learnMore')}</Link>
                </Button>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      <Section background="cream">
        <Container>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <Heading level={2}>{t('featuredVideos.title')}</Heading>
              <Text>{t('featuredVideos.subtitle')}</Text>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/videos">{t('featuredVideos.cta')}</Link>
            </Button>
          </div>
          <VideoGrid videos={videosWithCovers as never[]} />
        </Container>
      </Section>

      <Section className="bg-gradient-to-r from-art-gold/20 via-art-beige/70 to-art-cream">
        <Container className="text-center">
          <Heading level={2} alignment="center">{t('finalCta.title')}</Heading>
          <Text>{t('finalCta.description')}</Text>
          <Button asChild className="mt-6">
            <Link href="/contact">{t('finalCta.button')}</Link>
          </Button>
        </Container>
      </Section>
    </>
  );
}
