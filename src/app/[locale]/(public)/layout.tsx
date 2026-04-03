import type {Metadata} from 'next';
import type {ReactNode} from 'react';
import {Layout} from '@/components/layout/Layout';

export const metadata: Metadata = {
  title: 'Art Therapy Coaching & Wellness',
  description:
    'Explore art therapy coaching, wellness programs, and creative expression with a warm and professional learning experience.'
};

type PublicLayoutProps = {
  children: ReactNode;
  params: {locale: string};
};

export default function PublicLayout({children, params}: PublicLayoutProps) {
  return <Layout locale={params.locale}>{children}</Layout>;
}
