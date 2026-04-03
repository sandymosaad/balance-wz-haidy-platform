import type {PropsWithChildren} from 'react';
import {Header} from '@/components/shared/Header';
import {Footer} from '@/components/shared/Footer';

type LayoutProps = PropsWithChildren<{
  showHeader?: boolean;
  showFooter?: boolean;
  locale: string;
}>;

export function Layout({children, showHeader = true, showFooter = true, locale}: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {showHeader ? <Header /> : null}
      <main className="flex-1">{children}</main>
      {showFooter ? <Footer locale={locale} /> : null}
    </div>
  );
}
