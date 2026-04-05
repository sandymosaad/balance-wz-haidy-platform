import {Link} from '@/i18n/navigation';
import {useTranslations} from '@/lib/use-translations';

export function Logo() {
  const tBrand = useTranslations('brand');

  return (
    <Link href="/" className="font-serif text-xl text-art-charcoal tracking-calm" aria-label={tBrand('homeAria')}>
      {tBrand('name')}
    </Link>
  );
}
