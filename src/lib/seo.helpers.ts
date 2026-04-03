import type {Metadata} from 'next';
import {siteConfig} from '@/lib/seo.config';

export function createPageMetadata(
  locale: string,
  title: string,
  description: string,
  path: string = ''
): Metadata {
  const url = `${siteConfig.url}/${locale}${path}`;

  return {
    title: `${title} | ${siteConfig.name}`,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'website'
    },
    alternates: {
      canonical: url,
      languages: {
        en: `${siteConfig.url}/en${path}`,
        ar: `${siteConfig.url}/ar${path}`,
        'x-default': `${siteConfig.url}${path}`
      }
    }
  };
}

export function createArticleMetadata(
  locale: string,
  title: string,
  description: string,
  author: string,
  publishedTime: Date,
  path: string = ''
): Metadata {
  const url = `${siteConfig.url}/${locale}${path}`;

  return {
    title: `${title} | ${siteConfig.name}`,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      authors: [author],
      publishedTime: publishedTime.toISOString()
    },
    alternates: {
      canonical: url,
      languages: {
        en: `${siteConfig.url}/en${path}`,
        ar: `${siteConfig.url}/ar${path}`
      }
    }
  };
}
