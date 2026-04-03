'use client';

import {Menu} from 'lucide-react';
import {useState} from 'react';
import {Button} from '@/components/ui/Button';
import {Container} from '@/components/ui/Container';
import {LanguageSwitcher} from '@/components/shared/LanguageSwitcher';
import {Logo} from '@/components/shared/Logo';
import {MobileMenu} from '@/components/shared/MobileMenu';
import {NavigationMenu} from '@/components/shared/NavigationMenu';
import {Link} from '@/i18n/navigation';
import {useTranslations} from '@/lib/use-translations';

export function Header() {
  const [open, setOpen] = useState(false);
  const t = useTranslations('common');

  return (
    <header className="sticky top-0 z-30 border-b border-art-sage/70 bg-art-cream/90 backdrop-blur-sm">
      <Container className="flex h-20 items-center justify-between">
        <Logo />
        <div className="hidden lg:block">
          <NavigationMenu />
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <Button asChild variant="primary" size="sm">
            <Link href="/contact">{t('bookSession')}</Link>
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="h-4 w-4" />
        </Button>
      </Container>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
