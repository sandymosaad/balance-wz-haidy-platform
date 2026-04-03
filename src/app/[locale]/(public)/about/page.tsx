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

export const metadata: Metadata = {
  title: 'About Me | Art Therapy Coach',
  description: 'Learn about background, credentials, and coaching philosophy in art therapy and wellness.'
};

export default async function AboutPage({params}: {params: {locale: string}}) {
  const t = await getTranslations({locale: params.locale, namespace: 'phase3.aboutPage'});

  return (
    <>
      <Section>
        <Container>
          <Heading level={1}>{t('title')}</Heading>
          <Text>{t('subtitle')}</Text>
        </Container>
      </Section>

      <Section background="beige">
        <Container className="space-y-6">
          <Heading level={2}>{t('journey.title')}</Heading>
          <Text>{t('journey.description')}</Text>
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
