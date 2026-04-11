import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {Container} from '@/components/ui/Container';
import {Section} from '@/components/layout/Section';
import {Heading} from '@/components/ui/Heading';
import {Text} from '@/components/ui/Text';
import {Card} from '@/components/ui/Card';
import {Button} from '@/components/ui/Button';
import {Link} from '@/i18n/navigation';
import {PlaylistCard} from '@/features/playlists/components/PlaylistCard';
import {getPublishedPlaylists} from '@/server/actions/playlist.actions';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 12;

function parsePage(value: string | string[] | undefined): number {
  const pageValue = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(pageValue ?? '1', 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
}

export const metadata: Metadata = {
  title: 'Playlists | Art Therapy & Wellness',
  description: 'Browse all published playlists and open any playlist to explore its videos.'
};

export default async function PlaylistsPage({
  params,
  searchParams
}: {
  params: {locale: string};
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const t = await getTranslations({locale: params.locale, namespace: 'playlists'});
  const tCommon = await getTranslations({locale: params.locale, namespace: 'common'});
  const page = parsePage(searchParams.page);

  const response = await getPublishedPlaylists({
    page,
    limit: PAGE_SIZE,
    sort: 'ALPHABETICAL'
  });

  const playlists = response.success ? response.data?.items ?? [] : [];
  const pagination = response.success
    ? (response.data?.pagination ?? {
        total: 0,
        page,
        limit: PAGE_SIZE,
        pageCount: 1
      })
    : {
        total: 0,
        page,
        limit: PAGE_SIZE,
        pageCount: 1
      };

  const hasPrev = pagination.page > 1;
  const hasNext = pagination.page < pagination.pageCount;
  const prevPage = Math.max(1, pagination.page - 1);
  const nextPage = Math.min(pagination.pageCount, pagination.page + 1);

  return (
    <Section>
      <Container className="space-y-10 pb-20">
        <header className="relative overflow-hidden rounded-[2rem] border border-art-sage/60 bg-gradient-to-br from-art-cream via-art-beige to-art-sage/15 p-6 shadow-soft md:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(205,163,122,0.16),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(166,186,167,0.15),transparent_45%)]"
          />
          <div className="relative space-y-6">
            <Heading level={1} className="mb-0 text-4xl text-art-charcoal sm:text-5xl lg:text-6xl">
              {t('title')}
            </Heading>
            <div className="max-w-3xl space-y-1.5 sm:space-y-2">
              <Text className="text-sm leading-relaxed text-art-taupe sm:text-base">{t('descriptionLine1')}</Text>
              <Text className="text-sm leading-relaxed text-art-taupe sm:text-base">{t('descriptionLine2')}</Text>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-art-clay">
              <span>{t('videoCount', {count: pagination.total})}</span>
              <span aria-hidden>•</span>
              <span>{t('pageOf', {current: pagination.page, total: pagination.pageCount})}</span>
            </div>
          </div>
        </header>

        {!playlists.length ? (
          <Card className="border-art-sage/60 bg-art-cream/90 p-10 text-center">
            <Heading level={3} className="mb-3 text-art-charcoal">{t('emptyTitle')}</Heading>
            <Text className="mx-auto max-w-xl text-art-taupe">{t('emptyDescription')}</Text>
          </Card>
        ) : (
          <section aria-label={t('title')} className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                videoCount={playlist._count?.videos ?? 0}
                href={`/videos/${playlist.slug}`}
              />
            ))}
          </section>
        )}

        {pagination.pageCount > 1 ? (
          <nav
            aria-label={t('paginationAria')}
            className="rounded-[1.5rem] border border-art-sage/60 bg-art-cream/90 px-4 py-4 shadow-soft md:px-6"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {hasPrev ? (
                <Button asChild variant="outline" className="rounded-full">
                  <Link href={{pathname: '/playlists', query: {page: String(prevPage)}}}>{tCommon('previous')}</Link>
                </Button>
              ) : (
                <Button variant="outline" className="rounded-full" disabled>
                  {tCommon('previous')}
                </Button>
              )}

              <Text className="text-center text-sm text-art-clay">{t('pageOf', {current: pagination.page, total: pagination.pageCount})}</Text>

              {hasNext ? (
                <Button asChild variant="outline" className="rounded-full">
                  <Link href={{pathname: '/playlists', query: {page: String(nextPage)}}}>{tCommon('next')}</Link>
                </Button>
              ) : (
                <Button variant="outline" className="rounded-full" disabled>
                  {tCommon('next')}
                </Button>
              )}
            </div>
          </nav>
        ) : null}
      </Container>
    </Section>
  );
}
