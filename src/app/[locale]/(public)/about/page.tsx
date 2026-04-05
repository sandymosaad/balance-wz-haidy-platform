import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {Container} from '@/components/ui/Container';
import {Section} from '@/components/layout/Section';
import {Heading} from '@/components/ui/Heading';
import {Text} from '@/components/ui/Text';
import {Grid} from '@/components/layout/Grid';
import {Card} from '@/components/ui/Card';
import {Button} from '@/components/ui/Button';
import {Link} from '@/i18n/navigation';
import {AboutImage} from '@/components/shared/AboutImage';

export const metadata: Metadata = {
  title: 'About Me | Art Therapy Coach',
  description: 'Learn about background, credentials, and coaching philosophy in art therapy and wellness.'
};

export default async function AboutPage({params}: {params: {locale: string}}) {
  const t = await getTranslations({locale: params.locale, namespace: 'phase3.aboutPage'});
  const isRtl = params.locale === 'ar';

  return (
    <>
      <Section>
        <Container>
          <Heading level={1}>{t('title')}</Heading>
          <Text>{t('subtitle')}</Text>
        </Container>
      </Section>

      <Section background="beige">
        <Container>
          <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-10">
            <div className={isRtl ? 'md:order-2' : 'md:order-1'}>
              <AboutImage
                alt={t('about.photoAlt')}
                className="mx-auto max-w-lg"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <Text variant="small" color="muted" className="mt-3 text-center">
                {t('about.photoCaption')}
              </Text>
            </div>

            <div className={isRtl ? 'md:order-1 md:text-right' : 'md:order-2 md:text-left'}>
              <Heading level={2}>{t('journey.title')}</Heading>
              <Text>{t('journey.description')}</Text>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Heading level={2}>{t('credentials.title')}</Heading>
          <Grid cols={3}>
            {[1, 2, 3].map((item) => (
              <Card key={item}>
                <Text>{t(`credentials.items.${item}`)}</Text>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      <Section background="beige">
        <Container className="text-center">
          <Heading level={2} alignment="center">{t('cta.title')}</Heading>
          <Button asChild>
            <Link href="/contact">{t('cta.button')}</Link>
          </Button>
        </Container>
      </Section>
    </>
  );
}
