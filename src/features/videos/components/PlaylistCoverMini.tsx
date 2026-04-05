import Image from 'next/image';
import {isRenderableImageSrc} from '@/lib/images';

type PlaylistCoverMiniProps = {
  coverImage?: string | null;
  title: string;
  alt: string;
};

export function PlaylistCoverMini({coverImage, title, alt}: PlaylistCoverMiniProps) {
  const safeCoverImage = isRenderableImageSrc(coverImage) ? coverImage : null;

  return (
    <div className="mt-2">
      {safeCoverImage ? (
        <div className="h-9 w-36 overflow-hidden rounded-md border border-art-sage/50 bg-art-beige/30 shadow-sm">
          <Image
            src={safeCoverImage}
            alt={alt}
            width={144}
            height={36}
            sizes="(max-width: 640px) 112px, 144px"
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div
          className="h-9 w-36 rounded-md border border-art-sage/40 bg-gradient-to-r from-art-beige/40 to-art-cream/60 shadow-sm"
          role="img"
          aria-label={title}
        />
      )}
    </div>
  );
}