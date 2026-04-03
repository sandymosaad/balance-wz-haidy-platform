import {notFound} from 'next/navigation';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {routing, type AppLocale} from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: {locale: string};
};

export default async function LocaleLayout({children, params}: LocaleLayoutProps) {
  const {locale} = params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale as AppLocale} messages={messages}>
      <div dir={locale === 'ar' ? 'rtl' : 'ltr'}>{children}</div>
    </NextIntlClientProvider>
  );
}
