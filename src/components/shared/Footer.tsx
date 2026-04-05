import type {SVGProps} from 'react';
import {Container} from '@/components/ui/Container';
import {Heading} from '@/components/ui/Heading';
import {Text} from '@/components/ui/Text';
import {Link} from '@/i18n/navigation';
import {SOCIAL_LINKS} from '@/lib/constants';
import {getTranslations} from 'next-intl/server';

type FooterProps = {
  locale: string;
};

type LogoProps = SVGProps<SVGSVGElement>;

function FacebookLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 11.01 10.125 11.927v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.236 2.686.236v2.953H15.83c-1.49 0-1.954.931-1.954 1.887v2.253h3.328l-.532 3.49h-2.796V24C19.612 23.083 24 18.092 24 12.073z" />
    </svg>
  );
}

function InstagramLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 1.8A3.7 3.7 0 0 0 3.8 7.5v9a3.7 3.7 0 0 0 3.7 3.7h9a3.7 3.7 0 0 0 3.7-3.7v-9a3.7 3.7 0 0 0-3.7-3.7h-9zm10.1 1.35a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4z" />
    </svg>
  );
}

function TikTokLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.36 2h3.12c.2 1.73 1.18 3.22 2.67 4.12.94.56 2.03.87 3.15.88v3.24c-1.5-.03-2.97-.42-4.26-1.13-.47-.26-.91-.56-1.31-.9v6.72c0 1.25-.34 2.48-.99 3.55a7.05 7.05 0 0 1-2.89 2.66 7.36 7.36 0 0 1-3.47.7A7.2 7.2 0 0 1 4 20.02 6.78 6.78 0 0 1 2.3 15.4a6.86 6.86 0 0 1 2.83-5.28 7.3 7.3 0 0 1 4.41-1.3v3.21a3.66 3.66 0 0 0-2.54.86 3.46 3.46 0 0 0-1.2 2.74c0 1.07.49 2.07 1.33 2.74.52.43 1.18.67 1.86.69.58.02 1.15-.12 1.66-.4.72-.4 1.27-1.02 1.57-1.75.2-.46.31-.96.31-1.46V2z" />
    </svg>
  );
}

function YouTubeLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M23.5 7.2a3 3 0 0 0-2.1-2.12C19.55 4.6 12 4.6 12 4.6s-7.55 0-9.4.48A3 3 0 0 0 .5 7.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.12c1.85.48 9.4.48 9.4.48s7.55 0 9.4-.48a3 3 0 0 0 2.1-2.12A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-4.8zM9.6 15.3V8.7L15.8 12l-6.2 3.3z" />
    </svg>
  );
}

const socialIcons = {
  facebook: FacebookLogo,
  instagram: InstagramLogo,
  tiktok: TikTokLogo,
  youtube: YouTubeLogo
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
            <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2">
              {SOCIAL_LINKS.map((social) => {
                const Icon = socialIcons[social.key];
                return (
                  <a
                    key={social.key}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.label} (opens in a new tab)`}
                    className="inline-flex items-center gap-2 rounded-full border border-art-sage px-3 py-2 text-sm text-art-taupe transition-all duration-calm hover:border-art-gold hover:text-art-terracotta"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{social.label}</span>
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
