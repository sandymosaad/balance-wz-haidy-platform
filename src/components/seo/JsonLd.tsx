import type {StructuredData} from '@/lib/seo.config';

type JsonLdProps = {
  data: StructuredData | StructuredData[];
};

export function JsonLd({data}: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(Array.isArray(data) ? {
          '@context': 'https://schema.org',
          '@graph': data
        } : data)
      }}
    />
  );
}
