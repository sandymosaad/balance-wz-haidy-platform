import Image from 'next/image';
import {Button} from '@/components/ui/Button';
import {Container} from '@/components/ui/Container';
import {Heading} from '@/components/ui/Heading';
import {Text} from '@/components/ui/Text';
import {Link} from '@/i18n/navigation';
import type {CtaLink} from '@/types/components';

type HeroSectionProps = {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage?: string;
  cta: CtaLink[];
};

export function HeroSection({title, subtitle, description, backgroundImage, cta}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-art-cream to-art-beige/70 py-24 sm:py-28 lg:py-32">
      {backgroundImage ? (
        <Image src={backgroundImage} alt="" fill className="object-cover opacity-20" priority />
      ) : null}
      <Container className="relative z-10 text-center">
        <Text variant="caption" color="muted" as="div">{subtitle}</Text>
        <Heading level={1} alignment="center" className="mx-auto max-w-4xl">{title}</Heading>
        <Text className="mx-auto max-w-2xl">{description}</Text>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {cta.map((item) => (
            <Button key={item.href + item.label} variant={item.variant ?? 'primary'} asChild>
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </div>
      </Container>
    </section>
  );
}
