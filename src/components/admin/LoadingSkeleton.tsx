import {Skeleton} from '@/components/ui/Skeleton';

type LoadingSkeletonProps = {
  type: 'table' | 'form' | 'card';
  count?: number;
};

export function LoadingSkeleton({type, count = 5}: LoadingSkeletonProps) {
  if (type === 'form') {
    return (
      <div className="space-y-4">
        {Array.from({length: count}).map((_, index) => (
          <Skeleton key={index} height="42px" />
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({length: count}).map((_, index) => (
          <Skeleton key={index} height="120px" className="rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Array.from({length: count}).map((_, index) => (
        <Skeleton key={index} height="48px" />
      ))}
    </div>
  );
}
