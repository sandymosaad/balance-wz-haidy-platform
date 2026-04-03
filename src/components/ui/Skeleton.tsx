import {cn} from '@/lib/utils';

type SkeletonProps = {
  width?: string;
  height?: string;
  className?: string;
};

export function Skeleton({width = '100%', height = '1rem', className}: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-gradient-to-r from-art-beige via-art-cream to-art-beige',
        className
      )}
      style={{width, height}}
      aria-hidden
    />
  );
}
