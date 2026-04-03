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
  title: 'Services | Art Therapy & Coaching',
  description: 'Explore coaching sessions, art therapy offerings, and wellness programs.'
};

export default async function ServicesPage({params}: {params: {locale: string}}) {
  const t = await getTranslations({locale: params.locale, namespace: 'phase3.servicesPage'});

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
          <Grid cols={3}>
            {['coaching', 'artTherapy', 'wellness'].map((key) => (
              <Card key={key} hover>
                <Heading level={3}>{t(`${key}.title`)}</Heading>
                <Text>{t(`${key}.description`)}</Text>
                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-art-taupe">
                  <li>{t(`${key}.point1`)}</li>
                  <li>{t(`${key}.point2`)}</li>
                  <li>{t(`${key}.point3`)}</li>
                </ul>
                <Button asChild className="mt-5" variant="secondary">
                  <Link href="/contact">{t('book')}</Link>
                </Button>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>
    </>
  );
}
