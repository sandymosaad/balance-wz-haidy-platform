import {Camera, Music2, Play, Users} from 'lucide-react';
import {Container} from '@/components/ui/Container';
import {Heading} from '@/components/ui/Heading';
import {Text} from '@/components/ui/Text';
import {Link} from '@/i18n/navigation';
import {SOCIAL_LINKS} from '@/lib/constants';
import {getTranslations} from 'next-intl/server';

type FooterProps = {
  locale: string;
};

const socialIcons = {
  facebook: Users,
  instagram: Camera,
  tiktok: Music2,
  youtube: Play
} as const;

export async function Footer({locale}: FooterProps) {
  const t = await getTranslations({locale, namespace: 'footer'});

  return (
    <footer className="border-t border-art-sage bg-art-beige/70 py-14">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Heading level={4}>{t('brandTitle')}</Heading>
            <Text>{t('tagline')}</Text>
            <Text variant="small" color="muted">{t('description')}</Text>
          </div>

          <div className="space-y-3">
            <Heading level={4}>{t('quickLinks')}</Heading>
            <div className="flex flex-col gap-2 text-sm text-art-taupe">
              <Link href="/">{t('links.home')}</Link>
              <Link href="/videos">{t('links.videos')}</Link>
              <Link href="/about">{t('links.about')}</Link>
              <Link href="/services">{t('links.services')}</Link>
              <Link href="/contact">{t('links.contact')}</Link>
            </div>
          </div>

          <div className="space-y-3">
            <Heading level={4}>{t('contact')}</Heading>
            <Text variant="small">hello@arttherapy.studio</Text>
            <Text variant="small">+966 500 000 000</Text>
            <Link href="/contact" className="text-sm text-art-terracotta hover:text-art-gold">{t('contactForm')}</Link>
          </div>

          <div className="space-y-3">
            <Heading level={4}>{t('social')}</Heading>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = socialIcons[social.key];
                return (
                  <a
                    key={social.key}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="rounded-full border border-art-sage p-2 text-art-taupe transition-all duration-calm hover:border-art-gold hover:text-art-terracotta"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-art-sage/70 pt-6 text-xs text-art-clay sm:flex-row sm:justify-between">
          <span>{t('copyright')}</span>
          <div className="flex gap-4">
            <Link href="/privacy">{t('privacy')}</Link>
            <Link href="/terms">{t('terms')}</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
