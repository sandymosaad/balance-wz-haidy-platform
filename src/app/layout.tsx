import type {Metadata} from 'next';
import {Inter, Playfair_Display} from 'next/font/google';
import {AppProviders} from '@/components/providers/app-providers';
import {generateBaseMetadata, generateOrganizationSchema, generateLocalBusinessSchema} from '@/lib/seo.config';
import {JsonLd} from '@/components/seo/JsonLd';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap'
});

export const metadata: Metadata = generateBaseMetadata();

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en" data-theme="art-therapy" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} bg-background font-sans text-foreground antialiased`}>
        <AppProviders>{children}</AppProviders>
        <JsonLd data={[generateOrganizationSchema(), generateLocalBusinessSchema()]} />
      </body>
    </html>
  );
}
