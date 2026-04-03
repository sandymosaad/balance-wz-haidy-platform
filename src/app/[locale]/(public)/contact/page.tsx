import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {Container} from '@/components/ui/Container';
import {Section} from '@/components/layout/Section';
import {Heading} from '@/components/ui/Heading';
import {Text} from '@/components/ui/Text';
import {ContactForm} from '@/features/contact/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact | Book a Session',
  description: 'Get in touch and book your first art therapy or coaching session.'
};

export default async function ContactPage({params}: {params: {locale: string}}) {
  const t = await getTranslations({locale: params.locale, namespace: 'phase3.contactPage'});

  return (
    <Section>
      <Container className="space-y-8">
        <div>
          <Heading level={1}>{t('title')}</Heading>
          <Text>{t('subtitle')}</Text>
        </div>

        <ContactForm />
      </Container>
    </Section>
  );
}
