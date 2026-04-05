import type {Metadata} from 'next';
import {SOCIAL_LINKS} from '@/lib/social-links';

export const siteConfig = {
  name: 'balance wz haidy',
  description: 'Transform your life through creative expression and personal growth with art therapy coaching.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/og-image.jpg`,
  keywords: [
    'art therapy',
    'life coaching',
    'personal growth',
    'wellness',
    'creative expression',
    'coaching sessions',
    'mental health'
  ],
  authors: {
    name: 'balance wz haidy',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  },
  contact: {
    email: 'hello@arttherapy.studio',
    phone: '+966 500 000 000'
  },
  social: {
    facebook: SOCIAL_LINKS.facebook,
    instagram: SOCIAL_LINKS.instagram,
    tiktok: SOCIAL_LINKS.tiktok,
    youtube: SOCIAL_LINKS.youtube
  }
};

export function generateBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} | Life Coaching & Art Therapy`,
      template: `%s | ${siteConfig.name}`
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [siteConfig.authors],
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: siteConfig.name,
      description: siteConfig.description,
      images: [{url: siteConfig.ogImage, width: 1200, height: 630}]
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.name,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
      creator: '@balance_wz_haidy'
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
      other: [{rel: 'manifest', url: '/site.webmanifest'}]
    },
    manifest: '/site.webmanifest'
  };
}

export interface StructuredData {
  '@context': 'https://schema.org';
  '@type': string;
  [key: string]: unknown;
}

export function generateOrganizationSchema(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    sameAs: Object.values(siteConfig.social),
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'SA'
    }
  };
}

export function generateLocalBusinessSchema(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    priceRange: '$$$',
    serviceType: ['Art Therapy', 'Life Coaching', 'Wellness'],
    areaServed: 'SA'
  };
}

export function generateServiceSchema(
  name: string,
  description: string,
  areaServed = 'SA'
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url
    },
    areaServed
  };
}

export function generateBreadcrumbSchema(items: {name: string; url: string}[]): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`
    }))
  };
}
