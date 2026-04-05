'use client';

import {useState} from 'react';
import Image from 'next/image';
import {cn} from '@/lib/utils';

type AboutImageProps = {
  className?: string;
  priority?: boolean;
  sizes?: string;
  alt: string;
};

export const aboutImage = '/images/about/aboutImage.jpg';
const aboutFallbackImage = '/images/about/about-placeholder.svg';

export function AboutImage({
  className,
  priority = true,
  sizes = '(max-width: 768px) 100vw, 50vw',
  alt
}: AboutImageProps) {
  const [src, setSrc] = useState(aboutImage);

  return (
    <div className={cn('relative overflow-hidden rounded-gentle border border-art-sage/40 bg-art-beige shadow-soft', className)}>
      <Image
        src={src}
        alt={alt}
        width={960}
        height={1200}
        priority={priority}
        sizes={sizes}
        className="h-auto w-full object-cover"
        onError={() => setSrc(aboutFallbackImage)}
      />
    </div>
  );
}
